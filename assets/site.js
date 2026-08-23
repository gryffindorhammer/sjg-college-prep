(function () {
  var tbody = document.querySelector('#schools-body');
  var search = document.querySelector('#search');
  var region = document.querySelector('#region');
  var count = document.querySelector('#count');
  var headers = document.querySelectorAll('table.schools th[data-sort]');
  if (!tbody || !window.SCHOOLS) return;

  var sortKey = 'order';
  var sortDir = 1;
  var NUMERIC_SORT_KEYS = ['admissionRate', 'rankingOverall'];
  var FIT_ORDER = { yes: 0, maybe: 1, no: 2 };
  var FIT_LABEL = { yes: 'Yes', maybe: 'Maybe', no: 'No' };

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function cellHTML(s) {
    var pillClass = s.dated ? 'date' : 'calendar';
    var rate = s.admissionRate ? escapeHtml(s.admissionRate) : '—';
    var rank = s.rankingOverall ? escapeHtml(s.rankingOverall) : '—';
    var fit = s.fitForStephen
      ? '<span class="pill fit-' + escapeHtml(s.fitForStephen) + '">' + escapeHtml(FIT_LABEL[s.fitForStephen] || s.fitForStephen) + '</span>'
      : '—';
    return (
      '<tr>' +
      '<td class="name"><a href="schools/' + escapeHtml(s.slug) + '.html">' + escapeHtml(s.name) + '</a></td>' +
      '<td>' + escapeHtml(s.state) + '</td>' +
      '<td>' + escapeHtml(s.region) + '</td>' +
      '<td>' + rate + '</td>' +
      '<td>' + rank + '</td>' +
      '<td>' + fit + '</td>' +
      '<td class="schedule"><span class="pill ' + pillClass + '">' + escapeHtml(s.scheduleText) + '</span></td>' +
      '<td><div class="links-cell">' +
      '<a href="' + escapeHtml(s.visitUrl) + '" target="_blank" rel="noopener">Visit ↗</a>' +
      '<a href="' + escapeHtml(s.virtualUrl) + '" target="_blank" rel="noopener">Virtual ↗</a>' +
      '</div></td>' +
      '</tr>'
    );
  }

  function extractNumber(v) {
    if (v == null) return null;
    var m = String(v).match(/-?\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : null;
  }

  function compare(a, b) {
    var av = a[sortKey], bv = b[sortKey];
    if (sortKey === 'fitForStephen') {
      var ao = av in FIT_ORDER ? FIT_ORDER[av] : 3;
      var bo = bv in FIT_ORDER ? FIT_ORDER[bv] : 3;
      return (ao - bo) * sortDir;
    }
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
    count.textContent = shown.length + ' school' + (shown.length === 1 ? '' : 's');
  }

  headers.forEach(function (th) {
    th.addEventListener('click', function () {
      var key = th.getAttribute('data-sort');
      if (sortKey === key) sortDir *= -1; else { sortKey = key; sortDir = 1; }
      headers.forEach(function (h) { h.classList.remove('active'); });
      th.classList.add('active');
      render();
    });
  });

  search.addEventListener('input', render);
  region.addEventListener('change', render);
  render();
})();
