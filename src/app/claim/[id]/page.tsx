"use client";
// NGO case console — /claim/[caseId]?ngo=NGO_ID
// Three views, driven by viewer_role from the API:
//   owner    → full detail + reporter phone + update form
//   observer → detail + live updates, read-only, no phone
//   claimable→ detail + claim button
import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Update = { message: string; photo_url: string | null; created_at: string; by: string };

type CaseData = {
  id: string;
  case_code: string | null;
  photo_url: string;
  animal_type: string | null;
  condition_notes: string | null;
  conditions?: string[];
  mobility?: string | null;
  approach?: string | null;
  severity?: number;
  reporter_phone?: string | null;
  created_at?: string;
  status: string;
  claimed_by: string | null;
  ngo_name: string | null;
  viewer_role: "owner" | "observer" | "public";
  updates: Update[];
};

const STAGES = [
  { value: "on_the_way", label: "\ud83d\ude97 On the way to pickup" },
  { value: "picked_up", label: "\ud83d\ude91 Picked up" },
  { value: "at_facility", label: "\ud83c\udfe5 At clinic / shelter" },
  { value: "treated", label: "\ud83d\udc8a Under treatment" },
  { value: "recovering", label: "\ud83e\ude79 Recovering" },
  { value: "ready", label: "\ud83c\udfe1 Ready for adoption / release" },
  { value: "closed", label: "\u2705 Rescued & closed" },
  { value: "unresolved", label: "\u26a0\ufe0f Couldn't locate the animal" },
] as const;

const STAGE_LABEL: Record<string, string> = Object.fromEntries(
  STAGES.map((s) => [s.value, s.label])
);

const SEVERITY = {
  1: { label: "Emergency", cls: "bg-[#fef2f2] text-[#dc2626]" },
  2: { label: "Needs help", cls: "bg-[#fff7ed] text-[#ea580c]" },
  3: { label: "Stable", cls: "bg-[#f0fdf4] text-[#16a34a]" },
} as const;

export default function ClaimPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const ngoId = useSearchParams().get("ngo") ?? "";
  const [data, setData] = useState<CaseData | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [claimResult, setClaimResult] = useState<{ claimed: boolean; message?: string } | null>(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);

  const load = async () => {
    const res = await fetch(`/api/case/${id}${ngoId ? `?ngo=${ngoId}` : ""}`);
    if (res.ok) setData(await res.json());
  };
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [id, ngoId]);

  // Observers poll so they see the owner's progress live.
  useEffect(() => {
    if (data?.viewer_role !== "observer") return;
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [data?.viewer_role, id, ngoId]);

console.log("CLAIM DATA:", JSON.stringify(data, null, 2));

  const isOwner = data?.viewer_role === "owner";
  const isOpen = data?.status === "notified" || data?.status === "reported";
  const canClaim = !!data && !data.claimed_by && isOpen && !!ngoId;
  const isObserver = !!data && !!data.claimed_by && !isOwner;

  async function claim() {
    setClaiming(true);
    const res = await fetch("/api/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ case_id: id, ngo_id: ngoId }),
    });
    const result = await res.json();
    setClaimResult(result);
    setClaiming(false);
    load();
  }

  async function postUpdate() {
    if (!message.trim() && !status) return;
    setPosting(true);
    const form = new FormData();
    form.append("case_id", id);
    form.append("ngo_id", ngoId);
    form.append("message", message.trim() || STAGE_LABEL[status] || "");
    if (status) form.append("status", status);
    if (photo) form.append("photo", photo);
    const res = await fetch("/api/update", { method: "POST", body: form });
    setPosting(false);
    if (res.ok) {
      setPosted(true);
      setMessage(""); setStatus(""); setPhoto(null);
      // Brief confirmation, then back to the queue — the NGO's next case matters
      // more than re-reading the one they just updated.
      setTimeout(() => {
        router.push("/ngo");
        router.refresh();
      }, 1200);
    }
  }

  if (!data) return <main className="min-h-screen bg-[#fafaf9] flex items-center justify-center text-[#0a0a0a]/40">Loading case…</main>;

  const sev = data.severity ? SEVERITY[data.severity as 1 | 2 | 3] : null;
  const reportedAt = data.created_at
    ? new Date(data.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })
    : null;

  return (
    <main className="min-h-screen bg-[#fafaf9] py-10 px-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/ngo"
            aria-label="Back to dashboard"
            className="shrink-0 w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-[#0a0a0a]/60 hover:text-[#ed176a] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <p className="font-['Space_Grotesk',sans-serif] font-bold text-[#ed176a]">Pawsure Watch · NGO Console</p>
        </div>

        {/* Observer banner — sets expectations before they scroll */}
        {isObserver && (
          <div className="bg-[#0a0a0a] text-white rounded-2xl px-5 py-4 mb-4">
            <p className="font-semibold text-sm">{data.ngo_name ?? "Another NGO"} is handling this rescue</p>
            <p className="text-xs text-white/60 mt-1">
              You&apos;re watching read-only. Reporter contact stays with the responding team.
            </p>
          </div>
        )}

        <div className="bg-white rounded-3xl overflow-hidden shadow-sm mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.photo_url} alt="Reported animal" className="w-full h-64 object-cover" />
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <h1 className="font-['Space_Grotesk',sans-serif] text-xl font-bold capitalize">
                {data.animal_type ?? "Animal"} needs help
              </h1>
              {sev && <span className={`shrink-0 text-xs font-medium px-3 py-1 rounded-full ${sev.cls}`}>{sev.label}</span>}
            </div>

            {data.conditions && data.conditions.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#0a0a0a]/40 uppercase tracking-wide mb-2">Condition</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.conditions.map((c) => (
                    <span key={c} className="text-xs bg-[#fff0eb] text-[#0a0a0a]/80 px-2.5 py-1 rounded-full font-medium">{c}</span>
                  ))}
                </div>
              </div>
            )}

            {(data.mobility || data.approach) && (
              <div className="grid grid-cols-2 gap-3">
                {data.mobility && (
                  <div>
                    <p className="text-xs font-semibold text-[#0a0a0a]/40 uppercase tracking-wide mb-1">Movement</p>
                    <p className="text-sm">{data.mobility}</p>
                  </div>
                )}
                {data.approach && (
                  <div>
                    <p className="text-xs font-semibold text-[#0a0a0a]/40 uppercase tracking-wide mb-1">Approach</p>
                    <p className="text-sm">{data.approach}</p>
                  </div>
                )}
              </div>
            )}

            {data.condition_notes && (
              <div>
                <p className="text-xs font-semibold text-[#0a0a0a]/40 uppercase tracking-wide mb-1">Reporter&apos;s note</p>
                <p className="text-sm text-[#0a0a0a]/70">&ldquo;{data.condition_notes}&rdquo;</p>
              </div>
            )}

            <div className="pt-3 border-t border-[#0a0a0a]/5 space-y-1.5">
              {/* Phone renders only when the API sent one — i.e. owner only */}
              {data.reporter_phone && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#0a0a0a]/40">Reporter</span>
                  <a href={`tel:${data.reporter_phone}`} className="text-sm font-medium text-[#ed176a]">{data.reporter_phone}</a>
                </div>
              )}
              {isObserver && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#0a0a0a]/40">Responding</span>
                  <span className="text-sm text-[#0a0a0a]/60">{data.ngo_name ?? "Another NGO"}</span>
                </div>
              )}
              {reportedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#0a0a0a]/40">Reported</span>
                  <span className="text-sm text-[#0a0a0a]/60">{reportedAt}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#0a0a0a]/40">Case ID</span>
                <span className="text-sm font-mono text-[#0a0a0a]/60">{data.case_code ?? (data.id ? `#${data.id.slice(0, 8)}` : "—")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#0a0a0a]/40">Status</span>
                <span className="text-sm text-[#0a0a0a]/60">{STAGE_LABEL[data.status] ?? data.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Claim — only when genuinely unclaimed */}
        {canClaim && !claimResult && (
          <button
            onClick={claim}
            disabled={claiming}
            className="w-full py-4 bg-[#ed176a] hover:bg-[#d1145d] text-white font-semibold rounded-full transition-colors disabled:opacity-60"
          >
            {claiming ? "Claiming…" : "Claim this rescue"}
          </button>
        )}

        {claimResult && !claimResult.claimed && (
          <p className="text-center bg-[#fff0eb] rounded-2xl px-5 py-4 text-[#0a0a0a]/70">{claimResult.message}</p>
        )}

        {/* Timeline — everyone with a link sees progress */}
        {data.updates.length > 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
            <h2 className="font-['Space_Grotesk',sans-serif] font-bold mb-4">Rescue progress</h2>
            <div className="space-y-4">
              {data.updates.map((u, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-[#ed176a] mt-1.5 shrink-0" />
                    {i < data.updates.length - 1 && <div className="w-px flex-1 bg-[#0a0a0a]/10 my-1" />}
                  </div>
                  <div className="pb-1">
                    <p className="text-sm">{u.message}</p>
                    {u.photo_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={u.photo_url} alt="" className="mt-2 rounded-xl w-32 h-32 object-cover" />
                    )}
                    <p className="text-xs text-[#0a0a0a]/40 mt-1">
                      {u.by} ·{" "}
                      {new Date(u.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Offer backup — gives the observer something to do besides watch */}
        {isObserver && isOpenStage(data.status) && (
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `Pawsure case ${data.case_code ?? data.id.slice(0, 8)} — we're nearby and can send backup if you need it.`
            )}`}
            className="block text-center w-full py-3.5 border border-[#0a0a0a]/15 hover:border-[#0a0a0a]/40 font-semibold rounded-full transition-colors"
          >
            Offer backup
          </a>
        )}

        {/* Update form — owner only */}
        {isOwner && (
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <h2 className="font-['Space_Grotesk',sans-serif] font-bold">Post an update</h2>
              <p className="text-xs text-[#0a0a0a]/40 mt-0.5">The reporter sees this instantly + gets a WhatsApp.</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#0a0a0a]/40 uppercase tracking-wide mb-2">Stage</p>
              <div className="flex flex-col gap-2">
                {STAGES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStatus(status === s.value ? "" : s.value)}
                    className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      status === s.value ? "bg-[#0a0a0a] text-white" : "bg-[#fafaf9] border border-[#0a0a0a]/10 hover:border-[#0a0a0a]/30"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#0a0a0a]/40 uppercase tracking-wide mb-2">Add a note <span className="normal-case font-normal">(optional)</span></p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Reached the spot, dog has a leg injury, taking to our clinic…"
                className="w-full rounded-2xl border border-[#0a0a0a]/10 px-4 py-3 text-sm focus:outline-none focus:border-[#ed176a] resize-none"
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-[#0a0a0a]/40 uppercase tracking-wide mb-2">Add a photo <span className="normal-case font-normal">(optional)</span></p>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                className="text-sm text-[#0a0a0a]/60"
              />
            </div>

            <button
              onClick={postUpdate}
              disabled={posting || (!message.trim() && !status)}
              className="w-full py-3.5 bg-[#ed176a] hover:bg-[#d1145d] text-white font-semibold rounded-full transition-colors disabled:opacity-60"
            >
              {posting ? "Posting…" : posted ? "Sent ✓ — back to dashboard…" : "Send update"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

// Backup is only useful before the animal is off the street.
function isOpenStage(s: string) {
  return ["claimed", "on_the_way", "picked_up"].includes(s);
}