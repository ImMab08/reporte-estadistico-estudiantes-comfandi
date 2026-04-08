import { useMemo, useState } from "react";
import type { AcademicPeriodSnapshot } from "@/src/shared/types/academic.types";

export function useDashboardFilters(
  snapshots: AcademicPeriodSnapshot[],
) {
  const [selectedId, setSelectedId] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedGroup, setSelectedGroup] = useState("all");

  const activeSnapshot = useMemo(
    () => snapshots.find((s) => s.id === selectedId) ?? null,
    [snapshots, selectedId],
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

      return gradeMatch && groupMatch;
    });
  }, [activeSnapshot, selectedGrade, selectedGroup]);

  return {
    selectedId,
    setSelectedId,
    selectedGrade,
    setSelectedGrade,
    selectedGroup,
    setSelectedGroup,
    activeSnapshot,
    gradeOptions,
    groupOptions,
    filteredStudents,
  };
}