import { StudentInteractiveCard } from "@/src/components/layout/student_interactive_card";
import { StudentRecord } from "@/src/shared/types/academic.types";

type TopStudent = {
  student: StudentRecord;
  highCount: number;
};

type Props = {
  data: TopStudent[];
};

export function TopStudents({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
      <h3 className="text-2xl font-bold mb-4 text-slate-800">
        Estudiantes Destacados
      </h3>

      <div className="space-y-3">
        {data.length === 0 ? (
          <p className="text-slate-400">
            No hay estudiantes destacados en este filtro.
          </p>
        ) : (
          data.map(({ student, highCount }, index) => (
            <StudentInteractiveCard
              key={student.id}
              student={student}
              onClick={() => console.log("abrir modal", student.id)}
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

                <span className="font-bold text-emerald-500">{highCount}</span>
              </div>
            </StudentInteractiveCard>
          ))
        )}
      </div>
    </div>
  );
}
