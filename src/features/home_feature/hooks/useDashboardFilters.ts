import { useMemo } from "react";
import type { AcademicPeriodSnapshot } from "@/src/shared/types/academic.types";

type UseDashboardFiltersProps = {
  snapshots: AcademicPeriodSnapshot[];
  selectedPeriodId: string;
  selectedGrade: string;
  selectedGroup: string;
  selectedStudentId: string;
};

export function useDashboardFilters({
  snapshots,
  selectedPeriodId,
  selectedGrade,
  selectedGroup,
  selectedStudentId,
}: UseDashboardFiltersProps) {
  const activeSnapshot = useMemo(
    () => snapshots.find((s) => s.id === selectedPeriodId) ?? null,
    [snapshots, selectedPeriodId],
  );

  const gradeOptions = useMemo(() => {
    if (!activeSnapshot) return [];

    return [...new Set(activeSnapshot.students.map((s) => s.grade))].sort(
      (a, b) => Number(a) - Number(b),
    );
  }, [activeSnapshot]);

  const groupOptions = useMemo(() => {
    if (!activeSnapshot) return [];

    const groups = activeSnapshot.students
      .filter((s) =>
        selectedGrade === "all" ? true : s.grade === selectedGrade,
      )
      .map((s) => s.group);

    return [...new Set(groups)].sort();
  }, [activeSnapshot, selectedGrade]);

  const filteredStudents = useMemo(() => {
    if (!activeSnapshot) return [];

    return activeSnapshot.students.filter((student) => {
      const gradeMatch =
        selectedGrade === "all" || student.grade === selectedGrade;

      const groupMatch =
        selectedGroup === "all" || student.group === selectedGroup;

      const studentMatch =
        !selectedStudentId || student.id === selectedStudentId;

      return gradeMatch && groupMatch && studentMatch;
    });
  }, [
    activeSnapshot,
    selectedGrade,
    selectedGroup,
    selectedStudentId,
  ]);

  return {
    activeSnapshot,
    gradeOptions,
    groupOptions,
    filteredStudents,
  };
}