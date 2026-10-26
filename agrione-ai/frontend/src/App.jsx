import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';
import NotificationModal from './components/NotificationModal';

// Pages
import Dashboard from './pages/Dashboard';
import FarmManagement from './pages/FarmManagement';
import SoilIntelligence from './pages/SoilIntelligence';
import CropRecommendation from './pages/CropRecommendation';
import DiseaseDetection from './pages/DiseaseDetection';
import SmartIrrigation from './pages/SmartIrrigation';
import YieldAndRisk from './pages/YieldAndRisk';
import ProfitCalculator from './pages/ProfitCalculator';
import WhatIfSimulation from './pages/WhatIfSimulation';
import WeatherAdvisory from './pages/WeatherAdvisory';
import MarketMandi from './pages/MarketMandi';
import Marketplace from './pages/Marketplace';
import GovernmentSchemes from './pages/GovernmentSchemes';
import AIAssistant from './pages/AIAssistant';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="app-main">
        <Header
          onOpenAuth={() => setAuthModalOpen(true)}
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/farms" element={<FarmManagement />} />
            <Route path="/soil" element={<SoilIntelligence />} />
            <Route path="/crop-recommendation" element={<CropRecommendation />} />
            <Route path="/disease-detection" element={<DiseaseDetection />} />
            <Route path="/irrigation" element={<SmartIrrigation />} />
            <Route path="/yield-risk" element={<YieldAndRisk />} />
            <Route path="/profit-calculator" element={<ProfitCalculator />} />
            <Route path="/simulation" element={<WhatIfSimulation />} />
            <Route path="/weather" element={<WeatherAdvisory />} />
            <Route path="/market" element={<MarketMandi />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/schemes" element={<GovernmentSchemes />} />
            <Route path="/assistant" element={<AIAssistant />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Notification Slide Drawer */}
      <NotificationModal />

      {/* Authentication / Demo Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

export default App;
