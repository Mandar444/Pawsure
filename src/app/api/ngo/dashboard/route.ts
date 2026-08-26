// GET /api/ngo/dashboard?ngo=NGO_ID
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";
  return createClient(url, key);
};

export async function GET(req: NextRequest) {
  const ngoId = req.nextUrl.searchParams.get("ngo");
  if (!ngoId) return NextResponse.json({ error: "ngo required" }, { status: 400 });

  const supabase = getSupabase();
  const { data, error } = await supabase.rpc("ngo_dashboard", { p_ngo_id: ngoId });

  if (error) {
    // Postgres puts the useful part in details/hint — a bare message hides the cause.
    console.error("ngo_dashboard failed", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return NextResponse.json(
      { error: error.message, details: error.details, hint: error.hint, code: error.code },
      { status: 500 }
    );
  }

  return NextResponse.json({ cases: data ?? [] });
}