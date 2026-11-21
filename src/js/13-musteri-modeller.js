const CHX={};
/* ---------- müşteri ---------- */
const DOOR=V(-1.4,0,-3.4),SLOT=[V(0.3,0,-0.45),V(-0.4,0,-1.65),V(-1.0,0,-2.7)],Q=[];let cust=null,spawnT=1.2;
const tweens=[];const ease=k=>k<0.5?2*k*k:1-((-2*k+2)**2)/2;
function tween(dur,fn,done){tweens.push({t:0,dur,fn,done})}
let camTok=0;
function moveCam(to,dur,done){const id=++camTok,fp=camCur.p.clone(),fl=camCur.l.clone();tween(dur,k=>{if(id!==camTok)return;camCur.p.lerpVectors(fp,to.p,k);camCur.l.lerpVectors(fl,to.l,k)},()=>{if(id===camTok&&done)done()})}
/* ---------- 3D modeller ---------- */
const CHR=[],ALLC=[];let DOORH=null;
/* Stil rehberi: hazır modellerin renklerini oyunun sıcak, toprak tonlu paletine çeker (aşırı doygunluk ve parlaklık kırpılır, hafif sıcak ton) */
function harmon(c){const h={};c.getHSL(h);if(h.s>0.58)h.s=0.58+(h.s-0.58)*0.3;h.l=Math.min(0.84,Math.max(0.1,h.l));c.setHSL(h.h,h.s,h.l);c.r=Math.min(1,c.r*1.03);c.b*=0.94;return c}
function prepModel(sc,nc){sc.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=!o.isSkinnedMesh;const ga=o.geometry.attributes;if(!ga.normal)o.geometry.computeVertexNormals();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if(m.userData.prep)return;m.userData.prep=1;

if(m.map){m.map.encoding=THREE.LinearEncoding;m.map.needsUpdate=true}else{if(!nc)m.color.convertLinearToSRGB().multiplyScalar(1.12);harmon(m.color);m.flatShading=true}m.roughness=0.85;m.metalness=0;m.needsUpdate=true})}})}
const NOCONV=new Set(['wb_big','bookcase_open','scissors','scissors2','wallshelf']),OVR={anvil_wb:{metal:'#4e535c',wood:'#8a5530',_defaultMat:'#2e2e30'},barel_p:{'Material.005':'#7a4a28','Material.002':'#4a4644'},bench_wood:{mat22:'#9a7048',mat20:'#6b4528'},wb_grind:{wood:'#a8743e',woodDark:'#6b4528',metal:'#9aa0a8'},wb_kenney:{wood:'#a8743e',woodDark:'#6b4528',metal:'#9aa0a8',rock:'#e8dcc0'},handsaw:{lambert3SG:'#c4c8cc',lambert4SG:'#3a3a3a',lambert2SG:'#8a3a20'},scissors2:{Handle1Scissors1:'#b8402e',Steel1Scissors1:'#cfd3d8'},pine:{Bark_NormalTree:'#6b4a2b',Leaves_Pine:'#46733a'},m_rasp:{F44336:'#4a2350',FFFFFF:'#3f6a34'},m_coco:{_crayfishdiffuse:'#6b4a2b'},m_pondJ:{'8BC34A':'#7a9a50','4CAF50':'#6a8a44','039BE5':'#3a86c0','00BCD4':'#4aa0c8'},m_rocks:{'Material.040':'#8d8a84'},m_orn:{_crayfishdiffuse:'#c9a23a'},m_mulberry:{mat9:'#4a7a34',mat20:'#5a3a22'}},FLP=['#4f7a3a','#f2c230','#d9534f','#f4f0e6','#8a5bd0','#5f8a44','#f29ac0'],MIX=[];
/* Hareketsiz GLB modellerinde aynı malzemeyi kullanan parçaları tek ağda birleştirir (çizim çağrısını azaltır) */
function mergeStatic(g){if(g.animations&&g.animations.length)return;const sc=g.scene,ms=[];let bad=false;sc.updateMatrixWorld(true);
 sc.traverse(o=>{if(o.visible===false||o.isLight||o.isBone||o.isLine||o.isPoints)bad=true;if(o.isMesh){if(o.isSkinnedMesh||o.isInstancedMesh||Array.isArray(o.material)||!o.geometry.attributes.position||Object.keys(o.geometry.morphAttributes||{}).length)bad=true;ms.push(o)}});if(bad||ms.length<2)return;
 const by=new Map();ms.forEach(o=>{const k=o.material.uuid;if(!by.has(k))by.set(k,[]);by.get(k).push(o)});if(by.size>=ms.length)return;
 const inv=new THREE.Matrix4().copy(sc.matrixWorld).invert(),nf=a=>!a.normalized?1:a.array instanceof Uint8Array?255:a.array instanceof Uint16Array?65535:a.array instanceof Int8Array?127:a.array instanceof Int16Array?32767:1,out=[];
 for(const L of by.values()){const mat=L[0].material,has=k=>L.every(o=>o.geometry.attributes[k]),uv=has('uv'),col=has('color')&&L.every(o=>o.geometry.attributes.color.itemSize===L[0].geometry.attributes.color.itemSize),nr=has('normal');if((mat.map&&!uv)||(mat.vertexColors&&!col))return;
  const cs=col?L[0].geometry.attributes.color.itemSize:0;let nv=0,ni=0;L.forEach(o=>{const ge=o.geometry;nv+=ge.attributes.position.count;ni+=ge.index?ge.index.count:ge.attributes.position.count});
  const P=new Float32Array(nv*3),N=nr?new Float32Array(nv*3):null,U=uv?new Float32Array(nv*2):null,C=col?new Float32Array(nv*cs):null,I=nv>65535?new Uint32Array(ni):new Uint16Array(ni),v=new THREE.Vector3(),M4=new THREE.Matrix4(),N3=new THREE.Matrix3();let vo=0,io=0;
  L.forEach(o=>{const ge=o.geometry,a=ge.attributes,pc=a.position.count;M4.multiplyMatrices(inv,o.matrixWorld);N3.getNormalMatrix(M4);const flip=M4.determinant()<0,pf=nf(a.position);
   for(let i=0;i<pc;i++){v.fromBufferAttribute(a.position,i).multiplyScalar(1/pf).applyMatrix4(M4);P[(vo+i)*3]=v.x;P[(vo+i)*3+1]=v.y;P[(vo+i)*3+2]=v.z;
    if(N){v.fromBufferAttribute(a.normal,i).applyMatrix3(N3).normalize();N[(vo+i)*3]=v.x;N[(vo+i)*3+1]=v.y;N[(vo+i)*3+2]=v.z}
    if(U){const f=nf(a.uv);U[(vo+i)*2]=a.uv.getX(i)/f;U[(vo+i)*2+1]=a.uv.getY(i)/f}
    if(C){const f=nf(a.color);for(let k=0;k<cs;k++)C[(vo+i)*cs+k]=a.color.array[i*a.color.itemSize+k]/f}}
   const n=ge.index?ge.index.count:pc;for(let t=0;t+2<n;t+=3){const x=ge.index?ge.index.getX(t):t,y=ge.index?ge.index.getX(t+1):t+1,z=ge.index?ge.index.getX(t+2):t+2;I[io++]=vo+x;I[io++]=vo+(flip?z:y);I[io++]=vo+(flip?y:z)}vo+=pc});
  const G2=new THREE.BufferGeometry();G2.setAttribute('position',new THREE.BufferAttribute(P,3));if(N)G2.setAttribute('normal',new THREE.BufferAttribute(N,3));else G2.computeVertexNormals();if(U)G2.setAttribute('uv',new THREE.BufferAttribute(U,2));if(C)G2.setAttribute('color',new THREE.BufferAttribute(C,cs));G2.setIndex(new THREE.BufferAttribute(I.subarray(0,io),1));G2.computeBoundingSphere();G2.computeBoundingBox();
  const m2=new THREE.Mesh(G2,mat);m2.castShadow=true;m2.receiveShadow=true;m2.name='birlesik';out.push(m2)}
 if(sc.children.some(c=>c.isBufferGeometry))return;while(sc.children.length)sc.remove(sc.children[0]);out.forEach(m=>sc.add(m))}
function glb(n,cb){if(GLC[n]){cb(GLC[n]);return}if(!THREE.GLTFLoader)return;if(GLW[n]){GLW[n].push(cb);return}GLW[n]=[cb];
 new THREE.GLTFLoader().load(AU('models/'+n+'.glb'),g=>{prepModel(g.scene,NOCONV.has(n));let fi=0;g.scene.traverse(o=>{if(o.isMesh)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{const ov=OVR[n];if(ov&&ov[m.name])m.color.set(ov[m.name]);if(n==='scissors2'&&/Steel/.test(m.name))m.roughness=0.3;if(n==='pine'){const ps=o.geometry.attributes.position;o.geometry.computeBoundingBox();const bb=o.geometry.boundingBox,H=bb.max.y-bb.min.y,R=Math.max(bb.max.x-bb.min.x,bb.max.z-bb.min.z)/2,cx=(bb.max.x+bb.min.x)/2,cz=(bb.max.z+bb.min.z)/2,col=new Float32Array(ps.count*3),bk=new THREE.Color('#6b4a2b'),lf=new THREE.Color('#3f6a34'),lt=new THREE.Color('#5f8a44'),t=new THREE.Color();for(let i=0;i<ps.count;i++){const h=(ps.getY(i)-bb.min.y)/H,r=Math.hypot(ps.getX(i)-cx,ps.getZ(i)-cz)/R;if(h<0.3&&r<0.16)t.copy(bk);else t.copy(lf).lerp(lt,Math.min(1,h*0.9+r*0.3));col[i*3]=t.r;col[i*3+1]=t.g;col[i*3+2]=t.b}o.geometry.setAttribute('color',new THREE.BufferAttribute(col,3));m.vertexColors=true;m.color.set('#ffffff');m.needsUpdate=true}if(n==='flowers')m.color.set(FLP[fi++%FLP.length])})});
 g.scene.traverse(o=>{if(o.isMesh)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if(m.map&&m.transparent){m.transparent=false;m.alphaTest=0.5;m.depthWrite=true;m.side=THREE.DoubleSide}})});if(n!=='birch')try{mergeStatic(g)}catch(e){}GLC[n]=g;GLW[n].forEach(f=>f(g));GLW[n]=null},undefined,()=>{})}
function skin(o,n,opt){place(n,Object.assign({par:o,swap:1},opt,{cb:w=>{if(o.isMesh)o.material=HID}}))}
function fitM(n,o){const g=GLC[n];if(!g)return null;const m=g.scene.clone(),w=new THREE.Group();m.rotation.set(o.rx||0,0,o.rz||0);w.add(m);m.updateMatrixWorld(true);let bb=new THREE.Box3().setFromObject(m),sz=bb.getSize(V(0,0,0));m.scale.multiplyScalar(o.h?o.h/sz.y:o.w/Math.max(sz.x,sz.z));m.updateMatrixWorld(true);bb=new THREE.Box3().setFromObject(m);m.position.set(-(bb.min.x+bb.max.x)/2,-bb.min.y,-(bb.min.z+bb.max.z)/2);return w}
function place(n,o){glb(n,g=>{const sk=g.animations.length&&THREE.SkeletonUtils,m=sk?THREE.SkeletonUtils.clone(g.scene):g.scene.clone(),w=new THREE.Group();m.rotation.set(o.rx||0,0,o.rz||0);w.add(m);m.updateMatrixWorld(true);
 let bb=new THREE.Box3().setFromObject(m),sz=bb.getSize(V(0,0,0));m.scale.multiplyScalar(o.h?o.h/sz.y:o.w/Math.max(sz.x,sz.z));m.updateMatrixWorld(true);bb=new THREE.Box3().setFromObject(m);
 m.position.set(-(bb.min.x+bb.max.x)/2,-bb.min.y,-(bb.min.z+bb.max.z)/2);w.position.set(o.x||0,o.y||0,o.z||0);w.rotation.y=o.ry||0;(o.par||S).add(w);
 if(o.anim&&g.animations.length){const mx=new THREE.AnimationMixer(m),a=g.animations.find(c=>c.name===o.anim)||g.animations[0];const ac=mx.clipAction(a);ac.time=Math.random()*a.duration;ac.play();MIX.push(mx)}
 if(o.par&&o.swap)o.par.children.forEach(c=>{if(c!==w&&c.material!==HID)c.visible=false});o.cb&&o.cb(w)})}
function fitModel(o,h,ax){const bb=new THREE.Box3().setFromObject(o),sz=bb.getSize(V(0,0,0)),sc=h/sz[ax||'y'];o.scale.multiplyScalar(sc);const b2=new THREE.Box3().setFromObject(o);return b2}
if(THREE.GLTFLoader){const GL=new THREE.GLTFLoader();
['m_Casual','m_LongSleeve','m_Shirt','m_Suit','f_Casual','f_Alternative','f_Dress','f_TankTop','f_Woman2','m_Worker','m_Knight','c_farmer','c_business','c_punk','c_astro','c_archer','x_cirak','x_ciftci','x_coban'].forEach(n=>{LD.t++;GL.load(AU('models/'+n+'.glb'),g=>{LD.n++;g.nm=n;if(n==='c_archer'){const sc=g.scene,ey=M('#2a1d16',0.6),wh=M('#f2ece0',0.7),mo=M('#6b3a2e',0.8);[-0.17,0.17].forEach(x=>{put(sc,B(0.17,0.12,0.04),wh,x,9.97,0.45);put(sc,B(0.085,0.1,0.04),ey,x+(x<0?0.02:-0.02),9.96,0.47);put(sc,B(0.2,0.045,0.04),M('#4a3424'),x,10.13,0.44).rotation.z=x<0?-0.12:0.12});put(sc,B(0.22,0.05,0.06),mo,0,9.58,0.53)}g.sex=n[0]==='f'?'f':n[0]==='m'?'m':'';prepModel(g.scene);const bb=new THREE.Box3().setFromObject(g.scene);g.h=bb.max.y-bb.min.y;g.y0=bb.min.y;g.cx=(bb.min.x+bb.max.x)/2;g.cz=(bb.min.z+bb.max.z)/2;if(n[0]==='x')CHX[n]=g;else CHR.push(g)},undefined,()=>{LD.n++})});
GL.load(AU('models/door.glb'),g=>{const d=g.scene;prepModel(d);const b=fitModel(d,2.3);d.position.set(-b.min.x,-b.min.y,-(b.min.z+b.max.z)/2);DOORH=new THREE.Group();DOORH.add(d);DOORH.position.set(-2.02,0,-3.8);DOORH.rotation.y=-1.55;S.add(DOORH)},undefined,()=>{});}
function anim(c,n,once){if(c&&(c.proc||c.stat)){c.cur=n;c.pt0=tt;return}if(!c||!c.A||!c.A[n])return;if(c.cur===n&&!once)return;const nx=c.A[n],pv=c.A[c.cur];nx.reset();nx.setLoop(once?THREE.LoopOnce:THREE.LoopRepeat);nx.clampWhenFinished=!!once;nx.play();if(pv&&pv!==nx)pv.crossFadeTo(nx,0.3,false);c.cur=n;
 if(once){clearTimeout(c.ct);c.ct=setTimeout(()=>{if(c.cur===n)anim(c,c.walking?'walk':'idle')},nx.getClip().duration*1000+200)}}
const WN=[0,1,2,3,4,5].map(i=>[Math.sin(i*Math.PI/3+0.5)*2.15,-1.0+Math.cos(i*Math.PI/3+0.5)*2.0]),WE=[0,1,2,3,4,5].map(i=>[(i+5)%6,(i+1)%6]);
const WND=[];function mkWand(){if(!CHR.length){setTimeout(mkWand,3000);return}[0,2,4].forEach((n,i)=>{const c=makeCustomer();c.wand=true;c.g.scale.multiplyScalar(0.78);c.n=n;c.g.position.set(OP+WN[n][0],0,WN[n][1]);WND.push(c);
  c.go=()=>{const taken=WND.filter(o=>o!==c).map(o=>o.n),opts=WE[c.n].filter(x=>!taken.includes(x));if(!opts.length){setTimeout(c.go,1500);return}const nx=pick(opts),q=WN[nx];c.n=nx;c.wt=V(OP+q[0]+(Math.random()-0.5)*0.3,0,q[1]+(Math.random()-0.5)*0.2);c.bl=0;c.fr=null;c.tok++;c.walking=true;anim(c,'walk')};setTimeout(c.go,800+i*2200)})}
function wandTick(dt){WND.forEach(c=>{if(!c.wt){if(c.fr!=null){let a=c.fr-c.g.rotation.y;a=Math.atan2(Math.sin(a),Math.cos(a));c.g.rotation.y+=a*Math.min(1,dt*4)}return}const p=c.g.position,dx=c.wt.x-p.x,dz=c.wt.z-p.z,d=Math.hypot(dx,dz);if(d<0.03){c.wt=null;c.walking=false;c.fr=Math.PI+(Math.random()-0.5)*0.9;anim(c,'idle');setTimeout(c.go,1500+Math.random()*5000);return}const ux=dx/d,uz=dz/d;
  const blk=c.bl<3.5&&WND.some(o=>{if(o===c)return false;const ox=o.g.position.x-p.x,oz=o.g.position.z-p.z,od=Math.hypot(ox,oz);return od<0.6&&(ox*ux+oz*uz)>0.15*od});
  if(blk){c.bl+=dt;if(c.walking){c.walking=false;anim(c,'idle')}return}if(!c.walking){c.walking=true;anim(c,'walk')}if(c.bl>0)c.bl=Math.max(0,c.bl-dt*0.5);const st=Math.min(d,0.8*dt);p.x+=ux*st;p.z+=uz*st;const ry=Math.atan2(ux,uz);let a=ry-c.g.rotation.y;a=Math.atan2(Math.sin(a),Math.cos(a));c.g.rotation.y+=a*Math.min(1,dt*8)})}
setTimeout(mkWand,6000);
function makeCustomer(src0){if(src0||CHR.length){const src=src0||pick(CHR),m=THREE.SkeletonUtils.clone(src.scene),w=new THREE.Group(),sc=1.72/src.h;m.scale.multiplyScalar(sc);m.position.y=-src.y0*sc;if(Math.abs(src.cx||0)>0.3||Math.abs(src.cz||0)>0.3){m.position.x=-src.cx*sc;m.position.z=-src.cz*sc}w.add(m);w.position.copy(DOOR);S.add(w);
 const mix=new THREE.AnimationMixer(m),A={};src.animations.forEach(a=>A[a.name]=mix.clipAction(a));const c={g:w,head:new THREE.Object3D(),tok:0,at:false,mix,A,cur:'idle',sex:src.sex||''};if(A.idle){A.idle.time=Math.random()*3;A.idle.play()}
 if(!src.animations.length){c.stat={m,y:m.position.y};}if(!src.animations.length){const bn=n=>m.getObjectByName(n);const B0={ul:bn('UpperLegL'),ur:bn('UpperLegR'),ll:bn('LowerLegL'),lr:bn('LowerLegR'),al:bn('UpperArmL'),ar:bn('UpperArmR'),fl:bn('LowerArmL'),fr:bn('LowerArmR'),sp:bn('Spine1'),hd:bn('Head')};if(B0.ul&&B0.ur){c.proc=B0;c.rest={};for(const k in B0)if(B0[k])c.rest[k]=B0[k].quaternion.clone();const zq=a=>new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),a);if(c.rest.al)c.rest.al.multiply(zq(-1.2));if(c.rest.ar)c.rest.ar.multiply(zq(1.2));c.pt0=0}}
 ALLC.push(c);return c}
const g=new THREE.Group(),head=new THREE.Group();
put(g,B(0.5,0.5,0.3),M('#3a2f28'),0,0.25,0);put(g,Cy(0.28,0.36,1.05,8),M(pick(['#3f6fa8','#4f7a3a','#8a3a28','#6b4f8a','#c08a2a'])),0,1.0,0);
head.add(mesh(new THREE.SphereGeometry(0.24,12,10),M(pick(['#e8b58c','#c98d63','#f0c9a4','#9a6a48']))));
[-0.08,0.08].forEach(x=>put(head,new THREE.SphereGeometry(0.03,6,6),M('#1a1410'),x,0.04,0.21));
if(Math.random()<0.6)put(head,Cy(0.2,0.3,0.18,8),M(pick(['#5a3519','#2a2420','#7a5a3a'])),0,0.22,0);
head.position.y=1.78;g.add(head);g.position.copy(DOOR);S.add(g);const c={g,head,tok:0,at:false};ALLC.push(c);return c}
function walk(c,to,dur,done){const id=++c.tok,fr=c.g.position.clone();{const dd=fr.distanceTo(to);if(dd>0.05){const r0=c.g.rotation.y,td=Math.min(0.3,Math.max(dur,0.01)),t0=tt;let da=Math.atan2(to.x-fr.x,to.z-fr.z)-r0;da=Math.atan2(Math.sin(da),Math.cos(da));tween(td,()=>{if(id===c.tok)c.g.rotation.y=r0+da*Math.min(1,(tt-t0)/td)})}if(c.A&&c.A.walk)c.A.walk.timeScale=clamp(dd/Math.max(dur,0.01)/0.85,0.75,1.5)}c.walking=true;anim(c,'walk');tween(dur,k=>{if(id===c.tok)c.g.position.lerpVectors(fr,to,k)},()=>{if(id!==c.tok)return;c.walking=false;anim(c,'idle');done&&done()})}
function pCx(p){return Object.entries(p.need).reduce((a,[k,n])=>a+(k==='boya'?0:n),0)+Object.keys(p.need).length*0.5+p.steps.length/4}
function easyM(k){if(k==='boya'||(G.inv[k]||0)>0)return true;const mk=a=>MARKET.some(m=>m.k===a&&(!m.t||G.tier>=m.t));if(mk(k)||Object.values(CROPS).some(c=>c.out===k))return true;if(Object.entries(GOUT).some(([ad,o])=>o.includes(k)&&gOpen(ad)))return true;return ST.some(s=>stOwned(s)&&s.rec.some(r=>r.out[k]&&Object.keys(r.in).every(a=>mk(a)||(G.inv[a]||0)>0||Object.entries(GOUT).some(([ad,o])=>o.includes(a)&&gOpen(ad)))))}
/* sipariş akışı: başta en basit birkaç ürün sırayla, itibar arttıkça yelpaze genişler; son istenenler tekrar edilmez, hiç istenmemişler öne çıkar */
function ordPick(pool0,sp){const r=G.rep||0,H=G.ordH||(G.ordH=[]),seen=G.seenP||(G.seenP={});let L=pool0.slice().sort((a,b)=>pCx(a)-pCx(b)||a.base-b.base);const cap=Math.max(3,3+Math.floor(r/20));if(r<150)L=L.slice(0,cap);
 const last=H.slice(-Math.min(3,L.length-1)),C=L.filter(p=>!last.includes(p.id));const W=(C.length?C:L).map(p=>{let w=1;if(!seen[p.id])w+=r<150?2.5:1.5;if(sp.includes(p.id))w+=1.5;if(r<40)w+=Math.max(0,3-L.indexOf(p))*0.6;return [p,w]});
 let t=W.reduce((a,x)=>a+x[1],0)*Math.random(),p=W[W.length-1][0];for(const [q,w] of W){if((t-=w)<=0){p=q;break}}H.push(p.id);if(H.length>8)H.shift();seen[p.id]=1;return p}
function mkOrder(){const pa=PRODS.filter(unlocked),mx=3.6+(G.rep||0)/35,pe=pa.filter(p=>pCx(p)<=mx),pz=(G.rep||0)<80?pa.filter(p=>pCx(p)<=mx+2&&Object.keys(p.need).every(easyM)):[],pool0=pz.length>=2?pz:pe.length>=2?pe:pa,sp=SEAS[season()].p,p=ordPick(pool0,sp),color=p.need.boya?pick(PAINTS):null,style=p.styles&&Math.random()<0.6?pick(p.styles):null;
if(G.first)Object.entries(p.need).forEach(([k,n])=>{const key=k==='boya'?'boya_'+color.id:k;G.inv[key]=Math.max(G.inv[key],n)});
return {p,color,style,budget:Math.round(p.base*(0.9+Math.random()*0.4)*(sp.includes(p.id)?1.2:1)*balM('sell')*prodM(p.id)/5)*5,hurry:!G.first&&(G.rep||0)>=60&&Math.random()<0.15}}
function spawn(){if(Q.length>=3)return;if(!CHR.length&&performance.now()<30000)return;const c=makeCustomer(),pv=G.stock.filter(x=>x.price>0);
if(!G.first&&pv.length&&Math.random()<0.45){const it=pick(pv);c.order={buy:it.id,p:PRODS.find(x=>x.id===it.pid)};c.acc=c.accMax=35;c.dead=c.deadMax=9999;c.wait=90}
else if(!G.first&&!fOff('tamir',true)&&Math.random()<0.16){const o=c.order=mkRepOrder();c.acc=c.accMax=75;c.dead=c.deadMax=260;c.wait=170}
else{const o=c.order=mkOrder(),h=o.hurry;const rgs=(G.reg||[]).filter(r=>c.sex&&regSex(r)===c.sex);if(!G.first&&rgs.length&&Math.random()<0.3){const rg=pick(rgs),fp=PRODS.find(x=>x.id===rg.fav);if(fp&&unlocked(fp)&&fp.id!==o.p.id){o.p=fp;o.color=fp.need.boya?pick(PAINTS):null;o.style=null;o.budget=Math.round(fp.base*(1+Math.random()*0.3)/5)*5}o.reg=rg.ad}const pf=1+0.8*clamp(1-(G.rep||0)/400,0,1);c.acc=c.accMax=G.first?9999:Math.round((h?45:75)*pf);c.dead=c.deadMax=G.first?9999:Math.round(((h?150:280)+o.p.steps.length*20)*pf);c.wait=h?100:170}
c.g.visible=G.phase!=='craft';Q.push(c);cust=Q[0];hud();seat(c)}
function canMake(p){return Object.entries(p.need).every(([k,n])=>k==='boya'?PAINTS.some(c=>(G.inv['boya_'+c.id]||0)>=n):(G.inv[k]||0)>=n)}
function callMaster(){if(fOff('usta'))return;if(!G.open||G.night){toast('Dükkân kapalıyken müşteri gelmez',1500);return}if(Q.length>=3){toast('Sıra dolu, önce bekleyenlerle ilgilen',1500);return}if((G.elmas||0)<3){toast('3 elmas gerekli',1300);return}
 sfx.tap();openSheet('usta',`<h3>Usta müşteri çağır</h3><p style="margin:4px 0 10px;line-height:1.45">Ünlü bir usta dükkânına gelir. <b>4.000–6.000 altın</b> bütçeyle sipariş verir, iyi iş çıkarırsan <b>+100 itibara</b> kadar kazanırsın. Elindeki malzemeyle yapabileceğin bir ürün ister.</p><p class="chint" style="margin:0 0 12px">Ödeme ve itibar ürünün kalitesine göre değişir.</p><div class="pk" style="justify-content:center"><button class="btn g" id="msOk">Çağır · 3 ${typeof ic==='function'?ic('gem'):'elmas'}</button><button class="btn l" id="msNo">Vazgeç</button></div>`);
 $('msNo').onclick=()=>{sfx.tap();closeSheet()};$('msOk').onclick=()=>{closeSheet();callMasterGo()}}
function callMasterGo(){if((G.elmas||0)<3||Q.length>=3)return;
 G.elmas-=3;hud();const c=makeCustomer(),o=c.order=mkOrder();{const pool=PRODS.filter(p=>unlocked(p)&&canMake(p));if(pool.length){const p=pick(pool);o.p=p;const pc=p.need.boya?PAINTS.filter(c=>(G.inv['boya_'+c.id]||0)>=p.need.boya):[];o.color=p.need.boya?pick(pc.length?pc:PAINTS):null;o.style=p.styles&&Math.random()<0.6?pick(p.styles):null}}
 o.budget=Math.round((4000+Math.random()*2000)/50)*50;o.noHaggle=1;o.vip=1;o.hurry=false;c.acc=c.accMax=150;c.dead=c.deadMax=420+o.p.steps.length*20;c.wait=260;c.g.visible=G.phase!=='craft';Q.push(c);cust=Q[0];sfx.bell();toast('Usta müşteri yolda! Bütçesi yüksek',1600);save();seat(c)}
function seat(c){const i=Q.indexOf(c);if(i<0)return;c.at=false;const to=SLOT[i];walk(c,to,Math.max(0.5,c.g.position.distanceTo(to)/1.5),()=>{c.g.rotation.y=0;c.at=true;if(Q[0]===c&&G.phase==='idle')present(c)})}
function present(c){const o=G.order=c.order;G.phase='ordering';G.bubOn=true;sfx.bell();if(o.buy){presentBuy(c,o);return}
if(o.rep){say(`${pick(['Merhaba usta! ','İyi günler! ','Selam usta! '])}${o.p.__proto__.ad.toLowerCase()} ${WVERB[o.rep]}, tamir edebilir misin? ${o.budget} altın verebilirim.`);refresh();if(view==='home')orderActions();else toast('Dükkâna tamir için müşteri geldi',1800);return}
say(`${o.vip?'<b>Usta müşteri:</b> İşinizi çok övdüler. ':''}${o.reg?'<b>'+o.reg+':</b> Yine ben geldim usta! ':''}${o.hurry?'<b>Acelem var!</b> ':o.reg?'':pick(['Merhaba usta! ','İyi günler! ','Selam! '])}${o.color?o.color.ad+' ':''}${o.style?o.style.toLowerCase()+' ':''}${o.p.ad.toLowerCase()} istiyorum. Bütçem ${o.budget} altın${o.hurry?', zamanında biterse %20 fazlasını veririm':''}.`);
refresh();if(view==='home')orderActions();else toast('Dükkâna müşteri geldi',1800)}
function leave(c){const i=Q.indexOf(c);if(i<0)return;Q.splice(i,1);cust=Q[0]||null;c.g.visible=G.phase!=='craft';walk(c,DOOR,2,()=>{S.remove(c.g);const j=ALLC.indexOf(c);if(j>=0)ALLC.splice(j,1);if(c.mix)c.mix.stopAllAction()});
if(i===0&&(!G.order||G.order===c.order)){G.order=null;G.phase='idle';G.bubOn=false;say(null);actions([]);refresh()}hud();Q.forEach((x,j)=>{if(j>=i)seat(x)})}
function lose(c,msg,rp){G.st.lost++;G.rep=Math.max(0,G.rep-rp);toast(rp?`${msg}<br>İtibar −${rp}`:msg,2400);sfx.bad();leave(c)}
function qSer(){try{return Q.filter(c=>c.order).map(c=>{const o=c.order,so={};for(const k in o){const v=o[k];if(k==='p')so.p=v&&v.id;else if(k==='color')so.color=v&&v.id;else if(v==null||typeof v!=='object')so[k]=v}
 return {o:so,acc:c.acc,accMax:c.accMax,dead:c.dead,deadMax:c.deadMax,wait:c.wait,act:G.order===o&&(G.phase==='active'||G.phase==='craft')}})}catch(e){return []}}
function qRestore(){const L=G.qsL;G.qsL=null;if(!L)return;const el=Math.max(0,(Date.now()-(G.qsT||Date.now()))/1000);L.slice(0,3).forEach((d,i)=>{const p=PRODS.find(x=>x.id===d.o.p);if(!p)return;
 const o=Object.assign({},d.o,{p,color:d.o.color?PAINTS.find(x=>x.id===d.o.color)||null:null});if(o.rep&&WORN[o.rep])o.p=RP(p,o.rep);if(o.buy&&!G.stock.some(x=>x.id===o.buy))return;const c=makeCustomer();c.order=o;
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
if(!v){toast('Dükkân kapandı<br>İçerdekiler kalır, yeni müşteri gelmez',2000)}else{if(!G.first)spawnT=Math.min(spawnT,4);toast('Dükkân açıldı',1200)}refresh();save()}
$('openB').onclick=()=>{if(G.night){toast('Akşam oldu<br>Dükkân yarın sabah açılır',1600);return}setOpen(!G.open)};
const r5=v=>Math.max(5,Math.round(v/5)*5);
const pr=it=>PRODS.find(x=>x.id===it.pid);
const itemVal=it=>pr(it).base*(0.55+0.12*it.stars);
const sugg=it=>r5(itemVal(it)*1.05);
const desc=it=>`${it.col?paintOf(it.col).ad.toLowerCase()+' ':''}${it.style?it.style.toLowerCase()+' ':''}${pr(it).ad.toLowerCase()}`;
function matchStock(o){if(!o||o.buy||o.free||o.rep)return null;return G.stock.filter(it=>it.pid===o.p.id&&(!o.color||it.col===o.color.id)&&(!o.style||it.style===o.style)).sort((a,b)=>b.stars-a.stars)[0]||null}
function orderActions(){const o=G.order;if(!o)return;if(o.buy){buyActions();return}const L=[btn('Siparişi al','g',()=>acceptOrder())];if(!o.haggled&&!o.noHaggle)L.push(btn('Pazarlık','',haggleOrder));
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
function levelUp(){const nt=tierOf(G.rep);if(nt>G.tier){G.tier=nt;restock();G.elmas=(G.elmas||0)+5;setTimeout(()=>{toast(`Kademe ${nt} açıldı!<br>Yeni araçlar ve malzemeler<br><b>+5 💎 elmas</b>`,2600);sfx.fan()},1500)}checkUnl()}
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
function sale(it,p){const c=Q[0];anim(c,'clap',true);if(!G.stock.includes(it))return;rmStock(it);G.gold+=p;G.st.earned+=p;G.st.sold++;const rp=(it.stars||3)>=5?2:(it.stars||3)>=3?1:0;G.rep+=rp;sfx.cash();toast(`+${p} altın${rp?` · +${rp} itibar`:''}`,1200);try{levelUp()}catch(e){}hud();say('Teşekkürler, güle güle kullanırım!');
G.phase='leaving';G.order=null;actions([]);refresh();save();setTimeout(()=>{G.bubOn=false;say(null);if(c)leave(c)},1200)}
function acceptOrder(msg){if(G.phase!=='ordering')return;G.phase='active';say(msg||'Harika, bekliyorum!');setTimeout(()=>{if(G.phase==='active'){G.bubOn=false;say(null)}},1800);refresh();
if(G.first)setTimeout(()=>toast('Kartta neyin eksik olduğu yazıyor.<br>Eksikleri bahçeden topla, atölyede işle.',3200),600)}
function rejectOrder(){if(G.phase!=='ordering')return;const c=Q[0],vip=c&&c.order&&c.order.vip,pen=vip?10:3;G.rep=Math.max(-50,G.rep-pen);hud();sf('reddet',0.55)||sfx.bad();toast(`Müşteri kırıldı · −${pen} itibar`,1500);save();leave(c)}
var PQ=new THREE.Quaternion(),PE=new THREE.Euler();function pRot(c,k,x,y,z){const b=c.proc[k];if(!b)return;PE.set(x,y,z);PQ.setFromEuler(PE);b.quaternion.copy(c.rest[k]).multiply(PQ)}
function procAnim(c){const t=tt*1.0,s=c.cur;if(s==='walk'){const a=Math.sin(t*8)*0.5;pRot(c,'ul',a,0,0);pRot(c,'ur',-a,0,0);pRot(c,'ll',Math.max(0,-a)*0.8,0,0);pRot(c,'lr',Math.max(0,a)*0.8,0,0);pRot(c,'al',-a*0.6,0,0);pRot(c,'ar',a*0.6,0,0);pRot(c,'sp',0,Math.sin(t*8)*0.06,0)}
 else if(s==='clap'||s==='wave'){const a=Math.abs(Math.sin(t*10))*0.4;pRot(c,'ul',0,0,0);pRot(c,'ur',0,0,0);pRot(c,'ll',0,0,0);pRot(c,'lr',0,0,0);pRot(c,'al',-1.1-a,0,0);pRot(c,'ar',-1.1-a,0,0);pRot(c,'fl',-0.6,0,0);pRot(c,'fr',-0.6,0,0)}
 else if(s==='work'){const a=Math.sin(t*6);pRot(c,'ar',-0.8+a*0.6,0,0);pRot(c,'fr',-0.5,0,0);pRot(c,'al',-0.3,0,0)}
 else{const a=Math.sin(t*1.6);['ul','ur','ll','lr','fl','fr'].forEach(k=>pRot(c,k,0,0,0));pRot(c,'al',a*0.04,0,0);pRot(c,'ar',-a*0.04,0,0);pRot(c,'sp',a*0.025,0,0);pRot(c,'hd',0,Math.sin(t*0.5)*0.15,0)}}
