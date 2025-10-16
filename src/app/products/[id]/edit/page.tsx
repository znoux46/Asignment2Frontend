'use client';
import { api } from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProduct() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initial, setInitial] = useState<{ name: string; description?: string | null; price: number } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const p = await api.getProduct(Number(params.id));
        setInitial({ name: p.name, description: p.description ?? "", price: p.price });
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Failed to load";
        setError(message);
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id]);

  async function onSubmit(formData: FormData) {
    try {
      setError(null);
      await api.updateProduct(Number(params.id), formData);
      router.push(`/products/${params.id}`);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to update";
      setError(message);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!initial) return <div className="text-red-600">{error ?? 'Not found'}</div>;

  return (
    <form action={onSubmit} className="space-y-4 max-w-xl">
      <h1 className="text-xl font-semibold">Edit Product</h1>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="space-y-1">
        <label className="text-sm" htmlFor="name">Name</label>
        <input defaultValue={initial.name} required name="Name" id="name" className="w-full rounded border px-3 py-2" />
      </div>
      <div className="space-y-1">
        <label className="text-sm" htmlFor="description">Description</label>
        <textarea defaultValue={initial.description ?? ''} name="Description" id="description" className="w-full rounded border px-3 py-2" rows={4} />
      </div>
      <div className="space-y-1">
        <label className="text-sm" htmlFor="price">Price</label>
        <input defaultValue={initial.price} required type="number" step="0.01" min="0" name="Price" id="price" className="w-full rounded border px-3 py-2" />
      </div>
      <div className="space-y-1">
        <label className="text-sm" htmlFor="image">Image (optional)</label>
        <input type="file" name="ImageUrl" id="image" accept="image/*" className="w-full rounded border px-3 py-2" />
      </div>
      <button className="btn-accent">Update</button>
    </form>
  );
}


