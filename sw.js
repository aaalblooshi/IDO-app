// IDO service worker: network-first, offline fallback only (no page caching, so updates always show)
self.addEventListener('install',function(e){self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim())});
var OFF='<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>غير متصل</title></head><body style="font-family:system-ui,sans-serif;background:#f5f3ee;color:#23272b;display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center;margin:0"><div style="padding:24px"><div style="font-size:48px">📡</div><h2>لا يوجد اتصال بالإنترنت</h2><p>تأكد من الاتصال ثم أعد المحاولة.</p><button onclick="location.reload()" style="background:#0a6b3d;color:#fff;border:0;border-radius:10px;padding:12px 24px;font-size:16px">إعادة المحاولة</button></div></body></html>';
self.addEventListener('fetch',function(e){
 var r=e.request;
 if(r.mode==='navigate'){e.respondWith(fetch(r).catch(function(){return new Response(OFF,{headers:{'Content-Type':'text/html;charset=utf-8'}})}))}
});
