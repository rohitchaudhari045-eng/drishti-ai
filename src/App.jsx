import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import DashboardLayout from './components/dashboard/DashboardLayout';

export default function App() {
  // Simple view switcher: 'landing' or 'dashboard'
  const [view, setView] = useState('landing');

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

  if (view === 'dashboard') {
    return <DashboardLayout onBackToLanding={navigateToLanding} />;
  }

  return (
    <div className="app-layout">
      <Navbar onNavigateToDashboard={navigateToDashboard} />
      <LandingPage onNavigateToDashboard={navigateToDashboard} />
    </div>
  );
}
