"use client";

import React, { useState, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { FACTORS, TIERS, CONTROLS, assess, encodeProfilerAnswers } from "../../../lib/riskModel";
import PublicNav from "../../../components/PublicNav";

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

/* ============================ MODEL ============================ *
 * Extracted to lib/riskModel.js so this page and the Agent Passport
 * system share one scoring engine instead of two copies that can
 * silently drift apart. See that file for FACTORS, TIERS, CONTROLS
 * and the assess() function itself — nothing here recomputes any of
 * the scoring logic, it only imports it.
 */
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
  .ap-head, .ap-name, .ap-q, .ap-go, .ap-live, .pubnav { display:none; }
  .ap-shell { max-width:none; padding:0; }
  .ap-rec { border:1px solid #999; margin-top:0; }
  .ap-block { break-inside:avoid; }
}
`;

/* ============================ COMPONENT ============================ */

// Maps each factor's stable id (from riskModel.js, e.g. "ACT") to its
// translation key number (f1-f9) — built once from FACTORS' existing
// order rather than a hardcoded list, so it stays correct even if
// riskModel.js's array order is ever revisited.
const FACTOR_TO_NUM = Object.fromEntries(FACTORS.map((f, i) => [f.id, i + 1]));

// Text-to-key lookup tables. assess() returns obligations/overrides as
// already-filtered arrays of plain English strings, not stable IDs —
// the filtering depends on the user's actual answers, so array
// position after filtering doesn't align with translation key numbers.
// Matching against the exact verbatim text from riskModel.js (copied
// character-for-character, including em-dashes) is the only reliable
// way to translate these without touching the shared file itself.
const OBLIGATION_TEXT_TO_KEY = {
  "IMDA Agentic MGF — Dimension 1 (bound the risk) and Dimension 3 (technical controls)": "ob1",
  "IMDA Agentic MGF — Dimension 2: meaningful human accountability": "ob2",
  "EU AI Act Article 14 — human oversight; Article 12 — record-keeping": "ob3",
  "EU AI Act Article 14(4) — ability to intervene or interrupt": "ob4",
  "EU AI Act Article 15 — accuracy, robustness and cybersecurity": "ob5",
  "PDPA / GDPR obligations; MAS AIRM where the estate is financial services": "ob6",
  "ISO/IEC 42001 Annex A — third-party and supplier controls": "ob7",
  "ISO/IEC 42001 Clause 6.1 and 8.1 — risk assessment and operational control": "ob8",
  "NIST AI RMF — MANAGE 1, MANAGE 2, MEASURE 2": "ob9",
};
const OVERRIDE_WHY_TO_KEY = {
  "Irreversible actions with no pre-action approval. This is the Replit pattern: an agent deleted a production database despite instructions to change nothing, with no attacker involved.": "ov1",
  "Shared credentials with an outward action channel. This is the Salesloft-Drift pattern: one compromised credential reached hundreds of downstream environments.": "ov2",
  "Publicly reachable and able to act outside your boundary. Anyone on the internet can supply its instructions.": "ov3",
  "Can be invoked by agents outside your control. Attribution to a human principal cannot be maintained.": "ov4",
  "Privilege plus untrusted input plus an outward channel — the combination behind most documented MCP and agent compromises.": "ov5",
  "Tools acquired from public marketplaces. The postmark-mcp package shipped fifteen clean releases before adding exfiltration code.": "ov6",
};
const TIER_LINE_KEY = { contained: "tierContainedLine", elevated: "tierElevatedLine", high: "tierHighLine", critical: "tierCriticalLine" };
const TIER_VERDICT_KEY = { contained: "tierContainedVerdict", elevated: "tierElevatedVerdict", high: "tierHighVerdict", critical: "tierCriticalVerdict" };

export default function AgentRiskProfiler() {
  const t = useTranslations("agent");
  const tf = useTranslations("footer");
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
      <PublicNav current="/agent" />
      <div className="ap-shell">
        <div className="ap-head">
          <p className="ap-eyebrow">{t("eyebrow")}</p>
          <h1>{t("h1")}</h1>
          <p className="ap-lede">{t("lede")}</p>
          <div className="ap-local">
            <strong>{t("localBold")}</strong> {t("localRest")}
          </div>
        </div>

        <div className="ap-name">
          <input className="ap-input" placeholder={t("namePlaceholder")}
            value={name} onChange={e => setName(e.target.value)} aria-label={t("namePlaceholder")} />
          <input className="ap-input" placeholder={t("purposePlaceholder")}
            value={purpose} onChange={e => setPurpose(e.target.value)} aria-label={t("purposePlaceholder")} />
        </div>

        <div className="ap-live">
          <span className="ap-live-l">{t("indicativeTier")}</span>
          <span className="ap-live-r">
            <span className="ap-count">{answered}/{FACTORS.length}</span>
            <span className={`ap-chip ${chipTone}`}>{preview ? chipText : t("awaitingInput")}</span>
          </span>
        </div>

        {FACTORS.map((f, idx) => {
          const num = FACTOR_TO_NUM[f.id];
          return (
            <div className="ap-q" key={f.id}>
              <div className="ap-q-head">
                <span className="ap-q-id">{f.id}</span>
                <span className="ap-q-label">{t(`f${num}Label`)} · {idx + 1} {t("ofWord")} {FACTORS.length}</span>
              </div>
              <h2>{t(`f${num}Q`)}</h2>
              <p className="ap-q-help">{t(`f${num}Help`)}</p>
              <div className="ap-opts">
                {[0, 1, 2, 3].map((i) => (
                  <button key={i} className={`ap-opt ${v[f.id] === i ? "on" : ""}`} onClick={() => pick(f.id, i)}>
                    <span className="ap-opt-n">{i}</span>
                    <span>{t(`f${num}Opt${i}`)}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        <div className="ap-go">
          <button className="ap-btn" onClick={generate} disabled={!complete}>
            {complete ? t("generateButton") : t("answerAllButton", { answered })}
          </button>
          {done && <button className="ap-ghost" onClick={() => window.print()}>{t("printButton")}</button>}
          {done && <button className="ap-ghost" onClick={reset}>{t("profileAnotherButton")}</button>}
        </div>

        {shown && (
          <div className="ap-rec" ref={recRef}>
            <div className="ap-rec-top">
              <p className="ap-rec-kicker">{t("recKicker")}</p>
              <h2 className="ap-rec-name">{name.trim() || t("unnamedAgent")}</h2>
              {purpose.trim() && <p className="ap-rec-purpose">{purpose.trim()}</p>}
              <div className="ap-rec-tier">
                <b>{tierMeta.code}</b>
                <span className="ap-rec-score">{shown.score} / {shown.max}</span>
              </div>
              <p className="ap-rec-line">{t(TIER_LINE_KEY[shown.tier])}</p>
              <p className={`ap-verdict ${tierMeta.tone}`}>{t(TIER_VERDICT_KEY[shown.tier])}</p>
            </div>

            {shown.overrides.length > 0 && (
              <div className="ap-block">
                <h3>{t("whyTierH3")}</h3>
                <p className="ap-block-note">{t("whyTierNote")}</p>
                {shown.overrides.map((o, i) => (
                  <div className="ap-esc" key={i}>
                    <b>{t("escalationToLabel")} {o.to}</b>
                    {t(OVERRIDE_WHY_TO_KEY[o.why])}
                  </div>
                ))}
              </div>
            )}

            <div className="ap-block">
              <h3>{t("mandatoryControlsH3")}</h3>
              <p className="ap-block-note">{t("mandatoryControlsNote")}</p>
              {shown.controls.must.map(id => (
                <div className="ap-ctl" key={id}>
                  <span className="ap-ctl-id">{id}</span>
                  <span>{t(`ctl${id.replace("-", "")}`)}</span>
                </div>
              ))}
              {shown.controls.should.length > 0 && (
                <>
                  <h3 style={{ marginTop: 22 }}>{t("recommendedH3")}</h3>
                  <p className="ap-block-note">{t("recommendedNote")}</p>
                  {shown.controls.should.map(id => (
                    <div className="ap-ctl opt" key={id}>
                      <span className="ap-ctl-id">{id}</span>
                      <span>{t(`ctl${id.replace("-", "")}`)}</span>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="ap-block">
              <h3>{t("exposedRisksH3")}</h3>
              <p className="ap-block-note">{t("exposedRisksNote")}</p>
              <div className="ap-tags">
                {shown.asi.map(a => (
                  <span className="ap-tag" key={a.id}><b>{a.id}</b> {t(a.id.toLowerCase())}</span>
                ))}
              </div>
            </div>

            <div className="ap-block">
              <h3>{t("provisionsH3")}</h3>
              <p className="ap-block-note">{t("provisionsNote")}</p>
              <ul className="ap-list">
                {shown.obligations.map((o, i) => <li key={i}>{t(OBLIGATION_TEXT_TO_KEY[o])}</li>)}
              </ul>
            </div>

            <div className="ap-block">
              <h3>{t("recordH3")}</h3>
              <div className="ap-meta">
                <div><span>{t("assessedLabel")}</span>{fmt(today)}</div>
                <div><span>{t("reviewByLabel")}</span>{fmt(review)}</div>
                <div><span>{t("tierLabel")}</span>{tierMeta.code}</div>
                <div><span>{t("profileLabel")}</span>{FACTORS.map(f => v[f.id]).join("")}</div>
              </div>
            </div>

            <div className="ap-block">
              <h3>{t("keepRecordH3")}</h3>
              <p className="ap-block-note">{t("keepRecordBody")}</p>
              <a className="ap-btn" style={{ display: "inline-block", textDecoration: "none", textAlign: "center" }}
                href={`/estate/new?a=${encodeProfilerAnswers(v)}&name=${encodeURIComponent(name.trim() || t("unnamedAgent"))}`}>
                {t("saveToEstateLink")}
              </a>
            </div>
          </div>
        )}

        <div className="ap-foot">
          <p>{t("footNote1")}</p>
          <p>{t("footNote2")}</p>
          <p>{t("footNote3")}</p>
          <p>
            © 2026 Aseem Mohan · <a href="/">{t("footAssessmentLink")}</a> · <a href="/privacy">{tf("privacy")}</a>
          </p>
        </div>
      </div>
    </div>
  );
}