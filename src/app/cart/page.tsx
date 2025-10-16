'use client';
import { useEffect, useState } from 'react';
import { secureApi } from '@/utils/api';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToastContext } from '@/components/ui/ToastProvider';

type CartItem = { productId: number; name: string; imageUrl?: string | null; unitPrice: number; quantity: number; lineTotal: number };

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useToastContext();

  async function load() {
    try {
      setError(null);
      const data = await secureApi.getCart();
      setItems(data as CartItem[]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load cart';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function updateQuantity(productId: number, quantity: number) {
    try {
      if (quantity <= 0) {
        await remove(productId);
        return;
      }
      await secureApi.updateCartQuantity(productId, quantity);
      await load();
      showSuccess('Cart updated successfully');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to update cart';
      showError(msg);
    }
  }

  async function remove(productId: number) {
    try {
      await secureApi.removeFromCart(productId);
      await load();
      showSuccess('Item removed from cart');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to remove item';
      showError(msg);
    }
  }

  async function proceedToCheckout() {
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    window.location.href = '/checkout';
  }

  const total = items.reduce((s, i) => s + i.lineTotal, 0);

  if (loading) return <LoadingSpinner text="Loading your cart..." />;
  if (error) return (
    <div className="text-center py-8">
      <div className="text-red-600 mb-4">{error}</div>
      <button onClick={load} className="btn-outline">Try Again</button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold" style={{color:"var(--accent)"}}>Your Cart</h1>
        <Link href="/" className="btn-outline">Continue Shopping</Link>
      </div>
      {items.length === 0 ? (
        <div>Your cart is empty.</div>
      ) : (
        <div className="space-y-3">
          {items.map(i => (
            <div key={i.productId} className="border rounded p-3 space-y-3">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {i.imageUrl ? <img src={i.imageUrl} alt={i.name} className="h-16 w-16 object-cover rounded flex-shrink-0" /> : <div className="h-16 w-16 bg-gray-100 rounded flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{i.name}</div>
                  <div className="text-sm text-gray-600">${i.unitPrice.toFixed(2)} x {i.quantity}</div>
                  <div className="font-semibold mt-1">${i.lineTotal.toFixed(2)}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateQuantity(i.productId, i.quantity - 1)}
                    className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{i.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(i.productId, i.quantity + 1)}
                    className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button onClick={() => remove(i.productId)} className="btn-outline text-sm">Remove</button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-end gap-4">
            <div className="text-lg font-semibold">Total: ${total.toFixed(2)}</div>
            <button onClick={proceedToCheckout} className="btn-accent">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}



