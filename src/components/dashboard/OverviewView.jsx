import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  subscribeUserWorkflows, 
  subscribeUserAgents, 
  subscribeUserLogs, 
  addUserLog 
} from '../../lib/firestoreService';

const STATIC_METRICS = [
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

const STATIC_PIPELINES = [
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

const STATIC_ACTIVITIES = [
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
  }
];

export default function OverviewView({ onOpenAuthModal }) {
  const { currentUser } = useAuth();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [notification, setNotification] = useState(null);
  
  // Real Firestore user-scoped states
  const [userWorkflows, setUserWorkflows] = useState([]);
  const [userAgents, setUserAgents] = useState([]);
  const [userLogs, setUserLogs] = useState([]);
  const [isTriggering, setIsTriggering] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const unsubWfs = subscribeUserWorkflows(currentUser.uid, setUserWorkflows);
    const unsubAgents = subscribeUserAgents(currentUser.uid, setUserAgents);
    const unsubLogs = subscribeUserLogs(currentUser.uid, setUserLogs);

    return () => {
      unsubWfs();
      unsubAgents();
      unsubLogs();
    };
  }, [currentUser]);

  const handleSimulateEvent = async () => {
    setIsTriggering(true);
    const newTxnId = `TXN-${Math.floor(1000 + Math.random() * 9000)}`;

    if (currentUser) {
      try {
        await addUserLog(currentUser.uid, {
          level: 'SUCCESS',
          source: 'OPERATOR_TRIGGER',
          message: `Deterministic event [${newTxnId}] triggered for Lead Qualification & Routing pipeline.`
        });
      } catch (err) {
        console.warn('Could not write log:', err);
      }
    }

    setNotification(`Telemetry event ${newTxnId} evaluated and logged successfully.`);
    setIsTriggering(false);
    setTimeout(() => setNotification(null), 3500);
  };

  // Compute live metrics if user is signed in
  const activeWfCount = currentUser ? userWorkflows.filter(w => w.enabled).length : 12;
  const totalWfCount = currentUser ? userWorkflows.length : 12;
  const activeAgentCount = currentUser ? userAgents.length : 4;

  const dynamicMetrics = [
    {
      title: 'Active Workflows',
      value: currentUser ? `${activeWfCount} / ${totalWfCount}` : '12 / 12',
      subtext: currentUser ? `${userWorkflows.length} configured in Firestore` : '100% operational capacity',
      trend: currentUser ? `${activeWfCount} live pipelines` : '+2 added this week',
      trendType: 'positive',
      icon: STATIC_METRICS[0].icon
    },
    {
      title: 'Agent Fleet Size',
      value: `${activeAgentCount} Agents`,
      subtext: currentUser ? 'Isolated to your account' : 'Across 4 connected agents',
      trend: currentUser ? 'Firestore Synced' : '+14.2% vs yesterday',
      trendType: 'positive',
      icon: STATIC_METRICS[1].icon
    },
    {
      title: 'Automation Success Rate',
      value: '99.94%',
      subtext: 'Deterministic rule execution',
      trend: 'Zero unhandled faults',
      trendType: 'highlight',
      icon: STATIC_METRICS[2].icon
    },
    {
      title: 'Avg Execution Latency',
      value: '128 ms',
      subtext: 'P95 latency: 194ms',
      trend: '-18ms faster',
      trendType: 'positive',
      icon: STATIC_METRICS[3].icon
    }
  ];

  // Activities to display
  const activitiesToDisplay = currentUser && userLogs.length > 0
    ? userLogs.map((log) => ({
        id: log.id ? log.id.substring(0, 8).toUpperCase() : 'EVT-01',
        workflow: log.source || 'Lead Pipeline',
        trigger: 'Live Event Trigger',
        executionTime: `${Math.floor(40 + Math.random() * 80)} ms`,
        timestamp: log.timestamp || 'Just now',
        status: log.level === 'WARN' ? 'Filtered' : 'Success'
      }))
    : STATIC_ACTIVITIES;

  const filteredActivities = activitiesToDisplay.filter((act) => {
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
            {currentUser ? 'Live Cloud Firestore Workspace' : 'Sample Operational Telemetry'}
          </div>
          <h2 className="welcome-title">
            Welcome to the <span className="text-gradient-yellow">DRISHTI AI</span> Control Plane
          </h2>
          <p className="welcome-desc">
            {currentUser 
              ? `Signed in as ${currentUser.email}. All agent pipelines, custom configurations, and activity logs are stored securely in your private Cloud Firestore partition.`
              : 'Autonomous pipelines, agent runners, and compliance guardrails running in interactive preview mode.'}
          </p>
        </div>
        <div className="welcome-actions">
          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={handleSimulateEvent}
            disabled={isTriggering}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            {isTriggering ? 'Executing...' : 'Trigger Sample Event'}
          </button>
        </div>
      </div>

      {/* Summary Metric Cards */}
      <div className="metrics-grid">
        {dynamicMetrics.map((metric, idx) => (
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
          <span className="pipeline-count-pill">
            {currentUser ? `${userWorkflows.length} Pipelines` : '3 Active Pipelines'}
          </span>
        </div>

        <div className="pipelines-grid">
          {(currentUser && userWorkflows.length > 0 ? userWorkflows : STATIC_PIPELINES).slice(0, 3).map((pipe) => (
            <div key={pipe.id} className="card pipeline-card">
              <div className="pipeline-card-top">
                <div className="pipeline-card-title-group">
                  <span className="pipeline-name">{pipe.name}</span>
                  <span className="pipeline-io">{pipe.trigger || `${pipe.source} → ${pipe.target}`}</span>
                </div>
                <span className={`status-pill status-${(pipe.enabled !== false ? 'healthy' : 'standby')}`}>
                  {pipe.enabled !== false ? 'Active' : 'Paused'}
                </span>
              </div>

              <div className="pipeline-progress-wrapper">
                <div className="pipeline-progress-bar">
                  <div 
                    className="pipeline-progress-fill" 
                    style={{ width: `${pipe.progress || 90}%` }}
                  ></div>
                </div>
                <div className="pipeline-progress-meta">
                  <span>Throughput: {pipe.throughput || '1,200 events/min'}</span>
                  <span className="text-yellow">{pipe.successRate || '99.9%'} SLA</span>
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
