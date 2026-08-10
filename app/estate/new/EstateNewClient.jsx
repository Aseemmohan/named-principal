"use client";

/**
 * New Agent Intake — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/estate/new/page.jsx
 *
 * Combines the nine-question risk profiler (lib/riskModel.js, the same
 * engine as the standalone /agent tool) with Passport metadata, and
 * writes both the passport and its seeded control checklist in one
 * flow — "New Agent Intake -> Risk -> Controls -> Approval" as one
 * end-to-end path, per the blueprint's own next-design-work item.
 */

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "../../../lib/supabaseClient";
import { getCurrentOrg, createOrgForUser } from "../../../lib/org";
import { logEvent } from "../../../lib/audit";
import { BASE_CSS } from "../../../lib/theme";
import { FACTORS, TIERS, CONTROLS, assess, isCompleteAnswerSet, decodeProfilerAnswers, isValidProfilerCode } from "../../../lib/riskModel";
import NavBar from "../../../components/NavBar";

export default function NewAgentIntake() {
  return (
    <Suspense fallback={<div className="np"><style>{BASE_CSS}</style><NavBar /><div className="np-shell"><p className="np-note">Loading…</p></div></div>}>
      <NewAgentIntakeInner />
    </Suspense>
  );
}

function NewAgentIntakeInner() {
  const router = useRouter();
  const params = useSearchParams();

  // Arriving from the standalone profiler with ?a=<code>&name=... —
  // skip straight to the result, nothing re-asked.
  const incomingCode = params.get("a");
  const incomingName = params.get("name") || "";
  const hasIncoming = isValidProfilerCode(incomingCode);

  const [step, setStep] = useState(hasIncoming ? 3 : 1); // 1 = metadata, 2 = profiler, 3 = result
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [meta, setMeta] = useState({
    name: incomingName, environment: "production", purpose: "", permittedTasks: "",
    prohibitedTasks: "", technology: "", namedPrincipalName: "", namedPrincipalEmail: "",
    businessOwner: "", technicalOwner: "",
  });
  const [answers, setAnswers] = useState(hasIncoming ? decodeProfilerAnswers(incomingCode) : {});
  const [factorIndex, setFactorIndex] = useState(0);

  function setMetaField(field, value) { setMeta(m => ({ ...m, [field]: value })); }
  function answer(id, value) {
    setAnswers(a => ({ ...a, [id]: value }));
    if (factorIndex < FACTORS.length - 1) setFactorIndex(i => i + 1);
    else setStep(3);
  }

  const metaReady = meta.name.trim().length > 0;
  const result = isCompleteAnswerSet(answers) ? assess(answers) : null;

  async function save(targetStatus) {
    setSaving(true);
    setError(null);
    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Session expired — sign in again."); setSaving(false); return; }

    let org = await getCurrentOrg(supabase, user.id);
    if (!org) {
      // Self-heal: the automatic org creation during sign-in should have
      // handled this, but if it didn't (a transient failure, or an
      // account that existed before this system did), create it now
      // rather than leaving the account permanently stuck.
      org = await createOrgForUser(supabase, user);
    }
    if (!org) { setError("Couldn't set up your organisation. Try signing out and back in — if this repeats, something's wrong server-side."); setSaving(false); return; }

    const now = new Date().toISOString();
    const nextReview = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

    const { data: passport, error: insErr } = await supabase.from("agent_passports").insert({
      org_id: org.id,
      name: meta.name.trim(),
      environment: meta.environment,
      lifecycle_status: targetStatus,
      named_principal_name: meta.namedPrincipalName.trim() || null,
      named_principal_email: meta.namedPrincipalEmail.trim() || null,
      business_owner: meta.businessOwner.trim() || null,
      technical_owner: meta.technicalOwner.trim() || null,
      purpose: meta.purpose.trim() || null,
      permitted_tasks: meta.permittedTasks.trim() || null,
      prohibited_tasks: meta.prohibitedTasks.trim() || null,
      technology: meta.technology.trim() || null,
      profiler_answers: answers,
      risk_model_version: result.modelVersion,
      risk_score: result.score,
      risk_tier: result.tier,
      risk_overrides: result.overrides,
      risk_asi: result.asi,
      risk_obligations: result.obligations,
      created_by: user.id,
      submitted_at: targetStatus === "pending_approval" ? now : null,
      next_review_at: nextReview,
    }).select("id").single();

    if (insErr) { setError(insErr.message); setSaving(false); return; }

    // Seed the control checklist from the tier's must/should list.
    const controlRows = [
      ...result.controls.must.map(ref => ({ passport_id: passport.id, org_id: org.id, control_ref: ref, requirement: "must" })),
      ...result.controls.should.map(ref => ({ passport_id: passport.id, org_id: org.id, control_ref: ref, requirement: "should" })),
    ];
    if (controlRows.length) await supabase.from("passport_controls").insert(controlRows);

    await logEvent(supabase, {
      orgId: org.id, passportId: passport.id, actorUserId: user.id, actorEmail: user.email,
      eventType: "passport_created",
      detail: { name: meta.name, tier: result.tier, score: result.score, targetStatus },
    });

    router.push(`/estate/${passport.id}`);
  }

  return (
    <div className="np">
      <style>{BASE_CSS}</style>
      <NavBar />
      <div className="np-shell" style={{ maxWidth: 720 }}>
        <p className="np-eyebrow">Step {step} of 3</p>
        <h1>{step === 1 ? "What is this agent?" : step === 2 ? "Nine questions about it" : "Its Passport"}</h1>

        {step === 1 && (
          <>
            <p className="np-lede">
              Basic facts first. The accountability fields matter more than they look — no agent
              can be approved without a named human principal.
            </p>

            <label className="np-field">
              <span>Agent name</span>
              <input value={meta.name} onChange={e => setMetaField("name", e.target.value)} placeholder="e.g. Invoice reconciliation agent" />
            </label>

            <label className="np-field">
              <span>Environment</span>
              <select value={meta.environment} onChange={e => setMetaField("environment", e.target.value)}>
                <option value="development">Development</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </label>

            <label className="np-field">
              <span>Business purpose</span>
              <textarea value={meta.purpose} onChange={e => setMetaField("purpose", e.target.value)} placeholder="What outcome does this agent exist to produce?" />
            </label>

            <label className="np-field">
              <span>Permitted tasks</span>
              <textarea value={meta.permittedTasks} onChange={e => setMetaField("permittedTasks", e.target.value)} />
            </label>

            <label className="np-field">
              <span>Explicitly prohibited tasks</span>
              <textarea value={meta.prohibitedTasks} onChange={e => setMetaField("prohibitedTasks", e.target.value)} />
            </label>

            <label className="np-field">
              <span>Agent / model / provider</span>
              <input value={meta.technology} onChange={e => setMetaField("technology", e.target.value)} placeholder="e.g. Claude Sonnet 5, via internal orchestration platform" />
            </label>

            <h2 style={{ fontSize: "0.95rem", marginTop: 32 }}>Accountability</h2>
            <label className="np-field">
              <span>Named principal — name</span>
              <input value={meta.namedPrincipalName} onChange={e => setMetaField("namedPrincipalName", e.target.value)} placeholder="Accountable for purpose and continued need" />
            </label>
            <label className="np-field">
              <span>Named principal — email</span>
              <input type="email" value={meta.namedPrincipalEmail} onChange={e => setMetaField("namedPrincipalEmail", e.target.value)} />
            </label>
            <label className="np-field">
              <span>Business owner</span>
              <input value={meta.businessOwner} onChange={e => setMetaField("businessOwner", e.target.value)} />
            </label>
            <label className="np-field">
              <span>Technical owner</span>
              <input value={meta.technicalOwner} onChange={e => setMetaField("technicalOwner", e.target.value)} />
            </label>
            <p className="np-hint">
              You can leave the principal blank and fill it in later — but the Passport can't move to
              Approved until it's set.
            </p>

            <button className="np-btn" disabled={!metaReady} onClick={() => setStep(2)} style={{ marginTop: 20 }}>
              Continue to the risk profiler
            </button>
          </>
        )}

        {step === 2 && (
          <ProfilerStep index={factorIndex} onAnswer={answer} onBack={() => setStep(1)} />
        )}

        {step === 3 && result && (
          <ResultStep meta={meta} result={result} saving={saving} error={error}
            onSaveDraft={() => save("draft")}
            onSubmitApproval={() => save("pending_approval")}
            onEditAnswers={() => { setFactorIndex(0); setStep(2); }} />
        )}
      </div>
    </div>
  );
}

function ProfilerStep({ index, onAnswer, onBack }) {
  const f = FACTORS[index];
  return (
    <div>
      <p className="np-note">{index + 1} of {FACTORS.length} · {f.label}</p>
      <h2 style={{ marginTop: 0 }}>{f.q}</h2>
      <p className="np-lede">{f.help}</p>
      <div>
        {f.options.map((opt, i) => (
          <button key={i} className="np-card" style={{ display: "block", width: "100%", textAlign: "left", padding: "14px 16px", marginBottom: 8, cursor: "pointer", fontSize: "0.9rem", background: "var(--surface)" }}
            onClick={() => onAnswer(f.id, i)}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "var(--mute)", marginRight: 8 }}>{i}</span>
            {opt}
          </button>
        ))}
      </div>
      {index === 0 && <button className="np-btn ghost small" onClick={onBack}>Back to details</button>}
    </div>
  );
}

function ResultStep({ meta, result, saving, error, onSaveDraft, onSubmitApproval, onEditAnswers }) {
  const tier = TIERS[result.tier];
  return (
    <div>
      <p className={`np-pill ${tier.tone}`} style={{ fontSize: 12, padding: "5px 10px" }}>{tier.code}</p>
      <h2 style={{ marginTop: 10 }}>{meta.name}</h2>
      <p className="np-lede">{tier.line}</p>
      <p><strong>{tier.verdict}</strong></p>

      {result.overrides.length > 0 && (
        <div className="np-warn">
          {result.overrides.map((o, i) => <p key={i} style={{ margin: i ? "8px 0 0" : 0 }}>{o.why}</p>)}
        </div>
      )}

      <h2>Controls that become mandatory</h2>
      <div className="np-card">
        {result.controls.must.map(ref => (
          <div key={ref} style={{ padding: "10px 16px", borderBottom: "1px solid #EDEFF3", fontSize: "0.88rem" }}>
            <strong style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11 }}>{ref}</strong> — {CONTROLS[ref]}
          </div>
        ))}
      </div>

      {error && <p className="np-warn">{error}</p>}

      <div style={{ marginTop: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="np-btn" disabled={saving} onClick={onSubmitApproval}>
          {saving ? "Saving…" : "Save and submit for approval"}
        </button>
        <button className="np-btn ghost" disabled={saving} onClick={onSaveDraft}>Save as draft</button>
        <button className="np-btn ghost" disabled={saving} onClick={onEditAnswers}>Redo the profiler</button>
      </div>
    </div>
  );
}
