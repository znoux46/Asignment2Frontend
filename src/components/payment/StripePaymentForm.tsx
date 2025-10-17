'use client';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { secureApi } from '@/utils/api';
import config from '@/config/env';

const stripePromise = loadStripe(config.STRIPE_PUBLISHABLE_KEY || 'pk_test_51SIhyoAxH1mnQEoEMMoKVcoqXARPBoCs7DUlk90zeTGLjAvS5MO4CwdDxyzXXEEeHRa1wNms2Ks0IbHzHKkDU1rj00P53iY50p');

interface StripePaymentFormProps {
  orderId: number;
  amount: number;
  onSuccess: (order: { id: number; total: number }) => void;
  onError: (error: string) => void;
}

function CheckoutForm({ orderId, amount, onSuccess, onError }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  // Debug logging
  console.log('Stripe loaded:', !!stripe);
  console.log('Elements loaded:', !!elements);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Create payment intent
      const { clientSecret, paymentIntentId } = await secureApi.createPaymentIntent(orderId, amount);

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        }
      });

      if (error) {
        onError(error.message || 'Payment failed');
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        const order = await secureApi.confirmPayment(paymentIntentId);
        onSuccess(order);
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (!stripe || !elements) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Loading secure payment form...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border rounded-lg p-4">
        <label className="block text-sm font-medium mb-2">Card Information</label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
}

export default function StripePaymentForm({ orderId, amount, onSuccess, onError }: StripePaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm 
        orderId={orderId} 
        amount={amount} 
        onSuccess={onSuccess} 
        onError={onError} 
      />
    </Elements>
  );
}
