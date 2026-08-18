/**
 * Control library — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: lib/controlLibrary.js  (replaces existing)
 *
 * RESTRUCTURED for multilingual support. Every piece of display text
 * that used to live here (name, objective, rationale, implementation,
 * evidence, domain names, framework mapping text) has moved to the
 * translation system, under the "controls" namespace in
 * messages/<locale>.json, keyed by each control's ref with the hyphen
 * removed (e.g. "INV-01" → INV01). This file now holds only
 * identifiers and structural data — the things that don't change
 * across languages: which domain a control belongs to, which tier
 * first requires it, and whether it's recommended earlier.
 *
 * ONE FIX ALONGSIDE THE RESTRUCTURING: soonerAt used to be free
 * English text (e.g. "contained and elevated"), which meant it never
 * got capitalized or mapped the way appliesFrom does, and obviously
 * couldn't be translated. It's now an array of the same tier codes
 * used everywhere else, resolved through the same translated tier
 * labels the appliesFrom badge already uses.
 *
 * ANOTHER FIX: AUD-01's name is corrected from "Tamper-evident action
 * log" to match the honest "append-only" language already used on the
 * sample Passport page and the Security page — "tamper-evident"
 * implies cryptographic verification this system doesn't actually
 * have. This was flagged as a known gap during the critical-issues
 * review earlier and deliberately deferred to this restructuring
 * rather than left unfixed.
 */

export const CONTROL_LIBRARY = [
  { ref: "INV-01", domain: "INV", appliesFrom: "contained", level: "must" },
  { ref: "INV-02", domain: "INV", appliesFrom: "high", level: "must", soonerAt: ["contained", "elevated"] },
  { ref: "IDN-01", domain: "IDN", appliesFrom: "contained", level: "must" },
  { ref: "IDN-02", domain: "IDN", appliesFrom: "contained", level: "must" },
  { ref: "ENT-01", domain: "ENT", appliesFrom: "elevated", level: "must" },
  { ref: "ENT-02", domain: "ENT", appliesFrom: "high", level: "must", soonerAt: ["elevated"] },
  { ref: "CRD-01", domain: "CRD", appliesFrom: "elevated", level: "must" },
  { ref: "CRD-02", domain: "CRD", appliesFrom: "high", level: "must" },
  { ref: "AUD-01", domain: "AUD", appliesFrom: "elevated", level: "must", soonerAt: ["contained"] },
  { ref: "AUD-02", domain: "AUD", appliesFrom: "high", level: "must", soonerAt: ["elevated"] },
  { ref: "LFC-01", domain: "LFC", appliesFrom: "contained", level: "must" },
  { ref: "LFC-02", domain: "LFC", appliesFrom: "critical", level: "must", soonerAt: ["high"] },
];

export const TIER_ORDER = ["contained", "elevated", "high", "critical"];
export const DOMAIN_ORDER = ["INV", "IDN", "ENT", "CRD", "AUD", "LFC"];
