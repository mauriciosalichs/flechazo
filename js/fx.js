/* =============== fx =============== */
function setI(v){ S.intensity=clamp(v,0,1); document.documentElement.style.setProperty('--i',S.intensity.toFixed(3)); A.setI(S.intensity) }
function toast(msg,red){ const d=document.createElement('div'); d.className='toast'+(red?' r':''); d.textContent=T(msg); $('#toasts').append(d); setTimeout(()=>d.remove(),2800) }
function ask(title,text,btns){ return new Promise(res=>{ $('#alT').textContent=title; $('#alP').textContent=text; const b=$('#alB'); b.innerHTML=''; btns.forEach((t,i)=>{const x=document.createElement('button'); x.textContent=t; x.onclick=()=>{$('#alert').classList.remove('on'); res(i)}; b.append(x)}); $('#alert').classList.add('on') }) }
function show(id){ $$('.screen').forEach(s=>s.classList.toggle('on',s.id===id)) }
function shakeEl(el,cls='shake'){ el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); setTimeout(()=>el.classList.remove(cls),700) }
function flickUI(n=1){ const p=$('#phone'); let k=0; const go=()=>{ p.classList.add('flick'); setTimeout(()=>{p.classList.remove('flick'); if(++k<n)setTimeout(go,rnd(120,300))},rnd(60,130)) }; go() }
function tearUI(){ const p=$('#phone'); p.classList.remove('tear'); void p.offsetWidth; p.classList.add('tear'); A.glitch() }
function subliminal(){ if(S.intensity<.45||S.phase==='finale'||S.ended)return; const s=$('#sub'); s.style.backgroundImage=`url(${IMG[pick(['B3','A3','D3','E3'])]})`; s.style.opacity='.22'; A.glitch(); setTimeout(()=>{s.style.opacity='0'},rnd(70,110)) }

function notify(text,opt={}){
  const swipe=S.phase==='swipe';           // during swipes Mauricio only speaks through his bio
  const who=swipe?'Flechazo':'Mauricio'; if(swipe)text=pick(APP_NOTIFS);
  const box=$('#notifs'); while(box.children.length>=4)box.firstChild.remove();
  const d=document.createElement('div'); d.className='nt';
  d.innerHTML=`<div class="ic grad"><svg class="i" viewBox="0 0 24 24"><path d="${ICON.heart}"/></svg></div><div class="tx"><small><span>Flechazo</span><span>ahora</span></small><b></b><em class="bd2"></em></div>`;
  d.querySelector('b').textContent=who; d.querySelector('.bd2').textContent=T(text); box.append(d);
  A.ding(); vib([120,60,120]);
  setTimeout(()=>{d.classList.add('out'); setTimeout(()=>d.remove(),320)},rnd(2600,3600));
  if(swipe)return;
  S.unread=(S.unread||0)+1; if(document.hidden)document.title=`(${S.unread}) Mauricio te escribió`;
  if(document.hidden&&window.Notification&&Notification.permission==='granted'&&S.unread%2){ try{ new Notification('Mauricio',{body:T(text),tag:'mauri'}) }catch(e){} }
}
function flood(n,gap=380){ for(let k=0;k<n;k++) setTimeout(()=>notify(pick(NOTIFS)),k*gap*SP+Math.random()*120) }

/* escape attempts */
function escape(kind){
  if(S.ended||S.phase==='splash'||S.phase==='setup'||S.phase==='search'||S.phase==='finale')return;
  const now=Date.now(); if(now-S.escAt<2200)return; S.escAt=now; S.escapes++;
  flood(3+Math.min(S.escapes*2,9));
  vib([300,100,300,100,300]); tearUI(); flickUI(1);
  if(S.phase==='chat'){ S.rush=3; const l=['Te dije que no me ignoraras.','¿Adónde ibas?','No puedes irte. Ya estás conmigo.','Cada vez que intentas irte, estoy más cerca.','Vuelve. Vuelve. Vuelve.']; reply(l[(S.escapes-1)%l.length]) }
  else if(S.phase==='swipe'&&(U()>=1||S.matched)){ toast('Mauricio: no te vayas',true) }
}


/* =============== settings menu =============== */
const setIdx={};
function buildSettings(){
 const l=$('#setList'); l.innerHTML='';
 SETTINGS.forEach((o,i)=>{
  const b=document.createElement('button'); b.className='row'+(o.bad?' d':'');
  const tx=document.createElement('span'); tx.textContent=o.t; if(o.d){ const s=document.createElement('small'); s.textContent=o.d; tx.append(s) }
  b.append(tx);
  if(o.k==='sw'){ const s=document.createElement('i'); s.className='sw'+(o.on?' on':''); b.append(s) }
  else if(o.k==='val'){ const v=document.createElement('span'); v.className='val'; v.textContent=o.v; b.append(v) }
  b.onclick=()=>{ const n=setIdx[i]=(setIdx[i]??-1)+1; A.buzz(); ask(o.t,T(o.m[n%o.m.length]),[SETTINGS_OK]) };
  l.append(b);
 });
}
buildSettings();
$('#bSet').onclick=()=>{ if(S.phase!=='swipe')return; $('#settings').classList.add('on') };
$('#setBack').onclick=()=>$('#settings').classList.remove('on');
