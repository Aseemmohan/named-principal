/**
 * Audit logging — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: lib/audit.js
 *
 * One call site for every material change, so "reproduce this approval
 * six months later" (the blueprint's own auditor user story) is always
 * possible rather than depending on every page remembering to log.
 */

export async function logEvent(supabase, { orgId, passportId = null, actorUserId, actorEmail, eventType, detail = {} }) {
  const { error } = await supabase.from("audit_log").insert({
    org_id: orgId,
    passport_id: passportId,
    actor_user_id: actorUserId,
    actor_email: actorEmail,
    event_type: eventType,
    detail,
  });
  if (error) console.error("audit_log write failed:", error, { eventType, passportId });
  return !error;
}
