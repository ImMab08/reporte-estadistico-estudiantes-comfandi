"use client";

import { IconQuickReference } from "@/src/shared/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getGrades } from "@/src/utils/storage";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

// Registrar charts
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export function HomeFeaturePage() {
  const [grades, setGrades] = useState<any[]>([]);
  const [activeGrade, setActiveGrade] = useState<any>(null);

  useEffect(() => {
    const data = getGrades();
    setGrades(data);

    if (data.length > 0) {
      setActiveGrade(data[0]);
    }
  }, []);

  // =============================
  // 📊 GLOBAL STATS
  // =============================
  function getGlobalStats(grade: any) {
    let Baj = 0,
      Bas = 0,
      Alt = 0,
      Sup = 0;

    grade.students.forEach((student: any) => {
      Object.values(student.grades).forEach((val: any) => {
        if (val === "Baj") Baj++;
        if (val === "Bas") Bas++;
        if (val === "Alt") Alt++;
        if (val === "Sup") Sup++;
      });
    });

    return {
      Baj,
      Bas,
      Alt,
      Sup,
      total: Baj + Bas + Alt + Sup,
    };
  }

  // =============================
  // 📚 SUBJECT STATS
  // =============================
  function getSubjectStats(grade: any) {
    const result: any = {};

    grade.subjects.forEach((sub: string) => {
      result[sub] = { Baj: 0, Bas: 0, Alt: 0, Sup: 0 };
    });

    grade.students.forEach((student: any) => {
      Object.entries(student.grades).forEach(([sub, val]: any) => {
        if (result[sub] && result[sub][val] !== undefined) {
          result[sub][val]++;
        }
      });
    });

    return result;
  }

  const globalStats = activeGrade ? getGlobalStats(activeGrade) : null;
  const subjectStats = activeGrade ? getSubjectStats(activeGrade) : null;

  return (
    <section className="p-4 size-full flex flex-col">
      {/* Encabezado */}
      <header className="py-4 border-b-2 border-border">
        <h1 className="text-3xl font-bold text-primary">
          Reporte general
        </h1>
        <h2 className="text-sm text-gray-500">
          Vista general del rendimiento académico
        </h2>
      </header>

      {/* ========================= */}
      {/* 🔴 SIN DATOS (tu diseño) */}
      {/* ========================= */}
      {grades.length === 0 && (
        <section className="flex flex-col items-center justify-center flex-1 min-h-0">
          <div className="flex flex-col items-center space-y-5 p-20 border-4 border-primary border-dashed rounded-xl">
            <div className="flex flex-col items-center text-center">
              <IconQuickReference
                width={50}
                height={50}
                className="text-primary"
              />

              <p className="text-2xl text-primary font-bold">
                <span>No hay datos cargados</span>
              </p>

              <p className="text-sm text-gray-400 mt-2">
                Para ver los reportes, primero debes <br />
                cargar un archivo Excel con los datos de los estudiantes.
              </p>
            </div>

            <Link
              href="/settings"
              className="mt-4 px-4 py-2 bg-primary hover:bg-white hover:text-primary border-2 border-primary transition-colors duration-300 rounded-xl text-white cursor-pointer"
            >
              Ir a configuración
            </Link>
          </div>
        </section>
      )}

      {/* ========================= */}
      {/* 🟢 CON DATOS */}
      {/* ========================= */}
      {grades.length > 0 && activeGrade && (
        <section className="flex flex-col flex-1 min-h-0 mt-5 space-y-6">

          {/* SELECTOR (minimalista) */}
          <div className="flex gap-2 flex-wrap">
            {grades.map((g, i) => (
              <button
                key={i}
                onClick={() => setActiveGrade(g)}
                className={`px-4 py-2 rounded-xl border text-sm transition
                  ${
                    activeGrade.gradeId === g.gradeId
                      ? "bg-primary text-white"
                      : "bg-white hover:bg-gray-100"
                  }
                `}
              >
                {g.gradeLabel}
              </button>
            ))}
          </div>

          {/* MÉTRICAS */}
          <div className="grid grid-cols-3 gap-4">
            <Card title="Estudiantes" value={activeGrade.students.length} />
            <Card title="Materias" value={activeGrade.subjects.length} />
            <Card title="Registros" value={globalStats?.total} />
          </div>

          {/* GRÁFICOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">

            {/* PIE */}
            <div className="p-4 bg-white rounded-2xl border">
              <h3 className="text-sm text-gray-500 mb-2">
                Distribución general
              </h3>

              <Pie
                data={{
                  labels: ["Bajo", "Básico", "Alto", "Superior"],
                  datasets: [
                    {
                      data: [
                        globalStats?.Baj,
                        globalStats?.Bas,
                        globalStats?.Alt,
                        globalStats?.Sup,
                      ],
                      backgroundColor: [
                        "#ef4444",
                        "#f59e0b",
                        "#3b82f6",
                        "#10b981",
                      ],
                    },
                  ],
                }}
              />
            </div>

            {/* BAR */}
            <div className="p-4 bg-white rounded-2xl border overflow-hidden">
              <h3 className="text-sm text-gray-500 mb-2">
                Rendimiento por materia
              </h3>

              <Bar
                data={{
                  labels: Object.keys(subjectStats || {}),
                  datasets: [
                    {
                      label: "Bajos",
                      data: Object.keys(subjectStats || {}).map(
                        (l) => subjectStats[l].Baj
                      ),
                      backgroundColor: "#ef4444",
                    },
                    {
                      label: "Básicos",
                      data: Object.keys(subjectStats || {}).map(
                        (l) => subjectStats[l].Bas
                      ),
                      backgroundColor: "#f59e0b",
                    },
                    {
                      label: "Altos",
                      data: Object.keys(subjectStats || {}).map(
                        (l) => subjectStats[l].Alt
                      ),
                      backgroundColor: "#3b82f6",
                    },
                    {
                      label: "Superiores",
                      data: Object.keys(subjectStats || {}).map(
                        (l) => subjectStats[l].Sup
                      ),
                      backgroundColor: "#10b981",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  scales: {
                    x: { stacked: true },
                    y: { stacked: true, beginAtZero: true },
                  },
                }}
              />
            </div>
          </div>
        </section>
      )}
    </section>
  );
}

// =============================
// 🧩 CARD
// =============================
function Card({ title, value }: any) {
  return (
    <div className="p-4 bg-white rounded-2xl border text-center">
      <p className="text-xs text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-primary">
        {value ?? 0}
      </p>
    </div>
  );
}