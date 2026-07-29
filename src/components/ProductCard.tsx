import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Heart, Check } from 'lucide-react';
import { Product, Currency } from '../types';
import { CURRENCY_RATES } from '../data/products';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  onQuickAdd: (product: Product, size?: string) => void;
  onViewDetails: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onQuickAdd,
  onViewDetails,
  isWishlisted,
  onToggleWishlist
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedQuickSize, setSelectedQuickSize] = useState<string | undefined>(
    product.sizes ? product.sizes[0] : undefined
  );

  const currencyData = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const formattedPrice = `${currencyData.symbol}${(product.price * currencyData.rate).toFixed(2)}`;
  const formattedOriginalPrice = product.originalPrice 
    ? `${currencyData.symbol}${(product.originalPrice * currencyData.rate).toFixed(2)}` 
    : null;

  const handleQuickAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(product, selectedQuickSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div 
      onClick={() => onViewDetails(product)}
      className="group relative bg-[var(--neutral-850)] rounded-lg border border-[rgba(255,255,255,0.08)] hover:border-neutral-700 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Image Container with Badges */}
      <div 
        className="relative aspect-[3/4] bg-neutral-900 overflow-hidden"
        onMouseEnter={() => product.images.length > 1 && setCurrentImageIndex(1)}
        onMouseLeave={() => setCurrentImageIndex(0)}
      >
        <img
          src={product.images[currentImageIndex] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className={`text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-md ${
              product.badge === 'Sale' 
                ? 'bg-red-500 text-white' 
                : product.badge === 'New' 
                ? 'bg-[var(--accent-lime)] text-[var(--accent-lime-ink)]'
                : 'bg-neutral-900/90 text-white border border-neutral-700'
            }`}>
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-colors ${
            isWishlisted 
              ? 'bg-red-500/20 text-red-500 border border-red-500/40' 
              : 'bg-neutral-900/60 text-neutral-300 hover:text-white hover:bg-neutral-900'
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View & Hover Controls Overlay */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-2">
          
          {/* Quick Size Picker if applicable */}
          {product.sizes && product.sizes.length > 0 && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-1.5 bg-neutral-950/80 backdrop-blur-md p-1.5 rounded"
            >
              <span className="text-[10px] text-neutral-400 mr-1">Size:</span>
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedQuickSize(sz)}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    selectedQuickSize === sz
                      ? 'bg-[var(--accent-lime)] text-[var(--accent-lime-ink)]'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleQuickAddToCart}
              className={`flex-1 py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                isAdded 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-[var(--accent-lime)] text-[var(--accent-lime-ink)] hover:bg-opacity-90'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Quick Add</span>
                </>
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(product);
              }}
              className="p-2 bg-neutral-900/90 text-white hover:text-[var(--accent-lime)] rounded border border-neutral-700 hover:border-neutral-500 transition-colors"
              title="Quick Details"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-300 mb-1">
            <span>{product.category}</span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-[11px] font-medium text-neutral-200">{product.rating}</span>
            </div>
          </div>

          <h3 className="font-medium text-white text-sm group-hover:text-[var(--accent-lime)] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </div>

        <div className="pt-1 flex items-baseline gap-2">
          <span className="font-semibold text-white text-base">
            {formattedPrice}
          </span>
          {formattedOriginalPrice && (
            <span className="text-xs text-neutral-400 line-through">
              {formattedOriginalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
