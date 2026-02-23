'use client';

import { signup } from '@/lib/actions/auth';
import SignupForm from '@/components/SignupForm';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();

  async function handleSignup(email: string, password: string) {
    const result = await signup(email, password);
    if (result?.error) {
      throw new Error(result.error);
    }
  }

  function handleSuccess() {
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  }

  return <SignupForm onSubmit={handleSignup} onSuccess={handleSuccess} />;
}
