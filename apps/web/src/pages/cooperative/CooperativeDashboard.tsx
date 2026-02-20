import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Package, ShoppingCart, Users, Shield, FileText, Route, CheckCircle, AlertCircle, XCircle, Zap, LogOut } from 'lucide-react';
import FarmerList from '@/features/producers/components/FarmerList';
import ComplianceDashboard from '@/features/compliance/components/ComplianceDashboard';
import CooperativeEudrReadiness from '@/features/compliance/components/CooperativeEudrReadiness';
import PageShell from '@/components/layout/PageShell';
import AuditList from '@/features/evidence/components/AuditList';
import FieldDeclarationForm from '@/features/evidence/components/FieldDeclarationForm';
import { BatchCard } from '@/features/traceability/components';
import { getBatchesByCooperative } from '@/features/traceability/api/traceabilityApi';
import { getCooperativeById } from '@/features/cooperatives/api/cooperativesApi';
import { useCooperativeEnrichment } from '@/hooks/useCooperativeEnrichment';
import { useAuth } from '@/lib/auth/AuthContext';
import { getOnboardingByCooperativeId } from '@/features/onboarding/api';
import type { Cooperative } from '@/types';
import CoopReadinessChecklist from '@/components/CoopReadinessChecklist';
import CooperativeSpaceLanding from './CooperativeSpaceLanding';

export default function CooperativeDashboard() {
  const navigate = useNavigate();
  const { user, profile, cooperative: authCooperative, loading: authLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'farmers' | 'products' | 'traceability' | 'compliance' | 'evidence'
  >('overview');
  const [showFieldDeclarationForm, setShowFieldDeclarationForm] = useState(false);
  const [onboardingIncomplete, setOnboardingIncomplete] = useState(false);

  // The real cooperative ID from auth context
  const cooperativeId = authCooperative?.id || '';

  useEffect(() => {
    if (!authLoading && cooperativeId) {
      checkOnboarding();
    }
  }, [cooperativeId, authLoading]);

  const checkOnboarding = async () => {
    const { data } = await getOnboardingByCooperativeId(cooperativeId);
    if (data && data.status !== 'completed') {
      setOnboardingIncomplete(true);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <CooperativeSpaceLanding />;
  }

  const tabs = [
    { id: 'overview', label: "Vue d'ensemble", icon: Building2 },
    { id: 'farmers', label: 'Producteurs', icon: Users },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'traceability', label: 'Traçabilité', icon: Route },
    { id: 'compliance', label: 'Conformité', icon: Shield },
    { id: 'evidence', label: 'Preuves', icon: FileText },
  ];

  return (
    <PageShell noBreadcrumbs>
      <div>
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {authCooperative?.name || profile.organization_name || 'Tableau de Bord Coopérative'}
            </h1>
            <p className="text-gray-500 text-sm">
              Bienvenue, {profile.full_name} · {profile.user_type === 'admin' ? 'Admin' : 'Coopérative'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {profile.user_type === 'admin' && (
              <Link
                to="/admin/onboarding"
                className="flex items-center gap-1.5 px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
            <button
              onClick={async () => { await signOut(); navigate('/cooperative', { replace: true }); }}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Onboarding incomplete banner */}
        {onboardingIncomplete && cooperativeId && (
          <div className="mb-6 flex items-center justify-between gap-4 bg-amber-50 border border-amber-300 rounded-xl px-5 py-4">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-amber-900">Intégration non terminée</p>
                <p className="text-sm text-amber-700">Complétez les étapes restantes pour débloquer toutes les fonctionnalités.</p>
              </div>
            </div>
            <Link
              to={`/cooperative/onboarding/${cooperativeId}`}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors"
            >
              Reprendre l'intégration →
            </Link>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && <OverviewTab cooperativeId={cooperativeId} />}
            {activeTab === 'farmers' && cooperativeId && <FarmerList cooperativeId={cooperativeId} />}
            {activeTab === 'products' && <ProductsTab />}
            {activeTab === 'traceability' && cooperativeId && <TraceabilityTab cooperativeId={cooperativeId} />}
            {activeTab === 'compliance' && cooperativeId && (
              <div className="space-y-8">
                {/* EUDR Supply-Side Readiness Assessment (editable by cooperative) */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <CooperativeEudrReadiness cooperativeId={cooperativeId} editable={true} />
                </div>
                {/* Existing certifications & compliance requirements */}
                <ComplianceDashboard cooperativeId={cooperativeId} />
              </div>
            )}
            {activeTab === 'evidence' && cooperativeId && (
              <EvidenceTab
                cooperativeId={cooperativeId}
                showFieldDeclarationForm={showFieldDeclarationForm}
                onShowForm={() => setShowFieldDeclarationForm(true)}
                onHideForm={() => setShowFieldDeclarationForm(false)}
              />
            )}
            {!cooperativeId && activeTab !== 'overview' && (
              <div className="text-center py-12 text-gray-500">
                <AlertCircle className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                <p>Aucun profil coopérative lié à votre compte.</p>
                <Link to="/cooperative/onboarding/new" className="text-primary-600 hover:underline text-sm mt-2 inline-block">
                  Démarrer l'intégration
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function OverviewTab({ cooperativeId }: { cooperativeId: string }) {
  const [cooperative, setCooperative] = useState<Cooperative | null>(null);
  const [loading, setLoading] = useState(true);
  const { recomputeEnrichment } = useCooperativeEnrichment();

  useEffect(() => {
    if (cooperativeId) loadCooperative();
    else setLoading(false);
  }, [cooperativeId]);

  const loadCooperative = async () => {
    const { data } = await getCooperativeById(cooperativeId);
    if (data) {
      setCooperative(data);
    }
    setLoading(false);
  };

  const handleRecalculate = async () => {
    if (!cooperative?.id) return;
    const { data } = await recomputeEnrichment(cooperative.id);
    if (data) {
      setCooperative(data);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Chargement...</div>;
  }

  const readinessStatus = cooperative?.readiness_status || 'not_ready';
  const coverageMetrics = cooperative?.coverage_metrics;
  const contextualRisks = cooperative?.contextual_risks;

  // Readiness badge styling
  const getReadinessBadge = () => {
    switch (readinessStatus) {
      case 'buyer_ready':
        return {
          label: 'Prêt pour les acheteurs',
          color: 'bg-green-100 text-green-800 border-green-300',
          icon: CheckCircle,
        };
      case 'in_progress':
        return {
          label: 'En cours',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          icon: AlertCircle,
        };
      default:
        return {
          label: 'Non prêt',
          color: 'bg-red-100 text-red-800 border-red-300',
          icon: XCircle,
        };
    }
  };

  const readinessBadge = getReadinessBadge();
  const BadgeIcon = readinessBadge.icon;

  return (
    <div className="space-y-6">
      {/* Readiness Status Badge */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Statut de Préparation</h2>
          <button
            onClick={handleRecalculate}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Recalculer
          </button>
        </div>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${readinessBadge.color}`}>
          <BadgeIcon className="h-5 w-5" />
          <span className="font-medium">{readinessBadge.label}</span>
        </div>
      </div>

      {/* Coverage Metrics */}
      {coverageMetrics && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Couverture des Données</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Farmers Coverage */}
            <div className="border rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Producteurs Documentés</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {coverageMetrics.farmers_with_declarations || 0} / {coverageMetrics.farmers_total || 0}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{
                    width: `${coverageMetrics.farmers_total > 0 
                      ? ((coverageMetrics.farmers_with_declarations || 0) / coverageMetrics.farmers_total * 100) 
                      : 0}%`,
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {coverageMetrics.farmers_total > 0
                  ? Math.round(((coverageMetrics.farmers_with_declarations || 0) / coverageMetrics.farmers_total) * 100)
                  : 0}%
              </div>
            </div>

            {/* Plots Coverage */}
            <div className="border rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Parcelles avec Géolocalisation</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {coverageMetrics.plots_with_geo || 0} / {coverageMetrics.plots_total || 0}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{
                    width: `${coverageMetrics.plots_total > 0 
                      ? ((coverageMetrics.plots_with_geo || 0) / coverageMetrics.plots_total * 100) 
                      : 0}%`,
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {coverageMetrics.plots_total > 0
                  ? Math.round(((coverageMetrics.plots_with_geo || 0) / coverageMetrics.plots_total) * 100)
                  : 0}%
              </div>
            </div>

            {/* Documents Coverage */}
            <div className="border rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Documents Requis</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {coverageMetrics.required_docs_present || 0} / {coverageMetrics.required_docs_total || 0}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{
                    width: `${coverageMetrics.required_docs_total > 0 
                      ? ((coverageMetrics.required_docs_present || 0) / coverageMetrics.required_docs_total * 100) 
                      : 0}%`,
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {coverageMetrics.required_docs_total > 0
                  ? Math.round(((coverageMetrics.required_docs_present || 0) / coverageMetrics.required_docs_total) * 100)
                  : 0}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contextual Risks */}
      {contextualRisks && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Risques Contextuels</h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              Zone de déforestation: <strong>{contextualRisks.deforestation_zone || 'unknown'}</strong>
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              Zone protégée: <strong>{contextualRisks.protected_area_overlap || 'unknown'}</strong>
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              Risque climatique: <strong>{contextualRisks.climate_risk || 'unknown'}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Readiness Checklist */}
      {cooperative && (
        <CoopReadinessChecklist cooperative={cooperative} />
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary-500">
          <Users className="h-8 w-8 text-primary-600 mb-4" />
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {coverageMetrics?.farmers_total || '-'}
          </div>
          <div className="text-sm text-gray-600">Producteurs</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-secondary-500">
          <Package className="h-8 w-8 text-secondary-600 mb-4" />
          <div className="text-2xl font-bold text-gray-900 mb-1">0</div>
          <div className="text-sm text-gray-600">Produits listés</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <ShoppingCart className="h-8 w-8 text-green-600 mb-4" />
          <div className="text-2xl font-bold text-gray-900 mb-1">0</div>
          <div className="text-sm text-gray-600">Commandes actives</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <Shield className="h-8 w-8 text-blue-600 mb-4" />
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {coverageMetrics?.plots_total || '-'}
          </div>
          <div className="text-sm text-gray-600">Parcelles</div>
        </div>
      </div>
    </div>
  );
}

function ProductsTab() {
  return (
    <div className="text-center py-12 text-gray-500">
      <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
      <p>Gestion des produits - À implémenter</p>
      <p className="text-sm mt-2">Cette section permettra de créer et gérer vos produits</p>
    </div>
  );
}

function TraceabilityTab({ cooperativeId }: { cooperativeId: string }) {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBatches();
  }, [cooperativeId]);

  const loadBatches = async () => {
    const { data } = await getBatchesByCooperative(cooperativeId);
    setBatches(data || []);
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Chargement des lots...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Lots et Traçabilité</h3>
      {batches.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Aucun lot enregistré</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((batch) => (
            <BatchCard key={batch.id} batch={batch} />
          ))}
        </div>
      )}
    </div>
  );
}

function EvidenceTab({
  cooperativeId,
  showFieldDeclarationForm,
  onShowForm,
  onHideForm,
}: {
  cooperativeId: string;
  showFieldDeclarationForm: boolean;
  onShowForm: () => void;
  onHideForm: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Preuves et Attestations</h3>
        <button
          onClick={onShowForm}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Nouvelle Déclaration
        </button>
      </div>

      {showFieldDeclarationForm && (
        <FieldDeclarationForm
          cooperativeId={cooperativeId}
          onSuccess={onHideForm}
          onCancel={onHideForm}
        />
      )}

      <div className="space-y-6">
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4">Audits</h4>
          <AuditList cooperativeId={cooperativeId} />
        </div>
      </div>
    </div>
  );
}
