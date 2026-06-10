"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, X, PenLine, CalendarPlus } from "lucide-react";

export function Fab() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-24 z-40 flex flex-col items-end gap-3">
      {open && (
        <div className="flex flex-col gap-2 animate-[page-enter_0.2s_ease-out_both]">
          <Link
            href="/trips/new"
            className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 shadow-md text-sm text-foreground hover:bg-muted transition-all hover:shadow-lg"
          >
            <CalendarPlus className="w-4 h-4 text-primary" />
            生成行程
          </Link>
          <Link
            href="/profile/journals/new"
            className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 shadow-md text-sm text-foreground hover:bg-muted transition-all hover:shadow-lg"
          >
            <PenLine className="w-4 h-4 text-primary" />
            写游记
          </Link>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className={`w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 ${
          open ? "rotate-45" : ""
        }`}
        aria-label="快捷操作"
      >
        {open ? (
          <X className="w-5 h-5 transition-transform" />
        ) : (
          <Plus className="w-5 h-5 transition-transform" />
        )}
      </button>
    </div>
  );
}
