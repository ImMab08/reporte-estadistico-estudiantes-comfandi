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
  const gaugeValue = Math.min(value, 10);

  const chartData = [
    {
      value: gaugeValue,
    },
  ];

  const isGood = value <= 1.5;

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
              {isGood ? (
                <>
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#10b981" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#ef4444" />
                </>
              )}
            </linearGradient>
          </defs>

          <PolarAngleAxis type="number" domain={[0, 10]} tick={false} />

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

      {/* Ícono central */}
      <div className="absolute -top-20 inset-0 flex items-center justify-center">
        <IconRewardedAds
          className={`size-24 ${isGood ? "text-emerald-600" : "text-red-600"}`}
        />
      </div>

      {/* Decoración */}
      <div className="absolute -top-40 -right-32 inset-0 flex items-center justify-center">
        <IconStar
          className={`absolute text-primary opacity-40 ${
            isGood ? "text-emerald-600" : "text-red-600"
          }`}
        />
      </div>

      <div className="absolute -top-46 -right-20 inset-0 flex items-center justify-center">
        <IconStar
          className={`size-4 absolute text-primary opacity-40 ${
            isGood ? "text-emerald-600" : "text-red-600"
          }`}
        />
      </div>

      <div className="absolute -top-26 -right-40 inset-0 flex items-center justify-center">
        <IconStar
          className={`size-4 absolute text-primary opacity-40 ${
            isGood ? "text-emerald-600" : "text-red-600"
          }`}
        />
      </div>
    </div>
  );
}
