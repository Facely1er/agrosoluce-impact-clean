import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const defaultSchema = (import.meta.env.VITE_SUPABASE_SCHEMA as string) || 'agrosoluce';

export const isSupabaseConfigured = (): boolean => !!(supabaseUrl && supabaseAnonKey);

let supabaseInstance: SupabaseClient | null = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
      db: {
        schema: defaultSchema,
      },
    });
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  supabaseInstance = null;
}

export const supabase: SupabaseClient | null = supabaseInstance;

export const getCurrentUser = async () => {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signOut = async () => {
  if (!supabase) return { error: null };
  return supabase.auth.signOut();
};
