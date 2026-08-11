"use client";

/**
 * Agent Passport — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/estate/[id]/PassportClient.jsx  (replaces the
 * content of what was app/estate/[id]/page.jsx — file renamed as part
 * of this fix; see the accompanying note on why)
 *
 * FIXES A REAL GOVERNANCE GAP: "mandatory" controls previously did not
 * block approval at all -- canApprove only checked named principal +
 * review date, so a Passport could be Approved with open must-controls
 * sitting at "missing" indefinitely. That's not a wording problem,
 * it's the word "mandatory" not meaning anything.
 *
 * FIX: a must-control is only closed two ways now -- implemented, or a
 * genuine recorded exception (reason + expiry + named approver, not
 * just flipping a dropdown). An expired exception stops counting as
 * closed. Approval is blocked until every must-control is one or the
 * other. See isControlClosed() below -- this is the actual gate now,
 * not just informational text.
 */

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabaseBrowser } from "../../../lib/supabaseClient";
import { getCurrentOrg } from "../../../lib/org";
import { logEvent } from "../../../lib/audit";
import { BASE_CSS } from "../../../lib/theme";
import { CONTROLS, TIERS } from "../../../lib/riskModel";
import NavBar from "../../../components/NavBar";

const STATUS_LABEL = {
  draft: "Draft", pending_approval: "Pending approval", approved: "Approved", rejected: "Rejected", retired: "Retired",
};
const STATUS_TONE = {
  draft: "idle", pending_approval: "signal", approved: "verify", rejected: "alert", retired: "idle",
};
const CONTROL_STATUS = ["missing", "in_progress", "implemented", "not_applicable", "exception"];

/** The actual gate. A control counts as closed only if it's genuinely
 *  implemented, explicitly not applicable, or has a complete, current
 *  exception on record -- reason, expiry, and named approver all
 *  present, and the expiry date hasn't passed. Anything else (missing,
 *  in_progress, or an exception missing a field, or an expired one)
 *  does not count, regardless of what the dropdown currently shows. */
function isControlClosed(c) {
  if (c.status === "implemented" || c.status === "not_applicable") return true;
  if (c.status === "exception") {
    const hasFullRecord = !!c.exception_reason?.trim() && !!c.exception_expiry && !!c.exception_approved_by?.trim();
    if (!hasFullRecord) return false;
    const today = new Date(new Date().toDateString());
    return new Date(c.exception_expiry) >= today;
  }
  return false;
}

export default function PassportDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [org, setOrg] = useState(null);
  const [user, setUser] = useState(null);
  const [passport, setPassport] = useState(null);
  const [controls, setControls] = useState([]);
  const [audit, setAudit] = useState([]);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    const supabase = supabaseBrowser();
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) return;
    setUser(u);
    const o = await getCurrentOrg(supabase, u.id);
    setOrg(o);
    if (!o) { setLoading(false); return; }

    const [{ data: p }, { data: c }, { data: a }] = await Promise.all([
      supabase.from("agent_passports").select("*").eq("id", id).eq("org_id", o.id).maybeSingle(),
      supabase.from("passport_controls").select("*").eq("passport_id", id).order("control_ref"),
      supabase.from("audit_log").select("*").eq("passport_id", id).order("created_at", { ascending: false }).limit(20),
    ]);
    setPassport(p);
    setControls(c || []);
    setAudit(a || []);
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function updateControl(controlId, field, value) {
    const supabase = supabaseBrowser();
    setControls(cs => cs.map(c => c.id === controlId ? { ...c, [field]: value } : c));
    await supabase.from("passport_controls").update({ [field]: value, updated_at: new Date().toISOString() }).eq("id", controlId);
    const ctrl = controls.find(c => c.id === controlId);
    await logEvent(supabase, {
      orgId: org.id, passportId: id, actorUserId: user.id, actorEmail: user.email,
      eventType: "control_updated", detail: { control_ref: ctrl?.control_ref, field, value },
    });
  }

  async function transition(newStatus, extra = {}) {
    setBusy(true);
    const supabase = supabaseBrowser();
    const patch = { lifecycle_status: newStatus, updated_at: new Date().toISOString(), ...extra };
    const { error } = await supabase.from("agent_passports").update(patch).eq("id", id);
    if (!error) {
      await logEvent(supabase, {
        orgId: org.id, passportId: id, actorUserId: user.id, actorEmail: user.email,
        eventType: `status_${newStatus}`, detail: { note, previous: passport.lifecycle_status },
      });
      setNote("");
      await load();
    } else {
      alert(error.message);
    }
    setBusy(false);
  }

  if (loading) return <Shell org={org}><p className="np-note">Loading…</p></Shell>;
  if (!passport) return <Shell org={org}><div className="np-empty"><h2>Not found</h2><p>This Passport doesn't exist, or isn't in your organisation.</p></div></Shell>;

  const tierMeta = passport.risk_tier ? TIERS[passport.risk_tier] : null;
  const mustControls = controls.filter(c => c.requirement === "must");
  const shouldControls = controls.filter(c => c.requirement === "should");
  const mustClosedList = mustControls.filter(isControlClosed);
  const mustOpenList = mustControls.filter(c => !isControlClosed(c));
  const allMustClosed = mustControls.length === 0 || mustOpenList.length === 0;
  const canApprove = !!passport.named_principal_name && !!passport.next_review_at && allMustClosed;

  return (
    <Shell org={org}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <p className="np-eyebrow">Agent Passport</p>
          <h1 style={{ margin: "0 0 6px" }}>{passport.name}</h1>
          <span className={`np-pill ${STATUS_TONE[passport.lifecycle_status]}`}>{STATUS_LABEL[passport.lifecycle_status]}</span>
          {tierMeta && <span className={`np-pill ${tierMeta.tone}`} style={{ marginLeft: 6 }}>{tierMeta.code}</span>}
        </div>
        <button className="np-btn ghost small" onClick={() => router.push("/estate")}>← Back to Estate</button>
      </div>

      {!passport.named_principal_name && passport.lifecycle_status !== "retired" && (
        <div className="np-warn">No named human principal on record. This Passport cannot be approved until one is set.</div>
      )}
      {mustOpenList.length > 0 && passport.lifecycle_status !== "retired" && passport.lifecycle_status !== "approved" && (
        <div className="np-warn">
          {mustOpenList.length} mandatory control{mustOpenList.length === 1 ? "" : "s"} not yet implemented or excepted
          ({mustOpenList.map(c => c.control_ref).join(", ")}). This Passport cannot be approved until each is either
          implemented or has a complete, current exception recorded.
        </div>
      )}

      <h2>Accountability</h2>
      <div className="np-card" style={{ padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: "0.9rem" }}>
        <div><span style={labelStyle}>Named principal</span>{passport.named_principal_name || "—"} {passport.named_principal_email && <span style={{ color: "var(--mute)" }}>({passport.named_principal_email})</span>}</div>
        <div><span style={labelStyle}>Business owner</span>{passport.business_owner || "—"}</div>
        <div><span style={labelStyle}>Technical owner</span>{passport.technical_owner || "—"}</div>
        <div><span style={labelStyle}>Next review</span>{passport.next_review_at ? new Date(passport.next_review_at).toLocaleDateString() : "—"}</div>
      </div>

      <h2>Purpose</h2>
      <div className="np-card" style={{ padding: 16, fontSize: "0.9rem" }}>
        <p style={{ margin: "0 0 10px" }}><span style={labelStyle}>Business purpose</span>{passport.purpose || "—"}</p>
        <p style={{ margin: "0 0 10px" }}><span style={labelStyle}>Permitted tasks</span>{passport.permitted_tasks || "—"}</p>
        <p style={{ margin: 0 }}><span style={labelStyle}>Explicitly prohibited</span>{passport.prohibited_tasks || "—"}</p>
      </div>

      {tierMeta && (
        <>
          <h2>Risk</h2>
          <div className="np-card" style={{ padding: 16, fontSize: "0.9rem" }}>
            <p style={{ margin: "0 0 10px" }}>{tierMeta.line}</p>
            <p style={{ margin: 0, color: "var(--slate)" }}>
              Score {passport.risk_score} / 42 · assessed under model {passport.risk_model_version}
            </p>
            {passport.risk_overrides?.length > 0 && (
              <div style={{ marginTop: 12 }}>
                {passport.risk_overrides.map((o, i) => (
                  <p key={i} style={{ fontSize: "0.85rem", color: "var(--alert)", margin: "6px 0 0" }}>{o.why}</p>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <h2>Required controls</h2>
      <p className="np-note">
        {mustClosedList.length} of {mustControls.length} mandatory controls closed
        (implemented or under a current exception). Closing a control here is what actually
        unlocks approval — this list isn't just informational.
      </p>
      <div className="np-card">
        {[...mustControls, ...shouldControls].map(c => (
          <div key={c.id} style={{ padding: "12px 16px", borderBottom: "1px solid #EDEFF3" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "start" }}>
              <div>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "var(--mute)" }}>{c.control_ref}{c.requirement === "should" ? " · recommended" : ""}</span>
                <div style={{ fontSize: "0.88rem" }}>{CONTROLS[c.control_ref]}</div>
                <input placeholder="Owner email" value={c.owner_email || ""} onChange={e => updateControl(c.id, "owner_email", e.target.value)}
                  style={{ marginTop: 8, marginRight: 8, padding: "6px 8px", fontSize: "0.8rem", border: "1px solid var(--rule)", width: 180 }} />
                <input type="date" value={c.due_date || ""} onChange={e => updateControl(c.id, "due_date", e.target.value)}
                  style={{ marginTop: 8, padding: "6px 8px", fontSize: "0.8rem", border: "1px solid var(--rule)" }} />
              </div>
              <select value={c.status} onChange={e => updateControl(c.id, "status", e.target.value)}
                style={{ padding: "8px 10px", fontSize: "0.82rem", border: "1px solid var(--rule)", height: "fit-content" }}>
                {CONTROL_STATUS.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
              </select>
            </div>

            {c.status === "exception" && (
              <div style={{ marginTop: 10, padding: 12, background: "var(--signal-soft, #FAF0DC)", borderLeft: "3px solid var(--signal, #9A6100)" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--signal, #9A6100)", marginBottom: 8 }}>
                  Exception record — all three required to count as closed
                </div>
                <textarea placeholder="Reason for the exception" value={c.exception_reason || ""} onChange={e => updateControl(c.id, "exception_reason", e.target.value)}
                  style={{ width: "100%", minHeight: 50, padding: 8, fontSize: "0.82rem", border: "1px solid var(--rule)", marginBottom: 8, font: "inherit" }} />
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.7rem", color: "var(--mute)", marginBottom: 3 }}>Expires</label>
                    <input type="date" value={c.exception_expiry || ""} onChange={e => updateControl(c.id, "exception_expiry", e.target.value)}
                      style={{ padding: "6px 8px", fontSize: "0.8rem", border: "1px solid var(--rule)" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <label style={{ display: "block", fontSize: "0.7rem", color: "var(--mute)", marginBottom: 3 }}>Approved by (email)</label>
                    <input value={c.exception_approved_by || ""} onChange={e => updateControl(c.id, "exception_approved_by", e.target.value)}
                      style={{ padding: "6px 8px", fontSize: "0.8rem", border: "1px solid var(--rule)", width: "100%" }} />
                  </div>
                </div>
                {!isControlClosed(c) && (
                  <p style={{ margin: "8px 0 0", fontSize: "0.78rem", color: "var(--alert, #9B2C1E)" }}>
                    Not yet complete — fill in all three fields (an expired date doesn't count either).
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <h2>Decision</h2>
      <div className="np-card" style={{ padding: 16 }}>
        {passport.lifecycle_status === "draft" && (
          <button className="np-btn" disabled={busy} onClick={() => transition("pending_approval", { submitted_at: new Date().toISOString() })}>
            Submit for approval
          </button>
        )}

        {passport.lifecycle_status === "pending_approval" && (
          <>
            {!canApprove && (
              <p className="np-note" style={{ marginBottom: 10 }}>
                Approve is disabled until a named principal and next review date are set, and every
                mandatory control is implemented or has a current exception recorded.
              </p>
            )}
            <textarea placeholder="Note (optional) — recorded with the decision" value={note} onChange={e => setNote(e.target.value)}
              style={{ width: "100%", minHeight: 60, marginBottom: 10, padding: 10, border: "1px solid var(--rule)", font: "inherit", fontSize: "0.88rem" }} />
            <button className="np-btn" disabled={busy || !canApprove}
              onClick={() => transition("approved", { approved_at: new Date().toISOString(), approved_by: user.id })}>
              Approve
            </button>{" "}
            <button className="np-btn danger" disabled={busy} onClick={() => transition("rejected")}>Reject</button>
          </>
        )}

        {passport.lifecycle_status === "approved" && (
          <>
            <p className="np-note">Approved {passport.approved_at ? new Date(passport.approved_at).toLocaleString() : ""}.</p>
            <button className="np-btn ghost" disabled={busy} onClick={() => transition("retired", { retired_at: new Date().toISOString() })}>Retire this agent</button>
          </>
        )}

        {passport.lifecycle_status === "rejected" && (
          <button className="np-btn ghost" disabled={busy} onClick={() => transition("draft")}>Return to draft</button>
        )}

        {passport.lifecycle_status === "retired" && (
          <p className="np-note">Retired {passport.retired_at ? new Date(passport.retired_at).toLocaleString() : ""}. This record is kept for history.</p>
        )}
      </div>

      <h2>History</h2>
      <div className="np-card">
        {audit.length === 0 ? (
          <p style={{ padding: 16, fontSize: "0.85rem", color: "var(--mute)" }}>No events recorded yet.</p>
        ) : audit.map(e => (
          <div key={e.id} style={{ padding: "10px 16px", borderBottom: "1px solid #EDEFF3", fontSize: "0.82rem" }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", color: "var(--mute)" }}>{new Date(e.created_at).toLocaleString()}</span>
            {" — "}<strong>{e.event_type}</strong>{e.actor_email ? ` by ${e.actor_email}` : ""}
          </div>
        ))}
      </div>
    </Shell>
  );
}

const labelStyle = { display: "block", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--mute)", marginBottom: 3 };

function Shell({ children, org }) {
  return (
    <div className="np">
      <style>{BASE_CSS}</style>
      <NavBar orgName={org?.name} />
      <div className="np-shell">{children}</div>
    </div>
  );
}
