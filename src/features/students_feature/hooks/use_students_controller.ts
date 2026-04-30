"use client";

import { useEffect, useMemo, useState } from "react";

import { ComparisonChartItem, LevelKey } from "../types/students.types";

import { getAcademicSnapshots } from "@/src/utils/academicStorage";
import { useAcademicFilters } from "@/src/shared/hooks/use_academic_filters";
import type { AcademicPeriodSnapshot } from "@/src/shared/types/academic.types";

import { getUserFromCookie } from "@/src/lib/auth";
import { canAccessGrade } from "@/src/lib/permissions";

export function useStudentsController() {
  const [localSearch, setLocalSearch] = useState("");
  const [snapshots, setSnapshots] = useState<AcademicPeriodSnapshot[]>([]);

  const user = getUserFromCookie();

  // Carga inmediata (SIN loading artificial)
  useEffect(() => {
    const data = Object.values(getAcademicSnapshots()).sort(
      (a, b) => b.period - a.period,
    );

    setSnapshots(data);
  }, []);

  const filters = useAcademicFilters(snapshots);

  const {
    selectedGrade,
    selectedGroup,
    selectedStudentId,
    activeSnapshot,
    handleStudentChange,
  } = filters;

  const handleStudentSelect = (id: string) => {
    handleStudentChange(id);
  };

  const normalizedSearch = localSearch.trim().toLowerCase();

  // Grades
  const gradeOptions = useMemo(() => {
    if (!activeSnapshot) return [];

    const grades = [
      ...new Set(activeSnapshot.students.map((s) => s.grade)),
    ].sort((a, b) => Number(a) - Number(b));

    return grades.filter((grade) => canAccessGrade(user, Number(grade)));
  }, [activeSnapshot, user]);

  //  Groups
  const groupOptions = useMemo(() => {
    if (!activeSnapshot) return [];

    return activeSnapshot.students
      .filter((s) => canAccessGrade(user, Number(s.grade)))
      .filter((s) =>
        selectedGrade === "all" ? true : s.grade === selectedGrade,
      )
      .map((s) => s.group)
      .filter((value, index, array) => array.indexOf(value) === index)
      .sort((a, b) => Number(a) - Number(b));
  }, [activeSnapshot, selectedGrade, user]);

  // Students filtrados
  const filteredStudents = useMemo(() => {
    if (!activeSnapshot) return [];

    return activeSnapshot.students
      .filter((student) => canAccessGrade(user, Number(student.grade)))
      .filter((student) => {
        const gradeMatch =
          selectedGrade === "all" || student.grade === selectedGrade;

        const groupMatch =
          selectedGroup === "all" || student.group === selectedGroup;

        const searchMatch =
          !normalizedSearch ||
          student.name.toLowerCase().includes(normalizedSearch) ||
          student.id.toLowerCase().includes(normalizedSearch);

        return gradeMatch && groupMatch && searchMatch;
      })
      .sort((a, b) => a.name.localeCompare(b.name, "es"));
  }, [activeSnapshot, selectedGrade, selectedGroup, normalizedSearch, user]);

  // Estudiante seleccionado
  const selectedStudent =
    activeSnapshot?.students.find((s) => s.id === selectedStudentId) ?? null;

  // Comparativa histórica
  const comparisonData = useMemo(() => {
    if (!selectedStudentId) return [];

    const baseLevels: Record<LevelKey, ComparisonChartItem> = {
      Superior: { level: "Superior" },
      Alto: { level: "Alto" },
      Básico: { level: "Básico" },
      Bajo: { level: "Bajo" },
    };

    snapshots
      .slice()
      .sort((a, b) => a.period - b.period)
      .forEach((snapshot) => {
        const student = snapshot.students.find(
          (s) => s.id === selectedStudentId,
        );

        if (!student) return;

        const counts = {
          superior: 0,
          alto: 0,
          basico: 0,
          bajo: 0,
        };

        Object.values(student.grades).forEach((level) => {
          const value = String(level)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

          if (value === "superior") counts.superior++;
          else if (value === "alto") counts.alto++;
          else if (value.includes("basico")) counts.basico++;
          else if (value === "bajo") counts.bajo++;
        });

        const key = `P${snapshot.period}`;

        baseLevels.Superior[key] = counts.superior;
        baseLevels.Alto[key] = counts.alto;
        baseLevels["Básico"][key] = counts.basico;
        baseLevels.Bajo[key] = counts.bajo;
      });

    return Object.values(baseLevels);
  }, [snapshots, selectedStudentId]);

  // Protección de permisos
  useEffect(() => {
    if (
      selectedGrade !== "all" &&
      !canAccessGrade(user, Number(selectedGrade))
    ) {
      filters.handleGradeChange("all");
    }
  }, [user, selectedGrade, filters]);

  return {
    snapshots,

    localSearch,
    setLocalSearch,

    selectedStudent,

    gradeOptions,
    groupOptions,
    filteredStudents,
    comparisonData,

    handleStudentSelect,

    ...filters,
  };
}
