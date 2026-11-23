/* ---------- Kademe 4-5 ayrıcalıkları ve dükkân büyütme (geç oyun altın harcaması) ---------- */
/* kademe ayrıcalıkları (birikimli değerler): pay=ödeme, pat=sabır, spd=atölye hızı, gem=elmas şansı */
const TPERK={1:{li:['Dükkân, bahçe ve atölye']},2:{li:['Kervansaray','Çırak, çiftçi ve çoban yardımcıları']},3:{li:['Takas tezgâhında 2 teklif','Dükkân büyütme (1-2. seviye)']},
 4:{pay:0.08,pat:0.1,li:['Dükkân büyütme 3. seviye']},5:{pay:0.15,pat:0.2,spd:0.15,li:['Dükkân büyütme son seviye']},
 6:{pay:0.18,pat:0.25,spd:0.15,gem:0.25,li:[]},7:{pay:0.21,pat:0.3,spd:0.2,gem:0.25,li:[]},8:{pay:0.24,pat:0.3,spd:0.2,gem:0.5,li:[]},
 9:{pay:0.27,pat:0.35,spd:0.25,gem:0.5,li:[]},10:{pay:0.3,pat:0.4,spd:0.25,gem:1,li:['Çarşının en itibarlı esnafı']}};
const tpk=t=>TPERK[Math.min(TMAX,t||1)]||{};
function perkLi(t){const p=tpk(t),q=tpk(t-1),o=[];if((p.pay||0)>(q.pay||0))o.push(`Müşteriler %${Math.round(p.pay*100)} fazla öder`);if((p.pat||0)>(q.pat||0))o.push(`Müşteriler %${Math.round(p.pat*100)} daha sabırlı`);if((p.spd||0)>(q.spd||0))o.push(`Atölye %${Math.round(p.spd*100)} daha hızlı`);if((p.gem||0)>(q.gem||0))o.push(`Elmas düşme şansı +%${Math.round(p.gem*100)}`);return o.concat(p.li||[])}
const spdB=()=>tpk(G.tier).spd||0,gemB=()=>tpk(G.tier).gem||0;
const DUK=[{ad:'Tabela ve cephe',c:2500,t:3},{ad:'Geniş tezgâh',c:6000,t:3},{ad:'Ara kat',c:12000,t:4},{ad:'Çarşı köşesi',c:25000,t:5}];
const payM=()=>1+(tpk(G.tier).pay||0)+0.04*(G.dk||0);
const patB=()=>tpk(G.tier).pat||0;
function kademeRows(){const t=G.tier||1,nx=TIERS[t+1],pk=TPERK[t]||{},dk=G.dk||0,d=DUK[dk];
 let h=`<div class="grp">Kademe ve dükkân</div><div class="row"><div class="n">Kademe ${t}${t>=TMAX?' · en üst kademe':''}<small>${nx?`Sonraki kademe: itibar ${G.rep||0} / ${nx}`:'Bütün kademeler açık'}${pk.pay||pk.pat?` · Şu an: ödeme +%${Math.round(pk.pay*100)}, sabır +%${Math.round(pk.pat*100)}`:''}${nx?`<br>Kademe ${t+1}: ${perkLi(t+1).join(' · ')}`:''}</small></div></div>`;
 h+=`<div class="row"><div class="n">Dükkân seviyesi ${dk} / ${DUK.length}<small>Her seviye: müşteriler %4 fazla öder, %6 daha sık gelir${dk?` · Şu an +%${dk*4} ödeme`:''}</small></div></div>`;
 if(d){const lk=t<d.t;h+=`<div class="row"><div class="n">${d.ad}<small>${lk?`Kademe ${d.t}'te açılır`:`${d.c} altın · Altının: ${G.gold}`}</small></div><button class="btn g" id="dkB" ${lk||G.gold<d.c?'disabled':''}>Büyüt</button></div>`}
 return h}
function dkBind(){const b=$('dkB');if(!b)return;b.onclick=()=>{const dk=G.dk||0,d=DUK[dk];if(!d||G.tier<d.t||G.gold<d.c)return;G.gold-=d.c;G.dk=dk+1;sfx.coin();sfx.fan();toast(`Dükkân büyüdü: ${d.ad}!<br>Müşteriler artık %${G.dk*4} fazla öder`,2400);save();hud();checkAch();renderMenu()}}
/* kademe ödülleri: altın + elmas + sandık anahtarı */
const TREW={2:{g:300,e:5,k:['t',1]},3:{g:800,e:8,k:['t',2]},4:{g:2000,e:12,k:['z',1]},5:{g:4000,e:15,k:['z',1]},6:{g:5000,e:18,k:['z',2]},7:{g:6500,e:20,k:['k',1]},8:{g:8000,e:25,k:['z',2]},9:{g:10000,e:30,k:['k',1]},10:{g:15000,e:40,k:['k',2]}};
const KADN={t:'Tahta',z:'Zümrüt',k:'Kızıl usta'};
const trTxt=r=>`+${r.g} altın · +${r.e} 💎 · ${r.k[1]} ${KADN[r.k[0]]} sandık anahtarı`;
const tGot=t=>Array.isArray(G.tC)&&G.tC.includes(t);
function tierReady(){const o=[];for(let t=2;t<=(G.tier||1);t++)if(TREW[t]&&!tGot(t))o.push(t);return o}
function tClaim(t){const r=TREW[t];if(!r||(G.tier||1)<t||tGot(t))return;if(!Array.isArray(G.tC))G.tC=[];G.tC.push(t);G.gold+=r.g;if(G.st)G.st.earned+=r.g;G.elmas=(G.elmas||0)+r.e;const K2=chK();K2[r.k[0]]=(K2[r.k[0]]||0)+r.k[1];sfx.coin();sfx.fan();toast(`Kademe ${t} ödülü<br><b>${trTxt(r)}</b>`,2600);save();hud();openRepPass()}
