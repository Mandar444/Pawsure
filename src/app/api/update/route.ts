// POST /api/update — NGO posts a rescue update.
// multipart/form-data: case_id, ngo_id, message, status? (picked_up|treated|closed), photo?
// Only the NGO that claimed the case can post. Reporter gets WhatsApp on each update.
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { notifyReporter } from "@/lib/notify";

function ngoName(n: unknown): string | null {
  if (!n) return null;
  const o = Array.isArray(n) ? n[0] : n;
  return (o as { name?: string })?.name ?? null;
}

const getSupabase = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const ALLOWED_STATUS = ["on_the_way", "picked_up", "at_facility", "treated", "recovering", "ready", "closed", "unresolved"] as const;

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const form = await req.formData();
  const case_id = form.get("case_id") as string;
  const ngo_id = form.get("ngo_id") as string;
  const message = ((form.get("message") as string) ?? "").trim();
  const status = form.get("status") as string | null;
  const photo = form.get("photo") as File | null;

  if (!case_id || !ngo_id || !message) {
    return NextResponse.json({ error: "case_id, ngo_id, message required" }, { status: 400 });
  }

  // Only the claiming NGO may update
  const { data: c } = await supabase
    .from("cases")
    .select("claimed_by, reporter_phone, ngos:claimed_by(name)")
    .eq("id", case_id)
    .single();
  if (!c) return NextResponse.json({ error: "case not found" }, { status: 404 });
  if (c.claimed_by !== ngo_id) {
    return NextResponse.json({ error: "only the claiming NGO can post updates" }, { status: 403 });
  }

  // Optional photo
  let photoUrl: string | null = null;
  if (photo && photo.size > 0) {
    const filename = `updates/${case_id}/${Date.now()}.jpg`;
    const { error } = await supabase.storage
      .from("case-photos")
      .upload(filename, photo, { contentType: photo.type });
    if (!error) {
      photoUrl = supabase.storage.from("case-photos").getPublicUrl(filename).data.publicUrl;
    }
  }

  await supabase.from("case_updates").insert({
    case_id,
    author_ngo: ngo_id,
    message,
    photo_url: photoUrl,
  });

  if (status && (ALLOWED_STATUS as readonly string[]).includes(status)) {
    await supabase.from("cases").update({ status }).eq("id", case_id);
  }

  // WhatsApp the reporter (best-effort — update still saves if this fails)
  try {
    await notifyReporter(c.reporter_phone, {
      caseId: case_id,
      ngoName: ngoName(c.ngos) ?? "The rescue team",
    });
  } catch (e) {
    console.error("reporter notify failed", e);
  }

  return NextResponse.json({ ok: true });
}
