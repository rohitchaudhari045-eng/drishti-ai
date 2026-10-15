import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import LampLoginPage from './components/auth/LampLoginPage';
import AuthModal from './components/auth/AuthModal';

export default function App() {
  // Views: 'landing' | 'dashboard' | 'login'
  const [view, setView] = useState('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signin'); // 'signin' or 'signup'
  const [loginPageMode, setLoginPageMode] = useState('signin');

  useEffect(() => {
    // Hash routing handler
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#dashboard') {
        setView('dashboard');
      } else if (hash === '#login' || hash === '#signin') {
        setLoginPageMode('signin');
        setView('login');
      } else if (hash === '#signup' || hash === '#register') {
        setLoginPageMode('signup');
        setView('login');
      } else if (hash === '' || hash === '#top' || hash === '#features' || hash === '#pricing' || hash === '#how-it-works') {
        setView('landing');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateToDashboard = () => {
    window.location.hash = 'dashboard';
    setView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToLanding = () => {
    window.location.hash = '';
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToLogin = (mode = 'signin') => {
    setLoginPageMode(mode);
    window.location.hash = mode === 'signup' ? 'signup' : 'login';
    setView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuthModal = (mode = 'signin') => {
    // If user requests auth, navigate them directly to the cinematic Lamp Login page!
    navigateToLogin(mode);
  };

  const handleAuthSuccess = () => {
    // Upon successful authentication, smoothly navigate to dashboard
    navigateToDashboard();
  };

  return (
    <>
      {view === 'dashboard' && (
        <DashboardLayout 
          onBackToLanding={navigateToLanding} 
          onOpenAuthModal={openAuthModal}
          onNavigateToLogin={navigateToLogin}
        />
      )}

      {view === 'login' && (
        <LampLoginPage
          initialMode={loginPageMode}
          onBackToLanding={navigateToLanding}
          onSuccess={handleAuthSuccess}
        />
      )}

      {view === 'landing' && (
        <div className="app-layout">
          <Navbar 
            onNavigateToDashboard={navigateToDashboard} 
            onOpenAuthModal={openAuthModal}
            onNavigateToLogin={navigateToLogin}
          />
          <LandingPage 
            onNavigateToDashboard={navigateToDashboard} 
            onOpenAuthModal={openAuthModal}
          />
        </div>
      )}

      {/* Fallback Global Auth Modal for in-place prompts if triggered */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
