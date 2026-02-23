export async function getVideoUrl(storyId: string) {
  const response = await fetch(`/api/video-url?storyId=${storyId}`);

  if (!response.ok) {
    throw new Error('Failed to load video');
  }

  const data = await response.json();
  return data.url as string;
}
