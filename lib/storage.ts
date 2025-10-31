import type { NightRecord } from '../types';
import { isSupabaseConfigured, supabase } from './supabaseClient';

const NIGHT_TABLE = 'domino_nights';

interface DominoNightRow {
  id: string;
  user_id: string;
  night_id: string;
  record: NightRecord;
  created_at?: string;
}

const ensureSupabase = () => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
};

export const getHistory = async (userId: string): Promise<NightRecord[]> => {
  if (!userId) return [];
  ensureSupabase();

  const { data, error } = await supabase
    .from<DominoNightRow>(NIGHT_TABLE)
    .select('night_id, record, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch history from Supabase', error);
    throw error;
  }

  return (data ?? []).map((row) => ({
    ...row.record,
    id: row.record.id ?? row.night_id ?? row.id,
  }));
};

export const saveHistory = async (userId: string, history: NightRecord[]): Promise<void> => {
  if (!userId) return;
  ensureSupabase();

  const rows: DominoNightRow[] = history.map((night) => ({
    id: night.id,
    night_id: night.id,
    user_id: userId,
    record: night,
  }));

  const { error } = await supabase.from(NIGHT_TABLE).upsert(rows, { onConflict: 'night_id' });

  if (error) {
    console.error('Failed to persist history to Supabase', error);
    throw error;
  }
};

export const clearHistory = async (userId: string): Promise<void> => {
  if (!userId) return;
  ensureSupabase();

  const { error } = await supabase.from(NIGHT_TABLE).delete().eq('user_id', userId);
  if (error) {
    console.error('Failed to clear history from Supabase', error);
    throw error;
  }
};

export const deleteUserData = async (userId: string): Promise<void> => {
  await clearHistory(userId);
};
