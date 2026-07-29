import React from 'react';
import { CheckCircle2, Package, Truck, Calendar, MapPin, CreditCard, ArrowRight, Printer } from 'lucide-react';
import { Order } from '../types';
import { CURRENCY_RATES } from '../data/products';

interface OrderConfirmationProps {
  order: Order | null;
  onContinueShopping: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  order,
  onContinueShopping
}) => {
  if (!order) return null;

  const currencyData = CURRENCY_RATES[order.currency] || CURRENCY_RATES.USD;

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Success Header */}
        <div className="bg-[var(--neutral-850)] border border-neutral-800 rounded-xl p-8 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-[var(--accent-lime-soft)] border border-[var(--accent-lime-border)] text-[var(--accent-lime)] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono">
              Order Confirmed
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal">
              Thank you, {order.shippingAddress.firstName}!
            </h1>
            <p className="text-sm text-neutral-300">
              We've received your order and sent confirmation updates to{' '}
              <strong className="text-white">
                {order.shippingAddress.email || order.shippingAddress.emailOrPhone}
                {order.shippingAddress.phone ? ` (${order.shippingAddress.phone})` : ''}
              </strong>.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs">
            <div className="bg-neutral-900 px-4 py-2 rounded-md border border-neutral-800 flex items-center gap-2">
              <Package className="w-4 h-4 text-[var(--accent-lime)]" />
              <span>Order Number: <strong className="font-mono text-white">{order.id}</strong></span>
            </div>

            <div className="bg-neutral-900 px-4 py-2 rounded-md border border-neutral-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--accent-lime)]" />
              <span>Estimated Delivery: <strong className="text-white">{order.estimatedDelivery}</strong></span>
            </div>
          </div>
        </div>

        {/* Order Details & Summary */}
        <div className="bg-[var(--neutral-850)] border border-neutral-800 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <h2 className="text-lg font-semibold text-white">Order Details</h2>
            <button
              onClick={() => window.print()}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
          </div>

          {/* Items List */}
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 pb-4 border-b border-neutral-900">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-20 object-cover object-center rounded bg-neutral-900 border border-neutral-800 shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-sm font-medium text-white truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Qty: {item.quantity} {item.selectedSize && `• Size: ${item.selectedSize}`} {item.selectedColor && `• Color: ${item.selectedColor}`}
                  </p>
                </div>

                <span className="font-semibold text-white font-mono text-sm">
                  {currencyData.symbol}{(item.product.price * item.quantity * currencyData.rate).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Shipping & Payment Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 text-xs">
            {/* Shipping Address */}
            <div className="bg-neutral-900/60 p-4 rounded-lg border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold">
                <MapPin className="w-4 h-4 text-[var(--accent-lime)]" />
                <span>Shipping Address</span>
              </div>
              <div className="text-neutral-300 space-y-0.5 leading-relaxed">
                <p className="font-medium text-white">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.address} {order.shippingAddress.apartment}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-neutral-900/60 p-4 rounded-lg border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold">
                <CreditCard className="w-4 h-4 text-[var(--accent-lime)]" />
                <span>Payment Method</span>
              </div>
              <div className="text-neutral-300 space-y-0.5 leading-relaxed">
                <p className="font-medium text-white">Credit Card (Stripe Test Gateway)</p>
                <p className="font-mono text-neutral-400">Card ending in: {order.paymentDetails.cardNumber.slice(-4) || '4242'}</p>
                <p className="text-emerald-400 font-medium pt-1">Status: Paid & Authorized</p>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-neutral-900 p-4 rounded-lg border border-neutral-800 text-xs space-y-2">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal</span>
              <span className="font-mono text-white">{currencyData.symbol}{order.subtotal.toFixed(2)}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-[var(--accent-lime)]">
                <span>Discount</span>
                <span className="font-mono">-{currencyData.symbol}{order.discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-neutral-400">
              <span>Shipping Fee</span>
              <span className="font-mono text-white">
                {order.shippingFee === 0 ? 'FREE' : `${currencyData.symbol}${order.shippingFee.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between text-neutral-400">
              <span>Tax</span>
              <span className="font-mono text-white">{currencyData.symbol}{order.tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-neutral-800">
              <span>Total Paid</span>
              <span className="font-mono text-[var(--accent-lime)]">{currencyData.symbol}{order.total.toFixed(2)}</span>
            </div>
          </div>

        </div>

        {/* CTA Button */}
        <div className="text-center pt-4">
          <button
            onClick={onContinueShopping}
            className="bg-[var(--accent-lime)] text-[var(--accent-lime-ink)] py-3.5 px-8 rounded-full text-xs font-semibold inline-flex items-center gap-2 hover:bg-opacity-90 transition-opacity shadow-lg"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
