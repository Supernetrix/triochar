"use client";

import Image from "next/image";
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

export function Header({ brandName }: { brandName: string; logoText: string }) {
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
      <div className="container-shell relative flex h-20 items-center gap-3">
        {/* Left: logo + main nav (logo never shrinks) */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="block shrink-0"
            aria-label={`${brandName} home`}
          >
            <Image
              src="/brand/triochar-logo.svg"
              alt={brandName}
              width={176}
              height={40}
              priority
              unoptimized
              style={{ width: "auto" }}
              className="h-9 sm:h-10"
            />
          </Link>
          <nav className="hidden items-center lg:flex">{leftNav.map(navLink)}</nav>
        </div>

        {/* Middle: audience nav — absolutely centered so it stays in the page middle */}
        <nav className="absolute inset-y-0 left-1/2 hidden -translate-x-1/2 items-center lg:flex">
          {middleNav.map(navLink)}
        </nav>

        {/* Right: mobile menu toggle (Contact Us removed per client) */}
        <button
          type="button"
          className="ml-auto grid h-10 w-10 place-items-center rounded-lg border border-[var(--line)] text-[color:var(--forest)] hover:bg-white/50 lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 lg:hidden",
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
