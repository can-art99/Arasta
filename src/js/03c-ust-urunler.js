/* ---------- Üst kat şaheserleri (Kademe 5+, sadece üst katta yapılır) ---------- */
MATS.sedef={ad:'Sedef',g:'Ham madde',mk:()=>{const g=new THREE.Group(),m=M('#e9eef0',0.25);[[0,0,0.07],[0.06,0.03,0.05],[-0.05,-0.03,0.045]].forEach(([x,z,r])=>{const o=put(g,Cy(r,r*1.1,0.012,7),m,x,0.008,z);o.scale.z=0.7});put(g,Cy(0.03,0.03,0.003,7),M('#b9d4e0',0.2),0,0.016,0);return g}};
MATS.gumus={ad:'Gümüş külçe',g:'Ham madde',mk:()=>{const g=new THREE.Group();put(g,B(0.22,0.05,0.11),M('#c8ccd2',0.25),0,0.025,0);put(g,B(0.17,0.03,0.07),M('#dde1e6',0.2),0,0.065,0);return g}};
/* şekiller (yatay düzlemde; y ekseni sahnede -z olur) */

const lutShape=()=>{const s=new THREE.Shape();s.moveTo(0,0.21);s.bezierCurveTo(0.12,0.2,0.18,0.08,0.17,-0.04);s.bezierCurveTo(0.16,-0.16,0.08,-0.22,0,-0.22);s.bezierCurveTo(-0.08,-0.22,-0.16,-0.16,-0.17,-0.04);s.bezierCurveTo(-0.18,0.08,-0.12,0.2,0,0.21);return s};
/* geçici modeller: gerçek .glb gelince glbProd ile değişir */
function baglamaModel(hex){const g=new THREE.Group(),um=M(hex||'#7a4524',0.55),dk=M('#3a2213',0.6),lt=M('#d9b98a',0.6),st=M('#e8e2d0',0.3);
 const b=put(g,new THREE.SphereGeometry(0.17,14,10,0,Math.PI*2,0,Math.PI/2),um,0,0.0,0.02);b.rotation.x=Math.PI;b.scale.set(1,0.55,1.25);b.position.y=0.095;
 for(let i=-3;i<=3;i++){const r=put(g,B(0.004,0.002,0.4),dk,i*0.045,0.012+0.06*Math.cos(i*0.4),0.02);r.visible=false}
 const kp=put(g,Cy(1,1,0.008,28),lt,0,0.098,0.02);kp.scale.set(0.165,1,0.205);
 put(g,Cy(0.025,0.025,0.01,14),dk,0,0.103,-0.04);
 put(g,B(0.05,0.03,0.42),um,0,0.095,-0.4);put(g,B(0.052,0.006,0.4),dk,0,0.111,-0.4);
 for(let i=0;i<9;i++)put(g,B(0.054,0.004,0.004),st,0,0.115,-0.24-i*0.04);
 const hd=put(g,B(0.06,0.035,0.16),um,0,0.08,-0.67);hd.rotation.x=0.35;
 [-1,1].forEach(sx=>{for(let i=0;i<3;i++){const p=put(g,Cy(0.008,0.008,0.05,6),dk,sx*0.05,0.075,-0.62-i*0.045);p.rotation.z=Math.PI/2}});
 put(g,B(0.06,0.012,0.012),dk,0,0.104,0.15);
 for(let i=-1;i<=1;i++)put(g,B(0.002,0.002,0.82),st,i*0.012,0.118,-0.27);
 g.scale.setScalar(0.82);return {g,um}}
function sandikModel(hex){const g=new THREE.Group(),um=M(hex||'#5e3418',0.5),dk=M('#3a1f0f',0.55),sd=M('#eef3f4',0.2),br=M('#c9a23a',0.3);
 put(g,B(0.46,0.17,0.3),um,0,0.085,0);put(g,B(0.48,0.02,0.32),dk,0,0.01,0);
 const ld=put(g,B(0.48,0.05,0.32),um,0,0.195,0);
 [[-0.14,-0.07],[0.14,-0.07],[-0.14,0.07],[0.14,0.07],[0,0]].forEach(([x,z],i)=>{const o=put(g,Cy(i===4?0.045:0.028,i===4?0.045:0.028,0.006,i===4?8:6),sd,x,0.222,z);o.rotation.y=0.4});
 [[-0.2,0],[0.2,0]].forEach(([x])=>put(g,B(0.02,0.005,0.3),br,x,0.223,0));
 put(g,B(0.05,0.06,0.012),br,0,0.17,0.157);put(g,B(0.47,0.012,0.012),sd,0,0.13,0.152);
 return {g,um}}
{const T=(ad,o)=>Object.assign({t:'trace',ad},o||{}),Rb=(k,ad)=>({t:'rub',k,ad}),D={t:'design'},Y=(k,ad,o)=>Object.assign({t:'rhythm',k,ad},o||{}),A=(part,ad,slots)=>({t:'asm',part,ad,slots,pose:'flat'}),Hd=ad=>({t:'hold',ad}),rr=(w,h)=>()=>rrect(w,h,Math.min(w,h)*0.25);
PRODS.push(
{id:'baglama',ust:1,hard:true,ad:'Bağlama',tier:5,base:900,need:{kereste:3,iplik:2,boynuz:1},sheet:'#b07a48',wood:true,shape:lutShape,build:baglamaModel,vrot:[1.25,0,0],
 steps:[T('Tekne dilimlerini kes'),{t:'chisel',ad:'Tekneyi içten oy',c:[0,0.02],r:[0.12,0.15]},Y('yapistir','Dilimleri tutkalla',{pts:[[-0.12,-0.1],[0.12,-0.1],[-0.15,0.05],[0.15,0.05],[0,0.2]]}),Hd('Tekneyi kalıpta sıkıştır'),{t:'plane',ad:'Tekneyi rendele',n:5},Rb('zimpara','Tekneyi zımparala'),
  T('Göğüs kapağını kes',{part:'kapak',n:1,shape:()=>ellShape(0.15,0.19),at:[-0.45,0],col:'#d9b98a',wood:true}),A('kapak','Kapağı tekneye oturt',[[0,0.02]]),Y('yapistir','Kapak kenarını yapıştır',{n:8,sc:0.85}),{t:'drill',ad:'Ses deliğini aç',pts:[[0,-0.06]]},
  T('Sapı kes',{part:'sap',n:1,shape:rr(0.05,0.4),at:[-0.45,0],col:'#7a4524',wood:true}),A('sap','Sapı gövdeye tak',[[0,-0.39]]),{t:'drill',ad:'Burgu deliklerini aç',pts:[[-0.03,-0.56],[0.03,-0.56],[-0.03,-0.6],[0.03,-0.6]]},
  Y('dik','Perdeleri bağla',{pts:[[0,-0.26],[0,-0.3],[0,-0.34],[0,-0.38],[0,-0.42],[0,-0.46],[0,-0.5]]}),{t:'lace',ad:'Telleri geçir',pairs:true,pts:[[-0.018,0.15],[-0.018,-0.58],[-0.006,0.15],[-0.006,-0.58],[0.006,0.15],[0.006,-0.58],[0.018,0.15],[0.018,-0.58]]},Rb('cila','Cila çek'),Rb('parlat','Son parlatma'),{t:'akort',ad:'Telleri akort et',notes:[['La',220],['Re',293.66],['Sol',392],['La',440]],x:[-0.018,-0.006,0.006,0.018],pegs:[[-0.035,-0.575],[-0.035,-0.62],[0.035,-0.575],[0.035,-0.62]]},D]},
{id:'sandik',ust:1,hard:true,ad:'Sedef kakma sandık',tier:5,base:1200,need:{kereste:3,sedef:2,tutkal:1,balmumu:1},sheet:'#8a5530',wood:true,shape:()=>rrect(0.5,0.34,0.02),build:sandikModel,
 steps:[T('Alt paneli (tabanı) kes'),{t:'plane',ad:'Tahtaları rendele',n:5},T('Yan tahtaları kes',{part:'yan',n:4,shape:i=>i<2?rrect(0.5,0.04,0.008):rrect(0.04,0.3,0.008),at:[-0.45,0],col:'#3a2416',wood:true}),A('yan','Yanları kutuya diz',[[0,-0.15],[0,0.15],[-0.23,0],[0.23,0]]),
  Y('yapistir','Köşeleri tutkalla',{pts:[[-0.23,-0.15],[0.23,-0.15],[-0.23,0.15],[0.23,0.15]]}),{t:'hammer',kind:'nail',hits:1,ad:'Köşelere kavela çak',pts:[[-0.23,-0.15],[0.23,-0.15],[-0.23,0.15],[0.23,0.15]]},Hd('Kutuyu mengenede sık'),
  T('Pirinç kaplı kapağı kes',{part:'kapak',n:1,shape:()=>rrect(0.5,0.34,0.02),at:[-0.45,0],col:'#a8822a',metal:true}),Object.assign(A('kapak','Kapağı kutunun üstüne oturt',[[0,0]]),{lift:0.037}),{t:'screw',ad:'Kapak menteşelerini vidala',pts:[[-0.14,-0.15],[0.14,-0.15]]},
  T('Yeşil mermer levhaları kes',{part:'levha',n:4,shape:()=>rrect(0.097,0.28,0.008),at:[-0.45,0],col:'#1f5a36'}),A('levha','Levhaları kapağa eşit aralıkla diz',[[-0.1815,0],[-0.0605,0],[0.0605,0],[0.1815,0]]),
  T('Pirinç kuşakları kes',{part:'kusak',n:3,shape:()=>rrect(0.024,0.34,0.004),at:[-0.45,0],col:'#d9b04a',metal:true}),A('kusak','Kuşakları levha aralarına yerleştir',[[-0.121,0],[0,0],[0.121,0]]),{t:'hammer',kind:'rivet',hits:1,ad:'Kuşak uçlarını perçinle',pts:[[-0.121,-0.155],[0,-0.155],[0.121,-0.155],[-0.121,0.155],[0,0.155],[0.121,0.155]]},
  {t:'kakma',ad:'Levhalara sedef kak',slots:[{p:[-0.1815,0],k:'d',s:0.8},{p:[-0.0605,0],k:'c',s:0.7},{p:[0.0605,0],k:'c',s:0.7},{p:[0.1815,0],k:'d',s:0.8}]},
  T('Pirinç kilit rozetini kes',{part:'rozet',n:1,shape:()=>circleShape(0.035),at:[0.42,0.24],col:'#c9a23a',metal:true}),A('rozet','Kilit rozetini ön yüze tak',[[0,0.152]]),{t:'hammer',kind:'nail',hits:1,ad:'Rozet çivilerini çak',pts:[[-0.028,0.152],[0.028,0.152]]},
  Rb('cila','Balmumu cila sür'),Rb('parlat','Sedefleri parlat'),D]}
);}

/* ---------- Nargile ve işlemeli tabanca ---------- */
const RS=1.4,R2=(x,z)=>[x*RS,z*RS],polyS=P=>{const s=new THREE.Shape();s.moveTo(P[0][0],P[0][1]);P.slice(1).forEach(q=>s.lineTo(q[0],q[1]));s.lineTo(P[0][0],P[0][1]);return s},rvT=([x,y])=>[(x-0.07)*RS,(y+0.03)*RS];
/* tabanca parçaları (tezgâha yan yatmış, namlu sağa): gövde plakası, namlu çubuğu, top (3B silindir), ceviz kabza */
const revShape=()=>polyS([[0.30,0.075],[0.30,0.035],[0.04,0.035],[0.04,0.0],[0.0,-0.015],[-0.02,-0.005],[-0.05,-0.02],[-0.06,-0.03],[-0.10,-0.15],[-0.16,-0.14],[-0.14,0.03],[-0.11,0.085],[-0.06,0.095],[0.0,0.075]].map(rvT));
const frameShape=()=>polyS([[0.05,0.08],[0.05,0.03],[0.04,0.0],[0.0,-0.015],[-0.02,-0.005],[-0.05,-0.02],[-0.06,-0.03],[-0.10,-0.15],[-0.16,-0.14],[-0.14,0.03],[-0.11,0.085],[-0.06,0.095],[0.0,0.085]].map(rvT));
const RVG=[[-0.065,-0.03],[-0.103,-0.14],[-0.152,-0.132],[-0.135,0.025],[-0.11,0.055],[-0.075,0.04]].map(rvT),RVGC=[RVG.reduce((a,q)=>a+q[0],0)/RVG.length,RVG.reduce((a,q)=>a+q[1],0)/RVG.length];
const gripShape=()=>polyS(RVG.map(q=>[q[0]-RVGC[0],q[1]-RVGC[1]]));
const RV={bar:[(0.175-0.07)*RS,-(0.055+0.03)*RS],barL:0.25*RS,barH:0.04*RS,cyl:[-0.07*RS,-(0.045+0.03)*RS],cylR:0.04*RS,cylL:0.085*RS,grip:[RVGC[0],-RVGC[1]],jx:(0.05-0.07)*RS,mz:(0.30-0.07)*RS};
/* top: yan yatmış 3B silindir; dönen kısım userData.rotor */
function revCyl(){const g=new THREE.Group(),ro=new THREE.Group(),r=RV.cylR,l=RV.cylL,st=M('#5d636b',0.3);st.metalness=0.55;g.add(ro);ro.rotation.z=0;
 const b=new THREE.Mesh(Cy(r,r,l,20),st);b.rotation.z=Math.PI/2;b.castShadow=true;ro.add(b);
 for(let i=0;i<6;i++){const a=i/6*Math.PI*2+Math.PI/6,f=new THREE.Mesh(B(l*0.7,0.006,0.012),M('#2c3036',0.4));f.position.set(0,Math.cos(a)*r*0.97,Math.sin(a)*r*0.97);f.rotation.x=-a;ro.add(f);const h=new THREE.Mesh(Cy(r*0.2,r*0.2,0.004,10),M('#14161a',0.6));h.rotation.z=Math.PI/2;h.position.set(l/2+0.001,Math.cos(a-Math.PI/6)*r*0.58,Math.sin(a-Math.PI/6)*r*0.58);ro.add(h)}
 const ax=new THREE.Mesh(Cy(r*0.18,r*0.18,l*1.15,8),M('#c9c4b8',0.3));ax.rotation.z=Math.PI/2;g.add(ax);g.userData.rotor=ro;g.userData.sh=rrect(l,r*2,0.01);return g}
/* geçici modeller (glb yüklenince yerlerine model gelir) */
function nargileModel(hex){const g=new THREE.Group(),gl=new THREE.MeshStandardMaterial({color:hex||'#3f7f9a',transparent:true,opacity:0.6,roughness:0.15}),cu=M('#b8733a',0.35),cl=M('#a4532e',0.8);
 const lt=new THREE.LatheGeometry([[0,0],[0.09,0.005],[0.13,0.06],[0.12,0.13],[0.05,0.19],[0.035,0.22]].map(q=>new THREE.Vector2(q[0],q[1])),20);put(g,lt,gl,0,0,0);
 put(g,Cy(0.018,0.022,0.3,10),cu,0,0.36,0);put(g,Cy(0.09,0.09,0.012,18),cu,0,0.47,0);put(g,Cy(0.045,0.03,0.05,12),cl,0,0.5,0);
 hkHose(g,V(-0.08,0.15,0.06),1);return {g,um:gl}}
function tabancaModel(hex){const g=new THREE.Group(),st=M('#6a7078',0.3),wd=M(hex&&hex!=='#596068'?hex:'#5a3420',0.6);const b=flat(revShape(),0.02,st);b.position.y=0.01;g.add(b);
 const gr=flat(gripShape(),0.012,wd);gr.position.set(RV.grip[0],0.022,RV.grip[1]);g.add(gr);const c=revCyl();c.position.set(RV.cyl[0],0.02+RV.cylR*0.55,RV.cyl[1]);g.add(c);return {g,um:wd}}
/* nargile hortumu + marpuç (model ölçeğinde s=1 için metre) */
function hkHose(par,a,s){const P=[a,a.clone().add(V(-0.05*s,-0.02*s,0.05*s)),a.clone().add(V(-0.11*s,-0.1*s,0.09*s)),a.clone().add(V(-0.13*s,-a.y+0.012*s,0.02*s)),a.clone().add(V(-0.07*s,-a.y+0.012*s,-0.08*s)),a.clone().add(V(0.01*s,-a.y+0.012*s,-0.11*s))];
 const cv=new THREE.CatmullRomCurve3(P),h=new THREE.Mesh(new THREE.TubeGeometry(cv,48,0.009*s,8,false),M('#5a2e1a',0.85));h.castShadow=true;par.add(h);
 for(let i=1;i<12;i++){const q=cv.getPointAt(i/12),tg=cv.getTangentAt(i/12),r=new THREE.Mesh(new THREE.TorusGeometry(0.0095*s,0.0022*s,5,10),M('#c9a23a',0.35));r.position.copy(q);r.lookAt(q.clone().add(tg));par.add(r)}
 const e=cv.getPointAt(1),t=cv.getTangentAt(1),mp=new THREE.Group();mp.position.copy(e);mp.lookAt(e.clone().add(t));par.add(mp);
 const a1=new THREE.Mesh(Cy(0.011*s,0.011*s,0.03*s,10),M('#c9a23a',0.3));a1.rotation.x=Math.PI/2;a1.position.z=0.015*s;mp.add(a1);
 const a2=new THREE.Mesh(Cy(0.009*s,0.006*s,0.06*s,10),M('#3a2213',0.5));a2.rotation.x=Math.PI/2;a2.position.z=0.06*s;mp.add(a2);
 const a3=new THREE.Mesh(Cy(0.005*s,0.004*s,0.015*s,8),M('#e8e2d0',0.3));a3.rotation.x=Math.PI/2;a3.position.z=0.097*s;mp.add(a3)}
/* nargile parçaları glb'den ayrıştırılır: şişe (cam + süs taşları), gövde (boyun, boru, hortum ağzı), tabla, lüle; hortum çizilir */
/* nargile glb'si oyunun model yükleyicisinde malzemeye göre birleştiriliyor; parçalara ayırmak için ham hali ayrıca yüklenir */
let HKRAW=null;setTimeout(function hkLoad(){if(!THREE.GLTFLoader){setTimeout(hkLoad,1500);return}new THREE.GLTFLoader().load(AU('models/m_nargile.glb'),g=>{HKRAW=g},undefined,()=>{})},2500);
function nargileFull(hex){const g=new THREE.Group();let um=null;['sise','govde','tabla','lule','hortum'].forEach(k=>{const r=hkPiece(k,hex,HKS);g.add(r.g);if(k==='sise')um=r.um});return {g,um}}
const HKS=0.42/2.75,HKY=y=>(y+1.62)*HKS;
function hkMat(b,hex){const glass=new THREE.MeshStandardMaterial({color:hex||'#3f7f9a',transparent:true,opacity:0.55,roughness:0.12,metalness:0.1,side:THREE.DoubleSide,depthWrite:false}),cu=M('#b8733a',0.3),gd=M('#d9a83a',0.3),cl=M('#a4532e',0.85);cu.metalness=0.5;gd.metalness=0.6;
 return b.min.y<-1.5?glass:b.max.y<-0.45?gd:b.max.x<-0.5&&b.min.z>0.5?cu:b.min.y>=2.5?cl:cu}
function hkKey(b){return b.min.y<-1.5||b.max.y<-0.45?'sise':b.min.y>=2.5?'lule':b.min.y>2.2?'tabla':'govde'}
function hkPiece(key,hex,sc){const g=new THREE.Group(),inn=new THREE.Group();inn.scale.setScalar(sc);inn.position.y=1.62*sc;g.add(inn);let um=null;const src=HKRAW;
 if(src){src.scene.updateMatrixWorld(true);src.scene.traverse(o=>{if(!o.isMesh)return;o.geometry.computeBoundingBox();const b=o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);if(hkKey(b)!==key)return;const mt=hkMat(b,hex),m=new THREE.Mesh(o.geometry,mt);m.applyMatrix4(o.matrixWorld);m.castShadow=true;inn.add(m);if(key==='sise'&&mt.transparent)um=mt})}
 else{const cu=M('#b8733a',0.35);if(key==='sise'){um=new THREE.MeshStandardMaterial({color:hex||'#3f7f9a',transparent:true,opacity:0.6,roughness:0.15});put(inn,new THREE.SphereGeometry(1.2,18,14),um,0,-0.4,0)}if(key==='govde')put(inn,Cy(0.18,0.22,1.7,10),cu,0,1.5,0);if(key==='tabla')put(inn,Cy(0.9,0.9,0.1,18),cu,0,2.4,0);if(key==='lule')put(inn,Cy(0.45,0.3,0.6,12),M('#a4532e',0.85),0,2.85,0)}
 if(key==='hortum')hkHose(inn,V(-1.08,-0.12,1.08),10.5);
 if(key==='lule'){[[0,0],[0.14,0.08],[-0.12,0.1],[0.02,-0.15]].forEach(([x,z])=>{const k=new THREE.Mesh(B(0.16,0.09,0.16),new THREE.MeshStandardMaterial({color:'#2a1a14',emissive:'#ff5a1a',emissiveIntensity:0.9,roughness:0.9}));k.position.set(x+0.05,3.32,z-0.08);k.rotation.y=x*7;inn.add(k)})}
 return {g,um:um||M(hex||'#3f7f9a',0.3)}}
/* glb nargile: renksiz geliyor; cam, bakır, lüle, süs taşları boyanır, hortum/marpuç ve kor eklenir */
function hkPost(g,hex){const m=g.children[0];if(!m)return;const glass=new THREE.MeshStandardMaterial({color:hex||'#3f7f9a',transparent:true,opacity:0.55,roughness:0.12,metalness:0.1,side:THREE.DoubleSide,depthWrite:false}),cu=M('#b8733a',0.3),gd=M('#d9a83a',0.3),cl=M('#a4532e',0.85);cu.metalness=0.5;gd.metalness=0.6;
 m.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(m.matrixWorld).invert();m.traverse(o=>{if(!o.isMesh)return;o.geometry.computeBoundingBox();const b=o.geometry.boundingBox.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv,o.matrixWorld));
  if(b.min.y<-1.5)o.material=glass;else if(b.max.y<-0.45)o.material=gd;else if(b.max.x<-0.5&&b.min.z>0.5)o.material=cu;else if(b.min.y>=2.5)o.material=cl;else o.material=cu;o.castShadow=true});
 hkHose(m,V(-1.08,-0.12,1.08),10.5);
 [[0,0],[0.14,0.08],[-0.12,0.1],[0.02,-0.15]].forEach(([x,z])=>{const k=new THREE.Mesh(B(0.16,0.09,0.16),new THREE.MeshStandardMaterial({color:'#2a1a14',emissive:'#ff5a1a',emissiveIntensity:0.9,roughness:0.9}));k.position.set(x+0.05,3.32,z-0.08);k.rotation.y=x*7;m.add(k)})}
{const T=(ad,o)=>Object.assign({t:'trace',ad},o||{}),Rb=(k,ad)=>({t:'rub',k,ad}),D={t:'design'},Y=(k,ad,o)=>Object.assign({t:'rhythm',k,ad},o||{}),A=(part,ad,slots)=>({t:'asm',part,ad,slots,pose:'flat'}),ci=r=>()=>circleShape(r);
PRODS.push(
{id:'nargile',ust:1,hard:true,ad:'Nargile',tier:5,base:1100,need:{cam:2,bakir:2,deri:1,kil:1},sheet:'#3f7f9a',shape:ci(0.2),build:nargileFull,craft:hex=>hkPiece('sise',hex,HKS/1.6),
 steps:[T('Cam parçasını kes',{glass:true}),T('Bakır gövde levhasını kes',{part:'govde',n:1,shape:()=>rrect(0.08,0.3,0.01),at:[-0.42,0],col:'#b8733a',metal:true}),T('Bakır tablayı kes',{part:'tabla',n:1,shape:ci(0.1),at:[-0.42,0],col:'#c98a4a',metal:true}),
  T('Lüleyi kilden kes',{part:'lule',n:1,shape:ci(0.05),at:[-0.38,0.24],col:'#a4532e',keep:true}),{t:'drill',ad:'Lüleye hava deliklerini aç',hy:0.013,pts:[[-0.38,0.24],[-0.358,0.24],[-0.402,0.24],[-0.38,0.218],[-0.38,0.262]]},
  Rb('torch','Camı pürmüzle ısıt'),{t:'blow',ad:'Camı üfleyerek şişir',n:8},Rb('sekil','Boynu yukarı doğru biçimlendir'),
  {t:'asm',part:'govde',mk:'govde',ad:'Gövdeyi şişenin ağzına tak',slots:[[0,0]],oy:HKY(0.69)},{t:'asm',part:'tabla',mk:'tabla',ad:'Tablayı gövdeye geçir',slots:[[0,0]],oy:HKY(2.53)},
  {t:'asm',part:'lule',mk:'lule',ad:'Lüleyi tablaya oturt',slots:[[0,0]],oy:HKY(3.27)},{t:'asm',part:'hortum',mk:'hortum',ad:'Hortumu hortum ağzına bağla',slots:[[0,0]],oy:HKY(-0.12),oc:[-1.08*HKS,1.08*HKS]},
  Rb('parlat','Bakırı parlat'),{t:'cekis',ad:'Çekiş kontrolü'},D]},
{id:'tabanca',ust:1,hard:true,ad:'İşlemeli tabanca',tier:5,base:1500,need:{celik:2,demir:1,kereste:1,sedef:1},sheet:'#596068',shape:frameShape,build:tabancaModel,vrot:[1.35,0,0],
 steps:[T('Çelik gövde plakasını kes',{metal:true,solid:{d:0.024,bv:0.006,steel:1,det:'rev'}}),T('Namlu çubuğunu kes',{part:'namlu',n:1,shape:()=>rrect(RV.barL,RV.barH,0.006),at:[0.1,0.3],col:'#7a8088',metal:true,solid:{round:1,steel:1}}),
  {t:'forge',part:'namlu',ad:'Namluyu ocakta kızdır'},{t:'dip',part:'namlu',ad:'Namluya su verip sertleştir'},A('namlu','Namluyu gövdeye hizala',[RV.bar]),
  {t:'path',ad:'Namlu eklemini lehimle',paths:[[0,1,2,3,4].map(i=>[RV.jx,RV.bar[1]-RV.barH/2+i*RV.barH/4])]},{t:'drill',ad:'Namlu kanalını aç',pts:[[RV.mz-0.012,RV.bar[1]]]},
  T('Top için çelik diski kes',{part:'top',n:1,shape:()=>circleShape(RV.cylR),at:[0.3,0.3],col:'#5d636b',metal:true,keep:true}),
  {t:'drill',ad:'Topa altı yuva aç',hy:0.013,pts:[0,1,2,3,4,5].map(i=>[0.3+Math.cos(i*Math.PI/3)*RV.cylR*0.58,0.3+Math.sin(i*Math.PI/3)*RV.cylR*0.58])},
  Object.assign(A('top','Topu gövdedeki yuvasına tak',[RV.cyl]),{cyl:1}),
  T('Ceviz kabzayı kes',{part:'kabza',n:1,shape:gripShape,at:[0.3,0.3],col:'#5a3420',wood:true,solid:{d:0.014,bv:0.007,walnut:1}}),Object.assign(A('kabza','Kabzayı tutamağın üstüne oturt',[RV.grip]),{lift:0.026}),{t:'screw',ad:'Kabza vidalarını sık',pts:[[RV.grip[0]+0.01,RV.grip[1]-0.06],[RV.grip[0]-0.01,RV.grip[1]+0.07]]},
  {t:'kakma',ad:'Kabzaya sedef kak',slots:[{p:[RV.grip[0],RV.grip[1]+0.005],k:'c',s:0.75},{p:[RV.grip[0]+0.012,RV.grip[1]-0.075],k:'d',s:0.6,r:1.2},{p:[RV.grip[0]-0.018,RV.grip[1]+0.085],k:'d',s:0.6,r:-1.9}]},
  {t:'path',grav:1,ad:'Namluya gravür işle',paths:[[0,1,2,3,4,5,6,7,8,9].map(i=>[RV.jx+0.03+i*0.028,RV.bar[1]+Math.sin(i*0.9)*0.01])]},Rb('parlat','Çeliği parlat'),
  {t:'tetik',ad:'Tetik kontrolü (kuru tetik)'},D]}
);}

/* ---------- Kuş kafesi ve usturlap ---------- */
const KF={R:0.11,H0:0.042,H:0.26};
function brassM(hex){const m=M(hex||'#a07a28',0.3);m.metalness=0.6;return m}
function kfPart(key,hex,sc){const g=new THREE.Group(),R=KF.R,H0=KF.H0,H=KF.H,bm=brassM(hex&&hex!=='#b58a2e'?hex:'#a07a28');let um=bm;
 if(key==='taban'){const b=put(g,Cy(R+0.02,R+0.025,0.03,28),M('#3e2112',0.5),0,0.015,0);b.castShadow=true}
 if(key==='tel'){const bars=[];for(let i=0;i<16;i++){const a=i/16*Math.PI*2,x=Math.cos(a)*R,z=Math.sin(a)*R;const b=put(g,Cy(0.0035,0.0035,H,6),bm,x,H0+H/2,z);b.castShadow=true;b.userData.a=a;bars.push(b)}
  [0.006,H*0.5,H].forEach(h=>{const r=put(g,new THREE.TorusGeometry(R,0.0042,6,40),bm,0,H0+h,0);r.rotation.x=Math.PI/2});
  const pc=put(g,Cy(0.004,0.004,R*1.9,8),M('#5a3420',0.6),0,H0+0.09,0);pc.rotation.z=Math.PI/2;g.userData.bars=bars}
 if(key==='kubbe'){for(let i=0;i<8;i++){const t=put(g,new THREE.TorusGeometry(R,0.0035,6,24,Math.PI),bm,0,H0+H,0);t.rotation.y=i*Math.PI/8}
  put(g,new THREE.SphereGeometry(0.014,10,8),bm,0,H0+H+R+0.006,0);const hk=put(g,new THREE.TorusGeometry(0.018,0.004,6,16),bm,0,H0+H+R+0.035,0);hk.castShadow=true}
 if(key==='kapi'){const d=new THREE.Group();d.position.set(0,H0,R+0.004);g.add(d);const fm=brassM('#8a6420');[[0,0.005,0.07,0.006],[0,0.115,0.07,0.006]].forEach(q=>put(d,B(q[2],q[3],0.006),fm,q[0],q[1],0));[-0.035,0.035].forEach(x=>put(d,B(0.006,0.116,0.006),fm,x,0.06,0));[-0.012,0.012].forEach(x=>put(d,Cy(0.0025,0.0025,0.11,5),fm,x,0.06,0));put(d,new THREE.TorusGeometry(0.008,0.002,5,10),fm,0.045,0.06,0)}
 if(key==='kus'){const k=new THREE.Group(),y=M('#f2c84b',0.6),bo=put(k,new THREE.SphereGeometry(0.02,10,8),y,0,0,0);bo.scale.set(1.25,1,1);put(k,new THREE.SphereGeometry(0.013,10,8),y,0.022,0.013,0);const bk=put(k,new THREE.ConeGeometry(0.005,0.012,6),M('#e07a2a',0.5),0.038,0.012,0);bk.rotation.z=-Math.PI/2;
  [-1,1].forEach(sd=>put(k,new THREE.SphereGeometry(0.0028,6,5),M('#1a1a1a',0.4),0.03,0.018,sd*0.007));const tl=put(k,B(0.025,0.004,0.014),M('#d9a83a',0.6),-0.028,0.005,0);tl.rotation.z=0.4;k.position.set(0,H0+0.112,0);g.add(k);g.userData.bird=k}
 g.scale.setScalar(sc||1);return {g,um}}
function kafesModel(hex){const g=new THREE.Group();let um=null;['taban','tel','kubbe','kapi','kus'].forEach(k=>{const r=kfPart(k,hex,1);g.add(r.g);if(k==='tel')um=r.um});return {g,um}}
/* usturlap: ağ (rete) — çember, kollar, burç halkası ve yıldız işaretçileri */
function reteGroup(hex){const g=new THREE.Group(),inn=new THREE.Group();inn.rotation.x=-Math.PI/2;g.add(inn);const bm=brassM(hex||'#b8902f'),d=0.004,add=sh=>{const m=new THREE.Mesh(ext(sh,d,0.0012),bm);m.castShadow=true;inn.add(m);return m};
 const ring=(r1,r2,cx,cy)=>{const s=new THREE.Shape();s.absarc(cx||0,cy||0,r2,0,Math.PI*2,false);const h=new THREE.Path();h.absarc(cx||0,cy||0,r1,0,Math.PI*2,true);s.holes.push(h);return s};
 add(ring(0.101,0.113));add(ring(0.058,0.066,0,0.032));add(circleShape(0.018));
 for(let i=0;i<6;i++){const a=i/6*Math.PI*2+0.3,s=new THREE.Shape(),w=0.004;s.moveTo(Math.cos(a)*0.016-Math.sin(a)*w,Math.sin(a)*0.016+Math.cos(a)*w);s.lineTo(Math.cos(a)*0.104-Math.sin(a)*w,Math.sin(a)*0.104+Math.cos(a)*w);s.lineTo(Math.cos(a)*0.104+Math.sin(a)*w,Math.sin(a)*0.104-Math.cos(a)*w);s.lineTo(Math.cos(a)*0.016+Math.sin(a)*w,Math.sin(a)*0.016-Math.cos(a)*w);add(s)}
 [[0,0.022,1],[1.3,0.012],[2.4,0.012],[3.6,0.012],[4.7,0.012]].forEach(([a,l,main])=>{const s=new THREE.Shape(),r0=0.098,w=main?0.012:0.007;s.moveTo(Math.cos(a)*r0-Math.sin(a)*w,Math.sin(a)*r0+Math.cos(a)*w);s.lineTo(Math.cos(a)*(r0+l+0.012),Math.sin(a)*(r0+l+0.012));s.lineTo(Math.cos(a)*r0+Math.sin(a)*w,Math.sin(a)*r0-Math.cos(a)*w);const m=add(s);if(main){m.material=M('#b8402a',0.4)}});
 g.userData.sh=circleShape(0.113);return g}
function usturlapModel(hex){const g=new THREE.Group(),bm=brassM(hex||'#a07a28');put(g,Cy(0.14,0.14,0.012,40),bm,0,0.006,0).castShadow=true;const rim=put(g,new THREE.TorusGeometry(0.138,0.006,6,40),bm,0,0.012,0);rim.rotation.x=Math.PI/2;
 for(let i=0;i<36;i++){const a=i/36*Math.PI*2,t=put(g,B(i%3?0.008:0.014,0.001,0.0018),M('#3a2a12',0.6),Math.cos(a)*(0.125-(i%3?0:0.003)),0.0125,Math.sin(a)*(0.125-(i%3?0:0.003)));t.rotation.y=-a}
 const c2=put(g,new THREE.TorusGeometry(0.07,0.001,4,40),M('#3a2a12',0.6),0,0.0125,0);c2.rotation.x=Math.PI/2;const rt=reteGroup();rt.position.y=0.013;g.add(rt);
 const al=put(g,B(0.27,0.004,0.018),brassM('#8a6420'),0,0.02,0);al.rotation.y=0.6;put(g,Cy(0.008,0.008,0.012,10),bm,0,0.022,0);
 const th=put(g,Cy(0.03,0.03,0.012,16,1,false,0,Math.PI),bm,0,0.006,-0.138);th.rotation.y=Math.PI/2;const hr=put(g,new THREE.TorusGeometry(0.02,0.004,6,16),bm,0,0.008,-0.18);hr.rotation.x=Math.PI/2;return {g,um:bm}}
{const T=(ad,o)=>Object.assign({t:'trace',ad},o||{}),Rb=(k,ad)=>({t:'rub',k,ad}),D={t:'design'},A=(part,ad,slots)=>({t:'asm',part,ad,slots,pose:'flat'}),ci=r=>()=>circleShape(r),RG=(r,n)=>Array.from({length:n+1},(_,i)=>[Math.cos(i/n*Math.PI*2)*r,Math.sin(i/n*Math.PI*2)*r]);
PRODS.push(
{id:'kafes',ust:1,hard:true,ad:'Süslü kuş kafesi',tier:5,base:1000,need:{pirinc:2,kereste:1,demir:1},sheet:'#b58a2e',shape:ci(0.13),build:kafesModel,mkPart:kfPart,
 steps:[T('Ceviz tabanı kes',{wood:true,solid:{d:0.03,bv:0.006,walnut:1}}),{t:'drill',ad:'Tel yuvalarını aç',pts:RG(0.11,16).slice(0,16).filter((_,i)=>i%2===0)},
  T('Pirinç telleri kes',{part:'tel',n:1,shape:()=>rrect(0.3,0.06,0.004),at:[-0.42,0],col:'#c9a23a',metal:true}),Rb('torch','Telleri tavlayıp yumuşat'),
  {t:'asm',part:'tel',mk:'tel',ad:'Tel gövdeyi tabana dik',slots:[[0,0]],oy:KF.H0+0.006,r:0.115,rest:[0.34,0.06]},{t:'path',ad:'Tel diplerini lehimle',paths:[RG(0.11,16)]},
  {t:'asm',part:'kubbe',mk:'kubbe',ad:'Kubbeyi tellerin üstüne oturt',slots:[[0,0]],oy:KF.H0+KF.H,r:0.115,rest:[0.36,0.08]},
  {t:'asm',part:'kapi',mk:'kapi',ad:'Kapıyı ön yüze tak',slots:[[0,0]],oy:KF.H0+0.06,oc:[0,KF.R],r:0.04,rest:[0.34,0.1]},
  Rb('parlat','Pirinci parlat'),{t:'kafes',ad:'Tel aralığı kontrolü'},D]},
{id:'usturlap',ust:1,hard:true,ad:'Usturlap',tier:5,base:1400,need:{pirinc:3,gumus:1},sheet:'#b58a2e',shape:ci(0.14),build:usturlapModel,vrot:[Math.PI/2,0,0],
 steps:[T('Pirinç ana diski kes',{metal:true,solid:{d:0.01,bv:0.003,brass:1}}),{t:'hammer',kind:'dent',hits:1,ad:'Kenarı dövüp düzelt',pts:[[0.13,0],[-0.13,0],[0,0.13],[0,-0.13]]},
  {t:'path',grav:1,ad:'Derece halkasını kazı',paths:[RG(0.125,24)]},{t:'path',grav:1,ad:'Ufuk çizgilerini kazı',paths:[[[-0.11,0],[-0.06,0],[0,0],[0.06,0],[0.11,0]],RG(0.07,16)]},
  {t:'drill',ad:'Merkez deliğini aç',pts:[[0,0]]},
  T('Ağ (örümcek) levhasını kes',{part:'rete',n:1,shape:ci(0.115),at:[-0.42,0],col:'#c9a23a',metal:true,solid:{fn:()=>reteGroup()}}),Rb('zimpara','Ağın kollarını eğele'),
  Object.assign(A('rete','Ağı diskin üstüne oturt',[[0,0]]),{lift:0.006}),
  T('Gözetleme cetvelini kes',{part:'alid',n:1,shape:()=>rrect(0.27,0.018,0.004),at:[-0.42,0],col:'#b8902f',metal:true,solid:{d:0.004,bv:0.0015,brass:1}}),A('alid','Cetveli merkeze yerleştir',[[0,0,0.6]]),{t:'screw',ad:'Merkez pimini vidala',pts:[[0,0]]},
  T('Askı halkasını kes',{part:'halka',n:1,shape:ci(0.022),at:[0.42,0.24],col:'#c9a23a',metal:true,solid:{d:0.006,bv:0.002,brass:1}}),A('halka','Halkayı tepeye tak',[[0,-0.158]]),
  Rb('parlat','Pirinci parlat'),{t:'nisan',ad:'Kalibrasyon: yıldız nişanı'},D]}
);}
