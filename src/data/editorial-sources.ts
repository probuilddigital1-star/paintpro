export interface EditorialSource {
  title: string;
  publisher: string;
  url: string;
  note: string;
}

export const editorialSources: Record<string, EditorialSource[]> = {
  'how-much-does-it-cost-to-paint-a-room': [
    {
      title: 'Painters, Construction and Maintenance',
      publisher: 'U.S. Bureau of Labor Statistics',
      url: 'https://www.bls.gov/ooh/construction-and-extraction/painters-construction-and-maintenance.htm',
      note: 'National wage and work data used as a reality check for labor-cost assumptions.',
    },
    {
      title: 'How to Paint a Room in 7 Steps',
      publisher: 'Benjamin Moore',
      url: 'https://www.benjaminmoore.com/en-us/interior-exterior-paints-stains/how-to-advice/interiors/paint-rooms',
      note: 'Manufacturer guidance for the work and preparation included in a room-painting project.',
    },
  ],
  'how-many-coats-of-paint': [
    {
      title: 'How to Paint a Room in 7 Steps',
      publisher: 'Benjamin Moore',
      url: 'https://www.benjaminmoore.com/en-us/interior-exterior-paints-stains/how-to-advice/interiors/paint-rooms',
      note: 'Manufacturer recommendation on topcoat count, drying, and application sequence.',
    },
    {
      title: '11 Painting Mistakes to Avoid',
      publisher: 'Benjamin Moore',
      url: 'https://www.benjaminmoore.com/en-us/interior-exterior-paints-stains/how-to-advice/painting-101/avoid-11-painting-mistakes',
      note: 'Manufacturer guidance on priming, coat coverage, and recoat timing.',
    },
  ],
  'complete-room-painting-checklist': [
    {
      title: 'How to Paint a Room in 7 Steps',
      publisher: 'Benjamin Moore',
      url: 'https://www.benjaminmoore.com/en-us/interior-exterior-paints-stains/how-to-advice/interiors/paint-rooms',
      note: 'A manufacturer workflow used to cross-check the order of preparation and painting.',
    },
    {
      title: 'Lead-Safe Renovations for DIYers',
      publisher: 'U.S. Environmental Protection Agency',
      url: 'https://www.epa.gov/lead/lead-safe-renovations-diyers',
      note: 'Safety guidance for work that may disturb paint in a pre-1978 home.',
    },
  ],
  'when-to-hire-a-painter-vs-diy': [
    {
      title: 'Painters, Construction and Maintenance',
      publisher: 'U.S. Bureau of Labor Statistics',
      url: 'https://www.bls.gov/ooh/construction-and-extraction/painters-construction-and-maintenance.htm',
      note: 'National information about painter work, physical demands, and compensation.',
    },
    {
      title: 'Lead-Safe Renovations for DIYers',
      publisher: 'U.S. Environmental Protection Agency',
      url: 'https://www.epa.gov/lead/lead-safe-renovations-diyers',
      note: 'EPA guidance on when lead-safe expertise matters in older homes.',
    },
  ],
  'how-to-paint-a-ceiling-without-streaks': [
    {
      title: 'How to Paint a Room in 7 Steps',
      publisher: 'Benjamin Moore',
      url: 'https://www.benjaminmoore.com/en-us/interior-exterior-paints-stains/how-to-advice/interiors/paint-rooms',
      note: 'Manufacturer guidance on painting order, application, and drying between coats.',
    },
    {
      title: '11 Painting Mistakes to Avoid',
      publisher: 'Benjamin Moore',
      url: 'https://www.benjaminmoore.com/en-us/interior-exterior-paints-stains/how-to-advice/painting-101/avoid-11-painting-mistakes',
      note: 'A cross-check for roller loading, coverage, primer, and recoat advice.',
    },
  ],
  'eggshell-vs-satin-vs-semi-gloss': [
    {
      title: 'How to Choose a Paint Finish',
      publisher: 'Sherwin-Williams',
      url: 'https://www.sherwin-williams.com/en-us/project-center/paint-sheen-guide',
      note: 'Manufacturer definitions and practical selection guidance for common sheens.',
    },
    {
      title: 'Choosing an Interior Paint Finish',
      publisher: 'Benjamin Moore',
      url: 'https://www.benjaminmoore.com/en-us/interior-exterior-paints-stains/how-to-advice/painting-101/choosing-paint-finish',
      note: 'A second manufacturer reference for appearance, cleanup, and application tradeoffs.',
    },
  ],
  'how-to-paint-trim-and-baseboards': [
    {
      title: 'How to Paint Trim',
      publisher: 'Benjamin Moore',
      url: 'https://www.benjaminmoore.com/en-us/interior-exterior-paints-stains/how-to-advice/painting-101/paint-trim',
      note: 'Manufacturer instructions for preparation, tools, primer, and trim coatings.',
    },
    {
      title: 'Lead-Safe Renovations for DIYers',
      publisher: 'U.S. Environmental Protection Agency',
      url: 'https://www.epa.gov/lead/lead-safe-renovations-diyers',
      note: 'Safety guidance before sanding or scraping painted trim in older homes.',
    },
  ],
  'how-to-prep-walls-before-painting': [
    {
      title: 'How to Prepare Walls for Painting',
      publisher: 'Benjamin Moore',
      url: 'https://www.benjaminmoore.com/en-us/interior-exterior-paints-stains/how-to-advice/painting-101/preparing-walls-painting',
      note: 'Manufacturer preparation guidance for cleaning, repairs, sanding, and primer.',
    },
    {
      title: 'Lead-Safe Renovations for DIYers',
      publisher: 'U.S. Environmental Protection Agency',
      url: 'https://www.epa.gov/lead/lead-safe-renovations-diyers',
      note: 'Safety practices for disturbing painted surfaces in a pre-1978 home.',
    },
  ],
  'how-to-touch-up-paint': [
    {
      title: '11 Painting Mistakes to Avoid',
      publisher: 'Benjamin Moore',
      url: 'https://www.benjaminmoore.com/en-us/interior-exterior-paints-stains/how-to-advice/painting-101/avoid-11-painting-mistakes',
      note: 'Manufacturer advice for labeling leftover paint by brand, color, product, and sheen.',
    },
    {
      title: 'How to Clean Freshly Painted Walls and Cabinets',
      publisher: 'Benjamin Moore',
      url: 'https://www.benjaminmoore.com/en-us/interior-exterior-paints-stains/how-to-advice/interiors/how-to-clean-freshly-painted-walls-and-cabinets',
      note: 'Manufacturer guidance on cure time and testing before cleaning a painted surface.',
    },
  ],
  'how-long-does-paint-take-to-dry': [
    {
      title: 'How to Make Paint Dry Faster',
      publisher: 'Sherwin-Williams',
      url: 'https://www.sherwin-williams.com/en-us/project-center/paint/how-to-make-paint-dry-faster',
      note: 'Manufacturer reference for dry versus cure time and typical timing by coating type.',
    },
    {
      title: 'How to Make Paint Dry Faster',
      publisher: 'Benjamin Moore',
      url: 'https://www.benjaminmoore.com/en-us/interior-exterior-paints-stains/how-to-advice/painting-101/make-paint-dry-faster',
      note: 'Manufacturer guidance on airflow, coat thickness, recoat timing, and label instructions.',
    },
  ],
  'how-to-fix-peeling-paint': [
    {
      title: 'How to Repair Peeling Paint',
      publisher: 'Behr',
      url: 'https://www.behr.com/consumer/how-to/interior/how-to-repair-peeling-paint',
      note: 'Manufacturer repair sequence for removing failed paint and preparing the surface.',
    },
    {
      title: 'Lead-Safe Renovations for DIYers',
      publisher: 'U.S. Environmental Protection Agency',
      url: 'https://www.epa.gov/lead/lead-safe-renovations-diyers',
      note: 'Safety guidance before scraping or sanding painted surfaces in older homes.',
    },
  ],
};
