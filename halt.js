/* Project halt (suspended / waiting for a change request / cancelled).
   Shared by the pages that show plans, tasks and requests. Data: table project_halt (one row per project code). */
(function(){
'use strict';
const ar=()=>(document.documentElement.lang||'ar')!='en';
const T=(a,e)=>ar()?a:e;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const DAY=864e5;
const H={map:{},loaded:false,mgr:null,_p:null};
const client=()=>{try{if(typeof sb!='undefined'&&sb&&sb.from)return sb}catch(_){}return window.sb||null};
H.load=async function(sb,force){sb=sb||client();if(!sb)return H.map;if(H._p&&!force)return H._p;
 H._p=(async()=>{try{const r=await sb.from('project_halt').select('pcode,state,at,reason,src,updated_at');if(!r.error){H.map={};(r.data||[]).forEach(x=>H.map[x.pcode]=x)}}catch(_){}H.loaded=true;return H.map})();return H._p};
H.st=pc=>pc&&H.map[pc]||null;
/* day number of the halt date (same scale as todayN(): days since 1970 in Dubai) */
H.day=pc=>{const h=H.st(pc);if(!h)return null;const t=Date.parse(h.at);return isFinite(t)?Math.floor(t/DAY):null};
H.frozen=pc=>!!H.st(pc);
/* requests that wait while a project is stopped (the closure report keeps moving; a change request moves when one is needed to resume) */
H.blocks=(pc,svc)=>{const h=H.st(pc);if(!h)return false;if(svc=='closure')return false;if(svc=='cr'&&h.state=='await_cr')return false;return true};
H.label=pc=>{const h=H.st(pc);if(!h)return '';return h.state=='cancelled'?T('ملغى','Cancelled'):h.state=='await_cr'?T('موقوف حتى طلب تغيير','Stopped until a change request'):T('موقوف','Suspended')};
H.badge=pc=>{const h=H.st(pc);if(!h)return '';const c=h.state=='cancelled'?['#fdecee','#b42318']:['#fff4e0','#8a5a00'];
 return `<span class="haltb" title="${esc(T('منذ ','Since ')+fd(h.at)+(h.reason?' · '+h.reason:''))}" style="display:inline-flex;align-items:center;gap:4px;background:${c[0]};color:${c[1]};border-radius:99px;padding:2px 10px;font-size:12px;font-weight:700;white-space:nowrap">${h.state=='cancelled'?'⛔':'⏸'} ${esc(H.label(pc))}</span>`};
function fd(s){if(!s)return '';const p=String(s).slice(0,10).split('-');return p.length==3?`${+p[2]}/${+p[1]}/${p[0]}`:s}
H.fd=fd;
H.isMgr=async function(sb){sb=sb||client();if(H.mgr!==null)return H.mgr;try{const r=await sb.rpc('halt_mgr');H.mgr=!!(r&&r.data)}catch(_){H.mgr=false}return H.mgr};

/* banner + office controls, placed at the top of #app */
H.bar=async function(pc,ctx){const sb=client();const app=document.getElementById('app');if(!app||!pc)return;
 await H.load(sb,true);const mgr=await H.isMgr(sb);let el=document.getElementById('haltbar');if(el)el.remove();
 const h=H.st(pc);if(!h)document.body.classList.remove('haltfz');if(!h&&!mgr)return;
 if(!h&&ctx&&ctx.only=='halted')return;
 el=document.createElement('div');el.id='haltbar';
 el.style.cssText='margin:12px 0;padding:12px 14px;border-radius:16px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;'+(h?(h.state=='cancelled'?'background:#fdecee;border:1px solid #f3c2c7;color:#7a1018':'background:#fff7e6;border:1px solid #f0d49a;color:#6b4500'):'background:#f4f7fa;border:1px dashed #cfd9e3;color:#3a4a5a');
 let txt='';
 if(h){txt=h.state=='cancelled'?T(`⛔ المشروع ملغى منذ ${fd(h.at)}. الخطة ومهامها متوقفة، والنسب مجمّدة عند هذا التاريخ.`,`⛔ Project cancelled on ${fd(h.at)}. The plan and its tasks are stopped; figures are frozen at that date.`)
   :h.state=='await_cr'?T(`⏸ الخطة موقوفة منذ ${fd(h.at)}، وتُستأنف عند اعتماد طلب تغيير لإعادة الجدولة.`,`⏸ Plan stopped since ${fd(h.at)}; it resumes when a rescheduling change request is approved.`)
   :T(`⏸ الخطة ومهامها موقوفة مؤقتًا منذ ${fd(h.at)}. النسب مجمّدة، ولا تظهر المهام ولا التذكيرات.`,`⏸ The plan and its tasks are suspended since ${fd(h.at)}. Figures are frozen; tasks and reminders are paused.`);
   if(h.reason)txt+=` <span style="opacity:.8">${T('السبب: ','Reason: ')}${esc(h.reason)}</span>`;
   document.body.classList.toggle('haltfz',!!(ctx&&ctx.svc&&H.blocks(pc,ctx.svc)&&!mgr));
   if(ctx&&ctx.svc&&H.blocks(pc,ctx.svc))txt+=`<br><b>${T('هذا الطلب مجمّد مع المشروع حتى يُستأنف.','This request is frozen with the project until it resumes.')}</b>`}
 else{txt='';el.style.cssText='margin:8px 0;display:flex;justify-content:flex-start'}
 const btn=(k,l,p)=>`<button type="button" data-h="${k}" style="border:0;border-radius:99px;padding:7px 14px;font:inherit;font-weight:700;cursor:pointer;${p?'background:#1d5f8a;color:#fff':'background:#fff;color:#1d5f8a;border:1px solid #cfd9e3'}">${l}</button>`;
 let b='';
 if(mgr){if(!h)b=btn('stop',T('⏸ إيقاف الخطة ومهامها','⏸ Suspend plan and tasks'),1);
  else{if(h.state!='cancelled'||true)b+=btn('resume',T('▶ استئناف','▶ Resume'),1);b+=btn('date',h.state=='cancelled'?T('تاريخ الإلغاء','Cancellation date'):T('تعديل التاريخ','Change date'));if(h.state!='cancelled')b+=btn('cancel',T('⛔ إلغاء المشروع','⛔ Cancel project'))}}
 el.innerHTML=`${txt?`<div style="flex:1;min-width:220px;line-height:1.7">${txt}</div>`:''}${b?`<div style="display:flex;gap:6px;flex-wrap:wrap">${b}</div>`:''}`;
 app.insertBefore(el,app.firstChild);
 el.querySelectorAll('[data-h]').forEach(x=>x.onclick=()=>H.dialog(pc,x.dataset.h,ctx));
};

/* office dialogs */
H.dialog=function(pc,kind,ctx){const sb=client();const h=H.st(pc);const today=new Date(Date.now()+4*3600e3).toISOString().slice(0,10);
 let o=document.getElementById('haltdlg');if(o)o.remove();o=document.createElement('div');o.id='haltdlg';
 o.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(22,58,92,.45);display:flex;align-items:center;justify-content:center;padding:16px';
 o.onclick=e=>{if(e.target==o)o.remove()};
 const fld='display:block;width:100%;font:inherit;font-size:16px;padding:9px 12px;border:1px solid #cfd9e3;border-radius:12px;margin:4px 0 12px';
 let body='',title='';
 if(kind=='stop'||kind=='cancel'){title=kind=='stop'?T('إيقاف الخطة ومهامها','Suspend the plan and its tasks'):T('إلغاء المشروع','Cancel the project');
  body=`<label>${kind=='stop'?T('تاريخ الإيقاف','Date'):T('تاريخ الإلغاء','Cancellation date')}<input id="hd" type="date" value="${h?h.at:today}" max="${today}" style="${fld}"></label>
   <label>${T('السبب (إلزامي)','Reason (required)')}<textarea id="hr" rows="3" style="${fld}">${esc(h&&h.reason||'')}</textarea></label>
   <div style="font-size:13px;color:#6b6f76;line-height:1.7;margin-bottom:10px">${kind=='stop'?T('تتجمد نسب الإنجاز عند هذا التاريخ، وتختفي المهام من القوائم والتذكيرات، وتُجمَّد الطلبات المعلّقة على المشروع (عدا التقرير الختامي). يصل تنبيه لمدير المشروع ومالكه والمكلّفين.','Progress figures freeze at this date, tasks leave lists and reminders, and pending requests on the project are frozen (except the closure report). The project manager, owner and assignees are notified.'):T('الإلغاء يكون عادة باعتماد تقرير ختامي حالته «ملغى». استخدم هذا للتصحيح أو للمشاريع السابقة.','Cancellation normally comes from an approved closure report marked “cancelled”. Use this for corrections or past projects.')}</div>`}
 else if(kind=='date'){title=h&&h.state=='cancelled'?T('تاريخ الإلغاء','Cancellation date'):T('تاريخ الإيقاف','Suspension date');
  body=`<label>${T('التاريخ','Date')}<input id="hd" type="date" value="${h?h.at:today}" max="${today}" style="${fld}"></label><div style="font-size:13px;color:#6b6f76;margin-bottom:10px">${T('تُعاد حسابات النسب المجمّدة على التاريخ الجديد.','Frozen figures are recalculated at the new date.')}</div>`}
 else if(kind=='resume'){title=T('استئناف الخطة','Resume the plan');const days=h?Math.max(0,Math.round((Date.parse(today)-Date.parse(h.at))/DAY)):0;
  const op=(v,l,d,c)=>`<label style="display:flex!important;flex-direction:row;gap:10px;align-items:flex-start;justify-content:flex-start;text-align:start;padding:10px 12px;border:1px solid #dfe6ee;border-radius:12px;margin:0 0 8px;cursor:pointer;font-weight:400;width:auto"><input type="radio" name="hm" value="${v}" ${c?'checked':''} style="flex:0 0 auto;width:18px!important;height:18px;min-width:0;margin:3px 0 0;padding:0;box-shadow:none"><span style="flex:1;text-align:start"><b style="color:#1d2b3a">${l}</b><br><span style="font-size:13px;color:#6b6f76">${d}</span></span></label>`;
  body=op('shift',T(`تمديد المواعيد ${days} يومًا`,`Push dates by ${days} days`),T('تُزاح مواعيد المهام غير المنجزة بمدة الإيقاف تلقائيًا.','Unfinished task dates move by the length of the stop.'),1)
   +op('cr',T('بطلب تغيير','With a change request'),T('تبقى الخطة موقوفة حتى يُعتمد طلب تغيير لإعادة الجدولة، ثم تُستأنف تلقائيًا.','The plan stays stopped until a rescheduling change request is approved, then resumes automatically.'))
   +op('asis',T('بلا تعديل','As it is'),T('تُستأنف الخطة بمواعيدها الحالية، وقد يظهر تأخير.','The plan resumes with its current dates; delays may show.'))
   +`<label>${T('ملاحظة (اختياري)','Note (optional)')}<input id="hr" style="${fld}"></label>`}
 o.innerHTML=`<div style="background:#fff;border-radius:20px;max-width:460px;width:100%;padding:20px;max-height:90vh;overflow:auto;color:#1b1d1f;font-size:15px"><b style="font-size:18px;display:block;margin-bottom:12px">${title}</b>${body}<div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" id="hx" style="border:1px solid #cfd9e3;background:#fff;border-radius:99px;padding:9px 18px;font:inherit;cursor:pointer">${T('إلغاء الأمر','Close')}</button><button type="button" id="hok" style="border:0;background:${kind=='cancel'?'#b42318':'#1d5f8a'};color:#fff;border-radius:99px;padding:9px 20px;font:inherit;font-weight:700;cursor:pointer">${T('تأكيد','Confirm')}</button></div><div id="herr" style="color:#b42318;margin-top:8px;font-size:13px"></div></div>`;
 document.body.appendChild(o);o.querySelector('#hx').onclick=()=>o.remove();
 o.querySelector('#hok').onclick=async()=>{const err=m=>{o.querySelector('#herr').textContent=m};try{let r;
   if(kind=='stop'||kind=='cancel'){const rs=(o.querySelector('#hr').value||'').trim();if(!rs)return err(T('اكتب سبب القرار','Write the reason'));r=await sb.rpc('halt_set',{p_pcode:pc,p_state:kind=='stop'?'suspended':'cancelled',p_at:o.querySelector('#hd').value||today,p_reason:rs,p_src:ctx&&ctx.svc||'manual'})}
   else if(kind=='date'){r=await sb.rpc('halt_set',{p_pcode:pc,p_state:h.state=='await_cr'?'suspended':h.state,p_at:o.querySelector('#hd').value||h.at,p_reason:null,p_src:h.src||'manual'})}
   else{const m=(o.querySelector('input[name=hm]:checked')||{}).value||'shift';r=await sb.rpc('halt_resume',{p_pcode:pc,p_mode:m,p_note:(o.querySelector('#hr').value||'').trim()||null})}
   if(r&&r.error)return err(r.error.message);o.remove();await H.load(sb,true);H.bar(pc,ctx);if(ctx&&typeof ctx.after=='function')ctx.after()}catch(e){err(String(e.message||e))}}};

/* call after a request page opened a record */
H.hook=function(rec,svc){try{if(!rec)return;const pc=svc=='charter'?rec.code:(rec.data&&rec.data.pcode);if(!pc)return;
 H.bar(pc,{svc,only:svc=='plan'||svc=='closure'?null:'halted',after:()=>{try{if(typeof openCR=='function'&&rec.id)openCR(rec.id)}catch(_){}}})}catch(_){}};
window.IDOHALT=H;
/* a record opened before this file loaded (fast network): show the banner now */
function catchUp(){try{const m=location.pathname.match(/(plan|cr|closure|charter)\.html/);if(!m||document.getElementById('haltbar'))return;
 if(typeof cr=='undefined'||!cr||typeof curView=='undefined'||typeof homeView=='undefined'||curView===homeView)return;H.hook(cr,m[1])}catch(_){}}
setTimeout(catchUp,0);
})();
