/* ntf.js — دليل التنبيهات (الأسماء والمجموعات) + قراءة الإعدادات. القيم الافتراضية في الخادم (ntf_defaults). */
(function () {
  var G = [
    ['wf', ['سير عمل النماذج (الميثاق، الخطة، طلب التغيير، التقرير الختامي)', 'Form workflow'], ['submitted', 'reviewerAssigned', 'approverAssigned', 'draftAssigned', 'reviewDone', 'approved', 'reviewerRejected', 'approverRejected', 'deleteRequested', 'deleteApproved', 'deleteRejected', 'reminderReview', 'reminderApprove']],
    ['pj', ['المشاريع والفرق', 'Projects & teams'], ['pmAssigned', 'pmRemoved', 'projTransfer', 'planActive', 'grantAdded', 'assignWork', 'docAssign', 'planDraft', 'planSuggest', 'halt', 'closureDue']],
    ['tk', ['المهام', 'Tasks'], ['taskAssigned', 'taskDueSoon', 'taskOverdue', 'updDaily', 'taskUpdated', 'taskReminder', 'reminderUpdate']],
    ['kr', ['المؤشرات والمخاطر والموازنة والإنجاز', 'KPIs, risks, budget & progress'], ['kpiDue', 'kpiRed2', 'riskRequest', 'riskDecision', 'riskReview', 'riskEscalate', 'overBudget', 'progRequest', 'progDecision']],
    ['of', ['المكتب والتصعيد', 'Office & escalation'], ['escRequest', 'escDecision', 'officeRemind', 'personal']],
    ['ac', ['الحساب والصلاحيات', 'Account & access'], ['welcome', 'roleChanged', 'permExpiry']],
    ['ch', ['التواصل', 'Communication'], ['chatMention', 'chatAdd', 'chatJoinReq']],
    ['pf', ['الأداء وسجل الإنجاز', 'Performance'], ['kudos', 'mgrNote']],
    ['dg', ['الملخصات الدورية', 'Periodic summaries'], ['digest', 'officeDigest']]
  ];
  var L = {
    submitted: ['تقديم نموذج للمراجعة', 'Form submitted', 'لمكتب التطوير ومُعدّ النموذج.'],
    reviewerAssigned: ['تحديدك مراجعًا على نموذج', 'Assigned as reviewer', 'يصل المراجع المحدد.'],
    approverAssigned: ['تحديدك معتمِدًا على نموذج', 'Assigned as approver', 'يصل المعتمد المحدد.'],
    draftAssigned: ['توجيه مسودة إليك لإكمالها', 'Draft assigned to you', ''],
    reviewDone: ['اكتمال المراجعة', 'Review completed', ''],
    approved: ['اعتماد النموذج', 'Form approved', 'للمكتب والموقعين والمتابعين.'],
    reviewerRejected: ['رفض المراجع', 'Rejected by reviewer', 'لمُعدّ النموذج والمكتب.'],
    approverRejected: ['رفض المعتمِد', 'Rejected by approver', 'لمُعدّ النموذج والمكتب.'],
    deleteRequested: ['طلب حذف نموذج', 'Deletion requested', 'لمكتب التطوير.'],
    deleteApproved: ['الموافقة على طلب الحذف', 'Deletion approved', ''],
    deleteRejected: ['رفض طلب الحذف', 'Deletion rejected', ''],
    reminderReview: ['تذكير وتصعيد: بانتظار مراجعتك', 'Reminder: waiting for your review', 'حسب مدد التصعيد في الإعدادات.'],
    reminderApprove: ['تذكير وتصعيد: بانتظار اعتمادك', 'Reminder: waiting for your approval', 'حسب مدد التصعيد في الإعدادات.'],
    pmAssigned: ['إسنادك مديرًا لمشروع', 'You became a project manager', 'عند اعتماد الميثاق أو نقل المشروع إليك.'],
    pmRemoved: ['نقل المشروع منك لمدير آخر', 'Project moved to another PM', 'يصل المدير السابق.'],
    projTransfer: ['نقل المشروع تنظيميًا لوحدة أخرى', 'Project moved to another unit', 'لمدير المشروع ومُعدّ الميثاق.'],
    planActive: ['اعتماد خطة لديك فيها مهام', 'Plan approved with your tasks', 'لكل من لديه مهام في الخطة.'],
    grantAdded: ['منحك صلاحية على مشروع', 'Project access granted', ''],
    assignWork: ['تكليف بمؤشرات أو مخاطر أو مصروفات مشروع', 'Assigned KPIs / risks / spending', ''],
    docAssign: ['إسناد نموذج إليك', 'Form assigned to you', ''],
    planDraft: ['إسناد مسودة خطة إليك', 'Plan draft assigned to you', ''],
    planSuggest: ['اقتراح بند عمل في خطتك', 'Work item suggested', ''],
    halt: ['إيقاف أو إلغاء أو استئناف مشروع', 'Project suspended / cancelled / resumed', ''],
    closureDue: ['اقتراب نهاية المشروع دون تقرير ختامي', 'Project ending without closure report', 'قبل ١٤ يومًا من النهاية، ومرة بعدها.'],
    taskAssigned: ['إسناد مهمة إليك في خطة معتمدة', 'Task assigned to you', 'لحظة الإسناد.'],
    taskDueSoon: ['مهام تقترب مواعيدها', 'Tasks due soon', 'قبل الموعد بعدد الأيام المحدد أدناه.'],
    taskOverdue: ['مهام تجاوزت موعدها', 'Overdue tasks', 'مرة واحدة لكل مهمة.'],
    updDaily: ['تحديثات مطلوبة في «مهامي»', 'Updates needed in My tasks', 'حسب إعدادات التحديث.'],
    taskUpdated: ['تحديث إنجاز نشاط', 'Task progress updated', 'لمدير المشروع والمكلّف.'],
    taskReminder: ['تذكير بالبريد بمهمة من المكتب', 'Office task reminder (email)', 'يرسله المكتب يدويًا.'],
    reminderUpdate: ['تذكير بالبريد بتحديث الإنجاز', 'Progress update reminder (email)', 'يرسله المكتب يدويًا.'],
    kpiDue: ['قراءة مؤشر لم تُدخل', 'KPI reading due', ''],
    kpiRed2: ['مؤشر متأخر عن المستهدف لفترتين', 'KPI off-track two periods', 'لمسؤول المؤشر ومدير المشروع والمكتب.'],
    riskRequest: ['طلب في سجل المخاطر بانتظار القرار', 'Risk change request', ''],
    riskDecision: ['قرار على طلبك في سجل المخاطر', 'Decision on your risk request', ''],
    riskReview: ['مراجعة خطر تغيّر تقييمه', 'Risk review needed', ''],
    riskEscalate: ['تصعيد خطر مرتفع أو واقع', 'High / occurred risk escalation', ''],
    overBudget: ['تجاوز الصرف للموازنة المعتمدة', 'Spending over budget', 'لمدير المشروع ومدخلي المصروفات والمكتب، مرة شهريًا.'],
    progRequest: ['طلب اعتماد نسبة إنجاز', 'Progress approval request', ''],
    progDecision: ['قرار على طلب نسبة الإنجاز', 'Progress decision', ''],
    escRequest: ['طلب تصعيد جديد', 'New escalation request', ''],
    escDecision: ['قرار على تصعيد', 'Escalation decision', ''],
    officeRemind: ['تذكير من مكتب التطوير', 'Office reminder', 'البريد يختاره المكتب عند الإرسال.'],
    personal: ['رسالة تذكير شخصية', 'Personal reminder', 'من صفحة أداء المستخدمين.'],
    welcome: ['بريد الترحيب للحساب الجديد', 'Welcome email', 'برابط النظام، دون كلمة المرور.'],
    roleChanged: ['تغيير دورك أو إضافة دور', 'Role changed', ''],
    permExpiry: ['انتهاء صلاحية مؤقتة', 'Temporary access expiring', ''],
    chatMention: ['ذكرك في محادثة', 'Mentioned in chat', ''],
    chatAdd: ['إضافتك لمحادثة أو مجموعة', 'Added to a chat', ''],
    chatJoinReq: ['طلب انضمام لمحادثتك', 'Join request', ''],
    kudos: ['رسالة شكر في سجل الإنجاز', 'Thank-you message', ''],
    mgrNote: ['ملاحظة المدير في سجل إنجازك', 'Manager note on your record', ''],
    digest: ['الملخص الأسبوعي', 'Weekly summary', ''],
    officeDigest: ['ملخص المكتب الأسبوعي', 'Office weekly summary', '']
  };
  var DEF = null, MX = null, LDP = null;
  function sb() { try { return Function('return typeof sb!="undefined"?sb:null')() || window.sb; } catch (e) { return window.sb; } }
  function load(force) {
    if (LDP && !force) return LDP;
    LDP = (async function () {
      var c = sb();
      var [d, m] = await Promise.all([c.rpc('ntf_defaults'), c.from('app_settings').select('value').eq('key', 'ntf_matrix').maybeSingle()]);
      DEF = (d && d.data) || {}; try { MX = JSON.parse((m.data && m.data.value) || '{}') || {}; } catch (e) { MX = {}; }
      return { def: DEF, mx: MX };
    })();
    return LDP;
  }
  function cfg(k) {
    var d = (DEF || {})[k] || {}, m = (MX || {})[k] || {}, o = { in: d.in == null ? null : d.in, ml: d.ml == null ? null : d.ml, ph: 'ph' in d ? d.ph : (d.in == null ? null : d.in == 'off' ? 'off' : 'user'), md: d.md || 'now', dy: d.dy };
    if (o.ph != null && /^(on|user|off)$/.test(m.ph || '')) o.ph = m.ph;
    if (o.in != null && /^(on|user|off)$/.test(m.in || '')) o.in = m.in;
    if (o.ml != null && /^(on|user|off)$/.test(m.ml || '')) o.ml = m.ml;
    if (m.md == 'now' || (m.md == 'day' && d.dy == 1)) o.md = m.md;
    return o;
  }
  window.IDONTF = { G: G, L: L, load: load, cfg: cfg, mx: function () { return MX || {}; }, setMx: function (x) { MX = x; } };
})();
