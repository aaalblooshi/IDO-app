/* تعريف واحد لـ«بانتظار إجرائي» تستخدمه كل الصفحات (الرئيسية، خدماتي، صفحات الخدمات) حتى تتطابق الأرقام */
(function(){
 var OFF=['Submitted','Reviewed','Office Decision'];
 function capList(){try{return JSON.parse(localStorage.getItem('hdrCaps')||'[]')}catch(_){return[]}}
 /* هل أملك صلاحية؟ الأدمن الكامل يملك كل شيء */
 function has(me,k){if(!me)return false;var full=me.role=='admin'&&!me._base;if(full)return true;var c=me._caps||capList();return c.indexOf(k)>=0}
 /* o: {svc, st, byMe, pmMe, sigs:[توقيعاتي ومن أنوب عنه], createdSigned, office, behalf, consult, esc, del} */
 function reason(o){var st=o.st,sg=o.sigs||[];
  if(o.del)return 'del';
  if(o.esc)return 'esc';
  var prep=o.byMe||(o.svc=='plan'&&o.pmMe)||sg.some(function(s){return s.stage=='created'&&s.status=='pending'});
  if(prep&&st=='Draft')return 'draft';
  if(prep&&st=='Returned to PM')return 'edit';
  if(st=='PMO Review'&&sg.some(function(s){return s.stage=='reviewed'&&s.status=='pending'}))return 'review';
  if(st=='Awaiting Approval'&&sg.some(function(s){return s.stage=='approved'&&s.status=='pending'}))return 'approve';
  if(st=='Approved'&&o.ftr=='review'&&sg.some(function(s){return s.stage=='reviewed'&&s.status=='pending'}))return 'review';
  if(st=='Approved'&&o.ftr=='approval'&&sg.some(function(s){return s.stage=='approved'&&s.status=='pending'}))return 'approve';
  if(o.office&&OFF.indexOf(st)>=0)return st=='Submitted'?'assignRev':st=='Reviewed'?'assignApp':'office';
  if(o.behalf&&!o.byMe&&st=='Draft'&&o.createdSigned)return 'behalf';
  if(o.consult&&!o.byMe&&st=='Draft')return 'consult';
  return ''}
 window.IDOACT={reason:reason,has:has,
  office:function(me,svc){return has(me,'off.review.'+svc)},
  escOk:function(me){return has(me,'off.esc')},
  delOk:function(me){return has(me,'off.delete')},
  /* بيانات مساعدة تُحمَّل مرة واحدة لكل جلسة صفحة */
  ctx:function(sb,me){var C=window.IDOACT;if(C._c&&C._c.uid==me.id)return C._c.p;
   var q=function(pr,f){return Promise.resolve(pr).then(function(r){return r&&!r.error?f(r.data||[]):f([])},function(){return f([])})};
   var p=Promise.all([
    q(sb.rpc('my_proxy_for'),function(d){return d.map(function(x){return x.id})}),
    q(sb.from('escalations').select('svc,cr_id').eq('status','pending'),function(d){return new Set(d.map(function(e){return e.svc+'|'+e.cr_id}))}),
    q(sb.from('del_requests').select('svc,cr_id').eq('status','pending'),function(d){return new Set(d.map(function(e){return e.svc+'|'+e.cr_id}))}),
    q(sb.rpc('my_grants'),function(d){var g={};d.forEach(function(z){if(z.lvl=='edit')g[z.pcode]=z.svcs||null});return g}),
    q(sb.rpc('my_consults'),function(d){return new Set(d.map(function(z){return z.plan_id}))})
   ]).then(function(a){return{px:a[0],esc:a[1],del:a[2],gr:a[3],ci:a[4]}});
   C._c={uid:me.id,p:p};return p},
  edit:function(c,svc,pc){return !!pc&&!!c&&Object.prototype.hasOwnProperty.call(c.gr,pc)&&(!c.gr[pc]||c.gr[pc].indexOf(svc)>=0)}};
})();

/* التقييم بعد الخدمة: يظهر بعد إجراء المستخدم حسب إعدادات «التقييم بعد كل خدمة» */
(function(){
 var SN={charter:['ميثاق المشروع','Project charter'],plan:['خطة المشروع','Project plan'],cr:['طلب التغيير','Change request'],closure:['التقرير الختامي','Closure report']};
 var SM=[['غير راضٍ إطلاقًا','Very dissatisfied','😡'],['غير راضٍ','Dissatisfied','🙁'],['محايد','Neutral','😐'],['راضٍ','Satisfied','🙂'],['راضٍ جدًا','Very satisfied','😍']];
 var TLO=[['slow','بطء الإجراءات','Slow process'],['unclear','عدم وضوح الخطوات','Unclear steps'],['hard','صعوبة الاستخدام','Hard to use'],['comm','ضعف التواصل','Poor communication'],['other','أخرى','Other']];
 var THI=[['fast','سرعة الإنجاز','Speed'],['clear','وضوح الخطوات','Clear steps'],['easy','سهولة الاستخدام','Ease of use'],['qual','جودة المخرجات','Output quality'],['other','أخرى','Other']];
 var EV={'Submitted':'Submitted','Reviewed':'Reviewed','Awaiting Approval':'Reviewed','Approved':'Approved','Returned to PM':'Returned','Rejected':'Returned'};
 var SET=null,tmr=0;
 function ar(){try{return (localStorage.getItem('lang')||'ar')!='en'}catch(e){return true}}
 function T(a,b){return ar()?a:b}
 function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
 function cfg(sb){if(SET)return Promise.resolve(SET);return Promise.resolve(sb.from('app_settings').select('key,value').in('key',['rate_after','rate_svcs','rate_evs','rate_gap','rate_cmt','rate_skip'])).then(function(r){SET={};((r&&r.data)||[]).forEach(function(x){SET[x.key]=x.value});return SET},function(){return SET={}})}
 function show(sb,me,svc,st){
  var key='rateAsk:'+me.id+':'+svc;ls(key,String(Date.now()));
  var old=document.getElementById('rtaw');if(old)old.remove();
  var cmt=SET.rate_cmt!='0',skip=SET.rate_skip!='0',sc=0,tags=[];
  var o=document.createElement('div');o.id='rtaw';
  o.innerHTML='<style>#rtaw{position:fixed;inset:0;z-index:2147482000;background:rgba(15,30,45,.38);display:flex;align-items:flex-end;justify-content:center;animation:rtf .2s}@keyframes rtf{from{opacity:0}}#rtaw .bx{background:#fff;width:min(520px,100%);border-radius:22px 22px 0 0;padding:14px 16px calc(16px + env(safe-area-inset-bottom,0px));box-shadow:0 -10px 40px rgba(0,0,0,.18);animation:rtu .28s cubic-bezier(.2,.9,.3,1.1);max-height:88vh;overflow:auto;font-family:inherit}@keyframes rtu{from{transform:translateY(100%)}}#rtaw .hd{display:flex;align-items:flex-start;gap:10px}#rtaw h3{margin:4px 0 2px;font-size:17px;color:#14324a;flex:1}#rtaw .x{width:34px;height:34px;border-radius:50%;border:1px solid #e3eaf0;background:#f7f9fc;font-size:15px;color:#1d5f8a;cursor:pointer;flex:0 0 34px}#rtaw .mu{color:#6b7c8c;font-size:13px}#rtaw .em{display:flex;justify-content:space-between;gap:6px;margin:14px 0 6px}#rtaw .em button{flex:1;border:1.5px solid #e3eaf0;background:#fafcfe;border-radius:14px;padding:8px 2px;font-size:26px;cursor:pointer;font-family:inherit;transition:transform .12s}#rtaw .em button small{display:block;font-size:10.5px;color:#5b6b7b;margin-top:2px}#rtaw .em button.on{border-color:#BF9849;background:#fbf5e8;transform:scale(1.06)}#rtaw .tg{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}#rtaw .tg button{border:1px solid #d5dfe8;background:#fff;border-radius:99px;padding:6px 11px;font-size:12.5px;cursor:pointer;font-family:inherit}#rtaw .tg button.on{background:#1d5f8a;color:#fff;border-color:#1d5f8a}#rtaw textarea{width:100%;box-sizing:border-box;border:1px solid #d5dfe8;border-radius:12px;padding:9px;font-family:inherit;font-size:14px;min-height:60px}#rtaw .ft{display:flex;gap:8px;align-items:center;margin-top:12px;flex-wrap:wrap}#rtaw .go{background:#0a6b3d;color:#fff;border:0;border-radius:12px;padding:11px 18px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit}#rtaw .go[disabled]{opacity:.45}#rtaw .ln{background:none;border:0;color:#5b6b7b;font-size:13px;cursor:pointer;text-decoration:underline;font-family:inherit;padding:6px}</style>'+
   '<div class="bx"><div class="hd"><div style="flex:1"><h3>⭐ '+T('كيف كانت تجربتك؟','How was your experience?')+'</h3><div class="mu">'+T('خدمة','Service')+' «'+T(SN[svc][0],SN[svc][1])+'» — '+T('تقييمك يساعدنا على التحسين، وهو اختياري.','your rating helps us improve; it is optional.')+'</div></div><button class="x" aria-label="close">✕</button></div>'+
   '<div class="em">'+SM.map(function(m,i){return '<button data-s="'+(i+1)+'">'+m[2]+'<small>'+T(m[0],m[1])+'</small></button>'}).join('')+'</div><div class="dt"></div>'+
   '<div class="ft"><button class="go" disabled>'+T('إرسال','Send')+'</button><button class="ln" data-k="later">'+T('ليس الآن','Not now')+'</button>'+(skip?'<button class="ln" data-k="never">'+T('لا تسألني مرة أخرى','Don’t ask me again')+'</button>':'')+'</div></div>';
  document.body.appendChild(o);
  var bx=o.querySelector('.bx'),dt=o.querySelector('.dt'),go=o.querySelector('.go');
  var close=function(){bx.style.transition='transform .18s';bx.style.transform='translateY(100%)';o.style.transition='opacity .18s';o.style.opacity='0';setTimeout(function(){o.remove()},190)};
  var drawDt=function(){if(!cmt||!sc){dt.innerHTML='';return}var L=sc<=3?TLO:THI,c=(dt.querySelector('textarea')||{}).value||'';dt.innerHTML='<div class="mu" style="margin-top:6px">'+(sc<=3?T('ما الذي يمكن تحسينه؟','What could be better?'):T('ما الذي أعجبك؟','What did you like?'))+'</div><div class="tg">'+L.map(function(x){return '<button data-t="'+x[0]+'" class="'+(tags.indexOf(x[0])>=0?'on':'')+'">'+T(x[1],x[2])+'</button>'}).join('')+'</div><textarea maxlength="300" placeholder="'+T('ملاحظة (اختياري)','Comment (optional)')+'"></textarea>';dt.querySelector('textarea').value=c};
  o.addEventListener('click',function(e){var b=e.target.closest('button');if(e.target===o||(b&&b.classList.contains('x'))||(b&&b.dataset.k=='later'))return close();if(!b)return;
   if(b.dataset.k=='never'){ls('rateNever:'+me.id,'1');return close()}
   if(b.dataset.s){sc=+b.dataset.s;tags=[];o.querySelectorAll('.em button').forEach(function(x){x.classList.toggle('on',x===b)});go.disabled=false;drawDt();return}
   if(b.dataset.t){var i=tags.indexOf(b.dataset.t);i<0?tags.push(b.dataset.t):tags.splice(i,1);b.classList.toggle('on');return}
   if(b===go&&sc){go.disabled=true;go.textContent=T('جارٍ الإرسال…','Sending…');var c=((dt.querySelector('textarea')||{}).value||'').trim().slice(0,300);
    Promise.resolve(sb.from('service_ratings').insert({user_id:me.id,user_name:me.full_name||'',svc:svc,score:sc,tags:tags,comment:c||null})).then(function(r){if(r&&r.error)throw r.error;bx.innerHTML='<div style="text-align:center;padding:22px 6px"><div style="font-size:40px">💚</div><h3 style="margin:8px 0">'+T('شكرًا لك، تم تسجيل تقييمك.','Thank you, your rating was recorded.')+'</h3></div>';setTimeout(close,1400)}).catch(function(err){go.disabled=false;go.textContent=T('إرسال','Send');alert(T('تعذّر الإرسال: ','Could not send: ')+(err.message||err))})}});
  var y0=null;bx.addEventListener('touchstart',function(e){if(bx.scrollTop<=0)y0=e.touches[0].clientY},{passive:true});bx.addEventListener('touchend',function(e){if(y0!=null&&e.changedTouches[0].clientY-y0>80)close();y0=null});
 }
 window.IDOACT.afterRate=function(sb,me,svc,st){try{
  var ev=EV[st];if(!ev||!sb||!me||!me.id||!SN[svc])return;if(ls('rateNever:'+me.id)=='1')return;
  cfg(sb).then(function(S){if(S.rate_after!='1')return;
   if((S.rate_svcs||'charter,plan,cr,closure').split(',').indexOf(svc)<0)return;
   if((S.rate_evs||'Submitted,Approved').split(',').indexOf(ev)<0)return;
   var gap=parseInt(S.rate_gap==null?'7':S.rate_gap)||0,last=+(ls('rateAsk:'+me.id+':'+svc)||0);if(gap>0&&Date.now()-last<gap*864e5)return;
   clearTimeout(tmr);tmr=setTimeout(function(){show(sb,me,svc,st)},1200)})}catch(e){}};
})();
