import { cn } from "@/lib/cn";
import { PlusIcon } from "@/components/icons";

/**
 * Accessible, zero-JS accordion item built on <details>/<summary>.
 * Keyboard: Tab to the summary, Enter/Space toggles. Screen readers announce expanded state.
 */
export function AccordionItem({
  title,
  children,
  defaultOpen,
  className,
  id,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <details className={cn("group/acc border-b border-line", className)} open={defaultOpen} id={id}>
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4">
        <span className="text-base leading-snug font-medium">{title}</span>
        <PlusIcon size={18} className="shrink-0 transition-transform duration-200 group-open/acc:rotate-45" />
      </summary>
      <div className="pb-6 text-muted">{children}</div>
    </details>
  );
}

export function Accordion({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("border-t border-line", className)}>{children}</div>;
}
