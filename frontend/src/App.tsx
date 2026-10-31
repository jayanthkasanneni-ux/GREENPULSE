import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardOverview } from './pages/DashboardOverview';
import { FarmProfilePage } from './pages/FarmProfilePage';
import { CropPlanningPage } from './pages/CropPlanningPage';
import { CropRecommendationsPage } from './pages/CropRecommendationsPage';
import { CropComparisonPage } from './pages/CropComparisonPage';
import { ClimateInsightsPage } from './pages/ClimateInsightsPage';
import { SoilAnalysisPage } from './pages/SoilAnalysisPage';
import { WaterManagementPage } from './pages/WaterManagementPage';
import { AgronomicGuidancePage } from './pages/AgronomicGuidancePage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Authentication */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage initialMode="login" />} />
          <Route path="/register" element={<AuthPage initialMode="register" />} />

          {/* Farmer Decision Dashboard Shell */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="farm-profile" element={<FarmProfilePage />} />
            <Route path="crop-planning" element={<CropPlanningPage />} />
            <Route path="recommendations" element={<CropRecommendationsPage />} />
            <Route path="crop-comparison" element={<CropComparisonPage />} />
            <Route path="climate-insights" element={<ClimateInsightsPage />} />
            <Route path="soil-analysis" element={<SoilAnalysisPage />} />
            <Route path="water-management" element={<WaterManagementPage />} />
            <Route path="agronomic-guidance" element={<AgronomicGuidancePage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
