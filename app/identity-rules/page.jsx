/**
 * Five Rules for Agent Identity — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/identity-rules/page.jsx
 *
 * Original content and wording. Not derived from or modelled on any
 * third party's specific text, examples, or diagram — the underlying
 * ideas (unique identity, named accountability, least privilege,
 * action-level logging, independent revocation) are standard,
 * widely-held IAM principles applied to agents, not anyone's
 * proprietary framing. What makes this page worth publishing is that
 * each rule links straight through to the real control that actually
 * enforces it in the product — not just stated, built.
 *
 * Plain Server Component — static content, no auth, no client state.
 * Deliberately not in the main nav (a thought-leadership page, not a
 * core product tab) — cross-linked from /methodology and /controls
 * instead, and shareable standalone via direct URL.
 */

import PublicNav from "../../components/PublicNav";

export const metadata = {
  title: "Five Rules for Agent Identity",
  description: "Five plain rules for trusting an AI agent — each one tied to the specific control that actually enforces it, not just a principle on a slide.",
  alternates: { canonical: "https://www.namedprincipal.com/identity-rules" },
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;800&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

.idr {
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
.idr *, .idr *::before, .idr *::after { box-sizing:border-box; }
.idr-shell { max-width:820px; margin:0 auto; padding:0 22px 90px; }

.idr-hero { padding:48px 0 8px; max-width:680px; }
.idr-eyebrow { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--indigo); margin-bottom:16px; }
.idr h1 { font-family:'Archivo',sans-serif; font-size:clamp(1.9rem,5vw,2.6rem); font-weight:800; letter-spacing:-0.028em; line-height:1.1; margin:0; }
.idr-lede { margin-top:18px; color:var(--slate); }

.idr-rule { border:1px solid var(--rule); background:var(--surface); margin-top:16px; overflow:hidden; }
.idr-rule-head { display:flex; align-items:flex-start; gap:18px; padding:24px 26px 20px; }
.idr-num { font-family:'Archivo',sans-serif; font-size:2rem; font-weight:800; color:var(--indigo-soft); -webkit-text-stroke:1.5px var(--indigo); line-height:1; flex-shrink:0; }
.idr-rule h2 { font-family:'Archivo',sans-serif; font-size:1.25rem; font-weight:600; margin:0 0 8px; }
.idr-rule p { color:var(--slate); font-size:0.95rem; margin:0; line-height:1.5; }

.idr-risk { margin:0 26px 20px; padding:12px 16px; background:var(--alert-soft); border-left:3px solid var(--alert); font-size:0.87rem; color:var(--ink); }
.idr-risk b { color:var(--alert); font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.06em; text-transform:uppercase; display:block; margin-bottom:4px; }

.idr-enforced { display:flex; align-items:center; justify-content:space-between; padding:12px 26px; background:var(--verify-soft); border-top:1px solid var(--rule); }
.idr-enforced span { font-size:0.82rem; color:var(--verify); }
.idr-enforced span b { font-family:'IBM Plex Mono',monospace; }
.idr-enforced a { font-size:0.82rem; font-weight:600; color:var(--verify); text-decoration:none; }
.idr-enforced a:hover { text-decoration:underline; }

.idr-loop { margin-top:52px; }
.idr-loop h2 { font-family:'Archivo',sans-serif; font-size:1.3rem; font-weight:600; margin:0 0 8px; }
.idr-loop-note { color:var(--slate); font-size:0.9rem; margin:0 0 24px; }
.idr-loop-row { display:flex; align-items:center; flex-wrap:wrap; gap:0; }
.idr-loop-step { flex:1 1 130px; text-align:center; }
.idr-loop-circle { width:52px; height:52px; border-radius:50%; background:var(--indigo); color:#fff; display:flex; align-items:center; justify-content:center; margin:0 auto 8px; font-family:'IBM Plex Mono',monospace; font-size:11px; font-weight:600; }
.idr-loop-step div.lbl { font-size:0.82rem; font-weight:600; color:var(--ink); }
.idr-loop-arrow { color:var(--mute); font-size:1.2rem; padding:0 4px 24px; }

.idr-cta { margin-top:52px; border:1px solid var(--indigo); background:var(--surface); padding:26px 28px; text-align:center; }
.idr-cta p { color:var(--slate); font-size:0.92rem; margin:0 0 16px; }
.idr-btn { display:inline-block; background:var(--indigo); color:#fff; text-decoration:none; padding:13px 24px; font-weight:600; font-size:0.92rem; border-radius:2px; }
.idr-btn:hover { background:#1A2260; }

.idr-foot { margin-top:44px; padding-top:20px; border-top:1px solid var(--rule); font-size:0.8rem; color:var(--mute); }
.idr-foot a { color:var(--indigo); }

@media (max-width:620px) {
  .idr-rule-head { padding:20px 18px 16px; }
  .idr-risk, .idr-enforced { margin-left:18px; margin-right:18px; padding-left:16px; padding-right:16px; }
  .idr-loop-row { flex-direction:column; }
  .idr-loop-arrow { transform:rotate(90deg); padding:4px 0; }
}
`;

const RULES = [
  {
    n: "01", h: "No Shared Identities",
    p: "Every agent is provisioned its own identity at creation. Reusing an existing service account isn't a shortcut \u2014 it's the fastest way to destroy attribution the moment two agents share a credential.",
    risk: "One compromised credential now means every agent behind it is compromised, and there's no way to tell which one actually did it.",
    ref: "IDN-01", refName: "Unique agent identity",
  },
  {
    n: "02", h: "A Human Is Named, Not Implied",
    p: "An agent isn't accountable to itself. A specific person has to be willing to answer for why it exists and what it's permitted to do \u2014 not a team distribution list. A person.",
    risk: "Without a name attached, \u201Cthe agent did it\u201D has nowhere to go. There's no one left to ask.",
    ref: "IDN-02", refName: "Named human principal",
  },
  {
    n: "03", h: "Privilege Matches the Task, Nothing More",
    p: "An agent holds only the access its current task requires \u2014 reviewed against what it actually uses, not what it was granted on day one and never revisited.",
    risk: "Excess privilege is dormant risk. A single prompt injection turns unused access into a live incident.",
    ref: "ENT-01", refName: "Least-privilege entitlements",
  },
  {
    n: "04", h: "Every Action Leaves a Record",
    p: "What an agent actually did \u2014 not what it was asked to do \u2014 belongs in a log it cannot edit or delete. Prompts show intent. Actions show consequence.",
    risk: "Without an action-level record, \u201Cthe agent did it\u201D can never be verified. Only claimed.",
    ref: "AUD-01", refName: "Append-only action log",
  },
  {
    n: "05", h: "Revoking One Should Never Touch the Rest",
    p: "If disabling one agent risks breaking three others, credentials were shared somewhere they shouldn't have been. Revocation should be immediate, surgical, and boring.",
    risk: "Shared blast radius turns revocation into a business decision instead of a security reflex \u2014 so it gets delayed, and the exposure sits open longer.",
    ref: "CRD-02", refName: "Independent revocation",
  },
];

const LOOP = ["Register", "Assess", "Name a Principal", "Close Controls", "Approve", "Audit & Recertify"];

export default function IdentityRulesPage() {
  return (
    <div className="idr">
      <style>{CSS}</style>
      <PublicNav current="/identity-rules" />
      <div className="idr-shell">
        <div className="idr-hero">
          <p className="idr-eyebrow">Five Rules for Agent Identity</p>
          <h1>Before you trust an AI agent, ask these five questions.</h1>
          <p className="idr-lede">
            None of this is new. It's the same discipline identity and access management has applied to
            humans for decades, pointed at a new kind of actor. What's different here is that each rule
            below links straight to the actual control that enforces it — not a slide, a real gate in
            the product.
          </p>
        </div>

        {RULES.map((r) => (
          <div className="idr-rule" key={r.ref}>
            <div className="idr-rule-head">
              <span className="idr-num">{r.n}</span>
              <div>
                <h2>{r.h}</h2>
                <p>{r.p}</p>
              </div>
            </div>
            <div className="idr-risk">
              <b>The risk if you don't</b>
              {r.risk}
            </div>
            <div className="idr-enforced">
              <span>Enforced by <b>{r.ref}</b> — {r.refName}</span>
              <a href={`/controls#${r.ref}`}>See the control →</a>
            </div>
          </div>
        ))}

        <div className="idr-loop">
          <h2>How this runs as a loop, not a one-time checklist</h2>
          <p className="idr-loop-note">The same seven-step cycle behind every Agent Passport on this site — it closes, and starts again at recertification.</p>
          <div className="idr-loop-row">
            {LOOP.map((step, i) => (
              <div className="idr-loop-step" key={step} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div className="idr-loop-circle">{i + 1}</div>
                  <div className="lbl">{step}</div>
                </div>
                {i < LOOP.length - 1 && <span className="idr-loop-arrow">→</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="idr-cta">
          <p>Curious what these five rules look like as a real record, not a rule of thumb?</p>
          <a className="idr-btn" href="/sample-passport">See a worked Agent Passport →</a>
        </div>

        <div className="idr-foot">
          <p>© 2026 Aseem Mohan · <a href="/controls">Full control library</a> · <a href="/methodology">Methodology</a> · <a href="/">Assessment</a></p>
        </div>
      </div>
    </div>
  );
}
