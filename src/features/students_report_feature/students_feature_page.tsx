"use client";

import { useEffect, useMemo, useState } from "react";
import { getAcademicSnapshots } from "@/src/utils/academicStorage";
import type {
  AcademicPeriodSnapshot,
  StudentRecord,
} from "@/src/shared/types/academic.types";
import { IconQuickReference } from "@/src/shared/icons";

function normalizeName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function getStudentPhotoPath(student: StudentRecord) {
  const normalized = normalizeName(student.name);
  return `/students/${student.grade}-${student.group}/${normalized}.jpg`;
}

function classifyStudent(student: StudentRecord) {
  const levels = {
    bajo: 0,
    basico: 0,
    alto: 0,
    superior: 0,
  };

  Object.values(student.grades).forEach((value) => {
    const v = String(value).toLowerCase();

    if (v.includes("baj")) levels.bajo++;
    else if (v.includes("bas")) levels.basico++;
    else if (v.includes("alt")) levels.alto++;
    else if (v.includes("sup")) levels.superior++;
  });

  return levels;
}

export function StudentsFeaturePage() {
  const [snapshots, setSnapshots] = useState<AcademicPeriodSnapshot[]>([]);
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");

  useEffect(() => {
    const data = Object.values(getAcademicSnapshots()).sort(
      (a, b) => b.period - a.period,
    );

    setSnapshots(data);
  }, []);

  const activeSnapshot = snapshots[0] ?? null;

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

    return activeSnapshot.students.filter((student) => {
      const gradeMatch =
        selectedGrade === "all" || student.grade === selectedGrade;

      const groupMatch =
        selectedGroup === "all" || student.group === selectedGroup;

      const searchMatch =
        !search ||
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.id.toLowerCase().includes(search.toLowerCase());

      return gradeMatch && groupMatch && searchMatch;
    });
  }, [activeSnapshot, selectedGrade, selectedGroup, search]);

  useEffect(() => {
    if (!selectedStudentId && filteredStudents.length) {
      setSelectedStudentId(filteredStudents[0].id);
    }
  }, [filteredStudents, selectedStudentId]);

  const selectedStudent =
    filteredStudents.find((s) => s.id === selectedStudentId) ??
    filteredStudents[0];

  if (!activeSnapshot || !selectedStudent) {
    return (
      <div className="size-full bg-slate-50 p-4 flex flex-col overflow-hidden">
        <header className="mb-6 border-b border-border pb-4 shrink-0">
          <h1 className="text-4xl font-bold text-primary">Estudiantes</h1>
          <p className="text-slate-500 mt-1 mb-1">
            Consulta individual del rendimiento académico
          </p>
        </header>

        <div className="bg-white flex-1 overflow-auto rounded-xl border border-border p-4 text-center text-gray-400 flex flex-col items-center justify-center space-y-2">
          <IconQuickReference className="size-14" />
          <p className="text-lg">No hay datos cargados.</p>
        </div>
      </div>
    );
  }

  const metrics = classifyStudent(selectedStudent);

  const strengths = Object.entries(selectedStudent.grades)
    .filter(([, v]) =>
      ["alto", "superior"].some((k) => String(v).toLowerCase().includes(k)),
    )
    .slice(0, 3)
    .map(([k]) => k);

  const attention = Object.entries(selectedStudent.grades)
    .filter(([, v]) =>
      ["bajo", "basico"].some((k) => String(v).toLowerCase().includes(k)),
    )
    .slice(0, 3)
    .map(([k]) => k);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-6 border-b border-slate-200 pb-4">
          <h1 className="text-4xl font-black text-blue-900">Estudiantes</h1>
          <p className="text-slate-500 mt-1">
            Consulta individual del rendimiento académico
          </p>
        </header>

        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-3 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 space-y-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              placeholder="Buscar estudiante..."
            />

            <div className="grid grid-cols-2 gap-3">
              <select
                value={selectedGrade}
                onChange={(e) => {
                  setSelectedGrade(e.target.value);
                  setSelectedGroup("all");
                }}
                className="rounded-2xl border border-slate-200 px-4 py-3"
              >
                <option value="all">Todos</option>
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}°
                  </option>
                ))}
              </select>

              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="rounded-2xl border border-slate-200 px-4 py-3"
              >
                <option value="all">Grupo</option>
                {groupOptions.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl border border-slate-200 overflow-hidden max-h-[700px] overflow-y-auto">
              {filteredStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudentId(student.id)}
                  className={`w-full text-left px-4 py-3 border-t border-slate-100 hover:bg-slate-50 ${
                    selectedStudent.id === student.id
                      ? "bg-blue-700 text-white"
                      : "text-slate-700"
                  }`}
                >
                  {student.name}
                </button>
              ))}
            </div>
          </aside>

          <main className="col-span-9 grid grid-cols-12 gap-6">
            <section className="col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 flex gap-6">
                <div className="w-52 h-64 rounded-2xl bg-slate-200 overflow-hidden shrink-0">
                  <img
                    src={getStudentPhotoPath(selectedStudent)}
                    alt={selectedStudent.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-4xl font-black text-slate-800 leading-tight">
                    {selectedStudent.name}
                  </h2>

                  <p className="text-slate-500 mt-3 text-xl">
                    Código: {selectedStudent.id}
                  </p>

                  <div className="inline-block mt-3 px-4 py-2 rounded-xl bg-slate-100 text-slate-700">
                    {selectedStudent.grade}° · Grupo {selectedStudent.group}
                  </div>

                  <div className="grid grid-cols-4 gap-2 mt-6">
                    {[
                      ["Bajo", metrics.bajo, "bg-red-500"],
                      ["Básico", metrics.basico, "bg-amber-400"],
                      ["Alto", metrics.alto, "bg-blue-500"],
                      ["Superior", metrics.superior, "bg-emerald-500"],
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

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-red-500 font-bold text-2xl">
                        Pérdidas: {metrics.bajo}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-emerald-500 font-bold text-2xl">
                        Fortalezas: {metrics.alto + metrics.superior}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 p-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  Observaciones
                </h3>

                <div className="space-y-3 text-lg">
                  <p>
                    ✅ <span className="font-semibold">Fortalezas:</span>{" "}
                    {strengths.join(", ") || "Sin fortalezas destacadas"}
                  </p>
                  <p>
                    ⚠️ <span className="font-semibold">Atención:</span>{" "}
                    {attention.join(", ") || "Sin alertas"}
                  </p>
                </div>
              </div>
            </section>

            <section className="col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                Materias
              </h3>

              <div className="space-y-4">
                {Object.entries(selectedStudent.grades).map(
                  ([subject, level]) => (
                    <div
                      key={subject}
                      className="flex items-center justify-between border-b border-slate-100 pb-3"
                    >
                      <span className="text-lg text-slate-700">{subject}</span>
                      <span className="px-3 py-1 rounded-xl text-white text-sm font-bold bg-blue-500">
                        {String(level)}
                      </span>
                    </div>
                  ),
                )}
              </div>

              <div className="mt-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  Evolución por Periodos
                </h3>
                <div className="h-56 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400">
                  Próximo: comparativa P1 · P2 · P3
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
