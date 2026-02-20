import type { ReactNode } from 'react';
import Breadcrumbs from './Breadcrumbs';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageShellProps {
  children: ReactNode;
  /**
   * Breadcrumb items. When omitted the Breadcrumbs component auto-generates
   * them from the current URL path.
   */
  breadcrumbs?: BreadcrumbItem[];
  /**
   * When true, breadcrumbs are not rendered at all (e.g. for dashboard pages
   * that have their own navigation chrome).
   */
  noBreadcrumbs?: boolean;
  /**
   * Override the max-width of the inner container.
   * Pass a Tailwind max-w-* class (e.g. "max-w-4xl", "max-w-5xl").
   * Defaults to "max-w-7xl" — the standard full-width layout.
   */
  containerClassName?: string;
}

/**
 * PageShell — the single canonical wrapper for every content page.
 *
 * Provides:
 *   • Consistent vertical padding (py-8)
 *   • Consistent horizontal max-width + px gutter (mx-auto px-4 sm:px-6 lg:px-8)
 *   • Optional Breadcrumbs rendered at the very top of the container, always
 *     at the same position relative to the page content
 *
 * Background is intentionally NOT set here — it is set once on the App shell
 * div in App.tsx, so it flows across the full viewport including under Navbar
 * and Footer.
 *
 * Usage:
 *   <PageShell breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Buyers' }]}>
 *     ...page content...
 *   </PageShell>
 *
 *   // Narrower content (e.g. assessment forms):
 *   <PageShell containerClassName="max-w-4xl" breadcrumbs={[...]}>
 */
export default function PageShell({
  children,
  breadcrumbs,
  noBreadcrumbs = false,
  containerClassName = 'max-w-7xl',
}: PageShellProps) {
  return (
    <div className="py-8">
      <div className={`${containerClassName} mx-auto px-4 sm:px-6 lg:px-8`}>
        {!noBreadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        {children}
      </div>
    </div>
  );
}
