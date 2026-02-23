import { requireAuth } from '@/lib/auth';
import { getStories } from '@/lib/queries/stories';
import StoriesList from '@/components/StoriesList';

export default async function Home() {
  const user = await requireAuth();
  const { stories, error } = await getStories();

  if (error) {
    console.error('Error fetching stories:', error);
  }

  return (
    <StoriesList stories={stories} userEmail={user.email || ''} error={!!error} />
  );
}
