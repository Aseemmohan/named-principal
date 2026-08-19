/**
 * Sample Agent Passport — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/[locale]/sample-passport/page.jsx  (replaces existing)
 *
 * Converted to pull text from the translation system. Person names
 * (Priya Sharma, Raj Kumar), email addresses, dates, control refs,
 * and the model version number stay as literal data — genuine
 * identifiers, not display language. Control names (INV-01's
 * "Central agent register" etc.) are reused verbatim from the
 * already-translated controls namespace rather than retranslated.
 * The "Elevated" risk tier pill reuses methodology.tierElevated for
 * the same reason.
 */

import { getTranslations } from "next-intl/server";
import PublicNav from "../../../components/PublicNav";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "samplePassport" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: "https://www.namedprincipal.com/sample-passport" },
  };
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;800&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

.spp {
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
.spp *, .spp *::before, .spp *::after { box-sizing:border-box; }
.spp-shell { max-width:820px; margin:0 auto; padding:0 22px 90px; }

.spp-banner {
  background:var(--signal-soft); border-bottom:2px solid var(--signal);
  padding:12px 22px; text-align:center; font-family:'IBM Plex Mono',monospace;
  font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:var(--signal); font-weight:600;
}

.spp-hero { padding:36px 0 8px; }
.spp-eyebrow { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--indigo); margin-bottom:12px; }
.spp h1 { font-family:'Archivo',sans-serif; font-size:clamp(1.6rem,4.5vw,2.1rem); font-weight:800; margin:0 0 10px; letter-spacing:-0.02em; }
.spp-lede { color:var(--slate); font-size:0.92rem; max-width:640px; margin-bottom:8px; }

.spp-pill { font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.06em; padding:4px 10px; display:inline-block; text-transform:uppercase; margin-right:6px; }
.spp-pill.verify { background:var(--verify-soft); color:var(--verify); }
.spp-pill.signal { background:var(--signal-soft); color:var(--signal); }

.spp h2 { font-family:'Archivo',sans-serif; font-size:1.1rem; font-weight:600; margin:36px 0 4px; }
.spp-card { border:1px solid var(--rule); background:var(--surface); padding:18px 22px; }
.spp-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.spp-field-label { font-size:0.68rem; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:var(--mute); margin-bottom:3px; }
.spp-field p { margin:0; font-size:0.9rem; }

.spp-ctl { padding:12px 0; border-bottom:1px solid #EDEFF3; display:grid; grid-template-columns:1fr auto; gap:10px; align-items:start; }
.spp-ctl:last-child { border-bottom:0; }
.spp-ctl-ref { font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--mute); }
.spp-ctl-name { font-size:0.88rem; margin-top:2px; }
.spp-ctl-meta { font-size:0.78rem; color:var(--mute); margin-top:4px; }
.spp-status { font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.05em; padding:3px 8px; text-transform:uppercase; height:fit-content; }
.spp-status.implemented { background:var(--verify-soft); color:var(--verify); }
.spp-status.exception { background:var(--signal-soft); color:var(--signal); }

.spp-hist { padding:10px 0; border-bottom:1px solid #EDEFF3; font-size:0.85rem; }
.spp-hist:last-child { border-bottom:0; }
.spp-hist-when { font-family:'IBM Plex Mono',monospace; color:var(--mute); font-size:0.78rem; }

.spp-cta { margin-top:44px; border:1px solid var(--indigo); background:var(--surface); padding:26px 28px; text-align:center; }
.spp-cta p { color:var(--slate); font-size:0.92rem; margin:0 0 16px; }
.spp-btn { display:inline-block; background:var(--indigo); color:#fff; text-decoration:none; padding:13px 24px; font-weight:600; font-size:0.92rem; border-radius:2px; }
.spp-btn:hover { background:#1A2260; }

.spp-foot { margin-top:44px; padding-top:20px; border-top:1px solid var(--rule); font-size:0.8rem; color:var(--mute); }
.spp-foot a { color:var(--indigo); }

@media (max-width:620px) {
  .spp-grid { grid-template-columns:1fr; }
  .spp-card { padding:16px; }
}
`;

export default async function SamplePassportPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "samplePassport" });
  const ts = await getTranslations({ locale, namespace: "sampleShared" });
  const tc = await getTranslations({ locale, namespace: "controls" });
  const tm = await getTranslations({ locale, namespace: "methodology" });
  const tf = await getTranslations({ locale, namespace: "footer" });

  // Control refs, status values, and dates stay as literal data; only
  // display text (name, meta) is pulled from translations, reusing
  // the already-translated control names from the controls namespace.
  const CONTROLS = [
    { ref: "INV-01", nameKey: "INV01", status: "implemented", metaKey: "ctl1Meta" },
    { ref: "IDN-01", nameKey: "IDN01", status: "implemented", metaKey: "ctl2Meta" },
    { ref: "IDN-02", nameKey: "IDN02", status: "implemented", metaKey: "ctl3Meta" },
    { ref: "ENT-01", nameKey: "ENT01", status: "implemented", metaKey: "ctl4Meta" },
    { ref: "CRD-01", nameKey: "CRD01", status: "implemented", metaKey: "ctl5Meta" },
    { ref: "AUD-01", nameKey: "AUD01", status: "implemented", metaKey: "ctl6Meta" },
    {
      ref: "LFC-01", nameKey: "LFC01", status: "exception",
      exceptionExpiry: "18 Oct 2026", exceptionApprovedBy: "raj.kumar@example.com (CISO)",
    },
  ];

  const HISTORY = [
    { when: "12 Jul 2026, 09:14", whatKey: "hist1What", who: "priya.sharma@example.com" },
    { when: "12 Jul 2026, 09:41", whatKey: "hist2What", who: "priya.sharma@example.com" },
    { when: "15 Jul 2026, 14:02", whatKey: "hist3What", who: "iam-team@example.com" },
    { when: "18 Jul 2026, 11:30", whatKey: "hist4What", who: "priya.sharma@example.com" },
    { when: "19 Jul 2026, 16:47", whatKey: "hist5What", who: "raj.kumar@example.com (CISO)" },
  ];

  return (
    <div className="spp">
      <style>{CSS}</style>
      <div className="spp-banner">{ts("bannerText")}</div>
      <PublicNav current="/sample-passport" />
      <div className="spp-shell">
        <div className="spp-hero">
          <p className="spp-eyebrow">{t("eyebrow")}</p>
          <h1>{ts("agentVendorInvoice")}</h1>
          <p className="spp-lede">{t("lede")}</p>
          <span className="spp-pill verify">{t("pillApproved")}</span>
          <span className="spp-pill signal">{tc("tierElevated")}</span>
        </div>

        <h2>{t("secAccountability")}</h2>
        <div className="spp-card spp-grid">
          <div className="spp-field"><div className="spp-field-label">{t("fieldNamedPrincipal")}</div><p>{t("principalValue")}</p></div>
          <div className="spp-field"><div className="spp-field-label">{t("fieldBusinessOwner")}</div><p>{t("businessOwnerValue")}</p></div>
          <div className="spp-field"><div className="spp-field-label">{t("fieldTechnicalOwner")}</div><p>{t("technicalOwnerValue")}</p></div>
          <div className="spp-field"><div className="spp-field-label">{t("fieldNextReview")}</div><p>19 Jan 2027</p></div>
        </div>

        <h2>{t("secPurpose")}</h2>
        <div className="spp-card">
          <div className="spp-field" style={{ marginBottom: 12 }}>
            <div className="spp-field-label">{t("fieldBusinessPurpose")}</div>
            <p>{t("purposeBody")}</p>
          </div>
          <div className="spp-field" style={{ marginBottom: 12 }}>
            <div className="spp-field-label">{t("fieldPermittedTasks")}</div>
            <p>{t("permittedBody")}</p>
          </div>
          <div className="spp-field">
            <div className="spp-field-label">{t("fieldProhibited")}</div>
            <p>{t("prohibitedBody")}</p>
          </div>
        </div>

        <h2>{t("secRisk")}</h2>
        <div className="spp-card">
          <p style={{ margin: "0 0 10px", fontSize: "0.9rem" }}>{t("riskBody")}</p>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--slate)" }}>{t("riskScoreLine")}</p>
        </div>

        <h2>{t("secRequiredControls")}</h2>
        <p style={{ fontSize: "0.85rem", color: "var(--mute)", margin: "0 0 10px" }}>
          {t("requiredControlsIntro")}
        </p>
        <div className="spp-card" style={{ padding: 0 }}>
          {CONTROLS.map((c) => (
            <div key={c.ref} style={{ padding: "14px 22px", borderBottom: "1px solid #EDEFF3" }}>
              <div className="spp-ctl" style={{ padding: 0, border: 0 }}>
                <div>
                  <span className="spp-ctl-ref">{c.ref}</span>
                  <div className="spp-ctl-name">{tc(`${c.nameKey}.name`)}</div>
                  {c.metaKey && <div className="spp-ctl-meta">{t(c.metaKey)}</div>}
                </div>
                <span className={`spp-status ${c.status}`}>
                  {c.status === "exception" ? t("statusException") : t("statusImplemented")}
                </span>
              </div>
              {c.status === "exception" && (
                <div style={{ marginTop: 10, padding: 12, background: "var(--signal-soft)", borderLeft: "3px solid var(--signal)" }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--signal)", marginBottom: 6 }}>
                    {t("exceptionRecordLabel")}
                  </div>
                  <p style={{ margin: "0 0 8px", fontSize: "0.85rem" }}>{t("exceptionReasonText")}</p>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--slate)" }}>
                    {t("exceptionExpiresLabel")} {c.exceptionExpiry} · {t("exceptionApprovedByLabel")} {c.exceptionApprovedBy}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <h2>{t("secDecision")}</h2>
        <div className="spp-card">
          <p style={{ margin: "0 0 10px", fontSize: "0.9rem" }}>{t("decisionBody1")}</p>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--slate)" }}>{t("decisionBody2")}</p>
        </div>

        <h2>{t("secHistory")}</h2>
        <div className="spp-card" style={{ padding: 0 }}>
          {HISTORY.map((h, i) => (
            <div className="spp-hist" key={i} style={{ padding: "12px 22px" }}>
              <span className="spp-hist-when">{h.when}</span> — <strong>{t(h.whatKey)}</strong> {t("byWord")} {h.who}
            </div>
          ))}
        </div>

        <div className="spp-cta">
          <p>{t("ctaBody")}</p>
          <a className="spp-btn" href="/pilot">{t("ctaLink")}</a>
        </div>

        <div className="spp-foot">
          <p>© 2026 Aseem Mohan · <a href="/">{tf("assessment")}</a> · <a href="/sample-estate">{t("footerSampleEstateLink")}</a> · <a href="/methodology">{tf("methodology")}</a> · <a href="/controls">{tf("controls")}</a></p>
        </div>
      </div>
    </div>
  );
}
