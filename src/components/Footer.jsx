import React from "react";

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <img
          src="/assets/event-logo-light.png"
          alt="AI Buildathon"
          style={{
            height: 45,
            width: "auto",
            display: "block",
            margin: "0 auto 1.5rem",
          }}
        />

        <p
          className="footer-orgs"
          style={{
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.5)",
            maxWidth: 700,
            margin: "0 auto 2.5rem",
            lineHeight: 1.6,
          }}
        >
          Organized by the Industrial Management Science Students&apos;
          Association (IMSSA), University of Kelaniya
          <br />
          in partnership with Alibaba Cloud.
        </p>

        <div className="footer-contact" id="contact">
          <span className="footer-contact-label">Need Help?</span>
          <h2>Have questions?</h2>
          <p className="footer-contact-intro">
            Have questions about registration, teams, submissions, or the
            Buildathon?
          </p>

          <div className="footer-contact-person">
            <strong>Tharindu Dhanushka</strong>
            <span>Buildathon Coordinator</span>
            <span>Department of Industrial Management</span>
            <span>University of Kelaniya</span>
          </div>

          <div className="footer-contact-links">
            <a href="tel:+94762195995" aria-label="Call +94 76 219 5995">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.6 10.8a15.5 15.5 0 006.6 6.6l2.2-2.2a1 1 0 011-.24c1.1.36 2.3.55 3.6.55a1 1 0 011 1V20a1 1 0 01-1 1C10.6 21 3 13.4 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.56 3.6a1 1 0 01-.25 1.02L6.6 10.8z" />
              </svg>
              <span>+94 76 219 5995</span>
            </a>
            <a
              href="https://wa.me/94762195995"
              target="_blank"
              rel="noreferrer"
              aria-label="Message Tharindu on WhatsApp"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2a9.5 9.5 0 00-8.2 14.3L2.5 21.5l5.3-1.3A9.5 9.5 0 1012 2zm0 17a7.4 7.4 0 01-3.8-1.05l-.38-.23-2.2.55.57-2.14-.25-.4A7.5 7.5 0 1112 19zm4.1-5.6c-.22-.11-1.3-.64-1.5-.71-.2-.08-.35-.11-.5.11-.14.22-.57.71-.7.86-.13.15-.26.17-.48.06-.22-.11-.94-.35-1.79-1.1a6.7 6.7 0 01-1.24-1.54c-.13-.22-.01-.34.1-.45l.33-.39c.11-.13.15-.22.22-.37.08-.15.04-.28-.02-.39-.05-.11-.5-1.2-.68-1.65-.18-.43-.36-.37-.5-.38h-.42c-.15 0-.39.06-.59.28-.2.22-.77.75-.77 1.83s.79 2.13.9 2.28c.11.15 1.55 2.37 3.76 3.32.53.23.94.36 1.26.46.53.17 1.01.14 1.39.09.42-.06 1.3-.53 1.48-1.04.19-.51.19-.95.13-1.04-.05-.1-.2-.15-.42-.26z" />
              </svg>
              <span>WhatsApp</span>
            </a>
            <a href="mailto:jtharindudhanushka@gmail.com" aria-label="Email jtharindudhanushka@gmail.com">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <span>jtharindudhanushka@gmail.com</span>
            </a>
          </div>
        </div>

        <div className="footer-logos">
          <span
            className="logo-item"
            title="Alibaba Cloud"
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              src="/assets/alibaba-cloud-logo.png"
              alt="Alibaba Cloud"
              style={{ height: 18, width: "auto", display: "block" }}
            />
          </span>

          <div className="logo-separator"></div>

          <span
            className="logo-item"
            title="AI@IM"
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              src="/assets/AI@IM.png"
              alt="AI@IM"
              style={{ height: 75, width: "auto", display: "block" }}
            />
          </span>

          <div
            className="mobile-break"
            style={{ flexBasis: "100%", height: 0, display: "none" }}
          ></div>
          <div className="logo-separator mobile-hide-separator"></div>

          <span
            className="logo-item"
            title="Department of Industrial Management"
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              src="/assets/mit-it-logo.png"
              alt="MIT & IT Degree Programmes"
              style={{ height: 35, width: "auto", display: "block" }}
            />
          </span>

          <div className="logo-separator"></div>

          <span
            className="logo-item"
            title="IMSSA"
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              src="/assets/imssa-logo.png"
              alt="IMSSA"
              style={{ height: 38, width: "auto", display: "block" }}
            />
          </span>

          <div className="logo-separator"></div>

          <span
            className="logo-item"
            title="University of Kelaniya"
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              src="/assets/uok-crest.png"
              alt="University of Kelaniya"
              style={{ height: 38, width: "auto", display: "block" }}
            />
          </span>

          <div className="logo-separator"></div>

          <span
            className="logo-item"
            title="Mint"
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              src="/assets/mintLogo.png"
              alt="Mint"
              style={{ height: 32, width: "auto", display: "block" }}
            />
          </span>
        </div>

        <p className="footer-credits">
          &copy; 2026 AI Buildathon. Powered by Alibaba Cloud International. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}
