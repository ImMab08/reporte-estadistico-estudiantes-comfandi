import { IconRewardedAds } from "@/src/shared/icons";
import { PromotionSnapshot } from "../promotion.types";
import { PromotionKpiCard } from "./promotion_kpi_card";
import { PromotionGauge } from "./promotion_gauge";

type Props = {
  data: PromotionSnapshot;
};

export function PromotionKpis({ data }: Props) {
  const analytics = data.analytics;

  return (
    <div className="grid grid-cols-12 gap-5">
      {/* KPI principal */}
      <div className="col-span-8">
        <div className="bg-linear-to-l  from-blue-50 via-white to-blue-100 relative rounded-xl p-6 shadow-sm h-full flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase mb-4">
              Índice institucional de promoción
            </p>
            <h2 className="text-7xl font-bold text-primary">
              {analytics.promotionRate}%
            </h2>
          </div>
        
          <PromotionGauge value={analytics.promotionRate} />

          <div className="flex justify-around gap-4 bg-white p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-violet-100 flex items-center justify-center">
                <IconRewardedAds className="size-10 text-violet-600" />
              </div>

              <div>
                <p className="text-3xl font-bold text-primary">
                  {analytics.totalStudents}
                </p>

                <p className="text-sm text-slate-800 font-semibold">
                  Estudiantes evaluados
                </p>
                <p className="text-xs text-slate-600">100% del total</p>
              </div>
            </div>

            <div className="w-0.5 bg-border h-full"></div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-100 flex items-center justify-center">
                <IconRewardedAds className="size-10 text-emerald-600" />
              </div>

              <div>
                <p className="text-3xl font-bold text-primary">
                  {analytics.promotedStudents}
                </p>

                <p className="text-sm text-slate-800 font-semibold">
                  Promovidos
                </p>
                <p className="text-xs text-slate-600">100% del total</p>
              </div>
            </div>

            <div className="w-0.5 bg-border h-full"></div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-100 flex items-center justify-center">
                <IconRewardedAds className="size-10 text-red-600" />
              </div>

              <div>
                <p className="text-3xl font-bold text-primary">
                  {analytics.notPromotedStudents}
                </p>
                <p className="text-sm text-slate-800 font-semibold">
                  No promovidos
                </p>
                <p className="text-xs text-slate-600">100% del total</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel lateral */}
      <div className="col-span-4 flex flex-col gap-5">
        <PromotionKpiCard
          title="Mejor desempeño"
          value={
            analytics.gradeMetrics.reduce((prev, current) =>
              current.rate > prev.rate ? current : prev,
            ).grade
          }
          subtitle="100% promoción"
          color="emerald"
        />

        <PromotionKpiCard
          title="Mayor riesgo"
          value={
            analytics.gradeMetrics.reduce((prev, current) =>
              current.rate < prev.rate ? current : prev,
            ).grade
          }
          subtitle="Menor tasa de promoción"
          color="red"
        />
      </div>
    </div>
  );
}
