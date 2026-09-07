# PaintPro Calculator

An Astro site for estimating interior paint quantities from room dimensions, openings, surface condition, texture, primer, and coat count.

## Local development

```sh
npm install
npm run dev
```

Run `npm run build` for a production build in `dist`.

## Monetization switches

Amazon affiliate links and product cards are live by default. To hide them, set:

```text
PUBLIC_AFFILIATE_ENABLED=false
```

AdSense ad slots and the AdSense script are off by default and only render when:

```text
PUBLIC_ADS_ENABLED=true
```

Both variables are read at build time, so rebuild after changing them. The article data keeps its Amazon links either way; the affiliate flag only controls whether they render as links.

Painter quote calls to action are plain links to `/hire-a-painter?src=<placement>` rendered by `src/components/PainterQuoteCTA.astro`. The Networx form embed lives only on that page.

## Indexing

The smaller set of reviewed guides and room-specific calculator pages is defined in `src/config/indexing.ts`. Other existing routes remain available with `noindex, follow` and are excluded from the sitemap until they have been reviewed.
