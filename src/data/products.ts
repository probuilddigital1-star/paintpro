// Single source of truth for affiliate products.
// Amazon Associates tag: paintpro02-20. Search URLs today; swap `url` for a
// specific product page (https://www.amazon.com/dp/ASIN?tag=paintpro02-20)
// once a product has been chosen and checked.

export const AMAZON_TAG = 'paintpro02-20';

/**
 * Amazon department to search within. Without this, queries like
 * "paint supplies kit" return artist watercolor sets instead of house
 * painting supplies. `tools` is Amazon's Tools & Home Improvement
 * department, which is where paint, primers, rollers, and sprayers live.
 */
export const AMAZON_DEPARTMENT = 'tools';

export function amazonSearch(query: string): string {
  const k = encodeURIComponent(query.trim()).replace(/%20/g, '+');
  return `https://www.amazon.com/s?k=${k}&i=${AMAZON_DEPARTMENT}&tag=${AMAZON_TAG}`;
}

export type Retailer = 'amazon' | 'homedepot' | 'lowes';

export type ProductId =
  | 'interior-paint'
  | 'bathroom-paint'
  | 'kitchen-paint'
  | 'basement-paint'
  | 'garage-wall-paint'
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
  /** Catalog key for the shared products, or `brand-<slug>` for a brand paint. */
  id: string;
  title: string;
  description: string;
  /** Icon key understood by AffiliateCards.astro: brush | paint | sprayer | primer | roller | tape */
  icon: string;
  url: string;
  cta: string;
  /** Retailer this link points at today. */
  retailer: Retailer;
  /** Where the brand is actually sold, shown to the reader on brand pages. */
  soldAt?: string;
  /** Where this link should point once that affiliate program is approved. */
  preferredRetailer?: Retailer;
}

function amazon(id: ProductId, title: string, description: string, icon: string, query: string, cta: string): Product {
  return { id, title, description, icon, url: amazonSearch(query), cta, retailer: 'amazon' };
}

export const products: Record<ProductId, Product> = {
  'interior-paint': amazon('interior-paint', 'Interior wall paint', 'Top-rated interior paint for walls.', 'paint', 'interior wall paint gallon', 'Browse paint'),
  'bathroom-paint': amazon('bathroom-paint', 'Mildew-resistant bathroom paint', 'Moisture and mildew resistant finish for bathrooms.', 'paint', 'mildew resistant bathroom paint', 'Browse bathroom paint'),
  'kitchen-paint': amazon('kitchen-paint', 'Scrubbable kitchen paint', 'Washable satin or semi-gloss for kitchen walls.', 'paint', 'scrub resistant kitchen paint', 'Browse kitchen paint'),
  'basement-paint': amazon('basement-paint', 'Mold-resistant basement paint', 'Coatings made for below-grade walls.', 'paint', 'mold resistant basement paint', 'Browse basement paint'),
  'garage-wall-paint': amazon('garage-wall-paint', 'Scuff-resistant garage wall paint', 'Durable satin or semi-gloss that wipes clean.', 'paint', 'garage wall paint satin durable', 'Browse garage paint'),
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
  'painters-tape': amazon('painters-tape', "Painter's tape", 'Clean edges along trim and ceilings.', 'tape', 'FrogTape painters tape', 'View tape'),
  'drop-cloth': amazon('drop-cloth', 'Canvas drop cloth', 'Protects floors and furniture.', 'tape', 'canvas drop cloth painting', 'View drop cloths'),
  'sprayer': amazon('sprayer', 'Airless paint sprayer', 'Saves hours on big rooms and whole-house jobs.', 'sprayer', 'airless paint sprayer', 'View sprayers'),
  'supplies-kit': amazon('supplies-kit', 'Paint supplies kit', 'Rollers, brushes, tape, and drop cloths in one box.', 'brush', 'paint supplies kit', 'Shop supplies'),
};

/**
 * Brand paints for the eight `*-coverage` pages.
 *
 * Several of these brands are retailer exclusives, so an Amazon search is a weak
 * match for the intent behind "how much behr paint do i need". `soldAt` tells the
 * reader where to actually buy it and `preferredRetailer` marks the link to swap
 * once the Home Depot (Impact) and Lowe's (CJ) programs are approved. Until then
 * every link stays on Amazon, which is what the page already did.
 */
function brand(slug: string, title: string, query: string, soldAt: string, preferredRetailer?: Retailer): Product {
  return {
    id: `brand-${slug}`,
    title: `${title} paint`,
    description: `Shop ${title} interior and exterior paints.`,
    icon: 'paint',
    url: amazonSearch(query),
    cta: `Shop ${title}`,
    retailer: 'amazon',
    soldAt,
    preferredRetailer,
  };
}

/** Keyed by `normalizeBrand(brandName)`. */
export const brandProducts: Record<string, Product> = {
  behr: brand('behr', 'Behr', 'behr paint', 'Home Depot', 'homedepot'),
  'sherwin-williams': brand('sherwin-williams', 'Sherwin-Williams', 'sherwin williams paint', 'Sherwin-Williams stores'),
  'benjamin-moore': brand('benjamin-moore', 'Benjamin Moore', 'benjamin moore paint', 'independent Benjamin Moore dealers'),
  valspar: brand('valspar', 'Valspar', 'valspar paint', "Lowe's", 'lowes'),
  ppg: brand('ppg', 'PPG', 'ppg paint interior', "Home Depot, Lowe's, and PPG dealers", 'homedepot'),
  glidden: brand('glidden', 'Glidden', 'glidden paint interior', 'Home Depot and Walmart', 'homedepot'),
  'rust-oleum': brand('rust-oleum', 'Rust-Oleum', 'rust-oleum interior paint', 'most hardware stores and Amazon'),
  'farrow-and-ball': brand('farrow-and-ball', 'Farrow & Ball', 'farrow and ball paint', 'Farrow & Ball stockists'),
};

/** "Farrow & Ball" -> "farrow-and-ball", "Sherwin-Williams" -> "sherwin-williams". */
export function normalizeBrand(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function brandProductFor(name: string | undefined): Product | undefined {
  if (!name) return undefined;
  return brandProducts[normalizeBrand(name)];
}
