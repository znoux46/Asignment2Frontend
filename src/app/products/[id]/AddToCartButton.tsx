'use client';
import { secureApi } from '@/utils/api';

export function AddToCartButton({ id }: { id: number }) {
  async function add() {
    try {
      await secureApi.addToCart(id, 1);
      alert('Added to cart');
    } catch {
      alert('Please login first');
    }
  }
  return (
    <button onClick={add} className="btn-accent">Add to cart</button>
  );
}


