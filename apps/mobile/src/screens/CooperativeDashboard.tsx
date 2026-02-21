import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Building2,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  FileText,
  Activity,
  Calendar,
  ClipboardList,
  Sprout,
  UserCheck,
  GraduationCap,
  MessageSquare,
  Plus,
  Eye,
  Clock,
  LogOut,
  BookOpen,
  ShoppingCart,
  Package,
  ChevronRight,
  AlertCircle,
  Loader2,
  MapPin,
} from 'lucide-react';
import { getOnboardingByCooperativeId } from '../features/onboarding/api/onboardingApi';
import {
  getCooperativeById,
  getMembersByCooperative,
  getTrainingSessionsByCooperative,
  getAssessmentsByCooperative,
  getComplianceByCooperative,
  type CoopDetail,
  type MemberRow,
  type TrainingRow,
  type AssessmentRow,
  type ComplianceRow,
} from '../lib/api/mobileApi';

// ─── Onboarding Banner ────────────────────────────────────────────────────────

interface OnboardingBannerProps {
  cooperativeId: string;
  onNavigate: () => void;
}

const OnboardingBanner = ({ cooperativeId, onNavigate }: OnboardingBannerProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    getOnboardingByCooperativeId(cooperativeId).then(({ data }) => {
      if (!data || data.status !== 'completed') setShow(true);
    });
  }, [cooperativeId]);

  if (!show) return null;

  return (
    <div className="onboarding-banner" onClick={onNavigate} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onNavigate()}>
      <AlertCircle className="onboarding-banner-icon" />
      <div className="onboarding-banner-content">
        <p className="onboarding-banner-title">Complete your setup</p>
        <p className="onboarding-banner-sub">Finish onboarding to unlock all features</p>
      </div>
      <ChevronRight className="onboarding-banner-arrow" />
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

export const CooperativeDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cooperativeId = searchParams.get('id') || '';

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
          <button type="button" className="header-back-btn" onClick={() => navigate('/')} aria-label="Switch role">
            <LogOut className="header-back-icon" />
          </button>
          <div className="header-content"><h1 className="header-title">Cooperative Dashboard</h1></div>
        </header>
        <main className="dashboard-content">
          <div className="section-card">
            <div className="empty-state">
              <AlertCircle className="empty-state-icon" />
              <p className="empty-state-text">No cooperative selected. Pass <code>?id=YOUR_COOPERATIVE_ID</code> in the URL.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const memberCount = members.length;
  const latestAssessment = assessments[0];
  const readinessStatus = coop?.readiness_status;
  const coverageMetrics = coop?.coverage_metrics;

  return (
    <div className="dashboard-container">
      <header className="header-coop">
        <button type="button" className="header-back-btn" onClick={() => navigate('/')} aria-label="Switch role">
          <LogOut className="header-back-icon" />
        </button>
        <div className="header-content">
          <h1 className="header-title">{loading ? 'Loading…' : (coop?.name || 'Cooperative')}</h1>
          <p className="header-subtitle">
            {coop?.region ? `${memberCount} Members • ${coop.region}` : `${memberCount} Members`}
          </p>
        </div>
        {!loading && (
          <div className={`header-badge ${readinessStatus === 'buyer_ready' ? 'badge-success' : 'badge-warning'}`}>
            {readinessStatus === 'buyer_ready'
              ? <><CheckCircle2 className="header-badge-icon" /><span>Ready</span></>
              : <><AlertTriangle className="header-badge-icon" /><span>In Progress</span></>}
          </div>
        )}
      </header>

      <OnboardingBanner cooperativeId={cooperativeId} onNavigate={() => navigate('/cooperative/onboarding')} />

      <nav className="tab-bar tab-bar-6">
        {([
          { key: 'dashboard', icon: BarChart3, label: 'Dashboard' },
          { key: 'members', icon: Users, label: 'Members' },
          { key: 'farmers-first', icon: Sprout, label: 'FF' },
          { key: 'child-labor', icon: Shield, label: 'CL' },
          { key: 'compliance', icon: FileText, label: 'Comply' },
          { key: 'sales', icon: ShoppingCart, label: 'Sales' },
        ] as const).map(({ key, icon: Icon, label }) => (
          <button key={key} className={`tab ${selectedTab === key ? 'tab-active' : ''}`} onClick={() => setSelectedTab(key)}>
            <Icon className="tab-icon" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <main className="dashboard-content">
        {loading ? (
          <div className="loading-container"><Loader2 className="loading-spinner" /></div>
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
                    <div className="metric-header"><Shield className="metric-icon" /><span className="metric-label">Compliance Issues</span></div>
                    <div className="metric-value">{compliance.filter((c) => !c.valid).length}</div>
                  </div>
                </div>

                {coverageMetrics && (
                  <div className="section-card">
                    <h3 className="section-title"><BarChart3 className="section-title-icon" />Data Coverage</h3>
                    <div className="overview-stats">
                      <div className="overview-stat">
                        <span className="overview-stat-label">Farmers documented</span>
                        <span className="overview-stat-value">{coverageMetrics.farmers_with_declarations ?? '—'} / {coverageMetrics.farmers_total ?? '—'}</span>
                      </div>
                      <div className="overview-stat">
                        <span className="overview-stat-label">Plots with GPS</span>
                        <span className="overview-stat-value">{coverageMetrics.plots_with_geo ?? '—'} / {coverageMetrics.plots_total ?? '—'}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="section-card">
                  <h3 className="section-title"><Activity className="section-title-icon" />Quick Actions</h3>
                  <div className="action-grid">
                    <button className="action-card" onClick={() => navigate('/cooperative/onboarding')}>
                      <FileText className="action-icon" /><span className="action-label">Setup Wizard</span>
                    </button>
                    <button className="action-card" onClick={() => setSelectedTab('members')}>
                      <Users className="action-icon" /><span className="action-label">Members</span>
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
                  <button className="btn-primary"><Plus className="icon-sm" /><span>Add Member</span></button>
                </div>
                {members.length === 0 ? (
                  <div className="empty-state"><AlertCircle className="empty-state-icon" /><p className="empty-state-text">No members registered yet.</p></div>
                ) : (
                  <div className="member-list">
                    {members.map((member) => (
                      <div key={member.id} className="member-card">
                        <div className="member-avatar"><Users className="icon-md" /></div>
                        <div className="member-info">
                          <h4 className="member-name">{member.name}</h4>
                          <p className="member-details">
                            {member.registration_number || 'No reg. number'}
                            {member.latitude && member.longitude ? ' • GPS ✓' : ''}
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
                    {coverageMetrics && (
                      <>
                        <div className="metric-card metric-info">
                          <div className="metric-header"><TrendingUp className="metric-icon" /><span className="metric-label">GPS Coverage</span></div>
                          <div className="metric-value">
                            {coverageMetrics.plots_total > 0
                              ? `${Math.round((coverageMetrics.plots_with_geo / coverageMetrics.plots_total) * 100)}%`
                              : '—'}
                          </div>
                          <div className="metric-trend">{coverageMetrics.plots_with_geo ?? 0} / {coverageMetrics.plots_total ?? 0} plots</div>
                        </div>
                        <div className="metric-card metric-warning">
                          <div className="metric-header"><FileText className="metric-icon" /><span className="metric-label">Documentation</span></div>
                          <div className="metric-value">
                            {coverageMetrics.farmers_total > 0
                              ? `${Math.round((coverageMetrics.farmers_with_declarations / coverageMetrics.farmers_total) * 100)}%`
                              : '—'}
                          </div>
                          <div className="metric-trend">{coverageMetrics.farmers_with_declarations ?? 0} / {coverageMetrics.farmers_total ?? 0} farmers</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="section-card">
                  <h3 className="section-title"><BookOpen className="section-title-icon" />Training Sessions</h3>
                  {trainings.length === 0 ? (
                    <div className="empty-state"><AlertCircle className="empty-state-icon" /><p className="empty-state-text">No training sessions scheduled.</p></div>
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
                    <div className="empty-state"><AlertCircle className="empty-state-icon" /><p className="empty-state-text">No assessments recorded for this cooperative.</p></div>
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
                    <div className="empty-state"><AlertCircle className="empty-state-icon" /><p className="empty-state-text">No compliance records found.</p></div>
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
                  <div className="empty-state">
                    <ShoppingCart className="empty-state-icon" />
                    <p className="empty-state-text">Order management is available on the full web platform.</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
