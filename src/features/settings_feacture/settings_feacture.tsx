"use client";

import { useEffect, useState } from "react";

import { parseExcel } from "@/src/utils/parseExcel";
import { processAcademicPeriod } from "@/src/utils/processAcademicPeriod";
import {
  getAcademicSnapshots,
  saveAcademicSnapshot,
  deleteAcademicSnapshot,
} from "@/src/utils/academicStorage";

import {
  IconCollectionsBookmark,
  IconDelete,
  IconGroup,
  IconQuickReference,
  IconUploadFile,
} from "@/src/shared/icons";

import { AcademicPeriodSnapshot } from "@/src/shared/types/academic.types";
import { detectAcademicPeriod } from "@/src/utils/detectAcademicPeriod";
import Image from "next/image";

export function SettingsFeacture() {
  const [snapshots, setSnapshots] = useState<AcademicPeriodSnapshot[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  function handleDeleteSnapshot(snapshotId: string) {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar este periodo cargado?",
    );

    if (!confirmed) return;

    deleteAcademicSnapshot(snapshotId);

    const updated = Object.values(getAcademicSnapshots()).sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    );

    setSnapshots(updated);
  }

  // Temporal mientras conectamos selector real
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const data = Object.values(getAcademicSnapshots());
    const sorted = data.sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    );

    setSnapshots(sorted);
  }, []);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const rawData = await parseExcel(file);

      const detectedPeriod = detectAcademicPeriod(file.name);

      const snapshot = processAcademicPeriod({
        data: rawData,
        fileName: file.name,
        year: currentYear,
        period: detectedPeriod,
      });

      saveAcademicSnapshot(snapshot);

      const updated = Object.values(getAcademicSnapshots()).sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
      );

      setSnapshots(updated);
    } catch (error) {
      console.error("Error procesando archivo académico:", error);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  return (
    <section className="h-full w-full bg-slate-50 p-4 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="mb-6 border-b border-border pb-3.25 shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary">Configuración</h1>
          <p className="text-slate-500 mt-1 mb-1">
            Consulta individual del rendimiento académico
          </p>
        </div>

        <div className="flex justify-center">
          <Image
            alt=""
            width={150}
            height={150}
            className="object-contain"
            src="/img/logo/logo_comfandi_blue.svg"
          />
        </div>
      </header>

      {/* Contenido */}
      <section className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        {/* Panel derecho */}
        <div className="col-span-12 lg:col-span-7 rounded-xl border overflow-hidden border-border bg-white p-4 shadow-sm flex flex-col min-h-0">
          <header className="space-y-1 shrink-0">
            <h2 className="text-2xl font-bold text-primary">Carga de datos</h2>
            <p className="text-gray-500 text-base">
              Sube el archivo Excel consolidado con todos los estudiantes del
              periodo académico.
            </p>
          </header>

          {/* Upload zone */}
          <div
            onClick={() =>
              document.getElementById("academicFileInput")?.click()
            }
            className="flex-1 min-h-0 mt-4 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center px-4 cursor-pointer hover:bg-gray-50 transition"
          >
            <IconUploadFile
              className="text-gray-400 mb-5"
              width={70}
              height={70}
            />

            <h3 className="text-2xl font-semibold text-gray-700">
              Arrastra o selecciona el Excel
            </h3>

            <p className="text-gray-500 max-w-xl">
              Archivo general del colegio por periodo académico
            </p>

            <p className="text-sm text-gray-400">
              Formatos soportados: .xlsx, .xls
            </p>

            <button
              type="button"
              className="mt-8 cursor-pointer px-8 py-4 rounded-2xl bg-primary text-white font-semibold hover:opacity-90 transition"
            >
              {isUploading ? "Procesando archivo..." : "Seleccionar archivo"}
            </button>

            <input
              id="academicFileInput"
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleFile}
            />
          </div>
        </div>

        {/* Panel izquierdo */}
        <div className="col-span-12 lg:col-span-5 flex flex-col min-h-0">
          <div className="rounded-xl border border-border bg-white p-4 shadow-sm flex flex-col flex-1 min-h-0">
            <h3 className="text-2xl font-bold text-primary mb-5 shrink-0">
              Documentos cargados
            </h3>

            {snapshots.length === 0 ? (
              <div className="flex-1 rounded-xl flex flex-col items-center justify-center text-center text-gray-400 p-4">
                <IconQuickReference className="size-14 mb-3" />
                <p className="text-lg">No hay datos cargados.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
                {snapshots.map((snapshot) => (
                  <div
                    key={snapshot.id}
                    className="rounded-xl border border-border p-4 bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">
                          Periodo {snapshot.period} · Año {snapshot.year}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(snapshot.uploadedAt).toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteSnapshot(snapshot.id)}
                        className="rounded-lg p-2 cursor-pointer text-red-500 hover:bg-red-50 transition"
                        title="Eliminar periodo"
                      >
                        <IconDelete className="size-5" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-sm text-primary">
                      <p className="flex items-center space-x-2">

                        <IconGroup />
                        <span className="font-semibold"> {snapshot.stats.totalStudents} estudiantes</span>
                      </p>
                      <p className="flex items-center space-x-2">

                        <IconCollectionsBookmark  />
                        <span className="font-semibold"> {snapshot.subjects.length} materias</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </section>
  );
}
