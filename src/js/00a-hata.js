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
function flagsPull(){try{rpc('arasta_flags_get',{}).then(f=>{if(!f)return;FLG=Object.assign({off:[],notice:null},f);if(!Array.isArray(FLG.off))FLG.off=[];noticeShow()}).catch(()=>{})}catch(e){}}
function noticeShow(){const n=FLG.notice;if(!n||!n.id||!n.text)return;let seen=null;try{seen=localStorage.getItem('arasta-notice')}catch(e){}if(seen===String(n.id))return;
 const go=()=>{if(typeof G==='undefined'||G.phase==='craft'||G.phase==='result'||modalMode){setTimeout(go,4000);return}try{localStorage.setItem('arasta-notice',String(n.id))}catch(e){}
  openSheet('notice',`<h3>${esc(n.title||'Duyuru')}</h3><p style="white-space:pre-line">${esc(n.text)}</p><div style="text-align:center"><button class="btn g" data-close>Tamam</button></div>`);wire()};setTimeout(go,2500)}
/* ---------- oyuncunun sorun bildirmesi ---------- */
function openReport(){openSheet('report',`<h3 class="bkh"><button class="bkb" id="rpBack" aria-label="Geri">‹</button>Sorun bildir</h3><p>Ne oldu? Kısaca yaz; oyun, o anki durumunu (ekran, adım, altın) kendisi ekler.</p><textarea id="rpT" maxlength="1200" rows="5" style="width:100%;box-sizing:border-box;border:2px solid var(--ln);border-radius:12px;padding:10px;font:inherit;background:#fffaf0;color:var(--ink)" placeholder="Örn: Tamir bitince ödeme yanlış göründü"></textarea><p class="chint" id="rpE" style="color:#b5533c;min-height:1em"></p><div style="text-align:center"><button class="btn g" id="rpS">Gönder</button></div>`+closeBtn);wire();
 $('rpBack').onclick=()=>{menuTab='ayar';renderMenu()};const t=$('rpT');t.oninput=()=>{$('rpE').textContent=''};
 $('rpS').onclick=()=>{const m=t.value.trim();if(m.length<5){$('rpE').textContent='Biraz daha ayrıntı yaz (en az 5 harf)';return}const b=$('rpS');b.disabled=true;b.textContent='Gönderiliyor…';
  const ctx=errCtx();ctx.errs=[...ERRS].slice(-5);rpc('arasta_report',{p_code:G.cloud||null,p_msg:m,p_ctx:ctx}).then(ok=>{if(ok){closeSheet();toast('Teşekkürler, bildirimin ulaştı',1800)}else{b.disabled=false;b.textContent='Gönder';$('rpE').textContent='Çok sık bildirim gönderdin, biraz sonra tekrar dene'}}).catch(()=>{b.disabled=false;b.textContent='Gönder';$('rpE').textContent='Bağlantı yok, tekrar dene'})}}
