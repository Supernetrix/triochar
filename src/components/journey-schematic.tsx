"use client";

import { useRef } from "react";
import { BadgeCheck, Lightbulb } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const steps = [
  "Thought of Decarbonization",
  "Public Commitment",
  "Baseline and GHG Accounting",
  "ESG Reporting and Target Setting",
  "Decarbonization Plan",
  "Reduction and Offsetting Measures",
  "Net Zero",
];

const EASE = [0.22, 1, 0.36, 1] as const;

type JourneyContent = {
  eyebrow: string;
  headingStart: string;
  headingEmphasis: string;
  description: string;
};

export function JourneySchematic({ content }: { content: JourneyContent }) {
  const reduced = useReducedMotion();
  const mobileJourneyRef = useRef<HTMLDivElement>(null);
  const last = steps.length - 1;
  const lineDuration = 1.15;
  const { scrollYProgress } = useScroll({
    target: mobileJourneyRef,
    offset: ["start 78%", "end 38%"],
  });
  const mobileLineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="soft-card rounded-3xl p-4 sm:p-7 md:p-10">
      <div className="mx-auto max-w-2xl text-center">
        <div className="eyebrow-plain text-[0.6rem] sm:text-[0.7rem]">
          {content.eyebrow}
        </div>
        <h2 className="font-display mt-2.5 text-[1.5rem] leading-tight text-[color:var(--ink)] sm:text-3xl md:text-[2.4rem]">
          {content.headingStart} <span className="font-display-italic text-[color:var(--forest-2)]">{content.headingEmphasis}</span>
        </h2>
        <p className="mx-auto mt-2.5 max-w-md text-[0.8rem] leading-relaxed text-[color:var(--ink)]/72 sm:text-sm">
          {content.description}
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
                  {i === 0 ? <Lightbulb size={13} /> : isLast ? <BadgeCheck size={14} /> : i + 1}
                </motion.span>

                <motion.span
                  initial={reduced ? false : { opacity: 0, y: above ? 6 : -6 }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-90px" }}
                  transition={{ duration: 0.4, delay: delay + 0.05 }}
                  className={`absolute left-1/2 w-32 -translate-x-1/2 text-center text-[11px] font-semibold leading-tight text-[color:var(--ink)] ${
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

      {/* Mobile / tablet — refined vertical journey */}
      <div
        ref={mobileJourneyRef}
        className="relative mt-7 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-pure)] p-3.5 shadow-[0_18px_42px_-36px_rgba(28,38,32,0.55)] sm:p-4 lg:hidden"
      >
        <div className="absolute bottom-8 left-[1.95rem] top-8 w-[2px] overflow-hidden rounded-full bg-[color:var(--mint-2)]/45 sm:left-[2.1rem]">
          <motion.div
            className="h-full w-full origin-top rounded-full"
            initial={false}
            style={{
              background: "linear-gradient(180deg, var(--mint-2), var(--forest))",
              scaleY: reduced ? 1 : mobileLineScale,
            }}
          />
        </div>

        <div className="relative grid gap-1.5">
          {steps.map((label, i) => {
            const isLast = i === last;

            return (
              <div
                key={label}
                className={`relative flex items-center gap-3 rounded-2xl px-2.5 py-2 ${
                  isLast
                    ? "mt-1 bg-[var(--forest)] text-white shadow-[0_18px_38px_-30px_rgba(28,38,32,0.75)]"
                    : i % 2 === 0
                      ? "bg-white/78"
                      : "bg-[var(--mint-soft)]/45"
                }`}
              >
                <span
                  className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-[0.66rem] font-bold shadow-[0_10px_20px_-16px_rgba(28,38,32,0.75)] ${
                    isLast
                      ? "bg-[var(--mint)] text-[color:var(--forest)] ring-[4px] ring-white/12"
                      : "bg-[var(--forest)] text-white"
                  }`}
                >
                  {i === 0 ? <Lightbulb size={14} /> : isLast ? <BadgeCheck size={14} /> : i + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <div
                    className={`text-[0.56rem] font-bold uppercase tracking-[0.16em] ${
                      isLast ? "text-white/55" : "text-[color:var(--gold)]"
                    }`}
                  >
                    {isLast ? "Destination" : `Step ${String(i + 1).padStart(2, "0")}`}
                  </div>
                  <div
                    className={`mt-0.5 text-[0.88rem] font-bold leading-tight ${
                      isLast ? "text-white" : "text-[color:var(--ink)]"
                    }`}
                  >
                    {label}
                  </div>
                </div>

                {isLast ? (
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[0.56rem] font-bold uppercase tracking-[0.16em] text-white/78">
                    Goal
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
