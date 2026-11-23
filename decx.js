/* قرارات المكتب: مكان واحد لمراجعة الاحتساب، وطلبات تعديل القيم المقفلة، وتعديلات المواثيق المعتمدة — window.DEC
   يُعرض كما هو في لوحة التحكم وغرفة التحكم والإشعارات، دون الانتقال لصفحة أخرى */
(function(){
var S={k:null};
function css(){if(document.getElementById('deccss'))return;var s=document.createElement('style');s.id='deccss';s.textContent=
 '.dech{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 10px}.dech button{font:inherit;font-size:14px;font-weight:800;border:1px solid #dcd6c8;background:#fff;border-radius:99px;padding:8px 14px;cursor:pointer;color:#23272b;display:inline-flex;align-items:center;gap:6px}.dech button.on{background:#14324a;border-color:#14324a;color:#fff}.dech i{font-style:normal;background:#d1101d;color:#fff;border-radius:99px;min-width:20px;padding:0 6px;font-size:12px;line-height:20px;text-align:center}.dech button.on i{background:#fff;color:#14324a}'+
 '.decov{position:fixed;inset:0;z-index:2147482000;background:rgba(20,30,40,.5);display:flex;align-items:center;justify-content:center;padding:12px}.decov .bx{background:#f7f5f0;border-radius:16px;width:min(1040px,100%);height:92vh;height:92dvh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.3)}'+
 '.decov .dechd{display:flex;align-items:center;gap:8px;padding:12px 16px;background:#fff;border-bottom:1px solid #e4dfd4}.decov .dechd b{flex:1;font-size:16px}.decov .dechd button{font:inherit;font-weight:700;border:1px solid #d6d0c2;background:#fff;border-radius:99px;padding:5px 14px;cursor:pointer}'+
 '.decov .decbd{flex:1;overflow:auto;padding:12px 14px calc(16px + env(safe-area-inset-bottom));box-sizing:border-box}'+
 '@media(max-width:640px){.decov{padding:0}.decov .bx{border-radius:0;height:100%;width:100%}.decov .dechd{padding-top:calc(10px + env(safe-area-inset-top))}}';document.head.appendChild(s)}
var N={rev:0,lock:0};
async function counts(){try{if(window.REV){var c=await REV.counts(true);N.rev=c&&c.office?+c.pend||0:0}}catch(_){}try{if(window.LOCK){var l=await LOCK.counts();N.lock=l?(+l.pend||0):0}}catch(_){}return N}
function head(){return '<div class="dech" role="tablist">'+[['rev','⚖️ مراجعة الاحتساب',N.rev],['lock','🔒 القيم المقفلة وتعديلات المواثيق',N.lock]].map(function(t){return '<button type="button" data-dk="'+t[0]+'" class="'+(S.k==t[0]?'on':'')+'">'+t[1]+(t[2]?'<i>'+t[2]+'</i>':'')+'</button>'}).join('')+'</div>'}
async function mount(el,k){css();S.el=el;await counts();S.k=k||S.k||(N.rev||!N.lock?'rev':'lock');paint()}
function paint(){var el=S.el;if(!el)return;el.innerHTML=head()+'<div class="decb"></div>';var b=el.querySelector('.decb');if(S.k=='lock'){if(window.LOCK)LOCK.queue(b)}else{if(window.REV)REV.queue(b)}}
document.addEventListener('click',function(ev){var t=ev.target;if(!t||!t.closest||!S.el)return;var b=t.closest('[data-dk]');if(b&&S.el.contains(b)){S.k=b.dataset.dk;paint()}});
/* نافذة داخل الصفحة الحالية */
function open(k){css();var o=document.getElementById('decov');if(o)o.remove();o=document.createElement('div');o.id='decov';o.className='decov';o.dir='rtl';
 o.innerHTML='<div class="bx" role="dialog" aria-modal="true"><div class="dechd"><b>⚖️ قرارات المكتب</b><button type="button" class="x">✕ إغلاق</button></div><div class="decbd"></div></div>';o.addEventListener('click',function(ev){if(ev.target===o)close()});document.body.appendChild(o);
 o.querySelector('.x').onclick=close;document.addEventListener('keydown',esc,true);try{history.pushState({decov:1},'')}catch(_){}
 mount(o.querySelector('.decbd'),k)}
function esc(e){if(e.key=='Escape')close()}
function close(){var o=document.getElementById('decov');if(o){o.remove();document.removeEventListener('keydown',esc,true);try{if(history.state&&history.state.decov)history.back()}catch(_){}}}
window.addEventListener('popstate',function(){var o=document.getElementById('decov');if(o){o.remove();document.removeEventListener('keydown',esc,true)}});
window.DEC={mount:mount,open:open,close:close,counts:counts};
})();
