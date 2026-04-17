"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import {
  classifyStudent,
  getStudentPhotoPath,
  isVisibleSubject,
} from "@/src/utils/studentPhotoPreview";
import {
  AcademicPeriodSnapshot,
  StudentRecord,
} from "@/src/shared/types/academic.types";

import { IconWebTraffic } from "@/src/shared/icons";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  selectedStudent: StudentRecord | null;
  activeSnapshot: AcademicPeriodSnapshot;
  // allSnapshots: AcademicPeriodSnapshot[];
  comparisonChartData: ComparisonChartItem[];
}

type ComparisonChartItem = {
  level: "Superior" | "Alto" | "Básico" | "Bajo";
  P1?: number;
  P2?: number;
  P3?: number;
  P4?: number;
};

export function StudentDetailsFeacture({
  selectedStudent,
  activeSnapshot,
  comparisonChartData,
  // allSnapshots
}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [subjectSort, setSubjectSort] = useState<"alphabetical" | "grade">(
    "grade",
  );
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

  useEffect(() => {
    setIsLoading(true);
  }, [selectedStudent?.id]);
  
  useEffect(() => {
    if (!selectedStudent) return;

    const img = new window.Image();
    img.src = getStudentPhotoPath(selectedStudent);
  }, [selectedStudent]);

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
            key={selectedStudent.id}
            src={getStudentPhotoPath(selectedStudent)}
            alt={selectedStudent.name}
            fill
            onLoad={() => setIsLoading(false)}
            className={`object-cover transition-opacity duration-300 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
          />

          {isLoading && (
            <div className="absolute inset-0 animate-pulse bg-slate-200 rounded-xl" />
          )}
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

      <div className="flex-1 min-h-0 scroll-auto overflow-y-auto p-4">
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

        {sortedSubjects.map(([subject, level]) => (
          <div key={subject} className=" hover:bg-slate-200">
            <div className="flex items-center justify-between border-b border-slate-300 py-2 px-2">
              <span className="text-slate-600">{subject}</span>
              <span
                className={`px-3 py-1 rounded-lg text-white text-sm font-bold ${getLevelBadgeColor(
                  String(level),
                )}`}
              >
                {String(level)}
              </span>
            </div>
          </div>
        ))}

        <div className="mt-6 rounded-xl border border-border p-5">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-primary">
              Comparativa entre periodos
            </h2>
            <p className="text-sm text-slate-500">
              Comparación por niveles entre el periodo actual y el anterior
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonChartData}
                barGap={8}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="level"
                  tick={{ fill: "#475569", fontSize: 14 }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#64748b", fontSize: 13 }}
                  domain={[0, (dataMax: number) => Math.max(16, dataMax + 2)]}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                />

                {"P1" in (comparisonChartData?.[0] ?? {}) && (
                  <Bar dataKey="P1" radius={[8, 8, 0, 0]}>
                    {comparisonChartData.map((entry, index) => {
                      const darkPalette: Record<string, string> = {
                        Superior: "#047857",
                        Alto: "#1d4ed8",
                        Básico: "#d97706",
                        Bajo: "#dc2626",
                      };

                      return (
                        <Cell
                          key={`p1-${index}`}
                          fill={darkPalette[entry.level] || "#64748b"}
                        />
                      );
                    })}
                    <LabelList
                      dataKey="P1"
                      position="top"
                      formatter={() => "P1"}
                    />
                  </Bar>
                )}

                {"P2" in (comparisonChartData?.[0] ?? {}) && (
                  <Bar dataKey="P2" radius={[8, 8, 0, 0]}>
                    {comparisonChartData.map((entry, index) => {
                      const midPalette: Record<string, string> = {
                        Superior: "#10b981",
                        Alto: "#3b82f6",
                        Básico: "#fbbf24",
                        Bajo: "#ef4444",
                      };

                      return (
                        <Cell
                          key={`p2-${index}`}
                          fill={midPalette[entry.level] || "#94a3b8"}
                        />
                      );
                    })}
                    <LabelList
                      dataKey="P2"
                      position="top"
                      formatter={() => "P2"}
                    />
                  </Bar>
                )}

                {"P3" in (comparisonChartData?.[0] ?? {}) && (
                  <Bar dataKey="P3" radius={[8, 8, 0, 0]}>
                    {comparisonChartData.map((entry, index) => {
                      const lightPalette: Record<string, string> = {
                        Superior: "#6ee7b7",
                        Alto: "#93c5fd",
                        Básico: "#fde68a",
                        Bajo: "#fca5a5",
                      };

                      return (
                        <Cell
                          key={`p3-${index}`}
                          fill={lightPalette[entry.level] || "#cbd5e1"}
                        />
                      );
                    })}
                    <LabelList
                      dataKey="P3"
                      position="top"
                      formatter={() => "P3"}
                    />
                  </Bar>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
