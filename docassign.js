/* إسناد النموذج أو إضافة محرر (مكتب التطوير ومسؤول الوحدة) — يعمل في الميثاق والخطة وطلب التغيير والتقرير الختامي */
(function () {
  var CAN = {}, USERS = null;
  function ar() { try { return (typeof lang === 'undefined' ? 'ar' : lang) !== 'en'; } catch (e) { return true; } }
  function T(a, e) { return ar() ? a : e; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pcOf(svc, d) { return svc === 'charter' ? (d && d.code) : (d && d.data && d.data.pcode); }
  function can(pc) {
    if (CAN[pc] !== undefined) return Promise.resolve(CAN[pc]);
    return sb.rpc('doc_can_assign', { p_pcode: pc || '' }).then(function (r) { return (CAN[pc] = !!(r && !r.error && r.data === true)); }, function () { return false; });
  }
  function loadUsers() {
    if (USERS) return Promise.resolve(USERS);
    return sb.from('profiles').select('id,full_name').then(function (r) { USERS = (r && r.data) || []; return USERS; }, function () { return []; });
  }
  function btn(svc, d) {
    if (!d || !d.id) return '';
    var pc = pcOf(svc, d) || '';
    setTimeout(function () {
      can(pc).then(function (ok) { if (!ok) return; document.querySelectorAll('button.doca[data-id="' + d.id + '"]').forEach(function (b) { b.style.display = ''; }); });
    }, 0);
    return '<button class="doca" data-id="' + d.id + '" style="display:none" onclick="DOCA.open(\'' + svc + '\',' + d.id + ')">👥 ' + T('إسناد النموذج أو إضافة محرر', 'Assign form or add editor') + '</button>';
  }
  function open(svc, id) {
    var d = (typeof cr !== 'undefined' && cr && cr.id == id) ? cr : null; if (!d) return;
    loadUsers().then(function (U0) {
      var cur = ''; U0.forEach(function (u) { if (u.id === d.created_by) cur = u.full_name || ''; });
      var U = U0.filter(function (u) { return u.id !== d.created_by; }).sort(function (a, b) { return (a.full_name || '').localeCompare(b.full_name || '', 'ar'); });
      var NM = {}; U.forEach(function (u) { NM[u.id] = u.full_name || ''; });
      var mode = 'edit', uid = '';
      var o = document.createElement('div'); o.id = 'docaw'; o.className = 'no-dr';
      o.style.cssText = 'position:fixed;inset:0;z-index:9300;background:rgba(15,30,45,.4);display:flex;align-items:flex-end;justify-content:center';
      var draw = function (q) {
        var f = U.filter(function (u) { return !q || (u.full_name || '').toLowerCase().indexOf(q.toLowerCase()) >= 0; }).slice(0, 80);
        var M = [['edit', T('✏️ إضافة محرر مشارك', '✏️ Add a co-editor'), T('يبقى المالك كما هو، ويحصل الشخص على صلاحية التعديل والتحكم في هذا النوع من نماذج المشروع.', 'The owner stays; the person gets edit and control rights on this kind of project form.')],
                 ['transfer', T('🔁 نقل الملكية بالكامل', '🔁 Transfer ownership'), T('يصبح الشخص هو مالك النموذج ويتولى كل إجراءاته وتوقيع الإعداد إن لم يُوقَّع بعد.', 'The person becomes the owner and takes over all actions.')]];
        o.innerHTML = '<div style="background:#fff;width:min(520px,100%);max-height:88%;overflow:auto;border-radius:18px 18px 0 0;padding:14px 14px calc(14px + env(safe-area-inset-bottom,0px));box-sizing:border-box;direction:' + (ar() ? 'rtl' : 'ltr') + '">' +
          '<div style="display:flex;align-items:center;gap:8px"><b style="flex:1;font-size:15px">👥 ' + T('إسناد النموذج أو إضافة محرر', 'Assign form or add editor') + ' — ' + esc(d.code || '') + '</b><button data-x="1" style="width:32px;height:32px;border-radius:50%;border:1px solid #e3eaf0;background:#f7f9fc">✕</button></div>' +
          '<div style="font-size:12.5px;color:#6b7c8c;margin:6px 0">' + T('المالك الحالي', 'Current owner') + ': <b>' + esc(cur) + '</b></div>' +
          '<div style="display:flex;flex-direction:column;gap:6px;margin:8px 0">' + M.map(function (m) { return '<button data-m="' + m[0] + '" style="text-align:start;border:1.5px solid ' + (mode == m[0] ? '#1d5f8a' : '#e3eaf0') + ';background:' + (mode == m[0] ? '#eef6fc' : '#fff') + ';border-radius:12px;padding:9px 11px;font-family:inherit;cursor:pointer"><b style="display:block">' + m[1] + '</b><small style="color:#6b7c8c">' + m[2] + '</small></button>'; }).join('') + '</div>' +
          '<input id="doca_q" value="' + esc(q || '') + '" placeholder="' + T('ابحث عن المستخدم…', 'Search user…') + '" style="width:100%;box-sizing:border-box;border:1px solid #d5dfe8;border-radius:10px;padding:9px;font-family:inherit;font-size:14px">' +
          '<div style="display:flex;flex-direction:column;gap:5px;max-height:34vh;overflow:auto;margin-top:6px">' + f.map(function (u) { return '<button data-u="' + u.id + '" style="text-align:start;border:1px solid ' + (uid == u.id ? '#1d5f8a' : '#e3eaf0') + ';background:' + (uid == u.id ? '#1d5f8a' : '#f7f9fc') + ';color:' + (uid == u.id ? '#fff' : 'inherit') + ';border-radius:10px;padding:9px;font-family:inherit;cursor:pointer">' + esc(u.full_name || '') + '</button>'; }).join('') + '</div>' +
          '<button data-ok="1" ' + (uid ? '' : 'disabled') + ' style="width:100%;margin-top:10px;border:0;background:#0a6b3d;color:#fff;border-radius:12px;padding:11px;font-weight:800;font-size:14px;font-family:inherit;opacity:' + (uid ? 1 : .45) + '">' + T('تأكيد', 'Confirm') + '</button></div>';
        var qi = o.querySelector('#doca_q');
        qi.oninput = function () { var v = qi.value, pos = qi.selectionStart; draw(v); var n = o.querySelector('#doca_q'); n.focus(); try { n.setSelectionRange(pos, pos); } catch (e) {} };
      };
      document.body.appendChild(o); draw('');
      o.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (e.target === o || (b && b.dataset.x)) return o.remove(); if (!b) return;
        var q = (o.querySelector('#doca_q') || {}).value || '';
        if (b.dataset.m) { mode = b.dataset.m; return draw(q); }
        if (b.dataset.u) { uid = b.dataset.u; return draw(q); }
        if (b.dataset.ok && uid) {
          var nm = NM[uid] || '';
          if (!confirm(mode === 'transfer' ? T('نقل ملكية النموذج إلى «' + nm + '»؟', 'Transfer to “' + nm + '”?') : T('إضافة «' + nm + '» للتعديل والتحكم في النموذج؟', 'Add “' + nm + '” as editor?'))) return;
          sb.rpc('doc_assign', { p_svc: svc, p_id: d.id, p_user: uid, p_mode: mode }).then(function (r) {
            if (r && r.error) { alert((/could not find|schema cache/i.test(r.error.message) ? T('شغّل ملف التحديث update-oct73 أولًا. ', 'Run update-oct73 first. ') : '') + r.error.message); return; }
            o.remove();
            try { if (typeof msg === 'function') msg(mode === 'transfer' ? T('نُقلت ملكية النموذج إلى ' + nm, 'Transferred to ' + nm) : T('أُضيف ' + nm + ' للتعديل والتحكم', nm + ' added as editor')); } catch (e2) {}
            try { if (typeof openCR === 'function') openCR(d.id); } catch (e3) {}
          });
        }
      });
    });
  }
  window.DOCA = { btn: btn, open: open };
})();
