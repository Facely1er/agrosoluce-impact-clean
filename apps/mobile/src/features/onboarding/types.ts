export type OnboardingStatus = 'pending' | 'in_progress' | 'completed' | 'on_hold';

export interface CooperativeOnboarding {
  id: string;
  cooperativeId: string;
  status: OnboardingStatus;
  currentStep: number;
  startedAt?: string;
  completedAt?: string;
  welcomeCallScheduledAt?: string;
  welcomeCallCompletedAt?: string;
  onboardingChampionId?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OnboardingStep {
  id: string;
  onboardingId: string;
  stepNumber: number;
  stepName: string;
  stepDescription?: string;
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: string;
  notes?: string;
  createdAt?: string;
}

export interface OnboardingStepDefinition {
  stepNumber: number;
  stepName: string;
  stepDescription: string;
  required: boolean;
}

export const DEFAULT_ONBOARDING_STEPS: OnboardingStepDefinition[] = [
  {
    stepNumber: 1,
    stepName: 'Bienvenue',
    stepDescription: 'Découvrez AgroSoluce® et l\'approche Farmers First',
    required: true,
  },
  {
    stepNumber: 2,
    stepName: 'Compte',
    stepDescription: 'Configurez votre profil coopérative',
    required: true,
  },
  {
    stepNumber: 3,
    stepName: 'Données',
    stepDescription: 'Importez vos données existantes (optionnel)',
    required: false,
  },
  {
    stepNumber: 4,
    stepName: 'Sécurité',
    stepDescription: 'Configurez la sécurité et les accès',
    required: true,
  },
  {
    stepNumber: 5,
    stepName: 'Champions',
    stepDescription: 'Désignez vos champions de formation',
    required: true,
  },
  {
    stepNumber: 6,
    stepName: 'Baseline',
    stepDescription: 'Évaluation de référence avant démarrage',
    required: true,
  },
  {
    stepNumber: 7,
    stepName: 'Appel',
    stepDescription: 'Planifiez votre appel de bienvenue',
    required: true,
  },
];
