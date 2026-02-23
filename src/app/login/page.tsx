'use client';

import { login } from '@/lib/actions/auth';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  async function handleLogin(email: string, password: string) {
    const result = await login(email, password);
    if (result?.error) {
      throw new Error(result.error);
    }
  }

  return <LoginForm onSubmit={handleLogin} />;
}
