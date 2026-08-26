"use client";
// /ngo — NGO dashboard. One query, no per-card fetching.
// Cards carry a severity stripe, age, and the latest update line so an NGO can
// triage the whole list without opening anything.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Case = {
  id: string;
  case_code: string | null;
  photo_url: string;
  animal_type: string | null;
  condition_notes: string | null;
  severity: number;
  status: string;
  reporter_phone: string | null;
  distance_m: number;
  created_at: string;
  claimed_at: string | null;
  is_mine: boolean;
  claimed_by: string | null;
  claimed_by_name: string | null;
  conditions: string[];
  mobility: string | null;
  approach: string | null;
  last_update: string | null;
  last_update_at: string | null;
  update_count: number;
};

const SEVERITY = {
  1: { label: "Emergency", stripe: "bg-[#dc2626]", chip: "bg-[#fef2f2] text-[#dc2626]" },
  2: { label: "Needs help", stripe: "bg-[#ea580c]", chip: "bg-[#fff7ed] text-[#ea580c]" },
  3: { label: "Stable", stripe: "bg-[#16a34a]", chip: "bg-[#f0fdf4] text-[#16a34a]" },
} as const;

const STATUS_LABEL: Record<string, string> = {
  reported: "New", notified: "New", claimed: "Claimed",
  on_the_way: "On the way", picked_up: "Picked up", at_facility: "At clinic",
  treated: "In treatment", recovering: "Recovering", ready: "Ready",
  closed: "Rescued", unresolved: "Unresolved",
};

const DONE = new Set(["closed", "ready"]);

// Relative age for the update line — "27m ago", "3d ago".
function ago(iso: string | null): string {
  if (!iso) return "";
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// Absolute date for the header — relative time alone loses the calendar.
// dd/mm/yyyy, zero-padded, so the column stays the same width on every row.
function shortDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export default function NgoDashboard() {
  const router = useRouter();
  const [ngo, setNgo] = useState<{ id: string; name: string } | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDone, setShowDone] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("pawsure_ngo");
    if (!raw) { router.push("/ngo/login"); return; }
    const parsed = JSON.parse(raw);
    setNgo(parsed);
    const load = async () => {
      const res = await fetch(`/api/ngo/dashboard?ngo=${parsed.id}`);
      const data = await res.json();
      setCases(data.cases ?? []);
      setLoading(false);
    };
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, [router]);

  function logout() {
    localStorage.removeItem("pawsure_ngo");
    router.push("/ngo/login");
  }

  const open = cases.filter((c) => !c.claimed_by && (c.status === "reported" || c.status === "notified"));
  const mine = cases.filter((c) => c.is_mine && !DONE.has(c.status));
  const done = cases.filter((c) => c.is_mine && DONE.has(c.status));
  const others = cases.filter((c) => c.claimed_by && !c.is_mine);
  const urgent = open.filter((c) => c.severity === 1).length;

  return (
    <main className="min-h-screen bg-[#fafaf9] px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="font-['Space_Grotesk',sans-serif] font-bold text-[#ed176a] text-sm">Pawsure Watch</p>
            <h1 className="font-['Space_Grotesk',sans-serif] text-xl font-bold">{ngo?.name ?? "NGO"}</h1>
          </div>
          <button onClick={logout} className="text-sm text-[#0a0a0a]/40 hover:text-[#0a0a0a] transition-colors">
            Log out
          </button>
        </div>

        {/* Three numbers that answer "where do I stand" without scrolling */}
        {!loading && (
          <div className="grid grid-cols-3 gap-2 mb-7">
            <Stat n={open.length} label="waiting" accent={urgent > 0} sub={urgent > 0 ? `${urgent} urgent` : undefined} />
            <Stat n={mine.length} label="in progress" />
            <Stat n={done.length} label="rescued" green />
          </div>
        )}

        {loading && (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-[#0a0a0a]/[0.04] animate-pulse" />
            ))}
          </div>
        )}

        {!loading && (
          <>
            <SectionTitle count={open.length}>New cases near you</SectionTitle>
            {open.length === 0 ? (
              <Empty>Nothing waiting. You&apos;re all caught up.</Empty>
            ) : (
              open.map((c) => <CaseCard key={c.id} c={c} ngoId={ngo!.id} />)
            )}

            {mine.length > 0 && (
              <>
                <SectionTitle count={mine.length}>Cases you&apos;re handling</SectionTitle>
                {mine.map((c) => <CaseCard key={c.id} c={c} ngoId={ngo!.id} />)}
              </>
            )}

            {others.length > 0 && (
              <>
                <SectionTitle count={others.length}>Being handled nearby</SectionTitle>
                {others.map((c) => <CaseCard key={c.id} c={c} ngoId={ngo!.id} muted />)}
              </>
            )}

            {done.length > 0 && (
              <>
                <button
                  onClick={() => setShowDone((v) => !v)}
                  className="w-full flex items-center justify-between mt-8 mb-3 group"
                >
                  <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-sm text-[#0a0a0a]/60 uppercase tracking-wide">
                    Rescued <span className="text-[#0a0a0a]/30">({done.length})</span>
                  </h2>
                  <span className="text-xs text-[#0a0a0a]/40 group-hover:text-[#0a0a0a]/70 transition-colors">
                    {showDone ? "Hide" : "Show"}
                  </span>
                </button>
                {showDone && done.slice(0, 20).map((c) => <CaseCard key={c.id} c={c} ngoId={ngo!.id} />)}
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function Stat({ n, label, sub, accent, green }: {
  n: number; label: string; sub?: string; accent?: boolean; green?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl px-4 py-3 ${green ? "bg-[#f0fdf4]" : "bg-white"} shadow-sm`}>
      {green && <Paw className="absolute -right-2 -bottom-2 w-12 h-12 text-green-600/[0.09] rotate-12" />}
      <p className={`font-['Space_Grotesk',sans-serif] text-2xl font-bold leading-none ${
        accent ? "text-[#ed176a]" : green ? "text-[#16a34a]" : "text-[#0a0a0a]"
      }`}>
        {n}
      </p>
      <p className="text-xs text-[#0a0a0a]/45 mt-1">{label}</p>
      {sub && <p className="text-[11px] text-[#ed176a] font-medium mt-0.5">{sub}</p>}
    </div>
  );
}

function SectionTitle({ children, count }: { children: React.ReactNode; count: number }) {
  return (
    <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-sm text-[#0a0a0a]/60 uppercase tracking-wide mt-8 mb-3">
      {children} <span className="text-[#0a0a0a]/30">({count})</span>
    </h2>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
      <Paw className="w-8 h-8 mx-auto mb-3 text-[#ed176a]/25" />
      <p className="text-[#0a0a0a]/40 text-sm">{children}</p>
    </div>
  );
}

// Single reusable paw. One path, no library, no runtime cost.
function Paw({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <ellipse cx="7.5" cy="8" rx="2.1" ry="2.8" />
      <ellipse cx="12" cy="6.4" rx="2.1" ry="2.9" />
      <ellipse cx="16.5" cy="8" rx="2.1" ry="2.8" />
      <ellipse cx="19.4" cy="12.4" rx="1.9" ry="2.3" />
      <path d="M12 11.4c2.9 0 5.4 2.2 5.4 4.7 0 2-1.6 3.1-3.5 3.1-1 0-1.4-.3-1.9-.3s-.9.3-1.9.3c-1.9 0-3.5-1.1-3.5-3.1 0-2.5 2.5-4.7 5.4-4.7z" />
    </svg>
  );
}

function CaseCard({ c, ngoId, muted }: { c: Case; ngoId: string; muted?: boolean }) {
  const sev = SEVERITY[c.severity as 1 | 2 | 3] ?? SEVERITY[2];
  const km = (c.distance_m / 1000).toFixed(1);
  const isDone = DONE.has(c.status);
  const isNew = !c.claimed_by;

  return (
    <Link
      href={`/claim/${c.id}?ngo=${ngoId}`}
      className={`group relative flex gap-3.5 rounded-2xl p-3.5 pl-4 mb-2.5 overflow-hidden shadow-sm
        hover:shadow-md hover:-translate-y-px transition-all duration-150
        ${isDone ? "bg-[#f0fdf4]" : "bg-white"} ${muted ? "opacity-[0.72] hover:opacity-100" : ""}`}
    >
      {/* Severity as a stripe, not another chip — colour without clutter */}
      <span className={`absolute left-0 top-0 bottom-0 w-1 ${isDone ? "bg-[#16a34a]" : sev.stripe}`} />

      <div className="relative shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.photo_url} alt="" loading="lazy" decoding="async"
             className="w-[68px] h-[68px] rounded-xl object-cover bg-[#0a0a0a]/5" />
        {isDone && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#16a34a] text-white text-[11px] flex items-center justify-center shadow">
            ✓
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            isDone ? "bg-[#f0fdf4] text-[#16a34a]" : sev.chip
          }`}>
            {isDone ? "Rescued" : sev.label}
          </span>
          {!isNew && !isDone && (
            <span className="text-[11px] text-[#0a0a0a]/45">{STATUS_LABEL[c.status] ?? c.status}</span>
          )}
          <span className="ml-auto text-[11px] text-[#0a0a0a]/40 tabular-nums whitespace-nowrap">
            {c.case_code && <span className="font-mono mr-2 text-[#0a0a0a]/30">{c.case_code}</span>}
            {shortDate(c.claimed_at ?? c.created_at)}
          </span>
        </div>

        <p className="font-semibold text-[15px] leading-snug">
          <span className="capitalize">{c.animal_type ?? "Animal"}</span>
          <span className="text-[#0a0a0a]/45 font-normal"> · {km} km</span>
        </p>

        {c.conditions?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {c.conditions.slice(0, 3).map((cond) => (
              <span key={cond} className="text-[11px] bg-[#0a0a0a]/[0.045] text-[#0a0a0a]/65 px-2 py-0.5 rounded-full">
                {cond}
              </span>
            ))}
            {c.conditions.length > 3 && (
              <span className="text-[11px] text-[#0a0a0a]/35 px-1 py-0.5">+{c.conditions.length - 3}</span>
            )}
          </div>
        )}

        {/* Latest update replaces the reporter's note once work starts —
            what's happening now beats what was first described. */}
        {c.last_update ? (
          <p className="text-[13px] text-[#0a0a0a]/55 mt-1.5 truncate">
            <span className="text-[#0a0a0a]/30">&#8627; </span>
            {c.last_update}
            <span className="text-[#0a0a0a]/30"> &middot; {ago(c.last_update_at)}</span>
          </p>
        ) : c.condition_notes ? (
          <p className="text-[13px] text-[#0a0a0a]/50 mt-1.5 truncate italic">
            &ldquo;{c.condition_notes}&rdquo;
            <span className="not-italic text-[#0a0a0a]/30"> &middot; {ago(c.created_at)}</span>
          </p>
        ) : (
          <p className="text-[13px] text-[#0a0a0a]/35 mt-1.5">No updates yet &middot; {ago(c.created_at)}</p>
        )}

        {c.claimed_by && !c.is_mine && (
          <p className="text-[11px] text-[#0a0a0a]/40 mt-1.5">Handled by {c.claimed_by_name ?? "another NGO"}</p>
        )}
      </div>

      {/* Chevron nudges right on hover — the only motion on the card */}
      <span className="self-center shrink-0 text-[#0a0a0a]/15 group-hover:text-[#ed176a] group-hover:translate-x-0.5 transition-all duration-150">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </span>
    </Link>
  );
}