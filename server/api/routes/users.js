import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../db.js';
import { createSecurityEvent, getClientIp, normalizeUserAgent } from '../security.js';

const router = express.Router();
const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

const normalizeName = (value) => (value || '').trim();
const normalizeIdentifier = (value) => (value || '').trim().toLowerCase();

const IMMORTAL_EMAIL = normalizeIdentifier(process.env.IMMORTAL_EMAIL || 'moroshaniofficil@gmail.com');
const IMMORTAL_USERNAME = normalizeIdentifier(process.env.IMMORTAL_USERNAME || 'moroshaniofficil');

const isImmortalUser = (user) => {
  if (!user) return false;
  const email = normalizeIdentifier(user.email);
  const username = normalizeIdentifier(user.username);
  return email === IMMORTAL_EMAIL || username === IMMORTAL_USERNAME;
};

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

const toPasskeyResponse = (passkey) => ({
  id: passkey.id,
  createdAt: passkey.createdAt,
  lastUsedAt: passkey.lastUsedAt,
  deviceType: passkey.deviceType || null,
  backedUp: passkey.backedUp === null ? null : Boolean(passkey.backedUp)
});

router.get('/me', asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) {
    return res.status(404).json({ message: 'کاربر یافت نشد.' });
  }
  return res.json({ user: toUserResponse(user) });
}));

router.get('/me/passkeys', asyncHandler(async (req, res) => {
  const passkeys = await prisma.passkey.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' }
  });
  return res.json({ passkeys: passkeys.map(toPasskeyResponse) });
}));

router.delete('/me/passkeys/:passkeyId', asyncHandler(async (req, res) => {
  const passkeyId = String(req.params.passkeyId || '').trim();
  if (!passkeyId) {
    return res.status(400).json({ message: 'شناسه پاس‌کی لازم است.' });
  }

  const passkey = await prisma.passkey.findUnique({ where: { id: passkeyId } });
  if (!passkey || passkey.userId !== req.userId) {
    return res.status(404).json({ message: 'پاس‌کی یافت نشد.' });
  }

  await prisma.passkey.delete({ where: { id: passkeyId } });
  await createSecurityEvent({
    userId: req.userId,
    sessionId: req.sessionId,
    type: 'passkey_removed',
    severity: 'medium',
    ipAddress: getClientIp(req),
    userAgent: normalizeUserAgent(req.get('user-agent')),
    details: {
      passkeyId: passkey.id,
      deviceType: passkey.deviceType || null
    }
  });

  return res.json({ ok: true });
}));

router.patch('/me', asyncHandler(async (req, res) => {
  const { name, username, email } = req.body || {};
  const normalizedName = normalizeName(name);
  const normalizedUsername = normalizeIdentifier(username);
  const normalizedEmail = normalizeIdentifier(email);

  if (!normalizedName || !normalizedUsername || !normalizedEmail) {
    return res.status(400).json({ message: 'نام، نام کاربری و ایمیل لازم است.' });
  }

  const currentUser = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!currentUser) {
    return res.status(404).json({ message: 'کاربر یافت نشد.' });
  }

  if (isImmortalUser(currentUser)) {
    if (normalizedEmail !== IMMORTAL_EMAIL || normalizedUsername !== IMMORTAL_USERNAME) {
      return res.status(403).json({ message: 'ایمیل و نام کاربری حساب اصلی قابل تغییر نیست.' });
    }
  }

  const existing = await prisma.user.findFirst({
    where: {
      id: { not: req.userId },
      OR: [{ username: normalizedUsername }, { email: normalizedEmail }]
    }
  });
  if (existing) {
    return res.status(409).json({ message: 'ایمیل یا نام کاربری قبلاً ثبت شده است.' });
  }

  const updated = await prisma.user.update({
    where: { id: req.userId },
    data: {
      name: normalizedName,
      username: normalizedUsername,
      email: normalizedEmail
    }
  });

  await createSecurityEvent({
    userId: req.userId,
    sessionId: req.sessionId,
    type: 'profile_updated',
    severity: 'info',
    ipAddress: getClientIp(req),
    userAgent: normalizeUserAgent(req.get('user-agent')),
    details: {
      nameChanged: currentUser.name !== normalizedName,
      usernameChanged: currentUser.username !== normalizedUsername,
      emailChanged: currentUser.email !== normalizedEmail
    }
  });

  return res.json({ user: toUserResponse(updated) });
}));

router.patch('/me/password', asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'رمز فعلی و رمز جدید لازم است.' });
  }
  if (String(newPassword).length < 8) {
    return res.status(400).json({ message: 'رمز جدید باید حداقل ۸ کاراکتر باشد.' });
  }

  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) {
    return res.status(404).json({ message: 'کاربر یافت نشد.' });
  }

  const valid = await bcrypt.compare(String(currentPassword), user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'رمز فعلی نادرست است.' });
  }

  const passwordHash = await bcrypt.hash(String(newPassword), 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash }
  });

  await prisma.session.updateMany({
    where: {
      userId: req.userId,
      id: { not: req.sessionId },
      revokedAt: null
    },
    data: { revokedAt: new Date() }
  });

  await createSecurityEvent({
    userId: req.userId,
    sessionId: req.sessionId,
    type: 'password_changed',
    severity: 'medium',
    ipAddress: getClientIp(req),
    userAgent: normalizeUserAgent(req.get('user-agent'))
  });

  return res.json({ ok: true });
}));

export default router;
