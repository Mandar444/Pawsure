"use client";
// Public rescue status page — the link reporters get on WhatsApp.
// Polls every 20s so updates appear without refreshing.
import { use, useEffect, useState } from "react";
import Nav from "@/components/v2/Nav";
import { Footer } from "@/components/v2/Sections";

type Update = { message: string; photo_url: string | null; created_at: string; by: string };
type CaseData = {
  photo_url: string;
  animal_type: string | null;
  status: string;
  created_at: string;
  ngo_name: string | null;
  updates: Update[];
};

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
reported: { label: "Waiting for an NGO to pick up", cls: "bg-[#fff0eb] text-[#0a0a0a]" },
  notified: { label: "Waiting for an NGO to pick up", cls: "bg-[#fff0eb] text-[#0a0a0a]" },
  claimed: { label: "Help is on the way", cls: "bg-[#fff0eb] text-[#0a0a0a]" },
  on_the_way: { label: "Rescuer on the way", cls: "bg-[#fff0eb] text-[#0a0a0a]" },
  picked_up: { label: "Picked up", cls: "bg-[#fff0eb] text-[#0a0a0a]" },
  at_facility: { label: "At clinic / shelter", cls: "bg-[#fff0eb] text-[#0a0a0a]" },
  treated: { label: "Under treatment", cls: "bg-[#fff0eb] text-[#0a0a0a]" },
  recovering: { label: "Recovering", cls: "bg-[#fff0eb] text-[#0a0a0a]" },
  ready: { label: "Ready for adoption / release", cls: "bg-[#fff0eb] text-[#0a0a0a]" },
  closed: { label: "Rescued! YAY!", cls: "bg-[#fff0eb] text-[#0a0a0a]" },
  unresolved: { label: "Unresolved", cls: "bg-[#fafaf9] text-[#0a0a0a]/60" },
};

export default function CasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<CaseData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const res = await fetch(`/api/case/${id}`);
      if (!alive) return;
      if (!res.ok) return setNotFound(true);
      setData(await res.json());
    };
    load();
    const t = setInterval(load, 20000);
    return () => { alive = false; clearInterval(t); };
  }, [id]);

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#fafaf9] pt-28 pb-24 px-6">
        <div className="max-w-xl mx-auto">
          {notFound && (
            <p className="text-center text-[#0a0a0a]/50">Case not found. Check the link from your WhatsApp message.</p>
          )}
          {!data && !notFound && <p className="text-center text-[#0a0a0a]/40">Loading rescue status…</p>}
          {data && (
            <>
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.photo_url} alt="Reported animal" className="w-full h-64 object-cover" />
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <h1 className="font-['Space_Grotesk',sans-serif] text-2xl font-bold capitalize">
                      {data.animal_type ?? "Animal"} rescue
                    </h1>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${STATUS_LABEL[data.status]?.cls ?? "bg-[#fafaf9]"}`}>
                      {STATUS_LABEL[data.status]?.label ?? data.status}
                    </span>
                  </div>
                  {data.ngo_name && (
                    <p className="text-[#0a0a0a]/60 text-sm mt-2">Handled by {data.ngo_name}</p>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-0">
                <TimelineItem
                  by="You"
                  message="Case reported"
                  time={data.created_at}
                  first
                />
                {data.updates.map((u, i) => (
                  <TimelineItem
                    key={i}
                    by={u.by}
                    message={u.message}
                    photo={u.photo_url}
                    time={u.created_at}
                    last={i === data.updates.length - 1}
                  />
                ))}
              </div>
              <p className="text-center text-[#0a0a0a]/40 text-xs mt-10">
                This page updates automatically. You'll also get every update on WhatsApp.
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function TimelineItem({ by, message, photo, time, first, last }: {
  by: string; message: string; photo?: string | null; time: string; first?: boolean; last?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full mt-1.5 ${first ? "bg-[#ed176a]" : "bg-[#ed176a]/35"}`} />
        {!last && <div className="w-px flex-1 bg-[#0a0a0a]/10" />}
      </div>
      <div className="pb-8 flex-1">
        <p className="text-xs text-[#0a0a0a]/40 mb-1">
          {by} · {new Date(time).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
        </p>
        <p className="text-[#0a0a0a]/80">{message}</p>
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="Update photo" className="mt-3 rounded-2xl max-h-56 object-cover" />
        )}
      </div>
    </div>
  );
}