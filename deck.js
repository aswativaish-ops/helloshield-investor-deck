const $ = id => document.getElementById(id);
const slides = [
  ['vision', 'The vision'],
  ['problem', 'The problem'],
  ['product', 'The product'],
  ['customer', 'The first customer'],
  ['market', 'Market opportunity'],
  ['business-model', 'Business model'],
  ['competition', 'Why HelloShield?'],
  ['validation', 'Rollout strategy'],
  ['team', 'Team & execution'],
  ['funds', 'The $1.5M plan'],
  ['invitation', 'Investor invitation']
];

const PROFILE = 'https://www.linkedin.com/in/kaushalabhishek/';

const state = {
  page: 0,
  minutes: 4,
  demoStep: 0,
  demoDone: false,
  plan: 'basic',
  scenario: 'dental'
};

let demoTimer;

const model = financialModel.calculate();
const money = value => value.toLocaleString('en-US', {style:'currency',currency:'USD',maximumFractionDigits:0});
const number = value => Math.round(value).toLocaleString('en-US');
const plans = {
  basic: { name:'Personal', price:4.99, minutes:20, cost:3.25, audience:'For occasional unknown calls' },
  plus: { name:'Plus', price:8.99, minutes:60, cost:5.70, audience:'For people who handle more calls' }
};
const competitors = [
  {name:'Apple',offer:'Built-in unknown-call screening',scale:'2.5B+ active Apple devices',date:'Jan 2026; all product categories, not screening users',learn:'Free and built in: our setup and results must justify paying.',source:'https://www.apple.com/newsroom/2026/01/apple-reports-first-quarter-results/',feature:'https://support.apple.com/en-euro/111106'},
  {name:'Google',offer:'Call Screen on supported phones',scale:'3B+ active Android devices',date:'May 2025; ecosystem size, not Call Screen users',learn:'Demonstrate useful-call handling; do not claim screening is unique.',source:'https://blog.google/products-and-platforms/platforms/android/the-android-show-io-2025/',feature:'https://support.google.com/phoneapp/answer/9118387'},
  {name:'Truecaller',offer:'Caller ID, spam blocking, and AI Assistant',scale:'500M+ active users',date:'Jul 2026 company statement; Q2 average excluding iOS: 471M',learn:'Closest rival. Test switching reasons with its users, not just feature lists.',source:'https://corporate.truecaller.com/newsroom/press-release/sequential-growth-across-all-revenue-streams?id=AF7CD16BDA563CF7',feature:'https://www.truecaller.com/truecaller-for-ios'},
  {name:'Wajo',offer:'Agents that act across calls, bookings, and other tools',scale:'User count not publicly disclosed',date:'Official site reviewed 10 Oct 2026',learn:'Test demand for focused inbound screening plus bounded outbound requests.',source:'https://wajo.ai/',feature:'https://wajo.ai/'},
  {name:'Poka',offer:'AI outbound calls, messages, reservations, and reminders',scale:'User count not publicly disclosed',date:'Poka AI Call Assistant listing reviewed 10 Oct 2026',learn:'Compare the combined inbound and outbound experience, not an outbound-only feature claim.',source:'https://apps.apple.com/us/app/poka-your-ai-call-assistant/id6788496398',feature:'https://www.cyborgate.uk/poka/terms/'},
  {name:'Hiya',offer:'Caller identity and protection through carrier/device partners',scale:'550M+ users protected monthly',date:'Mar 2026; network reach, not paid app subscribers',learn:'Use community distribution first; carrier partnerships are a later option.',source:'https://www.hiya.com/en-au/newsroom/press-releases/state-of-the-call-2026-ai-deepfake-voice-calls-hit-1-in-4-americans-as-consumers-say-scammers-are-beating-mobile-network-operators-2-to-1',feature:'https://www.hiya.com/why-hiya/voice-intelligence-platform'}
];

const demos = {
  outbound: {
    photo:'', initials:'OV', kind:'OUTBOUND · IMPLEMENTED', caller:'Appointment request',
    desk:'Deliver the user’s approved request by voice', context:'Ask a contact whether Tuesday at 2 PM works',
    permissions:['✓ User approves recipient and request','✓ Recipient decision determines the result'],
    steps:[['Approve','Review recipient, time, and message'],['Call','Convey the request and ask availability'],['Report','Return confirmed, declined, or unresolved']],
    speech:['“Please call my contact and ask whether Tuesday at 2 PM works.”','After the required introduction and consent, Ovi conveys the approved appointment request.','Report the recipient’s actual response. A completed phone call alone is not a confirmed appointment.'],
    artifact:{kicker:'IMPLEMENTED; EXTERNAL PROOF PENDING',title:'The user receives the outcome',body:'Appointment agreement is not automatic calendar booking. Live recipient-call and owner-notification verification remains; this is not a general-purpose message-delivery claim.'}
  },
  pizza: {
    photo:'', initials:'PZ', kind:'FUTURE PROPOSED USE CASE', caller:'Order pizza for delivery',
    desk:'Not implemented', context:'Ask Ovi to place an approved pizza order',
    permissions:['✓ Proposed order and spending approval','× No current purchasing or delivery capability'],
    steps:[['Specify','Choose order, address, and budget'],['Approve','Authorize the exact order and payment'],['Confirm','Obtain merchant acceptance and status']],
    speech:['Future concept: tell Ovi what pizza you want and where it should arrive.','A future flow would need explicit purchase approval, merchant handling, and payment safeguards.','A merchant would fulfill delivery. HelloShield would coordinate the order and report confirmed status.'],
    artifact:{kicker:'PLANNED CONCEPT',title:'Ordering assistance, not a delivery fleet',body:'Purchases, payments, and merchant fulfillment are future work. No pizza-order revenue or cost is included in the forecast.'}
  },
  dental: {
    photo: '', initials: 'BD', kind: 'INBOUND CALL', caller: 'BrightSmile Dental',
    desk: 'Appointment desk', context: 'An unknown number calls during your workday',
    permissions: ['✓ Screen before ringing', '✓ You choose whether to answer'],
    steps: [['Ask who', 'Identify the caller'], ['Ask why', 'Understand the purpose'], ['Connect', 'Ring your HelloShield app']],
    speech: ['“Who is calling, please?”', '“What is the reason for your call?”', 'A human calling about your appointment is connected to your app.'],
    artifact: { kicker: 'ILLUSTRATIVE OUTCOME', title: 'Useful call reaches you', body: 'Caller identity is a claim, not verified proof. No calendar booking or payment is performed.' }
  },
  client: {
    photo: '', initials: 'NC', kind: 'INBOUND CALL', caller: 'New client',
    desk: 'Project inquiry', context: 'You cannot ignore every unfamiliar number',
    permissions: ['✓ Ask identity and purpose', '✓ Keep useful human calls'],
    steps: [['Ask who', 'Identify the caller'], ['Ask why', 'Understand the inquiry'], ['Connect', 'Ring your HelloShield app']],
    speech: ['“Who is calling, please?”', '“What is the reason for your call?”', 'A potential client with a project question is connected to your app.'],
    artifact: { kicker: 'ILLUSTRATIVE OUTCOME', title: 'A new opportunity gets through', body: 'The caller does not need to be in your contacts. No promise of perfect spam detection.' }
  },
  uncertain: {
    photo: '', initials: '?', kind: 'INBOUND CALL', caller: 'Unclear caller',
    desk: 'Incomplete answers', context: 'The caller gives too little information',
    permissions: ['✓ At most two screening questions', '× Uncertainty is not a reason to reject'],
    steps: [['Ask who', 'The answer is unclear'], ['Ask why', 'The purpose is incomplete'], ['Connect', 'Let you decide']],
    speech: ['“Who is calling, please?”', '“What is the reason for your call?”', 'An uncertain human caller is connected to your app, not automatically rejected.'],
    artifact: { kicker: 'SAFETY RULE', title: 'You keep the final choice', body: 'Explicit blocked-caller rules still apply. Screening uncertainty alone does not block a human call.' }
  }
};

const eyebrow = (number, label) => `<div class="eyebrow">${String(number).padStart(2, '0')} / ${label}</div>`;
const heading = (number, label, title, side = '') =>
  `<div class="heading"><div>${eyebrow(number, label)}<h2>${title}</h2></div>${side}</div>`;
const button = (label, action, className = '', attrs = '') =>
  `<button type="button" class="${className}" data-action="${action}" ${attrs}>${label}</button>`;
const linkBtn = (label, href, className = '') =>
  `<a class="${className}" href="${href}">${label}</a>`;

const exposedHours = () => Math.round(state.minutes * 5 * 48 / 60);

function tabAttrs(selected) {
  return `role="tab" aria-selected="${selected}" aria-pressed="${selected}"`;
}

function slideHTML(p) {
  if (p === 0) {
    return `<section class="slide hero" id="vision">
      <img class="hero-image" src="assets/hero.jpg" alt="">
      <div class="hero-shade"></div>
      <div class="hero-copy">
        <h1>Meet “OVI”<br><em>Your AI Call Assistant</em></h1>
        <p class="hero-tag">One personal call assistant for incoming calls and authorized outbound requests.</p>
        <p class="hero-rules">Screen incoming calls. Make authorized calls. Bring back the outcome.</p>
        <div class="hero-actions">${button('See the product ↗', 'goto-2', 'primary')}${button('Meet the first customer', 'goto-3', 'secondary')}</div>
        <div class="founder-line"><b>Abhishek Kaushal</b><span>Founder & Product Lead</span></div>
      </div>
    </section>`;
  }

  if (p === 1) {
    return `<section class="slide" id="problem">
      ${heading(2, 'THE PROBLEM', 'Calls interrupt. Follow-ups pile up.<br><em>Handle calls coming in and going out</em>')}
      <div class="problem-grid">
        <div class="problem-copy">
          <p class="lead">Busy professionals face two jobs: deciding which incoming calls matter, and finding time to call people back.</p>
          <div class="choice"><span>INBOUND</span><strong>Answer and lose focus—or ignore a useful caller</strong></div>
          <div class="choice"><span>OUTBOUND</span><strong>Chase callbacks, wait on hold, repeat the context</strong></div>
          <p class="takeaway">HelloShield screens incoming calls and Ovi handles authorized outbound appointment requests and their spoken messages. Both are implemented; live verification remains. Pizza ordering is a future use case.</p>
        </div>
        <div class="attention-calc">
          <span class="kicker">ILLUSTRATIVE INTERRUPTION LOAD</span>
          <strong id="hours">${exposedHours()}h</strong>
          <p>Annual time exposed to call interruptions</p>
          <label for="minutes">Minutes exposed each weekday <output id="minutes-label">${state.minutes}</output></label>
          <input id="minutes" type="range" min="1" max="12" value="${state.minutes}" aria-valuemin="1" aria-valuemax="12" aria-valuenow="${state.minutes}">
          <small id="time-formula">${state.minutes} min × 5 days × 48 weeks = ${exposedHours()} hours exposed. Illustration only; time saved has not been measured.</small>
        </div>
      </div>
    </section>`;
  }

  if (p === 2) {
    const demo = demos[state.scenario] || demos.dental;
    const tabs = [
      ['dental', 'Inbound appointment'],
      ['client', 'New client'],
      ['outbound', 'Outbound appointment / message'],
      ['pizza', 'Pizza · future']
    ];
    return `<section class="slide" id="product">
      ${heading(3, 'THE PRODUCT', 'Incoming calls. Outgoing requests.<br><em>One personal call assistant</em>', `<span class="status">INTERACTIVE PROTOTYPE</span>`)}
      <div class="scenario-tabs" role="tablist" aria-label="Product scenarios">${tabs.map(([id, label]) =>
        button(label, 'scenario-' + id, state.scenario === id ? 'selected' : '', tabAttrs(state.scenario === id))
      ).join('')}</div>
      <div class="product-grid">
        <div class="phone ${demo.photo}">
          <div class="phone-top"><span>11:42</span><b>HELLOSHIELD ON</b></div>
          <div class="caller"><span class="avatar">${demo.initials}</span><div><small>${demo.kind}</small><strong>${demo.caller}</strong><em>${demo.desk}</em></div></div>
          <div class="context"><span>Call context</span><b>${demo.context}</b></div>
          <div class="permissions"><span>${demo.permissions[0]}</span><span>${demo.permissions[1]}</span></div>
        </div>
        <div class="demo">
          <div class="demo-steps">${demo.steps.map((item, index) =>
            `<button type="button" data-action="demo-${index}" class="${state.demoStep === index ? 'active' : ''}" aria-pressed="${state.demoStep === index}"><i>0${index + 1}</i><span><b>${item[0]}</b><small>${item[1]}</small></span></button>`
          ).join('')}</div>
          <div class="speech"><span>OVI · HELLOSHIELD</span><p>${demo.speech[state.demoStep]}</p></div>
          <div class="artifact ${state.demoDone || state.demoStep === 2 ? 'visible' : ''}">
            <span class="kicker">${demo.artifact.kicker}</span>
            <b>${demo.artifact.title}</b>
            <small>${demo.artifact.body}</small>
          </div>
          <div class="demo-actions">${button('▶ Run this scenario', 'run-demo', 'primary')}</div>
        </div>
      </div>
      <p class="bottom-note">Illustrative scenarios, not live calls. Inbound and bounded outbound appointment/message flows are implemented; external proof and release finishing remain. Pizza ordering is proposed future work. Voicemail audio is not production-ready.</p>
    </section>`;
  }

  if (p === 3) {
    return `<section class="slide" id="customer">
      ${heading(4, 'FIRST CUSTOMERS', 'Busy professionals<br><em>Who cannot ignore unknown calls</em>')}
      <div class="customer-layout">
        <div class="first-customer">
          <span class="kicker">FIRST PILOT · DALLAS AREA · IPHONE</span>
          <h3>People with useful calls mixed into the noise</h3>
          <p>Consultants, small-business owners, and salaried professionals. Recruit people who regularly receive unfamiliar calls and feel the interruption problem.</p>
          <div class="job"><span>WHY THEY MIGHT PAY</span><b>Fewer distractions</b><i>Useful calls reach them</i><i>Simple personal rules</i></div>
        </div>
        <div class="customer-rings">
          <div class="ring core"><span>10 CONSULTANTS</span><b>New clients and project calls</b><small>Can screening help without losing opportunities?</small></div>
          <div class="ring middle"><span>10 SMALL-BUSINESS OWNERS</span><b>Customers, suppliers, and interruptions</b><small>Real-estate agents can participate; they are one example.</small></div>
          <div class="ring outer"><span>10 SALARIED PROFESSIONALS</span><b>Work focus and important personal calls</b><small>Test Personal at $4.99 and Plus at $8.99 per month.</small></div>
        </div>
      </div>
      <div class="why-pay"><b>30 FIRST TESTERS</b><span>Proposed recruitment, not existing customers</span><span>Choose the best audience using paid use and repeat use</span></div>
    </section>`;
  }

  if (p === 4) {
    return `<section class="slide" id="market">
      ${heading(5,'MARKET SIZE','64.9 million potential users<br><em>A focused U.S. professional market</em>',button('Calculation & sources ↗','market-math','secondary'))}
      <div class="market-grid"><div class="market-bars">
        <div class="market-row tam"><span><b>TAM · TOTAL POTENTIAL MARKET</b><small>64.9M U.S. professionals with smartphones × $74.28 yearly subscription spend</small></span><strong>$4.82B<small>/ year</small></strong></div>
        <div class="market-row sam"><span><b>SAM · INITIAL SERVICEABLE MARKET</b><small>16.2M estimated users: 50% iPhone × 50% supported carrier/setup fit</small></span><strong>$1.21B<small>/ year</small></strong></div>
        <div class="market-row som"><span><b>SOM · YEAR-3 CUSTOMER TARGET</b><small>15,000 paying users × $74.28 per year; about 0.09% of estimated SAM</small></span><strong>$1.11M<small>yearly run rate</small></strong></div>
      </div><div class="market-math"><span class="kicker">THE CALCULATION</span>
        <div><strong>71.338M</strong><span>U.S. management and professional workers, BLS 2025</span></div>
        <div><strong>× 91%</strong><span>smartphone ownership proxy, Pew 2025 → 64.9M</span></div>
        <div><strong>× 25%</strong><span>50% iPhone × 50% service fit assumptions → 16.2M</span></div>
        <div><strong>$6.19</strong><span>average monthly price: 70% at $4.99 + 30% at $8.99</span></div>
        <p>$6.19 × 12 = $74.28 per year. These are market capacity estimates, not current sales or measured willingness to pay.</p>
      </div></div>
      <p class="market-source"><a href="https://www.bls.gov/cps/cpsaat11b.htm" target="_blank" rel="noopener">BLS occupation count ↗</a> · <a href="https://www.pewresearch.org/internet/fact-sheet/mobile/" target="_blank" rel="noopener">Pew smartphone ownership ↗</a>. The 91% adult rate is a proxy for professionals. The two 50% filters and plan mix are explicit planning assumptions, not survey findings. Dollar market sizes assume full adoption.</p>
    </section>`;
  }
  if (p === 5) {
    return `<section class="slide" id="business-model">
      ${heading(6,'TWO PAID PLANS','Personal $4.99 · Plus $8.99<br><em>More call capacity, more revenue</em>',button('Costs & profit forecast ↗','financials','secondary'))}
      <div class="pricing-grid">${Object.values(plans).map(plan=>`<div class="selected-plan"><span class="kicker">PROPOSED MONTHLY SUBSCRIPTION</span><h3>${plan.name}</h3><strong>$${plan.price.toFixed(2)}<small>/ month</small></strong><p>${plan.audience}</p><p><b>${plan.minutes} managed call minutes per month</b></p><p>Two-question screening, personal caller rules, and delivery to the app.</p><small>Estimated average service cost: $${plan.cost.toFixed(2)} per user, including platform fees.</small></div>`).join('')}</div>
      <div class="why-pay"><b>30-DAY FREE TRIAL</b><span>10 managed minutes</span><span>Plus offers 3× the included minutes</span><span>Proposed allowances; billing and limits still to be built</span></div>
      <div class="profit-callout"><strong>70% Personal + 30% Plus = $6.19 per paying user each month</strong><span>At 1,000 users: $6,190 monthly sales versus $4,990 if everyone chose Personal. That is $1,200 more revenue, with higher service costs.</span></div>
      <p class="bottom-note">Managed minutes include screening and connected call time. Warn before the allowance is used; require an upgrade or guided forwarding pause, with no surprise charges. The base forecast reaches first monthly operating profit in month ${model.firstProfitMonth} at ${number(model.firstProfitUsers)} paid users. These proposed prices and the forecast cover inbound usage only. Outbound packaging and costs remain to be modeled; billing is not launch-ready.</p>
    </section>`;
  }
  if (p === 6) {
    return `<section class="slide" id="competition">
      ${heading(7,'INBOUND / OUTBOUND LANDSCAPE','One assistant, both directions<br><em>Screen incoming. Act on approved requests.</em>',button('Full study, scale & sources ↗','competitor-study','secondary'))}
      <div class="table-scroll"><table class="study-table"><thead><tr><th>Provider / offering</th><th>Inbound · calls to you</th><th>Outbound · calls for you</th></tr></thead><tbody>
        <tr><td>Apple / Google</td><td>Built-in call screening</td><td>Broader tools vary; screening is the offer compared here</td></tr>
        <tr><td>Truecaller / Hiya</td><td>Caller ID and protection; Truecaller Assistant screens</td><td>Outbound task completion is not the reviewed core offer</td></tr>
        <tr><td>Wajo</td><td>Broad workflows; personal screening not established in reviewed material</td><td>Calls and coordinates to complete tasks</td></tr>
        <tr><td>Poka</td><td>Personal inbound screening not established in reviewed material</td><td>AI calls, reservations, and follow-ups</td></tr>
        <tr class="hello-row"><td>HelloShield · implemented</td><td>Personal rules, two questions, useful human calls through</td><td>Ovi appointment requests and approved spoken request delivery; external proof pending</td></tr>
        <tr class="hello-row"><td>HelloShield · future expansion</td><td>Extend the personal call workflow</td><td>Pizza ordering and broader merchant tasks · proposed, not implemented</td></tr>
      </tbody></table></div>
      <div class="future"><b>Why both directions?</b><span>Incoming calls compete for attention; outgoing requests take time. HelloShield combines screening with authorized appointment calls and outcome reporting.</span></div>
      <p class="bottom-note">Positioning to validate: personal rules, explicit authorization, and clear outcomes across both call directions. This is not a proven exclusive advantage. Outbound implementation does not mean live readiness. The current forecast models inbound plans only; outbound pricing and costs need a separate model.</p>
    </section>`;
  }
  if (p === 7) {
    return `<section class="slide" id="validation">
      ${heading(8,'CUSTOMER GROWTH & PROFIT','1,000 paid users in year one<br><em>A five-year plan with measurable costs</em>',button('Acquisition plan ↗','growth-plan','secondary'))}
      <div class="rollout-grid"><div class="launch-thesis"><span class="kicker">START IN DALLAS · SCALE U.S. IPHONE</span><h3>Reach, trial, pay, stay</h3>
        <div class="free-funnel"><div><b>Months 1–2</b><span>30–50 free pilot users; no paid revenue assumed.</span></div><div><b>Year one</b><span>Founder demos and professional groups. 10 community partners × 40 qualified trials each month is a target, not signed distribution.</span></div><div><b>After paid retention is proven</b><span>Target 50% of new subscribers from partners, 30% referrals, and 20% measured paid campaigns.</span></div></div>
        <small>Model: 25% of trials pay, 2% of paid users cancel monthly, $20 per new subscriber including trial delivery and acquisition. None is measured yet.</small>
      </div><div class="economics"><span class="kicker">BASE SCENARIO · MONTHS FROM FUNDED LAUNCH PROGRAM</span>
        <table class="forecast-table"><thead><tr><th>Month</th><th>Paid users<br>at month end</th><th>Sales<br>in month</th><th>Operating<br>profit / loss</th></tr></thead><tbody>${[12,24,36,48,60].map(n=>{const r=model.months[n-1];return `<tr><td>${n}</td><td>${number(r.users)}</td><td>${money(r.revenue)}</td><td class="${r.profit>=0?'gain':'loss'}">${money(r.profit)}</td></tr>`}).join('')}</tbody></table>
        <div class="profit-callout"><strong>First monthly profit: month ${model.firstProfitMonth}</strong><span>${number(model.firstProfitUsers)} paying users; about ${money(model.months[model.firstProfitMonth-1].profit)} operating profit in that month.</span></div>
        <small>Includes service costs, acquisition, and $55K fixed monthly bills. Sales use average active users within each month. Profit is before corporate tax, financing, and noncash charges. Year 5 as a whole still makes a loss; prior losses are not recovered.</small>
      </div></div>
      <p class="bottom-note">Growth targets rise to 5,000 paid users in year 2, 15,000 in year 3, 30,000 in year 4, and 50,000 in year 5. Stop expanding a channel if costs, retention, or call reliability miss the plan.</p>
    </section>`;
  }
  if (p === 8) {
    return `<section class="slide" id="team">
      ${heading(9, 'TEAM & EXECUTION', 'Cloud, engineering, and telecom<br><em>Experience behind the product</em>')}
      <div class="team-layout">
        <div class="founder"><span class="founder-mark">AK</span><div><span class="kicker">FOUNDER & PRODUCT LEAD</span><h3>Abhishek Kaushal</h3><p>19+ years of technology experience, including cloud strategy and engineering management.</p><p><b>Worked at Deloitte.</b><br><b>More than 3 years at T-Mobile in the telecom domain.</b></p></div><div class="diligence"><b>Patent application filed</b><span>A patent application has been filed for HelloShield. Technical scope is not disclosed in this deck; no granted patent is claimed.</span></div></div>
        <div class="capabilities"><span class="kicker">START SMALL · HIRE AGAINST MILESTONES</span>
          ${[['Founder-led launch', 'Own product, pilot recruitment, and delivery.'], ['First engineering hires', 'Prioritize telephony/backend and iOS reliability as funding and workload allow.'], ['Specialist support', 'Use testing, security, and legal specialists where needed.'], ['Growth hire later', 'Add dedicated growth support after users pay and stay.']].map((item,index)=>`<div><i>0${index+1}</i><span><b>${item[0]}</b><small>${item[1]}</small></span></div>`).join('')}
        </div>
      </div>
      <div class="execution-question"><span>BUILD TRUST FIRST</span><b>Finish the app, verify useful calls get through, and prove people choose to keep paying.</b></div>
      <p class="market-source"><a href="${PROFILE}" target="_blank" rel="noopener">Professional profile ↗</a> · Experience from public profile and founder-provided details. Employer names describe work history, not endorsement. Dallas, Texas registration planned.</p>
    </section>`;
  }

  if (p === 9) {
    return `<section class="slide" id="funds">
      ${heading(10,'FUNDING & INVESTOR RETURN','$1.5M now, staged funding later<br><em>Build value, then create options for investor cash</em>',button('Ownership & return examples ↗','valuation','secondary'))}
      <div class="funds-layout"><div class="return-plan"><span class="kicker">FIRST 18 MONTHS · $1.5M BUDGET</span>
        <div><b>01</b><strong>$990,000 fixed operations</strong><span>$55K/month: $45K people + $5K core infrastructure + $5K legal, insurance, and operations</span></div>
        <div><b>02</b><strong>$270,000 usage and customer growth</strong><span>Variable call costs, trials, referrals, and acquisition budget</span></div>
        <div><b>03</b><strong>$240,000 reserve</strong><span>Delays and unexpected expenses</span></div>
        <div class="scale-cases"><span><b>Later funding: plan another $1.5M</b> Start raising in months 18–24. Without new funding or lower spending, modeled cash runs out in month ${model.cashRunsOutMonth}. The five-year model needs about $1.39M extra to preserve the $240K reserve.</span></div>
      </div><div class="return-plan"><span class="kicker">MILESTONES TOWARD INVESTOR RETURNS</span>
        <div><b>1–2</b><strong>Years 1–2: prove demand and build value</strong><span>Target repeat paid use and retention. A higher company value is a potential paper gain, not cash received.</span></div>
        <div><b>18–24</b><strong>Months 18–24: review partial share-sale options</strong><span>A new buyer could purchase a small part of an early investor’s holding alongside a funding round, if demand, terms, and approvals allow.</span></div>
        <div><b>Later</b><strong>Grow toward profit and a larger exit</strong><span>Base model: first monthly operating profit in month ${model.firstProfitMonth}. Explore an acquisition or later share sale as the business matures.</span></div>
        <small>Early cash is an optional buyer-funded share sale, not company repayment. No buyer, payout, or date is secured. Dividends require surplus cash; none is in the base forecast.</small>
      </div></div>
      <p class="bottom-note">Opening proposal: $1.5M for 15% implies $10M after investment and $8.5M before investment. This is a negotiating proposal, not an independent valuation. Future funding may dilute that 15%. Both financing rounds remain to be secured.</p>
    </section>`;
  }

  return `<section class="slide closing" id="invitation">
    <div class="closing-copy">${eyebrow(11,'INVESTOR INVITATION')}
      <h2>Help launch HelloShield<br><em>And prove people will pay</em></h2>
      <p>A personal assistant for inbound screening and authorized outbound appointment calls. Implemented prototype; launch finishing and live verification remain.</p>
      <div class="seed-objective"><span>SEEKING $1.5 MILLION</span><b>18-month plan: finish the app, launch a controlled pilot, and prove repeat paid use.</b></div>
      <div class="contact"><b>Abhishek Kaushal</b><span>Founder & Product Lead · HelloShield</span><span>19+ years in technology, cloud strategy, and engineering management</span><span>Worked at Deloitte · More than 3 years at T-Mobile in telecom</span><span>Patent application filed · Technical scope not disclosed</span><span>Dallas, Texas · Company registration planned</span><a href="${PROFILE}" target="_blank" rel="noopener">Abhishek’s LinkedIn profile ↗</a></div>
    </div>
    <div class="closing-action"><span class="closing-mark">HelloShield</span><h3>Let’s discuss the evidence</h3><p>Product walkthrough, pilot plan, cost assumptions, and proposed investment terms.</p>${linkBtn('Connect with Abhishek ↗',PROFILE,'primary')}${button('Review the $1.5M plan','goto-9','secondary')}${button('How the valuation works','valuation','secondary')}</div>
  </section>`;
}

function render() {
  clearTimeout(demoTimer);
  $('stage').innerHTML = slideHTML(state.page);
  bindInputs();
  syncChrome();
  history.replaceState(null, '', '#' + slides[state.page][0]);
}

function bindInputs() {
  const range = $('minutes');
  if (!range) return;
  range.oninput = event => {
    state.minutes = Number(event.target.value);
    $('minutes-label').textContent = state.minutes;
    range.setAttribute('aria-valuenow', String(state.minutes));
    $('hours').textContent = exposedHours() + 'h';
    $('time-formula').textContent =
      `${state.minutes} min × 5 days × 48 weeks = ${exposedHours()} hours exposed. Illustration only; time saved has not been measured.`;
  };
}

function syncChrome() {
  document.querySelector('.pitch').classList.toggle('on-hero', state.page === 0);
  $('chapter').textContent = slides[state.page][1];
  $('counter').textContent = `${String(state.page + 1).padStart(2, '0')} / ${slides.length}`;
  $('prev').disabled = state.page === 0;
  $('next').disabled = state.page === slides.length - 1;
  document.querySelectorAll('#progress button').forEach((item, index) => {
    item.classList.toggle('active', index === state.page);
    item.setAttribute('aria-current', index === state.page ? 'step' : 'false');
  });
}

function go(page) {
  state.page = Math.max(0, Math.min(slides.length - 1, page));
  state.demoStep = 0;
  state.demoDone = false;
  render();
  $('stage').scrollTop = 0;
}

function runDemo() {
  state.demoStep = 0;
  state.demoDone = false;
  render();
  const advance = () => {
    if (state.page !== 2 || state.demoStep >= 2) {
      state.demoDone = true;
      render();
      return;
    }
    state.demoStep += 1;
    state.demoDone = state.demoStep === 2;
    render();
    if (state.demoStep < 2) demoTimer = setTimeout(advance, 1100);
  };
  demoTimer = setTimeout(advance, 1100);
}

function modal(content) {
  $('detail-body').innerHTML = content;
  if (!$('detail').open) $('detail').showModal();
}

function buildPrintRoot() {
  const saved = { ...state };
  const parts = slides.map((slide, index) => {
    state.page = index;
    state.demoStep = 2;
    state.demoDone = true;
    state.plan = 'basic';
    state.scenario = 'dental';
    state.minutes = 4;
    return `<article class="print-slide">${slideHTML(index)}</article>`;
  });
  Object.assign(state, saved);
  $('print-root').innerHTML = parts.join('');
}

function act(action) {
  if (action.startsWith('goto-')) {
    if ($('detail').open) $('detail').close();
    go(Number(action.slice(5)));
    return;
  }
  if (action.startsWith('demo-')) {
    state.demoStep = Number(action.slice(5));
    state.demoDone = state.demoStep === 2;
    render();
    return;
  }
  if (action === 'run-demo') {
    runDemo();
    return;
  }
  if (action.startsWith('scenario-')) {
    state.scenario = action.slice(9);
    state.demoStep = 0;
    state.demoDone = false;
    render();
    return;
  }
  if (action.startsWith('plan-')) {
    state.plan = action.slice(5);
    render();
    return;
  }
  if (action === 'market-math') {
    modal(`<div class="kicker">MARKET ESTIMATE · SOURCES AND ASSUMPTIONS</div><h2>Every market number, calculated</h2><table><tbody>
      <tr><td>Professional worker base</td><td>71,338,000 · BLS 2025 management, professional, and related occupations</td></tr><tr><td>TAM users</td><td>71,338,000 × 91% smartphone proxy = ${number(model.tamUsers)}</td></tr><tr><td>SAM users</td><td>${number(model.tamUsers)} × 50% iPhone × 50% carrier/setup fit = ${number(model.samUsers)}</td></tr><tr><td>Monthly average price</td><td>70% × $4.99 + 30% × $8.99 = $6.19</td></tr><tr><td>TAM annual capacity</td><td>${number(model.tamUsers)} × $6.19 × 12 = ${money(model.tamValue)}</td></tr><tr><td>SAM annual capacity</td><td>${number(model.samUsers)} × $6.19 × 12 = ${money(model.samValue)}</td></tr><tr><td>Year-3 SOM</td><td>15,000 users × $6.19 × 12 = $1,114,200 yearly run rate</td></tr></tbody></table>
      <p>The occupational population and smartphone ownership proxy come from research. The 50% iPhone share, 50% service-fit filter, 70/30 plan mix, and customer targets are planning assumptions. Service fit covers forwarding compatibility, supported setup, and relevant calling needs; it is not a measured conversion rate. TAM includes future Android expansion. SAM models nationwide U.S. iPhone availability after the Dallas pilot.</p>
      <p>These are potential spending ceilings at full adoption, not a forecast that everyone needs or will buy the app. Smartphone ownership among professionals may differ from the adult-wide survey. BLS includes workers aged 16+, while Pew surveys adults; the multiplication is a proxy, not a matched survey.</p>
      <p class="market-source"><a href="https://www.bls.gov/cps/cpsaat11b.htm" target="_blank" rel="noopener">BLS 2025 Table 11b ↗</a> · <a href="https://www.pewresearch.org/internet/fact-sheet/mobile/" target="_blank" rel="noopener">Pew 2025 mobile fact sheet ↗</a></p>`);return;
  }
  if (action === 'financials') {
    const r=model.months[59];
    modal(`<div class="kicker">BASE CASE · PROPOSED PRICES AND COST ASSUMPTIONS</div><h2>$4.99 Personal + $8.99 Plus</h2>
      <table><thead><tr><th>Per paid user / month</th><th>Personal</th><th>Plus</th></tr></thead><tbody><tr><td>Subscription price</td><td>$4.99</td><td>$8.99</td></tr><tr><td>Platform fee budget (30%)</td><td>$1.497</td><td>$2.697</td></tr><tr><td>Dedicated number</td><td>$1.15</td><td>$1.15</td></tr><tr><td>Voice, AI, variable cloud & buffer</td><td>$0.603</td><td>$1.853</td></tr><tr><td>Average total service cost</td><td>$3.25</td><td>$5.70</td></tr><tr><td>Left for operating bills</td><td>$1.74</td><td>$3.29</td></tr></tbody></table>
      <p>70% Personal / 30% Plus gives $6.19 average sales, $3.985 average service cost, and $2.205 left per user. Costs model average use, not full allowance consumption. Heavy call use can exceed this budget. Proposed allowances and pricing must pass measured pilot costs before launch.</p>
      <p class="market-source"><a href="https://www.twilio.com/en-us/voice/pricing/us" target="_blank" rel="noopener">Twilio U.S. pricing ↗</a>: local number $1.15/month, incoming $0.0085/min, app leg $0.004/min; conferences and speech add costs. <a href="https://developer.apple.com/app-store/subscriptions/" target="_blank" rel="noopener">Apple subscription fees ↗</a>: we budget 30% throughout; eligible reduced fees are upside, not assumed savings. AI/cloud amounts are estimates, not vendor quotes.</p>
      <h3>Month 60: the first positive month in this model</h3><table><tbody><tr><td>Sales from average ${number(r.averageUsers)} active users</td><td>${money(r.revenue)}</td></tr><tr><td>Service costs</td><td>−${money(r.serviceCost)}</td></tr><tr><td>Acquisition and free trials</td><td>−${money(r.acquisition)}</td></tr><tr><td>Fixed bills</td><td>−$55,000</td></tr><tr><td>Operating profit before tax and financing</td><td>${money(r.profit)}</td></tr></tbody></table>
      <p>The model assumes 2% monthly cancellations, 25% trial-to-paid conversion, and $20 per new subscriber including free-trial delivery. Fixed costs stay at $55K/month for all five years; extra hires or infrastructure move profit later. There is no advertising or data-sale revenue in the forecast.</p>
      <h3>How fragile is this result?</h3><p>At $1 more service cost per paid user, or $40 instead of $20 to acquire each new subscriber, there is no profitable month in the five-year model. With growth paused and only canceled users replaced, about ${number(model.replacementBreakEven)} active subscribers cover the modeled fixed bills; growing requires more.</p>
      <p>Month 60 profit does not recover past losses. Year 5 overall is still loss-making. The initial $1.5M plus a proposed later $1.5M round cover the modeled cash trough with a reserve; that later financing is not secured. Revenue is gross subscription sales before platform costs, with sales taxes excluded. Cash is simplified as collected and paid within the month; tax, debt, working-capital delays, and noncash accounting charges require a full finance model.</p>`);return;
  }
  if (action === 'growth-plan') {
    modal(`<div class="kicker">ACQUISITION TARGETS · NOT EXISTING PARTNERSHIPS</div><h2>How the customer base grows</h2><p>Recruit 30–50 testers through founder introductions in Dallas. Observe setup and call outcomes. Then approach professional communities, coworking groups, consultants, and small-business networks with a live demo and a 30-day trial.</p>
      <table><thead><tr><th>Month</th><th>Qualified trials needed</th><th>New paid users</th><th>Cancellations</th><th>Paid users at end</th></tr></thead><tbody>${[12,24,36,48,60].map(n=>{const r=model.months[n-1];return `<tr><td>${n}</td><td>${number(r.trials)}</td><td>${number(r.additions)}</td><td>${number(r.cancellations)}</td><td>${number(r.users)}</td></tr>`}).join('')}</tbody></table>
      <p>Formula: previous paid users − 2% cancellations + new subscribers = ending users. One in four qualified trials becomes paid. A 30-day trial means recruiting each cohort about one month before its paid additions. First two months have no subscription sales. Counts above are rounded.</p>
      <h3>Channels, not an assumed share of competitors</h3><p>Target 50% of additions through communities/partners, 30% from referrals, and 20% from paid campaigns. At month 12 this needs about 334 partner trials, 200 referral trials, and 134 paid-channel trials. Ten active partners bringing 40 trials each could cover that partner target. These are recruitment targets, not signed agreements.</p>
      <p>Budget $20 per converted subscriber: an illustrative $12 for four trials at $3 each, plus $8 blended acquisition spend. If only 20% come from paid ads, that permits $40 ad spend per paid-channel subscriber; referral incentives and partner fees must fit the same blended budget. Validate this before scaling.</p>
      <p>Paid growth gates: reliable call delivery, at least 25% trial conversion, no more than 2% monthly cancellations, and total acquisition cost at or below $20. If missed, revise spend and the forecast. A large competitor audience proves category awareness, not automatic access to those users.</p>`);return;
  }
  if (action === 'competitor-study') {
    modal(`<div class="kicker">COMPETITIVE STUDY · REVIEWED 10 OCTOBER 2026</div><h2>What is different, and what we must prove</h2>
      ${competitors.map(c=>`<h3>${c.name}</h3><p><b>${c.offer}.</b> ${c.scale}. ${c.date}. ${c.learn}</p><p class="market-source"><a href="${c.source}" target="_blank" rel="noopener">Scale / company source ↗</a> · <a href="${c.feature}" target="_blank" rel="noopener">Product source ↗</a></p>`).join('')}
      <h3>What HelloShield can credibly say</h3><p>HelloShield combines inbound screening with Ovi outbound appointment requests: the user authorizes a recipient, a resolved time, and the request; Ovi conveys the spoken request, collects the recipient’s response, and returns the outcome. The outbound implementation is recorded in the development tracker and ongoing deployment work. Status: Implemented; external proof pending. The latest rollout report still requires live call transport, authorization, and a controlled recipient-to-owner outcome test.</p>
      <p>Message delivery here means conveying the approved appointment request by voice. General free-form message delivery needs its own evidence before being presented as verified. Agreement to a time does not prove calendar booking. A completed call does not prove agreement.</p>
      <h3>Future use case: pizza ordering</h3><p>Ovi could eventually place an approved pizza order for delivery. That needs order and spending approval, merchant acceptance, payment safeguards, and fulfillment status. The merchant delivers the pizza. This remains a proposed use case and is outside the current implementation and financial forecast.</p>
      <h3>How the combined offering could stand out</h3><p>Test whether customers value one personal assistant for screening incoming calls and making authorized outbound requests, with explicit decisions and clear results. Truecaller already has screening; Wajo and Poka already support outbound actions. Combining directions is positioning to validate, not proof of exclusivity or superiority. The patent application is filed; technical scope is not disclosed and no granted exclusivity is claimed.</p>
      <p>The $4.99 / $8.99 forecast currently covers inbound call usage. Outbound allowances, pricing, and provider costs must be modeled before selling a combined paid package; no outbound or pizza revenue has been added to the projections.</p>
      <h3>Turn research into a customer-acquisition test</h3><p>Interview 10 native-screening users, 10 Truecaller/Hiya users, and 10 people using no assistant. These are research segments within the initial professional pilot, not extra customers. Compare setup success, important-call misses, interruptions, retention, and willingness to pay. Publish comparisons only with measured evidence and participant permission. Use the strongest result in demos, referral invitations, and community partnerships.</p>
      <p>Apple’s 2.5B and Google’s 3B counts are devices across their ecosystems; screening-specific active users are not disclosed in the cited sources. Truecaller’s 500M+ total and its Q2 471M average excluding iOS are different measures. Hiya’s 550M is protected network reach. Wajo and Poka do not publish a verified active-user count in the reviewed official materials. Downloads, reviews, and ratings are not paying customers.</p>
      <p>Pricing context: Apple/Google screening is built in on supported devices. Truecaller offers paid Premium/Assistant with region-dependent pricing. Wajo lists free tiers and contact-sales Pro. Poka lists in-app subscriptions/credits. HelloShield therefore has to prove enough extra value for $4.99 or $8.99; being cheaper than an assumed competitor price is not the strategy.</p>`);return;
  }
  if (action === 'valuation') {
    modal(`<div class="kicker">OPENING PROPOSAL · SUBJECT TO NEGOTIATION</div><h2>Where does $8.5 million come from?</h2>
      <table><tbody><tr><td>Investment requested</td><td>$1,500,000</td></tr><tr><td>Proposed investor ownership</td><td>15%</td></tr><tr><td>Value after investment</td><td>$1.5M ÷ 15% = $10M</td></tr><tr><td>Value before investment</td><td>$10M − $1.5M = $8.5M</td></tr><tr><td>Existing owners retain</td><td>85%, before other dilution</td></tr></tbody></table>
      <p><b>This calculation does not prove the company is worth $8.5M.</b> It starts with an amount to raise and ownership to offer. A prototype and founder experience support the conversation; paid demand, retention, call reliability, costs, and comparable deals must support an agreed price. Dallas registration alone does not establish value.</p>
      <h3>How an investor could earn a return</h3><p>An investor may sell shares in an acquisition or another permitted share sale. Profit does not automatically mean investors get cash. No dividends or buybacks are budgeted; any later distribution needs sufficient cash, legal approval, and agreement under the investment terms. At months 18–24, review whether a willing new investor could buy a limited portion of an existing investor’s shares alongside the next funding round. The purchase price goes to the selling investor, while the company must separately raise its operating capital. Transfers depend on investment terms, applicable restrictions, and approvals. This is an option to negotiate, not committed liquidity. Example: if $30M were available to common shareholders after debt, transaction costs, and preferences, 15% would receive $4.5M before investor tax. If later funding dilutes that stake to 12%, the same proceeds give $3.6M, or 2.4× a $1.5M investment. Neither the sale value nor the 12% stake is a forecast.</p>
      <h3>Illustration: a small early share sale</h3><p>Assume an investor still owns 15% and a buyer agrees a $15M company equity value before a new round. Selling 10% of that holding (1.5% of the company) would bring $225,000 before fees and tax. The original cost of that portion was $150,000: the illustrative gain is $75,000. The investor retains 13.5% before any new-round dilution. Neither that price nor a buyer is secured; an early sale could also be at a loss.</p>
      <h3>Why not promise repayments from year 2?</h3><p>The base model is still consuming cash then. A revenue-share or company buyback would increase the funding needed, not create profit. A different repayment product would need its own affordable cash-flow model and negotiated terms. Company profit, rising share value, and cash paid to an investor are three separate outcomes.</p>
      <h3>If the business fails</h3><p>Equity investors can lose all their investment; it is not a guaranteed loan repayment. Company funds and available assets cover obligations according to applicable law and contracts. Personal guarantees or other legal obligations can create personal exposure. Financing and wind-down terms need legal review.</p>
      <p class="market-source"><a href="https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/private" target="_blank" rel="noopener">SEC guidance on private-investment risk ↗</a></p>
      <p class="note">This is a priced-equity illustration. A SAFE valuation cap would not guarantee these ownership percentages; conversion, later fundraising, and an employee option pool can change ownership.</p>`);
  }

}

document.addEventListener('click', event => {
  const target = event.target.closest('[data-action]');
  if (target) act(target.dataset.action);
});

$('prev').onclick = () => go(state.page - 1);
$('next').onclick = () => go(state.page + 1);
$('fullscreen').onclick = () =>
  document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {});
$('print-deck').onclick = () => {
  buildPrintRoot();
  window.print();
};
$('sections').onclick = () => {
  $('sections').setAttribute('aria-expanded', 'true');
  modal(`<div class="kicker">EXPLORE THE DECK</div><h2>Sections</h2><div class="menu">${
    slides.map((slide, index) => button(`${String(index + 1).padStart(2, '0')} · ${slide[1]}`, 'goto-' + index)).join('')
  }</div>`);
};
$('detail').querySelector('.close').onclick = () => $('detail').close();
$('detail').addEventListener('close', () => $('sections').setAttribute('aria-expanded', 'false'));
document.addEventListener('keydown', event => {
  if ($('detail').open || event.target.matches('input,textarea')) return;
  if (event.key === 'ArrowRight') go(state.page + 1);
  if (event.key === 'ArrowLeft') go(state.page - 1);
});

slides.forEach((slide, index) => {
  const item = document.createElement('button');
  item.type = 'button';
  item.setAttribute('aria-label', `Slide ${index + 1}: ${slide[1]}`);
  item.onclick = () => go(index);
  $('progress').append(item);
});

const storedRef = sessionStorage.getItem('hs-v3-ref');
const securityRef = storedRef || `HS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
sessionStorage.setItem('hs-v3-ref', securityRef);
$('security-ref').textContent = securityRef;

window.addEventListener('beforeprint', buildPrintRoot);

function fromHash() {
  const index = slides.findIndex(slide => slide[0] === location.hash.slice(1));
  state.page = index < 0 ? 0 : index;
  render();
}

window.addEventListener('hashchange', fromHash);
fromHash();
