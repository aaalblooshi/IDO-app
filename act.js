/* act.js — سجل نشاط المشاريع: كل تغيير بسطر واضح مع اسم المشروع. IDOACT.mount(el, {pc}) */
(function () {
  if (window.IDOACT) return;
  var AR = function () { return (document.documentElement.lang || 'ar') != 'en'; };
  var T = function (a, e) { return AR() ? a : e; };
  var E = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var SB = function () { try { return Function('return typeof sb!="undefined"?sb:null')() || window.sb; } catch (e) { return window.sb; } };
  var AREAS = [['', 'الكل', 'All', ''], ['task', 'المهام', 'Tasks', '✅'], ['kpi', 'المؤشرات', 'KPIs', '📈'], ['risk', 'المخاطر', 'Risks', '🛡️'], ['budget', 'الموازنة', 'Budget', '💰'], ['spend', 'المصروفات', 'Spending', '🧾'], ['att', 'المرفقات', 'Files', '📎'], ['comment', 'التعليقات', 'Comments', '💬'], ['doc', 'الوثائق', 'Documents', '📄'], ['access', 'الصلاحيات', 'Access', '🔑']];
  var ICO = {}; AREAS.forEach(function (a) { ICO[a[0]] = a[3]; });
  var PCOL = ['#1d5f8a', '#8a4fbf', '#c27a0e', '#0a7d6a', '#c2410c', '#2b8fc9', '#6b7a1f', '#b0306a'];
  function pcol(pc) { var h = 0; String(pc || '').split('').forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) >>> 0; }); return PCOL[h % PCOL.length]; }
  var DD = function (iso) { return new Date(iso).toLocaleDateString('en-CA', { timeZone: 'Asia/Dubai' }); };
  var TM = function (iso) { return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dubai' }); };
  function dayLab(d) {
    var td = DD(new Date().toISOString()), y = DD(new Date(Date.now() - 864e5).toISOString());
    if (d == td) return T('اليوم', 'Today'); if (d == y) return T('أمس', 'Yesterday');
    var p = d.split('-'); return p[2] + '/' + p[1] + '/' + p[0];
  }
  var nrm = function (s) { return String(s || '').toLowerCase().replace(/[ً-ٰٟـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه'); };
  var CSS = '.acw .acf{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 8px}.acw .acf button{padding:4px 12px!important;border-radius:99px!important;font-size:13px!important;min-height:0!important;background:#fff!important;border:1px solid #dfe6ec!important;color:#2d3742!important}.acw .acf button.on{background:#1d5f8a!important;border-color:#1d5f8a!important;color:#fff!important}'
    + '.acw .acs{display:grid;grid-template-columns:1fr auto;gap:8px;margin:0 0 8px}.acw .acs select,.acw .acs input{margin:0;width:100%;min-width:0;box-sizing:border-box}'
    + '.acw .acd{font-weight:800;color:#5b6570;font-size:13px;margin:12px 2px 6px}'
    + '.acw .acr{display:grid;grid-template-columns:34px minmax(0,1fr);gap:10px;align-items:start;background:#fff;border:1px solid #e6ecf1;border-inline-start:4px solid var(--pc);border-radius:12px;padding:9px 12px;margin:0 0 6px;text-decoration:none;color:inherit}'
    + '.acw .acr.nw{background:#f3f9fd}.acw .acr:hover{box-shadow:0 3px 12px rgba(30,60,90,.08)}'
    + '.acw .aci{width:34px;height:34px;border-radius:10px;background:#f1f5f8;display:grid;place-items:center;font-size:16px}'
    + '.acw .acp{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:800;color:var(--pc);max-width:100%}.acw .acp i{width:8px;height:8px;border-radius:50%;background:var(--pc);flex:none}.acw .acp span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
    + '.acw .act{font-size:14px;line-height:1.6;overflow-wrap:anywhere;margin-top:1px}.acw .acm{font-size:12px;color:#6b7280;margin-top:2px}'
    + '.acw .acl{max-height:70vh;overflow-y:auto;overscroll-behavior:contain;padding:2px}';
  function css() { if (document.getElementById('acw-css')) return; var s = document.createElement('style'); s.id = 'acw-css'; s.textContent = CSS; document.head.appendChild(s); }
  var ST = {}, N = 0;
  function seenKey() { return 'act_seen'; }
  function seen() { try { return +localStorage.getItem(seenKey()) || 0; } catch (e) { return 0; } }
  async function load(id) {
    var s = ST[id], c = SB(); if (!c) return;
    s.busy = true; draw(id);
    var r = await c.rpc('act_feed', { p_pcode: s.pc || null, p_area: null, p_days: s.days, p_limit: 800 });
    s.busy = false; s.err = r.error ? (r.error.message || String(r.error)) : null; s.rows = r.data || []; draw(id);
  }
  function draw(id) {
    var s = ST[id], el = document.getElementById(id); if (!el) return;
    var ar = AR(), sn = s.seen;
    var rows = (s.rows || []).filter(function (x) { return (!s.area || x.area == s.area) && (!s.fp || x.pcode == s.fp); });
    if (s.q) { var q = nrm(s.q).split(/\s+/).filter(Boolean); rows = rows.filter(function (x) { var h = nrm([x.pname, x.ar, x.actor_name, x.item].join(' ')); return q.every(function (w) { return h.indexOf(w) >= 0; }); }); }
    var cnt = {}; (s.rows || []).forEach(function (x) { if (!s.fp || x.pcode == s.fp) cnt[x.area] = (cnt[x.area] || 0) + 1; });
    var prj = {}; (s.rows || []).forEach(function (x) { if (x.pcode) prj[x.pcode] = x.pname || x.pcode; });
    var nNew = (s.rows || []).filter(function (x) { return new Date(x.at).getTime() > sn; }).length;
    var h = '<div class="acw">';
    h += '<div class="acs">' + (s.pc ? '<input type="search" placeholder="' + T('ابحث في النشاط…', 'Search activity…') + '" value="' + E(s.q || '') + '" oninput="IDOACT._q(\'' + id + '\',this.value)">'
      : '<select onchange="IDOACT._fp(\'' + id + '\',this.value)"><option value="">' + T('كل المشاريع', 'All projects') + ' (' + Object.keys(prj).length + ')</option>' + Object.keys(prj).sort(function (a, b) { return String(prj[a]).localeCompare(String(prj[b]), 'ar'); }).map(function (k) { return '<option value="' + E(k) + '"' + (s.fp == k ? ' selected' : '') + '>' + E(prj[k]) + '</option>'; }).join('') + '</select>')
      + '<select onchange="IDOACT._days(\'' + id + '\',this.value)">' + [[1, 'اليوم', 'Today'], [7, 'آخر ٧ أيام', 'Last 7 days'], [30, 'آخر ٣٠ يومًا', 'Last 30 days'], [90, 'آخر ٣ أشهر', 'Last 3 months'], [365, 'آخر سنة', 'Last year']].map(function (o) { return '<option value="' + o[0] + '"' + (s.days == o[0] ? ' selected' : '') + '>' + (ar ? o[1] : o[2]) + '</option>'; }).join('') + '</select></div>';
    if (!s.pc) h += '<div class="acs" style="grid-template-columns:1fr"><input type="search" placeholder="' + T('ابحث باسم مهمة أو مؤشر أو شخص…', 'Search by task, KPI or person…') + '" value="' + E(s.q || '') + '" oninput="IDOACT._q(\'' + id + '\',this.value)"></div>';
    h += '<div class="acf">' + AREAS.filter(function (a) { return !a[0] || cnt[a[0]]; }).map(function (a) { return '<button class="' + ((s.area || '') == a[0] ? 'on' : '') + '" onclick="IDOACT._area(\'' + id + '\',\'' + a[0] + '\')">' + (a[3] ? a[3] + ' ' : '') + (ar ? a[1] : a[2]) + (a[0] ? ' <span class="num">' + cnt[a[0]] + '</span>' : '') + '</button>'; }).join('') + '</div>';
    if (nNew) h += '<div class="row" style="margin:0 0 6px;align-items:center;gap:8px"><span class="mut" style="font-size:13px">' + T(nNew + ' جديدة منذ آخر زيارة', nNew + ' new since your last visit') + '</span><button class="lnk" style="background:none!important;border:0!important;color:#1d5f8a;font-weight:700;padding:0!important" onclick="IDOACT._seen(\'' + id + '\')">' + T('تعليمها كمقروءة', 'Mark as read') + '</button></div>';
    if (s.busy && !s.rows) h += '<div class="mut">…</div>';
    else if (s.err) h += '<div class="card mut">' + T('تعذّر تحميل النشاط: ', 'Could not load activity: ') + E(s.err) + '</div>';
    else if (!rows.length) h += '<div class="card mut">' + T('لا يوجد نشاط في هذه الفترة.', 'No activity in this period.') + '</div>';
    else {
      h += '<div class="acl">'; var last = '';
      rows.slice(0, 400).forEach(function (x) {
        var d = DD(x.at); if (d != last) { h += '<div class="acd">' + dayLab(d) + '</div>'; last = d; }
        var col = pcol(x.pcode);
        h += '<a class="acr' + (new Date(x.at).getTime() > sn ? ' nw' : '') + '" style="--pc:' + col + '" href="' + E(x.link || ('myprojects.html?pc=' + encodeURIComponent(x.pcode || ''))) + '"><span class="aci" aria-hidden="true">' + (ICO[x.area] || '•') + '</span><div style="min-width:0">'
          + (x.pcode ? '<div class="acp" title="' + E(x.pcode) + '"><i></i><span>' + E(x.pname || x.pcode) + '</span></div>' : '')
          + '<div class="act">' + E(ar ? x.ar : (x.en || x.ar)) + '</div><div class="acm">' + E(x.actor_name || '') + ' · <span class="num">' + TM(x.at) + '</span></div></div></a>';
      });
      h += '</div>';
      if (rows.length > 400) h += '<div class="mut" style="margin-top:6px">' + T('يُعرض أحدث ٤٠٠. ضيّق الفترة أو استخدم التصفية.', 'Showing the latest 400. Narrow the period or filter.') + '</div>';
    }
    el.innerHTML = h + '</div>';
  }
  window.IDOACT = {
    mount: function (el, o) {
      css(); o = o || {}; if (!el.id) el.id = 'acw' + (++N);
      ST[el.id] = { pc: o.pc || null, days: o.days || 30, area: '', fp: '', q: '', rows: null, seen: seen() };
      load(el.id);
    },
    _area: function (id, a) { ST[id].area = a; draw(id); },
    _fp: function (id, v) { ST[id].fp = v; draw(id); },
    _q: function (id, v) { ST[id].q = v; clearTimeout(ST[id].t); ST[id].t = setTimeout(function () { var el = document.getElementById(id), f = el && document.activeElement && el.contains(document.activeElement) ? document.activeElement : null, p = f ? f.selectionStart : 0; draw(id); if (f) { var n = document.getElementById(id).querySelectorAll('input[type=search]')[0]; if (n) { n.focus(); try { n.setSelectionRange(p, p); } catch (e) {} } } }, 200); },
    _days: function (id, v) { ST[id].days = +v || 30; load(id); },
    _seen: function (id) { try { localStorage.setItem(seenKey(), String(Date.now())); } catch (e) {} ST[id].seen = Date.now(); draw(id); }
  };
})();
