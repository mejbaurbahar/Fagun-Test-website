import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Sparkles, Lock } from 'lucide-react';
import { CartItem, Currency } from '../types';
import { CURRENCY_RATES } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: Currency;
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
  discountCode: string;
  onApplyDiscount: (code: string) => boolean;
  discountAmount: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  discountCode,
  onApplyDiscount,
  discountAmount
}) => {
  if (!isOpen) return null;

  const [inputCode, setInputCode] = useState(discountCode);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const currencyData = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;

  const rawSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const subtotal = rawSubtotal * currencyData.rate;
  const discountVal = discountAmount * currencyData.rate;
  const shippingFee = subtotal > 150 * currencyData.rate ? 0 : 15 * currencyData.rate;
  const estimatedTax = (subtotal - discountVal) * 0.08;
  const finalTotal = Math.max(0, subtotal - discountVal + shippingFee + estimatedTax);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!inputCode.trim()) return;

    const success = onApplyDiscount(inputCode.trim());
    if (success) {
      setCouponSuccess('Promo code applied successfully!');
    } else {
      setCouponError('Invalid promo code. Try "FAGUN10" for 10% off.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end animate-fadeIn">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[var(--neutral-850)] border-l border-neutral-800 h-full flex flex-col shadow-2xl z-10">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[var(--accent-lime)]" />
            <h2 className="font-serif text-xl text-white">Your Bag</h2>
            <span className="bg-neutral-800 text-neutral-300 text-xs px-2 py-0.5 rounded-full font-mono">
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-neutral-900 px-6 py-2.5 border-b border-neutral-800 text-xs text-neutral-300">
          {subtotal >= 150 * currencyData.rate ? (
            <p className="text-[var(--accent-lime)] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>You unlocked FREE Worldwide Express Shipping!</span>
            </p>
          ) : (
            <p className="flex items-center justify-between">
              <span>Add <strong className="text-white">{currencyData.symbol}{((150 * currencyData.rate) - subtotal).toFixed(2)}</strong> for Free Shipping</span>
              <span className="font-mono text-[10px] text-neutral-500">Goal: ${150 * currencyData.rate}</span>
            </p>
          )}
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {cartItems.length > 0 ? (
            cartItems.map((item, idx) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}
                className="flex items-center gap-4 bg-neutral-900/60 p-3 rounded-lg border border-neutral-800/80 hover:border-neutral-700 transition-colors"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-20 object-cover object-center rounded bg-neutral-950 shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-xs font-medium text-white truncate">
                    {item.product.name}
                  </h4>

                  <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                    {item.selectedSize && <span>Size: <strong className="text-white">{item.selectedSize}</strong></span>}
                    {item.selectedColor && <span>Color: <strong className="text-white">{item.selectedColor}</strong></span>}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {/* Quantity Adjustment */}
                    <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded">
                      <button
                        onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-neutral-400 hover:text-white"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-mono text-white">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-neutral-400 hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-semibold text-white font-mono">
                      {currencyData.symbol}{(item.product.price * item.quantity * currencyData.rate).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveItem(idx)}
                  className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="py-16 text-center space-y-3 text-neutral-400">
              <ShoppingBag className="w-10 h-10 mx-auto opacity-40 text-neutral-500" />
              <p className="text-sm font-medium text-white">Your bag is empty</p>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Explore our luxury apparel, accessories, and footwear collection to add items.
              </p>
              <button
                onClick={onClose}
                className="mt-2 text-xs text-[var(--accent-lime)] font-semibold underline"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout Trigger */}
        {cartItems.length > 0 && (
          <div className="shrink-0 p-4 sm:p-6 border-t border-neutral-800 bg-neutral-950/95 space-y-4">
            
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-1.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Discount code (e.g. FAGUN10)"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white uppercase placeholder-neutral-500 outline-none focus:border-[var(--accent-lime)]"
                />
                <button
                  type="submit"
                  className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs px-3 py-1.5 rounded font-medium transition-colors"
                >
                  Apply
                </button>
              </div>

              {couponError && <p className="text-[11px] text-red-400">{couponError}</p>}
              {couponSuccess && <p className="text-[11px] text-emerald-400">{couponSuccess}</p>}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-neutral-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-white">{currencyData.symbol}{subtotal.toFixed(2)}</span>
              </div>

              {discountVal > 0 && (
                <div className="flex justify-between text-[var(--accent-lime)] font-medium">
                  <span>Discount ({discountAmount > 0 ? `${discountAmount}% OFF` : 'Applied'})</span>
                  <span className="font-mono">-{currencyData.symbol}{discountVal.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-mono text-white">
                  {shippingFee === 0 ? 'FREE' : `${currencyData.symbol}${shippingFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-neutral-400">
                <span>Estimated Tax (8%)</span>
                <span className="font-mono">{currencyData.symbol}{estimatedTax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm font-semibold text-white pt-2 border-t border-neutral-800">
                <span>Total</span>
                <span className="font-mono text-[var(--accent-lime)] text-base">
                  {currencyData.symbol}{finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout CTA Button */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && typeof (window as any).mtag === 'function') {
                  (window as any).mtag('event', {
                    type: 'InitiateCheckout',
                    value: finalTotal,
                    currency,
                    num_items: cartItems.reduce((acc, i) => acc + i.quantity, 0),
                    products: cartItems.map((i) => ({
                      id: i.product.id,
                      name: i.product.name,
                      price: i.product.price,
                      quantity: i.quantity,
                      size: i.selectedSize,
                      color: i.selectedColor
                    }))
                  });
                }
                onClose();
                onProceedToCheckout();
              }}
              className="w-full bg-[var(--accent-lime)] text-[var(--accent-lime-ink)] py-3.5 px-4 rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-lg active:scale-[0.98] cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Proceed to Checkout • {currencyData.symbol}{finalTotal.toFixed(2)}</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
