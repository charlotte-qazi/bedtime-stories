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
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl text-balance">
              Your Stories
            </h1>
            <p className="mt-2 text-base text-slate-500">
              Welcome back, {userEmail}
            </p>
          </div>
          <Link
            href="/admin/upload"
            className="inline-flex items-center justify-center rounded-2xl bg-blue-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-950 focus-visible:ring-offset-2"
          >
            + Upload Story
          </Link>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-8 rounded-2xl bg-red-50 px-5 py-4 text-sm leading-relaxed text-red-800">
            Failed to load stories. Please try again.
          </div>
        )}

        {/* Empty state */}
        {!stories || stories.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <p className="text-lg font-medium text-blue-950">
              No stories yet
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Upload your first bedtime story to get started.
            </p>
          </div>
        ) : (
          /* Story grid */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/story/${story.id}`}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-teal-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                {/* Reader badge */}
                <span className="mb-4 inline-flex w-fit items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                  {story.reader === 'granny' ? 'Granny' : 'Grandpa'}
                </span>

                {/* Title */}
                <h2 className="text-xl font-bold leading-snug text-blue-950 text-pretty">
                  {story.title}
                </h2>

                {/* Date */}
                <p className="mt-3 text-xs text-slate-400">
                  {new Date(story.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
