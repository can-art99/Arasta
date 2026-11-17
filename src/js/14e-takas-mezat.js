/* ---------- pazar: takas (barter) ve mezat (açık artırma) ---------- */
const TKN=['Seyyah Kemal','Bakırcı Nuri','Dokumacı Hatice','Kervancı Rıza','Aktar Saliha','Çiftçi Dursun','Ormancı Yusuf','Nalbant Ziya'];
const MZN=['Koleksiyoncu Selim','Hanım Ağa Nezihe','Tüccar Ömer','Antikacı Leman','Kaptan Faruk','Esnaf Fikret','Ressam Nur','Mimar Taner','Doktor Ayla','Hoca Rüstem'];
const matVal=k=>{const m=MARKET.find(x=>x.k===k);if(m)return m.f;const c=CROPS&&CROPS[k];if(c)return c.f;return MATS[k]&&MATS[k].g==='İşlenmiş'?24:MATS[k]&&MATS[k].g==='Yardımcı'?10:14};
const usedMats=()=>[...new Set(PRODS.filter(unlocked).flatMap(p=>Object.keys(p.need||{})))].filter(k=>MATS[k]);
function tkGen(){const used=usedMats(),have=Object.keys(G.inv).filter(k=>MATS[k]&&G.inv[k]>=2),L=[];
 for(let i=0;i<4;i++){const id=Date.now()+i;
  const prods=[...G.stock,...(G.store||[])].filter(x=>!x.worn);
  if(i===3&&prods.length){const it=pick(prods),p=pr(it),V=Math.round(p.base*(0.6+it.stars*0.14)*1.2),gk=pick(used),n=Math.max(2,Math.round(V/matVal(gk))),gk2=pick(used.filter(x=>x!==gk))||gk;
   L.push({id,ad:pick(TKN),gp:it.pid,gs:it.stars,get:{[gk]:Math.ceil(n*0.6),[gk2]:Math.max(1,Math.floor(n*0.5))}});continue}
  const gv=pick(have.length&&Math.random()<0.75?have:used);let gt=pick(used.filter(x=>x!==gv));if(!gt)continue;
  const gn=2+Math.floor(Math.random()*3),val=gn*matVal(gv)*(1.15+Math.random()*0.25),tn=Math.max(1,Math.round(val/matVal(gt)));
  L.push({id,ad:pick(TKN),give:{[gv]:gn},get:{[gt]:tn}})}
 return L}
function tkS(){const now=NOW();if(!G.tks||now>G.tks.t){G.tks={t:now+6*3600,o:tkGen()}}return G.tks}
const bundle=o=>Object.entries(o).map(([k,n])=>`<span class="tkm">${img(k)}<b>×${n}</b><small>${MATS[k].ad}</small></span>`).join('');
function renderTakas(){const S=tkS();
 return `<p class="chint">Gezgin tüccarlar mal karşılığı mal ister. Takaslar her 6 saatte yenilenir · Yeni takas: <b>${fmtT(S.t-NOW())}</b></p>`+(S.o.length?S.o.map(o=>{
  let ok,give;if(o.gp){const it=[...G.stock,...(G.store||[])].find(x=>x.pid===o.gp&&x.stars>=o.gs&&!x.worn);ok=!!it;const p=PRODS.find(x=>x.id===o.gp);give=`<span class="tkm">${ICON[o.gp]?`<img src="${ICON[o.gp]}" alt="">`:''}<b>${'★'.repeat(o.gs)}</b><small>${p?p.ad:''}</small></span>`}
  else{ok=Object.entries(o.give).every(([k,n])=>(G.inv[k]||0)>=n);give=bundle(o.give)}
  return `<div class="tkc"><div class="tkh">🧳 ${o.ad}</div><div class="tkb"><div class="tks">${give}</div><div class="tka">⇄</div><div class="tks get">${bundle(o.get)}</div></div><button class="dbt ${ok?'':'l'}" data-tk="${o.id}" ${ok?'':'disabled'}>${ok?'Takas et':'Elinde yok'}</button></div>`}).join(''):'<p class="dem">Bugünlük takas bitti.</p>')}
function doTakas(id){const S=tkS(),i=S.o.findIndex(o=>String(o.id)===String(id));if(i<0)return;const o=S.o[i],gn=Object.values(o.get).reduce((a,b)=>a+b,0);
 if(o.gp){const it=[...G.stock,...(G.store||[])].find(x=>x.pid===o.gp&&x.stars>=o.gs&&!x.worn);if(!it)return;if(depoFull(gn))return;G.stock=G.stock.filter(x=>x!==it);G.store=(G.store||[]).filter(x=>x!==it);vitrinSync();storeSync()}
 else{if(!Object.entries(o.give).every(([k,n])=>(G.inv[k]||0)>=n))return;const gv=Object.values(o.give).reduce((a,b)=>a+b,0);if(gn>gv&&depoFull(gn-gv))return;Object.entries(o.give).forEach(([k,n])=>G.inv[k]-=n)}
 Object.entries(o.get).forEach(([k,n])=>G.inv[k]=(G.inv[k]||0)+n);S.o.splice(i,1);G.st.tks=(G.st.tks||0)+1;sfx.cash();toast(`${o.ad} ile takas yapıldı`,1400);save();refresh();renderMarket()}

/* Mezat: ürünü açık artırmaya çıkar; teklifler süre boyunca yükselir, sonunda en yüksek teklif kazanır */
const MZD=240;
function mzPlan(it){const p=pr(it),V=p.base*(0.55+it.stars*0.15)*(SEAS[season()].p.includes(p.id)?1.2:1),fin=Math.round(V*(0.95+Math.random()*0.55)),n=4+Math.floor(Math.random()*5),b=[];let v=Math.round(V*0.45);
 for(let i=0;i<n;i++){const t=Math.round(MZD*(0.08+0.9*Math.pow((i+1)/n,1.4))*(0.92+Math.random()*0.08));v=i===n-1?fin:Math.max(v+3,Math.round(v+(fin-v)*(0.25+Math.random()*0.35)));b.push({t,v,ad:pick(MZN)})}
 return b.sort((a,c)=>a.t-c.t)}
const mzMax=()=>G.tier>=3?2:1;
function mzList(){if(!G.mz)G.mz=[];return G.mz}
function mzStart(src,i){const arr=src==='v'?G.stock:G.store,it=arr&&arr[i];if(!it)return;if(mzList().length>=mzMax()){toast(`Aynı anda en fazla ${mzMax()} mezat`,1400);return}
 arr.splice(i,1);vitrinSync();storeSync();mzList().push({it,s:NOW(),e:NOW()+MZD,b:mzPlan(it)});sfx.bell();toast(`${pr(it).ad} mezata çıktı!`,1400);save();refresh();renderMarket()}
const mzCur=m=>{const el=NOW()-m.s;return m.b.filter(x=>x.t<=el)};
function mzEnd(m,early){const c=mzCur(m),top=c[c.length-1];G.mz=mzList().filter(x=>x!==m);
 if(!top){(G.store=G.store||[]).push(m.it);storeSync();toast(`${pr(m.it).ad} için teklif gelmedi, depoya döndü`,2000)}
 else{const fee=Math.round(top.v*0.05),net=top.v-fee;G.gold+=net;G.st.earned+=net;G.st.sold++;G.st.mzs=(G.st.mzs||0)+1;sfx.cash();toast(`🔨 Satıldı! ${top.ad}<br>+${net} altın <small>(komisyon ${fee})</small>`,2600);notify('Mezat',`${pr(m.it).ad} ${top.v} altına satıldı`)}
 save();refresh();if(modalMode==='market'&&mTab==='mezat')renderMarket()}
let mzLT=0;function mzTick(){const L=mzList();L.slice().forEach(m=>{if(NOW()>=m.e)mzEnd(m)});
 if(modalMode==='market'&&mTab==='mezat'&&Date.now()-mzLT>900){mzLT=Date.now();L.forEach((m,i)=>{const el=$('mz'+i);if(el)el.innerHTML=mzLive(m)});mzWire()}}
function mzLive(m){const c=mzCur(m),top=c[c.length-1],left=Math.max(0,m.e-NOW()),f=1-left/MZD;
 return `<div class="mzt"><span>⏳ ${fmtT(left)}</span><i><b style="width:${Math.round(f*100)}%"></b></i></div><div class="mzb"><small>En yüksek teklif</small><b>${top?CN+' '+top.v:'—'}</b><small>${top?top.ad:'Teklif bekleniyor…'}</small></div>
 <div class="mzl">${c.slice(-4).reverse().map((x,j)=>`<span class="${j?'':'n'}">${x.ad} · ${x.v}</span>`).join('')}</div>${top?`<button class="dbt" data-mze="${mzList().indexOf(m)}">Hemen sat · ${top.v}</button>`:''}`}
function renderMezat(){const L=mzList(),items=[...G.stock.map((it,i)=>['v',i,it]),...(G.store||[]).map((it,i)=>['s',i,it]).filter(x=>!x[2].worn)];
 let h=`<p class="chint">Ürününü mezata çıkar, koleksiyoncular ${Math.round(MZD/60)} dakika boyunca teklif versin. Sezonun gözde ürünleri daha çok para eder. Komisyon %5.</p>`;
 h+=L.map((m,i)=>{const p=pr(m.it);return `<div class="mzc r${Math.min(3,p.tier||1)}"><div class="mzh"><div class="dia"><img src="${ICON[m.it.pid]}" alt=""></div><div><b>${p.ad}</b><span class="dist">${'★'.repeat(m.it.stars)}<i>${'★'.repeat(5-m.it.stars)}</i></span><small>Taban değer ~${p.base}</small></div><span class="mzlv">🔴 CANLI</span></div><div id="mz${i}">${mzLive(m)}</div></div>`}).join('');
 h+=`<div class="dsec">Mezata çıkarılabilir <em>${L.length}/${mzMax()} mezat</em></div>`;
 h+=items.length?items.map(([s,i,it])=>{const p=pr(it);return `<div class="dit r${Math.min(3,p.tier||1)}"><div class="dia"><img src="${ICON[it.pid]}" alt=""></div><div class="din"><b>${p.ad}</b><small>${s==='v'?'Vitrinde':'Depoda'} · ${desc(it)}</small><span class="dist">${'★'.repeat(it.stars)}<i>${'★'.repeat(5-it.stars)}</i></span></div><button class="dbt ${L.length<mzMax()?'':'l'}" data-mz="${s}:${i}" ${L.length<mzMax()?'':'disabled'}>🔨 Mezata</button></div>`}).join(''):'<p class="dem">Satılacak ürün yok. Serbest üretimle ürün yap.</p>';
 return h}
function wireTM(){ui.sheet.querySelectorAll('[data-tk]').forEach(b=>b.onclick=()=>doTakas(b.dataset.tk));
 ui.sheet.querySelectorAll('[data-mz]').forEach(b=>b.onclick=()=>{const [s,i]=b.dataset.mz.split(':');mzStart(s,+i)});
 mzWire()}
function mzWire(){ui.sheet.querySelectorAll('[data-mze]').forEach(b=>b.onclick=()=>{const m=mzList()[+b.dataset.mze];if(m)mzEnd(m,true)})}
