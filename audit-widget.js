(function(){
/* Everything in this file lives inside this closure — nothing leaks into the
   host page's global scope except window.WDA.open() / window.WDA.close()
   below. Safe to paste into an existing site without colliding with its
   own scripts, even if that site also has variables named "state" or "render". */
/* ============================= DATA ============================= */

const TOOLS = {
  Foundation:{name:"Foundation", hook:"Every customer you've ever served exists somewhere in your memory — Foundation moves them somewhere that outlasts you.", anon:"Every customer you've ever served exists somewhere in your memory \u2014 moving them somewhere that outlasts you is exactly the kind of thing most businesses never get around to building."},
  Signal:{name:"Signal", hook:"Every unanswered call is a complete stranger walking into your competitor's door — Signal makes sure that never happens again.", anon:"Every unanswered call is a complete stranger walking into your competitor's door instead \u2014 and there's a simple way to make sure that never happens again."},
  Ask:{name:"Ask", hook:"The customer who leaves unhappy and says nothing is more dangerous than the one who complains — Ask catches them before Google does.", anon:"The customer who leaves unhappy and says nothing is more dangerous than the one who complains \u2014 there's a way to catch them before Google does."},
  "First Word":{name:"First Word", hook:"The first week after someone visits you for the first time is the only window you get to make them a regular — First Word makes sure you never waste it.", anon:"The first week after someone visits you for the first time is the only window you get to turn them into a regular \u2014 and it's far easier to stop wasting than people think."},
  Echo:{name:"Echo", hook:"Every unanswered review tells the next customer you don't care — Echo makes sure your reputation works even when you're too busy to think.", anon:"Every unanswered review quietly tells the next customer you don't care \u2014 your reputation can keep working even on the days you're too busy to think about it."},
  Pulse:{name:"Pulse", hook:"Your business does extraordinary things every single day — Pulse makes sure the world outside your four walls actually sees it.", anon:"Your business does genuinely good work every single day \u2014 the world outside your four walls just isn't seeing enough of it yet."},
  Recall:{name:"Recall", hook:"Somewhere in your contacts right now are people who used to love your business and quietly stopped coming — Recall finds them and brings them back.", anon:"Somewhere in your contacts right now are people who used to love your business and quietly stopped coming \u2014 finding them and bringing them back is less work than it sounds."},
  "Front Desk":{name:"Front Desk", hook:"While you're serving one customer, others are waiting for a reply and quietly making other plans — Front Desk answers all of them at once.", anon:"While you're serving one customer, others are waiting for a reply and quietly making other plans \u2014 there's no real reason all of them can't be answered at once."},
  Moment:{name:"Moment", hook:"The businesses customers stay loyal to forever aren't better than you — they just remember things about their customers that you're too busy to track.", anon:"The businesses customers stay loyal to forever aren't better than you \u2014 they just remember things about their customers that you're too busy to track."},
  Anchor:{name:"Anchor", hook:"Right now someone in your city is searching for exactly what you offer — Anchor makes sure your name is what they find.", anon:"Right now, someone in your city is searching for exactly what you offer \u2014 making sure your name is what they find is far more fixable than it feels."},
  Ledger:{name:"Ledger", hook:"Every day you delay sending a quote is a day the customer convinces themselves they don't need it — Ledger gets it in front of them before that moment passes.", anon:"Every day you delay sending a quote is a day the customer quietly convinces themselves they don't need it \u2014 getting it in front of them sooner changes more than it seems."},
  Lobby:{name:"Lobby", hook:"Most businesses lose a new customer not because they did something wrong — but because after the first visit, they did absolutely nothing.", anon:"Most businesses lose a new customer not because they did something wrong \u2014 but because after the first visit, they did absolutely nothing next."},
  Storefront:{name:"Storefront", hook:"Your services are worth every rupee you charge — Storefront makes sure the words you use to describe them don't make people think otherwise.", anon:"Your services are worth every rupee you charge \u2014 the words you use to describe them shouldn't be the thing making people think otherwise."}
};

const CATEGORY_META = {
  memory:{name:"Customer Data & Memory", weight:0.20},
  comms:{name:"Communication & Follow-up", weight:0.20},
  ops:{name:"Operations & Bottlenecks", weight:0.15},
  marketing:{name:"Marketing & Visibility", weight:0.15},
  money:{name:"Money Left on the Table", weight:0.20},
  tech:{name:"Tech Comfort & Attitude", weight:0.10}
};

const CATEGORY_TIPS = {
  memory:"Tonight, write down the name and number of your last 10 customers in one place — a notes app, a notebook, anything. That's the manual version of what Foundation builds permanently.",
  comms:"For the next 7 days, reply to every WhatsApp message within an hour, even just to say you'll confirm shortly. Count how many you almost missed — that number is the gap.",
  ops:"Write one page describing exactly what happens during your busiest hour, step by step. If a new person couldn't follow it without asking questions, that's the gap.",
  marketing:"Search your own business on Google right now, from a different phone, in incognito mode. What you see is exactly what your next customer sees.",
  money:"Pull up last month's records and count repeat customers vs new ones. That single number tells you more than any guess would."
};

function Q(text, opts){ return {text, opts}; } // opts: [label, score, tool]

const TECH_QUESTIONS = [
  Q("When you hear \u201CAI for my business,\u201D what's your honest first reaction?", [
    ["Curious — I want to understand it",0,null],
    ["Confused — not sure what it means for me",1,null],
    ["Skeptical — feels like a gimmick for big companies",2,null]
  ]),
  Q("Have you tried any digital tool before (POS, WhatsApp Business, a booking app)?", [
    ["Used one, worked well",0,null],
    ["Tried, gave up — too complicated",1,null],
    ["Never tried anything",2,null]
  ]),
  Q("What's mainly stopped you from adopting new systems so far?", [
    ["Haven't had time to evaluate options",0,null],
    ["Worried about cost or complexity",1,null],
    ["Don't see why it's needed",2,null]
  ]),
  Q("If something simple existed — no jargon, no learning curve — would you try it?", [
    ["Yes, immediately",0,null],
    ["Maybe, depends on cost",1,null],
    ["Probably not, set in our ways",2,null]
  ]),
  Q("A year from now — same way of running things, or different?", [
    ["Want to evolve how we operate",0,null],
    ["Open to small changes only",1,null],
    ["Comfortable as we are",2,null]
  ])
];

const VERTICALS = {
  restaurant:{ label:"Restaurant / Café",
    categories:{
      memory:[
        Q("When a regular walks in, does staff already know their usual order?",[["Yes, recognised every time",0,null],["Only if the same staff member happens to be around",1,"Foundation"],["No, every visit starts from zero",2,"Foundation"]]),
        Q("If your best customer stopped coming for a month, would you know?",[["Yes, immediately",0,null],["Maybe, if someone mentioned it",1,"Recall"],["No way to know",2,"Recall"]]),
        Q("Where do customer phone numbers go after a delivery or takeaway order?",[["Saved in a list we actually use",0,null],["Sits in the delivery app, lost to us",1,"Foundation"],["We don't collect them at all",2,"Foundation"]]),
        Q("A customer who's eaten here twice last month — does anything connect those two visits?",[["Yes, on record",0,null],["Maybe in someone's memory",1,"Foundation"],["Nothing connects them",2,"Foundation"]]),
        Q("Could you list your top 50 customers right now?",[["Yes, easily",0,null],["I could name a few",1,"Foundation"],["No way",2,"Foundation"]])
      ],
      comms:[
        Q("It's 8pm, peak rush, phone rings for a reservation. What actually happens?",[["Always answered properly",0,null],["Answered late, or after a second call",1,"Signal"],["Often missed entirely",2,"Signal"]]),
        Q("After a birthday or anniversary booking, what happens next year?",[["We remember and reach out",0,null],["Maybe, if lucky",1,"Moment"],["Nothing, untracked",2,"Moment"]]),
        Q("A WhatsApp comes in asking about today's specials — how fast does someone reply?",[["Within minutes",0,null],["Whenever staff is free",1,"Front Desk"],["Often unanswered for hours",2,"Front Desk"]]),
        Q("A regular hasn't visited in 3 weeks — does anyone reach out?",[["Yes, we have a process",0,null],["Rarely, if someone notices",1,"Recall"],["Never",2,"Recall"]]),
        Q("If 5 customers message at once during rush, how many get a same-day reply?",[["All five",0,null],["Two or three",1,"Front Desk"],["Whoever messages again later",2,"Front Desk"]])
      ],
      ops:[
        Q("On your busiest night, what's the first thing that breaks down?",[["Nothing, runs smooth",0,null],["Orders get mixed up or delayed",1,"Foundation"],["Phones, messages and tables all pile up together",2,"Signal"]]),
        Q("New staff joins — how long till they know how things work here?",[["Written down, fast onboarding",0,null],["They learn by watching, takes weeks",1,"Foundation"],["They figure it out, mistakes happen",2,"Foundation"]]),
        Q("If you took a week off, would the place run the same?",[["Yes, systems in place",0,null],["Mostly, some hiccups",1,"Foundation"],["No, things would slip",2,"Foundation"]]),
        Q("How do you track dishes running low or out of stock?",[["Real-time updates",0,null],["Someone remembers to mention it",1,"Foundation"],["Customers find out the hard way",2,"Foundation"]]),
        Q("Two regulars call at the exact same time — what happens?",[["Both handled properly",0,null],["One waits",1,"Signal"],["Whoever calls back later",2,"Signal"]])
      ],
      marketing:[
        Q("If someone nearby has never heard of you, how would they find you today?",[["Strong online presence",0,null],["Maybe word of mouth",1,"Anchor"],["They probably wouldn't",2,"Anchor"]]),
        Q("When you run a new offer, how do existing customers find out?",[["We message them directly",0,null],["Maybe they see a poster",1,"Pulse"],["They don't, unless they happen to visit",2,"Pulse"]]),
        Q("How many new customers came purely from a Google search last month?",[["I can tell you the number",0,null],["Some, but guessing",1,"Anchor"],["No idea",2,"Anchor"]]),
        Q("Do you know your slowest day of the week, and why?",[["Yes, and we've tried to fix it",0,null],["I have a feeling",1,"Foundation"],["Never thought about it",2,"Foundation"]]),
        Q("If a customer loved their meal, how likely are they to tell others or leave a review?",[["We actively ask, and it works",0,null],["Maybe, if they remember",1,"Ask"],["Never asked",2,"Ask"]])
      ],
      money:[
        Q("How many reservations no-showed last month — did anyone follow up?",[["We track and follow up",0,null],["We notice, don't act",1,"Lobby"],["Don't track at all",2,"Lobby"]]),
        Q("Of customers who visited once, how many came back a second time?",[["I know this number",0,null],["Rough guess",1,"Foundation"],["No idea",2,"Foundation"]]),
        Q("If a regular switched to a competitor, would you find out — and win them back?",[["Yes to both",0,null],["Maybe find out, no way to win back",1,"Recall"],["We'd never know",2,"Recall"]]),
        Q("What share of last month's revenue came from repeat vs first-time customers?",[["We track this split",0,null],["Rough sense only",1,"Foundation"],["Never measured",2,"Foundation"]]),
        Q("A big group cancels last minute — does that slot get refilled?",[["Usually, we have a waitlist",0,null],["Sometimes, if lucky",1,"Lobby"],["That slot is just lost",2,"Lobby"]])
      ],
      tech: TECH_QUESTIONS
    }
  },
  salon:{ label:"Salon / Spa",
    categories:{
      memory:[
        Q("Returning client — does staff know their preferred stylist or service without checking anything?",[["Always",0,null],["Only if the same staff member happens to be around",1,"Foundation"],["No, starts from zero",2,"Foundation"]]),
        Q("A monthly regular stops coming for 2 months — would you know?",[["Yes",0,null],["Maybe",1,"Recall"],["No",2,"Recall"]]),
        Q("Where do client preferences (allergies, products, last service) get stored?",[["Proper record",0,null],["In someone's head",1,"Foundation"],["Nowhere",2,"Foundation"]]),
        Q("Could you list your top 30 regular clients right now?",[["Easily",0,null],["A few",1,"Foundation"],["No",2,"Foundation"]]),
        Q("Does a client's visit history help plan their next appointment?",[["Yes",0,null],["Sometimes",1,"Foundation"],["Nothing connects them",2,"Foundation"]])
      ],
      comms:[
        Q("First-time client — do they hear from you in the week after?",[["Yes, structured",0,null],["Sometimes",1,"First Word"],["Never",2,"First Word"]]),
        Q("Client messages on WhatsApp about availability — how fast is the reply?",[["Minutes",0,null],["Whenever free",1,"Front Desk"],["Hours, often unanswered",2,"Front Desk"]]),
        Q("Client's birthday — does anything happen?",[["Yes, always",0,null],["Sometimes",1,"Moment"],["Nothing",2,"Moment"]]),
        Q("Your top stylist is busy and a client messages — what happens?",[["Someone else replies fast",0,null],["Reply delayed",1,"Front Desk"],["Often lost",2,"Front Desk"]]),
        Q("Client due for a routine appointment — reminded?",[["Yes",0,null],["Rarely",1,"Moment"],["Never",2,"Moment"]])
      ],
      ops:[
        Q("Busiest Saturday — first thing that breaks?",[["Nothing",0,null],["Bookings overlap",1,"Foundation"],["Total chaos",2,"Foundation"]]),
        Q("New staff — how fast do they learn how things work?",[["Documented, fast",0,null],["Learn by watching",1,"Foundation"],["Trial and error",2,"Foundation"]]),
        Q("You take a week off — same experience for clients?",[["Yes",0,null],["Mostly",1,"Foundation"],["No",2,"Foundation"]]),
        Q("Two clients call to book the exact same slot — handled cleanly?",[["Yes",0,null],["One waits",1,"Front Desk"],["Confusion",2,"Front Desk"]])
      ],
      marketing:[
        Q("Someone nearby searching for a salon — would they find you?",[["Strong presence",0,null],["Maybe",1,"Anchor"],["Unlikely",2,"Anchor"]]),
        Q("New package or offer — existing clients hear about it?",[["We message directly",0,null],["Maybe see a post",1,"Pulse"],["No",2,"Pulse"]]),
        Q("Service descriptions on Instagram or your menu — enticing, or just a list of name and price?",[["Enticing",0,null],["Plain",1,"Storefront"],["Just a price list",2,"Storefront"]]),
        Q("Reviews — replied to thoughtfully?",[["Always",0,null],["Sometimes",1,"Echo"],["Never",2,"Echo"]]),
        Q("Happy client — asked for a review?",[["Yes, works well",0,null],["Rarely",1,"Ask"],["Never",2,"Ask"]])
      ],
      money:[
        Q("No-shows — followed up?",[["Tracked and followed up",0,null],["Noticed, no action",1,"Lobby"],["Not tracked",2,"Lobby"]]),
        Q("Repeat-client rate — known?",[["Yes",0,null],["Rough guess",1,"Foundation"],["No idea",2,"Foundation"]]),
        Q("Client switches to another salon — would you know, and win them back?",[["Both",0,null],["Maybe know",1,"Recall"],["Never know",2,"Recall"]]),
        Q("Pending payments for packages or memberships — chased properly?",[["Yes, a system",0,null],["Sometimes",1,"Ledger"],["Often forgotten",2,"Ledger"]])
      ],
      tech: TECH_QUESTIONS
    }
  },
  clinic:{ label:"Clinic / Wellness",
    categories:{
      memory:[
        Q("Returning patient — does staff know their history without checking the file?",[["Always",0,null],["Sometimes",1,"Foundation"],["No",2,"Foundation"]]),
        Q("A regular patient stops visiting — would you know?",[["Yes",0,null],["Maybe",1,"Recall"],["No",2,"Recall"]]),
        Q("Patient history and preferences — stored properly?",[["Yes",0,null],["Partially",1,"Foundation"],["No",2,"Foundation"]]),
        Q("Could you list patients due for follow-up right now?",[["Yes",0,null],["A few",1,"Foundation"],["No",2,"Foundation"]]),
        Q("Does past visit history shape the next recommendation?",[["Yes",0,null],["Sometimes",1,"Foundation"],["Disconnected",2,"Foundation"]])
      ],
      comms:[
        Q("A new patient's first week after visit — do they hear from you?",[["Yes, structured",0,null],["Sometimes",1,"First Word"],["Never",2,"First Word"]]),
        Q("Phone rings during a packed clinic day — answered properly?",[["Always",0,null],["Late",1,"Signal"],["Missed",2,"Signal"]]),
        Q("Patient messages about reports or availability — how fast is the reply?",[["Minutes",0,null],["Hours",1,"Front Desk"],["Often unanswered",2,"Front Desk"]]),
        Q("A patient's treatment anniversary or birthday — anything happens?",[["Yes",0,null],["Sometimes",1,"Moment"],["Nothing",2,"Moment"]]),
        Q("Patient due for a checkup — reminded?",[["Yes",0,null],["Rarely",1,"Moment"],["Never",2,"Moment"]])
      ],
      ops:[
        Q("Busiest clinic day — first thing that breaks?",[["Nothing",0,null],["Scheduling clashes",1,"Foundation"],["Chaos",2,"Foundation"]]),
        Q("New staff — fast onboarding?",[["Documented",0,null],["Learn by watching",1,"Foundation"],["Trial and error",2,"Foundation"]]),
        Q("Doctor or owner takes a week off — runs the same?",[["Yes",0,null],["Mostly",1,"Foundation"],["No",2,"Foundation"]]),
        Q("Two patients call at once — both handled well?",[["Yes",0,null],["One waits",1,"Front Desk"],["Confusion",2,"Front Desk"]])
      ],
      marketing:[
        Q("Patient searching \u201Cclinic near me\u201D — would they find you?",[["Strong presence",0,null],["Maybe",1,"Anchor"],["Unlikely",2,"Anchor"]]),
        Q("Service or treatment descriptions — reassuring, or cold and clinical?",[["Reassuring",0,null],["Plain",1,"Storefront"],["Cold",2,"Storefront"]]),
        Q("New service launched — existing patients informed?",[["Yes",0,null],["Maybe",1,"Pulse"],["No",2,"Pulse"]]),
        Q("Reviews — replied to?",[["Always",0,null],["Sometimes",1,"Echo"],["Never",2,"Echo"]]),
        Q("Happy patient — asked for a review?",[["Yes",0,null],["Rarely",1,"Ask"],["Never",2,"Ask"]])
      ],
      money:[
        Q("Missed appointments — followed up?",[["Tracked and followed up",0,null],["Noticed, no action",1,"Lobby"],["Not tracked",2,"Lobby"]]),
        Q("Repeat-patient rate — known?",[["Yes",0,null],["Guess",1,"Foundation"],["No idea",2,"Foundation"]]),
        Q("Patient switches clinics — would you know, and win them back?",[["Both",0,null],["Maybe",1,"Recall"],["Never",2,"Recall"]]),
        Q("Treatment-plan quotes or estimates — sent fast, payments chased?",[["Yes, a system",0,null],["Sometimes",1,"Ledger"],["Often delayed",2,"Ledger"]])
      ],
      tech: TECH_QUESTIONS
    }
  },
  retail:{ label:"Retail Shop",
    categories:{
      memory:[
        Q("Repeat customer walks in — staff recognises or remembers preferences?",[["Always",0,null],["Sometimes",1,"Foundation"],["No",2,"Foundation"]]),
        Q("Regular customer stops visiting — would you know?",[["Yes",0,null],["Maybe",1,"Recall"],["No",2,"Recall"]]),
        Q("Customer contact saved after a purchase?",[["Yes, and used",0,null],["Lost in an app",1,"Foundation"],["Not collected",2,"Foundation"]]),
        Q("Could you list your top 30 repeat customers?",[["Yes",0,null],["A few",1,"Foundation"],["No",2,"Foundation"]]),
        Q("Does past purchase history help recommend what's next?",[["Yes",0,null],["Sometimes",1,"Foundation"],["Disconnected",2,"Foundation"]])
      ],
      comms:[
        Q("New stock arrives — how do regulars find out?",[["WhatsApp broadcast",0,null],["They just visit",1,"Pulse"],["They don't",2,"Pulse"]]),
        Q("\u201CIs this in stock?\u201D message comes in — how fast is the reply?",[["Minutes",0,null],["Hours",1,"Front Desk"],["Often unanswered",2,"Front Desk"]]),
        Q("Customer's birthday — anything happens?",[["Yes",0,null],["Sometimes",1,"Moment"],["Nothing",2,"Moment"]]),
        Q("First-time buyer — hears from you again that week?",[["Yes",0,null],["Sometimes",1,"First Word"],["Never",2,"First Word"]]),
        Q("Busy moment, multiple WhatsApp enquiries — all answered same day?",[["All",0,null],["Some",1,"Front Desk"],["Most missed",2,"Front Desk"]])
      ],
      ops:[
        Q("Busiest sale day — first thing that breaks?",[["Nothing",0,null],["Mix-ups",1,"Foundation"],["Chaos",2,"Foundation"]]),
        Q("New staff — fast onboarding?",[["Documented",0,null],["Learn by watching",1,"Foundation"],["Trial and error",2,"Foundation"]]),
        Q("Owner away a week — shop runs the same?",[["Yes",0,null],["Mostly",1,"Foundation"],["No",2,"Foundation"]]),
        Q("Stock running low — tracked, or found out the hard way?",[["Real-time",0,null],["Someone remembers",1,"Foundation"],["Customers tell you",2,"Foundation"]])
      ],
      marketing:[
        Q("Someone searching for your category nearby — would they find you?",[["Strong presence",0,null],["Maybe",1,"Anchor"],["Unlikely",2,"Anchor"]]),
        Q("Product descriptions in your catalogue or Instagram — enticing, or just price tags?",[["Enticing",0,null],["Plain",1,"Storefront"],["Just prices",2,"Storefront"]]),
        Q("New arrivals or offers — existing customers told proactively?",[["Yes",0,null],["Maybe",1,"Pulse"],["No",2,"Pulse"]]),
        Q("Reviews — replied to?",[["Always",0,null],["Sometimes",1,"Echo"],["Never",2,"Echo"]]),
        Q("Happy customer — asked for a review?",[["Yes",0,null],["Rarely",1,"Ask"],["Never",2,"Ask"]])
      ],
      money:[
        Q("Custom order or quote requests — followed up, invoiced cleanly?",[["Yes, a system",0,null],["Sometimes",1,"Ledger"],["Often forgotten",2,"Ledger"]]),
        Q("Repeat-customer rate — known?",[["Yes",0,null],["Guess",1,"Foundation"],["No idea",2,"Foundation"]]),
        Q("Customer switches to a competitor shop — would you know, and win them back?",[["Both",0,null],["Maybe",1,"Recall"],["Never",2,"Recall"]]),
        Q("Customer asked about a product, never bought — followed up?",[["Yes",0,null],["Sometimes",1,"Lobby"],["Never",2,"Lobby"]])
      ],
      tech: TECH_QUESTIONS
    }
  },
  other:{ label:"Other",
    categories:{
      memory:[
        Q("Does your team recognise a returning customer without being told?",[["Always",0,null],["Sometimes",1,"Foundation"],["No",2,"Foundation"]]),
        Q("If a regular customer stopped coming, would you know?",[["Yes",0,null],["Maybe",1,"Recall"],["No",2,"Recall"]]),
        Q("Where does customer contact info go after they interact with you?",[["Saved and used",0,null],["Lost",1,"Foundation"],["Not collected",2,"Foundation"]]),
        Q("Could you list your top 20\u201330 regular customers right now?",[["Yes",0,null],["A few",1,"Foundation"],["No",2,"Foundation"]]),
        Q("Does past interaction history help you serve them better next time?",[["Yes",0,null],["Sometimes",1,"Foundation"],["Disconnected",2,"Foundation"]])
      ],
      comms:[
        Q("A call comes in during your busiest hour — always answered?",[["Yes",0,null],["Late",1,"Signal"],["Missed",2,"Signal"]]),
        Q("A WhatsApp message comes in — how fast is it answered?",[["Minutes",0,null],["Hours",1,"Front Desk"],["Often unanswered",2,"Front Desk"]]),
        Q("A first-time customer — hears from you again that week?",[["Yes",0,null],["Sometimes",1,"First Word"],["Never",2,"First Word"]]),
        Q("A customer's birthday or anniversary with you — anything happens?",[["Yes",0,null],["Sometimes",1,"Moment"],["Nothing",2,"Moment"]]),
        Q("A regular hasn't shown up in a while — does anyone reach out?",[["Yes",0,null],["Rarely",1,"Recall"],["Never",2,"Recall"]])
      ],
      ops:[
        Q("Your busiest period — first thing that breaks down?",[["Nothing",0,null],["Some mix-ups",1,"Foundation"],["Chaos",2,"Foundation"]]),
        Q("New team member — fast onboarding?",[["Documented",0,null],["Learn by watching",1,"Foundation"],["Trial and error",2,"Foundation"]]),
        Q("You take a week off — does it run the same without you?",[["Yes",0,null],["Mostly",1,"Foundation"],["No",2,"Foundation"]]),
        Q("Two customers need attention at once — both handled well?",[["Yes",0,null],["One waits",1,"Front Desk"],["Confusion",2,"Front Desk"]])
      ],
      marketing:[
        Q("Someone searching online for a business like yours nearby — would they find you?",[["Strong presence",0,null],["Maybe",1,"Anchor"],["Unlikely",2,"Anchor"]]),
        Q("How your services or products are described online — enticing, or just functional?",[["Enticing",0,null],["Plain",1,"Storefront"],["Just functional",2,"Storefront"]]),
        Q("New offer or update — existing customers hear about it?",[["Yes",0,null],["Maybe",1,"Pulse"],["No",2,"Pulse"]]),
        Q("Reviews — replied to thoughtfully?",[["Always",0,null],["Sometimes",1,"Echo"],["Never",2,"Echo"]]),
        Q("Happy customer — asked for a review?",[["Yes",0,null],["Rarely",1,"Ask"],["Never",2,"Ask"]])
      ],
      money:[
        Q("Pricing or quote requests — followed up, invoiced cleanly?",[["Yes, a system",0,null],["Sometimes",1,"Ledger"],["Often forgotten",2,"Ledger"]]),
        Q("Repeat-customer rate — known?",[["Yes",0,null],["Guess",1,"Foundation"],["No idea",2,"Foundation"]]),
        Q("Customer switches to a competitor — would you know, and win them back?",[["Both",0,null],["Maybe",1,"Recall"],["Never",2,"Recall"]]),
        Q("A missed or cancelled booking or sale — recovered?",[["Yes",0,null],["Sometimes",1,"Lobby"],["Never",2,"Lobby"]])
      ],
      tech: TECH_QUESTIONS
    }
  }
};

const BREATHERS = [
  {id:"b1", text:"How long has this business been running?", opts:["Less than 1 year","1\u20135 years","5+ years"]},
  {id:"b2", text:"How many people work here, including you?", opts:["Just me","2\u20135 people","6+ people"]},
  {id:"b3", text:"Roughly how many customers do you see in a month?", opts:["Under 100","100\u2013500","500+"]},
  {id:"b4", text:"How crowded is your local competition?", opts:["Crowded \u2014 many similar businesses nearby","A few competitors","Not much competition"]},
  {id:"b5", text:"What does success look like for you over the next 12 months?", opts:["More new customers","More revenue per existing customer","Less day-to-day chaos","Building something I could eventually sell or hand off"]},
  {id:"b6", text:"How much of your week goes into \u201Cowner stuff\u201D you wish someone else handled?", opts:["Most of it","Some of it","Very little"]}
];

const FINAL_PROMPT = "In your own words \u2014 what's the one thing that, if fixed, would make the biggest difference right now?";

/* ====== CONFIG ====== */
const CONFIG = {
  GOOGLE_SHEETS_URL: "https://script.google.com/macros/s/AKfycbxwHewAg_A2R5X1G8beRBdeuWCdbU-JJ5qr373uxkAt2wJWoIzrDaS0Hiz2pAa9pae_/exec",
  WHATSAPP_NUMBER: "917654925271", // replace with your real WhatsApp business number
  SCALE_URL: "scale.html",
  SUPABASE_URL: "https://ebfpwzxdysrsnvcwdfug.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZnB3enhkeXNyc252Y3dkZnVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNjExMjIsImV4cCI6MjA5NzczNzEyMn0.trbOczJUHkrDx4C-TF3zOcsSaWDg5w9CxYvZaZkvprw"
};

/* ============================= ENGINE ============================= */

let state = {
  vertical:null,
  verticalLabel:null,
  customBusiness:"",
  screens:[],
  index:-1, // -1 = intro
  answers:{}, // screenId -> {label, score, tool} or raw value for breathers/free text
  src:"direct",
  submitted:false
};

function getSrc(){
  try{
    const params = new URLSearchParams(window.location.search);
    return params.get("src") || "direct";
  }catch(e){ return "direct"; }
}
state.src = getSrc();

const STORAGE_KEY = "wd_audit_progress_v1";

function saveProgress(){
  try{
    if(!state.vertical || state.index < 0) return;
    const screen = state.screens[state.index];
    if(screen && screen.type === "result"){ clearProgress(); return; }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      vertical: state.vertical,
      verticalLabel: state.verticalLabel,
      customBusiness: state.customBusiness,
      index: state.index,
      answers: state.answers
    }));
  }catch(e){ /* storage unavailable in this preview context \u2014 degrades to in-memory only, fine once deployed live */ }
}

function loadProgress(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }catch(e){ return null; }
}

function clearProgress(){
  try{ localStorage.removeItem(STORAGE_KEY); }catch(e){}
}

const app = document.getElementById("app");
const progressFill = document.getElementById("progressFill");
const stepLabel = document.getElementById("stepLabel");

function buildScreens(vertKey){
  const v = VERTICALS[vertKey];
  const order = ["memory","comms","ops","marketing","money","tech"];
  let screens = [];
  order.forEach((catId, i)=>{
    screens.push({type:"breather", id:BREATHERS[i].id, data:BREATHERS[i]});
    v.categories[catId].forEach((q, qi)=>{
      screens.push({type:"q", id:catId+"_"+qi, catId:catId, data:q});
    });
  });
  screens.push({type:"free", id:"final", data:{text:FINAL_PROMPT}});
  screens.push({type:"lead", id:"lead"});
  screens.push({type:"result", id:"result"});
  return screens;
}

function bizLabel(){
  if(state.vertical === "other" && state.customBusiness) return state.customBusiness;
  return state.verticalLabel || "your business";
}

function startVertical(key, label){
  state.vertical = key;
  state.verticalLabel = label;
  if(key !== "other"){
    state.screens = buildScreens(key);
    state.index = 0;
    render();
    saveProgress();
  } else {
    renderOtherInput();
  }
}

function renderOtherInput(){
  app.innerHTML = `
    <div class="screen">
      <div class="eyebrow">Tell us a bit more</div>
      <h2 class="qtext">What kind of business do you run?</h2>
      <input class="input-text" id="otherInput" placeholder="e.g. bookshop, gym, photography studio" aria-label="What kind of business do you run" autofocus>
      <div class="nav-row">
        <button class="btn btn-ghost" onclick="WDA.goIntro()">Back</button>
        <button class="btn btn-primary" id="otherNext" disabled onclick="WDA.confirmOther()">Continue</button>
      </div>
    </div>`;
  const input = document.getElementById("otherInput");
  const btn = document.getElementById("otherNext");
  input.addEventListener("input", ()=>{ btn.disabled = input.value.trim().length < 2; });
  setProgress(0,1);
  stepLabel.textContent = "";
}

function confirmOther(){
  const val = document.getElementById("otherInput").value.trim();
  state.customBusiness = val;
  state.screens = buildScreens("other");
  state.index = 0;
  render();
  saveProgress();
}

function goIntro(){
  state.index = -1;
  state.vertical = null;
  render();
}

function setProgress(i, total){
  const pct = total ? Math.round((i/total)*100) : 0;
  progressFill.style.width = pct + "%";
}

function render(){
  if(state.index === -1){ renderIntro(); return; }
  const total = state.screens.length;
  setProgress(state.index, total);
  const screen = state.screens[state.index];
  stepLabel.textContent = screen.type === "result" ? "" : `Step ${state.index+1} of ${total-1}`;

  if(screen.type === "breather") renderBreather(screen);
  else if(screen.type === "q") renderQuestion(screen);
  else if(screen.type === "free") renderFree(screen);
  else if(screen.type === "lead") renderLead(screen);
  else if(screen.type === "result") renderResult();
}

const VERT_META = {
  restaurant:{ tagline:"Those Who Feed", icon:'<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M7 2v7a2 2 0 002 2 2 2 0 002-2V2M9 11v11M17 2c0 3.5-2.5 5-2.5 8.5S17 14 17 14M17 14v9"/></svg>' },
  salon:{ tagline:"Those Who Craft", icon:'<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6.5" r="2.2"/><circle cx="6" cy="17.5" r="2.2"/><path d="M7.7 8L19 19M7.7 16L19 5"/></svg>' },
  clinic:{ tagline:"Those Who Heal", icon:'<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>' },
  retail:{ tagline:"Those Who Trade", icon:'<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1.2 12.5a1 1 0 01-1 .9H7.2a1 1 0 01-1-.9L5 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg>' },
  other:{ tagline:"Tell us what you do", icon:'<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>' }
};

function renderIntro(){
  stepLabel.textContent = "";
  progressFill.style.width = "0%";
  app.innerHTML = `
    <div class="screen">
      <div class="eyebrow">Question 1</div>
      <h2 class="qtext">What kind of business do you run?</h2>
      <div class="vert-list">
        ${Object.keys(VERTICALS).map(k=>`
          <button class="vert-row" onclick="WDA.startVertical('${k}','${VERTICALS[k].label}')">
            <span class="vert-icon">${VERT_META[k].icon}</span>
            <span class="vert-text">
              <span class="vert-name">${VERTICALS[k].label}</span>
            </span>
            <span class="opt-underline"></span>
          </button>`).join("")}
      </div>
    </div>`;
}

function renderBreather(screen){
  app.innerHTML = `
    <div class="screen">
      <div class="eyebrow">About your business</div>
      <h2 class="qtext">${screen.data.text}</h2>
      <div class="options" id="optList">
        ${screen.data.opts.map((o,i)=>`<button class="opt" data-i="${i}" onclick="WDA.selectBreather('${screen.id}','${escapeAttr(o)}',this)"><span>${o}</span><span class="opt-underline"></span></button>`).join("")}
      </div>
      ${navRow(false)}
    </div>`;
}

function selectBreather(id, label, el){
  document.querySelectorAll("#optList .opt").forEach(b=>b.classList.remove("selected"));
  el.classList.add("selected");
  state.answers[id] = {label, score:null, tool:null};
  setTimeout(()=>nextScreen(), 220);
}

function renderQuestion(screen){
  app.innerHTML = `
    <div class="screen">
      <div class="eyebrow">${CATEGORY_META[screen.catId].name}</div>
      <h2 class="qtext">${screen.data.text}</h2>
      <div class="options" id="optList">
        ${screen.data.opts.map((o,i)=>`<button class="opt" data-i="${i}" onclick="WDA.selectOption('${screen.id}',${i},this)"><span>${o[0]}</span><span class="opt-underline"></span></button>`).join("")}
      </div>
      ${navRow(false)}
    </div>`;
}


function selectOption(id, i, el){
  document.querySelectorAll("#optList .opt").forEach(b=>b.classList.remove("selected"));
  el.classList.add("selected");
  const screen = state.screens[state.index];
  const opt = screen.data.opts[i];
  state.answers[id] = {label:opt[0], score:opt[1], tool:opt[2], catId:screen.catId};
  setTimeout(()=>nextScreen(), 220);
}

function renderFree(screen){
  app.innerHTML = `
    <div class="screen">
      <div class="eyebrow">Last one</div>
      <h2 class="qtext">${screen.data.text}</h2>
      <textarea class="input-text" id="freeInput" rows="4" placeholder="Type as much or as little as you like\u2026" aria-label="${escapeAttr(screen.data.text)}" style="resize:vertical;font-family:'DM Sans',sans-serif;"></textarea>
      ${navRow(true)}
    </div>`;
  const input = document.getElementById("freeInput");
  const btn = document.getElementById("nextBtn");
  if(state.answers["final"]) input.value = state.answers["final"].label;
  btn.disabled = false; // optional field, allow skip
  input.addEventListener("input", ()=>{ state.answers["final"] = {label:input.value.trim()}; });
}

function renderLead(){
  app.innerHTML = `
    <div class="screen">
      <div class="eyebrow">Almost there</div>
      <h2 class="qtext">Before we show your results \u2014 who should this be for?</h2>
      <p style="color:var(--ink-soft);font-size:14.5px;margin-bottom:20px;">WhatsApp number is optional. The rest helps us make sure this actually reaches the right person.</p>
      <input class="input-text" id="leadBusiness" placeholder="Business name *" aria-label="Business name" style="margin-bottom:10px;">
      <input class="input-text" id="leadName" placeholder="Your name *" aria-label="Your name" style="margin-bottom:10px;">
      <input class="input-text" id="leadLocation" placeholder="City / location *" aria-label="City or location" style="margin-bottom:10px;">
      <input class="input-text" id="leadPhone" placeholder="WhatsApp number (optional)" aria-label="WhatsApp number, optional">
      <div id="phoneError" style="color:#B23B2E;font-size:12.5px;margin-top:6px;display:none;">That doesn't look like a valid number \u2014 enter 10\u201313 digits, or leave it blank.</div>
      <p style="color:var(--ink-soft);font-size:12px;margin-top:14px;">Used only to follow up about your audit \u2014 never shared, never sold.</p>
      <input type="text" id="hp_field" name="hp_field" tabindex="-1" autocomplete="off" aria-label="Leave this field blank"
        style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0;" aria-hidden="true">
      ${navRow(true, "See my results")}
    </div>`;
  const requiredIds = ["leadBusiness","leadName","leadLocation"];
  const nextBtn = document.getElementById("nextBtn");
  const phoneInput = document.getElementById("leadPhone");
  const phoneError = document.getElementById("phoneError");

  function phoneOk(){
    const digits = phoneInput.value.replace(/[^0-9]/g,"");
    if(digits.length === 0) return true; // optional, blank is fine
    return digits.length >= 10 && digits.length <= 13;
  }
  function checkLeadValid(){
    const requiredOk = requiredIds.every(id=>document.getElementById(id).value.trim().length>0);
    const phValid = phoneOk();
    phoneError.style.display = phValid ? "none" : "block";
    nextBtn.disabled = !(requiredOk && phValid);
  }
  requiredIds.forEach(id=>document.getElementById(id).addEventListener("input", checkLeadValid));
  phoneInput.addEventListener("input", checkLeadValid);
  checkLeadValid();
}

function navRow(showNext, label){
  return `<div class="nav-row">
    <button class="btn btn-ghost" onclick="WDA.prevScreen()">${state.index===0 ? 'Back to start' : 'Back'}</button>
    ${showNext ? `<button class="btn btn-primary" id="nextBtn" onclick="WDA.nextScreen()">${label || 'Continue'}</button>` : ''}
  </div>`;
}

function prevScreen(){
  if(state.index === 0){ goIntro(); return; }
  state.index--;
  render();
  saveProgress();
}

function nextScreen(){
  const screen = state.screens[state.index];
  if(screen.type === "lead"){
    state.answers["leadBusiness"] = document.getElementById("leadBusiness").value.trim();
    state.answers["leadName"] = document.getElementById("leadName").value.trim();
    state.answers["leadLocation"] = document.getElementById("leadLocation").value.trim();
    state.answers["leadPhone"] = document.getElementById("leadPhone").value.replace(/[^0-9]/g,"");
    state.answers["hp_field"] = document.getElementById("hp_field").value.trim();
  }
  state.index++;
  render();
  saveProgress();
}

function escapeAttr(s){ return String(s).replace(/'/g,"\\'"); }

/* ============================= SCORING ============================= */

function computeResults(){
  const catPoints = {memory:0,comms:0,ops:0,marketing:0,money:0,tech:0};
  const catMax = {};
  const toolHits = {};
  Object.keys(CATEGORY_META).forEach(c=>{
    const qCount = VERTICALS[state.vertical].categories[c].length;
    catMax[c] = qCount * 2;
  });

  Object.values(state.answers).forEach(a=>{
    if(a && a.score !== null && a.score !== undefined && a.catId){
      catPoints[a.catId] += a.score;
      if(a.score === 2 && a.tool){
        toolHits[a.tool] = (toolHits[a.tool]||0) + 1;
      } else if(a.score === 1 && a.tool){
        toolHits[a.tool] = (toolHits[a.tool]||0) + 0.4;
      }
    }
  });

  const catScores = {};
  Object.keys(CATEGORY_META).forEach(c=>{
    const max = catMax[c] || 1;
    catScores[c] = Math.round((10 - (catPoints[c]/max)*10) * 10) / 10;
  });

  let overall = 0;
  Object.keys(CATEGORY_META).forEach(c=>{
    overall += catScores[c] * CATEGORY_META[c].weight;
  });
  overall = Math.round(overall * 10) / 10;

  let tier = "Critical";
  if(overall >= 7) tier = "Stable";
  else if(overall >= 4) tier = "Moderate";

  const rankedTools = Object.keys(toolHits)
    .filter(t=>t!=="Foundation")
    .sort((a,b)=>toolHits[b]-toolHits[a])
    .slice(0,3);

  const weakestCats = Object.keys(catScores)
    .filter(c=>c!=="tech")
    .sort((a,b)=>catScores[a]-catScores[b])
    .slice(0,2);

  return {catScores, overall, tier, rankedTools, weakestCats};
}

/* ============================= RESULT RENDER ============================= */

const SCORE_WAVES = {
  Stable:'<path d="M0,30 C50,18 100,18 150,30 C200,42 250,42 300,30" fill="none" stroke="#0660EB" stroke-width="2.5" stroke-linecap="round"/><path d="M0,30 C50,18 100,18 150,30 C200,42 250,42 300,30 L300,55 L0,55 Z" fill="#0660EB" opacity="0.08"/>',
  Moderate:'<path d="M0,30 C25,12 50,12 75,30 C100,48 125,48 150,30 C175,12 200,12 225,30 C250,48 275,48 300,30" fill="none" stroke="#0660EB" stroke-width="2.5" stroke-linecap="round"/><path d="M0,30 C25,12 50,12 75,30 C100,48 125,48 150,30 C175,12 200,12 225,30 C250,48 275,48 300,30 L300,55 L0,55 Z" fill="#0660EB" opacity="0.08"/>',
  Critical:'<path d="M0,30 C15,4 30,4 45,30 C60,56 75,56 90,30 C105,4 120,4 135,30 C150,56 165,56 180,30 C195,4 210,4 225,30 C240,56 255,56 270,30 C285,4 300,4 300,30" fill="none" stroke="#0660EB" stroke-width="2.5" stroke-linecap="round"/><path d="M0,30 C15,4 30,4 45,30 C60,56 75,56 90,30 C105,4 120,4 135,30 C150,56 165,56 180,30 C195,4 210,4 225,30 C240,56 255,56 270,30 C285,4 300,4 300,30 L300,55 L0,55 Z" fill="#0660EB" opacity="0.08"/>'
};

function tierIntro(tier, biz){
  if(tier === "Critical") return `${biz} is running on memory and habit \u2014 and both disappear the moment something changes.`;
  if(tier === "Moderate") return `${biz} isn't obviously losing customers. It's losing them quietly, one missed moment at a time.`;
  return `${biz} has strong instincts already. The gap isn't survival \u2014 it's how much faster you could be moving.`;
}

function contextLine(){
  const b1 = state.answers["b1"], b2 = state.answers["b2"], b4 = state.answers["b4"];
  if(!b1 || !b2) return "";
  const teamPart = b2.label.toLowerCase().indexOf("just me") > -1 ? "running it mostly on your own" : "running it with " + b2.label.toLowerCase();
  let line = `${b1.label} in, ${teamPart}`;
  if(b4 && b4.label.toLowerCase().indexOf("crowded") > -1) line += ", in a market that isn't short on competition";
  return line + " \u2014 here's what actually surfaced:";
}

function mythLine(tier){
  if(tier === "Critical") return "Most owners in this spot assume the fix is hiring someone, or spending more on ads. It's usually neither \u2014 another pair of hands just means one more person without a system to follow, and ads can't fix a bucket that's already leaking.";
  if(tier === "Moderate") return "The instinct is to chase more new customers. But the quieter, cheaper win is almost always the customers you already have, slipping through gaps nobody's watching.";
  return "The temptation at this stage is to assume the current pace is the ceiling. It usually isn't \u2014 the same instincts, with structure underneath them, just move faster.";
}

function escapeHtml(s){
  return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

function renderResult(){
  const r = computeResults();
  const biz = bizLabel();          // raw — safe to use in non-HTML contexts (e.g. WhatsApp text)
  const bizSafe = escapeHtml(biz); // escaped — use anywhere this goes into innerHTML
  const finalThoughtRaw = (state.answers["final"] && state.answers["final"].label) ? state.answers["final"].label : "";
  const finalThought = escapeHtml(finalThoughtRaw);

  const catRows = Object.keys(CATEGORY_META).map(c=>`
    <div class="cat-bar-row">
      <div class="cat-bar-label">${CATEGORY_META[c].name}</div>
      <div class="cat-bar-track"><div class="cat-bar-fill" style="width:${r.catScores[c]*10}%"></div></div>
      <div class="cat-bar-score">${r.catScores[c]}/10</div>
    </div>`).join("");

  const toolParas = r.rankedTools.map(t=>{
    const tool = TOOLS[t];
    return `<p>${tool.anon}</p>`;
  }).join("");

  const tipsHtml = r.weakestCats.map(c=>`<div class="tip-item">${CATEGORY_TIPS[c]}</div>`).join("");

  app.innerHTML = `
    <div class="screen" style="padding-top:24px;">
      <div class="score-hero">
        <div class="eyebrow" style="text-align:center;">Your business health score</div>
        <div class="score-num">${r.overall}<span>/10</span></div>
        <div class="tier-pill">${r.tier}</div>
        <svg class="score-wave" viewBox="0 0 300 55" preserveAspectRatio="none">${SCORE_WAVES[r.tier]}</svg>
      </div>

      <div class="cat-bars">${catRows}</div>

      <div class="divider"></div>

      ${finalThought ? `<div class="echo-quote"><span class="echo-label">You told us</span>${finalThought}</div>` : ""}

      <div class="result-block">
        <h3>${tierIntro(r.tier, bizSafe)}</h3>
        <p style="color:var(--ink-soft);font-size:14.5px;">${contextLine()}</p>
        ${toolParas || "<p>Most of the structural basics are in place \u2014 the bigger opportunity now is speed and consistency, not survival.</p>"}
      </div>

      <div class="result-block">
        <p>${mythLine(r.tier)}</p>
        <p>${TOOLS.Foundation.anon}</p>
      </div>

      <div class="tip-box">
        <h4>Do this yourself this week \u2014 no tools needed</h4>
        ${tipsHtml}
      </div>

      <div class="result-block">
        <p>Here's the honest math: if even one of the gaps above is quietly costing you a single regular customer a month, that's already worth more than what fixing it properly would. This is exactly the kind of structure we build \u2014 once, owned by you forever, no subscriptions, no retainers.</p>
        <p>The fastest way to know what that actually looks like for ${bizSafe}, and what it would take, is just to talk it through.</p>
      </div>

      <div class="cta-block">
        <div class="eyebrow" style="text-align:center;">No pitch on the call \u2014 just a conversation</div>
        <a class="btn btn-primary cta-primary" href="https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi, I just completed the business audit for '+biz+' (scored '+r.overall+'/10) and want to talk about fixing it.')}" target="_blank">Chat with us on WhatsApp</a>
      </div>

      <div class="side-sell">
        <div class="label">Want to go deeper yourself first?</div>
        <p>Download <strong>Scale</strong> — fourteen short chapters on exactly why businesses like ${bizSafe} are starting to pull ahead right now. No jargon, no payment, yours to keep.</p>
        <a class="btn btn-soft" href="${CONFIG.SCALE_URL}">Get Scale — Free</a>
      </div>

      <div class="footer-note">Your results have been saved. We'll never spam you \u2014 promise.</div>
    </div>`;

  submitToSheets(r);
}

/* ============================= SUBMIT TO SHEETS + SUPABASE ============================= */

function submitToSheets(r){
  if(state.submitted) return;
  if(state.answers["hp_field"]) return;
  state.submitted = true;
  clearProgress();

  const context = {};
  BREATHERS.forEach(b=>{ context[b.id] = state.answers[b.id] ? state.answers[b.id].label : ""; });

  const payload = {
    timestamp: new Date().toISOString(),
    source: state.src,
    businessType: state.verticalLabel,
    customBusiness: state.customBusiness || "",
    businessNameOnRecord: state.answers["leadBusiness"] || "",
    name: state.answers["leadName"] || "",
    location: state.answers["leadLocation"] || "",
    phone: state.answers["leadPhone"] || "",
    overallScore: r.overall,
    tier: r.tier,
    categoryScores: r.catScores,
    recommendedTools: r.rankedTools,
    finalThought: (state.answers["final"] && state.answers["final"].label) || "",
    context: context
  };

  // 1. Google Sheets
  if(CONFIG.GOOGLE_SHEETS_URL && CONFIG.GOOGLE_SHEETS_URL.indexOf("PASTE_") !== 0){
    fetch(CONFIG.GOOGLE_SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).catch(()=>{});
  }

  // 2. Supabase leads table
  if(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY && CONFIG.SUPABASE_ANON_KEY.indexOf("PASTE_") !== 0){
    fetch(CONFIG.SUPABASE_URL + "/rest/v1/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": CONFIG.SUPABASE_ANON_KEY,
        "Authorization": "Bearer " + CONFIG.SUPABASE_ANON_KEY,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        name: state.answers["leadName"] || "",
        email: "",
        whatsapp: state.answers["leadPhone"] || "",
        source: "audit",
        business_name: state.answers["leadBusiness"] || "",
        business_type: state.verticalLabel || "",
        location: state.answers["leadLocation"] || "",
        score: r.overall,
        tier: r.tier
      })
    }).catch(()=>{});
  }
}

/* ============================= MODAL CONTROL ============================= */

function openAuditModal(){
  document.getElementById("modalOverlay").classList.add("open");
  document.body.style.overflow = "hidden";

  if(!state.vertical){
    const saved = loadProgress();
    if(saved && saved.vertical){
      renderResumePrompt(saved);
      return;
    }
  }
  render();
}

function renderResumePrompt(saved){
  app.innerHTML = `
    <div class="screen">
      <div class="eyebrow">Welcome back</div>
      <h2 class="qtext">Looks like you started this before. Pick up where you left off?</h2>
      <div class="options">
        <button class="opt" onclick="WDA.resumeProgress()"><span>Yes, continue where I left off</span><span class="opt-underline"></span></button>
        <button class="opt" onclick="WDA.discardProgressAndStart()"><span>No, start fresh</span><span class="opt-underline"></span></button>
      </div>
    </div>`;
  setProgress(0,1);
  stepLabel.textContent = "";
}

function resumeProgress(){
  const saved = loadProgress();
  if(!saved){ goIntro(); return; }
  state.vertical = saved.vertical;
  state.verticalLabel = saved.verticalLabel;
  state.customBusiness = saved.customBusiness || "";
  state.answers = saved.answers || {};
  state.screens = buildScreens(saved.vertical);
  state.index = Math.min(saved.index, state.screens.length - 1);
  render();
}

function discardProgressAndStart(){
  clearProgress();
  state = { vertical:null, verticalLabel:null, customBusiness:"", screens:[], index:-1, answers:{}, src:state.src, submitted:false };
  render();
}

function closeAuditModal(){
  document.getElementById("modalOverlay").classList.remove("open");
  document.body.style.overflow = "";
  // progress is saved automatically as you go — nothing is lost on close
}

/* init */
render();

window.WDA = {
  open: openAuditModal, close: closeAuditModal,
  openAuditModal, closeAuditModal, startVertical, confirmOther, goIntro,
  selectBreather, selectOption, prevScreen, nextScreen,
  resumeProgress, discardProgressAndStart
};
})();
