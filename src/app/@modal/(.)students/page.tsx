"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { StudentDetailsFeacture } from "@/src/features/students_report_feature/student_details_feature";
import { getAcademicSnapshots } from "@/src/utils/academicStorage";

export default function StudentModal() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isModal = searchParams.get("modal") === "true";
  const studentId = searchParams.get("student");
  const period = searchParams.get("period");

  if (!isModal || !studentId) {
    return null;
  }

  const snapshots = Object.values(getAcademicSnapshots());

  const activeSnapshot =
    snapshots.find(
      (snapshot) => `${snapshot.year}-${snapshot.period}` === period,
    ) ?? snapshots[0];

  const selectedStudent =
    activeSnapshot.students.find((student) => student.id === studentId) ?? null;

  function getPerformanceChartData(student: any) {
    if (!student) return [];

    const counts = {
      superior: 0,
      alto: 0,
      basico: 0,
      bajo: 0,
    };

    Object.entries(student.grades).forEach(([, level]) => {
      const normalizedLevel = String(level).toLowerCase();

      if (normalizedLevel === "superior") counts.superior++;
      else if (normalizedLevel === "alto") counts.alto++;
      else if (normalizedLevel === "basico" || normalizedLevel === "básico")
        counts.basico++;
      else if (normalizedLevel === "bajo") counts.bajo++;
    });

    return [
      { level: "Superior", total: counts.superior },
      { level: "Alto", total: counts.alto },
      { level: "Básico", total: counts.basico },
      { level: "Bajo", total: counts.bajo },
    ];
  }

  const baseLevels = {
    Superior: { level: "Superior" },
    Alto: { level: "Alto" },
    Básico: { level: "Básico" },
    Bajo: { level: "Bajo" },
  };

  snapshots
    .sort((a, b) => a.period - b.period)
    .forEach((snapshot) => {
      const student = snapshot.students.find((s) => s.id === studentId);

      if (!student) return;

      const chart = getPerformanceChartData(student);
      const periodKey = `P${snapshot.period}`;

      chart.forEach((item) => {
        baseLevels[item.level][periodKey] = item.total;
      });
    });

  const comparisonChartData = Object.values(baseLevels);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-[4px] z-50 flex items-center justify-center p-4"
      onClick={() => router.back()}
    >
      <div
        className="w-[80vw] h-[90vh] rounded-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <StudentDetailsFeacture
          selectedStudent={selectedStudent}
          activeSnapshot={activeSnapshot}
          comparisonChartData={comparisonChartData}
        />
      </div>
    </div>
  );
}
