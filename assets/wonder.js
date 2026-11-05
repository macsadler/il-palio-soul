/* L'Anima del Palio: the "heart" layer, wired into the real entity pages.
   Every number here is derived from the race pages (themselves from ilpalio.org) and labelled "derivato".
   Official win totals stay those of vinti.htm, shown by the pages themselves. No network beyond this site. */
(function () {
  'use strict';
  var root = document.documentElement.getAttribute('data-root') || '';
  var lang = (function () { try { return localStorage.getItem('palio-lang') || 'it'; } catch (e) { return 'it'; } })();
  var T = {
    it: { wonder: 'Meraviglia', wonderT: 'Una meraviglia a caso', again: 'Un\'altra', open: 'Apri', close: 'Chiudi',
      thread: 'Il filo della storia', scrub: 'Trascina nel tempo', wins: 'vittorie nelle schede', wait: 'Attesa più lunga',
      now: 'Ultima vittoria nelle schede', years: 'anni', h2h: 'Testa a testa', h2hS: 'Palii corsi insieme, e chi li ha vinti. Tocca una riga per il confronto completo.',
      together: 'insieme', friends: 'Amiche e rivali', fonte: 'Fonte', compare: 'Confronta', campo: 'Il Campo',
      arc: 'L\'arco della carriera', runs: 'corse', won: 'vinte', rode: 'Ha corso per', sameDay: 'Lo stesso giorno, in altri anni',
      field: 'Chi c\'era fra i canapi', prev: 'Palio precedente', next: 'Palio successivo', derived: 'derivato dalle schede delle corse',
      horseArc: 'Le sue corse', jockeys: 'Montato da', ring: 'Il Campo al tramonto', ringS: 'Diciassette bandiere girano intorno alla Piazza. Toccane una.',
      story: 'Racconto a puntate', jump: 'Vai all\'anno', rivalry: 'rivalità', alliance: 'alleanza', status: 'stato nei testi del 2001–2002' },
    en: { wonder: 'Wonder', wonderT: 'A random wonder', again: 'Another', open: 'Open', close: 'Close',
      thread: 'The thread of history', scrub: 'Drag through time', wins: 'wins in the race records', wait: 'Longest wait',
      now: 'Last win in the records', years: 'years', h2h: 'Head to head', h2hS: 'Palii run together, and who won them. Tap a row for the full comparison.',
      together: 'together', friends: 'Friends and rivals', fonte: 'Source', compare: 'Compare', campo: 'The Campo',
      arc: 'Career arc', runs: 'runs', won: 'won', rode: 'Rode for', sameDay: 'The same day, in other years',
      field: 'Who was at the start', prev: 'Previous Palio', next: 'Next Palio', derived: 'derived from the race records',
      horseArc: 'Its races', jockeys: 'Ridden by', ring: 'The Campo at dusk', ringS: 'Seventeen flags drift around the Piazza. Tap one.',
      story: 'Serialized story', jump: 'Jump to year', rivalry: 'rivalry', alliance: 'alliance', status: 'status as in the 2001–2002 texts' }
  }[lang];
  var MESI = ['', 'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
  var STORIES = { 'r-aqupan': 'aqupan', 'r-chitar': 'chitar', 'r-civleo': 'civleo', 'r-istlup': 'istlup', 'r-nicmon': 'nicmon', 'r-ocator': 'ocator', 'r-ondtor': 'ondtor', 'r-nictor': 'nictor', 'r-pansel': 'pansel', 'r-dralup': 'dralup', 'r-brunic': 'brunic', 'r-brugir': 'brugir', 'r-nicoca': 'nicoca' };
  function $(s, c) { return (c || document).querySelector(s); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; }); }
  function load(src, cb) { var s = document.createElement('script'); s.src = root + src; s.onload = cb; document.head.appendChild(s); }
  function css() { var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = root + 'assets/wonder.css'; document.head.appendChild(l); }
  function fonte(u, label) { return '<span class="w-fonte">' + T.fonte + ': <a href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(label || u.replace(/^https?:\/\/www\./, '')) + '</a></span>'; }
  function sec(title, inner, eyebrow) { var s = document.createElement('section'); s.className = 'w-sec'; s.innerHTML = (eyebrow ? '<div class="w-eyebrow">' + eyebrow + '</div>' : '') + '<h2>' + title + '</h2>' + inner; return s; }
  function path() { var p = location.pathname.split('/'); return { dir: p[p.length - 2] || '', file: (p[p.length - 1] || 'index.html').replace(/\.html$/, '') }; }

  var D, M, C, byId = {};
  function col(c) { return (M.c[c] && M.c[c].c) || ['#999', '#666']; }
  function cname(c) { return (M.c[c] && M.c[c].n) || c; }
  function chip(c, extra) { var k = col(c); return '<a class="w-chip" href="' + root + 'contrade/' + c + '.html" style="--a:' + k[0] + ';--b:' + (k[1] || k[0]) + '">' + esc(cname(c)) + (extra || '') + '</a>'; }
  function rlink(r) { return root + 'races/' + r[0] + '.html'; }
  function rlabel(r) { return (r[3] ? r[3] + ' ' : '') + (r[2] ? MESI[r[2]] + ' ' : '') + r[1]; }

  /* ---------- nav additions ---------- */
  function nav() {
    var ul = $('nav.main ul'); if (!ul || ul.dataset.w) return; ul.dataset.w = 1;
    [['campo.html', T.campo], ['compare.html', T.compare]].forEach(function (x) {
      var li = document.createElement('li'); li.innerHTML = '<a href="' + root + x[0] + '">' + x[1] + '</a>'; ul.appendChild(li);
    });
  }

  /* ---------- random wonder ---------- */
  function wonders() {
    var out = [];
    D.r.forEach(function (r) { if (r[5] && r[7].length) out.push(['race', r]); });
    M.rel.forEach(function (x) { out.push(['rel', x]); });
    M.all.forEach(function (x) { x.q.forEach(function (q) { out.push(['all', x, q]); }); });
    Object.keys(D.j).forEach(function (j) { out.push(['jockey', j]); });
    return out;
  }
  var W;
  function wonderCard() {
    W = W || wonders();
    var w = W[Math.floor(Math.random() * W.length)], h = '';
    if (w[0] === 'race') {
      var r = w[1], win = r[7].filter(function (p) { return p[3]; })[0] || [];
      h = '<div class="w-eyebrow">Palio · ' + esc(rlabel(r)) + '</div><h3>' + esc(cname(r[5])) + '</h3>' +
        '<p>' + (win[1] ? '<a href="' + root + 'jockeys/' + win[1] + '.html">' + esc(D.j[win[1]]) + '</a>' : '') + (win[2] ? ' · <a href="' + root + 'horses/' + win[2] + '.html">' + esc(D.h[win[2]]) + '</a>' : '') + '</p>' +
        '<div class="w-field">' + r[7].map(function (p) { return chip(p[0], p[3] ? ' ★' : ''); }).join('') + '</div>' +
        '<p><a class="w-btn" href="' + rlink(r) + '">' + T.open + ' →</a></p>';
    } else if (w[0] === 'rel') {
      var x = w[1];
      h = '<div class="w-eyebrow">' + T.rivalry + ' · ' + esc(x.s) + '</div><h3>' + esc(cname(x.a)) + ' × ' + esc(cname(x.b)) + '</h3><blockquote>«' + esc(x.why) + '»</blockquote>' +
        '<p>' + fonte(x.u) + '</p><p><a class="w-btn" href="' + root + 'rivalries.html">' + T.friends + ' →</a>' + (STORIES[x.id] ? ' <a class="w-btn ghost" href="' + root + 'campo.html#/rivalita/' + STORIES[x.id] + '">' + T.story + '</a>' : '') + '</p>';
    } else if (w[0] === 'all') {
      h = '<div class="w-eyebrow">' + T.alliance + '</div><h3>' + esc(w[1].title) + '</h3><blockquote>«' + esc(w[2].t) + '»</blockquote><p>' + fonte(w[2].u) + '</p>' +
        '<div class="w-field">' + w[1].m.map(function (c) { return chip(c); }).join('') + '</div>';
    } else {
      var st = jockeyStats(w[1]);
      h = '<div class="w-eyebrow">' + (lang === 'it' ? 'Fantino' : 'Jockey') + '</div><h3>' + esc(D.j[w[1]]) + '</h3><p>' + st.runs + ' ' + T.runs + ', ' + st.wins + ' ' + T.won + ' <small>(' + T.derived + ')</small></p>' +
        arcSVG(st.years) + '<p><a class="w-btn" href="' + root + 'jockeys/' + w[1] + '.html">' + T.open + ' →</a></p>';
    }
    return h;
  }
  function dock() {
    var b = document.createElement('button'); b.className = 'w-dock'; b.type = 'button'; b.innerHTML = '<span aria-hidden="true">✦</span> ' + T.wonder;
    var ov = document.createElement('div'); ov.className = 'w-ov'; ov.hidden = true; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', T.wonderT);
    ov.innerHTML = '<div class="w-card"><div class="w-body"></div><p class="w-act"><button type="button" class="w-btn ghost" data-a="again">' + T.again + ' ✦</button> <button type="button" class="w-btn ghost" data-a="close">' + T.close + '</button></p></div>';
    function show() { $('.w-body', ov).innerHTML = wonderCard(); ov.hidden = false; }
    b.onclick = show;
    ov.addEventListener('click', function (e) { var a = e.target.getAttribute('data-a'); if (a === 'again') show(); else if (a === 'close' || e.target === ov) ov.hidden = true; });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') ov.hidden = true; });
    document.body.appendChild(b); document.body.appendChild(ov);
  }

  /* ---------- derived stats ---------- */
  function contradaWins(c) { return D.r.filter(function (r) { return r[5] === c; }); }
  function waits(c) {
    var ws = contradaWins(c), best = null;
    for (var i = 1; i < ws.length; i++) { var g = ws[i][1] - ws[i - 1][1]; if (!best || g > best.g) best = { g: g, a: ws[i - 1], b: ws[i] }; }
    return { best: best, last: ws[ws.length - 1], n: ws.length };
  }
  function h2h(c) {
    var o = {};
    D.r.forEach(function (r) {
      if (!r[7].length) return; var cs = r[7].map(function (p) { return p[0]; }); if (cs.indexOf(c) < 0) return;
      cs.forEach(function (x) { if (x === c) return; var e = o[x] = o[x] || { n: 0, a: 0, b: 0 }; e.n++; if (r[5] === c) e.a++; if (r[5] === x) e.b++; });
    });
    return o;
  }
  function jockeyStats(j) {
    var y = {}, runs = 0, wins = 0, cs = {};
    D.r.forEach(function (r) { r[7].forEach(function (p) { if (p[1] === j) { runs++; var e = y[r[1]] = y[r[1]] || { n: 0, w: 0 }; e.n++; if (p[3]) { e.w++; wins++; } cs[p[0]] = (cs[p[0]] || 0) + 1; } }); });
    return { years: y, runs: runs, wins: wins, cs: cs };
  }
  function arcSVG(y) {
    var ks = Object.keys(y).map(Number).sort(function (a, b) { return a - b; }); if (!ks.length) return '';
    var a = ks[0], b = Math.max(ks[ks.length - 1], a + 1), W = 320, H = 90, bars = '';
    ks.forEach(function (k) {
      var x = 10 + (k - a) / (b - a) * (W - 20), e = y[k];
      bars += '<line x1="' + x + '" y1="70" x2="' + x + '" y2="' + (70 - e.n * 14) + '" stroke="var(--w-stone2)" stroke-width="5" stroke-linecap="round"/>';
      if (e.w) bars += '<circle cx="' + x + '" cy="' + (70 - e.n * 14 - 8) + '" r="5" fill="var(--w-gold)"><title>' + k + ': ' + e.w + '</title></circle>';
    });
    return '<svg class="w-arc" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + T.arc + '"><path d="M10 70 Q' + W / 2 + ' -10 ' + (W - 10) + ' 70" fill="none" stroke="var(--w-gold)" stroke-opacity=".35" stroke-dasharray="3 5"/>' + bars +
      '<text x="10" y="86" font-size="11">' + a + '</text><text x="' + (W - 10) + '" y="86" font-size="11" text-anchor="end">' + ks[ks.length - 1] + '</text></svg>';
  }

  /* ---------- contrada page ---------- */
  function contradaPage(c) {
    var main = $('#main'); if (!main || !M.c[c]) return;
    var k = col(c), ws = contradaWins(c), wt = waits(c), first = 1633, last = 2026;
    document.body.style.setProperty('--w-a', k[0]); document.body.style.setProperty('--w-b', k[1] || k[0]);
    var dots = ws.map(function (r) { var x = (r[1] - first) / (last - first) * 1000; return '<a href="' + rlink(r) + '"><circle cx="' + x.toFixed(1) + '" cy="40" r="7" fill="' + k[0] + '" stroke="' + (k[1] || '#000') + '" stroke-width="2"><title>' + esc(rlabel(r)) + '</title></circle></a>'; }).join('');
    var gap = wt.best ? '<rect x="' + ((wt.best.a[1] - first) / (last - first) * 1000) + '" y="22" width="' + (wt.best.g / (last - first) * 1000) + '" height="36" rx="18" fill="var(--w-red)" fill-opacity=".14"/>' : '';
    var ticks = ''; for (var y = 1650; y <= 2000; y += 50) ticks += '<text x="' + ((y - first) / (last - first) * 1000) + '" y="90" font-size="20" text-anchor="middle">' + y + '</text>';
    var inner = '<div class="w-scrub"><svg viewBox="-20 0 1040 100" class="w-tl" role="img" aria-label="' + T.thread + '"><line x1="0" y1="40" x2="1000" y2="40" stroke="var(--w-gold)" stroke-width="2"/>' + gap + dots + ticks + '<line id="w-cur" x1="0" y1="10" x2="0" y2="70" stroke="var(--w-red)" stroke-width="3"/></svg>' +
      '<label class="w-small">' + T.scrub + ' <input type="range" id="w-yr" min="' + first + '" max="' + last + '" value="' + (wt.last ? wt.last[1] : 1900) + '"></label><div id="w-yrout" class="w-yrout"></div></div>' +
      '<div class="w-stats"><div><b>' + ws.length + '</b>' + T.wins + '</div>' + (wt.best ? '<div><b>' + wt.best.g + '</b>' + T.wait + ' · ' + wt.best.a[1] + '–' + wt.best.b[1] + '</div>' : '') + (wt.last ? '<div><b>' + wt.last[1] + '</b>' + T.now + '</div>' : '') + '</div>' +
      '<p class="w-small">' + T.derived + '. ' + (lang === 'it' ? 'Il totale ufficiale delle vittorie è quello di vinti.htm, in alto.' : 'The official win total is the vinti.htm one, above.') + '</p>';
    var s1 = sec(T.thread, inner, esc(cname(c)));
    var h1card = main.querySelector('.card') || main.firstElementChild; h1card.parentNode.insertBefore(s1, h1card.nextSibling);
    var inp = $('#w-yr', s1), out = $('#w-yrout', s1), cur = $('#w-cur', s1);
    function upd() {
      var y = +inp.value, x = (y - first) / (last - first) * 1000; cur.setAttribute('x1', x); cur.setAttribute('x2', x);
      var rs = D.r.filter(function (r) { return Math.abs(r[1] - y) <= 2 && r[5]; });
      out.innerHTML = '<b>' + y + '</b> ' + (rs.length ? rs.map(function (r) { return '<a class="w-pill' + (r[5] === c ? ' me' : '') + '" href="' + rlink(r) + '" style="--a:' + col(r[5])[0] + '">' + esc(rlabel(r)) + ' · ' + esc(cname(r[5])) + '</a>'; }).join('') : '<span class="w-small">—</span>');
    }
    inp.oninput = upd; upd();
    // friends & rivals
    var rel = M.rel.filter(function (r) { return r.a === c || r.b === c; }), al = M.all.filter(function (a) { return a.m.indexOf(c) >= 0; });
    if (rel.length || al.length) {
      var h = '<div class="w-cards">' + rel.map(function (r) { var o = r.a === c ? r.b : r.a; return '<div class="w-rc riv" style="--a:' + col(o)[0] + '"><div class="w-eyebrow">' + T.rivalry + ' · ' + esc(r.s) + '</div><h3>' + chip(o) + '</h3><blockquote>«' + esc(r.why) + '»</blockquote>' + fonte(r.u) + (STORIES[r.id] ? '<p><a class="w-btn ghost" href="' + root + 'campo.html#/rivalita/' + STORIES[r.id] + '">' + T.story + ' →</a></p>' : '') + '</div>'; }).join('') +
        al.map(function (a) { return '<div class="w-rc all"><div class="w-eyebrow">' + T.alliance + (a.g ? ' · ' + esc(a.g) : '') + '</div><h3>' + a.m.filter(function (x) { return x !== c; }).map(function (x) { return chip(x); }).join(' ') + '</h3><blockquote>«' + esc(a.q[0].t) + '»</blockquote>' + fonte(a.q[0].u) + '</div>'; }).join('') + '</div><p class="w-small">' + T.status + '. <a href="' + root + 'rivalries.html">' + T.friends + ' →</a></p>';
      s1.parentNode.insertBefore(sec(T.friends, h), s1.nextSibling);
    }
    // head to head
    var o = h2h(c), keys = Object.keys(o).sort(function (a, b) { return o[b].n - o[a].n; });
    if (keys.length) {
      var mx = Math.max.apply(null, keys.map(function (x) { return Math.max(o[x].a, o[x].b); })) || 1;
      var t = '<p class="w-small">' + T.h2hS + '</p><div class="w-h2h">' + keys.map(function (x) {
        var e = o[x];
        return '<a href="' + root + 'compare.html#' + c + '-' + x + '"><span class="l" style="width:' + (e.a / mx * 50) + '%;background:' + k[0] + '"></span><span class="nm">' + e.a + ' · ' + esc(cname(x)) + ' · ' + e.b + ' <small>(' + e.n + ' ' + T.together + ')</small></span><span class="r" style="width:' + (e.b / mx * 50) + '%;background:' + col(x)[0] + '"></span></a>';
      }).join('') + '</div><p class="w-small">' + T.derived + '</p>';
      var last2 = main.querySelectorAll('.w-sec'); var ref = last2[last2.length - 1]; ref.parentNode.insertBefore(sec(T.h2h, t), ref.nextSibling);
    }
  }

  /* ---------- jockey page ---------- */
  function jockeyPage(j) {
    var main = $('#main'); if (!main || !D.j[j]) return;
    var st = jockeyStats(j); if (!st.runs) return;
    var cs = Object.keys(st.cs).sort(function (a, b) { return st.cs[b] - st.cs[a]; });
    var h = '<div class="w-stats"><div><b>' + st.runs + '</b>' + T.runs + '</div><div><b>' + st.wins + '</b>' + T.won + '</div></div>' + arcSVG(st.years) +
      '<h3>' + T.rode + '</h3><div class="w-field">' + cs.map(function (c) { return chip(c, ' · ' + st.cs[c]); }).join('') + '</div>';
    var wins = [], beat = {}, beatBy = {};
    D.r.forEach(function (r) {
      var me = r[7].filter(function (p) { return p[1] === j; })[0]; if (!me) return;
      var w = r[7].filter(function (p) { return p[3]; })[0];
      if (me[3]) { wins.push([r, me]); r[7].forEach(function (p) { if (p[1] && p[1] !== j) beat[p[1]] = (beat[p[1]] || 0) + 1; }); }
      else if (w && w[1]) beatBy[w[1]] = (beatBy[w[1]] || 0) + 1;
    });
    if (wins.length) h += '<h3>' + (lang === 'it' ? 'Le sue vittorie' : 'Victories') + '</h3><div class="w-runs">' + wins.map(function (x) { var r = x[0], p = x[1]; return '<a class="w-run win" href="' + rlink(r) + '" style="--a:' + col(p[0])[0] + '"><span>' + esc(rlabel(r)) + '</span><b>' + esc(cname(p[0])) + '</b>' + (p[2] ? '<small>' + esc(D.h[p[2]]) + '</small>' : '') + '</a>'; }).join('') + '</div>';
    function top(o) { return Object.keys(o).sort(function (a, b) { return o[b] - o[a]; }).slice(0, 8).map(function (x) { return '<a class="w-pill" style="--a:var(--w-gold)" href="' + root + 'jockeys/' + x + '.html">' + esc(D.j[x]) + ' · ' + o[x] + '</a>'; }).join(''); }
    if (Object.keys(beat).length) h += '<h3>' + (lang === 'it' ? 'Chi ha lasciato dietro di sé, più spesso' : 'Whom it left behind most often') + '</h3><div class="w-field">' + top(beat) + '</div>';
    if (Object.keys(beatBy).length) h += '<h3>' + (lang === 'it' ? 'Chi ha vinto i Palii in cui ha corso' : 'Who won the Palii it ran in') + '</h3><div class="w-field">' + top(beatBy) + '</div>';
    h += '<p class="w-small">' + T.derived + (lang === 'it' ? '. «Lasciato dietro»: fantini presenti nei Palii che ha vinto.' : '. "Left behind": jockeys in the Palii it won.') + '</p>';
    var s = sec(T.arc, h, esc(D.j[j])); var ref = main.querySelector('h1'); ref.parentNode.insertBefore(s, ref.nextElementSibling ? ref.nextElementSibling.nextSibling : null);
  }
  /* ---------- horse page ---------- */
  function horsePage(hid) {
    var main = $('#main'); if (!main) return;
    var rs = [], js = {};
    D.r.forEach(function (r) { r[7].forEach(function (p) { if (p[2] === hid) { rs.push([r, p]); if (p[1]) js[p[1]] = 1; } }); });
    if (!rs.length) return;
    var h = '<div class="w-runs">' + rs.map(function (x) { var r = x[0], p = x[1]; return '<a class="w-run' + (p[3] ? ' win' : '') + '" href="' + rlink(r) + '" style="--a:' + col(p[0])[0] + ';--b:' + (col(p[0])[1] || '#fff') + '"><span>' + esc(rlabel(r)) + '</span><b>' + esc(cname(p[0])) + (p[3] ? ' ★' : '') + '</b>' + (p[1] ? '<small>' + esc(D.j[p[1]]) + '</small>' : '') + '</a>'; }).join('') + '</div>' +
      '<h3>' + T.jockeys + '</h3><p>' + Object.keys(js).map(function (j) { return '<a href="' + root + 'jockeys/' + j + '.html">' + esc(D.j[j]) + '</a>'; }).join(' · ') + '</p><p class="w-small">' + T.derived + '</p>';
    var s = sec(T.horseArc, h); var ref = main.querySelector('h1'); ref.parentNode.insertBefore(s, ref.nextElementSibling ? ref.nextElementSibling.nextSibling : null);
  }
  /* ---------- race page ---------- */
  function racePage(id) {
    var main = $('#main'), i = -1; D.r.forEach(function (r, k) { if (r[0] === id) i = k; }); if (!main || i < 0) return;
    var r = D.r[i], h = '';
    if (r[7].length) {
      h += '<div class="w-gate">' + r[7].map(function (p, n) { var k = col(p[0]); return '<a href="' + root + 'contrade/' + p[0] + '.html" class="' + (p[3] ? 'win' : '') + '" style="--a:' + k[0] + ';--b:' + (k[1] || k[0]) + ';animation-delay:' + n * 80 + 'ms"><i></i><span>' + esc(cname(p[0])) + '</span></a>'; }).join('') + '</div>';
    }
    var same = D.r.filter(function (x) { return x !== r && x[2] === r[2] && x[3] === r[3] && r[3] && x[5]; });
    if (same.length) h += '<h3>' + T.sameDay + '</h3><div class="w-field">' + same.slice(-14).reverse().map(function (x) { return '<a class="w-pill" href="' + rlink(x) + '" style="--a:' + col(x[5])[0] + '">' + x[1] + ' · ' + esc(cname(x[5])) + '</a>'; }).join('') + '</div>';
    var pv = D.r[i - 1], nx = D.r[i + 1];
    h += '<p class="w-pn">' + (pv ? '<a class="w-btn ghost" href="' + rlink(pv) + '">← ' + esc(rlabel(pv)) + '</a>' : '') + (nx ? '<a class="w-btn ghost" href="' + rlink(nx) + '">' + esc(rlabel(nx)) + ' →</a>' : '') + '</p>';
    var s = sec(T.field, h); var ref = main.querySelector('dl.facts') || main.querySelector('h1'); ref.parentNode.insertBefore(s, ref.nextSibling);
  }
  /* ---------- home: the Campo ring, wired to the real contrada pages ---------- */
  function homeRing() {
    var main = $('#main'); if (!main) return;
    var ids = Object.keys(M.c).sort(), g = '', R = 230;
    ids.forEach(function (c, i) {
      var a = i / ids.length * Math.PI * 2 - Math.PI / 2, x = 300 + R * Math.cos(a), y = 300 + R * Math.sin(a), k = col(c);
      g += '<g transform="translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ')"><a href="' + root + 'contrade/' + c + '.html" class="w-flag"><g class="w-fl"><path d="M-16 -22 H16 V8 Q16 20 0 26 Q-16 20 -16 8Z" fill="' + k[0] + '" stroke="var(--w-gold)" stroke-width="2"/><path d="M-16 -22 L16 8 V-22Z" fill="' + (k[1] || k[0]) + '" opacity=".9"/><text y="44" text-anchor="middle">' + esc(cname(c)) + '</text></g></a></g>';
    });
    var svg = '<svg viewBox="0 0 600 600" class="w-ring" role="img" aria-label="' + T.ring + '"><defs><radialGradient id="wg"><stop offset="0" stop-color="#ffb35c" stop-opacity=".6"/><stop offset="1" stop-color="#ffb35c" stop-opacity="0"/></radialGradient></defs>' +
      '<circle cx="300" cy="300" r="290" fill="url(#wg)"/><path d="M130 330 Q300 120 470 330 Q300 450 130 330Z" fill="#b5794c"/>' +
      (function () { var s = ''; for (var i = 0; i < 9; i++) { var a0 = (-70 + i * 15.5) * Math.PI / 180, a1 = (-70 + (i + 1) * 15.5) * Math.PI / 180; s += '<path d="M300 360 L' + (300 + 175 * Math.sin(a0)).toFixed(1) + ' ' + (360 - 150 * Math.cos(a0)).toFixed(1) + ' L' + (300 + 175 * Math.sin(a1)).toFixed(1) + ' ' + (360 - 150 * Math.cos(a1)).toFixed(1) + 'Z" fill="' + (i % 2 ? '#d8b07a' : '#c99a60') + '"/>'; } return s; })() +
      '<rect x="262" y="330" width="76" height="30" fill="#9b4a35"/><rect x="293" y="190" width="14" height="140" fill="#8e3f2d"/><rect x="287" y="176" width="26" height="18" fill="#a64d38"/><path d="M294 176 L300 150 L306 176Z" fill="#8e3f2d"/>' +
      '<g class="w-spin">' + g + '</g></svg>';
    var s = document.createElement('section'); s.className = 'w-hero';
    s.innerHTML = '<div class="w-eyebrow">' + T.campo + '</div><h2>' + T.ring + '</h2><p>' + T.ringS + '</p>' + svg + '<p><a class="w-btn" href="' + root + 'campo.html">' + T.campo + ' →</a> <a class="w-btn ghost" href="' + root + 'compare.html">' + T.compare + '</a> <button class="w-btn ghost" type="button" id="w-hw">✦ ' + T.wonder + '</button></p>';
    var first = main.firstElementChild; main.insertBefore(s, first && first.nextSibling);
    $('#w-hw', s).onclick = function () { $('.w-dock').click(); };
  }
  /* ---------- timeline scrubber ---------- */
  function timelinePage() {
    var tl = $('#timeline'); if (!tl) return;
    var s = document.createElement('div'); s.className = 'w-sec w-sticky';
    s.innerHTML = '<label class="w-small">' + T.jump + ' <b id="w-ty">1900</b></label><input type="range" id="w-tr" min="1630" max="2020" step="10" value="1900"><div class="w-spark" id="w-sp"></div>';
    tl.parentNode.insertBefore(s, tl);
    var cnt = {}; D.r.forEach(function (r) { if (r[5]) { var d = Math.floor(r[1] / 10) * 10; (cnt[d] = cnt[d] || []).push(r[5]); } });
    var sp = ''; for (var d = 1630; d <= 2020; d += 10) { var l = cnt[d] || []; sp += '<a href="#d' + d + '" title="' + d + '">' + l.map(function (c) { return '<i style="background:' + col(c)[0] + '"></i>'; }).join('') + '</a>'; }
    $('#w-sp', s).innerHTML = sp;
    $('#w-tr', s).oninput = function () { var v = this.value; $('#w-ty').textContent = v; var h = document.getElementById('d' + v); if (h) h.scrollIntoView({ block: 'start' }); };
  }

  /* ---------- compare page ---------- */
  function comparePage() {
    var box = $('#w-compare'); if (!box) return;
    var ids = Object.keys(M.c).sort();
    var opt = ids.map(function (c) { return '<option value="' + c + '">' + esc(cname(c)) + '</option>'; }).join('');
    box.innerHTML = '<div class="w-pick"><select id="w-a" aria-label="A">' + opt + '</select><span>×</span><select id="w-b" aria-label="B">' + opt + '</select></div><div id="w-cout"></div>';
    var h = (location.hash || '#aquila-pantera').slice(1).split('-'); $('#w-a').value = M.c[h[0]] ? h[0] : 'aquila'; $('#w-b').value = M.c[h[1]] ? h[1] : 'pantera';
    function draw() {
      var a = $('#w-a').value, b = $('#w-b').value; history.replaceState(null, '', '#' + a + '-' + b);
      var ka = col(a), kb = col(b), first = 1633, last = 2026;
      function row(c, y0, k) { return contradaWins(c).map(function (r) { return '<a href="' + rlink(r) + '"><circle cx="' + ((r[1] - first) / (last - first) * 1000).toFixed(1) + '" cy="' + y0 + '" r="7" fill="' + k[0] + '" stroke="' + (k[1] || '#000') + '" stroke-width="2"><title>' + esc(rlabel(r)) + '</title></circle></a>'; }).join(''); }
      var ticks = ''; for (var y = 1650; y <= 2000; y += 50) ticks += '<text x="' + ((y - first) / (last - first) * 1000) + '" y="118" font-size="20" text-anchor="middle">' + y + '</text>';
      var e = h2h(a)[b] || { n: 0, a: 0, b: 0 }, wa = waits(a), wb = waits(b);
      var rel = M.rel.filter(function (r) { return (r.a === a && r.b === b) || (r.a === b && r.b === a); })[0];
      var al = M.all.filter(function (x) { return x.m.indexOf(a) >= 0 && x.m.indexOf(b) >= 0; });
      var common = D.r.filter(function (r) { var cs = r[7].map(function (p) { return p[0]; }); return cs.indexOf(a) >= 0 && cs.indexOf(b) >= 0 && (r[5] === a || r[5] === b); });
      $('#w-cout').innerHTML = '<div class="w-vs" style="--a:' + ka[0] + ';--b:' + kb[0] + '"><div>' + chip(a) + '<b>' + e.a + '</b></div><div class="w-small">' + e.n + ' Palii ' + T.together + '</div><div>' + chip(b) + '<b>' + e.b + '</b></div></div>' +
        '<svg viewBox="-20 0 1040 130" class="w-tl"><line x1="0" y1="35" x2="1000" y2="35" stroke="' + ka[0] + '" stroke-opacity=".5"/><line x1="0" y1="80" x2="1000" y2="80" stroke="' + kb[0] + '" stroke-opacity=".5"/>' + row(a, 35, ka) + row(b, 80, kb) + ticks + '</svg>' +
        '<div class="w-stats"><div><b>' + (wa.best ? wa.best.g : '—') + '</b>' + T.wait + ' · ' + esc(cname(a)) + '</div><div><b>' + (wb.best ? wb.best.g : '—') + '</b>' + T.wait + ' · ' + esc(cname(b)) + '</div></div>' +
        (rel ? '<div class="w-rc riv"><div class="w-eyebrow">' + T.rivalry + ' · ' + esc(rel.s) + '</div><blockquote>«' + esc(rel.why) + '»</blockquote>' + fonte(rel.u) + (STORIES[rel.id] ? ' <a class="w-btn ghost" href="campo.html#/rivalita/' + STORIES[rel.id] + '">' + T.story + ' →</a>' : '') + '</div>' : '') +
        al.map(function (x) { return '<div class="w-rc all"><div class="w-eyebrow">' + T.alliance + '</div><blockquote>«' + esc(x.q[0].t) + '»</blockquote>' + fonte(x.q[0].u) + '</div>'; }).join('') +
        (common.length ? '<h3>' + (lang === 'it' ? 'Le vittorie dell\'una davanti all\'altra' : 'Wins with the other in the field') + '</h3><div class="w-field">' + common.reverse().map(function (r) { return '<a class="w-pill" href="' + rlink(r) + '" style="--a:' + col(r[5])[0] + '">' + esc(rlabel(r)) + ' · ' + esc(cname(r[5])) + '</a>'; }).join('') + '</div>' : '') +
        '<p class="w-small">' + T.derived + '</p>';
    }
    $('#w-a').onchange = draw; $('#w-b').onchange = draw; draw();
  }


  /* ---------- stats: the race of the centuries (cumulative wins from race records, derived) ---------- */
  function statsPage() {
    var main = $('#main'); if (!main) return;
    var ids = Object.keys(M.c), wins = D.r.filter(function (r) { return r[5]; });
    var it = lang === 'it';
    var s = sec(it ? 'La corsa dei secoli' : 'The race of the centuries',
      '<p>' + (it ? 'Trascina l\'anno: le diciassette Contrade si sorpassano, Palio dopo Palio, dal 1633 a oggi.' : 'Drag the year: the seventeen Contrade overtake each other, Palio after Palio, from 1633 to today.') + '</p>' +
      '<div class="w-race-y"><b id="w-ry">1700</b><button type="button" class="w-btn ghost" id="w-play">▶ ' + (it ? 'Guarda' : 'Play') + '</button></div>' +
      '<input type="range" id="w-rr" min="1633" max="2026" value="1700" style="width:100%;accent-color:var(--w-red)">' +
      '<div class="w-race" id="w-race"></div><p class="w-small" id="w-rlast"></p><p class="w-small">' + T.derived + (it ? '. I totali ufficiali (vinti.htm) sono qui sotto.' : '. Official totals (vinti.htm) are below.') + '</p>', it ? 'Statistiche' : 'Statistics');
    var h1 = main.querySelector('h1'); h1.parentNode.insertBefore(s, h1.nextElementSibling ? h1.nextElementSibling.nextSibling : null);
    var box = $('#w-race', s), rows = {};
    ids.forEach(function (c) { var k = col(c); var a = document.createElement('a'); a.href = root + 'contrade/' + c + '.html'; a.className = 'w-rrow';
      a.innerHTML = '<span class="nm">' + esc(cname(c)) + '</span><span class="bar" style="background:linear-gradient(90deg,' + k[0] + ',' + (k[1] || k[0]) + ')"></span><b>0</b>'; box.appendChild(a); rows[c] = a; });
    var inp = $('#w-rr', s);
    function upd() {
      var y = +inp.value, cnt = {}, last = null; ids.forEach(function (c) { cnt[c] = 0; });
      wins.forEach(function (r) { if (r[1] <= y) { cnt[r[5]]++; last = r; } });
      var order = ids.slice().sort(function (a, b) { return cnt[b] - cnt[a] || a.localeCompare(b); }), mx = Math.max(1, cnt[order[0]]);
      order.forEach(function (c, i) { var a = rows[c]; a.style.transform = 'translateY(' + i * 30 + 'px)'; a.querySelector('.bar').style.width = (cnt[c] / mx * 100) + '%'; a.querySelector('b').textContent = cnt[c]; });
      box.style.height = ids.length * 30 + 'px'; $('#w-ry', s).textContent = y;
      $('#w-rlast', s).innerHTML = last ? (it ? 'Ultimo Palio fino a qui: ' : 'Latest Palio so far: ') + '<a href="' + rlink(last) + '">' + esc(rlabel(last)) + ' · ' + esc(cname(last[5])) + '</a>' : '';
    }
    inp.oninput = upd; upd();
    var timer = null;
    $('#w-play', s).onclick = function () {
      if (timer) { clearInterval(timer); timer = null; return; }
      if (+inp.value >= 2026) inp.value = 1633;
      timer = setInterval(function () { inp.value = +inp.value + 2; upd(); if (+inp.value >= 2026) { clearInterval(timer); timer = null; } }, 90);
    };
  }

  function run() {
    css(); nav();
    var tg = document.getElementById('lang-toggle'); if (tg) tg.addEventListener('click', function () { setTimeout(function () { location.reload(); }, 60); });
    load('assets/palio-meta.js', function () {
      M = window.PALIO_META;
      load('assets/palio-data.js', function () {
        D = window.PALIO_DATA; dock();
        var p = path();
        try {
          if (p.dir === 'contrade' && p.file !== 'index') contradaPage(p.file);
          else if (p.dir === 'jockeys' && p.file !== 'index') jockeyPage(p.file);
          else if (p.dir === 'horses' && p.file !== 'index') horsePage(p.file);
          else if (p.dir === 'races' && p.file !== 'index') racePage(p.file);
          else if (document.body.classList.contains('is-home') || (p.dir === 'contrade' && p.file === 'index')) homeRing();
          else if (p.file === 'timeline') timelinePage();
          else if (p.file === 'compare') comparePage();
          else if (p.dir === 'stats' && p.file === 'index') statsPage();
        } catch (e) { if (window.console) console.warn('wonder', e); }
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
