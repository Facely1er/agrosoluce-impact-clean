import { useState } from 'react';
import { BarChart3, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface BaselineStepProps {
  cooperativeId: string;
  onComplete: () => void;
}

interface BaselineData {
  total_farmers: string;
  farmers_with_id: string;
  total_plots: string;
  plots_with_geo: string;
  has_certifications: string;
  certifications_list: string;
  eudr_awareness: string;
  child_labor_policy: string;
  digital_tools_used: string;
  main_challenges: string;
}

export default function BaselineStep({ cooperativeId, onComplete }: BaselineStepProps) {
  const [form, setForm] = useState<BaselineData>({
    total_farmers: '',
    farmers_with_id: '',
    total_plots: '',
    plots_with_geo: '',
    has_certifications: '',
    certifications_list: '',
    eudr_awareness: '',
    child_labor_policy: '',
    digital_tools_used: '',
    main_challenges: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    const baseline = {
      ...form,
      total_farmers: form.total_farmers ? parseInt(form.total_farmers) : null,
      farmers_with_id: form.farmers_with_id ? parseInt(form.farmers_with_id) : null,
      total_plots: form.total_plots ? parseInt(form.total_plots) : null,
      plots_with_geo: form.plots_with_geo ? parseInt(form.plots_with_geo) : null,
      recorded_at: new Date().toISOString(),
    };

    try {
      if (supabase) {
        const { error: updateError } = await supabase
          .from('cooperatives')
          .update({
            metadata: { baseline_assessment: baseline },
            coverage_metrics: {
              farmers_total: baseline.total_farmers || 0,
              farmers_with_declarations: baseline.farmers_with_id || 0,
              plots_total: baseline.total_plots || 0,
              plots_with_geo: baseline.plots_with_geo || 0,
            },
          })
          .eq('id', cooperativeId);
        if (updateError) throw updateError;
      }
      setSaved(true);
      setTimeout(() => onComplete(), 800);
    } catch (err: any) {
      setError(err?.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const yesNoOptions = [
    { value: 'yes', label: 'Oui' },
    { value: 'partial', label: 'Partiellement' },
    { value: 'no', label: 'Non' },
    { value: 'unknown', label: 'Je ne sais pas' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Évaluation de référence (baseline)</p>
          <p>
            Ces informations nous permettent d'établir votre situation de départ et de mesurer
            vos progrès au fil du temps. Répondez au mieux de vos connaissances — pas de bonnes
            ni de mauvaises réponses.
          </p>
        </div>
      </div>

      {/* Section 1: Farmer numbers */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary-600" />
          Données producteurs
        </h4>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre total de producteurs membres
            </label>
            <input
              name="total_farmers"
              type="number"
              min="0"
              value={form.total_farmers}
              onChange={handleChange}
              placeholder="Ex: 250"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Producteurs avec une pièce d'identité enregistrée
            </label>
            <input
              name="farmers_with_id"
              type="number"
              min="0"
              value={form.farmers_with_id}
              onChange={handleChange}
              placeholder="Ex: 180"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre total de parcelles
            </label>
            <input
              name="total_plots"
              type="number"
              min="0"
              value={form.total_plots}
              onChange={handleChange}
              placeholder="Ex: 400"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parcelles avec coordonnées GPS
            </label>
            <input
              name="plots_with_geo"
              type="number"
              min="0"
              value={form.plots_with_geo}
              onChange={handleChange}
              placeholder="Ex: 120"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Certifications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h4 className="font-semibold text-gray-900">Certifications et conformité</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avez-vous des certifications actuelles (Rainforest Alliance, UTZ, Fairtrade, etc.) ?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {yesNoOptions.map(({ value, label }) => (
              <label
                key={value}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer text-sm font-medium transition-colors ${
                  form.has_certifications === value
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                }`}
              >
                <input
                  type="radio"
                  name="has_certifications"
                  value={value}
                  checked={form.has_certifications === value}
                  onChange={handleChange}
                  className="hidden"
                />
                {label}
              </label>
            ))}
          </div>
        </div>
        {(form.has_certifications === 'yes' || form.has_certifications === 'partial') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lesquelles ? (précisez)
            </label>
            <input
              name="certifications_list"
              type="text"
              value={form.certifications_list}
              onChange={handleChange}
              placeholder="Ex: Rainforest Alliance, Fairtrade..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Connaissance du règlement EUDR (déforestation) ?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {yesNoOptions.map(({ value, label }) => (
              <label
                key={value}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer text-sm font-medium transition-colors ${
                  form.eudr_awareness === value
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                }`}
              >
                <input
                  type="radio"
                  name="eudr_awareness"
                  value={value}
                  checked={form.eudr_awareness === value}
                  onChange={handleChange}
                  className="hidden"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Politique de lutte contre le travail des enfants en place ?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {yesNoOptions.map(({ value, label }) => (
              <label
                key={value}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer text-sm font-medium transition-colors ${
                  form.child_labor_policy === value
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                }`}
              >
                <input
                  type="radio"
                  name="child_labor_policy"
                  value={value}
                  checked={form.child_labor_policy === value}
                  onChange={handleChange}
                  className="hidden"
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Current tools & challenges */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h4 className="font-semibold text-gray-900">Outils actuels & défis</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Outils numériques actuellement utilisés (Excel, Kobo, autre...)
          </label>
          <input
            name="digital_tools_used"
            type="text"
            value={form.digital_tools_used}
            onChange={handleChange}
            placeholder="Ex: Excel, registres papier, aucun..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Principaux défis de votre coopérative
          </label>
          <textarea
            name="main_challenges"
            rows={3}
            value={form.main_challenges}
            onChange={handleChange}
            placeholder="Ex: accès au financement, formation des membres, documentation, accès au marché..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving || saved}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-md"
      >
        {saved ? (
          <>
            <CheckCircle className="h-5 w-5" />
            Évaluation enregistrée !
          </>
        ) : saving ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            Enregistrement...
          </>
        ) : (
          'Enregistrer l\'évaluation de référence'
        )}
      </button>

      <button
        type="button"
        onClick={onComplete}
        className="w-full text-sm text-gray-500 hover:text-gray-700 text-center py-2 transition-colors"
      >
        Passer cette étape →
      </button>
    </div>
  );
}
