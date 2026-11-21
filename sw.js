const C='arasta-v3';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET')return;
 const stat=/\.(glb|png|mp3|ogg|wav)$/.test(u.pathname)||/cdnjs|jsdelivr/.test(u.host);
 if(stat){e.respondWith(caches.open(C).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{if(n.ok||n.type==='opaque')c.put(e.request,n.clone());return n}))));return}
 if(u.origin===location.origin&&/(\/|\.html|\.js|\.css|\.json)$/.test(u.pathname)){e.respondWith(fetch(e.request).then(n=>{if(n.ok){const cl=n.clone();caches.open(C).then(c=>c.put(e.request,cl))}return n}).catch(()=>caches.match(e.request)))}});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:'window'}).then(cs=>{if(cs.length)return cs[0].focus();return self.clients.openWindow('./')}))});
self.addEventListener('push',e=>{let d={title:'Arasta',body:''};try{d=e.data.json()}catch(_){try{d.body=e.data.text()}catch(__){}}e.waitUntil(self.registration.showNotification(d.title||'Arasta',{body:d.body||'',icon:'icon-512.png',badge:'icon-512.png',tag:'arasta-'+(d.title||'')}))});
