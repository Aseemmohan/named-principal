"use client";

/**
 * Pending Approvals — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/approvals/page.jsx
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../../lib/supabaseClient";
import { getCurrentOrg } from "../../../lib/org";
import { BASE_CSS } from "../../../lib/theme";
import { TIERS } from "../../../lib/riskModel";
import NavBar from "../../../components/NavBar";

export default function Approvals() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [org, setOrg] = useState(null);
  const [items, setItems] = useState([]);

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
          .select("id, name, environment, risk_tier, risk_score, named_principal_name, next_review_at, submitted_at")
          .eq("org_id", o.id)
          .eq("lifecycle_status", "pending_approval")
          .order("submitted_at", { ascending: true });
        setItems(data || []);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="np">
      <style>{BASE_CSS}</style>
      <NavBar orgName={org?.name} />
      <div className="np-shell">
        <p className="np-eyebrow">Approvals</p>
        <h1>Decisions required</h1>
        <p className="np-lede">Agents submitted for approval, oldest first.</p>

        {loading ? (
          <p className="np-note">Loading…</p>
        ) : items.length === 0 ? (
          <div className="np-empty"><h2>Nothing waiting</h2><p>Every submitted agent has been decided.</p></div>
        ) : (
          <div className="np-card" style={{ overflowX: "auto" }}>
            <table className="np-tbl">
              <thead><tr><th>Agent</th><th>Tier</th><th>Named principal</th><th>Waiting since</th><th></th></tr></thead>
              <tbody>
                {items.map(p => {
                  const tier = p.risk_tier ? TIERS[p.risk_tier] : null;
                  const blocked = !p.named_principal_name;
                  return (
                    <tr key={p.id}>
                      <td><strong>{p.name}</strong><br /><span style={{ color: "var(--mute)", fontSize: "0.78rem" }}>{p.environment}</span></td>
                      <td>{tier && <span className={`np-pill ${tier.tone}`}>{tier.code}</span>}</td>
                      <td>{blocked ? <span style={{ color: "var(--alert)" }}>Missing — blocks approval</span> : p.named_principal_name}</td>
                      <td>{p.submitted_at ? new Date(p.submitted_at).toLocaleDateString() : "—"}</td>
                      <td><button className="np-btn small" onClick={() => router.push(`/estate/${p.id}`)}>Review</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
