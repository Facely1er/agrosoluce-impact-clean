import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Building2,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  Activity,
  Calendar,
  MapPin,
  Plus,
  Clock,
  LogOut,
  ChevronRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  getErmitsStats,
  getCooperativesList,
  getRecentAssessments,
  type ErmitsStats,
  type CoopRow,
  type AssessmentRow,
} from '../lib/api/mobileApi';
import './IntelligenceApp.css';

const TREND_COLORS: Record<string, string> = {
  market: 'trend-market',
  compliance: 'trend-compliance',
  climate: 'trend-climate',
  social: 'trend-social',
};

export const ERMITSDashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'cooperatives' | 'compliance' | 'alerts' | 'trends'>('overview');
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
        <button type="button" className="header-back-btn" onClick={() => navigate('/')} aria-label="Switch role">
          <LogOut className="header-back-icon" />
        </button>
        <div className="header-content">
          <h1 className="header-title">ERMITS Command Center</h1>
          <p className="header-subtitle">
            {stats ? `Monitoring ${stats.cooperativeCount.toLocaleString()} Cooperatives` : 'Loading…'}
          </p>
        </div>
        <div className="header-badge">
          <Activity className="header-badge-icon" />
          <span>Live</span>
        </div>
      </header>

      <nav className="tab-bar tab-bar-5">
        {([
          { key: 'overview', icon: BarChart3, label: 'Overview' },
          { key: 'cooperatives', icon: Building2, label: 'Coops' },
          { key: 'compliance', icon: Shield, label: 'Compliance' },
          { key: 'alerts', icon: AlertTriangle, label: 'Alerts' },
          { key: 'trends', icon: TrendingUp, label: 'Trends' },
        ] as const).map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            className={`tab ${selectedTab === key ? 'tab-active' : ''}`}
            onClick={() => setSelectedTab(key)}
          >
            <Icon className="tab-icon" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <main className="dashboard-content">
        {loading ? (
          <div className="loading-container">
            <Loader2 className="loading-spinner" />
          </div>
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
                    <div className="metric-trend">{stats ? `${stats.compliantCount.toLocaleString()} coops` : ''}</div>
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
                    <div className="overview-stat">
                      <span className="overview-stat-label">Total Farmers</span>
                      <span className="overview-stat-value">{stats ? stats.farmerCount.toLocaleString() : '—'}</span>
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
                  <div className="empty-state">
                    <AlertCircle className="empty-state-icon" />
                    <p className="empty-state-text">No cooperatives found.</p>
                  </div>
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
                          <button className="coop-action">
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
                      <div className="compliance-metric-header"><span className="compliance-metric-label">Not Ready</span><AlertTriangle className="icon-sm text-warning" /></div>
                      <div className="compliance-metric-value">{stats ? stats.actionRequiredCount.toLocaleString() : '—'}</div>
                      <div className="compliance-metric-subtitle">Requiring action</div>
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
                    <div className="empty-state">
                      <AlertCircle className="empty-state-icon" />
                      <p className="empty-state-text">No assessments recorded yet.</p>
                    </div>
                  ) : (
                    <div className="assessment-list">
                      {assessments.slice(0, 5).map((assessment) => (
                        <div key={assessment.id} className="assessment-item">
                          <div className="assessment-info">
                            <h4 className="assessment-coop">{assessment.cooperative_name}</h4>
                            <div className="assessment-meta">
                              <Calendar className="icon-xs" />
                              <span>{new Date(assessment.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="assessment-scores">
                            <div className={`score-badge ${assessment.overall_score >= 80 ? 'score-good' : 'score-warning'}`}>
                              <span>{Math.round(assessment.overall_score)}%</span>
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
                  <button className="btn-icon" aria-label="Add new alert" title="Add new alert">
                    <Plus className="icon-sm" />
                  </button>
                </div>
                {actionRequired.length === 0 ? (
                  <div className="empty-state">
                    <CheckCircle2 className="empty-state-icon" />
                    <p className="empty-state-text">No cooperatives require immediate action.</p>
                  </div>
                ) : (
                  <div className="alert-list">
                    {actionRequired.slice(0, 10).map((coop) => (
                      <div key={coop.id} className={`alert-card alert-${coop.readiness_status === 'not_ready' ? 'high' : 'medium'}`}>
                        <div className="alert-header">
                          <div className="alert-type-badge"><Shield className="icon-xs" /><span>Readiness</span></div>
                          <span className="alert-priority">{coop.readiness_status === 'not_ready' ? 'high' : 'medium'}</span>
                        </div>
                        <h4 className="alert-coop">{coop.name}</h4>
                        {coop.region && <p className="alert-message">{coop.region}</p>}
                        <div className="alert-footer">
                          <Clock className="icon-xs" />
                          <span>Status: {coop.readiness_status}</span>
                          <button className="alert-action">Take Action</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'trends' && (
              <div className="trends-content">
                <div className="section-header">
                  <h3 className="section-title">Agricultural Intelligence</h3>
                </div>
                <div className="empty-state">
                  <TrendingUp className="empty-state-icon" />
                  <p className="empty-state-text">Market intelligence data will appear here once connected to the intelligence feed.</p>
                </div>

                <div className="section-card">
                  <h3 className="section-title"><Target className="section-title-icon" />Readiness Targets</h3>
                  {stats && stats.cooperativeCount > 0 ? (
                    <div className="target-list">
                      <div className="target-item">
                        <div className="target-header">
                          <span className="target-label">Buyer Ready Rate</span>
                          <span className="target-value">{Math.round((stats.compliantCount / stats.cooperativeCount) * 100)}%</span>
                        </div>
                        <div className="target-bar">
                          <div className={`target-bar-fill width-pct-${Math.min(Math.round((stats.compliantCount / stats.cooperativeCount) * 100), 100)}`} />
                        </div>
                      </div>
                      <div className="target-item">
                        <div className="target-header">
                          <span className="target-label">Onboarding Rate</span>
                          <span className="target-value">{stats.cooperativeCount > 0 ? `${stats.onboardedCount.toLocaleString()} / ${stats.cooperativeCount.toLocaleString()}` : '—'}</span>
                        </div>
                        <div className="target-bar">
                          <div className={`target-bar-fill width-pct-${Math.min(Math.round((stats.onboardedCount / stats.cooperativeCount) * 100), 100)}`} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <AlertCircle className="empty-state-icon" />
                      <p className="empty-state-text">No data available yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
