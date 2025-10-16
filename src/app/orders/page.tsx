'use client';
import { useEffect, useState } from 'react';
import { secureApi } from '@/utils/api';

import { Order } from '@/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const data = await secureApi.myOrders();
        setOrders(data as Order[]);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Failed to load orders';
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function processPayment(orderId: number) {
    try {
      await secureApi.processPayment(orderId);
      // Reload orders to get updated status
      const data = await secureApi.myOrders();
      setOrders(data as Order[]);
      alert('Payment processed successfully!');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Payment failed';
      alert(msg);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold" style={{color:"var(--accent)"}}>My Orders</h1>
      {orders.length === 0 ? (
        <div>No orders yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Order #{o.id}</div>
                <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <div className="mt-2 space-y-1">
                {o.items.map(it => (
                  <div key={it.id} className="flex items-center justify-between text-sm">
                    <div>{it.productName} x {it.quantity}</div>
                    <div>${(it.unitPrice * it.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="font-semibold">Total: ${o.total.toFixed(2)}</div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    o.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {o.status}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    o.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {o.paymentStatus}
                  </span>
                  {o.paymentStatus === 'pending' && (
                    <button 
                      onClick={() => processPayment(o.id)}
                      className="btn-accent text-xs px-2 py-1"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



