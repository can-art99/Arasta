/* ---------- bit pazarı: yıpranmış 2. el ürünü ucuza al, atölyede yenile, değerinde sat ---------- */
const WORN={
 cizik:{ad:'Çizik',e:'〰️',ov:'scr',need:{balmumu:1},st:[['🪵 Zımparala','hold',1.6],['✨ Cilala','tap',6]]},
 kirik:{ad:'Kırık',e:'💔',ov:'crk',need:{tutkal:1},st:[['🧴 Tutkalla','hold',1.2],['🗜️ Sıkıştır','tap',5],['🪵 Zımparala','hold',1.2]]},
 soluk:{ad:'Solmuş',e:'🌫️',ov:'fad',need:{balmumu:1},st:[['🧽 Temizle','hold',1.4],['🖌️ Rengi canlandır','tap',6],['✨ Cilala','hold',1]]}};
const BPN=['Hurdacı Necmi','Eskici Halil','Mahalle bit pazarı','Taşınan komşu','Eski konak satışı'];
function bpGen(){const P=PRODS.filter(unlocked),L=[];for(let i=0;i<3;i++){const p=pick(P);if(!p)break;const w=pick(Object.keys(WORN)),it={id:++G.sid,pid:p.id,col:null,style:p.styles?pick(p.styles):null,stars:1+Math.floor(Math.random()*2),worn:w};
 const fix=sugg(Object.assign({},it,{stars:Math.min(5,it.stars+2),worn:null}));L.push({it,from:pick(BPN),f:Math.max(10,Math.round(fix*(0.3+Math.random()*0.12)/5)*5),fix})}return L}
function bpS(){const now=NOW();if(!G.bp||now>G.bp.t)G.bp={t:now+4*3600,o:bpGen()};return G.bp}
const wornTag=it=>it.worn?`<span class="wtag">${WORN[it.worn].e} ${WORN[it.worn].ad}</span>`:it.ref?'<span class="wtag ok">♻️ Yenilenmiş</span>':'';
const needTxt=o=>Object.entries(o).map(([k,n])=>`${MATS[k].ad} ×${n}`).join(', ');
function renderBit(){const S=bpS(),wl=(G.store||[]).filter(x=>x.worn);
 let h=`<p class="chint">Eskicilerden yıpranmış ürünleri ucuza al, atölyede tamir et, yenilenmiş olarak değerinde sat. Tezgâh her 4 saatte yenilenir · <b>${fmtT(S.t-NOW())}</b></p>`;
 if(wl.length)h+=`<div class="dsec">🔧 Tamir bekleyenler <em>${wl.length}</em></div>`+wl.map(it=>{const p=pr(it);return `<div class="dit r${Math.min(3,p.tier||1)}"><div class="dia wd ${WORN[it.worn].ov}"><img src="${ICON[it.pid]}" alt=""></div><div class="din"><b>${p.ad}</b>${wornTag(it)}<small>Gerekli: ${needTxt(WORN[it.worn].need)}</small></div><button class="dbt" data-rp="${it.id}">🔧 Tamir</button></div>`}).join('');
 h+=`<div class="dsec">♻️ Eskici tezgâhı</div>`+(S.o.length?S.o.map((o,i)=>{const p=pr(o.it);return `<div class="dit r${Math.min(3,p.tier||1)}"><div class="dia wd ${WORN[o.it.worn].ov}"><img src="${ICON[o.it.pid]}" alt=""></div><div class="din"><b>${p.ad}</b>${wornTag(o.it)}<span class="dist">${'★'.repeat(o.it.stars)}<i>${'★'.repeat(5-o.it.stars)}</i></span><small>${o.from} · tamirden sonra ~${o.fix} altın</small></div><button class="dbt" data-bp="${i}" ${G.gold<o.f?'disabled':''}>${o.f} altın</button></div>`}).join(''):'<p class="dem">Tezgâh boşaldı, eskiciler yakında yeni mal getirir.</p>');
 return h}
function bpBuy(i){const S=bpS(),o=S.o[i];if(!o||G.gold<o.f)return;if((G.store||[]).length>=stoCap()){toast('Depo ürün rafı dolu',1300);return}
 G.gold-=o.f;(G.store=G.store||[]).push(o.it);S.o.splice(i,1);storeSync();sfx.coin();toast(`${pr(o.it).ad} depoya kondu. Tamir etmeyi unutma!`,1800);save();refresh();renderMarket()}
function openRepair(id,back){const it=(G.store||[]).find(x=>String(x.id)===String(id));if(!it||!it.worn)return;const W=WORN[it.worn],p=pr(it);
 const miss=it.paid?[]:Object.entries(W.need).filter(([k,n])=>(G.inv[k]||0)<n);let si=0,pg=0,done=false;
 const draw=()=>{const tot=W.st.length,f=(si+pg)/tot;
  openSheet('repair',`<h3>🔧 Tamir · ${p.ad}</h3><div class="rpst ${W.ov}" style="--f:${f}"><img src="${ICON[it.pid]}" alt=""><i></i></div>
  <div class="rpstp">${W.st.map((s,j)=>`<span class="${j<si?'ok':j===si?'on':''}">${j<si?'✓':j+1}. ${s[0].replace(/^\S+\s/,'')}</span>`).join('')}</div>
  ${miss.length?`<p class="dem">Gerekli malzeme eksik: <b>${needTxt(W.need)}</b><br>Pazardan alabilirsin.</p>`:done?`<p style="text-align:center;font-weight:800">✨ Yenilendi! ${'★'.repeat(it.stars)}</p>`:
  `<div class="gauge"><div class="gf" id="rpG" style="width:${pg*100}%"></div></div><div style="text-align:center;margin:10px 0"><button class="btn g rpb" id="rpB">${W.st[si][0]}${W.st[si][1]==='hold'?' (basılı tut)':' (dokun)'}</button></div>`}
  <div style="text-align:center"><button class="btn l" id="rpX">← Geri</button></div>`);
  $('rpX').onclick=()=>back?back():(mTab='bit',renderMarket());if(miss.length||done)return;
  const b=$('rpB'),s=W.st[si];let iv=null;const my=si;const set=v=>{if(si!==my||done)return;pg=Math.min(1,v);$('rpG').style.width=pg*100+'%';ui.sheet.querySelector('.rpst').style.setProperty('--f',(si+pg)/tot);if(pg>=1){clearInterval(iv);b.disabled=true;next()}};
  if(s[1]==='hold'){const st=()=>{if(iv)return;sf('sand',0.3)||sfx.sand();iv=setInterval(()=>{set(pg+0.05/s[2]);if(Math.random()<0.25)(sf('sand',0.25)||sfx.sand())},50)},sp=()=>{clearInterval(iv);iv=null};b.onpointerdown=st;b.onpointerup=b.onpointerleave=b.onpointercancel=sp}
  else b.onclick=()=>{sfx.tap();set(pg+1/s[2]);b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop')};
  b.addEventListener('pointerdown',()=>{if(!it.paid){it.paid=1;Object.entries(W.need).forEach(([k,n])=>G.inv[k]-=n);refresh()}},{once:true})};
 const next=()=>{sfx.good();si++;pg=0;if(si>=W.st.length){done=true;it.stars=Math.min(5,it.stars+2);delete it.worn;delete it.paid;it.ref=1;it.price=sugg(it);G.st.fix=(G.st.fix||0)+1;sfx.cash();toast(`♻️ ${p.ad} yenilendi! Değeri ~${it.price} altın`,2200);save();refresh()}setTimeout(draw,250)};
 draw()}
function wireBit(){ui.sheet.querySelectorAll('[data-bp]').forEach(b=>b.onclick=()=>bpBuy(+b.dataset.bp));ui.sheet.querySelectorAll('[data-rp]').forEach(b=>b.onclick=()=>openRepair(b.dataset.rp))}
