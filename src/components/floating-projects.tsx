"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type ProjectType = {
  label: string;
  note: string;
  image: string;
};

const projectTypes: ProjectType[] = [
  {
    label: "Biochar & Soil Carbon",
    note: "Durable carbon removal with measurable agricultural co-benefits.",
    image: "/images/project-biochar.png",
  },
  {
    label: "Mangrove & Blue Carbon",
    note: "Coastal restoration with resilient, community-led stewardship.",
    image: "/images/project-mangrove.png",
  },
  {
    label: "Regenerative Agriculture",
    note: "Soil health and land-use change across distributed farmer networks.",
    image: "/images/project-regenerative.png",
  },
];

export function FloatingProjects() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {projectTypes.map((type, index) => (
        <motion.a
          key={type.label}
          href="/portfolio"
          initial={reducedMotion ? false : { opacity: 0, y: 26 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
          className="group relative block aspect-[5/4] overflow-hidden rounded-2xl border border-[var(--line)] sm:aspect-[4/5] lg:aspect-[3/4]"
        >
          <Image
            src={type.image}
            alt={type.label}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--forest-deep)]/92 via-[var(--forest-deep)]/30 to-transparent" />

          <div className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-[var(--mint)] group-hover:text-[var(--forest)]">
            <ArrowUpRight size={16} />
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
            <h3 className="font-display text-xl text-white md:text-[1.4rem]">{type.label}</h3>
            <p className="mt-1.5 max-w-[22rem] text-xs leading-relaxed text-white/70">
              {type.note}
            </p>
          </div>
        </motion.a>
      ))}
    </div>
  );
}
