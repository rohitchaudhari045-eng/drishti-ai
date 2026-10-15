import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../../lib/firestoreService';

export default function SettingsView({ onOpenAuthModal }) {
  const { currentUser } = useAuth();
  const [workspaceName, setWorkspaceName] = useState('DRISHTI AI Workspace');
  const [region, setRegion] = useState('India');
  const [webhookUrl, setWebhookUrl] = useState('https://your-webhook-url.com');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    getUserProfile(currentUser.uid)
      .then((profile) => {
        if (profile) {
          if (profile.workspaceName) setWorkspaceName(profile.workspaceName);
          if (profile.region) setRegion(profile.region);
          if (profile.webhookUrl) setWebhookUrl(profile.webhookUrl);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch user settings:', err);
      });
  }, [currentUser]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    if (currentUser) {
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
      }
    } else {
      // Local state save for guest mode
      setTimeout(() => {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }, 300);
    }

    setSaving(false);
  };

  return (
    <div className="subpage-root">
      {/* Header Row (Matching Thumbnail 4 in Reference Image 1) */}
      <div className="subpage-header-row">
        <div>
          <h1 className="subpage-title">Settings</h1>
          <p className="subpage-subtitle">Manage your workspace and preferences.</p>
        </div>
      </div>

      {/* Settings Form Card */}
      <div className="overview-card settings-form-card">
        <h2 className="settings-section-title">Profile Information</h2>

        {saveSuccess && (
          <div className="settings-alert-success">
            ✓ Settings saved successfully to your DRISHTI AI workspace.
          </div>
        )}

        {saveError && (
          <div className="settings-alert-error">
            {saveError}
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="settings-form-flow">
          <div className="settings-field-group">
            <label className="settings-label">Workspace Name</label>
            <input 
              type="text" 
              required
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="settings-input"
              placeholder="e.g. DRISHTI AI Workspace"
            />
          </div>

          <div className="settings-field-group">
            <label className="settings-label">Region</label>
            <div className="settings-select-wrap">
              <select 
                value={region} 
                onChange={(e) => setRegion(e.target.value)}
                className="settings-select"
              >
                <option value="India">India</option>
                <option value="US East (N. Virginia)">US East (N. Virginia)</option>
                <option value="US West (Oregon)">US West (Oregon)</option>
                <option value="Europe (Frankfurt)">Europe (Frankfurt)</option>
                <option value="Asia Pacific (Singapore)">Asia Pacific (Singapore)</option>
              </select>
            </div>
          </div>

          <div className="settings-field-group">
            <label className="settings-label">Webhook URL</label>
            <input 
              type="url" 
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="settings-input"
              placeholder="https://your-webhook-url.com"
            />
          </div>

          {/* Yellow Save Changes Button (Reference Image 1) */}
          <div style={{ marginTop: '8px' }}>
            <button 
              type="submit" 
              className="btn-deploy-yellow"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Security Notice Callout Box (Reference Image 1) */}
        <div className="security-notice-callout">
          <div className="security-icon-circle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <div className="security-notice-content">
            <div className="security-notice-title">Security Notice</div>
            <div className="security-notice-text">
              For your security, sensitive fields like plan, email and credentials cannot be updated from here.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
