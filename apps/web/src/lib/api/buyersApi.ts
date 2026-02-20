/**
 * Buyers API Service
 * Comprehensive API for buyer management
 */

import { supabase } from '@/lib/supabase/client';
import type { Buyer } from '@/types';
import { validateUserProfile } from '@/lib/validation/validators';

export interface CreateBuyerData {
  email: string;
  full_name: string;
  phone_number?: string;
  company_name: string;
  country?: string;
}

/**
 * Get all buyers
 */
export async function getBuyers(): Promise<{
  data: Buyer[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    // Buyers are user profiles with user_type = 'buyer'
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_type', 'buyer')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching buyers:', error);
      return { data: null, error: new Error(error.message) };
    }

    // Transform to Buyer format
    const buyers: Buyer[] = (data || []).map((profile: any) => ({
      id: profile.id,
      user_profile_id: profile.id,
      company_name: profile.organization_name || '',
      country: '', // Can be added to user_profiles if needed
      email: profile.email,
      verification_status: 'pending' as const, // Can be added to user_profiles if needed
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    }));

    return { data: buyers, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get buyer by ID
 */
export async function getBuyerById(id: string): Promise<{
  data: Buyer | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .eq('user_type', 'buyer')
      .single();

    if (error) {
      console.error('Error fetching buyer:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: new Error('Buyer not found') };
    }

    const buyer: Buyer = {
      id: data.id,
      user_profile_id: data.id,
      company_name: data.organization_name || '',
      country: '',
      email: data.email,
      verification_status: 'pending',
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    return { data: buyer, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get buyer by user profile ID
 */
export async function getBuyerByProfileId(profileId: string): Promise<{
  data: Buyer | null;
  error: Error | null;
}> {
  return getBuyerById(profileId);
}

// ─── EUDR Assessment ──────────────────────────────────────────────────────────

export interface BuyerEUDRAssessmentData {
  buyer_profile_id?: string;
  company_name?: string;
  primary_commodity: string;
  company_size: 'large' | 'sme' | 'micro';
  source_countries?: string[];
  supply_chain_role?: string[];
  annual_volume?: string;
  years_in_business?: string;
  secondary_commodities?: string[];
  responses: Record<string, string | string[]>;
  overall_score: number;
  risk_level: 'low' | 'standard' | 'high';
  section_scores: Record<string, number>;
  critical_gaps: unknown[];
  action_plan: unknown[];
  certification_benefit?: number;
  compliance_deadline?: string;
  days_remaining?: number;
  language?: 'en' | 'fr';
}

/**
 * Save a buyer EUDR self-assessment result
 */
export async function saveBuyerEUDRAssessment(
  data: BuyerEUDRAssessmentData
): Promise<{ data: { id: string } | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    // Attempt to resolve the current user's profile id
    let buyerProfileId: string | undefined = data.buyer_profile_id;
    if (!buyerProfileId) {
      const { data: authUser } = await supabase.auth.getUser();
      if (authUser?.user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('user_id', authUser.user.id)
          .maybeSingle();
        buyerProfileId = profile?.id;
      }
    }

    const { data: inserted, error } = await supabase
      .from('buyer_eudr_assessments')
      .insert({
        buyer_profile_id: buyerProfileId ?? null,
        company_name: data.company_name ?? null,
        primary_commodity: data.primary_commodity,
        company_size: data.company_size,
        source_countries: data.source_countries ?? [],
        supply_chain_role: data.supply_chain_role ?? [],
        annual_volume: data.annual_volume ?? null,
        years_in_business: data.years_in_business ?? null,
        secondary_commodities: data.secondary_commodities ?? [],
        responses: data.responses,
        overall_score: data.overall_score,
        risk_level: data.risk_level,
        section_scores: data.section_scores,
        critical_gaps: data.critical_gaps,
        action_plan: data.action_plan,
        certification_benefit: data.certification_benefit ?? 0,
        compliance_deadline: data.compliance_deadline ?? null,
        days_remaining: data.days_remaining ?? null,
        language: data.language ?? 'en',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error saving EUDR assessment:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: inserted, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get a buyer's EUDR assessment history
 */
export async function getBuyerEUDRAssessments(buyerProfileId: string): Promise<{
  data: BuyerEUDRAssessmentData[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('buyer_eudr_assessments')
      .select('*')
      .eq('buyer_profile_id', buyerProfileId)
      .order('completed_at', { ascending: false });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data ?? [], error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Update buyer information
 */
export async function updateBuyer(
  id: string,
  updates: Partial<CreateBuyerData>
): Promise<{
  data: Buyer | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  // Validate updates
  if (updates.email || updates.full_name) {
    const validation = validateUserProfile({
      email: updates.email,
      full_name: updates.full_name,
      user_type: 'buyer',
    });
    if (!validation.isValid) {
      return {
        data: null,
        error: new Error(`Validation failed: ${validation.errors.join(', ')}`),
      };
    }
  }

  try {
    const updateData: any = {};

    if (updates.email) updateData.email = updates.email;
    if (updates.full_name) updateData.full_name = updates.full_name;
    if (updates.phone_number) updateData.phone_number = updates.phone_number;
    if (updates.company_name) updateData.organization_name = updates.company_name;
    // Note: country would need to be added to user_profiles schema

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', id)
      .eq('user_type', 'buyer')
      .select()
      .single();

    if (error) {
      console.error('Error updating buyer:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: new Error('Buyer not found') };
    }

    const buyer: Buyer = {
      id: data.id,
      user_profile_id: data.id,
      company_name: data.organization_name || '',
      country: '',
      email: data.email,
      verification_status: 'pending',
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    return { data: buyer, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

