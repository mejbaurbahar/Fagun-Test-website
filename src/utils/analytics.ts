// MarkTag Analytics Event Helper
export const trackMtag = (eventType: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    const payload = { type: eventType, timestamp: new Date().toISOString(), ...data };
    console.log(`[MarkTag Analytics] Event Triggered: ${eventType}`, payload);

    if (typeof (window as any).mtag === 'function') {
      (window as any).mtag('event', payload);
    } else if (Array.isArray((window as any).mtrem)) {
      (window as any).mtrem.push(['event', payload]);
    }
  }
};

/**
 * Automatically attaches unload listeners (beforeunload/pagehide)
 * to detect and fire CartAbandonment, CheckoutAbandonment, and BrowseAbandonment.
 */
export const initAbandonmentTracking = (getAppState: () => {
  cartItems: any[];
  currentView: string;
  viewedProductCount: number;
  currency: string;
}) => {
  if (typeof window === 'undefined') return;

  const handleUnload = () => {
    const state = getAppState();

    const detailedItems = state.cartItems.map((i: any) => ({
      id: i.product.id,
      sku: i.product.sku,
      name: i.product.name,
      category: i.product.category,
      badge: i.product.badge || null,
      price: i.product.price,
      original_price: i.product.originalPrice || i.product.price,
      quantity: i.quantity,
      size: i.selectedSize || 'N/A',
      color: i.selectedColor || 'N/A',
      line_total: i.product.price * i.quantity,
      image: i.product.images?.[0] || null
    }));

    const cartTotal = state.cartItems.reduce(
      (sum: number, i: any) => sum + i.product.price * i.quantity, 0
    );

    // 1. Checkout Abandonment
    if (state.currentView === 'checkout') {
      trackMtag('AbandonCheckout', {
        reason: 'PageUnloadOrNavigateAway',
        cart_count: state.cartItems.length,
        cart_total: cartTotal,
        currency: state.currency,
        items: detailedItems
      });
    }

    // 2. Cart Abandonment
    if (state.cartItems.length > 0 && state.currentView !== 'confirmation') {
      trackMtag('AbandonCart', {
        reason: 'PageUnloadWithItemsInCart',
        cart_count: state.cartItems.length,
        cart_total: cartTotal,
        currency: state.currency,
        items: detailedItems
      });
    }

    // 3. Browse Abandonment
    if (state.cartItems.length === 0 && state.viewedProductCount >= 2 && state.currentView === 'shop') {
      trackMtag('AbandonBrowse', {
        reason: 'PageUnloadAfterBrowsingProducts',
        viewed_count: state.viewedProductCount
      });
    }
  };

  window.addEventListener('beforeunload', handleUnload);
  return () => {
    window.removeEventListener('beforeunload', handleUnload);
  };
};
