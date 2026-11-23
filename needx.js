/* «📌 مطلوب منك» في رحلتي — كل ما ينتظر إجراءك في مكان واحد، وتُنفَّذ الإجراءات داخل الصفحة — window.NEED
   المصادر: قراءات المؤشرات ومراجعات المخاطر وإجراءاتها (upd.js)، اعتماد المخرجات، المخرجات المعادة إليك،
   ولمكتب التطوير: مراجعة الاحتساب، القيم المقفلة، نسب الإنجاز بانتظار الاعتماد. ومتابعة طلباتك لدى المكتب. */
(function(){if(window.NEED)return;
var A=function(){return (document.documentElement.lang||'ar')!='en'},T=function(a,b){return A()?a:b};
var e=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var db=function(){try{if(typeof sb!='undefined'&&sb&&sb.rpc)return sb}catch(_){}return window.sb||null};
var dn=function(s){var m=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(s||''));return m?Math.round(Date.UTC(+m[1],+m[2]-1,+m[3])/864e5):null};
var today=function(){return dn(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Dubai'}).format(new Date()))};
var fd=function(s){var n=dn(s);if(n==null)return '';var d=new Date(n*864e5);return d.getUTCDate()+'/'+(d.getUTCMonth()+1)+'/'+d.getUTCFullYear()};
var DY=function(n){n=Math.abs(+n||0);if(!A())return n+' d';return n==1?'يوم واحد':n==2?'يومين':n+(n>=3&&n<=10?' أيام':' يومًا')};
var S={L:[],F:[],DM:[],kf:null,showDone:false,more:{},cur:[],busy:false,at:0,off:false};
var DONE=(function(){try{return JSON.parse(sessionStorage.getItem('needDone')||'[]')}catch(_){return []}})();
function saveDone(){try{sessionStorage.setItem('needDone',JSON.stringify(DONE.slice(0,40)))}catch(_){}}
function markDone(it,how){if(!it)return;DONE=DONE.filter(function(d){return d.key!=it.key});DONE.unshift({key:it.key,ic:it.ic,t:it.t,pj:it.pj,how:how||T('تم','Done'),at:Date.now()});saveDone()}
var OPENED={};var OFFK={rev:1,lock:1,prog:1,appr:1};

function css(){if(document.getElementById('needcss'))return;var s=document.createElement('style');s.id='needcss';s.textContent=
 '#updhome,#needw{display:none!important}'+
 '.nd-sum{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 12px}.nd-sum button{font:inherit;font-size:13px;font-weight:700;border:1px solid #dcd6c8;background:#fff;border-radius:99px;padding:5px 12px;cursor:pointer;color:#33383e;display:inline-flex;gap:6px;align-items:center}.nd-sum button b{font-size:14px}.nd-sum button.on{background:#14324a;border-color:#14324a;color:#fff}.nd-sum button.lt b{color:#d1101d}.nd-sum button.on.lt b{color:#ffd7b5}'+
 '.nd-sec{margin:4px 0 14px}.nd-sec>h4{margin:0 0 8px;font-size:14px;display:flex;align-items:center;gap:8px;color:#14324a}.nd-sec>h4 i{font-style:normal;background:#eef2f6;border-radius:99px;padding:0 9px;font-size:12px;color:#14324a}.nd-sec.l>h4{color:#d1101d}.nd-sec.l>h4 i{background:#fdecee;color:#d1101d}'+
 '.nd-off{background:#f4f7fb;border:1px solid #dbe4ee;border-radius:16px;padding:10px 12px;margin:0 0 14px}.nd-off>h4{margin:0 0 8px;font-size:14px;color:#14324a;display:flex;gap:8px;align-items:center}.nd-off>h4 i{font-style:normal;background:#14324a;color:#fff;border-radius:99px;padding:0 9px;font-size:12px}'+
 '.nd-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px}'+
 '.nd-c{display:flex;flex-direction:column;gap:3px;border:1px solid #e6e1d6;border-inline-start:4px solid var(--k,#1d5f8a);border-radius:12px;padding:9px 11px;background:#fff;cursor:pointer;min-width:0;text-align:start;font:inherit;color:inherit;box-shadow:0 1px 4px rgba(0,0,0,.05)}'+
 '.nd-c:hover{box-shadow:0 6px 14px rgba(0,0,0,.1)}.nd-c:focus-visible{outline:2px solid #1d5f8a;outline-offset:2px}.nd-c.l{border-inline-start-color:#d1101d;background:#fffafa}'+
 '.nd-k{font-size:12px;font-weight:800;color:var(--k,#1d5f8a)}.nd-c.l .nd-k{color:#d1101d}.nd-c b{font-size:14px;line-height:1.5;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.nd-c small{color:#6b6f76;font-size:12px;line-height:1.6;overflow-wrap:anywhere}'+
 '.nd-c .nd-d{font-weight:700}.nd-c.l .nd-d{color:#d1101d}.nd-c.w .nd-d{color:#a8761a}'+
 '.nd-go{margin-top:4px;align-self:flex-start;background:#14324a;color:#fff;border-radius:99px;padding:4px 12px;font-size:12px;font-weight:800}.nd-c.l .nd-go{background:#d1101d}'+
 '.nd-none{color:#6b6f76;font-size:14px;padding:18px 4px;text-align:center}.nd-more{display:block;margin:8px auto 0;font:inherit;font-size:12.5px;font-weight:700;border:1px solid #ddd5c3;background:#fff;border-radius:99px;padding:5px 14px;cursor:pointer;color:#33383e}'+
 '.nd-dn{margin-top:6px;border-top:1px dashed #e3ddd0;padding-top:10px}.nd-dn .nd-c{cursor:default;opacity:.8;border-inline-start-color:#2e8b57}'+
 '.cm-pb .nd-pc{padding:14px 16px;overflow:auto;font-size:14px;line-height:1.8}.nd-pc dl{display:grid;grid-template-columns:auto 1fr;gap:2px 12px;margin:0 0 10px}.nd-pc dt{color:#6b6f76}.nd-pc dd{margin:0;font-weight:700;overflow-wrap:anywhere}'+
 '.nd-pc textarea{width:100%;box-sizing:border-box;font:inherit;border:1px solid #d6d0c2;border-radius:10px;padding:8px 10px}.nd-pc .nd-file{font:inherit;font-weight:700;border:1px solid #cfd9e3;background:#fff;color:#1d5f8a;border-radius:10px;padding:7px 12px;cursor:pointer;margin:0 0 10px}'+
 '.cm-pf .nd-no{color:#d1101d!important;border-color:#e6b8bc!important}.nd-fr{flex:1;border:0;width:100%;min-height:0}.nd-note{background:#fdecee;color:#8a1019;border-radius:10px;padding:8px 10px;margin:6px 0}.nd-box{background:#faf8f3;border-radius:10px;padding:8px 10px;margin-bottom:8px}'+
 '.cm-it.nd-j{cursor:pointer}.cm-it .nd-w{display:block;max-width:100%;box-sizing:border-box;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:4px;background:#f1f3f6;color:#4a5568;border:1px solid #dde2ea;border-radius:99px;padding:1px 8px;font-size:11.5px;font-weight:700}.cm-it.l .nd-w{background:#fdecee;color:#d1101d;border-color:#f3c2c7}.cm-it.ok .nd-w{background:#eaf6ef;color:#1c7a45;border-color:#c5e5d2}'+
 '@media (max-width:640px){.nd-g{grid-template-columns:1fr}.nd-sum{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;margin-inline:-4px;padding:0 4px 2px}.nd-sum button{flex:none}}';document.head.appendChild(s)}

/* ---------- جمع البنود ---------- */
var KD={kpi:['📈','قراءة مؤشر','KPI reading','#1d5f8a'],risk:['🛡️','مراجعة خطر','Risk review','#7a3e9d'],act:['🎯','إجراء معالجة خطر','Risk action','#7a3e9d'],appr:['✅','اعتماد قراءات المؤشرات','Approve KPI readings','#0a6b3d'],
 dap:['📎','اعتماد مخرَج','Approve deliverable','#0a6b3d'],dret:['↩','مخرَج أُعيد إليك للتعديل','Deliverable returned to you','#d1101d'],
 rev:['⚖️','مراجعة الاحتساب','Calculation review','#14324a'],lock:['🔒','طلب تعديل قيمة مقفلة','Locked value change','#14324a'],prog:['📊','اعتماد نسبة إنجاز','Approve progress','#14324a'],
 fu:['⏳','طلبك لدى المكتب','Your request with the office','#5b6b7d']};
function mk(kind,o){var k=KD[kind];return Object.assign({kind:kind,ic:k[0],kl:T(k[1],k[2]),kc:k[3]},o)}
function taskName(pid,tid){try{var E=window.JNX&&JNX.E;var x=E&&E.items.find(function(i){return i.k=='tasks'&&String(i.id)==String(pid)&&String(i.tid)==String(tid)});if(x)return {n:(x.tpath&&x.tpath.length?x.tpath[x.tpath.length-1].n:x.name),pj:x.tpn||x.pc,pc:x.pc}}catch(_){}return null}
async function rpc(n,a){var s=db();try{var r=await s.rpc(n,a||{});return r&&!r.error?r.data:null}catch(_){return null}}
async function gather(){var s=db();if(!s)return;var td=today(),L=[],F=[];
 var up=null;try{if(window.IDOUPD){await IDOUPD.load();up=IDOUPD.items?IDOUPD.items():null}}catch(_){}
 var r=await Promise.all([rpc('deliv_inbox'),rpc('deliv_mine_list'),rpc('rev_counts'),rpc('my_office_reqs')]);
 (up||[]).forEach(function(x,i){if(x.near===false)return;var st=IDOUPD.st(x),k=x.kind;if(!KD[k])return;
  var t=k=='kpi'?x.name:k=='risk'?x.name:k=='act'?x.name:(x.n+' '+T('قراءة','readings'));
  L.push(mk(k,{key:k+'|'+(x.id||x.pcode)+'|'+(x.idx==null?'':x.idx),t:t||'—',pj:x.pname||x.pcode,pc:x.pcode,due:x.due,late:st=='late',warn:st=='due',
   sub:k=='act'&&x.risk?T('للخطر: ','Risk: ')+x.risk:k=='kpi'&&x.periods&&x.periods.length>1?x.periods.length+T(' فترات بلا قراءة',' periods missing'):'',
   go:k=='appr'?T('مراجعة واعتماد','Review & approve'):k=='kpi'?T('إدخال القراءة','Enter reading'):k=='risk'?T('مراجعة الخطر','Review risk'):T('تحديث الإجراء','Update action'),run:function(){IDOUPD.openX(x)}}))});
 (r[0]||[]).forEach(function(d){var w=d.at?td-dn(d.at):0;L.push(mk('dap',{key:'dap|'+d.id,t:d.dl||d.n,sub:d.dl?T('المهمة: ','Task: ')+d.n:'',pj:d.pname||d.pcode,pc:d.pcode,due:d.due,late:w>=5||(d.due&&dn(d.due)<td),warn:w>=2,age:w,go:T('مراجعة واعتماد','Review & approve'),d:d,run:function(it){dapOpen(it)}}))});
 S.DM=Array.isArray(r[1])?r[1]:[];S.DM.forEach(function(v){if(v.st!='returned')return;L.push(mk('dret',{key:'dret|'+v.id,t:v.dl||v.n||v.file||T('مخرَج','Deliverable'),pj:v.pname||v.pcode,pc:v.pcode,late:true,sub:(v.dl?T('المهمة: ','Task: ')+v.n+' · ':'')+(v.dec_name?T('أعاده ','Returned by ')+v.dec_name:''),go:T('رفع نسخة معدّلة','Upload a revised version'),v:v,pid:v.pid,tid:v.tid,run:function(it){dretOpen(it)}}))});
 var rc=r[2]||{};S.off=!!rc.office;
 if(rc.office){var rl=await rpc('rev_list',{p_pc:null}),RK={scope_add:'مهمة أُضيفت بعد خط الأساس',scope_del:'مهمة حُذفت من خط الأساس',scope_chg:'تغيّر كبير في مدة مهمة',scope_ms:'معلم متأخر عن خط الأساس',late:'طلب عذر تأخير',kpi:'طلب استبعاد قراءة مؤشر'};
  ((rl&&rl.items)||[]).forEach(function(z){var w=z.req_at?td-dn(z.req_at):z.first_at?td-dn(z.first_at):0;L.push(mk('rev',{key:'rev|'+z.id,t:z.label||'—',sub:(z.req_at?T('طلب استبعاد من ','Exclusion request by ')+(z.req_name||''):(RK[z.kind]||z.kn||'')),pj:z.pname||z.pcode,pc:z.pcode,late:w>=7,warn:w>=3,age:w,go:T('التفاصيل والقرار','Details & decide'),run:function(){revWhy(z.id)}}))});
  var q=await Promise.all([rpc('lock_list',{p_all:false}),(async function(){var s2=db();try{var x=await s2.rpc('prog_pending');return x.error?null:x.data}catch(_){return null}})()]);
  (q[0]||[]).filter(function(l){return l.status=='pending'}).forEach(function(l){var w=l.at?td-dn(l.at):0;L.push(mk('lock',{key:'lock|'+l.id,t:l.label||l.kind,sub:(l.by_name?T('من: ','From: ')+l.by_name:''),pj:l.pname||l.pcode,pc:l.pcode,late:w>=5,warn:w>=2,age:w,go:T('مراجعة الطلب','Review request'),run:function(){decOpen('lock')}}))});
  (q[1]||[]).forEach(function(g){var w=g.requested_at?td-dn(g.requested_at):0;L.push(mk('prog',{key:'prog|'+g.id,t:(g.kind=='planned'?T('مخطط ','Planned '):T('فعلي ','Actual '))+(g.pct==null?T('(حساب تلقائي)','(automatic)'):Math.round(g.pct)+'%'),sub:T('السابقة ','Was ')+(g.prev!=null?Math.round(g.prev)+'%':'—'),pj:g.pname||g.pcode,pc:g.pcode,late:w>=5,warn:w>=2,age:w,go:T('مراجعة واعتماد','Review & approve'),g:g,run:function(it){progOpen(it)}}))})}
 (r[3]||[]).forEach(function(z){var pend=z.status=='pending',lab=z.src=='rev'?T('طلب استبعاد من الاحتساب','Exclusion request'):T('طلب تعديل قيمة مقفلة','Locked value change');
  var res=pend?T('بانتظار قرار المكتب','Awaiting office decision'):(z.status=='approved'||z.status=='excl')?T('✅ وافق المكتب','✅ Approved'):T('✖ لم يوافق المكتب','✖ Not approved');
  F.push(mk('fu',{key:'fu|'+z.src+'|'+z.id,t:z.label||lab,sub:lab+' · '+res+(z.dec_note&&!pend?' — '+z.dec_note:''),pj:z.pname||z.pcode,pc:z.pcode,since:z.at,pend:pend,go:T('التفاصيل','Details'),z:z,run:function(it){fuOpen(it)}}))});
 var rk=function(a){return (a.late?4:0)+(a.warn?2:0)};L.sort(function(a,b){return rk(b)-rk(a)||((dn(a.due)||9e9)-(dn(b.due)||9e9))});
 /* ما فُتح هنا ثم اختفى بعد التحديث = أُنجز */
 S.L=L;S.F=F;S.at=Date.now();try{document.dispatchEvent(new Event('need-upd'))}catch(_){}}

/* ---------- العرض: قائمة «بانتظار إجرائي» الموحّدة ---------- */
function dueTxt(it){var td=today();if(it.kind=='fu')return it.since?T('منذ ','Since ')+fd(it.since):'';
 if(it.age!=null&&!it.due)return it.age>0?T('ينتظر منذ ','Waiting ')+DY(it.age):T('وصل اليوم','Arrived today');
 var d=dn(it.due);if(d==null)return it.age!=null?(it.age>0?T('ينتظر منذ ','Waiting ')+DY(it.age):T('وصل اليوم','Arrived today')):'';var n=d-td;return n<0?T('متأخر ','Late ')+DY(-n):n==0?T('مستحق اليوم','Due today'):T('خلال ','In ')+DY(n)+' · '+fd(it.due)}
function card(it,i){return '<button type="button" class="nd-c '+(it.late?'l':it.warn?'w':'')+'" data-ni="'+i+'" style="--k:'+(it.kc||'#1d5f8a')+'"><span class="nd-k">'+(it.ic||'')+' '+e(it.kl)+(it.esc?' · ⬆ '+T('مُصعَّد','Escalated'):'')+'</span><b>'+e(it.t)+'</b>'+(it.sub?'<small>'+e(it.sub)+'</small>':'')+'<small>'+(it.pj?'📁 '+e(it.pj):'')+(dueTxt(it)?(it.pj?' · ':'')+'<span class="nd-d">'+e(dueTxt(it))+'</span>':'')+'</small><span class="nd-go">'+e(it.go||T('فتح','Open'))+' ›</span></button>'}
function bucket(it){if(it.late)return 'l';var d=dn(it.due),td=today();if(d!=null)return d-td<=7?'w':'x';return it.age!=null&&it.age>=2?'w':'w'}
function all(ext){return (ext||[]).concat(S.L)}
function grid(L,key){var lim=window.innerWidth>=900?6:3,n=Math.max(lim,S.more[key]||0),h='<div class="nd-g">'+L.slice(0,n).map(function(it){S.cur.push(it);return card(it,S.cur.length-1)}).join('')+'</div>';if(L.length>n)h+='<button type="button" class="nd-more" data-nm="'+key+'">'+T('عرض الكل (','Show all (')+L.length+')</button>';return h}
function renderAct(el,ext){css();if(!el)return;var A0=all(ext);S.cur=[];
 /* ما فُتح ثم اختفى بعد التحديث = أُنجز */
 var now={};A0.forEach(function(i){now[i.key]=1});Object.keys(OPENED).forEach(function(k){if(!now[k]){markDone(OPENED[k].it);delete OPENED[k]}});
 var KL={};A0.forEach(function(it){var k=it.kl;KL[k]=KL[k]||{n:0,l:0};KL[k].n++;if(it.late)KL[k].l++});if(S.kf&&!KL[S.kf])S.kf=null;
 var F0=S.kf?A0.filter(function(it){return it.kl==S.kf}):A0,off=F0.filter(function(it){return OFFK[it.kind]}),mine=F0.filter(function(it){return !OFFK[it.kind]});
 var rk=function(a,b){return (b.late?1:0)-(a.late?1:0)||((dn(a.due)||9e9)-(dn(b.due)||9e9))||((b.age||0)-(a.age||0))};off.sort(rk);mine.sort(rk);
 var h='';if(Object.keys(KL).length>1)h+='<div class="nd-sum" role="group">'+Object.keys(KL).sort(function(a,b){return KL[b].n-KL[a].n}).map(function(k){return '<button type="button" data-kf="'+e(k)+'" class="'+(S.kf==k?'on ':'')+(KL[k].l?'lt':'')+'"><b>'+KL[k].n+'</b>'+e(k)+'</button>'}).join('')+'</div>';
 if(off.length)h+='<div class="nd-off"><h4>🏢 '+T('قرارات المكتب','Office decisions')+' <i>'+off.length+'</i></h4>'+grid(off,'off')+'</div>';
 var B={l:[],w:[],x:[]};mine.forEach(function(it){B[bucket(it)].push(it)});
 [['l',T('متأخرة','Late')],['w',T('هذا الأسبوع','This week')],['x',T('لاحقًا','Later')]].forEach(function(z){if(B[z[0]].length)h+='<div class="nd-sec '+z[0]+'"><h4>'+(z[0]=='l'?'⏱ ':z[0]=='w'?'📅 ':'🗓 ')+e(z[1])+' <i>'+B[z[0]].length+'</i></h4>'+grid(B[z[0]],z[0])+'</div>'});
 if(!A0.length)h+='<div class="nd-none">✓ '+T('لا يوجد ما ينتظر إجراءك الآن. تابع ما عند غيرك من «رحلتي» ← «بانتظار غيري».','Nothing is waiting for you now.')+'</div>';
 if(DONE.length)h+='<div class="nd-dn"><button type="button" class="nd-more" style="margin:0" data-ndone>'+(S.showDone?'▾ ':'▸ ')+T('أنجزتها اليوم (','Done today (')+DONE.length+')</button>'+(S.showDone?'<div class="nd-g" style="margin-top:8px">'+DONE.map(function(d){return '<div class="nd-c"><span class="nd-k" style="color:#1c7a45">✔ '+e(d.how)+'</span><b>'+e(d.t)+'</b><small>'+(d.pj?'📁 '+e(d.pj)+' · ':'')+new Date(d.at).toLocaleTimeString(A()?'ar-AE':'en-GB',{hour:'2-digit',minute:'2-digit'})+'</small></div>'}).join('')+'</div>':'')+'</div>';
 if(el.__h!==h){el.innerHTML=h;el.__h=h}else{/* تحديث المراجع */}
 if(!el.__w){el.__w=1;el.addEventListener('click',function(ev){var t=ev.target;if(!t.closest)return;var b=t.closest('[data-kf]');if(b){S.kf=S.kf==b.dataset.kf?null:b.dataset.kf;el.__h='';rer();return}
  var m=t.closest('[data-nm]');if(m){S.more[m.dataset.nm]=999;el.__h='';rer();return}if(t.closest('[data-ndone]')){S.showDone=!S.showDone;el.__h='';rer();return}
  var c=t.closest('[data-ni]');if(c){var it=S.cur[+c.dataset.ni];if(it){OPENED[it.key]={it:it,t:Date.now()};try{it.run(it)}catch(x){alert(x.message||x)}}}})}}
function rer(){try{document.dispatchEvent(new Event('need-upd'))}catch(_){}}
/* عمود «المخرجات والطلبات» في رحلتي: مخرجاتك وطلباتك لدى المكتب مع حالتها */
function colItems(){var td=today(),R=[];
 S.DM.forEach(function(v){var st=v.st=='returned'?'act':v.st=='pending'?'wait':v.st=='approved'?'done':'wait',w=v.at?td-dn(v.at):0;
  R.push({key:'dm|'+v.id,state:st,late:st=='act'||(st=='wait'&&w>=5),ic:'📎',t:v.dl||v.n||v.file||'—',pj:v.pname||v.pcode,pc:v.pcode,
   tag:st=='act'?T('↩ أُعيد إليك للتعديل','↩ Returned to you'):st=='wait'?T('⏳ عند ','⏳ With ')+(v.appr||'')+(w>0?T(' منذ ',' for ')+DY(w):''):T('✅ اعتمده ','✅ Approved by ')+(v.dec_name||''),
   sub:T('مخرَج: ','Deliverable: ')+(v.dl?v.n:T('مهمة','task')),v:v,run:function(it){st=='act'?dretOpen(Object.assign({pid:v.pid,tid:v.tid,pj:it.pj,t:it.t},{v:{file:v.file,ver:v.ver,decided_name:v.dec_name,dec_note:v.dec_note}})):dlvOpen(it)}})});
 S.L.filter(function(it){return it.kind=='dap'}).forEach(function(it){var d=it.d;R.push({key:it.key,state:'act',late:it.late,ic:'📎',t:it.t,pj:it.pj,pc:it.pc,tag:T('✅ بانتظار اعتمادك','✅ Awaiting your approval'),sub:T('مخرَج من ','Deliverable from ')+(d.by||''),run:function(){dapOpen(it)}})});
 S.F.forEach(function(it){R.push({key:it.key,state:it.pend?'wait':'done',late:false,ic:'🏢',t:it.t,pj:it.pj,pc:it.pc,tag:it.pend?T('⏳ عند مكتب التطوير المؤسسي','⏳ With the office'):(it.z.status=='approved'||it.z.status=='excl'?T('✅ وافق المكتب','✅ Approved'):T('✖ لم يوافق المكتب','✖ Not approved')),sub:it.sub.split(' · ')[0],run:function(){fuOpen(it)}})});
 return R}
function dlvOpen(it){var v=it.v;ov('📎 '+T('مخرَج رفعته','Your deliverable'),it.pj,'<div class="nd-pc">'+dl([[T('المخرَج','Deliverable'),e(v.dl||'—')],[T('المهمة','Task'),e(v.n)],[T('المشروع','Project'),e(it.pj)],[T('الملف','File'),e(v.file||'')],[T('الإصدار','Version'),e(v.ver||'1')],[T('رُفع','Uploaded'),e(fd(v.at))],[T('المعتمِد','Approver'),e(v.appr||'')],[T('الحالة','Status'),e(it.tag)]])+(v.dec_note?'<div class="nd-box">'+T('ملاحظة المعتمِد: ','Approver note: ')+e(v.dec_note)+'</div>':'')+'</div>',
  '<a class="cm-bt" href="tasks.html#t='+encodeURIComponent(v.pid+'|'+v.tid)+'">'+T('فتح المهمة','Open the task')+'</a>')}

/* ---------- النوافذ داخل الصفحة ---------- */
function ov(ttl,sub,body,foot,wide){close();var o=document.createElement('div');o.id='ndov';o.className='cm-pop';o.style.zIndex='2147482400';o.dir=A()?'rtl':'ltr';
 o.innerHTML='<div class="cm-pb'+(wide?' cm-wide':'')+'" role="dialog" aria-modal="true"><div class="cm-ph"><div><b>'+ttl+'</b><small>'+e(sub||'')+'</small></div><button type="button" class="cm-px" data-nx aria-label="close">✕</button></div>'+body+(foot?'<div class="cm-pf">'+foot+'</div>':'')+'</div>';
 o.addEventListener('click',function(ev){if(ev.target===o||ev.target.closest('[data-nx]'))close(true)});document.body.appendChild(o);document.body.style.overflow='hidden';document.addEventListener('keydown',esc,true);return o}
function esc(ev){if(ev.key=='Escape')close(true)}
function close(re){var o=document.getElementById('ndov');if(o){o.remove();document.body.style.overflow='';document.removeEventListener('keydown',esc,true);if(re)refresh()}}
function dl(rows){return '<dl>'+rows.filter(function(r){return r[1]}).map(function(r){return '<dt>'+e(r[0])+'</dt><dd>'+r[1]+'</dd>'}).join('')+'</dl>'}
function dapOpen(it){var d=it.d;var o=ov('📎 '+T('اعتماد مخرَج','Approve deliverable'),it.pj,'<div class="nd-pc">'+dl([[T('المخرَج','Deliverable'),e(d.dl||'—')],[T('المهمة','Task'),e(d.n)],[T('المشروع','Project'),e(it.pj)],[T('رفعه','Uploaded by'),e(d.by||'')],[T('الإصدار','Version'),e(d.ver||'1')],[T('تاريخ الرفع','Uploaded'),e(fd(d.at))],[T('موعد المهمة','Task due'),e(fd(d.due))]])+
  (d.note?'<div class="nd-box">'+T('ملاحظة المكلّف: ','Note: ')+e(d.note)+'</div>':'')+
  '<button type="button" class="nd-file" data-file>📄 '+e(d.file||T('فتح الملف','Open file'))+'</button><label style="font-size:13px;color:#6b6f76">'+T('ملاحظتك للمكلّف (مطلوبة عند الإعادة)','Your note (required when returning)')+'</label><textarea id="ndnote" rows="3"></textarea></div>',
  '<button type="button" class="cm-ok" data-ok>✅ '+T('اعتماد','Approve')+'</button><button type="button" class="cm-bt nd-no" data-ret>↩ '+T('إعادة للتعديل','Return for changes')+'</button><a class="cm-bt" href="tasks.html#appr">'+T('فتح في مهامي','Open in My tasks')+'</a>');
 o.querySelector('[data-file]').onclick=function(){try{IDODL('pl-attachments',d.path,d.file||'')}catch(x){alert(x.message||x)}};
 var go=async function(ok){var n=(o.querySelector('#ndnote').value||'').trim();if(!ok&&!n){alert(T('اكتب سبب الإعادة','Write the reason'));return}o.querySelectorAll('.cm-pf button').forEach(function(b){b.disabled=true});
  var r=await db().rpc('deliv_decide',{p_id:d.id,p_ok:ok,p_note:n||null});if(r.error){o.querySelectorAll('.cm-pf button').forEach(function(b){b.disabled=false});alert(r.error.message);return}
  markDone(it,ok?T('اعتمدت المخرَج','Approved'):T('أعدته للتعديل','Returned'));delete OPENED[it.key];close(true)};
 o.querySelector('[data-ok]').onclick=function(){go(true)};o.querySelector('[data-ret]').onclick=function(){go(false)}}
function frame(it,src,ttl){var o=ov(ttl,it.pj,'<iframe class="nd-fr" title="form"></iframe>','<a class="cm-bt" href="'+src+'">'+T('فتح في صفحة كاملة','Open full page')+'</a>',true);var f=o.querySelector('iframe');
 f.onload=function(){try{var dd=f.contentDocument,st=dd.createElement('style');st.textContent='#hd,#hd2,header.top,#gnav,.top,footer{display:none!important}body{padding-top:0!important}main{margin-top:0!important}';dd.head.appendChild(st)}catch(_){}};f.src=src}
function dretOpen(it){var v=it.v;var o=ov('↩ '+T('مخرَج أُعيد إليك','Deliverable returned'),it.pj,'<div class="nd-pc">'+dl([[T('المهمة','Task'),e(it.t)],[T('المشروع','Project'),e(it.pj)],[T('الملف المُعاد','Returned file'),e(v.file||'')],[T('الإصدار','Version'),e(v.ver||'')],[T('أعاده','Returned by'),e(v.decided_name||'')]])+(v.dec_note?'<div class="nd-note">'+T('ملاحظة المعتمِد: ','Approver note: ')+e(v.dec_note)+'</div>':'')+'<div style="color:#6b6f76;font-size:13px">'+T('عدّل الملف حسب الملاحظة ثم ارفع النسخة الجديدة من المهمة؛ تصل للمعتمِد تلقائيًا.','Revise the file, then upload the new version from the task; it goes to the approver automatically.')+'</div></div>',
  '<button type="button" class="cm-ok" data-up>📤 '+T('رفع نسخة معدّلة','Upload revised version')+'</button>');
 o.querySelector('[data-up]').onclick=function(){frame(it,'tasks.html#t='+encodeURIComponent(it.pid+'|'+it.tid),'📤 '+T('رفع نسخة معدّلة','Upload revised version'))}}
function progOpen(it){var g=it.g;var o=ov('📊 '+T('اعتماد نسبة إنجاز','Approve progress'),it.pj,'<div class="nd-pc">'+dl([[T('المشروع','Project'),e(it.pj)],[T('النوع','Type'),g.kind=='planned'?T('المخطط','Planned'):T('الفعلي','Actual')],[T('النسبة المطلوبة','Requested'),g.pct==null?T('حساب تلقائي','Automatic'):Math.round(g.pct)+'%'],[T('النسبة السابقة','Previous'),g.prev!=null?Math.round(g.prev)+'%':'—'],[T('تاريخ الطلب','Requested on'),e(fd(g.requested_at))]])+(g.note?'<div class="nd-box">'+e(g.note)+'</div>':'')+
  (g.files||[]).map(function(f,i){return '<button type="button" class="nd-file" data-pf="'+i+'">📎 '+e(f.name||T('ملف','file'))+'</button>'}).join('')+'<label style="font-size:13px;color:#6b6f76">'+T('ملاحظة المكتب (اختيارية)','Office note (optional)')+'</label><textarea id="ndnote" rows="2"></textarea></div>',
  '<button type="button" class="cm-ok" data-ok>✅ '+T('اعتماد','Approve')+'</button><button type="button" class="cm-bt nd-no" data-no>✖ '+T('رفض','Reject')+'</button><a href="myprojects.html?pc='+encodeURIComponent(it.pc)+'">'+T('ملف المشروع','Project file')+'</a>');
 o.querySelectorAll('[data-pf]').forEach(function(b){b.onclick=function(){var f=g.files[+b.dataset.pf];try{IDODL('pg-attachments',f.path,f.name)}catch(x){alert(x.message||x)}}});
 var go=async function(ok){o.querySelectorAll('.cm-pf button').forEach(function(b){b.disabled=true});var r=await db().rpc('prog_decide',{p_id:g.id,p_ok:ok,p_note:(o.querySelector('#ndnote').value||'').trim()||null,p_files:[]});
  if(r.error){o.querySelectorAll('.cm-pf button').forEach(function(b){b.disabled=false});alert(r.error.message);return}markDone(it,ok?T('اعتمدت النسبة','Approved'):T('رفضت النسبة','Rejected'));delete OPENED[it.key];close(true)};
 o.querySelector('[data-ok]').onclick=function(){go(true)};o.querySelector('[data-no]').onclick=function(){go(false)}}
function fuOpen(it){var z=it.z,v=function(x){return x==null?'—':typeof x=='object'?e(JSON.stringify(x)):e(x)};
 ov('⏳ '+T('طلبك لدى المكتب','Your request'),it.pj,'<div class="nd-pc">'+dl([[T('الطلب','Request'),e(it.t)],[T('المشروع','Project'),e(it.pj)],[T('أُرسل','Sent'),e(fd(z.at))],z.src=='lock'?[T('القيمة الحالية','Current value'),v(z.old_v)]:['',''],z.src=='lock'?[T('القيمة المطلوبة','Requested value'),v(z.new_v)]:['',''],[T('الحالة','Status'),e(it.sub.split(' · ').slice(1).join(' · '))]])+'<div style="color:#6b6f76;font-size:13px">'+T('يصلك إشعار عند قرار المكتب، ويبقى الطلب هنا للمتابعة.','You are notified when the office decides.')+'</div></div>','<a class="cm-bt" href="myprojects.html?pc='+encodeURIComponent(it.pc)+'">'+T('ملف المشروع','Project file')+'</a>')}
var LD={};function need(src,v){if(LD[src])return LD[src];LD[src]=new Promise(function(ok){if(document.querySelector('script[src^="'+src+'"]'))return ok();var s=document.createElement('script');s.src=src+'?v='+v;s.onload=ok;s.onerror=ok;document.head.appendChild(s)});return LD[src]}
async function revWhy(id){await need('revx.js',6);if(window.REV&&REV.why)REV.why(id,function(){refresh()},true,true);else decOpen('rev')}
async function decOpen(k){await need('revx.js',6);await need('lockx.js',4);await need('decx.js',3);if(window.DEC){DEC.open(k);var t=setInterval(function(){if(!document.getElementById('decov')){clearInterval(t);refresh()}},800)}else alert(T('تعذّر فتح قرارات المكتب','Could not open office decisions'))}

/* ---------- التحميل ---------- */
async function refresh(){if(S.busy)return;S.busy=true;try{await gather()}catch(x){console.error(x)}S.busy=false;rer()}
function boot(){if(!db())return setTimeout(boot,500);css();refresh();
 document.addEventListener('ido-upd',function(){if(!S.busy&&Date.now()-S.at>3000)refresh()});
 document.addEventListener('visibilitychange',function(){if(!document.hidden&&Date.now()-S.at>60000)refresh()})}
window.NEED={refresh:refresh,renderAct:renderAct,colItems:colItems,ready:function(){return S.at>0},at:function(){return S.at},
 items:function(){return S.L},count:function(){return S.L.length},isOff:function(it){return !!OFFK[it.kind]},
 open:function(key){var it=S.L.concat(S.F).find(function(z){return z.key==key})||colItems().find(function(z){return z.key==key});if(it){OPENED[it.key]={it:it,t:Date.now()};it.run(it)}},
 opened:function(it){OPENED[it.key]={it:it,t:Date.now()}}};
if(document.readyState=='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
