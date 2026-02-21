import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Trophy,
  Sprout,
  Shield,
  BarChart3,
  Users,
  Leaf,
  Building2,
  Phone,
  Mail,
  Lock,
  UserCheck,
  Calendar,
  AlertCircle,
  LogOut,
} from 'lucide-react';

import {
  getOnboardingByCooperativeId,
  createOrUpdateOnboarding,
  updateOnboardingStep,
  getOnboardingSteps,
} from '../../features/onboarding/api/onboardingApi';
import { DEFAULT_ONBOARDING_STEPS, type CooperativeOnboarding, type OnboardingStep } from '../../features/onboarding/types';
import { supabase } from '../../lib/supabase/client';
import './MobileOnboardingWizard.css';

// ── Step 1: Welcome ─────────────────────────────────────────────────────────
const WelcomeStep = ({ onComplete }: { onComplete: () => void }) => (
  <div className="mob-step">
    <div className="mob-step-hero">
      <Sprout className="mob-step-hero-icon" />
      <h2 className="mob-step-hero-title">Bienvenue dans AgroSoluce®</h2>
      <p className="mob-step-hero-desc">
        La plateforme coopérative qui met les agriculteurs en premier — conformité EUDR,
        traçabilité et connexion aux marchés, gratuitement la première année.
      </p>
    </div>

    <div className="mob-feature-list">
      {[
        { icon: Shield, label: 'Conformité EUDR', desc: 'Documentez et suivez votre conformité' },
        { icon: BarChart3, label: 'Tableau de bord', desc: 'Visualisez vos indicateurs en temps réel' },
        { icon: Users, label: 'Gestion des producteurs', desc: 'Gérez membres, parcelles et déclarations' },
        { icon: Leaf, label: 'Marketplace', desc: 'Connectez-vous à des acheteurs certifiés' },
      ].map(({ icon: Icon, label, desc }) => (
        <div key={label} className="mob-feature-item">
          <div className="mob-feature-icon-wrap">
            <Icon className="mob-feature-icon" />
          </div>
          <div>
            <p className="mob-feature-label">{label}</p>
            <p className="mob-feature-desc">{desc}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="mob-farmers-first-note">
      <p className="mob-ffn-title">Notre approche : Farmers First</p>
      <p className="mob-ffn-desc">
        Nous prouvons notre valeur avant de demander quoi que ce soit en retour.
        Accès entièrement gratuit pendant la première année.
      </p>
    </div>

    <button className="mob-btn-primary" onClick={onComplete}>
      Commencer la configuration
      <ChevronRight className="mob-btn-icon" />
    </button>
  </div>
);

// ── Step 2: Account Setup ────────────────────────────────────────────────────
const REGIONS_CI = [
  'Abidjan', 'Agnéby-Tiassa', 'Bafing', 'Bagoué', 'Béré', 'Bounkani',
  'Cavally', 'Folon', 'Gbêkê', 'Gbôklé', 'Gôh', 'Gontougo', 'Grands-Ponts',
  'Guémon', 'Hambol', 'Haut-Sassandra', 'Iffou', 'Indénié-Djuablin',
  'Kabadougou', 'La Mé', 'Lôh-Djiboua', 'Marahoué', 'Moronou',
  "N'Zi", 'Nawa', 'Poro', 'San-Pédro', 'Sud-Comoé', 'Tchologo',
  'Tonkpi', 'Worodougou',
];

const PRODUCTS = ['Cacao', 'Café', 'Anacarde', 'Hévéa', 'Palmier à huile', 'Coton', 'Banane', 'Ananas'];

const AccountSetupStep = ({ cooperativeId, onComplete }: { cooperativeId: string; onComplete: () => void }) => {
  const [form, setForm] = useState({ name: '', region: '', phone: '', email: '', products: [] as string[] });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toggle = (product: string) =>
    setForm((f) => ({ ...f, products: f.products.includes(product) ? f.products.filter((p) => p !== product) : [...f.products, product] }));

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Le nom est requis.'); return; }
    setSaving(true);
    setError('');
    try {
      if (supabase) {
        const { error: err } = await supabase.from('cooperatives').update({
          name: form.name, region: form.region || null,
          phone: form.phone || null, email: form.email || null,
          products: form.products.length ? form.products : null,
        }).eq('id', cooperativeId);
        if (err) throw err;
      }
      onComplete();
    } catch (e: unknown) {
      setError((e as Error)?.message || 'Erreur lors de la sauvegarde.');
    } finally { setSaving(false); }
  };

  return (
    <div className="mob-step">
      <p className="mob-step-info">Complétez le profil de votre coopérative. Ces informations seront visibles par les acheteurs.</p>

      <div className="mob-form-group">
        <label className="mob-label">Nom de la coopérative *</label>
        <input className="mob-input" type="text" value={form.name} placeholder="Nom officiel"
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
      </div>

      <div className="mob-form-group">
        <label className="mob-label" htmlFor="coop-region">Région</label>
        <select id="coop-region" className="mob-input" title="Région de la coopérative" value={form.region} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))} aria-label="Région">
          <option value="">Sélectionner</option>
          {REGIONS_CI.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="mob-form-row">
        <div className="mob-form-group mob-form-col">
          <label className="mob-label"><Phone className="mob-label-icon" /> Téléphone</label>
          <input className="mob-input" type="tel" value={form.phone} placeholder="+225 07 XX XX XX"
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
        </div>
        <div className="mob-form-group mob-form-col">
          <label className="mob-label"><Mail className="mob-label-icon" /> E-mail</label>
          <input className="mob-input" type="email" value={form.email} placeholder="contact@coop.ci"
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        </div>
      </div>

      <div className="mob-form-group">
        <label className="mob-label"><Leaf className="mob-label-icon" /> Produits cultivés</label>
        <div className="mob-chip-list">
          {PRODUCTS.map((p) => (
            <button key={p} type="button" className={`mob-chip ${form.products.includes(p) ? 'mob-chip-active' : ''}`} onClick={() => toggle(p)}>{p}</button>
          ))}
        </div>
      </div>

      {error && <div className="mob-error"><AlertCircle className="mob-error-icon" />{error}</div>}

      <button className="mob-btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? 'Sauvegarde...' : 'Sauvegarder et continuer'}
      </button>
      <button className="mob-btn-skip" onClick={onComplete}>Passer cette étape →</button>
    </div>
  );
};

// ── Step 3: Data (simplified for mobile) ────────────────────────────────────
const DataStep = ({ onComplete }: { onComplete: () => void }) => (
  <div className="mob-step">
    <div className="mob-step-info-block">
      <p className="mob-step-info">
        La migration de données (CSV, Excel) est disponible sur l'application web depuis un ordinateur.
        Vous pouvez commencer à ajouter vos producteurs manuellement après l'intégration.
      </p>
    </div>
    <div className="mob-skip-card">
      <Building2 className="mob-skip-icon" />
      <p className="mob-skip-text">Cette étape est optionnelle. Vous pouvez importer vos données plus tard via le portail web.</p>
    </div>
    <button className="mob-btn-primary" onClick={onComplete}>Continuer</button>
  </div>
);

// ── Step 4: Security ─────────────────────────────────────────────────────────
const SecurityStep = ({ onComplete }: { onComplete: () => void }) => {
  const [checked, setChecked] = useState({ twoFactor: false, strongPass: false, reviewed: false });
  const allDone = Object.values(checked).every(Boolean);

  return (
    <div className="mob-step">
      <p className="mob-step-info">Confirmez que vous avez configuré les paramètres de sécurité de base pour votre espace coopérative.</p>
      <div className="mob-checklist">
        {[
          { key: 'strongPass', icon: Lock, label: 'Mot de passe sécurisé défini', desc: 'Au moins 12 caractères avec majuscules, chiffres et symboles' },
          { key: 'twoFactor', icon: Shield, label: 'Authentification à 2 facteurs', desc: 'Activée pour les comptes administrateurs' },
          { key: 'reviewed', icon: UserCheck, label: 'Droits d\'accès vérifiés', desc: 'Les membres de l\'équipe ont les bons niveaux d\'accès' },
        ].map(({ key, icon: Icon, label, desc }) => (
          <button
            key={key}
            className={`mob-checklist-item ${checked[key as keyof typeof checked] ? 'mob-checklist-done' : ''}`}
            onClick={() => setChecked((c) => ({ ...c, [key]: !c[key as keyof typeof checked] }))}
          >
            <div className="mob-checklist-check">
              {checked[key as keyof typeof checked] ? <CheckCircle2 className="mob-check-icon-done" /> : <div className="mob-check-empty" />}
            </div>
            <div className="mob-checklist-content">
              <div className="mob-checklist-row">
                <Icon className="mob-checklist-icon" />
                <span className="mob-checklist-label">{label}</span>
              </div>
              <p className="mob-checklist-desc">{desc}</p>
            </div>
          </button>
        ))}
      </div>
      <button className="mob-btn-primary" onClick={onComplete} disabled={!allDone}>
        {allDone ? 'Sécurité configurée ✓' : 'Cochez les 3 points pour continuer'}
      </button>
      <button className="mob-btn-skip" onClick={onComplete}>Passer →</button>
    </div>
  );
};

// ── Step 5: Champions ────────────────────────────────────────────────────────
const ChampionsStep = ({ onComplete }: { onComplete: () => void }) => {
  const [champions, setChampions] = useState([{ name: '', role: '', phone: '' }]);

  const addChampion = () => setChampions((c) => [...c, { name: '', role: '', phone: '' }]);
  const update = (idx: number, field: string, value: string) =>
    setChampions((c) => c.map((ch, i) => i === idx ? { ...ch, [field]: value } : ch));

  return (
    <div className="mob-step">
      <p className="mob-step-info">
        Les champions de formation sont les référents internes qui accompagneront les producteurs dans l'adoption d'AgroSoluce®.
      </p>
      {champions.map((ch, idx) => (
        <div key={idx} className="mob-champion-card">
          <p className="mob-champion-label">Champion {idx + 1}</p>
          <input className="mob-input" type="text" placeholder="Nom et prénom" value={ch.name}
            onChange={(e) => update(idx, 'name', e.target.value)} />
          <input className="mob-input" type="text" placeholder="Rôle (ex: responsable terrain)" value={ch.role}
            onChange={(e) => update(idx, 'role', e.target.value)} />
          <input className="mob-input" type="tel" placeholder="Téléphone / WhatsApp" value={ch.phone}
            onChange={(e) => update(idx, 'phone', e.target.value)} />
        </div>
      ))}
      <button className="mob-btn-outline" onClick={addChampion}>+ Ajouter un champion</button>
      <button className="mob-btn-primary" onClick={onComplete}>Enregistrer et continuer</button>
      <button className="mob-btn-skip" onClick={onComplete}>Passer →</button>
    </div>
  );
};

// ── Step 6: Baseline ─────────────────────────────────────────────────────────
const BaselineStep = ({ cooperativeId, onComplete }: { cooperativeId: string; onComplete: () => void }) => {
  const [form, setForm] = useState({ total_farmers: '', plots_with_geo: '', eudr_awareness: '', child_labor_policy: '' });
  const [saving, setSaving] = useState(false);

  const yesNo = [
    { value: 'yes', label: 'Oui' },
    { value: 'partial', label: 'Partiel' },
    { value: 'no', label: 'Non' },
    { value: 'unknown', label: 'NSP' },
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      if (supabase) {
        await supabase.from('cooperatives').update({
          metadata: { baseline_assessment: { ...form, recorded_at: new Date().toISOString() } },
          coverage_metrics: {
            farmers_total: form.total_farmers ? parseInt(form.total_farmers) : 0,
            plots_with_geo: form.plots_with_geo ? parseInt(form.plots_with_geo) : 0,
          },
        }).eq('id', cooperativeId);
      }
      onComplete();
    } finally { setSaving(false); }
  };

  return (
    <div className="mob-step">
      <p className="mob-step-info">Ces données établissent votre situation de départ. Pas de bonnes ni de mauvaises réponses.</p>

      <div className="mob-form-row">
        <div className="mob-form-group mob-form-col">
          <label className="mob-label">Nombre de producteurs</label>
          <input className="mob-input" type="number" min="0" value={form.total_farmers} placeholder="Ex: 250"
            onChange={(e) => setForm((f) => ({ ...f, total_farmers: e.target.value }))} />
        </div>
        <div className="mob-form-group mob-form-col">
          <label className="mob-label">Parcelles avec GPS</label>
          <input className="mob-input" type="number" min="0" value={form.plots_with_geo} placeholder="Ex: 120"
            onChange={(e) => setForm((f) => ({ ...f, plots_with_geo: e.target.value }))} />
        </div>
      </div>

      <div className="mob-form-group">
        <label className="mob-label">Connaissance du règlement EUDR ?</label>
        <div className="mob-radio-group">
          {yesNo.map(({ value, label }) => (
            <button key={value} type="button"
              className={`mob-radio-btn ${form.eudr_awareness === value ? 'mob-radio-active' : ''}`}
              onClick={() => setForm((f) => ({ ...f, eudr_awareness: value }))}>{label}</button>
          ))}
        </div>
      </div>

      <div className="mob-form-group">
        <label className="mob-label">Politique contre le travail des enfants ?</label>
        <div className="mob-radio-group">
          {yesNo.map(({ value, label }) => (
            <button key={value} type="button"
              className={`mob-radio-btn ${form.child_labor_policy === value ? 'mob-radio-active' : ''}`}
              onClick={() => setForm((f) => ({ ...f, child_labor_policy: value }))}>{label}</button>
          ))}
        </div>
      </div>

      <button className="mob-btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? 'Enregistrement...' : 'Enregistrer l\'évaluation'}
      </button>
      <button className="mob-btn-skip" onClick={onComplete}>Passer →</button>
    </div>
  );
};

// ── Step 7: Welcome Call ─────────────────────────────────────────────────────
const WelcomeCallStep = ({
  cooperativeId, onboardingId, onComplete
}: { cooperativeId: string; onboardingId: string; onComplete: () => void }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSchedule = async () => {
    if (!date || !time) return;
    setSaving(true);
    try {
      const scheduledAt = new Date(`${date}T${time}`).toISOString();
      if (supabase) {
        await supabase.from('cooperative_onboarding')
          .update({ welcome_call_scheduled_at: scheduledAt })
          .eq('id', onboardingId);
      }
      onComplete();
    } finally { setSaving(false); }
  };

  return (
    <div className="mob-step">
      <p className="mob-step-info">
        Planifiez votre appel de bienvenue avec l'équipe AgroSoluce®. L'appel dure environ 45 minutes.
      </p>
      <div className="mob-call-info">
        <Calendar className="mob-call-icon" />
        <div>
          <p className="mob-call-label">Créneaux disponibles</p>
          <p className="mob-call-desc">Lun–Ven, 8h–17h (GMT)</p>
        </div>
      </div>
      <div className="mob-form-row">
        <div className="mob-form-group mob-form-col">
          <label htmlFor="call-date" className="mob-label">Date</label>
          <input id="call-date" className="mob-input" type="date" value={date}
            min={new Date().toISOString().split('T')[0]}
            aria-label="Date de l'appel de bienvenue"
            onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="mob-form-group mob-form-col">
          <label htmlFor="call-time" className="mob-label">Heure</label>
          <input id="call-time" className="mob-input" type="time" value={time}
            aria-label="Heure de l'appel de bienvenue"
            onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>
      <button className="mob-btn-primary" onClick={handleSchedule} disabled={!date || !time || saving}>
        {saving ? 'Planification...' : 'Planifier l\'appel'}
      </button>
      <button className="mob-btn-skip" onClick={onComplete}>Passer pour l'instant →</button>
    </div>
  );
};

// ── Progress fill (CSS custom property, avoids inline style) ─────────────────
const ProgressFill = ({ pct }: { pct: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.style.setProperty('--mob-prog-pct', `${pct}%`); }, [pct]);
  return <div ref={ref} className="mob-progress-fill mob-progress-fill-dynamic" />;
};

// ── Main Wizard ───────────────────────────────────────────────────────────────
interface Props {
  cooperativeId?: string;
}

export const MobileOnboardingWizard = ({ cooperativeId = 'demo-coop-id' }: Props) => {
  const navigate = useNavigate();
  const [onboarding, setOnboarding] = useState<CooperativeOnboarding | null>(null);
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allDone, setAllDone] = useState(false);

  useEffect(() => { loadOnboarding(); }, [cooperativeId]);

  const loadOnboarding = async () => {
    setLoading(true);
    const { data, error } = await getOnboardingByCooperativeId(cooperativeId);
    if (error || !data) {
      const { data: created } = await createOrUpdateOnboarding({ cooperativeId, status: 'in_progress', currentStep: 1 });
      if (created) { setOnboarding(created); setCurrentIndex(0); }
    } else {
      setOnboarding(data);
      setCurrentIndex(Math.max(0, data.currentStep - 1));
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
    const idx = updatedSteps.findIndex((s) => s.stepNumber === stepNumber);
    if (idx >= 0) updatedSteps[idx] = { ...updatedSteps[idx], isCompleted: true };
    else updatedSteps.push({ id: '', onboardingId: onboarding.id, stepNumber, stepName: DEFAULT_ONBOARDING_STEPS[stepNumber - 1]?.stepName || '', isCompleted: true, completedAt: new Date().toISOString() });
    setSteps(updatedSteps);
    const next = stepNumber + 1;
    if (next <= DEFAULT_ONBOARDING_STEPS.length) {
      await createOrUpdateOnboarding({ id: onboarding.id, cooperativeId, currentStep: next, status: 'in_progress' });
      setCurrentIndex(next - 1);
    } else {
      await createOrUpdateOnboarding({ id: onboarding.id, cooperativeId, status: 'completed' });
      setAllDone(true);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="mob-wizard-loading">
        <div className="mob-spinner" />
        <p>Chargement...</p>
      </div>
    );
  }

  if (allDone) {
    return (
      <div className="mob-wizard-done">
        <div className="mob-done-icon-wrap">
          <Trophy className="mob-done-icon" />
        </div>
        <h2 className="mob-done-title">Intégration terminée !</h2>
        <p className="mob-done-desc">
          Félicitations ! Votre coopérative est maintenant configurée sur AgroSoluce®.
        </p>
        <div className="mob-done-next">
          <p className="mob-done-next-title">Prochaines étapes :</p>
          {[
            'Ajoutez vos premiers producteurs',
            'Complétez les déclarations de parcelles',
            'Consultez votre tableau de bord EUDR',
          ].map((item, i) => (
            <div key={i} className="mob-done-next-item">
              <CheckCircle2 className="mob-done-next-icon" />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <button className="mob-btn-primary" onClick={() => navigate('/cooperative')}>
          Accéder à mon espace
          <ChevronRight className="mob-btn-icon" />
        </button>
      </div>
    );
  }

  const currentStepDef = DEFAULT_ONBOARDING_STEPS[currentIndex];
  const completedCount = steps.filter((s) => s.isCompleted).length;
  const isCurrentDone = steps.find((s) => s.stepNumber === currentIndex + 1)?.isCompleted || false;

  const renderStep = () => {
    if (saving) return <div className="mob-wizard-loading"><div className="mob-spinner" /><p>Enregistrement...</p></div>;
    const onComplete = () => handleStepComplete(currentIndex + 1);
    switch (currentIndex + 1) {
      case 1: return <WelcomeStep onComplete={onComplete} />;
      case 2: return <AccountSetupStep cooperativeId={cooperativeId} onComplete={onComplete} />;
      case 3: return <DataStep onComplete={onComplete} />;
      case 4: return <SecurityStep onComplete={onComplete} />;
      case 5: return <ChampionsStep onComplete={onComplete} />;
      case 6: return <BaselineStep cooperativeId={cooperativeId} onComplete={onComplete} />;
      case 7: return onboarding ? <WelcomeCallStep cooperativeId={cooperativeId} onboardingId={onboarding.id} onComplete={onComplete} /> : null;
      default: return null;
    }
  };

  return (
    <div className="mob-wizard">
      {/* Header */}
      <header className="mob-wizard-header">
        <button className="mob-wizard-back" onClick={() => navigate('/cooperative')} aria-label="Retour">
          <LogOut className="mob-wizard-back-icon" />
        </button>
        <div className="mob-wizard-header-content">
          <h1 className="mob-wizard-title">Intégration Farmers First</h1>
          <p className="mob-wizard-subtitle">{completedCount} / {DEFAULT_ONBOARDING_STEPS.length} étapes</p>
        </div>
      </header>

      {/* Progress dots */}
      <div className="mob-progress-bar-wrap">
        <div className="mob-progress-bar">
          <ProgressFill pct={(completedCount / DEFAULT_ONBOARDING_STEPS.length) * 100} />
        </div>
        <div className="mob-progress-dots">
          {DEFAULT_ONBOARDING_STEPS.map((step, idx) => {
            const done = steps.find((s) => s.stepNumber === step.stepNumber)?.isCompleted;
            const current = idx === currentIndex;
            return (
              <button
                key={idx}
                className={`mob-dot ${done ? 'mob-dot-done' : current ? 'mob-dot-current' : 'mob-dot-empty'}`}
                onClick={() => setCurrentIndex(idx)}
                title={step.stepName}
                aria-label={step.stepName}
              >
                {done ? <CheckCircle2 className="mob-dot-check" /> : <span>{step.stepNumber}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step label */}
      <div className="mob-step-label-wrap">
        <span className="mob-step-badge">Étape {currentIndex + 1} / {DEFAULT_ONBOARDING_STEPS.length}</span>
        {isCurrentDone && <span className="mob-step-done-badge"><CheckCircle2 className="mob-step-done-icon" />Complétée</span>}
      </div>
      <h2 className="mob-step-name">{currentStepDef.stepName}</h2>
      <p className="mob-step-step-desc">{currentStepDef.stepDescription}</p>

      {/* Step content */}
      <div className="mob-step-content">
        {renderStep()}
      </div>

      {/* Footer nav */}
      <div className="mob-wizard-footer">
        <button
          className="mob-nav-btn"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="mob-nav-icon" />
          Précédent
        </button>
        {currentIndex < DEFAULT_ONBOARDING_STEPS.length - 1 && (
          <button
            className="mob-nav-btn mob-nav-btn-next"
            onClick={() => setCurrentIndex((i) => Math.min(DEFAULT_ONBOARDING_STEPS.length - 1, i + 1))}
          >
            Suivant
            <ChevronRight className="mob-nav-icon" />
          </button>
        )}
      </div>
    </div>
  );
};
