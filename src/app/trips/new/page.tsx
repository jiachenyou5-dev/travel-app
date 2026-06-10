"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TripPlanCard } from "@/components/trips/trip-plan-card";
import { generateTrip, saveTrip } from "@/app/actions/trips";
import { Loader2, Sparkles } from "lucide-react";

interface TripDay {
  dayNumber: number;
  items: {
    time: string;
    title: string;
    description: string;
    type: string;
  }[];
}

export default function NewTripPage() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TripDay[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");

  async function handleGenerate() {
    if (!destination.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const res = await generateTrip(destination.trim(), days);

    if ("error" in res) {
      setError(res.error);
    } else {
      setResult(res.days);
      setTitle(`${destination} ${days}日游`);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-8">AI 生成行程</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">输入旅行信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="destination">目的地</Label>
            <Input
              id="destination"
              placeholder="例如：北京、成都、三亚..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="days">旅行天数</Label>
            <Input
              id="days"
              type="number"
              min={1}
              max={14}
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value) || 1)}
              className="mt-1 w-24"
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading || !destination.trim()}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {loading ? "AI 正在规划行程..." : "生成行程"}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive mb-8">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 flex-wrap">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="max-w-xs"
              placeholder="行程标题"
            />
            <form
              action={async (formData: FormData) => {
                formData.append("daysJson", JSON.stringify(result));
                await saveTrip(formData);
              }}
            >
              <Button type="submit" className="gap-2">
                保存行程
              </Button>
            </form>
          </div>

          <TripPlanCard days={result} />
        </div>
      )}
    </div>
  );
}
