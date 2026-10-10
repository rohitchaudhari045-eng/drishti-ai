import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../../lib/firestoreService';

export default function SettingsView({ onOpenAuthModal }) {
  const { currentUser } = useAuth();
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Settings Form State
  const [workspaceName, setWorkspaceName] = useState('Production Cluster');
  const [region, setRegion] = useState('Asia Pacific (Mumbai - ap-south-1)');
  const [webhookUrl, setWebhookUrl] = useState('https://api.drishti.ai/v1/events/inbound');
  const [plan, setPlan] = useState('Developer Free Tier');
  
  const [loading, setLoading] = useState(Boolean(currentUser));
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setWorkspaceName('Demo Workspace');
      setRegion('Asia Pacific (Mumbai - ap-south-1)');
      setWebhookUrl('https://api.yourdomain.com/v1/drishti-events');
      setPlan('Developer Free Tier');
      setLoading(false);
      return;
    }

    setLoading(true);
    getUserProfile(currentUser.uid)
      .then((profile) => {
        if (profile) {
          if (profile.workspaceName) setWorkspaceName(profile.workspaceName);
          if (profile.region) setRegion(profile.region);
          if (profile.webhookUrl) setWebhookUrl(profile.webhookUrl);
          if (profile.plan) setPlan(profile.plan);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Failed to fetch user settings:', err);
        setLoading(false);
      });
  }, [currentUser]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      if (onOpenAuthModal) onOpenAuthModal('signin');
      return;
    }

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      await updateUserProfile(currentUser.uid, {
        workspaceName: workspaceName.trim(),
        region,
        webhookUrl: webhookUrl.trim()
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="tab-view-container">
      <div className="section-block-header table-header-flex">
        <div>
          <h2 className="block-title">Control Plane Settings</h2>
          <p className="block-sub">
            {currentUser 
              ? 'Manage your private Cloud Firestore workspace environment and API endpoints' 
              : 'Workspace settings — Sign in to save custom endpoints to your Firestore profile'}
          </p>
        </div>

        {currentUser && (
          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={handleSaveSettings}
            disabled={saving || loading}
          >
            {saving ? 'Saving to Firestore...' : 'Save Changes'}
          </button>
        )}
      </div>

      {/* Guest Notice */}
      {!currentUser && (
        <div className="auth-banner-notice" style={{ marginBottom: '24px' }}>
          <div className="auth-notice-icon">⚙️</div>
          <div className="auth-notice-text">
            <strong>Preview Mode:</strong> Changes are not saved until you{' '}
            <button 
              type="button" 
              className="auth-inline-link"
              onClick={() => onOpenAuthModal && onOpenAuthModal('signin')}
            >
              sign in with Firebase
            </button>.
          </div>
        </div>
      )}

      {/* Feedback Alerts */}
      {saveSuccess && (
        <div className="auth-alert-box success" style={{ marginBottom: '24px' }}>
          <span>✓ Workspace settings successfully updated in Cloud Firestore.</span>
        </div>
      )}

      {saveError && (
        <div className="auth-alert-box error" style={{ marginBottom: '24px' }}>
          <span>Error updating settings: {saveError}</span>
        </div>
      )}

      <div className="settings-stack">
        {/* Workspace Card */}
        <div className="card settings-card">
          <h3 className="settings-section-title">Workspace Configuration</h3>
          <p className="settings-section-desc">Manage environment name, region tenancy, and account tier.</p>
          
          <div className="settings-form-grid">
            <div className="form-group">
              <label className="form-label">Workspace Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Account Tier</label>
              <input 
                type="text" 
                className="form-input" 
                value={plan}
                disabled
                title="Account tier is managed by platform administrators and cannot be edited directly."
                style={{ opacity: 0.8, cursor: 'not-allowed' }}
              />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Default Execution Region</label>
              <select 
                className="form-input"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                disabled={loading}
              >
                <option value="Asia Pacific (Mumbai - ap-south-1)">Asia Pacific (Mumbai - ap-south-1)</option>
                <option value="US East (N. Virginia - us-east-1)">US East (N. Virginia - us-east-1)</option>
                <option value="Europe (Frankfurt - eu-central-1)">Europe (Frankfurt - eu-central-1)</option>
                <option value="Asia Pacific (Singapore - ap-southeast-1)">Asia Pacific (Singapore - ap-southeast-1)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security & Secret Management Card */}
        <div className="card settings-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h3 className="settings-section-title" style={{ margin: 0 }}>API Ingestion & Secret Management</h3>
            <span className="badge">
              <span className="badge-dot" style={{ backgroundColor: '#38bdf8' }}></span>
              Zero-Trust Architecture
            </span>
          </div>
          <p className="settings-section-desc">
            To prevent secret exposure, third-party API keys, webhook signing tokens, and service credentials are never stored in client-accessible Firestore documents. Programmatic API access is verified on backend endpoints.
          </p>
          
          <div style={{ backgroundColor: 'var(--bg-card-subtle, rgba(255,255,255,0.03))', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '1.4rem' }}>🛡️</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Client-side secret generation is disabled. Dedicated API keys and secret-dependent webhooks will be provisioned through secure Cloud Functions when backend services are enabled.
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
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
