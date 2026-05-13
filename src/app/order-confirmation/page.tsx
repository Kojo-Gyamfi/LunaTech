"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import ProductImage from "@/components/product/ProductImage";
import { CheckCircle, Clock, Package, Truck } from "lucide-react";

const fallbackOrderDate = new Date("2026-05-12T12:00:00Z");
const fallbackDeliveryDate = new Date("2026-05-18T12:00:00Z");

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const lastOrder = useCartStore((state) => state.lastOrder);
  const items = lastOrder?.items ?? [];
  const subtotal = lastOrder?.subtotal ?? 0;
  const shipping = lastOrder?.shipping ?? 0;
  const tax = lastOrder?.tax ?? 0;
  const total = lastOrder?.total ?? 0;

  const orderDate = lastOrder?.createdAt
    ? new Date(lastOrder.createdAt)
    : fallbackOrderDate;
  const estimatedDelivery = lastOrder?.estimatedDelivery
    ? new Date(lastOrder.estimatedDelivery)
    : fallbackDeliveryDate;

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle size={56} className="text-emerald-500" />
          </div>
          <h1 className="mb-4 text-3xl font-bold text-slate-100 sm:text-4xl">
            Order Confirmed
          </h1>
          <p className="mb-2 text-base text-slate-400">
            Thank you for your purchase.
          </p>
          <p className="text-sm text-slate-500">
            Order ID:{" "}
            <span className="font-mono font-semibold">
              {orderId || lastOrder?.id || "LUNA-DEMO"}
            </span>
          </p>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="glass rounded-lg p-5 text-center">
            <CheckCircle size={30} className="mx-auto mb-3 text-emerald-500" />
            <h3 className="mb-1 text-sm font-semibold text-slate-100">
              Order Placed
            </h3>
            <p className="text-xs text-slate-500">
              {orderDate.toLocaleDateString()}
            </p>
          </div>
          <div className="glass rounded-lg p-5 text-center opacity-70">
            <Package size={30} className="mx-auto mb-3 text-slate-500" />
            <h3 className="mb-1 text-sm font-semibold text-slate-300">
              Processing
            </h3>
            <p className="text-xs text-slate-600">1-2 business days</p>
          </div>
          <div className="glass rounded-lg p-5 text-center opacity-70">
            <Truck size={30} className="mx-auto mb-3 text-slate-500" />
            <h3 className="mb-1 text-sm font-semibold text-slate-300">
              Delivery
            </h3>
            <p className="text-xs text-slate-600">
              {estimatedDelivery.toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="glass mb-8 rounded-lg p-5 sm:p-8">
          <h2 className="mb-6 text-xl font-bold text-slate-100 sm:text-2xl">
            Order Summary
          </h2>

          <div className="mb-6 space-y-4 border-b border-white/10 pb-6">
            {items.length > 0 ? (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start space-x-4 min-w-0">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-900">
                      <ProductImage
                        src={item.product.image}
                        alt={item.product.name}
                        category={item.product.category}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-100 truncate">
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
              ))
            ) : (
              <p className="text-sm text-slate-400">
                Your order was placed successfully. Visit your account for order
                history.
              </p>
            )}
          </div>

          <div className="mb-6 space-y-2 text-sm">
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
            <div className="flex justify-between border-t border-white/10 pt-2 font-semibold text-slate-100">
              <span>Total</span>
              <span className="text-2xl text-amber-300">
                ${total.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
            <Clock size={20} className="mt-0.5 flex-shrink-0 text-amber-400" />
            <div>
              <p className="mb-1 font-semibold text-amber-300">
                Estimated Delivery
              </p>
              <p className="text-sm text-slate-400">
                Your order should arrive by{" "}
                <span className="font-semibold text-amber-300">
                  {estimatedDelivery.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/"
            className="flex-1 rounded-lg bg-amber-400 px-6 py-3 text-center font-semibold text-slate-950 transition-all duration-200 hover:bg-amber-300"
          >
            Continue Shopping
          </Link>
          <Link
            href={`/orders/${orderId || lastOrder?.id || "latest"}`}
            className="flex-1 rounded-lg border border-white/10 px-6 py-3 text-center font-semibold text-slate-300 transition-all duration-200 hover:bg-slate-800/50"
          >
            View Order Details
          </Link>
        </div>

        <div className="rounded-lg border border-white/5 bg-slate-900/30 p-6 text-center">
          <p className="mb-3 text-slate-400">Questions about your order?</p>
          <Link
            href="/support"
            className="font-semibold text-amber-300 transition-colors duration-200 hover:text-amber-200"
          >
            Contact our support team
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <p className="text-slate-400">Loading...</p>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
