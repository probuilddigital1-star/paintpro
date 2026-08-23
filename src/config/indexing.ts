import { blogPosts } from '../data/blog-posts';
import { calculatorPages } from '../data/calculator-pages';

/**
 * Everything ships indexable.
 *
 * These lists were an allowlist during the AdSense reviews, when the goal was to
 * show a small reviewed subset. That left 40% of search impressions on pages
 * serving `noindex` (the Behr coverage page alone drew 11,108 impressions at
 * position 8 while telling Google not to index it), kept 19 blog posts off the
 * blog index, and excluded them from internal linking.
 *
 * AdSense is no longer being pursued, so the restriction only cost traffic.
 * To pull a specific page from Google, add its slug to the matching exclude set
 * below. Deriving the lists from the page data means they cannot go stale when
 * new pages are added.
 */
const excludedCalculatorSlugs = new Set<string>([]);
const excludedBlogSlugs = new Set<string>([]);

export const indexableCalculatorSlugs = new Set(
  calculatorPages.map((page) => page.slug).filter((slug) => !excludedCalculatorSlugs.has(slug)),
);

export const indexableBlogSlugs = new Set(
  blogPosts.map((post) => post.slug).filter((slug) => !excludedBlogSlugs.has(slug)),
);
