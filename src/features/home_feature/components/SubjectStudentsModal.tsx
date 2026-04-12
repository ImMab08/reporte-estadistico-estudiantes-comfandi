"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { StudentRecord } from "@/src/shared/types/academic.types";
import { StudentInteractiveCard } from "@/src/components/layout/student_interactive_card";

type FilterType = "superior" | "alto" | "basico" | "bajo";

interface Props {
  open: boolean;
  subject: string | null;
  students: StudentRecord[];
  onClose: () => void;
}

const FILTERS: { key: FilterType; label: string }[] = [
  { key: "superior", label: "Superior" },
  { key: "alto", label: "Alto" },
  { key: "basico", label: "Básico" },
  { key: "bajo", label: "Bajo" },
];

function getLevelBadgeColor(level: string) {
  const normalized = level
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  if (normalized.includes("superior")) {
    return "bg-emerald-500";
  }

  if (normalized.includes("alto")) {
    return "bg-blue-500";
  }

  if (normalized.includes("basico")) {
    return "bg-amber-400";
  }

  if (normalized.includes("bajo")) {
    return "bg-red-500";
  }

  return "bg-slate-400";
}

export function SubjectStudentsModal({
  open,
  subject,
  students,
  onClose,
}: Props) {
  const [filter, setFilter] = useState<FilterType>("superior");
  const router = useRouter();
  const searchParams = useSearchParams();

  const filteredStudents = useMemo(() => {
    if (!subject) return [];

    return students
      .filter((student) => {
        const value = student.grades?.[subject];
        if (!value) return false;

        const normalized = String(value)
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .trim();

        return normalized.includes(filter);
      })
      .map((student) => ({
        student,
        score: student.grades?.[subject],
      }));
  }, [students, subject, filter]);

  const handleStudentSelect = (studentId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("student", studentId);
    params.set("modal", "true");

    router.push(`/students?${params.toString()}`);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="absolute right-0 top-0 h-screen w-180 max-w-[120vw] border-l border-slate-200 bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{subject}</h2>
            <p className="text-sm text-slate-500">
              Detalle de estudiantes por nivel de desempeño
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="px-6 pt-4 mb-4">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((item) => {
              const isActive = filter === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => setFilter(item.key)}
                  className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? `${getLevelBadgeColor(item.label)} text-white`
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex-1 overflow-auto px-6">
          <div className="space-y-1">
            {/* header */}
            <div className="grid sticky top-0 z-50 grid-cols-[2fr_70px_70px_120px] gap-3 border-b border-slate-200 px-3 py-3 text-sm font-bold text-slate-800 bg-white">
              <span>Estudiante</span>
              <span>Grado</span>
              <span>Grupo</span>
              <span>Nota</span>
            </div>

            {/* rows */}
            {filteredStudents.map(({ student, score }) => (
              <StudentInteractiveCard
                key={student.id}
                student={student}
                onClick={() => handleStudentSelect(student.id)}
              >
                <div
                  onClick={() => handleStudentSelect(student.id)}
                  className="grid cursor-pointer border-b border-border grid-cols-[1fr_70px_70px_120px] gap-3 rounded-lg px-3 py-3 transition hover:bg-slate-200"
                >
                  <span>{student.name}</span>
                  <span>{student.grade}</span>
                  <span>{student.group}</span>

                  <span
                    className={`inline-flex min-w-27.5 justify-center rounded-xl px-3 py-1 text-xs font-bold text-white ${getLevelBadgeColor(
                      String(score),
                    )}`}
                  >
                    {score}
                  </span>
                </div>
              </StudentInteractiveCard>
            ))}
          </div>

          {!filteredStudents.length && (
            <div className="py-10 text-center text-slate-500">
              No hay estudiantes para este filtro
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
