
(()=>{
const $=id=>document.getElementById(id);
const frame=$('frame'),canvas=$('c'),fx=$('fx'),ctx=fx.getContext('2d');
const R=new THREE.WebGLRenderer({canvas,antialias:true});
const LOW=(matchMedia&&matchMedia('(pointer:coarse)').matches)||innerWidth<820,MAXDPR=LOW?1.5:2;R.setPixelRatio(Math.min(devicePixelRatio,MAXDPR));R.shadowMap.enabled=true;R.shadowMap.type=LOW?THREE.PCFShadowMap:THREE.PCFSoftShadowMap;R.shadowMap.autoUpdate=false;R.shadowMap.needsUpdate=true;
R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.25;
const S=new THREE.Scene();S.background=new THREE.Color('#2b1d12');
const cam=new THREE.PerspectiveCamera(62,1,0.05,80);
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const OI=20,OB=-20,OP=40,OD=-40;
const VIEWS={home:{p:V(0,1.75,3.6),l:V(0,1.05,-1.2)},bench:{p:V(0,3.3,2.36),l:V(0,1.1,1.63)},
islik:{p:V(OI,11.8,5.6),l:V(OI,0,0.45)},bahce:{p:V(OB,8.6,9.1),l:V(OB,0,1.0)},pazar:{p:V(OP,7,6.8),l:V(OP,0,-0.3)},depo:{p:V(OD,2.1,3.5),l:V(OD,1.9,-2.85)},vitrin:{p:V(-1.75,1.72,-1.45),l:V(2.7,1.62,-1.45)}};
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

/* ---------- malzeme modelleri ---------- */
function buckle(hex){const g=new THREE.Group(),m=M(hex||'#d4b04a',0.4);put(g,B(0.12,0.016,0.016),m,0,0.008,-0.04);put(g,B(0.12,0.016,0.016),m,0,0.008,0.04);
put(g,B(0.016,0.016,0.096),m,-0.055,0.008,0);put(g,B(0.016,0.016,0.096),m,0.055,0.008,0);put(g,B(0.01,0.01,0.08),m,0,0.012,0);return g}
function pot(hex){const g=new THREE.Group();put(g,Cy(0.075,0.065,0.1,10),M('#b06a3a'),0,0.05,0);put(g,Cy(0.068,0.068,0.01,10),M(hex,0.3),0,0.1,0);
const rim=mesh(new THREE.TorusGeometry(0.075,0.01,5,12),M('#8a4f28'));rim.rotation.x=Math.PI/2;rim.position.y=0.1;g.add(rim);return g}
const PAINTS=[{id:'kahve',ad:'Kahverengi',hex:'#8a4214'},{id:'kirmizi',ad:'Kırmızı',hex:'#d42a1e'},{id:'lacivert',ad:'Lacivert',hex:'#1f48b8'},{id:'siyah',ad:'Siyah',hex:'#151313'},{id:'sari',ad:'Sarı',hex:'#f2b80f'},{id:'mor',ad:'Mor',hex:'#8a2fb8'}];
function seedMk(hex){return ()=>{const g=new THREE.Group();const s=put(g,new THREE.SphereGeometry(0.09,8,6),M('#cdbb94'),0,0.08,0);s.scale.set(1,0.9,1);put(g,Cy(0.035,0.05,0.05,6),M('#cdbb94'),0,0.17,0);put(g,Cy(0.04,0.04,0.012,8),M('#8a5530'),0,0.155,0);
[[0.12,0.015,0.05],[0.15,0.015,-0.02],[0.1,0.015,-0.07]].forEach(p=>put(g,new THREE.SphereGeometry(0.022,5,4),M(hex),p[0],p[1],p[2]));put(g,Cy(0.035,0.035,0.006,8),M(hex),0,0.09,0.088).rotation.x=Math.PI/2;return g}}
const CROPS={tohum_pamuk:{out:'pamuk',n:4,s:35,hex:'#f6f3ea',f:10},tohum_civit:{out:'civit',n:4,s:35,hex:'#3d6680',f:10},tohum_kokboya:{out:'kokboya',n:4,s:35,hex:'#b23a2a',f:10},tohum_papatya:{out:'papatya',n:4,s:35,hex:'#f2c230',f:10},tohum_keten:{out:'keten',n:4,s:45,hex:'#8fb4d9',f:14,t:2}};
const MATS={
hamderi:{ad:'Ham deri',g:'Ham madde',mk:()=>{const g=new THREE.Group();g.add(flat(hideShape(0.16),0.012,'#b98a62'));const f=flat(hideShape(0.12),0.004,'#c99a72');f.position.y=0.012;g.add(f);return g}},
pamuk:{ad:'Pamuk',g:'Ham madde',mk:()=>{const g=new THREE.Group();const st=put(g,Cy(0.008,0.01,0.22,5),M('#6b4a2b'),0,0.11,0);st.rotation.z=0.2;
[[0,0.2,0],[0.05,0.16,0.03],[-0.05,0.15,-0.02],[0.02,0.12,-0.05],[-0.03,0.23,0.04]].forEach(p=>put(g,new THREE.IcosahedronGeometry(0.045,0),M('#f6f3ea'),p[0],p[1],p[2]));return g}},
kutuk:{ad:'Kütük',g:'Ham madde',mk:()=>{const g=new THREE.Group();const l=put(g,Cy(0.08,0.085,0.34,8),M('#6b4528'),0,0.085,0);l.rotation.z=Math.PI/2;
[-0.171,0.171].forEach(x=>{const c=put(g,Cy(0.07,0.07,0.004,8),M('#d9b07a'),x,0.085,0);c.rotation.z=Math.PI/2});return g}},
kokboya:{ad:'Kök boya',g:'Ham madde',mk:()=>{const g=new THREE.Group();for(let i=0;i<4;i++){const r=put(g,new THREE.ConeGeometry(0.02,0.18,5),M('#b23a2a'),(i-1.5)*0.035,0.09,0);r.rotation.z=Math.PI+(i-1.5)*0.15}
for(let i=0;i<3;i++)put(g,new THREE.ConeGeometry(0.035,0.12,5),M('#4f7a3a'),(i-1)*0.04,0.24,0);return g}},
civit:{ad:'Çivit yaprağı',g:'Ham madde',mk:()=>{const g=new THREE.Group();put(g,Cy(0.008,0.008,0.16,5),M('#3f5a2c'),0,0.08,0);
[[0,0.17,0],[0.06,0.12,0.02],[-0.06,0.11,-0.02],[0.03,0.06,-0.05]].forEach(p=>{const l=put(g,new THREE.SphereGeometry(0.05,6,4),M('#3d6680'),p[0],p[1],p[2]);l.scale.set(1,0.35,0.6)});return g}},
ceviz:{ad:'Ceviz kabuğu',g:'Ham madde',mk:()=>{const g=new THREE.Group();[[0,0.05,0],[0.09,0.045,0.03],[-0.07,0.045,0.05],[0.02,0.12,0.02]].forEach(p=>put(g,new THREE.DodecahedronGeometry(0.05),M('#6b4a2b'),p[0],p[1],p[2]));return g}},
kaucuk:{ad:'Kauçuk',g:'Ham madde',mk:()=>{const g=new THREE.Group();put(g,B(0.22,0.08,0.14),M('#2f2a26',0.6),0,0.04,0);put(g,B(0.2,0.01,0.12),M('#3d3732',0.6),0,0.085,0);return g}},
pirinc:{ad:'Pirinç külçe',g:'Ham madde',mk:()=>{const g=new THREE.Group();put(g,B(0.22,0.05,0.11),M('#c9a23a',0.35),0,0.025,0);put(g,B(0.17,0.03,0.07),M('#d9b44a',0.35),0,0.065,0);return g}},
kurum:{ad:'Kurum',g:'Ham madde',mk:()=>{const g=new THREE.Group();const s=put(g,new THREE.SphereGeometry(0.1,8,6),M('#cdbb94'),0,0.09,0);s.scale.set(1,0.9,1);put(g,Cy(0.03,0.05,0.05,6),M('#cdbb94'),0,0.19,0);put(g,Cy(0.07,0.07,0.01,8),M('#262220'),0,0.17,0);return g}},cehri:{ad:'Cehri',g:'Ham madde',mk:()=>{const g=new THREE.Group();const t=put(g,Cy(0.006,0.008,0.22,4),M('#6b4a2e'),0,0.04,0);t.rotation.z=Math.PI/2;for(let i=0;i<9;i++)put(g,new THREE.SphereGeometry(0.022,7,5),M(i%3?'#c9a51a':'#7a8a2a',0.5),-0.08+(i%5)*0.04,0.06+Math.floor(i/5)*0.03,(i%2)*0.025-0.012);for(let i=0;i<3;i++){const l=put(g,new THREE.SphereGeometry(0.04,6,4),M('#4f7a3a'),-0.07+i*0.07,0.05,0.04);l.scale.set(1,0.25,0.55)}return g}},balik:{ad:'Balık',g:'Ham madde',mk:()=>{const g=new THREE.Group();const b=put(g,new THREE.SphereGeometry(0.06,10,7),M('#8a9aa8',0.35),0,0.05,0);b.scale.set(0.55,0.45,1.5);const t=put(g,new THREE.ConeGeometry(0.04,0.06,4),M('#6f7f8c',0.4),0,0.05,-0.11);t.rotation.x=-Math.PI/2;t.scale.z=0.3;put(g,new THREE.SphereGeometry(0.008,6,5),M('#111'),0.022,0.06,0.06);return g}},hceviz:{ad:'Hindistan cevizi',g:'Ham madde',mk:()=>{const g=new THREE.Group();[[0,0],[0.09,0.04]].forEach(q=>{const c=put(g,new THREE.DodecahedronGeometry(0.055,1),M('#6b4a2b',0.95),q[0],0.05,q[1]);c.scale.set(1,0.9,1.1);[[0.015,0.02],[-0.015,0.02],[0,-0.01]].forEach(e=>put(g,new THREE.SphereGeometry(0.008,5,4),M('#2a1a10'),q[0]+e[0],0.1,q[1]+e[1]))});return g}},palmyag:{ad:'Palm yağı',g:'Ham madde',mk:()=>{const g=new THREE.Group();put(g,Cy(0.05,0.055,0.12,12),M('#c98a3a',0.25),0,0.06,0);put(g,Cy(0.052,0.052,0.02,12),M('#e8a840',0.2),0,0.12,0);put(g,Cy(0.03,0.04,0.03,10),M('#8a5a30'),0,0.14,0);return g}},hsut:{ad:'Hindistan cevizi sütü',g:'Ham madde',mk:()=>{const g=new THREE.Group();const s=put(g,new THREE.SphereGeometry(0.065,10,6,0,Math.PI*2,Math.PI/2,Math.PI/2),M('#6b4a2b',0.9),0,0.07,0);s.material.side=THREE.DoubleSide;put(g,Cy(0.058,0.058,0.006,14),M('#f4f0e6',0.3),0,0.065,0);return g}},hkabuk:{ad:'Hindistan cevizi kabuğu',g:'Ham madde',mk:()=>{const g=new THREE.Group();for(let i=0;i<2;i++){const s=put(g,new THREE.SphereGeometry(0.055,10,6,0,Math.PI*2,Math.PI/2,Math.PI/2),M('#5a3b22',0.9),i*0.09-0.045,0.055,i*0.03);s.material.side=THREE.DoubleSide;s.rotation.z=i?0.3:-0.2}for(let i=0;i<6;i++){const f=put(g,Cy(0.003,0.003,0.12,3),M('#a07a4a'),0,0.01,0.06+i*0.006);f.rotation.z=Math.PI/2;f.rotation.y=i*0.3}return g}},palamut:{ad:'Meşe palamudu',g:'Ham madde',mk:()=>{const g=new THREE.Group();[[0,0],[0.07,0.03],[-0.06,0.035]].forEach(q=>{const n=put(g,new THREE.SphereGeometry(0.03,8,6),M('#a0703a',0.5),q[0],0.045,q[1]);n.scale.set(1,1.35,1);const c=put(g,new THREE.SphereGeometry(0.033,8,5,0,Math.PI*2,0,Math.PI/2),M('#6a5236',0.9),q[0],0.06,q[1]);c.rotation.x=Math.PI;put(g,Cy(0.004,0.004,0.025,4),M('#5a3b22'),q[0],0.1,q[1])});return g}},
yun:{ad:'Yün',g:'Ham madde',mk:()=>{const g=new THREE.Group();[[0,0.08,0,0.09],[0.09,0.07,0.03,0.07],[-0.08,0.07,-0.02,0.075],[0.01,0.15,0.01,0.07]].forEach(p=>put(g,new THREE.IcosahedronGeometry(p[3],1),M('#f4efe4',1),p[0],p[1],p[2]));return g}},
recine:{ad:'Reçine',g:'Ham madde',mk:()=>{const g=new THREE.Group();[[0,0.07,0,0.07],[0.1,0.045,0.03,0.045],[-0.08,0.04,0.04,0.04]].forEach(p=>{const d=put(g,new THREE.SphereGeometry(p[3],8,6),M('#d9952a',0.2),p[0],p[1],p[2]);d.scale.y=1.25});return g}},
papatya:{ad:'Sarı çiçek',g:'Ham madde',mk:()=>{const g=new THREE.Group();put(g,Cy(0.012,0.012,0.2,4),M('#4f7a3a'),0,0.1,0);const f=put(g,Cy(0.09,0.09,0.02,8),M('#f2c230'),0,0.21,0);f.rotation.x=0.5;put(g,new THREE.SphereGeometry(0.035,6,5),M('#8a4a1a'),0,0.225,0.015);const l=put(g,new THREE.SphereGeometry(0.05,6,4),M('#4f7a3a'),0.05,0.08,0);l.scale.set(1,0.3,0.5);return g}},
bogurtlen:{ad:'Böğürtlen',g:'Ham madde',mk:()=>{const g=new THREE.Group();[[0,0.05,0],[0.06,0.05,0.02],[-0.05,0.05,0.03],[0.02,0.1,0.02],[-0.02,0.05,-0.05]].forEach(p=>put(g,new THREE.DodecahedronGeometry(0.04),M('#5e3a6e',0.4),p[0],p[1],p[2]));const l=put(g,new THREE.SphereGeometry(0.06,6,4),M('#4f7a3a'),0.07,0.12,-0.02);l.scale.set(1,0.3,0.6);return g}},
keten:{ad:'Keten',g:'Ham madde',mk:()=>{const g=new THREE.Group();for(let i=0;i<4;i++){const st=put(g,Cy(0.008,0.008,0.24,4),M('#8a9a4a'),(i-1.5)*0.035,0.12,0);st.rotation.z=(i-1.5)*-0.12;put(g,new THREE.DodecahedronGeometry(0.03),M('#8fb4d9'),(i-1.5)*0.06,0.25,0)}put(g,B(0.12,0.025,0.03),M('#a0703c'),0,0.08,0.01);return g}},
sut:{ad:'Süt',g:'Ham madde',mk:()=>mkSut()},
tuy:{ad:'Tavuk tüyü',g:'Ham madde',mk:()=>mkTuy()},
atkili:{ad:'At kılı',g:'Ham madde',mk:()=>mkKil()},
boynuz:{ad:'Geyik boynuzu',g:'Ham madde',mk:()=>mkBoynuz()},
tas:{ad:'Taş',g:'Ham madde',mk:()=>mkTas()},
kil:{ad:'Kil',g:'Ham madde',mk:()=>mkCamur()},
kum:{ad:'Kum',g:'Ham madde',mk:()=>mkKum()},
sogut:{ad:'Söğüt dalı',g:'Ham madde',mk:()=>mkSogut()},
lavanta:{ad:'Lavanta',g:'Ham madde',mk:()=>mkLav()},
camur:{ad:'Yoğrulmuş kil',g:'İşlenmiş',mk:()=>{const g=new THREE.Group();const b=put(g,Cy(0.12,0.13,0.09,10),M('#a8582f',0.7),0,0.045,0);put(g,Cy(0.08,0.12,0.05,10),M('#b8653a',0.7),0,0.11,0);return g}},
hasir:{ad:'Hasır şerit',g:'İşlenmiş',mk:()=>{const g=new THREE.Group();for(let i=0;i<3;i++){const t=put(g,new THREE.TorusGeometry(0.1-i*0.02,0.018,4,20),M(i%2?'#b09a5a':'#8a7a3a'),0,0.02+i*0.025,0);t.rotation.x=Math.PI/2}return g}},
deri:{ad:'Deri',g:'İşlenmiş',mk:()=>{const g=new THREE.Group();const r=put(g,Cy(0.055,0.055,0.3,10),M('#8a5530'),0,0.055,0);r.rotation.z=Math.PI/2;put(g,B(0.3,0.008,0.16),M('#8a5530'),0,0.004,0.1);return g}},
iplik:{ad:'İplik',g:'İşlenmiş',mk:()=>{const g=new THREE.Group();put(g,Cy(0.045,0.045,0.14,10),M('#efe3c8'),0,0.09,0);put(g,Cy(0.07,0.07,0.02,10),M('#a0703c'),0,0.01,0);put(g,Cy(0.07,0.07,0.02,10),M('#a0703c'),0,0.17,0);return g}},
kumas:{ad:'Kumaş',g:'İşlenmiş',mk:()=>{const g=new THREE.Group();['#e2d6bd','#cbb994','#e2d6bd'].forEach((c,i)=>{const b=put(g,B(0.3,0.03,0.2),M(c),0,0.015+i*0.03,0);b.rotation.y=(i-1)*0.12});return g}},
kereste:{ad:'Kereste',g:'İşlenmiş',mk:()=>{const g=new THREE.Group();put(g,B(0.38,0.04,0.1),M('#c9955a'),0,0.02,-0.03);const b=put(g,B(0.38,0.04,0.1),M('#d4a066'),0,0.06,0.04);b.rotation.y=0.15;return g}},
taban:{ad:'Taban',g:'İşlenmiş',mk:()=>{const g=new THREE.Group();g.add(flat(soleShape(0.6),0.02,'#2a221d'));return g}},
toka:{ad:'Toka',g:'İşlenmiş',mk:()=>buckle()},
boya_kahve:{ad:'Kahverengi boya',g:'İşlenmiş',mk:()=>pot(PAINTS[0].hex)},
boya_kirmizi:{ad:'Kırmızı boya',g:'İşlenmiş',mk:()=>pot(PAINTS[1].hex)},
boya_lacivert:{ad:'Lacivert boya',g:'İşlenmiş',mk:()=>pot(PAINTS[2].hex)},
boya_siyah:{ad:'Siyah boya',g:'İşlenmiş',mk:()=>pot(PAINTS[3].hex)},
boya_sari:{ad:'Sarı boya',g:'İşlenmiş',mk:()=>pot(PAINTS[4].hex)},
boya_mor:{ad:'Mor boya',g:'İşlenmiş',mk:()=>pot(PAINTS[5].hex)},
tohum_pamuk:{ad:'Pamuk tohumu',g:'Tohum',mk:seedMk('#f6f3ea')},
tohum_civit:{ad:'Çivit tohumu',g:'Tohum',mk:seedMk('#3d6680')},
tohum_kokboya:{ad:'Kök boya tohumu',g:'Tohum',mk:seedMk('#b23a2a')},
tohum_papatya:{ad:'Sarı çiçek tohumu',g:'Tohum',mk:seedMk('#f2c230')},
tohum_keten:{ad:'Keten tohumu',g:'Tohum',mk:seedMk('#8fb4d9')},
tutkal:{ad:'Tutkal',g:'Yardımcı',mk:()=>{const g=new THREE.Group();put(g,Cy(0.055,0.055,0.1,10),M('#efe6c8'),0,0.05,0);put(g,Cy(0.058,0.058,0.03,10),M('#7a4a2a'),0,0.115,0);return g}},
cam:{ad:'Cam',g:'İşlenmiş',mk:()=>{const g=new THREE.Group();put(g,new THREE.IcosahedronGeometry(0.09,1),new THREE.MeshStandardMaterial({color:'#8fc4c8',transparent:true,opacity:0.6,roughness:0.05}),0,0.08,0);return g}},
bakir:{ad:'Bakır külçe',g:'Ham madde',mk:()=>{const g=new THREE.Group();[0,1].forEach(i=>put(g,B(0.2,0.05,0.09),M('#c87a4a',0.3),0,0.025+i*0.05,i*0.02));return g}},
demir:{ad:'Demir külçe',g:'Ham madde',mk:()=>{const g=new THREE.Group();[0,1].forEach(i=>put(g,B(0.2,0.05,0.09),M('#6a6e74',0.35),0,0.025+i*0.05,i*0.02));return g}},
celik:{ad:'Çelik çubuk',g:'İşlenmiş',mk:()=>{const g=new THREE.Group();[-0.04,0,0.04].forEach(x=>put(g,B(0.03,0.03,0.26),M('#9aa0a8',0.25),x,0.015,0));return g}},
koza:{ad:'İpek kozası',g:'Ham madde',mk:()=>{const g=new THREE.Group();[[0,0],[0.07,0.03],[-0.06,0.04]].forEach(q=>{const m=put(g,new THREE.SphereGeometry(0.04,8,6),M('#f6f0dc',1),q[0],0.04,q[1]);m.scale.set(1,0.8,1.6)});return g}},
ipek:{ad:'İpek iplik',g:'İşlenmiş',mk:()=>{const g=new THREE.Group();put(g,Cy(0.06,0.06,0.1,14),M('#f4ead0',0.3),0,0.05,0);put(g,Cy(0.02,0.02,0.14,8),M('#8a5530'),0,0.07,0);return g}},
yag:{ad:'Domuz yağı',g:'Ham madde',mk:()=>{const g=new THREE.Group();put(g,Cy(0.08,0.09,0.13,14),M('#e8dcc0',0.4),0,0.065,0);put(g,Cy(0.085,0.085,0.02,14),M('#8a5a3a'),0,0.14,0);return g}},
bal:{ad:'Bal',g:'Ham madde',mk:()=>{const g=new THREE.Group();put(g,Cy(0.07,0.07,0.12,14),new THREE.MeshStandardMaterial({color:'#e8f0f2',transparent:true,opacity:0.35}),0,0.06,0);put(g,Cy(0.064,0.064,0.1,14),M('#e09a2a',0.25),0,0.05,0);put(g,Cy(0.074,0.074,0.02,14),M('#c0392b',0.8),0,0.125,0);return g}},
kece:{ad:'Keçe',g:'İşlenmiş',mk:()=>{const g=new THREE.Group();['#8a6a5a','#7a5a4a'].forEach((c,i)=>{const b=put(g,B(0.26,0.04,0.18),M(c,1),0,0.02+i*0.04,0);b.rotation.y=i*0.15});return g}},
balmumu:{ad:'Balmumu',g:'Yardımcı',mk:()=>{const g=new THREE.Group();put(g,B(0.18,0.06,0.12),M('#e8b84a',0.5),0,0.03,0);put(g,Cy(0.04,0.04,0.04,8),M('#f0c860',0.5),0.03,0.08,0);return g}}};

/* ---------- ürün modelleri ---------- */
function shoeModel(hex,style){const g=new THREE.Group(),um=M(hex,0.6),dk=M(shade(hex,-0.3),0.6);
g.add(flat(soleShape(1),0.028,'#2a221d',0.006));const mid=flat(soleShape(0.985),0.012,'#e9dfcc');mid.position.y=0.03;g.add(mid);
const up=mesh(ext(soleShape(0.9),0.08,0.04),um);up.rotation.x=-Math.PI/2;up.position.y=0.044;g.add(up);
const toe=put(g,new THREE.SphereGeometry(0.1,10,8),dk,0,0.1,-0.17);toe.scale.set(0.92,0.55,1.15);
put(g,B(0.17,0.12,0.11),um,0,0.2,0.21);const col=put(g,Cy(0.065,0.065,0.02,14),M('#1d1612'),0,0.205,0.12);col.scale.set(1,1,1.5);
const tg=put(g,B(0.09,0.02,0.15),um,0,0.215,0.0);tg.rotation.x=-0.45;
if(style==='Tokalı'){put(g,B(0.21,0.026,0.05),dk,0,0.185,-0.03);const b=buckle();b.scale.setScalar(0.45);b.rotation.z=Math.PI/2;b.position.set(0.105,0.17,-0.03);g.add(b)}
else for(let i=0;i<4;i++)put(g,B(0.12-i*0.012,0.012,0.014),M('#f4ecd8'),0,0.2-i*0.012,0.04-i*0.045);
soleShape(0.93).getSpacedPoints(26).slice(0,26).forEach(p=>put(g,B(0.012,0.006,0.012),M('#f4ecd8'),p.x*1.02,0.062,-p.y*1.02));
return {g,um}}
function cuzdanModel(hex){const g=new THREE.Group(),um=M(hex,0.6);g.add(flat(rrect(0.24,0.16,0.025),0.03,um,0.008));
put(g,B(0.24,0.006,0.01),M(shade(hex,-0.35)),0,0.045,0);
rrect(0.205,0.125,0.02).getSpacedPoints(28).slice(0,28).forEach(p=>put(g,B(0.008,0.004,0.008),M('#f4ecd8'),p.x,0.044,-p.y));
const t=put(g,B(0.06,0.01,0.05),M(shade(hex,-0.2)),0.12,0.04,0);g.rotation.y=0.3;return {g,um}}
function kemerModel(hex){const g=new THREE.Group(),um=M(hex,0.6);[0.13,0.105,0.08].forEach((r,i)=>{const t=put(g,new THREE.TorusGeometry(r,0.02,4,40),um,0,0.012+i*0.024,0);t.rotation.x=Math.PI/2;t.scale.z=0.6});
const b=buckle();b.position.set(0.14,0.02,0);b.rotation.y=Math.PI/2;g.add(b);put(g,B(0.12,0.012,0.04),um,0.2,0.012,0);return {g,um}}
function cantaModel(hex,style){const g=new THREE.Group(),um=M(hex,0.6),dk=M(shade(hex,-0.3),0.6);
const body=mesh(ext(rrect(0.36,0.26,0.05),0.12,0.02),um);body.position.set(0,0.15,-0.06);g.add(body);
put(g,B(0.37,0.12,0.02),dk,0,0.22,0.085);const b=buckle();b.scale.setScalar(0.5);b.rotation.x=Math.PI/2;b.position.set(0,0.17,0.1);g.add(b);
if(style==='Uzun askı'){const h=mesh(new THREE.TorusGeometry(0.165,0.009,5,28,Math.PI),dk);h.scale.y=1.9;h.position.set(0,0.27,0);g.add(h);[-1,1].forEach(k=>{put(g,B(0.03,0.05,0.13),dk,k*0.168,0.25,0)})}else{[-1,1].forEach(k=>{const h=mesh(new THREE.TorusGeometry(0.075,0.014,6,20,Math.PI),dk);h.position.set(0,0.275,k*0.035);g.add(h);[-1,1].forEach(j=>put(g,B(0.03,0.02,0.015),dk,j*0.075,0.28,k*0.035))})}
for(let i=0;i<10;i++)put(g,B(0.012,0.006,0.006),M('#f4ecd8'),-0.16+i*0.035,0.035,0.085);return {g,um}}
function atkiModel(hex){const g=new THREE.Group(),um=M(hex,0.9),lt=M(shade(hex,0.25),0.9);
for(let i=0;i<3;i++){const b=put(g,B(0.36,0.03,0.13),i%2?lt:um,0,0.015+i*0.03,0);b.rotation.y=(i-1)*0.18}
for(let i=0;i<6;i++){put(g,B(0.01,0.008,0.04),um,-0.2,0.08,-0.05+i*0.02);put(g,B(0.01,0.008,0.04),um,0.2,0.08,-0.05+i*0.02)}return {g,um}}
function kasikModel(hex,style,k){const g=new THREE.Group(),um=M(hex||'#c9955a',k&&k.cila?0.3:0.85);
const bw=mesh(new THREE.SphereGeometry(0.1,12,8,0,Math.PI*2,Math.PI/2,Math.PI/2),um);bw.material.side=THREE.DoubleSide;bw.scale.set(0.75,0.35,1);bw.position.set(0,0.04,-0.12);g.add(bw);
const hd=put(g,B(0.035,0.02,0.32),um,0,0.05,0.13);hd.rotation.x=-0.12;return {g,um}}
function tabureModel(hex,style,k){const g=new THREE.Group(),um=M(hex||'#c9955a',k&&k.cila?0.3:0.85);
put(g,Cy(0.2,0.2,0.05,14),um,0,0.4,0);for(let i=0;i<3;i++){const a=i/3*Math.PI*2,l=put(g,Cy(0.02,0.025,0.4,6),um,Math.cos(a)*0.14,0.19,Math.sin(a)*0.14);l.rotation.z=-Math.cos(a)*0.12;l.rotation.x=Math.sin(a)*0.12}
const rg=put(g,new THREE.TorusGeometry(0.15,0.01,4,20),um,0,0.15,0);rg.rotation.x=Math.PI/2;return {g,um}}

const PRODS=[
{id:'cuzdan',ad:'Cüzdan',tier:1,base:70,need:{deri:1,iplik:1,boya:1},sheet:'#9c6b4e',shape:()=>rrect(0.36,0.5,0.05),build:cuzdanModel,
 steps:[{t:'trace'},{t:'rhythm',k:'dik',n:10},{t:'hold',ad:'Katlama'},{t:'design'}]},
{id:'kemer',ad:'Kemer',tier:1,base:65,need:{deri:1,toka:1,boya:1},sheet:'#9c6b4e',shape:()=>rrect(0.1,0.8,0.04),build:kemerModel,
 steps:[{t:'trace'},{t:'rhythm',k:'delik',line:true,n:5},{t:'drag',what:'toka'},{t:'design'}]},
{id:'ayakkabi',ad:'Ayakkabı',tier:1,base:125,need:{deri:1,taban:1,iplik:1,tutkal:1,boya:1},sheet:'#9c6b4e',shape:()=>soleShape(1.12),styles:['Bağcıklı','Tokalı'],build:(h,st,k)=>SHOEB(h,st,k),
 steps:[{t:'trace'},{t:'rhythm',k:'dik',n:10},{t:'rhythm',k:'yapistir',n:6,sc:0.7},{t:'drag',what:'taban'},{t:'hold'},{t:'design'}]},
{id:'canta',ad:'Çanta',tier:2,base:170,need:{deri:2,iplik:1,toka:1,boya:1},sheet:'#9c6b4e',shape:()=>rrect(0.46,0.62,0.06),styles:['Kısa sap','Uzun askı'],build:(h,st,k)=>st==='Uzun askı'?cantaModel(h,st,k):CANB(h,st,k),
 steps:[{t:'trace'},{t:'rhythm',k:'dik',n:12},{t:'drag',what:'toka'},{t:'hold'},{t:'design'}]},
{id:'atki',ad:'Atkı',tier:2,base:85,need:{kumas:1,boya:1},sheet:'#e2d6bd',shape:()=>rrect(0.26,0.8,0.02),build:atkiModel,
 steps:[{t:'trace'},{t:'rhythm',k:'dik',n:10},{t:'design'}]},
{id:'kasik',hard:true,ad:'Ahşap kaşık',tier:3,base:60,need:{kereste:1,balmumu:1},sheet:'#c9955a',wood:true,shape:spoonShape,build:(h,st,k)=>KASB(h,st,k),
 steps:[{t:'trace',ad:'Oyma'},{t:'rub',k:'zimpara'},{t:'rub',k:'cila'},{t:'design'}]},
{id:'tabure',hard:true,ad:'Tabure',tier:3,base:130,need:{kereste:2,tutkal:1,balmumu:1},sheet:'#c9955a',wood:true,shape:()=>circleShape(0.27),build:(h,st,k)=>TABB(h,st,k),
 steps:[{t:'trace'},{t:'rhythm',k:'yapistir',n:3,sc:0.5},{t:'screw',ad:'Ayakları vidala',pts:[[-0.09,-0.09],[0.09,-0.09],[-0.09,0.09],[0.09,0.09]]},{t:'rub',k:'zimpara'},{t:'rub',k:'cila'},{t:'design'}]}];
const GLC={},GLW={};
function glbProd(n,size,fb,re,rx){return (hex,style,k)=>{const src=GLC[n];if(!src)return fb(hex,style,k);const g=new THREE.Group(),um=M(hex,0.6),m=src.scene.clone();if(rx)m.rotation.x=rx;
m.traverse(o=>{if(o.isMesh){const a=(Array.isArray(o.material)?o.material:[o.material]).map(mt=>(re?re.test(mt.name):/brown/i.test(mt.name)&&!/dark/i.test(mt.name))?um:mt);o.material=a.length>1?a:a[0]}});
m.updateMatrixWorld(true);let bb=new THREE.Box3().setFromObject(m),sz=bb.getSize(V(0,0,0));m.scale.multiplyScalar(size/Math.max(sz.x,sz.z));m.updateMatrixWorld(true);bb=new THREE.Box3().setFromObject(m);
m.position.set(-(bb.min.x+bb.max.x)/2,-bb.min.y,-(bb.min.z+bb.max.z)/2);g.add(m);return {g,um}}}
var KASB=glbProd('spoon',0.34,kasikModel,/./,-Math.PI/2),TABB=glbProd('stool',0.3,tabureModel,/./),CANB=glbProd('briefcase',0.44,cantaModel,/lambert3SG/);['spoon','stool','briefcase','basket','soap','button'].forEach(n=>glb(n,()=>{}));
['sneaker','cap','boxing','basketball','sunglasses'].forEach(n=>glb(n,()=>{}));
var SHOEB=glbProd('pair_of_shoes',0.48,shoeModel,/lambert4SG/);glb('pair_of_shoes',()=>{});
PRODS.push({id:'sirt',ad:'Sırt çantası',tier:2,base:190,need:{deri:2,iplik:1,toka:1,boya:1},sheet:'#9c6b4e',shape:()=>rrect(0.5,0.6,0.07),build:glbProd('backpack',0.42,cantaModel),
 steps:[{t:'trace'},{t:'rub',k:'incelt'},{t:'rhythm',k:'dik',n:12},{t:'drag',what:'toka'},{t:'hold'},{t:'rub',k:'parlat'},{t:'design'}]});
const STEPTXT={trace:['Kesim','Kesik çizgiyi parmağınla takip et'],dik:['Dikiş','Halka noktaya oturduğunda dokun'],yapistir:['Yapıştırma','Halka noktaya oturduğunda dokun'],
delik:['Delik açma','Halka noktaya oturduğunda dokun'],taban:['Taban','Tabanı kesik çizgili alana sürükle'],toka:['Toka','Tokayı işaretli yere sürükle'],
hold:['Pres','Basılı tut, yeşil bölgede bırak'],zimpara:['Zımpara','Yüzeyi parmağınla ovala'],cila:['Cila','Balmumunu parmağınla sür'],design:['Tasarım','Rengi ve stili seç']};
Object.assign(STEPTXT,{incelt:['Kenar inceltme','Kenarları parmağınla ovala'],parlat:['Parlatma','Yüzeyi parmağınla parlat']});
{const T={t:'trace'},IN={t:'rub',k:'incelt'},PA={t:'rub',k:'parlat'},D={t:'design'},dik=n=>({t:'rhythm',k:'dik',n});
const S2={cuzdan:[T,IN,dik(10),{t:'hold',ad:'Katlama'},PA,D],kemer:[T,IN,{t:'rhythm',k:'delik',line:true,n:5},{t:'drag',what:'toka'},PA,D],
ayakkabi:[T,IN,dik(10),{t:'rhythm',k:'yapistir',n:6,sc:0.7},{t:'drag',what:'taban'},{t:'hold'},PA,D],canta:[T,IN,dik(12),{t:'drag',what:'toka'},{t:'hold'},PA,D],
atki:[T,dik(10),{t:'hold',ad:'Ütü'},D],tabure:[T,{t:'rhythm',k:'yapistir',n:3,sc:0.5},{t:'hold',ad:'Sıkıştırma'},{t:'rub',k:'zimpara'},{t:'rub',k:'cila'},D]};
const AF={canta:['ayakkabi',2],tabure:['kasik',1],sirt:['canta',1]};PRODS.forEach(p=>{if(S2[p.id])p.steps=S2[p.id];p.after=AF[p.id]})}
Object.assign(STEPTXT,{strips:['Kesme','Kesik çizgiler boyunca kes'],weave:['Örme','Sepetin etrafında daire çizerek ör'],spin:['Çark','Çömleğin etrafında daire çiz, hızı yeşilde tut'],stir:['Karıştırma','Kasenin içinde daire çiz'],pour:['Dökme','Basılı tut, çizgiye gelince bırak'],stuff:['Doldurma','Saniyede bir dokun'],blow:['Üfleme','Saniyede bir üfle'],grind:['Zımpara','Boncuğu dönen zımparaya bastır'],split:['Bölme','Çizgiler boyunca kes'],zig:['Zigzag kesim','Demir makasıyla çizgiyi izle'],weld:['Kaynak','Kaynak ucunu birleşimde gezdir'],gems:['Taş yerleştirme','Taşları yuvalara bırak'],roll:['Kıvırma','Daire çizerek kıvır'],screw:['Vidalama','Tornavidayla daire çiz'],bend:['Bükme','Çubuğun etrafında daire çiz'],layer:['Katman','Cam katmanını ortaya sürükle'],torch:['Pürmüz','Alevi ürünün üzerinde gezdir'],path:['Lehim','Havyanın ucunu çizgide gezdir'],hammer:['Çekiç','İşaretli noktaya dokunarak vur'],fold:['Katlama','Üst yarıyı tutup aşağı katla'],lace:['Bağcık','Bağcığı sıradaki deliğe sürükle'],shuttle:['Dokuma','Mekiği bir uçtan diğerine kaydır'],chisel:['Oyma','Kalemle çukura vur'],plane:['Rende','Rendeyi baştan sona it'],drill:['Matkap','Basılı tut, yeşilde bırak']});
Object.assign(STEPTXT,{nozzle:['Bağlantı','Kompresör ucunu topun sibobuna sürükle'],pump:['Şişirme','Saniyede bir bas: bas, çek!']});
Object.assign(STEPTXT,{oy:['Oyma','Çukuru parmağınla oy'],asm:['Montaj','Parçayı işaretli yere sürükle']});
{const T=(ad,o)=>Object.assign({t:'trace',ad},o||{}),Rb=(k,ad)=>({t:'rub',k,ad}),D={t:'design'},Y=(k,ad,o)=>Object.assign({t:'rhythm',k,ad},o||{}),A=(part,ad,slots,pose)=>({t:'asm',part,ad,slots,pose}),Hd=ad=>({t:'hold',ad}),rr=(w,h)=>()=>rrect(w,h,Math.min(w,h)*0.25);
const H4=[[0.17,0],[-0.17,0],[0,0.17],[0,-0.17]],LACE=[[-0.05,-0.15],[0.05,-0.15],[-0.05,-0.09],[0.05,-0.09],[-0.05,-0.03],[0.05,-0.03]],FR=[-0.09,-0.03,0.03,0.09];
const ST3={
tabure:[T('Oturak kesimi'),{t:'strips',saw:true,part:'bacak',ad:'Bacakları testereyle kes',n:4,W:0.3,L:0.4},Rb('zimpara','Oturağı zımparala'),Y('delik','Delik açma',{pts:H4}),Y('yapistir','Deliklere tutkal',{pts:H4}),A('bacak','Bacakları tak',H4,'leg'),{t:'screw',ad:'Bacakları vidala',pts:H4,turns:1.5},Rb('cila','Cila'),D],
kasik:[T('Kaşık kesimi'),{t:'chisel',ad:'Çukuru oy'},Rb('zimpara','Zımpara'),Rb('cila','Cila'),D],
cuzdan:[T('Dış deri kesimi'),T('İç cep kesimi',{part:'cep',n:1,shape:rr(0.3,0.18),at:[-0.45,0]}),Rb('incelt','Kenar inceltme'),A('cep','Cebi yerleştir',[[0,0.1]],'flat'),Y('dik','Dikiş',{n:12}),{t:'fold',ad:'Katla'},Rb('parlat','Parlatma'),D],
kemer:[T('Kayış kesimi'),T('Toka bandı kesimi',{part:'band',n:1,shape:rr(0.07,0.14),at:[-0.4,0]}),Rb('incelt','Kenar inceltme'),{t:'hammer',ad:'Zımbayla delik aç',kind:'hole',hits:2,pts:[0,1,2,3,4].map(i=>[0,-0.32+i*0.05])},A('band','Bandı yerleştir',[[0,0.22]],'flat'),{t:'drag',what:'toka'},Y('dik','Band dikişi',{pts:[[-0.03,0.17],[0.03,0.19],[-0.03,0.25],[0.03,0.27]]}),Rb('parlat','Parlatma'),D],
ayakkabi:[T('Yüz kesimi'),T('Dil kesimi',{part:'dil',n:1,shape:rr(0.1,0.2),at:[-0.45,0]}),Rb('incelt','Kenar inceltme'),A('dil','Dili yerleştir',[[0,-0.05]],'flat'),Y('dik','Yüz dikişi',{n:10}),Y('yapistir','Tabana tutkal',{n:6,sc:0.7}),{t:'drag',what:'taban'},Hd('Pres'),{t:'lace',ad:'Bağcık geçirme',pts:LACE},Rb('parlat','Parlatma'),D],
canta:[T('Gövde kesimi'),T('Sap kesimi',{part:'sap',n:2,shape:rr(0.06,0.4),at:[-0.5,0]}),Rb('incelt','Kenar inceltme'),Y('dik','Kenar dikişi',{n:12}),A('sap','Sapları yerleştir',[[-0.12,-0.05],[0.12,-0.05]],'flat'),Y('dik','Sap dikişi',{pts:[[-0.12,-0.23],[-0.12,0.13],[0.12,0.13],[0.12,-0.23]]}),{t:'drag',what:'toka'},{t:'hammer',ad:'Perçin çak',kind:'rivet',hits:2,pts:[[-0.12,-0.22],[-0.12,0.12],[0.12,0.12],[0.12,-0.22]]},Rb('parlat','Parlatma'),D],
sirt:[T('Gövde kesimi'),T('Askı kesimi',{part:'aski',n:2,shape:rr(0.07,0.45),at:[-0.5,0]}),T('Kapak kesimi',{part:'kapak',n:1,shape:rr(0.38,0.18),at:[-0.47,0]}),Rb('incelt','Kenar inceltme'),Y('dik','Kenar dikişi',{n:12}),A('aski','Askıları tak',[[-0.11,0.02],[0.11,0.02]],'flat'),A('kapak','Kapağı tak',[[0,-0.2]],'flat'),{t:'drag',what:'toka'},{t:'hammer',ad:'Perçin çak',kind:'rivet',hits:2,pts:[[-0.11,-0.19],[-0.11,0.23],[0.11,0.23],[0.11,-0.19]]},Rb('parlat','Parlatma'),D],
atki:[{t:'shuttle',ad:'Tezgâhta doku',n:10},Y('dik','Kenar dikişi',{n:10}),Y('delik','Saçak açma',{pts:FR.map(x=>[x,-0.38]).concat(FR.map(x=>[x,0.38]))}),Hd('Ütü'),D]};
PRODS.forEach(p=>{if(ST3[p.id])p.steps=ST3[p.id]})}
{const lathe=(pts,um)=>{const m=mesh(new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p[0],p[1])),18),um);m.material.side=THREE.DoubleSide;return m},mt=(h,d,k)=>M(h||d,k&&k.cila?0.32:0.9);
function comlekModel(hex,s,k){const g=new THREE.Group(),um=mt(hex,'#b8653a',k);g.add(lathe([[0,0],[0.1,0],[0.15,0.06],[0.165,0.14],[0.13,0.22],[0.09,0.25],[0.115,0.285],[0.105,0.295]],um));[0.1,0.16].forEach(y=>{const t=put(g,new THREE.TorusGeometry(0.163,0.006,4,28),M(shade(hex||'#b8653a',-0.3)),0,y,0);t.rotation.x=Math.PI/2});return {g,um}}
function vazoModel(hex,s,k){const g=new THREE.Group(),um=mt(hex,'#b8653a',k);g.add(lathe([[0,0],[0.08,0],[0.125,0.08],[0.125,0.18],[0.075,0.29],[0.045,0.38],[0.05,0.44],[0.075,0.47],[0.07,0.48]],um));const t=put(g,new THREE.TorusGeometry(0.11,0.007,4,28),M(shade(hex||'#b8653a',-0.3)),0,0.21,0);t.rotation.x=Math.PI/2;return {g,um}}
function sepetModel(hex){const g=new THREE.Group(),h=hex||'#a08a4a',um=M(h,0.95),dk=M(shade(h,-0.25),0.95);const b=put(g,new THREE.CylinderGeometry(0.19,0.14,0.17,18,1,true),um,0,0.085,0);b.material.side=THREE.DoubleSide;put(g,Cy(0.14,0.14,0.01,18),dk,0,0.005,0);
 for(let i=0;i<4;i++){const r=0.145+i*0.0135,t=put(g,new THREE.TorusGeometry(r,0.008,4,30),i%2?um:dk,0,0.025+i*0.042,0);t.rotation.x=Math.PI/2}const hd=put(g,new THREE.TorusGeometry(0.17,0.012,5,24,Math.PI),dk,0,0.17,0);return {g,um}}
function mumModel(hex){const g=new THREE.Group(),um=M(hex||'#efe0b0',0.55),fl=new THREE.MeshBasicMaterial({color:'#ffc35a'});[[0,0.24,0],[0.09,0.17,0.04],[-0.08,0.13,0.05]].forEach(q=>{put(g,Cy(0.035,0.037,q[1],12),um,q[0],q[1]/2,q[2]);put(g,Cy(0.004,0.004,0.025,4),M('#222'),q[0],q[1]+0.012,q[2]);const f=put(g,new THREE.SphereGeometry(0.012,6,5),fl,q[0],q[1]+0.035,q[2]);f.scale.y=1.8;f.castShadow=false});return {g,um}}
function sabunModel(hex){const g=new THREE.Group(),um=M(hex||'#d9c8e8',0.45);[[0,0.025,0,0.2],[0.03,0.075,-0.01,-0.15]].forEach(q=>{const b=put(g,B(0.17,0.05,0.11),um,q[0],q[1],q[2]);b.rotation.y=q[3]});const l=mkLav();l.rotation.z=Math.PI/2;l.scale.setScalar(0.5);l.position.set(0.0,0.105,0);g.add(l);return {g,um}}
function tahtaModel(hex,s,k){const g=new THREE.Group(),um=mt(hex,'#c9955a',k);const t=flat(rrect(0.2,0.34,0.05),0.025,um,0.006);g.add(t);put(g,Cy(0.015,0.015,0.03,10),M('#2a1c10'),0,0.015,-0.14);return {g,um}}
function fircaModel(hex,s,k){const g=new THREE.Group(),um=mt(hex,'#c9955a',k);put(g,B(0.06,0.03,0.24),um,0,0.03,0.07);put(g,B(0.075,0.04,0.1),um,0,0.035,-0.1);for(let i=0;i<4;i++)for(let j=0;j<3;j++)put(g,B(0.012,0.06,0.012),M('#3b2a1e'),-0.022+i*0.015,0.08,-0.13+j*0.03);return {g,um}}
function dugmeModel(hex){const g=new THREE.Group(),um=M(hex||'#dccbaa',0.4);[[-0.055,-0.055],[0.055,-0.055],[-0.055,0.055],[0.055,0.055]].forEach(q=>{put(g,Cy(0.045,0.045,0.016,16),um,q[0],0.008,q[1]);[-0.012,0.012].forEach(d=>put(g,Cy(0.006,0.006,0.018,6),M('#2a1c10'),q[0]+d,0.009,q[1]))});return {g,um}}
function yastikModel(hex){const g=new THREE.Group(),um=M(hex||'#e2d6bd',0.95);const p=put(g,new THREE.SphereGeometry(0.2,16,10),um,0,0.07,0);p.scale.set(1,0.35,1);const t=put(g,new THREE.TorusGeometry(0.195,0.008,4,30),M(shade(hex||'#e2d6bd',-0.2)),0,0.07,0);t.rotation.x=Math.PI/2;return {g,um}}
const T=(ad,o)=>Object.assign({t:'trace',ad},o||{}),Rb=(k,ad)=>({t:'rub',k,ad}),D={t:'design'},Y=(k,ad,o)=>Object.assign({t:'rhythm',k,ad},o||{}),A=(part,ad,slots)=>({t:'asm',part,ad,slots,pose:'flat'}),Hd=ad=>({t:'hold',ad}),rr=(w,h)=>()=>rrect(w,h,Math.min(w,h)*0.25),ci=r=>()=>circleShape(r);
const NP=[
{id:'sepet',ad:'Söğüt sepet',tier:1,base:75,need:{hasir:2},sheet:'#a08a4a',wood:true,shape:ci(0.27),build:sepetModel,
 steps:[T('Taban örgüsü'),{t:'strips',ad:'Söğüdü şeritlere kes',n:6},{t:'asm',part:'serit',ad:'Çubukları tabana diz',slots:[0,1,2,3,4,5].map(i=>[0,0,i*Math.PI/6]),pose:'flat',stack:0.004},{t:'weave',ad:'Dalları ör',n:3},Y('dik','Ağzı bağla',{n:10}),D]},
{id:'sabun',cut:'kn',ad:'Lavanta sabunu',tier:1,base:55,need:{sut:1,lavanta:2},sheet:'#d9c8e8',wood:true,shape:rr(0.32,0.22),build:sabunModel,
 steps:[T('Kalıp kesimi'),{t:'stir',ad:'Süt ve lavantayı karıştır'},{t:'pour',ad:'Kalıba dök'},Y('delik','Damga bas',{pts:[[0,0]]}),Rb('parlat','Kenarları düzelt'),D]},
{id:'comlek',cut:'kn',ad:'Çömlek',tier:1,base:85,need:{camur:1},sheet:'#b8653a',wood:true,shape:ci(0.25),build:comlekModel,
 steps:[T('Kil tabanı kes'),{t:'spin',ad:'Çarkta şekillendir'},Y('delik','Desen kazı',{n:8}),{t:'rub',k:'torch',ad:'Pürmüzle fırınla'},Rb('cila','Sır sür'),D]},
{id:'vazo',cut:'kn',ad:'Vazo',tier:2,base:150,need:{camur:2,kum:1},sheet:'#b8653a',wood:true,shape:ci(0.2),build:vazoModel,after:['comlek',2],
 steps:[T('Gövde tabanı'),{t:'spin',ad:'Çarkta gövdeyi çek'},Y('delik','Desen kazı',{n:6}),{t:'rub',k:'torch',ad:'Pürmüzle fırınla'},Rb('cila','Sır sür'),D]},
{id:'mum',cut:'kn',ad:'Bal mumu',tier:2,base:60,need:{balmumu:2,iplik:1},sheet:'#efe0b0',wood:true,shape:ci(0.16),build:mumModel,
 steps:[T('Kalıp tabanı'),T('Fitil kes',{part:'fitil',n:3,shape:rr(0.03,0.26),at:[-0.45,0]}),A('fitil','Fitilleri yerleştir',[[0,0],[-0.08,0],[0.08,0]]),{t:'pour',ad:'Mumu dök'},Rb('parlat','Yüzeyi düzelt'),D]},
{id:'dugme',hard:true,ad:'Boynuz düğme',tier:2,base:75,need:{boynuz:1},sheet:'#dccbaa',wood:true,shape:ci(0.11),build:dugmeModel,
 steps:[T('İlk düğme'),T('Diğer düğmeler',{part:'dg',n:3,shape:ci(0.1),at:[-0.45,0]}),{t:'drill',ad:'İplik deliklerini del',pts:[[-0.03,0],[0.03,0]]},Rb('zimpara','Zımpara'),Rb('parlat','Parlatma'),D]},
{id:'yastik',ad:'Kuş tüyü yastık',tier:2,base:95,need:{kumas:1,tuy:3,iplik:1},sheet:'#e2d6bd',wood:true,shape:rr(0.42,0.42),build:yastikModel,after:['atki',1],
 steps:[T('Ön yüz kesimi'),T('Arka yüz kesimi',{part:'arka',n:1,shape:rr(0.3,0.3),at:[-0.5,0]}),A('arka','Yüzleri üst üste koy',[[0,0]]),Y('dik','Kenar dikişi',{n:10}),{t:'stuff',ad:'Tüyle doldur',n:8},Y('dik','Ağzını kapat',{pts:[[-0.1,-0.19],[0,-0.19],[0.1,-0.19]]}),D]},
{id:'tahta',hard:true,ad:'Kesme tahtası',tier:3,base:50,need:{kereste:1},sheet:'#c9955a',wood:true,shape:rr(0.3,0.52),build:tahtaModel,
 steps:[T('Tahta kesimi'),{t:'drill',ad:'Asma deliğini del',pts:[[0,0.21]]},{t:'plane',ad:'Rendele',n:6},Rb('cila','Yağla'),D]},
{id:'firca',hard:true,ad:'At kılı fırça',tier:3,base:75,need:{atkili:1,kereste:1,tutkal:1},sheet:'#c9955a',wood:true,shape:rr(0.1,0.45),build:fircaModel,
 steps:[T('Sap kesimi'),T('Kıl demeti',{part:'kil',n:1,shape:rr(0.09,0.1),at:[-0.45,0]}),{t:'drill',ad:'Kıl deliklerini del',pts:[[-0.025,0.15],[0.025,0.15],[-0.025,0.19],[0.025,0.19]]},Y('yapistir','Deliklere tutkal',{pts:[[-0.025,0.15],[0.025,0.15],[-0.025,0.19],[0.025,0.19]]}),A('kil','Kılları yerleştir',[[0,0.17]]),Rb('zimpara','Sapı zımparala'),D]}];
NP.forEach(p=>PRODS.push(p));NP.find(p=>p.id==='sepet').build=glbProd('basket',0.34,sepetModel,/./);NP.find(p=>p.id==='sabun').build=glbProd('soap',0.26,sabunModel,/^Mat$/);{const bt=glbProd('button',0.09,dugmeModel,/Material/);NP.find(p=>p.id==='dugme').build=(h,st,k)=>{const r=bt(h,st,k);if(!GLC.button)return r;const g=new THREE.Group();[[-0.055,-0.055],[0.055,-0.055],[-0.055,0.055],[0.055,0.055]].forEach(q=>{const c=r.g.clone();c.position.set(q[0],0,q[1]);c.rotation.y=q[0]*9;g.add(c)});return {g,um:r.um}}}Object.assign(STEPTXT,{sekil:['Şekillendirme','Kili parmağınla şekillendir'],karistir:['Karıştırma','Karışımı parmağınla karıştır']})}

var BBALL;{const T=(ad,o)=>Object.assign({t:'trace',ad},o||{}),Rb=(k,ad)=>({t:'rub',k,ad}),D={t:'design'},Y=(k,ad,o)=>Object.assign({t:'rhythm',k,ad},o||{}),A=(part,ad,slots)=>({t:'asm',part,ad,slots,pose:'flat'}),Hd=(ad,tool)=>({t:'hold',ad,tool}),rr=(w,h)=>()=>rrect(w,h,Math.min(w,h)*0.25),ci=r=>()=>circleShape(r);
 const ballFb=(hex)=>{const g=new THREE.Group(),um=M(hex||'#c8642a',0.7);put(g,new THREE.SphereGeometry(0.15,20,14),um,0,0.15,0);[0,Math.PI/2].forEach(a=>{const t=put(g,new THREE.TorusGeometry(0.151,0.004,4,32),M('#222'),0,0.15,0);t.rotation.y=a});const t2=put(g,new THREE.TorusGeometry(0.151,0.004,4,32),M('#222'),0,0.15,0);t2.rotation.x=Math.PI/2;return {g,um}};
 const glassFb=(hex)=>{const g=new THREE.Group(),um=M(hex||'#3a2a20',0.4);[-0.085,0.085].forEach(x=>{const r=put(g,new THREE.TorusGeometry(0.06,0.012,6,20),um,x,0.07,0);put(g,Cy(0.055,0.055,0.004,16),M('#333',0.2),x,0.07,0).rotation.x=Math.PI/2});put(g,B(0.05,0.012,0.012),um,0,0.08,0);[-1,1].forEach(k=>put(g,B(0.012,0.012,0.22),um,k*0.15,0.08,-0.11));return {g,um}};
 const capFb=(hex)=>{const g=new THREE.Group(),um=M(hex||'#3f6fa8',0.9);const d=put(g,new THREE.SphereGeometry(0.13,16,10,0,Math.PI*2,0,Math.PI/2),um,0,0,0);d.scale.y=0.8;put(g,Cy(0.1,0.1,0.01,16,1,false,0,Math.PI),um,0,0.005,0.12).scale.z=0.9;return {g,um}};
 const gloveFb=(hex)=>{const g=new THREE.Group(),um=M(hex||'#a3302a',0.5);[-0.1,0.1].forEach(x=>{const b=put(g,new THREE.SphereGeometry(0.08,12,10),um,x,0.08,0.02);b.scale.set(1,0.9,1.3);put(g,Cy(0.055,0.06,0.07,12),M('#222'),x,0.06,-0.09).rotation.x=Math.PI/2});return {g,um}};
 const tintB=(n,size,fb,rx)=>{const base=glbProd(n,size,fb,null,rx);return (hex,st,k)=>{const src=GLC[n];if(!src)return fb(hex,st,k);const r=base('#ffffff',st,k);let um=null;r.g.traverse(o=>{if(o.isMesh){o.material=o.material.clone();if(!um)um=o.material;else o.material=um;um.color.set(hex)}});return {g:r.g,um:um||r.um}}};
BBALL=tintB('basketball',0.3,ballFb);
 const NP2=[
 {id:'spor',ad:'Spor ayakkabı',tier:2,base:150,need:{deri:1,taban:1,iplik:1,tutkal:1,boya:1},sheet:'#e8e2d4',shape:()=>soleShape(1.1),build:glbProd('sneaker',0.46,shoeModel,/./),after:['ayakkabi',2],
  steps:[T('Yüz kesimi'),T('Yan şerit',{part:'serit',n:2,shape:rr(0.06,0.3),at:[-0.5,0]}),A('serit','Şeritleri yerleştir',[[-0.08,0],[0.08,0]]),Y('dik','Şerit dikişi',{n:10}),Y('yapistir','Tabana tutkal',{n:6,sc:0.7}),{t:'drag',what:'taban'},Hd('Pres'),{t:'lace',ad:'Bağcık geçirme',pts:[[-0.05,-0.15],[0.05,-0.15],[-0.05,-0.09],[0.05,-0.09],[-0.05,-0.03],[0.05,-0.03]]},D]},
 {id:'sapka',ad:'Şapka',tier:1,base:65,need:{kumas:1,iplik:1,boya:1},sheet:'#e2d6bd',shape:ci(0.24),build:glbProd('cap',0.36,capFb,/./),
  steps:[T('Tepe kesimi'),T('Siperlik',{part:'siper',n:1,shape:rr(0.26,0.12),at:[-0.45,0]}),Y('dik','Dilim dikişi',{n:10}),A('siper','Siperliği yerleştir',[[0,0.22]]),Y('dik','Siperlik dikişi',{pts:[[-0.1,0.2],[-0.04,0.22],[0.04,0.22],[0.1,0.2]]}),{t:'pour',steam:true,ad:'Buharla şekillendir'},D]},
 {id:'boks',ad:'Boks eldiveni',tier:2,base:170,need:{deri:2,yun:1,iplik:1,boya:1},sheet:'#9c6b4e',shape:rr(0.34,0.44),build:glbProd('boxing',0.42,gloveFb,/Upper/),after:['cuzdan',2],
  steps:[T('Gövde kesimi'),T('Bilek bandı',{part:'bant',n:2,shape:rr(0.08,0.3),at:[-0.5,0]}),Rb('incelt','Kenar inceltme'),Y('dik','Gövde dikişi',{n:12}),A('bant','Bilek bantlarını tak',[[-0.08,-0.15],[0.08,-0.15]]),Y('dik','Bant dikişi',{pts:[[-0.08,-0.24],[-0.08,-0.06],[0.08,-0.06],[0.08,-0.24]]}),{t:'stuff',ad:'Yün doldur',n:8},Rb('parlat','Parlatma'),D]},
 {id:'basket',ad:'Basketbol topu',tier:2,base:170,need:{deri:2,kaucuk:1,iplik:1},sheet:'#c8642a',wood:true,shape:()=>wedgeShape(0.24,0,Math.PI/2),fullShape:ci(0.24),tools:['kompresor'],build:(h,st,k)=>BBALL(h==='#c8642a'?'#ffffff':h,st,k),
  steps:[T('İlk paneli kes'),T('Diğer paneller',{part:'panel',n:3,at:[-0.4,0.05]}),{t:'asm',part:'panel',ad:'Panelleri birleştir',slots:[[0,0,Math.PI/2],[0,0,Math.PI],[0,0,Math.PI*1.5]],pose:'flat',tile:true},Y('dik','Panel dikişi',{seam:true,pts:[[-0.22,0],[-0.165,0],[-0.11,0],[-0.055,0],[0,0],[0.055,0],[0.11,0],[0.165,0],[0.22,0],[0,0.22],[0,0.165],[0,0.11],[0,0.055],[0,-0.055],[0,-0.11],[0,-0.165],[0,-0.22]]}),{t:'drag',what:'nozzle',ad:'Kompresör ucunu tak',to3d:true},{t:'pump',ad:'Bas, çek: topu şişir',n:10,tool:'kompresor'},D]},
 {id:'gozluk',ad:'Boynuz gözlük',tier:3,base:220,need:{boynuz:1,kum:2},sheet:'#3a2a20',wood:true,hard:true,shape:rr(0.44,0.16),tools:['havya'],build:glbProd('sunglasses',0.42,glassFb,/Plastic/),
  steps:[T('Çerçeve kesimi'),T('Cam yuvalarını oy',{hole:true,n:2,shape:()=>ellShape(0.075,0.055),at:[[-0.1,0.005],[0.1,0.005]]}),T('Saplar',{part:'sap',n:2,shape:rr(0.03,0.32),at:[-0.5,0]}),T('Camları kes',{part:'cam',n:2,shape:()=>ellShape(0.073,0.053),at:[-0.42,0.08],col:'#9fd3e8',thin:true,glass:true}),{t:'asm',part:'cam',ad:'Camları yerleştir',slots:[[-0.1,0.005],[0.1,0.005]],pose:'flat',tile:true},Y('delik','Menteşe delikleri',{pts:[[-0.2,0],[0.2,0]]}),{t:'screw',ad:'Menteşe vidalarını sık',pts:[[-0.2,0],[0.2,0]],turns:1.5},{t:'path',ad:'Camları havyayla lehimle',tool:'havya',paths:[[[-0.018,0.005],[-0.0192,-0.0058],[-0.0229,-0.0162],[-0.029,-0.026],[-0.0372,-0.0349],[-0.0473,-0.0425],[-0.059,-0.0487],[-0.072,-0.0533],[-0.0858,-0.0561],[-0.1,-0.057],[-0.1142,-0.0561],[-0.128,-0.0533],[-0.141,-0.0487],[-0.1527,-0.0425],[-0.1628,-0.0349],[-0.171,-0.026],[-0.1771,-0.0162],[-0.1808,-0.0058],[-0.182,0.005],[-0.1808,0.0158],[-0.1771,0.0262],[-0.171,0.036],[-0.1628,0.0449],[-0.1527,0.0525],[-0.141,0.0587],[-0.128,0.0633],[-0.1142,0.0661],[-0.1,0.067],[-0.0858,0.0661],[-0.072,0.0633],[-0.059,0.0587],[-0.0473,0.0525],[-0.0372,0.0449],[-0.029,0.036],[-0.0229,0.0262],[-0.0192,0.0158]],[[0.182,0.005],[0.1808,-0.0058],[0.1771,-0.0162],[0.171,-0.026],[0.1628,-0.0349],[0.1527,-0.0425],[0.141,-0.0487],[0.128,-0.0533],[0.1142,-0.0561],[0.1,-0.057],[0.0858,-0.0561],[0.072,-0.0533],[0.059,-0.0487],[0.0473,-0.0425],[0.0372,-0.0349],[0.029,-0.026],[0.0229,-0.0162],[0.0192,-0.0058],[0.018,0.005],[0.0192,0.0158],[0.0229,0.0262],[0.029,0.036],[0.0372,0.0449],[0.0473,0.0525],[0.059,0.0587],[0.072,0.0633],[0.0858,0.0661],[0.1,0.067],[0.1142,0.0661],[0.128,0.0633],[0.141,0.0587],[0.1527,0.0525],[0.1628,0.0449],[0.171,0.036],[0.1771,0.0262],[0.1808,0.0158]]]},A('sap','Sapları tak',[[-0.2,0.12],[0.2,0.12]]),Rb('zimpara','Zımpara'),Rb('parlat','Parlatma'),D]}];
 NP2.forEach(p=>PRODS.push(p));const lath=(pts,um,seg)=>{const m=mesh(new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p[0],p[1])),seg||20),um);m.material.side=THREE.DoubleSide;return m};
const kalemM=(hex)=>{const g=new THREE.Group(),um=M(hex||'#9c6b4e',0.6);g.add(lath([[0,0],[0.075,0],[0.08,0.005],[0.08,0.2],[0.072,0.2]],um,22));put(g,B(0.006,0.19,0.004),M(shade(hex||'#9c6b4e',-0.3)),0,0.1,0.081);put(g,Cy(0.012,0.012,0.006,10),M('#c9a23a',0.3),0,0.16,0.083).rotation.x=Math.PI/2;[[-0.02,0.02,'#c0392b'],[0.02,-0.01,'#2f6b5a'],[0,0.025,'#d9a23a']].forEach(q=>{const p=put(g,Cy(0.007,0.007,0.26,6),M(q[2]),q[0],0.13,q[1]);p.rotation.z=q[0]*3});return {g,um}};
const anahM=(hex)=>{const g=new THREE.Group(),um=M(hex||'#9c6b4e',0.6);const t=flat(rrect(0.07,0.17,0.03),0.012,um);t.position.y=0;g.add(t);put(g,Cy(0.008,0.008,0.014,10),M('#1d1612'),0,0.007,-0.06);const r=put(g,new THREE.TorusGeometry(0.035,0.005,6,20),M('#c9a23a',0.3),0,0.01,-0.11);r.rotation.x=Math.PI/2;return {g,um}};
const saksiM=(hex)=>{const g=new THREE.Group(),um=M(hex||'#b8653a',0.85);g.add(lath([[0,0],[0.09,0],[0.13,0.18],[0.15,0.19],[0.15,0.22],[0.135,0.22],[0.12,0.19],[0.08,0.02],[0,0.02]],um,22));put(g,Cy(0.12,0.12,0.01,18),M('#4a3020',1),0,0.2,0);return {g,um}};
const tespihM=(hex)=>{const g=new THREE.Group(),um=M(hex||'#dccbaa',0.35);for(let i=0;i<18;i++){const a=i/18*Math.PI*2;put(g,new THREE.SphereGeometry(0.018,8,6),um,Math.cos(a)*0.12,0.018,Math.sin(a)*0.12+0.02)}put(g,Cy(0.012,0.02,0.05,8),um,0,0.02,-0.12).rotation.x=Math.PI/2;for(let i=0;i<5;i++)put(g,Cy(0.002,0.002,0.07,4),M('#7a1a1a'),-0.01+i*0.005,0.01,-0.18).rotation.x=Math.PI/2;return {g,um}};
const tepsiM=(hex)=>{const g=new THREE.Group(),um=M(hex||'#c9955a',0.7);put(g,B(0.5,0.02,0.34),um,0,0.01,0);[[0,0.17,0.5,0.02],[0,-0.17,0.5,0.02]].forEach(q=>put(g,B(q[2],0.05,q[3]),um,q[0],0.035,q[1]));[[0.25,0],[-0.25,0]].forEach(q=>{put(g,B(0.02,0.07,0.34),um,q[0],0.045,0);put(g,B(0.022,0.02,0.08),M(shade(hex||'#c9955a',-0.3)),q[0],0.06,0)});return {g,um}};
const mumsetM=(hex)=>{const g=new THREE.Group(),um=M(hex||'#cdb8e0',0.5),jar=new THREE.MeshStandardMaterial({color:'#e8f0f2',transparent:true,opacity:0.35,roughness:0.1}),fl=new THREE.MeshBasicMaterial({color:'#ffc35a'});[-0.12,0,0.12].forEach(x=>{put(g,Cy(0.05,0.05,0.09,16),jar,x,0.045,0);put(g,Cy(0.046,0.046,0.07,16),um,x,0.035,0);put(g,Cy(0.003,0.003,0.02,4),M('#222'),x,0.08,0);const f=put(g,new THREE.SphereGeometry(0.01,6,5),fl,x,0.098,0);f.scale.y=1.8;f.castShadow=false});return {g,um}};
const NP3=[
 {id:'kalemlik',ad:'Deri kalemlik',tier:1,base:45,need:{deri:1,iplik:1},sheet:'#9c6b4e',shape:rr(0.36,0.24),build:kalemM,
  steps:[T('Deri kesimi'),Rb('incelt','Kenar inceltme'),Y('dik','Rulo dikişi',{pts:[[-0.17,-0.1],[-0.17,-0.05],[-0.17,0],[-0.17,0.05],[-0.17,0.1]],seam:true}),{t:'hammer',ad:'Kopça çak',kind:'rivet',hits:2,pts:[[0.1,0]]},Rb('parlat','Parlatma'),D]},
 {id:'anahtarlik',ad:'Anahtarlık',tier:1,base:25,need:{deri:1,toka:1},sheet:'#9c6b4e',shape:rr(0.1,0.26),build:anahM,
  steps:[T('Deri kesimi'),{t:'hammer',ad:'Halka deliğini zımbala',kind:'hole',hits:2,pts:[[0,-0.09]]},Rb('incelt','Kenar inceltme'),{t:'drag',what:'toka',ad:'Halkayı tak'},Rb('parlat','Parlatma'),D]},
 {id:'saksi',cut:'kn',ad:'Saksı',tier:1,base:55,need:{camur:1},sheet:'#b8653a',wood:true,shape:ci(0.22),build:saksiM,after:['comlek',1],
  steps:[T('Kil tabanı kes'),{t:'spin',ad:'Çarkta saksıyı çek'},Y('delik','Kenar deseni',{n:10}),{t:'rub',k:'torch',ad:'Pürmüzle fırınla'},Rb('cila','Sır sür'),D]},
 {id:'tespih',hard:true,ad:'Boynuz tespih',tier:2,base:110,need:{boynuz:1,iplik:1},sheet:'#dccbaa',wood:true,shape:rr(0.4,0.12),build:tespihM,
  steps:[T('Boncuk çubuğu kes'),{t:'split',ad:'Çubuğu kare parçalara böl',tool:'testere'},{t:'grind',ad:'Boncukları zımparada yuvarla'},{t:'drill',ad:'Boncukları del',pts:[[-0.15,0],[-0.075,0],[0,0],[0.075,0],[0.15,0]]},{t:'lace',ad:'Boncukları ipe diz',pts:[[-0.15,0],[-0.075,0],[0,0],[0.075,0],[0.15,0]]},Rb('parlat','Parlatma'),D]},
 {id:'tepsi',hard:true,ad:'Ahşap tepsi',tier:3,base:120,need:{kereste:2,balmumu:1},sheet:'#c9955a',wood:true,shape:rr(0.5,0.34),build:tepsiM,after:['tahta',1],
  steps:[T('Tepsi kesimi'),{t:'plane',ad:'Yüzeyi rendele',n:5},Y('yapistir','Kenar çıtalarını yapıştır',{n:10,sc:0.92}),Hd('Sıkıştır'),{t:'screw',ad:'Kulpları vidala',pts:[[-0.2,0],[0.2,0]]},Rb('cila','Yağla'),D]},
 {id:'mumset',cut:'kn',ad:'Kokulu mum seti',tier:2,base:110,need:{balmumu:2,lavanta:1,iplik:1},sheet:'#cdb8e0',wood:true,shape:rr(0.42,0.16),build:mumsetM,after:['mum',1],
  steps:[T('Kalıp tabanı'),T('Fitil kes',{part:'fitil',n:3,shape:rr(0.03,0.14),at:[-0.45,0]}),A('fitil','Fitilleri yerleştir',[[-0.12,0],[0,0],[0.12,0]]),{t:'stir',ad:'Lavantayı balmumuna karıştır'},{t:'pour',ad:'Kalıplara dök'},Rb('parlat','Yüzeyi düzelt'),D]}];
NP3.forEach(p=>PRODS.push(p));
const balM=(hex)=>{const g=new THREE.Group(),um=M(hex||'#e09a2a',0.25);put(g,Cy(0.1,0.1,0.2,18),new THREE.MeshStandardMaterial({color:'#e8f0f2',transparent:true,opacity:0.3,roughness:0.05}),0,0.1,0);put(g,Cy(0.094,0.094,0.17,18),um,0,0.087,0);put(g,Cy(0.105,0.105,0.03,18),M('#d9c8a0',0.9),0,0.215,0);put(g,new THREE.TorusGeometry(0.104,0.004,4,24),M('#7a1a1a'),0,0.205,0).rotation.x=Math.PI/2;return {g,um}};
const terlikM=(hex)=>{const g=new THREE.Group(),um=M(hex||'#8a6a5a',1);[-0.1,0.1].forEach(x=>{const s=flat(soleShape(0.75),0.025,um);s.position.set(x,0,0);g.add(s);const d=put(g,new THREE.SphereGeometry(0.07,12,8,0,Math.PI*2,0,Math.PI/2),um,x,0.02,-0.08);d.scale.set(1,0.7,1.2)});return {g,um}};
const G4=(n,r)=>{const o=[];for(let i=0;i<n;i++){const a=i*2.4,rr=r*Math.sqrt((i+0.5)/n);o.push([Math.round(Math.cos(a)*rr*1000)/1000,Math.round(Math.sin(a)*rr*1000)/1000])}return o};
const glassM=c=>new THREE.MeshStandardMaterial({color:c,transparent:true,opacity:0.55,roughness:0.05,metalness:0.1});
const siseM=(hex)=>{const g=new THREE.Group(),um=glassM(hex||'#8fc4c8');g.add(lath([[0,0],[0.09,0],[0.1,0.02],[0.1,0.16],[0.05,0.22],[0.03,0.3],[0.035,0.32],[0,0.32]],um,20));return {g,um}};
const nazarM=(hex)=>{const g=new THREE.Group(),um=M(hex||'#1f48b8',0.15);const d=put(g,new THREE.SphereGeometry(0.1,18,10),um,0,0.03,0);d.scale.y=0.3;[[0.07,'#ffffff'],[0.045,'#7fc8f0'],[0.022,'#151313']].forEach((q,i)=>{const c=put(g,Cy(q[0],q[0],0.006,18),M(q[1],0.15),0,0.06+i*0.003,0);c.castShadow=false});return {g,um}};
const cezveM=(hex)=>{const g=new THREE.Group(),um=M(hex||'#c87a4a',0.25);um.metalness=0.6;g.add(lath([[0,0],[0.08,0],[0.09,0.05],[0.075,0.13],[0.085,0.16],[0,0.16]],um,20));const h=put(g,Cy(0.012,0.014,0.26,8),M('#5a3519'),0.2,0.12,0);h.rotation.z=1.2;return {g,um}};
const btepsiM=(hex)=>{const g=new THREE.Group(),um=M(hex||'#c87a4a',0.25);um.metalness=0.6;g.add(lath([[0,0],[0.25,0],[0.27,0.02],[0.28,0.03],[0.26,0.025],[0,0.012]],um,32));return {g,um}};
const bicakM=(hex)=>{const g=new THREE.Group(),um=M(hex||'#9aa0a8',0.2);um.metalness=0.7;const s=new THREE.Shape();s.moveTo(-0.025,0);s.lineTo(0.02,0);s.quadraticCurveTo(0.03,0.2,-0.025,0.3);s.lineTo(-0.025,0);const b=flat(s,0.008,um);b.position.y=0.01;g.add(b);put(g,B(0.05,0.03,0.16),M('#5a3519',0.7),0,0.015,0.08);return {g,um}};
const nalM=(hex)=>{const g=new THREE.Group(),um=M(hex||'#6a6e74',0.35);um.metalness=0.5;const t=put(g,new THREE.TorusGeometry(0.11,0.022,6,20,Math.PI*1.35),um,0,0.02,0);t.rotation.x=Math.PI/2;t.rotation.z=-0.2*Math.PI;return {g,um}};
const esarpM=(hex)=>{const g=new THREE.Group(),um=M(hex||'#f4ead0',0.25);const pg=new THREE.PlaneGeometry(0.4,0.4,12,12);const ps=pg.attributes.position;for(let i=0;i<ps.count;i++)ps.setZ(i,Math.sin(ps.getX(i)*18)*0.012+Math.cos(ps.getY(i)*14)*0.01);pg.computeVertexNormals();const m=put(g,pg,um,0,0.03,0);m.rotation.x=-Math.PI/2;m.material.side=THREE.DoubleSide;return {g,um}};
const haliM=(hex)=>{const g=new THREE.Group(),um=M(hex||'#a83a2a',0.95);put(g,B(0.46,0.015,0.62),um,0,0.008,0);put(g,B(0.38,0.017,0.54),M('#e8d8b0',0.95),0,0.009,0);put(g,B(0.3,0.019,0.46),um,0,0.01,0);const r=put(g,Cy(0.07,0.07,0.021,4),M('#1f48b8',0.95),0,0.011,0);r.rotation.y=Math.PI/4;for(let i=0;i<9;i++)[-0.32,0.32].forEach(z=>put(g,B(0.006,0.004,0.04),M('#e8d8b0'),-0.2+i*0.05,0.004,z+Math.sign(z)*0.02));return {g,um}};
[{id:'sise',ad:'Cam şişe',tier:2,base:90,need:{cam:2},sheet:'#8fc4c8',wood:true,shape:ci(0.12),build:siseM,
  steps:[{t:'spin',ad:'Camı boruda çevir'},{t:'rub',k:'torch',ad:'Pürmüzle camı erit'},{t:'blow',ad:'Üfleyerek şişir',n:8},Rb('sekil','Elle şekillendir'),D]},
 {id:'nazar',ad:'Nazar boncuğu',tier:2,base:55,need:{cam:1,boya_lacivert:1},sheet:'#1f48b8',wood:true,shape:ci(0.1),build:nazarM,
  steps:[{t:'spin',ad:'Boncuğu çubukta çevir'},{t:'rub',k:'torch',ad:'Pürmüzle camı erit'},{t:'layer',ad:'Renkli camları katman katman ekle'},Rb('sekil','Elle yuvarla'),D]},
 {id:'cezve',ad:'Bakır cezve',tier:2,base:140,need:{bakir:2,kereste:1},sheet:'#c87a4a',wood:true,shape:ci(0.2),build:cezveM,
  steps:[T('Bakır levhayı kes'),{t:'hammer',kind:'dent',hits:1,ad:'Çekiçle döv',pts:G4(12,0.17)},T('Sapı kes',{part:'sap',n:1,shape:rr(0.05,0.26),at:[-0.45,0],col:'#5a3519'}),{t:'asm',part:'sap',ad:'Sapı yerleştir',slots:[[0.31,0,Math.PI/2]],pose:'flat'},{t:'hammer',kind:'rivet',hits:3,ad:'Sapı çekiçle çak',pts:[[0.22,0],[0.29,0]]},{t:'spin',ad:'Tornada biçimlendir'},Hd('Kalayla'),Rb('parlat','Parlatma'),D]},
 {id:'btepsi',ad:'Bakır tepsi',tier:2,base:130,need:{bakir:2},sheet:'#c87a4a',wood:true,shape:ci(0.27),build:btepsiM,after:['cezve',1],
  steps:[T('Bakır levhayı kes'),{t:'hammer',kind:'dent',hits:1,ad:'Çekiçle döv',pts:G4(14,0.24)},Y('delik','Kalem işi',{n:12,sc:0.8}),Hd('Kalayla'),Rb('parlat','Parlatma'),D]},
 {id:'bicak',hard:true,ad:'Demir bıçak',tier:3,base:170,need:{celik:1,kereste:1},sheet:'#9aa0a8',wood:true,shape:rr(0.08,0.5),build:bicakM,
  steps:[T('Çeliği kes'),{t:'rub',k:'torch',ad:'Pürmüzle kızdır'},{t:'hammer',kind:'dent',hits:2,ad:'Örste döv',pts:[[0,-0.2],[0,-0.12],[0,-0.04],[0,0.04],[-0.02,-0.16],[0.02,-0.08]]},Hd('Suya daldır'),T('Ahşap sapı kes',{part:'sap',n:1,shape:rr(0.07,0.2),at:[-0.45,0],col:'#6b4a2e'}),A('sap','Sapı takıma geçir',[[0,0.16]]),{t:'hammer',kind:'rivet',hits:2,ad:'Sap perçinlerini çak',pts:[[0,0.11],[0,0.21]]},Rb('zimpara','Bile'),D]},
 {id:'nal',hard:true,ad:'At nalı',tier:3,base:80,need:{celik:1},sheet:'#6a6e74',wood:true,shape:rr(0.06,0.5),build:nalM,
  steps:[T('Çelik çubuğu kes'),{t:'rub',k:'torch',ad:'Pürmüzle kızdır'},{t:'bend',ad:'Örste U şeklinde bük'},{t:'hammer',kind:'dent',hits:1,ad:'Örste döv',pts:[[-0.115,0.066],[-0.103,-0.016],[-0.039,-0.07],[0.039,-0.07],[0.103,-0.016],[0.115,0.066]]},{t:'drill',ad:'Mıh deliklerini del',pts:[[-0.118,0.046],[-0.088,-0.037],[0.088,-0.037],[0.118,0.046]]},D]},
 {id:'tac',hard:true,ad:'Pirinç taç',tier:3,base:280,need:{pirinc:2,cam:1},sheet:'#d9a23a',wood:true,shape:rr(0.56,0.07),after:['btepsi',1],
  build:(hex)=>{const g=new THREE.Group(),um=M(hex,0.35);put(g,Cy(0.13,0.13,0.06,20,1,true),um,0,0.03,0).material.side=THREE.DoubleSide;for(let i=0;i<8;i++){const a=i/8*Math.PI*2;put(g,new THREE.ConeGeometry(0.025,0.07,4),um,Math.cos(a)*0.13,0.09,Math.sin(a)*0.13);put(g,new THREE.SphereGeometry(0.012,6,5),M('#c0392b',0.3),Math.cos(a)*0.135,0.035,Math.sin(a)*0.135)}return {g,um}},
  steps:[T('Taban plakasını kes'),{t:'zig',ad:'Demir makasıyla zigzag uçları kes',tool:'makas'},{t:'weld',ad:'İki plakayı kaynakla'},{t:'rub',k:'torch',ad:'Pürmüzle tavla'},{t:'gems',ad:'Taşları yerleştir'},Rb('parlat','Parlatma'),{t:'roll',ad:'Plakayı halkaya kıvır'},D]},
 {id:'esarp',ad:'İpek eşarp',tier:3,base:190,need:{ipek:2,boya:1},sheet:'#f4ead0',shape:rr(0.36,0.36),build:esarpM,
  steps:[{t:'shuttle',ad:'İpeği doku',n:12},Y('dik','Kenar dikişi',{n:10}),Hd('Ütü'),D]},
 {id:'hali',ad:'Yün halı',tier:3,base:270,need:{yun:4,iplik:2,boya:1},sheet:'#a83a2a',wood:true,shape:rr(0.44,0.6),build:haliM,
  steps:[{t:'shuttle',ad:'Tezgâhta halı dok',n:16},Y('dik','Düğüm at',{n:12}),Rb('incelt','Havı kırp'),D]}].forEach(p=>PRODS.push(p));
[{id:'balkav',ad:'Bal kavanozu',tier:2,base:70,need:{bal:2,kum:1},sheet:'#e09a2a',wood:true,cut:'sc',shape:ci(0.14),build:balM,
  steps:[T('Kapak bezini kes'),{t:'pour',ad:'Balı kavanoza dök'},{t:'lace',ad:'Kapağı iple bağla',pts:[0,1,2,3,4,5,6].map(i=>[Math.cos(i/6*6.283)*0.1,Math.sin(i/6*6.283)*0.1])},D]},
 {id:'terlik',ad:'Keçe terlik',tier:2,base:90,need:{kece:2,iplik:1},sheet:'#8a6a5a',shape:()=>soleShape(1),build:terlikM,
  steps:[T('Taban keçesini kes'),T('Yüz keçesi',{part:'yuz',n:1,shape:rr(0.2,0.16),at:[-0.45,0]}),Rb('incelt','Keçeyi ıslak ovala'),A('yuz','Yüzü yerleştir',[[0,-0.1]],'flat'),Y('dik','Kenar dikişi',{n:10}),Hd('Kalıpta kurut'),D]}].forEach(p=>PRODS.push(p));
}

const PHASE={oy:'Hazırlık',asm:'Birleştirme',trace:'Hazırlık',incelt:'Hazırlık',dik:'Birleştirme',yapistir:'Birleştirme',delik:'Birleştirme',taban:'Birleştirme',toka:'Birleştirme',hold:'Birleştirme',zimpara:'Bitiriş',cila:'Bitiriş',parlat:'Bitiriş',design:'Bitiriş'};
const stepKey=s=>s.t==='rhythm'||s.t==='rub'?s.k:s.t==='drag'?s.what:s.t;

/* ---------- ikonlar ---------- */
const IR=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});IR.setSize(96,96);IR.toneMapping=THREE.ACESFilmicToneMapping;IR.toneMappingExposure=1.3;
const IS=new THREE.Scene();IS.add(new THREE.HemisphereLight('#fff2dc','#6a5040',0.8));const il=new THREE.DirectionalLight('#ffffff',0.9);il.position.set(1,2,1.5);IS.add(il);
const IC=new THREE.PerspectiveCamera(28,1,0.01,10);
function snap(obj){IS.add(obj);const bb=new THREE.Box3().setFromObject(obj),sz=bb.getSize(V(0,0,0)),c=bb.getCenter(V(0,0,0)),r=Math.max(sz.x,sz.y,sz.z);
IC.position.set(c.x+r*1.2,c.y+r*1.3,c.z+r*1.9);IC.lookAt(c);IR.render(IS,IC);const u=IR.domElement.toDataURL();IS.remove(obj);return u}
const ICON={};Object.keys(MATS).forEach(k=>ICON[k]=snap(MATS[k].mk()));
{const BAL={"cuzdan":100,"kemer":100,"ayakkabi":150,"canta":190,"atki":90,"kasik":75,"tabure":130,"sirt":200,"sepet":75,"sabun":60,"comlek":75,"vazo":115,"mum":80,"dugme":85,"yastik":110,"tahta":65,"firca":95,"spor":160,"sapka":90,"boks":180,"basket":185,"gozluk":195,"kalemlik":75,"anahtarlik":55,"saksi":60,"tespih":105,"tepsi":115,"mumset":110,"sise":80,"nazar":65,"cezve":135,"btepsi":125,"bicak":150,"nal":95,"esarp":180,"hali":240,"balkav":70,"terlik":110};PRODS.forEach(p=>{if(BAL[p.id])p.base=BAL[p.id]})}
const icP=p=>{try{ICON[p.id]=snap(p.build(p.sheet,p.styles&&p.styles[0]).g)}catch(e){}};PRODS.forEach(icP);
let icT=0;function iconsRefresh(){PRODS.forEach(icP);try{refresh()}catch(e){}try{vitrinSync()}catch(e){}}
setTimeout(()=>{['backpack','basket','boxing','briefcase','button','cap','pair_of_shoes','sneaker','soap','spoon','stool','sunglasses','basketball','solder'].forEach(n=>glb(n,()=>{clearTimeout(icT);icT=setTimeout(iconsRefresh,500)}))},1500);
setTimeout(()=>{const gB=(n,size,fb,re,o)=>{o=o||{};const b=glbProd(n,size,fb,/(?!)/,o.rx);return (hex,st,k)=>{if(!GLC[n])return fb(hex,st,k);const r=b(hex,st,k);let um=null;r.g.traverse(q=>{if(q.isMesh){const ms=(Array.isArray(q.material)?q.material:[q.material]).map(mt=>{if(!re.test(mt.name))return mt;if(!um){um=mt.clone();if(o.noMap)um.map=null;const c=new THREE.Color(hex);if(o.mix!=null)c.lerp(new THREE.Color('#ffffff'),o.mix);um.color.copy(c);um.needsUpdate=true}return um});q.material=ms.length>1?ms:ms[0]}});if(o.post)o.post(r.g,hex);return {g:r.g,um:um||r.um}}};
 const P=id=>PRODS.find(p=>p.id===id),H=Math.PI/2,MB={
  sise:['m_bottle',0.2,/mat5/],balkav:['m_jar',0.2,/mat25|mat24/,{mix:0.25}],tespih:['m_necklace',0.36,/./,{rx:-H}],nal:['m_horseshoe',0.3,/./],
  bicak:['m_knife',0.46,/^Grey$/,{rx:H}],terlik:['m_slippers',0.44,/SlipperMain/],tahta:['m_cboard',0.46,/./,{noMap:true}],mum:['m_candle',0.2,/./,{mix:0.35}],
  btepsi:['m_tray',0.48,/./,{noMap:true}],kalemlik:['m_mugpen',0.22,/./,{mix:0.55}],yastik:['m_pillow',0.46,/./],vazo:['m_vase',0.24,/./],tac:['m_crown',0.34,/blinn1SG/]};
 Object.entries(MB).forEach(([id,a])=>{const p=P(id);if(p){p.build=gB(a[0],a[1],p.build,a[2],a[3]);glb(a[0],()=>{clearTimeout(icT);icT=setTimeout(iconsRefresh,500)})}});
 const an=P('anahtarlik');if(an){const fb=an.build;an.build=(hex,st,k)=>{const r=fb(hex,st,k);const src=GLC.m_key;if(src){const m=src.scene.clone();m.rotation.x=-H;m.updateMatrixWorld(true);let bb=new THREE.Box3().setFromObject(m),s=bb.getSize(V(0,0,0));m.scale.multiplyScalar(0.16/Math.max(s.x,s.z));m.updateMatrixWorld(true);bb=new THREE.Box3().setFromObject(m);m.position.set(0.07-(bb.min.x+bb.max.x)/2,-bb.min.y,0.05-(bb.min.z+bb.max.z)/2);r.g.add(m)}return r};glb('m_key',()=>{})}
 glb('saw2',()=>{const w=fitM('saw2',{w:0.3});if(w){const i=TL.sw.children[0];i.children.forEach(c=>c.visible=false);w.position.set(0,-0.004,-0.04);i.add(w)}});glb('axe',()=>{const w=fitM('axe',{rz:Math.PI,h:0.36});if(w){const i=TL.ax.children[0];i.children.forEach(c=>c.visible=false);w.position.y=-0.005;i.add(w)}});
 ['m_screw','m_sledge','m_fan','m_torch','m_pipe','m_anvil','m_bellow','m_mulberry','m_crown','m_chest2','m_bucket'].forEach(n=>glb(n,()=>{}))},1600);
const img=k=>`<img src="${ICON[k]}" alt="">`;

/* ---------- ışıklar ---------- */
const hemi=new THREE.HemisphereLight('#ffe2b0','#3a2412',0.45);S.add(hemi);
const sun=new THREE.DirectionalLight('#ffcf85',1.5);sun.position.set(1.5,4.5,-9);sun.target.position.set(-0.5,0,1);S.add(sun.target);
sun.castShadow=true;sun.shadow.mapSize.set(LOW?1024:2048,LOW?1024:2048);Object.assign(sun.shadow.camera,{left:-5,right:5,top:5,bottom:-5,near:1,far:20});sun.shadow.bias=-0.0008;S.add(sun);
const lamp=new THREE.PointLight('#ffb35c',1.4,8,2);lamp.position.set(0,2.6,0.6);lamp.castShadow=true;lamp.shadow.mapSize.set(1024,1024);S.add(lamp);
const benchL=new THREE.PointLight('#ffd9a0',0.7,4,2);benchL.position.set(0.6,2.2,1.5);S.add(benchL);
const iL1=new THREE.PointLight('#ffc080',1.7,16,2);iL1.position.set(OI,3.4,-0.6);iL1.shadow.mapSize.set(LOW?512:1024,LOW?512:1024);iL1.shadow.bias=-0.002;S.add(iL1);
const iL2=new THREE.PointLight('#ff7a30',0.9,5,2);iL2.position.set(OI-1.25,1.2,1.7);S.add(iL2);
const gSun=new THREE.DirectionalLight('#fff0d0',1.35);gSun.position.set(OB-6,10,6);gSun.target.position.set(OB,0,-0.5);S.add(gSun.target);S.add(gSun);
gSun.shadow.mapSize.set(LOW?1024:2048,LOW?1024:2048);Object.assign(gSun.shadow.camera,{left:-8,right:8,top:8,bottom:-8,near:1,far:30});gSun.shadow.bias=-0.0006;
const pSun=new THREE.DirectionalLight('#fff0d0',1.3);pSun.position.set(OP-5,10,6);pSun.target.position.set(OP,0,-0.5);S.add(pSun.target);S.add(pSun);pSun.shadow.mapSize.set(LOW?1024:2048,LOW?1024:2048);Object.assign(pSun.shadow.camera,{left:-8,right:8,top:8,bottom:-8,near:1,far:30});pSun.shadow.bias=-0.0006;
const dL=new THREE.PointLight('#ffc888',2.1,16,2);dL.position.set(OD,3.2,1.2);dL.shadow.mapSize.set(LOW?512:1024,LOW?512:1024);dL.shadow.bias=-0.002;S.add(dL);
const LIGHTS={home:[[sun,1.5],[lamp,1.4],[benchL,0.7],[hemi,0.45]],islik:[[iL1,2.3],[iL2,0.9],[hemi,0.85]],bahce:[[gSun,1.35],[hemi,0.85]],pazar:[[pSun,1.05],[hemi,0.55]],depo:[[dL,2.1],[hemi,0.75]]};
const SHAD={home:[sun],islik:[iL1],bahce:[gSun],pazar:[pSun],depo:[dL]};
const BGS={home:'#2b1d12',islik:'#1e140c',bahce:'#a9d3e8',pazar:'#a9d3e8',depo:'#1e140c'};
function setLights(v){const k=(v==='bench'||v==='vitrin')?'home':v;[sun,lamp,benchL,iL1,iL2,gSun,pSun,dL].forEach(l=>{l.visible=false;l.castShadow=false});LIGHTS[k].forEach(([l,i])=>{l.intensity=i;l.visible=true});SHAD[k].forEach(l=>l.castShadow=true);R.shadowMap.needsUpdate=true;S.background.set(BGS[k])}

/* ---------- dükkan ---------- */
for(let i=0;i<9;i++)add(B(0.66,0.05,9),M(i%2?'#7a4a2a':'#6c4024'),-2.64+i*0.66,0,0);
const wallM=M('#9a6a42'),beam=M('#5a3519');
add(B(6,3.4,0.15),wallM,0,1.7,-4);add(B(0.15,3.4,9),wallM,-3,1.7,0);add(B(0.15,3.4,9),wallM,3,1.7,0);
for(let i=0;i<5;i++)add(B(0.2,0.2,9),beam,-2.4+i*1.2,3.3,0);
const winM=glow('#ffe6a8');add(B(1.6,1.2,0.05),winM,1.2,2,-3.9).castShadow=false;
[[1.8,0.1,0.15,1.2,2.65],[1.8,0.1,0.15,1.2,1.35],[0.08,1.2,0.12,1.2,2],[1.6,0.08,0.12,1.2,2]].forEach(b=>add(B(b[0],b[1],b[2]),beam,b[3],b[4],-3.88));
const doorM=glow('#f6d38a'),opM=glow('#2f6b5a');add(B(1.2,2.3,0.05),doorM,-1.4,1.15,-3.9).castShadow=false;add(B(0.46,0.2,0.03),opM,-1.4,1.75,-3.84).castShadow=false;
add(B(1.4,0.12,0.18),beam,-1.4,2.36,-3.88);add(B(0.12,2.36,0.18),beam,-2.06,1.18,-3.88);add(B(0.12,2.36,0.18),beam,-0.74,1.18,-3.88);
const shaft=new THREE.Mesh(new THREE.CylinderGeometry(0.7,1.3,5,4,1,true),new THREE.MeshBasicMaterial({color:'#ffd68a',transparent:true,opacity:0.07,depthWrite:false,blending:THREE.AdditiveBlending}));
shaft.position.set(0.6,1.4,-1.6);shaft.rotation.set(1.1,0.785,0);S.add(shaft);
const shelfItems=[()=>shoeModel('#6e3d1f','Bağcıklı'),()=>cuzdanModel('#a3302a'),()=>cantaModel('#2c3e6b','Kısa sap'),()=>kemerModel('#262220'),()=>atkiModel('#a3302a'),()=>shoeModel('#262220','Tokalı')];
[-2.7,2.7].forEach((x,si)=>{for(let k=0;k<3;k++){add(B(0.45,0.06,2.6),M('#6e4122'),x,0.9+k*0.7,-1.4);
if(x>0)continue;for(let j=0;j<3;j++){const it=shelfItems[(j+k+si*2)%shelfItems.length]();it.g.scale.setScalar(0.85);it.g.position.set(x,0.93+k*0.7,-2.3+j*0.85);it.g.rotation.y=x<0?-1.2:1.2;S.add(it.g)}}});

const VIT=new THREE.Group();S.add(VIT);const VSL=[];for(let k=0;k<3;k++)for(let j=0;j<3;j++)VSL.push(V(2.7,0.93+k*0.7,-2.3+j*0.85));
add(B(0.05,0.32,1.0),M('#5a3519'),2.92,2.95,-1.45);
function canTex(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t}
function kilim(c,w,h){c.fillStyle='#b5533c';c.fillRect(0,0,w,h);c.fillStyle='#f0e2c4';c.fillRect(10,10,w-20,h-20);c.fillStyle='#8e3a2a';c.fillRect(18,18,w-36,h-36);
const n=4,cw=(w-36)/n;for(let i=0;i<n;i++){const cx=18+cw*(i+0.5),cy=h/2;[[cw*0.46,'#f0e2c4'],[cw*0.34,'#2f6b5a'],[cw*0.22,'#e3b24a'],[cw*0.1,'#8e3a2a']].forEach(([r,col])=>{c.fillStyle=col;c.beginPath();c.moveTo(cx,cy-r*1.5);c.lineTo(cx+r,cy);c.lineTo(cx,cy+r*1.5);c.lineTo(cx-r,cy);c.closePath();c.fill()})}
c.fillStyle='#f0e2c4';for(let x=0;x<w;x+=12){c.fillRect(x,2,6,5);c.fillRect(x+6,h-7,6,5)}}
function cini(c,w,h){c.fillStyle='#f6f1e6';c.fillRect(0,0,w,h);const s=h;for(let x=0;x<w;x+=s){c.strokeStyle='#2c5f8a';c.lineWidth=2;c.strokeRect(x+1,1,s-2,s-2);c.fillStyle='#2c5f8a';
for(let k=0;k<4;k++){const a=k*Math.PI/2;c.beginPath();c.ellipse(x+s/2+Math.cos(a)*s*0.2,s/2+Math.sin(a)*s*0.2,s*0.16,s*0.07,a,0,7);c.fill()}c.fillStyle='#b5533c';c.beginPath();c.arc(x+s/2,s/2,s*0.08,0,7);c.fill();
c.fillStyle='#3f8a6e';[[0,0],[s,0],[0,s],[s,s]].forEach(q=>{c.beginPath();c.arc(x+q[0],q[1],s*0.14,0,7);c.fill()})}}
const rugM=new THREE.MeshStandardMaterial({map:canTex(256,160,kilim),roughness:0.95});
const r1=add(new THREE.PlaneGeometry(2.3,1.45),rugM,-0.35,0.03,-1.5);r1.rotation.x=-Math.PI/2;r1.castShadow=false;
const ciniM=new THREE.MeshStandardMaterial({map:canTex(512,64,cini),roughness:0.4});
[[-2.25,1.3],[0.05,0.62],[2.35,1.25]].forEach(([x,w])=>{const t=add(new THREE.PlaneGeometry(w,0.42),ciniM,x,0.62,-3.915);t.castShadow=false});
const AWN=new THREE.Group();S.add(AWN);for(let i=0;i<11;i++){const x=-1.1+i*0.22,c=glow(i%2?'#e9dcc0':'#a84a35');put(AWN,B(0.22,0.2,0.02),c,x,2.42,2.2).castShadow=false;put(AWN,new THREE.CircleGeometry(0.11,12,Math.PI,Math.PI),c,x,2.32,2.21).castShadow=false}
function plant(x,y,z,k){put(S,Cy(0.14*k,0.1*k,0.2*k,8),M('#b06a3a'),x,y,z);for(let i=0;i<6;i++){const a=i/6*Math.PI*2,l=put(S,new THREE.ConeGeometry(0.06*k,0.38*k,4),M(i%2?'#4f7a3a':'#5f8a44'),x+Math.cos(a)*0.1*k,y+0.2*k,z+Math.sin(a)*0.1*k);l.rotation.z=Math.cos(a)*0.6;l.rotation.x=-Math.sin(a)*0.6}}
place('bookcase_open',{x:-2.4,z:-3.62,h:1.75});place('m_crown',{x:-2.4,y:1.76,z:-3.6,h:0.15,ry:0.3});place('flowerpot',{x:-0.35,z:-3.5,h:1.05});place('flowerpot',{x:2.15,z:-3.45,h:0.95,ry:1});
place('flower_petal',{x:-2.6,y:2.33,z:0.75,h:0.38});place('flower_petal',{x:2.6,y:2.33,z:0.75,h:0.38});place('wallshelf',{x:2.35,y:1.15,z:-3.72,w:0.95});
place('pair_of_shoes',{x:-2.7,y:2.33,z:-1.45,w:0.42,ry:-1.3});place('glove',{x:-1.75,y:1.085,z:2.05,w:0.2,ry:0.5});place('light_desk',{x:1.85,y:1.085,z:1.3,h:0.5,ry:-2.4});
const Y=1.085,BC=V(0,Y,1.66);
const CTB=M('#8a5530'),CTT=M('#a8693a');add(B(4.2,1.0,1.3),CTB,0,0.5,1.7);add(B(4.4,0.08,1.42),CTT,0,1.04,1.7);
for(let i=0;i<3;i++)add(B(4.2,0.04,0.02),beam,0,0.25+i*0.28,2.36);
add(B(1.36,0.006,1.0),M('#3d5a3a'),0,Y-0.002,1.66);
for(let i=0;i<7;i++)add(B(0.004,0.008,1.0),M('#577a52'),-0.6+i*0.2,Y-0.001,1.66);
for(let i=0;i<5;i++)add(B(1.36,0.008,0.004),M('#577a52'),0,Y-0.001,1.26+i*0.2);
add(Cy(0.1,0.1,0.22,8),M('#d9a441'),1.45,1.19,1.7);
add(B(0.05,0.02,0.32),M('#c0c4c8'),0.9,Y+0.01,1.25).rotation.y=0.5;
{const bz=1.08;[['#a3302a',-0.6],['#2c3e6b',-0.47],['#c9982a',-0.34]].forEach(([h,x])=>{const o=pot(h);o.scale.setScalar(0.75);o.position.set(x,Y,bz);S.add(o)});
const br=new THREE.Group();put(br,Cy(0.009,0.011,0.2,6),M('#a0703c'),0,0,0);put(br,Cy(0.012,0.012,0.04,6),M('#b8bcc0',0.4),0,0.115,0);put(br,new THREE.ConeGeometry(0.014,0.06,6),M('#3a2a1e'),0,0.165,0);br.rotation.z=Math.PI/2;br.rotation.y=0.3;br.position.set(-0.13,Y+0.014,bz);S.add(br);
const sc=new THREE.Group();[0.35,-0.35].forEach(a=>{const b=put(sc,B(0.022,0.006,0.2),M('#c8ccd0',0.3),0,0,0);b.rotation.y=a;const t=put(sc,new THREE.TorusGeometry(0.028,0.008,5,12),M('#b5533c'),Math.sin(a)*0.12,0,Math.cos(a)*0.12);t.rotation.x=Math.PI/2});sc.position.set(0.14,Y+0.01,bz+0.01);sc.rotation.y=1.25;S.add(sc);place('scissors2',{par:sc,swap:1,w:0.21,rx:Math.PI/2,y:0});
const sp=MATS.iplik.mk();sp.scale.setScalar(0.7);sp.position.set(0.38,Y,bz);S.add(sp);
add(new THREE.SphereGeometry(0.045,8,6),M('#b5533c'),0.54,Y+0.02,bz).scale.y=0.6;[[0.52,0.25],[0.56,-0.25]].forEach(q=>{const n=add(Cy(0.003,0.003,0.07,4),M('#d0d4d8',0.3),q[0],Y+0.06,bz);n.rotation.z=q[1]});
add(B(0.5,0.008,0.045),M('#e3c98a'),-0.36,Y+0.004,2.26);for(let i=0;i<10;i++)add(B(0.004,0.002,0.02),M('#4a3423'),-0.585+i*0.05,Y+0.009,2.25);
const ml=new THREE.Group();put(ml,Cy(0.04,0.04,0.1,8),M('#8a5530'),0,0,0).rotation.z=Math.PI/2;put(ml,Cy(0.011,0.011,0.18,6),M('#5a3519'),0,0,0.11).rotation.x=Math.PI/2;ml.position.set(0.4,Y+0.04,2.25);ml.rotation.y=0.6;S.add(ml)}
add(new THREE.CylinderGeometry(0.01,0.01,0.6,4),M('#222'),0,2.95,0.6);
const shadeL=add(new THREE.ConeGeometry(0.3,0.25,8,1,true),M('#3b2616'),0,2.55,0.6);shadeL.material.side=THREE.DoubleSide;
add(new THREE.SphereGeometry(0.08,8,6),glow('#ffdd99'),0,2.45,0.6).castShadow=false;
const DN=80,pg=new THREE.BufferGeometry(),pp=new Float32Array(DN*3);
for(let i=0;i<DN;i++){pp[i*3]=-1+Math.random()*3;pp[i*3+1]=0.4+Math.random()*2.6;pp[i*3+2]=-3.5+Math.random()*3.5}
pg.setAttribute('position',new THREE.BufferAttribute(pp,3));
S.add(new THREE.Points(pg,new THREE.PointsMaterial({color:'#ffe3a0',size:0.025,transparent:true,opacity:0.8,blending:THREE.AdditiveBlending,depthWrite:false})));

/* ---------- işlik ---------- */
const LBL=[];
for(let i=0;i<10;i++)add(B(0.66,0.05,12),M(i%2?'#5e3a22':'#54331d'),OI-3+i*0.66,0,1);
add(B(6.5,3.6,0.15),M('#6e4a30'),OI,1.8,-4);add(B(0.15,3.6,12),M('#6e4a30'),OI-3.2,1.8,1);add(B(0.15,3.6,12),M('#6e4a30'),OI+3.2,1.8,1);
['deri','iplik','kumas','kereste','boya_kahve','balmumu'].forEach((k,i)=>{const o=MATS[k].mk();o.scale.setScalar(1.4);o.position.set(OI-2.4+i*0.95,2.22,-3.82);S.add(o)});
place('barrel',{x:OI-2.85,z:5.2,h:0.85});place('barrel',{x:OI-2.75,z:-2.0,h:0.7,ry:1});place('handsaw',{x:OI+2.72,y:0.82,z:-1.6,w:0.45,ry:0.4});place('desk',{x:OI+2.72,z:-1.75,w:1.15,ry:-Math.PI/2});add(Cy(0.3,0.26,0.7,10),M('#8a5530'),OI+2.75,0.35,5.3);
{const sk=add(new THREE.SphereGeometry(0.32,8,6),M('#cdbb94'),OI+2.75,0.26,-3.3);sk.scale.set(1,0.85,1)}
add(B(1.3,0.9,0.06),glow('#ffe6a8'),OI+1.6,2.9,-3.9).castShadow=false;
{const r=add(new THREE.PlaneGeometry(1.5,5.6),rugM,OI,0.035,-0.6);r.rotation.x=-Math.PI/2;r.rotation.z=Math.PI/2*0;r.castShadow=false;const t=add(new THREE.PlaneGeometry(6.2,0.42),ciniM,OI,0.75,-3.915);t.castShadow=false}
for(let i=0;i<6;i++)add(B(0.5,0.04,0.3),M('#7a4a2a'),OI-2.4+i*0.95,2.2,-3.85);
function mkFici(g){put(g,Cy(0.42,0.36,0.85,12),M('#8a5530'),0,0.425,0);[0.15,0.7].forEach(y=>{const t=put(g,new THREE.TorusGeometry(0.405,0.02,4,16),M('#3a3a3a',0.4),0,y,0);t.rotation.x=Math.PI/2});
put(g,Cy(0.39,0.39,0.02,12),M('#4a2e14',0.3),0,0.82,0);const h=flat(hideShape(0.18),0.01,'#b98a62');h.position.set(0.25,0.86,0.1);h.rotation.z=0.4;g.add(h)}
function mkCikrik(g){put(g,B(0.9,0.08,0.35),M('#7a4a2a'),0,0.3,0);[-0.35,0.35].forEach(x=>put(g,B(0.06,0.3,0.06),M('#5a3519'),x,0.12,0));
put(g,B(0.06,0.6,0.06),M('#5a3519'),-0.2,0.6,0);const w=put(g,new THREE.TorusGeometry(0.32,0.025,5,20),M('#8a5530'),-0.2,0.9,0.05);
for(let i=0;i<4;i++){const s=put(g,B(0.62,0.02,0.02),M('#8a5530'),-0.2,0.9,0.05);s.rotation.z=i*Math.PI/4}g.userData.wheel=w;
put(g,Cy(0.04,0.04,0.12,8),M('#efe3c8'),0.3,0.45,0);put(g,B(0.04,0.2,0.04),M('#5a3519'),0.3,0.38,0)}
function mkKazan(g){for(let i=0;i<8;i++){const a=i/8*Math.PI*2;put(g,new THREE.DodecahedronGeometry(0.1),M('#7d786e'),Math.cos(a)*0.42,0.07,Math.sin(a)*0.42)}
put(g,new THREE.ConeGeometry(0.2,0.3,6),glow('#ff8a2e'),0,0.18,0);const c=mesh(new THREE.SphereGeometry(0.42,12,8,0,Math.PI*2,Math.PI/2,Math.PI/2),M('#2b2b2b',0.5));c.material.side=THREE.DoubleSide;c.position.y=0.72;g.add(c);
g.userData.liq=put(g,Cy(0.4,0.4,0.02,12),M('#7a3a6a',0.2),0,0.68,0);const rim=put(g,new THREE.TorusGeometry(0.42,0.025,4,16),M('#3a3a3a',0.5),0,0.72,0);rim.rotation.x=Math.PI/2}
function mkPres(g){put(g,B(0.8,0.12,0.5),M('#5a3519'),0,0.06,0);[-0.33,0.33].forEach(x=>put(g,B(0.08,1.0,0.08),M('#5a3519'),x,0.55,0));put(g,B(0.8,0.12,0.14),M('#5a3519'),0,1.05,0);
put(g,Cy(0.035,0.035,0.5,8),M('#8a8a90',0.4),0,0.8,0);put(g,B(0.55,0.06,0.35),M('#6a6a70',0.4),0,0.5,0);put(g,B(0.5,0.02,0.04),M('#8a8a90',0.4),0,1.15,0)}
function mkOrs(g){put(g,B(0.6,0.5,0.5),M('#5a4a40'),-0.15,0.25,-0.1);put(g,B(0.45,0.06,0.35),glow('#ff6a20'),-0.15,0.51,-0.1);
put(g,Cy(0.1,0.13,0.35,6),M('#3a3a3a'),0.38,0.18,0.15);const a=put(g,B(0.32,0.12,0.14),M('#4a4a50',0.35),0.38,0.41,0.15);const cn=put(g,new THREE.ConeGeometry(0.06,0.14,4),M('#4a4a50',0.35),0.6,0.41,0.15);cn.rotation.z=-Math.PI/2;const old=g.children.slice(-3);glb('m_anvil',()=>{old.forEach(o=>o.visible=false);place('m_anvil',{par:g,x:0.4,z:0.15,h:0.46,ry:Math.PI/2})});place('m_bellow',{par:g,x:-0.62,y:0,z:0.1,h:0.42,ry:0.6});place('m_bucket',{par:g,x:0.05,z:0.32,h:0.26})}
function mkTestere(g){put(g,B(0.9,0.08,0.55),M('#8a5530'),0,0.55,0);[[-0.38,-0.22],[0.38,-0.22],[-0.38,0.22],[0.38,0.22]].forEach(p=>put(g,B(0.06,0.55,0.06),M('#5a3519'),p[0],0.27,p[1]));
const bl=put(g,Cy(0.2,0.2,0.012,16),M('#c0c4c8',0.3),0.05,0.62,0);bl.rotation.x=Math.PI/2;g.userData.wheel=bl;const lg=put(g,Cy(0.08,0.08,0.5,8),M('#6b4528'),-0.2,0.67,0);lg.rotation.z=Math.PI/2}
const HID=new THREE.MeshBasicMaterial({visible:false});
function mkCark(g){put(g,B(0.7,0.42,0.6),M('#7a4a2a'),0,0.21,0.05);const w=new THREE.Group();w.position.set(0,0.45,0);g.add(w);put(w,Cy(0.28,0.28,0.05,20),M('#8a5530'),0,0,0);put(w,Cy(0.1,0.12,0.12,12),M('#b8653a',0.7),0,0.08,0);put(w,B(0.04,0.02,0.2),M('#5a3519'),0.18,0.03,0);g.userData.wheel=w;put(g,B(0.5,0.05,0.3),M('#6b4528'),0,0.08,0.42)}
function mkDokuma(g){[[-0.42,-0.25],[0.42,-0.25],[-0.42,0.25],[0.42,0.25]].forEach(q=>put(g,B(0.07,0.95,0.07),M('#5a3519'),q[0],0.47,q[1]));[[0.9,-0.25],[0.55,0.25]].forEach(q=>put(g,B(0.9,0.07,0.07),M('#7a4a2a'),0,q[0],q[1]));put(g,B(0.8,0.02,0.5),M('#d9c8a0'),0,0.56,0);for(let i=0;i<9;i++)put(g,B(0.012,0.4,0.012),M('#b09a5a'),-0.36+i*0.09,0.75,-0.25);put(g,Cy(0.04,0.04,0.86,8),M('#8a5530'),0,0.56,0.3).rotation.z=Math.PI/2;put(g,B(0.86,0.06,0.04),M('#a8743e'),0,0.62,0.0)}
const RTM={hceviz:90,palmyag:150,kurum:120,cehri:60,balik:90,palamut:90,yag:300,koza:600,bal:600,balmumu:300,kum:10,tas:15,sogut:30,lavanta:45,kil:45,tuy:60,kutuk:90,sut:120,yun:300,atkili:600,boynuz:1800};const STX={fici:9,cikrik:4,kazan:4,dokuma:5,cark:4};
const fmtT=sec=>{sec=Math.max(0,Math.ceil(sec));if(sec<60)return sec+' sn';if(sec<3600)return Math.floor(sec/60)+' dk'+(sec%60?' '+sec%60+' sn':'');const h=Math.floor(sec/3600);return h+' sa '+Math.floor(sec%3600/60)+' dk'};
const ST=[
{id:'fici',ad:'Tabaklama fıçısı',tier:1,mk:mkFici,rec:[{in:{hamderi:1},out:{deri:1},s:20}]},
{id:'cikrik',ad:'Çıkrık',tier:1,mk:mkCikrik,rec:[{in:{pamuk:2},out:{iplik:1},s:10},{in:{yun:1},out:{iplik:1},s:8},{in:{iplik:2},out:{kumas:1},s:15,tier:2},{in:{keten:2},out:{kumas:1},s:12,tier:2},{in:{koza:2},out:{ipek:1},s:15,tier:2}]},
{id:'kazan',ad:'Boya kazanı',tier:1,mk:mkKazan,rec:[{in:{ceviz:2},out:{boya_kahve:1},s:12},{in:{kokboya:2},out:{boya_kirmizi:1},s:12},{in:{civit:2},out:{boya_lacivert:1},s:12},{in:{papatya:2},out:{boya_sari:1},s:12},{in:{bogurtlen:2},out:{boya_mor:1},s:12},{in:{cehri:2},out:{boya_sari:1},s:12},{in:{balik:2},out:{tutkal:1},s:10},{in:{hceviz:1},out:{hsut:1,hkabuk:1},s:10},{in:{palamut:2},out:{boya_kahve:1},s:12},{in:{kurum:1},out:{boya_siyah:1},s:8},{in:{recine:2},out:{tutkal:1},s:8},{in:{kum:3},out:{cam:1},s:15,tier:2}]},
{id:'pres',ad:'Kalıp presi',tier:1,mk:mkPres,rec:[{in:{kaucuk:1},out:{taban:2},s:10}]},
{id:'ors',ad:'Ocak ve örs',tier:2,mk:mkOrs,rec:[{in:{pirinc:1},out:{toka:2},s:12},{in:{demir:1,kurum:1},out:{celik:1},s:20,tier:3}]},
{id:'testere',ad:'Testere tezgahı',tier:3,mk:mkTestere,rec:[{in:{kutuk:1},out:{kereste:2},s:8}]},
{id:'cark',ad:'Çömlekçi çarkı',tier:1,mk:mkCark,rec:[{in:{kil:2},out:{camur:1},s:12}]},
{id:'dokuma',ad:'Dokuma tezgâhı',tier:1,mk:mkDokuma,rec:[{in:{sogut:3},out:{hasir:1},s:12},{in:{yun:2},out:{kumas:1},s:16},{in:{yun:3},out:{kece:1},s:20}]}];
ST.forEach(s=>s.rec.forEach(r=>{r.s=Math.round(r.s*(STX[s.id]||4))}));
const SP=[[-1.3,-3.1],[1.3,-3.1],[-1.3,-0.8],[1.3,-0.8],[-1.3,1.5],[1.3,1.5],[-1.3,3.8],[1.3,3.8]];
ST.forEach((s,i)=>{const g=new THREE.Group(),m=new THREE.Group(),x=OI+SP[i][0],z=SP[i][1];s.mk(m);m.scale.setScalar(0.88);if(s.id==='testere')place('wb_big',{par:m,swap:1,w:1.05,ry:Math.PI});m.position.y=0.06;g.add(m);s.m=m;s.wheel=m.userData.wheel;s.liq=m.userData.liq;
s.base=put(g,Cy(0.72,0.75,0.06,28),M('#6e4a2c'),0,0.03,0);const h=new THREE.Mesh(Cy(0.95,0.95,1.7,12),HID);h.position.y=0.85;g.add(h);
g.position.set(x,0,z);g.userData.st=s;S.add(g);s.g=g;s.jobs=[];s.lvl=1;s.ready=null;s.lbl=label('islik',V(x,0.08,z+0.78),null,true);s.lbl.el.classList.add('stl','sm');s.lbl.el.onclick=()=>stationTap(s)});

/* ---------- bahçe ---------- */
function mkSut(){const g=new THREE.Group();put(g,Cy(0.1,0.08,0.18,10),M('#a9afb5',0.35),0,0.09,0);put(g,Cy(0.092,0.092,0.012,10),M('#fbf8f0'),0,0.176,0);const h=put(g,new THREE.TorusGeometry(0.09,0.008,4,12,Math.PI),M('#6f757a',0.35),0,0.18,0);return g}
function mkTuy(){const g=new THREE.Group();[[0,0,0],[0.06,0.01,0.03],[-0.05,0.02,-0.02]].forEach((p,i)=>{const f=put(g,new THREE.ConeGeometry(0.035,0.2,5),M(i?'#f3eee4':'#d9c3a0'),p[0],0.02+p[1],p[2]);f.scale.z=0.3;f.rotation.set(Math.PI/2,0,0.5+i*0.9);put(g,Cy(0.003,0.003,0.08,3),M('#c9b48c'),p[0],0.02+p[1],p[2]).rotation.set(Math.PI/2,0,0.5+i*0.9)});return g}
function mkKil(){const g=new THREE.Group();for(let i=0;i<7;i++){const h=put(g,Cy(0.006,0.006,0.26,3),M(i%2?'#3b2a1e':'#4a3526'),(i-3)*0.008,0.02,(i%3)*0.008);h.rotation.set(Math.PI/2,0,0.05*(i-3))}put(g,Cy(0.03,0.03,0.03,8),M('#b5533c'),0,0.02,0).rotation.x=Math.PI/2;return g}
function mkBoynuz(){const g=new THREE.Group(),c=M('#dccbaa');const a=put(g,Cy(0.012,0.02,0.3,5),c,0,0.03,0);a.rotation.z=Math.PI/2;[[-0.06,0.6],[0.03,0.75],[0.1,0.5]].forEach(q=>{const t=put(g,Cy(0.007,0.011,0.12,4),c,q[0],0.07,0);t.rotation.z=-q[1]});return g}
function mkTas(){const g=new THREE.Group();[[0,0.06,0,0.075,'#8d8a84'],[0.08,0.04,0.04,0.05,'#a09c94'],[-0.07,0.04,0.03,0.055,'#7d7a74']].forEach(q=>put(g,new THREE.DodecahedronGeometry(q[3]),M(q[4]),q[0],q[1],q[2]));if(window.__zd)place('m_rocks',{par:g,swap:1,w:0.24});return g}
function mkCamur(){const g=new THREE.Group();[[0,0.05,0,0.07],[0.07,0.035,0.04,0.05]].forEach(q=>{const b=put(g,new THREE.SphereGeometry(q[3],8,6),M('#b8653a',0.7),q[0],q[1],q[2]);b.scale.y=0.7});return g}
function mkKum(){const g=new THREE.Group();put(g,new THREE.ConeGeometry(0.13,0.1,9),M('#e2cf9a'),0,0.05,0);put(g,new THREE.ConeGeometry(0.07,0.06,7),M('#d8c48c'),0.09,0.03,0.05);return g}
function mkSogut(){const g=new THREE.Group();for(let i=0;i<5;i++){const b=put(g,Cy(0.005,0.008,0.32,4),M(i%2?'#8a7a3a':'#7a8a3a'),(i-2)*0.012,0.02,0);b.rotation.set(Math.PI/2,0,(i-2)*0.06)}for(let i=0;i<4;i++){const l=put(g,new THREE.SphereGeometry(0.025,5,4),M('#7fa04a'),-0.1+i*0.07,0.03,0.02*(i%2));l.scale.set(1.6,0.3,0.6)}return g}
function mkLav(){const g=new THREE.Group();for(let i=0;i<3;i++){const x=(i-1)*0.035;put(g,Cy(0.005,0.005,0.2,3),M('#6f8a4a'),x,0.1,0).rotation.z=(i-1)*0.15;for(let j=0;j<4;j++)put(g,new THREE.SphereGeometry(0.016,5,4),M('#8a6bc0'),x+(i-1)*0.015*j/4,0.17+j*0.025,0)}return g}
function quad(par,body,dark,s,horn){const g=new THREE.Group();par.add(g);[[-0.16,-0.28],[0.16,-0.28],[-0.16,0.28],[0.16,0.28]].forEach(p=>put(g,Cy(0.045,0.04,0.42,5),M(dark),p[0]*s,0.21*s,p[1]*s).scale.set(s,s,s));
 put(g,B(0.42*s,0.36*s,0.8*s),M(body),0,0.58*s,0);put(g,B(0.24*s,0.26*s,0.32*s),M(body),0,0.78*s,0.5*s);put(g,B(0.2*s,0.12*s,0.06*s),M(dark),0,0.72*s,0.67*s);if(horn)[-1,1].forEach(k=>put(g,new THREE.ConeGeometry(0.025*s,0.12*s,4),M('#e8dcc0'),k*0.1*s,0.95*s,0.48*s));return g}
function animal(n,o,fb){const g=new THREE.Group();g.position.set(o.x,0,o.z);g.rotation.y=o.ry||0;S.add(g);ANIMS.push(g);fb(g);place(n,{par:g,swap:1,h:o.h,anim:o.anim,cb:o.cb});return g}
function petTap(e){const d=PETS[0];sfx.tap();tone(430,0.09,'sawtooth',0.05,250);tone(450,0.1,'sawtooth',0.05,260,0.17);const y0=d.position.y;tween(0.45,k=>d.position.y=y0+Math.sin(k*Math.PI)*0.25,()=>d.position.y=y0);
 if(tt>(G.dogT||0)){G.dogT=tt+90;const k=pick(['tas','kil','sogut','tuy','kum','boynuz']);G.inv[k]++;floatTxt(e.clientX,e.clientY,img(k)+'+1');toast('Paşa bir şey getirdi: '+MATS[k].ad,1600);refresh()}else toast('Hav hav! Paşa oynamak istiyor',1200)}
function ZONES(){
 /* ---- Çiftlik ---- */
 fence(FX-3.7,-4.6,FX+3.7,-4.6);fence(FX-3.7,-4.6,FX-3.7,5.8);fence(FX+3.7,-4.6,FX+3.7,5.8);
 const CX=[-1.85,0,1.85],ZR=[-1.5,1.0,3.5],H2=Math.PI/2;
 const pen=(x,z,gc)=>{const w=1.62,d=1.3;add(B(w,0.02,d),M(gc||'#c8ad72'),x,0.011,z).castShadow=false;const P=M('#8a6a44'),Rl=M('#9a7a52');[[-1,-1],[1,-1],[-1,1],[1,1],[0,-1]].forEach(q=>add(B(0.07,0.36,0.07),P,x+q[0]*w/2,0.18,z+q[1]*d/2));
  [0.13,0.29].forEach(y=>{[-1,1].forEach(s=>{add(B(w,0.035,0.03),Rl,x,y,z+s*d/2);add(B(0.03,0.035,d),Rl,x+s*w/2,y,z)})})};
 // arka sıra: ahır, silo, araba
 {const g=new THREE.Group();g.position.set(FX,0,-3.4);S.add(g);put(g,B(2.6,1.3,1.2),M('#a8432f'),0,0.65,0);const r=put(g,new THREE.CylinderGeometry(0.01,1.55,0.8,4,1),M('#5a3a2a'),0,1.7,0);r.rotation.y=Math.PI/4;r.scale.z=0.55;put(g,B(0.7,0.9,0.05),M('#f0e6d0'),0,0.45,0.61);place('farm',{par:g,swap:1,w:3.4})}
 for(let i=0;i<9;i++)pine(FX-5+i*1.25,-5.9-(i%2)*0.7,1.1+(i%3)*0.2);
 [[-1.8,-2.6],[-2.25,-2.45],[1.85,-2.6]].forEach((q,i)=>{const h=add(Cy(0.26,0.26,0.46,10),M('#d8b45a'),FX+q[0],0.26,q[1]);h.rotation.z=Math.PI/2;h.rotation.y=i*0.6});
 place('silo',{x:FX-2.9,z:-3.5,h:2.6});place('wagon',{x:FX+2.8,z:-3.4,w:1.3,ry:-1.2});
 // 1. sıra: inek · koyun · domuz
 {const x=FX+CX[0],z=ZR[0];pen(x,z);animal('cow2',{x:x-0.05,z:z-0.1,h:0.78,ry:H2,anim:'eat'},g=>quad(g,'#f2efe8','#3a2f28',1,1));for(let i=0;i<2;i++)cl('sut',mkSut(),x+0.45+i*0.25,0,z+0.42,0.2,60);patch('İnek',x,z+0.2)}
 {const x=FX+CX[1],z=ZR[0];pen(x,z,'#b9c27a');sheep(x-0.45,z-0.1,1);sheep(x+0.45,z-0.15,-1);patch('Koyun',x,z+0.2)}
 {const x=FX+CX[2],z=ZR[0];pen(x,z,'#8a6a44');add(Cy(0.55,0.5,0.02,12),M('#6a4a2e'),x-0.3,0.025,z-0.1).castShadow=false;
  animal('pig',{x:x-0.3,z:z-0.1,h:0.42,ry:0.6},g=>{put(g,new THREE.SphereGeometry(0.2,10,8),M('#e8a8a0'),0,0.22,0).scale.set(1,0.85,1.4);put(g,Cy(0.06,0.06,0.04,8),M('#d08880'),0,0.24,0.3).rotation.x=Math.PI/2});
  {const j=new THREE.Group();put(j,Cy(0.06,0.07,0.1,10),M('#e8dcc0',0.4),0,0.05,0);put(j,Cy(0.065,0.065,0.015,10),M('#8a5a3a'),0,0.105,0);[0,1].forEach(i=>{const k=j.clone();cl('yag',k,x+0.45+i*0.3,0,z+0.35,0.15,300)})}patch('Domuz',x,z+0.2)}
 // 2. sıra: tavuk · at · keçi
 {const x=FX+CX[0],z=ZR[1];pen(x,z);{const g=new THREE.Group();g.position.set(x-0.5,0,z-0.3);S.add(g);put(g,B(0.7,0.5,0.55),M('#b58a55'),0,0.35,0);[0.25,-0.25].forEach(q=>put(g,B(0.08,0.12,0.08),M('#6b4a2b'),0,0.06,q));const r=put(g,B(0.82,0.06,0.42),M('#7a4a30'),0,0.68,-0.14);r.rotation.x=0.5;const r2=put(g,B(0.82,0.06,0.42),M('#7a4a30'),0,0.68,0.14);r2.rotation.x=-0.5;put(g,B(0.2,0.2,0.02),M('#2a1c10'),0,0.38,0.28)}
  [[0.25,-0.3,0.4],[0.6,0.0,-1],[0.15,0.15,2.2]].forEach(q=>{const g=animal('hen',{x:x+q[0],z:z+q[1],h:0.3,ry:q[2]},g=>{put(g,new THREE.SphereGeometry(0.1,8,6),M('#f3eee4'),0,0.13,0).scale.set(1,0.9,1.25);put(g,new THREE.SphereGeometry(0.055,8,6),M('#f3eee4'),0,0.24,0.08);put(g,new THREE.ConeGeometry(0.018,0.05,4),M('#e0a030'),0,0.24,0.15).rotation.x=Math.PI/2;put(g,B(0.02,0.04,0.05),M('#c0392b'),0,0.3,0.08)});BOB.push({o:g,sp:2.2+q[0],ph:q[1]*3,r0:q[2]})});
  for(let i=0;i<3;i++){const t=mkTuy();t.scale.setScalar(1.3);cl('tuy',t,x-0.55+i*0.45,0,z+0.45-(i%2)*0.08,0.18,35)}patch('Tavuk',x,z+0.2)}
 {const x=FX+CX[1],z=ZR[1];pen(x,z,'#b9c27a');animal('horse',{x:x-0.05,z:z-0.1,h:0.95,ry:H2,anim:'idle'},g=>quad(g,'#8a5a36','#3b2a1e',1.15));
  cl('atkili',(()=>{const k=mkKil();k.scale.setScalar(1.6);return k})(),x+0.65,0.02,z+0.4,0.2,70);patch('At',x,z+0.2)}
 {const x=FX+CX[2],z=ZR[1];pen(x,z);const gt=animal('goat',{x:x-0.3,z:z-0.1,h:0.75,ry:0.9},g=>quad(g,'#e8e2d4','#6a5a4a',0.65,1));BOB.push({o:gt,sp:0.6,ph:1,r0:0.9});for(let i=0;i<2;i++)cl('sut',mkSut(),x+0.4+i*0.32,0,z+0.4,0.2,60);patch('Keçi',x,z+0.2)}
 // 3. sıra: tavşan · ipek böceği · Paşa
 {const x=FX+CX[0],z=ZR[2];pen(x,z,'#b9c27a');const hu=new THREE.Group();hu.position.set(x-0.45,0,z-0.35);S.add(hu);put(hu,B(0.8,0.4,0.5),M('#9a6a3a'),0,0.3,0);put(hu,B(0.9,0.05,0.6),M('#6b4528'),0,0.52,0);put(hu,B(0.6,0.25,0.02),M('#c8c8c0'),0,0.32,0.26);
  [-1,1].forEach((k,i)=>{const r=animal('rabbit',{x:x+0.3+i*0.35,z:z-0.15+i*0.25,h:0.26,ry:k*0.7},g=>{put(g,new THREE.SphereGeometry(0.09,8,6),M('#efe8dc'),0,0.09,0).scale.set(1,0.9,1.3);[-0.03,0.03].forEach(q=>put(g,B(0.02,0.1,0.03),M('#efe8dc'),q,0.2,0.08))});BOB.push({o:r,sp:3+i,ph:i*2,r0:k*0.7})});
  for(let i=0;i<2;i++){const w=MATS.yun.mk();w.scale.setScalar(1.1);cl('yun',w,x-0.55+i*0.4,0,z+0.4,0.18,50)}patch('Tavşan',x,z+0.2)}
 {const x=FX+CX[1],z=ZR[2];pen(x,z,'#9cbf6a');const tg=new THREE.Group();tg.position.set(x-0.35,0,z-0.25);S.add(tg);put(tg,Cy(0.07,0.1,0.7,7),M('#6b4a2e'),0,0.35,0);[[0,0.85,0,0.38],[0.22,0.7,0.1,0.26],[-0.2,0.72,-0.08,0.27]].forEach(q=>put(tg,new THREE.IcosahedronGeometry(q[3],0),M('#4f7a3a'),q[0],q[1],q[2]));{const old=tg.children.slice(0,4);glb('m_mulberry',()=>{old.forEach(o=>o.visible=false);place('m_mulberry',{par:tg,h:0.95,ry:0.4})})}
  for(let i=0;i<6;i++)put(tg,new THREE.SphereGeometry(0.03,6,5),M('#3a1e3a'),Math.cos(i)*0.28,0.6+Math.sin(i*2)*0.12,Math.sin(i)*0.28);put(tg,B(0.6,0.06,0.3),M('#a0805a'),0.55,0.03,0.3);
  for(let i=0;i<3;i++){const g=new THREE.Group();[[0,0],[0.05,0.03],[-0.04,0.03]].forEach(q=>{const m=put(g,new THREE.SphereGeometry(0.035,8,6),M('#f6f0dc',1),q[0],0.08,q[1]);m.scale.set(1,0.8,1.6)});cl('koza',g,x+0.25+i*0.24,0,z+0.42,0.16,600)}patch('İpek böceği',x,z+0.2)}
 {const x=FX+CX[2],z=ZR[2];pen(x,z,'#b9c27a');const kh=new THREE.Group();kh.position.set(x-0.55,0,z-0.2);kh.rotation.y=H2;S.add(kh);put(kh,B(0.6,0.42,0.7),M('#9a6a3a'),0,0.21,0);const r1=put(kh,B(0.42,0.04,0.78),M('#7a3a28'),-0.15,0.5,0);r1.rotation.z=0.75;const r2=put(kh,B(0.42,0.04,0.78),M('#7a3a28'),0.15,0.5,0);r2.rotation.z=-0.75;put(kh,new THREE.CylinderGeometry(0.3,0.3,0.6,3),M('#9a6a3a'),0,0.42,0).rotation.set(Math.PI/2,0,Math.PI/2);put(kh,B(0.24,0.28,0.02),M('#2a1c10'),0,0.16,0.355);put(kh,B(0.2,0.05,0.02),M('#e8dcc0'),0,0.5,0.37);
  const d=animal('husky',{x:x+0.35,z:z,h:0.62,ry:-0.7,anim:'idle'},g=>quad(g,'#9aa0a8','#4a4f55',0.55));const hh=new THREE.Mesh(new THREE.SphereGeometry(0.4,6,5),HID);hh.position.y=0.3;d.add(hh);PETS.push(d);patch('Paşa',x,z+0.2)}
 /* ---- Orman ---- */
 const clr=(x,z,gc)=>{add(B(1.76,0.05,1.44),M('#7a5a3a'),x,0.025,z).castShadow=false;add(B(1.62,0.06,1.3),M(gc),x,0.03,z).castShadow=false};const OZ=[-1.6,1.0];
 [[-3.2,-4.6,1.4],[-2,-5.1,1.6],[-0.6,-5.4,1.3],[0.9,-5.2,1.5],[2.3,-5.0,1.4],[3.4,-4.3,1.2],[-3.6,-2.6,1.1],[3.6,-2.4,1.0],[-3.7,0.4,1.0],[3.7,0.6,1.1]].forEach(q=>pine(FO+q[0],q[1],q[2]));
 place('hut',{x:FO-2.5,z:-3.4,w:2.0,ry:0.4});place('logs',{x:FO-1.2,z:-3.0,w:1.1,ry:1.4});place('m_mine',{x:FO+0.2,z:-3.5,h:1.25,ry:0.3});
 [[1.3,-3.6,0.55,'#8d8a84'],[2.0,-3.3,0.7,'#7d7a74'],[2.8,-3.6,0.6,'#85827c']].forEach(q=>{const r=add(new THREE.DodecahedronGeometry(q[2],0),M(q[3]),FO+q[0],q[2]*0.55,q[1]);r.rotation.set(q[0],q[1],0)});
 // 1. sıra: oduncu · taş ocağı · kum
 {const x=FO+CX[0],z=OZ[0];clr(x,z,'#a8865a');place('wb_grind',{x:x-0.55,z:z-0.35,h:0.7,ry:0});{add(Cy(0.2,0.23,0.28,10),M('#7a5230'),x+0.55,0.17,z-0.3);const ax=new THREE.Group();ax.position.set(x+0.55,0.31,z-0.3);S.add(ax);place('axe',{par:ax,h:0.5,rz:0.4})}
  for(let i=0;i<3;i++){const g=new THREE.Group();const l=put(g,Cy(0.09,0.1,0.55,8),M('#6b4528'),0,0.1,0);l.rotation.z=Math.PI/2;place('woodlog',{par:g,swap:1,w:0.55,ry:i*0.3});cl('kutuk',g,x-0.6+i*0.6,0.03,z+0.4,0.3,60)}patch('Oduncu kulübesi',x,z+0.2)}
 {const x=FO+CX[1],z=OZ[0];clr(x,z,'#a8a49a');[[-0.55,-0.35,0.36,'#8d8a84'],[0.1,-0.4,0.42,'#7d7a74'],[0.65,-0.3,0.32,'#9a968c']].forEach(q=>{const r=add(new THREE.DodecahedronGeometry(q[2],0),M(q[3]),x+q[0],q[2]*0.55,z+q[1]);r.rotation.set(q[0]*3,q[1]*3,0)});
  for(let i=0;i<3;i++)cl('tas',mkTas(),x-0.5+i*0.5,0.03,z+0.4,0.17,45);patch('Taş ocağı',x,z+0.2)}
 {const x=FO+CX[2],z=OZ[0];clr(x,z,'#d8c48c');add(new THREE.ConeGeometry(0.6,0.38,10),M('#e2cf9a'),x-0.3,0.22,z-0.2);for(let i=0;i<2;i++){const k=mkKum();k.scale.setScalar(1.3);cl('kum',k,x+0.35+i*0.38,0.03,z+0.35,0.18,40)}patch('Kum',x,z+0.2)}
 // 2. sıra: kil çukuru · gölet+söğüt · geyik
 {const x=FO+CX[0],z=OZ[1];clr(x,z,'#9a7050');add(Cy(0.6,0.5,0.04,12),M('#7a4a2c'),x,0.05,z-0.15).castShadow=false;add(Cy(0.48,0.48,0.01,12),M('#9a5a34'),x,0.075,z-0.15).castShadow=false;
  for(let i=0;i<3;i++){const k=mkCamur();k.scale.setScalar(1.25);cl('kil',k,x-0.4+i*0.4,0.06,z+0.4,0.17,45)}patch('Kil çukuru',x,z+0.2)}
 {const x=FO+CX[1],z=OZ[1];clr(x,z,'#8ab060');add(Cy(0.42,0.42,0.02,18),M('#4f86ad',0.1),x-0.1,0.066,z-0.15).castShadow=false;place('m_pondP',{x:x-0.1,z:z-0.15,w:1.05,y:0.05});RIP.push({x:x-0.1,z:z-0.15,r:0.32,y:0.08});
  {const tx=x+0.5,tz=z-0.38,WG=new THREE.Group();WG.position.set(tx,0,tz);S.add(WG);const add=(g,m,ax,ay,az)=>put(WG,g,m,ax-tx,ay,az-tz);add(Cy(0.1,0.14,1.1,7),M('#6a5236'),tx,0.6,tz);for(let i=0;i<12;i++){const a=i/12*Math.PI*2,r=0.28+(i%3)*0.1;const b=add(new THREE.ConeGeometry(0.09,0.75,4),M(i%2?'#7fa04a':'#6c9040'),tx+Math.cos(a)*r,1.0,tz+Math.sin(a)*r);b.rotation.x=Math.PI;b.rotation.z=Math.cos(a)*0.2}add(new THREE.IcosahedronGeometry(0.45,0),M('#7a9a48'),tx,1.42,tz);place('m_willow',{par:WG,swap:1,h:1.55,ry:0.6})}
  for(let i=0;i<3;i++){const g=cl('sogut',mkSogut(),x-0.45+i*0.42,0.06,z+0.45,0.18,40);place('m_branch',{par:g,swap:1,w:0.32,rx:Math.PI/2,ry:i*0.8+0.3})}patch('Söğüt',x,z+0.2)}
 {const x=FO+CX[2],z=OZ[1];clr(x,z,'#9cbf6a');animal('deer',{x:x-0.1,z:z-0.12,h:0.88,ry:H2,anim:'eat'},g=>quad(g,'#a86a3a','#5a3a22',0.9,1));
  {const b=mkBoynuz();b.scale.setScalar(1.5);cl('boynuz',b,x+0.6,0.03,z+0.4,0.22,120)}patch('Geyik',x,z+0.2)}
 // 3. sıra: kömür ocağı · ahududu · ceviz korusu
 {const x=FO+CX[0],z=3.6;clr(x,z,'#6a5a4a');const mo=add(new THREE.SphereGeometry(0.42,10,6,0,Math.PI*2,0,Math.PI/2),M('#5a4636'),x-0.2,0.05,z-0.15);mo.scale.y=0.8;add(Cy(0.06,0.08,0.18,8),M('#3a3430'),x-0.2,0.42,z-0.15);
  SMOKE.push(V(x-0.2,0.55,z-0.15));for(let i=0;i<3;i++){const k=new THREE.Group();[[0,0],[0.06,0.03],[-0.05,0.04]].forEach(q=>put(k,new THREE.DodecahedronGeometry(0.035),M('#1c1a18',0.9),q[0],0.03,q[1]));cl('kurum',k,x-0.45+i*0.4,0.06,z+0.42,0.18,120);place('m_coal',{par:k,swap:1,w:0.13})}patch('Kömür ocağı',x,z+0.2)}
 {const x=FO+CX[1],z=3.6;clr(x,z,'#7a9a50');place('m_pondJ',{x,z:z-0.02,w:1.22,y:0.035});RIP.push({x:x-0.02,z:z-0.07,r:0.26,y:0.075});
  for(let i=0;i<3;i++){const f=new THREE.Group();f.position.set(x,0.062,z-0.07);S.add(f);const b=put(f,new THREE.SphereGeometry(0.05,8,6),M('#8a9aa8',0.4),0,0,0);b.scale.set(0.5,0.35,1.4);place('m_fish',{par:f,swap:1,w:0.13});FISH.push({g:f,cx:x-0.03,cz:z-0.08,r:0.08+i*0.06,sp:0.6+i*0.25,ph:i*2.1})}
  for(let i=0;i<3;i++){const k=new THREE.Group();const b=put(k,new THREE.SphereGeometry(0.045,8,6),M('#8a9aa8',0.4),0,0.03,0);b.scale.set(0.5,0.35,1.4);k.rotation.y=i*0.9+0.4;cl('balik',k,x-0.5+i*0.5,0.06,z+0.45,0.16,90);place('m_fish',{par:k,swap:1,w:0.16})}patch('Balık gölü',x,z+0.2)}
 {const x=FO+CX[2],z=3.6;clr(x,z,'#d8c48c');const tg=new THREE.Group();tg.position.set(x-0.3,0,z-0.25);S.add(tg);let px=0,py=0;for(let k=0;k<9;k++){const seg=put(tg,Cy(0.07-k*0.004,0.08-k*0.004,0.17,7),M(k%2?'#8a6a44':'#7a5a38'),px,py+0.085,0);seg.rotation.z=-0.04*k;px+=Math.sin(0.04*k)*0.17;py+=0.165}
  for(let k=0;k<8;k++){const a=k/8*Math.PI*2,lf=new THREE.Group();lf.position.set(px,py+0.02,0);lf.rotation.y=a;tg.add(lf);for(let m=0;m<5;m++){const b=put(lf,B(0.12,0.012,0.09),M(m%2?'#4f8a3a':'#5f9a44'),0.07+m*0.1,-m*m*0.012,0);b.rotation.z=-0.12*m}}
  [[0.06,0.06],[-0.06,0.05],[0,-0.07]].forEach(q=>put(tg,new THREE.SphereGeometry(0.055,8,6),M('#6b4a2b',0.8),px+q[0],py-0.05,q[1]));place('m_palm',{par:tg,swap:1,h:2.3,ry:0.4});
  for(let i=0;i<2;i++){const k=MATS.hceviz.mk();k.scale.setScalar(1.2);cl('hceviz',k,x+0.05+i*0.3,0.06,z+0.42,0.17,90);place('m_coco',{par:k,swap:1,w:0.2,ry:i*2})}{const k=MATS.palmyag.mk();cl('palmyag',k,x+0.65,0.06,z+0.3,0.17,150)}patch('Hindistan cevizi',x,z+0.2)}
 [[-3.3,2.4,1.0],[3.3,2.5,1.1],[-3.3,4.6,0.9],[3.3,4.7,1.0],[0,5.2,1.3]].forEach((q,i)=>place('m_flw',{x:FO+q[0],z:q[1],w:q[2],ry:i*1.3}));[[-3.4,-3.9],[-2.2,-4.4],[1.4,-4.6],[3.2,-3.8],[-3.6,1.2],[3.6,1.4],[-1.2,4.9],[1.5,5.0],[2.6,4.5]].forEach((q,i)=>place('m_cone',{x:FO+q[0],z:q[1],h:0.12,ry:i*1.9}));
 // kedi (dükkân) — dükkânda gezinir
 add(B(1.75,0.05,0.3),M('#6b4528'),1.19,1.305,-3.6);{const g=new THREE.Group();g.position.set(1.4,1.33,-3.55);g.rotation.y=-0.7;S.add(g);const b=put(g,new THREE.SphereGeometry(0.14,8,6),M('#d08a3a'),0,0.1,0);b.scale.set(1,0.7,1.4);put(g,new THREE.SphereGeometry(0.08,8,6),M('#d08a3a'),0,0.12,0.18);place('cat',{par:g,swap:1,h:0.32});CAT={g,q:[],w:4,k:0,surf:'s'}}
}

GRD=add(B(48,0.1,34),M('#86a852'),OB,-0.05,-5);GRD.castShadow=false;
[[-2.6,1.6,1.6],[2.2,-2.4,2],[0.6,3.4,1.5],[-1,-4,1.8]].forEach(c=>add(Cy(c[2],c[2],0.012,9),M('#92b45a'),OB+c[0],0.004,c[1]).castShadow=false);
function fence(x0,z0,x1,z1){const L=Math.hypot(x1-x0,z1-z0),n=Math.round(L/0.8);for(let i=0;i<=n;i++)add(B(0.08,0.62,0.08),M('#8a6a44'),x0+(x1-x0)*i/n,0.31,z0+(z1-z0)*i/n);
[0.22,0.47].forEach(y=>{const r=add(B(L,0.06,0.04),M('#9a7a52'),(x0+x1)/2,y,(z0+z1)/2);r.rotation.y=Math.atan2(-(z1-z0),x1-x0)})}
fence(OB-3.7,-4.6,OB+3.7,-4.6);fence(OB-3.7,-4.6,OB-3.7,5.8);fence(OB+3.7,-4.6,OB+3.7,5.8);
const TPAL=['#3f6a34','#4f7a3a','#5d8a3c','#2f5a36','#6b8a34','#7a9a3a','#8a7a30','#9a6a2a'];
function pine(x,z,k,v){const g=new THREE.Group();g.position.set(x,0,z);S.add(g);const hs=Math.abs(Math.sin(x*12.9898+z*78.233)*43758.5453)%1;if(v==null)v=hs<0.42?0:hs<0.6?1:hs<0.82?2:3;const lc=TPAL[Math.floor(hs*997)%TPAL.length],ry=(x*7+z*3)%6;
 const tint=w=>w.traverse(o=>{if(o.isMesh){o.material=o.material.clone();if(/Leaves|mat9/.test(o.material.name))o.material.color.set(lc)}});
 if(v===0){put(g,Cy(0.1*k,0.14*k,0.7*k,6),M('#5a3b22'),0,0.35*k,0);['#3f5f30','#4a6c36','#587a3e'].forEach((c,i)=>{const t=put(g,new THREE.ConeGeometry((0.75-i*0.17)*k,0.9*k,7),M(c),0,(0.95+i*0.5)*k,0);t.rotation.y=i});place('m_pine2',{par:g,swap:1,h:(2.3+hs*0.8)*k,ry,cb:w=>{if(hs>0.2)tint(w)}})}
 else if(v===1){put(g,Cy(0.1*k,0.14*k,0.7*k,6),M('#5a3b22'),0,0.35*k,0);put(g,new THREE.ConeGeometry(0.7*k,1.8*k,7),M(lc),0,1.4*k,0);place('pine',{par:g,swap:1,h:(1.9+hs*0.6)*k,ry})}
 else if(v===2){put(g,Cy(0.1*k,0.15*k,0.9*k,6),M('#6b4a2e'),0,0.45*k,0);put(g,new THREE.IcosahedronGeometry(0.75*k,0),M(lc),0,1.4*k,0);place('m_mulberry',{par:g,swap:1,h:(1.8+hs*0.7)*k,ry,cb:w=>tint(w)})}
 else{const tr=put(g,Cy(0.07*k,0.11*k,1.1*k,6),M(hs>0.9?'#e8e2d4':'#6b4a2e'),0,0.55*k,0);[[0,1.45,0,0.55],[0.3,1.15,0.15,0.4],[-0.28,1.2,-0.1,0.42]].forEach((q,i)=>{const b=put(g,new THREE.IcosahedronGeometry(q[3]*k,0),M(TPAL[(Math.floor(hs*31)+i)%TPAL.length]),q[0]*k,q[1]*k,q[2]*k);b.rotation.y=i})}}
for(let i=0;i<13;i++)pine(OB-6.6+i*1.1,-5.6-(i%3)*0.8,1.1+(i%4)*0.25);
for(let i=0;i<6;i++){pine(OB-4.7-(i%2)*0.9,-4+i*1.5,1+(i%3)*0.2);pine(OB+4.7+(i%2)*0.9,-4+i*1.5,1+((i+1)%3)*0.2)}
[[OB-6,-15,7],[OB+5,-16,8]].forEach(h=>add(new THREE.SphereGeometry(h[2],10,6),M('#9cc06a'),h[0],-3,h[1]).castShadow=false);
for(let i=0;i<46;i++){const t=add(new THREE.ConeGeometry(0.05,0.16,4),M(i%2?'#6f9440':'#7ea24a'),OB-3.4+Math.random()*6.8,0.08,-4.3+Math.random()*8);t.castShadow=false}
[[-3.2,-2.3],[3.1,-0.2],[-3.3,1.9],[2.9,3.2],[-1.6,3.5],[1.7,2.1],[-3,-4.1]].forEach((q,i)=>add(new THREE.DodecahedronGeometry(0.1+(i%3)*0.04),M('#9a968c'),OB+q[0],0.05,q[1]));
const bed=(x,z,w,d)=>{add(B(w+0.14,0.07,d+0.14),M('#8a6a44'),x,0.035,z);add(B(w,0.09,d),M('#6b4a30'),x,0.045,z)};
const COLL=[];
function coll(mat,obj,x,y,z,hr){obj.position.set(x,y,z);obj.add(new THREE.Mesh(new THREE.SphereGeometry(hr||0.2,6,5),HID));obj.userData.coll={mat,alive:true,t:0,base:obj.scale.clone()};S.add(obj);COLL.push(obj);return obj}
const PATCHES=[],ANIMS=[];const patch=(ad,x,z,h)=>{const o=label('bahce',V(x,0.02,z+0.5),ad,true);o.el.classList.add('sm');o.ad=ad;o.cx=x;o.cz=z;PATCHES.push(o);return o};
const FX=OB-11,FO=OB+11,PETS=[],BOB=[],SMOKE=[],FISH=[],RIP=[];let CAT=null;const CATP={f:[[-2.1,-2.6],[-2.2,-1.6],[0.3,-2.9],[1.2,-2.5],[2.2,-2.9],[2.0,-1.9],[0.9,-3.0],[1.6,0.4]],c:[[-0.9,1.5],[0.2,1.7],[1.0,1.5],[-0.4,1.85],[0.7,1.9]],s:[[0.55,-3.55],[1.2,-3.55],[1.85,-3.55]]},CATJ={c:[1.35,0.75],s:[1.45,-3.05]};
let cfT=0,smT=0;function collFx(dt){if(view!=='bahce')return;FISH.forEach(f=>{const a=tt*f.sp+f.ph;f.g.position.x=f.cx+Math.cos(a)*f.r;f.g.position.z=f.cz+Math.sin(a)*f.r*0.7;f.g.position.y=0.062+Math.sin(tt*3+f.ph)*0.006;f.g.rotation.y=-a+Math.PI;if(Math.random()<0.004){puff(V(f.g.position.x,0.1,f.g.position.z),2,'#d8eef8')}});RIP.forEach(r=>{if(!r.m){r.m=[0,1].map(i=>{const m=new THREE.Mesh(new THREE.RingGeometry(0.9,1,24),new THREE.MeshBasicMaterial({color:'#e8f6ff',transparent:true,opacity:0.5,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(r.x,r.y,r.z);S.add(m);return m})}r.m.forEach((m,i)=>{const k=((tt*0.35+i*0.5)%1);m.scale.setScalar(0.05+k*r.r);m.material.opacity=0.45*(1-k)})});cfT-=dt;smT-=dt;if(smT<=0){smT=0.45;SMOKE.forEach(v=>{if(Math.abs(v.x-camCur.l.x)<6)puff(V(v.x+(Math.random()-0.5)*0.05,v.y,v.z),1,'#9a948c')})}if(cfT>0)return;cfT=0.3;const L=COLL.filter(o=>o.visible&&o.userData.coll.alive&&Math.abs(o.position.x-camCur.l.x)<5);if(!L.length)return;const o=pick(L);puff(V(o.position.x+(Math.random()-0.5)*0.12,o.position.y+0.12,o.position.z+(Math.random()-0.5)*0.12),1,Math.random()<0.5?'#fff6c8':'#ffe08a')}
function catHop(b,dur,done){const c=CAT,g=c.g,a=g.position.clone();c.busy=1;tween(dur,k=>{g.position.lerpVectors(a,b,k);g.position.y+=Math.sin(k*Math.PI)*0.35},()=>{c.busy=0;done()})}
function catTick(dt){const c=CAT;if(!c)return;const g=c.g,HY={f:0,c:Y,s:1.33};
 if(c.surf==='c'&&(G.phase==='craft'||G.phase==='result')&&!c.busy){g.position.set(CATJ.c[0],0,CATJ.c[1]);c.surf='f';c.q=[];c.w=2}
 if(view!=='home'||c.busy)return;if(c.w>0){c.w-=dt;return}
 if(!c.q.length){const r=Math.random(),ts=G.phase==='craft'||G.phase==='result'?(r<0.6?'f':'s'):(r<0.35?'f':r<0.72?'c':'s'),tp=pick(CATP[ts]);
  if(ts===c.surf)c.q=[{t:'w',x:tp[0],z:tp[1]}];else{if(c.surf!=='f')c.q.push({t:'h',x:CATJ[c.surf][0],z:CATJ[c.surf][1],s:'f'});if(ts==='f')c.q.push({t:'w',x:tp[0],z:tp[1]});else c.q.push({t:'w',x:CATJ[ts][0],z:CATJ[ts][1]},{t:'h',x:tp[0],z:tp[1],s:ts})}}
 const a=c.q[0];if(a.t==='h'){c.q.shift();g.rotation.y=Math.atan2(a.x-g.position.x,a.z-g.position.z);catHop(V(a.x,HY[a.s],a.z),0.65,()=>{c.surf=a.s;g.position.y=HY[a.s];c.w=c.q.length?0.3:(a.s==='f'?2:5)+Math.random()*6});return}
 const dx=a.x-g.position.x,dz=a.z-g.position.z,d=Math.hypot(dx,dz),by=HY[c.surf];
 if(d<0.04){c.q.shift();g.position.y=by;c.w=c.q.length?0.2:(c.surf==='f'?2:4)+Math.random()*6;return}
 const st=Math.min(d,dt*0.5);g.position.x+=dx/d*st;g.position.z+=dz/d*st;let dr=Math.atan2(dx,dz)-g.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));g.rotation.y+=dr*Math.min(1,dt*6);c.k+=dt*10;g.position.y=by+Math.abs(Math.sin(c.k))*0.018}function cl(m,o,x,y,z,hr,rt){coll(m,o,x,y,z,hr).userData.coll.rt=rt;return o}
const RA=-3.4,RB=-1.3,RC=0.8,RD=2.7,XL=OB-1.9,XM=OB,XR=OB+1.9;
pine(XL,RA,1.5,0);[[-0.3,0.06,0.42],[0.02,0.06,0.5],[0.32,0.06,0.4]].forEach((p,i)=>{const d=mesh(new THREE.SphereGeometry(0.06,8,6),M('#e0a030',0.2));d.scale.y=1.3;skin(coll('recine',d,XL+p[0],p[1],RA+p[2],0.16),'m_cone',{h:0.13,ry:i*1.7})});patch('Çam ağacı',XL,RA,1.05);
add(Cy(0.13,0.18,1.3,7),M('#5a3b22'),XM,0.65,RA);add(new THREE.IcosahedronGeometry(0.75,0),M('#5f8a3a'),XM,1.8,RA);add(new THREE.IcosahedronGeometry(0.45,0),M('#6c9a44'),XM+0.5,1.5,RA+0.2);
for(let i=0;i<4;i++)skin(coll('ceviz',mesh(new THREE.DodecahedronGeometry(0.065),M('#6b4a2b')),XM-0.36+i*0.24,0.06,RA+0.42+(i%2)*0.14),'m_walnut',{w:0.14,ry:i});patch('Ceviz ağacı',XM,RA,1.05);
[[-0.25,-0.18],[0.25,-0.18],[-0.25,0.18],[0.25,0.18]].forEach(p=>add(B(0.06,0.3,0.06),M('#5a3519'),XR+p[0],0.15,RA+p[1]));
['#e0c070','#d4b25e','#e0c070'].forEach((c,i)=>add(B(0.56,0.22,0.48),M(c),XR,0.41+i*0.23,RA));add(B(0.68,0.07,0.6),M('#8a5530'),XR,1.02,RA);add(B(0.18,0.03,0.02),M('#2a1c10'),XR,0.36,RA+0.245);
[-0.2,0.2].forEach(dx=>coll('balmumu',mesh(Cy(0.1,0.1,0.05,6),M('#e8b84a',0.5)),XR+dx,0.03,RA+0.5));{const j=new THREE.Group();put(j,Cy(0.07,0.07,0.12,12),M('#e09a2a',0.25),0,0.06,0);put(j,Cy(0.075,0.075,0.02,12),M('#c0392b',0.8),0,0.125,0);coll('bal',j,XR+0.42,0,RA+0.15)}patch('Arı kovanı',XR,RA,1.2);
bed(XL,RB,1.35,0.85);[-0.33,0.33].forEach(dx=>{add(new THREE.IcosahedronGeometry(0.3,0),M('#4f7a3a'),XL+dx,0.36,RB-0.05);for(let i=0;i<3;i++){const a=0.4+i*1.15;coll('pamuk',mesh(new THREE.IcosahedronGeometry(0.085,0),M('#f6f3ea')),XL+dx+Math.cos(a)*0.24,0.46+(i%2)*0.14,RB+Math.sin(a)*0.24)}});patch('Pamuk',XL,RB);
bed(XM,RB,1.35,0.85);{const b=add(new THREE.IcosahedronGeometry(0.34,0),M('#3f6a34'),XM,0.38,RB-0.08);b.scale.set(1.6,1,1)}
[-0.42,-0.14,0.14,0.42].forEach((dx,i)=>skin(coll('bogurtlen',mesh(new THREE.DodecahedronGeometry(0.075),M('#5e3a6e',0.4)),XM+dx,0.4+(i%2)*0.14,RB+0.22),'m_rasp',{h:0.13}));patch('Böğürtlen',XM,RB);
function sheep(x,z,f){const g=new THREE.Group();g.position.set(x,0,z);S.add(g);ANIMS.push(g);[[-0.1,-0.13],[0.1,-0.13],[-0.1,0.13],[0.1,0.13]].forEach(p=>put(g,Cy(0.03,0.03,0.22,5),M('#3a2f28'),p[0],0.11,p[1]));
put(g,B(0.24,0.2,0.42),M('#e6ddcc'),0,0.32,0);put(g,new THREE.SphereGeometry(0.1,8,6),M('#3a2f28'),f*0.04,0.44,0.29);[-1,1].forEach(s=>put(g,B(0.07,0.03,0.04),M('#3a2f28'),f*0.04+s*0.11,0.49,0.27));
const w=mesh(new THREE.IcosahedronGeometry(0.27,1),M('#f4efe4',1));w.scale.set(1,0.85,1.25);coll('yun',w,x,0.37,z,0.3);
place('sheep',{par:g,swap:1,h:0.6,ry:f>0?0.3:-2.6,cb:()=>{const c=w.userData.coll;c.base.set(0.34,0.29,0.41);w.scale.copy(c.base);w.position.y=0.69}})}
bed(XR,RB,1.35,0.85);for(let i=0;i<4;i++){const l=mkLav();l.scale.setScalar(1.25);cl('lavanta',l,XR-0.45+i*0.3,0.09,RB+(i%2)*0.2-0.1,0.18,35)}patch('Lavanta',XR,RB);
window.__zd=1;ZONES();
bed(XL,RC,1.35,0.8);for(let i=0;i<3;i++){const g=new THREE.Group();put(g,Cy(0.012,0.012,0.3,4),M('#3f5a2c'),0,0.15,0);for(let j=0;j<4;j++){const l=put(g,new THREE.SphereGeometry(0.08,6,4),M('#3d6680'),Math.cos(j*1.6)*0.07,0.18+j*0.04,Math.sin(j*1.6)*0.07);l.scale.set(1,0.35,0.6)}coll('civit',g,XL-0.4+i*0.4,0.09,RC+(i%2)*0.16-0.05);place('m_purp',{par:g,swap:1,h:0.34,ry:i*1.7})}patch('Çivit',XL,RC);
bed(XM,RC,1.35,0.8);for(let i=0;i<4;i++){const g=new THREE.Group();put(g,Cy(0.012,0.012,0.26,4),M('#4f7a3a'),0,0.13,0);const f=put(g,Cy(0.08,0.08,0.02,8),M('#f2c230'),0,0.27,0);f.rotation.x=0.5;put(g,new THREE.SphereGeometry(0.03,6,5),M('#8a4a1a'),0,0.285,0.014);coll('papatya',g,XM-0.42+i*0.28,0.09,RC+(i%2)*0.18-0.06);place('m_fsingle',{par:g,swap:1,h:0.32,ry:i*1.3})}patch('Sarı çiçek',XM,RC);
bed(XR,RC,1.35,0.8);for(let i=0;i<3;i++){const g=new THREE.Group();put(g,new THREE.ConeGeometry(0.05,0.22,5),M('#b23a2a'),0,0.06,0).rotation.z=Math.PI;for(let j=0;j<3;j++){const l=put(g,new THREE.ConeGeometry(0.05,0.25,4),M('#4f7a3a'),(j-1)*0.05,0.3,0);l.rotation.z=(j-1)*0.4}coll('kokboya',g,XR-0.4+i*0.4,0.09,RC+(i%2)*0.16-0.05);place('m_rose',{par:g,swap:1,h:0.3,ry:i*2.1})}patch('Kök boya',XR,RC);
for(let i=0;i<3;i++){const l=mesh(Cy(0.1,0.11,0.6,8),M('#6b4528'));l.rotation.z=Math.PI/2;coll('kutuk',l,XM-0.3+i*0.05,0.1+(i===2?0.18:0),RD+(i===2?0:(i-0.5)*0.22),0.26)}
add(Cy(0.2,0.23,0.3,9),M('#7a5230'),XM+0.65,0.15,RD);{const a=add(B(0.04,0.4,0.04),M('#5a3519'),XM+0.65,0.48,RD);a.rotation.z=0.5;add(B(0.14,0.1,0.03),M('#9a9aa0',0.4),XM+0.56,0.36,RD)}patch('Odun yığını',XM,RD,0.6);
{const tg=new THREE.Group();tg.position.set(OB+3.0,0,1.55);tg.rotation.y=Math.PI;S.add(tg);place('tractor',{par:tg,w:1.05});TRACT=label('bahce',V(OB+3.0,0.02,2.15),'',true);TRACT.el.classList.add('sm','lock');TRACT.el.innerHTML='🔒 Traktör<small>Ticaret menüsünden al · otomatik hasat</small>'}place('flowers',{x:OB-3.1,z:-0.7,w:0.9,ry:2});place('flower_petal',{x:OB+0.95,z:3.8,w:0.3});place('flower_petal',{x:OB-0.95,z:3.8,w:0.3,ry:1.5});
const RE=4.6;
function cropMesh(hex){const g=new THREE.Group();for(let i=0;i<4;i++){const x=-0.45+i*0.3,z=(i%2)*0.16-0.08;put(g,new THREE.ConeGeometry(0.05,0.26,5),M('#4f7a3a'),x,0.13,z);put(g,new THREE.DodecahedronGeometry(0.06),M(hex),x,0.29,z)}return g}
const PL=[[XL,RD,60],[XR,RD,120],[XL,RE,200],[XM,RE,300],[XR,RE,450]].map(q=>{const g=new THREE.Group();g.position.set(q[0],0,q[1]);S.add(g);
const lockG=new THREE.Group();put(lockG,B(1.35,0.02,0.8),M('#779a4c'),0,0.012,0).castShadow=false;put(lockG,B(0.05,0.42,0.05),M('#8a6a44'),0,0.21,0);put(lockG,B(0.46,0.24,0.04),M('#e6d5b0'),0,0.46,0);g.add(lockG);
const bedG=new THREE.Group();put(bedG,B(1.49,0.07,0.94),M('#8a6a44'),0,0.035,0);put(bedG,B(1.35,0.09,0.8),M('#6b4a30'),0,0.045,0);for(let k=0;k<4;k++)put(bedG,B(1.25,0.02,0.05),M('#5a3c26'),0,0.095,-0.27+k*0.18);g.add(bedG);
const crop=new THREE.Group();crop.position.y=0.09;g.add(crop);const h=new THREE.Mesh(B(1.5,0.5,0.95),HID);h.position.y=0.25;g.add(h);
const o={g,lockG,bedG,crop,cost:q[2],own:false,seed:null,end:0,dur:1};g.userData.plot=o;o.lbl=label('bahce',V(q[0],0.02,q[1]+0.5),'',true);o.lbl.el.classList.add('stl','sm');o.lbl.el.onclick=()=>plotTap(o);return o});
function plotSync(o){o.lockG.visible=!o.own;o.bedG.visible=o.own;o.crop.clear();if(o.seed){o.crop.add(cropMesh(CROPS[o.seed].hex));if(!o.w)o.crop.scale.setScalar(0.12)}}
function burst(c,hex,n,mode){for(let i=0;i<n;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(mode==='w'?0.028:0.035,5,4),new THREE.MeshStandardMaterial({color:hex,roughness:0.3,transparent:mode==='w',opacity:0.85}));
const x=c.x+(Math.random()-0.5)*1.1,z=c.z+(Math.random()-0.5)*0.6,y0=mode==='up'?0.2:0.9+Math.random()*0.4,d=0.45+Math.random()*0.35,dl=Math.random()*0.25;m.position.set(x,y0,z);m.visible=false;S.add(m);
setTimeout(()=>{m.visible=true;tween(d,k=>{m.position.y=mode==='up'?y0+k*0.9:y0-(y0-0.12)*k*k;if(mode==='up'){m.scale.setScalar(1-k*0.7)}},()=>{S.remove(m);m.geometry.dispose();m.material.dispose()})},dl*1000)}}
function plotTick(){PL.forEach(o=>{let t,rd=false;if(!o.own)t=`Arazi<small>${o.cost} altın</small>`;else if(!o.seed)t='Boş tarla<small>Tohum ek</small>';else if(!o.w)t=`${MATS[CROPS[o.seed].out].ad}<small>Sula!</small>`;else{const r=o.end-NOW(),c=CROPS[o.seed];rd=r<=0;o.crop.scale.setScalar(rd?1:0.2+0.8*(1-r/o.dur));t=`${MATS[c.out].ad}<small>${rd?'Hasat et!':Math.ceil(r)+' sn'}</small>`}
if(t!==o.lbl.last){o.lbl.el.innerHTML=t;o.lbl.last=t;o.lbl.el.classList.toggle('rdy',rd);o.lbl.el.classList.toggle('wat',!!(o.own&&o.seed&&!o.w))}})}
function plotTap(o){if(switching||G.phase==='craft'||G.phase==='result')return;
if(!o.own){openSheet('plot',`<h3>Arazi satın al</h3><p>Bu tarlaya tohum ekip kendi malzemeni yetiştirebilirsin. Altın: <b>${G.gold}</b></p><div style="text-align:center;margin:10px"><button class="btn g" id="buyP" ${G.gold<o.cost?'disabled':''}>${o.cost} altına satın al</button></div>`+closeBtn);wire();
$('buyP').onclick=()=>{if(G.gold<o.cost)return;G.gold-=o.cost;o.own=true;G.st.plots++;plotSync(o);sfx.coin();save();closeSheet()};return}
if(!o.seed){const ks=Object.keys(CROPS).filter(k=>G.inv[k]>0);openSheet('plot','<h3>Tohum ek</h3>'+(ks.length?ks.map(k=>{const c=CROPS[k];return `<div class="row"><img class="ic" src="${ICON[k]}" alt=""><div class="n">${MATS[k].ad}<small>${c.s} sn · ${c.n} ${MATS[c.out].ad.toLowerCase()} verir · Elinde: ${G.inv[k]}</small></div><button class="btn" data-sd="${k}">Ek</button></div>`}).join(''):'<p>Tohumun yok. Pazardaki Tohumcu sekmesinden alabilirsin.</p>')+closeBtn);wire();
ui.sheet.querySelectorAll('[data-sd]').forEach(b=>b.onclick=()=>{const k=b.dataset.sd;if(G.inv[k]<1)return;G.inv[k]--;o.seed=k;o.w=false;o.dur=CROPS[k].s;o.end=0;plotSync(o);sfx.plant();sfx.seed();burst(o.g.position,CROPS[k].hex,9,'s');burst(o.g.position,'#6b4a30',7,'up');closeSheet();toast('Şimdi tarlayı sula',1300)});return}
if(!o.w){o.w=true;o.end=NOW()+o.dur;sfx.water();burst(o.g.position,'#7fc4e8',16,'w');plotTick();save();return}
if(o.end>NOW()){toast(`${fmtT(o.end-NOW())} sonra hasat`,1000);return}
const c=CROPS[o.seed];G.inv[c.out]+=c.n;G.st.harv++;G.st.coll+=c.n;burst(o.g.position,c.hex,8,'up');o.seed=null;o.w=false;plotSync(o);sfx.pick();toast(`+${c.n} ${MATS[c.out].ad}`,1200);refresh()}
PL.forEach(plotSync);
function label(v,pos,txt,below){const el=document.createElement('div');el.className='lbl hide'+(below?' below':'');if(txt)el.textContent=txt;$('labels').appendChild(el);const o={el,pos,v,last:'',below,hid:true};LBL.push(o);return o}

/* ---------- el aletleri ---------- */
const TOOL=new THREE.Group();TOOL.visible=false;TOOL.userData={t:null,down:false,last:0,mv:0,lp:null};S.add(TOOL);const TL={};
function tl(n,fn){const g=new THREE.Group(),inner=new THREE.Group();g.add(inner);fn(inner,g);g.visible=false;TOOL.add(g);TL[n]=g;return g}
const steel=M('#c8ccd0',0.25);
tl('sc',(i,g)=>{i.position.set(0,0.02,0.11);i.rotation.x=-0.3;[1,-1].forEach(sg=>{const bl=new THREE.Group();put(bl,B(0.014,0.004,0.13),steel,0,0,-0.065);const h=put(bl,new THREE.TorusGeometry(0.026,0.008,5,14),M('#b5533c'),sg*0.02,0,0.05);h.rotation.x=Math.PI/2;i.add(bl);g.userData[sg>0?'a':'b']=bl});put(i,Cy(0.008,0.008,0.012,8),M('#4a4a50'),0,0.004,0)});
function brushT(n,tip){tl(n,(i,g)=>{i.rotation.x=0.55;const t=put(i,new THREE.ConeGeometry(0.016,0.05,8),M(tip,0.9),0,0.025,0);t.rotation.x=Math.PI;g.userData.tip=t;put(i,Cy(0.013,0.013,0.035,8),M('#b8bcc0',0.35),0,0.065,0);put(i,Cy(0.009,0.012,0.2,8),M('#a0703c'),0,0.18,0)})}
brushT('br','#6e3d1f');brushT('gl','#efe6c8');
tl('sw',(i)=>{i.rotation.x=-0.25;i.position.set(0,0.03,0.08);const b=put(i,B(0.05,0.003,0.2),steel,0,0,-0.06);for(let j=0;j<10;j++)put(i,B(0.008,0.003,0.008),steel,-0.027,0,-0.15+j*0.019).rotation.y=0.78;put(i,B(0.04,0.05,0.08),M('#8a3a20'),0,0.012,0.08)});
tl('ax',(i)=>{i.rotation.x=0.75;put(i,Cy(0.008,0.009,0.24,8),M('#6b4528'),0,0.14,0.03).rotation.x=0.15;put(i,B(0.012,0.06,0.07),steel,0,0.03,0)});
tl('blk',(i)=>{put(i,B(0.15,0.045,0.095),M('#c9955a'),0,0.035,0);put(i,B(0.15,0.012,0.095),M('#8a8478',1),0,0.006,0)});
tl('kn',(i)=>{i.rotation.x=-0.5;const b=put(i,new THREE.CylinderGeometry(0.055,0.055,0.006,16,1,false,-Math.PI/2,Math.PI),steel,0,0.004,0.0);put(i,B(0.024,0.022,0.12),M('#5a3519'),0,0.012,0.11)});
tl('cl',(i)=>{const c=put(i,new THREE.SphereGeometry(0.07,10,6),M('#efe2c4',1),0,0.022,0);c.scale.set(1.15,0.38,0.9);const c2=put(i,new THREE.SphereGeometry(0.04,8,6),M('#e2d2ae',1),0.03,0.04,0.02);c2.scale.set(1,0.6,1)});
tl('nd',(i)=>{i.rotation.x=0.45;put(i,Cy(0.0035,0.002,0.16,6),steel,0,0.08,0);const th=put(i,Cy(0.002,0.002,0.12,4),M('#b5533c'),0.015,0.12,0.02);th.rotation.z=0.5});
tl('pn',(i)=>{i.rotation.x=0.35;put(i,Cy(0.014,0.01,0.12,10),steel,0,0.06,0);put(i,Cy(0.026,0.026,0.05,10),M('#5a3519'),0,0.145,0)});
function toolSet(t){if(TOOL.userData.t===t)return;TOOL.userData.t=t;for(const k in TL)TL[k].visible=k===t;TOOL.rotation.set(0,0,0)}
function toolAt(p,t,y){toolSet(t);const U=TOOL.userData;TOOL.visible=true;U.down=true;U.last=tt;const yy=y!=null?y:(K?K.top:Y)+0.004;
if(U.lp){const dx=p.x-U.lp.x,dz=p.z-U.lp.z,d=Math.hypot(dx,dz);if(d>0.003){U.mv=tt;if(t==='sc'||t==='kn'||t==='sw'){const tg=Math.atan2(-dx,-dz);let a=tg-TOOL.rotation.y;a=Math.atan2(Math.sin(a),Math.cos(a));TOOL.rotation.y+=a*0.35}}}
U.lp=p.clone();TOOL.position.set(p.x,yy,p.z);if(t==='ax'){const a=TL.ax.children[0];a.rotation.x=0.75-Math.abs(Math.sin(tt*16))*0.55;if(tt-(U.ch||0)>0.22){U.ch=tt;noise(0.05,0.06,700,0.6,0,250)}}}
function toolUp(){TOOL.userData.down=false;TOOL.userData.lp=null}
function stab(pos,k){const t={dik:'nd',yapistir:'gl',delik:'pn'}[k];if(!t)return;toolSet(t);TOOL.visible=true;const U=TOOL.userData;U.down=false;U.last=tt+0.3;TOOL.rotation.set(0,0,0);
TOOL.position.set(pos.x,pos.y,pos.z);tween(0.22,k2=>TOOL.position.y=pos.y+0.004+Math.abs(1-2*k2)*0.12)}
function toolTick(){const U=TOOL.userData;if(!TOOL.visible)return;if(G.phase!=='craft'||(!U.down&&tt-U.last>0.7)){TOOL.visible=false;return}
if(U.t==='sc'){const a=tt-U.mv<0.15?0.05+0.24*Math.abs(Math.sin(tt*15)):0.26;TL.sc.userData.a.rotation.y=a;TL.sc.userData.b.rotation.y=-a}
else if((U.t==='blk'||U.t==='cl'||U.t==='br')&&tt-U.mv<0.15)TOOL.rotation.y=Math.sin(tt*22)*0.18}

/* ---------- pazar ---------- */
function figure(x,z,col){const g=new THREE.Group();put(g,B(0.44,0.45,0.28),M('#3a2f28'),0,0.22,0);put(g,Cy(0.25,0.32,0.95,8),M(col),0,0.92,0);put(g,new THREE.SphereGeometry(0.22,10,8),M('#e0b088'),0,1.62,0);put(g,Cy(0.24,0.27,0.1,8),M('#8a3a28'),0,1.82,0);g.position.set(x,0,z);S.add(g);return g}
add(B(18,0.1,18),M('#c4ad82'),OP,-0.05,-1).castShadow=false;
for(let i=0;i<36;i++)add(B(0.55+(i%3)*0.15,0.012,0.42),M(i%2?'#b59f74':'#d1bc92'),OP-3.6+(i%6)*1.4+(Math.floor(i/6)%2)*0.5,0.004,-3.4+Math.floor(i/6)*1.5).castShadow=false;
[[-3.5,'#e8d8b8',2.6],[-1.1,'#d9b89a',3.2],[1.3,'#e6cfa8',2.7],[3.6,'#c9d6c0',3]].forEach(([x,c,h])=>{add(B(2.2,h,1.6),M(c),OP+x,h/2,-5.2);const r=add(new THREE.ConeGeometry(1.75,0.9,4),M('#b5533c'),OP+x,h+0.45,-5.2);r.rotation.y=Math.PI/4;
add(B(0.5,0.95,0.05),M('#6e4122'),OP+x-0.4,0.47,-4.38);add(B(0.5,0.5,0.05),glow('#ffe6a8'),OP+x+0.45,h*0.62,-4.38).castShadow=false});
function stall(x,z,c1,tab,keys){const g=new THREE.Group();put(g,B(1.7,0.75,0.8),M('#8a5530'),0,0.375,0);put(g,B(1.8,0.06,0.9),M('#a8693a'),0,0.78,0);
[[-0.82,-0.4],[0.82,-0.4],[-0.82,0.4],[0.82,0.4]].forEach(q=>put(g,B(0.07,2.0,0.07),M('#5a3519'),q[0],1.0,q[1]));
for(let i=0;i<8;i++){const a=put(g,B(0.235,0.04,1.3),M(i%2?'#f0e2c4':c1),-0.82+i*0.235,2.05,0.1);a.rotation.x=0.22}
const gd=[];keys.forEach((k,i)=>{const o=MATS[k].mk();o.scale.setScalar(1.5);o.position.set(-0.6+i*0.4,0.81,0.05);g.add(o);gd.push(o)});
const h=new THREE.Mesh(B(2,2.2,1.5),HID);h.position.y=1.1;g.add(h);g.position.set(OP+x,0,z);g.userData.tab=tab;S.add(g);return g}
const STALLS=[stall(-1.2,-2.1,'#b5533c','pazar',['hamderi','deri','iplik','toka']),stall(1.2,-2.1,'#2f6b5a','tohum',['tohum_pamuk','tohum_civit','tohum_kokboya','tohum_papatya'])];
{const g=new THREE.Group();put(g,B(1.7,0.12,0.95),M('#8a5530'),0,0.58,0);[-0.45,0.45].forEach(z=>put(g,B(1.7,0.3,0.05),M('#7a4a2a'),0,0.78,z));put(g,B(0.05,0.3,0.95),M('#7a4a2a'),0.83,0.78,0);
[[-0.5,-0.52],[0.5,-0.52],[-0.5,0.52],[0.5,0.52]].forEach(q=>{put(g,new THREE.TorusGeometry(0.33,0.05,6,16),M('#5a3519'),q[0],0.38,q[1]);const sp=put(g,B(0.6,0.04,0.03),M('#5a3519'),q[0],0.38,q[1]);const sp2=put(g,B(0.04,0.6,0.03),M('#5a3519'),q[0],0.38,q[1])});
const hd=put(g,B(1.1,0.06,0.06),M('#5a3519'),-1.35,0.5,0);hd.rotation.z=-0.15;
[[-0.45,'#9b6a3a'],[0.1,'#8b5a2b'],[0.55,'#a8743e']].forEach((q,i)=>put(g,B(0.42,0.38,0.42),M(q[1]),q[0],0.84,(i%2)*0.2-0.1));const sk=put(g,new THREE.SphereGeometry(0.22,8,6),M('#cdbb94'),-0.15,1.2,0);sk.scale.y=0.8;
const h=new THREE.Mesh(B(2.4,1.8,1.5),HID);h.position.y=0.9;g.add(h);g.position.set(OP-1.15,0,1.3);g.userData.tab='ted';S.add(g);STALLS.push(g)}
figure(OP-1.2,-2.8,'#3f6fa8');figure(OP+1.2,-2.8,'#4f7a3a');add(B(1.1,0.012,5.2),M('#e2d0a8'),OP,0.007,0.7).castShadow=false;
plant(OP-2.9,0,-2.6,1.3);plant(OP+2.9,0,-2.6,1.3);const GL=label('pazar',V(OP,0.05,3.35),null,true);GL.el.classList.add('stl');GL.el.onclick=()=>marketTab('gift');
{const g=new THREE.Group();put(g,B(0.7,0.4,0.5),M('#8a5530'),0,0.2,0);put(g,B(0.74,0.16,0.54),M('#a8693a'),0,0.48,0);[-0.22,0.22].forEach(x=>put(g,B(0.08,0.6,0.56),M('#d9a23a',0.4),x,0.3,0));put(g,B(0.1,0.13,0.04),M('#e8c05a',0.3),0,0.38,0.27);
const h=new THREE.Mesh(B(1,1,0.9),HID);h.position.y=0.4;g.add(h);g.position.set(OP,0,3.0);g.userData.tab='gift';S.add(g);STALLS.push(g);place('chest',{par:g,swap:1,h:0.62})}
/* ---------- dekorcu (dükkan özelleştirme) ---------- */
const DECO={
 tez:{ad:'Tezgâh',o:[{id:'ceviz',ad:'Ceviz',c:['#8a5530','#a8693a'],f:0},{id:'mese',ad:'Açık meşe',c:['#b58a5a','#d4ad78'],f:150},{id:'abanoz',ad:'Abanoz',c:['#3a2a20','#5a4232'],f:220},{id:'yesil',ad:'Yeşil boyalı',c:['#2f6b5a','#c8a060'],f:180},{id:'cini',ad:'Çini kaplama',c:['#8a5530','#e6ddc8'],f:260}]},
 raf:{ad:'Depo rafları',o:[{id:'dogal',ad:'Doğal',c:['#8a5a34','#5a3519'],f:0},{id:'mese',ad:'Açık meşe',c:['#c09060','#8a6a40'],f:150},{id:'koyu',ad:'Koyu ceviz',c:['#5a3a22','#3a2414'],f:150},{id:'yesil',ad:'Yeşil boyalı',c:['#3f6f5a','#2f4f40'],f:180}]},
 cer:{ad:'Pencere ve kapı',o:[{id:'koyu',ad:'Koyu ahşap',c:['#5a3519',null],f:0},{id:'acik',ad:'Açık ahşap',c:['#a07040','#c8a070'],f:120},{id:'mavi',ad:'Mavi boya',c:['#2c4f7a','#3f6fa8'],f:160},{id:'kirmizi',ad:'Kırmızı boya',c:['#8a2a22','#a3302a'],f:160}]},
 duv:{ad:'Duvar',o:[{id:'toprak',ad:'Toprak sıva',c:['#9a6a42'],f:0},{id:'krem',ad:'Krem badana',c:['#d8c4a0'],f:120},{id:'gok',ad:'Gök mavisi',c:['#7a9ab0'],f:160},{id:'nar',ad:'Nar kırmızısı',c:['#9a4a3a'],f:160}]}};
function decoSel(k){const id=G.deco&&G.deco.sel[k];return DECO[k].o.find(o=>o.id===id)||DECO[k].o[0]}
function decoApply(){const t=decoSel('tez'),r=decoSel('raf'),c=decoSel('cer'),d=decoSel('duv');CTB.color.set(t.c[0]);CTT.color.set(t.c[1]);RFA.color.set(r.c[0]);RFB.color.set(r.c[1]);beam.color.set(c.c[0]);wallM.color.set(d.c[0]);
 if(DOORH){DOORH.traverse(o=>{if(o.isMesh){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if(!m.userData.c0)m.userData.c0=m.color.clone();m.color.copy(m.userData.c0);if(c.c[1])m.color.lerp(new THREE.Color(c.c[1]),0.75)})}});DOORH.userData.dk=c.id}}
function openDeco(){if(!G.deco)G.deco={own:{},sel:{}};let h='<h3>Dekorcu</h3><p>Dükkanını kendine göre düzenle. Aldığın görünümler senin olur, istediğin an geri dönebilirsin.</p>';
 Object.entries(DECO).forEach(([k,cat])=>{h+=`<div class="grp">${cat.ad}</div>`;cat.o.forEach(o=>{const own=!o.f||G.deco.own[k+'.'+o.id],sel=decoSel(k).id===o.id;
  h+=`<div class="row"><div class="ic" style="display:flex;gap:2px;align-items:center;justify-content:center">${o.c.filter(Boolean).map(x=>`<i style="display:block;width:16px;height:30px;border-radius:5px;background:${x};border:1.5px solid var(--ln)"></i>`).join('')}</div><div class="n">${o.ad}<small>${own?'Senin':o.f+' altın'}</small></div>${sel?'<b>Seçili</b>':`<button class="btn ${own?'l':'g'}" data-dk="${k}.${o.id}">${own?'Seç':'Satın al'}</button>`}</div>`})});
 openSheet('deko',h+closeBtn);wire();ui.sheet.querySelectorAll('[data-dk]').forEach(b=>b.onclick=()=>{const [k,id]=b.dataset.dk.split('.'),o=DECO[k].o.find(x=>x.id===id),own=!o.f||G.deco.own[k+'.'+id];
  if(!own){if(G.gold<o.f){toast(`${o.f} altın gerekli`,1300);return}if(!armBuy('d'+k+id,`${o.ad} alınsın mı? ${o.f} altın`))return;G.gold-=o.f;G.deco.own[k+'.'+id]=1;buyArm=null;sfx.coin()}else sfx.tap();
  G.deco.sel[k]=id;decoApply();save();refresh();openDeco();toast(k==='raf'?'Depo rafları değişti':k==='tez'?'Tezgâh yenilendi':'Dükkan yenilendi',1200)})}
{const g=new THREE.Group();put(g,B(1.4,0.75,0.7),M('#7a4a2a'),0,0.375,0);put(g,B(1.5,0.06,0.8),M('#a8693a'),0,0.78,0);[[-0.68,-0.35],[0.68,-0.35]].forEach(q=>put(g,B(0.06,1.9,0.06),M('#5a3519'),q[0],0.95,q[1]));
 for(let i=0;i<6;i++){const a=put(g,B(0.25,0.04,1.0),M(i%2?'#f0e2c4':'#3f6fa8'),-0.62+i*0.25,1.9,0.0);a.rotation.x=0.25}
 [['#8a5530',-0.45],['#2f6b5a',0],['#9a4a3a',0.45]].forEach(([c,x])=>put(g,B(0.3,0.2,0.25),M(c),x,0.91,0));
 const h=new THREE.Mesh(B(1.8,2,1.3),HID);h.position.y=1;g.add(h);g.position.set(OP+1.3,0,1.3);g.userData.tab='deko';S.add(g);STALLS.push(g);place('stand2',{par:g,swap:1,w:1.45});
 const l=label('pazar',V(OP+1.3,0.05,1.85),null,true);l.el.innerHTML='Dekorcu<small>Dükkan görünümü</small>';l.el.classList.add('stl');l.el.onclick=()=>marketTab('deko')}
const today=()=>new Date().toDateString();
function giftTick(){const av=G.daily!==today(),t=av?'Günlük hediye<small>Topla!</small>':'Günlük hediye<small>Yarın yine gel</small>';if(t!==GL.last){GL.el.innerHTML=t;GL.last=t;GL.el.classList.toggle('rdy',av)}}
function claimDaily(){const td=today();if(G.daily===td){toast('Bugünkü hediyeni aldın<br>Yarın yine gel!',1600);return}
const y=new Date(Date.now()-864e5).toDateString();G.streak=G.daily===y?Math.min(7,(G.streak||0)+1):1;G.daily=td;const gold=20+G.streak*10,ks=['hamderi','pamuk','kaucuk','kurum','ceviz','yun','recine','tohum_pamuk','tohum_papatya'],got={};
for(let i=0;i<3;i++){const k=pick(ks);got[k]=(got[k]||0)+1;G.inv[k]++}G.gold+=gold;sfx.fan();save();refresh();
openSheet('gift',`<h3>Günlük hediye</h3><p>${G.streak}. gün · Her gün gelirsen ödül büyür (en çok 7 gün)</p><div class="row"><div class="n"><b>+${gold} altın</b></div></div>`+Object.entries(got).map(([k,n])=>`<div class="row"><img class="ic" src="${ICON[k]}" alt=""><div class="n">${MATS[k].ad}</div><b>+${n}</b></div>`).join('')+closeBtn);wire()}
function marketTab(t){if(G.phase==='craft'||G.phase==='result'||switching)return;if(t==='gift'){claimDaily();return}if(t==='deko'){openDeco();return}mTab=t;renderMarket()}
[[-1.2,-2.1,'Pazar tezgahı','Günlük mallar','pazar',0.5],[1.2,-2.1,'Tohumcu','Tohumlar','tohum',0.5],[-1.15,1.3,'Tedarikçi','Toplu sipariş','ted',0.6]].forEach(q=>{const l=label('pazar',V(OP+q[0],0.05,q[1]+q[5]),null,true);l.el.innerHTML=`${q[2]}<small>${q[3]}</small>`;l.el.classList.add('stl');l.el.onclick=()=>marketTab(q[4])});

/* ---------- depo ---------- */
for(let i=0;i<10;i++)add(B(0.66,0.05,9),M(i%2?'#6a4428':'#5e3b22'),OD-3+i*0.66,0,0);
add(B(6.6,4.4,0.15),M('#7a5636'),OD,2.2,-3.25);add(B(0.15,4.4,9),M('#6e4a30'),OD-3.2,2.2,0);add(B(0.15,4.4,9),M('#6e4a30'),OD+3.2,2.2,0);
const GORD=['Ham madde','İşlenmiş','Yardımcı','Tohum'],DEP=[],DROW=[3.45,2.83,2.21,1.59,0.97,0.35];
const RFA=M('#8a5a34'),RFB=M('#5a3519');DROW.forEach(y=>add(B(4.0,0.06,0.55),RFA,OD,y-0.03,-2.9));[-2.0,2.0].forEach(x=>add(B(0.1,3.9,0.55),RFB,OD+x,1.95,-2.9));
Object.keys(MATS).sort((a,b)=>GORD.indexOf(MATS[a].g)-GORD.indexOf(MATS[b].g)).forEach((k,i)=>{const x=OD-1.55+(i%6)*0.62,y=DROW[Math.floor(i/6)%6],o=MATS[k].mk();o.scale.setScalar(2);o.position.set(x,y,-2.9);o.visible=false;S.add(o);
const l=label('depo',V(x,y+0.02,-2.62),'',true);l.el.classList.add('dn');l.off=true;const hb=new THREE.Mesh(new THREE.SphereGeometry(0.19,6,5),HID);hb.position.y=0.08;o.add(hb);const dd={k,o,l,n:-1};DEP.push(dd)});
place('rug',{x:OD,y:0.03,z:0.3,w:2.6,ry:Math.PI/2});place('m_rug2',{x:OI,y:0.012,z:3.4,w:2.2});place('m_orn',{x:-0.1,y:1.95,z:-3.7,w:0.45,rx:Math.PI/2});place('wb_kenney',{x:OD+1.45,z:-1.55,w:0.9,ry:-0.5});const DHIT=new THREE.Mesh(B(4.4,4,0.7),HID);DHIT.position.set(OD,1.95,-2.9);S.add(DHIT);
add(B(0.75,0.65,0.75),M('#8b5a2b'),OD-2.6,0.33,-1.6);add(B(0.55,0.5,0.55),M('#7a4a2a'),OD-2.6,0.9,-1.65).rotation.y=0.3;add(Cy(0.34,0.3,0.8,10),M('#8a5530'),OD+2.6,0.4,-1.7);{const sk=add(new THREE.SphereGeometry(0.34,8,6),M('#cdbb94'),OD+2.55,0.28,-0.7);sk.scale.y=0.8}
/* ---------- depo/vitrin kapasite ve düzen ---------- */
const CAPS={d:{ad:'Malzeme deposu',v:[100,150,250,400],c:[150,300,600]},s:{ad:'Depo ürün rafı',v:[2,4,6],c:[100,250]},v:{ad:'Vitrin',v:[3,6,9],c:[150,300]}};
function capLv(k){if(!G.cap)G.cap={d:0,s:0,v:0};return G.cap[k]||0}
const OWNER_H='4be73331840233a38bc7128e8f5f66203778469ca1f25f3d2a46de116ba045fc';const capOf=k=>G.owner?99999:CAPS[k].v[capLv(k)],invTotal=()=>Object.values(G.inv).reduce((a,b)=>a+(b>0?b:0),0);
function depoFull(n){if(invTotal()+(n||1)>capOf('d')){toast(`Depo dolu (${invTotal()}/${capOf('d')})<br>Depoda genişlet ya da malzeme kullan`,1900);sfx.bad&&sfx.bad();return true}return false}
const vitCap=()=>capOf('v'),stoCap=()=>capOf('s');
function capUp(k){const L=capLv(k),c=CAPS[k].c[L];if(c==null||G.gold<c)return;G.gold-=c;G.cap[k]=L+1;sfx.coin();sfx.fan();toast(`${CAPS[k].ad}: ${capOf(k)}`,1300);save();refresh();vitrinSync();storeSync();openDepo()}
function toStore(it){if((G.store||[]).length>=stoCap()){toast('Depo ürün rafı dolu',1300);return false}G.store=G.store||[];G.stock=G.stock.filter(x=>x!==it);G.store.push(it);vitrinSync();storeSync();save();refresh();return true}
function toVit(it){if(G.stock.length>=vitCap()){toast('Vitrin dolu',1300);return false}G.store=G.store.filter(x=>x!==it);G.stock.push(it);vitrinSync();storeSync();save();refresh();return true}
const DSTO=new THREE.Group();S.add(DSTO);
function storeSync(){DSTO.clear();(G.store||[]).slice(0,6).forEach((it,i)=>{const p=pr(it),m=p.build(it.col?paintOf(it.col).hex:p.sheet,it.style,{cila:true});m.g.scale.setScalar(0.95);m.g.position.set(OD-1.55+i*0.62,DROW[5]+0.01,-2.85);m.g.rotation.y=0.4;m.g.userData.sid=it.id;DSTO.add(m.g)})}
let DRG=null,DRGJ=false;const DPL=new THREE.Plane(new THREE.Vector3(0,0,1),2.75),DPT=new THREE.Vector3();
function slotXY(i){return [OD-1.55+(i%6)*0.62,DROW[Math.floor(i/6)]]}
function depoTap(){if(DRGJ){DRGJ=false;return}
 const hs=ray.intersectObjects(DSTO.children,true)[0];if(hs){let o=hs.object;while(o&&o.userData.sid==null)o=o.parent;const it=o&&(G.store||[]).find(x=>x.id===o.userData.sid);if(it)storeItem(it);return}
 if(ray.intersectObject(DHIT)[0])openDepo()}
function storeItem(it){openSheet('item',`<h3>${pr(it).ad}</h3><p>${desc(it)} · ${'★'.repeat(it.stars)} · Depoda</p><div class="pk"><button class="btn g" id="tvB">Vitrine koy</button></div>`+closeBtn);wire();$('tvB').onclick=()=>{if(toVit(it)){closeSheet();toast('Vitrine kondu',1100)}}}
addEventListener('pointerdown',e=>{if(view!=='depo'||switching||e.target!==canvas||G.phase==='craft')return;setRay(e);const vis=DEP.filter(d=>d.o.visible).map(d=>d.o),h=ray.intersectObjects(vis,true)[0];if(!h)return;let o=h.object;while(o&&!vis.includes(o))o=o.parent;const d=DEP.find(x=>x.o===o);if(!d)return;
 e.stopImmediatePropagation();DRG={d,id:e.pointerId,x0:e.clientX,y0:e.clientY,mv:false};DRGJ=true;d.l.el.classList.add('rdy');sfx.tap()},true);
addEventListener('pointermove',e=>{if(!DRG||e.pointerId!==DRG.id)return;e.stopImmediatePropagation();if(Math.hypot(e.clientX-DRG.x0,e.clientY-DRG.y0)>6)DRG.mv=true;setRay(e);if(ray.ray.intersectPlane(DPL,DPT)){const o=DRG.d.o;o.position.set(clamp(DPT.x,OD-1.9,OD+1.9),clamp(DPT.y-0.1,0.3,3.5),-2.72);DRG.d.l.pos.set(o.position.x,o.position.y+0.02,-2.5)}},true);
function dragEnd(e){if(!DRG||(e&&e.pointerId!==DRG.id))return;e&&e.stopImmediatePropagation();const d=DRG.d;d.l.el.classList.remove('rdy');const mv=DRG.mv;DRG=null;setTimeout(()=>DRGJ=false,50);
 if(!mv){toast('Malzemeyi tutup istediğin rafa sürükle',1400);depoSync(true);return}
 const px=d.o.position.x,py=d.o.position.y;let bi=0,bd=1e9;for(let i=0;i<30;i++){const [x,y]=slotXY(i),dd=Math.hypot(x-px,(y-py)*1.2);if(dd<bd){bd=dd;bi=i}}
 const SL=G.dSlot||(G.dSlot={}),old=SL[d.k],other=Object.keys(SL).find(k=>SL[k]===bi&&k!==d.k);if(other!=null)SL[other]=old;SL[d.k]=bi;sfx.drop();depoSync(true);save()}
addEventListener('pointerup',dragEnd,true);addEventListener('pointercancel',dragEnd,true);
function depoSync(force){let ch=!!force;DEP.forEach(d=>{const n=G.inv[d.k];if(n!==d.n){d.n=n;ch=true;d.l.el.innerHTML=`${MATS[d.k].ad} <b>${n}</b>`}});if(!ch)return;if(!G.dSlot)G.dSlot={};const SL=G.dSlot,used={};DEP.forEach(d=>{if(d.n>0&&SL[d.k]!=null&&!used[SL[d.k]]&&SL[d.k]<30)used[SL[d.k]]=d.k;else if(!(d.n>0))delete SL[d.k];else delete SL[d.k]});DEP.forEach(d=>{if(d.n>0&&SL[d.k]==null){for(let i=0;i<30;i++)if(!used[i]){used[i]=d.k;SL[d.k]=i;break}}});let j=0;DEP.forEach(d=>{const on=d.n>0&&SL[d.k]!=null;j=on?SL[d.k]:0;d.o.visible=on;d.l.off=!on;if(on){const x=OD-1.55+(j%6)*0.62,y=DROW[Math.floor(j/6)];d.o.position.set(x,y,-2.9);d.l.pos.set(x,y+0.02,-2.62);j++}})}

/* ---------- oyun durumu ---------- */
const G={gold:180,rep:0,n:1,inv:{},order:null,phase:'idle',step:null,tier:1,first:true,deliv:[],market:[],mktT:0,disc:1,haggled:false};
Object.assign(G,{st:{deliv:0,five:0,earned:0,coll:0,proc:0,harv:0,lost:0,plots:0,sold:0},cat:{},stock:[],sid:0,ach:{},unl:['cuzdan','kemer','ayakkabi'],shop:{ad:'Benim Dükkanım',logo:'star',col:'#a3302a'},snd:true,mus:true,open:true,stLv:{},started:false,day:1,tm:0,night:false,ds:null});
Object.keys(MATS).forEach(k=>G.inv[k]=0);
Object.assign(G.inv,{deri:1,iplik:1,boya_kahve:1,hamderi:1,pamuk:2,tutkal:1});
const TIERS={1:0,2:35,3:100};
const unlocked=p=>G.tier>=p.tier&&(!p.after||((G.cat[p.after[0]]||{n:0}).n>=p.after[1]))&&(!p.tools||p.tools.every(t=>G.eq&&G.eq[t]&&G.eq[t].own));
const ACH=[{id:'ilk',ad:'İlk satış',desc:'Bir sipariş teslim et',get:()=>G.st.deliv,goal:1,gold:20},{id:'bes',ad:'Usta işi',desc:'5 yıldızlı bir ürün yap',get:()=>G.st.five,goal:1,gold:30},
{id:'on',ad:'Mahallenin ustası',desc:'10 sipariş teslim et',get:()=>G.st.deliv,goal:10,gold:80},{id:'muk',ad:'Kusursuz el',desc:'5 kez 5 yıldız al',get:()=>G.st.five,goal:5,gold:100},
{id:'zen',ad:'Dolu kasa',desc:'Toplam 1000 altın kazan',get:()=>G.st.earned,goal:1000,gold:100},{id:'top',ad:'Toplayıcı',desc:'50 malzeme topla',get:()=>G.st.coll,goal:50,gold:50},
{id:'isl',ad:'Çalışkan atölye',desc:'Atölyede 20 üretim yap',get:()=>G.st.proc,goal:20,gold:60},{id:'cif',ad:'Çiftçi',desc:'10 hasat yap',get:()=>G.st.harv,goal:10,gold:60},
{id:'ara',ad:'Toprak sahibi',desc:'3 arazi satın al',get:()=>G.st.plots,goal:3,gold:80},{id:'kol',ad:'Tam koleksiyon',desc:'Tüm ürünleri başarıyla üret',get:()=>Object.keys(G.cat).length,goal:PRODS.length,gold:300},
{id:'vit',ad:'Vitrin satıcısı',desc:'Vitrinden 5 ürün sat',get:()=>G.st.sold,goal:5,gold:60},{id:'k3',ad:'Büyük usta',desc:'Kademe 3 ol',get:()=>G.tier,goal:3,gold:150}];
function checkAch(){ACH.forEach(a=>{if(!G.ach[a.id]&&a.get()>=a.goal){G.ach[a.id]=1;G.gold+=a.gold;hud();toast(`Başarım: ${a.ad}<br>+${a.gold} altın`,2400);sfx.fan()}})}
function checkUnl(){PRODS.filter(unlocked).forEach(p=>{if(!G.unl.includes(p.id)){G.unl.push(p.id);setTimeout(()=>{toast(`Yeni ürün açıldı: ${p.ad}`,2600);sfx.fan()},2300)}})}
const SKOF=n=>n==='1'?'kraft-save-v1':'kraft-save-v1-s'+n,SSLOT=(()=>{try{return localStorage.getItem('arasta-slot')||'1'}catch(e){return '1'}})(),SK=SKOF(SSLOT);
function slotInfo(n){try{const d=JSON.parse(localStorage.getItem(SKOF(n)));if(!d)return null;return {ad:(d.shop&&d.shop.ad)||'Dükkanım',day:d.day||1,gold:d.gold||0,tier:d.tier||1}}catch(e){return null}}
function goSlot(n){try{localStorage.setItem('arasta-slot',n)}catch(e){}save();save=()=>{};location.reload()}
function newSlot(){for(const n of ['1','2','3'])if(!slotInfo(n)&&n!==SSLOT){goSlot(n);return true}return false}
function exportSave(){save();try{return 'ARS1.'+btoa(unescape(encodeURIComponent(localStorage.getItem(SK))))}catch(e){return ''}}
function importSave(code){try{code=code.trim();if(!code.startsWith('ARS1.'))return false;const j=decodeURIComponent(escape(atob(code.slice(5))));JSON.parse(j);localStorage.setItem(SK,j);save=()=>{};location.reload();return true}catch(e){return false}}let saveN=0;
let save=function(){try{localStorage.setItem(SK,JSON.stringify({ts:Date.now(),cloud:G.cloud||null,gold:G.gold,rep:G.rep,n:G.n,inv:G.inv,tier:G.tier,first:G.first,st:G.st,cat:G.cat,stLv:G.stLv,stock:G.stock,sid:G.sid,ach:G.ach,unl:G.unl,shop:G.shop,owner:G.owner||false,deco:G.deco,eq:G.eq,cap:G.cap,store:G.store,dOrd:G.dOrd,dSlot:G.dSlot,cirak:G.cirak||false,dq:G.dq||null,stSp:G.stSp||{},acct:G.acct||null,notif:G.notif||false,tut:G.tut||0,vol:G.vol!=null?G.vol:1,vib:G.vib!==false,trak:G.trak||false,stLast:G.stLast||{},kervan:G.kervan||null,reg:G.reg||[],cup:G.cup||null,deliv:G.deliv,ext:G.ext,qs:qSer(),stJ:Object.fromEntries(ST.map(s=>[s.id,{jobs:s.jobs.map(j=>({ri:s.rec.indexOf(j.r),end:j.end})),ready:s.ready||null}])),collT:COLL.map(o=>{const c=o.userData.coll;return !c.alive&&isFinite(c.t)?c.t:0}),gu:G.gu,stB:G.stB,snd:G.snd,mus:G.mus,open:G.open,daily:G.daily,streak:G.streak,day:G.day,tm:G.tm,night:G.night,ds:G.ds,plots:PL.map(o=>({own:o.own,seed:o.seed,w:!!o.w,rem:o.seed&&o.w?Math.max(0,o.end-NOW()):0,end:o.seed&&o.w?o.end:0}))}))}catch(e){}};
{const s0=save;save=function(){s0();cloudPush()}}
const CL={u:'https://rytrhkpmsfskiyoujyyb.supabase.co/rest/v1/rpc/',k:'sb_publishable_I_rw47M8KquQV6XTLm2LYg_KEckXVj7'};
function rpc(fn,body,ka){return fetch(CL.u+fn,{method:'POST',keepalive:!!ka,headers:{apikey:CL.k,'Content-Type':'application/json'},body:JSON.stringify(body)}).then(r=>r.ok?r.json():Promise.reject(r.status))}
let clT=0,clDirty=false;
function cloudPush(force,ka){if(!G.cloud)return Promise.resolve(false);clDirty=true;const now=Date.now();if(!force&&now-clT<20000)return Promise.resolve(false);clT=now;clDirty=false;let d;try{d=JSON.parse(localStorage.getItem(SK))}catch(e){return Promise.resolve(false)}return rpc('arasta_put',{p_code:G.cloud,p_data:d},ka).then(r=>{G.clOk=Date.now();return r}).catch(()=>{clDirty=true;return false})}
setInterval(()=>{if(clDirty)cloudPush(true)},25000);document.addEventListener('visibilitychange',()=>{if(document.hidden&&G.cloud){try{localStorage.getItem(SK)&&cloudPush(true,true)}catch(e){}}});
function newCode(){const A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',r=crypto.getRandomValues(new Uint32Array(12));let c='';r.forEach(x=>c+=A[x%A.length]);return c}
const fmtCode=c=>c.replace(/(.{4})(?=.)/g,'$1-'),normCode=c=>(c||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
function cloudLoadInto(code){code=normCode(code);if(code.length!==12)return Promise.resolve('bad');return rpc('arasta_get',{p_code:code}).then(d=>{if(!d)return 'none';d.cloud=code;let tgt=SSLOT;const cur=slotInfo(SSLOT);let curCode=null;try{curCode=JSON.parse(localStorage.getItem(SK)).cloud}catch(e){}if(cur&&curCode!==code){tgt=['1','2','3'].find(n=>!slotInfo(n));if(!tgt)return 'full'}localStorage.setItem(SKOF(tgt),JSON.stringify(d));localStorage.setItem('arasta-slot',tgt);save=()=>{};location.reload();return 'ok'}).catch(()=>'net')}
const STC={pres:120,cark:100,dokuma:120,ors:200,testere:300};
const GLK={'Ceviz ağacı':[1,40],'Böğürtlen':[1,50],'Kök boya':[1,60],'Lavanta':[1,70],'Arı kovanı':[2,120],'Koyun':[1,80],'Tavuk':[1,60],'Domuz':[1,50],'Paşa':[1,40],'İnek':[2,150],'Keçi':[2,120],'Tavşan':[2,100],'İpek böceği':[2,150],'At':[2,200],'Taş ocağı':[1,60],'Kil çukuru':[1,50],'Söğüt':[1,60],'Kum':[2,80],'Geyik':[3,250],'Oduncu kulübesi':[3,150],'Kömür ocağı':[2,90],'Balık gölü':[2,100],'Hindistan cevizi':[2,120]};
var TRACT=null;let buyArm=null,buyT=0;
function stOwned(s){return !STC[s.id]||!!(G.stB&&G.stB[s.id])}
function armBuy(key,txt){if(buyArm===key&&tt<buyT)return true;buyArm=key;buyT=tt+3;toast(txt+'<br>Onaylamak için tekrar dokun',2200);return false}
function buyStation(s){if(G.tier<s.tier){toast(`${s.ad} ${s.tier}. kademede açılır`,1500);return}const c=STC[s.id];if(G.gold<c){toast(`${s.ad} için ${c} altın gerekli`,1500);return}if(!armBuy('st'+s.id,`${s.ad} kurulsun mu? ${c} altın`))return;G.gold-=c;G.stB[s.id]=1;sfx.coin();sfx.fan();buyArm=null;toast(`${s.ad} kuruldu!`,1500);s.lbl.last='';save();refresh()}
function gOpen(ad){return !GLK[ad]||!!(G.gu&&G.gu[ad])}
function nearP(x,z){let b=null,bd=1e9;PATCHES.forEach(p=>{const d=Math.hypot(p.cx-x,p.cz-z);if(d<bd){bd=d;b=p}});return b}
function lockInit(){if(!G.gu){G.gu={};G.stB={};if(G.day>1||G.tier>1||G.st.deliv>0){Object.entries(GLK).forEach(([k,v])=>{if(v[0]<=G.tier)G.gu[k]=1});Object.keys(STC).forEach(id=>{const s=ST.find(x=>x.id===id);if(s&&s.tier<=G.tier)G.stB[id]=1})}}
 COLL.forEach(o=>{const c=o.userData.coll,x=o.position.x,z=o.position.z;c.src=c.mat==='atkili'?'At':c.mat==='boynuz'?'Geyik':c.mat==='kutuk'&&x>OB+5?'Oduncu kulübesi':nearP(x,z).ad});
 ANIMS.forEach(g=>{g.userData.src=nearP(g.position.x,g.position.z).ad});
 PATCHES.forEach(p=>{if(GLK[p.ad])p.el.onclick=()=>buyPatch(p)});gSync()}
function gSync(){COLL.forEach(o=>{const c=o.userData.coll,op=gOpen(c.src);if(!op){c.alive=false;c.t=Infinity;o.visible=false}else if(c.t===Infinity){c.t=tt}});ANIMS.forEach(g=>{g.visible=gOpen(g.userData.src)});
 PATCHES.forEach(p=>{const L=GLK[p.ad];if(!L)return;const op=gOpen(p.ad);p.el.classList.toggle('stl',!op);p.el.classList.toggle('lock',!op&&G.tier<L[0]);const t=op?p.ad:`🔒 ${p.ad}<small>${G.tier<L[0]?'Kademe '+L[0]:L[1]+' altın'}</small>`;if(t!==p.last){p.last=t;p.el.innerHTML=t}})}
function buyPatch(p){if(gOpen(p.ad)||switching)return;const L=GLK[p.ad];if(G.tier<L[0]){toast(`${p.ad} ${L[0]}. kademede açılır`,1500);return}if(G.gold<L[1]){toast(`${p.ad} için ${L[1]} altın gerekli`,1500);return}if(!armBuy('g'+p.ad,`${p.ad} açılsın mı? ${L[1]} altın`))return;G.gold-=L[1];G.gu[p.ad]=1;buyArm=null;sfx.coin();sfx.plant();toast(`${p.ad} açıldı!`,1500);gSync();save();refresh()}
/* ---------- ekipmanlar ---------- */
const EQ=[{id:'makas',ad:'Makas',e:'✂️',d:'Deri, kumaş ve iplik keser',m:'scissors2'},{id:'testere',ad:'El testeresi',e:'🪚',d:'Ahşap ve boynuz gibi sert malzemeyi keser',m:'saw2'},{id:'bicak',ad:'Kesim bıçağı',e:'🔪',d:'Kil, sabun ve mum keser; deriyi inceltir, oyar',m:'knife'},
 {id:'igne',ad:'İğne ve biz',e:'🪡',d:'Dikiş ve delik açma'},{id:'tutkalf',ad:'Tutkal fırçası',e:'🖌️',d:'Tutkal ve çamur sürme'},{id:'zimpara',ad:'Zımpara takozu',e:'🧱',d:'Yüzey zımparası'},{id:'cila',ad:'Cila bezi',e:'🧽',d:'Cila, parlatma, şekillendirme'},
 {id:'firca',ad:'Boya fırçası',e:'🎨',d:'Tasarım boyaması'},{id:'pres',ad:'El presi',e:'🗜️',d:'Pres, katlama, ütü, doldurma'},
 {id:'kompresor',ad:'Hava kompresörü',e:'💨',d:'Top ve şişme ürünleri şişirir',buy:[250,20]},{id:'havya',ad:'Havya ve pürmüz',e:'🔥',d:'Cam ve plastiği ısıtıp şekillendirir, lehimler',buy:[300,30],m:'solder'}];
const EQLV=['','Basit','Usta','Ustalık'],EQDUR=[0,20,35,50],EQREN=[0,15,30,50],EQUP=[0,0,[120,15],[280,40]],EQICON={};
function eqS(id){if(!G.eq)G.eq={};const e=EQ.find(x=>x.id===id);if(!G.eq[id])G.eq[id]=e.buy?{own:0,lv:1,dur:EQDUR[1]}:{own:1,lv:1,dur:EQDUR[1]};return G.eq[id]}
const eqOwn=id=>!!eqS(id).own,eqMul=id=>{const s=id&&G.eq&&G.eq[id];return s&&s.own?1+0.25*(s.lv-1):1};
function stepTool(s,p){if(s.tool)return s.tool;const k=s.k;if(s.t==='trace')return p.cut==='kn'?'bicak':p.hard?'testere':'makas';if(s.t==='rhythm')return k==='yapistir'?'tutkalf':'igne';if(s.t==='rub')return k==='zimpara'?'zimpara':(k==='incelt'||k==='oy')?'bicak':(k==='cila'||k==='parlat'||k==='sekil')?'cila':null;if(s.t==='hold')return 'pres';if(s.t==='design')return K&&K.p.need.boya?'firca':null;return null}
function eqUse(id){const s=eqS(id),e=EQ.find(x=>x.id===id);if(!s.own||G.owner)return;if(s.dur>0)s.dur--;if(s.dur<=0)toast(`${e.e} ${e.ad} köreldi!<br>Menü › Ekipmanlar'dan yenile`,2200);else if(s.dur<=5)toast(`${e.e} ${e.ad} yıpranıyor · ${s.dur} kullanım kaldı`,1500);eqBadge()}
function eqBadge(){const b=$('menuB');if(b)b.classList.toggle('warn',EQ.some(e=>{const s=G.eq&&G.eq[e.id];return s&&s.own&&s.dur<=5}))}
function eqScore(s){const id=K&&K.tool;if(!id||!G.eq||!G.eq[id]||!G.eq[id].own)return s;const st=G.eq[id];if(st.dur<=0)return s*0.6;return s>0?Math.min(1,s+0.06*(st.lv-1)):s}
function eqIcons(){EQ.forEach(e=>{if(e.m&&!EQICON[e.id])glb(e.m,g=>{try{const o=g.scene.clone();EQICON[e.id]=snap(o)}catch(x){}})})}
function renderEq(){let h='<p style="font-size:12px;margin:0 0 6px;opacity:.8">Aletlerin her kullanımda yıpranır. Körelen alet kötü iş çıkarır, yenile. Geliştirilen alet daha temiz iş çıkarır.</p>';
 EQ.forEach(e=>{const s=eqS(e.id),mx=EQDUR[s.lv],up=EQUP[s.lv+1],ic=EQICON[e.id]?`<img class="ic" src="${EQICON[e.id]}" alt="">`:`<div class="ic" style="display:grid;place-items:center;font-size:24px">${e.e}</div>`;
  if(!s.own){h+=`<div class="row">${ic}<div class="n">${e.ad}<small>${e.d}</small><small>Gerekli: ${e.buy[0]} altın · itibar ${e.buy[1]}</small></div><button class="btn g" data-eb="${e.id}" ${G.gold<e.buy[0]||G.rep<e.buy[1]?'disabled':''}>Satın al</button></div>`;return}
  const pc=Math.max(0,s.dur/mx*100),col=s.dur<=0?'#b5533c':s.dur<=5?'#d9a23a':'var(--tl)';
  h+=`<div class="row" style="flex-wrap:wrap">${ic}<div class="n">${e.ad} <span style="font-size:11px;color:var(--tr)">${EQLV[s.lv]}${s.lv>1?' · +%'+(s.lv-1)*6+' kalite':''}</span><small>${e.d}</small><div class="bar"><i style="width:${pc}%;background:${col}"></i></div><small>${s.dur<=0?'Köreldi!':s.dur+'/'+mx+' kullanım'}</small></div>
  <div style="display:flex;flex-direction:column;gap:4px">${s.dur<mx?`<button class="btn ${s.dur<=5?'r':'l'}" data-er="${e.id}" ${G.gold<EQREN[s.lv]?'disabled':''}>Yenile · ${EQREN[s.lv]}</button>`:''}${up?`<button class="btn l" data-eu="${e.id}" ${G.gold<up[0]||G.rep<up[1]?'disabled':''}>${EQLV[s.lv+1]} · ${up[0]} altın${G.rep<up[1]?' · itibar '+up[1]:''}</button>`:''}</div></div>`});return h}
function wireEq(){ui.sheet.querySelectorAll('[data-er]').forEach(b=>b.onclick=()=>{const s=eqS(b.dataset.er),c=EQREN[s.lv];if(G.gold<c)return;G.gold-=c;s.dur=EQDUR[s.lv];sfx.coin();toast('Yenilendi',1000);eqBadge();save();refresh();renderMenu()});
 ui.sheet.querySelectorAll('[data-eu]').forEach(b=>b.onclick=()=>{const s=eqS(b.dataset.eu),u=EQUP[s.lv+1];if(!u||G.gold<u[0]||G.rep<u[1])return;G.gold-=u[0];s.lv++;s.dur=EQDUR[s.lv];sfx.coin();sfx.fan();toast(`${EQ.find(x=>x.id===b.dataset.eu).ad}: ${EQLV[s.lv]} seviye!`,1500);eqBadge();save();refresh();renderMenu()});
 ui.sheet.querySelectorAll('[data-eb]').forEach(b=>b.onclick=()=>{const e=EQ.find(x=>x.id===b.dataset.eb),s=eqS(e.id);if(G.gold<e.buy[0]||G.rep<e.buy[1])return;G.gold-=e.buy[0];s.own=1;s.dur=EQDUR[1];sfx.coin();sfx.fan();toast(`${e.ad} alındı! Yeni ürünlerin önü açıldı`,1800);save();refresh();renderMenu()})}

function load(){try{const d=JSON.parse(localStorage.getItem(SK));if(!d)return;G.qsL=Array.isArray(d.qs)&&d.qs.length?d.qs:null;G.qsT=d.ts||Date.now();['gold','rep','n','tier','first','snd','mus','open','daily','streak','day','tm','night','ds','cloud','gu','stB','deco','eq','cap','store','dOrd','owner','dSlot','deliv','ext','cirak','trak','stLast','dq','tut','vol','vib','stSp','acct','notif','kervan','reg','cup'].forEach(k=>{if(d[k]!=null)G[k]=d[k]});{const aw=d.ts?(Date.now()-d.ts)/1000:0;let jobs=0;if(d.stJ)Object.values(d.stJ).forEach(q=>(q.jobs||[]).forEach(j=>{if(j.end<=NOW())jobs++}));let plots=0;(d.plots||[]).forEach(q=>{if(q.seed&&q.w&&q.end&&q.end<=NOW())plots++});const kv=d.kervan&&d.kervan.trip&&d.kervan.trip.end<=NOW()?d.kervan.trip.gold:0;let coll=0;(d.collT||[]).forEach(t=>{if(t&&t<=NOW())coll++});const dl=(d.deliv||[]).some(x=>x.end<=NOW());G.away={secs:aw,jobs,plots,kervan:kv,coll,deliv:dl}}if(d.stJ)ST.forEach(s=>{const q=d.stJ[s.id];if(!q)return;s.jobs=(q.jobs||[]).filter(j=>s.rec[j.ri]).map(j=>({r:s.rec[j.ri],end:j.end}));s.ready=q.ready||null});if(d.collT)setTimeout(()=>d.collT.forEach((t,i)=>{const o=COLL[i];if(!o||!t||t<=NOW())return;const c=o.userData.coll;if(!c.alive)return;c.alive=false;c.t=t;o.visible=false}),0);Object.assign(G.inv,d.inv);Object.assign(G.st,d.st);G.cat=d.cat||{};G.stLv=d.stLv||{};G.stock=(d.stock||[]).filter(it=>PRODS.some(p=>p.id===it.pid));G.sid=d.sid||0;G.ach=d.ach||{};G.unl=d.unl||G.unl;Object.assign(G.shop,d.shop);
(d.plots||[]).forEach((q,i)=>{const o=PL[i];if(!o)return;o.own=!!q.own;o.seed=CROPS[q.seed]?q.seed:null;o.w=!!q.w;if(o.seed){o.dur=CROPS[o.seed].s;o.end=q.end||(NOW()+(q.rem||0))}})}catch(e){}}
const tierOf=r=>r>=TIERS[3]?3:r>=TIERS[2]?2:1;
const MARKET=[{k:'hamderi',f:18},{k:'deri',f:38},{k:'iplik',f:14},{k:'taban',f:16},{k:'toka',f:14},{k:'kaucuk',f:12},{k:'kurum',f:6},{k:'tutkal',f:5},
{k:'pirinc',f:18,t:2},{k:'bakir',f:22,t:2},{k:'koza',f:18,t:2},{k:'demir',f:26,t:3},{k:'kumas',f:30,t:2},{k:'kutuk',f:12,t:3},{k:'balmumu',f:8,t:3}];
const SUPPLY=[{items:{hamderi:5},f:70},{items:{kaucuk:5},f:50},{items:{pirinc:3},f:45,t:2},{items:{kutuk:5},f:45,t:3}];
const DELAY=40;
let tt=0;const NOW=()=>Date.now()/1000;
function restock(){G.market=MARKET.filter(m=>!m.t||G.tier>=m.t).map(m=>({k:m.k,f:Math.max(2,Math.round(m.f*(0.85+Math.random()*0.35))),st:1+Math.floor(Math.random()*5)}));G.mktT=tt+90;G.disc=1;G.haggled=false}
restock();

const ui={gold:$('gold'),rep:$('rep'),tier:$('tierP'),card:$('card'),tip:$('tip'),bub:$('bubble'),act:$('actions'),modal:$('modal'),sheet:$('sheet'),toast:$('toast'),fade:$('fade')};
const show=(el,on)=>el.classList.toggle('hide',!on);
let toastT=0;function toast(t,ms){ui.toast.innerHTML=t;show(ui.toast,true);clearTimeout(toastT);toastT=setTimeout(()=>show(ui.toast,false),ms||1600)}
function say(t){if(!t){show(ui.bub,false);return}ui.bub.innerHTML=t;show(ui.bub,view==='home')}
function tip(t){if(!t){show(ui.tip,false);return}ui.tip.innerHTML=t;show(ui.tip,true)}
function btn(label,cls,fn,dis){const b=document.createElement('button');b.className='btn '+(cls||'');b.innerHTML=label;if(fn)b.onclick=fn;if(dis)b.disabled=true;return b}
function actions(list){ui.act.innerHTML='';list.forEach(b=>ui.act.appendChild(b))}
const paintOf=id=>PAINTS.find(p=>p.id===id);
const anyPaint=()=>PAINTS.some(p=>G.inv['boya_'+p.id]>0);
function hasNeed(p){return Object.entries(p.need).every(([k,n])=>k==='boya'?anyPaint():G.inv[k]>=n)}
function hasAll(o){return Object.entries(o).every(([k,n])=>G.inv[k]>=n)}
function giveAll(o,s){Object.entries(o).forEach(([k,n])=>G.inv[k]+=n*(s||1))}
function hud(){ui.gold.textContent=G.gold;ui.rep.textContent=G.rep;ui.tier.textContent='K'+G.tier+' · '+clockTxt()+' '+WX[wx].ic}
function clockTxt(){if(G.night)return 'Akşam';const m=480+Math.floor(G.tm),h=Math.floor(m/60);return (h<10?'0':'')+h+':'+String(m%60).padStart(2,'0')}
function renderCard(){const o=G.order;if(!o||G.phase==='craft'||G.phase==='result'){show(ui.card,false);return}
if(o.buy){const it=G.stock.find(x=>x.id===o.buy);ui.card.innerHTML=`<h4>Vitrin müşterisi</h4>${it?desc(it)+' · '+it.price+' altın':'Ürün satılmış'}`;show(ui.card,true);return}
const rows=Object.entries(o.p.need).map(([k,n])=>{if(k==='boya'){const want=G.inv['boya_'+o.color.id]>0;return `<div class="${want?'ok':anyPaint()?'mid':'no'}">${want?'✓':anyPaint()?'~':'✗'} ${o.color.ad} boya</div>`}
const ok=G.inv[k]>=n;return `<div class="${ok?'ok':'no'}">${ok?'✓':'✗'} ${MATS[k].ad}${n>1?' ×'+n:''} <span style="opacity:.6">(${G.inv[k]})</span></div>`}).join('');
if(view!=='home'){const miss=Object.entries(o.p.need).filter(([k,n])=>k==='boya'?G.inv['boya_'+o.color.id]<1:G.inv[k]<n).map(([k])=>k==='boya'?o.color.ad+' boya':MATS[k].ad);
ui.card.innerHTML=`<h4>${o.p.ad}</h4>${miss.length?'<span class="no">Eksik: '+miss.join(', ')+'</span>':'<span class="ok">Malzemeler tamam</span>'}`;show(ui.card,true);return}
ui.card.innerHTML=`<h4>Sipariş #${G.n} · ${o.p.ad}</h4>${o.color?o.color.ad:'Doğal'}${o.style?' · '+o.style:''} · ${o.budget} altın${o.hurry?' · <span class="mid">Acele</span>':''}<div style="margin-top:3px;display:flex;flex-wrap:wrap;column-gap:10px">${rows}</div>`;show(ui.card,true)}
function refresh(){{let e=$('exitC');if(!e){e=document.createElement('button');e.id='exitC';e.innerHTML='<b>✕</b>Çık';(ui.act&&ui.act.parentNode||document.body).appendChild(e);e.onclick=exitTap}show(e,G.phase==='craft');if(G.phase!=='craft'){e.classList.remove('exa');e.innerHTML='<b>✕</b>Çık'}}hud();renderCard();show($('zoom'),zoomable());depoSync();{const ob=$('openB');show(ob,view==='home'&&G.phase!=='craft'&&G.phase!=='result');ob.textContent=G.night?'Akşam':G.open?'Açık':'Kapalı';ob.classList.toggle('cl',G.night||!G.open)}const busy=G.phase==='craft'||G.phase==='result';
document.querySelectorAll('#nav button').forEach(b=>{b.disabled=busy;b.classList.toggle('on',b.dataset.v===view||(b.dataset.v==='home'&&view==='bench')||(b.dataset.v==='depo'&&view==='vitrin'))});
{const vb=$('vitB');show(vb,view==='home'&&!busy);vb.textContent=`Vitrin ${G.stock.length}/${G.owner?'∞':vitCap()}`}
if(view==='vitrin'){if(G.phase==='ordering'&&G.order&&G.order.buy)buyActions();else actions([btn('Yeni ürün yap','l',openFree,G.phase!=='idle'),btn('Dükkana dön','g',()=>go('home'))])}
else if(G.phase==='active'&&view==='home'){const m=matchStock(G.order),L=hasNeed(G.order.p)?[btn('Tezgaha geç','g',startCraft)]:[btn('Malzeme eksik','l',()=>toast('Eksikleri Pazar, Bahçe ve Atölye\'den tamamla',2000)),btn('İptal et','r',cancelOrder)];if(m)L.push(btn('Raftan ver '+'★'.repeat(m.stars),'l',()=>stockDeliver(m)));actions(L)}
else if(G.phase==='idle'&&view==='home')actions(G.night&&!Q.length?[btn('Günü bitir','g',endDay),btn('Serbest üret','l',openFree)]:[btn('Serbest üret','l',openFree)]);
else if(G.phase==='idle')actions([]);
else if(G.phase==='active')actions([]);}
let switching=false;
function go(v){if(v===view||G.phase==='craft'||switching)return;switching=true;sfx.swoosh();PT.clear();tap=pinch=null;ui.fade.style.opacity=1;setTimeout(()=>{view=v;setLights(v);ZM.z=ZM.t=1;ZM.px=ZM.pz=0;sway=v==='home'?1:0.3;
const T=VIEWS[v];camCur.l.copy(T.l);camCur.p.copy(T.p).sub(T.l).multiplyScalar(1.14).add(T.l);moveCam(T,0.75);
show(ui.bub,v==='home'&&ui.bub.innerHTML&&(G.phase==='ordering'||G.phase==='result'||G.bubOn));refresh();if(G.phase==='ordering'&&v!=='home'&&v!=='vitrin')actions([]);else if(G.phase==='ordering'&&v==='home')orderActions();
tip(null);if(v==='islik')toast('Bir araca ya da etiketine dokun',1400);else if(v==='bahce')toast('Toplamak için dokun<br>Alttan bölge seç',1800);else if(v==='pazar')toast('Bir tezgaha dokun',1300);else if(v==='vitrin')toast(G.stock.length?'Fiyatını değiştirmek için ürüne dokun':'Vitrin boş<br>Yeni ürün yap ile doldur',1700);else if(v==='depo')toast('Liste için raflara dokun',1400);
switching=false;requestAnimationFrame(()=>ui.fade.style.opacity=0)},190)}
let ZONE=0;function setZone(z){if(z===ZONE||switching)return;ZONE=z;sfx.tap();document.querySelectorAll('#zones button').forEach(b=>b.classList.toggle('on',+b.dataset.z===z));const T=VIEWS.bahce;T.p.x=T.l.x=OB+z*11;ZM.z=ZM.t=1;ZM.px=ZM.pz=0;moveCam(T,0.7);
toast(['Çiftlik: süt, tüy, yün, at kılı','Bostan: tarlalar, bitkiler, kovan','Orman: taş, kil, kum, söğüt, boynuz'][z+1],1500)}
document.querySelectorAll('#zones button').forEach(b=>b.onclick=()=>setZone(+b.dataset.z));document.querySelectorAll('#dtabs button').forEach(b=>b.onclick=()=>{sfx.tap();go(b.dataset.v)});
document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>{go(b.dataset.v)});

/* ---------- ses ---------- */
let AC=null,NB=null,sT=0;
function ac(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();if(AC)loadSounds()}
document.addEventListener('pointerdown',ac,true);
function tone(f,d,type,vol,f2,delay){const a=AC;if(!a||!G.snd)return;const t=a.currentTime+(delay||0),o=a.createOscillator(),g=a.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);
g.gain.setValueAtTime(vol||0.15,t);g.gain.exponentialRampToValueAtTime(0.001,t+d);o.connect(g);g.connect(OUT());o.start(t);o.stop(t+d+0.02)}
function noise(d,vol,freq,q,delay,f2){const a=AC;if(!a||!G.snd)return;if(!NB){NB=a.createBuffer(1,a.sampleRate,a.sampleRate);const ch=NB.getChannelData(0);for(let i=0;i<ch.length;i++)ch[i]=Math.random()*2-1}
const t=a.currentTime+(delay||0),s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=NB;s.loop=true;f.type='bandpass';f.frequency.setValueAtTime(freq||1000,t);if(f2)f.frequency.exponentialRampToValueAtTime(f2,t+d);f.Q.value=q||1;
g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(vol||0.2,t+Math.min(0.012,d*0.2));g.gain.exponentialRampToValueAtTime(0.001,t+d);s.connect(f);f.connect(g);g.connect(OUT());s.start(t,Math.random()*0.5);s.stop(t+d+0.02)}
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
function musInit(){if(!AC||MU.g)return;MU.g=AC.createGain();MU.g.gain.value=0;MU.g.connect(OUT());MU.f=AC.createBiquadFilter();MU.f.type='lowpass';MU.f.frequency.value=1500;MU.f.connect(MU.g);
MU.d=AC.createDelay(1);MU.d.delayTime.value=0.43;MU.fb=AC.createGain();MU.fb.gain.value=0.3;MU.d.connect(MU.fb);MU.fb.connect(MU.d);MU.d.connect(MU.f)}
function mv(f,t,d,type,v,att,rel,dl){const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+att);g.gain.setValueAtTime(v,t+Math.max(att,d-rel));g.gain.linearRampToValueAtTime(0,t+d);
o.connect(g);g.connect(MU.f);if(dl)g.connect(MU.d);o.start(t);o.stop(t+d+0.05)}
/* ---------- ses dosyaları (sounds/list.json) ---------- */
const SB={};let sbTried=false;
function loadSounds(){if(sbTried||!AC)return;sbTried=true;fetch('sounds/list.json').then(r=>r.ok?r.json():[]).then(l=>l.forEach(n=>fetch('sounds/'+n).then(r=>r.arrayBuffer()).then(b=>AC.decodeAudioData(b,buf=>{SB[n.replace(/\.[^.]+$/,'')]=buf},()=>{})).catch(()=>{}))).catch(()=>{})}
function playB(n,vol,loop){const s=AC.createBufferSource(),g=AC.createGain();s.buffer=SB[n];s.loop=!!loop;if(!loop)s.playbackRate.value=0.95+Math.random()*0.1;g.gain.value=vol;s.connect(g);g.connect(OUT());s.start();return {s,g}}
Object.keys(sfx).forEach(k=>{const f=sfx[k];sfx[k]=function(){if(SB[k]&&AC&&G.snd){playB(k,0.7);return}return f.apply(this,arguments)}});
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

function musSched(){if(!AC||!MU.g||!G.mus||AC.state!=='running')return;const be=60/68,e=be/2;if(MU.next<AC.currentTime)MU.next=AC.currentTime+0.1;
while(MU.next<AC.currentTime+0.6){const t=MU.next,st=MU.step,ch=CH[Math.floor(st/8)%4];
if(st%8===0){ch.forEach(m=>mv(hz(m),t,be*4+0.6,'triangle',0.016,1.1,1.3,false));mv(hz(ch[0]-12),t,be*1.8,'sine',0.07,0.03,1.2,false)}
if(st%8===4)mv(hz(ch[0]-12),t,be*1.6,'sine',0.05,0.03,1.1,false);
if(st%8!==0&&Math.random()<(st%2?0.18:0.34)){const m=Math.random()<0.5?pick(PEN):ch[1+Math.floor(Math.random()*4)]+12;mv(hz(m),t,1.3,'sine',0.035,0.008,1.25,true)}
MU.next+=e;MU.step++}}
setInterval(musSched,140);
function musSet(on){G.mus=on;ac();if(AC){musInit();const t=AC.currentTime;MU.g.gain.cancelScheduledValues(t);MU.g.gain.setTargetAtTime(on?0.6:0,t,on?1.2:0.4)}const b=$('musB');if(b)b.classList.toggle('off',!on)}
document.addEventListener('visibilitychange',()=>{if(!AC)return;if(document.hidden)AC.suspend();else AC.resume()});
const sThr=(fn,gap)=>{if(tt-sT>(gap||0.07)){sT=tt;fn()}};
$('ui').addEventListener('click',e=>{if(e.target.closest('button'))sfx.tap()},true);

/* ---------- müşteri ---------- */
const DOOR=V(-1.4,0,-3.4),SLOT=[V(0.3,0,-0.45),V(-0.4,0,-1.65),V(-1.0,0,-2.7)],Q=[];let cust=null,spawnT=1.2;
const tweens=[];const ease=k=>k<0.5?2*k*k:1-((-2*k+2)**2)/2;
function tween(dur,fn,done){tweens.push({t:0,dur,fn,done})}
let camTok=0;
function moveCam(to,dur,done){const id=++camTok,fp=camCur.p.clone(),fl=camCur.l.clone();tween(dur,k=>{if(id!==camTok)return;camCur.p.lerpVectors(fp,to.p,k);camCur.l.lerpVectors(fl,to.l,k)},()=>{if(id===camTok&&done)done()})}
/* ---------- 3D modeller ---------- */
const CHR=[],ALLC=[];let DOORH=null;
function prepModel(sc,nc){sc.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;const ga=o.geometry.attributes;if(!ga.normal)o.geometry.computeVertexNormals();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if(m.userData.prep)return;m.userData.prep=1;

if(m.map){m.map.encoding=THREE.LinearEncoding;m.map.needsUpdate=true}else{if(!nc)m.color.convertLinearToSRGB().multiplyScalar(1.12);m.flatShading=true}m.roughness=0.85;m.metalness=0;m.needsUpdate=true})}})}
const NOCONV=new Set(['wb_big','bookcase_open','scissors','scissors2','wallshelf']),OVR={wb_grind:{wood:'#a8743e',woodDark:'#6b4528',metal:'#9aa0a8'},wb_kenney:{wood:'#a8743e',woodDark:'#6b4528',metal:'#9aa0a8',rock:'#e8dcc0'},handsaw:{lambert3SG:'#c4c8cc',lambert4SG:'#3a3a3a',lambert2SG:'#8a3a20'},scissors2:{Handle1Scissors1:'#b8402e',Steel1Scissors1:'#cfd3d8'},pine:{Bark_NormalTree:'#6b4a2b',Leaves_Pine:'#46733a'},m_rasp:{F44336:'#4a2350',FFFFFF:'#3f6a34'},m_coco:{_crayfishdiffuse:'#6b4a2b'},m_pondJ:{'8BC34A':'#7a9a50','4CAF50':'#6a8a44','039BE5':'#3a86c0','00BCD4':'#4aa0c8'},m_rocks:{'Material.040':'#8d8a84'},m_orn:{_crayfishdiffuse:'#c9a23a'},m_mulberry:{mat9:'#4a7a34',mat20:'#5a3a22'}},FLP=['#4f7a3a','#f2c230','#d9534f','#f4f0e6','#8a5bd0','#5f8a44','#f29ac0'],MIX=[];
function glb(n,cb){if(GLC[n]){cb(GLC[n]);return}if(!THREE.GLTFLoader)return;if(GLW[n]){GLW[n].push(cb);return}GLW[n]=[cb];
 new THREE.GLTFLoader().load('models/'+n+'.glb',g=>{prepModel(g.scene,NOCONV.has(n));let fi=0;g.scene.traverse(o=>{if(o.isMesh)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{const ov=OVR[n];if(ov&&ov[m.name])m.color.set(ov[m.name]);if(n==='scissors2'&&/Steel/.test(m.name))m.roughness=0.3;if(n==='pine'){const ps=o.geometry.attributes.position;o.geometry.computeBoundingBox();const bb=o.geometry.boundingBox,H=bb.max.y-bb.min.y,R=Math.max(bb.max.x-bb.min.x,bb.max.z-bb.min.z)/2,cx=(bb.max.x+bb.min.x)/2,cz=(bb.max.z+bb.min.z)/2,col=new Float32Array(ps.count*3),bk=new THREE.Color('#6b4a2b'),lf=new THREE.Color('#3f6a34'),lt=new THREE.Color('#5f8a44'),t=new THREE.Color();for(let i=0;i<ps.count;i++){const h=(ps.getY(i)-bb.min.y)/H,r=Math.hypot(ps.getX(i)-cx,ps.getZ(i)-cz)/R;if(h<0.3&&r<0.16)t.copy(bk);else t.copy(lf).lerp(lt,Math.min(1,h*0.9+r*0.3));col[i*3]=t.r;col[i*3+1]=t.g;col[i*3+2]=t.b}o.geometry.setAttribute('color',new THREE.BufferAttribute(col,3));m.vertexColors=true;m.color.set('#ffffff');m.needsUpdate=true}if(n==='flowers')m.color.set(FLP[fi++%FLP.length])})});
 GLC[n]=g;GLW[n].forEach(f=>f(g));GLW[n]=null},undefined,()=>{})}
function skin(o,n,opt){place(n,Object.assign({par:o,swap:1},opt,{cb:w=>{if(o.isMesh)o.material=HID}}))}
function fitM(n,o){const g=GLC[n];if(!g)return null;const m=g.scene.clone(),w=new THREE.Group();m.rotation.set(o.rx||0,0,o.rz||0);w.add(m);m.updateMatrixWorld(true);let bb=new THREE.Box3().setFromObject(m),sz=bb.getSize(V(0,0,0));m.scale.multiplyScalar(o.h?o.h/sz.y:o.w/Math.max(sz.x,sz.z));m.updateMatrixWorld(true);bb=new THREE.Box3().setFromObject(m);m.position.set(-(bb.min.x+bb.max.x)/2,-bb.min.y,-(bb.min.z+bb.max.z)/2);return w}
function place(n,o){glb(n,g=>{const sk=g.animations.length&&THREE.SkeletonUtils,m=sk?THREE.SkeletonUtils.clone(g.scene):g.scene.clone(),w=new THREE.Group();m.rotation.set(o.rx||0,0,o.rz||0);w.add(m);m.updateMatrixWorld(true);
 let bb=new THREE.Box3().setFromObject(m),sz=bb.getSize(V(0,0,0));m.scale.multiplyScalar(o.h?o.h/sz.y:o.w/Math.max(sz.x,sz.z));m.updateMatrixWorld(true);bb=new THREE.Box3().setFromObject(m);
 m.position.set(-(bb.min.x+bb.max.x)/2,-bb.min.y,-(bb.min.z+bb.max.z)/2);w.position.set(o.x||0,o.y||0,o.z||0);w.rotation.y=o.ry||0;(o.par||S).add(w);
 if(o.anim&&g.animations.length){const mx=new THREE.AnimationMixer(m),a=g.animations.find(c=>c.name===o.anim)||g.animations[0];const ac=mx.clipAction(a);ac.time=Math.random()*a.duration;ac.play();MIX.push(mx)}
 if(o.par&&o.swap)o.par.children.forEach(c=>{if(c!==w&&c.material!==HID)c.visible=false});o.cb&&o.cb(w)})}
function fitModel(o,h,ax){const bb=new THREE.Box3().setFromObject(o),sz=bb.getSize(V(0,0,0)),sc=h/sz[ax||'y'];o.scale.multiplyScalar(sc);const b2=new THREE.Box3().setFromObject(o);return b2}
if(THREE.GLTFLoader){const GL=new THREE.GLTFLoader();
['m_Casual','m_LongSleeve','m_Shirt','m_Suit','f_Casual','f_Alternative','f_Dress','f_TankTop','c_farmer','c_business','c_punk','c_astro'].forEach(n=>GL.load('models/'+n+'.glb',g=>{prepModel(g.scene);const bb=new THREE.Box3().setFromObject(g.scene);g.h=bb.max.y-bb.min.y;g.y0=bb.min.y;CHR.push(g)},undefined,()=>{}));
GL.load('models/door.glb',g=>{const d=g.scene;prepModel(d);const b=fitModel(d,2.3);d.position.set(-b.min.x,-b.min.y,-(b.min.z+b.max.z)/2);DOORH=new THREE.Group();DOORH.add(d);DOORH.position.set(-2.02,0,-3.8);DOORH.rotation.y=-1.55;S.add(DOORH)},undefined,()=>{});}
function anim(c,n,once){if(!c||!c.A||!c.A[n])return;if(c.cur===n&&!once)return;const nx=c.A[n],pv=c.A[c.cur];nx.reset();nx.setLoop(once?THREE.LoopOnce:THREE.LoopRepeat);nx.clampWhenFinished=!!once;nx.play();if(pv&&pv!==nx)pv.crossFadeTo(nx,0.3,false);c.cur=n;
 if(once){clearTimeout(c.ct);c.ct=setTimeout(()=>{if(c.cur===n)anim(c,c.walking?'walk':'idle')},nx.getClip().duration*1000+200)}}
function makeCustomer(){if(CHR.length){const src=pick(CHR),m=THREE.SkeletonUtils.clone(src.scene),w=new THREE.Group(),sc=1.72/src.h;m.scale.multiplyScalar(sc);m.position.y=-src.y0*sc;w.add(m);w.position.copy(DOOR);S.add(w);
 const mix=new THREE.AnimationMixer(m),A={};src.animations.forEach(a=>A[a.name]=mix.clipAction(a));const c={g:w,head:new THREE.Object3D(),tok:0,at:false,mix,A,cur:'idle'};if(A.idle){A.idle.time=Math.random()*3;A.idle.play()}ALLC.push(c);return c}
const g=new THREE.Group(),head=new THREE.Group();
put(g,B(0.5,0.5,0.3),M('#3a2f28'),0,0.25,0);put(g,Cy(0.28,0.36,1.05,8),M(pick(['#3f6fa8','#4f7a3a','#8a3a28','#6b4f8a','#c08a2a'])),0,1.0,0);
head.add(mesh(new THREE.SphereGeometry(0.24,12,10),M(pick(['#e8b58c','#c98d63','#f0c9a4','#9a6a48']))));
[-0.08,0.08].forEach(x=>put(head,new THREE.SphereGeometry(0.03,6,6),M('#1a1410'),x,0.04,0.21));
if(Math.random()<0.6)put(head,Cy(0.2,0.3,0.18,8),M(pick(['#5a3519','#2a2420','#7a5a3a'])),0,0.22,0);
head.position.y=1.78;g.add(head);g.position.copy(DOOR);S.add(g);const c={g,head,tok:0,at:false};ALLC.push(c);return c}
function walk(c,to,dur,done){const id=++c.tok,fr=c.g.position.clone();if(fr.distanceTo(to)>0.05)c.g.rotation.y=Math.atan2(to.x-fr.x,to.z-fr.z);c.walking=true;anim(c,'walk');tween(dur,k=>{if(id===c.tok)c.g.position.lerpVectors(fr,to,k)},()=>{if(id!==c.tok)return;c.walking=false;anim(c,'idle');done&&done()})}
function mkOrder(){const pool0=PRODS.filter(unlocked),sp=SEAS[season()].p,pool=pool0.concat(pool0.filter(x=>sp.includes(x.id)),pool0.filter(x=>sp.includes(x.id))),p=pick(pool),color=p.need.boya?pick(PAINTS):null,style=p.styles&&Math.random()<0.6?pick(p.styles):null;
if(G.first)Object.entries(p.need).forEach(([k,n])=>{const key=k==='boya'?'boya_'+color.id:k;G.inv[key]=Math.max(G.inv[key],n)});
return {p,color,style,budget:Math.round(p.base*(0.9+Math.random()*0.4)*(sp.includes(p.id)?1.2:1)/5)*5,hurry:!G.first&&Math.random()<0.15}}
function spawn(){if(Q.length>=3)return;const c=makeCustomer(),pv=G.stock.filter(x=>x.price>0);
if(!G.first&&pv.length&&Math.random()<0.45){const it=pick(pv);c.order={buy:it.id,p:PRODS.find(x=>x.id===it.pid)};c.acc=c.accMax=35;c.dead=c.deadMax=9999;c.wait=90}
else{const o=c.order=mkOrder(),h=o.hurry;if(!G.first&&(G.reg||[]).length&&Math.random()<0.3){const rg=pick(G.reg),fp=PRODS.find(x=>x.id===rg.fav);if(fp&&unlocked(fp)&&fp.id!==o.p.id){o.p=fp;o.color=fp.need.boya?pick(PAINTS):null;o.style=null;o.budget=Math.round(fp.base*(1+Math.random()*0.3)/5)*5}o.reg=rg.ad}c.acc=c.accMax=G.first?9999:h?45:75;c.dead=c.deadMax=G.first?9999:(h?150:280)+o.p.steps.length*20;c.wait=h?100:170}
c.g.visible=G.phase!=='craft';Q.push(c);cust=Q[0];hud();seat(c)}
function seat(c){const i=Q.indexOf(c);if(i<0)return;c.at=false;const to=SLOT[i];walk(c,to,Math.max(0.5,c.g.position.distanceTo(to)/1.5),()=>{c.g.rotation.y=0;c.at=true;if(Q[0]===c&&G.phase==='idle')present(c)})}
function present(c){const o=G.order=c.order;G.phase='ordering';G.bubOn=true;sfx.bell();if(o.buy){presentBuy(c,o);return}
say(`${o.reg?'<b>'+o.reg+':</b> Yine ben geldim usta! ':''}${o.hurry?'<b>Acelem var!</b> ':o.reg?'':pick(['Merhaba usta! ','İyi günler! ','Selam! '])}${o.color?o.color.ad+' ':''}${o.style?o.style.toLowerCase()+' ':''}${o.p.ad.toLowerCase()} istiyorum. Bütçem ${o.budget} altın${o.hurry?', zamanında biterse %20 fazlasını veririm':''}.`);
refresh();if(view==='home')orderActions();else toast('Dükkana müşteri geldi',1800)}
function leave(c){const i=Q.indexOf(c);if(i<0)return;Q.splice(i,1);cust=Q[0]||null;c.g.visible=G.phase!=='craft';walk(c,DOOR,2,()=>{S.remove(c.g);const j=ALLC.indexOf(c);if(j>=0)ALLC.splice(j,1);if(c.mix)c.mix.stopAllAction()});
if(i===0&&(!G.order||G.order===c.order)){G.order=null;G.phase='idle';G.bubOn=false;say(null);actions([]);refresh()}hud();Q.forEach((x,j)=>{if(j>=i)seat(x)})}
function lose(c,msg,rp){G.st.lost++;G.rep=Math.max(0,G.rep-rp);toast(rp?`${msg}<br>İtibar −${rp}`:msg,2400);sfx.bad();leave(c)}
function qSer(){try{return Q.filter(c=>c.order).map(c=>{const o=c.order,so={};for(const k in o){const v=o[k];if(k==='p')so.p=v&&v.id;else if(k==='color')so.color=v&&v.id;else if(v==null||typeof v!=='object')so[k]=v}
 return {o:so,acc:c.acc,accMax:c.accMax,dead:c.dead,deadMax:c.deadMax,wait:c.wait,act:G.order===o&&(G.phase==='active'||G.phase==='craft')}})}catch(e){return []}}
function qRestore(){const L=G.qsL;G.qsL=null;if(!L)return;const el=Math.max(0,(Date.now()-(G.qsT||Date.now()))/1000);L.slice(0,3).forEach((d,i)=>{const p=PRODS.find(x=>x.id===d.o.p);if(!p)return;
 const o=Object.assign({},d.o,{p,color:d.o.color?PAINTS.find(x=>x.id===d.o.color)||null:null});if(o.buy&&!G.stock.some(x=>x.id===o.buy))return;const c=makeCustomer();c.order=o;
 const keep=(v,mx)=>Math.max(el<600?Math.min(mx,25):0,v-el);c.accMax=d.accMax||75;c.deadMax=d.deadMax||300;c.acc=keep(d.acc!=null?d.acc:c.accMax,c.accMax);c.dead=keep(d.dead!=null?d.dead:c.deadMax,c.deadMax);c.wait=keep(d.wait!=null?d.wait:120,120);
 if((d.act?c.dead:c.acc)<=0&&i===0)return;c.g.visible=true;Q.push(c);if(i===0&&d.act&&Q.length===1){G.order=o;G.phase='active';G.bubOn=false}seat(c)});cust=Q[0]||null;hud();refresh()}
addEventListener('pagehide',()=>{try{save()}catch(e){}});document.addEventListener('visibilitychange',()=>{if(document.hidden)try{save()}catch(e){}});
function custTick(dt){if(!G.started)return;if(G.qsL&&ALLC!==undefined){qRestore()}if(G.open&&!G.night){spawnT-=dt;if(spawnT<=0){spawnT=G.first?9e9:22+Math.random()*24;spawn()}}
for(let i=Q.length-1;i>=0;i--){const c=Q[i];if(!c.at)continue;
const mine=G.order&&G.order===c.order;
if(i>0||(!mine&&G.phase!=='idle')){c.wait-=dt;if(c.wait<=0){G.st.lost++;toast('Sırada bekleyen müşteri sıkılıp gitti',1800);sfx.bad();leave(c)}}
else if(G.phase==='ordering'){if(modalMode!=='haggle')c.acc-=dt;if(c.acc<=0)lose(c,'Müşteri beklemekten sıkıldı ve gitti',1)}
else if(G.phase==='active'||G.phase==='craft'){c.dead-=dt;if(c.dead<=0){if(G.phase==='craft'){c.dead=0;if(K)K.late=true}else lose(c,'Sipariş yetişmedi, müşteri gitti',2)}}}}
function patUI(){const c=Q[0],el=$('pat');let v=-1;if(c&&c.at){if(G.phase==='ordering'&&c.accMax<9000)v=c.acc/c.accMax;else if((G.phase==='active'||G.phase==='craft')&&c.deadMax<9000)v=c.dead/c.deadMax}
show(el,v>=0);if(v>=0){const b=el.firstChild;b.style.width=(v*100)+'%';b.style.background=v>0.5?'#9be37a':v>0.25?'#ffcf3a':'#ff7a5a'}}
function setOpen(v,quiet){G.open=v;doorM.color.set(v?'#f6d38a':'#5e5044');opM.color.set(v?'#2f6b5a':'#b5533c');if(quiet)return;sfx.bell();
if(!v){toast('Dükkan kapandı<br>İçerdekiler kalır, yeni müşteri gelmez',2000)}else{if(!G.first)spawnT=Math.min(spawnT,4);toast('Dükkan açıldı',1200)}refresh();save()}
$('openB').onclick=()=>{if(G.night){toast('Akşam oldu<br>Dükkan yarın sabah açılır',1600);return}setOpen(!G.open)};
const r5=v=>Math.max(5,Math.round(v/5)*5);
const pr=it=>PRODS.find(x=>x.id===it.pid);
const itemVal=it=>pr(it).base*(0.55+0.12*it.stars);
const sugg=it=>r5(itemVal(it)*1.05);
const desc=it=>`${it.col?paintOf(it.col).ad.toLowerCase()+' ':''}${it.style?it.style.toLowerCase()+' ':''}${pr(it).ad.toLowerCase()}`;
function matchStock(o){if(!o||o.buy||o.free)return null;return G.stock.filter(it=>it.pid===o.p.id&&(!o.color||it.col===o.color.id)&&(!o.style||it.style===o.style)).sort((a,b)=>b.stars-a.stars)[0]||null}
function orderActions(){const o=G.order;if(!o)return;if(o.buy){buyActions();return}const L=[btn('Siparişi al','g',()=>acceptOrder())];if(!o.haggled)L.push(btn('Pazarlık','',haggleOrder));
const m=matchStock(o);if(m)L.push(btn('Raftan ver '+'★'.repeat(m.stars),'l',()=>stockDeliver(m)));L.push(btn('Reddet','r',rejectOrder));actions(L)}
let HG=null;
function haggle(o){HG=Object.assign({round:1},o);renderH()}
function renderH(){const h=`<h3>Pazarlık</h3><p class="hq">“${HG.line}”</p>
<div class="brk"><span>Müşterinin teklifi</span><b>${HG.offer} altın</b></div><div class="brk"><span>Tur</span><b>${HG.round} / 3</b></div>
<div class="grp">Senin istediğin fiyat</div><div class="hgv"><button class="btn l" data-hd="-5">−5</button><b id="hv">${HG.ask}</b><button class="btn l" data-hd="5">+5</button></div>
<input type="range" id="hr" min="${HG.lo}" max="${HG.hi}" step="5" value="${HG.ask}" aria-label="Fiyat">
<div class="pk" style="justify-content:center;margin-top:10px"><button class="btn g" id="hOff">Teklif ver</button><button class="btn" id="hAcc">${HG.offer} altına anlaş</button><button class="btn r" id="hBack">Vazgeç</button></div>`;
openSheet('haggle',h);const hv=$('hv'),hr=$('hr'),setA=v=>{HG.ask=clamp(v,HG.lo,HG.hi);hv.textContent=HG.ask;hr.value=HG.ask};
hr.oninput=()=>setA(+hr.value);ui.sheet.querySelectorAll('[data-hd]').forEach(b=>b.onclick=()=>setA(HG.ask+ +b.dataset.hd));
$('hOff').onclick=hOffer;$('hAcc').onclick=()=>hDeal(HG.offer);$('hBack').onclick=hBack}
function hClose(){show(ui.modal,false);modalMode=null;const h=HG;HG=null;return h}
function hBack(){if(!HG)return;const h=hClose();h.onBack&&h.onBack()}
function hDeal(p){if(!HG)return;const h=hClose();sfx.good();h.onDeal(p)}
function hOffer(){if(!HG)return;const a=HG.ask;if(a<=HG.max){hDeal(a);return}const big=a>HG.max*1.35;HG.round+=big?2:1;
if(HG.round>3){const h=hClose();sfx.bad();h.onBreak();return}
HG.offer=Math.min(HG.max,r5(HG.offer+(HG.max-HG.offer)*0.55));HG.line=big?`${a} mı? Çok fazla! En fazla ${HG.offer} veririm.`:HG.round===3?`Son teklifim ${HG.offer} altın.`:pick([`Biraz artırayım: ${HG.offer} altın.`,`${HG.offer} olsun, anlaşalım.`,`En fazla ${HG.offer} verebilirim.`]);sfx.tap();renderH()}
function haggleOrder(){const o=G.order,c=Q[0];if(!o||o.haggled||G.phase!=='ordering')return;if(o.hmax==null)o.hmax=r5(o.budget*(1.08+Math.random()*0.35+(o.hurry?0.15:0)));
haggle({line:`Bütçem ${o.budget} altın, ne dersin?`,offer:o.budget,max:o.hmax,ask:r5(o.budget*1.25),lo:o.budget,hi:r5(o.budget*1.8),
 onDeal:p=>{o.budget=p;o.haggled=true;acceptOrder(`Anlaştık, ${p} altın!`)},onBreak:()=>{o.haggled=true;lose(c,'Pazarlık bozuldu, müşteri gitti',1)},onBack:()=>{o.haggled=true;orderActions()}})}
function rmStock(it){G.stock=G.stock.filter(x=>x!==it);vitrinSync()}
function levelUp(){const nt=tierOf(G.rep);if(nt>G.tier){G.tier=nt;restock();setTimeout(()=>{toast(`Kademe ${nt} açıldı!<br>Yeni araçlar ve malzemeler`,2600);sfx.fan()},1500)}checkUnl()}
function cancelOrder(){const c=Q[0];if(!c||G.phase!=='active')return;if(!armBuy('cancel','Sipariş iptal edilsin mi? İtibar −3'))return;buyArm=null;say('Peki, başka zaman...');G.bubOn=true;lose(c,'Sipariş iptal edildi',3)}
function stockDeliver(it){const o=G.order,c=Q[0];if(!o||!c||!G.stock.includes(it))return;rmStock(it);const st=it.stars;let pay=Math.round(o.budget*(0.6+0.08*st));if(o.hurry)pay+=Math.round(o.budget*0.2);if(st===5)pay+=15;
G.gold+=pay;G.st.earned+=pay;G.st.deliv++;if(st===5)G.st.five++;G.rep=Math.max(0,G.rep+(st>=3?st:-1));if(G.first){G.first=false;spawnT=5}G.phase='leaving';G.order=null;G.n++;levelUp();
if(st>=4)anim(c,'clap',true);say(st>=4?'Hazır varmış, harika! Teşekkürler.':'Olur, idare eder.');sfx.coin();toast('+'+pay+' altın',1200);actions([]);refresh();save();setTimeout(()=>{G.bubOn=false;say(null);leave(c)},1300)}
function presentBuy(c,o){const it=G.stock.find(x=>x.id===o.buy);if(!it){say('Aradığım ürün satılmış galiba... Başka zaman.');actions([]);setTimeout(()=>{if(Q[0]===c)leave(c)},1700);return}
c.wtp=r5(itemVal(it)*(0.85+Math.random()*0.45));o.ok=it.price<=c.wtp;o.offer=o.ok?it.price:Math.min(it.price-5,r5(c.wtp*0.82));
say(o.ok?`Vitrindeki ${desc(it)} çok güzel! ${it.price} altına alıyorum.`:`Vitrindeki ${desc(it)} hoşuma gitti ama ${it.price} altın fazla. ${o.offer} olur mu?`);
refresh();if(view==='home'||view==='vitrin')buyActions();else toast('Vitrin için müşteri geldi',1800)}
function buyActions(){const o=G.order,c=Q[0],it=o&&G.stock.find(x=>x.id===o.buy);if(!it){actions([]);return}
if(o.ok)actions([btn(`Sat · ${it.price} altın`,'g',()=>sale(it,it.price)),btn('Vazgeç','r',rejectOrder)]);
else{const L=[btn(`${o.offer} altına sat`,'g',()=>sale(it,o.offer))];if(!o.haggled)L.push(btn('Pazarlık','',()=>{o.haggled=true;haggle({line:`${o.offer} altın verebilirim.`,offer:o.offer,max:c.wtp,ask:it.price,lo:o.offer,hi:Math.max(it.price,r5(c.wtp*1.6)),
 onDeal:p=>sale(it,p),onBreak:()=>lose(c,'Müşteri vazgeçip gitti',0),onBack:buyActions})}));L.push(btn('Reddet','r',rejectOrder));actions(L)}}
function sale(it,p){const c=Q[0];anim(c,'clap',true);if(!G.stock.includes(it))return;rmStock(it);G.gold+=p;G.st.earned+=p;G.st.sold++;sfx.cash();toast(`+${p} altın`,1200);say('Teşekkürler, güle güle kullanırım!');
G.phase='leaving';G.order=null;actions([]);refresh();save();setTimeout(()=>{G.bubOn=false;say(null);if(c)leave(c)},1200)}
function acceptOrder(msg){if(G.phase!=='ordering')return;G.phase='active';say(msg||'Harika, bekliyorum!');setTimeout(()=>{if(G.phase==='active'){G.bubOn=false;say(null)}},1800);refresh();
if(G.first)setTimeout(()=>toast('Kartta neyin eksik olduğu yazıyor.<br>Eksikleri bahçeden topla, atölyede işle.',3200),600)}
function rejectOrder(){if(G.phase!=='ordering')return;leave(Q[0])}

/* ---------- pazar, tedarikçi, depo ---------- */
let modalMode=null;
function openSheet(mode,html){if(modalMode!==mode)ui.sheet.scrollTop=0;modalMode=mode;ui.sheet.innerHTML=html;ui.modal.classList.toggle('thru',mode==='result');if(mode==='result'&&RZ.t===1)RZ.t=1.9;{let h=$('zhint');if(mode==='result'){if(!h){h=document.createElement('div');h.id='zhint';ui.modal.parentNode.appendChild(h)}h.textContent='İki parmakla yakınlaştır · tek parmakla çevir';show(h,true)}else if(h)show(h,false)}show(ui.modal,true)}
function closeSheet(){show(ui.modal,false);modalMode=null;refresh()}
ui.modal.addEventListener('click',e=>{if(e.target!==ui.modal||modalMode==='result')return;if(modalMode==='haggle')hBack();else closeSheet()});
const closeBtn='<div style="margin-top:12px;text-align:center"><button class="btn g" data-close>Kapat</button></div>';
function wire(){ui.sheet.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeSheet)}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const LOGOS=['star','leaf','crown','diamond','hammer','heart'],LCOL=['#a3302a','#2c3e6b','#3f7a2a','#c9982a','#5e3a6e','#262220'];
function drawLogo(c,id,x,y,r,col){c.save();c.translate(x,y);c.fillStyle=col;c.beginPath();
if(id==='star'){for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?r*0.45:r;c.lineTo(Math.cos(a)*q,Math.sin(a)*q)}}
else if(id==='leaf'){c.moveTo(0,-r);c.quadraticCurveTo(r*1.1,-r*0.2,0,r);c.quadraticCurveTo(-r*1.1,-r*0.2,0,-r)}
else if(id==='crown'){[[-r,r*0.7],[-r,-r*0.5],[-r*0.45,r*0.1],[0,-r*0.8],[r*0.45,r*0.1],[r,-r*0.5],[r,r*0.7]].forEach(p=>c.lineTo(p[0],p[1]))}
else if(id==='diamond'){[[0,-r],[r*0.75,0],[0,r],[-r*0.75,0]].forEach(p=>c.lineTo(p[0],p[1]))}
else if(id==='hammer'){c.rect(-r*0.8,-r*0.9,r*1.6,r*0.6);c.rect(-r*0.15,-r*0.3,r*0.3,r*1.25)}
else{c.moveTo(0,r*0.9);c.bezierCurveTo(-r*1.5,-r*0.2,-r*0.6,-r*1.2,0,-r*0.4);c.bezierCurveTo(r*0.6,-r*1.2,r*1.5,-r*0.2,0,r*0.9)}
c.closePath();c.fill();c.restore()}
const lcv=document.createElement('canvas');lcv.width=lcv.height=96;
function logoURL(id){const c=lcv.getContext('2d');c.clearRect(0,0,96,96);c.fillStyle='#f3e6c8';c.beginPath();c.arc(48,48,44,0,7);c.fill();c.lineWidth=5;c.strokeStyle=G.shop.col;c.stroke();drawLogo(c,id||G.shop.logo,48,50,26,G.shop.col);return lcv.toDataURL()}
const scv=document.createElement('canvas');scv.width=512;scv.height=160;const stex=new THREE.CanvasTexture(scv);
add(B(1.5,0.5,0.06),M('#5a3519'),-1.4,2.8,-3.86);{const sp=new THREE.Mesh(new THREE.PlaneGeometry(1.4,0.42),new THREE.MeshBasicMaterial({map:stex,toneMapped:false}));sp.position.set(-1.4,2.8,-3.82);S.add(sp)}
function drawSign(){const c=scv.getContext('2d');c.fillStyle='#f3e6c8';c.fillRect(0,0,512,160);c.strokeStyle='#3b2616';c.lineWidth=8;c.strokeRect(4,4,504,152);drawLogo(c,G.shop.logo,82,82,46,G.shop.col);c.fillStyle='#3b2616';c.textBaseline='middle';
let fs=60;do{fs-=4;c.font=`600 ${fs}px Fredoka,system-ui,sans-serif`}while(c.measureText(G.shop.ad).width>345&&fs>20);c.fillText(G.shop.ad,148,84);stex.needsUpdate=true}
let menuTab='defter',rstArm=false;
function reqTxt(p){const a=[];if(G.tier<p.tier)a.push(`Kademe ${p.tier} (itibar ${TIERS[p.tier]})`);if(p.after){const n=(G.cat[p.after[0]]||{n:0}).n;if(n<p.after[1])a.push(`${p.after[1]} ${PRODS.find(x=>x.id===p.after[0]).ad.toLowerCase()} üret (${n}/${p.after[1]})`)}if(p.tools)p.tools.forEach(t=>{if(!(G.eq&&G.eq[t]&&G.eq[t].own))a.push('Gerekli alet: '+EQ.find(x=>x.id===t).ad)});return a.join(' · ')}
var slDel=null,exA=false,exT=0;function renderMenu(){const T=[['defter','Ürünler'],['ext','Ticaret'],['eq','Ekipman'],['ach','Başarım'],['ayar','Ayarlar']];
let h=`<div style="display:flex;align-items:center;gap:10px"><img id="shopL" src="${logoURL()}" style="width:44px;height:44px" alt=""><h3 id="shopH" style="margin:0">${esc(G.shop.ad)}</h3></div><p>${SEAS[season()].ic} ${SEAS[season()].ad} (${((G.day||1)-1)%7+1}/7. gün) · Kademe ${G.tier} · İtibar ${G.rep} · ${G.st.deliv} teslimat · ${G.st.lost} kaçan müşteri</p><div class="tabs">${T.map(t=>`<button class="btn ${menuTab===t[0]?'':'l'}" data-mt="${t[0]}">${t[1]}</button>`).join('')}</div>`;
if(menuTab==='defter')h+=PRODS.map(p=>{const c=G.cat[p.id],u=unlocked(p);return `<div class="row" style="${u?'':'opacity:.55'}"><img class="ic" src="${ICON[p.id]}" alt=""><div class="n">${p.ad}<small>${c?`${c.n} kez üretildi · En iyi: ${'★'.repeat(c.best)}`:u?'Henüz üretilmedi · sipariş bekle':'Kilitli · '+reqTxt(p)}</small></div>${c?'<b class="bonc">✓</b>':''}</div>`}).join('');
else if(menuTab==='ext')h+=renderExt()+renderTrade();else if(menuTab==='eq')h+=renderEq();else if(menuTab==='ach')h+=renderDQ()+renderStats()+'<div class="grp">Başarımlar</div>'+ACH.map(a=>{const v=Math.min(a.goal,a.get()),d=G.ach[a.id];return `<div class="row"><div class="n">${a.ad}<small>${a.desc} · ${v}/${a.goal}</small><div class="bar"><i style="width:${v/a.goal*100}%"></i></div></div><b style="white-space:nowrap" class="${d?'bonc':''}">${d?'✓ ':''}+${a.gold}</b></div>`}).join('');
else h+=`<div class="grp">Dükkan adı</div><input id="shopN" maxlength="18" value="${esc(G.shop.ad)}"><div class="grp">Logo</div><div class="pk">${LOGOS.map(l=>`<button class="lg ${G.shop.logo===l?'sel':''}" data-lg="${l}"><img src="${logoURL(l)}" alt="${l}"></button>`).join('')}</div>
<div class="grp">Logo rengi</div><div class="pk">${LCOL.map(c=>`<button class="btn col ${G.shop.col===c?'sel':''}" data-lc="${c}" aria-label="renk" style="background:${c};width:42px;height:42px;min-height:0"></button>`).join('')}</div>
<div class="grp">Ses ve müzik</div><div style="display:flex;align-items:center;gap:10px;margin:2px 0 8px"><span style="font-size:13px">Ses seviyesi</span><input id="volR" type="range" min="0" max="1" step="0.05" value="${G.vol!=null?G.vol:1}" style="flex:1"></div>${G.notif?`<p style="font-size:12px;margin:0 0 6px;opacity:.8">Sunucu bildirimi: ${pdev()?'bağlı ✓':'bağlı değil'+(pushErr?' · '+pushErr:'')}</p>`:''}<div class="pk"><button class="btn l" id="ntB">${G.notif?'Bildirim açık':'Bildirim kapalı'}</button>${G.notif?'<button class="btn l" id="ntT">Test bildirimi</button>':''}<button class="btn l" id="vibB">${G.vib===false?'Titreşim kapalı':'Titreşim açık'}</button><button class="btn l" id="sndB">${G.snd?'Efektler açık':'Efektler kapalı'}</button><button class="btn l" id="mus2">${G.mus?'Müzik açık':'Müzik kapalı'}</button></div><div class="grp">Kayıt</div><div class="pk"><button class="btn g" id="svB">Şimdi kaydet</button><button class="btn l" id="hmB">${exA?(G.phase==='craft'?'Üretim yarıda kalır · Emin misin?':'Kaydedip çıkılsın mı? Dokun'):'Ana ekrana dön'}</button></div><div class="grp">Dükkanlarım</div>${['1','2','3'].map(n=>{const i=slotInfo(n);return `<div class="row"><div class="n">${n===SSLOT?'● ':''}${i?i.ad:'Boş yer'}<small>${i?`${i.day}. gün · K${i.tier} · ${i.gold} altın`:'Yeni dükkan açılabilir'}</small></div>${n===SSLOT?'<b>Açık</b>':i?`<button class="btn l" data-sl="${n}">Geç</button><button class="btn r" data-sd="${n}">${slDel===n?'Emin misin?':'Sil'}</button>`:`<button class="btn l" data-sl="${n}">Aç</button>`}</div>`}).join('')}${renderAcct()}<div class="grp">Bulut kaydı</div>${G.cloud?`<p style="font-size:12px;margin:0 0 6px;opacity:.8">Kayıt kodun (başka cihazda giriş ekranındaki <b>Kayıt koduyla devam et</b>e yaz):</p><div class="ccode">${fmtCode(G.cloud)}</div><p style="font-size:12px;margin:2px 0 6px;opacity:.75">Otomatik bulut kaydı açık · son kayıt: ${G.clOk?fmtT((Date.now()-G.clOk)/1000)+' önce':'bekleniyor'}</p><div class="pk"><button class="btn g" id="clPush">Şimdi buluta kaydet</button><button class="btn l" id="clCopy">Kodu kopyala</button></div><p style="font-size:11px;margin:6px 0 0;opacity:.65">${G.clOk?'Son bulut kaydı: '+new Date(G.clOk).toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'}):'Oynarken kendiliğinden kaydedilir'} · Kodu kimseyle paylaşma</p>`:`<p style="font-size:12px;margin:0 0 8px;opacity:.8">Açınca ilerlemen buluta kaydedilir; başka cihazdan kodla kaldığın yerden devam edersin.</p><button class="btn g" id="clOn">Bulut kaydını aç</button>`}<div class="grp">Bu dükkan</div>${G.owner?`<div class="grp">Yönetici</div><p style="font-size:12px;margin:0 0 6px;opacity:.8">Yönetici modu açık: depo, raf ve vitrin sınırsız, aletler yıpranmaz.</p><div class="pk"><button class="btn l" id="owG">+1000 altın</button><button class="btn l" id="owR">+50 itibar</button><button class="btn l" id="owU">Bahçe ve istasyonların hepsini aç</button><button class="btn l" id="owO">Yönetici modunu kapat</button></div>`:`<div class="grp">Yönetici</div><div class="pk"><input id="owI" placeholder="Yönetici kodu" autocomplete="off" style="flex:1;min-width:0;text-transform:uppercase"><button class="btn l" id="owB">Gir</button></div>`}<button class="btn r" id="rstB">${rstArm?'Emin misin? Tekrar dokun':'Bu dükkanı sıfırla'}</button>`;
openSheet('menu',h+closeBtn);wire();if(menuTab==='eq')wireEq();
ui.sheet.querySelectorAll('[data-mt]').forEach(b=>b.onclick=()=>{menuTab=b.dataset.mt;rstArm=false;renderMenu()});
ui.sheet.querySelectorAll('[data-lg]').forEach(b=>b.onclick=()=>{G.shop.logo=b.dataset.lg;drawSign();save();renderMenu()});
ui.sheet.querySelectorAll('[data-lc]').forEach(b=>b.onclick=()=>{G.shop.col=b.dataset.lc;drawSign();save();renderMenu()});
const n=$('shopN');if(n)n.oninput=()=>{G.shop.ad=n.value.trim()||'Dükkanım';$('shopH').textContent=G.shop.ad;drawSign();save()};
const sb=$('sndB');if(sb)sb.onclick=()=>{G.snd=!G.snd;save();renderMenu()};const m2=$('mus2');if(m2)m2.onclick=()=>{musSet(!G.mus);save();renderMenu()};
ui.sheet.querySelectorAll('[data-xa]').forEach(b=>b.onclick=()=>{const X=G.ext,i=X.offers.findIndex(a=>String(a.id)===b.dataset.xa);if(i<0)return;if(X.act.length>=3+G.tier){toast('En fazla '+(3+G.tier)+' özel sipariş alabilirsin',1500);return}const a=X.offers.splice(i,1)[0];a.due=NOW()+a.hrs*3600;X.act.push(a);if(!X.next||X.next<NOW())X.next=NOW()+300;sfx.coin();save();renderMenu()});ui.sheet.querySelectorAll('[data-xd]').forEach(b=>b.onclick=()=>{const X=G.ext,i=X.act.findIndex(a=>String(a.id)===b.dataset.xd);if(i<0)return;const a=X.act[i],L=extHas(a);if(!L)return;const rm=L.slice(0,a.q||1);G.stock=G.stock.filter(x=>!rm.includes(x));G.store=(G.store||[]).filter(x=>!rm.includes(x));X.act.splice(i,1);G.gold+=a.rw;G.rep+=a.rp;G.st.deliv++;sfx.coin();sfx.fan();toast(`${a.from} memnun!<br>+${a.rw} altın · +${a.rp} itibar`,2000);vitrinSync();storeSync();hud();save();renderMenu()});tradeWire();acctWire();ui.sheet.querySelectorAll('[data-dq]').forEach(b=>b.onclick=()=>{const t=G.dq.t[+b.dataset.dq];if(!t||t.ok||dqProg(t)<t.n)return;t.ok=true;G.gold+=t.rw;sfx.coin();toast('+'+t.rw+' altın',1200);hud();save();renderMenu()});const vr=$('volR');if(vr)vr.oninput=()=>{G.vol=+vr.value;if(MG)MG.gain.value=G.vol;save()};const ntB=$('ntB');if(ntB)ntB.onclick=notifToggle;const ntT=$('ntT');if(ntT)ntT.onclick=async()=>{if(!pdev()){ntT.textContent='Bağlanıyor…';const ok=await pushSub();if(!ok){toast('Bağlanamadı: '+pushErr,3000);renderMenu();return}}const it=pushItems();it.unshift({at:Math.round(NOW()+45),t:'Arasta',b:'Test bildirimi: her şey çalışıyor!'});rpc('arasta_push_set',{p_dev:pdev(),p_items:it.slice(0,30)}).then(()=>toast('Test bildirimi 1 dakika içinde gelecek.<br>Şimdi oyunu kapatabilirsin.',3000)).catch(e=>toast('Gönderilemedi',2000));renderMenu()};const vbB=$('vibB');if(vbB)vbB.onclick=()=>{G.vib=G.vib===false?true:false;vib(30);save();renderMenu()};const svB=$('svB');if(svB)svB.onclick=()=>{save();sfx.good();toast('Kaydedildi',1100)};const hmB=$('hmB');if(hmB)hmB.onclick=()=>{if(!exA){exA=true;renderMenu();clearTimeout(exT);exT=setTimeout(()=>{exA=false;if(!ui.modal.classList.contains('hide'))renderMenu()},4000);return}exA=false;hmB.textContent='Kaydediliyor…';hmB.disabled=true;save();let gone=false;const out=()=>{if(gone)return;gone=true;ui.fade&&(ui.fade.style.opacity=1);setTimeout(()=>location.reload(),250)};Promise.resolve(cloudPush(true)).catch(()=>{}).then(out);setTimeout(out,2500)};ui.sheet.querySelectorAll('[data-sl]').forEach(b=>b.onclick=()=>goSlot(b.dataset.sl));ui.sheet.querySelectorAll('[data-sd]').forEach(b=>b.onclick=()=>{const n=b.dataset.sd;if(slDel!==n){slDel=n;renderMenu();return}try{localStorage.removeItem(SKOF(n))}catch(e){}slDel=null;renderMenu()});
const clOn=$('clOn');if(clOn)clOn.onclick=()=>{G.cloud=newCode();save();cloudPush(true).then(r=>{toast(r?'Bulut kaydı açık':'Bağlantı yok, sonra tekrar denenecek',1600);renderMenu()});renderMenu()};const clP=$('clPush');if(clP)clP.onclick=()=>{save();cloudPush(true).then(r=>{toast(r?'Buluta kaydedildi':'Bağlantı yok',1300);renderMenu()})};const clC=$('clCopy');if(clC)clC.onclick=()=>{try{navigator.clipboard.writeText(fmtCode(G.cloud)).then(()=>toast('Kod kopyalandı',1200))}catch(e){}};
const exB=$('exB');if(exB)exB.onclick=()=>{const c=exportSave();const T=$('imT');T.classList.remove('hide');T.value=c;T.select();try{navigator.clipboard.writeText(c).then(()=>toast('Kayıt kodu kopyalandı',1300),()=>toast('Kodu seçip kopyala',1300))}catch(e){toast('Kodu seçip kopyala',1300)}};
const imB=$('imB');if(imB)imB.onclick=()=>{const T=$('imT');if(T.classList.contains('hide')||!T.value.startsWith('ARS1.')){T.classList.remove('hide');T.value='';T.focus();toast('Kodu kutuya yapıştır, sonra tekrar dokun',1600);return}if(!importSave(T.value))toast('Kod geçersiz',1300)};
const owB=$('owB');if(owB)owB.onclick=async()=>{const v=($('owI').value||'').trim().toUpperCase();try{const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v));const h=[...new Uint8Array(d)].map(x=>x.toString(16).padStart(2,'0')).join('');if(h===OWNER_H){G.owner=true;try{localStorage.setItem('arasta-owner',OWNER_H)}catch(e){}save();sfx.fan();toast('Yönetici modu açıldı',1500);refresh();renderMenu()}else{sfx.bad();toast('Kod yanlış',1200)}}catch(e){toast('Bu tarayıcıda doğrulanamadı',1500)}};
if($('owG'))$('owG').onclick=()=>{G.gold+=1000;sfx.coin();save();refresh();renderMenu()};if($('owR'))$('owR').onclick=()=>{G.rep+=50;levelUp&&levelUp();save();refresh();renderMenu()};
if($('owU'))$('owU').onclick=()=>{G.gu=G.gu||{};Object.keys(GLK).forEach(k=>G.gu[k]=1);G.stB=G.stB||{};Object.keys(STC).forEach(k=>G.stB[k]=1);gSync();sfx.fan();toast('Hepsi açıldı',1300);save();refresh()};
if($('owO'))$('owO').onclick=()=>{G.owner=false;try{localStorage.removeItem('arasta-owner')}catch(e){}save();toast('Yönetici modu kapandı',1200);refresh();renderMenu()};
const rb=$('rstB');if(rb)rb.onclick=()=>{if(!rstArm){rstArm=true;renderMenu();return}try{localStorage.removeItem(SK)}catch(e){}save=()=>{};location.reload()}}
$('menuB').onclick=()=>{if(G.phase!=='craft'&&G.phase!=='result')renderMenu()};
const VL=VSL.map((p,i)=>{const l=label('vitrin',V(p.x,p.y-0.03,p.z),'',true);l.el.classList.add('stl');l.off=true;l.el.onclick=()=>{const it=G.stock[i];if(it)openItem(it)};return l});
function vitLabels(){VL.forEach((l,i)=>{const it=G.stock[i];l.off=!it;if(it)l.el.innerHTML=`${it.price} altın<small>${'★'.repeat(it.stars)}</small>`})}
function vitrinSync(){VIT.clear();G.stock.slice(0,9).forEach((it,i)=>{const p=pr(it),m=p.build(it.col?paintOf(it.col).hex:p.sheet,it.style,{cila:true});m.g.scale.setScalar(1.05);m.g.position.copy(VSL[i]);m.g.rotation.y=-Math.PI/2+0.35;m.g.userData.sid=it.id;
const h=new THREE.Mesh(B(0.5,0.5,0.6),HID);h.position.y=0.22;m.g.add(h);VIT.add(m.g)});vitLabels();if(typeof hud==='function')refresh()}
function openItem(it){if(G.phase==='craft'||G.phase==='result')return;const p=pr(it);
const draw=()=>{openSheet('item',`<h3>${p.ad}</h3><p>${desc(it)} · ${'★'.repeat(it.stars)}</p><div class="grp">Vitrin fiyatı</div><div class="hgv"><button class="btn l" data-pd="-10">−10</button><button class="btn l" data-pd="-5">−5</button><b>${it.price}</b><button class="btn l" data-pd="5">+5</button><button class="btn l" data-pd="10">+10</button></div>
<p style="text-align:center">Önerilen: <b>${sugg(it)}</b> altın · Pahalıysa müşteri pazarlık eder, ucuzsa hemen alır.</p><div class="pk"><button class="btn l" id="tsB">Depoya kaldır</button></div>`+closeBtn);wire();$('tsB').onclick=()=>{if(toStore(it)){closeSheet();toast('Depo rafına kaldırıldı',1100)}};ui.sheet.querySelectorAll('[data-pd]').forEach(b=>b.onclick=()=>{it.price=clamp(it.price+ +b.dataset.pd,5,999);vitLabels();save();draw()})};draw()}
function openFree(){if(G.phase!=='idle'){toast('Önce sıradaki müşteriyle ilgilen',1500);return}if(G.stock.length>=vitCap()&&(G.store||[]).length>=stoCap()){toast('Vitrin ve depo rafı dolu<br>Satış yap ya da depoda genişlet',1900);return}
const h='<h3>Serbest üretim</h3><p>Ürünü yap, vitrine koy, fiyatını sen belirle.</p>'+PRODS.filter(unlocked).map(p=>{const miss=Object.entries(p.need).filter(([k,n])=>k==='boya'?!anyPaint():G.inv[k]<n).map(([k,n])=>k==='boya'?'boya':MATS[k].ad+(n>1?' ×'+n:''));
return `<div class="row"><img class="ic" src="${ICON[p.id]}" alt=""><div class="n">${p.ad}<small>${miss.length?'<span class="no">Eksik: '+miss.join(', ')+'</span>':'Malzemeler tamam · '+p.steps.length+' adım'}</small></div><button class="btn" data-fp="${p.id}" ${miss.length?'disabled':''}>Üret</button></div>`}).join('');
openSheet('free',h+closeBtn);wire();ui.sheet.querySelectorAll('[data-fp]').forEach(b=>b.onclick=()=>{const p=PRODS.find(x=>x.id===b.dataset.fp);if(!hasNeed(p)||G.phase!=='idle')return;show(ui.modal,false);modalMode=null;G.order={p,color:null,style:null,budget:p.base,free:true};startCraft()})}
$('vitB').onclick=()=>go('vitrin');
let mTab='pazar';
function openMarket(){if(G.phase==='craft'||G.phase==='result')return;renderMarket()}
function renderMarket(){const tabs=`<div class="tabs"><button class="btn ${mTab==='pazar'?'':'l'}" data-tab="pazar">Pazar</button><button class="btn ${mTab==='ted'?'':'l'}" data-tab="ted">Tedarikçi</button><button class="btn ${mTab==='tohum'?'':'l'}" data-tab="tohum">Tohumcu</button><button class="btn l" data-tab="deco">Dekorcu</button></div>`;let h;
if(mTab==='pazar'){h=`<h3>Pazar</h3><p>Altın: <b>${G.gold}</b> · Yeni mal: <b id="mkT"></b>${G.disc<1?' · %20 indirim':''}</p>${tabs}`+
`<div style="text-align:right;margin:4px 0"><button class="btn l" id="hag" ${G.haggled?'disabled':''}>Pazarlık yap</button></div>`+
G.market.map((m,i)=>{const f=Math.round(m.f*G.disc);return `<div class="row"><img class="ic" src="${ICON[m.k]}" alt=""><div class="n">${MATS[m.k].ad}<small>Tezgahta: ${m.st} · Depoda: ${G.inv[m.k]}</small></div><button class="btn" data-b="${i}" ${G.gold<f||m.st<1?'disabled':''}>${f} altın</button></div>`}).join('')}
else if(mTab==='tohum'){h=`<h3>Tohumcu</h3><p>Tohumları bahçedeki tarlalara ek. Altın: <b>${G.gold}</b></p>${tabs}`+Object.keys(CROPS).filter(k=>!CROPS[k].t||G.tier>=CROPS[k].t).map(k=>{const c=CROPS[k];return `<div class="row"><img class="ic" src="${ICON[k]}" alt=""><div class="n">${MATS[k].ad}<small>${c.s} sn · ${c.n} ${MATS[c.out].ad.toLowerCase()} verir · Elinde: ${G.inv[k]}</small></div><button class="btn" data-t="${k}" ${G.gold<c.f?'disabled':''}>${c.f} altın</button></div>`}).join('')}
else{h=`<h3>Tedarikçi</h3><p>Toplu sipariş ucuzdur ama ${DELAY} saniyede at arabasıyla gelir. Altın: <b>${G.gold}</b></p>${tabs}`+
SUPPLY.filter(s=>!s.t||G.tier>=s.t).map((s,i)=>{const [k,n]=Object.entries(s.items)[0];return `<div class="row"><img class="ic" src="${ICON[k]}" alt=""><div class="n">${n} × ${MATS[k].ad}<small>Tanesi ${Math.round(s.f/n)} altın</small></div><button class="btn" data-s="${SUPPLY.indexOf(s)}" ${G.gold<s.f?'disabled':''}>${s.f} altın</button></div>`}).join('')+
(G.deliv.length?`<div class="grp">Yoldaki siparişler</div>`+G.deliv.map((d,i)=>{const [k,n]=Object.entries(d.items)[0];return `<div class="row"><img class="ic" src="${ICON[k]}" alt=""><div class="n">${n} × ${MATS[k].ad}<small>Geliyor: <b data-d="${i}"></b></small></div></div>`}).join(''):'')}
openSheet('market',h+closeBtn);wire();updTimers();
ui.sheet.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{if(b.dataset.tab==='deco'){openDeco();return}mTab=b.dataset.tab;renderMarket()});
ui.sheet.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{const m=G.market[+b.dataset.b],f=Math.round(m.f*G.disc);if(G.gold<f||m.st<1||depoFull(1))return;G.gold-=f;m.st--;G.inv[m.k]++;sfx.coin();hud();renderMarket()});
ui.sheet.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{const s=SUPPLY[+b.dataset.s];if(G.gold<s.f)return;G.gold-=s.f;G.deliv.push({items:s.items,end:NOW()+DELAY});hud();toast('Sipariş verildi',1000);renderMarket()});
ui.sheet.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{const k=b.dataset.t,f=CROPS[k].f;if(G.gold<f||depoFull(1))return;G.gold-=f;G.inv[k]++;sfx.coin();hud();renderMarket()});
const hb=$('hag');if(hb)hb.onclick=()=>{G.haggled=true;if(Math.random()<0.55){G.disc=0.8;toast('Tüccar: Peki, senin için %20 indirim!',1800)}else toast('Tüccar: Bu fiyatlar son fiyat!',1600);renderMarket()}}
function openDepo(){if(G.phase==='craft'||G.phase==='result')return;let h='<h3>Depo</h3><p style="font-size:12px;opacity:.8;margin:0 0 6px">Raftaki malzemeyi tutup istediğin rafa sürükle.</p><div class="grp">Kapasite</div>'+['d','s','v'].map(k=>{const L=capLv(k),c=CAPS[k].c[L],n=k==='d'?invTotal():k==='s'?(G.store||[]).length:G.stock.length;return `<div class="row"><div class="n">${CAPS[k].ad}<small>${n}/${G.owner?'∞':capOf(k)}${k==='d'?' malzeme':' ürün'}</small><div class="bar"><i style="width:${Math.min(100,n/capOf(k)*100)}%"></i></div></div>${c!=null&&!G.owner?`<button class="btn ${G.gold>=c?'g':'l'}" data-cu="${k}" ${G.gold<c?'disabled':''}>Genişlet · ${c}</button>`:'<b>En büyük</b>'}</div>`}).join('');if(G.stock.length)h+='<div class="grp">Vitrindeki ürünler</div>'+G.stock.map((it,i)=>`<div class="row"><img class="ic" src="${ICON[it.pid]}" alt=""><div class="n">${pr(it).ad}<small>${desc(it)} · ${'★'.repeat(it.stars)} · ${it.price} altın</small></div><button class="btn l" data-ts="${i}">Depoya al</button></div>`).join('');if((G.store||[]).length)h+='<div class="grp">Depo rafındaki ürünler</div>'+G.store.map((it,i)=>`<div class="row"><img class="ic" src="${ICON[it.pid]}" alt=""><div class="n">${pr(it).ad}<small>${desc(it)} · ${'★'.repeat(it.stars)}</small></div><button class="btn g" data-tv="${i}">Vitrine koy</button></div>`).join('');
['Ham madde','İşlenmiş','Yardımcı','Tohum'].forEach(gr=>{h+=`<div class="grp">${gr}</div><div class="grid">`+Object.keys(MATS).filter(k=>MATS[k].g===gr).map(k=>`<div class="cell ${G.inv[k]?'':'zero'}">${img(k)}<b>${G.inv[k]}</b>${MATS[k].ad}</div>`).join('')+'</div>'});
openSheet('depo',h+closeBtn);wire();ui.sheet.querySelectorAll('[data-cu]').forEach(b=>b.onclick=()=>capUp(b.dataset.cu));ui.sheet.querySelectorAll('[data-ts]').forEach(b=>b.onclick=()=>{if(toStore(G.stock[+b.dataset.ts]))openDepo()});ui.sheet.querySelectorAll('[data-tv]').forEach(b=>b.onclick=()=>{if(toVit(G.store[+b.dataset.tv]))openDepo()})}
const UPC={1:150,2:400,3:800,4:1500};const SPC=[200,450,900];const spdOf=s=>1-0.2*((G.stSp&&G.stSp[s.id])||0);
const io=o=>Object.entries(o).map(([k,n])=>`<span class="io">${img(k)}×${n}</span>`).join(' ');
function openStation(s){if(G.phase==='craft'||G.phase==='result')return;const lk=G.tier<s.tier;let h=`<h3>${s.ad}</h3>`;
if(lk)h+=`<p>Kilitli · Kademe ${s.tier}'de açılır (itibar ${TIERS[s.tier]})</p>`;
else{const nx=UPC[s.lvl];const spL=(G.stSp&&G.stSp[s.id])||0,spN=SPC[spL];h+=`<div class="brk"><span>Çalışan üretim</span><b>${s.jobs.length} / ${s.lvl}</b></div><div class="upg"><button class="upc" id="upB" ${!nx||G.gold<nx?'disabled':''}><span>📦 Kapasite</span><b>${nx?s.lvl+' → '+(s.lvl+1):s.lvl+' · MAX'}</b>${nx?`<i>${nx} altın</i>`:''}</button><button class="upc spd" id="spB" ${!spN||G.gold<spN?'disabled':''}><span>⚡ Verim</span><b>${spN?'%'+spL*20+' → %'+(spL+1)*20:'%'+spL*20+' · MAX'}</b>${spN?`<i>${spN} altın</i>`:''}</button></div>`;
if(s.ready)h+=`<p>Hazır: ${io(s.ready)}</p><div style="text-align:center;margin:6px"><button class="btn g" id="col">Topla</button></div>`;
if(s.jobs.length)h+=s.jobs.map((j,i)=>`<p>Çalışıyor: ${io(j.r.out)} · <b data-j="${i}"></b></p>`).join('');else if(!s.ready)h+='<p>Bir tarif seç</p>'}
h+=s.rec.map((r,i)=>{const rl=r.tier&&G.tier<r.tier;const nm=o=>Object.entries(o).map(([k,n])=>n+' '+MATS[k].ad.toLowerCase()).join(' + '),miss=Object.entries(r.in).filter(([k,n])=>G.inv[k]<n);
return `<div class="row">${io(r.in)}<span class="arrow">→</span>${io(r.out)}<div class="n">${MATS[Object.keys(r.out)[0]].ad}<small>${nm(r.in)} · ${fmtT(r.s*spdOf(s))}${rl?' · Kademe '+r.tier:''}</small><small class="${miss.length?'no':'ok'}">Elinde: ${Object.keys(r.in).map(k=>G.inv[k]+' '+MATS[k].ad.toLowerCase()).join(', ')}</small></div><button class="btn" data-r="${i}" ${lk||rl||!hasAll(r.in)||s.jobs.length>=s.lvl?'disabled':''}>Başlat</button></div>`}).join('');
openSheet('st:'+s.id,h+closeBtn);wire();updTimers();
const sb=$('spB');if(sb)sb.onclick=()=>{G.stSp=G.stSp||{};const L=G.stSp[s.id]||0,c=SPC[L];if(!c||G.gold<c)return;G.gold-=c;G.stSp[s.id]=L+1;sfx.coin();sfx.fan();toast(`${s.ad}: %${(L+1)*20} daha hızlı`,1600);save();refresh();openStation(s)};const ub=$('upB');if(ub)ub.onclick=()=>{const c=UPC[s.lvl];if(!c||G.gold<c)return;G.gold-=c;s.lvl++;G.stLv[s.id]=s.lvl;sfx.coin();sfx.fan();toast(`${s.ad}: aynı anda ${s.lvl} üretim`,1600);save();refresh();openStation(s)};
const c=$('col');if(c)c.onclick=()=>{if(depoFull(Object.values(s.ready).reduce((a,b)=>a+b,0)))return;giveAll(s.ready);G.st.proc++;sfx.pick();toast('+ '+Object.entries(s.ready).map(([k,n])=>n+' '+MATS[k].ad).join(', '),1400);s.ready=null;refresh();openStation(s)};
ui.sheet.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{const r=s.rec[+b.dataset.r];if(!hasAll(r.in)||s.jobs.length>=s.lvl)return;giveAll(r.in,-1);s.jobs.push({r,end:NOW()+r.s*spdOf(s)});G.stLast=G.stLast||{};G.stLast[s.id]=+b.dataset.r;sfx.start();if(s.liq){const pc=PAINTS.find(p=>'boya_'+p.id===Object.keys(r.out)[0]);s.liq.material.color.set(pc?pc.hex:'#e8dcb0')}refresh();openStation(s)})}
function updTimers(){const m=$('mkT');if(m)m.textContent=Math.max(0,Math.ceil(G.mktT-tt))+' sn';
ui.sheet.querySelectorAll('[data-d]').forEach(e=>{const d=G.deliv[+e.dataset.d];if(d)e.textContent=fmtT(d.end-NOW())});
if(modalMode&&modalMode.startsWith('st:')){const s=ST.find(x=>'st:'+x.id===modalMode);ui.sheet.querySelectorAll('[data-j]').forEach(e=>{const j=s.jobs[+e.dataset.j];if(j)e.textContent=fmtT(j.end-NOW())})}}
let secT=0;
const NIGHT=new THREE.Color('#34405e'),WDAY=new THREE.Color('#ffe6a8'),WNIGHT=new THREE.Color('#3e4c78');
function dayLight(){dayLight0();dayLightWx()}
function dayLight0(){const f=clamp((G.tm-480)/240,0,1),k=(view==='bench'||view==='vitrin')?'home':view;LIGHTS[k].forEach(([l,i])=>{if(l===sun||l===gSun||l===pSun)l.intensity=i*(1-0.7*f);else if(l===hemi)l.intensity=i*(1-0.35*f)});
S.background.set(BGS[k]);if(k==='bahce'||k==='pazar')S.background.lerp(NIGHT,0.8*f);winM.color.copy(WDAY).lerp(WNIGHT,f)}
let warned=false;
function dayTick(){if(!G.started||G.night)return;if(G.tm>=660&&!warned){warned=true;toast('Kapanışa bir saat kaldı',1600)}
if(G.tm>=720){G.tm=720;G.night=true;sfx.bell();toast('Akşam oldu, kapanış saati<br>Yeni müşteri gelmeyecek',2400);refresh();save()}}
function endDay(){const d=G.ds||{earned:0,deliv:0,sold:0,lost:0},E=G.st.earned-d.earned;
openSheet('day',`<h3>${G.day}. gün bitti</h3><p>${esc(G.shop.ad)} · günün özeti</p><div class="brk"><span>Kazanç</span><b>${E} altın</b></div><div class="brk"><span>Teslim edilen sipariş</span><b>${G.st.deliv-d.deliv}</b></div>
<div class="brk"><span>Vitrinden satış</span><b>${G.st.sold-d.sold}</b></div><div class="brk"><span>Kaçan müşteri</span><b>${G.st.lost-d.lost}</b></div><div style="text-align:center;margin-top:14px"><button class="btn g" id="newDay">Yeni güne başla</button></div>`);
$('newDay').onclick=()=>{show(ui.modal,false);modalMode=null;G.day++;G.tm=0;G.night=false;warned=false;G.ds={earned:G.st.earned,deliv:G.st.deliv,sold:G.st.sold,lost:G.st.lost};restock();spawnT=3;sfx.fan();rollWx(true);wxNext=tt+150;save();refresh();dayLight();toast(`${G.day}. gün · Günaydın usta!`,1800)}}
const XFROM=['Konak hanımı','Kervansaray','Lale Oteli','Han ağası','Köşk kâhyası','Kahvehane','Hamam ustası','Sahaf'];
function extGen(){const pool=PRODS.filter(unlocked);if(!pool.length)return null;if(Math.random()<0.25){const p=pick(pool),q=3+Math.floor(Math.random()*3),hrs=[24,36,48][Math.floor(Math.random()*3)];return {id:String(Date.now())+Math.floor(Math.random()*1e4),pid:p.id,col:null,q,from:'Esnaf Loncası',rw:Math.round(p.base*q*1.5/5)*5,rp:10+q*2,hrs}}const p=pick(pool),col=p.need.boya&&Math.random()<0.5?pick(PAINTS).id:null,hrs=[1,2,3,4,6,8,12][Math.floor(Math.random()*7)];return {id:String(Date.now())+Math.floor(Math.random()*1e4),pid:p.id,col,from:pick(XFROM),rw:Math.round(p.base*(1.4+hrs*0.03)/5)*5,rp:3+Math.floor(hrs/4),hrs}}
function extTick(){G.ext=G.ext||{offers:[],act:[],next:0};const X=G.ext;if(X.offers.length<3&&NOW()>=(X.next||0)){const o=extGen();if(o){X.offers.push(o);X.next=NOW()+(X.offers.length<3?60:900);if(G.started&&G.phase!=='craft')toast(`Özel sipariş geldi: ${o.from}`,1600);notify('Özel sipariş',`${o.from} bir sipariş gönderdi`)}}
 for(let i=X.act.length-1;i>=0;i--)if(NOW()>X.act[i].due){const a=X.act[i];X.act.splice(i,1);G.rep=Math.max(0,G.rep-2);toast(`Özel sipariş süresi doldu: ${a.from}<br>-2 itibar`,2200);if(modalMode==='menu'&&menuTab==='ext')renderMenu()}}
const extList=a=>[...G.stock,...(G.store||[])].filter(it=>it.pid===a.pid&&(!a.col||it.col===a.col)),extHas=a=>{const L=extList(a);return L.length>=(a.q||1)?L:null};
function renderExt(){const X=G.ext||{offers:[],act:[]},row=(a,act)=>{const p=PRODS.find(x=>x.id===a.pid);if(!p)return '';const cn=(a.q>1?a.q+' × ':'')+(a.col?paintOf(a.col).ad+' ':''),has=act&&extHas(a),cnt=act&&a.q>1?` (${extList(a).length}/${a.q})`:'';
 return `<div class="row"><img class="ic" src="${ICON[p.id]}" alt=""><div class="n">${cn}${p.ad}<small>${a.from} · ${a.rw} altın · +${a.rp} itibar · ${act?'kalan '+fmtT(a.due-NOW()):a.hrs+' saat süre'}</small></div>${act?`<button class="btn ${has?'g':'l'}" data-xd="${a.id}" ${has?'':'disabled'}>${has?'Teslim et':'Hazır değil'+cnt}</button>`:`<button class="btn g" data-xa="${a.id}">Kabul et</button>`}</div>`};
 return `<p style="font-size:12px;opacity:.8;margin:4px 0 8px">Acelesi olmayan dış siparişler. Ürünü istediğin zaman üret, vitrinde ya da depoda dursun, buradan teslim et.</p><div class="grp">Kabul ettiklerin</div>${X.act.length?X.act.map(a=>row(a,true)).join(''):'<p style="font-size:12px;opacity:.7">Henüz yok</p>'}<div class="grp">Gelen teklifler</div>${X.offers.length?X.offers.map(a=>row(a,false)).join(''):`<p style="font-size:12px;opacity:.7">Yeni teklif ${fmtT((X.next||0)-NOW())} içinde</p>`}`}

const KDEST=[{ad:'Halep',h:1,m:1.5},{ad:'Bağdat',h:3,m:1.9},{ad:'Venedik',h:6,m:2.4}],RNAMES=['Ayşe Hanım','Mehmet Efendi','Zeynep Hanım','Hasan Ağa','Fatma Teyze','Ali Usta','Elif Hanım','Mustafa Bey','Leyla Hanım','Osman Efendi'];
const curWeek=()=>Math.floor(((G.day||1)-1)/7);
function cupTick(){const w=curWeek();if(G.cup&&G.cup.week===w)return;if(G.cup&&G.cup.best>=3){const b=G.cup.best,pr=b>=5?[400,25,'Altın madalya']:b>=4?[200,12,'Gümüş madalya']:[80,5,'Bronz madalya'];G.gold+=pr[0];G.rep+=pr[1];toast(`Usta yarışması: ${pr[2]}!<br>+${pr[0]} altın · +${pr[1]} itibar`,3000);sfx.fan()}const pool=PRODS.filter(unlocked);G.cup={week:w,pid:pool.length?pick(pool).id:'cuzdan',best:0}}
function cupRec(pid,st){if(G.cup&&G.cup.pid===pid&&st>G.cup.best){G.cup.best=st;toast(`Yarışma için yeni en iyi: ${'★'.repeat(st)}`,1400)}}
function trakTick(){if(!G.trak)return;if(TRACT&&TRACT.el.classList.contains('lock')){TRACT.el.classList.remove('lock');TRACT.el.innerHTML='🚜 Traktör<small>Otomatik hasat açık</small>'}PL.forEach(o=>{if(!o.own||!o.seed)return;if(!o.w){o.w=true;o.end=NOW()+o.dur;plotSync(o);return}let n=0;while(o.seed&&o.w&&o.end<=NOW()&&n<50){n++;const c=CROPS[o.seed],k=o.seed,e0=o.end;G.inv[c.out]+=c.n;G.st.harv++;G.st.coll+=c.n;if(G.inv[k]>0){G.inv[k]--;o.end=e0+o.dur}else{o.seed=null;o.w=false}}if(n){plotSync(o);if(G.started&&view==='bahce')toast('Traktör hasat etti',900)}})}
function cirakTick(){if(!G.cirak)return;G.stLast=G.stLast||{};ST.forEach(s=>{for(let it=0;it<60;it++){let ch=false;const dn=s.jobs.filter(j=>NOW()>=j.end);if(dn.length){s.jobs=s.jobs.filter(j=>NOW()<j.end);s.ready=s.ready||{};dn.forEach(j=>{Object.entries(j.r.out).forEach(([k,n])=>s.ready[k]=(s.ready[k]||0)+n);s.lastEnd=Math.max(s.lastEnd||0,j.end)});ch=true}
  if(s.ready){const tot=Object.values(s.ready).reduce((a,b)=>a+b,0);if(tot&&!depoFull(tot)){giveAll(s.ready);G.st.proc++;s.ready=null;ch=true}}
  const ri=G.stLast[s.id],r=ri!=null?s.rec[ri]:null;if(r&&!s.ready&&s.jobs.length<(s.lvl||1)&&hasAll(r.in)){giveAll(r.in,-1);const st=s.lastEnd&&s.lastEnd<NOW()&&s.lastEnd>NOW()-r.s*80?s.lastEnd:NOW();s.jobs.push({r,end:st+r.s*spdOf(s)});s.lastEnd=st+r.s*spdOf(s);ch=true}
  if(!ch)break}})}
function kervanTick(){const kv=G.kervan;if(kv&&kv.trip&&NOW()>=kv.trip.end){const t=kv.trip;kv.trip=null;G.gold+=t.gold;G.st.earned+=t.gold;toast(`Kervan ${t.dest}'ten döndü!<br>+${t.gold} altın`,2600);notify('Kervan döndü',`${t.dest}: +${t.gold} altın`);sfx.coin();sfx.fan();hud();save()}}
function renderTrade(){const kv=G.kervan||{},cup=G.cup,cp=cup&&PRODS.find(p=>p.id===cup.pid),sto=(G.store||[]),val=sto.reduce((a,it)=>a+(it.price||(PRODS.find(p=>p.id===it.pid)||{}).base||0),0);
 let h=`<div class="grp">Usta yarışması (bu hafta)</div>`+(cp?`<div class="row"><img class="ic" src="${ICON[cp.id]}" alt=""><div class="n">${cp.ad}<small>Hafta sonuna kadar en iyi ürününü yap · Şu an: ${cup.best?'★'.repeat(cup.best):'henüz yok'} · 5★ altın (400), 4★ gümüş (200), 3★ bronz (80)</small></div></div>`:'');
 h+=`<div class="grp">Kervansaray</div>`+(G.tier<2?'<p style="font-size:12px;opacity:.7">Kademe 2\'de açılır</p>':kv.trip?`<div class="row"><div class="n">Kervan ${kv.trip.dest} yolunda<small>${kv.trip.n} ürün · dönüşte ${kv.trip.gold} altın · kalan ${fmtT(kv.trip.end-NOW())}</small></div></div>`:`<p style="font-size:12px;opacity:.8;margin:2px 0 6px">Depo rafındaki ${sto.length} ürün (değeri ${val} altın) kervanla uzak şehre satılır.</p>`+KDEST.map((d,i)=>`<div class="row"><div class="n">${d.ad}<small>${d.h} saat · ${d.m}× fiyat → ${Math.round(val*d.m)} altın</small></div><button class="btn g" data-kv="${i}" ${sto.length?'':'disabled'}>Gönder</button></div>`).join(''));
 h+=`<div class="grp">Yatırımlar</div><div class="row"><div class="n">Çırak<small>${G.cirak?'Çalışıyor: atölyede biten ürünleri toplar, son yaptığın tarifi malzeme varsa yeniden başlatır (oyun kapalıyken de)':'Atölyede üretimi senin yerine sürdürür · Kademe 2'}</small></div>${G.cirak?'<b class="bonc">✓</b>':`<button class="btn g" data-buy="cirak" ${G.tier<2||G.gold<450?'disabled':''}>450 altın</button>`}</div>
 <div class="row"><div class="n">Traktör<small>${G.trak?'Çalışıyor: tarlaları sular, hasat eder, tohum varsa yeniden eker':'Bostanda otomatik sulama, hasat ve ekim · Kademe 2'}</small></div>${G.trak?'<b class="bonc">✓</b>':`<button class="btn g" data-buy="trak" ${G.tier<2||G.gold<600?'disabled':''}>600 altın</button>`}</div>`;
 h+=`<div class="grp">Müdavimler</div>`+((G.reg||[]).length?(G.reg||[]).map(r=>{const p=PRODS.find(x=>x.id===r.fav);return `<div class="row"><div class="n">${r.ad}<small>Sevdiği: ${p?p.ad:'-'} · ${r.vis} ziyaret · 4★ ve üstüne bahşiş verir</small></div></div>`}).join(''):'<p style="font-size:12px;opacity:.7">5★ teslim ettiğin müşteriler müdavimin olabilir</p>');
 return h}
function tradeWire(){ui.sheet.querySelectorAll('[data-kv]').forEach(b=>b.onclick=()=>{const d=KDEST[+b.dataset.kv],sto=G.store||[];if(!sto.length||(G.kervan&&G.kervan.trip))return;const val=sto.reduce((a,it)=>a+(it.price||(PRODS.find(p=>p.id===it.pid)||{}).base||0),0);G.kervan={trip:{dest:d.ad,end:NOW()+d.h*3600,gold:Math.round(val*d.m),n:sto.length}};G.store=[];storeSync();sfx.coin();toast(`Kervan ${d.ad} yoluna çıktı`,1600);save();renderMenu()});
 ui.sheet.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{const k=b.dataset.buy,c=k==='cirak'?450:600;if(G.gold<c||G.tier<2)return;G.gold-=c;G[k]=true;sfx.coin();sfx.fan();toast(k==='cirak'?'Çırak işe başladı!':'Traktör alındı!',1600);if(k==='trak'&&TRACT){TRACT.el.classList.remove('lock');TRACT.el.innerHTML='🚜 Traktör<small>Otomatik hasat açık</small>'}hud();save();renderMenu()})}

/* ---------- mevsim görünümü ---------- */
let SEASM=null;function seasonLook(){if(!SEASM){SEASM=new Set();S.traverse(o=>{if(!o.isMesh||!o.material||Array.isArray(o.material))return;const p=new THREE.Vector3();o.getWorldPosition(p);if(Math.abs(p.x-OB)>16&&Math.abs(p.x-OP)>12)return;const m=o.material;if(!m.color||m.vertexColors||m.transparent)return;const c=m.color;if(c.g>c.r*1.05&&c.g>c.b*1.1){m.userData.c0=c.clone();SEASM.add(m)}})}
 const se=season(),T=[['#86c95a',0.12],null,['#d0882a',0.55],['#eef2f4',0.6]][se];SEASM.forEach(m=>{m.color.copy(m.userData.c0);if(T)m.color.lerp(new THREE.Color(T[0]),T[1])})}
/* ---------- günlük görevler ---------- */
const DQT=[{k:'deliv',ad:n=>`${n} sipariş teslim et`,n:[2,3,4],rw:40},{k:'coll',ad:n=>`Bahçeden ${n} malzeme topla`,n:[8,12,16],rw:30},{k:'proc',ad:n=>`Atölyede ${n} üretim topla`,n:[2,3,5],rw:35},{k:'earned',ad:n=>`${n} altın kazan`,n:[150,250,400],rw:45},{k:'five',ad:n=>`${n} adet 5★ ürün yap`,n:[1,2],rw:60},{k:'harv',ad:n=>`${n} hasat yap`,n:[2,3],rw:30}];
function dqTick(){if(!G.started)return;const d=G.day||1;if(G.dq&&G.dq.day===d)return;const pool=DQT.slice().sort(()=>Math.random()-0.5).slice(0,3);G.dq={day:d,t:pool.map(q=>{const n=pick(q.n);return {k:q.k,n,rw:Math.round(q.rw*(1+G.tier*0.3)),b:G.st[q.k]||0,ok:false}})};if(d>1)toast('Yeni günlük görevler var',1500)}
const dqProg=t=>Math.min(t.n,(G.st[t.k]||0)-t.b);
function renderDQ(){if(!G.dq)return '';const D=DQT.reduce((a,q)=>(a[q.k]=q,a),{});return `<div class="grp">Günlük görevler (${G.day}. gün)</div>`+G.dq.t.map((t,i)=>{const p=dqProg(t),done=p>=t.n;return `<div class="row"><div class="n">${D[t.k].ad(t.n)}<small>${p}/${t.n} · ödül ${t.rw} altın</small><div class="bar"><i style="width:${p/t.n*100}%"></i></div></div>${t.ok?'<b class="bonc">✓</b>':`<button class="btn ${done?'g':'l'}" data-dq="${i}" ${done?'':'disabled'}>Al</button>`}</div>`}).join('')}
function renderStats(){const st=G.st,top=Object.entries(G.cat).sort((a,b)=>b[1].n-a[1].n)[0],tp=top&&PRODS.find(p=>p.id===top[0]);const r=(a,b)=>`<div class="brk"><span>${a}</span><b>${b}</b></div>`;
 return `<div class="grp">İstatistikler</div><div style="padding:0 4px">`+r('Toplam kazanç',(st.earned||0)+' altın')+r('Teslim edilen sipariş',st.deliv||0)+r('5★ ürün',st.five||0)+r('Vitrinden satılan',st.sold||0)+r('Kaçan müşteri',st.lost||0)+r('Toplanan malzeme',st.coll||0)+r('Atölye üretimi',st.proc||0)+r('Hasat',st.harv||0)+r('En çok yapılan',tp?`${tp.ad} (${top[1].n})`:'-')+r('Keşfedilen ürün',`${Object.keys(G.cat).length}/${PRODS.length}`)+r('Müdavim',(G.reg||[]).length)+`</div>`}
/* ---------- öğretici ---------- */
const TUT=[['Arasta\'ya hoş geldin!','Zanaat çarşısında kendi dükkanını işletiyorsun. Müşteriler gelir, ne istediklerini söyler; sen de ürünü tezgâhta kendi ellerinle yaparsın.'],['Sipariş ve üretim','Müşteri gelince <b>Siparişi al</b>. Tezgâhta her adımı parmağınla yap: kes, dik, ovala, döv... Ne kadar özenli olursan o kadar çok yıldız ve altın.'],['Malzeme','<b>Bahçe</b>de hayvanlardan ve tarladan hammadde topla, <b>Atölye</b>de işle (deri, iplik, boya...), eksikleri <b>Pazar</b>dan al. Hepsi <b>Depo</b>da birikir.'],['Büyü','İtibar kazandıkça kademe atlarsın; yeni ürünler, aletler ve bölgeler açılır. Menüdeki <b>Ticaret</b>te özel siparişler, kervan ve yarışma seni bekler.']];
function tutShow(i){i=i||0;const t=TUT[i];openSheet('tut',`<h3>${t[0]}</h3><p style="font-size:15px;line-height:1.5">${t[1]}</p><div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px"><span style="opacity:.6;font-size:13px">${i+1}/${TUT.length}</span><button class="btn g" id="tutN">${i<TUT.length-1?'İleri':'Başla!'}</button></div>`);$('tutN').onclick=()=>{if(i<TUT.length-1)tutShow(i+1);else{G.tut=1;save();closeSheet()}}}
/* ---------- kademe dekoru ---------- */
const DEC3=[];function decoTier(){if(!DEC3.length){[[2,'flowerpot',{x:-2.6,z:1.2,h:0.9}],[2,'flowerpot',{x:2.6,z:1.2,h:0.9,ry:2}],[3,'barrel',{x:-2.55,z:2.9,h:0.6}],[3,'chest',{x:2.5,z:2.9,w:0.6,ry:-Math.PI/2}]].forEach(q=>{const it={t:q[0],g:null};DEC3.push(it);place(q[1],Object.assign({},q[2],{cb:w=>{it.g=w;w.visible=G.tier>=it.t}}))})}DEC3.forEach(it=>{if(it.g)it.g.visible=G.tier>=it.t})}
/* ---------- ses seviyesi / titreşim ---------- */
let MG=null;function OUT(){if(!MG){MG=AC.createGain();MG.gain.value=G.vol!=null?G.vol:1;MG.connect(AC.destination)}return MG}
function vib(p){if(G.vib===false||!navigator.vibrate)return;try{navigator.vibrate(p)}catch(e){}}

/* ---------- bildirim, servis çalışanı, sen yokken ---------- */
let SWR=null;try{if('serviceWorker' in navigator&&location.protocol==='https:'&&!/claude/.test(location.host))navigator.serviceWorker.register('sw.js').then(r=>SWR=r).catch(()=>{})}catch(e){}
function notify(t,b){try{if(pdev()||!G.notif||!document.hidden||typeof Notification==='undefined'||Notification.permission!=='granted')return;if(SWR&&SWR.showNotification)SWR.showNotification(t,{body:b,icon:'icon-512.png',tag:'arasta-'+t});else new Notification(t,{body:b,icon:'icon-512.png'})}catch(e){}}
function notifToggle(){if(G.notif){G.notif=false;save();renderMenu();return}if(typeof Notification==='undefined'){toast('Bu tarayıcı bildirim desteklemiyor.<br>iPhone\'da oyunu ana ekrana ekleyip oradan aç.',2600);return}Notification.requestPermission().then(async p=>{G.notif=p==='granted';if(!G.notif){toast('Bildirim izni verilmedi',1600);save();renderMenu();return}const ok=await pushSub();toast(ok?'Bildirimler açık<br><small>Oyun kapalıyken de gelir</small>':'Bildirim açık (yalnızca oyun açıkken)',2200);save();renderMenu()})}
function awaySummary(){const A=G.away;if(!A||A.secs<120)return;const L=[];if(A.jobs)L.push(`Atölyede <b>${A.jobs}</b> üretim tamamlandı${G.cirak?' (çırak topladı)':''}`);if(A.plots)L.push(`<b>${A.plots}</b> tarla hasada hazır${G.trak?' (traktör hallediyor)':''}`);if(A.kervan)L.push(`Kervan döndü: <b>+${A.kervan}</b> altın`);if(A.coll)L.push(`Bahçede <b>${A.coll}</b> malzeme yeniden çıktı`);if(A.deliv)L.push(`Tedarikçi siparişin geldi`);
 if(!L.length)return;openSheet('away',`<h3>Sen yokken (${fmtT(A.secs)})</h3>`+L.map(l=>`<div class="row"><div class="n">${l}</div></div>`).join('')+closeBtn);wire();G.away=null}

const VAPID='BIAsbbWc0305EXp_j5vBzKjYVUzbh5Pgak7tYDn6tDrKtG1o_Qa8r4aR0Ju1_S0gAvwPt2ZaJ1Du_1I4txvSmxA';
const pdev=()=>{try{return localStorage.getItem('arasta-pdev')}catch(e){return null}};
function b64u(s){const p='='.repeat((4-s.length%4)%4),b=atob((s+p).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from([...b].map(c=>c.charCodeAt(0)))}
let pushErr='';async function pushSub(){try{if(!('serviceWorker' in navigator)||!('PushManager' in window)){pushErr='Bu tarayıcı push desteklemiyor (ana ekrandan açtığından emin ol)';return false}if(!SWR){try{SWR=await navigator.serviceWorker.register('sw.js')}catch(e){pushErr='Servis çalışanı kurulamadı';return false}}const reg=await navigator.serviceWorker.ready;let sub=await reg.pushManager.getSubscription();if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64u(VAPID)});const id=await rpc('arasta_push_reg',{p_sub:sub.toJSON(),p_dev:pdev()});if(id){localStorage.setItem('arasta-pdev',id);pshH='';pushErr='';pushSync(true);return true}pushErr='Sunucu kaydı başarısız'}catch(e){pushErr=(e&&e.message)||String(e)}return false}
function pushItems(){const L=[],now=NOW();ST.forEach(s=>s.jobs.forEach(j=>{if(j.end>now)L.push({at:j.end,t:'Atölye',b:`${s.ad}: ${Object.keys(j.r.out).map(k=>MATS[k].ad).join(', ')} hazır`})}));
 PL.forEach(o=>{if(o.own&&o.seed&&o.w&&o.end>now&&!G.trak)L.push({at:o.end,t:'Bahçe',b:`${MATS[CROPS[o.seed].out].ad} hasada hazır`})});
 if(G.kervan&&G.kervan.trip&&G.kervan.trip.end>now)L.push({at:G.kervan.trip.end,t:'Kervan döndü',b:`${G.kervan.trip.dest} seferinden +${G.kervan.trip.gold} altın`});
 (G.deliv||[]).forEach(d=>{if(d.end>now)L.push({at:d.end,t:'Tedarikçi',b:'Siparişin geldi'})});
 ((G.ext&&G.ext.act)||[]).forEach(a=>{const p=PRODS.find(x=>x.id===a.pid);if(a.due-3600>now)L.push({at:a.due-3600,t:'Özel sipariş',b:`${a.from}: ${p?p.ad:''} için son 1 saat`})});
 L.sort((a,b)=>a.at-b.at);const out=[];L.forEach(x=>{const pr=out[out.length-1];if(pr&&pr.t===x.t&&Math.abs(pr.at-x.at)<60){if(!/ ve daha/.test(pr.b))pr.b+=' ve daha fazlası';}else out.push(x)});return out.slice(0,30).map(x=>({at:Math.round(x.at),t:x.t,b:x.b}))}
let pshH='',pshT=0;function pushSync(force,ka){if(!force&&!ka&&Date.now()-pshT<10000)return;const d=pdev();if(!d||!G.notif)return;pshT=Date.now();const it=pushItems(),h=JSON.stringify(it);if(!force&&h===pshH)return;pshH=h;rpc('arasta_push_set',{p_dev:d,p_items:it},ka).then(n=>{if(n===-1){localStorage.removeItem('arasta-pdev');pushSub()}}).catch(()=>{pshH=''})}
document.addEventListener('visibilitychange',()=>{if(document.hidden)pushSync(false,true)});

/* ---------- kullanıcı adı + şifre ---------- */
const acctLoc=()=>{try{return JSON.parse(localStorage.getItem('arasta-acct')||'null')}catch(e){return null}};
const ACM={bad_name:'Kullanıcı adı 3-20 karakter olmalı (harf, rakam, _ .)',bad_pin:'Şifre 4-8 rakam olmalı',taken:'Bu kullanıcı adı alınmış ya da şifre yanlış',locked:'Çok fazla hatalı deneme, 10 dk sonra tekrar dene',bad_code:'Bulut kaydı henüz hazır değil, biraz sonra dene',nouser:'Böyle bir kullanıcı yok',pin:'Şifre yanlış'};
async function acctLink(u,p){if(!G.cloud){G.cloud=newCode();save()}await cloudPush(true);const r=await rpc('arasta_user_set',{p_uname:u,p_pin:p,p_code:G.cloud});if(r==='created'||r==='linked'){G.acct=u.toLowerCase().trim();try{localStorage.setItem('arasta-acct',JSON.stringify({u:G.acct,p}))}catch(e){}save();return 'ok'}return r}
function acctAuto(){const a=acctLoc();if(!a||G.acct===a.u||!G.cloud)return;rpc('arasta_user_set',{p_uname:a.u,p_pin:a.p,p_code:G.cloud}).then(r=>{if(r==='created'||r==='linked'){G.acct=a.u;save()}}).catch(()=>{})}
function renderAcct(){return G.acct?`<div class="grp">Hesap</div><p style="font-size:13px;margin:0 0 6px">Kullanıcı adın: <b>${esc(G.acct)}</b> ✓<br><small style="opacity:.75">Yeni telefonda giriş ekranındaki <b>Giriş yap</b> ile dükkanlarına dönebilirsin.</small></p>`:
 `<div class="grp">Hesap</div><p style="font-size:12px;margin:0 0 6px;opacity:.8">Kullanıcı adı ve şifre belirle; uygulamayı silsen ya da telefon değiştirsen de dükkanına geri dönersin.</p><div style="display:flex;gap:6px;flex-wrap:wrap"><input id="acU" placeholder="Kullanıcı adı" autocomplete="username" autocapitalize="none" style="flex:1;min-width:120px"><input id="acP" placeholder="Şifre" aria-label="Şifre" inputmode="numeric" type="password" autocomplete="new-password" style="width:130px"></div><div class="pk" style="margin-top:6px"><button class="btn g" id="acB">Hesabı kaydet</button></div>`}
function acctWire(){const b=$('acB');if(b)b.onclick=async()=>{const u=$('acU').value,p=$('acP').value;b.textContent='…';b.disabled=true;let r;try{r=await acctLink(u,p)}catch(e){r='net'}if(r==='ok'){sfx.fan();toast('Hesabın kaydedildi',1600)}else toast(ACM[r]||'Bağlantı kurulamadı',2200);renderMenu()}}

function tick(){extTick();pushSync();dqTick();decoTier();if(lastSeas!==season()||!SEASM)setTimeout(seasonLook,0);cupTick();trakTick();cirakTick();kervanTick();{const se=season();if(lastSeas!==se){if(lastSeas>=0&&G.started)toast(`${SEAS[se].ic} ${SEAS[se].ad} geldi!<br>Talep görenler: ${SEAS[se].p.map(id=>(PRODS.find(x=>x.id===id)||{}).ad).filter(Boolean).slice(0,4).join(', ')}`,3200);lastSeas=se}}if(G.gu)gSync();if(DOORH&&DOORH.userData.dk===undefined)decoApply();updTimers();dayTick();dayLight();hud();giftTick();plotTick();patUI();checkAch();if(++saveN>20){saveN=0;save()}
if(tt>G.mktT){restock();if(modalMode==='market')renderMarket()}
for(let i=G.deliv.length-1;i>=0;i--)if(NOW()>=G.deliv[i].end){giveAll(G.deliv[i].items);toast('Tedarikçi geldi: '+Object.entries(G.deliv[i].items).map(([k,n])=>n+' '+MATS[k].ad).join(', '),2000);G.deliv.splice(i,1);refresh();if(modalMode==='market')renderMarket()}
ST.forEach(s=>{const dn=s.jobs.filter(j=>NOW()>=j.end);if(!dn.length)return;s.jobs=s.jobs.filter(j=>NOW()<j.end);s.ready=s.ready||{};dn.forEach(j=>Object.entries(j.r.out).forEach(([k,n])=>s.ready[k]=(s.ready[k]||0)+n));sfx.ready();if(modalMode==='st:'+s.id)openStation(s);else if(view!=='islik')toast(s.ad+': üretim bitti',1400);notify('Atölye',s.ad+': üretim bitti')});
COLL.forEach(o=>{const c=o.userData.coll;if(!c.alive&&NOW()>=c.t){c.alive=true;o.visible=true;tween(0.4,k=>o.scale.copy(c.base).multiplyScalar(Math.max(0.01,k)))}})}

/* ---------- tezgah üretimi ---------- */
const craft=new THREE.Group();S.add(craft);let K=null;
function startCraft(){const o=G.order;if(!o||!hasNeed(o.p))return;Object.entries(o.p.need).forEach(([k,n])=>{if(k!=='boya')G.inv[k]-=n});
G.phase='craft';say(null);G.bubOn=false;actions([]);Q.forEach(c=>c.g.visible=false);K={p:o.p,si:-1,skips:0,parts:{},late:false,scores:[],names:[],work:new THREE.Group(),top:Y+(o.p.wood?0.03:0.012)};craft.add(K.work);
view='bench';sway=0;refresh();moveCam(VIEWS.bench,1.1,nextStep)}
function phaseOf(i){const st=K.p.steps,isA=x=>['rhythm','asm','drag','hold'].includes(x.t);let f=st.findIndex(isA),l=-1;st.forEach((x,j)=>{if(isA(x))l=j});return f<0||i<f?'Hazırlık':i<=l?'Birleştirme':'Bitiriş'}
function tipStep(extra){const s=K.p.steps[K.si],key=stepKey(s),t=STEPTXT[key];tip(`<span class="pips">${K.p.steps.map((_,i)=>`<i class="${i<K.si?'d':i===K.si?'c':''}"></i>`).join('')}</span>${phaseOf(K.si)} · ${s.ad||t[0]}<small>${extra||t[1]}</small>`)}
function nextStep(){if(K.dead)return;hookClear();K.si++;const s=K.p.steps[K.si];if(K.bkt){K.work.remove(K.bkt);K.bkt=null}if(s&&s.t==='rub'&&s.k==='torch')setTimeout(()=>{if(K.st===s&&!K.dead)torchAt(null)},60);if(s&&/dald/i.test(s.ad||'')){const w=fitM('m_bucket',{h:0.28});if(w){w.position.set(BC.x+0.5,Y,BC.z+0.05);K.work.add(w);K.bkt=w}}K.st=s;G.step=s.t;tipStep();K.tool=stepTool(s,K.p);if(K.tool)eqUse(K.tool);{const rest=K.p.steps.slice(K.si);if(!K.is3d&&K.si>0&&s.t!=='design'&&((s.t==='rub'&&s.k==='sekil')||rest.every(x=>['rub','hold','design'].includes(x.t))))to3D()}if(s.to3d&&!K.is3d)to3D(true);({asm:bAsm,trace:bTrace,rhythm:bRhythm,drag:bDrag,hold:bHold,rub:bRub,design:bDesign,pump:bPump,blow:bStuff,grind:bGrind,split:bSplit,zig:bZig,weld:bWeld,gems:bGems,roll:bRoll,screw:bScrew,bend:bBend,layer:bLayer,strips:bStrips,weave:bWeave,spin:bSpin,stir:bStir,pour:bPour,stuff:bStuff,path:bPath,hammer:bHammer,fold:bFold,lace:bLace,shuttle:bShuttle,chisel:bChisel,plane:bPlane,drill:bDrill})[s.t]();
if(s.t!=='design'){const b=btn('Adımı atla','l',skipStep);b.style.cssText='min-height:34px;font-size:13px;padding:2px 10px;opacity:.85';ui.act.appendChild(b)}}
function skipStep(){const t=G.step;if(!t||t==='design')return;K.skips++;K.skipping=true;if(K.skipFn){const f=K.skipFn;hookClear();if(!f())stepDone(0);return}
if(t==='trace'){K.covP=0;eTrace()}else{if(t==='asm'){K.aq=[];if(K.drag)K.drag=null}if(t==='rhythm'){if(K.dot)K.dot.live=false;K.dot=null}else if(t==='drag'&&K.drag){K.work.remove(K.drag.obj);K.drag=null}else if(t==='hold'){K.holding=false;if(K.press){K.work.remove(K.press);K.press=null}}else if(t==='rub'){K.cells=null;K.rubbing=false}else if(t==='pump'){K.pn=K.pN;const g=K.m3&&K.m3.g;if(g)g.scale.setScalar(1.6)}stepDone(0)}}
const grade=s=>s>0.85?'Mükemmel!':s>0.6?'İyi!':s>0.35?'Fena değil':'Biraz özensiz';
function stepDone(s,msg){if(K.skipping){K.skipping=false;s=0;msg='Adım atlandı'}else{s=eqScore(s);if(s>0.6)sfx.good()}K.scores.push(s);K.names.push(K.st.ad||STEPTXT[stepKey(K.st)][0]);G.step=null;actions([]);toast(msg||grade(s),800);setTimeout(nextStep,850)}
function bTrace(){if(K.pstep!==K.si){K.pstep=K.si;K.pi=0;K.ps=[]}const st=K.st,c=st.hole?V(BC.x+st.at[K.pi][0],Y,BC.z+st.at[K.pi][1]):st.at?V(BC.x+st.at[0],Y,BC.z+st.at[1]):BC,sh=(st.shape||K.p.shape)(),pts=sh.getPoints(40);K.tc=c;K.tsh=sh;if(K.pstep!==K.si){K.pstep=K.si;K.pi=0;K.ps=[]}if(st.part||st.hole)tipStep(`${st.ad} ${K.pi+1}/${st.n} · Kesik çizgiyi takip et`);let x0=9,x1=-9,y0=9,y1=-9;pts.forEach(p=>{x0=Math.min(x0,p.x);x1=Math.max(x1,p.x);y0=Math.min(y0,p.y);y1=Math.max(y1,p.y)});
K.sheet=st.hole?null:put(K.work,B(x1-x0+0.1,st.thin?0.012:K.p.wood?0.03:0.012,y1-y0+0.1),st.col?(st.glass?new THREE.MeshStandardMaterial({color:st.col,transparent:true,opacity:0.75,roughness:0.15}):M(st.col)):M(K.p.sheet),c.x+(x0+x1)/2,(Y+K.top)/2,c.z-(y0+y1)/2);
K.path=shapePts(sh,110,c,K.top-Y+0.002);K.cov=new Array(110).fill(false);K.strokes=[];K.dev=0;K.devN=0;K.covP=0;
actions([btn('Kesimi bitir','',eTrace,true)])}
function cutPoint(p){sThr(sfx.cut,0.17);toolAt(p,K.st.hole||K.p.cut==='kn'?'kn':['bakir','pirinc','demir','celik'].some(k=>K.p.need[k])?'ax':K.p.hard?'sw':'sc');const st=K.strokes[K.strokes.length-1];st.push(p);let m=9;K.path.forEach((q,i)=>{const d=Math.hypot(q.x-p.x,q.z-p.z);if(d<m)m=d;if(d<0.035)K.cov[i]=true});
K.dev+=Math.min(m,0.1);K.devN++;const c=K.cov.filter(Boolean).length/K.cov.length;K.covP=c;tipStep('Kesildi: %'+Math.round(c*100));
const b=ui.act.querySelector('button');if(b)b.disabled=c<0.5;if(c>=0.94)eTrace()}
function holeDone(s){const st=K.st,sh=K.tsh,d=K.p.wood?0.03:0.012;K.holes=K.holes||[];
 const add=i=>{const a=st.at[i];K.holes.push(new THREE.Path(sh.getPoints(40).map(p=>new THREE.Vector2(p.x+a[0],p.y-a[1]))));const ms=K.p.shape();ms.holes=K.holes.slice();K.piece.geometry.dispose();K.piece.geometry=ext(ms,d);
  const plug=flat(sh,d,K.p.sheet);plug.position.set(BC.x+a[0],Y,BC.z+a[1]);K.work.add(plug);const p0=plug.position.clone();tween(0.5,k=>{plug.position.set(p0.x+0.25*k,Y+Math.sin(k*Math.PI)*0.1,p0.z+0.3*k);plug.scale.setScalar(Math.max(0.01,1-k))},()=>K.work.remove(plug))};
 if(K.skipping){while(K.pi<st.n){add(K.pi);K.pi++}stepDone(0);return}add(K.pi);sfx.pick();K.ps.push(s);K.pi++;
 if(K.pi<st.n){toast(grade(s),600);setTimeout(()=>{if(G.step==='trace')bTrace()},650)}else stepDone(avg(K.ps),'Yuvalar açıldı!')}
function partDone(s){const st=K.st,th=K.p.wood?0.03:0.012,L=K.parts[st.part]=K.parts[st.part]||[],mk=()=>{const pc=flat(K.tsh,st.thin?0.012:th,st.col?(st.glass?new THREE.MeshStandardMaterial({color:st.col,transparent:true,opacity:0.75,roughness:0.15}):M(st.col)):K.p.sheet);pc.userData.sh=K.tsh;pc.position.copy(K.tc);K.work.add(pc);
 const bb=K.tsh.getPoints(20);let hw=0,hd=0;bb.forEach(q=>{hw=Math.max(hw,Math.abs(q.x));hd=Math.max(hd,Math.abs(q.y))});const j=L.length,N=st.n||1,tall=hd>hw*1.8;let ps,to;if(tall){ps=Math.min(1,0.15/hd,0.05/hw);to=V(BC.x+0.42+j*(2*hw*ps+0.025)-(N>3?0.05:0),Y+j*0.002,BC.z+0.02)}else{ps=Math.min(1,0.09/Math.max(hw,0.01),(N>1?0.27:0.3)/Math.max(hd,0.01)/(N>2?N/2:1));to=V(BC.x+0.48,Y+j*0.004,BC.z-0.24+j*Math.min(0.2,0.6/Math.max(N-1,1)))}pc.userData.ps=ps;L.push(pc);const fr=pc.position.clone();tween(0.4,k=>{pc.position.lerpVectors(fr,to,k);pc.position.y=to.y+Math.sin(k*Math.PI)*0.06;pc.scale.setScalar(1+(ps-1)*k)})};
 if(K.skipping){while(K.pi<st.n){mk();K.pi++}stepDone(0);return}mk();K.ps.push(s);K.pi++;
 if(K.pi<st.n){toast(grade(s),600);setTimeout(()=>{if(G.step==='trace')bTrace()},650)}else stepDone(avg(K.ps),'Parçalar hazır!')}
function bAsm(){const s=K.st,L=K.parts[s.part]||[];K.aq=L.map((obj,i)=>{const q=s.slots[i%s.slots.length];return {obj,rot:q[2]||0,tgt:V(BC.x+q[0],(s.tile?Y:K.top+(s.pose==='leg'?0:0.006))+(s.stack||0)*i,BC.z+q[1])}});K.an=K.aq.length;K.as=[];nextAsm()}
function nextAsm(){if(G.step!=='asm')return;const it=K.aq.shift();if(!it){stepDone(K.as.length?avg(K.as):0);return}const leg=K.st.pose==='leg';
 {const o=it.obj,s0=o.scale.x;if(s0!==1)tween(0.25,k=>o.scale.setScalar(s0+(1-s0)*k))}{const o=it.obj,r0=o.rotation.z;if(r0!==it.rot)tween(0.25,k=>o.rotation.z=r0+(it.rot-r0)*k)}K.drag={obj:it.obj,tgt:it.tgt,asm:1,outline:shapePts(leg?circleShape(0.04):rotShape(it.obj.userData.sh,it.rot),44,K.st.tile?V(it.tgt.x,K.top,it.tgt.z):it.tgt,0.004)};it.obj.position.y=K.top+0.03;tipStep(`${STEPTXT.asm[1]} · ${K.an-K.aq.length}/${K.an}`)}
function asmDrop(){const D=K.drag,leg=K.st.pose==='leg',d=Math.hypot(D.obj.position.x-D.tgt.x,D.obj.position.z-D.tgt.z),s=clamp(1-d/(leg?0.08:0.12),0,1),ob=D.obj,tg=D.tgt.clone(),fr=ob.position.clone();K.drag=null;K.as.push(s);sfx.drop();
 tween(0.2,k=>{ob.position.lerpVectors(fr,tg,k);ob.position.y=tg.y+0.06*Math.sin(k*Math.PI)},()=>{puff(tg,6);if(leg){K.work.remove(ob);const h=0.4,lg=put(K.work,Cy(0.022,0.03,h,8),M(K.p.sheet),tg.x,K.top,tg.z);lg.rotation.z=-(tg.x-BC.x)*0.5;lg.rotation.x=(tg.z-BC.z)*0.5;lg.scale.y=0.01;
  tween(0.3,k=>{lg.scale.y=Math.max(0.01,k);lg.position.y=K.top+h*k/2});sfx.punch()}else sfx.stitch();toast(s>0.8?'Tam oturdu!':s>0.45?'İyi':'Biraz kaydı',500);setTimeout(nextAsm,450)})}
function eTrace(){if(G.step!=='trace')return;const ad=K.devN?K.dev/K.devN:0.1,s=clamp(K.covP,0,1)*clamp(1-(ad-0.01)/0.05,0.2,1);
if(K.sheet)K.work.remove(K.sheet);K.strokes=[];K.path=null;const st=K.st;if(st.hole){holeDone(s);return}if(st.part){partDone(s);return}K.piece=flat(K.p.shape(),K.p.wood?0.03:0.012,K.p.sheet);K.piece.position.copy(BC);K.work.add(K.piece);
{const pc=K.piece;if(pc&&pc.position)tween(0.35,k=>pc.position.y=Y+Math.sin(k*Math.PI)*0.05)}stepDone(s,s>0.8?'Temiz kesim!':null)}
function puff(c,n,col){for(let i=0;i<n;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(0.016,5,4),new THREE.MeshBasicMaterial({color:col||'#efe4c8',transparent:true,opacity:0.85}));const a=Math.random()*Math.PI*2,r=0.12+Math.random()*0.18,w=(K&&K.work&&G.phase==='craft')?K.work:S;m.position.copy(c);w.add(m);
tween(0.45,k=>{m.position.set(c.x+Math.cos(a)*r*k,c.y+0.06*Math.sin(k*Math.PI),c.z+Math.sin(a)*r*k);m.material.opacity=0.85*(1-k);m.scale.setScalar(1+k*1.2)},()=>{w.remove(m);m.geometry.dispose();m.material.dispose()})}}
const SRC=new THREE.Raycaster();function hitTop(x,z){if(!(K&&K.is3d&&K.m3))return null;K.m3.g.updateMatrixWorld(true);SRC.set(V(x,Y+3,z),V(0,-1,0));const h=SRC.intersectObject(K.m3.g,true).find(i=>i.object.visible!==false);return h?h.point:null}
function onSurf(q){if(!(K&&K.is3d&&K.m3))return q;for(let t=1;t>=0;t-=0.08){const x=BC.x+(q.x-BC.x)*t,z=BC.z+(q.z-BC.z)*t,h=hitTop(x,z);if(h)return V(h.x,h.y+0.003,h.z)}return q}
function bRhythm(){const s=K.st;let P=[];if(s.pts)P=s.pts.map(q=>V(BC.x+q[0],K.top+0.002,BC.z+q[1]));else if(s.line)for(let i=0;i<s.n;i++)P.push(V(BC.x,K.top+0.002,BC.z-0.32+i*0.05));else P=shapePts(K.p.shape(),s.n,BC,K.top-Y+0.002,s.sc||0.86);
if(K.is3d&&K.m3&&!s.pts&&!s.line){K.m3.g.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(K.m3.g),C=bb.getCenter(V()),Rr=Math.min(bb.max.x-bb.min.x,bb.max.z-bb.min.z)/2*0.8;P=[];for(let i=0;i<s.n;i++){const t=i/s.n*Math.PI*2+Math.PI/2;P.push(V(C.x+Math.cos(t)*Rr,0,C.z+Math.sin(t)*Rr))}}if(K.is3d)P=P.map(onSurf);K.rp=P;K.ri=-1;K.rs=[];K.prev=null;const gk=s.k;K.ghost=P.map(q=>{const m=new THREE.Mesh(gk==='yapistir'?Cy(0.014,0.014,0.003,10):Cy(0.006,0.006,0.003,8),new THREE.MeshBasicMaterial({color:gk==='yapistir'?'#fff6d8':'#2a1c12',transparent:true,opacity:0.35}));m.position.copy(q);K.work.add(m);return m});setTimeout(nextDot,400)}
const ringScale=t=>3.2-t*2.4;
function nextDot(){if(G.step!=='rhythm')return;K.ri++;if(K.ri>=K.rp.length){K.dot=null;stepDone(K.rs.reduce((a,b)=>a+b,0)/K.rs.length);return}
const k=K.st.k,m=k==='yapistir'?mesh(Cy(0.016,0.016,0.006,10),M('#f4ecd0')):mesh(Cy(k==='delik'?0.012:0.007,k==='delik'?0.012:0.007,0.004,8),M('#1d1612'));
if(K.ghost&&K.ghost[K.ri])K.ghost[K.ri].visible=false;m.position.copy(K.rp[K.ri]);K.work.add(m);K.dot={m,t:0,live:true};tipStep(`${STEPTXT[k][1]} · ${K.ri+1}/${K.rp.length}`)}
function rhythmTap(){const D=K.dot;if(!D||!D.live)return;D.live=false;const e=Math.abs(ringScale(D.t)-1),s=clamp(1-e/1.3,0,1);K.rs.push(s);stab(D.m.position,K.st.k);dotDone(D,s)}
function dotDone(D,s){if(s>0)({dik:sfx.stitch,yapistir:sfx.glue,delik:sfx.punch})[K.st.k]();else sfx.bad();if(K.st.k==='yapistir'){const gm=D.m;gm.material.color.set(s>0.6?'#ffe9a8':'#d8c9a0');tween(0.25,k=>gm.scale.set(1+0.9*k,1+k,1+0.9*k))}
if(K.st.k==='delik'&&s>0){const hm=D.m;tween(0.15,k=>hm.scale.set(1+0.4*k,1,1+0.4*k));puff(hm.position,4,'#c9a37a')}
if((K.st.k==='dik'||K.st.k==='yapistir')&&K.prev&&(!K.st.pts||(K.st.seam&&K.prev.distanceTo(D.m.position)<0.1))){const gl=K.st.k==='yapistir',ln=lineSeg(K.work,K.prev,D.m.position,gl?(s>0?'#f7ecc4':'#cfc4a0'):(s>0?'#efe0b8':'#8a6a4a'),gl?0.022:0.009),pz=ln.position.clone(),a=K.prev.clone();ln.scale.z=0.01;tween(0.16,k=>{ln.scale.z=Math.max(0.01,k);ln.position.lerpVectors(a,pz,k)})}if(K.st.k==='dik'||K.st.k==='yapistir')K.prev=D.m.position.clone();if(K.ri===K.rp.length-1&&!K.st.pts&&!K.st.line&&(K.st.k==='dik'||K.st.k==='yapistir')&&K.rp.length>2){const gl=K.st.k==='yapistir';const l2=lineSeg(K.work,D.m.position,K.rp[0],gl?'#f7ecc4':'#efe0b8',gl?0.022:0.009);l2.scale.z=0.01;setTimeout(()=>tween(0.2,k=>l2.scale.z=Math.max(0.01,k)),120)}
toast(s>0.8?'Tam zamanında!':s>0.4?'İyi':s>0?'Erken':'Kaçtı',450);setTimeout(nextDot,280)}
function bDrag(){const w=K.st.what;let obj,tgt,out;
if(w==='nozzle'){obj=new THREE.Group();const br=M('#c9a23a',0.25);put(obj,Cy(0.016,0.021,0.05,12),br,0,0.025,0);put(obj,Cy(0.024,0.024,0.012,12),br,0,0.056,0);put(obj,Cy(0.013,0.016,0.03,10),M('#1d1d1f',0.7),0,0.075,0);put(obj,Cy(0.006,0.006,0.04,8),M('#9aa0a8',0.25),0,-0.012,0);tgt=V(BC.x+0.03,K.top+0.03,BC.z);out=circleShape(0.035);obj.position.set(BC.x+0.3,K.top+0.05,BC.z+0.3);mkPump();K.nozObj=obj}
else if(w==='taban'){obj=flat(soleShape(1),0.03,'#2a221d');tgt=V(BC.x,K.top+0.005,BC.z);out=soleShape(1);obj.position.set(-0.47,K.top+0.02,1.95)}
else{obj=buckle();tgt=V(BC.x,K.top+0.004,BC.z+(K.p.id==='kemer'?0.3:-0.2));out=rrect(0.12,0.09,0.015);obj.position.set(0.47,K.top+0.02,1.98)}
K.work.add(obj);K.drag={obj,tgt,outline:shapePts(out,48,tgt,0.004)}}
function eDrag(){sfx.drop();const D=K.drag,d=Math.hypot(D.obj.position.x-D.tgt.x,D.obj.position.z-D.tgt.z),s=clamp(1-d/(K.st.what==='taban'?0.16:0.1),0,1);
const fr=D.obj.position.clone(),ob=D.obj,tg=D.tgt.clone();if(K.st.what==='nozzle'){K.nozzle=ob;K.nozObj=ob}tween(0.22,k=>{ob.position.lerpVectors(fr,tg,k);ob.position.y=tg.y+0.08*Math.sin(k*Math.PI)},()=>{puff(tg,8);tween(0.18,k=>ob.scale.set(1+0.08*Math.sin(k*Math.PI),1-0.25*Math.sin(k*Math.PI),1+0.08*Math.sin(k*Math.PI)))});K.drag=null;stepDone(s,s>0.85?'Tam yerinde!':null)}
function to3D(defl){K.is3d=true;const st=K.p.styles?(G.order.style||K.p.styles[0]):null,m=K.p.build(K.p.sheet,st,K);K.work.children.forEach(c=>c.visible=false);m.g.position.copy(BC);m.g.scale.setScalar(1.6);K.work.add(m.g);m.g.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(m.g);K.top=bb.max.y+0.002;K.piece={material:m.um,scale:{set z(v){m.g.scale.y=1.6*v;if(K.st&&K.st.tool==='kompresor'){m.g.scale.x=m.g.scale.z=1.6*v}},get z(){return m.g.scale.y/1.6}}};K.m3=m;const g=m.g;if(defl){g.scale.set(1.6*0.62,1.6*0.14,1.6*0.62);g.updateMatrixWorld(true);K.top=new THREE.Box3().setFromObject(g).max.y+0.002;K.defl=true;return}g.scale.set(1.6,0.06,1.6);sfx.drop();puff&&puff(V(BC.x,Y+0.05,BC.z),8,'#e8dcc0');tween(0.5,k=>g.scale.set(1.6,0.06+1.54*k,1.6));toast('Ürün şekillendi',900)}
function mkPump(){if(K.pDev&&K.pDev.parent)return K.pDev;const d=new THREE.Group();d.position.set(BC.x+0.4,Y,BC.z-0.26);d.rotation.y=-0.35;K.work.add(d);K.pDev=d;
 const red=M('#b8322a',0.35),dk=M('#1d1d1f',0.7),st=M('#b8bcc0',0.25),br=M('#c9a23a',0.25);
 put(d,B(0.22,0.018,0.13),M('#4a2c14'),0,0.009,0);put(d,B(0.06,0.012,0.13),dk,-0.09,0.024,0);put(d,B(0.06,0.012,0.13),dk,0.09,0.024,0);
 put(d,Cy(0.034,0.038,0.32,16),red,0,0.19,0);put(d,Cy(0.04,0.04,0.016,16),dk,0,0.358,0);put(d,Cy(0.042,0.042,0.014,16),dk,0,0.035,0);
 const ol=put(d,Cy(0.011,0.011,0.035,10),br,-0.045,0.06,0);ol.rotation.z=Math.PI/2;
 const hd=new THREE.Group();hd.position.y=0.5;d.add(hd);put(hd,Cy(0.007,0.007,0.3,8),st,0,-0.1,0);put(hd,Cy(0.016,0.016,0.2,10),dk,0,0.05,0).rotation.z=Math.PI/2;K.pH=hd;
 const gw=new THREE.Group();gw.position.set(0.0,0.27,0.04);d.add(gw);const gb=put(gw,Cy(0.032,0.032,0.012,18),st,0,0,0);gb.rotation.x=Math.PI/2;const gfc=put(gw,Cy(0.027,0.027,0.004,18),M('#f4ecd8'),0,0,0.007);gfc.rotation.x=Math.PI/2;
 K.pG=put(gw,B(0.003,0.022,0.002),M('#c0392b'),0,0,0.01);K.pG.geometry.translate(0,0.01,0);K.pG.rotation.z=1.2;
 const hm=M('#1f1f22',0.65);K.hoseM=hm;let last='';
 K.hoseF=()=>{const n=K.nozObj;if(!n||!n.visible||!d.parent){if(K.hose)K.hose.visible=false;return}d.updateMatrixWorld(true);const o=d.localToWorld(V(-0.065,0.06,0)),e=n.position.clone();e.y+=0.085;const key=o.x.toFixed(3)+e.x.toFixed(3)+e.y.toFixed(3)+e.z.toFixed(3)+(K.drag?1:0)+(K.m3?K.m3.g.scale.x.toFixed(3):'');if(key===last)return;last=key;
  const yb=Y+0.014,g=K.m3&&K.is3d?K.m3.g:null,drg=K.drag&&K.drag.obj===n;let P;
  if(g&&!drg){g.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(g),C=bb.getCenter(V()),Rr=Math.max(bb.max.x-bb.min.x,bb.max.z-bb.min.z)/2,cy=C.y,d=V(o.x-C.x,0,o.z-C.z).normalize(),at=(r,y)=>V(C.x+d.x*r,y,C.z+d.z*r);
   P=[o,V(o.x-d.x*0.06,yb+0.01,o.z-d.z*0.06),at(Rr+0.1,yb),at(Rr+0.075,cy),at(Rr*0.72+0.03,bb.max.y+0.05),V(e.x+d.x*0.035,e.y+0.07,e.z+d.z*0.035),e]}
  else{const mx=(o.x+e.x)/2,mz=(o.z+e.z)/2;P=[o,V(o.x-0.06,yb+0.01,o.z+0.02),V(mx,yb,mz+0.12),V(e.x+0.05,e.y+0.05,e.z+0.03),V(e.x+0.01,e.y+0.06,e.z),e]}
  const c=new THREE.CatmullRomCurve3(P,false,'centripetal'),tg=new THREE.TubeGeometry(c,64,0.0095,8,false);
  if(K.hose){K.hose.geometry.dispose();K.hose.geometry=tg;K.hose.visible=true}else{K.hose=new THREE.Mesh(tg,hm);K.hose.castShadow=true;K.work.add(K.hose)}};
 K.hoseF();return d}
function bPump(){const n=K.st.n||10;K.pn=0;K.pN=n;K.pS=[];K.pL=-1;mkPump();
 ui.act.innerHTML='<div class="gauge"><div class="gf" id="gf" style="width:0%"></div></div>';const b=btn('Bas, çek!','g',pumpTap);b.style.minWidth='60%';b.classList.add('beat');ui.act.appendChild(b);tipStep('Saniyede bir bas · 0/'+n)}
function pumpTap(){if(G.step!=='pump')return;const now=tt,dt=K.pL<0?1:now-K.pL;if(dt<0.35){toast('Çok hızlı! Pompa dolmadı',600);sfx.bad&&sfx.bad();return}K.pL=now;const sc=clamp(1-Math.abs(dt-1)/0.9,0.2,1);K.pS.push(sc);K.pn++;
 const hd=K.pH;tween(0.18,k=>hd.position.y=0.5-0.22*k,()=>tween(0.35,k=>hd.position.y=0.28+0.22*k));noise(0.22,0.06,900,1.2,0,300);tone(160,0.12,'sine',0.05,110);
 const k=K.pn/K.pN,g=K.m3&&K.m3.g;if(g){const f=0.14+0.86*k,fx=0.62+0.38*k;const s0=g.scale.clone(),s1=V(1.6*fx,1.6*f,1.6*fx);tween(0.3,q=>{g.scale.lerpVectors(s0,s1,q);g.updateMatrixWorld(true);K.top=new THREE.Box3().setFromObject(g).max.y+0.002;if(K.nozzle){K.nozzle.position.y=K.top+0.02;K.nozzle.position.x=BC.x+0.03}})}
 if(K.pG)K.pG.rotation.z=1.2-2.4*k;const gf=$('gf');if(gf)gf.style.width=(k*100)+'%';tipStep(`${sc>0.75?'Güzel ritim':sc>0.45?'Biraz daha düzenli':'Ritmi tut'} · ${K.pn}/${K.pN}`);
 if(K.pn>=K.pN){if(K.nozzle)K.nozzle.visible=false;if(K.hose)K.hose.visible=false;if(K.pDev)tween(0.3,q=>K.pDev.scale.setScalar(Math.max(0.001,1-q)),()=>{K.pDev.visible=false});K.hoseF=null;K.nozObj=null;K.defl=false;sfx.pick();stepDone(K.pS.reduce((a,b)=>a+b,0)/K.pS.length,'Top şişti!')}}
/* ---------- ürüne özel mekanikler ---------- */
function ellShape(rx,ry){const s=new THREE.Shape(),N=36;for(let i=0;i<=N;i++){const t=i/N*Math.PI*2;i?s.lineTo(Math.cos(t)*rx,Math.sin(t)*ry):s.moveTo(rx,0)}return s}
function grow3D(f0){K.is3d=true;const st=K.p.styles?(G.order.style||K.p.styles[0]):null,m=K.p.build(K.p.sheet,st,K);K.work.children.forEach(c=>c.visible=false);m.g.position.copy(BC);K.work.add(m.g);K.m3=m;
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
 const cutAt=p=>{toolAt(p,SAW?'sw':'kn',Y+th+0.002);if(!SAW&&tt-snd>0.16){snd=tt;sfx.cut()}let best=null,bd=9;lines.forEach(l=>{if(l.done)return;const d=Math.abs(p.x-l.x);if(d<bd){bd=d;best=l}});if(!best||Math.abs(p.z-BC.z)>L/2+0.03)return;K.dev+=Math.min(bd,0.08);K.devN++;
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
function bStir(){const pc=K.piece;if(pc&&pc.visible!==undefined)pc.visible=false;const bw=new THREE.Group();bw.position.copy(BC);const bm=M('#e8dcc8',0.6);
 const lt=new THREE.LatheGeometry([[0,0],[0.17,0.005],[0.24,0.06],[0.27,0.15],[0.26,0.155]].map(q=>new THREE.Vector2(q[0],q[1])),28);const b=put(bw,lt,bm,0,0,0);b.material.side=THREE.DoubleSide;
 const lm=M('#f6f0e4',0.5),liq=put(bw,Cy(0.245,0.24,0.01,28),lm,0,0.115,0);const sp=[];for(let i=0;i<14;i++){const a=Math.random()*6.28,r=0.04+Math.random()*0.17,d=put(bw,Cy(0.014,0.014,0.004,8),M(i%2?'#8a63b8':'#b49ad6'),Math.cos(a)*r,0.122,Math.sin(a)*r);d.userData={a,r};sp.push(d)}
 K.work.add(bw);bw.scale.setScalar(0.01);tween(0.3,k=>bw.scale.setScalar(Math.max(0.01,k)));K.hy=Y+0.12;let tot=0,la=null,good=0,all=0,snd=0;const c0=new THREE.Color('#f6f0e4'),c1=new THREE.Color(K.p.sheet);
 const mv=p=>{const r=Math.hypot(p.x-BC.x,p.z-BC.z);toolAt(V(p.x,0,p.z),'cl',Y+0.13);all++;if(r>0.3){la=null;return}good+=r>0.06&&r<0.24?1:0.5;const a=angAt(p);if(la!=null){const d=wrapA(a-la);if(Math.abs(d)<0.8){tot+=Math.abs(d);sp.forEach(s=>{s.userData.a+=d*0.7;s.position.x=Math.cos(s.userData.a)*s.userData.r;s.position.z=Math.sin(s.userData.a)*s.userData.r})}}la=a;
  const pr=Math.min(1,tot/(3*Math.PI*2));lm.color.copy(c0).lerp(c1,pr);sp.forEach(s=>s.scale.setScalar(Math.max(0.05,1-pr)));if(tot-snd>0.5){snd=tot;noise(0.12,0.03,700,1.4,0,200)}tipStep(`Karıştır · %${Math.round(pr*100)}`);if(pr>=1)end()};
 const end=()=>{const s=all?clamp(good/all*1.1,0.3,1):0.6;tween(0.3,k=>bw.scale.setScalar(Math.max(0.01,1-k)),()=>{K.work.remove(bw);if(pc&&pc.visible!==undefined)pc.visible=true});fin(s,'Karışım hazır!')};
 K.pd=p=>{la=null;mv(p)};K.pm=mv;K.skipFn=()=>{K.work.remove(bw);if(pc&&pc.visible!==undefined)pc.visible=true};tipStep('Kasenin içinde daire çizerek karıştır')}

/* Sabun / mum: kalıba dökme */
function bPour(){const m=grow3D(0.02),bb=K.fullBB,sx=bb.max.x-bb.min.x+0.04,sz=bb.max.z-bb.min.z+0.04,sy=bb.max.y-Y+0.04,col=K.p.sheet;
 const mold=put(K.work,B(sx,sy,sz),new THREE.MeshStandardMaterial({color:'#cfe6ee',transparent:true,opacity:0.22,roughness:0.1,depthWrite:false}),BC.x,Y+sy/2,BC.z);mold.castShadow=false;
 const tgt=0.86,line=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(sx+0.004,0.001,sz+0.004)),new THREE.LineBasicMaterial({color:'#2f6b5a'}));line.position.set(BC.x,Y+(bb.max.y-Y)*tgt,BC.z);K.work.add(line);
 const pt=new THREE.Group();pt.position.set(BC.x+sx/2+0.13,Y+sy+0.16,BC.z);put(pt,Cy(0.07,0.06,0.18,14),M('#b9c2c8',0.3),0,0,0);const sp=put(pt,Cy(0.015,0.03,0.08,8),M('#b9c2c8',0.3),-0.075,0.07,0);sp.rotation.z=1.1;put(pt,new THREE.TorusGeometry(0.05,0.01,5,12,Math.PI),M('#8a9399'),0.07,0,0).rotation.z=-Math.PI/2;K.work.add(pt);
 const stm=put(K.work,Cy(0.009,0.012,1,8),M(col,0.4),0,0,0);stm.visible=false;stm.castShadow=false;
 const STM=!!K.st.steam;if(STM){pt.visible=false;mold.visible=false}let lv=0.02,pour=false,over=false;ui.act.innerHTML=`<div class="gauge"><div class="gz" style="left:80%;width:12%"></div><div class="gf" id="gf"></div></div>`;
 const b=btn(STM?'Basılı tut: buharla':'Basılı tut: dök','g');b.style.minWidth='60%';const st=on=>{pour=on;if(!on&&lv>=0.8&&!over)end()};b.onpointerdown=e=>{e.preventDefault();st(true)};b.onpointerup=b.onpointerleave=b.onpointercancel=()=>{if(pour)st(false)};b.oncontextmenu=e=>e.preventDefault();ui.act.appendChild(b);
 K.pd=()=>st(true);K.pu=()=>st(false);K.hy=Y;
 K.tick=dt=>{pt.rotation.z+=((pour?1.0:0)-pt.rotation.z)*Math.min(1,dt*8);const flow=pour&&pt.rotation.z>0.6;if(flow){lv+=dt*0.3;if(Math.random()<dt*10)noise(0.08,0.02,1200,0.8,0,500)}gF(Math.min(lv,1));
  stm.visible=flow&&!STM;if(flow&&STM&&Math.random()<dt*14){const a=Math.random()*6.28;puff(V(BC.x+Math.cos(a)*0.25,Y+0.02,BC.z+Math.sin(a)*0.25),1,'#f4f4f4')}if(flow){const sp0=V(pt.position.x-0.11,pt.position.y+0.03,BC.z),y1=K.top;stm.position.set(sp0.x,(sp0.y+y1)/2,sp0.z);stm.scale.y=Math.max(0.01,sp0.y-y1)}
  const gf=$('gf');if(gf)gf.style.width=Math.min(100,lv*100)+'%';tipStep(lv<0.8?(STM?'Buharla · %':'Çizgiye kadar dök · %')+Math.round(lv*100):lv<=0.92?'Şimdi bırak!':'Taşıyor!');
  if(lv>1.02&&!over){over=true;pour=false;puff(V(BC.x+sx/2,Y+0.02,BC.z),10,col);sfx.bad();end()}};
 const end=()=>{K.tick=null;const s=over?0.25:clamp(1-Math.abs(lv-tgt)/0.12,0.3,1);gF(1);tween(0.3,k=>{pt.position.y+=0.02;pt.scale.setScalar(Math.max(0.01,1-k));mold.material.opacity=0.22*(1-k)},()=>{K.work.remove(pt);K.work.remove(mold);K.work.remove(line);K.work.remove(stm)});fin(s,over?(STM?'Fazla buhar!':'Taştı!'):(STM?'Kalıba oturdu!':'Tam kıvamında!'))};
 K.skipFn=()=>{gF(1);[pt,mold,line,stm].forEach(o=>K.work.remove(o))}}

/* Boks: yün doldurma */
function bStuff(){if(!K.is3d)to3D(true);const BLW=K.st.t==='blow',n=K.st.n||8;let pp=null;K.pn=0;K.pL=-1;K.pS=[];const bk=new THREE.Group();bk.position.set(BC.x+0.42,Y,BC.z-0.12);const bl=put(bk,new THREE.CylinderGeometry(0.11,0.08,0.08,14,1,true),M('#8a6a3a',0.9),0,0.04,0);bl.material.side=THREE.DoubleSide;
 if(BLW){bk.clear();pp=new THREE.Group();const ra=-(Math.PI/2-0.42);put(pp,Cy(0.008,0.009,0.45,8),M('#5a5e64',0.3),0.2,0.09,0).rotation.z=ra;put(pp,Cy(0.016,0.016,0.08,8),M('#3a2a20'),0.4,0.18,0).rotation.z=ra;put(pp,Cy(0.012,0.016,0.02,8),M('#5a5e64',0.3),0,0.004,0);K.work.add(pp);{const w=fitM('m_pipe',{rx:-Math.PI/2,h:0.5});if(w){pp.children[0].visible=pp.children[1].visible=false;const t=new THREE.Group();t.rotation.z=ra;w.position.y=0.012;t.add(w);pp.add(t)}}K.tick=()=>{pp.position.set(BC.x,K.top-0.006,BC.z)}}else for(let i=0;i<7;i++)put(bk,new THREE.SphereGeometry(0.04,7,5),M('#f3eee4',1),(Math.random()-0.5)*0.12,0.08+Math.random()*0.03,(Math.random()-0.5)*0.12);K.work.add(bk);
 const yk=K.p.id==='yastik',b=btn(BLW?'Üfle!':yk?'Tüy it!':'Yün it!','g',tap);b.style.minWidth='60%';b.classList.add('beat');ui.act.innerHTML='<div class="gauge"><div class="gf" id="gf"></div></div>';ui.act.appendChild(b);tipStep('Saniyede bir dokun · 0/'+n);
 function tap(){if(G.step!==K.st.t)return;const now=tt,dt=K.pL<0?1:now-K.pL;if(dt<0.35){toast('Çok hızlı!',500);return}K.pL=now;const sc=clamp(1-Math.abs(dt-1)/0.9,0.2,1);K.pS.push(sc);K.pn++;const k=K.pn/n;
  if(BLW){noise(0.3,0.05,600,0.7,0,300);const g=K.m3&&K.m3.g;if(g){const s0=g.scale.clone(),f=0.14+0.86*k,fx=0.62+0.38*k,s1=V(1.6*fx,1.6*f,1.6*fx);tween(0.3,q=>{g.scale.lerpVectors(s0,s1,q);g.updateMatrixWorld(true);K.top=new THREE.Box3().setFromObject(g).max.y+0.002})}}else{const t=new THREE.Group();for(let i=0;i<3;i++)put(t,new THREE.SphereGeometry(0.03,6,5),M('#f3eee4',1),(i-1)*0.025,0,(i%2)*0.02);t.position.set(bk.position.x,Y+0.12,bk.position.z);K.work.add(t);const fr=t.position.clone(),to=V(BC.x,K.top,BC.z);
  tween(0.35,q=>{t.position.lerpVectors(fr,to,q);t.position.y+=Math.sin(q*Math.PI)*0.18;t.scale.setScalar(1-0.8*q)},()=>{K.work.remove(t);sfx.thud();const g=K.m3&&K.m3.g;if(g){const s0=g.scale.clone(),f=0.14+0.86*k,fx=0.62+0.38*k,s1=V(1.6*fx,1.6*f,1.6*fx);tween(0.25,q=>{g.scale.lerpVectors(s0,s1,q);g.updateMatrixWorld(true);K.top=new THREE.Box3().setFromObject(g).max.y+0.002})}})}
  const gf=$('gf');if(gf)gf.style.width=k*100+'%';tipStep(`${sc>0.75?'Güzel ritim':'Ritmi tut'} · ${K.pn}/${n}`);if(K.pn>=n){K.defl=false;setTimeout(()=>{K.work.remove(bk);if(pp)K.work.remove(pp);fin(K.pS.reduce((a,b)=>a+b,0)/K.pS.length,BLW?'Cam şişti!':yk?'Yastık kabardı!':'Eldiven doldu!')},450)}}
 K.skipFn=()=>{K.work.remove(bk);if(pp)K.work.remove(pp);const g=K.m3&&K.m3.g;if(g)g.scale.setScalar(1.6);K.defl=false}}

/* ---------- ürüne özel mekanikler 2 ---------- */
const LP=q=>{const v=V(BC.x+q[0],K.top,BC.z+q[1]);return K.is3d?onSurf(v):v};
function shapeBB(){const pts=K.p.shape().getPoints(40);let x0=9,x1=-9,y0=9,y1=-9;pts.forEach(p=>{x0=Math.min(x0,p.x);x1=Math.max(x1,p.x);y0=Math.min(y0,p.y);y1=Math.max(y1,p.y)});return {x0,x1,z0:-y1,z1:-y0,w:x1-x0,l:y1-y0}}
function mkTool(kind){const g=new THREE.Group(),dk=M('#2a2420',0.7),st=M('#c8ccd0',0.25);
 if(kind==='havya'){const h=put(g,Cy(0.016,0.018,0.14,10),M('#3a6a8a',0.6),0,0.13,0.05);h.rotation.x=0.5;const s=put(g,Cy(0.005,0.006,0.1,8),st,0,0.05,0.012);s.rotation.x=0.5;const t=put(g,new THREE.ConeGeometry(0.006,0.025,8),M('#b06a2a',0.4),0,0.008,0);t.rotation.x=Math.PI}
 else if(kind==='hammer'){const p=new THREE.Group();put(p,B(0.11,0.04,0.04),st,0,0,0);put(p,Cy(0.012,0.012,0.22,8),M('#7a4a2a'),0.07,0,0).rotation.z=Math.PI/2;p.children[1].position.x=0.13;g.add(p);g.userData.p=p;{const w=fitM('m_sledge',{w:0.3});if(w){p.children.forEach(c=>c.visible=false);w.rotation.y=Math.PI/2;w.position.set(0.15,-0.015,0);p.add(w)}}}
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
 const mk=new THREE.Mesh(new THREE.TorusGeometry(0.022,0.003,5,20),new THREE.MeshBasicMaterial({color:'#ffd23a'}));mk.rotation.x=Math.PI/2;K.work.add(mk);
 const ghost=P.map(v=>{const m=put(K.work,Cy(0.012,0.012,0.002,10),new THREE.MeshBasicMaterial({color:'#fff6d8',transparent:true,opacity:0.5}),v.x,v.y+0.001,v.z);m.castShadow=false;return m});
 let cur=null;const place=()=>{const v=P[i];mk.position.set(v.x,v.y+0.004,v.z);cur=st.kind==='dent'?put(K.work,Cy(0.014,0.014,0.002,10),new THREE.MeshBasicMaterial({color:'#000',transparent:true,opacity:0.18}),v.x,v.y+0.001,v.z):riv?put(K.work,Cy(0.013,0.016,0.012,10),M('#c9a23a',0.3),v.x,v.y+0.012,v.z):put(K.work,Cy(0.006,0.006,0.003,10),M('#1d1612'),v.x,v.y+0.001,v.z);tipStep(`${st.kind==='dent'?'Dövme':riv?'Perçin':'Zımba'} ${i+1}/${P.length} · ${hits} kez vur`)};place();
 K.tick=()=>{mk.scale.setScalar(1+Math.sin(tt*8)*0.15)};
 K.pd=p=>{const v=P[i],d=Math.hypot(p.x-v.x,p.z-v.z);hm.visible=true;hm.position.set(v.x,v.y+0.05,v.z);hm.userData.p.rotation.z=-0.9;tween(0.12,k=>hm.userData.p.rotation.z=-0.9+0.9*k,()=>tween(0.15,k=>hm.userData.p.rotation.z=-0.5*k,()=>hm.visible=false));
  if(d>0.07){miss++;sfx.bad();toast('Iskaladın',400);return}sfx.punch();puff(v,3,'#c9a37a');sc.push(clamp(1-d/0.07,0.3,1));h++;
  if(st.kind==='dent'){}else if(riv){cur.position.y=v.y+0.012-0.008*h/hits;cur.scale.set(1+0.25*h/hits,1,1+0.25*h/hits)}else cur.scale.set(1+h*0.6,1,1+h*0.6);
  if(h>=hits){h=0;ghost[i].visible=false;i++;if(i>=P.length){K.work.remove(mk);fin(clamp(avg(sc)-miss*0.05,0.2,1),st.kind==='dent'?'İyi dövüldü!':riv?'Perçinler sağlam!':'Delikler açıldı!');return}place()}};
 K.skipFn=()=>{K.work.remove(mk);ghost.forEach(g=>K.work.remove(g))}}

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
 K.pu=()=>{la=null;toolUp()};K.skipFn=()=>{draw(Math.PI*2);moveCam(VIEWS.bench,0.5)};tipStep('Parmağınla plakanın etrafında daire çizerek kıvır')}
function bScrew(){const st=K.st,P=st.pts.map(LP),N=st.turns||2;let i=0,acc=0,la=null,t0=tt,tk=0;const sd=new THREE.Group();K.work.add(sd);sd.visible=false;
 {const w=fitM('m_screw',{rz:Math.PI/2,h:0.24});if(w)sd.add(w);else{put(sd,Cy(0.004,0.004,0.1,6),M('#c8ccd0',0.25),0,0.05,0);put(sd,Cy(0.016,0.014,0.1,10),M('#c0392b',0.5),0,0.15,0)}}
 const sc=P.map(v=>{const g=new THREE.Group();g.position.copy(v);put(g,Cy(0.011,0.011,0.004,12),M('#b8bcc0',0.3),0,0.02,0);put(g,B(0.017,0.002,0.003),M('#333'),0,0.0225,0);put(g,Cy(0.004,0.003,0.02,6),M('#a0a4a8',0.3),0,0.008,0);g.visible=false;K.work.add(g);return g});
 const mk=new THREE.Mesh(new THREE.TorusGeometry(0.02,0.003,5,20),new THREE.MeshBasicMaterial({color:'#ffd23a'}));mk.rotation.x=Math.PI/2;K.work.add(mk);
 const show=()=>{sc[i].visible=true;const v=P[i];mk.position.set(v.x,v.y+0.003,v.z);acc=0;tipStep(`Vida ${i+1}/${P.length} · vidanın etrafında daire çiz`)};show();
 K.tick=()=>{mk.scale.setScalar(1+Math.sin(tt*8)*0.15)};
 K.pd=p=>{const v=P[i];la=Math.atan2(p.z-v.z,p.x-v.x);sd.visible=true;sd.position.set(v.x,sc[i].position.y+0.022,v.z)};
 K.pm=p=>{if(la==null)return;const v=P[i];if(Math.hypot(p.x-v.x,p.z-v.z)>0.2)return;const a=Math.atan2(p.z-v.z,p.x-v.x);let d=a-la;d=Math.atan2(Math.sin(d),Math.cos(d));la=a;acc+=Math.abs(d);const k=Math.min(1,acc/(N*Math.PI*2));
  sc[i].position.y=v.y-0.016*k;sc[i].rotation.y+=d;sd.rotation.y+=d;sd.position.y=sc[i].position.y+0.022;if(acc-tk>0.6){tk=acc;noise(0.03,0.04,2200,0.35,0,900)}
  if(k>=1){sfx.punch();tk=0;la=null;sd.visible=false;i++;if(i>=P.length){K.tick=null;hookClear();K.work.remove(mk);K.work.remove(sd);fin(clamp(1.3-(tt-t0)/(P.length*4),0.4,1),'Vidalar sıkıldı!');return}show()}};
 K.pu=()=>{la=null;sd.visible=false};K.skipFn=()=>{K.work.remove(mk);K.work.remove(sd);sc.forEach(g=>{g.visible=true})}}
function bSplit(){const pts=(K.p.steps.find(x=>x.t==='drill')||{pts:[[-0.15,0],[-0.075,0],[0,0],[0.075,0],[0.15,0]]}).pts;if(K.piece&&K.piece.visible!==undefined)K.piece.visible=false;const col=K.p.sheet,top=Y+0.03;K.hy=top;
 const g=new THREE.Group();K.work.add(g);const W=pts.length>1?Math.abs(pts[1][0]-pts[0][0]):0.075,pc=pts.map(q=>{const m=put(g,B(W,0.04,0.04),M(col,0.6),BC.x+q[0],top,BC.z+q[1]);return m});
 const L=[];for(let i=0;i<pts.length-1;i++){const x=BC.x+(pts[i][0]+pts[i+1][0])/2,mk=put(g,B(0.004,0.002,0.07),new THREE.MeshBasicMaterial({color:'#fff8e0'}),x,top+0.022,BC.z);L.push({x,mk,cut:false,i})}
 let lp=null,t0=tt,miss=0;const cut=l=>{l.cut=true;l.mk.visible=false;sfx.pick();noise(0.12,0.05,1800,0.5,0,600);puff(V(l.x,top+0.02,BC.z),3,'#e8d8b8');
  pc.forEach((m,j)=>{const d=j<=l.i?-1:1,x0=m.position.x;tween(0.2,q=>m.position.x=x0+d*0.006*q)});const left=L.filter(x=>!x.cut).length;tipStep(`Parça ${L.length-left+1}/${pts.length}`);
  if(!left){hookClear();pc.forEach(m=>{const s0=m.scale.x,t=0.04/W;tween(0.3,q=>m.scale.x=s0+(t-s0)*q)});setTimeout(()=>{if(K.dead)return;K.work.remove(g);fin(clamp(1.25-(tt-t0)/(L.length*3)-miss*0.05,0.4,1),'Kare parçalar hazır!')},450)}};
 K.pd=p=>{lp={x:p.x,z:p.z}};K.pm=p=>{if(!lp)return;L.forEach(l=>{if(!l.cut&&(lp.z-BC.z)*(p.z-BC.z)<=0&&lp.z!==p.z&&Math.abs((lp.x+p.x)/2-l.x)<0.03)cut(l)});lp={x:p.x,z:p.z}};K.pu=()=>{lp=null};
 K.skipFn=()=>K.work.remove(g);tipStep('Beyaz çizgiler boyunca yukarıdan aşağı kes · Parça 1/'+pts.length)}
function bGrind(){const pts=(K.p.steps.find(x=>x.t==='drill')||{pts:[[-0.15,0],[-0.075,0],[0,0],[0.075,0],[0.15,0]]}).pts;if(K.piece&&K.piece.visible!==undefined)K.piece.visible=false;const col=K.p.sheet,top=Y+0.03;K.hy=top;
 const gr=new THREE.Group();gr.position.set(BC.x+0.36,Y,BC.z-0.18);put(gr,B(0.16,0.1,0.12),M('#3a6a8a',0.5),0,0.05,0);const wh=new THREE.Group();wh.position.set(-0.09,0.1,0);gr.add(wh);const wd=put(wh,Cy(0.08,0.08,0.03,20),M('#8a8478',0.9),0,0,0);wd.rotation.z=Math.PI/2;put(wh,B(0.032,0.012,0.16),M('#6a645a'),0,0,0);K.work.add(gr);{const w=fitM('m_fan',{h:0.3});if(w){gr.children.forEach(c=>c.visible=false);w.rotation.y=-Math.PI/2;w.position.set(-0.015,0,0);gr.add(w);const sd=put(gr,Cy(0.052,0.052,0.006,24),M('#b8a27a',0.95),-0.075,0.185,0);sd.rotation.z=Math.PI/2;wh.visible=true;wh.children.forEach(c=>c.visible=false);wh.position.set(-0.078,0.185,0);wh.add(sd);sd.position.set(0,0,0)}}
 const cp=()=>V(gr.position.x-0.09-0.02,top+0.03,gr.position.z);
 const beads=pts.map(q=>{const home=V(BC.x+q[0],top,BC.z+q[1]),m=put(K.work,B(0.04,0.04,0.04),M(col,0.6),home.x,home.y,home.z);m.rotation.y=Math.random();return {m,home,p:0,done:false}});let cur=null,lt=0,t0=tt,spk=0;
 K.tick=dt=>{wh.rotation.x+=dt*30};
 K.pd=p=>{let b=null,bd=0.08;beads.forEach(x=>{if(x.done)return;const d=Math.hypot(x.m.position.x-p.x,x.m.position.z-p.z);if(d<bd){bd=d;b=x}});cur=b;lt=performance.now();if(b)sfx.pick()};
 K.pm=p=>{if(!cur)return;cur.m.position.set(p.x,top+0.03,p.z);const c=cp(),d=Math.hypot(p.x-c.x,p.z-c.z),now=performance.now(),dt=Math.min(0.1,(now-lt)/1000);lt=now;
  if(d<0.08){cur.p+=dt/1.2;cur.m.rotation.x+=0.4;cur.m.rotation.z+=0.3;if(tt-spk>0.06){spk=tt;puff(V(c.x,c.y,c.z),2,'#ffb030');noise(0.06,0.03,2600,0.6,0,900)}const k=Math.min(1,cur.p);if(k>=1){const b=cur;cur=null;b.done=true;const mp=b.m.position.clone();K.work.remove(b.m);b.m=put(K.work,new THREE.SphereGeometry(0.024,12,9),M(col,0.35),mp.x,mp.y,mp.z);const h=b.home;tween(0.35,q=>b.m.position.lerpVectors(mp,h,q));sfx.good();const left=beads.filter(x=>!x.done).length;tipStep(`Boncuk ${beads.length-left}/${beads.length}`);if(!left){K.tick=null;tween(0.3,q=>gr.scale.setScalar(Math.max(0.01,1-q)),()=>K.work.remove(gr));fin(clamp(1.3-(tt-t0)/(beads.length*4),0.4,1),'Boncuklar yuvarlandı!')}}else{const s=1-0.3*k;cur.m.scale.setScalar(s)}}};
 K.pu=()=>{if(cur){const b=cur,mp=b.m.position.clone();tween(0.25,q=>b.m.position.lerpVectors(mp,b.home,q));cur=null}};
 K.skipFn=()=>{K.work.remove(gr);beads.forEach(b=>{if(!b.done){K.work.remove(b.m);b.m=put(K.work,new THREE.SphereGeometry(0.024,12,9),M(col,0.35),b.home.x,b.home.y,b.home.z)}})};tipStep('Boncuğu tutup dönen zımparaya bastır')}
/* Pürmüz aleti */
let TCH=null;function torchAt(p){if(!TCH||TCH.parent!==K.work){TCH=new THREE.Group();const st=M('#c8ccd0',0.25),bp=V(BC.x+0.42,Y,BC.z-0.14);
 const TB=new THREE.Group();TB.position.copy(bp);TCH.add(TB);{const w=fitM('m_torch',{rz:Math.PI/2,h:0.3});if(w){TB.add(w);TB.userData.h=0.3}else{put(TB,Cy(0.05,0.05,0.2,12),M('#c0392b',0.4),0,0.1,0);put(TB,Cy(0.012,0.012,0.04,8),st,0,0.22,0);TB.userData.h=0.24}}put(TB,Cy(0.07,0.08,0.015,16),M('#3a3a3a',0.6),0,0.007,0);
 const TH=new THREE.Group(),hi=new THREE.Group();hi.rotation.x=0.55;TH.add(hi);TCH.add(TH);put(hi,Cy(0.007,0.009,0.1,8),st,0,0.06,0);put(hi,Cy(0.016,0.016,0.06,10),M('#2a2a2a',0.6),0,0.13,0);
 const f=put(hi,new THREE.ConeGeometry(0.018,0.07,8),new THREE.MeshBasicMaterial({color:'#5ab0ff',transparent:true,opacity:0.85}),0,0.0,0);f.rotation.x=Math.PI;const f2=put(hi,new THREE.ConeGeometry(0.01,0.04,6),new THREE.MeshBasicMaterial({color:'#ffd27a'}),0,-0.005,0);f2.rotation.x=Math.PI;
 const hose=new THREE.Mesh(new THREE.BufferGeometry(),M('#1e1e1e',0.7));TCH.add(hose);TCH.userData={f,f2,TB,TH,hi,hose,bp};K.work.add(TCH)}
 const U=TCH.userData,bp=U.bp,rest=!p;if(rest)p={x:bp.x-0.12,z:bp.z+0.06,y:Y+0.02};U.f.visible=U.f2.visible=!rest;
 TCH.visible=true;const py=(p.y||K.top)+0.035;U.TH.position.set(p.x,py,p.z);U.TH.rotation.y=Math.atan2(bp.x-p.x,bp.z-p.z);U.f.scale.y=0.8+Math.random()*0.5;
 U.TH.updateMatrixWorld(true);const e=U.hi.localToWorld(V(0,0.16,0)),a=V(bp.x,bp.y+U.TB.userData.h,bp.z),c=a.clone().add(e).multiplyScalar(0.5);c.y=Math.max(a.y,e.y)+0.1;
 U.hose.geometry.dispose();U.hose.geometry=new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a,c,e),20,0.008,6,false);if(rest)return;
 if(Math.random()<0.5)puff(V(p.x,(p.y||K.top)+0.01,p.z),1,Math.random()<0.5?'#ff8a30':'#ffd27a');if(Math.random()<0.3)noise(0.08,0.02,900,0.4,0,300);
 const m=K.piece&&K.piece.material;if(m&&m.emissive){const cv=K.cells?K.rubN/K.cells.length:0;m.emissive.set('#ff4a10');m.emissiveIntensity=0.15+cv*0.55}}

/* At nalı: bükme */
function bBend(){if(K.piece&&K.piece.visible!==undefined)K.piece.visible=false;const L=0.5,AM=1.35*Math.PI,y=Y+0.02,mat=M('#8a8e94',0.35);mat.emissive=new THREE.Color('#ff4a10');mat.emissiveIntensity=0.45;let b=0,mesh=null,la=null,tot=0;
 const build=()=>{const A=Math.max(0.001,b*AM),R=L/A,pts=[];for(let i=0;i<=24;i++){const f=i/24;if(b<0.01)pts.push(V(BC.x+(f-0.5)*L,y,BC.z));else{const t=(f-0.5)*A;pts.push(V(BC.x+R*Math.sin(t),y,BC.z-R*Math.cos(t)+R*0.35))}}const g=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),40,0.018,8,false);if(mesh){mesh.geometry.dispose();mesh.geometry=g}else{mesh=new THREE.Mesh(g,mat);mesh.castShadow=true;K.work.add(mesh)}};build();
 const ring=dashRing(0.16,Y+0.004,26);K.hy=Y;
 const mv=p=>{toolAt(V(p.x,0,p.z),'cl',Y+0.05);const a=angAt(p);if(la!=null){const d=Math.abs(wrapA(a-la));if(d<0.8)tot+=d}la=a;b=Math.min(1,tot/(Math.PI*1.6));build();if(Math.random()<0.25)sfx.thud&&noise(0.05,0.02,500,0.5,0,200);tipStep(`Bük · %${Math.round(b*100)}`);if(b>=1)end()};
 const end=()=>{K.work.remove(ring);tween(1,q=>mat.emissiveIntensity=0.45*(1-q));sfx.punch();fin(1,'Nal büküldü!')};
 K.pd=p=>{la=null;mv(p)};K.pm=mv;K.skipFn=()=>{b=1;build();K.work.remove(ring)};tipStep('Çubuğun etrafında daire çizerek bük')}
/* Nazar: cam katmanları */
function bLayer(){const L=[{r:0.112,c:'#ffffff',ad:'Beyaz'},{r:0.072,c:'#7fc8f0',ad:'Açık mavi'},{r:0.036,c:'#151313',ad:'Siyah'}];let i=0,cur=null,off=null,sc=[];const top=K.top;K.hy=top+0.02;
 const D=L.map((l,k)=>{const m=put(K.work,Cy(l.r,l.r,0.008,24),M(l.c,0.15),BC.x+0.42,top+0.01,BC.z-0.18+k*0.17);m.userData.home=m.position.clone();return m});
 const ring=new THREE.Mesh(new THREE.TorusGeometry(L[0].r,0.003,4,32),new THREE.MeshBasicMaterial({color:'#ffd23a'}));ring.rotation.x=Math.PI/2;ring.position.set(BC.x,top+0.006,BC.z);K.work.add(ring);
 const tip=()=>{if(i<L.length){ring.geometry.dispose();ring.geometry=new THREE.TorusGeometry(L[i].r,0.003,4,32);tipStep(`${L[i].ad} katmanı ${i+1}/${L.length} · ortaya sürükle`)}};tip();
 K.pd=p=>{const m=D[i];if(m&&Math.hypot(m.position.x-p.x,m.position.z-p.z)<0.14){cur=m;off=V(m.position.x-p.x,0,m.position.z-p.z);sfx.pick()}};
 K.pm=p=>{if(!cur)return;cur.position.set(p.x+off.x,top+0.03,p.z+off.z)};
 K.pu=()=>{if(!cur)return;const m=cur;cur=null;const d=Math.hypot(m.position.x-BC.x,m.position.z-BC.z);if(d<0.07){sc.push(clamp(1-d/0.07,0.3,1));const fr=m.position.clone(),to=V(BC.x,top+0.004+i*0.004,BC.z);tween(0.2,q=>m.position.lerpVectors(fr,to,q));sfx.drop();puff(to,4,L[i].c);i++;if(i>=L.length){K.work.remove(ring);fin(avg(sc),'Nazar katmanları tamam!')}else tip()}else{const fr=m.position.clone();tween(0.25,q=>m.position.lerpVectors(fr,m.userData.home,q));toast('Ortadaki halkaya bırak',700)}};
 K.skipFn=()=>{K.work.remove(ring);D.forEach((m,k)=>m.position.set(BC.x,top+0.004+k*0.004,BC.z))}}

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
function rubAt(p){if(K.rubT0<0)K.rubT0=tt;if(K.st.k==='torch')torchAt(p);else toolAt(p,({sekil:'cl',karistir:'cl',zimpara:'blk',incelt:'kn',oy:'kn'})[K.st.k]||'cl');sThr(({zimpara:sfx.sand,incelt:sfx.skive,oy:sfx.skive})[K.st.k]||sfx.wax,0.14);K.cells.forEach(c=>{if(!c.on&&Math.hypot(c.p.x-p.x,c.p.z-p.z)<0.05*eqMul(K.tool)){c.on=true;K.rubN++}});const cv=K.rubN/K.cells.length;tipStep('Tamamlandı: %'+Math.round(cv*100));if(cv>=0.92)eRub()}
function eRub(){if(G.step!=='rub')return;K.rubbing=false;const s=clamp(1.2-(tt-K.rubT0)/7,0.4,1),m=K.piece.material;
const rk=K.st.k;if(rk==='cila'){m.roughness=0.3;m.color.set(shade(K.p.sheet,-0.1));K.cila=true}else if(rk==='parlat')m.roughness=0.35;else if(rk==='zimpara')m.color.set(shade(K.p.sheet,0.1));else if(rk==='oy'||rk==='sekil')m.color.set(shade(K.p.sheet,-0.06));else if(rk==='karistir')m.color.set(shade(K.p.sheet,0.08));else if(rk==='torch'){if(TCH)TCH.visible=false;if(m.emissive){const e0=m.emissiveIntensity;tween(1.2,q=>m.emissiveIntensity=e0*(1-q))}m.color.set(shade(K.p.sheet,-0.04))}K.cells=null;stepDone(s,rk==='torch'?'Ateşte pişti!':null)}
function paintHex(){if(!K.color||!K.color.id)return K.p.sheet;if(K.painted)return K.color.hex;return '#'+new THREE.Color(K.p.sheet).lerp(new THREE.Color(K.color.hex),K.pn/K.pcN).getHexString()}
function mkPaint(){const bb=new THREE.Box3().setFromObject(K.model.g),cx=(bb.min.x+bb.max.x)/2,cz=(bb.min.z+bb.max.z)/2,rx=(bb.max.x-bb.min.x)/2,rz=(bb.max.z-bb.min.z)/2,c=[];
for(let x=-rx;x<=rx;x+=0.045)for(let z=-rz;z<=rz;z+=0.045)if((x/rx)**2+(z/rz)**2<=1)c.push({p:V(cx+x,Y+0.12,cz+z),on:false});K.pc=c;K.ptop=bb.max.y+0.005;TL.br.userData.tip.material.color.set(K.color.hex);K.pcN=c.length||1;K.pn=0}
function paintAt(p){sThr(sfx.brush,0.3);toolAt(p,'br',K.ptop);K.pc.forEach(c=>{if(!c.on&&Math.hypot(c.p.x-p.x,c.p.z-p.z)<0.085*eqMul('firca')){c.on=true;K.pn++}});const cv=K.pn/K.pcN;K.model.um.color.set(paintHex());K.model.um.roughness=0.45;tipStep('Boyandı: %'+Math.round(cv*100));
if(cv>=0.9){K.pc=null;K.painted=true;K.rubbing=false;sfx.good();build(false);renderDesign();tipStep('Boya tamam · Sürükleyip çevir, sonra Bitir')}}
function bDesign(){K.work.clear();K.painted=false;K.pc=null;K.pn=0;K.pcN=1;K.nat={hex:K.p.sheet,ad:'Doğal'};K.color=K.p.need.boya?null:K.nat;K.rx=K.ry=0;K.style=K.p.styles?(G.order.style||K.p.styles[0]):null;build(true);renderDesign()}
function build(pop){if(K.model)K.work.remove(K.model.g);K.model=K.p.build(paintHex(),K.style,K);K.model.g.position.copy(BC);K.model.g.scale.setScalar(1.6);K.work.add(K.model.g);{const b=new THREE.Box3().setFromObject(K.model.g),z=b.getSize(V(0,0,0));K.mR=Math.max(z.x,z.z)/2;K.mH=z.y}applySpin();
if(pop){const g=K.model.g;g.scale.set(1.6,0.08,1.6);tween(0.45,k=>g.scale.set(1.6,0.08+1.52*k,1.6))}}
function applySpin(){if(!K||!K.model)return;const g=K.model.g;g.rotation.set(K.rx||0,K.ry||0,0);g.position.y=BC.y+(K.mR||0.2)*Math.abs(Math.sin(K.rx||0))+(K.mH||0)*(1-Math.cos(K.rx||0))*0.5+0.01}
function renderDesign(){const L=[];if(K.p.wood)L.push(btn('Doğal','l'+(K.color===K.nat?' sel':''),()=>{K.color=K.nat;K.pc=null;K.painted=false;build(false);renderDesign()}));
if(K.p.need.boya||K.p.wood)PAINTS.filter(p=>G.inv['boya_'+p.id]>0).forEach(p=>{const b=btn('','col'+(K.color===p?' sel':''),()=>{if(K.color===p)return;K.color=p;K.painted=false;K.pn=0;K.pcN=1;K.rx=K.ry=0;sfx.drop();build(false);mkPaint();renderDesign();tipStep('Parmağınla boyayı ürüne sür')});b.style.background=p.hex;b.setAttribute('aria-label',p.ad);L.push(b)});
if(K.p.styles)K.p.styles.forEach(st=>L.push(btn(st,'l'+(K.style===st?' sel':''),()=>{K.style=st;build(false);renderDesign()})));
L.push(btn('Bitir','g',finish,!K.color||(!!K.color.id&&!K.painted)));actions(L);tipStep((G.order.free?'Serbest tasarım':G.order.color||G.order.style?`Sipariş: ${[G.order.color&&G.order.color.ad,G.order.style].filter(Boolean).join(' · ')}`:K.p.wood?'İster boya, ister doğal bırak':'Tasarım')+' · Çevirmek için sürükle')}
const avg=a=>a.reduce((x,y)=>x+y,0)/a.length;
function finish(){if(!K.color||(K.color.id&&!K.painted))return;const o=G.order;if(K.color.id)G.inv['boya_'+K.color.id]--;K.rx=K.ry=0;applySpin();G.step=null;actions([]);tip(null);
if(o.free){const work=avg(K.scores),stars=clamp(Math.round(work*5)-(K.skips?1:0),1,5),it={id:++G.sid,pid:K.p.id,col:K.color.id||null,style:K.style,stars};it.price=sugg(it);K.res={item:it};
Q.forEach(x=>x.g.visible=true);const g=K.model.g,fr=g.position.clone();view='home';moveCam(VIEWS.home,1.1,()=>{sway=1;showFree()});tween(1.1,k=>{g.position.lerpVectors(fr,V(2.3,1.6,-1.0),k);g.scale.setScalar(1.6-0.8*k)});return}
const work=avg(K.scores),colorOk=!o.color||K.color.id===o.color.id,styleOk=!o.style||K.style===o.style,late=K.late,B0=o.budget,L=[];let pay=B0;
const cut=(t,f)=>{const v=Math.round(B0*f);if(v>0){L.push([t,-v]);pay-=v}};
if(work<0.85)cut('İşçilik kusuru',(0.85-work)*0.6);if(K.skips)cut(`Eksik adım ×${K.skips}`,0.12*K.skips);if(!colorOk)cut('Yanlış renk',0.3);if(!styleOk)cut('Yanlış model',0.2);if(late)cut('Geç teslim',0.25);
const stars=clamp(Math.round((0.7*work+0.3*((colorOk?0.6:0)+(styleOk?0.4:0)))*5)-(late?1:0)-(K.skips?1:0),1,5);
if(o.hurry&&!late){const v=Math.round(B0*0.2);L.push(['Acele bonusu',v]);pay+=v}if(stars===5){L.push(['Bahşiş',15]);pay+=15}
pay=Math.max(Math.round(B0*0.15),pay);K.res={stars,pay,L,colorOk,styleOk,late};
Q.forEach(x=>x.g.visible=true);const g=K.model.g,fr=g.position.clone();view='home';moveCam(VIEWS.home,1.1,()=>{sway=1;showResult()});tween(1.1,k=>{g.position.lerpVectors(fr,V(0.25,Y,1.35),k);g.scale.setScalar(1.6-0.6*k)})}
function showFree(){G.phase='result';refresh();const it=K.res.item,pct=v=>'%'+Math.round(v*100);sfx.good();
openSheet('result',`<h3>${pr(it).ad} vitrine kondu</h3><div class="stars">${'★'.repeat(it.stars)}<i>${'★'.repeat(5-it.stars)}</i></div><div style="margin-top:8px">`+K.names.map((n,i)=>`<div class="brk"><span>${n}</span><b>${pct(K.scores[i])}</b></div>`).join('')+
`</div><div class="tot">Vitrin fiyatı: ${it.price} altın</div><p>Fiyatı Vitrin'de ürüne dokunarak değiştirebilirsin.</p><div style="text-align:center"><button class="btn g" id="freeOk">Tamam</button></div>`);$('freeOk').onclick=freeDone}
function freeDone(){show(ui.modal,false);modalMode=null;const it=K.res.item,w=K.work,g=K.model.g;if(G.stock.length<vitCap())G.stock.push(it);else{G.store=G.store||[];G.store.push(it);storeSync();setTimeout(()=>toast('Vitrin dolu, ürün depo rafına kondu',1800),600)}
cupRec(it.pid,it.stars);if(it.stars>=3){const e=G.cat[it.pid]||(G.cat[it.pid]={n:0,best:0});e.n++;e.best=Math.max(e.best,it.stars)}
tween(0.3,k=>g.scale.setScalar(Math.max(0.01,0.8*(1-k))),()=>craft.remove(w));G.phase='idle';G.order=null;vitrinSync();levelUp();save();refresh();if(Q[0]&&Q[0].at)present(Q[0])}
function showResult(){G.phase='result';refresh();const r=K.res,o=G.order;G.bubOn=true;if(r.stars>=4){sfx.good();anim(Q[0],'clap',true)}else sfx.bad();
say(r.late?'Çok geç kaldınız ama...':r.stars>=5?'Muhteşem olmuş, elinize sağlık!':r.stars>=4?'Çok güzel, teşekkürler!':!r.colorOk?'Bu renk istediğim değildi!':!r.styleOk?'Ben başka bir model istemiştim...':K.skips?'Bu yarım kalmış gibi...':r.stars>=3?'Fena değil.':'Hmm, biraz özensiz...');
const pct=v=>'%'+Math.round(v*100);
let h=`<h3>${o.p.ad} hazır</h3><div class="stars">${'★'.repeat(r.stars)}<i>${'★'.repeat(5-r.stars)}</i></div><div style="margin-top:8px">`+K.names.map((n,i)=>`<div class="brk"><span>${n}</span><b>${pct(K.scores[i])}</b></div>`).join('')+
`<div class="brk" style="margin-top:6px"><span>Anlaşılan fiyat</span><b>${o.budget}</b></div>`+r.L.map(l=>`<div class="brk"><span>${l[0]}</span><b class="${l[1]<0?'cutc':'bonc'}">${l[1]>0?'+':'−'}${Math.abs(l[1])}</b></div>`).join('')+
`</div><div class="tot">Ödeme: ${r.pay} altın</div><div style="text-align:center"><button class="btn g" id="deliver">Teslim et</button></div>`;
openSheet('result',h);$('deliver').onclick=deliver}
function deliver(){show(ui.modal,false);modalMode=null;const r=K.res,c=Q[0],pid=G.order.p.id,ord=G.order;cupRec(pid,r.stars);G.reg=G.reg||[];if(ord.reg){const rg=G.reg.find(x=>x.ad===ord.reg);if(rg)rg.vis++;if(r.stars>=4){const tip=Math.round(r.pay*0.15);G.gold+=tip;setTimeout(()=>toast(`${ord.reg} bahşiş bıraktı: +${tip}`,1600),1400)}}else if(r.stars>=5&&G.reg.length<8&&Math.random()<0.5){const nm=RNAMES.filter(n=>!G.reg.some(x=>x.ad===n));if(nm.length){const ad=pick(nm);G.reg.push({ad,fav:pid,vis:1});setTimeout(()=>toast(`${ad} müdavimin oldu!`,1800),1500)}}G.gold+=r.pay;G.st.earned+=r.pay;sfx.cash();G.st.deliv++;if(r.stars===5)G.st.five++;G.rep=Math.max(0,G.rep+(r.stars>=3?r.stars:-1));
if(r.stars>=3){const e=G.cat[pid]||(G.cat[pid]={n:0,best:0});e.n++;e.best=Math.max(e.best,r.stars)}
if(G.first){G.first=false;spawnT=5}G.phase='leaving';G.order=null;G.n++;
levelUp();
refresh();actions([]);const g=K.model.g,w=K.work;tween(0.4,k=>g.scale.setScalar(Math.max(0.01,1-k)),()=>craft.remove(w));toast('+'+r.pay+' altın',1200);sfx.coin();if(r.stars===5)sfx.fan();save();
setTimeout(()=>{G.bubOn=false;say(null);leave(c)},1300)}

/* ---------- dokunma ---------- */
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2(),hv=V(0,0,0);
function setRay(e){const r=canvas.getBoundingClientRect();ndc.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);ray.setFromCamera(ndc,cam)}
function hit(e,h){setRay(e);return ray.ray.intersectPlane(new THREE.Plane(V(0,1,0),-h),hv)?hv.clone():null}
function hitW(e){if(K&&K.is3d&&K.m3){setRay(e);const h=ray.intersectObject(K.m3.g,true)[0];if(h)return h.point.clone()}return hit(e,K.top)}
let dragging=null,drawing=false,tap=null,pinch=null;const RZ={z:1,t:1},V2T=new THREE.Vector2(),DP=new Map();
const PT=new Map(),ZM={z:1,t:1,px:0,pz:0};
const zoomable=()=>view==='bahce'||view==='islik'||view==='pazar'||view==='depo';
function clampPan(){const r=0.3+(ZM.t-1)*2.4;ZM.px=clamp(ZM.px,-r,r);ZM.pz=clamp(ZM.pz,-r*1.3,r*1.3)}
function setZoom(t){ZM.t=clamp(t,1,2.5);clampPan()}
$('zi').onclick=()=>setZoom(ZM.t*1.35);$('zo').onclick=()=>setZoom(ZM.t/1.35);
canvas.addEventListener('wheel',e=>{if(G.phase==='result'){RZ.t=clamp(RZ.t*(e.deltaY<0?1.12:0.89),0.7,3.2);return}if(zoomable()){e.preventDefault();setZoom(ZM.t*(e.deltaY<0?1.12:0.89))}},{passive:false});
function floatTxt(cx,cy,html){const r=frame.getBoundingClientRect(),d=document.createElement('div');d.className='flt';d.innerHTML=html;d.style.left=(cx-r.left)+'px';d.style.top=(cy-r.top)+'px';$('ui').appendChild(d);setTimeout(()=>d.remove(),900)}
function stationTap(s){if(G.phase==='craft'||G.phase==='result'||switching)return;if(!stOwned(s)){buyStation(s);return}
if(s.ready&&G.tier>=s.tier){if(depoFull(Object.values(s.ready).reduce((a,b)=>a+b,0)))return;giveAll(s.ready);G.st.proc++;sfx.pick();toast('+ '+Object.entries(s.ready).map(([k,n])=>n+' '+MATS[k].ad).join(', '),1400);s.ready=null;refresh()}else openStation(s)}
function worldTap(e){if(SPL)return;setRay(e);
if(view==='islik'){const h=ray.intersectObjects(ST.map(s=>s.g),true)[0];if(h){let o=h.object;while(o&&!o.userData.st)o=o.parent;if(o)stationTap(o.userData.st)}}
else if(view==='pazar'){const h=ray.intersectObjects(STALLS,true)[0];if(h){let o=h.object;while(o&&!o.userData.tab)o=o.parent;if(o)marketTab(o.userData.tab)}}
else if(view==='depo'){depoTap()}
else if(view==='vitrin'){const h=ray.intersectObjects(VIT.children,true)[0];if(h){let o=h.object;while(o&&o.userData.sid==null)o=o.parent;if(o){const it=G.stock.find(x=>x.id===o.userData.sid);if(it)openItem(it)}}}
else if(view==='bahce'){const pt=PETS[0]&&PETS[0].visible&&ray.intersectObjects(PETS,true)[0];if(pt){petTap(e);return}const h=ray.intersectObjects(COLL.filter(o=>o.userData.coll.alive),true)[0];if(!h){const q=ray.intersectObjects(PL.map(o=>o.g),true)[0];if(q){let o=q.object;while(o&&!o.userData.plot)o=o.parent;if(o)plotTap(o.userData.plot)}return}let o=h.object;while(o&&!o.userData.coll)o=o.parent;
const c=o.userData.coll;if(depoFull(1))return;c.alive=false;c.t=NOW()+(RTM[c.mat]||c.rt||60);const yq=({yun:2,kum:3,kil:2,tas:2,sogut:2,koza:2,kutuk:2})[c.mat]||1;G.inv[c.mat]+=yq;if(c.mat==='yun')sfx.cut();G.st.coll++;sfx.pick();floatTxt(e.clientX,e.clientY,img(c.mat)+'+'+yq);const y0=o.position.y;
tween(0.3,k=>{o.scale.copy(c.base).multiplyScalar(Math.max(0.01,1-k));o.position.y=y0+k*0.35},()=>{o.visible=false;o.position.y=y0});refresh()}}
canvas.addEventListener('pointerdown',e=>{
if(G.phase==='craft'&&K){const st=G.step;
 if(K.pd){const p=hit(e,K.hy!=null?K.hy:K.top);K.pdn=true;if(p)K.pd(p,e);try{canvas.setPointerCapture(e.pointerId)}catch(_){}return}
 if((st==='drag'||st==='asm')&&K.drag){const p=hit(e,K.top);if(p&&Math.hypot(p.x-K.drag.obj.position.x,p.z-K.drag.obj.position.z)<0.3){dragging={dx:K.drag.obj.position.x-p.x,dz:K.drag.obj.position.z-p.z};canvas.setPointerCapture(e.pointerId)}}
 else if(st==='trace'&&K.path){const p=hit(e,K.top);if(p){drawing=true;K.strokes.push([]);cutPoint(p);canvas.setPointerCapture(e.pointerId)}}
 else if(st==='rhythm')rhythmTap();
 else if(st==='rub'&&K.cells){const p=hitW(e);if(p){K.rubbing=true;rubAt(p);canvas.setPointerCapture(e.pointerId)}}
 else if(st==='design'&&K.pc){const p=hit(e,Y+0.12);if(p){K.rubbing=true;paintAt(p);canvas.setPointerCapture(e.pointerId)}}
 else if(st==='design'&&K.model){DP.set(e.pointerId,{x:e.clientX,y:e.clientY});if(DP.size>=2){K.spin=null;const a=[...DP.values()];pinch={d:Math.max(20,Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)),z:RZ.t,dz:1}}else K.spin={x:e.clientX,y:e.clientY,ry:K.ry||0,rx:K.rx||0};canvas.setPointerCapture(e.pointerId)}
 return}
if(!(zoomable()||view==='vitrin'||G.phase==='result')||switching)return;
PT.set(e.pointerId,{x:e.clientX,y:e.clientY});try{canvas.setPointerCapture(e.pointerId)}catch(_){}
if(PT.size===1)tap={x:e.clientX,y:e.clientY,moved:false};
else if(PT.size===2){const a=[...PT.values()];pinch={d:Math.max(20,Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)),z:G.phase==='result'?RZ.t:ZM.t};if(tap)tap.moved=true}});
canvas.addEventListener('pointermove',e=>{if(DP.has(e.pointerId)){DP.set(e.pointerId,{x:e.clientX,y:e.clientY});if(DP.size>=2&&pinch&&pinch.dz){const a=[...DP.values()];RZ.t=clamp(pinch.z*Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)/pinch.d,0.7,3);return}}
if(PT.has(e.pointerId)){const p=PT.get(e.pointerId),dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
 if(PT.size===2&&pinch){const a=[...PT.values()],q=pinch.z*Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)/pinch.d;if(G.phase==='result')RZ.t=clamp(q,0.7,3.2);else setZoom(q)}
 else if(tap){if(!tap.moved&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)>8)tap.moved=true;
  if(tap.moved&&G.phase==='result'&&K&&K.model){K.model.g.rotation.y+=dx*0.012}
  if(tap.moved&&zoomable()){const w=VIEWS[view].p.distanceTo(VIEWS[view].l)*1.2/H/ZM.z;ZM.px-=dx*w;ZM.pz-=dy*w*1.35;clampPan()}}
 return}
if(!K)return;
if(K.pm&&K.pdn){const p=hit(e,K.hy!=null?K.hy:K.top);if(p)K.pm(p,e);return}
if(dragging&&(G.step==='drag'||G.step==='asm')&&K.drag){const p=hit(e,K.top);if(p){K.drag.obj.position.x=clamp(p.x+dragging.dx,-0.72,0.72);K.drag.obj.position.z=clamp(p.z+dragging.dz,1.2,2.12)}}
else if(drawing&&G.step==='trace'&&K.path){const p=hit(e,K.top);if(p){const st=K.strokes[K.strokes.length-1];if(!st){drawing=false;return}const l=st[st.length-1];if(!l||Math.hypot(l.x-p.x,l.z-p.z)>0.006)cutPoint(p)}}
else if(K.rubbing&&G.step==='rub'&&K.cells){const p=hitW(e);if(p)rubAt(p)}
else if(K.rubbing&&G.step==='design'&&K.pc){const p=hit(e,Y+0.12);if(p)paintAt(p)}
else if(K.spin&&G.step==='design'){K.ry=K.spin.ry+(e.clientX-K.spin.x)*0.012;K.rx=clamp(K.spin.rx+(e.clientY-K.spin.y)*0.008,-0.9,0.7);applySpin()}});
const up=e=>{if(DP.has(e.pointerId)){DP.delete(e.pointerId);if(DP.size<2&&pinch&&pinch.dz)pinch=null}toolUp();if(K)K.spin=null;if(K&&K.pdn){K.pdn=false;if(K.pu)K.pu(e)}if(PT.has(e.pointerId)){PT.delete(e.pointerId);if(PT.size<2)pinch=null;if(PT.size===0){if(tap&&!tap.moved&&e.type==='pointerup')worldTap(e);tap=null}return}
if(dragging&&G.step==='drag'&&K&&K.drag){dragging=null;eDrag()}else if(dragging&&G.step==='asm'&&K&&K.drag){dragging=null;asmDrop()}dragging=null;drawing=false;if(K)K.rubbing=false};
canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);

/* ---------- çizim katmanı ---------- */
const tmp=V(0,0,0);
function scr(v){tmp.copy(v).project(cam);return[(tmp.x+1)/2*W,(1-tmp.y)/2*H,tmp.z]}
function poly(pts,close){ctx.beginPath();pts.forEach((p,i)=>{const s=scr(p);i?ctx.lineTo(s[0],s[1]):ctx.moveTo(s[0],s[1])});if(close)ctx.closePath();ctx.stroke()}
function drawFx(){ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);if(G.phase!=='craft'||!K)return;ctx.lineCap='round';ctx.lineJoin='round';
if((G.step==='drag'||G.step==='asm')&&K.drag){ctx.setLineDash([8,7]);ctx.lineDashOffset=-tt*20;ctx.lineWidth=3;ctx.strokeStyle='#fff6d8';poly(K.drag.outline,true);ctx.setLineDash([])}
if(G.step==='trace'&&K.path){ctx.setLineDash([7,6]);ctx.lineWidth=2.5;ctx.strokeStyle='#fff6d8';poly(K.path,true);ctx.setLineDash([]);ctx.lineWidth=4;ctx.strokeStyle='#ffcf3a';K.strokes.forEach(s=>{if(s.length>1)poly(s)})}
if(G.step==='rhythm'&&K.dot&&K.dot.live){const s=scr(K.dot.m.position),sc=ringScale(K.dot.t);ctx.lineWidth=4;ctx.strokeStyle=Math.abs(sc-1)<0.3?'#9be37a':'#ffcf3a';
ctx.beginPath();ctx.arc(s[0],s[1],12*sc,0,Math.PI*2);ctx.stroke();ctx.lineWidth=1.5;ctx.strokeStyle='#fff6d8';ctx.beginPath();ctx.arc(s[0],s[1],12,0,Math.PI*2);ctx.stroke()}
if(G.step==='design'&&K.pc){ctx.fillStyle='rgba(255,250,235,.6)';K.pc.forEach(c=>{if(c.on)return;const s=scr(c.p);ctx.beginPath();ctx.arc(s[0],s[1],2.6,0,7);ctx.fill()})}
if(G.step==='rub'&&K.cells){const ci=K.st.k==='cila'||K.st.k==='parlat';ctx.fillStyle=ci?'rgba(255,250,235,.55)':'rgba(90,60,30,.55)';K.cells.forEach((c,i)=>{if(c.on)return;const s=scr(c.p);ctx.beginPath();ctx.arc(s[0]+(i%3-1)*2,s[1]+(i%2)*2,ci?3.5:2.5,0,Math.PI*2);ctx.fill()})}}
var SPL=false;let zOn=false,dOn=false,dV='';function drawLabels(){const zv=view==='bahce'&&!switching&&G.phase!=='craft';if(zv!==zOn){zOn=zv;$('zones').classList.toggle('hide',!zv)}const dv=(view==='depo'||view==='vitrin')&&!switching&&G.phase!=='craft'&&!SPL;if(dv!==dOn||(dv&&dV!==view)){dOn=dv;dV=view;$('dtabs').classList.toggle('hide',!dv);document.body.classList.toggle('dt',dv);document.querySelectorAll('#dtabs button').forEach(b=>b.classList.toggle('on',b.dataset.v===view))}for(const o of LBL){if(o.v!==view||switching||o.off||SPL){if(!o.hid){o.el.classList.add('hide');o.hid=true}continue}
const s=scr(o.pos);if(s[0]<-70||s[0]>R.domElement.clientWidth+70){if(!o.hid){o.el.classList.add('hide');o.hid=true}continue}if(o.hid){o.el.classList.remove('hide');o.hid=false}o.el.style.transform=`translate(${s[0].toFixed(1)}px,${s[1].toFixed(1)}px) translate(-50%,${o.below?'0':'-100%'})`}}
function stationLabels(){ST.forEach(s=>{const own=stOwned(s);if(s.m.visible!==own)s.m.visible=own;if(!own){const t=`🔒 ${s.ad}<small>${G.tier<s.tier?'Kademe '+s.tier:'Kur · '+STC[s.id]+' altın'}</small>`;if(t!==s.lbl.last){s.lbl.el.innerHTML=t;s.lbl.last=t;s.lbl.el.classList.add('lock');s.lbl.el.classList.remove('rdy');s.base.material.color.set('#3d2c20')}return}const lk=G.tier<s.tier,st=lk?0:s.ready?3:s.jobs.length?2:1,cap=s.lvl>1?` · ${s.jobs.length}/${s.lvl}`:'';
const t=lk?`${s.ad}<small>Kademe ${s.tier}</small>`:s.ready?`${s.ad}<small>Hazır! Topla${cap}</small>`:s.jobs.length?`${s.ad}<small>${fmtT(Math.min(...s.jobs.map(j=>j.end))-NOW())}${cap}</small>`:`${s.ad}<small>Boşta${cap}</small>`;
if(t!==s.lbl.last){s.lbl.el.innerHTML=t;s.lbl.last=t;s.lbl.el.classList.toggle('lock',lk);s.lbl.el.classList.toggle('rdy',st===3);s.base.material.color.set(['#3d2c20','#6e4a2c','#b8742a','#6fae4a'][st])}})}

/* ---------- döngü ---------- */
const clock=new THREE.Clock(),look=V(0,0,0);
let lastF=0,busy=true,shT=0;function loop(now){requestAnimationFrame(loop);now=(now||performance.now())/1000;if(!busy&&now-lastF<0.031)return;lastF=now;const dt=Math.min(clock.getDelta(),0.07);tt+=dt;if(K&&K.hoseF)K.hoseF();if(K&&K.tick)K.tick(dt);if(frame.clientWidth!==W||frame.clientHeight!==H)resize();
for(let i=tweens.length-1;i>=0;i--){const w=tweens[i];w.t+=dt;const k=Math.min(1,w.t/w.dur);w.fn(ease(k));if(k>=1){tweens.splice(i,1);w.done&&w.done()}}
if(K&&G.step==='rhythm'&&K.dot&&K.dot.live){K.dot.t+=dt;if(ringScale(K.dot.t)<0.45){K.dot.live=false;K.rs.push(0);dotDone(K.dot,0)}}
if(K&&G.step==='hold'&&K.holding){K.hv+=dt*60;const f=$('gf');if(f)f.style.width=Math.min(100,K.hv)+'%';pressPos(K.hv);if(K.hv>=100)eHold()}
if(G.started&&!G.night&&!document.hidden)G.tm+=dt*1.5;
secT+=dt;if(secT>0.25){secT=0;tick();stationLabels()}
const a=pg.attributes.position;for(let i=0;i<DN;i++){a.setY(i,a.getY(i)+Math.sin(tt*0.6+i)*0.0015);a.setX(i,a.getX(i)+Math.cos(tt*0.4+i*1.7)*0.0012)}a.needsUpdate=true;
custTick(dt);Q.forEach((c,i)=>{c.g.visible=G.phase!=='craft'&&view!=='vitrin';if(c.mix)return;c.head.rotation.y=Math.sin(tt*0.9+i)*0.25;c.g.position.y=c.walking?Math.abs(Math.sin(tt*9))*0.05:Math.abs(Math.sin(tt*1.6+i))*0.012});
ALLC.forEach(c=>{if(c.mix)c.mix.update(dt)});MIX.forEach(m=>m.update(dt));wxTick(dt);if(SPL){const a=tt*0.05+0.6;camCur.l.set(OP,0.9,-0.8);camCur.p.set(OP+Math.sin(a)*6.8,3.6,-0.8+Math.cos(a)*6.8)}catTick(dt);collFx(dt);BOB.forEach(b=>{const k=tt*b.sp+b.ph;if(b.br){b.o.scale.y=b.s0*(1+Math.sin(k)*0.025)}else{b.o.rotation.order='YXZ';b.o.rotation.y=b.r0+Math.sin(k*0.11)*0.25;if(b.sp>=3){b.o.position.y=Math.max(0,Math.sin(k))*0.03;b.o.rotation.x=0}else{b.o.position.y=0;b.o.rotation.x=Math.pow(Math.max(0,Math.sin(k*0.7)),2)*(b.sp<1?0.22:0.45)}}});if(DOORH){const tg=(G.open&&!G.night)||ALLC.some(c=>c.walking)?-1.55:0;DOORH.rotation.y+=(tg-DOORH.rotation.y)*Math.min(1,dt*4)}
if(view==='islik')ST.forEach(s=>{if(s.wheel&&s.jobs.length)s.wheel.rotation[s.id==='cikrik'?'z':'y']+=dt*4;s.m.position.y=0.06+(s.ready?Math.abs(Math.sin(tt*5))*0.07:0)});
AWN.visible=camCur.p.y<2.05;toolTick();if(lamp.visible)lamp.intensity=1.35+Math.sin(tt*2.3)*0.05;
ZM.z+=(ZM.t-ZM.z)*Math.min(1,dt*10);const zz=zoomable()?ZM.z:1;cam.position.copy(camCur.p).sub(camCur.l).divideScalar(zz).add(camCur.l);
cam.position.x+=ZM.px+Math.sin(tt*0.35)*0.05*sway;cam.position.y+=Math.sin(tt*0.9)*0.01*sway;cam.position.z+=ZM.pz;look.copy(camCur.l);look.x+=ZM.px;look.z+=ZM.pz;const dsg=G.phase==='craft'&&G.step==='design';if((G.phase==='result'||dsg)&&K&&K.model){RZ.z+=(RZ.t-RZ.z)*Math.min(1,dt*10);if(Math.abs(RZ.z-1)>0.002){const P=K.model.g.position.clone();P.y+=0.08;const f=1-1/RZ.z;cam.position.lerp(P,f*0.9);look.lerp(P,Math.min(1,Math.max(0,f*1.3)));const sz=R.getSize(V2T);if(!dsg)cam.setViewOffset(sz.x,sz.y,0,sz.y*0.25*clamp(f*2.2,0,1),sz.x,sz.y);else if(cam.view&&cam.view.enabled)cam.clearViewOffset()}else if(cam.view&&cam.view.enabled)cam.clearViewOffset()}else{RZ.z=RZ.t=1;if(cam.view&&cam.view.enabled)cam.clearViewOffset();const h=document.getElementById('zhint');if(h&&!h.classList.contains('hide'))h.classList.add('hide')}cam.lookAt(look);
busy=PT.size>0||tweens.length>0||!!(K&&(K.tick||K.pdn))||!!(K&&(K.drag||K.holding))||switching||(G.phase==='craft'&&['rhythm','hold','pump','rub','trace'].includes(G.step))||ALLC.some(c=>c.walking);shT+=dt;if(busy||shT>(view==='bahce'||view==='pazar'?0.1:0.4)){shT=0;R.shadowMap.needsUpdate=true}R.render(S,cam);drawFx();drawLabels()}
glb('backpack',()=>{ICON.sirt=snap(PRODS.find(p=>p.id==='sirt').build('#8a4a26').g);vitrinSync()});
['good','bad','punch','coin','thud'].forEach(k=>{const f=sfx[k];if(f)sfx[k]=(...a)=>{f(...a);vib(k==='bad'?[25,40,25]:k==='coin'?12:18)}});
load();ST.forEach(s=>s.lvl=G.stLv[s.id]||1);try{if(localStorage.getItem('arasta-owner')===OWNER_H)G.owner=true}catch(e){}lockInit();decoApply();if(!G.cap)G.cap={d:0,s:0,v:G.stock.length>3?(G.stock.length>6?2:1):0};G.store=(G.store||[]).filter(it=>PRODS.some(p=>p.id===it.pid));storeSync();EQ.forEach(e=>eqS(e.id));eqBadge();eqIcons();if(G.cloud){let lts=0;try{lts=JSON.parse(localStorage.getItem(SK)).ts||0}catch(e){}rpc('arasta_get',{p_code:G.cloud}).then(d=>{if(d&&d.ts&&d.ts>lts+3000){d.cloud=G.cloud;if(!G.started){localStorage.setItem(SK,JSON.stringify(d));save=()=>{};location.reload()}else toast('Bulutta daha yeni kayıt var<br>Oyunu yeniden açınca yüklenir',2200)}}).catch(()=>{})}if(!G.ds)G.ds={earned:G.st.earned,deliv:G.st.deliv,sold:G.st.sold,lost:G.st.lost};vitrinSync();setOpen(G.open,true);if(G.tier>1)restock();PL.forEach(plotSync);drawSign();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(drawSign);
setLights('home');hud();refresh();loop();
const spM=$('spMus'),spS=$('spSnd');const spSync=()=>{spM.classList.toggle('on',!!G.mus);spS.classList.toggle('on',!!G.snd);$('musB').classList.toggle('off',!G.mus)};spSync();
spM.onclick=()=>{G.mus=!G.mus;spSync()};spS.onclick=()=>{G.snd=!G.snd;spSync()};
$('musB').onclick=()=>{musSet(!G.mus);save()};
{const fl=document.querySelector('.flags');if(fl){let h='';[[8,0],[30,1]].forEach(([y0,r])=>{h+=`<path d="M-5 ${y0} Q180 ${y0+26} 365 ${y0}" stroke="#5a3519" stroke-width="1.5" fill="none"/>`;const C=['#b5533c','#e8c77a','#2f6b5a','#f3e6cf','#3f6fa8'];for(let i=0;i<15;i++){const x=6+i*24+r*12,t=x/360,y=y0+4*t*(1-t)*26;h+=`<path d="M${x-8} ${y} L${x+8} ${y} L${x} ${y+15} Z" fill="${C[(i+r*2)%5]}"/>`}});fl.innerHTML=h}
 const inf=slotInfo(SSLOT);$('spInfo').textContent=inf?`${inf.ad} · ${inf.day}. gün · ${inf.gold} altın`:'';$('startB').textContent=inf?'Devam et':'Dükkanı aç';let nA=false;$('spNew').onclick=()=>{if(!inf){$('startB').click();return}if(!nA){nA=true;$('spNew').textContent='Yeni yerde açılsın mı? Dokun';return}if(!newSlot())toast('3 dükkan yeri dolu<br>Ayarlardan birini sil',2200)};
 $('spLog').onclick=()=>{$('spLogBox').classList.toggle('hide');$('spU').focus()};$('spLogGo').onclick=async()=>{const b=$('spLogGo'),u=$('spU').value,p=$('spP').value;b.textContent='…';let r;try{r=await rpc('arasta_user_get',{p_uname:u,p_pin:p})}catch(e){r={err:'net'}}b.textContent='Giriş';if(!r||r.err){msg(ACM[r&&r.err]||'Bağlantı kurulamadı','no');return}const L=r.shops||[];if(!L.length){msg('Bu hesapta kayıtlı dükkan yok','no');return}try{localStorage.setItem('arasta-acct',JSON.stringify({u:u.toLowerCase().trim(),p}))}catch(e){}const go=c=>{msg('Yükleniyor…','ok');cloudLoadInto(c).then(x=>{if(x!=='ok')msg({full:'3 dükkan yeri dolu · önce birini sil',net:'Bağlantı kurulamadı'}[x]||'Yüklenemedi','no')})};if(L.length===1){go(L[0].code);return}$('spShops').innerHTML=L.map(s=>`<button class="btn l" data-sc="${s.code}">${esc(s.ad||'Dükkan')} · K${s.tier||1} · ${s.gold||0} altın</button>`).join('');$('spShops').querySelectorAll('[data-sc]').forEach(x=>x.onclick=()=>go(x.dataset.sc))};
 $('spCode').onclick=()=>{$('spCodeBox').classList.toggle('hide');$('spCodeIn').focus()};
 const ci=$('spCodeIn'),msg=(t,c)=>{const m=$('spMsg');m.className=c||'';m.innerHTML=t||''};
 const fmt=v=>{const r=(v||'').toUpperCase().replace(/[İı]/g,'I').replace(/[^A-Z0-9]/g,'').slice(0,12);return r.replace(/(.{4})(?=.)/g,'$1-')};
 ci.addEventListener('input',()=>{const v=fmt(ci.value);if(ci.value!==v)ci.value=v;msg()});
 ci.addEventListener('paste',e=>{const t=(e.clipboardData||window.clipboardData);if(!t)return;e.preventDefault();ci.value=fmt(t.getData('text'));msg()});
 ci.addEventListener('keydown',e=>{if(e.key==='Enter')$('spCodeGo').click()});
 $('spCodeGo').onclick=async()=>{const b=$('spCodeGo'),v=fmt(ci.value);ci.value=v;if(v.replace(/-/g,'').length!==12){msg('Kod 12 harf/rakam olmalı','no');return}
  try{const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v));const h=[...new Uint8Array(d)].map(x=>x.toString(16).padStart(2,'0')).join('');if(h===OWNER_H){G.owner=true;try{localStorage.setItem('arasta-owner',OWNER_H)}catch(e){}save();sfx.fan&&sfx.fan();msg('Yönetici modu açıldı · bu cihazda hep açık','ok');ci.value='';return}}catch(e){}
  b.textContent='…';cloudLoadInto(v).then(r=>{b.textContent='Yükle';if(r!=='ok')msg({bad:'Kod 12 harf/rakam olmalı',none:'Bu koda ait kayıt bulunamadı',full:'3 dükkan yeri dolu · önce birini sil',net:'Bağlantı kurulamadı, tekrar dene'}[r]||'Yüklenemedi','no')})};
 SPL=true;document.body.classList.add('spl');view='pazar';setLights('pazar')}
$('startB').onclick=()=>{ac();musSet(G.mus);sfx.bell();G.started=true;if(!G.cloud){G.cloud=newCode();setTimeout(()=>{save();cloudPush(true).then(r=>{if(r)toast(`Bulut kaydın otomatik açıldı<br>Kodun: <b>${fmtCode(G.cloud)}</b><br><small>Ayarlar'dan görebilirsin</small>`,3200)})},4000)}setTimeout(acctAuto,6000);if(G.notif&&typeof Notification!=='undefined'&&Notification.permission==='granted')setTimeout(pushSub,3000);if(!G.tut&&G.first)setTimeout(()=>tutShow(0),1200);else setTimeout(awaySummary,1600);SPL=false;document.body.classList.remove('spl');view='pazar';go('home');$('splash').classList.add('go');setTimeout(()=>$('splash').remove(),500);save();
toast(G.first?`Hoş geldin usta!<br>İlk müşterin geliyor.`:`Tekrar hoş geldin usta!`,2200)};
})();
