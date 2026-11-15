"use client";

import { Button } from "@/components/ui/button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <h1 className="text-3xl font-medium tracking-tight text-foreground mb-2">出错了</h1>
      <p className="text-muted-foreground mb-8">
        {error.message || "页面加载失败，请稍后重试"}
      </p>
      <Button onClick={reset}>重试</Button>
    </div>
  );
}
