/* ---------- hava durumu ---------- */
const WX={acik:{ad:'Açık',ic:'☀'},bulut:{ad:'Bulutlu',ic:'☁'},yagmur:{ad:'Yağmurlu',ic:'☂'},kar:{ad:'Karlı',ic:'❄'},ruzgar:{ad:'Rüzgârlı',ic:'≋'}};
let wx='acik',wxK=1,wxNext=60,snowAcc=0,wxRainT=0;
function mkPrec(N,cx,cy,cz,sx,sy,sz,rainCol,ps){const rp=new Float32Array(N*6),sp=new Float32Array(N*3),d=[];for(let i=0;i<N;i++)d.push({x:Math.random(),y:Math.random(),z:Math.random(),s:0.7+Math.random()*0.6,ph:Math.random()*6});
 const rg=new THREE.BufferGeometry();rg.setAttribute('position',new THREE.BufferAttribute(rp,3));const rl=new THREE.LineSegments(rg,new THREE.LineBasicMaterial({color:rainCol,transparent:true,opacity:0.8}));rl.frustumCulled=false;rl.visible=false;S.add(rl);
 const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(sp,3));const pm=new THREE.PointsMaterial({color:'#ffffff',size:ps,transparent:true,opacity:0.9,depthWrite:false});const pt=new THREE.Points(sg,pm);pt.frustumCulled=false;pt.visible=false;S.add(pt);
 return {N,d,rl,pt,pm,c:V(cx,cy,cz),sx,sy,sz,upd(dt,on){const t=wx,K=Math.min(1,wxK);const rain=on&&t==='yagmur',sn=on&&(t==='kar'||t==='ruzgar');rl.visible=rain;pt.visible=sn;if(!rain&&!sn)return;
  const n=Math.floor(this.N*K*(t==='ruzgar'?0.18:1)),c=this.c;if(rain)rg.setDrawRange(0,n*2);else sg.setDrawRange(0,n);pm.color.set(t==='ruzgar'?'#8aa04a':'#ffffff');
  for(let i=0;i<n;i++){const q=d[i];if(rain){q.y-=dt*2.2*q.s*(9/this.sy);q.x+=dt*0.02}else if(t==='kar'){q.y-=dt*0.09*q.s*(9/this.sy);q.x+=Math.sin(tt*0.8+q.ph)*dt*0.02}else{q.x+=dt*0.35*q.s*(16/this.sx);q.y+=Math.sin(tt*2+q.ph)*dt*0.03-dt*0.02}
   if(q.y<0)q.y+=1;if(q.y>1)q.y-=1;if(q.x>1)q.x-=1;const x=c.x+(q.x-0.5)*this.sx,y=c.y+q.y*this.sy,z=c.z+(q.z-0.5)*this.sz;
   if(rain){rp[i*6]=x;rp[i*6+1]=y;rp[i*6+2]=z;rp[i*6+3]=x+0.01*this.sx/16;rp[i*6+4]=y+0.035*this.sy;rp[i*6+5]=z}else{sp[i*3]=x;sp[i*3+1]=y;sp[i*3+2]=z}}
  if(rain)rg.attributes.position.needsUpdate=true;else sg.attributes.position.needsUpdate=true}}}
const PO=mkPrec(1800,0,0,0,18,9,16,'#eef4fa',0.09),PW=mkPrec(90,1.2,1.42,-3.855,1.5,1.15,0.01,'#7d8c99',0.035);
const WXBG={acik:null,bulut:'#bcc6cc',yagmur:'#8f9ba4',kar:'#dfe5ea',ruzgar:'#c3cfc0'},WXWIN={acik:'#ffe6a8',bulut:'#e4dcc4',yagmur:'#aab6bf',kar:'#eef2f5',ruzgar:'#f0e2b0'},WXL={acik:1,bulut:0.8,yagmur:0.62,kar:0.78,ruzgar:0.92};
var GRD;
function setWx(n,quiet){if(n===wx)return;wx=n;wxK=0;if(!quiet&&G.started)toast(WX[n].ic+' Hava '+WX[n].ad.toLowerCase()+(n==='yagmur'?'<br>Tarlalar kendiliğinden sulanır':''),1700);hud()}
const SEAS=[{ad:'İlkbahar',ic:'🌸',p:['sabun','saksi','sepet','mumset','balkav'],w:[0.34,0.2,0.32,0.14,0]},{ad:'Yaz',ic:'☀️',p:['sapka','gozluk','sepet','basket','anahtarlik','sise','esarp'],w:[0.62,0.18,0.1,0.1,0]},{ad:'Sonbahar',ic:'🍂',p:['tespih','kalemlik','canta','ayakkabi','yastik'],w:[0.24,0.24,0.32,0.2,0]},{ad:'Kış',ic:'❄️',p:['atki','yastik','mum','boks','terlik','balkav','hali','cezve'],w:[0.2,0.25,0.08,0.12,0.35]}];
const season=()=>Math.floor(((G.day||1)-1)/7)%4;let lastSeas=-1;
function rollWx(quiet){const w=SEAS[season()].w,K5=['acik','bulut','yagmur','ruzgar','kar'];let r=Math.random(),i=0;while(i<4&&r>=w[i]){r-=w[i];i++}setWx(K5[i],quiet)}
const AMB={};
function ambInit(){if(AMB.ok||!AC)return;AMB.ok=1;if(!NB){NB=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const ch=NB.getChannelData(0);for(let i=0;i<ch.length;i++)ch[i]=Math.random()*2-1}
 const mk=(type,f,q)=>{const s=AC.createBufferSource();s.buffer=NB;s.loop=true;const fl=AC.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;const g=AC.createGain();g.gain.value=0;s.connect(fl);fl.connect(g);g.connect(OUT());s.start();return {fl,g}};
 AMB.rain=mk('lowpass',2400,0.3);const hp=AC.createBiquadFilter();hp.type='highpass';hp.frequency.value=500;AMB.rain.fl.disconnect();AMB.rain.fl.connect(hp);hp.connect(AMB.rain.g);
 AMB.wind=mk('bandpass',420,0.9);const lfo=AC.createOscillator(),lg=AC.createGain();lfo.frequency.value=0.13;lg.gain.value=260;lfo.connect(lg);lg.connect(AMB.wind.fl.frequency);lfo.start();
 const l2=AC.createOscillator(),g2=AC.createGain();l2.frequency.value=0.21;g2.gain.value=0.25;l2.connect(g2);AMB.wm=AC.createGain();AMB.wm.gain.value=0.75;g2.connect(AMB.wm.gain);AMB.wind.g.disconnect();AMB.wind.g.connect(AMB.wm);AMB.wm.connect(OUT());
 ['rain','wind'].forEach(k=>{if(SB['amb_'+k]){AMB[k].fl.disconnect();AMB['f'+k]=playB('amb_'+k,0,true);AMB[k].g=AMB['f'+k].g}})}
let ambT=0,birdT=5;
function wxTick(dt){wxK=Math.min(1,wxK+dt*0.25);if(G.started&&tt>wxNext){wxNext=tt+150+Math.random()*150;rollWx()}
 const out=view==='bahce'||view==='pazar',win=view==='home'||view==='vitrin';
 PO.c.copy(camCur.l);PO.c.y=-0.5;PO.upd(dt,out);PW.upd(dt,win);
 const k=Math.min(1,wxK);if(out){const b=WXBG[wx];if(b)S.background.set(BGS[view]).lerp(new THREE.Color(b),k*0.75)}
 winM.color.set(WXWIN.acik).lerp(new THREE.Color(WXWIN[wx]),k);
 snowAcc=clamp(snowAcc+(wx==='kar'?dt*0.01:-dt*0.02),0,0.75);if(GRD)GRD.material.color.set('#86a852').lerp(new THREE.Color('#eef2f0'),snowAcc);
 if(wx==='yagmur'&&k>0.6&&tt>wxRainT){wxRainT=tt+4;let n=0;PL.forEach(o=>{if(o.own&&o.seed&&!o.w){o.w=true;o.end=NOW()+o.dur;n++}});if(n){plotTick();save()}}
 if(!AC||tt<ambT)return;ambT=tt+0.25;ambInit();const on=G.snd&&AC.state==='running',inside=out?1:0.32,T=AC.currentTime;
 AMB.rain.g.gain.setTargetAtTime(on&&wx==='yagmur'?0.09*k*inside:0,T,0.6);AMB.wind.g.gain.setTargetAtTime(on?(wx==='ruzgar'?0.16:wx==='kar'?0.07:wx==='yagmur'?0.04:0)*k*(out?1:0.4):0,T,0.8);
 if(on&&out&&wx==='acik'&&!G.night&&tt>birdT){birdT=tt+3+Math.random()*7;const f=2200+Math.random()*1400;tone(f,0.07,'sine',0.018,f*1.3);tone(f*1.1,0.06,'sine',0.014,f*1.45,0.11);if(Math.random()<0.5)tone(f*0.95,0.08,'sine',0.014,f*1.25,0.24)}}
function dayLightWx(){const m=WXL[wx]*1;[sun,gSun,pSun].forEach(l=>{if(l.visible)l.intensity*=m+(1-m)*(1-Math.min(1,wxK))})}

function musSched(){if(!AC||!MU.g||!G.mus||AC.state!=='running')return;if(SB.muzik){if(!MU.src){MU.src=AC.createBufferSource();MU.src.buffer=SB.muzik;MU.src.loop=true;const g=AC.createGain();g.gain.value=0.45;MU.src.connect(g);g.connect(MU.g);MU.src.start()}return}const be=60/68,e=be/2;if(MU.next<AC.currentTime)MU.next=AC.currentTime+0.1;
while(MU.next<AC.currentTime+0.6){const t=MU.next,st=MU.step,ch=CH[Math.floor(st/8)%4];
if(st%8===0){ch.forEach(m=>mv(hz(m),t,be*4+0.6,'triangle',0.016,1.1,1.3,false));mv(hz(ch[0]-12),t,be*1.8,'sine',0.07,0.03,1.2,false)}
if(st%8===4)mv(hz(ch[0]-12),t,be*1.6,'sine',0.05,0.03,1.1,false);

MU.next+=e;MU.step++}}
setInterval(musSched,140);
function musSet(on){G.mus=on;ac();if(AC){musInit();const t=AC.currentTime;MU.g.gain.cancelScheduledValues(t);MU.g.gain.setTargetAtTime(on?0.6:0,t,on?1.2:0.4)}const b=$('musB');if(b)b.classList.toggle('off',!on)}
document.addEventListener('visibilitychange',()=>{if(!AC)return;if(document.hidden)AC.suspend();else AC.resume()});
const sThr=(fn,gap)=>{if(tt-sT>(gap||0.07)){sT=tt;fn()}};
$('ui').addEventListener('click',e=>{if(e.target.closest('button'))sfx.tap()},true);
