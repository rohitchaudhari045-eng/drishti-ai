import React from 'react';

const HOURLY_DATA = [
  { hour: '00:00', tasks: 1200, height: '35%' },
  { hour: '03:00', tasks: 850, height: '25%' },
  { hour: '06:00', tasks: 1900, height: '55%' },
  { hour: '09:00', tasks: 3400, height: '90%' },
  { hour: '12:00', tasks: 3800, height: '100%' },
  { hour: '15:00', tasks: 3200, height: '85%' },
  { hour: '18:00', tasks: 2600, height: '70%' },
  { hour: '21:00', tasks: 1750, height: '48%' }
];

export default function AnalyticsView() {
  return (
    <div className="tab-view-container">
      <div className="section-block-header">
        <div>
          <h2 className="block-title">Operational Analytics</h2>
          <p className="block-sub">Aggregated system telemetry, execution volume, and latency percentiles</p>
        </div>
      </div>

      {/* Hourly Load Graph Card */}
      <div className="card analytics-chart-card">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Hourly Task Processing Volume</h3>
            <p className="chart-subtitle">Sample distribution over the last 24-hour cycle</p>
          </div>
          <div className="chart-legend">
            <span className="legend-indicator"></span>
            <span>Task Runs / Hour</span>
          </div>
        </div>

        {/* CSS Bar Chart */}
        <div className="bar-chart-container">
          {HOURLY_DATA.map((item, idx) => (
            <div key={idx} className="bar-column">
              <div className="bar-wrapper">
                <div 
                  className="bar-fill" 
                  style={{ height: item.height }}
                  title={`${item.tasks.toLocaleString()} tasks at ${item.hour}`}
                ></div>
              </div>
              <span className="bar-label">{item.hour}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="analytics-metrics-grid">
        <div className="card breakdown-card">
          <h4 className="breakdown-title">Latency Breakdown</h4>
          <div className="breakdown-item">
            <span>P50 Median</span>
            <span className="text-yellow">92 ms</span>
          </div>
          <div className="breakdown-item">
            <span>P90 Threshold</span>
            <span>145 ms</span>
          </div>
          <div className="breakdown-item">
            <span>P99 Extreme</span>
            <span>230 ms</span>
          </div>
        </div>

        <div className="card breakdown-card">
          <h4 className="breakdown-title">Trigger Protocol Distribution</h4>
          <div className="breakdown-item">
            <span>Inbound Webhooks</span>
            <span className="text-yellow">54%</span>
          </div>
          <div className="breakdown-item">
            <span>Cron Schedules</span>
            <span>31%</span>
          </div>
          <div className="breakdown-item">
            <span>REST API Calls</span>
            <span>15%</span>
          </div>
        </div>

        <div className="card breakdown-card">
          <h4 className="breakdown-title">Error Fault Tolerances</h4>
          <div className="breakdown-item">
            <span>Auto-Retried & Resolved</span>
            <span className="text-yellow">98.4%</span>
          </div>
          <div className="breakdown-item">
            <span>Dead-Letter Escalated</span>
            <span>0.06%</span>
          </div>
          <div className="breakdown-item">
            <span>Dropped / Invalid</span>
            <span>1.54%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
