import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import OverviewView from './OverviewView';
import AgentsView from './AgentsView';
import WorkflowsView from './WorkflowsView';
import AnalyticsView from './AnalyticsView';
import LogsView from './LogsView';
import SettingsView from './SettingsView';

const TAB_TITLES = {
  overview: 'Overview',
  agents: 'AI Agents',
  workflows: 'Workflows',
  analytics: 'Analytics',
  logs: 'Activity Logs',
  settings: 'Settings'
};

export default function DashboardLayout({ onBackToLanding }) {
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
        return <OverviewView />;
      case 'agents':
        return <AgentsView />;
      case 'workflows':
        return <WorkflowsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'logs':
        return <LogsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
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
        />

        {/* View Container */}
        <main className="dashboard-content">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}
