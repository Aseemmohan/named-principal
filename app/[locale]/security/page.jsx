/**
 * Security — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/security/page.jsx
 *
 * Deliberately the SECURITY half only of what would normally be an
 * "About / Security" page — no founder-bio or company-narrative
 * content here, per the standing decision to hold that back pending
 * a separate, unresolved question. Everything on this page is a
 * factual claim about the actual infrastructure, checked against what
 * was actually built this session — nothing aspirational stated as
 * current fact. A security-literate buyer catches overclaiming
 * immediately, and it costs more credibility than admitting a gap.
 *
 * Plain Server Component — static content, no auth, no client state.
 */

import PublicNav from "../../../components/PublicNav";

export const metadata = {
  title: "Security",
  description: "How Named Principal actually handles data — infrastructure, access controls, and what's honestly still on the roadmap.",
  alternates: { canonical: "https://www.namedprincipal.com/security" },
};

const CONTACT_EMAIL = "reports@namedprincipal.com";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;800&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

.sec {
  --ink:#11151E; --slate:#59637A; --mute:#8B94A6;
  --paper:#EEF1F5; --surface:#FFFFFF; --rule:#D6DBE4;
  --indigo:#26307A; --indigo-soft:#E5E8F5;
  --signal:#9A6100; --signal-soft:#FAF0DC;
  --verify:#17604F; --verify-soft:#E2F0EB;
  background:var(--paper); color:var(--ink);
  font-family:'IBM Plex Sans',system-ui,sans-serif;
  font-size:15px; line-height:1.65; min-height:100vh;
  -webkit-font-smoothing:antialiased;
}
.sec *, .sec *::before, .sec *::after { box-sizing:border-box; }
.sec-shell { max-width:780px; margin:0 auto; padding:0 22px 90px; }

.sec-hero { padding:48px 0 8px; max-width:660px; }
.sec-eyebrow { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--indigo); margin-bottom:16px; }
.sec h1 { font-family:'Archivo',sans-serif; font-size:clamp(1.8rem,5vw,2.5rem); font-weight:800; letter-spacing:-0.028em; line-height:1.1; margin:0; }
.sec-lede { margin-top:18px; color:var(--slate); }

.sec-sec { margin-top:44px; }
.sec-sec h2 { font-family:'Archivo',sans-serif; font-size:1.2rem; font-weight:600; margin:0 0 14px; }
.sec-card { border:1px solid var(--rule); background:var(--surface); padding:20px 24px; }
.sec-card + .sec-card { margin-top:10px; }
.sec-card h3 { font-family:'Archivo',sans-serif; font-size:0.98rem; font-weight:600; margin:0 0 6px; }
.sec-card p { color:var(--slate); font-size:0.9rem; margin:0; }

.sec-status { margin-top:44px; border:1px solid var(--rule); background:var(--surface); }
.sec-status-row { display:grid; grid-template-columns:1fr auto; gap:14px; align-items:center; padding:14px 20px; border-bottom:1px solid #EDEFF3; }
.sec-status-row:last-child { border-bottom:0; }
.sec-status-row span:first-child { font-size:0.88rem; }
.sec-pill { font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.06em; padding:4px 10px; text-transform:uppercase; white-space:nowrap; }
.sec-pill.verify { background:var(--verify-soft); color:var(--verify); }
.sec-pill.signal { background:var(--signal-soft); color:var(--signal); }

.sec-note { margin-top:16px; padding:14px 16px; background:var(--signal-soft); border-left:3px solid var(--signal); font-size:0.87rem; color:var(--ink); }

.sec-foot { margin-top:56px; padding-top:20px; border-top:1px solid var(--rule); font-size:0.82rem; color:var(--mute); }
.sec-foot a { color:var(--indigo); }
`;

export default function SecurityPage() {
  return (
    <div className="sec">
      <style>{CSS}</style>
      <PublicNav current="/security" />
      <div className="sec-shell">
        <div className="sec-hero">
          <p className="sec-eyebrow">How data is actually handled</p>
          <h1>Security, stated plainly.</h1>
          <p className="sec-lede">
            No certifications to point to yet, and this page won't pretend otherwise. What follows is
            factual — what the infrastructure actually does today, and where the honest gaps are
            against what an enterprise deployment would eventually need.
          </p>
        </div>

        <section className="sec-sec">
          <h2>Infrastructure</h2>
          <div className="sec-card">
            <h3>Hosting and database</h3>
            <p>
              The application is served by Vercel over HTTPS. Data is stored in a Supabase-managed
              PostgreSQL database in the Southeast Asia (Singapore) region, encrypted at rest and in
              transit by the platform's default configuration.
            </p>
          </div>
          <div className="sec-card">
            <h3>Authentication</h3>
            <p>
              Sign-in to the authenticated product (AI Estate, Agent Passports, Approvals) uses Google
              OAuth via Supabase Auth. No passwords are set, stored, or handled by Named Principal's
              own infrastructure — that's delegated entirely to Google.
            </p>
          </div>
          <div className="sec-card">
            <h3>Email delivery</h3>
            <p>
              Report and pilot-enquiry emails are sent through Resend. Message content passes through
              their infrastructure in transit to deliver the email; it isn't stored by Named Principal
              beyond what's disclosed in the <a href="/privacy" style={{ color: "var(--indigo)" }}>privacy notice</a>.
            </p>
          </div>
        </section>

        <section className="sec-sec">
          <h2>Access controls</h2>
          <div className="sec-card">
            <h3>Row-level security</h3>
            <p>
              Authenticated client requests are restricted through row-level security policies scoped
              to the user's organisation. Privileged server-side credentials — used for lead-capture
              tables like assessment reports and pilot enquiries — are never exposed to the browser and
              are limited to controlled server routes.
            </p>
          </div>
          <div className="sec-card">
            <h3>Append-only audit history</h3>
            <p>
              Every material action inside the authenticated product — a Passport created, a control
              status changed, an approval decision made — is written to an append-only audit log tied
              to the acting user and organisation.
            </p>
          </div>
          <div className="sec-card">
            <h3>Enforced accountability</h3>
            <p>
              An Agent Passport cannot reach Approved status without a named human principal and a
              scheduled review date. This is enforced as a database constraint, not just a form
              validation — it holds even if a future code change forgets to check it.
            </p>
          </div>
        </section>

        <section className="sec-sec">
          <h2>Where this stands today</h2>
          <p style={{ color: "var(--slate)", fontSize: "0.88rem", marginBottom: 14 }}>
            An honest maturity check against what an enterprise deployment eventually needs:
          </p>
          <div className="sec-status">
            <div className="sec-status-row"><span>HTTPS everywhere, encryption at rest and in transit</span><span className="sec-pill verify">In place</span></div>
            <div className="sec-status-row"><span>Row-level security on every table</span><span className="sec-pill verify">In place</span></div>
            <div className="sec-status-row"><span>Append-only audit logging</span><span className="sec-pill verify">In place</span></div>
            <div className="sec-status-row"><span>Google OAuth sign-in</span><span className="sec-pill verify">In place</span></div>
            <div className="sec-status-row"><span>Independent security audit or penetration test</span><span className="sec-pill signal">Not yet done</span></div>
            <div className="sec-status-row"><span>SOC 2 / ISO 27001 certification</span><span className="sec-pill signal">Not yet pursued</span></div>
            <div className="sec-status-row"><span>Enterprise SSO (SAML / Microsoft Entra), SCIM</span><span className="sec-pill signal">Roadmap</span></div>
            <div className="sec-status-row"><span>Formal uptime / availability commitment</span><span className="sec-pill signal">None published yet</span></div>
          </div>
          <div className="sec-note">
            This list will get shorter over time, and each item will move to "In place" when it's
            actually true — not before.
          </div>
        </section>

        <section className="sec-sec">
          <h2>Reporting a security issue</h2>
          <div className="sec-card">
            <p>
              If you find a vulnerability, email <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--indigo)" }}>{CONTACT_EMAIL}</a> directly
              with what you found and how to reproduce it. There's no bug bounty program yet, but every
              report gets read, and a genuine finding gets fixed and credited if you'd like.
            </p>
          </div>
        </section>

        <div className="sec-foot">
          <p>© 2026 Aseem Mohan · <a href="/">Assessment</a> · <a href="/privacy">Privacy notice</a> · <a href="/methodology">Methodology</a></p>
        </div>
      </div>
    </div>
  );
}
