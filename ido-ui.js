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
    more: '<circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/>',
    dot: '<circle cx="12" cy="12" r="4"/>'
  };
  var BY = {
    'index.html': 'home', './': 'home', '': 'home', 'tasks.html': 'tasks', 'inbox.html': 'inbox', 'myprojects.html': 'folder',
    'projects.html': 'sliders', 'chat.html': 'chat', 'portfolio.html': 'chart', 'perf.html': 'trend', 'account.html': 'user',
    'settings.html': 'gear', 'users.html': 'users', 'archive.html': 'archive', 'help.html': 'help', 'roles.html': 'shield',
    'audit.html': 'audit', 'control.html': 'compass', 'unit.html': 'users', 'ratings.html': 'star', 'access.html': 'key', 'perms.html': 'shield', 'mail.html': 'note', 'history.html': 'clock', 'logs.html': 'clock', 'achieve.html': 'star'
  };
  function svg(n) { return '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || P.dot) + '</svg>'; }
  window.IDOI = { svg: function (n) { return svg(n); }, i: function (k) { return ihBtn(k); }, svg: svg, names: Object.keys(P) };
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
    '.hmp{max-height:min(62vh,520px)!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;scrollbar-width:thin;border-radius:22px!important;padding:8px!important;min-width:250px!important;border:1px solid #dbe4ec!important;box-shadow:0 20px 48px rgba(29,95,138,.24)!important}',
    '.hmp a{border-radius:16px!important;padding:5px 8px!important;gap:12px!important;font-weight:700;color:#181C32!important}',
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
    '#idofsv{position:fixed;top:calc(54px + env(safe-area-inset-top,0px));left:0;right:0;bottom:0;z-index:9998;background:#fff;overflow:hidden;box-sizing:border-box;display:flex;flex-direction:column;touch-action:none}#idofsv .fvp{flex:1;min-height:0;position:relative;overflow:hidden}#idofsv .fin{position:absolute;left:0;top:0;transform-origin:0 0}#idofsv .fin svg{display:block}#idofsv .flg{padding:6px 12px calc(6px + env(safe-area-inset-bottom,0px));border-top:1px solid #e3e7eb;font-size:12.5px;direction:rtl;background:#fff}#idofsv .flg .xl{margin:2px 0}#idofsv .fzt{position:absolute;bottom:10px;left:10px;display:flex;gap:6px;z-index:3}#idofsv .fzt button{width:42px;height:42px;border-radius:12px;border:1px solid #d6dde3;background:#fff;font-size:20px;font-weight:700;color:#1d5f8a;box-shadow:0 2px 8px rgba(0,0,0,.1);padding:0}#idofsv .ftip{position:absolute;z-index:4;background:#fff;border:1px solid #d6dde3;border-radius:12px;padding:8px 12px;font-size:13px;line-height:1.6;box-shadow:0 6px 20px rgba(0,0,0,.15);direction:rtl;max-width:260px;display:none}#idofsv .ftip a{display:inline-block;margin-top:4px;color:#1d5f8a;font-weight:700;cursor:pointer}',
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
    var s = document.createElement('style'); s.id = 'idoui'; s.textContent = CSS + '.ih{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;margin-inline-start:6px;border-radius:50%;border:1.5px solid #B39A6B;background:#fff;color:#7a6740;font:italic 700 12px/1 Georgia,serif;cursor:pointer;padding:0;vertical-align:middle}.ih:active{background:#f3ecdc}.ihs{position:fixed;inset:0;display:flex;align-items:flex-end;justify-content:center;background:rgba(24,28,50,.5)}.ihs .sbx{background:#fff;width:100%;max-width:520px;padding:18px 18px calc(22px + env(safe-area-inset-bottom));border-radius:28px 28px 0 0;box-shadow:0 -6px 24px rgba(0,0,0,.2)}.ihs h3{margin:0 0 4px;font-size:17px}';
    (document.body || document.documentElement).appendChild(s);
  }

  /* ---------- icon swap (nav + menu), re-applied when those parts re-render ---------- */
  function navIcons() {
    document.querySelectorAll('#gnav a.gnb').forEach(function (a) {
      var i = a.querySelector('i'); if (!i || i.getAttribute('data-ui')) return;
      var n = a.id === 'gback' ? 'back' : a.id === 'gmore' ? 'more' : (BY[base(a)] || 'dot');
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
      var vp = document.createElement('div'); vp.className = 'fvp'; var inn = document.createElement('div'); inn.className = 'fin'; vp.appendChild(inn); v.appendChild(vp);
      var c = el.cloneNode(true); c.removeAttribute('width'); c.removeAttribute('height'); inn.appendChild(c);
      var lg = document.createElement('div'); lg.className = 'flg'; var sib = el.nextElementSibling, n = 0;
      while (sib && n++ < 3 && sib.classList && sib.classList.contains('xl')) { lg.appendChild(sib.cloneNode(true)); sib = sib.nextElementSibling; }
      if (lg.childNodes.length) v.appendChild(lg);
      document.body.appendChild(v); document.body.style.overflow = 'hidden'; fsZoom(v, vp, inn, c);
    }
  }
  function fsZoom(v, vp, inn, svg) {
    var vb = (svg.getAttribute('viewBox') || '0 0 360 250').split(/[\s,]+/).map(Number), W0 = vb[2] || 360, H0 = vb[3] || 250, base = 1, k = 1, x = 0, y = 0;
    var tip = document.createElement('div'); tip.className = 'ftip'; vp.appendChild(tip);
    var zt = document.createElement('div'); zt.className = 'fzt'; zt.innerHTML = '<button type="button" data-f="in">+</button><button type="button" data-f="out">−</button><button type="button" data-f="fit">⤢</button>'; vp.appendChild(zt);
    function apply() { inn.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + k + ')'; tip.style.display = 'none'; }
    function fit() { var cw = vp.clientWidth, ch = vp.clientHeight, pad = 10; base = Math.min((cw - pad * 2) / W0, (ch - pad * 2) / H0); svg.setAttribute('width', W0 * base); svg.setAttribute('height', H0 * base); k = 1; x = (cw - W0 * base) / 2; y = (ch - H0 * base) / 2; apply(); }
    function zoomAt(f, cx, cy) { var nk = Math.max(.6, Math.min(6, k * f)); f = nk / k; x = cx - (cx - x) * f; y = cy - (cy - y) * f; k = nk; apply(); }
    zt.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    zt.addEventListener('click', function (e) { var b = e.target.closest('[data-f]'); if (!b) return; e.stopPropagation(); var f = b.dataset.f; if (f === 'fit') fit(); else zoomAt(f === 'in' ? 1.4 : 1 / 1.4, vp.clientWidth / 2, vp.clientHeight / 2); });
    vp.addEventListener('wheel', function (e) { e.preventDefault(); var r = vp.getBoundingClientRect(); zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - r.left, e.clientY - r.top); }, { passive: false });
    var P = {}, moved = 0, sx, sy, d0 = 0;
    vp.addEventListener('pointerdown', function (e) { if (e.target.closest('.fzt,.ftip')) return; P[e.pointerId] = [e.clientX, e.clientY]; moved = 0; sx = x; sy = y; var a = Object.values(P); if (a.length === 2) d0 = Math.hypot(a[0][0] - a[1][0], a[0][1] - a[1][1]); });
    vp.addEventListener('pointermove', function (e) {
      var o = P[e.pointerId]; if (!o) return; var ids = Object.keys(P);
      if (ids.length === 2) { P[e.pointerId] = [e.clientX, e.clientY]; var a = Object.values(P), d = Math.hypot(a[0][0] - a[1][0], a[0][1] - a[1][1]), r = vp.getBoundingClientRect(); if (d0 && d) zoomAt(d / d0, (a[0][0] + a[1][0]) / 2 - r.left, (a[0][1] + a[1][1]) / 2 - r.top); d0 = d; moved = 9; return; }
      var dx = e.clientX - o[0], dy = e.clientY - o[1]; if (!moved && Math.hypot(dx, dy) < 6) return; moved = 1; x = sx + dx; y = sy + dy; apply();
    });
    function up(e) { delete P[e.pointerId]; d0 = 0; var a = Object.values(P); if (a.length === 1) { sx = x; sy = y; P[Object.keys(P)[0]] = a[0]; } }
    vp.addEventListener('pointerup', up); vp.addEventListener('pointercancel', up);
    vp.addEventListener('click', function (e) {
      if (moved) { moved = 0; return; }
      var el = e.target.closest && e.target.closest('[data-tip]'); if (!el) { tip.style.display = 'none'; return; }
      var r = vp.getBoundingClientRect(), k2 = el.getAttribute('data-k'), sc = el.getAttribute('data-sc');
      tip.innerHTML = el.getAttribute('data-tip') + (k2 && typeof window.goPj === 'function' ? '<br><a>' + T('فتح المشروع ›', 'Open project ›') + '</a>' : '');
      var a = tip.querySelector('a'); if (a) a.onclick = function (ev) { ev.stopPropagation(); fsClose(); window.goPj(k2, +sc); };
      tip.style.display = 'block'; var tx = e.clientX - r.left + 12, ty = e.clientY - r.top + 12, w = tip.offsetWidth, h = tip.offsetHeight;
      if (tx + w > r.width - 6) tx = Math.max(6, e.clientX - r.left - w - 12); if (ty + h > r.height - 60) ty = Math.max(6, e.clientY - r.top - h - 12);
      tip.style.left = tx + 'px'; tip.style.top = ty + 'px';
    });
    requestAnimationFrame(fit); var rs = function () { if (!document.body.contains(v)) { window.removeEventListener('resize', rs); return; } setTimeout(fit, 120); }; window.addEventListener('resize', rs);
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

  /* ===== أيقونات المعلومة (i) — منهجية أوزان المشاريع ===== */
  var IH = {
    ptype: ['نوع المشروع', 'استراتيجي أم تشغيلي؟ يُحدَّد من «تقييم المشروع» (٣٣ سؤالًا في ١٥ محورًا): إن بلغت النسبة ٧٠٪ فأكثر فهو استراتيجي، وإلا تشغيلي. التوصية تُعتمد من مكتب التطوير المؤسسي، وتؤثر على وزن المشروع في إنجاز القطاع والمركز.',
      'Project type', 'Strategic or operational? Set by the project assessment (33 questions over 15 axes): 70% or more is strategic, otherwise operational. The Institutional Development Office approves it, and it affects the project weight in sector and centre progress.'],
    cat: ['فئة المشروع', 'تصنيف يحدد معامل ضرب القيمة قبل احتساب الوزن:\n• الفئة أ — مشروع تحول / استراتيجي رئيسي (×٣)\n• الفئة د — مشروع إلزامي (×٢)\n• الفئة ب — استراتيجي / استراتيجي ممكّن (×١٫٥)\n• الفئة ج — مشروع تشغيلي (×١) وهي الافتراضية عند عدم التحديد.\nإن لم يُقيَّم المشروع تُستخدم القيمة الافتراضية للفئة (أ ٧٠، ب ٦٠، د ٦٥، ج ٥٠).',
      'Project category', 'A classification that sets the multiplier applied before the weight is computed:\n• A — transformational / major strategic (×3)\n• D — mandatory (×2)\n• B — strategic / enabling strategic (×1.5)\n• C — operational (×1), the default when unset.\nIf the project is not assessed, the category default is used (A 70, B 60, D 65, C 50).'],
    eval: ['نسبة التقييم', 'مجموع درجات إجابات التقييم موزونة بأهمية كل سؤال، منسوبة إلى أعلى درجة ممكنة (٠–١٠٠٪). ٧٠٪ فأكثر = استراتيجي. تظهر «بلا تقييم» حتى يُعتمد أول تقييم، وتُستخدم عندها القيمة الافتراضية لفئة المشروع.',
      'Assessment score', 'The sum of answer scores weighted by each question’s importance, as a share of the maximum possible (0–100%). 70% or more = strategic. Shows “Not assessed” until the first assessment is approved; the category default is used meanwhile.'],
    adj: ['النتيجة بعد التصنيف', 'القيمة المعتمدة (نسبة التقييم أو الافتراضية) × معامل الفئة. هذه هي الحصة الخام للمشروع قبل تحويلها إلى نسبة من المحفظة.',
      'Adjusted score', 'The base value (assessment or default) × the category multiplier. This is the project’s raw share before it is turned into a percentage of the portfolio.'],
    weight: ['وزن المشروع %', 'نصيب المشروع من المحفظة = النتيجة بعد التصنيف ÷ مجموع النتائج لكل المشاريع × (١٠٠ − مجموع الأوزان اليدوية). يستخدم في حساب الإنجاز الكلي للمحفظة والقطاعات. المجموع دائمًا ١٠٠٪.',
      'Project weight %', 'The project’s share of the portfolio = adjusted score ÷ sum of all adjusted scores × (100 − total manual weights). Used in overall portfolio and sector progress. Always totals 100%.'],
    man: ['وزن يدوي %', 'اتركه فارغًا ليُحتسب الوزن تلقائيًا. إن أدخلت رقمًا يُثبَّت للمشروع كما هو، ويُوزَّع الباقي على بقية المشاريع.',
      'Manual weight %', 'Leave empty for the automatic weight. A number you enter is fixed for the project, and the remainder is shared among the other projects.'],
    evq: ['تقييم المشروع', 'أسئلة قصيرة تقيس أثر المشروع عبر ١٥ محورًا (الأهداف، الأفق الزمني، نطاق التأثير، الموارد، النتائج، القيمة المالية، الابتكار، السوق، الاستدامة، الشراكات، التقنية، الثقافة، التكيف، العملاء، الموظفون). أجب بحسب الواقع المتوقع؛ كل سؤال له وزن يحدده المكتب. النتيجة توصية تُعتمد من مكتب التطوير.',
      'Project assessment', 'Short questions measuring impact over 15 axes (objectives, time horizon, scope, resources, results, financial value, innovation, market fit, sustainability, partnerships, technology, culture, adaptability, customers, employees). Answer realistically; each question has a weight set by the office. The result is a recommendation approved by the office.'],
    wratio: ['وزن الاستراتيجي مقابل التشغيلي', 'يُستخدم فقط للمشاريع التي لا يوجد لها وزن محسوب من منهجية التقييم والفئات. الأوزان المحسوبة من تبويب «الأوزان» في المحفظة تتقدم عليه.',
      'Strategic vs operational weight', 'Only used for projects with no weight computed from the assessment/category methodology. Weights from the portfolio “Weights” tab take priority.'],
    wsec: ['وزن القطاع', 'أهمية القطاع عند تجميع إنجاز المركز من القطاعات. القيمة ١ تعني وزنًا متساويًا.',
      'Sector weight', 'The sector’s importance when centre progress is aggregated from sectors. 1 means equal weight.']
  };
  IH.thr = IH.ptype;
  function lg() { try { return (typeof lang !== 'undefined' ? lang : document.documentElement.lang || 'ar').slice(0, 2); } catch (e) { return 'ar'; } }
  function ihOpen(k) {
    var c = IH[k]; if (!c) return; var ar = lg() == 'ar', o = document.createElement('div');
    o.className = 'sov ihs'; o.style.zIndex = 100000; o.onclick = function (e) { if (e.target == o) o.remove(); };
    o.innerHTML = '<div class="sbx"><h3></h3><p style="white-space:pre-line;line-height:1.8;margin:6px 0 12px"></p><button type="button" class="p"></button></div>';
    o.querySelector('h3').textContent = c[ar ? 0 : 2]; o.querySelector('p').textContent = c[ar ? 1 : 3];
    var b = o.querySelector('button'); b.textContent = ar ? 'حسنًا' : 'OK'; b.onclick = function () { o.remove(); };
    document.body.appendChild(o);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.ih'); if (!b) return;
    e.preventDefault(); e.stopPropagation(); ihOpen(b.getAttribute('data-ih'));
  }, true);
  function ihBtn(k) { return '<button type="button" class="ih" data-ih="' + k + '" aria-label="info">i</button>'; }

  /* ===== رابط عميق: page.html#find=نص — يفتح القسم/التبويب المطابق ويُبرزه ===== */
  function deep() {
    var m = /#find=([^&]+)/.exec(location.hash); if (!m) return;
    var q; try { q = decodeURIComponent(m[1]).replace(/\s+/g, ' ').trim(); } catch (e) { return; }
    var SELS = ['.card.fd>h2', 'summary', 'button', 'h2', 'h3', 'a', 'label'], n = 0;
    var tick = setInterval(function () {
      n++; var el = null;
      for (var s = 0; s < SELS.length && !el; s++) {
        var c = document.querySelectorAll(SELS[s]);
        for (var i = 0; i < c.length; i++) {
          if (c[i].closest('#gnav,.hmp,#hd2,.top,.hm,#pgban,#idofsv,#fdbar,.ttl')) continue;
          var tx = (c[i].textContent || '').replace(/\s+/g, ' ').trim();
          if (tx.indexOf(q) === 0 || (tx.indexOf(q) >= 0 && tx.length < q.length + 30)) { el = c[i]; break; }
        }
      }
      if (!el && n < 30) return;
      clearInterval(tick); if (!el) return;
      try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
      var card = el.closest('.card.fd'), tgt = el;
      if (card) { card.classList.remove('cl'); tgt = card; }
      else if (el.tagName === 'SUMMARY') { el.parentNode.open = true; tgt = el.parentNode; }
      else if (el.tagName === 'BUTTON' || el.tagName === 'A') { el.click(); tgt = null; }
      setTimeout(function () {
        var t = tgt && tgt.isConnected ? tgt : (document.querySelector('main') || document.body);
        t.style.scrollMarginTop = '130px';
        try { t.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) { t.scrollIntoView(); }
        if (tgt) { tgt.style.transition = 'box-shadow .3s'; tgt.style.boxShadow = '0 0 0 3px #3EA3DC'; setTimeout(function () { tgt.style.boxShadow = ''; }, 2200); }
      }, 350);
    }, 400);
  }

  /* روابط إضافية في القائمة: «وحدتي» لمسؤولي الوحدات والأدمن، و«التحكم» للأدمن */
  function menuX() {
    var boxes = document.querySelectorAll('.hmp'); if (!boxes.length) return;
    var ls = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
    var adm = ls('hdrRole') === 'admin', head = ls('hdrHead') === '1', cur = location.pathname.split('/').pop();
    var caps = []; try { caps = JSON.parse(ls('hdrCaps') || '[]') || []; } catch (e) {}
    var hc = function (k) { return adm || caps.indexOf(k) >= 0; };
    var ICO = { 'unit.html': '👥', 'perms.html': '🔐', 'control.html': '🧭', 'users.html': '🛠', 'settings.html': '⚙', 'audit.html': '📜', 'logs.html': '🗄', 'achieve.html': '🏆', 'projects.html': '📁', 'mail.html': '✉', 'history.html': '↶' };
    boxes.forEach(function (box) {
      try { box.querySelectorAll('a[href="users.html"],a[href="access.html"],a[href="roles.html"]').forEach(function (u) { if (box.querySelector('a[href="perms.html"]')) u.remove(); else { u.setAttribute('href', 'perms.html'); } }); box.querySelectorAll('a[href="perms.html"]').forEach(function (u) { var ar = (document.documentElement.lang || 'ar') === 'ar', sp = u.querySelector('span'), lab = ar ? 'المستخدمون والصلاحيات' : 'Users & access'; if (sp) sp.textContent = lab; else if (!u.querySelector('*')) u.textContent = lab; }); } catch (e) {}
      [['achieve.html', true, 'إنجازي', 'My achievements'], ['unit.html', adm || head || hc('adm.control'), 'وحدتي', 'My unit'], ['control.html', hc('adm.control'), 'التحكم', 'Control'], ['perms.html', hc('adm.roles') || hc('adm.users'), 'المستخدمون والصلاحيات', 'Users & access'], ['settings.html', hc('adm.settings'), 'الإعدادات', 'Settings'], ['projects.html', hc('adm.projects'), 'إعدادات المشاريع', 'Project settings'], ['logs.html', adm || hc('audit.view') || hc('off.undo'), 'السجلات والأرشيف', 'Logs & archive'], ['mail.html', hc('adm.mail') && !hc('adm.settings'), 'البريد الإلكتروني', 'Email']].forEach(function (x) {
        if (!x[1] || box.querySelector('a[href="' + x[0] + '"]')) return;
        var ref = box.querySelector('a[href="perf.html"]') || box.querySelector('a[href="portfolio.html"]') || box.querySelector('a'); if (!ref) return;
        var a = ref.cloneNode(true); a.classList.remove('on'); a.setAttribute('href', x[0]); a.removeAttribute('id');
        var ar = (document.documentElement.lang || 'ar') === 'ar', sp = a.querySelector('span'), lab = ar ? x[2] : x[3];
        if (sp) sp.textContent = lab; else a.textContent = lab;
        var ic = a.querySelector('i'); if (ic) { ic.textContent = ICO[x[0]] || '🧭'; ic.removeAttribute('data-ui'); }
        if (cur === x[0]) a.classList.add('on');
        ref.parentNode.insertBefore(a, ref.nextSibling);
      });
    });
  }
  var raf = 0;
  function sched() { if (raf) return; raf = requestAnimationFrame(function () { raf = 0; try { menuX(); } catch (e) {} navIcons(); emoji(); rngAll(); fsBars(); }); }

  /* داخل التحكم (iframe): إخفاء ترويسة الصفحة وشريطها السفلي */
  var EMB = false; try { EMB = window.self !== window.top; } catch (e) { EMB = true; }
  if (EMB) {
    document.documentElement.classList.add('embed');
    var es = document.createElement('style'); es.id = 'idoemb';
    es.textContent = 'html.embed #hd2,html.embed .top,html.embed #gnav,html.embed .hm,html.embed .hmp,html.embed #pgban,html.embed .pgban,html.embed .ttl,html.embed #fdbar+x{display:none!important}html.embed body{padding-bottom:12px!important;--gnh:0px}html.embed,html.embed body{background:transparent!important}html.embed .tbn,html.embed #tbnav,html.embed .bnav{display:none!important}html.embed main{padding-top:8px!important}';
    (document.head || document.documentElement).appendChild(es);
    /* روابط الصفحات الأخرى من داخل الإطار تفتح في الصفحة الأم */
    document.addEventListener('click', function (ev) { try { if (!/perms\.html$/.test(window.top.location.pathname)) return; var a = ev.target.closest && ev.target.closest('a[href]'); if (!a || a.target) return; var h = a.getAttribute('href') || ''; if (!/\.html(\?|#|$)/.test(h) || /^javascript:/.test(h)) return; var here = location.pathname.split('/').pop(); if (h.split(/[?#]/)[0] === here) return; ev.preventDefault(); window.top.location.href = new URL(h, location.href).href; } catch (e) {} }, true);
  }
  function start() {
    addCss(); try { menuX(); } catch (e) {} navIcons(); emoji(); rngAll(); fsBars();
    try { deep(); } catch (e) {}
    try { new MutationObserver(sched).observe(document.body, { childList: true, subtree: true, characterData: true }); } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();

/* تنبيه منبثق لبضع ثوانٍ عند وصول رسالة جديدة في التواصل (مثل برامج المحادثة) */
(function () {
  if (/chat\.html/.test(location.pathname)) return;
  try { if (window.self !== window.top) return; } catch (e) { return; }
  function on() { try { return localStorage.getItem('chatToast') !== '0'; } catch (e) { return true; } }
  function ar() { try { return (localStorage.getItem('lang') || 'ar') !== 'en'; } catch (e) { return true; } }
  var ME = null, BASE = null, busy = 0, NAMES = {}, CHN = {}, Q = [], showing = 0;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  /* نغمة التنبيه (نفس نغمة صفحة المحادثات) + تنبيهات سطح المكتب عندما تكون الصفحة في الخلفية */
  var AUD = null, AUDok = false, ACX = null, TURI = '', SIL = 'data:audio/wav;base64,UklGRkQDAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YSADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==', TONE = [[523.25, 0], [783.99, .13]], TLEN = .75, TVOL = .2;
  function lsN(k) { try { return +localStorage.getItem(k) || 0; } catch (e) { return 0; } }
  function lsS(k) { try { localStorage.setItem(k, String(Date.now())); } catch (e) {} }
  function ntfOn(cat) { var c = window.IDONTF; if (!c) return true; if (c.all === '0') return false; return String(c.off || '').split(',').indexOf(cat) < 0; }
  window.idoNtfOn = ntfOn;
  function ntfLoad() { try { var c = JSON.parse(localStorage.getItem('idoNtf') || 'null'); if (c && Date.now() - c.t < 600000) { window.IDONTF = c; return; } } catch (e) {}
    try { if (typeof sb === 'undefined' || !sb) return; sb.from('app_settings').select('key,value').in('key', ['notif_all', 'notif_off']).then(function (r) { var c = { all: '1', off: '', t: Date.now() }; ((r && r.data) || []).forEach(function (x) { if (x.key == 'notif_all') c.all = x.value; if (x.key == 'notif_off') c.off = x.value || ''; }); window.IDONTF = c; try { localStorage.setItem('idoNtf', JSON.stringify(c)); } catch (e) {} }, function () {}); } catch (e) {} }
  (function nt(n) { setTimeout(function () { if (typeof sb === 'undefined' || !sb) { if (n < 15) nt(n + 1); return; } ntfLoad(); }, 800); })(0);
  function sndOn() { if (!ntfOn('chat')) return false; try { return localStorage.getItem('chatSnd') !== '0'; } catch (e) { return true; } }
  function toneAt(t) { var y = 0; TONE.forEach(function (z) { var u = t - z[1]; if (u < 0) return; var env = (u < .008 ? u / .008 : 1) * Math.exp(-u / .2); y += env * (Math.sin(2 * Math.PI * z[0] * u) + .18 * Math.sin(4 * Math.PI * z[0] * u) * Math.exp(-u / .06)); }); return y * TVOL / 1.18; }
  function audMk() {
    if (AUD) return AUD;
    try {
      var sr = 22050, n = Math.floor(sr * TLEN), buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf), i;
      var w = function (o, t) { for (var j = 0; j < t.length; j++) v.setUint8(o + j, t.charCodeAt(j)); };
      w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 2, true);
      for (i = 0; i < n; i++) { var t = i / sr, f = t > TLEN - .05 ? (TLEN - t) / .05 : 1; v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, toneAt(t) * f)) * 32767, true); }
      var bin = '', u8 = new Uint8Array(buf); for (i = 0; i < u8.length; i += 8192) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 8192));
      TURI = 'data:audio/wav;base64,' + btoa(bin); AUD = new Audio(SIL); AUD.preload = 'auto'; AUD.setAttribute('playsinline', '');
    } catch (e) { AUD = null; }
    return AUD;
  }
  function acx() { try { if (!ACX) ACX = new (window.AudioContext || window.webkitAudioContext)(); if (ACX.state === 'suspended') ACX.resume(); return ACX; } catch (e) { return null; } }
  function unlock() {
    /* فتح الصوت في الآيفون بملف صامت تمامًا، ثم تحميل النغمة — حتى لا تُسمع النغمة عند أول لمسة */
    acx(); var a = audMk(); if (!a || AUDok) return;
    try { a.src = SIL; var pr = a.play(); var done = function () { try { a.pause(); } catch (e) {} AUDok = true; a.src = TURI; try { a.load(); } catch (e) {} };
      if (pr && pr.then) pr.then(done).catch(function () {}); else done(); } catch (e) {}
  }
  ['pointerup', 'touchend', 'click', 'keydown'].forEach(function (ev) { document.addEventListener(ev, unlock, { passive: true }); });
  function ding() {
    if (!sndOn()) return; var now = Date.now();
    if (now - lsN('chatDingAt') < 2500 || now - lsN('chatSentAt') < 5000) return; lsS('chatDingAt');
    var a = audMk();
    if (a && AUDok) { try { if (a.src !== TURI) a.src = TURI; a.currentTime = 0; var pr = a.play(); if (pr && pr.catch) pr.catch(wa); return; } catch (e) {} }
    wa();
    function wa() { var c = acx(); if (!c) return; try { var t0 = c.currentTime; TONE.forEach(function (z) { var t = t0 + z[1], o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(z[0], t); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(TVOL * .5, t + .008); g.gain.exponentialRampToValueAtTime(0.0001, t + .6); o.connect(g).connect(c.destination); o.start(t); o.stop(t + .62); }); } catch (e) {} }
  }
  function sysNote(m) {
    try {
      if (!ntfOn('chat')) return true;
      if (!('Notification' in window) || Notification.permission !== 'granted') return false;
      var k = 'chatNtf:' + m.key; if (Date.now() - lsN(k) < 4000) return true; lsS(k);
      var n = new Notification((m.name || (ar() ? 'رسالة جديدة' : 'New message')) + (m.grp ? ' · ' + m.grp : ''), { body: m.body || (ar() ? '📎 مرفق' : '📎 Attachment'), tag: 'ido-chat-' + m.key, icon: ((document.querySelector('link[rel=apple-touch-icon]') || {}).href) || undefined, silent: true });
      n.onclick = function () { try { window.focus(); } catch (e) {} location.href = 'chat.html?o=' + encodeURIComponent(m.key); n.close(); };
      return true;
    } catch (e) { return false; }
  }
  function askNotif() {
    try {
      if (!('Notification' in window) || Notification.permission !== 'default' || lsN('chatNtfAsk') || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) return;
      css(); var b = document.createElement('div'); b.id = 'cnask';
      b.innerHTML = '<span>🔔 ' + (ar() ? 'هل تريد تنبيهًا على سطح المكتب عند وصول رسالة والمتصفح في الخلفية؟' : 'Get desktop alerts for new messages while the browser is in the background?') + '</span><button class="y">' + (ar() ? 'تفعيل' : 'Enable') + '</button><button class="n">' + (ar() ? 'لاحقًا' : 'Later') + '</button>';
      document.body.appendChild(b);
      b.querySelector('.y').onclick = function () { lsS('chatNtfAsk'); b.remove(); try { Notification.requestPermission(); } catch (e) {} };
      b.querySelector('.n').onclick = function () { lsS('chatNtfAsk'); b.remove(); };
    } catch (e) {}
  }
  function css() {
    if (document.getElementById('ctoastcss')) return;
    var s = document.createElement('style'); s.id = 'ctoastcss';
    s.textContent = '#ctoast{position:fixed;top:calc(env(safe-area-inset-top,0px) + 10px);left:50%;z-index:2147483000;width:min(420px,calc(100vw - 24px));transform:translate(-50%,-140%);transition:transform .32s cubic-bezier(.2,.9,.3,1.2),opacity .25s;opacity:0;pointer-events:none}' +
      '#ctoast.on{transform:translate(-50%,0);opacity:1;pointer-events:auto}' +
      '#ctoast .ct{display:flex;align-items:center;gap:11px;background:rgba(255,255,255,.97);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border:1px solid #dfe7ef;border-radius:18px;box-shadow:0 12px 34px rgba(16,42,67,.22);padding:11px 13px;cursor:pointer;font-family:inherit;direction:inherit;text-align:start}' +
      '#ctoast .av{flex:0 0 40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#1d5f8a,#3ea3dc);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:17px}' +
      '#ctoast .tx{flex:1;min-width:0}#ctoast .nm{font-weight:800;font-size:14px;color:#14324a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#ctoast .gp{font-weight:600;color:#6b7c8c;font-size:12px}' +
      '#ctoast .bd{font-size:13px;color:#33475b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}' +
      '#ctoast .x{flex:0 0 28px;height:28px;border-radius:50%;border:0;background:#eef3f8;color:#5b6b7b;font-size:13px;cursor:pointer}' +
      '#cnask{position:fixed;bottom:18px;inset-inline-start:18px;z-index:2147483000;max-width:min(460px,calc(100vw - 36px));background:#fff;border:1px solid #dfe7ef;border-radius:16px;box-shadow:0 12px 34px rgba(16,42,67,.2);padding:12px 14px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:13.5px;color:#14324a}#cnask span{flex:1 1 220px}#cnask button{border:1px solid #d6dde3;background:#fff;border-radius:99px;padding:6px 14px;font:inherit;font-weight:700;cursor:pointer}#cnask .y{background:#1d5f8a;border-color:#1d5f8a;color:#fff}';
    document.head.appendChild(s);
  }
  function pop(m) {
    css();
    var el = document.getElementById('ctoast'); if (!el) { el = document.createElement('div'); el.id = 'ctoast'; document.body.appendChild(el); }
    var nm = m.name || (ar() ? 'رسالة جديدة' : 'New message');
    el.innerHTML = '<div class="ct" role="status"><div class="av">' + esc((nm.trim()[0] || '💬')) + '</div><div class="tx"><div class="nm">' + esc(nm) + (m.grp ? ' <span class="gp">· ' + esc(m.grp) + '</span>' : '') + '</div><div class="bd">' + esc(m.body || (ar() ? '📎 مرفق' : '📎 Attachment')) + (m.more > 1 ? ' <b style="color:#1d5f8a">(+' + (m.more - 1) + ')</b>' : '') + '</div></div><button class="x" aria-label="close">✕</button></div>';
    var t, y0 = null;
    var hide = function () { clearTimeout(t); el.classList.remove('on'); setTimeout(function () { showing = 0; next(); }, 350); };
    el.querySelector('.x').onclick = function (e) { e.stopPropagation(); hide(); };
    el.querySelector('.ct').onclick = function () { location.href = 'chat.html?o=' + encodeURIComponent(m.key); };
    el.ontouchstart = function (e) { y0 = e.touches[0].clientY; };
    el.ontouchmove = function (e) { if (y0 != null && e.touches[0].clientY - y0 < -25) { y0 = null; hide(); } };
    showing = 1; requestAnimationFrame(function () { el.classList.add('on'); });
    t = setTimeout(hide, 4500);
  }
  function next() { if (!showing && Q.length) pop(Q.shift()); }
  function name(id) {
    if (NAMES[id]) return Promise.resolve(NAMES[id]);
    return sb.from('profiles').select('full_name').eq('id', id).maybeSingle().then(function (r) { return (NAMES[id] = (r && r.data && r.data.full_name) || ''); }, function () { return ''; });
  }
  function chn(id) {
    if (CHN[id] !== undefined) return Promise.resolve(CHN[id]);
    return sb.from('chat_channels').select('name,pcode,kind').eq('id', id).maybeSingle().then(function (r) { var d = r && r.data; return (CHN[id] = d ? (d.name || d.pcode || '') : ''); }, function () { return ''; });
  }
  function chatOpen() { var p = document.getElementById('cpan'); return !!(p && p.classList.contains('on')); }
  function check() {
    if (busy || !ME) return; busy = 1;
    sb.rpc('chat_unread').then(function (u) {
      busy = 0; if (!u || u.error) return;
      var cur = {}; (u.data || []).forEach(function (x) { var k = x.channel_id ? 'ch:' + x.channel_id : 'dm:' + x.from_user; cur[k] = (cur[k] || 0) + (+x.n || 0); });
      var first = BASE === null, prev = BASE || {}; BASE = cur;
      if (first || !on() || chatOpen()) return;
      Object.keys(cur).forEach(function (k) {
        var d = cur[k] - (prev[k] || 0); if (d <= 0) return;
        var dm = k.indexOf('dm:') === 0, id = k.slice(3);
        var q = sb.from('chat_messages').select('from_user,body,created_at').order('created_at', { ascending: false }).limit(1);
        q = dm ? q.eq('from_user', id).eq('to_user', ME).is('channel_id', null) : q.eq('channel_id', id).neq('from_user', ME);
        q.then(function (r) {
          var m = r && r.data && r.data[0]; var who = m ? m.from_user : (dm ? id : null);
          Promise.all([who ? name(who) : '', dm ? '' : chn(id)]).then(function (a) {
            var it = { key: k, name: a[0], grp: a[1], body: m ? String(m.body || '').replace(/\s+/g, ' ').slice(0, 120) : '', more: d };
            ding();
            if (document.visibilityState !== 'visible') { sysNote(it); return; }
            Q.push(it); next();
          });
        });
      });
    }, function () { busy = 0; });
  }
  function rt() {
    try {
      if (!sb.channel) return;
      sb.channel('ido-chat', { config: { broadcast: { self: false } } })
        .on('broadcast', { event: 'msg' }, function (e) { var p = e && e.payload; if (!p || p.u === ME) return; if (p.to && p.to !== ME) return; setTimeout(check, 900); })
        .subscribe();
    } catch (e) {}
  }
  var n = 0;
  (function w() {
    if (typeof sb === 'undefined' || !sb || !sb.auth) { if (n++ < 40) setTimeout(w, 500); return; }
    sb.auth.getSession().then(function (g) {
      var s = g && g.data && g.data.session; if (!s) return; ME = s.user.id;
      return sb.rpc('chat_on').then(function (r) { if (!(r && r.data === true)) return; check(); rt(); setInterval(check, 15000); setTimeout(askNotif, 4000); document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') check(); }); });
    }).catch(function () {});
  })();
})();

/* اتجاه الفترات الزمنية في الواجهة العربية: البداية يمينًا ثم السهم نحو النهاية دائمًا */
(function () {
  try {
    var s = document.createElement('style'); s.id = 'drfix';
    s.textContent = 'html[dir=rtl] .dr{direction:rtl!important}html[dir=rtl] .dr i{display:inline-block;transform:scaleX(-1)}';
    (document.head || document.documentElement).appendChild(s);
  } catch (e) {}
})();

/* إيقاف التواصل من الإعدادات: يختفي من كل مكان (الأزرار والقوائم والروابط والنافذة العائمة) */
(function () {
  try {
    var s = document.createElement('style'); s.id = 'chatoffcss';
    s.textContent = 'html.chat-off a[href^="chat.html"],html.chat-off a[href^="./chat.html"],html.chat-off #chb,html.chat-off #cfab,html.chat-off #cpan,html.chat-off #ctoast,html.chat-off [data-act="go:chat.html"],html.chat-off .chat-only{display:none!important}';
    (document.head || document.documentElement).appendChild(s);
  } catch (e) {}
  function apply(off) { document.documentElement.classList.toggle('chat-off', !!off); try { localStorage.setItem('chatOff', off ? '1' : ''); } catch (e) {} }
  try { if (localStorage.getItem('chatOff') === '1') apply(true); } catch (e) {}
  var n = 0;
  (function w() {
    if (typeof sb === 'undefined' || !sb || !sb.rpc) { if (n++ < 40) setTimeout(w, 500); return; }
    sb.rpc('chat_on').then(function (r) { if (r && !r.error) apply(r.data !== true); }, function () {});
  })();
})();

/* فتح نموذج الإنشاء مباشرة عند القدوم من «إنشاء جديد» (?new=1) */
(function () {
  try {
    if (!/[?&]new=1\b/.test(location.search)) return;
    var clean = function () { try { var u = new URL(location.href); u.searchParams.delete('new'); history.replaceState(null, '', u.pathname + (u.search || '') + u.hash); } catch (e) {} };
    var t0 = Date.now(), iv = setInterval(function () {
      var b = [].slice.call(document.querySelectorAll('[onclick="newCR()"],[data-new-btn]')).filter(function (x) { return x.offsetParent !== null && !x.disabled; })[0] || null, ready = false;
      try { ready = typeof me !== 'undefined' && me && me.id && typeof sb !== 'undefined' && sb; } catch (e) { ready = false; }
      if (b && ready) { clearInterval(iv); clean(); setTimeout(function () { b.click(); }, 150); return; }
      if (Date.now() - t0 > 20000) { clearInterval(iv); clean(); }
    }, 250);
  } catch (e) {}
})();
/* smart KPI / risk updates in My tasks (feature u_tasks) */
(function(){if(window.top!==window.self||document.querySelector('script[src^="upd.js"]'))return;var s=document.createElement('script');s.src='upd.js?v=5';s.defer=true;document.head.appendChild(s)})();
/* keep horizontal tab and chip rows where the user left them when a page redraws */
(function(){if(window.__hsk)return;window.__hsk=1;var M={};
function key(e){var p=[],n=e;for(var i=0;i<3&&n&&n!==document.body;i++){p.push(n.tagName+'.'+(typeof n.className=='string'?n.className.replace(/\s*\b(on|p|active|sel)\b/g,''):'')+(n.id?'#'+n.id:''));n=n.parentElement}return p.join('<')}
document.addEventListener('scroll',function(e){var t=e.target;if(t&&t.nodeType===1&&t.scrollWidth>t.clientWidth+2&&!t.__hr)M[key(t)]=t.scrollLeft},true);
var q=0;function fix(){q=0;var ks=Object.keys(M);if(!ks.length)return;var els=document.querySelectorAll('.tabs,.chips,.seg,.sb,.wk,.hubn,#pftabs,[class*="tab"],[class*="chips"],[class*="seg"],[style*="overflow-x"],[style*="overflow:auto"]');
 for(var i=0;i<els.length;i++){var e=els[i];if(e.scrollWidth<=e.clientWidth+2)continue;var k=key(e);if(!(k in M)||e.__hk)continue;e.__hk=1;if(Math.abs(e.scrollLeft-M[k])>1){e.__hr=1;e.scrollLeft=M[k];(function(x){setTimeout(function(){x.__hr=0},60)})(e)}}}
new MutationObserver(function(){if(!q){q=1;requestAnimationFrame(fix)}}).observe(document.documentElement,{childList:true,subtree:true})})();
/* iPhone zooms the whole page in when a field under 16px gets focus and stays zoomed, which pushes the page sideways and hides the bottom bar: keep fields at 16px on phones and stop that zoom */
(function(){var st=document.createElement('style');st.textContent='@media (max-width:820px){input:not([type=checkbox]):not([type=radio]):not([type=range]),select,textarea{font-size:16px!important}}html{-webkit-text-size-adjust:100%;text-size-adjust:100%}';(document.head||document.documentElement).appendChild(st);
 try{var m=document.querySelector('meta[name=viewport]');if(m&&!/maximum-scale/.test(m.content))m.content=m.content+',maximum-scale=1'}catch(_){}})();

/* ===== IDOTabs: تحويل أقسام صفحة طويلة إلى تبويبات ===== */
(function(){
  var css=document.createElement('style');css.textContent='.idotabs{position:sticky;top:var(--itop,58px);z-index:19;display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:6px 2px 8px;margin:0 0 8px;background:var(--bg,#f4f2ec)}.idotabs::-webkit-scrollbar{display:none}.idotabs button{flex:none;border:1px solid #dcd6c8;background:#fff;border-radius:99px;padding:6px 14px;font:inherit;font-size:13.5px;font-weight:700;cursor:pointer;color:#3b3f44}.idotabs button.on{background:#0a6b3d;border-color:#0a6b3d;color:#fff}.idotabs button i{font-style:normal;font-weight:400;opacity:.7;margin-inline-start:4px}.itab-off{display:none!important}html.embed .idotabs{top:0}';
  (document.head||document.documentElement).appendChild(css);
  function txt(el){var h=el.querySelector&&el.querySelector('h2,h3,h4,summary');return ((h||el).textContent||'').replace(/\s+/g,' ').trim()}
  function T(o){
    var host=typeof o.host=='string'?document.querySelector(o.host):o.host;if(!host)return null;
    var cur=null;try{cur=localStorage.getItem('itab_'+o.key)}catch(e){}
    var hk=(location.hash.match(/(?:^#|&)tab=([\w-]+)/)||[])[1];if(hk)cur=hk;
    if(!o.tabs.some(function(t){return t[0]==cur}))cur=o.tabs[0][0];
    var bar=document.createElement('div');bar.className='idotabs';bar.setAttribute('role','tablist');
    bar.innerHTML=o.tabs.map(function(t){return '<button type="button" role="tab" data-k="'+t[0]+'">'+t[1]+'<i></i></button>'}).join('');
    var busy=false;
    function items(){return [].slice.call(host.querySelectorAll(o.items)).filter(function(e){return e!==bar&&!bar.contains(e)})}
    function apply(){if(busy)return;busy=true;try{
      if(!bar.isConnected){if(o.mount)o.mount(bar,host);else host.insertBefore(bar,host.firstChild)}
      var q=o.query?o.query():'';var prev=o.tabs[0][0],cnt={};
      items().forEach(function(el){var k=el.getAttribute('data-itab');
        if(!k){k='';if(o.always&&o.always(el))k='*';else{var t=txt(el);for(var i=0;i<o.tabs.length;i++){var r=o.tabs[i][2];if(r&&(typeof r=='function'?r(el,t):r.test(t))){k=o.tabs[i][0];break}}if(!k)k=prev}el.setAttribute('data-itab',k)}
        if(k!='*'){prev=k;if(el.style.display!='none')cnt[k]=(cnt[k]||0)+1}
        el.classList.toggle('itab-off',!q&&k!='*'&&k!=cur)});
      [].forEach.call(bar.children,function(b){b.classList.toggle('on',!q&&b.getAttribute('data-k')==cur);var i=b.querySelector('i');if(i&&o.count)i.textContent=cnt[b.getAttribute('data-k')]||''});
      bar.style.display=o.hide&&o.hide()?'none':'';
    }finally{setTimeout(function(){busy=false},0)}}
    bar.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;cur=b.getAttribute('data-k');try{localStorage.setItem('itab_'+o.key,cur)}catch(x){}apply();if(o.onTab)o.onTab(cur);var y=bar.getBoundingClientRect().top+window.scrollY-70;if(window.scrollY>y)window.scrollTo(0,Math.max(0,y));try{var B=b.getBoundingClientRect(),R=bar.getBoundingClientRect();if(B.left<R.left||B.right>R.right)bar.scrollLeft+=(B.left+B.width/2)-(R.left+R.width/2)}catch(x){}});
    var tm=null;new MutationObserver(function(){if(busy)return;clearTimeout(tm);tm=setTimeout(apply,30)}).observe(o.watch?document.querySelector(o.watch)||host:host,{childList:true,subtree:!!o.deep});
    apply();
    return {go:function(k){cur=k;try{localStorage.setItem('itab_'+o.key,k)}catch(x){}apply()},apply:apply,cur:function(){return cur},of:function(el){return el.getAttribute('data-itab')}};
  }
  window.IDOTabs=T;
})();
