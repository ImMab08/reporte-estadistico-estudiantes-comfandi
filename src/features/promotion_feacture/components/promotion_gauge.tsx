"use client";

import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

import { IconRewardedAds, IconStar } from "@/src/shared/icons";

type Props = {
  value: number;
};

export function PromotionGauge({ value }: Props) {
  const chartData = [
    {
      value,
    },
  ];

  return (
    <div className="absolute h-80 w-110 right-0">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          data={chartData}
          innerRadius="82%"
          outerRadius="100%"
          startAngle={180}
          endAngle={0}
          barSize={32}
        >
          <defs>
            <linearGradient
              id="promotionGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#002d72" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>

          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />

          <RadialBar
            dataKey="value"
            fill="url(#promotionGradient)"
            cornerRadius={20}
            background={{
              fill: "#e5e7eb",
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      <div className="absolute -top-20 inset-0 flex items-center justify-center">
        <IconRewardedAds className="size-24 text-primary" />
      </div>
      <div className="absolute -top-40 -right-32 inset-0 flex items-center justify-center">
        <IconStar className="absolute text-primary" />
      </div>
    </div>
  );
}
