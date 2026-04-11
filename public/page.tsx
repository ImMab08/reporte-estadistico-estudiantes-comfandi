"use client";

import { useMemo } from "react";

import { getAcademicSnapshots } from "@/src/utils/academicStorage";
import { isVisibleSubject } from "@/src/utils/studentPhotoPreview";
import { StudentDetailsFeacture } from "@/src/features/students_report_feature/student_details_feature";

type Props = {
  params: {
    id: string;
  };
  searchParams: {
    period?: string;
  };
};

export function StudentPage({ params, searchParams }: Props) {
  const studentId = String(params.id);

  const snapshots = Object.values(getAcademicSnapshots());
  const activeSnapshot =
    snapshots.find(
      (snapshot) =>
        `${snapshot.year}-${snapshot.period}` === searchParams.period,
    ) ?? snapshots[0];

  const selectedStudent =
    activeSnapshot?.students.find((s) => s.id === studentId) ?? null;

  const sortedSubjects = useMemo(() => {
    if (!selectedStudent) return [];

    return Object.entries(selectedStudent.grades).filter(([subject, level]) =>
      isVisibleSubject(subject, level),
    );
  }, [selectedStudent]);

  return (
    <div className="size-full bg-slate-50 p-4">
      <StudentDetailsFeacture
        selectedStudent={selectedStudent}
        activeSnapshot={activeSnapshot}
        sortedSubjects={sortedSubjects}
      />
    </div>
  );
}
