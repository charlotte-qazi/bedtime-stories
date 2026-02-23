import Link from 'next/link';
import Image from 'next/image';
import VideoPlayer from '@/components/VideoPlayer';
import type { Story } from '@/lib/types';

interface StoryDetailProps {
  story: Story;
}

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function StoryDetail({ story }: StoryDetailProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero banner */}
      <div className="relative overflow-hidden bg-blue-950">
        <div className="absolute inset-0">
          <Image
            src="/images/ocean-hero.jpg"
            alt=""
            fill
            className="object-cover object-[center_55%] opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/50 via-transparent to-blue-950/70" />
        </div>

        <header className="relative mx-auto w-full max-w-4xl px-5 pb-24 pt-10 sm:px-8 sm:pb-28 sm:pt-14">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-teal-200 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950"
          >
            <span aria-hidden="true">{'<-'}</span> Back to Stories
          </Link>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
            {story.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-teal-500/20 px-3.5 py-1 text-sm font-semibold text-teal-200 backdrop-blur-sm">
              {capitalise(story.reader)}
            </span>
            <span className="text-sm text-teal-100/60">
              {new Date(story.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </header>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block h-12 w-full sm:h-16"
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

      {/* Content */}
      <main className="mx-auto w-full max-w-4xl px-5 pb-16 pt-4 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm sm:p-10">
          {/* Top gradient accent */}
          <div
            className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-teal-400 via-teal-500 to-blue-500"
            aria-hidden="true"
          />

          <h2 className="mb-5 text-lg font-bold text-blue-950">
            Watch the Story
          </h2>

          <div className="overflow-hidden rounded-2xl">
            <VideoPlayer storyId={story.id} />
          </div>
        </div>
      </main>
    </div>
  );
}
