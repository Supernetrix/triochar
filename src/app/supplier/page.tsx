import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Supplier",
  description: "Supplier pathway for carbon credit projects on Triochar.",
};

const steps = [
  {
    title: "Project discovery",
    text: "We understand the project area, ownership structure, technology or nature pathway, and the supply story behind the credits.",
  },
  {
    title: "Readiness mapping",
    text: "Documentation, baseline logic, monitoring approach, registry pathway, and delivery risk are organised into a buyer-ready format.",
  },
  {
    title: "Trust package",
    text: "The project is framed around bankability, transparency, and the evidence buyers need before serious procurement discussions.",
  },
  {
    title: "Buyer engagement",
    text: "Triochar positions the project for serious buyer conversations and flexible commercial structures.",
  },
];

export default function SupplierPage() {
  return (
    <>
      <PageHero
        eyebrow="Supplier"
        title="Bring credible carbon supply to serious buyers."
        description="From suppliers, we gather the right project material, shape the project and story, and prepare the trust layer buyers expect."
      />

      <section className="py-16 md:py-20">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.82fr_1fr] lg:items-start lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <div className="eyebrow">Supplier Journey</div>
              <h2 className="font-display mt-5 text-balance text-4xl leading-[1.05] text-[color:var(--ink)] md:text-5xl">
                From project potential to{" "}
                <span className="font-display-italic text-[color:var(--forest-2)]">market-ready</span>{" "}
                proof.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-[color:var(--ink)]/72">
                From suppliers, we gather the right project material, shape the project and story,
                and prepare the trust layer buyers expect.
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
                Supplier engagement can begin with a simple project conversation.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[color:var(--ink)]/65">
                Share what exists today — location, project type, crediting status, community
                context, and the commercial outcome you want to reach.
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
