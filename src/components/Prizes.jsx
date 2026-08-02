import React from "react";

export default function Prizes() {
  return (
    <section className="prizes" id="prizes">
      <div
        style={{ textAlign: "center", marginBottom: "3rem" }}
        className="reveal"
      >
        <span className="section-label">THE PRIZE POOL</span>
        <h2 className="section-title" style={{ marginBottom: 0 }}>
          Prizes & Global Certification
        </h2>
        <p
          className="section-subtitle"
          style={{
            color: "var(--text-secondary)",
            textAlign: "center",
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            paddingBottom: "1.5rem",
          }}
        >
          Three teams. Three cash prizes.
        </p>
      </div>

      <div className="prizes-grid">
        {/* 2nd Place */}
        <div className="prize-card reveal stagger-2">
          <div>
            <div className="prize-rank-circle rank-2nd">2nd</div>
            <h3 className="prize-name">1st Runner&apos;s Up</h3>
            <p className="prize-sub">Second Place Overall</p>
          </div>
          <div>
            <div className="prize-value">$800</div>
            <ul className="prize-benefits">
              <li>Alibaba Cloud Certificate</li>
              <li>Cloud platform credits</li>
            </ul>
          </div>
        </div>

        {/* 1st Place (Featured) */}
        <div className="prize-card champion reveal stagger-1">
          <div>
            <div className="prize-rank-circle rank-1st">1st</div>
            <h3 className="prize-name">Grand Prize</h3>
            <p className="prize-sub">Overall Winner</p>
          </div>
          <div>
            <div className="prize-value" style={{ fontSize: "2.6rem" }}>
              $1000
            </div>
            <ul className="prize-benefits">
              <li>Alibaba Cloud Official Certificate</li>
              <li>Cloud platform credits</li>
            </ul>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="prize-card reveal stagger-3">
          <div>
            <div className="prize-rank-circle rank-3rd">3rd</div>
            <h3 className="prize-name">2nd Runner&apos;s Up</h3>
            <p className="prize-sub">Third Place Overall</p>
          </div>
          <div>
            <div className="prize-value">$500</div>
            <ul className="prize-benefits">
              <li>Alibaba Cloud Certificate</li>
              <li>Cloud platform credits</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
