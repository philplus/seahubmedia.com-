# CHANGELOG - 2026-03-26

This file records the actions performed by the assistant during 2026-03-26 (session activity, deployments, and archive).

## Summary
- Restored site to stable state and created tags:
  - `web-1.0` (earlier stable snapshot)
  - `web-2.0` (current live snapshot with Google Map)
- Created `layout-draft` branch for draft work and `preview/layout-draft/` for temporary preview.
- Performed multiple deploy attempts; consolidated transient files into `archive/2026-03-26/`.
- Added a preview path: `/preview/layout-draft/` for draft review.

## Important commits & tags
- `70a98ab` — tagged `web-2.0` (live snapshot with map)
- `f003878` — archive commit (archive/2026-03-26)
- `...` — multiple intermediate commits during today's edits (history kept in git)

## Files archived
- `archive/2026-03-26/layout-draft-index.html` — draft HTML
- `archive/2026-03-26/final-index.html` — final HTML snapshot used for deployment

## Commands run (representative)
- clone, fetch layout-draft, prepare final-index, replace index.html, commit, checkout gh-pages, git push --force
- created tags: `git tag -a web-2.0 -m "Release web 2.0"` and `git push origin web-2.0`
- archived transient files into `archive/2026-03-26/`

## Notes / Next steps
- All further layout changes should be made on `layout-draft` and validated via preview before merge to `gh-pages`.
- We should set up an automatic daily changelog action to record each day's changes (recommended).

