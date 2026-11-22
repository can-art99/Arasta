/* ---------- pazar ---------- */
function figure(x,z,col){const g=new THREE.Group();put(g,B(0.44,0.45,0.28),M('#3a2f28'),0,0.22,0);put(g,Cy(0.25,0.32,0.95,8),M(col),0,0.92,0);put(g,new THREE.SphereGeometry(0.22,10,8),M('#e0b088'),0,1.62,0);put(g,Cy(0.24,0.27,0.1,8),M('#8a3a28'),0,1.82,0);g.position.set(x,0,z);S.add(g);return g}
add(B(18,0.1,18),M('#c4ad82'),OP,-0.05,-1).castShadow=false;add(B(90,0.1,90),M('#a8916a'),OP,-0.07,-1).castShadow=false;
const LBT={},PCZ=-1.0;let HOUSE=null,HCOL=null;
/* meydan: yan sıra evler, çeşme, fenerler, ağaçlar */
{const HC=['#e8d8b8','#d9b89a','#e6cfa8','#c9d6c0','#e2c9a4','#d4b896'];
 const house=(x,z,ry,c,h,w)=>{const g=new THREE.Group();put(g,B(w,h,1.6),M(c),0,h/2,0);const r=put(g,new THREE.ConeGeometry(Math.max(w,1.6)*0.78,0.9,4),M('#b5533c'),0,h+0.45,0);r.rotation.y=Math.PI/4;r.scale.set(w/1.6>1?w/1.9:1,1,1);
  put(g,B(0.5,0.95,0.05),M('#6e4122'),-w*0.18,0.47,0.81);put(g,B(0.45,0.45,0.05),glow('#ffe6a8'),w*0.2,h*0.62,0.81).castShadow=false;
  const aw=put(g,B(w*0.8,0.05,0.6),M(['#b5533c','#2f6b5a','#e2b24a'][Math.abs(Math.round(x+z))%3]),0,1.25,1.05);aw.rotation.x=0.35;g.position.set(x,0,z);g.rotation.y=ry;S.add(g)};
 HOUSE=house;HCOL=HC;
 [-5.6,-3.2,-0.8,1.6,4.0].forEach((z,i)=>{house(OP-7.2,z,Math.PI/2,HC[i%6],2.4+(i%3)*0.5,2.2);house(OP+7.2,z,-Math.PI/2,HC[(i+3)%6],2.6+((i+1)%3)*0.4,2.2)});
 [-8.2,-6.8].forEach((x,i)=>house(OP+x+ (i?0:0),-7.4,0,HC[i+4],2.2,1.6));[6.8,8.2].forEach((x,i)=>house(OP+x,-7.4,0,HC[i+1],2.5,1.6));
 /* çeşme */
 {const g=new THREE.Group(),st=M('#d8cdb6'),dk=M('#b9ab90');put(g,Cy(1.0,1.05,0.35,16),st,0,0.175,0);const w=put(g,Cy(0.9,0.9,0.05,16),M('#5fa3b8',0.15),0,0.33,0);w.castShadow=false;
  put(g,Cy(0.16,0.2,0.9,10),dk,0,0.6,0);put(g,Cy(0.42,0.18,0.14,14),st,0,1.08,0);const w2=put(g,Cy(0.36,0.36,0.03,14),M('#6fb3c8',0.15),0,1.15,0);w2.castShadow=false;put(g,new THREE.SphereGeometry(0.1,8,6),dk,0,1.25,0);
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2;put(g,B(0.12,0.12,0.12),dk,Math.cos(a)*1.0,0.4,Math.sin(a)*1.0)}g.position.set(OP,0,PCZ);S.add(g)}
 /* banklar */
 const bench=(x,z,ry)=>{const g=new THREE.Group();put(g,B(1.1,0.06,0.34),M('#8a5530'),0,0.42,0);put(g,B(1.1,0.3,0.05),M('#7a4a2a'),0,0.62,-0.16);[-0.45,0.45].forEach(q=>put(g,B(0.06,0.42,0.3),M('#3a2a20'),q,0.21,0));g.position.set(x,0,z);g.rotation.y=ry;S.add(g)};
 bench(OP-5.0,1.9,Math.PI/2);bench(OP+5.0,-3.6,-Math.PI/2);
 /* ağaçlar ve saksılar */
 [[-5.4,-1.8],[5.4,-1.8],[-5.4,3.0],[5.4,3.0],[-4.6,-6.0],[4.6,-6.0]].forEach(([x,z])=>plant(OP+x,0,z,1.6));
 /* fenerler, sokak lambaları, kulübe, bisiklet, araba */
 [0.25,0.75,1.25,1.75].forEach(k=>{const a=k*Math.PI;place('post_lantern',{x:OP+Math.sin(a)*1.75,z:PCZ+Math.cos(a)*1.75,h:1.5,ry:a})});
 [[-4.8,-5.6],[4.8,-5.6],[-4.8,3.6],[4.8,3.6]].forEach(([x,z])=>place('street_light',{x:OP+x,z,h:2.8,ry:x<0?Math.PI/2:-Math.PI/2}));
 place('shack',{x:OP-5.2,z:-0.6,h:1.35,ry:Math.PI/2});place('bike',{x:OP+5.0,z:-1.4,h:0.7,ry:-1.2});place('car',{x:OP+5.4,z:2.6,h:0.55,ry:-0.3});
}
for(let i=0;i<42;i++){const x=-3.6+(i%6)*1.4+(Math.floor(i/6)%2)*0.5,z=-3.4+Math.floor(i/6)*1.5;if(Math.hypot(x,z+1)<2.9)continue;add(B(0.55+(i%3)*0.15,0.012,0.42),M(i%2?'#b59f74':'#d1bc92'),OP+x,0.004,z).castShadow=false}
[[-3.5,'#e8d8b8',2.6],[-1.1,'#d9b89a',3.2],[1.3,'#e6cfa8',2.7],[3.6,'#c9d6c0',3]].forEach(([x,c,h])=>{add(B(2.2,h,1.6),M(c),OP+x,h/2,-7.4);const r=add(new THREE.ConeGeometry(1.75,0.9,4),M('#b5533c'),OP+x,h+0.45,-7.4);r.rotation.y=Math.PI/4;
add(B(0.5,0.95,0.05),M('#6e4122'),OP+x-0.4,0.47,-6.58);add(B(0.5,0.5,0.05),glow('#ffe6a8'),OP+x+0.45,h*0.62,-6.58).castShadow=false});
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
const h=new THREE.Mesh(B(2.4,1.8,1.5),HID);h.position.y=0.9;g.add(h);g.position.set(OP-1.3,0,0.25);g.userData.tab='ted';S.add(g);STALLS.push(g)}
[[0,'#3f6fa8'],[1,'#4f7a3a']].forEach(([i,c])=>{const f=figure(0,0,c);S.remove(f);f.scale.setScalar(0.8);f.position.set(0,0,-0.7);STALLS[i].add(f)});
const GL=label('pazar',V(OP-1.25,0.05,3.15),null,true);LBT.gift=GL;GL.el.classList.add('stl');GL.el.onclick=()=>marketTab('gift');
{const g=new THREE.Group();put(g,B(0.7,0.4,0.5),M('#8a5530'),0,0.2,0);put(g,B(0.74,0.16,0.54),M('#a8693a'),0,0.48,0);[-0.22,0.22].forEach(x=>put(g,B(0.08,0.6,0.56),M('#d9a23a',0.4),x,0.3,0));put(g,B(0.1,0.13,0.04),M('#e8c05a',0.3),0,0.38,0.27);
const h=new THREE.Mesh(B(1,1,0.9),HID);h.position.y=0.4;g.add(h);g.position.set(OP-1.25,0,2.8);g.userData.tab='gift';S.add(g);STALLS.push(g);place('chest',{par:g,swap:1,h:0.62})}
/* ---------- dekorcu (dükkân özelleştirme) ---------- */
const DECO={
 tez:{ad:'Tezgâh',o:[{id:'ceviz',ad:'Ceviz',c:['#8a5530','#a8693a'],f:0},{id:'mese',ad:'Açık meşe',c:['#b58a5a','#d4ad78'],f:150},{id:'abanoz',ad:'Abanoz',c:['#3a2a20','#5a4232'],f:220},{id:'yesil',ad:'Yeşil boyalı',c:['#2f6b5a','#c8a060'],f:180},{id:'cini',ad:'Çini kaplama',c:['#8a5530','#e6ddc8'],f:260},{id:'altin',ad:'Altın varaklı',c:['#6a3a1a','#e2b84a'],g:25},{id:'sedef',ad:'Sedef kakmalı',c:['#3a2418','#e8e2d8'],g:30}]},
 raf:{ad:'Depo rafları',o:[{id:'dogal',ad:'Doğal',c:['#8a5a34','#5a3519'],f:0},{id:'mese',ad:'Açık meşe',c:['#c09060','#8a6a40'],f:150},{id:'koyu',ad:'Koyu ceviz',c:['#5a3a22','#3a2414'],f:150},{id:'yesil',ad:'Yeşil boyalı',c:['#3f6f5a','#2f4f40'],f:180},{id:'altin',ad:'Altın yaldızlı',c:['#8a5a2a','#d8a83a'],g:20}]},
 cer:{ad:'Pencere ve kapı',o:[{id:'koyu',ad:'Koyu ahşap',c:['#5a3519',null],f:0},{id:'acik',ad:'Açık ahşap',c:['#a07040','#c8a070'],f:120},{id:'mavi',ad:'Mavi boya',c:['#2c4f7a','#3f6fa8'],f:160},{id:'kirmizi',ad:'Kırmızı boya',c:['#8a2a22','#a3302a'],f:160},{id:'turkuaz',ad:'Turkuaz çini',c:['#1f6f72','#3fb0a8'],g:15}]},
 kapi:{ad:'Kapı',o:[{id:'std',ad:'Ahşap kapı',m:'door',c:['#9a5a2a'],f:0},{id:'mese',ad:'Çivili meşe kapı',b:{hag:0.05},m:'dr_straight',leaf:1,c:['#8a5a2a','#b08040'],f:450},{id:'nane',ad:'Camlı nane kapı',b:{hag:0.08},m:'dr_front',leaf:1,flip:1,c:['#5a8a7a','#a8c8b8'],f:650}]},
 zem:{ad:'Zemin',o:[{id:'tahta',ad:'Ahşap tahta',c:['#7a4a2a','#6c4024'],f:0},{id:'tas',ad:'Taş döşeme',b:{rep:0.08},m:'fl_stone',c:['#8a8a90','#6a6a70'],f:750},{id:'cini',ad:'Damalı çini',b:{rep:0.12},m:'fl_pink',c:['#f0a0b8','#202020'],f:950}]},
 hal:{ad:'Halı',o:[{id:'yuvarlak',ad:'Yuvarlak halı',m:'round_rug',c:['#b86a40'],f:0},{id:'cerceve',ad:'Çerçeveli halı',b:{rep:0.05},m:'rg_jarlan',c:['#9ab0b8','#e8e4dc'],f:250},{id:'kilim',ad:'Renkli kilim',b:{rep:0.07},m:'rg_akim',c:['#c84a6a','#e8c040'],f:350}]},
 ekm:{ad:'Bekleme köşesi',o:[{id:'yok',ad:'Yok',c:['#d8ccb4'],f:0},{id:'sandalye',ad:'Ahşap sandalye',m:'km_chair',c:['#c89060'],f:250,pat:0.1},{id:'salincak',ad:'Sallanan sandalye',m:'km_cabin',c:['#d8a070'],f:600,pat:0.18},{id:'koltuk',ad:'Rahat koltuk',m:'km_couch',c:['#7a9aa8'],g:12,pat:0.3}]},
 mat:{ad:'Kesim matı',o:[{id:'yesil',ad:'Yeşil mat',c:['#3d5a3a','#577a52'],f:0},{id:'mavi',ad:'Mavi mat',b:{cut:0.01},c:['#2f4a6a','#5a7a9a'],f:120},{id:'gri',ad:'Gri mat',b:{cut:0.01},c:['#4a4c50','#74787e'],f:120},{id:'bordo',ad:'Bordo mat',b:{cut:0.01},c:['#6a2a2a','#9a5048'],f:150},{id:'deri',ad:'Deri altlık',b:{cut:0.02},c:['#6a4428','#9a7048'],f:220},{id:'gece',ad:'Gece siyahı, altın çizgili',b:{cut:0.03},c:['#242424','#c8a64a'],g:8},{id:'kece',ad:'Yumuşak keçe altlık',b:{cut:0.03},m:'mt_mouse',c:['#3a3e44','#3a3e44'],f:300},{id:'hasir',ad:'Çerçeveli hasır altlık',b:{cut:0.03},m:'mt_doorPoly',c:['#d8c8a0','#8a6a40'],f:380}]},
 vit:{ad:'Vitrin rafları',o:[{id:'std',ad:'Duvar rafları',c:['#6e4122','#8a5a34'],f:0},{id:'kitap',ad:'Basamaklı kitaplık',b:{vit:0.12},m:'km_books',c:['#8a4a2a'],f:550},{id:'raf',ad:'Modern dikey raf',b:{vit:0.08},m:'km_vshelf',c:['#2a2a2a'],f:450}]},
 mzk:{ad:'Müzik kutusu',o:[{id:'teyp',ad:'Teyp',m:'mz_boom',c:['#c8d0d4','#303840'],f:0},{id:'radyo',ad:'Radyo',b:{tip:0.05},m:'mz_radio',c:['#303030','#c83030'],f:450},{id:'gramo',ad:'Gramofon',b:{tip:0.1},m:'mz_gramo',c:['#c8a040','#6a4a2a'],f:950}]},
 cer2:{ad:'Duvar süsü',o:[{id:'yok',ad:'Yok',c:['#d8ccb4'],f:0},{id:'cerceve',ad:'Resim çerçevesi',c:['#bd5410','#38bdd4'],f:90}]},
 tav:{ad:'Tavan lambası',o:[{id:'sarkit',ad:'Sarkıt lamba',c:['#3b2616','#ffdd99'],f:0},{id:'fener',ad:'Asma fener',b:{cust:0.06},m:'lamp_lantern',c:['#8a8f96','#f2c66a'],f:650},{id:'metal',ad:'Metal tavan lambası',b:{cust:0.1},m:'lamp_ceil',c:['#d8d4cc','#f4f0e6'],f:900}]},
 mlm:{ad:'Masa lambası',o:[{id:'klasik',ad:'Gri masa lambası',m:'light_desk',c:['#6a6a6a','#e8e0c8'],f:0},{id:'mimar',ad:'Lacivert mimar lambası',b:{q:0.02},m:'lamp_desk2',c:['#1f3a6a','#d8d8d8'],f:550},{id:'abajur',ad:'Krem abajur',b:{q:0.03},m:'lamp_round',c:['#f2ead0','#a8c0c4'],f:800}]},
 duv:{ad:'Duvar',o:[{id:'toprak',ad:'Toprak sıva',c:['#9a6a42'],f:0},{id:'krem',ad:'Krem badana',c:['#d8c4a0'],f:120},{id:'gok',ad:'Gök mavisi',c:['#7a9ab0'],f:160},{id:'nar',ad:'Nar kırmızısı',c:['#9a4a3a'],f:160},{id:'lavanta',ad:'Lavanta',c:['#9a88b8'],g:10},{id:'zumrut',ad:'Zümrüt yeşili',c:['#3f7a5a'],g:12}]}};
function decoSel(k){if(typeof PV!=='undefined'&&PV&&PV.k===k)return PV.o;const id=G.deco&&G.deco.sel[k];return DECO[k].o.find(o=>o.id===id)||DECO[k].o[0]}
let ES1=null,ES2=null,ESL=null;
/* dekor artıları: her seçili dekorun b alanı toplanır */
function dB(k){let v=0;try{Object.keys(DECO).forEach(c=>{const o=decoSel(c);if(o&&o.b&&o.b[k])v+=o.b[k]})}catch(e){}return v}
function decoBonTxt(b){const T={cust:'müşteriler %N daha sık gelir',q:'üretim kalitesi +%N',hag:'pazarlıkta %N daha yüksek fiyat',rep:'teslimatta %N şansla +1 itibar',tip:'4★ ve üstünde %N bahşiş',vit:'vitrin ürünleri %N daha çok ilgi görür',cut:'kesim adımları +%N'};return Object.entries(b).map(([k,v])=>T[k].replace('N',Math.round(v*100))).join(' · ')}
/* tavan lambası: dokununca aç/kapa (ışık hafifçe azalır, ampul söner) */
var LAMPON=true;const LMC=new Map();
function lampLook(){const on=LAMPON;const dim=(m)=>{if(!LMC.has(m))LMC.set(m,m.color.clone());const c0=LMC.get(m);m.color.copy(c0);if(!on)m.color.multiplyScalar(0.35)};
 try{dim(bulbL.material)}catch(e){}if(ESL)['tav.fener','tav.metal'].forEach(k=>{const g=ESL[k];if(g)g.traverse(o=>{if(!o.isMesh)return;[].concat(o.material).forEach(m=>{const c0=LMC.get(m)||m.color;const hsl={};c0.getHSL(hsl);if(hsl.l>0.55||/Light|lamp|glass/i.test(m.name||''))dim(m)})})});
 if(lamp.visible)lamp.intensity=1.4*(on?1:0.72)}
function lampToggle(){LAMPON=!LAMPON;if(G.deco)G.deco.lamp=LAMPON?1:0;lampLook();sf('click',0.5)||sfx.tap();save()}
{let lp=null;canvas.addEventListener('pointerdown',e=>{lp=(view==='home'&&G.phase!=='craft'&&!switching)?{x:e.clientX,y:e.clientY,t:performance.now()}:null});
 canvas.addEventListener('pointerup',e=>{if(!lp||Math.hypot(e.clientX-lp.x,e.clientY-lp.y)>8||performance.now()-lp.t>450){lp=null;return}lp=null;setRay(e);const tv=decoSel('tav').id,G0=tv==='sarkit'?CL0:ESL&&ESL['tav.'+tv];if(G0&&ray.intersectObject(G0,true)[0])lampToggle()})}
function decoPat(){try{return decoSel('ekm').pat||0}catch(e){return 0}}const DKIC={};
function decoIcon(o){if(!o.m)return null;if(DKIC[o.m])return DKIC[o.m];if(!GLC[o.m]){glb(o.m,()=>{if(modalMode==='deko')openDeco()});return null}try{DKIC[o.m]=snap(o.leaf?leafOf(o.m):GLC[o.m].scene.clone(true))}catch(e){}return DKIC[o.m]||null}
function decoExtra(){if(!ES1){ES1=new THREE.Group();ES1.visible=false;S.add(ES1);place('drafting_table',{par:ES1,x:2.25,z:-0.7,w:1.05,ry:-Math.PI/2});ES2=new THREE.Group();ES2.visible=false;S.add(ES2);place('picture_frame',{par:ES2,x:2.35,y:1.75,z:-3.66,h:0.42,ry:-Math.PI/2})}ES1.visible=false;ES2.visible=decoSel('cer2').id==='cerceve';
 if(!ESL){ESL={};const mk=(k,n,o)=>{const g=new THREE.Group();g.visible=false;S.add(g);place(n,Object.assign({par:g},o));ESL[k]=g};
  const fl=(k,n,sz)=>{const g=new THREE.Group();ESL[k]=g;g.visible=false;glb(n,()=>{try{const t=fitM(n,{w:sz});const bb=new THREE.Box3().setFromObject(t),dy=0.027-bb.max.y;const G2=new THREE.Group();for(let i=0;i*sz<6-1e-3;i++)for(let j=0;j*sz<9-1e-3;j++){const c=t.clone();c.position.set(-3+sz/2+i*sz,dy,-4.5+sz/2+j*sz);G2.add(c)}G2.traverse(x=>{if(x.isMesh){x.castShadow=false;x.receiveShadow=true}});S.add(G2);try{mergeStatic({scene:G2})}catch(e){}S.remove(G2);g.add(G2);S.add(g);decoExtra()}catch(e){}})};
  mk('ekm.sandalye','km_chair',{x:2.02,z:-0.55,h:0.95,ry:-Math.PI/2});mk('ekm.salincak','km_cabin',{x:1.82,z:-0.55,h:1.0,ry:Math.PI/2});mk('ekm.koltuk','km_couch',{x:2.05,z:-0.55,h:0.85,ry:-Math.PI/2});
  const mm=(k,n,rot)=>{const g=new THREE.Group();g.visible=false;S.add(g);ESL[k]=g;glb(n,()=>{try{const s=GLC[n].scene.clone(true),w=new THREE.Group();s.rotation.y=rot||0;w.add(s);w.updateMatrixWorld(true);let bb=new THREE.Box3().setFromObject(w),z=bb.getSize(V(0,0,0));w.scale.set(1.36/z.x,0.008/z.y,1.0/z.z);w.updateMatrixWorld(true);bb=new THREE.Box3().setFromObject(w);w.position.set(-(bb.min.x+bb.max.x)/2,Y-0.005-bb.min.y,1.66-(bb.min.z+bb.max.z)/2);w.traverse(x=>{if(x.isMesh){x.castShadow=false;x.receiveShadow=true}});g.add(w)}catch(e){}})};
  mm('mat.kece','mt_mouse',Math.PI/2);mm('mat.hasir','mt_doorPoly',Math.PI/2);
  fl('zem.tas','fl_stone',1.0);fl('zem.cini','fl_pink',0.75);
  mk('hal.cerceve','rg_jarlan',{x:-1.45,y:0.03,z:-2.55,w:1.7,ry:Math.PI/2});mk('hal.kilim','rg_akim',{x:-1.45,y:0.03,z:-2.55,w:1.8});
  [-2.25,-1.3,-0.35].forEach((z,j)=>{mk('vit.kitap#'+j,'km_books',{x:2.79,z,h:2.2,ry:-Math.PI/2});mk('vit.kitap#L'+j,'km_books',{x:-2.79,z,h:2.2,ry:Math.PI/2});mk('vit.raf#L'+j,'km_vshelf',{x:-2.82,z,h:2.4,ry:-Math.PI/2,cb:w=>w.traverse(x=>{if(x.isMesh)[].concat(x.material).forEach(m=>m.color.set('#3a3430'))})});mk('vit.raf#'+j,'km_vshelf',{x:2.82,z,h:2.4,ry:Math.PI/2,cb:w=>w.traverse(x=>{if(x.isMesh)[].concat(x.material).forEach(m=>m.color.set('#3a3430'))})})});
  mk('mzk.teyp','mz_boom',{x:-1.0,y:1.085,z:1.08,h:0.2,ry:Math.PI+0.35});mk('mzk.radyo','mz_radio',{x:-1.0,y:1.085,z:1.08,h:0.24,ry:0.35});mk('mzk.gramo','mz_gramo',{x:-1.0,y:1.085,z:1.08,h:0.42,ry:0.35});
  mk('tav.fener','lamp_lantern',{x:0,y:2.5,z:0.6,h:0.75});mk('tav.metal','lamp_ceil',{x:0,y:2.3,z:0.6,h:0.95});
  mk('mlm.mimar','lamp_desk2',{x:1.02,y:1.085,z:1.08,h:0.36,ry:-0.9,cb:w=>w.traverse(x=>{if(x.isMesh)[].concat(x.material).forEach(m=>{if(/Metal/.test(m.name))m.color.set('#2f5a9a')})})});mk('mlm.abajur','lamp_round',{x:1.02,y:1.085,z:1.08,h:0.36,ry:-2.4})}
 const SEL={};['tav','mlm','zem','hal','ekm','mzk','vit','mat'].forEach(k=>SEL[k]=decoSel(k).id);CL0.visible=SEL.tav==='sarkit';DL0.visible=SEL.mlm==='klasik';FLPK.forEach(m=>m.visible=SEL.zem==='tahta');MATG.visible=!decoSel('mat').m;RG0.visible=SEL.hal==='yuvarlak';
 Object.entries(ESL).forEach(([k,g])=>{const [a,b]=k.split('#')[0].split('.');g.visible=SEL[a]===b});doorApply();vitLayout(SEL.vit);LAMPON=!(G.deco&&G.deco.lamp===0);lampLook()}
/* vitrin raf düzeni: ürün yerleri seçilen rafa göre */
var VSC=1.05;let VLAY=null;function vitLayout(id){if(VLAY===id)return;VLAY=id;VSC=id==='std'?1.05:0.72;VBD.forEach(b=>b.visible=id==='std');VBDL.forEach(b=>b.visible=id==='std');if(typeof SHO0!=='undefined')SHO0.visible=id==='std';const Z=[-2.25,-1.3,-0.35],LV={std:null,kitap:[0.91,1.34,1.77],raf:[0.725,1.385,2.057]}[id];
 VSL.forEach((p,i)=>{const k=Math.floor(i/3),j=i%3;if(!LV)p.set(2.7,0.93+k*0.7,-2.3+j*0.85);else p.set(id==='kitap'?2.79:2.82,LV[k]+0.01,Z[j])});
 LSI.forEach(([g,k,j])=>{g.scale.setScalar(id==='std'?0.85:0.62);if(!LV)g.position.set(-2.7,0.93+k*0.7,-2.3+j*0.85);else g.position.set(id==='kitap'?-2.79:-2.82,LV[k]+0.01,Z[j])});try{VL.forEach((l,i)=>l.pos.set(VSL[i].x,VSL[i].y-0.03,VSL[i].z));vitrinSync()}catch(e){}}
function leafOf(n){const s=GLC[n].scene.clone(true),rm=[];s.traverse(x=>{if(x.isMesh&&[].concat(x.material).some(m=>/Stone|carpet/i.test(m.name||'')))rm.push(x)});rm.forEach(x=>x.parent&&x.parent.remove(x));return s}
function doorApply(){if(!DOORH)return;const o=decoSel('kapi');if(DOORH.userData.kd===o.id)return;if(!DOORH.userData.d0)DOORH.userData.d0=DOORH.children[0];
 if(o.leaf&&!GLC[o.m]){glb(o.m,()=>doorApply());return}DOORH.children.slice().forEach(c=>DOORH.remove(c));
 if(!o.leaf)DOORH.add(DOORH.userData.d0);else{const d=leafOf(o.m);d.rotation.set(0,0,0);d.position.set(0,0,0);d.scale.set(1,1,1);if(o.flip)d.rotation.y=Math.PI;const w=new THREE.Group();w.add(d);let b=fitModel(w,2.3);const bw=b.max.x-b.min.x;if(bw>1.22){w.scale.multiplyScalar(1.22/bw);b=new THREE.Box3().setFromObject(w)}w.position.set(-b.min.x,-b.min.y,-(b.min.z+b.max.z)/2);w.traverse(x=>{if(x.isMesh)x.castShadow=true});DOORH.add(w)}DOORH.userData.kd=o.id}
function decoApply(){try{decoExtra()}catch(e){}const t=decoSel('tez'),r=decoSel('raf'),c=decoSel('cer'),d=decoSel('duv');CTB.color.set(t.c[0]);CTT.color.set(t.c[1]);RFA.color.set(r.c[0]);RFB.color.set(r.c[1]);beam.color.set(c.c[0]);{const mt=decoSel('mat');MATB.color.set(mt.c[0]);MATL.color.set(mt.c[1])}wallM.color.set(d.c[0]);
if(DOORH&&!decoSel('kapi').leaf){DOORH.traverse(o=>{if(o.isMesh){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if(!m.userData.c0)m.userData.c0=m.color.clone();m.color.copy(m.userData.c0);if(c.c[1])m.color.lerp(new THREE.Color(c.c[1]),0.75)})}});DOORH.userData.dk=c.id}}
function openDeco(){if(!G.deco)G.deco={own:{},sel:{}};let h=BKH+'Dekorcu</h3><p>Dükkânını kendine göre düzenle. Aldığın görünümler senin olur, istediğin an geri dönebilirsin. Denemek için renklere dokun.</p>';
 Object.entries(DECO).forEach(([k,cat])=>{h+=`<div class="grp">${cat.ad}</div>`;cat.o.forEach(o=>{const own=(!o.f&&!o.g)||G.deco.own[k+'.'+o.id],sel=decoSel(k).id===o.id;
  h+=`<div class="row"><div class="ic"${sel?'':` data-pv="${k}.${o.id}"`} style="display:flex;gap:2px;align-items:center;justify-content:center;${sel?'':'cursor:pointer'}">${(()=>{const di=decoIcon(o);return di?`<img src="${di}" alt="" style="width:100%;height:100%">`:o.c.filter(Boolean).map(x=>`<i style="display:block;width:16px;height:30px;border-radius:5px;background:${x};border:1.5px solid var(--ln)"></i>`).join('')})()}</div><div class="n">${o.ad}<small>${own?'Senin':o.g?'<b class="gemc">'+o.g+' 💎</b> · özel':o.f+' altın'}${o.pat?' · müşteriler %'+Math.round(o.pat*100)+' daha sabırlı':''}${o.b?' · '+decoBonTxt(o.b):''}</small></div>${sel?'<b>Seçili</b>':`<button class="btn ${own?'l':'g'}" data-dk="${k}.${o.id}">${own?'Seç':'Satın al'}</button>`}</div>`})});
 h+=skRows();openSheet('deko',h+closeBtn);skWire();ui.sheet.querySelectorAll('[data-pv]').forEach(b=>b.onclick=()=>{const [k,id]=b.dataset.pv.split('.');pvStart(k,id)});wire();$('mBack').onclick=()=>{sfx.tap();mTab='hub';renderMarket()};ui.sheet.querySelectorAll('[data-dk]').forEach(b=>b.onclick=()=>{const [k,id]=b.dataset.dk.split('.'),o=DECO[k].o.find(x=>x.id===id),own=(!o.f&&!o.g)||G.deco.own[k+'.'+id];
  if(!own&&o.g){if((G.elmas||0)<o.g){toast(`${o.g} 💎 gerekli`,1300);return}if(!armBuy('d'+k+id,`${o.ad} alınsın mı? ${o.g} 💎`))return;G.elmas-=o.g;G.deco.own[k+'.'+id]=1;buyArm=null;sfx.fan&&sfx.fan();hud()}
  else if(!own){if(G.gold<o.f){toast(`${o.f} altın gerekli`,1300);return}if(!armBuy('d'+k+id,`${o.ad} alınsın mı? ${o.f} altın`))return;G.gold-=o.f;G.deco.own[k+'.'+id]=1;buyArm=null;sfx.coin()}else sfx.tap();
  G.deco.sel[k]=id;decoApply();save();refresh();openDeco();toast(k==='raf'?'Depo rafları değişti':k==='tez'?'Tezgâh yenilendi':'Dükkân yenilendi',1200)})}
{const g=new THREE.Group();put(g,B(1.4,0.75,0.7),M('#7a4a2a'),0,0.375,0);put(g,B(1.5,0.06,0.8),M('#a8693a'),0,0.78,0);[[-0.68,-0.35],[0.68,-0.35]].forEach(q=>put(g,B(0.06,1.9,0.06),M('#5a3519'),q[0],0.95,q[1]));
 for(let i=0;i<6;i++){const a=put(g,B(0.25,0.04,1.0),M(i%2?'#f0e2c4':'#3f6fa8'),-0.62+i*0.25,1.9,0.0);a.rotation.x=0.25}
 [['#8a5530',-0.45],['#2f6b5a',0],['#9a4a3a',0.45]].forEach(([c,x])=>put(g,B(0.3,0.2,0.25),M(c),x,0.91,0));
 const h=new THREE.Mesh(B(1.8,2,1.3),HID);h.position.y=1;g.add(h);g.position.set(OP+1.3,0,2.7);g.userData.tab='deko';S.add(g);STALLS.push(g);place('stand2',{par:g,swap:1,w:1.45});
 const l=label('pazar',V(OP+1.3,0.05,3.25),null,true);l.el.innerHTML='Dekorcu<small>Dükkân görünümü</small>';LBT.deko=l;l.el.classList.add('stl');l.el.onclick=()=>marketTab('deko')}
const today=()=>new Date().toDateString();
function giftTick(){const [t,av]=chLabel();if(t!==GL.last){GL.el.innerHTML=t;GL.last=t;GL.el.classList.toggle('rdy',av)}}
function claimDaily(){const td=today();if(G.daily===td){toast('Bugünkü hediyeni aldın<br>Yarın yine gel!',1600);return}
const y=new Date(Date.now()-864e5).toDateString();G.streak=G.daily===y?Math.min(7,(G.streak||0)+1):1;G.daily=td;const gold=20+G.streak*10,ks=['hamderi','pamuk','kaucuk','kurum','ceviz','yun','recine','tohum_pamuk','tohum_papatya'],got={};
for(let i=0;i<3;i++){const k=pick(ks);got[k]=(got[k]||0)+1;G.inv[k]++}G.gold+=gold;const gem=G.streak>=7?2:Math.random()<0.2?1:0;if(G.streak>=7)chK().z++;if(gem){G.elmas=(G.elmas||0)+gem;hud()}sfx.fan();save();refresh();
openSheet('gift',`${BKH}Günlük hediye</h3><p>${G.streak}. gün · Her gün gelirsen ödül büyür (en çok 7 gün)</p><div class="row"><div class="n"><b>+${gold} altın</b></div></div>${gem?`<div class="row"><div class="n"><b>+${gem} 💎 elmas</b><small>${G.streak>=7?'7 gün üst üste geldin! Zümrüt sandık anahtarı da senin':'Şanslı günündesin'}</small></div></div>`:''}`+Object.entries(got).map(([k,n])=>`<div class="row"><img class="ic" src="${ICON[k]}" alt=""><div class="n">${MATS[k].ad}</div><b>+${n}</b></div>`).join('')+closeBtn);wire();$('mBack').onclick=()=>{sfx.tap();openChests()}}
/* ---------- arka sıra: Takas, Bit pazarı, Mezat dükkânları ---------- */
const ZB=-5.1;[['takas','stalls',-1.35,'Takas','Mal karşılığı mal',{w:2.3,ry:0,ly:1.7}],['bit','m_eskici',1.35,'Bit pazarı','2. el · tamir',{w:1.5,z:5.35}],['mezat','building',1.35,'Mezat','Açık artırma',{w:2.0,ly:2.3}]].forEach(([tab,m,x,ad,sub,o])=>{
 const g=new THREE.Group();const zz=o.z?ZB+o.z:ZB;delete o.z;g.position.set(OP+x,0,zz);S.add(g);const h=new THREE.Mesh(B(1.8,2.4,1.5),HID);h.position.y=1.2;g.add(h);g.userData.tab=tab;STALLS.push(g);
 put(g,B(1.6,0.9,0.9),M('#8a5530'),0,0.45,0);place(m,Object.assign({par:g,swap:1},o));
 const ly=o.ly;delete o.ly;const l=label('pazar',ly?V(OP+x,ly,zz):V(OP+x,0.05,zz+0.6),null,!ly);l.el.innerHTML=`${ad}<small>${sub}</small>`;LBT[tab]=l;l.el.classList.add('stl');l.el.onclick=()=>marketTab(tab)});
function marketTab(t){if(G.phase==='craft'||G.phase==='result'||switching)return;if(t==='gift'){openChests();return}if(t==='deko'){if(fOff('dekor'))return;openDeco();return}if(fOff(t))return;mTab=t;renderMarket()}
[[-1.2,-2.1,'Pazar tezgâhı','Günlük mallar','pazar',0.5],[1.2,-2.1,'Tohumcu','Tohumlar','tohum',0.5],[-1.3,0.25,'Tedarikçi','Toplu sipariş','ted',0.6]].forEach(q=>{const l=label('pazar',V(OP+q[0],0.05,q[1]+q[5]),null,true);l.el.innerHTML=`${q[2]}<small>${q[3]}</small>`;LBT[q[4]]=l;l.el.classList.add('stl');l.el.onclick=()=>marketTab(q[4])});

/* aktif dükkânlar çeşmenin etrafında daire */
{const RA={mezat:1,bit:0.75,tohum:0.5,deko:0.25,gift:0,ted:-0.25,pazar:-0.5,takas:-0.75},RX=3.7,RZ=3.3;
 STALLS.forEach(g=>{const t=g.userData.tab;if(RA[t]==null)return;const a=RA[t]*Math.PI,x=OP+Math.sin(a)*RX,z=PCZ+Math.cos(a)*RZ;g.position.set(x,0,z);g.rotation.y=a+Math.PI;
  const l=LBT[t];if(l){const up=l.pos.y>0.5;l.pos.set(x,up?l.pos.y:0.05,up?z:z+0.85)}})
 const ring=add(new THREE.RingGeometry(1.25,2.55,40),M('#d8c6a0'),OP,0.02,PCZ);ring.rotation.x=-Math.PI/2;ring.castShadow=false;
 [[-5.9,-4.6,0],[5.9,-4.6,0],[-5.9,0.8,0],[5.9,0.8,0]].forEach(([x,z,r])=>place('hedge',{x:OP+x,z,w:1.6,ry:Math.PI/2}));
 [[-6.0,-2.0],[6.0,-1.9],[-6.0,3.2],[6.0,3.0],[-3.2,-6.2],[3.3,-6.2],[-2.3,3.5],[2.4,3.4]].forEach(([x,z],i)=>place('bush',{x:OP+x,z,w:0.75+(i%3)*0.15,ry:i*1.7}));
 /* güney kenarı: alçak taş duvar, çitler, ağaçlar, evler (sahne bütünlüğü) */
 [[-4.6,3.2],[4.6,3.2]].forEach(([x,w])=>{add(B(w,0.42,0.32),M('#cbb994'),OP+x,0.21,5.3);add(B(w+0.06,0.06,0.38),M('#b9a57c'),OP+x,0.45,5.3)});
 [-5.6,-3.6,3.6,5.6].forEach((x,i)=>place('hedge',{x:OP+x,z:5.9,w:1.7,ry:Math.PI/2}));
 [[-6.6,6.2],[6.6,6.4],[-1.7,6.4],[1.7,6.3]].forEach(([x,z],i)=>plant(OP+x,0,z,1.5));
 [-6.2,-3.8,-1.4,1.4,3.8,6.2].forEach((x,i)=>HOUSE(OP+x,8.6,Math.PI,HCOL[(i+2)%6],2.3+(i%3)*0.4,2.2));
}
/* ---------- depo ---------- */
for(let i=0;i<10;i++)add(B(0.66,0.05,9),M(i%2?'#6a4428':'#5e3b22'),OD-3+i*0.66,0,0);
add(B(40,0.05,40),M('#4a3424'),OD,-0.04,0).castShadow=false;
add(B(6.6,7.6,0.15),M('#7a5636'),OD,3.8,-3.25);add(B(0.15,7.6,9),M('#6e4a30'),OD-3.2,3.8,0);add(B(0.15,7.6,9),M('#6e4a30'),OD+3.2,3.8,0);add(B(6.5,0.22,0.3),M('#4e321e'),OD,4.4,-3.1);[-2.4,2.4].forEach(x=>add(B(0.2,0.2,6.2),M('#4e321e'),OD+x,4.5,-0.1));
const GORD=['Ham madde','İşlenmiş','Yardımcı','Tohum'],DEP=[],DROW=[2.95,2.35,1.75,1.15,0.55],DCX=[-1.12,-0.56,0,0.56,1.12];
const RFA=M('#8a5a34'),RFB=M('#5a3519');const RFM=[];[3.45,2.83,2.21,1.59,0.97,0.35].forEach(y=>RFM.push(add(B(4.0,0.06,0.55),RFA,OD,y-0.03,-2.9)));[-2.0,2.0].forEach(x=>RFM.push(add(B(0.1,3.9,0.55),RFB,OD+x,1.95,-2.9)));
RFM.forEach(m=>m.visible=false);DROW.forEach(y=>place('wall_shelf',{x:OD,y:y-0.3,z:-2.88,w:5.9,cb:w=>{w.rotation.y=Math.PI/2;w.scale.x=0.27;w.scale.y=0.5;w.position.y=y-0.5*0.456*5.9/2.3;w.traverse(o=>{if(o.isMesh)o.material=/Top/.test(o.material.name)?RFA:RFB})}}));
place('lounge_chair',{x:OD-2.45,z:-0.45,h:0.75,ry:-2.0});place('box_a',{x:OD+2.5,z:0.2,h:0.5,ry:0.4});place('box_a',{x:OD+2.75,z:-0.35,h:0.4,ry:-0.3});place('trash_can',{x:OD+2.6,z:-1.55,h:0.55});
Object.keys(MATS).sort((a,b)=>GORD.indexOf(MATS[a].g)-GORD.indexOf(MATS[b].g)).forEach((k,i)=>{const [x,y]=slotXY(i%40),o=MATS[k].mk();o.scale.setScalar(1.4);o.position.set(x,y,-2.9);o.visible=false;S.add(o);
const l=label('depo',V(x,y+0.02,-2.62),'',true);l.el.classList.add('dn');l.off=true;const hb=new THREE.Mesh(new THREE.SphereGeometry(0.19,6,5),HID);hb.position.y=0.08;o.add(hb);const dd={k,o,l,n:-1};DEP.push(dd)});
place('round_rug',{x:OD,y:0.03,z:0.4,w:2.4});place('wall_art',{x:-0.12,y:1.3,z:-3.9,h:0.95,ry:Math.PI});const DHIT=new THREE.Mesh(B(6.2,3.0,0.7),HID);DHIT.position.set(OD,1.75,-2.9);S.add(DHIT);

/* ---------- depo/vitrin kapasite ve düzen ---------- */
const CAPS={d:{ad:'Malzeme deposu',v:[100,150,250,400],c:[150,300,600]},s:{ad:'Depo ürün rafı',v:[2,4,6],c:[100,250]},v:{ad:'Vitrin',v:[3,6,9],c:[150,300]}};
function capLv(k){if(!G.cap)G.cap={d:0,s:0,v:0};return G.cap[k]||0}
const OWNER_H='4be73331840233a38bc7128e8f5f66203778469ca1f25f3d2a46de116ba045fc';const capOf=k=>G.owner?99999:CAPS[k].v[capLv(k)],invTotal=()=>Object.values(G.inv).reduce((a,b)=>a+(b>0?b:0),0);
function depoFull(n){if(invTotal()+(n||1)>capOf('d')){toast(`Depo dolu (${invTotal()}/${capOf('d')})<br>Depoda genişlet ya da malzeme kullan`,1900);sfx.bad&&sfx.bad();return true}return false}
const vitCap=()=>capOf('v'),stoCap=()=>capOf('s');
function capUp(k){const L=capLv(k),c=CAPS[k].c[L];if(c==null||G.gold<c)return;G.gold-=c;G.cap[k]=L+1;sfx.coin();sfx.fan();toast(`${CAPS[k].ad}: ${capOf(k)}`,1300);save();refresh();vitrinSync();storeSync();openDepo()}
function toStore(it){if((G.store||[]).length>=stoCap()){toast('Depo ürün rafı dolu',1300);return false}G.store=G.store||[];G.stock=G.stock.filter(x=>x!==it);G.store.push(it);vitrinSync();storeSync();save();refresh();return true}
function toVit(it){if(it&&it.worn){toast('Önce tamir et',1300);return false}if(G.stock.length>=vitCap()){toast('Vitrin dolu',1300);return false}G.store=G.store.filter(x=>x!==it);G.stock.push(it);vitrinSync();storeSync();save();refresh();return true}
const DSTO=new THREE.Group();S.add(DSTO);
function storeSync(){DSTO.clear();(G.store||[]).slice(0,10).forEach((it,i)=>{const p=pr(it),m=p.build(it.col?paintOf(it.col).hex:p.sheet,it.style,{cila:true});m.g.scale.setScalar(0.6);const [sx]=slotXY(i);m.g.position.set(sx,DROW[4]+0.01,-2.85);m.g.rotation.y=0.4;m.g.userData.sid=it.id;DSTO.add(m.g)})}
let DRG=null,DRGJ=false;const DPL=new THREE.Plane(new THREE.Vector3(0,0,1),2.75),DPT=new THREE.Vector3();
function slotXY(i){const c=i%10;return [OD+(c-4.5)*0.57,DROW[Math.floor(i/10)]]}
function depoTap(){if(DRGJ){DRGJ=false;return}
 const hs=ray.intersectObjects(DSTO.children,true)[0];if(hs){let o=hs.object;while(o&&o.userData.sid==null)o=o.parent;const it=o&&(G.store||[]).find(x=>x.id===o.userData.sid);if(it)storeItem(it);return}
 if(ray.intersectObject(DHIT)[0])openDepo()}
function storeItem(it){openSheet('item',`<h3>${pr(it).ad}</h3><p>${desc(it)} · ${'★'.repeat(it.stars)} · Depoda</p><div class="pk"><button class="btn g" id="tvB">Vitrine koy</button></div>`+closeBtn);wire();$('tvB').onclick=()=>{if(toVit(it)){closeSheet();toast('Vitrine kondu',1100)}}}
addEventListener('pointerdown',e=>{if(view!=='depo'||switching||e.target!==canvas||G.phase==='craft')return;setRay(e);const vis=DEP.filter(d=>d.o.visible).map(d=>d.o),h=ray.intersectObjects(vis,true)[0];if(!h)return;let o=h.object;while(o&&!vis.includes(o))o=o.parent;const d=DEP.find(x=>x.o===o);if(!d)return;
 e.stopImmediatePropagation();DRG={d,id:e.pointerId,x0:e.clientX,y0:e.clientY,mv:false};DRGJ=true;d.l.el.classList.add('rdy');sfx.tap()},true);
addEventListener('pointermove',e=>{if(!DRG||e.pointerId!==DRG.id)return;e.stopImmediatePropagation();if(Math.hypot(e.clientX-DRG.x0,e.clientY-DRG.y0)>6)DRG.mv=true;setRay(e);if(ray.ray.intersectPlane(DPL,DPT)){const o=DRG.d.o;o.position.set(clamp(DPT.x,OD-1.9,OD+1.9),clamp(DPT.y-0.1,0.3,3.5),-2.72);DRG.d.l.pos.set(o.position.x,o.position.y+0.02,-2.5)}},true);
function dragEnd(e){if(!DRG||(e&&e.pointerId!==DRG.id))return;e&&e.stopImmediatePropagation();const d=DRG.d;d.l.el.classList.remove('rdy');const mv=DRG.mv;DRG=null;setTimeout(()=>DRGJ=false,50);
 if(!mv){toast('Malzemeyi tutup istediğin rafa sürükle',1400);depoSync(true);return}
 const px=d.o.position.x,py=d.o.position.y;let bi=0,bd=1e9;for(let i=0;i<40;i++){const [x,y]=slotXY(i),dd=Math.hypot(x-px,(y-py)*1.2);if(dd<bd){bd=dd;bi=i}}
 const SL=G.dSlot||(G.dSlot={}),old=SL[d.k],other=Object.keys(SL).find(k=>SL[k]===bi&&k!==d.k);if(other!=null)SL[other]=old;SL[d.k]=bi;sfx.drop();depoSync(true);save()}
addEventListener('pointerup',dragEnd,true);addEventListener('pointercancel',dragEnd,true);
function depoSync(force){let ch=!!force;DEP.forEach(d=>{const n=G.inv[d.k];if(n!==d.n){d.n=n;ch=true;d.l.el.innerHTML=`${MATS[d.k].ad} <b>${n}</b>`}});if(!ch)return;if(!G.dSlot)G.dSlot={};const SL=G.dSlot,used={};DEP.forEach(d=>{if(d.n>0&&SL[d.k]!=null&&!used[SL[d.k]]&&SL[d.k]<40)used[SL[d.k]]=d.k;else if(!(d.n>0))delete SL[d.k];else delete SL[d.k]});DEP.forEach(d=>{if(d.n>0&&SL[d.k]==null){for(let i=0;i<40;i++)if(!used[i]){used[i]=d.k;SL[d.k]=i;break}}});let j=0;DEP.forEach(d=>{const on=d.n>0&&SL[d.k]!=null;j=on?SL[d.k]:0;d.o.visible=on;d.l.off=!on;if(on){const [x,y]=slotXY(j);d.o.position.set(x,y,-2.9);d.l.pos.set(x,y+0.02,-2.62);j++}})}
