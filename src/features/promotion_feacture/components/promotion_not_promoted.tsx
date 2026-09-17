"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { StudentAvatar } from "@/src/components/layout/student_avatar";
import { CustomSelect } from "@/src/components/ui/custom_select"; 

import { getStudentPhotoPath } from "@/src/utils/studentPhotoPreview";

import type { PromotionStudent } from "../promotion.types";

type Props = {
  data: PromotionStudent[];
};

export function PromotionNotPromoted({ data }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [gradeFilter, setGradeFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [search, setSearch] = useState("");

  function handleOpenStudent(studentId: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("student", studentId);
    params.set("modal", "true");

    router.push(`/students?${params.toString()}`);
  }

  const grades = [...new Set(data.map((s) => String(s.grade)))].sort(
    (a, b) => Number(a) - Number(b)
  );

  const groups = [...new Set(data.map((s) => String(s.group)))].sort();

  const gradeOptions = [
    { label: "Todos los grados", value: "all" },
    ...grades.map((grade) => ({
      label: `${grade}°`,
      value: grade,
    })),
  ];

  const groupOptions = [
    { label: "Todos los grupos", value: "all" },
    ...groups.map((group) => ({
      label: `${group}`,
      value: group,
    })),
  ];

  const filteredData = data.filter((student) => {
    const matchesGrade =
      gradeFilter === "all" ||
      String(student.grade) === gradeFilter;

    const matchesGroup =
      groupFilter === "all" ||
      String(student.group) === groupFilter;

    const matchesSearch = student.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesGrade && matchesGroup && matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col  justify-between gap-4 mb-6">
        <h3 className="text-xl font-bold text-primary ">
          Estudiantes no promovidos
        </h3>

        <div className="flex items-center gap-3">
          <div className="w-44">
            <CustomSelect
              value={gradeFilter}
              options={gradeOptions}
              onChange={setGradeFilter}
            />
          </div>

          <div className="w-44">
            <CustomSelect
              value={groupFilter}
              options={groupOptions}
              onChange={setGroupFilter}
            />
          </div>

          <input
            type="text"
            placeholder="Buscar estudiante..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              h-10
              w-64
              rounded-xl
              border
              border-slate-200
              px-4
              text-sm
              outline-none
              transition-all
              focus:border-primary
            "
          />

          <span className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 whitespace-nowrap">
            {filteredData.length} estudiantes
          </span>
        </div>
      </div>

      {/* Encabezados */}
      <div className="grid grid-cols-9 gap-4 text-sm font-medium text-slate-500 border-b pb-3">
        <div className="px-2 col-span-4">Estudiante</div>
        <div className="px-2 col-span-4">Materias perdidas</div>
        <div className="px-2 col-span-1 text-center">#</div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-2">
          {filteredData.length === 0 ? (
            <div className="py-10 text-center text-slate-500">
              No se encontraron estudiantes.
            </div>
          ) : (
            filteredData.map((student) => (
              <div
                key={student.id}
                onClick={() => handleOpenStudent(student.id)}
                className="
                  pl-2
                  grid
                  grid-cols-9
                  gap-4
                  items-center
                  py-3
                  border-b
                  border-slate-100
                  hover:bg-slate-50
                  transition-all
                  cursor-pointer
                "
              >
                {/* Estudiante */}
                <div className="col-span-4 flex items-center gap-3">
                  <StudentAvatar
                    name={student.name}
                    photo={getStudentPhotoPath(student)}
                    size="lg"
                  />

                  <div>
                    <p className="font-semibold text-slate-800">
                      {student.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      Grado: {student.grade}°-{student.group}
                    </p>
                  </div>
                </div>

                {/* Materias */}
                <div className="col-span-4 flex flex-wrap gap-2">
                  {student.failedAreas.map((area) => (
                    <span
                      key={area}
                      className="
                        px-3
                        py-1
                        rounded-xl
                        text-xs
                        font-medium
                        bg-red-50
                        text-red-600
                        border
                        border-red-100
                      "
                    >
                      {area}
                    </span>
                  ))}
                </div>

                {/* Cantidad */}
                <div className="col-span-1 text-center font-bold text-slate-700">
                  {student.failedSubjects}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}