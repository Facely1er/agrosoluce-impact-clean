import { supabase } from '../../../lib/supabase/client';
import type { CooperativeOnboarding, OnboardingStep } from '../types';

function transformOnboarding(data: Record<string, unknown>): CooperativeOnboarding {
  return {
    id: data.id as string,
    cooperativeId: data.cooperative_id as string,
    status: data.status as CooperativeOnboarding['status'],
    currentStep: data.current_step as number,
    startedAt: data.started_at as string | undefined,
    completedAt: data.completed_at as string | undefined,
    welcomeCallScheduledAt: data.welcome_call_scheduled_at as string | undefined,
    welcomeCallCompletedAt: data.welcome_call_completed_at as string | undefined,
    onboardingChampionId: data.onboarding_champion_id as string | undefined,
    notes: data.notes as string | undefined,
    createdAt: data.created_at as string | undefined,
    updatedAt: data.updated_at as string | undefined,
  };
}

function transformOnboardingStep(data: Record<string, unknown>): OnboardingStep {
  return {
    id: data.id as string,
    onboardingId: data.onboarding_id as string,
    stepNumber: data.step_number as number,
    stepName: data.step_name as string,
    stepDescription: data.step_description as string | undefined,
    isCompleted: data.is_completed as boolean,
    completedAt: data.completed_at as string | undefined,
    completedBy: data.completed_by as string | undefined,
    notes: data.notes as string | undefined,
    createdAt: data.created_at as string | undefined,
  };
}

export async function getOnboardingByCooperativeId(
  cooperativeId: string
): Promise<{ data: CooperativeOnboarding | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  try {
    const { data, error } = await supabase
      .from('cooperative_onboarding')
      .select('*')
      .eq('cooperative_id', cooperativeId)
      .single();
    if (error && error.code !== 'PGRST116') return { data: null, error: new Error(error.message) };
    if (!data) return { data: null, error: null };
    return { data: transformOnboarding(data), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function createOrUpdateOnboarding(
  onboarding: Partial<CooperativeOnboarding>
): Promise<{ data: CooperativeOnboarding | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  try {
    const payload: Record<string, unknown> = {
      cooperative_id: onboarding.cooperativeId,
      status: onboarding.status || 'pending',
      current_step: onboarding.currentStep || 1,
    };
    if (onboarding.welcomeCallScheduledAt) payload.welcome_call_scheduled_at = onboarding.welcomeCallScheduledAt;
    if (onboarding.welcomeCallCompletedAt) payload.welcome_call_completed_at = onboarding.welcomeCallCompletedAt;
    if (onboarding.onboardingChampionId) payload.onboarding_champion_id = onboarding.onboardingChampionId;
    if (onboarding.notes) payload.notes = onboarding.notes;

    const { data, error } = await supabase
      .from('cooperative_onboarding')
      .upsert(payload, { onConflict: 'cooperative_id', ignoreDuplicates: false })
      .select()
      .single();
    if (error) return { data: null, error: new Error(error.message) };
    return { data: transformOnboarding(data), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function updateOnboardingStep(
  onboardingId: string,
  stepNumber: number,
  isCompleted: boolean,
  completedBy?: string
): Promise<{ data: OnboardingStep | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  try {
    const { data: existing } = await supabase
      .from('onboarding_steps')
      .select('*')
      .eq('onboarding_id', onboardingId)
      .eq('step_number', stepNumber)
      .single();

    const payload: Record<string, unknown> = {
      onboarding_id: onboardingId,
      step_number: stepNumber,
      is_completed: isCompleted,
    };
    if (isCompleted) {
      payload.completed_at = new Date().toISOString();
      if (completedBy) payload.completed_by = completedBy;
    }

    let result;
    if (existing) {
      const { data, error } = await supabase
        .from('onboarding_steps').update(payload).eq('id', existing.id).select().single();
      if (error) return { data: null, error: new Error(error.message) };
      result = data;
    } else {
      const { data, error } = await supabase
        .from('onboarding_steps').insert(payload).select().single();
      if (error) return { data: null, error: new Error(error.message) };
      result = data;
    }
    return { data: transformOnboardingStep(result), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function getOnboardingSteps(
  onboardingId: string
): Promise<{ data: OnboardingStep[] | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  try {
    const { data, error } = await supabase
      .from('onboarding_steps')
      .select('*')
      .eq('onboarding_id', onboardingId)
      .order('step_number', { ascending: true });
    if (error) return { data: null, error: new Error(error.message) };
    return { data: (data || []).map(transformOnboardingStep), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

export async function completeOnboarding(
  onboardingId: string
): Promise<{ data: CooperativeOnboarding | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  try {
    const { data, error } = await supabase
      .from('cooperative_onboarding')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', onboardingId)
      .select()
      .single();
    if (error) return { data: null, error: new Error(error.message) };
    return { data: transformOnboarding(data), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}
