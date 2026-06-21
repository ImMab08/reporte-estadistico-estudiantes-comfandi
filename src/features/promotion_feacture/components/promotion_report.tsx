import { PromotionSnapshot } from "../promotion.types";
import { PromotionFailedSubjects } from "./promotion_failed_subjects";
import { PromotionGrade } from "./promotion_grade";

import { PromotionHeader } from "./promotion_header";
import { PromotionKpis } from "./promotion_kpis";
import { PromotionNotPromoted } from "./promotion_not_promoted";

type Props = {
  data: PromotionSnapshot;
  onClear: () => void;
};

export function PromotionReport({ data, onClear }: Props) {
  return (
    <div className="size-full bg-slate-50 p-3 md:p-4 flex flex-col overflow-auto gap-5">
      <PromotionHeader data={data} />
      <PromotionKpis data={data} />

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-7">
          <PromotionFailedSubjects data={data.analytics.failedSubjects} />
        </div>

        <div className="col-span-5">
          <PromotionGrade data={data.analytics.gradeMetrics} />
        </div>
      </div>

      <div className="col-span-6 max-h-150">
        <PromotionNotPromoted data={data.analytics.notPromotedStudentsList} />
      </div>

      <button
        onClick={onClear}
        className="bg-red-500 text-white px-4 py-2 rounded-xl"
      >
        Eliminar datos
      </button>
    </div>
  );
}
