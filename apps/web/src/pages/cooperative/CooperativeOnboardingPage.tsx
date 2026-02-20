import { useParams, useNavigate, Link } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import { ArrowLeft, Building2 } from 'lucide-react';
import OnboardingWizard from '@/features/onboarding/components/OnboardingWizard';

export default function CooperativeOnboardingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return (
      <div className="py-32 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Identifiant de coopérative manquant.</p>
          <Link to="/cooperative" className="text-primary-600 hover:underline">
            Retour à l'espace coopérative
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PageShell noBreadcrumbs containerClassName="max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/cooperative"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Espace Coopérative
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-primary-600" />
            Intégration
          </span>
        </div>

        {/* Wizard */}
        <OnboardingWizard
          cooperativeId={id}
          onComplete={() => navigate('/cooperative')}
          onClose={() => navigate('/cooperative')}
        />
    </PageShell>
  );
}
