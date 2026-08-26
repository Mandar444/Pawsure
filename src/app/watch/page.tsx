import type { Metadata } from "next";
import Link from "next/link";
import { Paw } from "@/components/v2/Art";
import WatchForm from "./WatchForm";

export const metadata: Metadata = {
  title: "Emergency Rescue Report | Pawsure Watch",
  description:
    "Report an injured street dog in seconds. Verified rescue NGOs in Mumbai get pinged on WhatsApp instantly.",
};

export default function WatchPage() {
  return (
    <div className="min-h-screen bg-[#FFF7F3] text-[#0a0a0a] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col justify-between selection:bg-[#ed176a] selection:text-white">
      {/* Minimal Header — No full navigation */}
      <header className="sticky top-0 z-40 bg-[#FFF7F3]/90 backdrop-blur-md border-b-2 border-[#0a0a0a] px-5 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-extrabold text-xl tracking-tight text-[#0a0a0a] flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <span>paw</span>
            <span className="text-[#ed176a]">sure</span>
            <Paw className="w-4 h-4 text-[#ed176a] inline" />
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block bg-[#ed176a]/10 text-[#ed176a] text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-[#ed176a]/20">
              Emergency report
            </span>
            <Link
              href="/"
              className="w-9 h-9 rounded-full bg-white border-2 border-[#0a0a0a] shadow-[2px_2px_0px_#0a0a0a] flex items-center justify-center font-bold text-sm text-[#0a0a0a] hover:bg-neutral-100 active:scale-95 transition-all"
              aria-label="Exit rescue report"
            >
              ✕
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container — Optimized max-width 600px for stress-free 30s flow */}
      <main className="flex-1 w-full max-w-[620px] mx-auto px-4 sm:px-6 pt-6 pb-20 sm:pb-24">
        <WatchForm />
      </main>

      {/* Reassuring Footer */}
      <footer className="py-6 border-t border-[#0a0a0a]/10 text-center text-xs text-[#0a0a0a]/50 font-semibold px-4">
        <p>Pawsure Watch &bull; Verified Street Dog Rescue Network &bull; Mumbai</p>
      </footer>
    </div>
  );
}