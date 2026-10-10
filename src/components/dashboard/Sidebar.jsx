import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { subscribeUserAgents, subscribeUserWorkflows } from '../../lib/firestoreService';

const MENU_ITEMS = [
  {
    id: 'overview',
    label: 'Overview',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
    )
  },
  {
    id: 'agents',
    label: 'AI Agents',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4Z"></path>
        <path d="M18 14a6 6 0 0 0-12 0v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4Z"></path>
        <line x1="9" y1="18" x2="9" y2="21"></line>
        <line x1="15" y1="18" x2="15" y2="21"></line>
      </svg>
    ),
    badge: '4 Active'
  },
  {
    id: 'workflows',
    label: 'Workflows',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    ),
    badge: '12 Live'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
      </svg>
    )
  },
  {
    id: 'logs',
    label: 'Activity Logs',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    )
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    )
  }
];

export default function Sidebar({ 
  currentTab, 
  onSelectTab, 
  onBackToLanding, 
  mobileOpen, 
  onCloseMobile,
  onOpenAuthModal
}) {
  const { currentUser, logOut } = useAuth();
  const [agentCount, setAgentCount] = React.useState(null);
  const [wfCount, setWfCount] = React.useState(null);

  React.useEffect(() => {
    if (!currentUser) {
      setAgentCount(null);
      setWfCount(null);
      return;
    }

    const unsubAgents = subscribeUserAgents(currentUser.uid, (agents) => {
      setAgentCount(agents.length);
    });

    const unsubWfs = subscribeUserWorkflows(currentUser.uid, (wfs) => {
      setWfCount(wfs.filter(w => w.enabled).length);
    });

    return () => {
      unsubAgents();
      unsubWfs();
    };
  }, [currentUser]);

  const getBadge = (itemId, defaultBadge) => {
    if (!currentUser) return defaultBadge;
    if (itemId === 'agents' && agentCount !== null) return `${agentCount} Fleet`;
    if (itemId === 'workflows' && wfCount !== null) return `${wfCount} Live`;
    return defaultBadge;
  };

  const getInitials = () => {
    if (!currentUser) return 'AD';
    if (currentUser.displayName) return currentUser.displayName.slice(0, 2).toUpperCase();
    if (currentUser.email) return currentUser.email.slice(0, 2).toUpperCase();
    return 'US';
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div className="sidebar-mobile-backdrop" onClick={onCloseMobile}></div>
      )}

      <aside className={`dashboard-sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="brand-logo" style={{ fontSize: '1.1rem' }}>
            <div className="brand-icon" style={{ width: '32px', height: '32px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className="brand-name">
              DRISHTI <span className="brand-accent">AI</span>
            </span>
          </div>

          {/* Close button for mobile */}
          <button className="sidebar-mobile-close" onClick={onCloseMobile}>
            ✕
          </button>
        </div>

        {/* Workspace Selector Pill */}
        <div className="sidebar-workspace-pill">
          <div className="workspace-avatar">
            {currentUser ? 'A' : 'D'}
          </div>
          <div className="workspace-info">
            <span className="workspace-name">{currentUser ? 'Production Cluster' : 'Demo Workspace'}</span>
            <span className="workspace-tier">{currentUser ? 'Authenticated Session' : 'SaaS Enterprise Plan'}</span>
          </div>
          <span className="workspace-status-dot" title={currentUser ? 'Connected & Authenticated' : 'Connected (Sample)'}></span>
        </div>

        {/* Main Navigation Menu */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-section-title">CONTROL PLANE</div>
          {MENU_ITEMS.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span className="sidebar-nav-label">{item.label}</span>
                {getBadge(item.id, item.badge) && (
                  <span className={`sidebar-item-badge ${isActive ? 'badge-active' : ''}`}>
                    {getBadge(item.id, item.badge)}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Bottom Actions */}
        <div className="sidebar-footer">
          <button
            type="button"
            className="btn btn-outline-yellow btn-sm back-to-landing-btn"
            onClick={onBackToLanding}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Website
          </button>

          {currentUser ? (
            <div className="sidebar-user-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                <div className="user-avatar" style={{ backgroundColor: '#FFB800', color: '#08080A', fontWeight: 700 }}>
                  {getInitials()}
                </div>
                <div className="user-meta" style={{ overflow: 'hidden' }}>
                  <span className="user-name" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {currentUser.displayName || 'Operator'}
                  </span>
                  <span className="user-role" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {currentUser.email}
                  </span>
                </div>
              </div>
              <button 
                type="button"
                className="btn-sidebar-signout"
                onClick={logOut}
                title="Sign out of Firebase"
                aria-label="Sign Out"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </div>
          ) : (
            <div 
              className="sidebar-user-card sidebar-user-card-cta"
              onClick={() => onOpenAuthModal && onOpenAuthModal('signin')}
              style={{ cursor: 'pointer' }}
              title="Click to Sign In with Firebase"
            >
              <div className="user-avatar">AD</div>
              <div className="user-meta">
                <span className="user-name">Guest Mode</span>
                <span className="user-role" style={{ color: 'var(--accent-yellow)' }}>Sign In with Firebase →</span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
