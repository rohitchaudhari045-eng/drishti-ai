import React, { useState } from 'react';

const SYSTEM_LOGS = [
  { timestamp: '2026-10-09 21:44:12', level: 'INFO', source: 'SENTINEL', message: 'Ingested webhook payload from stripe_live_hook (Size: 4.2KB)' },
  { timestamp: '2026-10-09 21:44:13', level: 'SUCCESS', source: 'EVALUATOR', message: 'Rule #R-109 evaluated TRUE. Branching to ERP sync dispatch.' },
  { timestamp: '2026-10-09 21:44:14', level: 'INFO', source: 'CONNECTOR', message: 'Dispatched record to PostgreSQL table [tbl_invoices]. Response: 201 Created.' },
  { timestamp: '2026-10-09 21:42:08', level: 'WARN', source: 'RESOLVER', message: 'Rate limit threshold warning (85% consumed for target endpoint: salesforce_api).' },
  { timestamp: '2026-10-09 21:40:02', level: 'SUCCESS', source: 'AUDIT', message: 'Archived execution trace block hash [0x7f9a...3b21] to cold storage.' },
  { timestamp: '2026-10-09 21:38:15', level: 'INFO', source: 'SCHEDULER', message: 'Cron job [Hourly Reconciliation] completed with 0 errors.' }
];

export default function LogsView() {
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = SYSTEM_LOGS.filter((log) => {
    const matchesLevel = filterLevel === 'ALL' || log.level === filterLevel;
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.source.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="tab-view-container">
      <div className="section-block-header table-header-flex">
        <div>
          <h2 className="block-title">Activity & Audit Logs</h2>
          <p className="block-sub">Real-time immutable diagnostic event streaming</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="logs-controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search log messages or sources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="table-filter-group">
            {['ALL', 'INFO', 'SUCCESS', 'WARN'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                className={`table-filter-btn ${filterLevel === lvl ? 'active' : ''}`}
                onClick={() => setFilterLevel(lvl)}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card log-viewer-card">
        <div className="log-viewer-header">
          <span>TIMESTAMP</span>
          <span>LEVEL</span>
          <span>MODULE</span>
          <span>LOG MESSAGE</span>
        </div>
        <div className="log-entries-list">
          {filteredLogs.map((entry, idx) => (
            <div key={idx} className="log-row">
              <span className="log-time code-font">{entry.timestamp}</span>
              <span className={`log-level log-level-${entry.level.toLowerCase()}`}>{entry.level}</span>
              <span className="log-source code-font">{entry.source}</span>
              <span className="log-msg">{entry.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
