import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  subscribeUserWorkflows, 
  subscribeUserAgents, 
  subscribeUserLogs 
} from '../../lib/firestoreService';

export default function OverviewView({ onOpenAuthModal, onNavigateToLogin, onSelectTab }) {
  const { currentUser } = useAuth();
  const [hoveredDay, setHoveredDay] = useState('Fri');

  // Real Firestore user-scoped states
  const [userWorkflows, setUserWorkflows] = useState([]);
  const [userAgents, setUserAgents] = useState([]);
  const [userLogs, setUserLogs] = useState([]);

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

  const firstName = currentUser?.displayName 
    ? currentUser.displayName.split(' ')[0] 
    : 'Rohit';

  // Live or fallback metrics matching Reference Image 1
  const totalAgents = currentUser && userAgents.length > 0 ? userAgents.length : 5;
  const activeWorkflows = currentUser && userWorkflows.length > 0 ? userWorkflows.filter(w => w.enabled).length : 3;
  const successfulExecutions = currentUser && userLogs.length > 0 ? (48 + userLogs.length) : 48;
  const recentActivityCount = currentUser && userLogs.length > 0 ? (12 + userLogs.length) : 12;

  // Chart telemetry dataset by day
  const chartData = {
    Mon: { executions: 22, workflows: 8, agents: 4 },
    Tue: { executions: 28, workflows: 10, agents: 4 },
    Wed: { executions: 42, workflows: 11, agents: 5 },
    Thu: { executions: 36, workflows: 9, agents: 5 },
    Fri: { executions: 48, workflows: 12, agents: 5 },
    Sat: { executions: 32, workflows: 10, agents: 5 },
    Sun: { executions: 38, workflows: 11, agents: 5 }
  };

  const currentHover = chartData[hoveredDay] || chartData['Fri'];

  return (
    <div className="overview-page-root">
      {/* ================================================================
          TOP HEADER ROW (Reference Image 1)
          "Good Morning, Rohit 👋" + "+ Deploy New Agent" & "+ New Workflow"
          ================================================================ */}
      <div className="overview-header-row">
        <div>
          <h1 className="overview-greeting">
            Good Morning, {firstName} 👋
          </h1>
          <p className="overview-subtitle">
            Here's what's happening with your DRISHTI AI platform today.
          </p>
        </div>

        <div className="overview-actions-row">
          <button 
            type="button" 
            className="btn-deploy-yellow"
            onClick={() => onSelectTab && onSelectTab('agents')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Deploy New Agent</span>
          </button>

          <button 
            type="button" 
            className="btn-new-workflow-outline"
            onClick={() => onSelectTab && onSelectTab('workflows')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>New Workflow</span>
          </button>
        </div>
      </div>

      {/* ================================================================
          4 METRIC KPI CARDS (Reference Image 1)
          Total AI Agents, Active Workflows, Successful Executions, Recent Activity
          ================================================================ */}
      <div className="kpi-metrics-grid">
        {/* Card 1: Total AI Agents */}
        <div className="kpi-card" onClick={() => onSelectTab && onSelectTab('agents')}>
          <div className="kpi-top-row">
            <div className="kpi-icon-square">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="8" width="16" height="12" rx="2"></rect>
                <path d="M12 2v6"></path>
                <circle cx="9" cy="13" r="1.5" fill="currentColor"></circle>
                <circle cx="15" cy="13" r="1.5" fill="currentColor"></circle>
              </svg>
            </div>
            <div className="kpi-badge-circle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82"></path>
              </svg>
            </div>
          </div>
          <div className="kpi-title">Total AI Agents</div>
          <div className="kpi-big-number">{totalAgents}</div>
          <div className="kpi-footer-badge text-green">+2 this week</div>
        </div>

        {/* Card 2: Active Workflows */}
        <div className="kpi-card" onClick={() => onSelectTab && onSelectTab('workflows')}>
          <div className="kpi-top-row">
            <div className="kpi-icon-square">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="6" cy="6" r="3"></circle>
                <circle cx="18" cy="18" r="3"></circle>
                <path d="M6 9v3a3 3 0 0 0 3 3h6"></path>
              </svg>
            </div>
            <div className="kpi-badge-circle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
            </div>
          </div>
          <div className="kpi-title">Active Workflows</div>
          <div className="kpi-big-number">{activeWorkflows}</div>
          <div className="kpi-footer-badge text-green">+1 this week</div>
        </div>

        {/* Card 3: Successful Executions */}
        <div className="kpi-card" onClick={() => onSelectTab && onSelectTab('logs')}>
          <div className="kpi-top-row">
            <div className="kpi-icon-square">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
            </div>
            <div className="kpi-badge-circle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>
          <div className="kpi-title">Successful Executions</div>
          <div className="kpi-big-number">{successfulExecutions}</div>
          <div className="kpi-footer-badge text-green">+18% this week</div>
        </div>

        {/* Card 4: Recent Activity */}
        <div className="kpi-card" onClick={() => onSelectTab && onSelectTab('logs')}>
          <div className="kpi-top-row">
            <div className="kpi-icon-square">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div className="kpi-badge-circle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                <circle cx="12" cy="12" r="9"></circle>
              </svg>
            </div>
          </div>
          <div className="kpi-title">Recent Activity</div>
          <div className="kpi-big-number">{recentActivityCount}</div>
          <div className="kpi-footer-badge text-green">+5 this week</div>
        </div>
      </div>

      {/* ================================================================
          MIDDLE ROW: SYSTEM OVERVIEW CHART (LEFT) + RECENT ACTIVITY (RIGHT)
          Matching Reference Image 1 layout & visual details
          ================================================================ */}
      <div className="overview-mid-grid">
        {/* Left: System Overview Chart Card */}
        <div className="overview-card chart-card">
          <div className="card-header-flex">
            <h2 className="card-box-title">System Overview</h2>
            <div className="chart-legend-row">
              <span className="legend-item">
                <span className="legend-dot dot-yellow"></span>
                <span>Agents</span>
              </span>
              <span className="legend-item">
                <span className="legend-dot dot-dark"></span>
                <span>Workflows</span>
              </span>
              <span className="legend-item">
                <span className="legend-dot dot-purple"></span>
                <span>Executions</span>
              </span>
            </div>
          </div>

          {/* Interactive Spline Chart Container */}
          <div className="spline-chart-wrap">
            <svg 
              viewBox="0 0 680 260" 
              className="spline-chart-svg"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Yellow Gradient Area Fill underneath executions curve */}
                <linearGradient id="yellowAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFDE00" stopOpacity="0.32" />
                  <stop offset="60%" stopColor="#FFE53B" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines corresponding to Y-axis 80, 60, 40, 20, 0 */}
              <line x1="50" y1="30" x2="660" y2="30" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="50" y1="80" x2="660" y2="80" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="50" y1="130" x2="660" y2="130" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="50" y1="180" x2="660" y2="180" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="50" y1="230" x2="660" y2="230" stroke="#E2E8F0" strokeWidth="1" />

              {/* Y-axis text labels */}
              <text x="25" y="35" className="chart-axis-text">80</text>
              <text x="25" y="85" className="chart-axis-text">60</text>
              <text x="25" y="135" className="chart-axis-text">40</text>
              <text x="25" y="185" className="chart-axis-text">20</text>
              <text x="32" y="235" className="chart-axis-text">0</text>

              {/* Executions Gradient Fill Area */}
              <path
                d="M 70 170 
                   C 140 155, 180 110, 250 115 
                   C 320 120, 360 145, 430 110 
                   C 500 75, 540 130, 610 115 
                   L 610 230 L 70 230 Z"
                fill="url(#yellowAreaGradient)"
              />

              {/* Curve 1: Executions (Yellow main line) */}
              <path
                d="M 70 170 
                   C 140 155, 180 110, 250 115 
                   C 320 120, 360 145, 430 110 
                   C 500 75, 540 130, 610 115"
                fill="none"
                stroke="#FFDE00"
                strokeWidth="3.2"
                strokeLinecap="round"
              />

              {/* Curve 2: Workflows (Dark line) */}
              <path
                d="M 70 200 
                   C 140 190, 180 175, 250 170 
                   C 320 165, 360 190, 430 165 
                   C 500 140, 540 175, 610 165"
                fill="none"
                stroke="#0F172A"
                strokeWidth="2.4"
                strokeLinecap="round"
              />

              {/* Curve 3: Agents (Light Gray / Subtle line) */}
              <path
                d="M 70 215 
                   C 140 210, 180 205, 250 202 
                   C 320 198, 360 210, 430 195 
                   C 500 180, 540 205, 610 200"
                fill="none"
                stroke="#94A3B8"
                strokeWidth="1.8"
                strokeDasharray="4 4"
                strokeLinecap="round"
              />

              {/* Coordinate Point Markers for Fri (matching screenshot tooltip anchor) */}
              <circle cx="430" cy="110" r="5" fill="#FFDE00" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="430" cy="165" r="4.5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="430" cy="195" r="4" fill="#94A3B8" stroke="#FFFFFF" strokeWidth="1.5" />

              {/* X-axis Day Labels */}
              <text x="65" y="252" className="chart-axis-text">Mon</text>
              <text x="155" y="252" className="chart-axis-text">Tue</text>
              <text x="245" y="252" className="chart-axis-text">Wed</text>
              <text x="335" y="252" className="chart-axis-text">Thu</text>
              <text x="425" y="252" className="chart-axis-text active-day-label">Fri</text>
              <text x="515" y="252" className="chart-axis-text">Sat</text>
              <text x="605" y="252" className="chart-axis-text">Sun</text>
            </svg>

            {/* Dark Floating Tooltip (Matching Reference Image 1 exactly near Fri) */}
            <div className="chart-floating-tooltip">
              <div className="tooltip-title">{hoveredDay}</div>
              <div className="tooltip-row">
                <span className="tooltip-dot dot-yellow"></span>
                <span>Executions: {currentHover.executions}</span>
              </div>
              <div className="tooltip-row">
                <span className="tooltip-dot dot-white"></span>
                <span>Workflows: {currentHover.workflows}</span>
              </div>
              <div className="tooltip-row">
                <span className="tooltip-dot dot-amber"></span>
                <span>Agents: {currentHover.agents}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recent Activity Card (Matching Reference Image 1) */}
        <div className="overview-card activity-card">
          <div className="card-header-flex">
            <h2 className="card-box-title">Recent Activity</h2>
            <button 
              type="button" 
              className="view-all-link"
              onClick={() => onSelectTab && onSelectTab('logs')}
            >
              View All
            </button>
          </div>

          <div className="activity-items-stack">
            {/* Item 1: Green icon */}
            <div className="activity-row-item">
              <div className="activity-icon-box bg-green-subtle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div className="activity-details">
                <div className="activity-main-text">Workflow executed successfully</div>
                <div className="activity-sub-text">Payment Processing</div>
              </div>
              <div className="activity-time-text">2m ago</div>
            </div>

            {/* Item 2: Blue icon */}
            <div className="activity-row-item">
              <div className="activity-icon-box bg-blue-subtle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.2">
                  <rect x="4" y="8" width="16" height="12" rx="2"></rect>
                  <path d="M12 2v6"></path>
                  <circle cx="9" cy="13" r="1.5" fill="currentColor"></circle>
                  <circle cx="15" cy="13" r="1.5" fill="currentColor"></circle>
                </svg>
              </div>
              <div className="activity-details">
                <div className="activity-main-text">New agent deployed</div>
                <div className="activity-sub-text">Customer Support Agent</div>
              </div>
              <div className="activity-time-text">12m ago</div>
            </div>

            {/* Item 3: Yellow icon */}
            <div className="activity-row-item">
              <div className="activity-icon-box bg-yellow-subtle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.2">
                  <rect x="4" y="3" width="16" height="18" rx="2"></rect>
                  <line x1="8" y1="8" x2="16" y2="8"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </div>
              <div className="activity-details">
                <div className="activity-main-text">Log entry created</div>
                <div className="activity-sub-text">System initialized</div>
              </div>
              <div className="activity-time-text">18m ago</div>
            </div>

            {/* Item 4: Red icon */}
            <div className="activity-row-item">
              <div className="activity-icon-box bg-red-subtle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.2">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              </div>
              <div className="activity-details">
                <div className="activity-main-text">Workflow paused</div>
                <div className="activity-sub-text">Data Sync Pipeline</div>
              </div>
              <div className="activity-time-text">24m ago</div>
            </div>

            {/* Item 5: Slate icon */}
            <div className="activity-row-item">
              <div className="activity-icon-box bg-slate-subtle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </div>
              <div className="activity-details">
                <div className="activity-main-text">Settings updated</div>
                <div className="activity-sub-text">Workspace configuration</div>
              </div>
              <div className="activity-time-text">1h ago</div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          BOTTOM ROW: RECENT TRANSACTIONS TABLE CARD (Reference Image 1)
          Columns: Name | Type | Status | Date | Amount
          ================================================================ */}
      <div className="overview-card table-card">
        <div className="card-header-flex">
          <h2 className="card-box-title">Recent Transactions</h2>
        </div>

        <div className="clean-table-responsive">
          <table className="clean-data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-semibold">AI Agent - Customer Support</td>
                <td className="text-muted">Agent</td>
                <td>
                  <span className="table-badge badge-active">Active</span>
                </td>
                <td className="text-muted">14 Nov 2024</td>
                <td className="text-muted">-</td>
              </tr>
              <tr>
                <td className="font-semibold">Workflow - Payment Processing</td>
                <td className="text-muted">Workflow</td>
                <td>
                  <span className="table-badge badge-active">Active</span>
                </td>
                <td className="text-muted">14 Nov 2024</td>
                <td className="text-muted">-</td>
              </tr>
              <tr>
                <td className="font-semibold">System Log</td>
                <td className="text-muted">Log</td>
                <td>
                  <span className="table-badge badge-success">Success</span>
                </td>
                <td className="text-muted">14 Nov 2024</td>
                <td className="text-muted">-</td>
              </tr>
              <tr>
                <td className="font-semibold">Data Sync Pipeline</td>
                <td className="text-muted">Workflow</td>
                <td>
                  <span className="table-badge badge-paused">Paused</span>
                </td>
                <td className="text-muted">13 Nov 2024</td>
                <td className="text-muted">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
