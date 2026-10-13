import { describe, expect, it } from 'vitest';
import { PRO_COST_ARTICLE_PATH, proCostNoteParts, proCostScopeFor } from './pro-cost-note';

describe('proCostNoteParts', () => {
  const range = { low: 400, high: 1000 };

  it('reads as one short paragraph ending in the link', () => {
    const { text, linkText, href } = proCostNoteParts(range);

    expect(text + linkText).toBe(
      'Hiring a painter for this room usually runs $400 to $1,000, paint included. Prices vary with where you live and the condition of the walls. See how painters price a room.',
    );
    expect(href).toBe('/blog/how-much-does-it-cost-to-paint-a-room');
    expect(href).toBe(PRO_COST_ARTICLE_PATH);
  });

  it('says this ceiling for a ceiling-only job and this project for the planner', () => {
    expect(proCostNoteParts({ low: 250, high: 500 }, 'ceiling').text).toContain('for this ceiling usually runs $250 to $500,');
    expect(proCostNoteParts({ low: 1250, high: 3050 }, 'project').text).toContain('for this project usually runs $1,250 to $3,050,');
  });

  it('picks the ceiling wording only when just the ceiling is painted', () => {
    expect(proCostScopeFor('ceiling')).toBe('ceiling');
    expect(proCostScopeFor('walls')).toBe('room');
    expect(proCostScopeFor('walls-ceiling')).toBe('room');
  });
});
