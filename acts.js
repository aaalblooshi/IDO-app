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
