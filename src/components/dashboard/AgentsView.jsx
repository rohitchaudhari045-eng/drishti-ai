import React from 'react';

const AGENTS = [
  {
    name: 'Ingestion Sentinel',
    role: 'Data Parsing & Schema Normalization',
    model: 'DRISHTI Structural Parser v1',
    status: 'Active',
    uptime: '99.99%',
    tasks24h: '18,420',
    description: 'Inspects inbound payload structures from webhooks and REST endpoints, ensuring strict type safety.'
  },
  {
    name: 'Logic Evaluator',
    role: 'Deterministic Rule Execution',
    model: 'DRISHTI Rules Engine v2.4',
    status: 'Active',
    uptime: '100%',
    tasks24h: '24,110',
    description: 'Executes branching business policies and triggers downstream webhooks when conditions are met.'
  },
  {
    name: 'Discrepancy Resolver',
    role: 'Anomaly Detection & Deduplication',
    model: 'Statistical Heuristic Model',
    status: 'Standby',
    uptime: '99.95%',
    tasks24h: '4,890',
    description: 'Identifies duplicated transactional records and prepares remediation alerts for operators.'
  },
  {
    name: 'Audit Dispatcher',
    role: 'Security & Compliance Logging',
    model: 'Immutable Ledger Bridge',
    status: 'Active',
    uptime: '100%',
    tasks24h: '48,290',
    description: 'Streams signed execution hashes and trace diagnostics to external monitoring stacks.'
  }
];

export default function AgentsView() {
  return (
    <div className="tab-view-container">
      <div className="section-block-header">
        <div>
          <h2 className="block-title">AI Agent Fleet</h2>
          <p className="block-sub">Configured agent modules executing background operational tasks</p>
        </div>
        <div className="badge">
          <span className="badge-dot"></span> 4 Registered Agents
        </div>
      </div>

      <div className="agents-grid">
        {AGENTS.map((agent, idx) => (
          <div key={idx} className="card agent-card card-yellow-glow">
            <div className="agent-card-header">
              <div className="agent-avatar">🤖</div>
              <div className="agent-title-box">
                <h3 className="agent-name">{agent.name}</h3>
                <span className="agent-role">{agent.role}</span>
              </div>
              <span className={`status-pill status-${agent.status.toLowerCase()}`}>
                {agent.status}
              </span>
            </div>

            <p className="agent-desc">{agent.description}</p>

            <div className="agent-meta-grid">
              <div className="agent-meta-item">
                <span className="meta-label">Model Core</span>
                <span className="meta-val">{agent.model}</span>
              </div>
              <div className="agent-meta-item">
                <span className="meta-label">24h Task Runs</span>
                <span className="meta-val text-yellow">{agent.tasks24h}</span>
              </div>
              <div className="agent-meta-item">
                <span className="meta-label">Uptime SLA</span>
                <span className="meta-val">{agent.uptime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
