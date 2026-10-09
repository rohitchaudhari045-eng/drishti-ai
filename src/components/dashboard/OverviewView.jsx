import React, { useState } from 'react';

const INITIAL_METRICS = [
  {
    title: 'Active Workflows',
    value: '12 / 12',
    subtext: '100% operational capacity',
    trend: '+2 added this week',
    trendType: 'positive',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    )
  },
  {
    title: 'Tasks Processed (24h)',
    value: '48,290',
    subtext: 'Across 4 connected agents',
    trend: '+14.2% vs yesterday',
    trendType: 'positive',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    )
  },
  {
    title: 'Automation Success Rate',
    value: '99.94%',
    subtext: 'Deterministic rule execution',
    trend: 'Zero unhandled faults',
    trendType: 'highlight',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    )
  },
  {
    title: 'Avg Execution Latency',
    value: '128 ms',
    subtext: 'P95 latency: 194ms',
    trend: '-18ms faster',
    trendType: 'positive',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 14 14"></polyline>
      </svg>
    )
  }
];

const INITIAL_PIPELINES = [
  {
    id: 'pipe-1',
    name: 'Customer Ingestion & Verification',
    source: 'Webhook (Stripe / Auth0)',
    target: 'PostgreSQL + CRM Sync',
    throughput: '1,420 events/min',
    status: 'Healthy',
    progress: 92
  },
  {
    id: 'pipe-2',
    name: 'Enterprise Invoice Reconciliation',
    source: 'Scheduled Cron (Hourly)',
    target: 'ERP Ledger & Audit Trail',
    throughput: '340 batch docs/hr',
    status: 'Running',
    progress: 68
  },
  {
    id: 'pipe-3',
    name: 'Real-Time Telemetry & Alerting',
    source: 'Event Stream (Kafka / Webhooks)',
    target: 'Slack Dispatch & Sentry',
    throughput: '5,890 events/min',
    status: 'Healthy',
    progress: 100
  }
];

const INITIAL_ACTIVITIES = [
  {
    id: 'TXN-8849',
    workflow: 'Customer Ingestion & Verification',
    trigger: 'Webhook Event',
    executionTime: '84 ms',
    timestamp: 'Just now',
    status: 'Success'
  },
  {
    id: 'TXN-8848',
    workflow: 'Enterprise Invoice Reconciliation',
    trigger: 'Cron Scheduler',
    executionTime: '210 ms',
    timestamp: '2 mins ago',
    status: 'Running'
  },
  {
    id: 'TXN-8847',
    workflow: 'Lead Qualification & Routing',
    trigger: 'REST API Ingestion',
    executionTime: '115 ms',
    timestamp: '5 mins ago',
    status: 'Success'
  },
  {
    id: 'TXN-8846',
    workflow: 'Compliance Policy Evaluation',
    trigger: 'Schema Validator',
    executionTime: '42 ms',
    timestamp: '8 mins ago',
    status: 'Filtered'
  },
  {
    id: 'TXN-8845',
    workflow: 'Customer Ingestion & Verification',
    trigger: 'Webhook Event',
    executionTime: '98 ms',
    timestamp: '12 mins ago',
    status: 'Success'
  }
];

export default function OverviewView() {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [notification, setNotification] = useState(null);

  const handleSimulateEvent = () => {
    const newTxnId = `TXN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEntry = {
      id: newTxnId,
      workflow: 'Lead Qualification & Routing',
      trigger: 'Manual Sample Trigger',
      executionTime: `${Math.floor(60 + Math.random() * 80)} ms`,
      timestamp: 'Just now',
      status: 'Success'
    };
    setActivities([newEntry, ...activities.slice(0, 5)]);
    setNotification(`Sample event ${newTxnId} processed successfully.`);
    setTimeout(() => setNotification(null), 3500);
  };

  const filteredActivities = activities.filter((act) => {
    if (filterStatus === 'ALL') return true;
    return act.status.toUpperCase() === filterStatus;
  });

  return (
    <div className="overview-container">
      {/* Toast Notification */}
      {notification && (
        <div className="dashboard-toast">
          <span className="toast-icon">⚡</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="welcome-banner card">
        <div className="welcome-content">
          <div className="badge" style={{ marginBottom: '12px' }}>
            <span className="badge-dot"></span>
            Live Operational Telemetry
          </div>
          <h2 className="welcome-title">
            Welcome to the <span className="text-gradient-yellow">DRISHTI AI</span> Control Plane
          </h2>
          <p className="welcome-desc">
            All automation pipelines, agent runners, and compliance guardrails are running deterministically. 
            All values below represent realistic demo runtime telemetry.
          </p>
        </div>
        <div className="welcome-actions">
          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={handleSimulateEvent}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Trigger Sample Event
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="metrics-grid">
        {INITIAL_METRICS.map((metric, idx) => (
          <div key={idx} className="card metric-card card-yellow-glow">
            <div className="metric-header">
              <span className="metric-title">{metric.title}</span>
              <div className="metric-icon-box">{metric.icon}</div>
            </div>
            <div className="metric-value">{metric.value}</div>
            <div className="metric-footer">
              <span className={`metric-trend ${metric.trendType}`}>
                {metric.trend}
              </span>
              <span className="metric-subtext">{metric.subtext}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Pipeline Status Monitors */}
      <div className="dashboard-section-block">
        <div className="section-block-header">
          <div>
            <h3 className="block-title">Active Workflow Pipelines</h3>
            <p className="block-sub">Continuous execution health & throughput monitoring</p>
          </div>
          <span className="pipeline-count-pill">3 Active Pipelines</span>
        </div>

        <div className="pipelines-grid">
          {INITIAL_PIPELINES.map((pipe) => (
            <div key={pipe.id} className="card pipeline-card">
              <div className="pipeline-card-top">
                <div className="pipeline-card-title-group">
                  <span className="pipeline-name">{pipe.name}</span>
                  <span className="pipeline-io">{pipe.source} &rarr; {pipe.target}</span>
                </div>
                <span className={`status-pill status-${pipe.status.toLowerCase()}`}>
                  {pipe.status}
                </span>
              </div>

              <div className="pipeline-progress-wrapper">
                <div className="pipeline-progress-bar">
                  <div 
                    className="pipeline-progress-fill" 
                    style={{ width: `${pipe.progress}%` }}
                  ></div>
                </div>
                <div className="pipeline-progress-meta">
                  <span>Throughput: {pipe.throughput}</span>
                  <span className="text-yellow">{pipe.progress}% capacity</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="dashboard-section-block">
        <div className="section-block-header table-header-flex">
          <div>
            <h3 className="block-title">Recent Execution Activity</h3>
            <p className="block-sub">Live audit trail of evaluated automation tasks</p>
          </div>

          {/* Filter Status Buttons */}
          <div className="table-filter-group">
            {['ALL', 'SUCCESS', 'RUNNING', 'FILTERED'].map((st) => (
              <button
                key={st}
                type="button"
                className={`table-filter-btn ${filterStatus === st ? 'active' : ''}`}
                onClick={() => setFilterStatus(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="table-responsive card" style={{ padding: 0 }}>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Execution ID</th>
                <th>Workflow Name</th>
                <th>Trigger Source</th>
                <th>Duration</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No execution events matching filter "{filterStatus}".
                  </td>
                </tr>
              ) : (
                filteredActivities.map((row) => (
                  <tr key={row.id}>
                    <td className="code-font">{row.id}</td>
                    <td className="workflow-col">{row.workflow}</td>
                    <td className="trigger-col">{row.trigger}</td>
                    <td className="duration-col">{row.executionTime}</td>
                    <td className="time-col">{row.timestamp}</td>
                    <td>
                      <span className={`status-badge status-badge-${row.status.toLowerCase()}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
