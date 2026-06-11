"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { approveAttraction } from "../actions";
import { Check } from "lucide-react";

export function ApproveButton({
  attractionId,
  attractionName,
}: {
  attractionId: string;
  attractionName: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleApprove() {
    startTransition(async () => {
      try {
        await approveAttraction(attractionId);
      } catch (err) {
        alert(err instanceof Error ? err.message : "审核失败，请重试");
      }
    });
  }

  return (
    <Button
      size="sm"
      className="gap-1"
      disabled={isPending}
      onClick={handleApprove}
    >
      <Check className="w-3.5 h-3.5" />
      {isPending ? "处理中..." : "通过"}
    </Button>
  );
}
