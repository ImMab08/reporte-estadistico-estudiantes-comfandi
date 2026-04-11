"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { getAcademicSnapshots } from "@/src/utils/academicStorage";
import { isVisibleSubject } from "@/src/utils/studentPhotoPreview";

import { useStudentFilters } from "@/src/shared/hooks/use_student_filters";
import type { AcademicPeriodSnapshot } from "@/src/shared/types/academic.types";

import { StudentInteractiveCard } from "@/src/components/layout/student_interactive_card";
import { StudentDetailsFeacture } from "./student_details_feature";

import { IconQuickReference, IconRefresh } from "@/src/shared/icons";

export function StudentsFeaturePage() {
  //? Constantes
  // Intercepting routes + parallel routes
  const [snapshots, setSnapshots] = useState<AcademicPeriodSnapshot[]>([]);

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

  const [subjectSort, setSubjectSort] = useState<"alphabetical" | "grade">(
    "grade",
  );

  useEffect(() => {
    const data = Object.values(getAcademicSnapshots()).sort(
      (a, b) => b.period - a.period,
    );

    setSnapshots(data);
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

    const normalizedSearch = search.trim().toLowerCase();

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
  }, [activeSnapshot, selectedGrade, selectedGroup, search]);

  const selectedStudent =
    filteredStudents.find((s) => s.id === selectedStudentId) ?? null;

  console.log("estudiantes: ", filteredStudents);

  const visibleSubjects = useMemo(() => {
    if (!selectedStudent) return [];

    return Object.entries(selectedStudent.grades).filter(([subject, level]) =>
      isVisibleSubject(subject, level),
    );
  }, [selectedStudent]);

  const sortedSubjects = useMemo(() => {
    const levelOrder: Record<string, number> = {
      superior: 4,
      alto: 3,
      basico: 2,
      básico: 2,
      bajo: 1,
    };

    const subjects = [...visibleSubjects];

    if (subjectSort === "alphabetical") {
      return subjects.sort(([a], [b]) => a.localeCompare(b));
    }

    return subjects.sort(([, levelA], [, levelB]) => {
      const a = levelOrder[String(levelA).toLowerCase()] || 0;
      const b = levelOrder[String(levelB).toLowerCase()] || 0;
      return b - a;
    });
  }, [visibleSubjects, subjectSort]);

  const strengths = useMemo(() => {
    if (!selectedStudent) return [];

    return Object.entries(selectedStudent.grades)
      .filter(
        ([subject, v]) =>
          isVisibleSubject(subject, v) &&
          ["alto", "superior"].some((k) => String(v).toLowerCase().includes(k)),
      )
      .slice(0, 3)
      .map(([k]) => k);
  }, [selectedStudent]);

  const attention = useMemo(() => {
    if (!selectedStudent) return [];

    return Object.entries(selectedStudent.grades)
      .filter(
        ([subject, v]) =>
          isVisibleSubject(subject, v) &&
          ["bajo", "basico"].some((k) => String(v).toLowerCase().includes(k)),
      )
      .slice(0, 3)
      .map(([k]) => k);
  }, [selectedStudent]);

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
      <header className="mb-4 border-b border-border pb-3.25 shrink-0 flex items-center justify-between">
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
          sortedSubjects={sortedSubjects}
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
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
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
