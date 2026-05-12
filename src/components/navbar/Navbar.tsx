'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCartStore } from '@/lib/store';
import CartSlideout from '@/components/cart/CartSlideout';
import { ShoppingCart, Search, User, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-300 to-amber-400 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow duration-200">
                  <span className="text-slate-950 font-bold text-sm sm:text-base">Λ</span>
                </div>
                <span className="text-lg sm:text-xl font-display font-bold text-amber-300 hidden sm:inline">
                  LunaTech
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                href="/"
                className="px-3 py-2 text-sm text-slate-300 hover:text-amber-300 transition-colors duration-200"
              >
                Catalog
              </Link>
              <a
                href="#"
                className="px-3 py-2 text-sm text-slate-300 hover:text-amber-300 transition-colors duration-200"
              >
                About
              </a>
              <a
                href="#"
                className="px-3 py-2 text-sm text-slate-300 hover:text-amber-300 transition-colors duration-200"
              >
                Support
              </a>
            </div>

            {/* Search & Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search */}
              <div className="hidden sm:flex items-center">
                {isSearchActive ? (
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search products..."
                    className="bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/50 w-32 lg:w-48 transition-all duration-200"
                    onBlur={() => setIsSearchActive(false)}
                  />
                ) : (
                  <button
                    onClick={() => setIsSearchActive(true)}
                    className="p-2 text-slate-400 hover:text-amber-300 transition-colors duration-200"
                  >
                    <Search size={20} />
                  </button>
                )}
              </div>

              {/* Account */}
              <button className="hidden sm:flex p-2 text-slate-400 hover:text-amber-300 transition-colors duration-200">
                <User size={20} />
              </button>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-slate-400 hover:text-amber-300 transition-colors duration-200"
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-amber-300 transition-colors duration-200"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 py-4 space-y-2">
              <Link
                href="/"
                className="block px-3 py-2 text-sm text-slate-300 hover:text-amber-300 hover:bg-slate-900/30 rounded transition-colors duration-200"
              >
                Catalog
              </Link>
              <a
                href="#"
                className="block px-3 py-2 text-sm text-slate-300 hover:text-amber-300 hover:bg-slate-900/30 rounded transition-colors duration-200"
              >
                About
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-sm text-slate-300 hover:text-amber-300 hover:bg-slate-900/30 rounded transition-colors duration-200"
              >
                Support
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Cart Slideout */}
      <CartSlideout isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Spacer for fixed navbar */}
      <div className="h-16 sm:h-20" />
    </>
  );
}
