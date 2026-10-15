import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import OverviewView from './OverviewView';
import AgentsView from './AgentsView';
import WorkflowsView from './WorkflowsView';
import AnalyticsView from './AnalyticsView';
import LogsView from './LogsView';
import SettingsView from './SettingsView';
import './dashboard-light.css';

const TAB_TITLES = {
  overview: 'Overview',
  agents: 'AI Agents',
  workflows: 'Workflows',
  analytics: 'Analytics',
  logs: 'Activity Logs',
  settings: 'Settings'
};

export default function DashboardLayout({ onBackToLanding, onOpenAuthModal, onNavigateToLogin }) {
  const [currentTab, setCurrentTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const renderActiveView = () => {
    switch (currentTab) {
      case 'overview':
        return (
          <OverviewView 
            onOpenAuthModal={onOpenAuthModal} 
            onNavigateToLogin={onNavigateToLogin}
            onSelectTab={setCurrentTab}
          />
        );
      case 'agents':
        return <AgentsView onOpenAuthModal={onOpenAuthModal} />;
      case 'workflows':
        return <WorkflowsView onOpenAuthModal={onOpenAuthModal} />;
      case 'analytics':
        return <AnalyticsView onOpenAuthModal={onOpenAuthModal} />;
      case 'logs':
        return <LogsView onOpenAuthModal={onOpenAuthModal} />;
      case 'settings':
        return <SettingsView onOpenAuthModal={onOpenAuthModal} />;
      default:
        return (
          <OverviewView 
            onOpenAuthModal={onOpenAuthModal} 
            onNavigateToLogin={onNavigateToLogin}
            onSelectTab={setCurrentTab}
          />
        );
    }
  };

  return (
    <div className="dashboard-root">
      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onBackToLanding={onBackToLanding}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onOpenAuthModal={onOpenAuthModal}
        onNavigateToLogin={onNavigateToLogin}
      />

      {/* Main Content Area */}
      <div className="dashboard-main-area">
        {/* Top Navigation */}
        <TopNav
          currentTabTitle={TAB_TITLES[currentTab] || 'Overview'}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onBackToLanding={onBackToLanding}
          onRefreshData={handleRefresh}
          isRefreshing={isRefreshing}
          onOpenAuthModal={onOpenAuthModal}
          onNavigateToLogin={onNavigateToLogin}
        />

        {/* View Container */}
        <main className="dashboard-content">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}
