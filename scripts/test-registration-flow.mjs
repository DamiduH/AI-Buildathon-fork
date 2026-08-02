// Temporary end-to-end check for the OTP test mode + duplicate-participant
// guard. Run with the dev server up (OTP_TEST_MODE=true), then delete this
// file. Cleans up everything it creates in Supabase.
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const BASE = 'http://localhost:3000/api';

// --- minimal .env parser (no dotenv dependency) ---
const env = {};
for (const line of fs.readFileSync(new URL('../.env', import.meta.url), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
}

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const LEADER_A = 'buildathon.test.leader.a@example.com';
const MEMBER_A = 'buildathon.test.member.a@example.com';
const LEADER_B = 'buildathon.test.leader.b@example.com';
const TEST_EMAILS = [LEADER_A, MEMBER_A, LEADER_B];

let failures = 0;
function check(name, cond, detail) {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${cond ? '' : ` -- ${detail}`}`);
  if (!cond) failures += 1;
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return { status: res.status, body: await res.json().catch(() => ({})) };
}

const basePayload = (email, name, sid, extra = {}) => ({
  full_name: name,
  email,
  student_id: sid,
  faculty: 'Faculty of Science',
  department: 'Test Department',
  year_of_study: '2nd Year',
  team_size: 1,
  members: [],
  tools_interested: [],
  company_website: '',
  ...extra
});

async function cleanup() {
  await supabase.from('registrations').delete().in('student_email', TEST_EMAILS);
  const { data } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  for (const u of data?.users || []) {
    if (TEST_EMAILS.includes(u.email)) await supabase.auth.admin.deleteUser(u.id);
  }
}

// start from a clean slate in case of a previous aborted run
await cleanup();

// 1) Test-mode OTP send: no captcha, no email, returns a token
const send1 = await post('/otp/send', { email: LEADER_A, full_name: 'Test Leader A' });
check('OTP send works in test mode without captcha', send1.status === 200 && !!send1.body.otpToken, JSON.stringify(send1));

// 2) Wrong code is rejected
const wrong = await post('/registrations', {
  ...basePayload(LEADER_A, 'Test Leader A', 'TEST/0001/A'),
  otp: '123456',
  otpToken: send1.body.otpToken
});
check('Wrong OTP rejected', wrong.status === 400, JSON.stringify(wrong));

// 3) Registration succeeds with fixed code 000000 (team of 2)
const reg1 = await post('/registrations', {
  ...basePayload(LEADER_A, 'Test Leader A', 'TEST/0001/A', {
    team_name: 'TEST Team Alpha',
    team_size: 2,
    members: [{
      name: 'Test Member A',
      email: MEMBER_A,
      student_id: 'TEST/0002/A',
      faculty: 'Faculty of Science',
      department: 'Test Department',
      year_of_study: '1st Year'
    }]
  }),
  otp: '000000',
  otpToken: send1.body.otpToken
});
check('Registration succeeds with code 000000', reg1.status === 201, JSON.stringify(reg1));

// 4) A registered MEMBER cannot start a new registration (OTP send blocked)
const send2 = await post('/otp/send', { email: MEMBER_A, full_name: 'Test Member A' });
check('Registered member blocked at OTP send (409)', send2.status === 409, JSON.stringify(send2));

// 5) A registered LEADER cannot be added as a member of a new team
const send3 = await post('/otp/send', { email: LEADER_B, full_name: 'Test Leader B' });
const reg2 = await post('/registrations', {
  ...basePayload(LEADER_B, 'Test Leader B', 'TEST/0003/B', {
    team_name: 'TEST Team Beta',
    team_size: 2,
    members: [{
      name: 'Test Leader A',
      email: LEADER_A,
      student_id: 'TEST/0001/A',
      faculty: 'Faculty of Science',
      department: 'Test Department',
      year_of_study: '2nd Year'
    }]
  }),
  otp: '000000',
  otpToken: send3.body.otpToken
});
check('Already-registered person as new member rejected (409)', reg2.status === 409, JSON.stringify(reg2));

// 6) Same person twice within one submission is rejected
const send4 = await post('/otp/send', { email: LEADER_B, full_name: 'Test Leader B' });
const reg3 = await post('/registrations', {
  ...basePayload(LEADER_B, 'Test Leader B', 'TEST/0003/B', {
    team_name: 'TEST Team Gamma',
    team_size: 2,
    members: [{
      name: 'Test Leader B again',
      email: LEADER_B,
      student_id: 'TEST/0003/B',
      faculty: 'Faculty of Science',
      department: 'Test Department',
      year_of_study: '2nd Year'
    }]
  }),
  otp: '000000',
  otpToken: send4.body.otpToken
});
check('Duplicate person within one submission rejected (400)', reg3.status === 400, JSON.stringify(reg3));

await cleanup();
console.log(failures === 0 ? '\nAll checks passed. Test data cleaned up.' : `\n${failures} check(s) FAILED. Test data cleaned up.`);
process.exit(failures === 0 ? 0 : 1);
