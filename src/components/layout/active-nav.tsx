"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

export function NavLink({
  href,
  children,
  matchExact = false,
}: {
  href: string;
  children: ReactNode;
  matchExact?: boolean;
}) {
  const pathname = usePathname();
  const active = matchExact
    ? pathname === href
    : pathname.startsWith(href) && href !== "/";

  return (
    <Link
      href={href}
      className={`nav-underline text-sm text-muted-foreground hover:text-foreground transition-colors ${
        active ? "active text-foreground font-medium" : ""
      }`}
    >
      {children}
    </Link>
  );
}
