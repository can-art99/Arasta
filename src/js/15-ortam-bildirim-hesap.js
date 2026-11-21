/* ---------- ortam sesleri ---------- */
function vox(pts,type,vol,delay,lp){const a=AC;if(!a||!G.snd||document.hidden)return;const t=a.currentTime+(delay||0),o=a.createOscillator(),g=a.createGain(),d=pts[pts.length-1][0];o.type=type||'sine';o.frequency.setValueAtTime(pts[0][1],t);pts.slice(1).forEach(([q,f])=>o.frequency.linearRampToValueAtTime(f,t+q));g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+Math.min(0.06,d*0.25));g.gain.setValueAtTime(vol,t+d*0.7);g.gain.exponentialRampToValueAtTime(0.0001,t+d);let n=o;if(lp){const f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=lp;o.connect(f);n=f}n.connect(g);g.connect(BUS('a'));o.start(t);o.stop(t+d+0.05)}
const vib8=(f0,f1,d,r,dep)=>{const P=[];for(let i=0;i<=24;i++){const q=i/24*d;P.push([q,f0+(f1-f0)*i/24+Math.sin(q*r*Math.PI*2)*dep])}return P};
const ANS={
 moo:()=>{vox([[0,135],[0.18,150],[0.9,118],[1.25,100]],'sawtooth',0.03,0,520);vox([[0,270],[0.18,300],[0.9,236],[1.25,200]],'triangle',0.008,0,900)},
 rooster:()=>vox([[0,480],[0.12,820],[0.3,860],[0.45,980],[0.8,900],[1.05,560]],'sawtooth',0.014,0,2000),
 hen:()=>{const n=3+Math.floor(Math.random()*3);for(let i=0;i<n;i++)vox([[0,640],[0.04,900],[0.09,600]],'square',0.006,i*0.14+Math.random()*0.04,1600)},
 horse:()=>vox(vib8(1150,560,1.1,11,90),'sawtooth',0.012,0,2400),
 sheep:()=>vox(vib8(390,340,0.75,7,28),'sawtooth',0.014,0,1300),
 bird:()=>{const b=2400+Math.random()*1600,n=2+Math.floor(Math.random()*4),k=Math.random();for(let i=0;i<n;i++){const d=i*(0.11+k*0.08);if(k<0.4)vox([[0,b],[0.05,b*1.35],[0.09,b*1.1]],'sine',0.011,d);else if(k<0.75)vox([[0,b*1.3],[0.07,b*0.85]],'sine',0.01,d);else vox([[0,b],[0.03,b*1.2],[0.06,b],[0.09,b*1.25]],'sine',0.009,d)}},
 hammer:()=>{tone(1900+Math.random()*200,0.14,'triangle',0.02);tone(3100,0.08,'sine',0.009);noise(0.05,0.025,900,1)},
 spin:()=>{noise(0.5,0.008,380,2.5);for(let i=0;i<4;i++)tone(260,0.025,'square',0.004,null,i*0.12)},
 boil:()=>{const n=2+Math.floor(Math.random()*4);for(let i=0;i<n;i++){const f=180+Math.random()*320;tone(f,0.07,'sine',0.018,f*1.8,i*0.09+Math.random()*0.05)}},
 slosh:()=>noise(0.45,0.012,520,1,0,280),
 press:()=>vox([[0,150],[0.35,118]],'sawtooth',0.008,0,500),
 saw:()=>{noise(0.22,0.018,2400,1.5);noise(0.22,0.016,2000,1.5,0.28)},
 wheel:()=>noise(0.9,0.008,240,3),
 loom:()=>{noise(0.05,0.03,1300,2);noise(0.05,0.025,1100,2,0.3)}};
function voice(d,f0,vol,delay){const a=AC;if(!a||!G.snd||document.hidden)return;const t=a.currentTime+(delay||0),o=a.createOscillator(),f1=a.createBiquadFilter(),f2=a.createBiquadFilter(),g1=a.createGain(),g2=a.createGain(),g=a.createGain();o.type='sawtooth';f1.type=f2.type='bandpass';f1.Q.value=6;f2.Q.value=8;g2.gain.value=0.5;
 const VW=[[730,1090],[270,2290],[530,1840],[570,840],[440,1020],[300,870],[660,1700]];let q=0;o.frequency.setValueAtTime(f0,t);g.gain.setValueAtTime(0.0001,t);while(q<d){const sy=0.12+Math.random()*0.16,v=pick(VW),pf=f0*(0.9+Math.random()*0.25);o.frequency.linearRampToValueAtTime(pf,t+q+sy*0.5);f1.frequency.setValueAtTime(v[0],t+q);f2.frequency.setValueAtTime(v[1],t+q);g.gain.linearRampToValueAtTime(vol,t+q+sy*0.35);g.gain.linearRampToValueAtTime(vol*0.15,t+q+sy*0.95);q+=sy+(Math.random()<0.15?0.18:0)}
 g.gain.linearRampToValueAtTime(0.0001,t+q+0.1);o.connect(f1);o.connect(f2);f1.connect(g1);f2.connect(g2);g1.connect(g);g2.connect(g);g.connect(BUS('a'));o.start(t);o.stop(t+q+0.2)}
ANS.crowd=()=>{const n=2+Math.floor(Math.random()*2);for(let i=0;i<n;i++){const m=Math.random()<0.55;voice(0.9+Math.random()*1.6,m?95+Math.random()*45:175+Math.random()*60,0.05,i*0.5+Math.random()*0.6)}};
ANS.call=()=>voice(1.2+Math.random()*0.6,130+Math.random()*30,0.07,0);
{const FN={moo:'inek',rooster:'horoz',hen:'tavuk',horse:'at',sheep:'koyun',hammer:'ors_cekic',spin:'cikrik',boil:'kaynama',slosh:'fici',press:'pres',saw:'testere_tezgah',wheel:'comlek_carki',loom:'dokuma',call:'satici'},VL={crowd:0.25,call:0.2,moo:0.3,horse:0.3,rooster:0.25};Object.keys(FN).forEach(k=>{const f=ANS[k];ANS[k]=()=>{const n=FN[k],c=Object.keys(SB).filter(x=>x===n||x.startsWith(n+'_'));if(c.length&&AC){ambPlay(pick(c),VL[k]||0.35);return}if(!SB.kus||k!=='bird')f()}})}
const STF={ors:'ors_cekic',cikrik:'cikrik',kazan:'kaynama',fici:'fici',pres:'pres',testere:'testere_tezgah',cark:'comlek_carki',dokuma:'dokuma'};
const STSND={ors:['hammer',1.4],cikrik:['spin',0.9],kazan:['boil',0.7],fici:['slosh',2.6],pres:['press',2.8],testere:['saw',1.8],cark:['wheel',1.1],dokuma:['loom',1.5]};
const AMT={};function ambTick(dt){AMBF=true;try{ambTick0(dt)}finally{AMBF=false}}
function ambTick0(dt){if(!AC||!G.snd||document.hidden||G.phase==='craft'||G.phase==='result'||switching)return;
 if(view==='islik'){ST.forEach(s=>{const d=STSND[s.id];if(!d||!s.jobs||!s.jobs.length||s.ready)return;AMT[s.id]=(AMT[s.id]||Math.random()*d[1])-dt;if(AMT[s.id]<=0){const fb=SB[STF[s.id]];AMT[s.id]=Math.max(d[1],fb?fb.duration+0.4:0)*(0.75+Math.random()*0.5);ANS[d[0]]()}})}
 else if(view==='pazar'){if(SB.kalabalik)return;AMT.p=(AMT.p==null?1:AMT.p)-dt;if(AMT.p>0)return;AMT.p=1.6+Math.random()*2.2;ANS[Math.random()<0.85?'crowd':'call']()}
 else if(view==='bahce'){const z=Math.round((camCur.l.x+ZM.px-OB)/11);AMT.b=(AMT.b==null?2:AMT.b)-dt;if(AMT.b>0)return;
  if(z<0){AMT.b=4+Math.random()*6;const L=['moo','moo','hen','hen','rooster','horse','sheep'];if(gOpen('Paşa')&&SB.kopek)L.push('dog');const k=pick(L);if(k==='dog')ambPlay('kopek',0.3);else ANS[k]()}else{AMT.b=(z>0?1.5:4)+Math.random()*4;if(!SB.kus)ANS.bird()}}
 else if(view==='home'&&SB.kedi){AMT.k=(AMT.k==null?20+Math.random()*30:AMT.k)-dt;if(AMT.k<=0){AMT.k=45+Math.random()*60;ambPlay('kedi',0.3)}}}
function vib(p){if(G.vib===false||!navigator.vibrate)return;try{navigator.vibrate(p)}catch(e){}}

/* ---------- bildirim, servis çalışanı, sen yokken ---------- */
let SWR=null;try{if('serviceWorker' in navigator&&location.protocol==='https:'&&!/claude/.test(location.host))navigator.serviceWorker.register('sw.js').then(r=>SWR=r).catch(()=>{})}catch(e){}
function notify(t,b){try{if(pdev()||!G.notif||!document.hidden||typeof Notification==='undefined'||Notification.permission!=='granted')return;if(SWR&&SWR.showNotification)SWR.showNotification(t,{body:b,icon:'icon-512.png',tag:'arasta-'+t});else new Notification(t,{body:b,icon:'icon-512.png'})}catch(e){}}
function notifToggle(){if(G.notif){G.notif=false;save();renderMenu();return}if(typeof Notification==='undefined'){toast('Bu tarayıcı bildirim desteklemiyor.<br>iPhone\'da oyunu ana ekrana ekleyip oradan aç.',2600);return}Notification.requestPermission().then(async p=>{G.notif=p==='granted';if(!G.notif){toast('Bildirim izni verilmedi',1600);save();renderMenu();return}const ok=await pushSub();toast(ok?'Bildirimler açık<br><small>Oyun kapalıyken de gelir</small>':'Bildirim açık (yalnızca oyun açıkken)',2200);save();renderMenu()})}
function awaySummary(){const A=G.away;if(!A||A.secs<120)return;const L=[];if(A.jobs)L.push(`Atölyede <b>${A.jobs}</b> üretim tamamlandı${G.cirak?' (çırak topladı)':''}`);if(A.plots)L.push(`<b>${A.plots}</b> tarla hasada hazır${G.trak?' (çiftçi hallediyor)':''}`);if(A.kervan)L.push(`Kervan döndü: <b>+${A.kervan}</b> altın`);if(A.coll)L.push(`Bahçede <b>${A.coll}</b> malzeme yeniden çıktı`);if(A.deliv)L.push(`Tedarikçi siparişin geldi`);
 if(!L.length)return;openSheet('away',`<h3>Sen yokken (${fmtT(A.secs)})</h3>`+L.map(l=>`<div class="row"><div class="n">${l}</div></div>`).join('')+closeBtn);wire();G.away=null}

const VAPID='BIAsbbWc0305EXp_j5vBzKjYVUzbh5Pgak7tYDn6tDrKtG1o_Qa8r4aR0Ju1_S0gAvwPt2ZaJ1Du_1I4txvSmxA';
const pdev=()=>{try{return localStorage.getItem('arasta-pdev')}catch(e){return null}};
function b64u(s){const p='='.repeat((4-s.length%4)%4),b=atob((s+p).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from([...b].map(c=>c.charCodeAt(0)))}
let pushErr='';async function pushSub(){try{if(!('serviceWorker' in navigator)||!('PushManager' in window)){pushErr='Bu tarayıcı push desteklemiyor (ana ekrandan açtığından emin ol)';return false}if(!SWR){try{SWR=await navigator.serviceWorker.register('sw.js')}catch(e){pushErr='Servis çalışanı kurulamadı';return false}}const reg=await navigator.serviceWorker.ready;let sub=await reg.pushManager.getSubscription();if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64u(VAPID)});const id=await rpc('arasta_push_reg',{p_sub:sub.toJSON(),p_dev:pdev()});if(id){localStorage.setItem('arasta-pdev',id);pshH='';pushErr='';pushSync(true);return true}pushErr='Sunucu kaydı başarısız'}catch(e){pushErr=(e&&e.message)||String(e)}return false}
function pushItems(){const L=[],now=NOW();ST.forEach(s=>s.jobs.forEach(j=>{if(j.end>now)L.push({at:j.end,t:'Atölye',b:`${s.ad}: ${Object.keys(j.r.out).map(k=>MATS[k].ad).join(', ')} hazır`})}));
 PL.forEach(o=>{if(o.own&&o.seed&&o.w&&o.end>now&&!G.trak)L.push({at:o.end,t:'Bahçe',b:`${MATS[CROPS[o.seed].out].ad} hasada hazır`})});
 if(G.kervan&&G.kervan.trip&&G.kervan.trip.end>now)L.push({at:G.kervan.trip.end,t:'Kervan döndü',b:`${G.kervan.trip.dest} seferinden +${G.kervan.trip.gold} altın`});
 (G.deliv||[]).forEach(d=>{if(d.end>now)L.push({at:d.end,t:'Tedarikçi',b:'Siparişin geldi'})});
 ((G.ext&&G.ext.act)||[]).forEach(a=>{const p=PRODS.find(x=>x.id===a.pid);if(a.due-3600>now)L.push({at:a.due-3600,t:'Özel sipariş',b:`${a.from}: ${p?p.ad:''} için son 1 saat`})});
 L.sort((a,b)=>a.at-b.at);const out=[];L.forEach(x=>{const pr=out[out.length-1];if(pr&&pr.t===x.t&&Math.abs(pr.at-x.at)<60){if(!/ ve daha/.test(pr.b))pr.b+=' ve daha fazlası';}else out.push(x)});return out.slice(0,30).map(x=>({at:Math.round(x.at),t:x.t,b:x.b}))}
let pshH='',pshT=0;function pushSync(force,ka){if(!force&&!ka&&Date.now()-pshT<10000)return;const d=pdev();if(!d||!G.notif)return;pshT=Date.now();const it=pushItems(),h=JSON.stringify(it);if(!force&&h===pshH)return;pshH=h;rpc('arasta_push_set',{p_dev:d,p_items:it},ka).then(n=>{if(n===-1){localStorage.removeItem('arasta-pdev');pushSub()}}).catch(()=>{pshH=''})}
document.addEventListener('visibilitychange',()=>{if(document.hidden)pushSync(false,true)});

/* ---------- kullanıcı adı + şifre ---------- */
const acctLoc=()=>{try{return JSON.parse(localStorage.getItem('arasta-acct')||'null')}catch(e){return null}};
const ACM={bad_name:'Kullanıcı adı 3-20 karakter olmalı (harf, rakam, _ .)',bad_pin:'Şifre 4-8 rakam olmalı',taken:'Bu kullanıcı adı alınmış ya da şifre yanlış',locked:'Çok fazla hatalı deneme, 10 dk sonra tekrar dene',bad_code:'Bulut kaydı henüz hazır değil, biraz sonra dene',nouser:'Böyle bir kullanıcı yok',pin:'Şifre yanlış'};
async function acctLink(u,p){if(!G.cloud){G.cloud=newCode();save()}await cloudPush(true);const r=await rpc('arasta_user_set',{p_uname:u,p_pin:p,p_code:G.cloud});if(r==='created'||r==='linked'){G.acct=u.toLowerCase().trim();try{localStorage.setItem('arasta-acct',JSON.stringify({u:G.acct,p}))}catch(e){}save();return 'ok'}return r}
function acctAuto(){const a=acctLoc();if(!a||G.acct===a.u||!G.cloud)return;rpc('arasta_user_set',{p_uname:a.u,p_pin:a.p,p_code:G.cloud}).then(r=>{if(r==='created'||r==='linked'){G.acct=a.u;save()}}).catch(()=>{})}
const ACS={list:null,busy:false,del:null,acDel:false,err:''};
function acctLoad(){const a=acctLoc();if(!a||ACS.busy)return;ACS.busy=true;rpc('arasta_user_get',{p_uname:a.u,p_pin:a.p}).then(r=>{ACS.busy=false;if(r&&r.shops){ACS.list=r.shops;ACS.err=''}else ACS.err=ACM[r&&r.err]||'Dükkân listesi alınamadı';if(menuTab==='kayit'&&modalMode==='menu')renderMenu()}).catch(()=>{ACS.busy=false;ACS.err='Bağlantı yok';if(menuTab==='kayit'&&modalMode==='menu')renderMenu()})}
function acctShops(){if(!acctLoc())return `<p style="font-size:12px;opacity:.75;margin:0 0 6px">Dükkân listesini görmek için bu cihazda yeniden giriş yap.</p>`;
 if(ACS.list===null){acctLoad();return `<p style="font-size:12px;opacity:.75">${ACS.err?esc(ACS.err):'Hesabındaki dükkânlar yükleniyor…'}</p>`}
 if(!ACS.list.length)return `<p style="font-size:12px;opacity:.75">Hesabında dükkân yok.</p>`;
 return ACS.list.map(x=>{const here=x.code===G.cloud;return `<div class="row" style="flex-wrap:wrap"><div class="n">${here?'● ':''}${esc(x.ad||'Dükkânım')}<small>${esc(x.day||1)}. gün · K${esc(x.tier||1)} · ${esc(x.gold||0)} altın${here?' · şu an açık':(['1','2','3'].some(n=>{const i=slotInfo(n);return i&&i.cloud===x.code})?' · bu cihazda da var':' · sadece bulutta')}</small></div>${ACS.del===x.code?`<div class="pk" style="flex-basis:100%;justify-content:flex-end;margin-top:6px"><button class="btn l" data-au="${x.code}" data-how="un">Hesaptan çıkar</button><button class="btn r" data-au="${x.code}" data-how="all">Tamamen sil</button><button class="btn l" data-aux="1">Vazgeç</button></div>`:`<button class="btn r" data-au="${x.code}">Sil</button>`}</div>`}).join('')+`<p style="font-size:11px;opacity:.65;margin:4px 0 0">Hesaptan çıkar: dükkân bulutta ve cihazında kalır, sadece hesabından ayrılır. Tamamen sil: buluttan da silinir.</p>`}
function acctDelBox(){if(!ACS.acDel)return `<div class="pk" style="margin-top:8px"><button class="btn l" id="acOut">Bu cihazda çıkış yap</button><button class="btn r" id="acDel">Hesabı sil</button></div>`;
 return `<div style="margin-top:8px;padding:10px;border-radius:12px;background:#f3d9cf"><b style="font-size:13px">Hesabı sil</b><p style="font-size:12px;margin:4px 0 6px">Onaylamak için şifreni yaz. Geri alınamaz.</p><input id="adP" type="password" inputmode="numeric" placeholder="Şifre" autocomplete="current-password" style="width:100%;box-sizing:border-box"><div class="pk" style="margin-top:6px;flex-wrap:wrap"><button class="btn r" data-ad="keep">Sadece hesabı sil</button><button class="btn r" data-ad="all">Hesabı ve tüm dükkânlarını sil</button><button class="btn l" id="adX">Vazgeç</button></div><p style="font-size:11px;opacity:.7;margin:4px 0 0">Sadece hesabı sil: dükkânların bu cihazda ve kayıt kodlarıyla bulutta kalır.</p></div>`}
function acctLocalWipe(code,removeLocal){['1','2','3'].forEach(n=>{try{const k=SKOF(n),d=JSON.parse(localStorage.getItem(k));if(!d||d.cloud!==code||n===SSLOT)return;if(removeLocal)localStorage.removeItem(k);else{d.cloud=null;localStorage.setItem(k,JSON.stringify(d))}}catch(e){}})}
function renderAcct(){return G.acct?`<div class="grp">Hesap</div><p style="font-size:13px;margin:0 0 6px">Kullanıcı adın: <b>${esc(G.acct)}</b> ✓<br><small style="opacity:.75">Yeni telefonda giriş ekranındaki <b>Giriş yap</b> ile dükkânlarına dönebilirsin.</small></p>${acctDelBox()}`:
 `<div class="grp">Hesap</div><p style="font-size:12px;margin:0 0 6px;opacity:.8">Kullanıcı adı ve şifre belirle; uygulamayı silsen ya da telefon değiştirsen de dükkânına geri dönersin.</p><div style="display:flex;gap:6px;flex-wrap:wrap"><input id="acU" placeholder="Kullanıcı adı" autocomplete="username" autocapitalize="none" style="flex:1;min-width:120px"><input id="acP" placeholder="Şifre" aria-label="Şifre" inputmode="numeric" type="password" autocomplete="new-password" style="width:130px"></div><div class="pk" style="margin-top:6px"><button class="btn g" id="acB">Hesabı kaydet</button></div>`}
function acctWire2(){const sh=ui.sheet;shopsWire();
 sh.querySelectorAll('[data-au]').forEach(b=>b.onclick=async()=>{const c=b.dataset.au,how=b.dataset.how;if(!how){ACS.del=c;renderMenu();return}const a=acctLoc();if(!a)return;b.disabled=true;b.textContent='…';
  let r;try{r=await rpc('arasta_user_unlink',{p_uname:a.u,p_pin:a.p,p_code:c,p_del:how==='all'})}catch(e){r='net'}
  if(r!=='ok'){toast(ACM[r]||'Olmadı, bağlantını kontrol et',2200);renderMenu();return}
  ACS.del=null;SHD=null;ACS.list=ACS.list.filter(x=>x.code!==c);sfx.tap();
  if(how==='all'){acctLocalWipe(c,true);if(c===G.cloud){G.cloud=null;try{localStorage.removeItem(SK)}catch(e){}save=()=>{};toast('Dükkân silindi',1400);setTimeout(()=>location.reload(),900);return}toast('Dükkân her yerden silindi',1800)}
  else toast('Dükkân hesabından çıkarıldı',1800);renderMenu()});
 sh.querySelectorAll('[data-aux]').forEach(b=>b.onclick=()=>{ACS.del=null;renderMenu()});
 const o=$('acOut');if(o)o.onclick=()=>{try{localStorage.removeItem('arasta-acct')}catch(e){}G.acct=null;ACS.list=null;save();toast('Bu cihazda hesaptan çıkıldı. Dükkânların yerinde.',2000);renderMenu()};
 const d=$('acDel');if(d)d.onclick=()=>{ACS.acDel=true;renderMenu()};const x=$('adX');if(x)x.onclick=()=>{ACS.acDel=false;renderMenu()};
 sh.querySelectorAll('[data-ad]').forEach(b=>b.onclick=async()=>{const p=$('adP').value.trim(),all=b.dataset.ad==='all';if(!p){toast('Şifreni yaz',1400);return}
  if(all&&!b.dataset.arm){b.dataset.arm=1;b.textContent='Tüm dükkânlar silinecek, emin misin?';return}
  b.disabled=true;let r;try{r=await rpc('arasta_user_delete',{p_uname:G.acct,p_pin:p,p_saves:all})}catch(e){r='net'}
  if(r!=='ok'){b.disabled=false;toast(ACM[r]||'Olmadı, bağlantını kontrol et',2200);return}
  const codes=(ACS.list||[]).map(x=>x.code);try{localStorage.removeItem('arasta-acct')}catch(e){}G.acct=null;ACS.acDel=false;ACS.list=null;
  if(all){codes.forEach(c=>acctLocalWipe(c,true));if(codes.includes(G.cloud)){G.cloud=null;try{localStorage.removeItem(SK)}catch(e){}save=()=>{};toast('Hesabın ve dükkânların silindi',1600);setTimeout(()=>location.reload(),1100);return}}
  save();toast(all?'Hesabın ve dükkânların silindi':'Hesabın silindi. Dükkânların yerinde.',2200);renderMenu()})}
function acctWire(){acctWire2();const b=$('acB');if(b)b.onclick=async()=>{const u=$('acU').value,p=$('acP').value;b.textContent='…';b.disabled=true;let r;try{r=await acctLink(u,p)}catch(e){r='net'}if(r==='ok'){sfx.fan();toast('Hesabın kaydedildi',1600)}else toast(ACM[r]||'Bağlantı kurulamadı',2200);renderMenu()}}

function tick(){extTick();mzTick();pushSync();dqTick();decoTier();if(lastSeas!==season()||!SEASM)setTimeout(seasonLook,0);cupTick();trakTick();cirakTick();cobanTick();kervanTick();{const se=season();if(lastSeas!==se){if(lastSeas>=0&&G.started)toast(`${SEAS[se].ic} ${SEAS[se].ad} geldi!<br>Talep görenler: ${SEAS[se].p.map(id=>(PRODS.find(x=>x.id===id)||{}).ad).filter(Boolean).slice(0,4).join(', ')}`,3200);lastSeas=se}}if(G.gu)gSync();if(DOORH&&DOORH.userData.dk===undefined)decoApply();updTimers();dayTick();dayLight();hud();giftTick();plotTick();patUI();checkAch();if(++saveN>20){saveN=0;save()}
if(tt>G.mktT){restock();if(modalMode==='market')renderMarket()}
for(let i=G.deliv.length-1;i>=0;i--)if(NOW()>=G.deliv[i].end){giveAll(G.deliv[i].items);toast('Tedarikçi geldi: '+Object.entries(G.deliv[i].items).map(([k,n])=>n+' '+MATS[k].ad).join(', '),2000);G.deliv.splice(i,1);refresh();if(modalMode==='market')renderMarket()}
ST.forEach(s=>{const dn=s.jobs.filter(j=>NOW()>=j.end);if(!dn.length)return;s.jobs=s.jobs.filter(j=>NOW()<j.end);s.ready=s.ready||{};dn.forEach(j=>Object.entries(j.r.out).forEach(([k,n])=>s.ready[k]=(s.ready[k]||0)+n));sfx.ready();if(modalMode==='st:'+s.id)openStation(s);else if(view!=='islik')toast(s.ad+': üretim bitti',1400);notify('Atölye',s.ad+': üretim bitti')});
COLL.forEach(o=>{const c=o.userData.coll;if(!c.alive&&NOW()>=c.t){c.alive=true;o.visible=true;tween(0.4,k=>o.scale.copy(c.base).multiplyScalar(Math.max(0.01,k)))}})}

/* Uzun ortam kayıtları döngüde: pazar kalabalığı, orman kuşları */
const LOOPS={},AMSRC=[];let ambV=null,ambZ=0;function ambPlay(n,v){if(!AC||!SB[n])return;const o=playB(n,v,false,'a');AMSRC.push(o);o.s.onended=()=>{const i=AMSRC.indexOf(o);if(i>=0)AMSRC.splice(i,1)}}
function loopSet(n,v){if(!AC||!SB[n])return;let L=LOOPS[n];if(!L&&v>0){const o=playB(n,0,true,'a');o.g.gain.value=0.0001;L=LOOPS[n]=o}if(!L)return;const t=AC.currentTime;L.g.gain.cancelScheduledValues(t);L.g.gain.setTargetAtTime(Math.max(0.0001,v),t,0.6)}
function loopTick(){if(!AC)return;const on=G.snd&&!document.hidden&&G.started&&G.phase!=='craft'&&G.phase!=='result'&&!switching;let zc=0;if(view==='bahce')zc=Math.round((camCur.l.x+ZM.px-OB)/11);
 loopSet('kalabalik',on&&view==='pazar'?0.22:0);loopSet('cim',on&&view==='bahce'&&!!TRB?0.07:0);loopSet('kus',on&&view==='bahce'?(zc>0?0.3:zc===0?0.12:0):0);
 if(view!==ambV||zc!==ambZ){ambV=view;ambZ=zc;AMSRC.forEach(o=>{try{const t=AC.currentTime;o.g.gain.setTargetAtTime(0,t,0.08);o.s.stop(t+0.4)}catch(e){}});AMSRC.length=0}}
setInterval(loopTick,150);
/* ---------- birleşik "Dükkânlarım" listesi ---------- */
let SHD=null;
function shopRows(){const L=[],acc=G.acct&&acctLoc()&&ACS.list;if(G.acct&&acctLoc()&&ACS.list===null)acctLoad();
 ['1','2','3'].forEach(n=>{const i=slotInfo(n);if(!i)return;L.push({k:'s'+n,n,code:i.cloud,ad:i.ad,day:i.day,tier:i.tier,gold:i.gold,loc:true,cur:n===SSLOT,acc:!!(acc&&i.cloud&&ACS.list.some(x=>x.code===i.cloud))})});
 if(acc)ACS.list.forEach(x=>{if(!L.some(r=>r.code===x.code))L.push({k:'c'+x.code,code:x.code,ad:x.ad||'Dükkânım',day:x.day||1,tier:x.tier||1,gold:x.gold||0,loc:false,acc:true})});
 L.sort((a,b)=>(b.cur?1:0)-(a.cur?1:0));return L}
function shopsHTML(){const L=shopRows(),free=['1','2','3'].filter(n=>!slotInfo(n));
 const opt=(cls,attrs,t,d)=>`<button class="shopt ${cls}" ${attrs}><b>${t}</b><small>${d}</small></button>`;
 let h=`<div class="grp">Dükkânlarım</div><div class="shl">`;
 L.forEach(r=>{const tags=(r.loc?'<i class="tg">📱 Bu cihazda</i>':'')+(r.acc?'<i class="tg c">☁ Hesabında</i>':r.code?'<i class="tg g">☁ Bulut kodu var</i>':'');
  let act='';if(r.cur)act='<span class="shnow">Şu an açık</span>';else if(r.loc)act=`<button class="btn l sm" data-sl="${r.n}">Geç</button>`;else act=free.length?`<button class="btn l sm" data-sc="${r.code}">İndir</button>`:'';
  const canDel=!r.cur||r.acc;
  h+=`<div class="shp${r.cur?' on':''}"><div class="shm"><div class="shn">${esc(r.ad)}</div><div class="shs">${r.day}. gün · K${r.tier} · ${r.gold} altın</div><div class="shg">${tags}</div></div><div class="sha">${act}${canDel?`<button class="shx${SHD===r.k?' on':''}" data-shd="${r.k}" aria-label="Sil">${SHD===r.k?'✕':'🗑'}</button>`:''}</div>`;
  if(SHD===r.k){h+='<div class="shdl"><div class="shq">Bu dükkânla ne yapmak istiyorsun?</div>';
   if(r.loc&&!r.cur)h+=opt('','data-sd="'+r.n+'" data-how="loc"','Bu cihazdan kaldır',r.code?'Bulutta'+(r.acc?' ve hesabında':'')+' kalır, sonra geri indirebilirsin':'Bulut kaydı yok, kalıcı olarak gider');
   if(r.acc)h+=opt('','data-au="'+r.code+'" data-how="un"','Hesabımdan çıkar','Dükkân yerinde kalır, sadece kullanıcı adınla bağı kopar');
   if(r.acc)h+=opt('r arm','data-au="'+r.code+'" data-how="all"','Her yerden sil','Bu cihaz, bulut ve hesap · geri alınamaz');else if(r.loc&&!r.cur&&r.code)h+=opt('r arm','data-sd="'+r.n+'" data-how="all"','Her yerden sil','Bu cihaz ve bulut · geri alınamaz');
   h+='</div>'}
  h+='</div>'});
 if(free.length)h+=`<button class="shnew" data-sl="${free[0]}">＋ Yeni dükkân aç <small>${free.length} boş yer</small></button>`;
 if(G.acct&&acctLoc()&&ACS.list===null)h+=`<p class="shnote">${ACS.err?esc(ACS.err):'Hesabındaki dükkânlar yükleniyor…'}</p>`;
 return h+'</div>'}
function shopsWire(){const sh=ui.sheet;sh.querySelectorAll('[data-shd]').forEach(b=>b.onclick=()=>{sfx.tap();SHD=SHD===b.dataset.shd?null:b.dataset.shd;renderMenu()});
 sh.querySelectorAll('[data-sc]').forEach(b=>b.onclick=()=>{b.disabled=true;b.textContent='…';cloudLoadInto(b.dataset.sc).then(r=>{if(r!=='ok'){toast(r==='full'?'Boş yer yok':'İndirilemedi, bağlantını kontrol et',1800);renderMenu()}})});
 if(!sh.dataset.armw){sh.dataset.armw=1;sh.addEventListener('click',e=>{const b=e.target.closest('.arm');if(!b||b.dataset.ok)return;e.stopImmediatePropagation();e.preventDefault();b.dataset.ok=1;b.classList.add('armed');b.querySelector('b').textContent='Emin misin? Tekrar dokun';sfx.tap()},true)}}
