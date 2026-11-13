/* علامة للأدمن: مهام سُجّلت منجزة بتاريخ أقدم من يوم الإجراء — window.IDOBKD */
(function(){
 var M=null,busy=false,A=function(){return (window.lang||'ar')!='en'};
 function load(sb,isAdmin,done){if(!isAdmin||M||busy||!sb)return;busy=true;
  sb.rpc('audit_backdated',{p_from:null,p_to:null,p_pcode:null,p_plan:null}).then(function(r){M={};((r&&r.data)||[]).forEach(function(x){if(x.still){var k=x.plan+'|'+x.tid;if(!M[k])M[k]=x}});busy=false;if(Object.keys(M).length&&done)done()},function(){busy=false;M={}})}
 function badge(k){var x=M&&M[k];if(!x)return '';var d=+x.after_due>0?+x.after_due:+x.late_act;
  var tt=(A()?'سُجّلت منجزة بتاريخ ':'Recorded done on ')+x.ae+(A()?' بينما الإجراء كان يوم ':' but the action was on ')+x.act+(x.actor?' — '+x.actor:'');
  return ' <a href="audit.html#tab=bk&pc='+encodeURIComponent(x.pcode||'')+'" target="_blank" onclick="event.stopPropagation()" title="'+String(tt).replace(/"/g,'&quot;')+'" style="display:inline-block;background:#fdf0e3;color:#9a4a10;border-radius:99px;padding:0 7px;font-size:11.5px;font-weight:700;text-decoration:none;white-space:nowrap">⏱ '+(A()?'إغلاق بأثر رجعي ':'Backdated ')+d+(A()?' يوم':'d')+'</a>'}
 window.IDOBKD={load:load,badge:badge};
})();
