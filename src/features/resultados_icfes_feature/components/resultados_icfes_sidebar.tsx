"use client";

import Image from "next/image";
import { useIcfesController } from "../hooks/use_icfes_controller";
import { IconRefresh, IconSearch } from "@/src/shared/icons";
import { getStudentPhotoPath } from "@/src/utils/studentPhotoPreview";

type Props = {
  controller: ReturnType<typeof useIcfesController>;
};

export function IcfesSidebar({ controller }: Props) {
  const {
    filteredStudents,
    selectedStudent,
    clearFilters,
    selectedYear,
    setSelectedYear,
    availableYears,

    search,
    setSearch,

    selectedGroup,
    setSelectedGroup,

    groups,

    handleSelectStudent,
  } = controller;

  return (
    <aside className="hidden md:flex max-w-100 w-145 h-full bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex-col space-y-4">
      <div className="border-b border-border space-y-2 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">Filtros</h1>

            <p className="text-sm text-slate-500 mt-1">Resultados Saber 11</p>
          </div>

          <button
            onClick={clearFilters}
            className="rounded-xl border border-slate-200 p-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            <IconRefresh className="text-primary" />
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative">
          <IconSearch className="size-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

          <input
            type="text"
            placeholder="Buscar estudiante..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 rounded-xl border border-border pl-10 pr-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* filtros */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="w-full h-11 rounded-xl border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">Todas las pruebas</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>
              Año {year}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-3">
          {/* grado */}
          <div className="h-11 rounded-xl border border-border bg-slate-50 px-3 flex items-center text-sm font-medium text-slate-600">
            Grado evaluado · 11°
          </div>

          {/* grupo */}
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full h-11 rounded-xl border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">Todos los grupos</option>

            {groups.map((group) => (
              <option key={group} value={group}>
                Grupo {group}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-1 space-y-2">
        {filteredStudents.map((student) => {
          const isSelected = selectedStudent?.id === student.id;

          return (
            <button
              key={student.id}
              onClick={() => handleSelectStudent(student.id)}
              className={`w-full p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-white hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative size-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  {student.photo ? (
                    <Image
                      src={getStudentPhotoPath(student)}
                      alt={student.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center text-sm font-bold text-slate-400">
                      {student.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* INFO */}

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-slate-800 truncate">
                    {student.name}
                  </h3>

                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span>11-{student.group}</span>

                    <span>•</span>

                    <span>Percentil {student.percentile}</span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Puntaje global
                    </span>

                    <span className="text-lg font-bold text-primary">
                      {student.globalScore}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
