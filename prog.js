/* Plan progress, one rule for every page: a parent's progress is the weighted average of its children.
   Weights: the plan's custom weights (wt) among siblings when wmode is 'cu', equal otherwise;
   a group whose weights are all zero or missing falls back to equal weights.
   Same rule as the plan editor and the portfolio. now = day number (Date.parse('YYYY-MM-DD')/864e5). */
(function(){
'use strict';
const dn=s=>{if(!s)return null;const t=Date.parse(String(s).slice(0,10));return isFinite(t)?Math.floor(t/864e5):null};
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const R6=v=>Math.round(v*1e6)/1e6; /* 1/3+1/3+1/3 must give exactly 100, not 99.999… */
function weights(k,wmode){let ws=k.map(c=>wmode=='cu'?Math.max(0,+c.wt||0):1);if(!ws.some(v=>v>0))ws=k.map(()=>1);const W=ws.reduce((p,q)=>p+q,0)||1;return ws.map(v=>v/W)}
function roll(tasks,wmode,now){tasks=tasks||[];if(now==null){const d=new Date();now=Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5)}
 const by={},kids={};tasks.forEach(x=>{if(x&&x.id)by[x.id]=x});tasks.forEach(x=>{if(!x||!x.id)return;const p=x.p&&by[x.p]&&x.p!==x.id?x.p:'';(kids[p]=kids[p]||[]).push(x)});
 const t={},seen=new Set();
 const rec=x=>{if(seen.has(x.id))return t[x.id]||{a:0,ex:0,leaf:1};seen.add(x.id);const k=kids[x.id]||[];
  if(!k.length){const s=dn(x.s),e=dn(x.e),du=s!=null&&e!=null?Math.max(1,e-s+1):1;
   const ex=x.ms?(e!=null&&now>=e?100:0):(s==null?0:cl((now-s+1)/du*100,0,100));return t[x.id]={a:cl(+x.pc||0,0,100),ex,leaf:1}}
  const rs=k.map(rec),w=weights(k,wmode);let a=0,ex=0;rs.forEach((r,i)=>{a+=r.a*w[i];ex+=r.ex*w[i]});return t[x.id]={a:R6(a),ex:R6(ex),leaf:0}};
 const top=kids['']||[],rs=top.map(rec),w=weights(top,wmode);let a=0,ex=0;rs.forEach((r,i)=>{a+=r.a*w[i];ex+=r.ex*w[i]});
 return {t,a:R6(a),ex:R6(ex)}}
window.IDOPROG={roll,weights};
})();
