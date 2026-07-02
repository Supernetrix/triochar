import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Buyer",
  description: "Buyer pathway for trusted carbon credit acquisition through Climate Assets Exchange.",
};

const steps = [
  {
    title: "Define need",
    text: "Clarify decarbonisation goals, offsetting requirements, budget range, geography, timing, and internal approval needs.",
  },
  {
    title: "Screen projects",
    text: "Compare project types, credit characteristics, local context, and risk posture through a clean buyer-facing portfolio.",
  },
  {
    title: "Evaluate confidence",
    text: "Review project information, bankability signals, expected impact, and practical questions before advancing procurement.",
  },
  {
    title: "Shape acquisition",
    text: "Move toward purchasing, offtake, or strategic engagement with a structure aligned to your climate strategy.",
  },
];

export default function BuyerPage() {
  return (
    <>
      <PageHero
        eyebrow="Buyer"
        title="Acquire carbon credits with clarity and confidence."
        description="For buyers we prioritize trust, project fit, and procurement readiness, keeping the process lean and flexible."
      />

      <section className="py-16 md:py-20">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.82fr_1fr] lg:items-start lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <div className="eyebrow">Buyer Journey</div>
              <h2 className="font-display mt-5 text-balance text-4xl leading-[1.05] text-[color:var(--ink)] md:text-5xl">
                From climate intent to{" "}
                <span className="font-display-italic text-[color:var(--forest-2)]">credit selection</span>.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-[color:var(--ink)]/72">
                For buyers we prioritize trust, project fit, and procurement readiness, keeping the
                process lean and flexible.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--forest)] px-7 py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[var(--forest-2)]"
              >
                Contact Us
                <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>

          <div>
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.07}>
                <div className="flex gap-5 border-b border-[var(--line)] py-6 first:pt-0 sm:gap-6">
                  <span className="font-display mt-0.5 text-lg text-[color:var(--gold)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl text-[color:var(--ink)]">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--ink)]/72">{step.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-shell">
          <Reveal>
            <div className="soft-card overflow-hidden rounded-2xl p-7 sm:p-9 md:p-12">
              <h2 className="font-display max-w-3xl text-balance text-3xl leading-[1.12] text-[color:var(--ink)] md:text-4xl">
                The right carbon credit conversation starts before the purchase.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[color:var(--ink)]/65">
                Climate Assets Exchange helps buyers understand project fit, trust signals, and
                strategic options before moving to transaction steps.
              </p>
              <Link
                href="/contact"
                className="mt-7 inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--forest)] px-7 py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[var(--forest-2)]"
              >
                Start the Conversation
                <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
