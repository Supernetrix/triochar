"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function SiteChrome({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      <main>{children}</main>
      {footer}
    </>
  );
}
