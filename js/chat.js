/* =============== configuración del chat (edita estos valores) =============== */
const CHAT_PAUSE=[2600,4400];       // pausa entre mensajes de Mauricio (ms), mín y máx
const CHAT_TYPE_MS_PER_CHAR=62;     // lo que tarda "escribiendo…" por carácter (ms)
const CHAT_TYPE_MIN_MAX=[1100,3600];// duración mínima y máxima de "escribiendo…" (ms)
const CHAT_KB_SHUFFLE_MS=900;       // cada cuánto se reordenan las letras del teclado (ms)
const CHAT_RUSH_LINES=8;            // cuántos mensajes va más rápido Mauricio tras un texto ininteligible
const GARBLE_REPLIES=['No te entiendo. ¿Estás bien?','Eso no son palabras. Me estás preocupando.','¿Qué te pasa? ¿Estás herido? No te muevas.','Algo no va bien. Voy para allá ahora mismo.','Tranquilo, {n}. Ya voy. Es por tu bien.','Me tienes muy preocupado. Voy más rápido.','Aguanta. Estoy a nada de llegar.'];

/* =============== match -> chat =============== */
function goMatch(why){
 S.why=why||'direct'; S.phase='match'; show('match'); A.tone(220,.9,'sawtooth',.15,0,110); A.thump(.6); vib([100,50,300]);
 const TX={direct:['Sabía que me elegirías.','Siempre me eligen. Al final.'],blocked:['Sabía que acabarías diciendo que sí.','Tardaste, pero llegaste.'],matched:['Ya hicimos match, ¿recuerdas? Pues ven.','Por fin vienes a verme.'],forced:['Ya era hora.','Se acabó el deslizar.']};
 $('#mSub').textContent=(why==='forced'||why==='matched')?'Ya hicimos match. Ven al chat.':'A ti y a Mauricio os gustáis.';
 $('#mTxt').textContent=T(pick(TX[S.why]));
 const k=S.why==='direct'?pick(['A1','C1']):pick(['A2','B2','D2']); $('#mPic').style.backgroundImage=`url(${IMG[k]})`; $('#mPic').style.backgroundSize='cover';
 setI(Math.max(S.intensity,.5));
 setTimeout(startChat,3200);
}
const msgs=$('#msgs'), typing=$('#typing');
function setTyping(d){ S.typing=Math.max(0,S.typing+d); typing.classList.toggle('on',S.typing>0); if(S.typing>0){msgs.append(typing); msgs.scrollTop=msgs.scrollHeight} $('#hSt').textContent = S.typing>0?'escribiendo…':S.dist; }
function bubble(from,text,img){
 const r=document.createElement('div'); r.className='row '+from;
 const b=document.createElement('div'); b.className='bub'; if(img){const im=document.createElement('img'); im.src=img; b.append(im)}
 if(text){const s=document.createElement('span'); s.textContent=text; b.append(s)}
 const t=document.createElement('small'); t.textContent=hora(); r.append(b,t); msgs.insertBefore(r,typing);
 msgs.scrollTop=msgs.scrollHeight+999; if(from==='him'){A.pop(); vib(40); if(S.intensity>.7){ if(Math.random()<.5)tearUI() }} ;
}
function setDist(txt,i){ S.dist=txt; const s=$('#hSt'); s.textContent=txt; s.className=i>.8?'near':'far'; if(i!==undefined) setI(i); chatAvatar() }
function chatAvatar(){ const i=S.intensity; $('#hAv').src=IMG[i<.55?'A1':i<.7?'A2':i<.85?'B3':'D3'] }
function setComposer(m){ ['cIn','cChips','cLocked','cDoor'].forEach(id=>$('#'+id).classList.remove('on')); $('#'+m).classList.add('on'); $('#chat').classList.toggle('hot',m==='cLocked'||m==='cDoor') }
async function reply(text,delay=0){ if(S.phase!=='chat')return; await rawSleep(delay||rnd(1000,1900)); setTyping(1); await rawSleep(clamp(T(text).length*CHAT_TYPE_MS_PER_CHAR,CHAT_TYPE_MIN_MAX[0],CHAT_TYPE_MIN_MAX[1])); setTyping(-1); if(S.phase!=='chat')return; bubble('him',T(text)) }
async function say(text,o={}){
 if(S.phase!=='chat')return;
 if(o.pre)await sleep(o.pre);
 setTyping(1); await sleep(clamp(T(text).length*CHAT_TYPE_MS_PER_CHAR,CHAT_TYPE_MIN_MAX[0],CHAT_TYPE_MIN_MAX[1]));
 if(S.phase!=='chat'){setTyping(-1);return}
 setTyping(-1); bubble('him',T(text),o.img?IMG[o.img]:null);
 if(S.rush>0)S.rush--;
 await sleep(o.gap||rnd(CHAT_PAUSE[0],CHAT_PAUSE[1]));
}
const CHIPS={'Vale':['Eso es todo lo que necesitaba oír.','Ya lo habías dicho.','Buena elección.'],'No puedo hoy':['Sí puedes. Ya quedamos.','No era una pregunta.','Hoy. Ahora. Conmigo.'],'¿Quién eres?':['El que va a verte hoy.','Mauricio. Lo leíste en mi perfil tres veces.','Ya lo sabes. Ya lo sabes. Ya lo sabes.']};
/* teclado con letras que cambian de sitio + mensajes ininteligibles */
const KB_LETTERS='abcdefghijklmnñopqrstuvwxyz'.split('');
function buildKb(){
 const kb=$('#kb'); kb.innerHTML='';
 shuffle(KB_LETTERS).forEach(ch=>{ const b=document.createElement('button'); b.type='button'; b.dataset.k=ch; b.textContent=ch; kb.append(b) });
 const sp=document.createElement('button'); sp.type='button'; sp.className='sp'; sp.dataset.k=' '; sp.textContent='espacio';
 const bk=document.createElement('button'); bk.type='button'; bk.className='bk'; bk.dataset.k='del'; bk.textContent='⌫';
 kb.append(sp,bk);
}
function shuffleKb(){ const kb=$('#kb'); const keys=[...kb.querySelectorAll('button[data-k]:not(.sp):not(.bk)')]; shuffle(keys).forEach(k=>kb.insertBefore(k,kb.querySelector('.sp'))) }
$('#kb').addEventListener('pointerdown',e=>{
 const b=e.target.closest('button[data-k]'); if(!b||S.phase!=='chat')return; e.preventDefault();
 const t=$('#cText'); const k=b.dataset.k; A.pop();
 if(k==='del')t.value=t.value.slice(0,-1); else if(t.value.length<t.maxLength)t.value+=k;
});
buildKb();
setInterval(()=>{ if(S.phase==='chat'&&$('#cIn').classList.contains('on'))shuffleKb() },CHAT_KB_SHUFFLE_MS);
function garble(v){
 let out=v.replace(/\S/g,()=>pick(KB_LETTERS));
 return out===v?out+pick(KB_LETTERS):out;
}
$('#cIn').addEventListener('submit',e=>{
 e.preventDefault(); const v=$('#cText').value.trim(); if(!v||S.phase!=='chat')return; $('#cText').value='';
 bubble('me',garble(v)); S.garble=(S.garble||0)+1; S.rush=Math.max(S.rush,CHAT_RUSH_LINES); setI(Math.max(S.intensity,.58));
 reply(GARBLE_REPLIES[(S.garble-1)%GARBLE_REPLIES.length]);
});
function buildChips(){ const b=$('#cChips'); b.innerHTML=''; Object.keys(CHIPS).forEach(k=>{ const x=document.createElement('button'); x.textContent=k; x.onclick=()=>{ if(S.phase!=='chat')return; bubble('me',k); const n=S.chipN[k]=(S.chipN[k]||0)+1; reply(CHIPS[k][(n-1)%3]) }; b.append(x) }) }
$('#cBack').onclick=()=>{ if(S.phase!=='chat')return; A.buzz(); shakeEl($('#chat')); S.escAt=0; escape('back') };
$('#cMenu').onclick=()=>{ if(S.phase==='chat')$('#sheet').classList.add('on') };
$('#shCan').onclick=()=>$('#sheet').classList.remove('on');
async function failAct(txt){ $('#sheet').classList.remove('on'); A.buzz(); await ask('No se pudo completar',txt,['Aceptar']); S.escAt=0; escape('block') }
$('#shRep').onclick=()=>failAct('Tu denuncia no se ha podido enviar. Mauricio ya lo sabe.');
$('#shBlk').onclick=()=>failAct('No puedes bloquear a este usuario. Él ya te ha bloqueado a ti la salida.');

let doorPressed=false;
$('#doorBtn').onclick=()=>{ doorPressed=true; $('#doorBtn').disabled=true; bubble('me','Abrir la puerta'); A.thump(1) };

async function startChat(){
 S.phase='chat'; S.dist='en línea'; show('chat'); $('#hSt').textContent='en línea'; chatAvatar(); buildChips(); setComposer('cIn'); msgs.querySelectorAll('.row').forEach(r=>r.remove());
 setI(Math.max(S.intensity,.55)); setDist('en línea',S.intensity);
 const nm=S.name, el=Date.now()-S.tAppStart, ch=S.cheat;
 await sleep(1100);
 await say(nm?pick([`Hola ${nm} 🙂`,`Por fin, ${nm}.`,`${nm}. Qué bien suena tu nombre en mi pantalla.`]):pick(['Hola 🙂','Por fin 🙂']));
 if(ch>0){
  await say(pick([`Deslizaste a ${ch} chico${ch>1?'s':''} después de darme match. Los conté todos.`,`Hicimos match y tú, a lo tuyo: ${ch} chico${ch>1?'s':''} más. Qué ritmo llevas.`]));
  await say(pick(['No me enfado. Solo lo apunto en mi libreta. Tengo una muy gorda.','Tranqui. Ya les dije que se quedaran quietos. Para siempre.','Los he guardado a todos. En un sitio fresco y oscuro.']));
 } else if(S.blocked>0){
  await say(pick(['Por fin. Sabía que acabarías diciéndome que sí.','Mira quién cambió de opinión. Qué rápido se aprende cuando no hay otra opción.']));
  await say(pick([`Intentaste huir ${S.blocked} ${S.blocked==1?'vez':'veces'}. Las conté todas.`,`${S.blocked} ${S.blocked==1?'intento':'intentos'} de huida. Ninguno funcionó. Qué buen récord.`]));
 } else if(S.nopes>0) await say(pick(['Me dijiste que no… y aun así aquí estás.','Dijiste que no, pero tu dedo dijo otra cosa.']));
 else await say(pick(['Sabía que me elegirías. Siempre me eligen. Al final.','Qué rápido. Me gustan los que no se hacen de rogar. Los otros duran menos.']));
 await say(pick([`Tardaste ${fmtDur(el)} en decidirte. Estuve esperando todo ese tiempo.`,`${fmtDur(el)} desde que abriste la app. Yo llevaba toda la vida esperándote.`]));
 await say(pick(['Quiero verte. Hoy. Ahora mismo.','Quiero verte hoy. No es una invitación.']));
 setComposer('cChips');
 await say(pick(['No hace falta que me digas dónde estás.','No me digas dónde estás. Sería como decirme lo que ya sé.']));
 await say(S.city?pick([`Ya lo sé. ${S.city}. Qué bonito.`,`${S.city}, ¿verdad? Hermoso sitio para desaparecer.`]):'Ya lo sé. Más cerca de lo que crees.');
 setDist('a 3,2 km',.64);
 await say(`Son las ${hora()} y aquí seguimos los dos. ${pick(['Me gusta.','Qué íntimo.'])}`);
 await say(pick(['No cierres la app.','No cierres la app. Si la cierras, me ofendo. Y cuando me ofendo, viajo.']));
 await say(S.loc==='no'?pick(['Dijiste que no a la ubicación. No la necesito.','Negaste la ubicación. Qué mono. Tu móvil me la dio igual.']):pick(['Gracias por la ubicación, por cierto. Fue muy útil.','La ubicación que me diste es perfecta. Hasta el piso.']));
 setDist('a 2,4 km',.68);
 await say(pick(['Me estoy acercando. ¿Lo notas?','Voy andando. Ya sabes lo que dicen: quien bien te quiere te hará llorar. Y quien mal te quiere, también.']));
 if(S.battery!==null) await say(S.charging?'Estás cargando el móvil. Qué considerado: así no se apaga.':`${S.battery}% de batería. No te va a alcanzar para huir.`);
 else await say('Tu pantalla es la única luz que tienes encendida, ¿verdad?');
 await say(pick(['Si intentas irte, te seguiré escribiendo. Y te llegarán muchas notificaciones. Muchas.','Si intentas irte, me pondré insistente. Mi madre decía que soy muy insistente. Mi madre ya no dice nada.']));
 setDist('a 1,3 km',.74);
 await say(pick(['Ya casi llego.','Ya casi llego. Llevo una sorpresa. Y una pala por si acaso.']));
 setComposer('cLocked');
 setDist('a 600 m',.8); subliminal();
 await say('Estoy en tu calle.');
 await say(pick(['Hay una luz encendida. ¿Es la tuya?','Veo una ventana con luz. Ahí hay alguien. Ahí hay alguien que no apaga la pantalla.']));
 await say('Así de cerca estoy.',{img:pick(['A3','B3','D3'])});
 setDist('a 50 m',.85);
 await say('Estoy en el portal.');
 await say(pick(['Alguien dejó la puerta abierta. Qué descuido.','El portal estaba abierto. Qué confiados sois todos.']));
 setDist('a 3 m',.9); A.steps(6);
 await say('Estoy subiendo.',{gap:1500});
 setDist('en tu puerta',.94); A.knock(3,1); vib([200,100,200,100,200]); flickUI(2);
 await say('Estoy en tu puerta.',{gap:900});
 doorPressed=false; setComposer('cDoor');
 A.knock(2,1);
 await say('toc toc toc 🙂',{gap:300});
 for(let t=0;t<10&&!doorPressed&&S.phase==='chat';t++){ await rawSleep(1000); if(t===4){A.knock(3,1); vib([300,100,300])} }
 setComposer('cLocked');
 await say(doorPressed?pick(['Gracias. Aunque no hacía falta.','Gracias por abrir. La llave de repuesto estaba debajo de la maceta, por cierto.']):pick(['No hace falta que abras.','No abras. Ya entré. Pero es de buena educación preguntar.']),{gap:900});
 setDist('en tu casa',1); flickUI(2); A.thump(1);
 await say('Ya estoy en tu casa.',{gap:1700});
 await say(pick(['Estoy detrás de ti.','No te des la vuelta. Estoy detrás de ti.']),{gap:1300});
 finale();
}

