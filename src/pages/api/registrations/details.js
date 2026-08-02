import { applyCors } from '../../../lib/cors.js';
import { verifyOtpToken } from '../../../lib/otpToken.js';
import { checkRateLimit } from '../../../lib/rateLimit.js';
import { getClientIp } from '../../../lib/requestIp.js';
import { isSupabaseConfigured, supabaseAdmin, supabaseConfigError } from '../../../lib/supabaseAdmin.js';

// Returns a team's saved registration to its LEADER, who must prove control
// of the leader inbox with a fresh OTP (same token used for the subsequent
// update call). Never exposes data without that proof.

const RATE_LIMIT = { max: 10, windowMs: 10 * 60 * 1000 };

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const clientIp = getClientIp(req);
  const rate = checkRateLimit(`registration-details:${clientIp}`, RATE_LIMIT.max, RATE_LIMIT.windowMs);
  if (rate.limited) {
    res.setHeader('Retry-After', String(rate.retryAfterSeconds));
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { email, otp, otpToken } = req.body || {};
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  const otpResult = verifyOtpToken(otpToken, cleanEmail, otp);
  if (!otpResult.valid) {
    return res.status(400).json({ error: otpResult.error });
  }

  if (!isSupabaseConfigured) {
    console.error(`[api/registrations/details] Supabase is not configured: ${supabaseConfigError}`);
    return res.status(503).json({ error: 'This service is not available right now. Please try again later.' });
  }

  const { data: row, error } = await supabaseAdmin
    .from('registrations')
    .select('team_name, team_size, full_name, student_email, student_id, faculty, department, year_of_study, members')
    .eq('student_email', cleanEmail)
    .maybeSingle();

  if (error) {
    console.error('[api/registrations/details] lookup failed:', error.message);
    return res.status(500).json({ error: 'Could not load your registration. Please try again.' });
  }
  if (!row) {
    return res.status(404).json({
      error: 'No registration found with this email as team leader.'
    });
  }

  return res.status(200).json({ registration: row });
}
