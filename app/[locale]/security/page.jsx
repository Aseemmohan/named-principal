/**
 * Security — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/[locale]/security/page.jsx  (replaces existing)
 *
 * FIRST PAGE CONVERTED to pull text from the translation system
 * instead of hardcoded English — the proof-of-pattern for the rest of
 * the site. Uses getTranslations (the async, Server Component API)
 * rather than the useTranslations hook, since this stays a plain
 * Server Component, unchanged from before. Content and meaning are
 * IDENTICAL to the previous version — every string just now comes
 * from messages/<locale>.json instead of being written directly in
 * this file, so /es/security (and eventually every other locale)
 * actually renders translated text instead of English at a different
 * URL.
 *
 * Two strings use t.rich() instead of plain t() — the email-delivery
 * paragraph (has an inline link to the privacy notice) and the
 * vulnerability-reporting paragraph (has an inline mailto link) —
 * since next-intl's plain t() can't embed a clickable element inside
 * a translated sentence; t.rich() is the API built for exactly this.
 */

import { getTranslations } from "next-intl/server";
import PublicNav from "../../../components/PublicNav";

const CONTACT_EMAIL = "reports@namedprincipal.com";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "security" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: "https://www.namedprincipal.com/security" },
  };
}

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

export default async function SecurityPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "security" });

  const statusRows = [
    { label: t("status.rowHttps"), tone: "verify", tag: t("status.labelInPlace") },
    { label: t("status.rowRls"), tone: "verify", tag: t("status.labelInPlace") },
    { label: t("status.rowAudit"), tone: "verify", tag: t("status.labelInPlace") },
    { label: t("status.rowOauth"), tone: "verify", tag: t("status.labelInPlace") },
    { label: t("status.rowPentest"), tone: "signal", tag: t("status.labelNotYetDone") },
    { label: t("status.rowCert"), tone: "signal", tag: t("status.labelNotYetPursued") },
    { label: t("status.rowSso"), tone: "signal", tag: t("status.labelRoadmap") },
    { label: t("status.rowUptime"), tone: "signal", tag: t("status.labelNotPublished") },
  ];

  return (
    <div className="sec">
      <style>{CSS}</style>
      <PublicNav current="/security" />
      <div className="sec-shell">
        <div className="sec-hero">
          <p className="sec-eyebrow">{t("eyebrow")}</p>
          <h1>{t("h1")}</h1>
          <p className="sec-lede">{t("lede")}</p>
        </div>

        <section className="sec-sec">
          <h2>{t("infrastructure.heading")}</h2>
          <div className="sec-card">
            <h3>{t("infrastructure.hostingTitle")}</h3>
            <p>{t("infrastructure.hostingBody")}</p>
          </div>
          <div className="sec-card">
            <h3>{t("infrastructure.authTitle")}</h3>
            <p>{t("infrastructure.authBody")}</p>
          </div>
          <div className="sec-card">
            <h3>{t("infrastructure.emailTitle")}</h3>
            <p>
              {t.rich("infrastructure.emailBody", {
                privacyLink: (chunks) => <a href="/privacy" style={{ color: "var(--indigo)" }}>{chunks}</a>,
              })}
            </p>
          </div>
        </section>

        <section className="sec-sec">
          <h2>{t("accessControls.heading")}</h2>
          <div className="sec-card">
            <h3>{t("accessControls.rlsTitle")}</h3>
            <p>{t("accessControls.rlsBody")}</p>
          </div>
          <div className="sec-card">
            <h3>{t("accessControls.auditTitle")}</h3>
            <p>{t("accessControls.auditBody")}</p>
          </div>
          <div className="sec-card">
            <h3>{t("accessControls.enforcedTitle")}</h3>
            <p>{t("accessControls.enforcedBody")}</p>
          </div>
        </section>

        <section className="sec-sec">
          <h2>{t("status.heading")}</h2>
          <p style={{ color: "var(--slate)", fontSize: "0.88rem", marginBottom: 14 }}>
            {t("status.intro")}
          </p>
          <div className="sec-status">
            {statusRows.map((row, i) => (
              <div className="sec-status-row" key={i}>
                <span>{row.label}</span>
                <span className={`sec-pill ${row.tone}`}>{row.tag}</span>
              </div>
            ))}
          </div>
          <div className="sec-note">{t("status.note")}</div>
        </section>

        <section className="sec-sec">
          <h2>{t("reporting.heading")}</h2>
          <div className="sec-card">
            <p>
              {t.rich("reporting.body", {
                email: CONTACT_EMAIL,
                emailLink: (chunks) => <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--indigo)" }}>{chunks}</a>,
              })}
            </p>
          </div>
        </section>

        <div className="sec-foot">
          <p>
            © 2026 Aseem Mohan · <a href="/">{t("footerAssessment")}</a> · <a href="/privacy">{t("footerPrivacy")}</a> · <a href="/methodology">{t("footerMethodology")}</a>
          </p>
        </div>
      </div>
    </div>
  );
}
