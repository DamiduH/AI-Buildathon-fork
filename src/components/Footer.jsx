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

          <div className="footer-contact-people">
            <div className="footer-contact-entry">
              <div className="footer-contact-person">
                <strong>Tharindu Dhanushka</strong>
                <span>Buildathon Coordinator</span>
                <span>Department of Industrial Management</span>
                <span>University of Kelaniya</span>
              </div>
              <div className="footer-contact-links">
                <a href="tel:+94762195995" aria-label="Call +94 76 219 5995">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.5 15.5 0 006.6 6.6l2.2-2.2a1 1 0 011-.24c1.1.36 2.3.55 3.6.55a1 1 0 011 1V20a1 1 0 01-1 1C10.6 21 3 13.4 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.56 3.6a1 1 0 01-.25 1.02L6.6 10.8z" /></svg>
                  <span>+94 76 219 5995</span>
                </a>
                <a href="mailto:jtharindudhanushka@gmail.com" aria-label="Email jtharindudhanushka@gmail.com">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                  <span>jtharindudhanushka@gmail.com</span>
                </a>
              </div>
            </div>

            <div className="footer-contact-entry">
              <div className="footer-contact-person">
                <strong>Aadila Anees</strong>
                <span>Buildathon Coordinator</span>
                <span>Department of Industrial Management</span>
                <span>University of Kelaniya</span>
              </div>
              <div className="footer-contact-links">
                <a href="tel:+94771719609" aria-label="Call +94 77 171 9609">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.5 15.5 0 006.6 6.6l2.2-2.2a1 1 0 011-.24c1.1.36 2.3.55 3.6.55a1 1 0 011 1V20a1 1 0 01-1 1C10.6 21 3 13.4 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.56 3.6a1 1 0 01-.25 1.02L6.6 10.8z" /></svg>
                  <span>+94 77 171 9609</span>
                </a>
                <a href="mailto:aadhilaanees@gmail.com" aria-label="Email aadhilaanees@gmail.com">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                  <span>aadhilaanees@gmail.com</span>
                </a>
              </div>
            </div>
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
