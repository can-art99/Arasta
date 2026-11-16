/* ---------- ortak alet animasyonu: vuruş, sarsıntı, geri tepme ---------- */
let SHK=0;
/* Vuruş: geri çekil -> hızlanarak in -> çarp -> sönerek geri tep. set(açı) aleti döndürür; o.own aynı aletin üst üste vuruşlarını ayırır. */
function strike(set,o){const H=o.own||{},id=H.sid=(H.sid||0)+1,t0=tt,a=o.wind==null?0.09:o.wind,b=a+(o.fall||0.11),D=b+(o.settle||0.28),r0=o.rest==null?o.top*0.5:o.rest,rb=o.reb==null?0.16:o.reb;let hit=false;
 const land=()=>{if(hit)return;hit=true;o.onHit&&o.onHit()};
 tween(D+0.02,()=>{if(H.sid!==id){land();return}const t=tt-t0;
  if(t<a){const u=t/a;set(r0+(o.top-r0)*(1-(1-u)*(1-u)))}
  else if(t<b){const u=(t-a)/(b-a);set(o.top+(o.hit-o.top)*Math.pow(u,o.pow||2.6))}
  else{if(!hit){set(o.hit);land()}const u=Math.min(1,(t-b)/(D-b));set(o.hit+(o.top-o.hit)*rb*Math.exp(-4*u)*Math.abs(Math.sin(u*Math.PI*1.5)))}},
 ()=>{land();if(H.sid===id&&o.done)o.done()})}
/* Çarpma: kamera hafif sarsılır, parça bir an çöküp geri gelir */
function jolt(obj,a){if(!obj||!obj.position)return;const U=obj.userData;if(!U.jT){U.jT=1;U.jb=obj.position.y}const y0=U.jb;tween(0.16,k=>{obj.position.y=y0-a*Math.sin(Math.min(1,k)*Math.PI)},()=>{obj.position.y=y0;U.jT=0})}
function impactFx(pw,obj){const p=pw*0.011;tween(0.24,k=>{SHK=p*(1-k)},()=>{SHK=0});if(obj)jolt(obj,0.0035*pw)}
/* Doğrusal zamanlı tween: fn(0..1), yumuşatma eğrisi olmadan */
function tweenLin(dur,fn,done){const t0=tt;tween(dur,()=>fn(Math.min(1,(tt-t0)/dur)),done)}
