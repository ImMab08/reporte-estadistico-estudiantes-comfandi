"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { PromotionStudent } from "../promotion.types";

import { CustomSelect } from "@/src/components/ui/custom_select";
import { StudentAvatar } from "@/src/components/layout/student_avatar";
import { getStudentPhotoPath } from "@/src/utils/studentPhotoPreview";

type Props = {
  open: boolean;
  grade: string | null;
  students: PromotionStudent[];
  onClose: () => void;
};

export function PromotionGradeModal({ open, grade, students, onClose }: Props) {
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  if (!open || !grade) {
    return null;
  }

  const gradeStudents = students.filter((student) => student.grade === grade);
  const promoted = gradeStudents.filter((student) => student.promoted).length;
  const notPromoted = gradeStudents.length - promoted;

  const groups = [
    ...new Set(
      gradeStudents.map((student) => `${student.grade}-${student.group}`),
    ),
  ];

  const courseOptions = [
    {
      label: "Todos los cursos",
      value: "all",
    },

    ...groups.map((group) => ({
      label: group,
      value: group,
    })),
  ];

  const statusOptions = [
    {
      label: "Todos",
      value: "all",
    },
    {
      label: "Promovidos",
      value: "promoted",
    },
    {
      label: "No promovidos",
      value: "notPromoted",
    },
  ];

  const filteredStudents = gradeStudents.filter((student) => {
    const studentCourse = `${student.grade}-${student.group}`;

    const matchesCourse =
      selectedCourse === "all" || studentCourse === selectedCourse;

    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "promoted" && student.promoted) ||
      (selectedStatus === "notPromoted" && !student.promoted);

    return matchesCourse && matchesStatus;
  });

  function handleOpenStudent(studentId: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("student", studentId);
    params.set("modal", "true");

    router.push(`/students?${params.toString()}`);
  }

  return (
    <div className="fixed inset-0 z-100 bg-black/30 flex justify-end">
      <div className="w-175 h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* HEADER */}
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary">Grado {grade}°</h2>

            <p className="text-slate-500">{gradeStudents.length} estudiantes</p>
          </div>

          <button
            onClick={onClose}
            className="
              px-4 py-2
              cursor-pointer
              rounded-xl
              border border-slate-200
              hover:bg-slate-50
            "
          >
            Cerrar
          </button>
        </div>

        <div className="p-6 overflow-auto flex-1">
          {/* KPIs */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-slate-500">Estudiantes</p>

              <p className="text-3xl font-bold text-primary">
                {gradeStudents.length}
              </p>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4">
              <p className="text-sm text-slate-500">Promovidos</p>

              <p className="text-3xl font-bold text-emerald-600">{promoted}</p>
            </div>

            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-sm text-slate-500">No promovidos</p>

              <p className="text-3xl font-bold text-red-500">{notPromoted}</p>
            </div>
          </div>

          {/* FILTROS */}
          <div className="flex gap-3 mb-6">
            <div className="w-60">
              <CustomSelect
                value={selectedCourse}
                options={courseOptions}
                onChange={setSelectedCourse}
              />
            </div>

            <div className="w-52">
              <CustomSelect
                value={selectedStatus}
                options={statusOptions}
                onChange={setSelectedStatus}
              />
            </div>
          </div>

          {/* LISTA */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-slate-700">Estudiantes</h3>

              <span className="text-sm text-slate-500">
                {filteredStudents.length} resultados
              </span>
            </div>

            <div className="space-y-2">
              {filteredStudents.map((student) => {
                const isExpanded = expandedStudent === student.id;

                return (
                  <div
                    key={student.id}
                    className="
                      border border-slate-200
                      rounded-xl
                      overflow-hidden
                      transition-all
                      duration-300
                    "
                  >
                    <div
                      onClick={() => {
                        if (student.failedAreas.length === 0) {
                          handleOpenStudent(student.id);
                          return;
                        }

                        setExpandedStudent(isExpanded ? null : student.id);
                      }}
                      className="
												p-4
												cursor-pointer
												hover:bg-slate-50
												transition-all
											"
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center gap-3">
                          <StudentAvatar
                            name={student.name}
                            photo={getStudentPhotoPath(student)}
                            size="lg"
                          />

                          <div>
                            <p className="font-semibold text-slate-800">
                              {student.name}
                            </p>

                            <p className="text-sm text-slate-500">
                              {student.grade}°-{student.group}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p
                            className={
                              !student.promoted
                                ? "text-red-500 font-semibold"
                                : student.failedSubjects > 0
                                  ? "text-amber-600 font-semibold"
                                  : "text-emerald-600 font-semibold"
                            }
                          >
                            {!student.promoted
                              ? "No promovido"
                              : student.failedSubjects > 0
                                ? "Promovido con riesgo"
                                : "Promovido"}
                          </p>

                          <p className="text-sm text-slate-500">
                            {student.failedSubjects} pérdidas
                          </p>
                        </div>
                      </div>
                    </div>

                    {isExpanded && student.failedAreas.length > 0 && (
                      <div className="border-t border-slate-100 px-4 py-4 bg-slate-50">
                        <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">
                          Materias con desempeño bajo
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {student.failedAreas.map((area) => (
                            <span
                              key={area}
                              className="
																px-3 py-1
																rounded-xl
																text-xs
																font-medium
																bg-red-50
																text-red-600
																border border-red-100
															"
                            >
                              {area}
                            </span>
                          ))}
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenStudent(student.id);
                            }}
                            className="
															px-4 py-2
															rounded-xl
															bg-primary
															text-white
															text-sm
															font-medium
															hover:opacity-90
															transition-all
															cursor-pointer
														"
                          >
                            Ver historial académico
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredStudents.length === 0 && (
                <div className="text-center py-10 text-slate-400">
                  No se encontraron estudiantes
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
