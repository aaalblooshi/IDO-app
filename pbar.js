/* شريط المشروع: تنقّل بين أجزاء نفس المشروع بضغطة — window.IDOPB */
(function () {
  var A = function () { try { return (localStorage.getItem('lang') || 'ar') != 'en'; } catch (e) { return true; } };
  var G = function (n) { try { return Function('try{return typeof ' + n + '!="undefined"?' + n + ':null}catch(e){return null}')(); } catch (e) { return null; } };
  var HERE = (location.pathname.split('/').pop() || '').replace('.html', '');
  var ST = { pc: '', name: '', mode: '' };
  var IT = [
    ['charter', '📜', 'الميثاق', 'Charter'],
    ['plan', '🗓', 'الخطة', 'Plan'],
    ['myprojects', '🧰', 'مساحة المشروع', 'Workspace'],
    ['kpis', '📈', 'المؤشرات', 'KPIs'],
    ['risks', '🛡', 'المخاطر', 'Risks'],
    ['budget', '💰', 'الموازنة', 'Budget'],
    ['cr', '🔁', 'طلبات التغيير', 'Change requests'],
    ['closure', '🏁', 'التقرير الختامي', 'Closure'],
    ['chat', '💬', 'التواصل', 'Chat']
  ];
  var TBL = { charter: 'charters', plan: 'plans', cr: 'change_requests', closure: 'closure_reports' };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function css() {
    if (document.getElementById('idopbcss')) return;
    var s = document.createElement('style'); s.id = 'idopbcss';
    s.textContent = '#idopb{display:flex;align-items:center;gap:6px;overflow-x:auto;scrollbar-width:none;padding:6px 10px;margin:0 auto 8px;max-width:1200px;background:#fff;border:1px solid #e4dfd4;border-radius:14px;box-sizing:border-box}#idopb::-webkit-scrollbar{display:none}#idopb .idopn{flex:none;font-weight:800;font-size:13px;color:#14324a;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-inline-end:6px;border-inline-end:1px solid #e4dfd4}#idopb a{flex:none;display:inline-flex;gap:4px;align-items:center;text-decoration:none;color:#3b3f44;font-size:13px;font-weight:700;padding:5px 11px;border-radius:99px;border:1px solid transparent;white-space:nowrap}#idopb a:hover{background:#f3f1eb}#idopb a.on{background:#0a6b3d;color:#fff}#idopb a.ld{opacity:.5}@media print{#idopb{display:none}}html.embed #idopb{display:none}';
    (document.head || document.documentElement).appendChild(s);
  }
  function active() {
    if (ST.mode == 'rec') { var r = G('cr'); return !!(r && r.id); }
    return !!ST.pc;
  }
  function bar() {
    var b = document.getElementById('idopb');
    if (!b) { b = document.createElement('nav'); b.id = 'idopb'; b.setAttribute('aria-label', A() ? 'أجزاء المشروع' : 'Project sections'); b.addEventListener('click', onClick); }
    var app = document.getElementById('app') || document.querySelector('main');
    if (app && b.parentNode !== app.parentNode) app.parentNode.insertBefore(b, app);
    return b;
  }
  function draw() {
    if (!ST.pc) { var o = document.getElementById('idopb'); if (o) o.style.display = 'none'; return; }
    css(); var b = bar(); var a = A();
    b.innerHTML = '<span class="idopn" title="' + esc(ST.name || ST.pc) + '">' + esc(ST.name || ST.pc) + '</span>' + IT.map(function (x) {
      return '<a href="#" data-go="' + x[0] + '" class="' + (x[0] == HERE ? 'on' : '') + '">' + x[1] + ' ' + (a ? x[2] : x[3]) + '</a>';
    }).join('');
    b.style.display = active() ? '' : 'none';
  }
  function toast(m) { try { if (window.toast) return window.toast(m); } catch (e) { } alert(m); }
  async function resolve(k) {
    var pc = ST.pc, e = encodeURIComponent(pc);
    if (k == 'kpis' || k == 'risks' || k == 'budget') return k + '.html?pc=' + e;
    if (k == 'myprojects') return 'myprojects.html?pc=' + e;
    if (k == 'chat') return 'chat.html?p=' + e;
    var sb = G('sb'); if (!sb) return null;
    var t = TBL[k], q, rows = [];
    try { q = await sb.from(t).select('id,status').or('code.eq.' + pc + ',data->>pcode.eq.' + pc).order('id', { ascending: false }).limit(20); if (q.error) throw q.error; rows = q.data || []; }
    catch (x) { try { q = await sb.from(t).select('id,status').eq('data->>pcode', pc).order('id', { ascending: false }).limit(20); rows = (q && q.data) || []; } catch (y) { rows = []; } }
    rows = rows.filter(function (r) { return r.status != 'Deleted'; });
    var r = rows.find(function (r) { return r.status == 'Approved'; }) || rows[0];
    return r ? k + '.html#o=' + r.id : null;
  }
  async function onClick(ev) {
    var a = ev.target.closest && ev.target.closest('a[data-go]'); if (!a) return;
    ev.preventDefault(); var k = a.getAttribute('data-go'); if (k == HERE && ST.mode != 'rec') return;
    a.classList.add('ld');
    try {
      var u = await resolve(k);
      if (!u) { a.classList.remove('ld'); return toast(A() ? 'لا يوجد ' + a.textContent.replace(/^\S+\s/, '') + ' لهذا المشروع بعد' : 'Nothing here yet for this project'); }
      location.href = u;
    } catch (e) { a.classList.remove('ld'); }
  }
  async function nameOf(pc) {
    var sb = G('sb'); if (!sb || !pc) return '';
    try { var q = await sb.from('charters').select('data->>pname').or('code.eq.' + pc + ',data->>pcode.eq.' + pc).order('id', { ascending: false }).limit(1); var r = q && q.data && q.data[0]; return r ? (r.pname || '') : ''; } catch (e) { return ''; }
  }
  window.IDOPB = {
    set: function (pc, name, mode) { pc = String(pc || '').trim(); var ch = pc != ST.pc; ST.pc = pc; ST.mode = mode || ''; if (name) ST.name = name; else if (ch) ST.name = ''; draw(); if (pc && !ST.name) nameOf(pc).then(function (n) { if (n && ST.pc == pc) { ST.name = n; draw(); } }); },
    fromRec: function (r) { if (!r) return; var d = r.data || {}; this.set(d.pcode || r.code || '', d.pname || d.name || r.title || '', 'rec'); }
  };
  function auto() {
    if (TBL[HERE]) { var r = G('cr'); if (r && r.id) { var d = r.data || {}, rp = d.pcode || r.code || ''; if (rp && (rp != ST.pc || ST.mode != 'rec')) window.IDOPB.fromRec(r); } }
    var pc = '';
    try { pc = new URLSearchParams(location.search).get('pc') || ''; } catch (e) { }
    var live = G('PC'); if (typeof live == 'string' && live) pc = live;
    if (!TBL[HERE] && pc && pc != ST.pc && ST.mode != 'rec') window.IDOPB.set(pc, '', '');
    var b = document.getElementById('idopb'); if (b && ST.pc) { var on = active(); if ((b.style.display == 'none') == on) b.style.display = on ? '' : 'none'; if (on && !b.isConnected) draw(); }
  }
  setInterval(auto, 900); setTimeout(auto, 300);
})();
