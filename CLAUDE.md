# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A statically-generated college visit/open-house planner for one student (Stephen): a sortable/filterable table of schools with an inline, filter-synced Leaflet map (`index.html`), and one detail page per school with a sourced profile (`schools/<slug>.html`). The generated HTML is committed to the repo, so it can still be opened directly in a browser (or served as plain static files) with no build step required to *view* it — the build step is only needed to *regenerate* the HTML after editing data.

## Architecture

- `data/schools/<slug>.md` — one Markdown file per school, the single source of truth. YAML frontmatter holds structured/sourced facts (`name`, `state`, `region`, `coords`, `scheduleText`, `dated`, `visitUrl`, `virtualUrl`, `location`, and the sourced facts `enrollment`/`studentFacultyRatio`/`tuition`/`admissionRate`/`retentionRate`/`graduationRate`/`rankingOverall`/`rankingMath`/`rankingTheater`), plus `fitForStephen` — a hand-judged `"yes"`/`"maybe"`/`"no"` summary (quoted, so YAML doesn't coerce `yes`/`no` to booleans) distilled from the Markdown body's fit write-up (not currently rendered in the table — the table's math/theater columns are `rankingMath` and the Theater program section's `Type:` instead). The Markdown body holds the prose "fit" write-up as `## ` sections (see below). `region` must be one of `REGIONS` in `build.js` (Northeast, Mid-Atlantic, Midwest, West, Canada) — the build fails loudly if not. `order` in the frontmatter preserves the original curated ordering (roughly: confirmed dates and higher-priority schools first) as the table's default sort.
- `build.js` — the static site generator (`npm run build` / `node build.js`). Reads every `data/schools/*.md` via `gray-matter`, parses each Markdown body into named sections, and writes `index.html` and `schools/<slug>.html` (one per school). No framework, no bundler — just template strings, same style as the old single-file version.
- `assets/style.css`, `assets/site.js` — shared stylesheet and the table's client-side search/filter/sort behavior (vanilla JS, operates on a `window.SCHOOLS` array that `build.js` embeds inline in `index.html`). `site.js` also drives the inline Leaflet map in `index.html`'s `#school-map` section — it stays in sync with the current search/region filters, and loads Leaflet from `unpkg.com` (CDN). A school detail page's "School map ↗" link passes `?school=<slug>` so the map zooms to and opens that school's marker on load.
- `index.html`, `schools/*.html` — **generated**. Never hand-edit these; edit the corresponding `data/schools/*.md` (or `build.js`/`assets/*` for structural/styling changes) and run `node build.js`.

### Frontmatter fact shape

Each sourced fact is either `null` (not yet researched — renders "Not yet researched…") or an object with `value`, `source`, `url`, `checked` (ISO date), and an optional `notes` caveat (rendered as a small italic line regardless of whether `value` is present — don't drop it). Ranking fields (`rankingOverall`/`rankingMath`/`rankingTheater`) use `{ rank, source, url, year, notes? }`, or the **string** `"none"` when a credible source was checked but publishes no ranking for that category (renders "No credible ranking found…", distinct from the `null`/pending case).

### Markdown body sections

Exactly four possible `## ` headings, each becomes one row in the school's "fit" section — omit a heading entirely if not yet researched:

```
## Mathematics major
<prose paragraph, may contain [text](url) links>

Source: [source name](url) · checked YYYY-MM-DD
Note: <optional caveat>

## Theater program
Type: <e.g. "major and minor" — optional, prefixed onto the rendered value>

<prose paragraph>

Source: [source name](url) · checked YYYY-MM-DD

## Student productions & clubs
...

## Non-major participation
...
```

`build.js`'s `parseBody()` expects this exact shape (a `Source:` line matching `[label](url) · checked DATE`, an optional `Note:` line, everything else concatenated into `details`) — see it before changing the format.

## Editing conventions

- To add/remove/rename a school: add, delete, or rename the corresponding `data/schools/<slug>.md` file, then run `node build.js`. There's no more matching-by-name across separate arrays — one file is the whole school.
- Every sourced fact should carry a real `source`/`url`/`checked` date rather than being asserted without attribution — that sourcing is the point of the profile panel.
- The school/date/"researched" counts in the generated header and notice text are now computed from the data at build time (see `buildIndex()` in `build.js`) — don't hand-edit them in the generated HTML, and don't add new hand-maintained counts; compute them in `build.js` instead.
- `README.md`'s school count is still hand-written; update it alongside a schools-count change.
- After editing anything under `data/schools/`, `assets/`, or `build.js`, run `node build.js` (needs `npm install` once for the `gray-matter` devDependency) and commit both the source change and the regenerated `index.html`/`schools/*.html`.
- For in-person visits, record and display the venue's local time zone; virtual events use ET unless their registration specifies another zone. The ICS entry must use the same local `TZID`.
