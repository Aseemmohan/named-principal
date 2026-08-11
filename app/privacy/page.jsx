/**
 * Privacy notice — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/privacy/page.jsx  (replaces existing)
 *
 * CHANGES IN THIS VERSION:
 *   1. Converted from "use client" to a plain Server Component — the
 *      original had no actual client-side state or hooks, so the
 *      directive wasn't doing anything except blocking a `metadata`
 *      export. Now it has its own page title instead of inheriting
 *      the generic site default.
 *   2. Swapped the page's own bespoke top bar for the shared
 *      PublicNav — same navigation as every other public page now,
 *      per explicit request, rather than a one-off bar unique to
 *      this page.
 *   3. "Cookies and tracking" section updated to honestly disclose
 *      Vercel Analytics, which is genuinely live on the site now —
 *      the previous wording ("this site... runs no analytics") was
 *      true when written and is no longer accurate, so it needed to
 *      change, not just get a caveat bolted on.
 *   4. "Where it is held" section updated to name Vercel Analytics
 *      alongside the existing Supabase/Vercel/Resend disclosures.
 *   5. "Last updated" date bumped, per this page's own stated
 *      commitment: "If this notice changes materially, the date at
 *      the top changes with it."
 *
 * All other content is unchanged from the version you sent me.
 */

import PublicNav from "../../components/PublicNav";

export const metadata = {
  title: "Privacy Notice",
  description: "What personal data Named Principal collects, why, and how to exercise your rights under the PDPA.",
  alternates: { canonical: "https://www.namedprincipal.com/privacy" },
  robots: { index: true, follow: true },
};

const CONTACT_EMAIL = "reports@namedprincipal.com";
const RETENTION_MONTHS = 24;
const UPDATED = "August 2026";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;800&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

.pv {
  --ink: #11151E;
  --slate: #59637A;
  --mute: #8B94A6;
  --paper: #EEF1F5;
  --surface: #FFFFFF;
  --rule: #D6DBE4;
  --indigo: #26307A;
  background: var(--paper);
  color: var(--ink);
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.6;
  min-height: 100vh;
}
.pv *, .pv *::before, .pv *::after { box-sizing: border-box; }
.pv-shell { max-width: 720px; margin: 0 auto; padding: 0 22px 80px; }
.pv h1 {
  font-family: 'Archivo', sans-serif; font-size: clamp(1.8rem, 4.5vw, 2.5rem);
  font-weight: 800; letter-spacing: -0.025em; margin: 52px 0 8px;
}
.pv-sub { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--mute); margin-bottom: 34px; }
.pv h2 {
  font-family: 'Archivo', sans-serif; font-size: 1.15rem; font-weight: 600;
  margin: 34px 0 10px; letter-spacing: -0.015em;
}
.pv p { margin: 0 0 14px; color: var(--slate); }
.pv p strong { color: var(--ink); font-weight: 600; }
.pv ul { margin: 0 0 14px; padding-left: 20px; color: var(--slate); }
.pv li { margin-bottom: 7px; }
.pv a { color: var(--indigo); }
.pv-box { background: var(--surface); border: 1px solid var(--rule); padding: 18px 20px; margin: 0 0 14px; }
.pv-box p:last-child { margin-bottom: 0; }
.pv-foot { margin-top: 46px; padding-top: 20px; border-top: 1px solid var(--rule); font-size: 0.82rem; color: var(--mute); }
`;

export default function PrivacyNotice() {
  return (
    <div className="pv">
      <style>{CSS}</style>
      <PublicNav current="/privacy" />
      <div className="pv-shell">
        <h1>Privacy notice</h1>
        <p className="pv-sub">Last updated {UPDATED}</p>

        <p>
          This notice explains what personal data the Named Principal readiness assessment
          collects, why, and what you can ask me to do with it. It is written to meet the
          Personal Data Protection Act 2012 (Singapore).
        </p>

        <h2>Who is responsible</h2>
        <p>
          This site is operated by Aseem Mohan as an individual, based in Singapore. I am the
          data controller for anything collected here. Contact:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <h2>What is collected</h2>
        <p>Only if you choose to request the report at the end of the assessment:</p>
        <div className="pv-box">
          <ul>
            <li>Your email address</li>
            <li>Your organisation name, if you enter one</li>
            <li>Your total assessment score and readiness tier</li>
            <li>The date and time of your submission</li>
          </ul>
        </div>
        <p>
          <strong>Your individual answers are not stored.</strong> They are transmitted once, used
          to generate your report, and discarded. Only the four items above are retained. No agent
          names, system names, vendor names or architecture details ever leave your device, because
          the assessment never asks for them.
        </p>
        <p>
          If you complete the assessment without requesting the report, nothing is collected at all.
        </p>
        <p>
          If you submit a pilot enquiry, the same principle applies to what you choose to enter: name,
          email, organisation, role, and anything you write in the message field — used to respond to
          your enquiry, nothing more.
        </p>

        <h2>Why it is collected</h2>
        <ul>
          <li>To send you the report you requested</li>
          <li>To follow up on that report, or a pilot enquiry, if there is something useful to discuss</li>
          <li>To understand, in aggregate, which controls organisations find hardest</li>
        </ul>
        <p>
          By submitting a form you consent to these uses. Aggregate analysis uses grouped figures
          only and never identifies an individual or an organisation.
        </p>

        <h2>What it is not used for</h2>
        <ul>
          <li>Selling, renting or sharing your data with third parties</li>
          <li>Advertising, retargeting or profiling</li>
          <li>Adding you to a mailing list without asking</li>
        </ul>

        <h2>Where it is held</h2>
        <p>
          Submissions are stored in a Supabase database hosted in the Southeast Asia (Singapore)
          region. The site is served by Vercel, which operates a global content network, so page
          requests may be handled outside Singapore. Report and pilot-enquiry emails are delivered by
          Resend, which processes the message in transit. Aggregate, anonymous page-view analytics are
          processed by Vercel Analytics — see "Cookies and tracking" below for what that does and
          doesn't involve.
        </p>

        <h2>How long it is kept</h2>
        <p>
          {RETENTION_MONTHS} months from the date of submission, after which it is deleted. If you
          ask for deletion sooner, it is deleted sooner.
        </p>

        <h2>Your rights</h2>
        <p>Under the PDPA you may ask me to:</p>
        <ul>
          <li>Tell you what data I hold about you and how it has been used</li>
          <li>Correct anything inaccurate</li>
          <li>Delete your data</li>
          <li>Withdraw your consent, which stops any further contact</li>
        </ul>
        <p>
          Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and I will respond within 30
          days. There is no charge and you do not need to give a reason.
        </p>

        <h2>Cookies and tracking</h2>
        <p>
          This site uses Vercel Analytics to see, in aggregate, which pages are visited and roughly
          how much traffic the site gets. It does not use cookies, does not track you across other
          websites, and does not build an individual profile of you — it counts page views, not
          people. No advertising, retargeting, or third-party tracking scripts run on this site, and
          links in report or confirmation emails are not click-tracked. There is nothing to opt out of
          here, because nothing collected identifies you specifically.
        </p>

        <h2>Security</h2>
        <p>
          Data is transmitted over HTTPS and written through a server-side endpoint. The database
          has row-level security enabled with no public access policies, so records cannot be read
          from a browser. No payment information is collected at any point.
        </p>

        <h2>Changes</h2>
        <p>
          If this notice changes materially, the date at the top changes with it. Substantive
          changes affecting how existing data is used will be notified to anyone affected.
        </p>

        <div className="pv-foot">
          <p>© 2026 Aseem Mohan. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
