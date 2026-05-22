import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FloatingProjects } from "@/components/floating-projects";
import { JourneySchematic } from "@/components/journey-schematic";
import { Reveal } from "@/components/reveal";

const definitions = [
  {
    n: "01",
    term: "Bankable Credit",
    body: "A credit backed by project economics, documentation, registry readiness, and delivery logic that can stand up to buyer, financier, and stakeholder scrutiny.",
  },
  {
    n: "02",
    term: "Trustworthy",
    body: "Credits sourced through transparent project relationships, clear baselines, measurable impact, and a preference for durable decarbonisation outcomes.",
  },
];

const whoWeAre = [
  { title: "A lean process", text: "No heavy infrastructure — a focused path from intent to credible credits." },
  { title: "Bankable projects", text: "We bring projects backed by documentation, economics, and delivery logic." },
  { title: "Flexible with strategy", text: "Procurement and origination paths shaped around your real climate goals." },
  { title: "Built for net zero", text: "We are here, end to end, to help you reach your decarbonisation goal." },
];

export default function Home() {
  return (
    <>
      {/* 1. Hero + journey schematic */}
      <section className="relative overflow-hidden">
        <div className="container-shell relative pt-12 pb-16 sm:pt-16 md:pt-24 md:pb-24">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <div className="eyebrow-plain text-[0.62rem] sm:text-[0.7rem]">
                Carbon credits with diligence built in
              </div>
            </Reveal>
            <Reveal delay={0.03}>
              <h1 className="font-display mx-auto mt-5 max-w-3xl text-balance text-[2.1rem] leading-[1.08] text-[color:var(--ink)] sm:text-5xl lg:text-[4.4rem] lg:leading-[1.05]">
                We serve your need for{" "}
                <span className="font-display-italic text-[color:var(--forest-2)]">
                  Bankable &amp; Trustworthy
                </span>{" "}
                Carbon Credits
              </h1>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[color:var(--ink)]/72 sm:text-base sm:leading-7">
                Triochar guides companies from first thought to net zero — connecting serious
                buyers with credible, field-led carbon projects.
              </p>
            </Reveal>
            <Reveal delay={0.09}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-3.5">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--forest)] px-7 py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[var(--forest-2)]"
                >
                  Let us Begin
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface-pure)] px-7 py-4 text-xs font-bold uppercase tracking-widest text-[color:var(--ink)] transition hover:border-[var(--mint-2)] hover:bg-[var(--mint-soft)]"
                >
                  View Portfolio
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.04} className="mt-12 sm:mt-14">
            <JourneySchematic />
          </Reveal>
        </div>
      </section>

      {/* 2. Definitions */}
      <section className="section-pad border-t border-[var(--line)]">
        <div className="container-shell">
          <Reveal>
            <div className="max-w-2xl">
              <div className="eyebrow">What we mean</div>
              <h2 className="font-display mt-4 text-balance text-[2rem] leading-[1.1] text-[color:var(--ink)] sm:text-4xl md:text-5xl">
                Two words define every credit we present.
              </h2>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 md:mt-12 lg:grid-cols-2">
            {definitions.map((def, index) => (
              <Reveal key={def.term} delay={index * 0.08}>
                <div className="soft-card flex h-full flex-col rounded-2xl p-7 sm:p-9 md:p-10">
                  <div className="flex items-center justify-between">
                    <span className="font-display grid h-11 w-11 place-items-center rounded-full bg-[var(--mint)] text-base text-[color:var(--forest)]">
                      {def.n}
                    </span>
                    <span className="eyebrow-plain text-[color:var(--gold)]">Definition</span>
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

      {/* 3. Project showcase */}
      <section className="section-pad border-t border-[var(--line)]">
        <div className="container-shell">
          <Reveal>
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <div className="eyebrow">What we work on</div>
                <h2 className="font-display mt-4 text-balance text-[2rem] leading-[1.1] text-[color:var(--ink)] sm:text-4xl md:text-5xl">
                  Field-led carbon projects.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--ink)]/72">
                  Diverse project families — each presented with transparent relationships and
                  credible diligence.
                </p>
              </div>
              <Link
                href="/portfolio"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-pure)] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[color:var(--ink)] transition hover:border-[var(--mint-2)] hover:bg-[var(--mint-soft)]"
              >
                View Portfolio
                <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.06} className="mt-10 md:mt-12">
            <FloatingProjects />
          </Reveal>
        </div>
      </section>

      {/* 4. Who we are */}
      <section className="section-pad border-t border-[var(--line)]">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.82fr_1fr] lg:items-start lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <div className="eyebrow">Who we are</div>
              <h2 className="font-display mt-4 text-balance text-[2.6rem] leading-[1.04] text-[color:var(--ink)] sm:text-5xl md:text-6xl">
                Let us <span className="font-display-italic text-[color:var(--forest-2)]">Begin</span>.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[color:var(--ink)]/72">
                Triochar is a lean, trustworthy partner built around one outcome — getting your
                company to a credible net zero.
              </p>
              <Link
                href="/contact"
                className="mt-7 inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--forest)] px-7 py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[var(--forest-2)]"
              >
                Contact Us
                <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
          <div>
            {whoWeAre.map((item, index) => (
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
