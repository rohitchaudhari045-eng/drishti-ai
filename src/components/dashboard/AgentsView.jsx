import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  subscribeUserAgents, 
  createUserAgent, 
  deleteUserAgent, 
  updateUserAgent,
  seedDefaultUserData 
} from '../../lib/firestoreService';

const STATIC_DEMO_AGENTS = [
  {
    id: 'demo-1',
    name: 'Ingestion Sentinel',
    role: 'Data Parsing & Schema Normalization',
    model: 'DRISHTI Structural Parser v1',
    status: 'Active',
    uptime: '99.99%',
    tasks24h: '18,420',
    description: 'Inspects inbound payload structures from webhooks and REST endpoints, ensuring strict type safety.'
  },
  {
    id: 'demo-2',
    name: 'Logic Evaluator',
    role: 'Deterministic Rule Execution',
    model: 'DRISHTI Rules Engine v2.4',
    status: 'Active',
    uptime: '100%',
    tasks24h: '24,110',
    description: 'Executes branching business policies and triggers downstream webhooks when conditions are met.'
  },
  {
    id: 'demo-3',
    name: 'Discrepancy Resolver',
    role: 'Anomaly Detection & Deduplication',
    model: 'Statistical Heuristic Model',
    status: 'Standby',
    uptime: '99.95%',
    tasks24h: '4,890',
    description: 'Identifies duplicated transactional records and prepares remediation alerts for operators.'
  },
  {
    id: 'demo-4',
    name: 'Audit Dispatcher',
    role: 'Security & Compliance Logging',
    model: 'Immutable Ledger Bridge',
    status: 'Active',
    uptime: '100%',
    tasks24h: '48,290',
    description: 'Streams signed execution hashes and trace diagnostics to external monitoring stacks.'
  }
];

export default function AgentsView({ onOpenAuthModal }) {
  const { currentUser } = useAuth();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(Boolean(currentUser));
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Agent Form State
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formModel, setFormModel] = useState('DRISHTI Structural Parser v2');
  const [formDesc, setFormDesc] = useState('');
  const [formStatus, setFormStatus] = useState('Active');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      setAgents(STATIC_DEMO_AGENTS);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeUserAgents(
      currentUser.uid,
      (userAgents) => {
        setAgents(userAgents);
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'Failed to load agents from Firestore.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handleOpenModal = () => {
    if (!currentUser) {
      if (onOpenAuthModal) onOpenAuthModal('signup');
      return;
    }
    setFormName('');
    setFormRole('');
    setFormModel('DRISHTI Structural Parser v2');
    setFormDesc('');
    setFormStatus('Active');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !formRole.trim()) {
      setFormError('Please fill in both Agent Name and Role.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      await createUserAgent(currentUser.uid, {
        name: formName.trim(),
        role: formRole.trim(),
        model: formModel,
        description: formDesc.trim() || 'Custom operational agent deployed via control plane.',
        status: formStatus,
        uptime: '100%',
        tasks24h: '0'
      });
      setIsSubmitting(false);
      setIsModalOpen(false);
    } catch (err) {
      setIsSubmitting(false);
      setFormError(err.message || 'Could not create agent in Firestore.');
    }
  };

  const handleToggleStatus = async (agent) => {
    if (!currentUser) return;
    const newStatus = agent.status === 'Active' ? 'Standby' : 'Active';
    try {
      await updateUserAgent(currentUser.uid, agent.id, { status: newStatus });
    } catch (err) {
      console.error('Failed to update agent status:', err);
    }
  };

  const handleDeleteAgent = async (agentId) => {
    if (!currentUser) return;
    if (!window.confirm('Are you sure you want to decommission this agent?')) return;
    try {
      await deleteUserAgent(currentUser.uid, agentId);
    } catch (err) {
      console.error('Failed to delete agent:', err);
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
      {/* View Header */}
      <div className="section-block-header table-header-flex">
        <div>
          <h2 className="block-title">AI Agent Fleet</h2>
          <p className="block-sub">
            {currentUser 
              ? 'Private Cloud Firestore agent instances configured for your workspace' 
              : 'Sample preview fleet — Sign in to create and manage your private agents'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="badge">
            <span className="badge-dot"></span> 
            {loading ? 'Loading...' : `${agents.length} ${currentUser ? 'Registered' : 'Demo'} Agents`}
          </div>

          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={handleOpenModal}
          >
            + Deploy New Agent
          </button>
        </div>
      </div>

      {/* Guest notice if unauthenticated */}
      {!currentUser && (
        <div className="auth-banner-notice" style={{ marginBottom: '24px' }}>
          <div className="auth-notice-icon">🔒</div>
          <div className="auth-notice-text">
            <strong>Preview Mode:</strong> You are currently exploring demo agents. 
            <button 
              type="button" 
              className="auth-inline-link" 
              style={{ marginLeft: '6px' }}
              onClick={() => onOpenAuthModal && onOpenAuthModal('signin')}
            >
              Sign in with Firebase
            </button> to deploy private agents stored securely in your Cloud Firestore database.
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="auth-alert-box error" style={{ marginBottom: '24px' }}>
          <span>Error loading agents from Firestore: {error}</span>
          <button className="btn btn-secondary btn-sm" onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="agents-grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="card agent-card" style={{ opacity: 0.6, minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="auth-spinner-ring"></span>
            </div>
          ))}
        </div>
      ) : agents.length === 0 ? (
        /* Empty State */
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🤖</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>No Agents in Fleet Yet</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 20px' }}>
            Your private Firestore database currently has no agent definitions. You can deploy a custom agent or load default templates.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleOpenModal}>
              + Deploy Custom Agent
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleSeedDefaults}>
              Load Starter Fleet
            </button>
          </div>
        </div>
      ) : (
        /* Agents Grid */
        <div className="agents-grid">
          {agents.map((agent) => (
            <div key={agent.id} className="card agent-card card-yellow-glow">
              <div className="agent-card-header">
                <div className="agent-avatar">🤖</div>
                <div className="agent-title-box">
                  <h3 className="agent-name">{agent.name}</h3>
                  <span className="agent-role">{agent.role}</span>
                </div>
                <button
                  type="button"
                  className={`status-pill status-${agent.status?.toLowerCase() || 'active'}`}
                  style={{ border: 'none', cursor: currentUser ? 'pointer' : 'default' }}
                  onClick={() => handleToggleStatus(agent)}
                  title={currentUser ? 'Click to toggle status' : undefined}
                >
                  {agent.status || 'Active'}
                </button>
              </div>

              <p className="agent-desc">{agent.description}</p>

              <div className="agent-meta-grid">
                <div className="agent-meta-item">
                  <span className="meta-label">Model Core</span>
                  <span className="meta-val">{agent.model}</span>
                </div>
                <div className="agent-meta-item">
                  <span className="meta-label">24h Task Runs</span>
                  <span className="meta-val text-yellow">{agent.tasks24h || '0'}</span>
                </div>
                <div className="agent-meta-item">
                  <span className="meta-label">Uptime SLA</span>
                  <span className="meta-val">{agent.uptime || '100%'}</span>
                </div>
              </div>

              {currentUser && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                  <button 
                    type="button" 
                    className="btn-icon-action" 
                    onClick={() => handleDeleteAgent(agent.id)}
                    title="Decommission Agent"
                    style={{ color: '#ef4444' }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: Deploy Agent */}
      {isModalOpen && (
        <div className="auth-modal-overlay" onClick={() => !isSubmitting && setIsModalOpen(false)}>
          <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="auth-modal-header">
              <h3 className="auth-modal-heading" style={{ margin: 0 }}>Deploy New AI Agent</h3>
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
              Register a new agent instance into your private Cloud Firestore collection.
            </p>

            {formError && (
              <div className="auth-alert-box error" style={{ marginBottom: '16px' }}>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateAgent} className="auth-form-body">
              <div className="auth-field-group">
                <label className="auth-field-label">Agent Name *</label>
                <div className="auth-input-wrapper">
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Telemetry Sentry" 
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="auth-text-input"
                  />
                </div>
              </div>

              <div className="auth-field-group">
                <label className="auth-field-label">Operational Role *</label>
                <div className="auth-input-wrapper">
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Real-Time Telemetry & Alert Dispatch" 
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="auth-text-input"
                  />
                </div>
              </div>

              <div className="auth-field-group">
                <label className="auth-field-label">Model Engine</label>
                <div className="auth-input-wrapper">
                  <select 
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    className="auth-text-input"
                    style={{ background: 'var(--bg-card)' }}
                  >
                    <option value="DRISHTI Structural Parser v2">DRISHTI Structural Parser v2</option>
                    <option value="DRISHTI Rules Engine v2.4">DRISHTI Rules Engine v2.4</option>
                    <option value="DRISHTI Anomaly Heuristic Model">DRISHTI Anomaly Heuristic Model</option>
                    <option value="Immutable Ledger Bridge">Immutable Ledger Bridge</option>
                  </select>
                </div>
              </div>

              <div className="auth-field-group">
                <label className="auth-field-label">Description</label>
                <div className="auth-input-wrapper">
                  <textarea 
                    rows={3}
                    placeholder="Describe the agent's task and processing logic..."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="auth-text-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary auth-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deploying to Firestore...' : 'Confirm & Deploy Agent'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
