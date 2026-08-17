/**
 * Methodology — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/[locale]/methodology/page.jsx  (replaces existing)
 *
 * Converted to pull text from the translation system. The OVERRIDES
 * array now references translation keys per override (condition, why,
 * incident title/body/source) rather than embedding English text
 * directly. Incident URLs stay as plain data — a citation link
 * doesn't change across languages, only its surrounding text does.
 *
 * The two incident narratives (Replit, Salesloft-Drift, postmark-mcp)
 * were translated with particular care to keep every number, date,
 * and proper noun (Amjad Masad, UNC6395, Koi Security, version
 * 1.0.16, incident #1152) exactly intact — verified programmatically
 * across all 7 non-English languages before this shipped, not just
 * assumed correct.
 */

import { getTranslations } from "next-intl/server";
import PublicNav from "../../../components/PublicNav";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "methodology" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: "https://www.namedprincipal.com/methodology" },
  };
}

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

.mth-hero { padding:48px 0 8px; max-width:680px; }
.mth-eyebrow { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--indigo); margin-bottom:16px; }
.mth h1 { font-family:'Archivo',sans-serif; font-size:clamp(1.9rem,5vw,2.7rem); font-weight:800; letter-spacing:-0.028em; line-height:1.1; margin:0; }
.mth-lede { margin-top:18px; color:var(--slate); }

.mth-version { margin-top:24px; padding:14px 16px; background:var(--indigo-soft); border-left:3px solid var(--indigo); font-size:0.86rem; max-width:600px; }

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

const OVERRIDE_META = [
  { n: 1, tone: "critical", conditionKey: "override1Condition", whyKey: "override1Why", hasIncident: true, url: "https://incidentdatabase.ai/cite/1152/" },
  { n: 2, tone: "critical", conditionKey: "override2Condition", whyKey: "override2Why", hasIncident: true, url: "https://thehackernews.com/2025/09/salesloft-takes-drift-offline-after.html" },
  { n: 3, tone: "critical", conditionKey: "override3Condition", whyKey: "override3Why", hasIncident: false },
  { n: 4, tone: "critical", conditionKey: "override4Condition", whyKey: "override4Why", hasIncident: false },
  { n: 5, tone: "high", conditionKey: "override5Condition", whyKey: "override5Why", hasIncident: false },
  { n: 6, tone: "high", conditionKey: "override6Condition", whyKey: "override6Why", hasIncident: true, url: "https://thehackernews.com/2025/09/first-malicious-mcp-server-found.html" },
];

export default async function Methodology({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "methodology" });
  const tf = await getTranslations({ locale, namespace: "footer" });

  return (
    <div className="mth">
      <style>{CSS}</style>
      <PublicNav current="/methodology" />
      <div className="mth-shell">
        <div className="mth-hero">
          <p className="mth-eyebrow">{t("eyebrow")}</p>
          <h1>{t("h1")}</h1>
          <p className="mth-lede">{t("lede")}</p>
          <div className="mth-version">{t("versionNote")}</div>
        </div>

        <section className="mth-sec">
          <h2>{t("orgAssessH2")}</h2>
          <p className="mth-sec-note">{t("orgAssessNote")}</p>
          <div className="mth-card">
            <h3>{t("scoringH3")}</h3>
            <p>{t("scoringBody")}</p>
            <div className="mth-formula">{t("scoringFormula")}</div>
            <p>{t("tierBandIntro")}</p>
            <table className="mth-tbl">
              <thead><tr><th>{t("tblScore")}</th><th>{t("tblTier")}</th><th>{t("tblLabel")}</th></tr></thead>
              <tbody>
                <tr><td>0-9</td><td>T0</td><td>{t("tierT0")}</td></tr>
                <tr><td>10-18</td><td>T1</td><td>{t("tierT1")}</td></tr>
                <tr><td>19-27</td><td>T2</td><td>{t("tierT2")}</td></tr>
                <tr><td>28-36</td><td>T3</td><td>{t("tierT3")}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="mth-card">
            <h3>{t("regExposureH3")}</h3>
            <p>{t("regExposureBody")}</p>
            <p>{t("regStatusIntro")}</p>
            <table className="mth-tbl">
              <thead><tr><th>{t("tblAvgDomainScore")}</th><th>{t("tblStatus")}</th></tr></thead>
              <tbody>
                <tr><td>84%+</td><td><span className="mth-pill verify">{t("statusMet")}</span></td></tr>
                <tr><td>50-83%</td><td><span className="mth-pill signal">{t("statusPartial")}</span></td></tr>
                <tr><td>&lt;50%</td><td><span className="mth-pill alert">{t("statusGap")}</span></td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mth-sec">
          <h2>{t("profilerH2")}</h2>
          <p className="mth-sec-note">{t("profilerNote")}</p>
          <div className="mth-card">
            <h3>{t("formulaH3")}</h3>
            <p>{t("formulaIntro")}</p>
            <div className="mth-formula">{t("profilerFormula")}</div>
            <p><strong>{t("whyMultipliedLabel")}</strong> {t("whyMultipliedBody")}</p>
            <p><strong>{t("whyWeightedLabel")}</strong> {t("whyWeightedBody")}</p>
          </div>
          <div className="mth-card">
            <h3>{t("tierThresholdsH3")}</h3>
            <table className="mth-tbl">
              <thead><tr><th>{t("tblScore")}</th><th>{t("tblTier")}</th></tr></thead>
              <tbody>
                <tr><td>0-8</td><td><span className="mth-pill verify">{t("tierContained")}</span></td></tr>
                <tr><td>9-17</td><td><span className="mth-pill signal">{t("tierElevated")}</span></td></tr>
                <tr><td>18-28</td><td><span className="mth-pill alert">{t("tierHigh")}</span></td></tr>
                <tr><td>29-42</td><td><span className="mth-pill alert">{t("tierCritical")}</span></td></tr>
              </tbody>
            </table>
          </div>
          <div className="mth-card">
            <h3>{t("controlSelectionH3")}</h3>
            <p>
              {t("controlSelectionBody")}{" "}
              <a href="/controls" style={{ color: "var(--indigo)" }}>{t("controlLibraryLinkText")}</a>.
            </p>
          </div>
        </section>

        <section className="mth-sec">
          <h2>{t("overridesH2")}</h2>
          <p className="mth-sec-note">{t("overridesNote")}</p>
          {OVERRIDE_META.map((o) => (
            <div className="mth-override" key={o.n}>
              <h3>{t("escalatesToLabel")} {o.tone} · {t(o.conditionKey)}</h3>
              <p>{t(o.whyKey)}</p>
              {o.hasIncident && (
                <>
                  <h4>{t(`override${o.n}IncidentTitle`)}</h4>
                  <p>{t(`override${o.n}IncidentBody`)}</p>
                  <p className="mth-cite">
                    {t("sourceLabel")} {t(`override${o.n}Source`)}
                    {o.url && <> — <a href={o.url} target="_blank" rel="noopener noreferrer">{t("readMoreLink")}</a></>}
                  </p>
                </>
              )}
            </div>
          ))}
        </section>

        <section className="mth-sec">
          <h2>{t("notThisH2")}</h2>
          <div className="mth-card">
            <p>{t("notThisBody")}</p>
          </div>
        </section>

        <div className="mth-foot">
          <p>{t("footerVersion")}</p>
          <p>© 2026 Aseem Mohan · <a href="/">{tf("assessment")}</a> · <a href="/controls">{tf("controls")}</a> · <a href="/privacy">{tf("privacy")}</a></p>
        </div>
      </div>
    </div>
  );
}
