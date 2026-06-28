import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM || smtpUser;
const useLocalRelay = smtpHost === '127.0.0.1' || smtpHost === 'localhost';

const transport = smtpHost
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      ...(useLocalRelay ? { ignoreTLS: true } : {}),
      ...(smtpUser && smtpPass
        ? {
            auth: {
              user: smtpUser,
              pass: smtpPass
            }
          }
        : {})
    })
  : null;

const canSend = () => !!transport && !!smtpFrom;

const sendMail = async (message) => {
  if (!canSend()) {
    return;
  }
  await transport.sendMail({
    from: smtpFrom,
    ...message
  });
};

export const sendWelcomeEmail = async ({ email, name, username }) => {
  const subject = 'به دومینویار خوش آمدید';
  const text = `سلام ${name},\n\nثبت‌نام شما با نام کاربری ${username} انجام شد.\n\nاگر این ثبت‌نام توسط شما انجام نشده، به ما اطلاع دهید.`;
  await sendMail({ to: email, subject, text });
};

export const sendLoginEmail = async ({ email, name }) => {
  const subject = 'ورود موفق به دومینویار';
  const text = `سلام ${name},\n\nورود شما با موفقیت انجام شد. اگر این ورود توسط شما نبوده است، سریعاً رمز عبور خود را تغییر دهید.`;
  await sendMail({ to: email, subject, text });
};

export const sendSecurityAlertEmail = async ({ email, name, ipAddress, userAgent, reasons, score }) => {
  const subject = 'هشدار امنیتی حساب';
  const reasonText = Array.isArray(reasons) && reasons.length > 0 ? reasons.join(', ') : 'نامشخص';
  const text = [
    `سلام ${name},`,
    '',
    'یک ورود مشکوک در حساب شما ثبت شد.',
    `امتیاز ریسک: ${score}`,
    `دلایل: ${reasonText}`,
    `IP: ${ipAddress || 'نامشخص'}`,
    `مرورگر/دستگاه: ${userAgent || 'نامشخص'}`,
    '',
    'اگر این ورود متعلق به شما نیست، فوراً رمز عبور را تغییر دهید و نشست‌های فعال را ببندید.'
  ].join('\n');
  await sendMail({ to: email, subject, text });
};

export const sendRecoveryRequestEmail = async ({ email, name, reasonCode }) => {
  const subject = 'ثبت درخواست بازیابی حساب';
  const text = [
    `سلام ${name},`,
    '',
    'برای حساب شما یک درخواست بازیابی ثبت شده است.',
    `کد علت: ${reasonCode}`,
    '',
    'اگر این درخواست را شما ارسال نکرده‌اید، رمز عبور خود را تغییر دهید.'
  ].join('\n');
  await sendMail({ to: email, subject, text });
};
