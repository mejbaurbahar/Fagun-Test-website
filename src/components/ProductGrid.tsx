import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, Search, FilterX } from 'lucide-react';
import { Product, Category, Currency } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  currentCategory: Category;
  onSelectCategory: (cat: Category) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currency: Currency;
  onQuickAdd: (product: Product, size?: string) => void;
  onViewDetails: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  currentCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  currency,
  onQuickAdd,
  onViewDetails,
  wishlistIds,
  onToggleWishlist
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(1200);

  const categories: Category[] = ['All', 'Clothing', 'Accessories', 'Footwear', 'New Arrivals', 'Sale'];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (currentCategory === 'New Arrivals') {
          if (p.badge !== 'New' && p.badge !== 'Featured') return false;
        } else if (currentCategory === 'Sale') {
          if (!p.originalPrice || p.originalPrice <= p.price) return false;
        } else if (currentCategory !== 'All') {
          if (p.category !== currentCategory) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const nameMatch = p.name.toLowerCase().includes(q);
          const descMatch = p.description.toLowerCase().includes(q);
          const catMatch = p.category.toLowerCase().includes(q);
          if (!nameMatch && !descMatch && !catMatch) return false;
        }

        // Price filter
        if (p.price > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // 'featured'
      });
  }, [products, currentCategory, searchQuery, maxPrice, sortBy]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Category Pills & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-neutral-800">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                currentCategory === cat
                  ? 'bg-[var(--accent-lime)] text-[var(--accent-lime-ink)] shadow-md'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Controls: Price Range Slider & Sorting */}
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Price Range Filter */}
          <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-1.5 text-xs">
            <span className="text-neutral-400">Max Price:</span>
            <input
              type="range"
              min="200"
              max="1200"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-24 sm:w-32 accent-[var(--accent-lime)] cursor-pointer"
            />
            <span className="font-mono text-white font-semibold">${maxPrice}</span>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-full px-3 py-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white outline-none font-medium cursor-pointer"
            >
              <option value="featured" className="bg-neutral-900 text-white">Sort by Featured</option>
              <option value="price-asc" className="bg-neutral-900 text-white">Price: Low to High</option>
              <option value="price-desc" className="bg-neutral-900 text-white">Price: High to Low</option>
              <option value="rating" className="bg-neutral-900 text-white">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Meta Info */}
      <div className="flex items-center justify-between py-4 text-xs text-neutral-400">
        <div>
          Showing <span className="text-white font-medium">{filteredProducts.length}</span> items
          {currentCategory !== 'All' && <span> in <strong className="text-white">{currentCategory}</strong></span>}
          {searchQuery && <span> matching "<strong className="text-[var(--accent-lime)]">{searchQuery}</strong>"</span>}
        </div>

        {(searchQuery || maxPrice < 1200 || currentCategory !== 'All') && (
          <button
            onClick={() => {
              onSelectCategory('All');
              onSearchChange('');
              setMaxPrice(1200);
            }}
            className="flex items-center gap-1 text-[var(--accent-lime)] hover:underline"
          >
            <FilterX className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              onQuickAdd={onQuickAdd}
              onViewDetails={onViewDetails}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
          <Search className="w-12 h-12 text-neutral-500 mx-auto" />
          <h3 className="font-serif text-2xl text-white">No Products Found</h3>
          <p className="text-neutral-400 text-xs max-w-md mx-auto">
            We couldn't find anything matching your search criteria. Try adjusting your filters or search query.
          </p>
          <button
            onClick={() => {
              onSelectCategory('All');
              onSearchChange('');
              setMaxPrice(1200);
            }}
            className="bg-[var(--accent-lime)] text-[var(--accent-lime-ink)] px-5 py-2.5 rounded-full text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            View All Products
          </button>
        </div>
      )}
    </section>
  );
};
