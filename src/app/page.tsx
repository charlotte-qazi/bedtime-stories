import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

interface Story {
  id: string;
  title: string;
  reader: 'granny' | 'grandpa';
  created_at: string;
}

export default async function Home() {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: stories, error } = await supabase
    .from('stories')
    .select('id, title, reader, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching stories:', error);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto w-full max-w-3xl p-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-zinc-900 dark:text-zinc-50">
              Stories
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Welcome, {user.email}!
            </p>
          </div>
          <Link
            href="/admin/upload"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            + Upload Story
          </Link>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
            Failed to load stories. Please try again.
          </div>
        )}

        {!stories || stories.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-zinc-600 dark:text-zinc-400">
              No stories yet. Create your first story!
            </p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
              {/* Seed instructions:
                  Go to Supabase SQL Editor and run:
                  
                  INSERT INTO stories (title, reader, video_object_key, created_at)
                  VALUES 
                    ('The Magical Forest', 'granny', 'videos/sample1.mp4', NOW()),
                    ('Adventures in Space', 'grandpa', 'videos/sample2.mp4', NOW() - INTERVAL '1 day'),
                    ('The Brave Little Mouse', 'granny', 'videos/sample3.mp4', NOW() - INTERVAL '2 days');
              */}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/story/${story.id}`}
                className="block rounded-lg border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
              >
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {story.title}
                </h2>
                <div className="mt-2 flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">
                    {story.reader === 'granny' ? '👵 Granny' : '👴 Grandpa'}
                  </span>
                  <span>
                    {new Date(story.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
