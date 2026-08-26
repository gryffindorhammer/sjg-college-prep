(function () {
  var tbody = document.querySelector('#schools-body');
  var grid = document.querySelector('#schools-grid');
  var tableSection = document.querySelector('#table-section');
  var search = document.querySelector('#search');
  var region = document.querySelector('#region');
  var sortSelect = document.querySelector('#sort');
  var sortDirBtn = document.querySelector('#sort-dir');
  var viewTableBtn = document.querySelector('#view-table');
  var viewGridBtn = document.querySelector('#view-grid');
  var count = document.querySelector('#count');
  var headers = document.querySelectorAll('table.schools th[data-sort]');
  if (!tbody || !window.SCHOOLS) return;

  var sortKey = 'order';
  var sortDir = 1;
  var NUMERIC_SORT_KEYS = ['admissionRate', 'rankingOverall', 'rankingMath'];

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  function computeFields(s) {
    return {
      pillClass: s.completed ? 'completed' : s.selfGuided ? 'self-guided' : s.dated ? 'date' : 'calendar',
      completionNotes: s.completionNotes ? escapeHtml(s.completionNotes) : '',
      rate: s.admissionRate ? escapeHtml(s.admissionRate) : '—',
      rank: s.rankingOverall ? escapeHtml(s.rankingOverall) : '—',
      mathRank: s.rankingMath ? escapeHtml(s.rankingMath) : '—',
      mathPhd: s.mathPhd ? escapeHtml(s.mathPhd) : '—',
      theater: s.theaterType ? escapeHtml(cap(s.theaterType)) : '—'
    };
  }

  function cellHTML(s) {
    var f = computeFields(s);
    return (
      '<tr>' +
      '<td class="name"><a href="schools/' + escapeHtml(s.slug) + '.html">' + escapeHtml(s.name) + '</a></td>' +
      '<td>' + escapeHtml(s.state) + '</td>' +
      '<td>' + escapeHtml(s.region) + '</td>' +
      '<td>' + f.rate + '</td>' +
      '<td>' + f.rank + '</td>' +
      '<td>' + f.mathRank + '</td>' +
      '<td>' + f.mathPhd + '</td>' +
      '<td class="theater">' + f.theater + '</td>' +
      '<td class="schedule"><span class="pill ' + f.pillClass + '">' + escapeHtml(s.scheduleText) + '</span>' + (f.completionNotes ? '<div class="completion-note">Notes: ' + f.completionNotes + '</div>' : '') + '</td>' +
      '<td><div class="links-cell">' +
      '<a href="' + escapeHtml(s.visitUrl) + '" target="_blank" rel="noopener">Visit ↗</a>' +
      '<a href="' + escapeHtml(s.virtualUrl) + '" target="_blank" rel="noopener">Virtual ↗</a>' +
      '</div></td>' +
      '</tr>'
    );
  }

  function cardHTML(s) {
    var f = computeFields(s);
    return (
      '<article class="school-card">' +
      '<h3><a href="schools/' + escapeHtml(s.slug) + '.html">' + escapeHtml(s.name) + '</a></h3>' +
      '<div class="school-card-meta">' + escapeHtml(s.state) + ' · ' + escapeHtml(s.region) + '</div>' +
      '<div class="school-card-facts">' +
      '<div class="card-fact"><span class="card-fact-label">Acceptance rate</span><span>' + f.rate + '</span></div>' +
      '<div class="card-fact"><span class="card-fact-label">Overall ranking</span><span>' + f.rank + '</span></div>' +
      '<div class="card-fact"><span class="card-fact-label">Math ranking</span><span>' + f.mathRank + '</span></div>' +
      '<div class="card-fact"><span class="card-fact-label">Math Ph.D.</span><span>' + f.mathPhd + '</span></div>' +
      '<div class="card-fact"><span class="card-fact-label">Theater program</span><span>' + f.theater + '</span></div>' +
      '</div>' +
      '<span class="pill ' + f.pillClass + '">' + escapeHtml(s.scheduleText) + '</span>' + (f.completionNotes ? '<div class="completion-note">Notes: ' + f.completionNotes + '</div>' : '') +
      '<div class="links-cell">' +
      '<a href="' + escapeHtml(s.visitUrl) + '" target="_blank" rel="noopener">Visit ↗</a>' +
      '<a href="' + escapeHtml(s.virtualUrl) + '" target="_blank" rel="noopener">Virtual ↗</a>' +
      '</div>' +
      '</article>'
    );
  }

  function extractNumber(v) {
    if (v == null) return null;
    var m = String(v).match(/-?\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : null;
  }

  function compare(a, b) {
    var av = a[sortKey], bv = b[sortKey];
    if (NUMERIC_SORT_KEYS.indexOf(sortKey) !== -1) {
      var an = extractNumber(av), bn = extractNumber(bv);
      if (an === null && bn === null) return 0;
      if (an === null) return 1; // missing values always sort last
      if (bn === null) return -1;
      return (an - bn) * sortDir;
    }
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * sortDir;
    av = (av || '').toString().toLowerCase();
    bv = (bv || '').toString().toLowerCase();
    if (av < bv) return -1 * sortDir;
    if (av > bv) return 1 * sortDir;
    return 0;
  }

  function render() {
    var term = search.value.trim().toLowerCase();
    var selectedRegion = region.value;
    var shown = window.SCHOOLS.filter(function (s) {
      var matchesTerm = !term || (s.name + ' ' + s.state + ' ' + s.region).toLowerCase().indexOf(term) !== -1;
      var matchesRegion = !selectedRegion || s.region === selectedRegion;
      return matchesTerm && matchesRegion;
    });
    shown.sort(compare);
    tbody.innerHTML = shown.map(cellHTML).join('');
    if (grid) grid.innerHTML = shown.map(cardHTML).join('');
    count.textContent = shown.length + ' school' + (shown.length === 1 ? '' : 's');
  }

  function setActiveHeader(key) {
    headers.forEach(function (h) { h.classList.toggle('active', h.getAttribute('data-sort') === key); });
    if (sortSelect) sortSelect.value = key;
    if (sortDirBtn) {
      sortDirBtn.setAttribute('aria-pressed', String(sortDir === -1));
      sortDirBtn.textContent = sortDir === -1 ? '↓' : '↑';
    }
  }

  headers.forEach(function (th) {
    th.addEventListener('click', function () {
      var key = th.getAttribute('data-sort');
      if (sortKey === key) sortDir *= -1; else { sortKey = key; sortDir = 1; }
      setActiveHeader(sortKey);
      render();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      sortKey = sortSelect.value;
      sortDir = 1;
      setActiveHeader(sortKey);
      render();
    });
  }

  if (sortDirBtn) {
    sortDirBtn.addEventListener('click', function () {
      sortDir *= -1;
      setActiveHeader(sortKey);
      render();
    });
  }

  function setView(view) {
    var isGrid = view === 'grid';
    if (tableSection) tableSection.classList.toggle('hidden', isGrid);
    if (grid) grid.classList.toggle('hidden', !isGrid);
    if (viewTableBtn) viewTableBtn.setAttribute('aria-pressed', String(!isGrid));
    if (viewGridBtn) viewGridBtn.setAttribute('aria-pressed', String(isGrid));
    try { localStorage.setItem('schoolsView', view); } catch (e) {}
  }

  if (viewTableBtn && viewGridBtn) {
    viewTableBtn.addEventListener('click', function () { setView('table'); });
    viewGridBtn.addEventListener('click', function () { setView('grid'); });
    var savedView = 'table';
    try { savedView = localStorage.getItem('schoolsView') || 'table'; } catch (e) {}
    setView(savedView);
  }

  search.addEventListener('input', render);
  region.addEventListener('change', render);
  render();
})();
