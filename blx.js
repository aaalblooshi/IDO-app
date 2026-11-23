/* عرض خط الأساس — يعمل فقط عند تفعيله من الإعدادات (bl_cfg). window.BL */
(function(){
var A=function(){return (document.documentElement.lang||'ar')!='en'},T=function(a,b){return A()?a:b};
function fd(d){if(!d)return '—';var m=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(d));return m?(+m[3])+'/'+(+m[2])+'/'+m[1]:'—'}
function e(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function css(){if(document.getElementById('blcss'))return;var s=document.createElement('style');s.id='blcss';s.textContent=
 '.blsw{display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:13px;font-weight:700}.blsw .g{display:inline-flex;border:1px solid #d6d0c2;border-radius:99px;padding:2px;background:#fff}'+
 '.blsw button{font:inherit;font-size:12.5px;font-weight:700;border:0;background:none;border-radius:99px;padding:5px 12px;cursor:pointer;color:#4b5158;white-space:nowrap}.blsw button.on{background:#14324a;color:#fff}'+
 '.blnote{display:inline-block;background:#eef2f7;color:#14324a;border-radius:99px;padding:2px 10px;font-size:12px;font-weight:800}'+
 '.blbar{position:relative;height:8px;border-radius:99px;background:repeating-linear-gradient(90deg,#e5e9ef 0 6px,#f4f6f9 6px 10px)}.blbar>i{position:absolute;inset-inline-start:0;top:0;bottom:0;border-radius:99px;background:repeating-linear-gradient(90deg,#5b6b7d 0 6px,#8c99a8 6px 10px)}'+
 '.blcd{border-inline-start:5px solid #5b6b7d}.blcd h3{margin:0 0 4px;font-size:17px}.blcd .s{color:#6b6f76;font-size:13px;line-height:1.7;margin-bottom:8px}'+
 '.blg{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin:6px 0}.blg>div{border:1px solid #ebe6da;border-radius:12px;padding:8px 10px;background:#fbfaf7;min-width:0}.blg small{display:block;color:#6b6f76;font-size:12px;line-height:1.5}.blg b{font-size:19px;font-variant-numeric:tabular-nums}'+
 '.blcd ul{margin:6px 0 0;padding-inline-start:18px;font-size:13px;line-height:1.9;color:#33383e}.blcd a{color:#1d5f8a;font-weight:700;text-decoration:none}';document.head.appendChild(s)}
var BL={on:false,M:{},p:null,
 load:function(client,force){if(this.p&&!force)return this.p;var self=this;var c=client||window.sb;this.p=(async function(){try{var r=await c.rpc('bl_summary');var d=(r&&r.data)||{};self.on=!!d.on;self.M={};(d.rows||[]).forEach(function(x){self.M[x.pcode]=x})}catch(_){self.on=false}css();return self})();return this.p},
 get:function(pc){return this.on?this.M[pc]||null:null},
 ex:function(pc){var x=this.get(pc);return x&&x.ex!=null?+x.ex:null},
 mode:function(){if(!this.on)return 'cur';try{return localStorage.getItem('blMode')=='bl'?'bl':'cur'}catch(_){return 'cur'}},
 set:function(m){try{localStorage.setItem('blMode',m=='bl'?'bl':'cur')}catch(_){}},
 /* زر «القياس على» — fn اسم دالة عامة تُستدعى بعد التبديل */
 switchHTML:function(fn){if(!this.on)return '';css();var m=this.mode();return '<span class="blsw noprint"><span>'+T('القياس على:','Measure against:')+'</span><span class="g" role="group"><button type="button" class="'+(m=='cur'?'on':'')+'" onclick="BL.set(\'cur\');'+fn+'()">'+T('الخطة الحالية','Current plan')+'</button><button type="button" class="'+(m=='bl'?'on':'')+'" onclick="BL.set(\'bl\');'+fn+'()">'+T('خط الأساس','Baseline')+'</button></span></span>'},
 note:function(){return this.mode()=='bl'?'<span class="blnote">📐 '+T('الأرقام المخططة محسوبة على خط الأساس','Planned figures use the baseline')+'</span>':''},
 slipTxt:function(n){if(n==null)return '—';n=+n;if(!n)return T('في موعده الأصلي','On the original date');return n>0?T('متأخر '+n+' يومًا عن الأصل','+'+n+' d late'):T('أبكر '+(-n)+' يومًا من الأصل',(-n)+' d early')},
 /* بطاقة صفحة المشروع */
 card:async function(pc,client){if(!this.on)return '';var c=client||window.sb,d;try{var r=await c.rpc('bl_project',{pc:pc});d=r&&r.data}catch(_){return ''}if(!d||!d.on)return '';css();
  if(d.none)return '<div class="card blcd"><h3>📐 '+T('مقارنة بخط الأساس','Compared with the baseline')+'</h3><div class="s">'+T('لا يوجد خط أساس لهذا المشروع بعد (لا توجد خطة معتمدة).','No baseline yet (no approved plan).')+'</div></div>';
  var src={version:T('أول نسخة معتمدة من الخطة','First approved plan version'),scope:T('خط أساس النطاق','Scope baseline'),base:T('الخطة عند اعتمادها','Plan as approved'),hist:T('أقدم نسخة محفوظة من الخطة','Earliest saved plan'),current:T('الخطة الحالية (لا توجد نسخة سابقة)','Current plan (no earlier version)'),now:T('الخطة الحالية','Current plan'),date:T('الخطة في تاريخ محدد','Plan at a chosen date')}[d.src]||d.src;
  var dEx=(+d.ex_cur||0)-(+d.ex_bl||0),gap=(+d.a||0)-(+d.ex_bl||0);
  var h='<div class="card blcd" id="blcard"><h3>📐 '+T('مقارنة بخط الأساس','Compared with the baseline')+'</h3><div class="s">'+T('خط الأساس: ','Baseline: ')+e(src)+(d.at?' — '+fd(d.at):'')+'. '+T('يوضح أين كان المشروع سيكون لو مضى على خطته الأصلية دون تمديد أو تغيير.','Shows where the project would be on its original plan, without extensions or changes.')+'</div>'+
   '<div class="blg"><div><small>'+T('الإنجاز الفعلي','Actual')+'</small><b>'+Math.round(d.a||0)+'%</b></div><div><small>'+T('المخطط حسب الخطة الحالية','Planned (current plan)')+'</small><b>'+Math.round(d.ex_cur||0)+'%</b></div><div><small>'+T('المخطط حسب خط الأساس','Planned (baseline)')+'</small><b>'+Math.round(d.ex_bl||0)+'%</b></div><div><small>'+T('الفرق عن خط الأساس','Gap vs baseline')+'</small><b style="color:'+(gap<-5?'#d1101d':gap<0?'#a8761a':'#0a6b3d')+'"><span dir="ltr">'+(gap>0?'+':gap<0?'−':'')+Math.abs(Math.round(gap))+'</span></b></div></div>'+
   '<div class="blg"><div><small>'+T('الانتهاء حسب خط الأساس','Baseline finish')+'</small><b style="font-size:16px">'+fd(d.bl_end)+'</b></div><div><small>'+T('الانتهاء حسب الخطة الحالية','Current finish')+'</small><b style="font-size:16px">'+fd(d.cur_end)+'</b></div><div><small>'+T('الفرق في موعد الانتهاء','Finish-date change')+'</small><b style="font-size:16px;color:'+(+d.slip>0?'#d1101d':'#0a6b3d')+'">'+this.slipTxt(d.slip)+'</b></div></div>';
  var L=[];if(Math.abs(dEx)>=0.5)L.push(T('المخطط الحالي ','The current plan is ')+(dEx<0?T('أقل','below'):T('أعلى','above'))+T(' من خط الأساس بـ ',' the baseline by ')+Math.abs(Math.round(dEx))+T(' نقطة',' pts'));
  if(+d.late_x)L.push(T('تأخيرات معذورة من المكتب: ','Excused delays: ')+d.late_x+T(' مهمة، مُدّدت بمجموع ',' tasks, extended by ')+d.late_days+T(' يومًا',' days'));
  if(+d.sc_x)L.push(T('تغييرات نطاق استبعدها المكتب: ','Scope changes excluded by the office: ')+d.sc_x);
  if(+d.sc_c)L.push(T('تغييرات نطاق تُحتسب على المشروع: ','Scope changes counted against the project: ')+d.sc_c);
  if(+d.sc_p)L.push(T('تغييرات نطاق بانتظار مراجعة المكتب: ','Scope changes awaiting office review: ')+d.sc_p+' — <a href="#rev">'+T('مراجعة الاحتساب','Calculation review')+'</a>');
  if(L.length)h+='<b style="font-size:14px">'+T('سبب الفرق','Why it differs')+'</b><ul><li>'+L.join('</li><li>')+'</li></ul>';
  return h+'</div>'}
};
window.BL=BL;
})();
