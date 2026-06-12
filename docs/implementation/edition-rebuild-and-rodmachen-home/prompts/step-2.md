# Task: Step 2 — Commit pending changes + docs cleanup

You are an implementation subagent in `/Users/rodmachen/code/edition-rodmachen-com`, branch `feature/edition-rebuild`. Do not ask for confirmation — execute directly.

## Context

- The working tree carries pre-existing changes that this step finally commits:
  - `M .gitignore`
  - 4 modified posts (article→review recategorizations): `2014-02-20-first-look-kerlin-bbq.md`, `2014-02-25-neutral-milk-hotel-retro-scenester-adventure.md`, `2014-03-27-grand-budapest-hotel-review.md`, `2014-04-07-game-of-thrones-two-swords.md` (all under `src/content/posts/`)
  - untracked `docs/claude-sessions/2026-03-01.md`
  - untracked `src/content/posts/a-week-of-tennis.md` (a draft; likely partial duplicate of the Neutral Milk Hotel post — kept, not resolved here)
  - untracked `docs/plans/rod-machen-architecture.md` (superseded architecture doc)
- Never stage anything under `docs/implementation/` (orchestration artifacts; the orchestrator owns them).
- Mode: tests-alongside (no new tests).

## Steps

1. Inspect the `.gitignore` diff and the 4 post diffs (sanity-check they are what's described; if a diff contains something unexpected, note it in the result JSON but proceed unless it's clearly unrelated junk).
2. Add `published: false` to the frontmatter of `src/content/posts/a-week-of-tennis.md` (draft filtering arrives in Step 4; until then the flag is inert).
3. Create `docs/plans/archive/`. Identify completed plan docs in `docs/plans/` (read them: a plan is complete when all its step headings carry ✅) and `git mv` them into the archive. Move `docs/plans/rod-machen-architecture.md` (untracked → plain mv) into the archive too, after prepending a line at the top: `> Superseded by edition-rebuild-and-rodmachen-home.md`. Do NOT archive `edition-rebuild-and-rodmachen-home.md` (the active plan).
4. Commit the lot (logical grouping is fine — one commit, or one for content + one for docs reorganization; your call). Message body: why, "Step 2" of the plan, what was verified. Trailer: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
5. Verify: `git status --short` is clean EXCEPT untracked `docs/implementation/` paths; `npm run build` green; `npx vitest run` green.
6. Push. Confirm CI passes (`gh run watch --exit-status` on the latest run for this branch).
7. Mark Step 2 complete: append ` ✅` to the `## Step 2: ...` heading in `docs/plans/edition-rebuild-and-rodmachen-home.md`, commit (`Mark Step 2 complete`), push.
8. Update the PR description checklist line for Step 2 (fetch body via `gh pr view --json body -q .body`, edit only that line, `gh pr edit --body ...`).

## Result output (required)

Write JSON to `docs/implementation/edition-rebuild-and-rodmachen-home/results/step-2.json`:

```json
{
  "step": 2,
  "status": "success" | "failure",
  "commits": ["<sha>"],
  "archived_plans": ["..."],
  "unexpected_diff_notes": ["..."],
  "decisions": ["..."],
  "assumptions": ["..."],
  "blockers": ["..."]
}
```
