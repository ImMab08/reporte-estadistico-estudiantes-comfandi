import Image from "next/image";

import { useState } from "react";
import {
  IconBarChart,
  IconIdCard,
  IconSchool,
  IconWebTraffic,
} from "@/src/shared/icons";
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
  Line,
  Legend,
  ComposedChart,
} from "recharts";
import { dataComparativa } from "./data_comparativa";
import { displayStudentName } from "@/src/utils/periodic/displayStudentName";

type Props = {
  hasData: boolean;
  selectedStudent: IcfesStudent | null;
  dataset: IcfesDataset | null;
  analytics: IcfesGlobalAnalytics | null;
  groupsAnalytics: IcfesGroupAnalytics[];
  comparisons: IcfesComparisonItem[];
  scoreDistribution: IcfesScoreDistribution[];
  topStudents: IcfesTopStudent[];
  lowestStudents: IcfesTopStudent[];
  students: IcfesStudent[];
};

function StatsCard({
  title,
  subtitle,
  value,
  icon: Icon,
  variant = "blue",
}: {
  title: string;
  subtitle: string;
  value: string | number;
  icon: React.ElementType;
  variant?: "blue" | "purple" | "emerald" | "red";
}) {
  const styles = {
    blue: {
      text: "text-primary",
      soft: "bg-blue-50",
      border: "from-blue-500 to-blue-200",
      ghost: "text-blue-300",
    },

    purple: {
      text: "text-violet-600",
      soft: "bg-violet-50",
      border: "from-violet-600 to-violet-200",
      ghost: "text-violet-300",
    },

    emerald: {
      text: "text-emerald-600",
      soft: "bg-emerald-50",
      border: "from-emerald-500 to-emerald-200",
      ghost: "text-emerald-300",
    },

    red: {
      text: "text-red-600",
      soft: "bg-red-50",
      border: "from-red-500 to-red-200",
      ghost: "text-red-300",
    },
  };

  const theme = styles[variant];

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl
        border border-slate-200
        bg-white
        shadow-sm
        p-4
        min-h-42.5 justify-between
        flex flex-col
        transition-all duration-300
        hover:shadow-md
        hover:-translate-y-1
      `}
    >
      {/* Glow suave */}
      <div className={`absolute inset-0 opacity-40 ${theme.soft}`} />

      {/* contenido */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        <p
          className="
            text-sm md:text-base
            text-slate-600
            font-medium
            leading-tight
            max-w-[75%]
          "
        >
          {title}
        </p>

        <h3
          className={`
            mt-3
            text-5xl
            font-black
            tracking-tight

            ${theme.text}
          `}
        >
          {value}
        </h3>

        <p
          className="
            mt-2
            text-sm
            text-slate-500
          "
        >
          {subtitle}
        </p>
      </div>

      {/* Icon */}
      <div
        className={`
          absolute
          -right-5 -bottom-4

          opacity-10

          ${theme.ghost}
        `}
      >
        <Icon className="w-32 h-32" />
      </div>

      {/* Barra */}
      <div
        className={`
          absolute bottom-0 left-0
          h-2 w-full

          bg-linear-to-r
          ${theme.border}
        `}
      />
    </div>
  );
}

export function ResultadosIcfesDetails({
  hasData,
  dataset,
  students,
  analytics,
  topStudents,
  lowestStudents,
  groupsAnalytics,
  selectedStudent,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCompetencies, setSelectedCompetencies] = useState([
    "lectura",
    "matematicas",
    "sociales",
    "naturales",
    "ingles",
  ]);

  function getRowStyles(score: number) {
    if (score >= 325) {
      return `
        text-emerald-700
        bg-emerald-100
        hover:bg-emerald-100
      `;
    }

    if (score >= 300) {
      return `
      text-green-700
        bg-green-50
        hover:bg-green-50
      `;
    }

    if (score >= 250) {
      return `
      text-amber-700
        bg-amber-100
        hover:bg-amber-100
      `;
    }

    if (score >= 200) {
      return `
      text-orange-700
        bg-orange-100
        hover:bg-orange-100
      `;
    }

    return `
    text-red-700
      bg-red-100
      hover:bg-red-100
    `;
  }

  function handleToggleCompetency(key: string) {
    setSelectedCompetencies((prev) => {
      // si solo queda 1 no dejar quitarla
      if (prev.includes(key) && prev.length === 1) {
        return prev;
      }

      // quitar
      if (prev.includes(key)) {
        return prev.filter((item) => item !== key);
      }

      // agregar
      return [...prev, key];
    });
  }

  const averageByGroupChartData = groupsAnalytics.map((group) => ({
    group: `11-${group.group}`,
    promedio: group.averageScore,
  }));

  const competencyMeta = {
    lectura: {
      label: "Lectura crítica",
      color: "#F59E0B",
    },

    matematicas: {
      label: "Matemáticas",
      color: "#DC2626",
    },

    sociales: {
      label: "Sociales",
      color: "#92400E",
    },

    naturales: {
      label: "Naturales",
      color: "#10B981",
    },

    ingles: {
      label: "Inglés",
      color: "#2563EB",
    },
  };

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
          <h2 className="text-3xl text-primary font-bold">Reporte general</h2>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard
            icon={IconBarChart}
            title="Estudiantes evaluados"
            subtitle="Total colegio"
            value={dataset?.totalStudents ?? 0}
            variant="blue"
          />

          <StatsCard
            icon={IconBarChart}
            title="Promedio puntaje global"
            subtitle="/ 500 puntos"
            value={analytics?.institutionAverage ?? 0}
            variant="purple"
          />

          <StatsCard
            icon={IconBarChart}
            title="Mejor puntaje"
            subtitle="Máximo colegio"
            value={analytics?.highestScore ?? 0}
            variant="emerald"
          />

          <StatsCard
            icon={IconBarChart}
            title="Menor puntaje"
            subtitle="Mínimo colegio"
            value={analytics?.lowestScore ?? 0}
            variant="red"
          />
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
          {/* HEADER */}
          <div className="p-4 border-b border-border">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-primary">
                  Evolución histórica por competencia
                </h3>

                <p className="text-sm text-slate-500">
                  Campues E Yumbo, pruebas saber 11 (2021 - 2026)
                </p>
              </div>
            </div>
          </div>

          {/* CHART */}
          <div className="p-4">
            <div className="h-90">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={dataComparativa}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  {/* GRID */}
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E2E8F0"
                    vertical={false}
                  />

                  {/* X */}
                  <XAxis
                    dataKey="year"
                    tick={{
                      fill: "#64748B",
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />

                  {/* Y */}
                  <YAxis
                    domain={[40, 80]}
                    tick={{
                      fill: "#64748B",
                      fontSize: 12,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />

                  {/* TOOLTIP */}
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    }}
                  />

                  {/* BARRAS SUAVES */}
                  <Bar
                    dataKey="top"
                    fill="#F8FAFC"
                    radius={[10, 10, 0, 0]}
                    barSize={42}
                  />

                  {/* LECTURA */}
                  {selectedCompetencies.includes("lectura") && (
                    <Line
                      type="linear"
                      dataKey="lectura"
                      name={competencyMeta.lectura.label}
                      stroke={competencyMeta.lectura.color}
                      strokeWidth={4}
                      dot={{
                        r: 5,
                        strokeWidth: 3,
                        fill: "#fff",
                      }}
                      activeDot={{
                        r: 7,
                      }}
                      animationDuration={500}
                    />
                  )}

                  {/* MATEMÁTICAS */}
                  {selectedCompetencies.includes("matematicas") && (
                    <Line
                      type="linear"
                      dataKey="matematicas"
                      name={competencyMeta.matematicas.label}
                      stroke={competencyMeta.matematicas.color}
                      strokeWidth={4}
                      dot={{
                        r: 5,
                        strokeWidth: 3,
                        fill: "#fff",
                      }}
                      activeDot={{
                        r: 7,
                      }}
                      animationDuration={500}
                    />
                  )}

                  {/* SOCIALES */}
                  {selectedCompetencies.includes("sociales") && (
                    <Line
                      type="linear"
                      dataKey="sociales"
                      name={competencyMeta.sociales.label}
                      stroke={competencyMeta.sociales.color}
                      strokeWidth={4}
                      dot={{
                        r: 5,
                        strokeWidth: 3,
                        fill: "#fff",
                      }}
                      activeDot={{
                        r: 7,
                      }}
                      animationDuration={500}
                    />
                  )}

                  {/* NATURALES */}
                  {selectedCompetencies.includes("naturales") && (
                    <Line
                      type="linear"
                      dataKey="naturales"
                      name={competencyMeta.naturales.label}
                      stroke={competencyMeta.naturales.color}
                      strokeWidth={4}
                      dot={{
                        r: 5,
                        strokeWidth: 3,
                        fill: "#fff",
                      }}
                      activeDot={{
                        r: 7,
                      }}
                      animationDuration={500}
                    />
                  )}

                  {/* INGLÉS */}
                  {selectedCompetencies.includes("ingles") && (
                    <Line
                      type="linear"
                      dataKey="ingles"
                      name={competencyMeta.ingles.label}
                      stroke={competencyMeta.ingles.color}
                      strokeWidth={4}
                      dot={{
                        r: 5,
                        strokeWidth: 3,
                        fill: "#fff",
                      }}
                      activeDot={{
                        r: 7,
                      }}
                      animationDuration={500}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* BOTONES INTERACTIVOS */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {Object.entries(competencyMeta).map(([key, meta]) => {
                const isActive = selectedCompetencies.includes(key);

                return (
                  <button
                    key={key}
                    onClick={() => handleToggleCompetency(key)}
                    className={`
          px-4 py-2 rounded-xl
          border transition-all duration-200
          cursor-pointer
          flex items-center gap-2

          ${
            isActive
              ? "bg-white border-slate-300 shadow-sm"
              : "bg-slate-50 border-slate-200 opacity-40"
          }

          hover:opacity-100 hover:scale-100
        `}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        background: meta.color,
                      }}
                    />

                    <span
                      className="text-sm font-semibold"
                      style={{
                        color: meta.color,
                      }}
                    >
                      {meta.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* <div className="grid grid-cols-2 mt-5 gap-5">
          <div className="rounded-xl border border-border bg-white overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="text-xl font-bold text-slate-800 text-center">
                Mejores puntajes
              </h3>
            </div>

            <div className="divide-y divide-border">
              {topStudents.map((student) => (
                <div
                  key={student.studentId}
                  className="flex items-center justify-between p-3"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      #{student.position} {student.name}
                    </p>

                    <p className="text-sm text-slate-500">11-{student.group}</p>
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

          <div className="rounded-xl border border-border bg-white overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="text-xl font-bold text-slate-800 text-center">
                Menores puntajes
              </h3>
            </div>

            <div className="divide-y divide-border">
              {lowestStudents.map((student) => (
                <div
                  key={student.studentId}
                  className="flex items-center justify-between p-3"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      #{student.position} {student.name}
                    </p>

                    <p className="text-sm text-slate-500">11-{student.group}</p>
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
        </div> */}

        <div className="mt-5 rounded-2xl border border-border bg-white overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-primary">
                  Resultados
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

          {/* TABLA */}
          <div className="overflow-auto max-h-175">
            <table className="border-separate border-spacing-0 min-w-max w-full">
              <thead className="sticky top-0 z-30 bg-slate-50">
                <tr>
                  <th className="sticky left-0 z-40 bg-slate-50 px-4 py-3 text-left text-xs font-semibold text-slate-600 border-b border-r border-slate-200">
                    Puesto
                  </th>

                  <th className="sticky left-18 z-40 bg-slate-50 min-w-70 px-4 py-3 text-left text-[13px] font-semibold text-slate-600 border-b border-border border-r">
                    Estudiante
                  </th>

                  <th className="px-4 py-3 text-center text-[13px] font-semibold text-slate-600 border-b border-border">
                    Global
                  </th>

                  <th className="px-4 py-3 text-center text-[13px] font-semibold text-slate-600 border-b border-border">
                    Lectura
                  </th>

                  <th className="px-4 py-3 text-center text-[13px] font-semibold text-slate-600 border-b border-border">
                    Matemáticas
                  </th>

                  <th className="px-4 py-3 text-center text-[13px] font-semibold text-slate-600 border-b border-border">
                    Sociales
                  </th>

                  <th className="px-4 py-3 text-center text-[13px] font-semibold text-slate-600 border-b border-border">
                    Naturales
                  </th>

                  <th className="px-4 py-3 text-center text-[13px] font-semibold text-slate-600 border-b border-border">
                    Inglés
                  </th>

                  <th className="px-4 py-3 text-center text-[13px] font-semibold text-slate-600 border-b border-border">
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
                        className={`
            transition-colors duration-200

            ${getRowStyles(student.globalScore)}
          `}
                      >
                        {/* PUESTO */}
                        <td
                          className={`
              sticky left-0 z-20

              px-4 py-3

              border-b
              border-r border-slate-100

              ${getRowStyles(student.globalScore)}
            `}
                        >
                          <div
                            className="
                size-7
                rounded-lg
                bg-white/60
                backdrop-blur-sm

                text-sm
                font-black

                flex items-center justify-center

                shadow-xs
              "
                          >
                            {student.rankings.institution}
                          </div>
                        </td>

                        {/* NOMBRE */}
                        <td
                          className={`
              sticky left-18 z-20

              min-w-70

              px-4 py-3

              border-b
              border-r border-slate-100

              ${getRowStyles(student.globalScore)}
            `}
                        >
                          <div>
                            <p
                              className="
                  font-semibold
                  text-[14px]
                  whitespace-nowrap
                "
                            >
                              {student.name}
                            </p>

                            <p
                              className="
                  text-sm
                  text-slate-500
                  font-medium
                "
                            >
                              11-{student.group}
                            </p>
                          </div>
                        </td>

                        {/* GLOBAL */}
                        <td
                          className="
              px-4 py-3
              text-center
              border-b border-slate-100
            "
                        >
                          <span
                            className="
                text-lg
                font-black
                tracking-tight
              "
                          >
                            {student.globalScore}
                          </span>
                        </td>

                        {/* LECTURA */}
                        <td
                          className="
              px-4 py-3
              text-center
              font-semibold
              text-[14px]
              border-b border-slate-100
            "
                        >
                          {lectura?.score ?? 0}
                        </td>

                        {/* MATEMÁTICAS */}
                        <td
                          className="
              px-4 py-3
              text-center
              font-semibold
              text-[14px]
              border-b border-slate-100
            "
                        >
                          {matematicas?.score ?? 0}
                        </td>

                        {/* SOCIALES */}
                        <td
                          className="
              px-4 py-3
              text-center
              font-semibold
              text-[14px]
              border-b border-slate-100
            "
                        >
                          {sociales?.score ?? 0}
                        </td>

                        {/* NATURALES */}
                        <td
                          className="
              px-4 py-3
              text-center
              font-semibold
              text-[14px]
              border-b border-slate-100
            "
                        >
                          {naturales?.score ?? 0}
                        </td>

                        {/* INGLÉS */}
                        <td
                          className="
              px-4 py-3
              text-center
              font-semibold
              text-[14px]
              border-b border-slate-100
            "
                        >
                          {ingles?.score ?? 0}
                        </td>

                        {/* NIVEL */}
                        <td
                          className="
              px-4 py-3
              text-center
              border-b border-slate-100
            "
                        >
                          <span
                            className={`
                inline-flex items-center justify-center

                rounded-lg

                px-3 py-1.5
                min-w-14

                text-sm
                font-bold
                bg-white
                
              `}
                          >
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

        <div className="mt-5 rounded-xl border border-border bg-white p-5">
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

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

                <Bar dataKey="promedio" radius={[16, 16, 0, 0]}>
                  {averageByGroupChartData.map((_, index) => {
                    const colors = ["#3B82F6", "#1D4ED8", "#93C5FD", "#6366F1"];

                    return (
                      <Cell key={index} fill={colors[index % colors.length]} />
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

              <h2 className="text-[26px] font-bold text-slate-800 mt-1 leading-tight">
                {displayStudentName(selectedStudent.name)}
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

          <div className="flex flex-col gap-4">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border p-2 bg-slate-50">
                <p className="text-sm text-slate-500">
                  Puesto a nivel de colegio
                </p>

                <h3 className="mt-2 text-3xl font-black text-slate-800">
                  #{selectedStudent.rankings.institution}
                </h3>
              </div>

              <div className="rounded-xl border border-border p-2 bg-slate-50">
                <p className="text-sm text-slate-500">
                  Puesto a nivel de grado
                </p>

                <h3 className="mt-2 text-3xl font-black text-slate-800">
                  #{selectedStudent.rankings.group}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {selectedStudent.competencies.map((competency) => (
            <div
              key={competency.key}
              className="rounded-xl border border-border p-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-800">
                    {competency.label}
                  </h4>

                  <p className="text-sm text-slate-500">
                    Nivel de desempeño:{" "}
                    <span className="font-semibold">
                      {competency.performanceLevel}
                    </span>
                  </p>
                </div>

                <div
                  className="size-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl"
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
  );
}
