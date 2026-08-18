/**
 * Control library — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/[locale]/controls/page.jsx  (replaces existing)
 *
 * Converted to pull text from the translation system, using the
 * slimmed lib/controlLibrary.js for structure only (ref, domain,
 * tier codes). Each control's ref (e.g. "AUD-01") maps to a
 * translation key by stripping the hyphen (AUD01), used to look up
 * all nine display fields per control.
 *
 * tierBadges() now resolves soonerAt as an array of tier codes
 * through the same translated tier labels the appliesFrom badge
 * uses, rather than the previous hardcoded English fragment — this
 * is also a genuine fix, not just a translation pass: soonerAt used
 * to bypass tier-label capitalization entirely.
 */

import { getTranslations } from "next-intl/server";
import { CONTROL_LIBRARY, DOMAIN_ORDER } from "../../../lib/controlLibrary";
import PublicNav from "../../../components/PublicNav";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "controls" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: "https://www.namedprincipal.com/controls" },
  };
}

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

const TIER_KEY = { contained: "tierContained", elevated: "tierElevated", high: "tierHigh", critical: "tierCritical" };
const DOMAIN_KEY = { INV: "domainINV", IDN: "domainIDN", ENT: "domainENT", CRD: "domainCRD", AUD: "domainAUD", LFC: "domainLFC" };

function tierBadges(c, t) {
  const badges = [];
  badges.push(
    <span className="ctl-badge must" key="must">{t("mustFrom")} {t(TIER_KEY[c.appliesFrom])}</span>
  );
  if (c.soonerAt) {
    const label = c.soonerAt.map((tier) => t(TIER_KEY[tier])).join(` ${t("andWord")} `);
    badges.push(<span className="ctl-badge rec" key="rec">{t("recommendedFrom")} {label}</span>);
  }
  return badges;
}

export default async function ControlLibraryPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "controls" });
  const tf = await getTranslations({ locale, namespace: "footer" });
  const tir = await getTranslations({ locale, namespace: "identityRules" });

  return (
    <div className="ctl-page">
      <style>{CSS}</style>
      <PublicNav current="/controls" />
      <div className="ctl-shell">
        <div className="ctl-hero">
          <p className="ctl-eyebrow">{t("eyebrow")}</p>
          <h1>{t("h1")}</h1>
          <p className="ctl-lede">
            {t("ledeBefore")}{" "}
            <a href="/methodology" style={{ color: "var(--indigo)" }}>{t("ledeLinkText")}</a>{" "}
            {t("ledeAfter")}
          </p>
        </div>

        <div className="ctl-rules-banner">
          <div className="ctl-rules-banner-text">
            <span className="ctl-rules-banner-dot" />
            <p>{t("bannerBody")} <b>{t("bannerBold")}</b> {t("bannerRest")}</p>
          </div>
          <a href="/identity-rules">{t("bannerLink")}</a>
        </div>

        {DOMAIN_ORDER.map((domainId) => {
          const items = CONTROL_LIBRARY.filter((c) => c.domain === domainId);
          return (
            <div className="ctl-domain-group" key={domainId}>
              <div className="ctl-domain-head">
                <span className="ctl-domain-id">{domainId}</span>
                <h2>{t(DOMAIN_KEY[domainId])}</h2>
              </div>
              {items.map((c) => {
                const key = c.ref.replace("-", "");
                return (
                  <details className="ctl-item" id={c.ref} key={c.ref}>
                    <summary>
                      <span className="ctl-item-title">
                        <span className="ctl-ref">{c.ref}</span>
                        <span className="ctl-name">{t(`${key}.name`)}</span>
                      </span>
                      <span className="ctl-badges">{tierBadges(c, t)}</span>
                    </summary>
                    <div className="ctl-body">
                      <div className="ctl-field">
                        <div className="ctl-field-label">{t("fieldObjective")}</div>
                        <p>{t(`${key}.objective`)}</p>
                      </div>
                      <div className="ctl-field">
                        <div className="ctl-field-label">{t("fieldWhyItMatters")}</div>
                        <p>{t(`${key}.rationale`)}</p>
                      </div>
                      <div className="ctl-field">
                        <div className="ctl-field-label">{t("fieldImplementation")}</div>
                        <p>{t(`${key}.implementation`)}</p>
                      </div>
                      <div className="ctl-field">
                        <div className="ctl-field-label">{t("fieldEvidence")}</div>
                        <p>{t(`${key}.evidence`)}</p>
                      </div>
                      <div className="ctl-field">
                        <div className="ctl-field-label">{t("fieldFrameworks")}</div>
                        <div className="ctl-fw-grid">
                          <div className="ctl-fw-chip"><b>IMDA</b><span>{t(`${key}.fwImda`)}</span></div>
                          <div className="ctl-fw-chip"><b>MAS</b><span>{t(`${key}.fwMas`)}</span></div>
                          <div className="ctl-fw-chip"><b>NIST</b><span>{t(`${key}.fwNist`)}</span></div>
                          <div className="ctl-fw-chip"><b>ISO/IEC 42001</b><span>{t(`${key}.fwIso`)}</span></div>
                          <div className="ctl-fw-chip"><b>EU AI Act</b><span>{t(`${key}.fwEu`)}</span></div>
                        </div>
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          );
        })}

        <div className="ctl-foot">
          <p>{t("footerVersion")}</p>
          <p>© 2026 Aseem Mohan · <a href="/">{tf("assessment")}</a> · <a href="/methodology">{tf("methodology")}</a> · <a href="/identity-rules">{tir("eyebrow")}</a> · <a href="/privacy">{tf("privacy")}</a></p>
        </div>
      </div>
    </div>
  );
}
