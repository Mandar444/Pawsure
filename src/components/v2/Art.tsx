/* Shared brand art. All inline SVG — no image requests, no layout shift,
   scales cleanly, and recolours with currentColor. */

type SvgProps = React.SVGProps<SVGSVGElement>;

export function Paw({ className = "", ...rest }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" {...rest}>
      <ellipse cx="7.5" cy="8" rx="2.1" ry="2.8" />
      <ellipse cx="12" cy="6.4" rx="2.1" ry="2.9" />
      <ellipse cx="16.5" cy="8" rx="2.1" ry="2.8" />
      <ellipse cx="19.4" cy="12.4" rx="1.9" ry="2.3" />
      <path d="M12 11.4c2.9 0 5.4 2.2 5.4 4.7 0 2-1.6 3.1-3.5 3.1-1 0-1.4-.3-1.9-.3s-.9.3-1.9.3c-1.9 0-3.5-1.1-3.5-3.1 0-2.5 2.5-4.7 5.4-4.7z" />
    </svg>
  );
}

export function Bone({ className = "", ...rest }: SvgProps) {
  return (
    <svg viewBox="0 0 64 24" fill="currentColor" className={className} aria-hidden="true" {...rest}>
      <rect x="12" y="8" width="40" height="8" rx="4" />
      <circle cx="12" cy="8" r="6" />
      <circle cx="12" cy="16" r="6" />
      <circle cx="52" cy="8" r="6" />
      <circle cx="52" cy="16" r="6" />
    </svg>
  );
}

/* A trail of paw prints walking across a section edge. Each print alternates
   left/right and tilts along the path, the way an actual dog walks. */
export function PawTrail({ className = "", count = 7 }: { className?: string; count?: number }) {
  return (
    <div className={`flex items-end gap-6 ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <Paw
          key={i}
          className="w-5 h-5 shrink-0"
          style={{
            transform: `translateY(${i % 2 ? 10 : 0}px) rotate(${i % 2 ? 18 : -8}deg)`,
            opacity: 0.15 + (i / count) * 0.5,
          }}
        />
      ))}
    </div>
  );
}

/* Section divider: a hairline that breaks around a centred bone. */
export function BoneDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-5 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-current opacity-15" />
      <Bone className="w-10 h-4 opacity-30 rotate-[-12deg]" />
      <span className="h-px flex-1 bg-current opacity-15" />
    </div>
  );
}

/* An actual mockup of the report form, not an abstract diagram. Someone who
   sees this knows exactly what they're about to fill in — which is most of
   the reason a landing page shows a product shot at all. */
export function FormMockup({ className = "", ...rest }: SvgProps) {
  return (
    <svg viewBox="0 0 300 560" className={className} aria-hidden="true" fill="none" {...rest}>
      {/* handset */}
      <rect x="6" y="6" width="288" height="548" rx="38" fill="#0a0a0a" />
      <rect x="14" y="14" width="272" height="532" rx="32" fill="#ed176a" />
      <rect x="118" y="24" width="64" height="7" rx="3.5" fill="#0a0a0a" fillOpacity=".35" />

      {/* pink page header */}
      <rect x="38" y="48" width="140" height="13" rx="6.5" fill="#fff" fillOpacity=".95" />
      <rect x="38" y="70" width="196" height="8" rx="4" fill="#fff" fillOpacity=".45" />

      {/* the translucent form card */}
      <rect x="28" y="96" width="244" height="432" rx="24" fill="#fff" fillOpacity=".95" />

      {/* photo dropzone */}
      <rect x="46" y="116" width="88" height="9" rx="4.5" fill="#0a0a0a" fillOpacity=".8" />
      <rect x="46" y="136" width="208" height="98" rx="14" fill="#ed176a" fillOpacity=".07"
            stroke="#0a0a0a" strokeOpacity=".18" strokeWidth="1.5" strokeDasharray="6 5" />
      {/* camera glyph */}
      <rect x="132" y="172" width="36" height="26" rx="6" fill="#ed176a" fillOpacity=".5" />
      <circle cx="150" cy="185" r="8" fill="#fff" />
      <circle cx="150" cy="185" r="4.5" fill="#ed176a" fillOpacity=".6" />
      <rect x="141" y="167" width="14" height="6" rx="2.5" fill="#ed176a" fillOpacity=".5" />
      <rect x="104" y="210" width="92" height="7" rx="3.5" fill="#0a0a0a" fillOpacity=".2" />

      {/* location row */}
      <rect x="46" y="250" width="62" height="9" rx="4.5" fill="#0a0a0a" fillOpacity=".8" />
      <rect x="46" y="268" width="208" height="34" rx="17" fill="#fff0eb" />
      <path d="M74 278c-4 0-7 3-7 7 0 5 7 12 7 12s7-7 7-12c0-4-3-7-7-7z" fill="#ed176a" />
      <circle cx="74" cy="285" r="2.6" fill="#fff" />
      <rect x="90" y="281" width="104" height="8" rx="4" fill="#0a0a0a" fillOpacity=".45" />

      {/* animal chips — first one selected */}
      <rect x="46" y="318" width="86" height="9" rx="4.5" fill="#0a0a0a" fillOpacity=".8" />
      <rect x="46" y="338" width="52" height="28" rx="14" fill="#0a0a0a" />
      <rect x="60" y="348" width="24" height="8" rx="4" fill="#fff" />
      <rect x="106" y="338" width="50" height="28" rx="14" fill="#fff" stroke="#0a0a0a" strokeOpacity=".12" strokeWidth="1.5" />
      <rect x="119" y="348" width="24" height="8" rx="4" fill="#0a0a0a" fillOpacity=".3" />
      <rect x="164" y="338" width="54" height="28" rx="14" fill="#fff" stroke="#0a0a0a" strokeOpacity=".12" strokeWidth="1.5" />
      <rect x="178" y="348" width="26" height="8" rx="4" fill="#0a0a0a" fillOpacity=".3" />

      {/* severity cells — emergency selected, red fill */}
      <rect x="46" y="382" width="120" height="9" rx="4.5" fill="#0a0a0a" fillOpacity=".8" />
      <rect x="46" y="402" width="208" height="30" rx="14" fill="#fef2f2" stroke="#dc2626" strokeWidth="2" />
      <rect x="62" y="412" width="62" height="9" rx="4.5" fill="#dc2626" />
      <rect x="46" y="438" width="208" height="26" rx="13" fill="#fafaf9" />
      <rect x="62" y="447" width="56" height="8" rx="4" fill="#0a0a0a" fillOpacity=".25" />
      <rect x="46" y="470" width="208" height="26" rx="13" fill="#fafaf9" />
      <rect x="62" y="479" width="44" height="8" rx="4" fill="#0a0a0a" fillOpacity=".25" />

      {/* the bone submit button, straight shaft + four knuckles */}
      <g>
        <rect x="62" y="508" width="176" height="30" rx="10" fill="#ed176a" />
        <circle cx="66" cy="510" r="12" fill="#ed176a" />
        <circle cx="66" cy="536" r="12" fill="#ed176a" />
        <circle cx="234" cy="510" r="12" fill="#ed176a" />
        <circle cx="234" cy="536" r="12" fill="#ed176a" />
        <rect x="106" y="519" width="88" height="9" rx="4.5" fill="#fff" />
      </g>
    </svg>
  );
}

/* The Watch story in one picture: a phone with a photo, a map pin radiating
   3 km, and a WhatsApp bubble landing. Replaces a paragraph of explanation. */
export function WatchIllustration({ className = "", ...rest }: SvgProps) {
  return (
    <svg viewBox="0 0 420 300" className={className} aria-hidden="true" fill="none" {...rest}>
      {/* radiating radius rings */}
      <circle cx="255" cy="150" r="120" stroke="currentColor" strokeOpacity=".12" strokeWidth="1.5" strokeDasharray="5 7" />
      <circle cx="255" cy="150" r="86" stroke="currentColor" strokeOpacity=".18" strokeWidth="1.5" strokeDasharray="5 7" />
      <circle cx="255" cy="150" r="52" stroke="currentColor" strokeOpacity=".25" strokeWidth="1.5" />

      {/* phone */}
      <rect x="34" y="42" width="118" height="216" rx="20" fill="#0a0a0a" />
      <rect x="42" y="50" width="102" height="200" rx="14" fill="#fff" />
      <rect x="52" y="62" width="82" height="70" rx="9" fill="#ed176a" fillOpacity=".16" />
      {/* tiny dog in the photo frame */}
      <circle cx="82" cy="94" r="13" fill="#ed176a" fillOpacity=".55" />
      <ellipse cx="106" cy="102" rx="17" ry="12" fill="#ed176a" fillOpacity=".55" />
      <path d="M72 84c-2-6 1-10 4-9s4 6 2 11z" fill="#ed176a" fillOpacity=".75" />
      <rect x="52" y="144" width="60" height="7" rx="3.5" fill="#0a0a0a" fillOpacity=".12" />
      <rect x="52" y="158" width="76" height="7" rx="3.5" fill="#0a0a0a" fillOpacity=".08" />
      <rect x="52" y="196" width="82" height="26" rx="13" fill="#ed176a" />

      {/* flight path from phone to pin */}
      <path d="M160 150C190 118 214 132 236 146" stroke="currentColor" strokeOpacity=".3" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" />

      {/* map pin */}
      <path d="M255 108c-15 0-27 12-27 27 0 20 27 47 27 47s27-27 27-47c0-15-12-27-27-27z" fill="#ed176a" />
      <circle cx="255" cy="135" r="10" fill="#fff" />

      {/* WhatsApp-ish alert bubbles arriving at nearby NGOs */}
      <g>
        <rect x="318" y="66" width="72" height="34" rx="14" fill="#0a0a0a" />
        <circle cx="334" cy="83" r="5" fill="#16a34a" />
        <rect x="345" y="78" width="34" height="4" rx="2" fill="#fff" fillOpacity=".7" />
        <rect x="345" y="87" width="22" height="4" rx="2" fill="#fff" fillOpacity=".35" />
      </g>
      <g>
        <rect x="330" y="204" width="72" height="34" rx="14" fill="#0a0a0a" />
        <circle cx="346" cy="221" r="5" fill="#16a34a" />
        <rect x="357" y="216" width="34" height="4" rx="2" fill="#fff" fillOpacity=".7" />
        <rect x="357" y="225" width="22" height="4" rx="2" fill="#fff" fillOpacity=".35" />
      </g>
    </svg>
  );
}