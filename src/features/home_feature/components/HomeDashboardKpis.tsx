import { IconGroup, IconSchool, IconWorkspacePremium } from "@/src/shared/icons";

type DashboardKpisProps = {
  totalStudents: number;
  studentsAtRisk: number;
  topStudents: number;
  criticalSubjects: number;
};

function KpiCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm min-h-30 flex flex-col justify-center">
      <div className="flex items-center  space-x-1">
        <Icon className="size-5 text-primary" />
        <p className="text-sm text-slate-500">{title}</p>
      </div>
      <p className="text-4xl font-bold text-primary mt-2">{value}</p>
    </div>
  );
}

export function DashboardKpis({
  totalStudents,
  studentsAtRisk,
  topStudents,
  // criticalSubjects,
}: DashboardKpisProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <KpiCard icon={IconGroup} title="Total de estudiantes" value={totalStudents} />
      {/* <KpiCard icon={IconGroup} title="Materias críticas" value={criticalSubjects} /> */}
      <KpiCard icon={IconSchool} title="Estudiantes con dificultades" value={studentsAtRisk} />
      <KpiCard icon={IconWorkspacePremium} title="Estudiantes destacados" value={topStudents} />
    </div>
  );
}
