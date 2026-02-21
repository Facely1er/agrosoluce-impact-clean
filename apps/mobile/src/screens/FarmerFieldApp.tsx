import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';

const LANGUAGES = ['Baoule', 'Agni', 'Dioula', 'Français'] as const;

export const FarmerFieldApp = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'home' | 'training' | 'declarations' | 'help'>('home');
  const [language, setLanguage] = useState<string>('baoule');

  return (
    <div className="dashboard-container">
      <header className="header-farmer">
        <button type="button" className="header-back-btn" onClick={() => navigate('/')} aria-label="Switch role">
          <LogOut className="header-back-icon" />
        </button>
        <div className="header-content">
          <h1 className="header-title">AgroSoluce</h1>
          <p className="header-subtitle">Field Operations • Offline Mode</p>
        </div>
        <button type="button" className="header-action-btn" aria-label="Change language">
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
        {selectedTab === 'home' && (
          <div className="farmer-home-content">
            <div className="welcome-card">
              <h2 className="welcome-title">Welcome Back</h2>
              <p className="welcome-subtitle">Track your progress and access resources</p>
            </div>

            <div className="section-card">
              <h3 className="section-title">
                <Activity className="section-title-icon" />
                Your Status
              </h3>
              <div className="farmer-stats">
                <div className="farmer-stat">
                  <div className="farmer-stat-icon">
                    <Sprout className="icon-md" />
                  </div>
                  <div className="farmer-stat-content">
                    <div className="farmer-stat-label">Farm Size</div>
                    <div className="farmer-stat-value">2.3 ha</div>
                  </div>
                </div>
                <div className="farmer-stat">
                  <div className="farmer-stat-icon">
                    <CheckCircle2 className="icon-md" />
                  </div>
                  <div className="farmer-stat-content">
                    <div className="farmer-stat-label">This Season</div>
                    <div className="farmer-stat-value">850 kg</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-card">
              <h3 className="section-title">
                <BookOpen className="section-title-icon" />
                Available Training
              </h3>
              <div className="training-list">
                {[
                  { title: 'Sustainable Farming', status: 'available', duration: '2 hours' },
                  { title: 'Child Labor Prevention', status: 'available', duration: '1.5 hours' },
                  { title: 'Financial Management', status: 'completed', duration: '3 hours' },
                ].map((training, idx) => (
                  <div key={idx} className="training-item">
                    <div className="training-info">
                      <h4 className="training-title">{training.title}</h4>
                      <div className="training-meta">
                        <Clock className="icon-xs" />
                        <span>{training.duration}</span>
                      </div>
                    </div>
                    {training.status === 'completed' ? (
                      <div className="status-badge status-compliant">
                        <CheckCircle2 className="icon-xs" />
                        <span>Done</span>
                      </div>
                    ) : (
                      <button className="btn-primary btn-sm">Start</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card">
              <h3 className="section-title">
                <FileText className="section-title-icon" />
                Pending Declarations
              </h3>
              <div className="declaration-list">
                {[
                  { type: 'Child Labor Declaration', due: '2024-12-15', status: 'pending' },
                  { type: 'Harvest Report', due: '2024-12-20', status: 'pending' },
                ].map((declaration, idx) => (
                  <div key={idx} className="declaration-item">
                    <div className="declaration-info">
                      <h4 className="declaration-title">{declaration.type}</h4>
                      <div className="declaration-meta">
                        <Calendar className="icon-xs" />
                        <span>Due: {new Date(declaration.due).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button className="btn-primary btn-sm">Submit</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'training' && (
          <div className="training-content">
            <div className="section-card">
              <h3 className="section-title">
                <BookOpen className="section-title-icon" />
                Training Programs
              </h3>
              <div className="training-list">
                {[
                  { title: 'Sustainable Farming Practices', description: 'Best practices for sustainable agriculture', duration: '2 hours', status: 'available' },
                  { title: 'Child Labor Prevention', description: 'Understanding child labor laws and prevention', duration: '1.5 hours', status: 'available' },
                  { title: 'Financial Literacy', description: 'Managing farm finances and income', duration: '3 hours', status: 'completed' },
                  { title: 'Market Access', description: 'Connecting with buyers and markets', duration: '1 hour', status: 'available' },
                ].map((training, idx) => (
                  <div key={idx} className="training-card">
                    <div className="training-card-header">
                      <BookOpen className="training-card-icon" />
                      <div className={`status-badge status-${training.status}`}>
                        {training.status === 'completed'
                          ? <CheckCircle2 className="icon-xs" />
                          : <Clock className="icon-xs" />}
                        <span>{training.status}</span>
                      </div>
                    </div>
                    <h4 className="training-card-title">{training.title}</h4>
                    <p className="training-card-description">{training.description}</p>
                    <div className="training-card-footer">
                      <div className="training-card-meta">
                        <Clock className="icon-xs" />
                        <span>{training.duration}</span>
                      </div>
                      {training.status === 'available' && (
                        <button className="btn-primary btn-sm">Start Training</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'declarations' && (
          <div className="declarations-content">
            <div className="section-card">
              <h3 className="section-title">
                <FileText className="section-title-icon" />
                My Declarations
              </h3>
              <div className="declaration-list">
                {[
                  { type: 'Child Labor Declaration', date: '2024-12-01', status: 'submitted' },
                  { type: 'Harvest Report', date: '2024-11-15', status: 'submitted' },
                  { type: 'Child Labor Declaration', date: '2024-12-15', status: 'pending' },
                  { type: 'Harvest Report', date: '2024-12-20', status: 'pending' },
                ].map((declaration, idx) => (
                  <div key={idx} className="declaration-item">
                    <div className="declaration-info">
                      <h4 className="declaration-title">{declaration.type}</h4>
                      <div className="declaration-meta">
                        <Calendar className="icon-xs" />
                        <span>{new Date(declaration.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {declaration.status === 'submitted' ? (
                      <div className="status-badge status-compliant">
                        <CheckCircle2 className="icon-xs" />
                        <span>Submitted</span>
                      </div>
                    ) : (
                      <button className="btn-primary btn-sm">Submit</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card">
              <h3 className="section-title">
                <BarChart3 className="section-title-icon" />
                Declaration Progress
              </h3>
              <div className="overview-stats">
                <div className="overview-stat">
                  <span className="overview-stat-label">Submitted</span>
                  <span className="overview-stat-value">2</span>
                </div>
                <div className="overview-stat">
                  <span className="overview-stat-label">Pending</span>
                  <span className="overview-stat-value">2</span>
                </div>
                <div className="overview-stat">
                  <span className="overview-stat-label">Completion</span>
                  <span className="overview-stat-value">50%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'help' && (
          <div className="help-content">
            <div className="section-card">
              <h3 className="section-title">
                <Phone className="section-title-icon" />
                Need Help?
              </h3>
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
              <h3 className="section-title">
                <Globe className="section-title-icon" />
                Language / Langue
              </h3>
              <div className="language-list">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    className={`language-button ${language === lang.toLowerCase() ? 'language-button-active' : ''}`}
                    onClick={() => setLanguage(lang.toLowerCase())}
                  >
                    <span>{lang}</span>
                    {language === lang.toLowerCase() && (
                      <CheckCircle2 className="icon-sm" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="section-card">
              <h3 className="section-title">
                <Users className="section-title-icon" />
                About Your Cooperative
              </h3>
              <div className="overview-stats">
                <div className="overview-stat">
                  <span className="overview-stat-label">Cooperative</span>
                  <span className="overview-stat-value-sm">SCAC Abidjan</span>
                </div>
                <div className="overview-stat">
                  <span className="overview-stat-label">Region</span>
                  <span className="overview-stat-value-sm">Lagunes</span>
                </div>
                <div className="overview-stat">
                  <span className="overview-stat-label">Members</span>
                  <span className="overview-stat-value-sm">487</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
