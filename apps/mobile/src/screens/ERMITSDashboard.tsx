import { useState } from 'react';
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
} from 'lucide-react';

const MOCK_TRENDS = [
  {
    title: 'Cocoa Demand Surge in EU',
    impact: 'Prices up 12% this month',
    action: 'Consider early harvest planning',
    type: 'market',
  },
  {
    title: 'EUDR Deadline Approaching',
    impact: '45 days until full compliance required',
    action: 'Complete GPS mapping for remaining farms',
    type: 'compliance',
  },
  {
    title: 'Drought Risk in Bas-Sassandra',
    impact: 'Rainfall 30% below seasonal average',
    action: 'Implement water conservation measures',
    type: 'climate',
  },
  {
    title: 'Child Labor Assessment Cycle',
    impact: 'Q1 assessments due in 3 weeks',
    action: 'Schedule field officers for 127 cooperatives',
    type: 'social',
  },
];

const TREND_COLORS: Record<string, string> = {
  market: 'trend-market',
  compliance: 'trend-compliance',
  climate: 'trend-climate',
  social: 'trend-social',
};

export const ERMITSDashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'cooperatives' | 'compliance' | 'alerts' | 'trends'>('overview');

  return (
    <div className="dashboard-container">
      <header className="header-ermits">
        <button type="button" className="header-back-btn" onClick={() => navigate('/')} aria-label="Switch role">
          <LogOut className="header-back-icon" />
        </button>
        <div className="header-content">
          <h1 className="header-title">ERMITS Command Center</h1>
          <p className="header-subtitle">Monitoring 3,797 Cooperatives</p>
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
        {selectedTab === 'overview' && (
          <div className="overview-content">
            <div className="metrics-grid">
              <div className="metric-card metric-primary">
                <div className="metric-header">
                  <Building2 className="metric-icon" />
                  <span className="metric-label">Active Cooperatives</span>
                </div>
                <div className="metric-value">3,797</div>
                <div className="metric-trend trend-up">+12 this week</div>
              </div>
              <div className="metric-card metric-success">
                <div className="metric-header">
                  <Users className="metric-icon" />
                  <span className="metric-label">Total Farmers</span>
                </div>
                <div className="metric-value">524,203</div>
                <div className="metric-trend trend-up">+1,847 this month</div>
              </div>
              <div className="metric-card metric-info">
                <div className="metric-header">
                  <CheckCircle2 className="metric-icon" />
                  <span className="metric-label">Documentation Ready</span>
                </div>
                <div className="metric-value">98.2%</div>
                <div className="metric-trend trend-up">+2.1% this month</div>
              </div>
              <div className="metric-card metric-warning">
                <div className="metric-header">
                  <AlertTriangle className="metric-icon" />
                  <span className="metric-label">Action Required</span>
                </div>
                <div className="metric-value">127</div>
                <div className="metric-trend">23 urgent</div>
              </div>
            </div>

            <div className="section-card">
              <h3 className="section-title">
                <BarChart3 className="section-title-icon" />
                System Overview
              </h3>
              <div className="overview-stats">
                <div className="overview-stat">
                  <span className="overview-stat-label">Child Labor Assessments</span>
                  <span className="overview-stat-value">2,341</span>
                </div>
                <div className="overview-stat">
                  <span className="overview-stat-label">Farmers First Coverage</span>
                  <span className="overview-stat-value">87.3%</span>
                </div>
                <div className="overview-stat">
                  <span className="overview-stat-label">Active Remediations</span>
                  <span className="overview-stat-value">45</span>
                </div>
                <div className="overview-stat">
                  <span className="overview-stat-label">Onboarded Cooperatives</span>
                  <span className="overview-stat-value">1,204</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'cooperatives' && (
          <div className="list-content">
            <div className="section-header">
              <h3 className="section-title">Cooperative Directory</h3>
              <button className="btn-icon" aria-label="Add new cooperative">
                <Plus className="icon-sm" />
              </button>
            </div>
            <div className="cooperative-list">
              {[
                { id: '1', name: 'SCAC Abidjan', region: 'Lagunes', members: 487, status: 'compliant', score: 92 },
                { id: '2', name: 'COOPAGRI San-Pedro', region: 'Bas-Sassandra', members: 1203, status: 'warning', score: 68 },
                { id: '3', name: 'UCODEC Daloa', region: 'Sassandra-Marahoué', members: 856, status: 'compliant', score: 88 },
              ].map((coop) => (
                <div key={coop.id} className="coop-card">
                  <div className="coop-header">
                    <div className="coop-info">
                      <h4 className="coop-name">{coop.name}</h4>
                      <div className="coop-meta">
                        <MapPin className="icon-xs" />
                        <span>{coop.region}</span>
                      </div>
                    </div>
                    <div className={`status-badge status-${coop.status}`}>
                      {coop.status === 'compliant'
                        ? <CheckCircle2 className="icon-xs" />
                        : <AlertTriangle className="icon-xs" />}
                      <span>{coop.status === 'compliant' ? 'Compliant' : 'Action Needed'}</span>
                    </div>
                  </div>
                  <div className="coop-stats">
                    <div className="coop-stat">
                      <Users className="icon-xs" />
                      <span>{coop.members} members</span>
                    </div>
                    <div className="coop-stat">
                      <BarChart3 className="icon-xs" />
                      <span>Score: {coop.score}%</span>
                    </div>
                  </div>
                  <button className="coop-action">
                    <span>View Details</span>
                    <ChevronRight className="icon-xs" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'compliance' && (
          <div className="compliance-content">
            <div className="section-card">
              <h3 className="section-title">
                <Shield className="section-title-icon" />
                Child Labor Monitoring
              </h3>
              <div className="compliance-metrics">
                <div className="compliance-metric">
                  <div className="compliance-metric-header">
                    <span className="compliance-metric-label">Assessments Completed</span>
                    <CheckCircle2 className="icon-sm text-success" />
                  </div>
                  <div className="compliance-metric-value">2,341</div>
                  <div className="compliance-metric-subtitle">of 3,797 cooperatives</div>
                </div>
                <div className="compliance-metric">
                  <div className="compliance-metric-header">
                    <span className="compliance-metric-label">Active Violations</span>
                    <AlertTriangle className="icon-sm text-warning" />
                  </div>
                  <div className="compliance-metric-value">23</div>
                  <div className="compliance-metric-subtitle">Requiring immediate action</div>
                </div>
                <div className="compliance-metric">
                  <div className="compliance-metric-header">
                    <span className="compliance-metric-label">Remediation Actions</span>
                    <Activity className="icon-sm text-info" />
                  </div>
                  <div className="compliance-metric-value">45</div>
                  <div className="compliance-metric-subtitle">In progress</div>
                </div>
              </div>
            </div>

            <div className="section-card">
              <h3 className="section-title">
                <TrendingUp className="section-title-icon" />
                Recent Assessments
              </h3>
              <div className="assessment-list">
                {[
                  { cooperative: 'SCAC Abidjan', date: '2024-12-10', score: 92, violations: 0 },
                  { cooperative: 'COOPAGRI San-Pedro', date: '2024-12-08', score: 68, violations: 2 },
                  { cooperative: 'UCODEC Daloa', date: '2024-12-05', score: 88, violations: 0 },
                ].map((assessment, idx) => (
                  <div key={idx} className="assessment-item">
                    <div className="assessment-info">
                      <h4 className="assessment-coop">{assessment.cooperative}</h4>
                      <div className="assessment-meta">
                        <Calendar className="icon-xs" />
                        <span>{new Date(assessment.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="assessment-scores">
                      <div className={`score-badge ${assessment.score >= 80 ? 'score-good' : 'score-warning'}`}>
                        <span>{assessment.score}%</span>
                      </div>
                      {assessment.violations > 0 && (
                        <div className="violation-badge">
                          <AlertTriangle className="icon-xs" />
                          <span>{assessment.violations}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'alerts' && (
          <div className="alerts-content">
            <div className="section-header">
              <h3 className="section-title">Compliance Alerts</h3>
              <button className="btn-icon" aria-label="Add new alert">
                <Plus className="icon-sm" />
              </button>
            </div>
            <div className="alert-list">
              {[
                { type: 'EUDR', priority: 'high', cooperative: 'SCAC Abidjan', message: 'GPS verification required for 23 farms', date: '2 hours ago' },
                { type: 'Child Labor', priority: 'medium', cooperative: 'COOPAGRI San-Pedro', message: 'School enrollment documents pending', date: '5 hours ago' },
                { type: 'Assessment', priority: 'low', cooperative: 'UCODEC Daloa', message: 'Annual assessment scheduled Dec 15', date: '1 day ago' },
              ].map((alert, idx) => (
                <div key={idx} className={`alert-card alert-${alert.priority}`}>
                  <div className="alert-header">
                    <div className="alert-type-badge">
                      <Shield className="icon-xs" />
                      <span>{alert.type}</span>
                    </div>
                    <span className="alert-priority">{alert.priority}</span>
                  </div>
                  <h4 className="alert-coop">{alert.cooperative}</h4>
                  <p className="alert-message">{alert.message}</p>
                  <div className="alert-footer">
                    <Clock className="icon-xs" />
                    <span>{alert.date}</span>
                    <button className="alert-action">Take Action</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'trends' && (
          <div className="trends-content">
            <div className="section-header">
              <h3 className="section-title">Agricultural Intelligence</h3>
              <span className="trends-updated">Updated today</span>
            </div>
            <div className="trends-list">
              {MOCK_TRENDS.map((trend, idx) => (
                <div key={idx} className={`trend-card ${TREND_COLORS[trend.type]}`}>
                  <div className="trend-header">
                    <TrendingUp className="trend-icon" />
                    <span className="trend-type">{trend.type}</span>
                  </div>
                  <h4 className="trend-title">{trend.title}</h4>
                  <p className="trend-impact">{trend.impact}</p>
                  <div className="trend-action-row">
                    <span className="trend-action-label">Recommended:</span>
                    <span className="trend-action-text">{trend.action}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-card">
              <h3 className="section-title">
                <Target className="section-title-icon" />
                Key Targets This Quarter
              </h3>
              <div className="target-list">
                {[
                  { label: 'EUDR Compliance Rate', current: 98.2, target: 100, unit: '%' },
                  { label: 'Farmers First Coverage', current: 87.3, target: 95, unit: '%' },
                  { label: 'GPS Plot Coverage', current: 72.1, target: 85, unit: '%' },
                  { label: 'Child Labor Assessments', current: 2341, target: 3797, unit: '' },
                ].map((kpi, idx) => {
                  const pct = kpi.unit === '%' ? kpi.current : Math.round((kpi.current / kpi.target) * 100);
                  return (
                    <div key={idx} className="target-item">
                      <div className="target-header">
                        <span className="target-label">{kpi.label}</span>
                        <span className="target-value">
                          {kpi.unit === '%' ? `${kpi.current}%` : `${kpi.current.toLocaleString()} / ${kpi.target.toLocaleString()}`}
                        </span>
                      </div>
                      <div className="target-bar">
                        <div className="target-bar-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
