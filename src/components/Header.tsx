import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, User, SlidersHorizontal, ArrowRight, X } from 'lucide-react';
import { Category, Currency } from '../types';
import { CURRENCY_RATES } from '../data/products';

interface HeaderProps {
  currentCategory: Category;
  onSelectCategory: (cat: Category) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onNavigateCheckout: () => void;
  onNavigateHome: () => void;
  currentView: 'shop' | 'checkout' | 'confirmation';
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  currency,
  onCurrencyChange,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onNavigateCheckout,
  onNavigateHome,
  currentView
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories: Category[] = ['All', 'Clothing', 'Accessories', 'Footwear', 'New Arrivals', 'Sale'];

  return (
    <header className="sticky top-0 z-40 bg-[var(--neutral-950)]/90 backdrop-blur-md border-b border-[rgba(255,255,255,0.08)]">
      {/* Top Banner Announcement */}
      <div className="bg-[var(--accent-lime)] text-[var(--accent-lime-ink)] text-xs font-semibold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <span>✨ Complimentary Express Worldwide Shipping on Orders Over $150</span>
        <span className="hidden sm:inline opacity-75">| Use code <strong className="underline">FAGUN10</strong> for 10% Off</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-300 hover:text-white"
              aria-label="Toggle Navigation"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>

            <button 
              onClick={onNavigateHome}
              className="text-left group flex flex-col"
            >
              <span className="font-serif text-2xl sm:text-3xl tracking-tight text-white group-hover:text-[var(--accent-lime)] transition-colors">
                FAGUN
              </span>
              <span className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase font-medium">
                Luxury Atelier
              </span>
            </button>
          </div>

          {/* Navigation Links - Desktop */}
          {currentView === 'shop' && (
            <nav className="hidden lg:flex items-center space-x-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`text-sm tracking-wide font-medium transition-colors relative py-1 ${
                    currentCategory === cat 
                      ? 'text-[var(--accent-lime)] font-semibold' 
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {cat}
                  {currentCategory === cat && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--accent-lime)] rounded-full" />
                  )}
                </button>
              ))}
            </nav>
          )}

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            
            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as Currency)}
              className="bg-neutral-900 text-neutral-200 border border-neutral-700 rounded px-2.5 py-1.5 text-xs font-mono focus:border-[var(--accent-lime)] outline-none cursor-pointer hover:bg-neutral-800"
            >
              {Object.keys(CURRENCY_RATES).map((code) => (
                <option key={code} value={code} className="bg-neutral-900 text-white">
                  {code} ({CURRENCY_RATES[code].symbol})
                </option>
              ))}
            </select>

            {/* Quick Search Toggle */}
            {currentView === 'shop' && (
              <div className="relative">
                {isSearchOpen ? (
                  <div className="flex items-center bg-neutral-900 border border-neutral-700 rounded-full px-3 py-1 animate-fadeIn">
                    <Search className="w-4 h-4 text-neutral-400 mr-2" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="bg-transparent text-xs text-white placeholder-neutral-500 outline-none w-32 sm:w-48"
                      autoFocus
                    />
                    <button 
                      onClick={() => { setIsSearchOpen(false); onSearchChange(''); }}
                      className="text-neutral-400 hover:text-white ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-neutral-300 hover:text-white rounded-full hover:bg-neutral-800/80 transition-colors"
                    title="Search"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-neutral-300 hover:text-white rounded-full hover:bg-neutral-800/80 transition-colors"
              title="Saved Items"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-white hover:text-[var(--accent-lime)] bg-neutral-900 border border-neutral-800 rounded-full px-3 py-2 flex items-center gap-2 hover:bg-neutral-800 transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[var(--accent-lime)]" />
              <span className="text-xs font-semibold">{cartCount}</span>
            </button>

            {/* Checkout Quick Action */}
            {cartCount > 0 && currentView !== 'checkout' && (
              <button
                onClick={onNavigateCheckout}
                className="hidden sm:flex items-center gap-1.5 bg-[var(--accent-lime)] text-[var(--accent-lime-ink)] px-4 py-2 rounded-full text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[var(--neutral-900)] border-b border-neutral-800 px-4 py-4 space-y-2">
          <div className="text-xs uppercase font-semibold text-neutral-400 mb-2">Categories</div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded text-sm ${
                  currentCategory === cat 
                    ? 'bg-[var(--accent-lime)] text-[var(--accent-lime-ink)] font-medium'
                    : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
