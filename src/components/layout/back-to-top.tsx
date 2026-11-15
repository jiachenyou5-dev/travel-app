"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "@/components/ui/clay-icons";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      onClick={scrollToTop}
      // 内联 style 确保 fixed 定位不被父容器动画/transform 创建的包含块破坏
      style={{ position: "fixed" }}
      className={`bottom-24 right-6 z-40 w-12 h-12 rounded-full bg-primary text-primary-foreground border border-border flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="回到顶部"
    >
      <ChevronUp className="w-5 h-5 text-muted-foreground" />
    </button>
  );
}
