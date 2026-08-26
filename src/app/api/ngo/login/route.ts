// POST /api/ngo/login  — simple phone-gate login (no OTP yet, hardcoded-simple).
// Body: { phone }  → if a verified NGO has that whatsapp_number, return its id + name.
// The client stores ngo_id in localStorage as a lightweight "session".
// UPGRADE LATER: replace with real OTP (send code via WhatsApp, verify) or Supabase Auth.
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";
  return createClient(url, key);
};

function normalize(p: string) {
  const d = p.replace(/\D/g, "");        // digits only
  return d.length === 10 ? `+91${d}` : `+${d}`;  // assume India if 10 digits
}

export async function POST(req: NextRequest) {
  const { phone } = await req.json();
  if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });

  const supabase = getSupabase();
  const normalized = normalize(phone);

  const { data: ngo } = await supabase
    .from("ngos")
    .select("id, name, verified")
    .eq("whatsapp_number", normalized)
    .maybeSingle();

  if (!ngo) {
    return NextResponse.json(
      { error: "No NGO registered with this number. Contact Pawsure to get access." },
      { status: 404 }
    );
  }
  if (!ngo.verified) {
    return NextResponse.json({ error: "Your NGO account is pending verification." }, { status: 403 });
  }

  return NextResponse.json({ ngo_id: ngo.id, name: ngo.name });
}
