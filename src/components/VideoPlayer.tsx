'use client';

import { useEffect, useState } from 'react';
import { getVideoUrl } from '@/lib/api/video';

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
        const url = await getVideoUrl(storyId);
        setVideoUrl(url);
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
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-slate-100">
        <p className="text-slate-600">Loading video...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-red-200 bg-red-50">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-slate-100">
        <p className="text-slate-600">No video available</p>
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
