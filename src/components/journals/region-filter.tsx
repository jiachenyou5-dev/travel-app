"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const REGIONS = [
  { value: "", label: "全部地区" },
  { value: "华北", label: "华北" },
  { value: "华东", label: "华东" },
  { value: "华南", label: "华南" },
  { value: "华中", label: "华中" },
  { value: "西南", label: "西南" },
  { value: "西北", label: "西北" },
  { value: "东北", label: "东北" },
  { value: "港澳台", label: "港澳台" },
  { value: "海外", label: "海外" },
];

interface RegionFilterProps {
  currentRegion?: string;
}

export function RegionFilter({ currentRegion = "" }: RegionFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleRegionChange(region: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (region) {
      params.set("region", region);
    } else {
      params.delete("region");
    }
    router.push(`/journals?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
      {REGIONS.map((r) => (
        <Button
          key={r.value}
          variant={currentRegion === r.value ? "default" : "outline"}
          size="sm"
          onClick={() => handleRegionChange(r.value)}
          className="h-7 text-xs"
        >
          {r.label}
        </Button>
      ))}
    </div>
  );
}
