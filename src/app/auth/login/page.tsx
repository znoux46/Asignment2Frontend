'use client';
import { useState } from 'react';
import { api } from '@/utils/api';
import { saveAuth } from '@/utils/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    try {
      setLoading(true);
      setError(null);
      const usernameOrEmail = String(formData.get('usernameOrEmail') || '');
      const password = String(formData.get('password') || '');
      const user = await api.login({ usernameOrEmail, password });
      saveAuth(user);
      router.push('/');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={onSubmit} className="space-y-4 max-w-sm">
      <h1 className="text-xl font-semibold">Login</h1>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="space-y-1">
        <label className="text-sm" htmlFor="usernameOrEmail">Username or Email</label>
        <input name="usernameOrEmail" id="usernameOrEmail" className="w-full rounded border px-3 py-2" />
      </div>
      <div className="space-y-1">
        <label className="text-sm" htmlFor="password">Password</label>
        <input type="password" name="password" id="password" className="w-full rounded border px-3 py-2" />
      </div>
      <button disabled={loading} className="btn-accent disabled:opacity-50">{loading ? 'Logging in...' : 'Login'}</button>
    </form>
  );
}



