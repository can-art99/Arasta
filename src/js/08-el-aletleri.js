/* ---------- el aletleri ---------- */
const TOOL=new THREE.Group();TOOL.visible=false;TOOL.userData={t:null,down:false,last:0,mv:0,lp:null};S.add(TOOL);const TL={};
function tl(n,fn){const g=new THREE.Group(),inner=new THREE.Group();g.add(inner);fn(inner,g);g.visible=false;TOOL.add(g);TL[n]=g;return g}
const steel=M('#c8ccd0',0.25);
tl('sc',(i,g)=>{i.position.set(0,0.02,0.11);i.rotation.x=-0.3;[1,-1].forEach(sg=>{const bl=new THREE.Group();put(bl,B(0.014,0.004,0.13),steel,0,0,-0.065);const h=put(bl,new THREE.TorusGeometry(0.026,0.008,5,14),M('#b5533c'),sg*0.02,0,0.05);h.rotation.x=Math.PI/2;i.add(bl);g.userData[sg>0?'a':'b']=bl});put(i,Cy(0.008,0.008,0.012,8),M('#4a4a50'),0,0.004,0)});
function brushT(n,tip){tl(n,(i,g)=>{i.rotation.x=0.55;const t=put(i,new THREE.ConeGeometry(0.016,0.05,8),M(tip,0.9),0,0.025,0);t.rotation.x=Math.PI;g.userData.tip=t;put(i,Cy(0.013,0.013,0.035,8),M('#b8bcc0',0.35),0,0.065,0);put(i,Cy(0.009,0.012,0.2,8),M('#a0703c'),0,0.18,0)})}
brushT('br','#6e3d1f');brushT('gl','#efe6c8');
/* fırçaların gerçek modeli yüklenince el aletini değiştir: uç aşağıda, sap yukarıda */
setTimeout(()=>[['br','m_brushP',0.24],['gl','m_glue',0.2]].forEach(([n,m,L])=>glb(m,g=>{try{const i=TL[n].children[0];let o=g.scene.clone(true);if(n==='gl'){const w=new THREE.Group();o.rotation.x=Math.PI;w.add(o);o.updateMatrixWorld(true);o=w}const bb=new THREE.Box3().setFromObject(o),h=bb.max.y-bb.min.y;o.scale.setScalar(L/h);o.position.y=-bb.min.y*L/h;
 let tip=null;o.traverse(x=>{if(x.isMesh){x.castShadow=true;x.material=x.material.clone();const nm=x.material.name;if(n==='br'&&nm==='039BE5')tip=x;if(n==='gl'&&/cap/i.test(x.name))tip=x}});
 i.children.slice().forEach(c=>i.remove(c));i.add(o);if(tip)TL[n].userData.tip=tip}catch(e){}})),0);
tl('sw',(i)=>{i.rotation.x=-0.25;i.position.set(0,0.03,0.08);const b=put(i,B(0.05,0.003,0.2),steel,0,0,-0.06);for(let j=0;j<10;j++)put(i,B(0.008,0.003,0.008),steel,-0.027,0,-0.15+j*0.019).rotation.y=0.78;put(i,B(0.04,0.05,0.08),M('#8a3a20'),0,0.012,0.08)});
tl('ax',(i)=>{i.rotation.x=0.75;put(i,Cy(0.008,0.009,0.24,8),M('#6b4528'),0,0.14,0.03).rotation.x=0.15;put(i,B(0.012,0.06,0.07),steel,0,0.03,0)});
tl('gc',(i)=>{i.rotation.x=-0.3;i.position.set(0,0.012,0);put(i,B(0.012,0.004,0.06),M('#d8dde0',0.2),0,0,-0.03);put(i,Cy(0.009,0.011,0.12,8),M('#2f6b8a',0.5),0,0,0.08).rotation.x=Math.PI/2});
tl('blk',(i)=>{put(i,B(0.15,0.045,0.095),M('#c9955a'),0,0.035,0);put(i,B(0.15,0.012,0.095),M('#8a8478',1),0,0.006,0)});
tl('kn',(i)=>{i.rotation.x=-0.5;const b=put(i,new THREE.CylinderGeometry(0.055,0.055,0.006,16,1,false,-Math.PI/2,Math.PI),steel,0,0.004,0.0);put(i,B(0.024,0.022,0.12),M('#5a3519'),0,0.012,0.11)});
tl('cl',(i)=>{const c=put(i,new THREE.SphereGeometry(0.07,10,6),M('#efe2c4',1),0,0.022,0);c.scale.set(1.15,0.38,0.9);const c2=put(i,new THREE.SphereGeometry(0.04,8,6),M('#e2d2ae',1),0.03,0.04,0.02);c2.scale.set(1,0.6,1)});
tl('nd',(i)=>{i.rotation.x=0.45;put(i,Cy(0.0035,0.002,0.16,6),steel,0,0.08,0);const th=put(i,Cy(0.002,0.002,0.12,4),M('#b5533c'),0.015,0.12,0.02);th.rotation.z=0.5});
tl('pn',(i)=>{i.rotation.x=0.35;put(i,Cy(0.014,0.01,0.12,10),steel,0,0.06,0);put(i,Cy(0.026,0.026,0.05,10),M('#5a3519'),0,0.145,0)});
function toolSet(t){if(TOOL.userData.t===t)return;TOOL.userData.t=t;for(const k in TL)TL[k].visible=k===t;TOOL.rotation.set(0,0,0)}
function toolAt(p,t,y){toolSet(t);const U=TOOL.userData;TOOL.visible=true;U.down=true;U.last=tt;const yy=y!=null?y:(K?K.top:Y)+0.004;
if(U.lp){const dx=p.x-U.lp.x,dz=p.z-U.lp.z,d=Math.hypot(dx,dz);if(d>0.003){U.mv=tt;U.dist=(U.dist||0)+d;if(t==='sw'){const inn=TL.sw.children[0];inn.rotation.x+=((-0.25-clamp(dz*10,-0.09,0.09))-inn.rotation.x)*0.35}if(t==='sc'||t==='kn'||t==='sw'||t==='gc'){const tg=Math.atan2(-dx,-dz);let a=tg-TOOL.rotation.y;a=Math.atan2(Math.sin(a),Math.cos(a));TOOL.rotation.y+=a*0.35}}}
U.lp=p.clone();TOOL.position.set(p.x,yy,p.z);if(t==='ax'){const a=TL.ax.children[0];a.rotation.x=0.75-Math.abs(Math.sin(tt*16))*0.55;if(tt-(U.ch||0)>0.22){U.ch=tt;noise(0.05,0.06,700,0.6,0,250)}}}
function toolUp(){TOOL.userData.down=false;TOOL.userData.lp=null}
function stab(pos,k){const t={dik:'nd',yapistir:'gl',delik:'pn'}[k];if(!t)return;toolSet(t);TOOL.visible=true;const U=TOOL.userData;U.down=false;U.last=tt+0.3;TOOL.rotation.set(0,0,0);
TOOL.position.set(pos.x,pos.y,pos.z);tween(0.22,k2=>TOOL.position.y=pos.y+0.004+Math.abs(1-2*k2)*0.12)}
function toolTick(){const U=TOOL.userData;if(!TOOL.visible)return;if(G.phase!=='craft'||(!U.down&&tt-U.last>0.7)){TOOL.visible=false;return}
if(U.t==='sc'){const tg=tt-U.mv<0.15?0.04+0.26*Math.abs(Math.cos((U.dist||0)*48)):0.26,A=TL.sc.userData.a,a=A.rotation.y+(tg-A.rotation.y)*0.45;A.rotation.y=a;TL.sc.userData.b.rotation.y=-a;TL.sc.rotation.z=(0.26-a)*0.18}
else if((U.t==='blk'||U.t==='cl'||U.t==='br')&&tt-U.mv<0.15)TOOL.rotation.y=Math.sin(tt*22)*0.18}
