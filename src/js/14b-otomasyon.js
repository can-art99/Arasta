/* ---------- otomasyon: traktör (bostan) ve çırak (atölye) · mod: oto / kosul / pasif ---------- */
const OTO_P=1800,OTO_COST={cirak:100,trak:200},OTO_AD={oto:'Oto',kosul:'Koşullu',pasif:'Pasif'};
function otoMode(k){return G[k]?(G[k+'M']||'oto'):'pasif'}
function otoLeft(k){return Math.max(0,OTO_P-(NOW()-(G[k+'Last']||0)))}
/* Bekleyen siparişlerin eksik malzemeleri; atölyede üretilebilenler tarifleriyle (make), kalanı ham olarak (raw) döner */
function otoNeeds(){const want={},make=[],raw={},used={};Q.forEach(c=>{const o=c.order;if(!o||o.buy||!o.p||!o.p.need)return;Object.entries(o.p.need).forEach(([k,n])=>{if(k==='boya'){if(!o.color)return;k='boya_'+o.color.id}want[k]=(want[k]||0)+n})});
 const go=(k,n,d)=>{const have=Math.max(0,(G.inv[k]||0)-(used[k]||0));used[k]=(used[k]||0)+Math.min(have,n);const lack=n-have;if(lack<=0)return;let rec=null;
  if(d<3)for(const s of ST){if(!stOwned(s)||G.tier<s.tier)continue;const ok=r=>r.out[k]&&(!r.tier||G.tier>=r.tier),r=s.rec.find(r=>ok(r)&&hasAll(r.in))||s.rec.find(ok);if(r){rec={s,r};break}}
  if(rec){const times=Math.ceil(lack/rec.r.out[k]);make.push({s:rec.s,r:rec.r,k,times});Object.entries(rec.r.in).forEach(([i,m])=>go(i,m*times,d+1))}else raw[k]=(raw[k]||0)+lack};
 Object.entries(want).forEach(([k,n])=>go(k,n,0));return {raw,make}}
/* Bir otomasyonun tur zamanlaması: kaçırılan turları anında işler, son turun eylemlerini döndürür */
function otoRounds(k,plan){if(G[k+'Last']==null)G[k+'Last']=NOW()-OTO_P;let n=Math.floor((NOW()-G[k+'Last'])/OTO_P);if(n<=0)return [];if(n>48){G[k+'Last']=NOW()-48*OTO_P;n=48}
 for(let i=1;i<n;i++)plan(G[k+'Last']+i*OTO_P).forEach(a=>a.fn());G[k+'Last']=NOW();return plan(NOW())}

/* ---- traktör ---- */
let TRB=null,trN=0;
function plotSow(o,k,t){if(!o.own||o.seed||!(G.inv[k]>0))return false;G.inv[k]--;o.seed=k;o.w=true;o.dur=CROPS[k].s;o.end=t+o.dur;plotSync(o);return true}
function plotHarv(o){const k=o.seed,c=CROPS[k],cn=c.n*(o.m||1);G.inv[c.out]+=cn;G.st.harv++;G.st.coll+=cn;o.last=k;o.seed=null;o.w=false;plotSync(o);return k}
/* Tedarikçi ve tohumcu stoğu: 12 saatte bir yenilenir */
const STK_P=12*3600,STK_SEED={tohum_pamuk:12,tohum_civit:10,tohum_kokboya:10,tohum_papatya:10,tohum_keten:8},STK_SUP=3;
function stk(){if(!G.stk||NOW()-(G.stk.t||0)>=STK_P){const t0=G.stk&&G.stk.t?G.stk.t+Math.floor((NOW()-G.stk.t)/STK_P)*STK_P:NOW();G.stk={t:t0,s:{...STK_SEED},p:SUPPLY.map(()=>STK_SUP)}}return G.stk}
function stkLeft(){return fmtT(Math.max(0,stk().t+STK_P-NOW()))}
/* Oto modda sıradaki tohum: eldeki tohumlar arasında döner; hiç yoksa Tohumcu fiyatından satın alır */
function trakSeed(dry){const L=Object.keys(CROPS).filter(k=>!CROPS[k].t||G.tier>=CROPS[k].t),n=L.length;for(let i=0;i<n;i++){const j=((G.trakI||0)+i)%n,k=L[j];if(G.inv[k]>0||(G.gold>=CROPS[k].f&&(stk().s[k]||0)>0)){if(dry)return k;if(!(G.inv[k]>0)){G.gold-=CROPS[k].f;stk().s[k]--;G.inv[k]=(G.inv[k]||0)+1;hud()}G.trakI=j+1;return k}}return null}
function trakPlan(t,kos){const A=[],rdy=o=>o.own&&o.seed&&o.w&&o.end<=t&&!hzOf('P'+PL.indexOf(o));
 if(!kos){PL.forEach(o=>{if(!o.own)return;if(o.seed&&!o.w)A.push({o,fn:()=>{if(o.seed&&!o.w){o.w=true;o.end=t+o.dur;plotSync(o)}}});else if(rdy(o))A.push({o,fn:()=>{if(rdy(o)){plotHarv(o);const k=trakSeed();if(k)plotSow(o,k,t)}}});else if(!o.seed&&trakSeed(1))A.push({o,fn:()=>{if(!o.seed){const k=trakSeed();if(k)plotSow(o,k,t)}}})});return A}
 const raw=otoNeeds().raw;Object.keys(raw).forEach(m=>{const sk=Object.keys(CROPS).find(k=>CROPS[k].out===m);if(!sk)return;let lack=raw[m];
  PL.forEach(o=>{if(!o.own||o.seed!==sk)return;lack-=CROPS[sk].n;if(!o.w)A.push({o,fn:()=>{if(o.seed&&!o.w){o.w=true;o.end=NOW()+o.dur;plotSync(o)}}});else if(rdy(o))A.push({o,fn:()=>{if(rdy(o))plotHarv(o)}})});
  let sd=G.inv[sk]||0;PL.forEach(o=>{if(lack>0&&sd>0&&o.own&&!o.seed&&!A.some(a=>a.o===o)){lack-=CROPS[sk].n;sd--;A.push({o,fn:()=>plotSow(o,sk,NOW())})}})});return A}
function trakFlush(){const B=TRB;if(!B)return;TRB=null;B.q.forEach(a=>a.fn());B.tg.position.copy(B.home);B.tg.rotation.y=Math.PI;save()}
function trakDrive(acts){const tg=TRACT.tg,B=TRB={q:acts.slice(),tg,home:tg.userData.home||(tg.userData.home=tg.position.clone())};
 const drive=(to,cb)=>{const fr=tg.position.clone(),d=fr.distanceTo(to),dur=Math.max(0.25,d/1.1),r0=tg.rotation.y;let da=Math.atan2(to.x-fr.x,to.z-fr.z)-r0;da=Math.atan2(Math.sin(da),Math.cos(da));
  tweenLin(dur,u=>{if(TRB!==B)return;const e=u*u*(3-2*u);tg.position.lerpVectors(fr,to,e);tg.position.y=Math.abs(Math.sin(tt*16))*0.012;tg.rotation.y=r0+da*Math.min(1,u*dur/0.35);if(Math.random()<0.18)puff(V(tg.position.x,0.08,tg.position.z),1,'#cbb894')},()=>{if(TRB===B)cb()})};
 const step=()=>{if(TRB!==B)return;const a=B.q[0];if(!a){drive(B.home,()=>{const r0=tg.rotation.y;let da=Math.PI-r0;da=Math.atan2(Math.sin(da),Math.cos(da));tweenLin(0.4,u=>{tg.rotation.y=r0+da*u},()=>{tg.position.y=0;if(TRB===B)TRB=null;save()})});return}
  const p=a.o.g.position;drive(V(p.x-1.05,0,p.z),()=>drive(V(p.x,0,p.z),()=>{B.q.shift();a.fn();burst(p,'#e8d8a0',5,'up');sfx.pick&&sfx.pick();drive(V(p.x+1.05,0,p.z),step)}))};step()}
function trakTick(){if(!G.trak)return;const m=otoMode('trak');if(TRACT){const t=`🧑‍🌾 Çiftçi<small>${TRB?'Çalışıyor…':m==='oto'?'Oto · '+fmtT(otoLeft('trak'))+' · dokun: şimdi':m==='kosul'?'Koşullu · dokun: şimdi':'Pasif · dokun: şimdi'}</small>`;if(t!==TRACT.last){TRACT.last=t;TRACT.el.classList.remove('lock');TRACT.el.innerHTML=t;TRACT.el.onclick=()=>otoNow('trak')}}
 if(TRB){if(view!=='bahce'||document.hidden||!G.started)trakFlush();return}let A=[];
 if(m==='oto')A=otoRounds('trak',t=>trakPlan(t));else if(m==='kosul'){if(++trN%4)return;A=trakPlan(NOW(),true)}if(!A.length)return;
 if(G.started&&view==='bahce'&&!document.hidden&&TRACT&&TRACT.tg)trakDrive(A);else{A.forEach(a=>a.fn());if(G.started)save()}}

/* ---- çırak ---- */
let CIR=null,CIB=null,ciN=0;const CIR_REST=()=>V(OI,0,1.9);
function stFinish(s,t){const dn=s.jobs.filter(j=>t>=j.end);if(!dn.length)return;s.jobs=s.jobs.filter(j=>t<j.end);s.ready=s.ready||{};dn.forEach(j=>Object.entries(j.r.out).forEach(([k,n])=>s.ready[k]=(s.ready[k]||0)+n))}
function stCollect(s){if(!s.ready)return;const tot=Object.values(s.ready).reduce((a,b)=>a+b,0);if(invTotal()+tot>capOf('d'))return;giveAll(s.ready);G.st.proc++;s.ready=null}
function stStart(s,r,t){if(s.ready||s.jobs.length>=(s.lvl||1)||!hasAll(r.in))return false;giveAll(r.in,-1);s.jobs.push({r,end:t+r.s*spdOf(s)});return true}
function otoPending(s,k){let n=s.ready?s.ready[k]||0:0;s.jobs.forEach(j=>n+=j.r.out[k]||0);return n}
function cirPlan(t,kos){const A=[],done=s=>!!s.ready||s.jobs.some(j=>t>=j.end);
 if(!kos){ST.forEach(s=>{if(!stOwned(s)||G.tier<s.tier)return;const pickR=dry=>{G.cirI=G.cirI||{};const n=s.rec.length;for(let i=0;i<n;i++){const j=((G.cirI[s.id]||0)+i)%n,r=s.rec[j];if((!r.tier||G.tier>=r.tier)&&hasAll(r.in)){if(!dry)G.cirI[s.id]=j+1;return r}}return null};
   if(done(s)||(pickR(1)&&s.jobs.length<(s.lvl||1)))A.push({s,fn:()=>{stFinish(s,t);stCollect(s);for(let i=0;i<(s.lvl||1);i++){const r=pickR();if(!r||!stStart(s,r,t))break}}})});return A}
 otoNeeds().make.forEach(({s,r,k,times})=>{if(A.some(a=>a.s===s))return;const lack=()=>otoPending(s,k)<times*r.out[k];if(done(s)||(lack()&&!s.ready&&s.jobs.length<(s.lvl||1)&&hasAll(r.in)))A.push({s,fn:()=>{stFinish(s,NOW());stCollect(s);while(lack()&&stStart(s,r,NOW())){}}})});return A}
function cirChar(){if(CIR||!(CHX.x_cirak||CHR.length))return CIR;CIR=makeCustomer(CHX.x_cirak);CIR.cirak=true;if(!CHX.x_cirak)CIR.g.scale.setScalar(0.86);CIR.g.position.copy(CIR_REST());CIR.g.rotation.y=0;return CIR}
function cirFlush(){const B=CIB;if(!B)return;CIB=null;B.q.forEach(a=>a.fn());if(CIR){CIR.tok++;CIR.walking=false;anim(CIR,'idle');CIR.g.position.copy(CIR_REST())}save()}
function cirDrive(acts){const c=CIR,B=CIB={q:acts.slice()},go=(to,cb)=>{c.walking=true;anim(c,'walk');walk(c,to,Math.max(0.3,c.g.position.distanceTo(to)/1.3),()=>{c.walking=false;anim(c,'idle');if(CIB===B)cb()})};
 const step=()=>{if(CIB!==B)return;const a=B.q[0];if(!a){go(CIR_REST(),()=>{CIB=null;save()});return}const p=a.s.g.position,sd=p.x<OI?1:-1;
  go(V(p.x+sd*0.95,0,p.z),()=>{c.g.rotation.y=sd>0?-Math.PI/2:Math.PI/2;const d=STSND[a.s.id];if(d&&ANS[d[0]])ANS[d[0]]();
   if(c.A.work)anim(c,'work',true);tweenLin(1.2,u=>{if(CIB!==B)return;if(!c.A.work)c.g.position.y=Math.abs(Math.sin(u*Math.PI*4))*0.035;if(Math.random()<0.12)puff(V(p.x,0.9,p.z),1,'#e8d8b8')},()=>{c.g.position.y=0;if(CIB!==B)return;B.q.shift();a.fn();sfx.pick&&sfx.pick();step()})})};step()}
function cirakTick(){if(!G.cirak)return;G.stLast=G.stLast||{};const m=otoMode('cirak');cirLabel();{const t=`🧑‍🔧 Çırak<small>${CIB?'Çalışıyor…':m==='oto'?'Oto · '+fmtT(otoLeft('cirak'))+' · dokun: şimdi':m==='kosul'?'Koşullu · dokun: şimdi':'Pasif · dokun: şimdi'}</small>`;if(t!==CIRL.last){CIRL.last=t;CIRL.el.innerHTML=t}}if(view==='islik'&&G.started)cirChar();
 if(CIB){if(view!=='islik'||document.hidden||!G.started)cirFlush();return}let A=[];
 if(m==='oto')A=otoRounds('cirak',t=>cirPlan(t));else if(m==='kosul'){if(++ciN%4)return;A=cirPlan(NOW(),true)}if(!A.length)return;
 if(G.started&&view==='islik'&&!document.hidden&&cirChar())cirDrive(A);else{A.forEach(a=>a.fn());if(G.started)save()}}
/* Ticaret menüsündeki satır */
function otoRow(k,ad,off,on){const own=G[k],c=OTO_COST[k],m=otoMode(k);if(!own)return `<div class="row"><div class="n">${ad}<small>${off} · Kademe 2 · Elmasın: ${G.elmas||0}</small></div><button class="btn g" data-buy="${k}" ${G.tier<2||(G.elmas||0)<c?'disabled':''}>${c} 💎</button></div>`;
 return `<div class="row"><div class="n">${ad}<small>${on[m]}${m==='oto'?' · sonraki tur '+fmtT(otoLeft(k)):''}</small></div><div class="omode">${['oto','kosul','pasif'].map(x=>`<button data-om="${k}:${x}" class="${x===m?'on':''}">${OTO_AD[x]}</button>`).join('')}</div></div>`}
/* Dokununca turu hemen başlat (bekleme süresi sıfırlanır) */
function otoNow(k){if(!G[k]){toast(k==='trak'?'Çiftçi Ticaret menüsünden alınır':'Çırak Ticaret menüsünden alınır',1500);return}
 if(k==='trak'?TRB:CIB){toast(k==='trak'?'Çiftçi zaten çalışıyor':'Çırak zaten çalışıyor',1000);return}
 const A=k==='trak'?trakPlan(NOW()):cirPlan(NOW());if(!A.length){toast(k==='trak'?'Şu an hasat ya da ekim yapılacak tarla yok':'Şu an başlatılacak ya da toplanacak iş yok',1600);return}
 G[k+'Last']=NOW();sfx.tap&&sfx.tap();if(k==='trak')trakDrive(A);else if(cirChar())cirDrive(A);else{A.forEach(a=>a.fn());save()}}
let CIRL=null;function cirLabel(){if(!G.cirak||CIRL)return;CIRL=label('islik',V(OI,0.02,2.45),'',true);CIRL.el.classList.add('sm');CIRL.el.onclick=()=>otoNow('cirak')}

/* Çiftçi: bostanda traktörün yanında çalışan karakter */
let FRM=null;function frmTick(dt){if(!G.trak||!TRACT||!TRACT.tg||!CHX.x_ciftci||view!=='bahce')return;const tg=TRACT.tg;if(!FRM){FRM=makeCustomer(CHX.x_ciftci);FRM.frm=true;FRM.g.scale.multiplyScalar(0.8);FRM.g.position.set(tg.position.x-Math.sin(tg.rotation.y)*0.62,0,tg.position.z-Math.cos(tg.rotation.y)*0.62);FRM.g.rotation.y=tg.rotation.y;anim(FRM,'idle')}
 const g=FRM.g,r=tg.rotation.y,to=V(tg.position.x-Math.sin(r)*0.62,0,tg.position.z-Math.cos(r)*0.62);
 const dx=to.x-g.position.x,dz=to.z-g.position.z,d=Math.hypot(dx,dz);if(d>0.04){const sp=Math.min(d,(d>1.2?2.4:1.3)*dt);g.position.x+=dx/d*sp;g.position.z+=dz/d*sp;let a=Math.atan2(dx,dz)-g.rotation.y;a=Math.atan2(Math.sin(a),Math.cos(a));g.rotation.y+=a*Math.min(1,dt*8);if(FRM.cur!=='walk')anim(FRM,'walk')}
 else{let a=tg.rotation.y-g.rotation.y;a=Math.atan2(Math.sin(a),Math.cos(a));g.rotation.y+=a*Math.min(1,dt*5);if(FRM.cur==='walk')anim(FRM,'idle')}}
