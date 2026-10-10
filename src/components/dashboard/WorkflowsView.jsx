import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  subscribeUserWorkflows, 
  createUserWorkflow, 
  toggleUserWorkflow, 
  deleteUserWorkflow,
  seedDefaultUserData 
} from '../../lib/firestoreService';

const STATIC_DEMO_WORKFLOWS = [
  {
    id: 'wf-101',
    name: 'Customer Onboarding Orchestration',
    trigger: 'Webhook: Auth0 / Signup Event',
    steps: 5,
    lastRun: '1 min ago',
    enabled: true,
    successRate: '99.8%'
  },
  {
    id: 'wf-102',
    name: 'Invoice Data Extraction & ERP Sync',
    trigger: 'Cron: Every 1 Hour',
    steps: 7,
    lastRun: '14 mins ago',
    enabled: true,
    successRate: '100%'
  },
  {
    id: 'wf-103',
    name: 'High-Value Lead Routing & Slack Dispatch',
    trigger: 'REST API: Inbound CRM Lead',
    steps: 4,
    lastRun: '32 mins ago',
    enabled: true,
    successRate: '99.5%'
  },
  {
    id: 'wf-104',
    name: 'Nightly Database Sanitation & Archive',
    trigger: 'Cron: Daily at 02:00 UTC',
    steps: 6,
    lastRun: '18 hours ago',
    enabled: false,
    successRate: '100%'
  }
];

export default function WorkflowsView({ onOpenAuthModal }) {
  const { currentUser } = useAuth();
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(Boolean(currentUser));
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal Form State
  const [wfName, setWfName] = useState('');
  const [wfTrigger, setWfTrigger] = useState('Webhook: JSON Inbound Hook');
  const [wfSteps, setWfSteps] = useState(4);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      setWorkflows(STATIC_DEMO_WORKFLOWS);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeUserWorkflows(
      currentUser.uid,
      (userWfs) => {
        setWorkflows(userWfs);
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'Failed to load workflows from Firestore.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handleToggleWorkflow = async (workflow) => {
    if (!currentUser) {
      // Local state toggle for guest demo
      setWorkflows(workflows.map((wf) => 
        wf.id === workflow.id ? { ...wf, enabled: !wf.enabled } : wf
      ));
      return;
    }

    try {
      await toggleUserWorkflow(currentUser.uid, workflow.id, workflow.enabled);
    } catch (err) {
      console.error('Failed to toggle workflow in Firestore:', err);
    }
  };

  const handleDeleteWorkflow = async (workflowId) => {
    if (!currentUser) return;
    if (!window.confirm('Delete this workflow pipeline?')) return;
    try {
      await deleteUserWorkflow(currentUser.uid, workflowId);
    } catch (err) {
      console.error('Failed to delete workflow:', err);
    }
  };

  const handleOpenModal = () => {
    if (!currentUser) {
      if (onOpenAuthModal) onOpenAuthModal('signup');
      return;
    }
    setWfName('');
    setWfTrigger('Webhook: JSON Inbound Hook');
    setWfSteps(4);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCreateWorkflow = async (e) => {
    e.preventDefault();
    if (!wfName.trim()) {
      setFormError('Please enter a workflow name.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      await createUserWorkflow(currentUser.uid, {
        name: wfName.trim(),
        trigger: wfTrigger,
        steps: Number(wfSteps) || 3,
        enabled: true
      });
      setIsSubmitting(false);
      setIsModalOpen(false);
    } catch (err) {
      setIsSubmitting(false);
      setFormError(err.message || 'Could not save workflow to Firestore.');
    }
  };

  const handleSeedDefaults = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      await seedDefaultUserData(currentUser.uid);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-view-container">
      <div className="section-block-header table-header-flex">
        <div>
          <h2 className="block-title">Workflow Catalog</h2>
          <p className="block-sub">
            {currentUser 
              ? 'Private Cloud Firestore execution pipelines isolated for your account' 
              : 'Sample preview pipelines — Sign in to create custom real-time automated workflows'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="badge">
            <span className="badge-dot"></span> 
            {loading ? 'Loading...' : `${workflows.filter(w => w.enabled).length} Active Pipelines`}
          </div>

          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={handleOpenModal}
          >
            + New Workflow Pipeline
          </button>
        </div>
      </div>

      {/* Guest notice if unauthenticated */}
      {!currentUser && (
        <div className="auth-banner-notice" style={{ marginBottom: '24px' }}>
          <div className="auth-notice-icon">⚡</div>
          <div className="auth-notice-text">
            <strong>Sample Pipelines:</strong> Workflows below are interactive demo pipelines. 
            <button 
              type="button" 
              className="auth-inline-link" 
              style={{ marginLeft: '6px' }}
              onClick={() => onOpenAuthModal && onOpenAuthModal('signin')}
            >
              Sign in with Firebase
            </button> to persist workflows in your private Firestore database.
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="auth-alert-box error" style={{ marginBottom: '24px' }}>
          <span>Error loading workflows: {error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="workflows-list">
          {[1, 2, 3].map((n) => (
            <div key={n} className="card workflow-item-card" style={{ opacity: 0.6, minHeight: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="auth-spinner-ring"></span>
            </div>
          ))}
        </div>
      ) : workflows.length === 0 ? (
        /* Empty State */
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>⚡</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>No Workflows Created Yet</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 20px' }}>
            Build your first automated trigger-to-action workflow or load the standard default templates.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleOpenModal}>
              + Create Workflow Pipeline
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleSeedDefaults}>
              Load Starter Workflows
            </button>
          </div>
        </div>
      ) : (
        /* Workflows List */
        <div className="workflows-list">
          {workflows.map((wf) => (
            <div key={wf.id} className="card workflow-item-card">
              <div className="workflow-item-left">
                <div className="workflow-icon">⚡</div>
                <div>
                  <h3 className="workflow-name">{wf.name}</h3>
                  <div className="workflow-meta">
                    <span className="code-font">{wf.id.substring(0, 10)}</span>
                    <span>•</span>
                    <span>Trigger: {wf.trigger}</span>
                    <span>•</span>
                    <span>{wf.steps || 3} Configured Steps</span>
                  </div>
                </div>
              </div>

              <div className="workflow-item-right">
                <div className="workflow-stat-pill">
                  <span className="meta-label">Success Rate</span>
                  <span className="text-yellow" style={{ fontWeight: 700 }}>{wf.successRate || '100%'}</span>
                </div>
                
                <div className="workflow-stat-pill">
                  <span className="meta-label">Last Run</span>
                  <span>{wf.lastRun || 'Just now'}</span>
                </div>

                {/* Status Toggle Switch */}
                <button
                  type="button"
                  className={`toggle-switch-btn ${wf.enabled ? 'is-enabled' : ''}`}
                  onClick={() => handleToggleWorkflow(wf)}
                  title={wf.enabled ? 'Click to pause workflow' : 'Click to enable workflow'}
                >
                  <span className="toggle-slider"></span>
                  <span className="toggle-text">{wf.enabled ? 'Active' : 'Paused'}</span>
                </button>

                {currentUser && (
                  <button 
                    type="button" 
                    className="btn-icon-action" 
                    onClick={() => handleDeleteWorkflow(wf.id)}
                    title="Delete Workflow"
                    style={{ color: '#ef4444', marginLeft: '6px' }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Workflow */}
      {isModalOpen && (
        <div className="auth-modal-overlay" onClick={() => !isSubmitting && setIsModalOpen(false)}>
          <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="auth-modal-header">
              <h3 className="auth-modal-heading" style={{ margin: 0 }}>Create Workflow Pipeline</h3>
              <button 
                type="button" 
                className="auth-modal-close-btn" 
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>

            <p className="auth-modal-subheading" style={{ marginBottom: '16px' }}>
              Define a new automated pipeline stored directly in your Cloud Firestore database.
            </p>

            {formError && (
              <div className="auth-alert-box error" style={{ marginBottom: '16px' }}>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateWorkflow} className="auth-form-body">
              <div className="auth-field-group">
                <label className="auth-field-label">Pipeline Name *</label>
                <div className="auth-input-wrapper">
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Inbound Payment Webhook Sync" 
                    value={wfName}
                    onChange={(e) => setWfName(e.target.value)}
                    className="auth-text-input"
                  />
                </div>
              </div>

              <div className="auth-field-group">
                <label className="auth-field-label">Trigger Source</label>
                <div className="auth-input-wrapper">
                  <select 
                    value={wfTrigger}
                    onChange={(e) => setWfTrigger(e.target.value)}
                    className="auth-text-input"
                    style={{ background: 'var(--bg-card)' }}
                  >
                    <option value="Webhook: JSON Inbound Hook">Webhook: JSON Inbound Hook</option>
                    <option value="Cron: Scheduled Interval (Every 15m)">Cron: Scheduled Interval (Every 15m)</option>
                    <option value="Cron: Daily Batch at 00:00 UTC">Cron: Daily Batch at 00:00 UTC</option>
                    <option value="REST API: Transaction Ingestion">REST API: Transaction Ingestion</option>
                    <option value="Event Stream: Kafka / PubSub Bridge">Event Stream: Kafka / PubSub Bridge</option>
                  </select>
                </div>
              </div>

              <div className="auth-field-group">
                <label className="auth-field-label">Number of Sequential Steps</label>
                <div className="auth-input-wrapper">
                  <input 
                    type="number" 
                    min={1} 
                    max={20}
                    value={wfSteps}
                    onChange={(e) => setWfSteps(e.target.value)}
                    className="auth-text-input"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary auth-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving to Firestore...' : 'Save & Activate Pipeline'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
