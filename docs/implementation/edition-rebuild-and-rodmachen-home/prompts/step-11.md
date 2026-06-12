# Task: Step 11 — Polish + design/accessibility audit

You are a review/implementation subagent in `/Users/rodmachen/code/edition-rodmachen-com` (Astro 5 blog), branch `feature/edition-rebuild`. Execute Step 11 of `docs/plans/edition-rebuild-and-rodmachen-home.md` — read the plan first. Do not ask for confirmation — execute directly.

**Run the web-design-guidelines skill** (via the Skill tool) to audit the rebuilt UI.

## Context

- The Edition design system (option E "Ledger Broadsheet") is fully applied: tokens in `src/styles/global.css`, BaseLayout with pre-paint theme script, Header/Footer/ThemeToggle components, home + section indexes + post/bylines/archive/topics/about/contact restyled. Light default + ink-at-night dark via `[data-theme]` and `prefers-color-scheme`.
- Per-section accents: newsletter=oxblood, articles=clay, reviews=ochre, bylines=taupe — verify CONTRAST of each on both themes (metadata text, links, chips).
- Never stage anything under `docs/implementation/`. Keep vitest/astro check/build green.

## Work

1. Audit the built site (build it, inspect `dist/` HTML + the CSS) for: color contrast (both themes), focus visibility, touch-target sizes at 375px, heading hierarchy, landmark/aria correctness, reduced-motion handling, font-loading behavior.
2. Fix what the audit finds; triage with judgment. Record anything you deliberately waive with a reason.
3. Confirm RSS hrefs (plural paths), OG/Twitter meta on post pages.
4. Add `@astrojs/sitemap` to `astro.config.mjs` (devDep/dep as appropriate — call out the added package in commit message). The site URL is `https://edition.rodmachen.com`.
5. **Verify:** `npx vitest run`, `npx astro check`, `npm run build` green; `dist/sitemap-index.xml` exists.
6. Atomic commit (body: why + "Step 11" + verification + the added dependency; trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`), push, ` ✅` the Step 11 heading in the plan, update the PR checklist line. CI must pass (`gh run watch --exit-status`).

## Result output (required)

Write JSON to `docs/implementation/edition-rebuild-and-rodmachen-home/results/step-11.json`:

```json
{
  "step": 11,
  "status": "success" | "failure",
  "commit": "...",
  "ci_run_url": "...",
  "findings_fixed": ["..."],
  "findings_waived": [{"finding": "...", "reason": "..."}],
  "decisions": ["..."],
  "blockers": ["..."]
}
```
