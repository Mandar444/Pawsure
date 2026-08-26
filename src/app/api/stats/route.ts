// GET /api/stats — public counts for the coverage band.
// Every number here is a real row count. Nothing is estimated or rounded up.
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 300;

const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";
  return createClient(url, key);
};

export async function GET() {
  const supabase = getSupabase();

  const [ngos, reports, rescued] = await Promise.all([
    supabase.from("ngos").select("id", { count: "exact", head: true }).eq("verified", true),
    supabase.from("cases").select("id", { count: "exact", head: true }),
    supabase.from("cases").select("id", { count: "exact", head: true }).in("status", ["closed", "ready"]),
  ]);

  return NextResponse.json({
    ngos: ngos.count ?? 0,
    reports: reports.count ?? 0,
    rescued: rescued.count ?? 0,
  });
}