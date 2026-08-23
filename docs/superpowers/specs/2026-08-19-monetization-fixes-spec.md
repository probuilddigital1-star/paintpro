# Monetization Fixes Spec (2026-08-19)

## Context

AdSense rejected paintprocalculator.com three times. The site now runs on SEO plus Amazon Associates (tag `paintpro02-20`) with the affiliate links reactivated in commit `3f283ea`. A review of the codebase on 2026-08-19 found the following problems that depress affiliate and lead revenue. This spec captures the code-side fixes; dashboard and account tasks for Zack are listed at the end.

## Problems found

1. **Analytics drop most users.** `src/utils/analytics.ts` only fires GA4 events when `localStorage.cookie_consent === 'accepted'`. The banner in `CookieConsent.astro` is an opt-out model and loads GA4 for everyone who has not opted out, so visitors who never click "Got it" (the majority) generate zero `affiliate_click`, `calculator_used`, `cta_click`, and `email_signup` events. We cannot see which pages or links earn.
2. **No purchase path at the moment of highest intent.** The calculator result says "plan on N gallons" and shows no product. The generic three-card `AffiliateCards` block sits much further down the page and is not tied to the inputs.
3. **Amazon links are duplicated and hand-written.** ~180 search URLs are scattered through `blog-posts.ts`, `calculator-pages.ts`, and `AffiliateCards.astro`, each repeating the tag string. There is no single catalog to update when a product or retailer changes.
4. **No lead-gen path for people who decide not to DIY.** The email form already promises "local painter matching" and collects a zip code, but there is no CTA near the result pointing to a painter quote flow. Pay-per-lead pays $10 to $40 per lead versus cents per Amazon click.

## Goals

- Every GA4 event fires unless the visitor explicitly opted out.
- The live calculator (`Calculator.astro`) and the pre-rendered calculator pages (`StaticResults.astro`) both show up to four products chosen from the user's inputs, rendered directly under the result, with an FTC disclosure line and click tracking.
- One product catalog (`src/data/products.ts`) holds titles, descriptions, icons, retailer, and URLs; one helper builds Amazon search URLs with the tag. The recommendation rules live in a pure, unit-tested module (`src/utils/product-recommendations.ts`).
- A "Get painter quotes" CTA appears after the result on the homepage and on every calculator page. Its destination is `PUBLIC_PAINTER_LEAD_URL` when set, otherwise it scrolls to the existing `#lead-section` email form.

## Non-goals

- Replacing Amazon search URLs with specific ASIN product links (Zack picks the products; the catalog makes the swap a one-line change per product).
- Home Depot / Lowe's affiliate links (needs account approval first; the catalog has a `retailer` field ready for it).
- Any AdSense work. `PUBLIC_ADS_ENABLED` stays false.
- Blog post link changes.

## Constraints

- Affiliate rendering stays behind `affiliateEnabled` from `src/config/site.ts`.
- All Amazon links carry `tag=paintpro02-20` and `rel="noopener noreferrer sponsored"`.
- Any block of affiliate links shows a one-line disclosure that links to `/affiliate-disclosure`.
- Copy rules: no em dashes, no "delve", "game changer", "in conclusion", or similar AI-tell phrases.
- Keep INP habits already in `Calculator.astro`: build DOM nodes and use `replaceChildren`, no `innerHTML`.
- Tests use vitest (`npm test`), node environment, no jsdom. Browser globals are stubbed on `globalThis` in tests.
- Build must pass: `npm run build` (Astro 5, `build.format: 'file'`).

## Manual tasks for Zack (not in the code plan)

1. **Cloudflare cache:** the homepage was served with `Cache-Control: max-age=2678400` (31 days) while other pages show 3 hours, which points to a zone Cache Rule. In the Cloudflare account that owns `paintprocalculator.com`: Caching -> Cache Rules, find any rule with an Edge TTL override on `/` or `/*`, drop HTML edge TTL to 1 hour or less, then Caching -> Configuration -> Purge Everything. Pages already purges on deploy when no rule overrides it.
2. **Amazon Associates:** confirm the `paintpro02-20` tag and account are still active at affiliate-program.amazon.com. Accounts with no qualifying sales in the first 180 days get closed.
3. **Retailer programs:** apply to Home Depot (Impact) and Lowe's (CJ/Impact). When approved, add catalog entries with `retailer: 'homedepot'` / `'lowes'`.
4. **Lead network:** pick one pay-per-lead program (Networx, Angi/HomeAdvisor, Modernize), get the tracking link, and set `PUBLIC_PAINTER_LEAD_URL` in Cloudflare Pages -> Settings -> Environment variables (Production), then redeploy.
5. **Analytics access:** `paintprocalculator.com` is not in the `zckpearson@gmail.com` Cloudflare account (only probuilddigital.com is). To let Claude query Web Analytics, either `npx wrangler login` with the owning account or create an API token there with `Account Analytics: Read` and export it as `CLOUDFLARE_API_TOKEN`.
