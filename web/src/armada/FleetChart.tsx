import { useEffect, useRef, useState } from "react";
import { useClock, useReducedMotion } from "./hooks";
import { hullPath } from "./parts";

/**
 * The hero's sonar chart, showing what the page describes: the Flagship at the centre sends
 * flotillas of agents out on missions with cargo (a payment). Inside the cloak line the
 * commander sees everything; beyond it the flotillas go dark and the sweep picks up only their
 * proofs. They trade at a counterparty and come home carrying a proof.
 *
 * Everything is derived from one clock, so the picture is a pure function of time.
 */

const CLOAK_R = 165;
const PERIOD = 15; // seconds per mission
const SWEEP_PERIOD = 10;

type Mission = { name: string; to: [number, number]; bend: number; offset: number };

const MISSIONS: Mission[] = [
  { name: "VENUE B", to: [218, -168], bend: 0.35, offset: 0 },
  { name: "SUPPLIER 11", to: [-205, -152], bend: -0.3, offset: 5 },
  { name: "MARKET 02", to: [206, 172], bend: -0.32, offset: 10 },
];


type Point = [number, number];

function bezier(a: Point, c: Point, b: Point, u: number): Point {
  const v = 1 - u;
  return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]];
}

/** Control point bending the straight line a→b sideways by `bend` of its length. */
function control(a: Point, b: Point, bend: number): Point {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0], dy = b[1] - a[1];
  return [mx - dy * bend, my + dx * bend];
}

const ease = (u: number) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);

/** Where a mission's lead vessel is at time t, which way it faces, and what it carries. */
function missionState(m: Mission, t: number) {
  const u = (((t + m.offset) % PERIOD) + PERIOD) % PERIOD / PERIOD;
  // Flotillas form up just off the Flagship and hold station just short of the counterparty.
  const len = Math.hypot(m.to[0], m.to[1]);
  const home: Point = [(m.to[0] / len) * 48, (m.to[1] / len) * 48];
  const at: Point = [m.to[0] * (1 - 34 / len), m.to[1] * (1 - 34 / len)];
  const out = control(home, at, m.bend);
  const back = control(at, home, m.bend);
  let pos: Point, ahead: Point, leg: "out" | "trade" | "home";
  let fade = 1;
  if (u < 0.45) {
    const k = ease(Math.max(0, (u - 0.04) / 0.41));
    pos = bezier(home, out, at, k);
    ahead = bezier(home, out, at, Math.min(1, k + 0.01));
    leg = "out";
    fade = Math.min(1, u / 0.06);
  } else if (u < 0.55) {
    pos = at;
    ahead = [at[0] + m.to[0] * 0.01, at[1] + m.to[1] * 0.01];
    leg = "trade";
  } else {
    const k = ease(Math.min(1, (u - 0.55) / 0.41));
    pos = bezier(at, back, home, k);
    ahead = bezier(at, back, home, Math.min(1, k + 0.01));
    leg = "home";
    fade = Math.min(1, (1 - u) / 0.06);
  }
  const heading = (Math.atan2(ahead[0] - pos[0], -(ahead[1] - pos[1])) * 180) / Math.PI;
  const cloaked = Math.hypot(pos[0], pos[1]) > CLOAK_R;
  const completed = Math.floor((t + m.offset) / PERIOD) + (u > 0.5 ? 1 : 0);
  return { pos, heading, leg, fade, cloaked, u, completed };
}

function Flotilla({ m, t, sweep }: { m: Mission; t: number; sweep: number }) {
  const s = missionState(m, t);
  const [x, y] = s.pos;
  // How recently the sweep passed this bearing: a contact glows, then fades.
  const bearing = ((Math.atan2(x, -y) * 180) / Math.PI + 360) % 360;
  const behind = (sweep - bearing + 360) % 360;
  const blip = s.cloaked ? Math.max(0, 1 - behind / 90) : 0;
  const stroke = s.cloaked ? "#8b9ab3" : "#efe9dc";
  const dash = s.cloaked ? "2 3" : undefined;
  return (
    <g opacity={s.fade}>
      {blip > 0 ? <circle cx={x} cy={y} r={30 + (1 - blip) * 12} fill="none" stroke="#f2b705" strokeWidth="1" opacity={blip * 0.8} /> : null}
      <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${s.heading.toFixed(1)})`}>
        {([[0, -4, 1.7], [-17, 20, 1.25], [17, 20, 1.25]] as const).map(([dx, dy, k], i) => (
          <path key={i} d={hullPath(dx, dy, k)} fill={s.cloaked ? "none" : "#060b16"} stroke={stroke} strokeWidth="1.4" strokeDasharray={dash} />
        ))}
        {s.leg === "out" && !s.cloaked ? <rect x="-4" y="12" width="8" height="8" rx="1" fill="#f2b705" /> : null}
      </g>
      {s.leg === "home" ? (
        <path d={`M${x - 5} ${y - 30} l3.5 3.5 6.5 -7`} fill="none" stroke="#f2b705" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity={s.cloaked ? Math.max(0.4, blip) : 1} />
      ) : null}
      {s.leg === "trade" ? (
        <circle cx={m.to[0]} cy={m.to[1]} r={10 + ((s.u - 0.45) / 0.1) * 30} fill="none" stroke="#f2b705" strokeWidth="1.2" opacity={1 - (s.u - 0.45) / 0.1} />
      ) : null}
    </g>
  );
}

function Counterparty({ m }: { m: Mission }) {
  const [x, y] = m.to;
  const above = y < 0;
  return (
    <g>
      <path d={`M${x} ${y - 7} L${x + 7} ${y} L${x} ${y + 7} L${x - 7} ${y} Z`} fill="none" stroke="#8b9ab3" strokeWidth="1.2" />
      <text x={x} y={above ? y - 16 : y + 24} textAnchor="middle" fill="#8b9ab3" fontSize="10" className="font-mono">{m.name}</text>
    </g>
  );
}

function Bezel() {
  return (
    <g>
      {[80, 250, 300].map((r) => (
        <circle key={r} r={r} fill="none" stroke="#2a3b52" strokeWidth={r === 300 ? 1.5 : 1} strokeDasharray={r === 300 ? undefined : "2 6"} />
      ))}
      {Array.from({ length: 72 }, (_, i) => {
        const a = (i * 5 * Math.PI) / 180;
        const long = i % 6 === 0;
        const r2 = long ? 284 : 292;
        return <line key={i} x1={Math.sin(a) * 300} y1={-Math.cos(a) * 300} x2={Math.sin(a) * r2} y2={-Math.cos(a) * r2} stroke={long ? "#8b9ab3" : "#2a3b52"} strokeWidth="1" />;
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return <text key={i} x={Math.sin(a) * 270} y={-Math.cos(a) * 270 + 3.5} textAnchor="middle" fill="#56667f" fontSize="9" className="font-mono">{String(i * 30).padStart(3, "0")}</text>;
      })}
      {/* The cloak line: inside it the commander sees all; beyond it, only proofs */}
      <path id="cloak-line" d={`M ${-CLOAK_R} 0 A ${CLOAK_R} ${CLOAK_R} 0 0 1 ${CLOAK_R} 0 A ${CLOAK_R} ${CLOAK_R} 0 0 1 ${-CLOAK_R} 0`} fill="none" stroke="#f2b705" strokeOpacity="0.45" strokeWidth="1" strokeDasharray="1 5" strokeLinecap="round" />
      <text fill="#f2b705" fillOpacity="0.8" fontSize="9" letterSpacing="2" className="font-mono">
        <textPath href="#cloak-line" startOffset="17%">CLOAK LINE · PROOFS ONLY BEYOND</textPath>
      </text>
    </g>
  );
}

/**
 * The depth contours and glow around the chart, drawn here rather than in the page background so
 * they always share the chart's centre and continue its ring spacing beyond the bezel.
 */
function Contours() {
  return (
    <g>
      <defs>
        <radialGradient id="chart-glow">
          <stop offset="0" stopColor="#2456d6" stopOpacity="0.18" />
          <stop offset="1" stopColor="#2456d6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle r="620" fill="url(#chart-glow)" />
      {Array.from({ length: 14 }, (_, i) => 350 + i * 50).map((r) => (
        <circle key={r} r={r} fill="none" stroke="#2a3b52" strokeOpacity="0.3" />
      ))}
    </g>
  );
}

/** The sweep: thin wedges fading behind the leading edge. */
function Sweep({ angle }: { angle: number }) {
  const wedges = 14;
  return (
    <g transform={`rotate(${angle.toFixed(2)})`}>
      {Array.from({ length: wedges }, (_, i) => {
        const a0 = (-(i + 1) * 5 * Math.PI) / 180, a1 = (-i * 5 * Math.PI) / 180;
        const r = 296;
        return <path key={i} d={`M0 0 L${Math.sin(a0) * r} ${-Math.cos(a0) * r} A${r} ${r} 0 0 1 ${Math.sin(a1) * r} ${-Math.cos(a1) * r} Z`} fill="#f2b705" opacity={0.2 * Math.pow(1 - i / wedges, 2)} />;
      })}
      <line x1="0" y1="0" x2="0" y2="-296" stroke="#f2b705" strokeOpacity="0.6" />
    </g>
  );
}

export function FleetChart() {
  const reduced = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const clock = useClock(visible && !reduced);
  const t = reduced ? 3.4 : clock + 3.4;
  const sweep = ((t / SWEEP_PERIOD) * 360) % 360;
  const orders = (t % (PERIOD / 3)) / (PERIOD / 3);
  const proofs = 7180 + MISSIONS.reduce((n, m) => n + missionState(m, t).completed, 0);

  return (
    <div ref={box} className="relative aspect-square w-full max-w-[620px]" aria-hidden="true">
      <svg viewBox="-320 -320 640 640" className="absolute inset-0 h-full w-full overflow-visible">
        <Contours />
        <Sweep angle={sweep} />
        <Bezel />
        {MISSIONS.map((m) => <Counterparty key={m.name} m={m} />)}
        {/* The Flagship sends orders on a ring that reaches the cloak line */}
        <circle r={32 + orders * (CLOAK_R - 32)} fill="none" stroke="#f2b705" strokeWidth="1.2" opacity={0.7 * (1 - orders)} />
        {MISSIONS.map((m) => <Flotilla key={m.name} m={m} t={t} sweep={sweep} />)}
        <path d={hullPath(0, 0, 3.4)} fill="#060b16" stroke="#efe9dc" strokeWidth="1.8" />
        <circle cx="0" cy="0" r="6" fill="none" stroke="#f2b705" strokeWidth="1.8" />
        <text x="18" y="-26" fill="#f2b705" fontSize="10" className="font-mono">FLAGSHIP</text>
        <text x="-312" y="-300" fill="#8b9ab3" fontSize="10" className="font-mono">3 FLOTILLAS ON MISSION</text>
        <text x="312" y="-300" textAnchor="end" fill="#8b9ab3" fontSize="10" className="font-mono">PROOFS {proofs.toLocaleString("en-GB")}</text>
        <text x="-312" y="312" fill="#8b9ab3" fontSize="10" className="font-mono">DATA EXPOSED 0 B</text>
        <text x="312" y="312" textAnchor="end" fill="#8b9ab3" fontSize="10" className="font-mono">CLOAK ENGAGED</text>
      </svg>
    </div>
  );
}
