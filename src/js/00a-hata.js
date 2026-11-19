/* ---------- hata takibi: oyunda çıkan hataları sunucuya bildirir (oyuncuya görünmez) ---------- */
const VER='__VER__';const ERRQ=[],ERRS=new Set();let ERRN=0,ERRT=0;
function errHash(s){let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return (h>>>0).toString(36)}
function errCtx(){const c={v:VER,ua:navigator.userAgent.slice(0,140),w:innerWidth+'x'+innerHeight};try{c.view=view;c.phase=G.phase;c.gold=G.gold;c.tier=G.tier;c.day=G.day;c.rep=G.rep}catch(e){}try{if(K&&K.p){c.pid=K.p.id;c.si=K.si;c.step=K.st&&(K.st.ad||K.st.t)}}catch(e){}try{c.trail=ERRTRAIL.slice(-12)}catch(e){}return c}
const ERRTRAIL=[];function crumb(s){ERRTRAIL.push(Math.round(performance.now()/1000)+'s '+s);if(ERRTRAIL.length>20)ERRTRAIL.shift()}
function errRep(kind,msg,stack){if(location.hash==='#test')return;try{msg=String(msg||'?').slice(0,500);if(/ResizeObserver|^Script error\.?$|Failed to fetch|Load failed|NetworkError|The operation was aborted/i.test(msg))return;
 const st=String(stack||'').split('\n').slice(0,8).join('\n');const loc=st.split('\n').slice(0,3).map(l=>l.replace(/:\d+:\d+\)?$/,'').replace(/https?:\/\/[^ )]+\//g,'')).join('|');
 const sig=kind+':'+errHash(msg.replace(/\d+(\.\d+)?/g,'#')+'|'+loc);if(ERRS.has(sig)||ERRN>=25)return;ERRS.add(sig);ERRN++;ERRQ.push({sig,kind,msg,stack:st,ctx:errCtx()});errFlush()}catch(e){}}
function errFlush(){if(!ERRQ.length)return;let ok=false;try{ok=typeof rpc==='function'&&!!CL}catch(e){}if(!ok){setTimeout(errFlush,3000);return}
 const code=(()=>{try{return G.cloud||null}catch(e){return null}})();
 while(ERRQ.length){const e=ERRQ.shift();rpc('arasta_err',{p_sig:e.sig,p_kind:e.kind,p_msg:e.msg,p_stack:e.stack,p_ctx:e.ctx,p_ver:VER,p_code:code}).catch(()=>{})}}
addEventListener('error',e=>{if(e&&e.message)errRep('js',e.message,e.error&&e.error.stack||(e.filename+':'+e.lineno))});
addEventListener('unhandledrejection',e=>{const r=e&&e.reason;if(r==null||typeof r==='number'||typeof r==='string')return;errRep('promise',r.message||String(r),r.stack)});
/* ---------- uzaktan ayar: yönetici panelinden kapatılan özellikler ve duyuru ---------- */
let FLG={off:[],notice:null};
const FNAME={mezat:'Mezat',takas:'Takas',bit:'Bit pazarı',tamir:'Tamir',usta:'Usta müşteri',coban:'Çoban',tarla:'Yeni Tarla',kervan:'Kervan',dekor:'Dekorcu'};
function fOff(k,quiet){if(!(FLG.off||[]).includes(k))return false;if(!quiet)try{toast(`${FNAME[k]||k} şu an bakımda, kısa süre sonra açılacak`,2000)}catch(e){}return true}
function flagsPull(){try{rpc('arasta_flags_get',{}).then(f=>{if(!f)return;FLG=Object.assign({off:[],notice:null},f);if(!Array.isArray(FLG.off))FLG.off=[];balApply();maintShow();noticeShow();eventShow()}).catch(()=>{})}catch(e){}}
function noticeShow(){const n=FLG.notice;if(!n||!n.id||!n.text)return;let seen=null;try{seen=localStorage.getItem('arasta-notice')}catch(e){}if(seen===String(n.id))return;
 const go=()=>{if(typeof G==='undefined'||G.phase==='craft'||G.phase==='result'||modalMode){setTimeout(go,4000);return}try{localStorage.setItem('arasta-notice',String(n.id))}catch(e){}
  openSheet('notice',`<h3>${esc(n.title||'Duyuru')}</h3><p style="white-space:pre-line">${esc(n.text)}</p><div style="text-align:center"><button class="btn g" data-close>Tamam</button></div>`);wire()};setTimeout(go,2500)}

/* ---------- panelden denge, etkinlik, bakım ---------- */
const BAL0={};
function numOk(v){v=+v;return Number.isFinite(v)&&v>0?v:null}
function balM(k){const b=FLG.bal||{};let m=numOk(b[k])||1;const e=FLG.event;if(e&&e.until>Date.now()&&numOk(e[k]))m*=+e[k];return m}
function prodM(id){const p=(FLG.bal||{}).prod||{};return numOk(p[id])||1}
function evOn(){const e=FLG.event;return !!(e&&e.until>Date.now())}
function balApply(){try{if(typeof OTO_COST==='undefined')return;if(!BAL0.c)BAL0.c=Object.assign({},OTO_COST);const c=(FLG.bal||{}).cost||{};for(const k in BAL0.c)OTO_COST[k]=Math.max(1,Math.round(numOk(c[k])||BAL0.c[k]))}catch(e){}}
function maintShow(){const m=FLG.maint,on=!!(m&&m.on)&&!(typeof G!=='undefined'&&G.owner);let el=document.getElementById('maintOv');
 if(!on){if(el)el.remove();return}
 if(!el){el=document.createElement('div');el.id='maintOv';el.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(32,58,50,.96);color:#f6ead2;display:flex;align-items:center;justify-content:center;text-align:center;padding:28px;font-family:inherit';document.body.appendChild(el);try{if(typeof save==='function')save()}catch(e){}}
 el.innerHTML=`<div style="max-width:340px"><div style="font-family:'DM Serif Display',serif;font-size:34px;margin-bottom:10px">Kısa bir bakım</div><p style="font-size:16px;line-height:1.5;white-space:pre-line">${esc(m.text||'Dükkânlar kısa süreliğine kapalı. İlerlemen güvende, birazdan geri döneceğiz.')}</p><button id="maintR" style="margin-top:18px;font:inherit;font-weight:700;padding:10px 22px;border-radius:12px;border:2px solid #f6ead2;background:transparent;color:#f6ead2">Tekrar dene</button></div>`;
 el.querySelector('#maintR').onclick=()=>location.reload()}
function eventShow(){const e=FLG.event;if(!evOn()||!e.id)return;let seen=null;try{seen=localStorage.getItem('arasta-ev')}catch(x){}if(seen===String(e.id))return;
 const go=()=>{if(typeof G==='undefined'||G.phase==='craft'||G.phase==='result'){setTimeout(go,4000);return}try{localStorage.setItem('arasta-ev',String(e.id))}catch(x){}
  const parts=[];if(numOk(e.sell)&&+e.sell!==1)parts.push('Satışlar '+(+e.sell)+' kat altın');if(numOk(e.gem)&&+e.gem!==1)parts.push('Elmas bulma şansı '+(+e.gem)+' kat');
  const left=Math.max(1,Math.round((e.until-Date.now())/3600000));try{toast(`<b>${esc(e.title||'Etkinlik')}</b><br>${parts.join(' · ')}${parts.length?'<br>':''}${left} saat sürecek`,4200)}catch(x){}};setTimeout(go,4500)}
/* ---------- hediye kodu ---------- */
function playerId(){if(typeof G!=='undefined'&&G.cloud)return G.cloud;let u=null;try{u=localStorage.getItem('arasta-uid');if(!u){u='U'+Math.random().toString(36).slice(2,12)+Date.now().toString(36);localStorage.setItem('arasta-uid',u)}}catch(e){u='U'+Math.random().toString(36).slice(2,12)}return u}
function openGift(){openSheet('gift',`<h3 class="bkh"><button class="bkb" id="gfBack" aria-label="Geri">‹</button>Hediye kodu</h3><p>Duyurularda ya da sosyal medyada paylaşılan kodu yaz.</p><input id="gfT" maxlength="24" autocomplete="off" style="width:100%;box-sizing:border-box;border:2px solid var(--ln);border-radius:12px;padding:12px;font:inherit;font-size:18px;letter-spacing:2px;text-transform:uppercase;text-align:center;background:#fffaf0;color:var(--ink)" placeholder="KOD"><p class="chint" id="gfE" style="color:#b5533c;min-height:1em;text-align:center"></p><div style="text-align:center"><button class="btn g" id="gfS">Kullan</button></div>`+closeBtn);wire();
 $('gfBack').onclick=()=>{menuTab='ayar';renderMenu()};const t=$('gfT');t.oninput=()=>{$('gfE').textContent=''};
 $('gfS').onclick=()=>{const c=t.value.trim().toUpperCase().replace(/[^A-Z0-9]/g,'');if(c.length<3){$('gfE').textContent='Kodu yaz';return}const b=$('gfS');b.disabled=true;b.textContent='Kontrol ediliyor…';
  rpc('arasta_redeem',{p_gift:c,p_who:playerId()}).then(r=>{b.disabled=false;b.textContent='Kullan';const M={none:'Böyle bir kod yok',used:'Bu kodu zaten kullandın',expired:'Bu kodun süresi dolmuş',full:'Bu kodun kullanım hakkı bitmiş',rate:'Biraz bekleyip tekrar dene',who:'Bir sorun oldu, tekrar dene'};
   if(!r||r.err){$('gfE').textContent=M[r&&r.err]||'Bir sorun oldu, tekrar dene';return}
   const g=Math.max(0,+r.gold||0),e=Math.max(0,+r.elmas||0);G.gold+=g;G.elmas=(G.elmas||0)+e;hud();save();try{cloudPush(true)}catch(x){}try{sfx.fan()}catch(x){}
   closeSheet&&closeSheet();toast(`Hediye alındı${r.note?': '+esc(r.note):''}<br>${g?'+'+g+' altın':''}${g&&e?' · ':''}${e?'+'+e+' elmas':''}`,3000)}).catch(()=>{b.disabled=false;b.textContent='Kullan';$('gfE').textContent='Bağlantı yok, tekrar dene'})}}
/* ---------- oyuncunun sorun bildirmesi ---------- */
function openReport(){openSheet('report',`<h3 class="bkh"><button class="bkb" id="rpBack" aria-label="Geri">‹</button>Sorun bildir</h3><p>Ne oldu? Kısaca yaz; oyun, o anki durumunu (ekran, adım, altın) kendisi ekler.</p><textarea id="rpT" maxlength="1200" rows="5" style="width:100%;box-sizing:border-box;border:2px solid var(--ln);border-radius:12px;padding:10px;font:inherit;background:#fffaf0;color:var(--ink)" placeholder="Örn: Tamir bitince ödeme yanlış göründü"></textarea><p class="chint" id="rpE" style="color:#b5533c;min-height:1em"></p><div style="text-align:center"><button class="btn g" id="rpS">Gönder</button></div>`+closeBtn);wire();
 $('rpBack').onclick=()=>{menuTab='ayar';renderMenu()};const t=$('rpT');t.oninput=()=>{$('rpE').textContent=''};
 $('rpS').onclick=()=>{const m=t.value.trim();if(m.length<5){$('rpE').textContent='Biraz daha ayrıntı yaz (en az 5 harf)';return}const b=$('rpS');b.disabled=true;b.textContent='Gönderiliyor…';
  const ctx=errCtx();ctx.errs=[...ERRS].slice(-5);rpc('arasta_report',{p_code:G.cloud||null,p_msg:m,p_ctx:ctx}).then(ok=>{if(ok){closeSheet();toast('Teşekkürler, bildirimin ulaştı',1800)}else{b.disabled=false;b.textContent='Gönder';$('rpE').textContent='Çok sık bildirim gönderdin, biraz sonra tekrar dene'}}).catch(()=>{b.disabled=false;b.textContent='Gönder';$('rpE').textContent='Bağlantı yok, tekrar dene'})}}
