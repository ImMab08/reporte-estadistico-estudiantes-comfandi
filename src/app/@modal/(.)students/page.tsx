"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { StudentDetailsFeacture } from "@/src/features/students_report_feature/student_details_feature";
import { getAcademicSnapshots } from "@/src/utils/academicStorage";
import { isVisibleSubject } from "@/src/utils/studentPhotoPreview";

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
      (snapshot) =>
        `${snapshot.year}-${snapshot.period}` === period,
    ) ?? snapshots[0];

  const selectedStudent =
    activeSnapshot.students.find(
      (student) => student.id === studentId,
    ) ?? null;

  const sortedSubjects = selectedStudent
    ? Object.entries(selectedStudent.grades).filter(([subject, level]) =>
        isVisibleSubject(subject, level),
      )
    : [];

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
      onClick={() => router.back()}
    >
      <div
        className="w-[80vw] h-[85vh] rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <StudentDetailsFeacture
          selectedStudent={selectedStudent}
          activeSnapshot={activeSnapshot}
          sortedSubjects={sortedSubjects}
        />
      </div>
    </div>
  );
}