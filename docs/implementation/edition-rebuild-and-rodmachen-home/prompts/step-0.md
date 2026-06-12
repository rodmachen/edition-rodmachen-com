# Task: Step 0 — Branch, rename plan, first commit, open PR

You are an implementation subagent in the repo `/Users/rodmachen/code/edition-rodmachen-com` (an Astro 5 blog). Execute exactly the following; do not ask for confirmation — execute directly.

## Context

- Current branch is `master`. The working tree has modified/untracked files (4 modified posts, `.gitignore`, `src/content/posts/a-week-of-tennis.md`, `docs/claude-sessions/2026-03-01.md`, `docs/plans/rod-machen-architecture.md`). **Leave all of these untouched and uncommitted** — a later step handles them.
- The plan file `docs/plans/i-created-this-repo-shimmering-unicorn.md` is untracked. Its confirmed final name is `edition-rebuild-and-rodmachen-home.md`.
- `docs/implementation/` contains orchestration artifacts — do NOT stage or commit anything under it.

## Steps

1. Create and switch to branch `feature/edition-rebuild` from `master`.
2. `mv docs/plans/i-created-this-repo-shimmering-unicorn.md docs/plans/edition-rebuild-and-rodmachen-home.md` (plain mv; the file is untracked).
3. In the renamed file, replace the line `**Proposed plan filename:** \`edition-rebuild-and-rodmachen-home.md\` (confirm or correct at Step 0)` with `**Plan filename (confirmed at Step 0):** \`edition-rebuild-and-rodmachen-home.md\``.
4. Stage ONLY `docs/plans/edition-rebuild-and-rodmachen-home.md` and commit it as the sole change. Commit message format:
   - Summary line: `Add plan: edition rebuild + rodmachen.com home page`
   - Body: why (plan-first workflow; plan is the single source of truth for the feature branch), note this is Step 0 of the plan, what was verified (sole file in commit via `git show --stat`).
   - End the body with: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`
5. Push with `git push -u origin feature/edition-rebuild`.
6. Open a PR (NOT draft) with `gh pr create --title "Edition rebuild + rodmachen.com home page" --base master`. PR body must contain:
   - One-paragraph summary of the plan (rebuild edition.rodmachen.com frontend: tests+CI, dep bumps within Astro 5, essay→articles fold, draft filtering, plural URLs with permanent redirects, design-system rebuild with dark mode, new section/home/post pages, plus a static rodmachen.com page in `home/` as a second Vercel project).
   - A checklist of Steps 0–15 from the plan file, with Step 0 checked done and the rest pending.
   - An "Open questions" section noting: `src/content/posts/a-week-of-tennis.md` appears to be a partial duplicate of `2014-02-25-neutral-milk-hotel-retro-scenester-adventure.md` (same date/subtitle/tags, malformed link); it will be kept as `published: false` pending Rod's decision.
   - End the body with: `🤖 Generated with [Claude Code](https://claude.com/claude-code)`

## Verify

- `git branch --show-current` prints `feature/edition-rebuild`.
- `git show --stat HEAD` shows exactly one file changed (the plan).
- `gh pr view --json url,state` succeeds.
- `git status --short` still shows the pre-existing modified/untracked files (untouched).

## Result output (required)

Write a JSON object to `docs/implementation/edition-rebuild-and-rodmachen-home/results/step-0.json`:

```json
{
  "step": 0,
  "status": "success" | "failure",
  "branch": "...",
  "commit": "<sha>",
  "pr_url": "...",
  "decisions": ["..."],
  "assumptions": ["..."],
  "blockers": ["..."]
}
```

If anything fails (e.g., no `origin` remote, `gh` not authenticated), still write the JSON with `status: "failure"` and the blocker described.
