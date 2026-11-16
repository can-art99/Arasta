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
  sise:['m_bottle',0.2,/mat5/],balkav:['m_jar',0.2,/mat25|mat24/,{mix:0.25}],tespih:['m_necklace',0.36,/./,{rx:-H}],nal:['m_horseshoe',0.19,/./],
  bicak:['m_knife',0.46,/^Grey$/,{rx:H}],terlik:['m_slippers',0.44,/SlipperMain/],tahta:['m_cboard',0.46,/./,{noMap:true}],mum:['m_candle',0.2,/./,{mix:0.35}],
  btepsi:['m_tray',0.48,/./,{noMap:true}],kalemlik:['m_mugpen',0.22,/./,{mix:0.55}],yastik:['m_pillow',0.46,/./],vazo:['m_vase',0.24,/./],tac:['m_crown',0.34,/blinn1SG/]};
 Object.entries(MB).forEach(([id,a])=>{const p=P(id);if(p){p.build=gB(a[0],a[1],p.build,a[2],a[3]);glb(a[0],()=>{clearTimeout(icT);icT=setTimeout(iconsRefresh,500)})}});
 const an=P('anahtarlik');if(an){const fb=an.build;an.build=(hex,st,k)=>{const r=fb(hex,st,k);const src=GLC.m_key;if(src){const m=src.scene.clone();m.rotation.x=-H;m.updateMatrixWorld(true);let bb=new THREE.Box3().setFromObject(m),s=bb.getSize(V(0,0,0));m.scale.multiplyScalar(0.16/Math.max(s.x,s.z));m.updateMatrixWorld(true);bb=new THREE.Box3().setFromObject(m);m.position.set(0.07-(bb.min.x+bb.max.x)/2,-bb.min.y,0.05-(bb.min.z+bb.max.z)/2);r.g.add(m)}return r};glb('m_key',()=>{})}
 glb('saw2',()=>{const w=fitM('saw2',{w:0.3});if(w){const i=TL.sw.children[0];i.children.forEach(c=>c.visible=false);w.position.set(0,-0.004,-0.04);i.add(w)}});glb('m_gcut',()=>{const w=fitM('m_gcut',{rx:Math.PI/2,w:0.2});if(w){w.traverse(o=>{if(o.isMesh){o.material=o.material.clone();if(o.material.name==='blinn3SG'){o.material.color.set('#d4d9dc');o.material.metalness=0.6;o.material.roughness=0.3}else{o.material.color.set('#2f6b8a');o.material.roughness=0.5}}});const i=TL.gc.children[0];i.children.forEach(c=>c.visible=false);w.position.z=0.1;i.add(w)}});glb('axe',()=>{const w=fitM('axe',{rz:Math.PI,h:0.36});if(w){const i=TL.ax.children[0];i.children.forEach(c=>c.visible=false);w.position.y=-0.005;i.add(w)}});
 ['m_screw','m_sledge','m_fan','m_torch','m_pipe','m_anvil','m_bellow','m_mulberry','m_crown','m_chest2','m_bucket','m_fici','m_gcut'].forEach(n=>glb(n,()=>{}))},1600);
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
