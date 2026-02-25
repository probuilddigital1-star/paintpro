import type { CalculationInputs } from '../utils/paint-calculator';

export interface FAQ {
  question: string;
  answer: string;
}

export interface CalculatorPageData {
  slug: string;
  pageType: 'room-type' | 'room-size';
  title: string;
  metaDescription: string;
  h1: string;
  defaults: CalculationInputs;
  introText: string;
  tips: string[];
  faqs: FAQ[];
  relatedPages: string[];
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
    'nursery-paint-calculator',
    'office-paint-calculator',
    '12x12-room-paint-calculator',
    '10x12-room-paint-calculator',
    '14x14-room-paint-calculator',
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
  tips: [
    'Semi-gloss finish is the gold standard for bathrooms—it resists moisture and is easy to wipe clean.',
    'Use mildew-resistant paint formulated for high-humidity environments.',
    'Run the exhaust fan for 30 minutes after painting to reduce moisture buildup.',
    'Consider a moisture-blocking primer, especially for bathrooms without ventilation fans.',
  ],
  faqs: [
    {
      question: 'How much paint do I need for a bathroom?',
      answer:
        'A standard 8x6 bathroom with 8-foot ceilings needs about 1 gallon of paint for two coats on the walls. Smaller powder rooms may need less. Always buy a little extra for touch-ups in high-moisture areas.',
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
  tips: [
    'Satin or semi-gloss finish is ideal for kitchens—both resist grease and are easy to clean.',
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
    'dining-room-paint-calculator',
    '12x12-room-paint-calculator',
    '10x12-room-paint-calculator',
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
    roomType: 'bedroom',
  },
  introText:
    'Living rooms are often the largest rooms in a home and usually have multiple windows and openings. Our estimates below account for a standard living room with two doorways, three windows, and one large picture window. Eggshell or satin finishes are popular choices for living room walls.',
  tips: [
    'Eggshell finish is the most popular choice for living rooms—it has a subtle sheen and hides minor imperfections.',
    'For large living rooms, buy all paint at once from the same batch for consistent color.',
    'Consider a 5-gallon bucket for rooms needing 4+ gallons—better value and color consistency.',
    'Test paint colors with large samples on multiple walls before committing—lighting varies throughout the day.',
  ],
  faqs: [
    {
      question: 'How much paint do I need for a living room?',
      answer:
        'A standard 16x14 living room with 8-foot ceilings needs about 3 gallons of paint for two coats, after deducting for doors and windows. Larger living rooms or those with vaulted ceilings will need more.',
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
    'dining-room-paint-calculator',
    '16x16-room-paint-calculator',
    '14x16-room-paint-calculator',
    '16x20-room-paint-calculator',
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
  },
  introText:
    'Garage walls benefit from durable, scuff-resistant paint that can handle everyday wear and tear. Our estimates below are for a standard two-car garage. Garages often have bare drywall or concrete block, so primer is strongly recommended for best coverage.',
  tips: [
    'Use a durable satin or semi-gloss finish for garage walls—flat paint scuffs too easily.',
    'Prime new drywall or bare concrete block before painting for proper adhesion and coverage.',
    'Light colors (white, light gray) brighten garages and make finding tools easier.',
    'Consider epoxy-based floor paint separately for the garage floor—regular wall paint will not hold up.',
  ],
  faqs: [
    {
      question: 'How much paint do I need for a 2-car garage?',
      answer:
        'A standard 20x20 two-car garage with 9-foot ceilings needs about 4-5 gallons for two coats on the walls. Add primer if the drywall is unpainted. Consider a 5-gallon bucket for the best value.',
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
    'Satin or semi-gloss finishes are ideal for hallways—they resist scuffs and clean easily.',
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
    'Eggshell finish is ideal for nurseries—it is easy to wipe clean and hides minor imperfections.',
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
    'Eggshell finish works well for home offices—professional look with easy cleaning.',
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
    'Satin finish is the top choice for dining rooms—it adds a subtle elegance and cleans easily.',
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
    'Basements present unique challenges: moisture, concrete block walls, and below-grade conditions all affect paint performance. Our estimates below include primer for proper sealing. Moisture-blocking primer is critical for basement painting success.',
  tips: [
    'Always address moisture issues before painting—check for leaks, condensation, and water stains.',
    'Use moisture-blocking primer on concrete block walls before applying topcoat paint.',
    'Mold-resistant paint formulas are recommended for basements, especially in humid climates.',
    'Allow extra drying time between coats in basements due to higher humidity levels.',
  ],
  faqs: [
    {
      question: 'How much paint do I need for a basement?',
      answer:
        'A standard 20x15 basement with 8-foot ceilings needs about 4-5 gallons for two coats, plus 3-4 gallons of primer. Concrete block walls absorb significantly more paint than drywall—add 30% extra for block walls.',
    },
    {
      question: 'Do I need special paint for basement walls?',
      answer:
        'Yes. Use moisture-resistant, mold-resistant paint for basements. For bare concrete or block walls, apply waterproofing primer first. Regular interior paint will peel and fail in damp basement conditions.',
    },
    {
      question: 'Can I paint basement walls without primer?',
      answer:
        'Primer is essential for basements. Bare concrete, block, and new drywall all require primer for proper adhesion and moisture blocking. Skipping primer in a basement almost always leads to peeling and paint failure.',
    },
  ],
  relatedPages: [
    'garage-paint-calculator',
    '20x20-room-paint-calculator',
    '16x20-room-paint-calculator',
    '15x15-room-paint-calculator',
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
      'Always buy slightly more paint than calculated—extra paint is useful for future touch-ups.',
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
];

export function getPageBySlug(slug: string): CalculatorPageData | undefined {
  return calculatorPages.find((p) => p.slug === slug);
}
