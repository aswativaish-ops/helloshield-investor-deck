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

const plans = {
  free: { name: 'Try it', price: '$0', period: '/ first 30 days' },
  basic: { name: 'Personal', price: '$4.99', period: '/ month · proposed' }
};

const demos = {
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
        <p class="hero-tag">A personal call-screening app for busy people who cannot miss useful calls.</p>
        <p class="hero-rules">Ask who. Ask why. Let useful calls reach you.</p>
        <div class="hero-actions">${button('See the product ↗', 'goto-2', 'primary')}${button('Meet the first customer', 'goto-3', 'secondary')}</div>
        <div class="founder-line"><b>Abhishek Kaushal</b><span>Founder & Product Lead</span></div>
      </div>
    </section>`;
  }

  if (p === 1) {
    return `<section class="slide" id="problem">
      ${heading(2, 'THE PROBLEM', 'Every call asks for attention<br><em>Only some deserve it</em>')}
      <div class="problem-grid">
        <div class="problem-copy">
          <p class="lead">A busy professional is in a meeting. An unknown number could be a new client, a medical office, or spam.</p>
          <div class="choice"><span>ANSWER</span><strong>Interrupt the work in front of you</strong></div>
          <div class="choice"><span>IGNORE</span><strong>Risk missing a useful call</strong></div>
          <p class="takeaway">HelloShield aims to reduce unwanted interruptions while keeping useful human calls reachable.</p>
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
      ['uncertain', 'Unclear caller']
    ];
    return `<section class="slide" id="product">
      ${heading(3, 'THE PRODUCT', 'Two questions before the ring<br><em>You keep the final choice</em>', `<span class="status">INTERACTIVE PROTOTYPE</span>`)}
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
      <p class="bottom-note">Illustrative demo, not a live call. Prototype exists; launch finishing and device verification remain. Voicemail audio is not production-ready. Broader assistant features require separate validation.</p>
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
          <div class="ring outer"><span>10 SALARIED PROFESSIONALS</span><b>Work focus and important personal calls</b><small>Test whether the benefit is worth $4.99 each month.</small></div>
        </div>
      </div>
      <div class="why-pay"><b>30 FIRST TESTERS</b><span>Proposed recruitment, not existing customers</span><span>Choose the best audience using paid use and repeat use</span></div>
    </section>`;
  }

  if (p === 4) {
    return `<section class="slide" id="market">
      ${heading(5, 'MARKET OPPORTUNITY', 'Start with a clear audience<br><em>Earn the right to expand</em>')}
      <div class="market-grid">
        <div class="market-bars">
          <div class="market-row tam"><span><b>TAM · EVERYONE WHO COULD BUY</b><small>U.S. adults who need personal call screening. The paying population still needs research.</small></span><strong>To size</strong></div>
          <div class="market-row sam"><span><b>SAM · PEOPLE WE CAN SERVE</b><small>Initially U.S. iPhone professionals with compatible carrier forwarding, supported calling needs, and willingness to pay.</small></span><strong>To test</strong></div>
          <div class="market-row som"><span><b>SOM · PEOPLE WE CAN WIN</b><small>Begin with 30 pilot testers. A year-one goal of 500–1,000 paying users needs evidence from this pilot.</small></span><strong>Start small</strong></div>
        </div>
        <div class="market-math">
          <span class="kicker">SIMPLE REVENUE MATH · NOT A MARKET ESTIMATE</span>
          <div><strong>$4.99</strong><span>proposed monthly subscription</span></div>
          <div><strong>× 12</strong><span>= $59.88 per paying user for a full year</span></div>
          <div><strong>1,000</strong><span>paying users = $4,990 a month</span></div>
          <div><strong>× 12</strong><span>= $59,880 yearly run rate, before costs</span></div>
          <p>Validate audience size, phone compatibility, and demand before quoting a dollar TAM or SAM.</p>
        </div>
      </div>
      <p class="bottom-note">TAM = total available market. SAM = serviceable available market. SOM = serviceable obtainable market. A yearly run rate assumes the same monthly revenue for 12 months; it is not money already earned.</p>
    </section>`;
  }

  if (p === 5) {
    const plan = plans[state.plan];
    const paid = state.plan === 'basic';
    return `<section class="slide" id="business-model">
      ${heading(6, 'HOW WE EARN', 'Try it free for 30 days<br><em>Test a $4.99 monthly plan</em>', button('Profit & growth math ↗', 'financials', 'secondary'))}
      <div class="plan-strip" role="tablist" aria-label="Proposed plans">${Object.keys(plans).map(key =>
        button(`${plans[key].name}<small>${plans[key].price}</small>`, 'plan-' + key, state.plan === key ? 'selected' : '', tabAttrs(state.plan === key))
      ).join('')}</div>
      <div class="model-grid">
        <div class="selected-plan">
          <span class="kicker">PROPOSED · NOT LIVE PRICING</span><h3>${plan.name}</h3><strong>${plan.price}<small>${plan.period}</small></strong>
          <p>Personal call screening and caller rules.</p><p>Set usage limits after measuring real call costs. No unlimited-use promise.</p>
        </div>
        <div class="economics">
          <span class="kicker">${paid ? 'ILLUSTRATIVE MONTHLY COST PER PAYING USER' : 'LEARN FIRST, THEN ASK PEOPLE TO PAY'}</span>
          ${paid ? `<div class="bridge"><div><span>USER PAYS</span><b>$4.99</b></div><i>less</i><div><span>USAGE + FEES</span><b>$2.00</b></div><i>equals</i><div><span>LEFT FOR BILLS</span><b>$2.99</b></div></div>
          <div class="profit-callout"><strong>23,412 paying users</strong><span>to cover $70,000 of fixed monthly costs in this example.</span></div>
          <p class="cost-line">$70,000 ÷ $2.99, rounded up. The $2 includes assumed call, cloud, AI, and payment/platform costs per user; it is not a vendor quote. This is before tax and financing costs.</p>` : `<div class="free-funnel"><div><b>First 30 days</b><span>Use the pilot and measure useful calls, missed calls, and actual costs.</span></div><div><b>After the trial</b><span>Offer the proposed $4.99 plan and measure who chooses to pay.</span></div><div><b>First 1–2 launch months</b><span>Budget for no subscription revenue. Trial use still costs the company money.</span></div></div>`}
        </div>
      </div>
      <p class="bottom-note">No reliable profit date yet. At 7,000 paying users, monthly revenue would be $34,930—below the example fixed costs even before serving those users.</p>
    </section>`;
  }

  if (p === 6) {
    return `<section class="slide" id="competition">
      ${heading(7, 'WHY CHOOSE HELLOSHIELD?', 'Free screening already exists<br><em>We must prove a better experience</em>')}
      <div class="problem-grid">
        <div class="problem-copy"><span class="kicker">WHAT CUSTOMERS ALREADY HAVE</span><h3>Apple and Google screen calls</h3><p>Apple can ask an unknown caller why they are calling. Google offers Call Screen on supported phones.</p><p>Asking who and why is not exclusive to HelloShield.</p><p class="market-source"><a href="https://support.apple.com/en-euro/111106" target="_blank" rel="noopener">Apple source ↗</a> · <a href="https://support.google.com/phoneapp/answer/9118387" target="_blank" rel="noopener">Google source ↗</a></p></div>
        <div class="problem-copy"><span class="kicker">THE DIFFERENCE WE WILL TEST</span><h3>A personal service worth keeping</h3><div class="choice"><span>CONTROL</span><strong>Clear trusted and blocked caller rules</strong></div><div class="choice"><span>CARE</span><strong>Useful human calls still reach you</strong></div><div class="choice"><span>SUPPORT</span><strong>Guided setup and understandable results</strong></div></div>
      </div>
      <div class="future"><b>Proof before scale</b><span>Compare HelloShield with each tester’s existing phone features. Measure setup success, call reliability, repeat use, and willingness to pay.</span></div>
      <p class="bottom-note">These are proposed reasons to choose HelloShield, not a proven competitive advantage. Availability of native features varies by device and region. Broader assistant features follow only after the core service works.</p>
    </section>`;
  }

  if (p === 7) {
    return `<section class="slide" id="validation">
      ${heading(8, 'GO-TO-MARKET', 'Win the first 30 people<br><em>Then grow through proof and referrals</em>')}
      <div class="rollout-grid">
        <div class="launch-thesis"><span class="kicker">DALLAS FIRST · FOUNDER-LED</span><h3>Show the app. Help people set it up.</h3><p>Recruit through personal introductions, local professional groups, and small-business communities. Offer a short demo and guided onboarding.</p><div class="stage-label"><b>Current stage</b><span>Prototype; launch finishing required</span></div><small>No verified paying customers or recurring revenue reported. Internal development and support roles are not customer traction.</small></div>
        <div class="phases">
          <div><i>01</i><span><b>Before launch · finish and verify</b><small>Complete real-device call checks, carrier onboarding, privacy review, and launch requirements.</small></span></div>
          <div><i>02</i><span><b>First 1–2 months · 30–50 pilot users</b><small>Offer a free trial. Track call outcomes, setup problems, weekly use, and cost per user.</small></span></div>
          <div><i>03</i><span><b>After the trial · test paid demand</b><small>Ask users to choose the $4.99 plan. Interview those who decline. Seek at least 10 paying pilot users as an initial decision point.</small></span></div>
          <div><i>04</i><span><b>After repeat use · grow carefully</b><small>Test referrals and small channel experiments. Delay broad paid advertising, Android, and international expansion until the first market works.</small></span></div>
        </div>
      </div>
      <div class="evidence-gates"><b>EXPAND IF</b><span>Users pay, stay, and cost less to serve than they pay</span><b>PAUSE IF</b><span>Critical call/privacy failures or weak paid demand</span><b>MEASURE</b><span>Conversion, cancellations, call quality, and actual costs</span></div>
    </section>`;
  }

  if (p === 8) {
    return `<section class="slide" id="team">
      ${heading(9, 'TEAM & EXECUTION', 'Cloud, engineering, and telecom<br><em>Experience behind the product</em>')}
      <div class="team-layout">
        <div class="founder"><span class="founder-mark">AK</span><div><span class="kicker">FOUNDER & PRODUCT LEAD</span><h3>Abhishek Kaushal</h3><p>19+ years of technology experience, including cloud strategy and engineering management.</p><p><b>Worked at Deloitte.</b><br><b>More than 3 years at T-Mobile in the telecom domain.</b></p></div><div class="diligence"><b>Why this experience matters</b><span>Relevant background for building a reliable call service, managing cloud costs, and leading engineering delivery.</span></div></div>
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
      ${heading(10, 'THE FUNDING PROPOSAL', '$1.5 million for 18 months<br><em>Finish, launch, and prove paid demand</em>', button('Valuation & investor return ↗', 'valuation', 'secondary'))}
      <div class="funds-layout"><div class="fund-bars">
        ${[['$900,000','People: staged hires, founder, and delivery support',60],['$210,000','Cloud, AI, telephony, and service usage',14],['$90,000','Pilot recruitment and measured growth experiments',6],['$60,000','Legal, security, insurance, and basic operations',4],['$240,000','Reserve for delays and unexpected costs',16]].map(item=>`<div><span><b>${item[0]}</b><small>${item[1]}</small></span><i style="--w:${item[2]}%"></i><em>${item[2]}%</em></div>`).join('')}
      </div><div class="return-plan"><span class="kicker">PROPOSED CASH BUDGET · NOT CURRENT SPENDING</span>
        <div><b>18</b><strong>$70,000 per month × 18</strong><span>$1,260,000 planned spending, including service usage</span></div>
        <div><b>+</b><strong>$240,000 reserve</strong><span>Build in a buffer; review spending every month</span></div>
        <div><b>=</b><strong>$1,500,000 requested</strong><span>Plan assumes no revenue is needed to fund these 18 months</span></div>
        <div class="scale-cases"><span><b>Earlier $100K–$170K/month estimate</b> described spending, not sales. At that pace, $1.5M lasts only about 9–15 months before a separate reserve.</span></div>
        <small>Lean proposal requires staged hiring and lower cloud spending. Validate supplier quotes, benefits, taxes, usage, and legal costs before committing.</small>
      </div></div>
      <p class="bottom-note"><b>Opening ownership proposal:</b> $1.5M for 15% implies $10M after investment and $8.5M before investment. This is negotiation math, not an independently established valuation.</p>
    </section>`;
  }

  return `<section class="slide closing" id="invitation">
    <div class="closing-copy">${eyebrow(11,'INVESTOR INVITATION')}
      <h2>Help launch HelloShield<br><em>And prove people will pay</em></h2>
      <p>A personal call-screening app for busy professionals. The prototype is ready for further finishing and validation.</p>
      <div class="seed-objective"><span>SEEKING $1.5 MILLION</span><b>18-month plan: finish the app, launch a controlled pilot, and prove repeat paid use.</b></div>
      <div class="contact"><b>Abhishek Kaushal</b><span>Founder & Product Lead · HelloShield</span><span>19+ years in technology, cloud strategy, and engineering management</span><span>Worked at Deloitte · More than 3 years at T-Mobile in telecom</span><span>Dallas, Texas · Company registration planned</span><a href="${PROFILE}" target="_blank" rel="noopener">Abhishek’s LinkedIn profile ↗</a></div>
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
  if (action === 'financials') {
    modal(`<div class="kicker">ILLUSTRATIVE PLANNING · NOT A FORECAST</div><h2>When could HelloShield make a profit?</h2>
      <p>When subscription income covers both the cost of serving users and the company’s other bills. There is no reliable date yet.</p>
      <table><thead><tr><th>Planning point</th><th>Paying users</th><th>Monthly revenue at $4.99</th><th>Yearly run rate</th></tr></thead><tbody>
      ${[["Month 6",100],["Month 12 · low",500],["Month 12 · high",1000],["Year 2",3000],["Year 3",7000]].map(([period,users])=>`<tr><td>${period}</td><td>${users.toLocaleString('en-US')}</td><td>$${(users*4.99).toLocaleString('en-US',{maximumFractionDigits:0})}</td><td>$${(users*4.99*12).toLocaleString('en-US',{maximumFractionDigits:0})}</td></tr>`).join('')}
      </tbody></table><p class="note">These are illustrative targets, not evidence-based predictions. Yearly run rate means monthly revenue × 12; actual yearly sales depend on when people join and leave.</p>
      <h3>Cost changes the number of users needed</h3><table><thead><tr><th>Monthly cost per paid user</th><th>Left from $4.99</th><th>Users to cover $70K fixed bills</th></tr></thead><tbody>
      ${[2,3,4].map(cost=>`<tr><td>$${cost.toFixed(2)}</td><td>$${(4.99-cost).toFixed(2)}</td><td>${Math.ceil(70000/(4.99-cost)).toLocaleString('en-US')}</td></tr>`).join('')}
      </tbody></table><p class="note">This sensitivity assumes $70K of fixed costs PLUS per-user costs. The funding slide instead budgets $70K TOTAL monthly spending, including usage. They are different assumptions. Real break-even needs a measured fixed/variable cost split, trial costs, platform fees, and acquisition spending. No profit is implied by the growth targets.</p>
      <p class="note">MRR simply means recurring subscription income per month. $15K–$30K a month × 12 = $180K–$360K yearly run rate. Those are examples, not HelloShield’s current income.</p>`);
    return;
  }
  if (action === 'valuation') {
    modal(`<div class="kicker">OPENING PROPOSAL · SUBJECT TO NEGOTIATION</div><h2>Where does $8.5 million come from?</h2>
      <table><tbody><tr><td>Investment requested</td><td>$1,500,000</td></tr><tr><td>Proposed investor ownership</td><td>15%</td></tr><tr><td>Value after investment</td><td>$1.5M ÷ 15% = $10M</td></tr><tr><td>Value before investment</td><td>$10M − $1.5M = $8.5M</td></tr><tr><td>Existing owners retain</td><td>85%, before other dilution</td></tr></tbody></table>
      <p><b>This calculation does not prove the company is worth $8.5M.</b> It starts with an amount to raise and ownership to offer. A prototype and founder experience support the conversation; paid demand, retention, call reliability, costs, and comparable deals must support an agreed price. Dallas registration alone does not establish value.</p>
      <h3>How an investor could earn a return</h3><p>An investor may sell shares in an acquisition or another permitted share sale. Profit does not automatically mean investors get cash. Example only: 15% of a $30M sale is $4.5M before dilution, debt, fees, taxes, and share preferences. A sale and its timing are not guaranteed.</p>
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
