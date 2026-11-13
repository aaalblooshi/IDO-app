/* xlupd.js — تحديث المهام عبر Excel والتحديث السريع — window.IDOXL
   الحماية: ملف موسوم من النظام، أعمدة مقفلة وقوائم منسدلة، صاحب الملف فقط، عمر محدود، معاينة قبل التطبيق،
   فحص الصلاحية والتعارض لكل صف على الخادم، لا تغيير في الأساس (التواريخ المخططة)، سجل تدقيق «عبر Excel». */
(function () {
  var A = function () { return (document.documentElement.lang || 'ar') != 'en'; };
  var T = function (a, e) { return A() ? a : e; };
  var G = function (n) { try { return Function('try{return typeof ' + n + '!="undefined"?' + n + ':null}catch(e){return null}')(); } catch (e) { return null; } };
  var SB = function () { return G('sb') || window.sb || null; };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var CFG = null, ME = null;
  var MARK = 'IDOXL', VER = '1';
  var KEYS = ['pid', 'tid', 'stamp', 'oas', 'oae', 'otn', 'pcode', 'pname', 'n', 'par', 'owner', 's', 'e', 'pc', 'npc', 'as', 'ae', 'tn'];
  var HEAD = { pid: 'pid', tid: 'tid', stamp: 'stamp', oas: 'oas', oae: 'oae', otn: 'otn', pcode: ['رمز المشروع', 'Project code'], pname: ['المشروع', 'Project'], n: ['المهمة', 'Task'], par: ['ضمن', 'Under'], owner: ['المسؤول', 'Owner'], s: ['البداية المخططة', 'Planned start'], e: ['النهاية المخططة', 'Planned end'], pc: ['الإنجاز الحالي %', 'Current %'], npc: ['✏️ الإنجاز الجديد %', '✏️ New %'], as: ['✏️ البداية الفعلية', '✏️ Actual start'], ae: ['✏️ تاريخ الإنجاز الفعلي', '✏️ Actual finish'], tn: ['✏️ ملاحظة', '✏️ Note'] };
  var HIDDEN = { pid: 1, tid: 1, stamp: 1, oas: 1, oae: 1, otn: 1 };
  var EDIT = { npc: 1, as: 1, ae: 1, tn: 1 };
  var today = function () { return new Date(Date.now() + 4 * 36e5).toISOString().slice(0, 10); };

  async function cfg(force) {
    if (CFG && !force) return CFG;
    var sb = SB(); CFG = { mytasks: true, projtasks: true, quick: true, maxage: 7 };
    try { var r = await sb.from('app_settings').select('value').eq('key', 'xl_feat').maybeSingle(); var v = JSON.parse((r.data && r.data.value) || '{}') || {}; Object.keys(v).forEach(function (k) { CFG[k] = v[k]; }); } catch (e) { }
    if (!(+CFG.maxage > 0)) CFG.maxage = 7;
    return CFG;
  }
  async function me() { if (ME) return ME; var sb = SB(); try { var s = await sb.auth.getSession(); var u = s.data.session.user.id; var p = await sb.from('profiles').select('id,full_name,role').eq('id', u).single(); ME = p.data; } catch (e) { ME = null; } return ME; }
  function on(k) { return !!(CFG && CFG[k] !== false); }

  function loadScript(src, test) { return test() ? Promise.resolve() : new Promise(function (ok, no) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = function () { no(new Error('lib')); }; document.head.appendChild(s); }); }
  function loadExcelJS() { return loadScript('https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js', function () { return !!window.ExcelJS; }); }
  function loadXLSX() { return loadScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js', function () { return !!window.XLSX; }); }

  /* ---------- واجهة: نافذة ---------- */
  var CSS = '#xlw{position:fixed;inset:0;z-index:100050;background:rgba(20,30,45,.5);display:flex;align-items:flex-start;justify-content:center;padding:4vh 10px;overflow:auto}#xlw .xb{background:#fff;border-radius:18px;width:100%;max-width:820px;padding:16px;box-sizing:border-box;font-size:14px;line-height:1.6}#xlw h3{margin:0 0 6px;font-size:18px}#xlw .mut{color:#6b7c8c;font-size:13px}#xlw .kp{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}#xlw .kp span{border-radius:99px;padding:3px 12px;font-weight:700;font-size:13px;background:#eef3f7}#xlw .ok{background:#e3f1e8!important;color:#0a6b3d}#xlw .bad{background:#fde8e6!important;color:#b3261e}#xlw .wa{background:#fff4e0!important;color:#8a5a00}#xlw table{width:100%;border-collapse:collapse;font-size:13px}#xlw td,#xlw th{border-bottom:1px solid #eee;padding:6px 5px;text-align:start;vertical-align:top}#xlw th{color:#6b7c8c;font-size:12px}#xlw .tw{max-height:46vh;overflow:auto;border:1px solid #eee;border-radius:12px;margin:8px 0}#xlw .rw{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}#xlw button{border:1px solid #cfd9e3;background:#fff;border-radius:99px;padding:9px 16px;font:inherit;font-weight:700;cursor:pointer}#xlw button.p{background:#1d5f8a;border-color:#1d5f8a;color:#fff}#xlw button:disabled{opacity:.5}#xlw .qi{border:1px solid #e6e6e6;border-radius:12px;padding:10px;margin:8px 0}#xlw .qi.ch{border-color:#1d5f8a;background:#f5f9fc}#xlw .qi select,#xlw .qi input{font:inherit;font-size:16px;padding:6px 8px;border:1px solid #cfd9e3;border-radius:10px;background:#fff;max-width:100%}#xlw .qg{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:6px}#xlw .qg label{font-size:12.5px;color:#6b7c8c;display:flex;flex-direction:column;gap:2px}';
  function box(html) { var o = document.getElementById('xlw'); if (o) o.remove(); if (!document.getElementById('xlcss')) { var s = document.createElement('style'); s.id = 'xlcss'; s.textContent = CSS; document.head.appendChild(s); } o = document.createElement('div'); o.id = 'xlw'; o.innerHTML = '<div class="xb">' + html + '</div>'; o.addEventListener('click', function (e) { if (e.target === o) close(); }); document.body.appendChild(o); return o; }
  function close() { var o = document.getElementById('xlw'); if (o) o.remove(); }
  function busy(m) { box('<h3>⏳ ' + esc(m) + '</h3>'); }
  function fail(m) { box('<h3>⚠️ ' + T('تعذّر', 'Failed') + '</h3><p>' + esc(m) + '</p><div class="rw"><button onclick="IDOXL.close()">' + T('إغلاق', 'Close') + '</button></div>'); }
  function errMsg(e) { var m = (e && (e.message || e.error_description)) || String(e); if (/feature off/.test(m)) return T('هذه الخاصية موقوفة من الإعدادات.', 'This feature is turned off in settings.'); if (/not allowed/.test(m)) return T('لا تملك الصلاحية.', 'Not allowed.'); return m; }

  /* ---------- التنزيل ---------- */
  async function download(pcode) {
    await cfg(); var M = await me(); if (!M) return fail(T('سجّل الدخول أولًا.', 'Sign in first.'));
    if (pcode ? !on('projtasks') : !on('mytasks')) return fail(T('هذه الخاصية موقوفة من الإعدادات.', 'This feature is turned off in settings.'));
    busy(T('جارٍ تجهيز الملف…', 'Preparing the file…'));
    var r = await SB().rpc('xl_tasks', { p_pcode: pcode || null });
    if (r.error) return fail(errMsg(r.error));
    var rows = r.data || [];
    if (!rows.length) return fail(pcode ? T('لا توجد مهام في خطة معتمدة لهذا المشروع، أو أن المشروع موقوف.', 'No tasks in an approved plan for this project.') : T('لا توجد مهام مسندة إليك في خطط معتمدة.', 'No tasks assigned to you in approved plans.'));
    var kind = pcode ? 'project' : 'mytasks', stamp = new Date().toISOString(), fn = (pcode ? T('متابعة-خطة-', 'plan-followup-') + pcode : T('تحديث-مهامي', 'my-tasks-update')) + '-' + today() + '.xlsx';
    try { await loadExcelJS(); await buildExcelJS(rows, kind, pcode, M, stamp, fn); close(); done(T('تم تنزيل الملف', 'File downloaded'), T('عدّل الأعمدة المعلّمة ✏️ فقط، ثم ارفع الملف من «رفع ملف التحديث». صلاحية الملف ', 'Edit the ✏️ columns only, then upload it. The file is valid for ') + CFG.maxage + T(' أيام.', ' days.')); }
    catch (e) {
      try { await loadXLSX(); buildSheetJS(rows, kind, pcode, M, stamp, fn); close(); done(T('تم تنزيل الملف', 'File downloaded'), T('ملاحظة: تعذّر تحميل أداة القوائم المنسدلة، فنُزّل الملف بدونها. اكتب النسبة رقمًا من 0 إلى 100.', 'Dropdowns unavailable; type the percentage 0–100.')); }
      catch (e2) { fail(T('تعذّر تحميل أداة Excel. تحقق من الاتصال وحاول مرة أخرى.', 'Could not load the Excel tool.')); }
    }
  }
  function done(h, m) { box('<h3>✅ ' + esc(h) + '</h3><p class="mut">' + esc(m) + '</p><div class="rw"><button class="p" onclick="IDOXL.close()">' + T('حسنًا', 'OK') + '</button></div>'); }
  function rowVals(x) { return { pid: x.pid, tid: x.tid, stamp: x.stamp || '', oas: x.a_s || '', oae: x.a_e || '', otn: x.tn || '', pcode: x.pcode, pname: x.pname || '', n: x.n, par: x.par || '', owner: x.owner || '', s: x.s || '', e: x.e || '', pc: x.pc, npc: '', as: x.a_s || '', ae: x.a_e || '', tn: x.tn || '' }; }
  function metaRows(kind, pcode, M, stamp) { return [[MARK], [kind], [pcode || ''], [M.id], [stamp], [VER], [M.full_name || '']]; }
  function d2x(s) { if (!s || !/^\d{4}-\d\d-\d\d$/.test(s)) return null; var p = s.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
  async function buildExcelJS(rows, kind, pcode, M, stamp, fn) {
    var wb = new ExcelJS.Workbook(); wb.creator = 'IDO'; wb.created = new Date();
    var ws = wb.addWorksheet(T('المهام', 'Tasks'), { views: [{ rightToLeft: A(), state: 'frozen', ySplit: 2 }] });
    ws.columns = KEYS.map(function (k) { return { key: k, width: HIDDEN[k] ? 4 : ({ n: 42, pname: 26, par: 22, owner: 18, tn: 36 }[k] || 15), hidden: !!HIDDEN[k] }; });
    ws.addRow(KEYS).hidden = true;
    var h = ws.addRow(KEYS.map(function (k) { return HIDDEN[k] ? k : (A() ? HEAD[k][0] : HEAD[k][1]); }));
    h.font = { bold: true, color: { argb: 'FFFFFFFF' } }; h.height = 30; h.alignment = { vertical: 'middle', wrapText: true };
    h.eachCell(function (c, i) { var k = KEYS[i - 1]; c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EDIT[k] ? 'FF0A6B3D' : 'FF1D5F8A' } }; });
    var td = d2x(today());
    rows.forEach(function (x) {
      var v = rowVals(x), r = ws.addRow(KEYS.map(function (k) { return (k == 's' || k == 'e' || k == 'as' || k == 'ae') ? (d2x(v[k]) || null) : v[k]; }));
      r.eachCell({ includeEmpty: true }, function (c, i) {
        var k = KEYS[i - 1];
        if (k == 's' || k == 'e' || k == 'as' || k == 'ae') c.numFmt = 'yyyy-mm-dd';
        if (EDIT[k] && x.can) { c.protection = { locked: false }; c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF8DC' } }; }
        else if (EDIT[k]) { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFEFEF' } }; }
        if (k == 'npc' && x.can) c.dataValidation = { type: 'list', allowBlank: true, showErrorMessage: true, errorTitle: T('قيمة غير مقبولة', 'Invalid'), error: T('اختر نسبة من القائمة', 'Pick a value from the list'), formulae: ['"0,10,20,30,40,50,60,70,80,90,100"'] };
        if ((k == 'as' || k == 'ae') && x.can) c.dataValidation = { type: 'date', operator: 'between', allowBlank: true, showErrorMessage: true, errorTitle: T('تاريخ غير مقبول', 'Invalid date'), error: T('أدخل تاريخًا صحيحًا لا يتجاوز اليوم', 'Enter a valid date not after today'), formulae: [new Date(Date.UTC(2020, 0, 1)), td] };
        if (k == 'tn' && x.can) c.dataValidation = { type: 'textLength', operator: 'lessThanOrEqual', allowBlank: true, showErrorMessage: true, error: T('الحد 1000 حرف', 'Max 1000 chars'), formulae: [1000] };
        if (k == 'n' || k == 'tn' || k == 'pname') c.alignment = { wrapText: true, vertical: 'top' };
      });
      if (!x.can) r.getCell('n').note = T('للاطلاع فقط: لا تملك صلاحية تحديث هذه المهمة', 'View only');
    });
    await ws.protect('ido-' + Math.random().toString(36).slice(2, 8), { selectLockedCells: true, selectUnlockedCells: true, formatColumns: true, formatRows: true, sort: false, autoFilter: false, insertRows: false, deleteRows: false, insertColumns: false, deleteColumns: false });
    var info = wb.addWorksheet(T('تعليمات', 'Instructions'), { views: [{ rightToLeft: A() }] });
    info.getColumn(1).width = 110;
    [T('🔒 سري — خاص بـ ', '🔒 Confidential — for ') + (M.full_name || '') + T(' — نُزّل في ', ' — downloaded ') + stamp.slice(0, 16).replace('T', ' '),
     T('1) عدّل الأعمدة الخضراء المعلّمة ✏️ فقط. باقي الأعمدة مقفلة.', '1) Edit only the ✏️ green columns.'),
     T('2) «الإنجاز الجديد»: اختر من القائمة (0 إلى 100). اتركه فارغًا إذا لم يتغير.', '2) New %: pick from the list; leave blank if unchanged.'),
     T('3) عند 100% يُسجَّل تاريخ الإنجاز الفعلي اليوم إن تركته فارغًا. لا تُقبل تواريخ في المستقبل.', '3) At 100% the finish date defaults to today. No future dates.'),
     T('4) ارفع الملف من «رفع ملف التحديث». ستظهر معاينة بكل التغييرات قبل تطبيقها.', '4) Upload via “Upload update file”; you will see a preview first.'),
     T('5) إذا حدّث شخص المهمة في النظام بعد تنزيلك، لن تُطبَّق على صفّها وستظهر كتعارض.', '5) Rows changed in the system after download are skipped as conflicts.'),
     T('6) الملف صالح ', '6) The file is valid for ') + CFG.maxage + T(' أيام من تنزيله، ولا يقبله النظام إلا من صاحبه.', ' days and only from its owner.'),
     T('7) لا تغيّر التواريخ المخططة من هنا: تغيير خطة معتمدة يكون بطلب تغيير.', '7) Planned dates change only via a change request.')].forEach(function (l, i) { var c = info.getCell(i + 1, 1); c.value = l; c.alignment = { wrapText: true }; if (!i) c.font = { bold: true, color: { argb: 'FFB3261E' } }; });
    var mt = wb.addWorksheet('_meta'); mt.state = 'veryHidden'; metaRows(kind, pcode, M, stamp).forEach(function (r) { mt.addRow(r); });
    wb.views = [{ activeTab: 0 }];
    var buf = await wb.xlsx.writeBuffer();
    save(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), fn);
  }
  function buildSheetJS(rows, kind, pcode, M, stamp, fn) {
    var aoa = [KEYS, KEYS.map(function (k) { return HIDDEN[k] ? k : (A() ? HEAD[k][0] : HEAD[k][1]); })];
    rows.forEach(function (x) { var v = rowVals(x); aoa.push(KEYS.map(function (k) { return v[k]; })); });
    var wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!cols'] = KEYS.map(function (k) { return HIDDEN[k] ? { hidden: true } : { wch: { n: 40, pname: 24, tn: 34 }[k] || 14 }; });
    ws['!rows'] = [{ hidden: true }];
    XLSX.utils.book_append_sheet(wb, ws, T('المهام', 'Tasks'));
    var mt = XLSX.utils.aoa_to_sheet(metaRows(kind, pcode, M, stamp)); XLSX.utils.book_append_sheet(wb, mt, '_meta');
    wb.Workbook = { Sheets: [{ Hidden: 0 }, { Hidden: 2 }], Views: [{ RTL: A() }] };
    XLSX.writeFile(wb, fn);
  }
  function save(blob, fn) { var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = fn; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }

  /* ---------- الرفع ---------- */
  function pick(cb) { var i = document.createElement('input'); i.type = 'file'; i.accept = '.xlsx'; i.style.display = 'none'; i.onchange = function () { var f = i.files && i.files[0]; i.remove(); if (f) cb(f); }; document.body.appendChild(i); i.click(); }
  function upload(onDone) { pick(function (f) { readFile(f, onDone); }); }
  function cellDate(v, utc) {
    if (v == null || v === '') return '';
    if (v instanceof Date) { var d = utc ? [v.getUTCFullYear(), v.getUTCMonth() + 1, v.getUTCDate()] : [v.getFullYear(), v.getMonth() + 1, v.getDate()]; return d[0] + '-' + String(d[1]).padStart(2, '0') + '-' + String(d[2]).padStart(2, '0'); }
    if (typeof v == 'number' && v > 20000 && v < 80000) { var t = new Date(Math.round((v - 25569) * 864e5)); return cellDate(t, true); }
    var s = String(v).trim().replace(/[٠-٩]/g, function (c) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(c); });
    var m = /^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/.exec(s); if (m) return m[1] + '-' + m[2].padStart(2, '0') + '-' + m[3].padStart(2, '0');
    m = /^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})$/.exec(s); if (m) return m[3] + '-' + m[2].padStart(2, '0') + '-' + m[1].padStart(2, '0');
    return '#bad:' + s;
  }
  function cellText(v) { if (v == null) return ''; if (typeof v == 'object' && v.richText) return v.richText.map(function (x) { return x.text; }).join(''); if (typeof v == 'object' && 'result' in v) return String(v.result == null ? '' : v.result); if (typeof v == 'object' && v.text) return String(v.text); return String(v); }
  async function readFile(f, onDone) {
    await cfg(); var M = await me(); if (!M) return fail(T('سجّل الدخول أولًا.', 'Sign in first.'));
    if (f.size > 8 * 1048576) return fail(T('الملف أكبر من 8 ميغابايت.', 'File larger than 8 MB.'));
    if (!/\.xlsx$/i.test(f.name)) return fail(T('ارفع ملف ‎.xlsx‎ الذي نزّلته من النظام.', 'Upload the .xlsx file downloaded from the system.'));
    busy(T('جارٍ قراءة الملف…', 'Reading the file…'));
    var aoa = null, meta = null, utc = true;
    try {
      await loadExcelJS(); var wb = new ExcelJS.Workbook(); await wb.xlsx.load(await f.arrayBuffer());
      var mt = wb.getWorksheet('_meta'); if (mt) { meta = []; mt.eachRow({ includeEmpty: true }, function (r, i) { meta[i - 1] = cellText(r.getCell(1).value); }); }
      var ws = wb.worksheets.find(function (w) { return w.name != '_meta' && cellText(w.getRow(1).getCell(2).value) == 'tid'; });
      if (ws) { aoa = []; ws.eachRow({ includeEmpty: true }, function (r, i) { var a = []; for (var c = 1; c <= KEYS.length; c++) { var v = r.getCell(c).value; a.push(v instanceof Date ? v : (v && typeof v == 'object' ? cellText(v) : v)); } aoa[i - 1] = a; }); }
    } catch (e) {
      try { await loadXLSX(); utc = false; var wb2 = XLSX.read(await f.arrayBuffer(), { type: 'array', cellDates: true });
        if (wb2.Sheets._meta) meta = XLSX.utils.sheet_to_json(wb2.Sheets._meta, { header: 1, raw: true, defval: '' }).map(function (r) { return String(r[0] == null ? '' : r[0]); });
        var nm = wb2.SheetNames.find(function (n) { var a = XLSX.utils.sheet_to_json(wb2.Sheets[n], { header: 1, raw: true, defval: '' }); return a[0] && a[0][1] == 'tid'; });
        if (nm) aoa = XLSX.utils.sheet_to_json(wb2.Sheets[nm], { header: 1, raw: true, defval: '' });
      } catch (e2) { return fail(T('تعذّر قراءة الملف. تأكد أنه الملف الذي نزّلته من النظام وأنه محفوظ بصيغة ‎.xlsx‎.', 'Could not read the file.')); }
    }
    var res = parse(aoa, meta, M, utc); if (res.err) return fail(res.err);
    if (!res.rows.length) return box('<h3>ℹ️ ' + T('لا توجد تغييرات في الملف', 'No changes in the file') + '</h3><p class="mut">' + T('لم تُعدَّل أي خانة من الخانات المعلّمة ✏️.', 'No ✏️ cell was changed.') + '</p><div class="rw"><button onclick="IDOXL.close()">' + T('إغلاق', 'Close') + '</button></div>');
    preview(res.rows, f.name, res.local, onDone);
  }
  function parse(aoa, meta, M, utc) {
    if (!meta || meta[0] != MARK || !aoa || !aoa.length) return { err: T('هذا ليس ملف تحديث من النظام. نزّل الملف من زر «ملف التحديث» ثم عدّله وارفعه.', 'This is not an update file from the system.') };
    if (meta[5] != VER) return { err: T('إصدار الملف قديم. نزّل ملفًا جديدًا.', 'Old file version. Download a new one.') };
    if (meta[3] != M.id) return { err: T('هذا الملف نزّله ', 'This file was downloaded by ') + (meta[6] || T('شخص آخر', 'someone else')) + T('. لحماية البيانات يقبل النظام الملف من صاحبه فقط — نزّل ملفك الخاص.', '. Only its owner can upload it.') };
    var age = (Date.now() - Date.parse(meta[4])) / 864e5, MX = (CFG && +CFG.maxage) || 7;
    if (!(age >= -1) || age > MX) return { err: T('عمر الملف ', 'The file is ') + Math.floor(age) + T(' يومًا، والحد ', ' days old; the limit is ') + MX + T(' أيام. نزّل ملفًا جديدًا حتى لا تكتب فوق تحديثات أحدث.', ' days. Download a new file.') };
    var keys = aoa[0].map(function (x) { return String(x == null ? '' : x).trim(); }), ix = {};
    KEYS.forEach(function (k) { ix[k] = keys.indexOf(k); });
    if (ix.tid < 0 || ix.pid < 0 || ix.stamp < 0) return { err: T('أعمدة الملف تغيّرت ولا يمكن مطابقتها. نزّل ملفًا جديدًا.', 'File columns were changed. Download a new file.') };
    var out = [], local = {}, seen = {};
    for (var i = 2; i < aoa.length; i++) {
      var r = aoa[i]; if (!r) continue; var g = function (k) { return ix[k] >= 0 ? r[ix[k]] : ''; };
      var pid = String(g('pid') || '').trim(), tid = String(g('tid') || '').trim(); if (!pid || !tid) continue;
      var key = pid + '|' + tid; if (seen[key]) continue; seen[key] = 1;
      var x = { pid: pid, tid: tid, stamp: String(g('stamp') || ''), _row: i + 1 }, ch = false, bad = '';
      var np = g('npc'); np = np == null ? '' : String(np).replace('%', '').trim();
      if (np !== '') { var n = Number(np.replace(/[٠-٩]/g, function (c) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(c); })); if (!isFinite(n) || n < 0 || n > 100) bad = T('نسبة غير صحيحة: ', 'Invalid %: ') + np; else if (Math.round(n) != Number(g('pc'))) { x.pc = Math.round(n); ch = true; } }
      var as = cellDate(g('as'), utc), ae = cellDate(g('ae'), utc), oas = cellDate(g('oas'), utc), oae = cellDate(g('oae'), utc);
      if (/^#bad/.test(as) || /^#bad/.test(ae)) bad = T('تاريخ غير مفهوم: ', 'Bad date: ') + (as + ' ' + ae).replace(/#bad:/g, '');
      if (as != oas) { x.as = as; ch = true; } if (ae != oae) { x.ae = ae; ch = true; }
      var tn = cellText(g('tn')).trim().slice(0, 1000), otn = cellText(g('otn')).trim();
      if (tn != otn) { x.tn = tn; ch = true; }
      if (bad) { x._bad = bad; ch = true; }
      if (ch) { local[key] = { n: cellText(g('n')), pname: cellText(g('pname')), row: i + 1, bad: bad }; out.push(x); }
    }
    return { rows: out, local: local };
  }
  var PEND = null;
  async function preview(rows, fname, local, onDone) {
    busy(T('جارٍ فحص التغييرات…', 'Checking changes…'));
    var send = rows.filter(function (x) { return !x._bad; }).map(function (x) { var y = Object.assign({}, x); delete y._row; delete y._bad; return y; });
    var r = send.length ? await SB().rpc('xl_tasks_apply', { p_rows: send, p_dry: true, p_file: fname }) : { data: { rows: [] } };
    if (r.error) return fail(errMsg(r.error));
    var res = (r.data && r.data.rows) || [];
    rows.filter(function (x) { return x._bad; }).forEach(function (x) { res.push({ pid: x.pid, tid: x.tid, st: 'error', why: x._bad }); });
    var c = { change: 0, same: 0, conflict: 0, error: 0, warn: 0 }; res.forEach(function (z) { c[z.st] = (c[z.st] || 0) + 1; if (z.warn) c.warn++; });
    PEND = { rows: send.filter(function (x) { return res.some(function (z) { return z.st == 'change' && z.pid == String(x.pid) && z.tid == x.tid; }); }), fname: fname, onDone: onDone };
    var lab = { change: ['✏️ سيتغير', 'ok'], same: ['= بلا تغيير', ''], conflict: ['⚠️ تعارض', 'wa'], error: ['✖ خطأ', 'bad'] };
    var tr = res.sort(function (a, b) { var o = { error: 0, conflict: 1, change: 2, same: 3 }; return o[a.st] - o[b.st]; }).filter(function (z) { return z.st != 'same'; }).map(function (z) {
      var L = local[z.pid + '|' + z.tid] || {}, o = z.old || {}, n = z.new || {};
      var d = z.st == 'change' || z.st == 'conflict' ? [o.pc != n.pc ? o.pc + '% ← ' + n.pc + '%' : '', (o.ae || '') != (n.ae || '') ? T('إنجاز فعلي: ', 'Finish: ') + (n.ae || '—') : '', (o.as || '') != (n.as || '') ? T('بداية فعلية: ', 'Start: ') + (n.as || '—') : ''].filter(Boolean).join(' · ') : '';
      return '<tr><td><span class="' + (lab[z.st] || ['', ''])[1] + '" style="border-radius:99px;padding:1px 8px;white-space:nowrap">' + T(lab[z.st][0], z.st) + '</span></td><td>' + (L.row ? T('صف ', 'Row ') + L.row : '') + '</td><td><b>' + esc(z.n || L.n || '') + '</b><div class="mut">' + esc(L.pname || '') + '</div></td><td>' + esc(d) + (z.why ? '<div style="color:#b3261e">' + esc(z.why) + '</div>' : '') + (z.warn ? '<div style="color:#8a5a00">⚠ ' + esc(z.warn) + '</div>' : '') + '</td></tr>';
    }).join('');
    box('<h3>🔎 ' + T('معاينة قبل التطبيق', 'Preview before applying') + '</h3><div class="mut">' + esc(fname) + T(' — لم يُطبَّق شيء بعد.', ' — nothing applied yet.') + '</div>' +
      '<div class="kp"><span class="ok">' + T('سيتغير ', 'Will change ') + c.change + '</span><span>' + T('بلا تغيير ', 'Unchanged ') + c.same + '</span>' + (c.conflict ? '<span class="wa">' + T('تعارض ', 'Conflicts ') + c.conflict + '</span>' : '') + (c.error ? '<span class="bad">' + T('أخطاء ', 'Errors ') + c.error + '</span>' : '') + (c.warn ? '<span class="wa">' + T('تنبيهات ', 'Warnings ') + c.warn + '</span>' : '') + '</div>' +
      (tr ? '<div class="tw"><table><tr><th></th><th>' + T('الصف', 'Row') + '</th><th>' + T('المهمة', 'Task') + '</th><th>' + T('التغيير', 'Change') + '</th></tr>' + tr + '</table></div>' : '') +
      (c.conflict ? '<p class="mut">' + T('صفوف التعارض لن تُطبَّق لأنها تغيّرت في النظام بعد تنزيلك. نزّل ملفًا جديدًا إذا أردت تحديثها.', 'Conflicting rows are skipped. Download a new file to update them.') + '</p>' : '') +
      '<div class="rw">' + (c.change ? '<button class="p" id="xlgo" onclick="IDOXL._apply()">' + T('طبّق التغييرات الصحيحة (', 'Apply valid changes (') + c.change + ')</button>' : '') + '<button onclick="IDOXL.close()">' + T('إلغاء', 'Cancel') + '</button></div>');
  }
  async function apply() {
    if (!PEND || !PEND.rows.length) return close(); var b = document.getElementById('xlgo'); if (b) b.disabled = true;
    var r = await SB().rpc('xl_tasks_apply', { p_rows: PEND.rows, p_dry: false, p_file: PEND.fname });
    if (r.error) return fail(errMsg(r.error));
    var res = (r.data && r.data.rows) || [], ok = r.data.applied || 0, nok = res.filter(function (z) { return z.st != 'done' && z.st != 'same'; });
    box('<h3>✅ ' + T('تم تحديث ', 'Updated ') + ok + T(' مهمة', ' tasks') + '</h3>' + (nok.length ? '<p class="mut">' + T('لم تُطبَّق ', 'Not applied: ') + nok.length + T(' (تغيّرت أثناء المعاينة أو رُفضت): ', ' (changed meanwhile or rejected): ') + nok.map(function (z) { return esc(z.n || '') + ' — ' + esc(z.why || ''); }).join('، ') + '</p>' : '') + '<p class="mut">' + T('سُجّل التحديث في سجل الخطة بعبارة «عبر Excel».', 'Logged in the plan history as “via Excel”.') + '</p><div class="rw"><button class="p" onclick="IDOXL.close()">' + T('إغلاق', 'Close') + '</button></div>');
    var cb = PEND.onDone; PEND = null; try { if (cb) cb(); } catch (e) { }
  }

  /* ---------- التحديث السريع ---------- */
  var Q = null;
  async function quick(onDone) {
    await cfg(); if (!on('quick')) return fail(T('هذه الخاصية موقوفة من الإعدادات.', 'This feature is turned off in settings.'));
    busy(T('جارٍ تحميل مهامك…', 'Loading your tasks…'));
    var r = await SB().rpc('xl_tasks', { p_pcode: null }); if (r.error) return fail(errMsg(r.error));
    Q = { rows: (r.data || []).filter(function (x) { return x.can && x.pc < 100; }), ch: {}, onDone: onDone };
    if (!Q.rows.length) return done(T('لا توجد مهام جارية', 'No open tasks'), T('كل مهامك في الخطط المعتمدة منجزة.', 'All your tasks are done.'));
    qdraw();
  }
  function qdraw() {
    var td = today(), opts = function (v) { var h = ''; for (var i = 0; i <= 100; i += 10) h += '<option value="' + i + '"' + (i == v ? ' selected' : '') + '>' + i + '%</option>'; if (v % 10) h = '<option value="' + v + '" selected>' + v + '%</option>' + h; return h; };
    var late = function (x) { return x.e && x.e < td; };
    var rs = Q.rows.slice().sort(function (a, b) { return (late(b) - late(a)) || String(a.e || '9').localeCompare(String(b.e || '9')); });
    var nch = Object.keys(Q.ch).length;
    box('<h3>⚡ ' + T('تحديث سريع لمهامي', 'Quick update') + '</h3><div class="mut">' + T('غيّر النسبة لأي مهمة ثم «حفظ». المتأخرة أولًا.', 'Change any percentage, then Save. Late first.') + '</div>' +
      rs.map(function (x) { var k = x.pid + '|' + x.tid, c = Q.ch[k] || {}, v = c.pc != null ? c.pc : x.pc;
        return '<div class="qi' + (Q.ch[k] ? ' ch' : '') + '"><b>' + esc(x.n) + '</b><div class="mut">' + esc(x.pname || x.pcode) + (x.e ? ' · ' + T('الموعد ', 'due ') + x.e : '') + (late(x) ? ' · <span style="color:#b3261e">' + T('متأخرة', 'late') + '</span>' : '') + '</div>' +
          '<div class="qg"><label>' + T('الإنجاز', 'Progress') + '<select onchange="IDOXL._q(\'' + k + '\',\'pc\',this.value)">' + opts(v) + '</select></label>' +
          (+v >= 100 ? '<label>' + T('تاريخ الإنجاز', 'Finished on') + '<input type="date" max="' + td + '" value="' + (c.ae || td) + '" onchange="IDOXL._q(\'' + k + '\',\'ae\',this.value)"></label>' : '') + '</div></div>'; }).join('') +
      '<div class="rw" style="position:sticky;bottom:0;background:#fff;padding-top:8px"><button class="p" id="xlqs" ' + (nch ? '' : 'disabled') + ' onclick="IDOXL._qsave()">' + T('حفظ', 'Save') + (nch ? ' (' + nch + ')' : '') + '</button><button onclick="IDOXL.close()">' + T('إغلاق', 'Close') + '</button></div>');
  }
  function qset(k, f, v) { var x = Q.rows.find(function (r) { return r.pid + '|' + r.tid == k; }); if (!x) return; var c = Q.ch[k] || {}; c[f] = f == 'pc' ? +v : v; if (f == 'pc' && +v == x.pc) delete c.pc; if (f == 'pc' && +v < 100) delete c.ae; if (Object.keys(c).length) Q.ch[k] = c; else delete Q.ch[k]; var y = window.scrollY, o = document.getElementById('xlw'), st = o ? o.scrollTop : 0; qdraw(); var o2 = document.getElementById('xlw'); if (o2) o2.scrollTop = st; }
  async function qsave() {
    var b = document.getElementById('xlqs'); if (b) b.disabled = true;
    var rows = Object.keys(Q.ch).map(function (k) { var x = Q.rows.find(function (r) { return r.pid + '|' + r.tid == k; }), c = Q.ch[k]; var y = { pid: x.pid, tid: x.tid, stamp: x.stamp || '' }; if (c.pc != null) y.pc = c.pc; if ((c.pc != null ? c.pc : x.pc) >= 100) y.ae = c.ae || today(); return y; });
    var r = await SB().rpc('xl_tasks_apply', { p_rows: rows, p_dry: false, p_file: T('تحديث سريع', 'Quick update') });
    if (r.error) return fail(errMsg(r.error));
    var res = (r.data && r.data.rows) || [], bad = res.filter(function (z) { return z.st != 'done' && z.st != 'same'; });
    box('<h3>✅ ' + T('تم تحديث ', 'Updated ') + (r.data.applied || 0) + T(' مهمة', ' tasks') + '</h3>' + (bad.length ? '<p class="mut">' + bad.map(function (z) { return esc(z.n || '') + ' — ' + esc(z.why || ''); }).join('<br>') + '</p>' : '') + '<div class="rw"><button class="p" onclick="IDOXL.close()">' + T('إغلاق', 'Close') + '</button></div>');
    try { if (Q.onDone) Q.onDone(); } catch (e) { }
  }

  window.IDOXL = { cfg: cfg, on: on, download: download, upload: upload, quick: quick, close: close, _apply: apply, _q: qset, _qsave: qsave, _parse: parse, _preview: preview };
  setTimeout(function () { if (SB()) cfg(); }, 400);
})();
