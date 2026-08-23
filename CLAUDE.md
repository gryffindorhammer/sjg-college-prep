# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single self-contained static HTML page (`index.html`) — a college visit/open-house planner for one student (Stephen). There is no build system, package manager, server, or test suite. Open `index.html` directly in a browser to view/develop it.

## Architecture

Everything lives in `index.html`: inline `<style>`, inline `<script>`, and a Leaflet map loaded from a CDN (`unpkg.com/leaflet`). There is no bundler and no external JS files.

The script is organized around three hand-maintained data structures, in order:

- `schools` — an array of tuples (not objects) per school: `[name, state, region, scheduleText, visitUrl, virtualUrl, dated?]`. `region` must be one of the values hardcoded in the `<select id="region">` options (Northeast, Mid-Atlantic, Midwest, West, Canada). The trailing `dated` boolean (only present when `true`) marks entries with a confirmed date, which renders with the green `.date` style instead of the gray `.calendar` style.
- `coordinates` — a `{ "School Name": [lat, lng] }` map used to place markers; keys must match `schools[i][0]` exactly (including punctuation like `&` and en dashes).
- `profiles` — a `{ "School Name": {...} }` map of sourced facts (enrollment, tuition, admission/retention/graduation rates, rankings, math major, theater program, productions/clubs, non-major participation). Each fact is either the shared `pend` sentinel (`{ notes: PENDING }`, used for schools "not yet researched") or an object with `value`/`details`, `source`, `url`, and `checked` (an ISO date). Ranking fields (`rankingOverall`, `rankingMath`, `rankingTheater`) use `{ rank, source, url, year }` instead, or `null` when no credible ranking exists for that category — `null` renders differently from `pend` (a "no credible ranking found" message vs. "not yet researched").

Rendering is plain template-string generation, no framework: `render()` filters `schools` by the search box and region `<select>`, rebuilds `#schools` as `<article>` cards, and rebuilds the Leaflet marker layer/bounds to match. `profileHTML()` builds the collapsible "sourced profile" panel per school from the `profiles` entry, via the small `plainRow`/`factRow`/`rankRow`/`textRow` helpers (each has its own "empty" fallback text). The profile panel starts hidden and is toggled per-card by a delegated click listener on `#schools`.

## Editing conventions

- When adding, removing, or renaming a school, update all three structures together: `schools`, `coordinates`, and `profiles` (or add a `pend`-filled `profiles` entry if not yet researched). A name typo in any one of them silently breaks the map marker or the profile panel for that school.
- Every sourced fact in `profiles` should carry a real `source`/`url`/`checked` date rather than being asserted without attribution — that sourcing (plus per-fact "checked" dates) is the point of the profile panel.
- The school/date counts in the `<header>` copy and in the "Profile data note" (`.notice`) are hand-written and must be updated manually when schools are added/removed or profiles are filled in — they are not computed from the data arrays. `README.md`'s school count and "checked" date are similarly hand-written and drift independently; update it alongside `index.html` when either changes.
