# Edition Rebuild + rodmachen.com Home Page

**Plan filename (confirmed at Step 0):** `edition-rebuild-and-rodmachen-home.md`

## Context

This repo (edition.rodmachen.com, an Astro 5 static blog on Vercel) was set aside months ago mid-architecture. Rod wants to finish it with a near-total rebuild of the frontend while keeping the content and Astro stack. Confirmed decisions:

- **edition.rodmachen.com**: home page with the "Big 3" sections prominent — Newsletter ("The Hangman Chronicles"), Articles, Reviews — bylines as a visually secondary area, Archive accessible but de-emphasized. Section sub-homepages with per-section identity. Dark mode + excellent mobile. High design quality via the frontend-design skill.
- **Essays category folds into Articles.** (Validated: zero posts currently have `category: essay` — this is config/schema/redirect work only.)
- **URL structure moves to plural** (`/articles/[slug]/`, `/reviews/[slug]/`, `/bylines/`) to match section index pages, with permanent redirects from singular paths. Only ~19 URLs move; the high-value `/p/:slug` → `/newsletter/` redirects are unaffected.
- **rodmachen.com lives in this repo as a plain static HTML/CSS page** (user's explicit choice — not an Astro site) in a `home/` subfolder, deployed as a second Vercel project rooted there. Its own distinct look. Links: edition.rodmachen.com, code.rodmachen.com, photo.rodmachen.com, Austin Chronicle + Cinapse author pages, social accounts.
- **Design process**: an early checkpoint step produces 2–3 static HTML mockups for edition and 2 for rodmachen.com; Rod picks directions before the real build.
- **Claude Design**: after the design system stabilizes, sync tokens/components to a claude.ai/design project via DesignSync.
- **Repo cleanup + dependency updates**: commit/resolve pending working-tree changes, archive completed plan docs, bump deps.

### Key constraints found during planning

- **Astro 6 is blocked**: `astro-cloudinary@1.3.5` peer-depends on `astro ^5.0.0`. Bump within v5 (astro 5.18.x, @astrojs/vercel 8.2.x, @astrojs/rss 4.0.x). Follow-up (out of scope): replace the two `astro-cloudinary/helpers` calls (`getCldImageUrl` in `src/utils/posts.ts`, `getCldOgImageUrl` in `src/pages/[category]/[slug].astro`) with hand-rolled Cloudinary URLs, then take Astro 6.
- **`published` flag is never filtered** anywhere in `src/pages` — the untracked draft `src/content/posts/a-week-of-tennis.md` would ship as-is. It also looks like a partial duplicate of `2014-02-25-neutral-milk-hotel-retro-scenester-adventure.md` (same date/subtitle/tags, malformed link) — flag to Rod in the PR.
- All post hrefs flow through `postToListItem()` / `getPostSlug()` / `getPostCategory()` in `src/utils/posts.ts`, so the URL change is centralized.
- No tests or CI exist — per workflow rules, adding them is the first implementation step.
- Theme FOUC risk: dark mode needs a render-blocking inline script in `BaseLayout.astro` head, not a deferred component.

### Critical files

- `src/utils/posts.ts` — CATEGORY_CONFIG, slug/href helpers (Steps 4–6)
- `src/content.config.ts` — schema (essay removal, published flag)
- `src/pages/[category]/[slug].astro`, `src/pages/[category]/index.astro` — URL structure + section pages
- `src/styles/global.css` — token system, dark mode
- `vercel.json` — redirect coverage
- `home/` — new static rodmachen.com page

---

## Step 0: Branch, rename, and first commit

Sonnet / low, tests-alongside (no tests), context-clear: no.

1. Confirm plan filename `edition-rebuild-and-rodmachen-home.md` with Rod.
2. Create branch `feature/edition-rebuild`.
3. Rename this plan file to the confirmed name; commit it as the sole change.
4. Push and open the PR immediately (not draft).

- **Verify:** `git branch --show-current` prints `feature/edition-rebuild`; PR exists via `gh pr view`.

## Step 1: Test framework + CI ✅

- **Model/effort:** Sonnet / medium — (a) low ambiguity (standard vitest + Actions setup), (b) minor third-party wrinkle: vitest importing `posts.ts` may trip on the runtime `astro-cloudinary/helpers` import (the `astro:content` import is type-only and strips fine) — if so, extract pure helpers to `src/utils/slugs.ts`, (c) low compounding risk, (d) easy to verify. Routine implementation.
- **Context-clear:** no
- **Mode:** tests-alongside (this step creates the test infrastructure)
- **Files:** `package.json` (vitest, `test`/`check` scripts), `vitest.config.ts`, `src/utils/posts.test.ts`, `.github/workflows/ci.yml`

Unit tests for the pure helpers in `src/utils/posts.ts` (`getPostSlug`, `getPostCategory`, `formatDate`, `extractFirstImage`, `getPostsByCategory`). CI on push/PR: `npm ci`, `npx astro check` (add `@astrojs/check` + `typescript` devDeps if needed), `npx vitest run`, `npm run build`. Node 22.

- **Verify:** `npx vitest run` and `npm run build` green locally; `gh run watch` shows CI passing after push.

## Step 2: Commit pending changes + docs cleanup ✅

- **Model/effort:** Sonnet / low — (a) no ambiguity, (b) no third-party internals, (c) low risk, (d) trivially verifiable. Pure housekeeping.
- **Context-clear:** no
- **Mode:** tests-alongside (no new tests)
- **Files:** `.gitignore`, 4 modified post files (article→review recategorizations), `src/content/posts/a-week-of-tennis.md`, `docs/claude-sessions/2026-03-01.md`, `docs/plans/` reorganization

1. Commit the `.gitignore` change, the 4 recategorized posts, and the session doc.
2. Add `published: false` to `a-week-of-tennis.md` frontmatter and commit (draft filtering arrives in Step 4); note the likely-duplicate question in the PR description.
3. Create `docs/plans/archive/`; `git mv` completed plan docs into it; move the superseded `rod-machen-architecture.md` there too with a "Superseded by edition-rebuild-and-rodmachen-home.md" note at top.

- **Verify:** `git status --short` is clean; `npm run build` green.

## Step 3: Dependency bump (within Astro 5) ✅

- **Model/effort:** Sonnet / medium — (a) low ambiguity, (b) moderate third-party risk: minor-version Astro/adapter bumps can shift build behavior, and the custom remark Cloudinary plugin must survive, (c) moderate compounding risk if breakage goes unnoticed, (d) verifiable via build output inspection. Close call vs low; medium for the plugin check.
- **Context-clear:** no
- **Mode:** tests-alongside
- **Files:** `package.json`, `package-lock.json`

Bump `astro`, `@astrojs/vercel`, `@astrojs/rss` to latest v5-compatible versions. Do NOT move to Astro 6 (astro-cloudinary peer cap). Fix `package.json` `name` to `edition-rodmachen-com`. Keep `cheerio`/`turndown` (used by `scripts/*.mjs`). Run `npm audit` and report.

- **Verify:** `npm run build`, `npx vitest run`, `npx astro check` green; a built post page in `dist/` still contains Cloudinary `<figure>`/srcset markup.

## Step 4: Content model — remove essay, add draft filtering

- **Model/effort:** Sonnet / medium — (a) low ambiguity (decisions made), (b) no unfamiliar internals, (c) moderate compounding risk: every page reads this model, (d) verifiable by build output + tests. TDD makes this safe at medium.
- **Context-clear:** no
- **Mode:** TDD (data transformation/mapping)
- **Files:** `src/content.config.ts`, `src/utils/posts.ts`, `src/utils/posts.test.ts`, all `getCollection('posts')` call sites (`src/pages/index.astro`, `[category]/[slug].astro`, `archive/[...page].astro`, `topics/index.astro`, `topics/[tag].astro`, `rss.xml.ts`)

Drop `essay` from schema enum and `CATEGORY_CONFIG`. Add `path` field per category (`article` → `articles`, `review` → `reviews`, `newsletter` → `newsletter`, `byline` → `bylines`). Add `getPublishedPosts()` filtering `published === false`; use it at every call site. Write failing tests first for the path mapping and draft filter.

- **Verify:** `npx vitest run` green; after `npm run build`, no `a-week-of-tennis` page and no `dist/essay/` directory.

## Step 5: URL structure + redirects

- **Model/effort:** Sonnet / medium — (a) low ambiguity, (b) Vercel redirect semantics with `trailingSlash: 'always'` need care, (c) high compounding risk if old URLs 404 (SEO), (d) verifiable via dist inspection + redirect checks on preview deploy. Medium with TDD on href generation.
- **Context-clear:** no
- **Mode:** TDD (href/slug mapping logic)
- **Files:** `src/pages/[category]/[slug].astro`, `src/utils/posts.ts` + tests, `src/pages/byline/` → `src/pages/bylines/`, `vercel.json`

Generate routes from `CATEGORY_CONFIG[].path` (plural). Move byline index to `/bylines/`. Add permanent redirects: `/article/:path*` → `/articles/:path*`, `/review/:path*` → `/reviews/:path*`, `/essay/:path*` → `/articles/:path*`, `/byline/:path*` → `/bylines/:path*`. Confirm `/p/:slug` → `/newsletter/:slug/` still intact.

- **Verify:** `npm run build`; `dist/articles/`, `dist/reviews/`, `dist/newsletter/` contain post folders; no `dist/article/` or `dist/review/`; `dist/rss.xml` contains no `/article/` hrefs; vitest green. On the Vercel preview deploy, `curl -sI` an old singular URL → 301/308 to plural.

## Step 6: Design mockups — USER CHECKPOINT

- **Model/effort:** Opus / high — (a) high ambiguity: open-ended visual design, (b) n/a, (c) high leverage: everything downstream builds on the chosen direction, (d) correctness is subjective — needs the strongest design model. Use the **frontend-design skill**.
- **Context-clear:** **yes** — new chapter; prior dependency/refactor output is noise for design work.
- **Mode:** tests-alongside (no tests — static mockups)
- **Files:** `docs/design/mockups/edition-option-{a,b,c}.html`, `docs/design/mockups/rodmachen-home-{a,b}.html` (single-file HTML with inline CSS; never shipped — not under `src/pages/`)

Each edition mockup shows home (Big 3 prominent, bylines secondary, archive de-emphasized), one section index, one post page, with a working light/dark toggle. Two distinct one-page looks for rodmachen.com. **STOP for Rod's choice** of both directions, and collect: social account list, exact Austin Chronicle and Cinapse author-page URLs.

- **Verify:** each file opens in a browser and renders sensibly at 375px and 1280px; Rod has picked a direction for each site.

## Step 7: Design tokens + layout shell (dark mode)

- **Model/effort:** Opus / high — (a) translating a mockup into a token system involves judgment, (b) FOUC-free theme bootstrapping is fiddly, (c) very high compounding risk: every later step consumes these tokens, (d) visual correctness is hard to auto-verify.
- **Context-clear:** yes — start of the build-out chapter; only the chosen mockup matters.
- **Mode:** tests-alongside
- **Files:** `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, new `src/components/ThemeToggle.astro`, `src/utils/posts.ts` (accent values aligned to tokens)

Full token rework from the chosen mockup: color scheme custom properties with `prefers-color-scheme` defaults + `[data-theme]` overrides; typography scale; per-section accent tokens with light/dark variants. BaseLayout gets a render-blocking inline theme script (localStorage) and `meta name="theme-color"`. Header nav: Newsletter / Articles / Reviews / Bylines + theme toggle, usable at 375px.

- **Verify:** toggle persists across reloads; no white flash on hard reload in dark mode (DevTools throttling check); `npm run build` + vitest green.

## Step 8: Home page rebuild

- **Model/effort:** Opus / high — (a) the flagship page; layout judgment within the chosen direction, (b) low, (c) moderate, (d) visual quality hard to verify mechanically. Use the frontend-design skill.
- **Context-clear:** no
- **Mode:** tests-alongside
- **Files:** `src/pages/index.astro`, possibly `src/components/PostList.astro` / `PostCardList.astro`

Big 3 as prominent blocks with 3–5 recent posts each; bylines as a visually secondary strip; archive + topics as quiet footer-level links (not equal cards).

- **Verify:** `npm run build` green; visual check both themes at 375/768/1280px.

## Step 9: Section sub-homepages

- **Model/effort:** Sonnet / medium — (a) low ambiguity once tokens + home exist (pattern application), (b) low, (c) low, (d) build-verifiable. Close call vs Opus/high: per-section identity is design work, but the system from Steps 6–8 constrains it.
- **Context-clear:** no
- **Mode:** tests-alongside
- **Files:** `src/pages/[category]/index.astro` (replaces the current 301 stub), reusing `PostList`/`PostCardList`

Real section indexes for `/newsletter/`, `/articles/`, `/reviews/` with per-section accent/typography from `CATEGORY_CONFIG`. Newsletter page titles/H1 carry "The Hangman Chronicles" for SEO.

- **Verify:** `dist/newsletter/index.html`, `dist/articles/index.html`, `dist/reviews/index.html` exist and render section-distinct styling in both themes.

## Step 10: Post pages, bylines, archive, topics, about/contact restyle

- **Model/effort:** Sonnet / medium — (a) low: applying the established system, (b) one watch-item: Cloudinary figures and `getCldOgImageUrl` OG images must survive restyling, (c) moderate breadth, (d) build + spot-check verifiable.
- **Context-clear:** no
- **Mode:** tests-alongside
- **Files:** `src/layouts/PostLayout.astro`, `src/pages/bylines/index.astro`, `src/pages/archive/[...page].astro`, `src/pages/topics/index.astro`, `src/pages/topics/[tag].astro`, `src/pages/about.astro`, `src/pages/contact.astro`

- **Verify:** build green; spot-check in both themes: a newsletter post with images (Cloudinary figures intact), a review, archive page 2, a tag page; OG meta tags present on a post page.

## Step 11: Polish + design/accessibility audit

- **Model/effort:** Opus / high — (a) audit findings require judgment to triage, (b) low, (c) low, (d) accessibility/contrast correctness benefits from the strongest review. Run the **web-design-guidelines skill**.
- **Context-clear:** no
- **Mode:** tests-alongside
- **Files:** as found by the audit; optionally add `@astrojs/sitemap` to `astro.config.mjs`

Fix contrast/focus/touch-target issues in both themes; confirm RSS hrefs, OG/Twitter meta. Add sitemap integration.

- **Verify:** audit findings addressed or explicitly waived; `npx vitest run`, `npx astro check`, `npm run build` green; `dist/sitemap-index.xml` exists if sitemap added.

## Step 12: rodmachen.com static page

- **Model/effort:** Opus / high — (a) standalone visual design (own distinct look), (b) none, (c) low, (d) subjective quality. Use the frontend-design skill, building from the chosen Step 6 mockup.
- **Context-clear:** yes — distinct site, distinct design context.
- **Mode:** tests-alongside (no JS to test; plain HTML/CSS)
- **Files:** `home/index.html`, `home/styles.css`, `home/vercel.json` (cleanUrls, cache headers), any assets under `home/`

Plain HTML/CSS, no build step. Links: edition.rodmachen.com, code.rodmachen.com, photo.rodmachen.com, Austin Chronicle + Cinapse author pages, social accounts (collected at Step 6). Dark mode via `prefers-color-scheme`. Mobile-first.

- **Verify:** `open home/index.html` renders correctly at 375px and 1280px in both schemes; all links resolve (curl each external URL → 200).

## Step 13: Claude Design sync

- **Model/effort:** Sonnet / medium — (a) low ambiguity, (b) DesignSync flow has its own guardrails (list → finalize_plan → write), (c) low, (d) verifiable in the claude.ai/design UI.
- **Context-clear:** no
- **Mode:** tests-alongside (no tests)
- **Files:** none in-repo (or a small `design-system/` export bundle if the /design-sync flow requires one)

Sync the stabilized tokens (from `src/styles/global.css`) and component patterns to a claude.ai/design design-system project via the DesignSync tool (`list_projects` → create if needed → `finalize_plan` → `write_files`).

- **Verify:** sync completes; token/component cards visible in the claude.ai/design project.

## Step 14: README + PR description final pass

- **Model/effort:** Sonnet / low — (a–d) all low; documentation.
- **Context-clear:** no
- **Mode:** tests-alongside (no tests)
- **Files:** `README.md`

Document the two-site repo layout (`/` = edition Astro app, `home/` = rodmachen.com static page), dev/test/CI commands, deployment notes, scripts/ provenance, the Astro 6 follow-up, and the URL-migration table. Update the PR description checklist.

- **Verify:** CI green on the PR; README renders correctly on GitHub.

## Step 15: Fix review feedback

- **Model/effort:** Sonnet / medium — scope depends on findings; default for review follow-up.
- **Context-clear:** no
- **Mode:** tests-alongside (update tests as findings require)

Run a code review (e.g. /code-review) on the PR; implement actionable findings on the same branch; commit as "Fix review feedback: <summary>" and push.

- **Verify:** feedback commit pushed; CI green.

---

## Post-merge: deployment + DNS (manual, with Rod)

Not a numbered implementation step — requires Vercel dashboard/CLI and registrar access, performed after merge.

1. Create a second Vercel project rooted at `home/` (framework "Other", no build command, output directory `.`); assign `rodmachen.com` + `www.rodmachen.com`. Optionally set Ignored Build Step on both projects so edits to one folder don't rebuild the other.
2. DNS at registrar: apex A → `76.76.21.21`; `www` CNAME → `cname.vercel-dns.com`. (`edition` CNAME already in place.)
3. **Verify:** `curl -sI https://rodmachen.com` → 200 with the new page; `curl -sI https://edition.rodmachen.com/article/<old-slug>/` → 301/308 to `/articles/...`; a `/p/:slug` newsletter redirect still works; both themes render on mobile.

## Out of scope (recorded follow-ups)

- **Astro 6 upgrade**: blocked by `astro-cloudinary` peer deps. Path: replace `getCldImageUrl`/`getCldOgImageUrl` with hand-rolled Cloudinary URL builders, drop the dependency, then upgrade.
- code.rodmachen.com and photo.rodmachen.com changes live in their own repos.
- Resolution of the `a-week-of-tennis.md` draft content (kept as `published: false`; Rod decides its fate later).
