import { describe, expect, it } from 'vitest';
import { calculatePaint, type CalculationInputs } from './paint-calculator';
import { MAX_RECOMMENDATIONS, recommendProducts } from './product-recommendations';
import { AMAZON_TAG } from '../data/products';
import { calculatorPages } from '../data/calculator-pages';

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

function recsFor(overrides: Partial<CalculationInputs>, brand?: string) {
  const inputs = { ...baseInputs, ...overrides };
  return recommendProducts(inputs, calculatePaint(inputs), brand ? { brand } : undefined);
}

const ids = (overrides: Partial<CalculationInputs>, brand?: string) =>
  recsFor(overrides, brand).map((r) => r.product.id);

/** Recommendations for a real page, straight from the page data that ships. */
function recsForPage(slug: string, brand?: string) {
  const page = calculatorPages.find((p) => p.slug === slug);
  if (!page) throw new Error(`no page ${slug}`);
  return recommendProducts(page.defaults, calculatePaint(page.defaults), brand ? { brand } : undefined);
}

describe('recommendProducts', () => {
  it('never returns more than MAX_RECOMMENDATIONS and never repeats a product', () => {
    const result = ids({
      needsPrimer: true,
      primerType: 'pva',
      surfaceCondition: 'stained',
      roomType: 'bathroom',
      wallTexture: 'heavy',
      height: 10,
    });
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

  // --- Amendment 1: garage floor epoxy must not displace the wall paint ---

  it('gives a garage both wall paint and floor epoxy, with the wall paint kept', () => {
    const result = ids({ roomType: 'garage' });
    expect(result).toContain('garage-wall-paint');
    expect(result).toContain('garage-floor-epoxy');
    expect(result.indexOf('garage-wall-paint')).toBeLessThan(result.indexOf('garage-floor-epoxy'));
  });

  it('does not offer floor epoxy when only the trim or ceiling is being painted', () => {
    expect(ids({ roomType: 'garage', surfaceType: 'trim' })).not.toContain('garage-floor-epoxy');
    expect(ids({ roomType: 'garage', surfaceType: 'ceiling' })).not.toContain('garage-floor-epoxy');
  });

  it('serves the live garage page with primer, wall paint, epoxy, and a sprayer', () => {
    const result = recsForPage('garage-paint-calculator').map((r) => r.product.id);
    expect(result).toEqual(['primer-pva', 'garage-wall-paint', 'garage-floor-epoxy', 'sprayer']);
  });

  // --- Amendment 2: brand pages recommend that brand's paint ---

  it('puts the brand paint in the paint slot on a brand page', () => {
    const recs = recsFor({}, 'Behr');
    expect(recs[0].product.id).toBe('brand-behr');
    expect(recs[0].reason).toContain('Home Depot');
    expect(recs.map((r) => r.product.id)).not.toContain('interior-paint');
  });

  it('normalizes brand names with punctuation and spaces', () => {
    expect(ids({}, 'Farrow & Ball')[0]).toBe('brand-farrow-and-ball');
    expect(ids({}, 'Sherwin-Williams')[0]).toBe('brand-sherwin-williams');
    expect(ids({}, 'Benjamin Moore')[0]).toBe('brand-benjamin-moore');
  });

  it('gives each brand page a different paint pick instead of one generic paint', () => {
    const brands = ['Behr', 'Sherwin-Williams', 'Benjamin Moore', 'Valspar', 'PPG', 'Glidden', 'Rust-Oleum', 'Farrow & Ball'];
    const firstPicks = brands.map((b) => recsForPage('behr-coverage', b)[0].product.id);
    expect(new Set(firstPicks).size).toBe(brands.length);
  });

  it('falls back to the room-based paint when the brand is unknown', () => {
    expect(ids({}, 'Some Unknown Brand')).toContain('interior-paint');
  });

  it('still respects surface type over brand for trim and ceiling jobs', () => {
    expect(ids({ surfaceType: 'trim' }, 'Behr')).toContain('trim-paint');
    expect(ids({ surfaceType: 'ceiling' }, 'Behr')).toContain('ceiling-paint');
  });
});
