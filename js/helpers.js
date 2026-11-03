/* =============== helpers =============== */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const FAST=/[?&]fast/.test(location.search);
const SP=FAST?0.08:1;
const rnd=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const S={name:'',city:'',loc:null,tAppStart:0,phase:'splash',nopes:0,blocked:0,lvl:0,qi:0,cur:null,swipes:{left:0,right:0},
  intensity:0,blockAt:Math.random()<.5?3:4,matched:false,press:0,cheat:0,cache:{},why:'direct',escapes:0,escAt:0,rush:0,battery:null,charging:false,busy:false,trap:false,typing:0,interrupts:[],chipN:{},ended:false};
let rushScale=1;
const sleep=ms=>new Promise(r=>setTimeout(r,ms*SP*(S.rush>0?.55:1)));
const rawSleep=ms=>new Promise(r=>setTimeout(r,ms*SP));
const vib=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
const hora=()=>new Date().toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});
const fmtDur=ms=>{const s=Math.max(1,Math.round(ms/1000)),m=Math.floor(s/60);return m>0?`${m} minuto${m>1?'s':''} y ${s%60} segundo${s%60==1?'':'s'}`:`${s} segundos`};
const T=str=>str.replace(/,\s*\{n\}/g,S.name?', '+S.name:'').replace(/\{n\}/g,S.name||'').replace(/\{h\}/g,hora()).replace(/\{cheat\}/g,S.cheat+(S.cheat==1?' chico':' chicos')).replace(/\{enc\}/g,S.city?'en '+S.city:'cerca').replace(/\{ord\}/g,['','Primera','Segunda','Tercera','Cuarta','Otra'][(S.cur&&S.cur.k)||5]).replace(/\{nos\}/g,['nunca','una vez','dos veces','tres veces','varias veces'][Math.min(S.nopes,4)]);
const ICON={heart:'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  pin:'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
  check:'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'};

