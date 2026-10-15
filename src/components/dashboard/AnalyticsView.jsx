import React from 'react';

const HOURLY_DATA = [
  { hour: 'Mon', tasks: 1200, height: '45%' },
  { hour: 'Tue', tasks: 1850, height: '60%' },
  { hour: 'Wed', tasks: 2900, height: '85%' },
  { hour: 'Thu', tasks: 2400, height: '72%' },
  { hour: 'Fri', tasks: 3800, height: '100%' },
  { hour: 'Sat', tasks: 2100, height: '65%' },
  { hour: 'Sun', tasks: 2600, height: '78%' }
];

export default function AnalyticsView() {
  return (
    <div className="subpage-root">
      <div className="subpage-header-row">
        <div>
          <h1 className="subpage-title">Analytics</h1>
          <p className="subpage-subtitle">Platform telemetry, operational volume, and system latency percentiles.</p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="subpage-stats-grid">
        <div className="subpage-stat-card">
          <div className="stat-card-label">Total Executions</div>
          <div className="stat-card-value">16,850</div>
        </div>
        <div className="subpage-stat-card">
          <div className="stat-card-label">Avg SLA Uptime</div>
          <div className="stat-card-value-row">
            <span className="stat-card-value">99.98%</span>
            <span className="stat-dot dot-green"></span>
          </div>
        </div>
        <div className="subpage-stat-card">
          <div className="stat-card-label">Median Latency</div>
          <div className="stat-card-value-row">
            <span className="stat-card-value">42 ms</span>
            <span className="stat-dot dot-amber"></span>
          </div>
        </div>
        <div className="subpage-stat-card">
          <div className="stat-card-label">Failed Runs</div>
          <div className="stat-card-value-row">
            <span className="stat-card-value">0</span>
            <span className="stat-dot dot-gray"></span>
          </div>
        </div>
      </div>

      {/* Hourly Load Graph Card */}
      <div className="overview-card chart-card" style={{ marginBottom: '24px' }}>
        <div className="card-header-flex">
          <div>
            <h2 className="card-box-title">Weekly Processing Volume</h2>
            <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '4px' }}>
              Execution throughput aggregated across all active agent pipelines
            </p>
          </div>
          <div className="chart-legend-row">
            <span className="legend-item">
              <span className="legend-dot dot-yellow"></span>
              <span>Task Executions</span>
            </span>
          </div>
        </div>

        {/* Clean CSS Bar Chart matching light theme */}
        <div className="analytics-bar-chart-container">
          {HOURLY_DATA.map((item, idx) => (
            <div key={idx} className="analytics-bar-column">
              <div className="analytics-bar-wrapper">
                <div 
                  className="analytics-bar-fill" 
                  style={{ height: item.height }}
                  title={`${item.tasks.toLocaleString()} tasks on ${item.hour}`}
                ></div>
              </div>
              <span className="analytics-bar-label">{item.hour}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Latency & Protocol Breakdown */}
      <div className="analytics-breakdown-grid">
        <div className="overview-card">
          <h3 className="card-box-title" style={{ marginBottom: '16px' }}>Latency Breakdown</h3>
          <div className="breakdown-stat-row">
            <span className="text-muted">P50 Median</span>
            <span className="font-semibold">38 ms</span>
          </div>
          <div className="breakdown-stat-row">
            <span className="text-muted">P90 Threshold</span>
            <span className="font-semibold">72 ms</span>
          </div>
          <div className="breakdown-stat-row">
            <span className="text-muted">P99 Maximum</span>
            <span className="font-semibold">118 ms</span>
          </div>
        </div>

        <div className="overview-card">
          <h3 className="card-box-title" style={{ marginBottom: '16px' }}>Protocol Distribution</h3>
          <div className="breakdown-stat-row">
            <span className="text-muted">Inbound Webhooks</span>
            <span className="font-semibold text-green">58%</span>
          </div>
          <div className="breakdown-stat-row">
            <span className="text-muted">Cron Schedules</span>
            <span className="font-semibold">27%</span>
          </div>
          <div className="breakdown-stat-row">
            <span className="text-muted">Direct REST Triggers</span>
            <span className="font-semibold">15%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
