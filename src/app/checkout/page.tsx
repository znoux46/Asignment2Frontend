'use client';
import { useEffect, useState } from 'react';
import { secureApi } from '@/utils/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import StripePaymentForm from '@/components/payment/StripePaymentForm';

type CartItem = { productId: number; name: string; imageUrl?: string | null; unitPrice: number; quantity: number; lineTotal: number };

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  // const [paymentStep] = useState<'checkout' | 'payment'>('checkout');
  const [orderCreated, setOrderCreated] = useState(false);

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

  async function createOrder() {
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      setCheckingOut(true);
      setError(null);
      const res = await secureApi.checkout();
      setOrderId(res.id);
      setOrderCreated(true);
      setPaymentStep('payment');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Checkout failed';
      setError(msg);
    } finally {
      setCheckingOut(false);
    }
  }

  function handlePaymentSuccess(order: { id: number; total: number }) {
    alert(`Order #${order.id} placed successfully! Total: $${order.total.toFixed(2)}`);
    router.push('/orders');
  }

  function handlePaymentError(error: string) {
    setError(error);
  }

  const total = items.reduce((s, i) => s + i.lineTotal, 0);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold" style={{color:"var(--accent)"}}>Checkout</h1>
        <Link href="/cart" className="btn-outline">Back to Cart</Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Your cart is empty.</p>
          <Link href="/" className="btn-accent">Continue Shopping</Link>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Order Summary */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              {items.map(i => (
                <div key={i.productId} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {i.imageUrl ? <img src={i.imageUrl} alt={i.name} className="h-16 w-16 object-cover rounded" /> : <div className="h-16 w-16 bg-gray-100 rounded" />}
                    <div>
                      <div className="font-medium">{i.name}</div>
                      <div className="text-sm text-gray-600">${i.unitPrice.toFixed(2)} x {i.quantity}</div>
                    </div>
                  </div>
                  <div className="font-semibold">${i.lineTotal.toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
            <div className="space-y-4">
              {!orderCreated ? (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Secure Payment:</strong> We use Stripe for secure payment processing. 
                      Your payment information is encrypted and secure.
                    </p>
                  </div>
                  
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Click &quot;Proceed to Payment&quot; to enter your payment details securely.</p>
                  </div>
                </>
              ) : (
                <StripePaymentForm
                  orderId={orderId!}
                  amount={total}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/cart" className="btn-outline w-full sm:w-auto">Back to Cart</Link>
            {!orderCreated && (
              <button 
                onClick={createOrder} 
                disabled={checkingOut || items.length === 0}
                className="btn-accent disabled:opacity-50 w-full sm:w-auto"
              >
                {checkingOut ? 'Creating Order...' : 'Proceed to Payment'}
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
