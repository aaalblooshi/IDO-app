/* مخطط رحلة المتعامل التفاعلي: كل الخدمات والخطوات والأدوار ومسارات الإعادة والرفض والتصعيد، مع تكبير وتصغير وسحب */
(function(){
var NS='http://www.w3.org/2000/svg';
function X(){return window.JNX}
function P(a){return X().P(a)}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

/* الممرات (الأدوار) */
var LANES=[
 {k:'pm',t:['مدير المشروع / المعدّ','Project manager / preparer'],s:['المعدّ','Preparer'],c:'#1d5f8a',bg:'#e3eefb'},
 {k:'of',t:['مكتب التطوير المؤسسي','Development Office'],s:['المكتب','Office'],c:'#2d3a55',bg:'#e8eaf0'},
 {k:'rv',t:['المراجع','Reviewer'],s:['المراجع','Reviewer'],c:'#0b7aa3',bg:'#e2f4fb'},
 {k:'ap',t:['المعتمِد','Approver'],s:['المعتمِد','Approver'],c:'#0a6b3d',bg:'#e5f2ea'},
 {k:'tk',t:['المكلَّف بالمهمة','Task owner'],s:['المكلَّف','Assignee'],c:'#8a5a00',bg:'#fff3d6'},
 {k:'fl',t:['المطّلعون والمشاركون','Viewers & participants'],s:['المطّلعون','Viewers'],c:'#5b3a9e',bg:'#efe9fb'}];
var LI={};LANES.forEach(function(l,i){LI[l.k]=i});
var FILT=[['all',['كل الأدوار','All roles']],['pm',['مدير المشروع','Project manager']],['of',['مكتب التطوير','Office']],['rv',['المراجع','Reviewer']],['ap',['المعتمِد','Approver']],['tk',['المكلَّف بمهمة','Task owner']],['fl',['المتابع','Follower']],['ow',['مالك المشروع','Owner']],['uh',['مسؤول الوحدة','Unit head']],['pt',['المشارك بالتخطيط','Planning participant']]];

/* نصوص الشرح */
var TX={
 ret:[['من يعيد الطلب: المراجع أثناء المراجعة، والمعتمِد أثناء الاعتماد، ومكتب التطوير المؤسسي في أي مرحلة بعد التقديم، وكذلك المكتب بعد رفض المراجع أو المعتمِد.','Who can return it: the reviewer during review, the approver during approval, and the Office at any step after submission (also after a reject).'],
  ['لماذا يُعاد: نقص في البيانات، أو تعديل مطلوب في بنود محددة، أو مرفقات ناقصة، أو ملاحظات تحتاج ردًّا. ويكتب من يعيده سبب الإعادة، ويمكنه وضع ملاحظة على كل بند.','Why: missing data, required edits on specific items, missing attachments, or comments to address. The returner writes the reason and can comment on each item.'],
  ['ماذا يحدث: تُلغى التواقيع السابقة، ويرتفع رقم الإصدار، وتظهر الملاحظات للمعدّ على البنود، فيعدّل ويوقّع ويقدّم من جديد ليمر بالمراجعة والاعتماد مرة أخرى.','What happens: previous signatures are cleared, the version number goes up, comments appear on the items; the preparer edits, signs and resubmits, and it goes through review and approval again.']],
 fz:[['في الميثاق فقط: «إرجاع وطلب دراسة جدوى». يستخدمه المراجع أو المعتمِد أو المكتب عندما يحتاج المشروع دراسة جدوى قبل البت فيه، فيُفعَّل قسم دراسة الجدوى ويصبح إلزاميًا، ولا يمكن إعادة التقديم قبل تعبئته.','Charter only: "Return and request a feasibility study". Used when the project needs a feasibility study first; the study section becomes mandatory before resubmission.']],
 rej:[['عند رفض المراجع أو المعتمِد لا يُغلق الطلب مباشرة، بل ينتقل إلى «قرار المكتب» مع سبب الرفض.','When the reviewer or approver rejects, the request is not closed: it moves to "Office decision" with the reason.'],
  ['يقرر مكتب التطوير المؤسسي أحد أربعة: متابعة الاعتماد (إرساله للمعتمِد)، أو إعادته للمعدّ للتعديل، أو الاعتماد المباشر، أو الرفض النهائي مع بيان السبب.','The Office then decides: continue to approval, return it to the preparer, approve directly, or reject finally with a reason.']],
 fin:[['يُغلق الطلب برفض نهائي ويُبلَّغ المعدّ بالسبب، ويبقى في السجل للاطلاع. ويمكن البدء بطلب جديد عند الحاجة.','The request is closed as finally rejected; the preparer is told why. It stays for reference, and a new request can be started.']],
 dir:[['يستطيع مكتب التطوير المؤسسي اعتماد الطلب مباشرة في أي مرحلة من التقديم حتى الاعتماد، مثل غياب المعتمِد أو الحالات العاجلة. ويُسجَّل «اعتماد مباشر من المكتب» في سجل التدقيق.','The Office can approve directly at any step from submission to approval (e.g. approver absent or urgent). It is logged as a direct Office approval.']],
 esc:[['إذا تأخرت المراجعة أو الاعتماد عن المدة المحددة: يرسل المكتب تذكيرًا، ويمكن لمقدّم الطلب رفع «تصعيد»، ويصعّد النظام تلقائيًا حسب الإعدادات.','If review or approval is overdue: the Office can send reminders, the requester can raise an escalation, and the system escalates automatically per settings.'],
  ['قرار التصعيد للمكتب (أو لمن لديه صلاحية قرارات التصعيد): توجيه الخطوة المعلّقة إلى شخص آخر، أو تجاهل التصعيد، مع ملاحظة تُسجَّل. ويمكن لرافع التصعيد سحبه.','The Office (or anyone with escalation rights) decides: redirect the pending step to someone else, or ignore it, with a logged note. The raiser can withdraw it.']],
 cancel:[['يستطيع المعدّ إلغاء طلبه ما دام مسودة أو مُعادًا إليه، فيصبح «ملغى». ويستطيع مكتب التطوير استعادته مسودة لاحقًا.','The preparer can cancel while it is a draft or returned; it becomes "Cancelled". The Office can restore it as a draft.'],
  ['الحذف النهائي لا يتم مباشرة: يُرفع «طلب حذف» ويقرره من لديه صلاحية الحذف، ويمكن أرشفة الطلب بدل حذفه.','Permanent deletion goes through a deletion request decided by someone with delete rights; archiving is an alternative.']],
 beh:[['إذا وقّع المعدّ ولم يقدّم، أو تعذّر عليه التقديم: يقدّمه نيابةً عنه الأدمن، أو من لديه مهام المكتب، أو مسؤول الوحدة، أو صاحب صلاحية التعديل على المشروع.','If the preparer signed but did not submit, or cannot: it can be submitted on their behalf by an admin, office duty holder, unit head, or someone with edit rights on the project.'],
  ['يبقى توقيع المعدّ ظاهرًا، ويُسجَّل في سجل التدقيق من قدّم الطلب وبأي صفة. ويمكن أيضًا التوقيع بالإنابة لمن عيّنه المستخدم نائبًا عنه.','The preparer’s signature remains; the audit log records who submitted and in what capacity. A delegated proxy can also sign.']],
 asgR:[['يحدد المكتب المراجع، ويمكنه تحديد مدة مخصصة لهذا الطلب. ويمكنه أيضًا إعادة الطلب للمعدّ أو اعتماده مباشرة.','The Office assigns the reviewer, optionally a custom duration. It can also return it or approve directly.']],
 asgA:[['بعد اكتمال المراجعة يحدد المكتب المعتمِد ويرسل الطلب للاعتماد.','After review, the Office assigns the approver and sends it for approval.']],
 act:[['بصلاحية «تفعيل الخطط قبل اعتمادها» يفعّل المكتب الخطة مؤقتًا، فتظهر مهامها للمكلفين ويبدأ التنفيذ قبل اكتمال الاعتماد.','With "Activate plans", the Office can activate a plan before approval so its tasks reach assignees early.']],
 rev:[['الخطة المعتمدة تُعدَّل بإصدار جديد: يُنسخ منها مسودة يعدّلها مدير المشروع ثم تمر بالمراجعة والاعتماد، وتبقى المعتمدة سارية حتى يُعتمد الإصدار الجديد. ويمكن إلغاء المسودة والعودة للمعتمدة.','An approved plan is revised via a new version: a draft copy is edited and goes through review and approval, while the approved one stays in force. The draft can be discarded.'],
  ['وعند وجود طلب تغيير معتمد تُربط الخطة المعدّلة به.','When there is an approved change request, the revised plan is linked to it.']],
 crl:[['بعد اعتماد طلب التغيير: يُعدّل مدير المشروع الخطة بإصدار جديد ويربطه بطلب التغيير، ثم تمر الخطة المعدّلة بالمراجعة والاعتماد.','After a change request is approved, the PM revises the plan (new version) linked to it, which then goes through review and approval.']],
 grp:[['قبل التقديم يمكن لمدير المشروع دعوة فريق العمل لمدة محددة ليضيفوا ملاحظاتهم ويعدّلوا المهام والمدد في المسودة. بعد انتهاء المدة يصبح اطلاعهم للقراءة فقط.','Before submission the PM can invite the team for a set period to comment and edit tasks in the draft; afterwards they are read-only.']],
 obs:[['المتابع ومالك المشروع ومسؤول الوحدة يطّلعون على الطلب للقراءة ويتلقون إشعارات الأحداث التي اختاروها. مسؤول الوحدة يملك أيضًا تعديل طلبات ومهام وحدته والتقديم نيابةً عن المعدّ.','Followers, the project owner and unit heads view read-only and get notifications for chosen events. Unit heads can also edit their unit’s requests and tasks and submit on behalf.']],
 tkof:[['يتابع المكتب المهام المتأخرة ويذكّر المكلفين ويُشعر مدير المشروع. ومدير المشروع ومسؤول الوحدة يحدّثان مهام مشاريعهم ويذكّران بها.','The Office follows late tasks, reminds assignees and notifies the PM. The PM and unit heads can update and remind tasks in their projects.']],
 prog:[['مشروع له ميثاق معتمد وبلا خطة: يرفع مدير المشروع (أو صاحب صلاحية التعديل) نسبة الإنجاز مع ملاحظة ومرفقات، ويعتمدها أو يرفضها من لديه صلاحية اعتماد نسب الإنجاز، فتظهر في المحفظة ومشاريعي.','A project with an approved charter but no plan: the PM (or an editor) submits a progress percentage with notes and files; someone with progress approval rights approves or rejects it, and it then appears in the portfolio.']],
 arch:[['بعد اعتماد التقرير الختامي يُغلق المشروع ويُؤرشف، ويبقى ملفه وتقاريره متاحة للاطلاع.','After the closure report is approved the project is closed and archived; its file stays viewable.']]};

/* نموذج كل خدمة: عقد (صفوف وممرات) وأسهم بأنواعها */
function doc(k){var S=X().SV[k],s=S.s,N=[],E=[];
 function n(id,lane,row,t,o){var z=Object.assign({id:id,lane:lane,row:row,t:t,kind:'step'},o||{});N.push(z);return z}
 function e(a,b,r,kd,lab,o){E.push(Object.assign({a:a,b:b,r:r,k:kd||'main',lab:lab},o||{}))}
 n('d','pm',0,s[0],{st:0});
 n('cx','of',0,['إلغاء الطلب ← «ملغى»','Cancel → "Cancelled"'],{kind:'term',info:TX.cancel,roles:['pm','of']});
 if(k=='plan')n('gp','fl',0,['التخطيط الجماعي على المسودة','Group planning on the draft'],{kind:'note',info:TX.grp,roles:['pt','pm']});
 n('sg','pm',1,s[1],{st:1});
 n('bh','of',1,['تقديم نيابةً عن المعدّ أو بالإنابة','Submit on behalf / by proxy'],{kind:'note',info:TX.beh,roles:['of','uh']});
 n('ar','of',2,['تحديد المراجع والمدة','Assign reviewer & duration'],{kind:'off',st:1,info:TX.asgR});
 if(k=='plan')n('ac','ap',2,['تفعيل مؤقت قبل الاعتماد','Activate before approval'],{kind:'note',info:TX.act,roles:['of'],col:'of'});
 n('rv','rv',3,s[2],{st:2});
 n('es','ap',3,['التصعيد والتذكير عند التأخر','Escalation & reminders'],{kind:'dec',info:TX.esc,roles:['of','pm'],col:'of'});
 n('ob','fl',4,['المطّلعون: قراءة وإشعارات','Viewers: read & notices'],{kind:'note',info:TX.obs,roles:['fl','ow','uh']});
 n('aa','of',4,['تحديد المعتمِد','Assign approver'],{kind:'off',st:2,info:TX.asgA});
 n('ap','ap',5,s[3],{st:3});
 n('od','of',6,['قرار المكتب بعد الرفض','Office decision after a reject'],{kind:'dec',info:TX.rej,roles:['of']});
 n('fr','rv',7,['رفض نهائي ← «مرفوض»','Final reject → "Rejected"'],{kind:'term',bad:true,info:TX.fin,roles:['of']});
 n('en',k=='plan'?'pm':'of',8,s[4],{st:4,end:true});
 var nt={plan:['rx',['تعديل الخطة المعتمدة بإصدار جديد','Revise approved plan (new version)'],TX.rev],cr:['cl',['تعديل الخطة وربطها بطلب التغيير','Revise and link the plan'],TX.crl],charter:['pg',['بلا خطة: اعتماد نسبة الإنجاز','No plan: progress approval'],TX.prog],closure:['ah',['إغلاق المشروع وأرشفته','Close & archive the project'],TX.arch]}[k];
 if(nt)n(nt[0],'tk',8,nt[1],{kind:'note',info:nt[2],roles:['pm','of']});
 e('d','sg','v');e('sg','ar','v');e('ar','rv','v');e('rv','aa','v');e('aa','ap','v');
 e('ap','en','vt','main',null,{tx:.32});
 e('d','cx','h','opt',null,{desc:TX.cancel});e('sg','bh','h','opt',null,{desc:TX.beh});
 if(k=='plan')e('ar','ac','h','opt',null,{desc:TX.act});
 e('rv','es','h','esc',null,{desc:TX.esc});
 e('od','fr','vt','rej',['رفض نهائي','Final reject'],{desc:TX.fin});
 e('od','en','vt','opt',['اعتماد مباشر','Direct approval'],{tx:.7,desc:TX.dir});
 if(nt)e('en',nt[0],'h','opt',null,{desc:nt[2]});
 /* حافلتان: الإعادة للمعدّ، والرفض إلى قرار المكتب */
 E.push({bus:'ret',src:['rv','ap','od'],b:'d',k:'ret',lab:['↩ إعادة للمعدّ للتعديل','↩ Return to preparer'],desc:k=='charter'?TX.ret.concat(TX.fz):TX.ret});
 E.push({bus:'rej',src:['rv','ap'],b:'od',k:'rej',lab:['✕ رفض','✕ Reject'],desc:TX.rej});
 return {N:N,E:E,rows:9}}
function tasks(){var s=X().SV.tasks.s,N=[],E=[];
 function n(id,lane,row,t,o){var z=Object.assign({id:id,lane:lane,row:row,t:t,kind:'step'},o||{});N.push(z);return z}
 s.forEach(function(x,i){n('t'+i,'tk',i,x,{st:i})});
 n('fo','of',3,['متابعة المتأخرات والتذكير','Follow up late tasks & remind'],{kind:'off',st:3,info:TX.tkof});
 n('pu','pm',2,['مدير المشروع يحدّث ويذكّر','PM updates & reminds'],{kind:'note',info:TX.tkof,roles:['pm','uh']});
 for(var i=0;i<s.length-1;i++)E.push({a:'t'+i,b:'t'+(i+1),r:'v',k:'main'});
 E.push({a:'t3',b:'fo',r:'h',k:'esc',lab:['تأخر','Late'],desc:TX.tkof});E.push({a:'t2',b:'pu',r:'h',k:'opt',desc:TX.tkof});
 return {N:N,E:E,rows:5}}

var G={W:0,H:0,s:1,tx:0,ty:0,role:'all',nodes:[],edges:[]};
var LW=236,NW=172,NH=72,RH=124,BH=64,BG=80,TOP=70,SIDE=54;

function wrap(t,max){var w=String(t).split(/\s+/),lines=[],cur='';w.forEach(function(x){if((cur+' '+x).trim().length>max&&cur){lines.push(cur);cur=x}else cur=(cur+' '+x).trim()});if(cur)lines.push(cur);if(lines.length>3){lines=lines.slice(0,3);lines[2]+='…'}return lines}
function laneX(i){var rtl=document.documentElement.dir!='ltr';return rtl?SIDE+(LANES.length-1-i)*LW:SIDE+i*LW}

function build(){var ORDER=X().ORDER,y=TOP;G.nodes=[];G.edges=[];G.blocks=[];
 G.W=SIDE*2+LANES.length*LW;
 ORDER.forEach(function(k){var M=k=='tasks'?tasks():doc(k),b={k:k,y:y,ids:{}};var ry=y+BH;
  M.N.forEach(function(n){n.k=k;n.x=laneX(LI[n.lane])+(LW-NW)/2;n.h=n.kind=='step'?NH:(n.kind=='hub'?NH+12:NH-6);n.y=ry+n.row*RH+(NH-n.h)/2;n.gid=G.nodes.length;G.nodes.push(n);b.ids[n.id]=n});
  M.E.forEach(function(e){var z=b.ids[e.b];if(!z)return;if(e.bus){var ss=e.src.map(function(q){return b.ids[q]}).filter(Boolean);G.edges.push(Object.assign({},e,{src:ss,b:z,blk:b}));return}var a2=b.ids[e.a];if(a2)G.edges.push(Object.assign({},e,{a:a2,b:z}))});
  b.h=BH+M.rows*RH+10;b.first=b.ids[k=='tasks'?'t0':'d'];b.last=b.ids[k=='tasks'?'t4':'en'];G.blocks.push(b);y+=b.h+BG});
 G.H=y+20}

function el(t,a,p){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
function txt(p,x,y,lines,o){/* سطر مستقل لكل نص: يتجنب خلل سفاري في ترتيب الكلمات العربية داخل tspan */
 var g=el('g',{},p),lh=o.lh||16;
 lines.forEach(function(l,i){var ar=/[؀-ۿ]/.test(l);var t=el('text',Object.assign({x:x,y:y+i*lh,'text-anchor':'middle','font-size':o.fs||13,'font-weight':o.fw||700,fill:o.fill||'#1b1d1f','font-family':'Cairo, system-ui, sans-serif',direction:ar?'rtl':'ltr','unicode-bidi':'plaintext'},o.a||{}),g);t.textContent=l});
 return g}
function pill(p,x,y,lab,c){var w=Math.min(190,lab.length*7.2+22);el('rect',{x:x-w/2,y:y-12,width:w,height:22,rx:11,fill:'#fff',stroke:c,'stroke-width':1.2},p);txt(p,x,y+4,[lab],{fs:11.5,fw:800,fill:c})}

var EK={main:{c:'#5a6675',w:2,d:'none',m:'ah'},ret:{c:'#d1101d',w:1.8,d:'6 4',m:'ahr'},back:{c:'#d1101d',w:2.2,d:'none',m:'ahr'},rej:{c:'#b3261e',w:1.8,d:'none',m:'ahr'},opt:{c:'#1d5f8a',w:1.5,d:'5 4',m:'ahb'},esc:{c:'#a8761a',w:1.6,d:'3 3',m:'aho'},obs:{c:'#8b7bb5',w:1.3,d:'3 4',m:''}};
function vpath(a,b){var x1=a.x+NW/2,y1=a.y+a.h,x2=b.x+NW/2,y2=b.y;if(Math.abs(x1-x2)<2)return{d:'M'+x1+' '+y1+' V'+y2,lx:x1,ly:(y1+y2)/2};var my=y1+(y2-y1)/2;return{d:'M'+x1+' '+y1+' V'+my+' H'+x2+' V'+y2,lx:(x1+x2)/2,ly:my}}
function spath(a,b,off){/* توجيه عبر الممرات الفارغة: فجوات بين الأعمدة وبين الصفوف، فلا يمر السهم فوق المربعات */
 off=off||0;var G2=(LW-NW)/2,ya=a.y+a.h/2,yb=b.y+b.h/2+off*1.6,lft=b.x<a.x-2,same=Math.abs(a.x-b.x)<2;
 var xs=same?a.x+NW:(lft?a.x:a.x+NW),gx1=same?a.x+NW+G2+off:(lft?a.x-G2+off:a.x+NW+G2+off);
 var xt=same?b.x+NW:(lft?b.x+NW:b.x),gx2=same?gx1:(lft?b.x+NW+G2+off:b.x-G2+off);
 var rowTop=b.y-(RH-b.h)/2,rowBot=b.y+b.h+(RH-b.h)/2;
 var yc=(b.y<a.y?rowBot-(RH-NH)/4:rowTop+(RH-NH)/4)+off;
 if(!same&&Math.abs(ya-yb)<2&&Math.abs(Math.abs(a.x-b.x)-LW)<2)return{d:'M'+xs+' '+ya+' H'+xt,lx:(xs+xt)/2,ly:ya};
 return{d:'M'+xs+' '+ya+' H'+gx1+' V'+yc+' H'+gx2+' V'+yb+' H'+xt,lx:same?gx1:(gx1+gx2)/2,ly:same?(ya+yb)/2:yc}}

function pts(d){var t=d.trim().split(/\s+/),P=[],x=0,y=0,i=0;while(i<t.length){var c=t[i];if(c[0]=='M'){x=+(c.length>1?c.slice(1):t[++i]);y=+t[++i];P.push([x,y])}else if(c[0]=='H'){x=+(c.length>1?c.slice(1):t[++i]);P.push([x,y])}else if(c[0]=='V'){y=+(c.length>1?c.slice(1):t[++i]);P.push([x,y])}i++}return P}
function arrowPath(g,d,st){/* الخط متقطع أو متصل، ورأس السهم دائمًا على قطعة متصلة ملتصقة بنهاية الخط */
 el('path',{d:d,fill:'none',stroke:st.c,'stroke-width':st.w,'stroke-dasharray':st.d||'none','stroke-linejoin':'round'},g);
 if(!st.m)return;var P=pts(d);if(P.length<2)return;var b=P[P.length-1],a=P[P.length-2],L=Math.hypot(b[0]-a[0],b[1]-a[1])||1,k=Math.min(14,L)/L;
 el('path',{d:'M'+(b[0]-(b[0]-a[0])*k)+' '+(b[1]-(b[1]-a[1])*k)+' L'+b[0]+' '+b[1],fill:'none',stroke:st.c,'stroke-width':st.w,'marker-end':'url(#'+st.m+')'},g)}
function sideX(n,toward){return toward>0?n.x+NW:n.x}
function route(e){var a=e.a,b=e.b,rtl=document.documentElement.dir!='ltr';
 if(e.bus){var pmX=laneX(LI.pm),sg=(pmX>laneX(LI.rv))?1:-1;
  if(e.bus=='ret'){var cx=sg>0?pmX+LW+14:pmX-14,ys=[],D=[],dots=[];
   e.src.forEach(function(q){var y=q.y+q.h*.32;ys.push(y);D.push('M'+sideX(q,sg)+' '+y+' H'+cx);dots.push([cx,y])});
   var top=b.y+b.h/2,bot=Math.max.apply(null,ys);D.push('M'+cx+' '+bot+' V'+top+' H'+sideX(b,sg));
   return{d:D,arrow:D.length-1,dots:dots,lx:pmX+LW/2,ly:b.y+(NH-b.h)/2+2*RH+NH/2}}
  var bx=sg>0?laneX(LI.rv)+LW:laneX(LI.rv),ys2=[],D2=[],dots2=[];
  e.src.forEach(function(q){var y=q.y+q.h*.72;ys2.push(y);D2.push('M'+sideX(q,sg)+' '+y+' H'+bx);dots2.push([bx,y])});
  var ty=b.y+b.h*.4,mn=Math.min.apply(null,ys2);D2.push('M'+bx+' '+mn+' V'+ty+' H'+sideX(b,-sg));
  return{d:D2,arrow:D2.length-1,dots:dots2,lx:bx,ly:(Math.max.apply(null,ys2)+ty)/2}}
 var ca=a.x+NW/2,cb=b.x+NW/2;
 if(e.r=='h'){var y=a.y+a.h/2,L=cb<ca,x1=L?a.x:a.x+NW,x2=L?b.x+NW:b.x;return{d:['M'+x1+' '+y+' H'+x2],lx:(x1+x2)/2,ly:y}}
 if(e.r=='vt'){var sx=e.sx!=null?e.sx:(cb<ca-2?.3:cb>ca+2?.7:.5),x1=a.x+NW*sx,y1=a.y+a.h,x2=b.x+NW*(e.tx!=null?e.tx:.5),yg=b.y-(RH-NH)/2+6;
  if(Math.abs(x1-x2)<2)return{d:['M'+x1+' '+y1+' V'+b.y],lx:x1,ly:(y1+b.y)/2};
  return{d:['M'+x1+' '+y1+' V'+yg+' H'+x2+' V'+b.y],lx:(yg-y1)<70?(x1+x2)/2:x1,ly:(yg-y1)<70?yg:(y1+yg)/2}}
 var v=vpath(a,b);return{d:[v.d],lx:v.lx,ly:v.ly}}
function draw(svg){svg.innerHTML='';G.hlN=new Set();var defs=el('defs',{},svg);
 [['ah','#5a6675'],['ahr','#d1101d'],['ahb','#1d5f8a'],['aho','#a8761a']].forEach(function(m){var mk=el('marker',{id:m[0],viewBox:'0 0 10 10',refX:10,refY:5,markerWidth:11,markerHeight:11,markerUnits:'userSpaceOnUse',orient:'auto'},defs);el('path',{d:'M0 0L10 5L0 10z',fill:m[1]},mk)});
 var vp=el('g',{id:'jmvp'},svg);
 el('rect',{x:0,y:0,width:G.W,height:G.H,fill:'#f7f9fc'},vp);
 LANES.forEach(function(l,i){var x=laneX(i);el('rect',{x:x+4,y:TOP-50,width:LW-8,height:G.H-TOP+40,rx:14,fill:l.bg,opacity:.45},vp)});
 var SV=X().SV,on=function(n){return G.role=='all'||hit(n,G.role)};
 G.blocks.forEach(function(b,bi){var g=el('g',{},vp);
  el('rect',{x:SIDE-30,y:b.y,width:G.W-2*SIDE+60,height:b.h,rx:18,fill:'none',stroke:'#9fb3c8','stroke-width':1.5,'stroke-dasharray':b.k=='cr'?'8 6':'none'},g);
  el('rect',{x:SIDE-30,y:b.y,width:G.W-2*SIDE+60,height:44,rx:18,fill:'#fff',stroke:'#9fb3c8','stroke-width':1.5},g);
  txt(g,G.W/2,b.y+29,[(bi+1)+'. '+P(SV[b.k].t)+(b.k=='cr'?P([' (اختياري)',' (optional)']):'')],{fs:20,fw:800,fill:'#1d5f8a'})});
 /* الأسهم داخل الكتل: مسارات محسوبة لكل نوع، والمحدد منها يتوهج */
 var selE=G.sel&&G.sel.e!=null?G.sel.e:null,selN=G.sel&&G.sel.n!=null?G.nodes[G.sel.n]:null;
 var touches=function(e,n){return e.a===n||e.b===n||(e.src&&e.src.indexOf(n)>=0)};
 G.hl=new Set();G.edges.forEach(function(e,ix){if((selE===ix)||(selN&&touches(e,selN))){G.hl.add(ix);if(e.a)G.hlN.add(e.a);G.hlN.add(e.b);(e.src||[]).forEach(function(q){G.hlN.add(q)})}});
 G.edges.forEach(function(e,ix){var st=EK[e.k]||EK.main,R=route(e),act=G.sel?G.hl.has(ix):(G.role=='all'||(e.a&&on(e.a))||on(e.b)||(e.src||[]).some(on));
  var g=el('g',{'data-e':ix,style:'cursor:pointer',opacity:act?1:.13},vp);
  R.d.forEach(function(d){el('path',{d:d,fill:'none',stroke:'transparent','stroke-width':18},g)});
  if(G.hl.has(ix))R.d.forEach(function(d){el('path',{d:d,fill:'none',stroke:st.c,'stroke-width':st.w+9,'stroke-linecap':'round','stroke-linejoin':'round',class:'jglow'},g)});
  R.d.forEach(function(d,k){arrowPath(g,d,Object.assign({},st,{m:(R.arrow==null||R.arrow==k)?st.m:'',w:G.hl.has(ix)?st.w+1.2:st.w}))});
  (R.dots||[]).forEach(function(p){el('circle',{cx:p[0],cy:p[1],r:3.2,fill:st.c},g)});
  if(e.lab&&R.lx!=null)pill(g,R.lx,R.ly,P(e.lab),st.c)});
 /* أسهم بين الخدمات */
 var B={};G.blocks.forEach(function(b){B[b.k]=b});
 function link(a,b,lab,dash){var A=a.last,Z=b.first;var x1=A.x+NW/2,y1=A.y+A.h,x2=Z.x+NW/2,y2=Z.y,my=b.y-BG/2;
  arrowPath(vp,'M'+x1+' '+y1+' V'+my+' H'+x2+' V'+y2,{c:'#1d5f8a',w:2.4,d:dash?'8 6':'none',m:'ahb'});
  pill(vp,G.W/2,my,lab,'#1d5f8a')}
 if(B.charter&&B.plan)link(B.charter,B.plan,P(['بعد اعتماد الميثاق تبدأ الخطة','After the charter: the plan']));
 if(B.plan&&B.tasks)link(B.plan,B.tasks,P(['بعد اعتماد الخطة تصل المهام','Approved plan sends out tasks']));
 if(B.tasks&&B.cr)link(B.tasks,B.cr,P(['عند الحاجة لتغيير جوهري','When a major change is needed']),true);
 if(B.cr&&B.closure)link(B.cr,B.closure,P(['بعد اكتمال التنفيذ','When execution is complete']));
 if(B.cr&&B.plan){var A=B.cr.ids.cl||B.cr.last,xo=SIDE-40,pt=B.plan.ids.rx||B.plan.first;
  arrowPath(vp,'M'+(A.x)+' '+(A.y+A.h/2)+' H'+xo+' V'+(pt.y+pt.h/2)+' H'+pt.x,{c:'#1d5f8a',w:1.6,d:'6 5',m:'ahb'});
  var g2=el('g',{transform:'translate('+(xo-8)+' '+((pt.y+A.y)/2)+') rotate(-90)'},vp);txt(g2,0,0,[P(['طلب التغيير المعتمد ← إصدار جديد من الخطة','Approved CR → new plan version'])],{fs:12,fw:800,fill:'#1d5f8a'})}
 /* العقد */
 G.nodes.forEach(function(n){var l=LANES[LI[n.col||n.lane]],o=G.sel?(G.hlN.has(n)||G.sel.n===n.gid):on(n);
  var g=el('g',{'data-n':n.gid,style:'cursor:pointer',opacity:o?1:.2},vp);
  var fill=n.kind=='step'?l.bg:n.kind=='hub'?'#fdecee':n.kind=='term'?(n.bad?'#fdecee':'#f1f1f1'):n.kind=='dec'?'#fff7e6':'#fff';
  var stroke=n.kind=='hub'||n.bad?'#d1101d':n.kind=='dec'?'#a8761a':n.kind=='term'?'#777':l.c;
  var rx=n.kind=='step'?12:n.kind=='term'?30:n.kind=='dec'?6:16;
  el('rect',{x:n.x,y:n.y,width:NW,height:n.h,rx:rx,fill:fill,stroke:stroke,'stroke-width':o&&(G.role!='all'||(G.sel&&G.sel.n===n.gid))?3:1.7,'stroke-dasharray':n.kind=='note'?'5 4':'none'},g);
  if(n.kind=='step')el('rect',{x:n.x,y:n.y,width:6,height:n.h,rx:3,fill:l.c},g);
  if(n.kind=='dec')el('path',{d:'M'+(n.x+NW-14)+' '+(n.y+6)+' l7 7 l-7 7 l-7 -7 z',fill:'#a8761a'},g);
  var small=n.kind!='step',wl=wrap(P(n.t),small?19:15);
  txt(g,n.x+NW/2,n.y+n.h/2-((wl.length-1)*9)+5,wl,{fs:small?12.5:15.5,fw:small?700:800,fill:n.kind=='hub'||n.bad?'#a3141c':n.kind=='dec'?'#7a5200':l.c,lh:18});
  if(n.end)el('circle',{cx:n.x+NW-10,cy:n.y+10,r:6,fill:'#0a6b3d'},g)});
}

function NONE(){return X().roleText('cr',0,'rv')[0]}
function hit(n,r){var rr=(r=='ow'||r=='uh')?'fl':r;if(n.lane==rr||n.lane==r)return true;if(n.roles&&n.roles.indexOf(r)>=0)return true;if(r=='pt'&&n.id=='gp')return true;return false}

/* تفاصيل العقدة */
function info(n){var SV=X().SV,k=n.k,x=X(),rows=[];
 if(n.kind=='step'||(n.kind=='off'&&n.st!=null)){var i=n.st;
  var RL=[['pm',['مدير المشروع / المعدّ','Project manager / preparer']],['of',['مكتب التطوير المؤسسي','Development Office']],['rv',['المراجع','Reviewer']],['ap',['المعتمِد','Approver']],['tk',['المكلَّف بمهمة','Task owner']],['fl',['المتابع ومالك المشروع ومسؤول الوحدة','Follower, owner and unit head']],['pt',['المشارك بالتخطيط الجماعي','Group-planning participant']]];
  RL.forEach(function(r){var t;try{t=x.roleText(k,i,r[0])}catch(_){t=null}if(!t||t[0]==NONE())return;rows.push('<div class="jmr" style="--c:'+LANES[LI[r[0]=='pt'?'fl':r[0]]].c+'"><b>'+esc(P(r[1]))+'</b><span>'+esc(P(t))+'</span></div>')})}
 var paras=(n.info||[]).map(function(p){return '<p class="jmp">'+esc(P(p))+'</p>'}).join('');
 var st=n.kind=='step'?(k=='tasks'?x.TSTATE[n.st]:(n.st==4?x.STATE5[k]:x.STATE[n.st])):null;
 var outs=G.edges.filter(function(e){return e.a===n&&e.k!='main'&&e.lab}).map(function(e){return '<li>'+esc(P(e.lab))+' ← '+esc(P(e.b.t))+'</li>'}).join('');
 var ins=G.edges.filter(function(e){return e.b===n&&e.k!='main'&&e.lab}).map(function(e){return '<li>'+esc(P(e.a.t))+' — '+esc(P(e.lab))+'</li>'}).join('');
 var o=document.getElementById('jmi');o.innerHTML='<div class="jmh"><div><small>'+esc(P(SV[k].t))+(n.st!=null&&n.kind=='step'?' · '+P(['الخطوة ','Step '])+(n.st+1):'')+'</small><b>'+esc(P(n.t))+'</b>'+(st?'<em>'+esc(P(st))+'</em>':'')+'</div><button onclick="jnMapClr()">✕</button></div>'+
  paras+(rows.length?'<div class="jml">'+rows.join('')+'</div>':'')+
  (outs?'<div class="jmq"><b>'+P(['المسارات من هنا','Paths from here'])+'</b><ul>'+outs+'</ul></div>':'')+(ins?'<div class="jmq"><b>'+P(['يصل إلى هنا من','Arrives from'])+'</b><ul>'+ins+'</ul></div>':'')+
  (n.kind=='step'&&n.st==0&&x.PRE[k]?'<p class="jmp"><b>'+P(['شرط البدء: ','Prerequisite: '])+'</b>'+esc(P(x.PRE[k]))+'</p>':'')+(n.end&&x.NXT[k]?'<p class="jmp"><b>'+P(['بعدها: ','Next: '])+'</b>'+esc(P(x.NXT[k]))+'</p>':'')+
  '<a class="jmgo" href="'+SV[k].p+'">'+P(['فتح ','Open '])+esc(P(SV[k].t))+' ›</a>';
 o.classList.add('on')}

window.jnMapClr=function(){var ii=document.getElementById('jmi');if(ii)ii.classList.remove('on');G.sel=null;redraw()};
var KN={main:['المسار الرئيسي','Main path'],ret:['إعادة للمعدّ','Return to preparer'],rej:['رفض','Reject'],opt:['مسار اختياري أو بديل','Optional / alternative path'],esc:['تأخر وتصعيد','Late & escalation']};
function einfo(e){var SV=X().SV,k=(e.b||e.a).k,from=e.src?e.src.map(function(q){return P(q.t)}).join('، '):P(e.a.t);
 var o=document.getElementById('jmi');o.innerHTML='<div class="jmh"><div><small>'+esc(P(SV[k].t))+' · '+esc(P(KN[e.k]||KN.main))+'</small><b>'+esc(e.lab?P(e.lab):(P(e.a.t)+' ← '+P(e.b.t)))+'</b></div><button onclick="jnMapClr()">✕</button></div>'+
  '<div class="jmq"><b>'+P(['من','From'])+':</b> '+esc(from)+'<br><b>'+P(['إلى','To'])+':</b> '+esc(P(e.b.t))+'</div>'+
  (e.desc||[]).map(function(p){return '<p class="jmp">'+esc(P(p))+'</p>'}).join('')+(e.k=='main'&&!e.desc?'<p class="jmp">'+P(['ينتقل الطلب إلى الخطوة التالية عند اكتمال الخطوة الحالية.','The request moves on when the current step is complete.'])+'</p>':'');
 o.classList.add('on')}
/* التكبير والسحب + شريط الأدوار الثابت */
function lanesBar(){var b=document.getElementById('jmlb');if(!b)return;var h='';LANES.forEach(function(l,i){var x=G.tx+(laneX(i)+6)*G.s,w=(LW-12)*G.s;var t=w<96?P(l.s):P(l.t);h+='<div style="left:'+x+'px;width:'+w+'px;background:'+l.c+'" title="'+esc(P(l.t))+'">'+esc(t)+'</div>'});b.innerHTML=h}
function apply(){var g=document.getElementById('jmvp');if(g)g.setAttribute('transform','translate('+G.tx+' '+G.ty+') scale('+G.s+')');var z=document.getElementById('jmz');if(z)z.textContent=Math.round(G.s*100)+'%';lanesBar()}
function clampS(s){return Math.max(.12,Math.min(3,s))}
function zoomAt(f,cx,cy){var s2=clampS(G.s*f);G.tx=cx-(cx-G.tx)*(s2/G.s);G.ty=cy-(cy-G.ty)*(s2/G.s);G.s=s2;apply()}
function fit(mode){var c=document.getElementById('jmc'),w=c.clientWidth,h=c.clientHeight;G.s=mode=='all'?Math.min(w/G.W,h/G.H)*.96:Math.min(1,w/G.W*.98);G.tx=(w-G.W*G.s)/2;G.ty=mode=='all'?(h-G.H*G.s)/2:8;apply()}

function wireCanvas(c){var pts={},last=null,pinch=null,moved=0,downN=null,downE=null;
 c.addEventListener('wheel',function(e){e.preventDefault();var r=c.getBoundingClientRect(),mouse=e.deltaMode!=0||(Math.abs(e.deltaX)<1&&Math.abs(e.deltaY)>=40);if(e.ctrlKey||mouse)zoomAt(Math.exp(-e.deltaY*(e.ctrlKey?.01:.0015)),e.clientX-r.left,e.clientY-r.top);else{G.tx-=e.deltaX;G.ty-=e.deltaY;apply()}},{passive:false});
 c.addEventListener('pointerdown',function(e){c.setPointerCapture(e.pointerId);pts[e.pointerId]={x:e.clientX,y:e.clientY};moved=0;var t=e.target.closest&&e.target.closest('[data-n]');downN=t?+t.getAttribute('data-n'):null;var te=!t&&e.target.closest&&e.target.closest('[data-e]');downE=te?+te.getAttribute('data-e'):null;
  var ids=Object.keys(pts);if(ids.length==2){var a=pts[ids[0]],b=pts[ids[1]];pinch={d:Math.hypot(a.x-b.x,a.y-b.y),s:G.s}}else last={x:e.clientX,y:e.clientY}});
 c.addEventListener('pointermove',function(e){if(!pts[e.pointerId])return;pts[e.pointerId]={x:e.clientX,y:e.clientY};var ids=Object.keys(pts),r=c.getBoundingClientRect();
  if(ids.length==2&&pinch){var a=pts[ids[0]],b=pts[ids[1]],d=Math.hypot(a.x-b.x,a.y-b.y);var f=clampS(pinch.s*d/pinch.d)/G.s;zoomAt(f,(a.x+b.x)/2-r.left,(a.y+b.y)/2-r.top);moved+=10;return}
  if(last){var dx=e.clientX-last.x,dy=e.clientY-last.y;moved+=Math.abs(dx)+Math.abs(dy);G.tx+=dx;G.ty+=dy;last={x:e.clientX,y:e.clientY};apply()}});
 function up(e){delete pts[e.pointerId];if(Object.keys(pts).length<2)pinch=null;if(!Object.keys(pts).length){if(moved<8){if(downN!=null){G.sel={n:downN};redraw();info(G.nodes[downN])}else if(downE!=null){G.sel={e:downE};redraw();einfo(G.edges[downE])}else if(G.sel){G.sel=null;redraw();var ii=document.getElementById('jmi');if(ii)ii.classList.remove('on')}}last=null}else{var k=Object.keys(pts)[0];last={x:pts[k].x,y:pts[k].y}}}
 c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);
 c.addEventListener('dblclick',function(e){var r=c.getBoundingClientRect();zoomAt(1.6,e.clientX-r.left,e.clientY-r.top)})}

function paintFilters(){var f=document.getElementById('jmf');f.innerHTML=FILT.map(function(r){return '<button class="'+(G.role==r[0]?'on':'')+'" data-r="'+r[0]+'">'+esc(P(r[1]))+'</button>'}).join('')}
function redraw(){var svg=document.getElementById('jms');draw(svg);apply()}
function legend(){var it=[['#5a6675','',P(['المسار الرئيسي','Main path'])],['#d1101d','6 4',P(['إعادة للمعدّ','Return to preparer'])],['#b3261e','',P(['رفض','Reject'])],['#1d5f8a','5 4',P(['مسار اختياري أو بديل','Optional / alternative'])],['#a8761a','3 3',P(['تأخر وتصعيد','Late & escalation'])]];
 return it.map(function(x){return '<span><svg width="26" height="8"><line x1="0" y1="4" x2="26" y2="4" stroke="'+x[0]+'" stroke-width="2.4" stroke-dasharray="'+x[1]+'"/></svg>'+x[2]+'</span>'}).join('')}

window.jnMap=function(){if(!X())return;var o=document.getElementById('jmap');if(o)o.remove();
 if(!document.getElementById('jmcss')){var st=document.createElement('style');st.id='jmcss';st.textContent=
 '#jmap{position:fixed;inset:0;z-index:100001;background:#f7f9fc;display:flex;flex-direction:column;font-family:inherit}'+
 '#jmap .jmt{display:flex;align-items:center;gap:8px;padding:calc(10px + env(safe-area-inset-top,0px)) 12px 8px;background:#fff;border-bottom:1px solid #e3eaf0}'+
 '#jmap .jmt b{flex:1;font-size:16px;color:#1d5f8a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}#jmap .jmt button{border:1px solid #d5e1ec;background:#fff;border-radius:12px;min-width:40px;height:38px;font:inherit;font-weight:800;font-size:16px;color:#1d5f8a;cursor:pointer}'+
 '#jmap #jmz{font-size:12px;color:#5a6675;min-width:42px;text-align:center}@media(max-width:430px){#jmap #jmz{display:none}#jmap .jmt{gap:6px}#jmap .jmt button{min-width:38px}}'+
 '#jmf{display:flex;gap:6px;overflow-x:auto;padding:8px 12px;background:#fff;border-bottom:1px solid #e3eaf0;scrollbar-width:none}#jmf::-webkit-scrollbar{display:none}'+
 '#jmf button{flex:none;border:1.5px solid #d5e1ec;background:#fff;color:#1d5f8a;border-radius:99px;padding:5px 12px;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer;white-space:nowrap}#jmf button.on{background:#1d5f8a;color:#fff;border-color:#1d5f8a}'+
 '#jmlg{display:flex;gap:12px;overflow-x:auto;padding:6px 12px;background:#fff;border-bottom:1px solid #e3eaf0;font-size:11.5px;color:#4a5568;white-space:nowrap;scrollbar-width:none}#jmlg::-webkit-scrollbar{display:none}#jmlg span{display:inline-flex;align-items:center;gap:5px}'+
 '#jmc{flex:1;position:relative;overflow:hidden;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;cursor:grab}#jmc svg{width:100%;height:100%;display:block}'+
 '#jmlb{position:absolute;top:0;left:0;right:0;height:40px;pointer-events:none;z-index:3;background:linear-gradient(#f7f9fcee,#f7f9fcaa)}#jmlb div{position:absolute;top:5px;height:30px;border-radius:9px;color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;padding:0 4px;box-shadow:0 2px 6px rgba(0,0,0,.15)}'+
 '#jmh{position:absolute;bottom:calc(12px + env(safe-area-inset-bottom,0px));inset-inline-start:12px;background:rgba(255,255,255,.94);border:1px solid #e3eaf0;border-radius:12px;padding:6px 10px;font-size:11.5px;color:#5a6675;pointer-events:none;max-width:70%;z-index:4}'+
 '#jmi{position:absolute;inset-inline:0;bottom:0;max-height:66%;overflow:auto;background:#fff;border-radius:22px 22px 0 0;box-shadow:0 -10px 40px rgba(0,0,0,.25);padding:14px 16px calc(18px + env(safe-area-inset-bottom,0px));transform:translateY(105%);transition:transform .2s;z-index:5}#jmi.on{transform:none}'+
 '#jmi .jmh{display:flex;gap:10px;align-items:flex-start}#jmi .jmh>div{flex:1}#jmi .jmh small{display:block;color:#5a6675;font-size:12px}#jmi .jmh b{display:block;font-size:17px;color:#1b1d1f}#jmi .jmh em{display:inline-block;font-style:normal;margin-top:4px;background:#f1f5f9;border-radius:99px;padding:2px 10px;font-size:12px;color:#1d5f8a}'+
 '#jmi .jmh button{border:1px solid #d5e1ec;background:#fff;border-radius:10px;width:36px;height:36px;font-size:16px;cursor:pointer}'+
 '#jmi .jml{display:flex;flex-direction:column;gap:8px;margin-top:10px}#jmi .jmr{border-inline-start:4px solid var(--c);background:#f7f9fc;border-radius:10px;padding:8px 10px}#jmi .jmr b{display:block;font-size:12.5px;color:var(--c)}#jmi .jmr span{font-size:13.5px;line-height:1.7}'+
 '#jmi .jmq{margin-top:10px;background:#f7f9fc;border-radius:10px;padding:8px 10px;font-size:13px}#jmi .jmq ul{margin:4px 0 0;padding-inline-start:18px;line-height:1.8}'+
 '@keyframes jglow{from{opacity:.12}to{opacity:.5}}#jms .jglow{animation:jglow .9s ease-in-out infinite alternate}'+'#jmi .jmp{font-size:13.5px;color:#2d3748;line-height:1.8;margin:10px 0 0}#jmi .jmgo{display:inline-block;margin-top:12px;background:#1d5f8a;color:#fff;border-radius:12px;padding:8px 16px;font-weight:800;text-decoration:none}';
 document.head.appendChild(st)}
 o=document.createElement('div');o.id='jmap';o.dir=document.documentElement.dir||'rtl';
 o.innerHTML='<div class="jmt"><button id="jmx" aria-label="close">✕</button><b>🗺 '+P(['المخطط','Map'])+'</b><button data-z="-">−</button><span id="jmz"></span><button data-z="+">＋</button><button data-z="w" title="'+P(['ملاءمة العرض','Fit width'])+'">↔</button><button data-z="a" title="'+P(['عرض الكل','Show all'])+'">⛶</button></div>'+
  '<div id="jmf"></div><div id="jmlg">'+legend()+'</div><div id="jmc"><svg id="jms"></svg><div id="jmlb"></div><div id="jmh">'+P(['اسحب للتنقل · قرّب بإصبعين أو بالأزرار · اضغط أي مربع لتفاصيله ومساراته · اختر دورًا لإبراز خطواته','Drag to move · pinch or use buttons to zoom · tap any box for details and paths · pick a role to highlight it'])+'</div><div id="jmi"></div></div>';
 document.body.appendChild(o);document.documentElement.style.overflow='hidden';var hn=document.getElementById('jmh');var hid=function(){if(hn)hn.style.display='none'};setTimeout(hid,7000);document.getElementById('jmc').addEventListener('pointerdown',hid,{once:true});
 build();paintFilters();redraw();fit('w');
 wireCanvas(document.getElementById('jmc'));
 document.getElementById('jmx').onclick=function(){o.remove();document.documentElement.style.overflow=''};
 o.querySelector('.jmt').addEventListener('click',function(e){var b=e.target.closest('[data-z]');if(!b)return;var c=document.getElementById('jmc'),w=c.clientWidth/2,h=c.clientHeight/2,z=b.getAttribute('data-z');if(z=='+')zoomAt(1.3,w,h);else if(z=='-')zoomAt(1/1.3,w,h);else fit(z=='a'?'all':'w')});
 document.getElementById('jmf').addEventListener('click',function(e){var b=e.target.closest('[data-r]');if(!b)return;G.role=b.getAttribute('data-r');paintFilters();redraw()});
 addEventListener('resize',function(){if(document.getElementById('jmap'))apply()})};
})();
