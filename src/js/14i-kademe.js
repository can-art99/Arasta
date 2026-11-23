/* ---------- Kademe 4-5 ayrıcalıkları ve dükkân büyütme (geç oyun altın harcaması) ---------- */
const TPERK={2:{pay:0,pat:0,txt:'Yeni araçlar ve malzemeler, kervansaray'},3:{pay:0,pat:0,txt:'Yeni araçlar ve malzemeler, takas ve dükkân büyütme'},
 4:{pay:0.08,pat:0.1,txt:'Müşteriler %8 fazla öder, %10 daha sabırlı<br>Dükkânın 3. büyütmesi açıldı'},
 5:{pay:0.15,pat:0.2,txt:'Müşteriler %15 fazla öder, %20 daha sabırlı<br>Atölye %15 hızlı, dükkânın son büyütmesi açıldı'}};
const DUK=[{ad:'Tabela ve cephe',c:2500,t:3},{ad:'Geniş tezgâh',c:6000,t:3},{ad:'Ara kat',c:12000,t:4},{ad:'Çarşı köşesi',c:25000,t:5}];
const payM=()=>1+((TPERK[G.tier]||{}).pay||0)+0.04*(G.dk||0);
const patB=()=>(TPERK[G.tier]||{}).pat||0;
function kademeRows(){const t=G.tier||1,nx=TIERS[t+1],pk=TPERK[t]||{},dk=G.dk||0,d=DUK[dk];
 let h=`<div class="grp">Kademe ve dükkân</div><div class="row"><div class="n">Kademe ${t}${t>=5?' · en üst kademe':''}<small>${nx?`Sonraki kademe: itibar ${G.rep||0} / ${nx}`:'Bütün kademeler açık'}${pk.pay||pk.pat?` · Şu an: ödeme +%${Math.round(pk.pay*100)}, sabır +%${Math.round(pk.pat*100)}`:''}${nx&&TPERK[t+1]&&TPERK[t+1].pay?`<br>Kademe ${t+1}: ${TPERK[t+1].txt.replace(/<br>/g,' · ')}`:''}</small></div></div>`;
 h+=`<div class="row"><div class="n">Dükkân seviyesi ${dk} / ${DUK.length}<small>Her seviye: müşteriler %4 fazla öder, %6 daha sık gelir${dk?` · Şu an +%${dk*4} ödeme`:''}</small></div></div>`;
 if(d){const lk=t<d.t;h+=`<div class="row"><div class="n">${d.ad}<small>${lk?`Kademe ${d.t}'te açılır`:`${d.c} altın · Altının: ${G.gold}`}</small></div><button class="btn g" id="dkB" ${lk||G.gold<d.c?'disabled':''}>Büyüt</button></div>`}
 return h}
function dkBind(){const b=$('dkB');if(!b)return;b.onclick=()=>{const dk=G.dk||0,d=DUK[dk];if(!d||G.tier<d.t||G.gold<d.c)return;G.gold-=d.c;G.dk=dk+1;sfx.coin();sfx.fan();toast(`Dükkân büyüdü: ${d.ad}!<br>Müşteriler artık %${G.dk*4} fazla öder`,2400);save();hud();checkAch();renderMenu()}}
