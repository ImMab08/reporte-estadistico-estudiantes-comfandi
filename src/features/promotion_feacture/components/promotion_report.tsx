import { useState } from "react";
import { PromotionGradeModal } from "./promotion_grade_modal";
import { PromotionSnapshot } from "../promotion.types";
import { PromotionFailedSubjects } from "./promotion_failed_subjects";
import { PromotionGrade } from "./promotion_grade";

import { PromotionHeader } from "./promotion_header";
import { PromotionKpis } from "./promotion_kpis";
import { PromotionLossDistribution } from "./promotion_loss_distribution";
import { PromotionNotPromoted } from "./promotion_not_promoted";
import { PromotionSubjectModal } from "./promotion_subject_modal";
import { PromotionLossDistributionModal } from "./promotion_loss_distribution_modal";

type Props = {
  data: PromotionSnapshot;
  onClear: () => void;
};

export function PromotionReport({ data, onClear }: Props) {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedLosses, setSelectedLosses] = useState<number | null>(null);

  return (
    <div className="size-full bg-slate-50 p-3 md:p-4 flex flex-col overflow-auto gap-5">
      <PromotionHeader data={data} />
      <PromotionKpis data={data} />

      <div className="flex gap-4">
        <PromotionLossDistribution
          data={data.analytics.lossDistribution}
          totalStudents={data.analytics.totalStudents}
          students={data.students}
          onSelectLosses={setSelectedLosses}
        />

        <div className="h-158">
          <PromotionNotPromoted data={data.analytics.notPromotedStudentsList} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-6">
          <PromotionFailedSubjects
            data={data.analytics.failedSubjects}
            onSelectSubject={setSelectedSubject}
          />
        </div>

        <div className="col-span-6">
          <PromotionGrade
            data={data.analytics.gradeMetrics}
            onSelectGrade={setSelectedGrade}
          />
        </div>
      </div>

      <PromotionGradeModal
        open={!!selectedGrade}
        grade={selectedGrade}
        students={data.students}
        onClose={() => setSelectedGrade(null)}
      />

      <PromotionSubjectModal
        open={!!selectedSubject}
        subject={selectedSubject}
        students={data.students}
        onClose={() => setSelectedSubject(null)}
      />

      <PromotionLossDistributionModal
        open={selectedLosses !== null}
        losses={selectedLosses}
        students={data.students}
        onClose={() => setSelectedLosses(null)}
      />
    </div>
  );
}
