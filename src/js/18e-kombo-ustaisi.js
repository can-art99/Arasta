/* ---------- Kraft kombo + usta işi ---------- */
/* kusursuz adım (%90+) art arda gelirse kombo büyür; kombo ödeme bonusu ve usta işi şansı getirir */
const CBOK=0.9;
function comboStep(s){if(!K||!K.st||K.st.t==='flip'||K.st.t==='design')return K?K.cb:0;if(s>=CBOK){K.cb=(K.cb||0)+1;K.cbM=Math.max(K.cbM||0,K.cb);if(G.st)G.st.cbMax=Math.max(G.st.cbMax||0,K.cb);if(K.cb>=2){try{sfx.coin()}catch(e){}cbPop(K.cb)}}else K.cb=0;return K.cb}
/* x3'ten itibaren her kombo adımı +%5, en fazla +%25 */
const comboPct=()=>K&&K.cbM>=3?Math.min(0.25,(K.cbM-2)*0.05):0;
/* usta işi: sadece 5 yıldız; temel %4, her kombo adımı +%2, en fazla %20 */
function mqRoll(stars){if(stars<5||!K||K.skips)return false;const p=Math.min(0.2,0.04+0.02*(K.cbM||0));return Math.random()<p}
function cbPop(n){let el=document.getElementById('cbPop');if(!el){el=document.createElement('div');el.id='cbPop';document.body.appendChild(el)}el.textContent='🔥 x'+n;el.classList.remove('on');void el.offsetWidth;el.classList.add('on')}
