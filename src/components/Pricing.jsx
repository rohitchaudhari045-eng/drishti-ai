import React from 'react';

const PLANS = [
  {
    name: "Developer Starter",
    badge: "Free Tier",
    price: "$0",
    period: "/ forever",
    description: "Ideal for testing workflows, individual developers, and prototyping automation pipelines.",
    features: [
      "Up to 5 Active Workflows",
      "10,000 Event Runs / Month",
      "Standard Webhook & REST Connectors",
      "24-Hour Telemetry Retention",
      "Community & Discord Support"
    ],
    buttonText: "Start Free",
    buttonClass: "btn-secondary",
    highlight: false
  },
  {
    name: "Growth Professional",
    badge: "Most Popular",
    price: "$99",
    period: "/ month",
    description: "Engineered for scaling businesses requiring high throughput, low latency, and team collaboration.",
    features: [
      "Unlimited Active Workflows",
      "500,000 Event Runs / Month",
      "Custom Webhooks & DB Integrations",
      "30-Day Full Telemetry Retention",
      "Multi-User Team RBAC Access",
      "Priority SLA Email & Chat Support"
    ],
    buttonText: "Start 14-Day Free Trial",
    buttonClass: "btn-primary",
    highlight: true
  },
  {
    name: "Custom Enterprise",
    badge: "Dedicated Scale",
    price: "Custom",
    period: "",
    description: "Designed for enterprises demanding dedicated cloud infrastructure, custom VPCs, and compliance SLAs.",
    features: [
      "Dedicated High-Throughput Runners",
      "Custom High-Volume Execution Caps",
      "SOC-2 & HIPAA Compliance Reports",
      "VPC Peering & Custom Connectors",
      "Dedicated Technical Account Manager",
      "99.99% Guaranteed Uptime SLA"
    ],
    buttonText: "Contact Enterprise Team",
    buttonClass: "btn-outline-yellow",
    highlight: false
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="section-spacing pricing-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge">
            <span className="badge-dot"></span>
            Transparent Pricing
          </div>
          <h2>
            Predictable Plans for <span className="text-gradient-yellow">Every Scale</span>
          </h2>
          <p>
            Start free without a credit card. Upgrade as your automation throughput and team expand.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-grid">
          {PLANS.map((plan, idx) => (
            <div 
              key={idx} 
              className={`card pricing-card ${plan.highlight ? 'pricing-highlight' : ''}`}
            >
              {plan.highlight && (
                <div className="popular-tag">RECOMMENDED</div>
              )}
              <div className="pricing-plan-header">
                <div className="pricing-badge">{plan.badge}</div>
                <h3 className="plan-name">{plan.name}</h3>
                <div className="price-container">
                  <span className="price-amount">{plan.price}</span>
                  <span className="price-period">{plan.period}</span>
                </div>
                <p className="plan-description">{plan.description}</p>
              </div>

              <div className="pricing-divider"></div>

              <div className="plan-features-list">
                <div className="features-label">INCLUDED CAPABILITIES:</div>
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="feature-item">
                    <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pricing-action">
                <a href="#get-started" className={`btn ${plan.buttonClass}`} style={{ width: '100%' }}>
                  {plan.buttonText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
