import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  subscribeUserWorkflows, 
  createUserWorkflow, 
  toggleUserWorkflow, 
  deleteUserWorkflow 
} from '../../lib/firestoreService';

const DEFAULT_WORKFLOWS = [
  {
    id: 'wf-1',
    name: 'Order Sync',
    trigger: 'Webhook',
    status: 'Active',
    lastRun: '2m ago'
  },
  {
    id: 'wf-2',
    name: 'Data Processing',
    trigger: 'Schedule',
    status: 'Active',
    lastRun: '12m ago'
  },
  {
    id: 'wf-3',
    name: 'Email Campaign',
    trigger: 'Manual',
    status: 'Paused',
    lastRun: '1h ago'
  },
  {
    id: 'wf-4',
    name: 'Inventory Sync',
    trigger: 'Webhook',
    status: 'Active',
    lastRun: '3h ago'
  }
];

export default function WorkflowsView({ onOpenAuthModal }) {
  const { currentUser } = useAuth();
  const [workflows, setWorkflows] = useState(DEFAULT_WORKFLOWS);
  const [loading, setLoading] = useState(Boolean(currentUser));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('Webhook');
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    if (!currentUser) {
      setWorkflows(DEFAULT_WORKFLOWS);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeUserWorkflows(
      currentUser.uid,
      (userWfs) => {
        if (userWfs.length > 0) {
          const formatted = userWfs.map(w => ({
            id: w.id,
            name: w.name || 'Unnamed Workflow',
            trigger: w.trigger || 'Webhook',
            status: w.enabled ? 'Active' : 'Paused',
            lastRun: w.lastRun || 'Just now'
          }));
          setWorkflows(formatted);
        } else {
          setWorkflows(DEFAULT_WORKFLOWS);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Workflows subscription error:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handleOpenModal = () => {
    setName('');
    setTrigger('Webhook');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const handleCreateWorkflow = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const newWf = {
      name: name.trim(),
      trigger,
      status,
      enabled: status === 'Active',
      lastRun: 'Just now'
    };

    if (currentUser) {
      try {
        await createUserWorkflow(currentUser.uid, newWf);
      } catch (err) {
        console.error('Error creating workflow:', err);
      }
    } else {
      setWorkflows([
        { id: `local-${Date.now()}`, ...newWf },
        ...workflows
      ]);
    }

    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  const handleToggleStatus = async (wf) => {
    const isCurrentlyActive = wf.status === 'Active';
    const nextStatus = isCurrentlyActive ? 'Paused' : 'Active';

    if (currentUser) {
      try {
        await toggleUserWorkflow(currentUser.uid, wf.id, isCurrentlyActive);
      } catch (err) {
        console.error('Error toggling workflow:', err);
      }
    } else {
      setWorkflows(workflows.map(w => w.id === wf.id ? { ...w, status: nextStatus } : w));
    }
    setActiveMenuId(null);
  };

  const handleDeleteWorkflow = async (wfId) => {
    if (currentUser) {
      try {
        await deleteUserWorkflow(currentUser.uid, wfId);
      } catch (err) {
        console.error('Error deleting workflow:', err);
      }
    } else {
      setWorkflows(workflows.filter(w => w.id !== wfId));
    }
    setActiveMenuId(null);
  };

  const totalCount = workflows.length;
  const activeCount = workflows.filter(w => w.status === 'Active').length;
  const pausedCount = workflows.filter(w => w.status === 'Paused').length;
  const completedCount = 0;

  return (
    <div className="subpage-root">
      {/* Header Row (Matching Thumbnail 2 in Reference Image 1) */}
      <div className="subpage-header-row">
        <div>
          <h1 className="subpage-title">Workflows</h1>
          <p className="subpage-subtitle">Create and manage your automation pipelines.</p>
        </div>

        <button 
          type="button" 
          className="btn-deploy-yellow"
          onClick={handleOpenModal}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>New Workflow Pipeline</span>
        </button>
      </div>

      {/* 4 Stat Cards: Total Workflows, Active, Paused, Completed */}
      <div className="subpage-stats-grid">
        <div className="subpage-stat-card">
          <div className="stat-card-label">Total Workflows</div>
          <div className="stat-card-value">{totalCount}</div>
        </div>
        <div className="subpage-stat-card">
          <div className="stat-card-label">Active</div>
          <div className="stat-card-value-row">
            <span className="stat-card-value">{activeCount}</span>
            <span className="stat-dot dot-green"></span>
          </div>
        </div>
        <div className="subpage-stat-card">
          <div className="stat-card-label">Paused</div>
          <div className="stat-card-value-row">
            <span className="stat-card-value">{pausedCount}</span>
            <span className="stat-dot dot-amber"></span>
          </div>
        </div>
        <div className="subpage-stat-card">
          <div className="stat-card-label">Completed</div>
          <div className="stat-card-value-row">
            <span className="stat-card-value">{completedCount}</span>
            <span className="stat-dot dot-gray"></span>
          </div>
        </div>
      </div>

      {/* Table Card (Reference Image 1) */}
      <div className="overview-card table-card">
        <div className="clean-table-responsive">
          <table className="clean-data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Trigger</th>
                <th>Status</th>
                <th>Last Run</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workflows.map((wf) => (
                <tr key={wf.id}>
                  <td className="font-semibold">{wf.name}</td>
                  <td className="text-muted">{wf.trigger}</td>
                  <td>
                    <span className={`table-badge badge-${wf.status?.toLowerCase() || 'active'}`}>
                      {wf.status}
                    </span>
                  </td>
                  <td className="text-muted">{wf.lastRun}</td>
                  <td style={{ textAlign: 'right', position: 'relative' }}>
                    <button 
                      type="button" 
                      className="btn-dots-action"
                      onClick={() => setActiveMenuId(activeMenuId === wf.id ? null : wf.id)}
                      title="Actions"
                    >
                      ⋮
                    </button>

                    {activeMenuId === wf.id && (
                      <div className="dots-menu-popover" onClick={(e) => e.stopPropagation()}>
                        <button 
                          type="button" 
                          className="dots-menu-item"
                          onClick={() => handleToggleStatus(wf)}
                        >
                          {wf.status === 'Active' ? 'Pause Pipeline' : 'Resume Pipeline'}
                        </button>
                        <button 
                          type="button" 
                          className="dots-menu-item text-danger"
                          onClick={() => handleDeleteWorkflow(wf.id)}
                        >
                          Delete Workflow
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Workflow Modal */}
      {isModalOpen && (
        <div className="custom-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h2 className="modal-title">Create Workflow Pipeline</h2>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateWorkflow} className="modal-form-flow">
              <div className="modal-field">
                <label className="modal-label">Pipeline Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Stripe Payment Ingestion"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="modal-input"
                />
              </div>

              <div className="modal-field">
                <label className="modal-label">Trigger Protocol</label>
                <select 
                  value={trigger} 
                  onChange={(e) => setTrigger(e.target.value)}
                  className="modal-select"
                >
                  <option value="Webhook">Webhook</option>
                  <option value="Schedule">Schedule</option>
                  <option value="Manual">Manual</option>
                  <option value="Event Stream">Event Stream</option>
                </select>
              </div>

              <div className="modal-field">
                <label className="modal-label">Initial State</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="modal-select"
                >
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                </select>
              </div>

              <div className="modal-actions-footer">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-deploy-yellow"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Pipeline'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
