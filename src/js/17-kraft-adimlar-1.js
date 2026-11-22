/* ---------- ürüne özel mekanikler ---------- */
function ellShape(rx,ry){const s=new THREE.Shape(),N=36;for(let i=0;i<=N;i++){const t=i/N*Math.PI*2;i?s.lineTo(Math.cos(t)*rx,Math.sin(t)*ry):s.moveTo(rx,0)}return s}
function grow3D(f0){K.is3d=true;const st=K.p.styles?(G.order.style||K.p.styles[0]):null,m=(K.p.craft||K.p.build)(K.p.sheet,st,K);K.work.children.forEach(c=>c.visible=false);m.g.position.copy(BC);K.work.add(m.g);K.m3=m;
 K.piece={material:m.um,scale:{set z(v){m.g.scale.y=1.6*v},get z(){return m.g.scale.y/1.6}}};m.g.scale.setScalar(1.6);m.g.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(m.g);K.fullBB=bb;gF(f0||0.04);return m}
function gF(f){const g=K.m3.g;g.scale.set(1.6,1.6*Math.max(0.02,f),1.6);g.updateMatrixWorld(true);K.top=new THREE.Box3().setFromObject(g).max.y+0.002};
const angAt=p=>Math.atan2(p.z-BC.z,p.x-BC.x),wrapA=a=>{while(a>Math.PI)a-=Math.PI*2;while(a<-Math.PI)a+=Math.PI*2;return a};
function dashRing(r,y,n,col){const g=new THREE.Group(),m=new THREE.MeshBasicMaterial({color:col||'#fff6d8',transparent:true,opacity:0.85});for(let i=0;i<n;i++){const a=i/n*Math.PI*2,d=put(g,B(0.012,0.003,Math.PI*2*r/n*0.55),m,BC.x+Math.cos(a)*r,y,BC.z+Math.sin(a)*r);d.rotation.y=-a;d.castShadow=false}K.work.add(g);return g}
function hookClear(){K.pd=K.pm=K.pu=K.tick=K.skipFn=null;K.pdn=false;K.hy=null}
let exTm=0;function exitTap(){const e=$('exitC');if(!e.classList.contains('exa')){e.classList.add('exa');e.textContent=G.order&&G.order.free?'Çık? Malzeme iade':'Siparişten çık?';clearTimeout(exTm);exTm=setTimeout(()=>{e.classList.remove('exa');e.innerHTML='<b>✕</b>Çık'},4000);return}clearTimeout(exTm);cancelCraft()}
function cancelCraft(){if(G.phase!=='craft'||!K)return;const o=G.order;K.dead=true;hookClear();try{toolUp&&toolUp()}catch(e){}if(K.dot)K.dot.live=false;K.holding=false;K.rubbing=false;
 Object.entries(o.p.need).forEach(([k,n])=>{if(k!=='boya')G.inv[k]=(G.inv[k]||0)+n});craft.remove(K.work);actions([]);ui.act.innerHTML='';
 Q.forEach(c=>c.g.visible=true);view='home';sway=1;G.phase=o.free?'idle':'ordering';if(o.free)G.order=null;toast('Üretimden çıkıldı · malzemeler iade edildi',1800);save();refresh();
 moveCam(VIEWS.home,1.1,()=>{if(G.phase==='ordering'&&Q[0]&&Q[0].order===o)present(Q[0]);else if(G.phase==='ordering'){G.phase='idle';G.order=null;refresh()}else if(Q[0]&&Q[0].at&&G.phase==='idle')present(Q[0])})}
function fin(s,msg){if(K.dead)return;hookClear();toolUp&&toolUp();stepDone(s,msg)}

/* Sepet: şerit kesme */
function bStrips(){const st=K.st,n=st.n||6,Wd=st.W||0.48,L=st.L||0.46,w=Wd/n,x0=BC.x-Wd/2,SAW=!!st.saw,th=SAW?0.03:0.012;if(K.piece&&K.piece.visible!==undefined)K.piece.visible=false;K.hy=Y+th;
 const S=[];for(let i=0;i<n;i++){const sh=rrect(w-0.004,L,0.008),m=flat(sh,th,shade(K.p.sheet,i%2?-0.04:0.03));m.userData.sh=sh;m.position.set(x0+w*(i+0.5),Y,BC.z);K.work.add(m);S.push(m)}
 const lines=[];for(let i=1;i<n;i++){const x=x0+w*i,g=new THREE.Group(),dm=new THREE.MeshBasicMaterial({color:'#fff6d8'});for(let j=0;j<12;j++)put(g,B(0.006,0.002,0.022),dm,x,Y+th+0.002,BC.z-L/2+0.02+j*0.039).castShadow=false;K.work.add(g);lines.push({x,g,cov:new Array(16).fill(false),done:false,i,str:0,dir:0,acc:0,lz:null})}
 K.dev=0;K.devN=0;let snd=0;
 const cutAt=p=>{toolAt(p,SAW?'sw':'tw',Y+th+0.002);if(!SAW&&tt-snd>0.4){snd=tt;if(!sf('mala',0.7))sfx.cut()}let best=null,bd=9;lines.forEach(l=>{if(l.done)return;const d=Math.abs(p.x-l.x);if(d<bd){bd=d;best=l}});if(!best||Math.abs(p.z-BC.z)>L/2+0.03)return;K.dev+=Math.min(bd,0.08);K.devN++;
  if(SAW){if(bd>0.05){best.lz=null;return}if(best.lz!=null){const dz=p.z-best.lz,dr=Math.sign(dz);if(dr&&dr!==best.dir){if(best.acc>0.05){best.str++;sfx.sand();puff(V(best.x,Y+th,p.z),3,'#e8c890');best.g.children.forEach(d=>d.material.color.set(best.str>3?'#5a3a1a':'#c9a070'))}best.dir=dr;best.acc=0}best.acc+=Math.abs(dz)}best.lz=p.z;tipStep(`Testere: ${best.str}/6 · ${lines.filter(l=>l.done).length}/${n-1} kesim`);if(best.str>=6)best.cov.fill(true)}
  if(SAW||bd<0.035){if(!SAW){const j=Math.round((p.z-(BC.z-L/2))/L*15);if(j>=0&&j<16)best.cov[j]=true}const c=best.cov.filter(Boolean).length/16;
   if(c>=0.8){best.done=true;K.work.remove(best.g);sfx.pick();S.forEach((m,k)=>{const dx=k<best.i?-0.006:0.006,x1=m.position.x;tween(0.18,q=>m.position.x=x1+dx*q)});const left=lines.filter(l=>!l.done).length;tipStep(`${n-1-left}/${n-1} ${SAW?'kesim tamam':'şerit kesildi'}`);if(!left)done()}}};
 const done=()=>{const ad=K.devN?K.dev/K.devN:0.05,s=clamp(1-(ad-0.008)/0.04,0.3,1);K.parts[st.part||'serit']=S;
  S.forEach((m,j)=>{const fr=m.position.clone(),to=V(BC.x+0.47,Y+j*0.013,BC.z+0.02),r1=(j-(n-1)/2)*0.13;setTimeout(()=>tween(0.4,k=>{m.position.lerpVectors(fr,to,k);m.position.y=to.y+Math.sin(k*Math.PI)*0.06;m.scale.setScalar(1-0.4*k);m.rotation.z=r1*k}),j*70)});
  setTimeout(()=>{if(K.piece&&K.piece.visible!==undefined)K.piece.visible=true},300);fin(s,s>0.8?'Düzgün şeritler!':null)};
 K.pd=cutAt;K.pm=cutAt;K.skipFn=()=>{lines.forEach(l=>{if(!l.done){l.done=true;K.work.remove(l.g)}});done();return true}}

/* Sepet: örerek yükseltme */
function bWeave(){const n=K.st.n||3;const m=grow3D(0.03),bb=K.fullBB,R=Math.max(bb.max.x-bb.min.x,bb.max.z-bb.min.z)/2*0.86,H=(bb.max.y-Y)*0.9;
 const sk=new THREE.Group(),sm=M(shade(K.p.sheet,-0.15),0.9);for(let i=0;i<12;i++){const a=i/12*Math.PI*2,c=put(sk,Cy(0.007,0.009,H,6),sm,BC.x+Math.cos(a)*R,Y+H/2,BC.z+Math.sin(a)*R);c.position.y=Y;c.geometry.translate(0,H/2,0)}K.work.add(sk);sk.scale.y=0.01;tween(0.5,k=>sk.scale.y=Math.max(0.01,k));
 const ring=dashRing(R+0.13,Y+0.004,30);K.hy=Y;let tot=0,la=null,good=0,all=0,snd=0;
 const mv=p=>{const r=Math.hypot(p.x-BC.x,p.z-BC.z);toolAt(V(p.x,0,p.z),'cl',Y+0.02);all++;if(r<R*0.55||r>R+0.4){la=null;return}good+=r>R*0.8&&r<R+0.28?1:0.4;const a=angAt(p);if(la!=null){const d=Math.abs(wrapA(a-la));if(d<0.8)tot+=d}la=a;
  const pr=Math.min(1,tot/(n*Math.PI*2));gF(0.03+0.97*pr);if(tot-snd>0.45){snd=tot;sfx.stitch()}tipStep(`Tur ${Math.min(n,Math.floor(pr*n)+1)}/${n} · %${Math.round(pr*100)}`);if(pr>=1)end()};
 const end=()=>{K.work.remove(ring);tween(0.3,k=>sk.scale.y=Math.max(0.01,1-k),()=>K.work.remove(sk));const s=all?clamp(good/all*1.1,0.3,1):0.6;fin(s,'Sepet örüldü!')};
 K.pd=p=>{la=null;mv(p)};K.pm=mv;K.skipFn=()=>{gF(1);K.work.remove(ring);K.work.remove(sk)};tipStep(`Tur 1/${n} · Sepetin etrafında daire çiz`)}

/* Çömlek: çarkta şekillendirme */
function bSpin(){const m=grow3D(0.1),bb=K.fullBB,R=Math.max(bb.max.x-bb.min.x,bb.max.z-bb.min.z)/2;m.g.position.y=Y+0.03;
 const wh=new THREE.Group();wh.position.copy(BC);put(wh,Cy(R+0.1,R+0.12,0.03,32),M('#6b4a2e',0.8),0,0.015,0);for(let i=0;i<4;i++){const b=put(wh,B(0.02,0.004,R+0.06),M('#3e2a18'),0,0.032,0);b.rotation.y=i*Math.PI/4;b.geometry.translate(0,0,(R+0.06)/2)}K.work.add(wh);
 K.hy=Y+0.03;K.sv=0;let pr=0,tin=0,ttot=0,la=null,lt=0;const LO=3.5,HI=11,MX=16;
 ui.act.innerHTML=`<div class="gauge"><div class="gz" style="left:${LO/MX*100}%;width:${(HI-LO)/MX*100}%"></div><div class="gf" id="gf"></div></div>`;
 const mv=p=>{toolAt(V(p.x,0,p.z),'cl',Y+0.05);const r=Math.hypot(p.x-BC.x,p.z-BC.z);if(r<0.05||r>R+0.45){la=null;return}const a=angAt(p),now=performance.now()/1000;if(la!=null){const dt=Math.max(0.006,now-lt),w=Math.abs(wrapA(a-la))/dt;K.sv=K.sv*0.75+Math.min(w,20)*0.25}la=a;lt=now};
 K.pd=p=>{la=null;mv(p)};K.pm=mv;K.pu=()=>{la=null};
 K.tick=dt=>{K.sv*=Math.exp(-dt*0.9);wh.rotation.y+=K.sv*dt;m.g.rotation.y+=K.sv*dt;const inb=K.sv>=LO&&K.sv<=HI;if(K.sv>0.5)ttot+=dt;if(inb){tin+=dt;pr=Math.min(1,pr+dt*0.3);gF(0.1+0.9*pr);if(Math.random()<dt*6)sfx.wax()}
  const gf=$('gf');if(gf)gf.style.width=clamp(K.sv/MX,0,1)*100+'%';tipStep(`${K.sv<LO?'Daha hızlı çevir':K.sv>HI?'Çok hızlı, yavaşla':'Güzel, şekilleniyor'} · %${Math.round(pr*100)}`);
  if(pr>=1){K.tick=null;const s=ttot?clamp(tin/ttot*1.25,0.3,1):0.7;tween(0.4,k=>{wh.scale.setScalar(Math.max(0.01,1-k));m.g.position.y=Y+0.03*(1-k)},()=>K.work.remove(wh));K.top=K.top-0.03;fin(s,'Çömlek şekillendi!')}};
 K.skipFn=()=>{gF(1);K.work.remove(wh);m.g.position.y=Y};}

/* Sabun: karıştırma */
/* Karıştırma döngü sesi: hareket ettikçe duyulur, durunca söner */
const MXL={};function mxOn(n){n=n||'karistir';let L=MXL[n];if(!L)L=MXL[n]={s:null,t:0,i:0};L.t=tt;if(!SB[n]||!AC||!G.snd)return;if(!L.s){try{L.s=playB(n,0,true);L.s.s.playbackRate.value=1}catch(e){L.s=null;return}}L.s.g.gain.setTargetAtTime(0.55,AC.currentTime,0.05);if(!L.i)L.i=setInterval(()=>{if(L.s&&tt-L.t>0.22)L.s.g.gain.setTargetAtTime(0,AC.currentTime,0.08)},120)}
function mxOff(n){const L=MXL[n||'karistir'];if(!L)return;if(L.i){clearInterval(L.i);L.i=0}if(!L.s)return;const z=L.s;L.s=null;try{z.g.gain.setTargetAtTime(0,AC.currentTime,0.06);z.s.stop(AC.currentTime+0.4)}catch(e){}}
function bStir(){const pc=K.piece;if(pc&&pc.visible!==undefined)pc.visible=false;const bw=new THREE.Group();bw.position.copy(BC);const bm=M('#e8dcc8',0.6);
 const lt=new THREE.LatheGeometry([[0,0],[0.17,0.005],[0.24,0.06],[0.27,0.15],[0.26,0.155]].map(q=>new THREE.Vector2(q[0],q[1])),28);const b=put(bw,lt,bm,0,0,0);b.material.side=THREE.DoubleSide;
 const lm=M('#f6f0e4',0.5),liq=put(bw,Cy(0.245,0.24,0.01,28),lm,0,0.115,0);const sp=[];for(let i=0;i<14;i++){const a=Math.random()*6.28,r=0.04+Math.random()*0.17,d=put(bw,Cy(0.014,0.014,0.004,8),M(i%2?'#8a63b8':'#b49ad6'),Math.cos(a)*r,0.122,Math.sin(a)*r);d.userData={a,r};sp.push(d)}
 K.work.add(bw);bw.scale.setScalar(0.01);tween(0.3,k=>bw.scale.setScalar(Math.max(0.01,k)));K.hy=Y+0.12;let tot=0,la=null,good=0,all=0,snd=0;const c0=new THREE.Color('#f6f0e4'),c1=new THREE.Color(K.p.sheet);
 const mv=p=>{const r=Math.hypot(p.x-BC.x,p.z-BC.z);toolAt(V(p.x,0,p.z),'mx',Y+0.13);all++;mxOn();if(r>0.3){la=null;return}good+=r>0.06&&r<0.24?1:0.5;const a=angAt(p);if(la!=null){const d=wrapA(a-la);if(Math.abs(d)<0.8){tot+=Math.abs(d);sp.forEach(s=>{s.userData.a+=d*0.7;s.position.x=Math.cos(s.userData.a)*s.userData.r;s.position.z=Math.sin(s.userData.a)*s.userData.r})}}la=a;
  const pr=Math.min(1,tot/(3*Math.PI*2));lm.color.copy(c0).lerp(c1,pr);sp.forEach(s=>s.scale.setScalar(Math.max(0.05,1-pr)));if(!SB.karistir&&tot-snd>0.5){snd=tot;noise(0.12,0.03,700,1.4,0,200)}tipStep(`Karıştır · %${Math.round(pr*100)}`);if(pr>=1)end()};
 const end=()=>{mxOff();const s=all?clamp(good/all*1.1,0.3,1):0.6;tween(0.3,k=>bw.scale.setScalar(Math.max(0.01,1-k)),()=>{K.work.remove(bw);if(pc&&pc.visible!==undefined)pc.visible=true});fin(s,'Karışım hazır!')};
 K.pd=p=>{la=null;mv(p)};K.pm=mv;K.skipFn=()=>{mxOff();K.work.remove(bw);if(pc&&pc.visible!==undefined)pc.visible=true};tipStep('Kasenin içinde daire çizerek karıştır')}

/* Sabun / mum: kalıba dökme */
function bPour(){const m=grow3D(0.02),bb=K.fullBB,sx=bb.max.x-bb.min.x+0.04,sz=bb.max.z-bb.min.z+0.04,sy=bb.max.y-Y+0.04,col=K.p.sheet;
 const mold=put(K.work,B(sx,sy,sz),new THREE.MeshStandardMaterial({color:'#cfe6ee',transparent:true,opacity:0.22,roughness:0.1,depthWrite:false}),BC.x,Y+sy/2,BC.z);mold.castShadow=false;
 const tgt=0.86,line=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(sx+0.004,0.001,sz+0.004)),new THREE.LineBasicMaterial({color:'#2f6b5a'}));line.position.set(BC.x,Y+(bb.max.y-Y)*tgt,BC.z);K.work.add(line);
 const pt=new THREE.Group();pt.position.set(BC.x+sx/2+0.13,Y+sy+0.16,BC.z);put(pt,Cy(0.07,0.06,0.18,14),M('#b9c2c8',0.3),0,0,0);const sp=put(pt,Cy(0.015,0.03,0.08,8),M('#b9c2c8',0.3),-0.075,0.07,0);sp.rotation.z=1.1;put(pt,new THREE.TorusGeometry(0.05,0.01,5,12,Math.PI),M('#8a9399'),0.07,0,0).rotation.z=-Math.PI/2;K.work.add(pt);
 const lip=new THREE.Object3D();lip.position.set(-0.11,0.09,0);pt.add(lip);
 glb('m_pot',()=>{try{const w=fitM('m_pot',{w:0.29});if(!w||!pt.parent)return;w.position.z=-0.07;const o=new THREE.Group();o.add(w);o.rotation.y=0.35;pt.position.x-=0.1;o.position.y=-0.09;o.traverse(x=>{if(x.isMesh)x.castShadow=true});pt.children.slice().forEach(c=>{if(c!==lip)pt.remove(c)});pt.add(o);const bb=new THREE.Box3().setFromObject(o);lip.position.set(-0.075,bb.max.y-0.004,0)}catch(e){}});
 const stm=put(K.work,Cy(0.009,0.012,1,8),M(col,0.4),0,0,0);stm.visible=false;stm.castShadow=false;
 const STM=!!K.st.steam;if(STM){pt.visible=false;mold.visible=false}let lv=0.02,pour=false,over=false,psnd=null;const pStop=()=>{if(!psnd)return;const z=psnd;psnd=null;try{z.g.gain.setTargetAtTime(0,AC.currentTime,0.06);z.s.stop(AC.currentTime+0.35)}catch(e){}};ui.act.innerHTML=`<div class="gauge"><div class="gz" style="left:80%;width:12%"></div><div class="gf" id="gf"></div></div>`;
 const b=btn(STM?'Basılı tut: buharla':'Basılı tut: dök','g');b.style.minWidth='60%';const st=on=>{pour=on;if(!on&&lv>=0.8&&!over)end()};b.onpointerdown=e=>{e.preventDefault();st(true)};b.onpointerup=b.onpointerleave=b.onpointercancel=()=>{if(pour)st(false)};b.oncontextmenu=e=>e.preventDefault();ui.act.appendChild(b);
 K.pd=()=>st(true);K.pu=()=>st(false);K.hy=Y;
 K.tick=dt=>{pt.rotation.z+=((pour?1.0:0)-pt.rotation.z)*Math.min(1,dt*8);const flow=pour&&pt.rotation.z>0.6;if(flow){lv+=dt*0.3;if(!STM&&!psnd&&SB.dok&&AC&&G.snd){try{psnd=playB('dok',0.6,true)}catch(e){}}if(!psnd&&Math.random()<dt*10)noise(0.08,0.02,1200,0.8,0,500)}else pStop();gF(Math.min(lv,1));
  stm.visible=flow&&!STM;if(flow&&STM&&Math.random()<dt*14){const a=Math.random()*6.28;puff(V(BC.x+Math.cos(a)*0.25,Y+0.02,BC.z+Math.sin(a)*0.25),1,'#f4f4f4')}if(flow){pt.updateMatrixWorld(true);const sp0=K.work.worldToLocal(lip.getWorldPosition(V(0,0,0))),y1=K.top;sp0.z=BC.z;stm.position.set(sp0.x,(sp0.y+y1)/2,sp0.z);stm.scale.y=Math.max(0.01,sp0.y-y1)}
  const gf=$('gf');if(gf)gf.style.width=Math.min(100,lv*100)+'%';tipStep(lv<0.8?(STM?'Buharla · %':'Çizgiye kadar dök · %')+Math.round(lv*100):lv<=0.92?'Şimdi bırak!':'Taşıyor!');
  if(lv>1.02&&!over){over=true;pour=false;puff(V(BC.x+sx/2,Y+0.02,BC.z),10,col);sfx.bad();end()}};
 const end=()=>{K.tick=null;pStop();const s=over?0.25:clamp(1-Math.abs(lv-tgt)/0.12,0.3,1);gF(1);tween(0.3,k=>{pt.position.y+=0.02;pt.scale.setScalar(Math.max(0.01,1-k));mold.material.opacity=0.22*(1-k)},()=>{K.work.remove(pt);K.work.remove(mold);K.work.remove(line);K.work.remove(stm)});fin(s,over?(STM?'Fazla buhar!':'Taştı!'):(STM?'Kalıba oturdu!':'Tam kıvamında!'))};
 K.skipFn=()=>{pStop();gF(1);[pt,mold,line,stm].forEach(o=>K.work.remove(o))}}

/* Boks: yün doldurma */
function bStuff(){if(!K.is3d)to3D(true);const BLW=K.st.t==='blow',n=K.st.n||8;let pp=null;K.pn=0;K.pL=-1;K.pS=[];const bk=new THREE.Group();bk.position.set(BC.x+0.42,Y,BC.z-0.12);const bl=put(bk,new THREE.CylinderGeometry(0.11,0.08,0.08,14,1,true),M('#8a6a3a',0.9),0,0.04,0);bl.material.side=THREE.DoubleSide;
 if(BLW){bk.clear();pp=new THREE.Group();const ra=-(Math.PI/2-0.42);put(pp,Cy(0.008,0.009,0.45,8),M('#5a5e64',0.3),0.2,0.09,0).rotation.z=ra;put(pp,Cy(0.016,0.016,0.08,8),M('#3a2a20'),0.4,0.18,0).rotation.z=ra;put(pp,Cy(0.012,0.016,0.02,8),M('#5a5e64',0.3),0,0.004,0);K.work.add(pp);{const w=fitM('m_pipe',{rx:-Math.PI/2,h:0.5});if(w){pp.children[0].visible=pp.children[1].visible=false;const t=new THREE.Group();t.rotation.z=ra;w.position.y=0.012;t.add(w);pp.add(t)}}K.tick=()=>{pp.position.set(BC.x,K.top-0.006,BC.z)}}else for(let i=0;i<7;i++)put(bk,new THREE.SphereGeometry(0.04,7,5),M('#f3eee4',1),(Math.random()-0.5)*0.12,0.08+Math.random()*0.03,(Math.random()-0.5)*0.12);K.work.add(bk);
 const yk=K.p.id==='yastik',b=btn(BLW?'Üfle!':yk?'Tüy it!':'Yün it!','g',tap);b.style.minWidth='60%';b.classList.add('beat');ui.act.innerHTML='<div class="gauge"><div class="gf" id="gf"></div></div>';ui.act.appendChild(b);tipStep('Saniyede bir dokun · 0/'+n);
 function tap(){if(G.step!==K.st.t)return;const now=tt,dt=K.pL<0?1:now-K.pL;if(dt<0.35){toast('Çok hızlı!',500);return}K.pL=now;const sc=clamp(1-Math.abs(dt-1)/0.9,0.2,1);K.pS.push(sc);K.pn++;const k=K.pn/n;
  if(BLW){noise(0.3,0.05,600,0.7,0,300);const g=K.m3&&K.m3.g;if(g){const s0=g.scale.clone(),f=0.14+0.86*k,fx=0.62+0.38*k,s1=V(1.6*fx,1.6*f,1.6*fx);tween(0.3,q=>{g.scale.lerpVectors(s0,s1,q);g.updateMatrixWorld(true);K.top=new THREE.Box3().setFromObject(g).max.y+0.002})}}else{const t=new THREE.Group();for(let i=0;i<3;i++)put(t,new THREE.SphereGeometry(0.03,6,5),M('#f3eee4',1),(i-1)*0.025,0,(i%2)*0.02);t.position.set(bk.position.x,Y+0.12,bk.position.z);K.work.add(t);const fr=t.position.clone(),to=V(BC.x,K.top,BC.z);
  tween(0.35,q=>{t.position.lerpVectors(fr,to,q);t.position.y+=Math.sin(q*Math.PI)*0.18;t.scale.setScalar(1-0.8*q)},()=>{K.work.remove(t);sfx.thud();const g=K.m3&&K.m3.g;if(g){const s0=g.scale.clone(),f=0.14+0.86*k,fx=0.62+0.38*k,s1=V(1.6*fx,1.6*f,1.6*fx);tween(0.25,q=>{g.scale.lerpVectors(s0,s1,q);g.updateMatrixWorld(true);K.top=new THREE.Box3().setFromObject(g).max.y+0.002})}})}
  const gf=$('gf');if(gf)gf.style.width=k*100+'%';tipStep(`${sc>0.75?'Güzel ritim':'Ritmi tut'} · ${K.pn}/${n}`);if(K.pn>=n){K.defl=false;setTimeout(()=>{K.work.remove(bk);if(pp)K.work.remove(pp);fin(K.pS.reduce((a,b)=>a+b,0)/K.pS.length,BLW?'Cam şişti!':yk?'Yastık kabardı!':'Eldiven doldu!')},450)}}
 K.skipFn=()=>{K.work.remove(bk);if(pp)K.work.remove(pp);const g=K.m3&&K.m3.g;if(g)g.scale.setScalar(1.6);K.defl=false}}
