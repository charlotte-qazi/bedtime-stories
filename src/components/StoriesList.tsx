import Link from 'next/link';
import Image from 'next/image';
import type { Story } from '@/lib/types';

interface StoriesListProps {
  stories: Story[] | null;
  userEmail: string;
  error?: boolean;
}

const storyArt = [
  '/images/story-art-1.jpg',
  '/images/story-art-2.jpg',
  '/images/story-art-3.jpg',
  '/images/story-art-4.jpg',
  '/images/story-art-5.jpg',
  '/images/story-art-6.jpg',
];

function getArtForIndex(index: number) {
  return storyArt[index % storyArt.length];
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
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-teal-900 to-slate-50">
      {/* Hero section with ocean illustration */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/ocean-hero.jpg"
            alt=""
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/60 via-blue-950/40 to-transparent" />
        </div>

        <header className="relative mx-auto w-full max-w-5xl px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16">
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
      </div>

      {/* Wave transition - SVG divider */}
      <div className="-mt-1">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z"
            className="fill-slate-50"
          />
        </svg>
      </div>

      {/* Main content on light background */}
      <main className="bg-slate-50 pb-16">
        <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
          {/* Error state */}
          {error && (
            <div className="mb-8 rounded-2xl bg-red-50 px-5 py-4 text-sm font-medium leading-relaxed text-red-800">
              Failed to load stories. Please try again.
            </div>
          )}

          {/* Empty state */}
          {!stories || stories.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-teal-200 bg-white px-6 py-20 text-center">
              <div className="mx-auto mb-6 h-24 w-24 overflow-hidden rounded-full">
                <Image
                  src="/images/story-art-1.jpg"
                  alt="A friendly whale"
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              </div>
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
              {stories.map((story, index) => (
                <Link
                  key={story.id}
                  href={`/story/${story.id}`}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:shadow-lg hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                >
                  {/* Card illustration */}
                  <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-teal-100 to-blue-100">
                    <Image
                      src={getArtForIndex(index)}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
                  </div>

                  {/* Card content */}
                  <div className="flex flex-1 flex-col p-6">
                    {/* Reader label */}
                    <span className="mb-3 inline-flex w-fit items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                      {capitalise(story.reader)}
                    </span>

                    {/* Title */}
                    <h2 className="text-xl font-extrabold leading-snug text-blue-950 text-pretty group-hover:text-teal-700 transition-colors">
                      {story.title}
                    </h2>

                    {/* Date */}
                    <p className="mt-auto pt-4 text-xs font-medium text-slate-400">
                      {new Date(story.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
