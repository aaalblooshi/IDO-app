/* hub.js v3 — شريط تنقّل واحد لكل صفحات المشروع:
   داخل مشروع: المشروع · الميثاق · الخطة · المؤشرات · المخاطر · الموازنة · طلبات التغيير · التقرير الختامي · التواصل | كل المشاريع
   خارج مشروع: مشاريعي · مؤشرات المشاريع · المخاطر · الموازنات · المحفظة */
(function () {
  if (window.top !== window.self || window.__hub) return; window.__hub = 1;
  var f = (location.pathname.split('/').pop() || '').replace('.html', '');
  var DOC = { charter: 'charters', plan: 'plans', cr: 'change_requests', closure: 'closure_reports' };
  var isDoc = !!DOC[f];
  var q = new URLSearchParams(location.search), PC = isDoc ? '' : (q.get('pc') || '');
  var ar = function () { return (document.documentElement.lang || 'ar') == 'ar'; };
  var G = function (n) { try { return Function('try{return typeof ' + n + '!="undefined"?' + n + ':null}catch(e){return null}')(); } catch (e) { return null; } };
  var st = document.createElement('style');
  st.textContent = '.hubn{max-width:1100px;margin:10px auto 0;width:calc(100% - 28px);box-sizing:border-box;display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:2px;-webkit-overflow-scrolling:touch}.hubn::-webkit-scrollbar{display:none}.hubn a{flex:none;display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:99px;border:1px solid #dcd6c8;background:#fff;color:#23272b;font-weight:700;font-size:13.5px;text-decoration:none;white-space:nowrap}.hubn a.on{background:#1d5f8a;border-color:#1d5f8a;color:#fff}.hubn a:hover{border-color:#1d5f8a}.hubn a.ld{opacity:.55}.hubn .hp{background:#f3efe4;border-color:#e6dcc4;font-weight:800;color:#6b4e0f;max-width:240px;overflow:hidden;text-overflow:ellipsis}.hubn i{width:1px;background:#dcd6c8;flex:none;margin:4px 2px}body.hubrec .rtabs{display:none!important}@media print{.hubn{display:none}}';
  document.head.appendChild(st);
  function curPc() {
    if (!isDoc) return PC;
    var r = G('cr'); if (!r || !r.id) return '';
    var v = G('curView'), nm = v && v.name;
    if (nm && /^(homeView|listView|adminView|pickView|loginView|start)$/.test(nm)) return '';
    var d = r.data || {}; return String(d.pcode || r.code || '').trim();
  }
  var NAMES = {};
  function L(pc) {
    var A = ar();
    if (pc) {
      var e = encodeURIComponent(pc), nm = NAMES[pc];
      return [
        ['hp', '📁 ' + (nm || ((A ? 'المشروع' : 'Project') + ' · ' + pc)), 'myprojects.html?pc=' + e, 'myprojects'],
        ['', '📄 ' + (A ? 'الميثاق' : 'Charter'), '#', 'charter', 'doc'],
        ['', '🗓 ' + (A ? 'الخطة' : 'Plan'), '#', 'plan', 'doc'],
        ['', '📈 ' + (A ? 'المؤشرات' : 'KPIs'), 'kpis.html?pc=' + e, 'kpis'],
        ['', '🛡️ ' + (A ? 'المخاطر' : 'Risks'), 'risks.html?pc=' + e, 'risks'],
        ['', '💰 ' + (A ? 'الموازنة' : 'Budget'), 'budget.html?pc=' + e, 'budget'],
        ['', '🔁 ' + (A ? 'طلبات التغيير' : 'Change requests'), '#', 'cr', 'doc'],
        ['', '🏁 ' + (A ? 'التقرير الختامي' : 'Closure'), '#', 'closure', 'doc'],
        ['', '💬 ' + (A ? 'التواصل' : 'Chat'), 'chat.html?p=' + e, 'chat'],
        ['sep'],
        ['', '↩ ' + (A ? 'كل المشاريع' : 'All projects'), isDoc ? f + '.html' : (f == 'myprojects' ? 'myprojects.html' : f + '.html'), 'all']
      ];
    }
    return [['', '🗃 ' + (A ? 'مشاريعي' : 'My projects'), 'myprojects.html', 'myprojects'], ['', '📈 ' + (A ? 'مؤشرات المشاريع' : 'Project KPIs'), 'kpis.html', 'kpis'], ['', '🛡️ ' + (A ? 'مخاطر المشاريع' : 'Project risks'), 'risks.html', 'risks'], ['', '💰 ' + (A ? 'الموازنات' : 'Budgets'), 'budget.html', 'budget'], ['', '📊 ' + (A ? 'المحفظة' : 'Portfolio'), 'portfolio.html', 'portfolio']];
  }
  async function resolve(k, pc) {
    var sb = G('sb'); if (!sb) return null;
    var t = DOC[k], rows = [];
    try { var r = await sb.from(t).select('id,status,archived').or('code.eq.' + pc + ',data->>pcode.eq.' + pc).order('id', { ascending: false }).limit(30); if (r.error) throw r.error; rows = r.data || []; }
    catch (x) { try { var r2 = await sb.from(t).select('id,status,archived').eq('data->>pcode', pc).order('id', { ascending: false }).limit(30); rows = (r2 && r2.data) || []; } catch (y) { rows = []; } }
    var live = rows.filter(function (x) { return !x.archived && x.status != 'Deleted'; });
    if (k == 'cr') { var o = live.find(function (x) { return !/Approved|Rejected|Cancelled/.test(x.status); }); var c = o || live[0] || rows[0]; return c ? 'cr.html#o=' + c.id : null; }
    var a = live.find(function (x) { return x.status == 'Approved'; }) || live[0] || rows[0];
    return a ? k + '.html#o=' + a.id : null;
  }
  function say(m) { try { if (window.toast) return window.toast(m); } catch (e) { } var d = document.createElement('div'); d.textContent = m; d.style.cssText = 'position:fixed;inset-inline:14px;top:14px;z-index:400;background:#14324a;color:#fff;padding:11px 14px;border-radius:12px;text-align:center;font-weight:700'; document.body.appendChild(d); setTimeout(function () { d.remove(); }, 3000); }
  async function nameOf(pc) {
    if (NAMES[pc] !== undefined) return; NAMES[pc] = '';
    var sb = G('sb'); if (!sb) return;
    try { var r = await sb.from('charters').select('id,data').eq('code', pc).order('id', { ascending: false }).limit(1); var x = r && r.data && r.data[0]; if (x && x.data && x.data.pname) { NAMES[pc] = x.data.pname; build(true); } } catch (e) { }
  }
  var LAST = null;
  function host() { return document.querySelector('main') || document.getElementById('app'); }
  function build(force) {
    var m = host(); if (!m) return;
    var pc = curPc(), key = pc + '|' + ar();
    var h = document.getElementById('hubn');
    if (isDoc && !pc) { if (h) h.style.display = 'none'; document.body.classList.remove('hubrec'); LAST = key; return; }
    if (!h) { h = document.createElement('nav'); h.id = 'hubn'; h.className = 'hubn'; h.setAttribute('aria-label', ar() ? 'أجزاء المشروع' : 'Project sections'); h.addEventListener('click', onClick); }
    if (h.nextSibling !== m) m.parentNode.insertBefore(h, m);
    h.style.display = '';
    document.body.classList.toggle('hubrec', isDoc && !!pc);
    if (key === LAST && !force && h.childNodes.length) return; LAST = key;
    h.innerHTML = L(pc).map(function (x) {
      if (x[0] == 'sep') return '<i></i>';
      var on = x[3] == f && !(x[3] == 'myprojects' && pc && location.hash == '#plan');
      return '<a class="' + (x[0] == 'hp' ? 'hp ' : '') + (on ? 'on' : '') + '" href="' + x[2] + '"' + (x[4] ? ' data-doc="' + x[3] + '"' : '') + '>' + x[1] + '</a>';
    }).join('');
    h.__sc = 0; var o = h.querySelector('.on');
    if (o) { try { var hr = h.getBoundingClientRect(), or = o.getBoundingClientRect(); if (or.left < hr.left || or.right > hr.right) h.scrollLeft += (or.left + or.width / 2) - (hr.left + hr.width / 2); } catch (_) { } }
    if (pc) nameOf(pc);
  }
  async function onClick(ev) {
    var a = ev.target.closest && ev.target.closest('a[data-doc]'); if (!a) return;
    ev.preventDefault(); var k = a.getAttribute('data-doc'), pc = curPc(); if (!pc) return;
    if (k == f && isDoc) { var cur = G('cr'); if (cur && cur.id) { location.hash = ''; } return; }
    a.classList.add('ld');
    var u = await resolve(k, pc); a.classList.remove('ld');
    if (!u) return say(ar() ? 'لا يوجد ' + a.textContent.replace(/^\S+\s/, '') + ' لهذا المشروع بعد.' : 'Nothing yet for this project.');
    location.href = u;
  }
  window.IDOHUB = { refresh: function () { build(true); } };
  document.addEventListener('DOMContentLoaded', function () { setTimeout(build, 0); }); window.addEventListener('load', function () { build(); });
  if (document.readyState != 'loading') setTimeout(build, 0);
  setInterval(build, 700);
  var LG = document.documentElement.lang;
  new MutationObserver(function () { var l = document.documentElement.lang; if (l === LG) return; LG = l; build(true); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
