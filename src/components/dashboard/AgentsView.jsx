import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  subscribeUserAgents, 
  createUserAgent, 
  deleteUserAgent, 
  updateUserAgent 
} from '../../lib/firestoreService';

const DEFAULT_AGENTS = [
  {
    id: 'agent-1',
    name: 'Customer Support Agent',
    role: 'Support',
    status: 'Active',
    lastActive: '2m ago'
  },
  {
    id: 'agent-2',
    name: 'Data Analyst Agent',
    role: 'Analytics',
    status: 'Active',
    lastActive: '12m ago'
  },
  {
    id: 'agent-3',
    name: 'Content Creator Agent',
    role: 'Marketing',
    status: 'Standby',
    lastActive: '1h ago'
  },
  {
    id: 'agent-4',
    name: 'Sales Assistant Agent',
    role: 'Sales',
    status: 'Active',
    lastActive: '2h ago'
  },
  {
    id: 'agent-5',
    name: 'Research Agent',
    role: 'Research',
    status: 'Active',
    lastActive: '5h ago'
  }
];

export default function AgentsView({ onOpenAuthModal }) {
  const { currentUser } = useAuth();
  const [agents, setAgents] = useState(DEFAULT_AGENTS);
  const [loading, setLoading] = useState(Boolean(currentUser));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('Support');
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    if (!currentUser) {
      setAgents(DEFAULT_AGENTS);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeUserAgents(
      currentUser.uid,
      (userAgents) => {
        if (userAgents.length > 0) {
          // Merge user agents with defaults format
          const formatted = userAgents.map(a => ({
            id: a.id,
            name: a.name || 'Unnamed Agent',
            role: a.role || 'Support',
            status: a.status || 'Active',
            lastActive: a.lastActive || 'Just now'
          }));
          setAgents(formatted);
        } else {
          setAgents(DEFAULT_AGENTS);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Agents subscription error:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handleOpenModal = () => {
    setName('');
    setRole('Support');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const newAgent = {
      name: name.trim(),
      role,
      status,
      lastActive: 'Just now'
    };

    if (currentUser) {
      try {
        await createUserAgent(currentUser.uid, newAgent);
      } catch (err) {
        console.error('Error creating agent:', err);
      }
    } else {
      // Local state fallback for guest mode
      setAgents([
        { id: `local-${Date.now()}`, ...newAgent },
        ...agents
      ]);
    }

    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  const handleToggleStatus = async (agent) => {
    const nextStatus = agent.status === 'Active' ? 'Standby' : 'Active';
    if (currentUser) {
      try {
        await updateUserAgent(currentUser.uid, agent.id, { status: nextStatus });
      } catch (err) {
        console.error('Error updating status:', err);
      }
    } else {
      setAgents(agents.map(a => a.id === agent.id ? { ...a, status: nextStatus } : a));
    }
    setActiveMenuId(null);
  };

  const handleDeleteAgent = async (agentId) => {
    if (currentUser) {
      try {
        await deleteUserAgent(currentUser.uid, agentId);
      } catch (err) {
        console.error('Error deleting agent:', err);
      }
    } else {
      setAgents(agents.filter(a => a.id !== agentId));
    }
    setActiveMenuId(null);
  };

  const totalCount = agents.length;
  const activeCount = agents.filter(a => a.status === 'Active').length;
  const standbyCount = agents.filter(a => a.status === 'Standby').length;
  const offlineCount = agents.filter(a => a.status === 'Offline').length;

  return (
    <div className="subpage-root">
      {/* Header Row (Matching Reference Image 1) */}
      <div className="subpage-header-row">
        <div>
          <h1 className="subpage-title">AI Agents</h1>
          <p className="subpage-subtitle">Manage and deploy your AI agents.</p>
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
          <span>Deploy New Agent</span>
        </button>
      </div>

      {/* 4 Stat Cards: Total Agents, Active, Standby, Offline */}
      <div className="subpage-stats-grid">
        <div className="subpage-stat-card">
          <div className="stat-card-label">Total Agents</div>
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
          <div className="stat-card-label">Standby</div>
          <div className="stat-card-value-row">
            <span className="stat-card-value">{standbyCount}</span>
            <span className="stat-dot dot-amber"></span>
          </div>
        </div>
        <div className="subpage-stat-card">
          <div className="stat-card-label">Offline</div>
          <div className="stat-card-value-row">
            <span className="stat-card-value">{offlineCount}</span>
            <span className="stat-dot dot-gray"></span>
          </div>
        </div>
      </div>

      {/* Modern Data Table Card (Reference Image 1) */}
      <div className="overview-card table-card">
        <div className="clean-table-responsive">
          <table className="clean-data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Active</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id}>
                  <td className="font-semibold">{agent.name}</td>
                  <td className="text-muted">{agent.role}</td>
                  <td>
                    <span className={`table-badge badge-${agent.status?.toLowerCase() || 'active'}`}>
                      {agent.status}
                    </span>
                  </td>
                  <td className="text-muted">{agent.lastActive}</td>
                  <td style={{ textAlign: 'right', position: 'relative' }}>
                    <button 
                      type="button" 
                      className="btn-dots-action"
                      onClick={() => setActiveMenuId(activeMenuId === agent.id ? null : agent.id)}
                      title="Actions"
                    >
                      ⋮
                    </button>

                    {activeMenuId === agent.id && (
                      <div className="dots-menu-popover" onClick={(e) => e.stopPropagation()}>
                        <button 
                          type="button" 
                          className="dots-menu-item"
                          onClick={() => handleToggleStatus(agent)}
                        >
                          Mark as {agent.status === 'Active' ? 'Standby' : 'Active'}
                        </button>
                        <button 
                          type="button" 
                          className="dots-menu-item text-danger"
                          onClick={() => handleDeleteAgent(agent.id)}
                        >
                          Delete Agent
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

      {/* Deploy Agent Modal */}
      {isModalOpen && (
        <div className="custom-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h2 className="modal-title">Deploy New AI Agent</h2>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateAgent} className="modal-form-flow">
              <div className="modal-field">
                <label className="modal-label">Agent Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Ingestion Pipeline Agent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="modal-input"
                />
              </div>

              <div className="modal-field">
                <label className="modal-label">Role</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  className="modal-select"
                >
                  <option value="Support">Support</option>
                  <option value="Analytics">Analytics</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Research">Research</option>
                  <option value="Engineering">Engineering</option>
                </select>
              </div>

              <div className="modal-field">
                <label className="modal-label">Initial Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="modal-select"
                >
                  <option value="Active">Active</option>
                  <option value="Standby">Standby</option>
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
                  {isSubmitting ? 'Deploying...' : 'Deploy Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
