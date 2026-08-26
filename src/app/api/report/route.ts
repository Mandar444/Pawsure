// POST /api/report
// Receives multipart form-data from WatchForm: photo, lat, lng, phone, animal_type, notes
// → uploads photo → inserts case → matches NGOs within 3km → alerts each on WhatsApp
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
//import { notifyNgo, notifyTeamFallback } from "@/lib/notify";
import { notifyNgo, notifyTeamFallback, notifyReportReceived } from "@/lib/notify";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  // 1. Read the multipart form (NOT req.json — the form sends form-data with a file)
  const form = await req.formData();
  const photo = form.get("photo") as File | null;
  const lat = parseFloat(form.get("lat") as string);
  const lng = parseFloat(form.get("lng") as string);
  const phone = (form.get("phone") as string || "").trim();
  const animalType = (form.get("animal_type") as string) || null;
  const notes = (form.get("notes") as string) || null;
  const severity = parseInt((form.get("severity") as string) || "2", 10);
  let conditions: string[] = [];
  try { conditions = JSON.parse((form.get("conditions") as string) || "[]"); } catch { conditions = []; }
  const mobility = (form.get("mobility") as string) || null;
  const approach = (form.get("approach") as string) || null;

  // 2. Validate
  if (!photo || Number.isNaN(lat) || Number.isNaN(lng) || !phone) {
    return NextResponse.json({ error: "Missing photo, location, or phone." }, { status: 400 });
  }

  // 3. Upload photo to Supabase Storage (bucket: case-photos, must be public)
  const ext = photo.name.split(".").pop() || "jpg";
  const path = `cases/${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("case-photos")
    .upload(path, photo, { contentType: photo.type, upsert: false });
  if (upErr) {
    return NextResponse.json({ error: "Photo upload failed: " + upErr.message }, { status: 500 });
  }
  const photoUrl = supabase.storage.from("case-photos").getPublicUrl(path).data.publicUrl;

  // 4. Insert the case (PostGIS point = POINT(lng lat))
  const { data: caseRow, error: insErr } = await supabase
    .from("cases")
    .insert({
      reporter_phone: phone,
      photo_url: photoUrl,
      location: `SRID=4326;POINT(${lng} ${lat})`,
      animal_type: animalType,
      condition_notes: notes,
      severity: [1,2,3].includes(severity) ? severity : 2,
      conditions,
      mobility,
      approach,
      status: "reported",
    })
    .select("id, case_code")
    .single();
  if (insErr || !caseRow) {
    return NextResponse.json({ error: "Could not save case: " + insErr?.message }, { status: 500 });
  }
  const caseId = caseRow.id as string;
  const caseCode = caseRow.case_code as string;

  // 5. Match NGOs within 3km
  const { data: ngos, error: matchErr } = await supabase.rpc("match_ngos", {
    p_case_lat: lat,
    p_case_lng: lng,
    p_radius_km: 3,
  });
  if (matchErr) {
    return NextResponse.json({ error: "Matching failed: " + matchErr.message }, { status: 500 });
  }

  // 6. No NGO in range → alert the Pawsure team, still return success
if (!ngos || ngos.length === 0) {
    try { await notifyTeamFallback(caseId, lat, lng, photoUrl); } catch (e) { console.error("team fallback failed", e); }
    try { await notifyReportReceived(phone, { caseId }); } catch (e) { console.error("reporter confirmation failed", e); }
    return NextResponse.json({ id: caseId, code: caseCode, ngos_notified: 0 });
  }

  // 7. Alert each matched NGO on WhatsApp + log the notification
  let notified = 0;
  for (const ngo of ngos as { id: string; name: string; whatsapp_number: string }[]) {
    try {
      await notifyNgo(ngo.whatsapp_number, {
        caseId,
        ngoId: ngo.id,
        photoUrl,
        lat,
        lng,
        notes: notes || "",
      });
      await supabase.from("case_notifications").insert({ case_id: caseId, ngo_id: ngo.id });
      notified++;
    } catch (e) {
      console.error("notify NGO failed:", ngo.name, e);
    }
  }

  // 8. Mark the case as notified (only if someone actually got pinged)
  if (notified > 0) {
    const { error: stErr } = await supabase
      .from("cases")
      .update({ status: "notified" })
      .eq("id", caseId);
    if (stErr) console.error("status update failed", stErr);
  }

  // 9. Confirm to the reporter that their report was received
  try {
    await notifyReportReceived(phone, { caseId });
  } catch (e) {
    console.error("reporter confirmation failed", e);
  }

  return NextResponse.json({ id: caseId, code: caseCode, ngos_notified: notified });
}