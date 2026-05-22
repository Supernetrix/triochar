"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const leftNav = [
  { label: "Main", href: "/" },
  { label: "Knowledge", href: "/knowledge" },
  { label: "Portfolio", href: "/portfolio" },
];

const middleNav = [
  { label: "Supplier", href: "/supplier" },
  { label: "Buyer", href: "/buyer" },
];

const allNav = [...leftNav, ...middleNav, { label: "Contact Us", href: "/contact" }];

export function Header({ brandName, logoText }: { brandName: string; logoText: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && Boolean(pathname?.startsWith(href)));

  const navLink = (item: { label: string; href: string }) => (
    <Link
      key={item.href}
      href={item.href}
      className={cn(
        "relative px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-200",
        isActive(item.href)
          ? "text-[color:var(--forest)]"
          : "text-[color:var(--forest)]/68 hover:text-[color:var(--forest)]",
      )}
    >
      {item.label}
      {isActive(item.href) && (
        <span className="absolute -bottom-0.5 left-3.5 right-3.5 h-0.5 rounded-full bg-[var(--gold)]" />
      )}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--background)]/85 backdrop-blur-md">
      <div className="container-shell flex h-20 items-center justify-between gap-4 md:grid md:grid-cols-[1fr_auto_1fr]">
        {/* Left: logo + main nav */}
        <div className="flex items-center gap-1">
          <Link href="/" className="mr-2 flex items-center gap-2.5 sm:mr-3 sm:gap-3" aria-label={`${brandName} home`}>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--forest)] font-display text-sm text-[color:var(--mint)] shadow-sm">
              {logoText.slice(0, 1).toUpperCase()}
            </span>
            <span className="font-display text-lg text-[color:var(--ink)] sm:text-xl">
              {brandName}
            </span>
          </Link>
          <nav className="hidden items-center md:flex">{leftNav.map(navLink)}</nav>
        </div>

        {/* Middle: audience nav */}
        <nav className="hidden items-center justify-center md:flex">{middleNav.map(navLink)}</nav>

        {/* Right: contact CTA */}
        <div className="flex items-center justify-end">
          <Link
            href="/contact"
            className="hidden rounded-full bg-[var(--forest)] px-6 py-3 text-xs font-extrabold uppercase tracking-widest text-white transition hover:bg-[var(--forest-2)] hover:shadow-sm md:inline-block"
          >
            Contact Us
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--line)] text-[color:var(--forest)] hover:bg-white/50 md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 md:hidden",
          open
            ? "max-h-96 border-b border-[var(--line)] bg-[var(--background)] opacity-100"
            : "max-h-0 opacity-0",
        )}
      >
        <nav className="grid gap-1 px-6 pb-6 pt-2">
          {allNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors",
                isActive(item.href)
                  ? "bg-[var(--mint)] text-[color:var(--forest)]"
                  : "text-[color:var(--forest)]/70 hover:bg-white/50",
              )}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
