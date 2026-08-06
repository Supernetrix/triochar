import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JourneySchematic } from "@/components/journey-schematic";
import { PortfolioTable } from "@/components/portfolio-table";
import { Reveal } from "@/components/reveal";
import { getEntries, getTaxonomy } from "@/lib/content";
import { getHomeContent } from "@/lib/home-content";

export default async function Home() {
  const content = await getHomeContent();
  const projects = getEntries("portfolio");
  const taxonomy = getTaxonomy();

  return (
    <>
      {/* 1. Hero + journey schematic */}
      <section className="relative overflow-hidden">
        <div className="container-shell relative pt-12 pb-16 sm:pt-16 md:pt-24 md:pb-24">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <div className="eyebrow-plain text-[0.62rem] sm:text-[0.7rem]">
                {content.hero.eyebrow}
              </div>
            </Reveal>
            <Reveal delay={0.03}>
              <h1 className="font-display mx-auto mt-5 max-w-3xl text-balance text-[2.1rem] leading-[1.08] text-[color:var(--ink)] sm:text-5xl lg:text-[4.4rem] lg:leading-[1.05]">
                {content.hero.titleStart}{" "}
                <span className="font-display-italic text-[color:var(--forest-2)]">
                  {content.hero.titleEmphasis}
                </span>{" "}
                {content.hero.titleEnd}
              </h1>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[color:var(--ink)]/72 sm:text-base sm:leading-7">
                {content.hero.caption}
              </p>
            </Reveal>
            <Reveal delay={0.09}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-3.5">
                <Link
                  href={content.hero.primaryCtaHref}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--forest)] px-7 py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[var(--forest-2)]"
                >
                  {content.hero.primaryCtaLabel}
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href={content.hero.secondaryCtaHref}
                  className="inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface-pure)] px-7 py-4 text-xs font-bold uppercase tracking-widest text-[color:var(--ink)] transition hover:border-[var(--mint-2)] hover:bg-[var(--mint-soft)]"
                >
                  {content.hero.secondaryCtaLabel}
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.04} className="mt-12 sm:mt-14">
            <JourneySchematic content={content.journey} />
          </Reveal>
        </div>
      </section>

      {/* 2. Portfolio */}
      <section aria-labelledby="homepage-portfolio-heading" className="section-pad border-t border-[var(--line)]">
        <div className="container-table">
          <h2 id="homepage-portfolio-heading" className="sr-only">
            Project Portfolio
          </h2>
          {projects.length ? (
            <PortfolioTable projects={projects} taxonomy={taxonomy} />
          ) : (
            <div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-[var(--mint-2)] bg-white/50 p-10 text-center text-sm font-medium text-[color:var(--ink)]/66">
              New portfolio projects will appear here once published.
            </div>
          )}
        </div>
      </section>

      {/* 3. Definitions */}
      <section className="section-pad border-t border-[var(--line)]">
        <div className="container-shell">
          <Reveal>
            <div className="max-w-2xl">
                <div className="eyebrow">{content.definitionsIntro.eyebrow}</div>
              <h2 className="font-display mt-4 text-balance text-[2rem] leading-[1.1] text-[color:var(--ink)] sm:text-4xl md:text-5xl">
                {content.definitionsIntro.heading}
              </h2>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 md:mt-12 lg:grid-cols-2">
            {content.definitions.map((def, index) => (
              <Reveal key={def.term} delay={index * 0.08}>
                <div className="soft-card flex h-full flex-col rounded-2xl p-7 sm:p-9 md:p-10">
                  <div className="flex items-center justify-between">
                    <span className="font-display grid h-11 w-11 place-items-center rounded-full bg-[var(--mint)] text-base text-[color:var(--forest)]">
                      {def.n}
                    </span>
                  </div>
                  <h3 className="font-display mt-6 text-[1.7rem] text-[color:var(--ink)] sm:text-3xl">
                    {def.term}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-[color:var(--ink)]/78">
                    {def.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Who we are */}
      <section className="section-pad border-t border-[var(--line)]">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.82fr_1fr] lg:items-start lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-28">
                <div className="eyebrow">{content.who.eyebrow}</div>
              <h2 className="font-display mt-4 text-balance text-[2.6rem] leading-[1.04] text-[color:var(--ink)] sm:text-5xl md:text-6xl">
                {content.who.headingStart} <span className="font-display-italic text-[color:var(--forest-2)]">{content.who.headingEmphasis}</span>.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[color:var(--ink)]/72">
                {content.who.intro}
              </p>
              <Link
                href={content.who.ctaHref}
                className="mt-7 inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--forest)] px-7 py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[var(--forest-2)]"
              >
                {content.who.ctaLabel}
                <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
          <div>
            {content.who.values.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.07}>
                <div className="flex gap-5 border-b border-[var(--line)] py-6 first:pt-0 sm:gap-6 sm:py-7">
                  <span className="font-display mt-0.5 text-lg text-[color:var(--gold)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-lg text-[color:var(--ink)] sm:text-xl">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--ink)]/72">
                      {item.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
