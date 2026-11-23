/* ---------- Kraft kombo + usta işi ---------- */
/* kusursuz adım (%90+) art arda gelirse kombo büyür; kombo ödeme bonusu ve usta işi şansı getirir */
const CBOK=0.9;
function comboStep(s){if(!K||!K.st||K.st.t==='flip'||K.st.t==='design')return K?K.cb:0;if(s>=CBOK){K.cb=(K.cb||0)+1;K.cbM=Math.max(K.cbM||0,K.cb);if(G.st)G.st.cbMax=Math.max(G.st.cbMax||0,K.cb);if(K.cb>=2){try{sfx.coin()}catch(e){}cbPop(K.cb)}}else K.cb=0;return K.cb}
/* x3'ten itibaren her kombo adımı +%5, en fazla +%25 */
const comboPct=()=>K&&K.cbM>=3?Math.min(0.25,(K.cbM-2)*0.05):0;
/* usta işi: sadece 5 yıldız; temel %4, her kombo adımı +%2, en fazla %20 */
function mqRoll(stars){if(stars<5||!K||K.skips)return false;const p=Math.min(0.2,0.04+0.02*(K.cbM||0));return Math.random()<p}
function cbPop(n){let el=document.getElementById('cbPop');if(!el){el=document.createElement('div');el.id='cbPop';document.body.appendChild(el)}el.textContent='🔥 x'+n;el.classList.remove('on');void el.offsetWidth;el.classList.add('on')}
/* kraft sonucu özeti: yıldız, ortalama, adım sayısı, kombo, adım çubukları, zayıf adımlar; tüm liste açılır */
function resSum(stars){const sc=K.scores||[],nm=K.names||[],n=sc.length,av=n?Math.round(avg(sc)*100):0,col=v=>v>=0.9?'#3f9a7c':v>=0.7?'#d9a23a':'#d0503c';
 const weak=sc.map((v,i)=>[v,nm[i]]).filter(x=>x[0]<0.8).sort((a,b)=>a[0]-b[0]).slice(0,2);
 return `<div class="rsum"><div class="stars">${'★'.repeat(stars)}<i>${'★'.repeat(5-stars)}</i></div><div class="rsg"><div><b>%${av}</b><small>ortalama</small></div><div><b>${n}</b><small>adım</small></div><div><b>${K.cbM>=2?'x'+K.cbM:'–'}</b><small>en uzun kombo</small></div></div>
 <div class="rsb">${sc.map((v,i)=>`<i title="${esc(nm[i]||'')}" style="height:${Math.max(10,Math.round(v*100))}%;background:${col(v)}"></i>`).join('')}</div>
 ${weak.length?`<div class="rsw">Geliştirilebilir: ${weak.map(w=>`<b>${esc(w[1])}</b> %${Math.round(w[0]*100)}`).join(' · ')}</div>`:'<div class="rsw" style="color:#2f7a63">Bütün adımlar temiz!</div>'}
 <details class="rsd"><summary>Tüm adımlar</summary>${sc.map((v,i)=>`<div class="brk"><span>${esc(nm[i]||'')}</span><b style="color:${col(v)}">%${Math.round(v*100)}</b></div>`).join('')}</details></div>`}
