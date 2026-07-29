import React, { useState } from 'react';
import { X, Star, ShoppingBag, Truck, RefreshCw, ShieldCheck, Check, Heart, ArrowRight, Ruler } from 'lucide-react';
import { Product, Currency } from '../types';
import { CURRENCY_RATES } from '../data/products';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  currency: Currency;
  onAddToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
  onBuyNow: (product: Product, quantity: number, size?: string, color?: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onOpenSizeGuide?: (category?: 'Clothing' | 'Footwear' | 'Accessories') => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  currency,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
  onOpenSizeGuide
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes ? product.sizes[0] : undefined
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors ? product.colors[0].name : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const currencyData = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const formattedPrice = `${currencyData.symbol}${(product.price * currencyData.rate).toFixed(2)}`;
  const formattedOriginalPrice = product.originalPrice 
    ? `${currencyData.symbol}${(product.originalPrice * currencyData.rate).toFixed(2)}` 
    : null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    onBuyNow(product, quantity, selectedSize, selectedColor);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative bg-[var(--neutral-850)] border border-neutral-700 rounded-xl max-w-4xl w-full overflow-hidden shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-neutral-900 rounded-lg overflow-hidden relative">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-[var(--accent-lime)] text-[var(--accent-lime-ink)] text-xs font-semibold px-2.5 py-1 rounded uppercase tracking-wider">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 aspect-square rounded-md overflow-hidden border-2 transition-all ${
                      selectedImage === idx 
                        ? 'border-[var(--accent-lime)] ring-2 ring-[var(--accent-lime-soft)]' 
                        : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Form */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="uppercase tracking-widest font-mono text-[var(--accent-lime)]">{product.category}</span>
                <span className="text-neutral-500 font-mono">SKU: {product.sku}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-tight">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-neutral-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium text-white">{product.rating}</span>
                <span className="text-neutral-500">({product.reviewsCount} customer reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 py-1">
                <span className="text-2xl font-semibold text-white">
                  {formattedPrice}
                </span>
                {formattedOriginalPrice && (
                  <span className="text-sm text-neutral-500 line-through">
                    {formattedOriginalPrice}
                  </span>
                )}
                {product.inStock && (
                  <span className="text-xs text-emerald-400 font-medium ml-auto flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    In Stock ({product.stockCount} left)
                  </span>
                )}
              </div>

              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed border-t border-neutral-800 pt-4">
                {product.description}
              </p>

              {/* Color Swatches */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-neutral-300 block">
                    Color: <span className="text-white font-normal">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {product.colors.map((clr) => (
                      <button
                        key={clr.name}
                        onClick={() => setSelectedColor(clr.name)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                          selectedColor === clr.name 
                            ? 'border-[var(--accent-lime)] scale-110' 
                            : 'border-neutral-700 hover:border-neutral-500'
                        }`}
                        style={{ backgroundColor: clr.hex }}
                        title={clr.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-neutral-300">Select Size:</label>
                    <button
                      type="button"
                      onClick={() => onOpenSizeGuide && onOpenSizeGuide(
                        product.category === 'Footwear' || product.category === 'Accessories' ? product.category : 'Clothing'
                      )}
                      className="text-[11px] text-[var(--accent-lime)] hover:underline cursor-pointer flex items-center gap-1 font-medium"
                    >
                      <Ruler className="w-3 h-3" />
                      <span>Size Guide</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3.5 py-1.5 rounded text-xs font-semibold border transition-all ${
                          selectedSize === sz
                            ? 'bg-[var(--accent-lime)] text-[var(--accent-lime-ink)] border-[var(--accent-lime)]'
                            : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-neutral-500'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 pt-2">
                <label className="text-xs font-semibold text-neutral-300">Quantity:</label>
                <div className="flex items-center bg-neutral-900 border border-neutral-700 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-neutral-300 hover:text-white font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-mono text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    className="px-3 py-1 text-neutral-300 hover:text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-4 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isAdded 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-[var(--accent-lime)] text-[var(--accent-lime-ink)] hover:bg-opacity-90'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-white text-black hover:bg-neutral-200 py-3 px-4 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3 rounded-md border transition-colors ${
                    isWishlisted 
                      ? 'bg-red-500/20 text-red-500 border-red-500/40' 
                      : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:text-white'
                  }`}
                  title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Garment Care Details */}
              {product.details && product.details.length > 0 && (
                <div className="bg-neutral-900/60 rounded p-3 text-[11px] text-neutral-400 space-y-1 border border-neutral-800">
                  <p className="font-semibold text-white text-xs mb-1">Product Details & Care:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {product.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
