"use client";

import { useEffect, useMemo, useState } from "react";

import { getAcademicSnapshots } from "@/src/utils/academicStorage";
import { useAcademicFilters } from "@/src/shared/hooks/use_academic_filters";

import type { AcademicPeriodSnapshot } from "@/src/shared/types/academic.types";

import { usePeriodAnalytics } from "./usePeriodAnalytics";

export function useHomeController() {
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

  const { activeSnapshot, selectedGrade, selectedGroup } = filters;

  const gradeOptions = useMemo(() => {
    if (!activeSnapshot) return [];

    return [
      ...new Set(activeSnapshot.students.map((student) => student.grade)),
    ].sort((a, b) => Number(a) - Number(b));
  }, [activeSnapshot]);

  const groupOptions = useMemo(() => {
    if (!activeSnapshot) return [];

    return activeSnapshot.students
      .filter((student) =>
        selectedGrade === "all" ? true : student.grade === selectedGrade,
      )
      .map((student) => student.group)
      .filter((value, index, array) => array.indexOf(value) === index)
      .sort((a, b) => Number(a) - Number(b));
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

  const analytics = usePeriodAnalytics(filteredStudents);

  const subjectHealthMetrics = useMemo(() => {
    const subjectMap: Record<
      string,
      {
        total: number;
        superior: number;
        alto: number;
        basico: number;
        bajo: number;
      }
    > = {};

    filteredStudents.forEach((student) => {
      Object.entries(student.grades).forEach(([subject, level]) => {
        const cleanSubject = subject.trim().toUpperCase();

        const blockedSubjects = [
          "#",
          "PERDIDAS",
          "PERDIDA",
          "PÉRDIDAS",
          "TOTAL",
          "PROMEDIO",
          "",
        ];

        if (blockedSubjects.includes(cleanSubject)) return;

        const value = String(level)
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .trim();

        if (!value || value === "n/a" || value === "na") return;

        if (!subjectMap[subject]) {
          subjectMap[subject] = {
            total: 0,
            superior: 0,
            alto: 0,
            basico: 0,
            bajo: 0,
          };
        }

        subjectMap[subject].total++;

        if (value === "superior") {
          subjectMap[subject].superior++;
        }

        if (value === "alto") {
          subjectMap[subject].alto++;
        }

        if (value === "basico") {
          subjectMap[subject].basico++;
        }

        if (value === "bajo") {
          subjectMap[subject].bajo++;
        }
      });
    });

    return Object.entries(subjectMap).map(([subject, stats]) => {
      const superior = Math.round((stats.superior / stats.total) * 100);

      const alto = Math.round((stats.alto / stats.total) * 100);

      const basico = Math.round((stats.basico / stats.total) * 100);

      const bajo = Math.round((stats.bajo / stats.total) * 100);

      const health = Math.min(superior + alto, 100);

      return {
        subject,
        superior,
        alto,
        basico,
        bajo,
        health,
      };
    });
  }, [filteredStudents]);

  return {
    snapshots,
    isLoading,
    progress,

    gradeOptions,
    groupOptions,
    filteredStudents,

    analytics,
    subjectHealthMetrics,

    ...filters,
  };
}
