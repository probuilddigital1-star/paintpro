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
  if (needsPrimer) {
    const primerCoverage = primerCoverageRates[primerType];
    const totalPrimerArea = (paintableArea + ceilingPaintableArea) * primerCoats;
    primerGallons = Math.ceil((totalPrimerArea / primerCoverage) * (1 + wasteMultiplier));
  }

  return {
    gallonsNeeded,
    primerGallons,
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
  };
}
