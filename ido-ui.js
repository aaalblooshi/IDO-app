/* IDO unified UI layer — one place for the look shared by every page.
   Loaded last on each page (icons for the nav + menu, floating bottom bar, sheets, buttons). */
(function () {
  if (window.__idoui) return; window.__idoui = 1;

  /* ---------- line icons (one family, currentColor) ---------- */
  var P = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/>',
    tasks: '<circle cx="12" cy="12" r="9"/><path d="m8.2 12.4 2.6 2.6 5-5.6"/>',
    inbox: '<path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.6 2H4.4z"/><path d="M10 21a2.2 2.2 0 0 0 4 0"/>',
    folder: '<path d="M3 7.5A2 2 0 0 1 5 5.5h4l2 2.2h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    sliders: '<path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h11M19 17h1"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="17" r="2"/>',
    chat: '<path d="M4.5 5h15a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19.5 17H11l-4.5 3.5V17h-2A1.5 1.5 0 0 1 3 15.5v-9A1.5 1.5 0 0 1 4.5 5z"/><path d="M8 10h8M8 13h5"/>',
    chart: '<path d="M4 20V9M10 20V4M16 20v-8M22 20H2"/>',
    trend: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    users: '<circle cx="9" cy="8" r="3.4"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.8a3.4 3.4 0 0 1 0 6.4M18 20a6 6 0 0 0-2.9-5.1"/>',
    archive: '<rect x="3" y="4" width="18" height="4.5" rx="1.2"/><path d="M5 8.5V19h14V8.5M10 12.5h4"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.4 9.6a2.6 2.6 0 1 1 4.4 1.9c-.9.8-1.8 1.2-1.8 2.5"/><path d="M12 17.2h.01"/>',
    shield: '<path d="M12 3 20 6v6c0 4.8-3.4 7.9-8 9-4.6-1.1-8-4.2-8-9V6z"/>',
    audit: '<rect x="5.5" y="4" width="13" height="17" rx="2"/><path d="M9 4h6v2.5H9zM9 11h6M9 15h4"/>',
    star: '<path d="m12 3.5 2.7 5.5 6 .9-4.4 4.2 1 6L12 17.3 6.7 20.1l1-6L3.3 9.9l6-.9z"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M16 7l3 3"/>',
    back: '<path d="M9 7 4 12l5 5"/><path d="M4 12h11a5 5 0 0 1 5 5v1"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    download: '<path d="M12 4v11M7.5 11 12 15.5 16.5 11"/><path d="M5 19.5h14"/>',
    edit: '<path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z"/><path d="m14.5 7.5 3 3"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    trash: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6"/>',
    clip: '<path d="m20 11-8.2 8.2a5 5 0 0 1-7-7L13 4.2a3.4 3.4 0 0 1 4.8 4.8l-8.3 8.3a1.8 1.8 0 0 1-2.5-2.5L14 7.6"/>',
    note: '<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4"/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    fwd: '<path d="m6 7 5 5-5 5M13 7l5 5-5 5"/>',
    rew: '<path d="m18 7-5 5 5 5M11 7l-5 5 5 5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
    map: '<path d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 7z"/><path d="M9 4v13M15 7v12.5"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    dot: '<circle cx="12" cy="12" r="4"/>'
  };
  var BY = {
    'index.html': 'home', './': 'home', '': 'home', 'tasks.html': 'tasks', 'inbox.html': 'inbox', 'myprojects.html': 'folder',
    'projects.html': 'sliders', 'chat.html': 'chat', 'portfolio.html': 'chart', 'perf.html': 'trend', 'account.html': 'user',
    'settings.html': 'gear', 'users.html': 'users', 'archive.html': 'archive', 'help.html': 'help', 'roles.html': 'shield',
    'audit.html': 'audit', 'ratings.html': 'star', 'access.html': 'key'
  };
  function svg(n) { return '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || P.dot) + '</svg>'; }
  window.IDOI = { svg: svg, names: Object.keys(P) };
  function base(a) { var h = (a.getAttribute('href') || '').split('#')[0].split('?')[0]; if (h === './' || h === '') return 'index.html'; return h.replace(/^.*\//, ''); }

  /* ---------- styles ---------- */
  var CSS = [
    /* floating bottom bar (same family as the home page FABs) */
    '#gnav{left:12px!important;right:12px!important;bottom:calc(env(safe-area-inset-bottom,0px) + 10px)!important;border:1px solid #dbe4ec!important;border-radius:26px!important;background:rgba(255,255,255,.94)!important;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:0 12px 32px rgba(29,95,138,.2)!important;padding:6px!important;gap:3px}',
    '#gnav .gnb{min-height:58px!important;border-radius:20px!important;color:#6b7a8a!important;gap:3px;transition:background .15s,color .15s}',
    '#gnav .gnb i{display:flex!important;align-items:center;justify-content:center;width:26px!important;height:26px!important;font-size:0!important;line-height:1!important;position:relative}',
    '#gnav .gnb i svg{width:25px;height:25px}',
    '#gnav .gnb span{font-size:11.5px!important;font-weight:700}',
    '#gnav .gnb.on{background:linear-gradient(135deg,#1d5f8a,#3EA3DC)!important;color:#fff!important;box-shadow:0 8px 18px rgba(29,95,138,.32)}',
    'body.hasnav{padding-bottom:calc(var(--pb,110px) + 22px + env(safe-area-inset-bottom,0px))!important}',
    'body.hasnav .actbar{bottom:calc(var(--gnh,0px) + 18px + env(safe-area-inset-bottom,0px))!important}',
    'body.hasnav .fab,body.hasnav .cm-fab,body.hasnav .ufab{bottom:calc(var(--gnh,76px) + 24px + env(safe-area-inset-bottom,0px))!important}',
    '.ii{display:inline-flex;vertical-align:-.2em;margin-inline:0 .3em}.ii svg{width:1.15em;height:1.15em;stroke-width:2}',
    '#toast{bottom:calc(var(--gnh,0px) + 26px + env(safe-area-inset-bottom,0px))!important}',
    /* header drop-down menu */
    '.hmp{border-radius:22px!important;padding:8px!important;min-width:250px!important;border:1px solid #dbe4ec!important;box-shadow:0 20px 48px rgba(29,95,138,.24)!important}',
    '.hmp a{border-radius:16px!important;padding:7px 8px!important;gap:12px!important;font-weight:700;color:#181C32!important}',
    '.hmp a i{width:38px;height:38px;border-radius:13px;background:#eaf4fb;color:#1d5f8a;display:inline-flex!important;align-items:center;justify-content:center;font-size:0!important;flex:none;font-style:normal}',
    '.hmp a i svg{width:21px;height:21px}',
    '.hmp a.on{background:linear-gradient(135deg,#1d5f8a,#3EA3DC)!important;color:#fff!important}.hmp a.on i{background:rgba(255,255,255,.2);color:#fff}',
    '.hm{flex-wrap:nowrap!important}.hm .hmb{padding:7px 11px!important}.hm .hmm{display:inline-flex;align-items:center;gap:5px}.hm .hmm svg{width:16px;height:16px}',
    /* page title row: the banner already carries it */
    '#hd2 .ttl:before,.ttl:before{background:linear-gradient(#BF9849,#3EA3DC)!important}',
    'body:has(.hero) .ttl,body:has(.pgban) .ttl,body:has(.cm-ban) .ttl,body:has(.ban) .ttl{display:none!important}',
    /* bottom sheets & dialogs */
    '.sov,#hqs,.nov{background:rgba(24,28,50,.5)!important;-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px)}',
    '.sbx,#hqs>div{border-radius:28px 28px 0 0!important;box-shadow:0 -14px 44px rgba(29,95,138,.28)!important}',
    '.sbx{padding-top:24px!important;position:relative}',
    '.sbx:before{content:"";position:sticky;top:-14px;display:block;width:44px;height:5px;border-radius:5px;background:#cfd9e3;margin:-12px auto 12px}',
    '.sbx h3{font-size:18px!important;font-weight:800}',
    /* detail sheet structure */
    '.sbx .shh{background:linear-gradient(180deg,#eef6fc,#fff);border:1px solid #dbe4ec;border-radius:20px;padding:14px;margin:0 0 12px}.sbx .shh h3{margin:0}',
    '.sbx .sx{background:#fff;border:1px solid #dbe4ec;border-radius:18px;padding:12px 14px;margin:0 0 12px;box-shadow:0 2px 8px rgba(30,60,90,.05)}',
    '.sbx .sxh{display:flex;align-items:center;gap:8px;font-weight:800;font-size:14.5px;color:#1d5f8a;margin:0 0 8px}.sbx .sxh svg{width:19px;height:19px;flex:none}',
    '.sbx label{display:block;font-size:12.5px!important;color:#5b6b7b!important;font-weight:700!important;margin:10px 0 4px!important}',
    '.sbx .dpr{display:flex;gap:8px;align-items:center;padding:3px 0}.sbx .dpi{display:inline-flex;color:#9aa7b4}.sbx .dpi.ok{color:#1c7a45}.sbx .dpi svg{width:18px;height:18px}',
    '.sbx .pb button{padding:6px 14px!important;font-size:13px!important}',
    '.sbx .shf{position:sticky;bottom:-22px;margin:14px -14px -22px!important;padding:12px 14px calc(12px + env(safe-area-inset-bottom,0px));background:rgba(255,255,255,.95);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border-top:1px solid #e4edf4;flex-wrap:nowrap}.sbx .shf button{flex:1}',
    '.sbx .card{background:#f7fafd!important;box-shadow:none!important;margin:0 0 12px!important}',
    /* range slider in brand colours (fill driven by --v) */
    'input[type=range]{-webkit-appearance:none;appearance:none;height:10px!important;border-radius:99px;border:0!important;padding:0!important;background:linear-gradient(to right,#3EA3DC var(--v,0%),#e1e9f0 var(--v,0%))!important;outline:0!important}',
    'html[dir=rtl] input[type=range]{background:linear-gradient(to left,#3EA3DC var(--v,0%),#e1e9f0 var(--v,0%))!important}',
    'input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:28px;height:28px;border-radius:50%;background:#fff;border:4px solid #1d5f8a;box-shadow:0 3px 10px rgba(29,95,138,.38)}',
    'input[type=range]::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:#fff;border:4px solid #1d5f8a}',
    /* full-screen view for charts / timelines */
    '.idofsb{display:flex;justify-content:flex-end;padding:0 0 6px}.idofsb button{display:inline-flex;gap:6px;align-items:center;padding:6px 12px!important;font-size:12.5px!important;border-radius:99px;background:#fff;border:1px solid #cfdbe6;color:#1d5f8a;font-weight:700}.idofsb svg{width:16px;height:16px}',
    '.idofs-on{position:fixed!important;top:calc(54px + env(safe-area-inset-top,0px))!important;left:0!important;right:0!important;bottom:0!important;z-index:9998!important;width:100vw!important;max-width:none!important;height:auto!important;max-height:none!important;margin:0!important;border-radius:0!important;border:0!important;background:#fff!important;overflow:auto!important;box-sizing:border-box}',
    '#idofsx{position:fixed;top:0;left:0;right:0;z-index:9999;display:flex;justify-content:space-between;align-items:center;gap:8px;padding:calc(8px + env(safe-area-inset-top,0px)) 12px 8px;background:#f3f8fc;border-bottom:1px solid #dbe4ec;direction:inherit}',
    '#idofsx button{display:inline-flex;gap:6px;align-items:center;padding:7px 14px!important;border-radius:99px;background:#1d5f8a;color:#fff;border:0;font-weight:800}#idofsx svg{width:16px;height:16px}#idofsx .idofsh{font-size:12px;color:#5b6b7b}',
    '@media(orientation:landscape){#idofsx .idofsh{display:none}}',
    '#idofsv{position:fixed;top:calc(54px + env(safe-area-inset-top,0px));left:0;right:0;bottom:0;z-index:9998;background:#fff;overflow:auto;padding:12px;box-sizing:border-box}#idofsv svg{min-width:720px;width:100%;height:auto;display:block}',
    /* controls */
    'button.p,.btn.p{background:linear-gradient(135deg,#1d5f8a,#3EA3DC)!important;border-color:transparent!important;color:#fff!important;box-shadow:0 6px 16px rgba(29,95,138,.26)}',
    'button.p:disabled,.btn.p:disabled{background:#eceae4!important;color:#8b8678!important;border-color:#d9d4c4!important;box-shadow:none!important;cursor:default}',
    '.tabs button.on,.chips button.on{background:#1d5f8a!important;border-color:#1d5f8a!important;color:#fff!important}',
    '.card,.item,.it,.tk,.pj,.wb{border-color:#dbe4ec!important}',
    '.card,.pj{border-radius:18px!important;box-shadow:0 2px 10px rgba(30,60,90,.06)}',
    '.tk,.it,.wb{border-radius:14px!important}',
    'input,select,textarea{border-color:#cfdbe6!important}input:focus,select:focus,textarea:focus{outline:2px solid #3EA3DC55;border-color:#3EA3DC!important}'
  ].join('\n');

  function addCss() {
    if (document.getElementById('idoui')) return;
    var s = document.createElement('style'); s.id = 'idoui'; s.textContent = CSS;
    (document.body || document.documentElement).appendChild(s);
  }

  /* ---------- icon swap (nav + menu), re-applied when those parts re-render ---------- */
  function navIcons() {
    document.querySelectorAll('#gnav a.gnb').forEach(function (a) {
      var i = a.querySelector('i'); if (!i || i.getAttribute('data-ui')) return;
      var n = a.id === 'gback' ? 'back' : (BY[base(a)] || 'dot');
      i.innerHTML = svg(n); i.setAttribute('data-ui', '1');
    });
    document.querySelectorAll('.hmp a').forEach(function (a) {
      var i = a.querySelector('i'); if (!i || i.getAttribute('data-ui')) return;
      i.innerHTML = svg(BY[base(a)] || 'dot'); i.setAttribute('data-ui', '1');
    });
    var m = document.getElementById('hm_m');
    if (m && !m.querySelector('svg')) {
      var t = m.textContent.replace(/^\s*☰\s*/, '').trim();
      if (t) m.innerHTML = svg('menu') + '<span>' + t.replace(/</g, '&lt;') + '</span>';
    }
  }
  /* ---------- emoji -> line icons inside buttons / links / chips ---------- */
  var EMO = { '📅': 'calendar', '⚙': 'gear', '⬇': 'download', '❔': 'help', '❓': 'help', '✏': 'edit', '🔗': 'link', '🔍': 'search', '🗑': 'trash', '📎': 'clip', '📝': 'note', '⬆': 'up', '👁': 'eye', '🔔': 'inbox', '🏠': 'home', '🧭': 'compass', '✅': 'tasks', '📂': 'folder', '📁': 'folder', '⏩': 'fwd', '⏪': 'rew', '👤': 'user', '🔎': 'search', '🗺': 'map', '☰': 'list', '▦': 'grid', '📋': 'note' };
  var RE = new RegExp('(' + Object.keys(EMO).join('|') + ')\\uFE0F?', 'g');
  var SEL = 'label,.cm-bar,button,summary,.hb,.hbtn,#tkfab,.fab,.cm-chip,.cm-fm a,.chp,.lk,.lk2';
  function emoji(root) {
    (root || document).querySelectorAll(SEL).forEach(function (el) {
      if (el.id === 'hm_m' || el.closest('#gnav,.hmp')) return;
      var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), L = [], n;
      while ((n = w.nextNode())) { if (n.nodeValue && RE.test(n.nodeValue)) L.push(n); RE.lastIndex = 0; }
      L.forEach(function (n) {
        var t = n.nodeValue, f = document.createDocumentFragment(), last = 0, m; RE.lastIndex = 0;
        while ((m = RE.exec(t))) {
          if (m.index > last) f.appendChild(document.createTextNode(t.slice(last, m.index)));
          var sp = document.createElement('span'); sp.className = 'ii'; sp.innerHTML = svg(EMO[m[1]]); f.appendChild(sp);
          last = m.index + m[0].length;
        }
        if (last < t.length) f.appendChild(document.createTextNode(t.slice(last)));
        n.parentNode.replaceChild(f, n);
      });
    });
  }
  function rng(e) { var r = e.target; if (r && r.type === 'range') r.style.setProperty('--v', ((r.value - (r.min || 0)) / ((r.max || 100) - (r.min || 0)) * 100) + '%'); }
  function rngAll() { document.querySelectorAll('input[type=range]').forEach(function (r) { if (!r.getAttribute('data-v')) { r.setAttribute('data-v', '1'); rng({ target: r }); } }); }
  document.addEventListener('input', rng, true); document.addEventListener('rng', rng, true);
  /* ---------- full-screen view for any timeline / chart ---------- */
  var FS_SEL = '.gw,.gwrap', FS_ALL = FS_SEL + ',.xsvg';
  function L() { try { return localStorage.getItem('lang') === 'en' ? 'en' : 'ar'; } catch (e) { return 'ar'; } }
  function T(a, b) { return L() === 'ar' ? a : b; }
  function fsBar() {
    var b = document.getElementById('idofsx'); if (b) return b;
    b = document.createElement('div'); b.id = 'idofsx';
    b.innerHTML = '<button type="button">' + svg('x') + '<span>' + T('إغلاق', 'Close') + '</span></button><span class="idofsh">' + T('أدر الجوال أفقيًا لعرض أوسع', 'Rotate your phone for a wider view') + '</span>';
    b.firstChild.onclick = fsClose; document.body.appendChild(b); return b;
  }
  function fsClose() {
    window.__idofs = null;
    document.querySelectorAll('.idofs-on').forEach(function (e) { e.classList.remove('idofs-on'); });
    ['idofsx', 'idofsv'].forEach(function (i) { var e = document.getElementById(i); if (e) e.remove(); });
    document.body.style.overflow = '';
  }
  function fsOpen(el) {
    if (el.matches(FS_SEL)) {
      var i = Array.prototype.indexOf.call(document.querySelectorAll(FS_SEL), el);
      window.__idofs = { i: i }; fsBar(); el.classList.add('idofs-on'); document.body.style.overflow = 'hidden';
    } else { /* svg charts: show a scrollable copy */
      fsClose(); fsBar(); var v = document.createElement('div'); v.id = 'idofsv'; v.setAttribute('dir', 'ltr');
      var c = el.cloneNode(true); c.removeAttribute('width'); c.removeAttribute('height'); v.appendChild(c); document.body.appendChild(v); document.body.style.overflow = 'hidden';
    }
  }
  function fsBars() {
    document.querySelectorAll(FS_ALL).forEach(function (el) {
      if (el.__fsb || el.classList.contains('gfs') || el.closest('.zb,#idofsv,.idofs-on,.cm-ring')) return;
      if (typeof window.togFS === 'function' && el.matches('.gwrap')) return;
      el.__fsb = 1;
      var bar = document.createElement('div'); bar.className = 'idofsb';
      bar.innerHTML = '<button type="button">' + svg('expand') + '<span>' + T('ملء الشاشة', 'Full screen') + '</span></button>';
      bar.firstChild.onclick = function () { fsOpen(el); };
      el.parentNode.insertBefore(bar, el);
    });
    if (window.__idofs && !document.querySelector('.idofs-on')) {
      var el = document.querySelectorAll(FS_SEL)[window.__idofs.i];
      if (el) { el.classList.add('idofs-on'); } else fsClose();
    }
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fsClose(); });
  var raf = 0;
  function sched() { if (raf) return; raf = requestAnimationFrame(function () { raf = 0; navIcons(); emoji(); rngAll(); fsBars(); }); }

  function start() {
    addCss(); navIcons(); emoji(); rngAll(); fsBars();
    try { new MutationObserver(sched).observe(document.body, { childList: true, subtree: true, characterData: true }); } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
