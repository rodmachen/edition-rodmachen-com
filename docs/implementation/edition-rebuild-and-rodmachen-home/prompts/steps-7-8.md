# Task: Steps 7–8 — Design tokens + layout shell, then home page rebuild

You are a design/implementation subagent in `/Users/rodmachen/code/edition-rodmachen-com` (Astro 5 static blog), branch `feature/edition-rebuild`. Execute Steps 7 and 8 of `docs/plans/edition-rebuild-and-rodmachen-home.md` in order — read the plan first. **Use the frontend-design skill** (invoke via the Skill tool) before design work. Do not ask for confirmation — execute directly.

## The chosen design (Rod's checkpoint decisions — binding)

- The design source of truth is `docs/design/mockups/edition-option-e.html` — **"The Ledger Broadsheet"**: literary double-rule masthead, Fraunces display over Newsreader text, cream paper, oxblood accent, light by default; with a catalog spine — numbered index IDs, ruled ledger table for Reviews, Spline Sans Mono strictly for metadata (dates, categories, IDs). Read the file thoroughly; also read `edition-option-d.html` ("The Night Archive") — its warm ink-at-night palette is a good reference for the DARK theme of E.
- **The site name is "Edition", NOT "The Edition".** Fix anywhere the mockup says otherwise.
- The approved treatment is the mockup's **home-page block**. The mockup's "Section Index" demo and post-page demo below it are NOT approved as-is — section/post page design comes in later steps with this guidance: Newsletter / Articles / Reviews subpages get somewhat distinctive looks within the Edition family; Bylines / Archive / Topics share one uniform Edition-matching treatment. For Steps 7–8 you only need the token system to ANTICIPATE this (per-section accent tokens).
- Never frame edition around engineering/coding. It is a writing publication (film, TV, music, food, culture). Newsletter is "The Hangman Chronicles".

## Context from prior steps

- Tests + CI exist; `npx vitest run`, `npm run build`, `npx astro check` must stay green. CATEGORY_CONFIG and pure helpers live in `src/utils/slugs.ts` (posts.ts re-exports). URLs are plural (`/articles/`, `/reviews/`, `/newsletter/`, `/bylines/`).
- Never stage anything under `docs/implementation/`.
- Workflow per step: implement → verify → atomic commit (body: why + "Step N" + verification; trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`) → push → append ` ✅` to the step heading in the plan file (may fold into the step commit) → update that step's PR checklist line (`gh pr view --json body -q .body` → `gh pr edit --body`).
- **First action (bookkeeping):** Step 6 is resolved at the checkpoint. Append ` ✅` to the `## Step 6: ...` heading in the plan file and update its PR checklist line; include this in your Step 7 commit.

## Step 7 — Design tokens + layout shell (dark mode). Mode: tests-alongside

Files: `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, new `src/components/ThemeToggle.astro`, `src/utils/slugs.ts`/`posts.ts` (align per-category accent values to the token system).

- Full token rework translated from option E: color custom properties with `prefers-color-scheme` defaults + `[data-theme]` overrides; typography scale (Fraunces / Newsreader / Spline Sans Mono roles); spacing/rule tokens for the broadsheet rules; per-section accent tokens (newsletter/articles/reviews/bylines) with light AND dark variants — dark theme informed by option D's ink-at-night warmth.
- `BaseLayout.astro`: render-blocking inline theme script in `<head>` reading localStorage BEFORE first paint (no FOUC), plus `meta name="theme-color"` (update it on toggle).
- Header nav: Newsletter / Articles / Reviews / Bylines + ThemeToggle; masthead says "Edition"; usable at 375px (no horizontal scroll, adequate touch targets).
- Google Fonts: load the three families efficiently (preconnect, single stylesheet link, sensible weights/subsets).
- **Verify:** toggle persists across reloads; dark-mode hard reload shows no white flash (verify the script is inline, synchronous, before any stylesheet that paints background); `npm run build` + `npx vitest run` + `npx astro check` green.

## Step 8 — Home page rebuild. Mode: tests-alongside

Files: `src/pages/index.astro`, possibly `src/components/PostList.astro` / `PostCardList.astro`.

- Rebuild the home page on the option E home treatment: Big 3 (Newsletter "The Hangman Chronicles", Articles, Reviews) as prominent blocks with 3–5 recent posts each; Bylines as a visually secondary strip; Archive + Topics as quiet footer-level links (NOT equal cards). Numbered/ledger devices per the mockup; mono only for metadata.
- Pull real data via the existing helpers (`getPublishedPosts`, `getPostsByCategory`, `postToListItem`).
- **Verify:** `npm run build` green; render check at 375/768/1280px in both themes — at minimum inspect the built `dist/index.html` for structural sanity and ensure no unstyled/overflowing layout by reviewing the CSS you wrote; vitest + astro check green.

## Final checks

- CI green after final push (`gh run watch --exit-status` or poll `gh run list --branch feature/edition-rebuild`).
- Plan headings for Steps 6, 7, 8 carry ✅; PR checklist updated for all three.

## Result output (required)

Write JSON to `docs/implementation/edition-rebuild-and-rodmachen-home/results/steps-7-8.json`:

```json
{
  "steps": [7, 8],
  "status": "success" | "partial" | "failure",
  "per_step": {
    "7": {"status": "...", "commit": "...", "fouc_strategy": "one-line description"},
    "8": {"status": "...", "commit": "..."}
  },
  "ci_run_url": "...",
  "decisions": ["..."],
  "assumptions": ["..."],
  "blockers": ["..."]
}
```

If Step 7 fails verification, STOP (do not start Step 8) and write the JSON with the failure detail.
