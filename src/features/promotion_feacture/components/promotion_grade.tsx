"use client";

import { GradeMetric } from "../promotion.types";

type Props = {
  data: GradeMetric[];
  onSelectGrade: (grade: string) => void;
};

export function PromotionGrade({
  data,
  onSelectGrade,
}: Props) {
  const getStyles = (rate: number) => {
    if (rate >= 95) {
      return {
        card: "bg-emerald-50 border-emerald-100",
        text: "text-emerald-600",
        bar: "bg-emerald-500",
      };
    }

    if (rate >= 85) {
      return {
        card: "bg-amber-50 border-amber-100",
        text: "text-amber-500",
        bar: "bg-amber-500",
      };
    }

    return {
      card: "bg-red-50 border-red-100",
      text: "text-red-500",
      bar: "bg-red-500",
    };
  };

  console.log("grado: ", onSelectGrade)

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-xl font-bold text-primary">
          Promoción por grado
        </h3>

        <p className="text-sm text-slate-500 mt-1">
          Tasa de promoción por cada grado
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {data.map((grade) => {
          const styles = getStyles(grade.rate);

          return (
            <button
              key={grade.grade}
              onClick={() => onSelectGrade(grade.grade)}
              className={`
                rounded-xl
                border
                p-3
                text-left
                cursor-pointer
                transition-all
                duration-300
                hover:shadow-md
                hover:-translate-y-0.5
                hover:scale-[1.02]
                ${styles.card}
              `}
            >
              <div className="text-lg font-bold text-slate-700 mb-1">
                {grade.grade}°
              </div>

              <div
                className={`text-2xl font-bold mb-2 ${styles.text}`}
              >
                {grade.rate}%
              </div>

              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full ${styles.bar}`}
                  style={{
                    width: `${grade.rate}%`,
                  }}
                />
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Promovidos
                  </span>

                  <span className="font-semibold text-slate-700">
                    {grade.promoted}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    No promovidos
                  </span>

                  <span className="font-semibold text-slate-700">
                    {grade.notPromoted}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}