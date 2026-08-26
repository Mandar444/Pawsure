// GET /api/case/[id] — single case detail for the claim page.
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";
  return createClient(url, key);
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ngoId = new URL(req.url).searchParams.get("ngo");
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("cases")
    .select("*, case_updates(*), ngos:claimed_by(name)")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("case fetch failed", error);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...data,
    updates: data.case_updates ?? [],
    viewer_role: ngoId && ngoId === data.claimed_by ? "owner" : "observer",
  });
}