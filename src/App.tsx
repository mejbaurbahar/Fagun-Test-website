import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmation } from './components/OrderConfirmation';
import { Footer } from './components/Footer';
import { SizeGuideModal } from './components/SizeGuideModal';

import { INITIAL_PRODUCTS } from './data/products';
import { Product, CartItem, Category, Currency, Order } from './types';
import { trackMtag, initAbandonmentTracking } from './utils/analytics';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<'shop' | 'checkout' | 'confirmation'>('shop');
  const [currentCategory, setCurrentCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [viewedProductCount, setViewedProductCount] = useState<number>(0);

  // Drawers & Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeGuideCategory, setSizeGuideCategory] = useState<'Clothing' | 'Footwear' | 'Accessories'>('Clothing');

  const handleOpenSizeGuide = (cat?: 'Clothing' | 'Footwear' | 'Accessories') => {
    if (cat) setSizeGuideCategory(cat);
    setIsSizeGuideOpen(true);
    trackMtag('ViewSizeGuide', { category: cat || 'Clothing' });
  };

  // Cart & Wishlist Local State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('fagun_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading cart:', e);
    }
    return [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedSize: 'M',
        selectedColor: 'Champagne Gold'
      }
    ];
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fagun_wishlist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading wishlist:', e);
    }
    return ['prod-1', 'prod-3'];
  });

  // Coupon & Discount State
  const [discountCode, setDiscountCode] = useState<string>('FAGUN10');
  const [discountAmount, setDiscountAmount] = useState<number>(10); // 10% off

  // Completed Order State
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Persist Cart
  useEffect(() => {
    try {
      localStorage.setItem('fagun_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cartItems]);

  // Persist Wishlist
  useEffect(() => {
    try {
      localStorage.setItem('fagun_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error('Error saving wishlist:', e);
    }
  }, [wishlistIds]);

  // Automatic Abandonment Tracking (AbandonCart, AbandonCheckout, AbandonBrowse)
  useEffect(() => {
    const cleanup = initAbandonmentTracking(() => ({
      cartItems,
      currentView,
      viewedProductCount,
      currency
    }));
    return cleanup;
  }, [cartItems, currentView, viewedProductCount, currency]);

  // Track PageView on view change
  useEffect(() => {
    trackMtag('PageView', { page: currentView });
  }, [currentView]);

  // Handler Actions
  const handleQuickAdd = (product: Product, size?: string) => {
    const selectedSize = size || (product.sizes ? product.sizes[0] : undefined);
    const selectedColor = product.colors ? product.colors[0].name : undefined;
    trackMtag('AddToCart', {
      source: 'QuickAdd',
      value: product.price,
      currency,
      products: [{
        id: product.id,
        sku: product.sku,
        name: product.name,
        category: product.category,
        badge: product.badge || null,
        price: product.price,
        original_price: product.originalPrice || product.price,
        rating: product.rating,
        in_stock: product.inStock,
        stock_count: product.stockCount,
        quantity: 1,
        size: selectedSize || 'N/A',
        color: selectedColor || 'N/A',
        image: product.images[0]
      }]
    });
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.product.id === product.id && i.selectedSize === selectedSize
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          selectedSize,
          selectedColor
        }
      ];
    });
  };

  const handleAddToCart = (product: Product, quantity: number, size?: string, color?: string) => {
    trackMtag('AddToCart', {
      source: 'ProductDetail',
      value: product.price * quantity,
      currency,
      products: [{
        id: product.id,
        sku: product.sku,
        name: product.name,
        category: product.category,
        badge: product.badge || null,
        description: product.description,
        price: product.price,
        original_price: product.originalPrice || product.price,
        rating: product.rating,
        reviews_count: product.reviewsCount,
        in_stock: product.inStock,
        stock_count: product.stockCount,
        quantity,
        size: size || 'N/A',
        color: color || 'N/A',
        image: product.images[0]
      }]
    });
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.product.id === product.id && i.selectedSize === size && i.selectedColor === color
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedSize: size,
          selectedColor: color
        }
      ];
    });
  };

  const handleBuyNow = (product: Product, quantity: number, size?: string, color?: string) => {
    handleAddToCart(product, quantity, size, color);
    setSelectedDetailProduct(null);
    trackMtag('InitiateCheckout', {
      source: 'BuyNow',
      value: product.price * quantity,
      currency,
      products: [{
        id: product.id,
        sku: product.sku,
        name: product.name,
        category: product.category,
        price: product.price,
        original_price: product.originalPrice || product.price,
        quantity,
        size: size || 'N/A',
        color: color || 'N/A',
        image: product.images[0]
      }]
    });
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateCartQty = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    const itemToRemove = cartItems[index];
    if (itemToRemove) {
      trackMtag('RemoveFromCart', {
        value: itemToRemove.product.price * itemToRemove.quantity,
        currency,
        products: [{
          id: itemToRemove.product.id,
          sku: itemToRemove.product.sku,
          name: itemToRemove.product.name,
          category: itemToRemove.product.category,
          price: itemToRemove.product.price,
          quantity: itemToRemove.quantity,
          size: itemToRemove.selectedSize || 'N/A',
          color: itemToRemove.selectedColor || 'N/A',
          image: itemToRemove.product.images[0]
        }],
        remaining_cart_items: cartItems.length - 1
      });
    }
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleWishlist = (product: Product) => {
    const isWishlisted = wishlistIds.includes(product.id);
    const wishlistPayload = {
      value: product.price,
      currency,
      products: [{
        id: product.id,
        sku: product.sku,
        name: product.name,
        category: product.category,
        badge: product.badge || null,
        price: product.price,
        original_price: product.originalPrice || product.price,
        rating: product.rating,
        in_stock: product.inStock,
        image: product.images[0]
      }],
      total_wishlist_count: wishlistIds.length + (isWishlisted ? -1 : 1)
    };
    if (!isWishlisted) {
      trackMtag('AddToWishlist', wishlistPayload);
    } else {
      trackMtag('RemoveFromWishlist', wishlistPayload);
    }
    setWishlistIds((prev) =>
      isWishlisted
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  const handleApplyDiscount = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    let isSuccess = false;
    let amount = 0;
    if (clean === 'FAGUN10' || clean === 'WELCOME10') {
      setDiscountCode(clean);
      setDiscountAmount(10); // 10%
      amount = 10;
      isSuccess = true;
    } else if (clean === 'FAGUN20' || clean === 'LUXURY20') {
      setDiscountCode(clean);
      setDiscountAmount(20); // 20%
      amount = 20;
      isSuccess = true;
    }
    trackMtag('ApplyCoupon', { coupon_code: clean, success: isSuccess, discount_percentage: amount });
    return isSuccess;
  };

  const handleCompleteOrder = (order: Order) => {
    trackMtag('Purchase', {
      transaction_id: order.id,
      order_date: order.date,
      value: order.total,
      subtotal: order.subtotal,
      discount: order.discount,
      shipping: order.shippingFee,
      tax: order.tax,
      currency: order.currency,
      payment_method: order.paymentDetails.method,
      customer: {
        email: order.shippingAddress.email || order.shippingAddress.emailOrPhone,
        phone: order.shippingAddress.phone || order.shippingAddress.emailOrPhone,
        first_name: order.shippingAddress.firstName,
        last_name: order.shippingAddress.lastName,
        full_name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.trim(),
        address: order.shippingAddress.address,
        apartment: order.shippingAddress.apartment || '',
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        zip_code: order.shippingAddress.zipCode,
        country: order.shippingAddress.country,
        email_newsletters: order.shippingAddress.emailNewsletters,
        text_newsletters: order.shippingAddress.textNewsletters
      },
      products: order.items.map((item) => ({
        id: item.product.id,
        sku: item.product.sku,
        name: item.product.name,
        category: item.product.category,
        badge: item.product.badge || null,
        price: item.product.price,
        original_price: item.product.originalPrice || item.product.price,
        quantity: item.quantity,
        size: item.selectedSize || 'N/A',
        color: item.selectedColor || 'N/A',
        line_total: item.product.price * item.quantity,
        image: item.product.images[0]
      }))
    });
    setCompletedOrder(order);
    setCartItems([]);
    setCurrentView('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProductDetail = (product: Product | null) => {
    if (product) {
      setViewedProductCount((prev) => prev + 1);
      trackMtag('ViewItem', {
        value: product.price,
        currency,
        products: [{
          id: product.id,
          sku: product.sku,
          name: product.name,
          category: product.category,
          badge: product.badge || null,
          description: product.description,
          price: product.price,
          original_price: product.originalPrice || product.price,
          rating: product.rating,
          reviews_count: product.reviewsCount,
          in_stock: product.inStock,
          stock_count: product.stockCount,
          sizes: product.sizes || [],
          colors: product.colors?.map(c => c.name) || [],
          image: product.images[0]
        }]
      });
    }
    setSelectedDetailProduct(product);
  };

  const wishlistProducts = INITIAL_PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[var(--neutral-950)] text-[var(--fg)] flex flex-col font-sans selection:bg-[var(--accent-lime)] selection:text-[var(--accent-lime-ink)]">
      
      {/* Top Header */}
      <Header
        currentCategory={currentCategory}
        onSelectCategory={(cat) => {
          trackMtag('SelectCategory', { category: cat });
          setCurrentCategory(cat);
          if (currentView !== 'shop') setCurrentView('shop');
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim()) trackMtag('Search', { search_string: q });
          if (currentView !== 'shop') setCurrentView('shop');
        }}
        currency={currency}
        onCurrencyChange={(c) => {
          trackMtag('ChangeCurrency', { currency: c });
          setCurrency(c);
        }}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => {
          trackMtag('ViewCart', { cart_count: cartItems.reduce((acc, i) => acc + i.quantity, 0) });
          setIsCartOpen(true);
        }}
        onOpenWishlist={() => {
          trackMtag('ViewWishlist', { wishlist_count: wishlistIds.length });
          setIsWishlistOpen(true);
        }}
        onNavigateCheckout={() => {
          trackMtag('InitiateCheckout', {
            currency,
            num_items: cartItems.reduce((acc, i) => acc + i.quantity, 0),
            products: cartItems.map((i) => ({ id: i.product.id, name: i.product.name, price: i.product.price, quantity: i.quantity }))
          });
          setCurrentView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateHome={() => {
          setCurrentView('shop');
          setCurrentCategory('All');
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentView={currentView}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'shop' && (
          <>
            {/* Hero Collection Showcase Banner */}
            <HeroBanner
              onShopNow={(cat) => {
                trackMtag('SelectCategory', { category: cat, source: 'HeroBanner' });
                setCurrentCategory(cat);
                const el = document.getElementById('catalog-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Catalog Grid */}
            <div id="catalog-grid">
              <ProductGrid
                products={INITIAL_PRODUCTS}
                currentCategory={currentCategory}
                onSelectCategory={(cat) => {
                  trackMtag('SelectCategory', { category: cat });
                  setCurrentCategory(cat);
                }}
                searchQuery={searchQuery}
                onSearchChange={(q) => {
                  setSearchQuery(q);
                  if (q.trim()) trackMtag('Search', { search_string: q });
                }}
                currency={currency}
                onQuickAdd={handleQuickAdd}
                onViewDetails={handleViewProductDetail}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
              />
            </div>
          </>
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            cartItems={cartItems}
            currency={currency}
            discountCode={discountCode}
            discountAmount={discountAmount}
            onApplyDiscount={handleApplyDiscount}
            onCompleteOrder={handleCompleteOrder}
            onBackToShop={() => {
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'confirmation' && (
          <OrderConfirmation
            order={completedOrder}
            onContinueShopping={() => {
              setCurrentView('shop');
              setCurrentCategory('All');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedDetailProduct}
        onClose={() => setSelectedDetailProduct(null)}
        currency={currency}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isWishlisted={selectedDetailProduct ? wishlistIds.includes(selectedDetailProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onOpenSizeGuide={handleOpenSizeGuide}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        currency={currency}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setCurrentView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        discountCode={discountCode}
        onApplyDiscount={handleApplyDiscount}
        discountAmount={discountAmount}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        currency={currency}
        onQuickAdd={(product) => handleQuickAdd(product)}
        onRemoveWishlist={handleToggleWishlist}
        onViewDetails={(product) => handleViewProductDetail(product)}
      />

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        initialCategory={sizeGuideCategory}
      />

      {/* Footer */}
      {currentView === 'shop' && <Footer onOpenSizeGuide={handleOpenSizeGuide} />}

    </div>
  );
}
