Generated: June 12, 2026
Saved: June 12, 2026

# Step 15 Feedback Report — Opus/xhigh Review

Commit: 64b332e

## Changes Made (per finding)

**Finding 1 — vercel.json trailing-slash variants**
Added trailing-slash sibling for each of the four new redirect rules (`/article`, `/review`, `/essay`, `/byline`), mirroring the existing `/categories` pair exactly. Each rule now has both `/path*` and `/path*/` forms to prevent redirect chains with `trailingSlash: 'always'`.

**Finding 2 — slugs.ts accent drift**
Synced the two diverged hex values to the AA-corrected global.css tokens: `article` from `#b8654a` → `#9c4d34`, `review` from `#9a7b32` → `#7a6122`. Updated the comment to state the sync invariant clearly ("mirror the LIGHT-mode values…keep in sync whenever global.css tokens are updated"). No test fixtures reference accent values so no test changes were needed. The token-reading approach (CSS vars in inline styles) was evaluated but is already superseded by the PostCardList restyle (finding 3), which uses `--item-accent` CSS vars; the hardcoded hex values remain only as fallbacks for any remaining component that can't read CSS vars.

**Finding 3 — PostCardList/PostList catalog restyle**
Both components rewritten to the broadsheet catalog/ledger idiom:
- `PostList.astro`: `.post-list` → `.catalog` with `border-top: 2px solid var(--ink)`, each `li` uses `border-bottom: var(--rule-thin) solid var(--rule-soft)`, `time` uses `var(--font-mono)` + `var(--gold)` + letter-spacing, title links use `var(--font-text)` + `var(--ink)` + accent-hover. Tags drop the background-chip style for plain mono text links. Removed `li:first-child` border-top (redundant with list-level top rule).
- `PostCardList.astro`: Card layout (rounded borders, box-shadow, image/placeholder column) replaced with 2-column grid (`5.5rem 1fr`). Image-less placeholder tiles removed; Cloudinary and local images (`logo-img`) float right inside `.entry-body` for byline publication logos. Per-item `--item-accent` CSS var mapped from `ACCENT_VARS` record (theme-aware, dark-mode responsive). `.entry-meta` uses mono + uppercase + `var(--ink-soft)`. CldImage import and usage preserved for Cloudinary URLs.

**Finding 4 — essay in template enum**
Removed `'essay'` from `z.enum(['article', 'essay', 'newsletter', 'review'])` → `z.enum(['article', 'newsletter', 'review'])` in `src/content.config.ts`.

**Finding 5 — per-section meta descriptions**
Added `description: string` to the `SectionMeta` type and populated it in `SECTION_META` for all three sections:
- newsletter: "The Hangman Chronicles — a weekly dispatch by Rod Machen on culture, arts, and Austin life."
- article: "Long-form writing, essays, and original pieces by Rod Machen."
- review: "Film, TV, and food reviews by Rod Machen, published in Edition."
Fallback uses `config.description` from CATEGORY_CONFIG. Description passed to `BaseLayout` via the existing `description` prop.

**Finding 6 — hub h1 accessible name**
Added a space before `<span class="last">` in `home/index.html`: `Rod<span...` → `Rod <span...`. The h1 accessible name now resolves to "Rod Machen" with no run-together token.

**Finding 7 — "The Edition" on hub card**
Changed `<span class="t">The Edition</span>` → `<span class="t">Edition</span>` in destination card 01 of `home/index.html`.

**Finding 8 — CI double-runs**
Scoped push trigger to `branches: [master]` and added `concurrency: { group: ..., cancel-in-progress: true }` block. PR branch pushes no longer trigger a redundant push-based run; only the `pull_request` event fires on the PR.

**Finding 9 — robots.txt**
Created `public/robots.txt` with:
```
User-agent: *
Allow: /

Sitemap: https://edition.rodmachen.com/sitemap-index.xml
```

**Additional fix (tsconfig.json)**
Added `"exclude": ["docs"]` to prevent `astro check` from picking up untracked `.astro` files in `docs/implementation/design-sync-bundle/` that reference paths only valid in `src/`. These files were never committed (untracked) so CI was unaffected; locally `astro check` was failing. Excluding `docs/` is correct since no source-checked files live there.

## Deferred

None — all 9 findings addressed.

## New Issues Surfaced

- CI Node.js 20 deprecation annotation appeared on this run (GitHub Actions runner warning, non-blocking until Sep 2026). Pre-existed this step, noted in PR description.
- Post-merge curl check on old `/article/<slug>/` trailing-slash URLs still deferred per the plan (requires Vercel production deployment).
