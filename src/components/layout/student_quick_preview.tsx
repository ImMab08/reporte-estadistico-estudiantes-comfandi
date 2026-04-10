import Image from "next/image";
import {
  classifyStudent,
  getStudentPhotoPath,
} from "@/src/utils/studentPhotoPreview";
import { StudentRecord } from "@/src/shared/types/academic.types";

type Props = {
  student: StudentRecord;
};

export function StudentQuickPreview({ student }: Props) {
  const metrics = classifyStudent(student);

  return (
    <div className="w-auto rounded-xl border border-border p-2 bg-white shadow-2xl">
      <div className=" gap-4">
        <div className="flex space-x-4">
          <div className="relative h-32 w-24 overflow-hidden rounded-2xl bg-slate-100">
            <Image
              src={getStudentPhotoPath(student)}
              alt={student.name}
              fill
              className="object-cover object-center"
              sizes="120px"
            />
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="rounded-xl bg-emerald-500 px-2 py-2 text-white flex flex-col items-center justify-between">
              <p className="text-base font-bold rounded-full bg-white w-full h-auto text-center">
                <span className="text-emerald-500">{metrics.superior}</span>
              </p>
              <span className="[writing-mode:vertical-rl] rotate-180 text-base font-semibold tracking-wide mt-1">
                Superior
              </span>
            </div>
            <div className="rounded-xl bg-blue-500 px-2 py-2 text-white flex flex-col items-center justify-between">
              <p className="text-base font-bold rounded-full bg-white w-full h-auto text-center">
                <span className="text-blue-500">{metrics.alto}</span>
              </p>
              <span className="[writing-mode:vertical-rl] rotate-180 text-base font-semibold tracking-wide mt-1">
                Alto
              </span>
            </div>
            <div className="rounded-xl bg-amber-500 px-2 py-2 text-white flex flex-col items-center justify-between">
              <p className="text-base font-bold rounded-full bg-white w-full h-auto text-center">
                <span className="text-amber-500">{metrics.basico}</span>
              </p>
              <span className="[writing-mode:vertical-rl] rotate-180 text-base font-semibold tracking-wide mt-1">
                Básico
              </span>
            </div>
            <div className="rounded-xl bg-red-500 px-2 py-2 text-white flex flex-col items-center justify-between">
              <p className="text-base font-bold rounded-full bg-white w-full h-auto text-center">
                <span className="text-red-500">{metrics.bajo}</span>
              </p>
              <span className="[writing-mode:vertical-rl] rotate-180 text-base font-semibold tracking-wide mt-1">
                Bajo
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 mt-2">
          <h4 className="line-clamp-2 text-sm font-bold text-slate-800">
            {student.name}
          </h4>

          <p className="text-xs text-slate-500">Código: {student.id}</p>

          <p className="mt-1 text-xs text-slate-500">
            {student.grade}°-{student.group}
          </p>
        </div>
      </div>
    </div>
  );
}
