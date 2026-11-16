/* ---------- oyun durumu ---------- */
const G={gold:180,rep:0,n:1,inv:{},order:null,phase:'idle',step:null,tier:1,first:true,deliv:[],market:[],mktT:0,disc:1,haggled:false};
Object.assign(G,{st:{deliv:0,five:0,earned:0,coll:0,proc:0,harv:0,lost:0,plots:0,sold:0},cat:{},stock:[],sid:0,ach:{},unl:['cuzdan','kemer','ayakkabi'],shop:{ad:'Benim Dükkânım',logo:'star',col:'#a3302a'},snd:true,mus:true,open:true,stLv:{},started:false,day:1,tm:0,night:false,ds:null});
Object.keys(MATS).forEach(k=>G.inv[k]=0);
Object.assign(G.inv,{deri:1,iplik:1,boya_kahve:1,hamderi:1,pamuk:2,tutkal:1});
const TIERS={1:0,2:35,3:100};
const unlocked=p=>G.tier>=p.tier&&(!p.after||((G.cat[p.after[0]]||{n:0}).n>=p.after[1]))&&(!p.tools||p.tools.every(t=>G.eq&&G.eq[t]&&G.eq[t].own));
const ACH=[{id:'ilk',ad:'İlk satış',desc:'Bir sipariş teslim et',get:()=>G.st.deliv,goal:1,gold:20},{id:'bes',ad:'Usta işi',desc:'5 yıldızlı bir ürün yap',get:()=>G.st.five,goal:1,gold:30},
{id:'on',ad:'Mahallenin ustası',desc:'10 sipariş teslim et',get:()=>G.st.deliv,goal:10,gold:80},{id:'muk',ad:'Kusursuz el',desc:'5 kez 5 yıldız al',get:()=>G.st.five,goal:5,gold:100},
{id:'zen',ad:'Dolu kasa',desc:'Toplam 1000 altın kazan',get:()=>G.st.earned,goal:1000,gold:100},{id:'top',ad:'Toplayıcı',desc:'50 malzeme topla',get:()=>G.st.coll,goal:50,gold:50},
{id:'isl',ad:'Çalışkan atölye',desc:'Atölyede 20 üretim yap',get:()=>G.st.proc,goal:20,gold:60},{id:'cif',ad:'Çiftçi',desc:'10 hasat yap',get:()=>G.st.harv,goal:10,gold:60},
{id:'ara',ad:'Toprak sahibi',desc:'3 arazi satın al',get:()=>G.st.plots,goal:3,gold:80},{id:'kol',ad:'Tam koleksiyon',desc:'Tüm ürünleri başarıyla üret',get:()=>Object.keys(G.cat).length,goal:PRODS.length,gold:300},
{id:'vit',ad:'Vitrin satıcısı',desc:'Vitrinden 5 ürün sat',get:()=>G.st.sold,goal:5,gold:60},{id:'k3',ad:'Büyük usta',desc:'Kademe 3 ol',get:()=>G.tier,goal:3,gold:150}];
function checkAch(){ACH.forEach(a=>{if(!G.ach[a.id]&&a.get()>=a.goal){G.ach[a.id]=1;G.gold+=a.gold;hud();toast(`Başarım: ${a.ad}<br>+${a.gold} altın`,2400);sfx.fan()}})}
function checkUnl(){PRODS.filter(unlocked).forEach(p=>{if(!G.unl.includes(p.id)){G.unl.push(p.id);setTimeout(()=>{toast(`Yeni ürün açıldı: ${p.ad}`,2600);sfx.fan()},2300)}})}
const SKOF=n=>n==='1'?'kraft-save-v1':'kraft-save-v1-s'+n,SSLOT=(()=>{try{return localStorage.getItem('arasta-slot')||'1'}catch(e){return '1'}})(),SK=SKOF(SSLOT);
function slotInfo(n){try{const d=JSON.parse(localStorage.getItem(SKOF(n)));if(!d)return null;return {ad:(d.shop&&d.shop.ad)||'Dükkânım',day:d.day||1,gold:d.gold||0,tier:d.tier||1}}catch(e){return null}}
function goSlot(n){try{localStorage.setItem('arasta-slot',n)}catch(e){}save();save=()=>{};location.reload()}
function newSlot(){for(const n of ['1','2','3'])if(!slotInfo(n)&&n!==SSLOT){goSlot(n);return true}return false}
function exportSave(){save();try{return 'ARS1.'+btoa(unescape(encodeURIComponent(localStorage.getItem(SK))))}catch(e){return ''}}
function importSave(code){try{code=code.trim();if(!code.startsWith('ARS1.'))return false;const j=decodeURIComponent(escape(atob(code.slice(5))));JSON.parse(j);localStorage.setItem(SK,j);save=()=>{};location.reload();return true}catch(e){return false}}let saveN=0;
let save=function(){try{localStorage.setItem(SK,JSON.stringify({ts:Date.now(),cloud:G.cloud||null,gold:G.gold,rep:G.rep,elmas:G.elmas||0,n:G.n,inv:G.inv,tier:G.tier,first:G.first,st:G.st,cat:G.cat,stLv:G.stLv,stock:G.stock,sid:G.sid,ach:G.ach,unl:G.unl,shop:G.shop,owner:G.owner||false,deco:G.deco,eq:G.eq,cap:G.cap,store:G.store,dOrd:G.dOrd,dSlot:G.dSlot,cirak:G.cirak||false,dq:G.dq||null,stSp:G.stSp||{},acct:G.acct||null,notif:G.notif||false,tut:G.tut||0,vol:G.vol!=null?G.vol:1,vib:G.vib!==false,trak:G.trak||false,trakI:G.trakI||0,cirI:G.cirI||{},trakM:G.trakM||null,cirakM:G.cirakM||null,trakLast:G.trakLast!=null?G.trakLast:null,cirakLast:G.cirakLast!=null?G.cirakLast:null,stLast:G.stLast||{},kervan:G.kervan||null,reg:G.reg||[],cup:G.cup||null,deliv:G.deliv,ext:G.ext,qs:qSer(),stJ:Object.fromEntries(ST.map(s=>[s.id,{jobs:s.jobs.map(j=>({ri:s.rec.indexOf(j.r),end:j.end})),ready:s.ready||null}])),collT:COLL.map(o=>{const c=o.userData.coll;return !c.alive&&isFinite(c.t)?c.t:0}),gu:G.gu,stB:G.stB,snd:G.snd,mus:G.mus,open:G.open,daily:G.daily,streak:G.streak,day:G.day,tm:G.tm,night:G.night,ds:G.ds,plots:PL.map(o=>({own:o.own,seed:o.seed,w:!!o.w,rem:o.seed&&o.w?Math.max(0,o.end-NOW()):0,end:o.seed&&o.w?o.end:0}))}))}catch(e){}};
{const s0=save;save=function(){s0();cloudPush()}}
const CL={u:'https://rytrhkpmsfskiyoujyyb.supabase.co/rest/v1/rpc/',k:'sb_publishable_I_rw47M8KquQV6XTLm2LYg_KEckXVj7'};
function rpc(fn,body,ka){return fetch(CL.u+fn,{method:'POST',keepalive:!!ka,headers:{apikey:CL.k,'Content-Type':'application/json'},body:JSON.stringify(body)}).then(r=>r.ok?r.json():Promise.reject(r.status))}
let clT=0,clDirty=false;
function cloudPush(force,ka){if(!G.cloud)return Promise.resolve(false);clDirty=true;const now=Date.now();if(!force&&now-clT<20000)return Promise.resolve(false);clT=now;clDirty=false;let d;try{d=JSON.parse(localStorage.getItem(SK))}catch(e){return Promise.resolve(false)}return rpc('arasta_put',{p_code:G.cloud,p_data:d},ka).then(r=>{G.clOk=Date.now();return r}).catch(()=>{clDirty=true;return false})}
setInterval(()=>{if(clDirty)cloudPush(true)},25000);document.addEventListener('visibilitychange',()=>{if(document.hidden&&G.cloud){try{localStorage.getItem(SK)&&cloudPush(true,true)}catch(e){}}});
function newCode(){const A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',r=crypto.getRandomValues(new Uint32Array(12));let c='';r.forEach(x=>c+=A[x%A.length]);return c}
const fmtCode=c=>c.replace(/(.{4})(?=.)/g,'$1-'),normCode=c=>(c||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
function cloudLoadInto(code){code=normCode(code);if(code.length!==12)return Promise.resolve('bad');return rpc('arasta_get',{p_code:code}).then(d=>{if(!d)return 'none';d.cloud=code;let tgt=SSLOT;const cur=slotInfo(SSLOT);let curCode=null;try{curCode=JSON.parse(localStorage.getItem(SK)).cloud}catch(e){}if(cur&&curCode!==code){tgt=['1','2','3'].find(n=>!slotInfo(n));if(!tgt)return 'full'}localStorage.setItem(SKOF(tgt),JSON.stringify(d));localStorage.setItem('arasta-slot',tgt);save=()=>{};location.reload();return 'ok'}).catch(()=>'net')}
const STC={pres:120,cark:100,dokuma:120,ors:200,testere:300};
const GLK={'Ceviz ağacı':[1,40],'Böğürtlen':[1,50],'Kök boya':[1,60],'Lavanta':[1,70],'Arı kovanı':[2,120],'Koyun':[1,80],'Tavuk':[1,60],'Domuz':[1,50],'Paşa':[1,40],'İnek':[2,150],'Keçi':[2,120],'Tavşan':[2,100],'İpek böceği':[2,150],'At':[2,200],'Taş ocağı':[1,60],'Kil çukuru':[1,50],'Söğüt':[1,60],'Kum':[2,80],'Geyik':[3,250],'Oduncu kulübesi':[3,150],'Kömür ocağı':[2,90],'Balık gölü':[2,100],'Hindistan cevizi':[2,120]};
var TRACT;let buyArm=null,buyT=0;
function stOwned(s){return !STC[s.id]||!!(G.stB&&G.stB[s.id])}
function armBuy(key,txt){if(buyArm===key&&tt<buyT)return true;buyArm=key;buyT=tt+3;toast(txt+'<br>Onaylamak için tekrar dokun',2200);return false}
function buyStation(s){if(G.tier<s.tier){toast(`${s.ad} ${s.tier}. kademede açılır`,1500);return}const c=STC[s.id];if(G.gold<c){toast(`${s.ad} için ${c} altın gerekli`,1500);return}if(!armBuy('st'+s.id,`${s.ad} kurulsun mu? ${c} altın`))return;G.gold-=c;G.stB[s.id]=1;sfx.coin();sfx.fan();buyArm=null;toast(`${s.ad} kuruldu!`,1500);s.lbl.last='';save();refresh()}
function gOpen(ad){return !GLK[ad]||!!(G.gu&&G.gu[ad])}
function nearP(x,z){let b=null,bd=1e9;PATCHES.forEach(p=>{const d=Math.hypot(p.cx-x,p.cz-z);if(d<bd){bd=d;b=p}});return b}
function lockInit(){if(!G.gu){G.gu={};G.stB={};if(G.day>1||G.tier>1||G.st.deliv>0){Object.entries(GLK).forEach(([k,v])=>{if(v[0]<=G.tier)G.gu[k]=1});Object.keys(STC).forEach(id=>{const s=ST.find(x=>x.id===id);if(s&&s.tier<=G.tier)G.stB[id]=1})}}
 COLL.forEach(o=>{const c=o.userData.coll,x=o.position.x,z=o.position.z;c.src=c.mat==='atkili'?'At':c.mat==='boynuz'?'Geyik':c.mat==='kutuk'&&x>OB+5?'Oduncu kulübesi':nearP(x,z).ad});
 ANIMS.forEach(g=>{g.userData.src=nearP(g.position.x,g.position.z).ad});
 PATCHES.forEach(p=>{if(GLK[p.ad])p.el.onclick=()=>buyPatch(p)});gSync()}
function gSync(){COLL.forEach(o=>{const c=o.userData.coll,op=gOpen(c.src);if(!op){c.alive=false;c.t=Infinity;o.visible=false}else if(c.t===Infinity){c.t=tt}});ANIMS.forEach(g=>{g.visible=gOpen(g.userData.src)});
 PATCHES.forEach(p=>{const L=GLK[p.ad];if(!L)return;const op=gOpen(p.ad);p.el.classList.toggle('stl',!op);p.el.classList.toggle('lock',!op&&G.tier<L[0]);const t=op?p.ad:`🔒 ${p.ad}<small>${G.tier<L[0]?'Kademe '+L[0]:L[1]+' altın'}</small>`;if(t!==p.last){p.last=t;p.el.innerHTML=t}})}
function buyPatch(p){if(gOpen(p.ad)||switching)return;const L=GLK[p.ad];if(G.tier<L[0]){toast(`${p.ad} ${L[0]}. kademede açılır`,1500);return}if(G.gold<L[1]){toast(`${p.ad} için ${L[1]} altın gerekli`,1500);return}if(!armBuy('g'+p.ad,`${p.ad} açılsın mı? ${L[1]} altın`))return;G.gold-=L[1];G.gu[p.ad]=1;buyArm=null;sfx.coin();sfx.plant();toast(`${p.ad} açıldı!`,1500);gSync();save();refresh()}
/* ---------- ekipmanlar ---------- */
const EQ=[{id:'makas',ad:'Makas',e:'✂️',d:'Deri, kumaş ve iplik keser',m:'scissors2'},{id:'testere',ad:'El testeresi',e:'🪚',d:'Ahşap ve boynuz gibi sert malzemeyi keser',m:'saw2'},{id:'bicak',ad:'Kesim bıçağı',e:'🔪',d:'Kil, sabun ve mum keser; deriyi inceltir, oyar',m:'knife'},
 {id:'igne',ad:'İğne ve biz',e:'🪡',d:'Dikiş ve delik açma'},{id:'tutkalf',ad:'Tutkal fırçası',e:'🖌️',d:'Tutkal ve çamur sürme'},{id:'zimpara',ad:'Zımpara takozu',e:'🧱',d:'Yüzey zımparası'},{id:'cila',ad:'Cila bezi',e:'🧽',d:'Cila, parlatma, şekillendirme'},
 {id:'firca',ad:'Boya fırçası',e:'🎨',d:'Tasarım boyaması'},{id:'pres',ad:'El presi',e:'🗜️',d:'Pres, katlama, ütü, doldurma'},
 {id:'kompresor',ad:'Hava kompresörü',e:'💨',d:'Top ve şişme ürünleri şişirir',buy:[250,20]},{id:'havya',ad:'Havya ve pürmüz',e:'🔥',d:'Cam ve plastiği ısıtıp şekillendirir, lehimler',buy:[300,30],m:'solder'}];
const EQLV=['','Basit','Usta','Ustalık'],EQDUR=[0,20,35,50],EQREN=[0,15,30,50],EQUP=[0,0,[120,15],[280,40]],EQICON={};
function eqS(id){if(!G.eq)G.eq={};const e=EQ.find(x=>x.id===id);if(!G.eq[id])G.eq[id]=e.buy?{own:0,lv:1,dur:EQDUR[1]}:{own:1,lv:1,dur:EQDUR[1]};return G.eq[id]}
const eqOwn=id=>!!eqS(id).own,eqMul=id=>{const s=id&&G.eq&&G.eq[id];return s&&s.own?1+0.25*(s.lv-1):1};
function stepTool(s,p){if(s.tool)return s.tool;const k=s.k;if(s.t==='trace')return p.cut==='kn'?'bicak':p.hard?'testere':'makas';if(s.t==='rhythm')return k==='yapistir'?'tutkalf':'igne';if(s.t==='rub')return k==='zimpara'?'zimpara':(k==='incelt'||k==='oy')?'bicak':(k==='cila'||k==='parlat'||k==='sekil')?'cila':null;if(s.t==='hold')return 'pres';if(s.t==='design')return K&&K.p.need.boya?'firca':null;return null}
function eqUse(id){const s=eqS(id),e=EQ.find(x=>x.id===id);if(!s.own||G.owner)return;if(s.dur>0)s.dur--;if(s.dur<=0)toast(`${e.e} ${e.ad} köreldi!<br>Menü › Ekipmanlar'dan yenile`,2200);else if(s.dur<=5)toast(`${e.e} ${e.ad} yıpranıyor · ${s.dur} kullanım kaldı`,1500);eqBadge()}
function eqBadge(){const b=$('menuB');if(b)b.classList.toggle('warn',EQ.some(e=>{const s=G.eq&&G.eq[e.id];return s&&s.own&&s.dur<=5}))}
function eqScore(s){const id=K&&K.tool;if(!id||!G.eq||!G.eq[id]||!G.eq[id].own)return s;const st=G.eq[id];if(st.dur<=0)return s*0.6;return s>0?Math.min(1,s+0.06*(st.lv-1)):s}
function eqIcons(){EQ.forEach(e=>{if(e.m&&!EQICON[e.id])glb(e.m,g=>{try{const o=g.scene.clone();EQICON[e.id]=snap(o)}catch(x){}})})}
function renderEq(){let h='<p style="font-size:12px;margin:0 0 6px;opacity:.8">Aletlerin her kullanımda yıpranır. Körelen alet kötü iş çıkarır, yenile. Geliştirilen alet daha temiz iş çıkarır.</p>';
 EQ.forEach(e=>{const s=eqS(e.id),mx=EQDUR[s.lv],up=EQUP[s.lv+1],ic=EQICON[e.id]?`<img class="ic" src="${EQICON[e.id]}" alt="">`:`<div class="ic" style="display:grid;place-items:center;font-size:24px">${e.e}</div>`;
  if(!s.own){h+=`<div class="row">${ic}<div class="n">${e.ad}<small>${e.d}</small><small>Gerekli: ${e.buy[0]} altın · itibar ${e.buy[1]}</small></div><button class="btn g" data-eb="${e.id}" ${G.gold<e.buy[0]||G.rep<e.buy[1]?'disabled':''}>Satın al</button></div>`;return}
  const pc=Math.max(0,s.dur/mx*100),col=s.dur<=0?'#b5533c':s.dur<=5?'#d9a23a':'var(--tl)';
  h+=`<div class="row" style="flex-wrap:wrap">${ic}<div class="n">${e.ad} <span style="font-size:11px;color:var(--tr)">${EQLV[s.lv]}${s.lv>1?' · +%'+(s.lv-1)*6+' kalite':''}</span><small>${e.d}</small><div class="bar"><i style="width:${pc}%;background:${col}"></i></div><small>${s.dur<=0?'Köreldi!':s.dur+'/'+mx+' kullanım'}</small></div>
  <div style="display:flex;flex-direction:column;gap:4px">${s.dur<mx?`<button class="btn ${s.dur<=5?'r':'l'}" data-er="${e.id}" ${G.gold<EQREN[s.lv]?'disabled':''}>Yenile · ${EQREN[s.lv]}</button>`:''}${up?`<button class="btn l" data-eu="${e.id}" ${G.gold<up[0]||G.rep<up[1]?'disabled':''}>${EQLV[s.lv+1]} · ${up[0]} altın${G.rep<up[1]?' · itibar '+up[1]:''}</button>`:''}</div></div>`});return h}
function wireEq(){ui.sheet.querySelectorAll('[data-er]').forEach(b=>b.onclick=()=>{const s=eqS(b.dataset.er),c=EQREN[s.lv];if(G.gold<c)return;G.gold-=c;s.dur=EQDUR[s.lv];sfx.coin();toast('Yenilendi',1000);eqBadge();save();refresh();renderMenu()});
 ui.sheet.querySelectorAll('[data-eu]').forEach(b=>b.onclick=()=>{const s=eqS(b.dataset.eu),u=EQUP[s.lv+1];if(!u||G.gold<u[0]||G.rep<u[1])return;G.gold-=u[0];s.lv++;s.dur=EQDUR[s.lv];sfx.coin();sfx.fan();toast(`${EQ.find(x=>x.id===b.dataset.eu).ad}: ${EQLV[s.lv]} seviye!`,1500);eqBadge();save();refresh();renderMenu()});
 ui.sheet.querySelectorAll('[data-eb]').forEach(b=>b.onclick=()=>{const e=EQ.find(x=>x.id===b.dataset.eb),s=eqS(e.id);if(G.gold<e.buy[0]||G.rep<e.buy[1])return;G.gold-=e.buy[0];s.own=1;s.dur=EQDUR[1];sfx.coin();sfx.fan();toast(`${e.ad} alındı! Yeni ürünlerin önü açıldı`,1800);save();refresh();renderMenu()})}

function load(){try{const d=JSON.parse(localStorage.getItem(SK));if(!d)return;G.qsL=Array.isArray(d.qs)&&d.qs.length?d.qs:null;G.qsT=d.ts||Date.now();['gold','rep','n','tier','first','snd','mus','open','daily','streak','day','tm','night','ds','cloud','gu','stB','deco','eq','cap','store','dOrd','owner','dSlot','deliv','ext','cirak','trak','stLast','dq','tut','vol','vib','stSp','acct','notif','kervan','reg','cup'].forEach(k=>{if(d[k]!=null)G[k]=d[k]});{const aw=d.ts?(Date.now()-d.ts)/1000:0;let jobs=0;if(d.stJ)Object.values(d.stJ).forEach(q=>(q.jobs||[]).forEach(j=>{if(j.end<=NOW())jobs++}));let plots=0;(d.plots||[]).forEach(q=>{if(q.seed&&q.w&&q.end&&q.end<=NOW())plots++});const kv=d.kervan&&d.kervan.trip&&d.kervan.trip.end<=NOW()?d.kervan.trip.gold:0;let coll=0;(d.collT||[]).forEach(t=>{if(t&&t<=NOW())coll++});const dl=(d.deliv||[]).some(x=>x.end<=NOW());G.away={secs:aw,jobs,plots,kervan:kv,coll,deliv:dl}}if(d.stJ)ST.forEach(s=>{const q=d.stJ[s.id];if(!q)return;s.jobs=(q.jobs||[]).filter(j=>s.rec[j.ri]).map(j=>({r:s.rec[j.ri],end:j.end}));s.ready=q.ready||null});if(d.collT)setTimeout(()=>d.collT.forEach((t,i)=>{const o=COLL[i];if(!o||!t||t<=NOW())return;const c=o.userData.coll;if(!c.alive)return;c.alive=false;c.t=t;o.visible=false}),0);Object.assign(G.inv,d.inv);Object.assign(G.st,d.st);G.cat=d.cat||{};G.stLv=d.stLv||{};G.stock=(d.stock||[]).filter(it=>PRODS.some(p=>p.id===it.pid));G.sid=d.sid||0;G.ach=d.ach||{};G.unl=d.unl||G.unl;Object.assign(G.shop,d.shop);
(d.plots||[]).forEach((q,i)=>{const o=PL[i];if(!o)return;o.own=!!q.own;o.seed=CROPS[q.seed]?q.seed:null;o.w=!!q.w;if(o.seed){o.dur=CROPS[o.seed].s;o.end=q.end||(NOW()+(q.rem||0))}})}catch(e){}}
const tierOf=r=>r>=TIERS[3]?3:r>=TIERS[2]?2:1;
const MARKET=[{k:'hamderi',f:18},{k:'deri',f:38},{k:'iplik',f:14},{k:'taban',f:16},{k:'toka',f:14},{k:'kaucuk',f:12},{k:'kurum',f:6},{k:'tutkal',f:5},
{k:'pirinc',f:18,t:2},{k:'bakir',f:22,t:2},{k:'koza',f:18,t:2},{k:'demir',f:26,t:3},{k:'kumas',f:30,t:2},{k:'kutuk',f:12,t:3},{k:'balmumu',f:8,t:3}];
const SUPPLY=[{items:{hamderi:5},f:70},{items:{kaucuk:5},f:50},{items:{pirinc:3},f:45,t:2},{items:{kutuk:5},f:45,t:3}];
const DELAY=40;
let tt=0;const NOW=()=>Date.now()/1000;
function restock(){G.market=MARKET.filter(m=>!m.t||G.tier>=m.t).map(m=>({k:m.k,f:Math.max(2,Math.round(m.f*(0.85+Math.random()*0.35))),st:1+Math.floor(Math.random()*5)}));G.mktT=tt+90;G.disc=1;G.haggled=false}
restock();

const ui={gold:$('gold'),rep:$('rep'),tier:$('tierP'),card:$('card'),tip:$('tip'),bub:$('bubble'),act:$('actions'),modal:$('modal'),sheet:$('sheet'),toast:$('toast'),fade:$('fade')};
const show=(el,on)=>el.classList.toggle('hide',!on);
let toastT=0;function toast(t,ms){ui.toast.innerHTML=t;show(ui.toast,true);clearTimeout(toastT);toastT=setTimeout(()=>show(ui.toast,false),ms||1600)}
function say(t){if(!t){show(ui.bub,false);return}ui.bub.innerHTML=t;show(ui.bub,view==='home')}
function tip(t){if(!t){show(ui.tip,false);return}ui.tip.innerHTML=t;show(ui.tip,true)}
function btn(label,cls,fn,dis){const b=document.createElement('button');b.className='btn '+(cls||'');b.innerHTML=label;if(fn)b.onclick=fn;if(dis)b.disabled=true;return b}
function actions(list){ui.act.innerHTML='';list.forEach(b=>ui.act.appendChild(b))}
const paintOf=id=>PAINTS.find(p=>p.id===id);
const anyPaint=()=>PAINTS.some(p=>G.inv['boya_'+p.id]>0);
function hasNeed(p){return Object.entries(p.need).every(([k,n])=>k==='boya'?anyPaint():G.inv[k]>=n)}
function hasAll(o){return Object.entries(o).every(([k,n])=>G.inv[k]>=n)}
function giveAll(o,s){Object.entries(o).forEach(([k,n])=>G.inv[k]+=n*(s||1))}
/* Elmas: nadir para birimi. p olasılıkla 1 elmas verir */
const GEM_P={topla:0.005,teslim:0.03,bes:0.06};
function gemRoll(p,msg){if(Math.random()>=p)return false;G.elmas=(G.elmas||0)+1;hud();sfx.fan&&sfx.fan();toast(`💎 ${msg}<br>Elmasın: <b>${G.elmas}</b>`,2400);return true}
function hud(){{const e=$('elmas');if(e)e.textContent=G.elmas||0}ui.gold.textContent=G.gold;ui.rep.textContent=G.rep;ui.tier.textContent='K'+G.tier+' · '+clockTxt()+' '+WX[wx].ic}
function clockTxt(){if(G.night)return 'Akşam';const m=480+Math.floor(G.tm),h=Math.floor(m/60);return (h<10?'0':'')+h+':'+String(m%60).padStart(2,'0')}
function renderCard(){const o=G.order;if(!o||G.phase==='craft'||G.phase==='result'){show(ui.card,false);return}
if(o.buy){const it=G.stock.find(x=>x.id===o.buy);ui.card.innerHTML=`<h4>Vitrin müşterisi</h4>${it?desc(it)+' · '+it.price+' altın':'Ürün satılmış'}`;show(ui.card,true);return}
const rows=Object.entries(o.p.need).map(([k,n])=>{if(k==='boya'){const want=G.inv['boya_'+o.color.id]>0;return `<div class="${want?'ok':anyPaint()?'mid':'no'}">${want?'✓':anyPaint()?'~':'✗'} ${o.color.ad} boya</div>`}
const ok=G.inv[k]>=n;return `<div class="${ok?'ok':'no'}">${ok?'✓':'✗'} ${MATS[k].ad}${n>1?' ×'+n:''} <span style="opacity:.6">(${G.inv[k]})</span></div>`}).join('');
if(view!=='home'){const miss=Object.entries(o.p.need).filter(([k,n])=>k==='boya'?G.inv['boya_'+o.color.id]<1:G.inv[k]<n).map(([k])=>k==='boya'?o.color.ad+' boya':MATS[k].ad);
ui.card.innerHTML=`<h4>${o.p.ad}</h4>${miss.length?'<span class="no">Eksik: '+miss.join(', ')+'</span>':'<span class="ok">Malzemeler tamam</span>'}`;show(ui.card,true);return}
ui.card.innerHTML=`<h4>Sipariş #${G.n} · ${o.p.ad}</h4>${o.color?o.color.ad:'Doğal'}${o.style?' · '+o.style:''} · ${o.budget} altın${o.hurry?' · <span class="mid">Acele</span>':''}<div style="margin-top:3px;display:flex;flex-wrap:wrap;column-gap:10px">${rows}</div>`;show(ui.card,true)}
function refresh(){{let e=$('exitC');if(!e){e=document.createElement('button');e.id='exitC';e.innerHTML='<b>✕</b>Çık';(ui.act&&ui.act.parentNode||document.body).appendChild(e);e.onclick=exitTap}show(e,G.phase==='craft');if(G.phase!=='craft'){e.classList.remove('exa');e.innerHTML='<b>✕</b>Çık'}}hud();renderCard();show($('zoom'),zoomable());depoSync();{const ob=$('openB');show(ob,view==='home'&&G.phase!=='craft'&&G.phase!=='result');ob.textContent=G.night?'Akşam':G.open?'Açık':'Kapalı';ob.classList.toggle('cl',G.night||!G.open)}const busy=G.phase==='craft'||G.phase==='result';
document.querySelectorAll('#nav button').forEach(b=>{b.disabled=busy;b.classList.toggle('on',b.dataset.v===view||(b.dataset.v==='home'&&view==='bench')||(b.dataset.v==='depo'&&view==='vitrin'))});
{const vb=$('vitB');show(vb,view==='home'&&!busy);vb.textContent=`Vitrin ${G.stock.length}/${G.owner?'∞':vitCap()}`}
if(view==='vitrin'){if(G.phase==='ordering'&&G.order&&G.order.buy)buyActions();else actions([btn('Yeni ürün yap','l',openFree,G.phase!=='idle'),btn('Dükkâna dön','g',()=>go('home'))])}
else if(G.phase==='active'&&view==='home'){const m=matchStock(G.order),L=hasNeed(G.order.p)?[btn('Tezgâha geç','g',startCraft)]:[btn('Malzeme eksik','l',()=>toast('Eksikleri Pazar, Bahçe ve Atölye\'den tamamla',2000)),btn('İptal et','r',cancelOrder)];if(m)L.push(btn('Raftan ver '+'★'.repeat(m.stars),'l',()=>stockDeliver(m)));actions(L)}
else if(G.phase==='idle'&&view==='home')actions(G.night&&!Q.length?[btn('Günü bitir','g',endDay),btn('Serbest üret','l',openFree)]:[btn('Serbest üret','l',openFree)]);
else if(G.phase==='idle')actions([]);
else if(G.phase==='active')actions([]);}
let switching=false;
function go(v){if(v===view||G.phase==='craft'||switching)return;switching=true;sfx.swoosh();PT.clear();tap=pinch=null;ui.fade.style.opacity=1;setTimeout(()=>{view=v;setLights(v);ZM.z=ZM.t=1;ZM.px=ZM.pz=0;sway=v==='home'?1:0.3;
const T=VIEWS[v];camCur.l.copy(T.l);camCur.p.copy(T.p).sub(T.l).multiplyScalar(1.14).add(T.l);moveCam(T,0.75);
show(ui.bub,v==='home'&&ui.bub.innerHTML&&(G.phase==='ordering'||G.phase==='result'||G.bubOn));refresh();if(G.phase==='ordering'&&v!=='home'&&v!=='vitrin')actions([]);else if(G.phase==='ordering'&&v==='home')orderActions();
tip(null);if(v==='islik')toast('Bir araca ya da etiketine dokun',1400);else if(v==='bahce')toast('Toplamak için dokun<br>Alttan bölge seç',1800);else if(v==='pazar')toast('Bir tezgâha dokun',1300);else if(v==='vitrin')toast(G.stock.length?'Fiyatını değiştirmek için ürüne dokun':'Vitrin boş<br>Yeni ürün yap ile doldur',1700);else if(v==='depo')toast('Liste için raflara dokun',1400);
switching=false;requestAnimationFrame(()=>ui.fade.style.opacity=0)},190)}
let ZONE=0;function setZone(z){if(z===ZONE||switching)return;ZONE=z;sfx.tap();document.querySelectorAll('#zones button').forEach(b=>b.classList.toggle('on',+b.dataset.z===z));const T=VIEWS.bahce;T.p.x=T.l.x=OB+z*11;ZM.z=ZM.t=1;ZM.px=ZM.pz=0;moveCam(T,0.7);
toast(['Çiftlik: süt, tüy, yün, at kılı','Bostan: tarlalar, bitkiler, kovan','Orman: taş, kil, kum, söğüt, boynuz'][z+1],1500)}
document.querySelectorAll('#zones button').forEach(b=>b.onclick=()=>setZone(+b.dataset.z));document.querySelectorAll('#dtabs button').forEach(b=>b.onclick=()=>{sfx.tap();go(b.dataset.v)});
document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>{go(b.dataset.v)});
