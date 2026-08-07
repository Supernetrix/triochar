import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Mail, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Book a Call",
  description: "Choose a time for a focused conversation with Climate Assets.",
  path: "/book-a-call/",
});

export default function BookACallPage() {
  return (
    <>
      <PageHero
        eyebrow="Book a Call"
        title="Choose a time that works for you."
        description="Schedule a focused conversation with Climate Assets about carbon credit projects, procurement, or partnerships."
      />

      <section className="py-12 md:py-16">
        <div className="container-shell">
          <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[0_24px_54px_-42px_rgba(28,38,32,0.5)]">
            <div className="flex flex-col gap-4 border-b border-[var(--line)] bg-[var(--surface)]/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div className="flex items-center gap-3.5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--mint-soft)] text-[color:var(--forest)]">
                  <CalendarDays size={20} />
                </span>
                <div>
                  <h2 className="text-base font-bold text-[color:var(--ink)]">Climate Assets availability</h2>
                  <p className="mt-0.5 text-sm text-[color:var(--ink)]/62">
                    Select an available date and time below.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[color:var(--forest)]/70">
                <ShieldCheck size={16} className="text-[color:var(--gold)]" />
                Secure scheduling by Microsoft
              </div>
            </div>

            <div className="relative h-[760px] overflow-hidden bg-white md:h-[820px]">
              <iframe
                title="Book a meeting with Climate Assets"
                src={siteConfig.bookingProviderUrl}
                className="absolute -top-[200px] left-0 h-[960px] w-full bg-white md:h-[1020px]"
                loading="eager"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>

          <p className="mt-5 flex flex-wrap items-center justify-center gap-2 text-center text-sm text-[color:var(--ink)]/62">
            Having trouble with the calendar?
            <Link
              href={`mailto:${siteConfig.contactEmail}`}
              className="inline-flex items-center gap-1.5 font-semibold text-[color:var(--forest)] underline decoration-[color:var(--gold)]/55 underline-offset-4"
            >
              <Mail size={14} />
              Email {siteConfig.contactEmail}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
