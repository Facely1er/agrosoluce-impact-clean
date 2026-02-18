import { useState } from 'react';
import { Users, Plus, Trash2, CheckCircle, AlertCircle, Info, Phone, Mail, User } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface ChampionsStepProps {
  cooperativeId: string;
  onComplete: () => void;
}

interface Champion {
  name: string;
  role: string;
  phone: string;
  email: string;
}

const ROLES = [
  'Président(e) de la coopérative',
  'Secrétaire général(e)',
  'Responsable technique',
  'Responsable formation',
  'Agent de terrain',
  'Comptable',
  'Autre',
];

const emptyChampion = (): Champion => ({ name: '', role: '', phone: '', email: '' });

export default function ChampionsStep({ cooperativeId: _cooperativeId, onComplete }: ChampionsStepProps) {
  const [champions, setChampions] = useState<Champion[]>([emptyChampion()]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const updateChampion = (index: number, field: keyof Champion, value: string) => {
    setChampions((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };

  const addChampion = () => {
    if (champions.length < 3) setChampions((prev) => [...prev, emptyChampion()]);
  };

  const removeChampion = (index: number) => {
    if (champions.length > 1) setChampions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const validChampions = champions.filter((c) => c.name.trim());
    if (validChampions.length === 0) {
      setError('Veuillez désigner au moins un champion de formation.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (supabase) {
        const { error: upsertError } = await supabase
          .from('cooperatives')
          .update({
            metadata: { onboarding_champions: validChampions },
          })
          .eq('id', _cooperativeId);
        if (upsertError) throw upsertError;
      }
      setSaved(true);
      setTimeout(() => onComplete(), 800);
    } catch (err: any) {
      setError(err?.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Pourquoi des champions de formation ?</p>
          <p>
            Les champions sont les personnes au sein de votre coopérative qui assureront
            la formation des autres membres et seront le point de contact principal avec
            l'équipe AgroSoluce®. Nous les accompagnons en priorité pour maximiser l'adoption.
          </p>
        </div>
      </div>

      {/* Champion roles explanation */}
      <div className="bg-primary-50 rounded-xl p-5">
        <h4 className="font-semibold text-primary-900 mb-3 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Le rôle d'un champion
        </h4>
        <ul className="space-y-1.5 text-sm text-primary-800">
          {[
            'Apprendre à utiliser la plateforme AgroSoluce®',
            'Former les autres membres de la coopérative',
            'Coordonner la saisie des données producteurs',
            'Être le relais entre l\'équipe AgroSoluce® et la coopérative',
            'Suivre les indicateurs de couverture et de conformité',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Champions list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900">Champions désignés</h4>
          {champions.length < 3 && (
            <button
              type="button"
              onClick={addChampion}
              className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              <Plus className="h-4 w-4" />
              Ajouter un champion
            </button>
          )}
        </div>

        {champions.map((champion, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                Champion {index + 1}
              </span>
              {champions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeChampion(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  <User className="inline h-3.5 w-3.5 mr-1" />
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={champion.name}
                  onChange={(e) => updateChampion(index, 'name', e.target.value)}
                  placeholder="Prénom et Nom"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Rôle dans la coopérative</label>
                <select
                  value={champion.role}
                  onChange={(e) => updateChampion(index, 'role', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
                >
                  <option value="">Sélectionner un rôle</option>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  <Phone className="inline h-3.5 w-3.5 mr-1" />
                  Téléphone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={champion.phone}
                  onChange={(e) => updateChampion(index, 'phone', e.target.value)}
                  placeholder="+225 07 XX XX XX XX"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  <Mail className="inline h-3.5 w-3.5 mr-1" />
                  E-mail
                </label>
                <input
                  type="email"
                  value={champion.email}
                  onChange={(e) => updateChampion(index, 'email', e.target.value)}
                  placeholder="champion@cooperative.ci"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
            </div>
          </div>
        ))}
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
            Champions enregistrés !
          </>
        ) : saving ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            Sauvegarde...
          </>
        ) : (
          'Enregistrer les champions'
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
