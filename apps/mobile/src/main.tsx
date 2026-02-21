/**
 * AgroSoluce Intelligence Mobile App - PWA Entry Point
 * 
 * Separate PWA application for mobile devices
 * Completely independent from the main web app
 * 
 * Three-Tier Interface:
 * 1. ERMITS Team Command Center
 * 2. Cooperative Management Dashboard
 * 3. Farmer Field App
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeModeProvider } from './lib/theme/ThemeModeProvider';
import { I18nProvider } from './lib/i18n/I18nProvider';
import { IntelligenceApp } from './screens/IntelligenceApp';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeModeProvider>
      <I18nProvider>
        <BrowserRouter>
          <IntelligenceApp />
        </BrowserRouter>
      </I18nProvider>
    </ThemeModeProvider>
  </StrictMode>
);

