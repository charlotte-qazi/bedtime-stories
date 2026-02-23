import BackLink from '@/components/ui/BackLink';
import ContentCard from '@/components/ui/ContentCard';
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
      <main className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
        <BackLink />

        <ContentCard className="mt-8">
          <div className="mb-10 mt-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-500">
              Across the Seas
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-blue-950 text-pretty sm:text-4xl">
              {story.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-teal-50 px-4 py-1.5 text-xs font-semibold text-teal-700">
                {capitalise(story.reader)}
              </span>
              <span className="text-sm font-medium text-slate-400">
                {new Date(story.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          <VideoPlayer storyId={story.id} />
        </ContentCard>
      </main>
    </div>
  );
}
