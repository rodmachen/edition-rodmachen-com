# Task: Step 14 — README + PR description final pass

You are a subagent in `/Users/rodmachen/code/edition-rodmachen-com`, branch `feature/edition-rebuild`. Execute Step 14 of `docs/plans/edition-rebuild-and-rodmachen-home.md` — read the plan first. Do not ask for confirmation — execute directly.

## Work

Rewrite `README.md` to document:
- The two-site repo layout: `/` = edition.rodmachen.com (Astro 5 app), `home/` = rodmachen.com (plain static HTML/CSS, second Vercel project rooted at `home/`).
- Dev/test/CI commands: `npm run dev`, `npx vitest run`, `npx astro check`, `npm run build`; CI = GitHub Actions on push/PR (Node 22).
- Deployment notes: edition on Vercel (project root `/`); rodmachen.com as a second Vercel project rooted at `home/` (framework "Other", no build, output `.`); the post-merge DNS plan lives in the plan doc's "Post-merge" section.
- `scripts/` provenance (one-off content-migration utilities using cheerio/turndown — read `scripts/` to describe accurately).
- The Astro 6 follow-up: blocked by `astro-cloudinary@1.3.5` peer cap; path is replacing `getCldImageUrl`/`getCldOgImageUrl` with hand-rolled Cloudinary URLs, then upgrading. Also note ~11 npm audit findings wait on that upgrade.
- The URL-migration table: `/article/:slug` → `/articles/:slug`, `/review/:slug` → `/reviews/:slug`, `/essay/:slug` → `/articles/:slug`, `/byline/…` → `/bylines/…`, `/p/:slug` → `/newsletter/:slug/` (pre-existing), all permanent redirects in `vercel.json`.

Then update the PR description (`gh pr view --json body -q .body` → `gh pr edit --body`): refresh the full step checklist (Steps 0–14 done, Step 15 pending), keep/refresh the "Open questions" section (a-week-of-tennis duplicate; malformed category YAML in `2015-03-12-sxsw-2015-a-look-back.md`; Vercel preview env missing `PUBLIC_CLOUDINARY_CLOUD_NAME`).

## Wrap-up

- Verify the README renders (sane markdown, working relative links). CI green after push.
- Atomic commit ("Step 14", trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`), push, ` ✅` the Step 14 heading, update PR checklist.
- Never stage anything under `docs/implementation/`.

## Result output (required)

Write JSON to `docs/implementation/edition-rebuild-and-rodmachen-home/results/step-14.json`:

```json
{
  "step": 14,
  "status": "success" | "failure",
  "commit": "...",
  "ci_run_url": "...",
  "decisions": ["..."],
  "blockers": ["..."]
}
```
