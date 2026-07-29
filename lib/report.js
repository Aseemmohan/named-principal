/**
 * Report generation — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * REPLACES: lib/report.js
 *
 * Shared by the API route (server) and the report page (client).
 * Answers are encoded into the report URL, never stored.
 */

export const DOMAINS = [
  { id: "INV", name: "Discovery & inventory",         premise: "You cannot govern what you cannot see." },
  { id: "IDN", name: "Identity & attribution",        premise: "Every action resolves to an authorising human." },
  { id: "ENT", name: "Entitlement & least privilege", premise: "An agent's blast radius is its entitlement set." },
  { id: "CRD", name: "Credential handling",           premise: "Shared secrets destroy attribution." },
  { id: "AUD", name: "Audit & containment",           premise: "Detection without a stop control is observation." },
  { id: "LFC", name: "Lifecycle & recertification",   premise: "Unreviewed grants become standing privilege." },
];

export const DOMAIN_FRAMEWORKS = {
  INV: { imda: "Dimension 1 — Assess and bound the risks", mas: "AI identification and inventory", nist: "MAP 1, MAP 3", iso: "Clause 6.1; Annex A.4", eu: "Article 26 — Deployer obligations" },
  IDN: { imda: "Dimension 2 — Meaningful human accountability", mas: "Scope and AI oversight", nist: "GOVERN 1, GOVERN 2", iso: "Annex A.9; Clause 5.3", eu: "Article 14 — Human oversight" },
  ENT: { imda: "Dimension 3 — Technical controls", mas: "AI lifecycle management", nist: "MANAGE 1, MANAGE 2", iso: "Annex A.6; Clause 8.1", eu: "Article 15 — Robustness and cybersecurity" },
  CRD: { imda: "Dimension 3 — Technical controls", mas: "AI lifecycle management", nist: "MANAGE 1; COSAiS overlays", iso: "Annex A.6; Clause 8.1", eu: "Article 15 — Cybersecurity" },
  AUD: { imda: "Dimension 3 — Technical controls", mas: "AI lifecycle management; monitoring", nist: "MEASURE 2, MEASURE 3", iso: "Clause 9.1; Annex A.6", eu: "Article 12 — Record-keeping" },
  LFC: { imda: "Dimension 2 — Meaningful human accountability", mas: "Scope and AI oversight", nist: "GOVERN 1; MANAGE 4", iso: "Clause 9.2; Clause 10", eu: "Article 26 — Deployer obligations" },
};

export const QUESTIONS = [
  { ref: "INV-01", domain: "INV", name: "Agent inventory",
    target: "A maintained register with named owners, reconciled on a defined cycle.",
    states: ["No list exists.", "A partial list, maintained manually by one team.", "A central register covering most agents, updated on request.", "A maintained register with named owners, reconciled on a defined cycle."] },
  { ref: "INV-02", domain: "INV", name: "Shadow agent detection",
    target: "Active detection with a defined triage and onboarding path.",
    states: ["No detection capability.", "Found incidentally, usually after the fact.", "Partial detection through network or SaaS discovery tooling.", "Active detection with a defined triage and onboarding path."] },
  { ref: "IDN-01", domain: "IDN", name: "Unique agent identity",
    target: "Unique identity enforced at provisioning. No shared agent credentials.",
    states: ["Agents run under shared service accounts.", "Some agents have distinct accounts; most share.", "Most agents have unique identities; exceptions are known.", "Unique identity enforced at provisioning. No shared agent credentials."] },
  { ref: "IDN-02", domain: "IDN", name: "Human principal attribution",
    target: "Attribution holds across agent-to-agent delegation chains.",
    states: ["Actions trace to a system account at best.", "Only for single-agent flows, by manual investigation.", "Single-agent flows work; multi-agent chains break the trail.", "Attribution holds across agent-to-agent delegation chains."] },
  { ref: "ENT-01", domain: "ENT", name: "Least privilege scoping",
    target: "Least privilege enforced and verified, with documented exceptions.",
    states: ["Agents inherit broad or administrative permissions.", "Scoping is attempted but not verified.", "Scoping reviewed at deployment for most agents.", "Least privilege enforced and verified, with documented exceptions."] },
  { ref: "ENT-02", domain: "ENT", name: "Pre-deployment assessment",
    target: "Every agent assessed and recorded, with reversibility and blast radius rated.",
    states: ["No pre-deployment assessment.", "Informal review by the building team.", "Formal review for high-risk agents only.", "Every agent assessed and recorded, with reversibility and blast radius rated."] },
  { ref: "CRD-01", domain: "CRD", name: "Credential issuance and storage",
    target: "Vaulted, short-lived, issued per task, with no standing credential.",
    states: ["Hardcoded in config files or environment variables.", "Stored centrally, but long-lived and rarely changed.", "Vaulted, with rotation for most agents.", "Vaulted, short-lived, issued per task, with no standing credential."] },
  { ref: "CRD-02", domain: "CRD", name: "Independent revocation",
    target: "Immediate, independent revocation for every agent.",
    states: ["Revocation would break multiple systems.", "Possible, but requires a change window.", "Works for most agents; some shared dependencies remain.", "Immediate, independent revocation for every agent."] },
  { ref: "AUD-01", domain: "AUD", name: "Action-level audit record",
    target: "Tamper-evident action logging with scheduled review and alerting.",
    states: ["No action-level logging.", "Application logs exist but are not centralised or reviewed.", "Centralised logging; review is reactive, after incidents.", "Tamper-evident action logging with scheduled review and alerting."] },
  { ref: "AUD-02", domain: "AUD", name: "Containment and stop control",
    target: "A tested kill switch with defined ownership and response time.",
    states: ["No defined mechanism.", "Possible by disabling the host system or account.", "A stop control exists but has not been tested.", "A tested kill switch with defined ownership and response time."] },
  { ref: "LFC-01", domain: "LFC", name: "Entitlement recertification",
    target: "Scheduled recertification with owner attestation and retained evidence.",
    states: ["Never reviewed after grant.", "Ad hoc review during audits.", "Annual review for a subset of agents.", "Scheduled recertification with owner attestation and retained evidence."] },
  { ref: "LFC-02", domain: "LFC", name: "Decommissioning",
    target: "Owner-departure and purpose-change triggers, both verified.",
    states: ["No decommissioning process.", "Handled informally, when someone notices.", "Triggered by owner departure, but not purpose change.", "Owner-departure and purpose-change triggers, both verified."] },
];

export const TIERS = [
  { min: 0,  max: 9,  code: "T0", label: "Unmapped",
    summary: "Agents are running without an identity model. There is no reliable way to answer a regulator asking who authorised a given action.",
    firstMove: "Stand up the agent register this month. Manual entry is fine — completeness matters more than tooling. Assign a named owner to every entry; an entry without an owner is not a register entry.",
    sequence: [
      "Stand up the agent register. Manual entry is acceptable at this stage.",
      "Assign a named accountable owner to every entry.",
      "Run one discovery pass across OAuth grants and SaaS admin consoles.",
      "Do not attempt recertification, kill switches or attestation yet — they have nothing to operate on.",
    ] },
  { min: 10, max: 18, code: "T1", label: "Documented",
    summary: "Some agents are known and some controls exist, but coverage is partial and attribution breaks under scrutiny.",
    firstMove: "Eliminate shared identities. Until each agent authenticates as itself, no log you produce will survive a question from an auditor, and revocation stays an availability decision rather than a security one.",
    sequence: [
      "Eliminate shared identities. This is what makes everything downstream auditable.",
      "Make the human principal a mandatory register field and backfill it.",
      "Get credentials out of configuration files and into a vault.",
      "Test revocation on one agent, end to end, and record what breaks.",
    ] },
  { min: 19, max: 27, code: "T2", label: "Controlled",
    summary: "Controls are in place across most domains. The weakness is usually recertification and multi-agent traceability.",
    firstMove: "Extend your existing user access review cycle to cover agents rather than building a parallel process. The machinery already exists; the population is what is missing.",
    sequence: [
      "Extend the existing user access review cycle to cover agents.",
      "Test attribution across an agent-to-agent chain and fix what the test reveals.",
      "Exercise the stop control and record the time taken.",
      "Add purpose-change as a decommissioning trigger, not only owner departure.",
    ] },
  { min: 28, max: 36, code: "T3", label: "Attested",
    summary: "Agent identity is governed as a first-class control domain with evidence a supervisor could examine.",
    firstMove: "Bring vendor-embedded and third-party agents into scope. They are almost always outside the register, and they are the ones you control least.",
    sequence: [
      "Extend scope to third-party and vendor-embedded agents.",
      "Assemble the evidence pack for each control and rehearse against a mock audit.",
      "Move toward continuous entitlement analysis where the estate justifies it.",
      "Contribute the operating model back to your sector.",
    ] },
];

export const FRAMEWORKS = [
  { key: "imda", name: "IMDA Model AI Governance Framework for Agentic AI", note: "Singapore · updated May 2026" },
  { key: "mas",  name: "MAS Guidelines on AI Risk Management", note: "Singapore financial sector" },
  { key: "nist", name: "NIST AI RMF 1.0 + COSAiS overlays", note: "United States" },
  { key: "iso",  name: "ISO/IEC 42001", note: "International · certifiable" },
  { key: "eu",   name: "EU AI Act", note: "High-risk obligations from Dec 2027" },
];

export const MAX = QUESTIONS.length * 3;

/* ---------------- ENCODING ---------------- */

/** Twelve digits, 0–3, in question order. Compact enough for a URL. */
export function encodeAnswers(answers) {
  return QUESTIONS
    .map(q => String(Math.min(3, Math.max(0, Number(answers?.[q.ref]) || 0))))
    .join("");
}

export function decodeAnswers(code) {
  const out = {};
  const s = typeof code === "string" ? code : "";
  QUESTIONS.forEach((q, i) => {
    const c = s[i];
    out[q.ref] = c >= "0" && c <= "3" ? Number(c) : 0;
  });
  return out;
}

export function isValidCode(code) {
  return typeof code === "string" && new RegExp(`^[0-3]{${QUESTIONS.length}}$`).test(code);
}

/* ---------------- ANALYSIS ---------------- */

export function analyse(answers) {
  const total = QUESTIONS.reduce((s, q) => s + (Number(answers?.[q.ref]) || 0), 0);
  const tier = TIERS.find(t => total >= t.min && total <= t.max) || TIERS[0];

  const domains = DOMAINS.map(d => {
    const qs = QUESTIONS.filter(q => q.domain === d.id);
    const got = qs.reduce((s, q) => s + (Number(answers?.[q.ref]) || 0), 0);
    const max = qs.length * 3;
    return { ...d, got, max, pct: Math.round((got / max) * 100), frameworks: DOMAIN_FRAMEWORKS[d.id] };
  });

  const scored = QUESTIONS.map(q => ({ ...q, score: Number(answers?.[q.ref]) || 0 }));
  const gaps = [...scored].sort((a, b) => a.score - b.score || a.ref.localeCompare(b.ref)).slice(0, 3);
  const strongest = [...domains].sort((a, b) => b.pct - a.pct)[0];
  const weakest = [...domains].sort((a, b) => a.pct - b.pct)[0];

  return { total, max: MAX, tier, domains, scored, gaps, strongest, weakest };
}

export function frameworkStatus(pct) {
  if (pct >= 84) return { code: "MET", tone: "verify" };
  if (pct >= 50) return { code: "PARTIAL", tone: "signal" };
  return { code: "GAP", tone: "alert" };
}

/* ---------------- EMAIL ---------------- */

const INK = "#11151E", SLATE = "#59637A", INDIGO = "#26307A";
const RULE = "#D6DBE4", PAPER = "#EEF1F5", ALERT = "#9B2C1E";

const esc = s => String(s ?? "").replace(/[<>&"]/g, m =>
  ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[m]));

function bar(pct) {
  const colour = pct >= 84 ? "#17604F" : pct >= 50 ? "#9A6100" : ALERT;
  const w = Math.max(2, pct);
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:120px;border-collapse:collapse">
    <tr>
      <td style="height:7px;width:${w}%;background:${colour};font-size:0;line-height:0">&nbsp;</td>
      <td style="height:7px;background:#E3E6EC;font-size:0;line-height:0">&nbsp;</td>
    </tr></table>`;
}

export function buildEmailHtml({ analysis, org, reportUrl, pdfUrl, contactEmail }) {
  const { total, max, tier, domains, gaps, weakest } = analysis;
  const who = org ? ` at ${esc(org)}` : "";

  const domainRows = domains.map(d => `
    <tr>
      <td style="padding:9px 0;border-bottom:1px solid #EDEFF3;font-size:14px;color:${INK}">
        ${esc(d.name)}
        <div style="font-size:12px;color:${SLATE};margin-top:2px">${esc(d.premise)}</div>
      </td>
      <td style="padding:9px 0 9px 14px;border-bottom:1px solid #EDEFF3;width:120px">${bar(d.pct)}</td>
      <td style="padding:9px 0 9px 12px;border-bottom:1px solid #EDEFF3;text-align:right;font-family:'Courier New',monospace;font-size:13px;color:${SLATE};white-space:nowrap">${d.got}/${d.max}</td>
    </tr>`).join("");

  const gapBlocks = gaps.map(g => `
    <div style="border-left:3px solid ${ALERT};background:#FFFFFF;padding:14px 16px;margin-bottom:10px">
      <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${SLATE};margin-bottom:6px">
        ${esc(g.ref)} &middot; ${esc(g.name)} &middot; scored ${g.score}/3
      </div>
      <div style="font-size:14px;color:${INK};margin-bottom:6px"><strong>Now:</strong> ${esc(g.states[g.score])}</div>
      <div style="font-size:14px;color:${SLATE}"><strong>Target:</strong> ${esc(g.target)}</div>
    </div>`).join("");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your Named Principal readiness report</title></head>
<body style="margin:0;padding:0;background:${PAPER};font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:${INK}">
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:${PAPER};border-collapse:collapse">
<tr><td align="center" style="padding:28px 14px 48px">
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;border-collapse:collapse">

  <tr><td style="padding-bottom:14px;border-bottom:1px solid ${RULE};font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${SLATE}">
    Named Principal &mdash; Readiness report
  </td></tr>

  <tr><td style="padding:32px 0 0">
    <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${SLATE};margin-bottom:8px">Readiness tier ${esc(tier.code)}</div>
    <div style="font-size:34px;font-weight:800;letter-spacing:-0.02em;line-height:1.1;color:${INK}">${esc(tier.label)}</div>
    <div style="font-family:'Courier New',monospace;font-size:15px;color:${SLATE};margin-top:8px"><span style="font-size:26px;color:${INK};font-weight:600">${total}</span> / ${max}</div>
    <p style="font-size:15px;line-height:1.6;color:${SLATE};margin:18px 0 0">${esc(tier.summary)}</p>
  </td></tr>

  <tr><td style="padding:20px 0 0">
    <div style="background:#FAF0DC;border-left:3px solid #9A6100;padding:14px 16px;font-size:14px;line-height:1.6;color:${INK}">
      <strong>Where to start${who}.</strong> ${esc(tier.firstMove)}
    </div>
  </td></tr>

  <tr><td style="padding:34px 0 0">
    <div style="font-size:17px;font-weight:600;color:${INK};margin-bottom:4px">Your six domains</div>
    <div style="font-size:13px;color:${SLATE};margin-bottom:12px">Two controls each, scored zero to three.</div>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#FFFFFF;border:1px solid ${RULE};border-collapse:collapse">
      <tr><td style="padding:4px 16px">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">${domainRows}</table>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:32px 0 0">
    <div style="font-size:17px;font-weight:600;color:${INK};margin-bottom:4px">Three controls to fix first</div>
    <div style="font-size:13px;color:${SLATE};margin-bottom:12px">Ordered by weakness, not by effort.</div>
    ${gapBlocks}
  </td></tr>

  <tr><td style="padding:24px 0 0">
    <p style="font-size:15px;line-height:1.6;color:${SLATE};margin:0 0 18px">
      Your weakest domain is <strong style="color:${INK}">${esc(weakest.name.toLowerCase())}</strong>. Your full report
      scores all twelve controls individually, sets out your exposure across each framework, and gives the order of
      work for tier ${esc(tier.code)}.
    </p>
    <a href="${esc(reportUrl)}" style="display:inline-block;background:${INDIGO};color:#FFFFFF;text-decoration:none;padding:14px 26px;font-size:15px;font-weight:600">
      Open your full report
    </a>
    <p style="font-size:13px;line-height:1.6;color:${SLATE};margin:16px 0 0">
      This link is unique to your answers. Keep it if you want to return to the report, and share it with
      colleagues if it is useful &mdash; nothing in it identifies you.
    </p>
    <p style="font-size:13px;line-height:1.6;color:${SLATE};margin:10px 0 0">
      The twelve-control reference document, with the evidence each framework provision expects, is
      <a href="${esc(pdfUrl)}" style="color:${INDIGO}">available here as a PDF</a>.
    </p>
  </td></tr>

  <tr><td style="padding:34px 0 0;border-top:1px solid ${RULE}">
    <p style="font-size:15px;line-height:1.6;color:${SLATE};margin:20px 0 0">
      If you are working through any of these, reply to this email &mdash; I read every one, and I am
      genuinely interested in how this looks inside other organisations.
    </p>
    <p style="font-size:15px;line-height:1.6;color:${INK};margin:16px 0 0">Aseem Mohan</p>
    <p style="font-size:13px;line-height:1.6;color:${SLATE};margin:2px 0 0">
      Global Head of Identity &amp; Access Management &middot; Singapore
    </p>
  </td></tr>

  <tr><td style="padding:28px 0 0">
    <p style="font-size:12px;line-height:1.6;color:#8B94A6;margin:0">
      You received this because you requested it from the Named Principal readiness assessment.
      Your individual answers were used to generate this report and were not retained.
      To have your details deleted, reply to this email or write to ${esc(contactEmail)}.
    </p>
    <p style="font-size:12px;color:#8B94A6;margin:10px 0 0">
      Provided for readiness planning. Not a compliance determination and not legal advice.
      &copy; 2026 Aseem Mohan.
    </p>
  </td></tr>

</table></td></tr></table></body></html>`;
}

export function buildEmailText({ analysis, reportUrl }) {
  const { total, max, tier, gaps } = analysis;
  return [
    `NAMED PRINCIPAL — READINESS REPORT`,
    ``,
    `Tier ${tier.code} — ${tier.label}    ${total}/${max}`,
    ``,
    tier.summary,
    ``,
    `WHERE TO START`,
    tier.firstMove,
    ``,
    `THREE CONTROLS TO FIX FIRST`,
    ...gaps.flatMap(g => [
      ``,
      `${g.ref} — ${g.name} (scored ${g.score}/3)`,
      `Now:    ${g.states[g.score]}`,
      `Target: ${g.target}`,
    ]),
    ``,
    `Your full report, scoring all twelve controls:`,
    reportUrl,
    ``,
    `Aseem Mohan`,
  ].join("\n");
}