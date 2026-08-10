"use client";

/**
 * Login — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/login/page.jsx
 *
 * Google OAuth only for now, matching the same phased approach used
 * on Healthyram. Styled to the existing report/privacy design system
 * (IBM Plex Sans/Archivo, indigo primary) rather than introducing a
 * new visual language.
 */

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabaseBrowser } from "../../lib/supabaseClient";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;800&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

.lg {
  --ink:#11151E; --slate:#59637A; --mute:#8B94A6;
  --paper:#EEF1F5; --surface:#FFFFFF; --rule:#D6DBE4;
  --indigo:#26307A; --indigo-soft:#E5E8F5;
  background:var(--paper); color:var(--ink);
  font-family:'IBM Plex Sans',system-ui,sans-serif;
  font-size:15px; line-height:1.6; min-height:100vh;
}
.lg *, .lg *::before, .lg *::after { box-sizing:border-box; }
.lg-shell { max-width:440px; margin:0 auto; padding:0 22px; }
.lg-bar {
  display:flex; align-items:center; padding:14px 0; border-bottom:1px solid var(--rule);
  font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.1em;
  text-transform:uppercase; color:var(--slate); max-width:820px; margin:0 auto; padding-left:22px; padding-right:22px;
}
.lg-bar b { color:var(--ink); font-weight:500; }
.lg-main { padding:64px 0; text-align:center; }
.lg-eyebrow { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--slate); margin-bottom:10px; }
.lg h1 { font-family:'Archivo',sans-serif; font-size:1.9rem; font-weight:800; letter-spacing:-0.02em; margin:0 0 14px; }
.lg-lede { color:var(--slate); margin:0 0 32px; }
.lg-btn {
  display:block; width:100%; padding:14px 20px; border-radius:2px; border:1px solid var(--rule);
  background:var(--surface); font:inherit; font-weight:600; font-size:0.95rem; cursor:pointer; color:var(--ink);
}
.lg-btn:hover { border-color:var(--indigo); color:var(--indigo); }
.lg-btn:disabled { opacity:0.6; cursor:default; }
.lg-alt { margin-top:24px; font-size:0.85rem; color:var(--mute); }
.lg-alt a { color:var(--indigo); }
`;

function LoginInner() {
  const [busy, setBusy] = useState(false);
  const params = useSearchParams();
  const next = params.get("next") || "/estate";

  async function signIn() {
    setBusy(true);
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) { setBusy(false); alert("Sign-in failed. Try again in a moment."); }
  }

  return (
    <div className="lg-main">
      <p className="lg-eyebrow">Sign in</p>
      <h1>Govern your AI estate</h1>
      <p className="lg-lede">
        Sign in to register agents, track approvals, and keep a persistent Agent Passport
        for every agent you assess — instead of a result that disappears when the tab closes.
      </p>
      <button className="lg-btn" disabled={busy} onClick={signIn}>
        {busy ? "Redirecting…" : "Continue with Google"}
      </button>
      <p className="lg-alt">
        Just want a one-off risk read with nothing saved?{" "}
        <a href="/agent">Use the agent risk profiler</a>.
      </p>
    </div>
  );
}

export default function Login() {
  return (
    <div className="lg">
      <style>{CSS}</style>
      <div className="lg-bar"><span><b>Named Principal</b> — Sign in</span></div>
      <div className="lg-shell">
        <Suspense fallback={<div style={{ padding: "80px 0", textAlign: "center", color: "var(--slate)" }}>Loading…</div>}>
          <LoginInner />
        </Suspense>
      </div>
    </div>
  );
}
