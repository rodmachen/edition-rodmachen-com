# Task: Steps 3–5 — Dependency bump, content model, URL structure

You are an implementation subagent in `/Users/rodmachen/code/edition-rodmachen-com` (Astro 5 static blog on Vercel), branch `feature/edition-rebuild`. Execute Steps 3, 4, 5 of the plan `docs/plans/edition-rebuild-and-rodmachen-home.md` in order. Read that plan file first for full context. Do not ask for confirmation — execute directly.

## Context from prior steps

- Vitest + CI exist (Step 1). Pure helpers (`getPostSlug`, `getPostCategory`, `formatDate`, `extractFirstImage`, `getPostsByCategory`) were extracted to `src/utils/slugs.ts`; `src/utils/posts.ts` re-exports them. Tests live in `src/utils/posts.test.ts` (20 tests). CI workflow sets `PUBLIC_CLOUDINARY_CLOUD_NAME`.
- Working tree is clean except `docs/implementation/` (orchestration artifacts — NEVER stage anything under it).
- `src/content/posts/a-week-of-tennis.md` has `published: false` (committed in Step 2); draft *filtering* is yours in Step 4.
- Workflow rules: one atomic commit per step; after each step's verification passes, commit, push, append ` ✅` to that step's heading in the plan file and commit that mark (may be folded into the step commit), and update the step's checklist line in the PR description (`gh pr view --json body -q .body` → edit line → `gh pr edit --body`). Commit messages: summary line, body with why + "Step N" + what was verified, trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

## Step 3 — Dependency bump (within Astro 5). Mode: tests-alongside

- Bump `astro`, `@astrojs/vercel`, `@astrojs/rss` to latest **v5-compatible** versions (astro 5.18.x-ish, @astrojs/vercel 8.2.x, @astrojs/rss 4.0.x). Do NOT move to Astro 6 — `astro-cloudinary@1.3.5` peer-depends on `astro ^5.0.0`.
- Fix `package.json` `name` to `edition-rodmachen-com`. Keep `cheerio`/`turndown` (used by `scripts/*.mjs`).
- Run `npm audit` and record the summary in the result JSON.
- **Verify:** `npm run build`, `npx vitest run`, `npx astro check` green; a built post page in `dist/` still contains Cloudinary `<figure>`/srcset markup (the custom remark Cloudinary plugin must survive).

## Step 4 — Content model: remove essay, add draft filtering. Mode: TDD

- Write failing tests FIRST (in `src/utils/posts.test.ts` or a sibling) for: category→path mapping and the draft filter; then implement.
- Drop `essay` from the schema enum in `src/content.config.ts` and from `CATEGORY_CONFIG`.
- Add a `path` field per category in `CATEGORY_CONFIG`: `article` → `articles`, `review` → `reviews`, `newsletter` → `newsletter`, `byline` → `bylines`.
- Add `getPublishedPosts()` (filters out `published === false`) and use it at EVERY `getCollection('posts')` call site: `src/pages/index.astro`, `src/pages/[category]/[slug].astro`, `src/pages/archive/[...page].astro`, `src/pages/topics/index.astro`, `src/pages/topics/[tag].astro`, `src/pages/rss.xml.ts`. Grep for `getCollection` to catch any others.
- **Verify:** `npx vitest run` green; after `npm run build`: no `a-week-of-tennis` page anywhere in `dist/`, no `dist/essay/` directory.

## Step 5 — URL structure + redirects. Mode: TDD

- Tests first for href/slug mapping (plural paths) in the pure helpers; then implement.
- Generate post routes from `CATEGORY_CONFIG[].path` (plural) in `src/pages/[category]/[slug].astro` and the section index route. Move `src/pages/byline/` to `src/pages/bylines/`.
- All post hrefs flow through `postToListItem()` / `getPostSlug()` / `getPostCategory()` — keep the change centralized there.
- `vercel.json`: add permanent redirects `/article/:path*` → `/articles/:path*`, `/review/:path*` → `/reviews/:path*`, `/essay/:path*` → `/articles/:path*`, `/byline/:path*` → `/bylines/:path*`. Confirm existing `/p/:slug` → `/newsletter/:slug/` redirects remain intact. Mind `trailingSlash: 'always'` semantics — make sure redirect destinations don't double-slash or drop the trailing slash.
- **Verify:** `npm run build`; `dist/articles/`, `dist/reviews/`, `dist/newsletter/` contain post folders; NO `dist/article/` or `dist/review/` directories; `dist/rss.xml` contains no `/article/` hrefs; vitest green.
- Preview-deploy redirect check: after pushing, try to obtain the Vercel preview URL for this branch (e.g. `gh pr view --json statusCheckRollup` / deployment statuses / `gh api repos/{owner}/{repo}/deployments`). If you get one, `curl -sI` an old singular post URL and confirm 301/308 to the plural path; record the result. If no preview URL is obtainable, record `"preview_redirect_check": "deferred"` — do not block on it.

## Final checks

- After the last push: `gh run watch --exit-status` (or poll `gh run list --branch feature/edition-rebuild`) — CI must be green.
- All three step headings carry ✅ in the plan file; PR checklist updated for Steps 3–5.

## Result output (required)

Write JSON to `docs/implementation/edition-rebuild-and-rodmachen-home/results/steps-3-5.json`:

```json
{
  "steps": [3, 4, 5],
  "status": "success" | "partial" | "failure",
  "per_step": {
    "3": {"status": "...", "commit": "...", "versions": {"astro": "...", "@astrojs/vercel": "...", "@astrojs/rss": "..."}, "npm_audit": "..."},
    "4": {"status": "...", "commit": "..."},
    "5": {"status": "...", "commit": "...", "preview_redirect_check": "..."}
  },
  "ci_run_url": "...",
  "decisions": ["..."],
  "assumptions": ["..."],
  "blockers": ["..."]
}
```

If a step fails its verification, STOP there (do not start the next step), and write the JSON with what completed and the failure detail.
