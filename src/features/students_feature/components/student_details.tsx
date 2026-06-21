"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import { StudentDetailsFeacture } from "../student_details_feature";
import type { useStudentsController } from "../hooks/use_students_controller";
import StudentReportPrint from "@/src/components/layout/student_report_print";

type StudentsController = ReturnType<typeof useStudentsController>;

type Props = {
  controller: StudentsController;
};

export function StudentDetails({ controller }: Props) {
  const { selectedStudent, activeSnapshot, comparisonData, snapshots, selectedPeriodId, handlePeriodChange } = controller;

  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Reporte-${selectedStudent?.name ?? "estudiante"}`,
  });

  return (
    <>
      <StudentDetailsFeacture
        selectedStudent={selectedStudent}
        activeSnapshot={activeSnapshot}
        comparisonChartData={comparisonData}
        onPrint={handlePrint}
        snapshots={snapshots}
        selectedPeriodId={selectedPeriodId}
        onPeriodChange={handlePeriodChange}
      />

      <div className="hidden">
        <div ref={reportRef}>
          <StudentReportPrint />
        </div>
      </div>
    </>
  );
}
