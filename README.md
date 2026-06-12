# edition-rodmachen-com

Two sites, one repo.

## Repo layout

```
/          — edition.rodmachen.com (Astro 5 static blog, deployed via Vercel project root `/`)
home/      — rodmachen.com (plain static HTML/CSS, deployed as a second Vercel project rooted at `home/`)
scripts/   — one-off content-migration utilities (never deployed)
```

## Sites

### edition.rodmachen.com

Astro 5 static blog with four content sections: Newsletter ("The Hangman Chronicles"), Articles, Reviews, Bylines. Design system: "The Ledger Broadsheet" — Fraunces / Newsreader / Spline Sans Mono, cream-paper / ink-at-night themes, oxblood + per-section accent colors.

### rodmachen.com

Plain HTML/CSS calling-card page. No build step. Links to edition.rodmachen.com, code.rodmachen.com, photo.rodmachen.com, Austin Chronicle and Cinapse author pages, and social accounts. Deployed as a separate Vercel project rooted at `home/` (framework "Other", no build command, output directory `.`).

## Dev commands

```bash
npm run dev          # Astro dev server (edition only)
npx vitest run       # unit tests
npx astro check      # TypeScript + Astro type check
npm run build        # production build (writes to dist/)
```

## CI

GitHub Actions on every push and PR (`.github/workflows/ci.yml`). Node 22. Runs `npm ci`, `npx astro check`, `npx vitest run`, `npm run build` in sequence.

## Deployment

**edition.rodmachen.com** — Vercel project rooted at `/`. Framework: Astro. Requires env var `PUBLIC_CLOUDINARY_CLOUD_NAME` set in project settings (Vercel preview environments need this explicitly — the build will succeed but images will be broken without it).

**rodmachen.com** — Second Vercel project rooted at `home/`. Framework: Other. No build command. Output directory: `.`. DNS: apex A → `76.76.21.21`; `www` CNAME → `cname.vercel-dns.com`. See the plan doc's "Post-merge" section (`docs/plans/edition-rebuild-and-rodmachen-home.md`) for the full DNS setup.

## URL-migration table

Permanent redirects in `vercel.json` (all 301):

| Old path | New path |
|---|---|
| `/article/:slug` | `/articles/:slug` |
| `/review/:slug` | `/reviews/:slug` |
| `/essay/:slug` | `/articles/:slug` (essays folded into articles) |
| `/byline/…` | `/bylines/…` |
| `/p/:slug` | `/newsletter/:slug/` (pre-existing; unchanged) |

## scripts/

One-off content-migration utilities, not part of the site build. All use Node ESM (`*.mjs`) with `cheerio` and `turndown` as dependencies.

| Script | Purpose |
|---|---|
| `convert-substack.mjs` | Convert a Substack export (CSV + HTML) to Astro-compatible markdown posts |
| `fetch-chronicle-bylines.mjs` | Scrape Rod's Austin Chronicle author page and generate byline markdown files |
| `fetch-cinapse-bylines.mjs` | Fetch Rod's Cinapse posts via WordPress REST API and generate byline markdown files |
| `fix-byline-bodies.mjs` | Re-fetch article pages to repair missing or placeholder byline body text |
| `fix-byline-dates.mjs` | Re-fetch article pages to fix `2000-01-01` placeholder dates and rename files |
| `generate-tags.mjs` | Generate consistent tags for all content using Claude Haiku (requires `ANTHROPIC_API_KEY`) |

## Astro 6 follow-up (blocked)

`astro-cloudinary@1.3.5` peer-depends on `astro ^5.0.0`, blocking the upgrade. There are also ~11 `npm audit` findings waiting on this upgrade.

Unblock path:
1. Replace `getCldImageUrl` (`src/utils/posts.ts`) and `getCldOgImageUrl` (`src/pages/[category]/[slug].astro`) with hand-rolled Cloudinary URL builders.
2. Drop the `astro-cloudinary` dependency.
3. Upgrade to Astro 6.

## Known issues / deferred decisions

- `src/content/posts/a-week-of-tennis.md` is marked `published: false`. It appears to be a partial duplicate of `2014-02-25-neutral-milk-hotel-retro-scenester-adventure.md` (same date/subtitle/tags, malformed link). Rod to decide its fate.
- `src/content/posts/2015-03-12-sxsw-2015-a-look-back.md` has malformed category YAML — review if it surfaces build warnings.
- Vercel preview environments require `PUBLIC_CLOUDINARY_CLOUD_NAME` to be set explicitly in project settings or images will be broken on preview deploys.
