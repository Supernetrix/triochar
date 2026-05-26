import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PortfolioStack } from "@/components/portfolio-stack";
import { getEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Explore Triochar portfolio projects and carbon credit opportunities.",
};

export default function PortfolioPage() {
  const projects = getEntries("portfolio");

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Project Portfolio"
        description="Bankable carbon credit projects with clear ownership, geography, market standards, and credit logic."
      />
      <section className="py-14 md:py-20">
        <div className="container-shell">
          {projects.length ? (
            <PortfolioStack projects={projects} />
          ) : (
            <div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-[var(--mint-2)] bg-white/50 p-10 text-center text-sm font-medium text-[color:var(--ink)]/66">
              New portfolio projects will appear here once published.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
