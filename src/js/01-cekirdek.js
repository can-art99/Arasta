const $=id=>document.getElementById(id);
const frame=$('frame'),canvas=$('c'),fx=$('fx'),ctx=fx.getContext('2d');
const R=new THREE.WebGLRenderer({canvas,antialias:true});
const LOW=(matchMedia&&matchMedia('(pointer:coarse)').matches)||innerWidth<820,MAXDPR=LOW?1.3:2;R.setPixelRatio(Math.min(devicePixelRatio,MAXDPR));R.shadowMap.enabled=true;R.shadowMap.type=LOW?THREE.PCFShadowMap:THREE.PCFSoftShadowMap;R.shadowMap.autoUpdate=false;R.shadowMap.needsUpdate=true;
R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.25;
const S=new THREE.Scene();S.background=new THREE.Color('#2b1d12');
const cam=new THREE.PerspectiveCamera(62,1,0.05,80);
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const OI=20,OB=-20,OP=40,OD=-40;
const VIEWS={home:{p:V(0,1.75,3.6),l:V(0,1.05,-1.2)},bench:{p:V(0,3.3,2.36),l:V(0,1.1,1.63)},
islik:{p:V(OI,11.8,5.6),l:V(OI,0,0.45)},bahce:{p:V(OB,8.6,11.1),l:V(OB,0,3.0)},pazar:{p:V(OP,11.2,5.6),l:V(OP,0,-1.0)},depo:{p:V(OD,2.1,3.5),l:V(OD,1.9,-2.85)},vitrin:{p:V(-1.75,1.72,-1.45),l:V(2.7,1.62,-1.45)}};
const camCur={p:VIEWS.home.p.clone(),l:VIEWS.home.l.clone()};let sway=1,view='home';
let W=1,H=1,dpr=1;
function resize(){W=frame.clientWidth;H=frame.clientHeight;dpr=Math.min(devicePixelRatio,MAXDPR);R.setSize(W,H,false);cam.aspect=W/H;cam.updateProjectionMatrix();fx.width=W*dpr;fx.height=H*dpr}
addEventListener('resize',resize);addEventListener('orientationchange',()=>setTimeout(resize,300));document.addEventListener('visibilitychange',()=>setTimeout(resize,200));if(window.ResizeObserver)new ResizeObserver(()=>resize()).observe(frame);resize();

const M=(c,r)=>new THREE.MeshStandardMaterial({color:c,flatShading:true,roughness:r==null?0.85:r});
const glow=c=>new THREE.MeshBasicMaterial({color:c});
const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
const Cy=(a,b,h,s)=>new THREE.CylinderGeometry(a,b,h,s||10);
function mesh(g,m){const o=new THREE.Mesh(g,m);o.castShadow=true;o.receiveShadow=true;return o}
function put(par,g,m,x,y,z){const o=mesh(g,m);o.position.set(x,y,z);par.add(o);return o}
const add=(g,m,x,y,z)=>put(S,g,m,x,y,z);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const shade=(hex,a)=>{const c=new THREE.Color(hex);c.setRGB(clamp(c.r*(1+a),0,1),clamp(c.g*(1+a),0,1),clamp(c.b*(1+a),0,1));return '#'+c.getHexString()};

function soleShape(sc){const s=new THREE.Shape(),N=56;for(let i=0;i<=N;i++){const t=i/N*Math.PI*2,y=Math.sin(t)*0.3*sc,toe=(Math.sin(t)+1)/2;
const w=(0.075+0.045*toe-0.022*Math.exp(-((toe-0.42)**2)/0.02))*sc,x=Math.cos(t)*w;i?s.lineTo(x,y):s.moveTo(x,y)}return s}
function rrect(w,h,r){const s=new THREE.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);
s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s}
function wedgeShape(r,a0,a1){const s=new THREE.Shape(),N=24;s.moveTo(0,0);for(let i=0;i<=N;i++){const t=a0+(a1-a0)*i/N;s.lineTo(Math.cos(t)*r,Math.sin(t)*r)}s.lineTo(0,0);return s}
function rotShape(sh,a){if(!a)return sh;const c=Math.cos(a),n=Math.sin(a),s=new THREE.Shape(sh.getPoints(60).map(p=>new THREE.Vector2(p.x*c-p.y*n,p.x*n+p.y*c)));return s}
function circleShape(r){const s=new THREE.Shape(),N=40;for(let i=0;i<=N;i++){const t=i/N*Math.PI*2;i?s.lineTo(Math.cos(t)*r,Math.sin(t)*r):s.moveTo(r,0)}return s}
function spoonShape(){const s=new THREE.Shape(),rx=0.085,ry=0.13,cy=0.2,hw=0.02,a=Math.asin(hw/rx);s.moveTo(-hw,-0.36);s.lineTo(-hw,cy-ry*Math.cos(a));
for(let i=0;i<=28;i++){const th=-Math.PI/2-a-(2*Math.PI-2*a)*i/28;s.lineTo(rx*Math.cos(th),cy+ry*Math.sin(th))}s.lineTo(hw,-0.36);s.quadraticCurveTo(0,-0.4,-hw,-0.36);return s}
function hideShape(Rr){const s=new THREE.Shape(),N=22;for(let i=0;i<=N;i++){const t=i/N*Math.PI*2,r=Rr*(1+0.12*Math.sin(3*t)+0.08*Math.sin(5*t+1)),x=Math.cos(t)*r*1.25,y=Math.sin(t)*r*0.85;i?s.lineTo(x,y):s.moveTo(x,y)}return s}
const ext=(sh,d,bv)=>new THREE.ExtrudeGeometry(sh,{depth:d,bevelEnabled:!!bv,bevelThickness:bv||0,bevelSize:bv?bv*0.6:0,bevelSegments:2,curveSegments:12});
function flat(sh,d,hex,bv){const m=mesh(ext(sh,d,bv),typeof hex==='string'?M(hex):hex);m.rotation.x=-Math.PI/2;return m}
function shapePts(sh,n,c,yo,sc){sc=sc||1;return sh.getSpacedPoints(n).slice(0,n).map(p=>V(c.x+p.x*sc,c.y+(yo||0),c.z-p.y*sc))}
function lineSeg(par,a,b,hex,th){const d=Math.hypot(b.x-a.x,b.z-a.z),m=mesh(B(th||0.008,th||0.008,d),M(hex));m.position.set((a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2);m.rotation.y=Math.atan2(b.x-a.x,b.z-a.z);par.add(m);return m}
