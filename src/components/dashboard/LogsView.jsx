import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { subscribeUserLogs, addUserLog } from '../../lib/firestoreService';

const DEFAULT_LOGS = [
  {
    id: 'log-1',
    time: '14 Nov 2024, 14:32',
    level: 'SUCCESS',
    message: 'Workflow executed successfully',
    source: 'Workflow'
  },
  {
    id: 'log-2',
    time: '14 Nov 2024, 14:28',
    level: 'INFO',
    message: 'Agent status changed',
    source: 'Agent'
  },
  {
    id: 'log-3',
    time: '14 Nov 2024, 14:20',
    level: 'WARN',
    message: 'High response time detected',
    source: 'System'
  },
  {
    id: 'log-4',
    time: '14 Nov 2024, 14:12',
    level: 'SUCCESS',
    message: 'Log created',
    source: 'System'
  },
  {
    id: 'log-5',
    time: '14 Nov 2024, 13:58',
    level: 'INFO',
    message: 'User settings updated',
    source: 'Settings'
  }
];

export default function LogsView({ onOpenAuthModal }) {
  const { currentUser } = useAuth();
  const [logs, setLogs] = useState(DEFAULT_LOGS);
  const [loading, setLoading] = useState(Boolean(currentUser));
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [emitting, setEmitting] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setLogs(DEFAULT_LOGS);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeUserLogs(
      currentUser.uid,
      (userLogs) => {
        if (userLogs.length > 0) {
          const formatted = userLogs.map(l => ({
            id: l.id,
            time: l.timestamp || new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            level: l.level || 'INFO',
            message: l.message || 'System operation executed',
            source: l.source || 'Workflow'
          }));
          // Combine user logs with defaults
          setLogs([...formatted, ...DEFAULT_LOGS]);
        } else {
          setLogs(DEFAULT_LOGS);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Logs error:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handleEmitLog = async () => {
    setEmitting(true);
    const sources = ['Workflow', 'Agent', 'System', 'Settings'];
    const levels = ['SUCCESS', 'INFO', 'WARN', 'ERROR'];
    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];

    const nowStr = new Date().toLocaleString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const newLogItem = {
      id: `local-${Date.now()}`,
      time: nowStr,
      level: randomLevel,
      message: `Operational trigger verified for ${randomSource} pipeline`,
      source: randomSource
    };

    if (currentUser) {
      try {
        await addUserLog(currentUser.uid, {
          level: randomLevel,
          source: randomSource,
          message: newLogItem.message
        });
      } catch (err) {
        console.error('Error writing log:', err);
      }
    } else {
      setLogs([newLogItem, ...logs]);
    }

    setEmitting(false);
  };

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = activeFilter === 'ALL' || log.level === activeFilter;
    const matchesSearch = !searchQuery.trim() || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.time.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="subpage-root">
      {/* Header Row (Matching Thumbnail 3 in Reference Image 1) */}
      <div className="subpage-header-row">
        <div>
          <h1 className="subpage-title">Activity Logs</h1>
          <p className="subpage-subtitle">View and search your platform activity.</p>
        </div>

        <div className="logs-header-actions">
          {/* Search Input */}
          <div className="logs-search-box">
            <span className="logs-search-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="logs-search-input"
            />
          </div>

          <button 
            type="button" 
            className="btn-filter-outline"
            onClick={handleEmitLog}
            disabled={emitting}
            title="Emit a live simulated event log"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            <span>{emitting ? 'Writing...' : 'Emit Log'}</span>
          </button>
        </div>
      </div>

      {/* Filter Pills Row (Reference Image 1: All active is bright yellow) */}
      <div className="logs-filter-pills-row">
        {['ALL', 'INFO', 'SUCCESS', 'WARN', 'ERROR'].map((lvl) => {
          const isActive = activeFilter === lvl;
          return (
            <button
              key={lvl}
              type="button"
              className={`filter-pill-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveFilter(lvl)}
            >
              {lvl === 'ALL' ? 'All' : lvl}
            </button>
          );
        })}
      </div>

      {/* Modern Data Table Card (Reference Image 1) */}
      <div className="overview-card table-card">
        <div className="clean-table-responsive">
          <table className="clean-data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Level</th>
                <th>Message</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '36px', color: '#94A3B8' }}>
                    No logs matching your current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>{log.time}</td>
                    <td>
                      <span className={`table-badge badge-level-${log.level.toLowerCase()}`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="font-medium">{log.message}</td>
                    <td className="text-muted">{log.source}</td>
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
