"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import PublicNav from "../../components/PublicNav";

/**
 * Agent Governance Readiness Assessment — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * Original work. Authored on personal equipment and personal accounts, outside
 * any employment engagement, from publicly available regulatory sources only.
 *
 * CHANGES IN THIS VERSION:
 *   1. The "intro" stage is now a real commercial homepage — problem framing,
 *      how it works, the three product modules, framework coverage, a
 *      security/privacy note — with the assessment as a clear CTA rather
 *      than the entire page. The assessment engine itself (DOMAINS,
 *      QUESTIONS, TIERS, scoring, the Report component) is UNCHANGED.
 *   2. The three homepage stats now cite real, named, dated sources
 *      instead of appearing unattributed — see STATS below.
 *   3. Fixed a pre-existing HTML validity bug: the /agent cross-sell card
 *      was a <div> nested inside a <p> in the capture form, which is
 *      invalid HTML and can cause the browser to close the <p> early in
 *      unpredictable ways. Moved it out to be a sibling instead — same
 *      visual result, valid markup.
 *
 * A deliberate choice, worth knowing about: this version does NOT include
 * a "book a demo" / "start a pilot" CTA pointed at a named founder, and
 * does not add a founder-bio section. That's a step toward active
 * commercial solicitation, which is being held pending a separate,
 * unresolved question — see the CTA copy below for the soft version used
 * instead ("Talk to us about a pilot").
 *
 * WIRING NOTE — lead capture:
 *   submitLead() below is the single integration point. Replace the stub with a
 *   POST to a Next.js route handler that writes to Supabase. Do not call Supabase
 *   directly from the client with a service key.
 */

/* Change these two lines to rebrand. Nothing else references the name. */
const BRAND = "Named Principal";
const OWNER = "Aseem Mohan";
const CONTACT_EMAIL = "reports@namedprincipal.com";

/* ============================ CONTENT ============================ */

const DOMAINS = [
  {
    id: "INV",
    name: "Discovery & inventory",
    premise: "You cannot govern what you cannot see.",
    frameworks: {
      imda: "Dimension 1 — Assess and bound the risks",
      mas: "AI risk management — AI usage identification and inventory",
      nist: "MAP",
      iso: "Clause 6.1 / Annex A.4",
      eu: "Article 26 — Deployer obligations",
    },
  },
  {
    id: "IDN",
    name: "Identity & attribution",
    premise: "Every action resolves to an authorising human.",
    frameworks: {
      imda: "Dimension 2 — Make humans meaningfully accountable",
      mas: "Scope and AI oversight",
      nist: "GOVERN",
      iso: "Annex A.9 — Responsible use",
      eu: "Article 14 — Human oversight",
    },
  },
  {
    id: "ENT",
    name: "Entitlement & least privilege",
    premise: "An agent's blast radius is its entitlement set.",
    frameworks: {
      imda: "Dimension 3 — Technical controls and processes",
      mas: "AI lifecycle management",
      nist: "MANAGE",
      iso: "Annex A.6 — AI system lifecycle",
      eu: "Article 15 — Accuracy, robustness, cybersecurity",
    },
  },
  {
    id: "CRD",
    name: "Credential handling",
    premise: "Shared secrets destroy attribution.",
    frameworks: {
      imda: "Dimension 3 — Technical controls and processes",
      mas: "AI lifecycle management",
      nist: "MANAGE / COSAiS overlays (in development)",
      iso: "Annex A.6 — AI system lifecycle",
      eu: "Article 15 — Accuracy, robustness, cybersecurity",
    },
  },
  {
    id: "AUD",
    name: "Audit & containment",
    premise: "Detection without a stop control is observation, not governance.",
    frameworks: {
      imda: "Dimension 3 — Technical controls and processes",
      mas: "AI lifecycle management",
      nist: "MEASURE",
      iso: "Clause 9 — Performance evaluation",
      eu: "Article 12 — s-keeping",
    },
  },
  {
    id: "LFC",
    name: "Lifecycle & recertification",
    premise: "Entitlements granted once and never reviewed become standing privilege.",
    frameworks: {
      imda: "Dimension 2 — Make humans meaningfully accountable",
      mas: "Scope and AI oversight",
      nist: "GOVERN",
      iso: "Clause 10 — Improvement",
      eu: "Article 26 — Deployer obligations",
    },
  },
];

const QUESTIONS = [
  {
    ref: "INV-01",
    domain: "INV",
    text: "Can you produce a current list of every AI agent running in your environment?",
    help: "Includes vendor-embedded agents, copilots with tool access, and anything calling external APIs on a schedule.",
    options: [
      "No list exists.",
      "A partial list, maintained manually by one team.",
      "A central register covering most agents, updated on request.",
      "A maintained register with named owners, reconciled on a defined cycle.",
    ],
  },
  {
    ref: "INV-02",
    domain: "INV",
    text: "Can you detect AI agents or tools deployed without security review?",
    help: "Shadow AI: department-level deployments, personal accounts, unreviewed MCP servers and API integrations.",
    options: [
      "No detection capability.",
      "We find out incidentally, usually after the fact.",
      "Partial detection through network or SaaS discovery tooling.",
      "Active detection with a defined triage and onboarding path.",
    ],
  },
  {
    ref: "IDN-01",
    domain: "IDN",
    text: "Does every agent hold a unique identity that is not shared with any other agent or process?",
    help: "IMDA's agentic framework asks for unique identities tied to a supervising agent or user.",
    options: [
      "Agents run under shared service accounts.",
      "Some agents have distinct accounts; most share.",
      "Most agents have unique identities; exceptions are known.",
      "Unique identity is enforced at provisioning. No shared agent credentials.",
    ],
  },
  {
    ref: "IDN-02",
    domain: "IDN",
    text: "For any agent action, can you name the human who authorised it?",
    help: "This is the hard one in multi-agent chains, where one agent invokes another.",
    options: [
      "No. Actions trace to a system account at best.",
      "Only for single-agent flows, and only by manual investigation.",
      "Yes for single-agent flows; multi-agent chains break the trail.",
      "Yes, including delegation across agent-to-agent chains.",
    ],
  },
  {
    ref: "ENT-01",
    domain: "ENT",
    text: "Are agent entitlements scoped to the minimum the task requires?",
    help: "Overprivileged agents turn a single prompt injection into a broad compromise.",
    options: [
      "Agents inherit broad or administrative permissions.",
      "Scoping is attempted but not verified.",
      "Scoping is reviewed at deployment for most agents.",
      "Least privilege is enforced and verified, with documented exceptions.",
    ],
  },
  {
    ref: "ENT-02",
    domain: "ENT",
    text: "Are an agent's tool bindings and data classifications assessed before it goes live?",
    help: "Which tools it can call, which systems it can write to, which data classes it touches.",
    options: [
      "No pre-deployment assessment.",
      "Informal review by the building team.",
      "Formal review for agents judged high-risk only.",
      "Every agent is assessed and recorded, with reversibility and blast radius rated.",
    ],
  },
  {
    ref: "CRD-01",
    domain: "CRD",
    text: "How are agent credentials issued and stored?",
    help: "Hardcoded keys and shared tokens are the most common finding in agent deployments.",
    options: [
      "Hardcoded, in config files or environment variables.",
      "Stored centrally, but long-lived and rarely changed.",
      "Vaulted, with rotation for most agents.",
      "Vaulted, short-lived, issued per-task, with no standing credential.",
    ],
  },
  {
    ref: "CRD-02",
    domain: "CRD",
    text: "Can you revoke a single agent's access without disrupting others?",
    help: "If agents share a credential, revocation is an outage decision rather than a security one.",
    options: [
      "No. Revocation would break multiple systems.",
      "Possible, but requires a change window.",
      "Yes for most agents; some shared dependencies remain.",
      "Yes, immediately and independently, for every agent.",
    ],
  },
  {
    ref: "AUD-01",
    domain: "AUD",
    text: "Are agent actions written to a tamper-evident record that someone reviews?",
    help: "Prompts and outputs are not enough. The record needs the actions: tool calls, writes, escalations.",
    options: [
      "No action-level logging.",
      "Application logs exist but are not centralised or reviewed.",
      "Centralised logging; review is reactive, after incidents.",
      "Tamper-evident action logging with scheduled review and alerting.",
    ],
  },
  {
    ref: "AUD-02",
    domain: "AUD",
    text: "Can you stop a misbehaving agent mid-task?",
    help: "A documented, tested kill switch — not a theoretical one.",
    options: [
      "No defined mechanism.",
      "Possible by disabling the host system or account.",
      "A stop control exists but has not been tested.",
      "A tested kill switch with defined ownership and response time.",
    ],
  },
  {
    ref: "LFC-01",
    domain: "LFC",
    text: "Are agent entitlements recertified on a defined cycle?",
    help: "The same discipline as a user access review, applied to non-human identities.",
    options: [
      "Never reviewed after grant.",
      "Ad hoc review during audits.",
      "Annual review for a subset of agents.",
      "Scheduled recertification campaigns with owner attestation and evidence retained.",
    ],
  },
  {
    ref: "LFC-02",
    domain: "LFC",
    text: "Are agents decommissioned when their owner leaves or their purpose ends?",
    help: "Orphaned agents with standing entitlements are the non-human equivalent of a dormant admin account.",
    options: [
      "No decommissioning process.",
      "Handled informally, when someone notices.",
      "Triggered by owner departure, but not by purpose change.",
      "Both triggers are covered by a defined process, with verification.",
    ],
  },
];

const TIERS = [
  {
    min: 0,
    max: 9,
    label: "Unmapped",
    code: "T0",
    summary:
      "Agents are running without an identity model. There is no reliable way to answer a regulator asking who authorised a given action.",
    priority:
      "Build the register before building controls. Every other control depends on knowing what exists.",
  },
  {
    min: 10,
    max: 18,
    label: "Documented",
    code: "T1",
    summary:
      "Some agents are known and some controls exist, but coverage is partial and attribution breaks under scrutiny.",
    priority:
      "Close the attribution gap next. Unique identity per agent is the control that makes the others auditable.",
  },
  {
    min: 19,
    max: 27,
    label: "Controlled",
    code: "T2",
    summary:
      "Controls are in place across most domains. The weakness is usually recertification and multi-agent traceability.",
    priority:
      "Move from point-in-time control to a recurring attestation cycle with retained evidence.",
  },
  {
    min: 28,
    max: 36,
    label: "Attested",
    code: "T3",
    summary:
      "Agent identity is governed as a first-class control domain with evidence a supervisor could examine.",
    priority:
      "Extend coverage to third-party and multi-agent estates, and rehearse the evidence pack against a live audit.",
  },
];

const FRAMEWORKS = [
  { key: "imda", short: "IMDA", name: "Model AI Governance Framework for Agentic AI", note: "Singapore · updated May 2026" },
  { key: "mas", short: "MAS", name: "Guidelines on AI Risk Management", note: "Singapore financial sector" },
  { key: "nist", short: "NIST", name: "AI RMF 1.0 + COSAiS control overlays", note: "United States" },
  { key: "iso", short: "ISO", name: "ISO/IEC 42001 AI management system", note: "International · certifiable" },
  { key: "eu", short: "EU", name: "EU AI Act", note: "High-risk obligations from Dec 2027" },
];

/* Homepage stats — each one traceable to a named, dated source. If you
 * update these later, keep the citation attached; an unattributed
 * number on a governance product's own homepage undercuts the product. */
const STATS = [
  {
    value: "78%",
    caption: "of organisations have no documented policy for creating or removing AI identities",
    source: "Cloud Security Alliance / Oasis Security, State of Non-Human Identity and AI Security, 2026",
  },
  {
    value: "28%",
    caption: "of organisations can trace an agent's actions back to a human sponsor across every environment",
    source: "Cloud Security Alliance research, 2026",
  },
  {
    value: "21%",
    caption: "of organisations deploying agentic AI report a mature governance model for it",
    source: "Deloitte, State of AI in the Enterprise, 2026",
  },
];

const MODULES = [
  {
    tag: "Live now",
    tone: "verify",
    name: "Organisational readiness assessment",
    body: "Twelve controls, six minutes. Where your organisation stands against IMDA, MAS, NIST, ISO 42001 and the EU AI Act, and the three fixes that matter most.",
    cta: "You're looking at it ↓",
    href: null,
  },
  {
    tag: "Live now",
    tone: "verify",
    name: "Agent risk profiler",
    body: "Nine questions about one specific agent. Returns its risk tier, the OWASP agentic risks it exposes you to, and the controls that become mandatory before deployment.",
    cta: "Open the profiler →",
    href: "/agent",
  },
  {
    tag: "Live now — sign in required",
    tone: "signal",
    name: "Agent Estate & Passports",
    body: "A persistent record per agent — identity, accountability, risk and approval history — instead of a result that disappears when the tab closes.",
    cta: "Sign in →",
    href: "/login",
  },
];

/* ============================ HELPERS ============================ */

const MAX = QUESTIONS.length * 3;

function tierFor(score) {
  return TIERS.find((t) => score >= t.min && score <= t.max) || TIERS[0];
}

function domainScores(answers) {
  return DOMAINS.map((d) => {
    const qs = QUESTIONS.filter((q) => q.domain === d.id);
    const got = qs.reduce((sum, q) => sum + (answers[q.ref] ?? 0), 0);
    const max = qs.length * 3;
    return { ...d, got, max, pct: Math.round((got / max) * 100) };
  });
}

function frameworkStatus(pct) {
  if (pct >= 84) return { code: "MET", tone: "verify" };
  if (pct >= 50) return { code: "PARTIAL", tone: "signal" };
  return { code: "GAP", tone: "alert" };
}

/** Replace with a POST to your own route handler. Never call Supabase with a service key from the client. */
async function submitLead(payload) {
  const res = await fetch("/api/readiness-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: payload.email,
      org: payload.org,
      answers: payload.answers,
    }),
  });
  if (!res.ok) throw new Error("submit failed");
  return res.json();
}

/* ============================ STYLES ============================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;800&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

.agr {
  --ink: #11151E;
  --slate: #59637A;
  --mute: #8B94A6;
  --paper: #EEF1F5;
  --surface: #FFFFFF;
  --rule: #D6DBE4;
  --indigo: #26307A;
  --indigo-soft: #E5E8F5;
  --signal: #9A6100;
  --signal-soft: #FAF0DC;
  --verify: #17604F;
  --verify-soft: #E2F0EB;
  --alert: #9B2C1E;
  --alert-soft: #F9E8E5;

  background: var(--paper);
  color: var(--ink);
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
  font-size: 18px;
  line-height: 1.65;
  min-height: 100%;
  -webkit-font-smoothing: antialiased;
}
.agr *, .agr *::before, .agr *::after { box-sizing: border-box; }
.agr h1, .agr h2, .agr h3 { font-family: 'Archivo', sans-serif; margin: 0; letter-spacing: -0.025em; }
.agr p { margin: 0; }
.agr button { font: inherit; cursor: pointer; }
.agr .mono { font-family: 'IBM Plex Mono', monospace; }

.agr-shell { max-width: 1080px; margin: 0 auto; padding: 0 22px 72px; }

/* --- utility bar --- */
.agr-bar {
  display: flex; align-items: center; justify-content: space-between;
  gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--rule);
  font-family: 'IBM Plex Mono', monospace; font-size: 11px;
  letter-spacing: 0.1em; text-transform: uppercase; color: var(--slate);
}
.agr-bar b { color: var(--ink); font-weight: 600; }
.agr-bar span { white-space: nowrap; }
.agr-navlink {
  display:inline-flex; align-items:center; gap:7px;
  border:1px solid var(--indigo); color:var(--indigo);
  padding:7px 13px; text-decoration:none; border-radius:2px;
  font-family:'IBM Plex Mono',monospace; font-size:10px;
  letter-spacing:0.1em; text-transform:uppercase; font-weight:600;
  transition:background 130ms ease, color 130ms ease;
}
.agr-navlink:hover { background:var(--indigo); color:#fff; }

.agr-cross {
  margin-top:20px; border:1px solid var(--rule); background:var(--surface);
  padding:26px 28px; max-width:620px;
  transition:border-color 140ms ease, box-shadow 140ms ease;
}
.agr-cross:hover { border-color:var(--indigo); box-shadow:0 2px 14px rgba(38,48,122,0.07); }
.agr-cross h3 {
  font-family:'Archivo',sans-serif; font-size:1.18rem; font-weight:600;
  letter-spacing:-0.015em; margin:9px 0 9px;
}
.agr-cross p { color:var(--slate); font-size:0.93rem; margin:0 0 20px; }
.agr-cross-btn {
  display:inline-block; border:1px solid var(--indigo); color:var(--indigo);
  padding:12px 22px; text-decoration:none; font-weight:600;
  font-size:0.92rem; border-radius:2px;
  transition:background 130ms ease, color 130ms ease;
}
.agr-cross-btn:hover { background:var(--indigo); color:#fff; }

/* --- hero --- */
.agr-hero { padding: 68px 0 0; max-width: 760px; }
.agr-eyebrow {
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.16em;
  text-transform: uppercase; color: var(--indigo); margin-bottom: 22px;
}
.agr-hero h1 { font-size: clamp(2.4rem, 6vw, 4rem); font-weight: 800; line-height: 1.06; }
.agr-hero h1 em { font-style: normal; color: var(--indigo); }
.agr-lede { margin-top: 22px; font-size: 1.2rem; line-height: 1.6; color: var(--slate); max-width: 640px; }

.agr-stats { display: flex; flex-wrap: wrap; gap: 0; margin: 40px 0 34px; border-top: 1px solid var(--rule); }
.agr-stat { flex: 1 1 220px; padding: 18px 24px 18px 0; border-bottom: 1px solid var(--rule); }
.agr-stat b { display: block; font-family: 'Archivo', sans-serif; font-size: 1.85rem; font-weight: 800; letter-spacing: -0.03em; }
.agr-stat span { display: block; font-size: 0.83rem; color: var(--slate); margin-top: 4px; max-width: 260px; }
.agr-stat cite { display: block; font-style: normal; font-size: 0.72rem; color: var(--mute); margin-top: 8px; }

.agr-cta {
  background: var(--indigo); color: #fff; border: 0; border-radius: 2px;
  padding: 15px 26px; font-family: 'Archivo', sans-serif; font-weight: 600; font-size: 0.98rem;
  transition: background 140ms ease; text-decoration: none; display: inline-block;
}
.agr-cta:hover { background: #1A2260; }
.agr-cta:disabled { background: var(--mute); cursor: not-allowed; }
.agr-cta.ghost { background: none; border: 1px solid var(--rule); color: var(--slate); }
.agr-cta.ghost:hover { border-color: var(--indigo); color: var(--indigo); background: none; }
.agr-cta-row { display: flex; flex-wrap: wrap; gap: 12px; }
.agr-note { margin-top: 14px; font-size: 0.82rem; color: var(--mute); }

/* --- new marketing sections --- */
.agr-section { padding: 56px 0 0; max-width: 900px; }
.agr-section h2 { font-size: clamp(1.6rem, 3.5vw, 2.2rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 14px; }
.agr-section-lede { color: var(--slate); max-width: 640px; margin-bottom: 30px; }

.agr-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.agr-step { border: 1px solid var(--rule); background: var(--surface); padding: 22px 22px 20px; }
.agr-step .agr-step-n { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--indigo); font-weight: 600; letter-spacing: 0.08em; }
.agr-step h3 { font-size: 1.2rem; font-weight: 600; margin: 10px 0 8px; }
.agr-step p { font-size: 1.02rem; color: var(--slate); }

.agr-modules { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.agr-module { border: 1px solid var(--rule); background: var(--surface); padding: 22px 22px 20px; display: flex; flex-direction: column; }
.agr-module-tag { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; padding: 3px 8px; display: inline-block; margin-bottom: 12px; width: fit-content; }
.agr-module-tag.verify { background: var(--verify-soft); color: var(--verify); }
.agr-module-tag.signal { background: var(--signal-soft); color: var(--signal); }
.agr-module h3 { font-size: 1.2rem; font-weight: 600; margin-bottom: 8px; }
.agr-module p { font-size: 1rem; color: var(--slate); flex: 1; margin-bottom: 16px; }
.agr-module a, .agr-module span.agr-module-here { font-size: 0.95rem; font-weight: 600; color: var(--indigo); text-decoration: none; }
.agr-module a:hover { text-decoration: underline; }

.agr-fw-strip { display: flex; flex-wrap: wrap; gap: 10px; }
.agr-fw-chip { border: 1px solid var(--rule); background: var(--surface); padding: 10px 16px; font-size: 0.85rem; }
.agr-fw-chip b { color: var(--indigo); margin-right: 6px; }
.agr-fw-chip span { display: block; font-size: 0.76rem; color: var(--mute); margin-top: 2px; }

.agr-security-box { border: 1px solid var(--rule); background: var(--surface); padding: 24px 26px; max-width: 780px; }
.agr-security-box p { color: var(--slate); font-size: 1.02rem; }
.agr-security-box p + p { margin-top: 10px; }
.agr-security-box a { color: var(--indigo); }

/* --- assessment layout --- */
.agr-work { display: grid; grid-template-columns: 232px 1fr; gap: 34px; padding-top: 34px; align-items: start; }

/* --- ledger (signature element) --- */
.agr-ledger { position: sticky; top: 22px; border: 1px solid var(--rule); background: var(--surface); }
.agr-ledger-head {
  padding: 11px 13px; border-bottom: 1px solid var(--rule);
  font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--slate);
  display: flex; justify-content: space-between;
}
.agr-row {
  display: grid; grid-template-columns: 58px 1fr auto; align-items: center; gap: 8px;
  padding: 7px 13px; font-family: 'IBM Plex Mono', monospace; font-size: 11px;
  border-bottom: 1px solid #EDEFF3; color: var(--mute);
}
.agr-row:last-child { border-bottom: 0; }
.agr-row.is-done { color: var(--ink); }
.agr-row.is-live { background: var(--indigo-soft); color: var(--indigo); font-weight: 600; }
.agr-row-dom { font-size: 10px; letter-spacing: 0.04em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.agr-pips { display: flex; gap: 2px; }
.agr-pip { width: 5px; height: 12px; background: #E3E6EC; }
.agr-pip.on { background: var(--indigo); }
.agr-ledger-foot {
  padding: 11px 13px; border-top: 1px solid var(--rule); background: #FAFBFC;
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--slate);
  display: flex; justify-content: space-between;
}

/* --- question card --- */
.agr-card { background: var(--surface); border: 1px solid var(--rule); padding: 30px 32px 26px; }
.agr-qmeta {
  display: flex; flex-wrap: wrap; gap: 10px; align-items: center;
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--slate); margin-bottom: 18px;
}
.agr-tag { background: var(--indigo-soft); color: var(--indigo); padding: 3px 8px; font-weight: 600; }
.agr-card h2 { font-size: clamp(1.35rem, 2.8vw, 1.7rem); font-weight: 600; line-height: 1.3; }
.agr-help { margin-top: 10px; font-size: 1rem; color: var(--slate); }

.agr-opts { margin-top: 26px; display: flex; flex-direction: column; gap: 8px; }
.agr-opt {
  display: grid; grid-template-columns: 30px 1fr; gap: 12px; align-items: start;
  text-align: left; background: var(--surface); border: 1px solid var(--rule);
  border-radius: 2px; padding: 13px 15px; transition: border-color 120ms ease, background 120ms ease;
}
.agr-opt:hover { border-color: var(--indigo); background: #FBFCFE; }
.agr-opt.is-picked { border-color: var(--indigo); background: var(--indigo-soft); }
.agr-opt-n { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--mute); padding-top: 2px; }
.agr-opt.is-picked .agr-opt-n { color: var(--indigo); font-weight: 600; }

.agr-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; }
.agr-back {
  background: none; border: 0; color: var(--slate); font-size: 0.88rem; padding: 8px 0;
  text-decoration: underline; text-underline-offset: 3px;
}
.agr-back:disabled { color: #C4CAD4; cursor: not-allowed; text-decoration: none; }

/* --- report --- */
.agr-report { padding-top: 30px; }
.agr-band { border: 1px solid var(--rule); background: var(--surface); padding: 30px 32px; }
.agr-band-top { display: flex; flex-wrap: wrap; gap: 26px; align-items: baseline; justify-content: space-between; }
.agr-tier { font-family: 'Archivo', sans-serif; font-size: clamp(2.1rem, 5vw, 3rem); font-weight: 800; letter-spacing: -0.03em; }
.agr-tier small { display: block; font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 400; letter-spacing: 0.14em; text-transform: uppercase; color: var(--slate); margin-bottom: 6px; }
.agr-score { font-family: 'IBM Plex Mono', monospace; font-size: 1.05rem; color: var(--slate); }
.agr-score b { font-size: 2rem; color: var(--ink); font-weight: 600; }
.agr-band p { margin-top: 18px; color: var(--slate); max-width: 640px; }
.agr-band .agr-next { margin-top: 16px; padding: 14px 16px; background: var(--signal-soft); border-left: 3px solid var(--signal); color: var(--ink); font-size: 0.92rem; max-width: 640px; }

.agr-sec { margin-top: 34px; }
.agr-sec h3 { font-size: 1.05rem; font-weight: 600; margin-bottom: 4px; }
.agr-sec-note { font-size: 0.85rem; color: var(--mute); margin-bottom: 16px; }

.agr-dom { border: 1px solid var(--rule); background: var(--surface); }
.agr-dom-row { display: grid; grid-template-columns: 54px 1fr 116px 62px; gap: 14px; align-items: center; padding: 14px 16px; border-bottom: 1px solid #EDEFF3; }
.agr-dom-row:last-child { border-bottom: 0; }
.agr-dom-name { font-weight: 500; font-size: 1rem; }
.agr-dom-name span { display: block; font-size: 0.8rem; color: var(--mute); font-weight: 400; }
.agr-meter { height: 8px; background: #E9ECF1; position: relative; }
.agr-meter i { position: absolute; inset: 0 auto 0 0; display: block; }
.agr-dom-val { font-family: 'IBM Plex Mono', monospace; font-size: 0.82rem; text-align: right; color: var(--slate); }

.agr-matrix { border: 1px solid var(--rule); background: var(--surface); overflow-x: auto; }
.agr-matrix table { width: 100%; border-collapse: collapse; min-width: 620px; }
.agr-matrix th, .agr-matrix td { padding: 11px 14px; text-align: left; border-bottom: 1px solid #EDEFF3; font-size: 0.85rem; }
.agr-matrix th { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--slate); font-weight: 500; background: #FAFBFC; }
.agr-matrix tr:last-child td { border-bottom: 0; }
.agr-fw-name { font-weight: 500; }
.agr-fw-name span { display: block; font-size: 0.78rem; color: var(--mute); font-weight: 400; margin-top: 2px; }
.agr-pill { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.08em; padding: 3px 7px; display: inline-block; }
.agr-pill.verify { background: var(--verify-soft); color: var(--verify); }
.agr-pill.signal { background: var(--signal-soft); color: var(--signal); }
.agr-pill.alert { background: var(--alert-soft); color: var(--alert); }

.agr-gaps { display: grid; gap: 10px; }
.agr-gap { border: 1px solid var(--rule); background: var(--surface); border-left: 3px solid var(--alert); padding: 16px 18px; }
.agr-gap-head { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--slate); margin-bottom: 8px; }
.agr-gap p { font-size: 1.02rem; }
.agr-gap .agr-fix { margin-top: 8px; font-size: 0.88rem; color: var(--slate); }

.agr-capture { margin-top: 34px; border: 1px solid var(--indigo); background: var(--surface); padding: 28px 30px; }
.agr-capture h3 { font-size: 1.15rem; font-weight: 600; }
.agr-capture p { margin-top: 8px; color: var(--slate); font-size: 0.92rem; max-width: 560px; }
.agr-form { margin-top: 20px; display: flex; flex-wrap: wrap; gap: 8px; }
.agr-input {
  flex: 1 1 260px; padding: 13px 14px; border: 1px solid var(--rule); border-radius: 2px;
  font-family: 'IBM Plex Sans', sans-serif; font-size: 0.95rem; background: var(--surface); color: var(--ink);
}
.agr-input:focus { outline: 2px solid var(--indigo); outline-offset: 1px; border-color: var(--indigo); }
.agr-done { margin-top: 18px; padding: 14px 16px; background: var(--verify-soft); border-left: 3px solid var(--verify); font-size: 0.9rem; }

.agr-foot { margin-top: 44px; padding-top: 20px; border-top: 1px solid var(--rule); font-size: 0.8rem; color: var(--mute); }
.agr-foot p + p { margin-top: 8px; }
.agr-restart { background: none; border: 0; color: var(--indigo); text-decoration: underline; text-underline-offset: 3px; font-size: 0.85rem; padding: 0; }

.agr :focus-visible { outline: 2px solid var(--indigo); outline-offset: 2px; }

.agr-fade { animation: agrFade 260ms ease both; }
@keyframes agrFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

@media (max-width: 860px) {
  .agr-work { grid-template-columns: 1fr; }
  .agr-ledger { position: static; }
  .agr-card { padding: 24px 20px 20px; }
  .agr-band { padding: 24px 20px; }
  .agr-dom-row { grid-template-columns: 46px 1fr 62px; }
  .agr-dom-row .agr-meter { display: none; }
  .agr-steps, .agr-modules { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .agr-fade { animation: none; }
  .agr * { transition: none !important; }
}
`;

/* ============================ COMPONENTS ============================ */

function Ledger({ answers, activeIndex }) {
  const done = Object.keys(answers).length;
  return (
    <aside className="agr-ledger" aria-label="Assessment record">
      <div className="agr-ledger-head">
        <span>Control record</span>
        <span>{done}/{QUESTIONS.length}</span>
      </div>
      {QUESTIONS.map((q, i) => {
        const val = answers[q.ref];
        const state = i === activeIndex ? "is-live" : val !== undefined ? "is-done" : "";
        return (
          <div key={q.ref} className={`agr-row ${state}`}>
            <span>{q.ref}</span>
            <span className="agr-row-dom">
              {DOMAINS.find((d) => d.id === q.domain).name.split(" ")[0].toLowerCase()}
            </span>
            <span className="agr-pips" aria-hidden="true">
              {[0, 1, 2].map((p) => (
                <i key={p} className={`agr-pip ${val !== undefined && p < val ? "on" : ""}`} />
              ))}
            </span>
          </div>
        );
      })}
      <div className="agr-ledger-foot">
        <span>Unattested</span>
        <span>draft</span>
      </div>
    </aside>
  );
}

function Report({ answers, onRestart }) {
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const total = useMemo(
    () => QUESTIONS.reduce((s, q) => s + (answers[q.ref] ?? 0), 0),
    [answers]
  );
  const tier = tierFor(total);
  const domains = useMemo(() => domainScores(answers), [answers]);

  const gaps = useMemo(
    () =>
      QUESTIONS.map((q) => ({ ...q, score: answers[q.ref] ?? 0 }))
        .sort((a, b) => a.score - b.score)
        .slice(0, 3),
    [answers]
  );

  const fwRows = useMemo(
    () =>
      FRAMEWORKS.map((fw) => {
        const worst = [...domains].sort((a, b) => a.pct - b.pct)[0];
        const avg = Math.round(domains.reduce((s, d) => s + d.pct, 0) / domains.length);
        return { ...fw, status: frameworkStatus(avg), weakest: worst, avg };
      }),
    [domains]
  );

  async function handleSend() {
    if (!/\S+@\S+\.\S+/.test(email)) return;
    setBusy(true);
    setFailed(false);
    try {
      await submitLead({ email, org, answers });
      setSent(true);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  const meterColour = (pct) =>
    pct >= 84 ? "var(--verify)" : pct >= 50 ? "var(--signal)" : "var(--alert)";

  return (
    <div className="agr-report agr-fade">
      <div className="agr-band">
        <div className="agr-band-top">
          <h2 className="agr-tier">
            <small>Readiness tier {tier.code}</small>
            {tier.label}
          </h2>
          <div className="agr-score">
            <b>{total}</b> / {MAX}
          </div>
        </div>
        <p>{tier.summary}</p>
        <div className="agr-next">
          <strong>Do this next.</strong> {tier.priority}
        </div>
      </div>

      <section className="agr-sec">
        <h3>Where the score comes from</h3>
        <p className="agr-sec-note">Six control domains, two questions each, scored zero to three.</p>
        <div className="agr-dom">
          {domains.map((d) => (
            <div className="agr-dom-row" key={d.id}>
              <span className="mono" style={{ fontSize: "0.78rem", color: "var(--slate)" }}>{d.id}</span>
              <span className="agr-dom-name">
                {d.name}
                <span>{d.premise}</span>
              </span>
              <span className="agr-meter">
                <i style={{ width: `${d.pct}%`, background: meterColour(d.pct) }} />
              </span>
              <span className="agr-dom-val">{d.got}/{d.max}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="agr-sec">
        <h3>Regulatory exposure</h3>
        <p className="agr-sec-note">
          Indicative mapping of your weakest domain against each framework's agent-relevant provisions.
        </p>
        <div className="agr-matrix">
          <table>
            <thead>
              <tr>
                <th>Framework</th>
                <th>Status</th>
                <th>Weakest linked provision</th>
              </tr>
            </thead>
            <tbody>
              {fwRows.map((fw) => (
                <tr key={fw.key}>
                  <td className="agr-fw-name">
                    {fw.name}
                    <span>{fw.note}</span>
                  </td>
                  <td>
                    <span className={`agr-pill ${fw.status.tone}`}>{fw.status.code}</span>
                  </td>
                  <td style={{ color: "var(--slate)" }}>{fw.weakest.frameworks[fw.key]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="agr-sec">
        <h3>Three controls to fix first</h3>
        <p className="agr-sec-note">Ordered by weakness, not by effort.</p>
        <div className="agr-gaps">
          {gaps.map((g) => {
            const d = DOMAINS.find((x) => x.id === g.domain);
            return (
              <div className="agr-gap" key={g.ref}>
                <div className="agr-gap-head">
                  <span>{g.ref}</span>
                  <span>·</span>
                  <span>{d.name}</span>
                  <span>·</span>
                  <span>scored {g.score}/3</span>
                </div>
                <p>{g.text}</p>
                <p className="agr-fix">
                  Current state: {g.options[g.score].replace(/\.$/, "")}. Target: {g.options[3].replace(/\.$/, "")}.
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="agr-capture">
        <h3>Get the full report</h3>
        <p>
          The full pack maps all twelve controls to IMDA, MAS, NIST, ISO 42001 and the EU AI Act,
          with the evidence each provision expects and a suggested order of work.
        </p>
        {!sent ? (
          <>
            <div className="agr-form">
              <input
                className="agr-input"
                type="email"
                placeholder="Work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Work email"
              />
              <input
                className="agr-input"
                type="text"
                placeholder="Organisation"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                aria-label="Organisation"
              />
              <button className="agr-cta" onClick={handleSend} disabled={busy}>
                {busy ? "Requesting" : "Request the report"}
              </button>
            </div>
            <p className="agr-note">
              Nothing is sent anywhere until you ask for the report. No account needed.{" "}
              <a href="/privacy" style={{ color: "var(--indigo)" }}>Privacy notice</a>
            </p>
            {failed && (
              <p className="agr-note" style={{ color: "var(--alert)" }}>
                That didn&apos;t save. Check your connection and try again.
              </p>
            )}
            {/* Moved out of the <p> above — a <div> nested inside a <p> is
                invalid HTML and can cause the browser to close the <p>
                early in unpredictable ways. Same visual placement, valid
                markup. */}
            <div className="agr-cross">
              <p className="agr-eyebrow" style={{ marginBottom: 0 }}>For a single agent</p>
              <h3>Deploying one specific agent?</h3>
              <p>
                Nine questions about that agent returns its risk tier, the controls that become
                mandatory before deployment, the OWASP agentic risks it exposes you to, and the
                provisions that attach. Nothing leaves your browser.
              </p>
              <a className="agr-cross-btn" href="/agent">Open the agent risk profiler →</a>
            </div>
          </>
        ) : (
          <div className="agr-done">
            Request received. The full report will be sent to {email} within one working day.
          </div>
        )}
      </div>

      <div className="agr-foot">
        <p>
          Mappings are indicative and current as at July 2026. They support readiness planning and are
          not a compliance determination or legal advice.
        </p>
        <p>© 2026 {OWNER}. All rights reserved.</p>
        <p>
          <button className="agr-restart" onClick={onRestart}>Start again</button>
        </p>
      </div>
    </div>
  );
}

export default function AgentGovernanceReadiness() {
  const t = useTranslations("home");
  const [stage, setStage] = useState("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const headingRef = useRef(null);

  const q = QUESTIONS[index];
  const domain = q ? DOMAINS.find((d) => d.id === q.domain) : null;

  useEffect(() => {
    if (stage === "run" && headingRef.current) headingRef.current.focus();
  }, [index, stage]);

  function choose(value) {
    const next = { ...answers, [q.ref]: value };
    setAnswers(next);
    if (index + 1 < QUESTIONS.length) setIndex(index + 1);
    else setStage("report");
  }

  function restart() {
    setAnswers({});
    setIndex(0);
    setStage("intro");
  }

  function startAssessment() {
    setStage("run");
    setTimeout(() => headingRef.current?.focus(), 60);
  }

  return (
    <div className="agr">
      <style>{CSS}</style>
      <PublicNav current="/" />
      <div className="agr-shell">
        {stage === "intro" && (
          <>
            <div className="agr-hero agr-fade">
              <p className="agr-eyebrow">{t("eyebrow")}</p>
              <h1>
                {t("heroLine1")}
                <br />
                <em>{t("heroLine2")}</em>
              </h1>
              <p className="agr-lede">{t("lede")}</p>

              <div className="agr-stats">
                {[
                  { value: STATS[0].value, caption: t("stat1Caption"), source: t("stat1Source") },
                  { value: STATS[1].value, caption: t("stat2Caption"), source: t("stat2Source") },
                  { value: STATS[2].value, caption: t("stat3Caption"), source: t("stat3Source") },
                ].map((s, i) => (
                  <div className="agr-stat" key={i}>
                    <b>{s.value}</b>
                    <span>{s.caption}</span>
                    <cite>— {s.source}</cite>
                  </div>
                ))}
              </div>

              <div className="agr-cta-row">
                <button className="agr-cta" onClick={startAssessment}>
                  {t("ctaAssess")}
                </button>
                <a className="agr-cta ghost" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("AI agent governance — pilot enquiry")}`}>
                  {t("ctaPilot")}
                </a>
              </div>
              <p className="agr-note">
                {t("privacyNote")}{" "}
                <a href="/privacy" style={{ color: "var(--indigo)" }}>{t("privacyLinkText")}</a>
              </p>
            </div>

            <section className="agr-section agr-fade">
              <h2>{t("howItWorksH2")}</h2>
              <p className="agr-section-lede">{t("howItWorksLede")}</p>
              <div className="agr-steps">
                <div className="agr-step">
                  <span className="agr-step-n">{t("step1Label")}</span>
                  <h3>{t("step1Title")}</h3>
                  <p>{t("step1Body")}</p>
                </div>
                <div className="agr-step">
                  <span className="agr-step-n">{t("step2Label")}</span>
                  <h3>{t("step2Title")}</h3>
                  <p>{t("step2Body")}</p>
                </div>
                <div className="agr-step">
                  <span className="agr-step-n">{t("step3Label")}</span>
                  <h3>{t("step3Title")}</h3>
                  <p>{t("step3Body")}</p>
                </div>
              </div>
            </section>

            <section className="agr-section agr-fade">
              <h2>{t("modulesH2")}</h2>
              <p className="agr-section-lede">{t("modulesLede")}</p>
              <div className="agr-modules">
                {[
                  { tone: MODULES[0].tone, tag: t("mod1Tag"), name: t("mod1Name"), body: t("mod1Body"), cta: t("mod1Cta"), href: MODULES[0].href },
                  { tone: MODULES[1].tone, tag: t("mod2Tag"), name: t("mod2Name"), body: t("mod2Body"), cta: t("mod2Cta"), href: MODULES[1].href },
                  { tone: MODULES[2].tone, tag: t("mod3Tag"), name: t("mod3Name"), body: t("mod3Body"), cta: t("mod3Cta"), href: MODULES[2].href },
                ].map((m) => (
                  <div className="agr-module" key={m.name}>
                    <span className={`agr-module-tag ${m.tone}`}>{m.tag}</span>
                    <h3>{m.name}</h3>
                    <p>{m.body}</p>
                    {m.href ? <a href={m.href}>{m.cta}</a> : <span className="agr-module-here">{m.cta}</span>}
                  </div>
                ))}
              </div>
            </section>

            <section className="agr-section agr-fade">
              <h2>{t("fwCoverageH2")}</h2>
              <p className="agr-section-lede">{t("fwCoverageLede")}</p>
              <div className="agr-fw-strip">
                {[
                  { key: FRAMEWORKS[0].key, short: FRAMEWORKS[0].short, name: t("fw1Name"), note: t("fw1Note") },
                  { key: FRAMEWORKS[1].key, short: FRAMEWORKS[1].short, name: t("fw2Name"), note: t("fw2Note") },
                  { key: FRAMEWORKS[2].key, short: FRAMEWORKS[2].short, name: t("fw3Name"), note: t("fw3Note") },
                  { key: FRAMEWORKS[3].key, short: FRAMEWORKS[3].short, name: t("fw4Name"), note: t("fw4Note") },
                  { key: FRAMEWORKS[4].key, short: FRAMEWORKS[4].short, name: t("fw5Name"), note: t("fw5Note") },
                ].map((fw) => (
                  <div className="agr-fw-chip" key={fw.key}>
                    <b>{fw.short}</b>{fw.name}
                    <span>{fw.note}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="agr-section agr-fade" style={{ paddingBottom: 56 }}>
              <h2>{t("securityH2")}</h2>
              <div className="agr-security-box">
                <p>{t("securityP1")}</p>
                <p>
                  {t.rich("securityP2", {
                    privacyLink: (chunks) => <a href="/privacy">{chunks}</a>,
                  })}
                </p>
              </div>
            </section>
          </>
        )}

        {stage === "run" && (
          <div className="agr-work">
            <Ledger answers={answers} activeIndex={index} />
            <div className="agr-card agr-fade" key={q.ref}>
              <div className="agr-qmeta">
                <span className="agr-tag">{q.ref}</span>
                <span>{domain.name}</span>
                <span>·</span>
                <span>{index + 1} of {QUESTIONS.length}</span>
              </div>
              <h2 tabIndex={-1} ref={headingRef}>{q.text}</h2>
              <p className="agr-help">{q.help}</p>

              <div className="agr-opts">
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    className={`agr-opt ${answers[q.ref] === i ? "is-picked" : ""}`}
                    onClick={() => choose(i)}
                  >
                    <span className="agr-opt-n">{i}</span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>

              <div className="agr-nav">
                <button
                  className="agr-back"
                  onClick={() => setIndex(Math.max(0, index - 1))}
                  disabled={index === 0}
                >
                  Back
                </button>
                <span className="mono" style={{ fontSize: "0.78rem", color: "var(--mute)" }}>
                  {domain.frameworks.imda}
                </span>
              </div>
            </div>
          </div>
        )}

        {stage === "report" && <Report answers={answers} onRestart={restart} />}
      </div>
    </div>
  );
}
