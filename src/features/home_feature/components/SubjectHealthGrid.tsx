"use client";

import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type SubjectMetric = {
  subject: string;
  superior: number;
  alto: number;
  basico: number;
  bajo: number;
};

interface Props {
  data: SubjectMetric[];
}

function SubjectGauge({
  subject,
  superior,
  alto,
  basico,
  bajo,
}: SubjectMetric) {
  const chartData = [
    {
      superior,
      alto,
      basico,
      bajo,
    },
  ];

  const totalHealth = superior + alto;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-bold text-slate-700 mb-3 truncate">
        {subject}
      </h3>

      <div className="h-44 relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={chartData}
            innerRadius="25%"
            outerRadius="100%"
            startAngle={180}
            endAngle={0}
            barSize={8}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />

            <Tooltip
              formatter={(value: number, name: string) => [
                `${value}%`,
                name.charAt(0).toUpperCase() + name.slice(1),
              ]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
              }}
            />

            <RadialBar
              dataKey="superior"
              fill="#10b981"
              cornerRadius={10}
              background
            />

            <RadialBar
              dataKey="alto"
              fill="#3b82f6"
              cornerRadius={10}
              background
            />

            <RadialBar
              dataKey="basico"
              fill="#fbbf24"
              cornerRadius={10}
              background
            />

            <RadialBar
              dataKey="bajo"
              fill="#ef4444"
              cornerRadius={10}
              background
            />
          </RadialBarChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex items-center justify-center pt-10">
          <span className="text-2xl font-bold text-primary">
            {totalHealth}%
          </span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500" />
          Superior {superior}%
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-blue-500" />
          Alto {alto}%
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-amber-400" />
          Básico {basico}%
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-red-500" />
          Bajo {bajo}%
        </div>
      </div>
    </div>
  );
}

export function SubjectHealthGrid({ data }: Props) {
  if (!data.length) return null;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {data.map((item) => (
        <SubjectGauge key={item.subject} {...item} />
      ))}
    </section>
  );
}