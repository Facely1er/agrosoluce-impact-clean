import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2, Mail, Lock, User, Phone, Eye, EyeOff,
  CheckCircle, AlertCircle, ArrowRight, Sprout
} from 'lucide-react';
import { signUp } from '@/lib/auth/authService';
import { supabase } from '@/lib/supabase/client';

type Step = 'form' | 'success';

interface RegisterForm {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  organizationName: string;
  agreedToTerms: boolean;
}

export default function CooperativeRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('form');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState<RegisterForm>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    agreedToTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const passwordStrength = (pwd: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const map: Record<number, { label: string; color: string }> = {
      0: { label: 'Très faible', color: 'bg-red-500' },
      1: { label: 'Faible', color: 'bg-orange-400' },
      2: { label: 'Moyen', color: 'bg-yellow-400' },
      3: { label: 'Bon', color: 'bg-blue-400' },
      4: { label: 'Excellent', color: 'bg-green-500' },
    };
    return { score, ...map[score] };
  };

  const strength = passwordStrength(form.password);

  const validate = (): string | null => {
    if (!form.fullName.trim()) return 'Le nom complet est requis.';
    if (!form.email.trim()) return 'L\'adresse e-mail est requise.';
    if (!form.organizationName.trim()) return 'Le nom de la coopérative est requis.';
    if (form.password.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères.';
    if (form.password !== form.confirmPassword) return 'Les mots de passe ne correspondent pas.';
    if (!form.agreedToTerms) return 'Vous devez accepter les conditions d\'utilisation.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const { user: newUser, profile: newProfile, error } = await signUp({
      email: form.email,
      password: form.password,
      fullName: form.fullName,
      phoneNumber: form.phone || undefined,
      userType: 'cooperative',
      organizationName: form.organizationName,
    });

    if (error) {
      setErrorMsg(error.message || 'Une erreur est survenue. Veuillez réessayer.');
      setSubmitting(false);
      return;
    }

    // Create cooperative record linked to the new user profile
    if (newUser && newProfile && supabase) {
      const { data: coopRecord } = await supabase
        .from('cooperatives')
        .insert({
          name: form.organizationName,
          phone: form.phone || null,
          email: form.email,
          user_profile_id: newProfile.id,
          is_verified: false,
        })
        .select('id')
        .single();

      // Create the onboarding record immediately
      if (coopRecord) {
        await supabase.from('cooperative_onboarding').upsert(
          {
            cooperative_id: coopRecord.id,
            status: 'in_progress',
            current_step: 1,
          },
          { onConflict: 'cooperative_id', ignoreDuplicates: true }
        );
        // Redirect directly to the onboarding wizard
        navigate(`/cooperative/onboarding/${coopRecord.id}`, { replace: true });
        return;
      }
    }

    setStep('success');
    setSubmitting(false);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen py-16 bg-gradient-to-br from-green-50 via-primary-50 to-white flex items-center">
        <div className="max-w-lg mx-auto px-4 w-full">
          <div className="bg-white rounded-2xl shadow-xl p-10 border border-green-100 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Compte créé !</h1>
            <p className="text-gray-600 mb-4">
              Bienvenue, <strong>{form.fullName}</strong>. Votre compte pour{' '}
              <strong>{form.organizationName}</strong> a bien été créé.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800 text-left">
              <p className="font-medium mb-1">Vérifiez votre e-mail</p>
              <p>
                Un e-mail de confirmation a été envoyé à <strong>{form.email}</strong>.
                Cliquez sur le lien pour activer votre compte, puis commencez votre intégration.
              </p>
            </div>
            <button
              onClick={() => navigate('/cooperative')}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              Accéder à mon espace
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-secondary-50 via-primary-50 to-white">
      <div className="max-w-lg mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mb-4">
            <Sprout className="h-7 w-7 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Créer votre compte</h1>
          <p className="text-gray-600">
            Inscrivez votre coopérative sur AgroSoluce® — gratuit pour la 1ère année.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-5">
          {/* Organization Name */}
          <div>
            <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la coopérative <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="organizationName"
                name="organizationName"
                type="text"
                required
                value={form.organizationName}
                onChange={handleChange}
                placeholder="Nom officiel de votre coopérative"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Votre nom complet <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={form.fullName}
                onChange={handleChange}
                placeholder="Prénom et Nom"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Adresse e-mail <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Phone */}
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

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Au moins 8 caractères"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {form.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i <= strength.score ? strength.color : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">{strength.label}</p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le mot de passe <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Répéter le mot de passe"
                className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                  form.confirmPassword && form.password !== form.confirmPassword
                    ? 'border-red-400'
                    : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">Les mots de passe ne correspondent pas.</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3">
            <input
              id="agreedToTerms"
              name="agreedToTerms"
              type="checkbox"
              checked={form.agreedToTerms}
              onChange={handleChange}
              className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="agreedToTerms" className="text-sm text-gray-600">
              J'accepte les{' '}
              <a href="#" className="text-primary-600 hover:underline">
                conditions d'utilisation
              </a>{' '}
              et la{' '}
              <a href="#" className="text-primary-600 hover:underline">
                politique de confidentialité
              </a>{' '}
              d'AgroSoluce®.
            </label>
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{errorMsg}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Création du compte...
              </>
            ) : (
              <>
                Créer mon compte coopérative
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-gray-600">
            Vous n'avez pas encore d'invitation ?{' '}
            <Link to="/cooperative/request-access" className="text-primary-600 hover:underline font-medium">
              Demander l'accès
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Déjà un compte ?{' '}
            <Link to="/cooperative" className="text-primary-600 hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
