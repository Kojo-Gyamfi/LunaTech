'use client';

import { useEffect, useMemo, useState } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { mockProducts, categories, priceRanges } from '@/lib/mockData';
import { ChevronDown, Search, X } from 'lucide-react';

type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular';

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Products');
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const syncQuery = () => {
      setSearchQuery(new URLSearchParams(window.location.search).get('q') ?? '');
    };

    syncQuery();
    window.addEventListener('popstate', syncQuery);
    return () => window.removeEventListener('popstate', syncQuery);
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...mockProducts];

    if (selectedCategory !== 'All Products') {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const normalizedQuery = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((product) =>
        [product.name, product.category, product.description]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)
      );
    }

    if (selectedPriceRange !== null) {
      const range = priceRanges[selectedPriceRange];
      filtered = filtered.filter(
        (product) => product.price >= range.min && product.price <= range.max
      );
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => Number(b.isLimited) - Number(a.isLimited) || b.stock - a.stock);
        break;
      case 'newest':
      default:
        break;
    }

    return filtered;
  }, [selectedCategory, selectedPriceRange, searchQuery, sortBy]);

  return (
    <main className="min-h-screen bg-slate-950">
      <section className="relative overflow-hidden px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(251,191,36,0.16),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(34,211,238,0.10),transparent_26%)]" />
        <div className="relative mx-auto max-w-7xl text-center">
          <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-amber-200/70">
            Signature Collection
          </p>
          <h1 className="mb-4 text-3xl font-bold text-gradient sm:text-4xl lg:text-5xl">
            Premium Tech Collection
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-400 sm:text-base">
            Curated luxury electronics and gadgets for the discerning tech enthusiast.
          </p>
        </div>
      </section>

      <section className="sticky top-20 z-30 border-b border-white/5 bg-slate-950/95 px-4 py-4 backdrop-blur-md sm:top-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search collection"
                className="w-full rounded-lg border border-white/10 bg-slate-900/50 py-2 pl-9 pr-8 text-sm text-slate-100 outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-amber-300/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-200"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-slate-900/50 px-4 py-2 text-left text-slate-200 transition-colors duration-200 hover:border-white/20"
              >
                <span className="text-sm font-medium">{selectedCategory}</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    isCategoryDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-lg border border-white/10 bg-slate-900 shadow-xl">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors duration-200 hover:bg-slate-800/50 ${
                        selectedCategory === category
                          ? 'bg-amber-400/10 font-semibold text-amber-300'
                          : 'text-slate-300'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setIsPriceDropdownOpen(!isPriceDropdownOpen)}
                className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-slate-900/50 px-4 py-2 text-left text-slate-200 transition-colors duration-200 hover:border-white/20"
              >
                <span className="text-sm font-medium">
                  {selectedPriceRange !== null ? priceRanges[selectedPriceRange].label : 'All Prices'}
                </span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    isPriceDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isPriceDropdownOpen && (
                <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-lg border border-white/10 bg-slate-900 shadow-xl">
                  <button
                    onClick={() => {
                      setSelectedPriceRange(null);
                      setIsPriceDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors duration-200 hover:bg-slate-800/50 ${
                      selectedPriceRange === null
                        ? 'bg-amber-400/10 font-semibold text-amber-300'
                        : 'text-slate-300'
                    }`}
                  >
                    All Prices
                  </button>
                  {priceRanges.map((range, index) => (
                    <button
                      key={range.label}
                      onClick={() => {
                        setSelectedPriceRange(index);
                        setIsPriceDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors duration-200 hover:bg-slate-800/50 ${
                        selectedPriceRange === index
                          ? 'bg-amber-400/10 font-semibold text-amber-300'
                          : 'text-slate-300'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-slate-900/50 px-4 py-2 text-left text-slate-200 transition-colors duration-200 hover:border-white/20"
              >
                <span className="text-sm font-medium">
                  Sort:{' '}
                  {sortBy === 'newest'
                    ? 'Newest'
                    : sortBy === 'price-low'
                    ? 'Price: Low to High'
                    : sortBy === 'price-high'
                    ? 'Price: High to Low'
                    : 'Popular'}
                </span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    isSortDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isSortDropdownOpen && (
                <div className="absolute right-0 top-full z-40 mt-2 min-w-48 overflow-hidden rounded-lg border border-white/10 bg-slate-900 shadow-xl">
                  {[
                    { value: 'newest' as SortOption, label: 'Newest' },
                    { value: 'price-low' as SortOption, label: 'Price: Low to High' },
                    { value: 'price-high' as SortOption, label: 'Price: High to Low' },
                    { value: 'popular' as SortOption, label: 'Most Popular' },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => {
                        setSortBy(value);
                        setIsSortDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors duration-200 hover:bg-slate-800/50 ${
                        sortBy === value
                          ? 'bg-amber-400/10 font-semibold text-amber-300'
                          : 'text-slate-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {(selectedCategory !== 'All Products' || selectedPriceRange !== null || searchQuery) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="flex items-center space-x-1 rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300 transition-colors duration-200 hover:bg-slate-700"
                >
                  <span>Search: {searchQuery}</span>
                  <span>x</span>
                </button>
              )}
              {selectedCategory !== 'All Products' && (
                <button
                  onClick={() => setSelectedCategory('All Products')}
                  className="flex items-center space-x-1 rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300 transition-colors duration-200 hover:bg-slate-700"
                >
                  <span>{selectedCategory}</span>
                  <span>x</span>
                </button>
              )}
              {selectedPriceRange !== null && (
                <button
                  onClick={() => setSelectedPriceRange(null)}
                  className="flex items-center space-x-1 rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300 transition-colors duration-200 hover:bg-slate-700"
                >
                  <span>{priceRanges[selectedPriceRange].label}</span>
                  <span>x</span>
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {filteredProducts.length > 0 ? (
            <>
              <p className="mb-6 text-sm text-slate-400">
                Showing {filteredProducts.length} product
                {filteredProducts.length !== 1 ? 's' : ''}
              </p>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="py-16 text-center">
              <p className="mb-4 text-lg text-slate-400">
                No products found matching your filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All Products');
                  setSelectedPriceRange(null);
                  setSearchQuery('');
                }}
                className="rounded-lg bg-amber-400 px-6 py-2 font-semibold text-slate-950 transition-all duration-200 hover:bg-amber-300"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
