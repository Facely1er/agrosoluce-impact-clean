/**
 * Mobile I18n Provider – language state and translations (en / fr)
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Language, type MobileTranslations, translations } from './translations';

const STORAGE_KEY = 'agrosoluce-language';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: MobileTranslations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem(STORAGE_KEY) as Language;
  if (saved === 'en' || saved === 'fr') return saved;
  const browser = navigator.language?.split('-')[0];
  if (browser === 'fr') return 'fr';
  return 'en';
}

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, lang);
    if (typeof document !== 'undefined') document.documentElement.lang = lang;
  };

  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.lang = language;
    if (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY) !== language) {
      localStorage.setItem(STORAGE_KEY, language);
    }
  }, [language]);

  const value: I18nContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (ctx === undefined) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
