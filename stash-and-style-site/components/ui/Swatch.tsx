import { swatchColor } from "@/lib/format";
import { cn } from "@/lib/cn";

/** Decorative colour dot. Name is provided by the surrounding control/label. */
export function SwatchDot({ name, size = 14, className }: { name: string; size?: number; className?: string }) {
  const color = swatchColor(name);
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block shrink-0 rounded-full ring-1 ring-ink/15 ring-inset", className)}
      style={{ width: size, height: size, background: color }}
    />
  );
}

export function SwatchRow({ colors, max = 5 }: { colors: string[]; max?: number }) {
  if (colors.length < 2) return null;
  const shown = colors.slice(0, max);
  const more = colors.length - shown.length;
  return (
    <p className="flex items-center gap-1.5">
      <span className="sr-only">Available in {colors.join(", ")}</span>
      {shown.map((c) => (
        <SwatchDot key={c} name={c} size={12} />
      ))}
      {more > 0 && (
        <span aria-hidden="true" className="text-xs text-muted">
          +{more}
        </span>
      )}
    </p>
  );
}
