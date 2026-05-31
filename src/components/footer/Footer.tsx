"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  Code2,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";

const shopLinks = [
  { label: "All Products", href: "/" },
  { label: "Headphones", href: "/?q=Headphones" },
  { label: "Smartphones", href: "/?q=Luxury%20Smartphones" },
  { label: "Gaming", href: "/?q=Gaming" },
  { label: "Accessories", href: "/?q=Accessories" },
];

const supportLinks = [
  { label: "About LunaTech", href: "/about" },
  { label: "Support Center", href: "/support" },
  { label: "My Account", href: "/account" },
  { label: "Checkout", href: "/checkout" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    icon: MessageCircle,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    icon: Globe2,
  },
  {
    label: "GitHub",
    href: "https://github.com/",
    icon: Code2,
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast.error("Enter a valid email address.");
      return;
    }

    const subscribers = JSON.parse(
      window.localStorage.getItem("lunatech-subscribers") ?? "[]",
    ) as string[];

    if (!subscribers.includes(trimmedEmail.toLowerCase())) {
      window.localStorage.setItem(
        "lunatech-subscribers",
        JSON.stringify([...subscribers, trimmedEmail.toLowerCase()]),
      );
    }

    toast.success("You are subscribed to LunaTech updates.");
    setEmail("");
  };

  return (
    <footer className="border-t border-white/10 bg-slate-950 px-4 pt-12 sm:px-6 sm:pt-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 pb-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.15fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-300 to-amber-400 text-base font-bold text-slate-950">
                L
              </span>
              <span className="text-lg font-bold text-amber-300">
                LunaTech
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              Premium technology, careful fulfillment, and practical support
              for people who want their gear to feel considered from cart to
              delivery.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Truck size={18} className="text-amber-300" />
                Free insured shipping over $1,000
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <ShieldCheck size={18} className="text-amber-300" />
                Warranty-backed purchases
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-200">
              Shop
            </h2>
            <ul className="mt-4 space-y-3">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-amber-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-200">
              Help
            </h2>
            <ul className="mt-4 space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-amber-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-200">
              Stay Connected
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Get limited drop alerts, product care notes, and private offers.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="min-w-0 flex-1 rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-amber-300/50"
              />
              <button
                type="submit"
                className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300"
                aria-label="Subscribe"
              >
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-5 space-y-3">
              <a
                href="mailto:emmanuelnanagyamfi@gmail.com"
                className="flex items-center gap-3 text-sm text-slate-400 hover:text-amber-300"
              >
                <Mail size={17} />
                emmanuelnanagyamfi@gmail.com
              </a>
              <a
                href="tel:+233559038128"
                className="flex items-center gap-3 text-sm text-slate-400 hover:text-amber-300"
              >
                <Phone size={17} />
                +233 559 038 128
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Accra%2C%20Ghana"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-sm text-slate-400 hover:text-amber-300"
              >
                <MapPin size={17} />
                Accra, Ghana
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            (c) 2026 LunaTech. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:border-amber-300/40 hover:text-amber-300"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
