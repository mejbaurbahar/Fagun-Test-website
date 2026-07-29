import React from 'react';
import { ShieldCheck, Truck, Lock, ArrowRight, Instagram, Facebook, Twitter } from 'lucide-react';
import { trackMtag } from '../utils/analytics';

interface FooterProps {
  onOpenSizeGuide?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSizeGuide }) => {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400 text-xs">
      
      {/* Newsletter Signup */}
      <div className="border-b border-neutral-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-serif text-2xl text-white font-normal">Join the Atelier Club</h3>
            <p className="text-neutral-400 text-xs">
              Subscribe to receive private preview invitations, new collection launches, and 10% off your first order.
            </p>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const input = form.querySelector('input[type="email"]') as HTMLInputElement;
              if (input && input.value) {
                trackMtag('NewsletterSubscribe', { email: input.value });
                alert('Thank you for subscribing to the Fagun Luxury Atelier Club!');
                input.value = '';
              }
            }} 
            className="flex gap-2 max-w-md w-full"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded px-4 py-2.5 text-white placeholder-neutral-500 outline-none focus:border-[var(--accent-lime)] text-xs"
              required
            />
            <button
              type="submit"
              className="bg-[var(--accent-lime)] text-[var(--accent-lime-ink)] font-semibold px-5 py-2.5 rounded flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        
        {/* Brand Column */}
        <div className="col-span-2 space-y-4">
          <span className="font-serif text-2xl text-white font-bold block">FAGUN</span>
          <p className="text-neutral-400 text-xs max-w-sm leading-relaxed">
            Fagun Luxury Atelier specializes in haute couture silk, cashmere, and calfskin leather creations crafted by Italian master artisans.
          </p>
          <div className="flex items-center gap-3 text-neutral-400 pt-2">
            <a href="#instagram" className="p-2 bg-neutral-900 hover:text-white rounded-full transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href="#facebook" className="p-2 bg-neutral-900 hover:text-white rounded-full transition-colors"><Facebook className="w-4 h-4" /></a>
            <a href="#twitter" className="p-2 bg-neutral-900 hover:text-white rounded-full transition-colors"><Twitter className="w-4 h-4" /></a>
          </div>
        </div>

        {/* Column 2: Collections */}
        <div className="space-y-3">
          <p className="font-semibold text-white uppercase tracking-wider text-[11px]">Collections</p>
          <ul className="space-y-2 text-neutral-400">
            <li><a href="#silk" className="hover:text-white transition-colors">Silk Blouses</a></li>
            <li><a href="#cashmere" className="hover:text-white transition-colors">Cashmere Outerwear</a></li>
            <li><a href="#leather" className="hover:text-white transition-colors">Artisanal Leather</a></li>
            <li><a href="#evening" className="hover:text-white transition-colors">Evening Dresses</a></li>
            <li><a href="#sale" className="hover:text-white transition-colors">Seasonal Sale</a></li>
          </ul>
        </div>

        {/* Column 3: Customer Care */}
        <div className="space-y-3">
          <p className="font-semibold text-white uppercase tracking-wider text-[11px]">Customer Care</p>
          <ul className="space-y-2 text-neutral-400">
            <li><a href="#shipping" className="hover:text-white transition-colors">Shipping & Delivery</a></li>
            <li><a href="#returns" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
            <li>
              <button
                type="button"
                onClick={() => onOpenSizeGuide && onOpenSizeGuide()}
                className="hover:text-[var(--accent-lime)] text-left cursor-pointer transition-colors text-xs"
              >
                Size Guide
              </button>
            </li>
            <li><a href="#order" className="hover:text-white transition-colors">Track Your Order</a></li>
            <li><a href="#contact" className="hover:text-white transition-colors">Contact Concierge</a></li>
          </ul>
        </div>

        {/* Column 4: Legal & Security */}
        <div className="space-y-3">
          <p className="font-semibold text-white uppercase tracking-wider text-[11px]">Security & Trust</p>
          <ul className="space-y-2 text-neutral-400">
            <li className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-[var(--accent-lime)]" /> 256-bit SSL Protection</li>
            <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-lime)]" /> Stripe Verified Merchant</li>
            <li className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-[var(--accent-lime)]" /> Express Tracking</li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright & Payment Method Logos */}
      <div className="border-t border-neutral-900 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
          <p>© 2026 Fagun Testing Store. All Rights Reserved. Powered by Google AI Studio Build.</p>
          <div className="flex items-center gap-2 font-mono text-white text-[10px]">
            <span className="bg-neutral-900 border border-neutral-800 px-2 py-1 rounded">VISA</span>
            <span className="bg-neutral-900 border border-neutral-800 px-2 py-1 rounded">MASTERCARD</span>
            <span className="bg-neutral-900 border border-neutral-800 px-2 py-1 rounded">AMEX</span>
            <span className="bg-neutral-900 border border-neutral-800 px-2 py-1 rounded">STRIPE</span>
            <span className="bg-neutral-900 border border-neutral-800 px-2 py-1 rounded">PAYPAL</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
