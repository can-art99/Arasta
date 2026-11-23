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
 const sl=S0.map((d,i)=>{const p=LP(d.p),g=flat(inlayShape(d.k,(d.s||1)*1.12),0.0015,M('#24140a',0.9),0);g.position.set(p.x,y0+0.0006,p.z);g.rotation.z=d.r||0;K.work.add(g);
  const rim=flat(inlayShape(d.k,(d.s||1)*1.3),0.0008,new THREE.MeshBasicMaterial({color:'#ffd77a',transparent:true,opacity:0,depthWrite:false}),0);rim.position.set(p.x,y0+0.0003,p.z);rim.rotation.z=d.r||0;K.work.add(rim);return {d,p,g,rim,done:false}});
 const ord=S0.map((d,i)=>i).sort(()=>Math.random()-0.5),tx=BC.x-0.47,tz=BC.z-0.15;
 const tray=put(K.work,B(0.2,0.012,0.4),M('#4a1f3a',0.95),tx+0.04,y0+0.003,tz+0.15);put(K.work,B(0.21,0.02,0.01),M('#c9a23a',0.4),tx+0.04,y0+0.006,tz-0.05).visible=true;
 const pc=ord.map((si,j)=>{const d=S0[si],m=flat(inlayShape(d.k,d.s||1),0.005,pearl(j),0.0012);const h=V(tx+(j%2)*0.085,y0+0.011,tz+Math.floor(j/2)*0.1);m.position.copy(h);m.rotation.z=d.r||0;K.work.add(m);return {m,d,home:h,done:false,ph:Math.random()*6}});
 K.inl={pc,sl};let drag=null,off=V(0,0,0),miss=0,errs=[],placed=0,near=null;
 const tip=()=>tipStep(`Sedefi aynı şekilli yuvaya sürükle · ${placed}/${pc.length}`);tip();
 const back=q=>{const a=q.m.position.clone();tween(0.25,k=>{q.m.position.lerpVectors(a,q.home,k);q.m.position.y+=Math.sin(k*Math.PI)*0.03},()=>q.m.scale.setScalar(1))};
 const findSlot=(x,z,r)=>{let b=null,bd=r;sl.forEach(s=>{if(s.done)return;const d=Math.hypot(s.p.x-x,s.p.z-z);if(d<bd){bd=d;b=s}});return b};
 K.pd=p=>{let b=null,bd=0.05;pc.forEach(q=>{if(q.done)return;const d=Math.hypot(q.m.position.x-p.x,q.m.position.z-p.z);if(d<bd){bd=d;b=q}});if(!b)return;drag=b;off.set(b.m.position.x-p.x,0,b.m.position.z-p.z);b.m.position.y=y0+0.03;b.m.scale.setScalar(1.18);sfx.pick&&sfx.pick();tone(1500,0.04,'triangle',0.05)};
 K.pm=p=>{if(!drag)return;drag.m.position.x=p.x+off.x;drag.m.position.z=p.z+off.z;const s=findSlot(drag.m.position.x,drag.m.position.z,0.06);if(near&&near!==s)near.rim.material.opacity=0;near=s;if(s)s.rim.material.opacity=s.d.k===drag.d.k?0.85:0.25};
 K.pu=()=>{if(!drag)return;const q=drag;drag=null;if(near)near.rim.material.opacity=0;const s=findSlot(q.m.position.x,q.m.position.z,0.055);near=null;
  if(s&&s.d.k===q.d.k&&(s.d.s||1)===(q.d.s||1)){const e=Math.hypot(s.p.x-q.m.position.x,s.p.z-q.m.position.z);errs.push(e);s.done=q.done=true;placed++;const a=q.m.position.clone(),b=V(s.p.x,y0-0.0015,s.p.z);q.m.rotation.z=s.d.r||0;
   tween(0.18,k=>{q.m.position.lerpVectors(a,b,k);q.m.scale.setScalar(1.18-0.18*k)},()=>{tone(2100,0.05,'triangle',0.08);tone(3150,0.25,'sine',0.05,null,0.03);impactFx(0.2,K.piece);sparkle(V(b.x,y0+0.01,b.z),9);ringPulse(V(b.x,y0+0.002,b.z),0.05);s.g.visible=false;
    if(placed>=pc.length){K.tick=null;const L=pc.slice();L.forEach((z,i)=>setTimeout(()=>{sparkle(V(z.m.position.x,y0+0.012,z.m.position.z),6,['#ffffff','#c9f2ff','#ffe9b0'],0.045,0.09);tone(1400+i*180,0.3,'sine',0.04)},120*i));
     setTimeout(()=>fin(clamp(1-miss*0.12-avg(errs.length?errs:[0])*3,0.3,1),'Kakma tamam!'),120*L.length+450)}else tip()})}
  else{if(s){miss++;sfx.bad();toast('Bu yuvaya uymuyor',700);jolt(q.m,0.004)}back(q)}};
 K.tick=dt=>{pc.forEach(q=>{if(q===drag)return;q.m.material.emissive.setHSL((tt*0.08+q.ph*0.1)%1,0.55,q.done?0.06:0.1)});if(drag)drag.m.material.emissive.setHSL((tt*0.3)%1,0.7,0.16)};
 K.skipFn=()=>{pc.forEach(q=>{if(q.done)return;const s=sl.find(z=>!z.done&&z.d.k===q.d.k&&(z.d.s||1)===(q.d.s||1));if(s){s.done=q.done=true;q.m.position.set(s.p.x,y0-0.0015,s.p.z);s.g.visible=false}})}}
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
 ui.act.innerHTML=`<div class="tune"><div class="tnL"><b id="tnN"></b><small id="tnS"></small></div><div class="tg"><div class="tz"></div><div class="tc"></div><div class="tnd" id="tnd"></div></div></div>`;
 const bL=btn('◀','l'),bR=btn('▶','l');[bL,bR].forEach((b,k)=>{b.style.minWidth='22%';b.onpointerdown=e=>{e.preventDefault();hold=k?1:-1;on=true};b.onpointerup=b.onpointerleave=b.onpointercancel=()=>{hold=0;on=false};ui.act.appendChild(b)});
 const start=()=>{busy=false;c=(Math.random()<0.5?-1:1)*(120+Math.random()*180);lastC=c;t0=tt;good=0;idle=0;$('tnN').textContent=NT[i][0];$('tnS').textContent=`Tel ${i+1}/${NT.length}`;tipStep(`${NT[i][0]} teli · sürükle ya da ◀ ▶ ile burguyu çevir, ibreyi ortaya getir`);pegs.forEach((p,k)=>p.scale.setScalar(k===i?1.25:1));halo.position.copy(pegs[i].position).add(V(0,0.002,0));str.forEach((s,k)=>{s.g.material.emissive&&s.g.material.emissive.set(k===i?'#6a5a2a':'#000000')});pl()};
 const fr=()=>NT[i][1]*Math.pow(2,c/1200);const pl=()=>{pluck(fr(),0.32);str[i].amp=0.004;lastPl=tt;lastC=c};
 const lock=()=>{busy=true;const e=Math.abs(c),s=clamp(1-e/30-Math.max(0,tt-t0-12)*0.01,0.35,1);sc.push(s);const fT=NT[i][1];pluck(fT,0.4);setTimeout(()=>tone(fT*2,0.6,'sine',0.05),60);const S1=str[i];S1.g.material=gm;sparkle(pegs[i].position.clone().add(V(0,0.04,0)),10);ringPulse(V(S1.a.x,yb,S1.a.z),0.04,'#ffe9b0');
  for(let k=0;k<6;k++){const p=S1.a.clone().lerp(S1.b,k/5);setTimeout(()=>sparkle(p,2,['#ffe9b0','#ffffff'],0.025,0.03),k*50)}pegs[i].scale.setScalar(1);toast(e<4?'Tam akort!':'Akort oldu',700);i++;if(i>=NT.length){K.tick=null;K.work.remove(halo);setTimeout(()=>{NT.forEach((n,k)=>setTimeout(()=>{pluck(n[1],0.35);str[k].amp=0.004},k*220));setTimeout(()=>fin(avg(sc),'Saz akortlu!'),NT.length*220+700)},400)}else setTimeout(start,550)};
 K.pd=p=>{on=true;lastX=p.x};K.pm=p=>{if(lastX==null)return;c+=(p.x-lastX)*900;lastX=p.x};K.pu=()=>{on=false;lastX=null};
 K.tick=dt=>{if(i>=NT.length||busy){str.forEach(s=>{s.amp*=Math.pow(0.04,dt);s.g.position.x=s.x0+Math.sin(tt*90)*s.amp});return}halo.material.opacity=0.35+0.3*Math.sin(tt*6);halo.scale.setScalar(1+0.12*Math.sin(tt*6));if(hold)c+=hold*70*dt;c=clamp(c,-400,400);pegs[i].rotation.y=c/90;
  if(on&&(Math.abs(c-lastC)>22||tt-lastPl>0.5))pl();if(!on&&tt-lastPl>1.6)pl();
  str.forEach(s=>{s.amp*=Math.pow(0.04,dt);s.g.position.x=s.x0+Math.sin(tt*90)*s.amp});
  const nd=$('tnd');if(nd){nd.style.left=(50+clamp(c,-100,100)/2)+'%';nd.classList.toggle('ok',Math.abs(c)<6)}
  if(Math.abs(c)<6){good+=dt;if(!on)idle+=dt;if(idle>0.35||good>0.9){lock();return}}else{good=0;idle=0}};
 K.skipFn=()=>{str.forEach(s=>s.g.material=gm)};K.tun={get c(){return c},set c(v){c=v}};start()}
