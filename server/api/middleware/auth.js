import jwt from 'jsonwebtoken';
import prisma from '../db.js';

const getBearerToken = (authHeader = '') => (
  authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
);

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = getBearerToken(authHeader);
  if (!token) {
    return res.status(401).json({ message: 'توکن نامعتبر است.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload?.sub || !payload?.sid || !payload?.jti) {
      return res.status(401).json({ message: 'توکن معتبر نیست.' });
    }

    const now = new Date();
    const session = await prisma.session.findFirst({
      where: {
        id: payload.sid,
        tokenId: payload.jti,
        userId: payload.sub,
        revokedAt: null,
        expiresAt: { gt: now }
      },
      select: { id: true }
    });
    if (!session) {
      return res.status(401).json({ message: 'جلسه منقضی شده یا معتبر نیست.' });
    }

    req.userId = payload.sub;
    req.sessionId = payload.sid;
    req.tokenId = payload.jti;
    // Non-blocking touch to keep last activity visible.
    void prisma.session.update({
      where: { id: payload.sid },
      data: { lastSeenAt: now }
    }).catch(() => {});
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'توکن معتبر نیست.' });
  }
};
