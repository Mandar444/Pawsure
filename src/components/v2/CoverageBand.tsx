"use client";

import { useEffect, useRef } from "react";

const ZONES = [
  { name: "Lokhandwala", lat: 19.1404, lng: 72.8296, live: true },
  { name: "Andheri West", lat: 19.1197, lng: 72.8464, live: true },
  { name: "Versova", lat: 19.1317, lng: 72.8129, live: false },
  { name: "Juhu", lat: 19.0968, lng: 72.8265, live: false },
  { name: "Jogeshwari West", lat: 19.1417, lng: 72.8484, live: false },
];

const RADIUS_M = 3000;

export default function CoverageBand() {
  return (
    <section id="coverage" className="bg-[#fff0eb] py-20 lg:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-3xl bg-white border-2 border-[#0a0a0a] shadow-[6px_6px_0px_#0a0a0a] overflow-hidden grid lg:grid-cols-[280px_1fr]">
          {/* Left Panel - Compact */}
          <div className="p-7 lg:p-9 flex flex-col justify-between gap-8 bg-[#fafaf9] border-r-2 border-[#0a0a0a]">
            <div>
              <span className="inline-block text-[11px] font-extrabold text-white bg-[#0a0a0a] px-3.5 py-1.5 rounded-lg uppercase tracking-wider shadow-[2px_2px_0px_#ed176a] mb-4">
                Active Coverage Zone
              </span>
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl lg:text-3xl font-extrabold tracking-tight text-[#0a0a0a] leading-[1.15]">
                Live in Mumbai
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-[#0a0a0a]/70 font-semibold leading-relaxed">
                Watch operates in verified 3 km NGO clusters so every report gets an instant responder.
              </p>
            </div>

            <div className="space-y-3 font-['Plus_Jakarta_Sans',sans-serif]">
              <div className="bg-white rounded-xl p-3.5 border-2 border-[#0a0a0a] shadow-[3px_3px_0px_#0a0a0a]">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#ed176a]">Status</p>
                <p className="text-sm font-extrabold text-[#0a0a0a] mt-0.5">Rescue Network Active</p>
              </div>

              <div className="bg-white rounded-xl p-3.5 border-2 border-[#0a0a0a] shadow-[3px_3px_0px_#0a0a0a]">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#ed176a]">Capacity</p>
                <p className="text-sm font-extrabold text-[#0a0a0a] mt-0.5">18 Verified Rescuers</p>
              </div>
            </div>

            <p className="text-[11px] text-[#0a0a0a]/60 font-semibold leading-relaxed">
              Want Watch in your area?{" "}
              <a href="#ngos" className="text-[#ed176a] font-extrabold underline hover:text-[#0a0a0a]">
                Partner your local NGO →
              </a>
            </p>
          </div>

          {/* Map Area - Expanded */}
          <div className="relative min-h-[420px] lg:min-h-[500px]">
            <CoverageMap />

            {/* Floating Pills Directly on Map */}
            <div className="absolute top-4 left-4 z-[500] flex flex-wrap gap-2.5 pointer-events-none">
              <span className="bg-[#0a0a0a] text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full border-2 border-[#0a0a0a] shadow-[3px_3px_0px_#ed176a] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ed176a] animate-ping" />
                LIVE: LOKHANDWALA &amp; ANDHERI
              </span>

              <span className="bg-white text-[#0a0a0a] text-xs font-extrabold px-3.5 py-1.5 rounded-full border-2 border-[#0a0a0a] shadow-[3px_3px_0px_#0a0a0a]">
                18 NGOs NEARBY
              </span>

              <span className="bg-white text-[#0a0a0a] text-xs font-extrabold px-3.5 py-1.5 rounded-full border-2 border-[#0a0a0a] shadow-[3px_3px_0px_#0a0a0a]">
                &lt; 14 MIN DISPATCH
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CoverageMap() {
  const ref = useRef<HTMLDivElement>(null);
  const made = useRef(false);

  useEffect(() => {
    if (!ref.current || made.current) return;
    made.current = true;

    let cleanup = () => {};

    (async () => {
      const L = (await import("leaflet")).default;

      const map = L.map(ref.current!, {
        center: [19.1285, 72.8355],
        zoom: 12,
        scrollWheelZoom: false,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "topright" }).addTo(map);

      for (const z of ZONES) {
        if (z.live) {
          L.circle([z.lat, z.lng], {
            radius: RADIUS_M,
            color: "#ed176a",
            weight: 2.5,
            opacity: 0.8,
            fillColor: "#ed176a",
            fillOpacity: 0.18,
            dashArray: "6 6",
          }).addTo(map);
        }

        const html = z.live
          ? `<div style="display:flex;align-items:center;gap:6px;transform:translate(-9px,-9px)">
               <span style="width:18px;height:18px;border-radius:9999px;background:#ed176a;border:3px solid #0a0a0a;box-shadow:0 3px 10px rgba(237,23,106,.4)"></span>
               <span style="font:800 12px/1 'Plus Jakarta Sans',sans-serif;color:#0a0a0a;background:#fff;padding:6px 12px;border-radius:12px;border:2px solid #0a0a0a;box-shadow:3px 3px 0px #0a0a0a;white-space:nowrap">${z.name}</span>
             </div>`
          : `<div style="display:flex;align-items:center;gap:6px;transform:translate(-6px,-6px)">
               <span style="width:12px;height:12px;border-radius:9999px;background:rgba(10,10,10,.3);border:2px solid #0a0a0a"></span>
               <span style="font:700 11px/1 'Plus Jakarta Sans',sans-serif;color:rgba(10,10,10,.5);white-space:nowrap">${z.name}</span>
             </div>`;

        L.marker([z.lat, z.lng], {
          icon: L.divIcon({ className: "", html, iconSize: [0, 0] }),
          interactive: false,
        }).addTo(map);
      }

      map.fitBounds(
        L.latLngBounds(ZONES.map((z) => [z.lat, z.lng] as [number, number])).pad(1.6)
      );

      cleanup = () => map.remove();
    })();

    return () => cleanup();
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-0 z-0"
      aria-label="Map of Pawsure Watch coverage in Andheri West, Mumbai"
    />
  );
}