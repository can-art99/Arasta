/* ---------- Üst kat (Seçkin atölye): Kademe 5 + 15.000 altın ile açılır ---------- */
/* Üst kat, dükkânla aynı koordinatlarda kurulan ayrı bir oda kabuğudur: çıkınca alt kat gizlenir, kraft masası (BC) aynı kalır. */
var UF=false;const UST={t:5,g:15000,vcap:6},UGRP=new THREE.Group();UGRP.visible=false;S.add(UGRP);let UHID=[],UVIT=null,USTR=null,UDOWN=null;
MARKET.push({k:'sedef',f:80,t:5},{k:'gumus',f:60,t:5});
const COLN=['Rıza Bey','Halil Paşa','Nevin Hanım','Doktor Selim','Sedef Hanım','Tüccar Cemal','Leyla Hanım','Kâtip Ömer'];
function ustS(){if(!G.ust||typeof G.ust!=='object')G.ust={open:0,stock:[],ord:[],nx:0};['stock','ord'].forEach(k=>{if(!Array.isArray(G.ust[k]))G.ust[k]=[]});return G.ust}
const ustProds=()=>PRODS.filter(p=>p.ust&&(G.tier||1)>=p.tier);
/* ---- oda kabuğu: Osmanlı başodası ---- */
function ustTex(draw,w,h){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
function ustBuild(){if(UGRP.children.length)return;const g=UGRP,P=(geo,m,x,y,z)=>put(g,geo,m,x,y,z);
 const wal=M('#e9dcc0',0.9),wd=M('#4a2a16',0.7),wd2=M('#5c3520',0.65),gold=M('#c9a23a',0.35);
 for(let i=0;i<10;i++)P(B(0.6,0.05,9),M(i%2?'#4f2e19':'#45281a',0.8),-2.7+i*0.6,0,0);
 P(B(6,3.4,0.15),wal,0,1.7,-4);P(B(0.15,3.4,9),wal,-3,1.7,0);P(B(0.15,3.4,9),wal,3,1.7,0);
 [[0,0.5,-3.9,6,1,0.06],[-2.9,0.5,0,0.06,1,9],[2.9,0.5,0,0.06,1,9]].forEach(([x,y,z,w,h,d])=>P(B(w,h,d),wd2,x,y,z));
 const cin=ustTex((c,w,h)=>{c.fillStyle='#1f8a8a';c.fillRect(0,0,w,h);c.fillStyle='#f2efe6';for(let i=0;i<8;i++){c.beginPath();c.arc(i*32+16,h/2,11,0,Math.PI*2);c.fill()}c.fillStyle='#1a4f7a';for(let i=0;i<8;i++){c.beginPath();c.moveTo(i*32+16,h/2-8);c.lineTo(i*32+24,h/2);c.lineTo(i*32+16,h/2+8);c.lineTo(i*32+8,h/2);c.fill()}c.fillStyle='#c9302a';for(let i=0;i<8;i++){c.beginPath();c.arc(i*32+16,h/2,3,0,Math.PI*2);c.fill()}c.fillStyle='#0e5a5a';c.fillRect(0,0,w,3);c.fillRect(0,h-3,w,3)},256,32);
 [[0,1.25,-3.9,6,0.3,0.04,12],[-2.9,1.25,0,0.04,0.3,9,18],[2.9,1.25,0,0.04,0.3,9,18]].forEach(([x,y,z,w,h,d,rp])=>{const t=cin.clone();t.needsUpdate=true;t.repeat.set(rp,1);if(w<0.1)t.rotation=0;const m=new THREE.MeshStandardMaterial({map:t,roughness:0.6});P(B(w,h,d),m,x,y,z)});
 for(let i=0;i<6;i++)P(B(6,0.14,0.18),wd,0,3.3,-3.6+i*1.5);
 let _n0=g.children.length;[-1.3].forEach(x=>{P(B(0.9,1.1,0.04),glow('#ffe6a8'),x,2.0,-3.9);const a=put(g,new THREE.CircleGeometry(0.45,16,0,Math.PI),glow('#ffd88a'),x,2.55,-3.9);
  P(B(1.04,0.08,0.1),wd,x,1.42,-3.87);P(B(0.08,1.2,0.1),wd,x-0.5,2.0,-3.87);P(B(0.08,1.2,0.1),wd,x+0.5,2.0,-3.87);P(B(0.04,1.1,0.06),wd,x,2.0,-3.86);P(B(0.9,0.04,0.06),wd,x,2.2,-3.86);
  for(let k=0;k<7;k++){const t=k/6*Math.PI;P(B(0.1,0.1,0.1),wd,x+Math.cos(t)*0.5,2.55+Math.sin(t)*0.5,-3.87)}});
const WINP=g.children.slice(_n0);
 /* sedir (pencerenin altında, sol duvar boyunca devam eder) */
 _n0=g.children.length; P(B(2.3,0.42,0.7),wd2,-1.5,0.21,-3.5);P(B(2.24,0.1,0.66),M('#8a1f2a',0.8),-1.5,0.47,-3.5);
 for(let i=0;i<3;i++){const c=P(B(0.66,0.5,0.16),M(i%2?'#a8322f':'#2c3e6b',0.85),-2.25+i*0.75,0.75,-3.78);c.rotation.x=0.12}
 const SEDP=g.children.slice(_n0);P(B(0.7,0.42,3.0),wd2,-2.55,0.21,-1.6);P(B(0.66,0.1,2.9),M('#8a1f2a',0.8),-2.55,0.47,-1.6);
 /* halı */
 const rug=ustTex((c,w,h)=>{c.fillStyle='#7a1a22';c.fillRect(0,0,w,h);c.strokeStyle='#d9b44a';c.lineWidth=8;c.strokeRect(10,10,w-20,h-20);c.strokeStyle='#1d2f5a';c.lineWidth=14;c.strokeRect(26,26,w-52,h-52);c.fillStyle='#d9b44a';c.beginPath();c.moveTo(w/2,h*0.25);c.lineTo(w*0.72,h/2);c.lineTo(w/2,h*0.75);c.lineTo(w*0.28,h/2);c.fill();c.fillStyle='#1d2f5a';c.beginPath();c.arc(w/2,h/2,16,0,Math.PI*2);c.fill()},256,160);
 const rg=put(g,new THREE.PlaneGeometry(2.6,1.7),new THREE.MeshStandardMaterial({map:rug,roughness:0.95}),0.1,0.03,-1.3);rg.rotation.x=-Math.PI/2;
 /* usta tezgâhı (BC'de, üstü Y'de) */
 _n0=g.children.length;P(B(2.4,0.08,1.2),wd,0,Y-0.04,BC.z);P(B(1.5,0.006,0.9),M('#2f4a33',0.9),0,Y-0.002,BC.z);
 [[-1.1,-0.5],[1.1,-0.5],[-1.1,0.5],[1.1,0.5]].forEach(([x,z])=>P(B(0.12,Y-0.08,0.12),wd2,x,(Y-0.08)/2,BC.z+z));
 P(B(2.3,0.12,0.04),gold,0,Y-0.12,BC.z+0.6);
 const TZP=g.children.slice(_n0).filter((o,i)=>i!==1),UMAT=g.children[_n0+1];
 /* seçkin vitrin (sağ duvar) */
 UVIT=new THREE.Group();UVIT.position.set(0.92,0,-3.62);g.add(UVIT);[[-0.83,1.15,0,0.05,2.3,0.5],[0.83,1.15,0,0.05,2.3,0.5],[0,2.28,0,1.7,0.06,0.5],[0,0.4,0,1.7,0.8,0.5]].forEach(([x,y,z,w,h,d])=>put(UVIT,B(w,h,d),wd,x,y,z));put(UVIT,B(1.6,2.0,0.03),M('#d9c49a',0.95),0,1.15,-0.2);
 [0.8,1.25,1.7,2.12].forEach(y=>put(UVIT,B(1.6,0.04,0.44),wd2,0,y-0.02,0.04));{const vl=new THREE.PointLight('#fff0c8',0.5,2.2);vl.position.set(0,1.9,0.15);UVIT.add(vl)}put(UVIT,B(0.08,2.3,0.04),gold,0.84,1.15,0.26);put(UVIT,B(0.08,2.3,0.04),gold,-0.84,1.15,0.26);put(UVIT,B(1.76,0.1,0.06),gold,0,2.32,0.26);
 const gl=put(UVIT,B(1.62,2.0,0.02),new THREE.MeshStandardMaterial({color:'#cfe8f0',transparent:true,opacity:0.16,roughness:0.1}),0,1.15,0.27);gl.castShadow=false;
 UVIT.userData.items=new THREE.Group();UVIT.add(UVIT.userData.items);
 /* avize */
 _n0=g.children.length;put(g,Cy(0.01,0.01,0.6,4),M('#3a2a1a'),0.1,3.0,0.2);put(g,Cy(0.35,0.2,0.08,12),gold,0.1,2.68,0.2);for(let i=0;i<8;i++){const t=i/8*Math.PI*2;put(g,new THREE.SphereGeometry(0.045,8,6),glow('#ffe9b0'),0.1+Math.cos(t)*0.33,2.74,0.2+Math.sin(t)*0.33)}
 const AVP=g.children.slice(_n0);const al=new THREE.PointLight('#ffcf8a',0.6,7);al.position.set(0.1,2.5,0.2);g.add(al);ustModels(g,WINP,SEDP,AVP,TZP,UMAT);
 /* aşağı inen merdiven ağzı (sol arka köşe) */
 UDOWN=new THREE.Group();UDOWN.position.set(-2.45,0,-3.3);g.add(UDOWN);put(UDOWN,B(0.9,0.02,1.1),M('#120a05',1),0,0.035,0);
 [[0,0.45,0.55,0.9,0.05,0.05],[0.45,0.45,0,0.05,0.05,1.1],[0.45,0.22,0.55,0.05,0.45,0.05],[0.45,0.22,-0.5,0.05,0.45,0.05]].forEach(([x,y,z,w,h,d])=>put(UDOWN,B(w,h,d),wd,x,y,z));
 for(let i=0;i<4;i++)put(UDOWN,B(0.86,0.03,0.2),wd2,0,0.0-i*0.12,-0.35+i*0.22);
 put(UDOWN,B(0.05,0.9,0.05),gold,0.45,0.45,0.55);g.remove(UDOWN);UDOWN=null}
/* alt katta yukarı çıkan merdiven */
function ustStairs(){if(USTR)return;USTR=new THREE.Group();USTR.position.set(-2.42,0,-3.42);S.add(USTR);const wd=M('#6a3d20',0.65),dk=M('#3a2213',0.7),br=M('#b8892f',0.35);
 put(USTR,Cy(0.05,0.05,3.3,10),dk,0,1.65,0);put(USTR,Cy(0.09,0.09,0.06,10),br,0,0.03,0);
 for(let i=0;i<12;i++){const a=-0.6+i*0.55,y=0.16+i*0.25,st=new THREE.Group();st.position.y=y;st.rotation.y=a;USTR.add(st);put(st,B(0.46,0.05,0.2),wd,0.26,0,0);put(st,Cy(0.012,0.012,0.6,6),br,0.48,0.3,0);put(st,B(0.06,0.06,0.2),dk,0.02,-0.01,0)}
 for(let i=0;i<12;i++){const a=-0.6+i*0.55;put(USTR,new THREE.SphereGeometry(0.022,8,6),M('#c9a23a',0.3),Math.cos(a)*0.48,0.16+i*0.25+0.6,-Math.sin(a)*0.48)}
 const sg=new THREE.Group();sg.position.set(0.32,1.35,0.42);USTR.add(sg);USTR.userData.sign=sg;ustMezz()}
/* dükkânın tavanı: koyu, sol arka köşede merdivenin yukarı çıktığı yuvarlak bir boşluk; içinden üst katın ışığı görünür */
function ustMezz(){const g=new THREE.Group();S.add(g);USTR.userData.mz=g;const cx=-2.42,cz=-3.42,y=3.4,hr=0.62;
 const sh=new THREE.Shape();sh.moveTo(-3.3,4.9);sh.lineTo(3.3,4.9);sh.lineTo(3.3,-4.3);sh.lineTo(-3.3,-4.3);sh.lineTo(-3.3,4.9);const ho=new THREE.Path();ho.absarc(cx,cz,hr,0,Math.PI*2,true);sh.holes.push(ho);
 const ce=new THREE.Mesh(new THREE.ShapeGeometry(sh,32),new THREE.MeshBasicMaterial({color:'#2a1c13',side:THREE.DoubleSide}));ce.rotation.x=Math.PI/2;ce.position.y=y;g.add(ce);
 const rim=new THREE.Mesh(new THREE.CylinderGeometry(hr,hr,0.22,32,1,true),new THREE.MeshBasicMaterial({color:'#7a4a22',side:THREE.BackSide}));rim.position.set(cx,y+0.11,cz);g.add(rim);
 const gl=new THREE.Mesh(new THREE.CircleGeometry(hr,32),new THREE.MeshBasicMaterial({color:'#d99a52'}));gl.rotation.x=Math.PI/2;gl.position.set(cx,y+0.22,cz);g.add(gl);
 const pl=new THREE.PointLight('#ffc878',0.3,2.4);pl.position.set(cx,y-0.3,cz);g.add(pl)}
function ustSign(){if(!USTR)return;const sg=USTR.userData.sign;sg.clear();const s=ustS(),c=document.createElement('canvas');c.width=256;c.height=96;const x=c.getContext('2d');x.fillStyle='#5c3520';x.beginPath();x.roundRect?x.roundRect(4,4,248,88,14):x.rect(4,4,248,88);x.fill();x.strokeStyle='#c9a23a';x.lineWidth=5;x.stroke();x.fillStyle='#f6e7c4';x.font='bold 40px Georgia,serif';x.textAlign='center';x.fillText(s.open?'Üst kat':'Üst kat 🔒',128,62);const t=new THREE.CanvasTexture(c);put(sg,B(0.01,0.3,0.01),M('#3a2213'),0,0.2,0);const m=put(sg,new THREE.PlaneGeometry(0.5,0.19),new THREE.MeshBasicMaterial({map:t,transparent:true}),0,0,0.01);m.rotation.y=0.35}
/* kat değiştirme: kraft grubunu içeren kapsayıcıları değil, kardeşlerini gizle */
function hasCraft(o){let q=craft;while(q){if(q===o)return true;q=q.parent}return false}
function ustHide(o){if(o===craft||o===UGRP||!o.visible)return;if(hasCraft(o)){o.children.forEach(ustHide);return}o.visible=false;UHID.push(o)}
function ustSwap(on){if(on===UF)return;UF=on;document.body.classList.toggle('uf',on);if(on){ustBuild();UHID=[];S.children.forEach(c=>{if(c===UGRP||c===craft||c.isLight||c.isPoints||c.isLineSegments||!c.visible)return;const b=new THREE.Box3().setFromObject(c);if(b.isEmpty())return;const ct=b.getCenter(V(0,0,0));if(Math.abs(ct.x)<3.4&&ct.z>-4.5&&ct.z<4.9&&ct.y<5)ustHide(c)});UGRP.visible=true;ustVitSync();ustFigs()}
 else{UGRP.visible=false;UHID.forEach(c=>c.visible=true);UHID=[];Q.forEach(c=>{if(c.g&&!c.at&&c.hidden)c.g.visible=false})}
 R.shadowMap.needsUpdate=true}
function ustGo(on){if(switching||G.phase!=='idle'&&on){if(on)toast('Önce sıradaki müşteriyle ilgilen',1500);return}switching=true;sfx.swoosh();ui.fade.style.opacity=1;setTimeout(()=>{ustSwap(on);switching=false;ui.fade.style.opacity=0;refresh();if(on){const s=ustS();toast(`Seçkin atölye<br><small>${s.ord.length?s.ord.length+' koleksiyoner siparişi bekliyor':'Şaheser üret, seçkin vitrine koy'}</small>`,1800)}},350)}
function ustActs(){const s=ustS();return [UPZ?btn('Kaldığın yerden devam','g',ustResume):btn('Şaheser üret','l',ustFree),btn('Seçkin vitrin','l',ustVitSheet),btn('Koleksiyoner'+(s.ord.length?`<i class="abd">${s.ord.length}</i>`:''),'l',ustBoard)]}
/* kat geçiş butonu: yuvarlak, hep aynı yerde; altta yukarı ok, üstte aşağı ok */
const ARW=d=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${d?'<path d="M12 5v14M6 13l6 6 6-6"/>':'<path d="M12 19V5M6 11l6-6 6 6"/>'}</svg>`;
function ustFlB(){let b=$('flB');const s=ustS(),pz=UF&&G.phase==='craft'&&K&&!K.dead&&!!G.step&&!K.res&&!switching&&ui.modal.classList.contains('hide'),vis=pz||view==='home'&&G.phase==='idle'&&!switching&&ui.modal.classList.contains('hide')&&((G.tier||1)>=UST.t||s.open);if(!b){b=document.createElement('button');b.id='flB';$('ui').appendChild(b);b.onclick=()=>{sfx.tap();if(UF&&G.phase==='craft'){ustPause();return}if(UF)ustGo(false);else if(ustS().open)ustGo(true);else ustUnlock()}}
 b.style.display=vis?'':'none';if(!vis)return;b.classList.toggle('cr',pz);const k=(pz?'p':UF?'d':'u')+(s.open?1:0)+(s.ord.length&&!UF?s.ord.length:0)+(UPZ?'z':'');if(b.dataset.k===k)return;b.dataset.k=k;b.classList.toggle('lk',!s.open);b.innerHTML=ARW(UF)+`<small>${pz?'Ara ver':UF?'Alt kat':'Üst kat'}</small>`+(UPZ&&!UF?'<i class="fbd fz">II</i>':'')+(!s.open?'<i class="flk">🔒</i>':s.ord.length&&!UF?`<i class="fbd">${s.ord.length}</i>`:'')}
setInterval(()=>{try{ustFlB()}catch(e){}},500);
function ustBtn(){const s=ustS();return btn((s.open?'Üst kat':'🔒 Üst kat')+(s.open&&s.ord.length?' · '+s.ord.length+' sipariş':''),s.open&&s.ord.length?'g':'l',()=>s.open?ustGo(true):ustUnlock())}
/* dokunma */
function ustTap(){if(view!=='home'||G.phase==='craft'||switching)return false;if(UF){if(UDOWN&&ray.intersectObject(UDOWN,true)[0]){ustGo(false);return true}if(UVIT&&ray.intersectObject(UVIT,true)[0]){ustVitSheet();return true}if(UCOL.some(f=>ray.intersectObject(f.w,true)[0])){sfx.tap();ustBoard();return true}return false}
 if(USTR&&USTR.visible&&ray.intersectObject(USTR,true)[0]){const s=ustS();if(s.open)ustGo(true);else ustUnlock();return true}return false}
function ustUnlock(){const s=ustS(),tk=(G.tier||1)>=UST.t,gk=G.gold>=UST.g;
 openSheet('ust',`<h3>Üst kat · Seçkin atölye</h3><p>Sadece şaheserlerin yapıldığı ayrı bir atölye: bağlama, sedef kakma sandık, nargile ve işlemeli tabanca. Her şaheserin sonunda kalite kontrolü var. Koleksiyonerler yüksek fiyat öder, seçkin vitrinde yavaş ama değerli satış olur.</p>
 <div class="row"><div class="n">Kademe ${UST.t} (Pîr)<small>Şu an Kademe ${G.tier||1}</small></div><b>${tk?'✓':'🔒'}</b></div><div class="row"><div class="n">${UST.g.toLocaleString('tr-TR')} altın<small>Altının: ${G.gold.toLocaleString('tr-TR')}</small></div><b>${gk?'✓':'✗'}</b></div>
 <div style="text-align:center;margin-top:10px"><button class="btn g" id="ustB" ${tk&&gk?'':'disabled'}>Üst katı aç</button></div>`+closeBtn);wire();
 const b=$('ustB');if(b)b.onclick=()=>{if((G.tier||1)<UST.t||G.gold<UST.g)return;G.gold-=UST.g;s.open=1;s.nx=NOW()+20;ustSign();sfx.fan();sfx.coin();save();hud();show(ui.modal,false);modalMode=null;toast('Üst kat açıldı!<br>Merdivene dokunup çık',2200);setTimeout(()=>ustGo(true),900)}}
/* koleksiyoner siparişleri */
function ustNewOrder(){const s=ustS(),L=ustProds();if(!L.length)return;const p=pick(L),used=new Set(s.ord.map(o=>o.ad));const nm=pick(COLN.filter(n=>!used.has(n)))||pick(COLN);
 s.ord.push({id:Date.now()+Math.floor(Math.random()*999),pid:p.id,ad:nm,budget:Math.round(p.base*(1.2+Math.random()*0.4)*payM()/50)*50,end:NOW()+5400});if(!UF)setTimeout(()=>toast(`Koleksiyoner ${nm} üst kata geldi<br><small>${p.ad} istiyor</small>`,2200),400)}
function ustTick(){try{ustFigs()}catch(e){}const s=ustS();if(!s.open||!G.started)return;const n=NOW();const before=s.ord.length;s.ord=s.ord.filter(o=>o.end>n);if(s.ord.length<before&&UF)toast('Bir koleksiyoner beklemekten vazgeçti',1600);
 if(s.ord.length<2&&n>=(s.nx||0)){ustNewOrder();s.nx=n+3000+Math.random()*1200;save();if(UF)refresh()}
 if(s.stock.length&&Math.random()<s.stock.length*10/5400){const i=Math.floor(Math.random()*s.stock.length),it=s.stock[i];s.stock.splice(i,1);G.gold+=it.price;if(G.st){G.st.earned+=it.price;G.st.sold++}sfx.cash&&sfx.cash();toast(`Seçkin vitrinden ${pr(it).ad} satıldı<br><b>+${it.price.toLocaleString('tr-TR')} altın</b>`,2400);ustVitSync();save();hud()}}
setInterval(()=>{try{ustTick()}catch(e){}},10000);
{const r0=R.render.bind(R);R.render=(s,c)=>{if(UF&&s===S){for(let i=0;i<UHID.length;i++)UHID[i].visible=false;for(let i=0;i<UCOL.length;i++)try{sitPose(UCOL[i])}catch(e){}}return r0(s,c)}}
setInterval(()=>{if(!UF)return;S.children.forEach(c=>{if(!c.visible||c===UGRP||c===craft||c.isLight||c.isPoints||c.isLineSegments||UHID.includes(c))return;const p=c.position;if(Math.abs(p.x)<3.4&&p.z>-4.5&&p.z<4.9&&p.y<5){let sk=false;c.traverse(o=>{if(o.isSkinnedMesh)sk=true});if(sk){c.visible=false;UHID.push(c)}}})},400);
const tLeft=o=>{const m=Math.max(0,Math.round((o.end-NOW())/60));return m>=60?Math.floor(m/60)+' sa '+(m%60)+' dk':m+' dk'};
const missOf=p=>Object.entries(p.need).filter(([k,n])=>k==='boya'?!anyPaint():(G.inv[k]||0)<n).map(([k,n])=>k==='boya'?'boya':MATS[k].ad+(n>1?' ×'+n:''));
function ustBoard(){const s=ustS();let h=`<h3>Koleksiyoner siparişleri</h3><p>Koleksiyonerler 4★ ve üstü şahesere bütçenin tamamını öder, 3★ ürünü %60'a alır. Yeni koleksiyoner yaklaşık saatte bir gelir.</p>`;
 h+=s.ord.length?s.ord.map(o=>{const p=PRODS.find(x=>x.id===o.pid),ms=missOf(p);return `<div class="row"><img class="ic" src="${ICON[p.id]}" alt=""><div class="n">${o.ad} · ${p.ad}<small>Bütçe <b>${o.budget.toLocaleString('tr-TR')} altın</b> · ${tLeft(o)} kaldı · ${p.steps.length} adım</small>${ms.length?`<small class="no">Eksik: ${ms.join(', ')}</small>`:''}</div><button class="btn g" data-uo="${o.id}" ${ms.length?'disabled':''}>Yap</button></div>`}).join(''):`<p class="dem">Şu an bekleyen koleksiyoner yok. Sıradaki ${Math.max(1,Math.round(((s.nx||0)-NOW())/60))} dk içinde gelir.</p>`;
 openSheet('ustord',h+closeBtn);wire();ui.sheet.querySelectorAll('[data-uo]').forEach(b=>b.onclick=()=>{const o=s.ord.find(x=>String(x.id)===b.dataset.uo);if(!o)return;const p=PRODS.find(x=>x.id===o.pid);ustStart(p,o)})}
function ustFree(){const L=ustProds();const h='<h3>Şaheser üret</h3><p>Seçkin vitrine koy; vitrin yavaş satar ama iyi fiyat alır.</p>'+L.map(p=>{const ms=missOf(p);return `<div class="row"><img class="ic" src="${ICON[p.id]}" alt=""><div class="n">${p.ad}<small>${ms.length?'<span class="no">Eksik: '+ms.join(', ')+'</span>':'Malzemeler tamam · '+p.steps.length+' adım'}</small></div><button class="btn" data-uf="${p.id}" ${ms.length?'disabled':''}>Üret</button></div>`}).join('');
 openSheet('ustfree',h+closeBtn);wire();ui.sheet.querySelectorAll('[data-uf]').forEach(b=>b.onclick=()=>ustStart(PRODS.find(x=>x.id===b.dataset.uf),null))}
function ustStart(p,o){if(UPZ){toast('Önce yarım kalan şaheseri bitir',1500);return}if(!p||!hasNeed(p)||G.phase!=='idle')return;const s=ustS();if(!o&&s.stock.length>=UST.vcap&&(G.store||[]).length>=stoCap()){toast('Seçkin vitrin ve depo rafı dolu',1600);return}show(ui.modal,false);modalMode=null;G.order={p,color:null,style:null,budget:o?o.budget:p.base,free:true,ust:1,coll:o?o.id:null};startCraft()}
/* kraft bitince (serbest üretim yolundan) */
function ustResult(){G.phase='result';refresh();const it=K.res.item,o=G.order,s=ustS(),co=o.coll&&s.ord.find(x=>x.id===o.coll),pct=v=>'%'+Math.round(v*100);sfx.good();
 it.price=Math.round(itemVal(it)*1.1/10)*10;const ok=co&&it.stars>=4,low=co&&it.stars===3?Math.round(co.budget*0.6/10)*10:0,pay=co?Math.round(co.budget*(it.stars>=5?1:0.85)*(it.mq?1.25:1)/10)*10:0;K.res.ustPay=ok?pay:0;
 tip(null);openSheet('result',`<h3>${pr(it).ad} hazır</h3>${it.mq?'<div class="mqB">✨ Usta işi! ✨</div>':''}`+resSum(it.stars)+
 (co?(ok?`<div class="rtot"><span>${co.ad} ödüyor</span><b>${pay.toLocaleString('tr-TR')} altın</b></div>`:`<div class="uxF">${co.ad} tam ödeme için en az 4★ istiyor${low?`<br><small>3★ ürünü bütçenin %60'ına (<b>${low.toLocaleString('tr-TR')} altın</b>) alabilir ya da ürünü vitrine koyup siparişi açık bırakabilirsin</small>`:'<br><small>Ürün seçkin vitrine konur, sipariş açık kalır</small>'}</div>`):`<div class="rtot"><span>Seçkin vitrin fiyatı</span><b>${it.price.toLocaleString('tr-TR')} altın</b></div>`)+
 `<div style="text-align:center;display:flex;gap:8px;justify-content:center;flex-wrap:wrap">${low?'<button class="btn g" id="ustLow">Koleksiyonere ver</button>':''}<button class="btn ${low?'l':'g'}" id="ustOk">${ok?'Koleksiyonere teslim et':'Seçkin vitrine koy'}</button></div>`);$('ustOk').onclick=()=>ustDone(ok,co);if(low)$('ustLow').onclick=()=>{K.res.ustPay=low;ustDone(true,co)}}
function ustDone(ok,co){show(ui.modal,false);modalMode=null;const it=K.res.item,s=ustS(),w=K.work,g=K.model.g;
 if(ok){const pay=K.res.ustPay;G.gold+=pay;G.st.earned+=pay;G.st.deliv++;chDeliv();G.rep+=it.stars>=5?8:it.stars>=4?5:2;s.ord=s.ord.filter(x=>x!==co);G.st.ckol=(G.st.ckol||0)+1;sfx.cash();setTimeout(()=>gemRoll(GEM_P.bes,'Koleksiyoner elmas hediye etti!'),1500);toast(`+${pay.toLocaleString('tr-TR')} altın · +${it.stars>=5?8:it.stars>=4?5:2} itibar`,2000)}
 else if(s.stock.length<UST.vcap){s.stock.push(it);toast('Seçkin vitrine kondu',1400)}else{(G.store=G.store||[]).push(it);storeSync();toast('Seçkin vitrin dolu, ürün depo rafına kondu',1800)}
 if(it.stars>=3){const e=G.cat[it.pid]||(G.cat[it.pid]={n:0,best:0});e.n++;e.best=Math.max(e.best,it.stars)}
 tween(0.3,k=>g.scale.setScalar(Math.max(0.01,0.8*(1-k))),()=>craft.remove(w));G.phase='idle';G.order=null;ustVitSync();levelUp();save();refresh()}
/* seçkin vitrin */
function ustVitSync(){if(!UVIT)return;const ig=UVIT.userData.items;ig.clear();ustS().stock.forEach((it,i)=>{const p=pr(it);if(!p)return;try{const m0=p.build(it.col?paintOf(it.col).hex:p.sheet).g,m=new THREE.Group();m.add(m0);let b=new THREE.Box3().setFromObject(m0),z=b.getSize(V(0,0,0));if(p.vrot)m0.rotation.set(p.vrot[0],p.vrot[1],p.vrot[2]);else if(z.y<0.35*Math.max(z.x,z.z)){m0.rotation.x=z.z>z.x?-1.25:0;if(z.x>=z.z){m0.rotation.x=-1.25;m0.rotation.z=0}}m0.updateMatrixWorld(true);b=new THREE.Box3().setFromObject(m0);z=b.getSize(V(0,0,0));const k=Math.min(UVW/Math.max(z.x,0.01),UVH/Math.max(z.y,0.01),0.34/Math.max(z.z,0.01));m.scale.setScalar(k);m0.position.set(-(b.min.x+b.max.x)/2,-b.min.y,-(b.min.z+b.max.z)/2);{const q=UVP[i]||UVP[0];m.position.set(q[0],q[1],0.02)};ig.add(m)}catch(e){}});R.shadowMap.needsUpdate=true}
function ustVitSheet(){const s=ustS();let h=`<h3>Seçkin vitrin <small>${s.stock.length}/${UST.vcap}</small></h3><p>Buradaki şaheserler kendiliğinden, ortalama 1–1,5 saatte bir satılır.</p>`;
 h+=s.stock.length?s.stock.map((it,i)=>`<div class="row"><img class="ic" src="${ICON[it.pid]}" alt=""><div class="n">${pr(it).ad}<small>${desc(it)} · ${'★'.repeat(it.stars)} · ${it.price.toLocaleString('tr-TR')} altın</small></div><button class="btn l" data-us="${i}">Depoya al</button></div>`).join(''):'<p class="dem">Vitrin boş. "Şaheser üret" ile doldur.</p>';
 openSheet('ustvit',h+closeBtn);wire();ui.sheet.querySelectorAll('[data-us]').forEach(b=>b.onclick=()=>{const it=s.stock.splice(+b.dataset.us,1)[0];if(it){(G.store=G.store||[]).push(it);storeSync()}ustVitSync();save();ustVitSheet()})}
/* başlangıç */
setTimeout(()=>{try{ustStairs();ustSign();ustS()}catch(e){}},300);

/* koleksiyoner figürleri: bekleyen her sipariş için üst katta bir koleksiyoner (Takım elbiseli / Maceracı) durur; dokununca sipariş listesi açılır */
let UCOL=[];const UCSL=[[-1.42,-3.36,0.15],[-0.64,-3.36,-0.1]];
function ustFigs(){const s=ustS(),want=UF&&s.open?s.ord.slice(0,2):[];
 UCOL=UCOL.filter(f=>{if(want.some(o=>o.id===f.id))return true;UGRP.remove(f.w);const i=MIX.indexOf(f.mx);if(i>=0)MIX.splice(i,1);return false});
 ustKing();const src=['m_Suit','c_advent'].map(n=>CHR.find(g=>g.nm===n)).concat(UKING?[UKING]:[]).filter(Boolean);if(!src.length||!THREE.SkeletonUtils)return;
 want.forEach(o=>{if(UCOL.some(f=>f.id===o.id))return;const used=UCOL.map(f=>f.slot),slot=[0,1].find(k=>!used.includes(k));if(slot==null)return;
  const fr=src.filter(x=>!UCOL.some(f=>f.src===x));if(!fr.length)return;const g=fr[o.id%fr.length],m=THREE.SkeletonUtils.clone(g.scene),w=new THREE.Group(),sc=1.72/g.h;m.scale.multiplyScalar(sc);m.position.y=-g.y0*sc;if(Math.abs(g.cx||0)>0.3||Math.abs(g.cz||0)>0.3){m.position.x=-g.cx*sc;m.position.z=-g.cz*sc}
  m.traverse(q=>{if(q.isMesh){q.frustumCulled=false;q.castShadow=true}});w.add(m);const L=UCSL[slot];w.position.set(L[0],0,L[1]);w.rotation.y=L[2];UGRP.add(w);
  const mx=new THREE.AnimationMixer(m),cl=g.animations.find(c=>c.name==='idle')||g.animations[0];if(cl){const a=mx.clipAction(cl);a.time=Math.random()*cl.duration;a.play()}MIX.push(mx);
  const F={id:o.id,slot,src:g,w,mx,m,ry:L[2]};sitInit(F);UCOL.push(F);w.scale.setScalar(0.01);tween(0.45,k=>w.scale.setScalar(Math.max(0.01,1-Math.pow(1-k,3))))})}
let UKING=null,UKL=false;function ustKing(){if(UKL||!THREE.GLTFLoader)return;UKL=true;new THREE.GLTFLoader().load(AU('models/m_King.glb'),g=>{g.nm='m_King';prepModel(g.scene);const bb=new THREE.Box3().setFromObject(g.scene);g.h=bb.max.y-bb.min.y;g.y0=bb.min.y;g.cx=(bb.min.x+bb.max.x)/2;g.cz=(bb.min.z+bb.max.z)/2;UKING=g;try{ustFigs()}catch(e){}},undefined,()=>{})}
/* oturma: modellerde oturma animasyonu yok; aynı iskelet adlarını (UpperLeg/LowerLeg/Foot) kullanan her karakterde
   bacak kemikleri her karede dünya yönüne göre çevrilir (uyluk öne, baldır aşağı) ve figür sedire indirilir */
const _sa=new THREE.Vector3(),_sb=new THREE.Vector3(),_sq=new THREE.Quaternion(),_sw=new THREE.Quaternion(),_sp=new THREE.Quaternion();
function sitBone(m,re){let r=null;m.traverse(o=>{if(!r&&o.isBone&&re.test(o.name))r=o});return r}
function sitAim(b,dir){b.getWorldQuaternion(_sw);_sb.set(0,1,0).applyQuaternion(_sw).normalize();_sq.setFromUnitVectors(_sb,dir);_sw.premultiply(_sq);b.parent.getWorldQuaternion(_sp);b.quaternion.copy(_sp.invert().multiply(_sw));b.updateMatrixWorld(true)}
function sitInit(F){const m=F.m,L={};['L','R'].forEach(k=>{L[k]={u:sitBone(m,new RegExp('^UpperLeg\\.?'+k+'$')),l:sitBone(m,new RegExp('^LowerLeg\\.?'+k+'$')),f:sitBone(m,new RegExp('^Foot\\.?'+k+'$'))}});
 if(!L.L.u||!L.L.l||!L.L.f||!L.R.u||!L.R.l||!L.R.f)return;F.w.updateMatrixWorld(true);['L','R'].forEach(k=>{const g=L[k];g.l.getWorldPosition(_sa);g.f.getWorldPosition(_sb);g.len=_sa.distanceTo(_sb)});
 F.legs=L;L.L.u.getWorldPosition(_sa);F.hip=_sa.y-F.w.position.y;F.w.position.y=USEAT+0.08-F.hip;sitPose(F)}
/* ayak kemiği bacak zincirinin çocuğu değil (IK hedefi), bu yüzden baldırın ucuna ayrıca taşınır */
function sitPose(F){if(!F.legs||!F.w.parent)return;F.w.updateMatrixWorld(true);const s=Math.sin(F.ry),c=Math.cos(F.ry);
 ['L','R'].forEach((k,i)=>{const g=F.legs[k],sp=(i?-1:1)*0.1,th=new THREE.Vector3(s+c*sp,-0.06,c-s*sp).normalize(),sh=new THREE.Vector3(s*0.12,-1,c*0.12).normalize();sitAim(g.u,th);sitAim(g.l,sh);
  if(g.f.parent!==g.l){g.l.getWorldPosition(_sa);_sa.addScaledVector(sh,g.len);g.f.parent.worldToLocal(_sa);g.f.position.copy(_sa);g.f.updateMatrixWorld(true)}})}
/* usta tezgâhı: masa modeli tezgâh ölçüsüne (üstü Y'de, 2,4 × 1,2) gerilir, ahşap/ferforje renge boyanır */
function ustDesk(g,TZP,UMAT){glb('m_utezg',src=>{const m=src.scene.clone(),w=new THREE.Group();m.rotation.y=-Math.PI/2;w.add(m);m.updateMatrixWorld(true);let b=new THREE.Box3().setFromObject(m),z=b.getSize(V(0,0,0));
 m.scale.set(1.2/z.z,Y/z.y,2.4/z.x);m.updateMatrixWorld(true);b=new THREE.Box3().setFromObject(m);m.position.set(-(b.min.x+b.max.x)/2,-b.min.y-0.004,-(b.min.z+b.max.z)/2);w.position.set(0,0,BC.z);g.add(w);
 m.traverse(o=>{if(o.isMesh){o.castShadow=o.receiveShadow=true;const ms=Array.isArray(o.material)?o.material:[o.material];o.material=ms.map(q=>/Wood/.test(q.name)?M('#5a321b',0.6):/Gray/.test(q.name)?M('#7a5a2a',0.5):M('#2b2420',0.55));if(o.material.length===1)o.material=o.material[0]}});TZP.forEach(o=>o.visible=false);
 /* L tablası ürünleri taşırıyordu: modelin tablası gizlenir, yerine tezgâhı tam kaplayan geniş ahşap tabla konur */
 m.traverse(o=>{if(o.isMesh){o.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(o);if(bb.max.y>Y-0.06&&bb.max.y-bb.min.y<0.12)o.visible=false}});
 const tw=M('#5a321b',0.6),tp=put(g,B(2.6,0.06,1.3),tw,0,Y-0.03,BC.z);tp.castShadow=tp.receiveShadow=true;put(g,B(2.64,0.025,1.34),M('#3e2213',0.6),0,Y-0.07,BC.z);
 if(UMAT){UMAT.scale.set(2.3/1.5,1,1.1/0.9);UMAT.position.set(0,Y+0.001,BC.z)}})}
/* üst kat oda modelleri: yüklenince yerlerindeki basit parçalar gizlenir */
let USEAT=0.52,UVP=[[-0.4,1.25],[0.4,1.25],[-0.4,1.7],[0.4,1.7],[-0.4,2.12],[0.4,2.12]],UVW=0.6,UVH=0.38;
function ustModels(g,WINP,SEDP,AVP,TZP,UMAT){const hide=a=>a.forEach(o=>o.visible=false);ustDesk(g,TZP,UMAT);
 {const old=UVIT.children.filter(o=>o!==UVIT.userData.items&&!o.isLight);place('m_vitrin',{par:UVIT,h:2.6,x:-0.47,y:0,z:-0.02,cb:w=>{w.traverse(o=>{if(o.isMesh){o.material=o.material.clone();if(o.material.transparent){o.material.color.set('#dfeef2');o.material.opacity=0.22;o.material.depthWrite=false;o.castShadow=false}else if(/_1$/.test(o.material.name))o.material.color.set('#2a1a10');else o.material.color.set('#5a321b')}});hide(old);UVP=[[-0.47,1.34],[0.47,1.34],[-0.47,0.71],[0.47,0.71],[-0.47,1.97],[0.47,1.97]];UVW=0.64;UVH=0.5;ustVitSync()}});place('m_vitrin',{par:UVIT,h:2.6,x:0.47,y:0,z:-0.02,cb:w=>{w.traverse(o=>{if(o.isMesh){o.material=o.material.clone();if(o.material.transparent){o.material.color.set('#dfeef2');o.material.opacity=0.22;o.material.depthWrite=false;o.castShadow=false}else if(/_1$/.test(o.material.name))o.material.color.set('#2a1a10');else o.material.color.set('#5a321b')}});}})}
 place('m_uwin',{par:g,h:1.62,x:-1.3,y:1.36,z:-3.78,cb:w=>{w.traverse(o=>{if(o.isMesh){const ms=Array.isArray(o.material)?o.material:[o.material];o.material=ms.map(m=>/Windows/.test(m.name)?glow('#ffe6a8'):(m=m.clone(),/Wood/.test(m.name)&&m.color.set(/Light/.test(m.name)?'#6b3c1f':'#4a2a16'),/Stone/.test(m.name)&&m.color.set('#cbb894'),m));if(o.material.length===1)o.material=o.material[0]}});hide(WINP)}});
 place('m_sedir',{par:g,w:2.3,x:-1.5,y:0,z:-3.52,cb:w=>{w.updateMatrixWorld(true);const rc=new THREE.Raycaster(V(-1.5,3,-3.4),V(0,-1,0)),h=rc.intersectObject(w,true)[0];if(h)USEAT=h.point.y;w.traverse(o=>{if(o.isMesh){const ms=Array.isArray(o.material)?o.material:[o.material];o.material=ms.map((m,i)=>{m=m.clone();m.color.set(i?'#5a1a1e':'#7e2228');m.roughness=0.8;return m});if(o.material.length===1)o.material=o.material[0]}});hide(SEDP);UCOL.forEach(f=>{if(f.legs)f.w.position.y=USEAT+0.08-f.hip})}});
 place('m_avize',{par:g,h:0.95,x:0.1,y:2.44,z:-0.4,cb:w=>{w.traverse(o=>{if(o.isMesh){const ms=Array.isArray(o.material)?o.material:[o.material];o.material=ms.map(m=>/FFEB3B/i.test(m.name)?glow('#ffd36a'):/DD9944/i.test(m.name)?M('#b8862c',0.35):/FFFFFF/i.test(m.name)?M('#f3ead8',0.6):m);if(o.material.length===1)o.material=o.material[0];o.castShadow=false}});hide(AVP)}})}
/* şaheser molası: üst kattaki kraft o adımın başına geri sarılıp bekletilir; alt katta müşteriyle ilgilenip dönünce devam edilir */
let UPZ=null;
function ustPause(){if(!UF||G.phase!=='craft'||!K||K.dead||!G.step||K.res||switching)return;hookClear();try{toolUp&&toolUp()}catch(e){}try{if(typeof TOOL!=='undefined'&&TOOL)TOOL.visible=false}catch(e){}
 K.drag=null;K.holding=false;K.rubbing=false;if(K.dot)K.dot.live=false;if(K.kids0)K.work.children.slice().forEach(c=>{if(!K.kids0.has(c))K.work.remove(c)});if(K.parts0)K.parts=K.parts0;K.pstep=-1;K.sheet=null;K.camSh=0;K.liftOn=0;
 UPZ={K,order:G.order};G.ustPz={pid:K.p.id};tip(null);craft.remove(K.work);G.step=null;K=null;G.order=null;G.phase='idle';actions([]);ui.act.innerHTML='';Q.forEach(c=>c.g.visible=true);view='home';sway=1;moveCam(VIEWS.home,0.5);save();refresh();
 setTimeout(()=>{ustGo(false);setTimeout(()=>toast('Şaheser beklemede<br><small>Üst kata çıkınca kaldığın adımdan devam edersin</small>',2200),500)},250)}
function ustResume(){if(!UPZ||!UF||G.phase!=='idle'||switching)return;const z=UPZ;UPZ=null;G.ustPz=null;K=z.K;G.order=z.order;craft.add(K.work);G.phase='craft';say(null);G.bubOn=false;actions([]);view='bench';sway=0;refresh();moveCam(VIEWS.bench,0.9,()=>{if(!K||K.dead)return;K.si-=1;nextStep()})}
