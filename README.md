# PaintPro Calculator

An Astro site for estimating interior paint quantities from room dimensions, openings, surface condition, texture, primer, and coat count.

## Local development

```sh
npm install
npm run dev
```

Run `npm run build` for a production build in `dist`.

## Monetization switch

Affiliate links, product cards, and ad slots are preserved but hidden by default while the site is under review.

Copy `.env.example` to `.env` if the variable is not already defined:

```text
PUBLIC_MONETIZATION_ENABLED=false
```

After approval, set the value to `true` and rebuild. This restores the existing Amazon links, affiliate cards, and ad slots without changing the article data.

## Indexing

The smaller set of reviewed guides and room-specific calculator pages is defined in `src/config/indexing.ts`. Other existing routes remain available with `noindex, follow` and are excluded from the sitemap until they have been reviewed.
