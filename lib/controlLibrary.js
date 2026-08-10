/**
 * Control library — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: lib/controlLibrary.js
 *
 * Expands the short descriptions in lib/riskModel.js's CONTROLS object
 * into full detail for the public /controls page: objective, rationale,
 * implementation guidance, evidence expected, and which tier first
 * requires it. Framework mappings are duplicated here from the
 * per-domain mapping already used in the assessment (app/HomeClient.jsx)
 * rather than imported, to avoid touching that already-working file for
 * this change — worth consolidating into one shared lib/domains.js
 * later if the two ever need to change together.
 */

export const CONTROL_LIBRARY = [
  {
    ref: "INV-01", domain: "INV", domainName: "Discovery & inventory",
    name: "Central agent register",
    objective: "Every AI agent that exists is recorded in one authoritative list — not scattered across team spreadsheets, or existing only in someone's memory.",
    rationale: "You cannot govern, secure, or account for an agent you don't know exists. This is the control everything else depends on.",
    implementation: "Register each agent at the point of deployment, not during a periodic audit. Capture name, purpose, environment, owner and technology at minimum.",
    evidence: "A register export showing every entry with a named owner and a last-reviewed date.",
    appliesFrom: "contained", level: "must",
    frameworks: {
      imda: "Dimension 1 — Assess and bound the risks",
      mas: "AI risk management — AI usage identification and inventory",
      nist: "MAP",
      iso: "Clause 6.1 / Annex A.4",
      eu: "Article 26 — Deployer obligations",
    },
  },
  {
    ref: "INV-02", domain: "INV", domainName: "Discovery & inventory",
    name: "Shadow AI detection",
    objective: "Agents deployed without security review are discoverable — not just the agents someone remembered to register.",
    rationale: "A register only covers what people choose to add. Detection catches what they didn't.",
    implementation: "Network or SaaS discovery tooling, API gateway logging, or a lightweight scan for common agent frameworks and API key patterns.",
    evidence: "A record of at least one detection sweep and its findings, with follow-up actions logged.",
    appliesFrom: "high", level: "must", soonerAt: "contained and elevated",
    frameworks: {
      imda: "Dimension 1 — Assess and bound the risks",
      mas: "AI risk management — AI usage identification and inventory",
      nist: "MAP",
      iso: "Clause 6.1 / Annex A.4",
      eu: "Article 26 — Deployer obligations",
    },
  },
  {
    ref: "IDN-01", domain: "IDN", domainName: "Identity & attribution",
    name: "Unique agent identity",
    objective: "No agent shares credentials or an account with another agent, service, or person.",
    rationale: "Shared identity is the fastest way to lose the ability to attribute an action to a specific agent — and the fastest way for one compromise to become hundreds. See the Salesloft-Drift breach below.",
    implementation: "Provision each agent its own service identity at creation. Reject requests to reuse an existing credential for a new agent.",
    evidence: "An identity provider export showing a one-to-one mapping between agents and credentials.",
    appliesFrom: "contained", level: "must",
    frameworks: {
      imda: "Dimension 2 — Make humans meaningfully accountable",
      mas: "Scope and AI oversight",
      nist: "GOVERN",
      iso: "Annex A.9 — Responsible use",
      eu: "Article 14 — Human oversight",
    },
  },
  {
    ref: "IDN-02", domain: "IDN", domainName: "Identity & attribution",
    name: "Named human principal",
    objective: "Every agent has a specific, named human accountable for its purpose and continued need to exist — not a team, not a role. A person.",
    rationale: "This is the invariant the product is built around. A distribution list is not accountable; a named person is — and it's enforced at the database layer, not just asked for on a form.",
    implementation: "Capture the principal at registration. Require it before approval. Re-confirm it at every recertification.",
    evidence: "The Agent Passport's own principal field, plus the approval record showing it was checked before sign-off.",
    appliesFrom: "contained", level: "must",
    frameworks: {
      imda: "Dimension 2 — Make humans meaningfully accountable",
      mas: "Scope and AI oversight",
      nist: "GOVERN",
      iso: "Annex A.9 — Responsible use",
      eu: "Article 14 — Human oversight",
    },
  },
  {
    ref: "ENT-01", domain: "ENT", domainName: "Entitlement & least privilege",
    name: "Least-privilege entitlements",
    objective: "An agent holds only the permissions its stated task requires — not the broadest role available.",
    rationale: "The agent's blast radius is its entitlement set. Overprovisioning turns a routine prompt injection into a serious compromise.",
    implementation: "Scope entitlements at deployment. Compare granted access to actual usage on a defined cycle, and revoke what's unused.",
    evidence: "An access review showing granted-versus-used permissions per agent, with remediation tracked for gaps.",
    appliesFrom: "elevated", level: "must",
    frameworks: {
      imda: "Dimension 3 — Technical controls and processes",
      mas: "AI lifecycle management",
      nist: "MANAGE",
      iso: "Annex A.6 — AI system lifecycle",
      eu: "Article 15 — Accuracy, robustness, cybersecurity",
    },
  },
  {
    ref: "ENT-02", domain: "ENT", domainName: "Entitlement & least privilege",
    name: "Pre-deployment blast-radius assessment",
    objective: "Before an agent goes live, its tool bindings and data classifications are documented and its blast radius is rated.",
    rationale: "This is the assessment that catches an entitlement problem before deployment, rather than discovering it after.",
    implementation: "A short, standard checklist completed at registration: which tools, which systems, which data classes, reversibility of actions.",
    evidence: "The completed assessment attached to the Agent Passport.",
    appliesFrom: "high", level: "must", soonerAt: "elevated",
    frameworks: {
      imda: "Dimension 3 — Technical controls and processes",
      mas: "AI lifecycle management",
      nist: "MANAGE",
      iso: "Annex A.6 — AI system lifecycle",
      eu: "Article 15 — Accuracy, robustness, cybersecurity",
    },
  },
  {
    ref: "CRD-01", domain: "CRD", domainName: "Credential handling",
    name: "Vaulted, short-lived credentials",
    objective: "No agent's credential lives in a config file, environment variable, or as a long-lived static token.",
    rationale: "This is the exact failure mode behind the Salesloft-Drift breach — stolen OAuth tokens with no rotation reached over 700 downstream organisations. See below.",
    implementation: "Issue credentials from a vault, per-task where feasible, with automatic rotation.",
    evidence: "A vault audit log showing credential issuance and rotation events for the agent.",
    appliesFrom: "elevated", level: "must",
    frameworks: {
      imda: "Dimension 3 — Technical controls and processes",
      mas: "AI lifecycle management",
      nist: "MANAGE / COSAiS overlays (in development)",
      iso: "Annex A.6 — AI system lifecycle",
      eu: "Article 15 — Accuracy, robustness, cybersecurity",
    },
  },
  {
    ref: "CRD-02", domain: "CRD", domainName: "Credential handling",
    name: "Independent revocation",
    objective: "A single agent's access can be revoked without disrupting any other agent or system.",
    rationale: "If revoking one agent means an outage decision, revocation becomes something people avoid rather than something people do.",
    implementation: "Never share a credential across agents. Test revocation as part of onboarding, not only during an incident.",
    evidence: "A logged test revocation with confirmation that only the target agent lost access.",
    appliesFrom: "high", level: "must",
    frameworks: {
      imda: "Dimension 3 — Technical controls and processes",
      mas: "AI lifecycle management",
      nist: "MANAGE / COSAiS overlays (in development)",
      iso: "Annex A.6 — AI system lifecycle",
      eu: "Article 15 — Accuracy, robustness, cybersecurity",
    },
  },
  {
    ref: "AUD-01", domain: "AUD", domainName: "Audit & containment",
    name: "Tamper-evident action log",
    objective: "What an agent actually did — not just what it was asked — is recorded somewhere it cannot quietly edit.",
    rationale: "Prompts and outputs describe intent. Actions are what create liability. Log the actions.",
    implementation: "Log tool calls, writes and escalations to a store the agent itself has no write or delete access to. Review on a scheduled cycle, not only reactively.",
    evidence: "A sample of the action log for one agent, plus a record of the most recent scheduled review.",
    appliesFrom: "elevated", level: "must", soonerAt: "contained",
    frameworks: {
      imda: "Dimension 3 — Technical controls and processes",
      mas: "AI lifecycle management",
      nist: "MEASURE",
      iso: "Clause 9 — Performance evaluation",
      eu: "Article 12 — Record-keeping",
    },
  },
  {
    ref: "AUD-02", domain: "AUD", domainName: "Audit & containment",
    name: "Tested kill switch",
    objective: "A misbehaving agent can be stopped mid-task — and someone has actually tried it.",
    rationale: "An untested stop control is a belief, not a control. The Replit incident happened despite an explicit freeze instruction — the instruction lived in a prompt, not in an enforced control. See below.",
    implementation: "Define ownership and a target response time. Run the test at least annually, or after any material change to the agent.",
    evidence: "A dated test record: who ran it, how long it took, what happened.",
    appliesFrom: "high", level: "must", soonerAt: "elevated",
    frameworks: {
      imda: "Dimension 3 — Technical controls and processes",
      mas: "AI lifecycle management",
      nist: "MEASURE",
      iso: "Clause 9 — Performance evaluation",
      eu: "Article 12 — Record-keeping",
    },
  },
  {
    ref: "LFC-01", domain: "LFC", domainName: "Lifecycle & recertification",
    name: "Scheduled recertification",
    objective: "Every agent's entitlements and continued need are reconfirmed on a defined cycle — not left as a one-time decision.",
    rationale: "Access granted once and never reviewed becomes standing privilege — the same problem user access reviews exist to catch, applied to non-human identities.",
    implementation: "A recertification campaign with owner attestation, on a cycle set by risk tier (more frequent for higher tiers).",
    evidence: "A completed attestation record with the owner's confirmation and date.",
    appliesFrom: "contained", level: "must",
    frameworks: {
      imda: "Dimension 2 — Make humans meaningfully accountable",
      mas: "Scope and AI oversight",
      nist: "GOVERN",
      iso: "Clause 10 — Improvement",
      eu: "Article 26 — Deployer obligations",
    },
  },
  {
    ref: "LFC-02", domain: "LFC", domainName: "Lifecycle & recertification",
    name: "Decommissioning triggers",
    objective: "An agent is retired when its owner leaves or its purpose ends — both triggers, not just one.",
    rationale: "Orphaned agents with standing entitlements are the non-human equivalent of a dormant admin account nobody remembered to disable.",
    implementation: "Tie decommissioning to HR offboarding events and to a defined purpose-review cycle, with verification that access was actually removed.",
    evidence: "A decommissioning record showing the trigger, the action taken, and confirmation of removal.",
    appliesFrom: "critical", level: "must", soonerAt: "high",
    frameworks: {
      imda: "Dimension 2 — Make humans meaningfully accountable",
      mas: "Scope and AI oversight",
      nist: "GOVERN",
      iso: "Clause 10 — Improvement",
      eu: "Article 26 — Deployer obligations",
    },
  },
];

export const TIER_ORDER = ["contained", "elevated", "high", "critical"];
export const TIER_LABELS = { contained: "Contained", elevated: "Elevated", high: "High", critical: "Critical" };
