import Link from 'next/link';
import { mockProducts, categories } from '@/lib/mockData';
import { Gem, ShieldCheck, Sparkles, Truck } from 'lucide-react';

export default function AboutPage() {
  const limitedCount = mockProducts.filter((product) => product.isLimited).length;
  const productCount = mockProducts.length;
  const categoryCount = categories.length - 1;

  return (
    <main className="min-h-screen bg-slate-950">
      <section className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(251,191,36,0.14),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.09),transparent_28%)]" />
        <div className="relative mx-auto max-w-5xl">
          <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-amber-200/70">
            About LunaTech
          </p>
          <h1 className="mb-5 text-3xl font-bold text-slate-100 sm:text-4xl">
            Curated technology with a quieter kind of luxury.
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
            LunaTech brings together premium audio, mobile, and desk technology for people who care about
            craft, reliability, and a refined buying experience.
          </p>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: 'Products', value: productCount },
            { label: 'Categories', value: categoryCount },
            { label: 'Limited Pieces', value: limitedCount },
          ].map((item) => (
            <div key={item.label} className="glass rounded-lg p-5">
              <p className="text-3xl font-bold text-amber-300">{item.value}</p>
              <p className="text-sm text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
          {[
            {
              icon: Gem,
              title: 'Premium Materials',
              copy: 'Each product is selected for industrial design, long-term durability, and everyday feel.',
            },
            {
              icon: ShieldCheck,
              title: 'Protected Purchases',
              copy: 'Every order includes warranty coverage, secure checkout, and a 30-day return window.',
            },
            {
              icon: Truck,
              title: 'Fast Fulfillment',
              copy: 'Orders ship quickly with transparent delivery estimates from confirmation to arrival.',
            },
            {
              icon: Sparkles,
              title: 'Limited Drops',
              copy: 'Small-run audio and accessory releases add rarity without making the store hard to use.',
            },
          ].map(({ icon: Icon, title, copy }) => (
            <div key={title} className="glass rounded-lg p-5">
              <Icon className="mb-4 text-amber-300" size={26} />
              <h2 className="mb-2 text-lg font-semibold text-slate-100">{title}</h2>
              <p className="text-sm leading-6 text-slate-400">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="px-4 pb-16 text-center sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex rounded-lg bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300"
        >
          Browse the Collection
        </Link>
      </div>
    </main>
  );
}
