"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ContentEntry, Taxonomy } from "@/lib/content";
import { getProjectIcon } from "@/lib/project-icons";
import { isProjectStatus, PROJECT_STATUS_OPTIONS } from "@/lib/project-status";

type FilterGroup = {
  key: string;
  label: string;
  options: string[];
  projectValues: (project: ContentEntry) => string[];
};

const columns = [
  { label: "Icon", className: "w-[68px]" },
  { label: "Status", className: "w-[76px]" },
  { label: "Pathway", className: "w-[120px]" },
  { label: "Project name", className: "w-[190px]" },
  { label: "Location", className: "w-[95px]" },
  { label: "Permanence", className: "w-[100px]" },
  { label: "Eligibility", className: "w-[115px]" },
  { label: "Number of Credits", className: "w-[130px] text-right" },
  { label: "Price per Credit", className: "w-[126px] text-right" },
];

function displayList(values: string[]) {
  return values.length ? values.join(", ") : "—";
}

export function PortfolioTable({ projects, taxonomy }: { projects: ContentEntry[]; taxonomy: Taxonomy }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);

  const filterGroups = useMemo<FilterGroup[]>(
    () => [
      {
        key: "status",
        label: "Status",
        options: [...PROJECT_STATUS_OPTIONS],
        projectValues: (project) => (isProjectStatus(project.status) ? [project.status] : []),
      },
      {
        key: "location",
        label: "Location",
        options: taxonomy.locationOptions,
        projectValues: (project) => project.filterLocations,
      },
      {
        key: "eligibility",
        label: "Eligibility",
        options: taxonomy.eligibilityOptions,
        projectValues: (project) => project.filterEligibility,
      },
      {
        key: "standard",
        label: "Standard",
        options: taxonomy.standardOptions,
        projectValues: (project) => project.filterStandards,
      },
      {
        key: "pathway",
        label: "Pathway",
        options: taxonomy.typeOptions,
        projectValues: (project) => project.filterTypes,
      },
    ],
    [taxonomy],
  );
  const activeGroups = useMemo(() => filterGroups.filter((group) => group.options.length > 0), [filterGroups]);
  const hasSelection = useMemo(
    () => Object.values(selected).some((values) => values.length > 0),
    [selected],
  );

  useEffect(() => {
    if (!openGroup) {
      return;
    }

    function closeOnOutsideClick(event: MouseEvent) {
      if (filterBarRef.current && !filterBarRef.current.contains(event.target as Node)) {
        setOpenGroup(null);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenGroup(null);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openGroup]);

  function toggleOption(groupKey: string, option: string) {
    setSelected((current) => {
      const currentValues = current[groupKey] || [];
      const values = currentValues.includes(option)
        ? currentValues.filter((value) => value !== option)
        : [...currentValues, option];

      return { ...current, [groupKey]: values };
    });
  }

  const visibleProjects = useMemo(() => {
    if (!hasSelection) {
      return projects;
    }

    return projects.filter((project) =>
      filterGroups.every((group) => {
        const chosen = selected[group.key] || [];
        const projectValues = group.projectValues(project);

        return chosen.length === 0 || chosen.some((value) => projectValues.includes(value));
      }),
    );
  }, [filterGroups, hasSelection, projects, selected]);

  return (
    <div className="mx-auto flex flex-col gap-5">
      <div
        ref={filterBarRef}
        className="rounded-2xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-[0_18px_44px_-36px_rgba(28,38,32,0.45)] sm:p-5"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--mint-soft)] text-[color:var(--forest)]">
              <SlidersHorizontal size={17} />
            </span>
            <div>
              <p className="text-sm font-bold text-[color:var(--ink)]">Filter portfolio</p>
              <p className="mt-0.5 text-xs font-medium text-[color:var(--ink)]/55">
                Narrow the table by project attributes.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeGroups.map((group) => {
              const chosen = selected[group.key] || [];
              const isOpen = openGroup === group.key;

              return (
                <div key={group.key} className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenGroup(isOpen ? null : group.key)}
                    aria-expanded={isOpen}
                    className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.1em] transition ${
                      chosen.length
                        ? "border-[var(--forest)] bg-[var(--forest)] text-white"
                        : "border-[var(--line)] bg-white text-[color:var(--forest)] hover:border-[var(--mint-2)]"
                    }`}
                  >
                    {group.label}
                    {chosen.length ? (
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white/20 px-1 text-[10px]">
                        {chosen.length}
                      </span>
                    ) : null}
                    <ChevronDown size={13} className={isOpen ? "rotate-180 transition" : "transition"} />
                  </button>

                  {isOpen ? (
                    <div className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-60 overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[0_24px_60px_-28px_rgba(28,38,32,0.5)] sm:left-0 sm:right-auto">
                      <div className="max-h-72 overflow-auto p-1.5">
                        {group.options.map((option) => {
                          const isActive = chosen.includes(option);

                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => toggleOption(group.key, option)}
                              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold text-[color:var(--ink)] transition hover:bg-[var(--mint-soft)]"
                            >
                              <span
                                className={`grid h-4 w-4 shrink-0 place-items-center rounded border ${
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
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[color:var(--ink)]/55 transition hover:text-[color:var(--forest)]"
              >
                <X size={13} />
                Clear
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 px-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--ink)]/55" aria-live="polite">
          {visibleProjects.length} project{visibleProjects.length === 1 ? "" : "s"}
        </p>
        <p className="text-[11px] font-semibold text-[color:var(--ink)]/45 md:hidden">Swipe to view all columns</p>
      </div>

      {visibleProjects.length ? (
        <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[0_24px_54px_-42px_rgba(28,38,32,0.5)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px] table-fixed border-collapse text-left">
              <thead className="bg-[#dcebcf] text-[color:var(--forest-deep)]">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.label}
                      scope="col"
                      className={`${column.className} border-b border-r border-[color:var(--forest)]/10 px-3 py-3.5 text-[11px] font-extrabold uppercase leading-snug tracking-[0.08em] last:border-r-0`}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleProjects.map((project) => {
                  const icon = getProjectIcon(project.projectIcon);
                  const href = `/portfolio/${project.slug}`;
                  const values = [
                    isProjectStatus(project.status) ? project.status : "—",
                    project.projectType || displayList(project.filterTypes),
                    project.title,
                    project.location || displayList(project.filterLocations),
                    project.permanence || "—",
                    displayList(project.filterEligibility),
                    project.numberOfCredits || "—",
                    project.pricePerCredit || "—",
                  ];

                  return (
                    <tr
                      key={project.slug}
                      className="group border-b border-[var(--line-soft)] bg-white align-middle transition-colors last:border-b-0 hover:bg-[#f5faef] focus-within:bg-[#f5faef]"
                    >
                      <td
                        onClick={() => router.push(href)}
                        className="cursor-pointer border-r border-[var(--line-soft)] p-0"
                      >
                        <div className="flex min-h-[82px] items-center justify-center border-l-[3px] border-l-transparent px-2 py-2 transition-colors group-hover:border-l-[var(--gold)]">
                          {icon ? (
                            <span className="relative h-12 w-12 overflow-hidden rounded-full border border-[color:var(--forest)]/10 bg-[var(--mint-soft)] shadow-[0_5px_14px_-10px_rgba(28,38,32,0.7)]">
                              <Image src={icon.src} alt="" fill sizes="48px" className="object-cover" />
                            </span>
                          ) : (
                            <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--mint-soft)] text-xs font-black text-[color:var(--forest)]">
                              CA
                            </span>
                          )}
                        </div>
                      </td>
                      {values.map((value, index) => {
                        const isProjectName = index === 2;
                        const isNumericValue = index >= values.length - 2;
                        const cellClass = `flex min-h-[82px] items-center px-3 py-3 text-[13px] leading-[1.45] text-[color:var(--ink)] ${
                          isProjectName ? "justify-between gap-3 font-extrabold" : "font-semibold text-[color:var(--ink)]/75"
                        } ${isNumericValue ? "justify-end text-right tabular-nums" : ""}`;

                        return (
                          <td
                            key={`${project.slug}:${columns[index + 1].label}`}
                            onClick={isProjectName ? undefined : () => router.push(href)}
                            className={`border-r border-[var(--line-soft)] p-0 last:border-r-0 ${isProjectName ? "" : "cursor-pointer"}`}
                          >
                            {isProjectName ? (
                              <Link
                                href={href}
                                className={`${cellClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--gold)]`}
                              >
                                <span>{value}</span>
                              <ChevronRight
                                size={16}
                                className="shrink-0 text-[color:var(--gold)] transition-transform group-hover:translate-x-0.5"
                              />
                              </Link>
                            ) : (
                              <div className={cellClass}>{value}</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--mint-2)] bg-white/55 p-10 text-center">
          <p className="text-sm font-semibold text-[color:var(--ink)]/70">
            No projects match the selected filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelected({});
              setOpenGroup(null);
            }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--forest)] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white"
          >
            <X size={13} />
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
