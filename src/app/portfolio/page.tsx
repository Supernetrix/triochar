import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PortfolioTable } from "@/components/portfolio-table";
import { getEntries, getTaxonomy } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Portfolio",
  description: "Explore Climate Assets Exchange portfolio projects and carbon credit opportunities.",
  path: "/portfolio/",
});

export default function PortfolioPage() {
  const projects = getEntries("portfolio");
  const taxonomy = getTaxonomy();

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Project Portfolio"
        description="Bankable carbon credit projects with clear ownership, geography, market standards, and credit logic."
      />
      <section className="py-14 md:py-20">
        <div className="container-table">
          {projects.length ? (
            <PortfolioTable projects={projects} taxonomy={taxonomy} />
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
