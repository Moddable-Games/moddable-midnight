import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { useEffect, useId, useRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/format";

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------

const button = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-colors disabled:opacity-45 whitespace-nowrap",
  {
    variants: {
      tone: {
        primary: "bg-cosmic text-white hover:bg-[#15306f]",
        ink: "bg-ink text-white hover:bg-[#1d2146]",
        soft: "bg-cosmic-soft text-cosmic hover:bg-[#dbe3f5]",
        ghost: "text-ink-soft hover:bg-sunken hover:text-ink",
        ok: "bg-ok text-white hover:bg-[#317f22]",
        bad: "bg-bad-soft text-bad hover:bg-[#f7d5d5]",
        glass: "bg-white/12 text-white hover:bg-white/20",
      },
      size: { sm: "h-8 px-3 text-sm rounded-[0.7rem]", md: "h-10 px-4 text-[15px] rounded-control", lg: "h-12 px-5 text-base rounded-control" },
    },
    defaultVariants: { tone: "primary", size: "md" },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>;

export function Button({ className, tone, size, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={cn(button({ tone, size }), className)} {...rest} />;
}

/** Revolut's round action: an icon disc with a short label under it. */
export function RoundAction({ icon, label, onClick, badge, disabled, dark = true }: {
  icon: ReactNode; label: string; onClick?: () => void; badge?: number; disabled?: boolean; dark?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className="group flex w-[4.5rem] flex-col items-center gap-2 disabled:opacity-45">
      <span className={cn(
        "relative grid size-12 place-items-center rounded-full transition-colors",
        dark ? "bg-white/12 text-white group-hover:bg-white/22" : "bg-cosmic-soft text-cosmic group-hover:bg-[#dbe3f5]",
      )}>
        {icon}
        {badge ? (
          <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-wait px-1 text-[11px] font-bold text-white">{badge}</span>
        ) : null}
      </span>
      <span className={cn("text-[13px] font-medium", dark ? "text-white/85" : "text-ink-soft")}>{label}</span>
    </button>
  );
}

export function IconButton({ label, className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button type="button" aria-label={label} title={label}
      className={cn("grid size-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-sunken hover:text-ink", className)} {...rest}>
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Surfaces
// ---------------------------------------------------------------------------

export function Panel({ title, action, children, className, flush = false }: {
  title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; flush?: boolean;
}) {
  return (
    <section className={cn("rounded-panel bg-surface", flush ? "" : "p-4 sm:p-5", className)}>
      {(title || action) && (
        <header className={cn("mb-3 flex items-center justify-between gap-3", flush && "px-4 pt-4 sm:px-5 sm:pt-5")}>
          {title ? <h2 className="text-lg">{title}</h2> : <span />}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

const chip = cva("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-semibold", {
  variants: {
    tone: {
      neutral: "bg-sunken text-ink-soft",
      cosmic: "bg-cosmic-soft text-cosmic",
      ok: "bg-ok-soft text-ok",
      wait: "bg-wait-soft text-wait",
      bad: "bg-bad-soft text-bad",
      dark: "bg-white/12 text-white/90",
    },
  },
  defaultVariants: { tone: "neutral" },
});

export function Chip({ tone, className, children }: VariantProps<typeof chip> & { className?: string; children: ReactNode }) {
  return <span className={cn(chip({ tone }), className)}>{children}</span>;
}

export function Empty({ icon, title, children, action }: { icon: ReactNode; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-sunken text-ink-faint">{icon}</span>
      <p className="font-semibold">{title}</p>
      {children ? <p className="max-w-sm text-sm text-ink-soft">{children}</p> : null}
      {action}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sheet: right drawer on tablet and desktop, bottom sheet on phones
// ---------------------------------------------------------------------------

export function Sheet({ open, onClose, title, children, footer }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    ref.current?.querySelector<HTMLElement>("input, select, textarea, button")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-stretch md:justify-end">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-vault/45 backdrop-blur-[2px]" onClick={onClose} />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId}
        className="sheet-enter relative flex max-h-[92vh] w-full flex-col rounded-t-[1.5rem] bg-surface md:m-3 md:max-h-none md:w-[440px] md:rounded-[1.5rem]">
        <header className="flex items-center justify-between px-5 pb-2 pt-5">
          <h2 id={titleId} className="text-xl">{title}</h2>
          <IconButton label="Close" onClick={onClose}><X size={18} /></IconButton>
        </header>
        <div className="flex-1 overflow-y-auto px-5 pb-4">{children}</div>
        {footer ? <footer className="safe-bottom border-t border-line px-5 pt-3">{footer}</footer> : null}
      </div>
    </div>,
    document.body,
  );
}

// ---------------------------------------------------------------------------
// Form controls
// ---------------------------------------------------------------------------

export function Field({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-[13px] font-semibold text-ink-soft">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-[12px] text-ink-faint">{hint}</span> : null}
    </label>
  );
}

const control = "h-11 w-full rounded-control border border-line bg-sunken px-3 text-[15px] text-ink placeholder:text-ink-faint focus:border-cosmic focus:bg-surface focus:outline-none";

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(control, className)} {...rest} />;
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(control, "appearance-none pr-8", className)} {...rest}>{children}</select>;
}

export function Segmented<T extends string>({ value, onChange, options, className }: {
  value: T; onChange: (v: T) => void; options: { value: T; label: ReactNode }[]; className?: string;
}) {
  return (
    <div role="tablist" className={cn("scroll-x inline-flex max-w-full gap-1 rounded-full bg-surface p-1", className)}>
      {options.map((o) => (
        <button key={o.value} type="button" role="tab" aria-selected={value === o.value} onClick={() => onChange(o.value)}
          className={cn("h-8 shrink-0 whitespace-nowrap rounded-full px-3 text-sm font-semibold transition-colors",
            value === o.value ? "bg-ink text-white" : "text-ink-soft hover:text-ink")}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
      className={cn("relative h-6 w-10 shrink-0 rounded-full transition-colors", checked ? "bg-cosmic" : "bg-line")}>
      <span className={cn("absolute left-0 top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform", checked ? "translate-x-[1.125rem]" : "translate-x-0.5")} />
    </button>
  );
}

/** A form's error line, in the interface's voice. */
export function FormError({ message }: { message: string | null }) {
  return message ? <p role="alert" className="mb-3 rounded-control bg-bad-soft px-3 py-2 text-sm text-bad">{message}</p> : null;
}
