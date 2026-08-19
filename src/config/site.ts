// Affiliate links are live by default; set PUBLIC_AFFILIATE_ENABLED=false to hide them.
export const affiliateEnabled =
  import.meta.env.PUBLIC_AFFILIATE_ENABLED !== 'false';

// AdSense stays off unless explicitly enabled (account not approved).
export const adsEnabled = import.meta.env.PUBLIC_ADS_ENABLED === 'true';

/**
 * Keep affiliate copy useful while affiliate links are paused.
 * The original links stay in the article data and return when the flag is enabled.
 */
export function prepareArticleHtml(html: string): string {
  if (affiliateEnabled) return html;

  return html.replace(
    /<a\b(?=[^>]*\bhref=["']https?:\/\/(?:www\.)?amazon\.com\/)[^>]*>([\s\S]*?)<\/a>/gi,
    '$1',
  );
}
