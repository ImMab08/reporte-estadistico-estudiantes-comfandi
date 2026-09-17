import { IconRewardedAds } from "@/src/shared/icons";
import { PromotionSnapshot } from "../promotion.types";
import { PromotionKpiCard } from "./promotion_kpi_card";
import { PromotionGauge } from "./promotion_gauge";

type Props = {
  data: PromotionSnapshot;
};

export function PromotionKpis({ data }: Props) {
  const analytics = data.analytics;

  const criticalSubject = analytics.criticalSubject;

  const institutionalTarget = 1.5;
  const institutionalBase = 930;

  // Recalcular con la base real institucional
  const nonPromotionRate = Number(
    (
      (analytics.notPromotedStudents / institutionalBase) *
      100
    ).toFixed(1)
  );

  const targetMet = nonPromotionRate <= institutionalTarget;

  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-8">
        <div className="bg-linear-to-l from-blue-50 via-white to-blue-100 relative rounded-xl p-6 shadow-sm h-full flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase mb-4">
              Índice de repitencia escolar
            </p>

            <h2
              className={`text-7xl font-bold ${
                targetMet ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {nonPromotionRate}%
            </h2>

            <div className="mt-2 flex items-center gap-3">
              <span className="text-sm text-slate-600">
                Meta:
                <span className="font-semibold ml-1">&lt; 1.5%</span>
              </span>

              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  targetMet
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {targetMet ? "Cumple meta" : "Fuera de meta"}
              </span>
            </div>
          </div>

          <PromotionGauge value={nonPromotionRate} />

          <div className="flex justify-around gap-4 bg-white p-4 rounded-xl mt-12">
            {/* Promovidos */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-100 flex items-center justify-center">
                <IconRewardedAds className="size-10 text-emerald-600" />
              </div>

              <div>
                <p className="text-3xl font-bold text-emerald-600">
                  {analytics.promotedStudents}
                </p>

                <p className="text-sm text-slate-800 font-semibold">
                  Promovidos
                </p>

                <p className="text-xs text-slate-600">
                  {analytics.promotionRate}% del total
                </p>
              </div>
            </div>

            <div className="w-0.5 bg-border h-full"></div>

            {/* Riesgo */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-100 flex items-center justify-center">
                <IconRewardedAds className="size-10 text-amber-600" />
              </div>

              <div>
                <p className="text-3xl font-bold text-amber-600">
                  {analytics.promotedWithLossList.length}
                </p>

                <p className="text-sm text-slate-800 font-semibold">
                  Estudiantes en riesgo
                </p>

                <p className="text-xs text-slate-600">
                  Promovidos con pérdidas
                </p>
              </div>
            </div>

            <div className="w-0.5 bg-border h-full"></div>

            {/* No promovidos */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-100 flex items-center justify-center">
                <IconRewardedAds className="size-10 text-red-600" />
              </div>

              <div>
                <p className="text-3xl font-bold text-red-600">
                  {analytics.notPromotedStudents}
                </p>

                <p className="text-sm text-slate-800 font-semibold">
                  No promovidos
                </p>

                <p className="text-xs text-slate-600">
                  {nonPromotionRate}% del total institucional
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-4 flex flex-col gap-5">
        <PromotionKpiCard
          title="Estudiantes evaluados"
          value={`${analytics.totalStudents}`}
          subtitle={`100% del total`}
          color="blue"
        />

        <PromotionKpiCard
          title="Materia crítica"
          value={criticalSubject?.subject ?? "-"}
          subtitle={`${criticalSubject?.failedStudents ?? 0} estudiantes en bajo`}
          color="red"
        />
      </div>
    </div>
  );
}