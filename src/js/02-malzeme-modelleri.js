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
