import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { signIn } from '@/lib/auth/authService';
import { useAuth } from '@/lib/auth/AuthContext';

export default function CooperativeLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, cooperative, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const from = (location.state as any)?.from || null;

  // If already authenticated, redirect to appropriate page
  useEffect(() => {
    if (!loading && user && profile) {
      if (from) {
        navigate(from, { replace: true });
      } else if (profile.user_type === 'admin') {
        navigate('/admin/onboarding', { replace: true });
      } else if (profile.user_type === 'cooperative') {
        navigate('/cooperative', { replace: true });
      } else {
        navigate('/buyer', { replace: true });
      }
    }
  }, [user, profile, loading, navigate, from, cooperative]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    const { error, profile: signedInProfile } = await signIn({ email, password });

    if (error) {
      setErrorMsg(
        error.message === 'Invalid login credentials'
          ? 'E-mail ou mot de passe incorrect. Vérifiez vos informations.'
          : error.message
      );
      setSubmitting(false);
      return;
    }

    // Navigate based on user type
    if (signedInProfile?.user_type === 'admin') {
      navigate('/admin/onboarding', { replace: true });
    } else if (signedInProfile?.user_type === 'cooperative') {
      navigate(from || '/cooperative', { replace: true });
    } else {
      navigate(from || '/buyer', { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 bg-gradient-to-br from-secondary-50 via-primary-50 to-white flex items-center">
      <div className="max-w-md mx-auto px-4 w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mb-4">
            <Sprout className="h-7 w-7 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h1>
          <p className="text-gray-600">Accédez à votre espace AgroSoluce®</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Adresse e-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <a href="#" className="text-xs text-primary-600 hover:underline">
                Mot de passe oublié ?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
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
                Connexion...
              </>
            ) : (
              <>
                Se connecter
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <Link to="/cooperative/request-access" className="text-primary-600 hover:underline font-medium">
              Demander l'accès gratuit
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Invitation reçue ?{' '}
            <Link to="/cooperative/register" className="text-primary-600 hover:underline font-medium">
              Créer mon compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
