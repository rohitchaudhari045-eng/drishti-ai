import React, { useState } from 'react';

const INITIAL_WORKFLOWS = [
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

export default function WorkflowsView() {
  const [workflows, setWorkflows] = useState(INITIAL_WORKFLOWS);

  const toggleWorkflow = (id) => {
    setWorkflows(workflows.map((wf) => 
      wf.id === id ? { ...wf, enabled: !wf.enabled } : wf
    ));
  };

  return (
    <div className="tab-view-container">
      <div className="section-block-header table-header-flex">
        <div>
          <h2 className="block-title">Workflow Catalog</h2>
          <p className="block-sub">Configured multi-step automated execution pipelines</p>
        </div>
        <button 
          type="button" 
          className="btn btn-primary btn-sm"
          onClick={() => alert('Demo Mode: Workflow creation wizard is a placeholder for future backend integration.')}
        >
          + New Workflow Pipeline
        </button>
      </div>

      <div className="workflows-list">
        {workflows.map((wf) => (
          <div key={wf.id} className="card workflow-item-card">
            <div className="workflow-item-left">
              <div className="workflow-icon">⚡</div>
              <div>
                <h3 className="workflow-name">{wf.name}</h3>
                <div className="workflow-meta">
                  <span className="code-font">{wf.id}</span>
                  <span>•</span>
                  <span>Trigger: {wf.trigger}</span>
                  <span>•</span>
                  <span>{wf.steps} Configured Steps</span>
                </div>
              </div>
            </div>

            <div className="workflow-item-right">
              <div className="workflow-stat-pill">
                <span className="meta-label">Success Rate</span>
                <span className="text-yellow" style={{ fontWeight: 700 }}>{wf.successRate}</span>
              </div>
              
              <div className="workflow-stat-pill">
                <span className="meta-label">Last Run</span>
                <span>{wf.lastRun}</span>
              </div>

              {/* Status Toggle Switch */}
              <button
                type="button"
                className={`toggle-switch-btn ${wf.enabled ? 'is-enabled' : ''}`}
                onClick={() => toggleWorkflow(wf.id)}
                title={wf.enabled ? 'Click to pause workflow' : 'Click to enable workflow'}
              >
                <span className="toggle-slider"></span>
                <span className="toggle-text">{wf.enabled ? 'Active' : 'Paused'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
