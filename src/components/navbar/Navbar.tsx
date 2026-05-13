'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import CartSlideout from '@/components/cart/CartSlideout';
import { ShoppingCart, Search, User, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const itemCount = useCartStore((state) => state.getItemCount());

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchValue.trim();
    router.push(query ? `/?q=${encodeURIComponent(query)}` : '/');
    setIsSearchActive(false);
    setIsMobileMenuOpen(false);
  };

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
                <span className="text-base sm:text-lg font-display font-bold text-amber-300 hidden sm:inline">
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
              <Link
                href="/about"
                className="px-3 py-2 text-sm text-slate-300 hover:text-amber-300 transition-colors duration-200"
              >
                About
              </Link>
              <Link
                href="/support"
                className="px-3 py-2 text-sm text-slate-300 hover:text-amber-300 transition-colors duration-200"
              >
                Support
              </Link>
            </div>

            {/* Search & Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search */}
              <div className="hidden sm:flex items-center">
                {isSearchActive ? (
                  <form onSubmit={handleSearch}>
                    <input
                      autoFocus
                      type="text"
                      value={searchValue}
                      placeholder="Search products..."
                      className="bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/50 w-32 lg:w-48 transition-all duration-200"
                      onChange={(event) => setSearchValue(event.target.value)}
                      onBlur={() => !searchValue.trim() && setIsSearchActive(false)}
                    />
                  </form>
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
              <Link
                href="/account"
                className="hidden sm:flex p-2 text-slate-400 hover:text-amber-300 transition-colors duration-200"
                aria-label="Account"
              >
                <User size={20} />
              </Link>

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
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-slate-300 hover:text-amber-300 hover:bg-slate-900/30 rounded transition-colors duration-200"
              >
                About
              </Link>
              <Link
                href="/support"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-slate-300 hover:text-amber-300 hover:bg-slate-900/30 rounded transition-colors duration-200"
              >
                Support
              </Link>
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-slate-300 hover:text-amber-300 hover:bg-slate-900/30 rounded transition-colors duration-200"
              >
                Account
              </Link>
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
