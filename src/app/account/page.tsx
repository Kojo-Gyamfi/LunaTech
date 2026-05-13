'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import ProductImage from '@/components/product/ProductImage';
import { PackageCheck, ShoppingBag, UserCircle } from 'lucide-react';

export default function AccountPage() {
  const items = useCartStore((state) => state.items);
  const lastOrder = useCartStore((state) => state.lastOrder);
  const itemCount = useCartStore((state) => state.getItemCount());
  const cartTotal = useCartStore((state) => state.getCartTotal());

  return (
    <main className="min-h-screen bg-slate-950">
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-amber-200/70">
            Account
          </p>
          <h1 className="mb-5 text-3xl font-bold text-slate-100 sm:text-4xl">
            Your LunaTech dashboard
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
            Review your current bag, recent order, and profile preferences from one place.
          </p>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="glass rounded-lg p-5">
            <UserCircle className="mb-4 text-amber-300" size={32} />
            <h2 className="mb-2 text-lg font-semibold text-slate-100">Guest Profile</h2>
            <p className="text-sm leading-6 text-slate-400">
              Demo mode keeps your cart and recent order in this browser.
            </p>
          </div>

          <div className="glass rounded-lg p-5">
            <ShoppingBag className="mb-4 text-amber-300" size={32} />
            <h2 className="mb-2 text-lg font-semibold text-slate-100">Current Bag</h2>
            <p className="text-sm text-slate-400">{itemCount} item{itemCount === 1 ? '' : 's'}</p>
            <p className="mt-1 text-2xl font-bold text-amber-300">${cartTotal.toLocaleString()}</p>
          </div>

          <div className="glass rounded-lg p-5">
            <PackageCheck className="mb-4 text-amber-300" size={32} />
            <h2 className="mb-2 text-lg font-semibold text-slate-100">Recent Order</h2>
            <p className="text-sm text-slate-400">{lastOrder?.id ?? 'No orders yet'}</p>
            <p className="mt-1 text-2xl font-bold text-amber-300">
              ${(lastOrder?.total ?? 0).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mx-auto mt-6 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="glass rounded-lg p-5 sm:p-6">
            <h2 className="mb-5 text-lg font-semibold text-slate-100">Bag Items</h2>
            {items.length > 0 ? (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-900">
                      <ProductImage
                        src={item.product.image}
                        alt={item.product.name}
                        category={item.product.category}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-100">{item.product.name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-amber-300">
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Your bag is empty.</p>
            )}
            <Link
              href="/"
              className="mt-5 inline-flex rounded-lg bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300"
            >
              Shop Products
            </Link>
          </div>

          <div className="glass rounded-lg p-5 sm:p-6">
            <h2 className="mb-5 text-lg font-semibold text-slate-100">Last Order</h2>
            {lastOrder ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Placed</span>
                  <span>{new Date(lastOrder.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Items</span>
                  <span>{lastOrder.items.length}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Delivery</span>
                  <span>{new Date(lastOrder.estimatedDelivery).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-3 font-semibold text-slate-100">
                  <span>Total</span>
                  <span className="text-amber-300">${lastOrder.total.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400">Complete checkout to see order history here.</p>
            )}
            <Link
              href="/support"
              className="mt-5 inline-flex rounded-lg border border-white/10 px-5 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800/50"
            >
              Need Help?
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
