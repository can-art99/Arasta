/* ---------- ürüne özel mekanikler 2 ---------- */
const LP=q=>{const v=V(BC.x+q[0],K.top,BC.z+q[1]);return K.is3d?onSurf(v):v};
function shapeBB(){const pts=K.p.shape().getPoints(40);let x0=9,x1=-9,y0=9,y1=-9;pts.forEach(p=>{x0=Math.min(x0,p.x);x1=Math.max(x1,p.x);y0=Math.min(y0,p.y);y1=Math.max(y1,p.y)});return {x0,x1,z0:-y1,z1:-y0,w:x1-x0,l:y1-y0}}
function swingRig(n,o,ry,pad){const w=fitM(n,o);if(!w)return null;w.rotation.y=ry||0;const g=new THREE.Group(),piv=new THREE.Group();g.add(piv);piv.add(w);g.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(w),cx=bb.min.x+(pad||0.035),cz=(bb.min.z+bb.max.z)/2,hx=bb.max.x-0.02,hy=(bb.min.y+bb.max.y)/2;piv.position.set(hx-cx,hy-bb.min.y,0);w.position.x-=hx;w.position.y-=hy;w.position.z-=cz;g.userData.p=piv;return g}
function visUp(o){while(o){if(o.visible===false)return false;o=o.parent}return true}
function surfY(x,z,def,ex){K.work.updateMatrixWorld(true);SRC.set(V(x,Y+3,z),V(0,-1,0));const hs=SRC.intersectObject(K.work,true).filter(h=>{const o=h.object;if(!o.isMesh||!visUp(o))return false;const m=o.material;if(!m||m.transparent||m.type==='MeshBasicMaterial')return false;let q=o;while(q){if(ex.includes(q)||q===TOOL)return false;q=q.parent}return true});return hs.length?Math.max(def,hs[0].point.y):def}
const METK=['bakir','pirinc','demir','celik','altin'];
function cutKind(){const st=K.st||{};if(st.hole)return 'kn';if(st.glass)return 'gc';if(st.wood)return 'sw';if(K.p.cut==='kn')return 'kn';if(METK.some(k=>K.p.need[k]))return 'ax';if(K.p.hard)return 'sw';return 'sc'}
function mkTool(kind){const g=new THREE.Group(),dk=M('#2a2420',0.7),st=M('#c8ccd0',0.25);
 if(kind==='havya'){const h=put(g,Cy(0.016,0.018,0.14,10),M('#3a6a8a',0.6),0,0.13,0.05);h.rotation.x=0.5;const s=put(g,Cy(0.005,0.006,0.1,8),st,0,0.05,0.012);s.rotation.x=0.5;const t=put(g,new THREE.ConeGeometry(0.006,0.025,8),M('#b06a2a',0.4),0,0.008,0);t.rotation.x=Math.PI}
 else if(kind==='hammer'){const piv=new THREE.Group();piv.position.x=0.27;g.add(piv);g.rotation.y=-0.5;const p=new THREE.Group();p.position.x=-0.27;piv.add(p);put(p,B(0.11,0.04,0.04),st,0,0,0);put(p,Cy(0.012,0.012,0.22,8),M('#7a4a2a'),0.07,0,0).rotation.z=Math.PI/2;p.children[1].position.x=0.13;g.userData.p=piv;{const R=swingRig('m_sledge',{rz:Math.PI/2,w:0.3},Math.PI/2,0.03);if(R){piv.visible=false;g.add(R);g.userData.p=R.userData.p;g.userData.rig=1}}}
 else if(kind==='drill'){put(g,B(0.06,0.12,0.05),M('#d07a2a',0.5),0,0.2,0);put(g,B(0.05,0.07,0.04),dk,0,0.12,0.03);const b=put(g,Cy(0.004,0.004,0.12,6),st,0,0.06,0);g.userData.bit=b}
 else if(kind==='plane'){put(g,B(0.09,0.035,0.2),M('#8a5a30',0.7),0,0.02,0);put(g,Cy(0.018,0.018,0.04,8),dk,0,0.055,0.06);put(g,B(0.07,0.03,0.02),st,0,0.045,-0.02)}
 else if(kind==='shuttle'){const s=put(g,new THREE.SphereGeometry(0.03,10,6),M('#a0703a',0.6),0,0.02,0);s.scale.set(2.4,0.6,0.7)}
 else if(kind==='gouge'){put(g,Cy(0.012,0.014,0.13,8),M('#7a4a2a'),0,0.1,0.04).rotation.x=0.5;put(g,Cy(0.006,0.01,0.05,8),st,0,0.025,0.008).rotation.x=0.5}
 g.visible=false;K.work.add(g);return g}

/* Gözlük: havya ucunu dolaştırarak lehim */
function bPath(){const st=K.st,tool=mkTool('havya'),N=36,P=[];(st.paths||[]).forEach(pp=>pp.forEach(q=>P.push({v:V(BC.x+q[0],K.top+0.002,BC.z+q[1]),on:false})));
 const dm=new THREE.MeshBasicMaterial({color:'#fff6d8'}),gh=new THREE.Group();P.forEach((q,i)=>{if(i%2)return;const d=put(gh,Cy(0.004,0.004,0.002,6),dm,q.v.x,q.v.y,q.v.z);d.castShadow=false});K.work.add(gh);
 let n=0,dev=0,dn=0,sm=0;const mv=p=>{tool.visible=true;tool.position.set(p.x,K.top+0.004,p.z);let best=null,bd=9;P.forEach(q=>{const d=Math.hypot(q.v.x-p.x,q.v.z-p.z);if(d<bd){bd=d;best=q}});dev+=Math.min(bd,0.06);dn++;
  if(best&&bd<0.03&&!best.on){best.on=true;n++;const b=put(K.work,new THREE.SphereGeometry(0.008,6,5),new THREE.MeshStandardMaterial({color:'#c8ccd0',roughness:0.3,emissive:'#ff7a20',emissiveIntensity:1.6}),best.v.x,best.v.y+0.003,best.v.z);tween(1.2,k=>b.material.emissiveIntensity=1.6*(1-k));if(tt-sm>0.25){sm=tt;puff(V(p.x,K.top+0.03,p.z),2,'#d8d8d8');noise(0.1,0.02,2500,0.5,0,1200)}}
  tipStep(`Lehim · %${Math.round(n/P.length*100)}`);if(n/P.length>=0.9)end()};
 const end=()=>{const s=clamp(1-(dev/Math.max(dn,1)-0.006)/0.03,0.35,1);K.work.remove(gh);tool.visible=false;fin(s,'Lehim tamam!')};
 K.pd=mv;K.pm=mv;K.pu=()=>{tool.visible=false};K.skipFn=()=>{K.work.remove(gh);K.work.remove(tool)};tipStep('Havyanın ucunu çizgide gezdir')}

/* Çekiçle zımba / perçin */
function bHammer(){const st=K.st,hits=st.hits||2,riv=st.kind==='rivet',P=st.pts.map(LP),hm=mkTool('hammer');let i=0,h=0,sc=[],miss=0;
 const mk=new THREE.Mesh(new THREE.TorusGeometry(riv?0.03:0.022,riv?0.005:0.003,5,20),new THREE.MeshBasicMaterial({color:'#ffd23a'}));mk.rotation.x=Math.PI/2;K.work.add(mk);
 const TY=P.map(v=>surfY(v.x,v.z,v.y,[hm,mk]));
 const ghost=P.map((v,k)=>{const m=put(K.work,Cy(riv?0.016:0.012,riv?0.016:0.012,0.002,10),new THREE.MeshBasicMaterial({color:'#fff6d8',transparent:true,opacity:riv?0.85:0.5}),v.x,TY[k]+0.002,v.z);m.castShadow=false;return m});
 let cur=null;const place=()=>{const v=P[i],ty=TY[i];mk.position.set(v.x,ty+0.005,v.z);cur=st.kind==='dent'?put(K.work,Cy(0.014,0.014,0.002,10),new THREE.MeshBasicMaterial({color:'#000',transparent:true,opacity:0.18}),v.x,v.y+0.001,v.z):riv?put(K.work,Cy(0.013,0.016,0.012,10),M('#c9a23a',0.3),v.x,ty+0.006,v.z):put(K.work,Cy(0.006,0.006,0.003,10),M('#1d1612'),v.x,v.y+0.001,v.z);tipStep(`${st.kind==='dent'?'Dövme':riv?'Perçin':'Zımba'} ${i+1}/${P.length} · ${hits} kez vur`)};place();
 K.tick=()=>{mk.scale.setScalar(1+Math.sin(tt*8)*0.15)};
 K.pd=p=>{const v=P[i],d=Math.hypot(p.x-v.x,p.z-v.z);hm.visible=true;hm.position.set(v.x,(riv?TY[i]+0.012:v.y)+(hm.userData.rig?0.002:0.025),v.z);const P2=hm.userData.p,ok=d<=0.07,pc=(K.is3d&&K.m3)?K.m3.g:K.piece,hv=V(v.x,hm.position.y,v.z);
  strike(a=>P2.rotation.z=a,{own:hm,rest:-0.6,top:-1.42,hit:0,wind:0.08,fall:0.1,pow:2.8,reb:0.22,settle:0.26,onHit:()=>{if(ok){sfx.punch();puff(hv,3,'#c9a37a');impactFx(1,pc)}else impactFx(0.4)},done:()=>{const id=hm.sid;tween(0.16,k=>{if(hm.sid===id)P2.rotation.z=-0.9*k},()=>{if(hm.sid===id)hm.visible=false})}});
  if(!ok){miss++;sfx.bad();toast('Iskaladın',400);return}sc.push(clamp(1-d/0.07,0.3,1));h++;
  if(st.kind==='dent'){}else if(riv){cur.position.y=TY[i]+0.006-0.005*h/hits;cur.scale.set(1+0.25*h/hits,1,1+0.25*h/hits)}else cur.scale.set(1+h*0.6,1,1+h*0.6);
  if(h>=hits){h=0;ghost[i].visible=false;i++;if(i>=P.length){K.work.remove(mk);fin(clamp(avg(sc)-miss*0.05,0.2,1),st.kind==='dent'?'İyi dövüldü!':riv?'Perçinler sağlam!':'Delikler açıldı!');return}place()}};
 K.skipFn=()=>{K.work.remove(mk);K.work.remove(hm);ghost.forEach(g=>K.work.remove(g))}}

/* Cüzdan: katlama */
function bFold(){const bb=shapeBB(),w=bb.w,l=bb.l,th=K.p.wood?0.03:0.012,col=K.p.sheet;if(K.piece&&K.piece.visible!==undefined)K.piece.visible=false;
 const bot=flat(rrect(w,l/2,0.02),th,col);bot.position.set(BC.x,Y,BC.z+l/4);K.work.add(bot);const pv=new THREE.Group();pv.position.set(BC.x,Y+th,BC.z);K.work.add(pv);const fl=flat(rrect(w,l/2,0.02),th,shade(col,0.06));fl.position.set(0,-th,-l/4);pv.add(fl);
 const ar=dashRing(0.03,Y+0.004,1);K.work.remove(ar);let ang=0,z0=null;K.hy=Y+th;
 K.pd=p=>{z0=p.z};K.pm=p=>{if(z0==null)return;ang=clamp((p.z-(BC.z-l/4))/(l/2),0,1)*Math.PI;pv.rotation.x=ang;toolAt(V(p.x,0,p.z),'cl',Y+0.04+Math.sin(ang)*l/4);tipStep(`Katla · %${Math.round(ang/Math.PI*100)}`)};
 K.pu=()=>{if(ang>=Math.PI*0.9){const a0=ang;tween(0.15,k=>pv.rotation.x=a0+(Math.PI-a0)*k,()=>{sfx.thud();puff(V(BC.x,Y+th*2,BC.z+l/4),5)});K.top=Y+th*2+0.001;fin(clamp(ang/Math.PI,0.5,1),'Düzgün katlandı!')}else{const a0=ang;tween(0.25,k=>pv.rotation.x=a0*(1-k));ang=0}};
 K.skipFn=()=>{pv.rotation.x=Math.PI;K.top=Y+th*2+0.001};tipStep('Üst yarıyı tutup aşağı katla')}

/* Bağcık geçirme */
function bLace(){const P=K.st.pts.map(LP);let i=1,miss=0;const ey=P.map(v=>put(K.work,new THREE.TorusGeometry(0.01,0.003,5,12),M('#c9c9c9',0.3),v.x,v.y+0.002,v.z));ey.forEach(e=>e.rotation.x=Math.PI/2);
 let live=null;const lm='#f4f0e6',seg=(a,b)=>{const g=lineSeg(K.work,a,b,lm,0.008);g.position.y=Math.max(a.y,b.y)+0.006;return g};
 const mv=p=>{const a=P[i-1],q=V(p.x,a.y,p.z);if(live)K.work.remove(live);live=seg(a,q);toolAt(V(p.x,0,p.z),'nd',a.y+0.01);const b=P[i];if(Math.hypot(p.x-b.x,p.z-b.z)<0.035){K.work.remove(live);live=null;seg(a,b);sfx.stitch();i++;tipStep(`Bağcık ${i-1}/${P.length-1}`);if(i>=P.length){fin(clamp(1-miss*0.08,0.3,1),'Bağcık geçti!')}}};
 K.pd=mv;K.pm=mv;K.pu=()=>{if(live){K.work.remove(live);live=null;miss++}};K.skipFn=()=>{if(live)K.work.remove(live)};tipStep('Bağcığı sıradaki deliğe sürükle')}

/* Atkı: tezgâhta dokuma */
function bShuttle(){const n=K.st.n||10,bb=shapeBB(),W=bb.w,L=bb.l,sh=mkTool('shuttle'),rows=[],z0=BC.z+bb.z0;let side=0,dz=0,dn=0;K.hy=Y+0.012;
 const warp=new THREE.Group(),wm=M(shade(K.p.sheet,-0.2));for(let j=0;j<9;j++)put(warp,B(0.003,0.004,L+0.06),wm,BC.x-W/2+W*j/8,Y+0.002,BC.z+(bb.z0+bb.z1)/2);K.work.add(warp);
 const add=()=>{const k=rows.length,r=put(K.work,B(W,0.012,L/n+0.002),M(shade(K.p.sheet,k%2?-0.05:0.04),0.95),BC.x,Y+0.006,z0+L/n*(k+0.5));r.scale.x=0.01;tween(0.2,q=>r.scale.x=Math.max(0.01,q));rows.push(r);sfx.brush();tipStep(`Sıra ${rows.length}/${n}`);if(rows.length>=n)end()};
 const mv=p=>{const zc=z0+L/n*(rows.length+0.5);sh.visible=true;sh.position.set(clamp(p.x,BC.x-W/2-0.08,BC.x+W/2+0.08),Y+0.014,zc);dz+=Math.min(Math.abs(p.z-zc),0.1);dn++;const s=p.x<BC.x-W*0.35?-1:p.x>BC.x+W*0.35?1:0;if(s&&s!==side){if(side!==0)add();side=s}};
 const end=()=>{rows.forEach(r=>K.work.remove(r));K.work.remove(warp);sh.visible=false;K.piece=flat(K.p.shape(),K.p.wood?0.03:0.012,K.p.sheet);K.piece.position.copy(BC);K.work.add(K.piece);fin(clamp(1-(dz/Math.max(dn,1)-0.03)/0.08,0.35,1),'Kumaş dokundu!')};
 K.pd=mv;K.pm=mv;K.skipFn=()=>{rows.forEach(r=>K.work.remove(r));K.work.remove(warp);K.piece=flat(K.p.shape(),K.p.wood?0.03:0.012,K.p.sheet);K.piece.position.copy(BC);K.work.add(K.piece)};tipStep('Mekiği bir uçtan diğerine kaydır')}

/* Kaşık: oyma kalemiyle oyma */
function bChisel(){const g=mkTool('gouge'),cells=[];for(let x=-0.085;x<=0.085;x+=0.022)for(let y=0.07;y<=0.33;y+=0.022)if((x/0.085)**2+((y-0.2)/0.13)**2<1)cells.push({p:V(BC.x+x,K.top,BC.z-y),on:false});
 const dm=new THREE.MeshBasicMaterial({color:'#5a3a1a',transparent:true,opacity:0.55});cells.forEach(c=>{c.m=put(K.work,Cy(0.005,0.005,0.002,6),dm,c.p.x,c.p.y+0.001,c.p.z);c.m.castShadow=false});
 const hol=put(K.work,Cy(0.085,0.085,0.003,24),new THREE.MeshStandardMaterial({color:shade(K.p.sheet,-0.35),transparent:true,opacity:0}),BC.x,K.top+0.001,BC.z-0.2);hol.scale.z=0.13/0.085;let taps=0,rm=0;
 K.pd=p=>{taps++;g.visible=true;g.position.set(p.x,K.top+0.02,p.z);tween(0.12,k=>g.position.y=K.top+0.02-0.015*Math.sin(k*Math.PI),()=>g.visible=false);let got=0;cells.forEach(c=>{if(!c.on&&Math.hypot(c.p.x-p.x,c.p.z-p.z)<0.04){c.on=true;got++;rm++;K.work.remove(c.m)}});
  if(got){sfx.skive();const ch=put(K.work,new THREE.TorusGeometry(0.012,0.004,4,8,Math.PI*1.3),M(shade(K.p.sheet,0.1)),p.x,K.top+0.01,p.z);const a=Math.random()*6.28;tween(0.5,k=>{ch.position.set(p.x+Math.cos(a)*0.12*k,K.top+0.01+Math.sin(k*Math.PI)*0.08,p.z+Math.sin(a)*0.12*k);ch.rotation.x+=0.3},()=>K.work.remove(ch))}else sfx.tap();
  const pr=rm/cells.length;hol.material.opacity=0.85*pr;tipStep(`Oyma · %${Math.round(pr*100)}`);if(pr>=0.9){cells.forEach(c=>{if(!c.on)K.work.remove(c.m)});fin(clamp(cells.length/(taps*3)*1.2,0.35,1),'Çukur oyuldu!')}};
 K.skipFn=()=>{cells.forEach(c=>K.work.remove(c.m));hol.material.opacity=0.85};tipStep('Kaşığın çukuruna kalemle vur')}

/* Kesme tahtası: rende */
function bPlane(){const n=K.st.n||6,bb=shapeBB(),L=bb.l,tl=mkTool('plane'),mat=K.piece&&K.piece.material;let s0=null,cnt=0,dx=0,dn=0,lx=0;const c0=mat?mat.color.clone():null,c1=new THREE.Color(shade(K.p.sheet,0.12));
 const mv=p=>{tl.visible=true;tl.position.set(p.x,K.top,p.z);if(s0==null){s0=p.z;lx=p.x;return}dx+=Math.min(Math.abs(p.x-lx),0.1);dn++;if(Math.abs(p.z-s0)>=L*0.7){cnt++;s0=p.z;sfx.skive();
  const sv=put(K.work,new THREE.TorusGeometry(0.02,0.006,4,10,Math.PI*1.6),M(shade(K.p.sheet,0.15)),p.x,K.top+0.04,p.z);tween(0.6,k=>{sv.position.y=K.top+0.04+k*0.1;sv.position.x=p.x+0.1*k;sv.rotation.z+=0.2;sv.scale.setScalar(1-0.5*k)},()=>K.work.remove(sv));
  if(mat)mat.color.copy(c0).lerp(c1,cnt/n);tipStep(`Rende ${cnt}/${n}`);if(cnt>=n){tl.visible=false;fin(clamp(1-(dx/Math.max(dn,1)-0.005)/0.03,0.35,1),'Pürüzsüz yüzey!')}}};
 K.pd=p=>{s0=null;mv(p)};K.pm=mv;K.pu=()=>{s0=null;tl.visible=false};K.skipFn=()=>K.work.remove(tl);tipStep('Rendeyi tahta boyunca baştan sona it')}

/* Matkap ile delme */
function bDrill(){const P=K.st.pts.map(LP),dr=mkTool('drill');let i=0,dp=0,on=false,sc=[];
 ui.act.innerHTML=`<div class="gauge"><div class="gz" style="left:75%;width:15%"></div><div class="gf" id="gf"></div></div>`;
 const b=btn('Basılı tut: del','g');b.style.minWidth='60%';const set=v=>{on=v;if(!v&&dp>0.05)rel()};b.onpointerdown=e=>{e.preventDefault();set(true)};b.onpointerup=b.onpointerleave=b.onpointercancel=()=>{if(on)set(false)};b.oncontextmenu=e=>e.preventDefault();ui.act.appendChild(b);
 const show=()=>{const v=P[i];dr.visible=true;dr.position.set(v.x,v.y+0.02,v.z);tipStep(`Delik ${i+1}/${P.length} · yeşilde bırak`)};show();let hole=null;
 const rel=()=>{const v=P[i],s=dp>1?0.15:clamp(1-Math.abs(dp-0.82)/0.3,0.25,1);sc.push(s);if(dp>1){puff(v,6,'#c9a37a');sfx.bad();toast('Fazla deldin!',600)}else sfx.pick();dp=0;i++;hole=null;const gf=$('gf');if(gf)gf.style.width='0%';if(i>=P.length){dr.visible=false;K.tick=null;fin(avg(sc),'Delikler hazır!')}else show()};
 K.tick=dt=>{const bit=dr.userData.bit;if(on){bit.rotation.y+=dt*40;dp+=dt*0.45;const v=P[i];dr.position.y=v.y+0.02-0.015*Math.min(dp,1);if(!hole)hole=put(K.work,Cy(0.008,0.008,0.003,10),M('#1d1612'),v.x,v.y+0.001,v.z);hole.scale.set(Math.min(dp,1.2),1,Math.min(dp,1.2));if(Math.random()<dt*12)puff(V(v.x,v.y+0.01,v.z),1,'#e8d8b8');if(Math.random()<dt*8)noise(0.06,0.02,3000,0.5,0,1500)}
  const gf=$('gf');if(gf)gf.style.width=Math.min(100,dp*100)+'%';if(dp>1.05&&on){on=false;rel()}};
 K.pd=()=>set(true);K.pu=()=>{if(on)set(false)};K.skipFn=()=>K.work.remove(dr)}
