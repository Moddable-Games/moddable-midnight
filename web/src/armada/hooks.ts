import { useEffect, useRef, useState } from "react";

/** True when the visitor has asked for less motion; animations then hold still. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** Becomes true the first time the element scrolls into view, and stays true. */
export function useInView<T extends Element>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) { setSeen(true); observer.disconnect(); }
    }, { threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [seen, threshold]);
  return [ref, seen] as const;
}

/** Seconds since mount, ticking once per animation frame while `running`. */
export function useClock(running = true) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!running) return;
    let frame = 0;
    const start = performance.now() - t * 1000;
    const tick = (now: number) => { setT((now - start) / 1000); frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // Restarting from the current time is intended; `t` is read once per start.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);
  return t;
}

/** Calls `fn` every `ms` while `running`. */
export function useInterval(fn: () => void, ms: number, running = true) {
  const saved = useRef(fn);
  saved.current = fn;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => saved.current(), ms);
    return () => window.clearInterval(id);
  }, [ms, running]);
}

/** How far an element has travelled through the viewport: 0 as it enters at the bottom, 1 by the time it reaches the middle. */
export function useScrollProgress<T extends Element>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh - rect.top) / (vh * 0.5 + rect.height * 0.5);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  return [ref, progress] as const;
}

/** Counts up from 0 to `target` over `ms` once `start` is true. */
export function useCountUp(target: number, start: boolean, ms = 1400) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (reduced) { setValue(target); return; }
    let frame = 0;
    const began = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - began) / ms);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target, ms, reduced]);
  return value;
}
