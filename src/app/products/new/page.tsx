'use client';
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewProduct() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    try {
      setSubmitting(true);
      setError(null);
      await api.createProduct(formData);
      router.push("/");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to create";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form action={onSubmit} className="space-y-4 max-w-xl">
      <h1 className="text-xl font-semibold">Add Product</h1>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="space-y-1">
        <label className="text-sm" htmlFor="name">Name</label>
        <input required name="Name" id="name" className="w-full rounded border px-3 py-2" />
      </div>
      <div className="space-y-1">
        <label className="text-sm" htmlFor="description">Description</label>
        <textarea name="Description" id="description" className="w-full rounded border px-3 py-2" rows={4} />
      </div>
      <div className="space-y-1">
        <label className="text-sm" htmlFor="price">Price</label>
        <input required type="number" step="0.01" min="0" name="Price" id="price" className="w-full rounded border px-3 py-2" />
      </div>
      <div className="space-y-1">
        <label className="text-sm" htmlFor="image">Image</label>
        <input type="file" name="ImageUrl" id="image" accept="image/*" className="w-full rounded border px-3 py-2" />
      </div>
      <button disabled={submitting} className="btn-accent disabled:opacity-50">
        {submitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}


