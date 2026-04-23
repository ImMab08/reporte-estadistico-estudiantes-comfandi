"use client";

import { useMemo } from "react";

type Props = {
  activeSnapshot: any;
  selectedGrade: string;
  selectedGroup: string;
};

export function useDashboardFilters({
  activeSnapshot,
  selectedGrade,
  selectedGroup,
}: Props) {
  const gradeOptions = useMemo(() => {
    if (!activeSnapshot) return [];

    return [...new Set(
      activeSnapshot.students.map(
        (s: any) => s.grade
      )
    )].sort((a, b) => Number(a) - Number(b));
  }, [activeSnapshot]);

  const groupOptions = useMemo(() => {
    if (!activeSnapshot) return [];

    return activeSnapshot.students
      .filter((s: any) =>
        selectedGrade === "all"
          ? true
          : s.grade === selectedGrade
      )
      .map((s: any) => s.group)
      .filter(
        (v: string, i: number, arr: string[]) =>
          arr.indexOf(v) === i
      )
      .sort((a, b) => Number(a) - Number(b));
  }, [activeSnapshot, selectedGrade]);

  const filteredStudents = useMemo(() => {
    if (!activeSnapshot) return [];

    return activeSnapshot.students.filter(
      (student: any) => {
        const gradeMatch =
          selectedGrade === "all" ||
          student.grade === selectedGrade;

        const groupMatch =
          selectedGroup === "all" ||
          student.group === selectedGroup;

        return gradeMatch && groupMatch;
      }
    );
  }, [
    activeSnapshot,
    selectedGrade,
    selectedGroup,
  ]);

  return {
    gradeOptions,
    groupOptions,
    filteredStudents,
  };
}