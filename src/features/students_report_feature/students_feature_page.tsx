"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { getAcademicSnapshots } from "@/src/utils/academicStorage";
import type {
  AcademicPeriodSnapshot,
  StudentRecord,
} from "@/src/shared/types/academic.types";
import { useFilterUrlState } from "@/src/shared/hooks/useFilterUrlState";
import { IconQuickReference, IconRefresh, IconWebTraffic } from "@/src/shared/icons";
import { useStudentFilters } from "@/src/shared/hooks/useStudentFilters";

function normalizePhotoName(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function getStudentPhotoPath(student: StudentRecord) {
  const folder = `Yumbo ${student.grade}-${student.group}`;
  const fileName = `${normalizePhotoName(student.name)}.jpg`;

  return `/img/fotos_estudiantes_yumbo_2026/${folder}/${fileName}`;
}

function isVisibleSubject(subject: string, value: unknown) {
  if (value === null || value === undefined) return false;

  const subjectName = String(subject).trim().toUpperCase();
  const text = String(value).trim().toUpperCase();

  // Omitir columnas que no son materias
  const excludedFields = ["#", "PERDIDAS", "PÉRDIDAS"];

  if (excludedFields.includes(subjectName)) return false;

  // Omitir valores vacíos
  if (!text) return false;
  if (text === "#") return false;
  if (text === "-") return false;
  if (text === "N/A") return false;
  if (text === "NA") return false;
  if (text === "NO APLICA") return false;

  return true;
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function classifyStudent(student: StudentRecord) {
  const levels = {
    bajo: 0,
    basico: 0,
    alto: 0,
    superior: 0,
  };

  Object.entries(student.grades).forEach(([subject, value]) => {
    if (!isVisibleSubject(subject, value)) return;

    const v = normalizeText(String(value));

    if (v.includes("bajo")) levels.bajo++;
    else if (v.includes("basico")) levels.basico++;
    else if (v.includes("alto")) levels.alto++;
    else if (v.includes("superior")) levels.superior++;
  });

  return levels;
}

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

  const metrics = useMemo(() => {
    if (!selectedStudent) {
      return {
        bajo: 0,
        basico: 0,
        alto: 0,
        superior: 0,
      };
    }

    return classifyStudent(selectedStudent);
  }, [selectedStudent]);

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
        <section className="w-full min-h-0 overflow-hidden bg-white border border-border rounded-xl flex flex-col">
          {!selectedStudent ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center leading-6 text-slate-400 text-xl font-medium">
              <IconWebTraffic className="size-18" />
              <p>
                Selecciona un estudiante <br /> para ver su información
              </p>
            </div>
          ) : (
            <>
              <div className="p-4 flex gap-4 shrink-0">
                <div className="relative w-52 h-64 rounded-2xl bg-slate-200 overflow-hidden shrink-0">
                  <Image
                    src={getStudentPhotoPath(selectedStudent)}
                    alt={selectedStudent.name}
                    fill
                    className="object-cover object-center"
                    sizes="230px"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-4xl font-bold text-slate-800">
                    {selectedStudent.name}
                  </h2>

                  <p className="text-slate-400">Código: {selectedStudent.id}</p>

                  <div className="inline-block mt-2">
                    <p>
                      <span className="font-semibold">Grado:</span>{" "}
                      {selectedStudent.grade}
                    </p>
                    <p>
                      <span className="font-semibold">Curso:</span>{" "}
                      {selectedStudent.grade}-{selectedStudent.group}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="mb-2 text-lg">
                      <span className="font-semibold">Periodo:</span>{" "}
                      {activeSnapshot.period} · {activeSnapshot.year}
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        ["Superior", metrics.superior, "bg-emerald-500"],
                        ["Alto", metrics.alto, "bg-blue-500"],
                        ["Básico", metrics.basico, "bg-amber-400"],
                        ["Bajo", metrics.bajo, "bg-red-500"],
                      ].map(([label, value, color]) => (
                        <div key={String(label)} className="text-center">
                          <div
                            className={`${color} text-white rounded-xl py-3 text-2xl font-bold`}
                          >
                            {value}
                          </div>
                          <p className="mt-2 text-slate-500">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-slate-800">
                    Materias
                  </h3>

                  <div className="flex gap-3">
                    <select
                      value={subjectSort}
                      onChange={(e) =>
                        setSubjectSort(
                          e.target.value as "alphabetical" | "grade",
                        )
                      }
                      className="rounded-xl border border-slate-300 px-3 py-2 text-sm cursor-pointer"
                    >
                      <option value="grade">Por rendimiento</option>
                      <option value="alphabetical">Por materias</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  {sortedSubjects.map(([subject, level]) => (
                    <div
                      key={subject}
                      className="flex items-center justify-between border-b border-slate-300 pb-2"
                    >
                      <span className="text-slate-600">{subject}</span>
                      <span className="px-3 py-1 rounded-lg text-white text-sm font-bold bg-blue-500">
                        {String(level)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">
                    Evolución por Periodos
                  </h3>

                  <div className="h-56 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400">
                    Próximo: comparativa P1 · P2 · P3
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        <aside className="max-w-100 w-120 h-full bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col space-y-2">
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
              <button
                key={student.id}
                onClick={() => handleStudentSelect(student.id)}
                className={`w-full text-left px-4 py-3 border-t cursor-pointer border-slate-100 hover:bg-slate-200 transition-all duration-300 hover:text-primary ${
                  selectedStudent?.id === student.id
                    ? "bg-primary text-white"
                    : "text-slate-700"
                }`}
              >
                <div>
                  <p className="text-sm text-slate-400">
                    Curso: {student.grade}-{student.group}
                  </p>
                  {student.name}
                </div>
              </button>
            ))}
          </div>
        </aside>
      </section>
    </section>
  );
}
