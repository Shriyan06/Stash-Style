import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { brandImage } from "@/lib/brand";
import { HangTag } from "./HangTag";

export function Hero() {
  const img = brandImage("hero");
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-blush">
      {img && (
        <Image
          src={img.src}
          alt={img.alt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          placeholder="blur"
          blurDataURL={img.blurDataURL}
          className="-z-20 object-cover object-[70%_center]"
        />
      )}
      {/* Cream scrim keeps ink text at AA contrast over any photo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(251_247_242/0.97)_0%,rgb(251_247_242/0.9)_42%,rgb(251_247_242/0)_78%)] md:bg-[linear-gradient(to_right,rgb(251_247_242/0.96)_0%,rgb(251_247_242/0.88)_38%,rgb(251_247_242/0)_68%)]"
      />

      <div className="container-x relative flex min-h-[min(84svh,46rem)] items-end pt-40 pb-12 md:min-h-[min(80svh,48rem)] md:items-center md:py-24">
        <div className="max-w-[36rem]">
          <p className="eyebrow text-accent-strong">Rings · Necklaces · Earrings · Bracelets</p>
          <h1 id="hero-title" className="mt-4 font-display text-display">
            Everyday jewelry, <em className="font-medium text-accent-strong">under&nbsp;$35.</em>
          </h1>
          <p className="mt-5 max-w-[30rem] text-[1.0625rem] sm:text-lg">
            Rings, necklaces, earrings and bracelets in gold-tone and silver-tone — free shipping and 30-day returns.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/collections/all?sort=newest">Shop new arrivals</ButtonLink>
            <ButtonLink href="/collections" variant="secondary" className="bg-bg/60 backdrop-blur-sm">
              Browse collections
            </ButtonLink>
          </div>
        </div>

        <HangTag
          className="absolute top-0 right-5 origin-top scale-[0.62] sm:right-10 sm:scale-75 md:right-[8%] lg:right-[14%] lg:scale-100"
          stringLength={72}
        />
      </div>
    </section>
  );
}
