export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '1105907844975837';

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

// Track pageviews
export const pageview = () => {
  if (typeof window !== 'undefined' && window.fbq && FB_PIXEL_ID) {
    window.fbq('track', 'PageView');
  }
};

// Track standard events (e.g. ViewContent, AddToCart, InitiateCheckout, Purchase)
export const event = (name: string, options: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.fbq && FB_PIXEL_ID) {
    window.fbq('track', name, options);
  }
};

// Track custom events
export const customEvent = (name: string, options: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.fbq && FB_PIXEL_ID) {
    window.fbq('trackCustom', name, options);
  }
};
