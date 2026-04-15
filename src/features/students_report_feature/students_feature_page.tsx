"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { getAcademicSnapshots } from "@/src/utils/academicStorage";
import type { StudentRecord } from "@/src/shared/types/academic.types";

import { useStudentFilters } from "@/src/shared/hooks/use_student_filters";
import type { AcademicPeriodSnapshot } from "@/src/shared/types/academic.types";

import { StudentInteractiveCard } from "@/src/components/layout/student_interactive_card";
import { StudentDetailsFeacture } from "./student_details_feature";

import { IconQuickReference, IconRefresh } from "@/src/shared/icons";

type LevelKey = "Superior" | "Alto" | "Básico" | "Bajo";
type ComparisonChartItem = {
  level: LevelKey;
  [key: string]: string | number;
};

export function StudentsFeaturePage() {
  //? Constantes
  // Intercepting routes + parallel routes
  const [snapshots, setSnapshots] = useState<AcademicPeriodSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    search,
    selectedGrade,
    selectedGroup,
    selectedStudentId,
    selectedPeriodId,
    activeSnapshot,
    isGroupDisabled,
    handleSearch,
    handlePeriodChange,
    handleGradeChange,
    handleGroupChange,
    handleStudentSelect,
    clearFilters,
  } = useStudentFilters(snapshots);

  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const normalizedSearch = localSearch.trim().toLowerCase();

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, handleSearch]);

  useEffect(() => {
    const data = Object.values(getAcademicSnapshots()).sort(
      (a, b) => b.period - a.period,
    );

    setSnapshots(data);
    setIsLoading(false);
  }, []);

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

    return [...new Set(groups)].sort((a, b) => Number(a) - Number(b));
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
    filteredStudents.find((s) => s.id === selectedStudentId) ?? null;

  function getPerformanceChartData(
    student: StudentRecord | null,
  ): { level: LevelKey; total: number }[] {
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

  const comparisonData = useMemo(() => {
    if (!selectedStudentId) return { currentChart: [] };

    const baseLevels: Record<LevelKey, ComparisonChartItem> = {
      Superior: { level: "Superior" },
      Alto: { level: "Alto" },
      Básico: { level: "Básico" },
      Bajo: { level: "Bajo" },
    };

    snapshots
      .sort((a, b) => a.period - b.period)
      .forEach((snapshot) => {
        const student = snapshot.students.find(
          (s) => s.id === selectedStudentId,
        );

        if (!student) return;

        const chart = getPerformanceChartData(student);
        const periodKey = `P${snapshot.period}`;

        chart.forEach((item) => {
          const levelKey = item.level as LevelKey;
          baseLevels[levelKey][periodKey] = item.total;
        }); 
      });

    return {
      currentChart: Object.values(baseLevels),
    };
  }, [snapshots, selectedStudentId]);

  if (isLoading) {
    return (
      <div className="size-full bg-slate-50 p-4 flex items-center justify-center">
        <p className="text-slate-400 text-lg">Cargando estudiantes...</p>
      </div>
    );
  }

  if (!activeSnapshot) {
    return (
      <div className="size-full bg-slate-50 p-4 flex flex-col overflow-hidden">
        <header className="mb-4 border-b border-border py-3.25 shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary">Estudiantes</h1>
            <p className="text-slate-500 mt-1 mb-1">
              Consulta individual del rendimiento académico
            </p>
          </div>

          <div className="flex justify-center">
            <Image
              alt=""
              width={150}
              height={150}
              className="object-contain"
              src="/img/logo/logo_comfandi_blue.svg"
            />
          </div>
        </header>

        <div className="bg-white flex-1 overflow-auto rounded-xl border border-border p-4 text-center text-gray-400 flex flex-col items-center justify-center space-y-2">
          <IconQuickReference className="size-14" />
          <p className="text-lg">No hay datos cargados.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="size-full bg-slate-50 p-4 flex flex-col overflow-hidden">
      <header className="mb-4 border-b border-border py-3.25 shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary">Estudiantes</h1>
          <p className="text-slate-500 mt-1 mb-1">
            Consulta individual del rendimiento académico
          </p>
        </div>

        <div className="flex justify-center">
          <Image
            alt=""
            width={150}
            height={150}
            className="object-contain"
            src="/img/logo/logo_comfandi_blue.svg"
          />
        </div>
      </header>

      <section className="gap-4 flex flex-1 min-h-0 overflow-hidden rounded-xl">
        <StudentDetailsFeacture
          selectedStudent={selectedStudent}
          activeSnapshot={activeSnapshot}
          comparisonChartData={comparisonData.currentChart}
          // allSnapshots={snapshots}
        />

        <aside className="max-w-100 w-145 h-full bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col space-y-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-primary">Filtros</h1>
            <button
              onClick={clearFilters}
              className="rounded-xl border border-slate-200 p-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              <IconRefresh className="text-primary" />
            </button>
          </div>
          <input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-2"
            placeholder="Buscar estudiante..."
          />
          <div className="w-full">
            <select
              value={selectedPeriodId}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="rounded-xl w-full border border-slate-200 p-2 cursor-pointer"
            >
              {snapshots.map((snapshot) => (
                <option key={snapshot.id} value={snapshot.id}>
                  Periodo {snapshot.period} · {snapshot.year}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={selectedGrade}
              onChange={(e) => handleGradeChange(e.target.value)}
              className="rounded-xl border border-slate-200 p-2 cursor-pointer"
            >
              <option value="all">Grados</option>
              {gradeOptions.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}°
                </option>
              ))}
            </select>

            <select
              value={selectedGroup}
              disabled={isGroupDisabled}
              onChange={(e) => handleGroupChange(e.target.value)}
              className="rounded-xl border border-slate-200 p-2 cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="all">Grupo</option>
              {groupOptions.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-slate-200 overflow-hidden max-h-175 overflow-y-auto">
            {filteredStudents.map((student) => (
              <StudentInteractiveCard
                key={student.id}
                student={student}
                onClick={() => handleStudentSelect(student.id)}
              >
                <div
                  className={`w-full text-left px-4 py-3 border-t cursor-pointer border-slate-100 transition-all duration-300 ${
                    selectedStudent?.id === student.id
                      ? "bg-primary text-white"
                      : "text-slate-700 hover:bg-slate-200 hover:text-primary"
                  }`}
                >
                  <div>
                    <p
                      className={`text-sm ${
                        selectedStudent?.id === student.id
                          ? "text-slate-300"
                          : "text-slate-500"
                      }`}
                    >
                      Curso: {student.grade}-{student.group}
                    </p>
                    {student.name}
                  </div>
                </div>
              </StudentInteractiveCard>
            ))}
          </div>
        </aside>
      </section>
    </section>
  );
}
