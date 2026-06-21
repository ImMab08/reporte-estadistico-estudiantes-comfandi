"use client";
import { PromotionStudent } from "../promotion.types";
import { StudentAvatar } from "@/src/components/layout/student_avatar";
import { getStudentPhotoPath } from "@/src/utils/studentPhotoPreview";

type Props = {
  data: PromotionStudent[];
};

export function PromotionNotPromoted({ data }: Props) {
  console.log(data);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-primary">
          Estudiantes no promovidos
        </h3>

        <span className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600">
          {data.length} estudiantes
        </span>
      </div>

      {/* Encabezados */}
      <div className="grid grid-cols-12 gap-4 text-sm font-medium text-slate-500 border-b pb-3">
        <div className="px-2 col-span-4">Estudiante</div>
        <div className="px-2 col-span-4">Materias perdidas</div>
        <div className="px-2 col-span-1 text-center">#</div>
      </div>

      {/* Body Scroll */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-2">
          {data.map((student) => (
            <div
              key={student.id}
              className="pl-2 grid grid-cols-12 gap-4 items-center py-3 border-b border-slate-100 hover:scale-101 transition-all duration-300 hover:bg-slate-100 cursor-pointer"
            >
              {/* Estudiante */}
              <div className="col-span-4 flex items-center gap-3">
                <StudentAvatar
                  name={student.name}
                  photo={getStudentPhotoPath(student)}
                  size="lg"
                />

                <div>
                  <p className="font-semibold text-slate-800">{student.name}</p>

                  <p className="text-xs text-slate-500">Grado: {student.grade}°-{student.group}</p>
                </div>
              </div>

              {/* Materias */}
              <div className="col-span-4 flex flex-wrap gap-2">
                {student.failedAreas.map((area) => (
                  <span
                    key={area}
                    className="px-3 py-1 rounded-xl text-xs font-medium bg-red-50 text-red-600 border border-red-100"
                  >
                    {area}
                  </span>
                ))}
              </div>

              {/* Perdidas */}
              <div className="col-span-1 text-center font-bold text-slate-700">
                {student.failedSubjects}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
