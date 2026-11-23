/* ---------- sandıklar: günlük hediyeye ek, altın/elmas/anahtarla açılan sandıklar ---------- */
const CH_COM=['hamderi','pamuk','kutuk','kokboya','civit','ceviz','kaucuk','kurum','yun','recine','papatya','keten','tas','kil','kum','sogut','lavanta','tuy','sut','bakir','demir','koza','bal','balmumu','pirinc','boynuz','atkili','tohum_pamuk','tohum_papatya','tohum_keten','tohum_civit','tohum_kokboya'];
const CH_RARE=['celik','ipek','kece','cam','boya_mor','boya_sari'];
const GEMV=25; /* değer hesabında 1 elmas = 25 altın */
/* com:[adet,min,max] · rare:[şans(1=garanti),adet,max] · gem:[şans,min,max] · gold:[min,max] · ex: özel ödül şansı */
const CHS=[
 {id:'t',ad:'Tahta sandık',m:'ch_2',f:120,d:'4 malzeme · nadir malzeme şansı',com:[4,1,3],rare:[0.25,1,1],gem:[0.05,1,1],gold:[20,40],rep:[0,1]},
 {id:'z',ad:'Zümrüt sandık',m:'ch_1',g:8,d:'4 malzeme, 2 nadir · yüksek elmas şansı · itibar',com:[4,2,4],rare:[1,2,2],gem:[0.6,2,4],gold:[80,150],rep:[2,4],pity:3},
 {id:'k',ad:'Kızıl usta sandığı',m:'ch_3',g:20,d:'5 malzeme, 4 nadir · 6–12 💎 · bol altın ve itibar · özel ödül şansı',com:[5,3,6],rare:[1,4,4],gem:[1,6,12],gold:[300,600],rep:[6,12],ex:0.15}];
/* işe yarayan malzemeler: açık sipariş ve açılmış ürünlerin istedikleri */
function chUseful(){const s=new Set();try{if(G.order&&G.order.p)Object.keys(G.order.p.need).forEach(k=>s.add(k));PRODS.filter(p=>G.unl&&G.unl.includes(p.id)).forEach(p=>Object.keys(p.need).forEach(k=>s.add(k)))}catch(e){}return [...s].filter(k=>MATS[k]&&!CH_RARE.includes(k))}
/* sandıkta çıkabilecek özel ödüller: elmasla alınan alet görünümleri ve dekorlar */
function chExPool(){const a=[];try{Object.entries(SKD).forEach(([c,d])=>d.o.forEach(o=>{if(o.g&&!skOwn(c,o))a.push({t:'sk',c,o})}));Object.entries(DECO).forEach(([k,d])=>d.o.forEach(o=>{if(o.g&&!(G.deco&&G.deco.own[k+'.'+o.id]))a.push({t:'dk',c:k,o})}))}catch(e){}return a}
function chAvg(l){l=l.filter(k=>MATS[k]);return l.reduce((s,k)=>s+mktPrice(k),0)/Math.max(1,l.length)}
function chEV(c){const ac=chAvg(CH_COM),ar=chAvg(CH_RARE),m=(a,b)=>(a+b)/2;let v=c.com[0]*m(c.com[1],c.com[2])*ac+(c.rare[0]>=1?c.rare[1]:c.rare[0])*m(1,c.rare[2])*ar+m(c.gold[0],c.gold[1])+c.gem[0]*m(c.gem[1],c.gem[2])*GEMV+(c.ex||0)*15*GEMV;return Math.floor(v*0.95/10)*10}
function chOdds(c){const t=[];t.push(`${c.com[0]} sıradan malzeme (${c.com[1]}–${c.com[2]} adet, yarısı işine yarayanlardan)`);t.push(c.rare[0]>=1?`${c.rare[1]} nadir malzeme (1–${c.rare[2]} adet)`:`%${Math.round(c.rare[0]*100)} şansla 1 nadir malzeme`);if(c.gold[1])t.push(`${c.gold[0]}–${c.gold[1]} altın`);if(c.rep&&c.rep[1])t.push(c.rep[0]?`${c.rep[0]}–${c.rep[1]} itibar`:`bazen +${c.rep[1]} itibar`);t.push(c.gem[0]>=1?`${c.gem[1]}–${c.gem[2]} 💎 garanti`:`%${Math.round(c.gem[0]*100)} şansla ${c.gem[1]}${c.gem[2]>c.gem[1]?'–'+c.gem[2]:''} 💎`+(c.pity?` · ${c.pity - 1} kez çıkmazsa ${c.pity}.'de en az 2 💎`:''));if(c.ex)t.push(`%${Math.round(c.ex*100)} şansla özel alet görünümü ya da dekor (hepsi sendeyse 10 💎)`);return t}
const CHIC={};
const SVG_GOLD='<svg viewBox="0 0 16 16" style="width:44px;height:44px"><circle cx="8" cy="8" r="7" fill="#e8a915" stroke="#7a5408" stroke-width="1.5"/><circle cx="8" cy="8" r="3.5" fill="none" stroke="#7a5408" stroke-width="1.2"/></svg>';
const SVG_REP='<svg viewBox="0 0 16 16" style="width:44px;height:44px"><path d="M8 1l2.1 4.4 4.8.6-3.5 3.3.9 4.7L8 11.7 3.7 14l.9-4.7L1.1 6l4.8-.6z" fill="#ffcf3a" stroke="#7a5408" stroke-width="1"/></svg>';
const SVG_GEM='<svg viewBox="0 0 16 16" style="width:44px;height:44px"><path d="M4.5 2h7L15 6l-7 8.5L1 6z" fill="#6fd0e8" stroke="#1f5f78" stroke-width="1.2" stroke-linejoin="round"/><path d="M1 6h14M4.5 2L6 6l2 8.5M11.5 2L10 6l-2 8.5M8 2L6 6M8 2l2 4" fill="none" stroke="#1f5f78" stroke-width=".8"/></svg>';
function chIcon(c,big){const k=c.id+(big?'b':'');if(CHIC[k])return CHIC[k];if(!GLC[c.m]){glb(c.m,()=>{if(modalMode==='chest')openChests()});return null}
 try{if(big)IR.setSize(256,256);CHIC[k]=snap(GLC[c.m].scene.clone(true))}catch(e){}if(big)IR.setSize(96,96);return CHIC[k]||null}
function chK(){if(!G.chK||typeof G.chK!=='object')G.chK={t:0,z:0,k:0,p:0};if(G.chK.p==null)G.chK.p=0;return G.chK}
/* sipariş teslim edildikçe anahtar */
function chDeliv(){const n=G.st&&G.st.deliv||0;if(!n)return;const K2=chK();if(n%15===0){K2.z++;setTimeout(()=>toast('🗝️ Zümrüt sandık anahtarı kazandın!<br>Pazar › Sandıklar',2200),1800)}else if(n%4===0){K2.t++;setTimeout(()=>toast('🗝️ Tahta sandık anahtarı kazandın!<br>Pazar › Sandıklar',2000),1800)}}
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
function chRoll(c){const got={},add=(k,n)=>{if(!MATS[k])return;got[k]=(got[k]||0)+n};const com=CH_COM.filter(k=>MATS[k]),rare=CH_RARE.filter(k=>MATS[k]),use=chUseful();
 for(let i=0;i<c.com[0];i++)add(use.length&&i%2===0?pick(use):pick(com),rnd(c.com[1],c.com[2]));
 const [rp,rn,rq]=c.rare;if(rp>=1){for(let i=0;i<rn;i++)add(pick(rare),rnd(1,rq))}else if(Math.random()<rp)add(pick(rare),1);
 let gem=Math.random()<c.gem[0]?rnd(c.gem[1],c.gem[2]):0;const K2=chK();if(c.pity){if(gem)K2.p=0;else if(++K2.p>=c.pity){gem=Math.max(2,rnd(c.gem[1],c.gem[2]));K2.p=0}}
 const gold=c.gold[1]?rnd(c.gold[0],c.gold[1]):0,rep=c.rep?rnd(c.rep[0],c.rep[1]):0;let ex=null;if(c.ex&&Math.random()<c.ex){const pool=chExPool();if(pool.length){ex=pick(pool);if(!G.deco)G.deco={own:{},sel:{}};G.deco.own[(ex.t==='sk'?'sk.':'')+ex.c+'.'+ex.o.id]=1}else gem+=10}
 return {got,gem,gold,ex,rep}}
function chLabel(){const k=chK(),n=k.t+k.z+k.k;return G.daily!==today()?['Sandıklar<small>Günlük hediye hazır!</small>',true]:n?[`Sandıklar<small>🗝️ ${n} anahtar</small>`,true]:['Sandıklar<small>Malzeme · elmas</small>',false]}
function openChests(){const K2=chK(),av=G.daily!==today();let h=`<h3>Sandıklar</h3><p>İçinden malzeme, nadir malzeme ve elmas çıkar. Sipariş teslim ettikçe sandık anahtarı kazanırsın.</p>`;
 h+=`<div class="row"><div class="ic" style="display:grid;place-items:center;font-size:30px">${(()=>{const i=chIcon({id:'gift',m:'chest'});return i?`<img src="${i}" alt="" style="width:100%;height:100%">`:'🎁'})()}</div><div class="n">Günlük hediye<small>${av?'Hazır! '+((G.streak||0)+1)+'. gün':'Bugün aldın · yarın yine gel'}</small></div>${av?'<button class="btn g" id="chD">Topla</button>':'<b>✓</b>'}</div>`;
 CHS.forEach(c=>{const ic=chIcon(c),key=K2[c.id]||0;
  h+=`<div class="row chr"><div class="ic" style="display:grid;place-items:center;font-size:28px">${ic?`<img src="${ic}" alt="" style="width:100%;height:100%">`:'🧰'}</div><div class="n">${c.ad}<small>${c.d} · ort. değer ~${chEV(c)} altın${key?` · <b>🗝️ ${key}</b>`:''}${c.f&&!c.g?` · bugün ${chDay().n}/${CHLIM}`:''}</small></div><button class="btn ${key?'l':'g'}" data-ch="${c.id}" ${!key&&c.f&&!c.g&&chDay().n>=CHLIM?'disabled':''}>${key?'Anahtarla aç':c.g?`${c.g} 💎`:c.f+' altın'}</button></div>`});
 h+=`<details class="chod"><summary>Olasılıklar</summary>${CHS.map(c=>`<b>${c.ad}</b><ul>${chOdds(c).map(x=>`<li>${x}</li>`).join('')}</ul>`).join('')}<small>Değer hesabında 1 💎 = ${GEMV} altın alınır.</small></details>`;h+=`<p class="chint" style="margin-top:6px">Her 4 teslimatta tahta, her 15 teslimatta zümrüt sandık anahtarı. 7 gün üst üste gelirsen zümrüt anahtarı da hediye.</p>`;
 openSheet('chest',h+closeBtn);wire();const d=$('chD');if(d)d.onclick=()=>{sfx.tap();claimDaily()};
 ui.sheet.querySelectorAll('[data-ch]').forEach(b=>b.onclick=()=>chOpen(b.dataset.ch))}
const CHLIM=10;function chDay(){const t=today();if(!G.chD||G.chD.d!==t)G.chD={d:t,n:0};return G.chD}
function chOpen(id){const c=CHS.find(x=>x.id===id),K2=chK();if(!c)return;
 if(K2[id]>0){K2[id]--;sfx.tap()}
 else if(c.g){if((G.elmas||0)<c.g){toast(`${c.g} 💎 gerekli`,1300);return}if(!armBuy('ch'+id,`${c.ad} açılsın mı? ${c.g} 💎`))return;G.elmas-=c.g;buyArm=null}
 else{if(chDay().n>=CHLIM){toast(`Bugün ${CHLIM} tahta sandık aldın<br>Yarın yine gel (anahtarla açmak serbest)`,2200);return}if(G.gold<c.f){toast(`${c.f} altın gerekli`,1300);return}if(!armBuy('ch'+id,`${c.ad} açılsın mı? ${c.f} altın`))return;G.gold-=c.f;chDay().n++;buyArm=null}
 const r=chRoll(c);G.st.chO=(G.st.chO||0)+1;Object.entries(r.got).forEach(([k,n])=>G.inv[k]=(G.inv[k]||0)+n);if(r.gem)G.elmas=(G.elmas||0)+r.gem;if(r.gold){G.gold+=r.gold;if(G.st)G.st.earned+=r.gold}if(r.rep){G.rep+=r.rep;try{if(typeof levelUp==='function')levelUp()}catch(e){}}save();hud();refresh();chReveal(c,r)}
function chReveal(c,r){const ic=chIcon(c,true);const items=[];if(r.gem)items.push(`<div class="it r g"><div class="e">${SVG_GEM}</div><b>+${r.gem}</b><small>Elmas</small></div>`);if(r.gold)items.push(`<div class="it"><div class="e">${SVG_GOLD}</div><b>+${r.gold}</b><small>Altın</small></div>`);if(r.rep)items.push(`<div class="it"><div class="e">${SVG_REP}</div><b>+${r.rep}</b><small>İtibar</small></div>`);
 if(r.ex){const x=r.ex,ic=x.t==='sk'?skIcon(x.c,x.o):null;items.unshift(`<div class="it r x">${ic?`<img src="${ic}" alt="">`:`<div class="e">${x.t==='sk'?SKD[x.c].e:'🖼️'}</div>`}<b>Özel!</b><small>${x.o.ad}${x.t==='sk'?' · Dekorcu\'dan seç':' · dekor'}</small></div>`)}Object.entries(r.got).sort((a,b)=>CH_RARE.includes(b[0])-CH_RARE.includes(a[0])).forEach(([k,n])=>{const rr=CH_RARE.includes(k);items.push(`<div class="it${rr?' r':''}"><img src="${ICON[k]}" alt=""><b>+${n}</b><small>${MATS[k].ad}${rr?' · nadir':''}</small></div>`)});
 const K2=chK(),again=K2[c.id]>0?'Bir daha aç (🗝️)':c.g?`Bir daha aç · ${c.g} 💎`:`Bir daha aç · ${c.f} altın`;
 openSheet('chopen',`<h3 class="bkh"><button class="bkb" id="mBack" aria-label="Geri">‹</button>${c.ad}</h3><div class="chx" id="chX">${ic?`<img src="${ic}" alt="">`:'<div style="font-size:90px">🧰</div>'}<i class="burst"></i></div><div class="loot hide" id="chL">${items.map((x,i)=>x.replace('class="it','style="animation-delay:'+(i*0.12)+'s" class="it')).join('')}</div><div class="hide" id="chB"><div style="display:flex;gap:8px;justify-content:center;margin-top:12px"><button class="btn g" id="chA">${again}</button><button class="btn l" id="chC">Sandıklar</button></div></div>`);
 $('mBack').onclick=()=>{sfx.tap();openChests()};const x=$('chX');x.classList.add('shake');sfx.tap();
 setTimeout(()=>{if(!sf('sandik',0.8))sfx.fan();x.classList.add('open')},850);
 setTimeout(()=>{x.style.display='none';show($('chL'),true);show($('chB'),true);if(r.gem)setTimeout(()=>sfx.coin(),300)},1350);
 $('chA').onclick=()=>chOpen(c.id);$('chC').onclick=()=>{sfx.tap();openChests()}}
