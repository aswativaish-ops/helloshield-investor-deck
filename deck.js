const $ = id => document.getElementById(id);
const slides = [
  ['vision', 'The vision'],
  ['problem', 'The problem'],
  ['product', 'The product'],
  ['customer', 'The first customer'],
  ['market', 'Market opportunity'],
  ['business-model', 'Business model'],
  ['competition', 'Competition & moat'],
  ['validation', 'Rollout strategy'],
  ['team', 'Team & execution'],
  ['funds', 'The $5M plan'],
  ['invitation', 'Investor invitation']
];

const MAIL = 'a.swativaish@gmail.com';
const MAIL_DEEP = `mailto:${MAIL}?subject=${encodeURIComponent('HelloShield investor deep dive')}&body=${encodeURIComponent('Hi Swati,\n\nI would like a 30-minute product deep dive and access to the HelloShield data room.\n\nName:\nFirm:\nPreferred times:\n\n')}`;
const MAIL_ROOM = `mailto:${MAIL}?subject=${encodeURIComponent('HelloShield data room request')}&body=${encodeURIComponent('Hi Swati,\n\nPlease send data-room access for HelloShield (product demo, cost model, and validation plan).\n\n')}`;

const state = {
  page: 0,
  minutes: 4,
  demoStep: 0,
  demoDone: false,
  plan: 'plus',
  scenario: 'dental'
};

let demoTimer;

const plans = {
  free: {
    name: 'Free', price: '$0', kind: 'trial', period: '/ 1 month only',
    value: 'One-month inbound screening trial', detail: 'Then choose Basic, Plus, or Pro to continue',
    allow: '20 inbound minutes · 1 saved rule · no outbound tasks · expires after 30 days',
    overage: 'Hard cap; pick a paid plan to continue',
    arpu: '$0', cost: '≤ $1.20 subsidy', profit: '—', margin: 'n/a',
    cac: 'Not a paid CAC', payback: 'n/a', ratio: 'n/a',
    formula: 'Free is a 30-day trial only. It is not a standing free tier. After the month, the user selects Basic, Plus, or Pro.'
  },
  basic: {
    name: 'Basic', price: '$8.99', kind: 'paid', period: '/ month',
    value: 'Inbound screening', detail: 'Saved personal rules',
    allow: '120 inbound minutes / month',
    overage: '$0.08 / extra inbound minute (proposed)',
    arpu: '$8.99', cost: '$2.70', profit: '$6.29', margin: '70%',
    cac: '$36', payback: '5.7 mo', ratio: '5.8×',
    formula: 'LTV $209.67 = $6.29 GP ÷ 3% churn. $209.67 ÷ $36 CAC = 5.8×. Payback $36 ÷ $6.29 = 5.7 months.'
  },
  plus: {
    name: 'Plus', price: '$14.99', kind: 'paid', period: '/ month',
    value: 'Inbound + approved outbound tasks', detail: 'Calendar coordination (roadmap)',
    allow: '180 inbound minutes + 20 outbound tasks / month',
    overage: '$0.08 / min inbound · $0.25 / extra outbound task (proposed)',
    arpu: '$14.99', cost: '$4.50', profit: '$10.49', margin: '70%',
    cac: '$55', payback: '5.2 mo', ratio: '6.4×',
    formula: 'Plus sticker is $14.99. Blended paid ARPU of $13.59 is the 40/40/20 mix, not the Plus price. LTV $349.67 = $10.49 ÷ 3%. $349.67 ÷ $55 = 6.4×. Payback 5.2 months.'
  },
  pro: {
    name: 'Pro', price: '$19.99', kind: 'paid', period: '/ month',
    value: 'Higher recurring-task capacity', detail: 'Same workflow, more allowance',
    allow: '300 inbound minutes + 50 outbound tasks / month',
    overage: '$0.08 / min inbound · $0.25 / extra outbound task (proposed)',
    arpu: '$19.99', cost: '$6.00', profit: '$13.99', margin: '70%',
    cac: '$70', payback: '5.0 mo', ratio: '6.7×',
    formula: 'LTV $466.33 = $13.99 GP ÷ 3% churn. $466.33 ÷ $70 CAC = 6.7×. Payback $70 ÷ $13.99 = 5.0 months.'
  }
};

const demos = {
  dental: {
    photo: '', initials: 'BD', kind: 'INBOUND CALL',
    caller: 'BrightSmile Dental', desk: 'Appointment desk',
    context: 'In a showing until 3:45 PM',
    permissions: ['✓ Scheduling allowed', '× No payment authority'],
    steps: [
      ['Identify intent', 'Existing appointment change'],
      ['Apply your rules', 'Offer a callback after 3:45 PM'],
      ['Complete the next step', 'Write the callback and reminder']
    ],
    speech: [
      '“Is this about an existing BrightSmile appointment?”',
      '“I can arrange a callback after 3:45. Does 4 PM work?”',
      '“Confirmed. I’ll add the callback and remind you.”'
    ],
    artifact: {
      kicker: 'POST-CALL ARTIFACT',
      title: 'Calendar hold · 4:00 PM callback',
      body: 'BrightSmile Dental · appointment change · no payment taken · reminder queued after 3:45 PM.'
    }
  },
  home: {
    photo: 'house-phone', initials: 'RH', kind: 'INBOUND CALL',
    caller: 'River Homes', desk: 'Buyer desk',
    context: 'Up to $1M · chosen area · no ranch homes',
    permissions: ['✓ Matching listings allowed', '× No ranch homes'],
    steps: [
      ['Identify the offer', 'Home in your saved range'],
      ['Apply your rules', 'Budget, area, and home style'],
      ['Complete the next step', 'Notify you; offer a viewing']
    ],
    speech: [
      '“Is this a listing in the saved search area?”',
      '“Two-story, $990K, within budget. Not a ranch home.”',
      '“A match. I’ll notify you and offer to arrange a viewing.”'
    ],
    artifact: {
      kicker: 'POST-CALL ARTIFACT',
      title: 'Listing summary saved',
      body: '$990K · two-story · in-area · viewing offer held for you. Ranch listings remain excluded.'
    }
  },
  pizza: {
    photo: 'pizza-phone', initials: 'SP', kind: 'OUTBOUND TASK',
    caller: 'Sunny Pizza', desk: 'Order desk · user-initiated',
    context: 'Usual Friday order · delivery allowed',
    permissions: ['✓ Repeat order allowed', '× No substitutions over $5'],
    steps: [
      ['Confirm the routine', 'Saved Friday order, not an inbound sales call'],
      ['Apply your rules', 'Same items, budget, and address'],
      ['Execute outbound', 'Place the order and return the ETA']
    ],
    speech: [
      '“Placing the saved Friday order with Sunny Pizza now.”',
      '“Same items, under the saved budget, to the approved address.”',
      '“Order placed. Delivery is on the way; ETA is 30 minutes.”'
    ],
    artifact: {
      kicker: 'POST-CALL ARTIFACT',
      title: 'Order confirmation',
      body: 'Sunny Pizza · usual items · no substitution · ETA 30 min · receipt stored in activity.'
    }
  },
  ambiguous: {
    photo: '', initials: 'UN', kind: 'AMBIGUOUS CALL',
    caller: 'Unknown caller', desk: 'Payment / credential request',
    context: 'No payment or credential authority',
    permissions: ['× No payment authority', '× No credential sharing'],
    steps: [
      ['Detect the ask', 'Card, code, or password requested'],
      ['Refuse execution', 'OVI cannot send money or secrets'],
      ['Escalate to you', 'Hold the call and log the request']
    ],
    speech: [
      '“They’re asking for a card number and a one-time code.”',
      '“I can’t complete payments or share credentials.”',
      '“Held for you. Nothing was sent. Verification log saved.”'
    ],
    artifact: {
      kicker: 'SAFETY ARTIFACT',
      title: 'Escalated · no transaction',
      body: 'Caller asked for payment credentials. Autonomous execution blocked. You decide whether to take the call.'
    }
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
const netHours = () => Math.round(exposedHours() * 0.75);

function tabAttrs(selected) {
  return `role="tab" aria-selected="${selected}" aria-pressed="${selected}"`;
}

function slideHTML(p) {
  if (p === 0) {
    return `<section class="slide hero" id="vision">
      <img class="hero-image" src="assets/hero.jpg" alt="">
      <div class="hero-shade"></div>
      <div class="hero-copy">
        <h1>Meet “OVI”<br><em>Your AI Personal Secretary</em></h1>
        <p class="hero-tag">An AI phone secretary that screens calls and executes approved follow-up workflows.</p>
        <p class="hero-rules">Screen the call. Apply your rules. Complete the next permitted step.</p>
        <div class="hero-actions">${button('See the product ↗', 'goto-2', 'primary')}${button('Meet the first customer', 'goto-3', 'secondary')}</div>
        <div class="founder-line"><b>Swati Vaish</b><span>Founder & Product Lead</span></div>
      </div>
    </section>`;
  }

  if (p === 1) {
    return `<section class="slide" id="problem">
      ${heading(2, 'THE PROBLEM', 'Every call asks for attention<br><em>Only some deserve it</em>')}
      <div class="problem-grid">
        <div class="problem-copy">
          <p class="lead">A realtor on a showing gets a spam sales call while an urgent client offer is still open.</p>
          <div class="choice"><span>ANSWER</span><strong>Break the client conversation</strong></div>
          <div class="choice"><span>IGNORE</span><strong>Risk missing the next qualified buyer</strong></div>
          <p class="takeaway">High-friction example: unknown spam interrupts live deal coordination. The job is not “answer every call.” It is keep the expensive calls and park the rest.</p>
        </div>
        <div class="attention-calc">
          <span class="kicker">ILLUSTRATIVE INTERRUPTION LOAD</span>
          <strong id="hours">${exposedHours()}h</strong>
          <p>Annual time exposed to call interruptions</p>
          <label for="minutes">Minutes exposed each weekday <output id="minutes-label">${state.minutes}</output></label>
          <input id="minutes" type="range" min="1" max="12" value="${state.minutes}" aria-valuemin="1" aria-valuemax="12" aria-valuenow="${state.minutes}">
          <small id="time-formula">${state.minutes} min × 5 days × 48 weeks = ${exposedHours()} hours exposed. Net recoverable at 75% efficiency after setup overhead: ${netHours()} hours. Not a measured customer average.</small>
        </div>
      </div>
    </section>`;
  }

  if (p === 2) {
    const demo = demos[state.scenario] || demos.dental;
    const tabs = [
      ['dental', 'Inbound appointment'],
      ['home', 'Inbound home inquiry'],
      ['pizza', 'Outbound pizza order'],
      ['ambiguous', 'Ambiguous payment']
    ];
    return `<section class="slide" id="product">
      ${heading(3, 'THE PRODUCT', 'One secretary for useful calls<br><em>And permitted follow-through</em>', `<span class="status">INTERACTIVE PROTOTYPE</span>`)}
      <div class="scenario-tabs" role="tablist" aria-label="Product scenarios">${tabs.map(([id, label]) =>
        button(label, 'scenario-' + id, state.scenario === id ? 'selected' : '', tabAttrs(state.scenario === id))
      ).join('')}</div>
      <div class="product-grid">
        <div class="phone ${demo.photo}">
          <div class="phone-top"><span>11:42</span><b>HELLOSHIELD ON</b></div>
          <div class="caller"><span class="avatar">${demo.initials}</span><div><small>${demo.kind}</small><strong>${demo.caller}</strong><em>${demo.desk}</em></div></div>
          <div class="context"><span>Approved context</span><b>${demo.context}</b></div>
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
      <p class="bottom-note">Interactive prototype of the decision flow. Private-pilot inbound screening exists in source; live physical-call proof is still pending. Outbound tasks and calendar writes are roadmap, not current production capabilities.</p>
    </section>`;
  }

  if (p === 3) {
    return `<section class="slide" id="customer">
      ${heading(4, 'TARGET AUDIENCE', 'One paying wedge first<br><em>Then adjacent waves</em>')}
      <div class="customer-layout">
        <div class="first-customer">
          <span class="kicker">PRIMARY INITIAL ICP</span>
          <h3>Busy real estate professionals and independent consultants</h3>
          <p>High inbound volume, expensive missed calls, and a clear reason to pay for screening plus a permitted next step.</p>
          <div class="job"><span>REPEATED JOB</span><b>Screen the call</b><i>Capture context</i><i>Take a permitted next step</i><i>Remind me</i></div>
        </div>
        <div class="customer-rings" aria-label="ICP wedge then expansion waves">
          <div class="ring core"><span>WAVE 1 · ICP</span><b>Real estate + independent consultants</b><small>Brokerages, buyer agents, and client-coordination practices</small></div>
          <div class="ring middle"><span>WAVE 2 · EXPANSION</span><b>Homebuyers and appointment-heavy households</b><small>Only after the ICP completes one live workflow</small></div>
          <div class="ring outer"><span>WAVE 3 · LATER</span><b>Older adults and lower-pressure coordination</b><small>Not the seed beachhead</small></div>
        </div>
      </div>
      <div class="why-pay">
        <b>PRE-PILOT HYPOTHESIS</b>
        <span>Channel: LinkedIn outreach to brokerages and local association partnerships</span>
        <span>Why they pay: missed calls cost commissions</span>
        <span>Not yet measured conversion or retention</span>
      </div>
    </section>`;
  }

  if (p === 4) {
    return `<section class="slide" id="market">
      ${heading(5, 'MARKET OPPORTUNITY', 'A large professional pool<br><em>A filtered, evidence-based SAM</em>')}
      <div class="market-grid">
        <div class="market-bars">
          <div class="market-row tam"><span><b>TAM · THEORETICAL POOL</b><small>71.3M U.S. management and professional workers × $163 blended ARPU</small></span><strong>$11.6B</strong></div>
          <div class="market-row sam"><span><b>SAM · OPERATIONAL FILTERS</b><small>1.065M real-estate brokers and agents × 86% metro × 95% smartphone × $163. Metro and smartphone rates are labeled assumptions on the BLS occupation count.</small></span><strong>$142M</strong></div>
          <div class="market-row som"><span><b>18-MONTH TARGET · NOT MARKET SHARE</b><small>5,000 paying subscribers × $163. This is a seed operating target, not a SOM claim.</small></span><strong>$815K ARR</strong></div>
        </div>
        <div class="market-math">
          <span class="kicker">BLENDED PAID ARPU</span>
          <div><strong>40%</strong><span>Basic $8.99 → $3.596</span></div>
          <div><strong>40%</strong><span>Plus $14.99 → $5.996</span></div>
          <div><strong>20%</strong><span>Pro $19.99 → $3.998</span></div>
          <div><strong>$13.59</strong><span>monthly blended ARPU · × 12 = $163 / year</span></div>
          <p>Expansion hypothesis, not in SAM: 1.084M management analysts with the same metro/smartphone filters (~+$144M). Unvalidated.</p>
        </div>
      </div>
      <div class="market-source">TAM occupation base: U.S. BLS CPS Table 11b, 2025 annual averages — management, professional, and related occupations 71,338,000; real estate brokers and sales agents 1,065,000; management analysts 1,084,000. Cards are not drawn to scale. <a href="https://www.bls.gov/cps/cpsaat11b.htm" target="_blank" rel="noopener">Source ↗</a></div>
    </section>`;
  }

  if (p === 5) {
    const plan = plans[state.plan];
    const paid = plan.kind === 'paid';
    return `<section class="slide" id="business-model">
      ${heading(6, 'BUSINESS MODEL', 'One-month trial<br><em>Then a paid plan</em>')}
      <div class="plan-strip" role="tablist" aria-label="Proposed plans">${Object.keys(plans).map(key =>
        button(`${plans[key].name}<small>${key === 'free' ? '$0 · 1 mo' : plans[key].price}</small>`, 'plan-' + key, state.plan === key ? 'selected' : '', tabAttrs(state.plan === key))
      ).join('')}</div>
      <div class="model-grid">
        <div class="selected-plan">
          <span class="kicker">${state.plan === 'plus' ? 'RECOMMENDED STARTING PAID PLAN' : state.plan === 'free' ? '30-DAY TRIAL ONLY' : 'PROPOSED PAID PLAN'}</span>
          <h3>${plan.name}</h3>
          <strong>${plan.price}<small>${plan.period}</small></strong>
          <p>${plan.value}</p>
          <p>${plan.detail}</p>
          <p class="allow">${plan.allow}</p>
        </div>
        <div class="economics">
          <span class="kicker">${paid ? 'PAID UNIT ECONOMICS · TARGET MODEL · UNVALIDATED' : 'TRIAL · THEN CHOOSE A PAID PLAN'}</span>
          ${paid ? `
            <div class="bridge">
              <div><span>ARPU</span><b>${plan.arpu}</b></div><i>less</i>
              <div><span>DIRECT COST</span><b>${plan.cost}</b></div><i>equals</i>
              <div><span>GROSS PROFIT</span><b>${plan.profit}</b></div>
            </div>
            <div class="ratio"><strong>${plan.ratio}</strong><span>target gross-profit LTV / CAC</span><small>${plan.formula}</small></div>
            <div class="thresholds">
              <span>Gross margin ${plan.margin}</span>
              <span>CAC ${plan.cac}</span>
              <span>Payback ${plan.payback} · &lt; 6 months</span>
              <span>Churn target ≤ 3% / month</span>
            </div>
          ` : `
            <div class="free-funnel">
              <div><b>Month 1</b><span>Free inbound screening. No standing free tier after 30 days.</span></div>
              <div><b>Then choose</b><span>Basic, Plus, or Pro. Service continues only on a paid plan.</span></div>
              <div><b>Learning data</b><span>Consented trial and paid usage produce labeled call outcomes that improve screening quality.</span></div>
            </div>
            <p class="allow">${plan.formula}</p>
          `}
          <p class="cost-line">Carrier + realtime API envelope (proposed): about $0.013/min telephony plus $0.04–$0.08/min model audio, held inside the ${paid ? plan.cost : '$1.20'} direct-cost cap. Overage: ${plan.overage}.</p>
        </div>
      </div>
      <p class="bottom-note">Free is one month only. Paid mix for $13.59 ARPU remains 40% Basic / 40% Plus / 20% Pro after conversion. All usage, CAC, churn, and margin figures are targets, not measured results.</p>
    </section>`;
  }

  if (p === 6) {
    const rows = [
      ['Apple Live Voicemail / Silence Unknown Callers', 'Native feature', 'Device rules', 'No live workflow execution', 'Voicemail'],
      ['Google Call Screen / Take a message', 'Native feature (Pixel)', 'Device rules', 'No authorized follow-through', 'Message'],
      ['Carrier screening (Scam Shield, ActiveArmor, Call Filter)', 'Carrier feature', 'Network spam score', 'Block or warn only', 'No task history'],
      ['Truecaller / Hiya', 'Third-party app', 'ID and block lists', 'No autonomous execution', 'Block log'],
      ['Siri / Google Assistant', 'Native assistant', 'Partial preferences', 'Device tasks, not PSTN secretary', 'Partial'],
      ['HelloShield OVI · proposed', 'Third-party app + authorized execution', 'Persistent permission graph', 'Approved workflows only', 'Task-completion history']
    ];
    return `<section class="slide" id="competition">
      ${heading(7, 'COMPETITION & MOAT', 'Screening is common<br><em>Authorized execution is not</em>', button('Named providers ↗', 'providers', 'secondary'))}
      <div class="comparison">
        <div class="comparison-head"><span>Alternative</span><span>Kind</span><span>Personal rules</span><span>Authorized execution</span><span>Outcome memory</span></div>
        ${rows.map((row, index) => `<div class="comparison-row ${index === 5 ? 'ours' : ''}">${row.map((cell, i) => `<span>${i === 0 ? `<b>${cell}</b>` : cell}</span>`).join('')}</div>`).join('')}
      </div>
      <div class="moat">
        <div><span>PERMISSION GRAPH</span><b>What OVI may do</b></div><i>›</i>
        <div><span>LOCAL RULES</span><b>Zero-latency boundaries</b></div><i>›</i>
        <div><span>TASK HISTORY</span><b>Completed outcomes</b></div><i>›</i>
        <div><span>NOT THE MOAT</span><b>Future agent-to-agent ideas</b></div>
      </div>
      <div class="future"><b>Defensible layer</b><span>Persistent per-user permissions, on-device/local rules, and a history of completed tasks. Speculative business-agent networks stay off the seed moat claim.</span></div>
    </section>`;
  }

  if (p === 7) {
    return `<section class="slide" id="validation">
      ${heading(8, 'ROLLOUT STRATEGY', 'Win one brokerage workflow<br><em>With named go / no-go gates</em>')}
      <div class="rollout-grid">
        <div class="launch-thesis">
          <span class="kicker">CHANNELS · PRE-PILOT HYPOTHESIS</span>
          <h3>Reach the ICP where missed calls cost commissions</h3>
          <p>Targeted LinkedIn outreach to brokerages, local realtor association partnerships, and later MLS / showing-app integrations. None of these channels is proven yet.</p>
          <div class="stage-label"><b>Current stage</b><span>Interactive prototype · pre-pilot</span></div>
          <small>No live revenue, paid retention, or physical-call proof is claimed.</small>
        </div>
        <div class="phases">
          <div><i>01</i><span><b>Days 0–90 · Design partners</b><small>30 interviews · 10 observed tests · 5 paid partners · one live inbound appointment/inquiry workflow</small></span></div>
          <div><i>02</i><span><b>Months 4–6 · Controlled pilot</b><small>250 paid users · ≥70% of standard appointment/inquiry calls completed without user escalation</small></span></div>
          <div><i>03</i><span><b>Months 7–12 · Metro launch</b><small>2,000 paid · 4-week trial usage tracked separately from 12-month paid retention</small></span></div>
          <div><i>04</i><span><b>Months 13–18 · Multi-market</b><small>5,000 paid · ≥50% 12-month paid retention path · ≥70% gross-margin path</small></span></div>
        </div>
      </div>
      <div class="evidence-gates">
        <b>90-DAY GO</b><span>5 paid design partners and ≥70% unescalated standard calls</span>
        <b>NO-GO / PIVOT</b><span>&lt;3 paid partners, any unauthorized transaction, or a privacy-policy breach</span>
        <b>SAFETY</b><span>Zero unauthorized payments or credential sharing</span>
      </div>
    </section>`;
  }

  if (p === 8) {
    return `<section class="slide" id="team">
      ${heading(9, 'TEAM & EXECUTION', 'Founder-built product<br><em>And the first four hires</em>')}
      <div class="team-layout">
        <div class="founder">
          <span class="founder-mark">SV</span>
          <div>
            <span class="kicker">FOUNDER & PRODUCT LEAD</span>
            <h3>Swati Vaish</h3>
            <p>Defined the two-question screening policy and fail-closed ownership routing. Built the FastAPI backend, Twilio voice path, and iOS PushKit / CallKit prototype. Implemented a server-authoritative realtime screening state machine with an automated scenario gate (0% false connect / false block on approved scenarios). Physical two-phone proof remains pending.</p>
          </div>
          <div class="diligence">
            <b>In source today</b>
            <span>Invite-only multi-user architecture, consented voicemail ingest, and the interactive investor prototype. Not claimed: scaled revenue, paid retention, or completed physical-call certification.</span>
          </div>
        </div>
        <div class="capabilities">
          <span class="kicker">IMMEDIATE HIRES · FROM THE $1.85M PRODUCT ENVELOPE</span>
          ${[
            ['M0 · AI / voice engineer', '$280k loaded · 18 mo', 'Owns OVI reliability, interruption, and evidence gates'],
            ['M0 · Telephony / backend', '$280k loaded · 18 mo', 'Owns call control, observability, and handoff'],
            ['M1 · iOS engineer', '$250k loaded · 18 mo', 'Owns CallKit / PushKit delivery and join lifecycle'],
            ['M4 · Growth / partnerships', '$220k loaded · 14 mo', 'Owns brokerage outreach and association pilots']
          ].map((item, index) => `<div><i>0${index + 1}</i><span><b>${item[0]}</b><small>${item[1]} · ${item[2]}</small></span></div>`).join('')}
        </div>
      </div>
      <div class="execution-question"><span>THE EXECUTION QUESTION</span><b>Can this team complete one inbound appointment/inquiry workflow reliably enough that real-estate professionals pay and return?</b></div>
    </section>`;
  }

  if (p === 9) {
    return `<section class="slide" id="funds">
      ${heading(10, 'THE $5M PLAN', '$5M over 18 months<br><em>To 5,000 paid and a Series A gate</em>')}
      <div class="funds-layout">
        <div class="fund-bars">
          ${[
            ['$1.85M', 'Headcount: founder + 4 hires + production support', 37],
            ['$1.35M', 'AI / cloud / telephony: $1.23M fixed R&D infra + $0.12M variable COGS', 27],
            ['$0.90M', 'CAC / marketing: ~$275k at $55 CAC × 5k paid; rest is channel tests', 18],
            ['$0.40M', 'Trust, privacy, consent, and security', 8],
            ['$0.30M', 'Legal, insurance, and operations', 6],
            ['$0.20M', 'Working-capital reserve', 4]
          ].map(item => `<div><span><b>${item[0]}</b><small>${item[1]}</small></span><i style="--w:${item[2]}%"></i><em>${item[2]}%</em></div>`).join('')}
        </div>
        <div class="return-plan">
          <span class="kicker">18-MONTH OPERATING MODEL</span>
          <div><b>M6</b><strong>250 paid</strong><span>One production inbound workflow</span></div>
          <div><b>M12</b><strong>2,000 paid</strong><span>Repeatable brokerage channel signal</span></div>
          <div><b>M18</b><strong>5,000 paid · ≈$815K ARR</strong><span>Series A evidence: retention + 70% GM path</span></div>
          <div class="scale-cases"><span><b>Variable COGS</b> 28.5k user-months × $4.08 blended direct cost ≈ $116k, inside the $1.35M infra envelope</span></div>
          <small>$4.08 is blended paid COGS (40/40/20 at 70% GM), not the Plus sticker. Illustrative scale, not a forecast or guaranteed return.</small>
        </div>
      </div>
      <p class="bottom-note">Proposed allocation. Hiring, vendor contracts, monthly burn, and financing terms require diligence. 5,000 paid × $13.59 × 12 = $815,400 ARR.</p>
    </section>`;
  }

  return `<section class="slide closing" id="invitation">
    <div class="closing-copy">
      ${eyebrow(11, 'INVESTOR INVITATION')}
      <h2>Fund the proof that<br><em>Busy professionals will pay</em></h2>
      <p>HelloShield’s seed job is narrow: protect a real-estate professional’s attention and complete the next permitted step.</p>
      <div class="seed-objective"><span>THE SEED OBJECTIVE</span><b>Prove that the ICP will pay, return, and trust one inbound workflow — with zero unauthorized transactions.</b></div>
      <div class="contact">
        <b>Swati Vaish</b>
        <span>Founder & Product Lead · HelloShield</span>
        <a href="mailto:${MAIL}">${MAIL}</a>
        <span>Phone and a live booking hold are confirmed by email reply. No public calendar link is published in this deck.</span>
      </div>
    </div>
    <div class="closing-action">
      <span class="closing-mark">HelloShield</span>
      <h3>Request the deep dive</h3>
      <p>Opens your email client with a pre-filled request for a 30-minute walkthrough and data-room access.</p>
      ${linkBtn('Email a deep-dive request ↗', MAIL_DEEP, 'primary')}
      ${linkBtn('Request data-room access ↗', MAIL_ROOM, 'secondary')}
      ${button('Review the product demo', 'goto-2', 'secondary')}
    </div>
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
      `${state.minutes} min × 5 days × 48 weeks = ${exposedHours()} hours exposed. Net recoverable at 75% efficiency after setup overhead: ${netHours()} hours. Not a measured customer average.`;
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
    state.plan = 'plus';
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
  if (action === 'providers') {
    modal(`<div class="kicker">NAMED MARKET CONTEXT</div>
      <h2>Adjacent products solve parts of the job</h2>
      <table>
        <thead><tr><th>Provider</th><th>What it provides</th><th>Gap HelloShield targets</th></tr></thead>
        <tbody>
          <tr><td>Apple Live Voicemail</td><td>Native unknown-call screening and transcript</td><td>Authorized follow-through after the screen</td></tr>
          <tr><td>Google Call Screen</td><td>Pixel native screen / take a message</td><td>Persistent permission graph and completed tasks</td></tr>
          <tr><td>T-Mobile Scam Shield, AT&amp;T ActiveArmor, Verizon Call Filter</td><td>Carrier spam scoring</td><td>Personal rules and a next permitted step</td></tr>
          <tr><td>Truecaller / Hiya</td><td>Caller ID and block lists</td><td>Autonomous execution inside user-approved bounds</td></tr>
          <tr><td>Smith.ai / Ruby</td><td>Human virtual reception</td><td>Consumer subscription economics with persistent context</td></tr>
        </tbody>
      </table>
      <p class="note">Publicly described behavior. Capabilities vary by device, carrier, and plan. HelloShield’s execution layer is proposed and must be proven in the pilot.</p>`);
    return;
  }
  if (action === 'contact') {
    modal(`<div class="kicker">INVESTOR NEXT STEP</div>
      <h2>Continue with Swati directly</h2>
      <p>Use the buttons below. Each opens your email client with a pre-filled request. Phone and a calendar hold are confirmed by reply — this deck does not publish a phone number or a public booking page.</p>
      <div class="contact-card">
        <b>Swati Vaish</b>
        <span>Founder & Product Lead · HelloShield</span>
        <a href="mailto:${MAIL}">${MAIL}</a>
      </div>
      <p class="contact-actions">${linkBtn('Request a 30-minute deep dive', MAIL_DEEP, 'primary')} ${linkBtn('Request data-room access', MAIL_ROOM, 'secondary')}</p>`);
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
