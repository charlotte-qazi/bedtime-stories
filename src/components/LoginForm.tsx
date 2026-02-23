'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await onSubmit(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-500">
            Across the Seas
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-blue-950">
            Welcome back
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
          />
          {error && (
            <div className="rounded-2xl bg-red-50 px-4 py-3.5 text-sm font-medium leading-relaxed text-red-800">
              {error}
            </div>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-semibold text-teal-600 transition-colors hover:text-teal-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
