import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID, webcrypto } from 'node:crypto';
import prisma from '../db.js';
import { sendLoginEmail, sendRecoveryRequestEmail, sendWelcomeEmail } from '../mailer.js';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../middleware/auth.js';
import {
  assessLoginRisk,
  createSecurityEvent,
  getClientIp,
  normalizeUserAgent,
  reportSuspiciousLogin
} from '../security.js';
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse
} from '@simplewebauthn/server';

const router = express.Router();

const normalizeIdentifier = (value) => (value || '').trim().toLowerCase();
const normalizeName = (value) => (value || '').trim();

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

const rpName = process.env.WEBAUTHN_RP_NAME || 'Dominoyar';
const rpID = process.env.WEBAUTHN_RP_ID || 'dominoyar.ir';
const rpOrigin = process.env.WEBAUTHN_ORIGIN || 'https://dominoyar.ir';
const challengeTtlMs = 5 * 60 * 1000;

const encodeBase64Url = (buffer) => Buffer.from(buffer).toString('base64url');
const decodeBase64Url = (value) => Buffer.from(value, 'base64url');

const IMMORTAL_EMAIL = normalizeIdentifier(process.env.IMMORTAL_EMAIL || 'moroshaniofficil@gmail.com');
const IMMORTAL_USERNAME = normalizeIdentifier(process.env.IMMORTAL_USERNAME || 'moroshaniofficil');

const isImmortalUser = (user) => (
  normalizeIdentifier(user?.email) === IMMORTAL_EMAIL
  || normalizeIdentifier(user?.username) === IMMORTAL_USERNAME
);

const toUserResponse = (user) => ({
  id: user.id,
  name: user.name,
  username: user.username,
  email: user.email,
  avatar: user.avatar || null,
  role: user.role,
  createdAt: user.createdAt,
  isImmortal: isImmortalUser(user)
});

const SESSION_TTL_REMEMBER_MS = 1000 * 60 * 60 * 24 * 30;
const SESSION_TTL_DEFAULT_MS = 1000 * 60 * 60 * 24 * 7;
const RECOVERY_THROTTLE_MS = 1000 * 60 * 30;

const signToken = ({ userId, sessionId, tokenId, rememberMe }) => jwt.sign(
  {
    sub: userId,
    sid: sessionId,
    jti: tokenId,
    rm: rememberMe ? 1 : 0
  },
  process.env.JWT_SECRET,
  { expiresIn: rememberMe ? '30d' : '7d' }
);

const recoveryReasonCodes = new Set([
  'forgot_password',
  'lost_device',
  'suspicious_activity',
  'account_locked',
  'other'
]);

const deriveDeviceLabel = (uaValue) => {
  const ua = String(uaValue || '').toLowerCase();
  if (!ua) return 'دستگاه جدید';
  if (ua.includes('android')) return 'موبایل اندروید';
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ios')) return 'موبایل iOS';
  if (ua.includes('windows')) return 'ویندوز';
  if (ua.includes('mac os') || ua.includes('macintosh')) return 'مک';
  if (ua.includes('linux')) return 'لینوکس';
  return 'دستگاه دیگر';
};

const createSession = async ({ userId, rememberMe, req }) => {
  const now = Date.now();
  const expiresAt = new Date(now + (rememberMe ? SESSION_TTL_REMEMBER_MS : SESSION_TTL_DEFAULT_MS));
  const userAgent = normalizeUserAgent(req.get('user-agent'));
  return prisma.session.create({
    data: {
      userId,
      tokenId: randomUUID(),
      ipAddress: getClientIp(req),
      userAgent,
      deviceLabel: deriveDeviceLabel(userAgent),
      expiresAt,
      lastSeenAt: new Date(now)
    }
  });
};

const loginAttemptStore = new Map();
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_LOCK_MS = 10 * 60 * 1000;

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'تعداد درخواست‌ها زیاد است. لطفاً چند دقیقه دیگر تلاش کنید.' }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'تعداد تلاش‌های ورود زیاد است. لطفاً کمی بعد دوباره امتحان کنید.' }
});

const recoveryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'تعداد درخواست‌های بازیابی زیاد است. لطفاً بعداً دوباره تلاش کنید.' }
});

const loginAttemptKey = (req, identifier) => `${req.ip}:${identifier || 'unknown'}`;

const getLoginAttempt = (key) => {
  const entry = loginAttemptStore.get(key);
  if (!entry) return null;
  if (entry.lockedUntil && entry.lockedUntil > Date.now()) return entry;
  if (entry.firstAttempt + LOGIN_WINDOW_MS < Date.now()) {
    loginAttemptStore.delete(key);
    return null;
  }
  return entry;
};

const registerLoginFailure = (key) => {
  const now = Date.now();
  const entry = loginAttemptStore.get(key);
  if (!entry) {
    loginAttemptStore.set(key, { count: 1, firstAttempt: now, lockedUntil: null });
    return;
  }
  if (entry.firstAttempt + LOGIN_WINDOW_MS < now) {
    loginAttemptStore.set(key, { count: 1, firstAttempt: now, lockedUntil: null });
    return;
  }
  const nextCount = entry.count + 1;
  const lockedUntil = nextCount >= LOGIN_MAX_ATTEMPTS ? now + LOGIN_LOCK_MS : null;
  loginAttemptStore.set(key, { count: nextCount, firstAttempt: entry.firstAttempt, lockedUntil });
};

const resetLoginAttempts = (key) => {
  loginAttemptStore.delete(key);
};

const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

const createPasskeyChallenge = async ({ userId = null, identifier = null, flow, challenge }) => {
  await prisma.passkeyChallenge.create({
    data: {
      userId,
      identifier,
      flow,
      challenge,
      expiresAt: new Date(Date.now() + challengeTtlMs)
    }
  });
};

const consumePasskeyChallenge = async ({ userId = null, identifier = null, flow }) => {
  const row = await prisma.passkeyChallenge.findFirst({
    where: {
      flow,
      userId,
      identifier,
      consumedAt: null,
      expiresAt: { gt: new Date() }
    },
    orderBy: { createdAt: 'desc' }
  });
  if (!row) return null;
  await prisma.passkeyChallenge.update({ where: { id: row.id }, data: { consumedAt: new Date() } });
  return row.challenge;
};

router.post('/passkey/register/options', requireAuth, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) return res.status(404).json({ message: 'کاربر یافت نشد.' });

  const existing = await prisma.passkey.findMany({ where: { userId: user.id } });
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: user.id,
    userName: user.username,
    userDisplayName: user.name,
    timeout: 60000,
    attestationType: 'none',
    authenticatorSelection: {
      residentKey: 'required',
      userVerification: 'preferred'
    },
    excludeCredentials: existing.map((item) => ({
      id: decodeBase64Url(item.credentialId),
      type: 'public-key'
    }))
  });

  await createPasskeyChallenge({ userId: user.id, flow: 'register', challenge: options.challenge });
  return res.json(options);
}));

router.post('/passkey/register/verify', requireAuth, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) return res.status(404).json({ message: 'کاربر یافت نشد.' });

  const expectedChallenge = await consumePasskeyChallenge({ userId: user.id, flow: 'register' });
  if (!expectedChallenge) return res.status(400).json({ message: 'چالش پاس‌کی معتبر نیست.' });

  const verification = await verifyRegistrationResponse({
    response: req.body,
    expectedChallenge,
    expectedOrigin: rpOrigin,
    expectedRPID: rpID,
    requireUserVerification: false
  });

  if (!verification.verified || !verification.registrationInfo) {
    return res.status(400).json({ message: 'ثبت پاس‌کی تایید نشد.' });
  }

  const { credential } = verification.registrationInfo;
  await prisma.passkey.upsert({
    where: { credentialId: encodeBase64Url(credential.id) },
    update: {
      publicKey: Buffer.from(credential.publicKey),
      counter: credential.counter,
      lastUsedAt: new Date(),
      transportsJson: req.body?.response?.transports || null,
      deviceType: credential.credentialDeviceType,
      backedUp: credential.credentialBackedUp
    },
    create: {
      userId: user.id,
      credentialId: encodeBase64Url(credential.id),
      publicKey: Buffer.from(credential.publicKey),
      counter: credential.counter,
      transportsJson: req.body?.response?.transports || null,
      deviceType: credential.credentialDeviceType,
      backedUp: credential.credentialBackedUp
    }
  });

  await createSecurityEvent({
    userId: user.id,
    sessionId: req.sessionId,
    type: 'passkey_registered',
    severity: 'info',
    ipAddress: getClientIp(req),
    userAgent: normalizeUserAgent(req.get('user-agent'))
  });

  return res.json({ ok: true });
}));

router.post('/passkey/login/options', authLimiter, asyncHandler(async (req, res) => {
  const { identifier } = req.body || {};
  const normalizedIdentifier = normalizeIdentifier(identifier);
  if (!normalizedIdentifier) {
    return res.status(400).json({ message: 'شناسه کاربر لازم است.' });
  }

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: normalizedIdentifier }, { username: normalizedIdentifier }] }
  });
  if (!user) return res.status(404).json({ message: 'کاربر یافت نشد.' });

  const passkeys = await prisma.passkey.findMany({ where: { userId: user.id } });
  if (passkeys.length === 0) {
    return res.status(404).json({ message: 'پاس‌کی ثبت نشده است.' });
  }

  const options = await generateAuthenticationOptions({
    rpID,
    timeout: 60000,
    userVerification: 'preferred',
    allowCredentials: passkeys.map((item) => ({
      id: decodeBase64Url(item.credentialId),
      type: 'public-key'
    }))
  });

  await createPasskeyChallenge({ userId: user.id, identifier: normalizedIdentifier, flow: 'login', challenge: options.challenge });

  return res.json(options);
}));

router.post('/passkey/login/verify', authLimiter, asyncHandler(async (req, res) => {
  const { identifier, credential, rememberMe } = req.body || {};
  const normalizedIdentifier = normalizeIdentifier(identifier);
  if (!normalizedIdentifier || !credential) {
    return res.status(400).json({ message: 'اطلاعات پاس‌کی ناقص است.' });
  }

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: normalizedIdentifier }, { username: normalizedIdentifier }] }
  });
  if (!user) return res.status(401).json({ message: 'ورود پاس‌کی نامعتبر است.' });

  const expectedChallenge = await consumePasskeyChallenge({ userId: user.id, identifier: normalizedIdentifier, flow: 'login' });
  if (!expectedChallenge) {
    return res.status(400).json({ message: 'چالش ورود پاس‌کی معتبر نیست.' });
  }

  const credentialId = encodeBase64Url(decodeBase64Url(credential.id));
  const dbCredential = await prisma.passkey.findUnique({ where: { credentialId } });
  if (!dbCredential || dbCredential.userId !== user.id) {
    return res.status(401).json({ message: 'گواهی پاس‌کی معتبر نیست.' });
  }

  const verification = await verifyAuthenticationResponse({
    response: credential,
    expectedChallenge,
    expectedOrigin: rpOrigin,
    expectedRPID: rpID,
    credential: {
      id: decodeBase64Url(dbCredential.credentialId),
      publicKey: new Uint8Array(dbCredential.publicKey),
      counter: dbCredential.counter,
      transports: undefined
    },
    requireUserVerification: false
  });

  if (!verification.verified) {
    return res.status(401).json({ message: 'ورود پاس‌کی تایید نشد.' });
  }

  await prisma.passkey.update({
    where: { credentialId: dbCredential.credentialId },
    data: {
      counter: verification.authenticationInfo.newCounter,
      lastUsedAt: new Date()
    }
  });

  const remember = rememberMe !== false;
  const session = await createSession({ userId: user.id, rememberMe: remember, req });
  const token = signToken({ userId: user.id, sessionId: session.id, tokenId: session.tokenId, rememberMe: remember });

  await createSecurityEvent({
    userId: user.id,
    sessionId: session.id,
    type: 'passkey_login_success',
    severity: 'info',
    ipAddress: getClientIp(req),
    userAgent: normalizeUserAgent(req.get('user-agent')),
    details: { rememberMe: remember }
  });

  return res.json({ user: toUserResponse(user), token });
}));

router.post('/register', authLimiter, asyncHandler(async (req, res) => {
  const { name, username, email, password, rememberMe } = req.body || {};
  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'نام، نام کاربری، ایمیل و رمز عبور لازم است.' });
  }

  const normalizedEmail = normalizeIdentifier(email);
  const normalizedUsername = normalizeIdentifier(username);
  const displayName = normalizeName(name);
  if (!normalizedEmail || !normalizedUsername || !displayName) {
    return res.status(400).json({ message: 'اطلاعات ثبت‌نام ناقص است.' });
  }

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email: normalizedEmail }, { username: normalizedUsername }]
    }
  });
  if (existing) {
    return res.status(409).json({ message: 'ایمیل یا نام کاربری قبلاً ثبت شده است.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name: displayName, username: normalizedUsername, email: normalizedEmail, passwordHash }
  });

  const remember = rememberMe !== false;
  const session = await createSession({ userId: user.id, rememberMe: remember, req });
  const token = signToken({ userId: user.id, sessionId: session.id, tokenId: session.tokenId, rememberMe: remember });
  await createSecurityEvent({
    userId: user.id,
    sessionId: session.id,
    type: 'account_registered',
    severity: 'info',
    ipAddress: getClientIp(req),
    userAgent: normalizeUserAgent(req.get('user-agent')),
    details: { rememberMe: remember }
  });
  void sendWelcomeEmail({ email: user.email, name: user.name, username: user.username }).catch(() => {});
  return res.status(201).json({ user: toUserResponse(user), token });
}));

router.post('/login', loginLimiter, asyncHandler(async (req, res) => {
  const { identifier, password, rememberMe } = req.body || {};
  if (!identifier || !password) {
    return res.status(400).json({ message: 'ایمیل/نام کاربری و رمز عبور لازم است.' });
  }

  const normalizedIdentifier = normalizeIdentifier(identifier);
  const attemptKey = loginAttemptKey(req, normalizedIdentifier);
  const attempt = getLoginAttempt(attemptKey);
  if (attempt && attempt.lockedUntil && attempt.lockedUntil > Date.now()) {
    return res.status(429).json({ message: 'تلاش‌های ناموفق زیاد بوده است. لطفاً چند دقیقه دیگر تلاش کنید.' });
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: normalizedIdentifier }, { username: normalizedIdentifier }]
    }
  });
  if (!user || !user.passwordHash) {
    registerLoginFailure(attemptKey);
    return res.status(401).json({ message: 'نام کاربری یا رمز عبور نامعتبر است.' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    registerLoginFailure(attemptKey);
    await createSecurityEvent({
      userId: user.id,
      type: 'login_failed',
      severity: 'medium',
      ipAddress: getClientIp(req),
      userAgent: normalizeUserAgent(req.get('user-agent')),
      details: { reason: 'invalid_password' }
    });
    return res.status(401).json({ message: 'نام کاربری یا رمز عبور نامعتبر است.' });
  }

  const risk = await assessLoginRisk({
    userId: user.id,
    ipAddress: getClientIp(req),
    userAgent: normalizeUserAgent(req.get('user-agent'))
  });
  const remember = rememberMe !== false;
  const session = await createSession({ userId: user.id, rememberMe: remember, req });
  const token = signToken({ userId: user.id, sessionId: session.id, tokenId: session.tokenId, rememberMe: remember });
  await createSecurityEvent({
    userId: user.id,
    sessionId: session.id,
    type: 'login_success',
    severity: risk.isSuspicious ? 'medium' : 'info',
    ipAddress: getClientIp(req),
    userAgent: normalizeUserAgent(req.get('user-agent')),
    details: { rememberMe: remember, riskScore: risk.score, riskReasons: risk.reasons }
  });
  await reportSuspiciousLogin({ user, sessionId: session.id, req, risk });

  resetLoginAttempts(attemptKey);
  void sendLoginEmail({ email: user.email, name: user.name }).catch(() => {});
  return res.json({
    user: toUserResponse(user),
    token,
    security: risk.isSuspicious
      ? { suspiciousLogin: true, riskScore: risk.score, riskReasons: risk.reasons }
      : { suspiciousLogin: false, riskScore: risk.score, riskReasons: [] }
  });
}));

router.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) {
    return res.status(401).json({ message: 'کاربر یافت نشد.' });
  }

  return res.json({ user: toUserResponse(user) });
}));

router.post('/logout', requireAuth, asyncHandler(async (req, res) => {
  await prisma.session.updateMany({
    where: {
      id: req.sessionId,
      userId: req.userId,
      revokedAt: null
    },
    data: { revokedAt: new Date() }
  });
  await createSecurityEvent({
    userId: req.userId,
    sessionId: req.sessionId,
    type: 'logout',
    severity: 'info',
    ipAddress: getClientIp(req),
    userAgent: normalizeUserAgent(req.get('user-agent'))
  });
  return res.status(204).end();
}));

router.post('/recovery/request', recoveryLimiter, asyncHandler(async (req, res) => {
  const { identifier, reasonCode, description, contactEmail } = req.body || {};
  const normalizedIdentifier = normalizeIdentifier(identifier);
  const normalizedReason = normalizeIdentifier(reasonCode);

  if (!normalizedIdentifier || !normalizedReason) {
    return res.status(400).json({ message: 'شناسه حساب و دلیل بازیابی لازم است.' });
  }
  if (!recoveryReasonCodes.has(normalizedReason)) {
    return res.status(400).json({ message: 'کد دلیل بازیابی معتبر نیست.' });
  }

  const since = new Date(Date.now() - RECOVERY_THROTTLE_MS);
  const recent = await prisma.recoveryRequest.findFirst({
    where: {
      identifier: normalizedIdentifier,
      createdAt: { gt: since }
    },
    select: { id: true }
  });
  if (recent) {
    return res.status(202).json({ message: 'درخواست بازیابی ثبت شد و در صف بررسی قرار گرفت.' });
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: normalizedIdentifier }, { username: normalizedIdentifier }]
    }
  });
  const ipAddress = getClientIp(req);
  const userAgent = normalizeUserAgent(req.get('user-agent'));

  await prisma.recoveryRequest.create({
    data: {
      userId: user?.id || null,
      identifier: normalizedIdentifier,
      reasonCode: normalizedReason,
      description: String(description || '').trim().slice(0, 500) || null,
      contactEmail: normalizeIdentifier(contactEmail || '') || null,
      ipAddress,
      userAgent
    }
  });

  if (user) {
    await createSecurityEvent({
      userId: user.id,
      type: 'account_recovery_requested',
      severity: 'medium',
      ipAddress,
      userAgent,
      details: {
        reasonCode: normalizedReason,
        contactEmail: normalizeIdentifier(contactEmail || '') || null
      }
    });
  }

  void sendRecoveryRequestEmail({
    identifier: normalizedIdentifier,
    reasonCode: normalizedReason,
    contactEmail: normalizeIdentifier(contactEmail || '') || null,
    description: String(description || '').trim().slice(0, 500) || null,
    requestedAt: new Date(),
    userName: user?.name || null
  }).catch(() => {});

  return res.status(202).json({ message: 'درخواست بازیابی ثبت شد و در صف بررسی قرار گرفت.' });
}));

export default router;
