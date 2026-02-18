import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, CheckCircle, ArrowRight, Sprout, Phone, Mail,
  MapPin, Leaf, Users, Send, AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface RequestFormData {
  cooperative_name: string;
  contact_name: string;
  phone: string;
  email: string;
  region: string;
  department: string;
  primary_product: string;
  farmer_count: string;
  message: string;
}

const REGIONS_CI = [
  'Abidjan', 'Agnéby-Tiassa', 'Bafing', 'Bagoué', 'Béré', 'Bounkani',
  'Cavally', 'Folon', 'Gbêkê', 'Gbôklé', 'Gôh', 'Gontougo', 'Grands-Ponts',
  'Guémon', 'Hambol', 'Haut-Sassandra', 'Iffou', 'Indénié-Djuablin',
  'Kabadougou', 'La Mé', 'Lôh-Djiboua', 'Marahoué', 'Moronou',
  'N\'Zi', 'Nawa', 'Poro', 'San-Pédro', 'Sud-Comoé', 'Tchologo',
  'Tonkpi', 'Worodougou'
];

const PRODUCTS = [
  'Cacao', 'Café', 'Anacarde (Cajou)', 'Hévéa (Caoutchouc)',
  'Palmier à huile', 'Coton', 'Banane', 'Ananas', 'Mangue',
  'Autre'
];

const FARMER_RANGES = [
  'Moins de 50', '50 – 100', '101 – 250', '251 – 500',
  '501 – 1 000', '1 001 – 2 500', 'Plus de 2 500'
];

export default function CooperativeRequestAccess() {
  const [form, setForm] = useState<RequestFormData>({
    cooperative_name: '',
    contact_name: '',
    phone: '',
    email: '',
    region: '',
    department: '',
    primary_product: '',
    farmer_count: '',
    message: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      if (supabase) {
        const { error } = await supabase
          .from('cooperative_requests')
          .insert({
            cooperative_name: form.cooperative_name,
            contact_name: form.contact_name,
            phone: form.phone || null,
            email: form.email || null,
            region: form.region || null,
            department: form.department || null,
            primary_product: form.primary_product || null,
            farmer_count: form.farmer_count || null,
            message: form.message || null,
            status: 'pending',
          });

        if (error) throw error;
      }
      // If Supabase not configured, still show success (dev mode)
      setStatus('success');
    } catch (err: any) {
      console.error('Request submission error:', err);
      setErrorMsg(err?.message || 'Une erreur est survenue. Veuillez réessayer.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen py-16 bg-gradient-to-br from-green-50 via-primary-50 to-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12 border border-green-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Demande envoyée !
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Merci <strong>{form.contact_name || 'pour votre demande'}</strong>. Notre équipe examinera votre
              demande d'accès pour <strong>{form.cooperative_name}</strong> et vous contactera sous 2–3 jours ouvrables.
            </p>
            <div className="bg-primary-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-primary-900 mb-3">Prochaines étapes</h3>
              <ol className="space-y-2 text-sm text-primary-800">
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-0.5">1.</span>
                  Notre équipe vous contacte par téléphone ou e-mail pour confirmer votre intérêt.
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-0.5">2.</span>
                  Nous vous envoyons un lien d'invitation pour créer votre compte coopérative.
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-0.5">3.</span>
                  Vous complétez le processus d'intégration guidé (7 étapes, environ 30 minutes).
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-0.5">4.</span>
                  Appel de bienvenue avec notre équipe pour démarrer ensemble.
                </li>
              </ol>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/cooperative"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                Espace Coopérative
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/cooperatives"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-xl font-semibold border-2 border-primary-200 hover:border-primary-400 transition-colors"
              >
                Explorer le répertoire
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-secondary-50 via-primary-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
            <Building2 className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Demander l'accès à la plateforme
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Rejoignez AgroSoluce® gratuitement. Partagez quelques informations sur votre coopérative
            et notre équipe vous contactera pour activer votre espace.
          </p>
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
            <Sprout className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-xs font-medium text-gray-700">100% gratuit<br />en Année 1</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
            <Users className="h-6 w-6 text-primary-600 mx-auto mb-2" />
            <p className="text-xs font-medium text-gray-700">3 797+<br />coopératives</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
            <Leaf className="h-6 w-6 text-secondary-600 mx-auto mb-2" />
            <p className="text-xs font-medium text-gray-700">Conformité<br />EUDR incluse</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Informations sur votre coopérative</h2>

          {/* Cooperative name */}
          <div>
            <label htmlFor="cooperative_name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la coopérative <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="cooperative_name"
                name="cooperative_name"
                type="text"
                required
                value={form.cooperative_name}
                onChange={handleChange}
                placeholder="Ex: Coopérative COOP-CA de Daloa"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Contact name */}
          <div>
            <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-1">
              Votre nom complet <span className="text-red-500">*</span>
            </label>
            <input
              id="contact_name"
              name="contact_name"
              type="text"
              required
              value={form.contact_name}
              onChange={handleChange}
              placeholder="Prénom et Nom"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
            />
          </div>

          {/* Phone + Email */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone / WhatsApp
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+225 07 XX XX XX XX"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse e-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="contact@cooperative.ci"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Region + Department */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                Région
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  id="region"
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors bg-white appearance-none"
                >
                  <option value="">Sélectionner une région</option>
                  {REGIONS_CI.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Département / Commune
              </label>
              <input
                id="department"
                name="department"
                type="text"
                value={form.department}
                onChange={handleChange}
                placeholder="Ex: Daloa, Bouaflé..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Product + Farmer count */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="primary_product" className="block text-sm font-medium text-gray-700 mb-1">
                Produit principal
              </label>
              <select
                id="primary_product"
                name="primary_product"
                value={form.primary_product}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors bg-white appearance-none"
              >
                <option value="">Sélectionner un produit</option>
                {PRODUCTS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="farmer_count" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de producteurs
              </label>
              <select
                id="farmer_count"
                name="farmer_count"
                value={form.farmer_count}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors bg-white appearance-none"
              >
                <option value="">Sélectionner une tranche</option>
                {FARMER_RANGES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message (optionnel)
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              value={form.message}
              onChange={handleChange}
              placeholder="Partagez vos attentes, questions ou contexte particulier..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-none"
            />
          </div>

          {/* Error */}
          {status === 'error' && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{errorMsg}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'submitting' || !form.cooperative_name || !form.contact_name}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            {status === 'submitting' ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Envoyer ma demande d'accès
              </>
            )}
          </button>

          <p className="text-xs text-center text-gray-500">
            En soumettant ce formulaire, vous acceptez d'être contacté par l'équipe AgroSoluce®.
            Accès 100% gratuit pendant la première année — aucune carte de crédit requise.
          </p>
        </form>

        {/* Footer link */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Vous avez déjà un compte ?{' '}
          <Link to="/cooperative" className="text-primary-600 hover:underline font-medium">
            Accéder à votre espace
          </Link>
        </p>
      </div>
    </div>
  );
}
