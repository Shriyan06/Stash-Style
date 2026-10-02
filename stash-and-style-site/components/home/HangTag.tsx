import { cn } from "@/lib/cn";

/**
 * The brand signature: a cardstock price tag on a string, like the ones jewelry hangs
 * from on a market stall. It swings in on load, swings again on hover, and a small
 * glint twinkles by the price. Decorative: the headline carries the words.
 */
export function HangTag({
  top = "Under",
  amount = "$35",
  bottom = "every piece",
  className,
  stringLength = 64,
  onDark,
}: {
  top?: string;
  amount?: string;
  bottom?: string;
  className?: string;
  stringLength?: number;
  /** Lighter string colour for navy backgrounds. */
  onDark?: boolean;
}) {
  const s = stringLength;
  return (
    <div aria-hidden="true" className={cn("hang-tag select-none", className)}>
      <svg
        width="132"
        height={196 + s}
        viewBox={`0 0 132 ${196 + s}`}
        className="block overflow-visible drop-shadow-[0_14px_22px_rgb(5_12_31/0.35)]"
      >
        {/* string */}
        <path
          d={`M66 0 C 58 ${s * 0.35}, 74 ${s * 0.7}, 66 ${s + 22}`}
          fill="none"
          stroke={onDark ? "#E9DCC0" : "#0F1D3A"}
          strokeOpacity={onDark ? 0.85 : 0.55}
          strokeWidth="1.3"
        />
        {/* tag body: chamfered top, like a classic paper price tag */}
        <path
          d={`M38 ${s + 2} L94 ${s + 2} L124 ${s + 32} L124 ${s + 188} Q124 ${s + 194} 118 ${s + 194} L14 ${s + 194} Q8 ${s + 194} 8 ${s + 188} L8 ${s + 32} Z`}
          fill="#FBF8F1"
          stroke="#C9A35E"
          strokeWidth="1.2"
        />
        {/* reinforced punch hole */}
        <circle cx="66" cy={s + 24} r="7.5" fill="none" stroke="#C9A35E" strokeWidth="2.5" />
        <circle cx="66" cy={s + 24} r="4.2" fill="#0F1D3A" fillOpacity="0.9" />
        <line x1="22" y1={s + 52} x2="110" y2={s + 52} stroke="#E6DCC8" />
        {/* glint */}
        <path
          className="tag-glint"
          d={`M108 ${s + 84} l2.2 6.2 6.2 2.2 -6.2 2.2 -2.2 6.2 -2.2 -6.2 -6.2 -2.2 6.2 -2.2z`}
          fill="#C9A35E"
        />
      </svg>
      <div className="absolute inset-x-0 text-center" style={{ top: s + 62 }}>
        <p className="font-body text-[0.6875rem] font-semibold tracking-[0.22em] text-[#56617A] uppercase">{top}</p>
        <p className="font-display text-[3.4rem] leading-[0.95] font-semibold text-[#0F1D3A]">{amount}</p>
        <p className="mt-1 font-display text-lg text-[#8A6421] italic">{bottom}</p>
      </div>
    </div>
  );
}
