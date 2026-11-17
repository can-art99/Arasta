/* ---------- bahçe tehlikeleri: hastalık, kuraklık, zararlı, doğal afet ---------- */
const HZ_ANI=['İnek','Koyun','Tavuk','Domuz','Keçi','Tavşan','İpek böceği','At'],HZ_BOS=['Ceviz ağacı','Böğürtlen','Kök boya','Lavanta','Arı kovanı'],
 HZ_ORM=['Taş ocağı','Kil çukuru','Söğüt','Kum','Geyik','Oduncu kulübesi','Kömür ocağı','Balık gölü','Hindistan cevizi'];
const HZT={
 hasta:{ic:'🤒',ad:'Hastalandı',fix:'Veteriner çağır',lim:3*3600,kayip:'öldü',f:p=>Math.max(25,Math.round(p*0.25))},
 kurak:{ic:'🥀',ad:'Kuraklık',fix:'Sula ve gübrele',lim:2*3600,kayip:'kurudu',f:()=>15},
 zarar:{ic:'🐛',ad:'Zararlı',fix:'İlaçla',lim:2*3600,kayip:'çürüdü',f:()=>20},
 mantar:{ic:'🍂',ad:'Mantar hastalığı',fix:'Budama ve ilaç',f:p=>Math.max(20,Math.round(p*0.25))},
 firtina:{ic:'🌪️',ad:'Fırtına hasarı',fix:'Onar',f:p=>Math.max(30,Math.round(p*0.4))},
 yangin:{ic:'🔥',ad:'Orman yangını',fix:'Söndür ve onar',f:p=>Math.max(40,Math.round(p*0.5))},
 sel:{ic:'🌊',ad:'Sel baskını',fix:'Suyu tahliye et',f:p=>Math.max(30,Math.round(p*0.4))},
 heyelan:{ic:'🪨',ad:'Heyelan',fix:'Toprağı temizle',f:p=>Math.max(30,Math.round(p*0.4))}};
const HZ_ROLL=20*60,HZ_P=0.25,HZ_MAX=2;
function hzOf(k){return G.haz&&G.haz[k]}
function hzCost(k){const h=hzOf(k);if(!h)return 0;const L=GLK[k];return HZT[h.t].f(L?L[1]:60)}
function hzLabel(k){const h=hzOf(k);if(!h)return null;const T=HZT[h.t],r=T.lim?h.t0+T.lim-NOW():0;return `${T.ic} ${k[0]==='P'&&k.length<3?'Tarla':k}<small>${T.ad}${T.lim?' · '+fmtT(Math.max(0,r)):''}</small>`}
function hzWarn(){const n=Object.keys(G.haz||{}).length,b=document.querySelector('#nav button[data-v="bahce"]');if(b)b.classList.toggle('warn',n>0)}
/* Rastgele olay: sahip olunan yerlerden birini seç */
function hzPick(){const ins=G.sigorta&&G.sigorta>NOW();if(ins)return null;const P=[];const own=k=>gOpen(k)&&G.gu&&G.gu[k]&&!hzOf(k);
 HZ_ANI.forEach(k=>{if(own(k))P.push([k,'hasta',3])});HZ_BOS.forEach(k=>{if(own(k))P.push([k,'mantar',1])});
 const wt=(typeof wx!=='undefined'?wx:'acik'),dis=wt==='yagmur'?['sel','heyelan','firtina']:wt==='ruzgar'?['firtina','firtina','yangin']:wt==='kar'?['firtina']:['yangin','firtina','sel','heyelan'];
 HZ_ORM.forEach(k=>{if(own(k))P.push([k,pick(dis),1.2])});
 PL.forEach((o,i)=>{const k='P'+i;if(o.own&&o.seed&&o.w&&o.end>NOW()&&!hzOf(k))P.push([k,Math.random()<0.5?'kurak':'zarar',1.5])});
 if(!P.length)return null;let tot=P.reduce((a,p)=>a+p[2],0),r=Math.random()*tot;for(const p of P){r-=p[2];if(r<=0)return p}return P[P.length-1]}
function hzStart(k,t,at){G.haz=G.haz||{};G.haz[k]={t,t0:at||NOW()};const T=HZT[t];if(G.started)toast(`⚠️ ${T.ic} ${k[0]==='P'&&k.length<3?'Bostanda bir tarla':k}: ${T.ad.toLowerCase()}!<br><small>Bahçeye git, ${T.fix.toLowerCase()}${T.lim?' · '+fmtT(T.lim)+' içinde':''}</small>`,3400);sfx.bad&&sfx.bad();hzWarn();save()}
function hzEnd(k,lost){const h=hzOf(k);if(!h)return;delete G.haz[k];if(/^P\d+$/.test(k)){const o=PL[+k.slice(1)];if(o){if(lost){o.seed=null;o.w=false}else if(o.w)o.end+=NOW()-h.t0;plotSync(o)}}
 else if(lost){delete G.gu[k];gSync()}hzWarn();save()}
function hzTick(){if(!G.started||G.first||(G.st.deliv||0)<5||G.phase==='craft')return;G.haz=G.haz||{};
 Object.entries(G.haz).forEach(([k,h])=>{const T=HZT[h.t];if(T.lim&&NOW()>h.t0+T.lim){const nm=k[0]==='P'&&k.length<3?'Tarladaki ürün':k;hzEnd(k,true);G.st.hzLost=(G.st.hzLost||0)+1;toast(`${T.ic} ${nm} ${T.kayip}.${k[0]!=='P'?'<br><small>Yeniden açmak için bahçede satın al</small>':''}`,3200);sfx.bad&&sfx.bad()}});
 if(G.hzLast==null)G.hzLast=NOW();let n=Math.min(6,Math.floor((NOW()-G.hzLast)/HZ_ROLL));if(n<=0)return;
 for(let i=0;i<n;i++){const at=G.hzLast+(i+1)*HZ_ROLL;if(Object.keys(G.haz).length>=HZ_MAX||Math.random()>=HZ_P)continue;const p=hzPick();if(p)hzStart(p[0],p[1],at)}G.hzLast+=n*HZ_ROLL}
/* Tedavi penceresi */
function hzSheet(k){const h=hzOf(k);if(!h)return false;const T=HZT[h.t],c=hzCost(k),r=T.lim?h.t0+T.lim-NOW():0,nm=k[0]==='P'&&k.length<3?'Tarla':k;
 openSheet('hz',`<h3>${T.ic} ${nm}: ${T.ad}</h3><p>${T.lim?`Müdahale etmezsen <b>${fmtT(Math.max(0,r))}</b> sonra ${T.kayip==='öldü'?'hayvan ölür ve yeniden satın alman gerekir':'ürün kaybolur'}.`:'Onarılana kadar buradan malzeme toplanamaz.'}${k[0]==='P'?' Bu sırada büyüme durur.':''}</p>
 <div class="row"><div class="n">${T.fix}<small>Altınla hemen çöz</small></div><button class="btn g" id="hzG" ${G.gold<c?'disabled':''}>${c} altın</button></div>
 <div class="row"><div class="n">Usta dokunuşu<small>Altının yetmezse elmasla çöz</small></div><button class="btn" id="hzE" ${(G.elmas||0)<1?'disabled':''}>1 💎</button></div>`+closeBtn);wire();
 const ok=()=>{hzEnd(k,false);sfx.coin&&sfx.coin();sfx.fan&&sfx.fan();toast(`${T.ic} ${nm} kurtarıldı!`,1600);hud();closeSheet();refresh()};
 $('hzG').onclick=()=>{if(G.gold<c)return;G.gold-=c;ok()};$('hzE').onclick=()=>{if((G.elmas||0)<1)return;G.elmas--;ok()};return true}
/* Sigorta: 5 elmasa 3 gün tehlike yok */
function sigortaRow(){const on=G.sigorta&&G.sigorta>NOW();return `<div class="row"><div class="n">Bahçe sigortası<small>${on?'Koruma açık · '+fmtT(G.sigorta-NOW())+' kaldı':'3 gün boyunca hastalık, kuraklık ve afet olmaz'}</small></div>${on?'<b class="bonc">✓</b>':`<button class="btn g" data-sig ${(G.elmas||0)<5?'disabled':''}>5 💎</button>`}</div>`}
