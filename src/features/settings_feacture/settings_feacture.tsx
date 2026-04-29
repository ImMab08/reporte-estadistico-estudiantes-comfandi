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
<section className="h-full w-full bg-slate-50 p-3 md:p-4 flex flex-col overflow-y-auto md:overflow-hidden">
  {/* Header */}
  <header className="mb-3 md:mb-4 border-b border-border py-2 md:py-3 flex items-center justify-between">
    <div>
      <h1 className="text-2xl md:text-4xl font-bold text-primary">
        Configuración
      </h1>

      <p className="text-[11px] md:text-base text-slate-500">
        Consulta individual del rendimiento académico
      </p>
    </div>

    <div className="w-20 h-10 md:w-24 md:h-12 relative">
      <Image
        src="/img/logo/logo_comfandi_blue.svg"
        alt="Comfandi"
        fill
        className="object-contain"
        priority
      />
    </div>
  </header>

  {/* Contenido */}
  <section className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 flex-1 min-h-0">

    {/* Upload */}
    <div className="lg:col-span-7 rounded-xl border border-border bg-white p-3 md:p-4 shadow-sm flex flex-col min-h-0">
      <header className="space-y-1 shrink-0">
        <h2 className="text-lg md:text-2xl font-bold text-primary">
          Carga de datos
        </h2>

        <p className="text-xs md:text-base text-gray-500">
          Sube el archivo Excel consolidado.
        </p>
      </header>

      {/* Upload zone */}
      <div
        onClick={() =>
          document.getElementById("academicFileInput")?.click()
        }
        className="flex-1 mt-3 md:mt-4 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center px-4 py-6 md:py-10 cursor-pointer hover:bg-gray-50 transition"
      >
        <IconUploadFile
          className="text-gray-400 mb-3 md:mb-5"
          width={75}
          height={75}
        />

        <h3 className="text-lg md:text-2xl font-semibold text-gray-700">
          Arrastra o selecciona
        </h3>

        <p className="text-xs md:text-base text-gray-500">
          Archivo Excel del periodo
        </p>

        <p className="text-[10px] md:text-sm text-gray-400">
          Formatos soportados: .xlsx, .xls
        </p>

        <button
          type="button"
          className="mt-5 md:mt-8 w-full md:w-auto cursor-pointer px-6 md:px-8 py-3 md:py-4 rounded-2xl bg-primary text-white font-semibold hover:opacity-90 transition"
        >
          {isUploading ? "Procesando..." : "Seleccionar archivo"}
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

    {/* Documentos */}
    <div className="lg:col-span-5 flex flex-col min-h-0">
      <div className="rounded-xl border border-border bg-white p-3 md:p-4 shadow-sm flex flex-col flex-1 min-h-0">
        <h3 className="text-lg md:text-2xl font-bold text-primary mb-3 md:mb-5 shrink-0">
          Documentos cargados
        </h3>

        {snapshots.length === 0 ? (
          <div className="flex-1 rounded-xl flex flex-col items-center justify-center text-center text-gray-400 p-4">
            <IconQuickReference className="size-10 md:size-14 mb-3" />
            <p className="text-sm md:text-lg">
              No hay datos cargados.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3 md:space-y-4 min-h-0">
            {snapshots.map((snapshot) => (
              <div
                key={snapshot.id}
                className="rounded-xl border border-border p-3 md:p-4 bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm md:text-base font-semibold text-gray-800">
                      Periodo {snapshot.period} · {snapshot.year}
                    </p>

                    <p className="text-[10px] md:text-xs text-gray-500 mt-1">
                      {new Date(snapshot.uploadedAt).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteSnapshot(snapshot.id)}
                    className="rounded-lg p-1.5 md:p-2 cursor-pointer text-red-500 hover:bg-red-50 transition"
                  >
                    <IconDelete className="size-4 md:size-5" />
                  </button>
                </div>

                <div className="mt-2 md:mt-3 flex items-center justify-between text-xs md:text-sm text-primary">
                  <p className="flex items-center space-x-1 md:space-x-2">
                    <IconGroup />
                    <span className="font-semibold">
                      {snapshot.stats.totalStudents}
                    </span>
                  </p>

                  <p className="flex items-center space-x-1 md:space-x-2">
                    <IconCollectionsBookmark />
                    <span className="font-semibold">
                      {snapshot.subjects.length}
                    </span>
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
