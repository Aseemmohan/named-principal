/**
 * Examples hub — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/[locale]/examples/page.jsx  (replaces existing)
 *
 * Converted to pull text from the translation system, same pattern
 * as /security. Content and structure are unchanged from the
 * previous version — every string now comes from
 * messages/<locale>.json instead of being hardcoded here.
 */

import { getTranslations } from "next-intl/server";
import PublicNav from "../../../components/PublicNav";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "examples" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: "https://www.namedprincipal.com/examples" },
  };
}

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

export default async function ExamplesPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "examples" });
  const tf = await getTranslations({ locale, namespace: "footer" });

  return (
    <div className="exh">
      <style>{CSS}</style>
      <PublicNav current="/examples" />
      <div className="exh-shell">
        <div className="exh-hero">
          <p className="exh-eyebrow">{t("eyebrow")}</p>
          <h1>{t("h1")}</h1>
          <p className="exh-lede">{t("lede")}</p>
        </div>

        <div className="exh-grid">
          <div className="exh-card">
            <span className="exh-card-tag">{t("cardTag")}</span>
            <h2>{t("passportTitle")}</h2>
            <p>{t("passportBody")}</p>
            <a href="/sample-passport">{t("passportLink")}</a>
          </div>
          <div className="exh-card">
            <span className="exh-card-tag">{t("cardTag")}</span>
            <h2>{t("estateTitle")}</h2>
            <p>{t("estateBody")}</p>
            <a href="/sample-estate">{t("estateLink")}</a>
          </div>
        </div>

        <div className="exh-cta">
          <p>{t("ctaText")}</p>
          <a className="exh-btn" href="/pilot">{t("ctaButton")}</a>
        </div>

        <div className="exh-foot">
          <p>© 2026 Aseem Mohan · <a href="/">{tf("assessment")}</a> · <a href="/methodology">{tf("methodology")}</a> · <a href="/controls">{tf("controls")}</a></p>
        </div>
      </div>
    </div>
  );
}
