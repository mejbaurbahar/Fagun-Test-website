// Helper to get cookie
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Helper to set cookie
const setCookie = (name: string, value: string, days: number) => {
  if (typeof document === 'undefined') return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = '; expires=' + date.toUTCString();
  document.cookie = name + '=' + value + expires + '; path=/; SameSite=Lax; Secure';
};

// Helper to generate UUID
const generateUUID = (): string => {
  let d = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};

// Initialize MUID (persistent user identifier)
const getOrInitializeMuid = (): string => {
  if (typeof window === 'undefined') return '';
  let muid = localStorage.getItem('marktag_muid') || getCookie('marktag_muid');
  if (!muid) {
    muid = generateUUID();
    localStorage.setItem('marktag_muid', muid);
    setCookie('marktag_muid', muid, 365);
  }
  return muid;
};

// Initialize MSID (session identifier)
const getOrInitializeMsid = (): string => {
  if (typeof window === 'undefined') return '';
  let msid = sessionStorage.getItem('marktag_session_id');
  if (!msid) {
    msid = generateUUID();
    sessionStorage.setItem('marktag_session_id', msid);
  }
  return msid;
};

// MarkTag Analytics Event Helper
export const trackMtag = (eventType: string, data?: Record<string, any>) => {
  if (typeof window === 'undefined') return;

  const muid = getOrInitializeMuid();
  const msid = getOrInitializeMsid();
  const pageUrl = window.location.href;
  const clientId = 'dxoDDL';

  // Normalize event type names according to user requirements
  let normalizedEventName = eventType;
  if (eventType === 'AddToCart' || eventType === 'AddToCartClick') {
    normalizedEventName = 'Add To Cart';
  } else if (eventType === 'ViewContent' || eventType === 'PageView' || eventType === 'ViewItem') {
    normalizedEventName = 'View Content';
  }

  // Construct mandatory base payload structure requested by the user
  const payload = {
    type: normalizedEventName,
    clientId,
    isClient: true,
    isServer: false,
    msid,
    muid,
    pageUrl,
    timestamp: new Date().toISOString(),
    ...data
  };

  // Log to browser console so user can visually verify all details
  console.log(`%c[MarkTag SDK Event] ${normalizedEventName}`, 'color:#a3e635;font-weight:bold;font-size:12px;', payload);

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

  // 2. Direct POST request to https://mtag.markopolo.ai/mark?tagId=dxoDDL
  // This matches the exact network endpoint used by the real SDK to record hit in Network tab
  try {
    const endpoint = 'https://mtag.markopolo.ai/mark?tagId=dxoDDL';
    const bodyStr = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      const blob = new Blob([bodyStr], { type: 'application/json' });
      navigator.sendBeacon(endpoint, blob);
    } else {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: bodyStr,
        keepalive: true,
        credentials: 'omit'
      }).catch(() => {
        /* silent fallback */
      });
    }
  } catch (err) {
    /* silent fallback */
  }
};

/**
 * initAbandonmentTracking
 * Attaches unload listeners to detect:
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
    const muid = getOrInitializeMuid();
    const msid = getOrInitializeMsid();
    const pageUrl = window.location.href;
    const clientId = 'dxoDDL';

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

/**
 * Setup Automated Interactive Tracking
 * Tracks:
 *   - Scroll Depth events (25%, 50%, 75%, 100%)
 *   - page_duration heartbeats (every 10s)
 */
export const initInteractiveTracking = () => {
  if (typeof window === 'undefined') return;

  // 1. Scroll Depth tracking
  const trackedDepths = new Set<number>();
  const handleScroll = () => {
    const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight <= 0) return;

    const scrollPercent = Math.round((scrollTop / docHeight) * 100);
    const depthsToCheck = [25, 50, 75, 100];

    for (const depth of depthsToCheck) {
      if (scrollPercent >= depth && !trackedDepths.has(depth)) {
        trackedDepths.add(depth);
        trackMtag('scroll', {
          scroll: depth
        });
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // 2. page_duration heartbeat tracking (every 10 seconds)
  const startTime = Date.now();
  const durationInterval = setInterval(() => {
    const secondsElapsed = Math.round((Date.now() - startTime) / 1000);
    trackMtag('page_duration', {
      duration: secondsElapsed,
      sessionId: getOrInitializeMsid()
    });
  }, 10000);

  return () => {
    window.removeEventListener('scroll', handleScroll);
    clearInterval(durationInterval);
  };
};
