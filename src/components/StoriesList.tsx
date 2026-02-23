import Link from 'next/link';
import type { Story } from '@/lib/types';

interface StoriesListProps {
  stories: Story[] | null;
  userEmail: string;
  error?: boolean;
}

export default function StoriesList({
  stories,
  userEmail,
  error,
}: StoriesListProps) {
  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-3xl p-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-blue-950">Stories</h1>
            <p className="mt-2 text-slate-600">Welcome, {userEmail}!</p>
          </div>
          <Link
            href="/admin/upload"
            className="rounded-md bg-blue-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-900"
          >
            + Upload Story
          </Link>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            Failed to load stories. Please try again.
          </div>
        )}

        {!stories || stories.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-600">No stories yet. Create your first story!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/story/${story.id}`}
                className="block rounded-lg border border-slate-200 bg-white p-6 transition-colors hover:border-teal-500 hover:bg-slate-50"
              >
                <h2 className="text-xl font-semibold text-blue-950">
                  {story.title}
                </h2>
                <div className="mt-2 flex items-center gap-4 text-sm text-slate-600">
                  <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-teal-700">
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
