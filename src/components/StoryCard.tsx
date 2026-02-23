import Link from 'next/link';
import type { Story } from '@/lib/types';

interface StoryCardProps {
  story: Story;
}

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <Link
      href={`/story/${story.id}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white p-7 shadow-sm transition-all hover:shadow-lg hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
    >
      <div
        className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-teal-400 via-teal-500 to-blue-500"
        aria-hidden="true"
      />

      <span className="mt-1 inline-flex w-fit items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
        {capitalise(story.reader)}
      </span>

      <h2 className="mt-4 text-xl font-extrabold leading-snug text-blue-950 text-pretty group-hover:text-teal-600 transition-colors">
        {story.title}
      </h2>

      <p className="mt-auto pt-5 text-xs font-medium text-slate-400">
        {new Date(story.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
    </Link>
  );
}
