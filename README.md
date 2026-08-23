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

The "Get painter quotes" button after calculator results links to a pay-per-lead program when this is set, and to the email signup form when it is empty:

```text
PUBLIC_PAINTER_LEAD_URL=https://example-network.com/your-tracking-link
```

All three variables are read at build time, so rebuild after changing them. The article data keeps its Amazon links either way; the affiliate flag only controls whether they render as links.

## Indexing

The smaller set of reviewed guides and room-specific calculator pages is defined in `src/config/indexing.ts`. Other existing routes remain available with `noindex, follow` and are excluded from the sitemap until they have been reviewed.
