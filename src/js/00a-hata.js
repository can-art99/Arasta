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
