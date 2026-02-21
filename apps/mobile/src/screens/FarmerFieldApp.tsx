import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Users,
  CheckCircle2,
  BarChart3,
  FileText,
  BookOpen,
  Sprout,
  Home,
  Phone,
  Video,
  Globe,
  ChevronRight,
  Clock,
  LogOut,
  MessageSquare,
  Activity,
  Calendar,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import {
  getFarmerProfile,
  getDeclarationsByFarmer,
  getTrainingSessionsByCooperative,
  type FarmerProfile,
  type DeclarationRow,
  type TrainingRow,
} from '../lib/api/mobileApi';

const LANGUAGES = ['Baoule', 'Agni', 'Dioula', 'Français'] as const;

export const FarmerFieldApp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const farmerId = searchParams.get('id') || '';

  const [selectedTab, setSelectedTab] = useState<'home' | 'training' | 'declarations' | 'help'>('home');
  const [language, setLanguage] = useState('baoule');
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
        <button type="button" className="header-back-btn" onClick={() => navigate('/')} aria-label="Switch role">
          <LogOut className="header-back-icon" />
        </button>
        <div className="header-content">
          <h1 className="header-title">{farmer ? farmer.name : 'AgroSoluce'}</h1>
          <p className="header-subtitle">
            {farmer?.cooperative_name ? `${farmer.cooperative_name} • Field App` : 'Field Operations'}
          </p>
        </div>
        <button type="button" className="header-action-btn" aria-label="Change language" title="Change language">
          <Globe className="icon-md" />
        </button>
      </header>

      <nav className="farmer-nav">
        {([
          { key: 'home', icon: Home, label: 'Home' },
          { key: 'training', icon: BookOpen, label: 'Training' },
          { key: 'declarations', icon: FileText, label: 'Declarations' },
          { key: 'help', icon: Phone, label: 'Help' },
        ] as const).map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            className={`farmer-tab ${selectedTab === key ? 'farmer-tab-active' : ''}`}
            onClick={() => setSelectedTab(key)}
          >
            <Icon className="farmer-tab-icon" />
            <span className="farmer-tab-label">{label}</span>
          </button>
        ))}
      </nav>

      <main className="dashboard-content">
        {loading ? (
          <div className="loading-container"><Loader2 className="loading-spinner" /></div>
        ) : !farmerId || !farmer ? (
          <div className="section-card">
            <div className="empty-state">
              <AlertCircle className="empty-state-icon" />
              <p className="empty-state-text">
                No farmer profile loaded. Please log in or open the app with your farmer ID.
              </p>
            </div>
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
                              <div className="training-meta">
                                <Clock className="icon-xs" />
                                <span>{new Date(t.scheduled_at).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                          {t.status === 'completed' ? (
                            <div className="status-badge status-compliant">
                              <CheckCircle2 className="icon-xs" /><span>Done</span>
                            </div>
                          ) : (
                            <button className="btn-primary btn-sm">Start</button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {pendingDeclarations.length === 0 && trainings.length === 0 && (
                  <div className="section-card">
                    <div className="empty-state">
                      <CheckCircle2 className="empty-state-icon" />
                      <p className="empty-state-text">Everything is up to date. No pending actions.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'training' && (
              <div className="training-content">
                <div className="section-card">
                  <h3 className="section-title"><BookOpen className="section-title-icon" />Training Programs</h3>
                  {trainings.length === 0 ? (
                    <div className="empty-state">
                      <AlertCircle className="empty-state-icon" />
                      <p className="empty-state-text">No training sessions available yet.</p>
                    </div>
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
                              <div className="training-card-meta">
                                <Calendar className="icon-xs" />
                                <span>{new Date(t.scheduled_at).toLocaleDateString()}</span>
                              </div>
                              {t.status !== 'completed' && (
                                <button className="btn-primary btn-sm">Start Training</button>
                              )}
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
                    <div className="empty-state">
                      <AlertCircle className="empty-state-icon" />
                      <p className="empty-state-text">No declarations on record yet.</p>
                    </div>
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
                        {declarations.length > 0
                          ? `${Math.round((submittedDeclarations.length / declarations.length) * 100)}%`
                          : '—'}
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
                  <h3 className="section-title"><Globe className="section-title-icon" />Language / Langue</h3>
                  <div className="language-list">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang}
                        className={`language-button ${language === lang.toLowerCase() ? 'language-button-active' : ''}`}
                        onClick={() => setLanguage(lang.toLowerCase())}
                      >
                        <span>{lang}</span>
                        {language === lang.toLowerCase() && <CheckCircle2 className="icon-sm" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="section-card">
                  <h3 className="section-title"><Users className="section-title-icon" />Your Profile</h3>
                  <div className="overview-stats">
                    <div className="overview-stat">
                      <span className="overview-stat-label">Cooperative</span>
                      <span className="overview-stat-value-sm">{farmer.cooperative_name || '—'}</span>
                    </div>
                    {farmer.registration_number && (
                      <div className="overview-stat">
                        <span className="overview-stat-label">Reg. Number</span>
                        <span className="overview-stat-value-sm">{farmer.registration_number}</span>
                      </div>
                    )}
                    {farmer.phone && (
                      <div className="overview-stat">
                        <span className="overview-stat-label">Phone</span>
                        <span className="overview-stat-value-sm">{farmer.phone}</span>
                      </div>
                    )}
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
