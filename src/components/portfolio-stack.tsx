"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, Leaf, MapPin, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import type { ContentEntry } from "@/lib/content";

const filterOptions = ["All", "Countries", "CORSIA", "CCP", "ISO", "Region", "CRCF", "Article 6"];

export function PortfolioStack({ projects }: { projects: ContentEntry[] }) {
  const reducedMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState("All");

  const visibleProjects = useMemo(() => {
    if (activeFilter === "All") {
      return projects;
    }

    if (activeFilter === "Countries") {
      return projects.filter((project) => Boolean(project.location));
    }

    const needle = activeFilter.toLowerCase();
    return projects.filter((project) =>
      [
        project.title,
        project.summary,
        project.body,
        project.projectType,
        project.location,
        project.carbonCreditType,
        project.status,
        ...project.tags,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [activeFilter, projects]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      {/* Filter bar */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-pure)] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="eyebrow-plain text-[color:var(--gold)]">Sort and explore</div>
            <p className="mt-1 text-sm font-semibold text-[color:var(--ink)]/72">
              Filter projects by geography, market standard, and credit pathway.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setActiveFilter(option)}
                className={`rounded-full border px-3 py-2 text-[0.65rem] font-bold uppercase tracking-wider transition ${
                  activeFilter === option
                    ? "border-[var(--forest)] bg-[var(--forest)] text-white"
                    : "border-[var(--line)] bg-white text-[color:var(--forest)] hover:border-[var(--mint-2)]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Project cards */}
      {visibleProjects.length ? (
        <div className="flex flex-col gap-8 md:gap-10">
          {visibleProjects.map((project, index) => {
            const isReversed = index % 2 === 1;

            return (
              <motion.div
                key={project.slug}
                initial={reducedMotion ? false : { opacity: 0, y: 32 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  whileHover={reducedMotion ? undefined : { y: -6 }}
                  transition={{ type: "spring", stiffness: 240, damping: 24 }}
                >
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="group block overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface-pure)] shadow-[0_2px_4px_rgba(28,38,32,0.04)] transition-all duration-500 hover:border-[var(--mint-2)] hover:shadow-[0_30px_60px_-32px_rgba(28,38,32,0.45)]"
                  >
                    <div
                      className={`flex flex-col md:flex-row ${
                        isReversed ? "md:flex-row-reverse" : ""
                      }`}
                    >
                      {/* image side */}
                      <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-[var(--mint)] md:aspect-auto md:w-[52%]">
                        {project.image ? (
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--forest-deep)]/35 via-transparent to-transparent" />

                        {/* number badge */}
                        <span className="absolute left-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/95 font-mono text-[12px] font-bold text-[color:var(--forest)] shadow-sm backdrop-blur">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        {/* status floating chip */}
                        {project.status ? (
                          <span className="absolute right-5 top-5 rounded-full bg-[var(--forest)]/92 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                            {project.status}
                          </span>
                        ) : null}
                      </div>

                      {/* content side */}
                      <div className="flex flex-1 flex-col justify-center gap-5 p-7 sm:p-9 md:p-10 lg:p-12">
                        {/* tag chips */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {project.projectType ? (
                            <span className="rounded-full bg-[var(--mint-soft)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[color:var(--forest)]">
                              {project.projectType}
                            </span>
                          ) : null}
                          {project.carbonCreditType ? (
                            <span className="rounded-full border border-[var(--gold)]/35 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[color:var(--gold)]">
                              {project.carbonCreditType}
                            </span>
                          ) : null}
                        </div>

                        {/* title + summary */}
                        <div>
                          <h3 className="font-display text-2xl leading-[1.12] text-[color:var(--ink)] transition-colors group-hover:text-[color:var(--forest-2)] sm:text-3xl md:text-[2rem]">
                            {project.title}
                          </h3>
                          <p className="mt-3 text-sm leading-relaxed text-[color:var(--ink)]/72 md:text-[15px]">
                            {project.summary}
                          </p>
                        </div>

                        {/* stat row — picks first three available facts */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[var(--line)] pt-5 sm:grid-cols-3">
                          {project.location ? (
                            <Fact icon={MapPin} label="Location" value={project.location} />
                          ) : null}
                          {project.projectType ? (
                            <Fact icon={Leaf} label="Pathway" value={project.projectType} />
                          ) : null}
                          {project.carbonCreditType ? (
                            <Fact icon={ShieldCheck} label="Credit" value={project.carbonCreditType} />
                          ) : null}
                          {!project.location && !project.projectType && !project.carbonCreditType ? (
                            <Fact icon={BadgeCheck} label="Status" value={project.status || "Active"} />
                          ) : null}
                        </div>

                        {/* footer row */}
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-widest text-[color:var(--ink)]/50">
                            Project / {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[color:var(--forest-2)] transition-all group-hover:gap-3">
                            View Project
                            <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--mint-soft)] text-[color:var(--forest)] transition-all group-hover:bg-[var(--forest)] group-hover:text-white">
                              <ArrowUpRight size={15} />
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--mint-2)] bg-white/50 p-8 text-center text-sm font-semibold text-[color:var(--ink)]/66">
          No projects currently match {activeFilter}. Add this standard or region in the CMS tags
          to show matching entries.
        </div>
      )}
    </div>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon size={14} className="mt-0.5 shrink-0 text-[color:var(--gold)]" />
      <div className="min-w-0">
        <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-[color:var(--ink)]/45">
          {label}
        </div>
        <div className="mt-0.5 truncate text-[12.5px] font-semibold text-[color:var(--ink)]">
          {value}
        </div>
      </div>
    </div>
  );
}
