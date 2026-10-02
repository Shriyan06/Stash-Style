import Link from "next/link";
import { notFound } from "next/navigation";
import { getPolicy, policies } from "@/content/policies";
import { footerPolicies } from "@/config/nav";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MarkedText } from "@/components/MarkedText";
import { cn } from "@/lib/cn";

export const dynamicParams = false;

export function generateStaticParams() {
  return policies.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: PageProps<"/policies/[handle]">) {
  const { handle } = await params;
  const p = getPolicy(handle);
  return p ? pageMetadata({ title: p.title, description: p.summary, path: `/policies/${handle}` }) : {};
}

export default async function PolicyPage({ params }: PageProps<"/policies/[handle]">) {
  const { handle } = await params;
  const policy = getPolicy(handle);
  if (!policy) notFound();
  return (
    <div className="container-x pt-6 pb-20 lg:pt-8">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: policy.title, path: `/policies/${handle}` },
        ]}
      />
      <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-[15rem_1fr] lg:gap-20">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="On this page">
            <p className="eyebrow text-muted">On this page</p>
            <ol className="mt-3 space-y-0.5 border-l border-line">
              {policy.sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="-ml-px flex min-h-10 items-center border-l border-transparent pl-4 text-sm text-muted hover:border-ink hover:text-ink"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <nav aria-label="Other policies" className="mt-8 hidden lg:block">
            <p className="eyebrow text-muted">Policies</p>
            <ul className="mt-3 space-y-1">
              {footerPolicies.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={l.href.endsWith(handle) ? "page" : undefined}
                    className={cn("text-sm hover:underline", l.href.endsWith(handle) ? "font-semibold" : "text-muted")}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <article className="prose-s">
          <h1 className="font-display text-h1">{policy.title}</h1>
          <p className="text-lg text-muted">{policy.summary}</p>
          <p className="text-sm text-muted">
            Last updated: <MarkedText>{policy.updated}</MarkedText>
          </p>
          {policy.sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`}>
              <h2 id={`${s.id}-h`}>{s.title}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-3">
                  <MarkedText>{p}</MarkedText>
                </p>
              ))}
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}
