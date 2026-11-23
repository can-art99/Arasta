/* ---------- Kraft kombo + usta işi ---------- */
/* kusursuz adım (%90+) art arda gelirse kombo büyür; kombo ödeme bonusu ve usta işi şansı getirir */
const CBOK=0.9;
function comboStep(s){if(!K||!K.st||K.st.t==='flip'||K.st.t==='design')return K?K.cb:0;if(s>=CBOK){K.cb=(K.cb||0)+1;K.cbM=Math.max(K.cbM||0,K.cb);if(G.st)G.st.cbMax=Math.max(G.st.cbMax||0,K.cb);if(K.cb>=2){if(!sf('kombo',K.cb>=5?0.32:0.22))try{sfx.coin()}catch(e){}cbPop(K.cb)}}else K.cb=0;return K.cb}
/* x3'ten itibaren her kombo adımı +%5, en fazla +%25 */
const comboPct=()=>K&&K.cbM>=3?Math.min(0.25,(K.cbM-2)*0.05):0;
/* usta işi: sadece 5 yıldız; temel %4, her kombo adımı +%2, en fazla %20 */
function mqRoll(stars){if(stars<5||!K||K.skips)return false;const p=Math.min(0.2,0.04+0.02*(K.cbM||0));return Math.random()<p}
function cbPop(n){let el=document.getElementById('cbPop');if(!el){el=document.createElement('div');el.id='cbPop';document.body.appendChild(el)}
 const lv=n>=8?3:n>=5?2:1,ry=Array.from({length:12},(_,i)=>`<path d="M50 50 L${(50+48*Math.cos((i/12)*6.283-0.13)).toFixed(1)} ${(50+48*Math.sin((i/12)*6.283-0.13)).toFixed(1)} L${(50+48*Math.cos((i/12)*6.283+0.13)).toFixed(1)} ${(50+48*Math.sin((i/12)*6.283+0.13)).toFixed(1)}Z"/>`).join('');
 el.className='cl'+lv;el.innerHTML=`<svg class="cbR" viewBox="0 0 100 100" aria-hidden="true"><g>${ry}</g></svg><svg class="cbS" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="30"/><circle cx="50" cy="50" r="25" class="in"/></svg><div class="cbM"><b>x${n}</b><small>KOMBO</small></div>`+Array.from({length:8},(_,i)=>`<i style="--a:${i*45+22}deg;--d:${0.05*i}s"></i>`).join('');
 void el.offsetWidth;el.classList.add('on');
 try{if(K&&K.work&&typeof sparkle==='function'){const p=V(BC.x,(typeof Y!=='undefined'?Y:1)+0.08,BC.z);sparkle(p,6+lv*4,lv===3?['#e9d2ff','#ffffff','#c79bff']:lv===2?['#fff2a8','#ffffff','#ffd25a']:['#ffd9a0','#ffffff','#ffb86b'],0.04,true);if(lv>1)ringPulse(p,0.16,lv===3?'#d9b8ff':'#ffe08a')}}catch(e){}}
/* kraft sonucu özeti: yıldız, ortalama, adım sayısı, kombo, adım çubukları, zayıf adımlar; tüm liste açılır */
/* kalite kontrolü (akort, çekiş, tetik): düşük puan yıldızı sınırlar */
function qcCap(st){if(!K||K.qc==null)return st;return Math.min(st,K.qc<0.6?3:K.qc<0.85?4:5)}
function resSum(stars){const sc=K.scores||[],nm=K.names||[],n=sc.length,av=n?Math.round(avg(sc)*100):0,col=v=>v>=0.9?'#3f9a7c':v>=0.7?'#d9a23a':'#d0503c';
 const weak=sc.map((v,i)=>[v,nm[i]]).filter(x=>x[0]<0.8).sort((a,b)=>a[0]-b[0]).slice(0,2);
 return `<div class="rsum"><div class="stars">${'★'.repeat(stars)}<i>${'★'.repeat(5-stars)}</i></div><div class="rsg"><div><b>%${av}</b><small>ortalama</small></div><div><b>${n}</b><small>adım</small></div><div><b>${K.cbM>=2?'x'+K.cbM:'–'}</b><small>en uzun kombo</small></div></div>
 ${K.qc!=null?`<div class="rqc ${K.qc>=0.85?'ok':K.qc>=0.6?'md':'no'}">Kalite kontrolü: <b>%${Math.round(K.qc*100)}</b>${K.qc<0.6?' · en fazla 3★':K.qc<0.85?' · en fazla 4★':' · geçti'}</div>`:''}<div class="rsb${n>12?' rsn':''}">${sc.map((v,i)=>`<i title="${esc(nm[i]||'')}" style="height:${Math.max(10,Math.round(v*100))}%;background:${col(v)}"><em>${n>12?'':'%'}${Math.round(v*100)}</em><u>${i+1}</u></i>`).join('')}</div><div class="rsl">Çubuklar adım sırası · üstteki sayı o adımın puanı</div>
 ${weak.length?`<div class="rsw">Geliştirilebilir: ${weak.map(w=>`<b>${esc(w[1])}</b> %${Math.round(w[0]*100)}`).join(' · ')}</div>`:'<div class="rsw" style="color:#2f7a63">Bütün adımlar temiz!</div>'}
 <details class="rsd"><summary>Tüm adımlar</summary>${sc.map((v,i)=>`<div class="brk"><span>${esc(nm[i]||'')}</span><b style="color:${col(v)}">%${Math.round(v*100)}</b></div>`).join('')}</details></div>`}
