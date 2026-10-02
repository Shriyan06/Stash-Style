import { cn } from "@/lib/cn";

type Tone = "new" | "sale" | "soldout" | "demo";

const tones: Record<Tone, string> = {
  new: "bg-sage text-ink",
  sale: "bg-danger text-surface",
  soldout: "bg-surface text-muted border border-line",
  demo: "bg-ink text-surface",
};

export function Badge({ tone, children, className }: { tone: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full px-2.5 text-[0.6875rem] font-semibold tracking-[0.08em] uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
