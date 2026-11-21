/* ---------- çoban: çiftlikte dolaşır, hayvan ürünlerini toplar (oto / koşullu / pasif) ---------- */
OTO_COST.coban=150;
const CBP=[[-1.85,-1.5],[0,-1.5],[1.85,-1.5],[-1.85,1.0],[0,1.0],[1.85,1.0],[-1.85,3.5],[0,3.5],[1.85,3.5]].map(q=>V(FX+q[0],0,q[1]+0.85));
const farmColl=()=>COLL.filter(o=>Math.abs(o.position.x-FX)<4.6&&o.position.z>-3);
function cobCollect(o){const c=o.userData.coll;if(!c.alive||!gOpen(c.src)||hzOf(c.src))return 0;if(invTotal()+1>capOf('d'))return 0;
 c.alive=false;c.t=NOW()+(RTM[c.mat]||c.rt||60);const yq=({yun:2})[c.mat]||1;G.inv[c.mat]+=yq;G.st.coll++;
 if(view==='bahce'){const y0=o.position.y;tween(0.3,k=>{o.scale.copy(c.base).multiplyScalar(Math.max(0.01,1-k));o.position.y=y0+k*0.35},()=>{o.visible=false;o.position.y=y0})}else o.visible=false;return yq}
function cobPlan(){const m=otoMode('coban');if(m==='pasif')return [];let L=farmColl().filter(o=>o.userData.coll.alive);
 if(m==='kosul'){const r=otoNeeds().raw;L=L.filter(o=>r[o.userData.coll.mat]>0)}return L}
function cobRun(L,quiet){if(view==='bahce'&&COB&&L.length){COB.tasks=L.slice().sort((a,b)=>COB.g.position.distanceTo(a.position)-COB.g.position.distanceTo(b.position));COB.got={};COB.quiet=quiet;COB.goal=null;COB.w=0;return L.length}return cobInstant(L,quiet)}
function cobInstant(L,quiet){const got={};L.forEach(o=>{const n=cobCollect(o);if(n)got[o.userData.coll.mat]=(got[o.userData.coll.mat]||0)+n});
 const ks=Object.keys(got);if(ks.length){if(!quiet)toast('🐑 Çoban topladı: '+ks.map(k=>MATS[k].ad+' +'+got[k]).join(', '),2200);save();refresh()}return ks.length}
function cobanTick(){if(!G.coban||fOff('coban',true))return;if(G.cobanLast==null)G.cobanLast=NOW()-OTO_P;const m=otoMode('coban');if(m==='pasif')return;
 if(m==='kosul'){const L=cobPlan();if(L.length&&NOW()-(G.cobK||0)>60){G.cobK=NOW();cobRun(L)}return}
 const n=Math.floor((NOW()-G.cobanLast)/OTO_P);if(n<=0)return;G.cobanLast=NOW();cobRun(cobPlan(),view!=='bahce')}
function cobanNow(){if(fOff('coban'))return;if(!G.coban){toast('Çoban Ticaret menüsünden alınır',1500);return}sfx.tap();
 if(COB&&COB.tasks&&COB.tasks.length){toast('Çoban zaten topluyor',1200);return}
 const L=farmColl().filter(o=>{const c=o.userData.coll;return c.alive&&gOpen(c.src)&&!hzOf(c.src)});
 if(!L.length){toast('Şu an toplanacak hayvan ürünü yok<br><small>Hayvanlar ürün verince çobana tekrar dokun</small>',1800);if(COB){COB.goal=null;COB.w=2.5;anim(COB,'work')}return}
 if(invTotal()+1>capOf('d')){toast('Depo dolu, çoban toplayamıyor',1600);return}
 G.cobanLast=NOW();toast('Çoban topluyor…',1000);cobRun(L)}
/* görünüş: Adventurer (x_coban) modeli varsa o, yoksa çiftçi modeli + elde asa */
let COB=null,COBL=null;
function cobStaff(){const g=new THREE.Group(),wd=M('#5a3519');const s=put(g,Cy(0.032,0.038,1.6,7),wd,0,0.8,0);const c=new THREE.Mesh(new THREE.TorusGeometry(0.11,0.024,6,12,Math.PI*1.25),wd);c.position.set(0.1,1.58,0);c.rotation.z=-0.2;g.add(c);return g}
function cobMake(){const src=CHX.x_coban||CHR.find(g=>g.nm==='c_farmer');if(!src)return null;const c=makeCustomer(src);c.cob=true;c.g.scale.multiplyScalar(0.8);c.g.position.copy(CBP[4]);anim(c,'idle');
 const st=cobStaff();st.position.set(0.32,0,0.08);c.g.add(st);c.staff=st;c.hand=['WristR','Wrist.R','HandR','FistR'].map(n=>c.g.getObjectByName(n)).find(Boolean);c.goal=null;c.w=2;const hb=new THREE.Mesh(new THREE.CylinderGeometry(0.45,0.45,2,8),new THREE.MeshBasicMaterial({visible:false}));hb.position.y=1;c.g.add(hb);c.hit=hb;return c}
const CTV=new THREE.Vector3();function cobHand(c){if(!c.hand||!c.staff)return;c.g.updateMatrixWorld(true);CTV.setFromMatrixPosition(c.hand.matrixWorld);c.g.worldToLocal(CTV);c.staff.position.set(CTV.x,CTV.y-0.92,CTV.z+0.02)}
function cobLabel(){if(!G.coban||COBL)return;COBL=label('bahce',V(FX,0.02,0),'',true);COBL.el.classList.add('sm');COBL.el.onclick=cobanNow}
function cobTick(dt){if(!G.coban)return;cobLabel();if(view!=='bahce'){if(COB&&COB.tasks&&COB.tasks.length){const L=COB.tasks;COB.tasks=null;COB.goal=null;cobInstant(L,true)}return}if(!COB){COB=cobMake();if(!COB)return}
 const c=COB,g=c.g;cobHand(c);COBL.pos.set(g.position.x,0.02,g.position.z+0.35);
 {const m=otoMode('coban'),t=c.tasks&&c.tasks.length?`🐑 Çoban<small>Topluyor · ${c.tasks.length} kaldı</small>`:`🐑 Çoban<small>${m==='oto'?'Oto · '+fmtT(Math.max(0,OTO_P-(NOW()-(G.cobanLast||0))))+' · dokun: şimdi':m==='kosul'?'Koşullu · dokun: şimdi':'Pasif · dokun: şimdi'}</small>`;if(t!==COBL.last){COBL.el.innerHTML=t;COBL.last=t}}
 if(c.tasks&&c.tasks.length){const o=c.tasks[0];if(!c.goal){c.goal=V(o.position.x,0,o.position.z+0.45);c.w=0}
  const ddx=c.goal.x-g.position.x,ddz=c.goal.z-g.position.z;if(Math.hypot(ddx,ddz)<0.08){if(c.cur!=='work'){anim(c,'work');c.w=0.45}c.w-=dt;if(c.w>0)return;
   c.tasks=c.tasks.filter(q=>{if(q!==o&&Math.hypot(q.position.x-o.position.x,q.position.z-o.position.z)>1.1)return true;const n=cobCollect(q);if(n){const k=q.userData.coll.mat;c.got[k]=(c.got[k]||0)+n}return false});c.goal=null;if(c.tasks.length)c.tasks.sort((a,b)=>g.position.distanceTo(a.position)-g.position.distanceTo(b.position));
   if(!c.tasks.length){const ks=Object.keys(c.got);if(ks.length){if(!c.quiet)toast('Çoban topladı: '+ks.map(k=>MATS[k].ad+' +'+c.got[k]).join(', '),2200);save();refresh()}c.w=2;anim(c,'idle')}return}}
 else if(!c.goal){c.w-=dt;if(c.w<=0){c.goal=pick(CBP).clone();c.goal.x+=(Math.random()-0.5)*0.6}return}
 const dx=c.goal.x-g.position.x,dz=c.goal.z-g.position.z,d=Math.hypot(dx,dz);
 if(d<0.05&&!(c.tasks&&c.tasks.length)){c.goal=null;c.w=3+Math.random()*5;anim(c,Math.random()<0.5?'work':'idle');return}
 const sp=Math.min(d,(c.tasks&&c.tasks.length?2.3:0.75)*dt);g.position.x+=dx/d*sp;g.position.z+=dz/d*sp;let a=Math.atan2(dx,dz)-g.rotation.y;a=Math.atan2(Math.sin(a),Math.cos(a));g.rotation.y+=a*Math.min(1,dt*6);if(c.cur!=='walk')anim(c,'walk')}
