import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nProvider';
import PageShell from '@/components/layout/PageShell';

export default function NotFoundPage() {
  const { t } = useI18n();
  return (
    <PageShell noBreadcrumbs containerClassName="max-w-md">
      <div className="flex items-center justify-center py-20">
      <div className="w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-6xl font-bold text-primary-600 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.notFound.title}</h1>
          <p className="text-gray-600 mb-6">
            {t.notFound.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Home className="h-5 w-5" />
              {t.notFound.goHome}
            </Link>
            <Link
              to="/directory"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              {t.notFound.browseDirectory}
            </Link>
          </div>
        </div>
      </div>
      </div>
    </PageShell>
  );
}

