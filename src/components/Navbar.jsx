import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onNavigateToDashboard, onOpenAuthModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const getUserInitials = () => {
    if (!currentUser) return 'U';
    if (currentUser.displayName) {
      return currentUser.displayName.slice(0, 2).toUpperCase();
    }
    if (currentUser.email) {
      return currentUser.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className={`navbar-wrapper ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container nav-container">
        {/* Brand Logo */}
        <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <span className="brand-name">
            DRISHTI <span className="brand-accent">AI</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="nav-links desktop-only">
          <a href="#features" className="nav-link">Platform</a>
          <a href="#how-it-works" className="nav-link">Architecture</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <button 
            onClick={onNavigateToDashboard}
            className="nav-link-btn"
          >
            Live App Demo
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="nav-actions desktop-only">
          {currentUser ? (
            <div className="nav-user-logged-in">
              <div className="nav-user-badge" title={currentUser.email}>
                <span className="nav-user-avatar">{getUserInitials()}</span>
                <span className="nav-user-email">{currentUser.displayName || currentUser.email}</span>
              </div>
              <button 
                type="button"
                onClick={onNavigateToDashboard} 
                className="btn btn-primary btn-sm"
              >
                Dashboard
              </button>
              <button 
                type="button"
                onClick={handleSignOut} 
                className="btn btn-secondary btn-sm"
                title="Sign out from Firebase"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <button 
                type="button"
                onClick={() => onOpenAuthModal ? onOpenAuthModal('signin') : onNavigateToDashboard()} 
                className="btn btn-secondary btn-sm"
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => onOpenAuthModal ? onOpenAuthModal('signup') : onNavigateToDashboard()} 
                className="btn btn-primary btn-sm"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav-links">
            <a href="#features" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Platform</a>
            <a href="#how-it-works" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Architecture</a>
            <a href="#pricing" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
          </nav>
          <div className="mobile-menu-actions">
            {currentUser ? (
              <>
                <div className="mobile-user-status">
                  Signed in as: <strong>{currentUser.email}</strong>
                </div>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  style={{ width: '100%' }} 
                  onClick={() => { setMobileMenuOpen(false); onNavigateToDashboard(); }}
                >
                  Go to Dashboard
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ width: '100%' }} 
                  onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ width: '100%' }} 
                  onClick={() => { 
                    setMobileMenuOpen(false); 
                    if (onOpenAuthModal) onOpenAuthModal('signin'); 
                    else onNavigateToDashboard(); 
                  }}
                >
                  Sign In
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  style={{ width: '100%' }} 
                  onClick={() => { 
                    setMobileMenuOpen(false); 
                    if (onOpenAuthModal) onOpenAuthModal('signup'); 
                    else onNavigateToDashboard(); 
                  }}
                >
                  Sign Up Free
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
