/* مخطط شبكة المشروع (Project Network Diagram — Activity on Node) + حساب المسار الحرج
   الاستخدام: NetDiag.open(tasks,{title,isWork}) أو NetDiag.html(tasks,{...}) داخل الصفحة.
   tasks: [{id,p,n,s,e,dep:[{t,y,l}],ms,pc,w,wn}] — تُستخدم المهام الطرفية (التي ليس لها أبناء). */
(function () {
  function ar() { try { return (localStorage.getItem('lang') || document.documentElement.lang || 'ar').slice(0, 2) !== 'en'; } catch (e) { return true; } }
  function L(a, b) { return ar() ? a : b; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function dn(s) { if (!s) return NaN; var t = Date.parse(String(s).slice(0, 10) + 'T00:00:00Z'); return isNaN(t) ? NaN : Math.floor(t / 864e5); }
  function fd(n) { if (n == null || isNaN(n)) return '—'; var d = new Date(n * 864e5); return ('0' + d.getUTCDate()).slice(-2) + '/' + ('0' + (d.getUTCMonth() + 1)).slice(-2); }
  function fdl(n) { if (n == null || isNaN(n)) return '—'; var d = new Date(n * 864e5); return ('0' + d.getUTCDate()).slice(-2) + '/' + ('0' + (d.getUTCMonth() + 1)).slice(-2) + '/' + d.getUTCFullYear(); }

  /* ===== حساب المسار الحرج (أيام عمل) ===== */
  function cpm(tasks, o) {
    o = o || {};
    var isW = o.isWork || function (n) { return true; };
    var by = {}, kids = {};
    tasks.forEach(function (x) { by[x.id] = x; if (x.p) (kids[x.p] = kids[x.p] || []).push(x); });
    var lv = tasks.filter(function (x) { return !kids[x.id] && !isNaN(dn(x.s)) && !isNaN(dn(x.e)); });
    var ids = {}; lv.forEach(function (x) { ids[x.id] = 1; });
    /* اعتماديات على مرحلة = اعتماد على كل مهامها الطرفية */
    function leavesOf(id) { var r = [], st = [id]; while (st.length) { var c = st.pop(); if (ids[c]) r.push(c); (kids[c] || []).forEach(function (k) { st.push(k.id); }); } return r; }
    var preds = {}, succs = {}, any = false;
    lv.forEach(function (x) { preds[x.id] = []; succs[x.id] = succs[x.id] || []; });
    function addDep(xid, d) { leavesOf(d.t).forEach(function (t) { if (t === xid) return; preds[xid].push({ t: t, y: d.y || 'FS', l: +d.l || 0 }); (succs[t] = succs[t] || []).push({ to: xid, y: d.y || 'FS', l: +d.l || 0 }); any = true; }); }
    lv.forEach(function (x) {
      var c = x, g = 0;
      while (c && g++ < 12) { (c.dep || []).forEach(function (d) { addDep(x.id, d); }); c = c.p ? by[c.p] : null; }
    });
    if (!lv.length) return { lv: lv, any: false, crit: {}, info: {} };
    var lo = Math.min.apply(null, lv.map(function (x) { return dn(x.s); })), hi = Math.max.apply(null, lv.map(function (x) { return dn(x.e); })) + 400, IX = {}, c = 0, REV = {};
    for (var n = lo; n <= hi; n++) { IX[n] = c; if (isW(n)) { REV[c] = n; c++; } }
    function wi(n) { return IX[n] != null ? IX[n] : (n < lo ? 0 : c); }
    function back(i) { if (REV[i] != null) return REV[i]; var k = i; while (k > 0 && REV[k] == null) k--; return REV[k]; }
    var ES = {}, EF = {}, du = {};
    lv.forEach(function (x) { var a = dn(x.s), b = dn(x.e); var s = wi(a), e = wi(b); while (!isW(a) && a < b) { a++; s = wi(a); } du[x.id] = x.ms ? 0 : Math.max(1, (isW(b) ? e + 1 : e) - s); ES[x.id] = s; EF[x.id] = s + du[x.id]; });
    /* ترتيب طوبولوجي */
    var indeg = {}; lv.forEach(function (x) { indeg[x.id] = preds[x.id].length; });
    var q = lv.filter(function (x) { return !indeg[x.id]; }).map(function (x) { return x.id; }), order = [];
    while (q.length) { var k = q.shift(); order.push(k); (succs[k] || []).forEach(function (e) { if (--indeg[e.to] === 0) q.push(e.to); }); }
    var cyc = order.length < lv.length;
    if (cyc) lv.forEach(function (x) { if (order.indexOf(x.id) < 0) order.push(x.id); });
    var end = Math.max.apply(null, lv.map(function (x) { return EF[x.id]; })), LS = {}, LF = {};
    for (var i = order.length - 1; i >= 0; i--) {
      var id = order[i], lf = end, ls = null;
      (succs[id] || []).forEach(function (e) {
        if (LS[e.to] == null) return;
        if (e.y === 'FS') lf = Math.min(lf, LS[e.to] - e.l);
        else if (e.y === 'FF') lf = Math.min(lf, LF[e.to] - e.l);
        else if (e.y === 'SS') { var v = LS[e.to] - e.l; ls = ls == null ? v : Math.min(ls, v); }
        else { var v2 = LF[e.to] - e.l; ls = ls == null ? v2 : Math.min(ls, v2); }
      });
      var s2 = lf - du[id]; if (ls != null && ls < s2) s2 = ls; LS[id] = s2; LF[id] = s2 + du[id];
    }
    var crit = {}, info = {}, linked = {};
    lv.forEach(function (x) { if (preds[x.id].length || (succs[x.id] || []).length) linked[x.id] = 1; });
    lv.forEach(function (x) {
      var fl = LS[x.id] - ES[x.id];
      /* بلا اعتماديات: الحرج هو ما ينتهي في آخر يوم للمشروع فقط */
      var isC = any ? (fl <= 0 && (linked[x.id] || EF[x.id] === end)) : EF[x.id] === end;
      if (isC) crit[x.id] = 1;
      info[x.id] = { ES: back(ES[x.id]), EF: back(Math.max(ES[x.id], EF[x.id] - 1)), LS: back(LS[x.id]), LF: back(Math.max(LS[x.id], LF[x.id] - 1)), fl: fl, du: du[x.id] };
    });
    var endD = Math.max.apply(null, lv.map(function (x) { return info[x.id].EF; }));
    return { lv: lv, any: any, crit: crit, info: info, preds: preds, succs: succs, cyc: cyc, by: by, kids: kids, end: endD };
  }

  /* ===== رسم المخطط ===== */
  var ST = { onlyCrit: false };
  function build(tasks, o) {
    o = o || {};
    var R = cpm(tasks, o), lv = R.lv;
    if (!lv.length) return '<div class="nd-empty">' + L('لا توجد أنشطة بتواريخ لعرض مخطط الشبكة.', 'No dated activities to draw.') + '</div>';
    /* المستوى = أطول سلسلة من الأسلاف؛ غير المرتبط يُرتَّب حسب تاريخ بدايته */
    var lvl = {}, memo = {};
    function L0(id, g) { if (memo[id] != null) return memo[id]; if (g > 200) return 0; var m = 0; (R.preds[id] || []).forEach(function (p) { m = Math.max(m, L0(p.t, g + 1) + 1); }); memo[id] = m; return m; }
    lv.forEach(function (x) { lvl[x.id] = L0(x.id, 0); });
    if (!R.any) { var ds = lv.map(function (x) { return dn(x.s); }).filter(function (v, i, a) { return a.indexOf(v) === i; }).sort(function (a, b) { return a - b; }); lv.forEach(function (x) { lvl[x.id] = ds.indexOf(dn(x.s)); }); }
    var cols = {}; lv.forEach(function (x) { (cols[lvl[x.id]] = cols[lvl[x.id]] || []).push(x); });
    var phaseOf = function (x) { var c = x, g = 0; while (c && c.p && R.by[c.p] && g++ < 12) c = R.by[c.p]; return c && c !== x ? c.n : ''; };
    var nCols = Math.max.apply(null, Object.keys(cols).map(Number)) + 1;
    var NW = 196, NH = 112, GX = 88, GY = 40, PX = 100, PY = 34, pos = {}, maxRows = 0;
    for (var ci = 0; ci < nCols; ci++) {
      var col = (cols[ci] || []).sort(function (a, b) { return (R.crit[b.id] ? 1 : 0) - (R.crit[a.id] ? 1 : 0) || dn(a.s) - dn(b.s); });
      col.forEach(function (x, ri) { pos[x.id] = { x: PX + ci * (NW + GX), y: PY + ri * (NH + GY) }; });
      maxRows = Math.max(maxRows, col.length);
    }
    var W = PX * 2 + nCols * (NW + GX) - GX, H = PY * 2 + maxRows * (NH + GY) - GY;
    var rtl = ar();
    function X(x) { return rtl ? W - x : x; }
    var midY = PY + (H - PY * 2) / 2;
    var starts = lv.filter(function (x) { return !(R.preds[x.id] || []).length; }), ends = lv.filter(function (x) { return !(R.succs[x.id] || []).length; });
    var svg = [];
    svg.push('<defs><marker id="ndA" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="#9aa7b4"/></marker><marker id="ndC" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="#d1101d"/></marker></defs>');
    /* توجيه الأسهم بزوايا قائمة: خروج أفقي ← قناة رأسية في الفراغ بين الأعمدة ← ممر أفقي بين الصفوف ← دخول أفقي للمهمة */
    var oc = ST.onlyCrit, E = [], CH = {}, CO = {};
    function colOfX(x) { return Math.round((x - PX) / (NW + GX)); }
    function addE(x1, y1, x2, y2, crit, dim, tRowTop) {
      var e = { x1: x1, y1: y1, x2: x2, y2: y2, crit: crit, dim: dim };
      var c1 = x1 + GX / 2, c2 = x2 - GX / 2;
      e.k1 = 'v' + Math.round(c1); (CH[e.k1] = CH[e.k1] || []).push(e);
      if (c2 - c1 > 4 && Math.abs(y2 - y1) > 1) {
        e.span = true; e.c2raw = c2; e.k2 = 'v' + Math.round(c2); (CH[e.k2] = CH[e.k2] || []).push(e);
        e.yc = tRowTop - GY / 2; e.kc = 'h' + Math.round(e.yc); (CO[e.kc] = CO[e.kc] || []).push(e);
      }
      e.c1raw = c1; E.push(e);
    }
    lv.forEach(function (x) {
      (R.preds[x.id] || []).forEach(function (p) {
        var A = pos[p.t], B = pos[x.id]; if (!A || !B) return;
        var c = R.crit[p.t] && R.crit[x.id] && (R.info[x.id].ES >= R.info[p.t].EF || p.y !== 'FS');
        addE(A.x + NW, A.y + NH / 2, B.x, B.y + NH / 2, c, oc && !c, B.y);
      });
    });
    var sx = 18, ex = W - 18;
    starts.forEach(function (x) { var B = pos[x.id]; addE(sx + 22, midY, B.x, B.y + NH / 2, R.crit[x.id], oc && !R.crit[x.id], B.y); });
    ends.forEach(function (x) { var A = pos[x.id]; addE(A.x + NW, A.y + NH / 2, ex - 22, midY, R.crit[x.id], oc && !R.crit[x.id], A.y); });
    /* توزيع المسارات داخل كل قناة حتى لا تتطابق الخطوط */
    function lanes(map, room, key) {
      Object.keys(map).forEach(function (k) {
        var arr = map[k], seen = [], n;
        arr.forEach(function (e) { if (seen.indexOf(e) < 0) seen.push(e); });
        seen.sort(function (a, b) { return (a.y2 - b.y2) || (a.y1 - b.y1); });
        n = seen.length; var st = n > 1 ? Math.min(9, room / (n - 1)) : 0;
        seen.forEach(function (e, i) { var o = (i - (n - 1) / 2) * st; if (e.k1 === k && key === 'v') e.o1 = o; if (e.k2 === k && key === 'v') e.o2 = o; if (key === 'h') e.oc = o; });
      });
    }
    lanes(CH, GX - 36, 'v'); lanes(CO, GY - 16, 'h');
    function rp(pts) {
      var r = 7, d = 'M' + X(pts[0][0]) + ',' + pts[0][1];
      for (var i = 1; i < pts.length; i++) {
        var P = pts[i], N = pts[i + 1];
        if (!N) { d += ' L' + X(P[0]) + ',' + P[1]; break; }
        var Q = pts[i - 1], l1 = Math.abs(P[0] - Q[0]) + Math.abs(P[1] - Q[1]), l2 = Math.abs(N[0] - P[0]) + Math.abs(N[1] - P[1]), rr = Math.min(r, l1 / 2, l2 / 2);
        var ax = P[0] - Math.sign(P[0] - Q[0]) * rr, ay = P[1] - Math.sign(P[1] - Q[1]) * rr, bx = P[0] + Math.sign(N[0] - P[0]) * rr, by = P[1] + Math.sign(N[1] - P[1]) * rr;
        d += ' L' + X(ax) + ',' + ay + ' Q' + X(P[0]) + ',' + P[1] + ' ' + X(bx) + ',' + by;
      }
      return d;
    }
    function draw(e) {
      var c1 = e.c1raw + (e.o1 || 0), pts;
      if (Math.abs(e.y2 - e.y1) < 1) pts = [[e.x1, e.y1], [e.x2, e.y2]];
      else if (!e.span) pts = [[e.x1, e.y1], [c1, e.y1], [c1, e.y2], [e.x2, e.y2]];
      else { var c2 = e.c2raw + (e.o2 || 0), yc = e.yc + (e.oc || 0); pts = [[e.x1, e.y1], [c1, e.y1], [c1, yc], [c2, yc], [c2, e.y2], [e.x2, e.y2]]; }
      var cr = e.crit;
      return '<path d="' + rp(pts) + '" fill="none" stroke="' + (cr ? '#d1101d' : '#a3afba') + '" stroke-width="' + (cr ? 3.2 : 1.6) + '" stroke-linejoin="round" marker-end="url(#' + (cr ? 'ndC' : 'ndA') + ')" opacity="' + (e.dim ? .12 : 1) + '"/>';
    }
    E.filter(function (e) { return !e.crit; }).forEach(function (e) { svg.push(draw(e)); });
    E.filter(function (e) { return e.crit; }).forEach(function (e) { svg.push(draw(e)); });
    svg.push('<circle cx="' + X(sx) + '" cy="' + midY + '" r="22" fill="#14324a"/><text x="' + X(sx) + '" y="' + (midY + 4) + '" text-anchor="middle" font-size="11" font-weight="800" fill="#fff">' + L('بداية', 'Start') + '</text>');
    svg.push('<circle cx="' + X(ex) + '" cy="' + midY + '" r="22" fill="#14324a"/><text x="' + X(ex) + '" y="' + (midY + 4) + '" text-anchor="middle" font-size="11" font-weight="800" fill="#fff">' + L('نهاية', 'End') + '</text>');
    /* العُقد */
    lv.forEach(function (x) {
      var P0 = pos[x.id], I = R.info[x.id], c = !!R.crit[x.id], dim = oc && !c, x0 = rtl ? W - P0.x - NW : P0.x, y0 = P0.y;
      var name = String(x.n || '—'); if (name.length > 26) name = name.slice(0, 25) + '…';
      var ph = phaseOf(x); if (ph.length > 30) ph = ph.slice(0, 29) + '…';
      var col = c ? '#d1101d' : '#9fb3c4', head = c ? '#d1101d' : '#eef3f8', ht = c ? '#fff' : '#41566b', pc = Math.max(0, Math.min(100, +x.pc || 0));
      var c1 = x0 + NW / 3, c2 = x0 + 2 * NW / 3;
      svg.push('<g class="nd-n" opacity="' + (dim ? .18 : 1) + '"><title>' + esc((x.n || '') + (ph ? ' — ' + ph : '') + '\n' + L('بداية مبكرة ', 'ES ') + fdl(I.ES) + ' · ' + L('نهاية مبكرة ', 'EF ') + fdl(I.EF) + '\n' + L('بداية متأخرة ', 'LS ') + fdl(I.LS) + ' · ' + L('نهاية متأخرة ', 'LF ') + fdl(I.LF) + '\n' + L('السماح ', 'Float ') + I.fl + L(' يوم عمل', ' wd')) + '</title>' +
        '<rect x="' + x0 + '" y="' + y0 + '" width="' + NW + '" height="' + NH + '" rx="10" fill="#fff" stroke="' + col + '" stroke-width="' + (c ? 3 : 1.4) + '"/>' +
        '<path d="M' + x0 + ',' + (y0 + 28) + 'V' + (y0 + 10) + 'a10,10 0 0 1 10,-10H' + (x0 + NW - 10) + 'a10,10 0 0 1 10,10V' + (y0 + 28) + 'z" fill="' + head + '"/>' +
        '<line x1="' + c1 + '" y1="' + y0 + '" x2="' + c1 + '" y2="' + (y0 + 28) + '" stroke="' + (c ? '#ffffff66' : '#d5dfe8') + '"/><line x1="' + c2 + '" y1="' + y0 + '" x2="' + c2 + '" y2="' + (y0 + 28) + '" stroke="' + (c ? '#ffffff66' : '#d5dfe8') + '"/>' +
        '<text x="' + (x0 + NW / 6) + '" y="' + (y0 + 18) + '" text-anchor="middle" font-size="10.5" font-weight="700" fill="' + ht + '">' + fd(rtl ? I.EF : I.ES) + '</text>' +
        '<text x="' + (x0 + NW / 2) + '" y="' + (y0 + 18) + '" text-anchor="middle" font-size="10.5" font-weight="800" fill="' + ht + '">' + I.du + L('ي', 'd') + '</text>' +
        '<text x="' + (x0 + 5 * NW / 6) + '" y="' + (y0 + 18) + '" text-anchor="middle" font-size="10.5" font-weight="700" fill="' + ht + '">' + fd(rtl ? I.ES : I.EF) + '</text>' +
        '<text x="' + (x0 + NW / 2) + '" y="' + (y0 + 50) + '" text-anchor="middle" font-size="12.5" font-weight="800" fill="#14324a">' + (x.ms ? '◆ ' : '') + esc(name) + '</text>' +
        (ph ? '<text x="' + (x0 + NW / 2) + '" y="' + (y0 + 66) + '" text-anchor="middle" font-size="10" fill="#7b8a99">' + esc(ph) + '</text>' : '') +
        '<rect x="' + (x0 + 12) + '" y="' + (y0 + 72) + '" width="' + (NW - 24) + '" height="4" rx="2" fill="#eef2f6"/><rect x="' + (rtl ? x0 + 12 + (NW - 24) * (1 - pc / 100) : x0 + 12) + '" y="' + (y0 + 72) + '" width="' + ((NW - 24) * pc / 100) + '" height="4" rx="2" fill="' + (c ? '#d1101d' : '#3EA3DC') + '"/>' +
        '<line x1="' + x0 + '" y1="' + (y0 + 82) + '" x2="' + (x0 + NW) + '" y2="' + (y0 + 82) + '" stroke="#e3eaf0"/><line x1="' + c1 + '" y1="' + (y0 + 82) + '" x2="' + c1 + '" y2="' + (y0 + NH) + '" stroke="#e3eaf0"/><line x1="' + c2 + '" y1="' + (y0 + 82) + '" x2="' + c2 + '" y2="' + (y0 + NH) + '" stroke="#e3eaf0"/>' +
        '<text x="' + (x0 + NW / 6) + '" y="' + (y0 + 101) + '" text-anchor="middle" font-size="10.5" fill="#5b6b7b">' + fd(rtl ? I.LF : I.LS) + '</text>' +
        '<text x="' + (x0 + NW / 2) + '" y="' + (y0 + 101) + '" text-anchor="middle" font-size="10.5" font-weight="800" fill="' + (c ? '#d1101d' : '#1c7a45') + '">' + (c ? L('حرج', 'Critical') : L('سماح ', 'Float ') + I.fl) + '</text>' +
        '<text x="' + (x0 + 5 * NW / 6) + '" y="' + (y0 + 101) + '" text-anchor="middle" font-size="10.5" fill="#5b6b7b">' + fd(rtl ? I.LS : I.LF) + '</text></g>');
    });
    var critL = lv.filter(function (x) { return R.crit[x.id]; }).sort(function (a, b) { return R.info[a.id].ES - R.info[b.id].ES; });
    var note = !R.any ? '<div class="nd-warn">⚠️ ' + L('لا توجد اعتماديات بين الأنشطة، لذلك رُتّبت حسب تاريخ بدايتها، والمسار الحرج هنا هو الأنشطة التي تنتهي في آخر يوم للمشروع فقط. اربط الأنشطة ببعضها ليظهر المسار الحرج الحقيقي.', 'No links between activities: arranged by start date; only activities ending on the last day are marked critical. Link activities to see the real critical path.') + '</div>'
      : R.cyc ? '<div class="nd-warn">⚠️ ' + L('توجد حلقة في الاعتماديات؛ قد لا يكون الحساب دقيقًا.', 'There is a dependency loop; results may be inaccurate.') + '</div>' : '';
    var leg = '<div class="nd-leg"><span><i class="c"></i>' + L('نشاط حرج (أي تأخير فيه يؤخر المشروع)', 'Critical activity (any delay delays the project)') + '</span><span><i></i>' + L('نشاط له سماح', 'Activity with float') + '</span><span class="box"><b>' + L('بداية مبكرة | المدة | نهاية مبكرة', 'ES | Dur | EF') + '</b><b>' + L('الاسم والمرحلة', 'Name & phase') + '</b><b>' + L('بداية متأخرة | السماح | نهاية متأخرة', 'LS | Float | LF') + '</b></span></div>';
    var sum = '<div class="nd-sum"><b>🔴 ' + L('المسار الحرج', 'Critical path') + ' (' + critL.length + ')</b>' + (critL.length ? '<div class="nd-chain">' + critL.map(function (x) { return '<span>' + esc(x.n || '—') + '<small>' + fd(R.info[x.id].ES) + ' ← ' + fd(R.info[x.id].EF) + '</small></span>'; }).join('<i>' + (rtl ? '←' : '→') + '</i>') + '</div>' : '') + '<small>' + L('نهاية المشروع: ', 'Project end: ') + fdl(R.end) + '</small></div>';
    var id = 'nd' + Math.random().toString(36).slice(2, 8);
    return '<div class="nd" id="' + id + '">' + note + sum + '<div class="nd-tb"><button data-ndz="out">−</button><button data-ndz="fit">⤢</button><button data-ndz="in">＋</button><label><input type="checkbox" data-ndc ' + (oc ? 'checked' : '') + '> ' + L('إبراز المسار الحرج فقط', 'Highlight critical path only') + '</label>' + (o.noFs ? '' : '<button data-ndf>⛶ ' + L('ملء الشاشة', 'Full screen') + '</button>') + '</div><div class="nd-vp" dir="ltr"><div class="nd-in" style="width:' + W + 'px;height:' + H + 'px"><svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" font-family="inherit">' + svg.join('') + '</svg></div></div>' + leg + '</div>';
  }

  /* تكبير وتحريك */
  var LAST = { tasks: null, o: null };
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.nd [data-ndz],.nd [data-ndf]'); if (!b) return;
    var nd = b.closest('.nd'), vp = nd.querySelector('.nd-vp'), inn = nd.querySelector('.nd-in');
    if (b.hasAttribute('data-ndf')) { open(LAST.tasks, LAST.o); return; }
    var k = +(inn.dataset.k || 1), z = b.dataset.ndz;
    if (z === 'fit') k = Math.max(.55, Math.min(1, (vp.clientWidth - 8) / inn.offsetWidth));
    else k = Math.max(.25, Math.min(2.5, k * (z === 'in' ? 1.25 : .8)));
    inn.dataset.k = k; inn.style.transform = 'scale(' + k + ')'; inn.style.marginBottom = (inn.offsetHeight * (k - 1)) + 'px'; inn.style.marginRight = (inn.offsetWidth * (k - 1)) + 'px';
  });
  document.addEventListener('change', function (e) {
    var c = e.target.closest && e.target.closest('.nd [data-ndc]'); if (!c) return;
    ST.onlyCrit = c.checked; var nd = c.closest('.nd'); if (!LAST.tasks) return;
    var tmp = document.createElement('div'); tmp.innerHTML = build(LAST.tasks, Object.assign({}, LAST.o, { noFs: !!nd.closest('#ndfs') })); nd.replaceWith(tmp.firstChild); fitAll();
  });
  function fitAll() { document.querySelectorAll('.nd').forEach(function (nd) { var b = nd.querySelector('[data-ndz="fit"]'); if (b && !nd.dataset.fit) { nd.dataset.fit = 1; b.click(); var vp = nd.querySelector('.nd-vp'); if (vp && ar()) vp.scrollLeft = vp.scrollWidth; } }); }

  function html(tasks, o) { LAST = { tasks: tasks, o: o || {} }; css(); setTimeout(fitAll, 30); return build(tasks, o); }
  function open(tasks, o) {
    if (!tasks) return; LAST = { tasks: tasks, o: o || {} }; css();
    var old = document.getElementById('ndfs'); if (old) old.remove();
    var d = document.createElement('div'); d.id = 'ndfs';
    d.innerHTML = '<div class="ndf-h"><b>🕸 ' + L('مخطط شبكة المشروع', 'Project network diagram') + (o && o.title ? ' — ' + esc(o.title) : '') + '</b><button class="ndf-x">✕ ' + L('إغلاق', 'Close') + '</button></div><div class="ndf-b">' + build(tasks, Object.assign({}, o, { noFs: true })) + '</div>';
    document.body.appendChild(d); document.body.style.overflow = 'hidden';
    d.querySelector('.ndf-x').onclick = function () { d.remove(); document.body.style.overflow = ''; };
    setTimeout(fitAll, 30);
  }
  function css() {
    if (document.getElementById('ndcss')) return;
    var s = document.createElement('style'); s.id = 'ndcss';
    s.textContent = '.nd{background:#fff;border:1px solid #e3eaf0;border-radius:14px;padding:10px;margin:6px 0}.nd *{box-sizing:border-box}.nd-warn{background:#fff8e6;border:1px solid #f1dfb3;border-radius:10px;padding:8px 10px;font-size:12.5px;color:#6b5420;margin-bottom:8px}' +
      '.nd-sum{background:#fff5f5;border:1.5px solid #f0a8a8;border-radius:12px;padding:8px 10px;margin-bottom:8px;font-size:12.5px}.nd-sum>b{color:#d1101d;display:block;margin-bottom:4px}.nd-sum>small{color:#6b7c8c}.nd-chain{display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin:4px 0}.nd-chain span{background:#d1101d;color:#fff;border-radius:8px;padding:3px 8px;font-weight:700;font-size:12px}.nd-chain span small{display:block;font-weight:400;font-size:10px;opacity:.85}.nd-chain i{font-style:normal;color:#d1101d;font-weight:800}' +
      '.nd-tb{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:6px}.nd-tb button{border:1px solid #d5dfe8;background:#fff;border-radius:9px;min-width:34px;height:32px;padding:0 10px;font-size:14px;cursor:pointer;font-family:inherit;color:#1d5f8a;font-weight:700}.nd-tb label{display:flex;align-items:center;gap:5px;font-size:12.5px;color:#41566b}.nd-tb input{width:18px;height:18px}' +
      '.nd-vp{overflow:auto;-webkit-overflow-scrolling:touch;max-height:62vh;background:#f7fafc;border-radius:10px;border:1px solid #eef2f6}.nd-in{transform-origin:0 0}.nd .nd-in,.nd .nd-in svg,.nd .nd-in *{max-width:none!important}.nd-leg{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:11.5px;color:#5b6b7b;margin-top:8px;align-items:center}.nd-leg i{display:inline-block;width:16px;height:12px;border-radius:3px;border:1.5px solid #9fb3c4;margin-inline-end:5px;vertical-align:middle}.nd-leg i.c{border:3px solid #d1101d}.nd-leg .box{display:inline-flex;flex-direction:column;border:1px solid #d5dfe8;border-radius:8px;overflow:hidden}.nd-leg .box b{font-weight:600;padding:2px 8px;font-size:10.5px}.nd-leg .box b+b{border-top:1px solid #eef2f6}.nd-empty{padding:14px;color:#7b8a99;text-align:center}' +
      '#ndfs{position:fixed;inset:0;z-index:9900;background:#f7fafc;display:flex;flex-direction:column;padding-top:env(safe-area-inset-top,0px)}#ndfs .ndf-h{display:flex;align-items:center;gap:8px;padding:10px 12px;background:#14324a;color:#fff}#ndfs .ndf-h b{flex:1;font-size:14px}#ndfs .ndf-x{border:0;background:#fff;color:#14324a;border-radius:99px;padding:8px 16px;font-weight:800;font-size:14px;cursor:pointer;font-family:inherit}#ndfs .ndf-b{flex:1;overflow:auto;padding:8px}#ndfs .nd-vp{max-height:calc(100vh - 300px)}';
    document.head.appendChild(s);
  }
  window.NetDiag = { cpm: cpm, html: html, open: open };
})();
