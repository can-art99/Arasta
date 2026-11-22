/* ---------- alet görünümleri (Dekorcu'dan alınır, kraftta kullanılır) ---------- */
/* m: model, rx/ry/rz: modeli standart aletin duruşuna çevirir, tint: malzeme adına göre renk, b.q: kalite artısı, b.d: dayanıklılık çarpanı */
const SKD={
 makas:{ad:'Makas',e:'✂️',std:'scissors2',o:[
  {id:'std',ad:'Kırmızı saplı makas',m:'scissors2'},
  {id:'yesil',ad:'Yeşil saplı makas',m:'scissors2',tint:{Handle:'#2f7a55'},f:90,b:{d:1.15}},
  {id:'lac',ad:'Lacivert saplı makas',m:'sk_sc1',f:150,b:{q:0.03,d:1.2}},
  {id:'terzi',ad:'İnce terzi makası',m:'sk_sc2',rx:-Math.PI/2,g:12,b:{q:0.06,d:1.5}}]},
 testere:{ad:'Testere',e:'🪚',std:'saw2',o:[
  {id:'std',ad:'Mavi saplı testere',m:'saw2'},
  {id:'usta',ad:'Usta testeresi',m:'sk_saw1',rz:Math.PI/2,f:240,b:{q:0.04,d:1.3}},
  {id:'kizil',ad:'Kızıl saplı usta testeresi',m:'sk_saw1',rz:Math.PI/2,tint:{'795548':'#9a3020'},g:14,b:{q:0.06,d:1.6}}]},
 bicak:{ad:'Bıçak',e:'🔪',std:null,o:[
  {id:'std',ad:'Yarım ay bıçağı'},
  {id:'av',ad:'Av bıçağı',m:'sk_kn2',rx:-Math.PI/2,f:200,b:{q:0.04,d:1.2}},
  {id:'sus',ad:'Altın kabzalı bıçak',m:'sk_kn1',rx:-Math.PI/2,g:15,b:{q:0.07,d:1.5}}]},
 cekic:{ad:'Çekiç',e:'🔨',std:'m_hammer',o:[
  {id:'std',ad:'Pençeli çekiç',m:'m_hammer'},
  {id:'ceviz',ad:'Ceviz saplı çekiç',m:'m_hammer',tint:{F44336:'#7a4a2a'},f:80,b:{q:0.02}},
  {id:'tok',ad:'Tokmak',m:'sk_hm2',f:160,b:{q:0.04}},
  {id:'cift',ad:'Çift başlı çekiç',m:'sk_hm1',rx:-Math.PI/2,g:18,b:{q:0.07}}]},
 balta:{ad:'Balta',e:'🪓',std:'axe',o:[
  {id:'std',ad:'Odun baltası',m:'axe'},
  {id:'tas',ad:'Kızıl saplı balta',m:'sk_ax2',f:180,b:{q:0.04}},
  {id:'cift',ad:'Çift ağızlı balta',m:'sk_ax1',g:20,b:{q:0.07}}]}};
function skSel(cat){const id=G.deco&&G.deco.sel&&G.deco.sel['sk_'+cat],c=SKD[cat];return c.o.find(o=>o.id===id)||c.o[0]}
function skOwn(cat,o){return (!o.f&&!o.g)||!!(G.deco&&G.deco.own['sk.'+cat+'.'+o.id])}
function skBon(o){const b=o.b||{},t=[];if(b.q)t.push(`+%${Math.round(b.q*100)} kalite`);if(b.d)t.push(`%${Math.round((b.d-1)*100)} daha geç körelir`);return t.join(' · ')}
/* seçili görünümün modelini standart aletin duruşunda hazırlar; yüklenmemişse yükleyip sonra yeniden uygular */
function skBuild(cat,o){if(!o.m)return null;const nm='_sk_'+cat+'_'+o.id;if(GLC[nm])return nm;const g=GLC[o.m];if(!g){glb(o.m,()=>skApply());return null}
 const s=g.scene.clone(true),w=new THREE.Group();s.rotation.set(o.rx||0,o.ry||0,o.rz||0);w.add(s);
 if(o.tint)s.traverse(x=>{if(!x.isMesh)return;const ms=[].concat(x.material).map(m=>{for(const k in o.tint)if(m.name&&m.name.includes(k)){m=m.clone();m.color.set(o.tint[k])}return m});x.material=ms.length===1?ms[0]:ms});
 w.updateMatrixWorld(true);GLC[nm]={scene:w};return nm}
function skA(cat,std){const o=skSel(cat);if(!o.m||(o.m===std&&!o.tint&&!o.rx&&!o.rz))return std;return skBuild(cat,o)||std}
function skSwap(key,nm,opt,pos,keepRot){const i=TL[key]&&TL[key].children[0];if(!i)return;i.children.slice().forEach(c=>{if(c.userData.sk)i.remove(c)});
 if(!nm){i.children.forEach(c=>c.visible=!c.userData.glb);return}const w=fitM(nm,opt);if(!w)return;w.userData.sk=1;w.position.set(pos[0],pos[1],pos[2]);w.traverse(x=>{if(x.isMesh)x.castShadow=true});i.children.forEach(c=>c.visible=false);i.add(w)}
function skApply(){try{
 skSwap('sw',skA('testere','saw2'),{w:0.3},[0,-0.004,-0.04]);
 skSwap('ax',skA('balta','axe'),{rz:Math.PI,h:0.36},[0,-0.005,0]);
 {const n=skA('makas','scissors2');if(GLC[n]){skSwap('sc',n,{rx:-Math.PI/2,w:0.22},[0,0,0.1]);const i=TL.sc.children[0];i.position.set(0,0.012,0);i.rotation.x=-0.25}else glb('scissors2',()=>skApply())}
 {const o=skSel('bicak');skSwap('kn',o.m?skBuild('bicak',o):null,{w:0.2},[0,0,0.09])}
 skA('cekic','m_hammer');skA('balta','axe');if(typeof K!=='undefined'&&K&&G.phase!=='craft')K.axR=null}catch(e){}}
setTimeout(skApply,2500);
/* kraftta hangi aletin kullanıldığı ve görünümün artısı */
function skCatNow(){const s=K&&K.st;if(!s)return null;if(s.t==='trace')return {sc:'makas',sw:'testere',kn:'bicak',ax:'balta'}[cutKind()]||null;if(s.t==='hammer')return 'cekic';if(s.t==='rub'&&(s.k==='incelt'||s.k==='oy'))return 'bicak';return null}
function skQ(s){try{const c=skCatNow();if(!c||!(s>0))return s;const o=skSel(c);return o.b&&o.b.q?Math.min(1,s+o.b.q):s}catch(e){return s}}
function skSaveWear(id){const o=SKD[id]&&skSel(id);return !!(o&&o.b&&o.b.d&&Math.random()<1-1/o.b.d)}
/* ikonlar: küçük ikon satırda, büyük ikon önizlemede */
const SKIC={};
function skIcon(cat,o,big){const k=cat+'.'+o.id+(big?'.b':'');if(SKIC[k])return SKIC[k];let ob=null;if(!o.m){const i=TL[{bicak:'kn'}[cat]]&&TL[{bicak:'kn'}[cat]].children[0];if(!i)return null;ob=new THREE.Group();i.children.forEach(c=>{if(c.userData.sk)return;const k=c.clone(true);k.visible=true;ob.add(k)});ob.rotation.x=-0.35}else{const nm=skBuild(cat,o);if(!nm)return null;ob=GLC[nm].scene.clone(true)}
 try{if(big){IR.setSize(256,256)}SKIC[k]=snap(ob);if(big)IR.setSize(96,96)}catch(e){IR.setSize(96,96)}return SKIC[k]}
function skRows(){let h=`<div class="grp">Alet görünümleri</div><p class="chint" style="margin:0 0 4px">Aldığın alet kraftta elinde olur. Özel aletler daha temiz iş çıkarır ya da daha geç körelir. Görmek için resmine dokun.</p>`;let miss=false;
 Object.entries(SKD).forEach(([cat,c])=>{h+=`<div class="grp" style="opacity:.75;font-size:13px">${c.e} ${c.ad}</div>`;const sel=skSel(cat);
  c.o.forEach(o=>{const own=skOwn(cat,o),ic=skIcon(cat,o);if(o.m&&!ic)miss=true;const bon=skBon(o);
   h+=`<div class="row"><div class="ic" data-skp="${cat}.${o.id}" style="display:grid;place-items:center;cursor:pointer;font-size:24px">${ic?`<img src="${ic}" alt="" style="width:100%;height:100%">`:c.e}</div><div class="n">${o.ad}<small>${own?'Senin':o.g?'<b class="gemc">'+o.g+' 💎</b> · özel':o.f+' altın'}${bon?' · '+bon:''}</small></div>${sel.id===o.id?'<b>Seçili</b>':`<button class="btn ${own?'l':'g'}" data-sk="${cat}.${o.id}">${own?'Seç':'Satın al'}</button>`}</div>`})});
 if(miss)setTimeout(()=>{if(modalMode==='deko')openDeco()},900);return h}
function skBuy(cat,id){const o=SKD[cat].o.find(x=>x.id===id);if(!o)return false;const own=skOwn(cat,o),key='sk.'+cat+'.'+id;
 if(!own&&o.g){if((G.elmas||0)<o.g){toast(`${o.g} 💎 gerekli`,1300);return false}if(!armBuy('s'+key,`${o.ad} alınsın mı? ${o.g} 💎`))return false;G.elmas-=o.g;G.deco.own[key]=1;buyArm=null;sfx.fan&&sfx.fan();hud()}
 else if(!own){if(G.gold<o.f){toast(`${o.f} altın gerekli`,1300);return false}if(!armBuy('s'+key,`${o.ad} alınsın mı? ${o.f} altın`))return false;G.gold-=o.f;G.deco.own[key]=1;buyArm=null;sfx.coin()}else sfx.tap();
 G.deco.sel['sk_'+cat]=id;skApply();save();refresh();toast(`${SKD[cat].e} ${o.ad} artık elinde`,1300);return true}
function skWire(){ui.sheet.querySelectorAll('[data-sk]').forEach(b=>b.onclick=()=>{const [c,id]=b.dataset.sk.split('.');if(skBuy(c,id))openDeco()});
 ui.sheet.querySelectorAll('[data-skp]').forEach(b=>b.onclick=()=>{const [c,id]=b.dataset.skp.split('.');skPreview(c,id)})}
function skPreview(cat,id){const c=SKD[cat],o=c.o.find(x=>x.id===id);if(!o)return;sfx.tap();const own=skOwn(cat,o),sel=skSel(cat).id===id,ic=skIcon(cat,o,true),bon=skBon(o);
 let h=`<h3 class="bkh"><button class="bkb" id="skBk" aria-label="Geri">‹</button>${o.ad}</h3><div style="display:grid;place-items:center;margin:6px 0 10px;background:#fbf6ea;border:2px solid var(--ln);border-radius:16px;min-height:200px">${ic?`<img src="${ic}" alt="" style="width:220px;height:220px">`:`<div style="font-size:80px">${c.e}</div>`}</div>`;
 h+=`<p style="margin:0 0 6px">${c.ad} · ${own?'Senin':o.g?'<b class="gemc">'+o.g+' 💎</b>':o.f+' altın'}</p><p class="chint" style="margin:0 0 10px">${bon||'Standart alet, ek artısı yok.'}</p>`;
 h+=`<div style="display:flex;gap:8px;justify-content:center">${sel?'<b>Seçili</b>':`<button class="btn ${own?'l':'g'}" id="skGo">${own?'Seç':'Satın al'}</button>`}<button class="btn l" id="skX">Geri</button></div>`;
 openSheet('skpv',h);const back=()=>{sfx.tap();openDeco()};$('skBk').onclick=back;$('skX').onclick=back;const g=$('skGo');if(g)g.onclick=()=>{if(skBuy(cat,id))openDeco()}}
/* dekor önizleme: satın almadan dükkânda dene */
var PV=null,PVok=false;
function pvStart(k,id){const o=DECO[k].o.find(x=>x.id===id);if(!o)return;sfx.tap();PV={k,o};decoApply();closeSheet();const v=k==='raf'?'depo':'home';PVok=true;go(v);PVok=false;
 let b=$('pvB');if(!b){b=document.createElement('div');b.id='pvB';(ui.act&&ui.act.parentNode||document.body).appendChild(b)}
 const own=(!o.f&&!o.g)||G.deco.own[k+'.'+id];
 b.innerHTML=`<div class="pvT"><b>${o.ad}</b><small>${DECO[k].ad} · önizleme</small></div><button class="btn l" id="pvN">Vazgeç</button><button class="btn g" id="pvY">${own?'Seç':o.g?o.g+' 💎 Al':o.f+' altın Al'}</button>`;show(b,true);
 $('pvN').onclick=()=>{pvEnd();pvBack()};$('pvY').onclick=()=>{pvEnd();pvBack(k+'.'+id)}}
function pvEnd(){if(!PV)return;PV=null;try{decoApply()}catch(e){}const b=$('pvB');if(b)show(b,false)}
function pvBack(dk){PVok=true;go('pazar');PVok=false;setTimeout(()=>{if(G.phase==='craft')return;openDeco();if(dk){const b=ui.sheet.querySelector(`[data-dk="${dk}"]`);if(b){b.scrollIntoView({block:'center'});b.click()}}},view==='pazar'?50:750)}
