import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Category } from '../types';

interface HeroBannerProps {
  onShopNow: (cat: Category) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNow }) => {
  return (
    <div className="relative overflow-hidden bg-neutral-950 border-b border-[rgba(255,255,255,0.08)]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000"
          alt="Autumn/Winter Fashion Collection"
          className="w-full h-full object-cover object-center opacity-35 filter brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-[var(--accent-lime-soft)] border border-[var(--accent-lime-border)] text-[var(--accent-lime)] text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Autumn / Winter 2026 Collection
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl text-white leading-none tracking-tight">
            Elegance Woven in <span className="italic text-[var(--accent-lime)] font-light">Pure Silk & Cashmere</span>
          </h1>

          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-normal max-w-xl">
            Discover artisanal garments and accessories crafted in Italy with sustainable natural fibers and meticulous attention to detail.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onShopNow('New Arrivals')}
              className="bg-[var(--accent-lime)] text-[var(--accent-lime-ink)] px-6 py-3.5 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-lime-900/20"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onShopNow('Clothing')}
              className="bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-700 px-6 py-3.5 rounded-full text-sm font-medium transition-colors backdrop-blur-sm"
            >
              Browse Apparel
            </button>
          </div>
        </div>
      </div>

      {/* Feature Value Props */}
      <div className="relative z-10 bg-neutral-900/90 border-t border-neutral-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-neutral-300">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-[var(--accent-lime)] shrink-0" />
            <div>
              <p className="font-semibold text-white">Global Express</p>
              <p className="text-neutral-400 text-[11px]">Free delivery over $150</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[var(--accent-lime)] shrink-0" />
            <div>
              <p className="font-semibold text-white">Guaranteed Authentic</p>
              <p className="text-neutral-400 text-[11px]">Directly from Italian artisans</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-[var(--accent-lime)] shrink-0" />
            <div>
              <p className="font-semibold text-white">30-Day Returns</p>
              <p className="text-neutral-400 text-[11px]">Hassle-free return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[var(--accent-lime)] shrink-0" />
            <div>
              <p className="font-semibold text-white">Secure Stripe Checkout</p>
              <p className="text-neutral-400 text-[11px]">256-bit SSL encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
