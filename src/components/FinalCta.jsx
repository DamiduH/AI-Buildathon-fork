import React from "react";
import { usePortalModal } from "../context/PortalModalContext.jsx";

export default function FinalCta() {
  const { openModal } = usePortalModal();

  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <div className="final-cta-content reveal">
        <span className="final-cta-eyebrow">Ready to build?</span>
        <h2 id="final-cta-title">Your Idea Starts Here.</h2>

        <p className="final-cta-intro">
          You have <strong>two weeks</strong> to take an idea from your head to
          a working AI-powered solution.
        </p>

        <div className="final-cta-manifesto" aria-label="Ways to build">
          <span>Build solo.</span>
          <span>Build with friends.</span>
          <span>Build something worth showing.</span>
        </div>

        <button
          type="button"
          className="final-cta-button"
          onClick={openModal}
        >
          Register for AI Buildathon <span aria-hidden="true">→</span>
        </button>

        <a className="final-cta-contact-link" href="#contact">
          Questions? Contact us <span aria-hidden="true">→</span>
        </a>

        <p className="final-cta-deadline">
          <strong>Registrations close August 10</strong>
          <span>Open to University of Kelaniya students.</span>
        </p>
      </div>
    </section>
  );
}
