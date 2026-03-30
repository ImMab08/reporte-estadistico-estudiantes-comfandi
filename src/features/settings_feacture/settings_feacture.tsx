"use client";
import { useEffect, useRef, useState } from "react";

import { dropBoxGradeStudents } from "./data";

import { parseExcel } from "@/src/utils/parseExcel";
import { getGrades, saveGradeData } from "@/src/utils/storage";
import { processStudents } from "@/src/utils/processStudents";

import {
  IconDeleteForever,
  IconKeyboardArrowUp,
  IconUploadFile,
  IconWarning,
} from "@/src/shared/icons";

export function SettingsFeacture() {
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const [grades, setGrades] = useState<any[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const isDisabled = !selected;

  //? Cerrar dropbox al hacer clic por fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setOpenSection(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const data = getGrades();
    setGrades(data);
  }, []);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !selected) return;

    try {
      const rawData = await parseExcel(file);
      const { students, subjects } = processStudents(rawData);

      const newGrade = {
        gradeId: selected,
        gradeLabel: selectedLabel,
        students,
        subjects,
        createdAt: new Date().toISOString(),
      };

      saveGradeData(newGrade);
      setGrades((prev) => [...prev, newGrade]);
			setSelected(null);

      console.log("Guardado:", newGrade);
    } catch (error) {
      console.error("Error procesando archivo", error);
    }
  }

  //? Obtener label seleccionado
  const selectedLabel =
    dropBoxGradeStudents.flatMap((g) => g.groups).find((g) => g.id === selected)
      ?.label || "Seleccionar grupo";

  return (
    <section className="p-4 size-full flex flex-col">
      {/* Encabezado principal */}
      <header className="py-4 border-b-2 border-border">
        <h1 className="text-3xl font-bold text-primary">Configuración</h1>
        <h2 className="text-sm text-gray-500">
          Carga y gestiona los datos de estudiantes
        </h2>
      </header>

      {/* Contenido */}
      <section className="flex items-center justify-center flex-1 min-h-0 mt-5 space-x-4">
        {/* Lado izquierdo */}
        <div className="size-full p-4 rounded-2xl border border-border space-y-8 bg-white">
          {/* Primer parte */}
          <div className="space-y-2">
            <header className="">
              <h3 className="text-2xl font-bold text-primary">
                1. Seleccionar Grado
              </h3>
              <h4 className="text-xs text-gray-500">
                Elige el grado al que pertenecen los datos del excel que vas a
                cargar
              </h4>
            </header>
            <div className="w-full relative" ref={dropdownRef}>
              {/* Botón principal */}
              <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center px-4 py-3 rounded-xl border border-border bg-white shadow-sm hover:bg-gray-50 transition cursor-pointer"
              >
                <p className="text-sm font-medium text-gray-700">
                  Grado seleccionado:{" "}
                  <span className="font-bold">{selectedLabel}</span>
                </p>
                <div className="flex items-center gap-1 relative">
                  {selected && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(null);
                      }}
                      className="transition"
                    >
                      <IconDeleteForever />
                    </div>
                  )}

                  <IconKeyboardArrowUp
                    className={`transition-transform duration-300 ${
                      open ? "rotate-0" : "rotate-180"
                    }`}
                  />
                </div>
              </button>

              {/* Dropdown */}
              {open && (
                <div className="mt-2 border absolute z-50 w-full border-border rounded-lg p-2 bg-white shadow-lg max-h-64 overflow-y-auto">
                  {dropBoxGradeStudents.map((section) => (
                    <div key={section.grade} className="bg-white">
                      {/* Grado */}
                      <button
                        onClick={() =>
                          setOpenSection(
                            openSection === section.grade
                              ? null
                              : section.grade,
                          )
                        }
                        className="w-full flex justify-between bg-white cursor-pointer items-center px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                      >
                        <span className="font-medium text-gray-700">
                          Grado {section.grade}
                        </span>
                        <span className="text-xs">
                          {openSection === section.grade ? "−" : "+"}
                        </span>
                      </button>

                      {/* Grupos */}
                      {openSection === section.grade && (
                        <div className="ml-4 mt-1 space-y-1 bg-white">
                          {section.groups.map((group) => (
                            <button
                              key={group.id}
                              onClick={() => {
                                setSelected(group.id);
                                setOpen(false);
                                setOpenSection(null);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition cursor-pointer
                            ${
                              selected === group.id
                                ? "bg-primary text-white"
                                : "hover:bg-gray-100 text-gray-700"
                            }`}
                            >
                              {group.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Segunda parte */}
          <div className="space-y-2">
            <header className="">
              <h3 className="text-2xl font-bold text-primary">
                2. Cargar archivo de excel
              </h3>
              <h4 className="text-xs text-gray-500">
                Arrastra y suelta un archivo Excel o haz clic para seleccionar
              </h4>
            </header>
            <div
              className={`w-full border-2 border-dashed border-border rounded-xl p-6 py-32 text-center transition ${isDisabled ? "opacity-50 cursor-not-allowed " : "hover:bg-gray-50 cursor-pointer"}`}
              onClick={() => {
                if (isDisabled) return;
                document.getElementById("fileInput")?.click();
              }}
            >
              {isDisabled ? (
                <div className="flex flex-col items-center">
                  <IconWarning
                    className="text-gray-500 mb-3"
                    width={50}
                    height={50}
                  />
                  <p className="text-base text-gray-500">
                    Para cargar un archivo, primero <br /> debes de seleccionar
                    un grado.
                  </p>
                  <p className="text-sm text-gray-400 mt-3">
                    Formatos: .xlsx, .xls
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <IconUploadFile
                    className="text-gray-500 mb-3"
                    width={50}
                    height={50}
                  />
                  <p className="text-base text-gray-500">
                    Arrastra un archivo de Excel aquí <br /> o haz clic para
                    seleccionar uno
                  </p>
                  <p className="text-sm text-gray-400 mt-3">
                    Formatos: .xlsx, .xls
                  </p>
                  <input
                    id="fileInput"
                    type="file"
                    accept=".xlsx, .xls"
                    className="hidden"
                    onChange={(e) => handleFile(e)}
                    disabled={isDisabled}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lado derecho */}
        <div className="size-full p-4 rounded-2xl border border-border overflow-y-auto bg-white">
          <h3 className="text-xl font-bold mb-4 text-primary">
            Archivos cargados
          </h3>

          {grades.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No hay archivos cargados aún
            </p>
          ) : (
            <div className="space-y-3">
              {grades.map((grade, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-xl bg-gray-50 shadow-sm"
                >
                  <p className="font-semibold text-gray-800">
                    {grade.gradeLabel}
                  </p>

                  <p className="text-xs text-gray-500">
                    {new Date(grade.createdAt).toLocaleString()}
                  </p>

                  <div className="mt-2 text-sm text-gray-600">
                    <p>👥 Estudiantes: {grade.students.length}</p>
                    <p>📚 Materias: {grade.subjects.length}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
