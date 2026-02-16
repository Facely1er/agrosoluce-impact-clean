import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, CheckCircle, FileText, BarChart3, Shield, Users, Sprout, Zap, Info, ChevronDown, ChevronUp, Mail } from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nProvider';

export default function CooperativeSpaceLanding() {
  const { t } = useI18n();
  const [contactExpanded, setContactExpanded] = useState(false);

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-secondary-50 via-primary-50 to-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03] coop-landing-dot-pattern" aria-hidden />
      <div className="relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16 pt-4">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl mb-8 shadow-lg border border-primary-200/50">
            <Building2 className="h-14 w-14 text-primary-600" />
          </div>
          <p className="text-sm font-medium uppercase tracking-wider text-primary-600 mb-4">
            Espace Coopérative
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t.cooperativeSpace.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto font-medium">
            {t.cooperativeSpace.hero.subtitle}
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {t.cooperativeSpace.hero.description}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/cooperatives"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl"
            >
              {t.cooperativeSpace.cta.findCooperative}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/directory"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50 transition-all"
            >
              Explorer le répertoire
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary-500 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.cooperativeSpace.features.evidence.title}</h3>
                <p className="text-sm text-gray-600">
                  {t.cooperativeSpace.features.evidence.description}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-secondary-500 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-secondary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.cooperativeSpace.features.coverage.title}</h3>
                <p className="text-sm text-gray-600">
                  {t.cooperativeSpace.features.coverage.description}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.cooperativeSpace.features.compliance.title}</h3>
                <p className="text-sm text-gray-600">
                  {t.cooperativeSpace.features.compliance.description}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Sprout className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.cooperativeSpace.features.farmersFirst.title}</h3>
                <p className="text-sm text-gray-600">
                  {t.cooperativeSpace.features.farmersFirst.description}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.cooperativeSpace.features.enablement.title}</h3>
                <p className="text-sm text-gray-600">
                  {t.cooperativeSpace.features.enablement.description}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.cooperativeSpace.features.producers.title}</h3>
                <p className="text-sm text-gray-600">
                  {t.cooperativeSpace.features.producers.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl shadow-md p-8 md:p-12 mb-16 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t.cooperativeSpace.benefits.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{t.cooperativeSpace.benefits.documentation.title}</h4>
                <p className="text-sm text-gray-600">
                  {t.cooperativeSpace.benefits.documentation.description}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{t.cooperativeSpace.benefits.gapAnalysis.title}</h4>
                <p className="text-sm text-gray-600">
                  {t.cooperativeSpace.benefits.gapAnalysis.description}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{t.cooperativeSpace.benefits.enablement.title}</h4>
                <p className="text-sm text-gray-600">
                  {t.cooperativeSpace.benefits.enablement.description}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{t.cooperativeSpace.benefits.transparency.title}</h4>
                <p className="text-sm text-gray-600">
                  {t.cooperativeSpace.benefits.transparency.description}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{t.cooperativeSpace.benefits.traceability.title}</h4>
                <p className="text-sm text-gray-600">
                  {t.cooperativeSpace.benefits.traceability.description}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{t.cooperativeSpace.benefits.compliance.title}</h4>
                <p className="text-sm text-gray-600">
                  {t.cooperativeSpace.benefits.compliance.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-500 rounded-2xl shadow-xl p-8 md:p-12 text-white text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.cooperativeSpace.cta.title}
          </h2>
          <p className="text-xl mb-6 text-white/95 max-w-2xl mx-auto">
            {t.cooperativeSpace.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/cooperatives"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              {t.cooperativeSpace.cta.findCooperative}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20"
            >
              {t.cooperativeSpace.cta.learnMore}
            </Link>
          </div>
          <p className="text-sm text-white/80 mt-6">
            {t.cooperativeSpace.cta.freeNote}
          </p>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <Info className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                {t.cooperativeSpace.info.title}
              </h3>
              <p className="text-blue-800 leading-relaxed mb-3">
                {t.cooperativeSpace.info.description1}
              </p>
              <p className="text-blue-800 leading-relaxed">
                {t.cooperativeSpace.info.description2}
              </p>
            </div>
          </div>
        </div>

        {/* Gated Contact — collapsed by default */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-8">
          <button
            type="button"
            onClick={() => setContactExpanded((prev) => !prev)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary-600" />
              Contact & support
            </span>
            {contactExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
          {contactExpanded && (
            <div className="px-6 pb-6 pt-0 border-t border-gray-100 space-y-4">
              <p className="text-sm text-gray-600">
                For questions about the cooperative space, workspace access, or registration, reach out to the AgroSoluce™ team.
              </p>
              <a
                href="mailto:contact@agrosoluce.ci"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                <Mail className="h-4 w-4" />
                contact@agrosoluce.ci
              </a>
            </div>
          )}
        </div>

        {/* Additional Links */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {t.cooperativeSpace.links.lookingFor}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link 
              to="/cooperatives" 
              className="text-primary-600 hover:text-primary-700 font-medium hover:underline"
            >
              {t.cooperativeSpace.links.browseDirectory}
            </Link>
            <span className="text-gray-400">•</span>
            <Link 
              to="/buyers" 
              className="text-primary-600 hover:text-primary-700 font-medium hover:underline"
            >
              {t.cooperativeSpace.links.buyerPortal}
            </Link>
            <span className="text-gray-400">•</span>
            <Link 
              to="/about" 
              className="text-primary-600 hover:text-primary-700 font-medium hover:underline"
            >
              {t.cooperativeSpace.links.about}
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

