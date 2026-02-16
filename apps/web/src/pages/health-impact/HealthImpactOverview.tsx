import { Link } from 'react-router-dom';
import { 
  Activity,
  TrendingUp,
  ArrowRight,
  MapPin,
  BookOpen,
  AlertCircle,
  LineChart,
  Users,
  Target,
  Zap,
  Heart,
  Sprout,
  Shield
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nProvider';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { Button, Card, CardContent, Badge } from '@/components/ui';
import { FrameworkComplianceBadge } from '@/components/framework';

export default function HealthImpactOverview() {
  const { t } = useI18n();
  const h = t.healthImpactOverview;

  const keyFeatures = [
    { icon: MapPin, ...h.keyFeatures.regionalMap, link: '/map' },
    { icon: Activity, ...h.keyFeatures.regionalHealth, link: '/vrac' },
    { icon: Users, ...h.keyFeatures.cooperativeWorkspaces, link: '/directory' },
    { icon: LineChart, ...h.keyFeatures.timeLag, link: '/vrac' },
    { icon: BookOpen, ...h.keyFeatures.academicResearch, link: '/regulatory-references' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-health-50 via-wellness-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: t.nav.home, path: '/' },
          { label: h.breadcrumb }
        ]} />

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex flex-col items-center gap-4 mb-6">
            <Badge variant="primary" size="lg" className="bg-health-100 text-health-700 border-health-300">
              <Activity className="h-4 w-4 mr-2" />
              {h.badge}
            </Badge>
            <FrameworkComplianceBadge
              version="1.0"
              status="partial"
              size="md"
            />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
            {h.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
            {h.heroSubtitle}
          </p>
        </div>

        {/* The Concept Section */}
        <section className="mb-16">
          <Card className="p-8 md:p-12">
            <CardContent className="p-0">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                {h.conceptTitle}
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {h.conceptP1}
                  </p>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {h.conceptP2}
                  </p>
                  <div className="bg-health-50 dark:bg-health-900/30 p-6 rounded-lg border-l-4 border-health-600">
                    <div className="flex items-start gap-3">
                      <Heart className="h-6 w-6 text-health-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{h.keyInsight}</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          {h.keyInsightText}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-health-50 to-vitality-50 dark:from-health-900/30 dark:to-vitality-900/30 p-8 rounded-xl">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                    <Sprout className="h-6 w-6 text-wellness-600" />
                    {h.dataSourceTitle}
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-vitality-600 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">{h.vracBullet1}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-vitality-600 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">{h.vracBullet2}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-vitality-600 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">{h.vracBullet3}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-vitality-600 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">{h.vracBullet4}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Case Study Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 rounded-xl p-8 md:p-12 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="h-8 w-8 text-orange-600" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {h.caseStudyTitle}
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-red-600 mb-2">10x</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{h.antimalarialSurge}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Aug-Dec 2024</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-orange-600 mb-2">24%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{h.productionDecline}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">{h.cocoaHarvest}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-yellow-600 mb-2">3-4</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{h.weekLag}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">{h.healthToProduction}</div>
                </CardContent>
              </Card>
            </div>

            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {h.caseStudyBody}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button asChild variant="primary" size="lg">
                <Link to="/map" className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {h.viewRegionalMap}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link to="/vrac" className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {h.healthIntelligenceDashboard}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
            {h.platformFeatures}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {keyFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-health-100 dark:bg-health-900/30 p-3 rounded-lg">
                        <Icon className="h-6 w-6 text-health-600 dark:text-health-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {feature.description}
                        </p>
                        <Link 
                          to={feature.link}
                          className="text-health-600 dark:text-health-400 hover:text-health-700 dark:hover:text-health-300 font-medium inline-flex items-center gap-2"
                        >
                          {feature.linkText}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Business Value Section */}
        <section className="mb-16">
          <Card className="bg-gradient-to-br from-wellness-50 to-health-50 dark:from-wellness-900/20 dark:to-health-900/20 border-wellness-200 dark:border-wellness-800">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                <Shield className="h-8 w-8 text-wellness-600" />
                {h.businessValue}
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <Target className="h-10 w-10 text-wellness-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {h.forCommodityTraders}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {h.forCommodityTradersDesc}
                  </p>
                </div>
                <div>
                  <LineChart className="h-10 w-10 text-wellness-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {h.forProcessors}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {h.forProcessorsDesc}
                  </p>
                </div>
                <div>
                  <Users className="h-10 w-10 text-wellness-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    For Supply Chain Managers
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Data-driven decisions on cooperative partnerships and risk mitigation strategies.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Partnership Opportunities Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
            Partnership Opportunities
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {h.partnerships.map((partner) => (
              <Card key={partner.name} className="text-center hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    {partner.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {partner.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Access health-impact data
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Regional health analytics and cooperative workspaces; VRAC pharmacy data and time-lag analysis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
                <Button asChild variant="primary" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                  <Link to="/map" className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Explore Map
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link to="/vrac" className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Regional Health Data
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link to="/directory" className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Browse Cooperatives
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
