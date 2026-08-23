import type { CalculationInputs, CalculationResults } from './paint-calculator';
import { brandProductFor, products, type Product, type ProductId } from '../data/products';

export interface Recommendation {
  product: Product;
  reason: string;
}

export interface RecommendOptions {
  /** Brand name from a `*-coverage` page, e.g. "Behr". Puts that brand's paint in the paint slot. */
  brand?: string;
}

export const MAX_RECOMMENDATIONS = 4;

/**
 * Pick up to four products that match what the visitor told the calculator.
 * Order matters: primer and prep first, then exactly one paint, then extras and tools.
 * Pure function: no DOM, no env access, safe on server and client.
 */
export function recommendProducts(
  inputs: CalculationInputs,
  results: CalculationResults,
  options: RecommendOptions = {},
): Recommendation[] {
  const picks: Recommendation[] = [];
  const seen = new Set<string>();

  const add = (product: Product | undefined, reason: string) => {
    if (!product || seen.has(product.id)) return;
    seen.add(product.id);
    picks.push({ product, reason });
  };
  const addId = (id: ProductId, reason: string) => add(products[id], reason);

  const gallons = results.estimateRange.likely.purchaseGallons;
  const paintsCeiling = inputs.surfaceType === 'ceiling' || inputs.surfaceType === 'walls-ceiling';
  const brandProduct = brandProductFor(options.brand);

  // 1. Primer and prep
  if (inputs.needsPrimer) {
    if (inputs.primerType === 'pva') {
      addId('primer-pva', 'You selected PVA primer, the right choice for bare drywall.');
    } else if (inputs.primerType === 'high-hide') {
      addId('primer-high-hide', 'High-hide primer cuts the number of finish coats on a strong color change.');
    } else {
      addId('primer-standard', `Plan on about ${Math.max(1, results.primerGallons)} gallon(s) of primer.`);
    }
  }
  if (inputs.surfaceCondition === 'stained') {
    addId('primer-shellac', 'Shellac primer blocks water stains and smoke before the finish coat.');
  }
  if (inputs.surfaceCondition === 'glossy') {
    addId('deglosser', 'Glossy surfaces need deglossing or sanding so the new paint sticks.');
  }

  // 2. Exactly one paint, matched to the surface first, then the brand, then the room.
  // Every result gets a paint pick; nothing else may take this slot.
  if (inputs.surfaceType === 'trim') {
    addId('trim-paint', 'Semi-gloss enamel holds up to cleaning on trim and doors.');
  } else if (inputs.surfaceType === 'ceiling') {
    addId('ceiling-paint', 'Flat ceiling paint hides roller marks overhead.');
  } else if (brandProduct) {
    const where = brandProduct.soldAt ? `Sold at ${brandProduct.soldAt}. ` : '';
    add(brandProduct, `${where}Plan on about ${gallons} gallon(s) at this coverage rate.`);
  } else if (inputs.roomType === 'bathroom') {
    addId('bathroom-paint', 'Bathrooms need a mildew-resistant finish.');
  } else if (inputs.roomType === 'kitchen') {
    addId('kitchen-paint', 'Kitchen walls get scrubbed, so pick a washable finish.');
  } else if (inputs.roomType === 'basement') {
    addId('basement-paint', 'Basement walls do better with a mold-resistant coating.');
  } else if (inputs.roomType === 'garage') {
    addId('garage-wall-paint', `Garage walls take abuse, so pick a scuff-resistant finish. You need about ${gallons} gallon(s).`);
  } else {
    addId('interior-paint', `You need about ${gallons} gallon(s) of wall paint.`);
  }

  // 2b. A garage floor is a second project, not a substitute for the wall paint.
  if (inputs.roomType === 'garage' && inputs.surfaceType !== 'trim' && inputs.surfaceType !== 'ceiling') {
    addId('garage-floor-epoxy', 'Doing the floor at the same time? An epoxy kit is the durable option.');
  }

  // 3. Tools
  if (gallons >= 5) addId('sprayer', 'At five gallons or more, a sprayer saves hours of rolling.');
  if (paintsCeiling || inputs.wallTexture === 'medium' || inputs.wallTexture === 'heavy') {
    addId('thick-nap-roller', 'Textured walls and ceilings need a 3/4-inch nap roller cover.');
  }
  if (inputs.surfaceType === 'trim') {
    addId('angled-brush', 'A 2.5-inch angled sash brush gives clean lines on trim.');
  } else {
    addId('roller-kit', 'A 9-inch roller kit with a tray covers walls quickly.');
  }
  if (inputs.height > 9 || paintsCeiling) {
    addId('extension-pole', 'An extension pole reaches tall walls and ceilings without a ladder.');
  }
  addId('painters-tape', 'Tape off trim and ceilings for sharp edges.');
  addId('drop-cloth', 'Cover floors before the first can opens.');

  return picks.slice(0, MAX_RECOMMENDATIONS);
}
