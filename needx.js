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
var S={tab:'do',all:false,L:[],F:[],DM:[],seen:{},busy:false,at:0,off:false};
var DONE=(function(){try{return JSON.parse(sessionStorage.getItem('needDone')||'[]')}catch(_){return []}})();
function saveDone(){try{sessionStorage.setItem('needDone',JSON.stringify(DONE.slice(0,40)))}catch(_){}}
function markDone(it,how){if(!it)return;DONE=DONE.filter(function(d){return d.key!=it.key});DONE.unshift({key:it.key,ic:it.ic,t:it.t,pj:it.pj,how:how||T('تم','Done'),at:Date.now()});saveDone()}
var OPENED={};

function css(){if(document.getElementById('needcss'))return;var s=document.createElement('style');s.id='needcss';s.textContent=
 '#updhome{display:none!important}'+
 '.nd{background:#fff;border:1px solid #e6dcc4;border-inline-start:5px solid #BF9849;border-radius:18px;padding:12px 14px 10px;margin:0 0 14px;box-sizing:border-box}'+
 '.nd-h{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.nd-h>b{font-size:17px;color:#14324a}.nd-sum{color:#5b6470;font-size:13px;flex:1;min-width:160px}'+
 '.nd-t{display:inline-flex;gap:4px;flex-wrap:wrap}.nd-t button{font:inherit;font-size:13px;font-weight:700;border:1px solid #ddd5c3;background:#fff;border-radius:99px;padding:5px 12px;cursor:pointer;color:#33383e}.nd-t button.on{background:#14324a;border-color:#14324a;color:#fff}.nd-t i{font-style:normal;opacity:.8;margin-inline-start:3px}'+
 '.nd-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px;margin-top:10px}'+
 '.nd-c{display:flex;flex-direction:column;gap:4px;border:1px solid #ece6d8;border-radius:14px;padding:10px 12px;background:#fcfbf8;cursor:pointer;min-width:0;text-align:start;font:inherit;color:inherit}'+
 '.nd-c:hover{border-color:#BF9849;background:#fff}.nd-c:focus-visible{outline:2px solid #1d5f8a;outline-offset:2px}'+
 '.nd-c.l{border-inline-start:4px solid #d1101d}.nd-c.w{border-inline-start:4px solid #a8761a}'+
 '.nd-k{font-size:12.5px;font-weight:800;color:var(--k,#1d5f8a)}.nd-c b{font-size:14.5px;line-height:1.5;overflow-wrap:anywhere}.nd-c small{color:#6b6f76;font-size:12.5px;line-height:1.6}'+
 '.nd-c .nd-d{font-weight:700}.nd-c.l .nd-d{color:#d1101d}.nd-c.w .nd-d{color:#a8761a}'+
 '.nd-go{margin-top:auto;align-self:flex-start;background:#14324a;color:#fff;border-radius:99px;padding:5px 12px;font-size:12.5px;font-weight:800}'+
 '.nd-none{color:#6b6f76;font-size:13.5px;padding:10px 2px}.nd-more{display:block;margin:10px auto 0;font:inherit;font-size:13px;font-weight:700;border:1px solid #ddd5c3;background:#fff;border-radius:99px;padding:6px 16px;cursor:pointer}'+
 '.nd-ov{position:fixed;inset:0;z-index:2147482400;background:rgba(20,30,40,.5);display:flex;align-items:center;justify-content:center;padding:12px}'+
 '.nd-p{background:#fff;border-radius:16px;width:min(560px,100%);max-height:92vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.3)}.nd-p.wd{width:min(1000px,100%);height:92vh}'+
 '.nd-ph{display:flex;align-items:flex-start;gap:10px;padding:12px 16px;border-bottom:1px solid #eee7d8}.nd-ph div{flex:1;min-width:0}.nd-ph b{display:block;font-size:16px}.nd-ph small{color:#6b6f76}.nd-ph button{font:inherit;border:1px solid #ddd5c3;background:#fff;border-radius:99px;padding:4px 12px;cursor:pointer}'+
 '.nd-pc{padding:14px 16px;overflow:auto;font-size:14px;line-height:1.8}.nd-pc dl{display:grid;grid-template-columns:auto 1fr;gap:2px 12px;margin:0 0 10px}.nd-pc dt{color:#6b6f76}.nd-pc dd{margin:0;font-weight:700;overflow-wrap:anywhere}'+
 '.nd-pc textarea,.nd-pc input{width:100%;box-sizing:border-box;font:inherit;border:1px solid #d6d0c2;border-radius:10px;padding:8px 10px}'+
 '.nd-pf{display:flex;gap:8px;flex-wrap:wrap;padding:10px 16px calc(12px + env(safe-area-inset-bottom));border-top:1px solid #eee7d8}.nd-pf button,.nd-pf a{font:inherit;font-weight:800;font-size:14px;border:1px solid #d6d0c2;background:#fff;border-radius:99px;padding:8px 16px;cursor:pointer;color:#23272b;text-decoration:none}.nd-pf .ok{background:#0a6b3d;border-color:#0a6b3d;color:#fff}.nd-pf .no{color:#d1101d;border-color:#e6b8bc}'+
 '.nd-fr{flex:1;border:0;width:100%;min-height:0}.nd-note{background:#fdecee;color:#8a1019;border-radius:10px;padding:8px 10px;margin:6px 0}'+
 '.cm-it.nd-j{cursor:pointer}.cm-it .nd-w{display:block;max-width:100%;box-sizing:border-box;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:4px;background:#f1f3f6;color:#4a5568;border:1px solid #dde2ea;border-radius:99px;padding:1px 8px;font-size:11.5px;font-weight:700}.cm-it.l .nd-w{background:#fdecee;color:#d1101d;border-color:#f3c2c7}.cm-it.ok .nd-w{background:#eaf6ef;color:#1c7a45;border-color:#c5e5d2}'+
 '@media (max-width:640px){.nd{padding:10px 10px 8px;border-radius:14px}.nd-g{grid-template-columns:1fr}.nd-p{max-height:96vh}}';document.head.appendChild(s)}

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
 (r[0]||[]).forEach(function(d){var w=d.at?td-dn(d.at):0;L.push(mk('dap',{key:'dap|'+d.id,t:d.dl||d.n,sub:d.dl?T('المهمة: ','Task: ')+d.n:'',pj:d.pname||d.pcode,pc:d.pcode,due:d.due,late:w>=5,warn:w>=2,age:w,go:T('مراجعة واعتماد','Review & approve'),d:d,run:function(it){dapOpen(it)}}))});
 S.DM=Array.isArray(r[1])?r[1]:[];S.DM.forEach(function(v){if(v.st!='returned')return;L.push(mk('dret',{key:'dret|'+v.id,t:v.dl||v.n||v.file||T('مخرَج','Deliverable'),pj:v.pname||v.pcode,pc:v.pcode,late:true,sub:(v.dl?T('المهمة: ','Task: ')+v.n+' · ':'')+(v.dec_name?T('أعاده ','Returned by ')+v.dec_name:''),go:T('رفع نسخة معدّلة','Upload a revised version'),v:{file:v.file,ver:v.ver,decided_name:v.dec_name,dec_note:v.dec_note},pid:v.pid,tid:v.tid,run:function(it){dretOpen(it)}}))});
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
 var now={};L.forEach(function(i){now[i.key]=1});S.L.forEach(function(i){if(!now[i.key]&&OPENED[i.key]){markDone(i);delete OPENED[i.key]}});
 S.L=L;S.F=F;S.at=Date.now();try{document.dispatchEvent(new Event('need-upd'))}catch(_){}}

/* ---------- العرض ---------- */
function dueTxt(it){var td=today();if(it.kind=='fu')return it.since?T('منذ ','Since ')+fd(it.since):'';
 if(it.age!=null&&it.kind!='kpi')return it.age>0?T('ينتظر منذ ','Waiting ')+DY(it.age):T('وصل اليوم','Arrived today');
 var d=dn(it.due);if(d==null)return '';var n=d-td;return n<0?T('متأخر ','Late ')+DY(-n):n==0?T('مستحق اليوم','Due today'):T('خلال ','In ')+DY(n)+' · '+fd(it.due)}
function card(it,i){return '<button type="button" class="nd-c '+(it.late?'l':it.warn?'w':'')+'" data-ni="'+i+'" style="--k:'+it.kc+'"><span class="nd-k">'+it.ic+' '+e(it.kl)+'</span><b>'+e(it.t)+'</b>'+(it.sub?'<small>'+e(it.sub)+'</small>':'')+'<small>'+(it.pj?'📁 '+e(it.pj):'')+(dueTxt(it)?' · <span class="nd-d">'+e(dueTxt(it))+'</span>':'')+'</small><span class="nd-go">'+e(it.go)+' ›</span></button>'}
function html(){var L=S.tab=='fu'?S.F:S.L,lim=window.innerWidth>=900?8:4,late=S.L.filter(function(i){return i.late}).length,fp=S.F.filter(function(i){return i.pend}).length;
 var sum=S.L.length?(S.L.length+' '+T(S.L.length==1?'إجراء':'إجراءات','action(s)')+(late?' · '+late+' '+T('متأخرة','late'):'')):T('لا يوجد ما ينتظر إجراءك الآن','Nothing is waiting for you');
 var h='<div class="nd-h"><b>📌 '+T('مطلوب منك','Needs you')+'</b><span class="nd-sum">'+e(sum)+'</span><span class="nd-t" role="tablist">'+
  [['do',T('بانتظار إجرائك','Awaiting you'),S.L.length],['fu',T('طلباتي لدى المكتب','My office requests'),fp||S.F.length],['ok',T('أنجزتها اليوم','Done'),DONE.length]].filter(function(t){return t[0]=='do'||t[2]}).map(function(t){return '<button type="button" data-nt="'+t[0]+'" class="'+(S.tab==t[0]?'on':'')+'">'+e(t[1])+(t[2]?'<i>'+t[2]+'</i>':'')+'</button>'}).join('')+'</span></div>';
 if(S.tab=='ok'){h+=DONE.length?'<div class="nd-g">'+DONE.map(function(d){return '<div class="nd-c" style="cursor:default;opacity:.85"><span class="nd-k" style="--k:#0a6b3d">✔ '+e(d.how)+'</span><b>'+e(d.t)+'</b><small>'+(d.pj?'📁 '+e(d.pj)+' · ':'')+new Date(d.at).toLocaleTimeString(A()?'ar-AE':'en-GB',{hour:'2-digit',minute:'2-digit'})+'</small></div>'}).join('')+'</div>':'<div class="nd-none">—</div>';return h}
 if(!L.length)return h+'<div class="nd-none">'+(S.tab=='fu'?T('لا توجد طلبات لك لدى المكتب.','No requests with the office.'):'✓ '+T('لا يوجد ما ينتظر إجراءك. ستظهر هنا قراءات المؤشرات ومراجعات المخاطر والمخرجات التي تحتاج اعتمادك.','Nothing is waiting. KPI readings, risk reviews and deliverables needing you appear here.'))+'</div>';
 var sh=S.all?L:L.slice(0,lim);h+='<div class="nd-g">'+sh.map(function(it){return card(it,L.indexOf(it))}).join('')+'</div>';
 if(L.length>lim)h+='<button type="button" class="nd-more" data-nall>'+(S.all?T('عرض أقل','Show less'):T('عرض الكل (','Show all (')+L.length+')')+'</button>';return h}
function host(){var m=document.getElementById('cmmain');if(!m||!m.parentNode)return null;var w=document.getElementById('needw');if(!w){w=document.createElement('section');w.id='needw';w.className='nd';w.setAttribute('aria-label',T('مطلوب منك','Needs you'))}
 if(w.nextSibling!==m)m.parentNode.insertBefore(w,m);var vis=getComputedStyle(m).display!='none'&&!m.hidden,dv=vis?'':'none';if(w.style.display!==dv)w.style.display=dv;return w}
function paint(){var w=host();if(!w)return;var h=html();if(w.__h!==h){w.innerHTML=h;w.__h=h}}
document.addEventListener('click',function(ev){var t=ev.target;if(!t.closest)return;var w=t.closest('#needw');if(!w)return;
 var b=t.closest('[data-nt]');if(b){S.tab=b.dataset.nt;S.all=false;paint();return}
 if(t.closest('[data-nall]')){S.all=!S.all;paint();return}
 var c=t.closest('[data-ni]');if(c){var L=S.tab=='fu'?S.F:S.L,it=L[+c.dataset.ni];if(it){OPENED[it.key]=1;try{it.run(it)}catch(x){alert(x.message||x)}}}});

/* ---------- النوافذ داخل الصفحة ---------- */
function ov(ttl,sub,body,foot,wide){close();var o=document.createElement('div');o.id='ndov';o.className='nd-ov';o.dir=A()?'rtl':'ltr';
 o.innerHTML='<div class="nd-p'+(wide?' wd':'')+'" role="dialog" aria-modal="true"><div class="nd-ph"><div><b>'+ttl+'</b><small>'+e(sub||'')+'</small></div><button type="button" data-nx>✕ '+T('إغلاق','Close')+'</button></div>'+body+(foot?'<div class="nd-pf">'+foot+'</div>':'')+'</div>';
 o.addEventListener('click',function(ev){if(ev.target===o||ev.target.closest('[data-nx]'))close(true)});document.body.appendChild(o);document.addEventListener('keydown',esc,true);return o}
function esc(ev){if(ev.key=='Escape')close(true)}
function close(re){var o=document.getElementById('ndov');if(o){o.remove();document.removeEventListener('keydown',esc,true);if(re)refresh()}}
function dl(rows){return '<dl>'+rows.filter(function(r){return r[1]}).map(function(r){return '<dt>'+e(r[0])+'</dt><dd>'+r[1]+'</dd>'}).join('')+'</dl>'}
function dapOpen(it){var d=it.d;var o=ov('📎 '+T('اعتماد مخرَج','Approve deliverable'),it.pj,'<div class="nd-pc">'+dl([[T('المخرَج','Deliverable'),e(d.dl||'—')],[T('المهمة','Task'),e(d.n)],[T('المشروع','Project'),e(it.pj)],[T('رفعه','Uploaded by'),e(d.by||'')],[T('الإصدار','Version'),e(d.ver||'1')],[T('تاريخ الرفع','Uploaded'),e(fd(d.at))],[T('موعد المهمة','Task due'),e(fd(d.due))]])+
  (d.note?'<div style="background:#faf8f3;border-radius:10px;padding:8px 10px;margin-bottom:8px">'+T('ملاحظة المكلّف: ','Note: ')+e(d.note)+'</div>':'')+
  '<button type="button" class="nd-more" style="margin:0 0 10px" data-file>📄 '+e(d.file||T('فتح الملف','Open file'))+'</button><label style="font-size:13px;color:#6b6f76">'+T('ملاحظتك للمكلّف (مطلوبة عند الإعادة)','Your note (required when returning)')+'</label><textarea id="ndnote" rows="3"></textarea></div>',
  '<button type="button" class="ok" data-ok>✅ '+T('اعتماد','Approve')+'</button><button type="button" class="no" data-ret>↩ '+T('إعادة للتعديل','Return for changes')+'</button><a href="tasks.html#appr">'+T('فتح في مهامي','Open in My tasks')+'</a>');
 o.querySelector('[data-file]').onclick=function(){try{IDODL('pl-attachments',d.path,d.file||'')}catch(x){alert(x.message||x)}};
 var go=async function(ok){var n=(o.querySelector('#ndnote').value||'').trim();if(!ok&&!n){alert(T('اكتب سبب الإعادة','Write the reason'));return}o.querySelectorAll('.nd-pf button').forEach(function(b){b.disabled=true});
  var r=await db().rpc('deliv_decide',{p_id:d.id,p_ok:ok,p_note:n||null});if(r.error){o.querySelectorAll('.nd-pf button').forEach(function(b){b.disabled=false});alert(r.error.message);return}
  markDone(it,ok?T('اعتمدت المخرَج','Approved'):T('أعدته للتعديل','Returned'));delete OPENED[it.key];close(true)};
 o.querySelector('[data-ok]').onclick=function(){go(true)};o.querySelector('[data-ret]').onclick=function(){go(false)}}
function frame(it,src,ttl){var o=ov(ttl,it.pj,'<iframe class="nd-fr" title="form"></iframe>','<a href="'+src+'">'+T('فتح في صفحة كاملة','Open full page')+'</a>',true);var f=o.querySelector('iframe');
 f.onload=function(){try{var dd=f.contentDocument,st=dd.createElement('style');st.textContent='#hd,#hd2,header.top,#gnav,.top,footer{display:none!important}body{padding-top:0!important}main{margin-top:0!important}';dd.head.appendChild(st)}catch(_){}};f.src=src}
function dretOpen(it){var v=it.v;var o=ov('↩ '+T('مخرَج أُعيد إليك','Deliverable returned'),it.pj,'<div class="nd-pc">'+dl([[T('المهمة','Task'),e(it.t)],[T('المشروع','Project'),e(it.pj)],[T('الملف المُعاد','Returned file'),e(v.file||'')],[T('الإصدار','Version'),e(v.ver||'')],[T('أعاده','Returned by'),e(v.decided_name||'')]])+(v.dec_note?'<div class="nd-note">'+T('ملاحظة المعتمِد: ','Approver note: ')+e(v.dec_note)+'</div>':'')+'<div style="color:#6b6f76;font-size:13px">'+T('عدّل الملف حسب الملاحظة ثم ارفع النسخة الجديدة من المهمة؛ تصل للمعتمِد تلقائيًا.','Revise the file, then upload the new version from the task; it goes to the approver automatically.')+'</div></div>',
  '<button type="button" class="ok" data-up>📤 '+T('رفع نسخة معدّلة','Upload revised version')+'</button>');
 o.querySelector('[data-up]').onclick=function(){frame(it,'tasks.html#t='+encodeURIComponent(it.pid+'|'+it.tid),'📤 '+T('رفع نسخة معدّلة','Upload revised version'))}}
function progOpen(it){var g=it.g;var o=ov('📊 '+T('اعتماد نسبة إنجاز','Approve progress'),it.pj,'<div class="nd-pc">'+dl([[T('المشروع','Project'),e(it.pj)],[T('النوع','Type'),g.kind=='planned'?T('المخطط','Planned'):T('الفعلي','Actual')],[T('النسبة المطلوبة','Requested'),g.pct==null?T('حساب تلقائي','Automatic'):Math.round(g.pct)+'%'],[T('النسبة السابقة','Previous'),g.prev!=null?Math.round(g.prev)+'%':'—'],[T('تاريخ الطلب','Requested on'),e(fd(g.requested_at))]])+(g.note?'<div style="background:#faf8f3;border-radius:10px;padding:8px 10px;margin-bottom:8px">'+e(g.note)+'</div>':'')+
  (g.files||[]).map(function(f,i){return '<button type="button" class="nd-more" style="margin:0 0 8px" data-pf="'+i+'">📎 '+e(f.name||T('ملف','file'))+'</button>'}).join('')+'<label style="font-size:13px;color:#6b6f76">'+T('ملاحظة المكتب (اختيارية)','Office note (optional)')+'</label><textarea id="ndnote" rows="2"></textarea></div>',
  '<button type="button" class="ok" data-ok>✅ '+T('اعتماد','Approve')+'</button><button type="button" class="no" data-no>✖ '+T('رفض','Reject')+'</button><a href="myprojects.html?pc='+encodeURIComponent(it.pc)+'">'+T('ملف المشروع','Project file')+'</a>');
 o.querySelectorAll('[data-pf]').forEach(function(b){b.onclick=function(){var f=g.files[+b.dataset.pf];try{IDODL('pg-attachments',f.path,f.name)}catch(x){alert(x.message||x)}}});
 var go=async function(ok){o.querySelectorAll('.nd-pf button').forEach(function(b){b.disabled=true});var r=await db().rpc('prog_decide',{p_id:g.id,p_ok:ok,p_note:(o.querySelector('#ndnote').value||'').trim()||null,p_files:[]});
  if(r.error){o.querySelectorAll('.nd-pf button').forEach(function(b){b.disabled=false});alert(r.error.message);return}markDone(it,ok?T('اعتمدت النسبة','Approved'):T('رفضت النسبة','Rejected'));delete OPENED[it.key];close(true)};
 o.querySelector('[data-ok]').onclick=function(){go(true)};o.querySelector('[data-no]').onclick=function(){go(false)}}
function fuOpen(it){var z=it.z,v=function(x){return x==null?'—':typeof x=='object'?e(JSON.stringify(x)):e(x)};
 ov('⏳ '+T('طلبك لدى المكتب','Your request'),it.pj,'<div class="nd-pc">'+dl([[T('الطلب','Request'),e(it.t)],[T('المشروع','Project'),e(it.pj)],[T('أُرسل','Sent'),e(fd(z.at))],z.src=='lock'?[T('القيمة الحالية','Current value'),v(z.old_v)]:['',''],z.src=='lock'?[T('القيمة المطلوبة','Requested value'),v(z.new_v)]:['',''],[T('الحالة','Status'),e(it.sub.split(' · ').slice(1).join(' · '))]])+'<div style="color:#6b6f76;font-size:13px">'+T('يصلك إشعار عند قرار المكتب، ويبقى الطلب هنا للمتابعة.','You are notified when the office decides.')+'</div></div>','<a href="myprojects.html?pc='+encodeURIComponent(it.pc)+'">'+T('ملف المشروع','Project file')+'</a>')}
var LD={};function need(src,v){if(LD[src])return LD[src];LD[src]=new Promise(function(ok){if(document.querySelector('script[src^="'+src+'"]'))return ok();var s=document.createElement('script');s.src=src+'?v='+v;s.onload=ok;s.onerror=ok;document.head.appendChild(s)});return LD[src]}
async function revWhy(id){await need('revx.js',6);if(window.REV&&REV.why)REV.why(id,function(){refresh()},true,true);else decOpen('rev')}
async function decOpen(k){await need('revx.js',6);await need('lockx.js',4);await need('decx.js',3);if(window.DEC){DEC.open(k);var t=setInterval(function(){if(!document.getElementById('decov')){clearInterval(t);refresh()}},800)}else alert(T('تعذّر فتح قرارات المكتب','Could not open office decisions'))}

/* عمود «المخرجات والطلبات» في رحلتي */
function colItems(){var td=today(),R=[];
 S.L.filter(function(it){return it.kind=='dap'}).forEach(function(it){var d=it.d;R.push({key:it.key,state:'act',late:it.late,ic:'📎',t:it.t,pj:it.pj,pc:it.pc,tag:T('✅ بانتظار اعتمادك','✅ Awaiting your approval'),sub:T('مخرَج من ','Deliverable from ')+(d.by||''),run:function(){dapOpen(it)}})});
 S.DM.forEach(function(v){var st=v.st=='returned'?'act':v.st=='approved'?'done':'wait',w=v.at?td-dn(v.at):0;
  R.push({key:'dm|'+v.id,state:st,late:st=='act'||(st=='wait'&&w>=5),ic:'📎',t:v.dl||v.n||v.file||'—',pj:v.pname||v.pcode,pc:v.pcode,
   tag:st=='act'?T('↩ أُعيد إليك للتعديل','↩ Returned to you'):st=='wait'?T('⏳ عند ','⏳ With ')+(v.appr||'')+(w>0?T(' منذ ',' for ')+DY(w):''):T('✅ اعتمده ','✅ Approved by ')+(v.dec_name||''),
   sub:T('مخرَج: ','Deliverable: ')+(v.dl?v.n:T('مهمة','task')),v:v,run:function(it){if(st=='act')dretOpen({pid:v.pid,tid:v.tid,pj:it.pj,t:it.t,v:{file:v.file,ver:v.ver,decided_name:v.dec_name,dec_note:v.dec_note}});else dlvOpen(it)}})});
 S.F.forEach(function(it){R.push({key:it.key,state:it.pend?'wait':'done',late:false,ic:'🏢',t:it.t,pj:it.pj,pc:it.pc,tag:it.pend?T('⏳ عند مكتب التطوير المؤسسي','⏳ With the office'):(it.z.status=='approved'||it.z.status=='excl'?T('✅ وافق المكتب','✅ Approved'):T('✖ لم يوافق المكتب','✖ Not approved')),sub:it.sub.split(' · ')[0],run:function(){fuOpen(it)}})});
 return R}
function dlvOpen(it){var v=it.v;ov('📎 '+T('مخرَج رفعته','Your deliverable'),it.pj,'<div class="nd-pc">'+dl([[T('المخرَج','Deliverable'),e(v.dl||'—')],[T('المهمة','Task'),e(v.n)],[T('المشروع','Project'),e(it.pj)],[T('الملف','File'),e(v.file||'')],[T('الإصدار','Version'),e(v.ver||'1')],[T('رُفع','Uploaded'),e(fd(v.at))],[T('المعتمِد','Approver'),e(v.appr||'')],[T('الحالة','Status'),e(it.tag)]])+(v.dec_note?'<div style="background:#faf8f3;border-radius:10px;padding:8px 10px">'+T('ملاحظة المعتمِد: ','Approver note: ')+e(v.dec_note)+'</div>':'')+'</div>',
  '<a href="tasks.html#t='+encodeURIComponent(v.pid+'|'+v.tid)+'">'+T('فتح المهمة','Open the task')+'</a>')}
/* ---------- التحميل ---------- */
var RT=null;async function refresh(){if(S.busy)return;S.busy=true;try{await gather()}catch(x){console.error(x)}S.busy=false;paint()}
function boot(){if(!/(index\.html|\/)$/.test(location.pathname))return;if(!db()||!document.getElementById('cmmain'))return setTimeout(boot,500);css();paint();refresh();
 new MutationObserver(function(){if(!document.getElementById('needw')||document.getElementById('needw').nextSibling!==document.getElementById('cmmain'))paint();else host()}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','style','class']});
 document.addEventListener('ido-upd',function(){if(!S.busy&&Date.now()-S.at>3000)refresh()});
 document.addEventListener('visibilitychange',function(){if(!document.hidden&&Date.now()-S.at>60000)refresh()});
 var w0=window.innerWidth;addEventListener('resize',function(){if((w0>=900)!=(window.innerWidth>=900)){w0=window.innerWidth;paint()}})}
window.NEED={refresh:refresh,items:function(){return S.L},colItems:colItems,at:function(){return S.at},open:function(key){var it=colItems().find(function(z){return z.key==key});if(it)it.run(it)}};
if(document.readyState=='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
