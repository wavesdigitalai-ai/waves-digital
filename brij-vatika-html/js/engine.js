// Brij Vatika enquiry/booking engine — pure logic, no backend.
// It prepares an enquiry and hands it to WhatsApp/phone. It does NOT book or reserve anything:
// availability is only ever confirmed by the venue.
const VENUE={name:'Brij Vatika Marriage Lawn',phone:'+916392899177',display:'+91 63928 99177',
 address:'Ayodhya-Raebareli Road, Prabhat Nagar, Ayodhya, Uttar Pradesh 224001, India',maps:'https://maps.app.goo.gl/9vdpS7bmStXwUVpy6'};
const FUNCTIONS=['Wedding','Reception','Engagement','Family function'];
const TIMINGS=[{id:'day',label:'Daytime',hint:'Morning to afternoon'},{id:'evening',label:'Evening',hint:'Evening to night'},{id:'full',label:'Full day',hint:'Daytime and evening'},{id:'open',label:'Not sure yet',hint:'Discuss with the venue'}];
const GUESTS=['Up to 100','100–300','300–600','600+','Not sure yet'];
const MAX_ROOMS=5; // five guest rooms are listed by the venue
// Owner-maintained: add dates the venue is already committed on, as 'YYYY-MM-DD'. Empty = nothing marked.
const BLOCKED_DATES=[];
const CALL_TIMES=['Any time','Morning','Afternoon','Evening'];
const NODES=[{id:'draft',label:'Enquiry drafted',by:'you'},{id:'ready',label:'Details complete',by:'you'},{id:'sent',label:'Opened in WhatsApp',by:'you'},{id:'reply',label:'Venue replies with availability',by:'venue'},{id:'confirm',label:'Venue confirms',by:'venue'}];
const pad=n=>String(n).padStart(2,'0');
const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parseISO=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const fmtDate=s=>parseISO(s).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
function monthGrid(year,month,today=new Date(),blocked=BLOCKED_DATES){const start=new Date(year,month,1-new Date(year,month,1).getDay()),t=iso(today),cells=[];
 for(let i=0;i<42;i++){const d=new Date(start.getFullYear(),start.getMonth(),start.getDate()+i),s=iso(d);cells.push({iso:s,day:d.getDate(),inMonth:d.getMonth()===month,past:s<t,blocked:blocked.includes(s)})}return cells}
const initialState=()=>({step:0,func:'',dates:[],multiDay:false,timing:'',guests:'',rooms:0,name:'',phone:'',method:'WhatsApp',callTime:'Any time',notes:'',handedOff:false,ref:''});
function toggleDate(st,s,max=3,today=new Date(),blocked=BLOCKED_DATES){if(s<iso(today)||blocked.includes(s))return st;
 const has=st.dates.includes(s);const dates=has?st.dates.filter(d=>d!==s):st.dates.length<max?[...st.dates,s].sort():st.dates;return {...st,dates}}
const cleanPhone=p=>String(p||'').replace(/[\s\-()]/g,'').replace(/^(\+91|0091|91|0)(?=\d{10}$)/,'');
function validate(st,step){const e={};
 if(step===0&&!st.func)e.func='Please choose the type of function.';
 if(step===1&&!st.dates.length)e.dates='Please choose at least one preferred date.';
 if(step===2){if(!st.timing)e.timing='Please choose a preferred timing.';if(!st.guests)e.guests='Please choose an approximate guest count.'}
 if(step===3){if(String(st.name).trim().length<2)e.name='Please enter your name.';if(!/^[6-9]\d{9}$/.test(cleanPhone(st.phone)))e.phone='Please enter a valid 10-digit mobile number.'}
 return e}
const allValid=st=>[0,1,2,3].every(i=>!Object.keys(validate(st,i)).length);
function refCode(now=new Date(),rnd=Math.random){const a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let r='';for(let i=0;i<4;i++)r+=a[Math.floor(rnd()*a.length)];return `BV-${String(now.getFullYear()).slice(2)}${pad(now.getMonth()+1)}${pad(now.getDate())}-${r}`}
function buildMessage(st){const t=TIMINGS.find(x=>x.id===st.timing),L=[];
 L.push('Hello, I would like to enquire about booking Brij Vatika Marriage Lawn for a function. Please share availability and details.','');
 if(st.ref)L.push(`Enquiry ref: ${st.ref}`);
 L.push(`Function: ${st.func}${st.multiDay?' (more than one day)':''}`);
 L.push('Preferred date(s): '+st.dates.map((d,i)=>`${fmtDate(d)} (${i?'alternate':'first choice'})`).join('; '));
 L.push(`Timing: ${t?t.label:'-'}`,`Approx. guests: ${st.guests}`);
 if(st.rooms)L.push(`Guest rooms needed: ${st.rooms} (of ${MAX_ROOMS} listed)`);
 L.push(`Name: ${String(st.name).trim()}`,`Mobile: ${cleanPhone(st.phone)}`,`Preferred contact: ${st.method}${st.method==='Call'?` (${st.callTime})`:''}`);
 if(String(st.notes).trim())L.push(`Notes: ${String(st.notes).trim()}`);
 return L.join('\n')}
const waUrl=msg=>`https://wa.me/${VENUE.phone.slice(1)}?text=${encodeURIComponent(msg)}`;
function buildICS(st,now=new Date()){if(!st.dates.length)return '';const d=st.dates[0].replace(/-/g,''),n=parseISO(st.dates[0]);n.setDate(n.getDate()+1);const e=iso(n).replace(/-/g,'');
 const stamp=`${now.getUTCFullYear()}${pad(now.getUTCMonth()+1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}00Z`;
 const esc=s=>String(s).replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n');
 return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Brij Vatika Concept//Enquiry//EN','BEGIN:VEVENT',`UID:${st.ref||'bv'}-${d}@brijvatika-concept`,`DTSTAMP:${stamp}`,`DTSTART;VALUE=DATE:${d}`,`DTEND;VALUE=DATE:${e}`,
 `SUMMARY:${esc('TENTATIVE - '+st.func+' enquiry, Brij Vatika (not confirmed)')}`,'STATUS:TENTATIVE',`LOCATION:${esc(VENUE.address)}`,`DESCRIPTION:${esc('Personal reminder only. Availability is not confirmed until the venue confirms.\n'+buildMessage(st))}`,'END:VEVENT','END:VCALENDAR'].join('\r\n')}
const buildVCF=()=>['BEGIN:VCARD','VERSION:3.0',`FN:${VENUE.name}`,`ORG:${VENUE.name}`,`TEL;TYPE=WORK,VOICE:${VENUE.phone}`,'ADR;TYPE=WORK:;;Ayodhya-Raebareli Road\\, Prabhat Nagar;Ayodhya;Uttar Pradesh;224001;India',`URL:${VENUE.maps}`,'END:VCARD'].join('\r\n');
function nodeIndex(st){if(st.handedOff)return 2;return allValid(st)?1:0}
