import Link from "next/link";
import { faqs } from "@/content/faq";
import { needsReplace } from "@/content/marker";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/JsonLd";
import { MarkedText } from "@/components/MarkedText";

export const metadata = pageMetadata({
  title: "FAQ",
  description: "Answers about shipping, returns, sizing, care and payments.",
  path: "/faq",
});

export default function FaqPage() {
  const answered = faqs.flatMap((g) => g.items).filter((f) => !needsReplace(f.a));
  return (
    <div className="container-x pt-6 pb-20 lg:pt-8">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ]}
      />
      <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-[16rem_1fr] lg:gap-20">
        <div>
          <h1 className="font-display text-h1">Questions, answered</h1>
          <nav aria-label="FAQ topics" className="mt-6 lg:sticky lg:top-24">
            <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-0">
              {faqs.map((g) => (
                <li key={g.id}>
                  <a
                    href={`#${g.id}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-4 text-sm hover:border-ink lg:rounded-none lg:border-0 lg:px-0 lg:text-[0.9375rem] lg:hover:underline"
                  >
                    {g.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="max-w-3xl space-y-12">
          {faqs.map((g) => (
            <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`}>
              <h2 id={`${g.id}-title`} className="mb-4 font-display text-h2">
                {g.title}
              </h2>
              <Accordion>
                {g.items.map((f) => (
                  <AccordionItem key={f.q} title={f.q}>
                    <p>
                      <MarkedText>{f.a}</MarkedText>
                    </p>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
          <p className="text-muted">
            Still stuck?{" "}
            <Link href="/contact" className="text-ink underline underline-offset-4">
              Get in touch
            </Link>
            .
          </p>
        </div>
      </div>
      {answered.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: answered.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }}
        />
      )}
    </div>
  );
}
