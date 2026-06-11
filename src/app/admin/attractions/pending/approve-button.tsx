"use client";

import { useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false);

  async function handleApprove() {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await approveAttraction(attractionId);
    } catch (err) {
      alert(err instanceof Error ? err.message : "审核失败，请重试");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      size="sm"
      className="gap-1"
      disabled={isLoading}
      onClick={handleApprove}
      title={`通过审核：${attractionName}`}
    >
      <Check className="w-3.5 h-3.5" />
      {isLoading ? "处理中..." : "通过"}
    </Button>
  );
}
