/* v3d.js — عروض ثلاثية الأبعاد لغرفة التحكم: مدينة المحفظة، التضاريس، الكرة المؤسسية، والمسرح التفاعلي.
   يعتمد على متغيرات غرفة التحكم (PJ, SEC, SCOL, BND, AL, D ...) ويرسم على Canvas ثنائي الأبعاد بإسقاط منظوري. */
(function(){
'use strict';
const $i=id=>document.getElementById(id);
const E=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const AR=n=>String(n);
const plr=(n,one,two,few,many)=>n==1?one:n==2?two:(n>=3&&n<=10?n+' '+few:n+' '+many);
const nP=n=>!n?'لا مشاريع':plr(n,'مشروع واحد','مشروعان','مشاريع','مشروعًا');
const nDc=n=>plr(n,'قرار واحد','قراران','قرارات','قرارًا');
const G=k=>{const r=window.__room;if(r&&r[k])try{return r[k]()}catch(_){}try{return eval(k)}catch(_){return undefined}};
const pjs=()=>(G('PJ')||[]).filter(p=>p.appr&&!p.done&&!p.halted&&p.ps!=null);
const secs=()=>G('SEC')||[];
const secN=id=>{const f=G('secName');return f?f(id):(secs().find(s=>s.id==id)||{}).n||id};
const bands=()=>G('BND')||{g:90,a:75};
const COL={ok:'#2fa866',warn:'#d99a2b',bad:'#d6353f',info:'#7f8c99'};
const colOf=p=>COL[p.status]||COL.info;
const SNM={ok:'على المسار',warn:'يحتاج متابعة',bad:'متعثر',info:'لا بيانات كافية'};
const pendOf=pc=>(G('AL')||[]).filter(a=>a.pc==pc&&(a.cat=='lock'||a.cat=='rev'||a.cat=='appr'||a.cat=='scope'));
const hashS=s=>{let h=0;for(const ch of String(s))h=(h*31+ch.charCodeAt(0))>>>0;return h};
const openP=pc=>{const f=G('openProject');if(f)f(pc)};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- CSS ---------- */
function css(){if($i('v3css'))return;const st=document.createElement('style');st.id='v3css';st.textContent=`
.v3{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:12px;align-items:start}
.v3-box{position:relative;border-radius:16px;overflow:hidden;background:#0b1424;touch-action:none}
.v3-box canvas{display:block;width:100%;cursor:grab}
.v3-tb{position:absolute;top:10px;inset-inline:10px;display:flex;gap:6px;flex-wrap:wrap;z-index:2;align-items:center}
.v3-tb button,.v3-tb select,.v3-cap button{font:inherit;font-size:12.5px;font-weight:700;border:1px solid rgba(255,255,255,.25);background:rgba(15,28,48,.78);color:#e8eef5;border-radius:99px;padding:6px 11px;cursor:pointer}
.v3-tb button.on{background:#BF9849;border-color:#BF9849;color:#fff}
.v3-tb label{display:flex;gap:6px;align-items:center;color:#e8eef5;font-size:12.5px;background:rgba(15,28,48,.78);border:1px solid rgba(255,255,255,.25);border-radius:99px;padding:4px 10px}
.v3-tb input[type=range]{width:130px;accent-color:#BF9849}
.v3-lg{position:absolute;bottom:10px;inset-inline-start:10px;display:flex;gap:10px;flex-wrap:wrap;color:#dfe7ef;font-size:12px;background:rgba(10,20,36,.65);border-radius:10px;padding:5px 9px;z-index:1}
.v3-lg span{display:inline-flex;gap:5px;align-items:center}.v3-lg i{width:10px;height:10px;border-radius:3px;display:inline-block}
.v3-sd{display:flex;flex-direction:column;gap:10px;max-height:660px;overflow:auto}
.v3-card{border:1px solid var(--line,#e6e2d9);border-radius:14px;padding:12px;background:#fff}
.v3-card h4{margin:0 0 4px;font-size:15.5px;line-height:1.45}.v3-card small{color:#5c6168;font-size:12.5px;display:block}
.v3-m{display:grid;grid-template-columns:1fr auto;gap:3px 8px;border-top:1px solid #f0ece3;margin-top:8px;padding-top:7px;font-size:13px}
.v3-m span{color:#5c6168}.v3-m b{text-align:end}
.v3-st{display:inline-block;color:#fff;border-radius:99px;padding:2px 10px;font-size:12px;font-weight:800}
.v3-row{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.v3-row button{font:inherit;font-size:12.5px;font-weight:700;border:1px solid #d8d2c4;background:#fff;border-radius:99px;padding:5px 12px;cursor:pointer}.v3-row button.p{background:#14324a;border-color:#14324a;color:#fff}
.v3-li{display:flex;gap:8px;align-items:center;width:100%;text-align:start;font:inherit;border:1px solid #eee8dc;background:#fff;border-radius:10px;padding:7px 9px;cursor:pointer;margin-bottom:5px}
.v3-li:hover,.v3-li.hv{border-color:#14324a}.v3-li i{width:10px;height:10px;border-radius:50%;flex:0 0 auto}.v3-li b{flex:1;font-size:13px;min-width:0}.v3-li em{font-style:normal;font-size:12px;color:#5c6168}
.v3-cap{position:absolute;bottom:46px;inset-inline-start:12px;max-width:min(420px,calc(100% - 24px));background:rgba(10,20,36,.92);color:#fff;border:1px solid rgba(191,152,73,.6);border-radius:14px;padding:10px 12px;z-index:3}
.v3-help{color:#5c6168;font-size:12.5px;line-height:1.7}
@media(max-width:900px){.v3{grid-template-columns:1fr}.v3-sd{max-height:none}}
@media(max-width:640px){.v3-box{display:flex;flex-direction:column}.v3-tb{position:static;padding:8px 8px 0;order:-1;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none}.v3-tb::-webkit-scrollbar{display:none}.v3-tb>*{flex:0 0 auto}.v3-lg{position:static;order:2;border-radius:0;justify-content:center;font-size:12.5px}}
/* المسرح */
.v3s{position:fixed;inset:0;z-index:2147483300;background:#060c16;color:#fff;display:flex;flex-direction:column}
.v3s canvas{flex:1;min-height:0;width:100%;display:block}
.v3s-top{position:absolute;top:calc(10px + env(safe-area-inset-top,0px));inset-inline:12px;display:flex;justify-content:space-between;align-items:center;gap:8px;z-index:2}
.v3s-top b{font-size:14px;color:#e6d6aa}
.v3s-txt{position:absolute;inset-inline:0;bottom:calc(84px + env(safe-area-inset-bottom,0px));display:flex;justify-content:center;padding:0 16px;z-index:2;pointer-events:none}
.v3s-txt div{max-width:860px;background:rgba(6,12,22,.82);border:1px solid rgba(191,152,73,.45);border-radius:16px;padding:14px 18px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.4)}
.v3s-txt h3{margin:0 0 4px;font-size:clamp(18px,3.2vw,30px);line-height:1.35}
.v3s-txt p{margin:0;font-size:clamp(14px,2.1vw,19px);color:#d8e1ea;line-height:1.6}
.v3s-big{font-size:clamp(54px,11vw,120px)!important;font-weight:800;color:#ffe49a;line-height:1.05!important}
.v3s-ctl{position:absolute;bottom:calc(16px + env(safe-area-inset-bottom,0px));inset-inline:0;display:flex;justify-content:center;align-items:center;gap:8px;z-index:2;flex-wrap:wrap}
.v3s-ctl button{font:inherit;font-size:14px;font-weight:700;border:1px solid rgba(255,255,255,.3);background:rgba(20,34,54,.85);color:#fff;border-radius:99px;padding:8px 14px;cursor:pointer}
.v3s-dots{display:flex;gap:5px}.v3s-dots i{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.3)}.v3s-dots i.on{background:#BF9849;width:20px;border-radius:5px}
`;document.head.appendChild(st)}

/* ---------- الكاميرا والإسقاط ---------- */
function mkCam(o){return Object.assign({tx:0,tz:0,yaw:-.75,pitch:.62,zoom:1,w:600,h:420,dp:1,span:400,cy:.56,auto:!reduce,anim:null,drag:null},o||{})}
function proj(c,x,y,z){x-=c.tx||0;z-=c.tz||0;const cy=Math.cos(c.yaw),sy=Math.sin(c.yaw),cp=Math.cos(c.pitch),sp=Math.sin(c.pitch);
 let X=x*cy-z*sy,Z=x*sy+z*cy;let Y=y*cp-Z*sp;Z=y*sp+Z*cp;const Dd=c.span*1.4,s=Dd/(Dd+Z)*c.zoom*Math.min(c.w,c.h*1.35)/c.span;return [c.w/2+X*s,c.h*c.cy-Y*s,s,Z]}
function anim(c,ty,tp,tz,ms,px,pz){const fy=c.yaw,ny=fy+((((ty-fy)%(2*Math.PI))+3*Math.PI)%(2*Math.PI)-Math.PI);c.anim={t0:performance.now(),ms:ms||1200,fy,ty:ny,fp:c.pitch,tp,fz:c.zoom,tz,fx:c.tx||0,fz2:c.tz||0,px:px||0,pz:pz||0}}
function step(c,t){if(c.anim){const A=c.anim,k=Math.min(1,(t-A.t0)/A.ms),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;c.yaw=A.fy+(A.ty-A.fy)*e;c.pitch=A.fp+(A.tp-A.fp)*e;c.zoom=A.fz+(A.tz-A.fz)*e;c.tx=A.fx+(A.px-A.fx)*e;c.tz=A.fz2+(A.pz-A.fz2)*e;if(k>=1)c.anim=null;return true}
 if(c.auto&&!c.drag&&!c.sel&&!c.hover){c.yaw+=.0018;return true}return false}
function shade(hex,f){const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;const m=x=>Math.max(0,Math.min(255,Math.round(f>=1?x+(255-x)*(f-1):x*f)));return `rgb(${m(r)},${m(g)},${m(b)})`}
function mix(a,b,k){const A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16);const f=(s)=>Math.round(((A>>s)&255)*(1-k)+((B>>s)&255)*k);return '#'+[16,8,0].map(s=>f(s).toString(16).padStart(2,'0')).join('')}
function bandCol(v){const B=bands();if(v==null)return '#5d6b7a';if(v>=B.g)return mix('#2fa866','#5fd08c',Math.min(1,(v-B.g)/10));if(v>=B.a)return mix('#d6353f','#d99a2b',.55+.45*(v-B.a)/(B.g-B.a));return mix('#8f1d24','#d6353f',Math.max(0,Math.min(1,v/B.a)))}
function bg(g,W,H){const r=g.createRadialGradient(W/2,H*.45,10,W/2,H*.5,Math.max(W,H)*.8);r.addColorStop(0,'#1a2a42');r.addColorStop(1,'#08111f');g.fillStyle=r;g.fillRect(0,0,W,H)}
function label(g,x,y,txt,bold,size){g.font=(bold?'bold ':'')+(size||12)+'px system-ui';g.textAlign='center';const w=g.measureText(txt).width;g.fillStyle='rgba(8,16,30,.78)';g.fillRect(x-w/2-6,y-15,w+12,19);g.fillStyle='#fff';g.fillText(txt,x,y-1)}
const short=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,n-1)+'…':s};

/* ---------- تخطيط مشترك: الأحياء = القطاعات ---------- */
function layout(){const P=pjs(),S=secs().filter(s=>P.some(p=>p.sec==s.id)),other=P.filter(p=>!S.some(s=>s.id==p.sec));if(other.length)S.push({id:'__o',n:'أخرى'});
 const n=Math.max(1,S.length),cols=Math.ceil(Math.sqrt(n)),cell=46,gap=46,D=[];let x0=0,maxW=0,rowsW=[],items=[];
 const dists=S.map(s=>{const L=P.filter(p=>s.id=='__o'?!S.some(z=>z.id==p.sec&&z.id!='__o'):p.sec==s.id).sort((a,b)=>(a.ps??0)-(b.ps??0));const sc=Math.max(1,Math.ceil(Math.sqrt(L.length)));return {s,L,sc,size:sc*cell+24}});
 const sz=Math.max(...dists.map(d=>d.size),100);
 dists.forEach((d,i)=>{const r=Math.floor(i/cols),c=i%cols;d.cx=(c-(cols-1)/2)*(sz+gap);d.cz=(r-(Math.ceil(n/cols)-1)/2)*(sz+gap);d.half=d.size/2;
  d.L.forEach((p,j)=>{const a=Math.floor(j/d.sc),b=j%d.sc;const x=d.cx-d.half+24/2+cell/2+b*cell,z=d.cz-d.half+24/2+cell/2+a*cell;const fp=14+Math.min(18,Math.sqrt(p.tasks||p.size||6)*2.4);
   items.push({p,x,z,fp,h:Math.max(3,(p.act||0)*1.1),hp:p.exp!=null?Math.max(0,p.exp*1.1):null,pend:pendOf(p.pc),risk:p.rHigh||0,col:colOf(p),dist:d})})});
 const span=Math.max(260,(cols)*(sz+gap));return {D:dists,items,span,P}}

/* ================== 1) مدينة المحفظة ================== */
function drawCity(g,c,L,t,o){o=o||{};const W=c.w,H=c.h;bg(g,W,H);
 // أرضية
 const ext=L.span*.62;g.beginPath();[[-ext,-ext],[ext,-ext],[ext,ext],[-ext,ext]].forEach(([x,z],i)=>{const [a,b]=proj(c,x,0,z);i?g.lineTo(a,b):g.moveTo(a,b)});g.closePath();g.fillStyle='rgba(30,48,74,.55)';g.fill();
 for(let k=-ext;k<=ext;k+=46){g.beginPath();let [a,b]=proj(c,k,0,-ext);g.moveTo(a,b);[a,b]=proj(c,k,0,ext);g.lineTo(a,b);[a,b]=proj(c,-ext,0,k);g.moveTo(a,b);[a,b]=proj(c,ext,0,k);g.lineTo(a,b);g.strokeStyle='rgba(120,160,200,.07)';g.lineWidth=1;g.stroke()}
 // الأحياء
 L.D.forEach(d=>{const on=!o.sec||o.sec=='all'||o.sec==d.s.id;g.beginPath();[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([a,b],i)=>{const [x,y]=proj(c,d.cx+a*d.half,0,d.cz+b*d.half);i?g.lineTo(x,y):g.moveTo(x,y)});g.closePath();g.fillStyle=on?'rgba(60,90,130,.45)':'rgba(60,90,130,.15)';g.fill();g.strokeStyle=on?'rgba(160,200,240,.45)':'rgba(160,200,240,.12)';g.lineWidth=1.2;g.stroke();
  const [lx,ly]=proj(c,d.cx,0,d.cz+d.half+14);g.globalAlpha=on?1:.35;g.fillStyle='#cfe0f2';g.font='bold '+(W<640?13:12)+'px system-ui';g.textAlign='center';g.fillText(d.s.n,lx,ly);g.globalAlpha=1});
 // المباني
 const B=L.items.map(b=>{const [,,,z]=proj(c,b.x,b.h/2,b.z);return Object.assign(b,{dz:z})}).sort((a,b)=>b.dz-a.dz);
 const lx=.55,lz=-.83;
 B.forEach(b=>{const vis=o.vis?o.vis(b):true,sel=o.sel===b,hv=o.hover===b;g.globalAlpha=vis?1:.13;const f=b.fp/2,H0=b.h;
  const P=[[b.x-f,b.z-f],[b.x+f,b.z-f],[b.x+f,b.z+f],[b.x-f,b.z+f]];
  const faces=[[0,1,0,-1],[1,2,1,0],[2,3,0,1],[3,0,-1,0]].map(([i,j,nx,nz])=>{const a=P[i],q=P[j];const pts=[proj(c,a[0],0,a[1]),proj(c,q[0],0,q[1]),proj(c,q[0],H0,q[1]),proj(c,a[0],H0,a[1])];return {pts,z:(pts[0][3]+pts[1][3]+pts[2][3]+pts[3][3])/4,l:.62+.38*Math.max(0,nx*lx+nz*lz)}}).sort((a,b)=>b.z-a.z);
  faces.forEach(F=>{g.beginPath();F.pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fillStyle=shade(b.col,F.l);g.fill();g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=.6;g.stroke();
   // نوافذ
   if(H0>24&&vis){g.fillStyle='rgba(255,240,200,'+(.10+.08*Math.sin(t/900+hashS(b.p.pc)%7))+')';const rows=Math.floor(H0/14);for(let r=1;r<rows;r++){const k=r/rows,a=F.pts[0],q=F.pts[1],a2=F.pts[3],q2=F.pts[2];const ax=a[0]+(a2[0]-a[0])*k,ay=a[1]+(a2[1]-a[1])*k,qx=q[0]+(q2[0]-q[0])*k,qy=q[1]+(q2[1]-q[1])*k;g.fillRect(Math.min(ax,qx)+(Math.abs(qx-ax))*.2,Math.min(ay,qy)-1,Math.abs(qx-ax)*.6,1.6)}}});
  const top=P.map(([x,z])=>proj(c,x,H0,z));g.beginPath();top.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fillStyle=shade(b.col,1.18);g.fill();g.strokeStyle=sel?'#ffe49a':hv?'#fff':'rgba(255,255,255,.35)';g.lineWidth=sel||hv?2.5:1;g.stroke();
  b.sx=(top[0][0]+top[2][0])/2;b.sy=Math.min(...top.map(p=>p[1]));b.bb=[Math.min(...faces.flatMap(F=>F.pts.map(p=>p[0])),...top.map(p=>p[0])),Math.min(...top.map(p=>p[1]),...faces.flatMap(F=>F.pts.map(p=>p[1]))),Math.max(...faces.flatMap(F=>F.pts.map(p=>p[0])),...top.map(p=>p[0])),Math.max(...faces.flatMap(F=>F.pts.map(p=>p[1])))];
  // الارتفاع المخطط
  if(b.hp!=null&&vis&&Math.abs(b.hp-H0)>3){const pt=P.map(([x,z])=>proj(c,x,b.hp,z));g.beginPath();pt.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.setLineDash([4,3]);g.strokeStyle='rgba(255,255,255,.75)';g.lineWidth=1.2;g.stroke();
   if(b.hp>H0){[0,1,2,3].forEach(i=>{g.beginPath();g.moveTo(top[i][0],top[i][1]);g.lineTo(pt[i][0],pt[i][1]);g.stroke()})}g.setLineDash([])}
  // رافعة = قرار معلّق
  if(b.pend.length&&vis){const [mx,my]=proj(c,b.x,H0,b.z),[tx,ty]=proj(c,b.x,H0+30,b.z),[ax,ay]=proj(c,b.x+20,H0+30,b.z),[fx,fy]=proj(c,b.x+20,H0+20,b.z);g.strokeStyle='#e9c46a';g.lineWidth=2;g.beginPath();g.moveTo(mx,my);g.lineTo(tx,ty);g.lineTo(ax,ay);g.stroke();g.lineWidth=1;g.beginPath();g.moveTo(ax,ay);g.lineTo(fx,fy);g.stroke();g.fillStyle='#e9c46a';g.fillRect(fx-3,fy,6,5)}
  // منارة = مخاطر عالية
  if(b.risk&&vis){const [rx,ry]=proj(c,b.x-f*.5,H0+4,b.z-f*.5);const a=.45+.55*Math.abs(Math.sin(t/400));g.fillStyle='rgba(255,70,80,'+a+')';g.beginPath();g.arc(rx,ry,3.6,0,7);g.fill()}
  if(vis&&(sel||hv||(o.labels&&o.labels.has(b))))label(g,b.sx,b.sy-8,short(b.p.n,30),sel||hv,W<640?(sel||hv?15:13):(sel||hv?13:11.5));
  g.globalAlpha=1})}
function cityLegend(){return `<span><i style="background:${COL.ok}"></i>على المسار</span><span><i style="background:${COL.warn}"></i>يحتاج متابعة</span><span><i style="background:${COL.bad}"></i>متعثر</span><span>⬚ الإطار المنقّط = الارتفاع المخطط</span><span style="color:#e9c46a">⟋ رافعة = قرار معلّق</span><span style="color:#ff6b74">● منارة = مخاطر عالية</span>`}

/* ================== 2) التضاريس ================== */
function terrainGrid(L,psOf,N){N=N||(innerWidth<640?26:34);const ext=L.span*.55,stp=2*ext/N,sig=Math.max(40,L.span/9),Z=[];
 const pts=L.items.map(b=>({x:b.x,z:b.z,w:1+Math.sqrt(b.p.tasks||4)*.4,v:psOf(b.p)})).filter(q=>q.v!=null);
 for(let i=0;i<=N;i++){const row=[];for(let j=0;j<=N;j++){const x=-ext+j*stp,z=-ext+i*stp;let sw=0,sv=0;pts.forEach(q=>{const d2=(q.x-x)**2+(q.z-z)**2,k=q.w*Math.exp(-d2/(2*sig*sig));sw+=k;sv+=k*q.v});
  const v=sw>1e-3?sv/sw:null,conf=Math.min(1,sw/1.2),B=bands(),e=v==null?0:Math.max(-60,Math.min(45,(v-(B.a+B.g)/2)*1.7))*conf;row.push({x,z,y:e,v,conf})}Z.push(row)}
 return {Z,N,ext,stp}}
function drawTerrain(g,c,L,T,t,o){o=o||{};const W=c.w,H=c.h;bg(g,W,H);const {Z,N}=T;const quads=[];
 const lx=.5,ly=.75,lz=-.43;
 for(let i=0;i<N;i++)for(let j=0;j<N;j++){const a=Z[i][j],b=Z[i][j+1],q=Z[i+1][j+1],d=Z[i+1][j];const pa=proj(c,a.x,a.y,a.z),pb=proj(c,b.x,b.y,b.z),pq=proj(c,q.x,q.y,q.z),pd=proj(c,d.x,d.y,d.z);
  const ux=b.x-a.x,uy=b.y-a.y,uz=b.z-a.z,vx=d.x-a.x,vy=d.y-a.y,vz=d.z-a.z;let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;const nl=Math.hypot(nx,ny,nz)||1;if(ny<0){nx=-nx;ny=-ny;nz=-nz}const l=.45+.55*Math.max(0,(nx*lx+ny*ly+nz*lz)/nl);
  const vs=[a,b,q,d].filter(z=>z.v!=null),v=vs.length?vs.reduce((s,z)=>s+z.v,0)/vs.length:null,cf=(a.conf+b.conf+q.conf+d.conf)/4;
  quads.push({p:[pa,pb,pq,pd],z:(pa[3]+pb[3]+pq[3]+pd[3])/4,col:cf<.12?'#3a4a5e':mix('#3a4a5e',bandCol(v),Math.min(1,cf*1.4)),l})}
 quads.sort((a,b)=>b.z-a.z).forEach(Q=>{g.beginPath();Q.p.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fillStyle=shade(Q.col,Q.l);g.fill();g.strokeStyle='rgba(0,0,0,.12)';g.lineWidth=.5;g.stroke()});
 // أسماء القطاعات
 L.D.forEach(d=>{const [x,y]=proj(c,d.cx,60,d.cz);g.globalAlpha=.9;label(g,x,y,d.s.n,true,W<640?13:12);g.globalAlpha=1});
 // دبابيس المشاريع
 const at=(x,z)=>{const s=T.stp,i=Math.max(0,Math.min(N,Math.round((z+T.ext)/s))),j=Math.max(0,Math.min(N,Math.round((x+T.ext)/s)));return Z[i][j].y};
 L.items.forEach(b=>{const y=at(b.x,b.z);const [x0,y0,,z0]=proj(c,b.x,y,b.z),[x1,y1]=proj(c,b.x,y+16,b.z);b.sx=x1;b.sy=y1;b.dz=z0;b.bb=[x1-9,y1-9,x1+9,y0];const vis=o.vis?o.vis(b):true,sel=o.sel===b,hv=o.hover===b;g.globalAlpha=vis?1:.15;
  g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=1;g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke();g.beginPath();g.arc(x1,y1,sel||hv?6:4,0,7);g.fillStyle=bandCol(b.v!=null?b.v:b.p.ps);g.fill();g.strokeStyle='#fff';g.lineWidth=sel||hv?2:1;g.stroke();
  if(vis&&(sel||hv||(o.labels&&o.labels.has(b))))label(g,x1,y1-9,short(b.p.n,30),sel||hv,W<640?13:11.5);g.globalAlpha=1})}

/* ================== 3) الكرة المؤسسية ================== */
let GOALS=null,PGOAL=null;
async function loadGoals(){if(GOALS)return;GOALS=[];PGOAL={};try{const sb=G('sb');const [a,b]=await Promise.all([sb.from('app_settings').select('key,value').in('key',['opt_lists','opt_goals']),sb.from('charters').select('code,goal:data->>goal').eq('archived',false)]);
 let u={};(a.data||[]).forEach(r=>{try{if(r.key=='opt_lists')u=Object.assign({},JSON.parse(r.value||'{}'),u);if(r.key=='opt_goals'&&!u.goals){const gg=JSON.parse(r.value||'[]');if(Array.isArray(gg)&&gg.length)u.goals=gg}}catch(_){}});
 const GA=['الأول','الثاني','الثالث','الرابع','الخامس','السادس','السابع'];GOALS=(Array.isArray(u.goals)&&u.goals.length?u.goals:GA.map(x=>['الهدف '+x])).map((x,i)=>({i:i+1,n:Array.isArray(x)?x[0]:String(x)}));
 (b.data||[]).forEach(r=>{if(r.goal)PGOAL[r.code]=+r.goal});if(b.error||!Object.keys(PGOAL).length)GOALS=null}catch(_){GOALS=null}}
function globeModel(){const P=pjs(),gl=(GOALS||[]).slice();const un=P.filter(p=>!PGOAL||!PGOAL[p.pc]||!gl.some(x=>x.i==PGOAL[p.pc]));const G2=gl.concat(un.length?[{i:0,n:'بدون هدف محدد'}]:[]);
 const n=G2.length,tw=P.reduce((s,p)=>s+(p.w||1),0)||1;
 G2.forEach((x,k)=>{const yy=1-(k+.5)/n*2,r=Math.sqrt(1-yy*yy),ph=k*2.399963;x.c=[Math.cos(ph)*r,yy*.85,Math.sin(ph)*r];const l=Math.hypot(...x.c);x.c=x.c.map(v=>v/l);
  x.L=P.filter(p=>x.i?PGOAL&&PGOAL[p.pc]==x.i:un.includes(p));const w=x.L.reduce((s,p)=>s+(p.w||1),0);x.v=w?Math.round(x.L.reduce((s,p)=>s+(p.ps||0)*(p.w||1),0)/w):null;x.share=Math.round(w/tw*100);
  // نقاط القارة
  const seed=hashS(x.n),pts=[];const cnt=26+Math.min(40,x.L.length*6);for(let m=0;m<cnt;m++){const a=((seed>>m%16)%360+m*137.5)*Math.PI/180,rr=.06+.34*Math.sqrt(((seed*(m+3))%997)/997);pts.push(offs(x.c,a,rr))}x.pts=pts;
  x.lights=x.L.map((p,m)=>({p,v:offs(x.c,(hashS(p.pc)%360)*Math.PI/180,.08+.22*((hashS(p.pc+'x')%100)/100)),col:colOf(p),goal:x}))});
 return {G:G2,P}}
function offs(c,a,r){const up=Math.abs(c[1])>.9?[1,0,0]:[0,1,0];let t1=[up[1]*c[2]-up[2]*c[1],up[2]*c[0]-up[0]*c[2],up[0]*c[1]-up[1]*c[0]];const l1=Math.hypot(...t1);t1=t1.map(v=>v/l1);const t2=[c[1]*t1[2]-c[2]*t1[1],c[2]*t1[0]-c[0]*t1[2],c[0]*t1[1]-c[1]*t1[0]];
 const v=[c[0]*Math.cos(r)+(t1[0]*Math.cos(a)+t2[0]*Math.sin(a))*Math.sin(r),c[1]*Math.cos(r)+(t1[1]*Math.cos(a)+t2[1]*Math.sin(a))*Math.sin(r),c[2]*Math.cos(r)+(t1[2]*Math.cos(a)+t2[2]*Math.sin(a))*Math.sin(r)];const l=Math.hypot(...v);return v.map(q=>q/l)}
function drawGlobe(g,c,M,t,o){o=o||{};const W=c.w,H=c.h;bg(g,W,H);const R=Math.min(W,H)*.36*c.zoom,cx=W/2,cy=H*.5;
 const rot=v=>{const cyw=Math.cos(c.yaw),syw=Math.sin(c.yaw),cp=Math.cos(c.pitch-.5),sp=Math.sin(c.pitch-.5);let x=v[0]*cyw-v[2]*syw,z=v[0]*syw+v[2]*cyw,y=v[1]*cp-z*sp;z=v[1]*sp+z*cp;return [cx+x*R,cy-y*R,z]};
 // هالة وكرة
 const hal=g.createRadialGradient(cx,cy,R*.9,cx,cy,R*1.25);hal.addColorStop(0,'rgba(120,180,255,.22)');hal.addColorStop(1,'rgba(120,180,255,0)');g.fillStyle=hal;g.beginPath();g.arc(cx,cy,R*1.25,0,7);g.fill();
 const sp=g.createRadialGradient(cx-R*.35,cy-R*.4,R*.1,cx,cy,R);sp.addColorStop(0,'#2b4f7c');sp.addColorStop(1,'#0e1f36');g.fillStyle=sp;g.beginPath();g.arc(cx,cy,R,0,7);g.fill();
 // خطوط الطول والعرض
 g.lineWidth=.6;for(let la=-60;la<=60;la+=30){g.beginPath();let st=0;for(let lo=0;lo<=360;lo+=6){const a=lo*Math.PI/180,b=la*Math.PI/180,[x,y,z]=rot([Math.cos(b)*Math.cos(a),Math.sin(b),Math.cos(b)*Math.sin(a)]);if(z<0){st?g.lineTo(x,y):g.moveTo(x,y);st=1}else st=0}g.strokeStyle='rgba(160,200,240,.16)';g.stroke()}
 for(let lo=0;lo<180;lo+=30){g.beginPath();let st=0;for(let la=0;la<=360;la+=6){const a=lo*Math.PI/180,b=la*Math.PI/180,[x,y,z]=rot([Math.cos(b)*Math.cos(a),Math.sin(b),Math.cos(b)*Math.sin(a)]);if(z<0){st?g.lineTo(x,y):g.moveTo(x,y);st=1}else st=0}g.strokeStyle='rgba(160,200,240,.12)';g.stroke()}
 // القارات
 M.G.forEach(x=>{const on=!o.goal||o.goal===x;const col=bandCol(x.v);x.pts.forEach(v=>{const [px,py,z]=rot(v);if(z>.15)return;g.globalAlpha=(on?1:.25)*Math.min(1,(-z+.15)*1.6);g.fillStyle=col;g.beginPath();g.arc(px,py,R*.028,0,7);g.fill()});g.globalAlpha=1});
 // الأضواء = المشاريع
 const LT=[];M.G.forEach(x=>x.lights.forEach(l=>{const [px,py,z]=rot(l.v.map(q=>q*1.02));l.sx=px;l.sy=py;l.dz=z;l.bb=[px-9,py-9,px+9,py+9];LT.push(l)}));
 LT.sort((a,b)=>b.dz-a.dz).forEach(l=>{if(l.dz>.05)return;const vis=o.vis?o.vis(l):true,sel=o.sel===l,hv=o.hover===l,a=Math.min(1,(-l.dz+.05)*2)*(vis?1:.2);g.globalAlpha=a;const rr=(sel||hv?7:4.2)*(1+.15*Math.sin(t/500+hashS(l.p.pc)%9));
  const gl=g.createRadialGradient(l.sx,l.sy,0,l.sx,l.sy,rr*3);gl.addColorStop(0,l.col);gl.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gl;g.beginPath();g.arc(l.sx,l.sy,rr*3,0,7);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(l.sx,l.sy,rr*.45,0,7);g.fill();
  if(sel||hv)label(g,l.sx,l.sy-12,short(l.p.n,30),true,W<640?14:12.5);g.globalAlpha=1});
 // أسماء الأهداف
 M.G.forEach(x=>{const [px,py,z]=rot(x.c);if(z>-.1)return;const on=!o.goal||o.goal===x;g.globalAlpha=on?1:.35;label(g,px,py+R*.02,short(x.n,26)+(x.v!=null?' · '+x.v:''),true,W<640?12.5:12);g.globalAlpha=1})}

/* ---------- لوحة جانبية ---------- */
function projCard(p,extra){const pend=pendOf(p.pc);return `<div class="v3-card"><span class="v3-st" style="background:${colOf(p)}">${SNM[p.status]||''}</span><h4>${E(p.n)}</h4><small>${E(secN(p.sec))}${p.pm?' · مدير المشروع: '+E(p.pm):''}</small>
 <div class="v3-m"><span>الإنجاز / المتوقع</span><b>${p.act!=null?Math.round(p.act)+'٪ / '+Math.round(p.exp||0)+'٪':'—'}</b><span>النسبة إلى المخطط</span><b>${p.ps!=null?p.ps+'٪':'—'}</b>${p.late?`<span>مهام متأخرة</span><b>${p.late}</b>`:''}${p.rHigh?`<span>مخاطر عالية</span><b style="color:#d6353f">${p.rHigh}</b>`:''}${pend.length?`<span>قرارات عند المكتب</span><b>${nDc(pend.length)}</b>`:''}${p.ed?`<span>الموعد المخطط للانتهاء</span><b>${E(String(p.ed).slice(0,10))}</b>`:''}</div>${extra||''}
 <div class="v3-row"><button class="p" type="button" data-v3o="${E(p.pc)}">فتح المشروع</button><button type="button" data-v3x="1">✕ إغلاق</button></div></div>`}

/* ---------- محرّك العرض الواحد ---------- */
const V={cur:null};
function stop(){if(V.cur){cancelAnimationFrame(V.cur.raf);if(V.cur.ro)V.cur.ro.disconnect();V.cur=null}}
function shell(id,tools,leg,help){css();return `<div class="v3"><div class="v3-box" id="v3b"><canvas id="v3c" tabindex="0" aria-label="${E(id)}"></canvas><div class="v3-tb">${tools}</div><div class="v3-lg">${leg}</div><div class="v3-cap" id="v3cap" hidden></div></div><aside class="v3-sd" id="v3sd"><div class="v3-card v3-help">${help}</div></aside></div>`}
function boot(kind,draw,cfg){stop();const cv=$i('v3c');if(!cv)return;const box=$i('v3b');const c=mkCam(cfg.cam);const st={c,kind,draw,cfg,raf:0,lt:0,items:cfg.items||(()=>[])};V.cur=st;
 const fit=()=>{const w=box.clientWidth,h=w<640?Math.max(380,Math.min(560,Math.round(innerHeight*.58))):Math.max(440,Math.min(660,Math.round(w*.62)));const dp=Math.min(2,devicePixelRatio||1);cv.width=w*dp;cv.height=h*dp;cv.style.width=w+'px';cv.style.height=h+'px';c.w=w;c.h=h;c.dp=dp;c.dirty=1};fit();
 if(c.w<640){c.auto=false;c.zoom*=1.15}
 st.ro=new ResizeObserver(()=>{if(Math.abs(box.clientWidth-c.w)>20)fit()});st.ro.observe(box);
 const pos=e=>{const r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};
 const pick=(x,y)=>{let best=null,bz=1e9;st.items().forEach(b=>{if(!b.bb)return;const pad=c.w<640?8:3;if(x>=b.bb[0]-pad&&x<=b.bb[2]+pad&&y>=b.bb[1]-pad&&y<=b.bb[3]+pad&&(b.dz??0)<bz&&(!cfg.vis||cfg.vis(b))){bz=b.dz??0;best=b}});return best};
 cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);c.drag={x:e.clientX,y:e.clientY,yaw:c.yaw,pitch:c.pitch,mv:0};c.anim=null};
 cv.onpointermove=e=>{if(c.drag){const dx=e.clientX-c.drag.x,dy=e.clientY-c.drag.y;c.drag.mv=Math.max(c.drag.mv,Math.abs(dx)+Math.abs(dy));if(c.drag.mv>4){c.yaw=c.drag.yaw+dx*.008;c.pitch=Math.max(cfg.pmin??.08,Math.min(cfg.pmax??1.45,c.drag.pitch+dy*.006));c.dirty=1}return}const [x,y]=pos(e),h=pick(x,y);if(h!==c.hover){c.hover=h;c.dirty=1;hiList()}cv.style.cursor=h?'pointer':'grab'};
 cv.onpointerup=e=>{const d=c.drag;c.drag=null;if(d&&d.mv<6){const [x,y]=pos(e),h=pick(x,y);if(h){if(c.sel===h&&Date.now()-(c.lc||0)<450)openP(h.p.pc);else select(h,false)}else{c.sel=null;side()}c.lc=Date.now()}c.dirty=1};
 cv.onpointerleave=()=>{c.hover=null;c.dirty=1;hiList()};
 cv.onwheel=e=>{e.preventDefault();c.zoom=Math.max(.5,Math.min(3.2,c.zoom*(e.deltaY>0?.9:1.1)));c.dirty=1};
 let pd=null;cv.addEventListener('touchmove',e=>{if(e.touches.length==2){e.preventDefault();const dd=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);if(pd)c.zoom=Math.max(.5,Math.min(3.2,c.zoom*dd/pd));pd=dd;c.drag=null;c.dirty=1}},{passive:false});cv.addEventListener('touchend',()=>pd=null);
 cv.onkeydown=e=>{const k={ArrowLeft:[-.12,0],ArrowRight:[.12,0],ArrowUp:[0,-.08],ArrowDown:[0,.08]}[e.key];if(k){e.preventDefault();c.yaw+=k[0];c.pitch=Math.max(cfg.pmin??.08,Math.min(cfg.pmax??1.45,c.pitch+k[1]))}if(e.key=='+'||e.key=='=')c.zoom=Math.min(3.2,c.zoom*1.1);if(e.key=='-')c.zoom=Math.max(.5,c.zoom/1.1);if(e.key=='Escape'){c.sel=null;side()}c.dirty=1};
 const loop=t=>{if(!$i('v3c')){st.raf=0;return}const mv=step(c,t)||c.drag||c.dirty;if(!document.hidden&&(mv||t-st.lt>140)){const g=cv.getContext('2d');g.setTransform(c.dp,0,0,c.dp,0,0);g.setLineDash([]);draw(g,c,t);st.lt=t;c.dirty=0}st.raf=requestAnimationFrame(loop)};st.raf=requestAnimationFrame(loop);
 side();return st}
function select(b,fly){const st=V.cur;if(!st)return;st.c.sel=b;st.c.auto=false;if(fly&&st.cfg.fly)st.cfg.fly(b);st.c.dirty=1;side()}
function hiList(){const el=$i('v3sd'),st=V.cur;if(!el||!st)return;el.querySelectorAll('[data-v3p]').forEach(x=>x.classList.toggle('hv',!!st.c.hover&&x.dataset.v3p==st.c.hover.p.pc))}
function side(){const st=V.cur,el=$i('v3sd');if(!st||!el)return;const c=st.c;let h='';
 if(c.sel)h+=projCard(c.sel.p,st.cfg.extra?st.cfg.extra(c.sel):'');
 h+=st.cfg.side?st.cfg.side():'';el.innerHTML=h;
 el.querySelectorAll('[data-v3o]').forEach(b=>b.onclick=()=>openP(b.dataset.v3o));el.querySelectorAll('[data-v3x]').forEach(b=>b.onclick=()=>{c.sel=null;c.dirty=1;side()});
 el.querySelectorAll('[data-v3p]').forEach(b=>{b.onclick=()=>{const it=st.items().find(x=>x.p.pc==b.dataset.v3p);if(it)select(it,true)};b.onmouseenter=()=>{c.hover=st.items().find(x=>x.p.pc==b.dataset.v3p)||null;c.dirty=1};b.onmouseleave=()=>{c.hover=null;c.dirty=1}});
 if(st.cfg.bindSide)st.cfg.bindSide(el)}
function listH(L,title){return `<div class="v3-card"><b style="display:block;margin-bottom:6px">${title}</b>${L.map(b=>`<button type="button" class="v3-li" data-v3p="${E(b.p.pc)}"><i style="background:${colOf(b.p)}"></i><b>${E(short(b.p.n,40))}</b><em>${b.p.ps!=null?b.p.ps+'٪':''}</em></button>`).join('')||'<div class="v3-help">لا مشاريع</div>'}</div>`}
function worst(items,n){return new Set(items.slice().sort((a,b)=>(a.p.ps??0)-(b.p.ps??0)).slice(0,n))}

/* ---- مدينة ---- */
let CF={sec:'all',fo:'all'};
function vis(b){if(CF.sec!='all'&&b.p.sec!=CF.sec&&!(CF.sec=='__o'&&b.dist&&b.dist.s.id=='__o'))return false;if(CF.fo=='bad'&&b.p.status!='bad')return false;if(CF.fo=='warn'&&b.p.status=='ok')return false;if(CF.fo=='pend'&&!pendOf(b.p.pc).length)return false;if(CF.fo=='risk'&&!b.p.rHigh)return false;return true}
function filt(L){const secs2=L.D.map(d=>d.s);return `<select id="v3sec" aria-label="القطاع"><option value="all">كل القطاعات</option>${secs2.map(s=>`<option value="${E(s.id)}" ${CF.sec==s.id?'selected':''}>${E(s.n)}</option>`).join('')}</select>${[['all','الكل'],['warn','تحتاج متابعة أو متعثرة'],['bad','متعثرة'],['pend','بقرار معلّق'],['risk','بمخاطر عالية']].map(([k,t])=>`<button type="button" data-v3f="${k}" class="${CF.fo==k?'on':''}">${t}</button>`).join('')}`}
function bindFilt(){const s=$i('v3sec');if(s)s.onchange=e=>{CF.sec=e.target.value;if(V.cur){V.cur.c.dirty=1;side()}};document.querySelectorAll('[data-v3f]').forEach(b=>b.onclick=()=>{CF.fo=b.dataset.v3f;document.querySelectorAll('[data-v3f]').forEach(x=>x.classList.toggle('on',x===b));if(V.cur){V.cur.c.dirty=1;side()}})}
function cityHTML(){const L=layout();return {svg:shell('مدينة المحفظة',filt(L)+`<button type="button" id="v3rot">${reduce?'▶ دوران':'⏸ إيقاف الدوران'}</button><button type="button" id="v3rst">↺</button><button type="button" id="v3stage">🎬 المسرح</button>`,cityLegend(),
 `<b>كيف تُقرأ المدينة؟</b><br>كل <b>حي</b> قطاع، وكل <b>مبنى</b> مشروع جارٍ. <b>ارتفاع المبنى</b> = نسبة الإنجاز الفعلية، و<b>الإطار المنقّط</b> = الارتفاع الذي كان يُفترض الوصول إليه اليوم. <b>اللون</b> = الحالة، و<b>مساحة المبنى</b> = عدد المهام. <b>الرافعة</b> = قرار معلّق عند المكتب، و<b>المنارة الحمراء</b> = مخاطر عالية.<br>اسحب للتدوير، واقرص أو مرّر للتكبير، واضغط مبنى لتفاصيله ومرتين لفتح المشروع.`),
 leg:'',ins:cityIns(L)}}
function cityIns(L){const b=L.items.filter(x=>x.p.status=='bad'),p=L.items.filter(x=>x.pend.length);const worstD=L.D.map(d=>({d,v:d.L.length?Math.round(d.L.reduce((s,q)=>s+(q.ps||0),0)/d.L.length):null})).filter(x=>x.v!=null).sort((a,b)=>a.v-b.v)[0];
 return `${nP(L.items.length)} في ${L.D.length} ${L.D.length<=2?'حي':'أحياء'}${b.length?` · ${b.length} ${b.length==1?'مبنى متعثر':'مبانٍ متعثرة'}`:''}${p.length?` · ${p.length} ${p.length==1?'مبنى عليه رافعة':'مبانٍ عليها رافعات'} (قرارات معلّقة)`:''}${worstD?` · أضعف حي: ${E(worstD.d.s.n)} (${worstD.v}٪ من المخطط)`:''}`}
function cityStart(){const L=layout();const lab=worst(L.items,3);
 const st=boot('city',(g,c,t)=>drawCity(g,c,L,t,{sel:c.sel,hover:c.hover,vis,labels:CF.fo=='all'&&CF.sec=='all'?lab:new Set(L.items.filter(vis).slice(0,8)),sec:CF.sec}),
  {cam:{span:L.span,yaw:-.75,pitch:.62,zoom:.78},items:()=>L.items,vis,fly:b=>anim(V.cur.c,V.cur.c.yaw,.7,1.7,1200,b.x,b.z),
   side:()=>listH(L.items.filter(vis).sort((a,b)=>(a.p.ps??0)-(b.p.ps??0)),'المشاريع من الأحرج إلى الأفضل')+`<div class="v3-card v3-help"><b>كيف تُقرأ المدينة؟</b><br>ارتفاع المبنى = الإنجاز الفعلي، والإطار المنقّط = المخطط حتى اليوم. اللون = الحالة. الرافعة = قرار معلّق عند المكتب، والمنارة الحمراء = مخاطر عالية.</div>`});
 commonBtns(st,()=>anim(st.c,-.75,.62,.78));bindFilt()}
function commonBtns(st,rst){const r=$i('v3rot');if(r){r.textContent=st.c.auto?'⏸ إيقاف الدوران':'▶ دوران';r.onclick=()=>{st.c.auto=!st.c.auto;r.textContent=st.c.auto?'⏸ إيقاف الدوران':'▶ دوران'}}const z=$i('v3rst');if(z)z.onclick=()=>{st.c.sel=null;rst();side()};const s=$i('v3stage');if(s)s.onclick=()=>stage()}

/* ---- تضاريس ---- */
let TW=0,RVD=null;
function psAt(p,w){if(!w||!RVD||!RVD[p.pc])return p.ps;const a=RVD[p.pc],r=a[a.length-1-w];if(!r)return null;const ac=+r[1],pl=+r[2];if(!(pl>=5))return 100;return Math.max(0,Math.min(100,Math.round(ac/pl*100)))}
function terrainHTML(){const L=layout();return {svg:shell('التضاريس',`<label>الأسبوع <input type="range" id="v3w" min="0" max="8" step="1" value="${8-TW}" aria-label="الأسبوع"><span id="v3wl">${TW?'قبل '+TW+(TW==1?' أسبوع':TW==2?' أسبوعين':' أسابيع'):'اليوم'}</span></label><button type="button" id="v3play">▶ تشغيل الأسابيع</button><button type="button" id="v3rot">⏸ إيقاف الدوران</button><button type="button" id="v3rst">↺</button><button type="button" id="v3stage">🎬 المسرح</button>`,
 `<span><i style="background:#2fa866"></i>قمم = على المسار</span><span><i style="background:#d99a2b"></i>سهول = يحتاج متابعة</span><span><i style="background:#d6353f"></i>وديان = متعثر</span><span><i style="background:#3a4a5e"></i>لا مشاريع</span>`,
 `<b>كيف تُقرأ التضاريس؟</b><br>الأرض مقسّمة إلى القطاعات نفسها في المدينة. <b>الارتفاع واللون</b> = نسبة إنجاز المشاريع في تلك البقعة إلى المخطط: القمم الخضراء على المسار، والوديان الحمراء متعثرة. الدبابيس = المشاريع. حرّك شريط <b>الأسبوع</b> لترى كيف تغيّرت الأرض خلال الأسابيع الثمانية الماضية.`),leg:'',ins:terrIns(L)}}
function terrIns(L){const D=L.D.map(d=>({d,v:d.L.length?Math.round(d.L.reduce((s,q)=>s+(psAt(q,TW)||0),0)/d.L.length):null})).filter(x=>x.v!=null).sort((a,b)=>a.v-b.v);if(!D.length)return '';return `أعمق وادٍ: ${E(D[0].d.s.n)} (${D[0].v}٪)${D.length>1?` · أعلى قمة: ${E(D[D.length-1].d.s.n)} (${D[D.length-1].v}٪)`:''}`}
async function terrainStart(){const L=layout();let T=terrainGrid(L,p=>psAt(p,TW));L.items.forEach(b=>b.v=psAt(b.p,TW));const lab=worst(L.items,3);
 const st=boot('terrain',(g,c,t)=>drawTerrain(g,c,L,T,t,{sel:c.sel,hover:c.hover,labels:lab}),{cam:{span:L.span,yaw:-.7,pitch:.78,zoom:1.05,cy:.6},items:()=>L.items,pmin:.25,
  fly:b=>anim(V.cur.c,V.cur.c.yaw,.85,1.6,1200,b.x,b.z),extra:b=>TW&&b.v!=null?`<div class="v3-m"><span>قبل ${TW} ${TW==1?'أسبوع':TW==2?'أسبوعين':'أسابيع'}</span><b>${b.v}٪</b></div>`:'',
  side:()=>`<div class="v3-card"><b style="display:block;margin-bottom:6px">القطاعات من الأعمق إلى الأعلى</b>${L.D.map(d=>({d,v:d.L.length?Math.round(d.L.reduce((s,q)=>s+(psAt(q,TW)||0),0)/d.L.length):null})).sort((a,b)=>(a.v??0)-(b.v??0)).map(x=>`<div class="v3-li" style="cursor:default"><i style="background:${bandCol(x.v)}"></i><b>${E(x.d.s.n)}</b><em>${x.v!=null?x.v+'٪ · ':''}${nP(x.d.L.length)}</em></div>`).join('')}</div>`+listH(L.items.slice().sort((a,b)=>(a.v??a.p.ps??0)-(b.v??b.p.ps??0)),'المشاريع')});
 commonBtns(st,()=>anim(st.c,-.7,.78,1.05));
 const sl=$i('v3w'),lb=$i('v3wl'),pb=$i('v3play');
 const setW=w=>{TW=w;sl.value=8-w;lb.textContent=w?'قبل '+w+(w==1?' أسبوع':w==2?' أسبوعين':' أسابيع'):'اليوم';T=terrainGrid(L,p=>psAt(p,TW));L.items.forEach(b=>b.v=psAt(b.p,TW));st.c.dirty=1;side();const ins=document.querySelector('#mapIns .insight span');if(ins)ins.innerHTML=terrIns(L)};
 sl.oninput=()=>setW(8-(+sl.value));
 let pt=null;pb.onclick=()=>{if(pt){clearInterval(pt);pt=null;pb.textContent='▶ تشغيل الأسابيع';return}let w=8;setW(w);pb.textContent='⏸ إيقاف';pt=setInterval(()=>{w--;if(w<0||!$i('v3c')){clearInterval(pt);pt=null;pb.textContent='▶ تشغيل الأسابيع';return}setW(w)},1100)};
 if(!RVD){try{const r=await G('sb').rpc('room_river',{p_weeks:9});RVD=r.error?{}:(r.data||{})}catch(_){RVD={}}}
 if(!Object.keys(RVD).length){sl.closest('label').style.display='none';pb.style.display='none'}}

/* ---- الكرة ---- */
let GSEL=null;
function globeHTML(){return {svg:shell('الكرة المؤسسية',`<button type="button" id="v3rot">⏸ إيقاف الدوران</button><button type="button" id="v3rst">↺</button><button type="button" id="v3stage">🎬 المسرح</button>`,
 `<span>القارة = هدف استراتيجي</span><span>لونها = متوسط إنجاز مشاريعها إلى المخطط</span><span>الأضواء = المشاريع</span>`,
 `<b>كيف تُقرأ الكرة؟</b><br>كل <b>قارة</b> هدف من أهداف المركز الاستراتيجية (كما اختير في ميثاق كل مشروع)، و<b>الأضواء</b> عليها مشاريعه. لون القارة = متوسط نسبة الإنجاز إلى المخطط لمشاريع الهدف موزونًا بأوزان المشاريع. اضغط هدفًا من القائمة لتدور الكرة إليه.`),leg:'',ins:''}}
async function globeStart(){await loadGoals();let M=globeModel();const items=()=>M.G.flatMap(x=>x.lights);
 const st=boot('globe',(g,c,t)=>drawGlobe(g,c,M,t,{sel:c.sel,hover:c.hover,goal:GSEL}),{cam:{span:400,yaw:0,pitch:.5,zoom:1,auto:!reduce},items,pmin:-.6,pmax:1.6,
  fly:l=>{const v=l.v||l.c;anim(V.cur.c,Math.atan2(v[0],-v[2]),.5+Math.asin(v[1]),1.25)},
  extra:l=>`<div class="v3-m"><span>الهدف الاستراتيجي</span><b>${E(l.goal.n)}</b></div>`,
  side:()=>`<div class="v3-card"><b style="display:block;margin-bottom:6px">الأهداف: الإنجاز والمساهمة</b>${M.G.slice().sort((a,b)=>(a.v??101)-(b.v??101)).map((x,i)=>`<button type="button" class="v3-li${GSEL===x?' hv':''}" data-v3g="${M.G.indexOf(x)}"><i style="background:${bandCol(x.v)}"></i><b>${E(x.n)}</b><em>${x.v!=null?x.v+'٪ · ':''}${nP(x.L.length)} · ${x.share}٪ من الأوزان</em></button>`).join('')}${GSEL?'<button type="button" class="v3-li" data-v3g="-1">✕ عرض كل الأهداف</button>':''}</div>`,
  bindSide:el=>el.querySelectorAll('[data-v3g]').forEach(b=>b.onclick=()=>{const k=+b.dataset.v3g;GSEL=k<0?null:M.G[k];if(GSEL){const v=GSEL.c;V.cur.c.auto=false;anim(V.cur.c,Math.atan2(v[0],-v[2]),.5+Math.asin(v[1]),1.25)}V.cur.c.dirty=1;side()})});
 commonBtns(st,()=>{GSEL=null;anim(st.c,0,.5,1)});
 const ins=document.querySelector('#mapIns');if(ins){const w=M.G.filter(x=>x.v!=null&&x.i).sort((a,b)=>a.v-b.v);ins.innerHTML=w.length?`<div class="insight"><i>💡</i><span>${M.G.filter(x=>x.i).length} أهداف${w.length>1?` · الأضعف: ${E(w[0].n)} (${w[0].v}٪)`:''}${w.length>1?` · الأقوى: ${E(w[w.length-1].n)} (${w[w.length-1].v}٪)`:''}${M.G.some(x=>x.i===0)?' · '+nP(M.G.find(x=>x.i===0).L.length)+' بلا هدف محدد في الميثاق':''}</span></div>`:''}}

/* ================== 4) المسرح التفاعلي ================== */
function stage(){stop();css();const L=layout(),items=L.items,cur=G('CUR'),hist=G('HIST')||[];const P=items.map(b=>b.p);
 const ok=P.filter(p=>p.status=='ok').length,wn=P.filter(p=>p.status=='warn').length,bd=P.filter(p=>p.status=='bad').length;
 const pendAll=P.flatMap(p=>pendOf(p.pc).map(a=>({a,p})));
 const bads=items.filter(b=>b.p.status=='bad').sort((a,b)=>(a.p.ps??0)-(b.p.ps??0)).slice(0,5);
 const D2=L.D.map(d=>({d,v:d.L.length?Math.round(d.L.reduce((s,q)=>s+(q.ps||0),0)/d.L.length):null})).filter(x=>x.v!=null).sort((a,b)=>a.v-b.v);
 const v=cur?cur():null,dlt=hist.length>1&&hist[hist.length-1]!=null&&hist[hist.length-2]!=null?hist[hist.length-1]-hist[hist.length-2]:0;
 const SC=[];
 SC.push({k:'title',h:'حالة المحفظة اليوم',big:v!=null?v:'—',p:`الأداء العام للمركز من 100${dlt?` · ${dlt<0?'تراجع':'تحسّن'} ${Math.abs(dlt)} عن الأسبوع الماضي`:''}`,cam:{yaw:-.75,pitch:.62,zoom:.9}});
 SC.push({k:'city',h:'مدينة المحفظة',p:`${nP(P.length)} جارية في ${L.D.length} ${L.D.length<=2?'قطاع':'قطاعات'}: ${ok} على المسار، و${wn} تحتاج متابعة، و${bd} متعثرة.`,cam:{yaw:-.6,pitch:.6,zoom:1}});
 bads.forEach((b,i)=>{const why=[];if(b.p.act!=null)why.push(`أنجز ${Math.round(b.p.act)}٪ من ${Math.round(b.p.exp||0)}٪ مخطط`);if(b.p.late)why.push(`${b.p.late} ${b.p.late==1?'مهمة متأخرة':b.p.late==2?'مهمتان متأخرتان':'مهام متأخرة'}`);if(b.p.rHigh)why.push('مخاطر عالية');if(b.pend.length)why.push(nDc(b.pend.length)+' عند المكتب');
  SC.push({k:'focus',b,h:`${i+1}/${bads.length} · ${b.p.n}`,p:`${secN(b.p.sec)} · ${why.join(' · ')}${b.p.pm?' · مدير المشروع: '+b.p.pm:''}`,cam:{yaw:-.75-i*.35,pitch:.9,zoom:2.3,x:b.x,z:b.z}})});
 if(pendAll.length)SC.push({k:'dec',h:'قرارات تنتظر المكتب',p:`${nDc(pendAll.length)} على ${nP(new Set(pendAll.map(x=>x.p.pc)).size)}. المباني التي عليها رافعات في المدينة.`,cam:{yaw:-1.2,pitch:.5,zoom:1.05},hl:'pend'});
 if(D2.length)SC.push({k:'terrain',h:'التضاريس: أين الوديان؟',p:`أعمق وادٍ في قطاع ${D2[0].d.s.n} (${D2[0].v}٪ من المخطط)${D2.length>1?`، وأعلى قمة في ${D2[D2.length-1].d.s.n} (${D2[D2.length-1].v}٪).`:'.'}`,cam:{yaw:-.7,pitch:.8,zoom:1.05}});
 SC.push({k:'globe',h:'المساهمة في الأهداف الاستراتيجية',p:'كل قارة هدف، والأضواء عليها مشاريعه، ولونها متوسط الإنجاز إلى المخطط.',cam:{yaw:0,pitch:.5,zoom:1}});
 let brief='';try{const f=G('briefText');brief=f?f():''}catch(_){}
 SC.push({k:'end',h:'الخلاصة',p:brief||`${ok} على المسار، ${wn} تحتاج متابعة، ${bd} متعثرة.`,cam:{yaw:-.75,pitch:.9,zoom:.85}});
 const o=document.createElement('div');o.className='v3s';o.setAttribute('role','dialog');o.setAttribute('aria-label','المسرح التفاعلي');
 o.innerHTML=`<div class="v3s-top"><b>🎬 المسرح التفاعلي · مكتب التطوير المؤسسي</b><button type="button" id="v3sx" style="font:inherit;font-weight:700;border:1px solid rgba(255,255,255,.3);background:rgba(20,34,54,.85);color:#fff;border-radius:99px;padding:6px 12px;cursor:pointer">✕ إنهاء</button></div><canvas id="v3sc"></canvas><div class="v3s-txt"><div id="v3st"></div></div><div class="v3s-ctl"><button type="button" id="v3sp">‹ السابق</button><button type="button" id="v3sg">⏸ إيقاف</button><button type="button" id="v3sn">التالي ›</button><div class="v3s-dots" id="v3sd2">${SC.map(()=>'<i></i>').join('')}</div></div>`;
 document.body.appendChild(o);try{o.requestFullscreen&&o.requestFullscreen().catch(()=>{})}catch(_){}
 const cv=$i('v3sc'),c=mkCam({span:L.span,auto:false});let T=null,M=null,i=0,play=true,timer=null,raf=0;
 const fit=()=>{const w=cv.clientWidth,h=cv.clientHeight,dp=Math.min(2,devicePixelRatio||1);cv.width=w*dp;cv.height=h*dp;c.w=w;c.h=h;c.dp=dp};fit();addEventListener('resize',fit);
 loadGoals().then(()=>{M=globeModel()});
 const show=k=>{i=Math.max(0,Math.min(SC.length-1,k));const s=SC[i];o.querySelectorAll('#v3sd2 i').forEach((d,j)=>d.classList.toggle('on',j==i));
  $i('v3st').innerHTML=s.k=='title'?`<h3>${E(s.h)}</h3><p class="v3s-big">${E(s.big)}</p><p>${E(s.p)}</p>`:`<h3>${E(s.h)}</h3><p>${E(s.p)}</p>`;
  if(s.k=='terrain'&&!T)T=terrainGrid(L,p=>p.ps);
  c.span=s.k=='globe'?400:L.span;anim(c,s.cam.yaw,s.cam.pitch,s.cam.zoom*(s.k=='globe'?1:.8),reduce?1:1600,s.cam.x||0,s.cam.z||0);
  clearTimeout(timer);if(play)timer=setTimeout(()=>{if(i<SC.length-1)show(i+1);else{play=false;$i('v3sg').textContent='▶ تشغيل'}},s.k=='title'?6000:s.k=='end'?12000:8000)};
 const loop=t=>{if(!document.body.contains(o))return;step(c,t);if(!c.anim&&SC[i].k!='title')c.yaw+=reduce?0:.0012;const g=cv.getContext('2d');g.setTransform(c.dp,0,0,c.dp,0,0);g.setLineDash([]);const s=SC[i];
  if(s.k=='globe'&&M)drawGlobe(g,c,M,t,{});else if(s.k=='terrain'&&T)drawTerrain(g,c,L,T,t,{labels:worst(items,3)});
  else drawCity(g,c,L,t,{sel:s.b||null,vis:s.hl=='pend'?(b=>b.pend.length>0):null,labels:s.b?new Set([s.b]):s.hl=='pend'?new Set(items.filter(b=>b.pend.length).slice(0,6)):worst(items,3)});
  raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);
 const end=()=>{clearTimeout(timer);cancelAnimationFrame(raf);removeEventListener('resize',fit);removeEventListener('keydown',kd);try{if(document.fullscreenElement)document.exitFullscreen()}catch(_){}o.remove();const f=G('drawMap');if(f)f()};
 const kd=e=>{if(e.key=='Escape')end();if(e.key=='ArrowLeft')show(i+1);if(e.key=='ArrowRight')show(i-1);if(e.key==' '){e.preventDefault();$i('v3sg').click()}};addEventListener('keydown',kd);
 $i('v3sx').onclick=end;$i('v3sn').onclick=()=>show(i+1);$i('v3sp').onclick=()=>show(i-1);$i('v3sg').onclick=()=>{play=!play;$i('v3sg').textContent=play?'⏸ إيقاف':'▶ تشغيل';if(play)show(i);else clearTimeout(timer)};
 show(0)}
function stageHTML(){css();const P=pjs(),bd=P.filter(p=>p.status=='bad').length;return {svg:`<div class="v3-card" style="max-width:760px;margin:0 auto;text-align:center;padding:22px"><div style="font-size:44px">🎬</div><h3 style="margin:6px 0">المسرح التفاعلي</h3><p class="v3-help" style="font-size:14px">عرض جاهز لاجتماعات الإدارة العليا يتنقل وحده بين مشاهد قصيرة، مع تعليق عربي في سطر واحد لكل مشهد:</p>
 <ol style="text-align:start;display:inline-block;margin:6px auto 14px;line-height:2;color:#3b4148"><li>الأداء العام للمركز واتجاهه</li><li>مدينة المحفظة: صورة كل المشاريع</li><li>المشاريع المتعثرة واحدًا واحدًا${bd?` (${Math.min(5,bd)})`:''}</li><li>القرارات المعلّقة عند المكتب</li><li>التضاريس: أضعف القطاعات وأقواها</li><li>الكرة: المساهمة في الأهداف الاستراتيجية</li><li>الخلاصة</li></ol>
 <div><button type="button" id="v3go" style="font:inherit;font-size:16px;font-weight:800;border:0;background:#14324a;color:#fff;border-radius:99px;padding:12px 26px;cursor:pointer">▶ ابدأ العرض</button></div><p class="v3-help" style="margin-top:10px">ملء الشاشة · المسافة أو الأسهم للتنقل · Esc للإنهاء</p></div>`,leg:'',ins:''}}
function stageStart(){const b=$i('v3go');if(b)b.onclick=()=>stage()}

window.V3={stop,city:cityHTML,terrain:terrainHTML,globe:globeHTML,stage:stageHTML,start:k=>{if(k=='city')cityStart();else if(k=='terrain')terrainStart();else if(k=='globe')globeStart();else if(k=='stage')stageStart()},play:stage};
})();
