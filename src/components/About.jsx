import React, { useRef } from 'react';
import useAboutSphereCanvas from '../hooks/useAboutSphereCanvas.js';

const DOMAINS = [
  {
    name: 'BFSI & FinTech',
    desc: 'Banking, payments, insurance and smart financial tools.',
    icon: (
      // Bank / finance
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M4 10V21m16-11v11M8 14v4m4-4v4m4-4v4M2 21h20M12 3l9 7H3l9-7z" />
      </svg>
    )
  },
  {
    name: 'EdTech & Inclusive Learning',
    desc: 'Accessible education, tutoring and learning platforms.',
    icon: (
      // Graduation cap
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4L2 9l10 5 10-5-10-5zM6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5M22 9v5" />
      </svg>
    )
  },
  {
    name: 'Hospitality & Tourism',
    desc: 'Travel planning, guest experiences and destination tech.',
    icon: (
      // Globe / location
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    name: 'Smart Manufacturing',
    desc: 'Automation, predictive maintenance and Industry 4.0.',
    icon: (
      // Gear / cog
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    name: 'Retail & eCommerce',
    desc: 'Personalized shopping, inventory and storefront AI.',
    icon: (
      // Shopping cart
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    name: 'Enterprise Customer Support',
    desc: 'AI agents, help desks and smarter service workflows.',
    icon: (
      // Headset / support
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 10a6 6 0 10-12 0v4a2 2 0 002 2h1v-6H6m12 0h-3v6h1a2 2 0 002-2v-4zm0 4v1a4 4 0 01-4 4h-2" />
      </svg>
    )
  }
];

export default function About({ techContainerRef }) {
  const canvasRef = useRef(null);
  useAboutSphereCanvas(canvasRef);

  return (
    <section className="quick-facts" id="about">
      <div className="about-container">
        <div className="about-left">
          <div className="reveal" style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <span className="section-label">Overview</span>
            <h2 className="section-title" style={{ marginBottom: '1.25rem' }}>An online sprint to ship AI-powered solutions</h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.1rem',
                lineHeight: 1.8,
                textAlign: 'center',
                maxWidth: 1100,
                margin: '0 auto'
              }}
            >
              The AI Buildathon is a two-week, fully online innovation sprint for University of Kelaniya students.
              Throughout the event, you&apos;ll explore modern tools, collaborate in small teams, and build a working
              prototype that solves real-world problems across any industry. Whether it&apos;s a video generator, mobile
              app, enterprise system, or public platform, if technology is at its core, it belongs here.
            </p>
          </div>

          <div className="facts-grid">
            <div className="fact-card reveal stagger-1">
              <div className="fact-icon">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="fact-title">Format</h3>
              <p className="fact-desc">Conducted entirely online with mentorship workshops.</p>
            </div>
            <div className="fact-card reveal stagger-2">
              <div className="fact-icon">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="fact-title">Team Size</h3>
              <p className="fact-desc">Build alone or collaborate in groups of up to three.</p>
            </div>
          </div>

          {/* The block wrapper is intentionally NOT a .reveal element - nesting
              reveals compounds the translate/blur and breaks the animation on
              the later cards, so only the header and each card reveal. */}
          <div className="domains-block">
            <div className="reveal">
              <p className="domains-heading">Industry Tracks</p>
              <p className="domains-sub">Pick a domain and build something that matters.</p>
            </div>
            <div className="domains-grid">
              {DOMAINS.map((d, i) => (
                <div key={d.name} className={`domain-card reveal stagger-${(i % 3) + 1}`}>
                  <div className="domain-icon">{d.icon}</div>
                  <div className="domain-info">
                    <h3 className="domain-name">{d.name}</h3>
                    <p className="domain-desc">{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="about-right reveal stagger-3">
          <div
            className="interactive-tech-container"
            id="interactiveTechContainer"
            ref={techContainerRef}
            style={{ width: '100%', maxWidth: 380, aspectRatio: '1', margin: '0 auto', position: 'relative' }}
          >
            <canvas id="aboutVisualCanvas" ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', cursor: 'grab' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
