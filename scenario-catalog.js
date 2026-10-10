const scenarioCatalog = [
  {
    "category": "Incoming calls",
    "scenario": "Screen an unknown caller",
    "example": "Ask who is calling and why before deciding how to handle the call.",
    "status": "Implemented; external proof pending",
    "evidence": "Inbound hardening report; two-question policy"
  },
  {
    "category": "Incoming calls",
    "scenario": "Let useful human calls through",
    "example": "A new client, medical office, school staff member, or delivery driver needs to speak to the owner.",
    "status": "Implemented; external proof pending",
    "evidence": "Inbound hardening report"
  },
  {
    "category": "Incoming calls",
    "scenario": "Respect personal trusted and blocked rules",
    "example": "Apply the owner’s explicit caller rules before general reputation signals.",
    "status": "Implemented; external proof pending",
    "evidence": "Inbound H04/H12 records"
  },
  {
    "category": "Incoming calls",
    "scenario": "Avoid blocking uncertain human callers",
    "example": "Incomplete answers alone do not cause a human caller to be rejected.",
    "status": "Implemented; external proof pending",
    "evidence": "Current two-question policy"
  },
  {
    "category": "Incoming calls",
    "scenario": "Recognize eligible repeat callers",
    "example": "Avoid repeatedly screening an eligible recent non-junk caller; repetition does not automatically create trust.",
    "status": "Implemented; external proof pending",
    "evidence": "Inbound H04 report"
  },
  {
    "category": "Incoming calls",
    "scenario": "Reduce spam and marketing interruptions",
    "example": "Classify unwanted calls and apply the approved handling policy; do not promise perfect fraud detection.",
    "status": "Implemented; external proof pending",
    "evidence": "Inbound policy and H00 contract"
  },
  {
    "category": "Incoming calls",
    "scenario": "Capture important automated notices",
    "example": "School, medical, or delivery automation can leave an authorized notice under the restricted pilot policy.",
    "status": "Restricted pilot; wider release gated",
    "evidence": "C5-O1 register; H07 records"
  },
  {
    "category": "Incoming calls",
    "scenario": "Take a consented voice message",
    "example": "Offer a permitted message flow, retain it securely, and let the owner listen or delete.",
    "status": "Implemented; production approval gated",
    "evidence": "H07; LEGAL-01/T01/T02"
  },
  {
    "category": "Incoming calls",
    "scenario": "Reach the owner through the app",
    "example": "Present an incoming app call and support a two-way conversation without a forwarding loop.",
    "status": "Implemented; matched-release verification pending",
    "evidence": "H06; deployment records"
  },
  {
    "category": "Outbound requests",
    "scenario": "Ask someone about an appointment time",
    "example": "Call the selected recipient with the approved exact time and ask whether it works.",
    "status": "Implemented; external proof pending",
    "evidence": "Outbound PRD FR-01–FR-08; deployment chat"
  },
  {
    "category": "Outbound requests",
    "scenario": "Clarify spoken or typed instructions",
    "example": "Resolve ambiguous contacts, dates, times, and corrections before authorization.",
    "status": "Implemented; physical retesting pending",
    "evidence": "Analyze OVI design deviation"
  },
  {
    "category": "Outbound requests",
    "scenario": "Report the actual recipient response",
    "example": "Distinguish agreement, refusal, an alternative time, uncertainty, opt-out, and unreachable.",
    "status": "Implemented; external proof pending",
    "evidence": "Outbound PRD FR-10/11/13"
  },
  {
    "category": "Outbound requests",
    "scenario": "Cancel or track a request",
    "example": "Show queued/in-progress/result status; handle cancellation and uncertain acceptance without blindly redialing.",
    "status": "Implemented; external proof pending",
    "evidence": "Outbound PRD FR-06/14"
  },
  {
    "category": "Outbound requests",
    "scenario": "Deliver a standalone message in Ovi’s voice",
    "example": "Call a recipient and read the user’s approved message; separate from speaking an appointment request.",
    "status": "UI preview; delivery pending",
    "evidence": "Design OVI outbound iOS app; Analyze OVI design deviation"
  },
  {
    "category": "Outbound requests",
    "scenario": "Deliver the user’s recorded voice message",
    "example": "Use a user-supplied recording with authorization, secure handling, and accurate delivery status.",
    "status": "UI preview; recording/delivery pending",
    "evidence": "Design OVI outbound iOS app, builds 13–17"
  },
  {
    "category": "History and follow-up",
    "scenario": "Review calls and task results",
    "example": "See incoming outcomes and outbound task results without confusing a recommendation with the action taken.",
    "status": "Implemented in parts; release verification pending",
    "evidence": "Inbound H08; outbound M9; iOS design records"
  },
  {
    "category": "History and follow-up",
    "scenario": "Save an agreed time as an event or reminder",
    "example": "Open an editable calendar/reminder action and record a save only after the user and OS confirm it.",
    "status": "Specified / implementation evidence incomplete",
    "evidence": "Outbound PRD FR-12; M9 records"
  },
  {
    "category": "History and follow-up",
    "scenario": "Receive daily or weekly activity summaries",
    "example": "Review call/task activity and outcomes in reports; scheduled delivery is a separate capability.",
    "status": "Planned; UI designs exist",
    "evidence": "OviOutboundDesign milestone tracker"
  },
  {
    "category": "User-assigned tasks",
    "scenario": "Delegate an approved merchant or service task",
    "example": "Examples: order pizza for delivery, request a restaurant reservation, or arrange a service visit. These illustrate the broader category.",
    "status": "Planned; examples, not implemented workflows",
    "evidence": "User direction; outbound decision register"
  },
  {
    "category": "User-assigned tasks",
    "scenario": "Approve spending and confirm completion",
    "example": "For purchase tasks, approve the order and budget, then obtain merchant acceptance and fulfillment status.",
    "status": "Planned; needed for purchasing examples",
    "evidence": "User-assigned-task concept; current purchases exclusion"
  },
  {
    "category": "Assistant-to-assistant coordination",
    "scenario": "Request a call through a personal AI address",
    "example": "A person or business states its purpose and proposed time; the owner approves the next step.",
    "status": "Planned / exploratory",
    "evidence": "Define HelloShield AI protocol"
  },
  {
    "category": "Assistant-to-assistant coordination",
    "scenario": "Let two Ovi assistants coordinate availability",
    "example": "One assistant requests a slot; the recipient’s assistant asks its owner or uses an explicit limited delegation.",
    "status": "Planned",
    "evidence": "OVI-INTEROP-01"
  },
  {
    "category": "Assistant-to-assistant coordination",
    "scenario": "Handle bots, IVRs, voicemail, and human takeover",
    "example": "Recognize the type of endpoint and avoid loops, unsupported promises, or unauthorized disclosure.",
    "status": "Planned interoperability extension; some basic machine handling exists",
    "evidence": "OVI-INTEROP-01"
  },
  {
    "category": "Assistant-to-assistant coordination",
    "scenario": "Connect people after an approved call agreement",
    "example": "Move from an agreed request to an authenticated human conversation, with cancellation and honest status.",
    "status": "Planned / exploratory",
    "evidence": "Define HelloShield AI protocol"
  },
  {
    "category": "Personalization",
    "scenario": "Improve handling from owner feedback",
    "example": "Correct personal rules and use governed reputation/frequency signals; do not imply uncontrolled live model training.",
    "status": "Mixed: personal controls implemented; broader learning proposed",
    "evidence": "Intent Engine Design self-learning call router; H04"
  },
  {
    "category": "Exploratory ideas outside current call-only scope",
    "scenario": "Qualify business enquiries from social channels",
    "example": "Earlier discussion proposed Instagram enquiries and eligible WhatsApp business calling for service professionals.",
    "status": "Exploratory; not adopted current scope",
    "evidence": "Define HelloShield AI protocol"
  },
  {
    "category": "Small-business call operations",
    "scenario": "Screen and route small-business enquiries",
    "example": "Identify customer, supplier, and sales calls; apply business routing and opening-hour rules.",
    "status": "Planned; business extension requires implementation and pilot validation",
    "evidence": "Founder discussion, 10 October 2026; existing outbound foundation"
  },
  {
    "category": "Small-business call operations",
    "scenario": "Send hotel stay reminders and collect special requests",
    "example": "Notify arriving guests of check-in and stay dates, then collect late-arrival or other requests.",
    "status": "Planned; business extension requires implementation and pilot validation",
    "evidence": "Founder discussion, 10 October 2026; existing outbound foundation"
  },
  {
    "category": "Small-business call operations",
    "scenario": "Send administrative appointment reminders",
    "example": "Remind clinic, salon, or service customers of the approved date/time; collect confirmation or a callback request.",
    "status": "Planned; business extension requires implementation and pilot validation",
    "evidence": "Founder discussion, 10 October 2026; existing outbound foundation"
  },
  {
    "category": "Small-business call operations",
    "scenario": "Run scheduled reminders with a shared reply inbox",
    "example": "Use approved customer lists and schedules; show confirmed, needs attention, message received, and not reached.",
    "status": "Planned; business extension requires implementation and pilot validation",
    "evidence": "Founder discussion, 10 October 2026; existing outbound foundation"
  }
];
