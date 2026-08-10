/**
 * Shared base styles — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: lib/theme.js
 *
 * Extracted from the design system already established in
 * app/report/page.jsx and app/privacy/page.jsx (IBM Plex Sans/Archivo,
 * indigo primary, the verify/signal/alert semantic colours). Rather
 * than each new authenticated page carrying its own ~150-line copy of
 * these same tokens — the exact duplication problem already found once
 * in this codebase (DOMAINS/QUESTIONS existing in two places) — every
 * new page imports BASE_CSS and appends only what's specific to it.
 *
 * Existing pages (report, privacy, agent) are untouched — this doesn't
 * require migrating them, it's just what new pages build on.
 */

export const BASE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;800&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

:root {
  --ink:#11151E; --slate:#59637A; --mute:#8B94A6;
  --paper:#EEF1F5; --surface:#FFFFFF; --rule:#D6DBE4;
  --indigo:#26307A; --indigo-soft:#E5E8F5;
  --signal:#9A6100; --signal-soft:#FAF0DC;
  --verify:#17604F; --verify-soft:#E2F0EB;
  --alert:#9B2C1E; --alert-soft:#F9E8E5;
}

.np { background:var(--paper); color:var(--ink); font-family:'IBM Plex Sans',system-ui,sans-serif; font-size:15px; line-height:1.6; min-height:100vh; -webkit-font-smoothing:antialiased; }
.np *, .np *::before, .np *::after { box-sizing:border-box; }
.np-shell { max-width:960px; margin:0 auto; padding:0 22px 80px; }

.np-bar { display:flex; align-items:center; justify-content:space-between; gap:14px; padding:14px 0; border-bottom:1px solid var(--rule); font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:var(--slate); }
.np-bar b { color:var(--ink); font-weight:500; }
.np-bar a { color:var(--slate); text-decoration:none; margin-left:16px; }
.np-bar a:hover, .np-bar a.active { color:var(--indigo); }
.np-bar-right { display:flex; align-items:center; }

.np h1 { font-family:'Archivo',sans-serif; font-size:clamp(1.6rem,4.5vw,2.1rem); font-weight:800; letter-spacing:-0.02em; margin:36px 0 6px; }
.np h2 { font-family:'Archivo',sans-serif; font-size:1.15rem; font-weight:600; margin:40px 0 4px; letter-spacing:-0.015em; }
.np-eyebrow { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--slate); margin-bottom:8px; }
.np-note { font-size:0.86rem; color:var(--mute); margin:0 0 16px; }
.np-lede { color:var(--slate); margin:0 0 20px; max-width:640px; }

.np-card { border:1px solid var(--rule); background:var(--surface); border-radius:2px; }
.np-card + .np-card { margin-top:10px; }

.np-btn { display:inline-block; background:var(--indigo); color:#fff; text-decoration:none; padding:12px 22px; font-weight:600; font-size:0.92rem; border:none; border-radius:2px; cursor:pointer; }
.np-btn:hover { background:#1A2260; }
.np-btn:disabled { background:var(--mute); cursor:not-allowed; }
.np-btn.ghost { background:none; border:1px solid var(--rule); color:var(--slate); }
.np-btn.ghost:hover { border-color:var(--indigo); color:var(--indigo); }
.np-btn.danger { background:var(--alert); }
.np-btn.small { padding:8px 14px; font-size:0.82rem; }

.np-pill { font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.08em; padding:3px 7px; display:inline-block; text-transform:uppercase; }
.np-pill.verify { background:var(--verify-soft); color:var(--verify); }
.np-pill.signal { background:var(--signal-soft); color:var(--signal); }
.np-pill.alert  { background:var(--alert-soft);  color:var(--alert); }
.np-pill.idle   { background:#EEF0F4; color:var(--mute); }

.np-field { display:block; margin-bottom:16px; }
.np-field span { display:block; font-size:0.72rem; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:var(--slate); margin-bottom:6px; }
.np-field input, .np-field textarea, .np-field select {
  width:100%; padding:11px 13px; border:1px solid var(--rule); border-radius:2px;
  font:inherit; font-size:0.93rem; background:var(--surface); color:var(--ink);
}
.np-field input:focus, .np-field textarea:focus, .np-field select:focus { outline:2px solid var(--indigo); outline-offset:1px; }
.np-field textarea { resize:vertical; min-height:70px; }
.np-hint { font-size:0.78rem; color:var(--mute); margin-top:6px; }

.np-tbl { width:100%; border-collapse:collapse; }
.np-tbl th, .np-tbl td { padding:11px 14px; text-align:left; border-bottom:1px solid #EDEFF3; font-size:0.85rem; }
.np-tbl th { font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--slate); font-weight:500; background:#FAFBFC; }
.np-tbl tr:last-child td { border-bottom:0; }
.np-tbl tr.clickable { cursor:pointer; }
.np-tbl tr.clickable:hover { background:#FAFBFC; }

.np-empty { padding:60px 24px; text-align:center; color:var(--slate); }
.np-empty h2 { margin-top:0; }

.np-stat-row { display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:10px; margin:20px 0 8px; }
.np-stat { background:var(--surface); border:1px solid var(--rule); border-radius:2px; padding:16px; }
.np-stat span { display:block; font-size:0.68rem; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:var(--mute); }
.np-stat b { display:block; font-family:'Archivo',sans-serif; font-weight:800; font-size:1.7rem; letter-spacing:-0.02em; margin-top:4px; }

.np-warn { background:var(--alert-soft); border-left:3px solid var(--alert); padding:14px 16px; font-size:0.87rem; margin:14px 0; }
.np-info { background:var(--signal-soft); border-left:3px solid var(--signal); padding:14px 16px; font-size:0.87rem; margin:14px 0; }

@media (max-width:620px) {
  .np-tbl { font-size:0.8rem; }
  .np-bar { flex-direction:column; align-items:flex-start; gap:8px; }
}
`;
