import type { CalculationInputs } from '../utils/paint-calculator';

export interface FAQ {
  question: string;
  answer: string;
}

export interface AffiliateProduct {
  title: string;
  description: string;
  icon: string;
  link: string;
  cta: string;
}

export interface BrandCoverageEntry {
  brand: string;
  slug: string;
  coverageRate: number;
  priceTier: string;
}

export interface CalculatorPageData {
  slug: string;
  pageType: 'room-type' | 'room-size' | 'brand' | 'color-change';
  /** Display name for brand pages, e.g. "Behr". Drives the brand paint recommendation. */
  brand?: string;
  title: string;
  metaDescription: string;
  h1: string;
  defaults: CalculationInputs;
  introText: string;
  measurementGuide?: string[];
  tips: string[];
  faqs: FAQ[];
  relatedPages: string[];
  affiliates?: AffiliateProduct[];
  brandDisclaimer?: string;
  brandComparisonTable?: BrandCoverageEntry[];
  scenarioExplanation?: string;
}

const defaultInputs: CalculationInputs = {
  length: 12,
  width: 10,
  height: 8,
  doors: 1,
  frenchDoors: 0,
  closetDoors: 0,
  windows: 2,
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

// --- Room Type Pages ---

const bedroom: CalculatorPageData = {
  slug: 'bedroom-paint-calculator',
  pageType: 'room-type',
  title: 'Bedroom Paint Calculator – How Much Paint for a Bedroom?',
  metaDescription:
    'Calculate exactly how much paint you need for your bedroom. Get accurate gallon estimates based on room size, doors, windows, and number of coats.',
  h1: 'Bedroom Paint Calculator',
  defaults: {
    ...defaultInputs,
    length: 12,
    width: 12,
    height: 8,
    doors: 1,
    closetDoors: 1,
    windows: 2,
    roomType: 'bedroom',
  },
  introText:
    'Planning to paint your bedroom? Use our pre-calculated estimates below based on a standard bedroom with one door, one closet, and two windows. Bedrooms typically use flat or eggshell finishes for a smooth, relaxing look. For the most accurate results, customize the calculation using our interactive calculator.',
  measurementGuide: [
    'Measure inside the room at floor level instead of relying on a listing or floor plan.',
    'Count the closet door separately. This preset deducts one entry door, one closet door, and two standard windows.',
    'Treat the ceiling as a separate paint selection if you plan to paint it.',
  ],
  tips: [
    'Flat or matte finish hides wall imperfections and creates a cozy atmosphere.',
    'Low-VOC or zero-VOC paints are recommended for bedrooms to maintain air quality while you sleep.',
    'Lighter colors make small bedrooms feel larger; consider an accent wall for depth.',
    'Allow 24 hours of ventilation before sleeping in a freshly painted room.',
  ],
  faqs: [
    {
      question: 'How much paint do I need for a bedroom?',
      answer:
        'A standard 12x12 bedroom with 8-foot ceilings needs about 2 gallons of paint for two coats on the walls. This accounts for one door, one closet door, and two windows. Add an extra gallon if painting the ceiling.',
    },
    {
      question: 'What is the best paint finish for a bedroom?',
      answer:
        'Flat or eggshell finishes are best for bedrooms. Flat hides imperfections and gives a sophisticated look, while eggshell adds a slight sheen that is easier to clean. Avoid high-gloss in bedrooms as it highlights wall flaws.',
    },
    {
      question: 'Should I use primer before painting a bedroom?',
      answer:
        'Primer is recommended if you are covering dark colors, painting new drywall, or dealing with stains. For repainting over a similar light color in good condition, a paint-and-primer-in-one product often works well.',
    },
  ],
  relatedPages: [
    'living-room-paint-calculator',
    'bathroom-paint-calculator',
    'kitchen-paint-calculator',
  ],
};

const bathroom: CalculatorPageData = {
  slug: 'bathroom-paint-calculator',
  pageType: 'room-type',
  title: 'Bathroom Paint Calculator – How Much Paint for a Bathroom?',
  metaDescription:
    'Calculate paint needed for your bathroom. Moisture-resistant paint estimates for bathrooms of all sizes with accurate gallon calculations.',
  h1: 'Bathroom Paint Calculator',
  defaults: {
    ...defaultInputs,
    length: 8,
    width: 6,
    height: 8,
    doors: 1,
    windows: 1,
    smallWindows: 0,
    roomType: 'bathroom',
  },
  introText:
    'Bathrooms require moisture-resistant paint that can handle humidity and temperature changes. Our estimates below are based on a standard bathroom layout. Semi-gloss and satin finishes are recommended for their durability and mildew resistance.',
  measurementGuide: [
    'Measure only the wall sections that will receive paint. Full-height tile and shower surrounds are not deducted by this preset.',
    'This example deducts one door and one standard window. Add any large mirror or tiled wall as a manual deduction.',
    'Fix active moisture and ventilation problems before choosing a coating.',
  ],
  tips: [
    'Semi-gloss finish is the gold standard for bathrooms - it resists moisture and is easy to wipe clean.',
    'Use mildew-resistant paint formulated for high-humidity environments.',
    'Run the exhaust fan for 30 minutes after painting to reduce moisture buildup.',
    'Consider a moisture-blocking primer, especially for bathrooms without ventilation fans.',
  ],
  faqs: [
    {
      question: 'How much paint do I need for a bathroom?',
      answer:
        'This 8x6 preset uses about 1.1 gallons for two wall coats after the selected buffer. One gallon is too close for comfort, so add a quart if the product is sold in quarts or buy a second gallon for future touch-ups.',
    },
    {
      question: 'What type of paint is best for bathrooms?',
      answer:
        'Moisture-resistant paint with a semi-gloss or satin finish is best for bathrooms. These finishes resist mildew growth and are easy to clean. Look for paints labeled "kitchen and bath" for built-in mildew protection.',
    },
    {
      question: 'Do I need special primer for bathroom walls?',
      answer:
        'A moisture-blocking primer is recommended for bathrooms, especially if there are signs of water damage, mildew, or you are painting over dark colors. PVA primer works well on new drywall in bathrooms.',
    },
  ],
  relatedPages: [
    'kitchen-paint-calculator',
    '8x8-room-paint-calculator',
    '8x10-room-paint-calculator',
    'bedroom-paint-calculator',
  ],
  affiliates: [
    { title: 'Mildew-Resistant Paint', description: 'Bathroom-grade paint that resists mold and mildew in high-humidity environments.', icon: 'paint', link: 'https://www.amazon.com/s?k=mildew+resistant+bathroom+paint&i=tools&tag=paintpro02-20', cta: 'Shop Bathroom Paint' },
    { title: 'Bathroom Primer', description: 'Moisture-blocking primer designed for bathrooms and high-humidity areas.', icon: 'primer', link: 'https://www.amazon.com/s?k=moisture+blocking+primer+bathroom&i=tools&tag=paintpro02-20', cta: 'Shop Primer' },
    { title: 'Paint Supplies', description: 'Rollers, brushes, tape, and drop cloths for a professional bathroom finish.', icon: 'brush', link: 'https://www.amazon.com/s?k=paint+supplies+kit&i=tools&tag=paintpro02-20', cta: 'Shop Supplies' },
  ],
};

const kitchen: CalculatorPageData = {
  slug: 'kitchen-paint-calculator',
  pageType: 'room-type',
  title: 'Kitchen Paint Calculator – How Much Paint for a Kitchen?',
  metaDescription:
    'Calculate how much paint you need for your kitchen. Accurate estimates for kitchen walls, accounting for cabinets, windows, and appliance cutouts.',
  h1: 'Kitchen Paint Calculator',
  defaults: {
    ...defaultInputs,
    length: 12,
    width: 10,
    height: 8,
    doors: 1,
    windows: 2,
    roomType: 'kitchen',
  },
  introText:
    'Kitchens are one of the trickiest rooms to estimate paint for because of cabinets, backsplashes, and appliances that reduce paintable wall space. Our estimates below are for a standard kitchen layout. Satin or semi-gloss finishes work best in kitchens for easy cleaning.',
  measurementGuide: [
    'Measure exposed wall sections instead of subtracting an assumed cabinet percentage. Kitchen layouts vary too much for a dependable shortcut.',
    'Do not include cabinet doors, cabinet boxes, or the backsplash in this wall-paint estimate.',
    'Record each wall section separately, then add the widths before entering a simplified room size.',
  ],
  tips: [
    'Satin or semi-gloss finish is ideal for kitchens - both resist grease and are easy to clean.',
    'Subtract cabinet areas and backsplash from your wall calculations for a more accurate estimate.',
    'Use a scrub-resistant formula near cooking areas where grease splatter is common.',
    'Consider a lighter color to brighten the kitchen, or a bold accent wall behind open shelving.',
  ],
  faqs: [
    {
      question: 'How much paint do I need for a kitchen?',
      answer:
        'A standard 12x10 kitchen needs about 2 gallons for two coats on the walls, after deducting for doors and windows. If you have extensive cabinets, you may need less wall paint. Add 1-2 quarts for cabinet painting if needed.',
    },
    {
      question: 'What paint finish works best in a kitchen?',
      answer:
        'Semi-gloss or satin finishes are best for kitchens. They resist moisture and grease, and wipe clean easily. For kitchen cabinets, semi-gloss provides excellent durability and a professional look.',
    },
    {
      question: 'Should I paint kitchen cabinets with wall paint?',
      answer:
        'No. Kitchen cabinets should use a dedicated cabinet paint or enamel, which is harder and more durable. Wall paint will chip and wear quickly on cabinets. Budget about 1-2 quarts for a standard set of kitchen cabinets.',
    },
  ],
  relatedPages: [
    'bathroom-paint-calculator',
    'living-room-paint-calculator',
    'bedroom-paint-calculator',
  ],
  affiliates: [
    { title: 'Scrub-Resistant Paint', description: 'Kitchen-grade paint that resists grease and cleans easily near cooking areas.', icon: 'paint', link: 'https://www.amazon.com/s?k=scrub+resistant+kitchen+paint&i=tools&tag=paintpro02-20', cta: 'Shop Kitchen Paint' },
    { title: 'Kitchen Primer', description: 'Adhesion primer for kitchen walls, cabinets, and high-moisture surfaces.', icon: 'primer', link: 'https://www.amazon.com/s?k=kitchen+cabinet+primer&i=tools&tag=paintpro02-20', cta: 'Shop Primer' },
    { title: 'Paint Supplies', description: 'Quality rollers, brushes, tape, and drop cloths for a professional finish.', icon: 'brush', link: 'https://www.amazon.com/s?k=paint+supplies+kit&i=tools&tag=paintpro02-20', cta: 'Shop Supplies' },
  ],
};

const livingRoom: CalculatorPageData = {
  slug: 'living-room-paint-calculator',
  pageType: 'room-type',
  title: 'Living Room Paint Calculator – How Much Paint for a Living Room?',
  metaDescription:
    'Calculate paint needed for your living room. Accurate gallon estimates for standard and large living rooms with multiple windows and doors.',
  h1: 'Living Room Paint Calculator',
  defaults: {
    ...defaultInputs,
    length: 16,
    width: 14,
    height: 8,
    doors: 2,
    windows: 3,
    largeWindows: 1,
    roomType: 'living-room',
  },
  introText:
    'Living rooms are often the largest rooms in a home and usually have multiple windows and openings. Our estimates below account for a standard living room with two doorways, three windows, and one large picture window. Eggshell or satin finishes are popular choices for living room walls.',
  measurementGuide: [
    'Count open archways and wide passages instead of treating every opening as a standard door.',
    'This preset deducts two doors, three standard windows, and one large picture window.',
    'Measure vaulted or sloped walls by dividing them into rectangles and triangles. The rectangular room preset will otherwise understate their area.',
  ],
  tips: [
    'Eggshell finish is the most popular choice for living rooms - it has a subtle sheen and hides minor imperfections.',
    'For large living rooms, buy all paint at once from the same batch for consistent color.',
    'Consider a 5-gallon bucket for rooms needing 4+ gallons - better value and color consistency.',
    'Test paint colors with large samples on multiple walls before committing - lighting varies throughout the day.',
  ],
  faqs: [
    {
      question: 'How much paint do I need for a living room?',
      answer:
        'This 16x14 preset uses about 2 gallons for two coats after its door and window deductions. Rooms with vaulted ceilings, fewer openings, heavy texture, or a separate color may need more.',
    },
    {
      question: 'What paint finish is best for a living room?',
      answer:
        'Eggshell is the most popular living room finish. It offers a low sheen that hides wall imperfections while being more washable than flat paint. Satin is a good alternative for homes with kids or pets.',
    },
    {
      question: 'How many gallons for an accent wall in a living room?',
      answer:
        'A single accent wall in a standard living room (about 14 feet wide by 8 feet tall) needs about 1 gallon for two coats. This allows for touch-ups too.',
    },
  ],
  relatedPages: [
    'bedroom-paint-calculator',
    'kitchen-paint-calculator',
    'bathroom-paint-calculator',
  ],
};

const garage: CalculatorPageData = {
  slug: 'garage-paint-calculator',
  pageType: 'room-type',
  title: 'Garage Paint Calculator – How Much Paint for a Garage?',
  metaDescription:
    'Calculate paint needed for your garage walls. Accurate estimates for 1-car, 2-car, and 3-car garages with durable finish recommendations.',
  h1: 'Garage Paint Calculator',
  defaults: {
    ...defaultInputs,
    length: 20,
    width: 20,
    height: 9,
    doors: 1,
    windows: 1,
    largeWindows: 0,
    roomType: 'garage',
    surfaceCondition: 'new-drywall',
    needsPrimer: true,
    primerType: 'pva',
  },
  introText:
    'Garage walls benefit from durable, scuff-resistant paint that can handle everyday wear and tear. Our estimates below are for a standard two-car garage. Garages often have bare drywall or concrete block, so primer is strongly recommended for best coverage.',
  measurementGuide: [
    'Measure the large overhead door as a custom opening. This preset does not automatically subtract a garage door.',
    'Confirm whether the walls are finished drywall, bare block, or previously painted masonry before using the preset coverage rate.',
    'Estimate the ceiling separately because many garages have a larger or sloped ceiling area.',
  ],
  tips: [
    'Use a durable satin or semi-gloss finish for garage walls - flat paint scuffs too easily.',
    'Prime new drywall or bare concrete block before painting for proper adhesion and coverage.',
    'Light colors (white, light gray) brighten garages and make finding tools easier.',
    'Consider epoxy-based floor paint separately for the garage floor - regular wall paint will not hold up.',
  ],
  faqs: [
    {
      question: 'How much paint do I need for a 2-car garage?',
      answer:
        'This 20x20 preset uses about 5.6 gallons for two coats on new drywall, so plan on 6 gallons of finish paint. It also includes about 3 gallons of PVA primer. A large overhead door should be deducted separately.',
    },
    {
      question: 'What kind of paint should I use in a garage?',
      answer:
        'Use interior latex paint with a satin or semi-gloss finish for garage walls. These finishes are more durable and easier to clean than flat paint. For garage floors, use a dedicated epoxy or concrete floor paint.',
    },
    {
      question: 'Do I need to prime garage walls before painting?',
      answer:
        'Yes, primer is strongly recommended for garages, especially if the drywall is new, bare, or unpainted. PVA drywall primer is the best choice for new drywall. Use a bonding primer for previously painted glossy surfaces.',
    },
  ],
  relatedPages: [
    'basement-paint-calculator',
    '20x20-room-paint-calculator',
    '16x20-room-paint-calculator',
  ],
  affiliates: [
    { title: 'Epoxy Floor Paint', description: 'Garage-floor epoxy coating designed to resist common chemicals and tire marks.', icon: 'paint', link: 'https://www.amazon.com/s?k=epoxy+garage+floor+paint&i=tools&tag=paintpro02-20', cta: 'Shop Floor Paint' },
    { title: 'Drywall Primer', description: 'PVA primer for new drywall in garages. Seals the surface for even paint coverage.', icon: 'primer', link: 'https://www.amazon.com/s?k=pva+drywall+primer&i=tools&tag=paintpro02-20', cta: 'Shop Primer' },
    { title: 'Paint Supplies', description: 'Heavy-duty rollers, brushes, and trays for large garage painting projects.', icon: 'brush', link: 'https://www.amazon.com/s?k=paint+roller+kit+large&i=tools&tag=paintpro02-20', cta: 'Shop Supplies' },
  ],
};

const hallway: CalculatorPageData = {
  slug: 'hallway-paint-calculator',
  pageType: 'room-type',
  title: 'Hallway Paint Calculator – How Much Paint for a Hallway?',
  metaDescription:
    'Calculate paint for hallways and corridors. Get accurate estimates for long, narrow hallways with durable, scuff-resistant paint recommendations.',
  h1: 'Hallway Paint Calculator',
  defaults: {
    ...defaultInputs,
    length: 15,
    width: 4,
    height: 8,
    doors: 3,
    windows: 0,
    roomType: 'hallway',
  },
  introText:
    'Hallways take more abuse than almost any other room in your home. They are high-traffic areas that get bumped, scuffed, and brushed against daily. Our estimates below are for a standard hallway. Satin or semi-gloss finishes are recommended for durability and easy cleaning.',
  tips: [
    'Satin or semi-gloss finishes are ideal for hallways - they resist scuffs and clean easily.',
    'Consider scuff-resistant paint formulas specifically designed for high-traffic areas.',
    'Use a mini roller for narrow hallways where a full-size roller does not fit easily.',
    'Lighter colors help narrow hallways feel wider and brighter.',
  ],
  faqs: [
    {
      question: 'How much paint do I need for a hallway?',
      answer:
        'A standard 15-foot-long, 4-foot-wide hallway with 8-foot ceilings needs about 1 gallon of paint for two coats. Longer hallways or those with tall ceilings will need more. Deduct for any doors along the hallway.',
    },
    {
      question: 'What is the best paint for hallways?',
      answer:
        'Use a durable satin or semi-gloss paint in hallways. These finishes resist scuffs and fingerprints better than flat or eggshell. Some paint brands offer "scuff-resistant" formulas specifically designed for high-traffic areas.',
    },
    {
      question: 'How often should hallway paint be refreshed?',
      answer:
        'Hallways typically need repainting every 3-5 years due to high traffic. Using a durable finish and keeping touch-up paint on hand can extend the time between full repaints.',
    },
  ],
  relatedPages: [
    'living-room-paint-calculator',
    'bedroom-paint-calculator',
    '15x15-room-paint-calculator',
  ],
};

const nursery: CalculatorPageData = {
  slug: 'nursery-paint-calculator',
  pageType: 'room-type',
  title: 'Nursery Paint Calculator – How Much Paint for a Nursery?',
  metaDescription:
    'Calculate paint needed for a nursery or baby room. Safe, low-VOC paint estimates with gallon calculations and finish recommendations.',
  h1: 'Nursery Paint Calculator',
  defaults: {
    ...defaultInputs,
    length: 10,
    width: 10,
    height: 8,
    doors: 1,
    closetDoors: 1,
    windows: 1,
    roomType: 'bedroom',
  },
  introText:
    'Painting a nursery requires extra attention to safety. Low-VOC and zero-VOC paints are essential for your baby\'s health. Our estimates below are for a standard nursery room. Plan to paint at least 2-3 weeks before the baby arrives to allow fumes to fully dissipate.',
  tips: [
    'Always use zero-VOC or low-VOC paint in nurseries for your baby\'s safety.',
    'Paint the nursery at least 2-3 weeks before the baby arrives to let fumes dissipate completely.',
    'Eggshell finish is ideal for nurseries - it is easy to wipe clean and hides minor imperfections.',
    'Consider washable paint formulas for easy cleanup of inevitable wall marks and stains.',
  ],
  faqs: [
    {
      question: 'How much paint do I need for a nursery?',
      answer:
        'A standard 10x10 nursery with 8-foot ceilings needs about 1-2 gallons for two coats. This accounts for one door, one closet, and one window. Add extra if painting an accent wall or mural background.',
    },
    {
      question: 'Is low-VOC paint safe for nurseries?',
      answer:
        'Yes, low-VOC and zero-VOC paints are the safest options for nurseries. They emit fewer harmful chemicals and have minimal odor. Look for certifications like Greenguard Gold for the highest safety standards.',
    },
    {
      question: 'When should I paint the nursery before the baby arrives?',
      answer:
        'Paint the nursery at least 2-3 weeks before the due date. Even with low-VOC paint, allowing time for proper ventilation ensures the room is completely safe and odor-free when baby comes home.',
    },
  ],
  relatedPages: [
    'bedroom-paint-calculator',
    '10x10-room-paint-calculator',
    '10x12-room-paint-calculator',
    'office-paint-calculator',
  ],
};

const office: CalculatorPageData = {
  slug: 'office-paint-calculator',
  pageType: 'room-type',
  title: 'Home Office Paint Calculator – How Much Paint for an Office?',
  metaDescription:
    'Calculate paint needed for your home office. Accurate estimates with color recommendations for productivity and focus.',
  h1: 'Home Office Paint Calculator',
  defaults: {
    ...defaultInputs,
    length: 10,
    width: 12,
    height: 8,
    doors: 1,
    windows: 1,
    roomType: 'bedroom',
  },
  introText:
    'Your home office paint color can significantly impact your productivity and focus. Our estimates below are for a standard home office. Consider calming blues or greens for focus, or warm neutrals for a professional video call backdrop.',
  tips: [
    'Blue and green tones are proven to enhance focus and productivity in work spaces.',
    'Eggshell finish works well for home offices - professional look with easy cleaning.',
    'If you do video calls, choose colors that look good on camera (avoid stark white, which can glare).',
    'Consider painting one wall a darker accent color behind your desk for a polished video call background.',
  ],
  faqs: [
    {
      question: 'How much paint do I need for a home office?',
      answer:
        'A standard 10x12 home office with 8-foot ceilings needs about 1-2 gallons for two coats. This accounts for one door and one window. Smaller offices may need just 1 gallon.',
    },
    {
      question: 'What colors are best for a home office?',
      answer:
        'Soft blues, greens, and warm grays are excellent choices for home offices. Blue boosts productivity, green reduces eye strain, and warm neutrals create a professional atmosphere. Avoid overly bright or dark colors that can cause fatigue.',
    },
    {
      question: 'What paint finish should I use for a home office?',
      answer:
        'Eggshell or satin finishes work best for home offices. They provide a professional look, are easy to clean, and do not create glare from desk lamps or natural light.',
    },
  ],
  relatedPages: [
    'bedroom-paint-calculator',
    'nursery-paint-calculator',
    '10x12-room-paint-calculator',
    '10x10-room-paint-calculator',
  ],
};

const diningRoom: CalculatorPageData = {
  slug: 'dining-room-paint-calculator',
  pageType: 'room-type',
  title: 'Dining Room Paint Calculator – How Much Paint for a Dining Room?',
  metaDescription:
    'Calculate paint needed for your dining room. Accurate estimates with elegant finish recommendations for formal and casual dining spaces.',
  h1: 'Dining Room Paint Calculator',
  defaults: {
    ...defaultInputs,
    length: 14,
    width: 12,
    height: 8,
    doors: 2,
    windows: 2,
    roomType: 'bedroom',
  },
  introText:
    'Dining rooms set the tone for entertaining and family meals. Our estimates below are for a standard dining room with two openings and two windows. Satin or eggshell finishes are popular for dining rooms, offering an elegant look that is easy to maintain.',
  tips: [
    'Satin finish is the top choice for dining rooms - it adds a subtle elegance and cleans easily.',
    'Darker, richer colors like navy, forest green, or burgundy create a cozy, intimate dining atmosphere.',
    'If using a dark color over a light wall, plan for 3 coats or use a tinted primer to save on paint.',
    'Paint the ceiling a lighter shade than the walls to make the room feel taller.',
  ],
  faqs: [
    {
      question: 'How much paint do I need for a dining room?',
      answer:
        'A standard 14x12 dining room with 8-foot ceilings needs about 2 gallons for two coats. Deductions for two doorways and two windows are already factored in. Add a gallon if painting the ceiling.',
    },
    {
      question: 'What colors work well in dining rooms?',
      answer:
        'Rich, warm colors like deep blue, emerald green, warm gray, and burgundy create inviting dining spaces. For a more modern look, consider navy blue or charcoal accent walls with lighter complementary walls.',
    },
    {
      question: 'Should I use the same paint in my dining room and living room?',
      answer:
        'Using the same color or coordinating colors creates a cohesive flow, especially in open floor plans. If the rooms are separate, you have more freedom to choose different palettes. Consider using the same finish type in both rooms.',
    },
  ],
  relatedPages: [
    'living-room-paint-calculator',
    'kitchen-paint-calculator',
    '14x14-room-paint-calculator',
    '12x14-room-paint-calculator',
  ],
};

const basement: CalculatorPageData = {
  slug: 'basement-paint-calculator',
  pageType: 'room-type',
  title: 'Basement Paint Calculator – How Much Paint for a Basement?',
  metaDescription:
    'Calculate paint needed for your basement. Moisture-resistant paint estimates with waterproofing primer recommendations for below-grade walls.',
  h1: 'Basement Paint Calculator',
  defaults: {
    ...defaultInputs,
    length: 20,
    width: 15,
    height: 8,
    doors: 1,
    windows: 2,
    smallWindows: 2,
    roomType: 'basement',
    surfaceCondition: 'new-drywall',
    needsPrimer: true,
    primerType: 'pva',
  },
  introText:
    'This basement preset assumes finished new drywall in a dry basement and includes PVA primer. Bare concrete or block is a different surface with product-specific preparation and coverage, so use the coating label and enter its coverage rate instead of relying on this drywall preset.',
  measurementGuide: [
    'Identify the substrate first. Finished drywall, painted masonry, and bare block should not share one coverage assumption.',
    'Check for active leaks, efflorescence, or damp areas before measuring for paint. A coating is not a repair for water entry.',
    'Measure small foundation windows and utility-room openings separately. This preset includes two standard and two small windows.',
  ],
  tips: [
    'Always address moisture issues before painting - check for leaks, condensation, and water stains.',
    'Use moisture-blocking primer on concrete block walls before applying topcoat paint.',
    'Mold-resistant paint formulas are recommended for basements, especially in humid climates.',
    'Allow extra drying time between coats in basements due to higher humidity levels.',
  ],
  faqs: [
    {
      question: 'How much paint do I need for a basement?',
      answer:
        'This 20x15 finished-drywall preset uses about 4.1 gallons for two coats, so it rounds to 5 gallons of finish paint, plus 2 gallons of PVA primer. For concrete block, use the coverage rate and preparation instructions printed on the masonry coating you select.',
    },
    {
      question: 'Do I need special paint for basement walls?',
      answer:
        'Use a coating approved for the actual substrate and conditions. Finished drywall in a dry basement can use a suitable interior wall paint. Bare or previously coated masonry needs a compatible masonry system, and active water entry must be corrected before painting.',
    },
    {
      question: 'Can I paint basement walls without primer?',
      answer:
        'New drywall needs an appropriate drywall primer. Bare masonry and previously coated masonry require the preparation and primer specified by the coating manufacturer. A sound, clean, previously painted drywall surface may not always need a separate primer.',
    },
  ],
  relatedPages: [
    'garage-paint-calculator',
    '20x20-room-paint-calculator',
    '16x20-room-paint-calculator',
    '15x15-room-paint-calculator',
  ],
  affiliates: [
    { title: 'Waterproofing Primer', description: 'Moisture-blocking primer that seals concrete and masonry basement walls.', icon: 'primer', link: 'https://www.amazon.com/s?k=waterproofing+basement+primer&i=tools&tag=paintpro02-20', cta: 'Shop Primer' },
    { title: 'Mold-Resistant Paint', description: 'Basement-grade paint with built-in mold and mildew protection for below-grade walls.', icon: 'paint', link: 'https://www.amazon.com/s?k=mold+resistant+basement+paint&i=tools&tag=paintpro02-20', cta: 'Shop Paint' },
    { title: 'Paint Supplies', description: 'Rollers, brushes, tape, and drop cloths for basement painting projects.', icon: 'brush', link: 'https://www.amazon.com/s?k=paint+supplies+kit&i=tools&tag=paintpro02-20', cta: 'Shop Supplies' },
  ],
};

// --- Room Size Pages ---

function roomSizePage(
  lengthFt: number,
  widthFt: number,
  extraDefaults: Partial<CalculationInputs> = {},
  extraFaqs: FAQ[] = [],
): CalculatorPageData {
  const sizeLabel = `${lengthFt}x${widthFt}`;
  const area = lengthFt * widthFt;
  const isSmall = area <= 100;
  const isMedium = area > 100 && area <= 200;
  const isLarge = area > 200;

  const sizeDesc = isSmall ? 'small' : isMedium ? 'medium' : 'large';

  const relatedSizes: string[] = [];
  const allSizes = [
    [8, 8],
    [8, 10],
    [10, 10],
    [10, 12],
    [12, 12],
    [12, 14],
    [14, 14],
    [14, 16],
    [15, 15],
    [16, 16],
    [16, 20],
    [20, 20],
  ] as const;
  for (const [l, w] of allSizes) {
    if (l === lengthFt && w === widthFt) continue;
    if (Math.abs(l * w - area) <= 80) {
      relatedSizes.push(`${l}x${w}-room-paint-calculator`);
    }
  }

  const roomTypeLinks = isSmall
    ? ['bathroom-paint-calculator', 'nursery-paint-calculator', 'office-paint-calculator']
    : isMedium
      ? ['bedroom-paint-calculator', 'dining-room-paint-calculator', 'kitchen-paint-calculator']
      : ['living-room-paint-calculator', 'garage-paint-calculator', 'basement-paint-calculator'];

  const doors = isSmall ? 1 : isMedium ? 1 : 2;
  const windows = isSmall ? 1 : isMedium ? 2 : 3;

  return {
    slug: `${sizeLabel}-room-paint-calculator`,
    pageType: 'room-size',
    title: `How Much Paint for a ${sizeLabel} Room? Paint Calculator`,
    metaDescription: `Calculate exactly how much paint you need for a ${sizeLabel} foot room. Get accurate gallon estimates for ${area} sq ft with our free paint calculator.`,
    h1: `${sizeLabel} Room Paint Calculator`,
    defaults: {
      ...defaultInputs,
      length: lengthFt,
      width: widthFt,
      doors,
      windows,
      ...extraDefaults,
    },
    introText: `Need to know how much paint to buy for a ${sizeLabel}-foot room? At ${area} square feet of floor area, this is a ${sizeDesc}-sized room. Our pre-calculated estimates below show exactly how many gallons you need for two coats of standard paint, with deductions for ${doors === 1 ? 'one door' : 'two doors'} and ${windows === 1 ? 'one window' : `${windows} windows`}.`,
    tips: [
      `A ${sizeLabel} room (${area} sq ft) ${isLarge ? 'benefits from buying a 5-gallon bucket for consistent color and better value' : 'is efficiently covered with standard 1-gallon cans'}.`,
      'Always buy slightly more paint than calculated - extra paint is useful for future touch-ups.',
      'Two coats are recommended for even color coverage and better durability.',
      isSmall
        ? 'Lighter colors make small rooms feel more spacious and open.'
        : 'Test your color on a 2-foot square section of wall before committing to the entire room.',
    ],
    faqs: [
      {
        question: `How much paint do I need for a ${sizeLabel} room?`,
        answer: `A ${sizeLabel} room with 8-foot ceilings has approximately ${Math.round(2 * (lengthFt + widthFt) * 8)} square feet of wall area before deductions. After accounting for ${doors === 1 ? 'one door' : 'two doors'} and ${windows === 1 ? 'one window' : `${windows} windows`}, you will typically need about ${Math.ceil(((2 * (lengthFt + widthFt) * 8 - doors * 21 - windows * 15) * 2) / 400 * 1.15)} gallons for two coats of standard paint.`,
      },
      {
        question: `How many square feet of wall space does a ${sizeLabel} room have?`,
        answer: `A ${sizeLabel} room with standard 8-foot ceilings has ${2 * (lengthFt + widthFt) * 8} square feet of total wall area. After subtracting for doors and windows (typically ${doors * 21 + windows * 15} sq ft), the net paintable area is about ${2 * (lengthFt + widthFt) * 8 - doors * 21 - windows * 15} square feet.`,
      },
      ...extraFaqs,
    ],
    relatedPages: [...relatedSizes.slice(0, 3), ...roomTypeLinks.slice(0, 2)],
  };
}

const size8x8 = roomSizePage(8, 8, {}, [
  {
    question: 'Is one gallon enough for an 8x8 room?',
    answer:
      'One gallon of paint covers about 400 square feet. An 8x8 room has about 256 square feet of wall area. For a single coat, one gallon is enough. For the recommended two coats, you will need 2 gallons.',
  },
]);

const size8x10 = roomSizePage(8, 10, {}, [
  {
    question: 'What is an 8x10 room typically used for?',
    answer:
      'An 8x10 room (80 sq ft) is commonly a small bedroom, home office, nursery, or walk-in closet. The paint calculation is the same regardless of use, but finish recommendations vary by room type.',
  },
]);

const size10x10 = roomSizePage(10, 10, {}, [
  {
    question: 'How much does it cost to paint a 10x10 room?',
    answer:
      'Paint for a 10x10 room costs $50-$120 depending on paint quality. Budget paint runs about $25/gallon, standard $35-45/gallon, and premium $50-70/gallon. You will need about 2 gallons for two coats.',
  },
]);

const size10x12 = roomSizePage(10, 12, {}, [
  {
    question: 'Is a 10x12 room a standard bedroom size?',
    answer:
      'Yes, 10x12 (120 sq ft) is a common bedroom size in many homes. It comfortably fits a queen bed with nightstands. Budget about 2 gallons of paint for two coats on the walls.',
  },
]);

const size12x12 = roomSizePage(12, 12, {}, [
  {
    question: 'How much paint for a 12x12 room with 2 coats?',
    answer:
      'A 12x12 room with 8-foot ceilings needs about 2 gallons of paint for two coats. This accounts for standard deductions (one door and two windows). The total paintable wall area is approximately 333 square feet.',
  },
]);

const size12x14 = roomSizePage(12, 14, {}, [
  {
    question: 'How long does it take to paint a 12x14 room?',
    answer:
      'A 12x14 room typically takes 4-6 hours to paint with two coats, including prep time. Allow 2-4 hours of drying time between coats. The entire project can usually be completed in a weekend.',
  },
]);

const size14x14 = roomSizePage(14, 14, {}, [
  {
    question: 'What size room is 14x14?',
    answer:
      'A 14x14 room (196 sq ft) is a good-sized master bedroom, large home office, or small living room. At nearly 200 square feet of floor space, it is comfortable for most furniture layouts.',
  },
]);

const size14x16 = roomSizePage(14, 16, {}, [
  {
    question: 'How many gallons for a 14x16 room with high ceilings?',
    answer:
      'With standard 8-foot ceilings, a 14x16 room needs about 3 gallons. With 10-foot ceilings, plan for 3-4 gallons. With 12-foot ceilings, you will need about 4 gallons for two coats.',
  },
]);

const size15x15 = roomSizePage(15, 15, {}, [
  {
    question: 'Is 15x15 a large room?',
    answer:
      'A 15x15 room (225 sq ft) is a medium-to-large room. It is a common size for master bedrooms, family rooms, or large home offices. You will need about 3 gallons for two coats of paint.',
  },
]);

const size16x16 = roomSizePage(16, 16, {}, [
  {
    question: 'How much paint for a 16x16 room ceiling?',
    answer:
      'A 16x16 ceiling is 256 square feet. You will need about 1-2 gallons of ceiling paint for two coats. Ceiling paint is thicker than wall paint and formulated to minimize drips overhead.',
  },
]);

const size16x20 = roomSizePage(16, 20, {}, [
  {
    question: 'Should I use a paint sprayer for a 16x20 room?',
    answer:
      'A paint sprayer can save time in a large 16x20 room (320 sq ft floor area). However, spraying requires more prep work to mask off areas. For most DIYers, a roller and brush combo works well and is easier to control.',
  },
]);

const size20x20 = roomSizePage(20, 20, {}, [
  {
    question: 'How much paint for a 20x20 room?',
    answer:
      'A 20x20 room with 8-foot ceilings needs about 4 gallons for two coats of standard paint. This is after deducting for two doors and three windows. Consider buying a 5-gallon bucket for better value.',
  },
]);

// --- Brand Pages ---

const brandComparisonTable: BrandCoverageEntry[] = [
  { brand: 'Behr', slug: 'behr-coverage', coverageRate: 400, priceTier: '$$' },
  { brand: 'Sherwin-Williams', slug: 'sherwin-williams-coverage', coverageRate: 400, priceTier: '$$$' },
  { brand: 'Benjamin Moore', slug: 'benjamin-moore-coverage', coverageRate: 400, priceTier: '$$$' },
  { brand: 'Valspar', slug: 'valspar-coverage', coverageRate: 400, priceTier: '$$' },
  { brand: 'PPG', slug: 'ppg-coverage', coverageRate: 350, priceTier: '$$' },
  { brand: 'Glidden', slug: 'glidden-coverage', coverageRate: 350, priceTier: '$' },
  { brand: 'Rust-Oleum', slug: 'rust-oleum-coverage', coverageRate: 350, priceTier: '$$' },
  { brand: 'Farrow & Ball', slug: 'farrow-and-ball-coverage', coverageRate: 450, priceTier: '$$$$' },
];

function brandPage(
  brand: string,
  slug: string,
  coverageRate: number,
  priceTier: string,
  affiliateLink: string,
  intro: string,
  tips: string[],
  faqs: FAQ[],
): CalculatorPageData {
  const otherBrandSlugs = brandComparisonTable
    .filter((b) => b.slug !== slug)
    .map((b) => b.slug);

  return {
    slug,
    pageType: 'brand',
    brand,
    title: `${brand} Paint Coverage Calculator – How Much ${brand} Paint Per Gallon?`,
    metaDescription: `Calculate how much ${brand} paint you need. ${brand} covers ${coverageRate} sq ft per gallon. Get accurate gallon estimates for your project.`,
    h1: `${brand} Paint Coverage Calculator`,
    defaults: {
      ...defaultInputs,
      customCoverageRate: coverageRate,
    },
    introText: intro,
    tips,
    faqs,
    relatedPages: [...otherBrandSlugs.slice(0, 3), 'bedroom-paint-calculator', 'living-room-paint-calculator'],
    affiliates: [
      { title: `${brand} Paint`, description: `Shop ${brand} interior and exterior paints on Amazon.`, icon: 'paint', link: affiliateLink, cta: `Shop ${brand}` },
      { title: 'Paint Supplies', description: 'Quality rollers, brushes, tape, and drop cloths for a professional finish.', icon: 'brush', link: 'https://www.amazon.com/s?k=paint+supplies+kit&i=tools&tag=paintpro02-20', cta: 'Shop Supplies' },
      { title: 'Paint Sprayers', description: 'Save time on big projects with an electric or airless paint sprayer.', icon: 'sprayer', link: 'https://www.amazon.com/s?k=paint+sprayer&i=tools&tag=paintpro02-20', cta: 'View Sprayers' },
    ],
    brandDisclaimer: `This calculator is not affiliated with or endorsed by ${brand}. Coverage rates are based on published manufacturer specifications and may vary by product line, color, and surface condition.`,
    brandComparisonTable,
  };
}

const behr = brandPage(
  'Behr', 'behr-coverage', 400, '$$',
  'https://www.amazon.com/s?k=behr+paint&i=tools&tag=paintpro02-20',
  'Behr paint, available exclusively at The Home Depot, covers approximately 400 square feet per gallon. Known for excellent value and a wide color selection, Behr is one of the most popular paint brands for DIY projects. Use our calculator below to see how much Behr paint you need for your room.',
  [
    'Behr Premium Plus covers up to 400 sq ft per gallon on smooth surfaces.',
    'Behr Marquee offers one-coat coverage on many colors, reducing total paint needed.',
    'Available exclusively at Home Depot  -  check online for color-matching tools.',
    'Behr paints are Greenguard Gold certified for low emissions.',
  ],
  [
    { question: 'How much does Behr paint cover per gallon?', answer: 'Behr Premium Plus and Dynasty lines cover approximately 350-400 square feet per gallon on smooth, primed surfaces. Textured walls or unprimed surfaces reduce coverage by 15-35%.' },
    { question: 'Is Behr a good paint brand?', answer: 'Behr consistently ranks as a top consumer paint brand. Their Premium Plus and Marquee lines offer excellent coverage, durability, and color selection at a mid-range price point. Behr Marquee is their premium one-coat option.' },
    { question: 'Where can I buy Behr paint?', answer: 'Behr paint is sold exclusively at The Home Depot, both in stores and online. They offer over 1,000 colors and custom color matching.' },
  ],
);

const sherwinWilliams = brandPage(
  'Sherwin-Williams', 'sherwin-williams-coverage', 400, '$$$',
  'https://www.amazon.com/s?k=sherwin+williams+paint&i=tools&tag=paintpro02-20',
  'Sherwin-Williams sells several interior paint lines with different coverage, hide, and durability ratings. This preset uses 400 square feet per gallon as a planning value. Check the technical data sheet for the product and sheen you choose before buying.',
  [
    'Sherwin-Williams Duration covers up to 400 sq ft per gallon with excellent hide.',
    'Their SuperPaint line is a favorite among professional painters for its balance of quality and value.',
    'Color-matching services are available at all Sherwin-Williams retail stores.',
    'Ask about contractor discounts and bulk pricing for larger projects.',
  ],
  [
    { question: 'How much does Sherwin-Williams paint cover per gallon?', answer: 'Sherwin-Williams interior paints cover approximately 350-400 square feet per gallon. Duration and Emerald lines may cover slightly more due to higher solids content. Always check the specific product data sheet.' },
    { question: 'Is Sherwin-Williams paint worth the price?', answer: 'Sherwin-Williams is considered a premium paint brand. While more expensive than big-box brands, it offers superior coverage, durability, and color accuracy. Many professionals consider it the industry standard.' },
    { question: 'What is the best Sherwin-Williams paint for interior walls?', answer: 'Duration and Emerald are their top interior lines. Duration offers excellent washability and durability, while Emerald provides advanced stain-blocking and one-coat coverage on many colors.' },
  ],
);

const benjaminMoore = brandPage(
  'Benjamin Moore', 'benjamin-moore-coverage', 400, '$$$',
  'https://www.amazon.com/s?k=benjamin+moore+paint&i=tools&tag=paintpro02-20',
  'Benjamin Moore is a premium paint brand renowned for its color quality and coverage. Their interior paints cover approximately 400 square feet per gallon. With their proprietary Gennex color system, Benjamin Moore offers unmatched color accuracy and depth.',
  [
    'Benjamin Moore Regal Select covers up to 400 sq ft per gallon on smooth surfaces.',
    'Their Aura line offers premium coverage and color richness  -  often requires fewer coats.',
    'Benjamin Moore paints are only available at independent paint retailers.',
    'Use their Color Portfolio app to preview colors in your space before buying.',
  ],
  [
    { question: 'How much does Benjamin Moore paint cover per gallon?', answer: 'Benjamin Moore interior paints typically cover 350-400 square feet per gallon. Their Aura line, with higher pigment levels, may cover more effectively, sometimes achieving full coverage in one coat.' },
    { question: 'Is Benjamin Moore better than Sherwin-Williams?', answer: 'Both are premium paint brands. Benjamin Moore is often preferred for its color richness and depth, while Sherwin-Williams is valued for its availability and contractor-friendly pricing. Both deliver excellent coverage and durability.' },
    { question: 'Where can I buy Benjamin Moore paint?', answer: 'Benjamin Moore is sold exclusively through independent paint retailers and hardware stores. Use their store locator at benjaminmoore.com to find a retailer near you.' },
  ],
);

const valspar = brandPage(
  'Valspar', 'valspar-coverage', 400, '$$',
  'https://www.amazon.com/s?k=valspar+paint&i=tools&tag=paintpro02-20',
  'Valspar paint offers excellent coverage at a competitive price point. Available at Lowe\'s, Valspar covers approximately 400 square feet per gallon. Their paint-and-primer-in-one formulas make painting easier for DIYers.',
  [
    'Valspar Signature covers up to 400 sq ft per gallon with built-in primer.',
    'Their Reserve line offers scrub-resistant coverage ideal for high-traffic areas.',
    'Available exclusively at Lowe\'s  -  look for seasonal sales and promotions.',
    'Valspar offers a color-matching guarantee at Lowe\'s paint counters.',
  ],
  [
    { question: 'How much does Valspar paint cover per gallon?', answer: 'Valspar Signature and Reserve lines cover approximately 350-400 square feet per gallon. Paint-and-primer formulas may cover slightly less on first coat but typically need fewer total coats.' },
    { question: 'Is Valspar a good paint brand?', answer: 'Valspar offers excellent value for DIY projects. Their Signature and Reserve lines provide good coverage and durability at a mid-range price. They are a solid choice for homeowners looking for quality without premium pricing.' },
    { question: 'Where can I buy Valspar paint?', answer: 'Valspar paint is available exclusively at Lowe\'s home improvement stores and lowes.com. They offer over 1,000 colors and free color matching.' },
  ],
);

const ppg = brandPage(
  'PPG', 'ppg-coverage', 350, '$$',
  'https://www.amazon.com/s?k=ppg+paint+interior&i=tools&tag=paintpro02-20',
  'PPG paints cover approximately 350 square feet per gallon. PPG manufactures paints under several brand names and offers professional-quality coatings for every budget. Their Diamond and Timeless lines are popular at Home Depot.',
  [
    'PPG Diamond covers about 350 sq ft per gallon  -  plan for slightly more paint than premium brands.',
    'Their Timeless line with paint-and-primer combination reduces prep work.',
    'PPG paints are available at Home Depot, PPG Paints stores, and independent dealers.',
    'PPG offers both professional and consumer-grade lines for different budgets.',
  ],
  [
    { question: 'How much does PPG paint cover per gallon?', answer: 'PPG interior paints cover approximately 300-350 square feet per gallon depending on the product line. Diamond and Timeless are their most popular consumer lines. Textured or porous surfaces will reduce coverage further.' },
    { question: 'Is PPG paint good quality?', answer: 'PPG is one of the world\'s largest paint manufacturers. Their consumer lines offer solid quality at mid-range pricing. Their professional lines are widely used by contractors and offer excellent durability and coverage.' },
    { question: 'Where is PPG paint sold?', answer: 'PPG paints are sold at Home Depot, PPG Paints stores, and independent paint retailers. Their Diamond and Timeless lines are Home Depot exclusives.' },
  ],
);

const glidden = brandPage(
  'Glidden', 'glidden-coverage', 350, '$',
  'https://www.amazon.com/s?k=glidden+paint+interior&i=tools&tag=paintpro02-20',
  'Glidden is a budget-friendly paint brand covering approximately 350 square feet per gallon. Owned by PPG, Glidden delivers reliable results for cost-conscious painters. It is a popular choice for rental properties and multi-room projects.',
  [
    'Glidden covers about 350 sq ft per gallon  -  budget for extra paint compared to premium brands.',
    'Glidden Premium offers paint-and-primer in one for easier single-product jobs.',
    'Best value for painting multiple rooms or rental properties.',
    'Available at Home Depot, Walmart, and other home improvement retailers.',
  ],
  [
    { question: 'How much does Glidden paint cover per gallon?', answer: 'Glidden interior paints cover approximately 300-350 square feet per gallon. Their Premium line with primer may require an extra coat compared to higher-end brands. Plan for slightly more paint than premium options.' },
    { question: 'Is Glidden paint good for interior walls?', answer: 'Glidden is a solid budget paint brand. It works well for bedrooms, living rooms, and other standard interior walls. For high-moisture areas like bathrooms, consider upgrading to a moisture-resistant brand.' },
    { question: 'What is the difference between Glidden and PPG?', answer: 'Glidden is owned by PPG and serves as their budget-friendly consumer brand. PPG Diamond and Timeless are their mid-range lines with better coverage and durability. All are manufactured by PPG Industries.' },
  ],
);

const rustOleum = brandPage(
  'Rust-Oleum', 'rust-oleum-coverage', 350, '$$',
  'https://www.amazon.com/s?k=rust-oleum+interior+paint&i=tools&tag=paintpro02-20',
  'Rust-Oleum covers approximately 350 square feet per gallon and is best known for specialty coatings. While famous for their rust-prevention products, Rust-Oleum also makes excellent interior paints, cabinet kits, and floor coatings for DIY projects.',
  [
    'Rust-Oleum covers about 350 sq ft per gallon for standard interior wall paint.',
    'Their Cabinet Transformations kit is a popular alternative to full cabinet replacement.',
    'Rust-Oleum specialty products (chalk paint, garage floor epoxy) have different coverage rates.',
    'Available at most hardware stores, Home Depot, Lowe\'s, and Amazon.',
  ],
  [
    { question: 'How much does Rust-Oleum paint cover per gallon?', answer: 'Rust-Oleum interior paints cover approximately 300-350 square feet per gallon. Specialty products like chalk paint and epoxy coatings have varying coverage rates  -  always check the product label.' },
    { question: 'Is Rust-Oleum good for interior walls?', answer: 'Rust-Oleum is better known for specialty coatings (cabinets, furniture, garage floors) than full-room wall painting. For walls, their interior line works well but brands like Behr or Valspar may offer more color options.' },
    { question: 'What is Rust-Oleum best known for?', answer: 'Rust-Oleum is most famous for their rust-preventive coatings, spray paints, and specialty products like Cabinet Transformations, garage floor epoxy, chalk paint, and countertop coatings.' },
  ],
);

const farrowAndBall = brandPage(
  'Farrow & Ball', 'farrow-and-ball-coverage', 450, '$$$$',
  'https://www.amazon.com/s?k=farrow+and+ball+paint&i=tools&tag=paintpro02-20',
  'Farrow & Ball is a luxury paint brand covering approximately 450 square feet per gallon thanks to its high pigment concentration. Handcrafted in Dorset, England, Farrow & Ball paints are renowned for their exceptional depth of color and rich, complex finishes.',
  [
    'Farrow & Ball covers up to 450 sq ft per gallon  -  high pigment concentration means better coverage.',
    'Colors change dramatically in different lighting  -  test samples on your walls first.',
    'Their Estate Emulsion finish gives walls a chalky, sophisticated look.',
    'Available at Farrow & Ball showrooms, select retailers, and online.',
  ],
  [
    { question: 'How much does Farrow & Ball paint cover per gallon?', answer: 'Farrow & Ball paints cover approximately 400-450 square feet per gallon. Their high pigment content provides excellent coverage and rich color depth, often requiring fewer coats than budget brands.' },
    { question: 'Why is Farrow & Ball so expensive?', answer: 'Farrow & Ball uses high-quality pigments, traditional manufacturing methods, and carefully curated color formulas. Each paint is made in small batches in their Dorset factory. The price reflects premium ingredients and artisan production.' },
    { question: 'Is Farrow & Ball paint worth it?', answer: 'For design-conscious homeowners, Farrow & Ball offers unmatched color depth and finish quality. The colors are complex and change beautifully with light. While expensive, the high pigment content means better coverage per coat, partially offsetting the cost.' },
  ],
);

// --- Color Change Pages ---

function colorChangePage(
  scenario: string,
  slug: string,
  numCoats: number,
  needsPrimer: boolean,
  primerType: 'standard' | 'high-hide' | 'pva' | undefined,
  title: string,
  metaDesc: string,
  h1: string,
  intro: string,
  explanation: string,
  tips: string[],
  faqs: FAQ[],
): CalculatorPageData {
  const allColorChangeSlugs = [
    'dark-to-light-paint-calculator',
    'light-to-dark-paint-calculator',
    'similar-colors-paint-calculator',
    'red-to-white-paint-calculator',
    'white-to-dark-paint-calculator',
  ];
  const otherSlugs = allColorChangeSlugs.filter((s) => s !== slug);

  return {
    slug,
    pageType: 'color-change',
    title,
    metaDescription: metaDesc,
    h1,
    defaults: {
      ...defaultInputs,
      numCoats,
      needsPrimer,
      ...(primerType ? { primerType } : {}),
    },
    introText: intro,
    scenarioExplanation: explanation,
    tips,
    faqs,
    relatedPages: [...otherSlugs.slice(0, 3), 'bedroom-paint-calculator', '12x12-room-paint-calculator'],
    affiliates: [
      { title: 'High-Hide Primer', description: 'Stain-blocking primer for dramatic color changes. Ensures even coverage and true color.', icon: 'primer', link: 'https://www.amazon.com/s?k=high+hide+primer+paint&i=tools&tag=paintpro02-20', cta: 'Shop Primer' },
      { title: 'Premium Paint', description: 'Top-rated interior paints with excellent coverage for color transitions.', icon: 'paint', link: 'https://www.amazon.com/s?k=interior+wall+paint+high+coverage&i=tools&tag=paintpro02-20', cta: 'Browse Paint' },
      { title: 'Paint Supplies', description: 'Quality rollers, brushes, tape, and drop cloths for a professional finish.', icon: 'brush', link: 'https://www.amazon.com/s?k=paint+supplies+kit&i=tools&tag=paintpro02-20', cta: 'Shop Supplies' },
    ],
  };
}

const darkToLight = colorChangePage(
  'dark-to-light', 'dark-to-light-paint-calculator', 3, true, 'high-hide',
  'Painting Dark to Light – How Many Coats? Paint Calculator',
  'Painting over dark walls with light paint? Calculate how many gallons you need with primer and 3 coats for full coverage.',
  'Dark to Light Paint Calculator',
  'Painting over dark walls with a lighter color is one of the most common  -  and trickiest  -  color change scenarios. Dark pigments bleed through light paint, requiring primer and extra coats for full coverage. Our calculator below pre-sets 3 coats plus high-hide primer to ensure accurate results.',
  'When painting dark walls light, the dark color will bleed through standard paint even after two coats. A high-hide primer creates a neutral base, and 3 coats of your new light color ensures even, streak-free coverage. This approach uses more paint but prevents frustrating bleed-through and uneven color.',
  [
    'Always use a high-hide or stain-blocking primer when going from dark to light colors.',
    'Tint your primer gray (not white) to help bridge the gap between dark and light.',
    'Plan for 3 coats of topcoat paint after primer for full, even coverage.',
    'Allow each coat to dry completely (2-4 hours) before applying the next coat.',
  ],
  [
    { question: 'How many coats to paint over dark walls?', answer: 'When painting dark walls a light color, plan for 1 coat of high-hide primer plus 3 coats of your new paint color. Some very dark colors (black, deep red, navy) may need 2 coats of primer. Skipping primer will require 4-5 coats of paint.' },
    { question: 'Do I need primer to paint over dark walls?', answer: 'Yes. Primer is essential when going from dark to light. A high-hide or stain-blocking primer prevents the dark color from bleeding through. Without primer, you may need 4-5 coats and still see the dark color underneath.' },
    { question: 'How much extra paint do I need for dark to light?', answer: 'Budget about 50% more paint than a standard repaint. Instead of 2 coats, you will need 3 coats plus primer. For a 12x12 room, this means about 3-4 gallons of paint plus 1-2 gallons of primer.' },
  ],
);

const lightToDark = colorChangePage(
  'light-to-dark', 'light-to-dark-paint-calculator', 2, false, undefined,
  'Painting Light to Dark – How Many Coats? Paint Calculator',
  'Painting light walls dark? Calculate paint needed. Most light-to-dark projects need 2 coats with no primer required.',
  'Light to Dark Paint Calculator',
  'Painting light walls a darker color is easier than the reverse. Dark paint covers light surfaces well, and most projects need only 2 coats without primer. Our calculator below reflects this simpler scenario for accurate gallon estimates.',
  'Going from light to dark is the easiest color change scenario. Dark pigments cover light colors effectively, and standard 2-coat coverage is usually sufficient. Primer is typically not needed unless the walls have stains or damage. Some very deep colors may benefit from a tinted primer to achieve richer results.',
  [
    'Two coats are usually sufficient for light-to-dark color changes.',
    'For very deep colors (navy, black, dark green), ask your paint store to tint a primer to a similar dark shade.',
    'Use a high-quality paint with good hide for the best results in fewer coats.',
    'Dark colors show wall imperfections more  -  repair any dents or patches before painting.',
  ],
  [
    { question: 'How many coats to go from light to dark paint?', answer: 'Most light-to-dark color changes need 2 coats of paint. This is the standard recommendation and usually provides full, even coverage. Very deep colors like black or navy may benefit from a tinted primer for richer results.' },
    { question: 'Do I need primer for light to dark painting?', answer: 'Usually no. When going from light to dark, the dark pigments cover easily. Primer is only needed if the walls have stains, water damage, or you are painting new drywall. For very deep colors, a tinted primer can help achieve richer color.' },
    { question: 'Is it easier to paint light to dark or dark to light?', answer: 'Light to dark is significantly easier. Dark paint covers light colors well in 2 coats. Dark to light requires primer and 3+ coats because light paint cannot hide dark pigments underneath.' },
  ],
);

const similarColors = colorChangePage(
  'similar-colors', 'similar-colors-paint-calculator', 2, false, undefined,
  'Painting Similar Colors – How Many Coats? Paint Calculator',
  'Repainting with a similar color? Calculate paint needed. Similar color changes typically need just 2 coats, no primer.',
  'Similar Colors Paint Calculator',
  'Repainting with a similar color  -  like swapping one shade of gray for another  -  is the simplest painting scenario. Two coats provide full coverage without primer. Our calculator reflects this straightforward approach.',
  'When the old and new colors are in the same family (similar hue and value), 2 coats of quality paint provide complete coverage. No primer is needed unless the walls have damage or stains. This is the most paint-efficient scenario and the easiest for DIYers.',
  [
    'Two coats are all you need for similar color changes  -  no primer required.',
    'This is the most cost-effective painting scenario  -  you will use the least amount of paint.',
    'Ensure the new color is truly similar  -  within 2-3 shades on the same color strip.',
    'Even with similar colors, use quality paint for the best long-term results.',
  ],
  [
    { question: 'How many coats for a similar color change?', answer: '2 coats of paint is standard for similar color changes. Since the colors are close in hue and value, coverage is quick and even. No primer is needed for this scenario.' },
    { question: 'Do I need primer when repainting a similar color?', answer: 'No. When repainting with a similar color, primer is not needed. The existing paint provides a good base for the new color. Only use primer if there are stains, patches, or wall damage.' },
    { question: 'Can I use one coat for a very similar color?', answer: 'While one coat may look acceptable, two coats are always recommended. The second coat ensures even coverage, hides any thin spots, and provides better durability. The extra paint cost is minimal for similar-color repaints.' },
  ],
);

const redToWhite = colorChangePage(
  'red-to-white', 'red-to-white-paint-calculator', 3, true, 'high-hide',
  'Painting Red to White – How Many Coats? Paint Calculator',
  'Painting over red walls with white paint? Calculate paint needed. Red requires high-hide primer and 3+ coats for complete coverage.',
  'Red to White Paint Calculator',
  'Red is one of the hardest paint colors to cover. Red pigments are notoriously persistent and bleed through standard paint and primer. Painting red walls white requires a specialized approach: high-hide primer and 3 coats of paint for clean, complete coverage.',
  'Red pigments are among the most difficult to cover because they are highly concentrated and tend to bleed through regular paint and even standard primers. A shellac-based or high-hide primer is essential to block the red from showing through. After priming, 3 coats of white paint ensures a clean, even finish with no pink bleed-through.',
  [
    'Use shellac-based or high-hide primer  -  standard primer will not fully block red pigments.',
    'Apply 2 coats of primer if the red is particularly vibrant or saturated.',
    'Plan for 3 coats of white paint after primer for a clean, bleed-free finish.',
    'Do not rush between coats  -  let each coat dry fully to assess coverage before adding the next.',
  ],
  [
    { question: 'How many coats to cover red paint with white?', answer: 'Covering red walls with white requires 1-2 coats of high-hide primer plus 3 coats of white paint. Red is one of the hardest colors to cover. Shellac-based primer works best for blocking red pigments from bleeding through.' },
    { question: 'Why is red paint so hard to cover?', answer: 'Red paint uses highly concentrated pigments that are chemically resistant to being covered. These pigments dissolve into wet paint and primer, causing pink bleed-through. Only shellac-based or specialized high-hide primers can fully block red pigments.' },
    { question: 'How much paint do I need to cover red walls?', answer: 'Budget about 75% more paint than a standard repaint. You will need primer plus 3 coats of paint. For a 12x12 room, plan on 4-5 gallons of paint plus 1-2 gallons of primer. Red-to-white is the most paint-intensive color change.' },
  ],
);

const whiteToDark = colorChangePage(
  'white-to-dark', 'white-to-dark-paint-calculator', 2, true, 'standard',
  'Painting White to Dark – How Many Coats? Paint Calculator',
  'Painting white walls a dark color? Calculate paint needed. Use a tinted primer and 2 coats for rich, even color.',
  'White to Dark Paint Calculator',
  'Painting white walls a dark color benefits from a tinted primer to help the dark paint achieve its full depth and richness. While dark paint covers white easily, a primer tinted close to your final color reduces the number of topcoats needed and ensures even, rich results.',
  'White walls reflect light and can make dark paint look uneven or thin in the first coat. A primer tinted to a medium gray or close to your final color creates a better base for dark paint. This results in richer color in fewer coats and eliminates the patchy look that can happen when dark paint is applied directly over bright white.',
  [
    'Use a primer tinted to gray or a shade close to your dark paint color for best results.',
    'Two coats of dark paint over tinted primer gives the richest, most even results.',
    'Dark colors show roller marks and lap lines more  -  maintain a wet edge while painting.',
    'Use a high-quality roller cover (3/8" nap for smooth walls) to minimize texture marks.',
  ],
  [
    { question: 'How many coats for white to dark paint?', answer: 'With a tinted primer, 2 coats of dark paint is usually sufficient. Without primer, you may need 3 coats as the first coat over white will look thin and uneven. Tinted primer provides the most efficient path to rich, dark walls.' },
    { question: 'Do I need primer when painting white walls dark?', answer: 'Primer is recommended but not as critical as when going dark to light. A tinted primer helps dark paint achieve its full color depth in fewer coats. Without primer, plan for an extra coat of paint.' },
    { question: 'Should I tint my primer for dark paint?', answer: 'Yes. Ask your paint store to tint your primer to a medium gray or a shade close to your final dark color. This helps the dark paint achieve full, rich color in 2 coats instead of 3. Most paint stores offer primer tinting at no extra charge.' },
  ],
);

export const calculatorPages: CalculatorPageData[] = [
  // Room type pages
  bedroom,
  bathroom,
  kitchen,
  livingRoom,
  garage,
  hallway,
  nursery,
  office,
  diningRoom,
  basement,
  // Room size pages
  size8x8,
  size8x10,
  size10x10,
  size10x12,
  size12x12,
  size12x14,
  size14x14,
  size14x16,
  size15x15,
  size16x16,
  size16x20,
  size20x20,
  // Brand pages
  behr,
  sherwinWilliams,
  benjaminMoore,
  valspar,
  ppg,
  glidden,
  rustOleum,
  farrowAndBall,
  // Color change pages
  darkToLight,
  lightToDark,
  similarColors,
  redToWhite,
  whiteToDark,
];

export function getPageBySlug(slug: string): CalculatorPageData | undefined {
  return calculatorPages.find((p) => p.slug === slug);
}
