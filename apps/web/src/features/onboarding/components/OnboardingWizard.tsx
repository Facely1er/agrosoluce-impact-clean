import { useState, useEffect } from 'react';
import { CheckCircle, Circle, X, Trophy } from 'lucide-react';
import { DEFAULT_ONBOARDING_STEPS } from '../types';
import {
  getOnboardingByCooperativeId,
  createOrUpdateOnboarding,
  updateOnboardingStep,
  getOnboardingSteps,
} from '../api';
import type { CooperativeOnboarding, OnboardingStep } from '../types';

// Step components
import WelcomeStep from './steps/WelcomeStep';
import AccountSetupStep from './steps/AccountSetupStep';
import DataMigrationStep from './steps/DataMigrationStep';
import SecurityStep from './steps/SecurityStep';
import ChampionsStep from './steps/ChampionsStep';
import BaselineStep from './steps/BaselineStep';
import WelcomeCallStep from './steps/WelcomeCallStep';

interface OnboardingWizardProps {
  cooperativeId: string;
  onComplete?: () => void;
  onClose?: () => void;
}

export default function OnboardingWizard({ cooperativeId, onComplete, onClose }: OnboardingWizardProps) {
  const [onboarding, setOnboarding] = useState<CooperativeOnboarding | null>(null);
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    loadOnboarding();
  }, [cooperativeId]);

  const loadOnboarding = async () => {
    setLoading(true);
    const { data, error } = await getOnboardingByCooperativeId(cooperativeId);

    if (error && !data) {
      const { data: newOnboarding } = await createOrUpdateOnboarding({
        cooperativeId,
        status: 'in_progress',
        currentStep: 1,
      });
      if (newOnboarding) {
        setOnboarding(newOnboarding);
        setCurrentStepIndex(0);
      }
    } else if (data) {
      setOnboarding(data);
      setCurrentStepIndex(Math.max(0, data.currentStep - 1));
      const { data: stepsData } = await getOnboardingSteps(data.id);
      if (stepsData) setSteps(stepsData);
    }
    setLoading(false);
  };

  const handleStepComplete = async (stepNumber: number) => {
    if (!onboarding) return;

    setSaving(true);
    await updateOnboardingStep(onboarding.id, stepNumber, true);

    const updatedSteps = [...steps];
    const stepIndex = updatedSteps.findIndex((s) => s.stepNumber === stepNumber);
    if (stepIndex >= 0) {
      updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], isCompleted: true };
    } else {
      updatedSteps.push({
        id: '',
        onboardingId: onboarding.id,
        stepNumber,
        stepName: DEFAULT_ONBOARDING_STEPS[stepNumber - 1]?.stepName || '',
        isCompleted: true,
        completedAt: new Date().toISOString(),
      });
    }
    setSteps(updatedSteps);

    const nextStep = stepNumber + 1;
    if (nextStep <= DEFAULT_ONBOARDING_STEPS.length) {
      await createOrUpdateOnboarding({
        id: onboarding.id,
        cooperativeId,
        currentStep: nextStep,
        status: 'in_progress',
      });
      setCurrentStepIndex(nextStep - 1);
    } else {
      await createOrUpdateOnboarding({
        id: onboarding.id,
        cooperativeId,
        status: 'completed',
      });
      setAllDone(true);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Chargement de votre intégration...</p>
        </div>
      </div>
    );
  }

  // Completion screen
  if (allDone) {
    return (
      <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto text-center p-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <Trophy className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Intégration terminée !</h2>
        <p className="text-gray-600 text-lg mb-6">
          Félicitations ! Votre coopérative est maintenant configurée sur AgroSoluce®.
          Vous pouvez commencer à gérer vos producteurs, suivre votre conformité et
          explorer la marketplace.
        </p>
        <div className="bg-primary-50 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-primary-900 mb-3">Prochaines étapes recommandées</h3>
          <ul className="space-y-2 text-sm text-primary-800">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary-600" />
              Ajoutez vos premiers producteurs dans votre espace coopérative
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary-600" />
              Complétez les déclarations de parcelles pour améliorer votre couverture
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary-600" />
              Consultez votre tableau de bord de conformité EUDR
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary-600" />
              Attendez votre appel de bienvenue avec l'équipe AgroSoluce®
            </li>
          </ul>
        </div>
        {onComplete && (
          <button
            onClick={onComplete}
            className="px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-md"
          >
            Accéder à mon espace coopérative
          </button>
        )}
      </div>
    );
  }

  const currentStep = DEFAULT_ONBOARDING_STEPS[currentStepIndex];
  const isStepCompleted = steps.find((s) => s.stepNumber === currentStepIndex + 1)?.isCompleted || false;
  const completedCount = steps.filter((s) => s.isCompleted).length;

  const renderStepContent = () => {
    if (!onboarding) return null;

    const stepNum = currentStepIndex + 1;
    const stepOnComplete = () => handleStepComplete(stepNum);

    switch (stepNum) {
      case 1:
        return <WelcomeStep onComplete={stepOnComplete} />;
      case 2:
        return <AccountSetupStep cooperativeId={cooperativeId} onComplete={stepOnComplete} />;
      case 3:
        return <DataMigrationStep cooperativeId={cooperativeId} onComplete={stepOnComplete} />;
      case 4:
        return <SecurityStep onComplete={stepOnComplete} />;
      case 5:
        return <ChampionsStep cooperativeId={cooperativeId} onComplete={stepOnComplete} />;
      case 6:
        return <BaselineStep cooperativeId={cooperativeId} onComplete={stepOnComplete} />;
      case 7:
        return (
          <WelcomeCallStep
            cooperativeId={cooperativeId}
            onboardingId={onboarding.id}
            onComplete={stepOnComplete}
          />
        );
      default:
        return <p className="text-gray-500">Étape non reconnue.</p>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Intégration — Farmers First</h2>
          <p className="text-gray-500 mt-1 text-sm">
            {completedCount} sur {DEFAULT_ONBOARDING_STEPS.length} étapes complétées
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Progress Steps — horizontal stepper */}
      <div className="p-4 sm:p-6 border-b bg-gray-50 overflow-x-auto">
        <div className="flex items-start min-w-max sm:min-w-0">
          {DEFAULT_ONBOARDING_STEPS.map((step, index) => {
            const stepData = steps.find((s) => s.stepNumber === step.stepNumber);
            const isCompleted = stepData?.isCompleted || false;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.stepNumber} className="flex items-center flex-1 min-w-[80px]">
                <div className="flex flex-col items-center flex-1">
                  <button
                    onClick={() => setCurrentStepIndex(index)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : isCurrent
                        ? 'bg-primary-600 border-primary-600 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                    title={step.stepName}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-xs font-bold">{step.stepNumber}</span>
                    )}
                  </button>
                  <span
                    className={`text-[10px] mt-1.5 text-center max-w-[70px] leading-tight ${
                      isCurrent ? 'font-semibold text-primary-600' : 'text-gray-500'
                    }`}
                  >
                    {step.stepName}
                  </span>
                </div>
                {index < DEFAULT_ONBOARDING_STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-1 mt-[-20px] transition-colors ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="p-6 sm:p-8">
        {/* Step title */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
              Étape {currentStepIndex + 1}/{DEFAULT_ONBOARDING_STEPS.length}
            </span>
            {isStepCompleted && (
              <span className="flex items-center gap-1.5 text-green-600 text-xs font-semibold">
                <CheckCircle className="h-4 w-4" />
                Complétée
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900">{currentStep.stepName}</h3>
          <p className="text-gray-500 text-sm mt-0.5">{currentStep.stepDescription}</p>
        </div>

        {/* Render step component */}
        {saving ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Enregistrement...</p>
            </div>
          </div>
        ) : (
          renderStepContent()
        )}
      </div>

      {/* Navigation footer */}
      {!saving && (
        <div className="border-t px-6 sm:px-8 py-4 flex items-center justify-between bg-gray-50 rounded-b-lg">
          <button
            onClick={() => setCurrentStepIndex((i) => Math.max(0, i - 1))}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed text-sm transition-colors"
          >
            ← Précédent
          </button>
          <div className="flex items-center gap-2">
            {DEFAULT_ONBOARDING_STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStepIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStepIndex ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          {currentStepIndex < DEFAULT_ONBOARDING_STEPS.length - 1 && (
            <button
              onClick={() => setCurrentStepIndex((i) => Math.min(DEFAULT_ONBOARDING_STEPS.length - 1, i + 1))}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm transition-colors"
            >
              Suivant →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
