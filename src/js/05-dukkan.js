/* ---------- dükkân ---------- */
const FLPK=[];for(let i=0;i<9;i++)FLPK.push(add(B(0.66,0.05,9),M(i%2?'#7a4a2a':'#6c4024'),-2.64+i*0.66,0,0));
const wallM=M('#9a6a42'),beam=M('#5a3519');
add(B(6,3.4,0.15),wallM,0,1.7,-4);add(B(0.15,3.4,9),wallM,-3,1.7,0);add(B(0.15,3.4,9),wallM,3,1.7,0);
const winM=glow('#ffe6a8');add(B(1.6,1.2,0.05),winM,1.2,2,-3.9).castShadow=false;
[[1.8,0.1,0.15,1.2,2.65],[1.8,0.1,0.15,1.2,1.35],[0.08,1.2,0.12,1.2,2],[1.6,0.08,0.12,1.2,2]].forEach(b=>add(B(b[0],b[1],b[2]),beam,b[3],b[4],-3.88));
const doorM=glow('#f6d38a'),opM=glow('#2f6b5a');add(B(1.2,2.3,0.05),doorM,-1.4,1.15,-3.9).castShadow=false;add(B(0.46,0.2,0.03),opM,-1.4,1.75,-3.84).castShadow=false;
add(B(1.4,0.12,0.18),beam,-1.4,2.36,-3.88);add(B(0.12,2.36,0.18),beam,-2.06,1.18,-3.88);add(B(0.12,2.36,0.18),beam,-0.74,1.18,-3.88);
const shaft=new THREE.Mesh(new THREE.CylinderGeometry(0.7,1.3,5,4,1,true),new THREE.MeshBasicMaterial({color:'#ffd68a',transparent:true,opacity:0.07,depthWrite:false,blending:THREE.AdditiveBlending}));
shaft.position.set(0.6,1.4,-1.6);shaft.rotation.set(1.1,0.785,0);S.add(shaft);
const shelfItems=[()=>shoeModel('#6e3d1f','Bağcıklı'),()=>cuzdanModel('#a3302a'),()=>cantaModel('#2c3e6b','Kısa sap'),()=>kemerModel('#262220'),()=>atkiModel('#a3302a'),()=>shoeModel('#262220','Tokalı')];
const VBD=[],VBDL=[],LSI=[];[-2.7,2.7].forEach((x,si)=>{for(let k=0;k<3;k++){const bd=add(B(0.45,0.06,2.6),M('#6e4122'),x,0.9+k*0.7,-1.4);(x>0?VBD:VBDL).push(bd);
if(x>0)continue;for(let j=0;j<3;j++){const it=shelfItems[(j+k+si*2)%shelfItems.length]();it.g.scale.setScalar(0.85);it.g.position.set(x,0.93+k*0.7,-2.3+j*0.85);it.g.rotation.y=x<0?-1.2:1.2;S.add(it.g);LSI.push([it.g,k,j])}}});

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
const r1=add(new THREE.PlaneGeometry(2.3,1.45),rugM,-0.35,0.03,-1.5);r1.rotation.x=-Math.PI/2;r1.castShadow=false;r1.visible=false;
const ciniM=new THREE.MeshStandardMaterial({map:canTex(512,64,cini),roughness:0.4});
const AWN=new THREE.Group();
function plant(x,y,z,k){put(S,Cy(0.14*k,0.1*k,0.2*k,8),M('#b06a3a'),x,y,z);for(let i=0;i<6;i++){const a=i/6*Math.PI*2,l=put(S,new THREE.ConeGeometry(0.06*k,0.38*k,4),M(i%2?'#4f7a3a':'#5f8a44'),x+Math.cos(a)*0.1*k,y+0.2*k,z+Math.sin(a)*0.1*k);l.rotation.z=Math.cos(a)*0.6;l.rotation.x=-Math.sin(a)*0.6}}
place('plant_white',{x:-0.35,z:-3.45,h:1.0});place('flower_pot2',{x:2.15,z:-3.4,h:0.75,ry:1});const RG0=new THREE.Group();S.add(RG0);place('round_rug',{par:RG0,x:-1.45,y:0.03,z:-2.55,w:1.3});

const DL0=new THREE.Group();S.add(DL0);place('pair_of_shoes',{x:-2.7,y:2.33,z:-1.45,w:0.42,ry:-1.3});place('light_desk',{par:DL0,x:1.85,y:1.085,z:1.3,h:0.5,ry:-2.4});
const Y=1.085,BC=V(0,Y,1.66);
const CTB=M('#8a5530'),CTT=M('#a8693a');add(B(4.2,1.0,1.3),CTB,0,0.5,1.7);add(B(4.4,0.08,1.42),CTT,0,1.04,1.7);
for(let i=0;i<3;i++)add(B(4.2,0.04,0.02),beam,0,0.25+i*0.28,2.36);
const MATB=M('#3d5a3a'),MATL=M('#577a52'),MATG=new THREE.Group();S.add(MATG);MATG.add(add(B(1.36,0.006,1.0),MATB,0,Y-0.002,1.66));
for(let i=0;i<7;i++)MATG.add(add(B(0.004,0.008,1.0),MATL,-0.6+i*0.2,Y-0.001,1.66));
for(let i=0;i<5;i++)MATG.add(add(B(1.36,0.008,0.004),MATL,0,Y-0.001,1.26+i*0.2));

add(B(0.05,0.02,0.32),M('#c0c4c8'),0.9,Y+0.01,1.25).rotation.y=0.5;
{const bz=1.08;[['#a3302a',-0.6],['#2c3e6b',-0.47],['#c9982a',-0.34]].forEach(([h,x])=>{const o=pot(h);o.scale.setScalar(0.75);o.position.set(x,Y,bz);S.add(o)});
const br=new THREE.Group();put(br,Cy(0.009,0.011,0.2,6),M('#a0703c'),0,0,0);put(br,Cy(0.012,0.012,0.04,6),M('#b8bcc0',0.4),0,0.115,0);put(br,new THREE.ConeGeometry(0.014,0.06,6),M('#3a2a1e'),0,0.165,0);br.rotation.z=Math.PI/2;br.rotation.y=0.3;br.position.set(-0.13,Y+0.014,bz);S.add(br);
const sc=new THREE.Group();[0.35,-0.35].forEach(a=>{const b=put(sc,B(0.022,0.006,0.2),M('#c8ccd0',0.3),0,0,0);b.rotation.y=a;const t=put(sc,new THREE.TorusGeometry(0.028,0.008,5,12),M('#b5533c'),Math.sin(a)*0.12,0,Math.cos(a)*0.12);t.rotation.x=Math.PI/2});sc.position.set(0.14,Y+0.01,bz+0.01);sc.rotation.y=1.25;S.add(sc);place('scissors2',{par:sc,swap:1,w:0.21,rx:Math.PI/2,y:0});
const sp=MATS.iplik.mk();sp.scale.setScalar(0.7);sp.position.set(0.38,Y,bz);S.add(sp);
add(new THREE.SphereGeometry(0.045,8,6),M('#b5533c'),0.54,Y+0.02,bz).scale.y=0.6;[[0.52,0.25],[0.56,-0.25]].forEach(q=>{const n=add(Cy(0.003,0.003,0.07,4),M('#d0d4d8',0.3),q[0],Y+0.06,bz);n.rotation.z=q[1]});
add(B(0.5,0.008,0.045),M('#e3c98a'),-0.36,Y+0.004,2.26);for(let i=0;i<10;i++)add(B(0.004,0.002,0.02),M('#4a3423'),-0.585+i*0.05,Y+0.009,2.25);
const ml=new THREE.Group();put(ml,Cy(0.04,0.04,0.1,8),M('#8a5530'),0,0,0).rotation.z=Math.PI/2;put(ml,Cy(0.011,0.011,0.18,6),M('#5a3519'),0,0,0.11).rotation.x=Math.PI/2;ml.position.set(0.4,Y+0.04,2.25);ml.rotation.y=0.6;S.add(ml);place('m_hammer',{par:ml,swap:1,w:0.3,y:-0.035})}
const cordL=add(new THREE.CylinderGeometry(0.01,0.01,0.6,4),M('#222'),0,2.95,0.6);
const shadeL=add(new THREE.ConeGeometry(0.3,0.25,8,1,true),M('#3b2616'),0,2.55,0.6);shadeL.material.side=THREE.DoubleSide;
const bulbL=add(new THREE.SphereGeometry(0.08,8,6),glow('#ffdd99'),0,2.45,0.6);bulbL.castShadow=false;
const CL0=new THREE.Group();S.add(CL0);[cordL,shadeL,bulbL].forEach(m=>CL0.add(m));
const DN=80,pg=new THREE.BufferGeometry(),pp=new Float32Array(DN*3);
for(let i=0;i<DN;i++){pp[i*3]=-1+Math.random()*3;pp[i*3+1]=0.4+Math.random()*2.6;pp[i*3+2]=-3.5+Math.random()*3.5}
pg.setAttribute('position',new THREE.BufferAttribute(pp,3));
S.add(new THREE.Points(pg,new THREE.PointsMaterial({color:'#ffe3a0',size:0.025,transparent:true,opacity:0.8,blending:THREE.AdditiveBlending,depthWrite:false})));
