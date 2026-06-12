# Task: Step 1 — Test framework + CI

You are an implementation subagent in the repo `/Users/rodmachen/code/edition-rodmachen-com` (Astro 5 static blog, deployed on Vercel). Work on the current branch `feature/edition-rebuild`. Do not ask for confirmation — execute directly.

## Context

- No tests or CI exist yet. This step creates both.
- The pure helpers to test live in `src/utils/posts.ts`: `getPostSlug`, `getPostCategory`, `formatDate`, `extractFirstImage`, `getPostsByCategory`. Read the file first.
- Known wrinkle: `posts.ts` has a runtime import from `astro-cloudinary/helpers` and a type-only import from `astro:content`. The type-only import strips fine under vitest; if the `astro-cloudinary/helpers` runtime import breaks vitest, extract the pure helpers into a new `src/utils/slugs.ts` (re-export from `posts.ts` to keep call sites working) and test that module instead. Prefer the simplest setup that works.
- The working tree has pre-existing modified/untracked files (4 posts, `.gitignore`, `a-week-of-tennis.md`, `docs/claude-sessions/`, `docs/plans/rod-machen-architecture.md`). **Do not stage, commit, or modify them.** Also never stage anything under `docs/implementation/`.
- Mode: tests-alongside (this step creates the test infrastructure).

## Steps

1. Add `vitest` as a devDependency. Add `@astrojs/check` and `typescript` devDeps if not present (needed for `npx astro check`).
2. Create `vitest.config.ts`.
3. Write `src/utils/posts.test.ts` covering the pure helpers listed above (use realistic post-shaped fixture objects matching the collection schema in `src/content.config.ts`).
4. Add `package.json` scripts: `"test": "vitest run"` and `"check": "astro check"`.
5. Create `.github/workflows/ci.yml`: triggers on push + pull_request; Node 22; steps: `npm ci`, `npx astro check`, `npx vitest run`, `npm run build`.
6. Verify locally: `npx vitest run` green, `npm run build` green, `npx astro check` passes (report pre-existing check errors rather than fixing unrelated code; only fail the step if YOUR changes break it).
7. Commit (stage only the files you created/changed: package.json, package-lock.json, vitest.config.ts, the test file, ci.yml, and slugs.ts if created). Commit message: summary line; body explaining why (CI/test infrastructure is required before implementation steps per workflow), noting "Step 1" of plan `docs/plans/edition-rebuild-and-rodmachen-home.md`, and what was verified (vitest, build, astro check locally). End body with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
8. Push. Then watch CI: `gh run watch --exit-status` (or poll `gh run list --branch feature/edition-rebuild`). CI must pass.
9. Mark Step 1 complete: append ` ✅` to the `## Step 1: Test framework + CI` heading line in `docs/plans/edition-rebuild-and-rodmachen-home.md`, commit that one-line change (message: `Mark Step 1 complete`, same co-author trailer), and push.
10. Update the PR description checklist: mark Step 1 done (`gh pr edit --body ...` — fetch current body with `gh pr view --json body -q .body`, modify only the Step 1 checklist line).

## Result output (required)

Write JSON to `docs/implementation/edition-rebuild-and-rodmachen-home/results/step-1.json`:

```json
{
  "step": 1,
  "status": "success" | "failure",
  "commits": ["<sha>"],
  "ci_run_url": "...",
  "extracted_slugs_module": true | false,
  "test_count": <n>,
  "decisions": ["..."],
  "assumptions": ["..."],
  "blockers": ["..."]
}
```

Write it even on failure, with blockers described.
