'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface SignupFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onSuccess: () => void;
}

export default function SignupForm({ onSubmit, onSuccess }: SignupFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await onSubmit(email, password);
      setSuccess(true);
      setLoading(false);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
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
            Create Account
          </h1>
        </div>
        {success ? (
          <div className="rounded-2xl bg-emerald-50 px-5 py-4 text-sm font-medium leading-relaxed text-emerald-800">
            Account created successfully! Redirecting to login...
          </div>
        ) : (
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
            <Input
              label="Confirm Password"
              name="confirmPassword"
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
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-teal-600 transition-colors hover:text-teal-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
