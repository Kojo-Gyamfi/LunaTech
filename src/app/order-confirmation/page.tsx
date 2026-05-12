'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { CheckCircle, Package, Truck, Clock } from 'lucide-react';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const items = useCartStore((state) => state.items);

  // Calculate order details
  const subtotal = useCartStore((state) => state.getSubtotal());
  const shipping = useCartStore((state) => state.getShipping());
  const tax = useCartStore((state) => state.getTax());
  const total = useCartStore((state) => state.getCartTotal());

  // Generate estimated delivery date (5-7 business days)
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 6);

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <CheckCircle size={64} className="text-emerald-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg text-slate-400 mb-2">
            Thank you for your purchase.
          </p>
          <p className="text-sm text-slate-500">
            Order ID: <span className="font-mono font-semibold">{orderId || 'LUNA-' + Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </p>
        </div>

        {/* Order Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {/* Order Placed */}
          <div className="glass rounded-xl p-6 text-center">
            <CheckCircle size={32} className="text-emerald-500 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-100 mb-1">Order Placed</h3>
            <p className="text-sm text-slate-500">
              {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Processing */}
          <div className="glass rounded-xl p-6 text-center opacity-60">
            <Package size={32} className="text-slate-600 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-300 mb-1">Processing</h3>
            <p className="text-sm text-slate-600">1-2 business days</p>
          </div>

          {/* Delivery */}
          <div className="glass rounded-xl p-6 text-center opacity-60">
            <Truck size={32} className="text-slate-600 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-300 mb-1">Delivery</h3>
            <p className="text-sm text-slate-600">
              {estimatedDelivery.toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="glass rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">
            Order Summary
          </h2>

          {/* Items */}
          <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold text-slate-100">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-amber-300">
                  ${(item.product.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-2 text-sm mb-6">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Shipping</span>
              <span>${shipping.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Tax</span>
              <span>${tax.toLocaleString()}</span>
            </div>
            <div className="border-t border-white/10 pt-2 flex justify-between font-semibold text-slate-100">
              <span>Total</span>
              <span className="text-2xl text-amber-300">
                ${total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-start space-x-3">
            <Clock size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300 mb-1">
                Estimated Delivery
              </p>
              <p className="text-sm text-slate-400">
                Your order should arrive by{' '}
                <span className="font-semibold text-amber-300">
                  {estimatedDelivery.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="glass rounded-xl p-8 mb-8">
          <h3 className="text-xl font-bold text-slate-100 mb-4">Next Steps</h3>
          <ul className="space-y-3 text-slate-400">
            <li className="flex items-start space-x-3">
              <span className="text-amber-300 font-bold flex-shrink-0">1.</span>
              <span>
                A confirmation email has been sent to your email address with order details.
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-amber-300 font-bold flex-shrink-0">2.</span>
              <span>
                Your order will be processed and prepared for shipment within 1-2 business days.
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-amber-300 font-bold flex-shrink-0">3.</span>
              <span>
                You'll receive a shipping notification with tracking information.
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-amber-300 font-bold flex-shrink-0">4.</span>
              <span>
                We offer free returns within 30 days if you're not completely satisfied.
              </span>
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 px-6 py-3 bg-amber-400 text-slate-950 font-semibold rounded-lg hover:bg-amber-300 transition-all duration-200 text-center"
          >
            Continue Shopping
          </Link>
          <a
            href="#"
            className="flex-1 px-6 py-3 border border-white/10 text-slate-300 font-semibold rounded-lg hover:bg-slate-800/50 transition-all duration-200 text-center"
          >
            View Order Details
          </a>
        </div>

        {/* Support */}
        <div className="mt-12 p-6 bg-slate-900/30 border border-white/5 rounded-xl text-center">
          <p className="text-slate-400 mb-3">
            Questions about your order?
          </p>
          <a
            href="#"
            className="text-amber-300 hover:text-amber-200 font-semibold transition-colors duration-200"
          >
            Contact our support team →
          </a>
        </div>
      </div>
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-slate-400">Loading...</p></div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
