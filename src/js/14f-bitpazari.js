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
 G.gold-=o.f;(G.store=G.store||[]).push(o.it);S.o.splice(i,1);storeSync();sfx.coin();toast(`${pr(o.it).ad} depoya kondu. Dükkânda «Tamir et» ile onarabilirsin.`,1800);save();refresh();renderMarket()}
/* Tamir, normal kraft sistemiyle tezgâhta yapılır: ürünün "tamir" sürümü sentetik bir ürün olarak açılır */
const REPST={cizik:[{t:'rub',k:'zimpara',ad:'Çizikleri zımparala',to3d:'full'},{t:'rub',k:'cila',ad:'Cilala'},{t:'design',ad:'Son kontrol'}],
 kirik:[{t:'rhythm',k:'yapistir',n:5,ad:'Kırık yeri tutkalla',to3d:'full'},{t:'hold',ad:'Pres ile sıkıştır'},{t:'rub',k:'zimpara',ad:'Ek yerini zımparala'},{t:'design',ad:'Son kontrol'}],
 soluk:[{t:'rub',k:'zimpara',ad:'Kiri ve lekeyi temizle',to3d:'full'},{t:'rub',k:'cila',ad:'Rengini canlandır'},{t:'design',ad:'Son kontrol'}]};
function RP(p,w){const o=Object.create(p);o.ad=p.ad+' tamiri';o.need=Object.assign({},WORN[w].need);o.steps=REPST[w];o.rep=w;o.styles=null;return o}
function openRepairList(){if(fOff('tamir'))return;if(G.phase!=='idle'){toast('Önce sıradaki müşteriyle ilgilen',1500);return}const wl=(G.store||[]).filter(x=>x.worn);
 const h='<h3>🔧 Tamir et</h3><p>Yıpranmış ürünleri tezgâhta onar, yenilenmiş olarak değerinde sat. 2. el ürünleri Pazar → Bit pazarı\'ndan bulabilirsin.</p>'+(wl.length?wl.map(it=>{const p=pr(it),W=WORN[it.worn],miss=Object.entries(W.need).filter(([k,n])=>(G.inv[k]||0)<n);
  return `<div class="dit r${Math.min(3,p.tier||1)}"><div class="dia wd ${W.ov}"><img src="${ICON[it.pid]}" alt=""></div><div class="din"><b>${p.ad}</b>${wornTag(it)}<small>${miss.length?'<span class="no">Eksik: '+needTxt(W.need)+'</span>':'Gerekli: '+needTxt(W.need)+' · '+REPST[it.worn].length+' adım'}</small></div><button class="dbt ${miss.length?'l':''}" data-rp="${it.id}" ${miss.length?'disabled':''}>Tamir et</button></div>`}).join(''):'<p class="dem">Tamir bekleyen ürün yok. Bit pazarından yıpranmış ürün alabilir ya da müşterilerin getirdiği eşyaları onarabilirsin.</p>')+
  `<div style="text-align:center;margin-top:8px"><button class="btn l" id="toBit">Bit pazarına git</button></div>`;
 openSheet('free',h+closeBtn);wire();$('toBit').onclick=()=>{closeSheet();go('pazar');setTimeout(()=>{mTab='bit';renderMarket()},900)};ui.sheet.querySelectorAll('[data-rp]').forEach(b=>b.onclick=()=>startRepair(b.dataset.rp))}
function startRepair(id){if(fOff('tamir'))return;const it=(G.store||[]).find(x=>String(x.id)===String(id));if(!it||!it.worn)return;
 if(G.phase!=='idle'){toast('Önce sıradaki müşteriyle ilgilen',1500);return}const P=RP(pr(it),it.worn);if(!hasNeed(P)){toast('Eksik: '+needTxt(P.need),1600);return}
 show(ui.modal,false);modalMode=null;const run=()=>{G.order={p:P,color:null,style:it.style||null,budget:0,free:true,rep:it.worn,rid:it.id};startCraft()};
 if(view!=='home'){go('home');setTimeout(run,1300)}else run()}
const openRepair=(id)=>startRepair(id);
function repFinish(o){const sc=K.scores.filter(Number.isFinite),work=sc.length?avg(sc):0.5,gain=Math.max(1,Math.round(work*3))-(K.skips?1:0);Q.forEach(x=>x.g.visible=true);
 const g=K.model.g,fr=g.position.clone();view='home';G.st.fix=(G.st.fix||0)+1;
 if(o.rid){const it=(G.store||[]).find(x=>String(x.id)===String(o.rid));if(it){it.stars=clamp(it.stars+Math.max(1,gain),1,5);delete it.worn;delete it.paid;it.ref=1;it.price=sugg(it)}K.res={it}}
 else{const pay=Math.max(Math.round(o.budget*0.4),Math.round(o.budget*(0.55+0.45*work))-(K.skips?Math.round(o.budget*0.15):0));K.res={pay,work}}
 moveCam(VIEWS.home,1.1,()=>{sway=1;repShow(o)});tween(1.1,k=>{g.position.lerpVectors(fr,V(0.25,Y,1.35),k);g.scale.setScalar(1.6-0.6*k)})}
function repShow(o){G.phase='result';refresh();sfx.good();const pct=v=>'%'+Math.round(v*100);const br=K.names.map((n,i)=>`<div class="brk"><span>${n}</span><b>${pct(K.scores[i])}</b></div>`).join('');
 if(o.rid){const it=K.res.it;openSheet('result',`<h3>♻️ ${it?pr(it).ad:''} yenilendi</h3>${it?`<div class="stars">${'★'.repeat(it.stars)}<i>${'★'.repeat(5-it.stars)}</i></div>`:''}<div style="margin-top:8px">${br}</div><div class="tot">Yeni değeri: ${it?it.price:0} altın</div><p>Ürün depo rafında; Depo'dan vitrine koyabilirsin.</p><div style="text-align:center"><button class="btn g" id="repOk">Tamam</button></div>`);
  $('repOk').onclick=()=>repDone(o)}
 else{const pay=K.res.pay;openSheet('result',`<h3>🔧 Tamir teslim</h3><div style="margin-top:8px">${br}</div><div class="tot">Ödeme: +${pay} altın</div><p>${K.res.work>0.75?'Müşteri çok memnun, eşyası yeni gibi oldu!':'Müşteri teşekkür etti.'}</p><div style="text-align:center"><button class="btn g" id="repOk">Tamam</button></div>`);
  $('repOk').onclick=()=>repDone(o)}}
function repDone(o){show(ui.modal,false);modalMode=null;const w=K.work,g=K.model.g;tween(0.3,k=>g.scale.setScalar(Math.max(0.01,0.8*(1-k))),()=>craft.remove(w));
 if(o.rid){G.phase='idle';G.order=null;storeSync();save();refresh();if(Q[0]&&Q[0].at)present(Q[0]);return}
 const c=Q[0],pay=K.res.pay;G.gold+=pay;G.st.earned+=pay;G.rep+=K.res.work>0.75?3:1;sfx.cash();toast(`+${pay} altın · Tamir`,1400);if(c){anim(c,'clap',true);say('Ellerine sağlık usta, yeni gibi olmuş!')}
 G.phase='leaving';G.order=null;actions([]);save();refresh();setTimeout(()=>{G.bubOn=false;say(null);if(c)leave(c)},1300)}
/* müşteri tamir siparişi */
const WVERB={kirik:'kırıldı',cizik:'çizildi',soluk:'soldu'};
function mkRepOrder(){const P=PRODS.filter(unlocked),p=pick(P),w=pick(Object.keys(WORN));return {p:RP(p,w),color:null,style:null,rep:w,budget:Math.max(15,Math.round(p.base*(0.35+Math.random()*0.15)/5)*5),hurry:false}}
function wireBit(){ui.sheet.querySelectorAll('[data-bp]').forEach(b=>b.onclick=()=>bpBuy(+b.dataset.bp));ui.sheet.querySelectorAll('[data-rp]').forEach(b=>b.onclick=()=>openRepair(b.dataset.rp))}
