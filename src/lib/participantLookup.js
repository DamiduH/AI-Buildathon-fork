import { supabaseAdmin } from './supabaseAdmin.js';

const norm = (value) => String(value || '').trim().toLowerCase();

/**
 * One person = one team. Checks whether any of the given people already
 * appear in an existing registration, either as the team leader or inside
 * the members list, matching by email OR student ID.
 *
 * Registrations are expected to number in the hundreds for this event, so
 * scanning them in one query and matching in memory is simpler and just as
 * fast as trying to express a JSONB-array match in PostgREST filters.
 *
 * @param {Array<{ email?: string, studentId?: string, label: string }>} people
 * @returns {Promise<{ label: string, teamName: string, matchedBy: string } | null>}
 */
export async function findAlreadyRegistered(people) {
  const { data, error } = await supabaseAdmin
    .from('registrations')
    .select('team_name, student_email, student_id, members');

  if (error) {
    throw new Error(`Could not check existing registrations: ${error.message}`);
  }

  const emailToTeam = new Map();
  const studentIdToTeam = new Map();

  for (const row of data || []) {
    if (row.student_email) emailToTeam.set(norm(row.student_email), row.team_name);
    if (row.student_id) studentIdToTeam.set(norm(row.student_id), row.team_name);
    for (const member of Array.isArray(row.members) ? row.members : []) {
      if (member?.email) emailToTeam.set(norm(member.email), row.team_name);
      if (member?.student_id) studentIdToTeam.set(norm(member.student_id), row.team_name);
    }
  }

  for (const person of people) {
    const email = norm(person.email);
    const studentId = norm(person.studentId);
    if (email && emailToTeam.has(email)) {
      return { label: person.label, teamName: emailToTeam.get(email), matchedBy: 'email' };
    }
    if (studentId && studentIdToTeam.has(studentId)) {
      return { label: person.label, teamName: studentIdToTeam.get(studentId), matchedBy: 'student ID' };
    }
  }

  return null;
}
