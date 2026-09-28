import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import content from "./content.json";
import { SonarMark } from "./parts";

/** One line, upper case, one size: MIDNIGHT in regular, ARMADA in bold, the sonar mark at cap height. */
export function Wordmark() {
  return (
    <a href="#top" className="wordmark flex items-center gap-[0.55em] text-[15px] sm:text-[17px]" aria-label={content.brand}>
      <SonarMark className="size-[0.95em] shrink-0" />
      <span className="whitespace-nowrap">MIDNIGHT <b>ARMADA</b></span>
    </a>
  );
}

/** Which section is under the nav: the last one whose top has passed a line a third of the way down. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const update = () => {
      const line = window.innerHeight / 3;
      let current = "";
      for (const id of [...ids, "commission"]) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [ids]);
  return active;
}

const IDS = content.nav.map((n) => n.id);

export function Nav() {
  const active = useActiveSection(IDS);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-colors ${scrolled || open ? "border-b hairline bg-abyss/85 backdrop-blur-md" : "border-b border-transparent"}`}>
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Wordmark />
        <ul className="hidden items-center gap-1 text-[14px] xl:flex">
          {content.nav.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} aria-current={active === n.id ? "true" : undefined}
                className={`relative rounded-full px-3 py-2 transition-colors ${active === n.id ? "text-flag" : "text-mist hover:text-flag"}`}>
                {n.label}
                <span className={`absolute inset-x-3 -bottom-0.5 h-px origin-left bg-signal-yellow transition-transform duration-300 ${active === n.id ? "scale-x-100" : "scale-x-0"}`} />
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <a href="#commission" className={`hidden whitespace-nowrap rounded-full sm:inline-block px-4 py-2 text-sm font-semibold transition-colors ${active === "commission" ? "bg-signal-yellow text-abyss" : "ring-1 ring-flag/30 hover:bg-signal-yellow hover:text-abyss hover:ring-signal-yellow"}`}>Commission</a>
          <button type="button" className="grid size-10 place-items-center rounded-full ring-1 ring-flag/20 xl:hidden" aria-expanded={open} aria-label="Sections" onClick={() => setOpen(!open)}>
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>
      {open ? (
        <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-1 px-5 pb-5 sm:grid-cols-4 sm:px-8 xl:hidden">
          {content.nav.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} onClick={() => setOpen(false)}
                className={`block rounded-xl px-4 py-3 ${active === n.id ? "bg-deck text-flag" : "text-mist hover:bg-hull hover:text-flag"}`}>{n.label}</a>
            </li>
          ))}
          <li className="sm:hidden">
            <a href="#commission" onClick={() => setOpen(false)} className="block rounded-xl bg-signal-yellow px-4 py-3 font-semibold text-abyss">Commission</a>
          </li>
        </ul>
      ) : null}
    </nav>
  );
}
