/* actc.js — «مركز الإجراءات» أعلى صفحة التنبيهات — window.AXC
   «المطلوب مني»: كل ما ينتظر إجراءك، يُحسب من البيانات مباشرة (my_actions) ويختفي حين يُنجز، مع لوحات تفاعلية وتنفيذ بلمسة وتأجيل.
   «وحدتي»: لمدير الوحدة ولمن له صلاحية المركز (act_team) — الأسماء تظهر فقط لمن للمشاهد صلاحية عليه. */
(function(){if(window.AXC)return;
var A=function(){return (document.documentElement.lang||'ar')!='en'},T=function(a,b){return A()?a:b};
var e=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var db=function(){try{if(typeof sb!='undefined'&&sb&&sb.rpc)return sb}catch(_){}return window.sb||null};
var dn=function(s){var m=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(s||''));return m?Math.round(Date.UTC(+m[1],+m[2]-1,+m[3])/864e5):null};
var dubai=function(d){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Dubai'}).format(d||new Date())};
var today=function(){return dn(dubai())};
var iso=function(n){var d=new Date(n*864e5);return d.toISOString().slice(0,10)};
var fd=function(s){var n=typeof s=='number'?s:dn(s);if(n==null)return '';var d=new Date(n*864e5);return d.getUTCDate()+'/'+(d.getUTCMonth()+1)};
/* العدد مع المعدود بالعربية الفصحى */
var N=function(n,one,two,few,many){n=+n||0;if(n==1)return one;if(n==2)return two;var m=n%100;return n+' '+(m>=3&&m<=10?few:many)};
var DY=function(n){n=Math.abs(+n||0);return A()?N(n,'يوم واحد','يومين','أيام','يومًا'):n+' d'};
var TY={kpi:['📈','قراءة مؤشر','KPI reading','#1d5f8a'],risk:['🛡️','مراجعة خطر','Risk review','#7a3e9d'],act:['🎯','إجراء معالجة خطر','Risk action','#7a3e9d'],appr:['✅','اعتماد قراءات','Approve readings','#0a6b3d'],
 dap:['📎','اعتماد مخرَج','Approve deliverable','#0a6b3d'],dret:['↩','مخرَج أُعيد إليك','Deliverable returned','#c0161f'],doc:['✍️','توقيع وثيقة','Sign a document','#14324a'],dfix:['📝','وثيقة أُعيدت إليك','Document returned','#c0161f'],
 doff:['🏢','مراجعة المكتب','Office review','#14324a'],task:['✅','مهمة','Task','#1c6e8c'],dmiss:['📤','رفع مخرَج','Upload deliverable','#a8761a'],clo:['🏁','التقرير الختامي','Closure report','#5b6b7d'],
 kev:['📎','دليل قراءة','Reading evidence','#a8761a'],pcr:['🗓️','تعديل مواعيد','Schedule change','#1d5f8a'],rev:['⚖️','مراجعة الاحتساب','Calculation review','#14324a'],lock:['🔒','قيمة مقفلة','Locked value','#14324a'],
 prog:['📊','نسبة إنجاز','Progress approval','#14324a'],esc:['⬆','طلب تصعيد','Escalation','#c0161f']};
var ty=function(t){return TY[t]||['•','إجراء','Action','#5b6b7d']};
var GO={kpi:['إدخال القراءة','Enter reading'],risk:['مراجعة الخطر','Review risk'],act:['تحديث الإجراء','Update action'],appr:['مراجعة واعتماد','Review & approve'],dap:['مراجعة واعتماد','Review & approve'],
 dret:['رفع نسخة معدّلة','Upload revision'],doc:['فتح للتوقيع','Open to sign'],dfix:['فتح للتعديل','Open to edit'],doff:['فتح للمراجعة','Open to review'],task:['تحديث الإنجاز','Update progress'],
 dmiss:['رفع المخرَج','Upload'],clo:['إعداد التقرير','Prepare report'],kev:['إرفاق الدليل','Attach evidence'],pcr:['مراجعة الطلب','Review request'],rev:['التفاصيل والقرار','Decide'],lock:['مراجعة الطلب','Review'],prog:['مراجعة واعتماد','Review'],esc:['فتح الطلب','Open']};
var ST=[['late','🔴','متأخرة','Late'],['now','🟠','اليوم','Today'],['week','🔵','هذا الأسبوع','This week'],['later','⚪','لاحقًا','Later'],['snz','💤','مؤجلة','Snoozed']];
var S={tab:'me',d:null,need:{},L:[],f:{},sel:{},bulk:false,team:null,unit:null,org:null,open:{},busy:false,err:'',at:0,news:null,show:{}};
try{var h0=location.hash;if(/^#unit/.test(h0))S.tab='unit'}catch(_){}

function css(){if(document.getElementById('axccss'))return;var s=document.createElement('style');s.id='axccss';s.textContent=
 '.axc{background:#fff;border:1px solid #e6dcc4;border-radius:20px;padding:14px 16px 12px;margin:0 0 16px;box-sizing:border-box;color:#23272b}'+
 '.axc *{box-sizing:border-box}.axc button{font:inherit;cursor:pointer}'+
 '.axc-h{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px}.axc-h>b{font-size:18px;color:#14324a;flex:1;min-width:150px}'+
 '.axc-tb{display:inline-flex;background:#f3efe4;border-radius:99px;padding:3px;gap:2px}.axc-tb button{border:0;background:transparent;border-radius:99px;padding:6px 14px;font-weight:800;font-size:13.5px;color:#4a4f55}.axc-tb button.on{background:#14324a;color:#fff}.axc-tb i{font-style:normal;opacity:.85;margin-inline-start:4px}'+
 '.axc-rf{border:1px solid #ddd5c3;background:#fff;border-radius:99px;padding:5px 10px;font-size:13px;color:#4a4f55}'+
 '.axc-br{background:linear-gradient(135deg,#14324a,#1d5f8a);color:#fff;border-radius:16px;padding:12px 14px;line-height:1.85;font-size:14.5px;margin-bottom:10px}.axc-br b{color:#f3d58f}.axc-br p{margin:0}.axc-br .g{font-size:16px;font-weight:800;margin-bottom:2px}'+
 '.axc-ti{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin-bottom:10px}.axc-t{border:1px solid #ece6d8;border-radius:14px;padding:9px 10px;background:#fcfbf8;text-align:start;color:inherit;min-width:0}'+
 '.axc-t b{display:block;font-size:24px;line-height:1.1;font-weight:800;color:var(--c,#14324a)}.axc-t span{font-size:12.5px;color:#5b6470;font-weight:700}.axc-t.on{outline:2px solid var(--c,#14324a);background:#fff}.axc-t:hover{border-color:var(--c,#14324a)}'+
 '.axc-in{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-bottom:10px}.axc-p{border:1px solid #ece6d8;border-radius:14px;padding:10px 12px;min-width:0}.axc-p h4{margin:0 0 6px;font-size:13px;color:#5b6470}'+
 '.axc-bar{display:grid;grid-template-columns:1fr auto;gap:2px 8px;align-items:center;width:100%;border:0;background:transparent;padding:4px 2px;border-radius:8px;text-align:start;color:inherit;font-size:13px}.axc-bar:hover{background:#f7f4ec}.axc-bar.on{background:#eef4f8}.axc-bar.on .axc-bl{font-weight:800;color:#14324a}'+
 '.axc-bl{min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.axc-bt{grid-column:1/-1;height:7px;background:#f1ede2;border-radius:99px;overflow:hidden;display:flex}.axc-bt i{display:block;height:100%}.axc-bn{font-weight:800}.axc-bn small{color:#c0161f;font-weight:800;margin-inline-start:4px}'+
 '.axc-fc{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 8px}.axc-fc button{border:1px solid #14324a;background:#eef4f8;color:#14324a;border-radius:99px;padding:3px 10px;font-size:12.5px;font-weight:800}'+
 '.axc-ac{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:0 0 8px}.axc-ac button{border:1px solid #ddd5c3;background:#fff;border-radius:99px;padding:5px 12px;font-size:13px;font-weight:700}.axc-ac button.pr{background:#0a6b3d;border-color:#0a6b3d;color:#fff}.axc-ac .sp{flex:1}'+
 '.axc-sh{display:flex;align-items:center;gap:6px;margin:10px 2px 6px;font-weight:800;color:#14324a;font-size:14.5px;border:0;background:transparent;padding:0}.axc-sh small{color:#6b6f76;font-weight:700}'+
 '.axc-r{display:flex;gap:10px;align-items:flex-start;border:1px solid #ece6d8;border-inline-start:4px solid var(--k,#1d5f8a);border-radius:14px;padding:9px 11px;margin:0 0 7px;background:#fff}'+
 '.axc-r.l{background:#fffafa}.axc-r .ck{margin-top:4px;width:18px;height:18px;flex:none}.axc-rm{flex:1;min-width:0}.axc-rk{font-size:12px;font-weight:800;color:var(--k,#1d5f8a)}'+
 '.axc-rm b{display:block;font-size:14.5px;line-height:1.55;overflow-wrap:anywhere}.axc-rm small{display:block;color:#6b6f76;font-size:12.5px;line-height:1.6;overflow-wrap:anywhere}'+
 '.axc-chip{display:inline-block;border-radius:99px;padding:0 8px;font-size:12px;font-weight:800;background:#eef2f6;color:#3d4b5c;margin-inline-start:4px}.axc-chip.l{background:#fdecee;color:#c0161f}.axc-chip.w{background:#fff3dc;color:#8a5a00}.axc-chip.e{background:#c0161f;color:#fff}'+
 '.axc-rb{display:flex;flex-direction:column;gap:5px;align-items:stretch;flex:none}.axc-rb button{border:1px solid #d6d0c2;background:#fff;border-radius:99px;padding:5px 12px;font-size:12.5px;font-weight:800;white-space:nowrap;color:#23272b}.axc-rb .go{background:#14324a;border-color:#14324a;color:#fff}'+
 '.axc-mo{display:block;margin:4px auto 0;border:1px solid #ddd5c3;background:#fff;border-radius:99px;padding:5px 14px;font-size:13px;font-weight:700}'+
 '.axc-em{color:#5b6470;padding:14px 4px;text-align:center;font-size:14px}.axc-er{background:#fdecee;color:#8a1019;border-radius:12px;padding:8px 10px;margin-bottom:8px;font-size:13.5px}'+
 '.axc-pp{position:fixed;z-index:2147482500;background:#fff;border:1px solid #d6d0c2;border-radius:14px;box-shadow:0 14px 40px rgba(0,0,0,.2);padding:6px;display:flex;flex-direction:column;min-width:170px}.axc-pp button{border:0;background:transparent;text-align:start;padding:8px 10px;border-radius:10px;font:inherit;font-size:14px;cursor:pointer}.axc-pp button:hover{background:#f3efe4}'+
 '.axc-ov{position:fixed;inset:0;z-index:2147482400;background:rgba(20,30,40,.5);display:flex;align-items:center;justify-content:center;padding:12px}'+
 '.axc-dl{background:#fff;border-radius:16px;width:min(540px,100%);max-height:92vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.3)}.axc-dl.wd{width:min(1000px,100%);height:92vh}'+
 '.axc-dh{display:flex;gap:10px;align-items:flex-start;padding:12px 16px;border-bottom:1px solid #eee7d8}.axc-dh div{flex:1;min-width:0}.axc-dh b{display:block;font-size:16px}.axc-dh small{color:#6b6f76}.axc-dh button{border:1px solid #ddd5c3;background:#fff;border-radius:99px;padding:4px 12px}'+
 '.axc-db{padding:14px 16px;overflow:auto;font-size:14px;line-height:1.8}.axc-db textarea,.axc-db input[type=number]{width:100%;font:inherit;border:1px solid #d6d0c2;border-radius:10px;padding:8px 10px}'+
 '.axc-pc{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 10px}.axc-pc button{border:1px solid #d6d0c2;background:#fff;border-radius:99px;padding:6px 14px;font-weight:800}.axc-pc button.on{background:#14324a;border-color:#14324a;color:#fff}'+
 '.axc-df{display:flex;gap:8px;flex-wrap:wrap;padding:10px 16px calc(12px + env(safe-area-inset-bottom));border-top:1px solid #eee7d8}.axc-df button,.axc-df a{font:inherit;font-weight:800;font-size:14px;border:1px solid #d6d0c2;background:#fff;border-radius:99px;padding:8px 16px;cursor:pointer;color:#23272b;text-decoration:none}.axc-df .ok{background:#0a6b3d;border-color:#0a6b3d;color:#fff}'+
 '.axc-fr{flex:1;border:0;width:100%;min-height:0}'+
 '.axc-us{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}.axc-us select{font:inherit;border:1px solid #d6d0c2;border-radius:99px;padding:5px 12px;background:#fff;max-width:100%}'+
 '.axc-tbl{width:100%;border-collapse:collapse;font-size:13.5px}.axc-tbl th{color:#6b6f76;font-weight:700;text-align:start;padding:5px 4px;border-bottom:1px solid #ece6d8}.axc-tbl td{padding:6px 4px;border-bottom:1px solid #f3efe4;vertical-align:top}.axc-tbl tr.on td{background:#eef4f8}.axc-tbl button{border:1px solid #d6d0c2;background:#fff;border-radius:99px;padding:3px 10px;font-size:12.5px;font-weight:700}'+
 '.axc-nt{background:#fff8e6;border:1px solid #f0d48a;border-radius:12px;padding:7px 10px;font-size:13px;margin-bottom:8px}'+
 '@media (max-width:760px){.axc{padding:12px 10px 10px;border-radius:16px}.axc-ti{grid-template-columns:repeat(3,minmax(0,1fr))}.axc-in{grid-template-columns:1fr}.axc-t b{font-size:21px}.axc-r{flex-wrap:wrap}.axc-rb{flex-direction:row;width:100%}.axc-rb button{flex:1}}'+
 '@media (max-width:420px){.axc-ti{grid-template-columns:repeat(2,minmax(0,1fr))}}';document.head.appendChild(s)}

/* ---------- البيانات ---------- */
var LD={};function need(src,v){if(LD[src])return LD[src];LD[src]=new Promise(function(ok){if(document.querySelector('script[src^="'+src+'"]'))return ok();var s=document.createElement('script');s.src=src+'?v='+v;s.onload=ok;s.onerror=ok;document.head.appendChild(s)});return LD[src]}
async function loadNeed(){try{for(var w=0;w<12&&!window.IDOUPD;w++)await new Promise(function(r){setTimeout(r,250)});await need('needx.js',10);if(!window.NEED)return;await NEED.refresh();var m={};(NEED.items()||[]).forEach(function(i){m[i.key]=i});S.need=m}catch(_){S.need={}}}
async function load(){if(S.busy)return;S.busy=true;S.err='';paint();
 try{var s=db();var r=await Promise.all([s.rpc('my_actions'),loadNeed()]);if(r[0].error)throw r[0].error;S.d=r[0].data||{};build();S.at=Date.now();badge()}catch(x){S.err=(x&&x.message)||String(x)}
 S.busy=false;paint();if(S.tab=='unit')loadTeam()}
function build(){var td=today(),d=S.d||{},snz=d.snz||{},cfg=d.cfg||{},pd=+cfg.push_days||3,L=[],seen={};
 (d.items||[]).forEach(function(i){if(seen[i.k])return;seen[i.k]=1;L.push(norm(i,td,snz,pd))});
 /* بنود تعرفها «مطلوب منك» ولا تعرفها قائمة الخادم (نادرًا) */
 Object.keys(S.need).forEach(function(k){if(seen[k])return;var x=S.need[k];if(x.kind=='fu')return;seen[k]=1;L.push(norm({k:k,t:x.kind,ti:x.t,sub:x.sub,pc:x.pc,pn:x.pj,due:x.due,since:x.age!=null?iso(td-x.age):null},td,snz,pd))});
 L.forEach(function(it){var n=S.need[it.k];if(n)it.run=function(){n.run(n)}});
 var rk={late:0,now:1,week:2,later:3,snz:4};L.sort(function(a,b){return rk[a.st]-rk[b.st]||b.w-a.w||((a.dd==null?9e9:a.dd)-(b.dd==null?9e9:b.dd))});S.L=L;
 Object.keys(S.sel).forEach(function(k){if(!seen[k])delete S.sel[k]})}
function norm(i,td,snz,pd){var dd=dn(i.due),sc=dn(i.since)||dn(i.first_at),w,st,z=snz[i.k]||i.snooze;
 if(dd!=null){w=td-dd;st=w>0?'late':w==0?'now':-w<=7?'week':'later'}else{w=sc!=null?td-sc:0;st=w>=pd?'late':'now'}
 if(z&&dn(z)>td)st='snz';var t=ty(i.t);
 return {k:i.k,t:i.t,ic:t[0],kl:T(t[1],t[2]),kc:t[3],ti:i.ti||'—',sub:i.sub||'',pc:i.pc||'',pn:i.pn||i.pc||'',dd:dd,sc:sc,w:w,st:st,snz:z&&dn(z)>td?z:null,url:i.url||'',raw:i,go:GO[i.t]?T(GO[i.t][0],GO[i.t][1]):T('فتح','Open')}}
function when(it){var td=today();if(it.st=='snz')return T('مؤجل إلى ','Snoozed to ')+fd(it.snz);
 if(it.dd!=null){var n=it.dd-td;return n<0?T('متأخر ','Late ')+DY(-n):n==0?T('مستحق اليوم','Due today'):T('خلال ','In ')+DY(n)+' · '+fd(it.dd)}
 return it.w>0?T('ينتظر منذ ','Waiting ')+DY(it.w):T('وصل اليوم','Arrived today')}
function badge(){try{var n=S.L.filter(function(i){return i.st!='snz'}).length;if('setAppBadge' in navigator){n?navigator.setAppBadge(n):navigator.clearAppBadge()}try{sessionStorage.setItem('ido_bdg',String(Date.now()))}catch(_){}}catch(_){}}

/* ---------- التصفية ---------- */
function ageB(it){return it.w>=7?'a3':it.w>=3?'a2':'a1'}
function pass(it,f){f=f||S.f;if(f.st){if(it.st!=f.st)return false}else if(it.st=='snz')return false;if(f.t&&it.t!=f.t)return false;if(f.pc&&it.pc!=f.pc)return false;if(f.age&&(it.w<=0||ageB(it)!=f.age))return false;return true}
function count(fn){return S.L.filter(fn).length}

/* ---------- العرض: المطلوب مني ---------- */
function brief(){var d=S.d||{},L=S.L.filter(function(i){return i.st!='snz'}),late=L.filter(function(i){return i.st=='late'}),now=L.filter(function(i){return i.st=='now'});
 var hr=+new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Dubai',hour:'numeric',hour12:false}).format(new Date());
 var nm='';try{nm=(typeof ME!='undefined'&&ME&&ME.full_name)?String(ME.full_name).split(/\s+/)[0]:''}catch(_){}
 var g=(hr<12?T('صباح الخير','Good morning'):T('مساء الخير','Good evening'))+(nm?T('، ',', ')+e(nm):'');
 var lines=[];
 if(!L.length)lines.push(T('لا يوجد ما ينتظر إجراءك الآن. 👏','Nothing is waiting for you right now. 👏'));
 else lines.push(T('مطلوب منك ','You have ')+'<b>'+T(N(L.length,'إجراء واحد','إجراءان','إجراءات','إجراءً'),L.length+' actions')+'</b>'+(late.length?T('، منها ',', ')+'<b>'+T(N(late.length,'إجراء متأخر','إجراءان متأخران','إجراءات متأخرة','إجراءً متأخرًا'),late.length+' late')+'</b>':'')+(now.length?T(' و',' and ')+T(N(now.length,'إجراء لليوم','إجراءان لليوم','إجراءات لليوم','إجراءً لليوم'),now.length+' for today'):'')+'.');
 var old=late.slice().sort(function(a,b){return b.w-a.w})[0],near=L.filter(function(i){return i.dd!=null&&i.dd>=today()}).sort(function(a,b){return a.dd-b.dd})[0];
 if(old)lines.push(T('أقدم المتأخر: ','Oldest late item: ')+'<b>'+e(old.ti)+'</b>'+(old.pn?' — '+e(old.pn):'')+' ('+e(when(old))+').');
 else if(near)lines.push(T('أقرب موعد: ','Next due: ')+'<b>'+e(near.ti)+'</b>'+(near.pn?' — '+e(near.pn):'')+' ('+e(when(near))+').');
 try{var nw=S.news&&S.news();if(nw&&nw.n)lines.push(T('منذ آخر زيارة: ','Since your last visit: ')+T(N(nw.n,'تنبيه جديد','تنبيهان جديدان','تنبيهات جديدة','تنبيهًا جديدًا'),nw.n+' new notifications')+(nw.top?T('، أكثرها في ',', mostly in ')+'<b>'+e(nw.top)+'</b>':'')+'.')}catch(_){}
 if(+d.done7)lines.push(T('أنجزت خلال 7 أيام ','Done in the last 7 days: ')+T(N(+d.done7,'بندًا واحدًا','بندين','بنود','بندًا'),d.done7)+(d.avg30!=null?T('، ومتوسط وقت الإنجاز ',', average time ')+e(String(d.avg30))+T(' يوم',' d'):'')+'.');
 return '<div class="axc-br"><p class="g">'+g+'</p>'+lines.map(function(l){return '<p>'+l+'</p>'}).join('')+'</div>'}
function tiles(){var d=S.d||{},c=function(st){return count(function(i){return i.st==st})};
 var X=[['late',c('late'),T('متأخرة','Late'),'#c0161f'],['now',c('now'),T('لليوم','Today'),'#a8761a'],['week',c('week'),T('هذا الأسبوع','This week'),'#1d5f8a'],['snz',c('snz'),T('مؤجلة','Snoozed'),'#5b6b7d'],['done',+d.done7||0,T('أنجزتها (7 أيام)','Done (7 d)'),'#0a6b3d']];
 return '<div class="axc-ti">'+X.map(function(x){return '<button type="button" class="axc-t'+(S.f.st==x[0]?' on':'')+'" style="--c:'+x[3]+'" data-st="'+x[0]+'"'+(x[0]=='done'?' disabled':'')+'><b>'+x[1]+'</b><span>'+e(x[2])+'</span></button>'}).join('')+'</div>'}
function bars(rows,key,cur,max,col){if(!rows.length)return '<div style="color:#8a8f96;font-size:13px">—</div>';max=max||Math.max.apply(null,rows.map(function(r){return r.n}));
 return rows.map(function(r){var lw=Math.round(100*(r.l||0)/max),w=Math.round(100*(r.n-(r.l||0))/max);return '<button type="button" class="axc-bar'+(cur==r.v?' on':'')+'" data-'+key+'="'+e(r.v)+'" title="'+e(r.lab)+'"><span class="axc-bl">'+e(r.lab)+'</span><span class="axc-bn">'+r.n+(r.l?'<small>· '+r.l+T(' متأخرة',' late')+'</small>':'')+'</span><span class="axc-bt"><i style="width:'+lw+'%;background:#c0161f"></i><i style="width:'+w+'%;background:'+(col||'#1d5f8a')+'"></i></span></button>'}).join('')}
function insights(){var base=S.L.filter(function(i){return pass(i,{st:S.f.st})}),bt={},bp={},ba={a1:0,a2:0,a3:0};
 base.forEach(function(i){var a=bt[i.t]=bt[i.t]||{v:i.t,lab:ty(i.t)[0]+' '+T(ty(i.t)[1],ty(i.t)[2]),n:0,l:0};a.n++;if(i.st=='late')a.l++;
  if(i.pc){var p=bp[i.pc]=bp[i.pc]||{v:i.pc,lab:i.pn||i.pc,n:0,l:0};p.n++;if(i.st=='late')p.l++}if(i.w>0)ba[ageB(i)]++});
 var srt=function(o){return Object.keys(o).map(function(k){return o[k]}).sort(function(a,b){return b.l-a.l||b.n-a.n})};
 var tp=srt(bt),pp=srt(bp),pk=S.show.pj?pp:pp.slice(0,6);
 var ag=[{v:'a1',lab:T('1–2 يوم','1–2 days'),n:ba.a1},{v:'a2',lab:T('3–6 أيام','3–6 days'),n:ba.a2},{v:'a3',lab:T('7 أيام فأكثر','7+ days'),n:ba.a3}];
 return '<div class="axc-in"><div class="axc-p"><h4>'+T('حسب النوع','By type')+'</h4>'+bars(S.show.ty?tp:tp.slice(0,6),'ft',S.f.t)+(tp.length>6?'<button type="button" class="axc-mo" data-more="ty">'+(S.show.ty?T('عرض أقل','Less'):T('كل الأنواع (','All types (')+tp.length+')')+'</button>':'')+'</div>'+
  '<div class="axc-p"><h4>'+T('حسب المشروع','By project')+'</h4>'+bars(pk,'fp',S.f.pc)+(pp.length>6?'<button type="button" class="axc-mo" data-more="pj">'+(S.show.pj?T('عرض أقل','Less'):T('كل المشاريع (','All projects (')+pp.length+')')+'</button>':'')+'</div>'+
  '<div class="axc-p"><h4>'+T('مدة التأخر أو الانتظار','How long it has waited')+'</h4>'+bars(ag,'fa',S.f.age,null,'#a8761a')+'</div></div>'}
function chips(){var f=S.f,X=[];if(f.st)X.push(['st',(ST.find(function(s){return s[0]==f.st})||[])[2]]);if(f.t)X.push(['t',T(ty(f.t)[1],ty(f.t)[2])]);if(f.pc){var it=S.L.find(function(i){return i.pc==f.pc});X.push(['pc',it?it.pn:f.pc])}
 if(f.age)X.push(['age',{a1:T('1–2 يوم','1–2 d'),a2:T('3–6 أيام','3–6 d'),a3:T('7 أيام فأكثر','7+ d')}[f.age]]);
 return X.length?'<div class="axc-fc">'+X.map(function(x){return '<button type="button" data-unf="'+x[0]+'">'+e(x[1])+' ✕</button>'}).join('')+(X.length>1?'<button type="button" data-unf="*">'+T('مسح الكل','Clear all')+'</button>':'')+'</div>':''}
function row(it){var cl=it.st=='late'?'l':it.st=='now'?'w':'';
 return '<div class="axc-r'+(it.st=='late'?' l':'')+'" style="--k:'+it.kc+'">'+(S.bulk?'<input type="checkbox" class="ck" data-sel="'+e(it.k)+'"'+(S.sel[it.k]?' checked':'')+' aria-label="'+T('تحديد','Select')+'">':'')+
  '<div class="axc-rm"><span class="axc-rk">'+it.ic+' '+e(it.kl)+'</span><b>'+e(it.ti)+'</b>'+(it.sub?'<small>'+e(it.sub)+'</small>':'')+
  '<small>'+(it.pn?'📁 '+e(it.pn):'')+'<span class="axc-chip '+(it.raw.esc_at?'e':cl)+'">'+e(when(it))+'</span>'+(it.raw.esc_at?'<span class="axc-chip e">'+T('ظاهر لمديرك','Visible to your manager')+'</span>':'')+'</small></div>'+
  '<div class="axc-rb"><button type="button" class="go" data-run="'+e(it.k)+'">'+e(it.go)+'</button><button type="button" data-snz="'+e(it.k)+'">⏰ '+(it.st=='snz'?T('التأجيل','Snooze'):T('أجّل','Snooze'))+'</button></div></div>'}
function list(){var V=S.L.filter(function(i){return pass(i)});if(!S.L.length)return '<div class="axc-em">✓ '+T('لا يوجد ما ينتظر إجراءك. ستظهر هنا المهام والقراءات والاعتمادات والتوقيعات المطلوبة منك.','Nothing is waiting. Tasks, readings, approvals and signatures that need you appear here.')+'</div>';
 if(!V.length)return '<div class="axc-em">'+T('لا توجد بنود بهذه التصفية.','No items match.')+'</div>';
 var h='',sel=Object.keys(S.sel).length,dap=Object.keys(S.sel).filter(function(k){return /^dap\|/.test(k)}).length;
 h+='<div class="axc-ac"><button type="button" data-bulk>'+(S.bulk?T('إلغاء التحديد','Cancel selection'):T('☑ تحديد عدة بنود','☑ Select several'))+'</button>'+(S.bulk?'<button type="button" data-selall>'+T('تحديد الظاهر','Select shown')+'</button>':'')+'<span class="sp"></span>'+
  (S.bulk&&sel?'<button type="button" data-bsnz>⏰ '+T('أجّل المحدد (','Snooze selected (')+sel+')</button>'+(dap?'<button type="button" class="pr" data-bdap>✅ '+T('اعتماد المخرجات المحددة (','Approve selected deliverables (')+dap+')</button>':''):'')+'</div>';
 ST.forEach(function(s){var G=V.filter(function(i){return i.st==s[0]});if(!G.length)return;var lim=S.open[s[0]]?G.length:(s[0]=='snz'?0:6),col=s[0]=='snz'&&!S.open.snz&&!S.f.st;
  h+='<button type="button" class="axc-sh" data-sec="'+s[0]+'">'+s[1]+' '+T(s[2],s[3])+' <small>('+G.length+')</small>'+(col?' <small>— '+T('اضغط للعرض','tap to show')+'</small>':'')+'</button>';
  if(S.f.st)lim=S.open[s[0]]?G.length:12;
  h+=G.slice(0,lim).map(row).join('');if(G.length>lim&&!(col))h+='<button type="button" class="axc-mo" data-sec="'+s[0]+'">'+T('عرض الكل (','Show all (')+G.length+')</button>'});
 return h}
function meH(){if(!S.d)return S.err?'<div class="axc-er">'+e(T('تعذّر التحميل: ','Could not load: ')+S.err)+'</div>':'<div class="axc-em">'+T('جارٍ تجميع ما ينتظر إجراءك…','Gathering what needs you…')+'</div>';
 return (S.err?'<div class="axc-er">'+e(S.err)+'</div>':'')+brief()+tiles()+insights()+chips()+list()}

/* ---------- العرض: وحدتي ---------- */
function unitLab(k){if(k=='C')return T('🏛️ المركز كاملًا','🏛️ Whole centre');var o=S.org||{},nm=function(a){return a?(Array.isArray(a)?(a[A()?0:1]||a[0]):a):''},p=String(k).split(':'),s=nm((o.sectors||[])[p[0]-1])||T('القطاع ','Sector ')+p[0];if(p.length==1)return s;var d=nm(((o.depts||[])[p[0]-1]||[])[p[1]-1])||T('الإدارة ','Dept ')+p[1];return p.length==2?s+' — '+d:d+' — '+p.slice(2).join(':')}
function unitList(){var d=S.d||{},u=(d.units||[]).slice();if(u.indexOf('C')>=0&&S.org){(S.org.sectors||[]).forEach(function(_,i){var k=String(i+1);if(u.indexOf(k)<0)u.push(k);((S.org.depts||[])[i]||[]).forEach(function(__,j){var k2=(i+1)+':'+(j+1);if(u.indexOf(k2)<0)u.push(k2)})})}return u}
async function loadOrg(){if(S.org)return;try{var r=await db().from('app_settings').select('value').eq('key','opt_lists').maybeSingle();S.org=r.data&&r.data.value?JSON.parse(r.data.value):{}}catch(_){S.org={}}}
async function loadTeam(){if(S.tbusy)return;S.tbusy=true;S.terr='';paint();try{await loadOrg();var r=await db().rpc('act_team',{p_unit:S.unit||null});if(r.error)throw r.error;S.team=r.data;S.unit=r.data.unit}catch(x){S.terr=(x&&x.message)||String(x)}S.tbusy=false;paint()}
function teamH(){var D=S.team;if(!D)return S.terr?'<div class="axc-er">'+e(T('تعذّر التحميل: ','Could not load: ')+S.terr)+'</div>':'<div class="axc-em">'+T('جارٍ تحميل بنود الوحدة…','Loading your unit…')+'</div>';
 var U=unitList(),f=S.tf||{},h='';
 if(U.length>1)h+='<div class="axc-us"><select data-unit aria-label="'+T('الوحدة','Unit')+'">'+U.map(function(k){return '<option value="'+e(k)+'"'+(k==D.unit?' selected':'')+'>'+e(unitLab(k))+'</option>'}).join('')+'</select></div>';
 if(D.esc_mgr===false)h+='<div class="axc-nt">'+T('ظهور البنود المتأخرة للمدير متوقف من الإعدادات؛ الأرقام هنا للاطلاع فقط.','Escalation to managers is turned off in settings; this view is for reference.')+'</div>';
 var ed=+D.esc_days||7;
 h+='<div class="axc-ti" style="grid-template-columns:repeat(4,minmax(0,1fr))">'+[[D.total,T('بنود مفتوحة','Open items'),'#14324a'],[D.late,T('متأخرة','Late'),'#c0161f'],[D.esc,T('متأخرة ','Late ')+DY(ed)+T(' فأكثر','+'),'#8a1019'],[(D.people||[]).length,T('أشخاص لديهم بنود','People with items'),'#1d5f8a']].map(function(x){return '<div class="axc-t" style="--c:'+x[2]+'"><b>'+(+x[0]||0)+'</b><span>'+e(x[1])+'</span></div>'}).join('')+'</div>';
 var P=D.people||[];
 h+='<div class="axc-p" style="margin-bottom:10px"><h4>'+T('الفريق','Team')+'</h4>'+(P.length?'<div style="overflow:auto"><table class="axc-tbl"><tr><th>'+T('الشخص','Person')+'</th><th>'+T('مفتوحة','Open')+'</th><th>'+T('متأخرة','Late')+'</th><th>'+T('تجاوزت ','Over ')+DY(ed)+'</th><th>'+T('الأقدم','Oldest')+'</th><th></th></tr>'+
  P.map(function(p){return '<tr class="'+(f.uid==p.id?'on':'')+'"><td><button type="button" data-tu="'+e(p.id)+'" style="border:0;background:none;padding:0;font-weight:800;color:#14324a;text-align:start">'+e(p.name)+'</button></td><td>'+p.n+'</td><td style="color:'+(p.late?'#c0161f':'inherit')+'">'+p.late+'</td><td>'+(p.esc?'<span class="axc-chip e">'+p.esc+'</span>':'0')+'</td><td>'+(p.oldest>0?DY(p.oldest):'—')+'</td><td><button type="button" data-nudge="'+e(p.id)+'" data-nm="'+e(p.name)+'">📨 '+T('تذكير','Remind')+'</button></td></tr>'}).join('')+'</table></div>':'<div style="color:#6b6f76;font-size:13px">'+T('لا يوجد أشخاص لك صلاحية على أدائهم في هذه الوحدة.','No people you have performance access to in this unit.')+'</div>')+
  (+D.others?'<div style="color:#6b6f76;font-size:12.5px;margin-top:6px">'+T('إضافة إلى ','Plus ')+T(N(+D.others,'بند واحد','بندين','بنود','بندًا'),D.others+' items')+T(' في مشاريع الوحدة لأشخاص خارج صلاحيتك، تظهر دون أسماء.',' in unit projects for people outside your access, shown without names.')+'</div>':'')+'</div>';
 var bt=D.bytype||{},tr=Object.keys(bt).map(function(k){return {v:k,lab:ty(k)[0]+' '+T(ty(k)[1],ty(k)[2]),n:bt[k]}}).sort(function(a,b){return b.n-a.n});
 var pr=(D.byproj||[]).map(function(p){return {v:p.pc,lab:p.pn||p.pc,n:p.n,l:p.late}});
 h+='<div class="axc-in" style="grid-template-columns:repeat(2,minmax(0,1fr))"><div class="axc-p"><h4>'+T('حسب النوع','By type')+'</h4>'+bars(tr,'tt',f.t)+'</div><div class="axc-p"><h4>'+T('حسب المشروع','By project')+'</h4>'+bars(S.show.tp?pr:pr.slice(0,8),'tp',f.pc)+(pr.length>8?'<button type="button" class="axc-mo" data-more="tp">'+(S.show.tp?T('عرض أقل','Less'):T('كل المشاريع (','All projects (')+pr.length+')')+'</button>':'')+'</div></div>';
 var X=[];if(f.uid){var pp=P.find(function(p){return p.id==f.uid});X.push(['uid',pp?pp.name:''])}if(f.t)X.push(['t',T(ty(f.t)[1],ty(f.t)[2])]);if(f.pc){var q=(D.byproj||[]).find(function(p){return p.pc==f.pc});X.push(['pc',q?q.pn:f.pc])}if(f.esc)X.push(['esc',T('المتأخرة كثيرًا','Long overdue')]);
 if(X.length)h+='<div class="axc-fc">'+X.map(function(x){return '<button type="button" data-tunf="'+x[0]+'">'+e(x[1])+' ✕</button>'}).join('')+'</div>';
 var I=(D.items||[]).filter(function(i){return (!f.uid||i.uid==f.uid)&&(!f.t||i.t==f.t)&&(!f.pc||i.pc==f.pc)&&(!f.esc||i.esc)});
 h+='<div class="axc-ac"><button type="button" data-tesc class="'+(f.esc?'pr':'')+'">⚠️ '+T('المتأخرة ','Late ')+DY(ed)+T(' فأكثر فقط','+ only')+'</button><span class="sp"></span><span style="color:#6b6f76;font-size:12.5px">'+(D.synced?T('تُحدَّث كل 30 دقيقة · آخر تحديث ','Refreshed every 30 min · last ')+new Date(D.synced).toLocaleTimeString(A()?'ar-AE':'en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Dubai'}):'')+'</span></div>';
 var lim=S.open.team?I.length:20;
 h+=I.length?I.slice(0,lim).map(function(i){var t=ty(i.t),w=+i.wait||0;return '<div class="axc-r'+(w>0?' l':'')+'" style="--k:'+t[3]+'"><div class="axc-rm"><span class="axc-rk">'+t[0]+' '+e(T(t[1],t[2]))+'</span><b>'+e(i.ti||'—')+'</b><small>'+(i.who?'👤 '+e(i.who)+' · ':'👤 '+T('شخص خارج صلاحيتك','Someone outside your access')+' · ')+(i.pn?'📁 '+e(i.pn):'')+
   '<span class="axc-chip '+(i.esc?'e':w>0?'l':'')+'">'+(w>0?T('متأخر ','Late ')+DY(w):w==0?T('اليوم','Today'):T('خلال ','In ')+DY(-w))+'</span></small></div></div>'}).join('')+(I.length>lim?'<button type="button" class="axc-mo" data-sec="team">'+T('عرض الكل (','Show all (')+I.length+')</button>':''):'<div class="axc-em">'+T('لا توجد بنود مفتوحة في هذه الوحدة. 👏','No open items in this unit. 👏')+'</div>';
 return h}

/* ---------- الرسم ---------- */
var HOST=null;
function paint(){if(!HOST||!HOST.isConnected)return;var d=S.d||{},can=(d.units||[]).length>0,n=S.L.filter(function(i){return i.st!='snz'}).length;if(!can&&S.tab=='unit')S.tab='me';
 var h='<div class="axc-h"><b>📌 '+T('مركز الإجراءات','Action centre')+'</b>'+(can?'<span class="axc-tb" role="tablist"><button type="button" role="tab" data-tab="me" class="'+(S.tab=='me'?'on':'')+'">'+T('المطلوب مني','Needs me')+(n?'<i>'+n+'</i>':'')+'</button><button type="button" role="tab" data-tab="unit" class="'+(S.tab=='unit'?'on':'')+'">👥 '+T('وحدتي','My unit')+'</button></span>':'')+
  '<button type="button" class="axc-rf" data-rf title="'+T('تحديث','Refresh')+'">'+(S.busy||S.tbusy?'⏳':'⟳')+'</button></div>';
 h+=S.tab=='unit'?teamH():meH();
 if(HOST.__h!==h){HOST.innerHTML=h;HOST.__h=h}}
function mount(el,o){css();if(!el)return;HOST=el;el.classList.add('axc');el.setAttribute('aria-label',T('مركز الإجراءات','Action centre'));if(o&&o.news)S.news=o.news;
 if(!el.__axc){el.__axc=1;el.addEventListener('click',onClick);el.addEventListener('change',onChange)}
 el.__h=null;paint();if(!S.d&&!S.busy)load()}

/* ---------- التفاعل ---------- */
function find(k){return S.L.find(function(i){return i.k==k})}
function onChange(ev){var t=ev.target;if(t.matches('[data-sel]')){if(t.checked)S.sel[t.dataset.sel]=1;else delete S.sel[t.dataset.sel];paint();return}
 if(t.matches('[data-unit]')){S.unit=t.value;S.team=null;S.tf={};loadTeam()}}
function onClick(ev){var t=ev.target.closest('button');if(!t||!HOST.contains(t))return;var D=t.dataset;
 if(D.tab){S.tab=D.tab;try{history.replaceState(null,'',location.pathname+location.search+(S.tab=='unit'?'#unit':''))}catch(_){}paint();if(S.tab=='unit'&&!S.team)loadTeam();return}
 if('rf' in D){if(S.tab=='unit'){S.team=null;loadTeam()}else load();return}
 if(D.st){S.f.st=S.f.st==D.st?'':D.st;S.open={};paint();return}
 if(D.ft!=null){S.f.t=S.f.t==D.ft?'':D.ft;paint();return}if(D.fp!=null){S.f.pc=S.f.pc==D.fp?'':D.fp;paint();return}if(D.fa!=null){S.f.age=S.f.age==D.fa?'':D.fa;paint();return}
 if(D.unf){if(D.unf=='*')S.f={};else S.f[D.unf]='';paint();return}
 if(D.more){S.show[D.more]=!S.show[D.more];paint();return}
 if(D.sec){S.open[D.sec]=!S.open[D.sec];paint();return}
 if('bulk' in D){S.bulk=!S.bulk;if(!S.bulk)S.sel={};paint();return}
 if('selall' in D){S.L.filter(function(i){return pass(i)}).forEach(function(i){S.sel[i.k]=1});paint();return}
 if('bsnz' in D){snzMenu(t,Object.keys(S.sel));return}
 if('bdap' in D){bulkDap();return}
 if(D.run){var it=find(D.run);if(it)run(it);return}
 if(D.snz){var it2=find(D.snz);if(it2)snzMenu(t,[it2.k],it2.st=='snz');return}
 if(D.tt!=null){S.tf=S.tf||{};S.tf.t=S.tf.t==D.tt?'':D.tt;paint();return}if(D.tp!=null){S.tf=S.tf||{};S.tf.pc=S.tf.pc==D.tp?'':D.tp;paint();return}
 if(D.tu){S.tf=S.tf||{};S.tf.uid=S.tf.uid==D.tu?'':D.tu;paint();return}if(D.tunf){S.tf[D.tunf]='';paint();return}if('tesc' in D){S.tf=S.tf||{};S.tf.esc=!S.tf.esc;paint();return}
 if(D.nudge){nudge(D.nudge,D.nm);return}}

/* تأجيل */
function closePop(){var p=document.getElementById('axcpp');if(p)p.remove();document.removeEventListener('click',outPop,true)}
function outPop(ev){var p=document.getElementById('axcpp');if(p&&!p.contains(ev.target))closePop()}
function nextMon(td){var d=new Date(td*864e5),w=d.getUTCDay(),k=(8-w)%7||7;return td+k}
function snzMenu(btn,keys,isS){closePop();var td=today(),O=[[td+1,T('غدًا','Tomorrow')],[td+2,T('بعد يومين','In 2 days')],[nextMon(td),T('الاثنين القادم','Next Monday')],[td+7,T('بعد أسبوع','In a week')]];var sn={};O=O.filter(function(o){if(sn[o[0]])return false;sn[o[0]]=1;return true});
 var p=document.createElement('div');p.id='axcpp';p.className='axc-pp';p.dir=A()?'rtl':'ltr';p.setAttribute('role','menu');
 p.innerHTML='<div style="padding:6px 10px;color:#6b6f76;font-size:12.5px">'+(keys.length>1?T('تأجيل ','Snooze ')+keys.length+T(' بنود حتى:',' items until:'):T('أجّل حتى:','Snooze until:'))+'</div>'+O.map(function(o){return '<button type="button" data-d="'+iso(o[0])+'">'+e(o[1])+' <small style="color:#8a8f96">'+fd(o[0])+'</small></button>'}).join('')+(isS?'<button type="button" data-d="">↺ '+T('إلغاء التأجيل','Unsnooze')+'</button>':'');
 document.body.appendChild(p);var r=btn.getBoundingClientRect(),W=p.offsetWidth,H=p.offsetHeight;var x=Math.min(window.innerWidth-W-8,Math.max(8,(A()?r.left:r.right-W))),y=r.bottom+6;if(y+H>window.innerHeight-8)y=Math.max(8,r.top-H-6);p.style.left=x+'px';p.style.top=y+'px';
 p.addEventListener('click',async function(ev){var b=ev.target.closest('button');if(!b)return;var d=b.dataset.d||null;closePop();
  var r2=await db().rpc('act_snooze',{p_keys:keys,p_until:d});if(r2.error){alert(r2.error.message);return}
  S.d.snz=S.d.snz||{};keys.forEach(function(k){if(d)S.d.snz[k]=d;else delete S.d.snz[k];var it=find(k);if(it)it.raw.snooze=d});S.sel={};S.bulk=false;build();badge();paint()});
 setTimeout(function(){document.addEventListener('click',outPop,true)},0)}

/* تنفيذ */
function ov(ttl,sub,body,foot,wide){closeOv();var o=document.createElement('div');o.id='axcov';o.className='axc-ov';o.dir=A()?'rtl':'ltr';
 o.innerHTML='<div class="axc-dl'+(wide?' wd':'')+'" role="dialog" aria-modal="true"><div class="axc-dh"><div><b>'+ttl+'</b><small>'+e(sub||'')+'</small></div><button type="button" data-x>✕ '+T('إغلاق','Close')+'</button></div>'+body+(foot?'<div class="axc-df">'+foot+'</div>':'')+'</div>';
 o.addEventListener('click',function(ev){if(ev.target===o||ev.target.closest('[data-x]'))closeOv(true)});document.body.appendChild(o);document.addEventListener('keydown',escK,true);return o}
function escK(ev){if(ev.key=='Escape')closeOv(true)}
function closeOv(re){var o=document.getElementById('axcov');if(o){o.remove();document.removeEventListener('keydown',escK,true);if(re)setTimeout(load,300)}}
function frame(it){var o=ov(it.ic+' '+e(it.kl),it.pn+(it.ti?' — '+it.ti:''),'<iframe class="axc-fr" title="'+e(it.kl)+'"></iframe>','<a href="'+e(it.url)+'">'+T('فتح في صفحة كاملة','Open full page')+'</a>',true),f=o.querySelector('iframe');
 f.onload=function(){try{var dd=f.contentDocument,st=dd.createElement('style');st.textContent='#hd,#hd2,header.top,#gnav,.top,footer,#pgban{display:none!important}body{padding-top:0!important}main{margin-top:0!important}';dd.head.appendChild(st)}catch(_){}};f.src=it.url}
function taskOpen(it){var r=it.raw,cur=Math.round(+r.tpc||0),v=cur;
 var o=ov('✅ '+T('تحديث إنجاز المهمة','Update task progress'),it.pn,'<div class="axc-db"><b style="font-size:15px">'+e(it.ti)+'</b><div style="color:#6b6f76;font-size:13px;margin-bottom:6px">'+e(when(it))+' · '+T('الإنجاز الحالي ','Current ')+cur+'%</div>'+
  '<div class="axc-pc">'+[0,25,50,75,100].map(function(p){return '<button type="button" data-p="'+p+'" class="'+(p==cur?'on':'')+'">'+p+'%</button>'}).join('')+'</div>'+
  '<label style="font-size:13px;color:#6b6f76">'+T('أو اكتب النسبة','Or type a value')+'</label><input type="number" min="0" max="100" id="axcpv" value="'+cur+'">'+
  '<label style="font-size:13px;color:#6b6f76;display:block;margin-top:8px">'+T('ملاحظة (اختيارية)','Note (optional)')+'</label><textarea id="axcnt" rows="2"></textarea></div>',
  '<button type="button" class="ok" data-save>💾 '+T('حفظ','Save')+'</button><button type="button" data-done>✔ '+T('أنجزت المهمة','Mark as done')+'</button><a href="'+e(it.url)+'">'+T('فتح في مهامي','Open in My tasks')+'</a>');
 var inp=o.querySelector('#axcpv');o.querySelectorAll('[data-p]').forEach(function(b){b.onclick=function(){v=+b.dataset.p;inp.value=v;o.querySelectorAll('[data-p]').forEach(function(x){x.classList.toggle('on',x==b)})}});inp.oninput=function(){v=Math.max(0,Math.min(100,+inp.value||0))};
 var save=async function(p){o.querySelectorAll('.axc-df button').forEach(function(b){b.disabled=true});var d=dubai(),as=r.as||(p>0?d:null),ae=p>=100?(r.ae||d):null,nt=(o.querySelector('#axcnt').value||'').trim()||null;
  var x=await db().rpc('set_task_progress',{pid:+r.pid,tid:String(r.tid),p_pc:p,p_as:as,p_ae:ae,p_note:nt});if(x.error){o.querySelectorAll('.axc-df button').forEach(function(b){b.disabled=false});alert(x.error.message);return}closeOv(true)};
 o.querySelector('[data-save]').onclick=function(){save(Math.round(v))};o.querySelector('[data-done]').onclick=function(){save(100)}}
function run(it){if(it.run){try{it.run();var t=setInterval(function(){if(!document.getElementById('ndov')&&!document.getElementById('decov')&&!document.getElementById('upw')){clearInterval(t);setTimeout(load,400)}},900)}catch(x){alert(x.message||x)}return}
 if(it.t=='task')return taskOpen(it);if(it.url)return frame(it)}
async function bulkDap(){var ks=Object.keys(S.sel).filter(function(k){return /^dap\|/.test(k)});if(!ks.length)return;
 if(!confirm(T('اعتماد '+N(ks.length,'مخرَج واحد','مخرَجين','مخرجات','مخرَجًا')+' دفعة واحدة؟ راجع الملفات قبل الاعتماد إن لم تكن قد اطلعت عليها.','Approve '+ks.length+' deliverables at once?')))return;
 var bad=0;for(var i=0;i<ks.length;i++){var id=+ks[i].split('|')[1];var r=await db().rpc('deliv_decide',{p_id:id,p_ok:true,p_note:null});if(r.error)bad++}
 S.sel={};S.bulk=false;if(bad)alert(T('تعذّر اعتماد ','Could not approve ')+bad);load()}
async function nudge(uid,nm){var m=prompt(T('رسالة تذكير إلى ','Reminder to ')+(nm||'')+':',T('تذكير ودّي: لديك بنود متأخرة في مركز الإجراءات، أرجو متابعتها.','Friendly reminder: you have overdue items in the Action centre.'));if(!m||!m.trim())return;
 var r=await db().rpc('perf_nudge',{p_user:uid,p_msg:m.trim()});if(r.error)alert(r.error.message);else alert(T('أُرسل التذكير.','Reminder sent.'))}

window.AXC={mount:mount,load:load,items:function(){return S.L},tab:function(t){S.tab=t;paint();if(t=='unit'&&!S.team)loadTeam()}};
(function(){var w=document.getElementById('axw');if(w&&!w.__axc)mount(w,window.__axcO||{})})();
document.addEventListener('visibilitychange',function(){if(!document.hidden&&HOST&&HOST.isConnected&&Date.now()-S.at>120000)load()});
})();
