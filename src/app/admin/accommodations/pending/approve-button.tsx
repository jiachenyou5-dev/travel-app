"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { approveAccommodation } from "../actions";
import { Check } from "@/components/ui/clay-icons";

export function ApproveButton({
  accommodationId,
  accommodationName,
}: {
  accommodationId: string;
  accommodationName: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleApprove() {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await approveAccommodation(accommodationId);
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
      title={`通过审核：${accommodationName}`}
    >
      <Check className="w-3.5 h-3.5" />
      {isLoading ? "处理中..." : "通过"}
    </Button>
  );
}
