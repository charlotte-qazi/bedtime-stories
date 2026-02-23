import Link from 'next/link';
import Image from 'next/image';
import type { Story } from '@/lib/types';

interface StoriesListProps {
  stories: Story[] | null;
  userEmail: string;
  error?: boolean;
}

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function StoriesList({
  stories,
  userEmail,
  error,
}: StoriesListProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero section with ocean illustration */}
      <div className="relative overflow-hidden bg-blue-950">
        <div className="absolute inset-0">
          <Image
            src="/images/ocean-hero.jpg"
            alt=""
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/50 via-transparent to-blue-950/70" />
        </div>

        <header className="relative mx-auto w-full max-w-5xl px-5 pb-28 pt-12 sm:px-8 sm:pb-36 sm:pt-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-300">
            Across the Seas
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl text-balance">
            Storytime
          </h1>
          <p className="mt-3 text-base leading-relaxed text-teal-100/80">
            Welcome back, {userEmail}
          </p>
          <Link
            href="/admin/upload"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-500 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-teal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950"
          >
            + New Story
          </Link>
        </header>

        {/* Wave divider built into the hero container */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block h-16 w-full sm:h-20"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 60C180 100 360 20 540 50C720 80 900 20 1080 50C1260 80 1380 40 1440 30V120H0V60Z"
              className="fill-slate-50"
            />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <main className="mx-auto w-full max-w-5xl px-5 pb-16 pt-2 sm:px-8">
        {/* Error state */}
        {error && (
          <div className="mb-8 rounded-2xl bg-red-50 px-5 py-4 text-sm font-medium leading-relaxed text-red-800">
            Failed to load stories. Please try again.
          </div>
        )}

        {/* Empty state */}
        {!stories || stories.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-teal-200 bg-white px-6 py-20 text-center">
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
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/story/${story.id}`}
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-white p-7 shadow-sm transition-all hover:shadow-lg hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                {/* Top gradient accent */}
                <div
                  className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-teal-400 via-teal-500 to-blue-500"
                  aria-hidden="true"
                />

                {/* Reader label */}
                <span className="mt-1 inline-flex w-fit items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                  {capitalise(story.reader)}
                </span>

                {/* Title */}
                <h2 className="mt-4 text-xl font-extrabold leading-snug text-blue-950 text-pretty group-hover:text-teal-600 transition-colors">
                  {story.title}
                </h2>

                {/* Date */}
                <p className="mt-auto pt-5 text-xs font-medium text-slate-400">
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
