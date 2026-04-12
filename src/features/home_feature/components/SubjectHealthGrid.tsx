"use client";

import { useState } from "react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { SubjectStudentsModal } from "./SubjectStudentsModal";
import type { StudentRecord } from "@/src/shared/types/academic.types";

type SubjectMetric = {
  subject: string;
  superior: number;
  alto: number;
  basico: number;
  bajo: number;
};

interface Props {
  data: SubjectMetric[];
  students: StudentRecord[];
}

interface GaugeProps extends SubjectMetric {
  onClick?: () => void;
}

function SubjectGauge({
  subject,
  superior,
  alto,
  basico,
  bajo,
  onClick,
}: GaugeProps) {
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
    <button
      onClick={onClick}
      className="w-full cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-300 hover:scale-105"
    >
      <h3 className="mb-3 truncate text-sm font-bold text-slate-700">
        {subject}
      </h3>

      <div className="relative h-44">
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

            <RadialBar dataKey="superior" fill="#10b981" cornerRadius={10} background />
            <RadialBar dataKey="alto" fill="#3b82f6" cornerRadius={10} background />
            <RadialBar dataKey="basico" fill="#fbbf24" cornerRadius={10} background />
            <RadialBar dataKey="bajo" fill="#ef4444" cornerRadius={10} background />
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
    </button>
  );
}

export function SubjectHealthGrid({ data, students }: Props) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!data.length) return null;

  const chunkSize = 8;

  const pages = Array.from(
    { length: Math.ceil(data.length / chunkSize) },
    (_, index) => data.slice(index * chunkSize, index * chunkSize + chunkSize)
  );

  return (
    <section className="mb-6">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 snap-x snap-mandatory py-4 px-2">
          {pages.map((page, pageIndex) => (
            <div key={pageIndex} className="min-w-full shrink-0 snap-start">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {page.map((item) => (
                  <SubjectGauge
                    key={item.subject}
                    {...item}
                    onClick={() => {
                      setSelectedSubject(item.subject);
                      setIsModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <SubjectStudentsModal
        open={isModalOpen}
        subject={selectedSubject}
        students={students}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}