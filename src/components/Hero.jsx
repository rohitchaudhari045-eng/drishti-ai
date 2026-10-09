import React from 'react';

export default function Hero({ onGetStarted }) {
  return (
    <section className="hero-section grid-background">
      <div className="bg-glow-radial"></div>

      <div className="container hero-container">
        {/* Top Tagline Badge */}
        <div className="hero-badge-wrapper">
          <div className="badge">
            <span className="badge-dot"></span>
            DRISHTI AI Engine v1.0 Foundation
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="hero-title">
          Autonomous Business <br />
          <span className="text-gradient-yellow">Automation Platform</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-description">
          Unify operational data, orchestrate enterprise workflows, and deploy intelligent rules 
          with full governance, transparent observability, and enterprise-grade reliability.
        </p>

        {/* Action Buttons */}
        <div className="hero-cta-group">
          <button 
            type="button"
            onClick={onGetStarted} 
            className="btn btn-primary"
          >
            Launch Live Dashboard
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          <a href="#how-it-works" className="btn btn-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Explore Platform Architecture
          </a>
        </div>

        {/* Live Architecture / SaaS Dashboard Preview Window */}
        <div className="hero-preview-wrapper" onClick={onGetStarted} style={{ cursor: 'pointer' }} title="Click to open interactive dashboard">
          <div className="dashboard-mockup card card-yellow-glow">
            {/* Window Top Bar */}
            <div className="mockup-header">
              <div className="mockup-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <div className="mockup-address-bar">
                <span className="mockup-lock">🔒</span> app.drishti.ai/orchestrator (Click to launch)
              </div>
              <div className="mockup-status">
                <span className="status-indicator"></span> System Active
              </div>
            </div>

            {/* Dashboard Content Mockup */}
            <div className="mockup-body">
              {/* Stat Cards */}
              <div className="mockup-stats-grid">
                <div className="mockup-stat-card">
                  <div className="stat-label">Active Workflows</div>
                  <div className="stat-value">1,420 <span className="stat-badge-up">+18%</span></div>
                  <div className="stat-sub">Across 12 Business Units</div>
                </div>

                <div className="mockup-stat-card highlight">
                  <div className="stat-label">Automation Throughput</div>
                  <div className="stat-value text-yellow">99.98%</div>
                  <div className="stat-sub">Zero Human Intervention</div>
                </div>

                <div className="mockup-stat-card">
                  <div className="stat-label">Mean Cycle Time</div>
                  <div className="stat-value">142ms <span className="stat-badge-fast">Optimal</span></div>
                  <div className="stat-sub">Sub-second Latency SLA</div>
                </div>
              </div>

              {/* Workflow Pipeline visual representation */}
              <div className="mockup-pipeline-box">
                <div className="pipeline-header">
                  <span>LIVE EXECUTION PIPELINE</span>
                  <span className="pipeline-tag">Interactive Preview</span>
                </div>
                <div className="pipeline-nodes">
                  <div className="node active">
                    <span className="node-icon">📥</span>
                    <span className="node-title">Data Ingestion</span>
                    <span className="node-status">Connected</span>
                  </div>
                  <div className="node-connector"></div>
                  <div className="node active pulse">
                    <span className="node-icon">⚡</span>
                    <span className="node-title">DRISHTI Rules Engine</span>
                    <span className="node-status text-yellow">Evaluating</span>
                  </div>
                  <div className="node-connector"></div>
                  <div className="node">
                    <span className="node-icon">🔄</span>
                    <span className="node-title">ERP & CRM Sync</span>
                    <span className="node-status">Ready</span>
                  </div>
                  <div className="node-connector"></div>
                  <div className="node">
                    <span className="node-icon">📊</span>
                    <span className="node-title">Audit Log & Telemetry</span>
                    <span className="node-status">Streaming</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Metric Bar */}
        <div className="hero-trust-bar">
          <div className="trust-item">
            <span className="trust-number">99.99%</span>
            <span className="trust-label">Guaranteed Uptime</span>
          </div>
          <div className="trust-divider"></div>
          <div className="trust-item">
            <span className="trust-number">&lt; 150ms</span>
            <span className="trust-label">Event Processing</span>
          </div>
          <div className="trust-divider"></div>
          <div className="trust-item">
            <span className="trust-number">SOC-2</span>
            <span className="trust-label">Compliance Architecture</span>
          </div>
          <div className="trust-divider"></div>
          <div className="trust-item">
            <span className="trust-number">100%</span>
            <span className="trust-label">Open Extensibility</span>
          </div>
        </div>

      </div>
    </section>
  );
}
