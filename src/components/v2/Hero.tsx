"use client";

import Link from "next/link";
import { Paw } from "./Art";

export default function Hero() {
  return (
    <section className="relative bg-[#ed176a] text-white overflow-hidden pt-36 sm:pt-48 pb-24 lg:pt-56 lg:pb-36 min-h-[80vh] flex flex-col justify-center">
      {/* Background Radial Glow Layer */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl"
      />

      {/* ONE Translucent Paw Watermark in Hero Background */}
      <Paw
        aria-hidden
        className="hidden lg:block absolute -right-20 top-16 w-[540px] h-[540px] text-white/[0.08] rotate-12 pointer-events-none select-none"
      />

      <div className="relative max-w-[880px] mx-auto px-6 flex flex-col items-center text-center">
        {/* Main Poster Headline */}
        <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold tracking-tight text-white leading-[0.96] text-5xl sm:text-7xl lg:text-[84px] max-w-[850px]">
          See a hurt dog?
          <br />
          <span className="relative inline-block text-white">
            Get help nearby.
            {/* Hand-drawn Underline Arc */}
            <svg
              className="absolute -bottom-2 left-0 w-full h-4 text-pink-200 pointer-events-none overflow-visible"
              viewBox="0 0 100 16"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 2 10 Q 50 16 98 10"
                stroke="currentColor"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        {/* Small Emotional Subtext */}
        <p className="mt-8 font-['Plus_Jakarta_Sans',sans-serif] text-lg sm:text-xl lg:text-2xl text-white/95 max-w-xl leading-relaxed font-semibold">
          Send one photo &mdash; verified rescue NGOs within 3 km get pinged on WhatsApp instantly.
        </p>

        {/* CTA Group: Report a Dog is Obvious Primary, Secondary is Demoted */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link
            href="/watch"
            className="bg-[#0a0a0a] hover:bg-[#171717] text-white font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-lg sm:text-xl px-10 py-4.5 rounded-2xl border-2 border-[#0a0a0a] shadow-[6px_6px_0px_#ffffff] hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-3"
          >
            <span>Report a Dog</span>
          </Link>

          <a
            href="#how-watch-works"
            className="text-white/80 hover:text-white font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base underline underline-offset-4 decoration-white/40 hover:decoration-white transition-all py-2 px-4"
          >
            See how it works →
          </a>
        </div>
      </div>
    </section>
  );
}