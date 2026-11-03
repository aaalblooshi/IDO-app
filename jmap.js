/* مخطط رحلة المتعامل التفاعلي: كل الخدمات والخطوات والأدوار، مع تكبير وتصغير وسحب */
(function(){
var NS='http://www.w3.org/2000/svg';
function X(){return window.JNX}
function P(a){return X().P(a)}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

/* الممرات (الأدوار) */
var LANES=[
 {k:'pm',t:['مدير المشروع / المعدّ','Project manager / preparer'],c:'#1d5f8a',bg:'#e3eefb'},
 {k:'of',t:['مكتب التطوير المؤسسي','Development Office'],c:'#2d3a55',bg:'#e8eaf0'},
 {k:'rv',t:['المراجع','Reviewer'],c:'#0b7aa3',bg:'#e2f4fb'},
 {k:'ap',t:['المعتمِد','Approver'],c:'#0a6b3d',bg:'#e5f2ea'},
 {k:'tk',t:['المكلَّف بالمهمة','Task owner'],c:'#8a5a00',bg:'#fff3d6'},
 {k:'fl',t:['المطّلعون: المتابع، مالك المشروع، مسؤول الوحدة، المشارك بالتخطيط','Viewers: follower, owner, unit head, planning participant'],c:'#5b3a9e',bg:'#efe9fb'}];
var LI={};LANES.forEach(function(l,i){LI[l.k]=i});
var FILT=[['all',['كل الأدوار','All roles']],['pm',['مدير المشروع','Project manager']],['of',['مكتب التطوير','Office']],['rv',['المراجع','Reviewer']],['ap',['المعتمِد','Approver']],['tk',['المكلَّف بمهمة','Task owner']],['fl',['المتابع','Follower']],['ow',['مالك المشروع','Owner']],['uh',['مسؤول الوحدة','Unit head']],['pt',['المشارك بالتخطيط','Planning participant']]];

/* بناء العقد لكل خدمة */
function nodesOf(k){var S=X().SV[k],s=S.s,L=[];
 if(k=='tasks'){s.forEach(function(st,i){L.push({lane:'tk',st:i,t:st,main:true})});L.push({lane:'of',st:3,t:['متابعة المتأخرات وإشعار مدير المشروع','Follow delays and notify the PM'],side:3,small:true});return L}
 L.push({lane:'pm',st:0,t:s[0],main:true});
 if(k=='plan')L.push({lane:'fl',st:0,t:['التخطيط الجماعي: ملاحظات وتعديلات على المسودة','Group planning: notes and edits on the draft'],side:0,small:true,only:'pt'});
 L.push({lane:'pm',st:1,t:s[1],main:true});
 L.push({lane:'of',st:1,t:['تحديد المراجع والمدة','Assign reviewer and duration'],small:true,main:true});
 L.push({lane:'rv',st:2,t:s[2],main:true,ret:true});
 L.push({lane:'of',st:2,t:['تحديد المعتمِد','Assign approver'],small:true,main:true});
 L.push({lane:'ap',st:3,t:s[3],main:true,ret:true});
 L.push({lane:k=='plan'?'pm':'of',st:4,t:s[4],main:true,end:true});
 L.push({lane:'fl',st:2,t:['اطلاع للقراءة وإشعارات بالأحداث المختارة','Read-only view and selected event notices'],side:2,small:true,obs:true});
 return L}

var G={W:0,H:0,s:1,tx:0,ty:0,role:'all',nodes:[]};
var LW=190,NW=170,NH=70,RH=100,BH=64,BG=70,TOP=70,SIDE=40;

function wrap(t,max){var w=String(t).split(/\s+/),lines=[],cur='';w.forEach(function(x){if((cur+' '+x).trim().length>max&&cur){lines.push(cur);cur=x}else cur=(cur+' '+x).trim()});if(cur)lines.push(cur);if(lines.length>3){lines=lines.slice(0,3);lines[2]+='…'}return lines}
function laneX(i){var rtl=document.documentElement.dir!='ltr';return rtl?SIDE+(LANES.length-1-i)*LW:SIDE+i*LW}

function build(){var ORDER=X().ORDER,y=TOP,blocks=[];G.nodes=[];
 G.W=SIDE*2+LANES.length*LW;
 ORDER.forEach(function(k){var L=nodesOf(k),rows=0,b={k:k,y:y};var ry=y+BH;
  L.forEach(function(n){if(n.side==null){n.row=rows++}});
  L.forEach(function(n){if(n.side!=null){var m=L.filter(function(z){return z.main&&z.st==n.side})[0];n.row=m?m.row:0}
   n.k=k;n.x=laneX(LI[n.lane])+(LW-NW)/2;n.y=ry+n.row*RH;n.h=n.small?NH-10:NH;n.id=G.nodes.length;G.nodes.push(n)});
  b.h=BH+rows*RH+10;b.nodes=L;blocks.push(b);y+=b.h+BG});
 G.H=y+20;G.blocks=blocks}

function el(t,a,p){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
function txt(p,x,y,lines,o){/* سطر مستقل لكل نص: يتجنب خلل سفاري في ترتيب الكلمات العربية داخل tspan */
 var g=el('g',{},p),lh=o.lh||16,base=(o.a&&o.a['dominant-baseline']=='middle')?0:0;
 lines.forEach(function(l,i){var ar=/[\u0600-\u06FF]/.test(l);var t=el('text',Object.assign({x:x,y:y+i*lh,'text-anchor':'middle','font-size':o.fs||13,'font-weight':o.fw||700,fill:o.fill||'#1b1d1f','font-family':'Cairo, Tajawal, system-ui, sans-serif',direction:ar?'rtl':'ltr','unicode-bidi':'plaintext'},o.a||{}),g);t.textContent=l});
 return g}

function path(a,b){var x1=a.x+NW/2,y1=a.y+a.h,x2=b.x+NW/2,y2=b.y;if(Math.abs(x1-x2)<2)return 'M'+x1+' '+y1+' V'+(y2-2);var my=y1+(y2-y1)/2;return 'M'+x1+' '+y1+' V'+my+' H'+x2+' V'+(y2-2)}

function draw(svg){svg.innerHTML='';var defs=el('defs',{},svg);
 var mk=el('marker',{id:'ah',viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:7,markerHeight:7,orient:'auto-start-reverse'},defs);el('path',{d:'M0 0L10 5L0 10z',fill:'#5a6675'},mk);
 var mk2=el('marker',{id:'ahr',viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:7,markerHeight:7,orient:'auto-start-reverse'},defs);el('path',{d:'M0 0L10 5L0 10z',fill:'#d1101d'},mk2);
 var vp=el('g',{id:'jmvp'},svg);
 el('rect',{x:0,y:0,width:G.W,height:G.H,fill:'#f7f9fc'},vp);
 /* الممرات */
 LANES.forEach(function(l,i){var x=laneX(i);el('rect',{x:x+4,y:TOP-50,width:LW-8,height:G.H-TOP+40,rx:14,fill:l.bg,opacity:.45},vp)});
 LANES.forEach(function(l,i){var x=laneX(i);var g=el('g',{},vp);el('rect',{x:x+8,y:10,width:LW-16,height:46,rx:12,fill:l.c},g);txt(g,x+LW/2,l.k=='fl'?27:33,wrap(P(l.t),l.k=='fl'?26:20).slice(0,2),{fill:'#fff',fs:l.k=='fl'?11:14,lh:14,a:{'dominant-baseline':'middle'}})});
 /* الكتل */
 var ORDER=X().ORDER,SV=X().SV;
 G.blocks.forEach(function(b,bi){var g=el('g',{},vp);
  el('rect',{x:SIDE-14,y:b.y,width:G.W-2*SIDE+28,height:b.h,rx:18,fill:'none',stroke:'#9fb3c8','stroke-width':1.5,'stroke-dasharray':b.k=='cr'?'8 6':'none'},g);
  el('rect',{x:SIDE-14,y:b.y,width:G.W-2*SIDE+28,height:44,rx:18,fill:'#fff',stroke:'#9fb3c8','stroke-width':1.5},g);
  txt(g,G.W/2,b.y+29,[(bi+1)+'. '+P(SV[b.k].t)+(b.k=='cr'?P([' (اختياري)',' (optional)']):'')],{fs:20,fw:800,fill:'#1d5f8a'});
  /* أسهم داخل الكتلة */
  var M=b.nodes.filter(function(n){return n.main});
  for(var i=0;i<M.length-1;i++)el('path',{d:path(M[i],M[i+1]),fill:'none',stroke:'#5a6675','stroke-width':2,'marker-end':'url(#ah)'},g);
  /* الإعادة للتعديل */
  b.nodes.filter(function(n){return n.ret}).forEach(function(n){var f=M[0];var xr=n.x+NW+8,yr=n.y+n.h/2,yl=f.y+f.h/2;
   el('path',{d:'M'+(n.x+NW)+' '+yr+' H'+(Math.max(xr,f.x+NW+18))+' V'+yl+' H'+(f.x+NW+2),fill:'none',stroke:'#d1101d','stroke-width':1.4,'stroke-dasharray':'5 4','marker-end':'url(#ahr)',opacity:.75},g)});
  b.nodes.filter(function(n){return n.side!=null}).forEach(function(n){var m=M.filter(function(z){return z.st==n.side})[0];if(!m)return;var a=m.x<n.x?{x1:m.x+NW,x2:n.x}:{x1:m.x,x2:n.x+NW};el('path',{d:'M'+a.x1+' '+(m.y+m.h/2)+' H'+a.x2,fill:'none',stroke:'#7b8794','stroke-width':1.4,'stroke-dasharray':'4 4'},g)});
 });
 /* أسهم بين الخدمات */
 function last(b){var M=b.nodes.filter(function(n){return n.main});return M[M.length-1]}
 function first(b){return b.nodes.filter(function(n){return n.main})[0]}
 var B={};G.blocks.forEach(function(b){B[b.k]=b});
 function link(a,b,lab,dash){var A=last(a),Z=first(b);var x1=A.x+NW/2,y1=A.y+A.h,x2=Z.x+NW/2,y2=Z.y,my=b.y-BG/2;
  el('path',{d:'M'+x1+' '+y1+' V'+my+' H'+x2+' V'+(y2-2),fill:'none',stroke:'#1d5f8a','stroke-width':2.4,'stroke-dasharray':dash?'8 6':'none','marker-end':'url(#ah)'},vp);
  var tw=Math.min(300,lab.length*7+24);el('rect',{x:G.W/2-tw/2,y:my-13,width:tw,height:24,rx:12,fill:'#fff',stroke:'#c9d8e5'},vp);txt(vp,G.W/2,my+4,[lab],{fs:11.5,fw:700,fill:'#1d5f8a'})}
 if(B.charter&&B.plan)link(B.charter,B.plan,P(['بعد اعتماد الميثاق','After the charter is approved']));
 if(B.plan&&B.tasks)link(B.plan,B.tasks,P(['بعد اعتماد الخطة تصل المهام','Approved plan sends out tasks']));
 if(B.tasks&&B.cr)link(B.tasks,B.cr,P(['عند الحاجة لتغيير جوهري','When a major change is needed']),true);
 if(B.cr&&B.closure)link(B.cr,B.closure,P(['بعد اكتمال التنفيذ','When execution is complete']));
 if(B.cr&&B.plan){var A=last(B.cr),xo=SIDE-26,pt=first(B.plan);
  el('path',{d:'M'+(A.x)+' '+(A.y+A.h/2)+' H'+xo+' V'+(pt.y+pt.h/2)+' H'+(pt.x-2),fill:'none',stroke:'#1d5f8a','stroke-width':1.6,'stroke-dasharray':'6 5','marker-end':'url(#ah)',opacity:.8},vp);
  var g2=el('g',{transform:'translate('+(xo-6)+' '+((pt.y+A.y)/2)+') rotate(-90)'},vp);txt(g2,0,0,[P(['عند الاعتماد: تُعدَّل الخطة','On approval: the plan is revised'])],{fs:11,fw:700,fill:'#1d5f8a'})}
 /* العقد */
 G.nodes.forEach(function(n){var l=LANES[LI[n.lane]],on=G.role=='all'||hit(n,G.role);
  var g=el('g',{'data-n':n.id,style:'cursor:pointer',opacity:on?1:.22},vp);
  el('rect',{x:n.x,y:n.y,width:NW,height:n.h,rx:n.small?22:12,fill:n.small?'#fff':l.bg,stroke:l.c,'stroke-width':on&&G.role!='all'?3:1.6,'stroke-dasharray':n.small&&!n.main?'5 4':'none'},g);
  if(!n.small)el('rect',{x:n.x,y:n.y,width:6,height:n.h,rx:3,fill:l.c},g);
  var wl=wrap(P(n.t),n.small?18:14);txt(g,n.x+NW/2,n.y+n.h/2-((wl.length-1)*9)+5,wl,{fs:n.small?13:16,fw:n.small?600:800,fill:l.c,lh:18});
  if(n.end){el('circle',{cx:n.x+NW-10,cy:n.y+10,r:6,fill:'#0a6b3d'},g)}});
}

function NONE(){return X().roleText('cr',0,'rv')[0]}
function hit(n,r){if(n.only)return n.only==r;if(n.obs)return r=='fl'||r=='ow'||r=='uh'||r=='pt';return n.lane==r}

/* تفاصيل الخطوة */
function info(n){var SV=X().SV,k=n.k,i=n.st,x=X();var rows=[];
 var RL=[['pm',['مدير المشروع / المعدّ','Project manager / preparer']],['of',['مكتب التطوير المؤسسي','Development Office']],['rv',['المراجع','Reviewer']],['ap',['المعتمِد','Approver']],['tk',['المكلَّف بمهمة','Task owner']],['fl',['المتابع ومالك المشروع ومسؤول الوحدة','Follower, owner and unit head']],['pt',['المشارك بالتخطيط الجماعي','Group-planning participant']]];
 RL.forEach(function(r){var t;try{t=x.roleText(k,i,r[0])}catch(_){t=null}if(!t||t[0]==NONE())return;rows.push('<div class="jmr" style="--c:'+LANES[LI[r[0]=='pt'?'fl':r[0]]].c+'"><b>'+esc(P(r[1]))+'</b><span>'+esc(P(t))+'</span></div>')});
 var st=k=='tasks'?x.TSTATE[i]:(i==4?x.STATE5[k]:x.STATE[i]);
 var o=document.getElementById('jmi');o.innerHTML='<div class="jmh"><div><small>'+esc(P(SV[k].t))+' · '+P(['الخطوة ','Step '])+(i+1)+'</small><b>'+esc(P(n.t))+'</b>'+(st?'<em>'+esc(P(st))+'</em>':'')+'</div><button onclick="document.getElementById(\'jmi\').classList.remove(\'on\')">✕</button></div>'+
  (n.small&&n.lane=='of'&&!n.side?'<p class="jmp">'+P(['إجراء يقوم به مكتب التطوير المؤسسي بين خطوتين.','An Office action between two steps.'])+'</p>':'')+
  '<div class="jml">'+(rows.join('')||'<div class="jmp">—</div>')+'</div>'+
  (i==0?'<p class="jmp"><b>'+P(['شرط البدء: ','Prerequisite: '])+'</b>'+esc(P(x.PRE[k]))+'</p>':'')+(n.end||i==4?'<p class="jmp"><b>'+P(['بعدها: ','Next: '])+'</b>'+esc(P(x.NXT[k]))+'</p>':'')+
  '<a class="jmgo" href="'+SV[k].p+'">'+P(['فتح ','Open '])+esc(P(SV[k].t))+' ›</a>';
 o.classList.add('on')}

/* التكبير والسحب */
function apply(){var g=document.getElementById('jmvp');if(g)g.setAttribute('transform','translate('+G.tx+' '+G.ty+') scale('+G.s+')');var z=document.getElementById('jmz');if(z)z.textContent=Math.round(G.s*100)+'%'}
function clampS(s){return Math.max(.15,Math.min(3,s))}
function zoomAt(f,cx,cy){var s2=clampS(G.s*f);G.tx=cx-(cx-G.tx)*(s2/G.s);G.ty=cy-(cy-G.ty)*(s2/G.s);G.s=s2;apply()}
function fit(mode){var c=document.getElementById('jmc'),w=c.clientWidth,h=c.clientHeight;G.s=mode=='all'?Math.min(w/G.W,h/G.H)*.96:Math.min(1,w/G.W*.98);G.tx=(w-G.W*G.s)/2;G.ty=mode=='all'?(h-G.H*G.s)/2:8;apply()}

function wireCanvas(c){var pts={},last=null,pinch=null,moved=0,downN=null;
 c.addEventListener('wheel',function(e){e.preventDefault();var r=c.getBoundingClientRect(),mouse=e.deltaMode!=0||(Math.abs(e.deltaX)<1&&Math.abs(e.deltaY)>=40);if(e.ctrlKey||mouse)zoomAt(Math.exp(-e.deltaY*(e.ctrlKey?.01:.0015)),e.clientX-r.left,e.clientY-r.top);else{G.tx-=e.deltaX;G.ty-=e.deltaY;apply()}},{passive:false});
 c.addEventListener('pointerdown',function(e){c.setPointerCapture(e.pointerId);pts[e.pointerId]={x:e.clientX,y:e.clientY};moved=0;var t=e.target.closest&&e.target.closest('[data-n]');downN=t?+t.getAttribute('data-n'):null;
  var ids=Object.keys(pts);if(ids.length==2){var a=pts[ids[0]],b=pts[ids[1]];pinch={d:Math.hypot(a.x-b.x,a.y-b.y),s:G.s}}else last={x:e.clientX,y:e.clientY}});
 c.addEventListener('pointermove',function(e){if(!pts[e.pointerId])return;pts[e.pointerId]={x:e.clientX,y:e.clientY};var ids=Object.keys(pts),r=c.getBoundingClientRect();
  if(ids.length==2&&pinch){var a=pts[ids[0]],b=pts[ids[1]],d=Math.hypot(a.x-b.x,a.y-b.y);var f=clampS(pinch.s*d/pinch.d)/G.s;zoomAt(f,(a.x+b.x)/2-r.left,(a.y+b.y)/2-r.top);moved+=10;return}
  if(last){var dx=e.clientX-last.x,dy=e.clientY-last.y;moved+=Math.abs(dx)+Math.abs(dy);G.tx+=dx;G.ty+=dy;last={x:e.clientX,y:e.clientY};apply()}});
 function up(e){delete pts[e.pointerId];if(Object.keys(pts).length<2)pinch=null;if(!Object.keys(pts).length){if(moved<8&&downN!=null)info(G.nodes[downN]);last=null}else{var k=Object.keys(pts)[0];last={x:pts[k].x,y:pts[k].y}}}
 c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);
 c.addEventListener('dblclick',function(e){var r=c.getBoundingClientRect();zoomAt(1.6,e.clientX-r.left,e.clientY-r.top)})}

function paintFilters(){var f=document.getElementById('jmf');f.innerHTML=FILT.map(function(r){return '<button class="'+(G.role==r[0]?'on':'')+'" data-r="'+r[0]+'">'+esc(P(r[1]))+'</button>'}).join('')}
function redraw(){var svg=document.getElementById('jms');draw(svg);apply()}

window.jnMap=function(){if(!X())return;var o=document.getElementById('jmap');if(o)o.remove();
 if(!document.getElementById('jmcss')){var st=document.createElement('style');st.id='jmcss';st.textContent=
 '#jmap{position:fixed;inset:0;z-index:100001;background:#f7f9fc;display:flex;flex-direction:column;font-family:inherit}'+
 '#jmap .jmt{display:flex;align-items:center;gap:8px;padding:calc(10px + env(safe-area-inset-top,0px)) 12px 8px;background:#fff;border-bottom:1px solid #e3eaf0}'+
 '#jmap .jmt b{flex:1;font-size:16px;color:#1d5f8a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}#jmap .jmt button{border:1px solid #d5e1ec;background:#fff;border-radius:12px;min-width:40px;height:38px;font:inherit;font-weight:800;font-size:16px;color:#1d5f8a;cursor:pointer}'+
 '#jmap #jmz{font-size:12px;color:#5a6675;min-width:42px;text-align:center}'+
 '#jmf{display:flex;gap:6px;overflow-x:auto;padding:8px 12px;background:#fff;border-bottom:1px solid #e3eaf0;scrollbar-width:none}#jmf::-webkit-scrollbar{display:none}'+
 '#jmf button{flex:none;border:1.5px solid #d5e1ec;background:#fff;color:#1d5f8a;border-radius:99px;padding:5px 12px;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer;white-space:nowrap}#jmf button.on{background:#1d5f8a;color:#fff;border-color:#1d5f8a}'+
 '#jmc{flex:1;position:relative;overflow:hidden;touch-action:none;user-select:none;-webkit-user-select:none;cursor:grab}#jmc svg{width:100%;height:100%;display:block}'+
 '#jmh{position:absolute;bottom:calc(12px + env(safe-area-inset-bottom,0px));inset-inline-start:12px;background:rgba(255,255,255,.94);border:1px solid #e3eaf0;border-radius:12px;padding:6px 10px;font-size:11.5px;color:#5a6675;pointer-events:none;max-width:70%}'+
 '#jmi{position:absolute;inset-inline:0;bottom:0;max-height:62%;overflow:auto;background:#fff;border-radius:22px 22px 0 0;box-shadow:0 -10px 40px rgba(0,0,0,.25);padding:14px 16px calc(18px + env(safe-area-inset-bottom,0px));transform:translateY(105%);transition:transform .2s}#jmi.on{transform:none}'+
 '#jmi .jmh{display:flex;gap:10px;align-items:flex-start}#jmi .jmh>div{flex:1}#jmi .jmh small{display:block;color:#5a6675;font-size:12px}#jmi .jmh b{display:block;font-size:17px;color:#1b1d1f}#jmi .jmh em{display:inline-block;font-style:normal;margin-top:4px;background:#f1f5f9;border-radius:99px;padding:2px 10px;font-size:12px;color:#1d5f8a}'+
 '#jmi .jmh button{border:1px solid #d5e1ec;background:#fff;border-radius:10px;width:36px;height:36px;font-size:16px;cursor:pointer}'+
 '#jmi .jml{display:flex;flex-direction:column;gap:8px;margin-top:10px}#jmi .jmr{border-inline-start:4px solid var(--c);background:#f7f9fc;border-radius:10px;padding:8px 10px}#jmi .jmr b{display:block;font-size:12.5px;color:var(--c)}#jmi .jmr span{font-size:13.5px;line-height:1.7}'+
 '#jmi .jmp{font-size:13px;color:#4a5568;line-height:1.7;margin:10px 0 0}#jmi .jmgo{display:inline-block;margin-top:12px;background:#1d5f8a;color:#fff;border-radius:12px;padding:8px 16px;font-weight:800;text-decoration:none}';
 document.head.appendChild(st)}
 o=document.createElement('div');o.id='jmap';o.dir=document.documentElement.dir||'rtl';
 o.innerHTML='<div class="jmt"><button id="jmx" aria-label="close">✕</button><b>🗺 '+P(['مخطط الرحلة','Journey map'])+'</b><button data-z="-">−</button><span id="jmz"></span><button data-z="+">＋</button><button data-z="w" title="'+P(['ملاءمة العرض','Fit width'])+'">↔</button><button data-z="a" title="'+P(['عرض الكل','Show all'])+'">⛶</button></div>'+
  '<div id="jmf"></div><div id="jmc"><svg id="jms"></svg><div id="jmh">'+P(['اسحب للتنقل · قرّب بإصبعين أو بالأزرار · اضغط أي خطوة لتفاصيلها · اختر دورًا لإبراز خطواته','Drag to move · pinch or use buttons to zoom · tap a step for details · pick a role to highlight its steps'])+'</div><div id="jmi"></div></div>';
 document.body.appendChild(o);document.documentElement.style.overflow='hidden';var hn=document.getElementById('jmh');var hid=function(){if(hn)hn.style.display='none'};setTimeout(hid,7000);document.getElementById('jmc').addEventListener('pointerdown',hid,{once:true});
 build();var svg=document.getElementById('jms');paintFilters();redraw();fit('w');
 wireCanvas(document.getElementById('jmc'));
 document.getElementById('jmx').onclick=function(){o.remove();document.documentElement.style.overflow=''};
 o.querySelector('.jmt').addEventListener('click',function(e){var b=e.target.closest('[data-z]');if(!b)return;var c=document.getElementById('jmc'),w=c.clientWidth/2,h=c.clientHeight/2,z=b.getAttribute('data-z');if(z=='+')zoomAt(1.3,w,h);else if(z=='-')zoomAt(1/1.3,w,h);else fit(z=='a'?'all':'w')});
 document.getElementById('jmf').addEventListener('click',function(e){var b=e.target.closest('[data-r]');if(!b)return;G.role=b.getAttribute('data-r');paintFilters();redraw()});
 addEventListener('resize',function(){if(document.getElementById('jmap'))apply()})};
})();
