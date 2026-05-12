'use client';

import { useState, useMemo } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { mockProducts, categories, priceRanges } from '@/lib/mockData';
import { ChevronDown } from 'lucide-react';

type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular';

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Products');
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...mockProducts];

    // Category filter
    if (selectedCategory !== 'All Products') {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Price range filter
    if (selectedPriceRange !== null) {
      const range = priceRanges[selectedPriceRange];
      filtered = filtered.filter(
        (product) => product.price >= range.min && product.price <= range.max
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort(() => Math.random() - 0.5); // Mock popularity
        break;
      case 'newest':
      default:
        // Keep original order
        break;
    }

    return filtered;
  }, [selectedCategory, selectedPriceRange, sortBy]);

  return (
    <main className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient mb-4">
            Premium Tech Collection
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
            Curated luxury electronics and gadgets for the discerning tech enthusiast
          </p>
        </div>
      </section>

      {/* Filters and Sorting */}
      <section className="sticky top-20 sm:top-24 z-30 bg-slate-950/95 backdrop-blur-md border-b border-white/5 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-left text-slate-200 hover:border-white/20 transition-colors duration-200 flex items-center justify-between"
              >
                <span className="text-sm font-medium">
                  {selectedCategory}
                </span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    isCategoryDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-slate-900 border border-white/10 rounded-lg overflow-hidden z-40 shadow-xl">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-800/50 transition-colors duration-200 ${
                        selectedCategory === category
                          ? 'bg-amber-400/10 text-amber-300 font-semibold'
                          : 'text-slate-300'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range Filter */}
            <div className="relative">
              <button
                onClick={() => setSelectedPriceRange(selectedPriceRange === null ? 0 : null)}
                className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-left text-slate-200 hover:border-white/20 transition-colors duration-200 flex items-center justify-between"
              >
                <span className="text-sm font-medium">
                  {selectedPriceRange !== null
                    ? priceRanges[selectedPriceRange].label
                    : 'All Prices'}
                </span>
                <ChevronDown size={18} />
              </button>

              {/* Price dropdown would go here */}
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-left text-slate-200 hover:border-white/20 transition-colors duration-200 flex items-center justify-between"
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
                <div className="absolute top-full mt-2 right-0 bg-slate-900 border border-white/10 rounded-lg overflow-hidden z-40 shadow-xl min-w-48">
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
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-800/50 transition-colors duration-200 ${
                        sortBy === value
                          ? 'bg-amber-400/10 text-amber-300 font-semibold'
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

          {/* Active Filters Display */}
          {(selectedCategory !== 'All Products' || selectedPriceRange !== null) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedCategory !== 'All Products' && (
                <button
                  onClick={() => setSelectedCategory('All Products')}
                  className="text-xs px-3 py-1 bg-slate-800 text-slate-300 rounded-full hover:bg-slate-700 transition-colors duration-200 flex items-center space-x-1"
                >
                  <span>{selectedCategory}</span>
                  <span>×</span>
                </button>
              )}
              {selectedPriceRange !== null && (
                <button
                  onClick={() => setSelectedPriceRange(null)}
                  className="text-xs px-3 py-1 bg-slate-800 text-slate-300 rounded-full hover:bg-slate-700 transition-colors duration-200 flex items-center space-x-1"
                >
                  <span>{priceRanges[selectedPriceRange].label}</span>
                  <span>×</span>
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length > 0 ? (
            <>
              <p className="text-sm text-slate-400 mb-6">
                Showing {filteredProducts.length} product
                {filteredProducts.length !== 1 ? 's' : ''}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-slate-400 mb-4">
                No products found matching your filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All Products');
                  setSelectedPriceRange(null);
                }}
                className="px-6 py-2 bg-amber-400 text-slate-950 font-semibold rounded-lg hover:bg-amber-300 transition-all duration-200"
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
