"use client";

/**
 * Command Center — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/dashboard/page.jsx
 *
 * The blueprint's CISO dashboard (section 4.1) is much larger than
 * this — connector-derived signals, framework coverage, incident
 * counts. Those need data sources that don't exist yet. This shows
 * only what's honestly answerable from what's actually stored, and
 * is meant to grow as later phases add real inputs, not to fake a
 * fuller picture now.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../lib/supabaseClient";
import { getCurrentOrg } from "../../lib/org";
import { BASE_CSS } from "../../lib/theme";
import NavBar from "../../components/NavBar";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [org, setOrg] = useState(null);
  const [passports, setPassports] = useState([]);

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
          .select("id, name, lifecycle_status, risk_tier, named_principal_name, next_review_at, submitted_at")
          .eq("org_id", o.id);
        setPassports(data || []);
      }
      setLoading(false);
    })();
  }, []);

  const total = passports.length;
  const highCritical = passports.filter(p => p.risk_tier === "high" || p.risk_tier === "critical").length;
  const pending = passports.filter(p => p.lifecycle_status === "pending_approval").length;
  const approved = passports.filter(p => p.lifecycle_status === "approved").length;
  const orphans = passports.filter(p => !p.named_principal_name && p.lifecycle_status !== "retired");
  const overdue = passports.filter(p => p.next_review_at && new Date(p.next_review_at) < new Date() && p.lifecycle_status === "approved");

  return (
    <div className="np">
      <style>{BASE_CSS}</style>
      <NavBar orgName={org?.name} />
      <div className="np-shell">
        <p className="np-eyebrow">Command Center</p>
        <h1>{org?.name || "Your organisation"}</h1>

        {loading ? (
          <p className="np-note">Loading…</p>
        ) : total === 0 ? (
          <div className="np-empty">
            <h2>Nothing registered yet</h2>
            <p>Register your first agent to see this fill in.</p>
            <button className="np-btn" onClick={() => router.push("/estate/new")}>Register an agent</button>
          </div>
        ) : (
          <>
            <div className="np-stat-row">
              <div className="np-stat"><span>Total governed</span><b>{total}</b></div>
              <div className="np-stat"><span>Critical / high</span><b>{highCritical}</b></div>
              <div className="np-stat"><span>Approved</span><b>{approved}</b></div>
              <div className="np-stat"><span>Awaiting decision</span><b>{pending}</b></div>
            </div>

            <h2>Decisions required</h2>
            {pending === 0 && overdue.length === 0 && orphans.length === 0 ? (
              <p className="np-note">Nothing needs your attention right now.</p>
            ) : (
              <div className="np-card">
                {pending > 0 && (
                  <div className="np-info" style={{ margin: 12 }}>
                    <strong>{pending}</strong> agent{pending === 1 ? "" : "s"} waiting on an approval decision.{" "}
                    <a href="/approvals" style={{ color: "var(--indigo)" }}>Review now →</a>
                  </div>
                )}
                {orphans.length > 0 && (
                  <div className="np-warn" style={{ margin: 12 }}>
                    <strong>{orphans.length}</strong> agent{orphans.length === 1 ? "" : "s"} without a named principal —
                    these cannot reach Approved status as is.
                  </div>
                )}
                {overdue.length > 0 && (
                  <div className="np-warn" style={{ margin: 12 }}>
                    <strong>{overdue.length}</strong> approved agent{overdue.length === 1 ? "" : "s"} past its recertification date.
                  </div>
                )}
              </div>
            )}

            <h2>Recently updated</h2>
            <div className="np-card">
              {passports.slice(0, 6).map(p => (
                <div key={p.id} style={{ padding: "10px 16px", borderBottom: "1px solid #EDEFF3", fontSize: "0.88rem", cursor: "pointer" }}
                  onClick={() => router.push(`/estate/${p.id}`)}>
                  <strong>{p.name}</strong> — {p.lifecycle_status.replace("_", " ")}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
