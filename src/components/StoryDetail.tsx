import Link from 'next/link';
import VideoPlayer from '@/components/VideoPlayer';
import type { Story } from '@/lib/types';

interface StoryDetailProps {
  story: Story;
}

export default function StoryDetail({ story }: StoryDetailProps) {
  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-3xl p-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-teal-500 hover:text-teal-600"
        >
          ← Back to Stories
        </Link>

        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-8">
          <h1 className="text-4xl font-semibold text-blue-950">
            {story.title}
          </h1>

          <div className="mt-4 flex items-center gap-4 text-sm text-slate-600">
            <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-teal-700">
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
            <h2 className="mb-4 text-lg font-medium text-blue-950">Video</h2>
            <VideoPlayer storyId={story.id} />
          </div>
        </div>
      </main>
    </div>
  );
}
