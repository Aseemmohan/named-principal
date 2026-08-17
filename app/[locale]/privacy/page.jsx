/**
 * Privacy notice — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/[locale]/privacy/page.jsx  (replaces existing)
 *
 * Converted to pull text from the translation system. One addition
 * beyond the mechanical conversion: every non-English render shows a
 * translationNotice banner stating the English version is the
 * authoritative text. This is a real legal document under Singapore's
 * PDPA — a translation drifting even slightly from what the English
 * version actually commits to is a genuine compliance risk, not just
 * an awkward phrase, so this is a deliberate safeguard, not
 * boilerplate. The banner only renders for locale !== "en".
 */

import { getTranslations } from "next-intl/server";
import PublicNav from "../../../components/PublicNav";

const CONTACT_EMAIL = "reports@namedprincipal.com";
const RETENTION_MONTHS = 24;
const UPDATED = "August 2026";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: "https://www.namedprincipal.com/privacy" },
    robots: { index: true, follow: true },
  };
}

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
  --signal-soft: #FAF0DC;
  --signal: #9A6100;
  background: var(--paper);
  color: var(--ink);
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.6;
  min-height: 100vh;
}
.pv *, .pv *::before, .pv *::after { box-sizing: border-box; }
.pv-shell { max-width: 720px; margin: 0 auto; padding: 0 22px 80px; }
.pv-translation-notice { margin-top: 28px; padding: 12px 16px; background: var(--signal-soft); border-left: 3px solid var(--signal); font-size: 0.85rem; color: var(--ink); }
.pv h1 {
  font-family: 'Archivo', sans-serif; font-size: clamp(1.8rem, 4.5vw, 2.5rem);
  font-weight: 800; letter-spacing: -0.025em; margin: 30px 0 8px;
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

export default async function PrivacyNotice({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });

  return (
    <div className="pv">
      <style>{CSS}</style>
      <PublicNav current="/privacy" />
      <div className="pv-shell">
        {locale !== "en" && (
          <div className="pv-translation-notice">{t("translationNotice")}</div>
        )}

        <h1>{t("h1")}</h1>
        <p className="pv-sub">{t("lastUpdated")} {UPDATED}</p>

        <p>{t("intro")}</p>

        <h2>{t("whoResponsibleH2")}</h2>
        <p>
          {t("whoResponsibleBody")}{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <h2>{t("whatCollectedH2")}</h2>
        <p>{t("whatCollectedIntro")}</p>
        <div className="pv-box">
          <ul>
            <li>{t("collectedItem1")}</li>
            <li>{t("collectedItem2")}</li>
            <li>{t("collectedItem3")}</li>
            <li>{t("collectedItem4")}</li>
          </ul>
        </div>
        <p>{t("notStoredBody")}</p>
        <p>{t("noReportBody")}</p>
        <p>{t("pilotEnquiryBody")}</p>

        <h2>{t("whyCollectedH2")}</h2>
        <ul>
          <li>{t("whyItem1")}</li>
          <li>{t("whyItem2")}</li>
          <li>{t("whyItem3")}</li>
        </ul>
        <p>{t("consentBody")}</p>

        <h2>{t("notUsedForH2")}</h2>
        <ul>
          <li>{t("notUsedItem1")}</li>
          <li>{t("notUsedItem2")}</li>
          <li>{t("notUsedItem3")}</li>
        </ul>

        <h2>{t("whereHeldH2")}</h2>
        <p>{t("whereHeldBody")}</p>

        <h2>{t("howLongH2")}</h2>
        <p>{t("howLongBody", { months: RETENTION_MONTHS })}</p>

        <h2>{t("rightsH2")}</h2>
        <p>{t("rightsIntro")}</p>
        <ul>
          <li>{t("rightsItem1")}</li>
          <li>{t("rightsItem2")}</li>
          <li>{t("rightsItem3")}</li>
          <li>{t("rightsItem4")}</li>
        </ul>
        <p>
          {t.rich("rightsContactBody", {
            email: CONTACT_EMAIL,
            emailLink: (chunks) => <a href={`mailto:${CONTACT_EMAIL}`}>{chunks}</a>,
          })}
        </p>

        <h2>{t("cookiesH2")}</h2>
        <p>{t("cookiesBody")}</p>

        <h2>{t("securityH2")}</h2>
        <p>{t("securityBody")}</p>

        <h2>{t("changesH2")}</h2>
        <p>{t("changesBody")}</p>

        <div className="pv-foot">
          <p>{t("footerText")}</p>
        </div>
      </div>
    </div>
  );
}
