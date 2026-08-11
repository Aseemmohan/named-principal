/**
 * Examples hub — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/examples/page.jsx
 *
 * Single, discoverable entry point for the two proof pages
 * (/sample-passport, /sample-estate), which were previously only
 * reachable via a small inline text link on /pilot — real
 * discoverability gap for a first-time visitor. Rather than add both
 * pages directly to the main nav (which starts crowding it), this adds
 * one nav slot that fans out to both.
 *
 * Plain Server Component — static content, no auth, no client state.
 */

import PublicNav from "../../components/PublicNav";

export const metadata = {
  title: "Examples",
  description: "See what Named Principal actually produces — a worked Agent Passport and a full sample AI Estate, both built from real product output.",
  alternates: { canonical: "https://www.namedprincipal.com/examples" },
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;800&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

.exh {
  --ink:#11151E; --slate:#59637A; --mute:#8B94A6;
  --paper:#EEF1F5; --surface:#FFFFFF; --rule:#D6DBE4;
  --indigo:#26307A; --indigo-soft:#E5E8F5;
  --signal:#9A6100; --signal-soft:#FAF0DC;
  background:var(--paper); color:var(--ink);
  font-family:'IBM Plex Sans',system-ui,sans-serif;
  font-size:15px; line-height:1.6; min-height:100vh;
  -webkit-font-smoothing:antialiased;
}
.exh *, .exh *::before, .exh *::after { box-sizing:border-box; }
.exh-shell { max-width:900px; margin:0 auto; padding:0 22px 90px; }

.exh-hero { padding:48px 0 8px; max-width:680px; }
.exh-eyebrow { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--indigo); margin-bottom:16px; }
.exh h1 { font-family:'Archivo',sans-serif; font-size:clamp(1.9rem,5vw,2.5rem); font-weight:800; letter-spacing:-0.028em; line-height:1.1; margin:0; }
.exh-lede { margin-top:18px; color:var(--slate); }

.exh-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:44px; }
.exh-card { border:1px solid var(--rule); background:var(--surface); padding:26px 26px 24px; display:flex; flex-direction:column; }
.exh-card-tag { font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.08em; text-transform:uppercase; color:var(--signal); background:var(--signal-soft); padding:4px 9px; width:fit-content; margin-bottom:14px; }
.exh-card h2 { font-family:'Archivo',sans-serif; font-size:1.2rem; font-weight:600; margin:0 0 10px; }
.exh-card p { color:var(--slate); font-size:0.9rem; flex:1; margin:0 0 18px; }
.exh-card a { display:inline-block; background:var(--indigo); color:#fff; text-decoration:none; padding:12px 20px; font-weight:600; font-size:0.88rem; border-radius:2px; width:fit-content; }
.exh-card a:hover { background:#1A2260; }

.exh-cta { margin-top:44px; border:1px solid var(--indigo); background:var(--surface); padding:26px 28px; text-align:center; }
.exh-cta p { color:var(--slate); font-size:0.92rem; margin:0 0 16px; }
.exh-btn { display:inline-block; background:var(--indigo); color:#fff; text-decoration:none; padding:13px 24px; font-weight:600; font-size:0.92rem; border-radius:2px; }
.exh-btn:hover { background:#1A2260; }

.exh-foot { margin-top:44px; padding-top:20px; border-top:1px solid var(--rule); font-size:0.8rem; color:var(--mute); }
.exh-foot a { color:var(--indigo); }

@media (max-width:620px) {
  .exh-grid { grid-template-columns:1fr; }
}
`;

export default function ExamplesPage() {
  return (
    <div className="exh">
      <style>{CSS}</style>
      <PublicNav current="/examples" />
      <div className="exh-shell">
        <div className="exh-hero">
          <p className="exh-eyebrow">See it before you request it</p>
          <h1>What Named Principal actually produces.</h1>
          <p className="exh-lede">
            Not a mockup — these are built from the same structure the real, authenticated product
            uses. Synthetic data throughout, clearly labelled, but the shape of it is exactly what a
            pilot would produce for your own estate.
          </p>
        </div>

        <div className="exh-grid">
          <div className="exh-card">
            <span className="exh-card-tag">Sample data</span>
            <h2>Agent Passport</h2>
            <p>
              One agent, fully governed: identity, named principal, purpose, risk score, control
              checklist, approval decision, and a full audit history — the actual record a pilot
              builds per agent.
            </p>
            <a href="/sample-passport">See a worked Passport →</a>
          </div>
          <div className="exh-card">
            <span className="exh-card-tag">Sample data</span>
            <h2>AI Estate</h2>
            <p>
              Eight agents, one inventory: status, risk tier, named principal and next review date for
              each — the governed view a CISO or CIO actually gets once agents stop living in
              spreadsheets.
            </p>
            <a href="/sample-estate">See a sample Estate →</a>
          </div>
        </div>

        <div className="exh-cta">
          <p>This is what a pilot builds for your own agents in thirty days, not synthetic ones.</p>
          <a className="exh-btn" href="/pilot">Start a pilot →</a>
        </div>

        <div className="exh-foot">
          <p>© 2026 Aseem Mohan · <a href="/">Assessment</a> · <a href="/methodology">Methodology</a> · <a href="/controls">Control library</a></p>
        </div>
      </div>
    </div>
  );
}
