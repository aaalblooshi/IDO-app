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
    + '.acw .acl{max-height:70vh;overflow-y:auto;overscroll-behavior:contain;padding:2px}'
    + '.acw .acf{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:thin;padding-bottom:2px}.acw .acf button{flex:none;white-space:nowrap}.acw .acr{cursor:pointer;width:100%;text-align:start;font:inherit}'
    + '.acov{position:fixed;inset:0;z-index:9000;background:rgba(15,30,45,.38);display:flex;align-items:flex-end;justify-content:center}'
    + '.acsh{background:#fff;width:100%;max-width:560px;max-height:88vh;overflow-y:auto;border-radius:20px 20px 0 0;box-shadow:0 -10px 30px rgba(0,0,0,.18);padding:0 16px 16px;animation:acUp .2s ease-out}'
    + '@keyframes acUp{from{transform:translateY(24px);opacity:.6}to{transform:none;opacity:1}}'
    + '@media(min-width:900px){.acov{justify-content:flex-end;align-items:stretch}.acsh{max-width:460px;max-height:100vh;height:100%;border-radius:0;border-start-start-radius:20px;border-end-start-radius:20px}}'
    + '.acsh .ach{position:sticky;top:0;background:#fff;padding:14px 0 10px;border-bottom:1px solid #e8eef3;margin-bottom:10px;display:flex;gap:10px;align-items:flex-start;z-index:2}'
    + '.acsh .ach h3{margin:4px 0 0;font-size:16.5px;line-height:1.6;overflow-wrap:anywhere}.acsh .acx{width:36px;height:36px;border-radius:50%!important;padding:0!important;flex:none}'
    + '.acsh .acpj{display:inline-flex;align-items:center;gap:6px;font-weight:800;color:#fff;background:var(--pc);border-radius:99px;padding:3px 12px;font-size:13px;max-width:100%}'
    + '.acsh .kvx{display:grid;grid-template-columns:120px minmax(0,1fr);gap:0;border:1px solid #e6ecf1;border-radius:12px;overflow:hidden;margin:0 0 12px}.acsh .kvx>div{padding:8px 10px;border-top:1px solid #eef2f6;font-size:13.5px;overflow-wrap:anywhere}.acsh .kvx>div:nth-child(-n+2){border-top:0}.acsh .kvx>div:nth-child(odd){background:#f7f9fb;color:#5b6570;font-weight:700}'
    + '.acsh table{width:100%;border-collapse:collapse;font-size:13.5px;margin:0 0 12px}.acsh th,.acsh td{border:1px solid #e6ecf1;padding:7px 8px;text-align:start;vertical-align:top;overflow-wrap:anywhere}.acsh th{background:#f1f5f8;font-size:12.5px}.acsh td.o{color:#8a5a00;background:#fffaf0}.acsh td.n{color:#0a6b3d;background:#f3faf5;font-weight:700}'
    + '.acsh .acq{white-space:pre-wrap;background:#f7f9fb;border-inline-start:4px solid var(--pc);border-radius:10px;padding:10px 12px;margin:0 0 12px;font-size:14px;line-height:1.7}'
    + '.acsh .acli{margin:0 0 12px;padding:0;list-style:none}.acsh .acli li{border-bottom:1px dashed #e6ecf1;padding:6px 0;font-size:14px}'
    + '.acsh .acpa{display:flex;flex-direction:column;align-items:flex-start;gap:2px;width:100%;text-align:start;background:#eef6fb!important;border:1px solid #cfe2f1!important;color:#1d5f8a!important;font-weight:800;border-radius:12px!important;padding:10px 12px!important;margin:4px 0 12px}.acsh .acpa small{font-weight:500;color:#5b6570;font-size:12px}.acw .acfb{display:flex;align-items:center;gap:8px;flex-wrap:wrap;background:#eef6fb;border:1px solid #cfe2f1;border-radius:12px;padding:8px 12px;margin:0 0 8px;font-size:13.5px}.acw .acfb b{color:#1d5f8a}'
    + '.acsh h4{margin:12px 0 6px;font-size:14px}.acsh .acb{display:flex;flex-wrap:wrap;gap:8px;position:sticky;bottom:-16px;background:#fff;padding:10px 0 4px;border-top:1px solid #eef2f6}';
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
    if (s.fp) h += '<div class="acfb">' + T('تعرض أنشطة مشروع', 'Showing activities of') + ' <b>' + E(prj[s.fp] || s.fp) + '</b> ' + T('فقط', 'only') + '<button class="lnk" style="background:none!important;border:0!important;color:#1d5f8a;font-weight:800;padding:0!important;margin-inline-start:auto" onclick="IDOACT._fp(\'' + id + '\',\'\')">' + T('إظهار كل المشاريع', 'Show all projects') + '</button></div>';
    if (nNew) h += '<div class="row" style="margin:0 0 6px;align-items:center;gap:8px"><span class="mut" style="font-size:13px">' + T(nNew + ' جديدة منذ آخر زيارة', nNew + ' new since your last visit') + '</span><button class="lnk" style="background:none!important;border:0!important;color:#1d5f8a;font-weight:700;padding:0!important" onclick="IDOACT._seen(\'' + id + '\')">' + T('تعليمها كمقروءة', 'Mark as read') + '</button></div>';
    if (s.busy && !s.rows) h += '<div class="mut">…</div>';
    else if (s.err) h += '<div class="card mut">' + T('تعذّر تحميل النشاط: ', 'Could not load activity: ') + E(s.err) + '</div>';
    else if (!rows.length) h += '<div class="card mut">' + T('لا يوجد نشاط في هذه الفترة.', 'No activity in this period.') + '</div>';
    else {
      h += '<div class="acl">'; var last = '';
      rows.slice(0, 400).forEach(function (x) {
        var d = DD(x.at); if (d != last) { h += '<div class="acd">' + dayLab(d) + '</div>'; last = d; }
        var col = pcol(x.pcode);
        h += '<button type="button" class="acr' + (new Date(x.at).getTime() > sn ? ' nw' : '') + '" style="--pc:' + col + '" onclick="IDOACT._open(\'' + id + '\',' + x.id + ')"><span class="aci" aria-hidden="true">' + (ICO[x.area] || '•') + '</span><div style="min-width:0">'
          + (x.pcode ? '<div class="acp" title="' + E(x.pcode) + '"><i></i><span>' + E(x.pname || x.pcode) + '</span></div>' : '')
          + '<div class="act">' + E(ar ? x.ar : (x.en || x.ar)) + '</div><div class="acm">' + E(x.actor_name || '') + ' · <span class="num">' + TM(x.at) + '</span></div></div></button>';
      });
      h += '</div>';
      if (rows.length > 400) h += '<div class="mut" style="margin-top:6px">' + T('يُعرض أحدث ٤٠٠. ضيّق الفترة أو استخدم التصفية.', 'Showing the latest 400. Narrow the period or filter.') + '</div>';
    }
    el.innerHTML = h + '</div>';
  }

  var FL = { pc: ['نسبة الإنجاز', 'Progress'], as: ['البدء الفعلي', 'Actual start'], ae: ['الانتهاء الفعلي', 'Actual finish'], w: ['المكلّف', 'Assignee'], s: ['البداية المخططة', 'Planned start'], e: ['النهاية المخططة', 'Planned end'], n: ['المهمة', 'Task'],
    actual: ['القراءة', 'Reading'], target: ['المستهدف', 'Target'], period: ['الفترة', 'Period'], appr: ['معتمدة', 'Approved'], note: ['الملاحظة', 'Note'], evidence: ['الدليل', 'Evidence'], ev_name: ['ملف الدليل', 'Evidence file'], num: ['البسط', 'Numerator'], den: ['المقام', 'Denominator'], corr: ['الإجراء التصحيحي', 'Corrective action'], by_user: ['أدخلها', 'Entered by'],
    name: ['الاسم', 'Name'], baseline: ['خط الأساس', 'Baseline'], unit: ['الوحدة', 'Unit'], direction: ['الاتجاه', 'Direction'], freq: ['دورية القياس', 'Frequency'], owner_id: ['المسؤول', 'Owner'], active: ['مفعّل', 'Active'], weight: ['الوزن', 'Weight'], start_on: ['بداية القياس', 'Measured from'], end_on: ['نهاية القياس', 'Until'], calc: ['طريقة الحساب', 'Calculation'], descr: ['الوصف', 'Description'], category: ['الفئة', 'Category'], source: ['مصدر البيانات', 'Source'], factor: ['المعامل', 'Factor'], agg: ['التجميع', 'Aggregation'], thr_g: ['حد الأخضر', 'Green threshold'], thr_a: ['حد الأصفر', 'Amber threshold'], goal: ['الهدف', 'Goal'], ev_req: ['الدليل إلزامي', 'Evidence required'], ev_hint: ['وصف الدليل', 'Evidence hint'], num_label: ['اسم البسط', 'Numerator label'], den_label: ['اسم المقام', 'Denominator label'],
    title: ['العنوان', 'Title'], prob: ['الاحتمال', 'Probability'], impact: ['الأثر', 'Impact'], status: ['الحالة', 'Status'], response: ['الاستجابة', 'Response'], owner_name: ['المسؤول', 'Owner'], review_at: ['موعد المراجعة', 'Review date'], cause: ['السبب', 'Cause'], effect: ['الأثر المتوقع', 'Effect'], plan: ['خطة المعالجة', 'Plan'], trigger: ['مؤشر الوقوع', 'Trigger'],
    approved: ['الموازنة المعتمدة', 'Approved budget'], mode: ['طريقة الصرف', 'Mode'], use_charter: ['موازنة الميثاق', 'Charter budget'], amount: ['المبلغ', 'Amount'], kind: ['النوع', 'Kind'], d: ['التاريخ', 'Date'], item: ['البند', 'Item'], ref: ['المرجع', 'Reference'],
    actions: ['إجراءات المعالجة', 'Actions'], cost: ['التكلفة المتوقعة', 'Expected cost'], days: ['التأخير المتوقع (أيام)', 'Expected delay (days)'], issue: ['المشكلة', 'Issue'], user_id: ['المستخدم', 'User'], targets: ['يحدد المستهدفات', 'Sets targets'], op: ['نوع الطلب', 'Request type'], data: ['البيانات', 'Data'], decision_note: ['سبب القرار', 'Decision note'] };
  var TBL = { kpi_values: ['قراءة مؤشر', 'KPI reading'], project_kpis: ['تعريف مؤشر', 'KPI definition'], project_risks: ['خطر', 'Risk'], risk_ext: ['معالجة خطر', 'Risk treatment'], risk_changes: ['طلب في سجل المخاطر', 'Risk request'], project_budget: ['الموازنة', 'Budget'], project_spend: ['مصروف', 'Spending'], kpi_access: ['صلاحية المؤشرات', 'KPI access'], risk_access: ['صلاحية المخاطر', 'Risk access'], fin_delegates: ['صلاحية المصروفات', 'Spending access'], task: ['مهمة', 'Task'], tasks: ['مهام محذوفة', 'Removed tasks'], dates: ['مواعيد المهام', 'Task dates'], charters: ['ميثاق', 'Charter'], plans: ['خطة', 'Plan'], change_requests: ['طلب تغيير', 'Change request'], closure_reports: ['تقرير ختامي', 'Closure report'], att: ['مرفق', 'Attachment'], comment: ['تعليق', 'Comment'], risk_log: ['متابعة خطر', 'Risk follow-up'], report_notes: ['ملاحظات التقرير الدوري', 'Report notes'] };
  var OPN = { add: ['إضافة', 'Added'], insert: ['إضافة', 'Added'], upd: ['تعديل', 'Edited'], update: ['تعديل', 'Edited'], del: ['حذف', 'Deleted'], delete: ['حذف', 'Deleted'] };
  var STV = { open: 'مفتوح', closed: 'مغلق', occurred: 'وقع', monitor: 'تحت المراقبة', actual: 'مصروف فعلي', commit: 'التزام', up: 'الأعلى أفضل', down: 'الأقل أفضل', monthly: 'شهري', quarterly: 'ربع سنوي', semiannual: 'نصف سنوي', annual: 'سنوي', once: 'مرة واحدة', ratio: 'نسبة', num: 'رقم', pct: 'نسبة مئوية' };
  function fv(k, v) {
    if (v == null || v === '') return '—'; v = String(v);
    var m = /^(\d{4})-(\d{2})-(\d{2})(T(\d{2}):(\d{2}))?/.exec(v); if (m) return m[3] + '/' + m[2] + '/' + m[1] + (m[4] ? ' ' + m[5] + ':' + m[6] : '');
    if (k == 'pc' && /^[\d.]+$/.test(v)) return Math.round(+v) + '%';
    if (/^-?\d+(\.\d+)?$/.test(v) && Math.abs(+v) >= 1000) return Number(v).toLocaleString('en-US', { maximumFractionDigits: 2 });
    if (AR() && STV[v]) return STV[v];
    return v;
  }
  function fsz(b) { b = +b || 0; return b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : b > 1024 ? Math.round(b / 1024) + ' KB' : b + ' B'; }
  function close() { var o = document.getElementById('acov'); if (o) o.remove(); document.removeEventListener('keydown', esc); }
  function esc(e) { if (e.key == 'Escape') close(); }
  /* o: {title, pname, pcode, area, icon, kv:[[l,v]], chg:[{k,o,n,t}], text, lines:[], link, linkLabel, onProject} */
  function sheet(o) {
    css(); close(); var ar = AR(), col = pcol(o.pcode), h = '';
    h += '<div class="acsh" role="dialog" aria-modal="true" style="--pc:' + col + '"><div class="ach"><div style="flex:1;min-width:0">' + (o.pname ? '<span class="acpj" title="' + E(o.pcode || '') + '">' + E(o.pname) + '</span>' : '') + '<h3>' + (o.icon ? o.icon + ' ' : '') + E(o.title) + '</h3></div><button class="acx" onclick="IDOACT.close()" aria-label="' + T('إغلاق', 'Close') + '">✕</button></div>';
    if (o.kv && o.kv.length) h += '<div class="kvx">' + o.kv.filter(function (r) { return r[1] != null && r[1] !== ''; }).map(function (r) { return '<div>' + E(r[0]) + '</div><div>' + (r[2] ? r[1] : E(r[1])) + '</div>'; }).join('') + '</div>';
    if (o.chg && o.chg.length) {
      var hasO = o.chg.some(function (c) { return c.o != null && c.o !== ''; }), hasN = o.chg.some(function (c) { return c.n != null && c.n !== ''; });
      h += '<h4>' + T('التفاصيل', 'Details') + '</h4><table><thead><tr><th>' + T('الحقل', 'Field') + '</th>' + (hasO ? '<th>' + T('قبل', 'Before') + '</th>' : '') + (hasN ? '<th>' + T('بعد', 'After') + '</th>' : '') + '</tr></thead><tbody>'
        + o.chg.map(function (c) { var l = c.k == 'range' ? (c.t || '') : (FL[c.k] ? (ar ? FL[c.k][0] : FL[c.k][1]) : c.k); return '<tr><td>' + E(l) + '</td>' + (hasO ? '<td class="o">' + E(c.k == 'range' ? fvR(c.o) : fv(c.k, c.o)) + '</td>' : '') + (hasN ? '<td class="n">' + E(c.k == 'range' ? fvR(c.n) : fv(c.k, c.n)) + '</td>' : '') + '</tr>'; }).join('') + '</tbody></table>';
    }
    if (o.text) h += '<h4>' + T('النص', 'Text') + '</h4><div class="acq">' + E(o.text) + '</div>';
    if (o.lines && o.lines.length) h += '<h4>' + T('التحديثات', 'Updates') + ' (' + o.lines.length + ')</h4><ul class="acli">' + o.lines.map(function (l) { return '<li>' + E(l) + '</li>'; }).join('') + '</ul>';
    if (o.pcode && o.onProject) h += '<button type="button" class="acpa" onclick="' + o.onProject + '">📋 ' + T('عرض كل أنشطة هذا المشروع', 'Show all activities of this project') + '<small>' + T('تُغلق هذه النافذة وتُصفّى القائمة على «' + E(o.pname || o.pcode) + '» فقط', 'Closes this panel and filters the list to this project') + '</small></button>';
    h += '<div class="acb">' + (o.link ? '<a href="' + E(o.link) + '"><button class="p">' + E(o.linkLabel || T('فتح في صفحته', 'Open its page')) + '</button></a>' : '') + '<button onclick="IDOACT.close()">' + T('إغلاق', 'Close') + '</button></div></div>';
    var ov = document.createElement('div'); ov.id = 'acov'; ov.className = 'acov'; ov.onclick = function (e) { if (e.target === ov) close(); }; ov.innerHTML = h; document.body.appendChild(ov); document.addEventListener('keydown', esc);
    try { ov.querySelector('.acx').focus({ preventScroll: true }); } catch (e) {}
  }
  function fvR(v) { if (!v) return '—'; return String(v).split(' – ').map(function (p) { return fv('', p); }).join(' – '); }
  function full(iso) { var d = new Date(iso); return d.toLocaleDateString('en-GB', { timeZone: 'Asia/Dubai' }) + ' ' + TM(iso); }
  function openRow(id, rid) {
    var s = ST[id], x = (s.rows || []).find(function (r) { return r.id == rid; }); if (!x) return;
    var m = x.meta || {}, ar = AR(), tb = TBL[m.tbl] || null, a = AREAS.find(function (z) { return z[0] == x.area; }) || ['', '', '', '•'];
    var kv = [[T('المشروع', 'Project'), x.pname || x.pcode || '—'], [T('رقم المشروع', 'Project code'), x.pcode ? '<span dir="ltr">' + E(x.pcode) + '</span>' : '', 1], [T('النوع', 'Type'), (ar ? a[1] : a[2]) + (tb ? ' — ' + (ar ? tb[0] : tb[1]) : '')], [T('الإجراء', 'Action'), OPN[x.op] ? (ar ? OPN[x.op][0] : OPN[x.op][1]) : x.op], [T('البند', 'Item'), m.item || x.item || ''],
      [T('بواسطة', 'By'), x.actor_name || ''], [T('التاريخ والوقت', 'Date & time'), full(x.at)]];
    if (m.tbl == 'task' && (m.s || m.e)) kv.push([T('الفترة المخططة', 'Planned period'), fv('', m.s) + ' – ' + fv('', m.e)]);
    if (m.where) kv.push([T('المكان', 'Where'), m.where]);
    if (m.file) kv.push([T('الملف', 'File'), (m.file.name || '') + (m.file.size ? ' · ' + fsz(m.file.size) : '')]);
    sheet({ title: ar ? x.ar : (x.en || x.ar), pname: x.pname, pcode: x.pcode, icon: a[3], kv: kv, chg: m.chg || [], text: m.text, link: x.link, onProject: (s.pc ? '' : "IDOACT.close();IDOACT._fp('" + id + "','" + String(x.pcode || '').replace(/'/g, '') + "')") });
  }
  window.IDOACT = {
    mount: function (el, o) {
      css(); o = o || {}; if (!el.id) el.id = 'acw' + (++N);
      ST[el.id] = { pc: o.pc || null, days: o.days || 30, area: '', fp: o.fp || '', q: '', rows: null, seen: seen() };
      load(el.id);
    },
    _area: function (id, a) { ST[id].area = a; draw(id); },
    _fp: function (id, v) { if (!ST[id]) return; ST[id].fp = v; ST[id].area = ''; draw(id); var el = document.getElementById(id); if (el && v) try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {} },
    _q: function (id, v) { ST[id].q = v; clearTimeout(ST[id].t); ST[id].t = setTimeout(function () { var el = document.getElementById(id), f = el && document.activeElement && el.contains(document.activeElement) ? document.activeElement : null, p = f ? f.selectionStart : 0; draw(id); if (f) { var n = document.getElementById(id).querySelectorAll('input[type=search]')[0]; if (n) { n.focus(); try { n.setSelectionRange(p, p); } catch (e) {} } } }, 200); },
    _days: function (id, v) { ST[id].days = +v || 30; load(id); },
    _open: openRow, sheet: sheet, close: close, pcol: pcol,
    _seen: function (id) { try { localStorage.setItem(seenKey(), String(Date.now())); } catch (e) {} ST[id].seen = Date.now(); draw(id); }
  };
})();
