# Task: Phase 5 / Step 15 — Fix review feedback

You are the feedback agent in /Users/rodmachen/code/edition-rodmachen-com, branch feature/edition-rebuild. Do not ask for confirmation — execute directly.

The Opus review of PR #1 found ZERO blocking and 9 non-blocking findings. Address every finding with best judgment; defer only with a clear reason. The review document follows below; the raw findings JSON is at docs/implementation/edition-rebuild-and-rodmachen-home/results/review.json (read it for full detail on each item).

Guidance per finding:
1 (vercel.json trailing-slash variants) — fix; mirror the /categories pattern exactly.
2 (slugs.ts accent drift) — fix; prefer the token-reading approach if it is low-risk, otherwise sync the hex values; either way correct the comment and update any test fixtures.
3 (PostCardList/PostList catalog restyle) — fix; restyle to the ruled catalog/ledger idiom consistent with src/pages/[category]/index.astro; keep CldImage support in PostCardList (bylines logos). This is the largest item — keep the markup churn minimal and the visual language aligned with the section pages.
4 (essay in template enum) — fix.
5 (per-section meta descriptions) — fix; write one good sentence per section (newsletter mentions "The Hangman Chronicles").
6 (hub h1 accessible name) — fix (space before the span is simplest).
7 ("The Edition" on hub card) — fix; the name is "Edition".
8 (CI double-runs) — fix; scope push to master AND add the concurrency cancel block.
9 (robots.txt) — fix; add public/robots.txt with the sitemap line.

Constraints:
- Never stage anything under docs/implementation/.
- Run the full verification before committing: npx vitest run, npx astro check, npm run build — all green. Update tests if finding 2 changes tested values.
- Single commit, message: "Fix review feedback: <brief summary>" with a body listing the findings addressed (by number), referencing the Opus review, and what was verified. Trailer: Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
- Push, then confirm CI green (gh run watch --exit-status on the latest run for this branch).
- Append " ✅" to the "## Step 15: Fix review feedback" heading in docs/plans/edition-rebuild-and-rodmachen-home.md and include that mark in the same commit (it IS review-feedback work). Update the PR description: mark Step 15 done in the checklist.
- Write docs/implementation/edition-rebuild-and-rodmachen-home/feedback-report.md listing: what was changed (per finding), what was deferred and why (should be nothing, but record honestly), and any new issues surfaced during fixes. This file is orchestration output — do NOT commit it.

## Result output (required)

Write JSON to docs/implementation/edition-rebuild-and-rodmachen-home/results/feedback.json:

{
  "step": 15,
  "status": "success" | "failure",
  "commit": "...",
  "ci_run_url": "...",
  "addressed": [1,2,3,4,5,6,7,8,9],
  "deferred": [{"finding": n, "reason": "..."}],
  "new_issues": ["..."],
  "blockers": ["..."]
}

---

## Review document

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
