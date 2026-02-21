/**
 * AgroSoluce Intelligence Mobile App — Main Router
 *
 * Three-Tier Interface:
 * 1. ERMITS Team Command Center
 * 2. Cooperative Management Dashboard
 * 3. Farmer Field App
 *
 * Plus: Cooperative Onboarding Wizard (7-step Farmers First flow)
 */

import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import {
  Target,
  Building2,
  Users,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { ERMITSDashboard } from './ERMITSDashboard';
import { CooperativeDashboard } from './CooperativeDashboard';
import { FarmerFieldApp } from './FarmerFieldApp';
import { MobileOnboardingWizard } from './onboarding/MobileOnboardingWizard';
import './IntelligenceApp.css';

// ── Role Selector ────────────────────────────────────────────────────────────
const RoleSelector = () => {
  const navigate = useNavigate();
  return (
    <div className="role-selector">
      <div className="role-selector-content">
        <div className="role-selector-header">
          <h1 className="role-selector-title">AgroSoluce Intelligence</h1>
          <p className="role-selector-subtitle">Field Operations Platform</p>
        </div>

        <div className="role-buttons">
          <button
            className="role-button role-button-ermits"
            onClick={() => navigate('/ermits')}
          >
            <div className="role-button-icon-wrapper">
              <Target className="role-button-icon" />
            </div>
            <div className="role-button-content">
              <h3 className="role-button-title">ERMITS Team</h3>
              <p className="role-button-desc">Command Center • Monitor 3,797+ cooperatives • Compliance oversight</p>
            </div>
            <ChevronRight className="role-button-arrow" />
          </button>

          <button
            className="role-button role-button-coop"
            onClick={() => navigate('/cooperative')}
          >
            <div className="role-button-icon-wrapper">
              <Building2 className="role-button-icon" />
            </div>
            <div className="role-button-content">
              <h3 className="role-button-title">Cooperative Manager</h3>
              <p className="role-button-desc">Operations Dashboard • Members • Compliance • Sales</p>
            </div>
            <ChevronRight className="role-button-arrow" />
          </button>

          <button
            className="role-button role-button-farmer"
            onClick={() => navigate('/farmer')}
          >
            <div className="role-button-icon-wrapper">
              <Users className="role-button-icon" />
            </div>
            <div className="role-button-content">
              <h3 className="role-button-title">Farmer</h3>
              <p className="role-button-desc">Field App • Data collection • Training access • Offline capable</p>
            </div>
            <ChevronRight className="role-button-arrow" />
          </button>
        </div>

        {(import.meta.env.VITE_WEB_APP_URL as string | undefined) && (
          <a
            href={import.meta.env.VITE_WEB_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="role-selector-platform-link"
          >
            <ExternalLink className="role-selector-platform-icon" />
            <span>Open full platform (web)</span>
          </a>
        )}
      </div>
    </div>
  );
};

// ── Main App Router ──────────────────────────────────────────────────────────
export const IntelligenceApp = () => (
  <Routes>
    <Route path="/" element={<RoleSelector />} />
    <Route path="/ermits" element={<ERMITSDashboard />} />
    <Route path="/cooperative" element={<CooperativeDashboard />} />
    <Route path="/cooperative/onboarding" element={<MobileOnboardingWizard />} />
    <Route path="/farmer" element={<FarmerFieldApp />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
