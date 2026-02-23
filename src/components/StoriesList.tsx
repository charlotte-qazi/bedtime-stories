import Link from 'next/link';
import type { Story } from '@/lib/types';

interface StoriesListProps {
  stories: Story[] | null;
  userEmail: string;
  error?: boolean;
}

const readerConfig = {
  granny: {
    label: 'Read by Granny',
    cardBg: 'bg-amber-50',
    cardBorder: 'border-amber-200',
    cardHoverBorder: 'hover:border-amber-400',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    accent: 'bg-amber-400',
  },
  grandpa: {
    label: 'Read by Grandpa',
    cardBg: 'bg-sky-50',
    cardBorder: 'border-sky-200',
    cardHoverBorder: 'hover:border-sky-400',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-800',
    accent: 'bg-sky-400',
  },
} as const;

export default function StoriesList({
  stories,
  userEmail,
  error,
}: StoriesListProps) {
  return (
    <div className="min-h-screen bg-orange-50/50">
      <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Header */}
        <div className="mb-10 sm:mb-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-teal-600">
                Across the Seas
              </p>
              <h1 className="text-4xl font-extrabold tracking-tight text-blue-950 sm:text-5xl text-balance">
                Storytime
              </h1>
              <p className="mt-3 text-base leading-relaxed text-slate-500">
                Welcome back, {userEmail}
              </p>
            </div>
            <Link
              href="/admin/upload"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
            >
              + New Story
            </Link>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-8 rounded-2xl bg-red-50 px-5 py-4 text-sm font-medium leading-relaxed text-red-800">
            Failed to load stories. Please try again.
          </div>
        )}

        {/* Empty state */}
        {!stories || stories.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <p className="text-2xl font-bold text-blue-950">
              No stories yet
            </p>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
              Upload your first bedtime story and it will appear right here.
            </p>
          </div>
        ) : (
          /* Story grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => {
              const config = readerConfig[story.reader];
              return (
                <Link
                  key={story.id}
                  href={`/story/${story.id}`}
                  className={`group relative flex flex-col overflow-hidden rounded-3xl border-2 ${config.cardBg} ${config.cardBorder} ${config.cardHoverBorder} p-7 transition-all hover:scale-[1.02] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2`}
                >
                  {/* Color accent bar */}
                  <div
                    className={`absolute left-0 top-0 h-1.5 w-full ${config.accent}`}
                    aria-hidden="true"
                  />

                  {/* Reader badge */}
                  <span
                    className={`mt-1 inline-flex w-fit items-center rounded-full ${config.badgeBg} px-3.5 py-1 text-xs font-bold uppercase tracking-wide ${config.badgeText}`}
                  >
                    {config.label}
                  </span>

                  {/* Title */}
                  <h2 className="mt-5 text-2xl font-extrabold leading-tight text-blue-950 text-pretty group-hover:text-teal-700 transition-colors">
                    {story.title}
                  </h2>

                  {/* Date */}
                  <p className="mt-4 text-xs font-medium text-slate-400">
                    {new Date(story.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
