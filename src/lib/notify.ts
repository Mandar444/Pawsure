// WhatsApp via Meta's Cloud API (direct).
// Templates (UTILITY, language "en"):
//   "ngo_case_alert"  — IMAGE header + body vars: {{1}} location link, {{2}} notes
//   "reporter_update" — body vars: {{1}} ngo name, {{2}} status link

const GRAPH = "https://graph.facebook.com/v20.0";
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pawsuree.com";

async function sendTemplate(
  to: string,
  template: string,
  bodyParams: string[],
  headerImageUrl?: string
) {
  const components: object[] = [];
  if (headerImageUrl) {
    components.push({
      type: "header",
      parameters: [{ type: "image", image: { link: headerImageUrl } }],
    });
  }
  components.push({
    type: "body",
    parameters: bodyParams.map((text) => ({ type: "text", text })),
  });

  const res = await fetch(
    `${GRAPH}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: to.replace(/^\+/, ""),
        type: "template",
        template: {
          name: template,
          language: { code: "en" },
          components,
        },
      }),
    }
  );
  if (!res.ok) throw new Error(`WhatsApp ${res.status}: ${await res.text()}`);
}

export async function notifyNgo(
  phone: string,
  c: { caseId: string; ngoId: string; photoUrl: string; lat: number; lng: number; notes: string }
) {
  const mapsLink = `https://maps.google.com/?q=${c.lat},${c.lng}`;
  // Template: IMAGE header (the animal photo) + 2 body vars (location, details)
  await sendTemplate(
    phone,
    "ngo_case_alert",
    [mapsLink, c.notes || "No details given"],
    c.photoUrl
  );
}

export async function notifyReportReceived(phone: string, c: { caseId: string }) {
  await sendTemplate(phone, "report_received", [`${SITE}/case/${c.caseId}`]);
}


export async function notifyReporter(phone: string, c: { caseId: string; ngoName: string }) {
  await sendTemplate(phone, "reporter_update", [c.ngoName, `${SITE}/case/${c.caseId}`]);
}

// Zero NGOs matched → ping the Pawsure team. Uses the same IMAGE-header template,
// so it needs an image too — pass the case photo through.
export async function notifyTeamFallback(
  caseId: string,
  lat: number,
  lng: number,
  photoUrl: string
) {
  const teamPhone = process.env.PAWSURE_TEAM_WHATSAPP;
  if (!teamPhone) return;
  const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;
  await sendTemplate(
    teamPhone,
    "ngo_case_alert",
    [mapsLink, "NO NGO IN RANGE - manual handling"],
    photoUrl
  );
}