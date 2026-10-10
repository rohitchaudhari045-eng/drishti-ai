import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function TopNav({ 
  currentTabTitle, 
  onToggleMobileSidebar, 
  onBackToLanding,
  onRefreshData,
  isRefreshing,
  onOpenAuthModal
}) {
  const { currentUser, logOut } = useAuth();

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

        {/* Current Tab Title Breadcrumb */}
        <div className="topnav-breadcrumbs">
          <span className="crumb-root">DRISHTI Control Plane</span>
          <span className="crumb-divider">/</span>
          <span className="crumb-current">{currentTabTitle}</span>
        </div>
      </div>

      <div className="topnav-right">
        {/* Environment / User Pill */}
        {currentUser ? (
          <div className="demo-mode-pill authed-mode-pill" title={`Authenticated: ${currentUser.email}`}>
            <span className="demo-pulse" style={{ backgroundColor: '#22c55e' }}></span>
            <span>{currentUser.displayName || currentUser.email}</span>
          </div>
        ) : (
          <div className="demo-mode-pill">
            <span className="demo-pulse"></span>
            <span>Sample Environment</span>
          </div>
        )}

        {/* Auth CTA button if not logged in, or Sign Out if logged in */}
        {currentUser ? (
          <button 
            className="btn btn-secondary btn-sm"
            onClick={logOut}
            title="Sign out of Firebase"
          >
            Sign Out
          </button>
        ) : (
          <button 
            className="btn btn-outline-yellow btn-sm"
            onClick={() => onOpenAuthModal && onOpenAuthModal('signin')}
            title="Sign In with Firebase"
          >
            Sign In
          </button>
        )}

        {/* Refresh Simulation Trigger */}
        <button 
          className={`btn-icon-action ${isRefreshing ? 'is-spinning' : ''}`}
          onClick={onRefreshData}
          title="Refresh live metrics simulation"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
        </button>

        {/* Quick Back to Landing Page Button */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onBackToLanding}
        >
          Exit to Website
        </button>
      </div>
    </header>
  );
}
