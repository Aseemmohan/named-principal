import { CONTROL_LIBRARY, TIER_LABELS } from "../../../lib/controlLibrary";
import PublicNav from "../../../components/PublicNav";

/**
 * Control library — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/controls/page.jsx
 *
 * Plain Server Component, same reasoning as /methodology — static
 * content, no interactivity beyond native <details>/<summary>, so no
 * client/server split needed.
 */

export const metadata = {
  title: "Control Library",
  description: "All twelve controls — objective, rationale, implementation guidance, evidence expected, and which risk tier first requires each one.",
  alternates: { canonical: "https://www.namedprincipal.com/controls" },
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;800&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

.ctl-page {
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
.ctl-page *, .ctl-page *::before, .ctl-page *::after { box-sizing:border-box; }
.ctl-shell { max-width:860px; margin:0 auto; padding:0 22px 90px; }

/* Prominent banner linking to the Five Rules page. Deliberately a
   simple, ordinary in-flow block — no position:fixed, no rotation.
   The previous version used position:fixed + rotate(), which is a
   known source of cross-browser inconsistency (any ancestor element
   that later gets a CSS transform silently breaks fixed positioning,
   since that ancestor becomes the new containing block instead of
   the viewport). This version can't suffer from that class of bug at
   all, because it doesn't use either technique. It also, separately,
   used the class name ".ctl-badge" -- already used elsewhere on this
   page for the small "Must from Contained" pills -- so the two rules
   collided and the later one silently won. Renamed to avoid any
   possibility of that happening again.
   A gentle pulse, not a strobe: rapid flashing is a documented
   seizure trigger for photosensitive users, so this pulses slowly,
   and stops entirely for anyone with prefers-reduced-motion set. */
.ctl-rules-banner {
  display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
  background: var(--indigo); border-radius: 6px;
  padding: 18px 24px; margin: 28px 0 8px;
  box-shadow: 0 0 0 0 rgba(38,48,122,0.5);
  animation: ctlRulesPulse 2.6s ease-in-out infinite;
}
.ctl-rules-banner-text { display: flex; align-items: center; gap: 10px; }
.ctl-rules-banner-dot { width: 8px; height: 8px; border-radius: 50%; background: #C9A84C; flex-shrink: 0; }
.ctl-rules-banner p { margin: 0; color: #fff; font-size: 0.95rem; }
.ctl-rules-banner p b { font-weight: 700; }
.ctl-rules-banner a {
  background: #fff; color: var(--indigo); text-decoration: none; font-weight: 600;
  font-size: 0.85rem; padding: 9px 16px; border-radius: 4px; white-space: nowrap;
}
.ctl-rules-banner a:hover { background: #E5E8F5; }
@keyframes ctlRulesPulse {
  0%   { box-shadow: 0 0 0 0 rgba(38,48,122,0.45); }
  70%  { box-shadow: 0 0 0 12px rgba(38,48,122,0); }
  100% { box-shadow: 0 0 0 0 rgba(38,48,122,0); }
}
@media (prefers-reduced-motion: reduce) {
  .ctl-rules-banner { animation: none; }
}

.ctl-bar {
  display:flex; align-items:center; justify-content:space-between; gap:14px;
  padding:14px 0; border-bottom:1px solid var(--rule);
  font-family:'IBM Plex Mono',monospace; font-size:11px;
  letter-spacing:0.1em; text-transform:uppercase; color:var(--slate);
}
.ctl-bar b { color:var(--ink); font-weight:500; }
.ctl-bar a { color:var(--indigo); text-decoration:none; margin-left:16px; }
.ctl-bar a:hover { text-decoration:underline; }

.ctl-hero { padding:48px 0 8px; max-width:680px; }
.ctl-eyebrow { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--indigo); margin-bottom:16px; }
.ctl-page h1 { font-family:'Archivo',sans-serif; font-size:clamp(1.9rem,5vw,2.7rem); font-weight:800; letter-spacing:-0.028em; line-height:1.1; margin:0; }
.ctl-lede { margin-top:18px; color:var(--slate); }

.ctl-domain-group { margin-top:44px; }
.ctl-domain-head { display:flex; align-items:baseline; gap:12px; margin-bottom:14px; }
.ctl-domain-head h2 { font-family:'Archivo',sans-serif; font-size:1.25rem; font-weight:600; margin:0; }
.ctl-domain-id { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.08em; color:var(--indigo); background:var(--indigo-soft); padding:3px 9px; }

.ctl-item { border:1px solid var(--rule); background:var(--surface); }
.ctl-item + .ctl-item { margin-top:10px; }
.ctl-item summary {
  cursor:pointer; list-style:none; padding:18px 22px; display:flex;
  align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap;
}
.ctl-item summary::-webkit-details-marker { display:none; }
.ctl-item summary:hover { background:#FBFCFE; }
.ctl-item-title { display:flex; align-items:center; gap:12px; }
.ctl-ref { font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--slate); }
.ctl-name { font-family:'Archivo',sans-serif; font-size:1.05rem; font-weight:600; }
.ctl-badges { display:flex; gap:6px; flex-wrap:wrap; }
.ctl-badge { font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.05em; padding:3px 8px; text-transform:uppercase; }
.ctl-badge.must { background:var(--alert-soft); color:var(--alert); }
.ctl-badge.rec { background:var(--signal-soft); color:var(--signal); }

.ctl-body { padding:0 22px 22px; border-top:1px solid var(--rule); }
.ctl-field { margin-top:16px; }
.ctl-field-label { font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.09em; text-transform:uppercase; color:var(--mute); margin-bottom:5px; }
.ctl-field p { font-size:0.9rem; color:var(--ink); margin:0; }

.ctl-fw-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:8px; margin-top:8px; }
.ctl-fw-chip { border:1px solid var(--rule); padding:8px 10px; font-size:0.78rem; background:var(--paper); }
.ctl-fw-chip b { color:var(--indigo); display:block; font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.06em; margin-bottom:2px; }
.ctl-fw-chip span { color:var(--slate); }

.ctl-foot { margin-top:56px; padding-top:20px; border-top:1px solid var(--rule); font-size:0.82rem; color:var(--mute); }
.ctl-foot p + p { margin-top:8px; }
.ctl-foot a { color:var(--indigo); }

@media (max-width:620px) {
  .ctl-item summary, .ctl-body { padding-left:16px; padding-right:16px; }
}
`;

function tierBadges(c) {
  const badges = [];
  badges.push(<span className="ctl-badge must" key="must">Must from {TIER_LABELS[c.appliesFrom]}</span>);
  if (c.soonerAt) badges.push(<span className="ctl-badge rec" key="rec">Recommended from {c.soonerAt}</span>);
  return badges;
}

export default function ControlLibraryPage() {
  const domainOrder = [...new Set(CONTROL_LIBRARY.map(c => c.domain))];

  return (
    <div className="ctl-page">
      <style>{CSS}</style>
      <PublicNav current="/controls" />
      <div className="ctl-shell">
        <div className="ctl-hero">
          <p className="ctl-eyebrow">The twelve controls, in full</p>
          <h1>What each control actually requires.</h1>
          <p className="ctl-lede">
            Every control referenced by the assessment and the risk profiler, expanded: what it's for,
            why it matters, how to implement it, and what evidence an auditor would expect to see. See{" "}
            <a href="/methodology" style={{ color: "var(--indigo)" }}>the methodology page</a> for how
            these get selected per risk tier.
          </p>
        </div>

        <div className="ctl-rules-banner">
          <div className="ctl-rules-banner-text">
            <span className="ctl-rules-banner-dot" />
            <p>New: <b>Five Rules for Agent Identity</b> — the plain-English version of everything below.</p>
          </div>
          <a href="/identity-rules">Read the five rules →</a>
        </div>

        {domainOrder.map(domainId => {
          const items = CONTROL_LIBRARY.filter(c => c.domain === domainId);
          return (
            <div className="ctl-domain-group" key={domainId}>
              <div className="ctl-domain-head">
                <span className="ctl-domain-id">{domainId}</span>
                <h2>{items[0].domainName}</h2>
              </div>
              {items.map(c => (
                <details className="ctl-item" id={c.ref} key={c.ref}>
                  <summary>
                    <span className="ctl-item-title">
                      <span className="ctl-ref">{c.ref}</span>
                      <span className="ctl-name">{c.name}</span>
                    </span>
                    <span className="ctl-badges">{tierBadges(c)}</span>
                  </summary>
                  <div className="ctl-body">
                    <div className="ctl-field">
                      <div className="ctl-field-label">Objective</div>
                      <p>{c.objective}</p>
                    </div>
                    <div className="ctl-field">
                      <div className="ctl-field-label">Why it matters</div>
                      <p>{c.rationale}</p>
                    </div>
                    <div className="ctl-field">
                      <div className="ctl-field-label">Implementation</div>
                      <p>{c.implementation}</p>
                    </div>
                    <div className="ctl-field">
                      <div className="ctl-field-label">Evidence an auditor would expect</div>
                      <p>{c.evidence}</p>
                    </div>
                    <div className="ctl-field">
                      <div className="ctl-field-label">Framework mappings</div>
                      <div className="ctl-fw-grid">
                        <div className="ctl-fw-chip"><b>IMDA</b><span>{c.frameworks.imda}</span></div>
                        <div className="ctl-fw-chip"><b>MAS</b><span>{c.frameworks.mas}</span></div>
                        <div className="ctl-fw-chip"><b>NIST</b><span>{c.frameworks.nist}</span></div>
                        <div className="ctl-fw-chip"><b>ISO/IEC 42001</b><span>{c.frameworks.iso}</span></div>
                        <div className="ctl-fw-chip"><b>EU AI Act</b><span>{c.frameworks.eu}</span></div>
                      </div>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          );
        })}

        <div className="ctl-foot">
          <p>Risk model version 2026.1. Last reviewed July 2026. Framework mappings are indicative — confirm current text for your jurisdiction and sector.</p>
          <p>© 2026 Aseem Mohan · <a href="/">Assessment</a> · <a href="/methodology">Methodology</a> · <a href="/identity-rules">Five Rules for Agent Identity</a> · <a href="/privacy">Privacy notice</a></p>
        </div>
      </div>
    </div>
  );
}
