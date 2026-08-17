/**
 * Five Rules for Agent Identity — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/[locale]/identity-rules/page.jsx  (replaces existing)
 *
 * Converted to pull text from the translation system. The five RULES
 * entries reference translation keys (rule1Title, rule1Body, etc.)
 * rather than embedding English text directly, while the control refs
 * (IDN-01, IDN-02, etc.) and hrefs stay as plain data — those are
 * identifiers, not language-dependent content.
 */

import { getTranslations } from "next-intl/server";
import PublicNav from "../../../components/PublicNav";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "identityRules" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: "https://www.namedprincipal.com/identity-rules" },
  };
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;800&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

.idr {
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
.idr *, .idr *::before, .idr *::after { box-sizing:border-box; }
.idr-shell { max-width:820px; margin:0 auto; padding:0 22px 90px; }

.idr-hero { padding:48px 0 8px; max-width:680px; }
.idr-eyebrow { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--indigo); margin-bottom:16px; }
.idr h1 { font-family:'Archivo',sans-serif; font-size:clamp(1.9rem,5vw,2.6rem); font-weight:800; letter-spacing:-0.028em; line-height:1.1; margin:0; }
.idr-lede { margin-top:18px; color:var(--slate); }

.idr-rule { border:1px solid var(--rule); background:var(--surface); margin-top:16px; overflow:hidden; }
.idr-rule-head { display:flex; align-items:flex-start; gap:18px; padding:24px 26px 20px; }
.idr-num { font-family:'Archivo',sans-serif; font-size:2rem; font-weight:800; color:var(--indigo-soft); -webkit-text-stroke:1.5px var(--indigo); line-height:1; flex-shrink:0; }
.idr-rule h2 { font-family:'Archivo',sans-serif; font-size:1.25rem; font-weight:600; margin:0 0 8px; }
.idr-rule p { color:var(--slate); font-size:0.95rem; margin:0; line-height:1.5; }

.idr-risk { margin:0 26px 20px; padding:12px 16px; background:var(--alert-soft); border-left:3px solid var(--alert); font-size:0.87rem; color:var(--ink); }
.idr-risk b { color:var(--alert); font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.06em; text-transform:uppercase; display:block; margin-bottom:4px; }

.idr-enforced { display:flex; align-items:center; justify-content:space-between; padding:12px 26px; background:var(--verify-soft); border-top:1px solid var(--rule); }
.idr-enforced span { font-size:0.82rem; color:var(--verify); }
.idr-enforced span b { font-family:'IBM Plex Mono',monospace; }
.idr-enforced a { font-size:0.82rem; font-weight:600; color:var(--verify); text-decoration:none; }
.idr-enforced a:hover { text-decoration:underline; }

.idr-loop { margin-top:52px; }
.idr-loop h2 { font-family:'Archivo',sans-serif; font-size:1.3rem; font-weight:600; margin:0 0 8px; }
.idr-loop-note { color:var(--slate); font-size:0.9rem; margin:0 0 24px; }
.idr-loop-row { display:flex; align-items:center; flex-wrap:wrap; gap:0; }
.idr-loop-step { flex:1 1 130px; text-align:center; }
.idr-loop-circle { width:52px; height:52px; border-radius:50%; background:var(--indigo); color:#fff; display:flex; align-items:center; justify-content:center; margin:0 auto 8px; font-family:'IBM Plex Mono',monospace; font-size:11px; font-weight:600; }
.idr-loop-step div.lbl { font-size:0.82rem; font-weight:600; color:var(--ink); }
.idr-loop-arrow { color:var(--mute); font-size:1.2rem; padding:0 4px 24px; }

.idr-cta { margin-top:52px; border:1px solid var(--indigo); background:var(--surface); padding:26px 28px; text-align:center; }
.idr-cta p { color:var(--slate); font-size:0.92rem; margin:0 0 16px; }
.idr-btn { display:inline-block; background:var(--indigo); color:#fff; text-decoration:none; padding:13px 24px; font-weight:600; font-size:0.92rem; border-radius:2px; }
.idr-btn:hover { background:#1A2260; }

.idr-foot { margin-top:44px; padding-top:20px; border-top:1px solid var(--rule); font-size:0.8rem; color:var(--mute); }
.idr-foot a { color:var(--indigo); }

@media (max-width:620px) {
  .idr-rule-head { padding:20px 18px 16px; }
  .idr-risk, .idr-enforced { margin-left:18px; margin-right:18px; padding-left:16px; padding-right:16px; }
  .idr-loop-row { flex-direction:column; }
  .idr-loop-arrow { transform:rotate(90deg); padding:4px 0; }
}
`;

const RULE_META = [
  { n: "01", titleKey: "rule1Title", bodyKey: "rule1Body", riskKey: "rule1Risk", refNameKey: "rule1RefName", ref: "IDN-01" },
  { n: "02", titleKey: "rule2Title", bodyKey: "rule2Body", riskKey: "rule2Risk", refNameKey: "rule2RefName", ref: "IDN-02" },
  { n: "03", titleKey: "rule3Title", bodyKey: "rule3Body", riskKey: "rule3Risk", refNameKey: "rule3RefName", ref: "ENT-01" },
  { n: "04", titleKey: "rule4Title", bodyKey: "rule4Body", riskKey: "rule4Risk", refNameKey: "rule4RefName", ref: "AUD-01" },
  { n: "05", titleKey: "rule5Title", bodyKey: "rule5Body", riskKey: "rule5Risk", refNameKey: "rule5RefName", ref: "CRD-02" },
];

const LOOP_KEYS = ["loopStep1", "loopStep2", "loopStep3", "loopStep4", "loopStep5", "loopStep6"];

export default async function IdentityRulesPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "identityRules" });
  const tf = await getTranslations({ locale, namespace: "footer" });

  return (
    <div className="idr">
      <style>{CSS}</style>
      <PublicNav current="/identity-rules" />
      <div className="idr-shell">
        <div className="idr-hero">
          <p className="idr-eyebrow">{t("eyebrow")}</p>
          <h1>{t("h1")}</h1>
          <p className="idr-lede">{t("lede")}</p>
        </div>

        {RULE_META.map((r) => (
          <div className="idr-rule" key={r.ref}>
            <div className="idr-rule-head">
              <span className="idr-num">{r.n}</span>
              <div>
                <h2>{t(r.titleKey)}</h2>
                <p>{t(r.bodyKey)}</p>
              </div>
            </div>
            <div className="idr-risk">
              <b>{t("riskLabel")}</b>
              {t(r.riskKey)}
            </div>
            <div className="idr-enforced">
              <span>{t("enforcedByLabel")} <b>{r.ref}</b> — {t(r.refNameKey)}</span>
              <a href={`/controls#${r.ref}`}>{t("seeControl")}</a>
            </div>
          </div>
        ))}

        <div className="idr-loop">
          <h2>{t("loopHeading")}</h2>
          <p className="idr-loop-note">{t("loopNote")}</p>
          <div className="idr-loop-row">
            {LOOP_KEYS.map((key, i) => (
              <div className="idr-loop-step" key={key} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div className="idr-loop-circle">{i + 1}</div>
                  <div className="lbl">{t(key)}</div>
                </div>
                {i < LOOP_KEYS.length - 1 && <span className="idr-loop-arrow">→</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="idr-cta">
          <p>{t("ctaText")}</p>
          <a className="idr-btn" href="/sample-passport">{t("ctaButton")}</a>
        </div>

        <div className="idr-foot">
          <p>© 2026 Aseem Mohan · <a href="/controls">{tf("controls")}</a> · <a href="/methodology">{tf("methodology")}</a> · <a href="/">{tf("assessment")}</a></p>
        </div>
      </div>
    </div>
  );
}
