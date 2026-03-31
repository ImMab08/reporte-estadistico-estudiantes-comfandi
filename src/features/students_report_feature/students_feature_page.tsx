"use client";

import { useEffect, useState } from "react";
import { getGrades } from "@/src/utils/storage";
import Image from "next/image";
import { IconClose, IconMenu } from "@/src/shared/icons";

export function StudentsFeaturePage() {
  const [grades, setGrades] = useState<any[]>([]);
  const [activeGrade, setActiveGrade] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const [openMenu, setOpenMenu] = useState(false);

  // Bloqueo general del scroll cuando el menú lateral derechi
  // esta desplegado.
  useEffect(() => {

    if (openMenu) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [openMenu]);

  // =============================
  // 📦 Cargar datos
  // =============================
  useEffect(() => {
    const data = getGrades();
    setGrades(data);
    console.log("datos:", data);

    if (data.length > 0) {
      setActiveGrade(data[0]);
    }
  }, []);

  // Reset estudiante al cambiar grado
  useEffect(() => {
    setSelectedStudent(null);
  }, [activeGrade]);

  return (
    <>
      {/* Fondo oscuro */}
      {openMenu && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => setOpenMenu(false)}
        />
      )}

      {/* 2. MENÚ LATERAL */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-xs bg-white z-50 shadow-2xl transition-transform duration-300 ease-in-out px-4 overflow-hidden ${
          openMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 size-full flex flex-col">
          <header className="py-4 border-b-2 border-border flex justify-between items-center">
            <div className="flex items-center justify-between w-full">
              <h1 className="text-2xl font-bold text-primary leading-6">
                Seleccionar
              </h1>

              <IconClose
                className="size-7 pt-1 text-primary cursor-pointer hover:text-gray-600 transition-colors"
                onClick={() => setOpenMenu(false)}
              />
            </div>
          </header>

          {grades.length > 0 && activeGrade && (
            <section className="flex flex-col flex-1 mt-5 space-y-5 ">
              {/* SELECTOR DE GRADO */}
              <div className="flex gap-2 flex-wrap">
                {grades.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveGrade(g)}
                    className={`px-4 py-2 rounded-xl border text-sm transition ${
                      activeGrade.gradeId === g.gradeId
                        ? "bg-primary text-white border-primary"
                        : "bg-white hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    {g.gradeLabel}
                  </button>
                ))}
              </div>

              {/* SELECTOR DE ESTUDIANTE */}
              <select
                className="p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                onChange={(e) => {
                  const student = activeGrade.students.find(
                    (s: any) => s.name === e.target.value,
                  );
                  setSelectedStudent(student);
                  setOpenMenu(false);
                }}
              >
                <option value="">Selecciona un estudiante</option>
                {activeGrade.students.map((s: any, i: number) => (
                  <option key={i} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </section>
          )}
        </div>
      </div>

      <section className="p-4 size-full flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="py-4 border-b-2 border-border flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">Estudiantes</h1>
            <h2 className="text-sm text-gray-500">
              Consulta individual del rendimiento académico
            </h2>
          </div>
          <div>
            <IconMenu
              className="size-10 text-primary cursor-pointer"
              onClick={() => setOpenMenu(true)}
            />
          </div>
        </header>

        {/* ========================= */}
        {/* 🔴 SIN DATOS */}
        {/* ========================= */}
        {grades.length === 0 && (
          <div className="flex flex-1 items-center justify-center text-gray-400">
            No hay datos cargados
          </div>
        )}

        {/* ========================= */}
        {/* 🟢 CON DATOS */}
        {/* ========================= */}
        {grades.length > 0 && activeGrade && (
          <section className="flex flex-col flex-1 mt-5 bg-white rounded-2xl p-4 overflow-hidden">
            {/* ========================= */}
            {/* 👤 INFO ESTUDIANTE */}
            {/* ========================= */}
            {selectedStudent &&
              (() => {
                // 1. Lógica de ordenamiento: Superior (4) a Bajo (1)
                const gradeWeight: any = { Sup: 4, Alt: 3, Bas: 2, Baj: 1 };
                const sortedGrades = Object.entries(
                  selectedStudent.grades,
                ).sort((a: any, b: any) => {
                  return (gradeWeight[b[1]] || 0) - (gradeWeight[a[1]] || 0);
                });

                // 2. Lógica para escalar el gráfico de barras
                const counts = [
                  countGrades(selectedStudent, "Sup"),
                  countGrades(selectedStudent, "Alt"),
                  countGrades(selectedStudent, "Bas"),
                  countGrades(selectedStudent, "Baj"),
                ];
                // La escala máxima será el número más alto de materias que tenga, o un mínimo de 6 para que se vea bien
                const maxChartValue = Math.max(...counts, 6);

                const chartData = [
                  { label: "SUP", value: counts[0], color: "bg-green-500" },
                  { label: "ALT", value: counts[1], color: "bg-blue-500" },
                  { label: "BAS", value: counts[2], color: "bg-amber-400" },
                  { label: "BAJ", value: counts[3], color: "bg-red-500" },
                ];

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
                    {/* 👤 COLUMNA IZQUIERDA: PERFIL Y GRÁFICO (5/12) */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col">
                        <div className="flex justify-between items-center mb-6 gap-4">
                          {/* FOTO CIRCULAR */}
                          <div className="relative p-1 bg-linear-to-tr from-primary to-blue-300 rounded-full shrink-0">
                            <div className="w-50 h-50 rounded-full overflow-hidden border-4 border-white bg-gray-50">
                              <iframe
                                src="https://comfandisa-my.sharepoint.com/personal/1127918318_comfandi_com_co1/_layouts/15/embed.aspx?UniqueId=9751bc0d-beb5-4206-908a-f304b3fe8468"
                                width="100%"
                                height="100%"
                                className="pointer-events-none scale-[1.60] origin-center"
                                scrolling="no"
                                title={selectedStudent.name}
                              ></iframe>
                            </div>
                          </div>

                          {/* Gráfico de barras */}
                          <div className="flex-1 max-w-50 border border-gray-100 rounded-2xl p-4 shadow-inner bg-gray-50/50">
                            <h4 className="text-[10px] uppercase font-bold text-gray-500 mb-3 text-center">
                              Materias por nivel
                            </h4>
                            <div className="flex h-25 items-end justify-between gap-2 border-l border-b border-gray-200 pl-2 pb-1 relative">
                              {/* Eje Y Dinámico */}
                              <div className="absolute -left-4 top-0 bottom-0 flex flex-col justify-between text-[9px] text-gray-400 py-1">
                                <span>{maxChartValue}</span>
                                <span>{Math.floor(maxChartValue / 2)}</span>
                                <span>0</span>
                              </div>

                              {/* Barras */}
                              {chartData.map((bar, i) => (
                                <div
                                  key={i}
                                  className="flex flex-col items-center flex-1 h-full"
                                >
                                  {/* Contenedor Gris (Track) */}
                                  <div className="w-full h-full bg-white rounded-t-md relative flex items-end overflow-hidden border border-gray-100">
                                    {/* Barra de Color (Fill) */}
                                    <div
                                      className={`w-full ${bar.color} rounded-t-sm transition-all duration-1000 ease-out`}
                                      style={{
                                        height: `${(bar.value / maxChartValue) * 100}%`,
                                      }}
                                      title={`${bar.value} materias en ${bar.label}`}
                                    />
                                  </div>
                                  <span className="text-[9px] font-black text-gray-500 mt-1">
                                    {bar.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <h3 className="text-2xl font-black text-gray-800 leading-tight">
                          {selectedStudent.name}
                        </h3>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mt-1 mb-6">
                          Grado: {activeGrade.gradeLabel}
                        </span>

                        <div className="grid grid-cols-2 gap-4 w-full">
                          <div className="p-3 bg-red-50 rounded-2xl border border-red-100">
                            <p className="text-[10px] uppercase font-bold text-red-400">
                              Bajos
                            </p>
                            <p className="text-2xl font-black text-red-600">
                              {counts[3]}
                            </p>
                          </div>
                          <div className="p-3 bg-green-50 rounded-2xl border border-green-100">
                            <p className="text-[10px] uppercase font-bold text-green-400">
                              Superiores
                            </p>
                            <p className="text-2xl font-black text-green-600">
                              {counts[0]}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* TARJETAS DE OBSERVACIÓN */}
                      <div className="space-y-4">
                        <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                          <h4 className="text-sm font-bold text-amber-700 flex items-center gap-2 mb-1">
                            ⚠️ Posibles causas
                          </h4>
                          <p className="text-sm text-amber-800/80 leading-relaxed">
                            {selectedStudent.causas ||
                              "Sin observaciones registradas."}
                          </p>
                        </div>
                        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                          <h4 className="text-sm font-bold text-blue-700 flex items-center gap-2 mb-1">
                            💡 Recomendaciones
                          </h4>
                          <p className="text-sm text-blue-800/80 leading-relaxed">
                            {selectedStudent.recomendaciones ||
                              "Seguir con el plan de estudio estándar."}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tabla de informatica de las materias */}
                    <div className="lg:col-span-4 bg-white border border-gray-100 rounded-3xl p-4 shadow-sm overflow-hidden flex flex-col">

                      <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs text-gray-400 uppercase bg-gray-50/80 sticky top-0 z-10 backdrop-blur-sm">
                            <tr>
                              <th className="text-base px-4 py-3 rounded-l-xl font-semibold">Materia</th>
                              <th className="text-base px-4 py-3 rounded-r-xl w-24 font-semibold">Nota</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {sortedGrades.map(([sub, val]: any, i: number) => {
                              // Colores para las "pastillas" de calificación
                              const colorMap: any = {
                                Baj: "bg-red-100 text-red-700 border-red-200",
                                Bas: "bg-amber-100 text-amber-700 border-amber-200",
                                Alt: "bg-blue-100 text-blue-700 border-blue-200",
                                Sup: "bg-green-100 text-green-700 border-green-200",
                              };

                              return (
                                <tr
                                  key={i}
                                  className="hover:bg-gray-50/50 transition-colors group"
                                >
                                  <td className="px-4 py-2 text-sm font-medium text-gray-600 group-hover:text-gray-900">
                                    {sub}
                                  </td>
                                  <td className="px-4 py-2 text-sm ">
                                    <span
                                      className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border ${colorMap[val] || "bg-gray-100"}`}
                                    >
                                      {val}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })()}
          </section>
        )}
      </section>
    </>
  );
}

// =============================
// 🔧 HELPERS
// =============================

function formatName(name: string) {
  return name.toLowerCase().replace(/\s+/g, "_");
}

function getBadgeColor(val: string) {
  switch (val) {
    case "Baj":
      return "bg-red-100 text-red-600";
    case "Bas":
      return "bg-yellow-100 text-yellow-600";
    case "Alt":
      return "bg-blue-100 text-blue-600";
    case "Sup":
      return "bg-green-100 text-green-600";
    default:
      return "bg-gray-100 text-gray-500";
  }
}

function countGrades(student: any, type: string) {
  return Object.values(student.grades).filter((v: any) => v === type).length;
}
