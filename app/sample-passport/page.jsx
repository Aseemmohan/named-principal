/**
 * Sample Agent Passport — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/sample-passport/page.jsx
 *
 * Public proof, per the v2.0 strategy document's "Essential public
 * proof" list: a sample Agent Passport showing identity, owner,
 * configuration, risk, approval, controls and evidence.
 *
 * DELIBERATELY mirrors the real authenticated Passport page's actual
 * section structure (Accountability / Purpose / Risk / Required
 * controls / Decision / History) rather than a prettier marketing
 * mockup — this is what the product actually produces, not an
 * idealised version of it. All data below is synthetic and clearly
 * labelled as such throughout.
 *
 * Plain Server Component — static content, no auth, no client state.
 */

import PublicNav from "../../components/PublicNav";

export const metadata = {
  title: "Sample Agent Passport",
  description: "A worked example of what an Agent Passport actually looks like — identity, accountability, risk, controls, approval and history.",
  alternates: { canonical: "https://www.namedprincipal.com/sample-passport" },
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;800&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

.spp {
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
.spp *, .spp *::before, .spp *::after { box-sizing:border-box; }
.spp-shell { max-width:820px; margin:0 auto; padding:0 22px 90px; }

.spp-banner {
  background:var(--signal-soft); border-bottom:2px solid var(--signal);
  padding:12px 22px; text-align:center; font-family:'IBM Plex Mono',monospace;
  font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:var(--signal); font-weight:600;
}

.spp-hero { padding:36px 0 8px; }
.spp-eyebrow { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--indigo); margin-bottom:12px; }
.spp h1 { font-family:'Archivo',sans-serif; font-size:clamp(1.6rem,4.5vw,2.1rem); font-weight:800; margin:0 0 10px; letter-spacing:-0.02em; }
.spp-lede { color:var(--slate); font-size:0.92rem; max-width:640px; margin-bottom:8px; }

.spp-pill { font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.06em; padding:4px 10px; display:inline-block; text-transform:uppercase; margin-right:6px; }
.spp-pill.verify { background:var(--verify-soft); color:var(--verify); }
.spp-pill.signal { background:var(--signal-soft); color:var(--signal); }

.spp h2 { font-family:'Archivo',sans-serif; font-size:1.1rem; font-weight:600; margin:36px 0 4px; }
.spp-card { border:1px solid var(--rule); background:var(--surface); padding:18px 22px; }
.spp-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.spp-field-label { font-size:0.68rem; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:var(--mute); margin-bottom:3px; }
.spp-field p { margin:0; font-size:0.9rem; }

.spp-ctl { padding:12px 0; border-bottom:1px solid #EDEFF3; display:grid; grid-template-columns:1fr auto; gap:10px; align-items:start; }
.spp-ctl:last-child { border-bottom:0; }
.spp-ctl-ref { font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--mute); }
.spp-ctl-name { font-size:0.88rem; margin-top:2px; }
.spp-ctl-meta { font-size:0.78rem; color:var(--mute); margin-top:4px; }
.spp-status { font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.05em; padding:3px 8px; text-transform:uppercase; height:fit-content; }
.spp-status.implemented { background:var(--verify-soft); color:var(--verify); }
.spp-status.in_progress { background:var(--signal-soft); color:var(--signal); }
.spp-status.missing { background:var(--alert-soft); color:var(--alert); }
.spp-status.exception { background:var(--signal-soft); color:var(--signal); }

.spp-hist { padding:10px 0; border-bottom:1px solid #EDEFF3; font-size:0.85rem; }
.spp-hist:last-child { border-bottom:0; }
.spp-hist-when { font-family:'IBM Plex Mono',monospace; color:var(--mute); font-size:0.78rem; }

.spp-cta { margin-top:44px; border:1px solid var(--indigo); background:var(--surface); padding:26px 28px; text-align:center; }
.spp-cta p { color:var(--slate); font-size:0.92rem; margin:0 0 16px; }
.spp-btn { display:inline-block; background:var(--indigo); color:#fff; text-decoration:none; padding:13px 24px; font-weight:600; font-size:0.92rem; border-radius:2px; }
.spp-btn:hover { background:#1A2260; }

.spp-foot { margin-top:44px; padding-top:20px; border-top:1px solid var(--rule); font-size:0.8rem; color:var(--mute); }
.spp-foot a { color:var(--indigo); }

@media (max-width:620px) {
  .spp-grid { grid-template-columns:1fr; }
  .spp-card { padding:16px; }
}
`;

const CONTROLS = [
  { ref: "INV-01", name: "Central agent register", status: "implemented", meta: "Owner: platform-team@example.com · closed 3 weeks ago" },
  { ref: "IDN-01", name: "Unique agent identity", status: "implemented", meta: "Owner: iam@example.com · closed 3 weeks ago" },
  { ref: "IDN-02", name: "Named human principal", status: "implemented", meta: "Priya Sharma confirmed at registration" },
  { ref: "ENT-01", name: "Least-privilege entitlements", status: "implemented", meta: "Owner: finance-systems@example.com · closed 2 weeks ago" },
  { ref: "CRD-01", name: "Vaulted, short-lived credentials", status: "implemented", meta: "Owner: platform-team@example.com · closed 4 days ago" },
  { ref: "AUD-01", name: "Append-only action log", status: "implemented", meta: "Owner: security-eng@example.com · closed 1 week ago" },
  { ref: "LFC-01", name: "Scheduled recertification", status: "exception",
    exceptionReason: "New agent, first recertification cycle not due until the standard 90-day mark. Tracked via the finance-systems team's existing quarterly access review instead of a separate campaign for now.",
    exceptionExpiry: "18 Oct 2026", exceptionApprovedBy: "raj.kumar@example.com (CISO)" },
];

const HISTORY = [
  { when: "12 Jul 2026, 09:14", what: "passport_created", who: "priya.sharma@example.com" },
  { when: "12 Jul 2026, 09:41", what: "control_updated — INV-01 marked implemented", who: "priya.sharma@example.com" },
  { when: "15 Jul 2026, 14:02", what: "control_updated — IDN-01 marked implemented", who: "iam-team@example.com" },
  { when: "18 Jul 2026, 11:30", what: "status_pending_approval", who: "priya.sharma@example.com" },
  { when: "19 Jul 2026, 16:47", what: "status_approved", who: "raj.kumar@example.com (CISO)" },
];

export default function SamplePassportPage() {
  return (
    <div className="spp">
      <style>{CSS}</style>
      <div className="spp-banner">Sample data — illustrative only, not a real organisation</div>
      <PublicNav current="/sample-passport" />
      <div className="spp-shell">
        <div className="spp-hero">
          <p className="spp-eyebrow">Agent Passport — worked example</p>
          <h1>Vendor Invoice Reconciliation Agent</h1>
          <p className="spp-lede">
            This is what a real Agent Passport looks like once it's been through registration,
            risk assessment, control tracking and approval — the actual product, not a mockup of it.
          </p>
          <span className="spp-pill verify">Approved</span>
          <span className="spp-pill signal">Elevated</span>
        </div>

        <h2>Accountability</h2>
        <div className="spp-card spp-grid">
          <div className="spp-field"><div className="spp-field-label">Named principal</div><p>Priya Sharma, Finance Systems Lead</p></div>
          <div className="spp-field"><div className="spp-field-label">Business owner</div><p>Finance Operations</p></div>
          <div className="spp-field"><div className="spp-field-label">Technical owner</div><p>Platform Engineering</p></div>
          <div className="spp-field"><div className="spp-field-label">Next review</div><p>19 Jan 2027</p></div>
        </div>

        <h2>Purpose</h2>
        <div className="spp-card">
          <div className="spp-field" style={{ marginBottom: 12 }}>
            <div className="spp-field-label">Business purpose</div>
            <p>Matches incoming vendor invoices against purchase orders and flags discrepancies for human review before payment release.</p>
          </div>
          <div className="spp-field" style={{ marginBottom: 12 }}>
            <div className="spp-field-label">Permitted tasks</div>
            <p>Read invoice data from the AP inbox. Cross-reference against the PO system. Write a match/discrepancy flag. Draft (not send) a query email to the vendor contact on file.</p>
          </div>
          <div className="spp-field">
            <div className="spp-field-label">Explicitly prohibited</div>
            <p>Cannot approve or release payment. Cannot modify PO records. Cannot send vendor communications without human review.</p>
          </div>
        </div>

        <h2>Risk</h2>
        <div className="spp-card">
          <p style={{ margin: "0 0 10px", fontSize: "0.9rem" }}>
            Elevated. This agent can write to internal systems and drafts (but does not send) external
            communications — meaningful capability, with no path to irreversible financial action.
          </p>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--slate)" }}>
            Score 14 / 42 · assessed under model version 2026.1
          </p>
        </div>

        <h2>Required controls</h2>
        <p style={{ fontSize: "0.85rem", color: "var(--mute)", margin: "0 0 10px" }}>
          7 of 7 mandatory controls closed — 6 implemented, 1 under a current, complete exception.
          This is what actually gates approval now, not just informational text.
        </p>
        <div className="spp-card" style={{ padding: 0 }}>
          {CONTROLS.map((c) => (
            <div key={c.ref} style={{ padding: "14px 22px", borderBottom: "1px solid #EDEFF3" }}>
              <div className="spp-ctl" style={{ padding: 0, border: 0 }}>
                <div>
                  <span className="spp-ctl-ref">{c.ref}</span>
                  <div className="spp-ctl-name">{c.name}</div>
                  {c.meta && <div className="spp-ctl-meta">{c.meta}</div>}
                </div>
                <span className={`spp-status ${c.status}`}>{c.status.replace("_", " ")}</span>
              </div>
              {c.status === "exception" && (
                <div style={{ marginTop: 10, padding: 12, background: "var(--signal-soft)", borderLeft: "3px solid var(--signal)" }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--signal)", marginBottom: 6 }}>
                    Exception record
                  </div>
                  <p style={{ margin: "0 0 8px", fontSize: "0.85rem" }}>{c.exceptionReason}</p>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--slate)" }}>
                    Expires {c.exceptionExpiry} · Approved by {c.exceptionApprovedBy}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <h2>Decision</h2>
        <div className="spp-card">
          <p style={{ margin: "0 0 10px", fontSize: "0.9rem" }}>
            Approved 19 Jul 2026 by Raj Kumar (CISO).
          </p>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--slate)" }}>
            Approval here required a named principal, a scheduled review date, and every mandatory
            control closed — implemented, or under a complete, current exception. That's not
            informational text; it's an actual gate. LFC-01's exception above (reason, expiry, named
            approver) is what closed that control, not a status dropdown flipped without a record
            behind it — an incomplete or expired exception would have kept this Passport blocked at
            Pending approval.
          </p>
        </div>

        <h2>History</h2>
        <div className="spp-card" style={{ padding: 0 }}>
          {HISTORY.map((h, i) => (
            <div className="spp-hist" key={i} style={{ padding: "12px 22px" }}>
              <span className="spp-hist-when">{h.when}</span> — <strong>{h.what}</strong> by {h.who}
            </div>
          ))}
        </div>

        <div className="spp-cta">
          <p>This is one agent, fully governed. A real pilot builds this for up to ten of yours in thirty days.</p>
          <a className="spp-btn" href="/pilot">See the pilot →</a>
        </div>

        <div className="spp-foot">
          <p>© 2026 Aseem Mohan · <a href="/">Assessment</a> · <a href="/sample-estate">Sample Estate</a> · <a href="/methodology">Methodology</a> · <a href="/controls">Control library</a></p>
        </div>
      </div>
    </div>
  );
}
