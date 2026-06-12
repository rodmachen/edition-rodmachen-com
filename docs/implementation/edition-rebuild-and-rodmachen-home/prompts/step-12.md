# Task: Step 12 — rodmachen.com static one-page hub

You are a design subagent in `/Users/rodmachen/code/edition-rodmachen-com`, branch `feature/edition-rebuild`. Execute Step 12 of `docs/plans/edition-rebuild-and-rodmachen-home.md` — read the plan first. **Use the frontend-design skill** (via the Skill tool). Do not ask for confirmation — execute directly.

This is a DISTINCT site from the edition blog — do not reuse edition's design system. The design source of truth is `docs/design/mockups/rodmachen-home-a.html` — **"The Calling Card"**: refined dark editorial hub, engraved-stationery feel, Bodoni Moda nameplate, warm amber accent, generous negative space, destinations as a precise numbered index. Rod chose this at the checkpoint. Read the mockup thoroughly and build a production-quality version of it.

## Deliverables

`home/index.html`, `home/styles.css`, `home/vercel.json`, plus any small assets under `home/` (favicon as inline SVG data URI or a small file). Plain HTML/CSS, NO build step, no JS unless genuinely needed (the mockup is toggle-free: dark default with `prefers-color-scheme` handling — keep a light scheme variant per the mockup's approach, or both schemes if the mockup defines them).

Confirmed links (binding — collected from Rod at the checkpoint):
- Destinations: https://edition.rodmachen.com (writing), https://code.rodmachen.com (code/engineering), https://photo.rodmachen.com (photography)
- Author pages: https://www.austinchronicle.com/author/rod-machen/ and https://cinapse.net/author/rod/
- Socials (exactly these three): https://www.instagram.com/rod.machen.writer , https://bsky.app/profile/rodmachen.bsky.social , https://www.facebook.com/rod.machen.writer/

`home/vercel.json`: `cleanUrls: true`, sensible cache headers (long-lived for styles.css with care, short/standard for HTML).

Content notes: Rod Machen — writer in Austin, TX (film, TV, music, food, culture); also builds software (that's code.rodmachen.com's story — one quiet line here at most). Keep copy spare, in the Calling Card register. Mobile-first; excellent at 375px and 1280px.

## Wrap-up

1. **Verify:** HTML parses; CSS has no syntax errors; `curl -s -o /dev/null -w '%{http_code}'` each external link → 200 (the three subdomains may 404/redirect if not yet deployed — record actual codes, don't fail on the subdomains; the author/social pages should be 2xx/3xx).
2. Atomic commit of `home/` only (body: why + "Step 12" + verification; trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`), push, ` ✅` the Step 12 heading in the plan, update the PR checklist line.

## Result output (required)

Write JSON to `docs/implementation/edition-rebuild-and-rodmachen-home/results/step-12.json`:

```json
{
  "step": 12,
  "status": "success" | "failure",
  "commit": "...",
  "link_checks": {"url": "http_code"},
  "decisions": ["..."],
  "blockers": ["..."]
}
```
