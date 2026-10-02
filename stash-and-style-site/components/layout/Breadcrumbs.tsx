import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { ChevronIcon } from "@/components/icons";
import { breadcrumbLd } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={it.path} className="flex items-center gap-1">
              {last ? (
                <span aria-current="page" className="text-ink">
                  {it.name}
                </span>
              ) : (
                <>
                  <Link
                    href={it.path}
                    className="inline-flex min-h-11 items-center hover:text-ink hover:underline sm:min-h-0"
                  >
                    {it.name}
                  </Link>
                  <ChevronIcon size={14} aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd data={breadcrumbLd(items)} />
    </nav>
  );
}
