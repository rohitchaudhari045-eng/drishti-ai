import React from 'react';

const FEATURE_LIST = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    ),
    title: "Workflow Orchestration",
    tag: "Core Engine",
    description: "Build robust event-driven workflows that coordinate systems, processes, and database operations without fragile scripts."
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
      </svg>
    ),
    title: "Data Pipeline Automation",
    tag: "ETL & Streaming",
    description: "Ingest, validate, and normalize structured business data across silos with high throughput and predictable schemas."
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
    title: "Operational Guardrails",
    tag: "Compliance",
    description: "Enforce deterministic rule validation, policy checks, and fallback mechanisms to ensure 100% compliant operations."
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
      </svg>
    ),
    title: "Observability & Telemetry",
    tag: "Monitoring",
    description: "Gain end-to-end visibility into every automation run with real-time audit trails, error diagnostics, and metrics."
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
      </svg>
    ),
    title: "Universal API Connectors",
    tag: "Integration",
    description: "Seamlessly integrate with REST endpoints, Webhooks, GraphQL services, and databases with zero friction."
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    ),
    title: "Enterprise RBAC & Auth",
    tag: "Security",
    description: "Fine-grained permissions, encrypted environment variables, and role-based access for multi-team environments."
  }
];

export default function Features() {
  return (
    <section id="features" className="section-spacing features-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge">
            <span className="badge-dot"></span>
            Enterprise Capabilities
          </div>
          <h2>
            Engineered for <span className="text-gradient-yellow">High-Velocity Operations</span>
          </h2>
          <p>
            DRISHTI AI eliminates repetitive operational overhead by unifying data pipelines, 
            business rules, and system integrations into a single automated control plane.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="features-grid">
          {FEATURE_LIST.map((feature, idx) => (
            <div key={idx} className="card feature-card card-yellow-glow">
              <div className="feature-card-header">
                <div className="feature-icon-box">
                  {feature.icon}
                </div>
                <span className="feature-tag">{feature.tag}</span>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
