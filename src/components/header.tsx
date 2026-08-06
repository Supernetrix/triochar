"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import type { NavItem } from "@/lib/home-content";
import { cn } from "@/lib/utils";

export function Header({ brandName, navItems }: { brandName: string; logoText: string; navItems: NavItem[] }) {
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
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[#fcfefb]/95 backdrop-blur-md">
      <div className="container-header relative flex h-20 items-center gap-4">
        <div className="flex shrink-0 items-center">
          <Link
            href="/"
            className="block shrink-0"
            aria-label={`${brandName} home`}
          >
            <Image
              src="/brand/climate-assets-logo.png"
              alt={brandName}
              width={208}
              height={52}
              priority
              unoptimized
              style={{ width: "auto" }}
              className="h-10 sm:h-11 xl:h-[3.25rem]"
            />
          </Link>
        </div>

        <nav className="ml-auto hidden flex-1 items-center justify-end gap-1 xl:gap-2 lg:flex">
          {navItems.map(navLink)}
        </nav>

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
          {navItems.map((item) => (
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
