// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const defaultSchema = (import.meta.env.VITE_SUPABASE_SCHEMA as string) || 'agrosoluce';

export const isSupabaseConfigured = (): boolean => !!(supabaseUrl && supabaseAnonKey);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabaseInstance: SupabaseClient<any> | null = null;

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: SupabaseClient<any> | null = supabaseInstance;

export const getCurrentUser = async () => {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signOut = async () => {
  if (!supabase) return { error: null };
  return supabase.auth.signOut();
};
