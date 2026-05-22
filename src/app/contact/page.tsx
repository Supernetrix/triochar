import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
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
        description="Tell us whether you are a supplier, buyer, partner, or advisor — the first step is a focused conversation."
      />
      <section className="py-16 md:py-20">
        <div className="container-shell grid gap-6 lg:grid-cols-[0.78fr_1fr] lg:gap-10">
          <Reveal>
            <div className="soft-card rounded-2xl p-6 sm:p-8">
              <div className="eyebrow">Reach Us</div>
              <h2 className="font-display mt-4 text-3xl text-[color:var(--ink)]">
                Start a project conversation.
              </h2>
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
                <div className="flex items-center gap-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface)]/50 p-4">
                  <Phone className="text-[color:var(--gold)]" size={18} />
                  <span className="text-sm font-semibold text-[color:var(--forest)]">
                    {siteConfig.contactPhone}
                  </span>
                </div>
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
