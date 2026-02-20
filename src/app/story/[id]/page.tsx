import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Story {
  id: string;
  title: string;
  reader: 'granny' | 'grandpa';
  video_object_key: string;
  created_at: string;
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const supabase = await createClient();

  const { data: story, error } = await supabase
    .from('stories')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !story) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto w-full max-w-3xl p-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← Back to Stories
        </Link>

        <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-4xl font-semibold text-zinc-900 dark:text-zinc-50">
            {story.title}
          </h1>

          <div className="mt-4 flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">
              {story.reader === 'granny' ? '👵 Granny' : '👴 Grandpa'}
            </span>
            <span>
              {new Date(story.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">
              Video
            </h2>
            <div className="flex aspect-video w-full items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <div className="text-center">
                <p className="text-zinc-600 dark:text-zinc-400">
                  Video will appear here
                </p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
                  Key: {story.video_object_key}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
