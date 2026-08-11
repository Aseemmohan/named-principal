"use client";

/**
 * Pilot page — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/pilot/page.jsx
 *
 * Structure follows the "30-day pilot product" section of the v2.0
 * strategy document almost directly: scope, discover/assess/govern/
 * demonstrate/report, success criteria, and an honestly-framed pricing
 * hypothesis rather than a fixed number stated as fact.
 *
 * The form posts to /api/pilot-enquiry — a real backend, replacing the
 * mailto: link that depended on the visitor's OS having a default mail
 * client configured (confirmed broken in practice).
 *
 * NOTE ON WHAT'S LIVE VS. WHAT'S SOLICITED: publishing this page is
 * infrastructure — it exists for whoever finds it, the same category
 * as the site's other public pages. Actively directing people to it
 * (outreach, buyer interviews, announcing it) is a separate decision,
 * held pending the standing disclosure question discussed elsewhere.
 */

import { useState } from "react";
import PublicNav from "../../components/PublicNav";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;800&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

.plt {
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
.plt *, .plt *::before, .plt *::after { box-sizing:border-box; }
.plt-shell { max-width:900px; margin:0 auto; padding:0 22px 90px; }

.plt-hero { padding:48px 0 8px; max-width:700px; }
.plt-eyebrow { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--indigo); margin-bottom:16px; }
.plt h1 { font-family:'Archivo',sans-serif; font-size:clamp(1.9rem,5vw,2.7rem); font-weight:800; letter-spacing:-0.028em; line-height:1.1; margin:0; }
.plt-lede { margin-top:18px; color:var(--slate); }

.plt-sec { margin-top:48px; }
.plt-sec h2 { font-family:'Archivo',sans-serif; font-size:1.35rem; font-weight:600; letter-spacing:-0.015em; margin:0 0 18px; }

.plt-tbl { width:100%; border-collapse:collapse; }
.plt-tbl td { padding:14px 16px; border-bottom:1px solid var(--rule); font-size:0.9rem; vertical-align:top; }
.plt-tbl tr:last-child td { border-bottom:0; }
.plt-tbl td:first-child { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.06em; text-transform:uppercase; color:var(--indigo); width:150px; white-space:nowrap; padding-top:16px; }
.plt-tbl-wrap { border:1px solid var(--rule); background:var(--surface); }

.plt-hyp { margin-top:16px; padding:16px 18px; background:var(--signal-soft); border-left:3px solid var(--signal); font-size:0.87rem; color:var(--ink); }

.plt-form-card { border:1px solid var(--indigo); background:var(--surface); padding:28px 30px; margin-top:20px; }
.plt-field { margin-bottom:16px; }
.plt-field label { display:block; font-size:0.74rem; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:var(--slate); margin-bottom:6px; }
.plt-field input, .plt-field select, .plt-field textarea {
  width:100%; padding:12px 13px; border:1px solid var(--rule); border-radius:2px;
  font-family:'IBM Plex Sans',sans-serif; font-size:0.95rem; background:var(--surface); color:var(--ink);
}
.plt-field input:focus, .plt-field select:focus, .plt-field textarea:focus { outline:2px solid var(--indigo); outline-offset:1px; border-color:var(--indigo); }
.plt-field textarea { resize:vertical; min-height:90px; }
.plt-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }

.plt-btn {
  background:var(--indigo); color:#fff; border:0; border-radius:2px;
  padding:14px 26px; font-family:'Archivo',sans-serif; font-weight:600; font-size:0.97rem; cursor:pointer;
}
.plt-btn:hover { background:#1A2260; }
.plt-btn:disabled { background:var(--mute); cursor:not-allowed; }

.plt-done { padding:16px 18px; background:var(--verify-soft); border-left:3px solid var(--verify); font-size:0.9rem; }
.plt-error { padding:14px 16px; background:var(--alert-soft); border-left:3px solid var(--alert); font-size:0.87rem; margin-top:14px; }

.plt-foot { margin-top:56px; padding-top:20px; border-top:1px solid var(--rule); font-size:0.82rem; color:var(--mute); }
.plt-foot a { color:var(--indigo); }

@media (max-width:620px) {
  .plt-row { grid-template-columns:1fr; }
  .plt-form-card { padding:20px 18px; }
  .plt-tbl td:first-child { width:auto; display:block; padding-bottom:2px; }
}
`;

export default function PilotPage() {
  const [form, setForm] = useState({ name: "", email: "", organisation: "", role: "", estimatedAgents: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/pilot-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="plt">
      <style>{CSS}</style>
      <PublicNav current="/pilot" />
      <div className="plt-shell">
        <div className="plt-hero">
          <p className="plt-eyebrow">30-day pilot</p>
          <h1>Prove it on your real AI estate, not a demo.</h1>
          <p className="plt-lede">
            One organisation, up to ten agents, one governance workflow. In thirty days: a real
            inventory, real risk profiles, real Agent Passports with named owners, and one live
            demonstration of what happens when an approved agent's configuration changes.
          </p>
        </div>

        <section className="plt-sec">
          <h2>What's included</h2>
          <div className="plt-tbl-wrap">
            <table className="plt-tbl">
              <tbody>
                <tr><td>Scope</td><td>One organisation, up to 10 agents, defined stakeholders, one governance workflow.</td></tr>
                <tr><td>Discover</td><td>An inventory workshop plus CSV, API, or manual candidate capture — whatever fits how your estate is actually tracked today.</td></tr>
                <tr><td>Assess</td><td>The organisational readiness assessment, plus individual risk profiles for the agents in scope.</td></tr>
                <tr><td>Govern</td><td>Agent Passports, named principals, controls, evidence, and a real approval decision on each agent.</td></tr>
                <tr><td>Demonstrate</td><td>One material-change scenario, and one recertification workflow, run end to end.</td></tr>
                <tr><td>Report</td><td>A CISO/CIO findings summary, a board-level readout, and a 90-day roadmap.</td></tr>
                <tr><td>Success criteria</td><td>Estate completeness, ownership coverage, approval turnaround time, control closure rate, and whether the executive summary was actually useful.</td></tr>
              </tbody>
            </table>
          </div>
          <div className="plt-hyp">
            <strong>On pricing:</strong> the working range for the first design partners is SGD 5,000-10,000.
            That's a starting hypothesis, not a fixed quote — final scope and price get shaped in
            conversation with you, against what actually matters for your estate.
          </div>
          <p style={{ marginTop: 16, fontSize: "0.87rem" }}>
            Not sure what this actually produces? <a href="/sample-passport" style={{ color: "var(--indigo)" }}>See a worked example of an Agent Passport →</a>
          </p>
        </section>

        <section className="plt-sec">
          <h2>Request a pilot</h2>
          <div className="plt-form-card">
            {sent ? (
              <div className="plt-done">
                Received — thank you. A confirmation has been sent to your email, and I'll follow up
                directly to discuss scope.
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="plt-row">
                  <div className="plt-field">
                    <label htmlFor="name">Name</label>
                    <input id="name" required value={form.name} onChange={(e) => update("name", e.target.value)} />
                  </div>
                  <div className="plt-field">
                    <label htmlFor="email">Work email</label>
                    <input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} />
                  </div>
                </div>
                <div className="plt-row">
                  <div className="plt-field">
                    <label htmlFor="organisation">Organisation</label>
                    <input id="organisation" value={form.organisation} onChange={(e) => update("organisation", e.target.value)} />
                  </div>
                  <div className="plt-field">
                    <label htmlFor="role">Your role</label>
                    <input id="role" placeholder="e.g. CISO, Head of GRC, IAM Lead" value={form.role} onChange={(e) => update("role", e.target.value)} />
                  </div>
                </div>
                <div className="plt-field">
                  <label htmlFor="estimatedAgents">Roughly how many AI agents do you have today?</label>
                  <select id="estimatedAgents" value={form.estimatedAgents} onChange={(e) => update("estimatedAgents", e.target.value)}>
                    <option value="">Prefer not to say / not sure</option>
                    <option value="1-5">1-5</option>
                    <option value="6-20">6-20</option>
                    <option value="21-50">21-50</option>
                    <option value="50+">50+</option>
                  </select>
                </div>
                <div className="plt-field">
                  <label htmlFor="message">Anything specific you want the pilot to cover?</label>
                  <textarea id="message" value={form.message} onChange={(e) => update("message", e.target.value)} />
                </div>
                <button className="plt-btn" type="submit" disabled={busy}>
                  {busy ? "Sending…" : "Request a pilot"}
                </button>
                {error && <div className="plt-error">{error}</div>}
              </form>
            )}
          </div>
        </section>

        <div className="plt-foot">
          <p>© 2026 Aseem Mohan · <a href="/">Assessment</a> · <a href="/methodology">Methodology</a> · <a href="/privacy">Privacy notice</a></p>
        </div>
      </div>
    </div>
  );
}
