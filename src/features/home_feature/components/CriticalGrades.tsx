type CriticalCourse = {
  label: string;
  count: number;
};

type Props = {
  data: CriticalCourse[];
};

export function CriticalGrades({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border border-border p-2 md:p-4 shadow-sm">
      <h3 className="text-xl md:text-2xl font-bold mb-4 text-slate-800">
        Cursos con dificultades
      </h3>

      <div className="space-y-3">
        {data.length === 0 ? (
          <p className="text-slate-400">
            No hay cursos con estudiantes en riesgo.
          </p>
        ) : (
          data.map((item, index) => (
            <div
              key={item.label}
              className="flex justify-between rounded-xl border border-border p-3"
            >
              <span className="text-sm md:text-base text-slate-700">
                {index + 1}.  {item.label}
              </span>
              <span className="text-sm md:text-base font-bold text-amber-500">{item.count}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
