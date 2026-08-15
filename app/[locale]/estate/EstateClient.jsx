"use client";

/**
 * AI Estate — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/estate/page.jsx
 *
 * The authoritative governed inventory (blueprint section 3). Every
 * registered agent, its status, tier and owner, in one list.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "../../../lib/supabaseClient";
import { getCurrentOrg } from "../../../lib/org";
import { BASE_CSS } from "../../../lib/theme";
import NavBar from "../../../components/NavBar";

const STATUS_TONE = {
  draft: "idle", pending_approval: "signal", approved: "verify", rejected: "alert", retired: "idle",
};
const STATUS_LABEL = {
  draft: "Draft", pending_approval: "Pending approval", approved: "Approved", rejected: "Rejected", retired: "Retired",
};
const TIER_TONE = { contained: "verify", elevated: "signal", high: "alert", critical: "alert" };

export default function Estate() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [org, setOrg] = useState(null);
  const [passports, setPassports] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const supabase = supabaseBrowser();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const o = await getCurrentOrg(supabase, user.id);
      setOrg(o);
      if (o) {
        const { data } = await supabase
          .from("agent_passports")
          .select("id, name, environment, lifecycle_status, risk_tier, risk_score, named_principal_name, next_review_at, updated_at")
          .eq("org_id", o.id)
          .order("updated_at", { ascending: false });
        setPassports(data || []);
      }
      setLoading(false);
    })();
  }, []);

  const filtered = filter === "all" ? passports : passports.filter(p => p.lifecycle_status === filter);
  const orphans = passports.filter(p => !p.named_principal_name && p.lifecycle_status !== "retired");

  return (
    <div className="np">
      <style>{BASE_CSS}</style>
      <NavBar orgName={org?.name} />
      <div className="np-shell">
        <p className="np-eyebrow">AI Estate</p>
        <h1>Registered agents</h1>
        <p className="np-lede">
          Every agent your organisation has assessed. Nothing here is deployed automatically —
          this is the record, not the runtime.
        </p>

        <div className="np-stat-row">
          <div className="np-stat"><span>Total registered</span><b>{passports.length}</b></div>
          <div className="np-stat"><span>Pending approval</span><b>{passports.filter(p => p.lifecycle_status === "pending_approval").length}</b></div>
          <div className="np-stat"><span>High / critical</span><b>{passports.filter(p => p.risk_tier === "high" || p.risk_tier === "critical").length}</b></div>
          <div className="np-stat"><span>Without a named principal</span><b>{orphans.length}</b></div>
        </div>

        {orphans.length > 0 && (
          <div className="np-warn">
            <strong>{orphans.length} agent{orphans.length === 1 ? "" : "s"}</strong> {orphans.length === 1 ? "has" : "have"} no
            named human principal on record. None of these can reach Approved status until that's fixed — this is enforced,
            not just a reminder.
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28, flexWrap: "wrap", gap: 10 }}>
          <div>
            {["all", "draft", "pending_approval", "approved", "retired"].map(f => (
              <button key={f} className={`np-btn small ghost`} style={{ marginRight: 6, ...(filter === f ? { borderColor: "var(--indigo)", color: "var(--indigo)" } : {}) }}
                onClick={() => setFilter(f)}>
                {f === "all" ? "All" : STATUS_LABEL[f]}
              </button>
            ))}
          </div>
          <Link className="np-btn" href="/estate/new">Register agent</Link>
        </div>

        {loading ? (
          <p className="np-note" style={{ marginTop: 24 }}>Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="np-empty">
            <h2>{passports.length === 0 ? "No agents registered yet" : "Nothing matches this filter"}</h2>
            <p>Registering an agent runs the nine-question risk profiler and creates its Passport.</p>
            {passports.length === 0 && <Link className="np-btn" href="/estate/new">Register your first agent</Link>}
          </div>
        ) : (
          <div className="np-card" style={{ marginTop: 16, overflowX: "auto" }}>
            <table className="np-tbl">
              <thead>
                <tr><th>Agent</th><th>Status</th><th>Tier</th><th>Named principal</th><th>Next review</th></tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="clickable" onClick={() => router.push(`/estate/${p.id}`)}>
                    <td><strong>{p.name}</strong><br /><span style={{ color: "var(--mute)", fontSize: "0.78rem" }}>{p.environment}</span></td>
                    <td><span className={`np-pill ${STATUS_TONE[p.lifecycle_status]}`}>{STATUS_LABEL[p.lifecycle_status]}</span></td>
                    <td>{p.risk_tier ? <span className={`np-pill ${TIER_TONE[p.risk_tier]}`}>{p.risk_tier}</span> : <span style={{ color: "var(--mute)" }}>—</span>}</td>
                    <td>{p.named_principal_name || <span style={{ color: "var(--alert)" }}>Unassigned</span>}</td>
                    <td>{p.next_review_at ? new Date(p.next_review_at).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
