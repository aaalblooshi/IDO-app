/* مراجعة الاحتساب: ما يُحسب على المشروع في المؤشرات، وقرار مكتب التطوير المؤسسي باستبعاده أو احتسابه — window.REV */
(function(){
var A=function(){return (document.documentElement.lang||'ar')!='en'},T=function(a,b){return A()?a:b};
var e=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
function fd(d){if(!d)return '';var m=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(d));return m?(+m[3])+'/'+(+m[2])+'/'+m[1]:''}
function client(){try{return window.sb||(typeof sb!=='undefined'?sb:null)}catch(_){return window.sb||null}}
var KN={scope_add:['مهمة مضافة بعد خط الأساس','Task added after baseline'],scope_del:['مهمة محذوفة من خط الأساس','Task removed from baseline'],scope_chg:['تغيّر كبير في المدة','Large duration change'],scope_ms:['معلم متأخر عن خط الأساس','Baseline milestone late'],late:['تأخير مهمة','Task delay'],q_ret:['مخرَج أُعيد للتعديل','Deliverable returned'],q_miss:['مهمة مستحقة بلا مخرَج معتمد','Due task without approved deliverable'],q_late:['مخرَج اعتُمد بعد موعده','Deliverable approved late'],kpi:['قراءة مؤشر','KPI reading'],q_slow:['مخرَج تأخر اعتماده','Slow approval'],q_wait:['مخرَج معلّق أكثر من 7 أيام','Pending over 7 days']};
var IC={scope_add:'➕',scope_del:'➖',scope_chg:'↔️',scope_ms:'🚩',late:'⏰',q_ret:'↩️',q_miss:'📭',q_late:'🐢',kpi:'📈',q_slow:'⏳',q_wait:'📥'};
var S={pc:null,d:null,f:'pend',q:null,qf:'',hist:{}};
function css(){if(document.getElementById('revcss'))return;var s=document.createElement('style');s.id='revcss';s.textContent=
 '.rvw .rvh{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap}.rvw h3{margin:0;font-size:17px}.rvw .rvs{color:#6b6f76;font-size:13px;line-height:1.7;margin:4px 0 8px}'+
 '.rvf{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}.rvf button{font:inherit;font-size:13px;font-weight:700;border:1px solid #dcd6c8;background:#fff;border-radius:99px;padding:5px 12px;cursor:pointer;color:#23272b}.rvf button.on{background:#14324a;border-color:#14324a;color:#fff}.rvf i{font-style:normal;opacity:.75;margin-inline-start:4px}'+
 '.rvg{margin-top:10px}.rvg>b{display:block;font-size:14px;margin:8px 0 4px;color:#14324a}'+
 '.rvi{border:1px solid #e8e2d4;border-radius:12px;padding:10px 12px;margin:6px 0;background:#fff;border-inline-start:4px solid #c9cfd6}.rvi.p{border-inline-start-color:#a8761a;background:#fffdf7}.rvi.x{border-inline-start-color:#0a6b3d}.rvi.c{border-inline-start-color:#d1101d}'+
 '.rvt{display:flex;gap:8px;align-items:flex-start;flex-wrap:wrap}.rvt .n{flex:1;min-width:180px;font-weight:700;font-size:14px;line-height:1.5}.rvt .n small{display:block;font-weight:400;color:#6b6f76;font-size:12.5px}'+
 '.rvp{display:inline-block;border-radius:99px;padding:1px 10px;font-size:12px;font-weight:800;white-space:nowrap}.rvp.p{background:#fff4dc;color:#8a5a00}.rvp.x{background:#e5f2ea;color:#0a6b3d}.rvp.c{background:#fdecee;color:#d1101d}.rvp.r{background:#eef4fb;color:#1d5f8a}'+
 '.rvm{font-size:12.5px;color:#4b5158;margin-top:6px;line-height:1.7}.rvm q{quotes:"«" "»";color:#23272b}.rva{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.rva button{font:inherit;font-size:12.5px;font-weight:700;border-radius:99px;padding:5px 12px;cursor:pointer;border:1px solid #dcd6c8;background:#fff;color:#23272b}'+
 '.rva .ok{background:#0a6b3d;border-color:#0a6b3d;color:#fff}.rva .no{background:#fff;border-color:#d1101d;color:#d1101d}.rva .rq{background:#1d5f8a;border-color:#1d5f8a;color:#fff}'+
 '.rvc summary{cursor:pointer;font-weight:700;font-size:14px;color:#14324a;padding:6px 0}.rvc .rvi{background:#fafbfc}.rve{color:#6b6f76;font-size:13px;padding:8px 0}.rvhl{margin:6px 0 0;padding-inline-start:18px;font-size:12px;color:#4b5158}.rvpj{display:flex;justify-content:space-between;gap:8px;align-items:center;margin:14px 0 4px;flex-wrap:wrap}.rvpj b{font-size:15px}.rvpj a{font-size:13px;font-weight:700;color:#1d5f8a;text-decoration:none}'+
 '.rvmo{position:fixed;inset:0;z-index:2147483000;background:rgba(15,23,32,.45);display:flex;align-items:center;justify-content:center;padding:16px}.rvmo>div{background:#fff;border-radius:18px;max-width:520px;width:100%;padding:18px;box-shadow:0 14px 40px rgba(0,0,0,.22);display:flex;flex-direction:column;gap:10px;max-height:calc(100dvh - 32px);overflow:auto}'+
 '.rvmo h4{margin:0;font-size:16px;line-height:1.6}.rvmo p{margin:0;color:#4b5158;font-size:13px;line-height:1.7}.rvmo label{font-size:13px;font-weight:700}.rvmo textarea,.rvmo input{font:inherit;font-size:15px;width:100%;box-sizing:border-box;border:1px solid #d6d9de;border-radius:12px;padding:9px 12px}.rvmo textarea{min-height:96px;resize:vertical}'+
 '.rvmo .rv-ft{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap}.rvmo button{font:inherit;font-weight:700;font-size:14px;border-radius:99px;padding:8px 18px;cursor:pointer;border:1px solid #d6d9de;background:#fff}.rvmo .rv-go{background:#14324a;border-color:#14324a;color:#fff}.rvmo .rv-er{color:#d1101d;font-size:13px;min-height:1em}'+
 '.rvlk{color:#14324a;text-decoration:underline;text-decoration-color:#c9b78f;text-underline-offset:3px}.rvlk:hover{color:#1d5f8a}'+
 '.rvmo button{font:inherit!important;font-size:14px!important;font-weight:700!important;line-height:1.4!important;border-radius:99px!important;padding:8px 16px!important;min-height:0!important;width:auto!important;display:inline-flex!important;align-items:center;gap:6px;white-space:nowrap}.rvmo .rv-ft{align-items:center}'+
 '.rvmo>div.wd{max-width:760px}.rvx h5{margin:12px 0 6px;font-size:14px;color:#14324a}.rvx .rv-wh{background:#f6f3ea;border-radius:12px;padding:10px 12px;font-size:14px;line-height:1.9;color:#23272b}'+
 '.rvx dl{display:grid;grid-template-columns:auto 1fr;gap:3px 14px;margin:0;font-size:13.5px}.rvx dt{color:#6b6f76}.rvx dd{margin:0;font-weight:700}.rvx .rv-tk{border:1px solid #e8e2d4;border-radius:12px;padding:10px 12px}'+
 '.rvx table{width:100%;border-collapse:collapse;font-size:13.5px}.rvx th,.rvx td{padding:7px 8px;border-bottom:1px solid #eee7d8;text-align:start}.rvx th{color:#6b6f76;font-weight:700;font-size:12.5px}.rvx td.v{font-variant-numeric:tabular-nums;font-weight:800;white-space:nowrap}.rvx tr.rv-tot td{background:#faf8f3}'+
 '.rvx .rv-up{color:#0a6b3d}.rvx .rv-dn{color:#d1101d}.rvx .rv-opt{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px}.rvx .rv-opt>div{border:1px solid #e8e2d4;border-radius:12px;padding:10px 12px;font-size:13px;line-height:1.8}.rvx .rv-opt b{display:block;font-size:14px;margin-bottom:2px}.rvx .rv-opt .rv-ex{border-color:#0a6b3d;background:#f3faf5}.rvx .rv-opt .rv-ct{border-color:#e6b8bc;background:#fff8f8}'+
 '@media(max-width:560px){.rvx .rv-opt{grid-template-columns:1fr}}'+
 '@media(max-width:560px){.rvmo{align-items:flex-end;padding:0}.rvmo>div{border-radius:18px 18px 0 0;padding-bottom:calc(18px + env(safe-area-inset-bottom))}}';
 document.head.appendChild(s)}
/* نافذة: سبب + (اختياريًا) تاريخ */
function ask(o){css();return new Promise(function(res){var w=document.createElement('div');w.className='rvmo';w.dir=A()?'rtl':'ltr';
 w.innerHTML='<div role="dialog" aria-modal="true"><h4></h4>'+(o.sub?'<p class="rv-sb"></p>':'')+(o.date?'<label>'+T('الموعد الجديد','New due date')+'<input type="date" class="rv-dt"></label>':'')+'<label>'+e(o.lbl||T('السبب','Reason'))+'<textarea class="rv-rs" placeholder="'+e(o.ph||'')+'"></textarea></label><div class="rv-er"></div><div class="rv-ft"><button type="button" class="rv-cx">'+T('إلغاء','Cancel')+'</button><button type="button" class="rv-go"></button></div></div>';
 w.querySelector('h4').textContent=o.title;if(o.sub)w.querySelector('.rv-sb').textContent=o.sub;w.querySelector('.rv-go').textContent=o.ok||T('تأكيد','Confirm');
 var ta=w.querySelector('.rv-rs'),dt=w.querySelector('.rv-dt'),er=w.querySelector('.rv-er');ta.value=o.def||'';if(dt){dt.value=o.dateDef||'';if(o.dateMin)dt.min=o.dateMin}
 function end(v){document.removeEventListener('keydown',kd,true);w.remove();res(v)}
 function kd(ev){if(ev.key=='Escape'){ev.preventDefault();end(null)}}
 w.querySelector('.rv-cx').onclick=function(){end(null)};w.addEventListener('click',function(ev){if(ev.target===w)end(null)});
 w.querySelector('.rv-go').onclick=function(){var r=ta.value.trim();if(o.req!==false&&r.length<3){er.textContent=T('اكتب السبب (ثلاثة أحرف على الأقل).','Write the reason (at least 3 characters).');ta.focus();return}
  if(dt&&!dt.value){er.textContent=T('حدد الموعد الجديد.','Pick the new date.');return}end({reason:r,date:dt?dt.value:null})};
 document.addEventListener('keydown',kd,true);document.body.appendChild(w);setTimeout(function(){(dt&&!dt.value?dt:ta).focus()},40)})}
function toast(m,bad){var t=document.createElement('div');t.textContent=m;t.style.cssText='position:fixed;bottom:calc(84px + env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);z-index:2147483001;background:'+(bad?'#d1101d':'#14324a')+';color:#fff;padding:10px 16px;border-radius:12px;font:700 14px Cairo,system-ui,sans-serif;max-width:90vw;box-shadow:0 6px 20px rgba(0,0,0,.25)';document.body.appendChild(t);setTimeout(function(){t.remove()},3800)}
function st(x){return x.dec=='excl'?'x':x.dec=='count'?'c':'p'}
function stLbl(x){return x.dec=='excl'?T('مستبعد من الحساب','Excluded'):x.dec=='count'?T('يُحتسب','Counted'):x.req_at?T('طلب استبعاد بانتظار المكتب','Exclusion requested'):T('بانتظار مراجعة المكتب','Awaiting office review')}
function detail(x){var i=x.info||{},k=x.kind;
 if(k=='scope_add')return T('أُضيفت بعد خط الأساس','Added after baseline')+(i.s?' · '+fd(i.s)+' ← '+fd(i.e):'')+(i.dur?' · '+i.dur+T(' يومًا',' days'):'');
 if(k=='scope_del')return T('كانت في خط الأساس وحُذفت','In the baseline, now removed')+(i.s?' · '+fd(i.s)+' ← '+fd(i.e):'')+(i.dur?' · '+i.dur+T(' يومًا',' days'):'');
 if(k=='scope_chg')return T('المدة ','Duration ')+i.db+' ← '+i.dc+T(' يومًا',' days')+(i.e0?' · '+T('النهاية ','end ')+fd(i.e0)+' ← '+fd(i.e):'');
 if(k=='scope_ms')return T('موعده في خط الأساس ','Baseline due ')+fd(i.e)+' · '+T('الإنجاز ','progress ')+Math.round(+i.pc||0)+'%';
 if(k=='late')return T('الموعد ','Due ')+fd(i.e0||i.e)+(i.ne?' · '+T('الموعد المقترح ','Proposed ')+fd(i.ne):'')+(i.applied?' · '+T('مُدّد إلى ','Extended to ')+fd(i.applied):'');
 if(k=='q_ret')return T('أُعيد ','Returned ')+fd(i.dec_at)+(i.by?' · '+e(i.by):'')+(i.note?' · «'+e(i.note)+'»':'');
 if(k=='q_late')return T('اعتُمد ','Approved ')+fd(i.dec_at)+(i.due?' · '+T('موعده ','due ')+fd(i.due):'');
 if(k=='q_slow'||k=='q_wait')return T('رُفع ','Submitted ')+fd(i.at)+(i.dec_at?' · '+T('القرار ','decided ')+fd(i.dec_at):'')+(i.days!=null?' · '+i.days+T(' يومًا',' days'):'');
 if(k=='q_miss')return T('موعد المهمة ','Task due ')+fd(i.e);
 if(k=='kpi')return T('الفترة ','Period ')+e(i.period)+' · '+T('الفعلي ','actual ')+e(i.actual)+(i.target!=null?' / '+e(i.target):'');
 return ''}
function row(x,o){var s=st(x),i=x.info||{};var h='<div class="rvi '+s+'" data-id="'+x.id+'"><div class="rvt"><span style="font-size:18px">'+(IC[x.kind]||'•')+'</span><div class="n"><a href="#" class="rvlk" data-a="why">'+e(x.label||'—')+'</a><small>'+e(T(KN[x.kind][0],KN[x.kind][1]))+' · '+detail(x)+'</small></div><span class="rvp '+(s=='p'&&x.req_at?'r':s)+'">'+stLbl(x)+'</span></div>';
 var m=[];if(i.by)m.push(T('أجرى التغيير: ','Changed by: ')+e(i.by)+(i.at?' — '+fd(i.at):''));
 if(x.req_at)m.push(T('طلب الاستبعاد: ','Exclusion request: ')+e(x.req_name||'')+' — '+fd(x.req_at)+(x.req_reason?' — <q>'+e(x.req_reason)+'</q>':''));
 if(x.dec)m.push((x.dec=='excl'?T('قرار المكتب: استبعاد','Office decision: exclude'):T('قرار المكتب: احتساب','Office decision: count'))+' — '+e(x.dec_name||'')+' '+fd(x.dec_at)+(x.dec_reason?' — <q>'+e(x.dec_reason)+'</q>':''));
 if(o.pj)m.unshift('<b>'+e(x.pname||x.pcode)+'</b>');
 if(m.length)h+='<div class="rvm">'+m.join('<br>')+'</div>';
 var b=[];if(o.office){if(!x.dec){b.push('<button class="ok" data-a="why">'+T('🔍 التفاصيل والقرار','🔍 Details & decide')+'</button>')}else b.push('<button data-a="why">'+T('🔍 التفاصيل وتغيير القرار','🔍 Details / change decision')+'</button>')}
 else{b.push('<button data-a="why">'+T('🔍 التفاصيل والأثر','🔍 Details & impact')+'</button>');}
 if(!o.office&&o.can){if(!x.dec&&!x.req_at)b.push('<button class="rq" data-a="req">'+T('طلب استبعاد','Request exclusion')+'</button>');else if(x.dec=='count')b.push('<button class="rq" data-a="req">'+T('طلب مراجعة مجددًا','Ask again')+'</button>')}
 b.push('<button data-a="hist">'+T('السجل','History')+'</button>');
 h+='<div class="rva">'+b.join('')+'</div>'+(S.hist[x.id]?'<ul class="rvhl">'+S.hist[x.id]+'</ul>':'')+'</div>';return h}
function cand(k,c,o){return '<div class="rvi" data-ck="'+k+'" data-ref="'+e(c.ref)+'"><div class="rvt"><span style="font-size:18px">'+IC[k]+'</span><div class="n">'+e(c.n)+'<small>'+(k=='late'?T('موعدها ','Due ')+fd(c.e)+' · '+T('متأخرة ','late ')+c.days+T(' يومًا',' days')+' · '+T('الإنجاز ','progress ')+Math.round(+c.pc||0)+'%':k=='q_ret'?T('أُعيد ','Returned ')+fd(c.at)+(c.by?' · '+e(c.by):'')+(c.note?' · «'+e(c.note)+'»':''):k=='q_late'?T('اعتُمد ','Approved ')+fd(c.at)+' · '+T('موعده ','due ')+fd(c.due):k=='q_slow'?T('رُفع ','Submitted ')+fd(c.at)+' · '+T('القرار بعد ','decided after ')+c.days+T(' يومًا',' days'):k=='q_wait'?T('رُفع ','Submitted ')+fd(c.at)+' · '+T('ينتظر منذ ','waiting ')+c.days+T(' يومًا',' days'):T('موعد المهمة ','Task due ')+fd(c.e))+'</small></div></div><div class="rva">'+
 (o.office?'<button class="ok" data-c="excl">'+(k=='late'?T('عذر التأخير وتمديد الموعد','Excuse and extend'):T('استبعاد من الحساب','Exclude'))+'</button>':'')+(!o.office&&o.can?'<button class="rq" data-c="req">'+(k=='late'?T('طلب عذر وتمديد','Request excuse'):T('طلب استبعاد','Request exclusion'))+'</button>':'')+'</div></div>'}
async function rpc(n,a){var c=client();if(!c)throw new Error('no client');var r=await c.rpc(n,a);if(r.error)throw r.error;return r.data}
function err(x){return String((x&&x.message)||x).replace(/^.*?:\s*(?=[؀-ۿ])/,'')}
async function decide(x,dec,host){var late=x.kind=='late'&&dec=='excl';var r=await ask({title:dec=='excl'?T('استبعاد من الحساب','Exclude from the calculation'):T('احتسابه على المشروع','Count it against the project'),
  sub:(x.label||'')+' — '+T(KN[x.kind][0],KN[x.kind][1]),date:late,dateDef:late?String((x.info||{}).ne||'').slice(0,10):null,def:dec=='excl'?(x.req_reason||''):'',req:dec=='excl',
  lbl:dec=='excl'?T('سبب الاستبعاد (يظهر في التدقيق والتقارير)','Reason (shown in audit and reports)'):T('ملاحظة للمدير (اختيارية)','Note to the manager (optional)'),ok:dec=='excl'?T('استبعاد','Exclude'):T('يُحتسب','Count')});
 if(!r)return;try{await rpc('rev_decide',{p_id:x.id,p_dec:dec,p_reason:r.reason||null,p_new_e:r.date||null});toast(T('تم حفظ القرار وتحديث المؤشر.','Decision saved; indicator updated.'));await host()}catch(z){toast(err(z),true)}}
async function request(kind,pc,ref,label,office,host){var late=kind=='late';var tm=new Date(Date.now()+864e5).toISOString().slice(0,10);
 var r=await ask({title:office?(late?T('عذر التأخير وتمديد الموعد','Excuse the delay and extend'):T('استبعاد من الحساب','Exclude from the calculation')):(late?T('طلب عذر التأخير','Request to excuse the delay'):T('طلب استبعاد من الحساب','Request exclusion')),
  sub:(label||'')+(late?' — '+T('عند الموافقة يُمدَّد موعد المهمة ولا تُحسب متأخرة في أي مكان، ويبقى الموعد الأصلي محفوظًا.','On approval the due date is extended so the task is no longer late anywhere; the original date is kept.'):''),date:late,dateMin:late?tm:null,
  lbl:T('السبب والمبرر (مثل قرار لجنة أو انتظار جهة خارجية)','Reason (e.g. committee decision, waiting on an external party)'),ok:office?T('استبعاد','Exclude'):T('إرسال الطلب للمكتب','Send to the office')});
 if(!r)return;try{await rpc('rev_request',{p_kind:kind,p_pc:pc,p_ref:String(ref),p_reason:r.reason,p_new_e:r.date||null,p_dec:office?'excl':null});toast(office?T('تم الاستبعاد وتحديث المؤشر.','Excluded; indicator updated.'):T('أُرسل الطلب إلى مكتب التطوير المؤسسي.','Request sent to the office.'));await host()}catch(z){toast(err(z),true)}}
async function hist(id,host){if(S.hist[id]){delete S.hist[id];host(true);return}try{var h=await rpc('rev_hist',{p_id:id});S.hist[id]=(h||[]).map(function(x){return '<li>'+fd(x.at)+' · '+e(x.by||'')+' · '+(x.act=='request'?T('طلب استبعاد','Request'):x.dec=='excl'?T('استبعاد','Excluded'):T('احتساب','Counted'))+(x.reason?' — «'+e(x.reason)+'»':'')+'</li>'}).join('')||'<li>'+T('لا يوجد','None')+'</li>';host(true)}catch(z){toast(err(z),true)}}
/* ===== التفاصيل وأثر القرار ===== */
var GN={ok:['ملتزم','On track'],wa:['يحتاج متابعة','Needs follow-up'],bad:['خارج الحد','Off track'],na:['لا بيانات','No data']};
function band(s){return s==null?'na':s>=90?'ok':s>=75?'wa':'bad'}
function n1(v){return v==null||v===''?'—':String(Math.round(+v*10)/10)}
function dd(a,b){var x=a&&String(a).slice(0,10),y=b&&String(b).slice(0,10);if(!x||!y)return null;return Math.round((Date.parse(y)-Date.parse(x))/864e5)}
function story(D){var i=D.info||{},t=D.task||{},b=D.base||{},k=D.kind,td=new Date().toISOString().slice(0,10),late=t.e&&t.e<td&&(+t.pc||0)<100?dd(t.e,td):0,nm='«'+e(D.label||t.n||'')+'»';
 if(k=='scope_ms')return T('المعلم '+nm+' كان مقررًا إنجازه في '+fd(i.e||b.e)+' حسب خط الأساس، ','Milestone '+nm+' was due on '+fd(i.e||b.e)+' in the baseline, ')+(t.e&&t.e!=(i.e||b.e)?T('وموعده الحالي في الخطة '+fd(t.e)+'، ','now planned for '+fd(t.e)+', '):'')+T('ونسبة إنجازه '+Math.round(+t.pc||+i.pc||0)+'٪','progress '+Math.round(+t.pc||+i.pc||0)+'%')+(late?T('، أي متأخر '+late+' يومًا.',', '+late+' days late.'):'.')+'<br>'+T('يدخل في مؤشر «إنجاز المعالم في موعدها» ضمن الالتزام بالنطاق.','It counts in “milestones delivered on time” within scope adherence.');
 if(k=='scope_add')return T('أُضيفت المهمة '+nm+' إلى الخطة بعد اعتماد خط الأساس','Task '+nm+' was added after the baseline')+(i.dur?T(' بمدة '+i.dur+' يومًا',' ('+i.dur+' days)'):'')+(i.by?T('، أضافها '+e(i.by),', by '+e(i.by)):'')+'. '+T('تُحسب تضخّمًا في النطاق وزيادة في الجهد.','It counts as scope creep and extra effort.');
 if(k=='scope_del')return T('كانت المهمة '+nm+' في خط الأساس وحُذفت من الخطة','Task '+nm+' was in the baseline and has been removed')+(i.by?T('، حذفها '+e(i.by),', by '+e(i.by)):'')+'. '+T('تُحسب نطاقًا محذوفًا.','It counts as removed scope.');
 if(k=='scope_chg')return T('تغيّرت مدة المهمة '+nm+' من '+i.db+' إلى '+i.dc+' يومًا','Duration of '+nm+' changed from '+i.db+' to '+i.dc+' days')+(i.e0?T(' (النهاية '+fd(i.e0)+' ← '+fd(i.e)+')',' (end '+fd(i.e0)+' → '+fd(i.e)+')'):'')+(i.by?T('، غيّرها '+e(i.by),', by '+e(i.by)):'')+'. '+T('يتجاوز التغيير 25٪ فيُحسب على ثبات النطاق ونمو الجهد.','Over 25%, so it affects scope stability and effort.');
 if(k=='late')return T('المهمة '+nm+' متأخرة عن موعدها '+fd(i.e0||i.e)+'. ','Task '+nm+' is late against '+fd(i.e0||i.e)+'. ')+(i.ne?T('الموعد المقترح: '+fd(i.ne)+'.','Proposed date: '+fd(i.ne)+'.'):'');
 return detail({kind:k,info:i})}
function impact(D){var N=D.now||{},X=D.excl||{},L=[];['scope','qual'].forEach(function(g){var a=N[g],b=X[g];if(!a||!a.on)return;var ch=[];var K=a.keys||{};Object.keys(a.m||{}).forEach(function(k){var m0=a.m[k]||{},m1=(b&&b.m&&b.m[k])||{};if(n1(m0.s)!=n1(m1.s)||n1(m0.v)!=n1(m1.v))ch.push([K[k]||k,m0,m1])});
  if(ch.length||(b&&n1(a.s)!=n1(b.s)))L.push({g:g,nm:g=='scope'?T('الالتزام بالنطاق','Scope adherence'):T('جودة المخرجات','Deliverable quality'),s0:a.s,s1:b?b.s:a.s,ch:ch})});return L}
function cell(v0,v1){var d=(v1!=null&&v0!=null)?Math.round((+v1-+v0)*10)/10:null;return '<td class="v">'+n1(v0)+'</td><td class="v '+(d>0?'rv-up':d<0?'rv-dn':'')+'">'+n1(v1)+(d?' <small>('+(d>0?'+':'')+d+')</small>':'')+'</td>'}
async function why(id,host,office,can){css();var w=document.createElement('div');w.className='rvmo';w.dir=A()?'rtl':'ltr';w.innerHTML='<div class="wd rvx no-dr" role="dialog" aria-modal="true"><h4>'+T('جارٍ تحميل التفاصيل…','Loading…')+'</h4></div>';document.body.appendChild(w);
 function end(){document.removeEventListener('keydown',kd,true);w.remove()}function kd(ev){if(ev.key=='Escape')end()}document.addEventListener('keydown',kd,true);w.addEventListener('click',function(ev){if(ev.target===w)end()});
 var D;try{D=await rpc('rev_explain',{p_id:id})}catch(z){w.firstChild.innerHTML='<h4>'+e(err(z))+'</h4><div class="rv-ft"><button type="button" class="rv-cx">'+T('إغلاق','Close')+'</button></div>';w.querySelector('.rv-cx').onclick=end;return}
 var x=D,t=D.task,b=D.base,td=new Date().toISOString().slice(0,10),late=t&&t.e&&t.e<td&&(+t.pc||0)<100?dd(t.e,td):0,I=impact(D),dec=null;
 try{var it=((S.q&&S.q.items)||[]).concat((S.d&&S.d.items)||[]).find(function(z){return z.id==id});dec=it?it.dec:null;x=it||D}catch(_){}
 var h='<h4>'+(IC[D.kind]||'')+' '+e(D.label||'—')+'</h4><p>'+e(T(KN[D.kind][0],KN[D.kind][1]))+' · '+e(D.pname||D.pcode)+'</p>';
 h+='<h5>'+T('ماذا حدث؟','What happened?')+'</h5><div class="rv-wh">'+story(D)+'</div>';
 if(t){h+='<h5>'+T('المهمة في الخطة','The task in the plan')+'</h5><div class="rv-tk"><dl>'+
  (t.path&&t.path.length?'<dt>'+T('ضمن','Under')+'</dt><dd>'+e(t.path.join(' › '))+'</dd>':'')+
  '<dt>'+T('المكلّف','Assignee')+'</dt><dd>'+e(t.w||'—')+'</dd>'+
  (b?'<dt>'+T('في خط الأساس','In the baseline')+'</dt><dd>'+fd(b.s)+' ← '+fd(b.e)+'</dd>':'')+
  '<dt>'+T('في الخطة الحالية','Current plan')+'</dt><dd>'+fd(t.s)+' ← '+fd(t.e)+(b&&b.e&&t.e&&b.e!=t.e?' <span class="rv-dn">('+(dd(b.e,t.e)>0?'+':'')+dd(b.e,t.e)+T(' يومًا',' d')+')</span>':'')+'</dd>'+
  (t.as||t.ae?'<dt>'+T('الفعلي','Actual')+'</dt><dd>'+(t.as?T('بدأت ','started ')+fd(t.as):'')+(t.ae?' · '+T('انتهت ','finished ')+fd(t.ae):'')+'</dd>':'')+
  '<dt>'+T('الإنجاز','Progress')+'</dt><dd>'+Math.round(+t.pc||0)+'٪'+(late?' · <span class="rv-dn">'+T('متأخرة '+late+' يومًا','late '+late+' d')+'</span>':'')+'</dd>'+
  (t.ms=='1'||t.ms===true?'<dt>'+T('النوع','Type')+'</dt><dd>🚩 '+T('معلم','Milestone')+'</dd>':'')+
  '</dl>'+(D.plan?'<div class="rva"><button type="button" data-op="plan">📋 '+T('فتح الخطة','Open the plan')+'</button><button type="button" data-op="pj">📁 '+T('ملف المشروع','Project file')+'</button></div>':'')+'</div>'}
 h+='<h5>'+T('أثر القرار على المؤشرات','Effect of the decision')+'</h5>';
 if(I.length){h+='<table><tr><th>'+T('المؤشر','Indicator')+'</th><th>'+T('إذا احتُسب (الآن)','If counted (now)')+'</th><th>'+T('إذا استُبعد','If excluded')+'</th></tr>'+
  I.map(function(r){return '<tr class="rv-tot"><td><b>'+e(r.nm)+'</b><br><small>'+T(GN[band(r.s0)][0],GN[band(r.s0)][1])+(band(r.s0)!=band(r.s1)?' ← '+T(GN[band(r.s1)][0],GN[band(r.s1)][1]):'')+'</small></td>'+cell(r.s0,r.s1)+'</tr>'+r.ch.map(function(c){return '<tr><td>'+e(c[0])+(c[1].of!=null||c[2].of!=null?' <small class="mut">('+(c[1].n!=null?c[1].n:'—')+'/'+(c[1].of!=null?c[1].of:'—')+' ← '+(c[2].n!=null?c[2].n:'—')+'/'+(c[2].of!=null?c[2].of:'—')+')</small>':'')+'</td>'+cell(c[1].s,c[2].s)+'</tr>'}).join('')}).join('')+'</table>'}
 else h+='<div class="rv-wh">'+T('لا يغيّر هذا البند أرقام المؤشرات الحالية (قد يكون المؤشر غير مفعّل لهذا المشروع أو البند خارج نطاق الحساب).','This item does not change the current indicator figures (the indicator may be off for this project).')+'</div>';
 var s0=I[0]&&I[0].s0,s1=I[0]&&I[0].s1;
 h+='<div class="rv-opt"><div class="rv-ct"><b>'+T('يُحتسب على المشروع','Count it')+'</b>'+T('يبقى الرقم كما هو الآن'+(s0!=null?' ('+n1(s0)+')':'')+'، ويُغلق البند بقرار موثّق في سجل التدقيق، ويُبلَّغ مدير المشروع.','Figures stay as now and the item is closed with a recorded decision.')+'</div><div class="rv-ex"><b>'+T('يُستبعد من الحساب','Exclude it')+'</b>'+(s1!=null&&n1(s1)!=n1(s0)?T('يتغيّر الرقم إلى '+n1(s1)+'. ','Score becomes '+n1(s1)+'. '):'')+(D.kind=='late'?T('ويُمدَّد موعد المهمة فلا تظهر متأخرة في الخطة ومهامي والغرفة، ويبقى الموعد الأصلي محفوظًا. ','The due date is extended; the original date is kept. '):'')+T('يلزم كتابة السبب، ويظهر في التدقيق والتقارير.','A reason is required and shown in audit and reports.')+'</div></div>';
 if(D.kind.indexOf('scope_')==0||D.kind=='late')h+='<p style="margin-top:8px">'+T('ملاحظة: الإنجاز مقابل المتوقع في الغرفة والمحفظة يتبع تواريخ الخطة، ولا يتغير بقرار النطاق إلا في حالة عذر التأخير (تمديد الموعد).','Note: progress vs expected follows plan dates and only changes for an excused delay (extended date).')+'</p>';
 var bt=[];if(office){bt.push('<button type="button" class="rv-go" data-d="excl" style="background:#0a6b3d;border-color:#0a6b3d">'+(dec=='excl'?T('مستبعد ✓','Excluded ✓'):T('✓ استبعاد من الحساب','✓ Exclude'))+'</button><button type="button" data-d="count" style="color:#d1101d;border-color:#e6b8bc">'+(dec=='count'?T('يُحتسب ✓','Counted ✓'):T('يُحتسب على المشروع','Count it'))+'</button>')}
 else if(can&&!dec&&!(x&&x.req_at))bt.push('<button type="button" class="rv-go" data-d="req">'+T('طلب استبعاد','Request exclusion')+'</button>');
 bt.push('<button type="button" data-d="hist">'+T('السجل','History')+'</button><button type="button" class="rv-cx">'+T('إغلاق','Close')+'</button>');
 w.firstChild.innerHTML=h+'<div class="rv-hs"></div><div class="rv-ft">'+bt.join('')+'</div>';
 w.querySelector('.rv-cx').onclick=end;
 w.querySelectorAll('[data-op]').forEach(function(a){a.onclick=function(){var u=a.dataset.op=='plan'?'plan.html#o='+D.plan:'myprojects.html?pc='+encodeURIComponent(D.pcode);end();if(window.IDOPANEL)IDOPANEL.open(u,a.dataset.op=='plan'?T('الخطة','Plan'):T('ملف المشروع','Project file'));else location.href=u}});
 w.querySelectorAll('[data-d]').forEach(function(a){a.onclick=async function(){var d=a.dataset.d;if(d=='hist'){try{var hh=await rpc('rev_hist',{p_id:id});w.querySelector('.rv-hs').innerHTML='<ul class="rvhl">'+((hh||[]).map(function(q){return '<li>'+fd(q.at)+' · '+e(q.by||'')+' · '+(q.act=='request'?T('طلب استبعاد','Request'):q.dec=='excl'?T('استبعاد','Excluded'):T('احتساب','Counted'))+(q.reason?' — «'+e(q.reason)+'»':'')+'</li>'}).join('')||'<li>'+T('لا يوجد','None')+'</li>')+'</ul>'}catch(z){toast(err(z),true)}return}
  end();var it=x&&x.kind?x:D;if(d=='req')return request(it.kind,it.pcode,it.ref||'',it.label,false,host);return decide(it,d,host)}})}
window.REVWHY=function(id,host,office,can){return why(id,host||function(){},office,can)};
/* ===== بطاقة المشروع ===== */
async function load(pc){S.pc=pc;S.d=null;try{S.d=await rpc('rev_list',{p_pc:pc})}catch(_){S.d=null}return S.d}
function body(){var D=S.d;if(!D)return '<div class="rve">'+T('تعذّر تحميل المراجعة.','Could not load the review.')+'</div>';
 var it=D.items||[],o={office:!!D.office,can:!!D.can},n={pend:0,excl:0,count:0};it.forEach(function(x){if(!x.dec)n.pend++;else if(x.dec=='excl')n.excl++;else n.count++});
 var F=S.f,L=it.filter(function(x){return F=='all'||(F=='pend'&&!x.dec)||(F=='excl'&&x.dec=='excl')||(F=='count'&&x.dec=='count')});
 var sc=L.filter(function(x){return x.kind.indexOf('scope_')==0}),ot=L.filter(function(x){return x.kind.indexOf('scope_')!=0});
 var h='<div class="rvf">'+[['pend',T('بانتظار المراجعة','Pending'),n.pend],['excl',T('مستبعد','Excluded'),n.excl],['count',T('يُحتسب','Counted'),n.count],['all',T('الكل','All'),it.length]].map(function(f){return '<button data-f="'+f[0]+'" class="'+(F==f[0]?'on':'')+'">'+f[1]+'<i>'+f[2]+'</i></button>'}).join('')+'</div>';
 if(!L.length)h+='<div class="rve">'+(F=='pend'?T('لا توجد بنود بانتظار المراجعة.','Nothing awaiting review.'):T('لا توجد بنود.','Nothing here.'))+'</div>';
 if(sc.length)h+='<div class="rvg"><b>📐 '+T('تغييرات النطاق مقارنة بخط الأساس','Scope changes vs baseline')+'</b>'+sc.map(function(x){return row(x,o)}).join('')+'</div>';
 if(ot.length)h+='<div class="rvg"><b>🗂 '+T('التأخير والجودة والمؤشرات','Delays, quality and KPIs')+'</b>'+ot.map(function(x){return row(x,o)}).join('')+'</div>';
 if(o.office||o.can){var C=D.cands||{},has={};it.forEach(function(x){if(x.dec!='count')has[x.kind+'|'+x.ref]=1});
  var grp=[['late',T('مهام متأخرة','Late tasks')],['q_ret',T('مخرجات أُعيدت للتعديل','Returned deliverables')],['q_late',T('مخرجات اعتُمدت بعد موعدها','Deliverables approved late')],['q_slow',T('مخرجات تأخر اعتمادها (أكثر من يومين)','Slow approvals (over 2 days)')],['q_wait',T('مخرجات معلّقة أكثر من 7 أيام','Pending over 7 days')],['q_miss',T('مهام مستحقة بلا مخرَج معتمد','Due tasks without an approved deliverable')]];
  var cc='';grp.forEach(function(g){var l=(C[g[0]]||[]).filter(function(c){return !has[g[0]+'|'+c.ref]});if(l.length)cc+='<div class="rvg"><b>'+IC[g[0]]+' '+g[1]+' <span class="mut" style="font-weight:400">('+l.length+')</span></b>'+l.slice(0,40).map(function(c){return cand(g[0],c,o)}).join('')+'</div>'});
  if(cc)h+='<details class="rvc rvg"><summary>'+(o.office?T('بنود أخرى يمكن استبعادها مباشرة','Other items you can exclude'):T('بنود أخرى يمكن طلب استبعادها','Other items you can ask to exclude'))+'</summary>'+cc+'<div class="rve">'+T('لاستبعاد قراءة مؤشر: افتح صفحة المؤشرات واضغط «طلب استبعاد» بجانب القراءة.','To exclude a KPI reading, open the KPIs page and use “Request exclusion” next to the reading.')+'</div></details>'}
 return h}
function card(){css();return '<div class="card rvw" id="rev"><div class="rvh"><div><h3>⚖️ '+T('مراجعة الاحتساب','Calculation review')+'</h3><div class="rvs">'+T('كل ما يُحسب على المشروع في المؤشرات (تغييرات النطاق، التأخير، الجودة، قراءات المؤشرات). يدخل كل بند في الحساب حتى يقرر مكتب التطوير المؤسسي استبعاده بسبب موثّق، ويستطيع مدير المشروع طلب الاستبعاد.','Everything counted against the project. Each item counts until the Institutional Development Office excludes it with a documented reason; the project manager can request exclusion.')+'</div></div>'+(S.d&&S.d.office&&window.DEC?'<button type="button" style="font:inherit;font-size:12.5px;font-weight:700;border:1px solid #dcd6c8;background:#fff;border-radius:99px;padding:6px 12px;cursor:pointer" onclick="DEC.open()">⚖️ '+T('كل قرارات المكتب','All office decisions')+'</button>':'')+'</div><div id="revb">'+body()+'</div></div>'}
function paint(){var b=document.getElementById('revb');if(b)b.innerHTML=body()}
async function reload(soft){if(!soft)await load(S.pc);paint();try{if(window.IND&&IND.load&&!soft){await IND.load(S.pc);if(window.draw)window.draw()}}catch(_){}}
document.addEventListener('click',function(ev){var t=ev.target;if(!t||!t.closest)return;var w=t.closest('#rev');if(!w)return;var D=S.d;if(!D)return;
 var f=t.closest('[data-f]');if(f){S.f=f.dataset.f;paint();return}
 var a=t.closest('[data-a]');if(a){var id=+a.closest('[data-id]').dataset.id,x=(D.items||[]).find(function(z){return z.id==id});if(!x)return;
  ev.preventDefault();if(a.dataset.a=='why')return why(id,reload,!!D.office,!!D.can);if(a.dataset.a=='hist')return hist(id,reload);if(a.dataset.a=='req')return request(x.kind,S.pc,x.ref,x.label,false,reload);return decide(x,a.dataset.a,reload)}
 var c=t.closest('[data-c]');if(c){var r=c.closest('[data-ck]'),k=r.dataset.ck,ref=r.dataset.ref,lb=(r.querySelector('.n')||{}).firstChild;return request(k,S.pc,ref,lb?lb.textContent:'',c.dataset.c=='excl',reload)}});
/* ===== طابور المكتب (لوحة التحكم) ===== */
async function queue(el){css();S.qel=el;el.innerHTML='<div class="card rve">'+T('جارٍ التحميل…','Loading…')+'</div>';var d;try{d=await rpc('rev_list',{p_pc:null})}catch(z){el.innerHTML='<div class="card" style="color:#d1101d">'+e(err(z))+'</div>';return}S.q=d;qpaint()}
function qpaint(){var el=S.qel;if(!el||!S.q)return;var it=S.q.items||[],qf=S.qf;var kinds={scope:0,late:0,qual:0,kpi:0};
 it.forEach(function(x){var g=x.kind.indexOf('scope_')==0?'scope':x.kind=='late'?'late':x.kind=='kpi'?'kpi':'qual';kinds[g]++});
 var L=it.filter(function(x){var g=x.kind.indexOf('scope_')==0?'scope':x.kind=='late'?'late':x.kind=='kpi'?'kpi':'qual';return !qf||qf==g});
 var by={};L.forEach(function(x){(by[x.pcode]=by[x.pcode]||[]).push(x)});
 var h='<div class="card rvw" id="revq"><h3>⚖️ '+T('مراجعات المكتب: ما يدخل في حساب المؤشرات','Office reviews: what counts in the indicators')+'</h3><div class="rvs">'+T('كل بند هنا يُحتسب على المشروع حاليًا. استبعده إذا كان مبررًا (قرار معتمد، سبب خارجي…) مع كتابة السبب، أو أكّد احتسابه. القرارات تظهر في سجل التدقيق وتُحدّث المؤشرات فورًا.','Each item currently counts against its project. Exclude it with a reason if justified, or confirm it counts. Decisions go to the audit log and update the indicators immediately.')+'</div>'+
  '<div class="rvf">'+[['',T('الكل','All'),it.length],['scope',T('تغييرات النطاق','Scope changes'),kinds.scope],['late',T('تأخير المهام','Task delays'),kinds.late],['qual',T('جودة المخرجات','Deliverable quality'),kinds.qual],['kpi',T('قراءات المؤشرات','KPI readings'),kinds.kpi]].map(function(f){return '<button data-qf="'+f[0]+'" class="'+(qf==f[0]?'on':'')+'">'+f[1]+'<i>'+f[2]+'</i></button>'}).join('')+'</div>';
 if(!L.length)h+='<div class="rve">✅ '+T('لا توجد بنود بانتظار مراجعة المكتب.','Nothing awaiting office review.')+'</div>';
 Object.keys(by).forEach(function(pc){var l=by[pc];h+='<div class="rvpj"><b>'+e(l[0].pname||pc)+' <span class="mut" style="font-weight:400;font-size:12.5px">'+e(pc)+' · '+l.length+'</span></b><a href="myprojects.html?pc='+encodeURIComponent(pc)+'#rev">'+T('صفحة المشروع ↗','Project page ↗')+'</a></div>'+l.map(function(x){return row(x,{office:true})}).join('')});
 el.innerHTML=h+'</div>'}
async function qreload(soft){if(!soft){try{S.q=await rpc('rev_list',{p_pc:null})}catch(_){}}qpaint();try{if(window.REVcnt)window.REVcnt()}catch(_){}}
document.addEventListener('click',function(ev){var t=ev.target;if(!t||!t.closest)return;var w=t.closest('#revq');if(!w||!S.q)return;
 var f=t.closest('[data-qf]');if(f){S.qf=f.dataset.qf;qpaint();return}
 var a=t.closest('[data-a]');if(a){var id=+a.closest('[data-id]').dataset.id,x=(S.q.items||[]).find(function(z){return z.id==id});if(!x)return;ev.preventDefault();if(a.dataset.a=='why')return why(id,qreload,true,true);if(a.dataset.a=='hist')return hist(id,qreload);return decide(x,a.dataset.a,qreload)}});
/* ===== العدّاد ===== */
var CP=null,CT=0;function counts(force){if(!force&&CP&&Date.now()-CT<60000)return CP;CT=Date.now();CP=rpc('rev_counts',{}).catch(function(){return null});return CP}
/* ===== قراءة مؤشر (صفحة المؤشرات) ===== */
async function kpi(pc,vid,label,office,done){await request('kpi',pc,vid,label,office,async function(){if(done)await done()})}
window.REV={load:load,card:card,queue:queue,counts:counts,kpi:kpi,ask:ask,paint:paint,why:function(id,host,office,can){return why(id,host||function(){},office,can)}};
setTimeout(function(){try{if(location.hash=='#rev'){var n=0,iv=setInterval(function(){var x=document.getElementById('rev');if(x){x.scrollIntoView({block:'start'});clearInterval(iv)}if(++n>40)clearInterval(iv)},250)}}catch(_){}},300);
})();
