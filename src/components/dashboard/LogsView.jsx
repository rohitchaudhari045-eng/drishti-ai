import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { subscribeUserLogs, addUserLog } from '../../lib/firestoreService';

const STATIC_DEMO_LOGS = [
  { id: '1', timestamp: '2026-10-09 21:44:12', level: 'INFO', source: 'SENTINEL', message: 'Ingested webhook payload from stripe_live_hook (Size: 4.2KB)' },
  { id: '2', timestamp: '2026-10-09 21:44:13', level: 'SUCCESS', source: 'EVALUATOR', message: 'Rule #R-109 evaluated TRUE. Branching to ERP sync dispatch.' },
  { id: '3', timestamp: '2026-10-09 21:44:14', level: 'INFO', source: 'CONNECTOR', message: 'Dispatched record to PostgreSQL table [tbl_invoices]. Response: 201 Created.' },
  { id: '4', timestamp: '2026-10-09 21:42:08', level: 'WARN', source: 'RESOLVER', message: 'Rate limit threshold warning (85% consumed for target endpoint: salesforce_api).' },
  { id: '5', timestamp: '2026-10-09 21:40:02', level: 'SUCCESS', source: 'AUDIT', message: 'Archived execution trace block hash [0x7f9a...3b21] to cold storage.' },
  { id: '6', timestamp: '2026-10-09 21:38:15', level: 'INFO', source: 'SCHEDULER', message: 'Cron job [Hourly Reconciliation] completed with 0 errors.' }
];

export default function LogsView({ onOpenAuthModal }) {
  const { currentUser } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(Boolean(currentUser));
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [emitting, setEmitting] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setLogs(STATIC_DEMO_LOGS);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = subscribeUserLogs(
      currentUser.uid,
      (userLogs) => {
        setLogs(userLogs);
        setLoading(false);
      },
      (err) => {
        console.error('Failed to load logs:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handleEmitTestLog = async () => {
    if (!currentUser) {
      if (onOpenAuthModal) onOpenAuthModal('signin');
      return;
    }

    setEmitting(true);
    const sources = ['SENTINEL', 'EVALUATOR', 'CONNECTOR', 'AUDIT'];
    const levels = ['INFO', 'SUCCESS', 'WARN'];
    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];

    try {
      await addUserLog(currentUser.uid, {
        level: randomLevel,
        source: randomSource,
        message: `Manual operational audit diagnostic event dispatched at ${new Date().toLocaleTimeString()}.`
      });
    } catch (err) {
      console.error('Failed to write log to Firestore:', err);
    } finally {
      setEmitting(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = filterLevel === 'ALL' || log.level === filterLevel;
    const matchesSearch = (log.message || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (log.source || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="tab-view-container">
      <div className="section-block-header table-header-flex">
        <div>
          <h2 className="block-title">Activity & Audit Logs</h2>
          <p className="block-sub">
            {currentUser 
              ? 'Real-time diagnostic event streams saved to your Cloud Firestore database' 
              : 'Sample diagnostic event stream — Sign in to stream live workspace audit trails'}
          </p>
        </div>

        {/* Action button */}
        <button 
          type="button" 
          className="btn btn-secondary btn-sm"
          onClick={handleEmitTestLog}
          disabled={emitting}
        >
          {emitting ? 'Emitting...' : '+ Emit Diagnostic Log'}
        </button>
      </div>

      {/* Guest notice */}
      {!currentUser && (
        <div className="auth-banner-notice" style={{ marginBottom: '20px' }}>
          <div className="auth-notice-icon">📋</div>
          <div className="auth-notice-text">
            <strong>Sample Logs:</strong> Displaying static preview telemetry. 
            <button 
              type="button" 
              className="auth-inline-link" 
              style={{ marginLeft: '6px' }}
              onClick={() => onOpenAuthModal && onOpenAuthModal('signin')}
            >
              Sign in
            </button> to record live audit logs.
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="logs-controls" style={{ marginBottom: '16px' }}>
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

      <div className="card log-viewer-card">
        <div className="log-viewer-header">
          <span>TIMESTAMP</span>
          <span>LEVEL</span>
          <span>MODULE</span>
          <span>LOG MESSAGE</span>
        </div>
        <div className="log-entries-list">
          {loading ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <span className="auth-spinner-ring"></span>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No log entries match your filter criteria.
            </div>
          ) : (
            filteredLogs.map((entry, idx) => (
              <div key={entry.id || idx} className="log-row">
                <span className="log-time code-font">{entry.timestamp}</span>
                <span className={`log-level log-level-${(entry.level || 'info').toLowerCase()}`}>{entry.level}</span>
                <span className="log-source code-font">{entry.source}</span>
                <span className="log-msg">{entry.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
