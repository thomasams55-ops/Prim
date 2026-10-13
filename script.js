(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* =========================================================
     DAFTAR KARYA — edit bagian ini untuk menambah karya.
     - judul, kategori, tahun, deskripsi : teks yang tampil
     - file  : tautan karya. Bisa nama file di folder "karya/"
               (contoh: "karya/laporan.pdf") atau tautan luar
               (YouTube, Google Drive, Canva, dll).
               Kosongkan ("") kalau belum ada: tampil "Segera hadir".
     - unduh : true  -> muncul tombol Unduh (untuk file di folder karya/)
     ========================================================= */
  const KARYA = [
    { judul: 'Hasil edit foto Lightroom', kategori: 'Foto',        tahun: '', deskripsi: 'Kumpulan foto hasil editan Lightroom akan ditambahkan di sini.', file: '', unduh: false },
    { judul: 'Desain Canva',              kategori: 'Desain',      tahun: '', deskripsi: 'Desain poster dan konten buatan Canva akan ditambahkan di sini.', file: '', unduh: false },
    { judul: 'Video CapCut',              kategori: 'Video',       tahun: '', deskripsi: 'Video hasil editan CapCut akan ditambahkan di sini.',            file: '', unduh: false },
    { judul: 'Video Kinemaster',          kategori: 'Video',       tahun: '', deskripsi: 'Video hasil editan Kinemaster akan ditambahkan di sini.',        file: '', unduh: false },
    { judul: 'Presentasi PowerPoint',     kategori: 'Presentasi',  tahun: '', deskripsi: 'Presentasi (PPT) akan ditambahkan di sini.',                     file: '', unduh: false },
    { judul: 'Dokumen tugas dan laporan', kategori: 'Dokumen',     tahun: '', deskripsi: 'Dokumen dan laporan akan ditambahkan di sini.',                  file: '', unduh: false }
  ];

  const ICONS = { Dokumen: '📄', Presentasi: '📊', Video: '🎬', Foto: '📷', Desain: '🎨' };

  const nav = $('#nav');
  const progress = $('#progress');
  const indicator = $('#indicator');
  const burger = $('#burger');
  const links = $$('.nav__link');
  const mq = window.matchMedia('(max-width: 900px)');

  /* ---------- Garis progres ---------- */
  function onScroll() {
    const d = document.documentElement;
    const max = d.scrollHeight - d.clientHeight;
    progress.style.transform = 'scaleX(' + (max > 0 ? d.scrollTop / max : 0) + ')';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Penanda menu aktif (bergulir mengikuti bagian) ---------- */
  let current = links[0];

  function moveIndicator() {
    if (!current || mq.matches) { indicator.style.opacity = 0; return; }
    indicator.style.opacity = 1;
    indicator.style.width = current.offsetWidth + 'px';
    indicator.style.transform = 'translateX(' + current.offsetLeft + 'px)';
  }

  function setActive(link) {
    current = link;
    links.forEach(function (l) { l.classList.toggle('active', l === link); });
    moveIndicator();
  }

  setActive(links[0]);
  window.addEventListener('resize', moveIndicator);
  window.addEventListener('load', moveIndicator);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveIndicator);

  const spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const link = links.find(function (l) { return l.getAttribute('href') === '#' + entry.target.id; });
      if (link) setActive(link);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(function (s) { spy.observe(s); });

  /* ---------- Menu HP ---------- */
  function setMenu(open) {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  links.forEach(function (l) { l.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Daftar karya + filter + pencarian ---------- */
  const filtersEl = $('#filters');
  const docsEl = $('#docs');
  const emptyEl = $('#empty');
  const searchEl = $('#search');
  const state = { kategori: 'Semua', q: '' };

  function esc(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderFilters() {
    const cats = ['Semua'].concat(KARYA.map(function (k) { return k.kategori; }).filter(function (v, i, a) { return a.indexOf(v) === i; }));
    filtersEl.innerHTML = cats.map(function (c) {
      return '<button type="button" class="chip" data-kat="' + esc(c) + '" aria-pressed="' + (c === state.kategori) + '">' + esc(c) + '</button>';
    }).join('');
  }

  function renderDocs() {
    const q = state.q.trim().toLowerCase();
    const list = KARYA.filter(function (k) {
      const okKat = state.kategori === 'Semua' || k.kategori === state.kategori;
      const okQ = !q || (k.judul + ' ' + k.deskripsi).toLowerCase().indexOf(q) !== -1;
      return okKat && okQ;
    });

    docsEl.innerHTML = list.map(function (k, i) {
      const meta = [k.kategori, k.tahun].filter(Boolean).join(' • ');
      let actions = '<span class="soon">Segera hadir</span>';
      if (k.file) {
        actions = '<a class="mini mini--ink" href="' + esc(k.file) + '" target="_blank" rel="noopener">Lihat</a>';
        if (k.unduh) actions += '<a class="mini mini--line" href="' + esc(k.file) + '" download>Unduh</a>';
      }
      return '<li class="doc" style="animation-delay:' + (i * 0.05) + 's">' +
        '<div class="doc__icon" aria-hidden="true">' + (ICONS[k.kategori] || '📁') + '</div>' +
        '<div><h3>' + esc(k.judul) + '</h3><p class="doc__meta">' + esc(meta) + '</p><p class="doc__desc">' + esc(k.deskripsi) + '</p></div>' +
        '<div class="doc__actions">' + actions + '</div></li>';
    }).join('');

    emptyEl.hidden = list.length > 0;
  }

  filtersEl.addEventListener('click', function (e) {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    state.kategori = btn.dataset.kat;
    $$('.chip', filtersEl).forEach(function (c) { c.setAttribute('aria-pressed', String(c === btn)); });
    renderDocs();
  });
  searchEl.addEventListener('input', function () { state.q = searchEl.value; renderDocs(); });

  renderFilters();
  renderDocs();

  /* ---------- Tahun di footer ---------- */
  $('#year').textContent = new Date().getFullYear();
})();
