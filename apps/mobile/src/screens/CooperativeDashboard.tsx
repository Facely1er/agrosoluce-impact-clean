import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Shield,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  FileText,
  Activity,
  Calendar,
  MapPin,
  ClipboardList,
  Sprout,
  UserCheck,
  GraduationCap,
  DollarSign,
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
} from 'lucide-react';
import { getOnboardingByCooperativeId } from '../features/onboarding/api/onboardingApi';

interface OnboardingBannerProps {
  cooperativeId: string;
  onNavigate: () => void;
}

const OnboardingBanner = ({ cooperativeId, onNavigate }: OnboardingBannerProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    getOnboardingByCooperativeId(cooperativeId).then(({ data }) => {
      if (!data || data.status !== 'completed') {
        setShow(true);
      }
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

export const CooperativeDashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'dashboard' | 'members' | 'farmers-first' | 'child-labor' | 'compliance' | 'sales'>('dashboard');

  // In a real implementation this comes from auth context
  const cooperativeId = 'demo-coop-id';

  return (
    <div className="dashboard-container">
      <header className="header-coop">
        <button type="button" className="header-back-btn" onClick={() => navigate('/')} aria-label="Switch role">
          <LogOut className="header-back-icon" />
        </button>
        <div className="header-content">
          <h1 className="header-title">SCAC Abidjan</h1>
          <p className="header-subtitle">487 Members • Lagunes Region</p>
        </div>
        <div className="header-badge badge-success">
          <CheckCircle2 className="header-badge-icon" />
          <span>Compliant</span>
        </div>
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
        {selectedTab === 'dashboard' && (
          <div className="overview-content">
            <div className="metrics-grid">
              <div className="metric-card metric-primary">
                <div className="metric-header">
                  <DollarSign className="metric-icon" />
                  <span className="metric-label">Monthly Revenue</span>
                </div>
                <div className="metric-value">€127,500</div>
                <div className="metric-trend trend-up">+18% vs last month</div>
              </div>
              <div className="metric-card metric-success">
                <div className="metric-header">
                  <Users className="metric-icon" />
                  <span className="metric-label">Active Members</span>
                </div>
                <div className="metric-value">487</div>
                <div className="metric-trend trend-up">+12 this month</div>
              </div>
              <div className="metric-card metric-info">
                <div className="metric-header">
                  <Package className="metric-icon" />
                  <span className="metric-label">Production</span>
                </div>
                <div className="metric-value">23.4 t</div>
                <div className="metric-trend">Cocoa, Coffee</div>
              </div>
              <div className="metric-card metric-warning">
                <div className="metric-header">
                  <AlertTriangle className="metric-icon" />
                  <span className="metric-label">Pending Orders</span>
                </div>
                <div className="metric-value">12</div>
                <div className="metric-trend">3 urgent</div>
              </div>
            </div>

            <div className="section-card">
              <h3 className="section-title">
                <Activity className="section-title-icon" />
                Quick Actions
              </h3>
              <div className="action-grid">
                <button className="action-card" onClick={() => navigate('/cooperative/onboarding')}>
                  <FileText className="action-icon" />
                  <span className="action-label">Setup Wizard</span>
                </button>
                <button className="action-card">
                  <MapPin className="action-icon" />
                  <span className="action-label">Update GPS</span>
                </button>
                <button className="action-card">
                  <MessageSquare className="action-icon" />
                  <span className="action-label">Contact ERMITS</span>
                </button>
                <button className="action-card">
                  <Plus className="action-icon" />
                  <span className="action-label">New Assessment</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'members' && (
          <div className="list-content">
            <div className="section-header">
              <h3 className="section-title">Member Directory</h3>
              <button className="btn-primary">
                <Plus className="icon-sm" />
                <span>Add Member</span>
              </button>
            </div>
            <div className="search-bar">
              <input type="search" className="search-input" placeholder="Search members..." />
            </div>
            <div className="member-list">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="member-card">
                  <div className="member-avatar">
                    <Users className="icon-md" />
                  </div>
                  <div className="member-info">
                    <h4 className="member-name">Farmer {i}</h4>
                    <p className="member-details">Plot {i} • 2.3 hectares • Cocoa</p>
                  </div>
                  <button className="member-action" aria-label="View member details">
                    <Eye className="icon-sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'farmers-first' && (
          <div className="farmers-first-content">
            <div className="section-card">
              <h3 className="section-title">
                <Sprout className="section-title-icon" />
                Farmers First Overview
              </h3>
              <div className="metrics-grid">
                {[
                  { icon: UserCheck, label: 'Onboarding Coverage', value: '87%', sub: '425 / 487 farmers', type: 'metric-success' },
                  { icon: CheckCircle2, label: 'Declarations', value: '78%', sub: '380 / 487 farmers', type: 'metric-info' },
                  { icon: GraduationCap, label: 'Training Coverage', value: '65%', sub: '317 / 487 farmers', type: 'metric-primary' },
                  { icon: TrendingUp, label: 'Impact Tracking', value: '42', sub: 'Data points', type: 'metric-warning' },
                ].map(({ icon: Icon, label, value, sub, type }, idx) => (
                  <div key={idx} className={`metric-card ${type}`}>
                    <div className="metric-header">
                      <Icon className="metric-icon" />
                      <span className="metric-label">{label}</span>
                    </div>
                    <div className="metric-value">{value}</div>
                    <div className="metric-trend">{sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card">
              <h3 className="section-title">
                <BookOpen className="section-title-icon" />
                Training Programs
              </h3>
              <div className="training-list">
                {[
                  { title: 'Sustainable Farming Practices', participants: 245, status: 'active' },
                  { title: 'Child Labor Prevention', participants: 180, status: 'active' },
                  { title: 'Financial Literacy', participants: 92, status: 'completed' },
                ].map((training, idx) => (
                  <div key={idx} className="training-item">
                    <div className="training-info">
                      <h4 className="training-title">{training.title}</h4>
                      <div className="training-meta">
                        <Users className="icon-xs" />
                        <span>{training.participants} participants</span>
                      </div>
                    </div>
                    <div className={`status-badge status-${training.status}`}>
                      {training.status === 'active' ? <Activity className="icon-xs" /> : <CheckCircle2 className="icon-xs" />}
                      <span>{training.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card">
              <h3 className="section-title">
                <BarChart3 className="section-title-icon" />
                Impact Metrics
              </h3>
              <div className="impact-metrics">
                <div className="impact-metric">
                  <div className="impact-metric-label">Children in School</div>
                  <div className="impact-metric-value">681</div>
                </div>
                <div className="impact-metric">
                  <div className="impact-metric-label">Youth Jobs Created</div>
                  <div className="impact-metric-value">22</div>
                </div>
                <div className="impact-metric">
                  <div className="impact-metric-label">Economic Impact</div>
                  <div className="impact-metric-value">€2.78M</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'child-labor' && (
          <div className="child-labor-content">
            <div className="section-card">
              <h3 className="section-title">
                <Shield className="section-title-icon" />
                Child Labor Protection Status
              </h3>
              <div className="compliance-status-grid">
                {[
                  { icon: CheckCircle2, title: 'Assessment Score', value: '92%', sub: 'Last assessment: Dec 10, 2024', type: 'status-good' },
                  { icon: GraduationCap, title: 'School Enrollment', value: '94.2%', sub: '681 children enrolled', type: 'status-good' },
                  { icon: CheckCircle2, title: 'Violations', value: '0', sub: 'No violations detected', type: 'status-excellent' },
                ].map(({ icon: Icon, title, value, sub, type }, idx) => (
                  <div key={idx} className={`status-card ${type}`}>
                    <Icon className="status-icon" />
                    <div className="status-content">
                      <h4 className="status-title">{title}</h4>
                      <div className="status-value">{value}</div>
                      <p className="status-subtitle">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card">
              <div className="section-header">
                <h3 className="section-title">
                  <ClipboardList className="section-title-icon" />
                  Recent Assessments
                </h3>
                <button className="btn-primary">
                  <Plus className="icon-sm" />
                  <span>New</span>
                </button>
              </div>
              <div className="assessment-list">
                {[
                  { date: '2024-12-10', assessor: 'Field Officer A', score: 92, violations: 0, children: 681 },
                  { date: '2024-11-15', assessor: 'Field Officer B', score: 89, violations: 0, children: 675 },
                  { date: '2024-10-20', assessor: 'Field Officer A', score: 87, violations: 1, children: 670 },
                ].map((assessment, idx) => (
                  <div key={idx} className="assessment-item">
                    <div className="assessment-info">
                      <h4 className="assessment-date">{new Date(assessment.date).toLocaleDateString()}</h4>
                      <p className="assessment-assessor">by {assessment.assessor}</p>
                      <div className="assessment-details">
                        <div className="assessment-detail">
                          <BarChart3 className="icon-xs" />
                          <span>{assessment.score}%</span>
                        </div>
                        <div className="assessment-detail">
                          <Users className="icon-xs" />
                          <span>{assessment.children} children</span>
                        </div>
                      </div>
                    </div>
                    <div className="assessment-actions">
                      {assessment.violations > 0 ? (
                        <div className="violation-badge">
                          <AlertTriangle className="icon-xs" />
                          <span>{assessment.violations} violation</span>
                        </div>
                      ) : (
                        <div className="status-badge status-compliant">
                          <CheckCircle2 className="icon-xs" />
                          <span>Clean</span>
                        </div>
                      )}
                      <button className="btn-icon" aria-label="View details">
                        <Eye className="icon-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card">
              <h3 className="section-title">
                <Activity className="section-title-icon" />
                Remediation Actions
              </h3>
              <div className="remediation-list">
                {[
                  { action: 'School Enrollment Support', status: 'completed', beneficiaries: 45, date: '2024-11-30' },
                  { action: 'Family Income Support', status: 'in_progress', beneficiaries: 12, date: '2024-12-01' },
                  { action: 'Awareness Training', status: 'pending', beneficiaries: 180, date: '2024-12-15' },
                ].map((remediation, idx) => (
                  <div key={idx} className="remediation-item">
                    <div className="remediation-info">
                      <h4 className="remediation-title">{remediation.action}</h4>
                      <div className="remediation-meta">
                        <Users className="icon-xs" />
                        <span>{remediation.beneficiaries} beneficiaries</span>
                        <Calendar className="icon-xs" />
                        <span>{new Date(remediation.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className={`status-badge status-${remediation.status}`}>
                      {remediation.status === 'completed' ? <CheckCircle2 className="icon-xs" />
                        : remediation.status === 'in_progress' ? <Activity className="icon-xs" />
                        : <Clock className="icon-xs" />}
                      <span>{remediation.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'compliance' && (
          <div className="compliance-content">
            <div className="section-card">
              <h3 className="section-title">
                <FileText className="section-title-icon" />
                Compliance Status
              </h3>
              <div className="compliance-list">
                {[
                  { label: 'EUDR Certification', status: 'Valid', ok: true },
                  { label: 'Fair Trade', status: 'Valid', ok: true },
                  { label: 'Rainforest Alliance', status: 'Valid', ok: true },
                  { label: 'Child Labor Verification', status: 'Update Required', ok: false },
                ].map((item, idx) => (
                  <div key={idx} className="compliance-item">
                    <div className="compliance-item-header">
                      <span className="compliance-item-label">{item.label}</span>
                      {item.ok
                        ? <CheckCircle2 className="icon-sm text-success" />
                        : <AlertTriangle className="icon-sm text-warning" />}
                    </div>
                    <span className={`compliance-item-status ${item.ok ? '' : 'status-text-warning'}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'sales' && (
          <div className="sales-content">
            <div className="sales-summary-cards">
              <div className="metric-card metric-primary">
                <div className="metric-header">
                  <DollarSign className="metric-icon" />
                  <span className="metric-label">This Month</span>
                </div>
                <div className="metric-value">€127,500</div>
                <div className="metric-trend trend-up">+18% vs last month</div>
              </div>
              <div className="metric-card metric-info">
                <div className="metric-header">
                  <ShoppingCart className="metric-icon" />
                  <span className="metric-label">Pending Orders</span>
                </div>
                <div className="metric-value">12</div>
                <div className="metric-trend">3 require action</div>
              </div>
            </div>

            <div className="section-card">
              <div className="section-header">
                <h3 className="section-title">
                  <Package className="section-title-icon" />
                  Active Orders
                </h3>
                <button className="btn-primary">
                  <Plus className="icon-sm" />
                  <span>New</span>
                </button>
              </div>
              <div className="order-list">
                {[
                  { buyer: 'International Buyer EU', commodity: 'Cocoa', qty: '5 tons', value: '€12,500', status: 'pending', delivery: '2024-12-15' },
                  { buyer: 'Swiss Trading Co.', commodity: 'Coffee', qty: '2 tons', value: '€6,400', status: 'confirmed', delivery: '2024-12-20' },
                  { buyer: 'Nordic Foods AS', commodity: 'Cocoa', qty: '8 tons', value: '€20,000', status: 'shipped', delivery: '2024-12-10' },
                ].map((order, idx) => (
                  <div key={idx} className="order-card">
                    <div className="order-header">
                      <h4 className="order-buyer">{order.buyer}</h4>
                      <div className={`status-badge status-${order.status}`}>
                        {order.status === 'shipped' ? <TrendingUp className="icon-xs" />
                          : order.status === 'confirmed' ? <CheckCircle2 className="icon-xs" />
                          : <Clock className="icon-xs" />}
                        <span>{order.status}</span>
                      </div>
                    </div>
                    <div className="order-details">
                      <div className="order-detail">
                        <Package className="icon-xs" />
                        <span>{order.qty} {order.commodity}</span>
                      </div>
                      <div className="order-detail">
                        <DollarSign className="icon-xs" />
                        <span>{order.value}</span>
                      </div>
                      <div className="order-detail">
                        <Calendar className="icon-xs" />
                        <span>Delivery: {new Date(order.delivery).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button className="coop-action">
                      <span>View Order</span>
                      <ChevronRight className="icon-xs" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card">
              <h3 className="section-title">
                <MapPin className="section-title-icon" />
                Find Buyers
              </h3>
              <p className="section-desc">Connect with verified buyers looking for certified cooperatives.</p>
              <a
                href={`${import.meta.env.VITE_WEB_APP_URL || '#'}/buyer`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-full-primary"
              >
                Open Buyer Portal
                <ChevronRight className="icon-sm" />
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
