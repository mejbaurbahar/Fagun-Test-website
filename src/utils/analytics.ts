// MarkTag Analytics Event Helper
export const trackMtag = (eventType: string, data?: Record<string, any>) => {
  if (typeof window === 'undefined') return;

  const payload = {
    type: eventType,
    timestamp: new Date().toISOString(),
    tagId: 'dxoDDL',
    ...data
  };

  // Log to browser console so user and developers can visually verify event payload
  console.log(`%c[MarkTag SDK Event] ${eventType}`, 'color:#a3e635;font-weight:bold;font-size:12px;', payload);

  // 1. Call global mtag function & mtrem queue
  try {
    if (typeof (window as any).mtag === 'function') {
      (window as any).mtag('event', payload);
    }
    (window as any).mtrem = (window as any).mtrem || [];
    (window as any).mtrem.push(['event', payload]);
  } catch (err) {
    console.error('[MarkTag] Error invoking mtag:', err);
  }

  // 2. Direct network beacon / fetch dispatch to ensure an HTTP request is recorded in DevTools Network tab
  try {
    const endpoint = 'https://mtag.markopolo.ai/event?tagId=dxoDDL';
    const bodyStr = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      const blob = new Blob([bodyStr], { type: 'application/json' });
      navigator.sendBeacon(endpoint, blob);
    } else {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: bodyStr,
        keepalive: true
      }).catch(() => {
        /* Network error fallback handled silently */
      });
    }
  } catch (err) {
    /* silent fallback */
  }
};

/**
 * initAbandonmentTracking
 * Attaches unload listeners (beforeunload/pagehide) to detect:
 *   - AbandonCheckout
 *   - AbandonCart
 *   - AbandonBrowse
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
  window.addEventListener('pagehide', handleUnload);

  return () => {
    window.removeEventListener('beforeunload', handleUnload);
    window.removeEventListener('pagehide', handleUnload);
  };
};
