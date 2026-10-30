/* Brij Vatika — motion system (vanilla JS, no dependencies). */
(function(){'use strict';
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const desk=()=>matchMedia('(min-width: 861px)').matches;
const $=(s,r=document)=>Array.from(r.querySelectorAll(s));
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
/* ---- entrance reveals (data-r="kind" data-d="delay ms") ---- */
const CLIP=['wipe','wipeUp','circle'];
$('[data-r]').forEach(el=>{const k=el.dataset.r;el.classList.add(k);el.style.transitionDelay=(el.dataset.d||0)+'ms';
 if(RM){el.classList.add('in');return}
 const tgt=CLIP.includes(k)&&el.parentElement?el.parentElement:el;
 const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add('in');io.disconnect()}},{threshold:.15});io.observe(tgt)});
/* ---- count-up ---- */
$('[data-count]').forEach(el=>{const to=+el.dataset.count,suf=el.dataset.suffix||'',fmt=v=>v.toLocaleString('en-US')+suf;el.setAttribute('aria-label',to.toLocaleString('en-IN')+suf);
 if(RM){el.textContent=fmt(to);return}el.textContent=fmt(0);
 const io=new IntersectionObserver(([e])=>{if(!e.isIntersecting)return;io.disconnect();const s=performance.now(),D=2200;
  const f=t=>{const k=Math.min(1,(t-s)/D);el.textContent=fmt(Math.round(to*(1-Math.pow(1-k,4))));if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)},{threshold:.4});io.observe(el)});
/* ---- word / letter reveal: gray -> black (light) or dim -> gold (dark), scrubbed by scroll ---- */
const WR=$('.wr').map(el=>{const text=el.textContent.trim(),tone=el.dataset.tone||'light',by=el.dataset.by||'word';
 const to=hex(tone==='light'?'#15182D':'#F5D77E'),from=hex(tone==='light'?'#b9b5aa':'#5d6080');
 el.setAttribute('aria-label',text);el.textContent='';
 const units=by==='letter'?[...text]:text.split(' ');
 const spans=units.map(u=>{const s=document.createElement('span');s.className='w';s.setAttribute('aria-hidden','true');s.textContent=u+(by==='word'?' ':'');el.appendChild(s);return s});
 return {el,spans,from,to}});
/* ---- collect scroll-driven items ---- */
const DL=$('.dl path').map(p=>{p.style.strokeDasharray=1;p.style.strokeDashoffset=RM?0:1;return p});
const PH=$('.ph').map(b=>({b,img:b.querySelector('img'),fr:b.querySelector('.pfr')})).filter(o=>o.img);
PH.forEach(o=>{if(o.fr){o.fr.style.strokeDasharray=1;o.fr.style.strokeDashoffset=RM?0:1}});
const PAR=$('[data-parallax]');const SC=$('[data-scene]');
const PS=document.querySelector('.ps'),HS=document.querySelector('.hs');
/* ---- floating feathers, sparkles and petals ---- */
let FL=[];
if(!RM){const box=document.createElement('div');box.className='floaters';box.setAttribute('aria-hidden','true');document.body.appendChild(box);
 const d=desk(),mk=(t,n)=>{for(let i=0;i<n;i++){const e=document.createElement('span');e.className='fl '+t;
  if(t==='feather'){const im=document.createElement('img');im.src='images/el-peacock-feather.png';im.alt='';e.appendChild(im)}
  const o={e,x:Math.random()*96,y:Math.random()*100,s:.5+Math.random()*1.1,sp:.4+Math.random()*1.4,r:Math.random()*360,ph:Math.random()*6};
  e.style.left=o.x+'%';e.style.top=o.y+'%';box.appendChild(e);FL.push(o)}};
 mk('feather',d?5:2);mk('spark',d?16:7);mk('petal',d?9:4)}
/* ---- scroll line + progress bar ---- */
const LINE=document.querySelector('#line path'),BAR=document.querySelector('.progress');
if(LINE){LINE.style.strokeDasharray=1;LINE.style.strokeDashoffset=1}
/* ---- layout helpers for sticky pinned sections ---- */
const ps=PS?{el:PS,t:$('.ps-txt',PS),i:$('.ps-img',PS)}:null;
function setup(){
 if(PS){if(desk()&&!RM){PS.classList.add('js');PS.classList.remove('flat')}else{PS.classList.remove('js');PS.classList.add('flat');ps.t.concat(ps.i).forEach(x=>{x.style.opacity='';x.style.transform=''})}}
 if(HS){const row=HS.querySelector('.hs-row');if(desk()&&!RM){HS.classList.add('js');HS.classList.remove('flat');const dist=Math.max(0,row.scrollWidth-innerWidth+80);HS._dist=dist;HS.style.setProperty('--hsh',(innerHeight+dist)+'px')}else{HS.classList.remove('js');HS.classList.add('flat');row.style.transform=''}}}
let ticking=false;
function frame(){ticking=false;const vh=innerHeight,sy=scrollY,max=document.documentElement.scrollHeight-vh,P=max>0?clamp(sy/max):0;
 if(BAR)BAR.style.transform=`scaleX(${P})`;if(LINE)LINE.style.strokeDashoffset=1-P;
 if(RM){return}
 FL.forEach(o=>{o.e.style.transform=`translate(${Math.sin(sy/260+o.ph)*18}px,${-P*o.sp*vh*.9}px) rotate(${o.r+P*60*o.sp}deg) scale(${o.s})`});
 WR.forEach(w=>{const r=w.el.getBoundingClientRect(),S=.85*vh,E=.45*vh-r.height,p=clamp((S-r.top)/(S-E)),n=w.spans.length,tot=(n-1)*.12+1;
  w.spans.forEach((s,i)=>{const l=clamp((p*tot-i*.12)),c=w.from.map((f,k)=>Math.round(lerp(f,w.to[k],l)));s.style.color=`rgb(${c})`})});
 DL.forEach(p=>{const r=p.getBoundingClientRect(),q=clamp((.92*vh-r.top)/(.37*vh));p.style.strokeDashoffset=1-q});
 PH.forEach(o=>{const r=o.b.getBoundingClientRect();if(r.bottom<-50||r.top>vh+50)return;const p=clamp((vh-r.top)/(vh+r.height));
  o.img.style.transform=`translateY(${lerp(-6,6,p)}%) scale(${lerp(1.25,1,p)})`;
  if(o.fr)o.fr.style.strokeDashoffset=1-clamp((.9*vh-r.top)/(.5*vh))});
 PAR.forEach(el=>{const r=el.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;const sp=(+el.dataset.parallax||60)*(desk()?1:.5),rot=+el.dataset.rotate||0,p=clamp((vh-r.top)/(vh+r.height));
  el.style.transform=`translateY(${lerp(-sp,sp,p)}px) rotate(${lerp(-rot,rot,p)}deg)`});
 SC.forEach(el=>{const r=el.getBoundingClientRect(),p=clamp((.9*vh-r.top)/(.75*vh));el.style.clipPath=`circle(${lerp(8,80,p)}% at 50% ${lerp(60,50,p)}%)`});
 if(PS&&PS.classList.contains('js')){const r=PS.getBoundingClientRect(),p=clamp(-r.top/(r.height-vh)),n=ps.i.length,x=p*(n-1);
  ps.i.forEach((el,i)=>{const a=clamp(1.5-Math.abs(x-i)*2);el.style.opacity=a;el.style.transform=`scale(${.92+.08*a})`;el.style.visibility=a<.01?'hidden':'visible'});
  ps.t.forEach((el,i)=>{const a=clamp(1.5-Math.abs(x-i)*2);el.style.opacity=a;el.style.transform=`translateY(${(i-x)*30}px)`;el.style.visibility=a<.01?'hidden':'visible'})}
 if(HS&&HS.classList.contains('js')){const r=HS.getBoundingClientRect(),p=clamp(-r.top/Math.max(1,r.height-vh));HS.querySelector('.hs-row').style.transform=`translateX(${-p*HS._dist}px)`}}
const req=()=>{if(!ticking){ticking=true;requestAnimationFrame(frame)}};
addEventListener('scroll',req,{passive:true});addEventListener('resize',()=>{setup();req()});addEventListener('load',()=>{setup();frame()});setup();frame();
/* ---- card tilt (mouse only) ---- */
if(!RM&&matchMedia('(pointer:fine)').matches)$('.tilt').forEach(c=>{c.style.transition='transform .25s';c.addEventListener('mousemove',e=>{const b=c.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;c.style.transform=`perspective(700px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-4px)`});c.addEventListener('mouseleave',()=>c.style.transform='')});
/* ---- mobile menu ---- */
const mb=document.getElementById('mb'),lk=document.getElementById('lk');
if(mb&&lk){mb.addEventListener('click',()=>{const o=lk.classList.toggle('open');mb.setAttribute('aria-expanded',o)});lk.addEventListener('click',e=>{if(e.target.closest('a'))lk.classList.remove('open')})}
/* ---- page transition: gold curtain drops before leaving ---- */
if(!RM){addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||a.target==='_blank'||a.hasAttribute('download'))return;
 const u=new URL(a.href,location.href);if(u.origin!==location.origin||u.pathname===location.pathname||!/\.html$|\/$/.test(u.pathname))return;
 e.preventDefault();const c=document.querySelector('.curtain');if(c){c.classList.add('leave')}setTimeout(()=>{location.href=u.href},c?430:0)});
 addEventListener('pageshow',e=>{if(e.persisted){const c=document.querySelector('.curtain');if(c)c.classList.remove('leave')}})}
/* ---- gallery carousel: buttons, swipe, mouse drag, keyboard ---- */
const trk=document.getElementById('trk');
if(trk){const cnt=document.getElementById('gc'),slides=()=>Array.from(trk.children),go=d=>trk.scrollBy({left:d*trk.clientWidth*.7,behavior:'smooth'});
 const pv=document.getElementById('pv'),nx=document.getElementById('nx');pv&&pv.addEventListener('click',()=>go(-1));nx&&nx.addEventListener('click',()=>go(1));
 trk.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){go(1);e.preventDefault()}if(e.key==='ArrowLeft'){go(-1);e.preventDefault()}});
 trk.addEventListener('scroll',()=>{const c=trk.scrollLeft+trk.clientWidth/2;let b=0,m=1e9;slides().forEach((s,i)=>{const d=Math.abs(s.offsetLeft+s.offsetWidth/2-c);if(d<m){m=d;b=i}});if(cnt)cnt.textContent=(b+1)+' / '+slides().length},{passive:true});
 let drag=null;trk.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){drag={x:e.clientX,s:trk.scrollLeft};trk.style.scrollSnapType='none'}});
 addEventListener('pointermove',e=>{if(drag)trk.scrollLeft=drag.s-(e.clientX-drag.x)});
 addEventListener('pointerup',()=>{if(drag){drag=null;trk.style.scrollSnapType=''}})}
})();
