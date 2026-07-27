import { createClient } from "@supabase/supabase-js";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, org, total, tier } = body;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return Response.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { error } = await supabase.from("readiness_leads").insert({
      email: String(email).trim().slice(0, 200),
      organisation: org ? String(org).trim().slice(0, 200) : null,
      total_score: Number(total) || 0,
      tier: String(tier || "").slice(0, 8),
    });

    if (error) throw error;

    return Response.json({ ok: true });
  } catch (e) {
    console.error("readiness-lead:", e);
    return Response.json({ error: "Could not save. Try again." }, { status: 500 });
  }
}