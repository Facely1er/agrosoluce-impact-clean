import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nProvider';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const PATH_SEGMENT_TO_NAV_KEY: Partial<Record<string, keyof import('@/lib/i18n/translations').Translations['nav']>> = {
  directory: 'directory',
  map: 'map',
  cooperatives: 'cooperatives',
  'health-impact': 'healthImpact',
  vrac: 'healthIntelligence',
  analytics: 'analytics',
  hwi: 'hwi',
  monitoring: 'compliance',
  about: 'about',
  buyer: 'buyers',
  partners: 'partners',
  pilot: 'pilotPrograms',
  workspace: 'cooperativeSpace',
  aggregate: 'aggregatedDashboard',
  'framework-demo': 'frameworkDemo',
  cooperative: 'cooperativeSpace',
  ngos: 'partners',
};

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const location = useLocation();
  const { t } = useI18n();

  // Auto-generate breadcrumbs from pathname if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: t.nav.home, path: '/' }];
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Don't add breadcrumb for the last segment if it's an ID
      if (index === pathSegments.length - 1 && /^\d+$/.test(segment)) {
        return;
      }

      const navKey = PATH_SEGMENT_TO_NAV_KEY[segment];
      const label = navKey ? t.nav[navKey] : segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        label,
        path: index === pathSegments.length - 1 ? undefined : currentPath,
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbItems = items || generateBreadcrumbs();
  
  if (breadcrumbItems.length <= 1) {
    return null;
  }
  
  return (
    <nav 
      className={`flex items-center space-x-2 text-sm text-gray-600 mb-6 ${className}`}
      aria-label="Breadcrumb"
    >
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        
        return (
          <div key={index} className="flex items-center space-x-2">
            {index === 0 ? (
              <Link
                to={item.path || '#'}
                className="flex items-center hover:text-primary-600 transition-colors"
              >
                <Home className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                {isLast || !item.path ? (
                  <span className="font-medium text-gray-900">{item.label}</span>
                ) : (
                  <Link
                    to={item.path}
                    className="hover:text-primary-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
}

