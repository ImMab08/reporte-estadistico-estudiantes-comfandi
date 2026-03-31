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
                const maxChartValue = Math.max(...counts, 6);

                const chartData = [
                  { label: "SUP", value: counts[0], color: "bg-green-500" },
                  { label: "ALT", value: counts[1], color: "bg-blue-500" },
                  { label: "BAS", value: counts[2], color: "bg-amber-400" },
                  { label: "BAJ", value: counts[3], color: "bg-red-500" },
                ];

                // 3. Lógica para Promedio y Ranking (NUEVO)
                const getStudentScore = (studentInfo: any) => {
                  const g = Object.values(studentInfo.grades);
                  if (g.length === 0) return 0;
                  const total = g.reduce(
                    (acc: number, val: any) => acc + (gradeWeight[val] || 0),
                    0,
                  );
                  return total / g.length;
                };

                const currentScore = getStudentScore(selectedStudent);

                // Calcular el puntaje de todos para saber la posición
                const allScores = activeGrade.students
                  .map((s: any) => ({
                    name: s.name,
                    score: getStudentScore(s),
                  }))
                  .sort((a: any, b: any) => b.score - a.score);

                const rank =
                  allScores.findIndex(
                    (s: any) => s.name === selectedStudent.name,
                  ) + 1;
                const totalStudents = allScores.length;

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden gap-6 animate-in fade-in duration-500">
                    {/* Columna izquierda */}
                    {/* Columna izquierda */}
                    <div className="lg:col-span-5 space-y-6 overflow-auto">
                      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm h-full flex flex-col overflow-hidden">
                        {/* ======================================= */}
                        {/* ZONA FIJA SUPERIOR: Foto y datos        */}
                        {/* ======================================= */}
                        <div className="flex gap-4 relative shrink-0 pb-4 border-b border-gray-100">
                          {/* Foto del estudiante */}
                          <div className="relative p-1 bg-linear-to-tr from-primary to-blue-300 rounded-xl shrink-0">
                            <div className="w-28 h-28 lg:w-40 lg:h-40 rounded-xl overflow-hidden border-4 border-white bg-gray-50 flex items-center justify-center">
                              <iframe
                                src="https://comfandisa-my.sharepoint.com/personal/1127918318_comfandi_com_co1/_layouts/15/embed.aspx?UniqueId=9751bc0d-beb5-4206-908a-f304b3fe8468"
                                width="100%"
                                height="100%"
                                className="pointer-events-none scale-[1.60] origin-center"
                                title={selectedStudent.name}
                              ></iframe>
                            </div>
                          </div>

                          {/* Datos del estudiante */}
                          <div className="w-full space-y-1">
                            <h3 className="text-2xl font-black mb-1 text-gray-800 leading-tight">
                              {selectedStudent.name}
                            </h3>
                            <p className="text-sm font-bold text-gray-500">
                              Grado: {activeGrade.gradeLabel}
                            </p>
                            <p className="text-sm leading-2 font-bold text-gray-500">
                              Curso: {activeGrade.gradeLabel}
                            </p>
                          </div>

                          <div className="absolute right-0 top-0">
                            <h4 className="text-base font-bold text-gray-500 text-right">
                              Puesto
                            </h4>
                            <div className="flex justify-end gap-1">
                              <span className="text-xs font-black text-amber-500">
                                #{rank}
                              </span>
                              <span className="text-xs font-bold text-gray-400">
                                de {totalStudents}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* ======================================= */}
                        {/* ZONA SCROLLEABLE: Gráficos y más        */}
                        {/* ======================================= */}
                        <div className="flex-1 overflow-y-auto pr-2 mt-4 space-y-4 custom-scrollbar">
                          {/* Gráfico de Barras Original */}
                          <div className="w-full border border-gray-100 rounded-2xl p-4 shadow-inner bg-gray-50/50">
                            <h4 className="text-[10px] uppercase font-bold text-gray-500 mb-3 text-center">
                              Materias por nivel
                            </h4>
                            <div className="flex h-50 items-end justify-between gap-2 border-l border-b border-gray-200 pl-2 pb-1 relative">
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
                                  <div className="w-full h-full bg-white rounded-t-md relative flex items-end overflow-hidden border border-gray-100">
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

                          {/* Fortalezas y Áreas de Mejora */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {/* Destaca en... */}
                            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
                              <h4 className="text-xs font-bold text-emerald-700 mb-3 flex items-center gap-1.5">
                                <span>🚀</span> Fortalezas
                              </h4>
                              <ul className="space-y-2">
                                {sortedGrades
                                  .filter(
                                    (g: any) =>
                                      g[1] === "Sup" || g[1] === "Alt",
                                  )
                                  .slice(0, 3)
                                  .map(([sub, val]: any, i: number) => (
                                    <li
                                      key={i}
                                      className="text-[11px] font-semibold text-emerald-800 flex justify-between items-center bg-white/60 p-1.5 rounded-lg border border-emerald-100/50"
                                    >
                                      <span className="truncate pr-2">
                                        {sub}
                                      </span>
                                      <span className="bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded text-[9px]">
                                        {val}
                                      </span>
                                    </li>
                                  ))}
                              </ul>
                            </div>

                            {/* Requiere atención en... */}
                            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4">
                              <h4 className="text-xs font-bold text-rose-700 mb-3 flex items-center gap-1.5">
                                <span>⚠️</span> Atención en
                              </h4>
                              <ul className="space-y-2">
                                {sortedGrades
                                  .filter(
                                    (g: any) =>
                                      g[1] === "Baj" || g[1] === "Bas",
                                  )
                                  .reverse()
                                  .slice(0, 3)
                                  .map(([sub, val]: any, i: number) => (
                                    <li
                                      key={i}
                                      className="text-[11px] font-semibold text-rose-800 flex justify-between items-center bg-white/60 p-1.5 rounded-lg border border-rose-100/50"
                                    >
                                      <span className="truncate pr-2">
                                        {sub}
                                      </span>
                                      <span className="bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded text-[9px]">
                                        {val}
                                      </span>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          </div>

                          {/* AQUI PUEDES AGREGAR MÁS CONTENIDO, EL SCROLL FUNCIONARÁ AUTOMÁTICAMENTE */}
                        </div>
                      </div>
                    </div>

                    {/* Tabla de informatica de las materias */}
                    <div className="lg:col-span-7 bg-white border border-gray-100 rounded-2xl p-2 shadow-sm overflow-hidden flex flex-col">
                      <div className="flex-1 overflow-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs text-gray-400 uppercase bg-gray-50/80 sticky top-0 z-10 backdrop-blur-sm">
                            <tr>
                              <th className="text-base px-4 py-3 rounded-l-xl font-semibold">
                                Materia
                              </th>
                              <th className="text-base px-4 py-3 rounded-r-xl w-24 font-semibold text-center">
                                Nota
                              </th>
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
                                  <td className="px-4 py-3 text-sm font-medium text-gray-600 group-hover:text-gray-900">
                                    {sub}
                                  </td>
                                  <td className="px-4 py-3 text-sm flex justify-center">
                                    <span
                                      className={`px-3 py-1 text-[11px] font-black uppercase rounded-lg border ${colorMap[val] || "bg-gray-100"}`}
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

function countGrades(student: any, type: string) {
  return Object.values(student.grades).filter((v: any) => v === type).length;
}
