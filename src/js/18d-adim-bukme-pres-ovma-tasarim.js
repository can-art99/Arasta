/* At nalı: bükme */
function fiStage(){if(K.barrel)return;K.hid=[];K.work.children.slice().forEach(c=>{if(c.isMesh&&c.visible&&c!==K.band){c.visible=false;K.hid.push(c)}});if(K.band)K.band.visible=false;
 const H=0.3,Rb=0.148,pts=[];for(let k=0;k<=12;k++){const y=k/12*H;pts.push(new THREE.Vector2(Rb*(0.86+0.14*Math.sin(Math.PI*y/H)),y))}
 const g=new THREE.Group(),wm=new THREE.MeshStandardMaterial({color:'#a8743f',roughness:0.85,flatShading:true});const body=new THREE.Mesh(new THREE.LatheGeometry(pts,14),wm);body.castShadow=true;g.add(body);
 const lid=new THREE.Mesh(new THREE.CircleGeometry(Rb*0.86,14),new THREE.MeshStandardMaterial({color:'#c08a52',roughness:0.9}));lid.rotation.x=-Math.PI/2;lid.position.y=H-0.004;g.add(lid);
 for(let k=0;k<14;k++){const a=k/14*Math.PI*2;const ln=put(g,B(0.003,0.002,Rb*0.84),M('#7a5230'),Math.cos(a)*0.001,H-0.002,0);ln.rotation.y=a;ln.position.set(Math.sin(a)*Rb*0.42,H-0.002,Math.cos(a)*Rb*0.42);ln.castShadow=false}
 g.position.set(BC.x+0.53,Y,BC.z+0.08);g.scale.setScalar(0.7);K.work.add(g);K.barrel=g;K.barrelH=H;K.hoops=[]}
function bBend(){const st=K.st,full=!!st.full,N=st.n||1;if(full)fiStage();else if(K.piece&&K.piece.visible!==undefined)K.piece.visible=false;
 const R=0.15,L=full?2*Math.PI*R:0.5,AM=full?2*Math.PI:1.35*Math.PI,y=Y+0.02,TR=full?0.011:0.018;let mat,b=0,mesh=null,la=null,tot=0,made=0;
 const heat=()=>{mat=M('#8a8e94',0.35);mat.emissive=new THREE.Color('#ff4a10');mat.emissiveIntensity=0.45};heat();
 const build=()=>{const A=Math.max(0.001,b*AM),Rr=L/A,pts=[];for(let i=0;i<=40;i++){const f=i/40;if(b<0.01)pts.push(V(BC.x+(f-0.5)*L,y,BC.z));else{const t=(f-0.5)*A;pts.push(V(BC.x+Rr*Math.sin(t),y,BC.z-Rr*Math.cos(t)+(full?Rr:Rr*0.35)))}}const g=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts,full&&b>=1),64,TR,6,full&&b>=1);if(mesh){mesh.geometry.dispose();mesh.geometry=g}else{mesh=new THREE.Mesh(g,mat);mesh.castShadow=true;K.work.add(mesh)}};build();
 const ring=dashRing(0.16,Y+0.004,26);K.hy=Y;const ctr=m=>{m.geometry.translate(-BC.x,-y,-(BC.z+R));m.position.set(BC.x,y,BC.z+R)};
 const lbl=()=>tipStep(full?`${N>1?(made+1)+'. çember · ':''}Bük · %${Math.round(b*100)}`:`Bük · %${Math.round(b*100)}`);
 const mv=p=>{toolAt(V(p.x,0,p.z),'cl',Y+0.05);const a=angAt(p);if(la!=null){const d=Math.abs(wrapA(a-la));if(d<0.8)tot+=d}la=a;b=Math.min(1,tot/(Math.PI*(full?2.2:1.6)));build();if(Math.random()<0.25)noise(0.05,0.02,500,0.5,0,200);lbl();if(b>=1)end()};
 const end=()=>{const m=mesh,mm=mat;tween(1,q=>mm.emissiveIntensity=0.45*(1-q));sf('cekic',0.5)||sfx.punch();
  if(full){ctr(m);K.hoops.push(m);made++;const a=m.position.clone(),to=V(BC.x-0.4,y+(made-1)*0.03,BC.z+0.05);tween(0.45,q=>{m.position.lerpVectors(a,to,q);m.scale.setScalar(1-0.45*q)});
   if(made<N){mesh=null;b=0;tot=0;la=null;heat();build();toast('Bir çember hazır, ikincisini bük',1300);lbl();return}}
  K.work.remove(ring);K.pd=K.pm=null;fin(1,full?'Çemberler hazır!':'Nal büküldü!')};
 K.pd=p=>{la=null;mv(p)};K.pm=mv;
 K.skipFn=()=>{K.work.remove(ring);if(full){while(made<N){b=1;build();const m=mesh;m.material.emissiveIntensity=0;ctr(m);K.hoops.push(m);made++;m.position.set(BC.x-0.4,y+(made-1)*0.03,BC.z+0.05);m.scale.setScalar(0.55);mesh=null;b=0;heat()}}else{b=1;build()}};lbl();tipStep(full?'Çubuğun etrafında daire çizerek tam çember yap':'Çubuğun etrafında daire çizerek bük')}
function bMount(){fiStage();const bar=K.barrel,H=K.barrelH,hs=K.hoops||[],lv=[H*0.8,H*0.22];let i=0,cur=null,off=null,sc=[];
 const a=bar.position.clone(),to=V(BC.x,Y,BC.z),s0=bar.scale.x;tween(0.5,q=>{bar.position.lerpVectors(a,to,q);bar.scale.setScalar(s0+(1-s0)*q)});
 hs.forEach(m=>{m.userData.home=m.position.clone();m.userData.hsc=m.scale.x});K.hy=Y+H;
 const tip=()=>tipStep(`Çember ${i+1}/${hs.length} · fıçının üstüne sürükle`);tip();
 K.pd=p=>{const m=hs[i];if(!m)return;if(Math.hypot(m.position.x-p.x,m.position.z-p.z)<0.22){cur=m;off=V(m.position.x-p.x,0,m.position.z-p.z);m.scale.setScalar(0.95);sfx.pick()}};
 K.pm=p=>{if(!cur)return;cur.position.set(p.x+off.x,Y+H+0.05,p.z+off.z)};
 K.pu=()=>{if(!cur)return;const m=cur;cur=null;const d=Math.hypot(m.position.x-BC.x,m.position.z-BC.z);
  if(d<0.1){sc.push(clamp(1-d/0.1,0.4,1));const fr=m.position.clone(),tg=V(BC.x,Y+lv[i],BC.z);tween(0.35,q=>m.position.lerpVectors(fr,tg,q));sf('cekic',0.4)||sfx.drop();puff(V(BC.x,Y+H,BC.z),4,'#c9a37a');i++;if(i>=hs.length){K.pd=K.pm=K.pu=null;setTimeout(()=>fin(avg(sc),'Çemberler fıçıya geçti!'),450)}else tip()}
  else{const fr=m.position.clone();tween(0.25,q=>m.position.lerpVectors(fr,m.userData.home,q));m.scale.setScalar(m.userData.hsc);toast('Fıçının tam üstüne bırak',800)}};
 K.skipFn=()=>{bar.position.copy(to);bar.scale.setScalar(1);hs.forEach((m,k)=>{m.scale.setScalar(0.95);m.position.set(BC.x,Y+(lv[k]||lv[0]),BC.z)})}}
/* Kupa: kilden kulp yuvarla, kupaya tak */
function bCoil(){const m=K.m3,ku=m&&m.kulp,cm=M(K.p.sheet||'#d9c8b0',0.75),N=6;let rolls=0,dir=0,run=0,lx=null,phase='roll',cur=null,off=null,sc=[],t0=tt;
 const c=new THREE.Mesh(new THREE.CylinderGeometry(1,1,1,12),cm);c.rotation.z=Math.PI/2;c.castShadow=true;const home=V(BC.x-0.05,K.top>Y+0.1?Y+0.02:K.top,BC.z+0.36);
 const grp=new THREE.Group();grp.add(c);grp.position.copy(home);K.work.add(grp);
 const shape=()=>{const k=rolls/N,r=0.04-0.026*k,L=0.07+0.17*k;c.scale.set(r,L,r);c.position.y=r};shape();K.hy=home.y;
 const tw=()=>ku?ku.getWorldPosition(new THREE.Vector3()):V(BC.x+0.17,Y,BC.z);
 const mark=dashRing(0.06,Y+0.004,20);mark.visible=false;
 tipStep(`Kili ileri geri yuvarla · 0/${N}`);
 K.pd=p=>{if(phase==='roll'){lx=p.x;run=0;dir=0;toolAt(V(p.x,0,p.z),'cl',home.y+0.05)}else if(Math.hypot(p.x-grp.position.x,p.z-grp.position.z)<0.16){cur=1;off=V(grp.position.x-p.x,0,grp.position.z-p.z);sfx.pick()}};
 K.pm=p=>{if(phase==='roll'){if(lx==null)return;toolAt(V(p.x,0,p.z),'cl',home.y+0.05);const d=p.x-lx;lx=p.x;if(Math.abs(p.z-home.z)>0.2)return;const sg=Math.sign(d);if(sg&&sg!==dir){if(Math.abs(run)>0.07){rolls++;sc.push(clamp(Math.abs(run)/0.15,0.4,1));shape();noise(0.12,0.03,400,0.35,0,180);tipStep(`Kili ileri geri yuvarla · ${rolls}/${N}`);if(rolls>=N)toAttach()}run=0;dir=sg}run+=d;c.rotation.x+=d*12;return}
  if(cur){grp.position.set(p.x+off.x,home.y+0.06,p.z+off.z)}};
 K.pu=()=>{if(phase==='roll'){lx=null;return}if(!cur)return;cur=null;const t=tw(),d=Math.hypot(grp.position.x-t.x,grp.position.z-t.z);
  if(d<0.1){sc.push(clamp(1-d/0.1,0.4,1));K.work.remove(grp);K.work.remove(mark);if(ku){ku.visible=true;ku.scale.setScalar(0.3);tween(0.3,q=>ku.scale.setScalar(0.3+0.7*q))}puff(V(t.x,Y+0.12,t.z),6,K.p.sheet||'#d9c8b0');sfx.drop();K.pd=K.pm=K.pu=null;fin(clamp(avg(sc)-(tt-t0>40?0.15:0),0.3,1),'Kulp kupaya yapıştı!')}
  else{const fr=grp.position.clone();tween(0.25,q=>grp.position.lerpVectors(fr,home,q));toast('Kulbu kupanın yanındaki halkaya bırak',900)}};
 const toAttach=()=>{phase='att';toolUp&&toolUp();const k0=c.scale.clone();tween(0.35,q=>{c.scale.set(k0.x,k0.y*(1-0.35*q),k0.z)});const t=tw();mark.position.set(t.x-BC.x,0,t.z-BC.z);mark.visible=true;tipStep('Kulbu kupanın yanına sürükle')};
 K.skipFn=()=>{K.work.remove(grp);K.work.remove(mark);if(ku)ku.visible=true}}
/* Nazar: cam katmanları */
function bLayer(){const L=[{r:0.112,c:'#ffffff',ad:'Beyaz'},{r:0.072,c:'#7fc8f0',ad:'Açık mavi'},{r:0.036,c:'#151313',ad:'Siyah'}];let i=0,cur=null,off=null,sc=[];const NZ=K.p.id==='nazar';if(NZ&&!K.m3)grow3D(1);const EY=NZ&&K.m3?K.m3.g.children.slice(1):[];EY.forEach(c=>c.visible=false);const top=K.top;
 const EYon=()=>{if(!EY.length)return;D.forEach(m=>K.work.remove(m));EY.forEach(c=>c.visible=true)};K.hy=top+0.02;
 const D=L.map((l,k)=>{const m=put(K.work,Cy(l.r,l.r,0.008,24),M(l.c,0.15),BC.x+0.42,top+0.01,BC.z-0.18+k*0.17);m.userData.home=m.position.clone();return m});
 const ring=new THREE.Mesh(new THREE.TorusGeometry(L[0].r,0.003,4,32),new THREE.MeshBasicMaterial({color:'#ffd23a'}));ring.rotation.x=Math.PI/2;ring.position.set(BC.x,top+0.006,BC.z);K.work.add(ring);
 const tip=()=>{if(i<L.length){ring.geometry.dispose();ring.geometry=new THREE.TorusGeometry(L[i].r,0.003,4,32);tipStep(`${L[i].ad} katmanı ${i+1}/${L.length} · ortaya sürükle`)}};tip();
 K.pd=p=>{const m=D[i];if(m&&Math.hypot(m.position.x-p.x,m.position.z-p.z)<0.14){cur=m;off=V(m.position.x-p.x,0,m.position.z-p.z);sfx.pick()}};
 K.pm=p=>{if(!cur)return;cur.position.set(p.x+off.x,top+0.03,p.z+off.z)};
 K.pu=()=>{if(!cur)return;const m=cur;cur=null;const d=Math.hypot(m.position.x-BC.x,m.position.z-BC.z);if(d<0.07){sc.push(clamp(1-d/0.07,0.3,1));const fr=m.position.clone(),to=V(BC.x,top+0.004+i*0.004,BC.z);tween(0.2,q=>m.position.lerpVectors(fr,to,q));sfx.drop();puff(to,4,L[i].c);i++;if(i>=L.length){K.work.remove(ring);setTimeout(EYon,260);fin(avg(sc),'Nazar katmanları tamam!')}else tip()}else{const fr=m.position.clone();tween(0.25,q=>m.position.lerpVectors(fr,m.userData.home,q));toast('Ortadaki halkaya bırak',700)}};
 K.skipFn=()=>{K.work.remove(ring);D.forEach((m,k)=>m.position.set(BC.x,top+0.004+k*0.004,BC.z));EYon()}}

function bHold(){K.hv=0;K.holding=false;const P=new THREE.Group(),wd=M('#5a3519');[-0.44,0.44].forEach(x=>{put(P,B(0.06,0.74,0.06),wd,x,0.37,0);put(P,B(0.13,0.04,0.13),M('#4a2c14'),x,0.02,0)});put(P,B(1.0,0.07,0.1),wd,0,0.75,0);
const sc=put(P,Cy(0.017,0.017,0.9,8),M('#9a9aa0',0.35),0,0,0),wh=new THREE.Group(),tr=put(wh,new THREE.TorusGeometry(0.1,0.012,6,20),M('#8a5530'),0,0,0);tr.rotation.x=Math.PI/2;for(let i=0;i<2;i++)put(wh,B(0.22,0.014,0.014),M('#8a5530'),0,0,0).rotation.y=i*Math.PI/2;P.add(wh);
const pl=new THREE.Group();put(pl,B(0.62,0.04,0.72),M('#8a5530'),0,0,0);put(pl,B(0.64,0.012,0.74),M('#7a7a80',0.35),0,0.026,0);P.add(pl);P.userData={sc,wh,pl};P.position.set(BC.x,K.top+0.6,BC.z);K.press=P;K.work.add(P);K.dev=null;if(K.st.tool){P.visible=false;const d=new THREE.Group();d.position.set(BC.x+0.42,Y,BC.z-0.05);K.work.add(d);K.dev=d;if(K.st.tool==='kompresor'){put(d,Cy(0.09,0.09,0.26,14),M('#c0392b',0.4),0,0.13,0);put(d,Cy(0.035,0.035,0.01,12),M('#f4ecd8'),0,0.2,0.09).rotation.x=Math.PI/2;const ho=put(d,new THREE.TorusGeometry(0.16,0.01,5,16,Math.PI),M('#222'),-0.2,0.12,0);ho.rotation.y=Math.PI/2}else{place('solder',{par:d,w:0.28});const f=put(d,new THREE.ConeGeometry(0.025,0.09,8),new THREE.MeshBasicMaterial({color:'#4aa8ff'}),-0.35,0.08,0.05);f.rotation.z=Math.PI/2;d.userData.flame=f}}pressPos(0);tween(0.35,k=>P.position.y=K.top+0.6*(1-k));
ui.act.innerHTML='<div class="gauge"><div class="gz"></div><div class="gf" id="gf"></div></div>';const b=btn('Basılı tut','g');b.style.minWidth='60%';
b.onpointerdown=e=>{e.preventDefault();K.holding=true};b.onpointerup=b.onpointerleave=b.onpointercancel=()=>{if(K.holding)eHold()};b.oncontextmenu=e=>e.preventDefault();ui.act.appendChild(b)}
function pressPos(v){const P=K&&K.press;if(!P)return;const k=Math.min(1,v/100),py=0.38-0.34*k,U=P.userData;U.pl.position.y=py;U.sc.position.y=py+0.47;U.wh.position.y=py+0.92;U.wh.rotation.y=k*9;if(K.piece)K.piece.scale.z=K.st&&K.st.tool==='kompresor'?0.55+0.45*k:1-0.35*Math.max(0,k-0.8)/0.2;if(K.dev&&K.dev.userData.flame)K.dev.userData.flame.scale.setScalar(0.5+k*1.5)}
function eHold(){if(G.step!=='hold')return;sfx.thud();K.holding=false;const v=K.hv,s=v>=100?0.15:clamp(1-Math.abs(v-74)/38,0,1),P=K.press,w=K.work;if(P){puff(V(BC.x-0.3,K.top,BC.z),5);puff(V(BC.x+0.3,K.top,BC.z),5);K.press=null;const tmpK={press:P,piece:K.piece};tween(0.3,k=>{const U=P.userData,kk=Math.min(1,v/100)*(1-k),py=0.38-0.34*kk;U.pl.position.y=py;U.sc.position.y=py+0.47;U.wh.position.y=py+0.92;U.wh.rotation.y=kk*9;if(tmpK.piece)tmpK.piece.scale.z=1},()=>tween(0.3,k=>P.position.y=K.top+0.7*k,()=>w.remove(P)))}
stepDone(s,v>=100?'Fazla bastın!':v<50?'Az bastın':null)}
function bRub(){const sh=K.p.shape(),poly=sh.getPoints(40);let x0=9,x1=-9,y0=9,y1=-9;poly.forEach(p=>{x0=Math.min(x0,p.x);x1=Math.max(x1,p.x);y0=Math.min(y0,p.y);y1=Math.max(y1,p.y)});
const cells=[];for(let x=x0;x<=x1;x+=0.03)for(let y=y0;y<=y1;y+=0.03)if(pip(x,y,poly))cells.push({p:V(BC.x+x,K.top,BC.z-y),on:false});
if(K.is3d&&K.m3){const cs=[],bb=new THREE.Box3().setFromObject(K.m3.g),yMin=bb.min.y+(bb.max.y-bb.min.y)*0.3;cells.forEach(c=>{const h=hitTop(c.p.x,c.p.z);if(h&&h.y>yMin){c.p=V(h.x,h.y+0.002,h.z);cs.push(c)}});if(cs.length<=8){cs.length=0;for(let x=bb.min.x;x<=bb.max.x;x+=0.018)for(let z=bb.min.z;z<=bb.max.z;z+=0.018){const h=hitTop(x,z);if(h)cs.push({p:V(h.x,h.y+0.002,h.z),on:false})}}if(cs.length)cells.splice(0,cells.length,...cs)}K.cells=K.st.k==='oy'?cells.filter(c=>{const x=c.p.x-BC.x,y=-(c.p.z-BC.z);return (x/0.085)**2+((y-0.2)/0.13)**2<1}):cells;K.rubN=0;K.rubT0=-1;K.rubbing=false}
function pip(x,y,p){let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){if(((p[i].y>y)!==(p[j].y>y))&&(x<(p[j].x-p[i].x)*(y-p[i].y)/(p[j].y-p[i].y)+p[i].x))c=!c}return c}
function rubAt(p){if(K.rubT0<0)K.rubT0=tt;if(K.st.k==='torch')torchAt(p);else toolAt(p,({sekil:'cl',karistir:'mx',zimpara:'blk',incelt:'kz',oy:'sp'})[K.st.k]||'cl');sThr(({zimpara:sfx.sand,incelt:sfx.skive,oy:sfx.skive})[K.st.k]||sfx.wax,0.14);K.cells.forEach(c=>{if(!c.on&&Math.hypot(c.p.x-p.x,c.p.z-p.z)<0.05*eqMul(K.tool)){c.on=true;K.rubN++}});const cv=K.rubN/K.cells.length;tipStep('Tamamlandı: %'+Math.round(cv*100));if(cv>=0.92)eRub()}
function eRub(){if(G.step!=='rub')return;K.rubbing=false;const s=clamp(1.2-(tt-K.rubT0)/7,0.4,1),m=K.piece.material;
const rk=K.st.k;if(rk==='cila'){m.roughness=0.3;m.color.set(shade(K.p.sheet,-0.1));K.cila=true}else if(rk==='parlat')m.roughness=0.35;else if(rk==='zimpara')m.color.set(shade(K.p.sheet,0.1));else if(rk==='oy'||rk==='sekil')m.color.set(shade(K.p.sheet,-0.06));else if(rk==='karistir')m.color.set(shade(K.p.sheet,0.08));else if(rk==='torch'){if(TCH)TCH.visible=false;if(m.emissive){const e0=m.emissiveIntensity;tween(1.2,q=>m.emissiveIntensity=e0*(1-q))}m.color.set(shade(K.p.sheet,-0.04))}K.cells=null;stepDone(s,rk==='torch'?'Ateşte pişti!':null)}
function paintHex(){if(!K.color||!K.color.id)return K.p.sheet;if(K.painted)return K.color.hex;return '#'+new THREE.Color(K.p.sheet).lerp(new THREE.Color(K.color.hex),K.pn/K.pcN).getHexString()}
function mkPaint(){const bb=new THREE.Box3().setFromObject(K.model.g),cx=(bb.min.x+bb.max.x)/2,cz=(bb.min.z+bb.max.z)/2,rx=(bb.max.x-bb.min.x)/2,rz=(bb.max.z-bb.min.z)/2,c=[];
for(let x=-rx;x<=rx;x+=0.045)for(let z=-rz;z<=rz;z+=0.045)if((x/rx)**2+(z/rz)**2<=1)c.push({p:V(cx+x,Y+0.12,cz+z),on:false});K.pc=c;K.ptop=bb.max.y+0.005;TL.br.userData.tip.material.color.set(K.color.hex);K.pcN=c.length||1;K.pn=0}
function paintAt(p){sThr(sfx.brush,0.3);toolAt(p,'br',K.ptop);K.pc.forEach(c=>{if(!c.on&&Math.hypot(c.p.x-p.x,c.p.z-p.z)<0.085*eqMul('firca')){c.on=true;K.pn++}});const cv=K.pn/K.pcN;K.model.um.color.set(paintHex());K.model.um.roughness=0.45;tipStep('Boyandı: %'+Math.round(cv*100));
if(cv>=0.9){K.pc=null;K.painted=true;K.rubbing=false;sfx.good();build(false);renderDesign();tipStep('Boya tamam · Sürükleyip çevir, sonra Bitir')}}
function bDesign(){K.work.clear();if(TOOL)TOOL.visible=false;K.painted=false;K.pc=null;K.pn=0;K.pcN=1;K.nat={hex:K.p.sheet,ad:'Doğal'};K.color=K.p.need.boya?null:K.nat;K.rx=K.ry=0;K.style=K.p.styles?(G.order.style||K.p.styles[0]):null;build(true);renderDesign()}
function build(pop){if(K.model)K.work.remove(K.model.g);K.model=K.p.build(paintHex(),K.style,K);K.model.g.position.copy(BC);K.model.g.scale.setScalar(1.6);K.work.add(K.model.g);{const b=new THREE.Box3().setFromObject(K.model.g),z=b.getSize(V(0,0,0));K.mR=Math.max(z.x,z.z)/2;K.mH=z.y}applySpin();
if(pop){const g=K.model.g;g.scale.set(1.6,0.08,1.6);tween(0.45,k=>g.scale.set(1.6,0.08+1.52*k,1.6))}}
function applySpin(){if(!K||!K.model)return;const g=K.model.g;g.rotation.set(K.rx||0,K.ry||0,0);g.position.y=BC.y+(K.mR||0.2)*Math.abs(Math.sin(K.rx||0))+(K.mH||0)*(1-Math.cos(K.rx||0))*0.5+0.01}
function renderDesign(){const L=[];if(K.p.wood)L.push(btn('Doğal','l'+(K.color===K.nat?' sel':''),()=>{K.color=K.nat;K.pc=null;K.painted=false;build(false);renderDesign()}));
if(K.p.need.boya||K.p.wood)PAINTS.filter(p=>G.inv['boya_'+p.id]>0).forEach(p=>{const b=btn('','col'+(K.color===p?' sel':''),()=>{if(K.color===p)return;K.color=p;K.painted=false;K.pn=0;K.pcN=1;K.rx=K.ry=0;sfx.drop();build(false);mkPaint();renderDesign();tipStep('Parmağınla boyayı ürüne sür')});b.style.background=p.hex;b.setAttribute('aria-label',p.ad);L.push(b)});
if(K.p.styles)K.p.styles.forEach(st=>L.push(btn(st,'l'+(K.style===st?' sel':''),()=>{K.style=st;build(false);renderDesign()})));
L.push(btn('Bitir','g',finish,!K.color||(!!K.color.id&&!K.painted)));actions(L);tipStep((G.order.free?'Serbest tasarım':G.order.color||G.order.style?`Sipariş: ${[G.order.color&&G.order.color.ad,G.order.style].filter(Boolean).join(' · ')}`:K.p.wood?'İster boya, ister doğal bırak':'Tasarım')+' · Çevirmek için sürükle')}
const avg=a=>a.reduce((x,y)=>x+y,0)/a.length;
function finish(){if(!K.color||(K.color.id&&!K.painted))return;const o=G.order;if(K.color.id)G.inv['boya_'+K.color.id]--;K.rx=K.ry=0;applySpin();G.step=null;actions([]);tip(null);
if(o.rep){repFinish(o);return}
if(o.free){const work=avg(K.scores),stars=clamp(Math.round(work*5)-(K.skips?1:0),1,5),it={id:++G.sid,pid:K.p.id,col:K.color.id||null,style:K.style,stars};if(mqRoll(stars)){it.mq=1;G.st.mq=(G.st.mq||0)+1}it.price=sugg(it);K.res={item:it};
Q.forEach(x=>x.g.visible=true);const g=K.model.g,fr=g.position.clone();view='home';finCam(()=>{sway=1;showFree()});tween(1.1,k=>{g.position.lerpVectors(fr,V(2.3,1.6,-1.0),k);g.scale.setScalar(1.6-0.8*k)});return}
const work=avg(K.scores),colorOk=!o.color||K.color.id===o.color.id,styleOk=!o.style||K.style===o.style,late=K.late,B0=o.budget,L=[];let pay=B0;
const cut=(t,f)=>{const v=Math.round(B0*f);if(v>0){L.push([t,-v]);pay-=v}};
if(work<0.85)cut('İşçilik kusuru',(0.85-work)*0.6);if(K.skips)cut(`Eksik adım ×${K.skips}`,0.12*K.skips);if(!colorOk)cut('Yanlış renk',0.3);if(!styleOk)cut('Yanlış model',0.2);if(late)cut('Geç teslim',0.25);
const stars=clamp(Math.round((0.7*work+0.3*((colorOk?0.6:0)+(styleOk?0.4:0)))*5)-(late?1:0)-(K.skips?1:0),1,5);
if(o.hurry&&!late){const v=Math.round(B0*0.2);L.push(['Acele bonusu',v]);pay+=v}if(stars===5){L.push(['Bahşiş',15]);pay+=15}{const cb=comboPct();if(cb>0&&stars>=4){const v=Math.round(B0*cb);L.push([`🔥 Kombo x${K.cbM}`,v]);pay+=v}}let mq=0;if(mqRoll(stars)){mq=1;const v=Math.round(B0*0.5);L.push(['✨ Usta işi',v]);pay+=v}
pay=Math.max(Math.round(B0*0.15),pay);K.res={stars,pay,L,colorOk,styleOk,late,mq};
Q.forEach(x=>x.g.visible=true);const g=K.model.g,fr=g.position.clone();view='home';finCam(()=>{sway=1;showResult()});tween(1.1,k=>{g.position.lerpVectors(fr,V(0.25,Y,1.35),k);g.scale.setScalar(1.6-0.6*k)})}
function showFree(){G.phase='result';refresh();const it=K.res.item,pct=v=>'%'+Math.round(v*100);sfx.good();
openSheet('result',`<h3>${pr(it).ad} vitrine kondu</h3>${it.mq?'<div class="mqB">✨ Usta işi! Değeri %50 fazla ✨</div>':''}${K.cbM>=3?`<div class="cbB">🔥 En uzun kombo: x${K.cbM}</div>`:''}<div class="stars">${'★'.repeat(it.stars)}<i>${'★'.repeat(5-it.stars)}</i></div><div style="margin-top:8px">`+K.names.map((n,i)=>`<div class="brk"><span>${n}</span><b>${pct(K.scores[i])}</b></div>`).join('')+
`</div><div class="tot">Vitrin fiyatı: ${it.price} altın</div><p>Fiyatı Vitrin'de ürüne dokunarak değiştirebilirsin.</p><div style="text-align:center"><button class="btn g" id="freeOk">Tamam</button></div>`);$('freeOk').onclick=freeDone}
function freeDone(){show(ui.modal,false);modalMode=null;const it=K.res.item,w=K.work,g=K.model.g;if(G.stock.length<vitCap())G.stock.push(it);else{G.store=G.store||[];G.store.push(it);storeSync();setTimeout(()=>toast('Vitrin dolu, ürün depo rafına kondu',1800),600)}
cupRec(it.pid,it.stars);if(it.stars>=3){const e=G.cat[it.pid]||(G.cat[it.pid]={n:0,best:0});e.n++;e.best=Math.max(e.best,it.stars)}
tween(0.3,k=>g.scale.setScalar(Math.max(0.01,0.8*(1-k))),()=>craft.remove(w));G.phase='idle';G.order=null;vitrinSync();levelUp();save();refresh();if(Q[0]&&Q[0].at)present(Q[0])}
function showResult(){G.phase='result';refresh();const r=K.res,o=G.order;G.bubOn=true;if(r.stars>=4){sfx.good();anim(Q[0],'clap',true)}else sfx.bad();
say(r.late?'Çok geç kaldınız ama...':r.stars>=5?'Muhteşem olmuş, elinize sağlık!':r.stars>=4?'Çok güzel, teşekkürler!':!r.colorOk?'Bu renk istediğim değildi!':!r.styleOk?'Ben başka bir model istemiştim...':K.skips?'Bu yarım kalmış gibi...':r.stars>=3?'Fena değil.':'Hmm, biraz özensiz...');
const pct=v=>'%'+Math.round(v*100);
let h=`<h3>${o.p.ad} hazır</h3>${r.mq?'<div class="mqB">✨ Usta işi! ✨</div>':''}${K.cbM>=3?`<div class="cbB">🔥 En uzun kombo: x${K.cbM}</div>`:''}<div class="stars">${'★'.repeat(r.stars)}<i>${'★'.repeat(5-r.stars)}</i></div><div style="margin-top:8px">`+K.names.map((n,i)=>`<div class="brk"><span>${n}</span><b>${pct(K.scores[i])}</b></div>`).join('')+
`<div class="brk" style="margin-top:6px"><span>Anlaşılan fiyat</span><b>${o.budget}</b></div>`+r.L.map(l=>`<div class="brk"><span>${l[0]}</span><b class="${l[1]<0?'cutc':'bonc'}">${l[1]>0?'+':'−'}${Math.abs(l[1])}</b></div>`).join('')+
`</div><div class="tot">Ödeme: ${r.pay} altın</div><div style="text-align:center"><button class="btn g" id="deliver">Teslim et</button></div>`;
openSheet('result',h);$('deliver').onclick=deliver}
function deliver(){show(ui.modal,false);modalMode=null;const r=K.res,c=Q[0],pid=G.order.p.id,ord=G.order;cupRec(pid,r.stars);G.reg=G.reg||[];if(ord.reg){const rg=G.reg.find(x=>x.ad===ord.reg);if(rg)rg.vis++;if(r.stars>=4){const tip=Math.round(r.pay*0.15);G.gold+=tip;setTimeout(()=>toast(`${ord.reg} bahşiş bıraktı: +${tip}`,1600),1400)}}else if(r.stars>=5&&G.reg.length<8&&Math.random()<0.5&&Q[0]&&Q[0].sex){const sx=Q[0].sex,nm=(sx==='f'?RN_F:RN_M).filter(n=>!G.reg.some(x=>x.ad===n));if(nm.length){const ad=pick(nm);G.reg.push({ad,fav:pid,vis:1,sex:sx});setTimeout(()=>toast(`${ad} müdavimin oldu!`,1800),1500)}}G.gold+=r.pay;G.st.earned+=r.pay;sfx.cash();G.st.deliv++;chDeliv();if(r.stars>=4&&dB('tip')){const tp=Math.round(r.pay*dB('tip'));if(tp>0){G.gold+=tp;setTimeout(()=>toast(`Müzik keyfi bahşişi: +${tp} altın`,1500),2600)}}if(r.stars>=3&&Math.random()<dB('rep'))G.rep+=1;if(r.stars===5)G.st.five++;if(r.mq)G.st.mq=(G.st.mq||0)+1;setTimeout(()=>gemRoll(r.stars===5?GEM_P.bes:GEM_P.teslim,'Müşteri elmas hediye etti!'),1800);G.rep=Math.max(0,G.rep+({5:3,4:2,3:1}[r.stars]||-2));if(ord.vip&&r.stars>=3){const vr=Math.round(20*r.stars/5);G.rep+=vr;setTimeout(()=>toast('Usta müşteri memnun kaldı: +'+vr+' itibar',2000),1300)}
if(r.stars>=3){const e=G.cat[pid]||(G.cat[pid]={n:0,best:0});e.n++;e.best=Math.max(e.best,r.stars)}
if(G.first){G.first=false;spawnT=5}G.phase='leaving';G.order=null;G.n++;
levelUp();
refresh();actions([]);const g=K.model.g,w=K.work;tween(0.4,k=>g.scale.setScalar(Math.max(0.01,1-k)),()=>craft.remove(w));toast('+'+r.pay+' altın',1200);sfx.coin();if(r.stars===5)sfx.fan();save();
setTimeout(()=>{G.bubOn=false;say(null);leave(c)},1300)}
