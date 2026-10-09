import React from 'react';

const STEPS = [
  {
    number: "01",
    title: "Connect Ingestion Sources",
    description: "Plug in your existing databases, APIs, or webhook listeners. DRISHTI AI validates schemas and establishes encrypted pipelines instantly."
  },
  {
    number: "02",
    title: "Define Business Logic & Guardrails",
    description: "Configure conditional rules, error-handling thresholds, and automated routing pipelines with predictable deterministic outcomes."
  },
  {
    number: "03",
    title: "Deploy & Monitor Autonomously",
    description: "Launch workflows across staging and production with live telemetry, automated failover, and comprehensive audit trails."
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-spacing how-it-works-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge">
            <span className="badge-dot"></span>
            Execution Lifecycle
          </div>
          <h2>
            How <span className="text-gradient-yellow">DRISHTI AI</span> Works
          </h2>
          <p>
            A systematic three-phase foundation designed to take business automations 
            from conception to production with zero operational friction.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="steps-grid">
          {STEPS.map((step, idx) => (
            <div key={idx} className="card step-card card-yellow-glow">
              <div className="step-number-badge">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
