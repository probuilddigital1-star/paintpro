import { afterEach, describe, expect, it, vi } from 'vitest';
import { trackAffiliateClick, trackEvent } from './analytics';

type Gtag = ReturnType<typeof vi.fn>;

function stubBrowser(consent: string | null, withGtag = true): Gtag {
  const gtag = vi.fn();
  (globalThis as Record<string, unknown>).window = withGtag ? { gtag } : {};
  (globalThis as Record<string, unknown>).localStorage = {
    getItem: (key: string) => (key === 'cookie_consent' ? consent : null),
  };
  return gtag;
}

afterEach(() => {
  delete (globalThis as Record<string, unknown>).window;
  delete (globalThis as Record<string, unknown>).localStorage;
});

describe('analytics consent gating (opt-out model)', () => {
  it('fires when the visitor has made no choice yet', () => {
    const gtag = stubBrowser(null);
    trackEvent('calculator_used', { page: 'home' });
    expect(gtag).toHaveBeenCalledWith('event', 'calculator_used', { page: 'home' });
  });

  it('fires when the visitor accepted', () => {
    const gtag = stubBrowser('accepted');
    trackAffiliateClick({ product: 'roller-kit', link: 'https://example.com', pageSource: 'test' });
    expect(gtag).toHaveBeenCalledWith('event', 'affiliate_click', {
      product: 'roller-kit',
      link: 'https://example.com',
      pageSource: 'test',
    });
  });

  it('does not fire when the visitor opted out', () => {
    const gtag = stubBrowser('opted_out');
    trackEvent('calculator_used');
    expect(gtag).not.toHaveBeenCalled();
  });

  it('does not throw when gtag is not loaded', () => {
    stubBrowser(null, false);
    expect(() => trackEvent('calculator_used')).not.toThrow();
  });
});
