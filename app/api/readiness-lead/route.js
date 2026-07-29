/**
 * Lead capture + report delivery — Agent of Record
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * REPLACES: app/api/readiness-lead/route.js
 *
 * Answers arrive here, generate the personalised report, and are discarded.
 * Only email, organisation, total score and tier are written to the database.
 */

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { analyse, encodeAnswers, buildEmailHtml, buildEmailText } from "../../../lib/report";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "hello@example.com";
const FROM = process.env.EMAIL_FROM || "Agent of Record <onboarding@resend.dev>";
const SITE = process.env.SITE_URL || "http://localhost:3000";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, org, answers } = body;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return Response.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (!answers || typeof answers !== "object") {
      return Response.json({ error: "Assessment data missing." }, { status: 400 });
    }

    const analysis = analyse(answers);
    const cleanEmail = String(email).trim().slice(0, 200);
    const cleanOrg = org ? String(org).trim().slice(0, 200) : null;

    // 1. Store the minimum. Never the answers.
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    const { error: dbError } = await supabase.from("readiness_leads").insert({
      email: cleanEmail,
      organisation: cleanOrg,
      total_score: analysis.total,
      tier: analysis.tier.code,
    });
    if (dbError) throw dbError;

    // 2. Send the personalised report.
    if (!process.env.RESEND_API_KEY) {
      console.warn("readiness-lead: RESEND_API_KEY not set — lead saved, email skipped");
      return Response.json({ ok: true, emailed: false });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const code = encodeAnswers(answers);
    const reportUrl = `${SITE}/report?s=${code}${cleanOrg ? `&o=${encodeURIComponent(cleanOrg)}` : ""}`;

    const { error: mailError } = await resend.emails.send({
      from: FROM,
      to: cleanEmail,
      replyTo: CONTACT_EMAIL,
      subject: `Your agent governance readiness report — Tier ${analysis.tier.code}, ${analysis.tier.label}`,
      html: buildEmailHtml({
        analysis,
        org: cleanOrg,
        reportUrl,
        pdfUrl: `${SITE}/Named_Principal_Twelve_Controls.pdf`,
        contactEmail: CONTACT_EMAIL,
      }),
      text: buildEmailText({ analysis, reportUrl }),
    });

    if (mailError) {
      // Lead is saved; delivery failed. Log loudly, tell the user honestly.
      console.error("readiness-lead: email send failed:", mailError);
      return Response.json({ ok: true, emailed: false });
    }

    return Response.json({ ok: true, emailed: true });
  } catch (e) {
    console.error("readiness-lead:", e);
    return Response.json({ error: "Could not process. Try again." }, { status: 500 });
  }
}
