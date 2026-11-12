/* Story of the tour. Each entry is one click.
   s = scene id (see scenes.js), t = target inside the scene (omit for the whole screen),
   c = caption [ar, en], d = one short line [ar, en], n = presenter notes [ar, en], a = draw an arrow */
window.CHAPTERS=[
 {id:'open',  t:['بوابة التطوير المؤسسي','The IDO Portal']},
 {id:'glance',t:['النظام بنظرة','The system at a glance']},
 {id:'life',  t:['من الفكرة إلى الإغلاق','From idea to closure']},
 {id:'review',t:['المراجعة والاعتماد','Review and approval']},
 {id:'track', t:['المتابعة والقيادة','Track and lead']},
 {id:'talk',  t:['التواصل والرأي','Talk and feedback']},
 {id:'end',   t:['ابدأ الآن','Start now']}
];
window.STEPS=[
 // ── opening
 {ch:'open',title:1,c:['من ميثاقٍ يوحّد رؤيتنا، إلى مشروعٍ يحمل بصمتنا','From a charter that unites our vision, to a project that bears our mark'],d:['رحلة الإنجاز… تبدأ بلمسة','The journey to achievement… begins with a touch'],
  n:['رحّب بالحضور. البوابة تجمع خدمات مكتب التطوير المؤسسي: الميثاق، الخطة، طلبات التغيير، التقرير الختامي، المهام والمتابعة. اضغط للمتابعة؛ كل نقرة تنقلنا إلى شاشة حقيقية من النظام.','Welcome everyone. The portal brings together the Institutional Development Office services: charter, plan, change requests, closure report, tasks and tracking. Each click takes us to a real screen of the system.']},

 // ── chapter 1: glance
 {ch:'glance',title:1,c:['النظام بنظرة','The system at a glance'],d:['على الهاتف وعلى جهازك المكتبي','On your phone and on your desktop'],n:['نبدأ بجولة سريعة في الواجهة الرئيسية.','We start with a quick tour of the main screen.']},
 {ch:'glance',s:'phone',c:['دائمًا معك','Always with you'],d:['ثبّت البوابة على الهاتف كتطبيق','Install the portal on your phone as an app'],n:['من Safari: مشاركة ← إضافة إلى الشاشة الرئيسية. تفتح كتطبيق كامل الشاشة.','From Safari: Share → Add to Home Screen. It opens full screen like an app.']},
 {ch:'glance',s:'phone',t:'nav',a:1,c:['كل شيء على بُعد لمسة','Everything one tap away'],d:['الرئيسية · مهامي · الإشعارات · مشاريعي · المحفظة','Home · My tasks · Notifications · My projects · Portfolio'],n:['الشريط السفلي ثابت في كل الصفحات. الرقم الأحمر على «مهامي» = المهام المتأخرة.','The bottom bar stays on every page. The red number on “My tasks” counts late tasks.']},
 {ch:'glance',s:'phone',t:'create',a:1,c:['إنشاء جديد','Create new'],d:['ميثاق · خطة · طلب تغيير · تقرير ختامي','Charter · plan · change request · closure report'],n:['زر واحد لبدء أي خدمة.','One button to start any service.']},
 {ch:'glance',s:'phone',t:'chat',a:1,c:['التواصل','Chat'],d:['محادثة كل مشروع، والزملاء مباشرة','Every project’s chat, and colleagues directly'],n:['الرقم على الفقاعة = رسائل غير مقروءة.','The number on the bubble = unread messages.']},
 {ch:'glance',s:'home',c:['الصفحة الرئيسية','The home page'],d:['كل ما يخصك في شاشة واحدة','Everything about you on one screen'],n:['نفس الصفحة على جهازك المكتبي.','The same page on your desktop.']},
 {ch:'glance',s:'home',t:'summary',c:['ملخصك اليومي','Your daily summary'],d:['كم ينتظر إجراءك… وكم منها متأخر','What waits for you… and what is late'],n:['جملة واحدة تلخص ما المطلوب منك اليوم.','One sentence summarises what you need to do today.']},
 {ch:'glance',s:'home',t:'search',a:1,c:['ابحث أو اكتب أمرًا','Search or type a command'],d:['«ميثاق جديد» · رمز مشروع · اسم طلب','“new charter” · a project code · a request name'],n:['البحث يفهم الأوامر: اكتب «ميثاق جديد» وتنتقل مباشرة. اختصار: مفتاح /','Search understands commands: type “new charter” to jump straight there. Shortcut: the / key.']},
 {ch:'glance',s:'menu',t:'drawer',a:1,c:['القائمة','The menu'],d:['كل الصفحات والإعدادات','Every page and setting'],n:['تظهر العناصر حسب صلاحياتك.','Items appear according to your permissions.']},
 {ch:'glance',s:'board',c:['رحلتي','My journey'],d:['كل طلباتك ومهامك في لوحة واحدة','All your requests and tasks on one board'],n:['اللوحة مقسمة إلى أعمدة: المواثيق، الخطط، المهام، طلبات التغيير، التقارير الختامية.','The board has columns: charters, plans, tasks, change requests, closure reports.']},
 {ch:'glance',s:'board',t:'scope',c:['أنا · فريقي · الكل','Me · my team · all'],d:['غيّر النطاق بلمسة','Change the scope with one tap'],n:['«الكل» يظهر حسب نطاق رؤيتك.','“All” follows your view scope.']},
 {ch:'glance',s:'board',t:'chips',c:['بانتظار إجرائي · متأخرة','Awaiting me · late'],d:['اضغط أي رقم لتصفية اللوحة','Tap any number to filter the board'],n:['الأرقام نفسها أزرار تصفية.','The numbers are filter buttons.']},
 {ch:'glance',s:'board',t:'col1',c:['عمود لكل خدمة','A column per service'],d:['🔴 متأخرة · 🟡 الإجمالي','🔴 late · 🟡 total'],n:['الإطار الأحمر حول البطاقة = متأخر. الذهبي = بانتظار إجرائك.','A red frame = late. Gold = waiting for you.']},
 {ch:'glance',s:'board',t:'act',a:1,c:['زر الإجراء','The action button'],d:['يفتح الطلب في نافذة سريعة','Opens the request in a quick window'],n:['الزر يقول ما المطلوب: مراجعة، اعتماد، إكمال وتقديم، تنفيذ المهمة.','The button says what is needed: review, approve, complete and submit, work on task.']},
 {ch:'glance',s:'board',t:'pj',a:1,c:['ملف المشروع','Project file'],d:['كل وثائق المشروع في مكان واحد','All project documents in one place'],n:['📂 يفتح ملف المشروع: الميثاق، الخطة، الطلبات، التقرير.','📂 opens the project file: charter, plan, requests, report.']},
 {ch:'glance',s:'services',t:'cards',c:['الخدمات','Services'],d:['ست خدمات تغطي دورة حياة المشروع','Six services across the project lifecycle'],n:['كل بطاقة خدمة تعرض إحصاءاتها وتفتح صفحتها.','Each service card shows its numbers and opens its page.']},

 // ── chapter 2: lifecycle
 {ch:'life',title:1,c:['من الفكرة إلى الإغلاق','From idea to closure'],d:['ميثاق ← خطة ← تنفيذ ← تغيير ← إغلاق','Charter → plan → delivery → change → closure'],n:['الآن نتبع مشروعًا من البداية حتى النهاية.','Now we follow a project from start to finish.']},
 {ch:'life',s:'create',t:'pop',a:1,c:['ابدأ من هنا','Start here'],d:['اختر الخدمة التي تحتاجها','Choose the service you need'],n:['من «إنشاء جديد» في أي صفحة.','From “Create new” on any page.']},
 {ch:'life',s:'charter_home',c:['١ · ميثاق المشروع','1 · Project charter'],d:['الفكرة تصبح مشروعًا معتمدًا','The idea becomes an approved project'],n:['صفحة الخدمة: ما ينتظرك، والمواثيق الجارية، ومراحل الطلبات.','The service page: what waits for you, running charters and request stages.']},
 {ch:'life',s:'charter_home',t:'new',a:1,c:['ميثاق جديد','New charter'],d:['أو «مسودة لمستخدم» لتعدّه لغيرك','or “draft for a user” to prepare one for someone else'],n:['المكتب يستطيع إعداد مسودة باسم موظف ثم تسليمها له.','The office can prepare a draft for an employee and hand it over.']},
 {ch:'life',s:'ch_draft',c:['نموذج الميثاق','The charter form'],d:['أقسام واضحة… وحفظ تلقائي','Clear sections… saved as you go'],n:['المسودة تُحفظ، ويمكن العودة إليها لاحقًا.','The draft is saved and you can come back to it.']},
 {ch:'life',s:'ch_draft',t:'prog',c:['كم بقي؟','How much is left?'],d:['شريط الاكتمال: الإلزامية والاختيارية','Completion bar: required and optional fields'],n:['لا يُقدَّم الميثاق قبل اكتمال الحقول الإلزامية.','The charter can’t be submitted before the required fields are complete.']},
 {ch:'life',s:'ch_draft',t:'tabs',c:['الأقسام','Sections'],d:['المشروع · التفاصيل · أصحاب المصلحة · المخاطر · الجدوى','Project · details · stakeholders · risks · feasibility'],n:['تنقّل بين الأقسام بأي ترتيب.','Move between sections in any order.']},
 {ch:'life',s:'ch_draft',t:'submit',a:1,c:['قدّم الميثاق','Submit the charter'],d:['يذهب للمراجعة تلقائيًا','It goes to review automatically'],n:['بعد التقديم يصل للمراجع وتصلك التنبيهات بكل خطوة.','After submitting, it reaches the reviewer and you get alerts at every step.']},
 {ch:'life',s:'plan_new',c:['٢ · خطة المشروع','2 · Project plan'],d:['بعد اعتماد الميثاق','Once the charter is approved'],n:['تظهر هنا المواثيق المعتمدة فقط.','Only approved charters appear here.']},
 {ch:'life',s:'plan_new',t:'start',a:1,c:['ابدأ التخطيط','Start planning'],d:['من الصفر أو من قالب خطة سابقة','From scratch or from a previous plan'],n:['يمكن نسخ هيكل خطة سابقة كقالب.','You can copy the structure of an earlier plan as a template.']},
 {ch:'life',s:'pl_draft',c:['محرّر الخطة','The plan editor'],d:['مراحل · أنشطة · مهام · مواعيد · مكلّفون','Phases · activities · tasks · dates · owners'],n:['جدول قابل للتحرير، مع مستويات قابلة للطي.','An editable table with collapsible levels.']},
 {ch:'life',s:'pl_draft',t:'lab',a:1,c:['مختبر الخطط','Plan lab'],d:['اكتب فكرتك… وتتحول إلى خطة','Write your idea… it becomes a plan'],n:['يصف المستخدم المشروع بكلماته، فيقترح النظام المراحل والمهام والمدد.','You describe the project in your own words and the system suggests phases, tasks and durations.']},
 {ch:'life',s:'pl_draft',t:'views',c:['عدة طرق للعرض','Many views'],d:['جدول · مخطط زمني · هيكل التجزئة · ملخص · شبكة','Table · Gantt · breakdown · summary · network'],n:['نفس البيانات بعروض مختلفة.','The same data, different views.']},
 {ch:'life',s:'pl_gantt',c:['المخطط الزمني','The timeline'],d:['كل مهمة في مكانها من الزمن','Every task in its place in time'],n:['المخطط يتحدث مع كل تعديل في الجدول.','The Gantt updates with every change in the table.']},
 {ch:'life',s:'pl_draft',t:'checks',c:['فحص الجاهزية','Readiness check'],d:['قبل الإرسال يتأكد النظام من الخطة','Before sending, the system checks the plan'],n:['ينبّه للتواريخ الناقصة والمهام بلا مكلّف وغيرها.','It flags missing dates, unassigned tasks and more.']},
 {ch:'life',s:'pl_draft',t:'submit',a:1,c:['قدّم الخطة','Submit the plan'],d:['للمراجعة ثم الاعتماد','For review, then approval'],n:[],},
 {ch:'life',s:'tasks',c:['٣ · التنفيذ','3 · Delivery'],d:['المهام تصل لأصحابها','Tasks reach their owners'],n:['بعد اعتماد الخطة تظهر المهام لكل مكلّف في «مهامي».','Once the plan is approved, each owner sees their tasks in “My tasks”.']},
 {ch:'life',s:'tasks',t:'chips',c:['أين أنت؟','Where are you?'],d:['متبقية · متأخرة · قيد التنفيذ · منجزة','Remaining · late · in progress · done'],n:['اضغط أي رقم للتصفية.','Tap any number to filter.']},
 {ch:'life',s:'tasks2',t:'kpis',c:['الأهم الآن','What matters now'],d:['ترتيب ذكي حسب الأولوية والتأخر','Smart order by priority and delay'],n:['حدّث نسبة الإنجاز من المهمة نفسها.','Update progress right from the task.']},
 {ch:'life',s:'tasks',t:'cal',a:1,c:['إلى تقويمك','To your calendar'],d:['صدّر المهام إلى Outlook أو الهاتف','Export tasks to Outlook or your phone'],n:[]},
 {ch:'life',s:'cr_draft',c:['٤ · طلب تغيير','4 · Change request'],d:['عندما يتغير النطاق أو الموعد أو الميزانية','When scope, dates or budget change'],n:['يرتبط الطلب بمشروع معتمد، وتُنقل بياناته تلقائيًا.','The request links to an approved project and pulls its data automatically.']},
 {ch:'life',s:'cr_draft',t:'link',a:1,c:['اربطه بالمشروع','Link it to the project'],d:['البيانات تُعبّأ تلقائيًا','Data fills in automatically'],n:[]},
 {ch:'life',s:'cl_draft',c:['٥ · التقرير الختامي','5 · Closure report'],d:['الإنجازات · التحديات · الدروس','Achievements · challenges · lessons'],n:['يُغلق المشروع رسميًا بعد اعتماد التقرير.','The project closes formally once the report is approved.']},
 {ch:'life',s:'cl_draft',t:'assigned',a:1,c:['مسودة موجّهة إليك','A draft assigned to you'],d:['المكتب يجهّز… وأنت تُكمل','The office prepares… you complete'],n:[]},

 // ── chapter 3: review
 {ch:'review',title:1,c:['المراجعة والاعتماد','Review and approval'],d:['من يراجع؟ من يعتمد؟ وكيف؟','Who reviews? Who approves? How?'],n:['الآن من جهة المراجع والمعتمد.','Now from the reviewer’s and approver’s side.']},
 {ch:'review',s:'board',t:'act',a:1,c:['يصلك الطلب','The request reaches you'],d:['تنبيه… وزر «مراجعة» في رحلتك','An alert… and a “Review” button in your journey'],n:['يصل بريد وتنبيه داخل النظام، ويظهر الطلب في عمودك بإطار ذهبي.','You get an email and an in-app alert; the request shows in your column with a gold frame.']},
 {ch:'review',s:'charter_review',c:['شاشة المراجعة','The review screen'],d:['الطلب كاملًا… وأزرار القرار','The full request… and the decision buttons'],n:[]},
 {ch:'review',s:'charter_review',t:'notes',a:1,c:['ملاحظات على الحقول','Field notes'],d:['علّق على أي حقل قبل القرار','Comment on any field before deciding'],n:['تظهر الملاحظات لمُعِدّ الطلب بجانب الحقل نفسه.','The notes show to the preparer right next to the field.']},
 {ch:'review',s:'charter_review',t:'sign',a:1,c:['وقّع وأرسل','Sign and send'],d:['ينتقل للمعتمد التالي','It moves to the next approver'],n:['التوقيع يُحفظ مع التاريخ والوقت.','The signature is stored with date and time.']},
 {ch:'review',s:'charter_review',t:'direct',a:1,c:['اعتماد مباشر','Direct approval'],d:['لمكتب التطوير المؤسسي','For the Institutional Development Office'],n:['يعتمد المكتب مباشرة، ويمكن أن يستمر مسار رسمي موازٍ للتوقيعات.','The office approves directly; a formal signature track can continue in parallel.']},
 {ch:'review',s:'charter_review',t:'back',a:1,c:['أعِده للمُعِدّ','Return to preparer'],d:['مع سبب واضح','With a clear reason'],n:['يعود الطلب للتعديل ثم يُقدَّم من جديد.','The request goes back for edits and is resubmitted.']},
 {ch:'review',s:'charter_review',t:'reject',a:1,c:['أو ارفض','Or reject'],d:['القرار يُسجَّل في السجل','The decision is logged'],n:[]},
 {ch:'review',s:'review_flow',t:'stage1',c:['سير العمل','The workflow'],d:['كل مرحلة: من، ومتى، وكم بقي','Each stage: who, when, and time left'],n:['لكل مرحلة مهلة بأيام العمل. التأخر يظهر بالأحمر.','Each stage has a deadline in working days. Delays show in red.']},
 {ch:'review',s:'review_flow',t:'followers',c:['المتابعون','Followers'],d:['يرون الطلب ويتلقون التنبيهات','They see the request and get the alerts'],n:[]},
 {ch:'review',s:'review_flow',t:'esc',a:1,c:['التصعيد','Escalation'],d:['إذا تأخر الطلب… صعّده للمكتب','If a request is late… escalate to the office'],n:['المكتب يقرر: تذكير، أو إسناد لشخص آخر.','The office decides: remind, or reassign.']},
 {ch:'review',s:'inbox',c:['الإشعارات','Notifications'],d:['كل ما حدث… في مكان واحد','Everything that happened… in one place'],n:[]},
 {ch:'review',s:'inbox',t:'filters',c:['صنّفها','Filter them'],d:['اعتماد · تواقيع · تذكيرات · مهام','Approvals · signatures · reminders · tasks'],n:['يستطيع المسؤول إيقاف أنواع معينة من التنبيهات من الإعدادات.','Admins can switch off certain alert types in Settings.']},

 // ── chapter 4: track
 {ch:'track',title:1,c:['المتابعة والقيادة','Track and lead'],d:['هل نحن على المسار؟','Are we on track?'],n:[]},
 {ch:'track',s:'myprojects',c:['مشاريعي','My projects'],d:['كل مشروع في بطاقة','Every project on a card'],n:[]},
 {ch:'track',s:'myprojects',t:'kpi',c:['صنّف مشاريعك','Sort your projects'],d:['أديرها · أملكها · مكلّف فيها · متأخرة','I manage · I own · assigned · late'],n:[]},
 {ch:'track',s:'myprojects',t:'steps',a:1,c:['أين وصل المشروع؟','Where is the project?'],d:['ميثاق ← خطة ← تنفيذ ← إغلاق','Charter → plan → delivery → closure'],n:[]},
 {ch:'track',s:'myprojects',t:'metrics',a:1,c:['المخطط · الفعلي · الفارق','Planned · actual · gap'],d:['الفارق السالب = متأخر عن المخطط','A negative gap = behind plan'],n:['المخطط حتى اليوم يُحسب من تواريخ الخطة.','Planned-to-date comes from the plan dates.']},
 {ch:'track',s:'myprojects',t:'health',a:1,c:['مؤشر الأداء','Performance'],d:['منتظم · يحتاج متابعة · متعثر','On track · needs follow-up · struggling'],n:['متعثر: تأخر 15 نقطة، أو 20% من المهام متأخرة (3 على الأقل). يحتاج متابعة: 5 نقاط أو 5%.','Struggling: 15 points behind, or 20% of tasks late (at least 3). Needs follow-up: 5 points or 5%.']},
 {ch:'track',s:'portfolio',c:['المحفظة','The portfolio'],d:['صورة المركز كله… للإدارة','The whole centre… for management'],n:[]},
 {ch:'track',s:'portfolio',t:'tabs',c:['كل زاوية','Every angle'],d:['ملخص تنفيذي · هيكل · مخطط زمني · تقارير','Executive summary · structure · timeline · reports'],n:[]},
 {ch:'track',s:'portfolio',t:'kpis',c:['الأرقام المهمة','The numbers that matter'],d:['مهام متأخرة · بلا تحديث · طلبات مفتوحة · منتظمة','Late tasks · not updated · open requests · on track'],n:[]},

 // ── chapter 5: talk
 {ch:'talk',title:1,c:['التواصل والرأي','Talk and feedback'],d:['النقاش داخل المشروع نفسه','Conversations inside the project itself'],n:[]},
 {ch:'talk',s:'chat_open',c:['محادثة لكل مشروع','A chat per project'],d:['وفريق المشروع ينضم تلقائيًا','The project team joins automatically'],n:[]},
 {ch:'talk',s:'chat_open',t:'rail',c:['المشاريع والزملاء','Projects and colleagues'],d:['غير المقروءة أولًا','Unread first'],n:[]},
 {ch:'talk',s:'chat_open',t:'mic',a:1,c:['رسالة صوتية','Voice message'],d:['اضغط مطولًا للتسجيل… واسحب للتثبيت','Hold to record… slide to lock'],n:['يمكن الاستماع للتسجيل قبل إرساله.','You can listen before sending.']},
 {ch:'talk',s:'ratings',c:['رأيك يصنع الفرق','Your feedback matters'],d:['تقييم بعد كل خدمة','A rating after each service'],n:[]},
 {ch:'talk',s:'ratings',t:'kpis',c:['مؤشر الرضا','Satisfaction index'],d:['كل نجمة = 20% · المحايد لا يُحتسب','Each star = 20% · neutral not counted'],n:[]},

 // ── end
 {ch:'end',title:1,c:['ابدأ الآن','Start now'],d:['افتح البوابة… ورحلتك بانتظارك','Open the portal… your journey is waiting'],end:1,n:['شكرًا. للأسئلة: صفحة المساعدة، أو تواصل مع مكتب التطوير المؤسسي.','Thank you. Questions: the help page, or contact the Institutional Development Office.']}
];
