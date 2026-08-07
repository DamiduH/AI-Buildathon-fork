import { applyCors } from '../../../lib/cors.js';
import { verifyOtpToken } from '../../../lib/otpToken.js';
import { findAlreadyRegistered } from '../../../lib/participantLookup.js';
import { checkRateLimit } from '../../../lib/rateLimit.js';
import { getClientIp } from '../../../lib/requestIp.js';
import { isSupabaseConfigured, supabaseAdmin, supabaseConfigError } from '../../../lib/supabaseAdmin.js';
import { validateRegistration } from '../../../lib/validateRegistration.js';

// Lets a team LEADER (proven by OTP on the leader inbox) replace their
// team's member list. The leader's own details and the team name are
// deliberately NOT editable here - only the other members are.

const RATE_LIMIT = { max: 10, windowMs: 10 * 60 * 1000 };

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const clientIp = getClientIp(req);
  const rate = checkRateLimit(`registration-update:${clientIp}`, RATE_LIMIT.max, RATE_LIMIT.windowMs);
  if (rate.limited) {
    res.setHeader('Retry-After', String(rate.retryAfterSeconds));
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { email, otp, otpToken, members } = req.body || {};
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  const otpResult = verifyOtpToken(otpToken, cleanEmail, otp);
  if (!otpResult.valid) {
    return res.status(400).json({ error: otpResult.error });
  }

  if (!isSupabaseConfigured) {
    console.error(`[api/registrations/update] Supabase is not configured: ${supabaseConfigError}`);
    return res.status(503).json({ error: 'This service is not available right now. Please try again later.' });
  }

  const { data: row, error: lookupError } = await supabaseAdmin
    .from('registrations')
    .select('id, team_name, full_name, student_email, student_id, faculty, department, year_of_study')
    .eq('student_email', cleanEmail)
    .maybeSingle();

  if (lookupError) {
    console.error('[api/registrations/update] lookup failed:', lookupError.message);
    return res.status(500).json({ error: 'Could not load your registration. Please try again.' });
  }
  if (!row) {
    return res.status(404).json({ error: 'No registration found with this email as team leader.' });
  }

  // Reuse the exact registration validation rules by rebuilding the full
  // payload: stored leader + team fields (not editable here) + the new
  // members. This also enforces max team size 3 and no duplicate people
  // within the team (including the leader re-added as a member).
  const memberList = Array.isArray(members) ? members : [];
  const { valid, data, error: validationError } = validateRegistration({
    full_name: row.full_name,
    email: row.student_email,
    student_id: row.student_id,
    faculty: row.faculty,
    department: row.department,
    year_of_study: row.year_of_study,
    team_name: row.team_name,
    team_size: memberList.length + 1,
    members: memberList,
    tools_interested: []
  });
  if (!valid) {
    return res.status(400).json({ error: validationError });
  }

  try {
    // New members must not already belong to ANOTHER team - this team's own
    // current roster is excluded so unchanged members don't trip the check.
    const conflict = await findAlreadyRegistered(
      data.members.map((m) => ({ email: m.email, studentId: m.student_id, label: m.name })),
      { excludeRegistrationId: row.id }
    );
    if (conflict) {
      return res.status(409).json({
        error: `${conflict.label} is already registered with team "${conflict.teamName}" (matched by ${conflict.matchedBy}). Each person can only be part of one team.`
      });
    }

    const { error: updateError } = await supabaseAdmin
      .from('registrations')
      .update({ members: data.members, team_size: data.team_size })
      .eq('id', row.id);

    if (updateError) {
      console.error('[api/registrations/update] update failed:', updateError.message);
      return res.status(500).json({ error: 'Could not save your changes. Please try again.' });
    }

    return res.status(200).json({
      message: 'Team details updated successfully.',
      registration: {
        team_name: row.team_name,
        team_size: data.team_size,
        members: data.members
      }
    });
  } catch (err) {
    console.error('[api/registrations/update] unexpected error:', err);
    return res.status(500).json({ error: 'An unexpected error occurred while saving your changes.' });
  }
}
