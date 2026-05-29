"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type ProjectType = {
  label: string;
  note: string;
  image: string;
  href: string;
};

export function FloatingProjects({ items }: { items: ProjectType[] }) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((type, index) => (
        <motion.a
          key={type.label}
          href={type.href || "/portfolio"}
          initial={reducedMotion ? false : { opacity: 0, y: 26 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
          className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--forest-deep)] sm:aspect-[5/4] lg:aspect-[4/3]"
        >
          <Image
            src={type.image}
            alt={type.label}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--forest-deep)]/92 via-[var(--forest-deep)]/30 to-transparent" />

          <div className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-[var(--mint)] group-hover:text-[var(--forest)]">
            <ArrowUpRight size={14} />
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
            <h3 className="font-display max-w-[16rem] text-lg leading-tight text-white md:text-xl">{type.label}</h3>
            <p className="mt-1.5 max-w-[20rem] text-[0.72rem] leading-relaxed text-white/72">
              {type.note}
            </p>
          </div>
        </motion.a>
      ))}
    </div>
  );
}
