"use client";

import { useMemo } from "react";

type Student = {
  grade: string;
  group: string;
};

type Snapshot = {
  students: Student[];
};

type Props = {
  activeSnapshot: Snapshot | null;
  selectedGrade: string;
  selectedGroup: string;
};

export function useDashboardFilters({
  activeSnapshot,
  selectedGrade,
  selectedGroup,
}: Props) {
  const gradeOptions = useMemo<string[]>(() => {
    if (!activeSnapshot) return [];

    return [...new Set(
      activeSnapshot.students.map((student) => student.grade)
    )].sort((a, b) => Number(a) - Number(b));
  }, [activeSnapshot]);

  const groupOptions = useMemo<string[]>(() => {
    if (!activeSnapshot) return [];

    return activeSnapshot.students
      .filter((student) =>
        selectedGrade === "all"
          ? true
          : student.grade === selectedGrade
      )
      .map((student) => student.group)
      .filter(
        (value, index, array) =>
          array.indexOf(value) === index
      )
      .sort((a, b) => Number(a) - Number(b));
  }, [activeSnapshot, selectedGrade]);

  const filteredStudents = useMemo<Student[]>(() => {
    if (!activeSnapshot) return [];

    return activeSnapshot.students.filter((student) => {
      const gradeMatch =
        selectedGrade === "all" ||
        student.grade === selectedGrade;

      const groupMatch =
        selectedGroup === "all" ||
        student.group === selectedGroup;

      return gradeMatch && groupMatch;
    });
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