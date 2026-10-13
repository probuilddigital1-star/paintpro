// Paint Calculator - Shared calculation logic
// Used by both the interactive Calculator.astro and static programmatic pages

export const baseCoverageRates: Record<string, number> = {
  budget: 350,
  standard: 400,
  premium: 450,
};

export const textureMultipliers: Record<string, number> = {
  smooth: 1.0,
  light: 0.85,
  medium: 0.75,
  heavy: 0.65,
};

export const ceilingTextureMultipliers: Record<string, number> = {
  smooth: 0.9,
  light: 0.75,
  popcorn: 0.5,
};

export const surfaceConditionMultipliers: Record<string, number> = {
  good: 1.0,
  fair: 0.9,
  'new-drywall': 0.7,
  stained: 0.85,
  glossy: 0.9,
};

export const primerCoverageRates: Record<string, number> = {
  standard: 300,
  'high-hide': 250,
  pva: 300,
};

export const deductionValues = {
  doors: 21,
  frenchDoors: 18,
  closetDoors: 25,
  windows: 15,
  largeWindows: 50,
  smallWindows: 8,
} as const;

export const roomRecommendations: Record<string, string> = {
  'living-room':
    'Eggshell is a practical choice for most living rooms. It has a softer look than satin but still wipes clean.',
  bedroom:
    'Flat or eggshell finish recommended for bedrooms. Low-VOC paint is ideal for better air quality.',
  kitchen:
    'Semi-gloss or satin finish recommended for kitchens. These finishes are easier to clean and resist moisture.',
  bathroom:
    'Use moisture-resistant, mildew-resistant paint. Semi-gloss finish recommended for humidity protection.',
  hallway:
    'Satin or semi-gloss finish recommended for high-traffic areas. Consider scuff-resistant paint.',
  basement:
    'Use moisture-blocking primer first. Consider waterproofing paint for below-grade walls. Add 30% extra for concrete block.',
  garage:
    'Epoxy-based or garage floor paint recommended for durability. Standard latex works for walls.',
  office:
    'Eggshell or matte paint keeps glare down while still handling occasional cleaning.',
  'dining-room':
    'Eggshell works well for everyday dining rooms. Satin is easier to clean in homes with young children.',
};

export interface CalculationInputs {
  length: number;
  width: number;
  height: number;
  doors: number;
  frenchDoors: number;
  closetDoors: number;
  windows: number;
  largeWindows: number;
  smallWindows: number;
  surfaceType: 'walls' | 'walls-ceiling' | 'ceiling' | 'trim';
  numCoats: number;
  paintQuality: 'budget' | 'standard' | 'premium';
  includeWaste: boolean;
  wallTexture: 'smooth' | 'light' | 'medium' | 'heavy';
  ceilingTexture: 'smooth' | 'light' | 'popcorn';
  surfaceCondition: 'good' | 'fair' | 'new-drywall' | 'stained' | 'glossy';
  roomType: string;
  needsPrimer: boolean;
  primerType?: 'standard' | 'high-hide' | 'pva';
  primerCoats?: number;
  trimHeight?: number;
  customCoverageRate?: number;
}

export interface CalculationResults {
  gallonsNeeded: number;
  primerGallons: number;
  primerGallonsExact: number;
  primerBaseGallons: number;
  wallArea: number;
  ceilingArea: number;
  totalDeduction: number;
  paintableArea: number;
  ceilingPaintableArea: number;
  includesCeiling: boolean;
  baseCoverage: number;
  wallTextureMultiplier: number;
  adjustedWallCoverage: number;
  adjustedCeilingCoverage: number;
  wallCoverageNeeded: number;
  ceilingCoverageNeeded: number;
  baseGallons: number;
  wasteAmount: number;
  estimateRange: PaintEstimateRange;
}

export interface EstimatePoint {
  coverageRate: number;
  rawGallons: number;
  gallonsWithWaste: number;
  purchaseGallons: number;
}

export interface PaintEstimateRange {
  low: EstimatePoint;
  likely: EstimatePoint;
  high: EstimatePoint;
  confidence: 'high' | 'medium' | 'low';
  confidenceReasons: string[];
}

const coverageRanges: Record<CalculationInputs['paintQuality'], [number, number, number]> = {
  budget: [400, 350, 300],
  standard: [450, 400, 350],
  premium: [500, 450, 400],
};

function round(value: number, places = 2): number {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function createEstimatePoint(
  wallArea: number,
  ceilingArea: number,
  wallCoverage: number,
  ceilingCoverage: number,
  wasteMultiplier: number,
): EstimatePoint {
  const rawGallons = wallArea / wallCoverage + ceilingArea / ceilingCoverage;
  const gallonsWithWaste = rawGallons * (1 + wasteMultiplier);

  return {
    coverageRate: Math.round(wallCoverage),
    rawGallons: round(rawGallons),
    gallonsWithWaste: round(gallonsWithWaste),
    purchaseGallons: Math.ceil(gallonsWithWaste),
  };
}

function determineConfidence(inputs: CalculationInputs): Pick<PaintEstimateRange, 'confidence' | 'confidenceReasons'> {
  const reasons: string[] = [];

  if (inputs.customCoverageRate) reasons.push('You supplied the coverage rate from the paint label.');
  else reasons.push('Coverage is based on a typical range, not a specific paint label.');

  if (inputs.wallTexture === 'medium' || inputs.wallTexture === 'heavy' || inputs.ceilingTexture === 'popcorn') {
    reasons.push('Pronounced texture makes paint use less predictable.');
  }
  if (inputs.surfaceCondition !== 'good') {
    reasons.push('Surface condition can change absorption and practical coverage.');
  }
  if (inputs.surfaceType !== 'trim' && inputs.doors + inputs.frenchDoors + inputs.closetDoors + inputs.windows + inputs.largeWindows + inputs.smallWindows === 0) {
    reasons.push('No openings were entered, so the paintable area may be overstated.');
  }

  const uncertaintyCount = reasons.length - (inputs.customCoverageRate ? 1 : 0);
  const confidence = inputs.customCoverageRate && uncertaintyCount <= 1
    ? 'high'
    : uncertaintyCount >= 3
      ? 'low'
      : 'medium';

  return { confidence, confidenceReasons: reasons };
}

export function calculatePaint(inputs: CalculationInputs): CalculationResults {
  const {
    length,
    width,
    height,
    doors,
    frenchDoors,
    closetDoors,
    windows,
    largeWindows,
    smallWindows,
    surfaceType,
    numCoats,
    paintQuality,
    includeWaste,
    wallTexture,
    ceilingTexture,
    surfaceCondition,
    needsPrimer,
    primerType = 'standard',
    primerCoats = 1,
    trimHeight = 6,
  } = inputs;

  const wallArea = 2 * (length + width) * height;
  const ceilingArea = length * width;

  const totalDeduction =
    doors * deductionValues.doors +
    frenchDoors * deductionValues.frenchDoors +
    closetDoors * deductionValues.closetDoors +
    windows * deductionValues.windows +
    largeWindows * deductionValues.largeWindows +
    smallWindows * deductionValues.smallWindows;

  let paintableArea = 0;
  let ceilingPaintableArea = 0;
  let includesCeiling = false;

  if (surfaceType === 'walls' || surfaceType === 'walls-ceiling') {
    paintableArea += wallArea - totalDeduction;
  }
  if (surfaceType === 'ceiling' || surfaceType === 'walls-ceiling') {
    ceilingPaintableArea = ceilingArea;
    includesCeiling = true;
  }
  if (surfaceType === 'trim') {
    const trimHeightFeet = trimHeight / 12;
    const perimeter = 2 * (length + width);
    paintableArea = perimeter * trimHeightFeet;
  }

  paintableArea = Math.max(0, paintableArea);

  const baseCoverage = inputs.customCoverageRate ?? baseCoverageRates[paintQuality];
  const wallTextureMultiplier = textureMultipliers[wallTexture];
  const adjustedWallCoverage =
    baseCoverage * wallTextureMultiplier * surfaceConditionMultipliers[surfaceCondition];
  const ceilingTextureMultiplier = ceilingTextureMultipliers[ceilingTexture];
  const adjustedCeilingCoverage =
    baseCoverage * ceilingTextureMultiplier * surfaceConditionMultipliers[surfaceCondition];

  const wallCoverageNeeded = paintableArea * numCoats;
  const wallGallons = wallCoverageNeeded / adjustedWallCoverage;
  const ceilingCoverageNeeded = ceilingPaintableArea * numCoats;
  const ceilingGallons = ceilingCoverageNeeded / adjustedCeilingCoverage;

  const baseGallons = wallGallons + ceilingGallons;
  const wasteMultiplier = includeWaste ? 0.15 : 0;
  const wasteAmount = baseGallons * wasteMultiplier;
  const gallonsNeeded = Math.ceil(baseGallons + wasteAmount);

  let primerGallons = 0;
  let primerBaseGallons = 0;
  let primerGallonsExact = 0;
  if (needsPrimer) {
    const primerCoverage = primerCoverageRates[primerType];
    const totalPrimerArea = (paintableArea + ceilingPaintableArea) * primerCoats;
    primerBaseGallons = totalPrimerArea / primerCoverage;
    primerGallonsExact = primerBaseGallons * (1 + wasteMultiplier);
    primerGallons = Math.ceil(primerGallonsExact);
  }

  const [optimisticCoverage, likelyCoverage, conservativeCoverage] = inputs.customCoverageRate
    ? [inputs.customCoverageRate * 1.1, inputs.customCoverageRate, inputs.customCoverageRate * 0.9]
    : coverageRanges[paintQuality];
  const wallAdjustment = wallTextureMultiplier * surfaceConditionMultipliers[surfaceCondition];
  const ceilingAdjustment = ceilingTextureMultiplier * surfaceConditionMultipliers[surfaceCondition];
  const estimateRange: PaintEstimateRange = {
    low: createEstimatePoint(
      wallCoverageNeeded,
      ceilingCoverageNeeded,
      optimisticCoverage * wallAdjustment,
      optimisticCoverage * ceilingAdjustment,
      wasteMultiplier,
    ),
    likely: createEstimatePoint(
      wallCoverageNeeded,
      ceilingCoverageNeeded,
      likelyCoverage * wallAdjustment,
      likelyCoverage * ceilingAdjustment,
      wasteMultiplier,
    ),
    high: createEstimatePoint(
      wallCoverageNeeded,
      ceilingCoverageNeeded,
      conservativeCoverage * wallAdjustment,
      conservativeCoverage * ceilingAdjustment,
      wasteMultiplier,
    ),
    ...determineConfidence(inputs),
  };

  return {
    gallonsNeeded,
    primerGallons,
    primerGallonsExact,
    wallArea,
    ceilingArea,
    totalDeduction,
    paintableArea,
    ceilingPaintableArea,
    includesCeiling,
    baseCoverage,
    wallTextureMultiplier,
    adjustedWallCoverage,
    adjustedCeilingCoverage,
    wallCoverageNeeded,
    ceilingCoverageNeeded,
    baseGallons,
    wasteAmount,
    primerBaseGallons,
    estimateRange,
  };
}

// --- What a painter would charge ---------------------------------------------------------------
//
// Pros price interior walls at about $1.25 to $3.00 per square foot of paintable wall area
// (openings deducted), labor plus paint and supplies, two coats. A painted ceiling adds $1.00 to
// $2.50 per square foot of ceiling. Typical job minimum is $250 to $500. Cost guides (Angi,
// HomeAdvisor, HomeGuide, Homewyse, This Old House, Thumbtack, 2025 to 2026) that quote "$2 to $6
// per square foot" mean per square foot of floor, not wall, so do not apply that figure to wall area.

const PRO_WALL_RATE = { low: 1.25, high: 3.0 } as const;
const PRO_CEILING_RATE = { low: 1.0, high: 2.5 } as const;
const PRO_HARDER_FACTOR = 1.25;
const PRO_ROUND_TO = 50;
const PRO_MINIMUM = { low: 250, high: 500 } as const;

export interface ProCostJob {
  /** Paintable wall area in square feet, openings already deducted. */
  wallArea: number;
  /** Ceiling area in square feet. Leave it out unless the ceiling is part of the job. */
  ceilingArea?: number;
  /** Raises the range by 25 percent, once. See proCostJob() for what counts as harder. */
  harder?: boolean;
}

export interface ProCostRange {
  low: number;
  high: number;
}

function positiveArea(value: number | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0;
}

/**
 * Cost range for one or more jobs. Each job's harder factor is applied to that job, the jobs are
 * added up, and only then is the total rounded to the nearest $50 and held to the job minimums.
 * Returns null when there is no area to paint.
 */
export function estimateProCostTotal(jobs: readonly ProCostJob[]): ProCostRange | null {
  let area = 0;
  let low = 0;
  let high = 0;

  for (const job of jobs) {
    const wall = positiveArea(job.wallArea);
    const ceiling = positiveArea(job.ceilingArea);
    const factor = job.harder ? PRO_HARDER_FACTOR : 1;
    area += wall + ceiling;
    low += (wall * PRO_WALL_RATE.low + ceiling * PRO_CEILING_RATE.low) * factor;
    high += (wall * PRO_WALL_RATE.high + ceiling * PRO_CEILING_RATE.high) * factor;
  }

  if (area <= 0) return null;

  return {
    low: Math.max(PRO_MINIMUM.low, Math.round(low / PRO_ROUND_TO) * PRO_ROUND_TO),
    high: Math.max(PRO_MINIMUM.high, Math.round(high / PRO_ROUND_TO) * PRO_ROUND_TO),
  };
}

/** Cost range for hiring out a single room or job, or null when there is no area to paint. */
export function estimateProCost({ wallArea, ceilingArea = 0, harder = false }: ProCostJob): ProCostRange | null {
  return estimateProCostTotal([{ wallArea, ceilingArea, harder }]);
}

const harderSurfaceConditions: readonly CalculationInputs['surfaceCondition'][] = ['new-drywall', 'stained', 'glossy'];
const harderWallTextures: readonly CalculationInputs['wallTexture'][] = ['medium', 'heavy'];

/**
 * Turns a calculator result into the job a painter would price, or null when no painter price
 * applies (trim only). Wall area is the paintable wall area the calculator already computed, with
 * openings deducted, and only when the walls are part of the job. Ceiling area counts only when
 * the ceiling is part of the job. The coats setting is ignored because pro prices assume two coats.
 *
 * A job is harder, and priced 25 percent higher, when any of these is true:
 *  - the wall condition is new drywall, stained or glossy
 *  - the walls being painted have medium or heavy texture
 *  - the ceiling being painted is popcorn
 */
export function proCostJob(inputs: CalculationInputs, results: CalculationResults): ProCostJob | null {
  if (inputs.surfaceType === 'trim') return null;

  const paintsWalls = inputs.surfaceType === 'walls' || inputs.surfaceType === 'walls-ceiling';
  const paintsCeiling = inputs.surfaceType === 'ceiling' || inputs.surfaceType === 'walls-ceiling';

  const harder =
    harderSurfaceConditions.includes(inputs.surfaceCondition) ||
    (paintsWalls && harderWallTextures.includes(inputs.wallTexture)) ||
    (paintsCeiling && inputs.ceilingTexture === 'popcorn');

  return {
    wallArea: paintsWalls ? results.paintableArea : 0,
    ceilingArea: paintsCeiling ? results.ceilingPaintableArea : 0,
    harder,
  };
}

/** 1350 becomes "$1,350". */
export function formatDollars(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

/** { low: 550, high: 1350 } becomes "$550 to $1,350". */
export function formatProCostRange(range: ProCostRange): string {
  return `${formatDollars(range.low)} to ${formatDollars(range.high)}`;
}
