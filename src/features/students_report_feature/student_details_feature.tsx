"use client";

import Image from "next/image";
import { useState } from "react";

import {
  classifyStudent,
  getStudentPhotoPath,
} from "@/src/utils/studentPhotoPreview";

import { IconWebTraffic } from "@/src/shared/icons";

type Props = {
  selectedStudent: any;
  activeSnapshot: any;
  sortedSubjects: any;
};

export function StudentDetailsFeacture({
  selectedStudent,
  activeSnapshot,
  sortedSubjects,
}: Props) {
  const [subjectSort, setSubjectSort] = useState<"alphabetical" | "grade">(
    "grade",
  );

  if (!selectedStudent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center leading-6 text-slate-400 text-xl font-medium">
        <IconWebTraffic className="size-18" />
        <p>
          Selecciona un estudiante <br /> para ver su información
        </p>
      </div>
    );
  }

  const metrics = classifyStudent(selectedStudent);

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

  return (
    <section className="w-full min-h-0 overflow-hidden bg-white border border-border rounded-xl flex flex-col">
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
          <h3 className="text-2xl font-bold text-slate-800">Materias</h3>

          <div className="flex gap-3">
            <select
              value={subjectSort}
              onChange={(e) =>
                setSubjectSort(e.target.value as "alphabetical" | "grade")
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
              <span
                className={`px-3 py-1 rounded-lg text-white text-sm font-bold ${getLevelBadgeColor(
                  String(level),
                )}`}
              >
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
    </section>
  );
}
