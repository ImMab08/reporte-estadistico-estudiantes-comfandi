"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"];

type PieItem = {
  name: string;
  value: number;
};

type Props = {
  data: PieItem[];
  title: string;
};

export function PerformancePie({ data, title }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-border p-4 shadow-sm h-full flex flex-col">
      {/* Título fijo arriba */}
      <h3 className="text-2xl font-bold text-slate-800 mb-4">{title}</h3>

      {/* Contenedor que centra el gráfico */}
      <div className="flex-1 flex items-center justify-center">
        <ResponsiveContainer
          width="100%"
          height={340}
          className="outline-none focus:outline-none"
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="45%"
              innerRadius={70}
              outerRadius={120}
              paddingAngle={2}
              stroke="none"
              isAnimationActive={true}
              activeShape={false}
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                  stroke="none"
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="square"
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: "14px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
