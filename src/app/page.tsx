import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await createClient();
  
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    console.error('Auth check failed:', error);
    redirect('/login');
  }

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-3xl p-8">
        <h1 className="text-4xl font-semibold text-zinc-900 dark:text-zinc-50">
          Stories
        </h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          Welcome, {user.email}!
        </p>
      </main>
    </div>
  );
}
