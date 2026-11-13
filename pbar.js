/* روابط المشروع داخل صف وثائق المشروع (الميثاق/الخطة/طلبات التغيير/التقرير الختامي)
   تضيف: مساحة المشروع، المؤشرات، المخاطر، الموازنة، التواصل — لنفس المشروع، في نفس الصف بلا شريط مكرر. */
(function () {
  var A = function () { return (document.documentElement.lang || 'ar') != 'en'; };
  var G = function (n) { try { return Function('try{return typeof ' + n + '!="undefined"?' + n + ':null}catch(e){return null}')(); } catch (e) { return null; } };
  var IT = [
    ['myprojects.html?pc=', '🧰', 'مساحة المشروع', 'Workspace'],
    ['kpis.html?pc=', '📈', 'المؤشرات', 'KPIs'],
    ['risks.html?pc=', '🛡', 'المخاطر', 'Risks'],
    ['budget.html?pc=', '💰', 'الموازنة', 'Budget'],
    ['chat.html?p=', '💬', 'التواصل', 'Chat']
  ];
  function pcOf() {
    var r = G('cr'); if (!r || !r.id) return '';
    var d = r.data || {}; return String(d.pcode || r.code || '').trim();
  }
  function css() {
    if (document.getElementById('idopbcss')) return;
    var s = document.createElement('style'); s.id = 'idopbcss';
    s.textContent = '.rtabs .pbx{display:contents}.rtabs .pbs{flex-basis:100%;height:0;margin:0}.rtabs a.pbl{flex:1 1 auto;display:inline-flex;justify-content:center;align-items:center;gap:4px;border-radius:10px;padding:8px 10px;font-size:13px;font-weight:700;color:#3b5368;text-decoration:none;white-space:nowrap;background:rgba(255,255,255,.55)}.rtabs a.pbl:hover{background:#fff;color:#1d5f8a}@media print{.rtabs .pbx{display:none}}';
    (document.head || document.documentElement).appendChild(s);
  }
  function tick() {
    var pc = pcOf(); if (!pc) return;
    document.querySelectorAll('#app .rtabs').forEach(function (row) {
      var ex = row.querySelector('.pbx');
      if (ex && ex.getAttribute('data-pc') == pc) return;
      if (ex) ex.remove();
      css(); var a = A(), e = encodeURIComponent(pc);
      var box = document.createElement('span'); box.className = 'pbx'; box.setAttribute('data-pc', pc);
      box.innerHTML = '<i class="pbs"></i>' + IT.map(function (x) { return '<a class="pbl" href="' + x[0] + e + '">' + x[1] + ' ' + (a ? x[2] : x[3]) + '</a>'; }).join('');
      row.appendChild(box);
    });
  }
  window.IDOPB = { fromRec: function () { setTimeout(tick, 0); }, set: function () { } };
  setInterval(tick, 800); setTimeout(tick, 200);
})();
