import React from 'react';

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <div className="brand-logo">
              <div className="brand-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <span className="brand-name">
                DRISHTI <span className="brand-accent">AI</span>
              </span>
            </div>
            <p className="footer-brand-desc">
              The intelligent business automation SaaS platform. Engineered for speed, stability, and scale.
            </p>
            <div className="system-status-pill">
              <span className="status-dot-active"></span>
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Product</h4>
            <ul className="footer-links">
              <li><a href="#features">Orchestrator</a></li>
              <li><a href="#features">Data Pipelines</a></li>
              <li><a href="#features">Guardrails</a></li>
              <li><a href="#features">Integrations</a></li>
              <li><a href="#pricing">Pricing</a></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Developers</h4>
            <ul className="footer-links">
              <li><a href="#docs">Documentation</a></li>
              <li><a href="#api">API Reference</a></li>
              <li><a href="#sdk">SDK Libraries</a></li>
              <li><a href="#changelog">Changelog</a></li>
              <li><a href="#status">System Status</a></li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Company & Legal</h4>
            <ul className="footer-links">
              <li><a href="#about">About DRISHTI AI</a></li>
              <li><a href="#security">Security & Trust</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#contact">Contact Support</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} DRISHTI AI Technologies. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#security">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
