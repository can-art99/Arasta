const CN='<svg class="cn" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#e8a915" stroke="#7a5408" stroke-width="1.5"/><circle cx="8" cy="8" r="3.5" fill="none" stroke="#7a5408" stroke-width="1.2"/></svg>';
/* ---------- ses ---------- */
let AC=null,NB=null,sT=0;
function ac(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state!=='running'){try{AC.resume()}catch(e){}try{const b=AC.createBuffer(1,1,22050),s=AC.createBufferSource();s.buffer=b;s.connect(AC.destination);s.start(0)}catch(e){}}if(AC)loadSounds()}
var AC_RE=false;try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(e){}
['pointerdown','touchend','click','keydown'].forEach(ev=>addEventListener(ev,()=>{if(AC&&AC_RE&&ev!=='pointerdown'){AC_RE=false;try{AC.suspend().then(()=>AC.resume()).then(()=>ac()).catch(()=>ac())}catch(e){ac()}return}if(!AC||AC.state!=='running')ac()},{capture:true,passive:true}));
document.addEventListener('pointerdown',ac,true);
function tone(f,d,type,vol,f2,delay){const a=AC;if(!a||!G.snd)return;const t=a.currentTime+(delay||0),o=a.createOscillator(),g=a.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);
g.gain.setValueAtTime(vol||0.15,t);g.gain.exponentialRampToValueAtTime(0.001,t+d);o.connect(g);g.connect(BUS(AMBF?'a':'e'));o.start(t);o.stop(t+d+0.02)}
function noise(d,vol,freq,q,delay,f2){const a=AC;if(!a||!G.snd)return;if(!NB){NB=a.createBuffer(1,a.sampleRate,a.sampleRate);const ch=NB.getChannelData(0);for(let i=0;i<ch.length;i++)ch[i]=Math.random()*2-1}
const t=a.currentTime+(delay||0),s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=NB;s.loop=true;f.type='bandpass';f.frequency.setValueAtTime(freq||1000,t);if(f2)f.frequency.exponentialRampToValueAtTime(f2,t+d);f.Q.value=q||1;
g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(vol||0.2,t+Math.min(0.012,d*0.2));g.gain.exponentialRampToValueAtTime(0.001,t+d);s.connect(f);f.connect(g);g.connect(BUS(AMBF?'a':'e'));s.start(t,Math.random()*0.5);s.stop(t+d+0.02)}
const sfx={tap:()=>tone(480,0.05,'sine',0.05),swoosh:()=>{noise(0.26,0.045,320,0.6,0,520);tone(330,0.22,'sine',0.02,392)},pick:()=>{tone(620,0.08,'sine',0.12,980);tone(980,0.1,'sine',0.07,1300,0.06)},
cut:()=>{noise(0.045,0.16,4200,5);tone(2600,0.018,'square',0.025);noise(0.05,0.13,5200,6,0.07);tone(3100,0.018,'square',0.02,null,0.07)},
stitch:()=>{tone(1700,0.02,'triangle',0.07);noise(0.17,0.075,1600,3,0.02,4400)},
glue:()=>{tone(190,0.15,'sine',0.14,85);noise(0.11,0.07,520,2,0,240)},
punch:()=>{tone(150,0.1,'sine',0.32,58);noise(0.03,0.22,2400,1);tone(880,0.04,'square',0.035)},
thud:()=>{noise(0.24,0.05,720,7,0,300);tone(92,0.26,'sine',0.36,40,0.06);noise(0.1,0.18,250,0.7,0.06)},
sand:()=>noise(0.15,0.1,2700,0.6,0,1700),skive:()=>noise(0.17,0.085,1400,1.6,0,2900),wax:()=>noise(0.22,0.05,650,0.5,0,1150),
brush:()=>{noise(0.36,0.075,850,0.7,0,2300);tone(310,0.22,'sine',0.03,235)},drop:()=>{tone(400,0.08,'triangle',0.12,280);noise(0.04,0.08,1200,1)},
good:()=>{tone(660,0.1,'triangle',0.1);tone(880,0.14,'triangle',0.1,null,0.09)},bad:()=>tone(200,0.22,'sawtooth',0.06,130),coin:()=>{tone(1300,0.07,'square',0.045);tone(1750,0.18,'square',0.045,null,0.07)},cash:()=>{for(let i=0;i<9;i++)tone(2200+Math.random()*1800,0.06+Math.random()*0.05,i%2?'triangle':'square',0.03,null,i*0.055+Math.random()*0.02);tone(1300,0.08,'square',0.04);tone(1750,0.22,'square',0.04,null,0.5)},
fan:()=>[523,659,784,1047].forEach((f,i)=>tone(f,0.16,'triangle',0.11,null,i*0.09)),bell:()=>{tone(1560,0.5,'sine',0.09);tone(2340,0.35,'sine',0.045)},start:()=>tone(300,0.12,'triangle',0.09,450),
ready:()=>{tone(784,0.1,'sine',0.11);tone(1047,0.2,'sine',0.11,null,0.1)},plant:()=>{noise(0.12,0.13,500,0.8);tone(300,0.08,'sine',0.08,200,0.05)}};
Object.assign(sfx,{water:()=>{noise(0.6,0.09,3800,0.4);[0,0.12,0.25].forEach(d=>tone(1300,0.08,'sine',0.06,600,d))},seed:()=>[0,0.07,0.15].forEach(d=>tone(900+Math.random()*300,0.05,'triangle',0.06,null,d))});
const MU={g:null,next:0,step:0};const hz=m=>440*Math.pow(2,(m-69)/12);
const CH=[[50,57,60,64,69],[43,53,57,62,65],[48,55,59,64,67],[45,52,55,60,64]],PEN=[69,72,74,76,79,81];
function musInit(){if(!AC||MU.g)return;MU.g=AC.createGain();MU.g.gain.value=0;MU.g.connect(BUS('m'));MU.f=AC.createBiquadFilter();MU.f.type='lowpass';MU.f.frequency.value=1500;MU.f.connect(MU.g);
MU.d=AC.createDelay(1);MU.d.delayTime.value=0.43;MU.fb=AC.createGain();MU.fb.gain.value=0.3;MU.d.connect(MU.fb);MU.fb.connect(MU.d);MU.d.connect(MU.f)}
function mv(f,t,d,type,v,att,rel,dl){const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+att);g.gain.setValueAtTime(v,t+Math.max(att,d-rel));g.gain.linearRampToValueAtTime(0,t+d);
o.connect(g);g.connect(MU.f);if(dl)g.connect(MU.d);o.start(t);o.stop(t+d+0.05)}
/* ---------- ses dosyaları (sounds/list.json) ---------- */
const SB={};let sbTried=false,SBL=null;
function loadSounds(){if(sbTried||!AC)return;sbTried=true;const dec=(n,b)=>AC.decodeAudioData(b.slice(0),buf=>{SB[n.replace(/\.[^.]+$/,'')]=buf},()=>{});const go=l=>{SBL=l;l.forEach(n=>{let k=0;const w=()=>{if(SBRAW[n]){dec(n,SBRAW[n]);return}if(++k<40)setTimeout(w,250);else fetch(AU('sounds/'+n)).then(r=>r.arrayBuffer()).then(b=>dec(n,b)).catch(()=>{})};w()})};if(SBLIST)go(SBLIST);else fetch(AU('sounds/list.json')).then(r=>r.ok?r.json():[]).then(go).catch(()=>{})}
function playB(n,vol,loop,bus){const s=AC.createBufferSource(),g=AC.createGain();s.buffer=SB[n];s.loop=!!loop;if(!loop)s.playbackRate.value=0.95+Math.random()*0.1;g.gain.value=vol;s.connect(g);g.connect(BUS(bus||'e'));s.start();return {s,g}}
/* Kayıt dosyası varsa çal, yoksa false döner (sentez yedeğe düşer) */
function sf(n,v){if(SB[n]&&AC&&G.snd){playB(n,v||0.6);return true}return false}
Object.keys(sfx).forEach(k=>{const f=sfx[k];sfx[k]=function(){if(SB[k]&&AC&&G.snd){playB(k,0.7);return}return f.apply(this,arguments)}});