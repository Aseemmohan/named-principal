"use client";

/**
 * NavBar — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: components/NavBar.jsx
 *
 * Shared across all authenticated pages (dashboard, estate, approvals).
 * The public tools (/, /agent, /report) keep their own minimal bars —
 * this one is specifically for the signed-in system-of-record section.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabaseBrowser } from "../lib/supabaseClient";

const LINKS = [
  { href: "/dashboard", label: "Command Center" },
  { href: "/estate", label: "AI Estate" },
  { href: "/approvals", label: "Approvals" },
];

export default function NavBar({ orgName }) {
  const pathname = usePathname();

  async function signOut() {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div className="np-bar">
      <span>
        <b>Named Principal</b>{orgName ? ` — ${orgName}` : ""}
        {LINKS.map(l => (
          <Link key={l.href} href={l.href} className={pathname?.startsWith(l.href) ? "active" : ""}>
            {l.label}
          </Link>
        ))}
      </span>
      <span className="np-bar-right">
        <a href="/agent">Risk profiler</a>
        <a href="#" onClick={(e) => { e.preventDefault(); signOut(); }}>Sign out</a>
      </span>
    </div>
  );
}
