# Task: Steps 9–10 — Section sub-homepages + remaining page restyles

You are an implementation subagent in `/Users/rodmachen/code/edition-rodmachen-com` (Astro 5 blog), branch `feature/edition-rebuild`. Execute Steps 9 and 10 of `docs/plans/edition-rebuild-and-rodmachen-home.md` in order — read the plan first. Do not ask for confirmation — execute directly.

## Design context (binding)

- The design system was just built (Steps 7–8) from `docs/design/mockups/edition-option-e.html` ("The Ledger Broadsheet" — site name **"Edition"**, Fraunces/Newsreader/Spline-Sans-Mono roles, cream-paper light theme, ink-at-night dark theme, oxblood + per-section accent tokens, numbered/ledger catalog devices, mono ONLY for metadata). Read `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `src/components/` and `src/pages/index.astro` FIRST and reuse their tokens/components — do not invent a parallel style system.
- **Rod's directive for subpages:** Newsletter ("The Hangman Chronicles"), Articles, and Reviews section pages get *somewhat distinctive* looks — each its own personality via its accent/devices — but unmistakably part of the Edition family. Bylines, Archive, and Topics share ONE uniform treatment that simply matches Edition.
- Never frame edition around engineering/coding; it's a writing publication.

## Context from prior steps

- Plural URLs; CATEGORY_CONFIG (with `path` + accent per category) in `src/utils/slugs.ts`; `getPublishedPosts()` everywhere; vitest + CI green and must stay green.
- Never stage anything under `docs/implementation/`.
- Per step: implement → verify → atomic commit (body: why + "Step N" + verification; trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`) → push → ` ✅` on the step heading in the plan → update the PR checklist line.

## Step 9 — Section sub-homepages. Mode: tests-alongside

Files: `src/pages/[category]/index.astro` (replaces the current stub), reusing `PostList`/`PostCardList`.

- Real section indexes for `/newsletter/`, `/articles/`, `/reviews/` driven by `CATEGORY_CONFIG` accents — per-section identity per Rod's directive (e.g., Reviews keeps the ruled ledger-table device from the mockup; Newsletter and Articles get their own in-family treatments).
- Newsletter page `<title>`/H1 carries "The Hangman Chronicles" for SEO.
- `/bylines/` index is part of the uniform trio treatment (restyle it here or in Step 10, your call — note where).
- **Verify:** `npm run build`; `dist/newsletter/index.html`, `dist/articles/index.html`, `dist/reviews/index.html` exist and carry section-distinct styling in both themes; vitest green.

## Step 10 — Post pages, bylines, archive, topics, about/contact restyle. Mode: tests-alongside

Files: `src/layouts/PostLayout.astro`, `src/pages/bylines/index.astro`, `src/pages/archive/[...page].astro`, `src/pages/topics/index.astro`, `src/pages/topics/[tag].astro`, `src/pages/about.astro`, `src/pages/contact.astro`.

- Apply the Edition system to all of these. Bylines/Archive/Topics = the uniform family treatment. Post pages: body typography from the system (Newsreader prose, Fraunces headings, mono metadata), with the per-section accent of the post's category.
- **Watch item:** Cloudinary `<figure>`/srcset markup (from the custom remark plugin) and `getCldOgImageUrl` OG images in `src/pages/[category]/[slug].astro` MUST survive the restyle — style `figure`/`img`/`figcaption` via CSS, do not alter the markup pipeline.
- **Verify:** build green; spot-check built HTML in both themes: a newsletter post with images (Cloudinary figures intact in `dist/`), a review post, archive page 2, a tag page; OG meta tags present on a post page (`grep -l 'og:image' dist/...`); vitest + astro check green.

## Final checks

- CI green after final push; Steps 9 and 10 headings carry ✅; PR checklist updated.

## Result output (required)

Write JSON to `docs/implementation/edition-rebuild-and-rodmachen-home/results/steps-9-10.json`:

```json
{
  "steps": [9, 10],
  "status": "success" | "partial" | "failure",
  "per_step": {
    "9": {"status": "...", "commit": "..."},
    "10": {"status": "...", "commit": "..."}
  },
  "ci_run_url": "...",
  "decisions": ["..."],
  "assumptions": ["..."],
  "blockers": ["..."]
}
```

If Step 9 fails verification, STOP (do not start Step 10) and write the JSON with the failure detail.
