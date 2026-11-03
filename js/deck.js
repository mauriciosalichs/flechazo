/* =============== deck =============== */
const deck=$('#deck');
function stagePhotos(st,n=3){ return shuffle(['A','B','C','D','E']).slice(0,n).map(x=>x+st) }
function mauriProfile(k){
 const blocked=S.matched||k>=S.blockAt;
 const p={key:'m'+k,k,isM:true,name:'Mauricio'};
 if(!blocked){ p.age=31; p.dist=['','a 4 km','a 2 km','a 900 m'][k]; p.ph=stagePhotos([0,0,1,2][k]); p.bio=pick(M_BIO[k]) }
 else { const L=S.lvl, pool=(S.matched?LV_MATCH:LV_BLOCK)[L]; p.age=L>=6?'':31; p.dist=LVKM[L]; p.ph=stagePhotos(LVSTAGE[L]); p.bio=pick(pool) }
 p.photos=p.ph.map(x=>IMG[x]); return p;
}
function profileFor(qi){
 if(S.cache[qi])return S.cache[qi];
 const e=entryAt(qi); let p;
 if(e.t==='o'){ const o=OT[e.i]; const creepy=(S.nopes>=2||S.matched)&&Math.random()<.85;
  p={key:'o'+e.i,k:0,isM:false,name:o.p.n,age:o.p.a,dist:`a ${o.p.km} km`,photos:[IMG[o.photo]],bio:creepy?nextCreep():o.bio} }
 else p=mauriProfile(e.k);
 return S.cache[qi]=p;
}
function buildCard(p,next){
 const el=document.createElement('div'); el.className='card'+(p.isM?' m':'')+(next?' next':''); el.dataset.idx=0;
 el.innerHTML=`<div class="bars"></div><img class="ph" alt="" draggable="false"><div class="shade"></div><div class="stamp like">ME GUSTA</div><div class="stamp nope">NO</div>
 <div class="info"><div class="nm"><b></b><span></span><svg viewBox="0 0 24 24"><path d="${ICON.check}"/></svg></div><div class="ds"><svg class="i" viewBox="0 0 24 24"><path d="${ICON.pin}"/></svg><em></em></div><p class="bio"></p></div>`;
 el._p=p; fillCard(el); const ga=ghostAlpha(); if(!p.isM&&ga>0){ const g=document.createElement('div'); g.className='ghost'; g.style.backgroundImage=`url(${IMG.SC3})`; g.style.opacity=ga; el.insertBefore(g,el.querySelector('.shade')) } return el;
}
function ghostAlpha(){ return S.matched?clamp(S.press*.1,0,.45):S.nopes>=2?.14:0 }
function fillCard(el){
 const p=el._p, i=+el.dataset.idx;
 el.querySelector('.ph').src=p.photos[i];
 el.querySelector('.bars').style.display=p.photos.length>1?'flex':'none'; el.querySelector('.bars').innerHTML=p.photos.map((_,k)=>`<i class="${k===i?'on':''}"></i>`).join('');
 el.querySelector('.nm b').textContent=p.name; el.querySelector('.nm span').textContent=p.age;
 el.querySelector('.ds em').textContent=p.dist+' de ti';
 el.querySelector('.bio').textContent=T(p.bio);
}
function renderDeck(){
 deck.innerHTML='';
 const cur=profileFor(S.qi); S.cur=cur;
 if(!isBlocked()){ deck.append(buildCard(profileFor(S.qi+1),true)) }
 const c=buildCard(cur,false); deck.append(c); S.card=c;
 if(S.qi<12) setI(Math.max(S.intensity,S.qi*.03+S.nopes*.05));
}
function applyUI(){
 const L=U();
 $('#bBst').classList.toggle('gone',L>=1);
 $('#bRew').classList.toggle('gone',L>=2);
 $('#bSup').classList.toggle('gone',L>=3);
 $('#tic').classList.toggle('gone',L>=3);
 $('#tabs').classList.toggle('gone',L>=4);
 $('#bNope').classList.toggle('lock',S.lvl>=5);
 $('#bNope').classList.toggle('gone',S.lvl>=6);
 $('#acts').classList.toggle('hearts',S.lvl>=7);
 $('#logo').style.visibility=L>=5?'hidden':'visible';
 $$('#tabs button').forEach(b=>{ if(b.dataset.t!=='cards')b.classList.toggle('dis',L>=2) });
 $('#bd').classList.toggle('on',(L>=1||S.matched)&&L<4);
 if(S.lvl>=5) $('#bNope').innerHTML='<svg class="i" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>';
}
function isBlocked(){ return !!(S.cur&&S.cur.isM&&(S.matched||S.cur.k>=S.blockAt||S.cur.k===5)) }
function blockedAttempt(){
 if(S.busy)return; const c=S.card;
 S.blocked++; S.lvl=Math.min(8,S.blocked); S.busy=true;
 A.buzz(); vib([200,80,200]);
 c.style.transition='transform .5s cubic-bezier(.2,1.6,.4,1)'; c.style.transform='none';
 c.querySelectorAll('.stamp').forEach(s=>s.style.opacity=0);
 shakeEl(c); setTimeout(()=>{ c.classList.add('glitch'); A.glitch(); const p=mauriProfile(c._p.k); S.cache[S.qi]=p; S.cur=p; c._p=p; c.dataset.idx=0; fillCard(c); applyUI(); setI(Math.max(S.intensity,.38+S.lvl*.078)); tearUI(); setTimeout(()=>c.classList.remove('glitch'),600) },180);
 if(S.lvl>=3&&S.lvl%2) setTimeout(()=>notify(pick(NOTIFS)),900);
 setTimeout(()=>{S.busy=false},700);
}
function fly(dir){
 const c=S.card; if(!c||S.busy)return; S.busy=true; A.whoosh(); vib(20);
 c.style.transition='transform .4s ease-in,opacity .4s'; c.style.transform=`translate(${dir*620}px,-40px) rotate(${dir*28}deg)`; c.style.opacity=0;
 setTimeout(()=>{ S.busy=false; decide(dir>0?'right':'left') },380);
}
function decide(dir){
 const p=S.cur; S.swipes[dir]++;
 if(p.isM){
  if(dir==='right'){
   if(p.k<=2){ softMatch() }                       // 1st/2nd time: match, but NOT straight to the chat
   else { goMatch(S.matched?'matched':S.blocked>0?'blocked':'direct'); return }
  } else {                                         // allowed NO (not blocked)
   S.nopes++;
   if(S.nopes===1){ setTimeout(()=>toast('Mauricio vio tu decisión 🙂',true),500); setI(Math.max(S.intensity,.12)) }
   if(S.nopes>=2){ setTimeout(()=>toast(pick(['Mauricio está escribiendo…','Mauricio ya sabe dónde buscarte']),true),500); setI(Math.max(S.intensity,.24)); setTimeout(()=>notify(pick(['Interesante.','Anotado.','Lo recordaré.'])),2500) }
  }
 } else {
  if(dir==='right'){ toast(`¡Match con ${p.name}! 💘`); if(S.qi>=5||S.matched) setTimeout(()=>toast(pick([`${p.name} ha eliminado su cuenta`,`${p.name} te ha bloqueado: «Mauricio me lo pidió»`,`${p.name} ha desaparecido de tu lista`]),true),1800) }
  if(S.matched){ S.cheat++; S.press++; pressEffects(); if(S.phase!=='swipe')return }
 }
 S.qi++; renderDeck();
}
function softMatch(){
 const again=S.matched; S.matched=true; S.cache={};
 toast('¡Match con Mauricio! 💘'); setTimeout(()=>notify(pick(MATCH_HI)),1300);
 setI(Math.max(S.intensity,.28)); applyUI();
 if(again){ S.press+=2; pressEffects() }
}
function pressEffects(){
 const p=S.press; applyUI(); setI(Math.max(S.intensity,.28+p*.08));
 if(p>=4){ forceChat(); return }
 if(p>=1) setTimeout(()=>notify(pick(COMPLAIN)),700);
 if(p>=2){ tearUI(); vib([150,60,150]) }
}
async function forceChat(){
 if(S.phase!=='swipe')return; S.phase='forced'; A.buzz(); vib([200,100,300]); tearUI();
 await rawSleep(900);
 await ask('1 mensaje nuevo',`Mauricio: «${T(pick(FORCE_LINES))}»`,['Abrir']);
 goMatch('forced');
}
function nope(){ if(S.phase!=='swipe'||S.busy)return; if(isBlocked()) blockedAttempt(); else fly(-1) }
function like(){ if(S.phase!=='swipe'||S.busy)return; fly(1) }
$('#bNope').onclick=nope; $('#bLike').onclick=like; $('#bSup').onclick=like;
$('#bRew').onclick=()=>toast('Deshacer es una función Premium');
$('#bBst').onclick=()=>toast('Boost es una función Premium');
$$('#tabs button,#tic button[data-t]').forEach(b=>b.onclick=()=>{
 const t=b.dataset.t; if(t==='cards')return;
 if(t==='msgs'&&S.matched){ goMatch('matched'); return }
 if(U()>=1||S.matched){ shakeEl($('#sw'),'shake'); A.buzz(); toast('Mauricio: no te vayas',true); escape('tab'); return }
 toast({likes:'Aún no tienes likes',msgs:'Aún no tienes mensajes',me:'Tu perfil está en revisión',bell:'No tienes notificaciones'}[t]);
});
let drag=null;
deck.addEventListener('pointerdown',e=>{ if(S.phase!=='swipe'||S.busy||!S.card)return; drag={x:e.clientX,y:e.clientY,t:Date.now(),dx:0,raw:0,moved:false,id:e.pointerId}; try{deck.setPointerCapture(e.pointerId)}catch(_){}; S.card.style.transition='none' });
deck.addEventListener('pointermove',e=>{
 if(!drag||e.pointerId!==drag.id)return; const c=S.card; let raw=e.clientX-drag.x, dy=(e.clientY-drag.y)*.4;
 if(Math.abs(raw)+Math.abs(e.clientY-drag.y)>7)drag.moved=true; drag.raw=raw;
 let dx=raw; const blk=isBlocked();
 if(blk&&raw<0){ const lim=S.lvl>=6?14:S.lvl>=3?34:60; dx=-Math.min(lim,-raw*.28) }
 c.style.transform=`translate(${dx}px,${dy}px) rotate(${dx/18}deg)`;
 const lk=c.querySelector('.stamp.like'), np=c.querySelector('.stamp.nope');
 lk.style.opacity=clamp(dx/100,0,1);
 if(blk){ np.classList.add('bl'); np.textContent='NO PUEDES'; np.style.opacity=clamp(-raw/90,0,1) } else { np.classList.remove('bl'); np.textContent='NO'; np.style.opacity=clamp(-dx/100,0,1) }
});
function endDrag(e){
 if(!drag||(e&&e.pointerId!==drag.id))return; const d=drag; drag=null; const c=S.card; if(!c)return;
 if(!d.moved&&Date.now()-d.t<400){ // tap = browse photos
  const r=c.getBoundingClientRect(), x=e.clientX-r.left, n=c._p.photos.length; let i=+c.dataset.idx; i = x<r.width*.4 ? (i-1+n)%n : (i+1)%n; c.dataset.idx=i; fillCard(c); A.pop(); if(S.intensity>.5)A.glitch(); return }
 if(d.raw>110){ like(); return }
 if(d.raw<-110){ if(isBlocked()){ blockedAttempt() } else fly(-1); return }
 c.style.transition='transform .35s cubic-bezier(.2,1.4,.4,1)'; c.style.transform='none'; c.querySelectorAll('.stamp').forEach(s=>s.style.opacity=0);
}
deck.addEventListener('pointerup',endDrag); deck.addEventListener('pointercancel',endDrag);

