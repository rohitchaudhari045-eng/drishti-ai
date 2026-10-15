import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function TopNav({ 
  currentTabTitle, 
  onToggleMobileSidebar, 
  onBackToLanding,
  onRefreshData,
  isRefreshing,
  onOpenAuthModal,
  onNavigateToLogin
}) {
  const { currentUser, logOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const displayName = currentUser?.displayName || 'Rohit Chaudhari';

  const getInitials = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    }
    return 'RC';
  };

  const notifications = [
    { id: 1, title: 'Workflow Executed', desc: 'Payment Processing finished in 42ms.', time: '2m ago' },
    { id: 2, title: 'New Agent Deployed', desc: 'Customer Support Agent is now active.', time: '12m ago' },
    { id: 3, title: 'System Heartbeat', desc: 'All platform runners operating at 100% SLA.', time: '18m ago' }
  ];

  return (
    <header className="dashboard-topnav">
      <div className="topnav-left">
        {/* Mobile menu trigger */}
        <button 
          className="topnav-mobile-btn" 
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Global Search Bar (Matching Reference Image 1) */}
        <div className="topnav-search-pill">
          <span className="topnav-search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="text"
            className="topnav-search-input"
            placeholder="Search agents, workflows, logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="topnav-right">
        {/* Notification Bell (Reference Image 1) */}
        <div style={{ position: 'relative' }}>
          <button 
            type="button"
            className="topnav-icon-btn"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileDropdownOpen(false);
            }}
            title="Notifications"
            aria-label="Notifications"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="topnav-notification-dot"></span>
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="topnav-popover-menu" onClick={(e) => e.stopPropagation()}>
              <div className="popover-header-row">
                <span className="popover-heading">Platform Notifications</span>
                <span className="badge-new">3 New</span>
              </div>
              <div className="popover-items-list">
                {notifications.map((n) => (
                  <div key={n.id} className="popover-notif-item">
                    <div className="popover-notif-title">{n.title}</div>
                    <div className="popover-notif-desc">{n.desc}</div>
                    <div className="popover-notif-time">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar + Name + Dropdown Trigger (Matching Reference Image 1) */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="topnav-user-btn"
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setNotificationsOpen(false);
            }}
          >
            <div className="topnav-user-avatar">
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt={displayName} />
              ) : (
                <span>{getInitials()}</span>
              )}
            </div>
            <span className="topnav-user-name">{displayName}</span>
            <span className="topnav-chevron">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </button>

          {/* TopNav User Dropdown */}
          {profileDropdownOpen && (
            <div className="topnav-popover-menu topnav-user-dropdown" onClick={(e) => e.stopPropagation()}>
              <div className="popover-header-row">
                <div>
                  <div className="popover-heading">{displayName}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    {currentUser?.email || 'rohit@example.com'}
                  </div>
                </div>
              </div>
              <div className="popover-menu-options">
                <button 
                  type="button" 
                  className="popover-link-action"
                  onClick={() => {
                    if (onBackToLanding) onBackToLanding();
                    setProfileDropdownOpen(false);
                  }}
                >
                  Back to Website
                </button>

                {currentUser ? (
                  <button 
                    type="button" 
                    className="popover-link-action text-danger"
                    onClick={() => {
                      logOut();
                      setProfileDropdownOpen(false);
                    }}
                  >
                    Sign Out
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className="popover-link-action text-primary"
                    onClick={() => {
                      if (onNavigateToLogin) onNavigateToLogin('signin');
                      else if (onOpenAuthModal) onOpenAuthModal('signin');
                      setProfileDropdownOpen(false);
                    }}
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
