import { createHash } from 'node:crypto';
import prisma from './db.js';
import { sendSecurityAlertEmail } from './mailer.js';

const SUSPICIOUS_LOGIN_SCORE_THRESHOLD = Number(process.env.SUSPICIOUS_LOGIN_SCORE_THRESHOLD || 60);

export const normalizeIdentifier = (value) => (value || '').trim().toLowerCase();

export const normalizeUserAgent = (value) => {
  const normalized = String(value || '').trim();
  if (!normalized) return null;
  return normalized.slice(0, 512);
};

export const getClientIp = (req) => {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || req.ip || null;
};

const buildFingerprint = ({ ipAddress, userAgent }) => {
  const payload = `${ipAddress || '-'}|${normalizeUserAgent(userAgent) || '-'}`;
  return createHash('sha256').update(payload).digest('hex').slice(0, 24);
};

const unique = (items) => Array.from(new Set(items.filter(Boolean)));

const severityFromScore = (score) => {
  if (score >= 70) return 'high';
  if (score >= 45) return 'medium';
  return 'low';
};

export const assessLoginRisk = async ({ userId, ipAddress, userAgent }) => {
  const normalizedUa = normalizeUserAgent(userAgent);
  const fingerprint = buildFingerprint({ ipAddress, userAgent: normalizedUa });
  const recentSessions = await prisma.session.findMany({
    where: {
      userId,
      revokedAt: null,
      expiresAt: { gt: new Date() }
    },
    orderBy: [{ lastSeenAt: 'desc' }],
    take: 20,
    select: {
      id: true,
      ipAddress: true,
      userAgent: true,
      isTrusted: true,
      createdAt: true,
      lastSeenAt: true
    }
  });

  if (recentSessions.length === 0) {
    return {
      score: 0,
      severity: 'low',
      reasons: [],
      fingerprint,
      isSuspicious: false
    };
  }

  const knownIps = unique(recentSessions.map((item) => item.ipAddress));
  const knownUas = unique(recentSessions.map((item) => normalizeUserAgent(item.userAgent)));
  const trustedMatches = recentSessions.filter((item) => item.isTrusted)
    .some((item) => item.ipAddress === ipAddress && normalizeUserAgent(item.userAgent) === normalizedUa);

  let score = 0;
  const reasons = [];

  if (ipAddress && !knownIps.includes(ipAddress)) {
    score += 35;
    reasons.push('new_ip');
  }

  if (normalizedUa && !knownUas.includes(normalizedUa)) {
    score += 30;
    reasons.push('new_device');
  }

  const lastSession = recentSessions[0];
  const lastSeenMs = new Date(lastSession.lastSeenAt).getTime();
  const recentWindowMs = 2 * 60 * 60 * 1000;
  if (
    Date.now() - lastSeenMs < recentWindowMs
    && ipAddress
    && normalizedUa
    && (lastSession.ipAddress !== ipAddress || normalizeUserAgent(lastSession.userAgent) !== normalizedUa)
  ) {
    score += 20;
    reasons.push('rapid_fingerprint_shift');
  }

  if (!trustedMatches && score >= 45) {
    score += 10;
    reasons.push('untrusted_context');
  }

  const severity = severityFromScore(score);
  return {
    score,
    severity,
    reasons,
    fingerprint,
    isSuspicious: score >= SUSPICIOUS_LOGIN_SCORE_THRESHOLD
  };
};

export const createSecurityEvent = async ({
  userId,
  sessionId = null,
  type,
  severity = 'info',
  ipAddress = null,
  userAgent = null,
  details = null
}) => prisma.securityEvent.create({
  data: {
    userId,
    sessionId,
    type,
    severity,
    ipAddress,
    userAgent: normalizeUserAgent(userAgent),
    details
  }
});

export const reportSuspiciousLogin = async ({ user, sessionId, req, risk }) => {
  if (!risk?.isSuspicious) return;

  const ipAddress = getClientIp(req);
  const ua = normalizeUserAgent(req.get('user-agent'));

  await createSecurityEvent({
    userId: user.id,
    sessionId,
    type: 'suspicious_login',
    severity: risk.severity,
    ipAddress,
    userAgent: ua,
    details: {
      score: risk.score,
      reasons: risk.reasons,
      fingerprint: risk.fingerprint
    }
  });

  await sendSecurityAlertEmail({
    email: user.email,
    name: user.name,
    ipAddress,
    userAgent: ua,
    reasons: risk.reasons,
    score: risk.score
  }).catch(() => {});
};
