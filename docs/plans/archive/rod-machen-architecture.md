> Superseded by edition-rebuild-and-rodmachen-home.md

# Rod Machen Site Ecosystem — Architecture Plan

## Context

Rod's personal web presence is currently split across edition.rodmachen.com (all writing) and a photo portfolio in progress. The goal is to reorganize into a multi-site ecosystem with clear separation of concerns: a personal homepage, a writing hub with styled sections, a dedicated tech/code blog, and a photo portfolio — all using Astro, Vercel, and Cloudinary.

---

## Final Architecture

### Sites & Repos

| Domain | Repo | Purpose |
|---|---|---|
| **rodmachen.com** | `rodmachen-com` (new) | Personal homepage/hub — links to all subdomains, about, contact, recent bylines via JSON feed |
| **edition.rodmachen.com** | `edition-rodmachen-com` (existing) | Writing hub — Newsletter, Articles, Reviews, Bylines, Archive |
| **code.rodmachen.com** | `code-rodmachen-com` (new) | Tech/code writing (shared on LinkedIn) |
| **photo.rodmachen.com** | `photo-portfolio` (existing) | Photo portfolio with unlisted album support |

### Key Decisions

- **No shared CSS package** — each site has its own styling
- **Reviews + Articles stay on edition** at `/reviews/` and `/articles/` with per-section accent colors and layout variations
- **Bylines stay on edition** — rodmachen.com gets recent bylines via a JSON feed generated at edition build time
- **Separate repos, one Vercel project per domain** — clean 1:1 mapping
- **Google Analytics** across all sites
- **SEO for "The Hangman Chronicles"** handled via page titles, H1, meta description on `/newsletter/` — no subdomain needed

---

## Site Details

### 1. rodmachen.com (Personal Homepage)

**Repo:** `rodmachen-com` (new, minimal Astro static site)

**Pages:**
- `/` — Hero section + grid cards linking to edition, code, photo subdomains + recent bylines section (5-10 most recent, with publication icons)
- `/about/` — Canonical about page
- `/contact/` — Canonical contact page

**Data:**
- Fetches `bylines-feed.json` from edition.rodmachen.com at build time
- Vercel deploy hook triggers homepage rebuild when edition deploys (so bylines stay current)

**Design:** Simple, clean personal landing page. Distinct from the writing sites.

---

### 2. edition.rodmachen.com (Writing Hub)

**Repo:** `edition-rodmachen-com` (existing, evolved)

**Section Structure — each section gets its own "sub-homepage":**

| Section | Path | Accent Color | Content |
|---|---|---|---|
| Newsletter | `/newsletter/` | #117a65 (teal) | "The Hangman Chronicles" — 13 posts |
| Articles | `/articles/` | #1a5276 (dark blue) | Long-form writing — 12 posts |
| Reviews | `/reviews/` | #b9770e (golden) | Arts and food reviews — 7 posts |
| Bylines | `/bylines/` | #2e4057 (blue-gray) | External publications — 354 links |

**The Big 3 — Section sub-homepages:** Newsletter, Articles, and Reviews are the primary sections. Each gets its own index page that feels like a mini-site:
- Distinct typography (font family/weight/size) per section
- Section-specific accent color and header styling
- Full listing of posts in that section
- Section-specific card/list layout if desired

**Bylines — visually distinct:** Bylines (`/bylines/`) can share the same page layout/components, but on the edition homepage they are treated separately from the Big 3 — e.g., the Big 3 get prominent grid cards with recent posts, while bylines appear in a smaller, secondary area below (recent bylines list, publication icons, link to full page).

**Typography per section:** Each of the Big 3 gets its own typographic identity:

| Section | Typography direction |
|---|---|
| Newsletter | TBD — could be more personal/casual (e.g., a humanist sans-serif or warm serif) |
| Articles | TBD — classic editorial feel (e.g., a traditional serif like the current Georgia) |
| Reviews | TBD — could match Articles or go slightly different (e.g., a transitional serif or slab) |

The edition homepage can share typography with Articles/Reviews or have its own neutral base. Specific font choices will be decided during implementation. The `CATEGORY_CONFIG` will be extended with a `fontFamily` (or `typographyPreset`) property so each section's layout can apply its fonts.

**Main homepage (`/`):**
- **Top area:** Big 3 grid — prominent cards for Newsletter, Articles, Reviews with recent posts from each
- **Lower area:** Bylines — visually differentiated, showing recent bylines with publication icons and a "View all" link to `/bylines/`

**Shared pages:**
- `/archive/` — Paginated archive of all content
- `/topics/` and `/topics/[tag]/` — Tag system across all sections
- RSS feed

**Build artifact:** Generates `/bylines-feed.json` (public static file) containing recent bylines data for rodmachen.com to consume.

**Changes from current site:**
- "Essays" category removed; essay content migrated to code.rodmachen.com
- Section sub-homepages built with per-section typography and styling
- Homepage redesigned: Big 3 prominent, bylines secondary
- About/Contact pages redirect to rodmachen.com (or are removed, with links in footer)
- URL structure change: currently `/article/[slug]/`, will be `/articles/[slug]/` (plural) — redirects needed

**Styling approach:** Extend `CATEGORY_CONFIG` in `src/utils/posts.ts` with typography and layout properties per section. Each section's sub-homepage and post pages apply their own fonts and accent colors. The base layout provides structure; sections override typography via CSS custom properties set at the section level.

---

### 3. code.rodmachen.com (Tech Blog)

**Repo:** `code-rodmachen-com` (new Astro static site)

**Implementation approach:** Start with an MVP focused on styling/design, then build out the Astro blog in a second pass. A bootstrapping brief (below) should be placed in the repo as `docs/project-brief.md` so a Claude session in that repo has full context.

**Pages (target):**
- `/` — Post listing (simple, clean design for tech content)
- `/[slug]/` — Individual posts
- `/topics/` — Tag system
- RSS feed

**Content:** Single collection (posts). Category is implicitly "code/tech" — no multi-category routing needed.

**Design:** Its own distinct styling suited to tech/code content. Code syntax highlighting, monospace elements, etc.

**Note:** This is the simplest of all the sites. Starts empty, grows as Rod writes tech content.

#### Bootstrapping Brief for code.rodmachen.com

Copy the following into `docs/project-brief.md` in the `code-rodmachen-com` repo to give a fresh Claude session full context:

---

**Project:** code.rodmachen.com — a tech/code blog for Rod Machen

**Part of a larger ecosystem:**
- `rodmachen.com` — personal homepage/hub
- `edition.rodmachen.com` — writing hub (newsletter, articles, reviews, bylines)
- `code.rodmachen.com` — this site (tech/code writing, shared on LinkedIn)
- `photo.rodmachen.com` — photo portfolio

**Tech stack (must match sibling sites):**
- Astro 5.x (static output)
- Vercel deployment (`@astrojs/vercel` adapter)
- Cloudinary for images (`astro-cloudinary`, cloud name: `dke4phurv`)
- TypeScript
- Markdown content with frontmatter

**Reference implementation:** The edition site at `/Users/rodmachen/code/edition-rodmachen-com` is the most mature sibling. Key patterns to reference (but not copy wholesale — this site has its own identity):
- `astro.config.mjs` — Vercel adapter, static output, trailing slashes, remark plugin for Cloudinary images
- `src/content.config.ts` — content collection schema using `glob` loader and Zod
- `src/plugins/remark-cloudinary-images.ts` — transforms markdown images to responsive Cloudinary URLs with srcset
- `src/layouts/BaseLayout.astro` — HTML head with OG/Twitter meta tags
- `src/layouts/PostLayout.astro` — post page layout with accent colors via CSS `define:vars`
- `src/pages/rss.xml.ts` — RSS feed generation with `@astrojs/rss`

**Content schema for this site (simplified from edition):**
```
posts collection:
  title: string (required)
  subTitle: string (optional)
  tags: string[] (optional, normalize from string or array)
  date: Date (required, coerced)
  published: boolean (optional)
  thumbnail: string (optional, Cloudinary public ID)
  slug: string (optional override; default derived from filename minus date prefix)
```

No `category` or `template` field needed — all posts are implicitly "code/tech".

**URL structure:**
- `/` — homepage with post listing
- `/[slug]/` — individual posts (trailing slash)
- `/topics/` — tag cloud
- `/topics/[tag]/` — posts filtered by tag
- `/rss.xml` — RSS feed

**Design direction:**
- Tech/code focused — should feel distinct from the more editorial edition site
- Good code block styling with syntax highlighting (consider Astro's built-in Shiki support)
- Monospace accents where appropriate
- Clean, readable long-form layout for technical articles
- Dark mode support would be a natural fit (but not required for MVP)
- Mobile responsive

**MVP Phase 1 — Styling only:**
- Set up Astro project with Vercel adapter
- Create BaseLayout with HTML head, header, footer
- Create PostLayout with post content styling
- Design the homepage layout (post list)
- Style code blocks, headings, body text, links
- Use 1-2 placeholder/sample posts to develop against
- No content migration yet, no topics page, no RSS — just the visual foundation
- Deploy to Vercel to verify

**Phase 2 — Full blog buildout:**
- Content collection with schema
- Dynamic routes for posts and topics
- RSS feed
- Cloudinary image integration (remark plugin)
- SEO: sitemap, robots.txt, OG tags
- Google Analytics
- Cross-site footer links (to rodmachen.com, edition, photo)

**Cross-site navigation:**
- Footer should link to rodmachen.com and sibling subdomains
- Header has a small "Rod Machen" link back to rodmachen.com

**Deployment:**
- Vercel project: `code-rodmachen-com`
- Domain: `code.rodmachen.com` (CNAME to `cname.vercel-dns.com`)
- `site` in astro.config.mjs: `https://code.rodmachen.com`
- Static output, trailing slashes

---

---

### 4. photo.rodmachen.com (Photo Portfolio)

**Repo:** `photo-portfolio` (existing)

**New feature — Unlisted Albums:**
- Add `listed: boolean` field (default: `true`) to album YAML schema in `content.config.ts`
- Albums index page filters to `listed !== false`
- Unlisted album pages still generated (accessible by direct URL)
- Add `<meta name="robots" content="noindex, nofollow">` for unlisted albums
- Exclude unlisted albums from sitemap
- No authentication — privacy through obscurity (unlinkable URLs)

**Domain:** Configure Vercel custom domain to `photo.rodmachen.com`

---

## DNS Configuration

All at your domain registrar:

```
rodmachen.com          A      76.76.21.21
www.rodmachen.com      CNAME  cname.vercel-dns.com
edition.rodmachen.com  CNAME  cname.vercel-dns.com
code.rodmachen.com     CNAME  cname.vercel-dns.com
photo.rodmachen.com    CNAME  cname.vercel-dns.com
```

Each Vercel project configured with its respective domain. Vercel handles TLS.

---

## Cross-Site Navigation

- Every site's footer links back to rodmachen.com and lists all subdomains
- rodmachen.com header/grid prominently links to all subdomains
- This cross-linking helps SEO (link equity flows from hub to subdomains)

---

## Analytics & SEO

**Analytics:** Google Analytics across all sites. Same GA property, configured per-site.

**SEO per site:**
- Each site gets `@astrojs/sitemap` integration
- Each site has its own `robots.txt`
- RSS feeds on all writing sites (edition, code)
- Open Graph meta tags on all pages (already in BaseLayout pattern)
- `<title>` and `<meta description>` optimized per section
- Newsletter page: `<title>The Hangman Chronicles | Newsletter | Edition</title>` + H1 "The Hangman Chronicles" for search discoverability

---

## Migration Plan (High-Level Phases)

These phases will each get their own detailed implementation plan in their respective repos.

### Phase 1: Enhance edition.rodmachen.com
- Rename "Essays" to "Technology" conceptually; migrate any essay content to code site later
- Build section sub-homepages with per-section styling at `/newsletter/`, `/articles/`, `/reviews/`
- Ensure URL redirects from old paths (e.g., `/article/` -> `/articles/` if pluralizing)
- Generate `bylines-feed.json` at build time
- Add Google Analytics
- Add cross-site footer links

### Phase 2: Build rodmachen.com
- New Astro project in `rodmachen-com` repo
- Landing page with grid cards for each subdomain
- Bylines section consuming edition's JSON feed
- About and contact pages
- Deploy to Vercel, configure domain
- Set up deploy hook triggered by edition builds

### Phase 3: Build code.rodmachen.com
- Copy `docs/project-brief.md` from the bootstrapping brief above into the repo
- **Phase 3a (MVP):** Astro project setup + styling foundation — layouts, typography, code block styling, placeholder posts. Deploy to Vercel.
- **Phase 3b (Full buildout):** Content collection, dynamic routes, topics, RSS, Cloudinary, analytics, cross-site links. Planned separately in that repo.

### Phase 4: Enhance photo.rodmachen.com
- Add `listed` field to album schema
- Add noindex meta for unlisted albums
- Configure photo.rodmachen.com domain on Vercel
- Add cross-site navigation

### Phase 5: Cross-linking & cleanup
- Verify all cross-site links work
- Submit sitemaps to Google Search Console
- Test RSS feeds
- Remove/redirect about and contact from edition to rodmachen.com
- Verify analytics tracking across all sites

---

## What This Plan Does NOT Cover

Each site's detailed implementation (components, page layouts, specific styling) will be planned separately in its respective repo. This plan establishes the overall architecture, site boundaries, data flow, and migration sequence.