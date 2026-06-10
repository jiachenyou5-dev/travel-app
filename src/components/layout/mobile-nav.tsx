"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function MobileNav({ isAdmin, isLoggedIn }: { isAdmin: boolean; isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="sm" onClick={() => setOpen(!open)}>
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg">
          <div className="px-4 py-3 space-y-2">
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-md text-muted-foreground hover:bg-muted"
            >
              搜索
            </Link>
            <Link
              href="/destinations"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-md text-muted-foreground hover:bg-muted"
            >
              目的地
            </Link>
            <Link
              href="/journals"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-md text-muted-foreground hover:bg-muted"
            >
              游记
            </Link>
            {isLoggedIn && (
              <Link
                href="/trips"
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-md text-muted-foreground hover:bg-muted"
              >
                行程
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-md text-muted-foreground hover:bg-muted"
              >
                管理后台
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
