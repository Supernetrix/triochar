"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, Check, ChevronDown, Leaf, MapPin, ShieldCheck, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ContentEntry, Taxonomy } from "@/lib/content";

type FilterField = "filterLocations" | "filterEligibility" | "filterStandards" | "filterTypes";

const filterGroups: Array<{ key: string; label: string; taxonomyKey: keyof Taxonomy; field: FilterField }> = [
  { key: "location", label: "Location", taxonomyKey: "locationOptions", field: "filterLocations" },
  { key: "eligibility", label: "Eligibility", taxonomyKey: "eligibilityOptions", field: "filterEligibility" },
  { key: "standard", label: "Standard", taxonomyKey: "standardOptions", field: "filterStandards" },
  { key: "type", label: "Type", taxonomyKey: "typeOptions", field: "filterTypes" },
];

export function PortfolioStack({ projects, taxonomy }: { projects: ContentEntry[]; taxonomy: Taxonomy }) {
  const reducedMotion = useReducedMotion();
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);

  const activeGroups = useMemo(
    () => filterGroups.filter((group) => taxonomy[group.taxonomyKey].length > 0),
    [taxonomy],
  );

  const hasSelection = useMemo(
    () => Object.values(selected).some((values) => values.length > 0),
    [selected],
  );

  // Close any open dropdown when clicking outside the filter bar or pressing Escape.
  useEffect(() => {
    if (!openGroup) {
      return;
    }

    function handlePointer(event: MouseEvent) {
      if (filterBarRef.current && !filterBarRef.current.contains(event.target as Node)) {
        setOpenGroup(null);
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenGroup(null);
      }
    }

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [openGroup]);

  function toggleOption(groupKey: string, option: string) {
    setSelected((current) => {
      const currentValues = current[groupKey] || [];
      const nextValues = currentValues.includes(option)
        ? currentValues.filter((value) => value !== option)
        : [...currentValues, option];

      return { ...current, [groupKey]: nextValues };
    });
  }

  const visibleProjects = useMemo(() => {
    if (!hasSelection) {
      return projects;
    }

    return projects.filter((project) =>
      filterGroups.every((group) => {
        const chosen = selected[group.key] || [];

        if (chosen.length === 0) {
          return true;
        }

        const projectValues = project[group.field];
        return chosen.some((value) => projectValues.includes(value));
      }),
    );
  }, [hasSelection, projects, selected]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      {/* Filter bar */}
      <div
        ref={filterBarRef}
        className="rounded-2xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 sm:p-5"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="shrink-0">
            <div className="eyebrow-plain text-[color:var(--gold)]">Sort and explore</div>
            <p className="mt-1 text-sm font-semibold text-[color:var(--ink)]/72">
              Filter projects by location, eligibility, standard, and project type.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeGroups.map((group) => {
              const chosen = selected[group.key] || [];
              const isOpen = openGroup === group.key;
              const count = chosen.length;

              return (
                <div key={group.key} className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenGroup(isOpen ? null : group.key)}
                    aria-expanded={isOpen}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                      count > 0
                        ? "border-[var(--forest)] bg-[var(--forest)] text-white"
                        : "border-[var(--line)] bg-white text-[color:var(--forest)] hover:border-[var(--mint-2)]"
                    }`}
                  >
                    {group.label}
                    {count > 0 ? (
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white/25 px-1 text-[10px] font-bold text-white">
                        {count}
                      </span>
                    ) : null}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen ? (
                    <div className="absolute left-0 top-[calc(100%+0.5rem)] z-30 w-60 overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[0_24px_60px_-28px_rgba(28,38,32,0.5)]">
                      <div className="max-h-72 overflow-auto p-1.5">
                        {taxonomy[group.taxonomyKey].map((option) => {
                          const isActive = chosen.includes(option);

                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => toggleOption(group.key, option)}
                              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold text-[color:var(--ink)] transition hover:bg-[var(--mint-soft)]"
                            >
                              <span
                                className={`grid h-4 w-4 shrink-0 place-items-center rounded border transition ${
                                  isActive
                                    ? "border-[var(--forest)] bg-[var(--forest)] text-white"
                                    : "border-[var(--line)] bg-white"
                                }`}
                              >
                                {isActive ? <Check size={11} strokeWidth={3} /> : null}
                              </span>
                              {option}
                            </button>
                          );
                        })}
                      </div>
                      {count > 0 ? (
                        <button
                          type="button"
                          onClick={() => setSelected((current) => ({ ...current, [group.key]: [] }))}
                          className="w-full border-t border-[var(--line)] px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-[color:var(--ink)]/55 transition hover:bg-[var(--mint-soft)] hover:text-[color:var(--forest)]"
                        >
                          Clear {group.label}
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}

            {hasSelection ? (
              <button
                type="button"
                onClick={() => {
                  setSelected({});
                  setOpenGroup(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[color:var(--ink)]/55 transition hover:text-[color:var(--forest)]"
              >
                <X size={13} />
                Clear all
              </button>
            ) : null}
          </div>
        </div>

        {/* Selected chips summary */}
        {hasSelection ? (
          <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[var(--line)] pt-4">
            {activeGroups.flatMap((group) =>
              (selected[group.key] || []).map((option) => (
                <button
                  key={`${group.key}:${option}`}
                  type="button"
                  onClick={() => toggleOption(group.key, option)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--mint-soft)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[color:var(--forest)] transition hover:bg-[var(--mint-2)]"
                >
                  {option}
                  <X size={11} />
                </button>
              )),
            )}
          </div>
        ) : null}
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

                        {/* status floating chip */}
                        {project.status ? (
                          <span className="absolute right-5 top-5 rounded-full bg-[var(--forest)]/92 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                            {project.status}
                          </span>
                        ) : null}
                      </div>

                      {/* content side */}
                      <div className="flex flex-1 flex-col justify-center gap-5 p-7 sm:p-9 md:p-10 lg:p-12">
                        {/* category chips */}
                        {(() => {
                          const chips = [
                            ...project.filterLocations,
                            ...project.filterEligibility,
                            ...project.filterStandards,
                            ...project.filterTypes,
                          ];

                          return chips.length ? (
                            <div className="flex flex-wrap items-center gap-1.5">
                              {chips.map((chip) => (
                                <span
                                  key={chip}
                                  className="rounded-full bg-[var(--mint-soft)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[color:var(--forest)]"
                                >
                                  {chip}
                                </span>
                              ))}
                            </div>
                          ) : null;
                        })()}

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
                          {project.filterLocations.length ? (
                            <Fact icon={MapPin} label="Location" value={project.filterLocations.join(", ")} />
                          ) : null}
                          {project.filterStandards.length ? (
                            <Fact icon={ShieldCheck} label="Standard" value={project.filterStandards.join(", ")} />
                          ) : null}
                          {project.filterTypes.length ? (
                            <Fact icon={Leaf} label="Type" value={project.filterTypes.join(", ")} />
                          ) : null}
                          {!project.filterLocations.length &&
                          !project.filterStandards.length &&
                          !project.filterTypes.length ? (
                            <Fact icon={BadgeCheck} label="Status" value={project.status || "Active"} />
                          ) : null}
                        </div>

                        {/* footer row */}
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-widest text-[color:var(--ink)]/50">
                            {project.registryId || "Registry ID TBC"}
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
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-[var(--mint-2)] bg-white/50 p-10 text-center">
          <p className="text-sm font-semibold text-[color:var(--ink)]/70">
            No projects match your selected filters. Try removing a filter or adjusting your selection.
          </p>
          {hasSelection ? (
            <button
              type="button"
              onClick={() => {
                setSelected({});
                setOpenGroup(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--forest)] bg-[var(--forest)] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[var(--forest-2)]"
            >
              <X size={13} />
              Clear all filters
            </button>
          ) : null}
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
