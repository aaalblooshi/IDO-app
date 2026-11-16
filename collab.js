/* collab.js — العمل التشاركي على بند (مهمة، مؤشر، خطر): المشاركون، النقاش، الملفات.
   IDOCOL.mount(el, {kind:'task'|'kpi'|'risk', ref:'..', pcode:'..', full:bool, files:bool}) */
(function () {
  if (window.IDOCOL) return;
  var AR = function () { return (document.documentElement.lang || 'ar') != 'en'; };
  var T = function (a, e) { return AR() ? a : e; };
  var E = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var SB = function () { try { return Function('return typeof sb!="undefined"?sb:null')() || window.sb; } catch (e) { return window.sb; } };
  var ME = null, USERS = null, S = {}, N = 0;
  var CSS = '.icw{display:grid;gap:12px}.icw h5{margin:0 0 6px;font-size:14px;display:flex;align-items:center;gap:6px}.icw .icn{font-size:12px;font-weight:700;color:#5b6570}'
    + '.icw .icp{display:flex;flex-wrap:wrap;gap:6px}.icw .icp span{display:inline-flex;align-items:center;gap:6px;background:#eef6fb;border:1px solid #cfe2f1;border-radius:99px;padding:2px 6px 2px 10px;font-size:13px;font-weight:700;color:#1d5f8a}'
    + 'html[dir=rtl] .icw .icp span{padding:2px 10px 2px 6px}.icw .icp button{width:22px;height:22px;border-radius:50%!important;padding:0!important;min-height:0!important;font-size:12px!important;line-height:1;background:#fff!important}'
    + '.icw .icadd{display:flex;gap:6px;margin-top:6px}.icw .icadd select{flex:1;min-width:0;margin:0}'
    + '.icw .icc{border:1px solid #e6ecf1;border-radius:12px;background:#fff;max-height:320px;overflow-y:auto;overscroll-behavior:contain}.icw .icm{padding:8px 10px;border-top:1px solid #eef2f6}.icw .icm:first-child{border-top:0}.icw .icm.me{background:#f5fbf7}'
    + '.icw .icm b{font-size:13px}.icw .icm small{color:#7a8590;font-size:11.5px;margin-inline-start:6px}.icw .icm div{white-space:pre-wrap;font-size:14px;line-height:1.65;margin-top:2px;overflow-wrap:anywhere}'
    + '.icw .icm .icd{float:inline-end;background:none!important;border:0!important;color:#c0161f!important;font-size:12px!important;padding:0 4px!important;min-height:0!important}'
    + '.icw textarea{width:100%;box-sizing:border-box;min-height:70px;resize:vertical;margin:6px 0 4px}.icw .icf{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.icw .icf input[type=text]{flex:1;min-width:140px;margin:0}'
    + '.icw .ifl{display:grid;gap:6px}.icw .ifl>div{display:flex;gap:8px;align-items:center;border:1px solid #e6ecf1;border-radius:10px;padding:6px 10px;background:#fff}.icw .ifl a{flex:1;min-width:0;overflow-wrap:anywhere;color:#1d5f8a;font-weight:700;text-decoration:none}';
  function css() { if (document.getElementById('icw-css')) return; var s = document.createElement('style'); s.id = 'icw-css'; s.textContent = CSS; document.head.appendChild(s); }
  async function me() { if (ME) return ME; var c = SB(); try { var s = await c.auth.getSession(); ME = s.data.session.user.id; } catch (e) {} return ME; }
  async function users() { if (USERS) return USERS; var r = await SB().from('profiles').select('id,full_name').order('full_name'); USERS = (r.data || []).filter(function (u) { return u.full_name; }); return USERS; }
  var TM = function (iso) { var d = new Date(iso); return d.toLocaleDateString('en-GB', { timeZone: 'Asia/Dubai' }) + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dubai' }); };
  function err(e) { var m = (e && (e.message || e.error_description)) || String(e || ''); if (/not allowed/.test(m)) m = T('لا تملك الصلاحية لهذا الإجراء.', 'You are not allowed to do this.'); try { (window.toast || alert)(m); } catch (_) { alert(m); } }
  async function load(id) {
    var s = S[id], c = SB(); await me();
    var q = [c.rpc('item_collab_list', { p_kind: s.kind, p_ref: s.ref }), c.rpc('item_comments_list', { p_kind: s.kind, p_ref: s.ref })];
    if (s.files) q.push(c.rpc('item_files_list', { p_kind: s.kind, p_ref: s.ref }));
    var r = await Promise.all(q);
    s.col = r[0].data || []; s.com = r[1].data || []; s.fil = s.files ? (r[2].data || []) : [];
    s.talk = s.full || s.col.some(function (x) { return x.user_id == ME; });
    if (s.full && !USERS) { try { await users(); } catch (e) {} }
    draw(id);
  }
  function draw(id) {
    var s = S[id], el = document.getElementById(id); if (!el) return; var ar = AR();
    var kn = s.kind == 'task' ? T('المهمة', 'task') : s.kind == 'kpi' ? T('المؤشر', 'KPI') : T('الخطر', 'risk');
    var h = '<div class="icw">';
    h += '<div><h5>🤝 ' + T('المشاركون', 'Collaborators') + ' <span class="icn">(' + s.col.length + ')</span></h5><div class="mut" style="font-size:12.5px;margin-bottom:6px">' + T('يعلّقون ويضيفون المرفقات على ' + kn + ' دون تعديل الإنجاز أو القراءات.', 'They can comment and attach files, without changing progress or readings.') + '</div>'
      + (s.col.length ? '<div class="icp">' + s.col.map(function (x) { return '<span title="' + E(T('أضافه: ', 'Added by: ') + (x.added_by || '')) + '">' + E(x.name) + (s.full ? '<button onclick="IDOCOL._rm(\'' + id + '\',\'' + x.user_id + '\')" aria-label="' + T('إزالة', 'Remove') + '">✕</button>' : '') + '</span>'; }).join('') + '</div>' : '<div class="mut" style="font-size:13px">' + T('لا يوجد مشاركون بعد.', 'No collaborators yet.') + '</div>')
      + (s.full && USERS ? '<div class="icadd"><select id="' + id + '_u"><option value="">' + T('+ أضف مشاركًا…', '+ Add a collaborator…') + '</option>' + USERS.filter(function (u) { return u.id != ME && !s.col.some(function (x) { return x.user_id == u.id; }); }).map(function (u) { return '<option value="' + u.id + '">' + E(u.full_name) + '</option>'; }).join('') + '</select><button onclick="IDOCOL._add(\'' + id + '\')">' + T('إضافة', 'Add') + '</button></div>' : '') + '</div>';
    h += '<div><h5>💬 ' + T('النقاش', 'Discussion') + ' <span class="icn">(' + s.com.length + ')</span></h5>'
      + (s.com.length ? '<div class="icc">' + s.com.map(function (c) { return '<div class="icm' + (c.mine ? ' me' : '') + '">' + (c.mine ? '<button class="icd" onclick="IDOCOL._dc(\'' + id + '\',' + c.id + ')">' + T('حذف', 'Delete') + '</button>' : '') + '<b>' + E(c.user_name || '') + '</b> <small class="num">' + TM(c.at) + '</small><div>' + E(c.body) + '</div></div>'; }).join('') + '</div>' : '<div class="mut" style="font-size:13px">' + T('لا تعليقات بعد.', 'No comments yet.') + '</div>')
      + (s.talk ? '<textarea id="' + id + '_t" maxlength="4000" placeholder="' + T('اكتب تعليقًا أو سؤالًا للفريق…', 'Write a comment or question…') + '"></textarea><div class="icf"><button class="p" onclick="IDOCOL._send(\'' + id + '\')">' + T('إرسال', 'Send') + '</button><span class="mut" style="font-size:12px">' + T('يصل للمكلّف والمشاركين ومدير المشروع ضمن «نشاط المشاريع».', 'Reaches the owner, collaborators and the PM via project activity.') + '</span></div>' : '') + '</div>';
    if (s.files) {
      h += '<div><h5>📎 ' + T('الملفات', 'Files') + ' <span class="icn">(' + s.fil.length + ')</span></h5>'
        + (s.fil.length ? '<div class="ifl">' + s.fil.map(function (f) { return '<div><a href="#" onclick="IDOCOL._get(\'' + E(f.path) + '\',this.textContent);return false">📄 ' + E(f.title || f.path.split('/').pop().replace(/^\d{10,}_/, '')) + '</a><small class="mut">' + E(f.by_name || '') + ' · <span class="num">' + TM(f.at) + '</span></small>' + ((f.mine || s.full) ? '<button class="icd" style="color:#c0161f!important;background:none!important;border:0!important" onclick="IDOCOL._df(\'' + id + '\',' + f.id + ')">' + T('حذف', 'Delete') + '</button>' : '') + '</div>'; }).join('') + '</div>' : '<div class="mut" style="font-size:13px">' + T('لا ملفات بعد.', 'No files yet.') + '</div>')
        + (s.talk ? '<div class="icf" style="margin-top:6px"><input type="text" id="' + id + '_ft" placeholder="' + T('عنوان الملف (اختياري)', 'File title (optional)') + '"><input type="file" id="' + id + '_f"><button onclick="IDOCOL._up(\'' + id + '\')">' + T('رفع', 'Upload') + '</button></div>' : '') + '</div>';
    }
    el.innerHTML = h + '</div>';
  }
  async function run(id, fn) { try { await fn(); await load(id); } catch (e) { err(e); } }
  window.IDOCOL = {
    mount: function (el, o) { if (!el) return; css(); if (!el.id) el.id = 'icw' + (++N); S[el.id] = { kind: o.kind, ref: String(o.ref), pcode: o.pcode, full: !!o.full, files: !!o.files, col: [], com: [], fil: [] }; el.innerHTML = '<div class="mut">…</div>'; load(el.id); },
    _add: function (id) { var s = S[id], u = document.getElementById(id + '_u').value; if (!u) return; run(id, async function () { var r = await SB().rpc('item_collab_set', { p_kind: s.kind, p_ref: s.ref, p_user: u, p_add: true }); if (r.error) throw r.error; }); },
    _rm: function (id, u) { var s = S[id]; if (!confirm(T('إزالة هذا المشارك؟', 'Remove this collaborator?'))) return; run(id, async function () { var r = await SB().rpc('item_collab_set', { p_kind: s.kind, p_ref: s.ref, p_user: u, p_add: false }); if (r.error) throw r.error; }); },
    _send: function (id) { var s = S[id], t = document.getElementById(id + '_t'), v = (t.value || '').trim(); if (!v) return; run(id, async function () { var r = await SB().rpc('item_comment_add', { p_kind: s.kind, p_ref: s.ref, p_body: v }); if (r.error) throw r.error; }); },
    _dc: function (id, cid) { if (!confirm(T('حذف التعليق؟', 'Delete the comment?'))) return; run(id, async function () { var r = await SB().rpc('item_comment_del', { p_id: cid }); if (r.error) throw r.error; }); },
    _up: function (id) {
      var s = S[id], f = document.getElementById(id + '_f').files[0], tt = (document.getElementById(id + '_ft').value || '').trim(); if (!f) return err(T('اختر ملفًا أولًا.', 'Choose a file first.'));
      if (f.size > 10485760) return err(T('الحد الأقصى ١٠ ميجابايت.', 'Max 10 MB.'));
      run(id, async function () { var c = SB(), path = s.pcode + '/' + s.kind + '/' + s.ref + '/' + Date.now() + '_' + f.name.replace(/[^\w.\-]+/g, '_'); var u = await c.storage.from('item-files').upload(path, f); if (u.error) throw u.error; var r = await c.rpc('item_file_add', { p_kind: s.kind, p_ref: s.ref, p_title: tt || f.name, p_path: path, p_size: f.size, p_mime: f.type || '' }); if (r.error) { try { await c.storage.from('item-files').remove([path]); } catch (_) {} throw r.error; } });
    },
    _df: function (id, fid) { if (!confirm(T('حذف الملف؟', 'Delete the file?'))) return; run(id, async function () { var c = SB(), r = await c.rpc('item_file_del', { p_id: fid }); if (r.error) throw r.error; if (r.data) { try { await c.storage.from('item-files').remove([r.data]); } catch (_) {} } }); },
    _get: function (path, nm) { if (window.IDODL) IDODL('item-files', path, String(nm || '').replace(/^📄\s*/, '')).catch(err); }
  };
})();
