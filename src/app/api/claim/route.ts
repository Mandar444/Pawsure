// POST /api/claim
// Body: { case_id, ngo_id }
// First NGO wins — atomicity enforced in the claim_case() DB function.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { notifyReporter } from "@/lib/notify";

function ngoName(n: unknown): string | null {
  if (!n) return null;
  const o = Array.isArray(n) ? n[0] : n;
  return (o as { name?: string })?.name ?? null;
}

const getSupabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const { case_id, ngo_id } = await req.json();
  if (!case_id || !ngo_id) {
    return NextResponse.json({ error: "case_id and ngo_id required" }, { status: 400 });
  }

  const { data: won, error } = await supabase.rpc("claim_case", {
    p_case_id: case_id,
    p_ngo_id: ngo_id,
  });
  if (error) {
    console.error("claim_case rpc failed", error);
    return NextResponse.json({ error: "claim failed" }, { status: 500 });
  }

  if (!won) {
    const { data: c } = await supabase
      .from("cases")
      .select("status, claimed_by, ngos:claimed_by(name)")
      .eq("id", case_id)
      .single();

    // They claimed it themselves (double-tap / refresh) — treat as success.
    if (c?.claimed_by === ngo_id) {
      return NextResponse.json({ claimed: true });
    }

    // Genuinely taken by someone else.
    if (c?.claimed_by) {
      return NextResponse.json({
        claimed: false,
        reason: "taken",
        message: `Already claimed by ${ngoName(c.ngos) ?? "another NGO"}. Thank you!`,
      });
    }

    // Nobody holds it — the case is just in a state that can't be claimed.
    return NextResponse.json({
      claimed: false,
      reason: "not_claimable",
      message:
        c?.status === "closed" || c?.status === "unresolved"
          ? "This case is already closed."
          : "This case can't be claimed right now. Please refresh, or contact the Pawsure team.",
    });
  }

  const { data: c } = await supabase
    .from("cases")
    .select("reporter_phone, ngos:claimed_by(name)")
    .eq("id", case_id)
    .single();

  if (c?.reporter_phone) {
    try {
      await notifyReporter(c.reporter_phone, {
        caseId: case_id,
        ngoName: ngoName(c.ngos) ?? "A rescue NGO",
      });
    } catch (e) {
      console.error("reporter notify failed", e); // never fail the claim over WhatsApp
    }
  }

  return NextResponse.json({ claimed: true });
}