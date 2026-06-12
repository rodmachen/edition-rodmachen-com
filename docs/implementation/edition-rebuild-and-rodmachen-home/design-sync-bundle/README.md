# Edition — "The Ledger Broadsheet" design system

Source of truth: the `edition-rodmachen-com` repo (`src/styles/global.css`, `src/components/`).
Chosen direction: Option E "The Ledger Broadsheet" — a literary broadsheet (Fraunces display over
Newsreader text, cream paper, oxblood accent, light default) with a catalog spine: numbered index
IDs, ruled ledger tables, Spline Sans Mono strictly for metadata. Dark theme is a warm
"ink-at-night" palette informed by Option D "The Night Archive".

## Layout

- `previews/` — Design System pane cards (colors, type, component patterns)
- `tokens/global.css` — the live token file from the repo
- `components/` — raw Astro component sources (Header, Footer, ThemeToggle, PostList, PostCardList, PageHeader)
- `reference/edition-option-e.html` — the approved mockup

## Rules of the system

- Mono (Spline Sans Mono) is for metadata only — dates, catalog IDs, category labels — never body or positioning copy.
- Per-section accents: newsletter=oxblood, articles=clay, reviews=ochre, bylines=taupe; all meet WCAG AA for small text on both paper tones.
- Theme: light default; `[data-theme="dark"]` override plus `prefers-color-scheme` fallback; theme set by a render-blocking inline script before first paint (no FOUC).
- The site name is "Edition" — never "The Edition".
- Edition is a writing publication (film, TV, music, food, culture); no engineering framing.
