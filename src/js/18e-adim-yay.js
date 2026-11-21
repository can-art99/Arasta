/* Ahşap yay: ısıt-yağla, elle ger, zımparala, kiriş bağla */
const BOWL=0.62;
function bowSt(){if(K.bow&&K.bow.g.parent)return K.bow;if(K.piece&&K.piece.visible!==undefined)K.piece.visible=false;
 const g=new THREE.Group();g.position.set(BC.x+0.07,K.top+0.016,BC.z);K.work.add(g);
 const mat=new THREE.MeshStandardMaterial({color:'#b98552',roughness:0.85,flatShading:true});K.bow={g,mat,b:0,s:0,mesh:null,str:null};bowBuild();return K.bow}
function bowCurve(){const w=K.bow,A=Math.max(0.0001,w.b*0.55*Math.PI),pts=[];
 for(let i=0;i<=40;i++){const f=i/40;let x=0,z=(f-0.5)*BOWL;if(w.b>0.01){const R=BOWL/A,t=(f-0.5)*A;x=-(R*Math.cos(t)-R*Math.cos(A/2));z=R*Math.sin(t)}
  const e=Math.max(0,Math.abs(2*f-1)-0.82)/0.18;x+=w.s*0.03*e*e;pts.push(V(x,0,z))}
 return new THREE.CatmullRomCurve3(pts)}
function bowBuild(){const w=K.bow,c=bowCurve(),T=48,RS=6,geo=new THREE.TubeGeometry(c,T,1,RS,false),pa=geo.attributes.position,P=V(0,0,0),v=V(0,0,0);
 for(let i=0;i<=T;i++){const f=i/T;c.getPointAt(f,P);const u=Math.abs(2*f-1);let r=0.013*(1-w.s*0.5*Math.pow(u,1.5))+w.s*0.004*Math.exp(-Math.pow((f-0.5)/0.07,2));
  for(let j=0;j<=RS;j++){const k=i*(RS+1)+j;v.fromBufferAttribute(pa,k).sub(P);v.multiplyScalar(r);v.y*=0.75;pa.setXYZ(k,P.x+v.x,P.y+v.y,P.z+v.z)}}
 pa.needsUpdate=true;geo.computeVertexNormals();if(w.mesh){w.mesh.geometry.dispose();w.mesh.geometry=geo}else{w.mesh=new THREE.Mesh(geo,w.mat);w.mesh.castShadow=true;w.g.add(w.mesh)}}
function bowTips(){const c=bowCurve(),g=K.bow.g;return [c.getPointAt(0).add(g.position),c.getPointAt(1).add(g.position)]}
function bowNear(p){const c=bowCurve(),g=K.bow.g;let best=9,bf=0;for(let i=0;i<=20;i++){const q=c.getPointAt(i/20).add(g.position),d=Math.hypot(p.x-q.x,p.z-q.z);if(d<best){best=d;bf=i/20}}return [best,bf]}

function bBowHeat(){const w=bowSt();let heat=0,hold=false,ph='heat',seg=new Set(),t0=tt;const base=new THREE.Color('#b98552');
 ui.act.innerHTML='<div class="gauge"><div class="gf" id="gf" style="width:0%;background:linear-gradient(90deg,#f2c46a,#d0542a)"></div></div>';
 const b=btn('🔥 Isıt (basılı tut)','g',()=>{});b.style.minWidth='60%';b.onpointerdown=e=>{e.preventDefault();hold=true};b.onpointerup=b.onpointerleave=b.onpointercancel=()=>{hold=false};b.oncontextmenu=e=>e.preventDefault();ui.act.appendChild(b);
 K.tick=dt=>{dt=dt||0.016;if(ph!=='heat')return;
  if(hold){heat=Math.min(1,heat+dt/2.4);if(Math.random()<0.7){const z=(Math.random()-0.5)*BOWL;puff(V(w.g.position.x+(Math.random()-0.5)*0.03,K.top+0.02,BC.z+z),1,Math.random()<0.5?'#ffb24a':'#ff7a2a')}if(Math.random()<0.08)noise(0.25,0.012,2400,0.7)}
  w.mat.color.copy(base).lerp(new THREE.Color('#7a4a26'),heat*0.45);w.mat.emissive=new THREE.Color('#ff5a10');w.mat.emissiveIntensity=heat*0.18*(hold?1:0.6);
  const g=$('gf');if(g)g.style.width=(heat*100)+'%';tipStep(hold?`Isınıyor · %${Math.round(heat*100)}`:'Butona basılı tut, çıta ısınsın');
  if(heat>=1){ph='oil';ui.act.innerHTML='';sfx.good();tween(0.8,q=>w.mat.emissiveIntensity=0.18*(1-q));tipStep('Fırçayı çıta boyunca gezdirip yağla')}};
 const oil=p=>{if(ph!=='oil')return;toolAt(V(p.x,0,p.z),'br');const [d,f]=bowNear(p);if(d<0.07){seg.add(Math.min(11,Math.floor(f*12)));if(Math.random()<0.3)puff(V(p.x,K.top+0.03,p.z),1,'#e8b84a')}
  const k=seg.size/12;w.mat.roughness=0.85-0.5*k;w.mat.color.copy(base).lerp(new THREE.Color('#7a4a26'),0.45).lerp(new THREE.Color('#a8642a'),k*0.4);tipStep(`Yağlama %${Math.round(k*100)}`);
  if(seg.size>=11){ph='done';K.pd=K.pm=null;fin(clamp(1.2-(tt-t0)/16,0.5,1),'Çıta ısındı ve yağlandı, esnemeye hazır!')}};
 K.pd=oil;K.pm=oil;K.skipFn=()=>{K.tick=null;w.mat.emissiveIntensity=0;w.mat.roughness=0.4};tipStep('Butona basılı tut, çıta ısınsın')}

function bBowBend(){const w=bowSt();w.mat.emissiveIntensity=0;let la=null,tot=0,t0=tt;
 const mv=p=>{toolAt(V(p.x,0,p.z),'cl',K.top+0.05);const a=Math.atan2(p.z-BC.z,p.x-BC.x);if(la!=null){const d=Math.abs(wrapA(a-la));if(d<0.8)tot+=d}la=a;
  w.b=Math.min(1,tot/(Math.PI*1.4));bowBuild();if(tt-(K.rsn||0)>0.25){K.rsn=tt;noise(0.14,0.025,380,0.5,0,160)}tipStep(`Germe %${Math.round(w.b*100)}`);
  if(w.b>=1){K.pd=K.pm=null;sfx.punch();puff(V(w.g.position.x-0.1,K.top+0.05,BC.z),4,'#d8b88a');fin(clamp(1.2-(tt-t0)/14,0.5,1),'Çıta yay şeklini aldı!')}};
 K.pd=p=>{la=null;mv(p)};K.pm=mv;K.pu=()=>{la=null};K.skipFn=()=>{w.b=1;bowBuild()};tipStep('Parmağınla yarım daireler çizerek çıtayı ger')}

function bBowSand(){const w=bowSt();if(w.b<1){w.b=1;bowBuild()}let dist=0,lp=null,t0=tt;
 const mv=p=>{toolAt(V(p.x,0,p.z),'blk');const [d]=bowNear(p);if(lp&&d<0.08){dist+=Math.hypot(p.x-lp.x,p.z-lp.z);w.s=Math.min(1,dist/2.6);bowBuild();if(Math.random()<0.35)puff(V(p.x,K.top+0.03,p.z),1,'#e2c79a');if(tt-(K.rsn||0)>0.12){K.rsn=tt;noise(0.08,0.02,1800,0.6,0,900)}}lp=p.clone();
  w.mat.color.lerp(new THREE.Color('#b0703a'),0.004);tipStep(`Zımpara %${Math.round(w.s*100)}`);
  if(w.s>=1){K.pd=K.pm=null;fin(clamp(1.2-(tt-t0)/14,0.5,1),'Uçlar inceldi, kabza belirdi!')}};
 K.pd=p=>{lp=null;mv(p)};K.pm=mv;K.pu=()=>{lp=null};K.skipFn=()=>{w.s=1;bowBuild()};tipStep('Zımparayı yay boyunca ileri geri sür')}

function bBowString(){const w=bowSt();if(w.s<1){w.s=1;w.b=Math.max(w.b,1);bowBuild()}const tips=bowTips(),done=[false,false],wm=M('#efe3c8',0.6),mk=[];
 tips.forEach((q,i)=>{const r=dashRing(0.045,K.top+0.02,14,'#ffe08a');r.position.set(q.x-BC.x,0,q.z-BC.z);K.work.add(r);mk.push(r)});
 let line=null;const lineTo=(a,b,slack)=>{const m=a.clone().lerp(b,0.5);m.x-=slack;const c=new THREE.QuadraticBezierCurve3(a,m,b),g=new THREE.TubeGeometry(c,16,0.0025,5,false);if(line){line.geometry.dispose();line.geometry=g}else{line=new THREE.Mesh(g,wm);K.work.add(line)}};
 const wrap=(i,cb)=>{const q=tips[i],G0=new THREE.Group();G0.position.copy(q);K.work.add(G0);let n=0;const iv=setInterval(()=>{if(K.dead){clearInterval(iv);return}const t=put(G0,new THREE.TorusGeometry(0.009,0.0025,5,10),wm,0,0.004+n*0.0035,(i?-1:1)*n*0.004);t.rotation.y=Math.PI/2;t.scale.setScalar(0.01);tween(0.15,k=>t.scale.setScalar(Math.max(0.01,k)));noise(0.05,0.02,900,0.5,0,400);if(++n>=6){clearInterval(iv);cb&&cb()}},120)};
 const tap=p=>{for(let i=0;i<2;i++){if(done[i])continue;const q=tips[i];if(Math.hypot(p.x-q.x,p.z-q.z)<0.09){done[i]=true;tween(0.3,k=>mk[i].scale.setScalar(Math.max(0.01,1-k)),()=>K.work.remove(mk[i]));
   wrap(i,()=>{if(done[0]&&done[1]){const a=tips[0].clone(),b=tips[1].clone();a.y=b.y=K.top+0.02;tween(0.5,k=>lineTo(a,b,0.06*(1-k)),()=>{sfx.good();noise(0.2,0.04,220,0.4,0,140);fin(1,'Kiriş bağlandı, yay hazır!')})}
    else{const a=tips[i].clone();a.y=K.top+0.02;const o=tips[1-i].clone();o.y=a.y;lineTo(a,a.clone().lerp(o,0.55),0.04);tipStep('Şimdi öbür ucu bağla')}});return}}};
 K.pd=tap;K.skipFn=()=>{mk.forEach(m=>K.work.remove(m));const a=tips[0].clone(),b=tips[1].clone();a.y=b.y=K.top+0.02;lineTo(a,b,0)};tipStep('Yayın iki ucuna dokunup kirişi bağla')}
