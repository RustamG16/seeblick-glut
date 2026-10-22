# AGENTS — SEEBLICK & GLUT

## Read order
`ARCHITECTURE-ESSENTIALS.md`, then `DESIGN.md`, then `.olympus/06-build-plan.md`. Only then the file the task needs.

## Ownership and boundaries
Build from the plan; do not redesign it. Change anything under `src/`, `scripts/`, `public/media/`; never change facts in `site.ts`, never edit `.olympus/00`, `05`, `06` (append `07`–`10` instead), never touch `assets-out/` sources.

## Evidence and safety
No invented facts (booking system, reviews, awards, chef). Media provenance per `.olympus/05-asset-manifest.md`; Artlist generation only after the user approves the manifest's Generation approval block. Browser evidence (screenshots) over claims.

## Verification
Before handoff: `npm run build` clean; screenshots 1440/390 light + reduced motion; keyboard pass; contrast pairs spot-checked; payload table; `07-qa.md` written by the builder, `10-finish-review.md` by an independent read-only reviewer scored against `DESIGN.md`; one fix round max (loop bounds in the Apollo `AGENTS.md`).
