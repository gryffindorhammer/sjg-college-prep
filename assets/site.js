(function () {
  var tbody = document.querySelector('#schools-body');
  var search = document.querySelector('#search');
  var region = document.querySelector('#region');
  var count = document.querySelector('#count');
  var headers = document.querySelectorAll('table.schools th[data-sort]');
  if (!tbody || !window.SCHOOLS) return;

  var sortKey = 'order';
  var sortDir = 1;

  function cellHTML(s) {
    var pillClass = s.dated ? 'date' : 'calendar';
    var rate = s.admissionRate || '—';
    var rank = s.rankingOverall || '—';
    return (
      '<tr>' +
      '<td class="name"><a href="schools/' + s.slug + '.html">' + s.name + '</a></td>' +
      '<td>' + s.state + '</td>' +
      '<td>' + s.region + '</td>' +
      '<td><span class="pill ' + pillClass + '">' + s.scheduleText + '</span></td>' +
      '<td>' + rate + '</td>' +
      '<td>' + rank + '</td>' +
      '<td><div class="links-cell">' +
      '<a href="' + s.visitUrl + '" target="_blank" rel="noopener">Visit ↗</a>' +
      '<a href="' + s.virtualUrl + '" target="_blank" rel="noopener">Virtual ↗</a>' +
      '</div></td>' +
      '</tr>'
    );
  }

  function compare(a, b) {
    var av = a[sortKey], bv = b[sortKey];
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
