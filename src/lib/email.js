import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

// Sender identity - must be a verified domain in the Resend dashboard.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'AI Buildathon <no-reply@mail.imssa.lk>';

let resendClient = null;
function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

export const isEmailConfigured = () => Boolean(process.env.RESEND_API_KEY);

// Templates live as plain .html files in src/ so designers can edit them
// without touching JS. Cached after first read (warm serverless instances).
const templateCache = new Map();
function loadTemplate(filename) {
  if (!templateCache.has(filename)) {
    const filePath = path.join(process.cwd(), 'src', filename);
    templateCache.set(filename, fs.readFileSync(filePath, 'utf8'));
  }
  return templateCache.get(filename);
}

/** Replaces {{variable}} placeholders; unknown placeholders are left as-is. */
function renderTemplate(html, vars) {
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : match
  );
}

async function send({ to, subject, html }) {
  const resend = getResend();
  if (!resend) {
    throw new Error('Email service is not configured (missing RESEND_API_KEY).');
  }
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html
  });
  if (error) {
    throw new Error(error.message || 'Failed to send email.');
  }
  return data;
}

/** OTP verification email to the team leader. */
export function sendOtpEmail({ to, fullName, otp, expiryMinutes }) {
  const html = renderTemplate(loadTemplate('otp-verification-email.html'), {
    full_name: fullName,
    otp_code: otp,
    expiry_minutes: expiryMinutes
  });
  return send({
    to,
    subject: 'Your AI Buildathon verification code',
    html
  });
}

/**
 * Post-registration welcome email. Sent to the team leader with every other
 * team member in the same delivery, so the whole team gets it.
 */
export function sendWelcomeEmail({ to, fullName, teamName, teamSize }) {
  const html = renderTemplate(loadTemplate('welcome-email.html'), {
    full_name: fullName,
    team_name: teamName,
    team_size: teamSize
  });
  return send({
    to,
    subject: `Welcome to AI Buildathon, Team ${teamName}!`,
    html
  });
}
