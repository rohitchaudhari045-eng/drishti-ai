import React, { useState } from 'react';

export default function SettingsView() {
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://api.yourdomain.com/v1/drishti-events');

  const handleCopyKey = () => {
    navigator.clipboard?.writeText('dsh_live_demo_984f88e7a02c317d');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="tab-view-container">
      <div className="section-block-header">
        <div>
          <h2 className="block-title">Control Plane Settings</h2>
          <p className="block-sub">Configure workspace security, integration endpoints, and guardrail policies</p>
        </div>
      </div>

      <div className="settings-stack">
        {/* Workspace Card */}
        <div className="card settings-card">
          <h3 className="settings-section-title">Workspace Configuration</h3>
          <p className="settings-section-desc">Manage environment name, tier parameters, and execution tenancy.</p>
          
          <div className="settings-form-grid">
            <div className="form-group">
              <label className="form-label">Workspace Name</label>
              <input type="text" className="form-input" defaultValue="Demo Workspace" />
            </div>
            <div className="form-group">
              <label className="form-label">Default Execution Region</label>
              <select className="form-input">
                <option>Asia Pacific (Mumbai - ap-south-1)</option>
                <option>US East (N. Virginia - us-east-1)</option>
                <option>Europe (Frankfurt - eu-central-1)</option>
              </select>
            </div>
          </div>
        </div>

        {/* API Credentials Card */}
        <div className="card settings-card">
          <h3 className="settings-section-title">API Authentication & Keys</h3>
          <p className="settings-section-desc">Use this secret key to authenticate programmatic ingestion and REST dispatch.</p>
          
          <div className="api-key-box">
            <div className="api-key-display code-font">
              {apiKeyVisible ? 'dsh_live_demo_984f88e7a02c317d' : 'dsh_live_demo_••••••••••••••••'}
            </div>
            <div className="api-key-actions">
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => setApiKeyVisible(!apiKeyVisible)}
              >
                {apiKeyVisible ? 'Hide Key' : 'Reveal Key'}
              </button>
              <button 
                type="button" 
                className="btn btn-outline-yellow btn-sm"
                onClick={handleCopyKey}
              >
                {copied ? '✓ Copied' : 'Copy Key'}
              </button>
            </div>
          </div>
        </div>

        {/* Inbound Webhook Endpoint */}
        <div className="card settings-card">
          <h3 className="settings-section-title">Inbound Webhook Listener</h3>
          <p className="settings-section-desc">Forward JSON events from Stripe, Auth0, or custom backend queues to this URI.</p>
          
          <div className="form-group">
            <input 
              type="text" 
              className="form-input" 
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
