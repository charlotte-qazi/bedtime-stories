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
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-slate-100">
        <p className="text-base font-medium text-slate-500">Loading video...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-red-50">
        <p className="text-base font-medium text-red-800">{error}</p>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-slate-100">
        <p className="text-base font-medium text-slate-500">No video available</p>
      </div>
    );
  }

  return (
    <video
      controls
      playsInline
      className="w-full max-w-3xl rounded-2xl shadow-sm"
      src={videoUrl}
    />
  );
}
