"use client";

import { GradeMetric } from "../promotion.types";

type Props = {
  data: GradeMetric[];
};

export function PromotionGrade({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-primary">
          Promoción por grado
        </h3>
      </div>

      {/* Encabezados */}
      <div className="grid grid-cols-12 gap-4 text-sm text-slate-500 font-medium mb-3">
        <div className="px-2 col-span-2">Grado</div>
        <div className="px-2 col-span-5">Promoción</div>
        <div className="px-2 col-span-2 text-center">Promovidos</div>
        <div className="px-2 col-span-3 text-center">No promovidos</div>
      </div>

      {/* Filas */}
      <div className="">
        {data.map((grade) => (
          <div
            key={grade.grade}
            className="grid grid-cols-12 p-2 gap-4 items-center hover:scale-101 transition-all duration-300 hover:bg-slate-100 cursor-pointer"
          >
            {/* Grado */}
            <div className="col-span-2 font-semibold text-slate-700">
              {grade.grade}°
            </div>

            {/* Barra */}
            <div className="col-span-5 flex items-center gap-3">
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{
                    width: `${grade.rate}%`,
                  }}
                />
              </div>

              <span className="w-12 text-sm font-semibold text-slate-700">
                {grade.rate}%
              </span>
            </div>

            {/* Promovidos */}
            <div className="col-span-2 text-center font-semibold text-slate-700">
              {grade.promoted}
            </div>

            {/* No promovidos */}
            <div className="col-span-3 text-center font-semibold text-slate-700">
              {grade.notPromoted}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}