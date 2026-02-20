import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Building2, Phone, User, CheckCircle, Clock, BarChart3, Users, Shield, AlertTriangle, FileCheck, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { useCooperatives } from '@/hooks/useCooperatives';
import CooperativeLocationMap from '@/features/cooperatives/components/CooperativeLocationMap';
import CooperativeStats from '@/features/cooperatives/components/CooperativeStats';
import PageShell from '@/components/layout/PageShell';
import { getFarmerCountByCooperative } from '@/features/producers/api/farmersApi';
import CooperativeEudrReadiness from '@/features/compliance/components/CooperativeEudrReadiness';

export default function CooperativeProfile() {
  const { id } = useParams<{ id: string }>();
  const { cooperatives, loading } = useCooperatives();
  const [activeTab, setActiveTab] = useState<'details' | 'map' | 'stats'>('details');
  const [farmerCount, setFarmerCount] = useState<number | null>(null);
  const [contactExpanded, setContactExpanded] = useState(false);

  // Support both UUID (string) and legacy numeric IDs
  const cooperative = cooperatives.find(c => {
    const coopId = String(c.id);
    const paramId = id || '';
    return coopId === paramId || coopId === String(Number(paramId));
  });

  // Load farmer count
  useEffect(() => {
    if (cooperative?.id) {
      getFarmerCountByCooperative(cooperative.id).then(({ data }) => {
        if (data !== null) {
          setFarmerCount(data);
        }
      });
    }
  }, [cooperative?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!cooperative) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Coopérative non trouvée</p>
          <Link
            to="/cooperatives"
            className="text-secondary-600 hover:text-secondary-700"
          >
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  // Support both database (is_verified) and legacy (status) verification fields
  const isVerified = cooperative.is_verified ?? cooperative.status === 'verified';
  
  // Support both database and legacy field names
  const sector = cooperative.sector || cooperative.secteur || '';
  const department = cooperative.department || cooperative.departement;

  return (
    <PageShell breadcrumbs={[
      { label: 'Home', path: '/' },
      { label: 'Cooperatives', path: '/cooperatives' },
      { label: cooperative.name }
    ]}>
      <div>

        {/* Header */}
        <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl shadow-lg p-8 mb-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  {cooperative.name}
                </h1>
                {isVerified ? (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm border border-white/30">
                    <CheckCircle className="h-4 w-4" />
                    Vérifiée
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/20 backdrop-blur-sm text-yellow-100 rounded-full text-sm border border-yellow-300/30">
                    <Clock className="h-4 w-4" />
                    En attente de vérification
                  </span>
                )}
              </div>
              <div className="ml-4 flex gap-2">
                <Link
                  to={`/compliance/child-labor?cooperativeId=${cooperative.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors border border-white/30"
                >
                  <Shield className="h-4 w-4" />
                  Voir Évaluations
                </Link>
                <Link
                  to={`/cooperative/${cooperative.id}/farmers-first`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors border border-white/30"
                >
                  <BookOpen className="h-5 w-5" />
                  Farmers First Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'details'
                    ? 'border-secondary-500 text-secondary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Building2 className="inline h-4 w-4 mr-2" />
                Détails
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'map'
                    ? 'border-secondary-500 text-secondary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <MapPin className="inline h-4 w-4 mr-2" />
                Carte
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'stats'
                    ? 'border-secondary-500 text-secondary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="inline h-4 w-4 mr-2" />
                Statistiques
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1">Informations Générales</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">{cooperative.region}</div>
                            {department && (
                              <div className="text-sm text-gray-600">{department}</div>
                            )}
                          </div>
                        </div>
                        {sector && (
                          <div className="flex items-start gap-3">
                            <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <div className="font-medium text-gray-900">{sector}</div>
                            </div>
                          </div>
                        )}
                        {cooperative.registrationNumber && (
                          <div>
                            <div className="text-sm text-gray-500">N° d'Enregistrement</div>
                            <div className="font-medium text-gray-900">{cooperative.registrationNumber}</div>
                          </div>
                        )}
                        {farmerCount !== null && (
                          <div className="flex items-start gap-3">
                            <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <div className="text-sm text-gray-500">Producteurs</div>
                              <div className="font-medium text-gray-900">{farmerCount} producteur{farmerCount !== 1 ? 's' : ''}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {(cooperative.president || cooperative.primaryPhoneE164 || cooperative.email || cooperative.address) && (
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setContactExpanded((prev) => !prev)}
                          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                        >
                          <h3 className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            Contact
                          </h3>
                          {contactExpanded ? (
                            <ChevronUp className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                        {contactExpanded && (
                          <div className="px-4 pb-4 pt-0 space-y-3 border-t border-gray-100">
                            {cooperative.president && (
                              <div className="flex items-start gap-3">
                                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                  <div className="text-sm text-gray-500">Président</div>
                                  <div className="font-medium text-gray-900">{cooperative.president}</div>
                                </div>
                              </div>
                            )}
                            {cooperative.primaryPhoneE164 && (
                              <div className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                  <div className="text-sm text-gray-500">Téléphone</div>
                                  <div className="font-medium text-gray-900">{cooperative.primaryPhoneE164}</div>
                                </div>
                              </div>
                            )}
                            {cooperative.email && (
                              <div className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                  <div className="text-sm text-gray-500">Email</div>
                                  <a 
                                    href={`mailto:${cooperative.email}`}
                                    className="font-medium text-secondary-600 hover:text-secondary-700"
                                  >
                                    {cooperative.email}
                                  </a>
                                </div>
                              </div>
                            )}
                            {cooperative.address && (
                              <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                  <div className="text-sm text-gray-500">Adresse</div>
                                  <div className="font-medium text-gray-900">{cooperative.address}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {cooperative.natureActivite && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Nature d'Activité</h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border-l-4 border-secondary-500">
                      {cooperative.natureActivite}
                    </p>
                    {cooperative.natureActiviteTags && cooperative.natureActiviteTags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {cooperative.natureActiviteTags.map(tag => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {cooperative.description && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Description</h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {cooperative.description}
                    </p>
                  </div>
                )}

                {/* EUDR Readiness Assessment */}
                <div className="border-t pt-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <CooperativeEudrReadiness
                      cooperativeId={cooperative.id}
                      editable={false}
                    />
                  </div>

                  {/* Contextual risk context — kept for supplementary info */}
                  {(cooperative.contextual_risks || cooperative.regulatory_context) && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cooperative.contextual_risks?.deforestation_zone && (
                        <div className="p-4 bg-white rounded-lg border">
                          <h4 className="font-medium text-gray-900 mb-2 text-sm flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            Deforestation Zone Risk
                          </h4>
                          <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                            cooperative.contextual_risks.deforestation_zone === 'high'
                              ? 'bg-red-100 text-red-800'
                              : cooperative.contextual_risks.deforestation_zone === 'medium'
                              ? 'bg-orange-100 text-orange-800'
                              : cooperative.contextual_risks.deforestation_zone === 'low'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {cooperative.contextual_risks.deforestation_zone.charAt(0).toUpperCase() +
                              cooperative.contextual_risks.deforestation_zone.slice(1)}
                          </span>
                        </div>
                      )}
                      {cooperative.regulatory_context?.eudr_applicable !== undefined && (
                        <div className="p-4 bg-white rounded-lg border">
                          <h4 className="font-medium text-gray-900 mb-2 text-sm flex items-center gap-2">
                            <FileCheck className="h-4 w-4 text-blue-500" />
                            EUDR Applicable
                          </h4>
                          <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                            cooperative.regulatory_context.eudr_applicable
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {cooperative.regulatory_context.eudr_applicable ? 'Yes — EU exports subject to EUDR' : 'Not applicable'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Integration Hook for ImpactSoluce */}
                  <div className="mt-4 p-4 bg-primary-50 rounded-lg border border-primary-200">
                    <h4 className="font-medium text-primary-900 mb-2 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Impact Profile (via ImpactSoluce)
                    </h4>
                    <p className="text-sm text-primary-700">
                      Additional contextual information may be available through ImpactSoluce integration.
                    </p>
                  </div>
                </div>

                {cooperative.latitude && cooperative.longitude && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Coordonnées GPS</h3>
                    <p className="text-gray-700 font-mono text-sm">
                      {cooperative.latitude.toFixed(6)}, {cooperative.longitude.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'map' && (
              <CooperativeLocationMap cooperative={cooperative} />
            )}

            {activeTab === 'stats' && (
              <CooperativeStats cooperative={cooperative} />
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

