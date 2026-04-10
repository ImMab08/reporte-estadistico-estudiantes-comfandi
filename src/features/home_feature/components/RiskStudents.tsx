import { StudentInteractiveCard } from "@/src/components/layout/student_interactive_card";
import type { StudentRecord } from "@/src/shared/types/academic.types";

type RiskStudent = {
  student: StudentRecord;
  lowCount: number;
  highCount: number;
};

type Props = {
  data: RiskStudent[];
};

export function RiskStudents({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
      <h3 className="text-2xl font-bold mb-4 text-slate-800">
        Estudiantes en Riesgo
      </h3>

      <div className="space-y-3">
        {data.length === 0 ? (
          <p className="text-slate-400">
            No hay estudiantes en riesgo en este filtro.
          </p>
        ) : (
          data.map(({ student, lowCount }, index) => (
            <StudentInteractiveCard
              key={student.id}
              student={student}
            >
              <div className="flex justify-between rounded-2xl border border-border p-4">
                <div>
                  <p className="font-semibold text-slate-700">
                    {index + 1}. {student.name}
                  </p>
                  <p className="text-sm text-slate-400">
                    {student.grade}°-{student.group}
                  </p>
                </div>

                <span className="font-bold text-red-500">
                  {lowCount}
                </span>
              </div>
            </StudentInteractiveCard>
          ))
        )}
      </div>
    </div>
  );
}