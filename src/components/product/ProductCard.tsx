'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { Product } from '@/types';
import { useCartStore } from '@/lib/store';
import { usePressHandlers } from '@/lib/usePressHandlers';
import { ShoppingCart, Sparkles } from 'lucide-react';
import ProductImage from './ProductImage';

interface ProductCardProps {
  product: Product;
  imageLoading?: 'eager' | 'lazy';
}

export default function ProductCard({
  product,
  imageLoading = 'lazy',
}: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error("This product is out of stock.");
      return;
    }

    setIsAdding(true);
    addItem(product, 1);
    toast.success(`${product.name} added to cart.`);

    setTimeout(() => {
      setIsAdding(false);
    }, 300);
  };
  const addToCartPressHandlers = usePressHandlers<HTMLButtonElement>(
    handleAddToCart,
    {
      disabled: product.stock === 0 || isAdding,
    },
  );

  return (
    <div className="product-hover-group group h-full">
      {/* Card Container */}
      <div className="product-hover-card glass h-full overflow-hidden rounded-lg flex flex-col shadow-2xl shadow-black/25">
        {/* Image Container */}
        <Link href={`/products/${product.id}`}>
          <div className="relative w-full aspect-square bg-gradient-to-br from-slate-900 to-black overflow-hidden cursor-pointer">
            {/* Limited Badge */}
            {product.isLimited && (
              <div className="absolute top-3 right-3 z-10 bg-amber-300/95 backdrop-blur-sm text-slate-950 px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-lg shadow-black/20">
                <Sparkles size={12} />
                <span className="text-[0.64rem] font-bold uppercase tracking-[0.12em]">Limited</span>
              </div>
            )}

            {/* Image */}
            <ProductImage
              src={product.image}
              alt={product.name}
              category={product.category}
              className="product-hover-image"
              loading={imageLoading}
            />

            {/* Overlay on Hover */}
            <div className="product-hover-overlay absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
            <div className="product-hover-cta absolute inset-x-4 bottom-4">
              <span className="inline-flex rounded-full border border-amber-300/30 bg-slate-950/70 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-amber-200 backdrop-blur">
                View details
              </span>
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 p-3.5 flex flex-col justify-between">
          {/* Product Info */}
          <div>
            {/* Category */}
            <p className="text-[0.62rem] font-semibold text-amber-300/70 uppercase tracking-[0.18em] mb-2">
              {product.category}
            </p>

            {/* Name */}
            <Link href={`/products/${product.id}`}>
              <h3 className="text-[0.82rem] font-semibold leading-snug text-slate-100 line-clamp-2 hover:text-amber-300 transition-colors duration-200 mb-2">
                {product.name}
              </h3>
            </Link>

            {/* Stock Status */}
            <p className="text-[0.72rem] text-slate-500">
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
          <div className="mt-3 space-y-2.5 border-t border-white/5 pt-3">
            {/* Price */}
            <div className="flex items-baseline justify-between">
              <span className="text-lg sm:text-xl font-bold text-amber-300">
                ${product.price.toLocaleString()}
              </span>
            </div>

            {/* Add to Cart Button */}
            <button
              {...addToCartPressHandlers}
              disabled={product.stock === 0 || isAdding}
              className="w-full py-2.5 bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 active:scale-95"
            >
              <ShoppingCart size={15} />
              <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

