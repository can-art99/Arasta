/* ---------- sandıklar: günlük hediyeye ek, altın/elmas/anahtarla açılan sandıklar ---------- */
const CH_COM=['hamderi','pamuk','kutuk','kokboya','civit','ceviz','kaucuk','kurum','yun','recine','papatya','keten','tas','kil','kum','sogut','lavanta','tuy','sut','tohum_pamuk','tohum_papatya','tohum_keten','tohum_civit','tohum_kokboya'];
const CH_RARE=['bakir','demir','celik','koza','ipek','bal','balmumu','kece','pirinc','cam','boynuz','atkili','boya_mor','boya_sari'];
const CHS=[
 {id:'t',ad:'Tahta sandık',m:'ch_2',f:120,d:'4 malzeme · bazen nadir malzeme',com:[4,1,2],rare:[0.2,1,1],gem:[0.05,1,1],gold:[0,0]},
 {id:'z',ad:'Zümrüt sandık',m:'ch_1',g:8,d:'5 malzeme, 2 nadir · elmas şansı',com:[3,2,2],rare:[1,2,1],gem:[0.4,1,3],gold:[40,80]},
 {id:'k',ad:'Kızıl usta sandığı',m:'ch_3',g:20,d:'6 malzeme, 4 nadir · bol elmas şansı · altın',com:[2,3,3],rare:[1,4,2],gem:[0.75,3,8],gold:[150,300]}];
const CHIC={};
function chIcon(c,big){const k=c.id+(big?'b':'');if(CHIC[k])return CHIC[k];if(!GLC[c.m]){glb(c.m,()=>{if(modalMode==='chest')openChests()});return null}
 try{if(big)IR.setSize(256,256);CHIC[k]=snap(GLC[c.m].scene.clone(true))}catch(e){}if(big)IR.setSize(96,96);return CHIC[k]||null}
function chK(){if(!G.chK||typeof G.chK!=='object')G.chK={t:0,z:0,k:0};return G.chK}
/* sipariş teslim edildikçe anahtar */
function chDeliv(){const n=G.st&&G.st.deliv||0;if(!n)return;const K2=chK();if(n%15===0){K2.z++;setTimeout(()=>toast('🗝️ Zümrüt sandık anahtarı kazandın!<br>Pazar › Sandıklar',2200),1800)}else if(n%4===0){K2.t++;setTimeout(()=>toast('🗝️ Tahta sandık anahtarı kazandın!<br>Pazar › Sandıklar',2000),1800)}}
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
function chRoll(c){const got={},add=(k,n)=>{if(!MATS[k])return;got[k]=(got[k]||0)+n};const com=CH_COM.filter(k=>MATS[k]),rare=CH_RARE.filter(k=>MATS[k]);
 for(let i=0;i<c.com[0];i++)add(pick(com),rnd(c.com[1],c.com[2]));
 const [rp,rn,rq]=c.rare;if(rp>=1){for(let i=0;i<rn;i++)add(pick(rare),rnd(1,rq))}else if(Math.random()<rp)add(pick(rare),1);
 const gem=Math.random()<c.gem[0]?rnd(c.gem[1],c.gem[2]):0,gold=c.gold[1]?rnd(c.gold[0],c.gold[1]):0;return {got,gem,gold}}
function chLabel(){const k=chK(),n=k.t+k.z+k.k;return G.daily!==today()?['Sandıklar<small>Günlük hediye hazır!</small>',true]:n?[`Sandıklar<small>🗝️ ${n} anahtar</small>`,true]:['Sandıklar<small>Malzeme · elmas</small>',false]}
function openChests(){const K2=chK(),av=G.daily!==today();let h=`<h3>Sandıklar</h3><p>İçinden malzeme, nadir malzeme ve elmas çıkar. Sipariş teslim ettikçe sandık anahtarı kazanırsın.</p>`;
 h+=`<div class="row"><div class="ic" style="display:grid;place-items:center;font-size:30px">🎁</div><div class="n">Günlük hediye<small>${av?'Hazır! '+((G.streak||0)+1)+'. gün':'Bugün aldın · yarın yine gel'}</small></div>${av?'<button class="btn g" id="chD">Topla</button>':'<b>✓</b>'}</div>`;
 CHS.forEach(c=>{const ic=chIcon(c),key=K2[c.id]||0;
  h+=`<div class="row chr"><div class="ic" style="display:grid;place-items:center;font-size:28px">${ic?`<img src="${ic}" alt="" style="width:100%;height:100%">`:'🧰'}</div><div class="n">${c.ad}<small>${c.d}${key?` · <b>🗝️ ${key}</b>`:''}</small></div><button class="btn ${key?'l':'g'}" data-ch="${c.id}">${key?'Anahtarla aç':c.g?`${c.g} 💎`:c.f+' altın'}</button></div>`});
 h+=`<p class="chint" style="margin-top:6px">Her 4 teslimatta tahta, her 15 teslimatta zümrüt sandık anahtarı. 7 gün üst üste gelirsen zümrüt anahtarı da hediye.</p>`;
 openSheet('chest',h+closeBtn);wire();const d=$('chD');if(d)d.onclick=()=>{sfx.tap();claimDaily()};
 ui.sheet.querySelectorAll('[data-ch]').forEach(b=>b.onclick=()=>chOpen(b.dataset.ch))}
function chOpen(id){const c=CHS.find(x=>x.id===id),K2=chK();if(!c)return;
 if(K2[id]>0){K2[id]--;sfx.tap()}
 else if(c.g){if((G.elmas||0)<c.g){toast(`${c.g} 💎 gerekli`,1300);return}if(!armBuy('ch'+id,`${c.ad} açılsın mı? ${c.g} 💎`))return;G.elmas-=c.g;buyArm=null}
 else{if(G.gold<c.f){toast(`${c.f} altın gerekli`,1300);return}if(!armBuy('ch'+id,`${c.ad} açılsın mı? ${c.f} altın`))return;G.gold-=c.f;buyArm=null}
 const r=chRoll(c);Object.entries(r.got).forEach(([k,n])=>G.inv[k]=(G.inv[k]||0)+n);if(r.gem)G.elmas=(G.elmas||0)+r.gem;if(r.gold){G.gold+=r.gold;if(G.st)G.st.earned+=r.gold}save();hud();refresh();chReveal(c,r)}
function chReveal(c,r){const ic=chIcon(c,true);const items=[];if(r.gem)items.push(`<div class="it r g"><div class="e">💎</div><b>+${r.gem}</b><small>Elmas</small></div>`);if(r.gold)items.push(`<div class="it"><div class="e">🪙</div><b>+${r.gold}</b><small>Altın</small></div>`);
 Object.entries(r.got).sort((a,b)=>CH_RARE.includes(b[0])-CH_RARE.includes(a[0])).forEach(([k,n])=>{const rr=CH_RARE.includes(k);items.push(`<div class="it${rr?' r':''}"><img src="${ICON[k]}" alt=""><b>+${n}</b><small>${MATS[k].ad}${rr?' · nadir':''}</small></div>`)});
 const K2=chK(),again=K2[c.id]>0?'Bir daha aç (🗝️)':c.g?`Bir daha aç · ${c.g} 💎`:`Bir daha aç · ${c.f} altın`;
 openSheet('chopen',`<h3 class="bkh"><button class="bkb" id="mBack" aria-label="Geri">‹</button>${c.ad}</h3><div class="chx" id="chX">${ic?`<img src="${ic}" alt="">`:'<div style="font-size:90px">🧰</div>'}<i class="burst"></i></div><div class="loot hide" id="chL">${items.map((x,i)=>x.replace('class="it','style="animation-delay:'+(i*0.12)+'s" class="it')).join('')}</div><div class="hide" id="chB"><div style="display:flex;gap:8px;justify-content:center;margin-top:12px"><button class="btn g" id="chA">${again}</button><button class="btn l" id="chC">Sandıklar</button></div></div>`);
 $('mBack').onclick=()=>{sfx.tap();openChests()};const x=$('chX');x.classList.add('shake');sfx.tap();
 setTimeout(()=>{if(!sf('sandik',0.8))sfx.fan();x.classList.add('open')},850);
 setTimeout(()=>{x.style.display='none';show($('chL'),true);show($('chB'),true);if(r.gem)setTimeout(()=>sfx.coin(),300)},1350);
 $('chA').onclick=()=>chOpen(c.id);$('chC').onclick=()=>{sfx.tap();openChests()}}
