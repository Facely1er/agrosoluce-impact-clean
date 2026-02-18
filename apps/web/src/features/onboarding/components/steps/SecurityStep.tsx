import { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface SecurityStepProps {
  onComplete: () => void;
}

export default function SecurityStep({ onComplete }: SecurityStepProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const strength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const map = [
      { label: '', color: 'bg-gray-200' },
      { label: 'Faible', color: 'bg-red-400' },
      { label: 'Moyen', color: 'bg-orange-400' },
      { label: 'Bon', color: 'bg-yellow-400' },
      { label: 'Excellent', color: 'bg-green-500' },
    ];
    return { score, ...map[score] };
  };

  const pwdStrength = strength(newPassword);

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      setError('Le mot de passe doit comporter au moins 8 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (supabase) {
        const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
        if (updateError) throw updateError;
      }
      setSaved(true);
      setTimeout(() => onComplete(), 1000);
    } catch (err: any) {
      setError(err?.message || 'Erreur lors du changement de mot de passe.');
    } finally {
      setSaving(false);
    }
  };

  const securityTips = [
    'Utilisez au moins 12 caractères',
    'Mélangez lettres, chiffres et symboles',
    'Évitez les informations personnelles évidentes',
    'Ne partagez jamais votre mot de passe',
    'Utilisez un gestionnaire de mots de passe',
  ];

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <Shield className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-amber-800">
          <p className="font-medium mb-1">Sécurisez votre compte coopérative</p>
          <p>
            Votre espace contient des données sensibles sur vos producteurs et votre conformité.
            Configurez un mot de passe fort et partagez les accès uniquement avec des personnes de confiance.
          </p>
        </div>
      </div>

      {/* Password change form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary-600" />
          Changer le mot de passe
        </h4>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Votre mot de passe actuel"
              className="w-full pr-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Au moins 8 caractères"
              className="w-full pr-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {newPassword && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      i <= pwdStrength.score ? pwdStrength.color : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              {pwdStrength.label && (
                <p className="text-xs text-gray-500">Force : {pwdStrength.label}</p>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Répéter le nouveau mot de passe"
              className={`w-full pr-10 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                confirmPassword && newPassword !== confirmPassword
                  ? 'border-red-400'
                  : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleChangePassword}
          disabled={saving || saved || !newPassword}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {saved ? (
            <>
              <CheckCircle className="h-5 w-5" />
              Mot de passe mis à jour !
            </>
          ) : saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              Mise à jour...
            </>
          ) : (
            'Mettre à jour le mot de passe'
          )}
        </button>
      </div>

      {/* Security tips */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-gray-600" />
          Bonnes pratiques de sécurité
        </h4>
        <ul className="space-y-2">
          {securityTips.map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Skip option */}
      <button
        type="button"
        onClick={onComplete}
        className="w-full text-sm text-gray-500 hover:text-gray-700 text-center py-2 transition-colors"
      >
        Continuer sans changer le mot de passe →
      </button>
    </div>
  );
}
