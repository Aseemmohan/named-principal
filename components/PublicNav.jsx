/**
 * Public navigation bar — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: components/PublicNav.jsx
 *
 * Used by every public-facing page (homepage, /agent, /methodology,
 * /controls) so all four are reachable by clicking, not just by typing
 * the exact URL. Deliberately self-contained — its own inline styles
 * with hardcoded colours, not relying on any parent page's CSS custom
 * properties — so it renders identically regardless of which page's
 * top-level wrapper class it sits inside (.agr, .ap, .mth-page,
 * .ctl-page each define their own --indigo/--slate/etc scope; rather
 * than depend on that, this component just uses the same colour values
 * directly).
 *
 * No hooks, no client-side state — a plain function component, so it
 * can be imported by both "use client" pages (home, /agent) and plain
 * Server Component pages (/methodology, /controls) without forcing
 * either one to change its own client/server nature.
 *
 * The Agent Estate link always points to /estate rather than
 * conditionally showing /login — middleware already redirects an
 * unauthenticated visit to /estate straight to /login, so this stays
 * correct regardless of sign-in state without needing to check it here.
 */

const LINKS = [
  { href: "/", label: "Assessment" },
  { href: "/agent", label: "Agent Risk Profiler" },
  { href: "/methodology", label: "Methodology" },
  { href: "/controls", label: "Control Library" },
  { href: "/estate", label: "Agent Estate" },
];

const STYLE = `
.pubnav {
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
  border-bottom: 1px solid #D6DBE4;
  background: #FFFFFF;
}
.pubnav-in {
  max-width: 1080px; margin: 0 auto; padding: 14px 22px;
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; flex-wrap: wrap;
}
.pubnav-brand {
  font-family: 'Archivo', sans-serif; font-weight: 800; font-size: 1rem;
  color: #11151E; text-decoration: none; letter-spacing: -0.01em; white-space: nowrap;
}
.pubnav-links { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.pubnav-link {
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.06em;
  text-transform: uppercase; color: #59637A; text-decoration: none;
  padding: 7px 11px; border-radius: 2px; white-space: nowrap;
  transition: background 120ms ease, color 120ms ease;
}
.pubnav-link:hover { background: #E5E8F5; color: #26307A; }
.pubnav-link.is-current { background: #26307A; color: #FFFFFF; font-weight: 600; }
@media (max-width: 720px) {
  .pubnav-in { padding: 12px 16px; }
  .pubnav-links { gap: 2px; }
  .pubnav-link { padding: 6px 8px; font-size: 10px; }
}
`;

export default function PublicNav({ current }) {
  return (
    <nav className="pubnav">
      <style>{STYLE}</style>
      <div className="pubnav-in">
        <a className="pubnav-brand" href="/">Named Principal</a>
        <div className="pubnav-links">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`pubnav-link${current === l.href ? " is-current" : ""}`}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
