"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { ContentEntry } from "@/lib/content";

export function PortfolioStack({ projects }: { projects: ContentEntry[] }) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      {projects.map((project, index) => (
        <motion.div
          key={project.slug}
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            whileHover={reducedMotion ? undefined : { y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            <Link
              href={`/portfolio/${project.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-pure)] shadow-[0_1px_2px_rgba(28,38,32,0.04)] transition-all duration-300 hover:border-[var(--mint-2)] hover:shadow-[0_20px_44px_-26px_rgba(28,38,32,0.45)] sm:flex-row"
            >
              {/* image */}
              <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-[var(--mint)] sm:aspect-auto sm:w-60 md:w-72">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 288px"
                    className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
                  />
                ) : null}
                <span className="absolute left-3 top-3 font-mono text-[11px] font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* info */}
              <div className="flex flex-1 flex-col justify-center gap-3 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-1.5">
                  {project.status ? (
                    <span className="rounded bg-[var(--forest)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                      {project.status}
                    </span>
                  ) : null}
                  {project.projectType ? (
                    <span className="rounded bg-[var(--mint)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[color:var(--forest)]">
                      {project.projectType}
                    </span>
                  ) : null}
                  {project.carbonCreditType ? (
                    <span className="rounded border border-[var(--gold)]/35 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[color:var(--gold)]">
                      {project.carbonCreditType}
                    </span>
                  ) : null}
                </div>

                <div>
                  <h3 className="font-display text-xl text-[color:var(--ink)] transition-colors group-hover:text-[color:var(--forest-2)] sm:text-2xl">
                    {project.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--ink)]/62">
                    {project.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  {project.location ? (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[color:var(--ink)]/45">
                      <MapPin size={13} className="text-[color:var(--gold)]" />
                      {project.location}
                    </div>
                  ) : (
                    <span />
                  )}
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[color:var(--forest-2)]">
                    View Project
                    <ArrowUpRight
                      size={14}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
