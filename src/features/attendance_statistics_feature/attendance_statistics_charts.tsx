"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type MonthlyData = {
  month: string;
  present: number;
  absent: number | null;
};

type GradeData = {
  grade: string;
  attendanceRate: number;
};

type Props = {
  monthlyData: MonthlyData[];
  gradeData: GradeData[];
  chart: "monthly" | "grade";
};

export default function AttendanceStatisticsCharts({
  monthlyData,
  gradeData,
  chart,
}: Props) {
  if (chart === "monthly") {
    return (
      <div className="h-72 w-full" role="img" aria-label="Asistencia mensual: presentes y faltantes">
        {monthlyData.some((item) => item.present || item.absent) ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="present" name="Presentes" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" name="Faltantes" fill="var(--color-bajo)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart />
        )}
      </div>
    );
  }

  return (
    <div className="h-72 w-full" role="img" aria-label="Porcentaje de asistencia por grado">
      {gradeData.length ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={gradeData} layout="vertical" margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid horizontal={false} stroke="#e2e8f0" />
            <XAxis type="number" domain={[0, 100]} tickFormatter={(value: number) => `${value}%`} axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
            <YAxis type="category" dataKey="grade" width={88} axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
            <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, "Asistencia"]} />
            <Bar dataKey="attendanceRate" name="Asistencia" fill="var(--color-superior)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <EmptyChart />
      )}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-text-muted">
      No hay datos suficientes para graficar este período.
    </div>
  );
}