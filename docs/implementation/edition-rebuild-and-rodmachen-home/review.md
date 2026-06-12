# Review — PR #1 "Edition rebuild + rodmachen.com home page"

Reviewer: Opus / xhigh (Phase 4). Input: full `git diff master` (excluding package-lock.json and design mockups) + the orchestration context log. Raw findings: `results/review.json`.

**Overall:** Solid, well-executed rebuild. CI green, 34 tests passing, draft filtering applied at every collection call site, redirects and URL generation centralized, clean single-h1 heading structure everywhere, FOUC-free theme bootstrap with proper focus/skip/reduced-motion accessibility. **No blocking issues** — no build breakage, broken internal links, security exposure, or shipped drafts.

## Findings (all non-blocking)

| # | Location | Issue | Suggested fix |
|---|---|---|---|
| 1 | `vercel.json:23-42` | New section redirects lack the trailing-slash variants the existing `/categories` rules carry; with `trailingSlash: 'always'`, old canonical URLs like `/article/foo/` risk a redirect chain or 404 — the exact SEO-critical URLs Step 5 protected | Add `/article/:path*/` → `/articles/:path*/` siblings for all four rules |
| 2 | `src/utils/slugs.ts:59-86` | CATEGORY_CONFIG accents for article/review still hold pre-AA hex values; comment claims they mirror global.css tokens but they no longer do; feeds non-theme-aware placeholder tiles | Reconcile to `#9c4d34`/`#7a6122`, or have PostCardList read `var(--accent-<section>)` |
| 3 | `PostCardList.astro` / `PostList.astro` | Archive/Bylines/Topics list bodies still use rounded-card pre-rebuild style — half-migrated vs Rod's "uniform Edition family" decision | Restyle to the catalog/ledger idiom |
| 4 | `src/content.config.ts:19` | `template` enum still allows removed `'essay'` value (dead config) | Drop `'essay'` from the enum |
| 5 | `[category]/index.astro` | Section indexes never pass a meta `description`; newsletter loses an easy "Hangman Chronicles" SEO win | Per-section descriptions in SECTION_META → BaseLayout |
| 6 | `home/index.html` h1 | Nameplate's accessible name computes as "RodMachen" (CSS-only line break) | Space before the span or `aria-label="Rod Machen"` |
| 7 | `home/index.html` card 01 | Hub says "The Edition" — contradicts Rod's "Edition, not The Edition" refinement | Rename to "Edition" |
| 8 | `.github/workflows/ci.yml:3-5` | Unfiltered `push` + `pull_request` triggers double-run every PR | Scope push to master and/or add concurrency cancel |
| 9 | `public/` | No robots.txt advertising the new sitemap | Add robots.txt with Sitemap line |

Items deliberately deferred during the run (NOT findings): a-week-of-tennis duplicate; malformed YAML in 2015-03-12-sxsw-2015-a-look-back.md; Vercel preview env var; Astro 6 + remaining audit vulns; post-merge redirect curl check.
