'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-4">Please try again or go back.</p>
        <div className="flex gap-3 justify-center">
          <button className="btn-accent" onClick={() => reset()}>Try again</button>
          <Link className="btn-outline" href="/">Home</Link>
        </div>
      </div>
    </div>
  );
}


