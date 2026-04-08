type RiskStudent = {
  id: string;
  name: string;
  grade: string;
  group: string;
  lowCount: number;
};

type Props = {
  data: RiskStudent[];
};

export function RiskStudents({ data }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-2xl font-bold mb-4 text-slate-800">
        Estudiantes con Dificultades
      </h3>

      <div className="space-y-3">
        {data.length === 0 ? (
          <p className="text-slate-400">
            No hay estudiantes en dificultad con este filtro.
          </p>
        ) : (
          data.map((student, index) => (
            <div
              key={student.id}
              className="flex justify-between rounded-2xl border p-3 bg-slate-50"
            >
              <div>
                <p className="font-semibold text-slate-700">
                  {index + 1}. {student.name}
                </p>
                <p className="text-sm text-slate-400">
                  {student.grade}°-{student.group}
                </p>
              </div>

              <span className="font-bold text-red-500">{student.lowCount}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
