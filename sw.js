// IDO service worker v4 — pages come from the network first (new versions show on the first open),
// falling back to the saved copy when the network is slow or offline.
var HC = 'ido-html-v4', AC = 'ido-asset-v3' /* r2 */, KEEP = [HC, AC];
var PRE = ['index.html', 'tasks.html', 'inbox.html', 'myprojects.html', 'chat.html', 'charter.html', 'plan.html', 'cr.html', 'closure.html', 'account.html'];
var OFF = '<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>غير متصل</title></head><body style="font-family:system-ui,sans-serif;background:#f5f3ee;color:#23272b;display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center;margin:0"><div style="padding:24px"><div style="font-size:48px">📡</div><h2>لا يوجد اتصال بالإنترنت</h2><p>تأكد من الاتصال ثم أعد المحاولة.</p><button onclick="location.reload()" style="background:#0a6b3d;color:#fff;border:0;border-radius:10px;padding:12px 24px;font-size:16px">إعادة المحاولة</button></div></body></html>';

function pageKey(u) {
  var url = new URL(u);
  var p = url.pathname;
  if (p.endsWith('/')) p += 'index.html';
  return url.origin + p;
}
function fresh(url) { return fetch(url, { cache: 'no-store', credentials: 'same-origin', redirect: 'follow' }); }

self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return KEEP.indexOf(k) < 0; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }).then(function () {
    // warm the most used pages in the background so the first visit is instant too
    var base = self.registration.scope;
    return caches.open(HC).then(function (c) {
      return Promise.all(PRE.map(function (p) {
        var k = pageKey(base + p);
        return c.match(k).then(function (hit) { if (hit) return; return fresh(base + p).then(function (r) { if (r.ok && r.type === 'basic') return c.put(k, r); }).catch(function () {}); });
      }));
    });
  }));
});

// a page that finished loading asks whether a newer copy was downloaded meanwhile
self.addEventListener('message', function (e) {
  var d = e.data || {};
  if (d.t !== 'ido-q' || !d.page || !e.source) return;
  var key = pageKey(d.page);
  e.waitUntil(caches.open(HC).then(function (c) { return c.match(key + '?__upd'); }).then(function (m) { if (m) e.source.postMessage({ t: 'ido-new', page: key }); }));
});
// after a deploy, refresh the other saved pages too, so the next page opened is already the new version
var lastAll = 0;
function refreshAll(c, skip) {
  if (Date.now() - lastAll < 60000) return; lastAll = Date.now();
  c.keys().then(function (ks) {
    ks.forEach(function (rq) {
      var u = rq.url; if (u === skip || u.indexOf('?__upd') > 0) return;
      fresh(u).then(function (r) { if (r.ok && r.type === 'basic' && !r.redirected) c.put(u, r); }).catch(function () {});
    });
  });
}
function tell(msg) { self.clients.matchAll({ type: 'window' }).then(function (cs) { cs.forEach(function (c) { c.postMessage(msg); }); }); }

self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET') return;
  var url = new URL(r.url);

  // 1) page navigations (same origin): network first, so a new version shows on the first open;
  //    if the network is slow (over 2.5 s) or offline, the saved copy opens instead and is refreshed in the background
  if (r.mode === 'navigate' && url.origin === self.location.origin) {
    var key = pageKey(r.url);
    e.respondWith(caches.open(HC).then(function (c) {
      var net = fresh(r.url).then(function (res) {
        if (res && res.ok && res.type === 'basic' && !res.redirected) { var copy = res.clone(); c.put(key, copy).then(function () { refreshAll(c, key); }); }
        return res;
      });
      var slow = new Promise(function (ok) { setTimeout(function () { ok(null); }, 2500); });
      return Promise.race([net.catch(function () { return null; }), slow]).then(function (res) {
        if (res) return res;
        return c.match(key).then(function (hit) {
          if (hit) { e.waitUntil(net.catch(function () {})); return hit; }
          return net.catch(function () { return new Response(OFF, { headers: { 'Content-Type': 'text/html;charset=utf-8' } }); });
        });
      });
    }));
    return;
  }

  // 2) versioned static files (same-origin .js/.css with ?v=, CDN libraries with a pinned version, fonts): cache-first
  var sameStatic = url.origin === self.location.origin && /\.(js|css)$/.test(url.pathname) && /[?&]v=/.test(url.search) && !/\/sw\.js$/.test(url.pathname);
  var cdn = (url.hostname === 'cdn.jsdelivr.net' && /@\d+\.\d+\.\d+/.test(url.pathname)) || (url.hostname === 'cdnjs.cloudflare.com' && /\/\d+\.\d+\.\d+\//.test(url.pathname)) || url.hostname === 'fonts.gstatic.com';
  if (sameStatic || cdn) {
    e.respondWith(caches.open(AC).then(function (c) {
      return c.match(r).then(function (hit) {
        if (hit) return hit;
        return fetch(r).then(function (res) { if (res && (res.ok || res.type === 'opaque')) c.put(r, res.clone()); return res; });
      });
    }));
    return;
  }

  // 3) Google Fonts stylesheet: stale-while-revalidate
  if (url.hostname === 'fonts.googleapis.com') {
    e.respondWith(caches.open(AC).then(function (c) {
      return c.match(r).then(function (hit) {
        var net = fetch(r).then(function (res) { if (res && (res.ok || res.type === 'opaque')) c.put(r, res.clone()); return res; });
        if (hit) { e.waitUntil(net.catch(function () {})); return hit; }
        return net;
      });
    }));
  }
  // everything else (Supabase API, uploads, …) goes straight to the network, untouched
});

// إشعارات الهاتف (Push)
self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data ? e.data.text() : '' }; }
  var base = self.registration.scope;
  var u = String(d.url || 'inbox.html'); if (!/^https?:/.test(u)) u = base + u.replace(/^\.?\//, '');
  e.waitUntil(self.registration.showNotification(d.title || 'منصة مكتب التطوير المؤسسي', { body: d.body || '', data: { url: u }, tag: d.tag || undefined, dir: 'rtl', lang: 'ar' }));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var u = (e.notification.data && e.notification.data.url) || self.registration.scope;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (cs) {
    for (var i = 0; i < cs.length; i++) { var c = cs[i]; if (c.url.indexOf(self.registration.scope) === 0 && 'focus' in c) { return c.focus().then(function (w) { return w && w.navigate ? w.navigate(u) : null; }).catch(function () { return self.clients.openWindow(u); }); } }
    return self.clients.openWindow(u);
  }));
});
