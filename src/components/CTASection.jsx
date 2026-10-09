import React from 'react';

export default function CTASection() {
  return (
    <section id="get-started" className="section-spacing cta-section">
      <div className="container">
        <div className="cta-box card">
          <div className="cta-glow"></div>
          
          <div className="badge">
            <span className="badge-dot"></span>
            Instant Deployment
          </div>

          <h2 className="cta-title">
            Ready to Automate Your <br />
            <span className="text-gradient-yellow">Business Operations?</span>
          </h2>

          <p className="cta-sub">
            Join forward-thinking teams using DRISHTI AI to orchestrate mission-critical workflows with zero friction.
          </p>

          <div className="cta-button-group">
            <a href="#trial" className="btn btn-primary">
              Start Building Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
            <a href="#demo" className="btn btn-secondary">
              Schedule Architecture Review
            </a>
          </div>

          <div className="cta-footer-note">
            <span>✓ No credit card required</span>
            <span>✓ Deploy in under 5 minutes</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
