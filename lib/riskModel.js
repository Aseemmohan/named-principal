/**
 * Risk model — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: lib/riskModel.js
 *
 * Extracted from app/agent/page.jsx so the standalone Agent Risk Profiler
 * and the Agent Passport system share one scoring engine instead of two
 * copies that can silently drift apart — the same class of bug already
 * found and fixed once in this codebase (DOMAINS/QUESTIONS existed in
 * both lib/report.js and the inline assessment page).
 *
 * app/agent/page.jsx should import FACTORS and assess() from here rather
 * than keeping its own copies.
 *
 * VERSIONING: MODEL_VERSION is stored on every Passport's risk snapshot.
 * If this model's thresholds or overrides change later, existing
 * Passports keep the score/tier they were assessed under — re-running
 * assess() against old answers under a new model version is a distinct,
 * explicit action (recertification), not a silent retroactive change.
 * This is what lets an auditor reproduce an approval six months later,
 * per the blueprint's own acceptance criteria.
 */

export const MODEL_VERSION = "2026.1";

export const FACTORS = [
  { id: "ACT", label: "Action scope", q: "What is this agent able to do?",
    help: "Take the highest capability it holds, not the one it usually uses.",
    options: [
      "Read and summarise only. Takes no action.",
      "Writes to internal systems — tickets, documents, records.",
      "Sends external communications — email, messages, outbound API calls.",
      "Executes transactions, deploys code, or changes infrastructure.",
    ] },
  { id: "INP", label: "Untrusted input", q: "What content does it ingest?",
    help: "Anything it reads can carry instructions. This is the indirect prompt injection surface.",
    options: [
      "Curated internal content only, reviewed before ingestion.",
      "Internal documents, tickets and wikis.",
      "Customer-supplied content.",
      "Open web, third-party feeds, or public marketplaces.",
    ] },
  { id: "REV", label: "Reversibility", q: "Can its actions be undone?",
    help: "Judge the worst action it can take, not the typical one.",
    options: [
      "Fully reversible, automatically.",
      "Reversible with manual effort.",
      "Partially — some actions cannot be undone.",
      "Irreversible: payments, deletions, external sends, published changes.",
    ] },
  { id: "DAT", label: "Data classification", q: "What data can it reach?",
    help: "Highest classification it can access, including through its tools.",
    options: [
      "Public data only.",
      "Internal data.",
      "Confidential or commercially sensitive data.",
      "Regulated data — personal, financial, health, or sector-controlled.",
    ] },
  { id: "CRD", label: "Credential posture", q: "How does it authenticate?",
    help: "This determines whether you can revoke it independently.",
    options: [
      "Short-lived credentials issued per task. No standing access.",
      "Vaulted, with automated rotation.",
      "Dedicated identity, but long-lived credentials.",
      "Shared service account, or credentials in config or code.",
    ] },
  { id: "HUM", label: "Human oversight", q: "Where is the human in the loop?",
    help: "Approval that exists on paper but is never exercised counts as post-hoc.",
    options: [
      "Approval required before every action.",
      "Approval required for defined high-risk actions.",
      "Post-hoc review only.",
      "None. Fully autonomous.",
    ] },
  { id: "TOO", label: "Tool composition", q: "How does it acquire its tools?",
    help: "Dynamic discovery means the tool set at runtime is not the set you reviewed.",
    options: [
      "Fixed set, each tool individually reviewed.",
      "Fixed set, including third-party tools.",
      "Dynamic discovery from a controlled internal registry.",
      "Dynamic discovery from public marketplaces or third-party MCP servers.",
    ] },
  { id: "DEL", label: "Delegation", q: "Does it work with other agents?",
    help: "Delegation is where attribution to a human principal usually breaks.",
    options: [
      "Standalone. No other agents involved.",
      "Calls a fixed set of reviewed sub-agents.",
      "Participates in dynamic multi-agent workflows.",
      "Can spawn, recruit, or be invoked by agents outside your control.",
    ] },
  { id: "RCH", label: "Reachability", q: "Who can invoke it?",
    help: "Exposure multiplies every other factor.",
    options: [
      "Internal only, authenticated staff.",
      "Partner or supplier accessible.",
      "Customer-facing, authenticated.",
      "Public and unauthenticated.",
    ] },
];

export const TIERS = {
  contained: { code: "CONTAINED", tone: "verify",
    line: "Standard agent controls are sufficient. Register it, give it a unique identity, name its principal.",
    verdict: "Proceed with standard controls." },
  elevated: { code: "ELEVATED", tone: "signal",
    line: "This agent can cause harm that matters. Scope its entitlements deliberately and log what it does.",
    verdict: "Proceed once the mandatory controls below are in place." },
  high: { code: "HIGH", tone: "alert",
    line: "Privilege, untrusted input and an outward channel are the combination behind most documented agent incidents. Treat this as a privileged system.",
    verdict: "Do not deploy until every mandatory control below is implemented and the kill switch has been tested." },
  critical: { code: "CRITICAL", tone: "alert",
    line: "This configuration can take irreversible action with insufficient constraint. A single manipulated instruction has a path to material damage.",
    verdict: "Do not deploy without risk-committee visibility. This is a governance decision, not an engineering one." },
};

export const CONTROLS = {
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

export const TIER_CONTROLS = {
  contained: { must: ["INV-01", "IDN-01", "IDN-02", "LFC-01"], should: ["AUD-01", "INV-02"] },
  elevated: { must: ["INV-01", "IDN-01", "IDN-02", "ENT-01", "CRD-01", "AUD-01", "LFC-01"], should: ["ENT-02", "AUD-02", "INV-02"] },
  high: { must: ["INV-01", "INV-02", "IDN-01", "IDN-02", "ENT-01", "ENT-02", "CRD-01", "CRD-02", "AUD-01", "AUD-02", "LFC-01"], should: ["LFC-02"] },
  critical: { must: Object.keys(CONTROLS), should: [] },
};

export const ASI = [
  { id: "ASI01", name: "Agent goal hijack", when: v => v.INP >= 2 },
  { id: "ASI02", name: "Tool misuse", when: v => v.ACT >= 1 },
  { id: "ASI03", name: "Identity and privilege abuse", when: v => v.CRD >= 2 || v.ACT >= 2 },
  { id: "ASI04", name: "Supply chain compromise", when: v => v.TOO >= 1 },
  { id: "ASI05", name: "Unexpected code execution", when: v => v.ACT >= 3 },
  { id: "ASI06", name: "Memory poisoning", when: v => v.INP >= 2 },
  { id: "ASI07", name: "Insecure inter-agent communication", when: v => v.DEL >= 1 },
  { id: "ASI08", name: "Cascading failures", when: v => v.DEL >= 2 || v.REV >= 2 },
  { id: "ASI09", name: "Human-agent trust exploitation", when: v => v.RCH >= 2 || v.HUM >= 2 },
  { id: "ASI10", name: "Rogue agent behaviour", when: v => v.HUM >= 3 || (v.DEL >= 2 && v.ACT >= 2) },
];

export const OBLIGATIONS = [
  { when: () => true, text: "IMDA Agentic MGF — Dimension 1 (bound the risk) and Dimension 3 (technical controls)" },
  { when: v => v.HUM >= 2, text: "IMDA Agentic MGF — Dimension 2: meaningful human accountability" },
  { when: v => v.ACT >= 2, text: "EU AI Act Article 14 — human oversight; Article 12 — record-keeping" },
  { when: v => v.HUM >= 3, text: "EU AI Act Article 14(4) — ability to intervene or interrupt" },
  { when: v => v.INP >= 2, text: "EU AI Act Article 15 — accuracy, robustness and cybersecurity" },
  { when: v => v.DAT >= 3, text: "PDPA / GDPR obligations; MAS AIRM where the estate is financial services" },
  { when: v => v.TOO >= 2, text: "ISO/IEC 42001 Annex A — third-party and supplier controls" },
  { when: () => true, text: "ISO/IEC 42001 Clause 6.1 and 8.1 — risk assessment and operational control" },
  { when: v => v.ACT >= 2, text: "NIST AI RMF — MANAGE 1, MANAGE 2, MEASURE 2" },
];

/** Hard escalations. Each encodes a documented incident pattern. */
export const OVERRIDES = [
  { to: "critical", when: v => v.REV >= 3 && v.HUM >= 2,
    why: "Irreversible actions with no pre-action approval. This is the Replit pattern: an agent deleted a production database despite instructions to change nothing, with no attacker involved." },
  { to: "critical", when: v => v.CRD >= 3 && v.ACT >= 2,
    why: "Shared credentials with an outward action channel. This is the Salesloft-Drift pattern: one compromised credential reached hundreds of downstream environments." },
  { to: "critical", when: v => v.RCH >= 3 && v.ACT >= 2,
    why: "Publicly reachable and able to act outside your boundary. Anyone on the internet can supply its instructions." },
  { to: "critical", when: v => v.DEL >= 3 && v.ACT >= 2,
    why: "Can be invoked by agents outside your control. Attribution to a human principal cannot be maintained." },
  { to: "high", when: v => v.ACT >= 2 && v.INP >= 2,
    why: "Privilege plus untrusted input plus an outward channel — the combination behind most documented MCP and agent compromises." },
  { to: "high", when: v => v.TOO >= 3,
    why: "Tools acquired from public marketplaces. The postmark-mcp package shipped fifteen clean releases before adding exfiltration code." },
];

const ORDER = ["contained", "elevated", "high", "critical"];

/**
 * @param {object} v - answers keyed by factor id (ACT, INP, REV, DAT, CRD, HUM, TOO, DEL, RCH), each 0-3
 */
export function assess(v) {
  const core = v.ACT * v.INP * 2;              // 0–18
  const amp = v.REV + v.DAT + v.TOO + v.DEL + v.RCH;  // 0–15
  const def = (v.CRD + v.HUM) * 1.5;            // 0–9
  const score = core + amp + def;               // 0–42

  let tier = score <= 8 ? "contained" : score <= 17 ? "elevated" : score <= 28 ? "high" : "critical";

  const fired = OVERRIDES.filter(o => o.when(v));
  fired.forEach(o => {
    if (ORDER.indexOf(o.to) > ORDER.indexOf(tier)) tier = o.to;
  });

  return {
    modelVersion: MODEL_VERSION,
    score: Math.round(score * 10) / 10,
    max: 42,
    tier,
    overrides: fired.filter(o => ORDER.indexOf(o.to) >= ORDER.indexOf(tier)),
    asi: ASI.filter(a => a.when(v)),
    obligations: OBLIGATIONS.filter(o => o.when(v)).map(o => o.text),
    controls: TIER_CONTROLS[tier],
  };
}

/** All nine factor ids, in question order — useful for validating a complete answer set. */
export const FACTOR_IDS = FACTORS.map(f => f.id);

export function isCompleteAnswerSet(v) {
  return v && FACTOR_IDS.every(id => Number.isInteger(v[id]) && v[id] >= 0 && v[id] <= 3);
}

/* ---------------- ENCODING ----------------
 * Same technique as lib/report.js: nine digits, 0-3, in factor order.
 * Lets the standalone profiler hand its answers to the Estate intake
 * flow via a plain URL — no network call from the profiler page itself,
 * consistent with its "nothing leaves your browser" promise. Nothing
 * is transmitted until the person is on the Estate page and signs in. */
export function encodeProfilerAnswers(v) {
  return FACTOR_IDS.map(id => String(Math.min(3, Math.max(0, Number(v?.[id]) || 0)))).join("");
}

export function decodeProfilerAnswers(code) {
  const out = {};
  const s = typeof code === "string" ? code : "";
  FACTOR_IDS.forEach((id, i) => {
    const c = s[i];
    out[id] = c >= "0" && c <= "3" ? Number(c) : 0;
  });
  return out;
}

export function isValidProfilerCode(code) {
  return typeof code === "string" && new RegExp(`^[0-3]{${FACTOR_IDS.length}}$`).test(code);
}
