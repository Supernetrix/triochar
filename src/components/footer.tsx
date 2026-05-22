import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site";

const exploreLinks = [
  { label: "Main", href: "/" },
  { label: "Knowledge", href: "/knowledge" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Supplier", href: "/supplier" },
  { label: "Buyer", href: "/buyer" },
  { label: "Contact Us", href: "/contact" },
];

export function Footer({
  brandName,
  footerNote,
  contactEmail,
}: {
  brandName: string;
  footerNote: string;
  contactEmail: string;
}) {
  return (
    <footer className="relative mt-px overflow-hidden bg-[var(--forest-deep)] text-white">
      {/* depth — soft glows so the dark tone reads as lit, not a flat slab */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(42rem 26rem at 86% -4%, rgba(220,254,210,0.16), transparent 70%), radial-gradient(34rem 24rem at -4% 108%, rgba(196,160,100,0.16), transparent 72%)",
        }}
      />

      <div className="container-shell relative">
        {/* CTA band */}
        <div className="grid gap-8 border-b border-white/10 py-16 md:grid-cols-[1.45fr_auto] md:items-center">
          <div>
            <div className="eyebrow text-[color:var(--gold-soft)]">Let us begin</div>
            <h2 className="font-display mt-4 max-w-xl text-balance text-3xl leading-[1.12] text-white md:text-[2.7rem]">
              Find out where you{" "}
              <span className="font-display-italic text-[color:var(--mint)]">stand</span> — and chart the
              path to net zero.
            </h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex w-fit items-center justify-center gap-2.5 rounded-full bg-[var(--mint)] px-8 py-4 text-xs font-bold uppercase tracking-widest text-[color:var(--forest)] transition hover:brightness-105"
          >
            Contact Us
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* link + detail columns */}
        <div className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1.1fr]">
          <div className="space-y-4">
            <div className="font-display text-[1.7rem] leading-none text-white">{brandName}</div>
            <p className="max-w-xs text-sm leading-relaxed text-white/68">{footerNote}</p>
          </div>

          <div>
            <div className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">
              Explore
            </div>
            <nav className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
              {exploreLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="w-fit text-xs font-bold uppercase tracking-wider text-white/68 transition hover:text-[color:var(--mint)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <div className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">
              Get in touch
            </div>
            <div className="mt-5 space-y-3.5 text-sm">
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-3 text-white/74 transition hover:text-white"
              >
                <Mail size={15} className="text-[color:var(--gold-soft)]" />
                {contactEmail}
              </a>
              <div className="flex items-center gap-3 text-white/74">
                <Phone size={15} className="text-[color:var(--gold-soft)]" />
                {siteConfig.contactPhone}
              </div>
              <div className="flex items-center gap-3 text-white/74">
                <MapPin size={15} className="text-[color:var(--gold-soft)]" />
                {siteConfig.contactLocation}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* oversized wordmark watermark */}
      <div
        aria-hidden
        className="font-display pointer-events-none select-none overflow-hidden text-center text-[22vw] leading-[0.78] tracking-tight text-white/[0.04] md:text-[16rem]"
      >
        {brandName}
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-shell flex flex-col gap-2 py-6 text-[0.7rem] text-white/56 md:flex-row md:items-center md:justify-between">
          <span>
            &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
          </span>
          <span className="tracking-wide">Bankable &amp; Trustworthy Carbon Credits</span>
        </div>
      </div>
    </footer>
  );
}
