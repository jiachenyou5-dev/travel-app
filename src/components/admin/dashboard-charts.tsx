"use client";

import { useState } from "react";

interface DestinationRating {
  name: string;
  avgRating: number;
  reviewCount: number;
}

interface RatingBucket {
  rating: number;
  count: number;
}

interface ContentTypeCount {
  type: string;
  count: number;
  color: string;
}

interface DashboardChartsProps {
  destinationRatings: DestinationRating[];
  ratingDistribution: RatingBucket[];
  contentCounts: ContentTypeCount[];
  totalReviews: number;
  totalAvgRating: string;
}

export function DashboardCharts({
  destinationRatings,
  ratingDistribution,
  contentCounts,
  totalReviews,
  totalAvgRating,
}: DashboardChartsProps) {
  return (
    <div className="space-y-6">
      {/* 顶部总览 */}
      <div className="flex items-center gap-6 mb-2">
        <div className="text-center">
          <div className="text-3xl font-bold text-star">{totalAvgRating}</div>
          <div className="text-xs text-muted-foreground">综合评分 / 5</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">{totalReviews}</div>
          <div className="text-xs text-muted-foreground">总评论数</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-success">{destinationRatings.length}</div>
          <div className="text-xs text-muted-foreground">有评分目的地</div>
        </div>
      </div>

      {/* 目的地评分对比 */}
      {destinationRatings.length > 0 && (
        <DestinationRatingChart data={destinationRatings} />
      )}

      {/* 两列布局：星级分布 + 内容占比 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {ratingDistribution.length > 0 && (
          <RatingPieChart data={ratingDistribution} total={totalReviews} />
        )}
        {contentCounts.length > 0 && (
          <ContentDonutChart data={contentCounts} />
        )}
      </div>
    </div>
  );
}

/** 目的地评分水平柱状图 */
function DestinationRatingChart({ data }: { data: DestinationRating[] }) {
  const sorted = [...data].sort((a, b) => b.avgRating - a.avgRating);
  const maxRating = 5;

  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">📍 各目的地平均评分</h3>
      <div className="space-y-3">
        {sorted.map((item) => {
          const pct = (item.avgRating / maxRating) * 100;
          const hue = item.avgRating >= 4 ? "var(--color-star)" : item.avgRating >= 3 ? "#f59e0b" : "#ef4444";
          return (
            <div key={item.name} className="group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground truncate max-w-[140px]">
                  {item.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {item.reviewCount} 条评论
                  </span>
                  <span className="text-sm font-bold" style={{ color: hue }}>
                    {item.avgRating.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: hue,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** 星级分布柱状图 */
function RatingPieChart({
  data,
  total,
}: {
  data: RatingBucket[];
  total: number;
}) {
  const ratingMap = new Map(data.map((d) => [d.rating, d.count]));
  const colors: Record<number, string> = {
    5: "#22c55e",
    4: "#84cc16",
    3: "#f59e0b",
    2: "#f97316",
    1: "#ef4444",
  };

  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">⭐ 星级分布</h3>
      <div className="space-y-2.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = ratingMap.get(star) || 0;
          const pct = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs font-medium w-7 text-right">{star}★</span>
              <div className="flex-1 h-5 bg-muted rounded overflow-hidden relative">
                <div
                  className="h-full rounded transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.max(pct, 1)}%`,
                    backgroundColor: colors[star],
                  }}
                />
                {pct > 8 && (
                  <span className="absolute inset-y-0 left-1.5 flex items-center text-[10px] font-bold text-white">
                    {count}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground w-8 text-right">
                {pct.toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** 内容类型占比环形图 (纯 SVG) */
function ContentDonutChart({ data }: { data: ContentTypeCount[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  if (total === 0) return null;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const radius = 50;
  const cx = 60;
  const cy = 60;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;
  const segments = data.map((item, i) => {
    const percent = item.count / total;
    const dashArray = `${circumference * percent} ${circumference * (1 - percent)}`;
    const dashOffset = -circumference * cumulativePercent;
    cumulativePercent += percent;
    return { ...item, dashArray, dashOffset, index: i };
  });

  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">📊 内容占比</h3>
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 120 120" className="w-28 h-28 shrink-0">
          {segments.map((seg) => (
            <circle
              key={seg.type}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={hoveredIndex === seg.index ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={seg.dashArray}
              strokeDashoffset={seg.dashOffset}
              strokeLinecap="butt"
              style={{
                transition: "all 0.3s ease",
                opacity: hoveredIndex !== null && hoveredIndex !== seg.index ? 0.4 : 1,
              }}
              onMouseEnter={() => setHoveredIndex(seg.index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            />
          ))}
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            className="fill-foreground font-bold"
            style={{ fontSize: "16px" }}
          >
            {total}
          </text>
          <text
            x={cx}
            y={cy + 10}
            textAnchor="middle"
            className="fill-muted-foreground"
            style={{ fontSize: "8px" }}
          >
            总计
          </text>
        </svg>
        <div className="space-y-1.5">
          {data.map((item) => {
            const pct = total > 0 ? ((item.count / total) * 100).toFixed(0) : "0";
            return (
              <div
                key={item.type}
                className="flex items-center gap-2 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(data.indexOf(item))}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-foreground">{item.type}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {item.count}（{pct}%）
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
