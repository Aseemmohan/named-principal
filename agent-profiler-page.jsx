"use client";

import React, { useState, useMemo, useRef } from "react";

/**
 * Agent Risk Profiler — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/agent/page.jsx
 *
 * Runs entirely in the browser. No network calls, no storage, nothing transmitted.
 * Agent names and purposes describe internal architecture and must never leave the device.
 *
 * Aligns to the OWASP Top 10 for Agentic Applications 2026 (ASI01–ASI10).
 * Determines controls before deployment. It does not score vulnerabilities —
 * for that, use OWASP AIVSS.
 */

/* ============================ MODEL ============================ */

const FACTORS = [
  {
    id: "ACT", label: "Action scope",
    q: "What is this agent able to do?",
    help: "Take the highest capability it holds, not the one it usually uses.",
    options: [
      "Read and summarise only. Takes no action.",
      "Writes to internal systems — tickets, documents, records.",
      "Sends external communications — email, messages, outbound API calls.",
      "Executes transactions, deploys code, or changes infrastructure.",
    ],
  },
  {
    id: "INP", label: "Untrusted input",
    q: "What content does it ingest?",
    help: "Anything it reads can carry instructions. This is the indirect prompt injection surface.",
    options: [
      "Curated internal content only, reviewed before ingestion.",
      "Internal documents, tickets and wikis.",
      "Customer-supplied content.",
      "Open web, third-party feeds, or public marketplaces.",
    ],
  },
  {
    id: "REV", label: "Reversibility",
    q: "Can its actions be undone?",
    help: "Judge the worst action it can take, not the typical one.",
    options: [
      "Fully reversible, automatically.",
      "Reversible with manual effort.",
      "Partially — some actions cannot be undone.",
      "Irreversible: payments, deletions, external sends, published changes.",
    ],
  },
  {
    id: "DAT", label: "Data classification",
    q: "What data can it reach?",
    help: "Highest classification it can access, including through its tools.",
    options: [
      "Public data only.",
      "Internal data.",
      "Confidential or commercially sensitive data.",
      "Regulated data — personal, financial, health, or sector-controlled.",
    ],
  },
  {
    id: "CRD", label: "Credential posture",
    q: "How does it authenticate?",
    help: "This determines whether you can revoke it independently.",
    options: [
      "Short-lived credentials issued per task. No standing access.",
      "Vaulted, with automated rotation.",
      "Dedicated identity, but long-lived credentials.",
      "Shared service account, or credentials in config or code.",
    ],
  },
  {
    id: "HUM", label: "Human oversight",
    q: "Where is the human in the loop?",
    help: "Approval that exists on paper but is never exercised counts as post-hoc.",
    options: [
      "Approval required before every action.",
      "Approval required for defined high-risk actions.",
      "Post-hoc review only.",
      "None. Fully autonomous.",
    ],
  },
  {
    id: "TOO", label: "Tool composition",
    q: "How does it acquire its tools?",
    help: "Dynamic discovery means the tool set at runtime is not the set you reviewed.",
    options: [
      "Fixed set, each tool individually reviewed.",
      "Fixed set, including third-party tools.",
      "Dynamic discovery from a controlled internal registry.",
      "Dynamic discovery from public marketplaces or third-party MCP servers.",
    ],
  },
  {
    id: "DEL", label: "Delegation",
    q: "Does it work with other agents?",
    help: "Delegation is where attribution to a human principal usually breaks.",
    options: [
      "Standalone. No other agents involved.",
      "Calls a fixed set of reviewed sub-agents.",
      "Participates in dynamic multi-agent workflows.",
      "Can spawn, recruit, or be invoked by agents outside your control.",
    ],
  },
  {
    id: "RCH", label: "Reachability",
    q: "Who can invoke it?",
    help: "Exposure multiplies every other factor.",
    options: [
      "Internal only, authenticated staff.",
      "Partner or supplier accessible.",
      "Customer-facing, authenticated.",
      "Public and unauthenticated.",
    ],
  },
];

const TIERS = {
  contained: {
    code: "CONTAINED", tone: "verify",
    line: "Standard agent controls are sufficient. Register it, give it a unique identity, name its principal.",
    verdict: "Proceed with standard controls.",
  },
  elevated: {
    code: "ELEVATED", tone: "signal",
    line: "This agent can cause harm that matters. Scope its entitlements deliberately and log what it does.",
    verdict: "Proceed once the mandatory controls below are in place.",
  },
  high: {
    code: "HIGH", tone: "alert",
    line: "Privilege, untrusted input and an outward channel are the combination behind most documented agent incidents. Treat this as a privileged system.",
    verdict: "Do not deploy until every mandatory control below is implemented and the kill switch has been tested.",
  },
  critical: {
    code: "CRITICAL", tone: "alert",
    line: "This configuration can take irreversible action with insufficient constraint. A single manipulated instruction has a path to material damage.",
    verdict: "Do not deploy without risk-committee visibility. This is a governance decision, not an engineering one.",
  },
};

/** The twelve controls, referenced by tier. */
const CONTROLS = {
  "INV-01": "Record the agent in the central register with a named owner.",
  "INV-02": "Ensure it is discoverable by your shadow-AI detection process.",
  "IDN-01": "Issue a unique identity. No shared service account.",
  "IDN-02": "Record the named human principal on whose authority it acts.",
  "ENT-01": "Scope entitlements to the minimum the task requires, and verify against actual usage.",
  "ENT-02": "Complete a documented pre-deployment assessment of tool bindings and blast radius.",
  "CRD-01": "Vault the credential. Short-lived and per-task where possible.",
  "CRD-02": "Confirm the agent can be revoked independently, without disrupting others.",
  "AUD-01": "Log actions — not just prompts — to a tamper-evident record with scheduled review.",
  "AUD-02": "Implement and test a kill switch with named ownership and a response time.",
  "LFC-01": "Include the agent in the recertification cycle with owner attestation.",
  "LFC-02": "Define decommissioning triggers for owner departure and purpose change.",
};

const TIER_CONTROLS = {
  contained: {
    must: ["INV-01", "IDN-01", "IDN-02", "LFC-01"],
    should: ["AUD-01", "INV-02"],
  },
  elevated: {
    must: ["INV-01", "IDN-01", "IDN-02", "ENT-01", "CRD-01", "AUD-01", "LFC-01"],
    should: ["ENT-02", "AUD-02", "INV-02"],
  },
  high: {
    must: ["INV-01", "INV-02", "IDN-01", "IDN-02", "ENT-01", "ENT-02", "CRD-01", "CRD-02", "AUD-01", "AUD-02", "LFC-01"],
    should: ["LFC-02"],
  },
  critical: {
    must: Object.keys(CONTROLS),
    should: [],
  },
};

/** OWASP Top 10 for Agentic Applications 2026. Applied conditionally. */
const ASI = [
  { id: "ASI01", name: "Agent goal hijack",              when: v => v.INP >= 2 },
  { id: "ASI02", name: "Tool misuse",                    when: v => v.ACT >= 1 },
  { id: "ASI03", name: "Identity and privilege abuse",   when: v => v.CRD >= 2 || v.ACT >= 2 },
  { id: "ASI04", name: "Supply chain compromise",        when: v => v.TOO >= 1 },
  { id: "ASI05", name: "Unexpected code execution",      when: v => v.ACT >= 3 },
  { id: "ASI06", name: "Memory poisoning",               when: v => v.INP >= 2 },
  { id: "ASI07", name: "Insecure inter-agent communication", when: v => v.DEL >= 1 },
  { id: "ASI08", name: "Cascading failures",             when: v => v.DEL >= 2 || v.REV >= 2 },
  { id: "ASI09", name: "Human-agent trust exploitation", when: v => v.RCH >= 2 || v.HUM >= 2 },
  { id: "ASI10", name: "Rogue agent behaviour",          when: v => v.HUM >= 3 || (v.DEL >= 2 && v.ACT >= 2) },
];

const OBLIGATIONS = [
  { when: v => true,          text: "IMDA Agentic MGF — Dimension 1 (bound the risk) and Dimension 3 (technical controls)" },
  { when: v => v.HUM >= 2,    text: "IMDA Agentic MGF — Dimension 2: meaningful human accountability" },
  { when: v => v.ACT >= 2,    text: "EU AI Act Article 14 — human oversight; Article 12 — record-keeping" },
  { when: v => v.HUM >= 3,    text: "EU AI Act Article 14(4) — ability to intervene or interrupt" },
  { when: v => v.INP >= 2,    text: "EU AI Act Article 15 — accuracy, robustness and cybersecurity" },
  { when: v => v.DAT >= 3,    text: "PDPA / GDPR obligations; MAS AIRM where the estate is financial services" },
  { when: v => v.TOO >= 2,    text: "ISO/IEC 42001 Annex A — third-party and supplier controls" },
  { when: v => true,          text: "ISO/IEC 42001 Clause 6.1 and 8.1 — risk assessment and operational control" },
  { when: v => v.ACT >= 2,    text: "NIST AI RMF — MANAGE 1, MANAGE 2, MEASURE 2" },
];

/** Hard escalations. Each encodes a documented incident pattern. */
const OVERRIDES = [
  { to: "critical", when: v => v.REV >= 3 && v.HUM >= 2,
    why: "Irreversible actions with no pre-action approval. This is the Replit pattern: an agent deleted a production database despite instructions to change nothing, with no attacker involved." },
  { to: "critical", when: v => v.CRD >= 3 && v.ACT >= 2,
    why: "Shared credentials with an outward action channel. This is the Salesloft-Drift pattern: one compromised credential reached hundreds of downstream environments." },
  { to: "critical", when: v => v.RCH >= 3 && v.ACT >= 2,
    why: "Publicly reachable and able to act outside your boundary. Anyone on the internet can supply its instructions." },
  { to: "critical", when: v => v.DEL >= 3 && v.ACT >= 2,
    why: "Can be invoked by agents outside your control. Attribution to a human principal cannot be maintained." },
  { to: "high",     when: v => v.ACT >= 2 && v.INP >= 2,
    why: "Privilege plus untrusted input plus an outward channel — the combination behind most documented MCP and agent compromises." },
  { to: "high",     when: v => v.TOO >= 3,
    why: "Tools acquired from public marketplaces. The postmark-mcp package shipped fifteen clean releases before adding exfiltration code." },
];

const ORDER = ["contained", "elevated", "high", "critical"];

function assess(v) {
  const core = v.ACT * v.INP * 2;                                  // 0–18
  const amp  = v.REV + v.DAT + v.TOO + v.DEL + v.RCH;              // 0–15
  const def  = (v.CRD + v.HUM) * 1.5;                              // 0–9
  const score = core + amp + def;                                  // 0–42

  let tier = score <= 8 ? "contained" : score <= 17 ? "elevated" : score <= 28 ? "high" : "critical";

  const fired = OVERRIDES.filter(o => o.when(v));
  fired.forEach(o => {
    if (ORDER.indexOf(o.to) > ORDER.indexOf(tier)) tier = o.to;
  });

  return {
    score: Math.round(score * 10) / 10,
    max: 42,
    tier,
    overrides: fired.filter(o => ORDER.indexOf(o.to) >= ORDER.indexOf(tier)),
    asi: ASI.filter(a => a.when(v)),
    obligations: OBLIGATIONS.filter(o => o.when(v)).map(o => o.text),
    controls: TIER_CONTROLS[tier],
  };
}

/* ============================ STYLES ============================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;800&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

.ap {
  --ink:#11151E; --slate:#59637A; --mute:#8B94A6;
  --paper:#EEF1F5; --surface:#FFFFFF; --rule:#D6DBE4;
  --indigo:#26307A; --indigo-soft:#E5E8F5;
  --signal:#9A6100; --signal-soft:#FAF0DC;
  --verify:#17604F; --verify-soft:#E2F0EB;
  --alert:#9B2C1E; --alert-soft:#F9E8E5;
  background:var(--paper); color:var(--ink);
  font-family:'IBM Plex Sans',system-ui,sans-serif;
  font-size:15px; line-height:1.6; min-height:100vh;
  -webkit-font-smoothing:antialiased;
}
.ap *, .ap *::before, .ap *::after { box-sizing:border-box; }
.ap-shell { max-width:900px; margin:0 auto; padding:0 22px 90px; }

.ap-bar {
  display:flex; align-items:center; justify-content:space-between; gap:14px;
  padding:14px 0; border-bottom:1px solid var(--rule);
  font-family:'IBM Plex Mono',monospace; font-size:11px;
  letter-spacing:0.1em; text-transform:uppercase; color:var(--slate);
}
.ap-bar b { color:var(--ink); font-weight:500; }
.ap-bar a { color:var(--indigo); text-decoration:none; }
.ap-bar a:hover { text-decoration:underline; }

.ap-head { padding:48px 0 8px; max-width:660px; }
.ap-eyebrow { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--indigo); margin-bottom:16px; }
.ap-head h1 { font-family:'Archivo',sans-serif; font-size:clamp(1.9rem,5vw,2.8rem); font-weight:800; letter-spacing:-0.028em; line-height:1.08; margin:0; }
.ap-lede { margin-top:18px; color:var(--slate); }
.ap-local {
  margin-top:20px; padding:12px 15px; background:var(--verify-soft);
  border-left:3px solid var(--verify); font-size:0.88rem; max-width:620px;
}

.ap-name { margin-top:34px; display:grid; grid-template-columns:1fr 1fr; gap:10px; max-width:660px; }
.ap-input {
  padding:13px 14px; border:1px solid var(--rule); border-radius:2px;
  font-family:'IBM Plex Sans',sans-serif; font-size:0.95rem; background:var(--surface); color:var(--ink);
}
.ap-input:focus { outline:2px solid var(--indigo); outline-offset:1px; border-color:var(--indigo); }

.ap-live {
  position:sticky; top:0; z-index:5; margin-top:34px;
  background:var(--surface); border:1px solid var(--rule);
  display:flex; align-items:center; justify-content:space-between; gap:16px;
  padding:13px 18px;
}
.ap-live-l { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:var(--slate); }
.ap-live-r { display:flex; align-items:center; gap:14px; }
.ap-chip { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.09em; padding:5px 10px; font-weight:600; }
.ap-chip.verify { background:var(--verify-soft); color:var(--verify); }
.ap-chip.signal { background:var(--signal-soft); color:var(--signal); }
.ap-chip.alert  { background:var(--alert-soft);  color:var(--alert); }
.ap-chip.idle   { background:#EDEFF3; color:var(--mute); }
.ap-count { font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--slate); }

.ap-q { margin-top:26px; border:1px solid var(--rule); background:var(--surface); padding:22px 24px; }
.ap-q-head { display:flex; flex-wrap:wrap; gap:10px; align-items:baseline; margin-bottom:6px; }
.ap-q-id { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.08em; background:var(--indigo-soft); color:var(--indigo); padding:3px 8px; font-weight:600; }
.ap-q-label { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.09em; text-transform:uppercase; color:var(--slate); }
.ap-q h2 { font-family:'Archivo',sans-serif; font-size:1.08rem; font-weight:600; margin:4px 0 6px; letter-spacing:-0.01em; }
.ap-q-help { font-size:0.86rem; color:var(--slate); margin:0 0 16px; }

.ap-opts { display:grid; gap:7px; }
.ap-opt {
  display:grid; grid-template-columns:26px 1fr; gap:11px; align-items:start; text-align:left;
  background:var(--surface); border:1px solid var(--rule); border-radius:2px;
  padding:11px 14px; font:inherit; cursor:pointer;
  transition:border-color 120ms ease, background 120ms ease;
}
.ap-opt:hover { border-color:var(--indigo); background:#FBFCFE; }
.ap-opt.on { border-color:var(--indigo); background:var(--indigo-soft); }
.ap-opt-n { font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--mute); padding-top:2px; }
.ap-opt.on .ap-opt-n { color:var(--indigo); font-weight:600; }

.ap-go { margin-top:28px; display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
.ap-btn {
  background:var(--indigo); color:#fff; border:0; border-radius:2px;
  padding:14px 26px; font-family:'Archivo',sans-serif; font-weight:600; font-size:0.97rem; cursor:pointer;
}
.ap-btn:hover { background:#1A2260; }
.ap-btn:disabled { background:var(--mute); cursor:not-allowed; }
.ap-ghost { background:none; border:1px solid var(--rule); color:var(--slate); border-radius:2px; padding:13px 20px; font-size:0.9rem; cursor:pointer; }
.ap-ghost:hover { border-color:var(--indigo); color:var(--indigo); }

/* record */
.ap-rec { margin-top:52px; border:2px solid var(--indigo); background:var(--surface); }
.ap-rec-top { padding:26px 28px; border-bottom:1px solid var(--rule); }
.ap-rec-kicker { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--slate); margin-bottom:10px; }
.ap-rec-name { font-family:'Archivo',sans-serif; font-size:1.4rem; font-weight:600; letter-spacing:-0.015em; margin:0 0 4px; }
.ap-rec-purpose { color:var(--slate); font-size:0.92rem; margin:0; }
.ap-rec-tier { display:flex; align-items:baseline; gap:16px; flex-wrap:wrap; margin-top:20px; }
.ap-rec-tier b { font-family:'Archivo',sans-serif; font-size:clamp(1.7rem,4.5vw,2.4rem); font-weight:800; letter-spacing:-0.03em; }
.ap-rec-score { font-family:'IBM Plex Mono',monospace; font-size:0.9rem; color:var(--slate); }
.ap-rec-line { margin-top:14px; color:var(--slate); max-width:640px; }
.ap-verdict { margin:18px 0 0; padding:15px 17px; font-weight:600; max-width:660px; }
.ap-verdict.verify { background:var(--verify-soft); border-left:3px solid var(--verify); }
.ap-verdict.signal { background:var(--signal-soft); border-left:3px solid var(--signal); }
.ap-verdict.alert  { background:var(--alert-soft);  border-left:3px solid var(--alert); }

.ap-block { padding:22px 28px; border-bottom:1px solid var(--rule); }
.ap-block:last-child { border-bottom:0; }
.ap-block h3 { font-family:'Archivo',sans-serif; font-size:1rem; font-weight:600; margin:0 0 3px; }
.ap-block-note { font-size:0.84rem; color:var(--mute); margin:0 0 14px; }

.ap-esc { border-left:3px solid var(--alert); background:#FCFAFA; padding:13px 15px; margin-bottom:9px; font-size:0.89rem; }
.ap-esc b { display:block; font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--alert); margin-bottom:5px; }

.ap-ctl { display:grid; grid-template-columns:64px 1fr; gap:12px; padding:9px 0; border-bottom:1px solid #EDEFF3; font-size:0.9rem; }
.ap-ctl:last-child { border-bottom:0; }
.ap-ctl-id { font-family:'IBM Plex Mono',monospace; font-size:0.78rem; color:var(--indigo); font-weight:600; }
.ap-ctl.opt .ap-ctl-id { color:var(--mute); font-weight:400; }
.ap-ctl.opt { color:var(--slate); }

.ap-tags { display:flex; flex-wrap:wrap; gap:7px; }
.ap-tag { font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.06em; background:#EDEFF3; color:var(--ink); padding:5px 9px; }
.ap-tag b { color:var(--indigo); }

.ap-list { margin:0; padding-left:19px; color:var(--slate); font-size:0.9rem; }
.ap-list li { margin-bottom:6px; }

.ap-meta { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:14px; font-size:0.85rem; }
.ap-meta div span { display:block; font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--mute); margin-bottom:3px; }

.ap-foot { margin-top:40px; padding-top:20px; border-top:1px solid var(--rule); font-size:0.8rem; color:var(--mute); }
.ap-foot p { margin:0 0 8px; }
.ap-foot a { color:var(--indigo); }

.ap :focus-visible { outline:2px solid var(--indigo); outline-offset:2px; }

@media (max-width:720px) {
  .ap-name { grid-template-columns:1fr; }
  .ap-q { padding:18px 16px; }
  .ap-block, .ap-rec-top { padding:18px 16px; }
}
@media print {
  .ap { background:#fff; }
  .ap-head, .ap-name, .ap-q, .ap-go, .ap-live, .ap-bar { display:none; }
  .ap-shell { max-width:none; padding:0; }
  .ap-rec { border:1px solid #999; margin-top:0; }
  .ap-block { break-inside:avoid; }
}
`;

/* ============================ COMPONENT ============================ */

export default function AgentRiskProfiler() {
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [v, setV] = useState({});
  const [done, setDone] = useState(false);
  const recRef = useRef(null);

  const answered = FACTORS.filter(f => v[f.id] !== undefined).length;
  const complete = answered === FACTORS.length;

  const live = useMemo(() => {
    if (!complete) return null;
    return assess(v);
  }, [v, complete]);

  const preview = useMemo(() => {
    if (answered < 4) return null;
    const filled = {};
    FACTORS.forEach(f => { filled[f.id] = v[f.id] ?? 0; });
    return assess(filled);
  }, [v, answered]);

  function pick(id, i) {
    setV(prev => ({ ...prev, [id]: i }));
  }

  function generate() {
    setDone(true);
    setTimeout(() => recRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }

  function reset() {
    setV({}); setName(""); setPurpose(""); setDone(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const shown = done && live ? live : null;
  const tierMeta = shown ? TIERS[shown.tier] : null;
  const chipTone = preview ? TIERS[preview.tier].tone : "idle";
  const chipText = preview ? TIERS[preview.tier].code : "AWAITING INPUT";

  const today = new Date();
  const review = new Date(today);
  review.setMonth(review.getMonth() + (shown && (shown.tier === "critical" || shown.tier === "high") ? 3 : 12));
  const fmt = d => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="ap">
      <style>{CSS}</style>
      <div className="ap-shell">
        <div className="ap-bar">
          <span><b>Named Principal</b> — Agent risk profiler</span>
          <span><a href="/">Assessment</a></span>
        </div>

        <div className="ap-head">
          <p className="ap-eyebrow">Nine questions · before you deploy</p>
          <h1>What controls does this agent actually need?</h1>
          <p className="ap-lede">
            Describe one agent. This returns the risk tier, the OWASP agentic risks it exposes you to,
            the controls that become mandatory, and the framework provisions that attach — as a record
            you can put straight into a change ticket or an agent register.
          </p>
          <div className="ap-local">
            <strong>Nothing leaves your browser.</strong> No network calls, no storage, no analytics.
            Agent names describe your internal architecture, so they stay on your device.
          </div>
        </div>

        <div className="ap-name">
          <input className="ap-input" placeholder="Agent name or identifier"
            value={name} onChange={e => setName(e.target.value)} aria-label="Agent name" />
          <input className="ap-input" placeholder="What it is for (one line)"
            value={purpose} onChange={e => setPurpose(e.target.value)} aria-label="Agent purpose" />
        </div>

        <div className="ap-live">
          <span className="ap-live-l">Indicative tier</span>
          <span className="ap-live-r">
            <span className="ap-count">{answered}/{FACTORS.length}</span>
            <span className={`ap-chip ${chipTone}`}>{chipText}</span>
          </span>
        </div>

        {FACTORS.map((f, idx) => (
          <div className="ap-q" key={f.id}>
            <div className="ap-q-head">
              <span className="ap-q-id">{f.id}</span>
              <span className="ap-q-label">{f.label} · {idx + 1} of {FACTORS.length}</span>
            </div>
            <h2>{f.q}</h2>
            <p className="ap-q-help">{f.help}</p>
            <div className="ap-opts">
              {f.options.map((o, i) => (
                <button key={i} className={`ap-opt ${v[f.id] === i ? "on" : ""}`} onClick={() => pick(f.id, i)}>
                  <span className="ap-opt-n">{i}</span>
                  <span>{o}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="ap-go">
          <button className="ap-btn" onClick={generate} disabled={!complete}>
            {complete ? "Generate the risk record" : `Answer all nine (${answered}/9)`}
          </button>
          {done && <button className="ap-ghost" onClick={() => window.print()}>Print or save as PDF</button>}
          {done && <button className="ap-ghost" onClick={reset}>Profile another agent</button>}
        </div>

        {shown && (
          <div className="ap-rec" ref={recRef}>
            <div className="ap-rec-top">
              <p className="ap-rec-kicker">Agent risk record</p>
              <h2 className="ap-rec-name">{name.trim() || "Unnamed agent"}</h2>
              {purpose.trim() && <p className="ap-rec-purpose">{purpose.trim()}</p>}
              <div className="ap-rec-tier">
                <b>{tierMeta.code}</b>
                <span className="ap-rec-score">{shown.score} / {shown.max}</span>
              </div>
              <p className="ap-rec-line">{tierMeta.line}</p>
              <p className={`ap-verdict ${tierMeta.tone}`}>{tierMeta.verdict}</p>
            </div>

            {shown.overrides.length > 0 && (
              <div className="ap-block">
                <h3>Why this tier</h3>
                <p className="ap-block-note">
                  These conditions escalate the tier regardless of the score. Each reflects a documented incident pattern.
                </p>
                {shown.overrides.map((o, i) => (
                  <div className="ap-esc" key={i}>
                    <b>Escalation to {o.to}</b>
                    {o.why}
                  </div>
                ))}
              </div>
            )}

            <div className="ap-block">
              <h3>Mandatory controls</h3>
              <p className="ap-block-note">Implement before deployment. References are to the twelve-control framework.</p>
              {shown.controls.must.map(id => (
                <div className="ap-ctl" key={id}>
                  <span className="ap-ctl-id">{id}</span>
                  <span>{CONTROLS[id]}</span>
                </div>
              ))}
              {shown.controls.should.length > 0 && (
                <>
                  <h3 style={{ marginTop: 22 }}>Recommended</h3>
                  <p className="ap-block-note">Not blocking, but expected at this tier by most auditors.</p>
                  {shown.controls.should.map(id => (
                    <div className="ap-ctl opt" key={id}>
                      <span className="ap-ctl-id">{id}</span>
                      <span>{CONTROLS[id]}</span>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="ap-block">
              <h3>Exposed risk categories</h3>
              <p className="ap-block-note">OWASP Top 10 for Agentic Applications 2026.</p>
              <div className="ap-tags">
                {shown.asi.map(a => (
                  <span className="ap-tag" key={a.id}><b>{a.id}</b> {a.name}</span>
                ))}
              </div>
            </div>

            <div className="ap-block">
              <h3>Provisions engaged</h3>
              <p className="ap-block-note">Indicative. Confirm against current text for your jurisdiction and sector.</p>
              <ul className="ap-list">
                {shown.obligations.map((o, i) => <li key={i}>{o}</li>)}
              </ul>
            </div>

            <div className="ap-block">
              <h3>Record</h3>
              <div className="ap-meta">
                <div><span>Assessed</span>{fmt(today)}</div>
                <div><span>Review by</span>{fmt(review)}</div>
                <div><span>Tier</span>{tierMeta.code}</div>
                <div><span>Profile</span>{FACTORS.map(f => v[f.id]).join("")}</div>
              </div>
            </div>
          </div>
        )}

        <div className="ap-foot">
          <p>
            This is triage. Nine questions cannot capture a real architecture — the output tells you what
            to examine properly and which controls to require, not that an agent is safe.
          </p>
          <p>
            Aligned to the OWASP Top 10 for Agentic Applications 2026. To score a discovered vulnerability
            rather than determine controls before deployment, use the OWASP AI Vulnerability Scoring System.
          </p>
          <p>
            Provided for readiness planning. Not a compliance determination, and not legal advice.
            Mappings current as at July 2026.
          </p>
          <p>
            © 2026 Aseem Mohan · <a href="/">Organisational assessment</a> · <a href="/privacy">Privacy notice</a>
          </p>
        </div>
      </div>
    </div>
  );
}