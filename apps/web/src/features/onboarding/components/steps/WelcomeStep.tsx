import { Sprout, Shield, BarChart3, Users, Leaf, ArrowRight } from 'lucide-react';

interface WelcomeStepProps {
  onComplete: () => void;
}

export default function WelcomeStep({ onComplete }: WelcomeStepProps) {
  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-500 rounded-xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Sprout className="h-8 w-8" />
          <h3 className="text-2xl font-bold">Bienvenue dans AgroSoluce®</h3>
        </div>
        <p className="text-white/90 text-lg leading-relaxed">
          La plateforme de gestion coopérative qui met les agriculteurs en premier —
          conformité EUDR, traçabilité et connexion aux marchés, le tout gratuitement
          pendant votre première année.
        </p>
      </div>

      {/* What you'll get */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Ce que vous obtenez avec AgroSoluce®</h4>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              icon: Shield,
              color: 'text-green-600 bg-green-50',
              title: 'Conformité EUDR',
              description: 'Suivez et documentez votre conformité au règlement européen contre la déforestation.',
            },
            {
              icon: BarChart3,
              color: 'text-primary-600 bg-primary-50',
              title: 'Tableau de bord couverture',
              description: 'Visualisez en temps réel le taux de documentation de vos producteurs et parcelles.',
            },
            {
              icon: Users,
              color: 'text-blue-600 bg-blue-50',
              title: 'Gestion des producteurs',
              description: 'Gérez les profils de vos membres, leurs parcelles et leurs déclarations.',
            },
            {
              icon: Leaf,
              color: 'text-secondary-600 bg-secondary-50',
              title: 'Marketplace & acheteurs',
              description: 'Connectez-vous à des acheteurs certifiés recherchant des coopératives vérifiées.',
            },
          ].map(({ icon: Icon, color, title, description }) => (
            <div key={title} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{title}</p>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Farmers First philosophy */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h4 className="font-semibold text-amber-900 mb-2">Notre approche : Farmers First</h4>
        <p className="text-amber-800 text-sm leading-relaxed">
          Chez AgroSoluce®, nous croyons que la valeur doit être livrée aux coopératives
          <em> avant</em> de demander quoi que ce soit en retour. C'est pourquoi l'accès est
          entièrement gratuit pendant la première année — pas de carte bancaire, pas de surprise.
          Nous prouvons notre valeur d'abord.
        </p>
      </div>

      {/* Process overview */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Le processus d'intégration (7 étapes)</h4>
        <div className="space-y-2">
          {[
            { num: 1, label: 'Bienvenue & Introduction', active: true },
            { num: 2, label: 'Configuration du compte' },
            { num: 3, label: 'Migration des données (optionnel)' },
            { num: 4, label: 'Configuration de sécurité' },
            { num: 5, label: 'Champions de formation' },
            { num: 6, label: 'Évaluation de référence' },
            { num: 7, label: 'Appel de bienvenue' },
          ].map(({ num, label, active }) => (
            <div
              key={num}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                active ? 'bg-primary-50 border border-primary-200' : 'bg-gray-50'
              }`}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  active ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                {num}
              </span>
              <span className={`text-sm ${active ? 'font-semibold text-primary-800' : 'text-gray-600'}`}>
                {label}
              </span>
              {active && <span className="ml-auto text-xs text-primary-600 font-medium">Étape actuelle</span>}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onComplete}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-md"
      >
        Commencer la configuration
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
}
