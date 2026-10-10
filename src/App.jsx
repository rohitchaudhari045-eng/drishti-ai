import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import AuthModal from './components/auth/AuthModal';

export default function App() {
  // Simple view switcher: 'landing' or 'dashboard'
  const [view, setView] = useState('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signin'); // 'signin' or 'signup'

  useEffect(() => {
    // Check if user navigates with #dashboard hash
    const handleHash = () => {
      if (window.location.hash === '#dashboard') {
        setView('dashboard');
      } else if (window.location.hash === '' || window.location.hash === '#top') {
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

  const openAuthModal = (mode = 'signin') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    // Upon successful authentication, smoothly navigate to dashboard
    navigateToDashboard();
  };

  return (
    <>
      {view === 'dashboard' ? (
        <DashboardLayout 
          onBackToLanding={navigateToLanding} 
          onOpenAuthModal={openAuthModal}
        />
      ) : (
        <div className="app-layout">
          <Navbar 
            onNavigateToDashboard={navigateToDashboard} 
            onOpenAuthModal={openAuthModal}
          />
          <LandingPage onNavigateToDashboard={navigateToDashboard} />
        </div>
      )}

      {/* Global Firebase Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
