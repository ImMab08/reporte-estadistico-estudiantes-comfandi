type CriticalSubject = {
  subject: string;
  count: number;
};

type Props = {
  data: CriticalSubject[];
};

export function CriticalSubjects({ data }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-2xl font-bold mb-4 text-slate-800">
        Materias en bajo rendimiento
      </h3>

      <div className="space-y-3">
        {data.length === 0 ? (
          <p className="text-slate-400">
            No hay materias con bajo rendimiento.
          </p>
        ) : (
          data.map((item, index) => (
            <div
              key={item.subject}
              className="flex justify-between rounded-2xl border p-3 bg-slate-50"
            >
              <span className="font-medium text-slate-700">
                {index + 1}. {item.subject}
              </span>
              <span className="font-bold text-red-500">{item.count}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
