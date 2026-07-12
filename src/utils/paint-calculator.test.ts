import { describe, expect, it } from 'vitest';
import { calculatePaint, type CalculationInputs } from './paint-calculator';

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
