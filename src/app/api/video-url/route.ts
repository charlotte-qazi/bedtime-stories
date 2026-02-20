import { requireAuthAPI } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { signGetObjectUrl } from '@/lib/r2';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { error, user } = await requireAuthAPI();
  if (error) return error;

  const storyId = request.nextUrl.searchParams.get('storyId');
  if (!storyId) {
    return Response.json({ error: 'Missing storyId' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: story, error: dbError } = await supabase
    .from('stories')
    .select('video_object_key')
    .eq('id', storyId)
    .single();

  if (dbError || !story) {
    return Response.json({ error: 'Story not found' }, { status: 404 });
  }

  const url = await signGetObjectUrl(story.video_object_key);

  return Response.json({ url });
}
