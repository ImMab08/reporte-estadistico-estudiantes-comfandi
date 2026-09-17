"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { PromotionStudent } from "../promotion.types";

import { StudentAvatar } from "@/src/components/layout/student_avatar";
import { getStudentPhotoPath } from "@/src/utils/studentPhotoPreview";
import { CustomSelect } from "@/src/components/ui/custom_select";

type Props = {
  open: boolean;
  losses: number | null;
  students: PromotionStudent[];
  onClose: () => void;
};

export function PromotionLossDistributionModal({
  open,
  losses,
  students,
  onClose,
}: Props) {
  const [selectedGrade, setSelectedGrade] = useState("all");

  const [selectedStatus, setSelectedStatus] = useState("all");

  const router = useRouter();
  const searchParams = useSearchParams();

  if (!open || losses === null) {
    return null;
  }

  const lossStudents = students.filter(
    (student) => student.failedSubjects === losses,
  );

  const promoted = lossStudents.filter((student) => student.promoted).length;

  const notPromoted = lossStudents.length - promoted;

  const grades = [...new Set(lossStudents.map((s) => s.grade))].sort(
    (a, b) => Number(a) - Number(b),
  );

  const gradeOptions = [
    {
      label: "Todos los grados",
      value: "all",
    },

    ...grades.map((grade) => ({
      label: `${grade}°`,
      value: grade,
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

  const filteredStudents = lossStudents.filter((student) => {
    const matchesGrade =
      selectedGrade === "all" || student.grade === selectedGrade;

    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "promoted" && student.promoted) ||
      (selectedStatus === "notPromoted" && !student.promoted);

    return matchesGrade && matchesStatus;
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
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary">
              {losses === 0 ? "Sin pérdidas" : `${losses} pérdidas`}
            </h2>

            <p className="text-slate-500">{lossStudents.length} estudiantes</p>
          </div>

          <button
            onClick={onClose}
            className="
              px-4 py-2
              rounded-xl
              border border-slate-200
              hover:bg-slate-50
              cursor-pointer
            "
          >
            Cerrar
          </button>
        </div>

        <div className="p-6 overflow-auto flex-1">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-slate-500">Estudiantes</p>

              <p className="text-3xl font-bold text-primary">
                {lossStudents.length}
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

          <div className="flex gap-3 mb-6">
            <div className="w-60">
              <CustomSelect
                value={selectedGrade}
                options={gradeOptions}
                onChange={setSelectedGrade}
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

          <div className="space-y-2">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => handleOpenStudent(student.id)}
                className="
                  border border-slate-200
                  rounded-xl
                  p-4
                  hover:bg-slate-50
                  cursor-pointer
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
            ))}

            {filteredStudents.length === 0 && (
              <div className="text-center py-10 text-slate-400">
                No se encontraron estudiantes
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
