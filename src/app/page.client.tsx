'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '@/utils/api';
import { type Product } from '@/types';

export default function HomeClient() {
  const [all, setAll] = useState<Product[]>([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    api.listProducts().then(setAll).catch(() => setAll([]));
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return all;
    return all.filter(p =>
      p.name.toLowerCase().includes(term) || (p.description || '').toLowerCase().includes(term)
    );
  }, [all, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold" style={{color:"var(--accent)"}}>Products</h1>
        <Link href="/products/new" className="btn-accent">Add Product</Link>
      </div>
      <div className="flex items-center gap-2">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search..." className="input-base w-full max-w-sm" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {pageItems.map((p) => (
          <Link key={p.id} href={`/products/${p.id}`} className="block">
            <div className="card hover:shadow transition">
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt={p.name} className="h-40 w-full object-cover rounded" />
              ) : (
                <div className="h-40 w-full bg-gray-100 rounded grid place-items-center text-gray-400 text-sm">No image</div>
              )}
              <div className="mt-3">
                <h3 className="font-semibold line-clamp-1">{p.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
                <p className="mt-2 font-medium" style={{color:"var(--accent)"}}>${p.price.toFixed(2)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2">
        <button disabled={page===1} onClick={()=>setPage(p=>p-1)} className="rounded border px-3 py-1.5 disabled:opacity-50">Prev</button>
        <span className="text-sm">Page {page} / {totalPages}</span>
        <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)} className="rounded border px-3 py-1.5 disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}


