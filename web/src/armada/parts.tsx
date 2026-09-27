/**
 * Midnight Armada's visual parts: the signal-flag emblems and the chart table in the hero.
 *
 * The emblems are drawn from the international code of signals, each chosen for its meaning at
 * sea: Papa, the Blue Peter ("all aboard, about to sail"), for the Flagship; Golf's stripes for
 * the Flotilla; Quebec's yellow ("my vessel is healthy") for Safe Harbor; Yankee's diagonals for
 * the Cloaking Device.
 */

export type FlagId = "flagship" | "flotilla" | "harbor" | "cloak";

export function SignalFlag({ id, className = "h-9 w-12" }: { id: FlagId; className?: string }) {
  return (
    <svg viewBox="0 0 48 36" className={className} aria-hidden="true">
      <defs>
        <clipPath id={`flag-${id}`}><rect width="48" height="36" rx="2" /></clipPath>
        <pattern id="diag" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="12" fill="#f2b705" /><rect x="6" width="6" height="12" fill="#e23b2e" />
        </pattern>
      </defs>
      <g clipPath={`url(#flag-${id})`}>
        {id === "flagship" ? (<><rect width="48" height="36" fill="#2456d6" /><rect x="14" y="10" width="20" height="16" fill="#efe9dc" /></>) : null}
        {id === "flotilla" ? [0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={i * 8} width="8" height="36" fill={i % 2 ? "#2456d6" : "#f2b705"} />) : null}
        {id === "harbor" ? <rect width="48" height="36" fill="#f2b705" /> : null}
        {id === "cloak" ? <rect width="48" height="36" fill="url(#diag)" /> : null}
      </g>
      <rect width="48" height="36" rx="2" fill="none" stroke="rgb(239 233 220 / 0.25)" />
    </svg>
  );
}

/** The four flags hoisted together: the wordmark's emblem. */
export function Hoist({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col gap-[3px] ${className}`} aria-hidden="true">
      {(["flagship", "flotilla", "harbor", "cloak"] as const).map((id) => <SignalFlag key={id} id={id} className="h-[7px] w-[11px]" />)}
    </span>
  );
}

/** A vessel on the chart: a hull seen from above, pointing along its heading. */
function Vessel({ x, y, size = 1, heading = 0, flag, className = "" }: { x: number; y: number; size?: number; heading?: number; flag?: boolean; className?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${heading}) scale(${size})`}>
      <g className={className}>
        <path d="M0 -14 C5 -8 6 4 4 12 L-4 12 C-6 4 -5 -8 0 -14 Z" fill={flag ? "#efe9dc" : "#8b9ab3"} />
        {flag ? <rect x="-3" y="-4" width="6" height="5" fill="#2456d6" /> : null}
      </g>
    </g>
  );
}

/**
 * The hero's chart table: bearing ring, range rings, a sonar sweep and the fleet in formation
 * around its flagship. Decorative; the page's text carries the meaning.
 */
export function ChartTable() {
  // Flotillas in a loose wedge astern of the flagship, like ships in line abreast.
  const escorts: [number, number][] = [
    [-120, 60], [-60, 40], [60, 40], [120, 60], [-170, 110], [-95, 115], [95, 115], [170, 110],
    [-40, 150], [40, 150], [-140, 175], [140, 175], [0, 205], [-210, 170], [210, 170],
  ];
  return (
    <div className="relative aspect-square w-full max-w-[640px]" aria-hidden="true">
      <div className="sweep absolute inset-[6%]" />
      <svg viewBox="-320 -320 640 640" className="absolute inset-0 h-full w-full">
        {[80, 160, 240, 300].map((r) => (
          <circle key={r} r={r} fill="none" stroke="#2a3b52" strokeWidth={r === 300 ? 1.5 : 1} strokeDasharray={r === 300 ? "0" : "2 6"} />
        ))}
        {Array.from({ length: 72 }, (_, i) => {
          const a = (i * 5 * Math.PI) / 180;
          const long = i % 6 === 0;
          const r1 = 300, r2 = long ? 284 : 292;
          return <line key={i} x1={Math.sin(a) * r1} y1={-Math.cos(a) * r1} x2={Math.sin(a) * r2} y2={-Math.cos(a) * r2} stroke={long ? "#8b9ab3" : "#2a3b52"} strokeWidth="1" />;
        })}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          return <text key={i} x={Math.sin(a) * 268} y={-Math.cos(a) * 268 + 4} textAnchor="middle" fill="#8b9ab3" fontFamily="Martian Mono, monospace" fontSize="10">{String(i * 30).padStart(3, "0")}</text>;
        })}
        <line x1="-300" y1="0" x2="300" y2="0" stroke="#2a3b52" />
        <line x1="0" y1="-300" x2="0" y2="300" stroke="#2a3b52" />
        {/* The flagship, with a ping, and its fleet holding station */}
        <circle cy="-40" r="22" fill="none" stroke="#f2b705" strokeWidth="1.5" className="ping" />
        {escorts.map(([x, y], i) => (
          <Vessel key={i} x={x} y={y - 40} size={0.8} className={`swell ${i % 3 === 1 ? "swell-late" : i % 3 === 2 ? "swell-later" : ""}`} />
        ))}
        <Vessel x={0} y={-40} size={1.6} flag className="swell" />
        <text x="14" y="-78" fill="#f2b705" fontFamily="Martian Mono, monospace" fontSize="10">FLAGSHIP</text>
        <text x="-300" y="-296" fill="#8b9ab3" fontFamily="Martian Mono, monospace" fontSize="10">FLEET 15 / 15 ON STATION</text>
        <text x="300" y="312" textAnchor="end" fill="#8b9ab3" fontFamily="Martian Mono, monospace" fontSize="10">CLOAK ENGAGED</text>
      </svg>
    </div>
  );
}
