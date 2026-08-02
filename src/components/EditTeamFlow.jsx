import React, { useEffect, useRef, useState } from "react";
import { faculties, facultyDeptData } from "../data/facultyDepartments.js";
import {
  fetchTeamForEdit,
  sendVerificationOtp,
  updateTeamMembers,
} from "../lib/api.js";
import Turnstile from "./Turnstile.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyMember = {
  name: "",
  email: "",
  student_id: "",
  faculty: "",
  department: "",
  year_of_study: "1st Year",
};

/**
 * "Edit my team" flow for already-registered teams:
 *   1. identify - the LEADER enters their registered email (+ CAPTCHA)
 *   2. otp      - a code is emailed to that inbox; entering it proves it's
 *                 really the leader
 *   3. edit     - the saved team loads; leader details are shown read-only,
 *                 only the other members can be changed (add/remove/edit)
 *   4. done     - confirmation
 */
export default function EditTeamFlow({ isOpen, onBack, onDone }) {
  const [step, setStep] = useState("identify");
  const [email, setEmail] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const turnstileRef = useRef(null);

  useEffect(() => {
    if (resendCooldown <= 0) return undefined;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const teamSize = members.length + 1;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setErrorMsg("Please enter the team leader's registered email address.");
      return;
    }
    if (!captchaToken) {
      setErrorMsg("Please complete the CAPTCHA verification first.");
      return;
    }

    setErrorMsg("");
    setBusy(true);
    try {
      const data = await sendVerificationOtp({
        email: email.trim(),
        mode: "edit",
        captchaToken,
        company_website: "",
      });
      setOtpToken(data.otpToken);
      setOtpCode("");
      setStep("otp");
      setResendCooldown(60);
    } catch (err) {
      setErrorMsg(err.message || "Could not send the verification code.");
    } finally {
      // Single-use token was spent either way - force a fresh challenge.
      setCaptchaToken("");
      turnstileRef.current?.reset();
      setBusy(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otpCode.trim())) {
      setErrorMsg("Please enter the 6-digit code we emailed you.");
      return;
    }

    setErrorMsg("");
    setBusy(true);
    try {
      const data = await fetchTeamForEdit({
        email: email.trim(),
        otp: otpCode.trim(),
        otpToken,
      });
      const reg = data.registration;
      setTeam(reg);
      setMembers(
        (Array.isArray(reg.members) ? reg.members : []).map((m) => ({
          ...emptyMember,
          ...m,
        })),
      );
      setStep("edit");
    } catch (err) {
      setErrorMsg(err.message || "Verification failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending || busy) return;
    setErrorMsg("");
    setResending(true);
    try {
      const data = await sendVerificationOtp({
        email: email.trim(),
        mode: "edit",
        previousToken: otpToken,
        company_website: "",
      });
      setOtpToken(data.otpToken);
      setOtpCode("");
      setResendCooldown(60);
    } catch (err) {
      setErrorMsg(err.message || "Could not resend the code.");
    } finally {
      setResending(false);
    }
  };

  const handleSizeChange = (size) => {
    setMembers((prev) => {
      const needed = size - 1;
      const next = prev.slice(0, needed);
      while (next.length < needed) next.push({ ...emptyMember });
      return next;
    });
  };

  const handleMemberChange = (index, field) => (e) => {
    const value = e.target.value;
    setMembers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      if (field === "faculty") next[index].department = "";
      return next;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    for (let i = 0; i < members.length; i += 1) {
      const m = members[i];
      if (
        !m.name.trim() ||
        !m.student_id.trim() ||
        !m.faculty ||
        !m.department ||
        !EMAIL_RE.test((m.email || "").trim())
      ) {
        setErrorMsg(`Please complete all details for member ${i + 2}.`);
        return;
      }
    }

    setErrorMsg("");
    setBusy(true);
    try {
      await updateTeamMembers({
        email: email.trim(),
        otp: otpCode.trim(),
        otpToken,
        members: members.map((m) => ({
          name: m.name.trim(),
          email: (m.email || "").trim().toLowerCase(),
          student_id: m.student_id.trim(),
          faculty: m.faculty,
          department: m.department,
          year_of_study: m.year_of_study || "1st Year",
        })),
      });
      setStep("done");
    } catch (err) {
      setErrorMsg(err.message || "Could not save your changes.");
    } finally {
      setBusy(false);
    }
  };

  const titles = {
    identify: "Edit Your Team",
    otp: "Verify Your Email",
    edit: "Update Member Details",
    done: "Team Updated!",
  };
  const subtitles = {
    identify: "Enter the team leader's registered email to continue",
    otp: (
      <>
        Enter the 6-digit code we sent to{" "}
        <strong style={{ color: "var(--primary-orange)" }}>
          {email.trim()}
        </strong>
      </>
    ),
    edit: "Leader details are locked. You can change the other members.",
    done: "",
  };

  return (
    <div>
      {step !== "done" && (
        <>
          <h3 className="portal-title">{titles[step]}</h3>
          <p className="portal-sub">{subtitles[step]}</p>
        </>
      )}

      <div
        className="form-message error"
        style={{ display: errorMsg ? "block" : "none" }}
      >
        {errorMsg}
      </div>

      {step === "identify" && (
        <form onSubmit={handleSendOtp} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="editLeaderEmail">
              Team Leader Email
            </label>
            <input
              type="email"
              id="editLeaderEmail"
              className="form-input"
              placeholder="Enter the email you registered with"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group" style={{ marginTop: "1.5rem" }}>
            {isOpen && (
              <Turnstile
                ref={turnstileRef}
                onVerify={setCaptchaToken}
                onExpire={() => setCaptchaToken("")}
              />
            )}
          </div>

          <button
            type="submit"
            className="submit-btn"
            style={{ marginTop: "1.5rem" }}
            disabled={busy}
          >
            <span>{busy ? "Sending Code..." : "Send Verification Code"}</span>
            <div
              className="loading-spinner"
              style={{ display: busy ? "inline-block" : "none" }}
            ></div>
          </button>

          <button
            type="button"
            onClick={onBack}
            style={{
              display: "block",
              margin: "1.25rem auto 0",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontSize: "0.85rem",
              textDecoration: "underline",
            }}
          >
            ← Back to registration
          </button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleVerify} noValidate>
          <div
            className="form-group"
            style={{ marginTop: "1.5rem", textAlign: "center" }}
          >
            <label className="form-label" htmlFor="editOtpInput">
              Verification Code
            </label>
            <input
              type="text"
              id="editOtpInput"
              className="form-input"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="000000"
              autoFocus
              value={otpCode}
              onChange={(e) =>
                setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              style={{
                textAlign: "center",
                fontSize: "1.6rem",
                letterSpacing: "0.5em",
                fontFamily: "'Courier New', Courier, monospace",
              }}
            />
            <p
              style={{
                marginTop: "0.75rem",
                color: "var(--text-secondary)",
                fontSize: "0.85rem",
              }}
            >
              The code expires in 10 minutes.
            </p>
          </div>

          <button
            type="submit"
            className="submit-btn"
            style={{ marginTop: "1rem" }}
            disabled={busy || otpCode.length !== 6}
          >
            <span>{busy ? "Verifying..." : "Verify & Load Team"}</span>
            <div
              className="loading-spinner"
              style={{ display: busy ? "inline-block" : "none" }}
            ></div>
          </button>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "1.25rem",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setStep("identify");
                setOtpCode("");
                setErrorMsg("");
              }}
              disabled={busy}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-secondary)",
                fontSize: "0.85rem",
                textDecoration: "underline",
                padding: 0,
              }}
            >
              ← Change email
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || resending || busy}
              style={{
                background: "none",
                border: "none",
                cursor:
                  resendCooldown > 0 || resending ? "not-allowed" : "pointer",
                color:
                  resendCooldown > 0 || resending
                    ? "var(--text-secondary)"
                    : "var(--primary-orange)",
                fontSize: "0.85rem",
                textDecoration: "underline",
                padding: 0,
              }}
            >
              {resending
                ? "Sending..."
                : resendCooldown > 0
                  ? `Resend code in ${resendCooldown}s`
                  : "Resend code"}
            </button>
          </div>
        </form>
      )}

      {step === "edit" && team && (
        <form onSubmit={handleSave} noValidate>
          {/* Leader summary - read-only by design */}
          <div
            style={{
              marginTop: "1rem",
              border: "1px solid var(--border-glass)",
              borderRadius: "12px",
              padding: "1rem 1.25rem",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <p
              style={{
                margin: "0 0 0.5rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--primary-orange)",
              }}
            >
              Team {team.team_name} — Lead Builder (locked)
            </p>
            <p style={{ margin: 0, fontWeight: 600 }}>{team.full_name}</p>
            <p
              style={{
                margin: "0.2rem 0 0",
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
              }}
            >
              {team.student_email}
            </p>
            <p
              style={{
                margin: "0.2rem 0 0",
                color: "var(--text-secondary)",
                fontSize: "0.85rem",
              }}
            >
              ID: {team.student_id} ·{" "}
              {[team.faculty, team.department, team.year_of_study]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>

          <div className="form-group" style={{ marginTop: "1.5rem" }}>
            <label className="form-label">Team Size</label>
            <div className="segmented-control">
              {[1, 2, 3].map((size) => (
                <button
                  type="button"
                  key={size}
                  className={`segment-btn${teamSize === size ? " active" : ""}`}
                  onClick={() => handleSizeChange(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {members.map((member, index) => (
            <div
              key={index}
              style={{
                marginTop: "1.5rem",
                borderTop: "1px solid var(--border-glass)",
                paddingTop: "1.5rem",
              }}
            >
              <label className="form-label">
                Member {index + 2} Information
              </label>
              <div className="form-row">
                <div className="form-group">
                  <label
                    className="form-label"
                    htmlFor={`edit-member-${index}-name`}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id={`edit-member-${index}-name`}
                    className="form-input"
                    placeholder="Enter full name"
                    value={member.name}
                    onChange={handleMemberChange(index, "name")}
                  />
                </div>
                <div className="form-group">
                  <label
                    className="form-label"
                    htmlFor={`edit-member-${index}-student_id`}
                  >
                    Student ID / Reg No
                  </label>
                  <input
                    type="text"
                    id={`edit-member-${index}-student_id`}
                    className="form-input"
                    placeholder="Enter Student ID / Reg No"
                    value={member.student_id}
                    onChange={handleMemberChange(index, "student_id")}
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  className="form-label"
                  htmlFor={`edit-member-${index}-email`}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id={`edit-member-${index}-email`}
                  className="form-input"
                  placeholder="Enter email address"
                  value={member.email || ""}
                  onChange={handleMemberChange(index, "email")}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label
                    className="form-label"
                    htmlFor={`edit-member-${index}-faculty`}
                  >
                    Faculty
                  </label>
                  <select
                    id={`edit-member-${index}-faculty`}
                    className="form-input"
                    value={member.faculty || ""}
                    onChange={handleMemberChange(index, "faculty")}
                  >
                    <option value="" disabled>
                      Select Faculty
                    </option>
                    {faculties.map((faculty) => (
                      <option key={faculty} value={faculty}>
                        {faculty}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label
                    className="form-label"
                    htmlFor={`edit-member-${index}-department`}
                  >
                    Department
                  </label>
                  <select
                    id={`edit-member-${index}-department`}
                    className="form-input"
                    disabled={!member.faculty}
                    value={member.department || ""}
                    onChange={handleMemberChange(index, "department")}
                  >
                    <option value="" disabled>
                      {member.faculty
                        ? "Select Department"
                        : "Select Faculty First"}
                    </option>
                    {(facultyDeptData[member.faculty] || []).map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label
                  className="form-label"
                  htmlFor={`edit-member-${index}-year`}
                >
                  Year of Study
                </label>
                <select
                  id={`edit-member-${index}-year`}
                  className="form-input"
                  value={member.year_of_study || "1st Year"}
                  onChange={handleMemberChange(index, "year_of_study")}
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>
          ))}

          {members.length === 0 && (
            <p
              style={{
                marginTop: "1.25rem",
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
              }}
            >
              Your team currently has no extra members. Increase the team size
              above to add some.
            </p>
          )}

          <button
            type="submit"
            className="submit-btn"
            style={{ marginTop: "2rem" }}
            disabled={busy}
          >
            <span>{busy ? "Saving Changes..." : "Save Changes"}</span>
            <div
              className="loading-spinner"
              style={{ display: busy ? "inline-block" : "none" }}
            ></div>
          </button>
        </form>
      )}

      {step === "done" && (
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <div className="checkmark-circle">
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="portal-title" style={{ color: "#10b981" }}>
            Team Updated!
          </h3>
          <p className="portal-sub" style={{ marginBottom: "0.5rem" }}>
            Team{" "}
            <strong style={{ color: "var(--primary-orange)" }}>
              {team?.team_name}
            </strong>
            &rsquo;s member details have been saved.
          </p>
          <button
            type="button"
            className="submit-btn"
            style={{
              marginTop: "1.5rem",
              background: "transparent",
              border: "1px solid var(--border-glass)",
              color: "var(--text-secondary)",
            }}
            onClick={onDone || onBack}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
