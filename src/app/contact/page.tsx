import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone, UsersRound } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Triochar for carbon credit projects, supplier engagement, and buyer inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Let us begin the conversation."
        description="Tell us about yourself and how we can work together. A focused conversation with buyers, suppliers, and partners."
      />
      <section className="py-16 md:py-20">
        <div className="container-shell grid gap-6 lg:grid-cols-[0.78fr_1fr] lg:gap-10">
          <Reveal>
            <div className="soft-card rounded-2xl p-6 sm:p-8">
              <div className="eyebrow">Reach Us</div>
              <div className="mt-4 flex items-start gap-4">
                <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[var(--mint)] text-[color:var(--forest)]">
                  <UsersRound size={28} />
                  <span className="absolute -right-2 -top-2 grid h-8 w-8 place-items-center rounded-full bg-[var(--forest)] text-white shadow-sm">
                    <MessageCircle size={15} />
                  </span>
                </div>
                <h2 className="font-display text-3xl text-[color:var(--ink)]">
                  Start a focused conversation.
                </h2>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[color:var(--ink)]/72">
                Use the form for new project inquiries, procurement conversations, or partnership
                opportunities.
              </p>
              <div className="mt-8 grid gap-4">
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="flex items-center gap-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface)]/50 p-4 transition-colors hover:border-[var(--mint-2)] hover:bg-white"
                >
                  <Mail className="text-[color:var(--gold)]" size={18} />
                  <span className="text-sm font-semibold text-[color:var(--forest)]">
                    {siteConfig.contactEmail}
                  </span>
                </a>
                <a
                  href={siteConfig.contactPhoneHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface)]/50 p-4 transition-colors hover:border-[var(--mint-2)] hover:bg-white"
                >
                  <Phone className="text-[color:var(--gold)]" size={18} />
                  <span className="text-sm font-semibold text-[color:var(--forest)]">
                    {siteConfig.contactPhone}
                  </span>
                </a>
                <div className="flex items-center gap-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface)]/50 p-4">
                  <MapPin className="text-[color:var(--gold)]" size={18} />
                  <span className="text-sm font-semibold text-[color:var(--forest)]">
                    {siteConfig.contactLocation}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <ContactForm fallbackEmail={siteConfig.contactEmail} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
