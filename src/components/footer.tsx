import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import type { NavItem } from "@/lib/home-content";
import { siteConfig } from "@/lib/site";

export function Footer({
  brandName,
  footerNote,
  contactEmail,
  navItems,
}: {
  brandName: string;
  footerNote: string;
  contactEmail: string;
  navItems: NavItem[];
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
        <div className="grid gap-8 border-b border-white/10 py-16 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-12">
          <div
            className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl bg-white/[0.04] ring-1 ring-white/10 md:h-28 md:w-28"
            aria-hidden
          >
            <svg
              viewBox="0 0 100 70"
              className="h-16 w-24 md:h-[4.5rem] md:w-[6.5rem]"
              fill="none"
            >
              {/* back bubble — gold, partly hidden */}
              <g opacity="0.6">
                <rect x="46" y="4" width="54" height="40" rx="14" fill="var(--gold-soft)" />
                <path d="M 68 44 L 70 58 L 80 44 Z" fill="var(--gold-soft)" />
                <circle cx="64" cy="22" r="2.7" fill="#ffffff" opacity="0.85" />
                <circle cx="74" cy="22" r="2.7" fill="#ffffff" opacity="0.85" />
                <circle cx="84" cy="22" r="2.7" fill="#ffffff" opacity="0.85" />
              </g>
              {/* front bubble — mint */}
              <g>
                <rect x="0" y="14" width="52" height="40" rx="14" fill="var(--mint)" />
                <path d="M 22 54 L 20 68 L 32 54 Z" fill="var(--mint)" />
                <circle cx="14" cy="34" r="2.7" fill="var(--forest)" />
                <circle cx="26" cy="34" r="2.7" fill="var(--forest)" />
                <circle cx="38" cy="34" r="2.7" fill="var(--forest)" />
              </g>
            </svg>
          </div>
          <div>
            <div className="eyebrow text-[color:var(--gold-soft)]">Let us begin the conversation</div>
            <h2 className="font-display mt-4 max-w-xl text-balance text-3xl leading-[1.12] text-white md:text-[2.7rem]">
              Tell us about yourself and how we can work together.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/64">
              A focused conversation with buyers, suppliers, and partners.
            </p>
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
            <Image
              src="/brand/triochar-logo-white.svg"
              alt={brandName}
              width={176}
              height={40}
              unoptimized
              style={{ width: "auto" }}
              className="h-10"
            />
            <p className="max-w-xs text-sm leading-relaxed text-white/68">{footerNote}</p>
          </div>

          <div>
            <div className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">
              Explore
            </div>
            <nav className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
              {navItems.map((item) => (
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
              <a
                href={siteConfig.contactPhoneHref}
                className="flex items-center gap-3 text-white/74 transition hover:text-white"
                target="_blank"
                rel="noreferrer"
              >
                <Phone size={15} className="text-[color:var(--gold-soft)]" />
                {siteConfig.contactPhone}
              </a>
              <div className="flex items-center gap-3 text-white/74">
                <MapPin size={15} className="text-[color:var(--gold-soft)]" />
                {siteConfig.contactLocation}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-shell flex flex-col gap-2 py-6 text-[0.7rem] text-white/56 md:flex-row md:items-center md:justify-between">
          <span>
            &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
          </span>
          <span className="tracking-wide">Bankable and Trustworthy Carbon Credits</span>
        </div>
      </div>
    </footer>
  );
}
