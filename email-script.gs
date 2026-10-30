/**
 * إشعارات البريد الإلكتروني — مكتب التطوير المؤسسي
 * يغطي: طلبات التغيير + ميثاق المشروع + التقرير الختامي
 *
 * قاعدة البيانات (ملف mail-notify.sql) هي التي تقرر الحدث والمستلمين،
 * وهذا السكربت يستلم الطلب ويرسل البريد فقط. لا يحتاج أي مفتاح سري من Supabase.
 */

// رابط هذا السكربت (يُستدعى من قاعدة البيانات عبر mail_url في جدول app_config) — للمرجع فقط
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby3YpEWC4aYXLWHcwTIYYqhWmuXsCbOdANid8raOLSCJvKNGITyzxv12KU1pws3IFWhXQ/exec';
// الكلمة السرية: يجب أن تطابق mail_secret في جدول app_config
const SECRET = 'crApp-7Kq29xLmP84vTzW1nB6sY5dF3';
const SENDER_NAME = 'مكتب التطوير المؤسسي';

const SERVICES = {
  cr:      { ar: 'طلب تغيير',   en: 'Change request' },
  charter: { ar: 'ميثاق مشروع', en: 'Project charter' },
  plan:    { ar: 'خطة مشروع',   en: 'Project plan' },
  closure: { ar: 'تقرير ختامي', en: 'Closure report' }
};

// نص كل حدث (المستلمون تحددهم قاعدة البيانات)
const EVENTS = {
  submitted:        { ar: 'تم الانتهاء من إعداد {svc} وإرساله للمراجعة', en: '{svcEn} has been completed and sent for review' },
  reviewerAssigned: { ar: 'تم تحديدك مراجعًا على {svc}',                 en: 'You have been assigned as reviewer on this {svcEn}' },
  reviewDone:       { ar: 'تم اعتماد المراجعة على {svc}',                en: 'The review of this {svcEn} has been completed' },
  approverAssigned: { ar: 'تم تحديدك معتمِدًا على {svc}',                en: 'You have been assigned as approver on this {svcEn}' },
  approved:         { ar: 'تم اعتماد {svc}',                             en: 'This {svcEn} has been approved' },
  reminderReview:   { ar: 'تذكير: {svc} بانتظار مراجعتك',                en: 'Reminder: this {svcEn} is waiting for your review' },
  reminderApprove:  { ar: 'تذكير: {svc} بانتظار اعتمادك',                en: 'Reminder: this {svcEn} is waiting for your approval' },
  deleteRequested:  { ar: 'طلب حذف جديد على {svc} بانتظار قرارك',          en: 'A deletion request on this {svcEn} is waiting for your decision' },
  deleteApproved:   { ar: 'تمت الموافقة على طلب حذف {svc}',               en: 'Your deletion request for this {svcEn} was approved' },
  deleteRejected:   { ar: 'تم رفض طلب حذف {svc}',                        en: 'Your deletion request for this {svcEn} was rejected' },
  reviewerRejected: { ar: 'رفض المراجع {svc} وأُحيل إلى المكتب للبتّ', en: 'The reviewer rejected this {svcEn}; it is now with the office for decision' },
  approverRejected: { ar: 'رفض المعتمِد {svc} وأُحيل إلى المكتب للبتّ', en: 'The approver rejected this {svcEn}; it is now with the office for decision' },
  reminderUpdate:   { ar: 'تذكير: يرجى تحديث إنجاز مهامك في {svc}', en: 'Reminder: please update the progress of your tasks in this {svcEn}' },
  taskUpdated:      { ar: 'تم تحديث إنجاز نشاط في {svc}', en: 'A task progress was updated in this {svcEn}' },
  taskReminder:     { ar: 'تذكير: لديك نشاط بانتظار إنجازك في {svc}', en: 'Reminder: you have a task waiting in this {svcEn}' },
  draftAssigned:    { ar: 'تم توجيه مسودة {svc} إليك لإكمالها',          en: 'A draft {svcEn} has been assigned to you to complete' }
};

function doGet() { return ContentService.createTextOutput('running'); }

function doPost(e) {
  try {
    const b = JSON.parse(e.postData.contents);
    if (b.secret !== SECRET) return out('forbidden');
    const svc = SERVICES[b.service], ev = EVENTS[b.event];
    if (!svc || !ev || !Array.isArray(b.recipients) || !b.recipients.length) return out('ignored');

    const title = b.project || b.code || '';
    const link = String(b.site || '') + String(b.page || '');
    const ar = ev.ar.replace('{svc}', svc.ar), en = ev.en.replace('{svcEn}', svc.en);
    const subject = '[' + svc.ar + '] ' + ar + ' — ' + title;
    const lead = ev.lead || {};

    const seen = {};
    b.recipients.forEach(r => {
      const to = String(r.email || '').trim().toLowerCase();
      if (!to || seen[to]) return;
      seen[to] = 1;
      const nm = String(r.name || '').trim();
      const greet = nm ? 'عزيزي/عزيزتي ' + nm + '،' : 'تحية طيبة،';
      const intro = /^(تم|رفض)/.test(ar) ? 'يرجى التكرم بالعلم بأنه ' + ar + '.' : 'نودّ إفادتكم: ' + ar.replace(/^تذكير:\s*/, '') + '.';
      const html = buildHtml(greet, intro, en, title, b, link);
      const text = greet + '\n' + intro + '\n' + title + '\n' + (b.code || '') + '\n' + link + '\n\nمع خالص التقدير،\n' + SENDER_NAME;
      MailApp.sendEmail({ to: to, subject: subject, body: text, htmlBody: html, name: SENDER_NAME });
    });
    return out('ok');
  } catch (err) {
    console.error(err && err.stack || err);
    return out('error: ' + (err && err.message || err));
  }
}

const out = t => ContentService.createTextOutput(t);
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const tr = (k, v) => '<tr><td style="padding:6px 8px;background:#f7faf8;border:1px solid #e4dfd4;width:32%;font-weight:bold">' + esc(k) + '</td><td style="padding:6px 8px;border:1px solid #e4dfd4">' + esc(v) + '</td></tr>';

function buildHtml(greet, intro, en, title, b, link) {
  return '<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #e4dfd4;border-radius:12px;overflow:hidden">' +
    '<div style="background:#0a6b3d;color:#fff;padding:14px 18px;font-size:17px;font-weight:bold">' + esc(SENDER_NAME) + '</div>' +
    '<div style="padding:18px;line-height:1.9;color:#23272b">' +
    '<div style="font-size:15px;margin-bottom:4px">' + esc(greet) + '</div>' +
    '<div style="font-size:15.5px;font-weight:bold;margin-bottom:10px">' + esc(intro) + '</div>' +
    '<table style="width:100%;border-collapse:collapse;font-size:14px">' +
    tr('اسم المشروع', title) + tr('المرجع', b.code || '') + (b.doc_no ? tr('رقم الوثيقة', b.doc_no) : '') + (b.by ? tr('بواسطة', b.by) : '') +
    (Array.isArray(b.details) ? b.details.map(function (d) { return tr(d[0], d[1]); }).join('') : '') +
    (b.note ? tr('ملاحظات', b.note) : '') +
    '</table>' +
    '<div style="text-align:center;margin:18px 0"><a href="' + esc(link) + '" style="background:#0a6b3d;color:#fff;text-decoration:none;padding:10px 22px;border-radius:99px;font-weight:bold">فتح النظام</a></div>' +
    '<div dir="ltr" style="color:#6b6f76;font-size:12.5px;border-top:1px solid #e4dfd4;padding-top:10px">' + esc(en) + ' — ' + esc(title) + ' (' + esc(b.code || '') + ')</div>' +
    '<div style="color:#6b6f76;font-size:13px;margin-top:10px">مع خالص التقدير،<br>' + esc(SENDER_NAME) + '</div>' +
    '</div></div>';
}

// اختبار يدوي: شغّل هذه الدالة مرة واحدة من المحرر لمنح صلاحية إرسال البريد
function testEmail() {
  MailApp.sendEmail(Session.getActiveUser().getEmail(), 'اختبار — مكتب التطوير المؤسسي', 'السكربت يعمل ويستطيع إرسال البريد.');
}
