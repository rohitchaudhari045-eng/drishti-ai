import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  {
    id: 'overview',
    label: 'Overview',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="8" width="16" height="12" rx="2"></rect>
        <path d="M12 2v6"></path>
        <path d="M2 14h2"></path>
        <path d="M20 14h2"></path>
        <circle cx="9" cy="13" r="1.5" fill="currentColor"></circle>
        <circle cx="15" cy="13" r="1.5" fill="currentColor"></circle>
      </svg>
    )
  },
  {
    id: 'workflows',
    label: 'Workflows',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3"></circle>
        <circle cx="18" cy="18" r="3"></circle>
        <path d="M6 9v3a3 3 0 0 0 3 3h6"></path>
        <polyline points="15 12 18 15 15 18"></polyline>
      </svg>
    )
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="2"></rect>
        <line x1="8" y1="8" x2="16" y2="8"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
        <line x1="8" y1="16" x2="12" y2="16"></line>
      </svg>
    )
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
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
  onOpenAuthModal,
  onNavigateToLogin
}) {
  const { currentUser, logOut } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const displayName = currentUser?.displayName || 'Rohit Chaudhari';
  const email = currentUser?.email || 'rohit@example.com';

  const getInitials = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    }
    return 'RC';
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div className="sidebar-mobile-backdrop" onClick={onCloseMobile}></div>
      )}

      <aside className={`dashboard-sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        {/* ================================================================
            SIDEBAR BRAND (Matching Reference Image 1)
            Yellow rounded box + "DRISHTI AI" + "See Beyond. Build Smarter."
            ================================================================ */}
        <div className="sidebar-header" onClick={onBackToLanding} title="Back to DRISHTI AI Home">
          <div className="sidebar-brand-box">
            <div className="sidebar-brand-logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M4 6C4 4.89543 4.89543 4 6 4H16C18.2091 4 20 5.79086 20 8C20 10.2091 18.2091 12 16 12H9V14H15C16.6569 14 18 15.3431 18 17C18 18.6569 16.6569 20 15 20H6C4.89543 20 4 19.1046 4 18V6Z" 
                  fill="#0A0A0C" 
                />
              </svg>
            </div>
            <div className="sidebar-brand-text">
              <div className="sidebar-brand-title">DRISHTI AI</div>
              <div className="sidebar-brand-sub">See Beyond. Build Smarter.</div>
            </div>
          </div>

          {/* Close button for mobile */}
          <button className="sidebar-mobile-close" onClick={onCloseMobile} aria-label="Close menu">
            ✕
          </button>
        </div>

        {/* ================================================================
            MAIN NAVIGATION ITEMS (Reference Image 1)
            Active item is vibrant yellow pill with dark text
            ================================================================ */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
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
              </button>
            );
          })}
        </nav>

        {/* ================================================================
            SIDEBAR FOOTER: USER PROFILE CARD (Reference Image 1)
            Avatar + Rohit Chaudhari + rohit@example.com + >
            ================================================================ */}
        <div className="sidebar-footer">
          <div 
            className="sidebar-user-pill" 
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            title="User Profile Menu"
          >
            <div className="sidebar-user-avatar">
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt={displayName} />
              ) : (
                <span>{getInitials()}</span>
              )}
            </div>
            <div className="sidebar-user-meta">
              <span className="sidebar-user-name">{displayName}</span>
              <span className="sidebar-user-email">{email}</span>
            </div>
            <span className="sidebar-user-chevron">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </span>
          </div>

          {/* Profile Dropdown Popover */}
          {profileMenuOpen && (
            <div className="sidebar-profile-popover" onClick={(e) => e.stopPropagation()}>
              <div className="popover-header">
                <strong>{displayName}</strong>
                <span className="popover-sub">{currentUser ? 'Firebase Authenticated' : 'Guest Demo Workspace'}</span>
              </div>
              <div className="popover-menu-list">
                <button 
                  type="button" 
                  className="popover-item"
                  onClick={() => {
                    onSelectTab('settings');
                    setProfileMenuOpen(false);
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  <span>Workspace Settings</span>
                </button>

                <button 
                  type="button" 
                  className="popover-item"
                  onClick={() => {
                    if (onBackToLanding) onBackToLanding();
                    setProfileMenuOpen(false);
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  <span>Back to Website</span>
                </button>

                {currentUser ? (
                  <button 
                    type="button" 
                    className="popover-item popover-item-danger"
                    onClick={() => {
                      logOut();
                      setProfileMenuOpen(false);
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className="popover-item popover-item-yellow"
                    onClick={() => {
                      if (onNavigateToLogin) onNavigateToLogin('signin');
                      else if (onOpenAuthModal) onOpenAuthModal('signin');
                      setProfileMenuOpen(false);
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                      <polyline points="10 17 15 12 10 7"></polyline>
                      <line x1="15" y1="12" x2="3" y2="12"></line>
                    </svg>
                    <span>Sign In to Firebase</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
