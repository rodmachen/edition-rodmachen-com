# Task: Review the full PR diff (Phase 4)

You are the review agent for PR #1 ("Edition rebuild + rodmachen.com home page") in /Users/rodmachen/code/edition-rodmachen-com, branch feature/edition-rebuild. You have repo access — read any file you need for context beyond the diff. Do not modify any files except writing your result JSON. Do not ask for confirmation — execute directly.

Review these changes for: correctness bugs, broken/missing redirects or SEO regressions, accessibility issues, design-system inconsistencies (vs the decisions in the context log), test gaps, CI weaknesses, security issues, and divergence from the plan (docs/plans/edition-rebuild-and-rodmachen-home.md) or from Rod's checkpoint decisions recorded in the context log below.

Notes on scope:
- The diff below EXCLUDES package-lock.json (2.7k lines of lockfile churn) and docs/design/mockups/ (design exploration artifacts, never shipped). Read them directly if needed.
- docs/implementation/ orchestration artifacts are untracked and out of scope.
- Known, deliberately deferred items (do NOT report as findings): a-week-of-tennis.md duplicate question; malformed category YAML in 2015-03-12-sxsw-2015-a-look-back.md; Vercel preview env missing PUBLIC_CLOUDINARY_CLOUD_NAME; Astro 6 upgrade + remaining npm audit findings; preview-deploy redirect curl check deferred to post-merge.

For each issue found, produce a JSON object with: "severity" ("blocking" or "non-blocking"), "location" (file and line if applicable), "description" (what the issue is), "suggestion" (recommended fix).

Write the full array (possibly empty) to docs/implementation/edition-rebuild-and-rodmachen-home/results/review.json as {"findings": [...], "summary": "two-to-four sentence overall assessment"}. That file is your ONLY output.

---

## Context log (orchestrator's running record)

# Orchestration Context: edition-rebuild-and-rodmachen-home

- **Plan file:** `docs/plans/i-created-this-repo-shimmering-unicorn.md` → renamed in Step 0 to `docs/plans/edition-rebuild-and-rodmachen-home.md`
- **Started:** 2026-06-11 22:02 PDT
- **Orchestrator:** /multi-agent-plan run

**Summary:** Near-total frontend rebuild of edition.rodmachen.com (Astro 5 static blog on Vercel) keeping content and stack: add test framework + CI, clean up pending working-tree changes, bump deps within Astro 5, fold the essay category into articles, add draft filtering, move post URLs to plural paths with permanent redirects, produce design mockups (user checkpoint), then rebuild home/section/post pages with a token-based dark-mode design system. Also adds rodmachen.com as a plain static HTML/CSS page in `home/` (second Vercel project) and syncs the design system to claude.ai/design. Ends with README/PR docs and a review-feedback pass.

## Plan

Tagged steps (model / effort / deps / success criteria):

| Step | Model/Effort | Depends on | Success criteria |
|---|---|---|---|
| 0 Branch+rename+first commit | sonnet/low | — | branch `feature/edition-rebuild`; plan renamed+committed solo; PR open (`gh pr view`) |
| 1 Test framework + CI | sonnet/medium | 0 | `npx vitest run` + `npm run build` green; CI passing on push |
| 2 Commit pending changes + docs cleanup | sonnet/low | 0 | `git status --short` clean; build green |
| 3 Dependency bump (Astro 5) | sonnet/medium | 1,2 | build/vitest/astro check green; Cloudinary figure markup in dist |
| 4 Content model (essay removal, draft filter) | sonnet/medium | 3 | vitest green; no `a-week-of-tennis` page; no `dist/essay/` |
| 5 URL structure + redirects | sonnet/medium | 4 | plural dirs in dist; no singular dirs; rss clean; redirects in vercel.json |
| 6 Design mockups — USER CHECKPOINT | opus/high | — (fresh context) | 5 mockup HTML files render at 375/1280px; **STOP for Rod's pick + link/social collection** |
| 7 Tokens + layout shell (dark mode) | opus/high | 6 (choice) | toggle persists; no FOUC; build+vitest green |
| 8 Home page rebuild | opus/high | 7 | build green; visual check both themes |
| 9 Section sub-homepages | sonnet/medium | 8 | section index.html files exist, section-distinct styling |
| 10 Post/bylines/archive/topics/about restyle | sonnet/medium | 9 | build green; Cloudinary figures + OG meta intact |
| 11 Polish + a11y audit | opus/high | 10 | findings fixed/waived; checks green; sitemap |
| 12 rodmachen.com static page | opus/high | 6 (choice) | renders both schemes; external links 200 |
| 13 Claude Design sync | sonnet/medium | 11 | sync completes in claude.ai/design |
| 14 README + PR final pass | sonnet/low | 13 | CI green; README renders |
| 15 Fix review feedback | sonnet/medium | 14 | feedback commit pushed; CI green |

## Batches

Consecutive same model+effort, split at the Step 6 checkpoint and at context-clear boundaries:

- **Batch A** — Step 0 (sonnet/low)
- **Batch B** — Step 1 (sonnet/medium)
- **Batch C** — Step 2 (sonnet/low)
- **Batch D** — Steps 3+4+5 (sonnet/medium)
- **Batch E** — Step 6 (opus/high) → **HALT for user checkpoint** (design direction, social accounts, author-page URLs)
- **Batch F** — Steps 7+8 (opus/high)
- **Batch G** — Steps 9+10 (sonnet/medium)
- **Batch H** — Step 11 (opus/high)
- **Batch I** — Step 12 (opus/high; context-clear: yes → separate agent from Batch H)
- **Batch J** — Step 13 (sonnet/medium)
- **Batch K** — Step 14 (sonnet/low)
- **Review** — Phase 4 (opus/xhigh)
- **Feedback** — Phase 5 = Step 15 (sonnet/high per command spec)

Context-clear flags (Steps 6, 7, 12) are satisfied structurally: every batch is a fresh `claude -p` subprocess.

## Assumptions

- **Plan filename:** Step 0 calls for confirming `edition-rebuild-and-rodmachen-home.md` with Rod. This is an autonomous run; the plan document itself proposes that exact name, so it is adopted without a confirmation round-trip. The implementation directory uses the same slug.
- Working tree has uncommitted changes on `master`; per the plan these are intentionally committed in Step 2 on the feature branch (not stashed or discarded).

## Step Results

### Step 0 (Batch A, sonnet/low) — SUCCESS
- Branch `feature/edition-rebuild`; plan renamed and committed solo (`bf80b11`); PR #1 open (non-draft): https://github.com/rodmachen/edition-rodmachen-com/pull/1
- Verified by orchestrator: `git show --stat HEAD` = 1 file; `gh pr view` OPEN.

### Step 1 (Batch B, sonnet/medium) — SUCCESS
- Commits `edbd178`, `395e284`, `9cda59b` (step-complete mark). CI green: https://github.com/rodmachen/edition-rodmachen-com/actions/runs/27396032384
- **Pure helpers extracted to `src/utils/slugs.ts`** (vitest tripped on `astro-cloudinary/helpers` runtime import in posts.ts); posts.ts re-exports, call sites unchanged. 20 tests.
- CI needed `PUBLIC_CLOUDINARY_CLOUD_NAME` env (public value, already in rendered HTML — not a secret).
- Pre-existing astro check hints (2) and duplicate-id warnings (4, from the still-uncommitted modified posts) noted, not fixed.

### Step 2 (Batch C, sonnet/low) — SUCCESS
- Commits `186e785` (content + .gitignore), `d32d85b` (docs reorg), `40aad2b` (mark). Tree clean except `docs/implementation/`.
- `a-week-of-tennis.md` committed with `published: false` (verified, line 7). Duplicate question noted in PR.
- Only `rod-machen-architecture.md` archived: no other plan in `docs/plans/` carries ✅ marks. **Assumption:** the older plan files (bylines-update-y, cloudinary-image, etc.) stay put until marked complete — the plan's "completed plan docs" test is the ✅ convention.
- Note: neutral-milk-hotel diff also normalized `<hr>` → `---` (cosmetic, committed as-is).

### Steps 3–5 (Batch D, sonnet/medium) — SUCCESS
- Step 3 `c8f147c`: astro 5.18.2, @astrojs/vercel 8.2.11, @astrojs/rss 4.0.18; package name fixed. `npm audit fix` (non-breaking) cut vulns 24→11; the remaining 11 need Astro 6 (blocked by astro-cloudinary — recorded follow-up).
- Step 4 `a17fb48`: essay removed; `path` per category; `getPublishedPosts()` at all call sites. CATEGORY_CONFIG moved to slugs.ts (testability).
- Step 5 `8907c14`: plural routes via `getCategoryPath()`; bylines moved; 4 permanent redirects added; `/p/:slug` intact. RSS hrefs fixed to plural (was generating singular). CI green: run 27396986609.
- **Flag for Rod:** `2015-03-12-sxsw-2015-a-look-back.md` has malformed multi-line YAML in `category` → garbage path "article - austin - screens - sxsw"; its URL escapes the redirect rules. Pre-existing; needs frontmatter fix.
- **Flag for Rod:** Vercel preview deploys fail (pre-existing): `PUBLIC_CLOUDINARY_CLOUD_NAME` missing in Vercel env. Preview redirect check deferred to post-merge verification.

### Step 6 (Batch E, opus/high) — mockups produced; awaiting Rod's checkpoint
- Commit `0a3783d`: 3 edition directions — A "The Broadsheet" (literary review, cream/ink/oxblood, light default), B "The Index" (card-catalog/database, mono + grotesque, dark default), C "The Almanac" (color-blocked zine, terracotta/ochre, light default); 2 rodmachen.com hubs — A "The Calling Card" (engraved-literary, dark), B "The Signal" (terminal-atmospheric, gradient mesh). Real post content used throughout.
- Also on branch: `798c4f6` "Step 5 follow-up: remove deleted src/pages/byline/index.astro" — the old byline index deletion had been left unstaged by Batch D; committed as follow-up.
- **Checkpoint round 1 (Rod, 2026-06-11):** rodmachen.com = **Option A "The Calling Card"** (decided). Edition: likes B best, wants a blend of A + B — new hybrid options requested. **Directive: edition must not be framed around "engineering manager"/coding; that identity belongs to code.rodmachen.com.** Social/author URLs still to collect at round 2.
- Iteration 6b (opus/high, commit `c4ea400`): `edition-option-d.html` "The Night Archive", `edition-option-e.html` "The Ledger Broadsheet".
- **Checkpoint round 2 (Rod, 2026-06-11) — Step 6 RESOLVED:**
  - **Edition = Option E "The Ledger Broadsheet"** (light-default literary broadsheet with catalog spine). Refinements: site name is **"Edition", not "The Edition"**. ~~The approved treatment is the home-page block only — discard the "Section Index" demo and below~~ **Correction (Rod, 2026-06-12): that restriction was a misunderstanding and is withdrawn — the full mockup, including its section-index and post-page treatments, stands as reference.** The Steps 9–10 implementation (distinctive-but-in-family section pages) remains valid.
  - **Section subpages:** Newsletter / Articles / Reviews each get a *somewhat distinctive* look but in a family with the Edition home. Bylines / Archive / Topics subpages can share one uniform treatment that matches Edition.
  - **rodmachen.com = Option A "The Calling Card"** (decided round 1).
  - **Hub links:** edition/code/photo subdomains; https://www.austinchronicle.com/author/rod-machen/; https://cinapse.net/author/rod/; socials: https://www.instagram.com/rod.machen.writer, https://bsky.app/profile/rodmachen.bsky.social, https://www.facebook.com/rod.machen.writer/. **Assumption:** X and Medium are omitted — Rod listed only these three when asked.

### Steps 7–8 (Batch F, opus/high) — SUCCESS
- Step 7 `592191f`: full token rework from option E; inline pre-paint theme script (verified to precede the stylesheet in dist HTML); per-section warm accent family (newsletter=oxblood, articles=clay, reviews=ochre, bylines=taupe) light+dark; ThemeToggle segmented control; legacy `--color-*` vars aliased to new tokens so unstyled pages stay coherent until Steps 9–10.
- Step 8 `a819b9b`: home rebuilt — Header `variant='home'` broadsheet nameplate ("Edition", h1), Big 3 blocks (5 entries, Fraunces lead item), bylines full-bleed secondary strip, archive/topics quiet footer; catalog IDs (newsletter №NNN, articles A·NN, reviews R·NN).
- CI green: run 27398945215. Steps 6/7/8 ✅ in plan; PR checklist updated.

### Steps 9–10 (Batch G, sonnet/medium) — SUCCESS
- Step 9 `9aa71ba`: section indexes — Reviews gets a 3-col ledger table; Newsletter/Articles share a 2-col dispatch catalog pattern; Newsletter title/h1 = "The Hangman Chronicles".
- Step 10 `6b54f08`: PostLayout now uses CSS-custom-property accent map (dark-aware); PageHeader carries the uniform family treatment for bylines/archive/topics; about/contact get native mastheads; Cloudinary figures confirmed intact in dist. Marks in `76d823d`. CI green: run 27399370650.

### Step 11 (Batch H, opus/high) — SUCCESS
- `f9e68f4` (+mark `1e96122`): AA contrast (clay→#9c4d34, ochre/gold→#7a6122), BaseLayout 'section' variant for single-h1 on section pages, new `src/plugins/remark-demote-headings.ts` (post bodies: `#`→h2) for single-h1 on posts, :focus-visible outlines, skip link, reduced-motion block, color-scheme, footer touch targets, @astrojs/sitemap (new dep, called out). CI green: run 27399871696.
- Waived (reasons logged in result JSON): /blog redirect stub h1; h2→h4 skips inside newsletter bodies (content-authored); 24px-min (not 44px) targets on dense broadsheet nav; checkout@v4 deprecation notice.

### Step 12 (Batch I, opus/high) — SUCCESS
- `894e44b` (+mark `7ff47cb`): `home/index.html`, `home/styles.css`, `home/vercel.json` — production Calling Card; exactly the 3 confirmed socials; no JS (prefers-color-scheme only); a11y upgrades over mockup; cleanUrls + cache headers. All 8 external links curl → 200.

### Step 13 (Batch J) — SUCCESS (orchestrator-executed)
- Headless subagent hit the expected DesignSync auth wall (`tool-unavailable`); per its fallback instruction it stopped cleanly. Rod ran /login; orchestrator completed the sync in-session: project "Edition — rodmachen.com" (e291efb7-bc26-4ebb-81f7-49d8ca6ee66a), 12 files written (3 @dsCard previews: Colors/Type/Components; tokens/global.css; 6 component sources; option E reference; README). Bundle kept under `docs/implementation/.../design-sync-bundle/` (untracked). Plan mark `790b7c8`; PR checklist updated.
- **Checkpoint correction (Rod, 2026-06-12):** his earlier "discard Section Index and below" note on option E was a misunderstanding — withdrawn. Full mockup stands as reference; Steps 9–10 output remains valid.

### Step 14 (Batch K, sonnet/low) — SUCCESS
- `7f5f988`: README rewritten (two-site layout, commands, deployment, scripts table, Astro 6 blocker + 11 audit findings note, URL-migration table); PR checklist 0–14 done; Open Questions refreshed (tennis duplicate, malformed sxsw-2015 YAML, Vercel preview env). CI green: run 27412614732.

## Assumptions (cont.)

- Orchestration artifacts under `docs/implementation/` remain untracked during execution; the orchestrator commits them once at the end of the run (Phase 6), keeping step commits atomic.
- Design batches (Steps 6, 7–8, 12) get `--allowedTools "Bash,Read,Write,Skill"` — `Skill` added beyond the command's Opus-task default so the frontend-design / web-design-guidelines skills are invocable. Edit is also included for batches that modify existing files (7–8, 11, 12).

---

## Full PR diff (git diff master, excluding package-lock.json and docs/design/mockups/)

```diff
diff --git a/.github/workflows/ci.yml b/.github/workflows/ci.yml
new file mode 100644
index 0000000..0fc8f63
--- /dev/null
+++ b/.github/workflows/ci.yml
@@ -0,0 +1,30 @@
+name: CI
+
+on:
+  push:
+  pull_request:
+
+jobs:
+  ci:
+    runs-on: ubuntu-latest
+    env:
+      PUBLIC_CLOUDINARY_CLOUD_NAME: dke4phurv
+    steps:
+      - uses: actions/checkout@v4
+
+      - uses: actions/setup-node@v4
+        with:
+          node-version: '22'
+          cache: 'npm'
+
+      - name: Install dependencies
+        run: npm ci
+
+      - name: Type check
+        run: npx astro check
+
+      - name: Run tests
+        run: npx vitest run
+
+      - name: Build
+        run: npm run build
diff --git a/.gitignore b/.gitignore
index 871ef5b..432b356 100644
--- a/.gitignore
+++ b/.gitignore
@@ -17,3 +17,4 @@ Thumbs.db
 *.swo
 *~
 .vercel
+.claude/settings.local.json
diff --git a/README.md b/README.md
index e575e48..a1791e4 100644
--- a/README.md
+++ b/README.md
@@ -1 +1,80 @@
-The collected works of Rod Machen.
\ No newline at end of file
+# edition-rodmachen-com
+
+Two sites, one repo.
+
+## Repo layout
+
+```
+/          — edition.rodmachen.com (Astro 5 static blog, deployed via Vercel project root `/`)
+home/      — rodmachen.com (plain static HTML/CSS, deployed as a second Vercel project rooted at `home/`)
+scripts/   — one-off content-migration utilities (never deployed)
+```
+
+## Sites
+
+### edition.rodmachen.com
+
+Astro 5 static blog with four content sections: Newsletter ("The Hangman Chronicles"), Articles, Reviews, Bylines. Design system: "The Ledger Broadsheet" — Fraunces / Newsreader / Spline Sans Mono, cream-paper / ink-at-night themes, oxblood + per-section accent colors.
+
+### rodmachen.com
+
+Plain HTML/CSS calling-card page. No build step. Links to edition.rodmachen.com, code.rodmachen.com, photo.rodmachen.com, Austin Chronicle and Cinapse author pages, and social accounts. Deployed as a separate Vercel project rooted at `home/` (framework "Other", no build command, output directory `.`).
+
+## Dev commands
+
+```bash
+npm run dev          # Astro dev server (edition only)
+npx vitest run       # unit tests
+npx astro check      # TypeScript + Astro type check
+npm run build        # production build (writes to dist/)
+```
+
+## CI
+
+GitHub Actions on every push and PR (`.github/workflows/ci.yml`). Node 22. Runs `npm ci`, `npx astro check`, `npx vitest run`, `npm run build` in sequence.
+
+## Deployment
+
+**edition.rodmachen.com** — Vercel project rooted at `/`. Framework: Astro. Requires env var `PUBLIC_CLOUDINARY_CLOUD_NAME` set in project settings (Vercel preview environments need this explicitly — the build will succeed but images will be broken without it).
+
+**rodmachen.com** — Second Vercel project rooted at `home/`. Framework: Other. No build command. Output directory: `.`. DNS: apex A → `76.76.21.21`; `www` CNAME → `cname.vercel-dns.com`. See the plan doc's "Post-merge" section (`docs/plans/edition-rebuild-and-rodmachen-home.md`) for the full DNS setup.
+
+## URL-migration table
+
+Permanent redirects in `vercel.json` (all 301):
+
+| Old path | New path |
+|---|---|
+| `/article/:slug` | `/articles/:slug` |
+| `/review/:slug` | `/reviews/:slug` |
+| `/essay/:slug` | `/articles/:slug` (essays folded into articles) |
+| `/byline/…` | `/bylines/…` |
+| `/p/:slug` | `/newsletter/:slug/` (pre-existing; unchanged) |
+
+## scripts/
+
+One-off content-migration utilities, not part of the site build. All use Node ESM (`*.mjs`) with `cheerio` and `turndown` as dependencies.
+
+| Script | Purpose |
+|---|---|
+| `convert-substack.mjs` | Convert a Substack export (CSV + HTML) to Astro-compatible markdown posts |
+| `fetch-chronicle-bylines.mjs` | Scrape Rod's Austin Chronicle author page and generate byline markdown files |
+| `fetch-cinapse-bylines.mjs` | Fetch Rod's Cinapse posts via WordPress REST API and generate byline markdown files |
+| `fix-byline-bodies.mjs` | Re-fetch article pages to repair missing or placeholder byline body text |
+| `fix-byline-dates.mjs` | Re-fetch article pages to fix `2000-01-01` placeholder dates and rename files |
+| `generate-tags.mjs` | Generate consistent tags for all content using Claude Haiku (requires `ANTHROPIC_API_KEY`) |
+
+## Astro 6 follow-up (blocked)
+
+`astro-cloudinary@1.3.5` peer-depends on `astro ^5.0.0`, blocking the upgrade. There are also ~11 `npm audit` findings waiting on this upgrade.
+
+Unblock path:
+1. Replace `getCldImageUrl` (`src/utils/posts.ts`) and `getCldOgImageUrl` (`src/pages/[category]/[slug].astro`) with hand-rolled Cloudinary URL builders.
+2. Drop the `astro-cloudinary` dependency.
+3. Upgrade to Astro 6.
+
+## Known issues / deferred decisions
+
+- `src/content/posts/a-week-of-tennis.md` is marked `published: false`. It appears to be a partial duplicate of `2014-02-25-neutral-milk-hotel-retro-scenester-adventure.md` (same date/subtitle/tags, malformed link). Rod to decide its fate.
+- `src/content/posts/2015-03-12-sxsw-2015-a-look-back.md` has malformed category YAML — review if it surfaces build warnings.
+- Vercel preview environments require `PUBLIC_CLOUDINARY_CLOUD_NAME` to be set explicitly in project settings or images will be broken on preview deploys.
diff --git a/astro.config.mjs b/astro.config.mjs
index f7b9cec..2654fd9 100644
--- a/astro.config.mjs
+++ b/astro.config.mjs
@@ -1,16 +1,19 @@
 import { defineConfig } from 'astro/config';
 import vercel from '@astrojs/vercel';
+import sitemap from '@astrojs/sitemap';
 import remarkCloudinaryImages from './src/plugins/remark-cloudinary-images.js';
+import remarkDemoteHeadings from './src/plugins/remark-demote-headings.js';
 
 export default defineConfig({
   site: 'https://edition.rodmachen.com',
   trailingSlash: 'always',
   adapter: vercel(),
   output: 'static',
+  integrations: [sitemap()],
   image: {
     service: { entrypoint: 'astro/assets/services/noop' },
   },
   markdown: {
-    remarkPlugins: [remarkCloudinaryImages],
+    remarkPlugins: [remarkCloudinaryImages, remarkDemoteHeadings],
   },
 });
diff --git a/docs/claude-sessions/2026-03-01.md b/docs/claude-sessions/2026-03-01.md
new file mode 100644
index 0000000..0946f3a
--- /dev/null
+++ b/docs/claude-sessions/2026-03-01.md
@@ -0,0 +1,38 @@
+# Claude Session — 2026-03-01
+
+## Project: edition-rodmachen-com
+
+### Topic: DNS Change Recommended by Vercel
+
+Vercel recommended updating the DNS record for `edition.rodmachen.com` from the old A record (`76.76.21.21`) to a new CNAME (`2d7bcae796c69ab2.vercel-dns-017.co...`) as part of their IP range expansion. User confirmed they had an A record (not a CNAME) and will add the new CNAME and remove the old A record in AWS Route 53.
+
+Reviewed `docs/claude-sessions/2026-02-28.md` to find why A record was originally used — the previous session replaced an existing CNAME with the A record. For subdomains, CNAME is the better choice (A records are only required for apex domains).
+
+### Topic: Fix Broken Substack Redirect URLs (slug mismatches)
+
+10 newsletter posts had broken redirects — the `/p/:slug` redirect in `vercel.json` was working correctly (308), but the destination pages returned 404 because the Substack URL slugs didn't match the filenames created during conversion. For example, Substack used `sunday-brunch-with-franklin-and-friends` but the file was named `sunday-brunch-with-franklin-friends`.
+
+**Solution: Added optional `slug` frontmatter support**
+
+1. Added `slug: z.string().optional()` to the posts schema in `src/content.config.ts`
+2. Updated `getPostSlug()` in `src/utils/posts.ts` to prefer `data.slug` over filename-derived slug
+3. Updated all call sites (`[slug].astro`, `index.astro`, `rss.xml.ts`) to pass `post.data` to `getPostSlug()`
+4. Added explicit `slug:` frontmatter to all 10 mismatched posts:
+   - `sunday-brunch-with-franklin-friends` → `sunday-brunch-with-franklin-and-friends`
+   - `italiano-pianoforte` → `italiano-pianoforte-62-miles-and`
+   - `south` → `south-by-and-southwest`
+   - `tennis` → `tennis-tennis-and-more-tennis`
+   - `sxsw-tunes` → `sxsw-tunes-the-rach-and-more-austin`
+   - `new-fiction` → `new-fiction-hot-tv-and-freezing-in`
+   - `hobbits` → `hobbits-tennis-and-old-school-cue`
+   - `french-music` → `french-music-knight-rider-and-arthouse`
+   - `yellowstone` → `yellowstone-debussy-and-the-love`
+   - `barbecue` → `barbecue-x-men-and-the-beths`
+
+Build verified — all 73 pages built successfully with correct URLs.
+
+### Topic: Git Remote Configuration
+
+Repo still had `origin` pointing to `https://github.com/rodmachen/rodmachen.com.git` (old repo). The `edition` remote already pointed to `https://github.com/rodmachen/edition-rodmachen-com.git`. Recommended:
+- `git push edition master` to push to the new repo
+- `git remote set-url origin https://github.com/rodmachen/edition-rodmachen-com.git` to make the new repo the default
diff --git a/docs/implementation/edition-rebuild-and-rodmachen-home/results/step-1.json b/docs/implementation/edition-rebuild-and-rodmachen-home/results/step-1.json
new file mode 100644
index 0000000..7a7f913
--- /dev/null
+++ b/docs/implementation/edition-rebuild-and-rodmachen-home/results/step-1.json
@@ -0,0 +1,20 @@
+{
+  "step": 1,
+  "status": "success",
+  "commits": ["edbd178", "395e284"],
+  "ci_run_url": "https://github.com/rodmachen/edition-rodmachen-com/actions/runs/27396032384",
+  "extracted_slugs_module": true,
+  "test_count": 20,
+  "decisions": [
+    "Extracted pure helpers (getPostSlug, getPostCategory, formatDate, extractFirstImage, getPostsByCategory) into src/utils/slugs.ts to avoid vitest failing on the astro-cloudinary/helpers runtime import in posts.ts. posts.ts now imports from slugs.ts and re-exports, so all call sites remain unchanged.",
+    "Added PUBLIC_CLOUDINARY_CLOUD_NAME to the CI workflow env block — it is a PUBLIC_ prefixed Astro variable (already rendered into HTML for all visitors) so it is safe to include inline. Without it, the build fails when astro-cloudinary generates OG image URLs for post pages.",
+    "Used vitest local-time date constructor new Date(2023, 5, 11) in formatDate test to avoid UTC-to-local day shift that caused a spurious test failure on the initial run.",
+    "Used a generic type parameter on getPostsByCategory in slugs.ts so it accepts the full CollectionEntry shape from posts.ts without importing from astro:content in the pure helpers module."
+  ],
+  "assumptions": [
+    "PUBLIC_CLOUDINARY_CLOUD_NAME (dke4phurv) is not a secret — it is a Cloudinary cloud name already embedded in all rendered page HTML and safe for source control.",
+    "The two pre-existing astro check hints (unused 'excerpt' param in scripts/fetch-cinapse-bylines.mjs, unused 'category' prop in src/layouts/PostLayout.astro) are pre-existing and not caused by this step.",
+    "The four duplicate-id warnings from astro check are caused by modified post files in the working tree (pre-existing unstaged changes) and are not caused by this step."
+  ],
+  "blockers": []
+}
diff --git a/docs/plans/archive/rod-machen-architecture.md b/docs/plans/archive/rod-machen-architecture.md
new file mode 100644
index 0000000..c617b37
--- /dev/null
+++ b/docs/plans/archive/rod-machen-architecture.md
@@ -0,0 +1,310 @@
+> Superseded by edition-rebuild-and-rodmachen-home.md
+
+# Rod Machen Site Ecosystem — Architecture Plan
+
+## Context
+
+Rod's personal web presence is currently split across edition.rodmachen.com (all writing) and a photo portfolio in progress. The goal is to reorganize into a multi-site ecosystem with clear separation of concerns: a personal homepage, a writing hub with styled sections, a dedicated tech/code blog, and a photo portfolio — all using Astro, Vercel, and Cloudinary.
+
+---
+
+## Final Architecture
+
+### Sites & Repos
+
+| Domain | Repo | Purpose |
+|---|---|---|
+| **rodmachen.com** | `rodmachen-com` (new) | Personal homepage/hub — links to all subdomains, about, contact, recent bylines via JSON feed |
+| **edition.rodmachen.com** | `edition-rodmachen-com` (existing) | Writing hub — Newsletter, Articles, Reviews, Bylines, Archive |
+| **code.rodmachen.com** | `code-rodmachen-com` (new) | Tech/code writing (shared on LinkedIn) |
+| **photo.rodmachen.com** | `photo-portfolio` (existing) | Photo portfolio with unlisted album support |
+
+### Key Decisions
+
+- **No shared CSS package** — each site has its own styling
+- **Reviews + Articles stay on edition** at `/reviews/` and `/articles/` with per-section accent colors and layout variations
+- **Bylines stay on edition** — rodmachen.com gets recent bylines via a JSON feed generated at edition build time
+- **Separate repos, one Vercel project per domain** — clean 1:1 mapping
+- **Google Analytics** across all sites
+- **SEO for "The Hangman Chronicles"** handled via page titles, H1, meta description on `/newsletter/` — no subdomain needed
+
+---
+
+## Site Details
+
+### 1. rodmachen.com (Personal Homepage)
+
+**Repo:** `rodmachen-com` (new, minimal Astro static site)
+
+**Pages:**
+- `/` — Hero section + grid cards linking to edition, code, photo subdomains + recent bylines section (5-10 most recent, with publication icons)
+- `/about/` — Canonical about page
+- `/contact/` — Canonical contact page
+
+**Data:**
+- Fetches `bylines-feed.json` from edition.rodmachen.com at build time
+- Vercel deploy hook triggers homepage rebuild when edition deploys (so bylines stay current)
+
+**Design:** Simple, clean personal landing page. Distinct from the writing sites.
+
+---
+
+### 2. edition.rodmachen.com (Writing Hub)
+
+**Repo:** `edition-rodmachen-com` (existing, evolved)
+
+**Section Structure — each section gets its own "sub-homepage":**
+
+| Section | Path | Accent Color | Content |
+|---|---|---|---|
+| Newsletter | `/newsletter/` | #117a65 (teal) | "The Hangman Chronicles" — 13 posts |
+| Articles | `/articles/` | #1a5276 (dark blue) | Long-form writing — 12 posts |
+| Reviews | `/reviews/` | #b9770e (golden) | Arts and food reviews — 7 posts |
+| Bylines | `/bylines/` | #2e4057 (blue-gray) | External publications — 354 links |
+
+**The Big 3 — Section sub-homepages:** Newsletter, Articles, and Reviews are the primary sections. Each gets its own index page that feels like a mini-site:
+- Distinct typography (font family/weight/size) per section
+- Section-specific accent color and header styling
+- Full listing of posts in that section
+- Section-specific card/list layout if desired
+
+**Bylines — visually distinct:** Bylines (`/bylines/`) can share the same page layout/components, but on the edition homepage they are treated separately from the Big 3 — e.g., the Big 3 get prominent grid cards with recent posts, while bylines appear in a smaller, secondary area below (recent bylines list, publication icons, link to full page).
+
+**Typography per section:** Each of the Big 3 gets its own typographic identity:
+
+| Section | Typography direction |
+|---|---|
+| Newsletter | TBD — could be more personal/casual (e.g., a humanist sans-serif or warm serif) |
+| Articles | TBD — classic editorial feel (e.g., a traditional serif like the current Georgia) |
+| Reviews | TBD — could match Articles or go slightly different (e.g., a transitional serif or slab) |
+
+The edition homepage can share typography with Articles/Reviews or have its own neutral base. Specific font choices will be decided during implementation. The `CATEGORY_CONFIG` will be extended with a `fontFamily` (or `typographyPreset`) property so each section's layout can apply its fonts.
+
+**Main homepage (`/`):**
+- **Top area:** Big 3 grid — prominent cards for Newsletter, Articles, Reviews with recent posts from each
+- **Lower area:** Bylines — visually differentiated, showing recent bylines with publication icons and a "View all" link to `/bylines/`
+
+**Shared pages:**
+- `/archive/` — Paginated archive of all content
+- `/topics/` and `/topics/[tag]/` — Tag system across all sections
+- RSS feed
+
+**Build artifact:** Generates `/bylines-feed.json` (public static file) containing recent bylines data for rodmachen.com to consume.
+
+**Changes from current site:**
+- "Essays" category removed; essay content migrated to code.rodmachen.com
+- Section sub-homepages built with per-section typography and styling
+- Homepage redesigned: Big 3 prominent, bylines secondary
+- About/Contact pages redirect to rodmachen.com (or are removed, with links in footer)
+- URL structure change: currently `/article/[slug]/`, will be `/articles/[slug]/` (plural) — redirects needed
+
+**Styling approach:** Extend `CATEGORY_CONFIG` in `src/utils/posts.ts` with typography and layout properties per section. Each section's sub-homepage and post pages apply their own fonts and accent colors. The base layout provides structure; sections override typography via CSS custom properties set at the section level.
+
+---
+
+### 3. code.rodmachen.com (Tech Blog)
+
+**Repo:** `code-rodmachen-com` (new Astro static site)
+
+**Implementation approach:** Start with an MVP focused on styling/design, then build out the Astro blog in a second pass. A bootstrapping brief (below) should be placed in the repo as `docs/project-brief.md` so a Claude session in that repo has full context.
+
+**Pages (target):**
+- `/` — Post listing (simple, clean design for tech content)
+- `/[slug]/` — Individual posts
+- `/topics/` — Tag system
+- RSS feed
+
+**Content:** Single collection (posts). Category is implicitly "code/tech" — no multi-category routing needed.
+
+**Design:** Its own distinct styling suited to tech/code content. Code syntax highlighting, monospace elements, etc.
+
+**Note:** This is the simplest of all the sites. Starts empty, grows as Rod writes tech content.
+
+#### Bootstrapping Brief for code.rodmachen.com
+
+Copy the following into `docs/project-brief.md` in the `code-rodmachen-com` repo to give a fresh Claude session full context:
+
+---
+
+**Project:** code.rodmachen.com — a tech/code blog for Rod Machen
+
+**Part of a larger ecosystem:**
+- `rodmachen.com` — personal homepage/hub
+- `edition.rodmachen.com` — writing hub (newsletter, articles, reviews, bylines)
+- `code.rodmachen.com` — this site (tech/code writing, shared on LinkedIn)
+- `photo.rodmachen.com` — photo portfolio
+
+**Tech stack (must match sibling sites):**
+- Astro 5.x (static output)
+- Vercel deployment (`@astrojs/vercel` adapter)
+- Cloudinary for images (`astro-cloudinary`, cloud name: `dke4phurv`)
+- TypeScript
+- Markdown content with frontmatter
+
+**Reference implementation:** The edition site at `/Users/rodmachen/code/edition-rodmachen-com` is the most mature sibling. Key patterns to reference (but not copy wholesale — this site has its own identity):
+- `astro.config.mjs` — Vercel adapter, static output, trailing slashes, remark plugin for Cloudinary images
+- `src/content.config.ts` — content collection schema using `glob` loader and Zod
+- `src/plugins/remark-cloudinary-images.ts` — transforms markdown images to responsive Cloudinary URLs with srcset
+- `src/layouts/BaseLayout.astro` — HTML head with OG/Twitter meta tags
+- `src/layouts/PostLayout.astro` — post page layout with accent colors via CSS `define:vars`
+- `src/pages/rss.xml.ts` — RSS feed generation with `@astrojs/rss`
+
+**Content schema for this site (simplified from edition):**
+```
+posts collection:
+  title: string (required)
+  subTitle: string (optional)
+  tags: string[] (optional, normalize from string or array)
+  date: Date (required, coerced)
+  published: boolean (optional)
+  thumbnail: string (optional, Cloudinary public ID)
+  slug: string (optional override; default derived from filename minus date prefix)
+```
+
+No `category` or `template` field needed — all posts are implicitly "code/tech".
+
+**URL structure:**
+- `/` — homepage with post listing
+- `/[slug]/` — individual posts (trailing slash)
+- `/topics/` — tag cloud
+- `/topics/[tag]/` — posts filtered by tag
+- `/rss.xml` — RSS feed
+
+**Design direction:**
+- Tech/code focused — should feel distinct from the more editorial edition site
+- Good code block styling with syntax highlighting (consider Astro's built-in Shiki support)
+- Monospace accents where appropriate
+- Clean, readable long-form layout for technical articles
+- Dark mode support would be a natural fit (but not required for MVP)
+- Mobile responsive
+
+**MVP Phase 1 — Styling only:**
+- Set up Astro project with Vercel adapter
+- Create BaseLayout with HTML head, header, footer
+- Create PostLayout with post content styling
+- Design the homepage layout (post list)
+- Style code blocks, headings, body text, links
+- Use 1-2 placeholder/sample posts to develop against
+- No content migration yet, no topics page, no RSS — just the visual foundation
+- Deploy to Vercel to verify
+
+**Phase 2 — Full blog buildout:**
+- Content collection with schema
+- Dynamic routes for posts and topics
+- RSS feed
+- Cloudinary image integration (remark plugin)
+- SEO: sitemap, robots.txt, OG tags
+- Google Analytics
+- Cross-site footer links (to rodmachen.com, edition, photo)
+
+**Cross-site navigation:**
+- Footer should link to rodmachen.com and sibling subdomains
+- Header has a small "Rod Machen" link back to rodmachen.com
+
+**Deployment:**
+- Vercel project: `code-rodmachen-com`
+- Domain: `code.rodmachen.com` (CNAME to `cname.vercel-dns.com`)
+- `site` in astro.config.mjs: `https://code.rodmachen.com`
+- Static output, trailing slashes
+
+---
+
+---
+
+### 4. photo.rodmachen.com (Photo Portfolio)
+
+**Repo:** `photo-portfolio` (existing)
+
+**New feature — Unlisted Albums:**
+- Add `listed: boolean` field (default: `true`) to album YAML schema in `content.config.ts`
+- Albums index page filters to `listed !== false`
+- Unlisted album pages still generated (accessible by direct URL)
+- Add `<meta name="robots" content="noindex, nofollow">` for unlisted albums
+- Exclude unlisted albums from sitemap
+- No authentication — privacy through obscurity (unlinkable URLs)
+
+**Domain:** Configure Vercel custom domain to `photo.rodmachen.com`
+
+---
+
+## DNS Configuration
+
+All at your domain registrar:
+
+```
+rodmachen.com          A      76.76.21.21
+www.rodmachen.com      CNAME  cname.vercel-dns.com
+edition.rodmachen.com  CNAME  cname.vercel-dns.com
+code.rodmachen.com     CNAME  cname.vercel-dns.com
+photo.rodmachen.com    CNAME  cname.vercel-dns.com
+```
+
+Each Vercel project configured with its respective domain. Vercel handles TLS.
+
+---
+
+## Cross-Site Navigation
+
+- Every site's footer links back to rodmachen.com and lists all subdomains
+- rodmachen.com header/grid prominently links to all subdomains
+- This cross-linking helps SEO (link equity flows from hub to subdomains)
+
+---
+
+## Analytics & SEO
+
+**Analytics:** Google Analytics across all sites. Same GA property, configured per-site.
+
+**SEO per site:**
+- Each site gets `@astrojs/sitemap` integration
+- Each site has its own `robots.txt`
+- RSS feeds on all writing sites (edition, code)
+- Open Graph meta tags on all pages (already in BaseLayout pattern)
+- `<title>` and `<meta description>` optimized per section
+- Newsletter page: `<title>The Hangman Chronicles | Newsletter | Edition</title>` + H1 "The Hangman Chronicles" for search discoverability
+
+---
+
+## Migration Plan (High-Level Phases)
+
+These phases will each get their own detailed implementation plan in their respective repos.
+
+### Phase 1: Enhance edition.rodmachen.com
+- Rename "Essays" to "Technology" conceptually; migrate any essay content to code site later
+- Build section sub-homepages with per-section styling at `/newsletter/`, `/articles/`, `/reviews/`
+- Ensure URL redirects from old paths (e.g., `/article/` -> `/articles/` if pluralizing)
+- Generate `bylines-feed.json` at build time
+- Add Google Analytics
+- Add cross-site footer links
+
+### Phase 2: Build rodmachen.com
+- New Astro project in `rodmachen-com` repo
+- Landing page with grid cards for each subdomain
+- Bylines section consuming edition's JSON feed
+- About and contact pages
+- Deploy to Vercel, configure domain
+- Set up deploy hook triggered by edition builds
+
+### Phase 3: Build code.rodmachen.com
+- Copy `docs/project-brief.md` from the bootstrapping brief above into the repo
+- **Phase 3a (MVP):** Astro project setup + styling foundation — layouts, typography, code block styling, placeholder posts. Deploy to Vercel.
+- **Phase 3b (Full buildout):** Content collection, dynamic routes, topics, RSS, Cloudinary, analytics, cross-site links. Planned separately in that repo.
+
+### Phase 4: Enhance photo.rodmachen.com
+- Add `listed` field to album schema
+- Add noindex meta for unlisted albums
+- Configure photo.rodmachen.com domain on Vercel
+- Add cross-site navigation
+
+### Phase 5: Cross-linking & cleanup
+- Verify all cross-site links work
+- Submit sitemaps to Google Search Console
+- Test RSS feeds
+- Remove/redirect about and contact from edition to rodmachen.com
+- Verify analytics tracking across all sites
+
+---
+
+## What This Plan Does NOT Cover
+
+Each site's detailed implementation (components, page layouts, specific styling) will be planned separately in its respective repo. This plan establishes the overall architecture, site boundaries, data flow, and migration sequence.
\ No newline at end of file
diff --git a/docs/plans/edition-rebuild-and-rodmachen-home.md b/docs/plans/edition-rebuild-and-rodmachen-home.md
new file mode 100644
index 0000000..d2fbddc
--- /dev/null
+++ b/docs/plans/edition-rebuild-and-rodmachen-home.md
@@ -0,0 +1,225 @@
+# Edition Rebuild + rodmachen.com Home Page
+
+**Plan filename (confirmed at Step 0):** `edition-rebuild-and-rodmachen-home.md`
+
+## Context
+
+This repo (edition.rodmachen.com, an Astro 5 static blog on Vercel) was set aside months ago mid-architecture. Rod wants to finish it with a near-total rebuild of the frontend while keeping the content and Astro stack. Confirmed decisions:
+
+- **edition.rodmachen.com**: home page with the "Big 3" sections prominent — Newsletter ("The Hangman Chronicles"), Articles, Reviews — bylines as a visually secondary area, Archive accessible but de-emphasized. Section sub-homepages with per-section identity. Dark mode + excellent mobile. High design quality via the frontend-design skill.
+- **Essays category folds into Articles.** (Validated: zero posts currently have `category: essay` — this is config/schema/redirect work only.)
+- **URL structure moves to plural** (`/articles/[slug]/`, `/reviews/[slug]/`, `/bylines/`) to match section index pages, with permanent redirects from singular paths. Only ~19 URLs move; the high-value `/p/:slug` → `/newsletter/` redirects are unaffected.
+- **rodmachen.com lives in this repo as a plain static HTML/CSS page** (user's explicit choice — not an Astro site) in a `home/` subfolder, deployed as a second Vercel project rooted there. Its own distinct look. Links: edition.rodmachen.com, code.rodmachen.com, photo.rodmachen.com, Austin Chronicle + Cinapse author pages, social accounts.
+- **Design process**: an early checkpoint step produces 2–3 static HTML mockups for edition and 2 for rodmachen.com; Rod picks directions before the real build.
+- **Claude Design**: after the design system stabilizes, sync tokens/components to a claude.ai/design project via DesignSync.
+- **Repo cleanup + dependency updates**: commit/resolve pending working-tree changes, archive completed plan docs, bump deps.
+
+### Key constraints found during planning
+
+- **Astro 6 is blocked**: `astro-cloudinary@1.3.5` peer-depends on `astro ^5.0.0`. Bump within v5 (astro 5.18.x, @astrojs/vercel 8.2.x, @astrojs/rss 4.0.x). Follow-up (out of scope): replace the two `astro-cloudinary/helpers` calls (`getCldImageUrl` in `src/utils/posts.ts`, `getCldOgImageUrl` in `src/pages/[category]/[slug].astro`) with hand-rolled Cloudinary URLs, then take Astro 6.
+- **`published` flag is never filtered** anywhere in `src/pages` — the untracked draft `src/content/posts/a-week-of-tennis.md` would ship as-is. It also looks like a partial duplicate of `2014-02-25-neutral-milk-hotel-retro-scenester-adventure.md` (same date/subtitle/tags, malformed link) — flag to Rod in the PR.
+- All post hrefs flow through `postToListItem()` / `getPostSlug()` / `getPostCategory()` in `src/utils/posts.ts`, so the URL change is centralized.
+- No tests or CI exist — per workflow rules, adding them is the first implementation step.
+- Theme FOUC risk: dark mode needs a render-blocking inline script in `BaseLayout.astro` head, not a deferred component.
+
+### Critical files
+
+- `src/utils/posts.ts` — CATEGORY_CONFIG, slug/href helpers (Steps 4–6)
+- `src/content.config.ts` — schema (essay removal, published flag)
+- `src/pages/[category]/[slug].astro`, `src/pages/[category]/index.astro` — URL structure + section pages
+- `src/styles/global.css` — token system, dark mode
+- `vercel.json` — redirect coverage
+- `home/` — new static rodmachen.com page
+
+---
+
+## Step 0: Branch, rename, and first commit
+
+Sonnet / low, tests-alongside (no tests), context-clear: no.
+
+1. Confirm plan filename `edition-rebuild-and-rodmachen-home.md` with Rod.
+2. Create branch `feature/edition-rebuild`.
+3. Rename this plan file to the confirmed name; commit it as the sole change.
+4. Push and open the PR immediately (not draft).
+
+- **Verify:** `git branch --show-current` prints `feature/edition-rebuild`; PR exists via `gh pr view`.
+
+## Step 1: Test framework + CI ✅
+
+- **Model/effort:** Sonnet / medium — (a) low ambiguity (standard vitest + Actions setup), (b) minor third-party wrinkle: vitest importing `posts.ts` may trip on the runtime `astro-cloudinary/helpers` import (the `astro:content` import is type-only and strips fine) — if so, extract pure helpers to `src/utils/slugs.ts`, (c) low compounding risk, (d) easy to verify. Routine implementation.
+- **Context-clear:** no
+- **Mode:** tests-alongside (this step creates the test infrastructure)
+- **Files:** `package.json` (vitest, `test`/`check` scripts), `vitest.config.ts`, `src/utils/posts.test.ts`, `.github/workflows/ci.yml`
+
+Unit tests for the pure helpers in `src/utils/posts.ts` (`getPostSlug`, `getPostCategory`, `formatDate`, `extractFirstImage`, `getPostsByCategory`). CI on push/PR: `npm ci`, `npx astro check` (add `@astrojs/check` + `typescript` devDeps if needed), `npx vitest run`, `npm run build`. Node 22.
+
+- **Verify:** `npx vitest run` and `npm run build` green locally; `gh run watch` shows CI passing after push.
+
+## Step 2: Commit pending changes + docs cleanup ✅
+
+- **Model/effort:** Sonnet / low — (a) no ambiguity, (b) no third-party internals, (c) low risk, (d) trivially verifiable. Pure housekeeping.
+- **Context-clear:** no
+- **Mode:** tests-alongside (no new tests)
+- **Files:** `.gitignore`, 4 modified post files (article→review recategorizations), `src/content/posts/a-week-of-tennis.md`, `docs/claude-sessions/2026-03-01.md`, `docs/plans/` reorganization
+
+1. Commit the `.gitignore` change, the 4 recategorized posts, and the session doc.
+2. Add `published: false` to `a-week-of-tennis.md` frontmatter and commit (draft filtering arrives in Step 4); note the likely-duplicate question in the PR description.
+3. Create `docs/plans/archive/`; `git mv` completed plan docs into it; move the superseded `rod-machen-architecture.md` there too with a "Superseded by edition-rebuild-and-rodmachen-home.md" note at top.
+
+- **Verify:** `git status --short` is clean; `npm run build` green.
+
+## Step 3: Dependency bump (within Astro 5) ✅
+
+- **Model/effort:** Sonnet / medium — (a) low ambiguity, (b) moderate third-party risk: minor-version Astro/adapter bumps can shift build behavior, and the custom remark Cloudinary plugin must survive, (c) moderate compounding risk if breakage goes unnoticed, (d) verifiable via build output inspection. Close call vs low; medium for the plugin check.
+- **Context-clear:** no
+- **Mode:** tests-alongside
+- **Files:** `package.json`, `package-lock.json`
+
+Bump `astro`, `@astrojs/vercel`, `@astrojs/rss` to latest v5-compatible versions. Do NOT move to Astro 6 (astro-cloudinary peer cap). Fix `package.json` `name` to `edition-rodmachen-com`. Keep `cheerio`/`turndown` (used by `scripts/*.mjs`). Run `npm audit` and report.
+
+- **Verify:** `npm run build`, `npx vitest run`, `npx astro check` green; a built post page in `dist/` still contains Cloudinary `<figure>`/srcset markup.
+
+## Step 4: Content model — remove essay, add draft filtering ✅
+
+- **Model/effort:** Sonnet / medium — (a) low ambiguity (decisions made), (b) no unfamiliar internals, (c) moderate compounding risk: every page reads this model, (d) verifiable by build output + tests. TDD makes this safe at medium.
+- **Context-clear:** no
+- **Mode:** TDD (data transformation/mapping)
+- **Files:** `src/content.config.ts`, `src/utils/posts.ts`, `src/utils/posts.test.ts`, all `getCollection('posts')` call sites (`src/pages/index.astro`, `[category]/[slug].astro`, `archive/[...page].astro`, `topics/index.astro`, `topics/[tag].astro`, `rss.xml.ts`)
+
+Drop `essay` from schema enum and `CATEGORY_CONFIG`. Add `path` field per category (`article` → `articles`, `review` → `reviews`, `newsletter` → `newsletter`, `byline` → `bylines`). Add `getPublishedPosts()` filtering `published === false`; use it at every call site. Write failing tests first for the path mapping and draft filter.
+
+- **Verify:** `npx vitest run` green; after `npm run build`, no `a-week-of-tennis` page and no `dist/essay/` directory.
+
+## Step 5: URL structure + redirects ✅
+
+- **Model/effort:** Sonnet / medium — (a) low ambiguity, (b) Vercel redirect semantics with `trailingSlash: 'always'` need care, (c) high compounding risk if old URLs 404 (SEO), (d) verifiable via dist inspection + redirect checks on preview deploy. Medium with TDD on href generation.
+- **Context-clear:** no
+- **Mode:** TDD (href/slug mapping logic)
+- **Files:** `src/pages/[category]/[slug].astro`, `src/utils/posts.ts` + tests, `src/pages/byline/` → `src/pages/bylines/`, `vercel.json`
+
+Generate routes from `CATEGORY_CONFIG[].path` (plural). Move byline index to `/bylines/`. Add permanent redirects: `/article/:path*` → `/articles/:path*`, `/review/:path*` → `/reviews/:path*`, `/essay/:path*` → `/articles/:path*`, `/byline/:path*` → `/bylines/:path*`. Confirm `/p/:slug` → `/newsletter/:slug/` still intact.
+
+- **Verify:** `npm run build`; `dist/articles/`, `dist/reviews/`, `dist/newsletter/` contain post folders; no `dist/article/` or `dist/review/`; `dist/rss.xml` contains no `/article/` hrefs; vitest green. On the Vercel preview deploy, `curl -sI` an old singular URL → 301/308 to plural.
+
+## Step 6: Design mockups — USER CHECKPOINT ✅
+
+- **Model/effort:** Opus / high — (a) high ambiguity: open-ended visual design, (b) n/a, (c) high leverage: everything downstream builds on the chosen direction, (d) correctness is subjective — needs the strongest design model. Use the **frontend-design skill**.
+- **Context-clear:** **yes** — new chapter; prior dependency/refactor output is noise for design work.
+- **Mode:** tests-alongside (no tests — static mockups)
+- **Files:** `docs/design/mockups/edition-option-{a,b,c}.html`, `docs/design/mockups/rodmachen-home-{a,b}.html` (single-file HTML with inline CSS; never shipped — not under `src/pages/`)
+
+Each edition mockup shows home (Big 3 prominent, bylines secondary, archive de-emphasized), one section index, one post page, with a working light/dark toggle. Two distinct one-page looks for rodmachen.com. **STOP for Rod's choice** of both directions, and collect: social account list, exact Austin Chronicle and Cinapse author-page URLs.
+
+- **Verify:** each file opens in a browser and renders sensibly at 375px and 1280px; Rod has picked a direction for each site.
+
+## Step 7: Design tokens + layout shell (dark mode) ✅
+
+- **Model/effort:** Opus / high — (a) translating a mockup into a token system involves judgment, (b) FOUC-free theme bootstrapping is fiddly, (c) very high compounding risk: every later step consumes these tokens, (d) visual correctness is hard to auto-verify.
+- **Context-clear:** yes — start of the build-out chapter; only the chosen mockup matters.
+- **Mode:** tests-alongside
+- **Files:** `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, new `src/components/ThemeToggle.astro`, `src/utils/posts.ts` (accent values aligned to tokens)
+
+Full token rework from the chosen mockup: color scheme custom properties with `prefers-color-scheme` defaults + `[data-theme]` overrides; typography scale; per-section accent tokens with light/dark variants. BaseLayout gets a render-blocking inline theme script (localStorage) and `meta name="theme-color"`. Header nav: Newsletter / Articles / Reviews / Bylines + theme toggle, usable at 375px.
+
+- **Verify:** toggle persists across reloads; no white flash on hard reload in dark mode (DevTools throttling check); `npm run build` + vitest green.
+
+## Step 8: Home page rebuild ✅
+
+- **Model/effort:** Opus / high — (a) the flagship page; layout judgment within the chosen direction, (b) low, (c) moderate, (d) visual quality hard to verify mechanically. Use the frontend-design skill.
+- **Context-clear:** no
+- **Mode:** tests-alongside
+- **Files:** `src/pages/index.astro`, possibly `src/components/PostList.astro` / `PostCardList.astro`
+
+Big 3 as prominent blocks with 3–5 recent posts each; bylines as a visually secondary strip; archive + topics as quiet footer-level links (not equal cards).
+
+- **Verify:** `npm run build` green; visual check both themes at 375/768/1280px.
+
+## Step 9: Section sub-homepages ✅
+
+- **Model/effort:** Sonnet / medium — (a) low ambiguity once tokens + home exist (pattern application), (b) low, (c) low, (d) build-verifiable. Close call vs Opus/high: per-section identity is design work, but the system from Steps 6–8 constrains it.
+- **Context-clear:** no
+- **Mode:** tests-alongside
+- **Files:** `src/pages/[category]/index.astro` (replaces the current 301 stub), reusing `PostList`/`PostCardList`
+
+Real section indexes for `/newsletter/`, `/articles/`, `/reviews/` with per-section accent/typography from `CATEGORY_CONFIG`. Newsletter page titles/H1 carry "The Hangman Chronicles" for SEO.
+
+- **Verify:** `dist/newsletter/index.html`, `dist/articles/index.html`, `dist/reviews/index.html` exist and render section-distinct styling in both themes.
+
+## Step 10: Post pages, bylines, archive, topics, about/contact restyle ✅
+
+- **Model/effort:** Sonnet / medium — (a) low: applying the established system, (b) one watch-item: Cloudinary figures and `getCldOgImageUrl` OG images must survive restyling, (c) moderate breadth, (d) build + spot-check verifiable.
+- **Context-clear:** no
+- **Mode:** tests-alongside
+- **Files:** `src/layouts/PostLayout.astro`, `src/pages/bylines/index.astro`, `src/pages/archive/[...page].astro`, `src/pages/topics/index.astro`, `src/pages/topics/[tag].astro`, `src/pages/about.astro`, `src/pages/contact.astro`
+
+- **Verify:** build green; spot-check in both themes: a newsletter post with images (Cloudinary figures intact), a review, archive page 2, a tag page; OG meta tags present on a post page.
+
+## Step 11: Polish + design/accessibility audit ✅
+
+- **Model/effort:** Opus / high — (a) audit findings require judgment to triage, (b) low, (c) low, (d) accessibility/contrast correctness benefits from the strongest review. Run the **web-design-guidelines skill**.
+- **Context-clear:** no
+- **Mode:** tests-alongside
+- **Files:** as found by the audit; optionally add `@astrojs/sitemap` to `astro.config.mjs`
+
+Fix contrast/focus/touch-target issues in both themes; confirm RSS hrefs, OG/Twitter meta. Add sitemap integration.
+
+- **Verify:** audit findings addressed or explicitly waived; `npx vitest run`, `npx astro check`, `npm run build` green; `dist/sitemap-index.xml` exists if sitemap added.
+
+## Step 12: rodmachen.com static page ✅
+
+- **Model/effort:** Opus / high — (a) standalone visual design (own distinct look), (b) none, (c) low, (d) subjective quality. Use the frontend-design skill, building from the chosen Step 6 mockup.
+- **Context-clear:** yes — distinct site, distinct design context.
+- **Mode:** tests-alongside (no JS to test; plain HTML/CSS)
+- **Files:** `home/index.html`, `home/styles.css`, `home/vercel.json` (cleanUrls, cache headers), any assets under `home/`
+
+Plain HTML/CSS, no build step. Links: edition.rodmachen.com, code.rodmachen.com, photo.rodmachen.com, Austin Chronicle + Cinapse author pages, social accounts (collected at Step 6). Dark mode via `prefers-color-scheme`. Mobile-first.
+
+- **Verify:** `open home/index.html` renders correctly at 375px and 1280px in both schemes; all links resolve (curl each external URL → 200).
+
+## Step 13: Claude Design sync ✅
+
+- **Model/effort:** Sonnet / medium — (a) low ambiguity, (b) DesignSync flow has its own guardrails (list → finalize_plan → write), (c) low, (d) verifiable in the claude.ai/design UI.
+- **Context-clear:** no
+- **Mode:** tests-alongside (no tests)
+- **Files:** none in-repo (or a small `design-system/` export bundle if the /design-sync flow requires one)
+
+Sync the stabilized tokens (from `src/styles/global.css`) and component patterns to a claude.ai/design design-system project via the DesignSync tool (`list_projects` → create if needed → `finalize_plan` → `write_files`).
+
+- **Verify:** sync completes; token/component cards visible in the claude.ai/design project.
+
+## Step 14: README + PR description final pass ✅
+
+- **Model/effort:** Sonnet / low — (a–d) all low; documentation.
+- **Context-clear:** no
+- **Mode:** tests-alongside (no tests)
+- **Files:** `README.md`
+
+Document the two-site repo layout (`/` = edition Astro app, `home/` = rodmachen.com static page), dev/test/CI commands, deployment notes, scripts/ provenance, the Astro 6 follow-up, and the URL-migration table. Update the PR description checklist.
+
+- **Verify:** CI green on the PR; README renders correctly on GitHub.
+
+## Step 15: Fix review feedback
+
+- **Model/effort:** Sonnet / medium — scope depends on findings; default for review follow-up.
+- **Context-clear:** no
+- **Mode:** tests-alongside (update tests as findings require)
+
+Run a code review (e.g. /code-review) on the PR; implement actionable findings on the same branch; commit as "Fix review feedback: <summary>" and push.
+
+- **Verify:** feedback commit pushed; CI green.
+
+---
+
+## Post-merge: deployment + DNS (manual, with Rod)
+
+Not a numbered implementation step — requires Vercel dashboard/CLI and registrar access, performed after merge.
+
+1. Create a second Vercel project rooted at `home/` (framework "Other", no build command, output directory `.`); assign `rodmachen.com` + `www.rodmachen.com`. Optionally set Ignored Build Step on both projects so edits to one folder don't rebuild the other.
+2. DNS at registrar: apex A → `76.76.21.21`; `www` CNAME → `cname.vercel-dns.com`. (`edition` CNAME already in place.)
+3. **Verify:** `curl -sI https://rodmachen.com` → 200 with the new page; `curl -sI https://edition.rodmachen.com/article/<old-slug>/` → 301/308 to `/articles/...`; a `/p/:slug` newsletter redirect still works; both themes render on mobile.
+
+## Out of scope (recorded follow-ups)
+
+- **Astro 6 upgrade**: blocked by `astro-cloudinary` peer deps. Path: replace `getCldImageUrl`/`getCldOgImageUrl` with hand-rolled Cloudinary URL builders, drop the dependency, then upgrade.
+- code.rodmachen.com and photo.rodmachen.com changes live in their own repos.
+- Resolution of the `a-week-of-tennis.md` draft content (kept as `published: false`; Rod decides its fate later).
diff --git a/home/index.html b/home/index.html
new file mode 100644
index 0000000..d0b6695
--- /dev/null
+++ b/home/index.html
@@ -0,0 +1,106 @@
+<!DOCTYPE html>
+<!--
+  rodmachen.com — "The Calling Card": a refined, dark editorial hub.
+  High-contrast Bodoni Moda nameplate over Hanken Grotesk, warm amber accent,
+  generous negative space, destinations as a precise numbered index.
+  Dark by default via prefers-color-scheme, with a light scheme variant.
+  Plain HTML/CSS — no build step, no JavaScript.
+-->
+<html lang="en">
+<head>
+<meta charset="utf-8">
+<meta name="viewport" content="width=device-width, initial-scale=1">
+<title>Rod Machen — Writer in Austin, Texas</title>
+<meta name="description" content="Rod Machen — writer in Austin, Texas, on film, TV, music, food, and culture. The front door to the publication, the code, the photographs, and bylines elsewhere.">
+<meta name="author" content="Rod Machen">
+<meta name="theme-color" content="#0f0e0c" media="(prefers-color-scheme: dark)">
+<meta name="theme-color" content="#f4efe6" media="(prefers-color-scheme: light)">
+<link rel="canonical" href="https://rodmachen.com/">
+
+<!-- Open Graph / Twitter -->
+<meta property="og:type" content="website">
+<meta property="og:title" content="Rod Machen">
+<meta property="og:description" content="Writer in Austin, Texas — film, TV, music, food, and culture. The front door to the publication, the code, and the photographs.">
+<meta property="og:url" content="https://rodmachen.com/">
+<meta property="og:site_name" content="Rod Machen">
+<meta name="twitter:card" content="summary">
+<meta name="twitter:title" content="Rod Machen">
+<meta name="twitter:description" content="Writer in Austin, Texas — film, TV, music, food, and culture.">
+
+<!-- Favicon: amber serif monogram on the dark stationery ground -->
+<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%230f0e0c'/%3E%3Ctext x='32' y='45' font-family='Georgia,serif' font-size='38' font-weight='600' fill='%23e0a23c' text-anchor='middle'%3ER%3C/text%3E%3C/svg%3E">
+
+<link rel="preconnect" href="https://fonts.googleapis.com">
+<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
+<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..700&family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
+<link rel="stylesheet" href="/styles.css">
+</head>
+<body>
+<a class="skip" href="#destinations">Skip to destinations</a>
+<main class="shell">
+  <header class="masthead">
+    <p class="eyebrow">Austin, Texas</p>
+    <h1 class="name">Rod<span class="last">Machen</span></h1>
+    <p class="tagline">Writer, editor &amp; engineering manager.</p>
+    <p class="bio">I write about <b>film, TV, music, food, and culture</b> — and I build software and the teams that ship it. This is the front door to everything: the publication, the code, the photographs, and the work I&rsquo;ve filed elsewhere.</p>
+  </header>
+
+  <nav class="block" aria-labelledby="dest-label" id="destinations">
+    <h2 class="lab" id="dest-label">Destinations</h2>
+    <div class="sites">
+      <a class="site" href="https://edition.rodmachen.com">
+        <span class="idx" aria-hidden="true">01</span>
+        <span class="main">
+          <span class="t">The Edition</span>
+          <span class="d">Ten years of newsletters, criticism &amp; essays.</span>
+        </span>
+        <span class="host">edition.rodmachen.com</span>
+        <span class="arr" aria-hidden="true">&#8599;</span>
+      </a>
+      <a class="site" href="https://code.rodmachen.com">
+        <span class="idx" aria-hidden="true">02</span>
+        <span class="main">
+          <span class="t">Code</span>
+          <span class="d">Projects, experiments &amp; engineering notes.</span>
+        </span>
+        <span class="host">code.rodmachen.com</span>
+        <span class="arr" aria-hidden="true">&#8599;</span>
+      </a>
+      <a class="site" href="https://photo.rodmachen.com">
+        <span class="idx" aria-hidden="true">03</span>
+        <span class="main">
+          <span class="t">Photographs</span>
+          <span class="d">A standing gallery from Austin and the road.</span>
+        </span>
+        <span class="host">photo.rodmachen.com</span>
+        <span class="arr" aria-hidden="true">&#8599;</span>
+      </a>
+    </div>
+  </nav>
+
+  <div class="cols">
+    <section aria-labelledby="bylines-label">
+      <h2 class="lab lab--flush" id="bylines-label">Bylines</h2>
+      <div class="chips">
+        <a class="chip" href="https://www.austinchronicle.com/author/rod-machen/">Austin Chronicle <span class="pub">author page</span></a>
+        <a class="chip" href="https://cinapse.net/author/rod/">Cinapse <span class="pub">film reviews</span></a>
+      </div>
+    </section>
+    <section aria-labelledby="elsewhere-label">
+      <h2 class="lab lab--flush" id="elsewhere-label">Elsewhere</h2>
+      <div class="chips">
+        <a class="chip" href="https://www.instagram.com/rod.machen.writer" rel="me">Instagram</a>
+        <a class="chip" href="https://bsky.app/profile/rodmachen.bsky.social" rel="me">Bluesky</a>
+        <a class="chip" href="https://www.facebook.com/rod.machen.writer/" rel="me">Facebook</a>
+      </div>
+    </section>
+  </div>
+</main>
+<footer>
+  <div class="inner">
+    <span>&copy; 2026 Rod Machen</span>
+    <span><a href="mailto:rod@rodmachen.com">rod@rodmachen.com</a></span>
+  </div>
+</footer>
+</body>
+</html>
diff --git a/home/styles.css b/home/styles.css
new file mode 100644
index 0000000..cbe2ebf
--- /dev/null
+++ b/home/styles.css
@@ -0,0 +1,252 @@
+/* rodmachen.com — "The Calling Card"
+   Dark editorial hub. Bodoni Moda nameplate over Hanken Grotesk, warm amber accent.
+   Dark by default; light variant via prefers-color-scheme. */
+
+:root {
+  --bg: #0f0e0c;
+  --bg-2: #16140f;
+  --ink: #f2ece0;
+  --ink-soft: #9c9384;
+  --amber: #e0a23c;
+  --amber-2: #c98729;
+  --amber-contrast: #0f0e0c;
+  --line: #2a261e;
+  --line-2: #3a342a;
+  --display: 'Bodoni Moda', Georgia, 'Times New Roman', serif;
+  --sans: 'Hanken Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif;
+}
+
+@media (prefers-color-scheme: light) {
+  :root {
+    --bg: #f4efe6;
+    --bg-2: #ece4d4;
+    --ink: #1a1712;
+    --ink-soft: #6c6253;
+    --amber: #a9711b;
+    --amber-2: #8c5d12;
+    --amber-contrast: #f4efe6;
+    --line: #ddd2bd;
+    --line-2: #cbbfa4;
+  }
+}
+
+*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
+
+html { scroll-behavior: smooth; }
+@media (prefers-reduced-motion: reduce) {
+  html { scroll-behavior: auto; }
+  *, *::before, *::after { animation: none !important; transition: none !important; }
+}
+
+body {
+  background: var(--bg);
+  color: var(--ink);
+  font-family: var(--sans);
+  font-size: 17px;
+  line-height: 1.6;
+  -webkit-font-smoothing: antialiased;
+  text-rendering: optimizeLegibility;
+  min-height: 100vh;
+  display: flex;
+  flex-direction: column;
+  background-image: radial-gradient(ellipse 80% 50% at 50% -8%, rgba(224, 162, 60, .10), transparent 60%);
+  background-attachment: fixed;
+}
+
+a { color: inherit; text-decoration: none; }
+
+:focus-visible {
+  outline: 2px solid var(--amber);
+  outline-offset: 3px;
+  border-radius: 2px;
+}
+
+/* Skip link */
+.skip {
+  position: absolute;
+  left: -9999px;
+  top: 0;
+  z-index: 10;
+  background: var(--amber);
+  color: var(--amber-contrast);
+  padding: 10px 18px;
+  font-weight: 600;
+  border-radius: 0 0 6px 0;
+}
+.skip:focus { left: 0; }
+
+.shell {
+  flex: 1;
+  max-width: 920px;
+  width: 100%;
+  margin: 0 auto;
+  padding: 54px 28px 40px;
+  display: flex;
+  flex-direction: column;
+}
+
+/* ---- Masthead ---- */
+.masthead { animation: rise .7s cubic-bezier(.2, .7, .2, 1) both; }
+
+.eyebrow {
+  font-weight: 700;
+  font-size: 12px;
+  letter-spacing: .32em;
+  text-transform: uppercase;
+  color: var(--amber);
+  display: flex;
+  align-items: center;
+  gap: 12px;
+}
+.eyebrow::after { content: ""; flex: 1; height: 1px; background: var(--line-2); }
+
+.name {
+  font-family: var(--display);
+  font-weight: 500;
+  font-size: clamp(64px, 16vw, 168px);
+  line-height: .86;
+  letter-spacing: -.02em;
+  margin: 22px 0 0;
+}
+.name .last {
+  display: block;
+  font-style: italic;
+  font-weight: 600;
+  color: var(--amber);
+}
+
+.tagline {
+  font-family: var(--display);
+  font-size: clamp(19px, 3vw, 26px);
+  font-style: italic;
+  color: var(--ink-soft);
+  max-width: 32ch;
+  margin-top: 24px;
+  line-height: 1.3;
+}
+
+.bio {
+  max-width: 54ch;
+  margin-top: 18px;
+  color: var(--ink-soft);
+  font-size: 16.5px;
+}
+.bio b { color: var(--ink); font-weight: 600; }
+
+/* ---- Section labels ---- */
+.lab {
+  font-weight: 700;
+  font-size: 11px;
+  letter-spacing: .22em;
+  text-transform: uppercase;
+  color: var(--ink-soft);
+  margin: 48px 0 4px;
+  display: flex;
+  align-items: center;
+  gap: 12px;
+}
+.lab::after { content: ""; flex: 1; height: 1px; background: var(--line); }
+.lab--flush { margin-top: 0; }
+
+/* ---- Destinations index ---- */
+.block { animation: rise .7s cubic-bezier(.2, .7, .2, 1) .1s both; }
+
+.sites { display: grid; grid-template-columns: 1fr; }
+
+.site {
+  display: flex;
+  align-items: baseline;
+  gap: 18px;
+  padding: 20px 4px;
+  border-bottom: 1px solid var(--line);
+  transition: padding-left .2s ease, border-color .2s ease;
+  position: relative;
+}
+.site:hover, .site:focus-visible { padding-left: 16px; border-color: var(--line-2); }
+
+.site .idx {
+  font-family: var(--display);
+  font-size: 14px;
+  color: var(--amber);
+  width: 34px;
+  flex: none;
+}
+.site .main { flex: 1; min-width: 0; }
+.site .main .t {
+  display: block;
+  font-family: var(--display);
+  font-size: clamp(24px, 4.5vw, 34px);
+  font-weight: 600;
+  line-height: 1;
+  letter-spacing: -.01em;
+}
+.site .main .d { display: block; color: var(--ink-soft); font-size: 15px; margin-top: 5px; }
+
+.site .host {
+  font-weight: 600;
+  font-size: 13px;
+  letter-spacing: .02em;
+  color: var(--ink-soft);
+  white-space: nowrap;
+}
+.site .arr { font-size: 20px; color: var(--amber); transition: transform .2s ease; flex: none; }
+.site:hover .arr, .site:focus-visible .arr { transform: translate(4px, -4px); }
+
+@media (max-width: 560px) {
+  .site .host { display: none; }
+}
+
+/* ---- Secondary: bylines + social ---- */
+.cols {
+  display: grid;
+  grid-template-columns: 1fr;
+  gap: 34px;
+  margin-top: 46px;
+  animation: rise .7s cubic-bezier(.2, .7, .2, 1) .2s both;
+}
+@media (min-width: 720px) { .cols { grid-template-columns: 1fr 1fr; } }
+
+.chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 14px; }
+
+.chip {
+  display: inline-flex;
+  align-items: center;
+  gap: 8px;
+  min-height: 44px;
+  border: 1px solid var(--line-2);
+  border-radius: 40px;
+  padding: 9px 16px;
+  font-weight: 600;
+  font-size: 14px;
+  color: var(--ink);
+  transition: background-color .18s ease, color .18s ease, border-color .18s ease;
+}
+.chip:hover, .chip:focus-visible {
+  background: var(--amber);
+  color: var(--amber-contrast);
+  border-color: var(--amber);
+}
+.chip .pub { color: var(--ink-soft); font-weight: 500; font-size: 12px; }
+.chip:hover .pub, .chip:focus-visible .pub { color: var(--amber-contrast); }
+
+/* ---- Footer ---- */
+footer { border-top: 1px solid var(--line); margin-top: 8px; }
+footer .inner {
+  max-width: 920px;
+  margin: 0 auto;
+  padding: 26px 28px;
+  display: flex;
+  justify-content: space-between;
+  flex-wrap: wrap;
+  gap: 10px;
+  font-size: 13px;
+  color: var(--ink-soft);
+}
+footer a { transition: color .18s ease; }
+footer a:hover, footer a:focus-visible { color: var(--amber); }
+
+/* ---- Motion ---- */
+@keyframes rise {
+  from { opacity: 0; transform: translateY(14px); }
+  to { opacity: 1; transform: none; }
+}
diff --git a/home/vercel.json b/home/vercel.json
new file mode 100644
index 0000000..a58ed5a
--- /dev/null
+++ b/home/vercel.json
@@ -0,0 +1,25 @@
+{
+  "$schema": "https://openapi.vercel.sh/vercel.json",
+  "cleanUrls": true,
+  "trailingSlash": false,
+  "headers": [
+    {
+      "source": "/styles.css",
+      "headers": [
+        { "key": "Cache-Control", "value": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" }
+      ]
+    },
+    {
+      "source": "/(.*)\\.html",
+      "headers": [
+        { "key": "Cache-Control", "value": "public, max-age=0, s-maxage=600, stale-while-revalidate=86400" }
+      ]
+    },
+    {
+      "source": "/",
+      "headers": [
+        { "key": "Cache-Control", "value": "public, max-age=0, s-maxage=600, stale-while-revalidate=86400" }
+      ]
+    }
+  ]
+}
diff --git a/package.json b/package.json
index 63d28cc..caa26e4 100644
--- a/package.json
+++ b/package.json
@@ -1,22 +1,28 @@
 {
-  "name": "rodmachen.com",
+  "name": "edition-rodmachen-com",
   "type": "module",
   "version": "1.0.0",
   "scripts": {
     "dev": "astro dev",
     "build": "astro build",
     "preview": "astro preview",
-    "astro": "astro"
+    "astro": "astro",
+    "test": "vitest run",
+    "check": "astro check"
   },
   "dependencies": {
-    "@astrojs/rss": "^4.0.0",
-    "@astrojs/vercel": "^8.0.0",
-    "astro": "^5.17.2",
+    "@astrojs/rss": "^4.0.18",
+    "@astrojs/sitemap": "^3.7.3",
+    "@astrojs/vercel": "^8.2.11",
+    "astro": "^5.18.2",
     "astro-cloudinary": "^1.3.5",
     "unist-util-visit": "^5.1.0"
   },
   "devDependencies": {
+    "@astrojs/check": "^0.9.9",
     "cheerio": "^1.2.0",
-    "turndown": "^7.2.2"
+    "turndown": "^7.2.2",
+    "typescript": "^5.9.3",
+    "vitest": "^4.1.8"
   }
 }
diff --git a/src/components/Footer.astro b/src/components/Footer.astro
index fde5d75..59752d5 100644
--- a/src/components/Footer.astro
+++ b/src/components/Footer.astro
@@ -1,27 +1,67 @@
 ---
 const year = new Date().getFullYear();
+
+const links = [
+  { label: 'Archive', href: '/archive/' },
+  { label: 'Topics', href: '/topics/' },
+  { label: 'RSS', href: '/rss.xml' },
+  { label: 'About', href: '/about/' },
+  { label: 'Contact', href: '/contact/' },
+];
 ---
 
 <footer class="site-footer">
-  <div class="container">
-    <p>&copy; {year} Rod Machen</p>
+  <div class="wrap">
+    <nav class="footer-links" aria-label="Site">
+      {links.map((link) => (
+        <a href={link.href}>{link.label}</a>
+      ))}
+    </nav>
+    <p class="colophon">
+      <span class="rule">&mdash;</span>
+      Edition &middot; Rod Machen &middot; Est. 2013, Austin, Texas &middot; &copy; {year}
+    </p>
   </div>
 </footer>
 
 <style>
   .site-footer {
-    border-top: 1px solid var(--color-border);
-    padding: 1.5rem 0;
-    margin-top: 2rem;
-    font-family: var(--font-sans);
-    font-size: 0.8rem;
-    color: var(--color-text-light);
+    border-top: 3px double var(--ink);
+    padding: 1.75rem 0 3rem;
+    margin-top: 3rem;
     text-align: center;
   }
 
-  .site-footer .container {
-    max-width: var(--max-width);
-    margin: 0 auto;
-    padding: 0 1.5rem;
+  .footer-links {
+    display: flex;
+    flex-wrap: wrap;
+    justify-content: center;
+    gap: 0 0.5rem;
+  }
+
+  .footer-links a {
+    font-family: var(--font-display);
+    font-size: var(--text-xs);
+    letter-spacing: 0.16em;
+    text-transform: uppercase;
+    color: var(--ink-soft);
+    padding: 0.55rem 0.9rem;
+  }
+
+  .footer-links a:hover {
+    color: var(--accent);
+  }
+
+  .colophon {
+    font-family: var(--font-mono);
+    font-size: var(--text-xs);
+    letter-spacing: 0.04em;
+    color: var(--ink-soft);
+    margin: 1rem 0 0;
+  }
+
+  .colophon .rule {
+    color: var(--rule);
+    margin-right: 0.4rem;
   }
 </style>
diff --git a/src/components/Header.astro b/src/components/Header.astro
index d39e2a2..4f97780 100644
--- a/src/components/Header.astro
+++ b/src/components/Header.astro
@@ -1,61 +1,174 @@
 ---
+import ThemeToggle from './ThemeToggle.astro';
+
+interface Props {
+  /** Render the full front-page nameplate vs. the compact bar. */
+  home?: boolean;
+  /** Wrap the full nameplate in <h1> (true only when it is the page heading). */
+  headingNameplate?: boolean;
+}
+
+const { home = false, headingNameplate = home } = Astro.props;
+
+const nav = [
+  { label: 'Newsletter', href: '/newsletter/' },
+  { label: 'Articles', href: '/articles/' },
+  { label: 'Reviews', href: '/reviews/' },
+  { label: 'Bylines', href: '/bylines/' },
+];
+
+const year = new Date().getFullYear();
 ---
 
-<header class="site-header">
-  <div class="container header-inner">
-    <a href="/" class="site-name">EDITION &ndash; ROD MACHEN</a>
-    <nav>
-      <a href="/">Home</a>
-      <a href="/archive/">Archive</a>
-      <a href="/topics/">Topics</a>
-      <a href="/about/">About</a>
-      <a href="/contact/">Contact</a>
-    </nav>
+<header class:list={['masthead', { home }]}>
+  <div class="wrap">
+    <div class="kicker">
+      <span class="est">Est. 2013 &middot; Austin, Texas</span>
+      <span class="dateline">{year} Edition</span>
+      <ThemeToggle />
+    </div>
+
+    {home ? (
+      <>
+        {headingNameplate ? (
+          <h1 class="nameplate-h1"><a href="/" class="nameplate">Edition</a></h1>
+        ) : (
+          <div class="nameplate-h1"><a href="/" class="nameplate">Edition</a></div>
+        )}
+        <p class="subhead">Rod Machen &middot; Writing on Film, Food, Music &amp; the Examined Life</p>
+      </>
+    ) : (
+      <a href="/" class="nameplate">Edition</a>
+    )}
   </div>
+
+  <nav class="primary" aria-label="Sections">
+    <div class="wrap nav-inner">
+      {nav.map((item) => (
+        <a href={item.href}>{item.label}</a>
+      ))}
+    </div>
+  </nav>
 </header>
 
 <style>
-  .site-header {
-    border-bottom: 1px solid var(--color-border);
-    padding: 1rem 0;
+  .masthead {
+    border-bottom: 3px double var(--ink);
+    padding-top: 1.1rem;
   }
 
-  .header-inner {
+  .kicker {
     display: flex;
-    justify-content: space-between;
     align-items: center;
-    max-width: var(--max-width);
-    margin: 0 auto;
-    padding: 0 1.5rem;
+    gap: 0.75rem 1.25rem;
+    flex-wrap: wrap;
+    font-family: var(--font-mono);
+    font-size: var(--text-xs);
+    letter-spacing: 0.12em;
+    text-transform: uppercase;
+    color: var(--ink-soft);
+    padding-bottom: 0.85rem;
+  }
+
+  .kicker .est {
+    color: var(--accent);
+  }
+
+  .kicker .dateline {
+    /* push the toggle to the far right */
+    margin-left: auto;
+  }
+
+  .kicker :global(.theme-toggle) {
+    flex-shrink: 0;
+  }
+
+  .nameplate {
+    display: block;
+    font-family: var(--font-display);
+    font-weight: 400;
+    letter-spacing: -0.02em;
+    line-height: 0.95;
+    color: var(--ink);
+  }
+
+  /* compact bar nameplate */
+  .masthead:not(.home) .nameplate {
+    font-size: clamp(1.9rem, 6vw, 2.6rem);
+    padding-bottom: 0.7rem;
+  }
+
+  /* home front-page nameplate */
+  .masthead.home {
+    padding-top: 1.6rem;
+  }
+
+  .nameplate-h1 {
+    margin: 0;
+    font-weight: inherit;
+  }
+
+  .masthead.home .nameplate {
+    font-weight: 300;
+    font-size: var(--display-lg);
+    text-align: center;
+    padding: 0.1rem 0 0.15rem;
   }
 
-  .site-name {
-    font-family: var(--font-sans);
-    font-size: 1.25rem;
-    font-weight: 700;
-    color: var(--color-text);
+  .masthead.home .subhead {
+    text-align: center;
+    font-family: var(--font-display);
+    font-size: var(--text-sm);
+    font-weight: 400;
+    letter-spacing: 0.28em;
+    text-transform: uppercase;
+    color: var(--ink-soft);
+    margin: 0;
+    padding: 0.6rem 0 1.1rem;
   }
 
-  .site-name:hover {
-    text-decoration: none;
-    color: var(--color-link);
+  .nameplate:hover {
+    color: var(--accent);
   }
 
-  nav {
+  /* --- Nav ----------------------------------------------------------- */
+  .primary {
+    border-top: var(--rule-thin) solid var(--ink);
+  }
+
+  .nav-inner {
     display: flex;
-    gap: 1.25rem;
-    font-family: var(--font-sans);
-    font-size: 0.9rem;
+    flex-wrap: wrap;
+    justify-content: center;
+    font-family: var(--font-display);
+    font-size: var(--text-sm);
+    letter-spacing: var(--tracking-nav);
+    text-transform: uppercase;
   }
 
-  @media (max-width: 500px) {
-    .header-inner {
-      flex-direction: column;
-      gap: 0.5rem;
-    }
+  .nav-inner a {
+    position: relative;
+    padding: 0.7rem 1.1rem;
+    color: var(--ink-soft);
+    transition: color 0.2s;
+  }
+
+  .nav-inner a + a::before {
+    content: '';
+    position: absolute;
+    left: 0;
+    top: 24%;
+    height: 52%;
+    border-left: var(--rule-thin) solid var(--rule);
+  }
+
+  .nav-inner a:hover {
+    color: var(--accent);
+  }
 
-    nav {
-      gap: 1rem;
+  @media (max-width: 420px) {
+    .nav-inner a {
+      padding: 0.7rem 0.7rem;
     }
   }
 </style>
diff --git a/src/components/PageHeader.astro b/src/components/PageHeader.astro
index d2e838e..f3fb2c1 100644
--- a/src/components/PageHeader.astro
+++ b/src/components/PageHeader.astro
@@ -21,30 +21,33 @@ const { title, subtitle, count, countLabel = 'post', titleColor } = Astro.props;
 <style>
   .page-header {
     text-align: center;
+    padding: 2rem 0 1.5rem;
+    border-bottom: 2px solid var(--ink);
     margin-bottom: 2rem;
   }
 
   .page-header h1 {
+    font-family: var(--font-display);
     font-size: clamp(2rem, 6vw, 3rem);
-    font-weight: 300;
-    letter-spacing: 0.06em;
-    text-transform: uppercase;
-    margin-bottom: 0.25rem;
+    font-weight: 400;
+    letter-spacing: -0.01em;
+    margin-bottom: 0.35rem;
   }
 
   .page-subtitle {
-    font-family: var(--font-sans);
-    font-size: 0.85rem;
-    color: var(--color-text-light);
+    font-family: var(--font-mono);
+    font-size: var(--text-xs);
+    color: var(--ink-soft);
     text-transform: uppercase;
-    letter-spacing: 0.1em;
+    letter-spacing: var(--tracking-mono);
   }
 
   .page-count {
-    font-family: var(--font-sans);
-    font-size: 0.85rem;
-    color: var(--color-text-light);
+    font-family: var(--font-mono);
+    font-size: var(--text-xs);
+    color: var(--gold);
     text-transform: uppercase;
-    letter-spacing: 0.1em;
+    letter-spacing: var(--tracking-mono);
+    margin-top: 0.25rem;
   }
 </style>
diff --git a/src/components/ThemeToggle.astro b/src/components/ThemeToggle.astro
new file mode 100644
index 0000000..ab94391
--- /dev/null
+++ b/src/components/ThemeToggle.astro
@@ -0,0 +1,88 @@
+---
+// Segmented Day/Night control. The pre-paint theme is set by the inline
+// bootstrap script in BaseLayout (no FOUC); this component only syncs the
+// button state on load and handles user toggles + persistence.
+---
+
+<div class="theme-toggle" role="group" aria-label="Color theme">
+  <button type="button" data-theme-set="light" aria-pressed="false">Day</button>
+  <button type="button" data-theme-set="dark" aria-pressed="false">Night</button>
+</div>
+
+<script is:inline>
+  (function () {
+    var root = document.documentElement;
+    var buttons = document.querySelectorAll('.theme-toggle button');
+
+    function current() {
+      var attr = root.getAttribute('data-theme');
+      if (attr === 'dark' || attr === 'light') return attr;
+      return window.matchMedia &&
+        window.matchMedia('(prefers-color-scheme: dark)').matches
+        ? 'dark'
+        : 'light';
+    }
+
+    function sync(mode) {
+      buttons.forEach(function (b) {
+        b.setAttribute(
+          'aria-pressed',
+          b.getAttribute('data-theme-set') === mode ? 'true' : 'false',
+        );
+      });
+      var meta = document.querySelector('meta[name="theme-color"]');
+      if (meta) meta.setAttribute('content', mode === 'dark' ? '#16130f' : '#f4efe4');
+    }
+
+    function set(mode) {
+      root.setAttribute('data-theme', mode);
+      try {
+        localStorage.setItem('theme', mode);
+      } catch (e) {}
+      sync(mode);
+    }
+
+    buttons.forEach(function (b) {
+      b.addEventListener('click', function () {
+        set(b.getAttribute('data-theme-set'));
+      });
+    });
+
+    sync(current());
+  })();
+</script>
+
+<style>
+  .theme-toggle {
+    display: inline-flex;
+    border: var(--rule-thin) solid var(--ink);
+    font-family: var(--font-mono);
+  }
+
+  .theme-toggle button {
+    background: transparent;
+    border: 0;
+    color: var(--ink-soft);
+    font: inherit;
+    font-size: var(--text-xs);
+    letter-spacing: 0.06em;
+    text-transform: uppercase;
+    padding: 0.5rem 0.7rem;
+    min-height: 32px;
+    cursor: pointer;
+    transition: background 0.15s, color 0.15s;
+  }
+
+  .theme-toggle button + button {
+    border-left: var(--rule-thin) solid var(--ink);
+  }
+
+  .theme-toggle button[aria-pressed='true'] {
+    background: var(--ink);
+    color: var(--paper);
+  }
+
+  .theme-toggle button:hover:not([aria-pressed='true']) {
+    color: var(--ink);
+  }
+</style>
diff --git a/src/content/posts/2014-02-20-first-look-kerlin-bbq.md b/src/content/posts/2014-02-20-first-look-kerlin-bbq.md
index d2ecfff..100477d 100644
--- a/src/content/posts/2014-02-20-first-look-kerlin-bbq.md
+++ b/src/content/posts/2014-02-20-first-look-kerlin-bbq.md
@@ -2,7 +2,7 @@
 title: 'Kerlin BBQ'
 subTitle: 'A First Look'
 author: Rod Machen
-category: article
+category: review
 date: 2014-02-20
 tags:
   - austin
diff --git a/src/content/posts/2014-02-25-neutral-milk-hotel-retro-scenester-adventure.md b/src/content/posts/2014-02-25-neutral-milk-hotel-retro-scenester-adventure.md
index 769ac25..1d792b3 100644
--- a/src/content/posts/2014-02-25-neutral-milk-hotel-retro-scenester-adventure.md
+++ b/src/content/posts/2014-02-25-neutral-milk-hotel-retro-scenester-adventure.md
@@ -25,7 +25,8 @@ It seems like Mangum and Co. could do this once every few years and both give hi
 
 (Photographic apologies to the band: They requested no photography, but one of my seatmates captured the above photo. Sorry. Had to use it.)
 
-<hr>
+
+---
 
 Bonus section: If Neutral Milk Hotel has never crossed your sonic palette, here&#8217;s a three-course tasting menu that will help you decide whether future exploration is necessary. (Available in all the normal places.)
 
diff --git a/src/content/posts/2014-03-27-grand-budapest-hotel-review.md b/src/content/posts/2014-03-27-grand-budapest-hotel-review.md
index 764abf1..e6a6a11 100644
--- a/src/content/posts/2014-03-27-grand-budapest-hotel-review.md
+++ b/src/content/posts/2014-03-27-grand-budapest-hotel-review.md
@@ -2,7 +2,7 @@
 title: The Grand Budapest Hotel
 subTitle: A Review
 author: Rod Machen
-category: article
+category: review
 date: 2014-03-27
 tags:
   - film
diff --git a/src/content/posts/2014-04-07-game-of-thrones-two-swords.md b/src/content/posts/2014-04-07-game-of-thrones-two-swords.md
index aef2f33..398f0a4 100644
--- a/src/content/posts/2014-04-07-game-of-thrones-two-swords.md
+++ b/src/content/posts/2014-04-07-game-of-thrones-two-swords.md
@@ -2,7 +2,7 @@
 title: Game of Thrones 
 subTitle: Two Swords
 author: Rod Machen
-category: article
+category: review
 date: 2014-04-07
 tags:
   - tv
diff --git a/src/content/posts/a-week-of-tennis.md b/src/content/posts/a-week-of-tennis.md
new file mode 100644
index 0000000..3d7ab80
--- /dev/null
+++ b/src/content/posts/a-week-of-tennis.md
@@ -0,0 +1,12 @@
+---
+title: ‘A Week of Tennis’
+subTitle: ‘A retro-scenester adventure’
+author: Rod Machen
+category: article
+date: 2014-02-25
+published: false
+tags:
+  - music
+  - culture
+  - essay
+---
\ No newline at end of file
diff --git a/src/layouts/BaseLayout.astro b/src/layouts/BaseLayout.astro
index fa1b1ba..33dec15 100644
--- a/src/layouts/BaseLayout.astro
+++ b/src/layouts/BaseLayout.astro
@@ -7,10 +7,25 @@ interface Props {
   title: string;
   description?: string;
   ogImage?: string;
+  /**
+   * 'home' — full front-page nameplate (as the page <h1>) + unconstrained main.
+   * 'section' — same full-width nameplate visual, but the nameplate is NOT the
+   *   page heading (the section page supplies its own <h1>).
+   * 'default' — compact masthead + constrained main.
+   */
+  variant?: 'home' | 'section' | 'default';
 }
 
-const { title, description = 'Edition — writing on food, film, arts, and Austin culture by Rod Machen.', ogImage } = Astro.props;
+const {
+  title,
+  description = 'Edition — writing on food, film, arts, and Austin culture by Rod Machen.',
+  ogImage,
+  variant = 'default',
+} = Astro.props;
+
 const canonicalUrl = Astro.url.href;
+const isFullWidth = variant === 'home' || variant === 'section';
+const headingNameplate = variant === 'home';
 ---
 
 <!DOCTYPE html>
@@ -18,9 +33,47 @@ const canonicalUrl = Astro.url.href;
 <head>
   <meta charset="utf-8" />
   <meta name="viewport" content="width=device-width, initial-scale=1" />
+
+  <!-- theme-color (kept in sync by the bootstrap script + ThemeToggle) -->
+  <meta name="theme-color" content="#f4efe4" />
+
+  <!--
+    Render-blocking, synchronous: resolve the saved theme and set data-theme on
+    <html> BEFORE any background-painting CSS loads, so a hard reload in dark
+    mode shows no white/cream flash. Must stay inline and ahead of the stylesheet.
+  -->
+  <script is:inline>
+    (function () {
+      try {
+        var stored = localStorage.getItem('theme');
+        if (stored === 'dark' || stored === 'light') {
+          document.documentElement.setAttribute('data-theme', stored);
+        }
+        var resolved =
+          stored === 'dark' || stored === 'light'
+            ? stored
+            : window.matchMedia &&
+                window.matchMedia('(prefers-color-scheme: dark)').matches
+              ? 'dark'
+              : 'light';
+        var meta = document.querySelector('meta[name="theme-color"]');
+        if (meta) meta.setAttribute('content', resolved === 'dark' ? '#16130f' : '#f4efe4');
+      } catch (e) {}
+    })();
+  </script>
+
   <meta name="description" content={description} />
   <link rel="alternate" type="application/rss+xml" title="Edition | Rod Machen" href="/rss.xml" />
   <link rel="icon" type="image/x-icon" href="/favicon.ico" />
+
+  <!-- Fonts: Fraunces (display), Newsreader (body), Spline Sans Mono (metadata) -->
+  <link rel="preconnect" href="https://fonts.googleapis.com" />
+  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
+  <link
+    href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,400..600&family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400..500&family=Spline+Sans+Mono:wght@400;500;600&display=swap"
+    rel="stylesheet"
+  />
+
   <title>{title}</title>
 
   <!-- Open Graph -->
@@ -37,18 +90,23 @@ const canonicalUrl = Astro.url.href;
   {ogImage && <meta name="twitter:image" content={ogImage} />}
 </head>
 <body>
-  <Header />
-  <main class="container">
-    <slot />
-  </main>
+  <a href="#main" class="skip-link">Skip to content</a>
+  <Header home={isFullWidth} headingNameplate={headingNameplate} />
+  {isFullWidth ? (
+    <main id="main"><slot /></main>
+  ) : (
+    <main id="main" class="container"><slot /></main>
+  )}
   <Footer />
 </body>
 </html>
 
 <style>
   main {
-    padding-top: 2rem;
     padding-bottom: 3rem;
     min-height: 60vh;
   }
+  main.container {
+    padding-top: 2rem;
+  }
 </style>
diff --git a/src/layouts/PostLayout.astro b/src/layouts/PostLayout.astro
index 22056fb..1b0b67a 100644
--- a/src/layouts/PostLayout.astro
+++ b/src/layouts/PostLayout.astro
@@ -1,100 +1,262 @@
 ---
 import BaseLayout from './BaseLayout.astro';
-import { CATEGORY_CONFIG } from '../utils/posts';
+import { CATEGORY_CONFIG, getPostCategory, getCategoryPath } from '../utils/posts';
 
 interface Props {
   title: string;
   subTitle?: string;
   date: Date;
   tags?: string[];
-  category?: string;
+  category?: string | string[];
   template?: string;
   ogImage?: string;
 }
 
 const { title, subTitle, date, tags, category, template = 'article', ogImage } = Astro.props;
 
-const formattedDate = date.toLocaleDateString('en-US', {
+// Dotted archival date for mono display
+function dot(d: Date): string {
+  const y = d.getFullYear();
+  const m = String(d.getMonth() + 1).padStart(2, '0');
+  const day = String(d.getDate()).padStart(2, '0');
+  return `${y}.${m}.${day}`;
+}
+
+const longDate = date.toLocaleDateString('en-US', {
   year: 'numeric',
   month: 'long',
   day: 'numeric',
 });
 
-const config = CATEGORY_CONFIG[template] || CATEGORY_CONFIG.article;
+// Map template key to dark-mode-aware CSS variable
+const ACCENT_VAR: Record<string, string> = {
+  newsletter: 'var(--accent-newsletter)',
+  article:    'var(--accent-articles)',
+  review:     'var(--accent-reviews)',
+  byline:     'var(--accent-bylines)',
+};
+const postAccent = ACCENT_VAR[template] ?? 'var(--accent)';
+
+const catKey = getPostCategory(category);
+const sectionPath = getCategoryPath(catKey);
+const sectionLabel = CATEGORY_CONFIG[catKey]?.label ?? (CATEGORY_CONFIG[template]?.label ?? 'Edition');
 ---
 
 <BaseLayout title={`${title} | Edition`} ogImage={ogImage}>
-  <article class={`post post--${template}`}>
+  <article
+    class={`post post--${template}`}
+    style={`--post-accent: ${postAccent}`}
+  >
     <header class="post-header">
-      {template === 'newsletter' && <span class="template-badge">Newsletter</span>}
+      <nav class="post-breadcrumb" aria-label="Section">
+        <a href={`/${sectionPath}/`}>{sectionLabel}</a>
+        {template === 'newsletter' && (
+          <span class="hangman-tag">The Hangman Chronicles</span>
+        )}
+      </nav>
+
+      {template === 'newsletter' && (
+        <span class="section-badge">Dispatch</span>
+      )}
+
       <h1>{title}</h1>
-      {subTitle && <p class="subtitle">{subTitle}</p>}
-      <time datetime={date.toISOString().split('T')[0]}>{formattedDate}</time>
+      {subTitle && <p class="post-subtitle">{subTitle}</p>}
+
+      <div class="post-dateline">
+        <time datetime={date.toISOString().split('T')[0]}>{dot(date)}</time>
+        <span class="dateline-long">{longDate}</span>
+      </div>
     </header>
-    <div class="post-content">
+
+    <div class="post-body">
       <slot />
     </div>
+
     {tags && tags.length > 0 && (
       <footer class="post-tags">
-        {tags.map(tag => (
-          <a href={`/topics/${tag}/`} class="tag">{tag}</a>
-        ))}
+        <span class="tags-label mono-label">Topics</span>
+        <div class="tag-links">
+          {tags.map(tag => (
+            <a href={`/topics/${tag}/`} class="tag-link">{tag}</a>
+          ))}
+        </div>
       </footer>
     )}
   </article>
 </BaseLayout>
 
-<style define:vars={{ accent: config.accent }}>
-  .post-header {
-    margin-bottom: 2rem;
+<style>
+  /* ---- Post wrapper ------------------------------------------------- */
+  .post {
+    max-width: 700px;
+    margin: 0 auto;
+    padding-top: 2rem;
   }
 
-  .template-badge {
-    font-family: var(--font-sans);
-    font-size: 0.75rem;
-    font-weight: 600;
+  /* ---- Header ------------------------------------------------------- */
+  .post-breadcrumb {
+    font-family: var(--font-mono);
+    font-size: var(--text-xs);
+    letter-spacing: var(--tracking-mono);
     text-transform: uppercase;
-    letter-spacing: 0.05em;
-    color: var(--accent);
-    display: inline-block;
-    margin-bottom: 0.5rem;
+    color: var(--ink-soft);
+    display: flex;
+    align-items: center;
+    gap: 0.75rem;
+    margin-bottom: 1.4rem;
+    flex-wrap: wrap;
   }
 
-  .post--newsletter h1 {
-    color: var(--accent);
+  .post-breadcrumb a {
+    color: var(--post-accent);
   }
 
-  .subtitle {
+  .post-breadcrumb a:hover {
+    opacity: 0.75;
+  }
+
+  .hangman-tag {
+    color: var(--ink-soft);
+    font-style: italic;
+  }
+
+  .section-badge {
+    display: block;
+    font-family: var(--font-mono);
+    font-size: var(--text-xs);
+    letter-spacing: 0.12em;
+    text-transform: uppercase;
+    color: var(--post-accent);
+    margin-bottom: 0.7rem;
+  }
+
+  .post-header h1 {
+    font-family: var(--font-display);
+    font-weight: 400;
+    font-size: clamp(1.9rem, 5vw, 3rem);
+    line-height: 1.05;
+    letter-spacing: -0.02em;
+    color: var(--ink);
+    margin-bottom: 0.55rem;
+  }
+
+  .post--newsletter .post-header h1 {
+    color: var(--post-accent);
+  }
+
+  .post-subtitle {
+    font-family: var(--font-text);
     font-size: 1.25rem;
-    color: var(--color-text-light);
-    margin-top: 0.25rem;
-    margin-bottom: 0.5rem;
+    color: var(--ink-soft);
     font-style: italic;
+    margin: 0 0 0.7rem;
+    line-height: 1.35;
   }
 
-  time {
-    font-family: var(--font-sans);
-    font-size: 0.85rem;
-    color: var(--color-text-light);
+  .post-dateline {
+    display: flex;
+    align-items: baseline;
+    gap: 1rem;
+    font-family: var(--font-mono);
+    font-size: var(--text-xs);
+    letter-spacing: 0.06em;
+    color: var(--ink-soft);
+    border-top: var(--rule-thin) solid var(--rule);
+    border-bottom: var(--rule-thin) solid var(--rule);
+    padding: 0.55rem 0;
+    margin-top: 0.75rem;
   }
 
-  .post-content {
-    margin-bottom: 2rem;
+  .post-dateline time {
+    color: var(--gold);
+    letter-spacing: 0.04em;
   }
 
+  .dateline-long {
+    text-transform: uppercase;
+  }
+
+  /* ---- Post body / prose -------------------------------------------- */
+  .post-body {
+    margin-top: 2.25rem;
+    margin-bottom: 2.5rem;
+  }
+
+  /* Prose overrides scoped to this component */
+  .post-body :global(p) {
+    font-family: var(--font-text);
+    font-size: var(--text-base);
+    line-height: 1.75;
+    margin-bottom: 1.4rem;
+  }
+
+  .post-body :global(h2),
+  .post-body :global(h3),
+  .post-body :global(h4) {
+    font-family: var(--font-display);
+    margin-top: 2.25rem;
+    margin-bottom: 0.75rem;
+    color: var(--ink);
+  }
+
+  .post-body :global(a) {
+    color: var(--post-accent);
+    text-decoration: underline;
+    text-underline-offset: 2px;
+    text-decoration-thickness: 1px;
+  }
+
+  .post-body :global(a:hover) {
+    opacity: 0.8;
+  }
+
+  .post-body :global(ul),
+  .post-body :global(ol) {
+    margin: 0 0 1.4rem 1.5rem;
+    line-height: 1.7;
+  }
+
+  .post-body :global(li) {
+    margin-bottom: 0.4rem;
+  }
+
+  .post-body :global(blockquote) {
+    /* inherits from global.css blockquote styles */
+  }
+
+  /* Cloudinary figures — styled globally in global.css; no changes here */
+
+  /* ---- Tags footer -------------------------------------------------- */
   .post-tags {
-    border-top: 1px solid var(--color-border);
+    border-top: 2px solid var(--ink);
     padding-top: 1rem;
+    margin-top: 1.5rem;
+  }
+
+  .tags-label {
+    display: block;
+    margin-bottom: 0.6rem;
+  }
+
+  .tag-links {
     display: flex;
     flex-wrap: wrap;
-    gap: 0.5rem;
+    gap: 0.45rem;
+  }
+
+  .tag-link {
+    font-family: var(--font-mono);
+    font-size: var(--text-xs);
+    letter-spacing: 0.04em;
+    color: var(--ink-soft);
+    border: var(--rule-thin) solid var(--rule);
+    border-radius: 20px;
+    padding: 0.25rem 0.8rem;
+    text-decoration: none;
   }
 
-  .tag {
-    font-family: var(--font-sans);
-    font-size: 0.8rem;
-    background: var(--color-bg-muted);
-    padding: 0.2rem 0.6rem;
-    border-radius: 3px;
+  .tag-link:hover {
+    color: var(--post-accent);
+    border-color: var(--post-accent);
   }
 </style>
diff --git a/src/pages/[category]/[slug].astro b/src/pages/[category]/[slug].astro
index 4c55a04..185ffc4 100644
--- a/src/pages/[category]/[slug].astro
+++ b/src/pages/[category]/[slug].astro
@@ -2,14 +2,14 @@
 import type { GetStaticPaths } from 'astro';
 import { getCollection, render } from 'astro:content';
 import PostLayout from '../../layouts/PostLayout.astro';
-import { getPostSlug, getPostCategory } from '../../utils/posts';
+import { getPostSlug, getPostCategory, getCategoryPath, getPublishedPosts } from '../../utils/posts';
 import { getCldOgImageUrl } from 'astro-cloudinary/helpers';
 
 export const getStaticPaths = (async () => {
-  const posts = await getCollection('posts');
+  const posts = getPublishedPosts(await getCollection('posts'));
   return posts.map((post) => {
     const slug = getPostSlug(post.id, post.data);
-    const category = getPostCategory(post.data.category);
+    const category = getCategoryPath(getPostCategory(post.data.category));
     return {
       params: { category, slug },
       props: { post },
diff --git a/src/pages/[category]/index.astro b/src/pages/[category]/index.astro
index f2a13d2..9fe7ea5 100644
--- a/src/pages/[category]/index.astro
+++ b/src/pages/[category]/index.astro
@@ -2,50 +2,401 @@
 import type { GetStaticPaths } from 'astro';
 import { getCollection } from 'astro:content';
 import BaseLayout from '../../layouts/BaseLayout.astro';
-import PageHeader from '../../components/PageHeader.astro';
-import PostCardList from '../../components/PostCardList.astro';
-import { getPostCategory, CATEGORY_CONFIG, postToListItem } from '../../utils/posts';
+import {
+  getPostSlug,
+  getPostCategory,
+  getCategoryPath,
+  CATEGORY_CONFIG,
+  getPublishedPosts,
+} from '../../utils/posts';
 
 export const getStaticPaths = (async () => {
-  return Object.keys(CATEGORY_CONFIG)
-    .filter((key) => key !== 'byline')
-    .map((key) => ({
-      params: { category: key },
-      props: { category: key },
+  return Object.entries(CATEGORY_CONFIG)
+    .filter(([key]) => key !== 'byline')
+    .map(([key, config]) => ({
+      params: { category: config.path },
+      props: { categoryKey: key },
     }));
 }) satisfies GetStaticPaths;
 
-const { category } = Astro.props;
-const config = CATEGORY_CONFIG[category];
+const { categoryKey } = Astro.props;
+const config = CATEGORY_CONFIG[categoryKey];
 
-const posts = await getCollection('posts');
+const posts = getPublishedPosts(await getCollection('posts'));
 const filtered = posts
-  .filter((p) => getPostCategory(p.data.category) === category)
+  .filter((p) => getPostCategory(p.data.category) === categoryKey)
   .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
 
-const items = filtered.map(postToListItem);
+function dot(date: Date): string {
+  const y = date.getFullYear();
+  const mo = String(date.getMonth() + 1).padStart(2, '0');
+  const d = String(date.getDate()).padStart(2, '0');
+  return `${y}.${mo}.${d}`;
+}
+
+function titleCase(s: string): string {
+  return s.charAt(0).toUpperCase() + s.slice(1);
+}
+
+type SectionMeta = {
+  pageTitle: string;
+  h1: string;
+  lede: string;
+  accentVar: string;
+  prefix: (n: number) => string;
+};
+
+const SECTION_META: Record<string, SectionMeta> = {
+  newsletter: {
+    pageTitle: 'The Hangman Chronicles | Edition',
+    h1: 'The Hangman Chronicles',
+    lede: 'A weekly dispatch by Rod Machen',
+    accentVar: 'var(--accent-newsletter)',
+    prefix: (n) => `№${String(n).padStart(3, '0')}`,
+  },
+  article: {
+    pageTitle: `${config.label} | Edition`,
+    h1: config.label,
+    lede: 'Essays & Notes',
+    accentVar: 'var(--accent-articles)',
+    prefix: (n) => `A·${String(n).padStart(2, '0')}`,
+  },
+  review: {
+    pageTitle: `${config.label} | Edition`,
+    h1: config.label,
+    lede: 'Film · TV · Food',
+    accentVar: 'var(--accent-reviews)',
+    prefix: (n) => `R·${String(n).padStart(2, '0')}`,
+  },
+};
+
+const meta = SECTION_META[categoryKey] ?? {
+  pageTitle: `${config.label} | Edition`,
+  h1: config.label,
+  lede: config.description,
+  accentVar: 'var(--accent)',
+  prefix: (n: number) => String(n),
+};
+
+const total = filtered.length;
+const entries = filtered.map((post, i) => {
+  const tags = post.data.tags || [];
+  const slug = getPostSlug(post.id, post.data);
+  return {
+    id: meta.prefix(total - i),
+    date: dot(post.data.date),
+    title: post.data.title || slug,
+    subtitle: post.data.subTitle,
+    tag: tags.length ? titleCase(tags[0]) : config.label,
+    href: `/${getCategoryPath(getPostCategory(post.data.category))}/${slug}/`,
+  };
+});
 ---
 
-<BaseLayout title={`${config.label} | Edition`}>
-  <PageHeader
-    title={config.label}
-    titleColor={config.accent}
-    subtitle={config.description}
-    count={filtered.length}
-  />
-
-  {filtered.length === 0 ? (
-    <p class="empty">Coming soon.</p>
-  ) : (
-    <PostCardList items={items} />
-  )}
+<BaseLayout title={meta.pageTitle} variant="section">
+  <div class="section-page" style={`--sec-accent: ${meta.accentVar}`}>
+
+    <header class="sec-masthead">
+      <div class="wrap">
+        <p class="sec-nav">
+          <a href="/">Edition</a>
+          <span aria-hidden="true">/</span>
+          <span>{config.label}</span>
+        </p>
+        <h1>{meta.h1}</h1>
+        <p class="sec-lede">{meta.lede}</p>
+        <p class="sec-count">{total} {total === 1 ? 'entry' : 'entries'}</p>
+      </div>
+    </header>
+
+    <div class="wrap catalog-wrap">
+      {filtered.length === 0 ? (
+        <p class="empty">Coming soon.</p>
+      ) : categoryKey === 'review' ? (
+        <div class="catalog catalog--review">
+          {entries.map((entry, i) => (
+            <div class:list={['ledger-row', { lead: i === 0 }]}>
+              <span class="entry-id">{entry.id}</span>
+              <div class="ledger-main">
+                <a href={entry.href} class="entry-link">
+                  <span class="entry-title">{entry.title}</span>
+                </a>
+                {i === 0 && entry.subtitle && (
+                  <p class="entry-dek">{entry.subtitle}</p>
+                )}
+                <span class="entry-cat">{entry.tag}</span>
+              </div>
+              <span class="entry-date-col">{entry.date}</span>
+            </div>
+          ))}
+        </div>
+      ) : (
+        <ol class={`catalog catalog--${categoryKey}`}>
+          {entries.map((entry, i) => (
+            <li class:list={['catalog-entry', { lead: i === 0 }]}>
+              <span class="entry-id">{entry.id}</span>
+              <div class="entry-body">
+                <div class="entry-meta">
+                  <span class="entry-cat">{entry.tag}</span>
+                  <span class="entry-date">{entry.date}</span>
+                </div>
+                <a href={entry.href} class="entry-link">
+                  <span class="entry-title">{entry.title}</span>
+                </a>
+                {i === 0 && entry.subtitle && (
+                  <p class="entry-dek">{entry.subtitle}</p>
+                )}
+              </div>
+            </li>
+          ))}
+        </ol>
+      )}
+    </div>
+
+  </div>
 </BaseLayout>
 
 <style>
+  /* ---- Page wrapper -------------------------------------------------- */
+  .section-page {
+    padding-bottom: 3rem;
+  }
+
+  /* ---- Masthead ------------------------------------------------------- */
+  .sec-masthead {
+    background: var(--paper-2);
+    border-bottom: 2px solid var(--ink);
+    padding: 2rem 0 1.6rem;
+    margin-bottom: 0;
+  }
+
+  .sec-nav {
+    font-family: var(--font-mono);
+    font-size: var(--text-xs);
+    letter-spacing: var(--tracking-mono);
+    text-transform: uppercase;
+    color: var(--ink-soft);
+    display: flex;
+    align-items: center;
+    gap: 0.5rem;
+    margin-bottom: 1rem;
+  }
+
+  .sec-nav a { color: var(--sec-accent); }
+  .sec-nav a:hover { opacity: 0.75; }
+
+  .sec-masthead h1 {
+    font-family: var(--font-display);
+    font-weight: 400;
+    font-size: var(--display-sm);
+    line-height: 1;
+    color: var(--sec-accent);
+    margin-bottom: 0.4rem;
+    letter-spacing: -0.02em;
+  }
+
+  .sec-lede {
+    font-family: var(--font-mono);
+    font-size: var(--text-xs);
+    letter-spacing: 0.1em;
+    text-transform: uppercase;
+    color: var(--ink-soft);
+    margin-bottom: 0.6rem;
+  }
+
+  .sec-count {
+    font-family: var(--font-mono);
+    font-size: var(--text-xs);
+    letter-spacing: var(--tracking-mono);
+    text-transform: uppercase;
+    color: var(--gold);
+  }
+
+  /* ---- Catalog wrap -------------------------------------------------- */
+  .catalog-wrap {
+    padding-top: 1.5rem;
+  }
+
+  /* ---- Empty state --------------------------------------------------- */
   .empty {
-    text-align: center;
-    color: var(--color-text-light);
+    font-family: var(--font-mono);
+    font-size: var(--text-sm);
+    color: var(--ink-soft);
     font-style: italic;
     padding: 3rem 0;
+    text-align: center;
+  }
+
+  /* ---- Newsletter / Articles: dispatch catalog (shared base) --------- */
+  .catalog {
+    list-style: none;
+    margin: 0;
+    padding: 0;
+    border-top: 2px solid var(--ink);
+  }
+
+  .catalog-entry {
+    display: grid;
+    grid-template-columns: 3.2rem 1fr;
+    gap: 0 0.85rem;
+    padding: 1rem 0;
+    border-bottom: var(--rule-thin) solid var(--rule-soft);
+  }
+
+  .catalog-entry.lead {
+    padding-bottom: 1.4rem;
+  }
+
+  .entry-id {
+    font-family: var(--font-mono);
+    font-size: var(--text-xs);
+    color: var(--gold);
+    letter-spacing: 0.04em;
+    padding-top: 0.35rem;
+    line-height: 1.3;
+    white-space: nowrap;
+  }
+
+  .entry-body { min-width: 0; }
+
+  .entry-meta {
+    display: flex;
+    gap: 0.65rem;
+    font-family: var(--font-mono);
+    font-size: var(--text-xs);
+    letter-spacing: 0.05em;
+    text-transform: uppercase;
+    color: var(--ink-soft);
+    margin-bottom: 0.3rem;
+  }
+
+  .entry-cat { color: var(--sec-accent); }
+
+  .entry-link { display: block; }
+
+  .entry-title {
+    font-family: var(--font-text);
+    font-weight: 600;
+    font-size: var(--text-lg);
+    line-height: 1.18;
+    letter-spacing: -0.005em;
+    color: var(--ink);
+  }
+
+  .catalog-entry.lead .entry-title {
+    font-family: var(--font-display);
+    font-weight: 400;
+    font-size: 1.85rem;
+    line-height: 1.08;
+  }
+
+  .entry-link:hover .entry-title { color: var(--sec-accent); }
+
+  .entry-dek {
+    font-size: 1rem;
+    font-style: italic;
+    color: var(--ink-soft);
+    margin: 0.4rem 0 0;
+    line-height: 1.4;
+  }
+
+  /* ---- Newsletter: extra emphasis on lead issue ---------------------- */
+  .catalog--newsletter .catalog-entry.lead {
+    padding-top: 1.4rem;
+  }
+
+  .catalog--newsletter .catalog-entry.lead .entry-id {
+    font-size: var(--text-sm);
+    padding-top: 0.5rem;
+    color: var(--sec-accent);
+  }
+
+  .catalog--newsletter .catalog-entry.lead .entry-title {
+    font-size: 2.2rem;
+  }
+
+  /* ---- Reviews: ruled ledger-table device ---------------------------- */
+  .catalog--review {
+    border-top: 2px solid var(--ink);
+  }
+
+  .ledger-row {
+    display: grid;
+    grid-template-columns: 3.2rem 1fr auto;
+    gap: 0 1rem;
+    padding: 0.85rem 0;
+    border-bottom: var(--rule-thin) solid var(--rule);
+    align-items: baseline;
+  }
+
+  .ledger-row.lead {
+    padding-top: 1.1rem;
+    padding-bottom: 1.1rem;
+    border-bottom: var(--rule-thick) solid var(--rule);
+  }
+
+  .ledger-main { min-width: 0; }
+
+  .ledger-row .entry-id {
+    padding-top: 0.15rem;
+  }
+
+  .ledger-row .entry-title {
+    font-size: var(--text-base);
+    font-weight: 600;
+    font-family: var(--font-text);
+    line-height: 1.25;
+  }
+
+  .ledger-row.lead .entry-title {
+    font-family: var(--font-display);
+    font-weight: 400;
+    font-size: var(--text-xl);
+    line-height: 1.1;
+  }
+
+  .ledger-row .entry-link:hover .entry-title { color: var(--sec-accent); }
+
+  .ledger-row .entry-cat {
+    display: inline-block;
+    font-family: var(--font-mono);
+    font-size: var(--text-xs);
+    letter-spacing: 0.06em;
+    text-transform: uppercase;
+    color: var(--sec-accent);
+    margin-top: 0.25rem;
+  }
+
+  .ledger-row .entry-dek {
+    font-size: 0.95rem;
+    font-style: italic;
+    color: var(--ink-soft);
+    margin: 0.3rem 0 0;
+  }
+
+  .entry-date-col {
+    font-family: var(--font-mono);
+    font-size: var(--text-xs);
+    letter-spacing: 0.04em;
+    color: var(--gold);
+    white-space: nowrap;
+    padding-top: 0.15rem;
+    text-align: right;
+    align-self: start;
+  }
+
+  /* ---- Mobile -------------------------------------------------------- */
+  @media (max-width: 600px) {
+    .sec-masthead h1 {
+      font-size: clamp(2rem, 12vw, 3.5rem);
+    }
+
+    .ledger-row {
+      grid-template-columns: 3rem 1fr;
+    }
+
+    .entry-date-col {
+      display: none;
+    }
   }
 </style>
diff --git a/src/pages/about.astro b/src/pages/about.astro
index 16ba976..75f1c9f 100644
--- a/src/pages/about.astro
+++ b/src/pages/about.astro
@@ -2,9 +2,99 @@
 import BaseLayout from '../layouts/BaseLayout.astro';
 ---
 
-<BaseLayout title="About | Rod Machen">
-  <h1>About</h1>
-  <p>Rod Machen is a freelance writer based in Austin, Texas.</p>
-  <p>His main areas of interests are food, television, books, visual arts, and local culture of all kinds.</p>
-  <p>His work frequently appears in the Austin Chronicle.</p>
+<BaseLayout
+  title="About | Edition"
+  description="Rod Machen is a writer based in Austin, Texas."
+>
+  <div class="about-page">
+    <header class="about-header">
+      <h1>About</h1>
+      <p class="about-dateline">Rod Machen &middot; Austin, Texas</p>
+    </header>
+
+    <div class="about-prose">
+      <p>Rod Machen is a freelance writer based in Austin, Texas.</p>
+      <p>His main areas of interest are food, television, books, visual arts, and local culture of all kinds.</p>
+      <p>His work frequently appears in the <a href="https://www.austinchronicle.com" target="_blank" rel="noopener">Austin Chronicle</a>.</p>
+      <p>Edition is his ongoing publication — a place for dispatches, reviews, and longer pieces about the things that matter.</p>
+    </div>
+
+    <nav class="about-nav">
+      <a href="/newsletter/">Newsletter</a>
+      <a href="/articles/">Articles</a>
+      <a href="/reviews/">Reviews</a>
+      <a href="/bylines/">Bylines</a>
+      <a href="/contact/">Contact</a>
+    </nav>
+  </div>
 </BaseLayout>
+
+<style>
+  .about-page {
+    max-width: 640px;
+    margin: 0 auto;
+    padding-top: 2rem;
+  }
+
+  .about-header {
+    border-bottom: 2px solid var(--ink);
+    padding-bottom: 1.25rem;
+    margin-bottom: 2rem;
+    text-align: center;
+  }
+
+  .about-header h1 {
+    font-family: var(--font-display);
+    font-weight: 400;
+    font-size: clamp(2.2rem, 6vw, 3.2rem);
+    letter-spacing: -0.02em;
+    color: var(--ink);
+    margin-bottom: 0.3rem;
+  }
+
+  .about-dateline {
+    font-family: var(--font-mono);
+    font-size: var(--text-xs);
+    letter-spacing: var(--tracking-mono);
+    text-transform: uppercase;
+    color: var(--ink-soft);
+  }
+
+  .about-prose p {
+    font-family: var(--font-text);
+    font-size: var(--text-base);
+    line-height: 1.7;
+    margin-bottom: 1.25rem;
+  }
+
+  .about-prose a {
+    color: var(--accent);
+    text-decoration: underline;
+    text-underline-offset: 2px;
+  }
+
+  .about-prose a:hover {
+    opacity: 0.8;
+  }
+
+  .about-nav {
+    display: flex;
+    flex-wrap: wrap;
+    gap: 0.5rem 1.5rem;
+    border-top: var(--rule-thin) solid var(--rule);
+    padding-top: 1.5rem;
+    margin-top: 2rem;
+  }
+
+  .about-nav a {
+    font-family: var(--font-display);
+    font-size: var(--text-sm);
+    letter-spacing: 0.1em;
+    text-transform: uppercase;
+    color: var(--ink-soft);
+  }
+
+  .about-nav a:hover {
+    color: var(--accent);
+  }
+</style>
diff --git a/src/pages/archive/[...page].astro b/src/pages/archive/[...page].astro
index 099344c..5fe8ced 100644
--- a/src/pages/archive/[...page].astro
+++ b/src/pages/archive/[...page].astro
@@ -4,11 +4,11 @@ import { getCollection } from 'astro:content';
 import BaseLayout from '../../layouts/BaseLayout.astro';
 import PageHeader from '../../components/PageHeader.astro';
 import PostList from '../../components/PostList.astro';
-import { postToListItem, bylineToListItem } from '../../utils/posts';
+import { postToListItem, bylineToListItem, getPublishedPosts } from '../../utils/posts';
 import type { ListItem } from '../../utils/posts';
 
 export const getStaticPaths = (async ({ paginate }) => {
-  const posts = await getCollection('posts');
+  const posts = getPublishedPosts(await getCollection('posts'));
   const bylines = await getCollection('bylines');
 
   const items: ListItem[] = [
@@ -23,14 +23,21 @@ const { page } = Astro.props;
 ---
 
 <BaseLayout title={`Archive — Page ${page.currentPage} | Edition`}>
-  <PageHeader title="Archive" subtitle={`Page ${page.currentPage} of ${page.lastPage}`} />
+  <PageHeader
+    title="Archive"
+    subtitle={`Page ${page.currentPage} of ${page.lastPage}`}
+  />
 
   <PostList items={page.data} />
 
-  <nav class="pagination">
-    {page.url.prev ? <a href={page.url.prev}>&larr; Newer</a> : <span />}
+  <nav class="pagination" aria-label="Archive pages">
+    {page.url.prev
+      ? <a href={page.url.prev}>&larr; Newer</a>
+      : <span />}
     <span class="page-info">Page {page.currentPage} of {page.lastPage}</span>
-    {page.url.next ? <a href={page.url.next}>Older &rarr;</a> : <span />}
+    {page.url.next
+      ? <a href={page.url.next}>Older &rarr;</a>
+      : <span />}
   </nav>
 </BaseLayout>
 
@@ -39,18 +46,27 @@ const { page } = Astro.props;
     display: flex;
     justify-content: space-between;
     align-items: center;
+    padding: 1.5rem 0 0.5rem;
+    border-top: var(--rule-thin) solid var(--rule);
   }
 
   .pagination a {
-    font-family: var(--font-sans);
-    font-size: 0.85rem;
+    font-family: var(--font-display);
+    font-size: var(--text-sm);
+    letter-spacing: 0.08em;
+    text-transform: uppercase;
+    color: var(--ink-soft);
+  }
+
+  .pagination a:hover {
+    color: var(--accent);
   }
 
   .page-info {
-    font-family: var(--font-sans);
-    font-size: 0.8rem;
-    color: var(--color-text-light);
+    font-family: var(--font-mono);
+    font-size: var(--text-xs);
+    color: var(--ink-soft);
     text-transform: uppercase;
-    letter-spacing: 0.1em;
+    letter-spacing: var(--tracking-mono);
   }
 </style>
diff --git a/src/pages/byline/index.astro b/src/pages/bylines/index.astro
similarity index 95%
rename from src/pages/byline/index.astro
rename to src/pages/bylines/index.astro
index d6fdf67..810d497 100644
--- a/src/pages/byline/index.astro
+++ b/src/pages/bylines/index.astro
@@ -14,7 +14,7 @@ const items = sorted.map(bylineToListItem);
 <BaseLayout title={`${config.label} | Edition`}>
   <PageHeader
     title={config.label}
-    titleColor={config.accent}
+    titleColor="var(--accent-bylines)"
     subtitle={config.description}
     count={sorted.length}
     countLabel="article"
diff --git a/src/pages/contact.astro b/src/pages/contact.astro
index 811cae7..cba8c4e 100644
--- a/src/pages/contact.astro
+++ b/src/pages/contact.astro
@@ -2,24 +2,116 @@
 import BaseLayout from '../layouts/BaseLayout.astro';
 ---
 
-<BaseLayout title="Contact | Rod Machen">
-  <h1>Contact</h1>
-  <div class="contact-info">
-    <p><strong>Email</strong>:<br /><em>mail at rodmachen.com</em></p>
-    <p><a href="https://twitter.com/rodmachen" target="_blank"><strong>Twitter</strong></a>:<br />
-    <a href="https://twitter.com/rodmachen" target="_blank"><em>@rodmachen</em></a></p>
-    <p><a href="https://photo.rodmachen.com" target="_blank"><strong>Photography</strong></a>:<br />
-    <a href="https://photo.rodmachen.com" target="_blank"><em>Still Images</em></a></p>
+<BaseLayout
+  title="Contact | Edition"
+  description="Get in touch with Rod Machen."
+>
+  <div class="contact-page">
+    <header class="contact-header">
+      <h1>Contact</h1>
+      <p class="contact-sub">Rod Machen &middot; Austin, Texas</p>
+    </header>
+
+    <dl class="contact-list">
+      <div class="contact-item">
+        <dt>Email</dt>
+        <dd><em>mail at rodmachen.com</em></dd>
+      </div>
+      <div class="contact-item">
+        <dt>Twitter / X</dt>
+        <dd>
+          <a href="https://twitter.com/rodmachen" target="_blank" rel="noopener">
+            @rodmachen
+          </a>
+        </dd>
+      </div>
+      <div class="contact-item">
+        <dt>Photography</dt>
+        <dd>
+          <a href="https://photo.rodmachen.com" target="_blank" rel="noopener">
+            photo.rodmachen.com
+          </a>
+        </dd>
+      </div>
+    </dl>
   </div>
 </BaseLayout>
 
 <style>
-  .contact-info {
+  .contact-page {
+    max-width: 560px;
+    margin: 0 auto;
+    padding-top: 2rem;
+  }
+
+  .contact-header {
+    border-bottom: 2px solid var(--ink);
+    padding-bottom: 1.25rem;
+    margin-bottom: 2.5rem;
     text-align: center;
-    font-size: 1.1rem;
   }
 
-  .contact-info p {
-    margin-bottom: 1.5rem;
+  .contact-header h1 {
+    font-family: var(--font-display);
+    font-weight: 400;
+    font-size: clamp(2.2rem, 6vw, 3.2rem);
+    letter-spacing: -0.02em;
+    color: var(--ink);
+    margin-bottom: 0.3rem;
+  }
+
+  .contact-sub {
+    font-family: var(--font-mono);
+    font-size: var(--text-xs);
+    letter-spacing: var(--tracking-mono);
+    text-transform: uppercase;
+    color: var(--ink-soft);
+  }
+
+  .contact-list {
+    display: flex;
+    flex-direction: column;
+    gap: 0;
+  }
+
+  .contact-item {
+    display: grid;
+    grid-template-columns: 8rem 1fr;
+    gap: 0 1.25rem;
+    padding: 0.85rem 0;
+    border-bottom: var(--rule-thin) solid var(--rule-soft);
+    align-items: baseline;
+  }
+
+  .contact-item:first-child {
+    border-top: var(--rule-thin) solid var(--rule-soft);
+  }
+
+  dt {
+    font-family: var(--font-mono);
+    font-size: var(--text-xs);
+    letter-spacing: var(--tracking-mono);
+    text-transform: uppercase;
+    color: var(--ink-soft);
+  }
+
+  dd {
+    font-family: var(--font-text);
+    font-size: var(--text-base);
+    color: var(--ink);
+  }
+
+  dd em {
+    color: var(--ink-soft);
+  }
+
+  dd a {
+    color: var(--accent);
+    text-decoration: underline;
+    text-underline-offset: 2px;
+  }
+
+  dd a:hover {
+    opacity: 0.8;
   }
 </style>
diff --git a/src/pages/index.astro b/src/pages/index.astro
index 0da4d4b..e31322a 100644
--- a/src/pages/index.astro
+++ b/src/pages/index.astro
@@ -1,285 +1,449 @@
 ---
 import { getCollection } from 'astro:content';
 import BaseLayout from '../layouts/BaseLayout.astro';
-import { getPostSlug, getPostCategory, getPostsByCategory, CATEGORY_CONFIG } from '../utils/posts';
-
-const posts = await getCollection('posts');
+import {
+  getPostSlug,
+  getPostCategory,
+  getCategoryPath,
+  getPostsByCategory,
+  getPublishedPosts,
+  CATEGORY_CONFIG,
+} from '../utils/posts';
+
+const posts = getPublishedPosts(await getCollection('posts'));
 const sorted = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
 const grouped = getPostsByCategory(sorted);
 
-const bylines = await getCollection('bylines');
-const sortedBylines = bylines.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
-
-const totalItems = sorted.length + sortedBylines.length;
-
-// Grid cards: each content category + archive
-type GridCard = {
-  key: string;
-  label: string;
-  description: string;
-  accent: string;
-  href: string;
-  count: number;
-  items: { title: string; subtitle?: string; href: string }[];
-  comingSoon: boolean;
+const bylines = (await getCollection('bylines')).sort(
+  (a, b) => b.data.date.getTime() - a.data.date.getTime(),
+);
+
+const totalItems = sorted.length + bylines.length;
+
+// Dotted, archival date — mono metadata style (2014.03.27)
+function dot(date: Date): string {
+  const y = date.getFullYear();
+  const m = String(date.getMonth() + 1).padStart(2, '0');
+  const d = String(date.getDate()).padStart(2, '0');
+  return `${y}.${m}.${d}`;
+}
+
+function titleCase(s: string): string {
+  return s.charAt(0).toUpperCase() + s.slice(1);
+}
+
+// The Big 3: prominent section blocks, each with up to 5 recent entries.
+type Section = {
+  key: 'newsletter' | 'article' | 'review';
+  accentVar: string;
+  lede: string;
+  defaultCat: string;
+  prefix: (n: number) => string; // catalog index id
+  pad: number;
 };
 
-const gridCards: GridCard[] = Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
-  if (key === 'byline') {
-    const items = sortedBylines.slice(0, 5).map((b) => ({
-      title: b.data.title,
-      subtitle: b.data.subTitle,
-      href: b.data.url,
-    }));
+const SECTIONS: Section[] = [
+  {
+    key: 'newsletter',
+    accentVar: 'var(--accent-newsletter)',
+    lede: 'The Hangman Chronicles',
+    defaultCat: 'Dispatch',
+    prefix: (n) => `№${String(n).padStart(3, '0')}`,
+    pad: 3,
+  },
+  {
+    key: 'article',
+    accentVar: 'var(--accent-articles)',
+    lede: 'Essays & Notes',
+    defaultCat: 'Essay',
+    prefix: (n) => `A·${String(n).padStart(2, '0')}`,
+    pad: 2,
+  },
+  {
+    key: 'review',
+    accentVar: 'var(--accent-reviews)',
+    lede: 'Film · TV · Food',
+    defaultCat: 'Review',
+    prefix: (n) => `R·${String(n).padStart(2, '0')}`,
+    pad: 2,
+  },
+];
+
+const big3 = SECTIONS.map((section) => {
+  const config = CATEGORY_CONFIG[section.key];
+  const list = grouped[section.key] || [];
+  const total = list.length;
+  const items = list.slice(0, 5).map((post, i) => {
+    const tags = post.data.tags || [];
     return {
-      key,
-      label: config.label,
-      description: config.description,
-      accent: config.accent,
-      href: '/byline/',
-      count: sortedBylines.length,
-      items,
-      comingSoon: false,
+      id: section.prefix(total - i),
+      cat: tags.length ? titleCase(tags[0]) : section.defaultCat,
+      date: dot(post.data.date),
+      title: post.data.title || getPostSlug(post.id, post.data),
+      subtitle: post.data.subTitle,
+      href: `/${getCategoryPath(getPostCategory(post.data.category))}/${getPostSlug(post.id, post.data)}/`,
     };
-  }
-
-  const catPosts = grouped[key] || [];
-  const items = catPosts.slice(0, 5).map((post) => ({
-    title: post.data.title || getPostSlug(post.id, post.data),
-    subtitle: post.data.subTitle,
-    href: `/${getPostCategory(post.data.category)}/${getPostSlug(post.id, post.data)}/`,
-  }));
-
+  });
   return {
-    key,
+    key: section.key,
     label: config.label,
-    description: config.description,
-    accent: config.accent,
-    href: `/${key}/`,
-    count: catPosts.length,
+    href: `/${config.path}/`,
+    accentVar: section.accentVar,
+    lede: section.lede,
+    count: total,
     items,
-    comingSoon: catPosts.length === 0,
   };
 });
 
-// Add Archive as 6th card — merge posts + bylines for 5 most recent
-const allItems = [
-  ...sorted.map((post) => ({
-    title: post.data.title || getPostSlug(post.id, post.data),
-    href: `/${getPostCategory(post.data.category)}/${getPostSlug(post.id, post.data)}/`,
-    date: post.data.date,
-    external: false,
-  })),
-  ...sortedBylines.map((b) => ({
-    title: b.data.title,
-    href: b.data.url,
-    date: b.data.date,
-    external: true,
-  })),
-].sort((a, b) => b.date.getTime() - a.date.getTime());
-
-gridCards.push({
-  key: 'archive',
-  label: 'Archive',
-  description: 'All posts, chronologically',
-  accent: '#555',
-  href: '/archive/',
-  count: totalItems,
-  items: allItems.slice(0, 5).map((item) => ({
-    title: item.title,
-    href: item.href,
-  })),
-  comingSoon: false,
-});
+// Bylines — secondary strip (published elsewhere)
+const bylineStrip = bylines.slice(0, 4).map((b) => ({
+  title: b.data.title,
+  publication: b.data.publication,
+  href: b.data.url,
+}));
+
+// Topic chips — quiet, footer-level. Most-used tags across published posts.
+const tagCounts = new Map<string, number>();
+for (const post of sorted) {
+  for (const tag of post.data.tags || []) {
+    tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
+  }
+}
+const topTopics = [...tagCounts.entries()]
+  .sort((a, b) => b[1] - a[1])
+  .slice(0, 9)
+  .map(([tag]) => tag);
 ---
 
-<BaseLayout title="Edition | Rod Machen" description="Writing on food, film, arts, and Austin culture.">
-  <section class="hero">
-    <h1>Edition</h1>
-    <p class="tagline">Writing by Rod Machen</p>
-  </section>
-
-  <div class="grid">
-    {gridCards.map((card) => (
-      <div class="card" style={`--card-accent: ${card.accent}`}>
-        <a href={card.href} class="card-header">
-          <h2>{card.label}</h2>
-          <span class="card-count">{card.count}</span>
-        </a>
-        <p class="card-desc">{card.description}</p>
-        {card.comingSoon ? (
-          <p class="coming-soon">Coming soon</p>
-        ) : card.items.length > 0 ? (
-          <ul class="card-list">
-            {card.items.map((item) => (
-              <li>
-                <a
-                  href={item.href}
-                  {...(card.key === 'byline' ? { target: '_blank', rel: 'noopener' } : {})}
-                >
-                  <span class="item-title">{item.title}</span>
-                  {item.subtitle && <span class="item-subtitle">{item.subtitle}</span>}
-                </a>
-              </li>
-            ))}
-          </ul>
-        ) : null}
-        <a href={card.href} class="card-link">
-          {card.key === 'archive' ? 'Browse all' : `View all ${card.label}`} &rarr;
-        </a>
-      </div>
-    ))}
+<BaseLayout
+  title="Edition | Rod Machen"
+  description="Writing on food, film, arts, and Austin culture by Rod Machen."
+  variant="home"
+>
+  <div class="wrap">
+    <div class="big3">
+      {big3.map((section) => (
+        <section class="sec" style={`--sec-accent: ${section.accentVar}`}>
+          <div class="sec-h">
+            <h2><a href={section.href}>{section.label}</a></h2>
+            <span class="lede">{section.lede}</span>
+          </div>
+
+          {section.items.length === 0 ? (
+            <p class="coming-soon">Coming soon.</p>
+          ) : (
+            section.items.map((item, i) => (
+              <article class:list={['feat', { lead: i === 0 }]}>
+                <span class="ix">{item.id}</span>
+                <div class="feat-body">
+                  <div class="meta">
+                    <span class="cat">{item.cat}</span>
+                    <span>{item.date}</span>
+                  </div>
+                  <a href={item.href}>
+                    <h3>{item.title}</h3>
+                  </a>
+                  {i === 0 && item.subtitle && <p class="dek">{item.subtitle}</p>}
+                </div>
+              </article>
+            ))
+          )}
+
+          <a href={section.href} class="sec-all">
+            All {section.label} ({section.count}) &rarr;
+          </a>
+        </section>
+      ))}
+    </div>
   </div>
 
-  <nav class="home-nav">
-    <a href="/archive/">Full Archive ({totalItems} posts)</a>
-    <a href="/topics/">Topics</a>
-  </nav>
+  {bylineStrip.length > 0 && (
+    <section class="bylines">
+      <div class="wrap inner">
+        <span class="lab">&#47;&#47; Bylines elsewhere &rarr;</span>
+        <ul>
+          {bylineStrip.map((b) => (
+            <li>
+              <a href={b.href} target="_blank" rel="noopener">
+                {b.title}<span class="src">{b.publication}</span>
+              </a>
+            </li>
+          ))}
+          <li class="more"><a href="/bylines/">All bylines &rarr;</a></li>
+        </ul>
+      </div>
+    </section>
+  )}
+
+  <div class="wrap">
+    <nav class="quiet" aria-label="More">
+      <a class="archive-link" href="/archive/">The Full Archive &middot; {totalItems} entries</a>
+      {topTopics.length > 0 && (
+        <div class="topics">
+          {topTopics.map((tag) => (
+            <a href={`/topics/${tag}/`}>{tag}</a>
+          ))}
+        </div>
+      )}
+    </nav>
+  </div>
 </BaseLayout>
 
 <style>
-  .hero {
-    text-align: center;
-    margin-bottom: 3rem;
-    padding: 2rem 0;
-  }
-
-  .hero h1 {
-    font-size: clamp(2.5rem, 8vw, 4rem);
-    font-weight: 300;
-    letter-spacing: 0.06em;
-    text-transform: uppercase;
-    margin-bottom: 0.5rem;
-  }
-
-  .tagline {
-    font-size: 1.1rem;
-    color: var(--color-text-light);
-    font-style: italic;
+  /* --- Big 3 ---------------------------------------------------------- */
+  .big3 {
+    display: grid;
+    grid-template-columns: 1fr;
   }
 
-  .grid {
-    display: grid;
-    grid-template-columns: repeat(3, 1fr);
-    gap: 1.5rem;
-    margin-bottom: 3rem;
+  @media (min-width: 920px) {
+    .big3 {
+      grid-template-columns: 1.25fr 1fr 1fr;
+    }
+    .big3 .sec + .sec {
+      border-left: var(--rule-thin) solid var(--rule);
+    }
   }
 
-  .card {
-    border: 1px solid var(--color-border);
-    border-top: 3px solid var(--card-accent);
-    padding: 1.25rem;
+  .sec {
+    padding: 1.9rem 1.6rem 2rem;
     display: flex;
     flex-direction: column;
   }
 
-  .card-header {
+  @media (max-width: 919px) {
+    .sec {
+      padding: 1.6rem 0 1.4rem;
+    }
+    .sec + .sec {
+      border-top: var(--rule-thin) solid var(--rule);
+    }
+  }
+
+  .sec-h {
     display: flex;
-    justify-content: space-between;
     align-items: baseline;
-    text-decoration: none;
+    gap: 0.6rem;
+    border-bottom: var(--rule-thick) solid var(--ink);
+    padding-bottom: 0.55rem;
     margin-bottom: 0.25rem;
   }
 
-  .card-header:hover {
-    text-decoration: none;
+  .sec-h h2 {
+    font-family: var(--font-display);
+    font-weight: 600;
+    font-size: var(--text-xl);
+    margin: 0;
   }
 
-  .card h2 {
-    font-family: var(--font-sans);
-    font-size: 1rem;
-    font-weight: 700;
-    color: var(--card-accent);
+  .sec-h h2 a:hover {
+    color: var(--sec-accent);
+  }
+
+  .sec-h .lede {
+    font-family: var(--font-mono);
+    font-size: var(--text-xs);
+    letter-spacing: 0.1em;
     text-transform: uppercase;
-    letter-spacing: 0.08em;
+    color: var(--sec-accent);
+    margin-left: auto;
+    text-align: right;
   }
 
-  .card-count {
-    font-family: var(--font-sans);
-    font-size: 0.8rem;
-    color: var(--color-text-light);
+  .feat {
+    display: grid;
+    grid-template-columns: 2.4rem 1fr;
+    gap: 0 0.85rem;
+    padding: 1rem 0;
+    border-bottom: var(--rule-thin) solid var(--rule-soft);
   }
 
-  .card-desc {
-    font-size: 0.85rem;
-    color: var(--color-text-light);
-    margin-bottom: 0.75rem;
+  .feat .ix {
+    font-family: var(--font-mono);
+    font-size: var(--text-xs);
+    color: var(--gold);
+    letter-spacing: 0.04em;
+    padding-top: 0.4rem;
+    line-height: 1.3;
   }
 
-  .card-list {
-    list-style: none;
-    flex: 1;
-    margin-bottom: 0.75rem;
+  .feat-body {
+    min-width: 0;
+  }
+
+  .feat .meta {
+    display: flex;
+    gap: 0.65rem;
+    font-family: var(--font-mono);
+    font-size: var(--text-xs);
+    letter-spacing: 0.05em;
+    text-transform: uppercase;
+    color: var(--ink-soft);
+    margin-bottom: 0.35rem;
   }
 
-  .card-list li {
-    padding: 0.25rem 0;
-    border-bottom: 1px solid var(--color-border);
+  .feat .meta .cat {
+    color: var(--sec-accent);
   }
 
-  .card-list li:first-child {
-    border-top: 1px solid var(--color-border);
+  .feat h3 {
+    font-family: var(--font-text);
+    font-weight: 600;
+    font-size: var(--text-lg);
+    line-height: 1.18;
+    letter-spacing: -0.005em;
+    margin: 0;
   }
 
-  .card-list a {
-    font-size: 0.85rem;
-    line-height: 1.3;
-    display: flex;
-    flex-direction: column;
+  .feat.lead h3 {
+    font-family: var(--font-display);
+    font-weight: 400;
+    font-size: 1.75rem;
+    line-height: 1.08;
   }
 
-  .item-subtitle {
-    font-size: 0.75rem;
-    color: var(--color-text-light);
+  .feat a:hover h3 {
+    color: var(--sec-accent);
+  }
+
+  .feat .dek {
+    font-size: 1rem;
     font-style: italic;
+    color: var(--ink-soft);
+    margin: 0.4rem 0 0;
   }
 
   .coming-soon {
-    font-family: var(--font-sans);
-    font-size: 0.85rem;
-    color: var(--color-text-light);
+    font-family: var(--font-mono);
+    font-size: var(--text-sm);
+    color: var(--ink-soft);
     font-style: italic;
-    flex: 1;
-    display: flex;
-    align-items: center;
+    padding: 1.2rem 0;
   }
 
-  .card-link {
-    font-family: var(--font-sans);
-    font-size: 0.8rem;
+  .sec-all {
     margin-top: auto;
-    padding-top: 0.5rem;
+    padding-top: 0.9rem;
+    font-family: var(--font-display);
+    font-size: var(--text-sm);
+    letter-spacing: 0.08em;
+    text-transform: uppercase;
+    color: var(--ink-soft);
+  }
+
+  .sec-all:hover {
+    color: var(--sec-accent);
   }
 
-  .home-nav {
+  /* --- Bylines strip (secondary) ------------------------------------- */
+  .bylines {
+    border-top: var(--rule-thin) solid var(--ink);
+    border-bottom: var(--rule-thin) solid var(--ink);
+    background: var(--paper-2);
+    margin-top: 0.5rem;
+  }
+
+  .bylines .inner {
     display: flex;
-    justify-content: center;
-    gap: 2rem;
-    padding: 2rem 0;
-    border-top: 1px solid var(--color-border);
+    flex-wrap: wrap;
+    align-items: baseline;
+    gap: 0.5rem 1.6rem;
+    padding-top: 1.1rem;
+    padding-bottom: 1.1rem;
   }
 
-  .home-nav a {
-    font-family: var(--font-sans);
-    font-size: 0.85rem;
-    color: var(--color-text-light);
+  .bylines .lab {
+    font-family: var(--font-mono);
+    font-size: var(--text-xs);
+    letter-spacing: 0.12em;
+    text-transform: uppercase;
+    color: var(--accent);
+    white-space: nowrap;
   }
 
-  @media (max-width: 768px) {
-    .grid {
-      grid-template-columns: repeat(2, 1fr);
-    }
+  .bylines ul {
+    list-style: none;
+    display: flex;
+    flex-wrap: wrap;
+    align-items: baseline;
+    gap: 0.4rem 1.5rem;
+    margin: 0;
+    padding: 0;
   }
 
-  @media (max-width: 500px) {
-    .grid {
-      grid-template-columns: 1fr;
-    }
+  .bylines li {
+    margin: 0;
+  }
 
-    .home-nav {
-      flex-direction: column;
-      align-items: center;
-      gap: 1rem;
-    }
+  .bylines a {
+    font-size: 1rem;
+    font-style: italic;
+    color: var(--ink-soft);
+    border-bottom: 1px solid transparent;
+  }
+
+  .bylines a:hover {
+    color: var(--ink);
+    border-color: var(--accent);
+  }
+
+  .bylines .src {
+    font-style: normal;
+    font-family: var(--font-mono);
+    font-size: 0.625rem;
+    letter-spacing: 0.06em;
+    text-transform: uppercase;
+    color: var(--gold);
+    margin-left: 0.4rem;
+  }
+
+  .bylines .more a {
+    font-style: normal;
+    font-family: var(--font-display);
+    font-size: var(--text-sm);
+    letter-spacing: 0.08em;
+    text-transform: uppercase;
+    color: var(--ink-soft);
+  }
+
+  /* --- Quiet topics / archive band ----------------------------------- */
+  .quiet {
+    padding: 1.8rem 0 0.5rem;
+    text-align: center;
+  }
+
+  .archive-link {
+    font-family: var(--font-display);
+    font-size: var(--text-sm);
+    letter-spacing: 0.12em;
+    text-transform: uppercase;
+    color: var(--ink-soft);
+  }
+
+  .archive-link:hover {
+    color: var(--accent);
+  }
+
+  .quiet .topics {
+    margin-top: 1rem;
+    display: flex;
+    flex-wrap: wrap;
+    justify-content: center;
+    gap: 0.5rem;
+  }
+
+  .quiet .topics a {
+    font-family: var(--font-mono);
+    font-size: var(--text-xs);
+    letter-spacing: 0.02em;
+    color: var(--ink-soft);
+    border: var(--rule-thin) solid var(--rule);
+    border-radius: 20px;
+    padding: 0.25rem 0.8rem;
+  }
+
+  .quiet .topics a:hover {
+    color: var(--accent);
+    border-color: var(--accent);
   }
 </style>
diff --git a/src/pages/rss.xml.ts b/src/pages/rss.xml.ts
index 04ae045..4e7a8e0 100644
--- a/src/pages/rss.xml.ts
+++ b/src/pages/rss.xml.ts
@@ -1,10 +1,10 @@
 import rss from '@astrojs/rss';
 import type { APIContext } from 'astro';
 import { getCollection } from 'astro:content';
-import { getPostSlug, getPostCategory } from '../utils/posts';
+import { getPostSlug, getPostCategory, getCategoryPath, getPublishedPosts } from '../utils/posts';
 
 export async function GET(context: APIContext) {
-  const posts = await getCollection('posts');
+  const posts = getPublishedPosts(await getCollection('posts'));
   const sorted = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
 
   return rss({
@@ -13,7 +13,7 @@ export async function GET(context: APIContext) {
     site: context.site!,
     items: sorted.map((post) => {
       const slug = getPostSlug(post.id, post.data);
-      const category = getPostCategory(post.data.category);
+      const category = getCategoryPath(getPostCategory(post.data.category));
       return {
         title: post.data.title,
         pubDate: post.data.date,
diff --git a/src/pages/topics/[tag].astro b/src/pages/topics/[tag].astro
index 432626b..b444561 100644
--- a/src/pages/topics/[tag].astro
+++ b/src/pages/topics/[tag].astro
@@ -4,23 +4,19 @@ import { getCollection } from 'astro:content';
 import BaseLayout from '../../layouts/BaseLayout.astro';
 import PageHeader from '../../components/PageHeader.astro';
 import PostCardList from '../../components/PostCardList.astro';
-import { postToListItem, bylineToListItem } from '../../utils/posts';
+import { postToListItem, bylineToListItem, getPublishedPosts } from '../../utils/posts';
 import type { ListItem } from '../../utils/posts';
 
 export const getStaticPaths = (async () => {
-  const posts = await getCollection('posts');
+  const posts = getPublishedPosts(await getCollection('posts'));
   const bylines = await getCollection('bylines');
 
   const tagSet = new Set<string>();
   for (const post of posts) {
-    for (const tag of post.data.tags || []) {
-      tagSet.add(tag);
-    }
+    for (const tag of post.data.tags || []) tagSet.add(tag);
   }
   for (const byline of bylines) {
-    for (const tag of byline.data.tags || []) {
-      tagSet.add(tag);
-    }
+    for (const tag of byline.data.tags || []) tagSet.add(tag);
   }
 
   return [...tagSet].map((tag) => ({
@@ -30,16 +26,12 @@ export const getStaticPaths = (async () => {
 }) satisfies GetStaticPaths;
 
 const { tag } = Astro.props;
-const posts = await getCollection('posts');
+const posts = getPublishedPosts(await getCollection('posts'));
 const bylines = await getCollection('bylines');
 
 const items: ListItem[] = [
-  ...posts
-    .filter((p) => p.data.tags?.includes(tag))
-    .map(postToListItem),
-  ...bylines
-    .filter((b) => b.data.tags?.includes(tag))
-    .map(bylineToListItem),
+  ...posts.filter((p) => p.data.tags?.includes(tag)).map(postToListItem),
+  ...bylines.filter((b) => b.data.tags?.includes(tag)).map(bylineToListItem),
 ].sort((a, b) => b.date.getTime() - a.date.getTime());
 ---
 
@@ -48,7 +40,7 @@ const items: ListItem[] = [
 
   <PostCardList items={items} />
 
-  <nav class="page-nav">
+  <nav class="page-nav" aria-label="Back">
     <a href="/topics/">&larr; All Topics</a>
   </nav>
 </BaseLayout>
@@ -56,10 +48,18 @@ const items: ListItem[] = [
 <style>
   .page-nav {
     text-align: center;
+    padding: 1rem 0 0.5rem;
   }
 
   .page-nav a {
-    font-family: var(--font-sans);
-    font-size: 0.85rem;
+    font-family: var(--font-display);
+    font-size: var(--text-sm);
+    letter-spacing: 0.08em;
+    text-transform: uppercase;
+    color: var(--ink-soft);
+  }
+
+  .page-nav a:hover {
+    color: var(--accent);
   }
 </style>
diff --git a/src/pages/topics/index.astro b/src/pages/topics/index.astro
index 7e8e7d2..dbd4d79 100644
--- a/src/pages/topics/index.astro
+++ b/src/pages/topics/index.astro
@@ -2,20 +2,19 @@
 import { getCollection } from 'astro:content';
 import BaseLayout from '../../layouts/BaseLayout.astro';
 import PageHeader from '../../components/PageHeader.astro';
+import { getPublishedPosts } from '../../utils/posts';
 
-const posts = await getCollection('posts');
+const posts = getPublishedPosts(await getCollection('posts'));
 const bylines = await getCollection('bylines');
 
 const tagCounts = new Map<string, number>();
 for (const post of posts) {
-  const tags = post.data.tags || [];
-  for (const tag of tags) {
+  for (const tag of post.data.tags || []) {
     tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
   }
 }
 for (const byline of bylines) {
-  const tags = byline.data.tags || [];
-  for (const tag of tags) {
+  for (const tag of byline.data.tags || []) {
     tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
   }
 }
@@ -24,13 +23,13 @@ const sortedTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]);
 ---
 
 <BaseLayout title="Topics | Edition">
-  <PageHeader title="Topics" />
+  <PageHeader title="Topics" subtitle="All subjects" count={sortedTags.length} countLabel="topic" />
 
-  <ul class="tag-list">
+  <ul class="tag-cloud">
     {sortedTags.map(([tag, count]) => (
       <li>
         <a href={`/topics/${tag}/`}>
-          {tag} <span class="count">{count}</span>
+          {tag}<span class="count">{count}</span>
         </a>
       </li>
     ))}
@@ -38,31 +37,38 @@ const sortedTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]);
 </BaseLayout>
 
 <style>
-  .tag-list {
+  .tag-cloud {
     list-style: none;
     display: flex;
     flex-wrap: wrap;
     justify-content: center;
-    gap: 0.75rem;
+    gap: 0.6rem;
+    padding: 0.5rem 0 2rem;
   }
 
-  .tag-list li a {
-    display: inline-block;
-    font-size: 0.9rem;
-    letter-spacing: 0.05em;
-    padding: 0.5rem 1rem;
-    border: 1px solid var(--color-border);
-    border-radius: 4px;
-    transition: border-color 0.2s;
+  .tag-cloud a {
+    display: inline-flex;
+    align-items: baseline;
+    gap: 0.4rem;
+    font-family: var(--font-mono);
+    font-size: var(--text-xs);
+    letter-spacing: 0.04em;
+    color: var(--ink-soft);
+    border: var(--rule-thin) solid var(--rule);
+    border-radius: 20px;
+    padding: 0.3rem 0.9rem;
+    text-decoration: none;
+    transition: color 0.15s, border-color 0.15s;
   }
 
-  .tag-list li a:hover {
-    border-color: var(--color-link);
+  .tag-cloud a:hover {
+    color: var(--accent);
+    border-color: var(--accent);
   }
 
   .count {
-    color: var(--color-text-light);
-    font-size: 0.8rem;
-    margin-left: 0.25rem;
+    font-size: 0.6rem;
+    color: var(--gold);
+    letter-spacing: 0;
   }
 </style>
diff --git a/src/plugins/remark-demote-headings.ts b/src/plugins/remark-demote-headings.ts
new file mode 100644
index 0000000..07ebf81
--- /dev/null
+++ b/src/plugins/remark-demote-headings.ts
@@ -0,0 +1,18 @@
+import { visit } from 'unist-util-visit';
+
+/**
+ * Demote every in-content Markdown heading by one level so the page <h1>
+ * supplied by the layout (the post title) is the sole <h1> on the page.
+ *
+ * Many posts — especially the newsletter issues — use `#` as in-issue section
+ * headers (Reading / Writing / Watching …), which would otherwise render as
+ * additional <h1> elements competing with the post title. Shifting `#`→<h2>,
+ * `##`→<h3>, etc. restores a single-h1 hierarchy. Depth is capped at 6.
+ */
+export default function remarkDemoteHeadings() {
+  return (tree: any) => {
+    visit(tree, 'heading', (node: any) => {
+      node.depth = Math.min(node.depth + 1, 6);
+    });
+  };
+}
diff --git a/src/styles/global.css b/src/styles/global.css
index 8aecb1e..ce69907 100644
--- a/src/styles/global.css
+++ b/src/styles/global.css
@@ -1,3 +1,10 @@
+/* =========================================================================
+   Edition — "The Ledger Broadsheet" design tokens
+   Light by default (cream paper, oxblood ink); dark = warm ink-at-night.
+   Translated from docs/design/mockups/edition-option-e.html, dark palette
+   informed by edition-option-d.html ("The Night Archive").
+   ========================================================================= */
+
 *,
 *::before,
 *::after {
@@ -7,49 +14,163 @@
 }
 
 :root {
-  --font-serif: Georgia, 'Times New Roman', serif;
-  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
-  --color-text: #333;
-  --color-text-light: #666;
-  --color-link: #1a5276;
-  --color-link-hover: #0e3a53;
-  --color-bg: #fff;
-  --color-border: #e0e0e0;
-  --color-bg-muted: #f0f0f0;
-  --color-bg-muted-hover: #e0e0e0;
-  --max-width: 1100px;
+  /* Native form controls, scrollbars, and UA defaults follow the theme. */
+  color-scheme: light;
+
+  /* --- Type families ------------------------------------------------- */
+  --font-display: 'Fraunces', Georgia, 'Times New Roman', serif; /* masthead, headlines */
+  --font-text: 'Newsreader', 'Iowan Old Style', Georgia, serif;  /* body prose */
+  --font-mono: 'Spline Sans Mono', ui-monospace, Menlo, monospace; /* metadata only */
+
+  /* --- Type scale ---------------------------------------------------- */
+  --text-xs: 0.6875rem;  /* 11px — mono labels */
+  --text-sm: 0.8125rem;  /* 13px */
+  --text-base: 1.1875rem;/* 19px — broadsheet body */
+  --text-lg: 1.3125rem;  /* 21px */
+  --text-xl: 1.6rem;     /* ~26px — section headings */
+  --text-2xl: 2.2rem;
+  --display-sm: clamp(2.5rem, 8vw, 4.75rem);
+  --display-lg: clamp(3rem, 11vw, 7.75rem); /* masthead */
+
+  /* --- Rules & spacing ----------------------------------------------- */
+  --rule-thin: 1px;
+  --rule-thick: 2px;
+  --tracking-mono: 0.08em;
+  --tracking-nav: 0.16em;
+  --space-section: 2rem;
+  --max-width: 1180px;
+
+  /* --- Color: light (default) ---------------------------------------- */
+  --paper: #f4efe4;
+  --paper-2: #ece5d4;
+  --ink: #1c1815;
+  --ink-soft: #4a4239;
+  --rule: #cabf9f;
+  --rule-soft: #ddd4bd;
+  /* Accents are darkened from the mockup so small metadata text, links, and
+     chips meet WCAG AA (4.5:1) on both paper tones; large display headings keep
+     the warm Ledger character. oxblood/taupe already passed and are unchanged. */
+  --accent: #8a2b1f;     /* oxblood */
+  --accent-2: #9c4d34;   /* clay */
+  --gold: #7a6122;
+
+  /* per-section accents — light */
+  --accent-newsletter: #8a2b1f; /* oxblood */
+  --accent-articles: #9c4d34;   /* clay */
+  --accent-reviews: #7a6122;    /* ochre/gold */
+  --accent-bylines: #6f6450;    /* muted taupe */
+
+  /* --- Legacy aliases (consumed by not-yet-restyled pages/components) - */
+  --font-serif: var(--font-text);
+  --font-sans: var(--font-display);
+  --color-text: var(--ink);
+  --color-text-light: var(--ink-soft);
+  --color-link: var(--accent);
+  --color-link-hover: var(--accent-2);
+  --color-bg: var(--paper);
+  --color-border: var(--rule);
+  --color-bg-muted: var(--paper-2);
+  --color-bg-muted-hover: var(--rule-soft);
+}
+
+/* --- Color: dark (warm ink-at-night) --------------------------------- */
+html[data-theme='dark'] {
+  color-scheme: dark;
+  --paper: #16130f;
+  --paper-2: #1f1a14;
+  --ink: #ece4d2;
+  --ink-soft: #b3a98f;
+  --rule: #473e2d;
+  --rule-soft: #2c261c;
+  --accent: #e07a5f;     /* ember */
+  --accent-2: #c8643f;
+  --gold: #c9a14a;
+
+  --accent-newsletter: #e07a5f;
+  --accent-articles: #d98c6a;
+  --accent-reviews: #c9a14a;
+  --accent-bylines: #a99a80;
+}
+
+@media (prefers-color-scheme: dark) {
+  html:not([data-theme]) {
+    color-scheme: dark;
+    --paper: #16130f;
+    --paper-2: #1f1a14;
+    --ink: #ece4d2;
+    --ink-soft: #b3a98f;
+    --rule: #473e2d;
+    --rule-soft: #2c261c;
+    --accent: #e07a5f;
+    --accent-2: #c8643f;
+    --gold: #c9a14a;
+
+    --accent-newsletter: #e07a5f;
+    --accent-articles: #d98c6a;
+    --accent-reviews: #c9a14a;
+    --accent-bylines: #a99a80;
+  }
 }
 
 html {
   font-size: 18px;
-  line-height: 1.7;
+  line-height: 1.6;
+  -webkit-text-size-adjust: 100%;
 }
 
 body {
-  font-family: var(--font-serif);
-  color: var(--color-text);
-  background: var(--color-bg);
+  font-family: var(--font-text);
+  font-size: var(--text-base);
+  line-height: 1.6;
+  color: var(--ink);
+  background: var(--paper);
+  background-image: radial-gradient(var(--rule-soft) 0.5px, transparent 0.5px);
+  background-size: 22px 22px;
+  -webkit-font-smoothing: antialiased;
+  text-rendering: optimizeLegibility;
 }
 
 a {
-  color: var(--color-link);
+  color: inherit;
   text-decoration: none;
 }
 
 a:hover {
-  color: var(--color-link-hover);
-  text-decoration: underline;
+  color: var(--accent);
+}
+
+/* Keyboard focus: links use color:inherit, so hover color is no focus signal.
+   A visible outline is required for keyboard navigation in both themes. */
+:focus-visible {
+  outline: 2px solid var(--accent);
+  outline-offset: 2px;
+  border-radius: 1px;
+}
+
+/* Honor reduced-motion: the UI only uses short color/background transitions,
+   but disable them (and any animation) for users who request less motion. */
+@media (prefers-reduced-motion: reduce) {
+  *,
+  *::before,
+  *::after {
+    animation-duration: 0.01ms !important;
+    animation-iteration-count: 1 !important;
+    transition-duration: 0.01ms !important;
+    scroll-behavior: auto !important;
+  }
 }
 
 h1, h2, h3, h4 {
-  font-family: var(--font-sans);
-  line-height: 1.3;
+  font-family: var(--font-display);
+  font-weight: 600;
+  line-height: 1.1;
+  letter-spacing: -0.01em;
   margin-bottom: 0.5rem;
 }
 
-h1 { font-size: 2rem; }
-h2 { font-size: 1.5rem; }
-h3 { font-size: 1.25rem; }
+h1 { font-size: var(--text-2xl); font-weight: 400; }
+h2 { font-size: var(--text-xl); }
+h3 { font-size: var(--text-lg); }
 
 p {
   margin-bottom: 1.2rem;
@@ -61,35 +182,74 @@ img {
 }
 
 blockquote {
-  border-left: 3px solid var(--color-border);
-  padding-left: 1.2rem;
-  margin: 1.5rem 0;
-  color: var(--color-text-light);
+  border-top: var(--rule-thick) solid var(--ink);
+  border-bottom: var(--rule-thick) solid var(--ink);
+  margin: 2rem 0;
+  padding: 1.5rem 1.75rem;
+  font-family: var(--font-display);
+  font-weight: 300;
   font-style: italic;
+  font-size: 1.5rem;
+  line-height: 1.3;
+  color: var(--ink);
 }
 
 hr {
   border: none;
-  border-top: 1px solid var(--color-border);
+  border-top: var(--rule-thin) solid var(--rule);
   margin: 2rem 0;
 }
 
-.container {
+/* Skip link: hidden until keyboard-focused, then pinned to the top-left. */
+.skip-link {
+  position: absolute;
+  left: -9999px;
+  top: 0;
+  z-index: 100;
+  padding: 0.6rem 1rem;
+  background: var(--ink);
+  color: var(--paper);
+  font-family: var(--font-mono);
+  font-size: var(--text-sm);
+}
+
+.skip-link:focus {
+  left: 0;
+  color: var(--paper);
+}
+
+/* --- Layout helpers -------------------------------------------------- */
+.container,
+.wrap {
   max-width: var(--max-width);
   margin: 0 auto;
   padding: 0 1.5rem;
 }
 
-/* Cloudinary image sizes */
+/* Mono metadata label utility */
+.mono-label {
+  font-family: var(--font-mono);
+  font-size: var(--text-xs);
+  letter-spacing: var(--tracking-mono);
+  text-transform: uppercase;
+  color: var(--ink-soft);
+}
+
+/* --- Cloudinary image sizes (preserved) ------------------------------ */
 figure.img-small   { max-width: 300px; margin: 1.5rem auto; }
 figure.img-medium  { max-width: 600px; margin: 1.5rem auto; }
 figure.img-large   { max-width: 800px; margin: 1.5rem 0; }
 figure.img-full    { max-width: 100%; margin: 1.5rem 0; }
-figure img         { width: 100%; height: auto; display: block; border-radius: 4px; }
-figcaption         { font-family: var(--font-sans); font-size: 0.8rem; color: var(--color-text-light); text-align: center; margin-top: 0.5rem; }
+figure img         { width: 100%; height: auto; display: block; }
+figcaption {
+  font-family: var(--font-mono);
+  font-size: var(--text-xs);
+  letter-spacing: 0.04em;
+  color: var(--ink-soft);
+  text-align: center;
+  margin-top: 0.5rem;
+}
 
 @media (max-width: 600px) {
-  html {
-    font-size: 16px;
-  }
+  html { font-size: 16px; }
 }
diff --git a/src/utils/posts.test.ts b/src/utils/posts.test.ts
new file mode 100644
index 0000000..5824824
--- /dev/null
+++ b/src/utils/posts.test.ts
@@ -0,0 +1,204 @@
+import { describe, it, expect } from 'vitest';
+import {
+  getPostSlug,
+  getPostCategory,
+  formatDate,
+  extractFirstImage,
+  getPostsByCategory,
+  getPublishedPosts,
+  getCategoryPath,
+  CATEGORY_CONFIG,
+} from './slugs';
+
+describe('getPostSlug', () => {
+  it('returns data.slug when present', () => {
+    expect(getPostSlug('2014-02-20-something', { slug: 'custom-slug' })).toBe('custom-slug');
+  });
+
+  it('strips leading date prefix from id', () => {
+    expect(getPostSlug('2014-02-20-first-look-kerlin-bbq')).toBe('first-look-kerlin-bbq');
+  });
+
+  it('returns id unchanged when no date prefix', () => {
+    expect(getPostSlug('my-post')).toBe('my-post');
+  });
+
+  it('returns id unchanged when data has no slug', () => {
+    expect(getPostSlug('2023-01-15-some-post', {})).toBe('some-post');
+  });
+});
+
+describe('getPostCategory', () => {
+  it('returns the string category as-is', () => {
+    expect(getPostCategory('review')).toBe('review');
+  });
+
+  it('returns first element of array category', () => {
+    expect(getPostCategory(['newsletter', 'article'])).toBe('newsletter');
+  });
+
+  it('returns "article" when undefined', () => {
+    expect(getPostCategory(undefined)).toBe('article');
+  });
+
+  it('returns "article" for empty array', () => {
+    expect(getPostCategory([])).toBe('article');
+  });
+});
+
+describe('formatDate', () => {
+  it('formats a date in en-US locale with short month', () => {
+    const result = formatDate(new Date('2014-02-20T12:00:00.000Z'));
+    expect(result).toMatch(/Feb/);
+    expect(result).toMatch(/2014/);
+  });
+
+  it('includes the numeric day', () => {
+    // Use local-time constructor to avoid UTC-to-local day shift
+    const result = formatDate(new Date(2023, 5, 11));
+    expect(result).toMatch(/Jun/);
+    expect(result).toMatch(/2023/);
+    expect(result).toMatch(/11/);
+  });
+});
+
+describe('extractFirstImage', () => {
+  it('returns undefined for undefined input', () => {
+    expect(extractFirstImage(undefined)).toBeUndefined();
+  });
+
+  it('returns undefined when no image is found', () => {
+    expect(extractFirstImage('No images here, just text.')).toBeUndefined();
+  });
+
+  it('extracts a Cloudinary image URL', () => {
+    const markdown = '![alt text](https://res.cloudinary.com/example/image/upload/v1/foo.jpg)';
+    expect(extractFirstImage(markdown)).toBe(
+      'https://res.cloudinary.com/example/image/upload/v1/foo.jpg',
+    );
+  });
+
+  it('extracts a local /images/ path', () => {
+    const markdown = '![photo](/images/my-photo.jpg)';
+    expect(extractFirstImage(markdown)).toBe('/images/my-photo.jpg');
+  });
+
+  it('strips optional title from image markdown', () => {
+    const markdown = '![alt](https://res.cloudinary.com/ex/img/foo.jpg "Title here")';
+    expect(extractFirstImage(markdown)).toBe('https://res.cloudinary.com/ex/img/foo.jpg');
+  });
+
+  it('extracts the first image when multiple are present', () => {
+    const markdown =
+      'Text\n![one](/images/first.jpg)\nMore text\n![two](/images/second.jpg)';
+    expect(extractFirstImage(markdown)).toBe('/images/first.jpg');
+  });
+});
+
+describe('getPostsByCategory', () => {
+  const makePost = (id: string, category?: string | string[]) => ({
+    id,
+    data: { category, date: new Date(), title: id },
+  });
+
+  it('groups posts by their category', () => {
+    const posts = [
+      makePost('post-a', 'review'),
+      makePost('post-b', 'newsletter'),
+      makePost('post-c', 'review'),
+    ];
+    const grouped = getPostsByCategory(posts);
+    expect(grouped['review']).toHaveLength(2);
+    expect(grouped['newsletter']).toHaveLength(1);
+  });
+
+  it('defaults to "article" for posts without a category', () => {
+    const posts = [makePost('post-x', undefined)];
+    const grouped = getPostsByCategory(posts);
+    expect(grouped['article']).toHaveLength(1);
+  });
+
+  it('uses the first element of an array category', () => {
+    const posts = [makePost('post-y', ['essay', 'article'])];
+    const grouped = getPostsByCategory(posts);
+    expect(grouped['essay']).toHaveLength(1);
+  });
+
+  it('returns an empty object for an empty input array', () => {
+    expect(getPostsByCategory([])).toEqual({});
+  });
+});
+
+describe('CATEGORY_CONFIG', () => {
+  it('does not contain an essay category', () => {
+    expect(Object.keys(CATEGORY_CONFIG)).not.toContain('essay');
+  });
+
+  it('maps article to plural path "articles"', () => {
+    expect(CATEGORY_CONFIG['article'].path).toBe('articles');
+  });
+
+  it('maps review to plural path "reviews"', () => {
+    expect(CATEGORY_CONFIG['review'].path).toBe('reviews');
+  });
+
+  it('maps newsletter to path "newsletter"', () => {
+    expect(CATEGORY_CONFIG['newsletter'].path).toBe('newsletter');
+  });
+
+  it('maps byline to plural path "bylines"', () => {
+    expect(CATEGORY_CONFIG['byline'].path).toBe('bylines');
+  });
+});
+
+describe('getPublishedPosts', () => {
+  const makePost = (id: string, published?: boolean) => ({
+    id,
+    data: { date: new Date(), title: id, published },
+  });
+
+  it('filters out posts with published === false', () => {
+    const posts = [makePost('draft', false), makePost('live', true)];
+    const result = getPublishedPosts(posts);
+    expect(result).toHaveLength(1);
+    expect(result[0].id).toBe('live');
+  });
+
+  it('keeps posts with published === undefined', () => {
+    const posts = [makePost('no-flag'), makePost('draft', false)];
+    const result = getPublishedPosts(posts);
+    expect(result).toHaveLength(1);
+    expect(result[0].id).toBe('no-flag');
+  });
+
+  it('keeps posts with published === true', () => {
+    const posts = [makePost('published', true)];
+    expect(getPublishedPosts(posts)).toHaveLength(1);
+  });
+
+  it('returns empty array for empty input', () => {
+    expect(getPublishedPosts([])).toEqual([]);
+  });
+});
+
+describe('getCategoryPath', () => {
+  it('returns "articles" for article', () => {
+    expect(getCategoryPath('article')).toBe('articles');
+  });
+
+  it('returns "reviews" for review', () => {
+    expect(getCategoryPath('review')).toBe('reviews');
+  });
+
+  it('returns "newsletter" for newsletter', () => {
+    expect(getCategoryPath('newsletter')).toBe('newsletter');
+  });
+
+  it('returns "bylines" for byline', () => {
+    expect(getCategoryPath('byline')).toBe('bylines');
+  });
+
+  it('falls back to the category key for unknown categories', () => {
+    expect(getCategoryPath('unknown')).toBe('unknown');
+  });
+});
diff --git a/src/utils/posts.ts b/src/utils/posts.ts
index a1c6bb6..848bc08 100644
--- a/src/utils/posts.ts
+++ b/src/utils/posts.ts
@@ -1,5 +1,7 @@
 import type { CollectionEntry } from 'astro:content';
 import { getCldImageUrl } from 'astro-cloudinary/helpers';
+import { getPostSlug, getPostCategory, getCategoryPath, extractFirstImage } from './slugs';
+export { getPostSlug, getPostCategory, formatDate, extractFirstImage, getPostsByCategory, getPublishedPosts, getCategoryPath, CATEGORY_CONFIG } from './slugs';
 
 export type ListItem = {
   type: 'post' | 'byline';
@@ -15,27 +17,12 @@ export type ListItem = {
 
 const CLOUDINARY_PATTERN = /res\.cloudinary\.com/;
 
-export function extractFirstImage(markdown: string | undefined): string | undefined {
-  if (!markdown) return undefined;
-  const match = markdown.match(/!\[.*?\]\(((?:\/images\/|https?:\/\/res\.cloudinary\.com\/)\S+?)(?:\s+"[^"]*")?\)/);
-  return match?.[1];
-}
-
-export function formatDate(date: Date): string {
-  return date.toLocaleDateString('en-US', {
-    year: 'numeric',
-    month: 'short',
-    day: 'numeric',
-  });
-}
-
 export function postToListItem(p: CollectionEntry<'posts'>): ListItem {
   const slug = getPostSlug(p.id, p.data);
   const cat = getPostCategory(p.data.category);
 
   let image: string | undefined;
   if (p.data.thumbnail) {
-    // Thumbnail is a Cloudinary public ID — build a square-cropped URL
     image = getCldImageUrl({
       src: p.data.thumbnail,
       width: 200,
@@ -45,7 +32,6 @@ export function postToListItem(p: CollectionEntry<'posts'>): ListItem {
   } else {
     const extracted = extractFirstImage(p.body);
     if (extracted && CLOUDINARY_PATTERN.test(extracted)) {
-      // Build a square-cropped thumbnail from the Cloudinary URL
       image = extracted.replace(
         /\/upload\//,
         '/upload/w_200,h_200,c_fill,g_auto,f_auto,q_auto/',
@@ -60,7 +46,7 @@ export function postToListItem(p: CollectionEntry<'posts'>): ListItem {
     date: p.data.date,
     title: p.data.title || slug,
     subtitle: p.data.subTitle,
-    href: `/${cat}/${slug}/`,
+    href: `/${getCategoryPath(cat)}/${slug}/`,
     category: cat,
     tags: p.data.tags || [],
     image,
@@ -85,51 +71,3 @@ export function bylineToListItem(b: CollectionEntry<'bylines'>): ListItem {
     image: PUBLICATION_LOGOS[b.data.publication],
   };
 }
-
-export const CATEGORY_CONFIG: Record<string, { label: string; description: string; accent: string }> = {
-  newsletter: {
-    label: 'Newsletter',
-    description: 'The Hangman Chronicles',
-    accent: '#117a65',
-  },
-  byline: {
-    label: 'Bylines',
-    description: 'Published at external outlets',
-    accent: '#2e4057',
-  },
-  article: {
-    label: 'Articles',
-    description: 'Long-form writing and original pieces',
-    accent: '#1a5276',
-  },
-  essay: {
-    label: 'Essays',
-    description: 'Personal essays and opinion pieces',
-    accent: '#6c3483',
-  },
-  review: {
-    label: 'Reviews',
-    description: 'Arts and Food reviews',
-    accent: '#b9770e',
-  },
-};
-
-export function getPostSlug(id: string, data?: { slug?: string }): string {
-  if (data?.slug) return data.slug;
-  return id.replace(/^\d{4}-\d{2}-\d{2}-/, '');
-}
-
-export function getPostCategory(category: string | string[] | undefined): string {
-  if (Array.isArray(category)) return category[0] || 'article';
-  return category || 'article';
-}
-
-export function getPostsByCategory(posts: CollectionEntry<'posts'>[]): Record<string, CollectionEntry<'posts'>[]> {
-  const grouped: Record<string, CollectionEntry<'posts'>[]> = {};
-  for (const post of posts) {
-    const cat = getPostCategory(post.data.category);
-    if (!grouped[cat]) grouped[cat] = [];
-    grouped[cat].push(post);
-  }
-  return grouped;
-}
diff --git a/src/utils/slugs.ts b/src/utils/slugs.ts
new file mode 100644
index 0000000..b28ec04
--- /dev/null
+++ b/src/utils/slugs.ts
@@ -0,0 +1,88 @@
+export function getPostSlug(id: string, data?: { slug?: string }): string {
+  if (data?.slug) return data.slug;
+  return id.replace(/^\d{4}-\d{2}-\d{2}-/, '');
+}
+
+export function getPostCategory(category: string | string[] | undefined): string {
+  if (Array.isArray(category)) return category[0] || 'article';
+  return category || 'article';
+}
+
+export function formatDate(date: Date): string {
+  return date.toLocaleDateString('en-US', {
+    year: 'numeric',
+    month: 'short',
+    day: 'numeric',
+  });
+}
+
+export function extractFirstImage(markdown: string | undefined): string | undefined {
+  if (!markdown) return undefined;
+  const match = markdown.match(
+    /!\[.*?\]\(((?:\/images\/|https?:\/\/res\.cloudinary\.com\/)\S+?)(?:\s+"[^"]*")?\)/,
+  );
+  return match?.[1];
+}
+
+type PostLike = {
+  data: {
+    category?: string | string[];
+    [key: string]: unknown;
+  };
+};
+
+export function getPostsByCategory<T extends PostLike>(posts: T[]): Record<string, T[]> {
+  const grouped: Record<string, T[]> = {};
+  for (const post of posts) {
+    const cat = getPostCategory(post.data.category);
+    if (!grouped[cat]) grouped[cat] = [];
+    grouped[cat].push(post);
+  }
+  return grouped;
+}
+
+type PublishableLike = {
+  data: {
+    published?: boolean;
+    [key: string]: unknown;
+  };
+};
+
+export function getPublishedPosts<T extends PublishableLike>(posts: T[]): T[] {
+  return posts.filter((p) => p.data.published !== false);
+}
+
+export function getCategoryPath(category: string): string {
+  return CATEGORY_CONFIG[category]?.path ?? category;
+}
+
+// Per-section accents are the LIGHT-mode values of the global.css
+// --accent-<section> tokens (dark variants live in global.css). Keeping them
+// here lets components that can't read CSS vars (e.g. inline placeholder
+// backgrounds) stay aligned with the token system.
+export const CATEGORY_CONFIG: Record<string, { label: string; description: string; accent: string; path: string }> = {
+  newsletter: {
+    label: 'Newsletter',
+    description: 'The Hangman Chronicles',
+    accent: '#8a2b1f', // oxblood
+    path: 'newsletter',
+  },
+  byline: {
+    label: 'Bylines',
+    description: 'Published at external outlets',
+    accent: '#6f6450', // muted taupe
+    path: 'bylines',
+  },
+  article: {
+    label: 'Articles',
+    description: 'Long-form writing and original pieces',
+    accent: '#b8654a', // clay
+    path: 'articles',
+  },
+  review: {
+    label: 'Reviews',
+    description: 'Arts and Food reviews',
+    accent: '#9a7b32', // ochre/gold
+    path: 'reviews',
+  },
+};
diff --git a/vercel.json b/vercel.json
index 5fa4002..fae2d4c 100644
--- a/vercel.json
+++ b/vercel.json
@@ -19,6 +19,26 @@
       "source": "/categories/:path*",
       "destination": "/topics/:path*",
       "permanent": true
+    },
+    {
+      "source": "/article/:path*",
+      "destination": "/articles/:path*",
+      "permanent": true
+    },
+    {
+      "source": "/review/:path*",
+      "destination": "/reviews/:path*",
+      "permanent": true
+    },
+    {
+      "source": "/essay/:path*",
+      "destination": "/articles/:path*",
+      "permanent": true
+    },
+    {
+      "source": "/byline/:path*",
+      "destination": "/bylines/:path*",
+      "permanent": true
     }
   ]
 }
diff --git a/vitest.config.ts b/vitest.config.ts
new file mode 100644
index 0000000..4ac6027
--- /dev/null
+++ b/vitest.config.ts
@@ -0,0 +1,7 @@
+import { defineConfig } from 'vitest/config';
+
+export default defineConfig({
+  test: {
+    environment: 'node',
+  },
+});
```
