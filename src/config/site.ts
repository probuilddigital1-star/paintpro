export const monetizationEnabled =
  import.meta.env.PUBLIC_MONETIZATION_ENABLED === 'true';

/**
 * Keep affiliate copy useful while monetization is paused.
 * The original links stay in the article data and return when the flag is enabled.
 */
export function prepareArticleHtml(html: string): string {
  if (monetizationEnabled) return html;

  return html.replace(
    /<a\b(?=[^>]*\bhref=["']https?:\/\/(?:www\.)?amazon\.com\/)[^>]*>([\s\S]*?)<\/a>/gi,
    '$1',
  );
}
