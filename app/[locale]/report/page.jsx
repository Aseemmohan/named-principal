"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  analyse, decodeAnswers, isValidCode, FRAMEWORKS, frameworkStatus, DOMAINS,
} from "../../../lib/report";

/**
 * Personalised readiness report — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/report/page.jsx
 *
 * Scores are carried in the URL (?s=231023102310). Nothing is stored or looked up.
 */

const PDF = "/Named_Principal_Twelve_Controls.pdf";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;800&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

.rp {
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
.rp *, .rp *::before, .rp *::after { box-sizing:border-box; }
.rp-shell { max-width:820px; margin:0 auto; padding:0 22px 80px; }

.rp-bar {
  display:flex; align-items:center; justify-content:space-between; gap:14px;
  padding:14px 0; border-bottom:1px solid var(--rule);
  font-family:'IBM Plex Mono',monospace; font-size:11px;
  letter-spacing:0.1em; text-transform:uppercase; color:var(--slate);
}
.rp-bar b { color:var(--ink); font-weight:500; }
.rp-print {
  background:none; border:1px solid var(--rule); border-radius:2px;
  padding:6px 12px; font-family:'IBM Plex Mono',monospace; font-size:10px;
  letter-spacing:0.1em; text-transform:uppercase; color:var(--slate); cursor:pointer;
}
.rp-print:hover { border-color:var(--indigo); color:var(--indigo); }

.rp-hero { padding:48px 0 0; }
.rp-eyebrow { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--slate); margin-bottom:8px; }
.rp-tier { font-family:'Archivo',sans-serif; font-size:clamp(2.2rem,6vw,3.4rem); font-weight:800; letter-spacing:-0.03em; line-height:1.02; }
.rp-score { font-family:'IBM Plex Mono',monospace; font-size:1rem; color:var(--slate); margin-top:10px; }
.rp-score b { font-size:1.9rem; color:var(--ink); font-weight:600; }
.rp-sum { margin-top:18px; color:var(--slate); max-width:620px; }
.rp-start { margin-top:20px; padding:16px 18px; background:var(--signal-soft); border-left:3px solid var(--signal); max-width:660px; }

.rp-sec { margin-top:44px; }
.rp-sec h2 { font-family:'Archivo',sans-serif; font-size:1.2rem; font-weight:600; margin:0 0 4px; letter-spacing:-0.015em; }
.rp-note { font-size:0.86rem; color:var(--mute); margin:0 0 16px; }

.rp-card { border:1px solid var(--rule); background:var(--surface); }
.rp-row { display:grid; grid-template-columns:56px 1fr 130px 62px; gap:14px; align-items:center; padding:14px 16px; border-bottom:1px solid #EDEFF3; }
.rp-row:last-child { border-bottom:0; }
.rp-row-id { font-family:'IBM Plex Mono',monospace; font-size:0.78rem; color:var(--slate); }
.rp-row-name { font-weight:500; font-size:0.93rem; }
.rp-row-name span { display:block; font-size:0.8rem; color:var(--mute); font-weight:400; margin-top:1px; }
.rp-meter { height:8px; background:#E9ECF1; position:relative; }
.rp-meter i { position:absolute; inset:0 auto 0 0; display:block; }
.rp-val { font-family:'IBM Plex Mono',monospace; font-size:0.82rem; text-align:right; color:var(--slate); }

.rp-ctl { border-bottom:1px solid #EDEFF3; padding:16px; }
.rp-ctl:last-child { border-bottom:0; }
.rp-ctl-head { display:flex; flex-wrap:wrap; gap:9px; align-items:center; font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.06em; text-transform:uppercase; color:var(--slate); margin-bottom:8px; }
.rp-pips { display:flex; gap:2px; margin-left:auto; }
.rp-pip { width:6px; height:13px; background:#E3E6EC; }
.rp-pip.on { background:var(--indigo); }
.rp-ctl-name { font-weight:600; color:var(--ink); font-size:0.93rem; margin-bottom:8px; }
.rp-line { font-size:0.89rem; margin-bottom:4px; }
.rp-line b { color:var(--ink); font-weight:600; }
.rp-line span { color:var(--slate); }

.rp-tbl { width:100%; border-collapse:collapse; }
.rp-tbl th, .rp-tbl td { padding:11px 14px; text-align:left; border-bottom:1px solid #EDEFF3; font-size:0.85rem; }
.rp-tbl th { font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--slate); font-weight:500; background:#FAFBFC; }
.rp-tbl tr:last-child td { border-bottom:0; }
.rp-fw { font-weight:500; }
.rp-fw span { display:block; font-size:0.78rem; color:var(--mute); font-weight:400; margin-top:2px; }
.rp-pill { font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.08em; padding:3px 7px; display:inline-block; }
.rp-pill.verify { background:var(--verify-soft); color:var(--verify); }
.rp-pill.signal { background:var(--signal-soft); color:var(--signal); }
.rp-pill.alert  { background:var(--alert-soft);  color:var(--alert); }

.rp-seq { counter-reset:step; }
.rp-seq li { margin-bottom:10px; color:var(--slate); }
.rp-seq li strong { color:var(--ink); }

.rp-cta { margin-top:44px; border:1px solid var(--indigo); background:var(--surface); padding:26px 28px; }
.rp-cta h2 { font-family:'Archivo',sans-serif; font-size:1.1rem; font-weight:600; margin:0 0 8px; }
.rp-cta p { color:var(--slate); font-size:0.92rem; margin:0 0 18px; max-width:560px; }
.rp-btn { display:inline-block; background:var(--indigo); color:#fff; text-decoration:none; padding:13px 24px; font-weight:600; font-size:0.95rem; border-radius:2px; }
.rp-btn:hover { background:#1A2260; }

.rp-foot { margin-top:44px; padding-top:20px; border-top:1px solid var(--rule); font-size:0.8rem; color:var(--mute); }
.rp-foot p { margin:0 0 8px; }
.rp-foot a { color:var(--indigo); }

.rp-empty { padding:80px 0; max-width:520px; }
.rp-empty h1 { font-family:'Archivo',sans-serif; font-size:1.8rem; font-weight:800; letter-spacing:-0.02em; margin:0 0 12px; }
.rp-empty p { color:var(--slate); margin:0 0 20px; }

@media (max-width:720px) {
  .rp-row { grid-template-columns:48px 1fr 56px; }
  .rp-row .rp-meter { display:none; }
  .rp-tbl { font-size:0.8rem; }
}

@media print {
  .rp { background:#fff; }
  .rp-print, .rp-cta { display:none; }
  .rp-shell { max-width:none; padding:0; }
  .rp-sec { break-inside:avoid; }
  .rp-ctl { break-inside:avoid; }
  .rp-card { border-color:#bbb; }
}
`;

function meterColour(pct) {
  return pct >= 84 ? "var(--verify)" : pct >= 50 ? "var(--signal)" : "var(--alert)";
}

function ReportBody() {
  const params = useSearchParams();
  const code = params.get("s");
  const org = params.get("o");

  if (!isValidCode(code)) {
    return (
      <div className="rp-empty">
        <h1>No results in this link</h1>
        <p>
          This page renders a readiness report from the link sent with your assessment results.
          The link appears to be incomplete or altered — check it was copied in full.
        </p>
        <a className="rp-btn" href="/">Take the assessment</a>
      </div>
    );
  }

  const a = analyse(decodeAnswers(code));
  const { total, max, tier, domains, scored, gaps, weakest } = a;
  const avg = Math.round(domains.reduce((s, d) => s + d.pct, 0) / domains.length);

  return (
    <>
      <div className="rp-hero">
        <p className="rp-eyebrow">Readiness tier {tier.code}{org ? ` · ${org}` : ""}</p>
        <h1 className="rp-tier">{tier.label}</h1>
        <p className="rp-score"><b>{total}</b> / {max}</p>
        <p className="rp-sum">{tier.summary}</p>
        <div className="rp-start">
          <strong>Where to start.</strong> {tier.firstMove}
        </div>
      </div>

      <section className="rp-sec">
        <h2>Your six domains</h2>
        <p className="rp-note">Two controls each, scored zero to three.</p>
        <div className="rp-card">
          {domains.map(d => (
            <div className="rp-row" key={d.id}>
              <span className="rp-row-id">{d.id}</span>
              <span className="rp-row-name">
                {d.name}<span>{d.premise}</span>
              </span>
              <span className="rp-meter">
                <i style={{ width: `${d.pct}%`, background: meterColour(d.pct) }} />
              </span>
              <span className="rp-val">{d.got}/{d.max}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rp-sec">
        <h2>All twelve controls</h2>
        <p className="rp-note">Where you are now, and what the target state looks like.</p>
        <div className="rp-card">
          {scored.map(c => {
            const d = DOMAINS.find(x => x.id === c.domain);
            return (
              <div className="rp-ctl" key={c.ref}>
                <div className="rp-ctl-head">
                  <span>{c.ref}</span>
                  <span>·</span>
                  <span>{d.name}</span>
                  <span className="rp-pips" aria-label={`Scored ${c.score} of 3`}>
                    {[0, 1, 2].map(p => (
                      <i key={p} className={`rp-pip ${p < c.score ? "on" : ""}`} />
                    ))}
                  </span>
                </div>
                <div className="rp-ctl-name">{c.name}</div>
                <p className="rp-line"><b>Now:</b> <span>{c.states[c.score]}</span></p>
                <p className="rp-line"><b>Target:</b> <span>{c.target}</span></p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rp-sec">
        <h2>Three controls to fix first</h2>
        <p className="rp-note">Ordered by weakness, not by effort.</p>
        <div className="rp-card">
          {gaps.map(g => (
            <div className="rp-ctl" key={g.ref} style={{ borderLeft: "3px solid var(--alert)" }}>
              <div className="rp-ctl-head">
                <span>{g.ref}</span><span>·</span><span>scored {g.score}/3</span>
              </div>
              <div className="rp-ctl-name">{g.name}</div>
              <p className="rp-line"><b>Now:</b> <span>{g.states[g.score]}</span></p>
              <p className="rp-line"><b>Target:</b> <span>{g.target}</span></p>
            </div>
          ))}
        </div>
      </section>

      <section className="rp-sec">
        <h2>Regulatory exposure</h2>
        <p className="rp-note">
          Indicative mapping of your weakest domain — {weakest.name.toLowerCase()} — against each
          framework's agent-relevant provisions.
        </p>
        <div className="rp-card" style={{ overflowX: "auto" }}>
          <table className="rp-tbl">
            <thead>
              <tr><th>Framework</th><th>Status</th><th>Weakest linked provision</th></tr>
            </thead>
            <tbody>
              {FRAMEWORKS.map(fw => {
                const st = frameworkStatus(avg);
                return (
                  <tr key={fw.key}>
                    <td className="rp-fw">{fw.name}<span>{fw.note}</span></td>
                    <td><span className={`rp-pill ${st.tone}`}>{st.code}</span></td>
                    <td style={{ color: "var(--slate)" }}>{weakest.frameworks[fw.key]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rp-sec">
        <h2>Your order of work</h2>
        <p className="rp-note">Sequenced so each stage makes the next one cheaper.</p>
        <ol className="rp-seq">
          {tier.sequence.map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      </section>
<div className="rp-cta" style={{ marginTop: 44 }}>
        <h2>Deploying a specific agent?</h2>
        <p>
          The risk profiler asks nine questions about one agent and returns its risk tier, which controls
          become mandatory, and which OWASP agentic risks it exposes you to.
        </p>
        <a className="rp-btn" href="/agent">Open the agent risk profiler</a>
      </div>
      <div className="rp-cta">
        <h2>The twelve-control reference document</h2>
        <p>
          Eighteen pages covering what each control looks like when it is working, the evidence an
          auditor will ask for, and where every control lands across IMDA, MAS, NIST, ISO/IEC 42001
          and the EU AI Act.
        </p>
        <a className="rp-btn" href={PDF}>Download the PDF</a>
      </div>

      <div className="rp-foot">
        <p>
          This report was generated from the answers in your link. Nothing was stored to produce it,
          and nothing in the link identifies you or your organisation unless you added a name.
        </p>
        <p>
          Mappings are indicative and current as at July 2026. Provided for readiness planning — not
          a compliance determination, and not legal advice.
        </p>
        <p>
          © 2026 Aseem Mohan · <a href="/privacy">Privacy notice</a> · <a href="/">Take the assessment</a>
        </p>
      </div>
    </>
  );
}

export default function ReportPage() {
  return (
    <div className="rp">
      <style>{CSS}</style>
      <div className="rp-shell">
        <div className="rp-bar">
          <span><b>Named Principal</b> — Readiness report</span>
          <button className="rp-print" onClick={() => window.print()}>Print or save as PDF</button>
        </div>
        <Suspense fallback={<div style={{ padding: "80px 0", color: "var(--slate)" }}>Loading your report…</div>}>
          <ReportBody />
        </Suspense>
      </div>
    </div>
  );
}