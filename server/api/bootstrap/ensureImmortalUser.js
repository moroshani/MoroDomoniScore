import bcrypt from 'bcryptjs';
import prisma from '../db.js';

const normalizeIdentifier = (value) => (value || '').trim().toLowerCase();
const normalizeName = (value) => (value || '').trim();
const IMMORTAL_PASSWORD_PLACEHOLDER = 'replace-with-strong-immortal-password';

export const IMMORTAL_USER = {
  name: normalizeName(process.env.IMMORTAL_NAME || 'Moroshani Admin'),
  username: normalizeIdentifier(process.env.IMMORTAL_USERNAME || 'moroshaniofficil'),
  email: normalizeIdentifier(process.env.IMMORTAL_EMAIL || 'moroshaniofficil@gmail.com'),
  password: String(process.env.IMMORTAL_PASSWORD || IMMORTAL_PASSWORD_PLACEHOLDER)
};

export const ensureImmortalUser = async () => {
  if (!IMMORTAL_USER.username || !IMMORTAL_USER.email || !IMMORTAL_USER.password) {
    console.warn('Immortal user config is incomplete; skipping bootstrap.');
    return;
  }
  if (IMMORTAL_USER.password === IMMORTAL_PASSWORD_PLACEHOLDER) {
    console.warn('IMMORTAL_PASSWORD placeholder is still set; skipping immortal bootstrap until configured.');
    return;
  }

  const byEmail = await prisma.user.findUnique({ where: { email: IMMORTAL_USER.email } });
  const byUsername = await prisma.user.findUnique({ where: { username: IMMORTAL_USER.username } });

  if (byEmail && byUsername && byEmail.id !== byUsername.id) {
    console.error('Immortal user conflict: email and username belong to different accounts. Manual fix required.');
    return;
  }

  const targetUser = byEmail || byUsername;
  const passwordHash = await bcrypt.hash(IMMORTAL_USER.password, 10);

  if (targetUser) {
    await prisma.user.update({
      where: { id: targetUser.id },
      data: {
        name: IMMORTAL_USER.name,
        username: IMMORTAL_USER.username,
        email: IMMORTAL_USER.email,
        role: 'superadmin',
        passwordHash
      }
    });
    return;
  }

  await prisma.user.create({
    data: {
      name: IMMORTAL_USER.name,
      username: IMMORTAL_USER.username,
      email: IMMORTAL_USER.email,
      role: 'superadmin',
      passwordHash
    }
  });
};
