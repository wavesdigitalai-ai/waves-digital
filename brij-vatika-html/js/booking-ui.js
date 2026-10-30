(function(){const root=document.getElementById('bkp');if(!root)return;
let st=initialState();try{const d=JSON.parse(localStorage.getItem('bv-draft')||'null');if(d&&typeof d==='object')st={...st,...d,handedOff:false,step:Math.min(+d.step||0,4)}}catch(e){}
let now=new Date(),view=new Date(now.getFullYear(),now.getMonth(),1),errs={},msg='';
const STEPS=['Function','Dates','Timing','Contact','Review'];
const save=()=>{try{localStorage.setItem('bv-draft',JSON.stringify(st))}catch(e){}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const opt=(on,act,val,label,hint)=>`<button type="button" class="opt${on?' on':''}" data-act="${act}" data-v="${esc(val)}" aria-pressed="${on}">${esc(label)}${hint?`<small>${esc(hint)}</small>`:''}</button>`;
const err=k=>errs[k]?`<p class="er" role="alert">${errs[k]}</p>`:'';
function panel(){const s=st.step;
 if(s===0)return `<h3 tabindex="-1" id="bkh">What are you planning?</h3><div class="grid4">${FUNCTIONS.map(f=>opt(st.func===f,'func',f,f)).join('')}</div>${err('func')}<label class="chk"><input type="checkbox" data-f="multiDay" ${st.multiDay?'checked':''}> The function spans more than one day</label>`;
 if(s===1){const g=monthGrid(view.getFullYear(),view.getMonth(),now),cur=new Date(now.getFullYear(),now.getMonth(),1),label=view.toLocaleDateString('en-IN',{month:'long',year:'numeric'});
  return `<h3 tabindex="-1" id="bkh">Choose your preferred dates</h3><p class="fine">Pick up to 3 dates — your first pick is your first choice. The venue confirms availability; nothing is reserved by choosing a date.</p>
  <div class="cal"><div class="calh"><button type="button" data-act="prev" aria-label="Previous month" ${view<=cur?'disabled':''}>←</button><strong aria-live="polite">${label}</strong><button type="button" data-act="next" aria-label="Next month">→</button></div>
  <div class="cald">${['S','M','T','W','T','F','S'].map(d=>`<span>${d}</span>`).join('')}${g.map(c=>{const i=st.dates.indexOf(c.iso),dis=c.past||c.blocked||!c.inMonth;return c.inMonth?`<button type="button" class="day${i>-1?' sel':''}${c.blocked?' bl':''}" data-act="date" data-v="${c.iso}" ${c.past||c.blocked?'disabled':''} aria-pressed="${i>-1}" aria-label="${fmtDate(c.iso)}${c.blocked?', not available':''}">${c.day}${i>-1?`<i>${i+1}</i>`:''}</button>`:'<span></span>'}).join('')}</div></div>
  <div class="chips">${st.dates.map((d,i)=>`<span class="chip">${i?'Alternate':'First choice'}: ${fmtDate(d)} <button type="button" data-act="date" data-v="${d}" aria-label="Remove ${fmtDate(d)}">×</button></span>`).join('')}</div>${err('dates')}`}
 if(s===2)return `<h3 tabindex="-1" id="bkh">Timing, guests and rooms</h3><p class="lab">Preferred timing</p><div class="grid4">${TIMINGS.map(t=>opt(st.timing===t.id,'timing',t.id,t.label,t.hint)).join('')}</div>${err('timing')}
  <p class="lab">Approximate guests</p><div class="grid5">${GUESTS.map(g=>opt(st.guests===g,'guests',g,g)).join('')}</div>${err('guests')}
  <p class="lab">Guest rooms needed (the venue lists ${MAX_ROOMS})</p><div class="step"><button type="button" data-act="rm" aria-label="Fewer rooms">−</button><output aria-live="polite">${st.rooms}</output><button type="button" data-act="rp" aria-label="More rooms">+</button></div>`;
 if(s===3)return `<h3 tabindex="-1" id="bkh">How can the venue reach you?</h3><div class="form2"><label>Your name<input data-f="name" value="${esc(st.name)}" autocomplete="name">${err('name')}</label>
  <label>Mobile number<input data-f="phone" value="${esc(st.phone)}" inputmode="tel" autocomplete="tel" placeholder="98765 43210">${err('phone')}</label>
  <p class="lab">Preferred way to be contacted</p><div class="grid4">${['WhatsApp','Call'].map(m=>opt(st.method===m,'method',m,m)).join('')}</div>
  ${st.method==='Call'?`<label>Best time to call<select data-f="callTime">${CALL_TIMES.map(c=>`<option ${st.callTime===c?'selected':''}>${c}</option>`).join('')}</select></label>`:''}
  <label>Anything else? (optional)<textarea data-f="notes" rows="3">${esc(st.notes)}</textarea></label></div>`;
 st.ref=st.ref||refCode();const m=buildMessage(st),idx=nodeIndex(st);
 return `<h3 tabindex="-1" id="bkh">Review your enquiry</h3><dl class="sum"><dt>Reference</dt><dd>${st.ref}</dd><dt>Function</dt><dd>${esc(st.func)}${st.multiDay?' · multi-day':''}</dd><dt>Dates</dt><dd>${st.dates.map((d,i)=>`${fmtDate(d)} <em>(${i?'alt':'first'})</em>`).join('<br>')}</dd><dt>Timing</dt><dd>${esc((TIMINGS.find(t=>t.id===st.timing)||{}).label||'')}</dd><dt>Guests</dt><dd>${esc(st.guests)}${st.rooms?` · ${st.rooms} room(s)`:''}</dd><dt>Contact</dt><dd>${esc(st.name)} · ${esc(cleanPhone(st.phone))} · ${st.method}</dd></dl>
  <ol class="nodes">${NODES.map((n,i)=>`<li class="${i<=idx?'done':''}${n.by==='venue'?' venue':''}"><b>${i+1}</b>${n.label}${n.by==='venue'?' <small>(handled by the venue)</small>':''}</li>`).join('')}</ol>
  <div class="acts"><a class="btn p" data-act="wa" href="${waUrl(m)}" target="_blank" rel="noopener">Send on WhatsApp</a><a class="btn s" href="tel:${VENUE.phone}">Call the venue</a><button type="button" class="btn s" data-act="copy">Copy message</button><button type="button" class="btn s" data-act="ics">Add tentative reminder</button></div>
  <p class="fine" id="bkmsg" aria-live="polite">${msg||'Your enquiry opens in WhatsApp. Review your message and press Send to send it. This site does not send or reserve anything.'}</p>`}
function render(){const s=st.step;document.getElementById('bkst').innerHTML=STEPS.map((n,i)=>`<li class="${i<s?'done':''}${i===s?' cur':''}"><b>${i+1}</b><span>${n}</span></li>`).join('');
 document.getElementById('bkbar').style.transform=`scaleX(${s/(STEPS.length-1)})`;
 root.innerHTML=panel()+`<div class="navb">${s>0?'<button type="button" class="btn s" data-act="back">Back</button>':'<span></span>'}${s<4?'<button type="button" class="btn p" data-act="next2">Continue</button>':'<button type="button" class="btn s" data-act="reset">Start over</button>'}</div>`;save()}
const go=(n)=>{st.step=n;errs={};render();const h=document.getElementById('bkh');if(h)h.focus({preventScroll:true})};
root.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act,v=b.dataset.v;
 if(a==='func'){st.func=v;errs={};render()}
 else if(a==='timing'){st.timing=v;errs={};render()}else if(a==='guests'){st.guests=v;errs={};render()}else if(a==='method'){st.method=v;render()}
 else if(a==='date'){st=toggleDate(st,v,3,now);errs={};render()}
 else if(a==='prev'){view=new Date(view.getFullYear(),view.getMonth()-1,1);render()}else if(a==='next'){view=new Date(view.getFullYear(),view.getMonth()+1,1);render()}
 else if(a==='rp'){st.rooms=Math.min(MAX_ROOMS,st.rooms+1);render()}else if(a==='rm'){st.rooms=Math.max(0,st.rooms-1);render()}
 else if(a==='back')go(st.step-1);
 else if(a==='next2'){errs=validate(st,st.step);if(Object.keys(errs).length)render();else go(st.step+1)}
 else if(a==='reset'){st=initialState();msg='';go(0)}
 else if(a==='wa'){st.handedOff=true;msg='Opened in WhatsApp — press Send there to send your enquiry. The venue will reply with availability.';setTimeout(render,0)}
 else if(a==='copy'){const t=buildMessage(st);(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>{msg='Message copied.';render()}).catch(()=>{msg='Copy is not available in this browser.';render()})}
 else if(a==='ics')dl('brij-vatika-enquiry.ics','text/calendar',buildICS(st))});
root.addEventListener('input',e=>{const f=e.target.dataset.f;if(!f)return;st[f]=e.target.type==='checkbox'?e.target.checked:e.target.value;if(f==='callTime')render();else save()});
window.dl=function(n,t,c){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([c],{type:t+';charset=utf-8'}));a.download=n;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)};
render()})();
document.querySelectorAll('[data-c]').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.c,o=document.getElementById('cmsg');
 if(k==='vcf')dl('brij-vatika.vcf','text/vcard',buildVCF());
 else if(k==='addr')(navigator.clipboard?navigator.clipboard.writeText(VENUE.address):Promise.reject()).then(()=>o.textContent='Address copied.').catch(()=>o.textContent='Copy is not available in this browser.');
 else if(k==='share'){const d={title:VENUE.name,text:VENUE.name+' — '+VENUE.display,url:VENUE.maps};if(navigator.share)navigator.share(d).catch(()=>{});else(navigator.clipboard?navigator.clipboard.writeText(d.text+' '+d.url):Promise.reject()).then(()=>o.textContent='Details copied.').catch(()=>o.textContent='Sharing is not available in this browser.')}}));
