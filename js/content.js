/* =============== content =============== */
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const U=()=>Math.max(S.lvl,S.press);
const PERSONAS=[
 {n:'Dani',a:27,km:3,bios:['Diseñador gráfico. Mis plantas están mejor cuidadas que mi vida social.','Diseño logos de día y veo series de noche. Busco co-protagonista.']},
 {n:'Álex',a:29,km:5,bios:['Fisioterapeuta. Senderismo los domingos, series los lunes. Busco a alguien que sepa elegir pizza.','Te arreglo la espalda y tú me arreglas el plan del sábado.']},
 {n:'Nico',a:26,km:2,bios:['Barista. Te preparo el mejor café si me pasas tu playlist.','Latte art y malas ideas. Pero con buena espuma.']},
 {n:'Sergio',a:31,km:8,bios:['Chef. Cocino mejor de lo que bailo, pero bailo igual.','Si sabes lavar los platos, ya tienes mi corazón.']},
 {n:'Pablo',a:28,km:4,bios:['Profe de yoga. Respira. Desliza. Respira.','Flexible de cuerpo y de horarios. Rígido solo con la puntualidad.']},
 {n:'Javi',a:30,km:6,bios:['Arquitecto. Dibujo casas y planeo escapadas. Se aceptan propuestas.','Diseño espacios donde caben dos. Todavía falta uno.']},
 {n:'Marcos',a:25,km:9,bios:['Estudiante de música. Toco la guitarra mal, pero con mucho sentimiento.','Compongo canciones de amor. Todas con final feliz. Todavía no tengo a quién dedicárselas.']},
 {n:'Lucas',a:33,km:3,bios:['Veterinario. Sí, puedes conocer a mi perro. Es la primera cita oficial.','Cuido animales de día. De noche, cuido mi sofá.']}
];
const PHI=shuffle([0,1,2,3,4,5,6,7]), PER=shuffle(PERSONAS);
const OT=PER.map((p,i)=>({p,photo:'P'+PHI[i],bio:pick(p.bios)}));   // different photo<->name pairing and order each run
const SEQ=[{t:'o',i:0},{t:'o',i:1},{t:'m',k:1},{t:'o',i:2},{t:'o',i:3},{t:'m',k:2},{t:'o',i:4},{t:'m',k:3},{t:'o',i:5},{t:'m',k:4}];
function entryAt(qi){ if(qi<SEQ.length)return SEQ[qi]; const j=qi-SEQ.length; return j%2===0?{t:'o',i:6+(j/2)%2}:{t:'m',k:5} }
const M_BIO={
 1:['Me gusta el café, las caminatas nocturnas y la gente que no dice adónde va. Busco a alguien con quien salir esta semana. 🙂',
    'Cocino de maravilla. Mi especialidad: la sopa y los secretos. Ambos mejor calientes.',
    'Busco a alguien sin prisa por volver a casa. Ni nadie esperándole. Mejor así.',
    'Aficiones: senderismo, fotografía y averiguar dónde viven las personas que me dan like.'],
 2:['Segunda vez que aparezco. Dicen que la primera es casualidad y la segunda es destino. La tercera es denuncia, pero yo no me preocuparía.',
    'Mi madre decía que la paciencia es una virtud. Mi madre ya no dice nada.',
    'Cuido mucho de mi pareja. Las 24 horas. Desde los arbustos.',
    'Mis amigos dicen que soy intenso. Bueno, los que quedan.'],
 3:['Mi ex me dijo que me olvidara de ella. Y me olvidé de todo, menos de dónde vive.',
    'Tengo un jardín precioso. El abono es de primera calidad. No preguntes de dónde sale.',
    'Mi psicólogo dijo que esto no es sano. Mi psicólogo ya no atiende.',
    'Mi superpoder: aparecer en tu pantalla justo cuando creías estar solo.']
};
const LV_BLOCK=[
 ['{ord} vez que aparezco. A partir de aquí el NO se desactiva. Está en los términos y condiciones que no leíste.','Dime que sí y listo. Mi ex también dijo que no. Qué bonito césped tiene ahora su jardín.'],
 ['Ya me dijiste que no {nos}. Esta vez la aplicación no te deja, {n}. Vuelve al centro.','Intentaste el NO. Qué gracioso. En las películas también intentan huir. ¿Cuánto duran? Exacto.'],
 ['¿Por qué sigues intentándolo? Veo cómo mueves el dedo hacia la izquierda.','Cada vez que deslizas a la izquierda me acerco cien metros. Ya casi estoy en tu calle.'],
 ['Sé que estás {enc}. Sé que son las {h}. Sé que estás ahí, a solas con tu pantalla.','Mi talento oculto: saber en qué piso vives sin que me lo digas. Y qué timbre más fácil.'],
 ['Borré a todos los demás. Aquí solo estoy yo. Siempre fui el único.','Los otros perfiles ya no están. Se fueron a un lugar mejor. Sin cobertura.'],
 ['Esto no es una app de citas. Es una cita. Y ya empezó.','Esta app te cuesta 0 euros. A ti. A otros les costó bastante más.'],
 ['ESTOY MUY CERCA. DESLIZA A LA DERECHA.','ESTOY TAN CERCA QUE ME VES REFLEJADO. DERECHA.'],
 ['No me hagas ir yo. Ya sé cuál es tu puerta.','Mi paciencia se acabó. Como la de los que me dijeron que no. DERECHA.'],
 ['DERECHA. DERECHA. DERECHA. DERECHA.','DERECHA. O LA PUERTA. TÚ ELIGES.']
];
const LV_MATCH=[
 ['Hicimos match y sigues deslizando a otros. Llevas {cheat}. Yo no soy celoso, solo guardo recuerdos.','Ya diste match conmigo. Seguir deslizando es infidelidad con fecha de caducidad. La mía.'],
 ['No puedes decir que no a un match. Es ley. Mi ley, {n}.','¿Un NO? Ya diste SÍ. Aquí no se devuelve nada. Ni los chicos, ni los corazones, ni las llaves.'],
 ['¿Quieres deshacer nuestro match? Eso solo se puede con Premium. Y el Premium soy yo.','Intentas dejarme y yo solo quería enseñarte mi colección. De mensajes. De fotos tuyas.'],
 ['Sé que estás {enc}. Y sé que estás pensando en el siguiente chico. Qué gente más valiente.','Si me ignoras a mí, imagínate lo que hago con los chicos que tocas con el dedo.'],
 ['Borré a todos los demás por tu bien. Eran peores. Y estaban muy callados.','Esos chicos no te convienen. Ya los convencí de que se queden quietos. Para siempre.']
].concat(LV_BLOCK.slice(5));
const LVKM=['a 500 m','a 300 m','a 150 m','a 80 m','a 40 m','a 15 m','a 4 m','a 1 m','en esta habitación'];
const LVSTAGE=[1,2,2,3,3,4,4,5,5];
const NOTIFS=['No me ignores 🙂','Vuelve.','Te estoy esperando.','Contéstame, {n}.','¿Por qué huyes?','Te estoy viendo.','Abre el chat.','Mírame.','No te vayas.','No apagues la pantalla.','Sé dónde estás.','Cada vez estoy más cerca.','Responde, {n}.','No me hagas ir yo.','Ya casi llego.','Estoy leyendo cómo me ignoras.','¿Adónde crees que vas?','No hay salida, {n}.',
 'Tengo tu dirección y un buen presentimiento.','Mi madre dice que no me ignores. Mi madre está muy callada hoy.','Qué portal tan bonito. Se ve fácil de abrir.','Me da igual que me ignores: yo tengo todo el tiempo del mundo. Tú no.','Se oye tu respiración. Es broma. Todavía.','Si no contestas, hablaré con tus vecinos. Seguro que me saben decir dónde estás.'];
const COMPLAIN=['¿Otro chico? Ya tienes un match.','Te vi mirando a ese. Yo también miro. A ti.','Llevas {cheat} deslizados. Yo llevo la cuenta de todo.','Nuestro match, {n}. Nuestro chat. Ve.','No me hagas celoso. Cuando me pongo celoso, redecoro.','Ese chico tiene muy poco futuro, la verdad.'];
const MATCH_HI=['Hola 🙂 Háblame cuando quieras. Estoy aquí. Siempre estoy aquí.','¡Match! Ven a mi chat. Te guardé sitio. Y una silla extra por si vienes con compañía.','Hola, {n}. Ya eres mío. Digo… ya somos match. ¿Vienes al chat?'];
const FORCE_LINES=['Basta de deslizar. Ven a mi chat.','Se acabaron los otros. Ya está.','Esa fue la última. Abre el chat.','Ya perdiste suficiente tiempo con los demás.'];
const APP_NOTIFS=['Novedad: Flechazo ya tiene modo oscuro. Tú ya lo tenías por dentro.','Novedad: ahora puedes ver quién te ha visto. Spoiler: nadie. Nadie bueno.','Recomendación: cenar solo también es una cita. Con alguien exigente, pero una cita.','Recomendación: el 100 % de las relaciones que empiezan aquí terminan. Es lo único que garantizamos.','Novedad: hemos mejorado el algoritmo. Sigue sin entenderte, pero ahora con más confianza.','Recomendación: tu ex te echa de menos. Es mentira, pero queda bien en una notificación.','Novedad: verificación de perfiles con foto. Ahora los catfish también tienen buena luz.','Recomendación: hidrátate. Lo del amor ya lo veremos.','Novedad: Flechazo Premium. Sufre igual, pero con más opciones.','Recomendación: el amor es ciego. Por eso las primeras citas son en bares oscuros.','Novedad: actualización de términos y condiciones. Nadie los leyó la primera vez tampoco.','Recomendación: si nadie te escribe, piensa que al menos nadie te ha decepcionado todavía.'];
const CREEP_O=shuffle(['Oye… no me mires a mí. Mauricio está detrás de la pantalla y se pone celoso.','Mauricio me pidió que te dijera que deslices hacia él. Por favor, hazlo.','Antes tenía bio. Ahora solo tengo miedo.','No me elijas. Se enfada. Y yo todavía tengo que dormir esta noche.','Mauricio dice que si le gusto a alguien, me hará una visita. Mejor no me des like.','Hay alguien detrás de mí en todas mis fotos. Sí, ese Mauricio.','Soy de los últimos perfiles que te quedan. Después, solo queda él.','Te aviso: está leyendo esto contigo.']);
let creepI=0; const nextCreep=()=>CREEP_O[creepI++%CREEP_O.length];


/* =============== ajustes ===============
   EDITA AQUÍ los ajustes y sus mensajes de comedia.
   t: título del ajuste · d: descripción · k: 'sw' (interruptor, empieza en on/off según "on") o 'val' (muestra un valor) o 'btn'
   m: lista de mensajes; al tocar el ajuste sale uno distinto cada vez.
   {n} se sustituye por tu nombre. */
const SETTINGS=[
 {t:'Notificaciones',d:'Avisos de la app',k:'sw',on:true,m:['Imposible desactivarlas. No es una amenaza, es un servicio.','Las notificaciones son lo único que te escribe sin que tú tengas que empezar. Déjalas.','Desactivadas con éxito. Mentira, pero tu fe en el botón nos conmueve.']},
 {t:'Sonido',d:'Efectos y vibración',k:'sw',on:true,m:['El silencio incomoda. Mantenemos el sonido por tu bien.','Silenciado. Hasta que lo necesites para no estar solo/a.','Error: tu soledad requiere al menos 40 dB.']},
 {t:'Ubicación',d:'Mostrar perfiles cercanos',k:'sw',on:true,m:['Qué gracioso. Ya sabemos dónde estás.','Dejar de compartir tu ubicación no te hace invisible. Y sospechoso.']},
 {t:'Modo oscuro',d:'Para tu estado de ánimo',k:'sw',on:false,m:['Ya vives en él.','Cambio denegado. La oscuridad te elige a ti, no al revés.']},
 {t:'Distancia máxima',d:'Hasta dónde buscar',k:'val',v:'500 m',m:['Cambiado a 500 m. Más lejos, no. Más cerca, sí.','Distancia máxima ampliada a infinito. Se acabaron las excusas de "queda lejos".','Hemos probado con 5 km. Dicen que está muy cerca de todos modos.']},
 {t:'Edad de preferencia',d:'Entre 18 y 99',k:'val',v:'18–99',m:['Intervalo actualizado: ahora entre "disponible" y "improbable".','Tus estándares han sido revisados a la baja. Por tu bien.','Edad modificada. Tu esperanza, no.']},
 {t:'Idioma',d:'Español',k:'val',v:'Español',m:['Idioma cambiado a "silencio incómodo". Es bastante universal.']},
 {t:'Privacidad',d:'Quién puede ver tu perfil',k:'val',v:'Todos',m:['Todos. Incluso quienes no deberían. Sobre todo esos.','Perfil oculto. Solo lo verán quienes de verdad quieran encontrarte.','Privacidad: lo que sea que fuera eso, se acabó.']},
 {t:'Cerrar sesión',d:'',k:'btn',m:['No hay salida en esta app. Lo mismo que tu última relación.','Cerrando sesión… Error 404: ganas de irte no encontradas.','Cerrar sesión es una función Premium. Te cobraremos 9,99 € por irte.']},
 {t:'Eliminar cuenta',d:'',k:'btn',bad:true,m:['Cuenta eliminada. Era broma, llevamos tus datos hasta en el testamento.','Para eliminar tu cuenta, escribe a un correo que no existe. Gracias.','Se ha enviado una solicitud de eliminación a… a nadie. Seguimos aquí, {n}.']}
];
const SETTINGS_OK='Vale'; // texto del botón del mensaje
