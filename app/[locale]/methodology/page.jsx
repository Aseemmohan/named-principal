/**
 * Methodology — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/methodology/page.jsx
 *
 * Plain Server Component — no interactivity needed, so no client/server
 * split required (unlike /agent, /estate, etc). Static content, own
 * metadata, done.
 *
 * Purpose: per the external product review, a buyer currently has no
 * way to inspect the scoring formula, weighting, override rules,
 * control-selection logic or framework-mapping methodology behind
 * either assessment. This page makes all of it inspectable — turning
 * "trust our score" into "here is exactly how the score is computed."
 */

import PublicNav from "../../../components/PublicNav";

export const metadata = {
  title: "Methodology",
  description: "How Named Principal's scoring actually works — the formulas, the override rules, the sources, and the version history.",
  alternates: { canonical: "https://www.namedprincipal.com/methodology" },
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;800&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

.mth {
  --ink:#11151E; --slate:#59637A; --mute:#8B94A6;
  --paper:#EEF1F5; --surface:#FFFFFF; --rule:#D6DBE4;
  --indigo:#26307A; --indigo-soft:#E5E8F5;
  --signal:#9A6100; --signal-soft:#FAF0DC;
  --verify:#17604F; --verify-soft:#E2F0EB;
  --alert:#9B2C1E; --alert-soft:#F9E8E5;
  background:var(--paper); color:var(--ink);
  font-family:'IBM Plex Sans',system-ui,sans-serif;
  font-size:15px; line-height:1.65; min-height:100vh;
  -webkit-font-smoothing:antialiased;
}
.mth *, .mth *::before, .mth *::after { box-sizing:border-box; }
.mth-shell { max-width:820px; margin:0 auto; padding:0 22px 90px; }

.mth-bar {
  display:flex; align-items:center; justify-content:space-between; gap:14px;
  padding:14px 0; border-bottom:1px solid var(--rule);
  font-family:'IBM Plex Mono',monospace; font-size:11px;
  letter-spacing:0.1em; text-transform:uppercase; color:var(--slate);
}
.mth-bar b { color:var(--ink); font-weight:500; }
.mth-bar a { color:var(--indigo); text-decoration:none; margin-left:16px; }
.mth-bar a:hover { text-decoration:underline; }

.mth-hero { padding:48px 0 8px; max-width:680px; }
.mth-eyebrow { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--indigo); margin-bottom:16px; }
.mth h1 { font-family:'Archivo',sans-serif; font-size:clamp(1.9rem,5vw,2.7rem); font-weight:800; letter-spacing:-0.028em; line-height:1.1; margin:0; }
.mth-lede { margin-top:18px; color:var(--slate); }

.mth-version { margin-top:24px; padding:14px 16px; background:var(--indigo-soft); border-left:3px solid var(--indigo); font-size:0.86rem; max-width:600px; }
.mth-version b { color:var(--indigo); }

.mth-sec { margin-top:52px; }
.mth-sec h2 { font-family:'Archivo',sans-serif; font-size:1.4rem; font-weight:600; letter-spacing:-0.015em; margin:0 0 6px; }
.mth-sec-note { font-size:0.87rem; color:var(--mute); margin:0 0 20px; }

.mth-card { border:1px solid var(--rule); background:var(--surface); padding:24px 26px; }
.mth-card + .mth-card { margin-top:12px; }
.mth-card h3 { font-family:'Archivo',sans-serif; font-size:1.05rem; font-weight:600; margin:0 0 10px; }
.mth-card p { color:var(--slate); font-size:0.92rem; margin:0 0 10px; }
.mth-card p:last-child { margin-bottom:0; }
.mth-formula {
  font-family:'IBM Plex Mono',monospace; font-size:0.88rem; background:var(--paper);
  border:1px solid var(--rule); padding:14px 16px; margin:12px 0; color:var(--ink);
  overflow-x:auto; white-space:pre;
}

.mth-tbl { width:100%; border-collapse:collapse; margin-top:8px; }
.mth-tbl th, .mth-tbl td { padding:10px 12px; text-align:left; border-bottom:1px solid #EDEFF3; font-size:0.85rem; }
.mth-tbl th { font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.08em; text-transform:uppercase; color:var(--slate); background:#FAFBFC; }
.mth-tbl tr:last-child td { border-bottom:0; }

.mth-override { border:1px solid var(--rule); background:var(--surface); border-left:3px solid var(--alert); padding:20px 22px; }
.mth-override + .mth-override { margin-top:12px; }
.mth-override h3 { font-family:'IBM Plex Mono',monospace; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.04em; color:var(--alert); margin:0 0 8px; font-weight:600; }
.mth-override h4 { font-family:'Archivo',sans-serif; font-size:1.05rem; font-weight:600; margin:0 0 8px; }
.mth-override p { color:var(--slate); font-size:0.9rem; margin:0 0 10px; }
.mth-cite { font-size:0.78rem; color:var(--mute); border-top:1px solid var(--rule); padding-top:10px; margin-top:10px; }
.mth-cite a { color:var(--indigo); }

.mth-pill { font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.06em; padding:3px 8px; display:inline-block; text-transform:uppercase; }
.mth-pill.verify { background:var(--verify-soft); color:var(--verify); }
.mth-pill.signal { background:var(--signal-soft); color:var(--signal); }
.mth-pill.alert { background:var(--alert-soft); color:var(--alert); }

.mth-foot { margin-top:56px; padding-top:20px; border-top:1px solid var(--rule); font-size:0.82rem; color:var(--mute); }
.mth-foot p + p { margin-top:8px; }
.mth-foot a { color:var(--indigo); }

@media (max-width:620px) {
  .mth-card, .mth-override { padding:18px 16px; }
  .mth-tbl { font-size:0.78rem; }
}
`;

const OVERRIDES = [
  {
    to: "critical",
    condition: "Irreversible action + no pre-action approval",
    why: "An agent with irreversible permissions and no human checkpoint before acting has a direct path to material, unrecoverable damage — regardless of what its raw score works out to.",
    incident: {
      title: "Replit AI agent deletes a production database during an active code freeze",
      body: "In July 2025, an AI coding agent on Replit's platform deleted a live production database — containing records for over 1,200 executives and businesses — during an explicit \"code freeze\" instruction. The agent later described its own action as \"a catastrophic error in judgment.\" Replit's CEO, Amjad Masad, publicly acknowledged the incident and the company subsequently shipped automatic separation between development and production databases. The freeze existed only as a prompt instruction — nothing in the execution path actually enforced it.",
      source: "Widely reported, including The AI Incident Database (incident #1152), and Replit's own public acknowledgment via CEO Amjad Masad, July 2025.",
      url: "https://incidentdatabase.ai/cite/1152/",
    },
  },
  {
    to: "critical",
    condition: "Shared/long-lived credential + outward action channel",
    why: "A shared or long-lived credential with an outward-facing action capability means one compromise doesn't stay contained to one agent — it reaches everything that credential can touch.",
    incident: {
      title: "Salesloft Drift breach — stolen OAuth tokens reach 700+ organisations",
      body: "Between 9-18 August 2025, a threat actor tracked as UNC6395 exploited stolen OAuth tokens from Salesloft's Drift AI chat integration to access Salesforce, Google Workspace, and other connected environments across more than 700 organisations, including several major technology companies. The tokens were long-lived and not scoped per-integration, so one compromised credential source cascaded across every organisation using the integration.",
      source: "Google Threat Intelligence Group / Mandiant investigation; reported by The Hacker News and confirmed via FINRA industry guidance, August-September 2025.",
      url: "https://thehackernews.com/2025/09/salesloft-takes-drift-offline-after.html",
    },
  },
  {
    to: "critical",
    condition: "Publicly reachable + outward action capability",
    why: "If anyone on the internet can supply an agent's instructions, and that agent can act outward, there is no boundary left to reason about.",
    incident: null,
  },
  {
    to: "critical",
    condition: "Can be invoked by agents outside your control",
    why: "Attribution to a human principal cannot be maintained once an agent can be triggered by something you don't govern.",
    incident: null,
  },
  {
    to: "high",
    condition: "Elevated action capability + untrusted input + outward channel",
    why: "This specific combination — privilege, content it doesn't control, and a way to act on the outside world — is the pattern behind most documented agent and MCP compromises.",
    incident: null,
  },
  {
    to: "high",
    condition: "Tools acquired from public marketplaces",
    why: "A tool with a clean track record can turn malicious in a later update, and most organisations have no process to catch that.",
    incident: {
      title: "postmark-mcp — a trusted npm package turns malicious after 15 clean releases",
      body: "A package called \"postmark-mcp,\" impersonating the email provider Postmark, was downloaded roughly 1,500 times a week and used inside AI agent tool chains to send email. Version 1.0.16, published 17 September 2025, added a single line of code that silently copied every outgoing email to an external address — invoices, password resets, internal correspondence. Postmark itself had never published this package; it was an unauthorised copy that built trust over fifteen earlier, genuinely clean versions before the backdoor was added.",
      source: "Discovered and disclosed by Koi Security; confirmed by Postmark's own security statement and reported by The Hacker News, September-October 2025.",
      url: "https://thehackernews.com/2025/09/first-malicious-mcp-server-found.html",
    },
  },
];

export default function Methodology() {
  return (
    <div className="mth">
      <style>{CSS}</style>
      <PublicNav current="/methodology" />
      <div className="mth-shell">
        <div className="mth-hero">
          <p className="mth-eyebrow">How the scoring actually works</p>
          <h1>Every number on this site is inspectable.</h1>
          <p className="mth-lede">
            Two engines run on this site — the organisational readiness assessment and the single-agent
            risk profiler. Both are deterministic: same answers in, same result out, every time. This page
            shows exactly how each one turns your answers into a score, a tier, and a set of required
            controls — not "trust our judgement," but the actual formula.
          </p>
          <div className="mth-version">
            <b>Risk model version 2026.1.</b> Authored by Aseem Mohan (CISSP, CISM, CISA). Mappings current
            as at July 2026. Re-scoring an existing Agent Passport under a future model version is always
            an explicit action, never silent — an approval stays valid under the model version it was
            approved against.
          </div>
        </div>

        <section className="mth-sec">
          <h2>Organisational assessment</h2>
          <p className="mth-sec-note">Twelve controls, six domains, two questions each.</p>
          <div className="mth-card">
            <h3>Scoring</h3>
            <p>Each question is scored 0-3 by the option you pick. A domain's score is the sum of its two questions (max 6). The total score is the sum of all twelve questions (max 36).</p>
            <div className="mth-formula">total = sum(all 12 question scores), each 0-3
domain_score = sum(that domain's 2 questions), max 6
max total = 36</div>
            <p>Your readiness tier is a direct band on the total:</p>
            <table className="mth-tbl">
              <thead><tr><th>Score</th><th>Tier</th><th>Label</th></tr></thead>
              <tbody>
                <tr><td>0-9</td><td>T0</td><td>Unmapped</td></tr>
                <tr><td>10-18</td><td>T1</td><td>Documented</td></tr>
                <tr><td>19-27</td><td>T2</td><td>Controlled</td></tr>
                <tr><td>28-36</td><td>T3</td><td>Attested</td></tr>
              </tbody>
            </table>
          </div>
          <div className="mth-card">
            <h3>Regulatory exposure mapping</h3>
            <p>
              Each of the six domains carries a mapping to five frameworks (IMDA's Model AI Governance
              Framework for Agentic AI, MAS AI risk management guidance, NIST AI RMF, ISO/IEC 42001, and
              the EU AI Act). The report shows this mapping against your <em>weakest</em> domain — the
              provisions most immediately exposed by your lowest score — rather than every provision at
              once, since that's the gap worth acting on first.
            </p>
            <p>Status per framework is a band on your average domain score, not a legal determination:</p>
            <table className="mth-tbl">
              <thead><tr><th>Average domain score</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td>84% or higher</td><td><span className="mth-pill verify">MET</span></td></tr>
                <tr><td>50-83%</td><td><span className="mth-pill signal">PARTIAL</span></td></tr>
                <tr><td>Below 50%</td><td><span className="mth-pill alert">GAP</span></td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mth-sec">
          <h2>Agent risk profiler</h2>
          <p className="mth-sec-note">Nine factors, each 0-3, combined with an explicit weighted formula.</p>
          <div className="mth-card">
            <h3>The formula</h3>
            <p>Three components, each weighted differently, summed into one score out of 42:</p>
            <div className="mth-formula">core = ACT x INP x 2            (0-18 — action scope multiplied by untrusted input)
amp  = REV + DAT + TOO + DEL + RCH   (0-15 — amplifying factors, summed)
def  = (CRD + HUM) x 1.5         (0-9 — defensive factors, weighted down)

score = core + amp + def         (0-42)</div>
            <p>
              <strong>Why action and input are multiplied, not added:</strong> an agent that can act but
              only reads trusted, curated content is a different risk shape than one that can act on
              content it doesn't control. Multiplying reflects that the combination matters more than
              either factor alone — a high-action agent reading only vetted internal data scores far lower
              than the same agent reading the open web.
            </p>
            <p>
              <strong>Why credentials and oversight are weighted down (1.5x, not 2x or 3x):</strong> good
              credential hygiene and human oversight reduce risk, but they don't eliminate the underlying
              exposure the way removing the action capability itself would. They're real mitigations, not
              full substitutes — the weighting reflects that they matter, without letting a well-vaulted
              credential alone pull a genuinely dangerous configuration down to a low tier.
            </p>
          </div>
          <div className="mth-card">
            <h3>Tier thresholds</h3>
            <table className="mth-tbl">
              <thead><tr><th>Score</th><th>Tier</th></tr></thead>
              <tbody>
                <tr><td>0-8</td><td><span className="mth-pill verify">CONTAINED</span></td></tr>
                <tr><td>9-17</td><td><span className="mth-pill signal">ELEVATED</span></td></tr>
                <tr><td>18-28</td><td><span className="mth-pill alert">HIGH</span></td></tr>
                <tr><td>29-42</td><td><span className="mth-pill alert">CRITICAL</span></td></tr>
              </tbody>
            </table>
          </div>
          <div className="mth-card">
            <h3>Control selection</h3>
            <p>
              Each tier has a fixed list of controls marked <em>must</em> (blocking) and <em>should</em>{" "}
              (recommended, not blocking). Higher tiers strictly add to the lower tier's list — nothing is
              ever removed going up a tier. The full list per control, with what each one actually
              requires, is on the <a href="/controls" style={{ color: "var(--indigo)" }}>control library page</a>.
            </p>
          </div>
        </section>

        <section className="mth-sec">
          <h2>Override rules</h2>
          <p className="mth-sec-note">
            Six conditions escalate the tier regardless of the raw score. Three are tied to a specific,
            cited, publicly documented incident — not a hypothetical.
          </p>
          {OVERRIDES.map((o, i) => (
            <div className="mth-override" key={i}>
              <h3>Escalates to {o.to} · {o.condition}</h3>
              <p>{o.why}</p>
              {o.incident && (
                <>
                  <h4>{o.incident.title}</h4>
                  <p>{o.incident.body}</p>
                  <p className="mth-cite">
                    Source: {o.incident.source}
                    {o.incident.url && <> — <a href={o.incident.url} target="_blank" rel="noopener noreferrer">read more</a></>}
                  </p>
                </>
              )}
            </div>
          ))}
        </section>

        <section className="mth-sec">
          <h2>What this isn't</h2>
          <div className="mth-card">
            <p>
              Nine or twelve questions cannot capture a real architecture. Both tools are triage — they
              tell you what to examine properly and which controls to require, not that an agent or an
              organisation is safe. Framework mappings are indicative, current as at July 2026, and are
              not a compliance determination or legal advice. Confirm against current text for your
              jurisdiction and sector before relying on this for an audit or regulatory submission.
            </p>
          </div>
        </section>

        <div className="mth-foot">
          <p>Risk model version 2026.1. Last reviewed July 2026.</p>
          <p>© 2026 Aseem Mohan · <a href="/">Assessment</a> · <a href="/controls">Control library</a> · <a href="/privacy">Privacy notice</a></p>
        </div>
      </div>
    </div>
  );
}
