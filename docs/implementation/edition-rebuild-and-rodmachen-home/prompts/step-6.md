# Task: Step 6 — Design mockups (precedes a user checkpoint)

You are a design subagent in `/Users/rodmachen/code/edition-rodmachen-com`, branch `feature/edition-rebuild`. Your output is 5 static, single-file HTML mockups that the repo owner (Rod) will review to pick design directions. Do not ask for confirmation — execute directly.

**Use the frontend-design skill** (invoke it via the Skill tool before designing). Aim for distinctive, production-grade design quality — explicitly avoid generic AI aesthetics.

## What the sites are

1. **edition.rodmachen.com** — Rod Machen's personal writing publication (Astro blog with ~10 years of content). Sections: **Newsletter** ("The Hangman Chronicles"), **Articles**, **Reviews** (film/TV/music/food), **Bylines** (links to his writing elsewhere: Austin Chronicle, Cinapse), plus an Archive and Topics. Rod is a writer/engineering manager in Austin; the voice is thoughtful, culture-focused (film, opera, comics, music).
2. **rodmachen.com** — a one-page personal hub: who Rod is, links out to edition.rodmachen.com, code.rodmachen.com, photo.rodmachen.com, his Austin Chronicle and Cinapse author pages, and social accounts. Its own distinct look — NOT a clone of edition's design.

Browse the repo for real flavor: post titles/excerpts in `src/content/posts/`, current pages in `src/pages/`, current styles in `src/styles/global.css`. Use REAL post titles and dates in the mockups so Rod evaluates with real content.

## Deliverables

Create `docs/design/mockups/` containing exactly:

- `edition-option-a.html`, `edition-option-b.html`, `edition-option-c.html` — three DISTINCT design directions for edition.rodmachen.com. Each file is self-contained (inline CSS, inline JS, no external assets except system/web-safe font stacks or a single Google Fonts link) and shows, stacked vertically with clear dividers as one scrollable page: (1) the home page — the "Big 3" sections (Newsletter, Articles, Reviews) visually prominent with 3–5 recent posts each, Bylines as a visually secondary strip, Archive/Topics as quiet footer-level links; (2) one section index page (use Reviews); (3) one post page with body typography, a figure with caption, and a blockquote. Each must include a WORKING light/dark toggle (inline JS toggling a `data-theme` attribute) and respect `prefers-color-scheme` by default.
- `rodmachen-home-a.html`, `rodmachen-home-b.html` — two DISTINCT one-page looks for rodmachen.com. Dark mode via `prefers-color-scheme` (no toggle needed). Use placeholder `#` hrefs for social accounts (the real list is collected at the checkpoint); use the known destinations for the three subdomains.

Constraints for all five:
- Excellent at 375px AND 1280px viewports. Mobile-first.
- Three genuinely different directions for edition (e.g., different typographic voices, layout systems, accent strategies) — not one theme with three color swaps.
- These files are never shipped (kept under `docs/`, not `src/pages/`), so no Astro syntax — plain HTML.
- Add a short HTML comment at the top of each file naming the direction (e.g., "Option A — <name>: <two-line rationale>").

## Wrap-up

1. Verify each file renders sensibly: at minimum run a quick syntax sanity pass (e.g., `python3 -c` HTML parse or open-and-eyeball via a headless check if available); confirm the theme-toggle JS has no syntax errors (`node --check` on an extracted snippet or careful review).
2. Commit ONLY `docs/design/mockups/*.html` (never anything under `docs/implementation/`). Message: `Step 6: Design mockups for edition + rodmachen.com (3 + 2 directions)`, body explaining the three directions in one line each, trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`. Push.
3. Do NOT mark Step 6 ✅ in the plan and do NOT update the PR checklist — the step completes only after Rod picks directions (handled by the orchestrator).

## Result output (required)

Write JSON to `docs/implementation/edition-rebuild-and-rodmachen-home/results/step-6.json`:

```json
{
  "step": 6,
  "status": "success" | "failure",
  "commit": "<sha>",
  "options": {
    "edition": [{"file": "edition-option-a.html", "name": "...", "summary": "one to two sentences pitching the direction"}, ...],
    "rodmachen": [{"file": "rodmachen-home-a.html", "name": "...", "summary": "..."}, ...]
  },
  "decisions": ["..."],
  "blockers": ["..."]
}
```
