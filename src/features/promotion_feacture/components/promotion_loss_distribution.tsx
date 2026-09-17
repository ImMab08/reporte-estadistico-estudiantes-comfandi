"use client";

import type {
  LossDistributionMetric,
  PromotionStudent,
} from "../promotion.types";

type Props = {
  data: LossDistributionMetric[];
  totalStudents: number;
  students: PromotionStudent[];
  onSelectLosses: (losses: number) => void;
};

const COLORS = [
  "bg-emerald-500",
  "bg-amber-400",
  "bg-orange-500",
  "bg-orange-600",
  "bg-red-500",
  "bg-violet-500",
  "bg-indigo-500",
  "bg-blue-500",
  "bg-cyan-500",
];

const TEXT_COLORS = [
  "text-emerald-600",
  "text-amber-500",
  "text-orange-500",
  "text-orange-600",
  "text-red-500",
  "text-violet-500",
  "text-indigo-500",
  "text-blue-500",
  "text-cyan-500",
];

export function PromotionLossDistribution({
  data,
  totalStudents,
  onSelectLosses,
}: Props) {
  const maxCount = Math.max(...data.map((item) => item.count), 1);

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-4">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-primary">
            Distribución de pérdidas
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Haz clic sobre una categoría para ver los estudiantes
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage =
            totalStudents === 0
              ? 0
              : Number(((item.count / totalStudents) * 100).toFixed(1));

          const width = (item.count / maxCount) * 100;

          const color = COLORS[Math.min(index, COLORS.length - 1)];

          const textColor =
            TEXT_COLORS[Math.min(index, TEXT_COLORS.length - 1)];

          return (
            <button
              key={item.losses}
              type="button"
              onClick={() => onSelectLosses(item.losses)}
              className="
                w-full
                grid
                grid-cols-[140px_1fr_60px_70px]
                gap-4
                items-center
                rounded-xl
                px-2
                py-2
                hover:bg-slate-50
                transition-all
                cursor-pointer
              "
            >
              <div className="flex items-center gap-3">
                <div className={`size-3 rounded-full ${color}`} />

                <span className="font-medium text-slate-700 text-left">
                  {item.label}
                </span>
              </div>

              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${color}`}
                  style={{
                    width: `${width}%`,
                  }}
                />
              </div>

              <span className="font-semibold text-slate-800 text-right">
                {item.count}
              </span>

              <span className={`font-bold text-right ${textColor}`}>
                {percentage}%
              </span>
            </button>
          );
        })}
      </div>

      <div className="border-t border-border mt-8 pt-6 flex justify-center">
        <span className="text-primary font-semibold">
          {totalStudents}
        </span>

        <span className="text-slate-500 ml-2">
          estudiantes en total
        </span>
      </div>
    </div>
  );
}