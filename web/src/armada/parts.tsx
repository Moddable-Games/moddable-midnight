/**
 * Midnight Armada's drawn parts: the sonar mark and the four vessel icons.
 *
 * Every icon is a stroke drawing of the same top-down hull that sails across the hero chart, so
 * the icons and the animation read as one set: the Flagship carries the command seal, the
 * Flotilla sails as a wedge, Safe Harbor moors inside a breakwater and the Cloaking Device
 * dissolves the hull into a dashed outline around a proof.
 */

export type VesselId = "flagship" | "flotilla" | "harbor" | "cloak";

/** A hull seen from above, bow up, centred on (cx, cy) and `s` times the size of the 24px icon hull. */
export function hullPath(cx: number, cy: number, s = 1) {
  const p = (x: number, y: number) => `${(cx + x * s).toFixed(2)} ${(cy + y * s).toFixed(2)}`;
  return `M${p(0, -8.5)} C${p(3, -5.5)} ${p(3.6, 0)} ${p(2.8, 7)} L${p(-2.8, 7)} C${p(-3.6, 0)} ${p(-3, -5.5)} ${p(0, -8.5)} Z`;
}

/** The mark: a minimal sonar, two range rings, the sweep and a contact. */
export function SonarMark({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="5" opacity="0.55" />
      <path d="M12 12 L19.1 4.9" className="text-signal-yellow" stroke="currentColor" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function VesselIcon({ id, className = "size-8", draw = false }: { id: VesselId; className?: string; draw?: boolean }) {
  const line = draw ? "draw" : undefined;
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {id === "flagship" ? (
        <>
          <path d={hullPath(12, 12.5, 1.05)} className={line} pathLength={1} />
          <circle cx="12" cy="12.5" r="2" className="text-signal-yellow" />
        </>
      ) : null}
      {id === "flotilla" ? (
        <>
          <path d={hullPath(12, 9, 0.62)} className={line} pathLength={1} />
          <path d={hullPath(6, 15.5, 0.52)} className={line} pathLength={1} />
          <path d={hullPath(18, 15.5, 0.52)} className={line} pathLength={1} />
        </>
      ) : null}
      {id === "harbor" ? (
        <>
          <path d="M3 8.5v5a9 9 0 0 0 18 0v-5" className={line} pathLength={1} />
          <path d={hullPath(12, 13, 0.55)} className="text-signal-yellow" />
        </>
      ) : null}
      {id === "cloak" ? (
        <>
          <path d={hullPath(12, 12.5, 1.05)} strokeDasharray="1.6 2.4" />
          <path d="M9.8 12.6l1.5 1.5 2.9-3.1" className="text-signal-yellow" />
        </>
      ) : null}
    </svg>
  );
}
