import React, { useState } from 'react';
import { 
  ShoppingBag, Lock, CreditCard, ChevronDown, Info, HelpCircle, 
  Check, AlertCircle, ArrowLeft, ShieldCheck, Tag
} from 'lucide-react';
import { CartItem, Currency, ShippingAddress, PaymentDetails, Order } from '../types';
import { CURRENCY_RATES } from '../data/products';

interface CheckoutViewProps {
  cartItems: CartItem[];
  currency: Currency;
  discountCode: string;
  discountAmount: number;
  onApplyDiscount: (code: string) => boolean;
  onCompleteOrder: (order: Order) => void;
  onBackToShop: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cartItems,
  currency,
  discountCode,
  discountAmount,
  onApplyDiscount,
  onCompleteOrder,
  onBackToShop
}) => {
  useEffect(() => {
    trackMtag('CheckoutStarted', { value: totalAmount, itemsCount: cartItems.length });
  }, []);

  // Shipping Address Form State
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    email: 'user@example.com',
    phone: '',
    emailOrPhone: 'user@example.com',
    emailNewsletters: true,
    country: 'United States',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: 'California',
    zipCode: '',
    saveInformation: true,
    textNewsletters: false
  });

  // Payment Details Form State
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    method: 'credit_card',
    cardNumber: '',
    expirationDate: '',
    securityCode: '',
    nameOnCard: '',
    sameBillingAddress: true
  });

  // Coupon State
  const [inputCoupon, setInputCoupon] = useState(discountCode);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Processing & Error States
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currencyData = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;

  // Total Calculations
  const rawSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const subtotal = rawSubtotal * currencyData.rate;
  const discountVal = discountAmount * currencyData.rate;
  const shippingFee = shippingAddress.address.trim() 
    ? (subtotal > 150 * currencyData.rate ? 0 : 15 * currencyData.rate)
    : 0;
  const estimatedTax = (subtotal - discountVal) * 0.08;
  const totalAmount = Math.max(0, subtotal - discountVal + shippingFee + estimatedTax);

  // Fill Test Card Helper
  const handleFillTestCard = (testType: '1' | '2' | '3') => {
    if (testType === '1') {
      setPaymentDetails(prev => ({
        ...prev,
        cardNumber: '4242 4242 4242 4242',
        expirationDate: '12/28',
        securityCode: '123',
        nameOnCard: `${shippingAddress.firstName || 'Jane'} ${shippingAddress.lastName || 'Doe'}`.trim() || 'Jane Doe'
      }));
    } else if (testType === '2') {
      setPaymentDetails(prev => ({
        ...prev,
        cardNumber: '4000 0000 0002 0002',
        expirationDate: '12/28',
        securityCode: '123',
        nameOnCard: 'Declined Card Test'
      }));
    } else if (testType === '3') {
      setPaymentDetails(prev => ({
        ...prev,
        cardNumber: '4000 0000 0003 0003',
        expirationDate: '12/28',
        securityCode: '123',
        nameOnCard: 'Gateway Error Test'
      }));
    }
  };

  // Customer Profile helper
  const getCustomerProfile = () => ({
    email: shippingAddress.email || shippingAddress.emailOrPhone,
    phone: shippingAddress.phone || shippingAddress.emailOrPhone,
    first_name: shippingAddress.firstName,
    last_name: shippingAddress.lastName,
    full_name: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim(),
    address: shippingAddress.address,
    apartment: shippingAddress.apartment || '',
    city: shippingAddress.city,
    state: shippingAddress.state,
    zip_code: shippingAddress.zipCode,
    country: shippingAddress.country,
    email_newsletters: shippingAddress.emailNewsletters,
    text_newsletters: shippingAddress.textNewsletters
  });

  const getDetailedItems = () => cartItems.map((item) => ({
    id: item.product.id,
    sku: item.product.sku,
    name: item.product.name,
    category: item.product.category,
    price: item.product.price,
    quantity: item.quantity,
    size: item.selectedSize || 'N/A',
    color: item.selectedColor || 'N/A',
    image: item.product.images[0]
  }));

  useEffect(() => {
    trackMtag('CheckoutStarted', {
      value: totalAmount,
      currency,
      num_items: cartItems.reduce((acc, i) => acc + i.quantity, 0),
      customer: getCustomerProfile(),
      products: getDetailedItems()
    });
  }, []);

  const handleApplyCouponCode = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!inputCoupon.trim()) return;

    const ok = onApplyDiscount(inputCoupon.trim());
    if (ok) {
      setCouponSuccess('Discount code applied!');
      trackMtag('ApplyDiscount', { code: inputCoupon.trim(), success: true, customer: getCustomerProfile() });
    } else {
      setCouponError('Invalid code. Try "FAGUN10"');
      trackMtag('ApplyDiscount', { code: inputCoupon.trim(), success: false, customer: getCustomerProfile() });
    }
  };

  const handleSubmitPayNow = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const customer = getCustomerProfile();
    const products = getDetailedItems();

    // Basic Validation
    if (!shippingAddress.email.trim() && !shippingAddress.phone.trim() && !shippingAddress.emailOrPhone.trim()) {
      const msg = 'Please enter your contact email address or mobile phone number.';
      setErrorMessage(msg);
      trackMtag('CheckoutError', { error: msg, step: 'ContactInfo', customer, products });
      return;
    }
    if (!shippingAddress.firstName || !shippingAddress.lastName) {
      const msg = 'Please enter your first and last name.';
      setErrorMessage(msg);
      trackMtag('CheckoutError', { error: msg, step: 'ShippingName', customer, products });
      return;
    }
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.zipCode) {
      const msg = 'Please complete your shipping address details.';
      setErrorMessage(msg);
      trackMtag('CheckoutError', { error: msg, step: 'ShippingAddress', customer, products });
      return;
    }
    if (!paymentDetails.cardNumber || !paymentDetails.expirationDate || !paymentDetails.securityCode) {
      const msg = 'Please enter valid credit card details.';
      setErrorMessage(msg);
      trackMtag('CheckoutError', { error: msg, step: 'PaymentDetails', customer, products });
      return;
    }

    trackMtag('CheckoutStep', {
      step: 3,
      step_name: 'SubmitPayment',
      payment_method: paymentDetails.method,
      value: totalAmount,
      currency,
      customer,
      products
    });
    setIsProcessing(true);

    // Simulate Stripe Payment Gateway Response based on Test Card Inputs
    setTimeout(() => {
      setIsProcessing(false);

      const cleanNum = paymentDetails.cardNumber.replace(/\s+/g, '');

      if (cleanNum.endsWith('2002')) {
        const msg = 'Your card was declined. Please test with card "4242 4242 4242 4242" for an approved transaction.';
        setErrorMessage(msg);
        trackMtag('CheckoutError', { error: 'CardDeclined', step: 'PaymentProcessing', customer, products });
        return;
      }

      if (cleanNum.endsWith('3003')) {
        const msg = 'Payment Gateway Error. Please try again or test with an approved card number.';
        setErrorMessage(msg);
        trackMtag('CheckoutError', { error: 'GatewayError', step: 'PaymentProcessing', customer, products });
        return;
      }

      // Success
      const newOrder: Order = {
        id: `FG-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        items: [...cartItems],
        shippingAddress,
        paymentDetails,
        subtotal,
        discount: discountVal,
        shippingFee,
        tax: estimatedTax,
        total: totalAmount,
        currency,
        status: 'Processing',
        estimatedDelivery: '3 - 5 Business Days'
      };

      trackMtag('Purchase', {
        order_id: newOrder.id,
        value: totalAmount,
        subtotal,
        discount: discountVal,
        shippingFee,
        tax: estimatedTax,
        currency,
        customer,
        payment_method: paymentDetails.method,
        products
      });
      onCompleteOrder(newOrder);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] text-neutral-900 font-sans antialiased">
      
      {/* Checkout Top Bar */}
      <header className="bg-white border-b border-neutral-200 py-5 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <button
          onClick={() => {
            trackMtag('AbandonCheckout', { reason: 'UserReturnedToStore', value: totalAmount, currency });
            onBackToShop();
          }}
          className="flex items-center gap-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Store</span>
        </button>

        <div className="text-center font-serif text-xl sm:text-2xl tracking-tight text-neutral-900 font-bold">
          Fagun Testing Store
        </div>

        <div className="flex items-center gap-2 text-neutral-700 text-xs font-semibold">
          <ShoppingBag className="w-5 h-5 text-neutral-900" />
          <span className="bg-neutral-100 border border-neutral-300 rounded-full px-2 py-0.5 font-mono">
            {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Shipping & Payment Forms */}
          <div className="lg:col-span-7 space-y-8">
            <form onSubmit={handleSubmitPayNow} className="space-y-8">
              
              {/* Error Notice */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 text-xs text-red-800 animate-fadeIn">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">Payment Action Required</p>
                    <p>{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* 1. Contact Section */}
              <section className="bg-white border border-neutral-200 rounded-lg p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-neutral-900">Contact Information</h2>
                  <button type="button" className="text-xs font-medium text-blue-600 hover:underline">
                    Sign in
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-neutral-600 block mb-1">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Email address"
                        value={shippingAddress.email}
                        onChange={(e) => {
                          const val = e.target.value;
                          setShippingAddress(prev => ({
                            ...prev,
                            email: val,
                            emailOrPhone: val || prev.phone
                          }));
                        }}
                        className="w-full bg-white border border-neutral-300 rounded-md px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <HelpCircle className="w-4 h-4 text-neutral-400 absolute right-3.5 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-neutral-600 block mb-1">Mobile Phone Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="Phone number"
                        value={shippingAddress.phone}
                        onChange={(e) => {
                          const val = e.target.value;
                          setShippingAddress(prev => ({
                            ...prev,
                            phone: val,
                            emailOrPhone: prev.email || val
                          }));
                        }}
                        className="w-full bg-white border border-neutral-300 rounded-md px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <HelpCircle className="w-4 h-4 text-neutral-400 absolute right-3.5 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2.5 text-xs text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shippingAddress.emailNewsletters}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, emailNewsletters: e.target.checked })}
                      className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Email me with news and special offers</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shippingAddress.textNewsletters}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, textNewsletters: e.target.checked })}
                      className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>SMS / Text me with shipping updates and offers</span>
                  </label>
                </div>
              </section>

              {/* 2. Delivery Section */}
              <section className="bg-white border border-neutral-200 rounded-lg p-6 shadow-xs space-y-4">
                <h2 className="text-lg font-semibold text-neutral-900">Delivery</h2>

                <div className="space-y-3">
                  {/* Country/Region */}
                  <div>
                    <label className="text-[11px] font-medium text-neutral-500 block mb-1">Country/Region</label>
                    <select
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      className="w-full bg-white border border-neutral-300 rounded-md px-3.5 py-2.5 text-sm text-neutral-900 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Australia">Australia</option>
                      <option value="Bangladesh">Bangladesh</option>
                    </select>
                  </div>

                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="First name"
                      value={shippingAddress.firstName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                      className="w-full bg-white border border-neutral-300 rounded-md px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Last name"
                      value={shippingAddress.lastName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                      className="w-full bg-white border border-neutral-300 rounded-md px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  {/* Address */}
                  <input
                    type="text"
                    placeholder="Address"
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-md px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 outline-none"
                  />

                  {/* Apartment */}
                  <input
                    type="text"
                    placeholder="Apartment, suite, etc. (optional)"
                    value={shippingAddress.apartment}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, apartment: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-md px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 outline-none"
                  />

                  {/* City, State, Zip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="City"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="w-full bg-white border border-neutral-300 rounded-md px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <select
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="w-full bg-white border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-neutral-900 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                    >
                      <option value="California">California</option>
                      <option value="New York">New York</option>
                      <option value="Texas">Texas</option>
                      <option value="Florida">Florida</option>
                      <option value="Washington">Washington</option>
                    </select>
                    <input
                      type="text"
                      placeholder="ZIP code"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                      className="w-full bg-white border border-neutral-300 rounded-md px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Phone (optional)"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      className="w-full bg-white border border-neutral-300 rounded-md px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <HelpCircle className="w-4 h-4 text-neutral-400 absolute right-3.5 top-3 pointer-events-none" />
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2.5 text-xs text-neutral-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shippingAddress.saveInformation}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, saveInformation: e.target.checked })}
                        className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Save this information for next time</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-neutral-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shippingAddress.textNewsletters}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, textNewsletters: e.target.checked })}
                        className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Text me with news and offers</span>
                    </label>
                  </div>
                </div>
              </section>

              {/* 3. Shipping Method Section */}
              <section className="bg-white border border-neutral-200 rounded-lg p-6 shadow-xs space-y-3">
                <h2 className="text-lg font-semibold text-neutral-900">Shipping method</h2>

                {shippingAddress.address.trim() ? (
                  <div className="border border-blue-500 bg-blue-50/40 rounded-md p-3.5 flex items-center justify-between text-xs text-neutral-900">
                    <div className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-blue-600" />
                      <span>{shippingFee === 0 ? 'Standard Express (Free)' : 'Standard Express Shipping'}</span>
                    </div>
                    <span className="font-semibold font-mono">
                      {shippingFee === 0 ? 'FREE' : `${currencyData.symbol}${shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                ) : (
                  <div className="bg-neutral-100 rounded-md p-4 text-center text-xs text-neutral-500">
                    Enter your shipping address to view available shipping methods.
                  </div>
                )}
              </section>

              {/* 4. Payment Section (Stripe Credit Card) */}
              <section className="bg-white border border-neutral-200 rounded-lg p-6 shadow-xs space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">Payment</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">All transactions are secure and encrypted.</p>
                </div>

                <div className="border border-blue-500 bg-blue-50/20 rounded-lg overflow-hidden">
                  
                  {/* Option Header */}
                  <div className="p-3.5 bg-blue-50/50 border-b border-blue-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold text-xs text-blue-900">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>Credit card</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-blue-800 bg-white border border-blue-200 px-1.5 py-0.5 rounded">VISA</span>
                      <span className="text-[10px] font-bold text-red-600 bg-white border border-neutral-200 px-1.5 py-0.5 rounded">MC</span>
                      <span className="text-[10px] font-bold text-amber-600 bg-white border border-neutral-200 px-1.5 py-0.5 rounded">AMEX</span>
                    </div>
                  </div>

                  {/* Instruction / Testing Banner */}
                  <div className="p-4 bg-blue-50 border-b border-blue-200 text-xs text-blue-900 space-y-2">
                    <p className="font-semibold flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-blue-600" />
                      <span>Testing instruction</span>
                    </p>
                    <p className="text-blue-800 leading-relaxed text-[11px]">
                      Use these values to test your checkout:
                    </p>
                    <ul className="list-disc list-inside text-[11px] text-blue-800 space-y-0.5 pl-1">
                      <li><strong className="font-mono">1</strong> to simulate an approved transaction</li>
                      <li><strong className="font-mono">2</strong> to simulate a declined transaction</li>
                      <li><strong className="font-mono">3</strong> to simulate a gateway failure</li>
                    </ul>
                    <p className="text-[11px] text-blue-700">
                      Use any future expiration date and any 3-digit security code.
                    </p>

                    {/* Quick Auto-Fill Buttons */}
                    <div className="pt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleFillTestCard('1')}
                        className="bg-white hover:bg-blue-100 text-blue-900 border border-blue-300 text-[11px] px-2.5 py-1 rounded font-medium transition-colors"
                      >
                        ⚡ Fill Approved Test Card (4242...)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFillTestCard('2')}
                        className="bg-white hover:bg-red-100 text-red-900 border border-red-300 text-[11px] px-2.5 py-1 rounded font-medium transition-colors"
                      >
                        Simulate Decline (4002...)
                      </button>
                    </div>
                  </div>

                  {/* Card Form Inputs */}
                  <div className="p-4 space-y-3 bg-white">
                    {/* Card Number */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Card number"
                        value={paymentDetails.cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').substring(0, 16);
                          const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                          setPaymentDetails({ ...paymentDetails, cardNumber: formatted });
                        }}
                        className="w-full bg-white border border-neutral-300 rounded-md px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                      />
                      <Lock className="w-4 h-4 text-neutral-400 absolute right-3.5 top-3 pointer-events-none" />
                    </div>

                    {/* Exp Date & CVC */}
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Expiration date (MM / YY)"
                        value={paymentDetails.expirationDate}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, expirationDate: e.target.value })}
                        className="w-full bg-white border border-neutral-300 rounded-md px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                      />
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Security code"
                          value={paymentDetails.securityCode}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, securityCode: e.target.value })}
                          className="w-full bg-white border border-neutral-300 rounded-md px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                        />
                        <HelpCircle className="w-4 h-4 text-neutral-400 absolute right-3.5 top-3 pointer-events-none" />
                      </div>
                    </div>

                    {/* Name on Card */}
                    <input
                      type="text"
                      placeholder="Name on card"
                      value={paymentDetails.nameOnCard}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, nameOnCard: e.target.value })}
                      className="w-full bg-white border border-neutral-300 rounded-md px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    {/* Same Billing Checkbox */}
                    <label className="flex items-center gap-2.5 text-xs text-neutral-700 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={paymentDetails.sameBillingAddress}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, sameBillingAddress: e.target.checked })}
                        className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Use shipping address as billing address</span>
                    </label>
                  </div>
                </div>

                {/* Pay Now Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-md text-sm transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing Payment via Stripe...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay now ({currencyData.symbol}{totalAmount.toFixed(2)})</span>
                    </>
                  )}
                </button>
              </section>

            </form>
          </div>

          {/* RIGHT COLUMN: Order Summary Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-xs sticky top-24 space-y-6">
              
              <h3 className="text-base font-semibold text-neutral-900 border-b border-neutral-200 pb-3">
                Order Summary
              </h3>

              {/* Cart Items List */}
              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3.5 text-xs">
                    
                    {/* Thumbnail with Qty Badge */}
                    <div className="relative w-14 h-16 bg-neutral-100 border border-neutral-200 rounded shrink-0 overflow-hidden">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover object-center"
                      />
                      <span className="absolute -top-1.5 -right-1.5 bg-neutral-700 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-neutral-500 text-[11px] mt-0.5">
                        {item.selectedSize && `Size: ${item.selectedSize}`}
                        {item.selectedSize && item.selectedColor && ' • '}
                        {item.selectedColor && `Color: ${item.selectedColor}`}
                      </p>
                    </div>

                    <span className="font-semibold text-neutral-900 font-mono">
                      {currencyData.symbol}{(item.product.price * item.quantity * currencyData.rate).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Discount Input */}
              <form onSubmit={handleApplyCouponCode} className="space-y-1.5 pt-3 border-t border-neutral-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Discount code or gift card"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                    className="flex-1 bg-white border border-neutral-300 rounded-md px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                  />
                  <button
                    type="submit"
                    className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs px-4 py-2 rounded-md font-semibold transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-emerald-600">{couponSuccess}</p>}
              </form>

              {/* Price Calculation Lines */}
              <div className="space-y-2 text-xs text-neutral-600 pt-3 border-t border-neutral-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-neutral-900">{currencyData.symbol}{subtotal.toFixed(2)}</span>
                </div>

                {discountVal > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Discount ({discountAmount}%)</span>
                    </span>
                    <span className="font-mono">-{currencyData.symbol}{discountVal.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-mono text-neutral-900">
                    {shippingAddress.address.trim() 
                      ? (shippingFee === 0 ? 'FREE' : `${currencyData.symbol}${shippingFee.toFixed(2)}`)
                      : 'Enter shipping address'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Taxes (8%)</span>
                  <span className="font-mono text-neutral-900">{currencyData.symbol}{estimatedTax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base font-bold text-neutral-900 pt-3 border-t border-neutral-200">
                  <span>Total</span>
                  <span className="font-mono text-blue-600 text-lg">
                    {currencyData.symbol}{totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Security Guarantee Badge */}
              <div className="bg-neutral-50 rounded p-3 text-[11px] text-neutral-500 flex items-center gap-2.5 border border-neutral-200">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Guaranteed Safe & Secure Checkout via 256-bit Encrypted SSL.</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
