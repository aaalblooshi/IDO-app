/* تتبّع تغييرات الخطة: مقارنة أي نسختين + سجل التعديلات — IDOPD.open(pcode,{name}) */
(function(){
 var A=function(){return (window.lang||document.documentElement.lang||'ar')!='en'};
 var P=function(a,e){return A()?a:e};
 var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
 var dn=function(s){var m=/^(\d{4})-(\d{2})-(\d{2})/.exec(s||'');return m?Date.UTC(+m[1],+m[2]-1,+m[3])/864e5:NaN};
 var fd=function(s){if(!s)return '—';try{return new Date(s).toLocaleDateString(A()?'ar-AE-u-nu-latn':'en-GB',{year:'numeric',month:'short',day:'numeric'})}catch(_){return String(s).slice(0,10)}};
 var ft=function(s){try{return new Date(s).toLocaleString(A()?'ar-AE-u-nu-latn':'en-GB',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}catch(_){return s}};
 var S={pc:'',snaps:[],a:null,b:null,cat:'',q:'',tab:'diff',log:null,users:{},busy:false};
 var CAT=[['add','➕',P('أُضيفت','Added')],['del','➖',P('حُذفت','Removed')],['date','📅',P('تغيّر موعدها','Dates changed')],['who','👤',P('تغيّر المسؤول','Owner changed')],['name','✏️',P('تغيّر الاسم','Renamed')],['wt','⚖️',P('تغيّر الوزن','Weight changed')],['dep','🔗',P('تغيّرت الاعتمادية','Dependency changed')],['move','↕️',P('نُقلت','Moved')],['pc','📊',P('تغيّر الإنجاز','Progress changed')]];
 var css='#pdx{position:fixed;inset:0;z-index:400;background:rgba(20,22,24,.45);display:flex;align-items:stretch;justify-content:center}#pdx .pw{background:#f4f2ec;width:100%;max-width:880px;display:flex;flex-direction:column;font:14.5px/1.6 Cairo,system-ui,sans-serif;color:#1b1d1f}'+
 '#pdx .ph{background:#fff;border-bottom:1px solid #e4dfd4;padding:10px 14px;display:flex;gap:10px;align-items:center}#pdx .ph b{flex:1;font-size:16px}#pdx .ph button{border:1px solid #e4dfd4;background:#fff;border-radius:10px;padding:6px 12px;font:inherit;cursor:pointer}'+
 '#pdx .pb{overflow:auto;padding:12px 14px 40px;flex:1}#pdx .cd{background:#fff;border:1px solid #e4dfd4;border-radius:14px;padding:12px;margin:0 0 12px}'+
 '#pdx select,#pdx input{font:16px Cairo,system-ui,sans-serif;padding:8px 10px;border:1px solid #e4dfd4;border-radius:10px;background:#fff;width:100%;min-width:0;box-sizing:border-box}'+
 '#pdx .g2{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:end}#pdx .g2 .ar{padding-bottom:9px;color:#6b6f76}#pdx label{display:block;font-weight:700;font-size:13px;margin:0 0 3px}'+
 '#pdx .pq-tb{display:flex;gap:6px;margin:0 0 10px}#pdx .pq-tb button{border:0;background:#e8e4da;border-radius:99px;padding:6px 14px;font:inherit;font-weight:700;cursor:pointer;color:#3b3f44}#pdx .pq-tb button.on{background:#0a6b3d;color:#fff}'+
 '#pdx .chs{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}#pdx .chs button{border:1px solid #e4dfd4;background:#fff;border-radius:99px;padding:4px 11px;font:inherit;font-size:13px;cursor:pointer}#pdx .chs button.on{border-color:#0a6b3d;background:#e5f2ea;color:#0a6b3d;font-weight:700}#pdx .chs button:disabled{opacity:.4}'+
 '#pdx .pq-it{border-top:1px solid #efebe2;padding:9px 2px}#pdx .pq-it:first-child{border-top:0}#pdx .pq-it .n{font-weight:700}#pdx .pq-it .w{color:#6b6f76;font-size:12.5px}#pdx .ln{font-size:13.5px;margin-top:2px}#pdx .pq-o{color:#a3343c;text-decoration:line-through}#pdx .pq-nw{color:#0a6b3d;font-weight:700}'+
 '#pdx .pq-bd{display:inline-block;font-size:11.5px;border-radius:99px;padding:0 8px;margin-inline-start:6px;background:#f0ede6;color:#54585e}#pdx .pq-bd.r{background:#fbe9ea;color:#a3343c}#pdx .pq-bd.g{background:#e5f2ea;color:#0a6b3d}'+
 '#pdx .pq-mut{color:#6b6f76}#pdx .dh{font-weight:800;margin:14px 0 4px;color:#3b3f44}#pdx .sm{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px}#pdx .sm div{background:#faf8f3;border-radius:10px;padding:8px;text-align:center}#pdx .sm b{display:block;font-size:20px}'+
 '@media(max-width:600px){#pdx .g2{grid-template-columns:1fr}#pdx .g2 .ar{display:none}}';
 function st(){if(document.getElementById('pdxs'))return;var s=document.createElement('style');s.id='pdxs';s.textContent=css;document.head.appendChild(s)}
 function sb(){try{return window.sb||Function('return sb')()}catch(_){return null}}
 function stLab(s){return ({Approved:P('معتمدة','Approved'),Submitted:P('مُقدَّمة','Submitted'),'Under Review':P('قيد المراجعة','In review'),Draft:P('مسودة','Draft'),'Returned to PM':P('معادة للتعديل','Returned'),'PMO Review':P('قيد المراجعة','In review'),'Awaiting Approval':P('بانتظار الاعتماد','Awaiting approval'),Cancelled:P('ملغاة','Cancelled'),Rejected:P('مرفوضة','Rejected')})[s]||s||''}
 async function loadSnaps(){var c=sb(),out=[];
  var r=await c.from('plans').select('id,version,status,created_at,stage_at,issued_at,data').or('data->>pcode.eq.'+S.pc+',code.eq.'+S.pc).order('id');
  var pl=(r.data||[]);
  var ids=pl.map(function(x){return x.id});
  if(ids.length){var v=await c.from('plan_versions').select('id,plan_id,version,approved_at,data').in('plan_id',ids).order('version');
   (v.data||[]).forEach(function(x){out.push({k:'v'+x.id,t:+new Date(x.approved_at||0),lab:P('النسخة المعتمدة ','Approved version ')+x.version+' — '+fd(x.approved_at),data:x.data||{}})})}
  pl.forEach(function(x){if(x.status=='Cancelled'||x.status=='Rejected')return;
   var dup=out.some(function(o){return o.k.charAt(0)=='v'&&o.data&&x.status=='Approved'&&JSON.stringify((o.data.tasks||[]).map(function(t){return [t.id,t.s,t.e,t.n]}))==JSON.stringify((x.data.tasks||[]).map(function(t){return [t.id,t.s,t.e,t.n]}))});
   if(dup)return;
   out.push({k:'p'+x.id,t:+new Date(x.stage_at||x.created_at||0),lab:P('الخطة ','Plan ')+'v'+(x.version||1)+' · '+stLab(x.status)+' — '+fd(x.stage_at||x.created_at)+(x.status!='Approved'?P(' (الحالية)',' (current)'):''),data:x.data||{}})});
  out.sort(function(a,b){return a.t-b.t});S.snaps=out;
  S.b=out.length?out[out.length-1].k:null;S.a=out.length>1?out[out.length-2].k:S.b}
 async function loadUsers(){try{var r=await sb().from('profiles').select('id,full_name');(r.data||[]).forEach(function(u){S.users[u.id]=u.full_name})}catch(_){}}
 var who=function(t){return t?(S.users[t.w]||t.wn||(t.w?'—':'')):''};
 function path(T,t){var m={},p=[],x=t,g=0;T.forEach(function(z){m[z.id]=z});while(x&&x.p&&m[x.p]&&g++<20){x=m[x.p];p.unshift(x.n||'')}return p.join(' › ')}
 function depS(t){return (t.dep||[]).map(function(d){return d.t+(d.ty||'')+(d.lag||'')}).sort().join(',')}
 function diff(A0,B0){var a=(A0&&A0.tasks)||[],b=(B0&&B0.tasks)||[],ma={},mb={},nm={},res=[];
  a.forEach(function(t){ma[t.id]=t;nm[(t.n||'').trim()]=nm[(t.n||'').trim()]||t});b.forEach(function(t){mb[t.id]=t});
  var used={};
  b.forEach(function(t){var o=ma[t.id];if(!o){var c=nm[(t.n||'').trim()];if(c&&!mb[c.id]&&!used[c.id])o=c}
   if(!o){res.push({cat:['add'],t:t,T:b});return}used[o.id]=1;var ch=[],cat=[];
   if((o.n||'')!=(t.n||'')){cat.push('name');ch.push(['✏️',P('الاسم','Name'),o.n,t.n])}
   if((o.s||'')!=(t.s||'')||(o.e||'')!=(t.e||'')){cat.push('date');var d1=dn(t.s)-dn(o.s),d2=dn(t.e)-dn(o.e);
    ch.push(['📅',P('الموعد','Dates'),(o.s||'—')+' → '+(o.e||'—'),(t.s||'—')+' → '+(t.e||'—'),isNaN(d2)?'':(d2>0?P('تأخر ','Later by ')+d2+P(' يوم',' d'):d2<0?P('تقدّم ','Earlier by ')+(-d2)+P(' يوم',' d'):(d1?P('البداية ','Start ')+(d1>0?'+':'')+d1+P(' يوم',' d'):''))])}
   if((o.w||'')!=(t.w||'')||(!o.w&&!t.w&&(o.wn||'')!=(t.wn||''))){cat.push('who');ch.push(['👤',P('المسؤول','Owner'),who(o)||'—',who(t)||'—'])}
   if(String(o.wt==null?'':o.wt)!=String(t.wt==null?'':t.wt)){cat.push('wt');ch.push(['⚖️',P('الوزن','Weight'),o.wt==null?'—':o.wt,t.wt==null?'—':t.wt])}
   if(depS(o)!=depS(t)){cat.push('dep');ch.push(['🔗',P('الاعتمادية','Dependency'),depN(o,a)||'—',depN(t,b)||'—'])}
   if((o.p||'')!=(t.p||'')){cat.push('move');ch.push(['↕️',P('موقعها','Position'),path(a,o)||P('المستوى الأعلى','Top level'),path(b,t)||P('المستوى الأعلى','Top level')])}
   if((+o.pc||0)!=(+t.pc||0)){cat.push('pc');ch.push(['📊',P('الإنجاز','Progress'),(+o.pc||0)+'%',(+t.pc||0)+'%'])}
   if(cat.length)res.push({cat:cat,t:t,T:b,ch:ch})});
  a.forEach(function(t){if(!mb[t.id]&&!used[t.id])res.push({cat:['del'],t:t,T:a})});
  return res}
 function depN(t,T){var m={};T.forEach(function(z){m[z.id]=z});return (t.dep||[]).map(function(d){return (m[d.t]&&m[d.t].n)||d.t}).join('، ')}
 function snap(k){return (S.snaps.filter(function(x){return x.k==k})[0]||{}).data||{}}
 function diffH(){if(S.snaps.length<1)return '<div class="cd pq-mut">'+P('لا توجد خطة لهذا المشروع.','No plan for this project.')+'</div>';
  var opt=function(sel){return S.snaps.map(function(s){return '<option value="'+s.k+'" '+(s.k==sel?'selected':'')+'>'+esc(s.lab)+'</option>'}).join('')};
  var R=S.a==S.b?[]:diff(snap(S.a),snap(S.b)),cnt={};CAT.forEach(function(c){cnt[c[0]]=R.filter(function(r){return r.cat.indexOf(c[0])>=0}).length});
  var q=S.q.trim().toLowerCase(),F=R.filter(function(r){return (!S.cat||r.cat.indexOf(S.cat)>=0)&&(!q||(r.t.n||'').toLowerCase().indexOf(q)>=0)});
  var la=snap(S.a),lb=snap(S.b),ea=(la.tasks||[]).reduce(function(m,t){return t.e>m?t.e:m},''),eb=(lb.tasks||[]).reduce(function(m,t){return t.e>m?t.e:m},''),sh=dn(eb)-dn(ea);
  var h='<div class="cd"><div class="g2"><div><label>'+P('من النسخة','From')+'</label><select onchange="IDOPD._s(\'a\',this.value)">'+opt(S.a)+'</select></div><div class="ar">⇠</div><div><label>'+P('إلى النسخة','To')+'</label><select onchange="IDOPD._s(\'b\',this.value)">'+opt(S.b)+'</select></div></div>';
  if(S.a==S.b)return h+'<div class="pq-mut" style="margin-top:8px">'+P('اختر نسختين مختلفتين للمقارنة.','Pick two different versions.')+'</div></div>';
  h+='<div class="sm" style="margin-top:10px"><div><b>'+R.length+'</b>'+P('مهمة تغيّرت','tasks changed')+'</div><div><b>'+cnt.add+'</b>'+P('أُضيفت','added')+'</div><div><b>'+cnt.del+'</b>'+P('حُذفت','removed')+'</div><div><b>'+cnt.date+'</b>'+P('تغيّر موعدها','rescheduled')+'</div><div><b dir="ltr">'+(isNaN(sh)?'—':(sh>0?'+':'')+sh)+'</b>'+P('يوم على تاريخ النهاية','days on end date')+'</div></div>';
  h+='<div class="chs"><button class="'+(S.cat?'':'on')+'" onclick="IDOPD._c(\'\')">'+P('الكل','All')+' '+R.length+'</button>'+CAT.map(function(c){return '<button class="'+(S.cat==c[0]?'on':'')+'" '+(cnt[c[0]]?'':'disabled')+' onclick="IDOPD._c(\''+c[0]+'\')">'+c[1]+' '+c[2]+' '+cnt[c[0]]+'</button>'}).join('')+'</div>';
  h+='<input placeholder="'+P('ابحث باسم المهمة','Search task name')+'" value="'+esc(S.q)+'" oninput="IDOPD._q(this.value)"></div>';
  h+='<div class="cd" id="pdl">'+(F.length?F.map(itH).join(''):'<div class="pq-mut">'+P('لا تغييرات بين النسختين.','No differences.')+'</div>')+'</div>';
  return h}
 function itH(r){var t=r.t,p=path(r.T,t),c0=r.cat[0];
  var hd='<div class="n">'+(c0=='add'?'➕ ':c0=='del'?'➖ ':'')+esc(t.n||'—')+(c0=='add'?'<span class="pq-bd g">'+P('جديدة','new')+'</span>':c0=='del'?'<span class="pq-bd r">'+P('محذوفة','removed')+'</span>':'')+'</div>'+(p?'<div class="w">'+esc(p)+'</div>':'');
  if(c0=='add'||c0=='del')return '<div class="pq-it">'+hd+'<div class="ln pq-mut">'+esc((t.s||'—')+' → '+(t.e||'—'))+(who(t)?' · '+esc(who(t)):'')+'</div></div>';
  return '<div class="pq-it">'+hd+(r.ch||[]).map(function(c){return '<div class="ln">'+c[0]+' <b>'+esc(c[1])+':</b> '+oS(c[2])+' ← <span class="pq-nw">'+esc(c[3])+'</span>'+(c[4]?'<span class="pq-bd '+(/تأخر|Later/.test(c[4])?'r':'g')+'">'+esc(c[4])+'</span>':'')+'</div>'}).join('')+'</div>'}
 var FN={n:P('الاسم','Name'),s:P('البداية','Start'),e:P('النهاية','End'),w:P('المسؤول','Owner'),wn:P('المسؤول','Owner'),pc:P('الإنجاز','Progress'),as:P('البداية الفعلية','Actual start'),ae:P('النهاية الفعلية','Actual end'),ms:P('معلم','Milestone'),nt:P('ملاحظة','Note')};
 function oS(v){return v=='—'?'<span class="pq-mut">'+P('غير محدد','none')+'</span>':'<span class="pq-o">'+esc(v)+'</span>'}
 function fv(k,v){if(v==null||v==='')return '—';if(k=='w')return S.users[v]||'—';if(k=='pc')return v+'%';if(k=='ms')return v?'✓':'—';return String(v)}
 function logH(){if(S.log==null)return '<div class="cd pq-mut">'+P('جارٍ التحميل…','Loading…')+'</div>';
  if(!S.log.length)return '<div class="cd pq-mut">'+P('لا توجد تعديلات مسجّلة.','No recorded edits.')+'</div>';
  var q=S.q.trim().toLowerCase(),L=S.log.filter(function(x){var o=x.t&&x.t.op;return (!S.cat||(S.cat=='add'&&o=='add')||(S.cat=='del'&&o=='del')||(S.cat=='date'&&o=='chg'&&x.t.f&&(x.t.f.s||x.t.f.e))||(S.cat=='who'&&o=='chg'&&x.t.f&&(x.t.f.w||x.t.f.wn))||(S.cat=='pc'&&o=='chg'&&x.t.f&&x.t.f.pc))&&(!q||String(x.t.n||'').toLowerCase().indexOf(q)>=0)});
  var h='<div class="cd"><div class="chs">'+[['',P('الكل','All')],['add','➕ '+P('إضافة','Added')],['del','➖ '+P('حذف','Removed')],['date','📅 '+P('مواعيد','Dates')],['who','👤 '+P('مسؤول','Owner')],['pc','📊 '+P('إنجاز','Progress')]].map(function(c){return '<button class="'+(S.cat==c[0]?'on':'')+'" onclick="IDOPD._c(\''+c[0]+'\')">'+c[1]+'</button>'}).join('')+'</div><input placeholder="'+P('ابحث باسم المهمة','Search task name')+'" value="'+esc(S.q)+'" oninput="IDOPD._q(this.value)"></div><div class="cd">',last='';
  L.slice(0,600).forEach(function(x){var d=String(x.at).slice(0,10);if(d!=last){last=d;h+='<div class="dh">'+fd(x.at)+'</div>'}var t=x.t||{};
   h+='<div class="pq-it"><div class="n">'+(t.op=='add'?'➕ ':t.op=='del'?'➖ ':'✎ ')+esc(t.n||'—')+'</div><div class="w">'+esc(ft(x.at))+' · '+esc(x.actor||P('النظام','System'))+' · v'+esc(x.ver||'')+' '+esc(stLab(x.status))+'</div>'+
   (t.op=='chg'&&t.f?Object.keys(t.f).map(function(k){var v=t.f[k]||[];return '<div class="ln"><b>'+esc(FN[k]||k)+':</b> '+oS(fv(k,v[0]))+' ← <span class="pq-nw">'+esc(fv(k,v[1]))+'</span></div>'}).join(''):'')+'</div>'});
  if(L.length>600)h+='<div class="pq-mut">'+P('يظهر أحدث 600 تعديل.','Latest 600 shown.')+'</div>';
  return h+'</div>'}
 function draw(){var o=document.getElementById('pdx');if(!o)return;var b=o.querySelector('.pb'),y=b?b.scrollTop:0;
  o.querySelector('.pb').innerHTML='<div class="pq-tb"><button class="'+(S.tab=='diff'?'on':'')+'" onclick="IDOPD._t(\'diff\')">🔀 '+P('مقارنة نسختين','Compare versions')+'</button><button class="'+(S.tab=='log'?'on':'')+'" onclick="IDOPD._t(\'log\')">🕘 '+P('سجل التعديلات','Edit log')+'</button></div>'+(S.tab=='diff'?diffH():logH());b.scrollTop=y}
 async function open(pc,o){o=o||{};st();S.pc=pc;S.cat='';S.q='';S.tab='diff';S.log=null;var x=document.getElementById('pdx');if(x)x.remove();
  x=document.createElement('div');x.id='pdx';x.innerHTML='<div class="pw"><div class="ph"><b>🔀 '+P('تتبّع تغييرات الخطة','Plan change tracking')+(o.name?' — '+esc(o.name):'')+'</b><button onclick="IDOPD.close()">✕ '+P('إغلاق','Close')+'</button></div><div class="pb"><div class="cd pq-mut">'+P('جارٍ التحميل…','Loading…')+'</div></div></div>';
  document.body.appendChild(x);document.body.style.overflow='hidden';
  try{await Promise.all([loadSnaps(),loadUsers()])}catch(e){}draw()}
 async function loadLog(){try{var r=await sb().rpc('plan_change_log',{p_pcode:S.pc});S.log=r.error?[]:(r.data||[])}catch(_){S.log=[]}draw()}
 window.IDOPD={open:open,close:function(){var x=document.getElementById('pdx');if(x)x.remove();document.body.style.overflow=''},
  _s:function(k,v){S[k]=v;S.cat='';draw()},_c:function(c){S.cat=c;draw()},_q:function(v){S.q=v;clearTimeout(S.qt);S.qt=setTimeout(function(){var i=document.activeElement,p=i&&i.selectionStart;draw();var n=document.querySelector('#pdx input:not([type])');if(n){n.focus();try{n.setSelectionRange(p,p)}catch(_){}}},250)},
  _t:function(t){S.tab=t;S.cat='';if(t=='log'&&S.log==null){draw();loadLog()}else draw()},diff:diff};
})();
