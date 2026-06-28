import express from 'express';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import { requireAuth } from './middleware/auth.js';
import { ensureImmortalUser } from './bootstrap/ensureImmortalUser.js';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
const port = process.env.API_PORT ? Number(process.env.API_PORT) : 4000;
const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const allowedOrigins = new Set([
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
  'https://dominoyar.ir',
  'https://www.dominoyar.ir',
  ...configuredOrigins
]);

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET is not set. Auth will fail until it is configured.');
}

app.use((req, res, next) => {
  const forwardedProto = String(req.headers['x-forwarded-proto'] || '').toLowerCase();
  const isHttps = req.secure || forwardedProto.includes('https');

  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self';"
  );
  res.setHeader('Cache-Control', 'no-store');
  if (isHttps) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  const fetchSite = String(req.headers['sec-fetch-site'] || '').toLowerCase();
  if (fetchSite && fetchSite !== 'same-origin' && fetchSite !== 'same-site' && req.method !== 'OPTIONS') {
    res.setHeader('Vary', 'Sec-Fetch-Site');
  }
  next();
});

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }
    callback(null, false);
  },
  credentials: true
}));
app.use(express.json({ limit: '5mb' }));
app.use(compression({ threshold: 1024 }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/users', requireAuth, usersRouter);

app.use((error, _req, res, _next) => {
  const status = Number(error.status || error.statusCode || 500);
  const safeStatus = status >= 400 && status < 500 ? status : 500;

  if (safeStatus >= 500) {
    console.error('API error', error);
  }

  const message =
    safeStatus >= 500
      ? 'خطای سرور'
      : error.type === 'entity.parse.failed'
        ? 'درخواست نامعتبر است.'
        : error.message || 'درخواست نامعتبر است.';

  res.status(safeStatus).json({ message });
});

const start = async () => {
  try {
    await ensureImmortalUser();
  } catch (error) {
    console.error('Immortal user bootstrap failed', error);
  }

  app.listen(port, () => {
    console.log(`API server listening on http://localhost:${port}`);
  });
};

void start();
