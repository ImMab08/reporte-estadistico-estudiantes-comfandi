"use client";

import { useEffect, useState } from "react";
import { getGrades } from "@/src/utils/storage";
import Image from "next/image";

export function StudentsFeaturePage() {
  const [grades, setGrades] = useState<any[]>([]);
  const [activeGrade, setActiveGrade] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // =============================
  // 📦 Cargar datos
  // =============================
  useEffect(() => {
    const data = getGrades();
    setGrades(data);

    if (data.length > 0) {
      setActiveGrade(data[0]);
    }
  }, []);

  // Reset estudiante al cambiar grado
  useEffect(() => {
    setSelectedStudent(null);
  }, [activeGrade]);

  return (
    <section className="p-4 size-full flex flex-col">
      {/* Header */}
      <header className="py-4 border-b-2 border-border">
        <h1 className="text-3xl font-bold text-primary">Estudiantes</h1>
        <h2 className="text-sm text-gray-500">
          Consulta individual del rendimiento académico
        </h2>
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
        <section className="flex flex-col flex-1 mt-5 space-y-5">
          {/* SELECTOR DE GRADO */}
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

          {/* SELECTOR DE ESTUDIANTE */}
          <select
            className="p-3 border rounded-xl"
            onChange={(e) => {
              const student = activeGrade.students.find(
                (s: any) => s.name === e.target.value,
              );
              setSelectedStudent(student);
            }}
          >
            <option value="">Selecciona un estudiante</option>
            {activeGrade.students.map((s: any, i: number) => (
              <option key={i} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          {/* ========================= */}
          {/* 👤 INFO ESTUDIANTE */}
          {/* ========================= */}
          {selectedStudent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* PERFIL */}
              <div className="p-4 bg-white border rounded-2xl space-y-4">
                {/* FOTO */}
                <div className="flex flex-col items-center">
                  <img
                    src="https://comfandisa-my.sharepoint.com/personal/1127918318_comfandi_com_co1/_layouts/15/download.aspx?UniqueId=9751bc0d-beb5-4206-908a-f304b3fe8468"
                    alt="BENACHI NAVIA SOFIA"
                    loading="lazy"
                    className="w-40 h-40 object-cover rounded"
                  />
                  {/* <img
                    src={`/students/${formatName(selectedStudent.name)}.jpg`}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/default-avatar.png";
                    }}
                    className="w-24 h-24 rounded-full object-cover border"
                  /> */}

                  <h3 className="mt-2 font-bold text-lg text-primary text-center">
                    {selectedStudent.name}
                  </h3>
                </div>

                {/* RESUMEN RÁPIDO */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Stat
                    label="Bajos"
                    value={countGrades(selectedStudent, "Baj")}
                  />
                  <Stat
                    label="Básicos"
                    value={countGrades(selectedStudent, "Bas")}
                  />
                  <Stat
                    label="Altos"
                    value={countGrades(selectedStudent, "Alt")}
                  />
                  <Stat
                    label="Superiores"
                    value={countGrades(selectedStudent, "Sup")}
                  />
                </div>

                {/* CAUSAS */}
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    Posibles causas
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedStudent.causas || "No especificado"}
                  </p>
                </div>

                {/* RECOMENDACIONES */}
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    Recomendaciones
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedStudent.recomendaciones || "No especificado"}
                  </p>
                </div>
              </div>

              {/* TABLA */}
              <div className="p-4 bg-white border rounded-2xl overflow-auto">
                <h3 className="text-sm text-gray-500 mb-2">
                  Rendimiento por materia
                </h3>

                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400">
                      <th>Materia</th>
                      <th>Calificación</th>
                    </tr>
                  </thead>

                  <tbody>
                    {Object.entries(selectedStudent.grades).map(
                      ([sub, val]: any, i: number) => (
                        <tr key={i} className="border-t">
                          <td>{sub}</td>
                          <td>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getBadgeColor(
                                val,
                              )}`}
                            >
                              {val}
                            </span>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}
    </section>
  );
}

// =============================
// 🧩 COMPONENTES AUXILIARES
// =============================

function Stat({ label, value }: any) {
  return (
    <div className="bg-gray-50 border rounded-lg p-2 text-center">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-bold text-primary">{value}</p>
    </div>
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
