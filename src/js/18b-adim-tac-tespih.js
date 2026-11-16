/* Tespih: elektrikli zımparada boncuk yuvarlama */
/* Taç: zigzag kesim, kaynak, taş yerleştirme, halka kıvırma · Tornavida */
const ZZ={w:0.56,n:8,h:0.05},zzPts=()=>{const a=[];for(let i=0;i<=ZZ.n*2;i++)a.push([-ZZ.w/2+i*ZZ.w/(ZZ.n*2),i%2?ZZ.h:0]);return a};
function zigMesh(col,cut){const s=new THREE.Shape(),hw=ZZ.w/2;s.moveTo(-hw,-0.035);s.lineTo(hw,-0.035);if(cut){const p=zzPts();for(let i=p.length-1;i>=0;i--)s.lineTo(p[i][0],p[i][1])}else{s.lineTo(hw,ZZ.h);s.lineTo(-hw,ZZ.h)}s.lineTo(-hw,-0.035);
 const g=new THREE.ExtrudeGeometry(s,{depth:0.006,bevelEnabled:false});g.rotateX(-Math.PI/2);const m=new THREE.Mesh(g,M(col,0.4));m.castShadow=true;return m}
function crownSt(){if(!K.crown){K.crown={g:new THREE.Group()};K.crown.g.position.set(BC.x,K.top-0.004,BC.z-0.07);K.work.add(K.crown.g)}return K.crown}
function pathFollow(pts,tolD,onHit,onEnd){const P=[];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/0.01));for(let j=0;j<n;j++)P.push({x:a[0]+(b[0]-a[0])*j/n,z:a[1]+(b[1]-a[1])*j/n,on:false})}P.push({x:pts[pts.length-1][0],z:pts[pts.length-1][1],on:false});
 const dm=new THREE.MeshBasicMaterial({color:'#fff6d8'}),gh=new THREE.Group();P.forEach((q,i)=>{if(i%2)return;put(gh,Cy(0.004,0.004,0.002,6),dm,q.x,K.top+0.006,q.z).castShadow=false});K.work.add(gh);let n=0,dev=0,dn=0;
 const mv=p=>{let best=null,bd=9;P.forEach(q=>{const d=Math.hypot(q.x-p.x,q.z-p.z);if(d<bd){bd=d;best=q}});dev+=Math.min(bd,0.06);dn++;if(best&&bd<tolD){P.forEach(q=>{if(!q.on&&Math.hypot(q.x-p.x,q.z-p.z)<tolD){q.on=true;n++;onHit(q)}})}
  const k=n/P.length;tipStep(`%${Math.round(k*100)}`);if(k>=0.9){hookClear();K.work.remove(gh);onEnd(clamp(1-(dev/Math.max(dn,1)-0.006)/0.03,0.35,1))}};return {mv,gh}}
function bZig(){moveCam({p:V(0,2.2,2.05),l:V(0,Y,BC.z-0.08)},0.6);const C=crownSt(),col=K.p.sheet;if(C.zig)C.g.remove(C.zig);C.zig=zigMesh(col,false);C.g.add(C.zig);const pts=zzPts().map(q=>[BC.x+q[0],BC.z-0.07-q[1]]);let snd=0;
 const pf=pathFollow(pts,0.03,q=>{},s=>{toolUp();C.g.remove(C.zig);C.zig=zigMesh(col,true);C.g.add(C.zig);const off=zigMesh(col,false);off.material=M(col,0.4);off.position.y=-0.001;C.g.add(off);tween(0.5,k=>{off.position.z=-0.05*k;off.scale.setScalar(Math.max(0.01,1-k))},()=>C.g.remove(off));sfx.good();moveCam(VIEWS.bench,0.6);fin(s,'Zigzag kesildi!')});
 K.pd=K.pm=p=>{toolAt(p,'sc');if(tt-snd>0.17){snd=tt;sfx.cut()}pf.mv(p)};K.pu=()=>toolUp();K.skipFn=()=>{moveCam(VIEWS.bench,0.5);K.work.remove(pf.gh);C.g.remove(C.zig);C.zig=zigMesh(col,true);C.g.add(C.zig)};tipStep('Demir makasıyla zigzag çizgiyi takip et')}
let WLD=null;function weldRig(){const bp=V(BC.x+0.46,Y,BC.z+0.22),g=new THREE.Group();K.work.add(g);const TB=new THREE.Group();TB.position.copy(bp);g.add(TB);
 {const w=fitM('solder',{w:0.26});if(w){w.rotation.y=-Math.PI/2;TB.add(w)}else{put(TB,B(0.2,0.1,0.14),M('#3a6ac0',0.5),0,0.05,0)}}
 const TH=new THREE.Group(),hi=new THREE.Group();hi.rotation.x=0.6;TH.add(hi);g.add(TH);put(hi,Cy(0.004,0.006,0.06,8),M('#c8ccd0',0.25),0,0.03,0);put(hi,Cy(0.014,0.012,0.09,10),M('#2a4a9a',0.5),0,0.1,0);put(hi,Cy(0.015,0.015,0.02,10),M('#1a1a1a',0.6),0,0.155,0);
 const tip=put(hi,new THREE.SphereGeometry(0.008,8,6),new THREE.MeshBasicMaterial({color:'#ff9a40'}),0,0,0);const hose=new THREE.Mesh(new THREE.BufferGeometry(),M('#1e1e1e',0.7));g.add(hose);
 const at=(x,z,on)=>{TH.position.set(x,K.top+0.012,z);TH.rotation.y=Math.atan2(bp.x-x,bp.z-z);tip.visible=!!on;tip.scale.setScalar(on?0.8+Math.random()*0.6:1);TH.updateMatrixWorld(true);const e=hi.localToWorld(V(0,0.165,0)),a=V(bp.x-0.06,Y+0.06,bp.z),c=a.clone().add(e).multiplyScalar(0.5);c.y=Math.max(a.y,e.y)+0.08;hose.geometry.dispose();hose.geometry=new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a,c,e),18,0.006,6,false)};
 at(bp.x-0.14,bp.z-0.02,false);return {g,at}}
function bWeld(){const C=crownSt(),rig=weldRig(),z=BC.z-0.035,pts=[[BC.x-ZZ.w/2+0.01,z],[BC.x+ZZ.w/2-0.01,z]];let sm=0;
 const pf=pathFollow(pts,0.02,q=>{const b=put(C.g,new THREE.SphereGeometry(0.006,6,5),new THREE.MeshStandardMaterial({color:'#d8c070',roughness:0.3,emissive:'#ff7a20',emissiveIntensity:1.8}),q.x-C.g.position.x,0.004,q.z-C.g.position.z);b.scale.set(1.4,0.6,1);tween(1.4,k=>b.material.emissiveIntensity=1.8*(1-k))},
  s=>{rig.at(BC.x+0.32,BC.z+0.2,false);setTimeout(()=>{if(K.dead)return;K.work.remove(rig.g)},500);sfx.good();fin(s,'Plakalar kaynaklandı!')});
 const mv=p=>{rig.at(p.x,p.z,true);if(tt-sm>0.12){sm=tt;puff(V(p.x,K.top+0.02,p.z),3,Math.random()<0.5?'#ffd27a':'#fff2c0');noise(0.09,0.03,3200,0.5,0,1600)}pf.mv(p)};
 K.pd=K.pm=mv;K.pu=()=>{};K.skipFn=()=>{K.work.remove(pf.gh);K.work.remove(rig.g)};tipStep('Kaynak ucunu iki plakanın birleşim çizgisinde gezdir')}
function bGems(){const C=crownSt(),cols=['#c0392b','#2e8b57','#2f5fb3','#c0392b','#2e8b57','#2f5fb3','#c0392b'],N=7,top=K.top+0.01,S2=[],G2=[];let t0=tt,miss=0,cur=null;
 for(let i=0;i<N;i++){const x=BC.x-0.21+i*0.07,z=BC.z;const r=put(K.work,new THREE.TorusGeometry(0.011,0.0025,5,14),new THREE.MeshBasicMaterial({color:'#fff6d8'}),x,top,z);r.rotation.x=Math.PI/2;S2.push({x,z,r,full:false})}
 const tray=put(K.work,Cy(0.1,0.11,0.02,16),M('#6b4528'),BC.x+0.42,Y+0.01,BC.z+0.1);
 cols.forEach((c,i)=>{const a=i/N*Math.PI*2,hx=BC.x+0.42+Math.cos(a)*0.055,hz=BC.z+0.1+Math.sin(a)*0.055,m=put(K.work,new THREE.OctahedronGeometry(0.012,0),M(c,0.15),hx,Y+0.035,hz);m.scale.y=0.75;G2.push({m,hx,hz,done:false})});
 K.tick=()=>S2.forEach(s=>{if(!s.full)s.r.scale.setScalar(1+Math.sin(tt*7)*0.15)});
 K.pd=p=>{let b=null,bd=0.05;G2.forEach(g=>{if(g.done)return;const d=Math.hypot(g.m.position.x-p.x,g.m.position.z-p.z);if(d<bd){bd=d;b=g}});cur=b;if(b)sfx.pick()};
 K.pm=p=>{if(cur)cur.m.position.set(p.x,top+0.03,p.z)};
 K.pu=()=>{if(!cur)return;const g=cur;cur=null;let s=null,sd=0.045;S2.forEach(q=>{if(q.full)return;const d=Math.hypot(q.x-g.m.position.x,q.z-g.m.position.z);if(d<sd){sd=d;s=q}});const a=g.m.position.clone();
  if(!s){miss++;tween(0.25,k=>g.m.position.lerpVectors(a,V(g.hx,Y+0.035,g.hz),k));return}s.full=true;g.done=true;s.r.visible=false;sfx.punch();const b=V(s.x,top-0.002,s.z);tween(0.18,k=>g.m.position.lerpVectors(a,b,k),()=>{K.work.remove(g.m);C.g.add(g.m);g.m.position.set(s.x-C.g.position.x,0.008,s.z-C.g.position.z);(C.gems=C.gems||[]).push(g.m.material.color.getHexString())});
  const left=S2.filter(q=>!q.full).length;tipStep(`Taş ${N-left}/${N}`);if(!left){K.tick=null;hookClear();K.work.remove(tray);fin(clamp(1.2-(tt-t0)/(N*2.5)-miss*0.05,0.4,1),'Taşlar yerinde!')}};
 K.skipFn=()=>{S2.forEach(s=>K.work.remove(s.r));G2.forEach(g=>{if(!g.done)K.work.remove(g.m)});K.work.remove(tray)};tipStep('Tepsideki taşları tutup parlayan yuvalara bırak')}
function bRoll(){moveCam({p:V(0,1.95,2.5),l:V(0,Y+0.05,BC.z-0.06)},0.7);const C=crownSt(),col=K.p.sheet,L=ZZ.w,h=0.07,gems=(C.gems&&C.gems.length?C.gems:['c0392b','2e8b57','2f5fb3']);if(K.piece)K.piece.visible=false;C.g.visible=false;
 const mat=M(col,0.35);mat.side=THREE.DoubleSide;const R=new THREE.Group();K.work.add(R);let acc=0,la=null,t0=tt,ok=0,all=0;
 const draw=th=>{R.clear();const r=L/th;R.position.set(BC.x,K.top,BC.z-r+0.04);put(R,new THREE.CylinderGeometry(r,r,h,48,1,true,-th/2,th),mat,0,h/2,0);
  for(let i=0;i<ZZ.n;i++){const a=-th/2+(i+0.5)/ZZ.n*th,c=put(R,new THREE.ConeGeometry(0.016,ZZ.h,4),mat,Math.sin(a)*r,h+ZZ.h/2,Math.cos(a)*r);c.rotation.y=a}
  for(let i=0;i<7;i++){const a=-th/2+(i+1)/8*th;put(R,new THREE.OctahedronGeometry(0.011,0),M('#'+gems[i%gems.length],0.15),Math.sin(a)*(r+0.004),h/2,Math.cos(a)*(r+0.004))}};
 const th0=0.25;draw(th0);let lastDraw=0;
 K.pd=p=>{la=Math.atan2(p.z-(BC.z-0.05),p.x-BC.x)};
 K.pm=p=>{toolAt(V(p.x,0,p.z),'cl',K.top+0.05);if(la==null)return;const a=Math.atan2(p.z-(BC.z-0.05),p.x-BC.x);let d=a-la;d=Math.atan2(Math.sin(d),Math.cos(d));la=a;all++;if(Math.hypot(p.x-BC.x,p.z-BC.z)<0.4)ok++;acc+=Math.abs(d);
  const k=Math.min(1,acc/(Math.PI*2*1.3)),th=th0+(Math.PI*2-th0)*k;if(tt-lastDraw>0.05||k>=1){lastDraw=tt;draw(th)}tipStep(`Kıvırma %${Math.round(k*100)}`);if(tt-(K.rsn||0)>0.25){K.rsn=tt;noise(0.12,0.03,500,0.4,0,200)}
  if(k>=1){hookClear();toolUp();sfx.good();moveCam(VIEWS.bench,0.6);fin(clamp(1.25-(tt-t0)/8-(all?(1-ok/all)*0.3:0),0.4,1),'Taç halkası tamam!')}};
 K.pu=()=>{la=null;toolUp()};K.skipFn=()=>{draw(Math.PI*2);moveCam(VIEWS.bench,0.5)};tipStep('Parmağınla plakanın etrafında daire çizerek kıvır')}/* Ahşap kalemlik: şeridi buharla ısıt, sonra daire çizerek silindire bük */
function bWoodBend(){toolUp();const col=K.p.sheet,L=0.5,h=0.13,base=V(BC.x,K.top,BC.z);if(K.piece)K.piece.visible=false;
 const wm=M(col,0.85);wm.side=THREE.DoubleSide;const R=new THREE.Group();K.work.add(R);let heat=0,acc=0,la=null,ph='heat',t0=tt,ok=0,all=0,hold=false;
 const draw=th=>{R.clear();if(th<0.02){put(R,B(L,h,0.012),wm,0,h/2,0);return}const r=L/th;R.position.set(base.x,base.y,base.z-r+0.02);const c=put(R,new THREE.CylinderGeometry(r,r,h,48,1,true,-th/2,th),wm,0,h/2,0);c.castShadow=true;
  if(th>Math.PI*1.95){const b=put(R,Cy(r,r,0.01,32),M(col,0.85),0,0.005,0);b.castShadow=true}};
 R.position.copy(base);R.rotation.x=0;draw(0);
 const kt=new THREE.Group();kt.position.set(BC.x+0.42,Y,BC.z+0.18);K.work.add(kt);put(kt,Cy(0.07,0.09,0.12,14),M('#5a5f66',0.4),0,0.06,0);put(kt,Cy(0.015,0.02,0.09,8),M('#5a5f66',0.4),-0.07,0.1,0).rotation.z=1.1;put(kt,Cy(0.03,0.07,0.02,14),M('#3a3e44',0.4),0,0.125,0);
 ui.act.innerHTML='<div class="gauge"><div class="gf" id="gf" style="width:0%;background:linear-gradient(90deg,#bfe3f2,#e9a65a)"></div></div>';const b=btn('♨️ Buharla (basılı tut)','g',()=>{});b.style.minWidth='60%';b.onpointerdown=e=>{e.preventDefault();hold=true};b.onpointerup=b.onpointerleave=b.onpointercancel=()=>{hold=false};b.oncontextmenu=e=>e.preventDefault();ui.act.appendChild(b);
 K.tick=dt=>{dt=dt||0.016;if(ph!=='heat')return;if(Math.random()<0.35)puff(V(kt.position.x-0.13,Y+0.2,kt.position.z-0.02),1,'#f4f7f8');
  if(hold){heat=Math.min(1,heat+dt/2.2);for(let i=0;i<2;i++)if(Math.random()<0.6)puff(V(base.x+(Math.random()-0.5)*L,K.top+0.06+Math.random()*0.05,base.z+(Math.random()-0.5)*0.02),1,'#eef3f6');if(Math.random()<0.1)noise(0.3,0.015,3000,0.8)}
  wm.color.set(col).lerp(new THREE.Color('#5a3a20'),heat*0.35);const g=$('gf');if(g)g.style.width=(heat*100)+'%';tipStep(hold?`Isınıyor · %${Math.round(heat*100)}`:'Butona basılı tut, buhar tahtayı yumuşatsın');
  if(heat>=1){ph='bend';ui.act.innerHTML='';sfx.good();tween(0.4,k=>kt.scale.setScalar(Math.max(0.01,1-k)),()=>K.work.remove(kt));tipStep('Tahta yumuşadı · parmağınla daire çizerek bük')}};
 K.pd=p=>{if(ph==='bend')la=Math.atan2(p.z-base.z,p.x-base.x)};
 K.pm=p=>{if(ph!=='bend'||la==null)return;toolAt(V(p.x,0,p.z),'cl',K.top+0.08);const a=Math.atan2(p.z-base.z,p.x-base.x);let d=a-la;d=Math.atan2(Math.sin(d),Math.cos(d));la=a;all++;if(Math.hypot(p.x-base.x,p.z-base.z)<0.45)ok++;acc+=Math.abs(d);
  const k=Math.min(1,acc/(Math.PI*2*1.2));draw(0.02+(Math.PI*2-0.02)*k);tipStep(`Bükme %${Math.round(k*100)}`);if(tt-(K.rsn||0)>0.3){K.rsn=tt;noise(0.12,0.025,420,0.5,0,180)}
  if(k>=1){ph='done';K.tick=null;toolUp();sfx.punch();puff(V(base.x,K.top+0.08,base.z),4,'#d8b88a');fin(clamp(1.25-(tt-t0)/14-(all?(1-ok/all)*0.4:0),0.45,1),'Tahta büküldü, kalemlik şekillendi!')}};
 K.pu=()=>{la=null};K.skipFn=()=>{K.tick=null;K.work.remove(R);K.work.remove(kt)};tipStep('Butona basılı tut, buhar tahtayı yumuşatsın')}
