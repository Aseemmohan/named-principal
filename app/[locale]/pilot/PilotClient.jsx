"use client";

/**
 * Pilot page — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/[locale]/pilot/PilotClient.jsx  (replaces existing)
 *
 * FIRST CLIENT COMPONENT converted tonight — every page before this
 * one was a plain Server Component using the async getTranslations()
 * API. This one has real form state (useState, fetch, submit
 * handling), so it needs next-intl's useTranslations() hook instead —
 * the synchronous, client-side API that reads from the
 * NextIntlClientProvider context already set up in the locale layout.
 * Same translation content, different mechanism to reach it.
 *
 * The two-link "Not sure what this produces?" paragraph uses t.rich()
 * with two separate tags (passportLink, estateLink) — the same
 * mechanism used for single-link cases elsewhere, just with two tag
 * mappings provided instead of one.
 */

import { useState } from "react";
import { useTranslations } from "next-intl";
import PublicNav from "../../../components/PublicNav";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;800&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

.plt {
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
.plt *, .plt *::before, .plt *::after { box-sizing:border-box; }
.plt-shell { max-width:900px; margin:0 auto; padding:0 22px 90px; }

.plt-hero { padding:48px 0 8px; max-width:700px; }
.plt-eyebrow { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--indigo); margin-bottom:16px; }
.plt h1 { font-family:'Archivo',sans-serif; font-size:clamp(1.9rem,5vw,2.7rem); font-weight:800; letter-spacing:-0.028em; line-height:1.1; margin:0; }
.plt-lede { margin-top:18px; color:var(--slate); }

.plt-sec { margin-top:48px; }
.plt-sec h2 { font-family:'Archivo',sans-serif; font-size:1.35rem; font-weight:600; letter-spacing:-0.015em; margin:0 0 18px; }

.plt-tbl { width:100%; border-collapse:collapse; }
.plt-tbl td { padding:14px 16px; border-bottom:1px solid var(--rule); font-size:0.9rem; vertical-align:top; }
.plt-tbl tr:last-child td { border-bottom:0; }
.plt-tbl td:first-child { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.06em; text-transform:uppercase; color:var(--indigo); width:150px; white-space:nowrap; padding-top:16px; }
.plt-tbl-wrap { border:1px solid var(--rule); background:var(--surface); }

.plt-hyp { margin-top:16px; padding:16px 18px; background:var(--signal-soft); border-left:3px solid var(--signal); font-size:0.87rem; color:var(--ink); }

.plt-form-card { border:1px solid var(--indigo); background:var(--surface); padding:28px 30px; margin-top:20px; }
.plt-field { margin-bottom:16px; }
.plt-field label { display:block; font-size:0.74rem; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:var(--slate); margin-bottom:6px; }
.plt-field input, .plt-field select, .plt-field textarea {
  width:100%; padding:12px 13px; border:1px solid var(--rule); border-radius:2px;
  font-family:'IBM Plex Sans',sans-serif; font-size:0.95rem; background:var(--surface); color:var(--ink);
}
.plt-field input:focus, .plt-field select:focus, .plt-field textarea:focus { outline:2px solid var(--indigo); outline-offset:1px; border-color:var(--indigo); }
.plt-field textarea { resize:vertical; min-height:90px; }
.plt-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }

.plt-btn {
  background:var(--indigo); color:#fff; border:0; border-radius:2px;
  padding:14px 26px; font-family:'Archivo',sans-serif; font-weight:600; font-size:0.97rem; cursor:pointer;
}
.plt-btn:hover { background:#1A2260; }
.plt-btn:disabled { background:var(--mute); cursor:not-allowed; }

.plt-done { padding:16px 18px; background:var(--verify-soft); border-left:3px solid var(--verify); font-size:0.9rem; }
.plt-error { padding:14px 16px; background:var(--alert-soft); border-left:3px solid var(--alert); font-size:0.87rem; margin-top:14px; }

.plt-foot { margin-top:56px; padding-top:20px; border-top:1px solid var(--rule); font-size:0.82rem; color:var(--mute); }
.plt-foot a { color:var(--indigo); }

@media (max-width:620px) {
  .plt-row { grid-template-columns:1fr; }
  .plt-form-card { padding:20px 18px; }
  .plt-tbl td:first-child { width:auto; display:block; padding-bottom:2px; }
}
`;

export default function PilotPage() {
  const t = useTranslations("pilot");
  const tf = useTranslations("footer");

  const [form, setForm] = useState({ name: "", email: "", organisation: "", role: "", estimatedAgents: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/pilot-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("genericError"));
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const rows = [
    ["rowScopeLabel", "rowScopeBody"],
    ["rowDiscoverLabel", "rowDiscoverBody"],
    ["rowAssessLabel", "rowAssessBody"],
    ["rowGovernLabel", "rowGovernBody"],
    ["rowDemonstrateLabel", "rowDemonstrateBody"],
    ["rowReportLabel", "rowReportBody"],
    ["rowSuccessLabel", "rowSuccessBody"],
  ];

  return (
    <div className="plt">
      <style>{CSS}</style>
      <PublicNav current="/pilot" />
      <div className="plt-shell">
        <div className="plt-hero">
          <p className="plt-eyebrow">{t("eyebrow")}</p>
          <h1>{t("h1")}</h1>
          <p className="plt-lede">{t("lede")}</p>
        </div>

        <section className="plt-sec">
          <h2>{t("whatsIncludedH2")}</h2>
          <div className="plt-tbl-wrap">
            <table className="plt-tbl">
              <tbody>
                {rows.map(([labelKey, bodyKey]) => (
                  <tr key={labelKey}><td>{t(labelKey)}</td><td>{t(bodyKey)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="plt-hyp">
            <strong>{t("pricingBold")}</strong> {t("pricingBody")}
          </div>
          <p style={{ marginTop: 16, fontSize: "0.87rem" }}>
            {t.rich("notSureText", {
              passportLink: (chunks) => <a href="/sample-passport" style={{ color: "var(--indigo)" }}>{chunks}</a>,
              estateLink: (chunks) => <a href="/sample-estate" style={{ color: "var(--indigo)" }}>{chunks}</a>,
            })}
          </p>
        </section>

        <section className="plt-sec">
          <h2>{t("requestPilotH2")}</h2>
          <div className="plt-form-card">
            {sent ? (
              <div className="plt-done">{t("doneMessage")}</div>
            ) : (
              <form onSubmit={submit}>
                <div className="plt-row">
                  <div className="plt-field">
                    <label htmlFor="name">{t("labelName")}</label>
                    <input id="name" required value={form.name} onChange={(e) => update("name", e.target.value)} />
                  </div>
                  <div className="plt-field">
                    <label htmlFor="email">{t("labelEmail")}</label>
                    <input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} />
                  </div>
                </div>
                <div className="plt-row">
                  <div className="plt-field">
                    <label htmlFor="organisation">{t("labelOrganisation")}</label>
                    <input id="organisation" value={form.organisation} onChange={(e) => update("organisation", e.target.value)} />
                  </div>
                  <div className="plt-field">
                    <label htmlFor="role">{t("labelRole")}</label>
                    <input id="role" placeholder={t("placeholderRole")} value={form.role} onChange={(e) => update("role", e.target.value)} />
                  </div>
                </div>
                <div className="plt-field">
                  <label htmlFor="estimatedAgents">{t("labelEstimatedAgents")}</label>
                  <select id="estimatedAgents" value={form.estimatedAgents} onChange={(e) => update("estimatedAgents", e.target.value)}>
                    <option value="">{t("optAgentsBlank")}</option>
                    <option value="1-5">{t("optAgents1to5")}</option>
                    <option value="6-20">{t("optAgents6to20")}</option>
                    <option value="21-50">{t("optAgents21to50")}</option>
                    <option value="50+">{t("optAgents50plus")}</option>
                  </select>
                </div>
                <div className="plt-field">
                  <label htmlFor="message">{t("labelMessage")}</label>
                  <textarea id="message" value={form.message} onChange={(e) => update("message", e.target.value)} />
                </div>
                <button className="plt-btn" type="submit" disabled={busy}>
                  {busy ? t("sendingButton") : t("submitButton")}
                </button>
                <p style={{ marginTop: 14, fontSize: "0.82rem", color: "var(--mute)" }}>
                  {t("responseExpectation")}
                </p>
                {error && <div className="plt-error">{error}</div>}
              </form>
            )}
          </div>
        </section>

        <div className="plt-foot">
          <p>© 2026 Aseem Mohan · <a href="/">{tf("assessment")}</a> · <a href="/methodology">{tf("methodology")}</a> · <a href="/privacy">{tf("privacy")}</a></p>
        </div>
      </div>
    </div>
  );
}
