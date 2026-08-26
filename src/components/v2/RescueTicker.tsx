"use client";
import { Paw } from "./Art";

export default function RescueTicker() {
  const paws = Array.from({ length: 18 });

  return (
    <div
      className="relative bg-[#0a0a0a] border-y-2 border-[#0a0a0a] py-4 overflow-hidden shadow-md flex items-center justify-between"
      aria-label="Paw prints band"
    >
      <div className="flex items-center justify-around w-full max-w-7xl mx-auto px-6 opacity-90">
        {paws.map((_, i) => (
          <Paw
            key={i}
            className="w-5 h-5 sm:w-6 sm:h-6 text-[#ed176a] hover:scale-125 transition-transform duration-300 shrink-0 drop-shadow-[0_2px_8px_rgba(237,23,106,0.4)]"
            style={{
              transform: `rotate(${i % 2 === 0 ? -12 : 14}deg) translateY(${i % 2 === 0 ? -2 : 3}px)`,
              opacity: i % 3 === 0 ? 0.95 : i % 2 === 0 ? 0.7 : 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
}