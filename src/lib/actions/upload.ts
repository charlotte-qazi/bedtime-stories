'use server';

import { createClient } from '@/lib/supabase/server';

export async function createStoryRecord(
  title: string,
  reader: 'granny' | 'grandpa',
  videoObjectKey: string
) {
  const supabase = await createClient();

  const { error } = await supabase.from('stories').insert({
    title,
    reader,
    video_object_key: videoObjectKey,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
