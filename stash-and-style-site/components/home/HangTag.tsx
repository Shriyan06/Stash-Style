import { cn } from "@/lib/cn";

/**
 * The brand signature: a cardstock price tag on a string, like the ones
 * jewelry hangs from on a market stall. Decorative — the headline carries the words.
 */
export function HangTag({
  top = "Under",
  amount = "$35",
  bottom = "every piece",
  className,
  stringLength = 64,
}: {
  top?: string;
  amount?: string;
  bottom?: string;
  className?: string;
  stringLength?: number;
}) {
  const s = stringLength;
  return (
    <div aria-hidden="true" className={cn("hang-tag pointer-events-none select-none", className)}>
      <svg
        width="132"
        height={196 + s}
        viewBox={`0 0 132 ${196 + s}`}
        className="block overflow-visible drop-shadow-[0_10px_18px_rgb(31_27_24/0.18)]"
      >
        {/* string */}
        <path
          d={`M66 0 C 58 ${s * 0.35}, 74 ${s * 0.7}, 66 ${s + 22}`}
          fill="none"
          stroke="#1F1B18"
          strokeOpacity="0.55"
          strokeWidth="1.2"
        />
        {/* tag body: chamfered top, like a classic paper price tag */}
        <path
          d={`M38 ${s + 2} L94 ${s + 2} L124 ${s + 32} L124 ${s + 188} Q124 ${s + 194} 118 ${s + 194} L14 ${s + 194} Q8 ${s + 194} 8 ${s + 188} L8 ${s + 32} Z`}
          fill="#FBF7F2"
          stroke="#B8864B"
          strokeWidth="1"
        />
        {/* reinforced punch hole */}
        <circle cx="66" cy={s + 24} r="7.5" fill="none" stroke="#B8864B" strokeWidth="2.5" />
        <circle cx="66" cy={s + 24} r="4.2" fill="#1F1B18" fillOpacity="0.85" />
        <line x1="22" y1={s + 52} x2="110" y2={s + 52} stroke="#E8DFD5" />
      </svg>
      <div className="absolute inset-x-0 text-center" style={{ top: s + 62 }}>
        <p className="font-body text-[0.6875rem] font-semibold tracking-[0.22em] text-muted uppercase">{top}</p>
        <p className="font-display text-[3.4rem] leading-[0.95] font-semibold text-ink">{amount}</p>
        <p className="mt-1 font-display text-lg text-accent-strong italic">{bottom}</p>
      </div>
    </div>
  );
}
