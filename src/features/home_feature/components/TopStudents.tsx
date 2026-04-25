"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { StudentInteractiveCard } from "@/src/components/layout/student_interactive_card";
import { StudentRecord } from "@/src/shared/types/academic.types";
import { IconVisibility } from "@/src/shared/icons";
import { displayStudentName } from "@/src/utils/displayStudentName";

type TopStudent = {
  student: StudentRecord;
  highCount: number;
};

type Props = {
  data: TopStudent[];
};

export function TopStudents({ data }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleOpenStudent(studentId: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("student", studentId);
    params.set("modal", "true");

    router.push(`/students?${params.toString()}`);
  }

  return (
    <div className="bg-white rounded-xl border border-border p-2 md:p-4 shadow-sm">
      <h3 className="text-2xl font-bold mb-4 text-slate-800">
        Estudiantes destacados
      </h3>

      <div className="relative space-y-3">
        {data.map(({ student, highCount }, index) => (
          <StudentInteractiveCard
            key={student.id}
            student={student}
            onClick={() => handleOpenStudent(student.id)}
          >
            <div className="flex justify-between rounded-2xl border border-border p-4">
              <div>
                <p className="text-sm md:text-base font-semibold text-slate-700">
                  {index + 1}. {displayStudentName(student.name)}
                </p>
                <p className="text-sm md:text-base text-slate-400">
                  {student.grade}°-{student.group}
                </p>
              </div>

              <span className="font-bold text-emerald-500">{highCount}</span>
              <div className="absolute bottom-1 right-3 block md:hidden">
                <IconVisibility width={20} hanging={20} className="text-slate-300" />
              </div>
            </div>
          </StudentInteractiveCard>
        ))}
      </div>
    </div>
  );
}
