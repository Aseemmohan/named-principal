/**
 * Organisation helper — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: lib/org.js
 */

/** Returns { id, name } for the signed-in user's organisation, or null. */
export async function getCurrentOrg(supabase, userId) {
  const { data: membership } = await supabase
    .from("memberships")
    .select("org_id, role, organizations ( id, name )")
    .eq("user_id", userId)
    .maybeSingle();

  if (!membership) return null;
  return { id: membership.org_id, name: membership.organizations?.name, role: membership.role };
}
