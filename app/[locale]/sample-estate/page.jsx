/**
 * Sample AI Estate — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/sample-estate/page.jsx
 *
 * Public proof, per the v2.0 strategy document's "Essential public
 * proof" list: an interactive sample Agent Estate with realistic
 * synthetic data. Mirrors the real authenticated /estate page's actual
 * structure (stat row, status filters, table columns) rather than an
 * idealised marketing version — same principle as /sample-passport.
 *
 * The "Vendor Invoice Reconciliation Agent" row deliberately matches
 * /sample-passport, so a visitor can click through from the estate
 * list to that exact agent's full Passport, same as the real product.
 *
 * Plain Server Component — static content, no auth, no client state
 * (the status filter is a set of anchor-style visual states shown at
 * once via CSS rather than interactive JS, since this is a fixed
 * demonstration, not a live filter over real data).
 */

import PublicNav from "../../../components/PublicNav";

export const metadata = {
  title: "Sample AI Estate",
  description: "A worked example of the AI Estate — the governed inventory of registered agents, their status, risk tier and ownership.",
  alternates: { canonical: "https://www.namedprincipal.com/sample-estate" },
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;800&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

.sest {
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
.sest *, .sest *::before, .sest *::after { box-sizing:border-box; }
.sest-shell { max-width:960px; margin:0 auto; padding:0 22px 90px; }

.sest-banner {
  background:var(--signal-soft); border-bottom:2px solid var(--signal);
  padding:12px 22px; text-align:center; font-family:'IBM Plex Mono',monospace;
  font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:var(--signal); font-weight:600;
}

.sest-hero { padding:36px 0 8px; max-width:680px; }
.sest-eyebrow { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--indigo); margin-bottom:12px; }
.sest h1 { font-family:'Archivo',sans-serif; font-size:clamp(1.7rem,4.5vw,2.3rem); font-weight:800; margin:0 0 10px; letter-spacing:-0.02em; }
.sest-lede { color:var(--slate); font-size:0.92rem; }

.sest-stat-row { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px; margin:24px 0 8px; }
.sest-stat { background:var(--surface); border:1px solid var(--rule); border-radius:2px; padding:16px; }
.sest-stat span { display:block; font-size:0.68rem; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:var(--mute); }
.sest-stat b { display:block; font-family:'Archivo',sans-serif; font-weight:800; font-size:1.7rem; letter-spacing:-0.02em; margin-top:4px; }

.sest-warn { background:var(--alert-soft); border-left:3px solid var(--alert); padding:14px 16px; font-size:0.87rem; margin:16px 0; }

.sest-card { border:1px solid var(--rule); background:var(--surface); margin-top:20px; overflow-x:auto; }
.sest-tbl { width:100%; border-collapse:collapse; }
.sest-tbl th, .sest-tbl td { padding:11px 14px; text-align:left; border-bottom:1px solid #EDEFF3; font-size:0.85rem; }
.sest-tbl th { font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--slate); font-weight:500; background:#FAFBFC; }
.sest-tbl tr:last-child td { border-bottom:0; }
.sest-agent-name { font-weight:600; }
.sest-agent-env { display:block; color:var(--mute); font-size:0.78rem; margin-top:2px; }

.sest-pill { font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.06em; padding:3px 8px; display:inline-block; text-transform:uppercase; }
.sest-pill.verify { background:var(--verify-soft); color:var(--verify); }
.sest-pill.signal { background:var(--signal-soft); color:var(--signal); }
.sest-pill.alert { background:var(--alert-soft); color:var(--alert); }
.sest-pill.idle { background:#EEF0F4; color:var(--mute); }

.sest-cta { margin-top:44px; border:1px solid var(--indigo); background:var(--surface); padding:26px 28px; text-align:center; }
.sest-cta p { color:var(--slate); font-size:0.92rem; margin:0 0 16px; }
.sest-btn { display:inline-block; background:var(--indigo); color:#fff; text-decoration:none; padding:13px 24px; font-weight:600; font-size:0.92rem; border-radius:2px; }
.sest-btn:hover { background:#1A2260; }

.sest-foot { margin-top:44px; padding-top:20px; border-top:1px solid var(--rule); font-size:0.8rem; color:var(--mute); }
.sest-foot a { color:var(--indigo); }

@media (max-width:620px) {
  .sest-tbl { font-size:0.78rem; }
}
`;

const STATUS_LABEL = { draft: "Draft", pending_approval: "Pending approval", approved: "Approved", retired: "Retired" };
const STATUS_TONE = { draft: "idle", pending_approval: "signal", approved: "verify", retired: "idle" };
const TIER_TONE = { contained: "verify", elevated: "signal", high: "alert", critical: "alert" };

const AGENTS = [
  { name: "Vendor Invoice Reconciliation Agent", env: "production", status: "approved", tier: "elevated", principal: "Priya Sharma", review: "19 Jan 2027", link: "/sample-passport" },
  { name: "Customer Support Triage Bot", env: "production", status: "approved", tier: "contained", principal: "Wei Ling Tan", review: "02 Nov 2026", link: null },
  { name: "Contract Clause Extraction Agent", env: "staging", status: "pending_approval", tier: "high", principal: "David Oyelaran", review: "—", link: null },
  { name: "Marketing Content Drafting Assistant", env: "production", status: "approved", tier: "contained", principal: "Sarah Mitchell", review: "14 Dec 2026", link: null },
  { name: "Infrastructure Auto-Remediation Agent", env: "staging", status: "draft", tier: "critical", principal: null, review: "—", link: null },
  { name: "HR Policy Q&A Chatbot", env: "production", status: "approved", tier: "contained", principal: "James Whitfield", review: "08 Mar 2027", link: null },
  { name: "Sales Lead Enrichment Agent", env: "production", status: "pending_approval", tier: "elevated", principal: "Amara Okafor", review: "—", link: null },
  { name: "Legacy Reporting Bot", env: "production", status: "retired", tier: "contained", principal: "Marcus Chen", review: "—", link: null },
];

export default function SampleEstatePage() {
  const total = AGENTS.length;
  const pending = AGENTS.filter((a) => a.status === "pending_approval").length;
  const highCritical = AGENTS.filter((a) => a.tier === "high" || a.tier === "critical").length;
  const orphans = AGENTS.filter((a) => !a.principal && a.status !== "retired");

  return (
    <div className="sest">
      <style>{CSS}</style>
      <div className="sest-banner">Sample data — illustrative only, not a real organisation</div>
      <PublicNav current="/sample-estate" />
      <div className="sest-shell">
        <div className="sest-hero">
          <p className="sest-eyebrow">AI Estate — worked example</p>
          <h1>Every registered agent, in one place.</h1>
          <p className="sest-lede">
            This is what the governed inventory actually looks like — status, risk tier, named
            principal and next review date, for every agent an organisation has registered. Click the
            first row to see its full Agent Passport.
          </p>
        </div>

        <div className="sest-stat-row">
          <div className="sest-stat"><span>Total registered</span><b>{total}</b></div>
          <div className="sest-stat"><span>Pending approval</span><b>{pending}</b></div>
          <div className="sest-stat"><span>High / critical</span><b>{highCritical}</b></div>
          <div className="sest-stat"><span>Without a named principal</span><b>{orphans.length}</b></div>
        </div>

        {orphans.length > 0 && (
          <div className="sest-warn">
            <strong>{orphans.length} agent</strong> has no named human principal on record — it cannot
            reach Approved status until that's fixed. This is enforced at the database layer, not just
            a reminder on screen.
          </div>
        )}

        <div className="sest-card">
          <table className="sest-tbl">
            <thead>
              <tr><th>Agent</th><th>Status</th><th>Tier</th><th>Named principal</th><th>Next review</th></tr>
            </thead>
            <tbody>
              {AGENTS.map((a) => (
                <tr key={a.name}>
                  <EstateRow a={a} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sest-cta">
          <p>Eight agents here. A real estate might have fifty — this is how you'd finally see all of them.</p>
          <a className="sest-btn" href="/pilot">Start a pilot on your own estate →</a>
        </div>

        <div className="sest-foot">
          <p>© 2026 Aseem Mohan · <a href="/">Assessment</a> · <a href="/sample-passport">Sample Passport</a> · <a href="/methodology">Methodology</a></p>
        </div>
      </div>
    </div>
  );
}

function EstateRow({ a }) {
  return (
    <>
      <td>
        {a.link ? (
          <a href={a.link} style={{ color: "var(--indigo)", textDecoration: "none", fontWeight: 600 }}>
            {a.name}
          </a>
        ) : (
          <span className="sest-agent-name">{a.name}</span>
        )}
        <span className="sest-agent-env">{a.env}</span>
      </td>
      <td><span className={`sest-pill ${STATUS_TONE[a.status]}`}>{STATUS_LABEL[a.status]}</span></td>
      <td><span className={`sest-pill ${TIER_TONE[a.tier]}`}>{a.tier}</span></td>
      <td>{a.principal || <span style={{ color: "var(--alert)" }}>Unassigned</span>}</td>
      <td>{a.review}</td>
    </>
  );
}
