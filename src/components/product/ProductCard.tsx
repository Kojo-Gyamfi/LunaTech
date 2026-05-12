'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Product } from '@/types';
import { useCartStore } from '@/lib/store';
import { ShoppingCart, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product, 1);
    setShowNotification(true);

    setTimeout(() => {
      setIsAdding(false);
    }, 300);

    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  };

  return (
    <div className="group">
      {/* Card Container */}
      <div className="glass rounded-xl overflow-hidden hover:glass-lg transition-all duration-300 h-full flex flex-col">
        {/* Image Container */}
        <Link href={`/products/${product.id}`}>
          <div className="relative w-full aspect-square bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden cursor-pointer">
            {/* Limited Badge */}
            {product.isLimited && (
              <div className="absolute top-3 right-3 z-10 bg-amber-400/90 backdrop-blur-sm text-slate-950 px-3 py-1 rounded-full flex items-center space-x-1">
                <Sparkles size={14} />
                <span className="text-xs font-bold">Limited</span>
              </div>
            )}

            {/* Image */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
          {/* Product Info */}
          <div>
            {/* Category */}
            <p className="text-xs font-semibold text-amber-300/70 uppercase tracking-wider mb-2">
              {product.category}
            </p>

            {/* Name */}
            <Link href={`/products/${product.id}`}>
              <h3 className="text-sm sm:text-base font-semibold text-slate-100 line-clamp-2 hover:text-amber-300 transition-colors duration-200 mb-2">
                {product.name}
              </h3>
            </Link>

            {/* Stock Status */}
            <p className="text-xs text-slate-500">
              {product.stock > 0 ? (
                <span className="text-emerald-400">
                  {product.stock} in stock
                </span>
              ) : (
                <span className="text-red-400">Out of stock</span>
              )}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-4 space-y-3 border-t border-white/5 pt-4">
            {/* Price */}
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-bold text-amber-300">
                ${product.price.toLocaleString()}
              </span>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
              className="w-full py-2.5 sm:py-3 bg-amber-400 text-slate-950 font-semibold rounded-lg hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 active:scale-95"
            >
              <ShoppingCart size={18} />
              <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
            </button>

            {/* Notification */}
            {showNotification && (
              <div className="text-xs text-emerald-400 font-semibold text-center animate-pulse">
                ✓ Added to cart
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
