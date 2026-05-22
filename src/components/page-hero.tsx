import { Reveal } from "@/components/reveal";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--line)]">
      <div className="hero-veil pointer-events-none absolute inset-0" aria-hidden />
      <div className="container-shell relative py-12 sm:py-14 md:py-16">
        <Reveal>
          <div className="eyebrow">{eyebrow}</div>
          <h1 className="font-display mt-5 max-w-3xl text-balance text-[2.5rem] leading-[1.05] text-[color:var(--ink)] sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[color:var(--ink)]/72 sm:text-base">
            {description}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
