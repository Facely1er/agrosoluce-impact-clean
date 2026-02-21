/**
 * AgroSoluce Intelligence Mobile App - Three-Tier Interface
 *
 * All data is loaded from Supabase — no hardcoded / simulated values.
 */

import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import {
  Target,
  Building2,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  FileText,
  BookOpen,
  MessageSquare,
  Calendar,
  MapPin,
  Activity,
  ClipboardList,
  Sprout,
  UserCheck,
  GraduationCap,
  DollarSign,
  Home,
  Phone,
  Video,
  Globe,
  ChevronRight,
  Plus,
  Eye,
  Clock,
  LogOut,
  ExternalLink,
  Loader2,
  ShoppingCart,
  Package,
  AlertCircle,
  Sun,
  Moon,
} from 'lucide-react';
import './IntelligenceApp.css';
import { useThemeMode } from '../lib/theme/ThemeModeProvider';
import { useI18n } from '../lib/i18n/I18nProvider';
import {
  getErmitsStats,
  getCooperativesList,
  getRecentAssessments,
  getCooperativeById,
  getMembersByCooperative,
  getTrainingSessionsByCooperative,
  getAssessmentsByCooperative,
  getComplianceByCooperative,
  getFarmerProfile,
  getDeclarationsByFarmer,
  type ErmitsStats,
  type CoopRow,
  type AssessmentRow,
  type CoopDetail,
  type MemberRow,
  type TrainingRow,
  type ComplianceRow,
  type FarmerProfile,
  type DeclarationRow,
} from '../lib/api/mobileApi';

// ─── Shared helpers ───────────────────────────────────────────────────────────

const Spinner = () => (
  <div className="loading-container">
    <Loader2 className="loading-spinner" />
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="empty-state">
    <AlertCircle className="empty-state-icon" />
    <p className="empty-state-text">{message}</p>
  </div>
);

// ─── Role Selector ────────────────────────────────────────────────────────────

const RoleSelector = () => {
  const navigate = useNavigate();
  return (
    <div className="role-selector">
      <div className="role-selector-content">
        <div className="role-selector-header">
          {/* Brand lockup — logo + name + tagline */}
          <div className="rs-logo-lockup">
            <img src="/agrosoluce.png" alt="AgroSoluce" className="rs-logo-img" />
            <div className="rs-logo-text">
              <span className="rs-brand-name">
                AgroSoluce<span className="rs-brand-sup">™</span>
              </span>
              <span className="rs-tagline">Source Intelligence</span>
              <span className="rs-tagline-by">by ERMITS</span>
            </div>
          </div>
          <p className="role-selector-subtitle">Field Operations Platform</p>
        </div>

        <div className="role-buttons">
          <button className="role-button role-button-ermits" onClick={() => navigate('/ermits')}>
            <div className="role-button-icon-wrapper"><Target className="role-button-icon" /></div>
            <div className="role-button-content">
              <h3 className="role-button-title">ERMITS Team</h3>
              <p className="role-button-desc">Command Center • Monitor cooperatives • Compliance oversight</p>
            </div>
            <ChevronRight className="role-button-arrow" />
          </button>

          <button className="role-button role-button-coop" onClick={() => navigate('/cooperative')}>
            <div className="role-button-icon-wrapper"><Building2 className="role-button-icon" /></div>
            <div className="role-button-content">
              <h3 className="role-button-title">Cooperative Manager</h3>
              <p className="role-button-desc">Operations Dashboard • Member management • Compliance tracking</p>
            </div>
            <ChevronRight className="role-button-arrow" />
          </button>

          <button className="role-button role-button-farmer" onClick={() => navigate('/farmer')}>
            <div className="role-button-icon-wrapper"><Users className="role-button-icon" /></div>
            <div className="role-button-content">
              <h3 className="role-button-title">Farmer</h3>
              <p className="role-button-desc">Field App • Data collection • Training access • Offline capable</p>
            </div>
            <ChevronRight className="role-button-arrow" />
          </button>
        </div>

        {(import.meta.env.VITE_WEB_APP_URL as string | undefined) && (
          <a
            href={import.meta.env.VITE_WEB_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="role-selector-platform-link"
          >
            <ExternalLink className="role-selector-platform-icon" />
            <span>Open full platform (web)</span>
          </a>
        )}
      </div>
    </div>
  );
};

// ─── ERMITS Team Dashboard ────────────────────────────────────────────────────

const ERMITSTeamDashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeMode();
  const { t, language, setLanguage } = useI18n();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'cooperatives' | 'compliance' | 'alerts'>('overview');
  const [stats, setStats] = useState<ErmitsStats | null>(null);
  const [cooperatives, setCooperatives] = useState<CoopRow[]>([]);
  const [assessments, setAssessments] = useState<AssessmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      getErmitsStats(),
      getCooperativesList(20),
      getRecentAssessments(10),
    ]).then(([statsRes, coopsRes, assessRes]) => {
      if (cancelled) return;
      if (statsRes.data) setStats(statsRes.data);
      setCooperatives(coopsRes.data);
      setAssessments(assessRes.data);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const actionRequired = cooperatives.filter(
    (c) => c.readiness_status === 'not_ready' || c.readiness_status === 'in_progress',
  );

  return (
    <div className="dashboard-container">
      <header className="header-ermits">
        <button type="button" className="header-back-btn" onClick={() => navigate('/')} aria-label={t.common.switchRole}>
          <LogOut className="header-back-icon" />
        </button>
        <div className="header-brand">
          <img src="/agrosoluce.png" alt="AgroSoluce" className="header-brand-logo" />
          <div className="header-brand-text">
            <span className="header-brand-name">AgroSoluce™</span>
            <span className="header-brand-sub">
              {stats ? `${stats.cooperativeCount.toLocaleString()} ${t.nav.cooperatives}` : t.common.loading}
            </span>
          </div>
        </div>
        <div className="header-actions-row">
          <button type="button" className="header-icon-btn" onClick={toggleTheme} aria-label={theme === 'light' ? t.common.themeDark : t.common.themeLight}>
            {theme === 'light' ? <Moon className="icon-sm" /> : <Sun className="icon-sm" />}
          </button>
          <div className="header-lang-row">
            <button type="button" className={`header-lang-btn ${language === 'en' ? 'active' : ''}`} onClick={() => setLanguage('en')}>EN</button>
            <button type="button" className={`header-lang-btn ${language === 'fr' ? 'active' : ''}`} onClick={() => setLanguage('fr')}>FR</button>
          </div>
        </div>
        <div className="header-badge">
          <Activity className="header-badge-icon" />
          <span>{t.common.live}</span>
        </div>
      </header>

      <nav className="bottom-nav">
        {([
          { key: 'overview', icon: BarChart3, label: t.nav.overview },
          { key: 'cooperatives', icon: Building2, label: t.nav.cooperatives },
          { key: 'compliance', icon: Shield, label: t.nav.compliance },
          { key: 'alerts', icon: AlertTriangle, label: t.nav.alerts },
        ] as const).map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            className={`bnav-tab ${selectedTab === key ? 'bnav-tab-active' : ''}`}
            onClick={() => setSelectedTab(key)}
          >
            <Icon className="bnav-icon" />
            <span className="bnav-label">{label}</span>
          </button>
        ))}
      </nav>

      <main className="dashboard-content">
        {loading ? (
          <Spinner />
        ) : (
          <>
            {selectedTab === 'overview' && (
              <div className="overview-content">
                <div className="metrics-grid">
                  <div className="metric-card metric-primary">
                    <div className="metric-header"><Building2 className="metric-icon" /><span className="metric-label">Active Cooperatives</span></div>
                    <div className="metric-value">{stats ? stats.cooperativeCount.toLocaleString() : '—'}</div>
                    <div className="metric-trend">{stats ? `${stats.onboardedCount.toLocaleString()} onboarded` : ''}</div>
                  </div>
                  <div className="metric-card metric-success">
                    <div className="metric-header"><Users className="metric-icon" /><span className="metric-label">Total Farmers</span></div>
                    <div className="metric-value">{stats ? stats.farmerCount.toLocaleString() : '—'}</div>
                  </div>
                  <div className="metric-card metric-info">
                    <div className="metric-header"><CheckCircle2 className="metric-icon" /><span className="metric-label">Buyer Ready</span></div>
                    <div className="metric-value">
                      {stats && stats.cooperativeCount > 0
                        ? `${Math.round((stats.compliantCount / stats.cooperativeCount) * 100)}%`
                        : '—'}
                    </div>
                    <div className="metric-trend">{stats ? `${stats.compliantCount.toLocaleString()} cooperatives` : ''}</div>
                  </div>
                  <div className="metric-card metric-warning">
                    <div className="metric-header"><AlertTriangle className="metric-icon" /><span className="metric-label">Action Required</span></div>
                    <div className="metric-value">{stats ? stats.actionRequiredCount.toLocaleString() : '—'}</div>
                  </div>
                </div>

                <div className="section-card">
                  <h3 className="section-title"><BarChart3 className="section-title-icon" />System Overview</h3>
                  <div className="overview-stats">
                    <div className="overview-stat">
                      <span className="overview-stat-label">EUDR Assessments</span>
                      <span className="overview-stat-value">{assessments.length > 0 ? assessments.length : '—'}</span>
                    </div>
                    <div className="overview-stat">
                      <span className="overview-stat-label">Onboarded Cooperatives</span>
                      <span className="overview-stat-value">{stats ? stats.onboardedCount.toLocaleString() : '—'}</span>
                    </div>
                    <div className="overview-stat">
                      <span className="overview-stat-label">Action Required</span>
                      <span className="overview-stat-value">{stats ? stats.actionRequiredCount.toLocaleString() : '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'cooperatives' && (
              <div className="list-content">
                <div className="section-header">
                  <h3 className="section-title">Cooperative Directory</h3>
                  <button className="btn-icon" aria-label="Add new cooperative" title="Add new cooperative">
                    <Plus className="icon-sm" />
                  </button>
                </div>
                {cooperatives.length === 0 ? (
                  <EmptyState message="No cooperatives found." />
                ) : (
                  <div className="cooperative-list">
                    {cooperatives.map((coop) => {
                      const isCompliant = coop.readiness_status === 'buyer_ready';
                      return (
                        <div key={coop.id} className="coop-card">
                          <div className="coop-header">
                            <div className="coop-info">
                              <h4 className="coop-name">{coop.name}</h4>
                              {coop.region && (
                                <div className="coop-meta"><MapPin className="icon-xs" /><span>{coop.region}</span></div>
                              )}
                            </div>
                            <div className={`status-badge status-${isCompliant ? 'compliant' : 'warning'}`}>
                              {isCompliant ? <CheckCircle2 className="icon-xs" /> : <AlertTriangle className="icon-xs" />}
                              <span>{isCompliant ? 'Ready' : 'In Progress'}</span>
                            </div>
                          </div>
                          {coop.farmer_count !== undefined && (
                            <div className="coop-stats">
                              <div className="coop-stat"><Users className="icon-xs" /><span>{coop.farmer_count.toLocaleString()} members</span></div>
                            </div>
                          )}
                          <button className="coop-action" onClick={() => navigate(`/cooperative?id=${coop.id}`)}>
                            <span>View Details</span>
                            <ChevronRight className="icon-xs" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'compliance' && (
              <div className="compliance-content">
                <div className="section-card">
                  <h3 className="section-title"><Shield className="section-title-icon" />Readiness Overview</h3>
                  <div className="compliance-metrics">
                    <div className="compliance-metric">
                      <div className="compliance-metric-header"><span className="compliance-metric-label">Buyer Ready</span><CheckCircle2 className="icon-sm text-success" /></div>
                      <div className="compliance-metric-value">{stats ? stats.compliantCount.toLocaleString() : '—'}</div>
                      <div className="compliance-metric-subtitle">of {stats ? stats.cooperativeCount.toLocaleString() : '—'} cooperatives</div>
                    </div>
                    <div className="compliance-metric">
                      <div className="compliance-metric-header"><span className="compliance-metric-label">Action Required</span><AlertTriangle className="icon-sm text-warning" /></div>
                      <div className="compliance-metric-value">{stats ? stats.actionRequiredCount.toLocaleString() : '—'}</div>
                      <div className="compliance-metric-subtitle">Not ready</div>
                    </div>
                    <div className="compliance-metric">
                      <div className="compliance-metric-header"><span className="compliance-metric-label">Assessments</span><Activity className="icon-sm text-info" /></div>
                      <div className="compliance-metric-value">{assessments.length}</div>
                      <div className="compliance-metric-subtitle">Total on record</div>
                    </div>
                  </div>
                </div>

                <div className="section-card">
                  <h3 className="section-title"><TrendingUp className="section-title-icon" />Recent Assessments</h3>
                  {assessments.length === 0 ? (
                    <EmptyState message="No assessments recorded yet." />
                  ) : (
                    <div className="assessment-list">
                      {assessments.slice(0, 5).map((a) => (
                        <div key={a.id} className="assessment-item">
                          <div className="assessment-info">
                            <h4 className="assessment-coop">{a.cooperative_name}</h4>
                            <div className="assessment-meta">
                              <Calendar className="icon-xs" />
                              <span>{new Date(a.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="assessment-scores">
                            <div className={`score-badge ${a.overall_score >= 80 ? 'score-good' : 'score-warning'}`}>
                              <span>{Math.round(a.overall_score)}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedTab === 'alerts' && (
              <div className="alerts-content">
                <div className="section-header">
                  <h3 className="section-title">Cooperatives Requiring Action</h3>
                </div>
                {actionRequired.length === 0 ? (
                  <EmptyState message="No cooperatives require immediate action." />
                ) : (
                  <div className="alert-list">
                    {actionRequired.slice(0, 10).map((coop) => (
                      <div key={coop.id} className="alert-card alert-medium">
                        <div className="alert-header">
                          <div className="alert-type-badge"><Shield className="icon-xs" /><span>Readiness</span></div>
                          <span className="alert-priority">{coop.readiness_status === 'in_progress' ? 'medium' : 'high'}</span>
                        </div>
                        <h4 className="alert-coop">{coop.name}</h4>
                        {coop.region && <p className="alert-message">{coop.region}</p>}
                        <div className="alert-footer">
                          <button className="alert-action" onClick={() => navigate(`/cooperative?id=${coop.id}`)}>
                            View Cooperative
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

// ─── Cooperative Dashboard ────────────────────────────────────────────────────

const CooperativeDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cooperativeId = searchParams.get('id') || '';
  const { theme, toggleTheme } = useThemeMode();
  const { t, language, setLanguage } = useI18n();

  const [selectedTab, setSelectedTab] = useState<'dashboard' | 'members' | 'farmers-first' | 'child-labor' | 'compliance' | 'sales'>('dashboard');
  const [coop, setCoop] = useState<CoopDetail | null>(null);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [trainings, setTrainings] = useState<TrainingRow[]>([]);
  const [assessments, setAssessments] = useState<AssessmentRow[]>([]);
  const [compliance, setCompliance] = useState<ComplianceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cooperativeId) { setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    Promise.all([
      getCooperativeById(cooperativeId),
      getMembersByCooperative(cooperativeId),
      getTrainingSessionsByCooperative(cooperativeId),
      getAssessmentsByCooperative(cooperativeId),
      getComplianceByCooperative(cooperativeId),
    ]).then(([coopRes, membersRes, trainingRes, assessRes, compRes]) => {
      if (cancelled) return;
      if (coopRes.data) setCoop(coopRes.data);
      setMembers(membersRes.data);
      setTrainings(trainingRes.data);
      setAssessments(assessRes.data);
      setCompliance(compRes.data);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [cooperativeId]);

  if (!cooperativeId) {
    return (
      <div className="dashboard-container">
        <header className="header-coop">
          <button type="button" className="header-back-btn" onClick={() => navigate('/')} aria-label={t.common.switchRole}>
            <LogOut className="header-back-icon" />
          </button>
          <div className="header-brand">
            <img src="/agrosoluce.png" alt="AgroSoluce" className="header-brand-logo" />
            <div className="header-brand-text">
              <span className="header-brand-name">AgroSoluce™</span>
              <span className="header-brand-sub">{t.nav.dashboard}</span>
            </div>
          </div>
        </header>
        <main className="dashboard-content">
          <div className="section-card">
            <EmptyState message={t.common.noCooperatives} />
            <button className="btn-full-primary" onClick={() => navigate('/ermits')}>
              {t.common.goToErmits} <ChevronRight className="icon-sm" />
            </button>
          </div>
        </main>
      </div>
    );
  }

  const memberCount = members.length;
  const latestAssessment = assessments[0];
  const readinessStatus = coop?.readiness_status;

  return (
    <div className="dashboard-container">
      <header className="header-coop">
        <button type="button" className="header-back-btn" onClick={() => navigate('/')} aria-label={t.common.switchRole}>
          <LogOut className="header-back-icon" />
        </button>
        <div className="header-brand">
          <img src="/agrosoluce.png" alt="AgroSoluce" className="header-brand-logo" />
          <div className="header-brand-text">
            <span className="header-brand-name">
              {loading ? 'AgroSoluce™' : (coop?.name || t.nav.cooperatives)}
            </span>
            <span className="header-brand-sub">
              {coop?.region ? `${memberCount} ${t.common.activeMembers} · ${coop.region}` : `${memberCount} ${t.common.activeMembers}`}
            </span>
          </div>
        </div>
        <div className="header-actions-row">
          <button type="button" className="header-icon-btn" onClick={toggleTheme} aria-label={theme === 'light' ? t.common.themeDark : t.common.themeLight}>
            {theme === 'light' ? <Moon className="icon-sm" /> : <Sun className="icon-sm" />}
          </button>
          <div className="header-lang-row">
            <button type="button" className={`header-lang-btn ${language === 'en' ? 'active' : ''}`} onClick={() => setLanguage('en')}>EN</button>
            <button type="button" className={`header-lang-btn ${language === 'fr' ? 'active' : ''}`} onClick={() => setLanguage('fr')}>FR</button>
          </div>
        </div>
        {!loading && (
          <div className={`header-badge ${readinessStatus === 'buyer_ready' ? 'badge-success' : ''}`}>
            {readinessStatus === 'buyer_ready'
              ? <><CheckCircle2 className="header-badge-icon" /><span>{t.common.ready}</span></>
              : <><AlertTriangle className="header-badge-icon" /><span>{t.common.inProgress}</span></>}
          </div>
        )}
      </header>

      <nav className="bottom-nav bnav-coop">
        {([
          { key: 'dashboard', icon: BarChart3, label: t.nav.dashboard },
          { key: 'members', icon: Users, label: t.nav.members },
          { key: 'farmers-first', icon: Sprout, label: t.nav.farmersFirst },
          { key: 'child-labor', icon: Shield, label: t.nav.childLabor },
          { key: 'compliance', icon: FileText, label: t.nav.compliance },
          { key: 'sales', icon: ShoppingCart, label: t.nav.sales },
        ] as const).map(({ key, icon: Icon, label }) => (
          <button key={key} className={`bnav-tab ${selectedTab === key ? 'bnav-tab-active' : ''}`} onClick={() => setSelectedTab(key)}>
            <Icon className="bnav-icon" />
            <span className="bnav-label">{label}</span>
          </button>
        ))}
      </nav>

      <main className="dashboard-content">
        {loading ? (
          <Spinner />
        ) : (
          <>
            {selectedTab === 'dashboard' && (
              <div className="overview-content">
                <div className="metrics-grid">
                  <div className="metric-card metric-success">
                    <div className="metric-header"><Users className="metric-icon" /><span className="metric-label">Active Members</span></div>
                    <div className="metric-value">{memberCount.toLocaleString()}</div>
                  </div>
                  <div className="metric-card metric-info">
                    <div className="metric-header"><ClipboardList className="metric-icon" /><span className="metric-label">Assessments</span></div>
                    <div className="metric-value">{assessments.length}</div>
                    {latestAssessment && <div className="metric-trend">Latest: {Math.round(latestAssessment.overall_score)}%</div>}
                  </div>
                  <div className="metric-card metric-primary">
                    <div className="metric-header"><GraduationCap className="metric-icon" /><span className="metric-label">Training Sessions</span></div>
                    <div className="metric-value">{trainings.length}</div>
                  </div>
                  <div className="metric-card metric-warning">
                    <div className="metric-header"><Shield className="metric-icon" /><span className="metric-label">Compliance Items</span></div>
                    <div className="metric-value">{compliance.filter((c) => !c.valid).length}</div>
                    <div className="metric-trend">need attention</div>
                  </div>
                </div>
                <div className="section-card">
                  <h3 className="section-title"><Activity className="section-title-icon" />Quick Actions</h3>
                  <div className="action-grid">
                    <button className="action-card" onClick={() => navigate('/cooperative/onboarding')}>
                      <FileText className="action-icon" /><span className="action-label">Setup Wizard</span>
                    </button>
                    <button className="action-card" onClick={() => setSelectedTab('members')}>
                      <Users className="action-icon" /><span className="action-label">View Members</span>
                    </button>
                    <button className="action-card" onClick={() => setSelectedTab('compliance')}>
                      <Shield className="action-icon" /><span className="action-label">Compliance</span>
                    </button>
                    <button className="action-card" onClick={() => setSelectedTab('child-labor')}>
                      <ClipboardList className="action-icon" /><span className="action-label">Assessments</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'members' && (
              <div className="list-content">
                <div className="section-header">
                  <h3 className="section-title">Member Directory ({memberCount})</h3>
                  <button className="btn-primary"><Plus className="icon-sm" /><span>Add</span></button>
                </div>
                {members.length === 0 ? (
                  <EmptyState message="No members registered yet." />
                ) : (
                  <div className="member-list">
                    {members.map((member) => (
                      <div key={member.id} className="member-card">
                        <div className="member-avatar"><Users className="icon-md" /></div>
                        <div className="member-info">
                          <h4 className="member-name">{member.name}</h4>
                          <p className="member-details">
                            {member.registration_number || 'No registration'}
                            {member.latitude && member.longitude && ` • GPS ✓`}
                          </p>
                        </div>
                        <button className="member-action" aria-label="View member details" title="View member details">
                          <Eye className="icon-sm" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'farmers-first' && (
              <div className="farmers-first-content">
                <div className="section-card">
                  <h3 className="section-title"><Sprout className="section-title-icon" />Farmers First Overview</h3>
                  <div className="metrics-grid">
                    <div className="metric-card metric-success">
                      <div className="metric-header"><UserCheck className="metric-icon" /><span className="metric-label">Registered Members</span></div>
                      <div className="metric-value">{memberCount.toLocaleString()}</div>
                    </div>
                    <div className="metric-card metric-primary">
                      <div className="metric-header"><GraduationCap className="metric-icon" /><span className="metric-label">Training Sessions</span></div>
                      <div className="metric-value">{trainings.length}</div>
                    </div>
                  </div>
                </div>
                <div className="section-card">
                  <h3 className="section-title"><BookOpen className="section-title-icon" />Training Sessions</h3>
                  {trainings.length === 0 ? (
                    <EmptyState message="No training sessions scheduled." />
                  ) : (
                    <div className="training-list">
                      {trainings.map((t) => (
                        <div key={t.id} className="training-item">
                          <div className="training-info">
                            <h4 className="training-title">{t.session_title}</h4>
                            <div className="training-meta">
                              <Users className="icon-xs" /><span>{t.attendance_count} attendees</span>
                              {t.scheduled_at && <><Clock className="icon-xs" /><span>{new Date(t.scheduled_at).toLocaleDateString()}</span></>}
                            </div>
                          </div>
                          <div className={`status-badge status-${t.status}`}>
                            {t.status === 'completed' ? <CheckCircle2 className="icon-xs" /> : <Activity className="icon-xs" />}
                            <span>{t.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedTab === 'child-labor' && (
              <div className="child-labor-content">
                <div className="section-card">
                  <div className="section-header">
                    <h3 className="section-title"><ClipboardList className="section-title-icon" />Assessments</h3>
                    <button className="btn-primary"><Plus className="icon-sm" /><span>New</span></button>
                  </div>
                  {assessments.length === 0 ? (
                    <EmptyState message="No assessments recorded for this cooperative." />
                  ) : (
                    <div className="assessment-list">
                      {assessments.map((a) => (
                        <div key={a.id} className="assessment-item">
                          <div className="assessment-info">
                            <h4 className="assessment-date">{new Date(a.created_at).toLocaleDateString()}</h4>
                          </div>
                          <div className="assessment-actions">
                            <div className={`score-badge ${a.overall_score >= 80 ? 'score-good' : 'score-warning'}`}>
                              <span>{Math.round(a.overall_score)}%</span>
                            </div>
                            <button className="btn-icon" aria-label="View assessment details" title="View assessment">
                              <Eye className="icon-sm" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedTab === 'compliance' && (
              <div className="compliance-content">
                <div className="section-card">
                  <h3 className="section-title"><FileText className="section-title-icon" />Compliance Status</h3>
                  {compliance.length === 0 ? (
                    <EmptyState message="No compliance records found." />
                  ) : (
                    <div className="compliance-list">
                      {compliance.map((item) => (
                        <div key={item.id} className="compliance-item">
                          <div className="compliance-item-header">
                            <span className="compliance-item-label">{item.label}</span>
                            {item.valid
                              ? <CheckCircle2 className="icon-sm text-success" />
                              : <AlertTriangle className="icon-sm text-warning" />}
                          </div>
                          <span className={`compliance-item-status ${item.valid ? '' : 'status-text-warning'}`}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedTab === 'sales' && (
              <div className="sales-content">
                <div className="section-card">
                  <h3 className="section-title"><Package className="section-title-icon" />Buyer Portal</h3>
                  <p className="section-desc">Connect with verified buyers looking for certified cooperatives.</p>
                  <a
                    href={`${import.meta.env.VITE_WEB_APP_URL || '#'}/buyer`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-full-primary"
                  >
                    Open Buyer Portal <ChevronRight className="icon-sm" />
                  </a>
                </div>
                <div className="section-card">
                  <EmptyState message="Order management is available on the full web platform." />
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

// ─── Farmer Field App ─────────────────────────────────────────────────────────

const LANGUAGES = ['Baoule', 'Agni', 'Dioula', 'Français'] as const;

const FarmerFieldApp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const farmerId = searchParams.get('id') || '';
  const { theme, setTheme, toggleTheme } = useThemeMode();
  const { t, language, setLanguage } = useI18n();

  const [selectedTab, setSelectedTab] = useState<'home' | 'training' | 'declarations' | 'help'>('home');
  const [fieldLanguage, setFieldLanguage] = useState('baoule');
  const [farmer, setFarmer] = useState<FarmerProfile | null>(null);
  const [declarations, setDeclarations] = useState<DeclarationRow[]>([]);
  const [trainings, setTrainings] = useState<TrainingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!farmerId) { setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    Promise.all([
      getFarmerProfile(farmerId),
      getDeclarationsByFarmer(farmerId),
    ]).then(([farmerRes, declRes]) => {
      if (cancelled) return;
      if (farmerRes.data) {
        setFarmer(farmerRes.data);
        // Load training for the cooperative
        getTrainingSessionsByCooperative(farmerRes.data.cooperative_id).then((tRes) => {
          if (!cancelled) setTrainings(tRes.data);
        });
      }
      setDeclarations(declRes.data);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [farmerId]);

  const pendingDeclarations = declarations.filter((d) => d.status === 'pending');
  const submittedDeclarations = declarations.filter((d) => d.status !== 'pending');

  return (
    <div className="dashboard-container">
      <header className="header-farmer">
        <button type="button" className="header-back-btn" onClick={() => navigate('/')} aria-label={t.common.switchRole}>
          <LogOut className="header-back-icon" />
        </button>
        <div className="header-brand">
          <img src="/agrosoluce.png" alt="AgroSoluce" className="header-brand-logo" />
          <div className="header-brand-text">
            <span className="header-brand-name">
              {farmer ? farmer.name : 'AgroSoluce™'}
            </span>
            <span className="header-brand-sub">
              {farmer?.cooperative_name
                ? `${farmer.cooperative_name} · ${t.app.fieldOps}`
                : t.app.fieldOps}
            </span>
          </div>
        </div>
        <div className="header-actions-row">
          <button type="button" className="header-icon-btn" onClick={toggleTheme} aria-label={theme === 'light' ? t.common.themeDark : t.common.themeLight}>
            {theme === 'light' ? <Moon className="icon-sm" /> : <Sun className="icon-sm" />}
          </button>
          <div className="header-lang-row">
            <button type="button" className={`header-lang-btn ${language === 'en' ? 'active' : ''}`} onClick={() => setLanguage('en')}>EN</button>
            <button type="button" className={`header-lang-btn ${language === 'fr' ? 'active' : ''}`} onClick={() => setLanguage('fr')}>FR</button>
          </div>
        </div>
      </header>

      <nav className="bottom-nav">
        {([
          { key: 'home', icon: Home, label: t.nav.home },
          { key: 'training', icon: BookOpen, label: t.nav.training },
          { key: 'declarations', icon: FileText, label: t.nav.declarations },
          { key: 'help', icon: Phone, label: t.nav.help },
        ] as const).map(({ key, icon: Icon, label }) => (
          <button key={key} className={`bnav-tab ${selectedTab === key ? 'bnav-tab-active' : ''}`} onClick={() => setSelectedTab(key)}>
            <Icon className="bnav-icon" />
            <span className="bnav-label">{label}</span>
          </button>
        ))}
      </nav>

      <main className="dashboard-content">
        {loading ? (
          <Spinner />
        ) : !farmerId || !farmer ? (
          <div className="section-card">
            <EmptyState message={t.common.noFarmerProfile} />
          </div>
        ) : (
          <>
            {selectedTab === 'home' && (
              <div className="farmer-home-content">
                <div className="welcome-card">
                  <h2 className="welcome-title">Welcome, {farmer.name}</h2>
                  <p className="welcome-subtitle">{farmer.cooperative_name || 'Your cooperative'}</p>
                </div>

                {pendingDeclarations.length > 0 && (
                  <div className="section-card">
                    <h3 className="section-title"><FileText className="section-title-icon" />Pending Declarations</h3>
                    <div className="declaration-list">
                      {pendingDeclarations.map((d) => (
                        <div key={d.id} className="declaration-item">
                          <div className="declaration-info">
                            <h4 className="declaration-title">{d.declaration_type}</h4>
                            <div className="declaration-meta">
                              <Calendar className="icon-xs" />
                              <span>{new Date(d.declaration_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <button className="btn-primary btn-sm">Submit</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {trainings.length > 0 && (
                  <div className="section-card">
                    <h3 className="section-title"><BookOpen className="section-title-icon" />Available Training</h3>
                    <div className="training-list">
                      {trainings.slice(0, 3).map((t) => (
                        <div key={t.id} className="training-item">
                          <div className="training-info">
                            <h4 className="training-title">{t.session_title}</h4>
                            {t.scheduled_at && (
                              <div className="training-meta"><Clock className="icon-xs" /><span>{new Date(t.scheduled_at).toLocaleDateString()}</span></div>
                            )}
                          </div>
                          <div className={`status-badge status-${t.status}`}>
                            {t.status === 'completed' ? <CheckCircle2 className="icon-xs" /> : <Clock className="icon-xs" />}
                            <span>{t.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {pendingDeclarations.length === 0 && trainings.length === 0 && (
                  <EmptyState message="Everything is up to date. No pending declarations or training." />
                )}
              </div>
            )}

            {selectedTab === 'training' && (
              <div className="training-content">
                <div className="section-card">
                  <h3 className="section-title"><BookOpen className="section-title-icon" />Training Programs</h3>
                  {trainings.length === 0 ? (
                    <EmptyState message="No training sessions available from your cooperative yet." />
                  ) : (
                    <div className="training-list">
                      {trainings.map((t) => (
                        <div key={t.id} className="training-card">
                          <div className="training-card-header">
                            <BookOpen className="training-card-icon" />
                            <div className={`status-badge status-${t.status}`}>
                              {t.status === 'completed' ? <CheckCircle2 className="icon-xs" /> : <Clock className="icon-xs" />}
                              <span>{t.status}</span>
                            </div>
                          </div>
                          <h4 className="training-card-title">{t.session_title}</h4>
                          <p className="training-card-description">{t.session_type}</p>
                          {t.scheduled_at && (
                            <div className="training-card-footer">
                              <div className="training-card-meta"><Calendar className="icon-xs" /><span>{new Date(t.scheduled_at).toLocaleDateString()}</span></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedTab === 'declarations' && (
              <div className="declarations-content">
                <div className="section-card">
                  <h3 className="section-title"><FileText className="section-title-icon" />My Declarations</h3>
                  {declarations.length === 0 ? (
                    <EmptyState message="No declarations on record." />
                  ) : (
                    <div className="declaration-list">
                      {declarations.map((d) => (
                        <div key={d.id} className="declaration-item">
                          <div className="declaration-info">
                            <h4 className="declaration-title">{d.declaration_type}</h4>
                            <div className="declaration-meta">
                              <Calendar className="icon-xs" />
                              <span>{new Date(d.declaration_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          {d.status === 'submitted' || d.status === 'approved' ? (
                            <div className="status-badge status-compliant">
                              <CheckCircle2 className="icon-xs" /><span>{d.status}</span>
                            </div>
                          ) : (
                            <button className="btn-primary btn-sm">Submit</button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="section-card">
                  <h3 className="section-title"><BarChart3 className="section-title-icon" />Progress</h3>
                  <div className="overview-stats">
                    <div className="overview-stat"><span className="overview-stat-label">Submitted</span><span className="overview-stat-value">{submittedDeclarations.length}</span></div>
                    <div className="overview-stat"><span className="overview-stat-label">Pending</span><span className="overview-stat-value">{pendingDeclarations.length}</span></div>
                    <div className="overview-stat">
                      <span className="overview-stat-label">Completion</span>
                      <span className="overview-stat-value">
                        {declarations.length > 0 ? `${Math.round((submittedDeclarations.length / declarations.length) * 100)}%` : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'help' && (
              <div className="help-content">
                <div className="section-card">
                  <h3 className="section-title"><Phone className="section-title-icon" />Need Help?</h3>
                  <div className="help-actions">
                    {[
                      { icon: Phone, title: 'Call Cooperative', desc: 'Contact your cooperative manager' },
                      { icon: MessageSquare, title: 'Send Message', desc: 'Send a message to support' },
                      { icon: Video, title: 'Training Videos', desc: 'Watch instructional videos' },
                    ].map(({ icon: Icon, title, desc }, idx) => (
                      <button key={idx} className="help-action-card">
                        <Icon className="help-action-icon" />
                        <div className="help-action-content">
                          <h4 className="help-action-title">{title}</h4>
                          <p className="help-action-desc">{desc}</p>
                        </div>
                        <ChevronRight className="icon-sm" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="section-card">
                  <h3 className="section-title"><Globe className="section-title-icon" />{t.common.language}</h3>
                  <div className="language-list">
                    <button type="button" className={`language-button ${language === 'en' ? 'language-button-active' : ''}`} onClick={() => setLanguage('en')}>
                      <span>{t.common.english}</span>
                      {language === 'en' && <CheckCircle2 className="icon-sm" />}
                    </button>
                    <button type="button" className={`language-button ${language === 'fr' ? 'language-button-active' : ''}`} onClick={() => setLanguage('fr')}>
                      <span>{t.common.french}</span>
                      {language === 'fr' && <CheckCircle2 className="icon-sm" />}
                    </button>
                  </div>
                </div>
                <div className="section-card">
                  <h3 className="section-title">{theme === 'light' ? <Moon className="section-title-icon" /> : <Sun className="section-title-icon" />}{t.common.theme}</h3>
                  <div className="language-list">
                    <button type="button" className={`language-button ${theme === 'light' ? 'language-button-active' : ''}`} onClick={() => setTheme('light')}>
                      <span>{t.common.themeLight}</span>
                      {theme === 'light' && <CheckCircle2 className="icon-sm" />}
                    </button>
                    <button type="button" className={`language-button ${theme === 'dark' ? 'language-button-active' : ''}`} onClick={() => setTheme('dark')}>
                      <span>{t.common.themeDark}</span>
                      {theme === 'dark' && <CheckCircle2 className="icon-sm" />}
                    </button>
                  </div>
                </div>
                <div className="section-card">
                  <h3 className="section-title"><Globe className="section-title-icon" />Language / Langue (field)</h3>
                  <div className="language-list">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        className={`language-button ${fieldLanguage === lang.toLowerCase() ? 'language-button-active' : ''}`}
                        onClick={() => setFieldLanguage(lang.toLowerCase())}
                      >
                        <span>{lang}</span>
                        {fieldLanguage === lang.toLowerCase() && <CheckCircle2 className="icon-sm" />}
                      </button>
                    ))}
                  </div>
                </div>

                {farmer && (
                  <div className="section-card">
                    <h3 className="section-title"><Users className="section-title-icon" />About Your Cooperative</h3>
                    <div className="overview-stats">
                      <div className="overview-stat"><span className="overview-stat-label">Cooperative</span><span className="overview-stat-value-sm">{farmer.cooperative_name || '—'}</span></div>
                      {farmer.registration_number && (
                        <div className="overview-stat"><span className="overview-stat-label">Reg. Number</span><span className="overview-stat-value-sm">{farmer.registration_number}</span></div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────

export const IntelligenceApp = () => (
  <Routes>
    <Route path="/" element={<RoleSelector />} />
    <Route path="/ermits" element={<ERMITSTeamDashboard />} />
    <Route path="/cooperative" element={<CooperativeDashboard />} />
    <Route path="/farmer" element={<FarmerFieldApp />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
