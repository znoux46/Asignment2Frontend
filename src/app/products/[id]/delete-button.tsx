'use client';
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";

export function DeleteButton({ id }: { id: number }) {
  const router = useRouter();
  async function onDelete() {
    if (!confirm('Delete this product?')) return;
    await api.deleteProduct(id);
    router.push('/');
  }
  return (
    <button onClick={onDelete} className="rounded border px-3 py-1.5 text-sm text-red-600 border-red-300">Delete</button>
  );
}


