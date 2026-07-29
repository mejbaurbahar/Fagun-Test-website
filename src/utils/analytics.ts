export const trackMtag = (eventType: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    if (typeof (window as any).mtag === 'function') {
      (window as any).mtag('event', { type: eventType, ...data });
    } else if (Array.isArray((window as any).mtrem)) {
      (window as any).mtrem.push(['event', { type: eventType, ...data }]);
    }
  }
};
