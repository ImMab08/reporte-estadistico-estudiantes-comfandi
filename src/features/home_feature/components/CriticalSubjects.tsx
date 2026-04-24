type CriticalSubject = {
  subject: string;
  count: number;
};

type Props = {
  data: CriticalSubject[];
};

export function CriticalSubjects({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border border-border p-2 md:p-4 shadow-sm">
      <h3 className="text-xl md:text-2xl font-bold mb-4 text-slate-800">
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
              className="flex justify-between rounded-xl border border-border p-3"
            >
              <span className="text-sm md:text-base font-medium text-slate-700">
                {index + 1}. <br className="block md:hidden" /> {item.subject}
              </span>
              <span className="text-sm md:text-base font-bold text-red-500">{item.count}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
