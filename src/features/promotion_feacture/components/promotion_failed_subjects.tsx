"use client";

import { FailedSubjectMetric } from "../promotion.types";

type Props = {
  data: FailedSubjectMetric[];
};

const COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-cyan-500",
];

export function PromotionFailedSubjects({ data }: Props) {
  const maxValue = data.length > 0 ? data[0].failedStudents : 1;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-primary">
          Materias con mayor reprobación
        </h3>
      </div>

      {/* Encabezados */}
      <div className="grid grid-cols-12 gap-4 text-sm text-slate-500 font-medium mb-4">
        <div className="px-2 col-span-5">Materias</div>
        <div className="px-2 col-span-4"></div>
        <div className="px-2 col-span-1 text-center">Est.</div>
        <div className="px-2 col-span-2 text-center">%</div>
      </div>

      {/* Filas */}
      <div className="">
        {data.map((subject, index) => (
          <div
            key={subject.subject}
            className="grid p-2 grid-cols-12 gap-4 items-center hover:scale-101 transition-all duration-300 hover:bg-slate-100 cursor-pointer"
          >
            <div className="col-span-5 font-medium text-slate-700 truncate">
              {subject.subject}
            </div>

            <div className="col-span-4">
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    COLORS[index % COLORS.length]
                  }`}
                  style={{
                    width: `${(subject.failedStudents / maxValue) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="col-span-1 text-center font-semibold text-slate-700">
              {subject.failedStudents}
            </div>

            <div className="col-span-2 text-center font-semibold text-slate-700">
              {subject.percentage}%
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
