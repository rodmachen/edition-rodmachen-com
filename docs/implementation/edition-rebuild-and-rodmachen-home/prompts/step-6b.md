# Task: Step 6 iteration — hybrid edition mockups (D and E)

You are a design subagent in `/Users/rodmachen/code/edition-rodmachen-com`, branch `feature/edition-rebuild`. Do not ask for confirmation — execute directly.

**Use the frontend-design skill** (invoke via the Skill tool before designing).

## Checkpoint feedback from Rod

Round 1 produced three directions for edition.rodmachen.com (in `docs/design/mockups/`):
- `edition-option-a.html` — "The Broadsheet": literary-review masthead, cream/ink/oxblood, Fraunces + Newsreader, print grid, light default.
- `edition-option-b.html` — "The Index": card-catalog/database, IBM Plex Mono + Archivo, near-black, acid-citron accent, dark default.
- `edition-option-c.html` — "The Almanac": color-blocked zine (not chosen).

Rod's feedback, verbatim intent:
1. **He likes Option B best of everything**, and wants new options drawing on **A and B together** — the literary broadsheet voice fused with the index/catalog structure.
2. **Do not frame edition around "engineering manager" or coding.** Edition is the *writing* publication (film, TV, music, food, culture). The technical identity lives at code.rodmachen.com. So: keep the structural/databody appeal of B, lose the "writer-who-codes/terminal" rhetoric. Monospace as a *typographic flavor* is fine; positioning the site as an engineer's blog is not.

## Deliverables

Read `edition-option-a.html` and `edition-option-b.html` first, then create two NEW single-file mockups in `docs/design/mockups/`:

- `edition-option-d.html` — **Index-led hybrid**: start from B's bones (catalog structure, tabular review index, sticky headers, dark default) and infuse A's literary qualities — a serif display voice for the masthead/headlines, warmer ink-and-paper palette in light mode, oxblood-family accent instead of acid-citron if it suits. Reads as a *literary archive*, not a developer site.
- `edition-option-e.html` — **Broadsheet-led hybrid**: start from A's literary masthead and print grid, and bring in B's structural devices — indexed/numbered listings, a tabular or ledger-style reviews section, mono details for metadata (dates, categories, issue numbers). Light default.

Same requirements as round 1: each file is fully self-contained (inline CSS/JS, at most a Google Fonts link), shows home (Big 3 prominent: Newsletter "The Hangman Chronicles", Articles, Reviews; Bylines secondary; Archive/Topics quiet footer links), one section index (Reviews), and one post page (figure with caption + blockquote), stacked with dividers. Working light/dark toggle honoring `prefers-color-scheme`. Excellent at 375px and 1280px. Use the same real post content as round 1 (e.g., The Grand Budapest Hotel post) so options compare directly. Top-of-file HTML comment naming the direction + rationale.

## Wrap-up

1. Sanity-check both files (HTML parses, toggle JS valid).
2. Commit ONLY the two new mockup files. Message: `Step 6 iteration: hybrid edition mockups D and E (A x B blend)`, body noting Rod's checkpoint feedback drove this round, trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`. Push.
3. Do NOT mark Step 6 ✅ or touch the PR checklist.

## Result output (required)

Write JSON to `docs/implementation/edition-rebuild-and-rodmachen-home/results/step-6b.json`:

```json
{
  "step": "6b",
  "status": "success" | "failure",
  "commit": "<sha>",
  "options": [
    {"file": "edition-option-d.html", "name": "...", "summary": "..."},
    {"file": "edition-option-e.html", "name": "...", "summary": "..."}
  ],
  "decisions": ["..."],
  "blockers": ["..."]
}
```
