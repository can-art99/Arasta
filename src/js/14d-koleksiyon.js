/* ---------- koleksiyon kartları: ürün, ekipman, malzeme ---------- */
let cTab='p';
const RAR=[null,{ad:'Yaygın',c:'r1',gem:'#c98b4f'},{ad:'Nadir',c:'r2',gem:'#5fb3d0'},{ad:'Efsane',c:'r3',gem:'#c46be0'}];
const stepName=s=>s.ad||((STEPTXT[s.k]||STEPTXT[s.t]||[s.t])[0]);
const cBar=(l,v,mx,ic)=>`<div class="kbar"><span>${ic} ${l}</span><i><b style="width:${Math.round(Math.min(1,v/mx)*100)}%"></b></i><em>${v}</em></div>`;
function matSeen(k){return (G.inv[k]||0)>0||PRODS.some(p=>G.cat[p.id]&&p.need&&p.need[k])}
function matRar(k){const m=MARKET.find(x=>x.k===k);if(m&&m.t)return Math.min(3,m.t);return MATS[k].g==='İşlenmiş'?2:1}
function cardData(t,id){
 if(t==='p'){const p=PRODS.find(x=>x.id===id),i=PRODS.indexOf(p),c=G.cat[id],u=unlocked(p),st=(p.steps||[]).filter(s=>s.t!=='design');
  return {t,id,gem:!!p.gem,no:i+1,tot:PRODS.length,ad:p.ad,img:ICON[id],r:Math.min(3,p.tier||1),own:u,foil:!!(c&&c.best>=5),done:!!c,
   stars:c?c.best:0,chips:[[CN,p.base],['⚒️',st.length]],sub:u?(c?c.n+' kez üretildi':'Henüz üretilmedi'):reqTxt(p),
   back:cBar('Değer',p.base,200,CN)+cBar('Zorluk',st.length,10,'⚒️')+cBar('Ustalık',c?c.n:0,20,'🏅')+
    `<div class="kgrp">Malzemeler</div><div class="kmat">${Object.entries(p.need||{}).map(([k,n])=>`<span>${ICON[k]?`<img src="${ICON[k]}" alt="">`:'🎨'}${MATS[k]?MATS[k].ad:k}${n>1?' ×'+n:''}</span>`).join('')}</div>`+
    `<div class="kgrp">Üretim aşamaları</div><div class="kstp">${st.map((s,j)=>`<span>${j+1}. ${stepName(s)}</span>`).join('')}</div>`}}
 if(t==='e'){const e=EQ.find(x=>x.id===id),i=EQ.indexOf(e),s=eqS(id),mx=EQDUR[s.lv]||20;
  return {t,id,no:i+1,tot:EQ.length,ad:e.ad,img:EQICON[id],emo:e.e,r:s.own?s.lv:(e.buy?3:1),own:!!s.own,foil:s.own&&s.lv>=3,done:!!s.own,stars:0,
   chips:[['⭐',EQLV[s.lv]||'Basit'],['🔧',s.own?s.dur+'/'+mx:'—']],sub:s.own?e.d:('Satın al: '+(e.buy?e.buy[0]+' altın':'')),
   back:cBar('Seviye',s.lv,3,'⭐')+cBar('Dayanıklılık',s.own?s.dur:0,mx,'🔧')+cBar('İş kalitesi',Math.round((eqMul(id)-1)*100),50,'✨')+`<div class="kgrp">Ne işe yarar</div><p class="kd">${e.d}</p>`+
    `<div class="kgrp">Kullanıldığı ürünler</div><div class="kstp">${PRODS.filter(p=>(p.tools||[]).includes(id)||(p.steps||[]).some(q=>q.tool===id)).slice(0,12).map(p=>`<span>${p.ad}</span>`).join('')||'<span>Tüm temel işler</span>'}</div>`}}
 const m=MATS[id],ks=Object.keys(MATS),i=ks.indexOf(id),seen=matSeen(id),used=PRODS.filter(p=>p.need&&p.need[id]);
 return {t:'m',id,no:i+1,tot:ks.length,ad:m.ad,img:ICON[id],r:matRar(id),own:seen,foil:(G.inv[id]||0)>=20,done:seen,stars:0,
  chips:[['📦',G.inv[id]||0],['🧩',used.length]],sub:m.g,
  back:cBar('Stok',G.inv[id]||0,20,'📦')+cBar('Kullanım',used.length,10,'🧩')+`<div class="kgrp">Tür</div><p class="kd">${m.g}</p><div class="kgrp">Kullanıldığı ürünler</div><div class="kstp">${used.map(p=>`<span>${p.ad}</span>`).join('')||'<span>—</span>'}</div>`}}
function cardFront(d,big){const R=RAR[d.r]||RAR[1],lk=!d.own;
 const art=d.img?`<img src="${d.img}" alt="">`:`<div class="kemo">${d.emo||'❔'}</div>`;
 return `<div class="kc ${R.c}${d.foil?' foil':''}${lk?' lk':''}${big?' big':''}" data-ck="${d.t}:${d.id}"><div class="kci">
  <div class="ktop"><span>#${String(d.no).padStart(2,'0')}${d.gem?' 💎':''}</span><i style="background:${R.gem}" title="${R.ad}"></i></div>
  <div class="kart">${art}${lk?'<b class="klock">🔒</b>':''}</div>
  <div class="knm">${lk&&d.t!=='e'?'???':d.ad}</div>
  ${d.stars?`<div class="kst">${'★'.repeat(d.stars)}<span>${'★'.repeat(5-d.stars)}</span></div>`:''}
  <div class="kch">${d.chips.map(c=>`<span>${c[0]} ${lk&&d.t!=='e'?'?':c[1]}</span>`).join('')}</div>
  ${big?`<div class="ksub">${R.ad} · ${d.sub}</div>`:''}</div></div>`}
function renderColl(){const L=cTab==='p'?PRODS.map(p=>cardData('p',p.id)):cTab==='e'?EQ.map(e=>cardData('e',e.id)):Object.keys(MATS).map(k=>cardData('m',k));
 const own=L.filter(d=>d.done).length,fo=L.filter(d=>d.foil).length;
 return `<div class="ctabs">${[['p','🏺 Ürünler'],['e','🛠️ Ekipman'],['m','🌿 Malzeme']].map(t=>`<button class="${cTab===t[0]?'on':''}" data-ct="${t[0]}">${t[1]}</button>`).join('')}</div>
 <div class="cprog"><div><span><b>${own}</b>/${L.length} toplandı</span><span class="cfo">✦ ${fo} parlak</span></div><i><b style="width:${Math.round(own/L.length*100)}%"></b></i></div>
 <p class="chint">${cTab==='p'?'5 yıldız alınca kart parlak olur.':cTab==='e'?'Aleti geliştirdikçe kartın çerçevesi yükselir.':'20 tane biriktirince malzeme kartı parlar.'} Kartın detayını görmek için dokun.</p>
 <div class="cgrid">${L.map(d=>cardFront(d)).join('')}</div>`}
function wireColl(){ui.sheet.querySelectorAll('[data-ct]').forEach(b=>b.onclick=()=>{cTab=b.dataset.ct;sfx.tap();renderMenu()});
 ui.sheet.querySelectorAll('.cgrid [data-ck]').forEach(b=>b.onclick=()=>{const [t,id]=b.dataset.ck.split(':');openCard(t,id)})}
function openCard(t,id){const d=cardData(t,id);sfx.swoosh();
 openSheet('card',`<div class="kflip"><div class="kfi">${cardFront(d,true)}<div class="kc kback ${(RAR[d.r]||RAR[1]).c}"><div class="kci"><div class="kbh">${d.own||d.t==='e'?d.ad:'???'}</div>${d.own||d.t==='e'?d.back:`<p class="kd">Bu kart henüz kilitli.<br><br>${d.sub}</p>`}</div></div></div></div>
 <p class="chint" style="text-align:center">Kartı çevirmek için dokun</p>${t==='p'&&PRODS.find(x=>x.id===id).gem&&!(G.gemR&&G.gemR[id])?`<div style="text-align:center;margin-top:8px"><button class="btn g" id="gemU" ${(G.elmas||0)<PRODS.find(x=>x.id===id).gem?'disabled':''}>💎 ${PRODS.find(x=>x.id===id).gem} ile nadir tarifi aç</button></div>`:''}<div style="margin-top:8px;text-align:center"><button class="btn l" id="cBack">← Koleksiyon</button> <button class="btn g" data-close>Kapat</button></div>`);
 wire();const f=ui.sheet.querySelector('.kfi');f.onclick=()=>{f.classList.toggle('fl');sfx.swoosh()};
 const card=ui.sheet.querySelector('.kc.big');ui.sheet.querySelector('.kflip').onpointermove=e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-0.5,y=(e.clientY-r.top)/r.height-0.5;ui.sheet.querySelector('.kflip').style.setProperty('--rx',(-y*10)+'deg');ui.sheet.querySelector('.kflip').style.setProperty('--ry',(x*12)+'deg');card.style.setProperty('--fx',(x+0.5)*100+'%')};
 $('cBack').onclick=()=>{menuTab='defter';renderMenu()};const gu=$('gemU');if(gu)gu.onclick=e=>{e.stopPropagation();const p=PRODS.find(x=>x.id===id);if((G.elmas||0)<p.gem)return;G.elmas-=p.gem;(G.gemR=G.gemR||{})[id]=1;sfx.fan&&sfx.fan();toast(`💎 ${p.ad} tarifi açıldı!`,1800);hud();save();openCard(t,id)}}
