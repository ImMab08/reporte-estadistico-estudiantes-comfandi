"use client";

import { useEffect, useMemo, useState } from "react";

import { ComparisonChartItem, LevelKey } from "../types/students.types";

import { getAcademicSnapshots } from "@/src/utils/academicStorage";
import { useAcademicFilters } from "@/src/shared/hooks/use_academic_filters";
import type { AcademicPeriodSnapshot } from "@/src/shared/types/academic.types";

export function useStudentsController() {
  const [localSearch, setLocalSearch] = useState("");

  const [snapshots, setSnapshots] = useState<AcademicPeriodSnapshot[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 150);

    const data = Object.values(getAcademicSnapshots()).sort(
      (a, b) => b.period - a.period,
    );

    setTimeout(() => {
      setSnapshots(data);

      setProgress(100);

      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }, 1200);

    return () => clearInterval(interval);
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

  const gradeOptions = useMemo(() => {
    if (!activeSnapshot) return [];

    return [...new Set(activeSnapshot.students.map((s) => s.grade))].sort(
      (a, b) => Number(a) - Number(b),
    );
  }, [activeSnapshot]);

  const groupOptions = useMemo(() => {
    if (!activeSnapshot) return [];

    return activeSnapshot.students
      .filter((s) =>
        selectedGrade === "all" ? true : s.grade === selectedGrade,
      )
      .map((s) => s.group)
      .filter((value, index, array) => array.indexOf(value) === index)
      .sort((a, b) => Number(a) - Number(b));
  }, [activeSnapshot, selectedGrade]);

  const filteredStudents = useMemo(() => {
    if (!activeSnapshot) return [];

    return activeSnapshot.students
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
  }, [activeSnapshot, selectedGrade, selectedGroup, normalizedSearch]);

  const selectedStudent =
    activeSnapshot?.students.find((s) => s.id === selectedStudentId) ?? null;

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
          const value = String(level).toLowerCase();

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

  return {
    snapshots,
    isLoading,
    progress,

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
