import Image from "next/image";
import { classifyStudent, getStudentPhotoPath } from "@/src/utils/studentPhotoPreview";
import { StudentRecord } from "@/src/shared/types/academic.types";

type Props = {
  student: StudentRecord;
};

export function StudentQuickPreview({ student }: Props) {
  const metrics = classifyStudent(student);

  return (
    <div className="w-96 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl">
      <div className="flex gap-4">
        <div className="relative h-24 w-20 overflow-hidden rounded-2xl bg-slate-100">
          <Image
            src={getStudentPhotoPath(student)}
            alt={student.name}
            fill
            className="object-cover object-center"
            sizes="80px"
          />
        </div>

        <div className="flex-1">
          <h4 className="line-clamp-2 text-sm font-bold text-slate-800">
            {student.name}
          </h4>

          <p className="text-xs text-slate-500">
            Código: {student.id}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {student.grade}°-{student.group}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 text-center">
        <div className="rounded-xl bg-emerald-500 px-2 py-2 text-xs font-bold text-white">
          {metrics.superior}
        </div>
        <div className="rounded-xl bg-blue-500 px-2 py-2 text-xs font-bold text-white">
          {metrics.alto}
        </div>
        <div className="rounded-xl bg-amber-400 px-2 py-2 text-xs font-bold text-white">
          {metrics.basico}
        </div>
        <div className="rounded-xl bg-red-500 px-2 py-2 text-xs font-bold text-white">
          {metrics.bajo}
        </div>
      </div>
    </div>
  );
}