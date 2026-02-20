'use client';

import { useEffect, useState } from 'react';

interface VideoPlayerProps {
  storyId: string;
}

export default function VideoPlayer({ storyId }: VideoPlayerProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideoUrl() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/video-url?storyId=${storyId}`);

        if (!response.ok) {
          throw new Error('Failed to load video');
        }

        const data = await response.json();
        setVideoUrl(data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load video');
      } finally {
        setLoading(false);
      }
    }

    fetchVideoUrl();
  }, [storyId]);

  if (loading) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
        <p className="text-zinc-600 dark:text-zinc-400">Loading video...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20">
        <p className="text-red-800 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
        <p className="text-zinc-600 dark:text-zinc-400">No video available</p>
      </div>
    );
  }

  return (
    <video
      controls
      playsInline
      style={{ width: '100%', maxWidth: 720 }}
      className="rounded-lg"
      src={videoUrl}
    />
  );
}
