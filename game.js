'use strict';
/* ====== Pinta Con Música ====== */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const KEYS=['a','s','d','f'];
const FALL=1.8, HITW=0.14, LEAD=3;

/* ---------- Fondos ---------- */
const pr=(i,k)=>{const x=Math.sin(i*127.1+k*311.7)*43758.5453;return x-Math.floor(x)};
const stars=(c,w,h,t,n)=>{c.fillStyle='#fff';for(let i=0;i<n;i++){c.globalAlpha=.3+.7*Math.abs(Math.sin(t*(.6+pr(i,3))+i));
  c.beginPath();c.arc(pr(i,1)*w,pr(i,2)*h,(pr(i,4)*1.8+.4)*(h/300+.6),0,7);c.fill()}c.globalAlpha=1};
const ROAD={dark:'#231f29',glass:'rgba(24,18,30,.8)',clear:'rgba(0,0,0,0)'};
const BGS=[
 {id:'naranja',n:'Naranja pop',p:0,road:'dark',d:(c,w,h)=>{c.fillStyle='#f58220';c.fillRect(0,0,w,h)}},
 {id:'estrellas',n:'Noche de estrellas',p:60,road:'clear',d:(c,w,h,t)=>{c.fillStyle='#04040d';c.fillRect(0,0,w,h);stars(c,w,h,t,150)}},
 {id:'lienzo',n:'Lienzo con notas',p:80,road:'glass',edge:'#2a2433',d:(c,w,h,t)=>{
   c.fillStyle='#fbfaf6';c.fillRect(0,0,w,h);c.fillStyle='#b3acc2';c.textAlign='center';c.globalAlpha=.7;
   for(let i=0;i<16;i++){c.font=h*(.08+pr(i,1)*.09)+'px serif';
     const x=((pr(i,2)*w+t*(20+pr(i,3)*35))%(w+80))-40;c.fillText(i%2?'♪':'♫',x,pr(i,4)*h+Math.sin(t+i)*10)}c.globalAlpha=1}},
 {id:'partitura',n:'Partitura',p:100,road:'glass',edge:'#2a2433',d:(c,w,h,t)=>{
   c.fillStyle='#f3ead3';c.fillRect(0,0,w,h);c.strokeStyle=c.fillStyle='#3a332a';c.lineWidth=Math.max(1,h/280);
   const g=h/60;
   for(let r=0;r<3;r++){const y0=h*(.14+r*.3);
     for(let i=0;i<5;i++){c.beginPath();c.moveTo(0,y0+i*g);c.lineTo(w,y0+i*g);c.stroke()}
     for(let k=0;k<7;k++){const L=w+60,x=(((k*w/6-t*40*(1+r*.3))%L)+L)%L-30,y=y0+Math.floor(pr(k+r*9,5)*8)*g/2-g*.5;
       c.beginPath();c.ellipse(x,y,g*.75,g*.52,-.3,0,7);c.fill();c.fillRect(x+g*.65,y-g*3,Math.max(1.5,g*.16),g*3)}}}},
 {id:'atardecer',n:'Atardecer neón',p:90,road:'glass',d:(c,w,h)=>{
   const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#2a0a5e');g.addColorStop(.55,'#ff2e93');g.addColorStop(1,'#ffb347');
   c.fillStyle=g;c.fillRect(0,0,w,h);c.fillStyle='#ffe66d';c.beginPath();c.arc(w/2,h*.5,h*.24,0,7);c.fill();
   c.fillStyle='#ff2e93';for(let i=0;i<5;i++)c.fillRect(w*.25,h*.52+i*h*.05,w*.5,h*.012*(i+1))}},
 {id:'oceano',n:'Océano',p:90,road:'glass',d:(c,w,h,t)=>{
   const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#021b4a');g.addColorStop(1,'#0a7bd1');c.fillStyle=g;c.fillRect(0,0,w,h);
   c.strokeStyle='#7df9ff';c.lineWidth=Math.max(1,h/150);
   for(let r=0;r<7;r++){c.globalAlpha=.15+r*.07;c.beginPath();
     for(let x=0;x<=w;x+=8){const y=h*(.3+r*.1)+Math.sin(x/(w/9)+t*1.2+r)*h*.025;x?c.lineTo(x,y):c.moveTo(x,y)}c.stroke()}c.globalAlpha=1}},
 {id:'galaxia',n:'Galaxia',p:110,road:'glass',d:(c,w,h,t)=>{
   let g=c.createRadialGradient(w/2,h/2,0,w/2,h/2,w*.6);g.addColorStop(0,'#7b2cff');g.addColorStop(.5,'#2b0a6b');g.addColorStop(1,'#05020f');
   c.fillStyle=g;c.fillRect(0,0,w,h);g=c.createRadialGradient(w*.25,h*.3,0,w*.25,h*.3,w*.25);
   g.addColorStop(0,'#ff00e566');g.addColorStop(1,'#ff00e500');c.fillStyle=g;c.fillRect(0,0,w,h);stars(c,w,h,t,100)}},
 {id:'arcoiris',n:'Arcoíris',p:120,road:'glass',d:(c,w,h,t)=>{
   const g=c.createLinearGradient(0,0,w,h);for(let i=0;i<=5;i++)g.addColorStop(i/5,`hsl(${(t*30+i*60)%360},95%,58%)`);
   c.fillStyle=g;c.fillRect(0,0,w,h)}},
 {id:'ciudad',n:'Ciudad nocturna',p:130,road:'glass',d:(c,w,h,t)=>{
   const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#0d0630');g.addColorStop(1,'#5b1a7a');c.fillStyle=g;c.fillRect(0,0,w,h);
   stars(c,w,h*.5,t,40);const n=16,bw=w/n,s=Math.floor(t/2);
   for(let i=0;i<n;i++){const bh=h*(.25+pr(i,1)*.4);c.fillStyle='#0a0618';c.fillRect(i*bw,h-bh,bw-2,bh);
     for(let y=h-bh+8;y<h-8;y+=14)for(let x=i*bw+5;x<(i+1)*bw-8;x+=10){if(pr(x+y,s)>.6){c.fillStyle='#ffd54a';c.fillRect(x,y,4,6)}}}}},
 {id:'lluvia',n:'Lluvia de colores',p:140,road:'glass',d:(c,w,h,t)=>{
   c.fillStyle='#0b0818';c.fillRect(0,0,w,h);c.lineCap='round';c.lineWidth=Math.max(2,w/150);
   for(let i=0;i<46;i++){const y=(t*h*.5*(.4+pr(i,2))+pr(i,3)*h)%h;c.strokeStyle=`hsl(${pr(i,4)*360},100%,60%)`;
     c.beginPath();c.moveTo(pr(i,1)*w,y);c.lineTo(pr(i,1)*w,y+h*.07);c.stroke()}}},
 {id:'popart',n:'Pop art',p:150,road:'glass',d:(c,w,h)=>{
   c.fillStyle='#ffe14a';c.fillRect(0,0,w,h);c.fillStyle='#ff3b6b';const st=h/12;
   for(let y=0;y<h+st;y+=st)for(let x=0;x<w+st;x+=st){c.beginPath();c.arc(x+(y/st%2?st/2:0),y,st*.3*(.4+x/w*.8),0,7);c.fill()}}},
 {id:'retro',n:'Cuadrícula retro',p:160,road:'glass',d:(c,w,h,t)=>{
   const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#0a0018');g.addColorStop(.5,'#3a0a6b');g.addColorStop(1,'#0a0018');
   c.fillStyle=g;c.fillRect(0,0,w,h);c.lineWidth=Math.max(1,h/200);c.strokeStyle='#ff00e5';
   for(let i=-10;i<=10;i++){c.beginPath();c.moveTo(w/2,h*.5);c.lineTo(w/2+i*w/6,h);c.stroke()}
   c.strokeStyle='#00f0ff';for(let k=0;k<9;k++){const y=h*.5+h*.5*Math.pow((k+(t*.4)%1)/9,2);c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke()}}}
];
const bgOf=id=>BGS.find(b=>b.id===id)||BGS[0];
function drawBgTo(cn,id,t,road){
  const c=cn.getContext('2d'),w=cn.width,h=cn.height,b=bgOf(id);c.clearRect(0,0,w,h);c.save();b.d(c,w,h,t);c.restore();
  if(road){c.beginPath();c.moveTo(w/2-w*.14,h*.03);c.lineTo(w/2+w*.14,h*.03);c.lineTo(w/2+w*.3,h);c.lineTo(w/2-w*.3,h);c.closePath();
    c.fillStyle=ROAD[b.road];c.fill();c.strokeStyle=b.edge||'#f4f1ea';c.lineWidth=3;c.stroke()}
}

/* ---------- Datos ---------- */
const COLORS=[
 {id:'rojo',n:'Rojo neón',c:'#ff2a4d',p:0},{id:'verde',n:'Verde neón',c:'#39ff14',p:0},
 {id:'azul',n:'Azul neón',c:'#2d9cff',p:0},{id:'amarillo',n:'Amarillo neón',c:'#fff01f',p:0},
 {id:'magenta',n:'Magenta',c:'#ff00e5',p:80},{id:'cian',n:'Cian',c:'#00f0ff',p:80},
 {id:'naranja',n:'Naranja',c:'#ff7a00',p:90},{id:'violeta',n:'Violeta',c:'#b026ff',p:100},
 {id:'rosa',n:'Rosa chicle',c:'#ff6ec7',p:110},{id:'lima',n:'Lima',c:'#c6ff00',p:110},
 {id:'turquesa',n:'Turquesa',c:'#00ffb3',p:120},{id:'fucsia',n:'Fucsia',c:'#ff1493',p:120},
 {id:'coral',n:'Coral',c:'#ff5e3a',p:130},{id:'celeste',n:'Celeste',c:'#7df9ff',p:140},
 {id:'lavanda',n:'Lavanda',c:'#c18bff',p:150},{id:'oro',n:'Oro',c:'#ffd300',p:160}];
const colorOf=id=>COLORS.find(c=>c.id===id);
/* min = precisión mínima de la canción para desbloquearla (una pintura por canción) */
const PAINTINGS=[
 {n:'Los girasoles',a:'Vincent van Gogh, 1888',min:60,e:'🌻',bg:'linear-gradient(160deg,#ffd23f,#e08e0b 60%,#6b4a14)'},
 {n:'El beso',a:'Gustav Klimt, 1908',min:60,e:'💋',bg:'radial-gradient(circle at 50% 40%,#ffd86b,#b8860b 60%,#4a3a10)'},
 {n:'La noche estrellada',a:'Vincent van Gogh, 1889',min:70,e:'🌌',bg:'radial-gradient(circle at 70% 25%,#fff01f 0 8%,#1b3b8f 9%,#0b1a4a)'},
 {n:'La joven de la perla',a:'Johannes Vermeer, 1665',min:70,e:'🦪',bg:'radial-gradient(circle at 50% 45%,#d9b36a,#1b2a4a 60%,#0a0f1c)'},
 {n:'El grito',a:'Edvard Munch, 1893',min:80,e:'😱',bg:'linear-gradient(160deg,#ff5e3a,#ffb347 45%,#1f3b5f)'},
 {n:'La gran ola de Kanagawa',a:'Katsushika Hokusai, 1831',min:80,e:'🌊',bg:'linear-gradient(180deg,#f2e6c4,#3b78a8 55%,#14304f)'},
 {n:'La Mona Lisa',a:'Leonardo da Vinci, 1503',min:90,e:'🖼️',bg:'radial-gradient(circle at 50% 40%,#c9a96b,#5b4a2f 60%,#2f3b2a)'},
 {n:'El nacimiento de Venus',a:'Sandro Botticelli, 1485',min:90,e:'🐚',bg:'linear-gradient(180deg,#bfe3dd,#8fc7b5 60%,#4f8f7a)'},
 {n:'La persistencia de la memoria',a:'Salvador Dalí, 1931',min:100,e:'🕰️',bg:'linear-gradient(180deg,#8fc4e8,#e8c88f 60%,#8a6a3a)'},
 {n:'La última cena',a:'Leonardo da Vinci, 1498',min:100,e:'🍷',bg:'linear-gradient(180deg,#8a6a3a,#3b2a1a)'},
 {n:'Guernica',a:'Pablo Picasso, 1937',min:100,e:'🕊️',bg:'linear-gradient(135deg,#eee,#777 55%,#111)'}];
const DEF={plays:0,accSum:0,done:0,persev:100,coins:120,owned:['rojo','verde','azul','amarillo'],
  sel:['rojo','verde','azul','amarillo'],gal:[],best:{},bestCombo:0,bg:'naranja',ownedBg:['naranja'],
  ach:{},played:[],streak:0,bestStreak:0,bestAcc:0,rew:[]};
let S={...DEF};
try{S={...DEF,...JSON.parse(localStorage.getItem('pcm')||'{}')}}catch(e){}
if(!Array.isArray(S.gal))S.gal=Array.from({length:Math.min(+S.gal||0,PAINTINGS.length)},(_,i)=>i);
const save=()=>{try{localStorage.setItem('pcm',JSON.stringify(S))}catch(e){}};

/* ---------- Logros y avisos ---------- */
const ACH=[
 ...[70,80,90,100].map(p=>({id:'acc'+p,n:`Precisión ${p}%`,d:`Termina una canción con ${p}% o más de precisión.`,i:'🎯',f:()=>S.bestAcc>=p})),
 ...[3,5,7].map(n=>({id:'rach'+n,n:`Perseverante x${n}`,d:`Completa ${n} canciones seguidas sin salirte a la mitad.`,i:'🔥',f:()=>S.bestStreak>=n})),
 {id:'gal',n:'Coleccionista de arte',d:'Desbloquea todas las pinturas de la galería.',i:'🖼️',f:()=>S.gal.length>=PAINTINGS.length},
 {id:'col',n:'Paleta completa',d:'Desbloquea todos los tonos de pintura.',i:'🎨',f:()=>S.owned.length>=COLORS.length},
 {id:'fon',n:'Decorador',d:'Desbloquea todos los fondos.',i:'🌆',f:()=>S.ownedBg.length>=BGS.length},
 {id:'all',n:'Repertorio completo',d:'Toca todas las canciones al menos una vez.',i:'🎵',f:()=>SONGS.length>0&&SONGS.every(s=>S.played.includes(s.name))},
 ...[3,5,7,9,10].map(n=>({id:'done'+n,n:`${n} canciones completadas`,d:`Completa ${n} canciones.`,i:'🏅',f:()=>S.done>=n})),
 {id:'combo60',n:'Racha de 60',d:'Consigue 60 aciertos seguidos.',i:'⚡',f:()=>S.bestCombo>=60}];
function notify(msg){
  const d=document.createElement('div');d.className='toastn';d.textContent=msg;$('#notif').appendChild(d);setTimeout(()=>d.remove(),4200);
}
function checkAch(){
  ACH.forEach(a=>{if(!S.ach[a.id]&&a.f()){S.ach[a.id]=1;notify('🏆 Logro desbloqueado: '+a.n)}});save();
}
/* Perseverancia: 150, 200, 250… dan un premio aleatorio (una sola vez cada múltiplo) */
function persevReward(){
  for(let m=150;m<=S.persev;m+=50){
    if(S.rew.includes(m))continue;S.rew.push(m);
    const pool=[...COLORS.filter(c=>!S.owned.includes(c.id)).map(c=>['c',c]),...BGS.filter(b=>!S.ownedBg.includes(b.id)).map(b=>['b',b])];
    let txt;
    if(pool.length){const[k,it]=pool[Math.floor(Math.random()*pool.length)];
      if(k==='c'){S.owned.push(it.id);txt='el color '+it.n}else{S.ownedBg.push(it.id);txt='el fondo '+it.n}}
    else{const c=100+50*Math.floor(Math.random()*5);S.coins+=c;txt=c+' monedas'}
    notify(`🌟 Perseverancia ${m}: ¡desbloqueaste ${txt}!`);
  }
}

/* ---------- Sonido de menú y botones ---------- */
let AC,menuAud=null,clickUrl=null,gest=false;
const ensureAC=()=>AC||(AC=new(window.AudioContext||window.webkitAudioContext)());
async function findAudio(base){
  for(const e of['mp3','wav','ogg']){const u=`canciones/${base}.${e}`;try{const r=await fetch(u,{method:'HEAD'});if(r.ok)return u}catch(x){}}
  return null;
}
function syncMusic(){
  if(!gest||!menuAud)return;
  if($('#game').classList.contains('active'))menuAud.pause();else menuAud.play().catch(()=>{});
}
(async()=>{const m=await findAudio('menu');clickUrl=await findAudio('botones');
  if(m){menuAud=new Audio(m);menuAud.loop=true;menuAud.volume=.45;syncMusic();if(!gest)$('#btnSound').hidden=false}})();
const onG=()=>{if(!gest){gest=true;$('#btnSound').hidden=true;syncMusic()}};addEventListener('pointerdown',onG);addEventListener('keydown',onG);
function tick(){
  if(clickUrl){const a=new Audio(clickUrl);a.volume=.7;a.play().catch(()=>{});return}
  try{const A=ensureAC(),o=A.createOscillator(),g=A.createGain();o.type='triangle';o.frequency.value=880;
    g.gain.setValueAtTime(.15,A.currentTime);g.gain.exponentialRampToValueAtTime(.001,A.currentTime+.09);
    o.connect(g);g.connect(A.destination);o.start();o.stop(A.currentTime+.1)}catch(e){}
}
document.addEventListener('click',e=>{if(e.target.closest('button,.file-btn')&&!e.target.closest('#pad'))tick()});

/* ---------- Navegación ---------- */
const R={songs:renderSongs,achievements:renderAch,stats:renderStats,gallery:renderGallery,shop:renderShop};
function go(id){
  $$('.screen').forEach(s=>s.classList.toggle('active',s.id===id));
  $$('.coins').forEach(e=>e.textContent='🪙 '+S.coins);
  if(R[id])R[id]();syncMusic();
}
$$('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
setTimeout(()=>go('menu'),4200);   // la intro dura 4 s

/* ---------- Canciones ---------- */
let SONGS=[],loaded=false;
const RESERVED=/^(menu|botones)$/i;
const fmt=s=>isFinite(s)?Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0'):'--:--';
function getDur(s){return new Promise(r=>{const a=new Audio();a.preload='metadata';
  a.onloadedmetadata=()=>{s.dur=a.duration;r()};a.onerror=()=>r();a.src=s.url;setTimeout(r,4000)})}
async function loadSongs(){
  let names=[];
  try{const r=await fetch('canciones/');if(r.ok){const t=await r.text();
    for(const m of t.matchAll(/href="([^"]+?\.mp3)"/gi))names.push(decodeURIComponent(m[1]).split(/[\\/]/).pop())}}catch(e){}
  if(!names.length)try{const r=await fetch('canciones/lista.json');if(r.ok)names=await r.json()}catch(e){}
  const fresh=[...new Set(names)].filter(f=>!SONGS.some(s=>s.file===f)&&!RESERVED.test(f.replace(/\.mp3$/i,'')))
    .map(f=>({file:f,name:f.replace(/\.mp3$/i,''),url:'canciones/'+encodeURIComponent(f)}));
  await Promise.all(fresh.map(getDur));
  SONGS.push(...fresh);loaded=true;
}
async function renderSongs(){
  const box=$('#songList');
  if(!loaded){box.innerHTML='<div class="empty">Buscando canciones…</div>';await loadSongs()}
  if(!SONGS.length){
    box.innerHTML=`<div class="empty">No encontré canciones. Pon tus archivos <code>.mp3</code> en la carpeta <code>canciones</code> junto a index.html
    y abre el juego con un servidor local (por ejemplo <code>python -m http.server</code> o la extensión Live Server de VS Code).
    También puedes usar el botón de abajo para cargarlas desde tu equipo.</div>`;return}
  box.innerHTML='';
  SONGS.forEach(s=>{
    const r=document.createElement('div');r.className='row';const b=S.best[s.name];
    r.innerHTML=`<div class="name">${s.name.replace(/</g,'&lt;')}<small>Duración ${fmt(s.dur)}${b?' · Mejor '+b+'%':''}</small></div><button class="play">Jugar</button>`;
    r.querySelector('button').onclick=()=>askMode(s);box.appendChild(r);
  });
}
$('#fileIn').onchange=async e=>{
  const fs=[...e.target.files].filter(f=>/\.mp3$/i.test(f.name)&&!RESERVED.test(f.name.replace(/\.mp3$/i,''))),fresh=[];
  for(const f of fs)if(!SONGS.some(s=>s.name===f.name.replace(/\.mp3$/i,'')))
    fresh.push({file:f.name,name:f.name.replace(/\.mp3$/i,''),url:URL.createObjectURL(f)});
  await Promise.all(fresh.map(getDur));SONGS.push(...fresh);renderSongs();
};

/* ---------- Logros / Stats / Galería / Tienda ---------- */
function renderAch(){
  const box=$('#achList');box.innerHTML='';
  ACH.forEach(a=>{const done=!!S.ach[a.id],d=document.createElement('div');d.className='ach '+(done?'done':'locked');
    d.innerHTML=`<span class="ic">${done?a.i:'🔒'}</span><div><b>${a.n}</b><br><small>${a.d}</small></div>`;
    if(!done){const sh=()=>{d.classList.remove('shake');void d.offsetWidth;d.classList.add('shake')};d.onclick=sh;sh()}
    box.appendChild(d)});
}
function renderStats(){
  const avg=S.done?(S.accSum/S.done):0;
  $('#statBox').innerHTML=`
   <div class="stat">Nivel de ritmo (precisión media)<br><b>${avg.toFixed(1)}%</b><div class="meter" style="--c:#39ff14"><i style="width:${avg}%"></i></div></div>
   <div class="stat">Nivel de perseverancia<br><b>${S.persev}</b><div class="meter" style="--c:#ff00e5"><i style="width:${Math.min(100,S.persev)}%"></i></div>
     <div class="bubble">La perseverancia empieza en 100. Pierdes 1 punto cada vez que sales de una canción a la mitad y ganas 5 puntos cada vez que terminas una canción, sin importar cuántas veces falles. Al llegar a 150, 200, 250… ¡desbloqueas algo al azar!</div></div>
   <div class="stat">Canciones completadas<br><b>${S.done}</b></div>
   <div class="stat">Racha actual de canciones completadas<br><b>${S.streak}</b></div>
   <div class="stat">Mejor racha de aciertos<br><b>${S.bestCombo}</b></div>`;
}
function renderGallery(){
  $('#galGrid').innerHTML=PAINTINGS.map((p,i)=>{const ok=S.gal.includes(i);
    return `<div class="art ${ok?'':'locked'}"><div class="img" style="background:${p.bg}">${ok?p.e:'🔒'}</div>
    <div class="cap"><b>${ok?p.n:'Pintura bloqueada'}</b><br><small>${ok?p.a:'Termina una canción con '+p.min+'% o más'}</small></div></div>`}).join('');
}
let prevOn=false;
function prevLoop(){
  if(!$('#shop').classList.contains('active')){prevOn=false;return}
  drawBgTo($('#bgPrev'),S.bg,performance.now()/1000,true);requestAnimationFrame(prevLoop);
}
function renderShop(){
  $$('.coins').forEach(e=>e.textContent='🪙 '+S.coins);
  $('#slots').innerHTML=S.sel.map(id=>`<i style="--c:${colorOf(id).c}" title="${colorOf(id).n}"></i>`).join('');
  const g=$('#shopGrid');g.innerHTML='';
  COLORS.forEach(c=>{const own=S.owned.includes(c.id),sel=S.sel.includes(c.id);
    const d=document.createElement('button');d.className='sw'+(sel?' sel':'');d.style.setProperty('--c',c.c);
    d.innerHTML=`<i></i><b>${c.n}</b><small>${sel?'En tu paleta':own?'Tuyo':'🪙 '+c.p}</small>`;
    d.onclick=()=>{
      if(!own){if(S.coins<c.p)return alert('No te alcanzan las monedas.');S.coins-=c.p;S.owned.push(c.id)}
      if(!S.sel.includes(c.id)){S.sel.shift();S.sel.push(c.id)}
      save();checkAch();renderShop()};
    g.appendChild(d)});
  const bg=$('#bgGrid');bg.innerHTML='';
  BGS.forEach(b=>{const own=S.ownedBg.includes(b.id),sel=S.bg===b.id;
    const d=document.createElement('button');d.className='sw bgsw'+(sel?' sel':'');d.style.setProperty('--c','#fff');
    const cn=document.createElement('canvas');cn.width=160;cn.height=90;d.appendChild(cn);drawBgTo(cn,b.id,2,false);
    d.insertAdjacentHTML('beforeend',`<b>${b.n}</b><small>${sel?'En uso':own?'Tuyo · usar':'🪙 '+b.p}</small>`);
    d.onclick=()=>{
      if(!own){if(S.coins<b.p)return alert('No te alcanzan las monedas.');S.coins-=b.p;S.ownedBg.push(b.id)}
      S.bg=b.id;save();checkAch();renderShop()};
    bg.appendChild(d)});
  if(!prevOn){prevOn=true;prevLoop()}
}

/* ---------- Análisis de ritmo ---------- */
function makeFFT(N){
  const rev=new Uint32Array(N),cs=new Float32Array(N/2),sn=new Float32Array(N/2),b=Math.log2(N);
  for(let i=0;i<N;i++){let r=0,x=i;for(let j=0;j<b;j++){r=(r<<1)|(x&1);x>>=1}rev[i]=r}
  for(let i=0;i<N/2;i++){cs[i]=Math.cos(2*Math.PI*i/N);sn[i]=-Math.sin(2*Math.PI*i/N)}
  return(re,im)=>{
    for(let i=0;i<N;i++){const j=rev[i];if(j>i){let t=re[i];re[i]=re[j];re[j]=t;t=im[i];im[i]=im[j];im[j]=t}}
    for(let s=2;s<=N;s<<=1){const h=s>>1,st=N/s;
      for(let i=0;i<N;i+=s)for(let k=0;k<h;k++){const wr=cs[k*st],wi=sn[k*st],a=i+k,c=a+h,
        tr=re[c]*wr-im[c]*wi,ti=re[c]*wi+im[c]*wr;re[c]=re[a]-tr;im[c]=im[a]-ti;re[a]+=tr;im[a]+=ti}}};
}
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0};
const mulberry=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};

/* Analiza 3 bandas (graves = bombo/bajo, medios = caja/guitarra/voz, agudos = platillos/hi-hat),
   estima el tempo, alinea al compás y detecta los tramos rápidos ("lluvia de pintura"). */
function analyze(buf,name){
  const sr=buf.sampleRate,c0=buf.getChannelData(0),c1=buf.numberOfChannels>1?buf.getChannelData(1):c0;
  const N=1024,HOP=512,F=Math.max(0,Math.floor((c0.length-N)/HOP)),hs=HOP/sr,dur=buf.duration;
  const win=new Float32Array(N);for(let i=0;i<N;i++)win[i]=.5-.5*Math.cos(2*Math.PI*i/(N-1));
  const re=new Float32Array(N),im=new Float32Array(N),K=180,prev=new Float32Array(K),fft=makeFFT(N);
  const fx=[new Float32Array(F),new Float32Array(F),new Float32Array(F)];
  for(let f=0;f<F;f++){
    const o=f*HOP;for(let i=0;i<N;i++){re[i]=(c0[o+i]+c1[o+i])*.5*win[i];im[i]=0}
    fft(re,im);const s=[0,0,0];
    for(let k=1;k<K;k++){const m=Math.log1p(Math.hypot(re[k],im[k])*30),d=m-prev[k];if(d>0)s[k<6?0:k<40?1:2]+=d;prev[k]=m}
    fx[0][f]=s[0];fx[1][f]=s[1];fx[2][f]=s[2]}
  const mk=a=>{
    const pre=new Float64Array(F+1);for(let i=0;i<F;i++)pre[i+1]=pre[i]+a[i];
    const w=Math.round(.5/hs),e=new Float32Array(F);
    for(let i=0;i<F;i++){const x=Math.max(0,i-w),y=Math.min(F,i+w+1);e[i]=Math.max(0,a[i]-(pre[y]-pre[x])/(y-x))}
    const p=Float32Array.from(e).sort()[Math.floor(F*.97)]||1;
    for(let i=0;i<F;i++)e[i]=Math.min(1.5,e[i]/p);return e};
  const E=fx.map(mk),WT=[.9,1,.75],env=new Float32Array(F);
  for(let i=0;i<F;i++)env[i]=Math.max(E[0][i]*WT[0],E[1][i],E[2][i]*WT[2]);
  // tempo
  let bestL=Math.round(.5/hs),bestR=-1;
  const lo=Math.floor(60/180/hs),hi=Math.ceil(60/75/hs);
  for(let L=lo;L<=hi&&L<F/2;L++){let r=0;for(let i=0;i+L<F;i++)r+=env[i]*env[i+L];r/=(F-L);
    const bpm=60/(L*hs);r*=Math.exp(-.5*Math.pow(Math.log2(bpm/120)/.9,2));if(r>bestR){bestR=r;bestL=L}}
  const comb=(P,off)=>{let s=0;for(let t=off;t<F-1;t+=P)s+=env[Math.round(t)];return s};
  let P=bestL,off=0,bs=-1;
  for(let p=bestL-1;p<=bestL+1;p+=.025)for(let o=0;o<p;o+=1){const s=comb(p,o);if(s>bs){bs=s;P=p;off=o}}
  for(let o=off-1;o<=off+1;o+=.25){const s=comb(P,o);if(s>bs){bs=s;off=o}}
  const LAT=.012,beats=[];for(let t=off;t*hs<dur;t+=P)beats.push(t*hs+LAT);
  // candidatos: rejilla de semicorcheas con fuerza por banda
  const stg=(a,g)=>{let m=0;for(let k=Math.round(g)-2;k<=Math.round(g)+2;k++)if(a[k]>m)m=a[k];return m};
  const cand=[];
  for(let j=0,g=off;g<F-3;j++,g=off+j*P/4){
    const t=g*hs+LAT;if(t<.8||t>dur-.6)continue;
    const b=[stg(E[0],g),stg(E[1],g),stg(E[2],g)],base=Math.max(b[0]*WT[0],b[1],b[2]*WT[2]);
    cand.push({t,j,b,ev:j%2===0,sc:base*(j%4===0?1.35:j%4===2?1:.7)*(j%16===0?1.25:1)})}
  const ce=cand.filter(c=>c.ev);
  // tramos rápidos
  const D=new Array(Math.ceil(dur)+1).fill(0);ce.forEach(c=>{if(c.sc>.55)D[Math.floor(c.t)]++});
  const sd=[...D].sort((a,b)=>a-b),thD=Math.max(3,sd[Math.floor(sd.length*.7)]);
  const rains=[];let s0=-1;
  for(let s=0;s<=D.length;s++){const on=s<D.length&&D[s]>=thD;if(on&&s0<0)s0=s;
    if(!on&&s0>=0){if(s-s0>=3&&s0>=5&&(!rains.length||s0-rains[rains.length-1].end>=8))rains.push({start:s0,end:s0+3});s0=-1}}
  const inRain=t=>rains.some(r=>t>=r.start&&t<r.end);
  const rainDur=rains.reduce((a,r)=>a+r.end-r.start,0);
  let th=.15,selN=ce.filter(c=>!inRain(c.t)&&c.sc>th);
  while(selN.length>(dur-rainDur)*2.6&&th<2){th+=.05;selN=ce.filter(c=>!inRain(c.t)&&c.sc>th)}
  let thr=.25,selR=cand.filter(c=>inRain(c.t)&&c.sc>thr);
  while(selR.length>rainDur*6&&thr<2){thr+=.05;selR=cand.filter(c=>inRain(c.t)&&c.sc>thr)}
  let sel=[...selN,...selR].sort((a,b)=>a.t-b.t);
  if(sel.length<Math.min(10,dur/2))sel=ce.filter(c=>c.j%4===0);
  const big=sel.map(c=>c.sc).sort((a,b)=>a-b)[Math.floor(sel.length*.88)]||9;
  // carriles según instrumento: graves→0/1, medios→1/2, agudos→2/3 (máx. 2 notas a la vez)
  const rng=mulberry(hash(name)),notes=[],cnt=[0,0,0],PR=[[0,1],[1,2],[2,3]];
  let last=-9,lastT=-9,lastLane=-1;
  const laneFor=(b,avoid)=>{let l=PR[b][(cnt[b]++ +(rng()<.25?1:0))%2];if(l===avoid)l=PR[b][0]===l?PR[b][1]:PR[b][0];return l};
  for(let i=0;i<sel.length;i++){
    const c=sel[i],gap=(sel[i+1]?sel[i+1].t:dur+9)-c.t,rn=inRain(c.t);
    if(c.t-lastT<.09&&c.t!==lastT)continue;
    const w=c.b.map((v,k)=>v*WT[k]),ord=[0,1,2].sort((a,b)=>w[b]-w[a]),b1=ord[0],b2=ord[1];
    const dbl=w[b2]>=.5&&w[b1]>=.5&&(rn||(c.sc>=big&&c.t-last>.35&&gap>.25))&&rng()<(rn?.6:.35);
    let l1=laneFor(b1,-1);
    if(dbl){notes.push({t:c.t,lane:l1,dur:0},{t:c.t,lane:laneFor(b2,l1),dur:0});last=lastT=c.t;lastLane=l1;continue}
    if(l1===lastLane&&c.t-lastT<.25)l1=PR[b1][0]===l1?PR[b1][1]:PR[b1][0];
    let d=0;if(!rn&&gap>=.7&&rng()<(gap>=1.25?.65:.5))d=Math.round(Math.min(gap-.4,2.2)*100)/100;
    notes.push({t:c.t,lane:l1,dur:d});last=c.t+d;lastT=c.t;lastLane=l1}
  return{notes,beats,rains};
}

/* ---------- Juego ---------- */
const cv=$('#cv'),ctx=cv.getContext('2d'),pc=$('#paint'),pctx=pc.getContext('2d'),bgc=$('#bg');
let G=null,W,H,TOP,HIT,BW,CX,DPR=1;const TS=.36;
let pending=null;

function askMode(song){pending=song;$('#modeSong').textContent=song.name;$('#modeModal').classList.add('show')}
$('#modeCancel').onclick=()=>$('#modeModal').classList.remove('show');
$$('[data-mode]').forEach(b=>b.onclick=()=>{$('#modeModal').classList.remove('show');begin(pending,b.dataset.mode)});

function resize(){
  DPR=Math.min(2,window.devicePixelRatio||1);
  cv.width=bgc.width=cv.clientWidth*DPR;cv.height=bgc.height=cv.clientHeight*DPR;
  pc.width=pc.clientWidth*DPR;pc.height=pc.clientHeight*DPR;
  pctx.fillStyle='#fff';pctx.fillRect(0,0,pc.width,pc.height);
  W=cv.width;H=cv.height;TOP=H*.03;HIT=H*.86;BW=Math.min(W*.9,H*1.15);CX=W/2;
}
window.addEventListener('resize',()=>{if($('#game').classList.contains('active'))resize()});
const yOf=p=>TOP+(HIT-TOP)*Math.pow(Math.max(p,0),1.7);
const scOf=y=>TS+(1-TS)*((y-TOP)/(HIT-TOP));
const xOf=(l,s)=>CX+(l-1.5)*(BW/4)*s;

async function begin(song,mode){
  ensureAC();if(AC.state==='suspended')await AC.resume();
  $('#game').classList.toggle('touch',mode==='touch');
  go('game');$('#loading').classList.add('show');
  $$('#pad button').forEach(b=>b.style.setProperty('--c','#3a3548'));
  resize();
  try{
    if(!song.buf)song.buf=await AC.decodeAudioData(await (await fetch(song.url)).arrayBuffer());
    await new Promise(r=>setTimeout(r,40));
    if(!song.an)song.an=analyze(song.buf,song.name);
  }catch(e){$('#loading').classList.remove('show');alert('No pude leer esa canción.');go('songs');return}
  const cols=S.sel.map(id=>colorOf(id).c);
  G={song,mode,bg:bgOf(S.bg),notes:song.an.notes.map(n=>({...n,c:cols[Math.floor(Math.random()*4)],st:0,v:0,hold:false})),
     beats:song.an.beats,rains:song.an.rains.map(r=>({...r,w:false})),rain:false,
     sum:0,res:0,combo:0,max:0,pressed:[0,0,0,0],fl:[null,null,null,null],
     paused:false,counting:false,over:false,i0:0,now:-LEAD};
  G.notes.sort((a,b)=>a.t-b.t);
  pctx.fillStyle='#fff';pctx.fillRect(0,0,pc.width,pc.height);
  const src=AC.createBufferSource();src.buffer=song.buf;src.connect(AC.destination);
  G.startAt=AC.currentTime+LEAD;src.start(G.startAt);G.src=src;
  $('#hudAcc').textContent='100%';$('#hudCombo').textContent='';
  $('#loading').classList.remove('show');
  loop();
}

function say(t,col){const e=$('#toast');e.textContent=t;e.style.color=col||'#fff';e.classList.remove('pop');void e.offsetWidth;e.classList.add('pop')}
const BAD=['Eso no pinta bien','¡Cuidado con el pincel!','Se te corrió la pintura'];
const GOOD=['¡Eres todo un Picasso!','¡Qué obra maestra!','¡Pincelada perfecta!'];

function press(l){
  if(!G||G.paused||G.over||G.pressed[l])return;
  G.pressed[l]=1;$$('#pad button')[l].classList.add('on');
  const now=AC.currentTime-G.startAt;let b=null;
  for(const n of G.notes){
    if(n.t-now>HITW)break;
    if(n.lane!==l||n.st!==0)continue;
    if(Math.abs(n.t-now)<=HITW&&(!b||Math.abs(n.t-now)<Math.abs(b.t-now)))b=n}
  if(!b)return;
  b.st=1;b.v=1;G.sum+=1;G.res++;G.combo++;
  if(b.dur>0)b.hold=true;
  if(G.combo>G.max)G.max=G.combo;
  G.fl[l]={c:b.c,t:performance.now()};splat(l,b.c);hud();
  if(G.combo%10===0)say(GOOD[Math.floor(G.combo/10-1)%GOOD.length],'#39ff14');
}
function release(l){G&&(G.pressed[l]=0);$$('#pad button')[l].classList.remove('on')}
function miss(n,broken){
  if(broken){n.v=.5;G.sum-=.5;n.st=2}else{n.st=2;G.res++}
  if(G.combo>=3||Math.random()<.5)say(BAD[Math.floor(Math.random()*BAD.length)],'#ff2a4d');
  G.combo=0;hud();
}
function hud(){
  $('#hudAcc').textContent=(G.res?G.sum/G.res*100:100).toFixed(0)+'%';
  $('#hudCombo').textContent=G.combo>1?'x'+G.combo:'';
}
function splat(l,col){
  const x=xOf(l,1)+(Math.random()-.5)*BW/5,y=Math.random()*pc.height,r=(10+Math.random()*20)*DPR;
  pctx.fillStyle=col;pctx.beginPath();pctx.arc(x,y,r,0,7);pctx.fill();
  for(let i=0;i<8;i++){const a=Math.random()*6.3,d=r*(1+Math.random()*1.8);
    pctx.beginPath();pctx.arc(x+Math.cos(a)*d,y+Math.sin(a)*d,r*(.1+Math.random()*.3),0,7);pctx.fill()}
  if(Math.random()<.4){pctx.fillRect(x-r*.15,y,r*.3,r*(1+Math.random()*3));}
}

function loop(){
  if(!G||G.over)return;
  const now=AC.currentTime-G.startAt;G.now=now;
  for(const n of G.notes){
    if(n.t-now>HITW+.5)break;
    if(n.st===0&&now>n.t+HITW)miss(n,false);
    if(n.hold){
      if(now>=n.t+n.dur){n.hold=false}
      else if(!G.pressed[n.lane]&&now<n.t+n.dur-.12){n.hold=false;miss(n,true)}}}
  while(G.notes[G.i0]&&G.notes[G.i0].t+G.notes[G.i0].dur<now-.4)G.i0++;
  G.rain=false;
  for(const r of G.rains){
    if(!r.w&&now>=r.start-3&&now<r.end){r.w=true;say('¡Se aproxima una lluvia de pintura!','#00f0ff')}
    if(now>=r.start&&now<r.end)G.rain=true}
  if(!G.counting)$('#count').textContent=now<0&&!G.paused?Math.ceil(-now):'';
  $('#prog').style.width=Math.max(0,Math.min(100,now/G.song.buf.duration*100))+'%';
  draw(now);
  if(now>G.song.buf.duration+.4)return finish();
  requestAnimationFrame(loop);
}

function dome(x,y,s,col,a){
  const rx=BW/4*.36*s,ry=rx*.5;
  ctx.globalAlpha=a;ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(x,y+ry*.3,rx,ry*.7,0,0,7);ctx.fill();
  ctx.shadowColor=col;ctx.shadowBlur=16*DPR*s;ctx.fillStyle=col;
  ctx.beginPath();ctx.ellipse(x,y+ry*.15,rx*.97,ry*1.15,0,Math.PI,2*Math.PI);ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(x,y-ry*.35,rx*.2,ry*.22,0,0,7);ctx.fill();ctx.globalAlpha=1;
}
function draw(now){
  const c=ctx,bc=bgc.getContext('2d'),bg=G.bg;
  bc.clearRect(0,0,W,H);bc.save();bg.d(bc,W,H,performance.now()/1000);bc.restore();
  c.clearRect(0,0,W,H);
  const sb=scOf(H),lw=Math.max(3,W*.006);
  c.beginPath();c.moveTo(CX-BW/2*TS,TOP);c.lineTo(CX+BW/2*TS,TOP);c.lineTo(CX+BW/2*sb,H);c.lineTo(CX-BW/2*sb,H);c.closePath();
  c.fillStyle=ROAD[bg.road];c.fill();
  c.strokeStyle=bg.edge||'#f4f1ea';c.lineWidth=lw;
  for(const sg of[-1,1]){c.beginPath();c.moveTo(CX+sg*BW/2*TS,TOP);c.lineTo(CX+sg*BW/2*sb,H);c.stroke()}
  c.strokeStyle='#ffffff22';c.lineWidth=1;
  for(let l=1;l<4;l++){c.beginPath();c.moveTo(xOf(l-.5,TS),TOP);c.lineTo(xOf(l-.5,sb),H);c.stroke()}
  for(const b of G.beats){const p=1-(b-now)/FALL;if(p<=0||p>1.15)continue;
    const y=yOf(p),s=scOf(y);c.beginPath();c.moveTo(CX-BW/2*s,y);c.lineTo(CX+BW/2*s,y);c.stroke()}
  if(G.rain){c.fillStyle='#00f0ff';c.font=`900 ${H*.04}px Nunito,sans-serif`;c.textAlign='center';c.fillText('🌧 Lluvia de pintura',CX,TOP+H*.07)}
  const rx=BW/4*.36,ry=rx*.42,t=performance.now();
  for(let l=0;l<4;l++){
    const x=xOf(l,1);c.lineWidth=lw*1.2;c.strokeStyle=G.pressed[l]?'#fff':'#8d86a0';
    c.beginPath();c.ellipse(x,HIT,rx,ry,0,0,7);c.stroke();
    if(G.pressed[l]){c.fillStyle='#ffffff44';c.fill()}
    const f=G.fl[l];if(f&&t-f.t<300){const k=(t-f.t)/300;c.strokeStyle=f.c;c.globalAlpha=1-k;
      c.beginPath();c.ellipse(x,HIT,rx*(1+k),ry*(1+k),0,0,7);c.stroke();c.globalAlpha=1}
    if(G.mode==='key'){c.fillStyle='#8d86a0';c.font=`900 ${rx*.6}px Nunito,sans-serif`;c.textAlign='center';
      c.fillText(KEYS[l].toUpperCase(),x,HIT+ry*2.6)}}
  for(let i=G.i0;i<G.notes.length;i++){
    const n=G.notes[i];if(n.t-now>FALL)break;
    if(n.st===1&&!n.hold&&n.dur===0)continue;
    if(n.st===1&&n.dur>0&&!n.hold&&now>n.t+n.dur)continue;
    const col=n.st===2?'#6b667a':n.c,a=n.st===2?.5:1;
    let p=1-(n.t-now)/FALL;if(p>1.15)continue;
    const holdingNow=n.hold||(n.st===1&&n.dur>0);
    const yh=holdingNow?HIT:yOf(p);
    if(n.dur>0){
      const pt=1-(n.t+n.dur-now)/FALL,yt=yOf(pt);
      if(pt>0||yh>TOP){
        const wt=BW/4*.14,y0=Math.max(yt,TOP),s0=scOf(y0),s1=scOf(yh),x=l=>xOf(n.lane,l);
        c.globalAlpha=a*.85;c.fillStyle=col;c.shadowColor=col;c.shadowBlur=10*DPR;c.beginPath();
        c.moveTo(x(s0)-wt*s0,y0);c.lineTo(x(s0)+wt*s0,y0);c.lineTo(x(s1)+wt*s1,yh);c.lineTo(x(s1)-wt*s1,yh);c.closePath();c.fill();
        c.shadowBlur=0;c.globalAlpha=1}}
    if(p>0)dome(xOf(n.lane,scOf(yh)),yh,scOf(yh),col,a);
  }
}

/* ---------- Pausa / salir / fin ---------- */
function pauseGame(){
  if(!G||G.paused||G.over||G.counting)return;
  G.paused=true;AC.suspend();$('#count').textContent='';$('#pause').classList.add('show');
}
function resumeGame(){
  if(!G||!G.paused||G.counting)return;
  G.counting=true;$('#pause').classList.remove('show');
  let n=3;const e=$('#count');e.textContent=n;
  const iv=setInterval(()=>{if(!G){clearInterval(iv);e.textContent='';return}n--;if(n>0){e.textContent=n;return}
    clearInterval(iv);e.textContent='';G.counting=false;G.paused=false;AC.resume()},1000);
}
function stopAudio(){try{G.src.stop()}catch(e){}G.over=true}
function leave(){
  if(G&&!G.over){S.persev=Math.max(0,S.persev-1);S.streak=0;save();stopAudio()}
  $$('.overlay').forEach(o=>o.classList.remove('show'));
  if(AC&&AC.state==='suspended')AC.resume();
  go('menu');
}
function finish(){
  stopAudio();
  const total=G.notes.length||1,perfect=G.sum>=total;
  let acc=Math.max(0,Math.round(G.sum/total*1000)/10);acc=perfect?100:Math.min(99.9,acc);
  const coins=Math.round(acc),name=G.song.name;
  S.plays++;S.done++;S.accSum+=acc;S.persev+=5;S.coins+=coins;S.streak++;
  S.bestStreak=Math.max(S.bestStreak,S.streak);S.bestAcc=Math.max(S.bestAcc,acc);
  S.bestCombo=Math.max(S.bestCombo,G.max);
  S.best[name]=Math.max(S.best[name]||0,acc);
  if(!S.played.includes(name))S.played.push(name);
  let extra='';
  const idx=PAINTINGS.map((p,i)=>i).filter(i=>!S.gal.includes(i)&&PAINTINGS[i].min<=acc).sort((a,b)=>PAINTINGS[a].min-PAINTINGS[b].min)[0];
  if(idx!==undefined){S.gal.push(idx);extra=` ¡Desbloqueaste "${PAINTINGS[idx].n}" en la galería!`}
  persevReward();checkAch();save();
  $('#resScore').textContent=acc.toFixed(1)+'%';
  $('#resInfo').textContent=`Perseverancia +5 · +${coins} monedas.`+extra;
  $('#result').classList.add('show');
  G.timer=setTimeout(()=>$('#btnBack').click(),6000);
}
$('#btnBack').onclick=()=>{clearTimeout(G&&G.timer);$('#result').classList.remove('show');G=null;go('songs')};
$('#btnPause').onclick=pauseGame;
$('#btnResume').onclick=resumeGame;
$('#btnExit').onclick=()=>{leave();G=null};
$('#btnQuit').onclick=()=>{leave();G=null};
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseGame()});

/* ---------- Entradas ---------- */
addEventListener('keydown',e=>{
  if(e.key==='Escape'){G&&G.paused?resumeGame():pauseGame();return}
  if(e.repeat||!G||G.mode!=='key')return;
  const l=KEYS.indexOf(e.key.toLowerCase());if(l>=0)press(l)});
addEventListener('keyup',e=>{const l=KEYS.indexOf(e.key.toLowerCase());if(l>=0)release(l)});
$$('#pad button').forEach((b,l)=>{
  b.addEventListener('pointerdown',e=>{e.preventDefault();press(l)});
  ['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,()=>release(l)));
});