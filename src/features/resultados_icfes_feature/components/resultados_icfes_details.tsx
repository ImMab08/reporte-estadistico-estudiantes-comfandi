import Image from "next/image";

import { useState } from "react";
import { IconBarChart, IconIdCard, IconSchool, IconWebTraffic } from "@/src/shared/icons";
import {
  IcfesDataset,
  IcfesStudent,
  IcfesComparisonItem,
  IcfesGlobalAnalytics,
  IcfesGroupAnalytics,
  IcfesScoreDistribution,
  IcfesTopStudent,
} from "@/src/shared/types/icfes.types";
import { importIcfesDataset } from "@/src/utils/icfes/importIcfesDataset";
import { getStudentPhotoPath } from "@/src/utils/studentPhotoPreview";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";

type Props = {
  hasData: boolean;
  selectedStudent: IcfesStudent | null;

  dataset: IcfesDataset | null;
  analytics: IcfesGlobalAnalytics | null;
  groupsAnalytics: IcfesGroupAnalytics[];
  comparisons: IcfesComparisonItem[];
  scoreDistribution: IcfesScoreDistribution[];
  topStudents: IcfesTopStudent[];

  students: IcfesStudent[];
};

export function ResultadosIcfesDetails({
  hasData,
  selectedStudent,

  dataset,
  analytics,
  groupsAnalytics,
  comparisons,
  scoreDistribution,
  topStudents,
  students,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  console.log("xd: ", selectedStudent);

  const averageByGroupChartData = groupsAnalytics.map((group) => ({
    group: `11-${group.group}`,
    promedio: group.averageScore,
  }));

  if (!hasData) {
    async function handleUploadFile(
      event: React.ChangeEvent<HTMLInputElement>,
    ) {
      try {
        const file = event.target.files?.[0];

        if (!file) {
          return;
        }

        await importIcfesDataset(file);

        window.location.reload();
      } catch (error) {
        console.error("[ICFES_UPLOAD_ERROR]", error);
      }
    }

    return (
      <div className="flex-1 bg-white border border-border rounded-2xl flex flex-col items-center justify-center text-center px-6">
        <div className="size-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
          <IconWebTraffic className="size-12 text-primary" />
        </div>

        <h2 className="text-2xl font-bold text-slate-800">
          No hay datos cargados
        </h2>
        <p className="mt-3 text-slate-500 max-w-md leading-6">
          Carga un archivo Excel con los resultados de las pruebas Saber 11 para
          comenzar el análisis institucional.
        </p>

        <input
          id="icfes-upload-input"
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleUploadFile}
        />

        <button
          onClick={() => {
            document.getElementById("icfes-upload-input")?.click();
          }}
          className="mt-6 h-12 px-6 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-opacity"
        >
          Cargar resultados
        </button>
      </div>
    );
  }

  // Dashboard institucional
  if (!selectedStudent) {
    return (
      <div className="flex-1 bg-white border border-border rounded-2xl p-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              Dashboard institucional
            </h2>

            <p className="mt-2 text-slate-500">
              Análisis general de resultados ICFES Saber 11
            </p>
          </div>

          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <IconWebTraffic className="size-8 text-primary" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-border p-5 bg-white">
            <p className="text-sm text-slate-500">Estudiantes evaluados</p>

            <h3 className="mt-2 text-5xl font-black text-slate-800">
              {dataset?.totalStudents ?? 0}
            </h3>

            <p className="mt-2 text-sm text-slate-500">Total institucional</p>
          </div>

          <div className="rounded-2xl border border-border p-5 bg-white">
            <p className="text-sm text-slate-500">Promedio institucional</p>

            <h3 className="mt-2 text-5xl font-black text-primary">
              {analytics?.institutionAverage ?? 0}
            </h3>

            <p className="mt-2 text-sm text-slate-500">/ 500 puntos</p>
          </div>

          <div className="rounded-2xl border border-border p-5 bg-white">
            <p className="text-sm text-slate-500">Percentil promedio</p>

            <h3 className="mt-2 text-5xl font-black text-violet-600">
              {analytics?.averagePercentile ?? 0}
            </h3>

            <p className="mt-2 text-sm text-slate-500">Promedio global</p>
          </div>

          <div className="rounded-2xl border border-border p-5 bg-white">
            <p className="text-sm text-slate-500">Mejor puntaje</p>

            <h3 className="mt-2 text-5xl font-black text-emerald-500">
              {analytics?.highestScore ?? 0}
            </h3>

            <p className="mt-2 text-sm text-slate-500">Máximo institucional</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Distribución */}
          <div className="rounded-2xl border border-border p-5 bg-white">
            <h3 className="text-xl font-bold text-slate-800">
              Distribución de niveles
            </h3>

            <div className="mt-6 space-y-5">
              {[
                {
                  label: "Superior",
                  value: analytics?.levelDistribution.superior ?? 0,
                  color: "#10B981",
                },

                {
                  label: "Alto",
                  value: analytics?.levelDistribution.alto ?? 0,
                  color: "#2563EB",
                },

                {
                  label: "Medio",
                  value: analytics?.levelDistribution.medio ?? 0,
                  color: "#F59E0B",
                },

                {
                  label: "Bajo",
                  value: analytics?.levelDistribution.bajo ?? 0,
                  color: "#EF4444",
                },
              ].map((item) => {
                const total = dataset?.totalStudents ?? 1;

                const percentage = Math.round((item.value / total) * 100);

                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">
                        {item.label}
                      </span>

                      <span className="text-sm font-bold text-slate-700">
                        {percentage}%
                      </span>
                    </div>

                    <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          background: item.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Competencias */}
          <div className="rounded-2xl border border-border p-5 bg-white">
            <h3 className="text-xl font-bold text-slate-800">
              Promedio por competencia
            </h3>

            <div className="mt-6 space-y-5">
              {analytics?.competencyAnalytics.map((item) => {
                const competencyMeta = {
                  lecturaCritica: {
                    label: "Lectura crítica",
                    color: "#8B5CF6",
                  },

                  matematicas: {
                    label: "Matemáticas",
                    color: "#F59E0B",
                  },

                  socialesCiudadanas: {
                    label: "Sociales",
                    color: "#EC4899",
                  },

                  cienciasNaturales: {
                    label: "Naturales",
                    color: "#10B981",
                  },

                  ingles: {
                    label: "Inglés",
                    color: "#EAB308",
                  },
                };

                const meta =
                  competencyMeta[
                    item.competency as keyof typeof competencyMeta
                  ];

                return (
                  <div key={item.competency}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">
                        {meta?.label}
                      </span>

                      <span className="text-sm font-bold text-slate-700">
                        {item.average}
                      </span>
                    </div>

                    <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.average}%`,
                          background: meta?.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-white overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="text-xl font-bold text-slate-800">
              Top estudiantes institucionales
            </h3>
          </div>

          <div className="divide-y divide-border">
            {topStudents.map((student) => (
              <div
                key={student.studentId}
                className="flex items-center justify-between p-5"
              >
                <div>
                  <p className="font-semibold text-slate-800">
                    #{student.position} {student.name}
                  </p>

                  <p className="text-sm text-slate-500">
                    Grupo {student.group}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-black text-primary">
                    {student.score}
                  </p>

                  <p className="text-sm text-slate-500">
                    Percentil {student.percentile}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

<div className="mt-5 rounded-2xl border border-border bg-white p-5">
  <div className="mb-4">
    <div className="flex items-center space-x-2">
      <IconBarChart className="text-primary" />

      <h3 className="text-2xl font-bold text-primary">
        Promedio global por grupo
      </h3>
    </div>

    <p className="text-sm text-slate-500 mt-1">
      Comparativa institucional por cursos
    </p>
  </div>

  <div className="h-72">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={averageByGroupChartData}
        barCategoryGap="25%"
        margin={{
          top: 20,
          right: 10,
          left: -10,
          bottom: 0,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
        />

        <XAxis
          dataKey="group"
          tick={{
            fill: "#475569",
            fontSize: 12,
          }}
        />

        <YAxis
          domain={[0, 500]}
          tick={{
            fill: "#64748b",
            fontSize: 11,
          }}
        />

        <Tooltip
          contentStyle={{
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            fontSize: "12px",
          }}
        />

        <Bar
          dataKey="promedio"
          radius={[16, 16, 0, 0]}
        >
          {averageByGroupChartData.map((_, index) => {
            const colors = [
              "#3B82F6",
              "#1D4ED8",
              "#93C5FD",
              "#6366F1",
            ];

            return (
              <Cell
                key={index}
                fill={colors[index % colors.length]}
              />
            );
          })}

          <LabelList
            dataKey="promedio"
            position="top"
            style={{
              fill: "#1e293b",
              fontWeight: 800,
              fontSize: 18,
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

        {/* TABLA GENERAL DE ESTUDIANTES */}
        <div className="mt-5 rounded-2xl border border-border bg-white overflow-hidden">
          <div className="p-5 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  Resultados generales institucionales
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Ranking completo de estudiantes
                </p>
              </div>

              <div className="rounded-xl bg-primary/10 px-4 py-2">
                <p className="text-sm font-semibold text-primary">
                  {students.length} estudiantes
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-300">
              <thead className="bg-slate-50">
                <tr className="border-b border-border">
                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                    Puesto
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                    Estudiante
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                    Grupo
                  </th>

                  <th className="px-5 py-4 text-center text-sm font-semibold text-slate-600">
                    Global
                  </th>

                  <th className="px-5 py-4 text-center text-sm font-semibold text-slate-600">
                    Lectura
                  </th>

                  <th className="px-5 py-4 text-center text-sm font-semibold text-slate-600">
                    Matemáticas
                  </th>

                  <th className="px-5 py-4 text-center text-sm font-semibold text-slate-600">
                    Sociales
                  </th>

                  <th className="px-5 py-4 text-center text-sm font-semibold text-slate-600">
                    Naturales
                  </th>

                  <th className="px-5 py-4 text-center text-sm font-semibold text-slate-600">
                    Inglés
                  </th>

                  <th className="px-5 py-4 text-center text-sm font-semibold text-slate-600">
                    Nivel inglés
                  </th>
                </tr>
              </thead>

              <tbody>
                {[...students]
                  .sort(
                    (a, b) => a.rankings.institution - b.rankings.institution,
                  )
                  .map((student) => {
                    const lectura = student.competencies.find(
                      (competency) => competency.key === "lecturaCritica",
                    );

                    const matematicas = student.competencies.find(
                      (competency) => competency.key === "matematicas",
                    );

                    const sociales = student.competencies.find(
                      (competency) => competency.key === "socialesCiudadanas",
                    );

                    const naturales = student.competencies.find(
                      (competency) => competency.key === "cienciasNaturales",
                    );

                    const ingles = student.competencies.find(
                      (competency) => competency.key === "ingles",
                    );

                    return (
                      <tr
                        key={student.id}
                        className="border-b border-border hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="size-10 rounded-xl bg-primary/10 text-primary font-black flex items-center justify-center">
                            #{student.rankings.institution}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div>
                            <p className="font-semibold text-slate-800">
                              {student.name}
                            </p>

                            <p className="text-sm text-slate-500">
                              Código: {student.id}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-slate-600 font-medium">
                          11-{student.group}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span className="text-lg font-black text-primary">
                            {student.globalScore}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-center font-semibold text-slate-700">
                          {lectura?.score ?? 0}
                        </td>

                        <td className="px-5 py-4 text-center font-semibold text-slate-700">
                          {matematicas?.score ?? 0}
                        </td>

                        <td className="px-5 py-4 text-center font-semibold text-slate-700">
                          {sociales?.score ?? 0}
                        </td>

                        <td className="px-5 py-4 text-center font-semibold text-slate-700">
                          {naturales?.score ?? 0}
                        </td>

                        <td className="px-5 py-4 text-center font-semibold text-slate-700">
                          {ingles?.score ?? 0}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span className="inline-flex items-center justify-center rounded-xl bg-amber-100 text-amber-700 font-bold px-3 py-2 min-w-16">
                            {ingles?.performanceLevel || "-"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-white overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="text-xl font-bold text-slate-800">
              Comparativo por grupos
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="px-5 py-4 text-sm font-semibold text-slate-600">
                    Grupo
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-slate-600">
                    Estudiantes
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-slate-600">
                    Promedio
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-slate-600">
                    Mejor puntaje
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-slate-600">
                    Percentil
                  </th>
                </tr>
              </thead>

              <tbody>
                {groupsAnalytics.map((group) => (
                  <tr key={group.group} className="border-t border-border">
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      11-{group.group}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {group.totalStudents}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {group.averageScore}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {group.highestScore}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {group.averagePercentile}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex-1 bg-white border border-border rounded-2xl overflow-y-auto">
      <div className="p-4 border-b border-border">
        <div className="flex flex-col xl:flex-row  xl:justify-between gap-2">
          <div className="flex gap-4">
            {/* foto */}
            <div className="relative w-56 h-70  rounded-2xl bg-slate-200 overflow-hidden shrink-0">
              <Image
                key={selectedStudent.id}
                src={getStudentPhotoPath(selectedStudent)}
                alt={selectedStudent.name}
                fill
                unoptimized
                onLoad={() => setIsLoading(false)}
                className={`object-cover transition-opacity duration-300 ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
              />

              {isLoading && (
                <div className="absolute inset-0 animate-pulse bg-slate-200 rounded-2xl" />
              )}
            </div>

            {/* info */}
            <div className="">
              <p className="text-sm text-slate-500">Resultado individual</p>

              <h2 className="text-3xl font-bold text-slate-800 mt-1 leading-tight">
                {selectedStudent.name}
              </h2>

              {/* TAGS */}
              <div className="mt-4 flex flex-col gap-3">
                <div className="space-y-2 w-36">
                  <div className="flex text-black/60 items-center gap-2 px-2 py-1 border border-border rounded-md">
                    <IconIdCard width={20} height={20} />
                    <p className="text-sm">Código: {selectedStudent.id}</p>
                  </div>
                </div>

                <div className="space-y-2 w-36">
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
          </div>

          <div className="relative overflow-hidden w-full h-45 xl:w-90 rounded-2xl bg-linear-to-br from-primary via-blue-700 to-indigo-700 p-4 text-white shadow-2xl shadow-primary/20">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -bottom-10 -right-10 w-52 h-52 rounded-full border border-white"></div>

              <div className="absolute -top-16 -left-10 w-40 h-40 rounded-full border border-white"></div>
            </div>

            <div className="relative z-10">
              <p className="text-sm text-white/70 mb-2">Puntaje global</p>

              <div className="flex items-end gap-2">
                <span className="text-6xl font-black leading-none">
                  {selectedStudent.globalScore}
                </span>

                <span className="text-lg text-white/70 mb-1">/ 500</span>
              </div>

              <div className="mt-5">
                <div className="w-full h-3 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-white"
                    style={{
                      width: `${(selectedStudent.globalScore / 500) * 100}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-white/70">Percentil</span>

                  <span className="font-bold">
                    {selectedStudent.percentile}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-border p-4 bg-slate-50">
            <p className="text-sm text-slate-500">Percentil global</p>

            <h3 className="mt-2 text-4xl font-black text-primary">
              {selectedStudent.percentile}
            </h3>
          </div>

          <div className="rounded-xl border border-border p-4 bg-slate-50">
            <p className="text-sm text-slate-500">Puesto a nivel de colegio</p>

            <h3 className="mt-2 text-4xl font-black text-slate-800">
              #{selectedStudent.rankings.institution}
            </h3>
          </div>

          <div className="rounded-xl border border-border p-4 bg-slate-50">
            <p className="text-sm text-slate-500">Puesto a nivel de grado</p>

            <h3 className="mt-2 text-4xl font-black text-slate-800">
              #{selectedStudent.rankings.group}
            </h3>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-2xl font-bold text-slate-800">
            Competencias evaluadas
          </h3>

          <div className="mt-5 grid grid-cols-2 gap-4">
            {selectedStudent.competencies.map((competency) => (
              <div
                key={competency.key}
                className="rounded-xl border border-border p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      {competency.label}
                    </h4>

                    <p className="text-sm text-slate-500 mt-1">
                      Nivel de desempeño:{" "}
                      <span className="font-semibold">
                        {competency.performanceLevel}
                      </span>
                    </p>
                  </div>

                  <div
                    className="size-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl"
                    style={{
                      background: competency.color,
                    }}
                  >
                    {competency.score}
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-500">Percentil</span>

                    <span className="font-semibold text-slate-700">
                      {competency.percentile}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${competency.percentile ?? 0}%`,
                        background: competency.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
