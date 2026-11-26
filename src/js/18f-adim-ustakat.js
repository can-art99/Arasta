/* ---------- Üst kat adımları: kakma (sedef yerleştirme) ve akort ---------- */
/* ortak: parıltı efekti (yıldız sprite, toplamalı karışım) */
let STARTX=null;
function starTex(){if(STARTX)return STARTX;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(0.25,'rgba(255,250,220,0.85)');g.addColorStop(1,'rgba(255,240,200,0)');x.fillStyle=g;x.fillRect(0,0,64,64);
 x.globalCompositeOperation='lighter';x.fillStyle='rgba(255,255,255,0.9)';x.beginPath();x.moveTo(32,2);x.lineTo(35,29);x.lineTo(62,32);x.lineTo(35,35);x.lineTo(32,62);x.lineTo(29,35);x.lineTo(2,32);x.lineTo(29,29);x.closePath();x.fill();STARTX=new THREE.CanvasTexture(c);return STARTX}
function sparkle(pos,n,cols,sz,up){const par=(K&&K.work&&G.phase==='craft')?K.work:S;cols=cols||['#ffffff','#fff2c0','#bff3ff'];for(let i=0;i<n;i++){const m=new THREE.Sprite(new THREE.SpriteMaterial({map:starTex(),color:cols[i%cols.length],transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));const s0=(sz||0.035)*(0.6+Math.random()*0.8);m.scale.set(s0,s0,1);m.position.copy(pos);par.add(m);
 const a=Math.random()*Math.PI*2,r=0.02+Math.random()*0.07,vy=(up==null?0.06:up)*(0.5+Math.random()),d=0.45+Math.random()*0.4,dl=Math.random()*0.12,p0=pos.clone(),sp=(Math.random()-0.5)*8;
 m.material.opacity=0;setTimeout(()=>tween(d,k=>{m.position.set(p0.x+Math.cos(a)*r*k,p0.y+vy*k-0.02*k*k,p0.z+Math.sin(a)*r*k);m.material.rotation=sp*k;const f=k<0.2?k/0.2:1-(k-0.2)/0.8;m.material.opacity=f;m.scale.set(s0*(0.6+f*0.6),s0*(0.6+f*0.6),1)},()=>par.remove(m)),dl*1000)}}
/* ince parlama halkası */
function ringPulse(pos,r,col){const par=(K&&K.work&&G.phase==='craft')?K.work:S;const m=new THREE.Mesh(new THREE.RingGeometry(r*0.8,r,28),new THREE.MeshBasicMaterial({color:col||'#fff3c4',transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.copy(pos);par.add(m);tween(0.5,k=>{m.scale.setScalar(1+k*1.6);m.material.opacity=0.9*(1-k)},()=>par.remove(m))}
/* ---- KAKMA: sedef parçalarını aynı şekilli yuvalara yerleştir ---- */
function inlayShape(k,s){s=s||1;const sh=new THREE.Shape();if(k==='c'){sh.absarc(0,0,0.03*s,0,Math.PI*2,false)}else if(k==='r'){const a=0.032*s,b=0.022*s;sh.moveTo(0,a);sh.lineTo(b,0);sh.lineTo(0,-a);sh.lineTo(-b,0);sh.lineTo(0,a)}
 else if(k==='d'){const r=0.019*s;sh.moveTo(0,0.04*s);sh.bezierCurveTo(0.008*s,0.02*s,r,0.004*s,r,-0.008*s);sh.absarc(0,-0.008*s,r,0,Math.PI,true);sh.bezierCurveTo(-r,0.004*s,-0.008*s,0.02*s,0,0.04*s)}
 else{const R=0.034*s,r=0.015*s;for(let i=0;i<10;i++){const t=Math.PI/2+i*Math.PI/5,q=i%2?r:R;i?sh.lineTo(Math.cos(t)*q,Math.sin(t)*q):sh.moveTo(Math.cos(t)*q,Math.sin(t)*q)}sh.closePath()}return sh}
function bInlay(){const S0=K.st.slots||[{p:[0,0],k:'c',s:1.4},{p:[-0.1,-0.05],k:'d',r:-2.2},{p:[0.1,-0.05],k:'d',r:2.2},{p:[-0.1,0.05],k:'d',r:-0.9},{p:[0.1,0.05],k:'d',r:0.9},{p:[-0.18,0],k:'r'},{p:[0.18,0],k:'r'}];
 const y0=K.top,pearl=i=>new THREE.MeshStandardMaterial({color:'#f3f8f9',roughness:0.18,metalness:0.15,emissive:'#223344',emissiveIntensity:0.6,flatShading:true});
 const surf=p=>{const rc=new THREE.Raycaster(V(p.x,Y+1,p.z),V(0,-1,0));rc.camera=cam;const h=rc.intersectObjects(K.work.children.filter(o=>o.visible),true)[0];return h?h.point.y:y0};const sl=S0.map((d,i)=>{const p=LP(d.p),sy=surf(p),g=flat(inlayShape(d.k,(d.s||1)*1.12),0.0015,M('#24140a',0.9),0);g.position.set(p.x,sy+0.0006,p.z);g.rotation.z=d.r||0;K.work.add(g);
  const rim=flat(inlayShape(d.k,(d.s||1)*1.3),0.0008,new THREE.MeshBasicMaterial({color:'#ffd77a',transparent:true,opacity:0,depthWrite:false}),0);rim.position.set(p.x,sy+0.0003,p.z);rim.rotation.z=d.r||0;K.work.add(rim);p.y=sy;return {d,p,g,rim,done:false}});
 const TOPY=Math.max(y0,...sl.map(q=>q.p.y));/* boş yuvalar altın çerçeveyle yanıp söner, nereye kakılacağı belli olsun */
 const pulse=()=>{const k=0.3+0.25*Math.sin(tt*5);sl.forEach(q=>{if(q.done)q.rim.material.opacity=0;else if(q!==near)q.rim.material.opacity=k})};
 const ord=S0.map((d,i)=>i).sort(()=>Math.random()-0.5),tx=BC.x-0.47,tz=BC.z-0.15;
 const tray=put(K.work,B(0.2,0.012,0.4),M('#4a1f3a',0.95),tx+0.04,y0+0.003,tz+0.15);const rail=put(K.work,B(0.21,0.02,0.01),M('#c9a23a',0.4),tx+0.04,y0+0.006,tz-0.05);const trayOff=()=>{[tray,rail].forEach(o=>{const s0=o.scale.x;tween(0.35,k=>o.scale.setScalar(Math.max(0.01,s0*(1-k))),()=>K&&K.work.remove(o))})};
 const pc=ord.map((si,j)=>{const d=S0[si],m=flat(inlayShape(d.k,d.s||1),0.005,pearl(j),0.0012);const h=V(tx+(j%2)*0.085,y0+0.011,tz+Math.floor(j/2)*0.1);m.position.copy(h);m.rotation.z=d.r||0;K.work.add(m);return {m,d,home:h,done:false,ph:Math.random()*6}});
 K.inl={pc,sl};let drag=null,off=V(0,0,0),miss=0,errs=[],placed=0,near=null;
 const tip=()=>tipStep(`Sedefi aynı şekilli yuvaya sürükle · ${placed}/${pc.length}`);tip();
 const back=q=>{const a=q.m.position.clone();tween(0.25,k=>{q.m.position.lerpVectors(a,q.home,k);q.m.position.y+=Math.sin(k*Math.PI)*0.03},()=>q.m.scale.setScalar(1))};
 const findSlot=(x,z,r)=>{let b=null,bd=r;sl.forEach(s=>{if(s.done)return;const d=Math.hypot(s.p.x-x,s.p.z-z);if(d<bd){bd=d;b=s}});return b};
 K.pd=p=>{let b=null,bd=0.05;pc.forEach(q=>{if(q.done)return;const d=Math.hypot(q.m.position.x-p.x,q.m.position.z-p.z);if(d<bd){bd=d;b=q}});if(!b)return;drag=b;off.set(b.m.position.x-p.x,0,b.m.position.z-p.z);b.m.position.y=TOPY+0.03;b.m.scale.setScalar(1.18);sfx.pick&&sfx.pick();tone(1500,0.04,'triangle',0.05)};
 K.pm=p=>{if(!drag)return;drag.m.position.x=p.x+off.x;drag.m.position.z=p.z+off.z;const s=findSlot(drag.m.position.x,drag.m.position.z,0.06);if(near&&near!==s)near.rim.material.opacity=0;near=s;if(s)s.rim.material.opacity=s.d.k===drag.d.k?0.85:0.25};
 K.pu=()=>{if(!drag)return;const q=drag;drag=null;if(near)near.rim.material.opacity=0;const s=findSlot(q.m.position.x,q.m.position.z,0.055);near=null;
  if(s&&s.d.k===q.d.k&&(s.d.s||1)===(q.d.s||1)){const e=Math.hypot(s.p.x-q.m.position.x,s.p.z-q.m.position.z);errs.push(e);s.done=q.done=true;placed++;const a=q.m.position.clone(),b=V(s.p.x,y0-0.0015,s.p.z);q.m.rotation.z=s.d.r||0;
   tween(0.18,k=>{q.m.position.lerpVectors(a,b,k);q.m.scale.setScalar(1.18-0.18*k)},()=>{tone(2100,0.05,'triangle',0.08);tone(3150,0.25,'sine',0.05,null,0.03);impactFx(0.2,K.piece);sparkle(V(b.x,b.y+0.01,b.z),9);ringPulse(V(b.x,b.y+0.003,b.z),0.05);s.g.visible=false;
    if(placed>=pc.length){K.tick=null;const L=pc.slice();L.forEach((z,i)=>setTimeout(()=>{sparkle(V(z.m.position.x,y0+0.012,z.m.position.z),6,['#ffffff','#c9f2ff','#ffe9b0'],0.045,0.09);tone(1400+i*180,0.3,'sine',0.04)},120*i));
     setTimeout(()=>{trayOff();fin(clamp(1-miss*0.12-avg(errs.length?errs:[0])*3,0.3,1),'Kakma tamam!')},120*L.length+450)}else tip()})}
  else{if(s){miss++;sfx.bad();toast('Bu yuvaya uymuyor',700);jolt(q.m,0.004)}back(q)}};
 K.tick=dt=>{pulse();pc.forEach(q=>{if(q===drag)return;q.m.material.emissive.setHSL((tt*0.08+q.ph*0.1)%1,0.55,q.done?0.06:0.1)});if(drag)drag.m.material.emissive.setHSL((tt*0.3)%1,0.7,0.16)};
 K.skipFn=()=>{trayOff();pc.forEach(q=>{if(q.done)return;const s=sl.find(z=>!z.done&&z.d.k===q.d.k&&(z.d.s||1)===(q.d.s||1));if(s){s.done=q.done=true;q.m.position.set(s.p.x,y0-0.0015,s.p.z);s.g.visible=false}})}}
/* ---- AKORT: burguyu çevirip teli doğru notaya getir ---- */
let KSB=null;
function pluck(f,vol){const a=AC;if(!a||!G.snd)return;try{const sr=a.sampleRate,P=100,f0=sr/P;if(!KSB){const N=Math.floor(sr*1.4),buf=a.createBuffer(1,N,sr),d=buf.getChannelData(0),r=new Float32Array(P);for(let i=0;i<P;i++)r[i]=Math.random()*2-1;let ix=0;for(let i=0;i<N;i++){const nx=(ix+1)%P;d[i]=r[ix];r[ix]=(r[ix]+r[nx])*0.5*0.9975;ix=nx}KSB=buf}
 const s=a.createBufferSource(),g=a.createGain(),lp=a.createBiquadFilter();s.buffer=KSB;s.playbackRate.value=f/f0;lp.type='lowpass';lp.frequency.value=Math.min(9000,f*7);g.gain.value=vol||0.35;s.connect(lp);lp.connect(g);g.connect(BUS('e'));s.start();s.stop(a.currentTime+1.4)}catch(e){}}
function bTune(){const NT=K.st.notes||[['La',220],['Re',293.66],['Sol',392]],x0=K.st.x||[-0.012,0,0.012],za=K.st.z||[0.15,-0.56],pg=K.st.pegs||[[-0.035,-0.575],[0.035,-0.575],[-0.035,-0.62]];
 const yb=surfY(BC.x,BC.z+za[0],K.top,[])+0.014,yn=surfY(BC.x,BC.z+za[1],K.top,[])+0.014,sm=M('#e6e0cf',0.3),gm=new THREE.MeshStandardMaterial({color:'#ffd77a',emissive:'#a06a10',emissiveIntensity:0.8,roughness:0.3});
 const str=x0.map((x,i)=>{const a=V(BC.x+x,yb,BC.z+za[0]),b=V(BC.x+x+(pg[i][0]-x)*0.15,yn,BC.z+za[1]);const g=lineSeg(K.work,a,b,'#e6e0cf',0.0038);g.material=sm.clone();return {g,a,b,amp:0,x0:g.position.x}});
 const pegs=pg.map(q=>{const p=LP(q),y=surfY(p.x,p.z,K.top,[])+0.012,o=new THREE.Group();o.position.set(p.x,y,p.z);put(o,Cy(0.012,0.012,0.03,8),M('#3a2213',0.6),0,0.015,0);const w=put(o,B(0.055,0.016,0.012),M('#5c3520',0.6),0,0.036,0);put(o,new THREE.SphereGeometry(0.007,8,6),M('#e9eef0',0.2),0,0.045,0);K.work.add(o);return o});
 const halo=new THREE.Mesh(new THREE.RingGeometry(0.03,0.04,28),new THREE.MeshBasicMaterial({color:'#ffd77a',transparent:true,opacity:0.6,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));halo.rotation.x=-Math.PI/2;K.work.add(halo);
 let busy=false,i=0,c=0,on=false,lastX=null,lastPl=0,lastC=0,good=0,idle=0,sc=[],hold=0,t0=0;
 ui.act.innerHTML=`<div class="tune"><div class="tnL"><b id="tnN"></b><small id="tnS"></small></div><div class="tg"><div class="tz"></div><div class="tnc"></div><div class="tnd" id="tnd"></div></div></div>`;
 const bL=btn('◀','l'),bR=btn('▶','l');[bL,bR].forEach((b,k)=>{b.style.minWidth='22%';b.style.touchAction='none';b.oncontextmenu=e=>e.preventDefault();b.onpointerdown=e=>{e.preventDefault();hold=k?1:-1;on=true};b.onpointerup=b.onpointerleave=b.onpointercancel=()=>{hold=0;on=false};ui.act.appendChild(b)});
 const start=()=>{busy=false;c=(Math.random()<0.5?-1:1)*(120+Math.random()*180);lastC=c;t0=tt;good=0;idle=0;$('tnN').textContent=NT[i][0];$('tnS').textContent=`Tel ${i+1}/${NT.length}`;tipStep(`${NT[i][0]} teli · sürükle ya da ◀ ▶ ile burguyu çevir, ibreyi ortaya getir`);pegs.forEach((p,k)=>p.scale.setScalar(k===i?1.25:1));halo.position.copy(pegs[i].position).add(V(0,0.002,0));str.forEach((s,k)=>{s.g.material.emissive&&s.g.material.emissive.set(k===i?'#6a5a2a':'#000000')});pl()};
 const fr=()=>NT[i][1]*Math.pow(2,c/1200);const pl=()=>{pluck(fr(),0.32);str[i].amp=0.004;lastPl=tt;lastC=c};
 const lock=()=>{busy=true;const e=Math.abs(c),s=clamp(1-e/30-Math.max(0,tt-t0-12)*0.01,0.35,1);sc.push(s);const fT=NT[i][1];pluck(fT,0.4);setTimeout(()=>tone(fT*2,0.6,'sine',0.05),60);const S1=str[i];S1.g.material=gm;sparkle(pegs[i].position.clone().add(V(0,0.04,0)),10);ringPulse(V(S1.a.x,yb,S1.a.z),0.04,'#ffe9b0');
  for(let k=0;k<6;k++){const p=S1.a.clone().lerp(S1.b,k/5);setTimeout(()=>sparkle(p,2,['#ffe9b0','#ffffff'],0.025,0.03),k*50)}pegs[i].scale.setScalar(1);toast(e<4?'Tam akort!':'Akort oldu',700);i++;if(i>=NT.length){K.tick=null;K.work.remove(halo);setTimeout(()=>{NT.forEach((n,k)=>setTimeout(()=>{pluck(n[1],0.35);str[k].amp=0.004},k*220));setTimeout(()=>{K.qc=avg(sc);fin(K.qc,'Saz akortlu!')},NT.length*220+700)},400)}else setTimeout(start,550)};
 K.pd=p=>{on=true;lastX=p.x};K.pm=p=>{if(lastX==null)return;c+=(p.x-lastX)*900;lastX=p.x};K.pu=()=>{on=false;lastX=null};
 K.tick=dt=>{if(i>=NT.length||busy){str.forEach(s=>{s.amp*=Math.pow(0.04,dt);s.g.position.x=s.x0+Math.sin(tt*90)*s.amp});return}halo.material.opacity=0.35+0.3*Math.sin(tt*6);halo.scale.setScalar(1+0.12*Math.sin(tt*6));if(hold)c+=hold*70*dt;c=clamp(c,-400,400);pegs[i].rotation.y=c/90;
  if(on&&(Math.abs(c-lastC)>22||tt-lastPl>0.5))pl();if(!on&&tt-lastPl>1.6)pl();
  str.forEach(s=>{s.amp*=Math.pow(0.04,dt);s.g.position.x=s.x0+Math.sin(tt*90)*s.amp});
  const nd=$('tnd');if(nd){nd.style.left=(50+clamp(c,-100,100)/2)+'%';nd.classList.toggle('ok',Math.abs(c)<6)}
  if(Math.abs(c)<6){good+=dt;if(!on)idle+=dt;if(idle>0.35||good>0.9){lock();return}}else{good=0;idle=0}};
 K.skipFn=()=>{str.forEach(s=>s.g.material=gm)};K.tun={get c(){return c},set c(v){c=v}};start()}

/* ---------- Kalite kontrol oyunları ---------- */
function qcUI(lbl,btnTxt){ui.act.innerHTML=`<div class="qcm"><div class="qcl"><b id="qcN">${lbl}</b><small id="qcS"></small></div><div class="qcb"><i class="qcz" id="qcZ"></i><i class="qcf" id="qcF"></i><i class="qcn" id="qcP"></i></div></div>`;
 const b=btn(btnTxt,'g qch');b.style.touchAction='none';b.oncontextmenu=e=>e.preventDefault();ui.act.appendChild(b);return b}
function qcSkip(){K.qc=0.55}
/* Nargile çekiş kontrolü: basılı tutup çek; kaçak varsa duman çıkar ve çekiş tıkanır, duman çıkan contaya dokunup sık */
function bDraw(){const D3=!!K.is3d,J=[{n:'Lüle',q:[0,0],h:HKY(3.3)},{n:'Tabla contası',q:[0.8*HKS,0],h:HKY(2.55)},{n:'Hortum ağzı',q:[-1.08*HKS,1.08*HKS],h:HKY(-0.1)}].map(j=>{const p=LP(j.q);p.y=D3?Y+j.h:K.top+0.02;const r=put(K.work,new THREE.RingGeometry(0.026,0.036,24),new THREE.MeshBasicMaterial({color:'#ffd77a',transparent:true,opacity:0.0,depthWrite:false,side:THREE.DoubleSide}),p.x,p.y+0.004,p.z);r.rotation.x=-Math.PI/2;r.renderOrder=5;const hs=put(K.work,new THREE.SphereGeometry(0.06,10,8),new THREE.MeshBasicMaterial({visible:false}),p.x,p.y,p.z);return Object.assign(j,{p,r,hs,leak:false})});
 const lk=J.map((_,i)=>i).sort(()=>Math.random()-0.5).slice(0,2);lk.forEach(i=>J[i].leak=true);
 let hold=false,flow=0,t0=tt,wrong=0,seen=false,lastP=0,lastB=0,lastG=0,done=false;const bub=[];
 const b=qcUI('Çekiş','Çek · basılı tut');b.onpointerdown=e=>{e.preventDefault();hold=true};b.onpointerup=b.onpointerleave=b.onpointercancel=()=>{hold=false};
 const z=$('qcZ');if(z){z.style.left='88%';z.style.width='12%'}
 const fix=j=>{j.leak=false;sfx.drop&&sfx.drop();tone(520,0.05,'square',0.03);setTimeout(()=>tone(700,0.05,'square',0.03),70);ringPulse(j.p.clone(),0.05,'#bff3ff');sparkle(j.p.clone().add(V(0,0.02,0)),6);j.r.material.color.set('#7fe0b0');j.r.material.opacity=0.8;
  const left=J.filter(x=>x.leak).length;toast(left?`${j.n} sıkıldı · bir kaçak daha var`:`${j.n} sıkıldı · tekrar çek`,1100)};
 K.pd=p=>{if(done)return;let best=null;const hit=ray.intersectObjects(J.map(j=>j.hs),false)[0];if(hit)best=J.find(j=>j.hs===hit.object);
  if(!best){/* ekran üzerinde en yakın conta (yükseklik farkı yüzünden masa düzlemindeki nokta kayabiliyor) */let bd=9;const c=ray.ray.origin,dv=ray.ray.direction;J.forEach(j=>{const d=ray.ray.distanceToPoint(j.p);if(d<bd){bd=d;best=j}});if(bd>0.08)best=null}
  if(!best)return;if(best.leak)fix(best);else{wrong++;sfx.tap();toast(`${best.n} sağlam`,800)}};
 const lbl=()=>{const s=$('qcS');if(!s)return;const L=J.filter(x=>x.leak).length;s.textContent=!seen?'Basılı tutup çek':L?'Kaçak var · duman çıkan yere dokun':'Çekiş açık · dolana kadar tut'};lbl();
 tipStep('Basılı tutup çek · duman çıkarsa o contaya dokunup sık');
 K.tick=dt=>{if(done)return;const L=J.filter(x=>x.leak);
  if(hold){const cap=L.length?0.42+Math.sin(tt*11)*0.06:1;flow=Math.min(cap,flow+dt*(L.length?0.9:0.42));
   if(tt-lastB>(L.length?0.22:0.07)){lastB=tt;const a=Math.random()*6.28,r=Math.random()*0.11,m=put(K.work,new THREE.SphereGeometry(0.006+Math.random()*0.006,6,5),new THREE.MeshBasicMaterial({color:'#eaf7ff',transparent:true,opacity:0.9}),BC.x+Math.cos(a)*r*(D3?0.8:1),D3?Y+HKY(-1.3)+Math.random()*HKY(-0.6):K.top+0.005,BC.z+Math.sin(a)*r*(D3?0.8:1));bub.push({m,v:0.06+Math.random()*0.05,t:0})}
   if(tt-lastG>(L.length?0.3:0.13)){lastG=tt;noise(0.09,L.length?0.025:0.05,260+Math.random()*120,1.6)}
   if(L.length&&tt-lastP>0.25){lastP=tt;L.forEach(j=>puff(j.p.clone().add(V(0,0.01,0)),1,'#d6d6d6'));noise(0.12,0.015,5200,1.2);if(!seen){seen=true;lbl();toast('Kaçak var! Duman çıkan yeri bul',1300)}}}
  else flow=Math.max(0,flow-dt*0.6);
  J.forEach(j=>{if(j.leak&&seen){j.r.material.opacity=0.55+0.35*Math.sin(tt*8);j.r.scale.setScalar(1+0.15*Math.sin(tt*8))}else if(!j.leak&&j.r.material.color.getHex()!==0x7fe0b0&&seen){j.r.material.opacity=0.18}});
  for(let i=bub.length-1;i>=0;i--){const q=bub[i];q.t+=dt;q.m.position.y+=q.v*dt;q.m.material.opacity=Math.max(0,0.9-q.t*1.4);if(q.t>0.65){K.work.remove(q.m);bub.splice(i,1)}}
  const f=$('qcF'),pp=$('qcP');if(f)f.style.width=Math.round(flow*100)+'%';if(pp)pp.style.left=Math.round(flow*100)+'%';lbl();
  if(!L.length&&flow>=0.999){done=true;hold=false;const sc=clamp(1-wrong*0.12-Math.max(0,tt-t0-15)*0.015,0.35,1);K.qc=sc;J.forEach(j=>{K.work.remove(j.r);K.work.remove(j.hs)});bub.forEach(q=>K.work.remove(q.m));for(let k=0;k<5;k++)setTimeout(()=>noise(0.1,0.05,300,1.4),k*110);sparkle(V(BC.x,K.top+0.05,BC.z),14);setTimeout(()=>fin(sc,'Çekiş tertemiz!'),700)}};
 K.skipFn=()=>{qcSkip();J.forEach(j=>{K.work.remove(j.r);K.work.remove(j.hs)});bub.forEach(q=>K.work.remove(q.m))};
 K.drw={fixAll(){J.filter(x=>x.leak).forEach(fix)},get flow(){return flow},set hold(v){hold=v},get leaks(){return J.filter(x=>x.leak).length}}}
/* Tabanca tetik kontrolü: basılı tutunca tetik direnci artar; yeşil bölgede bırak (klik, top döner). Kaçırırsan ayar vidasını sık. 3 temiz tetik gerekir */
/* tabanca ayrıntıları: horoz ve tetik korkuluğu + tetik (gövde 3B olunca eklenir, tetik testinde kullanılır) */
function revDetails(){if(K.revD)return K.revD;const top=Y+0.03,hm=new THREE.Group(),hp=LP([RV.cyl[0]-RV.cylL*0.62,RV.cyl[1]-RV.cylR*0.55]);hm.position.set(hp.x,top,hp.z);K.work.add(hm);
 {const sm=M('#2b2e33',0.35);sm.metalness=0.5;const a=put(hm,B(0.012,0.014,0.05),sm,-0.004,0,0.0);a.rotation.y=0.25;put(hm,B(0.02,0.012,0.012),sm,-0.014,0.002,-0.026)}
 const tg=new THREE.Group(),tq=LP([RV.cyl[0]-0.008,RV.cyl[1]+RV.cylR*1.75]);tg.position.set(tq.x,Y+0.022,tq.z);K.work.add(tg);{const gm=M('#3a3f46',0.35);gm.metalness=0.5;const r=put(tg,new THREE.TorusGeometry(0.03,0.005,6,18,Math.PI*1.2),gm,0,0,0.012);r.rotation.x=Math.PI/2;r.rotation.z=Math.PI*0.9;const tr=put(tg,B(0.008,0.006,0.032),M('#2b2e33',0.35),0.004,0.004,0.004);tr.rotation.y=-0.35;tg.userData.tr=tr}
 [hm,tg].forEach(o=>{o.scale.setScalar(0.01);tween(0.35,k=>o.scale.setScalar(Math.max(0.01,k)))});K.revD={hm,hp,tg};return K.revD}
function bTrigger(){const tp=(K.parts.top||[])[0],ro=tp&&tp.userData.rotor,RD=revDetails(),hm=RD.hm,hp=RD.hp,tg=RD.tg;hm.position.y=K.top+0.03;
 const sp=LP([RV.grip[0]+0.04,RV.grip[1]-0.115]);sp.y=K.top+0.015;const scr=put(K.work,Cy(0.009,0.009,0.006,10),M('#c9a23a',0.3),sp.x,sp.y,sp.z),sr=put(K.work,new THREE.RingGeometry(0.018,0.025,22),new THREE.MeshBasicMaterial({color:'#ffd77a',transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}),sp.x,sp.y+0.003,sp.z);sr.rotation.x=-Math.PI/2;
 let hold=false,pr=0,zc=0.66,zw=0.12,ok=0,att=0,miss=0,need=false,busy=false,cocked=false,turn=0;const sc=[];
 const b=qcUI('Tetik','Tetiği çek · basılı tut');b.onpointerdown=e=>{e.preventDefault();if(need||busy){if(need)toast('Önce ayar vidasını sık',900);return}hold=true;cocked=false};b.onpointerup=b.onpointerleave=b.onpointercancel=()=>{if(hold)rel();hold=false};
 const zone=()=>{zc=0.55+Math.random()*0.25;zw=Math.max(0.08,0.12-ok*0.015);const z=$('qcZ');if(z){z.style.left=((zc-zw/2)*100)+'%';z.style.width=(zw*100)+'%'}};
 const lbl=t=>{const s=$('qcS');if(s)s.textContent=t||`Temiz tetik ${ok}/3 · mermisiz deneme`};
 const click=()=>{noise(0.025,0.16,3200,2);tone(1500,0.03,'square',0.06);setTimeout(()=>tone(2400,0.02,'square',0.03),25);setTimeout(()=>{noise(0.04,0.05,1800,3);tone(900,0.02,'square',0.02)},140)};
 const setP=v=>{hm.rotation.y=0.9*Math.min(1,v);hm.position.y=K.top+0.03+0.012*Math.min(1,v);if(tg.userData.tr)tg.userData.tr.position.x=0.004-0.014*Math.min(1,v);if(ro)ro.rotation.x=turn+Math.min(1,v)*0.12};
 const rel=()=>{if(busy)return;att++;const e=Math.abs(pr-zc);if(e<=zw/2){busy=true;ok++;sc.push(1-e/(zw/2)*0.35);click();const p0=pr;tween(0.07,k=>setP(p0*(1-k)));if(ro){const t0=turn,t1=turn+Math.PI/3;turn=t1;tween(0.3,k=>ro.rotation.x=t0+(t1-t0)*k)}ringPulse(V(hp.x,K.top+0.04,hp.z),0.05,'#fff1c0');sparkle(V(hp.x,K.top+0.05,hp.z),5);toast(ok>=3?'Tetik pürüzsüz!':'Klik! Horoz düştü, top bir yuva döndü',900);lbl();
   if(ok>=3){K.tick=null;const s0=clamp(avg(sc)-miss*0.1,0.35,1);K.qc=s0;setTimeout(()=>fin(s0,'Tetik ayarı kusursuz!'),900);return}setTimeout(()=>{busy=false;pr=0;zone()},700)}
  else{miss++;need=true;const p0=pr;tween(0.25,k=>setP(p0*(1-k)));sfx.tap();toast(pr<zc?'Erken bıraktın: tetik ağır kaldı':'Geç bıraktın: tetik boşa düştü',1300);lbl('Ayar vidasını sık (parlayan vida)');sr.material.opacity=0.8;pr=0}};
 K.pd=p=>{if(!need)return;if(Math.hypot(p.x-sp.x,p.z-sp.z)<0.06){need=false;sr.material.opacity=0;const r0=scr.rotation.y;tween(0.35,k=>scr.rotation.y=r0+Math.PI*k);tone(620,0.05,'square',0.03);setTimeout(()=>tone(820,0.05,'square',0.03),90);zone();lbl();toast('Ayarlandı · tekrar dene',800)}};
 K.tick=dt=>{if(need){sr.material.opacity=0.45+0.35*Math.sin(tt*8)}if(hold&&!busy){pr=Math.min(1.02,pr+dt*(0.32+pr*0.35));setP(pr);if(!cocked&&pr>0.3){cocked=true;tone(900,0.02,'square',0.03)}if(pr>=1.02){hold=false;rel()}}
  const p2=$('qcP'),f=$('qcF');if(p2)p2.style.left=Math.round(Math.min(1,pr)*100)+'%';if(f)f.style.width=Math.round(Math.min(1,pr)*100)+'%'};
 zone();lbl();tipStep('Mermisiz deneme: basılı tut, horoz kalkar · ibre yeşildeyken bırak');setTimeout(()=>{if(G.step==='tetik'&&!att)toast('Kuru tetik testi: silah ateşlenmez, sadece mekanizma denenir',2400)},400);
 K.skipFn=()=>{qcSkip();K.work.remove(sr)};K.trg={get pr(){return pr},set pr(v){pr=v},get zc(){return zc},rel,fixScrew(){K.pd(sp)},get need(){return need},get ok(){return ok}}}
/* Kuş kafesi kalite kontrolü: kuş kafeste dolaşır, açılmış tellere yönelir; kuş varmadan açık tele dokunup düzelt */
function bCage(){const tel=(K.parts.tel||[])[0],bars=tel&&tel.userData.bars;if(!bars||!bars.length){K.qc=0.6;fin(0.6,'Kafes hazır');return}
 const kus=kfPart('kus',null,1).g,bird=kus.userData.bird;kus.position.copy(tel.position);K.work.add(kus);
 const pick=bars.map((b,i)=>i).filter(i=>{const a=bars[i].userData.a;return Math.abs(Math.sin(a)-1)>0.15}).sort(()=>Math.random()-0.5).slice(0,3);
 const bent=pick.map(i=>{const b=bars[i],a=b.userData.a,p0=b.position.clone(),r0=b.rotation.clone();const h=put(tel,Cy(0.022,0.022,KF.H,8),new THREE.MeshBasicMaterial({visible:false}),p0.x,p0.y,p0.z);
  const ax=V(-Math.sin(a),0,Math.cos(a));const q=new THREE.Quaternion().setFromAxisAngle(ax,-0.32);b.quaternion.premultiply(q);b.position.x+=Math.cos(a)*0.02;b.position.z+=Math.sin(a)*0.02;b.material=b.material.clone();b.material.emissive=new THREE.Color('#ff9a3a');b.material.emissiveIntensity=0.0;
  return {b,h,a,p0,r0,ok:false}});
 let tgt=null,tT=0,esc=0,wrong=0,done=false,t0=tt;const LIM=4.2;
 const b=qcUI('Kafes','Kuş kaçmadan açık teli düzelt');b.style.display='none';const lbl=()=>{const s=$("qcS"),f=$("qcF"),n=bent.filter(x=>x.ok).length;if(s)s.textContent=`Düzeltilen tel ${n}/${bent.length} · kaçış ${esc}`;if(f)f.style.width=Math.round(n/bent.length*100)+"%"};lbl();
 const next=()=>{const L=bent.filter(x=>!x.ok);if(!L.length)return end();tgt=L[Math.floor(Math.random()*L.length)];tT=0;const a=tgt.a,from=bird.position.clone(),to=V(Math.cos(a)*0.07,bird.position.y,Math.sin(a)*0.07);bird.rotation.y=-a;tween(0.6,k=>{bird.position.lerpVectors(from,to,k);bird.position.y=KF.H0+0.112+Math.sin(k*Math.PI)*0.03});tone(2600,0.05,'sine',0.03);setTimeout(()=>tone(3100,0.05,'sine',0.03),80)};
 const fix=x=>{x.ok=true;x.b.quaternion.setFromEuler(x.r0);const pa=x.b.position.clone();tween(0.2,k=>x.b.position.lerpVectors(pa,x.p0,k));x.b.material.emissiveIntensity=0;noise(0.04,0.08,3000,2);tone(1400,0.04,'square',0.03);sparkle(tel.position.clone().add(x.p0).add(V(0,0.05,0)),6);lbl();if(x===tgt)setTimeout(next,250)};
 const end=()=>{if(done)return;done=true;K.tick=null;const sc=clamp(1-esc*0.2-wrong*0.06-Math.max(0,tt-t0-20)*0.01,0.3,1);K.qc=sc;const fr=bird.position.clone();tween(0.5,k=>{bird.position.lerpVectors(fr,V(0,KF.H0+0.095,0),k);bird.position.y+=Math.sin(k*Math.PI)*0.03});
  for(let i=0;i<4;i++)setTimeout(()=>tone(2400+i*300+Math.random()*200,0.08,'sine',0.04),300+i*140);setTimeout(()=>fin(sc,'Kafes sağlam, kuş mutlu!'),1100)};
 K.pd=()=>{if(done)return;const hit=ray.intersectObjects(bent.filter(x=>!x.ok).map(x=>x.h),false)[0];if(hit){fix(bent.find(x=>x.h===hit.object))}else{wrong++;sfx.tap()}};
 K.tick=dt=>{if(done||!tgt)return;tT+=dt;bent.forEach(x=>{if(!x.ok)x.b.material.emissiveIntensity=0.35+0.3*Math.sin(tt*8)});
  if(tT>LIM&&!tgt.ok){esc++;lbl();toast('Kuş aralıktan kafasını uzattı!',1100);const a=tgt.a,fr=bird.position.clone();tween(0.25,k=>bird.position.lerpVectors(fr,V(Math.cos(a)*0.12,fr.y,Math.sin(a)*0.12),k),()=>{const f2=bird.position.clone();tween(0.35,k=>bird.position.lerpVectors(f2,V(0,KF.H0+0.112,0),k))});tone(3600,0.06,'sine',0.05);setTimeout(()=>tone(3200,0.06,'sine',0.05),90);tT=-0.4;setTimeout(()=>{if(!done)next()},700)}};
 tipStep('Kuş açık tele yöneliyor · parlayan teli dokunarak düzelt');setTimeout(next,700);
 K.skipFn=()=>{qcSkip();bent.forEach(x=>{if(!x.ok){x.ok=true;x.b.quaternion.setFromEuler(x.r0);x.b.position.copy(x.p0);x.b.material.emissiveIntensity=0}})};K.cg={fixAll(){bent.filter(x=>!x.ok).forEach(fix)},get esc(){return esc}}}
/* Usturlap kalibrasyonu: ağı merkez çevresinde döndürüp kırmızı yıldız işaretçisini altın nişana hizala; üç yıldız */
function bAlign(){const rt=(K.parts.rete||[])[0];if(!rt){K.qc=0.6;fin(0.6,'Usturlap hazır');return}const c=rt.position.clone(),STARS=['Vega','Sirius','Altair'],ang=a=>{a=(a+Math.PI)%(Math.PI*2);if(a<0)a+=Math.PI*2;return a-Math.PI};
 const mk=new THREE.Group();put(mk,new THREE.ConeGeometry(0.009,0.022,4),M('#ffd24a',0.3),0,0,0).rotation.z=Math.PI/2;mk.position.y=c.y+0.02;K.work.add(mk);const halo=put(K.work,new THREE.RingGeometry(0.012,0.017,20),new THREE.MeshBasicMaterial({color:'#ffe08a',transparent:true,opacity:0.8,depthWrite:false,side:THREE.DoubleSide}),0,c.y+0.021,0);halo.rotation.x=-Math.PI/2;
 let round=0,th=0,drag=null,sc=[],t1=tt,done=false;
 const b=qcUI('Nişan','Ağı çevir · yıldızı nişana getir');b.style.display='none';
 const setT=()=>{th=(Math.random()*2-1)*Math.PI;const r=0.152;mk.position.x=c.x+Math.cos(th)*r;mk.position.z=c.z+Math.sin(th)*r;mk.rotation.y=-th+Math.PI;halo.position.x=c.x+Math.cos(th)*0.132;halo.position.z=c.z+Math.sin(th)*0.132;
  rt.rotation.y=-(th+(Math.random()<0.5?1:-1)*(1+Math.random()*1.6));t1=tt;const s=$('qcN');if(s)s.textContent=STARS[round];toast(`${STARS[round]} yıldızını nişana hizala`,1200)};
 const err=()=>Math.abs(ang(-rt.rotation.y-th));
 const ui2=()=>{const e=err(),f=$('qcF'),p=$('qcP'),s=$('qcS');const k=Math.max(0,1-e/(Math.PI/2));if(f)f.style.width=Math.round(k*100)+'%';if(p)p.style.left=Math.round(k*100)+'%';if(s)s.textContent=`Yıldız ${round+1}/3 · sapma ${Math.round(e*180/Math.PI)}°`};
 {const z=$('qcZ');if(z){z.style.left='94%';z.style.width='6%'}}
 K.pd=p=>{if(done)return;drag={a0:Math.atan2(p.z-c.z,p.x-c.x),r0:rt.rotation.y}};
 K.pm=p=>{if(!drag||done)return;const a=Math.atan2(p.z-c.z,p.x-c.x);rt.rotation.y=drag.r0-(ang(a-drag.a0));ui2();if(err()<0.05&&!drag.tk){drag.tk=1;tone(1800,0.03,'square',0.03)}else if(err()>=0.05)drag.tk=0};
 K.pu=()=>{if(!drag||done)return;drag=null;const e=err();if(e<0.07){const s0=clamp(1-e/0.07*0.25-Math.max(0,tt-t1-6)*0.03,0.4,1);sc.push(s0);rt.rotation.y=-th;tone(1320,0.08,'triangle',0.06);setTimeout(()=>tone(1980,0.18,'sine',0.05),70);ringPulse(mk.position.clone(),0.05,'#fff1c0');sparkle(mk.position.clone().add(V(0,0.02,0)),8,['#ffffff','#fff3c4','#cfe8ff']);
   round++;if(round>=3){done=true;K.tick=null;K.work.remove(mk);K.work.remove(halo);const q=avg(sc);K.qc=q;setTimeout(()=>fin(q,'Usturlap ayarlandı!'),700)}else setTimeout(setT,700)}else{sfx.tap();toast('Biraz daha · işaretçi altın nişanın tam üstüne gelmeli',1100)}};
 K.tick=()=>{halo.material.opacity=0.5+0.35*Math.sin(tt*6);ui2()};
 tipStep('Ağı merkez çevresinde sürükleyerek çevir · kırmızı işaretçiyi altın nişana getir');setT();ui2();
 K.skipFn=()=>{qcSkip();K.work.remove(mk);K.work.remove(halo)};K.aln={solve(){rt.rotation.y=-th;drag={};K.pu()}}}
