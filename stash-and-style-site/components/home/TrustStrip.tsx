import { LockIcon, ReturnIcon, TagIcon, TruckIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

const items = [
  { Icon: TruckIcon, title: "Free shipping", text: "On every order" },
  { Icon: ReturnIcon, title: "30-day returns", text: "Changed your mind? Send it back" },
  { Icon: LockIcon, title: "Secure checkout", text: "Cards, PayPal, Apple Pay and more" },
  { Icon: TagIcon, title: "Styles under $35", text: "Trend-led, fairly priced" },
];

export function TrustStrip({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <section aria-label="Why shop with us" className={cn("border-y border-line bg-surface", className)}>
      <ul className="container-x grid grid-cols-2 lg:grid-cols-4">
        {items.map(({ Icon, title, text }, i) => (
          <li
            key={title}
            className={cn(
              "flex items-center gap-3 py-5 sm:gap-4",
              compact ? "py-4" : "lg:py-7",
              i % 2 === 1 && "pl-4 sm:pl-6",
              i < 2 && "border-b border-line lg:border-b-0",
              "lg:px-6 lg:first:pl-0",
              i > 0 && "lg:border-l lg:border-line",
            )}
          >
            <Icon size={26} className="shrink-0 text-accent-strong" />
            <div>
              <p className="text-[0.9375rem] leading-tight font-semibold">{title}</p>
              <p className="mt-0.5 hidden text-sm leading-snug text-muted sm:block">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
