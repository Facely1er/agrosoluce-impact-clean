import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2, Users, Clock, CheckCircle, AlertCircle,
  Mail, Phone, MapPin, RefreshCw, Eye, Filter, Search,
  TrendingUp, ArrowRight, Shield, Link2, Copy, Check,
  Home, Sparkles
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';

interface CoopRequest {
  id: string;
  cooperative_name: string;
  contact_name: string;
  phone: string | null;
  email: string | null;
  region: string | null;
  primary_product: string | null;
  farmer_count: string | null;
  message: string | null;
  status: 'pending' | 'contacted' | 'invited' | 'converted' | 'rejected';
  created_at: string;
}

interface OnboardingRecord {
  id: string;
  cooperative_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
  current_step: number;
  started_at: string | null;
  completed_at: string | null;
  welcome_call_scheduled_at: string | null;
  cooperative_name?: string;
}

interface DirectoryCooperative {
  id: string;
  name: string;
  region: string | null;
  department: string | null;
  email: string | null;
  phone: string | null;
  user_profile_id: string | null;
}

const REQUEST_STATUS_CONFIG = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  contacted: { label: 'Contacté', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  invited: { label: 'Invité', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  converted: { label: 'Converti', color: 'bg-green-100 text-green-800 border-green-300' },
  rejected: { label: 'Refusé', color: 'bg-red-100 text-red-800 border-red-300' },
};

const ONBOARDING_STATUS_CONFIG = {
  pending: { label: 'En attente', color: 'bg-gray-100 text-gray-700', icon: Clock },
  in_progress: { label: 'En cours', color: 'bg-blue-100 text-blue-800', icon: TrendingUp },
  completed: { label: 'Terminé', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  on_hold: { label: 'En pause', color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
};

export default function AdminOnboardingPanel() {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'requests' | 'onboarding' | 'directory'>('requests');
  const [requests, setRequests] = useState<CoopRequest[]>([]);
  const [onboardings, setOnboardings] = useState<OnboardingRecord[]>([]);
  const [directoryCoops, setDirectoryCoops] = useState<DirectoryCooperative[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Guard: redirect if not admin
  useEffect(() => {
    if (!authLoading && (!profile || profile.user_type !== 'admin')) {
      navigate('/cooperative/login', { replace: true });
    }
  }, [profile, authLoading, navigate]);

  useEffect(() => {
    if (profile?.user_type === 'admin') {
      loadData();
    }
  }, [profile]);

  const loadData = async () => {
    setLoading(true);
    if (!supabase) { setLoading(false); return; }

    const [reqResult, onbResult, dirResult] = await Promise.all([
      supabase
        .from('cooperative_requests')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('cooperative_onboarding')
        .select('*, cooperatives(name)')
        .order('started_at', { ascending: false }),
      supabase
        .from('cooperatives')
        .select('id, name, region, department, email, phone, user_profile_id')
        .order('name', { ascending: true })
        .limit(500),
    ]);

    if (reqResult.data) setRequests(reqResult.data as CoopRequest[]);
    if (onbResult.data) {
      const mapped = onbResult.data.map((r: any) => ({
        ...r,
        cooperative_name: r.cooperatives?.name || '—',
      }));
      setOnboardings(mapped as OnboardingRecord[]);
    }
    if (dirResult.data) setDirectoryCoops(dirResult.data as DirectoryCooperative[]);
    setLoading(false);
  };

  const updateRequestStatus = async (id: string, status: CoopRequest['status']) => {
    if (!supabase) return;
    setUpdatingId(id);
    await supabase.from('cooperative_requests').update({ status }).eq('id', id);
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setUpdatingId(null);
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      !search ||
      r.cooperative_name.toLowerCase().includes(search.toLowerCase()) ||
      r.contact_name.toLowerCase().includes(search.toLowerCase()) ||
      (r.region || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredOnboardings = onboardings.filter((o) => {
    const matchesSearch =
      !search || (o.cooperative_name || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredDirectory = directoryCoops.filter((c) => {
    const matchesSearch =
      !search ||
      (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.region || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const buildInviteLink = (coop: DirectoryCooperative) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const params = new URLSearchParams();
    params.set('coop_id', coop.id);
    params.set('name', coop.name);
    if (coop.email) params.set('email', coop.email);
    return `${origin}/cooperative/register?${params.toString()}`;
  };

  const handleCopyInviteLink = (coop: DirectoryCooperative) => {
    const link = buildInviteLink(coop);
    navigator.clipboard.writeText(link).then(() => {
      setCopiedId(coop.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Stats
  const stats = {
    totalRequests: requests.length,
    pendingRequests: requests.filter((r) => r.status === 'pending').length,
    invitedRequests: requests.filter((r) => r.status === 'invited').length,
    convertedRequests: requests.filter((r) => r.status === 'converted').length,
    totalOnboardings: onboardings.length,
    completedOnboardings: onboardings.filter((o) => o.status === 'completed').length,
    inProgressOnboardings: onboardings.filter((o) => o.status === 'in_progress').length,
    pendingCalls: onboardings.filter((o) => o.welcome_call_scheduled_at && !o.completed_at).length,
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-primary-50/30 to-secondary-50/20">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-200 border-t-primary-600" />
          <p className="text-sm text-gray-500">Chargement du tableau de bord…</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Demandes totales', value: stats.totalRequests, sub: 'toutes périodes', icon: Building2, bg: 'bg-slate-100', iconColor: 'text-slate-600', border: 'hover:border-slate-300' },
    { label: 'En attente', value: stats.pendingRequests, sub: 'à traiter', icon: Clock, bg: 'bg-amber-100', iconColor: 'text-amber-600', border: 'hover:border-amber-300' },
    { label: 'Intégrations actives', value: stats.inProgressOnboardings, sub: 'en cours', icon: TrendingUp, bg: 'bg-blue-100', iconColor: 'text-blue-600', border: 'hover:border-blue-300' },
    { label: 'Terminées', value: stats.completedOnboardings, sub: 'intégrations', icon: CheckCircle, bg: 'bg-primary-100', iconColor: 'text-primary-600', border: 'hover:border-primary-400' },
  ];

  const tabs = [
    { id: 'requests' as const, label: 'Demandes', count: requests.length, icon: Users },
    { id: 'onboarding' as const, label: 'Intégrations', count: onboardings.length, icon: TrendingUp },
    { id: 'directory' as const, label: 'Répertoire', count: directoryCoops.length, icon: Building2 },
  ];

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-slate-50 via-primary-50/40 to-secondary-50/30 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 coop-landing-dot-pattern text-primary-100/50 pointer-events-none" aria-hidden />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">Admin</span>
                  <Sparkles className="h-3.5 w-3.5 text-secondary-500" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pipeline d'intégration</h1>
                <p className="text-gray-600 mt-1">
                  {profile?.full_name ? `Bienvenue, ${profile.full_name}. ` : ''}
                  Suivez les demandes et l'intégration des coopératives.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                to="/"
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white/80 text-gray-700 hover:bg-white hover:border-primary-200 hover:text-primary-700 transition-all text-sm font-medium shadow-sm"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Accueil</span>
              </Link>
              <button
                onClick={loadData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition-all text-sm font-medium shadow-sm disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
            </div>
          </div>
        </header>

        {/* Stats row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" aria-label="Statistiques">
          {statCards.map(({ label, value, sub, icon: Icon, bg, iconColor, border }) => (
            <div
              key={label}
              className={`bg-white/90 backdrop-blur rounded-2xl p-5 border-2 border-white/80 shadow-sm hover:shadow-md transition-all duration-200 ${border} animate-fade-in`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-2xl font-bold text-gray-900 tabular-nums">{value}</p>
                  <p className="text-sm font-medium text-gray-700 mt-0.5">{label}</p>
                  {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
                </div>
                <div className={`flex-shrink-0 w-11 h-11 rounded-xl ${bg} flex items-center justify-center ${iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Tabs + Filters */}
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-lg border border-gray-200/80 overflow-hidden animate-fade-in">
          <div className="border-b border-gray-200 bg-gray-50/60 px-4 sm:px-6 pt-4 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
              {tabs.map(({ id, label, count, icon: TabIcon }) => (
                <button
                  key={id}
                  onClick={() => { setActiveTab(id); setStatusFilter('all'); setSearch(''); }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === id
                      ? 'bg-white text-primary-700 shadow-sm border border-primary-100'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
                  }`}
                >
                  <TabIcon className="h-4 w-4" />
                  {label}
                  <span className={`ml-0.5 px-1.5 py-0.5 rounded-md text-xs font-semibold ${activeTab === id ? 'bg-primary-100 text-primary-700' : 'bg-gray-200 text-gray-600'}`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none w-48 sm:w-52 transition-shadow"
                />
              </div>
              {activeTab !== 'directory' && (
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none"
                    aria-label="Filtrer par statut"
                  >
                    <option value="all">Tous les statuts</option>
                    {activeTab === 'requests'
                      ? Object.entries(REQUEST_STATUS_CONFIG).map(([k, v]) => (
                          <option key={k} value={k}>{v.label}</option>
                        ))
                      : Object.entries(ONBOARDING_STATUS_CONFIG).map(([k, v]) => (
                          <option key={k} value={k}>{v.label}</option>
                        ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-200 border-t-primary-600" />
              <p className="text-sm text-gray-500">Chargement des données…</p>
            </div>
          ) : activeTab === 'requests' ? (
            <RequestsTable
              requests={filteredRequests}
              updatingId={updatingId}
              onStatusChange={updateRequestStatus}
            />
          ) : activeTab === 'onboarding' ? (
            <OnboardingsTable onboardings={filteredOnboardings} />
          ) : (
            <DirectoryTable
              cooperatives={filteredDirectory}
              copiedId={copiedId}
              onCopyInviteLink={handleCopyInviteLink}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function RequestsTable({
  requests,
  updatingId,
  onStatusChange,
}: {
  requests: CoopRequest[];
  updatingId: string | null;
  onStatusChange: (id: string, status: CoopRequest['status']) => void;
}) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-20 px-6">
        <div className="inline-flex w-16 h-16 rounded-2xl bg-primary-50 items-center justify-center mb-4">
          <Users className="h-8 w-8 text-primary-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Aucune demande</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Les demandes d'accès des coopératives apparaîtront ici. Pensez à actualiser après une nouvelle soumission.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50/80 border-b border-gray-200">
          <tr>
            {['Coopérative', 'Contact', 'Région / Produit', 'Producteurs', 'Date', 'Statut', 'Actions'].map((h) => (
              <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {requests.map((req) => {
            const statusCfg = REQUEST_STATUS_CONFIG[req.status];
            return (
              <tr key={req.id} className="hover:bg-primary-50/40 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="font-semibold text-gray-900">{req.cooperative_name}</div>
                  {req.message && (
                    <div className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate" title={req.message}>
                      {req.message}
                    </div>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <div className="font-medium text-gray-800">{req.contact_name}</div>
                  <div className="flex flex-col gap-0.5 mt-1">
                    {req.phone && (
                      <a href={`tel:${req.phone}`} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                        <Phone className="h-3 w-3" /> {req.phone}
                      </a>
                    )}
                    {req.email && (
                      <a href={`mailto:${req.email}`} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                        <Mail className="h-3 w-3" /> {req.email}
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-gray-600">
                  {req.region && (
                    <div className="flex items-center gap-1 text-xs">
                      <MapPin className="h-3 w-3" /> {req.region}
                    </div>
                  )}
                  {req.primary_product && (
                    <div className="text-xs mt-0.5 text-primary-700 font-medium">{req.primary_product}</div>
                  )}
                </td>
                <td className="px-5 py-3.5 text-center text-gray-600 text-xs">{req.farmer_count || '—'}</td>
                <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                  {new Date(req.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusCfg.color}`}>
                    {statusCfg.label}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <select
                    value={req.status}
                    onChange={(e) => onStatusChange(req.id, e.target.value as CoopRequest['status'])}
                    disabled={updatingId === req.id}
                    aria-label={`Changer le statut de ${req.cooperative_name}`}
                    className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none disabled:opacity-50"
                  >
                    {Object.entries(REQUEST_STATUS_CONFIG).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function OnboardingsTable({ onboardings }: { onboardings: OnboardingRecord[] }) {
  if (onboardings.length === 0) {
    return (
      <div className="text-center py-20 px-6">
        <div className="inline-flex w-16 h-16 rounded-2xl bg-blue-50 items-center justify-center mb-4">
          <TrendingUp className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Aucune intégration</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Les parcours d'intégration en cours ou terminés s'afficheront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50/80 border-b border-gray-200">
          <tr>
            {['Coopérative', 'Étape', 'Statut', 'Débuté le', 'Terminé le', 'Appel de bienvenue', 'Actions'].map((h) => (
              <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {onboardings.map((o) => {
            const cfg = ONBOARDING_STATUS_CONFIG[o.status];
            const StatusIcon = cfg.icon;
            return (
              <tr key={o.id} className="hover:bg-primary-50/40 transition-colors">
                <td className="px-5 py-3.5 font-semibold text-gray-900">{o.cooperative_name}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-primary-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${(o.current_step / 7) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 whitespace-nowrap">{o.current_step}/7</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                    <StatusIcon className="h-3 w-3" />
                    {cfg.label}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-xs text-gray-500">
                  {o.started_at
                    ? new Date(o.started_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
                    : '—'}
                </td>
                <td className="px-5 py-3.5 text-xs text-gray-500">
                  {o.completed_at
                    ? new Date(o.completed_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
                    : '—'}
                </td>
                <td className="px-5 py-3.5 text-xs">
                  {o.welcome_call_scheduled_at ? (
                    <span className="flex items-center gap-1 text-green-700">
                      <CheckCircle className="h-3.5 w-3.5" />
                      {new Date(o.welcome_call_scheduled_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                    </span>
                  ) : (
                    <span className="text-gray-400">Non planifié</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <Link
                    to={`/cooperative/onboarding/${o.cooperative_id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-primary-600 hover:bg-primary-50 font-medium transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Voir
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DirectoryTable({
  cooperatives,
  copiedId,
  onCopyInviteLink,
}: {
  cooperatives: DirectoryCooperative[];
  copiedId: string | null;
  onCopyInviteLink: (coop: DirectoryCooperative) => void;
}) {
  if (cooperatives.length === 0) {
    return (
      <div className="text-center py-20 px-6">
        <div className="inline-flex w-16 h-16 rounded-2xl bg-secondary-50 items-center justify-center mb-4">
          <Building2 className="h-8 w-8 text-secondary-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Aucune coopérative</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Aucun résultat pour cette recherche. Essayez un autre terme ou affichez le répertoire complet.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50/80 border-b border-gray-200">
          <tr>
            {['Coopérative', 'Région', 'Contact', 'Compte', 'Lien d\'invitation'].map((h) => (
              <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {cooperatives.map((coop) => {
            const hasAccount = !!coop.user_profile_id;
            const justCopied = copiedId === coop.id;
            return (
              <tr key={coop.id} className="hover:bg-primary-50/40 transition-colors">
                <td className="px-5 py-3.5 font-semibold text-gray-900">{coop.name}</td>
                <td className="px-5 py-3.5 text-gray-600">
                  {coop.region && (
                    <span className="flex items-center gap-1 text-xs">
                      <MapPin className="h-3 w-3" /> {coop.region}
                      {coop.department ? ` · ${coop.department}` : ''}
                    </span>
                  )}
                  {!coop.region && '—'}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-col gap-0.5">
                    {coop.email && (
                      <a href={`mailto:${coop.email}`} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                        <Mail className="h-3 w-3" /> {coop.email}
                      </a>
                    )}
                    {coop.phone && (
                      <a href={`tel:${coop.phone}`} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                        <Phone className="h-3 w-3" /> {coop.phone}
                      </a>
                    )}
                    {!coop.email && !coop.phone && <span className="text-gray-400 text-xs">—</span>}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  {hasAccount ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                      <CheckCircle className="h-3 w-3" /> Compte lié
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-300">
                      Sans compte
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  {hasAccount ? (
                    <span className="text-xs text-gray-400" title="Un compte est déjà lié à cette coopérative">
                      —
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onCopyInviteLink(coop)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        justCopied
                          ? 'bg-primary-100 text-primary-800 border border-primary-200'
                          : 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-100'
                      }`}
                      title="Copier le lien d'invitation à envoyer à la coopérative (WhatsApp, e-mail, etc.)"
                    >
                      {justCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Copié !
                        </>
                      ) : (
                        <>
                          <Link2 className="h-3.5 w-3.5" />
                          Copier le lien
                        </>
                      )}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
