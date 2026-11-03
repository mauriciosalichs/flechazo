/* =============== audio =============== */
const A={ctx:null,
 init(){ if(this.ctx)return; const C=window.AudioContext||window.webkitAudioContext; if(!C)return;
  try{ const c=this.ctx=new C(); const comp=c.createDynamicsCompressor(); comp.threshold.value=-14; comp.ratio.value=8;
   this.master=c.createGain(); this.master.gain.value=.85; this.master.connect(comp); comp.connect(c.destination);
   const lp=this.lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=160;
   const g=this.amb=c.createGain(); g.gain.value=0;
   [[55,'sawtooth',.22],[55.7,'sawtooth',.22],[82.4,'sine',.4],[110.6,'triangle',.1]].forEach(([f,t,v])=>{const o=c.createOscillator();o.type=t;o.frequency.value=f;const og=c.createGain();og.gain.value=v;o.connect(og);og.connect(lp);o.start()});
   lp.connect(g); g.connect(this.master);
   this.nbuf=c.createBuffer(1,c.sampleRate*2,c.sampleRate); const d=this.nbuf.getChannelData(0); for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
   const ns=c.createBufferSource(); ns.buffer=this.nbuf; ns.loop=true; const nf=c.createBiquadFilter(); nf.type='bandpass'; nf.frequency.value=500; nf.Q.value=.6; const ng=c.createGain(); ng.gain.value=.05; ns.connect(nf); nf.connect(ng); ng.connect(g); ns.start();
   this.hbLoop();
  }catch(e){this.ctx=null}
 },
 resume(){ if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume() },
 setI(i){ if(!this.ctx)return; const t=this.ctx.currentTime; this.amb.gain.setTargetAtTime(i<.03?0:.03+i*.34,t,.8); this.lp.frequency.setTargetAtTime(150+i*420,t,.8) },
 env(node,t,a,peak,d){ node.gain.setValueAtTime(0,t); node.gain.linearRampToValueAtTime(peak,t+a); node.gain.exponentialRampToValueAtTime(.0001,t+a+d) },
 tone(f,dur,type='sine',vol=.2,at=0,f2){ if(!this.ctx)return; const c=this.ctx,t=c.currentTime+at; const o=c.createOscillator(),g=c.createGain(); o.type=type; o.frequency.setValueAtTime(f,t); if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur); this.env(g,t,.006,vol,dur); o.connect(g); g.connect(this.master); o.start(t); o.stop(t+dur+.05) },
 noise(dur,f,vol=.2,type='bandpass',at=0,f2){ if(!this.ctx)return; const c=this.ctx,t=c.currentTime+at; const s=c.createBufferSource(); s.buffer=this.nbuf; const fl=c.createBiquadFilter(); fl.type=type; fl.frequency.setValueAtTime(f,t); if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+dur); fl.Q.value=1.2; const g=c.createGain(); this.env(g,t,.005,vol,dur); s.connect(fl); fl.connect(g); g.connect(this.master); s.start(t,Math.random()); s.stop(t+dur+.05) },
 ding(){ this.tone(1175,.35,'sine',.22); this.tone(1568,.5,'sine',.18,.09) },
 pop(){ this.tone(520,.1,'sine',.12,0,780) },
 whoosh(){ this.noise(.28,500,.14,'bandpass',0,2400) },
 buzz(){ this.tone(70,.32,'sawtooth',.4); this.tone(74,.32,'square',.2); this.noise(.2,200,.3,'lowpass') },
 glitch(){ this.noise(rnd(.05,.14),rnd(800,5000),.25); this.tone(rnd(200,900),.06,'square',.08) },
 thump(i){ if(!this.ctx)return; const v=.12+.7*i; this.tone(62,.2,'sine',v,0,38); this.tone(58,.2,'sine',v*.65,.17,36) },
 knock(n=3,vol=.9){ for(let k=0;k<n;k++){ const at=k*.42+(k>0?rnd(0,.05):0); this.tone(95,.14,'sine',vol,at,55); this.noise(.1,260,vol*.6,'lowpass',at); this.noise(.04,2000,vol*.2,'bandpass',at) } },
 steps(n=6){ for(let k=0;k<n;k++){ const at=k*.55; this.noise(.12,180,.5+k*.05,'lowpass',at); this.tone(70,.1,'sine',.3,at,45) } },
 hbLoop(){ const go=()=>{ const i=S.intensity; if(this.ctx&&i>.12&&!S.ended){ this.thump(i); const v=$('#vig'); v.classList.remove('pulse'); void v.offsetWidth; v.classList.add('pulse') } setTimeout(go,60000/(58+i*95)) }; go() },
 scream(){ if(!this.ctx)return; const c=this.ctx,t=c.currentTime; const ws=c.createWaveShaper(); const cv=new Float32Array(1024); for(let i=0;i<1024;i++){const x=i/512-1;cv[i]=Math.tanh(x*14)} ws.curve=cv;
  const g=c.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(1,t+.01); g.gain.setValueAtTime(1,t+2.0); g.gain.linearRampToValueAtTime(0,t+2.5);
  ws.connect(g); g.connect(this.master);
  [[620,2100,'sawtooth'],[655,2300,'square'],[310,1100,'sawtooth'],[1250,3200,'sawtooth']].forEach(([a,b,ty],k)=>{ const o=c.createOscillator(); o.type=ty; o.frequency.setValueAtTime(a,t); o.frequency.exponentialRampToValueAtTime(b,t+1.6); o.frequency.linearRampToValueAtTime(b*.8,t+2.4);
   const lfo=c.createOscillator(); lfo.frequency.value=14+k*3; const lg=c.createGain(); lg.gain.value=a*.06; lfo.connect(lg); lg.connect(o.frequency); lfo.start(t);
   const og=c.createGain(); og.gain.value=.22; o.connect(og); og.connect(ws); o.start(t); o.stop(t+2.6); lfo.stop(t+2.6) });
  this.tone(48,.9,'sine',1,0,30); this.noise(2.2,3000,.55,'bandpass',0,900); this.noise(.3,120,.8,'lowpass')
 },
 stopAll(){ try{ this.amb&&this.amb.gain.setTargetAtTime(0,this.ctx.currentTime,.05); this.master.gain.setTargetAtTime(0,this.ctx.currentTime+.05,.05) }catch(e){} }
};

