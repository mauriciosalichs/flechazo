/* =============== finale =============== */
async function finale(){
 if(S.phase!=='chat')return; S.phase='finale'; S.trap=false;
 setI(1); A.thump(1); vib([300,100,300,100,600]);
 flickUI(3); await rawSleep(900); tearUI(); await rawSleep(500);
 const L=$('#lights'); L.style.transition='opacity .08s'; L.style.opacity=1;
 await rawSleep(1700);
 // blink the dark: a hint of him in the black
 const sub=$('#sub'); sub.style.backgroundImage=`url(${IMG.SC0})`; sub.style.opacity='.5'; await rawSleep(90); sub.style.opacity='0'; await rawSleep(900);
 // screamer
 const sc=$('#scream'), im=$('#scImg'); sc.classList.add('on'); L.style.opacity=0; A.scream(); vib([100,50,100,50,400]);
 const frames=['SC0','SC1','SC0','SC1','SC2','SC1','SC3','SC1','SC0','SC1','SC2','SC1','SC0','SC1'];
 const t0=performance.now(); let k=0, last=-1;
 await new Promise(res=>{ const step=now=>{ const e=now-t0; const f=Math.floor(e/190); if(f!==last){ last=f; im.src=IMG[frames[f%frames.length]]; } const z=1+e/2600*.55; im.style.transform=`translate(${rnd(-14,14)}px,${rnd(-14,14)}px) scale(${z})`; if(e<2550)requestAnimationFrame(step); else res() }; requestAnimationFrame(step) });
 endBlack();
}
function endBlack(){
 if(S.ended)return; S.ended=true; S.phase='end'; S.trap=false; A.stopAll();
 $('#scream').classList.remove('on'); $('#black').classList.add('on'); $('#lights').style.opacity=0;
 setTimeout(()=>{ try{window.open('','_self');window.close()}catch(e){} },1200);
 setTimeout(()=>{ try{ if(window.top===window&&!window.closed) location.replace('about:blank') }catch(e){} },2400);
}
$('#again').onclick=()=>location.reload();

