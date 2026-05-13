'use client';

import { use, useState, useMemo } from 'react';
import Link from 'next/link';
import { mockProducts } from '@/lib/mockData';
import { useCartStore } from '@/lib/store';
import ProductCard from '@/components/product/ProductCard';
import ProductImage from '@/components/product/ProductImage';
import { ChevronLeft, ShoppingCart, Sparkles, Check, X, Minus, Plus } from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({
  params: paramsPromise,
}: ProductDetailPageProps) {
  const params = use(paramsPromise);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const addItem = useCartStore((state) => state.addItem);

  // Find product
  const product = useMemo(() => {
    return mockProducts.find((p) => p.id === params.id);
  }, [params]);

  // Related products
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return mockProducts
      .filter(
        (p) =>
          p.category === product.category &&
          p.id !== product.id
      )
      .slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg text-slate-400 mb-4">Product not found.</p>
          <Link
            href="/"
            className="inline-flex rounded-lg bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300"
          >
            Back to Catalog
          </Link>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-950">
      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center space-x-2">
          <Link
            href="/"
            className="flex items-center space-x-1 text-amber-300 hover:text-amber-200 transition-colors duration-200"
          >
            <ChevronLeft size={18} />
            <span>Back to Catalog</span>
          </Link>
        </div>
      </div>

      {/* Product Detail */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden glass">
              <ProductImage
                src={product.images[selectedImageIndex]}
                alt={product.name}
                category={product.category}
              />

              {/* Limited Badge */}
              {product.isLimited && (
                <div className="absolute top-4 right-4 bg-amber-400/90 backdrop-blur-sm text-slate-950 px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Sparkles size={18} />
                  <span className="font-semibold">Limited Edition</span>
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImageIndex === index
                        ? 'border-amber-400'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <ProductImage
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      category={product.category}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between">
            {/* Header */}
            <div className="space-y-4">
              {/* Category */}
              <p className="text-sm font-semibold text-amber-300/70 uppercase tracking-wider">
                {product.category}
              </p>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-100">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline space-x-4 pt-4 border-t border-white/10">
                <span className="text-3xl sm:text-4xl font-bold text-amber-300">
                  ${product.price.toLocaleString()}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                {product.description}
              </p>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                {product.stock > 0 ? (
                  <>
                    <Check size={20} className="text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">
                      In Stock ({product.stock} available)
                    </span>
                  </>
                ) : (
                  <>
                    <X size={20} className="text-red-400" />
                    <span className="text-red-400 font-semibold">
                      Out of Stock
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Specs */}
            <div className="my-8 glass rounded-xl p-6">
              <h3 className="text-base font-semibold text-slate-100 mb-4">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm text-slate-500 mb-1">{key}</p>
                    <p className="text-sm font-semibold text-slate-200">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {/* Quantity Selector */}
                <div className="flex items-center space-x-3 bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-slate-400 hover:text-slate-200 transition-colors duration-200"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-lg font-semibold text-slate-200 w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    disabled={quantity >= product.stock}
                    className="text-slate-400 hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 active:scale-95 ${
                  isAdded
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-400 text-slate-950 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check size={20} />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              {/* Info Text */}
              <p className="text-xs text-slate-500 text-center">
                Free shipping on orders over $500. Returns within 30 days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-100 mb-8">
              Related Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
