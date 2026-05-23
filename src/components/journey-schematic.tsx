"use client";

import { motion, useReducedMotion } from "framer-motion";

const steps = [
  "Thought",
  "Decarbonising Company",
  "Commitment",
  "Baseline",
  "GHG Accounting",
  "Target Setting",
  "ESG Reporting",
  "Decarbonisation Plan",
  "Reduction Measures",
  "Offsetting Measures",
  "Net Zero",
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function JourneySchematic() {
  const reduced = useReducedMotion();
  const last = steps.length - 1;
  const lineDuration = 1.15;

  return (
    <div className="soft-card rounded-3xl p-4 sm:p-7 md:p-10">
      <div className="mx-auto max-w-2xl text-center">
        <div className="eyebrow-plain text-[0.6rem] sm:text-[0.7rem]">
          The Decarbonisation Journey
        </div>
        <h2 className="font-display mt-2.5 text-[1.5rem] leading-tight text-[color:var(--ink)] sm:text-3xl md:text-[2.4rem]">
          Where do you <span className="font-display-italic text-[color:var(--forest-2)]">stand?</span>
        </h2>
        <p className="mx-auto mt-2.5 max-w-md text-[0.8rem] leading-relaxed text-[color:var(--ink)]/72 sm:text-sm">
          The path from first thought to net zero — Triochar meets you wherever you are.
        </p>
      </div>

      {/* Desktop — horizontal timeline */}
      <div className="relative mx-5 mt-4 hidden h-44 lg:block">
        <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-[color:var(--mint-2)]/55">
          <motion.div
            className="h-full w-full origin-left rounded-full"
            style={{ background: "linear-gradient(90deg, var(--mint-2), var(--forest))" }}
            initial={reduced ? false : { scaleX: 0 }}
            whileInView={reduced ? undefined : { scaleX: 1 }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: lineDuration, ease: EASE }}
          />
        </div>

        {steps.map((label, i) => {
          const above = i % 2 === 0;
          const isLast = i === last;
          const delay = reduced ? 0 : 0.16 + (i / last) * lineDuration * 0.86;
          return (
            <div
              key={label}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${(i / last) * 100}%` }}
            >
              <div className="relative grid place-items-center">
                <motion.span
                  initial={reduced ? false : { scale: 0, opacity: 0 }}
                  whileInView={reduced ? undefined : { scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-90px" }}
                  transition={{ duration: 0.45, delay, ease: [0.34, 1.4, 0.64, 1] }}
                  className={`grid place-items-center rounded-full font-mono text-[11px] font-bold transition-transform duration-200 hover:scale-110 ${
                    isLast
                      ? "h-9 w-9 bg-[var(--forest)] text-white ring-4 ring-[color:var(--mint)]"
                      : "h-7 w-7 bg-[var(--forest)] text-white"
                  }`}
                >
                  {isLast ? "★" : i + 1}
                </motion.span>

                <motion.span
                  initial={reduced ? false : { opacity: 0, y: above ? 6 : -6 }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-90px" }}
                  transition={{ duration: 0.4, delay: delay + 0.05 }}
                  className={`absolute left-1/2 w-24 -translate-x-1/2 text-center text-[11px] font-semibold leading-tight text-[color:var(--ink)] ${
                    above ? "bottom-full mb-3.5" : "top-full mt-3.5"
                  }`}
                >
                  {label}
                </motion.span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile / tablet — readable vertical journey */}
      <div className="relative mt-7 rounded-2xl border border-[var(--line)] bg-[var(--surface-pure)] px-4 py-5 sm:px-5 lg:hidden">
        <div className="absolute bottom-8 left-[2.2rem] top-8 w-[3px] overflow-hidden rounded-full bg-[color:var(--mint-2)]/55 sm:left-[2.45rem]">
          <motion.div
            className="h-full w-full origin-top rounded-full"
            style={{ background: "linear-gradient(180deg, var(--mint-2), var(--forest))" }}
            initial={reduced ? false : { scaleY: 0 }}
            whileInView={reduced ? undefined : { scaleY: 1 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: lineDuration, ease: EASE }}
          />
        </div>

        <div className="relative grid gap-2.5">
          {steps.map((label, i) => {
            const isLast = i === last;
            const delay = reduced ? 0 : 0.12 + (i / last) * lineDuration * 0.86;

            return (
              <motion.div
                key={label}
                initial={reduced ? false : { opacity: 0, x: -10 }}
                whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.38, delay, ease: EASE }}
                className={`relative flex items-center gap-3 rounded-2xl border px-3 py-3 ${
                  isLast
                    ? "border-[color:var(--forest)] bg-[var(--forest)] text-white shadow-[0_18px_38px_-30px_rgba(28,38,32,0.75)]"
                    : "border-[var(--line)] bg-white/72"
                }`}
              >
                <span
                  className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full font-mono text-[0.7rem] font-bold ${
                    isLast
                      ? "bg-[var(--mint)] text-[color:var(--forest)] ring-[3px] ring-white/20"
                      : "bg-[var(--forest)] text-white"
                  }`}
                >
                  {isLast ? "★" : i + 1}
                </span>

                <span
                  className={`min-w-0 flex-1 text-[0.92rem] font-bold leading-tight ${
                    isLast ? "text-white" : "text-[color:var(--ink)]"
                  }`}
                >
                  {label}
                </span>

                {isLast ? (
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[0.56rem] font-bold uppercase tracking-[0.16em] text-white/78">
                    Goal
                  </span>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
