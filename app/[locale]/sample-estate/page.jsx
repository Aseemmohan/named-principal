/**
 * Sample AI Estate — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/[locale]/sample-estate/page.jsx  (replaces existing)
 *
 * Converted to pull text from the translation system. Agent 1
 * ("Vendor Invoice Reconciliation Agent") reuses the exact same
 * translated string as sample-passport's h1, since this row links
 * through to that page — kept identical on purpose, not
 * independently translated, so the two pages stay in sync.
 *
 * Tier values (elevated/contained/high/critical) now display through
 * the same translated tier labels used everywhere else on the site
 * (methodology namespace), rather than the raw lowercase English word
 * shown in the previous version — a small consistency fix alongside
 * the translation, not just a language swap.
 */

import { getTranslations } from "next-intl/server";
import PublicNav from "../../../components/PublicNav";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sampleEstate" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: "https://www.namedprincipal.com/sample-estate" },
  };
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;800&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

.sest {
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
.sest *, .sest *::before, .sest *::after { box-sizing:border-box; }
.sest-shell { max-width:960px; margin:0 auto; padding:0 22px 90px; }

.sest-banner {
  background:var(--signal-soft); border-bottom:2px solid var(--signal);
  padding:12px 22px; text-align:center; font-family:'IBM Plex Mono',monospace;
  font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:var(--signal); font-weight:600;
}

.sest-hero { padding:36px 0 8px; max-width:680px; }
.sest-eyebrow { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--indigo); margin-bottom:12px; }
.sest h1 { font-family:'Archivo',sans-serif; font-size:clamp(1.7rem,4.5vw,2.3rem); font-weight:800; margin:0 0 10px; letter-spacing:-0.02em; }
.sest-lede { color:var(--slate); font-size:0.92rem; }

.sest-stat-row { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px; margin:24px 0 8px; }
.sest-stat { background:var(--surface); border:1px solid var(--rule); border-radius:2px; padding:16px; }
.sest-stat span { display:block; font-size:0.68rem; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:var(--mute); }
.sest-stat b { display:block; font-family:'Archivo',sans-serif; font-weight:800; font-size:1.7rem; letter-spacing:-0.02em; margin-top:4px; }

.sest-warn { background:var(--alert-soft); border-left:3px solid var(--alert); padding:14px 16px; font-size:0.87rem; margin:16px 0; }

.sest-card { border:1px solid var(--rule); background:var(--surface); margin-top:20px; overflow-x:auto; }
.sest-tbl { width:100%; border-collapse:collapse; }
.sest-tbl th, .sest-tbl td { padding:11px 14px; text-align:left; border-bottom:1px solid #EDEFF3; font-size:0.85rem; }
.sest-tbl th { font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--slate); font-weight:500; background:#FAFBFC; }
.sest-tbl tr:last-child td { border-bottom:0; }
.sest-agent-name { font-weight:600; }
.sest-agent-env { display:block; color:var(--mute); font-size:0.78rem; margin-top:2px; }

.sest-pill { font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.06em; padding:3px 8px; display:inline-block; text-transform:uppercase; }
.sest-pill.verify { background:var(--verify-soft); color:var(--verify); }
.sest-pill.signal { background:var(--signal-soft); color:var(--signal); }
.sest-pill.alert { background:var(--alert-soft); color:var(--alert); }
.sest-pill.idle { background:#EEF0F4; color:var(--mute); }

.sest-cta { margin-top:44px; border:1px solid var(--indigo); background:var(--surface); padding:26px 28px; text-align:center; }
.sest-cta p { color:var(--slate); font-size:0.92rem; margin:0 0 16px; }
.sest-btn { display:inline-block; background:var(--indigo); color:#fff; text-decoration:none; padding:13px 24px; font-weight:600; font-size:0.92rem; border-radius:2px; }
.sest-btn:hover { background:#1A2260; }

.sest-foot { margin-top:44px; padding-top:20px; border-top:1px solid var(--rule); font-size:0.8rem; color:var(--mute); }
.sest-foot a { color:var(--indigo); }

@media (max-width:620px) {
  .sest-tbl { font-size:0.78rem; }
}
`;

const STATUS_TONE = { draft: "idle", pending_approval: "signal", approved: "verify", retired: "idle" };
const TIER_TONE = { contained: "verify", elevated: "signal", high: "alert", critical: "alert" };
const TIER_LABEL_KEY = { contained: "tierContained", elevated: "tierElevated", high: "tierHigh", critical: "tierCritical" };
const STATUS_LABEL_KEY = { draft: "statusDraft", pending_approval: "statusPendingApproval", approved: "statusApproved", retired: "statusRetired" };

export default async function SampleEstatePage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sampleEstate" });
  const ts = await getTranslations({ locale, namespace: "sampleShared" });
  const tc = await getTranslations({ locale, namespace: "controls" });
  const tf = await getTranslations({ locale, namespace: "footer" });

  // Agent 1's name reuses sampleShared.agentVendorInvoice (identical
  // to sample-passport's h1) rather than a separate translation, so
  // the linked-through page stays in sync. Person names, dates, and
  // environment values (production/staging) stay literal.
  const AGENTS = [
    { nameKey: null, sharedName: true, env: "production", status: "approved", tier: "elevated", principal: "Priya Sharma", review: "19 Jan 2027", link: "/sample-passport" },
    { nameKey: "agent2Name", env: "production", status: "approved", tier: "contained", principal: "Wei Ling Tan", review: "02 Nov 2026", link: null },
    { nameKey: "agent3Name", env: "staging", status: "pending_approval", tier: "high", principal: "David Oyelaran", review: "—", link: null },
    { nameKey: "agent4Name", env: "production", status: "approved", tier: "contained", principal: "Sarah Mitchell", review: "14 Dec 2026", link: null },
    { nameKey: "agent5Name", env: "staging", status: "draft", tier: "critical", principal: null, review: "—", link: null },
    { nameKey: "agent6Name", env: "production", status: "approved", tier: "contained", principal: "James Whitfield", review: "08 Mar 2027", link: null },
    { nameKey: "agent7Name", env: "production", status: "pending_approval", tier: "elevated", principal: "Amara Okafor", review: "—", link: null },
    { nameKey: "agent8Name", env: "production", status: "retired", tier: "contained", principal: "Marcus Chen", review: "—", link: null },
  ];

  const total = AGENTS.length;
  const pending = AGENTS.filter((a) => a.status === "pending_approval").length;
  const highCritical = AGENTS.filter((a) => a.tier === "high" || a.tier === "critical").length;
  const orphans = AGENTS.filter((a) => !a.principal && a.status !== "retired");

  return (
    <div className="sest">
      <style>{CSS}</style>
      <div className="sest-banner">{ts("bannerText")}</div>
      <PublicNav current="/sample-estate" />
      <div className="sest-shell">
        <div className="sest-hero">
          <p className="sest-eyebrow">{t("eyebrow")}</p>
          <h1>{t("h1")}</h1>
          <p className="sest-lede">{t("lede")}</p>
        </div>

        <div className="sest-stat-row">
          <div className="sest-stat"><span>{t("statTotalRegistered")}</span><b>{total}</b></div>
          <div className="sest-stat"><span>{t("statPendingApproval")}</span><b>{pending}</b></div>
          <div className="sest-stat"><span>{t("statHighCritical")}</span><b>{highCritical}</b></div>
          <div className="sest-stat"><span>{t("statNoPrincipal")}</span><b>{orphans.length}</b></div>
        </div>

        {orphans.length > 0 && (
          <div className="sest-warn">
            {t.rich("warnText", {
              count: orphans.length,
              b: (chunks) => <strong>{chunks}</strong>,
            })}
          </div>
        )}

        <div className="sest-card">
          <table className="sest-tbl">
            <thead>
              <tr>
                <th>{t("tblAgent")}</th>
                <th>{t("tblStatus")}</th>
                <th>{t("tblTier")}</th>
                <th>{t("tblPrincipal")}</th>
                <th>{t("tblNextReview")}</th>
              </tr>
            </thead>
            <tbody>
              {AGENTS.map((a, i) => (
                <tr key={i}>
                  <EstateRow
                    a={a}
                    name={a.sharedName ? ts("agentVendorInvoice") : t(a.nameKey)}
                    statusLabel={t(STATUS_LABEL_KEY[a.status])}
                    tierLabel={tc(TIER_LABEL_KEY[a.tier])}
                    unassignedLabel={t("unassignedLabel")}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sest-cta">
          <p>{t("ctaBody")}</p>
          <a className="sest-btn" href="/pilot">{t("ctaLink")}</a>
        </div>

        <div className="sest-foot">
          <p>© 2026 Aseem Mohan · <a href="/">{tf("assessment")}</a> · <a href="/sample-passport">{t("footerSamplePassportLink")}</a> · <a href="/methodology">{tf("methodology")}</a></p>
        </div>
      </div>
    </div>
  );
}

function EstateRow({ a, name, statusLabel, tierLabel, unassignedLabel }) {
  return (
    <>
      <td>
        {a.link ? (
          <a href={a.link} style={{ color: "var(--indigo)", textDecoration: "none", fontWeight: 600 }}>
            {name}
          </a>
        ) : (
          <span className="sest-agent-name">{name}</span>
        )}
        <span className="sest-agent-env">{a.env}</span>
      </td>
      <td><span className={`sest-pill ${STATUS_TONE[a.status]}`}>{statusLabel}</span></td>
      <td><span className={`sest-pill ${TIER_TONE[a.tier]}`}>{tierLabel}</span></td>
      <td>{a.principal || <span style={{ color: "var(--alert)" }}>{unassignedLabel}</span>}</td>
      <td>{a.review}</td>
    </>
  );
}
