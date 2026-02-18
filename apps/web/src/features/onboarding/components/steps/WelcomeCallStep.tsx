import { useState } from 'react';
import { Phone, Calendar, CheckCircle, Clock, MessageSquare, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface WelcomeCallStepProps {
  cooperativeId: string;
  onboardingId: string;
  onComplete: () => void;
}

const TIME_SLOTS = [
  '08:00 – 09:00',
  '09:00 – 10:00',
  '10:00 – 11:00',
  '11:00 – 12:00',
  '14:00 – 15:00',
  '15:00 – 16:00',
  '16:00 – 17:00',
];

const COMMUNICATION_METHODS = [
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { value: 'phone', label: 'Appel téléphonique', icon: Phone },
  { value: 'email', label: 'E-mail', icon: Mail },
  { value: 'video', label: 'Visioconférence', icon: Calendar },
];

export default function WelcomeCallStep({ cooperativeId: _cooperativeId, onboardingId, onComplete }: WelcomeCallStepProps) {
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [preferredMethod, setPreferredMethod] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [scheduled, setScheduled] = useState(false);

  // Minimum date = tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  const handleSchedule = async () => {
    setSaving(true);

    try {
      const scheduledAt = preferredDate
        ? new Date(`${preferredDate}T${preferredTime?.split(' – ')[0] || '09:00'}:00`).toISOString()
        : null;

      if (supabase) {
        await supabase
          .from('cooperative_onboarding')
          .update({
            welcome_call_scheduled_at: scheduledAt,
            notes: [
              notes,
              preferredMethod ? `Méthode préférée: ${preferredMethod}` : '',
              contactPhone ? `Contact: ${contactPhone}` : '',
            ]
              .filter(Boolean)
              .join(' | '),
          })
          .eq('id', onboardingId);
      }

      setScheduled(true);
      setTimeout(() => onComplete(), 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (scheduled) {
    return (
      <div className="text-center space-y-6 py-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Appel programmé !</h3>
          <p className="text-gray-600">
            {preferredDate
              ? `Notre équipe vous contactera le ${new Date(preferredDate).toLocaleDateString('fr-FR', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })}${preferredTime ? ` entre ${preferredTime}` : ''}.`
              : 'Notre équipe vous contactera prochainement pour organiser l\'appel de bienvenue.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Congratulations banner */}
      <div className="bg-gradient-to-r from-green-500 to-primary-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Presque terminé !</h3>
            <p className="text-white/85 text-sm">Vous êtes à la dernière étape</p>
          </div>
        </div>
        <p className="text-white/90 text-sm">
          Planifiez votre appel de bienvenue avec l'équipe AgroSoluce®. Nous passerons
          en revue votre configuration, répondrons à vos questions et vous lancerons
          officiellement sur la plateforme.
        </p>
      </div>

      {/* What to expect on the call */}
      <div className="bg-gray-50 rounded-xl p-5">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary-600" />
          Au programme de l'appel (~30 minutes)
        </h4>
        <ul className="space-y-2">
          {[
            'Présentation officielle de votre coopérative sur AgroSoluce®',
            'Revue de votre configuration et de vos données',
            'Démonstration des fonctionnalités clés (tableau de bord, conformité EUDR)',
            'Questions / réponses avec notre équipe',
            'Plan d\'action personnalisé pour les 30 premiers jours',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Schedule form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary-600" />
          Choisir une date et un créneau
        </h4>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date souhaitée
            </label>
            <input
              type="date"
              min={minDateStr}
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Clock className="inline h-3.5 w-3.5 mr-1" />
              Créneau horaire (UTC+0)
            </label>
            <select
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
            >
              <option value="">Sélectionner un créneau</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Communication method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Moyen de communication préféré
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {COMMUNICATION_METHODS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setPreferredMethod(value)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-sm font-medium transition-colors ${
                  preferredMethod === value
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Contact info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Numéro de téléphone / WhatsApp pour l'appel
          </label>
          <input
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="+225 07 XX XX XX XX"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Questions ou points à aborder (optionnel)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Comment importer nos données Excel ? Pouvez-vous nous expliquer la conformité EUDR ?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
          />
        </div>
      </div>

      <button
        onClick={handleSchedule}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-md"
      >
        {saving ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            Planification...
          </>
        ) : (
          <>
            <Calendar className="h-5 w-5" />
            Confirmer l'appel de bienvenue
          </>
        )}
      </button>

      <button
        type="button"
        onClick={onComplete}
        className="w-full text-sm text-gray-500 hover:text-gray-700 text-center py-2 transition-colors"
      >
        Terminer l'intégration sans planifier →
      </button>

      <p className="text-xs text-center text-gray-400">
        Notre équipe peut aussi vous contacter directement à{' '}
        <a href="mailto:contact@agrosoluce.ci" className="text-primary-500 hover:underline">
          contact@agrosoluce.ci
        </a>
      </p>
    </div>
  );
}
