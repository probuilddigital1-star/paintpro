// The "hiring a painter" line shown directly above the painter quote card in calculator results.
// The wording lives here once so the homepage calculator, the room pages and the planner agree.
// Room pages render it at build time (StaticResults.astro). The homepage calculator and the
// planner fill in their own paragraph in the browser with showProCostNote().
import { formatProCostRange, type CalculationInputs, type ProCostRange } from './paint-calculator';

/** What the range covers: one room, a ceiling-only job, or the whole planner project. */
export type ProCostScope = 'room' | 'ceiling' | 'project';

const scopeWords: Record<ProCostScope, string> = {
  room: 'this room',
  ceiling: 'this ceiling',
  project: 'this project',
};

export const PRO_COST_ARTICLE_PATH = '/blog/how-much-does-it-cost-to-paint-a-room';
export const PRO_COST_LINK_CLASS = 'text-primary underline';

/** A calculator result is either a room job or, when only the ceiling is painted, a ceiling job. */
export function proCostScopeFor(surfaceType: CalculationInputs['surfaceType']): ProCostScope {
  return surfaceType === 'ceiling' ? 'ceiling' : 'room';
}

/** The line split in two: the sentences before the link, and the link itself. */
export function proCostNoteParts(range: ProCostRange, scope: ProCostScope = 'room') {
  return {
    text: `Hiring a painter for ${scopeWords[scope]} usually runs ${formatProCostRange(range)}, paint included. Prices vary with where you live and the condition of the walls. `,
    linkText: 'See how painters price a room.',
    href: PRO_COST_ARTICLE_PATH,
    linkClass: PRO_COST_LINK_CLASS,
  };
}

/**
 * Fills in the note paragraph and shows it, or empties and hides it when there is no range
 * (trim only, or nothing left to paint). Does nothing when the paragraph is not on the page,
 * as on the embed widget, which has no painter quote card.
 */
export function showProCostNote(note: HTMLElement | null, range: ProCostRange | null, scope: ProCostScope = 'room'): void {
  if (!note) return;

  if (!range) {
    note.replaceChildren();
    note.classList.add('hidden');
    return;
  }

  const { text, linkText, href, linkClass } = proCostNoteParts(range, scope);
  const link = document.createElement('a');
  link.href = href;
  link.className = linkClass;
  link.textContent = linkText;
  note.replaceChildren(text, link);
  note.classList.remove('hidden');
}
