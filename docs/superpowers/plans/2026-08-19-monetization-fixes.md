# Monetization Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make affiliate clicks measurable, show input-matched products and a painter-quote CTA right under the calculator result, and centralize the product catalog.

**Architecture:** A pure TypeScript catalog (`src/data/products.ts`) and a pure recommendation function (`src/utils/product-recommendations.ts`) are unit-tested with vitest and consumed in two places: the client-side script in `Calculator.astro` (live homepage calculator) and server-side in `StaticResults.astro` (pre-rendered `/paint-calculator/*` pages). A small `PainterQuoteCta.astro` component reads `PUBLIC_PAINTER_LEAD_URL` at build time and falls back to the existing email form anchor. The analytics consent check flips from opt-in to opt-out to match the banner.

**Tech Stack:** Astro 5 (static, `build.format: 'file'`), TypeScript, Tailwind 4, vitest 4 (node env, no jsdom), GA4 via `gtag`.

**Spec:** `docs/superpowers/specs/2026-08-19-monetization-fixes-spec.md`

## Global Constraints

- Affiliate markup renders only when `affiliateEnabled` (from `src/config/site.ts`) is true. Ads stay off.
- Every Amazon URL is built by `amazonSearch()` in `src/data/products.ts` and ends with `&tag=paintpro02-20`.
- Every affiliate anchor has `target="_blank"` and `rel="noopener noreferrer sponsored"`, plus `data-affiliate-product`, `data-affiliate-link`, `data-page-source` attributes, and calls `trackAffiliateClick` on click.
- Every affiliate block includes a disclosure line linking to `/affiliate-disclosure`.
- Copy: no em dashes, no "delve", "game changer", "in conclusion", "unlock", "elevate".
- DOM updates in `Calculator.astro` use `document.createElement` + `replaceChildren`, never `innerHTML`.
- Run `npm test` and `npm run build` before each commit. Both must pass.
- Commit messages end with the project trailer:
  ```
  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
  ```

---

### Task 1: Fire analytics events unless the visitor opted out

**Files:**
- Modify: `src/utils/analytics.ts:10-18`
- Test: `src/utils/analytics.test.ts` (create)

**Interfaces:**
- Consumes: nothing new.
- Produces: unchanged exports `trackEvent`, `trackCalculatorUsed`, `trackAffiliateClick`, `trackEmailSignup`, `trackCtaClick`. Only the gating rule changes: events fire when `window.gtag` exists and `localStorage.cookie_consent !== 'opted_out'`.

- [ ] **Step 1: Write the failing test**

Create `src/utils/analytics.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/utils/analytics.test.ts`
Expected: the first test ("no choice yet") FAILS because `gtag` was not called. The other three pass already.

- [ ] **Step 3: Change the gating rule**

In `src/utils/analytics.ts`, replace the `isTrackingReady` function (lines 10-18) with:

```ts
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/utils/analytics.test.ts`
Expected: 4 passed.

- [ ] **Step 5: Run the full suite and build**

Run: `npm test && npm run build`
Expected: all tests pass (16 total after this task), build completes with 75 pages.

- [ ] **Step 6: Commit**

```bash
git add src/utils/analytics.ts src/utils/analytics.test.ts
git commit -m "Fire GA4 events unless visitor opted out

The consent banner is opt-out, but analytics.ts only tracked after an
explicit accept, so most visitors sent no affiliate or calculator events.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Product catalog and recommendation engine

**Files:**
- Create: `src/data/products.ts`
- Create: `src/utils/product-recommendations.ts`
- Test: `src/utils/product-recommendations.test.ts` (create)

**Interfaces:**
- Consumes: `CalculationInputs`, `CalculationResults`, `calculatePaint` from `src/utils/paint-calculator.ts` (existing).
- Produces:
  - `src/data/products.ts`: `AMAZON_TAG: string`, `amazonSearch(query: string): string`, `type Retailer = 'amazon' | 'homedepot' | 'lowes'`, `type ProductId` (string union below), `interface Product { id: ProductId; title: string; description: string; icon: string; url: string; cta: string; retailer: Retailer }`, `products: Record<ProductId, Product>`.
  - `src/utils/product-recommendations.ts`: `interface Recommendation { product: Product; reason: string }`, `MAX_RECOMMENDATIONS = 4`, `recommendProducts(inputs: CalculationInputs, results: CalculationResults): Recommendation[]`.

- [ ] **Step 1: Write the failing test**

Create `src/utils/product-recommendations.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { calculatePaint, type CalculationInputs } from './paint-calculator';
import { MAX_RECOMMENDATIONS, recommendProducts } from './product-recommendations';
import { AMAZON_TAG } from '../data/products';

const baseInputs: CalculationInputs = {
  length: 12,
  width: 12,
  height: 8,
  doors: 1,
  frenchDoors: 0,
  closetDoors: 0,
  windows: 1,
  largeWindows: 0,
  smallWindows: 0,
  surfaceType: 'walls',
  numCoats: 2,
  paintQuality: 'standard',
  includeWaste: true,
  wallTexture: 'smooth',
  ceilingTexture: 'smooth',
  surfaceCondition: 'good',
  roomType: 'bedroom',
  needsPrimer: false,
};

function recsFor(overrides: Partial<CalculationInputs>) {
  const inputs = { ...baseInputs, ...overrides };
  return recommendProducts(inputs, calculatePaint(inputs));
}

const ids = (overrides: Partial<CalculationInputs>) => recsFor(overrides).map((r) => r.product.id);

describe('recommendProducts', () => {
  it('never returns more than MAX_RECOMMENDATIONS and never repeats a product', () => {
    const result = ids({ needsPrimer: true, primerType: 'pva', surfaceCondition: 'stained', roomType: 'bathroom', wallTexture: 'heavy', height: 10 });
    expect(result.length).toBeLessThanOrEqual(MAX_RECOMMENDATIONS);
    expect(new Set(result).size).toBe(result.length);
  });

  it('recommends generic wall paint and a roller kit for a plain bedroom', () => {
    const result = ids({});
    expect(result).toContain('interior-paint');
    expect(result).toContain('roller-kit');
    expect(result).not.toContain('primer-standard');
  });

  it('puts the matching primer first when primer is selected', () => {
    expect(ids({ needsPrimer: true, primerType: 'pva' })[0]).toBe('primer-pva');
    expect(ids({ needsPrimer: true, primerType: 'high-hide' })[0]).toBe('primer-high-hide');
    expect(ids({ needsPrimer: true, primerType: 'standard' })[0]).toBe('primer-standard');
  });

  it('matches paint to the room type', () => {
    expect(ids({ roomType: 'bathroom' })).toContain('bathroom-paint');
    expect(ids({ roomType: 'kitchen' })).toContain('kitchen-paint');
    expect(ids({ roomType: 'basement' })).toContain('basement-paint');
  });

  it('swaps roller kit for trim paint and an angled brush on trim jobs', () => {
    const result = ids({ surfaceType: 'trim' });
    expect(result).toContain('trim-paint');
    expect(result).toContain('angled-brush');
    expect(result).not.toContain('roller-kit');
  });

  it('adds a shellac primer for stained walls and a deglosser for glossy walls', () => {
    expect(ids({ surfaceCondition: 'stained' })).toContain('primer-shellac');
    expect(ids({ surfaceCondition: 'glossy' })).toContain('deglosser');
  });

  it('suggests a sprayer once the purchase is five gallons or more', () => {
    expect(ids({ length: 40, width: 40, height: 10, surfaceType: 'walls-ceiling' })).toContain('sprayer');
    expect(ids({})).not.toContain('sprayer');
  });

  it('suggests a thick nap roller for textured walls or ceilings', () => {
    expect(ids({ wallTexture: 'heavy' })).toContain('thick-nap-roller');
    expect(ids({ surfaceType: 'ceiling' })).toContain('thick-nap-roller');
  });

  it('every recommendation carries the Associates tag and a reason', () => {
    for (const rec of recsFor({ needsPrimer: true, primerType: 'standard' })) {
      expect(rec.product.url).toContain(`tag=${AMAZON_TAG}`);
      expect(rec.product.url.startsWith('https://www.amazon.com/s?k=')).toBe(true);
      expect(rec.reason.length).toBeGreaterThan(10);
      expect(rec.reason).not.toContain('—');
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/utils/product-recommendations.test.ts`
Expected: FAIL with "Failed to resolve import" for `./product-recommendations` and `../data/products`.

- [ ] **Step 3: Create the catalog**

Create `src/data/products.ts`:

```ts
// Single source of truth for affiliate products.
// Amazon Associates tag: paintpro02-20. Search URLs today; swap `url` for a
// specific product page (https://www.amazon.com/dp/ASIN?tag=paintpro02-20)
// once a product has been chosen and checked.

export const AMAZON_TAG = 'paintpro02-20';

export function amazonSearch(query: string): string {
  const k = encodeURIComponent(query.trim()).replace(/%20/g, '+');
  return `https://www.amazon.com/s?k=${k}&tag=${AMAZON_TAG}`;
}

export type Retailer = 'amazon' | 'homedepot' | 'lowes';

export type ProductId =
  | 'interior-paint'
  | 'bathroom-paint'
  | 'kitchen-paint'
  | 'basement-paint'
  | 'garage-floor-epoxy'
  | 'ceiling-paint'
  | 'trim-paint'
  | 'primer-standard'
  | 'primer-pva'
  | 'primer-high-hide'
  | 'primer-shellac'
  | 'deglosser'
  | 'roller-kit'
  | 'thick-nap-roller'
  | 'angled-brush'
  | 'extension-pole'
  | 'painters-tape'
  | 'drop-cloth'
  | 'sprayer'
  | 'supplies-kit';

export interface Product {
  id: ProductId;
  title: string;
  description: string;
  /** Icon key understood by AffiliateCards.astro: brush | paint | sprayer | primer | roller | tape */
  icon: string;
  url: string;
  cta: string;
  retailer: Retailer;
}

function amazon(id: ProductId, title: string, description: string, icon: string, query: string, cta: string): Product {
  return { id, title, description, icon, url: amazonSearch(query), cta, retailer: 'amazon' };
}

export const products: Record<ProductId, Product> = {
  'interior-paint': amazon('interior-paint', 'Interior wall paint', 'Top-rated interior paint for walls.', 'paint', 'interior wall paint gallon', 'Browse paint'),
  'bathroom-paint': amazon('bathroom-paint', 'Mildew-resistant bathroom paint', 'Moisture and mildew resistant finish for bathrooms.', 'paint', 'mildew resistant bathroom paint', 'Browse bathroom paint'),
  'kitchen-paint': amazon('kitchen-paint', 'Scrubbable kitchen paint', 'Washable satin or semi-gloss for kitchen walls.', 'paint', 'scrub resistant kitchen paint', 'Browse kitchen paint'),
  'basement-paint': amazon('basement-paint', 'Mold-resistant basement paint', 'Coatings made for below-grade walls.', 'paint', 'mold resistant basement paint', 'Browse basement paint'),
  'garage-floor-epoxy': amazon('garage-floor-epoxy', 'Garage floor epoxy kit', 'Two-part epoxy coating for concrete floors.', 'paint', 'epoxy garage floor coating kit', 'View epoxy kits'),
  'ceiling-paint': amazon('ceiling-paint', 'Flat white ceiling paint', 'Flat finish hides roller marks overhead.', 'paint', 'ceiling paint white flat', 'Browse ceiling paint'),
  'trim-paint': amazon('trim-paint', 'Semi-gloss trim paint', 'Durable enamel for trim, doors, and baseboards.', 'paint', 'semi gloss trim paint white', 'Browse trim paint'),
  'primer-standard': amazon('primer-standard', 'Interior primer', 'Water-based primer for most repaints.', 'primer', 'Zinsser 123 primer', 'View primer'),
  'primer-pva': amazon('primer-pva', 'PVA drywall primer', 'Seals new drywall so the finish coat covers evenly.', 'primer', 'PVA drywall primer', 'View PVA primer'),
  'primer-high-hide': amazon('primer-high-hide', 'High-hide primer', 'Tinted primer for strong color changes.', 'primer', 'high hide primer paint', 'View primer'),
  'primer-shellac': amazon('primer-shellac', 'Shellac stain-blocking primer', 'Blocks water stains, smoke, and tannin bleed.', 'primer', 'Zinsser BIN shellac primer', 'View stain blocker'),
  'deglosser': amazon('deglosser', 'Liquid deglosser', 'Dulls glossy paint so the new coat sticks.', 'primer', 'liquid deglosser paint prep', 'View deglosser'),
  'roller-kit': amazon('roller-kit', '9-inch roller kit with tray', 'Frame, covers, and tray for walls.', 'roller', 'paint roller kit with tray 9 inch', 'View roller kits'),
  'thick-nap-roller': amazon('thick-nap-roller', '3/4-inch nap roller covers', 'Thick nap for textured walls and ceilings.', 'roller', '3/4 inch nap roller cover', 'View roller covers'),
  'angled-brush': amazon('angled-brush', '2.5-inch angled sash brush', 'Sharp lines on trim and cut-ins.', 'brush', 'purdy angled sash brush 2.5 inch', 'View brushes'),
  'extension-pole': amazon('extension-pole', 'Telescoping extension pole', 'Reach ceilings and tall walls without a ladder.', 'roller', 'paint roller extension pole telescoping', 'View poles'),
  'painters-tape': amazon('painters-tape', 'Painter\'s tape', 'Clean edges along trim and ceilings.', 'tape', 'FrogTape painters tape', 'View tape'),
  'drop-cloth': amazon('drop-cloth', 'Canvas drop cloth', 'Protects floors and furniture.', 'tape', 'canvas drop cloth painting', 'View drop cloths'),
  'sprayer': amazon('sprayer', 'Airless paint sprayer', 'Saves hours on big rooms and whole-house jobs.', 'sprayer', 'airless paint sprayer', 'View sprayers'),
  'supplies-kit': amazon('supplies-kit', 'Paint supplies kit', 'Rollers, brushes, tape, and drop cloths in one box.', 'brush', 'paint supplies kit', 'Shop supplies'),
};
```

- [ ] **Step 4: Create the recommendation engine**

Create `src/utils/product-recommendations.ts`:

```ts
import type { CalculationInputs, CalculationResults } from './paint-calculator';
import { products, type Product, type ProductId } from '../data/products';

export interface Recommendation {
  product: Product;
  reason: string;
}

export const MAX_RECOMMENDATIONS = 4;

/**
 * Pick up to four products that match what the visitor told the calculator.
 * Order matters: primer and prep first, then the paint, then tools.
 * Pure function: no DOM, no env access, safe on server and client.
 */
export function recommendProducts(inputs: CalculationInputs, results: CalculationResults): Recommendation[] {
  const picks: Array<{ id: ProductId; reason: string }> = [];
  const add = (id: ProductId, reason: string) => {
    if (!picks.some((p) => p.id === id)) picks.push({ id, reason });
  };

  const gallons = results.estimateRange.likely.purchaseGallons;
  const paintsCeiling = inputs.surfaceType === 'ceiling' || inputs.surfaceType === 'walls-ceiling';

  // 1. Primer and prep
  if (inputs.needsPrimer) {
    if (inputs.primerType === 'pva') add('primer-pva', 'You selected PVA primer, the right choice for bare drywall.');
    else if (inputs.primerType === 'high-hide') add('primer-high-hide', 'High-hide primer cuts the number of finish coats on a strong color change.');
    else add('primer-standard', `Plan on about ${Math.max(1, results.primerGallons)} gallon(s) of primer.`);
  }
  if (inputs.surfaceCondition === 'stained') add('primer-shellac', 'Shellac primer blocks water stains and smoke before the finish coat.');
  if (inputs.surfaceCondition === 'glossy') add('deglosser', 'Glossy surfaces need deglossing or sanding so the new paint sticks.');

  // 2. Paint, matched to surface first, then room
  if (inputs.surfaceType === 'trim') add('trim-paint', 'Semi-gloss enamel holds up to cleaning on trim and doors.');
  else if (inputs.surfaceType === 'ceiling') add('ceiling-paint', 'Flat ceiling paint hides roller marks overhead.');
  else if (inputs.roomType === 'bathroom') add('bathroom-paint', 'Bathrooms need a mildew-resistant finish.');
  else if (inputs.roomType === 'kitchen') add('kitchen-paint', 'Kitchen walls get scrubbed, so pick a washable finish.');
  else if (inputs.roomType === 'basement') add('basement-paint', 'Basement walls do better with a mold-resistant coating.');
  else if (inputs.roomType === 'garage') add('garage-floor-epoxy', 'Most garage projects include the floor; an epoxy kit is the durable option.');
  else add('interior-paint', `You need about ${gallons} gallon(s) of wall paint.`);

  // 3. Tools
  if (gallons >= 5) add('sprayer', 'At five gallons or more, a sprayer saves hours of rolling.');
  if (paintsCeiling || inputs.wallTexture === 'medium' || inputs.wallTexture === 'heavy') {
    add('thick-nap-roller', 'Textured walls and ceilings need a 3/4-inch nap roller cover.');
  }
  if (inputs.surfaceType === 'trim') add('angled-brush', 'A 2.5-inch angled sash brush gives clean lines on trim.');
  else add('roller-kit', 'A 9-inch roller kit with a tray covers walls quickly.');
  if (inputs.height > 9 || paintsCeiling) add('extension-pole', 'An extension pole reaches tall walls and ceilings without a ladder.');
  add('painters-tape', 'Tape off trim and ceilings for sharp edges.');
  add('drop-cloth', 'Cover floors before the first can opens.');

  return picks.slice(0, MAX_RECOMMENDATIONS).map((p) => ({ product: products[p.id], reason: p.reason }));
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/utils/product-recommendations.test.ts`
Expected: 9 passed. If the sprayer test fails, print `calculatePaint({...baseInputs, length: 40, width: 40, height: 10, surfaceType: 'walls-ceiling'}).estimateRange.likely.purchaseGallons` in a scratch test; it must be >= 5 (a 40x40x10 room with ceiling is roughly 3,200 sq ft, two coats, well over 5 gallons). Do not weaken the threshold; adjust the room size in the test if needed.

- [ ] **Step 6: Run the full suite**

Run: `npm test`
Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add src/data/products.ts src/utils/product-recommendations.ts src/utils/product-recommendations.test.ts
git commit -m "Add product catalog and input-matched recommendation engine

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Point AffiliateCards defaults at the catalog

**Files:**
- Modify: `src/components/AffiliateCards.astro:1-37`

**Interfaces:**
- Consumes: `products` from `src/data/products.ts` (Task 2).
- Produces: no API change. `AffiliateCards` still accepts `products?: AffiliateProduct[]` and `pageSource?: string`.

- [ ] **Step 1: Replace the hand-written defaults**

In `src/components/AffiliateCards.astro`, replace lines 1-37 (frontmatter through `const affiliates = ...`) with:

```astro
---
// Affiliate product cards. Defaults come from the central catalog in src/data/products.ts.
import type { AffiliateProduct } from '../data/calculator-pages';
import { affiliateEnabled } from '../config/site';
import { products } from '../data/products';

interface Props {
  products?: AffiliateProduct[];
  pageSource?: string;
}

const { products: overrides, pageSource } = Astro.props;

const defaultProducts: AffiliateProduct[] = (['supplies-kit', 'interior-paint', 'sprayer'] as const).map((id) => ({
  title: products[id].title,
  description: products[id].description,
  icon: products[id].icon,
  link: products[id].url,
  cta: products[id].cta,
}));

const affiliates = overrides ?? defaultProducts;
---
```

Leave everything from `{affiliateEnabled && <section id="affiliate-section"` onward unchanged.

- [ ] **Step 2: Build and check the rendered cards**

Run: `npm run build && grep -o 'data-affiliate-product="[^"]*"' dist/index.html`
Expected: three matches: `Paint supplies kit`, `Interior wall paint`, `Airless paint sprayer`, and the build completes.

- [ ] **Step 3: Commit**

```bash
git add src/components/AffiliateCards.astro
git commit -m "Source default affiliate cards from the product catalog

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Show recommended products under the live calculator result

**Files:**
- Modify: `src/components/Calculator.astro:593` (markup, after the "Before you buy" box closes)
- Modify: `src/components/Calculator.astro:606-618` (script imports)
- Modify: `src/components/Calculator.astro:854-861` (after tips render)

**Interfaces:**
- Consumes: `recommendProducts` (Task 2), `affiliateEnabled` from `src/config/site.ts`, `trackAffiliateClick` from `src/utils/analytics.ts`.
- Produces: DOM ids `recommended-products` (wrapper) and `recommended-products-list` (`<ul>`), page source value `calculator-result`.

- [ ] **Step 1: Add the markup**

In `src/components/Calculator.astro`, directly after the closing `</div>` of the "Before you buy" box (line 593, the `</div>` following `</ul>` of `#tips-list`) and before `<!-- Reset Button -->`, insert:

```html
    <!-- Recommended products (affiliate, hidden until a result exists) -->
    <div id="recommended-products" class="mt-6 hidden">
      <h3 class="font-semibold text-heading mb-1">Supplies for this room</h3>
      <p class="text-xs text-gray-500 mb-3">
        Picked from your inputs. Links go to Amazon and we may earn a commission at no extra cost to you.
        <a href="/affiliate-disclosure" class="underline hover:text-primary">Details</a>
      </p>
      <ul id="recommended-products-list" class="grid sm:grid-cols-2 gap-3"></ul>
    </div>
```

- [ ] **Step 2: Add the imports**

In the `<script>` block (starts line 606), change the analytics import on line 618 from:

```ts
  import { trackCalculatorUsed } from '../utils/analytics';
```

to:

```ts
  import { trackCalculatorUsed, trackAffiliateClick } from '../utils/analytics';
  import { recommendProducts } from '../utils/product-recommendations';
  import { affiliateEnabled } from '../config/site';
```

- [ ] **Step 3: Render recommendations after the tips**

Directly after this existing block (around line 854-861):

```ts
        const tipsList = document.getElementById('tips-list') as HTMLElement;
        const tipElements = tips.map(tip => {
          const li = document.createElement('li');
          li.textContent = tip;
          return li;
        });
        tipsList.replaceChildren(...tipElements);
```

insert:

```ts
        // Recommended products, matched to the inputs (affiliate)
        const recBox = document.getElementById('recommended-products') as HTMLElement;
        const recList = document.getElementById('recommended-products-list') as HTMLElement;
        if (affiliateEnabled) {
          const recs = recommendProducts(inputs, results);
          recList.replaceChildren(...recs.map(({ product, reason }) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = product.url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer sponsored';
            a.className = 'block h-full p-3 rounded-lg border border-border bg-white hover:border-primary/40 hover:shadow-sm transition';
            a.dataset.affiliateProduct = product.id;
            a.dataset.affiliateLink = product.url;
            a.dataset.pageSource = 'calculator-result';

            const title = document.createElement('span');
            title.className = 'block font-medium text-heading text-sm';
            title.textContent = product.title;

            const why = document.createElement('span');
            why.className = 'block text-xs text-body mt-1';
            why.textContent = reason;

            const cta = document.createElement('span');
            cta.className = 'block text-xs text-primary font-medium mt-2';
            cta.textContent = `${product.cta} ›`;

            a.append(title, why, cta);
            a.addEventListener('click', () => {
              trackAffiliateClick({ product: product.id, link: product.url, pageSource: 'calculator-result' });
            });
            li.appendChild(a);
            return li;
          }));
          recBox.classList.toggle('hidden', recs.length === 0);
        } else {
          recBox.classList.add('hidden');
        }
```

- [ ] **Step 4: Build and verify the markup ships**

Run: `npm run build && grep -c 'id="recommended-products-list"' dist/index.html`
Expected: `1`, build completes with no TypeScript errors in the Astro script.

- [ ] **Step 5: Verify in the browser**

Run: `npm run dev`, open http://localhost:4321, set Room type to Bathroom, tick "needs primer" with PVA, submit.
Expected: under "Before you buy" a "Supplies for this room" block with four cards; the first is "PVA drywall primer", one is "Mildew-resistant bathroom paint"; each card opens an Amazon search in a new tab and the URL contains `tag=paintpro02-20`. Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add src/components/Calculator.astro
git commit -m "Show input-matched affiliate products under the calculator result

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Show recommended products on pre-rendered calculator pages

**Files:**
- Modify: `src/components/StaticResults.astro:1-13` (frontmatter)
- Modify: `src/components/StaticResults.astro` (before the closing `</div></section>`, after the "See the formula and assumptions" paragraph)

**Interfaces:**
- Consumes: `recommendProducts` (Task 2), `affiliateEnabled`, `trackAffiliateClick`.
- Produces: page source value `calculator-static`.

- [ ] **Step 1: Compute recommendations in the frontmatter**

In `src/components/StaticResults.astro`, replace the frontmatter (lines 1-13) with:

```astro
---
import type { CalculationResults, CalculationInputs } from '../utils/paint-calculator';
import { roomRecommendations } from '../utils/paint-calculator';
import { recommendProducts } from '../utils/product-recommendations';
import { affiliateEnabled } from '../config/site';

interface Props {
  results: CalculationResults;
  inputs: CalculationInputs;
}

const { results, inputs } = Astro.props;

const totalArea = Math.round(results.paintableArea + results.ceilingPaintableArea);
const recommendation = roomRecommendations[inputs.roomType];
const recs = affiliateEnabled ? recommendProducts(inputs, results) : [];
---
```

- [ ] **Step 2: Render the block**

Directly after this existing paragraph near the end of the file:

```astro
    <p class="text-center mt-3">
      <a href="/calculator-methodology" class="text-sm text-primary font-medium hover:underline">See the formula and assumptions</a>
    </p>
```

and before the closing `  </div>\n</section>`, insert:

```astro
    {recs.length > 0 && (
      <div class="mt-6 pt-6 border-t border-border">
        <h3 class="font-semibold text-heading mb-1">Supplies for this room</h3>
        <p class="text-xs text-gray-500 mb-3">
          Picked from the inputs above. Links go to Amazon and we may earn a commission at no extra cost to you.
          <a href="/affiliate-disclosure" class="underline hover:text-primary">Details</a>
        </p>
        <ul class="grid sm:grid-cols-2 gap-3">
          {recs.map(({ product, reason }) => (
            <li>
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                class="block h-full p-3 rounded-lg border border-border bg-white hover:border-primary/40 hover:shadow-sm transition"
                data-affiliate-product={product.id}
                data-affiliate-link={product.url}
                data-page-source="calculator-static"
              >
                <span class="block font-medium text-heading text-sm">{product.title}</span>
                <span class="block text-xs text-body mt-1">{reason}</span>
                <span class="block text-xs text-primary font-medium mt-2">{product.cta} &rsaquo;</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    )}
```

Then append at the very end of the file (after `</section>`):

```astro
<script>
  import { trackAffiliateClick } from '../utils/analytics';

  document.querySelectorAll<HTMLAnchorElement>('[data-page-source="calculator-static"]').forEach((link) => {
    link.addEventListener('click', () => {
      trackAffiliateClick({
        product: link.dataset.affiliateProduct,
        link: link.dataset.affiliateLink,
        pageSource: 'calculator-static',
      });
    });
  });
</script>
```

- [ ] **Step 3: Build and verify**

Run: `npm run build && grep -l 'data-page-source="calculator-static"' dist/paint-calculator/*.html | wc -l && grep -o 'data-affiliate-product="[^"]*"' dist/paint-calculator/bathroom-paint-calculator.html | head`
Expected: the count equals the number of calculator pages (every page gets at least the generic paint + roller picks); the bathroom page lists `bathroom-paint` among its products.

- [ ] **Step 4: Commit**

```bash
git add src/components/StaticResults.astro
git commit -m "Render input-matched affiliate products on static calculator pages

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Painter quote CTA after the result

**Files:**
- Create: `src/components/PainterQuoteCta.astro`
- Modify: `src/pages/index.astro:23` (after `<Calculator />`)
- Modify: `src/pages/paint-calculator/[slug].astro:6` (import) and `:151` (after `<StaticResults ... />`)
- Modify: `.env.example`
- Modify: `README.md` (Monetization switches section)

**Interfaces:**
- Consumes: `trackCtaClick` from `src/utils/analytics.ts`; env `PUBLIC_PAINTER_LEAD_URL` (optional, build time).
- Produces: `<PainterQuoteCta pageSource="home" />` with optional `pageSource?: string` prop. Anchor has `data-painter-cta`.

- [ ] **Step 1: Create the component**

Create `src/components/PainterQuoteCta.astro`:

```astro
---
// "Get painter quotes" CTA shown after a calculator result.
// Destination: PUBLIC_PAINTER_LEAD_URL (pay-per-lead tracking link) when set,
// otherwise the email signup form, which already collects a zip code.
interface Props {
  pageSource?: string;
}

const { pageSource = 'default' } = Astro.props;
const leadUrl = (import.meta.env.PUBLIC_PAINTER_LEAD_URL as string | undefined)?.trim();
const href = leadUrl && leadUrl.length > 0 ? leadUrl : '#lead-section';
const external = href.startsWith('http');
---

<section class="max-w-2xl mx-auto px-4 pb-8">
  <div class="rounded-xl border border-amber-200 bg-amber-50 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
    <div class="flex-1">
      <h3 class="font-semibold text-heading">Rather not do it yourself?</h3>
      <p class="text-sm text-body">Compare quotes from local painters. Bring your gallon estimate so the bids line up.</p>
    </div>
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer sponsored' : undefined}
      class="inline-flex justify-center items-center px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
      data-painter-cta
      data-page-source={pageSource}
    >
      Get painter quotes
    </a>
  </div>
</section>

<script>
  import { trackCtaClick } from '../utils/analytics';

  document.querySelectorAll<HTMLAnchorElement>('[data-painter-cta]').forEach((link) => {
    link.addEventListener('click', () => {
      trackCtaClick({ ctaText: 'Get painter quotes', pageSource: link.dataset.pageSource });
    });
  });
</script>
```

- [ ] **Step 2: Place it on the homepage**

In `src/pages/index.astro`, add the import next to the other component imports at the top of the frontmatter:

```astro
import PainterQuoteCta from '../components/PainterQuoteCta.astro';
```

and change line 23 from `    <Calculator />` to:

```astro
    <Calculator />
    <PainterQuoteCta pageSource="home" />
```

- [ ] **Step 3: Place it on the calculator pages**

In `src/pages/paint-calculator/[slug].astro`, add after line 6 (`import StaticResults ...`):

```astro
import PainterQuoteCta from '../../components/PainterQuoteCta.astro';
```

and change line 151 from `  <StaticResults results={results} inputs={page.defaults} />` to:

```astro
  <StaticResults results={results} inputs={page.defaults} />
  <PainterQuoteCta pageSource={page.slug} />
```

- [ ] **Step 4: Document the env var**

Append to `.env.example`:

```text

# Pay-per-lead tracking link for the "Get painter quotes" button (Networx, Angi, Modernize, etc.).
# Leave empty to send visitors to the email signup form instead.
PUBLIC_PAINTER_LEAD_URL=
```

In `README.md`, add after the `PUBLIC_ADS_ENABLED=true` code block and before "Both flags are read at build time" (the second paragraph is a fenced `text` block in the README):

    The "Get painter quotes" button after calculator results links to a pay-per-lead program when this is set, and to the email signup form when it is empty:

    ```text
    PUBLIC_PAINTER_LEAD_URL=https://example-network.com/your-tracking-link
    ```

Also change the sentence "Both flags are read at build time" to "All three variables are read at build time".

- [ ] **Step 5: Build and verify both placements and the fallback**

Run: `npm run build && grep -o 'data-painter-cta[^>]*' dist/index.html && grep -c 'href="#lead-section"' dist/index.html && grep -l 'data-painter-cta' dist/paint-calculator/*.html | wc -l`
Expected: the homepage anchor has `data-page-source="home"`, `href="#lead-section"` count is at least 1, and every calculator page contains the CTA.

Then run: `PUBLIC_PAINTER_LEAD_URL=https://example.com/lead npm run build && grep -o 'href="https://example.com/lead"[^>]*' dist/index.html | head -1`
Expected: the anchor uses the env URL with `target="_blank"` and `rel="noopener noreferrer sponsored"`. Rebuild once more without the env var so `dist/` matches the default.

(On PowerShell use `$env:PUBLIC_PAINTER_LEAD_URL='https://example.com/lead'; npm run build; Remove-Item Env:PUBLIC_PAINTER_LEAD_URL`.)

- [ ] **Step 6: Run tests and commit**

Run: `npm test`
Expected: all pass.

```bash
git add src/components/PainterQuoteCta.astro src/pages/index.astro "src/pages/paint-calculator/[slug].astro" .env.example README.md
git commit -m "Add painter quote CTA after calculator results

Links to PUBLIC_PAINTER_LEAD_URL when set, otherwise to the email form.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Push and confirm on production

**Files:** none.

- [ ] **Step 1: Push**

Run: `git push`
Expected: Cloudflare Pages builds from `main` within about two minutes.

- [ ] **Step 2: Verify the deploy with a cache-busting query**

Run: `curl -s "https://paintprocalculator.com/?v=$(date +%s)" | grep -o 'recommended-products-list\|data-painter-cta' | wc -l`
Expected: `2` or more (HTML is minified to one line, so count matches with `-o`, not `-c`). If `0` after five minutes, the deploy has not finished or a Cloudflare Cache Rule is serving stale HTML; see the spec's manual tasks (purge everything).

- [ ] **Step 3: Verify a static calculator page**

Run: `curl -s "https://paintprocalculator.com/paint-calculator/bathroom-paint-calculator?v=$(date +%s)" | grep -o 'data-affiliate-product="[^"]*"'`
Expected: includes `bathroom-paint`.

---

## Self-review notes

- Spec coverage: problem 1 -> Task 1; problem 2 -> Tasks 4, 5; problem 3 -> Tasks 2, 3; problem 4 -> Task 6. Deploy check -> Task 7. Manual dashboard items intentionally stay in the spec.
- Names used consistently: `recommendProducts`, `Recommendation`, `MAX_RECOMMENDATIONS`, `products`, `ProductId`, `amazonSearch`, `AMAZON_TAG`, `affiliateEnabled`, `trackAffiliateClick`, `trackCtaClick`, ids `recommended-products` / `recommended-products-list`, page sources `calculator-result` / `calculator-static`.
- The `AffiliateProduct.icon` strings in the catalog (`brush`, `paint`, `sprayer`, `primer`, `roller`, `tape`) match the icon branches already in `AffiliateCards.astro`.
