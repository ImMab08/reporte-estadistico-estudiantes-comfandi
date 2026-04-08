type DashboardKpisProps = {
  totalStudents: number;
  studentsAtRisk: number;
  topStudents: number;
  criticalSubjects: number;
};

function KpiCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm min-h-[120px] flex flex-col justify-center">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-4xl font-bold text-primary mt-2">{value}</p>
    </div>
  );
}

export function DashboardKpis({
  totalStudents,
  studentsAtRisk,
  topStudents,
  criticalSubjects,
}: DashboardKpisProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <KpiCard title="Estudiantes" value={totalStudents} />
      <KpiCard title="Materias críticas" value={criticalSubjects} />
      <KpiCard title="Con dificultades" value={studentsAtRisk} />
      <KpiCard title="Destacados" value={topStudents} />
    </div>
  );
}
