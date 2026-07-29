import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product, Currency } from '../types';
import { CURRENCY_RATES } from '../data/products';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  currency: Currency;
  onQuickAdd: (product: Product) => void;
  onRemoveWishlist: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  currency,
  onQuickAdd,
  onRemoveWishlist,
  onViewDetails
}) => {
  if (!isOpen) return null;

  const currencyData = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[var(--neutral-850)] border-l border-neutral-800 h-full flex flex-col shadow-2xl z-10">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-current" />
            <h2 className="font-serif text-xl text-white">Saved Wishlist</h2>
            <span className="bg-neutral-800 text-neutral-300 text-xs px-2 py-0.5 rounded-full font-mono">
              {wishlistProducts.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {wishlistProducts.length > 0 ? (
            wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 bg-neutral-900/60 p-3 rounded-lg border border-neutral-800/80 hover:border-neutral-700 transition-colors cursor-pointer"
                onClick={() => {
                  onClose();
                  onViewDetails(product);
                }}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-16 h-20 object-cover object-center rounded bg-neutral-950 shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-xs font-medium text-white truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs font-semibold text-[var(--accent-lime)] font-mono">
                    {currencyData.symbol}{(product.price * currencyData.rate).toFixed(2)}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickAdd(product);
                    }}
                    className="mt-1 bg-neutral-800 hover:bg-neutral-700 text-white text-[11px] font-medium px-2.5 py-1 rounded flex items-center gap-1 transition-colors"
                  >
                    <ShoppingBag className="w-3 h-3 text-[var(--accent-lime)]" />
                    <span>Move to Bag</span>
                  </button>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveWishlist(product);
                  }}
                  className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="py-16 text-center space-y-3 text-neutral-400">
              <Heart className="w-10 h-10 mx-auto opacity-40 text-neutral-500" />
              <p className="text-sm font-medium text-white">No items saved yet</p>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Click the heart icon on any product to save it to your personal wishlist.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
