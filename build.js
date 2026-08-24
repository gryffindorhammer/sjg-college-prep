// Static site generator for the college visit planner.
//
// Reads one Markdown file per school from data/schools/*.md (YAML frontmatter
// for sourced facts, prose body for the math/theater "fit" write-up) and
// generates plain static HTML: index.html (table), schools/<slug>.html
// (per-school detail page), and map.html (standalone Leaflet map).
//
// Run with: node build.js
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data', 'schools');
const REGIONS = ['Northeast', 'Mid-Atlantic', 'Midwest', 'West', 'Canada'];

const SECTION_HEADINGS = [
  ['mathMajor', 'Mathematics major'],
  ['theaterProgram', 'Theater program'],
  ['productionsClubs', 'Student productions & clubs'],
  ['nonMajorParticipation', 'Non-major participation'],
];
const HEADING_TO_KEY = Object.fromEntries(SECTION_HEADINGS.map(([k, h]) => [h, k]));

function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Renders plain text that may contain `[label](url)` markdown links.
function renderInline(text) {
  const escaped = escapeHtml(text);
  return escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) =>
    `<a href="${url}" target="_blank" rel="noopener">${label}</a>`
  );
}

function parseBody(content) {
  const sections = {};
  const parts = content.split(/^## /m).slice(1);
  for (const part of parts) {
    const nl = part.indexOf('\n');
    const heading = (nl === -1 ? part : part.slice(0, nl)).trim();
    const key = HEADING_TO_KEY[heading];
    if (!key) continue;
    const body = nl === -1 ? '' : part.slice(nl + 1);
    const lines = body.split('\n').map((l) => l.trim()).filter(Boolean);
    const section = { details: '', type: null, source: null, url: null, checked: null, notes: null };
    for (const line of lines) {
      if (line.startsWith('Type: ')) section.type = line.slice(6);
      else if (line.startsWith('Source: ')) {
        const m = line.match(/^Source: \[(.+)\]\((.+)\) · checked (.+)$/);
        if (m) { section.source = m[1]; section.url = m[2]; section.checked = m[3]; }
      } else if (line.startsWith('Note: ')) section.notes = line.slice(6);
      else section.details = section.details ? `${section.details} ${line}` : line;
    }
    if (section.details) sections[key] = section;
  }
  return sections;
}

function loadSchools() {
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.md'));
  const schools = files.map((file) => {
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
    const { data, content } = matter(raw);
    if (!REGIONS.includes(data.region)) {
      throw new Error(`${file}: region "${data.region}" is not one of ${REGIONS.join(', ')}`);
    }
    if (!Array.isArray(data.coords) || data.coords.length !== 2) {
      throw new Error(`${file}: missing/invalid coords`);
    }
    return { slug, ...data, sections: parseBody(content) };
  });
  schools.sort((a, b) => a.order - b.order);
  return schools;
}

function factRow(label, fact) {
  if (!fact || fact === 'none') {
    const empty = fact === 'none' ? 'No credible ranking found for this category' : 'Not yet researched — sourced profile coming in a follow-up update.';
    return `<div class="fact"><span class="fact-label">${label}</span><span class="fact-value fact-empty">${empty}</span></div>`;
  }
  const note = fact.notes ? `<div class="fact-note">${renderInline(fact.notes)}</div>` : '';
  return `<div class="fact"><span class="fact-label">${label}</span><span class="fact-value">${renderInline(fact.value)}</span><span class="fact-source"><a href="${escapeHtml(fact.url)}" target="_blank" rel="noopener">${escapeHtml(fact.source)}</a> · checked ${fact.checked}</span>${note}</div>`;
}

function rankRow(label, rank) {
  if (!rank || rank === 'none') {
    const empty = rank === 'none' ? 'No credible ranking found for this category' : 'Not yet researched — sourced profile coming in a follow-up update.';
    return `<div class="fact"><span class="fact-label">${label}</span><span class="fact-value fact-empty">${empty}</span></div>`;
  }
  const note = rank.notes ? `<div class="fact-note">${renderInline(rank.notes)}</div>` : '';
  return `<div class="fact"><span class="fact-label">${label}</span><span class="fact-value">${renderInline(rank.rank)}</span><span class="fact-source"><a href="${escapeHtml(rank.url)}" target="_blank" rel="noopener">${escapeHtml(rank.source)}</a>, ${rank.year}</span>${note}</div>`;
}

function textRow(label, section, typePrefix) {
  if (!section) {
    return `<div class="fact"><span class="fact-label">${label}</span><span class="fact-value fact-empty">Not yet researched — sourced profile coming in a follow-up update.</span></div>`;
  }
  const prefix = typePrefix && section.type ? `${cap(section.type)} — ` : '';
  const note = section.notes ? `<div class="fact-note">${renderInline(section.notes)}</div>` : '';
  const source = section.source ? `<span class="fact-source"><a href="${escapeHtml(section.url)}" target="_blank" rel="noopener">${escapeHtml(section.source)}</a> · checked ${section.checked}</span>` : '';
  return `<div class="fact"><span class="fact-label">${label}</span><span class="fact-value">${prefix}${renderInline(section.details)}</span>${source}${note}</div>`;
}

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

function pageShell({ title, activeNav, body, depth }) {
  const prefix = depth ? '../'.repeat(depth) : '';
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="${prefix}assets/style.css">
</head>
<body>
  <header>
    <h1>College visit planner</h1>
    <p>Official admissions links for in-person tours, virtual options, and open-house schedules — plus sourced comparison profiles and Stephen's math/theater fit for every school.</p>
    <nav>
      <a href="${prefix}index.html"${activeNav === 'schools' ? ' aria-current="page"' : ''}>Schools</a>
      <a href="${prefix}map.html"${activeNav === 'map' ? ' aria-current="page"' : ''}>Map</a>
    </nav>
  </header>
  <main>
${body}
  </main>
</body>
</html>
`;
}

const FACT_KEYS = ['enrollment', 'studentFacultyRatio', 'tuition', 'admissionRate', 'retentionRate', 'graduationRate', 'rankingOverall', 'rankingMath', 'rankingTheater'];
function isFullyPending(s) {
  return FACT_KEYS.every((k) => !s[k]) && Object.keys(s.sections).length === 0;
}

function buildIndex(schools) {
  const pendingSchools = schools.filter(isFullyPending);
  const researchedCount = schools.length - pendingSchools.length;
  const datedCount = schools.filter((s) => s.dated).length;

  const clientRows = schools.map((s) => ({
    slug: s.slug,
    name: s.name,
    state: s.state,
    region: s.region,
    scheduleText: s.scheduleText,
    dated: s.dated,
    visitUrl: s.visitUrl,
    virtualUrl: s.virtualUrl,
    order: s.order,
    admissionRate: s.admissionRate && s.admissionRate !== 'none' ? s.admissionRate.value : null,
    rankingOverall: s.rankingOverall && s.rankingOverall !== 'none' ? s.rankingOverall.rank : null,
    rankingMath: s.rankingMath && s.rankingMath !== 'none' ? s.rankingMath.rank : null,
    theaterType: s.sections.theaterProgram ? s.sections.theaterProgram.type : null,
  }));

  const body = `
    <section class="notice" aria-label="Schedule note">
      Event calendars change often. Green entries have a published Fall 2026 date (${datedCount} of ${schools.length} schools); gray entries link to the school's live official calendar. Register before making travel plans.
    </section>
    <section class="notice" aria-label="Profile data note">
      Click a school for its full sourced profile: enrollment, cost, and outcome data plus Stephen's math/theater fit. Every figure links to its source and the date it was last checked. Rankings are only shown when a credible source specifically publishes one for that category (overall, math, or theater) — where no theater ranking exists, sourced program facts are shown instead. ${researchedCount} of ${schools.length} schools have a sourced profile so far${pendingSchools.length ? `; the rest (${pendingSchools.map((s) => s.name).join(', ')}) are marked "not yet researched."` : '.'}
    </section>
    <div class="controls">
      <label class="hidden" for="search">Search schools</label>
      <input id="search" type="search" placeholder="Search a school or state" autocomplete="off">
      <label class="hidden" for="region">Filter region</label>
      <select id="region"><option value="">All regions</option>${REGIONS.map((r) => `<option>${r}</option>`).join('')}</select>
      <label class="hidden" for="sort">Sort by</label>
      <select id="sort">
        <option value="order">Default order</option>
        <option value="name">School name</option>
        <option value="state">State</option>
        <option value="region">Region</option>
        <option value="admissionRate">Acceptance rate</option>
        <option value="rankingOverall">Overall ranking</option>
        <option value="rankingMath">Math ranking</option>
        <option value="theaterType">Theater program</option>
        <option value="scheduleText">Visit schedule</option>
      </select>
      <div class="view-toggle" role="group" aria-label="Switch view">
        <button type="button" id="view-table" aria-pressed="true">Table</button>
        <button type="button" id="view-grid" aria-pressed="false">Grid</button>
      </div>
      <span class="count" id="count"></span>
    </div>
    <div class="table-section" id="table-section">
      <p class="scroll-hint" aria-hidden="true">Swipe to see more →</p>
      <div class="table-wrap">
        <table class="schools">
          <colgroup>
            <col style="width:14%"><col style="width:6%"><col style="width:8%">
            <col style="width:12%"><col style="width:12%"><col style="width:11%">
            <col style="width:13%"><col style="width:16%"><col style="width:8%">
          </colgroup>
          <thead>
            <tr>
              <th data-sort="name">School <span class="arrow">▲▼</span></th>
              <th data-sort="state">State <span class="arrow">▲▼</span></th>
              <th data-sort="region">Region <span class="arrow">▲▼</span></th>
              <th data-sort="admissionRate">Acceptance rate <span class="arrow">▲▼</span></th>
              <th data-sort="rankingOverall">Overall ranking <span class="arrow">▲▼</span></th>
              <th data-sort="rankingMath">Math ranking <span class="arrow">▲▼</span></th>
              <th data-sort="theaterType">Theater program <span class="arrow">▲▼</span></th>
              <th data-sort="scheduleText">Visit schedule <span class="arrow">▲▼</span></th>
              <th>Links</th>
            </tr>
          </thead>
          <tbody id="schools-body"></tbody>
        </table>
      </div>
    </div>
    <div class="grid-wrap hidden" id="schools-grid"></div>
    <footer>"Virtual" links point to each college's official admissions visit page or event calendar. Exact online-session dates are generally released in those live calendars. See the <a href="map.html">map view</a> for all tracked colleges at once.</footer>
    <script>window.SCHOOLS = ${JSON.stringify(clientRows)};</script>
    <script src="assets/site.js"></script>`;

  return pageShell({ title: 'SJG College Visit Planner', activeNav: 'schools', body, depth: 0 });
}

function buildSchoolPage(s) {
  const theaterSection = s.sections.theaterProgram;
  const body = `
    <div class="detail-head">
      <a class="back" href="../index.html">← All schools</a>
      <h2>${escapeHtml(s.name)}</h2>
      <div class="meta">${escapeHtml(s.location || `${s.state} · ${s.region}`)}</div>
      <span class="pill ${s.dated ? 'date' : 'calendar'}">${escapeHtml(s.scheduleText)}</span>
      <div class="links-row">
        <a href="${escapeHtml(s.visitUrl)}" target="_blank" rel="noopener">In-person visit ↗</a>
        <a href="${escapeHtml(s.virtualUrl)}" target="_blank" rel="noopener">Virtual / events ↗</a>
        <a href="../map.html?school=${s.slug}">View on map ↗</a>
      </div>
    </div>
    <h3 class="section-heading">Sourced profile</h3>
    <div class="profile-grid">
      ${factRow('Undergraduate enrollment', s.enrollment)}
      ${factRow('Student&ndash;faculty ratio', s.studentFacultyRatio)}
      ${factRow('Tuition &amp; fees', s.tuition)}
      ${factRow('Acceptance rate', s.admissionRate)}
      ${factRow('Retention rate', s.retentionRate)}
      ${factRow('Graduation rate', s.graduationRate)}
      ${rankRow('Overall ranking', s.rankingOverall)}
      ${rankRow('Mathematics ranking', s.rankingMath)}
      ${rankRow('Theater ranking', s.rankingTheater)}
    </div>
    <h3 class="section-heading">Stephen's fit: math &amp; theater</h3>
    <div class="profile-grid">
      ${textRow('Mathematics major', s.sections.mathMajor, false)}
      ${textRow('Theater/drama program', theaterSection, true)}
      ${textRow('Student productions &amp; clubs', s.sections.productionsClubs, false)}
      ${textRow('Non-major participation', s.sections.nonMajorParticipation, false)}
    </div>`;

  return pageShell({ title: `${s.name} — College Visit Planner`, activeNav: 'schools', body, depth: 1 });
}

function buildMap(schools) {
  const points = schools.map((s) => ({
    slug: s.slug, name: s.name, state: s.state, region: s.region, coords: s.coords, visitUrl: s.visitUrl,
  }));
  const body = `
    <div id="map" role="application" aria-label="Map of tracked colleges"></div>
    <footer>Click a marker for quick links, or open a school's full sourced profile from the <a href="index.html">table view</a>.</footer>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script>
      var POINTS = ${JSON.stringify(points)};
      function escapeHtml(str) {
        return String(str == null ? '' : str)
          .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
      }
      var params = new URLSearchParams(location.search);
      var focusSlug = params.get('school');
      var map = L.map('map', {scrollWheelZoom:false}).setView([40.5,-87], 4);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19, attribution:'&copy; OpenStreetMap contributors' }).addTo(map);
      var bounds = [];
      var focusMarker = null;
      POINTS.forEach(function (p) {
        var marker = L.marker(p.coords).addTo(map)
          .bindPopup('<strong>' + escapeHtml(p.name) + '</strong><br>' + escapeHtml(p.state) + ' · ' + escapeHtml(p.region) + '<br><a href="schools/' + escapeHtml(p.slug) + '.html">Full profile →</a> &middot; <a href="' + escapeHtml(p.visitUrl) + '" target="_blank" rel="noopener">Visit ↗</a>');
        bounds.push(p.coords);
        if (p.slug === focusSlug) focusMarker = marker;
      });
      if (focusMarker) { map.setView(focusMarker.getLatLng(), 10); focusMarker.openPopup(); }
      else if (bounds.length > 1) map.fitBounds(bounds, {padding:[28,28], maxZoom:6});
      else if (bounds.length === 1) map.setView(bounds[0], 10);
    </script>`;
  return pageShell({ title: 'Map — College Visit Planner', activeNav: 'map', body, depth: 0 })
    .replace('</head>', '  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">\n</head>');
}

function main() {
  const schools = loadSchools();

  fs.writeFileSync(path.join(ROOT, 'index.html'), buildIndex(schools));

  const schoolsDir = path.join(ROOT, 'schools');
  fs.rmSync(schoolsDir, { recursive: true, force: true });
  fs.mkdirSync(schoolsDir, { recursive: true });
  for (const s of schools) {
    fs.writeFileSync(path.join(schoolsDir, `${s.slug}.html`), buildSchoolPage(s));
  }

  fs.writeFileSync(path.join(ROOT, 'map.html'), buildMap(schools));

  console.log(`Built index.html, map.html, and ${schools.length} school pages.`);
}

main();
