/* xlmore.js — امتدادات Excel: الملف الشامل للمشروع، ملف المكتب الشهري، ميثاق المسودة، ملف المستخدمين.
   يعتمد على xlupd.js (IDOXL._h). نفس الحماية: ملف موسوم، صاحب الملف فقط، عمر محدود، معاينة قبل التطبيق،
   كشف التعارض لكل صف، فحص الصلاحية على الخادم، سجل تدقيق. */
(function () {
  function H() { return window.IDOXL && IDOXL._h; }
  var X = {};
  /* ---------- أدوات عامة ---------- */
  function sheetSpec(o) { return o; }
  /* spec: {title, keys, head:{k:[ar,en]}, hidden:{}, edit:{}, dates:{}, widths:{}, dv:{k:fn(row)->dv}, rows:[{v:{}, can:bool}], note:fn(row)} */
  async function buildBook(specs, kind, scope, M, stamp, fn, guide) {
    var h = H(), T = h.T, A = h.A;
    try { await h.loadExcelJS(); } catch (e) { throw new Error(T('تعذّر تحميل أداة Excel. تحقق من الاتصال وحاول مرة أخرى.', 'Could not load the Excel tool.')); }
    var wb = new ExcelJS.Workbook(); wb.creator = 'IDO'; wb.created = new Date();
    var lists = null;
    specs.forEach(function (sp) {
      var ws = wb.addWorksheet(sp.title, { views: [{ rightToLeft: A(), state: 'frozen', ySplit: 2 }] });
      ws.columns = sp.keys.map(function (k) { return { key: k, width: sp.hidden[k] ? 4 : ((sp.widths || {})[k] || 16), hidden: !!sp.hidden[k] }; });
      ws.addRow(sp.keys).hidden = true;
      var hr = ws.addRow(sp.keys.map(function (k) { return sp.hidden[k] ? k : (A() ? sp.head[k][0] : sp.head[k][1]); }));
      hr.font = { bold: true, color: { argb: 'FFFFFFFF' } }; hr.height = 30; hr.alignment = { vertical: 'middle', wrapText: true };
      hr.eachCell(function (c, i) { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: sp.edit[sp.keys[i - 1]] ? 'FF0A6B3D' : 'FF1D5F8A' } }; });
      (sp.rows || []).forEach(function (r) {
        var row = ws.addRow(sp.keys.map(function (k) { var v = r.v[k]; return (sp.dates || {})[k] ? (h.d2x(v) || null) : (v == null ? '' : v); }));
        row.eachCell({ includeEmpty: true }, function (c, i) {
          var k = sp.keys[i - 1];
          if ((sp.dates || {})[k]) c.numFmt = 'yyyy-mm-dd';
          var ed = sp.edit[k] && r.can !== false && !(sp.lock && sp.lock(r, k));
          if (ed) { c.protection = { locked: false }; c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF8DC' } }; var d = sp.dv && sp.dv[k] && sp.dv[k](r); if (d) c.dataValidation = d; }
          else if (sp.edit[k]) c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFEFEF' } };
          c.alignment = { wrapText: true, vertical: 'top' };
        });
      });
      if (sp.blank) { for (var b = 0; b < sp.blank; b++) { var br = ws.addRow(sp.keys.map(function () { return ''; })); br.eachCell({ includeEmpty: true }, function (c, i) { var k = sp.keys[i - 1]; if (sp.edit[k]) { c.protection = { locked: false }; c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF8DC' } }; var d = sp.dv && sp.dv[k] && sp.dv[k]({ v: {}, blank: 1 }); if (d) c.dataValidation = d; } if ((sp.dates || {})[k]) c.numFmt = 'yyyy-mm-dd'; }); } }
      ws.protect('ido-' + Math.random().toString(36).slice(2, 8), { selectLockedCells: true, selectUnlockedCells: true, formatColumns: true, formatRows: true, insertRows: false, deleteRows: false, insertColumns: false, deleteColumns: false });
      if (sp.lists) { lists = lists || wb.addWorksheet('_lists'); lists.state = 'veryHidden'; sp.lists.forEach(function (L, j) { L.forEach(function (x, i) { lists.getCell(i + 1, j + 1).value = x; }); }); }
    });
    var info = wb.addWorksheet(T('تعليمات', 'Instructions'), { views: [{ rightToLeft: A() }] }); info.getColumn(1).width = 110;
    [T('🔒 سري — خاص بـ ', '🔒 Confidential — for ') + (M.full_name || '') + T(' — نُزّل في ', ' — downloaded ') + stamp.slice(0, 16).replace('T', ' ')].concat(guide || []).concat([T('عدّل الخانات الصفراء فقط (الأعمدة الخضراء ✏️). الملف صالح ', 'Edit yellow cells only. Valid for ') + ((h.on && IDOXL._h && (window.__xlMax || 7))) + T(' أيام ويقبله النظام من صاحبه فقط، وتظهر معاينة قبل أي تطبيق.', ' days, owner only, with a preview before applying.')]).forEach(function (l, i) { var c = info.getCell(i + 1, 1); c.value = l; c.alignment = { wrapText: true }; if (!i) c.font = { bold: true, color: { argb: 'FFB3261E' } }; });
    var mt = wb.addWorksheet('_meta'); mt.state = 'veryHidden'; [[h.MARK], [kind], [scope || ''], [M.id], [stamp], [h.VER], [M.full_name || '']].forEach(function (r) { mt.addRow(r); });
    var buf = await wb.xlsx.writeBuffer();
    h.save(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), fn);
  }
  async function readBook(f) {
    var h = H(), T = h.T;
    if (f.size > 8 * 1048576) throw new Error(T('الملف أكبر من 8 ميغابايت.', 'File larger than 8 MB.'));
    if (!/\.xlsx$/i.test(f.name)) throw new Error(T('ارفع ملف ‎.xlsx‎ الذي نزّلته من النظام.', 'Upload the .xlsx file from the system.'));
    var out = { meta: null, sheets: {}, list: [], utc: true };
    try {
      await h.loadExcelJS(); var wb = new ExcelJS.Workbook(); await wb.xlsx.load(await f.arrayBuffer());
      var mt = wb.getWorksheet('_meta'); if (mt) { out.meta = []; mt.eachRow({ includeEmpty: true }, function (r, i) { out.meta[i - 1] = h.cellText(r.getCell(1).value); }); }
      wb.worksheets.forEach(function (ws) { if (ws.name == '_meta' || ws.name == '_lists') return; var k = h.cellText(ws.getRow(1).getCell(1).value); if (!k) return; var aoa = [], w = ws.getRow(1).cellCount; ws.eachRow({ includeEmpty: true }, function (r, i) { var a = []; for (var c = 1; c <= w; c++) { var v = r.getCell(c).value; a.push(v instanceof Date ? v : (v && typeof v == 'object' ? h.cellText(v) : v)); } aoa[i - 1] = a; }); out.sheets[k] = aoa; out.list.push(aoa); });
    } catch (e) {
      await h.loadXLSX(); out.utc = false; var wb2 = XLSX.read(await f.arrayBuffer(), { type: 'array', cellDates: true });
      if (wb2.Sheets._meta) out.meta = XLSX.utils.sheet_to_json(wb2.Sheets._meta, { header: 1, raw: true, defval: '' }).map(function (r) { return String(r[0] == null ? '' : r[0]); });
      wb2.SheetNames.forEach(function (n) { if (n == '_meta' || n == '_lists') return; var a = XLSX.utils.sheet_to_json(wb2.Sheets[n], { header: 1, raw: true, defval: '' }); if (a[0] && a[0][0]) { out.sheets[String(a[0][0])] = a; out.list.push(a); } });
    }
    return out;
  }
  function checkMeta(meta, kind, scope, M) {
    var h = H(), T = h.T;
    if (!meta || meta[0] != h.MARK) return T('هذا ليس ملفًا من النظام. نزّل الملف من زره ثم عدّله وارفعه.', 'Not a file from the system.');
    if (meta[1] != kind) return T('هذا الملف من نوع آخر. ارفعه من الزر الخاص به.', 'This file is of another kind; upload it from its own button.');
    if (scope != null && meta[2] != scope) return T('هذا الملف لمشروع أو فترة أخرى (', 'This file is for another project/period (') + meta[2] + ').';
    if (meta[5] != h.VER) return T('إصدار الملف قديم. نزّل ملفًا جديدًا.', 'Old file version.');
    if (meta[3] != M.id) return T('هذا الملف نزّله ', 'This file was downloaded by ') + (meta[6] || T('شخص آخر', 'someone else')) + T('. يقبل النظام الملف من صاحبه فقط.', '. Only its owner can upload it.');
    var mx = (window.__xlMax || 7), age = (Date.now() - Date.parse(meta[4])) / 864e5;
    if (!(age >= -1) || age > mx) return T('عمر الملف ', 'The file is ') + Math.floor(age) + T(' يومًا، والحد ', ' days old; limit ') + mx + T(' أيام. نزّل ملفًا جديدًا.', ' days.');
    return '';
  }
  function idx(aoa) { var o = {}; (aoa && aoa[0] || []).forEach(function (k, i) { o[String(k == null ? '' : k).trim()] = i; }); return o; }
  function num(v) { if (v == null || String(v).trim() === '') return null; var s = String(v).replace(/[٠-٩]/g, function (c) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(c); }).replace(/[,٬\s]/g, '').replace('٫', '.'); var n = Number(s); return isFinite(n) ? n : NaN; }
  function txt(v) { return H().cellText(v).trim(); }
  async function gate(k) { var h = H(); var c = await h.cfg(); window.__xlMax = +c.maxage || 7; if (c[k] === false) { h.fail(h.T('هذه الخاصية موقوفة من الإعدادات.', 'This feature is turned off in settings.')); return null; } var M = await h.me(); if (!M) { h.fail(h.T('سجّل الدخول أولًا.', 'Sign in first.')); return null; } return M; }

  /* =====================================================================
     1) الملف الشامل للمشروع: المهام + قراءات المؤشرات + المخاطر
     ===================================================================== */
  function perOf(freq) { var t = H().today(), y = t.slice(0, 4), m = +t.slice(5, 7); if (freq == 'monthly') return t.slice(0, 7); if (freq == 'quarterly') return y + '-Q' + (Math.floor((m - 1) / 3) + 1); if (freq == 'semiannual') return y + '-H' + (m <= 6 ? 1 : 2); if (freq == 'annual') return y; if (freq == 'once') return 'final'; return t.slice(0, 7); }
  function prevPer(f, p) { if (!p || p == 'final') return null; var y = +p.slice(0, 4), m;
    if (f == 'monthly') { m = +p.slice(5, 7) - 1; if (!m) { m = 12; y--; } return y + '-' + String(m).padStart(2, '0'); }
    if (f == 'quarterly') { m = +p.slice(6) - 1; if (!m) { m = 4; y--; } return y + '-Q' + m; }
    if (f == 'semiannual') { m = +p.slice(6) - 1; if (!m) { m = 2; y--; } return y + '-H' + m; }
    if (f == 'annual') return String(y - 1); return null; }
  async function feats() { if (!window.IDOFEAT) { await new Promise(function (ok) { var sc = document.createElement('script'); sc.src = 'feat.js?v=2'; sc.onload = ok; sc.onerror = ok; document.head.appendChild(sc); }); } try { if (window.IDOFEAT) await IDOFEAT.load(); } catch (e) { } return function (k, pc) { return window.IDOFEAT ? !!IDOFEAT.on(k, pc) : true; }; }
  /* نفس قاعدة صفحة المؤشرات: الإنجاز والحالة */
  function kAch(FO, k, v) { if (!v || v.actual == null) return null; if (v.appr === false && FO('k_appr', k.pcode)) return null; var t = v.target != null ? +v.target : (k.target != null ? +k.target : null), a = +v.actual; if (t == null) return null; if (k.direction == 'down') { if (a <= 0) return t >= 0 ? 100 : null; return Math.max(0, Math.min(200, t / a * 100)); } if (t == 0) return a >= 0 ? 100 : 0; return Math.max(0, Math.min(200, a / t * 100)); }
  function kOff(FO, k, a) { if (a == null) return false; if (k.thr_g != null && FO('k_thr', k.pcode)) { var g = +k.thr_g, y = k.thr_a != null ? +k.thr_a : g - 15; return a < y; } return a < 80; }
  var RST = { open: ['مفتوح', 'Open'], closed: ['مغلق', 'Closed'] };
  X.fullDownload = async function (pc) {
    var h = H(), T = h.T; var M = await gate('full'); if (!M) return; h.busy(T('جارٍ تجهيز الملف الشامل…', 'Preparing the full file…'));
    var sb = h.SB();
    var [tk, ks, rk, kc, rc] = await Promise.all([sb.rpc('xl_tasks', { p_pcode: pc }), sb.from('project_kpis').select('*').eq('pcode', pc).eq('active', true).order('kno'), sb.from('project_risks').select('*').eq('pcode', pc).order('rno'), sb.rpc('kpi_can', { pc: pc }), sb.rpc('risk_can_edit', { pc: pc })]);
    if (tk.error && !/feature off/.test(tk.error.message)) return h.fail(h.errMsg(tk.error));
    var K = (ks && ks.data) || [], R = (rk && rk.data) || [], kcan = !!(kc && kc.data), rcan = !!(rc && rc.data);
    var pers = K.map(function (k) { return perOf(k.freq); }), V = [];
    if (K.length) { var vr = await sb.from('kpi_values').select('*').in('kpi_id', K.map(function (k) { return k.id; })).in('period', pers.filter(function (x, i, a) { return a.indexOf(x) == i; })); V = (vr && vr.data) || []; }
    var specs = [];
    var TR = (tk && tk.data) || [];
    if (TR.length) specs.push({ title: T('المهام', 'Tasks'), keys: h.KEYS, head: h.HEAD, hidden: h.HIDDEN, edit: h.EDIT, dates: { s: 1, e: 1, as: 1, ae: 1 }, widths: { n: 42, pname: 22, par: 20, owner: 18, tn: 34 },
      dv: { npc: function () { return { type: 'list', allowBlank: true, showErrorMessage: true, error: T('اختر من القائمة', 'Pick from the list'), formulae: ['"0,10,20,30,40,50,60,70,80,90,100"'] }; }, as: dvDate, ae: dvDate },
      rows: TR.map(function (x) { return { v: h.rowVals(x), can: x.can }; }) });
    var KK = ['kid', 'per', 'kst', 'oact', 'onum', 'oden', 'onote', 'kname', 'unit', 'kper', 'ktgt', 'act', 'num', 'den', 'knote'];
    if (K.length) specs.push({ title: T('المؤشرات', 'KPIs'), keys: KK, head: { kid: 'kid', per: 'per', kst: 'kst', oact: 'oact', onum: 'onum', oden: 'oden', onote: 'onote', kname: ['المؤشر', 'KPI'], unit: ['الوحدة', 'Unit'], kper: ['الفترة', 'Period'], ktgt: ['المستهدف', 'Target'], act: ['✏️ الفعلي', '✏️ Actual'], num: ['✏️ البسط (للنسب)', '✏️ Numerator'], den: ['✏️ المقام (للنسب)', '✏️ Denominator'], knote: ['✏️ ملاحظة', '✏️ Note'] },
      hidden: { kid: 1, per: 1, kst: 1, oact: 1, onum: 1, oden: 1, onote: 1 }, edit: { act: 1, num: 1, den: 1, knote: 1 }, widths: { kname: 40, knote: 34 },
      lock: function (r, k) { var ratio = r.k.calc == 'ratio'; return (k == 'act' && ratio) || ((k == 'num' || k == 'den') && !ratio); },
      dv: { act: dvNum, num: dvNum, den: dvNum },
      rows: K.map(function (k, i) { var p = pers[i], v = V.find(function (z) { return z.kpi_id == k.id && z.period == p; }) || {}; return { k: k, can: kcan, v: { kid: k.id, per: p, kst: v.at || '', oact: v.actual == null ? '' : v.actual, onum: v.num == null ? '' : v.num, oden: v.den == null ? '' : v.den, onote: v.note || '', kname: k.name, unit: k.unit || '', kper: p == 'final' ? T('نهائي', 'Final') : p, ktgt: v.target != null ? v.target : (k.target == null ? '' : k.target), act: v.actual == null ? '' : v.actual, num: v.num == null ? '' : v.num, den: v.den == null ? '' : v.den, knote: v.note || '' } }; }) });
    var RK = ['rid', 'rno', 'rst', 'oprob', 'oimp', 'ostat', 'oresp', 'odue', 'rtitle', 'rowner', 'prob', 'impact', 'status', 'response', 'due'];
    if (R.length) specs.push({ title: T('المخاطر', 'Risks'), keys: RK, head: { rid: 'rid', rno: 'rno', rst: 'rst', oprob: 'oprob', oimp: 'oimp', ostat: 'ostat', oresp: 'oresp', odue: 'odue', rtitle: ['الخطر', 'Risk'], rowner: ['المسؤول', 'Owner'], prob: ['✏️ الاحتمال (1-5)', '✏️ Probability'], impact: ['✏️ الأثر (1-5)', '✏️ Impact'], status: ['✏️ الحالة', '✏️ Status'], response: ['✏️ إجراء المعالجة', '✏️ Response'], due: ['✏️ موعد المعالجة', '✏️ Due'] },
      hidden: { rid: 1, rno: 1, rst: 1, oprob: 1, oimp: 1, ostat: 1, oresp: 1, odue: 1 }, edit: { prob: 1, impact: 1, status: 1, response: 1, due: 1 }, dates: { due: 1 }, widths: { rtitle: 40, response: 40 },
      dv: { prob: dv15, impact: dv15, status: function () { return { type: 'list', allowBlank: false, showErrorMessage: true, formulae: ['"' + RST.open[h.A() ? 0 : 1] + ',' + RST.closed[h.A() ? 0 : 1] + '"'] }; }, due: function () { return { type: 'date', operator: 'greaterThan', allowBlank: true, showErrorMessage: true, error: T('تاريخ غير صحيح', 'Invalid date'), formulae: [new Date(Date.UTC(2020, 0, 1))] }; } },
      rows: R.map(function (r) { var st = RST[r.status] ? RST[r.status][h.A() ? 0 : 1] : (r.status || ''); return { can: rcan, v: { rid: r.id, rno: r.rno, rst: r.updated_at || '', oprob: r.prob || '', oimp: r.impact || '', ostat: st, oresp: r.response || '', odue: r.due || '', rtitle: r.title || '', rowner: r.owner_name || '', prob: r.prob || '', impact: r.impact || '', status: st, response: r.response || '', due: r.due || '' } }; }) });
    if (!specs.length) return h.fail(T('لا توجد مهام أو مؤشرات أو مخاطر لهذا المشروع بعد.', 'Nothing to export for this project yet.'));
    var stamp = new Date().toISOString();
    try { await buildBook(specs, 'full', pc, M, stamp, T('الملف-الشامل-', 'full-file-') + pc + '-' + h.today() + '.xlsx', [T('الملف الشامل للمشروع ', 'Full project file ') + pc + T(': المهام وقراءات المؤشرات للفترة الحالية والمخاطر.', ': tasks, current KPI readings and risks.'), T('المؤشرات المركّبة (النِّسب): أدخل البسط والمقام ويُحسب الفعلي تلقائيًا.', 'Ratio KPIs: enter numerator and denominator.'), T('تغيير خطر من مستخدم بلا صلاحية مباشرة يذهب «مقترحًا» لاعتماد المسؤول.', 'Risk changes without direct rights become proposals.')]); h.close(); h.done(T('تم تنزيل الملف الشامل', 'Full file downloaded'), T('حدّث الأوراق ثم ارفعه من «⬆ رفع الملف الشامل».', 'Update the sheets, then upload it.')); }
    catch (e) { h.fail(e.message || String(e)); }
  };
  function dvDate() { var h = H(); return { type: 'date', operator: 'between', allowBlank: true, showErrorMessage: true, error: h.T('تاريخ لا يتجاوز اليوم', 'Date not after today'), formulae: [new Date(Date.UTC(2020, 0, 1)), h.d2x(h.today())] }; }
  function dvNum() { return { type: 'decimal', operator: 'between', allowBlank: true, showErrorMessage: true, error: H().T('أدخل رقمًا', 'Enter a number'), formulae: [-1e12, 1e12] }; }
  function dv15() { return { type: 'list', allowBlank: true, showErrorMessage: true, formulae: ['"1,2,3,4,5"'] }; }

  var PF = null;
  X.fullUpload = function (pc, onDone) { var h = H(); h.pick(async function (f) {
    var T = h.T; var M = await gate('full'); if (!M) return; h.busy(T('جارٍ قراءة الملف…', 'Reading…'));
    var B; try { B = await readBook(f); } catch (e) { return h.fail(e.message || T('تعذّر قراءة الملف.', 'Could not read the file.')); }
    var bad = checkMeta(B.meta, 'full', pc, M); if (bad) return h.fail(bad);
    var sb = h.SB(), res = { tasks: [], kpis: [], risks: [] }, payload = { tasks: [], kpis: [], risks: [] };
    /* المهام */
    if (B.sheets.pid) { var pr = IDOXL._parse(B.sheets.pid, B.meta.map(function (x, i) { return i == 1 ? 'mytasks' : x; }), M, B.utc); if (pr.err) return h.fail(pr.err);
      var send = pr.rows.filter(function (x) { return !x._bad; }).map(function (x) { var y = Object.assign({}, x); delete y._row; delete y._bad; return y; });
      if (send.length) { var r = await sb.rpc('xl_tasks_apply', { p_rows: send, p_dry: true, p_file: f.name }); if (r.error) return h.fail(h.errMsg(r.error)); res.tasks = (r.data && r.data.rows) || []; payload.tasks = send.filter(function (x) { return res.tasks.some(function (z) { return z.st == 'change' && z.pid == String(x.pid) && z.tid == x.tid; }); }); }
      pr.rows.filter(function (x) { return x._bad; }).forEach(function (x) { res.tasks.push({ st: 'error', n: (pr.local[x.pid + '|' + x.tid] || {}).n, why: x._bad }); });
      res.tasks.forEach(function (z) { var L = pr.local[z.pid + '|' + z.tid]; if (L) { z.row = L.row; z.n = z.n || L.n; } });
    }
    /* المؤشرات */
    if (B.sheets.kid) { var FO = await feats(); var a = B.sheets.kid, I = idx(a); var ids = [], rows = [];
      for (var i = 2; i < a.length; i++) { var r0 = a[i]; if (!r0 || !r0[I.kid]) continue; rows.push({ i: i + 1, r: r0 }); ids.push(+r0[I.kid]); }
      var KS = ids.length ? (await sb.from('project_kpis').select('*').in('id', ids)).data || [] : [];
      var VS = ids.length ? (await sb.from('kpi_values').select('*').in('kpi_id', ids)).data || [] : [];
      rows.forEach(function (o) { var r0 = o.r, k = KS.find(function (z) { return z.id == +r0[I.kid]; }), per = String(r0[I.per]), nm = txt(r0[I.kname]);
        if (!k || k.pcode != pc) return res.kpis.push({ st: 'error', row: o.i, n: nm, why: T('المؤشر لم يعد موجودًا في المشروع', 'KPI no longer in project') });
        var ratio = k.calc == 'ratio', act = num(r0[I.act]), nu = num(r0[I.num]), de = num(r0[I.den]), note = txt(r0[I.knote]);
        var oact = num(r0[I.oact]), onu = num(r0[I.onum]), ode = num(r0[I.oden]), onote = txt(r0[I.onote]);
        if ([act, nu, de].some(function (z) { return Number.isNaN(z); })) return res.kpis.push({ st: 'error', row: o.i, n: nm, why: T('رقم غير صحيح', 'Invalid number') });
        if (ratio && ((nu == null) != (de == null))) return res.kpis.push({ st: 'error', row: o.i, n: nm, why: T('أدخل البسط والمقام معًا', 'Enter numerator and denominator together') });
        if (ratio && de === 0) return res.kpis.push({ st: 'error', row: o.i, n: nm, why: T('المقام لا يمكن أن يكون صفرًا', 'Denominator cannot be zero') });
        var ch = ratio ? (nu !== onu || de !== ode) : act !== oact; ch = ch || note !== onote; if (!ch) return res.kpis.push({ st: 'same', row: o.i, n: nm });
        var v = VS.find(function (z) { return z.kpi_id == k.id && z.period == per; });
        if (String((v && v.at) || '') != String(r0[I.kst] || '') && !(v == null && !r0[I.kst])) return res.kpis.push({ st: 'conflict', row: o.i, n: nm, why: T('حُدِّثت القراءة في النظام بعد تنزيل الملف', 'Reading changed in the system after download') });
        var A2 = ratio ? (nu != null && de ? Math.round(nu / de * (+k.factor || 100) * 10000) / 10000 : null) : act;
        if (k.ev_req && A2 != null && !(v && (v.evidence || v.ev_path))) return res.kpis.push({ st: 'error', row: o.i, n: nm, why: T('هذا المؤشر يتطلب دليلًا؛ أدخل القراءة من صفحة المؤشرات لإرفاقه', 'Evidence required; enter it from the KPIs page') });
        if (A2 != null && FO('k_corr', k.pcode) && !(v && v.corr)) { var pp = prevPer(k.freq, per), v0 = pp && VS.find(function (z) { return z.kpi_id == k.id && z.period == pp; }), a1 = kAch(FO, k, { actual: A2, target: v ? v.target : null }), a0 = v0 ? kAch(FO, k, v0) : null;
          if (kOff(FO, k, a1) && kOff(FO, k, a0)) return res.kpis.push({ st: 'error', row: o.i, n: nm, why: T('المؤشر سيكون متأخرًا لفترتين متتاليتين، والخطة التصحيحية إلزامية؛ أدخل هذه القراءة من صفحة المؤشرات لكتابتها', 'Red for two periods in a row; a corrective plan is required — enter this reading from the KPIs page') }); }
        if (A2 == null && !note && !v) return res.kpis.push({ st: 'same', row: o.i, n: nm });
        res.kpis.push({ st: 'change', row: o.i, n: nm, d: (per == 'final' ? T('نهائي', 'Final') : per) + ': ' + (v && v.actual != null ? v.actual : '—') + ' ← ' + (A2 == null ? '—' : A2) });
        payload.kpis.push({ id: v && v.id, row: { kpi_id: k.id, period: per, actual: A2, num: ratio ? nu : null, den: ratio ? de : null, note: note || null, by_user: M.id, at: new Date().toISOString() } });
      });
    }
    /* المخاطر */
    if (B.sheets.rid) { var b = B.sheets.rid, J = idx(b), RS = (await sb.from('project_risks').select('*').eq('pcode', pc)).data || [];
      var stOf = function (s) { s = txt(s); for (var k in RST) if (RST[k][0] == s || RST[k][1].toLowerCase() == s.toLowerCase() || k == s) return k; return null; };
      for (var j = 2; j < b.length; j++) { var x = b[j]; if (!x || !x[J.rid]) continue; var rr = RS.find(function (z) { return z.id == +x[J.rid]; }), nm2 = txt(x[J.rtitle]);
        if (!rr) { res.risks.push({ st: 'error', row: j + 1, n: nm2, why: T('الخطر لم يعد موجودًا', 'Risk no longer exists') }); continue; }
        var chg = {}, err = '';
        [['prob', 'oprob'], ['impact', 'oimp']].forEach(function (p) { var nv = num(x[J[p[0]]]), ov = num(x[J[p[1]]]); if (Number.isNaN(nv) || (nv != null && (nv < 1 || nv > 5 || nv % 1))) err = T('الاحتمال والأثر من 1 إلى 5', 'Probability/impact 1–5'); else if (nv !== ov) chg[p[0]] = nv == null ? '' : String(nv); });
        var ns = stOf(x[J.status]), os = stOf(x[J.ostat]); if (!ns) err = err || T('حالة غير معروفة', 'Unknown status'); else if (ns != os) chg.status = ns;
        var nr = txt(x[J.response]), orr = txt(x[J.oresp]); if (nr != orr) chg.response = nr;
        var nd = h.cellDate(x[J.due], B.utc), od = h.cellDate(x[J.odue], B.utc); if (/^#bad/.test(nd)) err = err || T('تاريخ غير مفهوم', 'Bad date'); else if (nd != od) chg.due = nd;
        if (err) { res.risks.push({ st: 'error', row: j + 1, n: nm2, why: err }); continue; }
        if (!Object.keys(chg).length) { res.risks.push({ st: 'same', row: j + 1, n: nm2 }); continue; }
        if (String(rr.updated_at || '') != String(x[J.rst] || '')) { res.risks.push({ st: 'conflict', row: j + 1, n: nm2, why: T('حُدِّث الخطر في النظام بعد تنزيل الملف', 'Risk changed in the system after download') }); continue; }
        res.risks.push({ st: 'change', row: j + 1, n: nm2, d: Object.keys(chg).map(function (k) { return k + ': ' + chg[k]; }).join(' · ') });
        payload.risks.push(Object.assign({ pcode: pc, rno: String(rr.rno), _row: String(j + 1) }, chg));
      }
    }
    PF = { pc: pc, payload: payload, fname: f.name, onDone: onDone };
    showPreview([[T('المهام', 'Tasks'), res.tasks], [T('المؤشرات', 'KPIs'), res.kpis], [T('المخاطر', 'Risks'), res.risks]], f.name, payload.tasks.length + payload.kpis.length + payload.risks.length, 'IDOXL2._fullApply()');
  }); };
  function showPreview(groups, fname, nApply, applyFn) {
    var h = H(), T = h.T, esc = h.esc, lab = { change: ['✏️ سيتغير', 'ok'], same: ['= بلا تغيير', ''], conflict: ['⚠️ تعارض', 'wa'], error: ['✖ خطأ', 'bad'] };
    var body = groups.filter(function (g) { return g[1].length; }).map(function (g) {
      var c = {}; g[1].forEach(function (z) { c[z.st] = (c[z.st] || 0) + 1; });
      var rows = g[1].filter(function (z) { return z.st != 'same'; }).sort(function (a, b) { var o = { error: 0, conflict: 1, change: 2 }; return o[a.st] - o[b.st]; }).map(function (z) {
        var o = z.old || {}, n = z.new || {}, d = z.d || (z.st == 'change' || z.st == 'conflict' ? [o.pc != n.pc && n.pc != null ? o.pc + '% ← ' + n.pc + '%' : '', (o.ae || '') != (n.ae || '') ? T('إنجاز فعلي: ', 'Finish: ') + (n.ae || '—') : ''].filter(Boolean).join(' · ') : '');
        return '<tr><td><span class="' + lab[z.st][1] + '" style="border-radius:99px;padding:1px 8px;white-space:nowrap">' + T(lab[z.st][0], z.st) + '</span></td><td>' + (z.row ? T('صف ', 'Row ') + z.row : '') + '</td><td><b>' + esc(z.n || '') + '</b></td><td>' + esc(d) + (z.why ? '<div style="color:#b3261e">' + esc(z.why) + '</div>' : '') + (z.warn ? '<div style="color:#8a5a00">⚠ ' + esc(z.warn) + '</div>' : '') + '</td></tr>';
      }).join('');
      return '<h4 style="margin:12px 0 4px">' + esc(g[0]) + '</h4><div class="kp"><span class="ok">' + T('سيتغير ', 'Change ') + (c.change || 0) + '</span><span>' + T('بلا تغيير ', 'Same ') + (c.same || 0) + '</span>' + (c.conflict ? '<span class="wa">' + T('تعارض ', 'Conflicts ') + c.conflict + '</span>' : '') + (c.error ? '<span class="bad">' + T('أخطاء ', 'Errors ') + c.error + '</span>' : '') + '</div>' + (rows ? '<div class="tw"><table>' + rows + '</table></div>' : '');
    }).join('') || '<p class="mut">' + T('لا توجد تغييرات في الملف.', 'No changes in the file.') + '</p>';
    h.box('<h3>🔎 ' + T('معاينة قبل التطبيق', 'Preview before applying') + '</h3><div class="mut">' + esc(fname) + T(' — لم يُطبَّق شيء بعد.', ' — nothing applied yet.') + '</div>' + body + '<div class="rw">' + (nApply ? '<button class="p" id="xlgo" onclick="' + applyFn + '">' + T('طبّق التغييرات الصحيحة (', 'Apply valid changes (') + nApply + ')</button>' : '') + '<button onclick="IDOXL.close()">' + T('إلغاء', 'Cancel') + '</button></div>');
  }
  X._fullApply = async function () {
    var h = H(), T = h.T, sb = h.SB(), P = PF; if (!P) return h.close(); var b = document.getElementById('xlgo'); if (b) b.disabled = true;
    var out = [], nT = 0, nK = 0, nR = 0, pend = 0;
    if (P.payload.tasks.length) { var r = await sb.rpc('xl_tasks_apply', { p_rows: P.payload.tasks, p_dry: false, p_file: P.fname }); if (r.error) out.push(T('المهام: ', 'Tasks: ') + h.errMsg(r.error)); else { nT = r.data.applied || 0; (r.data.rows || []).filter(function (z) { return z.st != 'done' && z.st != 'same'; }).forEach(function (z) { out.push((z.n || '') + ' — ' + (z.why || '')); }); } }
    for (var i = 0; i < P.payload.kpis.length; i++) { var k = P.payload.kpis[i]; try { var q = k.id ? await sb.from('kpi_values').update(k.row).eq('id', k.id) : await sb.from('kpi_values').insert(k.row); if (q.error) throw q.error; nK++; } catch (e) { out.push(T('مؤشر: ', 'KPI: ') + (e.message || e)); } }
    if (P.payload.risks.length) { var rr = await sb.rpc('risk_import', { p_rows: P.payload.risks, p_note: T('عبر الملف الشامل: ', 'via full file: ') + P.fname }); if (rr.error) out.push(T('المخاطر: ', 'Risks: ') + h.errMsg(rr.error)); else { nR = (rr.data.updated || 0) + (rr.data.created || 0); pend = rr.data.pending || 0; (rr.data.errors || []).forEach(function (e) { out.push(T('خطر صف ', 'Risk row ') + e.row + ': ' + e.err); }); } }
    h.box('<h3>✅ ' + T('اكتمل التطبيق', 'Applied') + '</h3><div class="kp"><span class="ok">' + T('مهام ', 'Tasks ') + nT + '</span><span class="ok">' + T('قراءات مؤشرات ', 'KPI readings ') + nK + '</span><span class="ok">' + T('مخاطر ', 'Risks ') + nR + '</span>' + (pend ? '<span class="wa">' + T('بانتظار اعتماد ', 'Pending approval ') + pend + '</span>' : '') + '</div>' + (out.length ? '<p class="mut">' + out.map(h.esc).join('<br>') + '</p>' : '') + '<div class="rw"><button class="p" onclick="IDOXL.close()">' + T('إغلاق', 'Close') + '</button></div>');
    var cb = P.onDone; PF = null; try { if (cb) cb(); } catch (e) { }
  };

  /* =====================================================================
     2) ملف المكتب الشهري: ملاحظات كل المشاريع للتقرير
     ===================================================================== */
  X.officeDownload = async function (L, RP, notes) {
    var h = H(), T = h.T; var M = await gate('office'); if (!M) return; h.busy(T('جارٍ تجهيز ملف المكتب…', 'Preparing…'));
    var KO = ['opc', 'ost', 'onote', 'och', 'orecs', 'oinc', 'pname', 'pm', 'state', 'note', 'ch', 'recs', 'inc'], YES = T('نعم', 'Yes'), NO = T('لا', 'No');
    var spec = { title: T('ملاحظات المكتب', 'Office notes'), keys: KO, head: { opc: 'opc', ost: 'ost', onote: 'onote', och: 'och', orecs: 'orecs', oinc: 'oinc', pname: ['المشروع', 'Project'], pm: ['مدير المشروع', 'PM'], state: ['الوضع', 'Status'], note: ['✏️ ملاحظة المكتب', '✏️ Office note'], ch: ['✏️ التحديات', '✏️ Challenges'], recs: ['✏️ التوصيات', '✏️ Recommendations'], inc: ['✏️ في التقرير؟', '✏️ In report?'] },
      hidden: { opc: 1, ost: 1, onote: 1, och: 1, orecs: 1, oinc: 1 }, edit: { note: 1, ch: 1, recs: 1, inc: 1 }, widths: { pname: 32, state: 26, note: 44, ch: 36, recs: 36 },
      dv: { inc: function () { return { type: 'list', allowBlank: false, formulae: ['"' + YES + ',' + NO + '"'] }; }, note: dvLen, ch: dvLen, recs: dvLen },
      rows: L.map(function (p) { var n = notes[p.k] || {}; var inc = n.include === false ? NO : YES; return { can: true, v: { opc: p.k, ost: n.updated_at || '', onote: n.note || '', och: n.challenges || '', orecs: n.recs || '', oinc: inc, pname: (p.name || '') + ' — ' + p.k, pm: p.pm || '', state: [p.a != null && isFinite(p.a) ? Math.round(p.a) + '%' : '', p.lateN ? p.lateN + T(' متأخرة', ' late') : ''].filter(Boolean).join(' · '), note: n.note || '', ch: n.challenges || '', recs: n.recs || '', inc: inc } }; }) };
    try { await buildBook([spec], 'office', RP.f + '|' + RP.t, M, new Date().toISOString(), T('ملاحظات-المكتب-', 'office-notes-') + RP.f + '_' + RP.t + '.xlsx', [T('ملاحظات المكتب للتقرير عن الفترة ', 'Office notes for the period ') + RP.f + ' → ' + RP.t, T('اترك الخانات فارغة لحذف ملاحظة المشروع.', 'Leave cells empty to delete a note.')]); h.close(); h.done(T('تم تنزيل ملف المكتب', 'Office file downloaded'), T('اكتب الملاحظات ثم ارفعه من نفس المساحة.', 'Write notes, then upload it here.')); }
    catch (e) { h.fail(e.message || String(e)); }
  };
  function dvLen() { return { type: 'textLength', operator: 'lessThanOrEqual', allowBlank: true, showErrorMessage: true, error: H().T('الحد 2000 حرف', 'Max 2000 chars'), formulae: [2000] }; }
  var PO = null;
  X.officeUpload = function (RP, onDone) { var h = H(); h.pick(async function (f) {
    var T = h.T; var M = await gate('office'); if (!M) return; h.busy(T('جارٍ قراءة الملف…', 'Reading…'));
    var B; try { B = await readBook(f); } catch (e) { return h.fail(e.message || T('تعذّر قراءة الملف.', 'Could not read the file.')); }
    var bad = checkMeta(B.meta, 'office', RP.f + '|' + RP.t, M); if (bad) return h.fail(bad);
    var a = B.sheets.opc; if (!a) return h.fail(T('ورقة الملاحظات غير موجودة.', 'Notes sheet missing.'));
    var I = idx(a), codes = [], res = [], pay = [];
    for (var i = 2; i < a.length; i++) if (a[i] && a[i][I.opc]) codes.push(String(a[i][I.opc]));
    var cur = codes.length ? ((await h.SB().from('report_notes').select('*').in('pcode', codes).eq('pf', RP.f).eq('pt', RP.t)).data || []) : [];
    var YES = [T('نعم', 'Yes'), 'نعم', 'Yes', 'yes'];
    for (var j = 2; j < a.length; j++) { var x = a[j]; if (!x || !x[I.opc]) continue; var pc = String(x[I.opc]), nm = txt(x[I.pname]);
      var nn = { note: txt(x[I.note]).slice(0, 2000), ch: txt(x[I.ch]).slice(0, 2000), recs: txt(x[I.recs]).slice(0, 2000), inc: YES.indexOf(txt(x[I.inc])) >= 0 };
      var on = { note: txt(x[I.onote]), ch: txt(x[I.och]), recs: txt(x[I.orecs]), inc: YES.indexOf(txt(x[I.oinc])) >= 0 };
      if (nn.note == on.note && nn.ch == on.ch && nn.recs == on.recs && nn.inc == on.inc) { res.push({ st: 'same', row: j + 1, n: nm }); continue; }
      var c = cur.find(function (z) { return z.pcode == pc; });
      if (String((c && c.updated_at) || '') != String(x[I.ost] || '')) { res.push({ st: 'conflict', row: j + 1, n: nm, why: T('عدّلها ', 'Edited by ') + ((c && c.by_name) || T('شخص آخر', 'someone')) + T(' بعد تنزيل الملف', ' after download') }); continue; }
      res.push({ st: 'change', row: j + 1, n: nm, d: !nn.note && !nn.ch && !nn.recs ? T('حذف الملاحظة', 'Delete note') : T('تحديث الملاحظة', 'Update note') + (nn.inc ? '' : T(' (خارج التقرير)', ' (excluded)')) });
      pay.push({ p_pcode: pc, p_pf: RP.f, p_pt: RP.t, p_note: nn.note, p_ch: nn.ch, p_recs: nn.recs, p_include: nn.inc });
    }
    PO = { pay: pay, onDone: onDone };
    showPreview([[T('ملاحظات المكتب', 'Office notes'), res]], f.name, pay.length, 'IDOXL2._officeApply()');
  }); };
  X._officeApply = async function () { var h = H(), T = h.T, P = PO; if (!P) return h.close(); var b = document.getElementById('xlgo'); if (b) b.disabled = true; var n = 0, er = [];
    for (var i = 0; i < P.pay.length; i++) { var r = await h.SB().rpc('report_note_save', P.pay[i]); if (r.error) er.push(P.pay[i].p_pcode + ': ' + h.errMsg(r.error)); else n++; }
    h.box('<h3>✅ ' + T('حُفظت ', 'Saved ') + n + T(' ملاحظة', ' notes') + '</h3>' + (er.length ? '<p class="mut">' + er.map(h.esc).join('<br>') + '</p>' : '') + '<div class="rw"><button class="p" onclick="IDOXL.close()">' + T('إغلاق', 'Close') + '</button></div>');
    var cb = P.onDone; PO = null; try { if (cb) cb(); } catch (e) { } };

  /* =====================================================================
     3) ميثاق المسودة عبر Excel (تعبئة/تحديث المسودة المفتوحة)
     ===================================================================== */
  var CHF = [['pname', ['اسم المشروع', 'Project name']], ['purpose', ['الغرض', 'Purpose']], ['pdesc', ['وصف المشروع', 'Description']], ['outputs', ['المخرجات', 'Outputs']], ['impact', ['الأثر المتوقع', 'Expected impact']], ['alt', ['البدائل', 'Alternatives']], ['assume', ['الافتراضات', 'Assumptions']], ['constr', ['القيود', 'Constraints']], ['nrisk', ['أثر عدم التنفيذ', 'Risk of not doing']], ['sdate', ['تاريخ البداية', 'Start date']], ['edate', ['تاريخ النهاية', 'End date']], ['budget', ['الميزانية التقديرية', 'Estimated budget']], ['owner', ['مالك المشروع', 'Project owner']], ['pmname', ['مدير المشروع', 'Project manager']]];
  var CHT = { team: [['n', ['الاسم', 'Name']], ['j', ['الوظيفة/الدور', 'Role']], ['e', ['البريد', 'Email']], ['m', ['المهام', 'Tasks']]], acts: [['a', ['النشاط', 'Activity']], ['d', ['المخرج', 'Deliverable']], ['t', ['التوقيت', 'Timing']]], reqs: [['r', ['الاحتياج', 'Requirement']], ['dp', ['الجهة', 'Department']], ['d', ['التفاصيل', 'Details']], ['n', ['العدد', 'Qty']], ['c', ['التكلفة', 'Cost']]], risks: [['d', ['الخطر', 'Risk']], ['p', ['متى', 'When']], ['o', ['المسؤول', 'Owner']], ['i', ['الأثر 1-5', 'Impact 1-5']], ['x', ['الاحتمال 1-5', 'Probability 1-5']]], stk_int: [['v', ['أصحاب مصلحة داخليون', 'Internal stakeholders']]], stk_ext: [['v', ['أصحاب مصلحة خارجيون', 'External stakeholders']]] };
  var CHN = { team: ['الفريق', 'Team'], acts: ['الأنشطة', 'Activities'], reqs: ['الاحتياجات', 'Requirements'], risks: ['المخاطر', 'Risks'], stk_int: ['داخليون', 'Internal'], stk_ext: ['خارجيون', 'External'] };
  function canCh() { var c = (function () { try { return Function('return typeof cr!="undefined"?cr:null')(); } catch (e) { return null; } })(), ed = (function () { try { return Function('return typeof editing!="undefined"?editing:false')(); } catch (e) { return false; } })(); return c && c.id && ed && ['Draft', 'Returned to PM'].indexOf(c.status) >= 0 ? c : null; }
  X.charterDownload = async function () {
    var h = H(), T = h.T; var M = await gate('charter'); if (!M) return; var c = canCh(); if (!c) return h.fail(T('افتح مسودة ميثاق في وضع التعديل أولًا.', 'Open a charter draft in edit mode first.'));
    var d = c.data || {}, specs = [];
    specs.push({ title: T('معلومات المشروع', 'Project info'), keys: ['fk', 'fo', 'fl', 'fv'], head: { fk: 'fk', fo: 'fo', fl: ['الحقل', 'Field'], fv: ['✏️ القيمة', '✏️ Value'] }, hidden: { fk: 1, fo: 1 }, edit: { fv: 1 }, widths: { fl: 26, fv: 90 },
      rows: CHF.map(function (f) { return { can: true, v: { fk: f[0], fo: d[f[0]] == null ? '' : String(d[f[0]]), fl: h.A() ? f[1][0] : f[1][1], fv: d[f[0]] == null ? '' : String(d[f[0]]) } }; }) });
    Object.keys(CHT).forEach(function (t) { var cols = CHT[t], keys = ['tb'].concat(cols.map(function (x) { return 'c_' + x[0]; })), head = { tb: 'tb' }; cols.forEach(function (x) { head['c_' + x[0]] = ['✏️ ' + x[1][0], '✏️ ' + x[1][1]]; });
      var arr = Array.isArray(d[t]) ? d[t] : [], rows = arr.map(function (r) { var v = { tb: t }; cols.forEach(function (x) { v['c_' + x[0]] = typeof r == 'string' ? r : (r && r[x[0]] != null ? r[x[0]] : ''); }); return { can: true, v: v }; });
      var ed = {}; cols.forEach(function (x) { ed['c_' + x[0]] = 1; });
      specs.push({ title: h.A() ? CHN[t][0] : CHN[t][1], keys: keys, head: head, hidden: { tb: 1 }, edit: ed, widths: {}, rows: rows, blank: 15, dv: t == 'risks' ? { c_i: dv15, c_x: dv15 } : {} });
      /* blank rows need the table key so the reader can find them */
      specs[specs.length - 1].blankKey = t;
    });
    specs.forEach(function (sp) { if (sp.blankKey) { var t = sp.blankKey; sp.rows = sp.rows.concat(Array.from({ length: 15 }, function () { var v = { tb: t }; return { can: true, v: v }; })); sp.blank = 0; } });
    try { await buildBook(specs, 'charter', String(c.id), M, new Date().toISOString(), T('ميثاق-مسودة-', 'charter-draft-') + (c.code || c.id) + '.xlsx', [T('مسودة ميثاق ', 'Charter draft ') + (c.code || ''), T('اكتب في الخانات الصفراء. الحقول المرتبطة بقوائم (القطاع، الإدارة، الهدف، النوع، الأولوية) تُكمَل في النظام.', 'Fill yellow cells; list fields are completed in the system.'), T('في جداول الفريق والأنشطة والاحتياجات والمخاطر: صف لكل عنصر؛ الصفوف الفارغة تُهمل.', 'One row per item; empty rows are ignored.')]); h.close(); h.done(T('تم تنزيل قالب الميثاق', 'Charter file downloaded'), T('عبّئه ثم ارفعه من «⬆ رفع ملف الميثاق» وأنت في وضع التعديل.', 'Fill it, then upload it while editing.')); }
    catch (e) { h.fail(e.message || String(e)); }
  };
  var PC2 = null;
  X.charterUpload = function () { var h = H(); h.pick(async function (f) {
    var T = h.T; var M = await gate('charter'); if (!M) return; var c = canCh(); if (!c) return h.fail(T('افتح نفس مسودة الميثاق في وضع التعديل أولًا.', 'Open the same draft in edit mode first.'));
    h.busy(T('جارٍ قراءة الملف…', 'Reading…')); var B; try { B = await readBook(f); } catch (e) { return h.fail(e.message || T('تعذّر قراءة الملف.', 'Could not read the file.')); }
    var bad = checkMeta(B.meta, 'charter', String(c.id), M); if (bad) return h.fail(bad);
    var d = c.data || {}, nd = {}, res = [];
    var a = B.sheets.fk; if (a) { var I = idx(a); for (var i = 2; i < a.length; i++) { var x = a[i]; if (!x || !x[I.fk]) continue; var k = String(x[I.fk]); if (!CHF.some(function (f) { return f[0] == k; })) continue;
      var nv = (k == 'sdate' || k == 'edate') ? h.cellDate(x[I.fv], B.utc) : txt(x[I.fv]), ov = (k == 'sdate' || k == 'edate') ? h.cellDate(x[I.fo], B.utc) : txt(x[I.fo]), lb = txt(x[I.fl]);
      if (/^#bad/.test(nv)) { res.push({ st: 'error', row: i + 1, n: lb, why: T('تاريخ غير مفهوم', 'Bad date') }); continue; }
      if (k == 'budget' && nv && Number.isNaN(num(nv))) { res.push({ st: 'error', row: i + 1, n: lb, why: T('رقم غير صحيح', 'Invalid number') }); continue; }
      if (nv == ov) continue; if (String(d[k] == null ? '' : d[k]) != String(x[I.fo] == null ? '' : (k == 'sdate' || k == 'edate' ? ov : txt(x[I.fo])))) { res.push({ st: 'conflict', row: i + 1, n: lb, why: T('تغيّر في النظام بعد التنزيل', 'Changed after download') }); continue; }
      nd[k] = k == 'budget' ? String(num(nv) == null ? '' : num(nv)) : nv.slice(0, 5000); res.push({ st: 'change', row: i + 1, n: lb, d: String(nv).slice(0, 80) }); } }
    if (nd.sdate && nd.edate && nd.edate < nd.sdate) { res.push({ st: 'error', n: T('التواريخ', 'Dates'), why: T('تاريخ النهاية قبل البداية', 'End before start') }); delete nd.sdate; delete nd.edate; }
    var tbl = {}; B.tbSheets = B.list.filter(function (x) { return x && x[0] && x[0][0] == 'tb'; });
    res = res.concat(readTables(B, d, tbl));
    PC2 = { nd: nd, tables: tbl };
    var n = Object.keys(nd).length + Object.keys(tbl).length;
    showPreview([[T('حقول الميثاق', 'Charter fields'), res]], f.name, n, 'IDOXL2._charterApply()');
  }); };
  function readTables(B, d, tbl) { var res = [], h = H(), T = h.T;
    (B.tbSheets || []).forEach(function (a) { var I = idx(a), t = null, rows = []; for (var i = 2; i < a.length; i++) { var x = a[i]; if (!x) continue; t = t || String(x[I.tb] || ''); var cols = CHT[t]; if (!cols) continue; var o = {}, any = false; cols.forEach(function (c) { var v = txt(x[I['c_' + c[0]]]); o[c[0]] = v.slice(0, 2000); if (v) any = true; }); if (any) rows.push(t.indexOf('stk_') == 0 ? o.v : o); }
      if (!t || !CHT[t]) return; var old = Array.isArray(d[t]) ? d[t].filter(function (r) { return typeof r == 'string' ? r.trim() : r && Object.keys(r).some(function (k) { return String(r[k] || '').trim(); }); }) : [];
      if (JSON.stringify(old) == JSON.stringify(rows)) return; if (t == 'risks' && rows.some(function (r) { return (r.i && !/^[1-5]$/.test(r.i)) || (r.x && !/^[1-5]$/.test(r.x)); })) { res.push({ st: 'error', n: T(CHN[t][0], CHN[t][1]), why: T('الأثر والاحتمال من 1 إلى 5', 'Impact/probability 1–5') }); return; }
      tbl[t] = rows; res.push({ st: 'change', n: T(CHN[t][0], CHN[t][1]), d: old.length + ' ← ' + rows.length + T(' صف', ' rows') }); });
    return res; }
  X._charterApply = async function () { var h = H(), T = h.T, c = canCh(), P = PC2; if (!c || !P) return h.fail(T('المسودة لم تعد في وضع التعديل.', 'The draft is no longer in edit mode.'));
    Object.keys(P.nd).forEach(function (k) { c.data[k] = P.nd[k]; }); Object.keys(P.tables || {}).forEach(function (t) { c.data[t] = P.tables[t]; });
    try { var sv = Function('return typeof save!="undefined"?save:null')(); if (!sv) throw new Error('save'); await sv(); h.done(T('تم تحديث المسودة', 'Draft updated'), T('راجع الحقول في النظام وأكمل القوائم ثم قدّم الميثاق كالمعتاد.', 'Review, complete list fields, then submit as usual.')); } catch (e) { h.fail(e.message || String(e)); } PC2 = null; };

  /* =====================================================================
     4) ملف المستخدمين (للأدمن الكامل): تعديل الاسم والمسمى والوحدة وإضافة مستخدمين
     ===================================================================== */
  async function orgLists() { var r = await H().SB().from('app_settings').select('value').eq('key', 'opt_lists').maybeSingle(); var o = {}; try { o = JSON.parse((r.data && r.data.value) || '{}'); } catch (e) { } return o; }
  function unitOpts(o) { var A = H().A(), L = [{ k: '', l: H().T('— بلا وحدة —', '— No unit —') }]; (o.sectors || []).forEach(function (s, si) { var sn = s[A ? 0 : 1] || s[0]; L.push({ k: (si + 1) + '::', l: sn }); ((o.depts || [])[si] || []).forEach(function (d, di) { var dn = d[A ? 0 : 1] || d[0]; L.push({ k: (si + 1) + ':' + (di + 1) + ':', l: sn + ' / ' + dn }); (((o.sects || o.sections || [])[si] || [])[di] || []).forEach(function (q) { var qn = Array.isArray(q) ? (q[A ? 0 : 1] || q[0]) : q, qa = Array.isArray(q) ? q[0] : q; L.push({ k: (si + 1) + ':' + (di + 1) + ':' + qa, l: sn + ' / ' + dn + ' / ' + qn }); }); }); }); return L; }
  X.usersDownload = async function () {
    var h = H(), T = h.T; var M = await gate('users'); if (!M) return; if (M.role != 'admin') return h.fail(T('للأدمن الكامل فقط.', 'Full admins only.'));
    h.busy(T('جارٍ تجهيز ملف المستخدمين…', 'Preparing…'));
    var [pr, o] = await Promise.all([h.SB().from('profiles').select('id,full_name,job_title,email,role,role_key,org_sector,org_dept,org_section').order('full_name'), orgLists()]);
    var U = (pr.data || []), L = unitOpts(o), lab = function (u) { var k = u.org_sector ? u.org_sector + ':' + (u.org_dept || '') + ':' + (u.org_section || '') : ''; var x = L.find(function (z) { return z.k == k; }) || L.find(function (z) { return z.k == (u.org_sector ? u.org_sector + ':' + (u.org_dept || '') + ':' : ''); }); return x ? x.l : ''; };
    var KU = ['uid', 'oname', 'ojob', 'ounit', 'email', 'name', 'job', 'unit'];
    var spec = { title: T('المستخدمون', 'Users'), keys: KU, head: { uid: 'uid', oname: 'oname', ojob: 'ojob', ounit: 'ounit', email: ['✏️ البريد (للجدد فقط)', '✏️ Email (new only)'], name: ['✏️ الاسم', '✏️ Name'], job: ['✏️ المسمى الوظيفي', '✏️ Job title'], unit: ['✏️ الوحدة', '✏️ Unit'] },
      hidden: { uid: 1, oname: 1, ojob: 1, ounit: 1 }, edit: { email: 1, name: 1, job: 1, unit: 1 }, widths: { email: 30, name: 30, job: 28, unit: 50 },
      lock: function (r, k) { return k == 'email' && !r.blank; },
      lists: [L.map(function (x) { return x.l; })],
      dv: { unit: function () { return { type: 'list', allowBlank: true, showErrorMessage: true, error: T('اختر من القائمة', 'Pick from the list'), formulae: ['_lists!$A$1:$A$' + L.length] }; } },
      rows: U.filter(function (u) { return u.role != 'admin'; }).map(function (u) { var ul = lab(u); return { can: true, v: { uid: u.id, oname: u.full_name || '', ojob: u.job_title || '', ounit: ul, email: u.email || '', name: u.full_name || '', job: u.job_title || '', unit: ul } }; }).concat(Array.from({ length: 30 }, function () { return { can: true, blank: 1, v: {} }; })) };
    try { await buildBook([spec], 'users', '', M, new Date().toISOString(), T('المستخدمون-', 'users-') + h.today() + '.xlsx', [T('تعديل الاسم والمسمى والوحدة للمستخدمين الحاليين. حسابات الأدمن غير مدرجة.', 'Edit name, title and unit. Admin accounts are not listed.'), T('لإضافة مستخدم جديد: اكتب في الصفوف الفارغة البريد والاسم والمسمى والوحدة. يُنشأ بدور «مستخدم» وكلمة مرور مؤقتة تظهر لك مرة واحدة بعد الرفع.', 'New users: fill email, name, title, unit in empty rows; created as User with a one-time temporary password.'), T('الأدوار والصلاحيات لا تُغيَّر من هذا الملف.', 'Roles and permissions are not changed from this file.')]); h.close(); h.done(T('تم تنزيل ملف المستخدمين', 'Users file downloaded'), T('ارفعه من «⬆ رفع ملف المستخدمين».', 'Upload it from “Upload users file”.')); }
    catch (e) { h.fail(e.message || String(e)); }
  };
  var PU = null;
  X.usersUpload = function (onDone) { var h = H(); h.pick(async function (f) {
    var T = h.T; var M = await gate('users'); if (!M) return; if (M.role != 'admin') return h.fail(T('للأدمن الكامل فقط.', 'Full admins only.'));
    h.busy(T('جارٍ قراءة الملف…', 'Reading…')); var B; try { B = await readBook(f); } catch (e) { return h.fail(e.message || T('تعذّر قراءة الملف.', 'Could not read the file.')); }
    var bad = checkMeta(B.meta, 'users', '', M); if (bad) return h.fail(bad);
    var a = B.sheets.uid; if (!a) return h.fail(T('ورقة المستخدمين غير موجودة.', 'Users sheet missing.'));
    var [pr, o] = await Promise.all([h.SB().from('profiles').select('id,full_name,job_title,email,role,role_key,org_sector,org_dept,org_section'), orgLists()]);
    var U = pr.data || [], L = unitOpts(o), I = idx(a), res = [], pay = [], emails = {};
    var uk = function (l) { l = String(l || '').trim(); var x = L.find(function (z) { return z.l == l; }); return x ? x.k : null; };
    for (var i = 2; i < a.length; i++) { var x = a[i]; if (!x) continue; var id = String(x[I.uid] || '').trim(), name = txt(x[I.name]).slice(0, 120), job = txt(x[I.job]).slice(0, 120), unitL = txt(x[I.unit]), em = txt(x[I.email]).toLowerCase();
      if (!id && !name && !em && !job && !unitL) continue;
      var key = uk(unitL); if (unitL && key == null) { res.push({ st: 'error', row: i + 1, n: name || em, why: T('وحدة غير موجودة في القائمة', 'Unknown unit') }); continue; }
      if (!id) { if (!/^\S+@\S+\.\S+$/.test(em)) { res.push({ st: 'error', row: i + 1, n: name, why: T('بريد غير صحيح', 'Invalid email') }); continue; } if (!name) { res.push({ st: 'error', row: i + 1, n: em, why: T('الاسم مطلوب', 'Name required') }); continue; }
        if (emails[em] || U.some(function (u) { return (u.email || '').toLowerCase() == em; })) { res.push({ st: 'error', row: i + 1, n: name, why: T('البريد مستخدم من قبل', 'Email already exists') }); continue; } emails[em] = 1;
        res.push({ st: 'change', row: i + 1, n: name, d: T('مستخدم جديد: ', 'New user: ') + em }); pay.push({ create: 1, em: em, name: name, job: job, key: key }); continue; }
      var u = U.find(function (z) { return z.id == id; }); if (!u || u.role == 'admin') { res.push({ st: 'error', row: i + 1, n: name, why: T('المستخدم غير موجود أو أدمن', 'User missing or admin') }); continue; }
      if (!name) { res.push({ st: 'error', row: i + 1, n: u.full_name, why: T('الاسم لا يكون فارغًا', 'Name cannot be empty') }); continue; }
      var oname = txt(x[I.oname]), ojob = txt(x[I.ojob]), ounit = txt(x[I.ounit]);
      if (name == oname && job == ojob && unitL == ounit) { res.push({ st: 'same', row: i + 1, n: name }); continue; }
      if ((u.full_name || '') != oname || (u.job_title || '') != ojob) { res.push({ st: 'conflict', row: i + 1, n: name, why: T('تغيّرت بياناته في النظام بعد التنزيل', 'Changed in the system after download') }); continue; }
      res.push({ st: 'change', row: i + 1, n: name, d: [name != oname ? T('الاسم', 'name') : '', job != ojob ? T('المسمى', 'title') : '', unitL != ounit ? T('الوحدة', 'unit') : ''].filter(Boolean).join('، ') });
      pay.push({ id: id, u: u, name: name, job: job, key: unitL != ounit ? key : undefined });
    }
    PU = { pay: pay, onDone: onDone };
    showPreview([[T('المستخدمون', 'Users'), res]], f.name, pay.length, 'IDOXL2._usersApply()');
  }); };
  function pw() { var c = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789', a = new Uint32Array(12), s = ''; crypto.getRandomValues(a); for (var i = 0; i < 12; i++) s += c[a[i] % c.length]; return s + '!7'; }
  X._usersApply = async function () { var h = H(), T = h.T, sb = h.SB(), P = PU; if (!P) return h.close(); var b = document.getElementById('xlgo'); if (b) b.disabled = true; var n = 0, er = [], made = [];
    for (var i = 0; i < P.pay.length; i++) { var p = P.pay[i]; try {
      var sp = function (k) { if (k == null) return null; var q = k.split(':'); return { s: q[0] ? +q[0] : null, d: q[1] ? +q[1] : null, x: q.slice(2).join(':') || null }; };
      if (p.create) { var w = pw(); var r = await sb.rpc('admin_create_user', { p_email: p.em, p_pw: w, p_name: p.name, p_job: p.job, p_role: 'user' }); if (r.error) throw r.error; var z = sp(p.key); if (z && z.s) { var r2 = await sb.rpc('admin_set_org', { uid: r.data, p_sector: z.s, p_dept: z.d, p_section: z.x }); if (r2.error) throw r2.error; } made.push([p.name, p.em, w]); n++; continue; }
      if (!p.u.role_key) throw new Error(T('دور المستخدم غير محدد؛ عدّله من الشاشة', 'User role missing; edit on screen'));
      if (p.name != (p.u.full_name || '') || p.job != (p.u.job_title || '')) { var r3 = await sb.rpc('admin_update_user', { uid: p.id, p_name: p.name, p_job: p.job, p_role: p.u.role_key || p.u.role, p_email: '' }); if (r3.error) throw r3.error; }
      if (p.key !== undefined) { var z2 = sp(p.key) || { s: null, d: null, x: null }; var r4 = await sb.rpc('admin_set_org', { uid: p.id, p_sector: z2.s, p_dept: z2.d, p_section: z2.x }); if (r4.error) throw r4.error; }
      n++; } catch (e) { er.push((p.name || p.em) + ': ' + h.errMsg(e)); } }
    var mk = made.length ? '<h4>' + T('الحسابات الجديدة — انسخ كلمات المرور المؤقتة الآن، لن تظهر مرة أخرى:', 'New accounts — copy the temporary passwords now:') + '</h4><div class="tw"><table>' + made.map(function (m) { return '<tr><td>' + h.esc(m[0]) + '</td><td dir="ltr">' + h.esc(m[1]) + '</td><td dir="ltr"><b>' + h.esc(m[2]) + '</b></td></tr>'; }).join('') + '</table></div><p class="mut">' + T('اطلب من كل موظف تغيير كلمة المرور من «حسابي» بعد أول دخول.', 'Ask each user to change it from My account.') + '</p>' : '';
    h.box('<h3>✅ ' + T('اكتمل: ', 'Done: ') + n + '</h3>' + mk + (er.length ? '<p class="mut">' + er.map(h.esc).join('<br>') + '</p>' : '') + '<div class="rw"><button class="p" onclick="IDOXL.close()">' + T('إغلاق', 'Close') + '</button></div>');
    var cb = P.onDone; PU = null; try { if (cb) cb(); } catch (e) { } };

  window.IDOXL2 = X;
})();
