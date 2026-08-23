// Consent-aware GA4 event tracking utility
// Safe for SSG  -  guards on typeof window

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Opt-out model: CookieConsent.astro loads GA4 for everyone who has not opted out,
// so events fire unless the visitor explicitly chose "Opt out".
function isTrackingReady(): boolean {
  if (typeof window === 'undefined') return false;
  if (!window.gtag) return false;
  try {
    return localStorage.getItem('cookie_consent') !== 'opted_out';
  } catch {
    return true;
  }
}

export function trackEvent(name: string, params?: Record<string, string | number>) {
  if (!isTrackingReady()) return;
  window.gtag!('event', name, params);
}

export function trackCalculatorUsed(params?: { page?: string; gallons?: number; primer?: number }) {
  trackEvent('calculator_used', params);
}

export function trackAffiliateClick(params?: { product?: string; link?: string; pageSource?: string }) {
  trackEvent('affiliate_click', params);
}

export function trackEmailSignup() {
  trackEvent('email_signup');
}

export function trackCtaClick(params?: { ctaText?: string; pageSource?: string }) {
  trackEvent('cta_click', params);
}
