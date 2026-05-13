"use client";

import { use } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import ProductImage from "@/components/product/ProductImage";
import {
  ChevronLeft,
  Clock,
  CreditCard,
  MapPin,
  PackageCheck,
  Truck,
} from "lucide-react";

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailsPage({
  params: paramsPromise,
}: OrderDetailsPageProps) {
  const { id } = use(paramsPromise);
  const lastOrder = useCartStore((state) => state.lastOrder);
  const orderMatches = lastOrder && (id === lastOrder.id || id === "latest");

  if (!orderMatches) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="max-w-md text-center">
          <PackageCheck className="mx-auto mb-5 text-slate-600" size={48} />
          <h1 className="mb-3 text-2xl font-bold text-slate-100">
            Order details unavailable
          </h1>
          <p className="mb-6 text-sm text-slate-400">
            This demo stores your most recent order in this browser. Place an
            order or open the latest order from your account dashboard.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/account"
              className="rounded-lg bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-950 transition-all duration-200 hover:bg-amber-300"
            >
              Go to Account
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-white/10 px-5 py-2 text-sm font-semibold text-slate-300 transition-all duration-200 hover:bg-slate-800/50"
            >
              Shop Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const orderDate = new Date(lastOrder.createdAt);
  const deliveryDate = new Date(lastOrder.estimatedDelivery);

  return (
    <main className="min-h-screen bg-slate-950">
      <section className="border-b border-white/5 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-300 transition-colors duration-200 hover:text-amber-200"
          >
            <ChevronLeft size={18} />
            Account
          </Link>
          <p className="text-right text-xs uppercase tracking-[0.22em] text-slate-500">
            Order Details
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-amber-200/70">
                {lastOrder.id}
              </p>
              <h1 className="text-3xl font-bold text-slate-100 sm:text-4xl">
                Ordered products
              </h1>
            </div>
            <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-300">
              Processing
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="glass rounded-lg p-5">
              <PackageCheck className="mb-3 text-emerald-400" size={28} />
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Placed
              </p>
              <p className="mt-1 font-semibold text-slate-100">
                {orderDate.toLocaleDateString()}
              </p>
            </div>
            <div className="glass rounded-lg p-5">
              <Truck className="mb-3 text-amber-300" size={28} />
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Estimated delivery
              </p>
              <p className="mt-1 font-semibold text-slate-100">
                {deliveryDate.toLocaleDateString()}
              </p>
            </div>
            <div className="glass rounded-lg p-5">
              <CreditCard className="mb-3 text-amber-300" size={28} />
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Total paid
              </p>
              <p className="mt-1 text-2xl font-bold text-amber-300">
                ${lastOrder.total.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {lastOrder.items.map((item) => (
                <article
                  key={item.product.id}
                  className="glass rounded-lg p-4 transition-[transform,border-color,background-color] duration-300 ease-out hover:-translate-y-1 hover:border-amber-300/30 hover:bg-white/[0.075] sm:p-5"
                >
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <Link
                      href={`/products/${item.product.id}`}
                      className="group relative aspect-square w-full overflow-hidden rounded-lg bg-slate-900 sm:w-36 sm:flex-shrink-0"
                    >
                      <ProductImage
                        src={item.product.image}
                        alt={item.product.name}
                        category={item.product.category}
                        className="transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300/70">
                            {item.product.category}
                          </p>
                          <Link href={`/products/${item.product.id}`}>
                            <h2 className="text-xl font-bold text-slate-100 transition-colors duration-200 hover:text-amber-300">
                              {item.product.name}
                            </h2>
                          </Link>
                        </div>
                        <p className="text-lg font-bold text-amber-300">
                          $
                          {(
                            item.product.price * item.quantity
                          ).toLocaleString()}
                        </p>
                      </div>
                      <p className="mb-4 text-sm leading-6 text-slate-400">
                        {item.product.description}
                      </p>
                      <div className="mb-4 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full border border-white/10 px-3 py-1 text-slate-300">
                          Qty {item.quantity}
                        </span>
                        <span className="rounded-full border border-white/10 px-3 py-1 text-slate-300">
                          ${item.product.price.toLocaleString()} each
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {Object.entries(item.product.specs)
                          .slice(0, 4)
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="rounded-lg border border-white/5 bg-slate-900/40 p-3"
                            >
                              <p className="text-xs text-slate-500">{key}</p>
                              <p className="text-sm font-semibold text-slate-200">
                                {value}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="space-y-6">
              <div className="glass rounded-lg p-5">
                <h2 className="mb-4 text-lg font-semibold text-slate-100">
                  Delivery Address
                </h2>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 text-amber-300" size={20} />
                  <div className="text-sm text-slate-400">
                    <p className="font-semibold text-slate-200">
                      {lastOrder.customerInfo.firstName}{" "}
                      {lastOrder.customerInfo.lastName}
                    </p>
                    <p>{lastOrder.shippingAddress.street}</p>
                    <p>
                      {lastOrder.shippingAddress.city},{" "}
                      {lastOrder.shippingAddress.state}{" "}
                      {lastOrder.shippingAddress.zip}
                    </p>
                    <p>{lastOrder.shippingAddress.country}</p>
                  </div>
                </div>
              </div>

              <div className="glass rounded-lg p-5">
                <h2 className="mb-4 text-lg font-semibold text-slate-100">
                  Order Total
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span>${(lastOrder.subtotal ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Shipping</span>
                    <span>${(lastOrder.shipping ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Tax</span>
                    <span>${(lastOrder.tax ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-3 font-semibold text-slate-100">
                    <span>Total</span>
                    <span className="text-2xl text-amber-300">
                      ${lastOrder.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-5">
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 flex-shrink-0 text-amber-300" size={20} />
                  <p className="text-sm text-slate-300">
                    We will email tracking details to{" "}
                    <span className="font-semibold text-amber-200">
                      {lastOrder.customerInfo.email}
                    </span>{" "}
                    when the order ships.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
