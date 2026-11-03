/* =============== boot / flow =============== */
async function begin(){
 A.init(); A.resume();
 try{ const f=document.documentElement; const p=(f.requestFullscreen||f.webkitRequestFullscreen||(()=>{})).call(f); p&&p.catch&&p.catch(()=>{}) }catch(e){}
 try{ if(navigator.getBattery) navigator.getBattery().then(b=>{S.battery=Math.round(b.level*100);S.charging=b.charging}).catch(()=>{}) }catch(e){}
 S.phase='setup'; show('setup'); A.pop();
}
async function afterSetup(){
 S.name=$('#inName').value.trim(); S.city=$('#inCity').value.trim();
 S.phase='search'; show('search');
 const r1=await ask('“Flechazo” quiere enviarte notificaciones','Las notificaciones pueden incluir alertas, sonidos y globos en los iconos.',['No permitir','Permitir']);
 if(r1===1){ try{ window.Notification&&Notification.requestPermission&&Notification.requestPermission() }catch(e){} }
 const r2=await ask('“Flechazo” quiere usar tu ubicación','Te mostraremos chicos que están cerca de ti.',['No permitir','Permitir']);
 S.loc=r2===1?'yes':'no';
 await rawSleep(2300);
 S.phase='swipe'; S.tAppStart=Date.now(); show('sw'); renderDeck(); applyUI(); S.trap=true;
 try{ history.pushState({a:1},'');history.pushState({a:2},'') }catch(e){}
 ambient();
}
function ambient(){
 const tick=()=>{ if(S.ended)return;
  if(S.phase==='swipe'){ if(U()>=2&&Math.random()<(U()>=4?.7:.4)) notify(pick(NOTIFS)); if(U()>=3&&Math.random()<.5) flickUI(1); if(Math.random()<.35) subliminal() }
  if(S.phase==='chat'){ if(S.intensity>.62&&Math.random()<.25)flickUI(1); if(Math.random()<.3)subliminal() }
  setTimeout(tick,rnd(6000,11000)*SP+500) }; setTimeout(tick,9000*SP+500);
 // inactivity nag in chat
 setInterval(()=>{ if(S.phase==='chat'&&Date.now()-(S.lastAct||0)>20000){ S.lastAct=Date.now(); reply(pick(['¿Sigues ahí?','Responde.','Veo que estás leyendo. No me ignores.'])) } },4000);
 ['pointerdown','keydown'].forEach(ev=>addEventListener(ev,()=>{S.lastAct=Date.now()},{passive:true}));
}
$('#goBtn').onclick=begin;
$('#setBtn').onclick=afterSetup; $('#skipBtn').onclick=()=>{ $('#inName').value=''; $('#inCity').value=''; afterSetup() };
$('#inName').addEventListener('keydown',e=>{ if(e.key==='Enter')$('#inCity').focus() }); $('#inCity').addEventListener('keydown',e=>{ if(e.key==='Enter')afterSetup() });

/* escape listeners */
document.addEventListener('visibilitychange',()=>{
 if(S.ended)return;
 if(document.hidden){ S.unread=0; if(S.phase==='chat'){ S.blink=setInterval(()=>{ document.title=document.title.startsWith('(')?'¡Vuelve!':`(${++S.unread}) Mauricio te escribió` },900); setTimeout(()=>notify('No te vayas.'),500) } }
 else { clearInterval(S.blink); document.title='Mauricio te está esperando'; setTimeout(()=>escape('hide'),300) }
});
window.addEventListener('popstate',()=>{ if(S.trap&&!S.ended){ try{history.pushState({a:3},'')}catch(e){} S.escAt=0; escape('back') } });
window.addEventListener('beforeunload',e=>{ if(S.trap&&!S.ended){ e.preventDefault(); e.returnValue='Mauricio no quiere que te vayas.'; return e.returnValue } });
document.addEventListener('mouseout',e=>{ if(!e.relatedTarget&&e.clientY<=0&&(S.phase==='swipe'||S.phase==='chat')) escape('exit-intent') });
document.addEventListener('contextmenu',e=>{ if(S.phase==='swipe'||S.phase==='chat')e.preventDefault() });

/* emergency exit: triple tap top-center edge, or Esc x3 */
(function(){ let taps=[]; const out=()=>{ S.trap=false; S.phase='end'; endBlack(); const b=$('#again'); b.style.animation='none'; b.style.opacity=1; b.style.color='#888'; };
 const hit=()=>{ const n=Date.now(); taps=taps.filter(t=>n-t<1400); taps.push(n); if(taps.length>=3)out() };
 addEventListener('pointerdown',e=>{ if(e.clientY<56&&e.clientX>innerWidth*.38&&e.clientX<innerWidth*.62)hit() });
 addEventListener('keydown',e=>{ if(e.key==='Escape')hit() }); })();

/* grain texture + preload */
(function(){ const c=document.createElement('canvas'); c.width=c.height=160; const x=c.getContext('2d'),d=x.createImageData(160,160); for(let i=0;i<d.data.length;i+=4){const v=Math.random()*255; d.data[i]=d.data[i+1]=d.data[i+2]=v; d.data[i+3]=255} x.putImageData(d,0,0); $('#grain').style.backgroundImage=`url(${c.toDataURL()})`;
 Object.values(IMG).forEach(u=>{const i=new Image(); i.src=u}) })();
