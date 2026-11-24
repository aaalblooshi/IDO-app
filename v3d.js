/* v3d.js — عروض غرفة التحكم ثلاثية الأبعاد: خارطة الإنجاز، ملامح الإنجاز، الأهداف المؤسسية، والعرض التفاعلي.
   الإصدار 2: إسقاط متعامد (بدون تشويه منظوري) والكاميرا دائمًا من الأعلى، وألوان فاتحة هادئة، وعناصر قابلة للضغط.
   يقرأ بيانات الغرفة عبر window.__room. */
(function(){
'use strict';
const $i=id=>document.getElementById(id);
const E=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plr=(n,one,two,few,many)=>n==1?one:n==2?two:(n>=3&&n<=10?n+' '+few:n+' '+many);
const nP=n=>!n?'لا مشاريع':plr(n,'مشروع واحد','مشروعان','مشاريع','مشروعًا');
const nDc=n=>plr(n,'قرار واحد','قراران','قرارات','قرارًا');
const G=k=>{const r=window.__room;if(r&&r[k])try{return r[k]()}catch(_){}try{return eval(k)}catch(_){return undefined}};
const pjs=()=>(G('PJ')||[]).filter(p=>p.appr&&!p.done&&!p.halted&&p.ps!=null);
const secs=()=>G('SEC')||[];
const secN=id=>{const f=G('secName');return f?f(id):(secs().find(s=>s.id==id)||{}).n||id};
const bands=()=>G('BND')||{g:90,a:75};
const COL={ok:'#2f9e64',warn:'#e3a034',bad:'#d9475a',info:'#8a96a3'};
const colOf=p=>COL[p.status]||COL.info;
const SNM={ok:'على المسار',warn:'يحتاج متابعة',bad:'متعثر',info:'لا بيانات كافية'};
const pendOf=pc=>(G('AL')||[]).filter(a=>a.pc==pc&&(a.cat=='lock'||a.cat=='rev'||a.cat=='appr'||a.cat=='scope'));
const CATN=c=>c=='lock'?'تعديل قيم مقفلة':c=='rev'?'مراجعة احتساب':c=='appr'?'اعتماد وثيقة':c=='scope'?'الالتزام بالنطاق':'قرار';
const hashS=s=>{let h=0;for(const ch of String(s))h=(h*31+ch.charCodeAt(0))>>>0;return h};
const openP=pc=>{const f=G('openProject');if(f)f(pc)};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const short=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,n-1)+'…':s};
let NM=false;try{NM=localStorage.getItem('ido_names')=='1'}catch(_){}
window.V3NM=()=>NM;
window.V3NMset=v=>{NM=!!v;try{localStorage.setItem('ido_names',NM?'1':'0')}catch(_){}};
const nmTxt=()=>NM?'🏷 إخفاء الأسماء':'🏷 إظهار الأسماء';
const FONT='"IBM Plex Sans Arabic","Noto Kufi Arabic",system-ui,sans-serif';

/* ---------- CSS ---------- */
function css(){if($i('v3css'))return;const st=document.createElement('style');st.id='v3css';st.textContent=`
.v3{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:12px;align-items:start}
.v3-box{position:relative;border-radius:16px;overflow:hidden;background:#eef2f6;border:1px solid #dde3ea;touch-action:none}
.v3-box canvas{display:block;width:100%;cursor:grab;outline:none}
.v3-tb{position:absolute;top:10px;inset-inline:10px;display:flex;gap:6px;flex-wrap:wrap;z-index:2;align-items:center}
.v3-tb button,.v3-tb select{font:inherit;font-size:12.5px;font-weight:700;border:1px solid #d3dbe4;background:rgba(255,255,255,.94);color:#24313e;border-radius:99px;padding:6px 11px;cursor:pointer;box-shadow:0 1px 3px rgba(20,40,60,.08)}
.v3-tb button.on{background:#14324a;border-color:#14324a;color:#fff}
.v3-tb .ic{min-width:34px;padding:6px 8px;font-size:15px;line-height:1}
.v3-tb .sp{flex:1}
.v3-tb label{display:flex;gap:6px;align-items:center;color:#24313e;font-size:12.5px;font-weight:700;background:rgba(255,255,255,.94);border:1px solid #d3dbe4;border-radius:99px;padding:4px 10px}
.v3-tb input[type=range]{width:120px;accent-color:#14324a}
.v3-lg{position:absolute;bottom:10px;inset-inline-start:10px;display:flex;gap:12px;flex-wrap:wrap;color:#33414f;font-size:12px;background:rgba(255,255,255,.92);border:1px solid #dde3ea;border-radius:10px;padding:5px 10px;z-index:1}
.v3-lg span{display:inline-flex;gap:5px;align-items:center}.v3-lg i{width:11px;height:11px;border-radius:3px;display:inline-block}
.v3-sd{display:flex;flex-direction:column;gap:10px;max-height:680px;overflow:auto}
.v3-card{border:1px solid var(--line,#e6e2d9);border-radius:14px;padding:12px;background:#fff}
.v3-card h4{margin:6px 0 2px;font-size:15.5px;line-height:1.45}.v3-card small{color:#5c6168;font-size:12.5px;display:block}
.v3-m{display:grid;grid-template-columns:1fr auto;gap:4px 8px;border-top:1px solid #f0ece3;margin-top:8px;padding-top:8px;font-size:13px}
.v3-m span{color:#5c6168}.v3-m b{text-align:end}
.v3-bar{height:8px;border-radius:99px;background:#edf0f3;position:relative;margin-top:8px;overflow:hidden}.v3-bar i{position:absolute;inset-block:0;inset-inline-start:0;border-radius:99px}.v3-bar u{position:absolute;inset-block:-2px;width:2px;background:#24313e}
.v3-st{display:inline-block;color:#fff;border-radius:99px;padding:2px 10px;font-size:12px;font-weight:800}
.v3-row{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}.v3-row button{font:inherit;font-size:12.5px;font-weight:700;border:1px solid #d8d2c4;background:#fff;border-radius:99px;padding:6px 12px;cursor:pointer}.v3-row button.p{background:#14324a;border-color:#14324a;color:#fff}
.v3-li{display:flex;gap:8px;align-items:center;width:100%;text-align:start;font:inherit;border:1px solid #eee8dc;background:#fff;border-radius:10px;padding:7px 9px;cursor:pointer;margin-bottom:5px;color:inherit}
.v3-li:hover,.v3-li.hv{border-color:#14324a;background:#f6f8fa}.v3-li i{width:10px;height:10px;border-radius:50%;flex:0 0 auto}.v3-li b{flex:1;font-size:13px;min-width:0}.v3-li em{font-style:normal;font-size:12px;color:#5c6168;white-space:nowrap}
.v3-sub{padding-inline-start:18px}
.v3-help{color:#5c6168;font-size:12.5px;line-height:1.75}
@media(max-width:900px){.v3{grid-template-columns:1fr}.v3-sd{max-height:none}}
@media(max-width:640px){.v3-box{display:flex;flex-direction:column}.v3-tb{position:static;padding:8px 8px 6px;order:-1;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;background:#fff;border-bottom:1px solid #e3e8ee}.v3-tb::-webkit-scrollbar{display:none}.v3-tb>*{flex:0 0 auto}.v3-tb .sp{display:none}.v3-lg{position:static;order:2;border-radius:0;border-width:1px 0 0;justify-content:center;font-size:12.5px}}
.v3s{position:fixed;inset:0;z-index:2147483300;background:#eef2f6;color:#fff;display:flex;flex-direction:column}
.v3s canvas{flex:1;min-height:0;width:100%;display:block}
.v3s-top{position:absolute;top:calc(10px + env(safe-area-inset-top,0px));inset-inline:12px;display:flex;justify-content:space-between;align-items:center;gap:8px;z-index:2}
.v3s-top b{font-size:14px;color:#14324a;background:rgba(255,255,255,.9);border-radius:99px;padding:5px 12px}
.v3s-top button{font:inherit;font-weight:700;border:1px solid #d3dbe4;background:#fff;color:#14324a;border-radius:99px;padding:6px 12px;cursor:pointer}
.v3s-txt{position:absolute;inset-inline:0;bottom:calc(84px + env(safe-area-inset-bottom,0px));display:flex;justify-content:center;padding:0 16px;z-index:2;pointer-events:none}
.v3s-txt>div{max-width:900px;max-height:52vh;overflow:auto;pointer-events:auto;background:rgba(20,50,74,.94);border-radius:16px;padding:14px 18px;text-align:center;box-shadow:0 10px 30px rgba(20,50,74,.3)}
.v3s-txt h3{margin:0 0 4px;font-size:clamp(18px,3.2vw,30px);line-height:1.35}
.v3s-txt p{margin:0;font-size:clamp(14px,2.1vw,19px);color:#dbe5ee;line-height:1.6}
.v3s-big{font-size:clamp(54px,11vw,120px)!important;font-weight:800;color:#ffe49a!important;line-height:1.05!important}
.v3s-ctl{position:absolute;bottom:calc(16px + env(safe-area-inset-bottom,0px));inset-inline:0;display:flex;justify-content:center;align-items:center;gap:8px;z-index:2;flex-wrap:wrap}
.v3s-ctl button{font:inherit;font-size:14px;font-weight:700;border:1px solid #d3dbe4;background:#fff;color:#14324a;border-radius:99px;padding:8px 14px;cursor:pointer}
.v3s-top select{font:inherit;font-size:13px;font-weight:700;border:1px solid #d3dbe4;background:#fff;color:#14324a;border-radius:99px;padding:6px 10px;max-width:46vw}
.v3s-txt small{display:block;color:#bcd0e2;font-size:13px;margin-bottom:2px}
.v3s-ch{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:10px}.v3s-ch span{border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.08);border-radius:99px;padding:3px 11px;font-size:clamp(12.5px,1.5vw,15px);color:#fff}
.v3s-n{color:#14324a;font-weight:800;font-size:13px;background:#fff;border-radius:99px;padding:6px 10px}
.v3s-pg{position:absolute;bottom:0;inset-inline:0;height:4px;background:#d3dbe4;z-index:2}.v3s-pg i{display:block;height:100%;background:#14324a;transition:width .4s}
@media(max-width:640px){.v3s-txt{bottom:calc(118px + env(safe-area-inset-bottom,0px))}.v3s-sp b{min-width:70px;font-size:12px}.v3s-ctl{gap:6px}.v3s-ctl button{padding:7px 11px}.v3s-txt>div{padding:10px 12px}.v3s-ch{gap:4px}.v3s-ch span{padding:2px 8px}.v3s-top b{display:none}.v3s-top{justify-content:flex-end}}
.v3s-sp{display:inline-flex;align-items:center;gap:4px;background:#fff;border:1px solid #d3dbe4;border-radius:99px;padding:2px}.v3s-sp button{border:0!important;padding:6px 10px!important}.v3s-sp button:disabled{opacity:.35;cursor:default}.v3s-sp b{color:#14324a;font-size:13px;min-width:92px;text-align:center}
.v3s-ch button{font:inherit;border:1px solid rgba(255,255,255,.4);background:rgba(255,255,255,.14);border-radius:99px;padding:3px 11px;font-size:clamp(12.5px,1.5vw,15px);color:#fff;cursor:pointer}.v3s-ch button:hover{background:rgba(255,255,255,.26)}
.v3s-pn{position:absolute;top:calc(58px + env(safe-area-inset-top,0px));bottom:calc(70px + env(safe-area-inset-bottom,0px));inset-inline-end:12px;width:min(420px,calc(100% - 24px));background:#fff;color:#1f2b37;border-radius:16px;box-shadow:0 18px 50px rgba(20,40,60,.35);z-index:4;display:flex;flex-direction:column;overflow:hidden}.v3s-pn[hidden]{display:none}
.v3s-ph{display:flex;align-items:center;gap:8px;padding:12px 14px;border-bottom:1px solid #e6ebf0}.v3s-ph b{flex:1;font-size:15.5px;line-height:1.4}.v3s-ph button,.v3s-r button{font:inherit;font-weight:700;font-size:12.5px;border:1px solid #d3dbe4;background:#fff;color:#14324a;border-radius:99px;padding:5px 11px;cursor:pointer}
.v3s-pb{flex:1;overflow:auto;padding:8px 14px}.v3s-pb p{color:#33414f;line-height:1.7;margin:8px 0}.v3s-pf{padding:8px 14px;border-top:1px solid #e6ebf0;color:#5c6168;font-size:12.5px;background:#f6f8fb}
.v3s-r{display:flex;gap:9px;align-items:flex-start;padding:9px 0;border-bottom:1px solid #f0f2f5}.v3s-r>i{width:10px;height:10px;border-radius:50%;margin-top:6px;flex:0 0 auto}.v3s-r>div{flex:1;min-width:0}.v3s-r b{display:block;font-size:14px}.v3s-r small{display:block;color:#5c6168;font-size:12.5px;line-height:1.6}.v3s-r>span{display:flex;gap:4px;align-items:center}.v3s-r a{text-decoration:none;color:#14324a;font-weight:800;padding:4px 6px}
.v3s-k{display:flex;flex-wrap:wrap;gap:5px}.v3s-k span{background:#f0f3f6;border-radius:99px;padding:2px 9px;font-size:12.5px}.v3s-e{color:#5c6168;font-size:13px;padding:10px 0;text-align:center}
@media(max-width:640px){.v3s-pn{top:auto;bottom:0;inset-inline:0;width:100%;max-height:72vh;border-radius:18px 18px 0 0}}
.v3s-dots{display:flex;gap:5px}.v3s-dots i{width:8px;height:8px;border-radius:50%;background:#c3ccd6}.v3s-dots i.on{background:#14324a;width:20px;border-radius:5px}
`;document.head.appendChild(st)}

/* ---------- الكاميرا: إسقاط متعامد، النظر دائمًا من الأعلى ---------- */
function mkCam(o){return Object.assign({tx:0,tz:0,yaw:-.62,pitch:.72,zoom:1,w:600,h:420,dp:1,span:400,cy:.55,auto:false,anim:null,drag:null},o||{})}
// يعيد [x الشاشة, y الشاشة, المقياس, العمق]؛ العمق الأكبر = الأبعد عن الكاميرا
function proj(c,x,y,z){x-=c.tx;z-=c.tz;const cy=Math.cos(c.yaw),sy=Math.sin(c.yaw),cp=Math.cos(c.pitch),sp=Math.sin(c.pitch);
 const X=x*cy-z*sy,Zr=x*sy+z*cy,Y=y*cp+Zr*sp,Dp=Zr*cp-y*sp,s=c.zoom*Math.min(c.w,c.h*1.3)/c.span;return [c.w/2+X*s,c.h*c.cy-Y*s,s,Dp]}
function anim(c,ty,tp,tz,ms,px,pz){const fy=c.yaw,ny=fy+((((ty-fy)%(2*Math.PI))+3*Math.PI)%(2*Math.PI)-Math.PI);c.anim={t0:performance.now(),ms:reduce?1:(ms||1000),fy,ty:ny,fp:c.pitch,tp,fz:c.zoom,tz,fx:c.tx||0,fz2:c.tz||0,px:px||0,pz:pz||0}}
function step(c,t){if(c.anim){const A=c.anim,k=Math.min(1,(t-A.t0)/A.ms),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;c.yaw=A.fy+(A.ty-A.fy)*e;c.pitch=A.fp+(A.tp-A.fp)*e;c.zoom=A.fz+(A.tz-A.fz)*e;c.tx=A.fx+(A.px-A.fx)*e;c.tz=A.fz2+(A.pz-A.fz2)*e;if(k>=1)c.anim=null;return true}
 if(c.auto&&!c.drag&&!c.sel&&!c.hover){c.yaw+=.0016;return true}return false}
function shade(hex,f){const n=parseInt(hex.slice(1),16);const r=n>>16,g=(n>>8)&255,b=n&255;const m=x=>Math.max(0,Math.min(255,Math.round(f>=1?x+(255-x)*(f-1):x*f)));return `rgb(${m(r)},${m(g)},${m(b)})`}
function mix(a,b,k){k=Math.max(0,Math.min(1,k));const A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16);const f=s=>Math.round(((A>>s)&255)*(1-k)+((B>>s)&255)*k);return '#'+[16,8,0].map(s=>f(s).toString(16).padStart(2,'0')).join('')}
function bandCol(v){const B=bands();if(v==null)return '#c9d1da';if(v>=B.g)return COL.ok;if(v>=B.a)return COL.warn;return COL.bad}
function gradCol(v){const B=bands();if(v==null)return '#dfe5ec';if(v>=B.g)return '#4fb07c';if(v>=B.a)return mix('#eab04e','#4fb07c',(v-B.a)/(B.g-B.a));return mix('#d9475a','#eab04e',Math.max(0,(v-(B.a-25))/25))}
function bg(g,W,H){const r=g.createLinearGradient(0,0,0,H);r.addColorStop(0,'#f6f8fb');r.addColorStop(1,'#e4eaf1');g.fillStyle=r;g.fillRect(0,0,W,H)}
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
// بطاقة نص صغيرة فوق نقطة (x,y)
function pill(g,x,y,txt,o){o=o||{};const fs=o.size||12;g.font=(o.bold?'700 ':'500 ')+fs+'px '+FONT;g.textAlign='center';g.textBaseline='middle';const w=g.measureText(txt).width+14,h=fs+9;
 g.save();g.shadowColor='rgba(20,40,60,.18)';g.shadowBlur=6;g.shadowOffsetY=1;rr(g,x-w/2,y-h,w,h,h/2);g.fillStyle=o.bg||'#fff';g.fill();g.restore();
 if(o.bd){rr(g,x-w/2,y-h,w,h,h/2);g.strokeStyle=o.bd;g.lineWidth=1.5;g.stroke()}g.fillStyle=o.fg||'#1f2b37';g.fillText(txt,x,y-h/2+.5);g.textBaseline='alphabetic';return [x-w/2,y-h,x+w/2,y]}
function poly(g,P){g.beginPath();P.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath()}

/* ---------- تخطيط مشترك: كل قطاع حي ---------- */
function layout(){const P=pjs(),S=secs().filter(s=>P.some(p=>p.sec==s.id)).map(s=>({id:s.id,n:s.n}));const other=P.filter(p=>!S.some(s=>s.id==p.sec));if(other.length)S.push({id:'__o',n:'بلا قطاع'});
 const n=Math.max(1,S.length),cols=Math.ceil(Math.sqrt(n)),rows=Math.ceil(n/cols),cell=48,pad=18,gap=54,items=[];
 const D=S.map(s=>{const L=(s.id=='__o'?other:P.filter(p=>p.sec==s.id)).sort((a,b)=>(a.ps??0)-(b.ps??0));const sc=Math.max(1,Math.ceil(Math.sqrt(L.length)));return {s,L,sc,size:sc*cell+pad*2}});
 const sz=Math.max(...D.map(d=>d.size),120);
 D.forEach((d,i)=>{const r=Math.floor(i/cols),c=i%cols;d.cx=(c-(cols-1)/2)*(sz+gap);d.cz=(r-(rows-1)/2)*(sz+gap);d.half=d.size/2;d.v=d.L.length?Math.round(d.L.reduce((s,q)=>s+(q.ps||0)*(q.w||1),0)/d.L.reduce((s,q)=>s+(q.w||1),0)):null;
  d.L.forEach((p,j)=>{const a=Math.floor(j/d.sc),b=j%d.sc;const x=d.cx-d.half+pad+cell/2+b*cell,z=d.cz-d.half+pad+cell/2+a*cell;const fp=18+Math.min(14,Math.sqrt(p.tasks||p.size||6)*2);
   items.push({p,x,z,fp,h:Math.max(4,(p.act||0)*1.15),hp:p.exp!=null?Math.max(0,p.exp*1.15):null,pend:pendOf(p.pc),risk:p.rHigh||0,col:colOf(p),dist:d})})});
 const span=Math.max(300,Math.max(cols,rows)*(sz+gap));return {D,items,span,P}}

/* ================== 1) خارطة الإنجاز ================== */
function drawCity(g,c,L,t,o){o=o||{};const W=c.w,H=c.h,ph=W<640;bg(g,W,H);
 // الأحياء: ألواح بيضاء مرفوعة قليلًا
 const plates=L.D.map(d=>({d,z:proj(c,d.cx,0,d.cz)[3]})).sort((a,b)=>b.z-a.z);
 plates.forEach(({d})=>{const on=!o.sec||o.sec=='all'||o.sec==d.s.id,h0=-6,cs=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>[d.cx+a*d.half,d.cz+b*d.half]);
  const top=cs.map(([x,z])=>proj(c,x,0,z)),bot=cs.map(([x,z])=>proj(c,x,h0,z));
  [[0,1],[1,2],[2,3],[3,0]].map(([i,j])=>({i,j,z:(top[i][3]+top[j][3])/2})).sort((a,b)=>b.z-a.z).forEach(({i,j})=>{poly(g,[top[i],top[j],bot[j],bot[i]]);g.fillStyle=on?'#cfd8e2':'#dfe5eb';g.fill()});
  poly(g,top);g.fillStyle=on?'#ffffff':'#f3f5f8';g.fill();g.strokeStyle=on?'#c4cfdb':'#dbe1e8';g.lineWidth=1;g.stroke();
  // اسم الحي على حافته الأمامية
  const fr=[[0,1],[1,2],[2,3],[3,0]].map(([i,j])=>({m:[(cs[i][0]+cs[j][0])/2,(cs[i][1]+cs[j][1])/2],z:(top[i][3]+top[j][3])/2})).sort((a,b)=>a.z-b.z)[0];
  const [lx,ly]=proj(c,fr.m[0],0,fr.m[1]);g.globalAlpha=on?1:.45;pill(g,lx,ly+22,d.s.n+(d.v!=null?'  ·  '+d.v+'٪':''),{bold:true,size:ph?13:12.5,bg:'#14324a',fg:'#fff'});g.globalAlpha=1});
 // المباني من الأبعد إلى الأقرب
 const B=L.items.map(b=>Object.assign(b,{dz:proj(c,b.x,0,b.z)[3]})).sort((a,b)=>b.dz-a.dz);
 const top3=o.labels||new Set();const LB=[];
 B.forEach(b=>{const vis=o.vis?o.vis(b):true,sel=o.sel===b,hv=o.hover===b;g.globalAlpha=vis?1:.16;const f=b.fp/2,H0=b.h;
  const P=[[b.x-f,b.z-f],[b.x+f,b.z-f],[b.x+f,b.z+f],[b.x-f,b.z+f]];
  // ظل
  const sh=P.map(([x,z])=>proj(c,x+5,0,z+7));poly(g,sh);g.fillStyle='rgba(30,50,70,.10)';g.fill();
  const faces=[[0,1,0,-1],[1,2,1,0],[2,3,0,1],[3,0,-1,0]].map(([i,j,nx,nz])=>{const a=P[i],q=P[j];const pts=[proj(c,a[0],0,a[1]),proj(c,q[0],0,q[1]),proj(c,q[0],H0,q[1]),proj(c,a[0],H0,a[1])];return {pts,z:(pts[0][3]+pts[1][3])/2,l:.70+.26*Math.max(0,nx*.6-nz*.8)}}).sort((a,b)=>b.z-a.z);
  faces.forEach(F=>{poly(g,F.pts);g.fillStyle=shade(b.col,F.l);g.fill();g.strokeStyle='rgba(20,30,40,.14)';g.lineWidth=.8;g.stroke()});
  const top=P.map(([x,z])=>proj(c,x,H0,z));poly(g,top);g.fillStyle=shade(b.col,1.22);g.fill();g.strokeStyle=sel?'#14324a':hv?'#14324a':'rgba(255,255,255,.7)';g.lineWidth=sel||hv?3:1;g.stroke();
  // المخطط حتى اليوم: إطار منقّط
  let topY=Math.min(...top.map(p=>p[1]));
  if(b.hp!=null&&vis&&Math.abs(b.hp-H0)>2){const pt=P.map(([x,z])=>proj(c,x,b.hp,z));g.setLineDash([5,4]);g.strokeStyle='rgba(20,50,74,.7)';g.lineWidth=1.4;poly(g,pt);g.stroke();
   if(b.hp>H0){[0,1,2,3].forEach(i=>{g.beginPath();g.moveTo(top[i][0],top[i][1]);g.lineTo(pt[i][0],pt[i][1]);g.stroke()});topY=Math.min(topY,...pt.map(p=>p[1]))}g.setLineDash([])}
  const cx=(top[0][0]+top[2][0])/2;b.bb=vis?[Math.min(...faces.flatMap(F=>F.pts.map(p=>p[0]))),topY-24,Math.max(...faces.flatMap(F=>F.pts.map(p=>p[0]))),Math.max(...faces.flatMap(F=>F.pts.map(p=>p[1])))]:null;
  // شارات: قرار معلّق (ذهبي) ومخاطر عالية (أحمر)
  let bx=cx-((b.pend.length?1:0)+(b.risk?1:0)-1)*9;
  const badge=(col,ch)=>{g.beginPath();g.arc(bx,topY-26,8,0,7);g.fillStyle=col;g.fill();g.strokeStyle='#fff';g.lineWidth=1.6;g.stroke();g.fillStyle='#fff';g.font='800 10px '+FONT;g.textAlign='center';g.textBaseline='middle';g.fillText(ch,bx,topY-25.5);g.textBaseline='alphabetic';bx+=18};
  if(vis&&b.pend.length)badge('#c99a2e','!');if(vis&&b.risk)badge('#d9475a','▲');
  // النسبة فوق كل مبنى
  if(vis){const showName=sel||hv||NM||(o.stage&&top3.has(b));LB.push({x:cx,y:topY-((b.pend.length||b.risk)?38:5),t:showName?short(b.p.n,ph?22:30)+' · '+b.p.ps+'٪':b.p.ps+'٪',o:{bold:showName,size:showName?(ph?13:12.5):(ph?12:11),bd:sel||hv?'#14324a':null},pr:3})}
  g.globalAlpha=1});
 labels(g,LB)}
function labels(g,LB){const done=[];LB.sort((a,b)=>b.pr-a.pr).forEach(l=>{g.font=(l.o.bold?'700 ':'500 ')+(l.o.size||12)+'px '+FONT;const w=g.measureText(l.t).width+14,h=(l.o.size||12)+9,r=[l.x-w/2-2,l.y-h-2,l.x+w/2+2,l.y+2];if(l.pr<3&&done.some(d=>r[0]<d[2]&&r[2]>d[0]&&r[1]<d[3]&&r[3]>d[1]))return;pill(g,l.x,l.y,l.t,l.o);done.push(r)})}
function cityLegend(){return `<span><i style="background:${COL.ok}"></i>على المسار</span><span><i style="background:${COL.warn}"></i>يحتاج متابعة</span><span><i style="background:${COL.bad}"></i>متعثر</span><span>┆ الإطار المنقّط = المخطط حتى اليوم</span><span><i style="background:#c99a2e;border-radius:50%"></i>قرار معلّق</span><span><i style="background:#d9475a;border-radius:50%"></i>مخاطر عالية</span>`}

/* ================== 2) ملامح الإنجاز ================== */
function terrainGrid(L,psOf,N){N=N||(innerWidth<640?24:32);const ext=L.span*.56,stp=2*ext/N,sig=Math.max(38,L.span/10),Z=[],B=bands();
 const pts=L.items.map(b=>({x:b.x,z:b.z,w:1+Math.sqrt(b.p.tasks||4)*.3,v:psOf(b.p)})).filter(q=>q.v!=null);
 for(let i=0;i<=N;i++){const row=[];for(let j=0;j<=N;j++){const x=-ext+j*stp,z=-ext+i*stp;let sw=0,sv=0;pts.forEach(q=>{const d2=(q.x-x)**2+(q.z-z)**2,k=q.w*Math.exp(-d2/(2*sig*sig));sw+=k;sv+=k*q.v});
  const v=sw>1e-3?sv/sw:null,conf=Math.min(1,sw/1.1),e=v==null?0:Math.max(-34,Math.min(48,(v-B.a)*1.5))*conf;row.push({x,z,y:e,v,conf})}Z.push(row)}
 return {Z,N,ext,stp}}
function tAt(T,x,z){const s=T.stp,i=Math.max(0,Math.min(T.N,Math.round((z+T.ext)/s))),j=Math.max(0,Math.min(T.N,Math.round((x+T.ext)/s)));return T.Z[i][j].y}
function drawTerrain(g,c,L,T,t,o){o=o||{};const W=c.w,H=c.h,ph=W<640,{Z,N}=T,Q=[];bg(g,W,H);
 const lx=.45,ly=.8,lz=-.4;
 for(let i=0;i<N;i++)for(let j=0;j<N;j++){const a=Z[i][j],b=Z[i][j+1],q=Z[i+1][j+1],d=Z[i+1][j];
  const ux=b.x-a.x,uy=b.y-a.y,uz=b.z-a.z,vx=d.x-a.x,vy=d.y-a.y,vz=d.z-a.z;let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;if(ny<0){nx=-nx;ny=-ny;nz=-nz}const nl=Math.hypot(nx,ny,nz)||1,l=.78+.3*Math.max(0,(nx*lx+ny*ly+nz*lz)/nl);
  const vs=[a,b,q,d].filter(z=>z.v!=null),v=vs.length?vs.reduce((s,z)=>s+z.v,0)/vs.length:null,cf=(a.conf+b.conf+q.conf+d.conf)/4,yy=(a.y+b.y+q.y+d.y)/4;
  let col=cf<.1?'#dfe5ec':mix('#dfe5ec',gradCol(v),Math.min(1,cf*1.6));
  const P=[a,b,q,d].map(z=>proj(c,z.x,z.y,z.z));Q.push({P,z:(P[0][3]+P[1][3]+P[2][3]+P[3][3])/4,col,l})}
 Q.sort((a,b)=>b.z-a.z).forEach(R=>{poly(g,R.P);const f=shade(R.col,R.l);g.fillStyle=f;g.fill();g.strokeStyle=f;g.lineWidth=.6;g.stroke()});
 // حواف القطاعات
 L.D.forEach(d=>{const on=!o.sec||o.sec=='all'||o.sec==d.s.id;g.setLineDash([6,5]);g.strokeStyle=on?'rgba(20,50,74,.45)':'rgba(20,50,74,.15)';g.lineWidth=1.2;g.beginPath();const st=16;let first=true;
  [[-1,-1,1,-1],[1,-1,1,1],[1,1,-1,1],[-1,1,-1,-1]].forEach(([a1,b1,a2,b2])=>{for(let k=0;k<=st;k++){const x=d.cx+(a1+(a2-a1)*k/st)*d.half,z=d.cz+(b1+(b2-b1)*k/st)*d.half,[px,py]=proj(c,x,tAt(T,x,z)+1,z);first?g.moveTo(px,py):g.lineTo(px,py);first=false}});g.stroke();g.setLineDash([])});
 // دبابيس المشاريع
 const items=L.items.map(b=>{const y=tAt(T,b.x,b.z);const p0=proj(c,b.x,y,b.z);return Object.assign(b,{ty:y,dz:p0[3],p0})}).sort((a,b)=>b.dz-a.dz);
 items.forEach(b=>{const vis=o.vis?o.vis(b):true,sel=o.sel===b,hv=o.hover===b,[x0,y0]=b.p0,[x1,y1]=proj(c,b.x,b.ty+22,b.z),r=ph?11:10,v=b.v!=null?b.v:b.p.ps;g.globalAlpha=vis?1:.18;
  g.beginPath();g.ellipse(x0,y0,4,2,0,0,7);g.fillStyle='rgba(20,40,60,.3)';g.fill();g.strokeStyle='#14324a';g.lineWidth=1.4;g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke();
  g.save();g.shadowColor='rgba(20,40,60,.25)';g.shadowBlur=5;g.beginPath();g.arc(x1,y1,sel||hv?r+3:r,0,7);g.fillStyle=bandCol(v);g.fill();g.restore();g.strokeStyle=sel||hv?'#14324a':'#fff';g.lineWidth=sel||hv?3:2;g.beginPath();g.arc(x1,y1,sel||hv?r+3:r,0,7);g.stroke();
  g.fillStyle='#fff';g.font='800 '+(ph?10.5:10)+'px '+FONT;g.textAlign='center';g.textBaseline='middle';g.fillText(v==null?'—':String(v),x1,y1+.5);g.textBaseline='alphabetic';
  b.sx=x1;b.sy=y1;b.bb=vis?[x1-r-4,y1-r-4,x1+r+4,y1+r+4]:null;
  if(vis&&(sel||hv||NM||(o.stage&&o.labels&&o.labels.has(b))))pill(g,x1,y1-r-5,short(b.p.n,ph?22:30),{bold:true,size:ph?13:12,bd:sel||hv?'#14324a':null});g.globalAlpha=1});
 // أسماء القطاعات
 L.D.forEach(d=>{const on=!o.sec||o.sec=='all'||o.sec==d.s.id,x=d.cx,z=d.cz+d.half;const [px,py]=proj(c,x,tAt(T,x,z),z);g.globalAlpha=on?1:.4;pill(g,px,py+24,d.s.n,{bold:true,size:ph?13:12.5,bg:'#14324a',fg:'#fff'});g.globalAlpha=1})}

/* ================== 3) الأهداف المؤسسية ================== */
let GOALS=null,PGOAL=null;
async function loadGoals(){if(GOALS)return;GOALS=[];PGOAL={};try{const sb=G('sb');const [a,b]=await Promise.all([sb.from('app_settings').select('key,value').in('key',['opt_lists','opt_goals']),sb.from('charters').select('code,goal:data->>goal').eq('archived',false)]);
 let u={};(a.data||[]).forEach(r=>{try{if(r.key=='opt_lists')u=Object.assign({},JSON.parse(r.value||'{}'),u);if(r.key=='opt_goals'&&!u.goals){const gg=JSON.parse(r.value||'[]');if(Array.isArray(gg)&&gg.length)u.goals=gg}}catch(_){}});
 const GA=['الأول','الثاني','الثالث','الرابع','الخامس','السادس','السابع'];GOALS=(Array.isArray(u.goals)&&u.goals.length?u.goals:GA.map(x=>['الهدف '+x])).map((x,i)=>({i:i+1,n:Array.isArray(x)?x[0]:String(x)}));
 (b.data||[]).forEach(r=>{if(r.goal)PGOAL[r.code]=+r.goal});if(b.error||!Object.keys(PGOAL).length)GOALS=null}catch(_){GOALS=null}}
function nrm(v){const l=Math.hypot(...v)||1;return v.map(q=>q/l)}
function offs(c,a,r){const up=Math.abs(c[1])>.9?[1,0,0]:[0,1,0];const t1=nrm([up[1]*c[2]-up[2]*c[1],up[2]*c[0]-up[0]*c[2],up[0]*c[1]-up[1]*c[0]]);const t2=[c[1]*t1[2]-c[2]*t1[1],c[2]*t1[0]-c[0]*t1[2],c[0]*t1[1]-c[1]*t1[0]];
 return nrm([0,1,2].map(k=>c[k]*Math.cos(r)+(t1[k]*Math.cos(a)+t2[k]*Math.sin(a))*Math.sin(r)))}
function globeModel(){const P=pjs(),gl=(GOALS||[]).slice(),has=p=>PGOAL&&PGOAL[p.pc]&&gl.some(x=>x.i==PGOAL[p.pc]);const un=P.filter(p=>!has(p));
 const G2=gl.concat(un.length?[{i:0,n:'بدون هدف محدد'}]:[]),n=G2.length,tw=P.reduce((s,p)=>s+(p.w||1),0)||1;
 G2.forEach((x,k)=>{const la=n<=2?0:(k%2?-.32:.32),lo=k/n*2*Math.PI;x.c=nrm([Math.cos(la)*Math.cos(lo),Math.sin(la),Math.cos(la)*Math.sin(lo)]);
  x.L=P.filter(p=>x.i?PGOAL[p.pc]==x.i:!has(p)).sort((a,b)=>(a.ps??0)-(b.ps??0));const w=x.L.reduce((s,p)=>s+(p.w||1),0);x.v=w?Math.round(x.L.reduce((s,p)=>s+(p.ps||0)*(p.w||1),0)/w):null;x.share=Math.round(w/tw*100);
  x.R=Math.max(.24,Math.min(Math.PI/n*.85,.2+.08*Math.sqrt(x.L.length)));
  x.edge=[];for(let m=0;m<48;m++)x.edge.push(offs(x.c,m/48*2*Math.PI,x.R));
  x.lights=x.L.map((p,m)=>({p,v:m==0&&x.L.length==1?x.c:offs(x.c,m*2.399963,x.R*.78*Math.sqrt((m+.5)/x.L.length)),goal:x}))});
 return {G:G2,P}}
function gRot(c,cx,cy,R){const cyw=Math.cos(c.yaw),syw=Math.sin(c.yaw),cp=Math.cos(c.pitch),sp=Math.sin(c.pitch);return v=>{const x=v[0]*cyw-v[2]*syw,z=v[0]*syw+v[2]*cyw,y=v[1]*cp-z*sp,z2=v[1]*sp+z*cp;return [cx+x*R,cy-y*R,z2]}}
function gFace(v){const x=v[0],z=v[2],r=Math.hypot(x,z);return [Math.atan2(-x,-z),-Math.atan2(v[1],r)]}
function drawGlobe(g,c,M,t,o){o=o||{};const W=c.w,H=c.h,ph=W<640;bg(g,W,H);const R=Math.min(W,H)*.38*c.zoom,cx=W/2,cy=H*.5,rot=gRot(c,cx,cy,R);
 g.save();g.shadowColor='rgba(20,50,74,.25)';g.shadowBlur=30;g.shadowOffsetY=10;g.beginPath();g.arc(cx,cy,R,0,7);const sp=g.createRadialGradient(cx-R*.35,cy-R*.4,R*.1,cx,cy,R);sp.addColorStop(0,'#ffffff');sp.addColorStop(1,'#cbd9e7');g.fillStyle=sp;g.fill();g.restore();
 g.lineWidth=.8;g.strokeStyle='rgba(20,50,74,.10)';
 const line=pts=>{g.beginPath();let st=0;pts.forEach(v=>{const [x,y,z]=rot(v);if(z<0){st?g.lineTo(x,y):g.moveTo(x,y);st=1}else st=0});g.stroke()};
 for(let la=-60;la<=60;la+=30){const b=la*Math.PI/180,A=[];for(let lo=0;lo<=360;lo+=6){const a=lo*Math.PI/180;A.push([Math.cos(b)*Math.cos(a),Math.sin(b),Math.cos(b)*Math.sin(a)])}line(A)}
 for(let lo=0;lo<180;lo+=30){const a=lo*Math.PI/180,A=[];for(let la=0;la<=360;la+=6){const b=la*Math.PI/180;A.push([Math.cos(b)*Math.cos(a),Math.sin(b),Math.cos(b)*Math.sin(a)])}line(A)}
 // القارات: رقعة لكل هدف، تُقصّ عند حافة الكرة
 M.G.forEach(x=>{const [,,zc]=rot(x.c);if(zc>.35)return;const on=!o.goal||o.goal===x,col=bandCol(x.v);const P=x.edge.map(v=>{const [px,py,z]=rot(v);if(z<=0)return [px,py];const dx=px-cx,dy=py-cy,l=Math.hypot(dx,dy)||1;return [cx+dx/l*R,cy+dy/l*R]});
  g.globalAlpha=on?1:.3;poly(g,P);g.fillStyle=col+'40';g.fill();g.strokeStyle=col;g.lineWidth=o.goal===x?3:1.8;g.stroke();g.globalAlpha=1});
 // المشاريع: علامة واحدة لكل مشروع
 const LT=[];M.G.forEach(x=>x.lights.forEach(l=>{const [px,py,z]=rot(l.v);l.sx=px;l.sy=py;l.dz=z;LT.push(l)}));
 const rM=ph?9:7.5;
 LT.sort((a,b)=>b.dz-a.dz).forEach(l=>{if(l.dz>-.04){l.bb=null;return}const vis=o.vis?o.vis(l):true,sel=o.sel===l,hv=o.hover===l,on=!o.goal||o.goal===l.goal;g.globalAlpha=(vis&&on?1:.25)*Math.min(1,-l.dz*4+.2);const r=sel||hv?rM+3:rM;
  g.save();g.shadowColor='rgba(20,40,60,.3)';g.shadowBlur=4;g.beginPath();g.arc(l.sx,l.sy,r,0,7);g.fillStyle=colOf(l.p);g.fill();g.restore();g.lineWidth=sel||hv?3:2;g.strokeStyle=sel||hv?'#14324a':'#fff';g.beginPath();g.arc(l.sx,l.sy,r,0,7);g.stroke();
  l.bb=vis&&on?[l.sx-r-5,l.sy-r-5,l.sx+r+5,l.sy+r+5]:null;
  if(sel||hv||NM)pill(g,l.sx,l.sy-r-6,short(l.p.n,ph?22:30)+' · '+l.p.ps+'٪',{bold:sel||hv,size:ph?13:12,bd:sel||hv?'#14324a':null});g.globalAlpha=1});
 // أسماء الأهداف
 M.G.forEach(x=>{const [px,py,z]=rot(x.c);if(z>-.15)return;const on=!o.goal||o.goal===x;const [,,ze]=rot(offs(x.c,Math.PI/2,x.R));const top=rot(offs(x.c,0,x.R));g.globalAlpha=(on?1:.4)*Math.min(1,-z*3);
  const ly=Math.min(py,top[1],rot(offs(x.c,Math.PI,x.R))[1])-6;pill(g,px,ly,short(x.n,ph?20:28)+(x.v!=null?' · '+x.v+'٪':''),{bold:true,size:ph?12.5:12,bg:'#14324a',fg:'#fff'});g.globalAlpha=1})}

/* ---------- لوحة جانبية ---------- */
function projCard(p,extra){const pend=pendOf(p.pc),B=bands(),a=p.act!=null?Math.round(p.act):null,e=p.exp!=null?Math.round(p.exp):null;
 return `<div class="v3-card"><span class="v3-st" style="background:${colOf(p)}">${SNM[p.status]||''}</span><h4>${E(p.n)}</h4><small>${E(secN(p.sec))}${p.pm?' · مدير المشروع: '+E(p.pm):''}</small>
 ${a!=null?`<div class="v3-bar" title="الإنجاز الفعلي مقابل المخطط"><i style="width:${Math.min(100,a)}%;background:${colOf(p)}"></i>${e!=null?`<u style="inset-inline-start:calc(${Math.min(100,e)}% - 1px)"></u>`:''}</div>`:''}
 <div class="v3-m"><span>الإنجاز الفعلي</span><b>${a!=null?a+'٪':'—'}</b><span>المخطط حتى اليوم</span><b>${e!=null?e+'٪':'—'}</b><span>النسبة إلى المخطط</span><b>${p.ps!=null?p.ps+'٪':'—'}</b>${p.late?`<span>مهام متأخرة</span><b>${p.late}</b>`:''}${p.rHigh?`<span>مخاطر عالية</span><b style="color:${COL.bad}">${p.rHigh}</b>`:''}${pend.length?`<span>قرارات عند المكتب</span><b>${nDc(pend.length)}</b>`:''}</div>${extra||''}
 <div class="v3-row"><button class="p" type="button" data-v3o="${E(p.pc)}">فتح المشروع</button><button type="button" data-v3x="1">إغلاق</button></div></div>`}

/* ---------- محرّك العرض ---------- */
const V={cur:null};
function stop(){if(V.cur){cancelAnimationFrame(V.cur.raf);if(V.cur.ro)V.cur.ro.disconnect();V.cur=null}}
function shell(id,tools,leg,help){css();return `<div class="v3"><div class="v3-box" id="v3b"><canvas id="v3c" tabindex="0" aria-label="${E(id)}"></canvas><div class="v3-tb">${tools}</div><div class="v3-lg">${leg}</div></div><aside class="v3-sd" id="v3sd"><div class="v3-card v3-help">${help}</div></aside></div>`}
const camTools=(globe)=>`<span class="sp"></span><button type="button" id="v3nm">${nmTxt()}</button>${globe?`<button type="button" id="v3rot">⏸ إيقاف الدوران</button>`:`<button type="button" class="ic" id="v3l" title="تدوير" aria-label="تدوير لليمين">⟳</button><button type="button" class="ic" id="v3r" title="تدوير" aria-label="تدوير لليسار">⟲</button>`}<button type="button" class="ic" id="v3zi" aria-label="تكبير">＋</button><button type="button" class="ic" id="v3zo" aria-label="تصغير">－</button><button type="button" class="ic" id="v3rst" title="إعادة الضبط" aria-label="إعادة الضبط">↺</button><button type="button" id="v3stage">🎬 العرض التفاعلي</button>`;
function boot(kind,draw,cfg){stop();const cv=$i('v3c');if(!cv)return;const box=$i('v3b');const c=mkCam(cfg.cam);const st={c,kind,draw,cfg,raf:0,lt:0,items:cfg.items||(()=>[])};V.cur=st;
 const fit=()=>{const w=box.clientWidth,h=w<640?Math.max(400,Math.min(560,Math.round(innerHeight*.6))):Math.max(460,Math.min(680,Math.round(w*.62)));const dp=Math.min(2,devicePixelRatio||1);cv.width=w*dp;cv.height=h*dp;cv.style.width=w+'px';cv.style.height=h+'px';c.w=w;c.h=h;c.dp=dp;c.dirty=1};fit();
 if(c.w<640){c.auto=false;c.zoom*=cfg.phZoom||1}
 st.ro=new ResizeObserver(()=>{if(Math.abs(box.clientWidth-c.w)>20)fit()});st.ro.observe(box);
 const pos=e=>{const r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};
 const pick=(x,y)=>{let best=null,bd=1e9;st.items().forEach(b=>{if(!b.bb)return;if(x>=b.bb[0]&&x<=b.bb[2]&&y>=b.bb[1]&&y<=b.bb[3]){const d=(b.dz??0);if(d<bd){bd=d;best=b}}});return best};
 const pmin=cfg.pmin??.5,pmax=cfg.pmax??1.15;
 cv.onpointerdown=e=>{try{cv.setPointerCapture(e.pointerId)}catch(_){}c.drag={x:e.clientX,y:e.clientY,yaw:c.yaw,pitch:c.pitch,mv:0,tp:e.pointerType};c.anim=null;c.auto=false;syncRot()};
 cv.onpointermove=e=>{if(c.drag){const dx=e.clientX-c.drag.x,dy=e.clientY-c.drag.y;c.drag.mv=Math.max(c.drag.mv,Math.abs(dx)+Math.abs(dy));if(c.drag.mv>8){c.yaw=c.drag.yaw-dx*.007;c.pitch=Math.max(pmin,Math.min(pmax,c.drag.pitch+dy*.005));c.dirty=1}return}if(e.pointerType!='mouse')return;const [x,y]=pos(e),h=pick(x,y);if(h!==c.hover){c.hover=h;c.dirty=1;hiList()}cv.style.cursor=h?'pointer':'grab'};
 cv.onpointerup=e=>{const d=c.drag;c.drag=null;if(d&&d.mv<=8){const [x,y]=pos(e),h=pick(x,y);if(h){if(c.sel===h&&Date.now()-(c.lc||0)<450)openP(h.p.pc);else select(h,false)}else if(c.sel){c.sel=null;side()}c.lc=Date.now()}c.dirty=1};
 cv.onpointercancel=()=>{c.drag=null};
 cv.onpointerleave=()=>{if(c.hover){c.hover=null;c.dirty=1;hiList()}};
 cv.onwheel=e=>{e.preventDefault();c.zoom=Math.max(.5,Math.min(3.5,c.zoom*(e.deltaY>0?.9:1.1)));c.dirty=1};
 let pd=null;cv.addEventListener('touchmove',e=>{if(e.touches.length==2){e.preventDefault();const dd=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);if(pd)c.zoom=Math.max(.5,Math.min(3.5,c.zoom*dd/pd));pd=dd;c.drag=null;c.dirty=1}},{passive:false});cv.addEventListener('touchend',()=>pd=null);
 cv.onkeydown=e=>{const k={ArrowLeft:[.2,0],ArrowRight:[-.2,0],ArrowUp:[0,-.08],ArrowDown:[0,.08]}[e.key];if(k){e.preventDefault();c.yaw+=k[0];c.pitch=Math.max(pmin,Math.min(pmax,c.pitch+k[1]))}if(e.key=='+'||e.key=='=')c.zoom=Math.min(3.5,c.zoom*1.15);if(e.key=='-')c.zoom=Math.max(.5,c.zoom/1.15);if(e.key=='Escape'&&c.sel){c.sel=null;side()}c.dirty=1};
 const btn=(id,f)=>{const b=$i(id);if(b)b.onclick=f};
 btn('v3l',()=>{c.auto=false;anim(c,c.yaw+Math.PI/4,c.pitch,c.zoom,500,c.tx,c.tz)});btn('v3r',()=>{c.auto=false;anim(c,c.yaw-Math.PI/4,c.pitch,c.zoom,500,c.tx,c.tz)});
 btn('v3zi',()=>anim(c,c.yaw,c.pitch,Math.min(3.5,c.zoom*1.3),300,c.tx,c.tz));btn('v3zo',()=>anim(c,c.yaw,c.pitch,Math.max(.5,c.zoom/1.3),300,c.tx,c.tz));
 btn('v3rst',()=>{c.sel=null;if(cfg.reset)cfg.reset();const k=cfg.cam;anim(c,k.yaw,k.pitch,k.zoom*(c.w<640?cfg.phZoom||1:1),800,0,0);side()});btn('v3stage',()=>stage());
 btn('v3nm',()=>{window.V3NMset(!NM);const b=$i('v3nm');if(b)b.textContent=nmTxt();c.dirty=1});const syncRot=()=>{const r=$i('v3rot');if(r)r.textContent=c.auto?'⏸ إيقاف الدوران':'▶ دوران تلقائي'};btn('v3rot',()=>{c.auto=!c.auto;syncRot()});syncRot();
 const loop=t=>{if(!$i('v3c')){st.raf=0;return}const mv=step(c,t)||c.drag||c.dirty;if(!document.hidden&&(mv||t-st.lt>500)){const g=cv.getContext('2d');g.setTransform(c.dp,0,0,c.dp,0,0);g.setLineDash([]);draw(g,c,t);st.lt=t;c.dirty=0}st.raf=requestAnimationFrame(loop)};st.raf=requestAnimationFrame(loop);
 side();return st}
function select(b,fly){const st=V.cur;if(!st)return;st.c.sel=b;st.c.auto=false;const r=$i('v3rot');if(r)r.textContent='▶ دوران تلقائي';if(fly&&st.cfg.fly)st.cfg.fly(b);st.c.dirty=1;side();if(innerWidth<900){const el=$i('v3sd');if(el&&el.firstElementChild)setTimeout(()=>el.firstElementChild.scrollIntoView({block:'nearest',behavior:'smooth'}),60)}}
function hiList(){const el=$i('v3sd'),st=V.cur;if(!el||!st)return;el.querySelectorAll('[data-v3p]').forEach(x=>x.classList.toggle('hv',!!st.c.hover&&x.dataset.v3p==st.c.hover.p.pc))}
function side(){const st=V.cur,el=$i('v3sd');if(!st||!el)return;const c=st.c;let h='';
 if(c.sel)h+=projCard(c.sel.p,st.cfg.extra?st.cfg.extra(c.sel):'');
 h+=st.cfg.side?st.cfg.side():'';el.innerHTML=h;
 el.querySelectorAll('[data-v3o]').forEach(b=>b.onclick=()=>openP(b.dataset.v3o));el.querySelectorAll('[data-v3x]').forEach(b=>b.onclick=()=>{c.sel=null;c.dirty=1;side()});
 el.querySelectorAll('[data-v3p]').forEach(b=>{b.onclick=()=>{const it=st.items().find(x=>x.p.pc==b.dataset.v3p);if(it)select(it,true)};b.onmouseenter=()=>{c.hover=st.items().find(x=>x.p.pc==b.dataset.v3p)||null;c.dirty=1};b.onmouseleave=()=>{c.hover=null;c.dirty=1}});
 if(st.cfg.bindSide)st.cfg.bindSide(el)}
function liH(p,cls){return `<button type="button" class="v3-li${cls?' '+cls:''}" data-v3p="${E(p.pc)}"><i style="background:${colOf(p)}"></i><b>${E(short(p.n,40))}</b><em>${p.ps!=null?p.ps+'٪':''}</em></button>`}
function listH(L,title){return `<div class="v3-card"><b style="display:block;margin-bottom:6px">${title}</b>${L.map(b=>liH(b.p)).join('')||'<div class="v3-help">لا مشاريع تطابق الاختيار</div>'}</div>`}
function worst(items,n){return new Set(items.slice().sort((a,b)=>(a.p.ps??0)-(b.p.ps??0)).slice(0,n))}

/* ---- فلاتر الخارطة وملامح الإنجاز ---- */
let CF={sec:'all',fo:'all'};
function vis(b){if(CF.sec!='all'&&b.dist&&b.dist.s.id!=CF.sec)return false;if(CF.fo=='bad'&&b.p.status!='bad')return false;if(CF.fo=='warn'&&b.p.status=='ok')return false;if(CF.fo=='pend'&&!pendOf(b.p.pc).length)return false;if(CF.fo=='risk'&&!b.p.rHigh)return false;return true}
function filt(L){return `<select id="v3sec" aria-label="القطاع"><option value="all">كل القطاعات</option>${L.D.map(d=>`<option value="${E(d.s.id)}" ${CF.sec==d.s.id?'selected':''}>${E(d.s.n)}</option>`).join('')}</select>${[['all','الكل'],['warn','تحتاج متابعة أو متعثرة'],['bad','المتعثرة'],['pend','بقرار معلّق'],['risk','بمخاطر عالية']].map(([k,t])=>`<button type="button" data-v3f="${k}" class="${CF.fo==k?'on':''}">${t}</button>`).join('')}`}
function bindFilt(L){const fly=()=>{const st=V.cur;if(!st)return;const d=L.D.find(x=>x.s.id==CF.sec);if(d)anim(st.c,st.c.yaw,st.c.pitch,Math.min(2.2,Math.max(1.2,L.span/(d.size*2.2))),800,d.cx,d.cz);else anim(st.c,st.c.yaw,st.c.pitch,st.cfg.cam.zoom*(st.c.w<640?st.cfg.phZoom||1:1),800,0,0)};
 const s=$i('v3sec');if(s)s.onchange=e=>{CF.sec=e.target.value;fly();if(V.cur){V.cur.c.dirty=1;side()}};document.querySelectorAll('[data-v3f]').forEach(b=>b.onclick=()=>{CF.fo=b.dataset.v3f;document.querySelectorAll('[data-v3f]').forEach(x=>x.classList.toggle('on',x===b));if(V.cur){V.cur.c.dirty=1;side()}})}

/* ---- الخارطة ---- */
function cityHTML(){const L=layout();return {svg:shell('خارطة الإنجاز',filt(L)+camTools(false),cityLegend(),
 `<b>كيف تُقرأ الخارطة؟</b><br>كل <b>حي</b> قطاع، وكل <b>مبنى</b> مشروع جارٍ. <b>ارتفاع المبنى</b> = نسبة الإنجاز الفعلية، و<b>الإطار المنقّط</b> = الارتفاع المخطط حتى اليوم؛ فإذا كان الإطار أعلى من المبنى فالمشروع متأخر. <b>اللون</b> = الحالة، والرقم فوق المبنى = نسبة الإنجاز إلى المخطط.<br>اضغط مبنى لتفاصيله، واسحب لتدوير الخارطة، واقرص أو استخدم ＋ و－ للتكبير.`),ins:cityIns(L)}}
function cityIns(L){const b=L.items.filter(x=>x.p.status=='bad'),p=L.items.filter(x=>x.pend.length);const wd=L.D.filter(d=>d.v!=null).sort((a,b)=>a.v-b.v)[0];
 return `${nP(L.items.length)} جارية في ${L.D.length} ${L.D.length<=2?'قطاع':'قطاعات'}${b.length?` · ${b.length==1?'مشروع متعثر':b.length==2?'مشروعان متعثران':b.length+' مشاريع متعثرة'}`:''}${p.length?` · ${nP(p.length)} بقرار معلّق`:''}${wd&&L.D.length>1?` · أضعف قطاع: ${E(wd.s.n)} (${wd.v}٪)`:''}`}
function cityStart(){const L=layout();const lab=worst(L.items,3);
 boot('city',(g,c,t)=>drawCity(g,c,L,t,{sel:c.sel,hover:c.hover,vis,labels:CF.fo=='all'&&CF.sec=='all'?lab:new Set(),sec:CF.sec}),
  {cam:{span:L.span,yaw:-.62,pitch:.72,zoom:.74,cy:.58},phZoom:1.15,items:()=>L.items,pmin:.45,pmax:1.2,fly:b=>anim(V.cur.c,V.cur.c.yaw,.8,Math.max(V.cur.c.zoom,1.8),900,b.x,b.z),reset:()=>{CF.sec='all';const s=$i('v3sec');if(s)s.value='all'},
   side:()=>listH(L.items.filter(vis).sort((a,b)=>(a.p.ps??0)-(b.p.ps??0)),'المشاريع من الأحرج إلى الأفضل')});
 bindFilt(L)}

/* ---- ملامح الإنجاز ---- */
let TW=0,RVD=null;
const wkT=w=>w?'قبل '+(w==1?'أسبوع':w==2?'أسبوعين':w+' أسابيع'):'اليوم';
function psAt(p,w){if(!w||!RVD||!RVD[p.pc])return p.ps;const a=RVD[p.pc],r=a[a.length-1-w];if(!r)return null;const ac=+r[1],pl=+r[2];if(!(pl>=5))return 100;return Math.max(0,Math.min(100,Math.round(ac/pl*100)))}
function terrainHTML(){const L=layout();return {svg:shell('ملامح الإنجاز',filt(L)+`<label>الأسبوع <input type="range" id="v3w" min="0" max="8" step="1" value="${8-TW}" aria-label="الأسبوع"><span id="v3wl">${wkT(TW)}</span></label><button type="button" id="v3play">▶ تشغيل</button>`+camTools(false),
 `<span><i style="background:#4fb07c"></i>قمم = على المسار</span><span><i style="background:#eab04e"></i>سهول = يحتاج متابعة</span><span><i style="background:#d9475a"></i>منخفضات = متعثر</span><span><i style="background:#dfe5ec"></i>لا مشاريع</span>`,
 `<b>كيف تُقرأ ملامح الإنجاز؟</b><br>الأرض مقسّمة إلى القطاعات نفسها في الخارطة. <b>الارتفاع واللون</b> = أداء المشاريع في تلك البقعة مقارنة بالمخطط. مستوى سطح الأرض = حد التعثر (${bands().a}٪): القمم الخضراء على المسار، والمنخفضات الحمراء متعثرة. الدبوس = مشروع والرقم فيه نسبته إلى المخطط.<br>حرّك شريط <b>الأسبوع</b> أو اضغط «تشغيل» لترى كيف تغيّرت الأرض خلال ثمانية أسابيع.`),ins:terrIns(L)}}
function secAvg(d,w){const L=d.L.map(q=>({v:psAt(q,w),w:q.w||1})).filter(x=>x.v!=null);const sw=L.reduce((s,x)=>s+x.w,0);return sw?Math.round(L.reduce((s,x)=>s+x.v*x.w,0)/sw):null}
function terrIns(L){const D=L.D.map(d=>({d,v:secAvg(d,TW)})).filter(x=>x.v!=null).sort((a,b)=>a.v-b.v);if(!D.length)return '';return `${wkT(TW)}: الأدنى ${E(D[0].d.s.n)} (${D[0].v}٪)${D.length>1?` · الأعلى ${E(D[D.length-1].d.s.n)} (${D[D.length-1].v}٪)`:''}`}
async function terrainStart(){const L=layout();let T=terrainGrid(L,p=>psAt(p,TW));L.items.forEach(b=>b.v=psAt(b.p,TW));const lab=worst(L.items,3);
 const st=boot('terrain',(g,c,t)=>drawTerrain(g,c,L,T,t,{sel:c.sel,hover:c.hover,vis,labels:CF.fo=='all'&&CF.sec=='all'?lab:new Set(),sec:CF.sec}),{cam:{span:L.span,yaw:-.62,pitch:.85,zoom:.8,cy:.56},phZoom:1.15,items:()=>L.items,pmin:.5,pmax:1.25,
  fly:b=>anim(V.cur.c,V.cur.c.yaw,.9,Math.max(V.cur.c.zoom,1.7),900,b.x,b.z),reset:()=>{CF.sec='all';const s=$i('v3sec');if(s)s.value='all'},
  extra:b=>TW&&b.v!=null?`<div class="v3-m"><span>${wkT(TW)}</span><b>${b.v}٪ إلى المخطط</b></div>`:'',
  side:()=>`<div class="v3-card"><b style="display:block;margin-bottom:6px">القطاعات من الأدنى إلى الأعلى · ${wkT(TW)}</b>${L.D.map(d=>({d,v:secAvg(d,TW)})).sort((a,b)=>(a.v??0)-(b.v??0)).map(x=>`<div class="v3-li" style="cursor:default"><i style="background:${bandCol(x.v)}"></i><b>${E(x.d.s.n)}</b><em>${x.v!=null?x.v+'٪ · ':''}${nP(x.d.L.length)}</em></div>`).join('')}</div>`+listH(L.items.filter(vis).sort((a,b)=>(a.v??a.p.ps??0)-(b.v??b.p.ps??0)),'المشاريع من الأحرج إلى الأفضل')});
 bindFilt(L);
 const sl=$i('v3w'),lb=$i('v3wl'),pb=$i('v3play');
 const setW=w=>{TW=w;sl.value=8-w;lb.textContent=wkT(w);T=terrainGrid(L,p=>psAt(p,TW));L.items.forEach(b=>b.v=psAt(b.p,TW));st.c.dirty=1;side();const ins=document.querySelector('#mapIns .insight span');if(ins)ins.innerHTML=terrIns(L)};
 sl.oninput=()=>setW(8-(+sl.value));
 let pt=null;pb.onclick=()=>{if(pt){clearInterval(pt);pt=null;pb.textContent='▶ تشغيل';return}let w=8;setW(w);pb.textContent='⏸ إيقاف';pt=setInterval(()=>{w--;if(w<0||!$i('v3c')){clearInterval(pt);pt=null;pb.textContent='▶ تشغيل';return}setW(w)},1100)};
 if(!RVD){try{const r=await G('sb').rpc('room_river',{p_weeks:9});RVD=r.error?{}:(r.data||{})}catch(_){RVD={}}}
 if(!Object.keys(RVD).length&&sl){sl.closest('label').style.display='none';pb.style.display='none'}}

/* ---- الكرة ---- */
let GSEL=null;
function globeHTML(){return {svg:shell('الأهداف المؤسسية',camTools(true),
 `<span>كل رقعة = هدف استراتيجي</span><span>كل دائرة = مشروع</span><span><i style="background:${COL.ok}"></i>على المسار</span><span><i style="background:${COL.warn}"></i>يحتاج متابعة</span><span><i style="background:${COL.bad}"></i>متعثر</span>`,
 `<b>كيف تُقرأ الكرة؟</b><br>كل <b>رقعة ملوّنة</b> هدف من أهداف المركز الاستراتيجية، وحجمها بحسب عدد مشاريعه، ولون حدودها = متوسط أداء مشاريعه إلى المخطط. كل <b>دائرة</b> مشروع واحد (عددها = عدد المشاريع الجارية)، ولونها حالته.<br>اضغط دائرة لتفاصيل المشروع، أو اضغط هدفًا من القائمة لتدور الكرة إليه وتظهر مشاريعه.`),ins:''}}
async function globeStart(){const box=$i('v3sd');if(box)box.insertAdjacentHTML('afterbegin','<div class="v3-card v3-help" id="v3ld">جارٍ تحميل الأهداف…</div>');await loadGoals();const ld=$i('v3ld');if(ld)ld.remove();if(!$i('v3c'))return;const M=globeModel();const items=()=>M.G.flatMap(x=>x.lights);GSEL=null;
 const face=(v,z)=>{const [y,p]=gFace(v);anim(V.cur.c,y,p,z||V.cur.c.zoom,1100)};
 const st=boot('globe',(g,c,t)=>drawGlobe(g,c,M,t,{sel:c.sel,hover:c.hover,goal:GSEL}),{cam:{span:400,yaw:.3,pitch:.12,zoom:1,auto:!reduce&&innerWidth>=640},items,pmin:-1.2,pmax:1.2,
  fly:l=>face(l.v,1.6),reset:()=>{GSEL=null},
  extra:l=>`<div class="v3-m"><span>الهدف الاستراتيجي</span><b>${E(l.goal.n)}</b></div>`,
  side:()=>{const S=M.G.slice().sort((a,b)=>(a.i||99)-(b.i||99));return `<div class="v3-card"><b style="display:block;margin-bottom:6px">الأهداف الاستراتيجية</b>${S.map(x=>{const k=M.G.indexOf(x),on=GSEL===x;return `<button type="button" class="v3-li${on?' hv':''}" data-v3g="${k}"><i style="background:${bandCol(x.v)}"></i><b>${E(x.n)}</b><em>${x.v!=null?x.v+'٪ · ':''}${nP(x.L.length)}</em></button>${on?`<div class="v3-sub">${x.L.map(p=>liH(p)).join('')||'<div class="v3-help">لا مشاريع جارية لهذا الهدف</div>'}<div class="v3-help">حصته من أوزان المحفظة: ${x.share}٪</div></div>`:''}`}).join('')}${GSEL?'<button type="button" class="v3-li" data-v3g="-1">عرض كل الأهداف</button>':''}</div>`},
  bindSide:el=>el.querySelectorAll('[data-v3g]').forEach(b=>b.onclick=()=>{const k=+b.dataset.v3g;GSEL=k<0||M.G[k]===GSEL?null:M.G[k];V.cur.c.auto=false;if(GSEL)face(GSEL.c,Math.min(1.6,1/(GSEL.R*1.6)+.4));else anim(V.cur.c,V.cur.c.yaw,V.cur.c.pitch,1,700);V.cur.c.dirty=1;side()})});
 const ins=$i('mapIns');if(ins){const w=M.G.filter(x=>x.v!=null&&x.i).sort((a,b)=>a.v-b.v),un=M.G.find(x=>x.i===0);ins.innerHTML=`<div class="insight"><i>💡</i><span>${nP(M.P.length)} جارية على ${M.G.filter(x=>x.i&&x.L.length).length} من ${M.G.filter(x=>x.i).length} أهداف${w.length>1?` · الأضعف: ${E(w[0].n)} (${w[0].v}٪) · الأقوى: ${E(w[w.length-1].n)} (${w[w.length-1].v}٪)`:''}${un?' · '+nP(un.L.length)+' بلا هدف في الميثاق':''}</span></div>`}}

/* ================== 4) العرض التفاعلي ================== */
const nD=n=>plr(n,'يوم واحد','يومان','أيام','يومًا'),nT=n=>plr(n,'مهمة واحدة','مهمتان','مهام','مهمة'),nK=n=>plr(n,'مؤشر واحد','مؤشران','مؤشرات','مؤشرًا'),nR=n=>plr(n,'خطر واحد','خطران','مخاطر','خطرًا');
const fD=x=>{if(!x)return '';const d=x instanceof Date?x:new Date(String(x).slice(0,10)+'T00:00:00');return isNaN(d)?'':d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()};
function pFacts(p,pend){const a=p.act!=null?Math.round(p.act):null,e=p.exp!=null?Math.round(p.exp):null,F=[];
 F.push([SNM[p.status]||'—',colOf(p),{t:'proj',p}]);
 if(a!=null)F.push([`الإنجاز ${a}٪ من ${e??0}٪ مخطط`]);if(p.ps!=null)F.push([`النسبة إلى المخطط ${p.ps}٪`]);
 F.push([`المهام: ${p.tasks||0}`+(p.late?` · منها ${p.late} متأخرة`:''),p.late?COL.warn:null,{t:'late',p}]);
 const kp=p.kp||[];if(kp.length)F.push([`المؤشرات: ${kp.length}`+((p.kOff||0)+(p.kWarn||0)?` · ${(p.kOff||0)+(p.kWarn||0)} خارج المستهدف`:''),null,{t:'kpi',p}]);
 const rk=p.rk||[];if(rk.length)F.push([`المخاطر: ${rk.length}`+(p.rHigh?` · ${p.rHigh} ذات تقييم عالٍ`:''),p.rHigh?COL.bad:null,{t:'risk',p}]);
 if(pend.length)F.push([`${nDc(pend.length)} عند المكتب`,'#c99a2e',{t:'dec',p}]);
 if(p.ed)F.push([`الانتهاء المخطط ${fD(p.ed)}`]);
 if(p.fc&&p.fc.stall)F.push(['لا تقدّم ملحوظ مؤخرًا',COL.bad]);else if(p.fc&&p.fc.f)F.push([`الانتهاء المتوقع ${fD(p.fc.f)}`+(p.fcLate?` (بعد الموعد بـ${nD(p.fcLate)})`:''),p.fcLate?COL.warn:null]);
 if(p.pm)F.push([`مدير المشروع: ${p.pm}`]);
 if(p.idle!=null&&p.idle<999)F.push([p.idle<1?'حُدّث اليوم':`آخر تحديث قبل ${nD(p.idle)}`,p.idle>14?COL.warn:null]);
 return F}
function pStory(p,pend){const a=p.act!=null?Math.round(p.act):null,e=p.exp!=null?Math.round(p.exp):null,s=[];
 if(a==null)return 'لا توجد قراءة إنجاز كافية لهذا المشروع بعد.';
 if(p.status=='ok')s.push(a>=(e??0)?`يسير على المسار: أنجز ${a}٪ والمخطط حتى اليوم ${e??0}٪.`:`ضمن المسار: أنجز ${a}٪ والمخطط ${e??0}٪.`);
 else if(p.status=='warn')s.push(`يحتاج متابعة: أنجز ${a}٪ والمخطط حتى اليوم ${e??0}٪.`);
 else s.push(`متعثر: أنجز ${a}٪ فقط والمخطط حتى اليوم ${e??0}٪.`);
 if(p.late)s.push(`يتضمن ${nT(p.late)} متأخرة${p.oldest?`، أقدمها متأخرة ${nD(p.oldest)}`:''}.`);
 if(p.rHigh)s.push(`يحتوي على مخاطر ذات تقييم عالٍ (${nR(p.rHigh)}).`);
 if(pend.length)s.push(`وهناك ${nDc(pend.length)} بانتظار المكتب.`);
 if(p.fcLate)s.push(`وبالوتيرة الحالية سينتهي بعد موعده بـ${nD(p.fcLate)}.`);
 return s.join(' ')}
function stage(){stop();css();const L=layout(),items=L.items,cur=G('CUR'),hist=G('HIST')||[];const P=items.map(b=>b.p);
 const cnt=A=>({ok:A.filter(p=>p.status=='ok').length,wn:A.filter(p=>p.status=='warn').length,bd:A.filter(p=>p.status=='bad').length});
 const T0=cnt(P),pendAll=P.flatMap(p=>pendOf(p.pc).map(a=>({a,p}))),D2=L.D.filter(d=>d.v!=null).sort((a,b)=>a.v-b.v);
 let v=null;try{v=cur?cur():null}catch(_){}const dlt=hist.length>1&&hist[hist.length-1]!=null&&hist[hist.length-2]!=null?hist[hist.length-1]-hist[hist.length-2]:0;
 const SC=[],grp=[];
 SC.push({k:'title',g:'البداية',h:'حالة المحفظة اليوم',big:v!=null?v:'—',p:`الأداء العام للمركز من 100${dlt?` · ${dlt<0?'تراجع':'تحسّن'} ${Math.abs(dlt)} عن الأسبوع الماضي`:''}`,cam:{yaw:-.62,pitch:.75,zoom:.8},ms:7000});
 SC.push({k:'city',g:'البداية',h:'خارطة الإنجاز: نظرة عامة',p:`${nP(P.length)} جارية في ${L.D.length} ${L.D.length<=2?'قطاع':'قطاعات'}: ${T0.ok} على المسار، و${T0.wn} تحتاج متابعة، و${T0.bd} متعثرة. كل مبنى مشروع، وارتفاعه إنجازه، والإطار المنقّط المخطط حتى اليوم.`,cam:{yaw:-.5,pitch:.72,zoom:.9},ms:9000});
 L.D.slice().sort((a,b)=>(a.v??0)-(b.v??0)).forEach((d,di)=>{const A=d.L,c=cnt(A),late=A.reduce((s,p)=>s+(p.late||0),0),rh=A.reduce((s,p)=>s+(p.rHigh||0),0),pd=A.reduce((s,p)=>s+pendOf(p.pc).length,0);
  const zoom=Math.max(.95,Math.min(1.45,L.span/(d.size*2.4)));
  const F=[[`${nP(A.length)}`,null,{t:'sp',d}],[`الأداء ${d.v??'—'}٪ من المخطط`,bandCol(d.v),{t:'sp',d}],[`${c.ok} على المسار`,COL.ok,{t:'sp',d,st:'ok'}],[`${c.wn} تحتاج متابعة`,COL.warn,{t:'sp',d,st:'warn'}],[`${c.bd} متعثرة`,COL.bad,{t:'sp',d,st:'bad'}]];if(late)F.push([`${nT(late)} متأخرة`,COL.warn,{t:'sl',d}]);if(rh)F.push([`مخاطر ذات تقييم عالٍ: ${rh}`,COL.bad,{t:'sr',d}]);if(pd)F.push([`${nDc(pd)} عند المكتب`,'#c99a2e',{t:'sd',d}]);
  const w=A.slice().sort((a,b)=>(a.ps??0)-(b.ps??0))[0],bst=A.slice().sort((a,b)=>(b.ps??0)-(a.ps??0))[0];
  SC.push({k:'sec',d,g:d.s.n,h:`القطاع ${di+1} من ${L.D.length}: ${d.s.n}`,p:A.length>1?`الأضعف «${w.n}» (${w.ps}٪)، والأفضل «${bst.n}» (${bst.ps}٪). سنمر على مشاريعه واحدًا واحدًا.`:`مشروع واحد: «${A[0].n}».`,F,cam:{yaw:-.62-di*.45,pitch:.8,zoom,x:d.cx,z:d.cz},ms:10000});
  A.slice().sort((a,b)=>(a.ps??0)-(b.ps??0)).forEach((p,pi)=>{const b=items.find(x=>x.p===p),pend=pendOf(p.pc);
   SC.push({k:'focus',b,g:d.s.n,h:p.n,sub:`${d.s.n} · المشروع ${pi+1} من ${A.length}`,p:pStory(p,pend),F:pFacts(p,pend),cam:{yaw:-.62-di*.45-(pi%2?.25:-.25),pitch:.85,zoom:Math.min(1.6,zoom*1.15),x:b.x,z:b.z},ms:11000})})});
 if(pendAll.length){const byK={};pendAll.forEach(x=>{const k=CATN(x.a.cat);byK[k]=(byK[k]||0)+1});
  SC.push({k:'dec',g:'الختام',h:'قرارات تنتظر المكتب',p:`${nDc(pendAll.length)} على ${nP(new Set(pendAll.map(x=>x.p.pc)).size)}، وهي المباني ذات الشارة الذهبية.`,F:Object.entries(byK).map(([k,n])=>[`${k}: ${n}`,'#c99a2e',{t:'ad',k}]),cam:{yaw:-1,pitch:.7,zoom:.95},hl:'pend',ms:9000})}
 if(D2.length)SC.push({k:'terrain',g:'الختام',h:'ملامح الإنجاز',p:`الأدنى قطاع ${D2[0].s.n} (${D2[0].v}٪ من المخطط)${D2.length>1?`، والأعلى ${D2[D2.length-1].s.n} (${D2[D2.length-1].v}٪).`:'.'}`,F:D2.map(d=>[`${d.s.n}: ${d.v}٪`,bandCol(d.v),{t:'sp',d}]),cam:{yaw:-.62,pitch:.85,zoom:.95},ms:9000});
 SC.push({k:'globe',g:'الختام',h:'الأهداف المؤسسية',p:'كل رقعة هدف استراتيجي، وكل دائرة مشروع بلون حالته.',goals:1,cam:{yaw:.3,pitch:.12,zoom:1},ms:11000});
 let brief='';try{const f=G('briefText');brief=f?f():''}catch(_){}
 SC.push({k:'end',g:'الختام',h:'الخلاصة',p:String(brief||`${T0.ok} على المسار، ${T0.wn} تحتاج متابعة، ${T0.bd} متعثرة.`).replace(/<[^>]+>/g,''),cam:{yaw:-.62,pitch:.95,zoom:.8},ms:14000});
 const groups=[...new Set(SC.map(s=>s.g))];
 const o=document.createElement('div');o.className='v3s';o.setAttribute('role','dialog');o.setAttribute('aria-label','العرض التفاعلي');
 o.innerHTML=`<div class="v3s-top"><b>🎬 العرض التفاعلي</b><span style="display:flex;gap:6px"><select id="v3sj" aria-label="انتقل إلى">${groups.map(g=>`<optgroup label="${E(g)}">${SC.map((s,j)=>s.g==g?`<option value="${j}">${E(s.k=='sec'?'▸ '+s.d.s.n:s.k=='focus'?'   '+s.h:s.h)}</option>`:'').join('')}</optgroup>`).join('')}</select><button type="button" id="v3sx">✕ إنهاء</button></span></div><canvas id="v3sc"></canvas><div class="v3s-txt"><div id="v3st"></div></div><div class="v3s-ctl"><button type="button" id="v3sp">‹ السابق</button><button type="button" id="v3sg">⏸ إيقاف</button><button type="button" id="v3sn">التالي ›</button><span class="v3s-sp"><button type="button" id="v3s-" title="أبطأ" aria-label="إبطاء العرض">🐢 أبطأ</button><b id="v3sv"></b><button type="button" id="v3s+" title="أسرع" aria-label="تسريع العرض">🐇 أسرع</button></span><span class="v3s-n" id="v3sn2"></span></div><div class="v3s-pg"><i id="v3spg"></i></div>`;
 document.body.appendChild(o);try{o.requestFullscreen&&o.requestFullscreen().catch(()=>{})}catch(_){}
 const cv=$i('v3sc'),c=mkCam({span:L.span,cy:.42});let T=null,M=null,i=0,play=true,timer=null,raf=0;const SPD=[1/3,1/2,1,2,3],SPN=['أبطأ ×3','أبطأ ×2','السرعة ×1','أسرع ×2','أسرع ×3'];let spi=2;try{const v=+localStorage.getItem('ido_v3sp');if(v>=0&&v<=4&&localStorage.getItem('ido_v3sp')!==null)spi=v}catch(_){}
 const fit=()=>{const w=cv.clientWidth,h=cv.clientHeight,dp=Math.min(2,devicePixelRatio||1);cv.width=w*dp;cv.height=h*dp;c.w=w;c.h=h;c.dp=dp};fit();addEventListener('resize',fit);
 loadGoals().then(()=>{M=globeModel()});
 let CF=[];const chips=F=>{CF=F||[];return F&&F.length?`<div class="v3s-ch">${F.map(([t,col,a],j)=>a?`<button type="button" data-ci="${j}"${col?` style="border-color:${col};box-shadow:inset 3px 0 0 ${col}"`:''}>${E(t)} ›</button>`:`<span${col?` style="border-color:${col};box-shadow:inset 3px 0 0 ${col}"`:''}>${E(t)}</span>`).join('')}</div>`:''};
 const show=k=>{i=Math.max(0,Math.min(SC.length-1,k));const s=SC[i];$i('v3sn2').textContent=(i+1)+' / '+SC.length;$i('v3spg').style.width=((i+1)/SC.length*100)+'%';const sj=$i('v3sj');if(sj)sj.value=String(i);
  let F=s.F;if(s.goals&&M)F=M.G.filter(x=>x.L.length).sort((a,b)=>(a.v??0)-(b.v??0)).map(x=>[`${x.n}: ${x.v??'—'}٪ · ${nP(x.L.length)}`,bandCol(x.v),{t:'gp',g:x}]);
  $i('v3st').innerHTML=s.k=='title'?`<h3>${E(s.h)}</h3><p class="v3s-big">${E(s.big)}</p><p>${E(s.p)}</p>`:`${s.sub?`<small>${E(s.sub)}</small>`:''}<h3>${E(s.h)}</h3><p>${E(s.p)}</p>${chips(F)}`;
  if(s.k=='terrain'&&!T)T=terrainGrid(L,p=>p.ps);
  c.span=s.k=='globe'?400:L.span;anim(c,s.cam.yaw,s.cam.pitch,s.cam.zoom,Math.max(500,1500/Math.max(1,SPD[spi])),s.cam.x||0,s.cam.z||0);
  clearTimeout(timer);if(play)timer=setTimeout(()=>{if(i<SC.length-1)show(i+1);else{play=false;$i('v3sg').textContent='▶ تشغيل'}},(s.ms||9000)/SPD[spi])};
 const loop=t=>{if(!document.body.contains(o))return;step(c,t);const s=SC[i];if(!c.anim&&!reduce&&s.k!='title')c.yaw+=(s.k=='globe'?.0045:.0006)*Math.min(2,SPD[spi]);const g=cv.getContext('2d');g.setTransform(c.dp,0,0,c.dp,0,0);g.setLineDash([]);
  if(s.k=='globe'&&M)drawGlobe(g,c,M,t,{});else if(s.k=='terrain'&&T)drawTerrain(g,c,L,T,t,{labels:new Set(),stage:1});
  else drawCity(g,c,L,t,{sel:s.b||null,sec:s.d?s.d.s.id:s.b?s.b.dist.s.id:'all',vis:s.hl=='pend'?(b=>b.pend.length>0):s.b?(b=>b===s.b):s.d?(b=>b.dist===s.d):null,labels:s.b?new Set([s.b]):s.d?new Set(items.filter(b=>b.dist===s.d)):s.hl=='pend'?new Set(items.filter(b=>b.pend.length)):new Set(),stage:1});
  raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);
 const end=()=>{clearTimeout(timer);cancelAnimationFrame(raf);removeEventListener('resize',fit);removeEventListener('keydown',kd);try{if(document.fullscreenElement)document.exitFullscreen()}catch(_){}o.remove();const f=G('drawMap');if(f)f()};
 const kd=e=>{if(e.target&&e.target.tagName=='SELECT')return;if(e.key=='Escape')end();if(e.key=='ArrowLeft')show(i+1);if(e.key=='ArrowRight')show(i-1);if(e.key==' '){e.preventDefault();$i('v3sg').click()}if(e.key=='+'||e.key=='=')$i('v3s+').click();if(e.key=='-')$i('v3s-').click()};addEventListener('keydown',kd);
 const spT=()=>{$i('v3sv').textContent=SPN[spi];$i('v3s-').disabled=spi==0;$i('v3s+').disabled=spi==SPD.length-1};spT();
 const spSet=d=>{spi=Math.max(0,Math.min(SPD.length-1,spi+d));try{localStorage.setItem('ido_v3sp',String(spi))}catch(_){}spT();if(play)show(i)};$i('v3s-').onclick=()=>spSet(-1);$i('v3s+').onclick=()=>spSet(1);
 $i('v3sj').onchange=e=>show(+e.target.value);
 const pause=()=>{if(!play)return;play=false;clearTimeout(timer);$i('v3sg').textContent='▶ تشغيل'};
 const pn=document.createElement('div');pn.className='v3s-pn';pn.hidden=true;o.appendChild(pn);
 const kS=G('kSt');const toP=pc=>{const j=SC.findIndex(z=>z.k=='focus'&&z.b.p.pc==pc);if(j>=0){pn.hidden=true;show(j)}};
 const pRow=(p,sub)=>`<div class="v3s-r"><i style="background:${colOf(p)}"></i><div><b>${E(p.n)}</b><small>${E(sub||(secN(p.sec)+' · '+(p.ps!=null?p.ps+'٪ من المخطط':'')))}</small></div><span><button type="button" data-go="${E(p.pc)}">عرض</button><a href="myprojects.html?pc=${encodeURIComponent(p.pc)}" target="_blank" rel="noopener">↗</a></span></div>`;
 const none=t=>`<div class="v3s-e">${t}</div>`;
 const det=a=>{const p=a.p,d=a.d;let h='',b='';
  if(a.t=='proj'){h=p.n;b=`<div class="v3s-k">${pFacts(p,pendOf(p.pc)).map(f=>`<span>${E(f[0])}</span>`).join('')}</div><p>${E(pStory(p,pendOf(p.pc)))}</p>`+pRow(p)}
  else if(a.t=='late'){const L=(p.tk||[]).filter(t=>t.late>0).sort((x,y)=>y.late-x.late);h='المهام المتأخرة · '+p.n;b=`<div class="v3s-e" style="text-align:start">${p.tasks||0} مهمة في الخطة، منها ${p.late||0} متأخرة.</div>`+(L.length?L.map(t=>`<div class="v3s-r"><i style="background:${t.late>=60?COL.bad:COL.warn}"></i><div><b>${E(t.name)}</b><small>متأخرة ${nD(t.late)} · ${E(t.owner?t.owner.name:(t.owner_txt||'بلا مكلّف'))} · الإنجاز ${Math.round(+t.pc||0)}٪${t.late>=60?' · المقترح إعادة جدولة':''}</small></div></div>`).join(''):none('لا مهام متأخرة.'))}
  else if(a.t=='kpi'){const L=p.kp||[];h='المؤشرات · '+p.n;b=L.length?L.map(k=>{const st=kS?kS(k):null,last=(k.v||[])[0];return `<div class="v3s-r"><i style="background:${st=='bad'?COL.bad:st=='warn'?COL.warn:st?COL.ok:COL.info}"></i><div><b>${E(k.name)}</b><small>${st=='bad'?'خارج المستهدف':st=='warn'?'قريب من الحد':st?'ضمن المستهدف':'لا قراءة كافية'}${last&&last.x!=null?' · آخر قراءة '+E(last.x):''}${(k.pend||[]).length?' · '+k.pend.length+' بانتظار الاعتماد':''}</small></div></div>`}).join(''):none('لا مؤشرات.')}
  else if(a.t=='risk'){const L=(p.rk||[]).slice().sort((x,y)=>y.s-x.s);h='المخاطر · '+p.n;b=L.length?L.map(r=>`<div class="v3s-r"><i style="background:${r.s>=15?COL.bad:r.s>=5?COL.warn:COL.ok}"></i><div><b>${E(r.t)}</b><small>الدرجة ${r.s}${r.s>=15?' (تقييم عالٍ)':''}${r.own?' · '+E(r.own):''}${r.resp?'':' · بلا إجراء استجابة'}</small></div></div>`).join(''):none('لا مخاطر مفتوحة.')}
  else if(a.t=='dec'){const L=pendOf(p.pc);h='بانتظار المكتب · '+p.n;b=L.length?L.map(x=>`<div class="v3s-r"><i style="background:#c99a2e"></i><div><b>${E(x.t||CATN(x.cat))}</b><small>${E(CATN(x.cat))}${x.f?' · '+E(x.f):''}</small></div></div>`).join(''):none('لا شيء.')}
  else if(a.t=='sp'){const L=d.L.filter(q=>!a.st||q.status==a.st).sort((x,y)=>(x.ps??0)-(y.ps??0));h=d.s.n+(a.st?' · '+SNM[a.st]:' · المشاريع');b=L.length?L.map(q=>pRow(q)).join(''):none('لا مشاريع.')}
  else if(a.t=='sl'){const L=d.L.filter(q=>q.late>0).sort((x,y)=>y.late-x.late);h=d.s.n+' · المهام المتأخرة';b=L.map(q=>pRow(q,`${nT(q.late)} متأخرة${q.oldest?' · أقدمها '+nD(q.oldest):''}`)).join('')||none('لا مهام متأخرة.')}
  else if(a.t=='sr'){const L=d.L.filter(q=>q.rHigh>0);h=d.s.n+' · المخاطر ذات التقييم العالي';b=L.map(q=>pRow(q,(q.rk||[]).filter(r=>r.s>=15).map(r=>r.t).join('، '))).join('')||none('لا مخاطر عالية.')}
  else if(a.t=='sd'){const L=d.L.filter(q=>pendOf(q.pc).length);h=d.s.n+' · بانتظار المكتب';b=L.map(q=>pRow(q,pendOf(q.pc).map(x=>CATN(x.cat)).join('، '))).join('')||none('لا شيء.')}
  else if(a.t=='ad'){const L=pendAll.filter(x=>CATN(x.a.cat)==a.k);h='بانتظار المكتب · '+a.k;b=L.map(x=>pRow(x.p,x.a.t||'')).join('')||none('لا شيء.')}
  else if(a.t=='gp'){const L=a.g.L.slice().sort((x,y)=>(x.ps??0)-(y.ps??0));h=a.g.n;b=`<div class="v3s-e" style="text-align:start">الأداء ${a.g.v??'—'}٪ من المخطط · ${a.g.share}٪ من أوزان المحفظة</div>`+(L.map(q=>pRow(q)).join('')||none('لا مشاريع.'))}
  pause();pn.innerHTML=`<div class="v3s-ph"><b>${E(h)}</b><button type="button" data-pnx="1">✕ إغلاق</button></div><div class="v3s-pb">${b}</div><div class="v3s-pf">العرض متوقف. اضغط «▶ تشغيل» للمتابعة.</div>`;pn.hidden=false};
 o.addEventListener('click',e=>{const t=e.target;if(!t.closest)return;const ci=t.closest('[data-ci]');if(ci){const a=(CF[+ci.dataset.ci]||[])[2];if(a)det(a);return}
  if(t.closest('[data-pnx]')){pn.hidden=true;return}const go=t.closest('[data-go]');if(go){toP(go.dataset.go);return}});
 cv.addEventListener('click',e=>{const r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;const s=SC[i];let hit=null;
  if(s.k=='globe'&&M)M.G.forEach(g=>g.lights.forEach(l=>{if(l.bb&&x>=l.bb[0]&&x<=l.bb[2]&&y>=l.bb[1]&&y<=l.bb[3])hit=l}));
  else items.forEach(b=>{if(b.bb&&x>=b.bb[0]-6&&x<=b.bb[2]+6&&y>=b.bb[1]-6&&y<=b.bb[3]+6&&(!hit||(b.dz??0)<(hit.dz??0)))hit=b});
  if(hit)det({t:'proj',p:hit.p});else pause()});
 $i('v3sx').onclick=end;$i('v3sn').onclick=()=>show(i+1);$i('v3sp').onclick=()=>show(i-1);$i('v3sg').onclick=()=>{play=!play;$i('v3sg').textContent=play?'⏸ إيقاف':'▶ تشغيل';if(play)show(i);else clearTimeout(timer)};
 show(0)}
function stageHTML(){css();const P=pjs(),L=layout();const mins=Math.max(1,Math.round((7+9+L.D.length*10+P.length*11+30)/60));return {svg:`<div class="v3-card" style="max-width:760px;margin:0 auto;text-align:center;padding:22px"><div style="font-size:44px">🎬</div><h3 style="margin:6px 0">العرض التفاعلي</h3><p class="v3-help" style="font-size:14px">عرض شامل يمر على كل القطاعات وكل المشاريع الجارية بالتفصيل، ويتنقل وحده مع تعليق عربي لكل مشهد:</p>
 <ol style="text-align:start;display:inline-block;margin:6px auto 14px;line-height:2;color:#3b4148"><li>الأداء العام للمركز واتجاهه</li><li>نظرة عامة على خارطة الإنجاز</li><li>كل قطاع (${L.D.length}): أداؤه وحالات مشاريعه ومهامه المتأخرة ومخاطره</li><li>كل مشروع (${P.length}): الإنجاز مقابل المخطط، والمهام والمؤشرات والمخاطر، والقرارات المعلّقة، والانتهاء المتوقع</li><li>القرارات المعلّقة عند المكتب</li><li>ملامح الإنجاز والأهداف المؤسسية</li><li>الخلاصة</li></ol>
 <p class="v3-help">المدة التقريبية: ${mins} ${mins==1?'دقيقة':mins==2?'دقيقتان':mins<=10?'دقائق':'دقيقة'} · يمكن الإيقاف والتنقل أو القفز إلى أي قطاع أو مشروع من القائمة أعلى الشاشة.</p>
 <div><button type="button" id="v3go" style="font:inherit;font-size:16px;font-weight:800;border:0;background:#14324a;color:#fff;border-radius:99px;padding:12px 26px;cursor:pointer">▶ ابدأ العرض</button></div><p class="v3-help" style="margin-top:10px">ملء الشاشة · المسافة أو الأسهم للتنقل · Esc للإنهاء</p></div>`,ins:''}}
function stageStart(){const b=$i('v3go');if(b)b.onclick=()=>stage()}

window.V3={stop,city:cityHTML,terrain:terrainHTML,globe:globeHTML,stage:stageHTML,start:k=>{if(k=='city')cityStart();else if(k=='terrain')terrainStart();else if(k=='globe')globeStart();else if(k=='stage')stageStart()},play:stage};
})();
