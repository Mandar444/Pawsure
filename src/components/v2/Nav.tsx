"use client";

import Link from "next/link";
import { useState } from "react";
import { Paw } from "./Art";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-4 sm:top-5 inset-x-0 z-50 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <nav className="bg-white/95 backdrop-blur-md border-2 border-[#0a0a0a] shadow-[4px_4px_0px_#0a0a0a] rounded-full px-5 sm:px-8 py-3 flex items-center justify-between transition-all">
          {/* Logo with playful tiny paw */}
          <Link
            href="/"
            className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-xl sm:text-2xl tracking-tight text-[#0a0a0a] flex items-center gap-1 hover:opacity-90 transition-opacity"
          >
            <span>paw</span>
            <span className="text-[#ed176a]">sure</span>
            <Paw className="w-4 h-4 text-[#ed176a] inline ml-0.5" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-7 font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm text-[#0a0a0a]">
            <Link href="/#how-watch-works" className="hover:text-[#ed176a] transition-colors">
              How it works
            </Link>
            <Link href="/#ngos" className="hover:text-[#ed176a] transition-colors">
              For NGOs
            </Link>
            <Link href="/#community" className="hover:text-[#ed176a] transition-colors">
              Community
            </Link>
          </div>

          {/* Desktop Primary Action */}
          <div className="hidden md:flex items-center">
            <Link
              href="/watch"
              className="bg-[#ed176a] hover:bg-[#d1145d] text-white font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full border-2 border-[#0a0a0a] shadow-[2px_2px_0px_#0a0a0a] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Report a Dog</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="md:hidden relative z-10 w-10 h-10 flex items-center justify-center text-[#0a0a0a] hover:text-[#ed176a] transition-colors"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden absolute top-full mt-3 inset-x-4 bg-white border-2 border-[#0a0a0a] shadow-[6px_6px_0px_#0a0a0a] rounded-3xl p-6 flex flex-col gap-4 font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base text-[#0a0a0a] animate-in fade-in duration-200">
            <Link
              href="/#how-watch-works"
              onClick={() => setOpen(false)}
              className="hover:text-[#ed176a] py-1 transition-colors"
            >
              How it works
            </Link>
            <Link
              href="/#ngos"
              onClick={() => setOpen(false)}
              className="hover:text-[#ed176a] py-1 transition-colors"
            >
              For NGOs
            </Link>
            <Link
              href="/#community"
              onClick={() => setOpen(false)}
              className="hover:text-[#ed176a] py-1 transition-colors"
            >
              Community
            </Link>
            <Link
              href="/watch"
              onClick={() => setOpen(false)}
              className="mt-2 bg-[#ed176a] text-white text-center font-bold text-sm uppercase tracking-wider py-3.5 rounded-2xl border-2 border-[#0a0a0a] shadow-[3px_3px_0px_#0a0a0a]"
            >
              Report a Dog
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}