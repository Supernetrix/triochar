import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BadgeCheck, Leaf, MapPin, ShieldCheck } from "lucide-react";
import { getEntries, getEntryBySlug } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getEntries("portfolio").map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getEntryBySlug("portfolio", slug);

  if (!project) {
    return {};
  }

  return createPageMetadata({
    title: project.seoTitle || project.title,
    description: project.seoDescription || project.summary,
    path: `/portfolio/${project.slug}/`,
    image: project.image || undefined,
  });
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getEntryBySlug("portfolio", slug);

  if (!project) {
    notFound();
  }

  const stats = [
    { label: "Location", value: project.filterLocations.join(", "), icon: MapPin },
    { label: "Eligibility", value: project.filterEligibility.join(", "), icon: ShieldCheck },
    { label: "Standard", value: project.filterStandards.join(", "), icon: BadgeCheck },
    { label: "Type", value: project.filterTypes.join(", "), icon: Leaf },
    { label: "Status", value: project.status, icon: BadgeCheck },
  ].filter((item) => item.value);
  const projectImage = project.image;
  const projectTags = Array.from(
    new Set(
      [
        ...project.filterLocations,
        ...project.filterEligibility,
        ...project.filterStandards,
        ...project.filterTypes,
        ...project.tags,
      ].filter(Boolean),
    ),
  );

  return (
    <article>
      <section className="relative overflow-hidden border-b border-[var(--line)]">
        <div className="hero-veil pointer-events-none absolute inset-0" aria-hidden />
        <div className="container-shell relative py-16 md:py-18">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[color:var(--ink)]/68 transition-colors hover:text-[color:var(--gold)]"
          >
            <ArrowLeft size={15} />
            Back to Portfolio
          </Link>
          <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_0.74fr] lg:items-end">
            <div>
              <div className="eyebrow">Portfolio Project</div>
              <h1 className="font-display mt-5 text-balance text-4xl leading-[1.06] text-[color:var(--ink)] md:text-6xl">
                {project.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-[color:var(--ink)]/72">
                {project.summary}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4"
                  >
                    <Icon className="mb-2.5 text-[color:var(--gold)]" size={17} />
                    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--ink)]/62">
                      {stat.label}
                    </div>
                    <div className="mt-1.5 text-xs font-bold text-[color:var(--ink)]">{stat.value}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {projectImage ? (
        <div className="container-shell -mt-10">
          <div className="relative aspect-[16/7] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--mint)] shadow-[0_24px_60px_-30px_rgba(28,38,32,0.5)]">
            <Image src={projectImage} alt={project.title} fill loading="eager" sizes="100vw" className="object-cover" />
          </div>
        </div>
      ) : null}

      <section className="section-pad">
        <div className="container-shell grid gap-10 lg:grid-cols-[minmax(0,760px)_1fr]">
          <div className="cms-body soft-card rounded-2xl p-7 md:p-10">
            <div dangerouslySetInnerHTML={{ __html: project.html || "" }} />
          </div>
          <aside className="soft-card h-fit rounded-2xl p-5">
            <h2 className="font-display border-b border-[var(--line)] pb-3 text-base text-[color:var(--ink)]">
              Project Tags
            </h2>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {projectTags.map((tag) => (
                <span
                  key={tag}
                  className="whitespace-nowrap rounded-full bg-[var(--mint)] px-3 py-1.5 text-[11px] font-bold leading-none tracking-[0.08em] text-[color:var(--forest)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href="/contact"
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--forest)] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--forest-2)]"
              aria-label="Discuss this project"
            >
              <span className="whitespace-nowrap">Discuss Project</span>
              <ArrowUpRight size={14} />
            </Link>
          </aside>
        </div>
      </section>
    </article>
  );
}
