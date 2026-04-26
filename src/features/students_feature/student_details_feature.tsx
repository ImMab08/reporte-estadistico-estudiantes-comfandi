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

import {
  IconAutoStories,
  IconBarChart,
  IconCalendarMonth,
  IconClose,
  IconGroup,
  IconIdCard,
  IconSchool,
  IconWebTraffic,
} from "@/src/shared/icons";
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
import { displayStudentName } from "@/src/utils/displayStudentName";
import { useRouter } from "next/navigation";

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
};

export function StudentDetailsFeacture({
  selectedStudent,
  activeSnapshot,
  comparisonChartData,
  // allSnapshots
}: Props) {
  const router = useRouter();

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
      <div className="hidden md:flex p-4 gap-4 shrink-0">
        <div className="w-full">
          <div className="flex items-start gap-4">
            <div className="relative w-56 h-64 rounded-2xl bg-slate-200 overflow-hidden shrink-0">
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
                <div className="absolute inset-0 animate-pulse bg-slate-200 rounded-2xl" />
              )}
            </div>
            <div className=" w-full">
              <div className="flex-1 space-y-4">
                <h2 className="text-4xl leading-7 font-bold text-slate-800">
                  {displayStudentName(selectedStudent.name)}
                </h2>

                <div>
                  <div className=" mt-2 space-y-2 w-36">
                    <div className="flex text-black/60 items-center gap-2 px-2 py-1 border border-border rounded-md">
                      <IconIdCard width={20} height={20} />
                      <p className="text-sm">Código: {selectedStudent.id}</p>
                    </div>
                  </div>

                  <div className=" mt-2 space-y-2 w-36">
                    <div className="flex text-black/60 items-center gap-2 px-2 py-1 border border-border rounded-md">
                      <IconSchool width={20} height={20} />
                      <p className="text-sm">
                        <span className="font-semibold">Curso:</span>{" "}
                        {selectedStudent.grade}-{selectedStudent.group}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-px bg-slate-300" />

                  <IconCalendarMonth width={18} height={18} />

                  <p className="text-base text-center whitespace-nowrap text-slate-800 font-semibold">
                    Periodo: {activeSnapshot.period} · {activeSnapshot.year}
                  </p>

                  <div className="flex-1 h-px bg-slate-300" />
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    ["Superior", metrics.superior, "bg-emerald-500"],
                    ["Alto", metrics.alto, "bg-blue-500"],
                    ["Básico", metrics.basico, "bg-amber-400"],
                    ["Bajo", metrics.bajo, "bg-red-500"],
                  ].map(([label, value, color]) => (
                    <div key={String(label)} className="text-center">
                      <div
                        className={`${color} text-white rounded-xl py-2 text-xl font-bold`}
                      >
                        {value}
                      </div>

                      <p className="mt-2 text-sm text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex md:hidden p-4 gap-4 shrink-0">
        <IconClose
          className="top-4 right-4 absolute z-100 cursor-pointer"
          onClick={() => router.back()}
        />
        <div>
          <div className="flex items-center gap-4">
            <div className="relative w-40 h-50 rounded-2xl bg-slate-200 overflow-hidden shrink-0">
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
            </div>

            <div className="flex-1 space-y-4">
              <h2 className="text-2xl leading-7 font-bold text-slate-800">
                {displayStudentName(selectedStudent.name)}
              </h2>

              <div>
                <div className=" mt-2 space-y-2 w-32">
                  <div className="flex text-black/60 items-center gap-2 px-2 py-1 border border-border rounded-md">
                    <IconIdCard width={18} height={18} />
                    <p className="text-xs">Código: {selectedStudent.id}</p>
                  </div>
                </div>

                <div className=" mt-2 space-y-2 w-32">
                  <div className="flex text-black/60 items-center gap-2 px-2 py-1 border border-border rounded-md">
                    <IconSchool width={18} height={18} />
                    <p className="text-xs">
                      <span className="font-semibold">Curso:</span>{" "}
                      {selectedStudent.grade}-{selectedStudent.group}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-slate-300" />

              <IconCalendarMonth width={20} height={20} />
              <p className="text-lg text-center whitespace-nowrap text-slate-700 font-semibold">
                <span className="">Periodo:</span> {activeSnapshot.period}° ·{" "}
                {activeSnapshot.year}
              </p>

              <div className="flex-1 h-px bg-slate-300" />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                ["Superior", metrics.superior, "bg-emerald-500"],
                ["Alto", metrics.alto, "bg-blue-500"],
                ["Básico", metrics.basico, "bg-amber-400"],
                ["Bajo", metrics.bajo, "bg-red-500"],
              ].map(([label, value, color]) => (
                <div key={String(label)} className="text-center">
                  <div
                    className={`${color} text-white rounded-xl py-2 md:py-3 text-2xl font-bold`}
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
          <div className="flex space-x-2 text-slate-800 items-center">
            <IconAutoStories className="mt-1" width={24} height={24} />
            <h3 className="text-xl font-bold text-slate-800">Materias</h3>
          </div>

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

        <div className="mt-4 md:mt-6 rounded-xl border border-border p-2 md:p-4">
          <div className="mb-3 md:mb-4">
            <div className="flex items-center space-x-1">
              <IconBarChart className="text-primary" />
              <h2 className="text-xl md:text-2xl font-bold text-primary leading-6 md:leading-normal">
                Comparativa entre periodos
              </h2>
            </div>

            <p className="text-xs md:text-sm text-slate-500 leading-4 md:leading-normal">
              Comparación por notas entre el periodos
            </p>
          </div>

          <div className="h-52 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonChartData}
                barGap={2}
                barCategoryGap="12%"
                margin={{
                  top: 5,
                  right: 0,
                  left: -18,
                  bottom: -5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="level"
                  interval={0}
                  tick={{
                    fill: "#475569",
                    fontSize: 11,
                  }}
                />

                <YAxis
                  width={24}
                  allowDecimals={false}
                  axisLine={true}
                  tick={{
                    fill: "#64748b",
                    fontSize: 10,
                  }}
                  domain={[0, (dataMax: number) => Math.max(16, dataMax + 2)]}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
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
                      fontSize={10}
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
                      fontSize={10}
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
                      fontSize={10}
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
