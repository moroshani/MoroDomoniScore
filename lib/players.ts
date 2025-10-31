import type { Player } from '../types';
import { isSupabaseConfigured, supabase } from './supabaseClient';

const PLAYER_TABLE = 'domino_players';

interface PlayerRow {
  id: string;
  user_id: string;
  name: string;
  avatar?: string;
  created_at?: string;
}

const ensureSupabase = () => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
};

export const getPlayers = async (userId: string): Promise<Player[]> => {
  if (!userId) return [];
  ensureSupabase();

  const { data, error } = await supabase
    .from<PlayerRow>(PLAYER_TABLE)
    .select('id, name, avatar')
    .eq('user_id', userId)
    .order('name', { ascending: true });

  if (error) {
    console.error('Failed to fetch players from Supabase', error);
    throw error;
  }

  return (data ?? []).map((row) => ({ id: row.id, name: row.name, avatar: row.avatar }));
};

export const savePlayers = async (userId: string, players: Player[]): Promise<void> => {
  if (!userId) return;
  ensureSupabase();

  const rows: PlayerRow[] = players.map((player) => ({
    id: player.id,
    user_id: userId,
    name: player.name,
    avatar: player.avatar,
  }));

  const { error } = await supabase.from(PLAYER_TABLE).upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error('Failed to upsert players to Supabase', error);
    throw error;
  }
};

export const updatePlayer = async (userId: string, updatedPlayer: Player): Promise<void> => {
  if (!userId) return;
  ensureSupabase();

  const { error } = await supabase
    .from(PLAYER_TABLE)
    .update({ name: updatedPlayer.name, avatar: updatedPlayer.avatar })
    .eq('user_id', userId)
    .eq('id', updatedPlayer.id);

  if (error) {
    console.error('Failed to update player in Supabase', error);
    throw error;
  }
};

export const deletePlayer = async (userId: string, playerId: string): Promise<void> => {
  if (!userId) return;
  ensureSupabase();

  const { error } = await supabase.from(PLAYER_TABLE).delete().eq('user_id', userId).eq('id', playerId);
  if (error) {
    console.error('Failed to delete player from Supabase', error);
    throw error;
  }
};

export const clearPlayers = async (userId: string): Promise<void> => {
  if (!userId) return;
  ensureSupabase();

  const { error } = await supabase.from(PLAYER_TABLE).delete().eq('user_id', userId);
  if (error) {
    console.error('Failed to clear players in Supabase', error);
    throw error;
  }
};
