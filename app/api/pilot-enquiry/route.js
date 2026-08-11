/**
 * Pilot enquiry — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/api/pilot-enquiry/route.js
 *
 * Real backend for the pilot enquiry form — replaces the mailto: link,
 * which depends on the visitor's OS having a default mail client
 * configured (confirmed broken for at least one real visitor: Chrome
 * has no built-in mailto handler unless explicitly configured to hand
 * off to webmail). A form that POSTs to a route handler works
 * regardless of the visitor's local software setup.
 *
 * Same pattern as app/api/readiness-lead/route.js: service-role
 * Supabase client server-side (bypasses RLS, so the table itself needs
 * no public insert policy), Resend for email. Sends two emails: a
 * notification to the site owner so a new enquiry is actually noticed,
 * and a confirmation to the enquirer so they know it went somewhere.
 */

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "reports@namedprincipal.com";
const FROM = process.env.EMAIL_FROM || "Named Principal <onboarding@resend.dev>";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, organisation, role, estimatedAgents, message } = body;

    if (!name || !String(name).trim()) {
      return Response.json({ error: "Enter your name." }, { status: 400 });
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return Response.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const clean = (v, max = 400) => (v ? String(v).trim().slice(0, max) : null);
    const record = {
      name: clean(name, 200),
      email: clean(email, 200),
      organisation: clean(organisation, 200),
      role: clean(role, 200),
      estimated_agents: clean(estimatedAgents, 50),
      message: clean(message, 2000),
    };

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    const { error: dbError } = await supabase.from("pilot_enquiries").insert(record);
    if (dbError) throw dbError;

    if (!process.env.RESEND_API_KEY) {
      console.warn("pilot-enquiry: RESEND_API_KEY not set — enquiry saved, emails skipped");
      return Response.json({ ok: true, emailed: false });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Notify the owner — this is the email that actually matters operationally.
    const { error: ownerMailError } = await resend.emails.send({
      from: FROM,
      to: CONTACT_EMAIL,
      replyTo: record.email,
      subject: `New pilot enquiry — ${record.name}${record.organisation ? ` (${record.organisation})` : ""}`,
      text: [
        `Name: ${record.name}`,
        `Email: ${record.email}`,
        record.organisation ? `Organisation: ${record.organisation}` : null,
        record.role ? `Role: ${record.role}` : null,
        record.estimated_agents ? `Estimated agents: ${record.estimated_agents}` : null,
        record.message ? `\nMessage:\n${record.message}` : null,
      ].filter(Boolean).join("\n"),
    });
    if (ownerMailError) console.error("pilot-enquiry: owner notification failed:", ownerMailError);

    // Confirm receipt to the enquirer — sets expectations, doesn't overpromise a timeline.
    const { error: replyMailError } = await resend.emails.send({
      from: FROM,
      to: record.email,
      replyTo: CONTACT_EMAIL,
      subject: "Your pilot enquiry — Named Principal",
      text: `Hi ${record.name},\n\nThanks for your interest in a Named Principal pilot. This has been received and I'll be in touch directly to discuss scope and next steps.\n\n— Aseem`,
    });
    if (replyMailError) console.error("pilot-enquiry: confirmation email failed:", replyMailError);

    return Response.json({ ok: true, emailed: !ownerMailError });
  } catch (e) {
    console.error("pilot-enquiry:", e);
    return Response.json({ error: "Could not process. Try again, or email reports@namedprincipal.com directly." }, { status: 500 });
  }
}
