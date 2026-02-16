import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import {
  Home,
  MapPin,
  UsersRound,
  Briefcase,
  Menu,
  X,
  Globe,
  Sun,
  Moon,
  Activity,
  TrendingUp,
  Target,
  BarChart3,
  Handshake,
  Shield,
  Info,
  ChevronDown,
  Layers,
  Heart,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { useTheme } from '@/lib/theme/ThemeProvider';
import type { Language } from '@/lib/i18n/translations';

type DropdownId = 'data' | 'health' | 'partners' | null;

interface NavItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  exact?: boolean;
}

interface NavDropdown {
  id: DropdownId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
}

export default function Navbar() {
  const location = useLocation();
  const { t, language, setLanguage } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownId>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);
  const isActiveInList = (items: NavItem[]) =>
    items.some((item) => isActive(item.to, item.exact ?? false));

  const toggleLanguage = (lang: Language) => {
    setLanguage(lang);
    setLangMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  const dropdowns: NavDropdown[] = [
    {
      id: 'data',
      label: t.nav.dataAndDirectory,
      icon: UsersRound,
      items: [
        { to: '/map', icon: MapPin, label: t.nav.map },
        { to: '/directory', icon: UsersRound, label: t.nav.directory },
        { to: '/directory/aggregate', icon: Layers, label: t.nav.aggregatedDashboard },
        { to: '/cooperatives', icon: UsersRound, label: t.nav.cooperatives },
      ],
    },
    {
      id: 'health',
      label: t.nav.healthAndAnalytics,
      icon: Activity,
      items: [
        { to: '/health-impact', icon: Activity, label: t.nav.healthImpact },
        { to: '/vrac', icon: TrendingUp, label: t.nav.healthIntelligence },
        { to: '/analytics', icon: BarChart3, label: t.nav.analytics },
        { to: '/hwi', icon: Heart, label: t.nav.hwi },
      ],
    },
    {
      id: 'partners',
      label: t.nav.partnersAndPrograms,
      icon: Handshake,
      items: [
        { to: '/buyer', icon: Briefcase, label: t.nav.buyers },
        { to: '/partners', icon: Handshake, label: t.nav.partners },
        { to: '/pilot', icon: Target, label: t.nav.pilotPrograms },
      ],
    },
  ];

  const singleLinks: NavItem[] = [
    { to: '/monitoring', icon: Shield, label: t.nav.complianceTools, exact: false },
    { to: '/about', icon: Info, label: t.nav.about, exact: false },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity group shrink-0"
          >
            <img
              src="/agrosoluce.png"
              alt="AgroSoluce Logo"
              className="h-14 w-auto transition-transform group-hover:scale-105"
            />
            <div>
              <h2 className="text-primary-600 dark:text-primary-400 font-bold text-lg leading-tight">
                AgroSoluce™
              </h2>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-tight">
                {t.footer.sourceIntelligence}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                {t.footer.byErmits}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div ref={dropdownRef} className="hidden md:flex items-center gap-0.5 shrink min-w-0">
            {/* Home */}
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/', true)
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>{t.nav.home}</span>
            </Link>

            {/* Dropdowns */}
            {dropdowns.map((dropdown) => {
              const Icon = dropdown.icon;
              const isOpen = openDropdown === dropdown.id;
              const hasActive = isActiveInList(dropdown.items);
              return (
                <div
                  key={dropdown.id}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(dropdown.id)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(isOpen ? null : dropdown.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      hasActive || isOpen
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 shadow-sm'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    aria-haspopup="true"
                    {...(isOpen ? { 'aria-expanded': true as const } : { 'aria-expanded': false as const })}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{dropdown.label}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div
                    className={`absolute left-0 mt-1 min-w-[220px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 transition-all duration-200 ${
                      isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                    }`}
                  >
                    {dropdown.items.map((item) => {
                      const ItemIcon = item.icon;
                      const active = isActive(item.to, item.exact ?? false);
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                            active
                              ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <ItemIcon className="h-4 w-4 flex-shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Single links: Compliance, About */}
            {singleLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to, item.exact ?? false);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Theme Toggle */}
            <div className="relative ml-1">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                aria-label={theme === 'light' ? t.nav.themeDark : t.nav.themeLight}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Language Switcher */}
            <div className="relative ml-1">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                aria-label={t.nav.changeLanguage}
              >
                <Globe className="h-4 w-4" />
                <span className="uppercase font-semibold">{language}</span>
              </button>

              {langMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setLangMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
                    <button
                      onClick={() => toggleLanguage('en')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        language === 'en'
                          ? 'text-primary-600 dark:text-primary-400 font-semibold bg-primary-50 dark:bg-primary-900/30'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {t.nav.english}
                    </button>
                    <button
                      onClick={() => toggleLanguage('fr')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        language === 'fr'
                          ? 'text-primary-600 dark:text-primary-400 font-semibold bg-primary-50 dark:bg-primary-900/30'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {t.nav.french}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop: tap outside to close */}
            <div
              className="md:hidden fixed inset-0 bg-black/30 z-40 top-16"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden
            />
            <div className="md:hidden relative z-50 border-t border-gray-200 dark:border-gray-700 py-2 bg-white dark:bg-gray-900 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${
                isActive('/', true)
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <Home className="h-5 w-5" />
              {t.nav.home}
            </Link>

            {dropdowns.map((dropdown) => (
              <div key={dropdown.id} className="px-2 py-1">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-2">
                  {dropdown.label}
                </div>
                {dropdown.items.map((item) => {
                  const ItemIcon = item.icon;
                  const active = isActive(item.to, item.exact ?? false);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <ItemIcon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}

            <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
              {singleLinks.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.to, item.exact ?? false);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Theme Toggle */}
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {theme === 'light' ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                  <span>{t.nav.theme}</span>
                </div>
                <button
                  onClick={() => {
                    toggleTheme();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {theme === 'light' ? t.nav.themeDark : t.nav.themeLight}
                </button>
              </div>
            </div>

            {/* Mobile Language Switcher */}
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 mt-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Globe className="h-4 w-4" />
                <span>{t.nav.language}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    toggleLanguage('en');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    language === 'en'
                      ? 'bg-primary-600 dark:bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {t.nav.enShort}
                </button>
                <button
                  onClick={() => {
                    toggleLanguage('fr');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    language === 'fr'
                      ? 'bg-primary-600 dark:bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {t.nav.frShort}
                </button>
              </div>
            </div>
          </div>
          </>
        )}
      </div>
    </nav>
  );
}
