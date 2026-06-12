# Task: Step 13 — Claude Design sync

You are a subagent in `/Users/rodmachen/code/edition-rodmachen-com`, branch `feature/edition-rebuild`. Execute Step 13 of `docs/plans/edition-rebuild-and-rodmachen-home.md`. Do not ask for confirmation — execute directly.

## Work

Sync the now-stable Edition design system to a claude.ai/design project using the **DesignSync** tool flow: `list_projects` → create a project if none fits (name it "Edition — rodmachen.com") → `finalize_plan` → `write_files`.

Source material (read these):
- `src/styles/global.css` — the token system: color custom properties (light + `[data-theme="dark"]`), typography scale (Fraunces / Newsreader / Spline Sans Mono roles), per-section accents (newsletter=oxblood, articles=clay, reviews=ochre, bylines=taupe), spacing/rule tokens.
- `src/components/` — Header (home/inner variants), Footer, ThemeToggle, PostList/PostCardList, PageHeader.
- `docs/design/mockups/edition-option-e.html` — the chosen direction ("The Ledger Broadsheet") for rationale text.

Sync tokens and the component patterns with short usage notes. If the DesignSync flow requires an export bundle in-repo, create a minimal `design-system/` directory with what it needs; otherwise change nothing in the repo.

## Fallback

If the DesignSync tool is NOT available in your session (it requires claude.ai auth that may be absent headless), do NOT improvise an alternative. Write the result JSON with `"status": "tool-unavailable"` and stop — the orchestrator will run the sync in the main session.

## Wrap-up (only if sync succeeded)

- If repo files were created: atomic commit ("Step 13", trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`), push.
- Append ` ✅` to the Step 13 heading in the plan, commit + push that mark, update the PR checklist line.
- Never stage anything under `docs/implementation/`.

## Result output (required)

Write JSON to `docs/implementation/edition-rebuild-and-rodmachen-home/results/step-13.json`:

```json
{
  "step": 13,
  "status": "success" | "tool-unavailable" | "failure",
  "project": "name/id or null",
  "synced": ["tokens", "components", "..."],
  "commit": "sha or null",
  "decisions": ["..."],
  "blockers": ["..."]
}
```
