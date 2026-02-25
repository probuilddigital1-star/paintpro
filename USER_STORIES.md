# PaintPro Calculator — User Stories

> Generated from 30-day analytics review (60 page views, 60 visits, 704ms load time)
> Date: 2026-02-25

---

## Epic 1: Programmatic SEO Pages

### US-1.1: Room-Type Calculator Pages
**As a** homeowner searching "how much paint for a bedroom"
**I want** a dedicated calculator page pre-configured for that room type
**So that** I get an instant, relevant answer without manual setup

**Acceptance Criteria:**
- Dynamic Astro route: `/paint-calculator/[room-type]`
- Pre-filled dimensions for common room types (bedroom, bathroom, kitchen, living room, garage, hallway, nursery, office, dining room, basement)
- Unique H1, meta title, meta description per room type
- JSON-LD schema (WebApplication + FAQPage) per page
- Calculator still fully interactive (user can adjust pre-filled values)
- Internal links to related room-type pages
- Canonical URL set to custom domain

**Story Points:** 8
**Priority:** P0 — Critical

---

### US-1.2: Room-Size Calculator Pages
**As a** homeowner searching "how much paint for a 12x12 room"
**I want** a page with the calculation already done for that exact room size
**So that** I get an instant answer and can adjust from there

**Acceptance Criteria:**
- Dynamic Astro route: `/paint-calculator/[length]x[width]-room`
- Common sizes: 8x8, 8x10, 10x10, 10x12, 12x12, 12x14, 14x14, 14x16, 15x15, 16x16, 16x20, 20x20
- Pre-calculated results displayed immediately (gallons needed, cost estimate)
- Unique SEO content per size with real-world context ("A 12x12 room is a typical bedroom...")
- Structured data with calculated values
- Cross-links to adjacent sizes and matching room types

**Story Points:** 8
**Priority:** P0 — Critical

---

### US-1.3: Paint Brand Coverage Pages
**As a** homeowner searching "Behr paint coverage per gallon"
**I want** a page showing that brand's coverage rate with my calculator
**So that** I can estimate paint needs for a specific brand

**Acceptance Criteria:**
- Dynamic route: `/paint-calculator/[brand]-coverage`
- Brands: Behr, Sherwin-Williams, Benjamin Moore, Valspar, PPG, Glidden, Rust-Oleum, Farrow & Ball
- Accurate coverage rates per brand (sq ft/gallon)
- Calculator pre-set with brand's coverage rate
- Affiliate links to that brand's products on Amazon
- Brand comparison table linking to other brand pages
- Disclaimer: not affiliated with/endorsed by brand

**Story Points:** 5
**Priority:** P1 — High

---

### US-1.4: Color-Change Scenario Pages
**As a** homeowner searching "painting white over dark walls"
**I want** guidance on coats needed and a pre-configured calculator
**So that** I know the real amount of paint for my color change

**Acceptance Criteria:**
- Route: `/paint-calculator/[from-color]-to-[to-color]`
- Scenarios: dark-to-light, light-to-dark, similar-colors, red-to-white, white-to-dark
- Pre-set coat count and primer recommendation
- Content explaining why more coats are needed
- Primer affiliate links contextually placed
- Links to related scenarios

**Story Points:** 5
**Priority:** P1 — High

---

### US-1.5: Programmatic Page Data System
**As a** developer
**I want** a centralized data file driving all programmatic pages
**So that** I can add new page variants without writing new templates

**Acceptance Criteria:**
- Single JSON/TS data file with all room types, sizes, brands, and scenarios
- Astro `getStaticPaths()` reads data file to generate all routes
- Shared page template with conditional sections based on page type
- Auto-generates sitemap entries for all programmatic pages
- Build-time validation (no duplicate slugs, required fields present)

**Story Points:** 5
**Priority:** P0 — Critical (blocks US-1.1 through US-1.4)

---

## Epic 2: Blog & Content Hub

### US-2.1: Blog Infrastructure
**As a** site owner
**I want** a `/blog` section with proper routing, layout, and index page
**So that** I can publish SEO-targeted articles that drive organic traffic

**Acceptance Criteria:**
- Blog index page at `/blog` with paginated post list
- Individual post route: `/blog/[slug]`
- Blog layout with: reading time, publish date, author, table of contents
- Article JSON-LD schema on each post
- BreadcrumbList schema (Home > Blog > Post Title)
- Category/tag system for internal linking
- Social sharing meta tags (OG image per post)
- "Related posts" section at bottom of each article
- Blog link added to main navigation header

**Story Points:** 8
**Priority:** P1 — High

---

### US-2.2: Cornerstone Content Articles
**As a** homeowner researching painting projects
**I want** comprehensive guides answering my top questions
**So that** I trust this site and use the calculator

**Acceptance Criteria:**
- Minimum 6 launch articles:
  1. "How Much Does It Cost to Paint a Room in 2026?"
  2. "Best Paint for Bathrooms: Humidity & Mildew Resistant Options"
  3. "How Many Coats of Paint Do You Really Need?"
  4. "Sherwin-Williams vs Behr vs Benjamin Moore: Full Comparison"
  5. "Complete Room Painting Checklist (Step by Step)"
  6. "When to Hire a Painter vs DIY: Cost Breakdown"
- Each article: 1,500+ words, 3+ internal links to calculator/tools
- Contextual affiliate product recommendations within articles
- FAQ schema at bottom of each article
- HowTo schema where applicable

**Story Points:** 13
**Priority:** P1 — High

---

### US-2.3: Content-to-Calculator Cross-Linking
**As a** blog reader
**I want** inline calculator widgets or prominent CTAs within articles
**So that** I can immediately use the tool without navigating away

**Acceptance Criteria:**
- Reusable "Try the Calculator" CTA component for blog posts
- Mini calculator embed option (simplified version) for inline use
- Contextual CTA text (e.g., in a bathroom article: "Calculate paint for your bathroom")
- Links use descriptive anchor text for SEO value
- Track CTA clicks in GA4 events

**Story Points:** 5
**Priority:** P2 — Medium

---

## Epic 3: Core Web Vitals & Performance

### US-3.1: Fix INP (Interaction to Next Paint)
**As a** user interacting with the calculator
**I want** instant visual feedback when I change inputs
**So that** the site feels fast and responsive

**Acceptance Criteria:**
- INP score moves from orange to green (< 200ms)
- Debounce input handlers (150ms delay before recalculation)
- Use `requestIdleCallback` for non-critical DOM updates
- Offload calculation logic from main thread where possible
- Reduce layout recalculations during input changes
- Verify with Lighthouse and Web Vitals real-user monitoring
- Test on low-end mobile device (Moto G Power or equivalent)

**Story Points:** 5
**Priority:** P0 — Critical (ranking factor)

---

### US-3.2: Image & Asset Optimization
**As a** visitor on a slow connection
**I want** the page to load as fast as possible
**So that** I don't bounce before the calculator loads

**Acceptance Criteria:**
- Add `loading="lazy"` to below-fold images
- Convert OG image to WebP with PNG fallback
- Preload critical above-fold assets
- Add `fetchpriority="high"` to LCP element
- Verify no render-blocking resources in critical path
- Target: LCP < 1.5s on 3G throttled connection

**Story Points:** 3
**Priority:** P2 — Medium

---

## Epic 4: Domain & Indexing

### US-4.1: Pages.dev to Custom Domain Redirect
**As a** site owner
**I want** `paintpro-9rn.pages.dev` to 301 redirect to `paintprocalculator.com`
**So that** Google doesn't index duplicate content and all link equity flows to one domain

**Acceptance Criteria:**
- All pages.dev URLs return 301 to equivalent paintprocalculator.com URL
- Configured in Cloudflare Pages settings (not application-level)
- Verified: `curl -I paintpro-9rn.pages.dev` returns 301
- Google Search Console only shows custom domain pages indexed
- Remove pages.dev from any analytics filters

**Story Points:** 2
**Priority:** P0 — Critical

---

### US-4.2: Google Search Console Optimization
**As a** site owner
**I want** to submit all new programmatic pages to GSC for fast indexing
**So that** Google discovers and ranks my new pages quickly

**Acceptance Criteria:**
- Submit updated sitemap after programmatic pages launch
- Use URL Inspection tool to request indexing for top 20 pages
- Monitor Coverage report for crawl errors
- Set up GSC alerts for indexing issues
- Verify mobile usability report shows no errors
- Check "Links" report monthly for backlink growth

**Story Points:** 2
**Priority:** P1 — High (manual task, post-launch)

---

## Epic 5: Monetization Expansion

### US-5.1: Google AdSense Integration
**As a** site owner
**I want** display ads on the site (respecting cookie consent)
**So that** I earn revenue from page views, not just affiliate clicks

**Acceptance Criteria:**
- AdSense script loads only after cookie consent is accepted
- Ad placements: 1 above fold (leaderboard), 1 mid-content, 1 in sidebar/below calculator
- No ads inside the calculator itself (UX priority)
- Ads are responsive (mobile-friendly sizes)
- Lazy-load ad units below fold
- Does not negatively impact CLS score (reserved ad slot dimensions)
- Compliant with AdSense policies (sufficient content per page)

**Story Points:** 5
**Priority:** P1 — High

---

### US-5.2: Contextual Affiliate Products Per Page
**As a** user on a brand-specific or room-specific page
**I want** product recommendations relevant to my exact scenario
**So that** I can buy exactly what I need

**Acceptance Criteria:**
- Affiliate cards dynamically populated based on page context
- Room-type pages: show paint + supplies for that room (e.g., bathroom = mildew-resistant paint)
- Brand pages: show that brand's top products
- Size pages: show correct quantity of paint (1-gal vs 5-gal based on calculation)
- Each programmatic page has 3-6 contextual affiliate links
- Affiliate disclosure clearly visible on all pages with product links

**Story Points:** 5
**Priority:** P1 — High

---

### US-5.3: Email Lead Nurture Sequence
**As a** site owner with email signups
**I want** an automated email sequence that drives users back to the site
**So that** I increase return visits, affiliate clicks, and eventual painter lead conversions

**Acceptance Criteria:**
- 5-email welcome sequence via n8n automation:
  1. Welcome + link to calculator (immediate)
  2. "5 Mistakes First-Time Painters Make" (day 2)
  3. "Best Paint Brands Ranked" with affiliate links (day 5)
  4. "Should You DIY or Hire a Pro?" (day 8)
  5. "Get Matched with Local Painters" — lead gen CTA (day 14)
- Unsubscribe link in every email
- Track open rates and click-through rates
- CAN-SPAM / GDPR compliant

**Story Points:** 8
**Priority:** P2 — Medium

---

### US-5.4: Painter Lead Generation System
**As a** homeowner who calculated their paint needs
**I want** to get quotes from local painters
**So that** I can compare DIY cost vs hiring a professional

**Acceptance Criteria:**
- "Get Free Quotes" CTA appears after calculator results
- Form collects: name, email, zip code, project type, estimated room count
- Leads routed to local painters via n8n automation
- Revenue model: charge painters per qualified lead ($15-50)
- Dashboard to track lead volume and conversion
- Only available in serviced zip codes (start with Ohio)

**Story Points:** 13
**Priority:** P3 — Future (requires painter network)

---

## Epic 6: Backlink & Distribution Strategy

### US-6.1: Embeddable Calculator Widget
**As a** home improvement blogger
**I want** to embed PaintPro's calculator on my site
**So that** my readers get a useful tool (and PaintPro gets a backlink)

**Acceptance Criteria:**
- Lightweight iframe-based embed (`<iframe src="paintprocalculator.com/embed">`)
- `/embed` route: calculator only, no header/footer/ads, minimal styling
- "Powered by PaintPro Calculator" link at bottom (dofollow backlink)
- Embed code snippet generator on the site ("Add to Your Site" page)
- Responsive: works in any container width
- Does not load ads or trackers in embed mode

**Story Points:** 8
**Priority:** P1 — High

---

### US-6.2: Tool Directory Submissions
**As a** site owner
**I want** PaintPro listed on tool directories and aggregator sites
**So that** I get backlinks and referral traffic

**Acceptance Criteria:**
- Submit to: Product Hunt, AlternativeTo, ToolFinder, SaaSHub
- Submit to home improvement directories
- Create compelling listing with screenshots and description
- Track referral traffic from each directory in GA4
- Respond to any reviews or comments

**Story Points:** 3
**Priority:** P1 — High (manual task)

---

### US-6.3: HARO / Journalist Outreach
**As a** site owner
**I want** to be quoted as a home improvement/paint expert in articles
**So that** I get high-authority backlinks from news sites

**Acceptance Criteria:**
- Sign up for Connectively (formerly HARO), Qwoted, SourceBottle
- Monitor daily for home improvement, painting, DIY queries
- Respond to 3-5 relevant queries per week
- Include PaintPro Calculator link in expert bio
- Track acquired backlinks and domain authority growth

**Story Points:** 2
**Priority:** P2 — Medium (ongoing manual effort)

---

## Epic 7: Analytics & Tracking

### US-7.1: Enhanced Event Tracking
**As a** site owner
**I want** granular GA4 event tracking across all user actions
**So that** I understand which pages and features drive conversions

**Acceptance Criteria:**
- Track events:
  - `calculator_used` (with room type, dimensions, result)
  - `affiliate_link_clicked` (with product, page source)
  - `email_signup_completed` (with source page)
  - `blog_article_read` (with scroll depth, time on page)
  - `embed_code_copied`
  - `cta_clicked` (with CTA type and location)
- Custom dimensions: page_type (calculator, blog, programmatic)
- Conversion goals: affiliate click, email signup, lead form submission
- Monthly reporting dashboard

**Story Points:** 5
**Priority:** P1 — High

---

## Summary & Prioritization

### P0 — Critical (Do First)
| Story | Points | Impact |
|-------|--------|--------|
| US-1.5 | 5 | Programmatic page data system (blocks all P-SEO) |
| US-1.1 | 8 | Room-type pages |
| US-1.2 | 8 | Room-size pages |
| US-3.1 | 5 | Fix INP score |
| US-4.1 | 2 | Pages.dev redirect |
| **Total** | **28** | |

### P1 — High (Do Next)
| Story | Points | Impact |
|-------|--------|--------|
| US-1.3 | 5 | Brand coverage pages |
| US-1.4 | 5 | Color-change pages |
| US-2.1 | 8 | Blog infrastructure |
| US-2.2 | 13 | Cornerstone articles |
| US-4.2 | 2 | GSC optimization |
| US-5.1 | 5 | AdSense integration |
| US-5.2 | 5 | Contextual affiliate products |
| US-6.1 | 8 | Embeddable widget |
| US-6.2 | 3 | Directory submissions |
| US-7.1 | 5 | Enhanced event tracking |
| **Total** | **59** | |

### P2 — Medium
| Story | Points | Impact |
|-------|--------|--------|
| US-2.3 | 5 | Content-to-calculator CTAs |
| US-3.2 | 3 | Asset optimization |
| US-5.3 | 8 | Email nurture sequence |
| US-6.3 | 2 | HARO outreach |
| **Total** | **18** | |

### P3 — Future
| Story | Points | Impact |
|-------|--------|--------|
| US-5.4 | 13 | Painter lead gen system |
| **Total** | **13** | |

### Grand Total: 118 story points across 20 user stories
