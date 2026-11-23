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
{id:'baglama',ust:1,hard:true,ad:'Bağlama',tier:5,base:900,need:{kereste:3,iplik:2,boynuz:1},sheet:'#b07a48',wood:true,shape:lutShape,build:baglamaModel,
 steps:[T('Tekne dilimlerini kes'),{t:'chisel',ad:'Tekneyi içten oy',c:[0,0.02],r:[0.12,0.15]},Y('yapistir','Dilimleri tutkalla',{pts:[[-0.12,-0.1],[0.12,-0.1],[-0.15,0.05],[0.15,0.05],[0,0.2]]}),Hd('Tekneyi kalıpta sıkıştır'),{t:'plane',ad:'Tekneyi rendele',n:5},Rb('zimpara','Tekneyi zımparala'),
  T('Göğüs kapağını kes',{part:'kapak',n:1,shape:()=>ellShape(0.15,0.19),at:[-0.45,0],col:'#d9b98a',wood:true}),A('kapak','Kapağı tekneye oturt',[[0,0.02]]),Y('yapistir','Kapak kenarını yapıştır',{n:8,sc:0.85}),{t:'drill',ad:'Ses deliğini aç',pts:[[0,-0.06]]},
  T('Sapı kes',{part:'sap',n:1,shape:rr(0.05,0.4),at:[-0.45,0],col:'#7a4524',wood:true}),A('sap','Sapı gövdeye tak',[[0,-0.42]]),{t:'drill',ad:'Burgu deliklerini aç',pts:[[-0.03,-0.56],[0.03,-0.56],[-0.03,-0.6],[0.03,-0.6]]},
  Y('dik','Perdeleri bağla',{pts:[[0,-0.26],[0,-0.3],[0,-0.34],[0,-0.38],[0,-0.42],[0,-0.46],[0,-0.5]]}),{t:'lace',ad:'Telleri geçir',pts:[[-0.012,0.15],[-0.012,-0.58],[0.012,0.15],[0.012,-0.58]]},Rb('cila','Cila çek'),Rb('parlat','Son parlatma'),{t:'akort',ad:'Telleri akort et'},D]},
{id:'sandik',ust:1,hard:true,ad:'Sedef kakma sandık',tier:5,base:1200,need:{kereste:3,sedef:2,tutkal:1,balmumu:1},sheet:'#8a5530',wood:true,shape:()=>rrect(0.5,0.34,0.02),build:sandikModel,
 steps:[T('Taban tahtasını kes'),{t:'plane',ad:'Tahtaları rendele',n:5},T('Yan tahtaları kes',{part:'yan',n:4,shape:i=>i<2?rrect(0.5,0.04,0.008):rrect(0.04,0.3,0.008),at:[-0.45,0],col:'#8a5530',wood:true}),A('yan','Yanları kutuya diz',[[0,-0.15],[0,0.15],[-0.23,0],[0.23,0]]),
  Y('yapistir','Köşeleri tutkalla',{pts:[[-0.23,-0.15],[0.23,-0.15],[-0.23,0.15],[0.23,0.15]]}),{t:'drill',ad:'Kavela deliklerini del',pts:[[-0.23,-0.15],[0.23,-0.15],[-0.23,0.15],[0.23,0.15]]},{t:'hammer',kind:'nail',hits:1,ad:'Kavelaları çak',pts:[[-0.23,-0.15],[0.23,-0.15],[-0.23,0.15],[0.23,0.15]]},Hd('Kutuyu mengenede sık'),
  {t:'chisel',ad:'Kakma alanını oy',c:[0,0],r:[0.2,0.09]},{t:'kakma',ad:'Sedefleri yuvalara kak'},
  Y('yapistir','Sedef kenarlarını tutkalla',{pts:[[0,0],[-0.1,-0.05],[0.1,-0.05],[-0.1,0.05],[0.1,0.05],[-0.18,0],[0.18,0]]}),Rb('zimpara','Yüzeyi zımparala'),{t:'screw',ad:'Menteşeleri vidala',pts:[[-0.14,-0.15],[0.14,-0.15]]},Rb('cila','Balmumu cila sür'),Rb('parlat','Sedefleri parlat'),D]}
);}
