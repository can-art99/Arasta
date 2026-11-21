/* ---------- işlik ---------- */
const LBL=[];
for(let i=0;i<10;i++)add(B(0.66,0.05,12),M(i%2?'#5e3a22':'#54331d'),OI-3+i*0.66,0,1);
add(B(44,0.05,44),M('#4a3424'),OI,-0.04,1).castShadow=false;
{const crate=(x,z,s,r)=>add(B(s,s*0.8,s),M(['#8a5a34','#7a4a2a','#9a6a3a'][Math.abs(Math.round(x*3+z))%3]),OI+x,s*0.4,z).rotation.y=r;
 [[-4.3,-2.6,0.6,0.2],[-4.0,-1.9,0.45,0.6],[4.4,-2.0,0.6,-0.3],[4.1,3.8,0.55,0.4],[-4.4,4.4,0.6,0.1]].forEach(q=>crate(...q));
 place('barrel',{x:OI-4.5,z:1.0,h:0.85});place('barrel',{x:OI+4.6,z:0.6,h:0.85,ry:1.2});place('barrel',{x:OI+4.2,z:1.4,h:0.7,ry:0.5});
 [-4.0,4.0].forEach(x=>{place('post_lantern',{x:OI+x,z:-3.4,h:1.5});place('post_lantern',{x:OI+x,z:5.8,h:1.5})});
 place('drafting_table',{x:OI-4.6,z:6.2,w:1.2,ry:Math.PI/2})}
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
function mkOrs(g){put(g,B(0.44,0.42,0.36),M('#5a4a40'),-0.17,0.21,-0.22);put(g,B(0.34,0.05,0.26),glow('#ff6a20'),-0.17,0.43,-0.22);
put(g,Cy(0.08,0.1,0.3,6),M('#3a3a3a'),0.22,0.15,0.22);const a=put(g,B(0.26,0.1,0.12),M('#4a4a50',0.35),0.22,0.35,0.22);const cn=put(g,new THREE.ConeGeometry(0.05,0.12,4),M('#4a4a50',0.35),0.4,0.35,0.22);cn.rotation.z=-Math.PI/2;const old=g.children.slice(-3);glb('m_anvil',()=>{old.forEach(o=>o.visible=false);place('m_anvil',{par:g,x:0.2,z:0.24,h:0.26,ry:Math.PI/2+0.35})});place('m_bellow',{par:g,x:-0.36,y:0,z:0.2,h:0.26,ry:0.6});place('m_fici',{par:g,x:0.3,z:-0.22,h:0.22})}
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
{id:'testere',ad:'Testere tezgâhı',tier:3,mk:mkTestere,rec:[{in:{kutuk:1},out:{kereste:2},s:8}]},
{id:'cark',ad:'Çömlekçi çarkı',tier:1,mk:mkCark,rec:[{in:{kil:2},out:{camur:1},s:12}]},
{id:'dokuma',ad:'Dokuma tezgâhı',tier:1,mk:mkDokuma,rec:[{in:{sogut:3},out:{hasir:1},s:12},{in:{yun:2},out:{kumas:1},s:16},{in:{yun:3},out:{kece:1},s:20}]}];
ST.forEach(s=>s.rec.forEach(r=>{r.s=Math.round(r.s*(STX[s.id]||4))}));
const SP=[[-1.3,-3.1],[1.3,-3.1],[-1.3,-0.8],[1.3,-0.8],[-1.3,1.5],[1.3,1.5],[-1.3,3.8],[1.3,3.8]];
ST.forEach((s,i)=>{const g=new THREE.Group(),m=new THREE.Group(),x=OI+SP[i][0],z=SP[i][1];s.mk(m);m.scale.setScalar(0.88);if(s.id==='testere')place('wb_big',{par:m,swap:1,w:1.05,ry:Math.PI});m.position.y=0.06;g.add(m);s.m=m;s.wheel=m.userData.wheel;s.liq=m.userData.liq;
s.base=put(g,Cy(0.72,0.75,0.06,28),M('#6e4a2c'),0,0.03,0);const h=new THREE.Mesh(Cy(0.95,0.95,1.7,12),HID);h.position.y=0.85;g.add(h);
g.position.set(x,0,z);g.userData.st=s;S.add(g);s.g=g;s.jobs=[];s.lvl=1;s.ready=null;s.lbl=label('islik',V(x,0.08,z+0.78),null,true);s.lbl.el.classList.add('stl','sm');s.lbl.el.onclick=()=>stationTap(s)});
