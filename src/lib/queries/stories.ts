import { createClient } from '@/lib/supabase/server';
import type { Story } from '@/lib/types';

export async function getStories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('stories')
    .select('id, title, reader, created_at')
    .order('created_at', { ascending: false });

  return { stories: data as Story[] | null, error };
}

export async function getStoryById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('id', id)
    .single();

  return { story: data as Story | null, error };
}
