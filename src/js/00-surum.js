/* varlık sürümleri: build.py dosya özetlerini ekler; değişen model/ses önbellekte takılı kalmaz */
const AV=/*__AV__*/{};const AU=p=>p+(AV[p]?'?v='+AV[p]:'');
const LD={n:0,t:0};
/* ses dosyalarını açılışta indir (AudioContext olmadan da), sonradan çöz */
const SBRAW={};let SBLIST=null;
try{LD.t++;fetch(AU('sounds/list.json')).then(r=>r.ok?r.json():[]).then(l=>{SBLIST=l;LD.n++;LD.t+=l.length;l.forEach(n=>fetch(AU('sounds/'+n)).then(r=>r.arrayBuffer()).then(b=>{SBRAW[n]=b;LD.n++}).catch(()=>{LD.n++}))}).catch(()=>{LD.n++})}catch(e){}
