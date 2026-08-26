"use client";

import Link from "next/link";
import Reveal from "./Reveal";
import { Paw, BoneDivider, FormMockup } from "./Art";

/* ── 1. The Problem Band (Left-aligned, Pop-Art Card) ── */
export function ProblemBand() {
  return (
    <section className="bg-[#fff0eb] py-20 lg:py-28 px-6 border-t-2 border-[#0a0a0a]">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          {/* Left-Aligned Layout */}
          <div className="max-w-3xl">
            <span className="inline-block bg-[#0a0a0a] text-white font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-xs uppercase tracking-wider px-4 py-1.5 rounded-lg border-2 border-[#0a0a0a] shadow-[3px_3px_0px_#ed176a] mb-6">
              The Stray Rescue Dilemma
            </span>

            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0a0a0a] leading-[1.05]">
              Most people <span className="text-[#ed176a]">want to help.</span>
              <br />
              <span className="text-[#0a0a0a]/60">They just don&apos;t know who to call.</span>
            </h2>
          </div>

          {/* Chunky Pop-Art Card */}
          <div className="mt-10 bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#0a0a0a] shadow-[6px_6px_0px_#0a0a0a] max-w-3xl relative hover:-translate-y-1 transition-transform">
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-lg sm:text-xl text-[#0a0a0a] font-bold leading-relaxed">
              So they post in a WhatsApp group. Someone shares a random number. It rings out.
              An hour passes... the animal moves, or doesn&apos;t.
            </p>

            <div className="mt-8 pt-6 border-t-2 border-[#0a0a0a]/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-[#ed176a] animate-ping" />
                <span className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[#0a0a0a] text-base">
                  Pawsure Watch fixes this with 1 photo.
                </span>
              </div>

              <span className="bg-[#ed176a] text-white text-xs font-extrabold px-4 py-2 rounded-xl border-2 border-[#0a0a0a] shadow-[2px_2px_0px_#0a0a0a]">
                14 MIN DISPATCH
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 2. How Watch Works (Rebuilt Horizontal 4-Step Flow) ── */
export function WatchBand() {
  const steps = [
    { num: "01", title: "Snap photo", desc: "Take one picture of the animal on your phone." },
    { num: "02", title: "Location shared", desc: "Auto-detect 3 km radius in Lokhandwala & Andheri." },
    { num: "03", title: "Rescue accepts", desc: "First verified NGO claims dispatch on WhatsApp." },
    { num: "04", title: "Track live", desc: "Follow responder route in real-time until safe." },
  ];

  return (
    <>
      <div className="bg-[#0a0a0a] pt-12 pb-4 flex justify-center text-[#ed176a]">
        <BoneDivider className="w-full max-w-md px-6 text-[#ed176a]" />
      </div>

      <section id="how-watch-works" className="bg-[#0a0a0a] text-white py-20 lg:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-[#ed176a] text-xs font-extrabold uppercase tracking-widest bg-[#ed176a]/15 px-4 py-2 rounded-full border border-[#ed176a]/30">
                Simple 4-Step Flow
              </span>
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-center mt-5">
                How Watch Works
              </h2>
            </div>
          </Reveal>

          {/* 4 Step Cards Grid - No dotted line, No scroll animation */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div
                key={s.num}
                className="bg-[#141414] rounded-3xl p-7 border-2 border-white/20 shadow-[6px_6px_0px_#ed176a] h-full flex flex-col justify-between hover:-translate-y-1.5 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="w-12 h-12 rounded-2xl bg-[#ed176a] text-white font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-xl flex items-center justify-center border-2 border-white shadow-[2px_2px_0px_#fff]">
                      {s.num}
                    </span>
                    <span className="font-mono text-xs font-extrabold text-[#ed176a] uppercase tracking-wider bg-[#ed176a]/15 px-3 py-1 rounded-lg">
                      STEP {s.num}
                    </span>
                  </div>

                  <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-extrabold mb-2.5 text-white group-hover:text-[#ff71a8] transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed font-medium">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Secondary Floating Phone Mockup & CTA */}
          <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-10">
            <FormMockup className="w-full max-w-[260px] drop-shadow-[0_20px_50px_rgba(237,23,106,0.3)] hover:scale-105 transition-transform" />

            <div className="text-center md:text-left max-w-md">
              <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold mb-3">
                No app installation required.
              </h4>
              <p className="text-white/70 text-sm leading-relaxed mb-6 font-semibold">
                Works directly over WhatsApp. Instant photo upload, GPS tracking, and automated NGO broadcast.
              </p>
              <Link
                href="/watch"
                className="inline-flex items-center gap-2 bg-[#ed176a] hover:bg-[#d1145d] text-white font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-base px-8 py-3.5 rounded-2xl border-2 border-white shadow-[4px_4px_0px_#fff] hover:scale-105 active:scale-95 transition-all"
              >
                <span>Report an animal now</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── 3. For NGOs (Reversed Layout with Attitude & Live Mockup) ── */
export function ForNgos() {
  return (
    <section id="ngos" className="bg-[#0a0a0a] text-white py-20 lg:py-28 px-6 border-t-2 border-white/10">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Bold Copy with Attitude */}
            <div className="lg:col-span-7">
              <span className="inline-block text-xs font-extrabold text-white bg-[#ed176a] px-4 py-1.5 rounded-lg uppercase tracking-wider border border-white shadow-[3px_3px_0px_#fff] mb-6">
                For Verified Rescue NGOs
              </span>

              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.08]">
                You&apos;re already doing the work.
                <br />
                <span className="text-[#ed176a]">We just get you to the stray sooner.</span>
              </h2>

              <ul className="mt-8 space-y-4 font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-base text-white/85">
                <li className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ed176a]" />
                  <span>Cases in your 3 km area, sorted by urgent priority</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ed176a]" />
                  <span>One-click WhatsApp dashboard — claim, update, &amp; close</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ed176a]" />
                  <span>Zero fees, zero contracts, zero complicated software</span>
                </li>
              </ul>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="https://wa.me/YOUR_NUMBER?text=Hi%20Pawsure!%20We're%20a%20rescue%20NGO%20and%20want%20to%20join%20Watch"
                  className="bg-[#ed176a] hover:bg-[#d1145d] text-white font-['Plus_Jakarta_Sans',sans-serif] font-extrabold px-8 py-3.5 rounded-2xl border-2 border-white shadow-[4px_4px_0px_#fff] hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wider"
                >
                  Partner With Us →
                </a>

                <Link
                  href="/ngo/login"
                  className="bg-white/10 hover:bg-white/20 text-white font-['Plus_Jakarta_Sans',sans-serif] font-bold px-7 py-3.5 rounded-2xl border border-white/30 transition-all text-sm"
                >
                  NGO Login
                </Link>
              </div>
            </div>

            {/* Right Column: Live Rescue Notification Mockup Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#171717] rounded-3xl p-7 border-2 border-white shadow-[6px_6px_0px_#ed176a] relative transform hover:-translate-y-1 transition-transform">
                <div className="flex items-center justify-between text-xs font-extrabold text-[#ed176a] uppercase tracking-wider mb-4 pb-3 border-b border-white/10">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ed176a] animate-ping" />
                    LIVE RESCUE DISPATCH
                  </span>
                  <span>1.2 KM AWAY</span>
                </div>

                <div className="space-y-3 font-['Plus_Jakarta_Sans',sans-serif]">
                  <p className="text-white font-extrabold text-lg leading-snug">
                    Injured dog reported at Lokhandwala Circle, Mumbai
                  </p>
                  <p className="text-white/60 text-xs font-semibold">
                    Reporter: +91 98200XXXXX &bull; 2 mins ago
                  </p>
                  <div className="bg-[#0a0a0a] rounded-xl p-3.5 border border-white/15 text-xs text-white/80 font-mono">
                    📍 GPS Location verified (3 km cluster)
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-6 w-full bg-[#ed176a] hover:bg-[#d1145d] text-white font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-sm uppercase tracking-wider py-3.5 px-4 rounded-2xl border-2 border-white shadow-[3px_3px_0px_#fff] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>Accept Rescue Dispatch</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 4. Community (Socially Irresistible) ── */
export function Community() {
  const GROUP_URL = "https://chat.whatsapp.com/LozMnMO8k2oGfB56tLEyFg";
  const NEIGHBORHOODS = ["Andheri West", "Lokhandwala", "Bandra", "Juhu", "Versova"];
  const AVATARS = [
    { initials: "AK", name: "Ananya K." },
    { initials: "SM", name: "Sameer M." },
    { initials: "PR", name: "Pooja R." },
    { initials: "RD", name: "Rohan D." },
    { initials: "NV", name: "Neha V." },
  ];

  return (
    <section id="community" className="bg-[#fff0eb] py-20 lg:py-28 px-6 border-t-2 border-[#0a0a0a]">
      <div className="max-w-4xl mx-auto text-center">
        <Reveal>
          {/* Overlapping Avatar Stack */}
          <div className="flex items-center justify-center -space-x-3 mb-6">
            {AVATARS.map((user, idx) => (
              <div
                key={idx}
                className="w-12 h-12 rounded-full bg-[#0a0a0a] text-white font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-xs border-2 border-white shadow-md flex items-center justify-center shrink-0"
              >
                {user.initials}
              </div>
            ))}
          </div>

          {/* Neighborhood Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {NEIGHBORHOODS.map((tag) => (
              <span
                key={tag}
                className="bg-white text-[#0a0a0a] font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-[#0a0a0a] shadow-[2px_2px_0px_#0a0a0a]"
              >
                {tag}
              </span>
            ))}
          </div>

          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0a0a0a] leading-[1.05]">
            Pet parents &amp; rescuers in one group.
          </h2>

          <p className="mt-6 text-lg sm:text-xl text-[#0a0a0a]/75 max-w-lg mx-auto leading-relaxed font-semibold">
            Real people across Mumbai sharing local rescue alerts, foster leads, and pet care.
          </p>

          <a
            href={GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 mt-8 px-9 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-base sm:text-lg rounded-2xl border-2 border-[#0a0a0a] shadow-[4px_4px_0px_#0a0a0a] hover:scale-105 active:scale-95 transition-all"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm5.8 14.13c-.24.68-1.42 1.31-1.96 1.36-.5.05-.98.24-3.3-.69-2.78-1.1-4.55-3.95-4.69-4.13-.14-.19-1.12-1.49-1.12-2.84s.71-2.01.96-2.29c.25-.28.55-.35.73-.35h.52c.17 0 .4-.06.62.48.24.57.8 1.98.87 2.12.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.17.28.74 1.22 1.59 1.98 1.09.97 2.01 1.27 2.29 1.41.28.14.45.12.61-.07.17-.19.71-.83.9-1.11.19-.28.38-.24.64-.14.26.09 1.67.79 1.95.93.28.14.47.21.54.33.07.11.07.66-.17 1.34z" />
            </svg>
            <span>Join 350+ Pet Parents on WhatsApp →</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 5. Footer ── */
export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white px-6 py-16 border-t-2 border-white/10 relative overflow-hidden">
      {/* Subtle Top Paw Pattern Accent */}
      <div className="border-b border-white/10 pb-8 mb-12 opacity-20" aria-hidden="true">
        <div className="flex justify-between max-w-7xl mx-auto px-6 text-white">
          {Array.from({ length: 12 }).map((_, i) => (
            <Paw key={i} className="w-4 h-4 shrink-0" style={{ transform: `rotate(${i % 2 ? 18 : -14}deg)` }} />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 font-['Plus_Jakarta_Sans',sans-serif]">
        <div>
          <p className="text-3xl font-extrabold tracking-tight">
            paw<span className="text-[#ed176a]">sure</span>
          </p>
          <p className="text-white/60 text-sm mt-2 max-w-xs leading-relaxed font-semibold">
            Better care for pets. Stronger communities for street animals.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-bold text-white/80">
          <Link href="/watch" className="hover:text-[#ed176a] transition-colors">Report a Dog</Link>
          <Link href="/#how-watch-works" className="hover:text-[#ed176a] transition-colors">How Watch works</Link>
          <Link href="/#ngos" className="hover:text-[#ed176a] transition-colors">For NGOs</Link>
          <Link href="/#community" className="hover:text-[#ed176a] transition-colors">Community</Link>
          <Link href="/ngo/login" className="hover:text-[#ed176a] transition-colors">NGO login</Link>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-white/40 font-['Plus_Jakarta_Sans',sans-serif]">
        <p>&copy; {new Date().getFullYear()} Pawsure Watch. Made for animals in Mumbai.</p>
        <p>Verified NGO Dispatch Network</p>
      </div>
    </footer>
  );
}

/* ── 6. Sticky Mobile Action Bar ── */
export function StickyMobileAction() {
  return (
    <div className="fixed bottom-4 inset-x-4 z-50 md:hidden pointer-events-none">
      <Link
        href="/watch"
        className="pointer-events-auto w-full bg-[#ed176a] text-white font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-base py-3.5 px-6 rounded-full border-2 border-[#0a0a0a] shadow-[4px_4px_0px_#0a0a0a] flex items-center justify-center gap-2.5 active:scale-95 transition-all"
      >
        <span>Report an injured dog</span>
      </Link>
    </div>
  );
}