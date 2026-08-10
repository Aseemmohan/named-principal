/**
 * Organisation helper — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: lib/org.js
 */

/** Returns { id, name, role } for the signed-in user's organisation, or null. */
export async function getCurrentOrg(supabase, userId) {
  const { data: membership, error: mErr } = await supabase
    .from("memberships")
    .select("org_id, role")
    .eq("user_id", userId)
    .maybeSingle();

  if (mErr) { console.error("getCurrentOrg: membership lookup failed:", mErr); return null; }
  if (!membership) return null;

  const { data: org, error: oErr } = await supabase
    .from("organizations")
    .select("id, name")
    .eq("id", membership.org_id)
    .maybeSingle();

  if (oErr) { console.error("getCurrentOrg: organization lookup failed:", oErr); return null; }
  if (!org) return null;

  return { id: org.id, name: org.name, role: membership.role };
}

/**
 * Self-heal path: if a signed-in user somehow has no organisation
 * (e.g. the auto-creation during OAuth callback failed silently),
 * create one on demand rather than leaving them permanently stuck.
 */
export async function createOrgForUser(supabase, user) {
  const displayName = user.user_metadata?.full_name || user.email;
  const { data: org, error: orgErr } = await supabase
    .from("organizations")
    .insert({ name: `${displayName}'s organisation`, created_by: user.id })
    .select("id, name")
    .single();

  if (orgErr) { console.error("createOrgForUser: org insert failed:", orgErr); return null; }

  const { error: memErr } = await supabase
    .from("memberships")
    .insert({ org_id: org.id, user_id: user.id, role: "owner" });

  if (memErr) { console.error("createOrgForUser: membership insert failed:", memErr); return null; }

  return { id: org.id, name: org.name, role: "owner" };
}