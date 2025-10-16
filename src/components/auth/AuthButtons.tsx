'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAuth, clearAuth } from '@/utils/auth';
import { useRouter } from 'next/navigation';

export function AuthButtons() {
  const [user, setUser] = useState<{ id: number; username: string; email: string; role: string; token: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const authUser = getAuth();
    setUser(authUser);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    router.push('/');
  };

  if (loading) {
    return <div className="btn-outline">Loading...</div>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">Welcome, {user.username}</span>
        <button onClick={handleLogout} className="btn-outline">Logout</button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/auth/login" className="btn-outline">Login</Link>
      <Link href="/auth/register" className="btn-accent">Register</Link>
    </div>
  );
}
