import { describe, expect, it } from 'vitest';
import {
  calculatePaint,
  estimateProCost,
  estimateProCostTotal,
  formatProCostRange,
  proCostJob,
  type CalculationInputs,
} from './paint-calculator';

const standardRoom: CalculationInputs = {
  length: 20,
  width: 20,
  height: 8,
  doors: 0,
  frenchDoors: 0,
  closetDoors: 0,
  windows: 0,
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

describe('calculatePaint', () => {
  it('returns an ordered range and preserves the likely legacy result', () => {
    const result = calculatePaint(standardRoom);

    expect(result.estimateRange.low.rawGallons).toBeLessThan(result.estimateRange.likely.rawGallons);
    expect(result.estimateRange.likely.rawGallons).toBeLessThan(result.estimateRange.high.rawGallons);
    expect(result.estimateRange.low.purchaseGallons).toBe(4);
    expect(result.estimateRange.high.purchaseGallons).toBe(5);
    expect(result.gallonsNeeded).toBe(result.estimateRange.likely.purchaseGallons);
  });

  it('increases the estimate for heavy texture and a porous surface', () => {
    const smooth = calculatePaint(standardRoom);
    const difficult = calculatePaint({
      ...standardRoom,
      wallTexture: 'heavy',
      surfaceCondition: 'new-drywall',
    });

    expect(difficult.estimateRange.likely.rawGallons).toBeGreaterThan(smooth.estimateRange.likely.rawGallons);
    expect(difficult.estimateRange.confidence).toBe('low');
  });

  it('does not allow openings to produce a negative paintable area', () => {
    const result = calculatePaint({
      ...standardRoom,
      length: 5,
      width: 5,
      doors: 20,
    });

    expect(result.paintableArea).toBe(0);
    expect(result.gallonsNeeded).toBe(0);
  });

  it('reports high confidence when a label rate is supplied for a simple room', () => {
    const result = calculatePaint({
      ...standardRoom,
      doors: 1,
      customCoverageRate: 400,
    });

    expect(result.estimateRange.confidence).toBe('high');
    expect(result.estimateRange.confidenceReasons[0]).toContain('paint label');
  });

  it('calculates primer independently from finish paint coats', () => {
    const result = calculatePaint({
      ...standardRoom,
      needsPrimer: true,
      primerType: 'standard',
      primerCoats: 1,
    });

    expect(result.primerGallons).toBe(3);
  });
});

// A bedroom-style room: 8 ft walls, one 21 sq ft door and two 15 sq ft windows.
function roomWithOpenings(length: number, width: number, overrides: Partial<CalculationInputs> = {}): CalculationInputs {
  return { ...standardRoom, length, width, doors: 1, windows: 2, ...overrides };
}

describe('estimateProCost', () => {
  it('prices a 12x12 room at 400 to 1,000 for the walls', () => {
    const { paintableArea } = calculatePaint(roomWithOpenings(12, 12));

    expect(paintableArea).toBe(333);
    expect(estimateProCost({ wallArea: paintableArea })).toEqual({ low: 400, high: 1000 });
  });

  it('adds the ceiling for 550 to 1,350 on the same room', () => {
    const results = calculatePaint(roomWithOpenings(12, 12, { surfaceType: 'walls-ceiling' }));

    expect(results.ceilingPaintableArea).toBe(144);
    expect(estimateProCost({ wallArea: results.paintableArea, ceilingArea: results.ceilingPaintableArea })).toEqual({
      low: 550,
      high: 1350,
    });
  });

  it.each([
    [10, 10, 350, 800],
    [12, 12, 400, 1000],
    [14, 16, 550, 1300],
    [16, 18, 600, 1500],
  ])('prices a %ix%i room at %i to %i', (length, width, low, high) => {
    const { paintableArea } = calculatePaint(roomWithOpenings(length, width));

    expect(estimateProCost({ wallArea: paintableArea })).toEqual({ low, high });
  });

  it('holds a tiny job to the job minimums', () => {
    expect(estimateProCost({ wallArea: 40 })).toEqual({ low: 250, high: 500 });
    expect(estimateProCost({ wallArea: 0, ceilingArea: 60 })).toEqual({ low: 250, high: 500 });
  });

  it('rounds to the nearest 50 before applying the minimums', () => {
    // 200 sq ft of wall is 250 to 600 exactly, so it sits on the low minimum and a round high.
    expect(estimateProCost({ wallArea: 200 })).toEqual({ low: 250, high: 600 });
    // 210 sq ft is 262.5 to 630, which round to 250 and 650.
    expect(estimateProCost({ wallArea: 210 })).toEqual({ low: 250, high: 650 });
    // 340 sq ft is 425 to 1,020, and 425 rounds up to 450.
    expect(estimateProCost({ wallArea: 340 })).toEqual({ low: 450, high: 1000 });
  });

  it('raises both ends once when the job is harder', () => {
    const normal = estimateProCost({ wallArea: 333 });
    const harder = estimateProCost({ wallArea: 333, harder: true });

    expect(normal).toEqual({ low: 400, high: 1000 });
    // 416.25 x 1.25 = 520.3 and 999 x 1.25 = 1,248.75
    expect(harder).toEqual({ low: 500, high: 1250 });
    expect(harder!.low).toBeGreaterThan(normal!.low);
    expect(harder!.high).toBeGreaterThan(normal!.high);
  });

  it('applies the harder factor to the ceiling as well', () => {
    // (333 x 1.25 + 144 x 1.00) x 1.25 = 700.3 and (333 x 3 + 144 x 2.5) x 1.25 = 1,698.75
    expect(estimateProCost({ wallArea: 333, ceilingArea: 144, harder: true })).toEqual({ low: 700, high: 1700 });
  });

  it('returns null when there is nothing to paint', () => {
    expect(estimateProCost({ wallArea: 0 })).toBeNull();
    expect(estimateProCost({ wallArea: 0, ceilingArea: 0 })).toBeNull();
    expect(estimateProCost({ wallArea: -50 })).toBeNull();
    expect(estimateProCost({ wallArea: Number.NaN })).toBeNull();
  });
});

describe('estimateProCostTotal', () => {
  it('adds the rooms first and rounds once, not room by room', () => {
    const room = { wallArea: calculatePaint(roomWithOpenings(10, 10)).paintableArea };

    expect(estimateProCost(room)).toEqual({ low: 350, high: 800 });
    // 336.25 + 336.25 = 672.5 rounds to 650, where two rounded rooms would add up to 700.
    expect(estimateProCostTotal([room, room])).toEqual({ low: 650, high: 1600 });
  });

  it('applies the minimums once to the total', () => {
    // Two 100 sq ft jobs are 125 to 300 each. Together they are 250 to 600, not 500 to 1,000.
    expect(estimateProCostTotal([{ wallArea: 100 }, { wallArea: 100 }])).toEqual({ low: 250, high: 600 });
  });

  it('applies each room\'s harder factor to that room only', () => {
    // 200 sq ft harder is 312.5 to 750, plus 200 sq ft normal at 250 to 600.
    expect(estimateProCostTotal([{ wallArea: 200, harder: true }, { wallArea: 200 }])).toEqual({ low: 550, high: 1350 });
  });

  it('matches estimateProCost for a single job and returns null for none', () => {
    const job = { wallArea: 333, ceilingArea: 144 };

    expect(estimateProCostTotal([job])).toEqual(estimateProCost(job));
    expect(estimateProCostTotal([])).toBeNull();
    expect(estimateProCostTotal([{ wallArea: 0 }, { wallArea: 0, ceilingArea: 0 }])).toBeNull();
  });
});

describe('proCostJob', () => {
  function jobFor(overrides: Partial<CalculationInputs>) {
    const inputs = roomWithOpenings(12, 12, overrides);
    return proCostJob(inputs, calculatePaint(inputs));
  }

  it('uses the net wall area for walls and adds the ceiling only when it is painted', () => {
    expect(jobFor({})).toEqual({ wallArea: 333, ceilingArea: 0, harder: false });
    expect(jobFor({ surfaceType: 'walls-ceiling' })).toEqual({ wallArea: 333, ceilingArea: 144, harder: false });
    expect(jobFor({ surfaceType: 'ceiling' })).toEqual({ wallArea: 0, ceilingArea: 144, harder: false });
  });

  it('ignores the coats setting', () => {
    expect(jobFor({ numCoats: 1 })).toEqual(jobFor({ numCoats: 3 }));
  });

  it('has no job for trim only', () => {
    expect(jobFor({ surfaceType: 'trim' })).toBeNull();
  });

  it.each(['new-drywall', 'stained', 'glossy'] as const)('is harder for %s walls', (surfaceCondition) => {
    expect(jobFor({ surfaceCondition })?.harder).toBe(true);
  });

  it.each(['good', 'fair'] as const)('is not harder for %s walls', (surfaceCondition) => {
    expect(jobFor({ surfaceCondition })?.harder).toBe(false);
  });

  it('is harder for medium or heavy wall texture, not light', () => {
    expect(jobFor({ wallTexture: 'light' })?.harder).toBe(false);
    expect(jobFor({ wallTexture: 'medium' })?.harder).toBe(true);
    expect(jobFor({ wallTexture: 'heavy' })?.harder).toBe(true);
  });

  it('is harder for a popcorn ceiling only when the ceiling is painted', () => {
    expect(jobFor({ ceilingTexture: 'popcorn' })?.harder).toBe(false);
    expect(jobFor({ ceilingTexture: 'popcorn', surfaceType: 'walls-ceiling' })?.harder).toBe(true);
    expect(jobFor({ ceilingTexture: 'popcorn', surfaceType: 'ceiling' })?.harder).toBe(true);
    expect(jobFor({ ceilingTexture: 'light', surfaceType: 'walls-ceiling' })?.harder).toBe(false);
  });

  it('ignores wall texture when only the ceiling is painted', () => {
    expect(jobFor({ wallTexture: 'heavy', surfaceType: 'ceiling' })?.harder).toBe(false);
  });
});

describe('formatProCostRange', () => {
  it('writes dollars with thousands separators', () => {
    expect(formatProCostRange({ low: 400, high: 1000 })).toBe('$400 to $1,000');
    expect(formatProCostRange({ low: 550, high: 1350 })).toBe('$550 to $1,350');
    expect(formatProCostRange({ low: 1250, high: 12000 })).toBe('$1,250 to $12,000');
  });
});
