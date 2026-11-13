/* مختبر الخطط — طبقة القراءة الجديدة (الإصدار 4)
   تنظيف ← تقسيم (جداول، قوائم، عناوين، مراحل، جمل، روابط) ← تواريخ ومدد ونطاقات ومناسبات وتكرار ← أسماء مهام رسمية ← عناصر بصيغة المختبر.
   window.LABX.detect(text, ctx) يعيد عناصر بنفس صيغة المحرك السابق، و LABX.last يحمل الجمل غير المستخدمة والملاحظات. */
(function(){
'use strict';
/* ---------- أدوات أساسية ---------- */
var AD=function(s){return String(s||'').replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)}).replace(/[۰-۹]/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)})};
var HAR=/[\u064B-\u0652\u0670\u0640]/g;
var NA=function(s){return String(s||'').replace(HAR,'').replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').toLowerCase()};
var A='[اأإآ]',H='[هة]',Y='[يى]';
function rx(w){return w.replace(/[اأإآ]/g,A).replace(/[هة](?=$|\s|\))/g,H).replace(/[يى](?=$|\s|\))/g,Y)}
var B='(?<![\\p{L}\\p{N}])',E='(?![\\p{L}])';
var R=function(src,fl){return new RegExp(src,(fl||'')+'u')};
var pad=function(n){return (n<10?'0':'')+n};
var ymd=function(y,m,d){return y+'-'+pad(m+1)+'-'+pad(d)};
var dim=function(y,m){return new Date(Date.UTC(y,m+1,0)).getUTCDate()};
var dnum=function(y,m,d){return Date.UTC(y,m,d)/864e5};
var fromN=function(n){var t=new Date(n*864e5);return ymd(t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate())};
/* ---------- قوائم المفردات ---------- */
var MONTHS=[['يناير','كانون الثاني','جانفي','january','jan'],['فبراير','شباط','فيفري','february','feb'],['مارس','آذار','march','mar'],['أبريل','ابريل','إبريل','نيسان','افريل','april','apr'],['مايو','أيار','may'],['يونيو','يونيه','حزيران','جوان','june','jun'],['يوليو','يوليه','تموز','جويلية','july','jul'],['أغسطس','اغسطس','أوت','august','aug'],['سبتمبر','أيلول','september','sep','sept'],['أكتوبر','اكتوبر','تشرين الأول','october','oct'],['نوفمبر','تشرين الثاني','november','nov'],['ديسمبر','كانون الأول','december','dec']];
var MREX=[];MONTHS.forEach(function(a,i){a.forEach(function(w){MREX.push([rx(w),i])})});MREX.sort(function(a,b){return b[0].length-a[0].length});
var MALT='(?:'+MREX.map(function(x){return x[0]}).join('|')+')';
function monthIdx(w){var n=NA(w).trim();for(var i=0;i<MONTHS.length;i++)for(var j=0;j<MONTHS[i].length;j++)if(NA(MONTHS[i][j])==n)return i;return -1}
var NUMW={'واحد':1,'يوم':1,'يومين':2,'اثنين':2,'اثنتين':2,'ثلاث':3,'ثلاثه':3,'اربع':4,'اربعه':4,'خمس':5,'خمسه':5,'ست':6,'سته':6,'سبع':7,'سبعه':7,'ثمان':8,'ثمانيه':8,'ثماني':8,'تسع':9,'تسعه':9,'عشر':10,'عشره':10,'عشرين':20,'ثلاثين':30};
var NUMWR='(?:\\d+|واحد|اثنين|اثنتين|ثلاث[ةه]?|[أا]ربع[ةه]?|خمس[ةه]?|ست[ةه]?|سبع[ةه]?|ثمان(?:ي[ةه]?)?|تسع[ةه]?|عشر[ةه]?|عشرين|ثلاثين)';
var numOf=function(w){w=NA(w);return /^\d+$/.test(w)?+w:(NUMW[w]||0)};
/* المناسبات (تقريبية ±يوم حسب رؤية الهلال) */
var OCC={ramadan:{2026:'2026-02-18',2027:'2027-02-08',2028:'2028-01-28',2029:'2029-01-16',2030:'2030-01-06',len:29},
 fitr:{2026:'2026-03-20',2027:'2027-03-10',2028:'2028-02-27',2029:'2029-02-14',2030:'2030-02-04',len:3},
 adha:{2026:'2026-05-27',2027:'2027-05-16',2028:'2028-05-05',2029:'2029-04-24',2030:'2030-04-13',len:4},
 national:{fixed:[11,2],len:1}};
/* أفعال اللهجة والمضارع ← المصدر */
var STEM={'وظف':'توظيف','عين':'تعيين','رسل':'إرسال','جهز':'تجهيز','شتري':'شراء','شتر':'شراء','طرح':'طرح','ركب':'تركيب','خلص':'إنجاز','صمم':'تصميم','طبع':'طباعة','وزع':'توزيع','حدد':'تحديد','ختار':'اختيار','نفذ':'تنفيذ','جيب':'التعاقد مع','طلق':'إطلاق','بدا':'بدء','بدأ':'بدء','سلم':'تسليم','ستلم':'استلام','راجع':'مراجعة','عتمد':'اعتماد','جمع':'جمع','حلل':'تحليل','كتب':'كتابة','نشر':'نشر','قيم':'تقييم','نظم':'تنظيم','عقد':'عقد','رفع':'رفع','قدم':'تقديم','عرض':'عرض','زور':'زيارة','ستقبل':'استقبال','حجز':'حجز','طلب':'طلب','وقع':'توقيع','تعاقد':'التعاقد','ستقطب':'استقطاب','درب':'تدريب','طور':'تطوير','بني':'بناء','ختبر':'اختبار','حط':'وضع','حضر':'تحضير','ترجم':'ترجمة','ستعين':'الاستعانة','فتح':'فتح','رحل':'ترحيل','دعو':'دعوة','برمج':'برمجة','نقل':'نقل','وفر':'توفير','جدد':'تجديد','صرف':'صرف','شكل':'تشكيل','حدث':'تحديث','عد':'إعداد','اعد':'إعداد','جهّز':'تجهيز','صلح':'إصلاح','نسق':'التنسيق','تواصل':'التواصل','شارك':'المشاركة','ستضيف':'استضافة','سافر':'السفر','قيس':'قياس','تابع':'متابعة','صدر':'إصدار','عمم':'تعميم','دشن':'تدشين','وثق':'توثيق','رتب':'ترتيب','سوق':'تسويق','عد ':'إعداد','بلغ':'إبلاغ','خطط':'تخطيط','ستورد':'استيراد','ورد':'توريد','حسن':'تحسين','وحد':'توحيد','لغي':'إلغاء','وقف':'إيقاف','هيئ':'تهيئة','ركز':'التركيز على','سجل':'تسجيل','حدد ':'تحديد'};
var IMP={'صمم':'تصميم','اطبع':'طباعة','وزع':'توزيع','جهز':'تجهيز','اعد':'إعداد','نفذ':'تنفيذ','راجع':'مراجعة','ارسل':'إرسال','حدد':'تحديد','اختر':'اختيار','نظم':'تنظيم','اعتمد':'اعتماد','وقع':'توقيع','درب':'تدريب'};
var SAWI={'اجتماع':'عقد','اجتماعات':'عقد','لقاء':'عقد','ورشه':'تنظيم','ورش':'تنظيم','حفل':'تنظيم','مؤتمر':'تنظيم','موتمر':'تنظيم','فعاليه':'تنظيم','معرض':'تنظيم','حمله':'تنظيم','ملتقي':'تنظيم','دوره':'تنظيم','دورات':'تنظيم','دراسه':'إعداد','تقرير':'إعداد','خطه':'إعداد','دليل':'إعداد','عرض':'تقديم','اختبار':'','تحليل':'','زياره':'','مسح':'إجراء','استبيان':'إعداد','مقابلات':'إجراء','مسابقه':'تنظيم','حجز':'','تقييم':'','صيانه':'تنفيذ','بروفه':'إجراء','تجربه':'إجراء'};
/* مصادر شائعة (تبدأ بها المهمة) */
var MASD=('توظيف تعيين استقطاب شراء توريد تركيب تنظيم إقامة اقامة إعداد اعداد تحديث صياغة تدريب تأهيل تاهيل توقيع تطوير إطلاق اطلاق تشغيل تجهيز تصميم تنفيذ اختبار تحليل جمع مراجعة اعتماد نشر طباعة توزيع تقديم عرض رفع تشكيل عقد زيارة استضافة إرسال ارسال تسليم استلام صرف نقل إيقاف ايقاف إنشاء انشاء بناء دراسة تقييم قياس متابعة التعاقد التواصل التنسيق حجز طلب توفير تجديد ترجمة كتابة تحديد اختيار بدء افتتاح تدشين تأسيس تاسيس إعادة اعادة توثيق ترتيب تسويق إبلاغ تخطيط تحسين توحيد إلغاء الغاء تهيئة تسجيل إصدار اصدار تعميم استقبال تحضير برمجة ترحيل دعوة وضع إجراء اجراء فحص تفعيل ربط رصد حصر مسح مخاطبة التعاون المشاركة الاستعانة السفر استكمال إنهاء انهاء إغلاق اغلاق تنفيذ تأمين تامين صيانة تركيب تقدير تجميع تصنيف مقارنة تدقيق قراءة إدخال ادخال إضافة اضافة إزالة ازالة هيكلة دمج توسيع تمديد التخطيط الإعداد الاعداد التطوير التصميم التنفيذ التقييم الاختبار التحليل التدريب التشغيل التسليم الاستلام الإطلاق الاطلاق الافتتاح التجهيز التوظيف الشراء التوريد الاعتماد المراجعة النشر الطباعة التوزيع البرمجة البدء الانتهاء الإغلاق الاغلاق القياس المتابعة الصيانة إقرار اقرار موافقة الموافقة انتهاء اكتمال صدور وصول تعديل التعديل إعلان اعلان استقبال اختتام ختام توقيع').split(' ');
var MASDN=new Set(MASD.map(NA));
var isMasd=function(w){w=NA(String(w||'').replace(/^و/,''));return MASDN.has(w)||MASDN.has(w.replace(/^ال/,''))};
/* ---------- 1) تنظيف ---------- */
function clean(t){t=AD(String(t||'')).replace(/\r/g,'').replace(HAR,'').replace(/\u200f|\u200e/g,'');
 t=t.replace(/[“”«»"]/g,'').replace(/\u00a0/g,' ').replace(/ال\s+(?=[A-Za-z])/g,'').replace(R(rx('عطلة نهاية الأسبوع'),'g'),'عطلة_نهاية_الأسبوع');
 /* مسافة بعد علامات الترقيم الملتصقة */
 t=t.replace(/([.،,؛;!؟?])(?=[\p{L}])/gu,'$1 ').replace(/[ \t]*\n[ \t]*/g,'\n');
 /* أرقام بفواصل الآلاف */
 t=t.replace(/(\d),(\d{3})(?!\d)/g,'$1$2').replace(/(\d),(\d{3})(?!\d)/g,'$1$2');
 /* قوائم مضمّنة في سطر واحد: 1) … 2) … / أ) … ب) … */
 if((t.match(/(?:^|\s)\d{1,2}\s*[)\-.]\s+\S/g)||[]).length>=2)t=t.replace(/\s+(?=\d{1,2}\s*[)\-]\s+\S)/g,'\n').replace(/\s+(?=\d{1,2}\.\s+\D)/g,'\n');
 if((t.match(/(?:^|\s)[أابجدهوزحطي]\s*\)\s*\S/g)||[]).length>=2)t=t.replace(/\s+(?=[أابجدهوزحطي]\s*\)\s*\S)/g,'\n');
 /* أولًا… ثانيًا… في سطر واحد */
 var ORD=/(?:^|[\s،,.؛])(أولا|اولا|أولاً|ثانيا|ثانياً|ثالثا|ثالثاً|رابعا|رابعاً|خامسا|خامساً|سادسا|سادساً|سابعا|ثامنا|تاسعا|عاشرا|أخيرا|اخيرا)\s*[:،,]?\s+/g;
 if((t.match(ORD)||[]).length>=2)t=t.replace(ORD,function(m,w){return '\n'+w+': '});
 return t.replace(/[ \t]{2,}/g,' ').trim()}
var LISTM=/^\s*(?:[-•*–·▪●◦]|\d{1,2}\s*[.)\-–:]|\(\d{1,2}\)|[أابجدهوزحطي]\s*[)\-.]|(?:أولا|اولا|أولاً|ثانيا|ثانياً|ثالثا|ثالثاً|رابعا|رابعاً|خامسا|خامساً|سادسا|سادساً|سابعا|ثامنا|تاسعا|عاشرا|أخيرا|اخيرا)\s*[:：\-–،,]?)\s*/;
var GENH=/^(?:خط[ةه] العمل|الانشط[ةه](?: الرئيسي[ةه])?|الأنشط[ةه](?: الرئيسي[ةه])?|المهام(?: الرئيسي[ةه])?|الخطوات|مراحل المشروع|نطاق العمل|الأهداف|الاهداف|الخطة|work plan|activities|tasks|steps)\s*[:：]?$/i;
var DELIV=/^(?:المخرجات(?: المتوقع[ةه])?|المخرجات الرئيسي[ةه]|مخرجات المشروع|deliverables)\s*[:：]\s*/i;
/* ---------- 2) التواريخ ---------- */
function Ctx(ctx){this.today=ctx.today;var t=new Date(this.today*864e5);this.ty=t.getUTCFullYear();this.tm=t.getUTCMonth();this.td=t.getUTCDate();this.ps=ctx.pstart;this.pe=ctx.pend}
function inferY(c,m,d){var y=c.ty;if(dnum(y,m,Math.min(d||1,dim(y,m)))<c.today-3)y++;return y}
function posDay(pos,y,m){var L=dim(y,m),p=NA(pos||'');if(!p)return 15;if(/بدايه|مطلع|اوائل|اول(?! من)/.test(p))return 5;if(/منتصف|نص|اواسط|وسط/.test(p))return 15;if(/نهايه|اخر|اواخر|بحلول نهايه/.test(p))return L;
 var w=p.match(/الاسبوع\s+(الاول|الثاني|الثالث|الرابع|الاخير)/);if(w)return {'الاول':3,'الثاني':10,'الثالث':17,'الرابع':24,'الاخير':L-3}[w[1]];return 15}
var POS='(?:'+rx('بداية')+'|'+rx('مطلع')+'|'+rx('أوائل')+'|'+rx('منتصف')+'|'+rx('أواسط')+'|'+rx('نهاية')+'|'+rx('أواخر')+'|'+rx('آخر')+'|'+rx('الأسبوع')+'\\s+(?:'+rx('الأول')+'|'+rx('الثاني')+'|'+rx('الثالث')+'|'+rx('الرابع')+'|'+rx('الأخير')+'))';
/* يعيد قائمة مطابقات {i,j,s,e,kind} على نص بعد التنظيف */
function findDates(t,c){var out=[],used=[];
 var take=function(i,j){for(var k=0;k<used.length;k++)if(i<used[k][1]&&j>used[k][0])return false;used.push([i,j]);return true};
 var add=function(m,s,e,kind,ex){var i=m.index,j=i+m[0].length;if(!take(i,j))return;out.push(Object.assign({i:i,j:j,s:s,e:e,kind:kind,txt:m[0]},ex||{}))};
 var m,re;
 /* yyyy-mm-dd / yyyy/mm/dd */
 re=/(?<!\d)(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})(?!\d)/g;while((m=re.exec(t))){var y=+m[1],mo=+m[2]-1,d=+m[3];if(mo>=0&&mo<12&&d>=1&&d<=31){var n=dnum(y,mo,Math.min(d,dim(y,mo)));add(m,n,n,'exact')}}
 /* dd/mm/yyyy */
 re=/(?<!\d)(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})(?!\d)/g;while((m=re.exec(t))){var d2=+m[1],mo2=+m[2]-1,y2=+m[3];if(mo2>=0&&mo2<12&&d2>=1&&d2<=31){var n2=dnum(y2,mo2,Math.min(d2,dim(y2,mo2)));add(m,n2,n2,'exact')}}
 /* (الموقع) (يوم) شهر (سنة) */
 re=R('(?:'+B+'(?:'+rx('بحلول')+'\\s+|'+rx('قبل')+'\\s+)?('+POS+')\\s+(?:'+rx('من')+'\\s+)?)?(?:'+B+'(?:'+rx('يوم')+'\\s+)?(?:'+rx('الأحد')+'|'+rx('الاثنين')+'|'+rx('الثلاثاء')+'|'+rx('الأربعاء')+'|'+rx('الخميس')+'|'+rx('الجمعة')+'|'+rx('السبت')+')?\\s*،?\\s*)?(?:(\\d{1,2})\\s+(?:'+rx('من')+'\\s+)?)?(?:'+rx('شهر')+'\\s+|'+rx('شهري')+'\\s+)?(?:'+B+'|(?<=(?:^|\\s)[وبل]))('+MALT+')'+E+'(?:\\s*(?:'+rx('من')+'\\s+)?(?:'+rx('عام')+'\\s+|'+rx('سنة')+'\\s+)?(\\d{4}))?','gi');
 while((m=re.exec(t))){var mi=monthIdx(m[3]);if(mi<0)continue;var dd=m[2]?+m[2]:0,yy=m[4]?+m[4]:inferY(c,mi,dd||posDay(m[1],c.ty,mi));var day=dd?Math.min(dd,dim(yy,mi)):posDay(m[1],yy,mi);
  var s0=dd?dnum(yy,mi,day):dnum(yy,mi,1),e0=dd?dnum(yy,mi,day):dnum(yy,mi,dim(yy,mi));if(m[1]&&!dd){s0=e0=dnum(yy,mi,day)}
  add(m,s0,e0,dd?'exact':(m[1]?'pos':'month'),{due:dnum(yy,mi,day),mi:mi,y:yy})}
 /* الأرباع والأنصاف */
 re=R('(?:('+rx('بداية')+'|'+rx('منتصف')+'|'+rx('نهاية')+')\\s+)?'+rx('الربع')+'\\s+('+rx('الأول')+'|'+rx('الثاني')+'|'+rx('الثالث')+'|'+rx('الرابع')+'|[1-4])(?:\\s+'+rx('من')+')?(?:\\s+(?:'+rx('عام')+'|'+rx('سنة')+'|'+rx('العام')+'))?(?:\\s+(\\d{4}))?','gi');
 while((m=re.exec(t))){var q={'الاول':1,'الثاني':2,'الثالث':3,'الرابع':4}[NA(m[2])]||+m[2];var qy=m[3]?+m[3]:(dnum(c.ty,q*3-1,dim(c.ty,q*3-1))<c.today?c.ty+1:c.ty);var qs=dnum(qy,(q-1)*3,1),qe=dnum(qy,q*3-1,dim(qy,q*3-1));var p=NA(m[1]||'');var due=/نهايه/.test(p)?qe:/بدايه/.test(p)?qs+4:dnum(qy,(q-1)*3+1,15);add(m,p?due:qs,p?due:qe,'quarter',{due:due})}
 re=/(?:^|\s)Q([1-4])(?:\s+(\d{4}))?/g;while((m=re.exec(t))){var q2=+m[1],y3=m[2]?+m[2]:(dnum(c.ty,q2*3-1,28)<c.today?c.ty+1:c.ty);add(m,dnum(y3,(q2-1)*3,1),dnum(y3,q2*3-1,dim(y3,q2*3-1)),'quarter',{due:dnum(y3,(q2-1)*3+1,15)})}
 re=R(rx('النصف')+'\\s+('+rx('الأول')+'|'+rx('الثاني')+')(?:\\s+'+rx('من')+')?(?:\\s+(?:'+rx('العام')+'|'+rx('عام')+'|'+rx('سنة')+'))?(?:\\s+(\\d{4}))?','gi');
 while((m=re.exec(t))){var h=NA(m[1])=='الاول'?0:1,hy=m[2]?+m[2]:(dnum(c.ty,h*6+5,30)<c.today?c.ty+1:c.ty);add(m,dnum(hy,h*6,1),dnum(hy,h*6+5,dim(hy,h*6+5)),'half',{due:dnum(hy,h*6+2,15)})}
 /* السنة: نهاية العام القادم / مطلع العام / بنهاية 2027 */
 re=R('('+rx('بداية')+'|'+rx('مطلع')+'|'+rx('منتصف')+'|'+rx('نهاية')+'|'+rx('بنهاية')+'|'+rx('آخر')+')\\s+(?:'+rx('العام')+'|'+rx('السنة')+'|'+rx('عام')+'|'+rx('سنة')+')\\s*(?:('+rx('القادم')+'|'+rx('القادمة')+'|'+rx('المقبل')+'|'+rx('المقبلة')+'|'+rx('الجاي')+'|'+rx('الجاية')+'|'+rx('الياي')+'|'+rx('الحالي')+'|'+rx('الحالية')+'|'+rx('الجارية')+')|(\\d{4}))?','gi');
 while((m=re.exec(t))){if(m[0].trim().split(/\s+/).length<2)continue;var nx=m[2]&&!/حالي|جاري/.test(NA(m[2])),yr=m[3]?+m[3]:c.ty+(nx?1:0);var pp=NA(m[1]);var dv=/بدايه|مطلع/.test(pp)?dnum(yr,0,5):/منتصف/.test(pp)?dnum(yr,5,30):dnum(yr,11,31);if(!m[2]&&!m[3]&&dv<c.today)dv=/بدايه|مطلع/.test(pp)?dnum(yr+1,0,5):/منتصف/.test(pp)?dnum(yr+1,5,30):dnum(yr+1,11,31);add(m,dv,dv,'year',{due:dv})}
 /* الشهر القادم */
 re=R('(?:('+POS+')\\s+)?'+rx('الشهر')+'\\s+('+rx('القادم')+'|'+rx('المقبل')+'|'+rx('الجاي')+'|'+rx('الياي')+'|'+rx('الحالي')+'|'+rx('هذا')+')','gi');
 while((m=re.exec(t))){var nm=/حالي|هذا/.test(NA(m[2]))?c.tm:c.tm+1,ny=c.ty+(nm>11?1:0);nm%=12;var dp=posDay(m[1],ny,nm);add(m,m[1]?dnum(ny,nm,dp):dnum(ny,nm,1),m[1]?dnum(ny,nm,dp):dnum(ny,nm,dim(ny,nm)),'month',{due:dnum(ny,nm,dp)})}
 re=R(rx('الأسبوع')+'\\s+('+rx('القادم')+'|'+rx('المقبل')+'|'+rx('الجاي')+'|'+rx('الياي')+')','gi');while((m=re.exec(t))){add(m,c.today+7,c.today+7,'week',{due:c.today+7})}
 /* المناسبات */
 re=R('(?:('+rx('قبل')+'|'+rx('بعد')+'|'+rx('خلال')+'|'+rx('في')+'|'+rx('بداية')+'|'+rx('نهاية')+')\\s+)?(?:'+rx('شهر')+'\\s+)?('+rx('رمضان')+'|'+rx('عيد الفطر')+'|'+rx('عيد الأضحى')+'|'+rx('العيد الوطني')+'|'+rx('اليوم الوطني')+')(?:\\s+(\\d{4}))?','gi');
 while((m=re.exec(t))){var on=NA(m[2]),key=/رمضان/.test(on)?'ramadan':/فطر/.test(on)?'fitr':/اضحي/.test(on)?'adha':'national';var o=OCC[key],st=null;
  for(var yy2=c.ty;yy2<=c.ty+2&&!st;yy2++){if(m[3]&&+m[3]!=yy2)continue;var sd=o.fixed?ymd(yy2,o.fixed[0],o.fixed[1]):o[yy2];if(!sd)continue;var a=sd.split('-'),sn=dnum(+a[0],+a[1]-1,+a[2]);if(sn+o.len>=c.today)st=sn}
  if(st==null)continue;var w0=NA(m[1]||''),en=st+o.len-1;var dv2=/قبل/.test(w0)?st-7:/بعد/.test(w0)?en+7:/بدايه/.test(w0)?st+2:/نهايه/.test(w0)?en-2:key=='ramadan'?st+14:st;
  add(m,/خلال|في/.test(w0)||!w0?st:dv2,/خلال|في/.test(w0)||!w0?en:dv2,'occasion',{due:dv2,occ:key})}
 out.sort(function(a,b){return a.i-b.i});
 /* نطاقات: من X إلى Y / خلال X و Y / شهري X و Y / (X - Y) */
 var res=[];for(var k=0;k<out.length;k++){var x=out[k],y4=out[k+1];
  if(y4){var mid=t.slice(x.j,y4.i),pre=t.slice(Math.max(0,x.i-12),x.i);
   var rng=R('^\\s*(?:'+rx('إلى')+'|'+rx('الى')+'|'+rx('حتى')+'|'+rx('لغاية')+'|'+rx('لين')+'|[-–—]|'+rx('و')+'\\s*'+rx('حتى')+'|'+rx('ولغاية')+')\\s*$').test(mid)||(R('^\\s*'+rx('و')+'\\s*$').test(mid)&&R('(?:'+rx('خلال')+'|'+rx('شهري')+'|'+rx('بين')+'|'+rx('في')+')\\s*$').test(pre));
   if(rng){var lo=Math.min(x.s,y4.s),hi=Math.max(x.e,y4.e);if(y4.e<x.s&&y4.kind=='month'){/* سنة تالية */}res.push({i:x.i,j:y4.j,s:x.kind=='exact'||x.kind=='pos'?x.s:x.s,e:y4.kind=='exact'||y4.kind=='pos'?y4.e:y4.e,kind:'range',due:hi,start:lo,txt:t.slice(x.i,y4.j)});k++;continue}}
  res.push(x)}
 res.forEach(function(r){if(r.due==null)r.due=r.kind=='month'?dnum(new Date(r.s*864e5).getUTCFullYear(),new Date(r.s*864e5).getUTCMonth(),15):r.e;if(r.kind=='range'){r.due=r.e;r.start=r.s}});
 return res}
/* المدد */
var UNIT0='(?:'+rx('يوم عمل')+'|'+rx('أيام عمل')+'|'+rx('يومين')+'|'+rx('يوما')+'|'+rx('يوم')+'|'+rx('أيام')+'|'+rx('أسبوعين')+'|'+rx('أسابيع')+'|'+rx('أسبوع')+'|'+rx('شهرين')+'|'+rx('أشهر')+'|'+rx('شهور')+'|'+rx('شهرا')+'|'+rx('شهر')+'|'+rx('سنتين')+'|'+rx('سنوات')+'|'+rx('سنة')+'|'+rx('عام')+'|days?|weeks?|months?)';var UNIT=UNIT0+'(?![\\p{L}])';
function unitDays(u,n){u=NA(u);if(/^days?$/.test(u)||/يوم|ايام/.test(u))return n*(/يومين/.test(u)?1:1)*(/يومين/.test(u)?2:1);if(/weeks?|اسبوع|اسابيع/.test(u))return n*5*(/اسبوعين/.test(u)?2:1);if(/months?|شهر|اشهر|شهور/.test(u))return n*22*(/شهرين/.test(u)?2:1);if(/سن|عام/.test(u))return n*250*(/سنتين/.test(u)?2:1);return n}
function findDur(t){var re=R('(?:(?:'+rx('لمدة')+'|'+rx('مدته')+'|'+rx('مدتها')+'|'+rx('لفترة')+'|'+rx('يستغرق')+'|'+rx('تستغرق')+'|'+rx('يمتد')+'|'+rx('تمتد')+'|for)\\s+('+NUMWR+')?\\s*('+UNIT+'))|(?:\\(\\s*('+NUMWR+')?\\s*('+UNIT+')\\s*\\))|(?:'+rx('خلال')+'\\s+('+NUMWR+')?\\s*('+UNIT+')(?!\\s+'+rx('من')+'))','gi');var m=re.exec(t);if(!m)return null;
 var n=m[1]||m[3]||m[5],u=m[2]||m[4]||m[6];var k=n?numOf(n):1;if(!k)k=1;var dd=unitDays(u,k);if(/يومين/.test(NA(u))&&!n)dd=2;if(/اسبوعين/.test(NA(u))&&!n)dd=10;if(/شهرين/.test(NA(u))&&!n)dd=44;return {du:Math.max(1,Math.min(400,dd)),i:m.index,j:m.index+m[0].length,txt:m[0]}}
/* مواعيد نسبية: قبل الحفل بأسبوعين / بعد التوظيف بشهر / شهرين قبل الافتتاح / قبله بثلاثة أشهر / خلال أسبوعين من اعتماد الميثاق */
var RU=function(u){u=NA(u||'');return /يوم|ايام|day/.test(u)?'d':/اسبوع|اسابيع|week/.test(u)?'w':/شهر|اشهر|شهور|month/.test(u)?'m':''};
var RN=function(w){w=NA(w||'');if(/^\d+$/.test(w))return +w;if(/يومين|اسبوعين|شهرين/.test(w))return 2;var n=numOf(w.replace(/^(?:ب|بـ)/,''));return n||1};
function findRel(t){var m,UN='(?:'+rx('أيام')+'|'+rx('يوم')+'|'+rx('يومين')+'|'+rx('أسابيع')+'|'+rx('أسبوعين')+'|'+rx('أسبوع')+'|'+rx('أشهر')+'|'+rx('شهور')+'|'+rx('شهرين')+'|'+rx('شهر')+')';
 m=R('('+rx('قبل')+'|'+rx('بعد')+')('+rx('ه')+'|'+rx('ها')+'|'+rx('هم')+')\\s+(?:'+rx('بـ')+'|'+rx('ب')+')?\\s*('+NUMWR+'|'+rx('يومين')+'|'+rx('أسبوعين')+'|'+rx('شهرين')+'|'+rx('أسبوع')+'|'+rx('شهر')+'|'+rx('يوم')+')\\s*('+UN+')?','i').exec(t);
 if(m)return {side:/قبل/.test(m[1])?-1:1,anc:'@prev',n:RN(m[3]),u:RU(m[4]||m[3]),i:m.index,j:m.index+m[0].length};
 m=R('('+rx('قبل')+'|'+rx('بعد')+')\\s+((?:'+rx('ال')+')?[^\\s،,.\\d]{2,}(?:\\s+(?!'+rx('ب')+'\\S*(?:'+UN+'))(?:'+rx('ال')+')?[^\\s،,.\\d]{3,}){0,2}?)\\s+(?:'+rx('ب')+'\\s*)('+NUMWR+'|'+rx('يومين')+'|'+rx('أسبوعين')+'|'+rx('شهرين')+'|'+rx('أسبوع')+'|'+rx('شهر')+'|'+rx('يوم')+')\\s*('+UN+')?','i').exec(t);
 if(m)return {side:/قبل/.test(m[1])?-1:1,anc:m[2].trim(),n:RN(m[3]),u:RU(m[4]||m[3]),i:m.index,j:m.index+m[0].length};
 m=R('('+NUMWR+'|'+rx('يومين')+'|'+rx('أسبوعين')+'|'+rx('شهرين')+'|'+rx('أسبوع')+'|'+rx('شهر')+')\\s*('+UN+')?(?:\\s+'+rx('عمل')+')?\\s+('+rx('قبل')+'|'+rx('بعد')+'|'+rx('من')+')\\s+((?:'+rx('ال')+')?[^\\s،,.\\d]{3,}(?:\\s+(?:'+rx('ال')+')?[^\\s،,.\\d]{3,})?)','i').exec(t);
 if(m&&(!/من/.test(NA(m[3]))||R(rx('خلال')+'\\s*$').test(t.slice(0,m.index))||R(rx('بعد')+'\\s*$').test(t.slice(0,m.index))))return {side:/قبل/.test(m[3])?-1:1,anc:m[4].trim(),n:RN(m[1]),u:RU(m[2]||m[1]),i:Math.max(0,m.index-(R('('+rx('خلال')+'|'+rx('بعد')+')\\s*$').exec(t.slice(0,m.index))||{0:''})[0].length),j:m.index+m[0].length};
 m=R('('+rx('قبل')+'|'+rx('بعد')+')\\s+(?!'+rx('ذلك')+'|'+rx('ما')+E+')((?:'+rx('ال')+')[^\\s،,.\\d]{3,}(?:\\s+(?:'+rx('ال')+')?[^\\s،,.\\d]{3,})?)','i').exec(t);
 if(m&&!R(MALT).test(m[2]))return {side:/قبل/.test(m[1])?-1:1,anc:m[2].trim(),n:0,u:'',i:m.index,j:m.index+m[0].length};
 m=R('^\\s*(?:'+rx('و')+')?('+rx('قبل')+'|'+rx('بعد')+')\\s+(\\S{3,}?(?:'+rx('ها')+'|'+rx('ه')+'|'+rx('هم')+'))(?=\\s)','i').exec(t);if(m&&isAct(m[2]))return {side:/قبل/.test(m[1])?-1:1,anc:'@prev',n:0,u:'',i:m.index,j:m.index+m[0].length};
 return null}
/* التكرار */
function findRec(t){var t0=t.replace(R(rx('شهري')+'\\s+(?='+MALT+')','gi'),function(x){return ' '.repeat(x.length)});t=t0;var m=R('(?:'+B+rx('كل')+'\\s+('+rx('شهر')+'|'+rx('أسبوع')+'|'+rx('ربع سنة')+'|'+rx('ثلاثة أشهر')+'|'+rx('ستة أشهر')+'|'+rx('سنة')+'|'+rx('عام')+'|'+rx('خميس')+'|'+rx('أحد')+'|'+rx('اثنين')+'|'+rx('ثلاثاء')+'|'+rx('أربعاء')+')(?:\\s+'+rx('سنة')+')?)|'+B+'('+rx('شهري')+'|'+rx('شهريا')+'|'+rx('أسبوعي')+'|'+rx('أسبوعيا')+'|'+rx('ربع سنوي')+'|'+rx('ربع سنويا')+'|'+rx('نصف سنوي')+'|'+rx('سنويا')+'|'+rx('سنوي')+'|'+rx('دوري')+'|'+rx('دوريا')+'|'+rx('مرتين في السنة')+'|'+rx('مرتين في العام')+')'+E,'i').exec(t);
 if(!m)return null;var w=NA(m[1]||m[2]);var u=/شهر(?!ين)|شهري/.test(w)&&!/ثلاثه|سته|ربع|نصف/.test(w)?'m':/اسبوع|خميس|احد|اثنين|ثلاثاء|اربعاء/.test(w)?'w':/ربع|ثلاثه اشهر/.test(w)?'q':/نصف|سته اشهر|مرتين/.test(w)?'h':/سن|عام/.test(w)?'y':'m';return {u:u,i:m.index,j:m.index+m[0].length,txt:m[0]}}
/* ---------- 3) أسماء المهام ---------- */
var LEADF=R('^(?:'+[ 'و','ف','ثم','بعدين','وبعدين','بعدها','وبعدها','بعد ذلك','وبعد ذلك','يلي ذلك','ويلي ذلك','ومن ثم','من ثم','أخيرا','وأخيرا','اخيرا','واخيرا','كذلك','أيضا','ايضا','في البداية','بالبداية','بالبدايه','أول شي','اول شي','أولا','اولا','ثانيا','ثالثا','رابعا','خامسا','سادسا',
 'سوف يتم','سيتم','يتم','تم','ستتم','سنقوم ب','نقوم ب','سيقوم الفريق ب','سيقوم فريق المشروع ب','سيقوم فريق العمل ب','يقوم الفريق ب','سيقوم','يقوم','لازم','لابد من','لا بد من','يجب','ينبغي','نحتاج إلى','نحتاج الى','نحتاج','يحتاج','نبي','نبغى','نبغي','ابا','أبا','ابي','أبي','نبا','خلنا','خلينا','بنبدأ ب','بنبدا ب','نبدأ ب','نبدا ب','بنبدأ','بنبدا','يتضمن ذلك','ويتضمن ذلك','يشمل ذلك','ويشمل ذلك','يشمل','تشمل','يتضمن','تتضمن','ذلك','ويتضمن','ويشمل','عن طريق','من خلال','بعد ما','وبعد ما','عشان','علشان','حتى','كما سيتم','وسيتم','ويتم','وسوف يتم','على أن يتم','على ان يتم'].map(rx).join('|')+')\\s+','i');
function stripLead(s){var p;do{p=s;s=s.replace(LEADF,'').trim();s=s.replace(R('^'+rx('ب')+'(?=(?:'+rx('ال')+')?\\S{3,})'),function(x){return x});}while(s!=p);return s}
var V2M={pron:0};function v2m(s,prevObj){var w=s.split(/\s+/);if(!w.length)return s;var w0=w[0],n0=NA(w0);
 /* ب + مصدر: «بتحليل» */
 if(/^ب/.test(n0)&&isMasd(n0.slice(1))){w[0]=w0.slice(1);return w.join(' ')}
 /* أمر في أول الجملة */
 if(IMP[n0]){w[0]=IMP[n0];return w.join(' ')}
 /* مضارع/لهجة: (ب)(ن|ي|ت|سن|سي)STEM(ون|ين|ها|ه)? */
 var m=n0.match(/^(?:ب)?(?:سن|سي|ست|ن|ي|ت)(\S+?)(?:ون|ين|وا)?(ه|ها|هم)?$/);
 if(m){var st=m[1],hit=null;Object.keys(STEM).some(function(k){if(NA(k)==st){hit=STEM[k];return true}});
  if(!hit&&/^(?:سوي|سو)$/.test(st)){var o=NA(w[1]||'').replace(/^ال/,'');hit=(o in SAWI)?SAWI[o]:(isAct(w[1]||'')?'':'تنفيذ');w.shift();if(hit)w.unshift(hit);return w.join(' ').trim()}
  if(hit){w[0]=hit;if(m[2]&&prevObj){w.splice(1,0,prevObj);V2M.pron=1}return w.join(' ')}}
 /* مصدر + ضمير: مراجعتها، اعتمادها، تدريبه */
 var pm=n0.match(/^(\S{2,}?)(ته|تها|تهم|ها|ه|هم)$/);if(pm&&prevObj){var base=pm[1]+(/^ت/.test(pm[2])?'ه':''),base2=pm[1];
  if(isMasd(base)||isMasd(base2)){var b0=isMasd(base)?w0.slice(0,w0.length-pm[2].length)+(/^ت/.test(pm[2])?'ة':''):w0.slice(0,w0.length-pm[2].length);w[0]=b0.replace(/^و/,'');w.splice(1,0,prevObj);V2M.pron=1;return w.join(' ')}}
 return s}
var TAILJ=R('\\s+(?:'+['في','من','إلى','الى','حتى','خلال','على','عن','مع','لـ','ل','بـ','ب','و','قبل','بعد','يمتد','تمتد','الفترة','خلال الفترة','بتاريخ','يوم','موعد','بحدود','بحلول','بداية','نهاية','منتصف','تقريبا','تقريبًا','بإذن الله','إن شاء الله','ان شاء الله','عام','سنة','شهر','شهري','المقبل','القادم','الجاي','الياي','الأسبوع','الاسبوع','يبدأ','يبدا','تبدأ','تبدا','ينتهي','تنتهي','يكون','تكون','in','on','by','at','the'].map(rx).join('|')+')\\s*$','i');
var REASON=R('\\s+(?:'+['لأن','لان','بسبب','نظرا ل','نظرًا ل','كون','عشان','علشان','حتى نلحق','كي','لكي','بحيث'].map(rx).join('|')+')\\s.*$','i');
var ATTEND=R('\\s+(?:'+['بحضور','بمشاركة','ويحضره','يحضره','برعاية'].map(rx).join('|')+')\\s.*$','i');
function finalName(s){s=s.replace(R('\\s+(?:'+rx('التي')+'|'+rx('الذي')+'|'+rx('اللي')+')\\s+(?:'+rx('ت')+'|'+rx('ي')+'|'+rx('س')+')\\S+.*$'),'').replace(REASON,'').replace(ATTEND,'').replace(/\(\s*[-–—]?\s*\)/g,'').replace(/[()]/g,' ').replace(/\s+[-–—]\s*$/,'').replace(/\s{2,}/g,' ').trim();
 var p;do{p=s;s=s.replace(TAILJ,'').replace(/[\s،,.:؛;\-–—]+$/,'').trim()}while(s!=p);
 s=s.replace(/^[\s،,.:؛;\-–—]+/,'').replace(R('^(?:'+rx('ذلك')+'|'+rx('هو')+'|'+rx('هي')+')\\s+'),'');
 s=s.replace(/_/g,' ');var w=s.split(/\s+/);if(w.length>14)s=w.slice(0,12).join(' ')+'…';return s}
/* ---------- 4) التقسيم ---------- */
var NOISE=R('^(?:'+['يهدف','تهدف','الهدف','الغاية','يأتي','ياتي','تأتي','بناء على','بناءً على','يعتبر','تعتبر','نسعى','يسعى','المشروع عبارة','المبادرة عبارة','هذا المشروع','يندرج','ينسجم','انسجاما','انطلاقا','في إطار','في اطار','ضمن الخطة','نظرا','بما أن','بما ان','سيتم التعاون مع','يتم التعاون مع'].map(rx).join('|')+')','i');
var COND=R('^(?:'+['إذا','اذا','في حال','في حالة','لو'].map(rx).join('|')+')\\s','i');
var SKIPV=R('^(?:'+rx('و')+')?(?:'+['نستخدم','سنستخدم','نعتمد على','سنعتمد على','نكتفي','سنكتفي','نستفيد من','نؤجل','سنؤجل','نلغي'].map(rx).join('|')+')'+E,'i');
var NEG=R(B+'(?:'+rx('و')+')?(?:'+['لا نحتاج','ما نحتاج','مانحتاج','لا يحتاج','ما يحتاج','لا تحتاج','لا يلزم','لا داعي','بدون','دون الحاجة','لن نحتاج','مب محتاجين','ما نبي','لا نبي','ما فيه داعي'].map(rx).join('|')+')'+E,'i');
var CONN=R('\\s*(?:،|,)?\\s+(?:'+['ثم','بعدين','وبعدين','بعدها','وبعدها','بعد ذلك','وبعد ذلك','يلي ذلك','ويلي ذلك','ومن ثم','وأخيرا','واخيرا','أخيرا','اخيرا','عشان','علشان','وبعد ما','بعد ما','وإلا','والا','لكن','ولكن','بالإضافة إلى','بالاضافة الى','إضافة إلى','اضافة الى','وكذلك','كذلك','وأيضا','وايضا','and then','then','and(?=\\s+(?:launch|sign|hire|procure|start|complete|deliver|develop|design|test|train|open|run|hold|prepare)'+E+')'].map(rx).join('|')+')'+E+'\\s*','gi');
var isAct=function(w){var r=NA(w);if(!r)return false;if(isMasd(r))return true;var pm=r.match(/^(\S{2,}?)(ته|تها|تهم|ها|ه|هم)$/);if(pm&&(isMasd(pm[1]+(/^ت/.test(pm[2])?'ه':''))||isMasd(pm[1])))return true;if(/^ب/.test(r)&&isMasd(r.slice(1)))return true;var vm=r.match(/^(?:ب)?(?:سن|سي|ست|ن|ي|ت)(\S+?)(?:ون|ين|وا)?(?:ه|ها|هم)?$/);if(vm){var st=vm[1];if(Object.keys(STEM).some(function(k){return NA(k)==st})||/^(?:سوي|سو)$/.test(st))return true}return false};
var isVerbish=function(w){var r=NA(w);if(isMasd(r))return false;var vm=r.match(/^(?:ب)?(?:سن|سي|ست|ن|ي|ت)(\S+?)(?:ون|ين|وا)?(?:ه|ها|هم)?$/);return !!vm&&(Object.keys(STEM).some(function(k){return NA(k)==vm[1]})||/^(?:سوي|سو)$/.test(vm[1]))};
var ANDV=function(w){var n=NA(w);if(!/^و\S/.test(n))return false;return isAct(n.slice(1))};
var SPLITC=null;function splitAnd(c){var w=c.split(/\s+/),parts=[],cur=[];
 for(var i=0;i<w.length;i++){var restT=w.slice(i).join(' ');if(i>0&&cur.length>=2&&/^و/.test(w[i])&&(R('^'+rx('و')+'(?:'+rx('قبل')+'|'+rx('بعد')+')(?:'+rx('ه')+'|'+rx('ها')+'|'+rx('هم')+')?$').test(w[i])||(isAct(cur[0])&&findDates(restT,SPLITC).length&&findDates(cur.join(' '),SPLITC).length==0&&!R('^'+rx('و')+'(?:'+rx('حتى')+'|'+MALT+')').test(w[i])&&w[i].length>2))){parts.push(cur.join(' '));cur=[w[i].replace(/^و/,'')];continue}if(i>0&&cur.length&&ANDV(w[i])&&(cur.length>=2||isAct(cur[0])))parts.push(cur.join(' ')),cur=[w[i].replace(/^و/,'')];else if(i>0&&cur.length&&w[i]=='و'&&w[i+1]&&ANDV('و'+w[i+1])){parts.push(cur.join(' '));cur=[];}else cur.push(w[i])}
 if(cur.length)parts.push(cur.join(' '));
 /* «توظيف وتدريب وتأهيل الموظفين» → توزيع المفعول على الأفعال المفردة */
 var out=[];var objOf=function(p){var x=p.split(/\s+/);return x.slice(1).join(' ')};
 for(var j=0;j<parts.length;j++){var p=parts[j].trim();if(!p)continue;if(p.split(/\s+/).length==1&&isMasd(p)&&!/^ال/.test(NA(p))){var k=j+1;while(k<parts.length&&parts[k].split(/\s+/).length==1)k++;var ob=k<parts.length?objOf(parts[k]):'';out.push(ob?p+' '+ob:p)}else out.push(p)}
 return out}
function sentences(block){var t=block.replace(/([.!؟?؛;])\s+/g,'$1\n').replace(/\.$/,'');return t.split(/\n+/).map(function(s){return s.replace(/[.!؟?؛;]+$/,'').trim()}).filter(Boolean)}
function commas(s){/* لا نقسم الفاصلة داخل تاريخ مثل «الأحد، 10 يناير» */return s.split(/\s*[،,]\s*(?!\d{1,2}\s)/).map(function(x){return x.trim()}).filter(Boolean)}
/* ---------- 5) تحليل عبارة ---------- */
function analyse(raw,c,st){var t=' '+raw+' ',info={raw:raw.trim()};
 if(NEG.test(t)){info.neg=1;t=t.replace(NEG,' ')}
 if(COND.test(raw.trim())){info.cond=1;var cm=raw.trim().match(R('^(?:'+rx('إذا')+'|'+rx('اذا')+'|'+rx('في حال')+'|'+rx('في حالة')+'|'+rx('لو')+')\\s+(.+?)\\s+((?:'+rx('نبدأ')+'|'+rx('نبدا')+'|'+rx('يتم')+'|'+rx('سيتم')+'|'+rx('ن')+'\\S{2,}|'+rx('ي')+'\\S{2,}).*)$','i'));if(cm){info.condTxt=cm[1];t=' '+cm[2]+' '}}
 var nb=t.match(R('^\\s*(.+?)\\s+(?:'+rx('لا')+'|'+rx('ما')+'|'+rx('لن')+')\\s+(?:'+rx('يبدأ')+'|'+rx('تبدأ')+'|'+rx('يبدا')+'|'+rx('تبدا')+'|'+rx('يكون')+')\\s+'+rx('قبل')+'\\s+(.+)$'));if(nb){t=' بدء '+nb[1].replace(/^[\s،,]*و(?=ال)/,'')+' بعد '+nb[2]+' ';info.neg=0}
 var rec=findRec(t),recSp=[];if(rec){info.rec=rec.u;var tt=t,r2;while((r2=findRec(tt))){recSp.push([r2.i,r2.j]);tt=tt.slice(0,r2.i)+' '.repeat(r2.j-r2.i)+tt.slice(r2.j)}}
 var rel=findRel(t);if(rel){info.rel=rel;t=t.slice(0,rel.i)+' '.repeat(rel.j-rel.i)+t.slice(rel.j)}
 var du=findDur(t);if(du){info.du=du.du;t=t.slice(0,du.i)+' '.repeat(du.j-du.i)+t.slice(du.j)}
 var ds=findDates(t,c);if(info.rec=='y'&&ds.length==1)info.rec=null;if(info.rec)recSp.forEach(function(q){t=t.slice(0,q[0])+' '.repeat(q[1]-q[0])+t.slice(q[1])});if(ds.length){var d0=ds[0];info.dates=ds;info.d=d0.due;if(d0.kind=='range'){info.s=d0.start;info.e=d0.e}ds.slice().reverse().forEach(function(x){t=t.slice(0,x.i)+' '.repeat(x.j-x.i)+t.slice(x.j)})}
 /* بدءًا من … / ابتداءً من (تبقى كتاريخ بدء) */
 t=t.replace(R('(?:'+rx('بدءا من')+'|'+rx('بدءًا من')+'|'+rx('ابتداء من')+'|'+rx('اعتبارا من')+')','gi'),' ');
 if(c.costIn){var cs=c.costIn(raw);if(cs)info.c=cs}
 t=t.replace(R('(?:'+rx('بتكلفة')+'|'+rx('بقيمة')+'|'+rx('بميزانية')+'|'+rx('بمبلغ')+'|'+rx('تكلفته')+'|'+rx('تكلفتها')+')(?:\\s+'+rx('تقديرية')+')?\\s+[\\d.,]+\\s*(?:'+rx('ألف')+'|'+rx('مليون')+'|'+rx('الف')+')?\\s*(?:'+rx('درهم')+'|AED)?','gi'),' ');
 if(c.ownerIn){var ow=c.ownerIn(raw);if(ow)info.o=ow}
 t=t.replace(R('(?:'+rx('يتولى')+'|'+rx('تتولى')+'|'+rx('يتولاها')+')\\s+\\S+(?:\\s+\\S+)?\\s+(?=\\S)','i'),'').replace(R('\\S+(?:\\s+\\S+)?\\s+(?:'+rx('مسؤول')+'|'+rx('مسؤولة')+'|'+rx('مسئول')+')\\s+'+rx('عن')+'\\s+','i'),'');
 var t1=t.replace(/\s{2,}/g,' ').trim();
 /* سياق قبل «سيتم/يتم/سيقوم … ب»: «بالتنسيق مع …، سيتم شراء…» */
 var pre=t1.match(R('^(.{3,}?)\\s+(?:'+rx('سوف يتم')+'|'+rx('سيتم')+'|'+rx('يتم')+'|'+rx('سيقوم')+'\\s+(?:\\S+\\s+){0,3}?'+rx('ب')+'(?=\\S{3}))\\s*'));if(pre&&!isMasd(pre[1].split(/\s+/)[0])){info.ctxTxt=pre[1];t1=t1.slice(pre[0].length)}
 t1=t1.replace(R('^'+rx('و')+'(?=(?:'+['نحتاج','نبي','نبغى','سيتم','يتم','لازم','بعدين','بعدها','سوف'].map(rx).join('|')+')'+E+')'),'');if(/^و\S{3,}/.test(t1)&&(isVerbish(t1.split(/\s+/)[0].slice(1))||isAct(t1.split(/\s+/)[0].slice(1))))t1=t1.slice(1);
 var needW=R('^(?:'+rx('و')+')?(?:'+rx('نحتاج')+'(?:\\s+'+rx('إلى')+')?|'+rx('نبي')+'|'+rx('نبغى')+'|'+rx('يلزمنا')+'|'+rx('نحتاج الى')+')\\s+','i').test(t1);
 V2M.pron=0;var n=stripLead(t1);var w0=n.split(/\s+/);if(w0.length>=2&&isVerbish(w0[0])&&isVerbish(w0[1]))n=w0.slice(1).join(' ');n=v2m(n,st.lastObj);n=stripLead(n);
 info.pron=V2M.pron;V2M.pron=0;n=finalName(n);var nw=n.split(/\s+/);if(nw[0]&&/^و\S{3,}/.test(NA(nw[0]))&&!/^و(?:دنا|ثيق|ثائق|رش|فد|زار|حد|ضع|صف|سائل|قت|قف|كال|كيل|ظيف|ظائف|جب|رق|طني|اجه|صول|عي|سيط|سم|سائط|ثائق|زن)/.test(NA(nw[0])))n=n.slice(1);if(st.lastObj)n=n.replace(R('\\s+('+rx('عليه')+'|'+rx('عليها')+'|'+rx('عليهم')+')$'),' على '+st.lastObj);if(needW&&n&&!isAct(n.split(/\s+/)[0]))n='توفير '+n;
 /* «الحفل» وحده مع تاريخ → اسم الحدث */
 info.n=n;return info}
/* ---------- 6) بناء العناصر ---------- */
function LABXdetect(text,ctx){var c=new Ctx(ctx);SPLITC=c;c.costIn=ctx.costIn;c.ownerIn=ctx.ownerIn;var KN=ctx.KN||{},hitsIn=ctx.hitsIn||function(){return []};
 var st={lastObj:''},items=[],skipped=[],notes=[];
 if(ctx.old&&R('(?:^|\\s)(?:'+rx('لكل')+'|'+rx('كل')+')\\s+\\S{2,}\\s*(?:'+rx('فيه')+'|'+rx('فيها')+'|'+rx('يشمل')+'|'+rx('تشمل')+'|'+rx('يتضمن')+'|'+rx('تتضمن')+'|[:：])').test(String(text||''))){LABX.last={skipped:[],notes:['repeat']};return ctx.old(text)}
 var T=clean(text);if(!T.replace(/[\s.\-؟?،,]+/g,'').length){LABX.last={skipped:[],notes:[]};return []}
 var lines=T.split('\n');
 /* جداول ملصوقة */
 var tab=lines.filter(function(l){return /\t/.test(l)});var units=[];
 if(tab.length>=2){var hdr=tab[0].split('\t').map(function(x){return NA(x.trim())});var isH=hdr.some(function(h){return /مهم|نشاط|task|activity|بند/.test(h)})&&hdr.some(function(h){return /مسوول|مسؤول|owner|موعد|تاريخ|date|مده|due/.test(h)});
  var ci=isH?hdr.findIndex(function(h){return /مهم|نشاط|task|activity|بند/.test(h)}):0,oi=isH?hdr.findIndex(function(h){return /مسوول|مسؤول|owner|المكلف/.test(h)}):-1,di=isH?hdr.findIndex(function(h){return /موعد|تاريخ|date|due|الانتهاء|النهايه/.test(h)}):-1;
  lines.forEach(function(l,li){if(!/\t/.test(l)){units.push({t:l});return}if(isH&&l===tab[0])return;var cells=l.split('\t').map(function(x){return x.trim()});var main=cells[ci]||cells[0];var rest=cells.filter(function(_,k){return k!=ci&&k!=oi});
   var u={t:main+(di>=0&&cells[di]?' '+cells[di]:(di<0?' '+rest.join(' '):'')),row:1};if(oi>=0&&cells[oi])u.ownerTxt=cells[oi];units.push(u)})}
 else lines.forEach(function(l){units.push({t:l})});
 /* عناوين، قوائم، مراحل */
 var phase=null,phases=[];var PH=R('^(?:'+rx('ال')+')?(?:'+rx('مرحلة')+'|'+rx('المرحلة')+'|'+rx('المحور')+'|'+rx('محور')+'|phase|stage)\\s*(?:'+rx('رقم')+'\\s*)?((?:'+rx('ال')+')?(?:'+rx('أولى')+'|'+rx('اولى')+'|'+rx('أول')+'|'+rx('ثانية')+'|'+rx('ثاني')+'|'+rx('ثالثة')+'|'+rx('ثالث')+'|'+rx('رابعة')+'|'+rx('رابع')+'|'+rx('خامسة')+'|'+rx('خامس')+'|'+rx('سادسة')+'|'+rx('أخيرة')+'|'+rx('اخيرة')+'|'+rx('نهائية')+')|\\d+)\\s*(?:[:：\\-–—]|'+rx('تشمل')+'|'+rx('تتضمن')+'|'+rx('فيها')+'|'+rx('هي')+')?\\s*','i');
 var blocks=[];/* {phaseName, text, list, deliv} */
 var CTXP=null;units.forEach(function(u,ui){var l=u.t.trim();if(!l){phase=null;CTXP=null;return}
  if(ui==0&&R('^'+rx('مشروع')+'\\s').test(l)&&!findDates(l,c).length&&l.split(/\s+/).length<=12&&!/[،,]/.test(l)){skipped.push(l.replace(/[.:]\s*$/,''));return}
  var cp=l.match(R('^('+rx('قبل')+'|'+rx('بعد')+')\\s+((?:'+rx('ال')+')?[^\\s:：،,]{3,}(?:\\s+[^\\s:：،,]{3,})?)\\s*[:：]\\s*'));if(cp){CTXP={side:/قبل/.test(cp[1])?-1:1,anc:cp[2]};l=l.slice(cp[0].length);u.ctx=CTXP}else if(CTXP)u.ctx=CTXP;
  if(GENH.test(l)){phase=null;return}
  var dv=l.match(DELIV);if(dv){blocks.push({ph:phase,text:l.slice(dv[0].length),deliv:1,u:u});return}
  /* عنوان محور/مرحلة في سطر مستقل أو مع مهامه */
  var segs=[],re=R(PH.source.replace(/^\^/,'(?:^|(?<=[.\\n؛:：،,]\\s*))'),'gi'),m,last=0,cur=null;
  var hits=[];while((m=re.exec(l))){hits.push({i:m.index,j:m.index+m[0].length,ord:m[1]})}
  if(hits.length){if(hits[0].i>0){var pre0=l.slice(0,hits[0].i).trim();if(/[:：]\s*$/.test(pre0))skipped.push(pre0.replace(/[:：]\s*$/,''));else blocks.push({ph:phase,text:pre0,u:u})}hits.forEach(function(h,k){var body=l.slice(h.j,k+1<hits.length?hits[k+1].i:l.length).trim();
    /* اسم المرحلة: نص قصير بعد النقطتين قبل مهام؟ */var nm='',bd=body;body=body.replace(/[.\s]+$/,'');var mm=body.match(/^([^:：،,.]{2,40})\s*[:：]\s*(.+)$/);if(mm&&!isMasd(mm[1].split(/\s+/)[0])){nm=mm[1].trim().replace(/^[(（]\s*|\s*[)）]$/g,'');bd=mm[2]}
    var hd=l.slice(h.i,h.j).replace(/[:：\-–—]\s*$/,'').replace(R('\\s*(?:'+rx('تشمل')+'|'+rx('تتضمن')+'|'+rx('فيها')+'|'+rx('هي')+')\\s*$','i'),'').trim();
    phase={name:hd,title:nm,idx:phases.length};phases.push(phase);
    if(!nm&&bd&&bd.split(/\s+/).length<=(k+1==hits.length&&body.length<30?3:4)&&!/[،,]/.test(bd)&&!R(rx('و')+'\\S').test(bd.replace(/^\S+/,''))&&(!isMasd(bd.split(/\s+/)[0])||(bd.split(/\s+/).length==1&&k+1==hits.length&&l.trim().slice(-bd.length)==bd))&&!findDates(bd,c).length){phase.title=bd;bd=''}
    if(bd)blocks.push({ph:phase,text:bd,u:u})});return}
  /* سطر عنوان ينتهي بنقطتين */
  if(/[:：]\s*$/.test(l)&&l.split(/\s+/).length<=6){var hn=l.replace(/[:：]\s*$/,'').trim();if(GENH.test(hn+':')||GENH.test(hn)){phase=null;return}var mh=hn.match(R('^(?:'+rx('ال')+')?(?:'+rx('محور')+'|'+rx('المحور')+')\\s+\\S+\\s*[:：\\-–—]?\\s*(.*)$'));phase={name:mh&&mh[1]?mh[1]:hn,title:'',idx:phases.length};phases.push(phase);return}
  var lm=l.match(LISTM);blocks.push({ph:phase,text:lm?l.slice(lm[0].length):l,list:!!lm,u:u})});
 /* مراحل بالترتيب داخل جملة: «ثلاث مراحل؛ الأولى للتخطيط …، والثانية للتنفيذ …» */
 blocks=blocks.reduce(function(acc,b){var re2=R('(?:^|[،,؛;.]\\s*|\\s)(?:'+rx('و')+')?('+rx('الأولى')+'|'+rx('الاولى')+'|'+rx('الثانية')+'|'+rx('الثالثة')+'|'+rx('الرابعة')+'|'+rx('الخامسة')+'|'+rx('الأخيرة')+')\\s+(?:'+rx('لل')+'|'+rx('ل')+'|'+rx('هي')+'\\s+|'+rx('فيها')+'\\s+)','gi');var hs=[],m2;while((m2=re2.exec(b.text)))hs.push({i:m2.index,j:m2.index+m2[0].length,w:m2[1]});
  if(hs.length>=2&&R(rx('مراحل')).test(b.text.slice(0,hs[0].i+1)+' '+(b.u&&b.u.t||''))){hs.forEach(function(h,k){var body=b.text.slice(h.j,k+1<hs.length?hs[k+1].i:b.text.length).trim();var pre=b.text.slice(h.j-2,h.j).trim();var nm2=(/لل$/.test(NA(b.text.slice(h.i,h.j).trim()))?'ال':'')+body;var p2={name:'المرحلة '+NA(h.w).replace(/^ال/,''),title:'',idx:phases.length};phases.push(p2);acc.push({ph:p2,text:nm2,u:b.u,inl:1})});return acc}
  acc.push(b);return acc},[]);
 /* ---------- العبارات ---------- */
 var clauses=[],GID=0;
 var FIRST=true;blocks.forEach(function(b){var ss=b.list?[b.text]:sentences(b.text);ss.forEach(function(s){if(FIRST){FIRST=false;if(R('^'+rx('مشروع')+'\\s').test(s.trim())&&!findDates(s,c).length&&!/[،,]/.test(s)&&s.split(/\s+/).length<=12){skipped.push(s);return}}
   if(NOISE.test(s.trim())){var rest=s.replace(R('^.*?(?:'+rx('سيتم')+'|'+rx('يتم')+'|'+rx('ويتضمن ذلك')+'|'+rx('يشمل ذلك')+'|'+rx('ويشمل ذلك')+'|'+rx('ويتضمن')+')\\s+','i'),'');
     if(rest!=s&&rest.length>3&&!NOISE.test(rest)){skipped.push(s.slice(0,s.length-rest.length).trim());s=rest}else{
       /* «المشروع عبارة عن تطوير …» → خلفية */skipped.push(s);return}}
   var alt=s.match(R('\\s*[،,]?\\s*(?:'+rx('وإلا')+'|'+rx('والا')+'|'+rx('وإلّا')+')\\s+.*$','i'));if(alt){skipped.push(alt[0].replace(/^[\s،,]+/,''));s=s.slice(0,alt.index)}
   var parts=b.deliv?commas(s):[s];var out=[];
   parts.forEach(function(p){p.split(CONN).forEach(function(q){if(q&&q.trim())out.push(q.trim())})});
   var out2=[];out.forEach(function(q){commas(q).forEach(function(r){out2.push(r)})});
   /* دمج قطع لا فعل فيها ولا اسم كافٍ مع ما قبلها (مثل «الثلاثاء») */
   var out3=[];out2.forEach(function(r){var w=r.split(/\s+/);if(out3.length&&w.length==1&&!isAct(w[0])&&!findDates(r,c).length&&!R('^(?:'+rx('ال')+')').test(r)){out3[out3.length-1]+='، '+r}else out3.push(r)});
   out3.forEach(function(r){GID++;splitAnd(r).forEach(function(x){clauses.push({t:x,ph:b.ph,row:b.u&&b.u.row,ownerTxt:b.u&&b.u.ownerTxt,deliv:b.deliv,gid:GID,ctx:b.u&&b.u.ctx})})});
   /* نشر التاريخ/النسبي الختامي على الإخوة بلا تاريخ ضمن نفس الجملة المنسقة */
 })});
 /* ---------- تحليل كل عبارة ---------- */
 clauses=clauses.filter(function(cl){var tt=cl.t.trim();if(SKIPV.test(tt)){skipped.push(cl.t);return false}if(R('^(?:'+rx('و')+')?(?:'+['فيه','فيها','يتضمن','تتضمن','يشمل','تشمل','بحضور','بمشاركة','يحضره','ويحضره','يتولاها','يتولاه','يتولى','تتولى','تتولاها'].map(rx).join('|')+')\\s','i').test(tt)&&!findDates(tt,c).length&&!isAct((tt.replace(/^\S+\s+/,'').split(/\s+/)[0])||'')){skipped.push(cl.t);return false}return true});
 var A2=clauses.map(function(cl){var info=analyse(cl.t,c,st);info.ph=cl.ph;info.ctx=cl.ctx;info.row=cl.row;info.deliv=cl.deliv;if(cl.ownerTxt&&ctx.ownerIn){var ow=ctx.ownerIn(cl.ownerTxt);if(ow)info.o=ow}
   var nn=info.n||'';var w=nn.split(/\s+/);var li=-1;w.forEach(function(x,q){if(q>0&&/^[لب]/.test(NA(x))&&isMasd(NA(x).slice(1)))li=q});if(li>0&&li<w.length-1)st.lastObj=w.slice(li+1).join(' ');else if(w.length>=2&&isMasd(w[0]))st.lastObj=w.slice(1).join(' ').replace(/…$/,'');else if(w.length>=1&&!isMasd(w[0])&&nn)st.lastObj=nn;return info});
 /* إخوة العبارة المنسقة (و + مصدر) يرثون الموعد/النسبي من آخرهم إن لم يكن لهم موعد */
 for(var i=A2.length-1;i>0;i--){var a=A2[i],p=A2[i-1];if(clauses[i].gid===clauses[i-1].gid&&p.d==null&&!p.rel&&(a.d!=null||a.rel)&&!a.ownD){p.d=a.d;p.s=a.s;if(a.rel)p.rel=Object.assign({},a.rel)}}
 /* ---------- إلى عناصر المختبر ---------- */
 var byPh=new Map();
 A2.forEach(function(x,ix){var n=x.n;if(!n||n.length<2){if(x.raw&&x.raw.length>2&&!x.d)skipped.push(x.raw);return}
  if(R('^(?:'+rx('مشروع جديد')+'|'+rx('المشروع')+'|'+rx('مشروع')+')$').test(n))return;
  var H=hitsIn(n),k=H.length?H[0].k:null;if(!k&&x.raw){var H2=hitsIn(x.raw);if(H2.length&&NA(n).indexOf(NA(x.raw.slice(H2[0].i,H2[0].e)).slice(0,4))>=0)k=H2[0].k}if(!k&&ctx.base&&x.raw){try{var bb=ctx.base(x.raw).filter(function(y){return y&&KN[y.k]&&!y.neg});for(var q3=0;q3<bb.length;q3++){var y3=NA(bb[q3].n).split(/\s+/)[0]||'';if(y3.length>=3&&NA(n).indexOf(y3.slice(0,4))>=0){k=bb[q3].k;break}}}catch(_){}}
  var warn=[];if(x.cond)warn.push('شرط: «'+(x.condTxt||'')+'» — تحقّق قبل الاعتماد');if(/…$/.test(n))warn.push('اسم طويل اختُصر');
  if(x.rel&&x.rel.anc=='@prev'){var pv=null;for(var q=items.length-1;q>=0;q--){if(!items[q].neg&&items[q].k!='_phs'){pv=items[q];break}}if(pv&&pv._prevRel&&x.rel.n)pv={n:pv._prevRel};if(pv){x.rel.anc=pv.n;x._prevRel=pv.n}else{warn.push('موعد نسبي بلا مرجع واضح');delete x.rel}}
  var base={n:n,src:x.raw,z:'m',_lx:1};if(x._prevRel)base._prevRel=x._prevRel;if(x.c)base.c=x.c;if(x.o)base.o=x.o;if(x.du)base.du=x.du;if(warn.length)base.warn=warn;
  if(x.d!=null)base.d=fromN(x.d);if(x.s!=null&&x.s!==x.d)base.s=fromN(x.s);
  if(x.rel&&!base.d){base.rel={side:x.rel.side,anc:x.rel.anc,n:x.rel.n,u:x.rel.u}}if(!x.rel&&base.d==null&&x.ctx&&!x.rec){base.rel={side:x.ctx.side,anc:x.ctx.anc,n:0,u:''}}
  if(x.neg){base.neg=1;delete base.d;delete base.rel}
  /* تكرار → مهمة لكل فترة */
  if(x.rec=='y'&&x.d!=null)x.rec=null;if(x.rec&&!x.neg){var step={m:1,q:3,h:6,y:12,w:0}[x.rec],prevD=null,ctxD=null;if(x.ctx){var ak=NA(x.ctx.anc).replace(/^ال/,'').slice(0,5);for(var q4=0;q4<items.length;q4++){if(items[q4].d&&NA(items[q4].n).indexOf(ak)>=0){var pb=items[q4].d.split('-');ctxD=dnum(+pb[0],+pb[1]-1,+pb[2])+(x.ctx.side>0?7:-60);break}}}for(var q2=items.length-1;q2>=0;q2--){if(items[q2].d&&!items[q2].rec){var pa=items[q2].d.split('-');prevD=dnum(+pa[0],+pa[1]-1,+pa[2]);break}}var from=x.d!=null?x.d:ctxD!=null?ctxD:(x.pron&&prevD!=null?prevD+(x.rec=='y'?365:x.rec=='h'?182:x.rec=='q'?91:x.rec=='m'?30:7):Math.max(c.today,c.ps||c.today)),to=c.pe&&c.pe>from?c.pe:from+365;var occ=[];
   if(x.rec=='w'){for(var dd=from;dd<=to&&occ.length<12;dd+=7)occ.push(dd);if((to-from)/7>12)warn.push('نشاط أسبوعي: أُنشئت أول 12 مرة فقط')}
   else{var f=new Date(from*864e5),y0=f.getUTCFullYear(),m0=f.getUTCMonth(),d0=x.d!=null?f.getUTCDate():15;for(var kk=0;kk<24;kk++){var mm2=m0+kk*step,yy2=y0+Math.floor(mm2/12);mm2%=12;var dn2=dnum(yy2,mm2,Math.min(d0,dim(yy2,mm2)));if(dn2>to)break;if(dn2<from-3)continue;occ.push(dn2)}}
   if(x.dates&&x.dates.length>1&&x.rec=='h'){occ=x.dates.map(function(z){return z.due})}
   var ML=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
   occ.forEach(function(o,oi){var dt=new Date(o*864e5),lab=x.rec=='w'?fromN(o):ML[dt.getUTCMonth()]+' '+dt.getUTCFullYear();items.push(Object.assign({},base,{k:k&&KN[k]?k:'_ev',n:n+' — '+lab,d:fromN(o),rec:x.rec,recN:occ.length,recI:oi,src:x.raw}))});return}
  /* داخل مرحلة: مهمة ضمن _phs (بلا موعد) أو عنصر مستقل إن كان له موعد */
  if(x.ph&&!x.neg&&base.d==null&&!base.rel){var g=byPh.get(x.ph);if(!g){g={k:'_phs',n:x.ph.name+(x.ph.title?' — '+x.ph.title:''),tasks:[],src:'',z:'m',_lx:1};byPh.set(x.ph,g);items.push(g)}g.tasks.push({n:n,du:x.du||5,src:x.raw});g.src=(g.src?g.src+' · ':'')+x.raw;return}
  if(x.ph&&!x.neg&&(base.d!=null||base.rel)){base.ph=x.ph.name;if(x.ph.title)base.ph+=' — '+x.ph.title}
  if(k&&KN[k]){/* اسم العنصر في الأنواع يأتي بعد تسمية النوع («شراء: …») فنحذف الفعل فقط إن كانت التسمية تؤديه */var w=n.split(/\s+/);var KV={hr:'توظيف تعيين استقطاب',proc:'شراء توريد',agr:'توقيع ابرام',doc:'اعداد صياغه كتابه',trn:'تدريب تاهيل',evt:'تنظيم اقامه التحضير',conf:'تنظيم اقامه عقد',venue:'حجز',trans:'ترجمه',data:'جمع',pub:'اصدار نشر',cons:'استقطاب التعاقد',vis:'تنظيم',spon:'استقطاب',sec:'استخراج'}[k]||'';
   if(w.length>=2&&KV&&KV.split(' ').indexOf(NA(w[0]).replace(/^ال/,''))>=0&&!(k=='evt'&&/^(?:اطلاق|افتتاح|تدشين)$/.test(NA(w[0]))))base.nFull=n,base.n=w.slice(1).join(' ').replace(R('^'+rx('مع')+'\\s+'),'');
   base.k=k;base.z=ctx.sizeIn?ctx.sizeIn(k,x.raw):'m';items.push(base);return}
  base.k=base.d!=null||base.rel?'_ev':'_ph';if(base.du&&base.k=='_ph'){base.k='_phs';base.tasks=[{n:n,du:base.du}];base.n=n}items.push(base)});
 /* مراحل بلا مهام: «المرحلة الثالثة» وحدها → أضفها مرحلةً فارغة باسمها */
 phases.forEach(function(p){if(!byPh.has(p)&&!items.some(function(x){return x.ph&&x.ph.indexOf(p.name)==0})&&p.title){items.push({k:'_phs',n:p.name+' — '+p.title,tasks:[{n:p.title,du:5}],src:p.title,z:'m',_lx:1})}});
 /* إزالة التكرار */
 var seen=new Set(),res=[];items.forEach(function(x){var key=(x.neg?'-':'')+x.k+'|'+NA(x.n)+'|'+(x.d||'');if(seen.has(key))return;seen.add(key);res.push(x)});
 LABX.last={skipped:skipped.filter(Boolean).slice(0,20),notes:notes};
 return res}

/* ---------- اختيار الأفضل بين قراءتين ---------- */
var BADW=R('(?:^|\\s)(?:'+['ثم','بعدين','وبعدها','بعدها','قبله','بعده','قبلها','بعدها','عشان','علشان','لازم','نحتاج','نبي','نبغى','يتوظف','فيها','فيه','عندي','عندنا','مرحلتين','ينحط','يكون','تكون','لين','وبعد ما','بعد ما','سيتم','يتم','ذلك','اللي','والا','وإلا','بحضور'].map(rx).join('|')+')(?=\\s|$)','i');
function score(text,items){var c=new Ctx({today:Date.now()/864e5|0});var sc=0,names=[];
 (items||[]).forEach(function(x){if(x.k=='_phs'||x.k=='_rep'){if(/…/.test(String(x.n||''))||String(x.n||'').split(/\s+/).length>9)sc-=1;(x.tasks||[]).forEach(function(t){names.push({n:t.n,task:1})});sc+=(x.tasks&&x.tasks.length)?1:-2}else names.push({n:x.n,d:x.d,rel:x.rel,neg:x.neg,k:x.k})});
 names.forEach(function(z){var n=String(z.n||'').replace(/\s—\s.*$/,''),w=n.split(/\s+/).filter(Boolean);var v=1;
  if(BADW.test(n))v-=3;if(NOISE.test(n.trim()))v-=4;if(w.length==1&&isMasd(w[0])&&!/^ال/.test(NA(w[0])))v-=2;if(w.length>=2&&isMasd(w[0])&&isMasd(w[1])&&!/^ال/.test(NA(w[1])))v-=2;if(/^(?:رش[ةه]|رشه)/.test(NA(w[0]||'')))v-=3;if(R('^(?:'+rx('في البداية')+'|'+rx('أولا')+'|'+rx('اولا')+')').test(n))v-=2;if(w.length>9)v-=2;else if(w.length>6)v-=1;if(/…$/.test(n))v-=1;
  if(w[0]&&(isVerbish(w[0])||/^و\S{3,}/.test(NA(w[0]))&&isAct(w[0].slice(1))))v-=2;
  if(z.task&&R(rx('المرحلة')+'|'+rx('المرحله')).test(n))v-=3;
  if(R(MALT).test(n)||/\d{1,2}\/\d{1,2}/.test(n))v-=2;
  if(R('\\s(?:'+rx('من')+'|'+rx('في')+'|'+rx('إلى')+'|'+rx('حتى')+'|'+rx('ين')+'|'+rx('بتاريخ')+')$').test(n))v-=1;
  sc+=v});
 var t=clean(text),nd=findDates(t,c).length,nr=(t.match(R('(?:'+rx('قبل')+'|'+rx('بعد')+')\\S*\\s+\\S+\\s+'+rx('ب')+'\\S+','g'))||[]).length;
 var wd=names.filter(function(z){return z.d||z.rel}).length;if(nd+nr>0)sc+=6*Math.min(1,wd/Math.max(1,Math.min(nd+nr,names.length)));
 var np=(t.match(R(rx('المرحلة')+'|'+rx('المرحله')+'|phase','gi'))||[]).length,gp=(items||[]).filter(function(x){return x.k=='_phs'}).length;if(np>=2)sc+=gp>=np?4:gp>=2?2:-2;
 return sc}
var LABX=window.LABX={detect:LABXdetect,score:score,clean:clean,findDates:function(t,today){return findDates(clean(t),new Ctx({today:today}))},v2m:v2m,isMasd:isMasd,last:{skipped:[],notes:[]},ver:4};
})();
