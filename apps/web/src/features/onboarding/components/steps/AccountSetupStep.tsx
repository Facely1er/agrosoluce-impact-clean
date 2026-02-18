import { useState } from 'react';
import { Building2, MapPin, Phone, Mail, Leaf, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface AccountSetupStepProps {
  cooperativeId: string;
  onComplete: () => void;
}

interface ProfileForm {
  name: string;
  region: string;
  department: string;
  commune: string;
  phone: string;
  email: string;
  address: string;
  products: string[];
  description: string;
}

const REGIONS_CI = [
  'Abidjan', 'Agnéby-Tiassa', 'Bafing', 'Bagoué', 'Béré', 'Bounkani',
  'Cavally', 'Folon', 'Gbêkê', 'Gbôklé', 'Gôh', 'Gontougo', 'Grands-Ponts',
  'Guémon', 'Hambol', 'Haut-Sassandra', 'Iffou', 'Indénié-Djuablin',
  'Kabadougou', 'La Mé', 'Lôh-Djiboua', 'Marahoué', 'Moronou',
  "N'Zi", 'Nawa', 'Poro', 'San-Pédro', 'Sud-Comoé', 'Tchologo',
  'Tonkpi', 'Worodougou'
];

const AVAILABLE_PRODUCTS = [
  'Cacao', 'Café', 'Anacarde', 'Hévéa', 'Palmier à huile',
  'Coton', 'Banane', 'Ananas', 'Mangue', 'Maïs', 'Riz', 'Igname'
];

export default function AccountSetupStep({ cooperativeId, onComplete }: AccountSetupStepProps) {
  const [form, setForm] = useState<ProfileForm>({
    name: '',
    region: '',
    department: '',
    commune: '',
    phone: '',
    email: '',
    address: '',
    products: [],
    description: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleProduct = (product: string) => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.includes(product)
        ? prev.products.filter((p) => p !== product)
        : [...prev.products, product],
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError('Le nom de la coopérative est requis.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (supabase) {
        const { error: updateError } = await supabase
          .from('cooperatives')
          .update({
            name: form.name,
            region: form.region || null,
            department: form.department || null,
            commune: form.commune || null,
            phone: form.phone || null,
            email: form.email || null,
            address: form.address || null,
            products: form.products.length > 0 ? form.products : null,
            description: form.description || null,
          })
          .eq('id', cooperativeId);

        if (updateError) throw updateError;
      }

      setSaved(true);
      setTimeout(() => onComplete(), 800);
    } catch (err: any) {
      setError(err?.message || 'Une erreur est survenue lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p>
          Complétez le profil de votre coopérative. Ces informations seront visibles par les
          acheteurs potentiels et serviront à votre tableau de bord de conformité.
        </p>
      </div>

      {/* Basic info */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary-600" />
          Informations générales
        </h4>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom de la coopérative <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Nom officiel de la coopérative"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (optionnel)
          </label>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            placeholder="Présentez votre coopérative, son histoire, ses valeurs..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary-600" />
          Localisation
        </h4>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">Région</label>
            <select
              id="region"
              name="region"
              value={form.region}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
            >
              <option value="">Sélectionner</option>
              {REGIONS_CI.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
            <input
              name="department"
              type="text"
              value={form.department}
              onChange={handleChange}
              placeholder="Ex: Daloa"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commune / Ville</label>
            <input
              name="commune"
              type="text"
              value={form.commune}
              onChange={handleChange}
              placeholder="Ex: Bouaflé"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse complète</label>
            <input
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              placeholder="Quartier, rue..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary-600" />
          Contact
        </h4>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Phone className="inline h-3.5 w-3.5 mr-1" />
              Téléphone / WhatsApp
            </label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+225 07 XX XX XX XX"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="inline h-3.5 w-3.5 mr-1" />
              E-mail de la coopérative
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="contact@cooperative.ci"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary-600" />
          Produits cultivés
        </h4>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_PRODUCTS.map((product) => (
            <button
              key={product}
              type="button"
              onClick={() => toggleProduct(product)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                form.products.includes(product)
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
              }`}
            >
              {product}
            </button>
          ))}
        </div>
        {form.products.length > 0 && (
          <p className="text-xs text-gray-500">
            {form.products.length} produit(s) sélectionné(s) : {form.products.join(', ')}
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving || saved}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-md"
      >
        {saved ? (
          <>
            <CheckCircle className="h-5 w-5" />
            Profil sauvegardé !
          </>
        ) : saving ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            Sauvegarde...
          </>
        ) : (
          'Sauvegarder et continuer'
        )}
      </button>

      <button
        type="button"
        onClick={onComplete}
        className="w-full text-sm text-gray-500 hover:text-gray-700 text-center py-2 transition-colors"
      >
        Passer cette étape pour l'instant →
      </button>
    </div>
  );
}
