import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  IconCalendarToday,
  IconFilterAlt,
  IconRefresh,
} from "@/src/shared/icons";
import AttendanceStatisticsCharts from "@/src/features/attendance_statistics_feature/attendance_statistics_charts";
import prisma from "@/src/lib/prisma";
import {
  canViewAttendanceStatistics,
} from "@/src/lib/attendance_statistics_access";
import { verifySessionToken } from "@/src/lib/session";

type SearchParams = {
  from?: string | string[];
  to?: string | string[];
  grade?: string | string[];
  group?: string | string[];
};

type Props = {
  searchParams: Promise<SearchParams>;
};

function isDateValue(value: string | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function monthStart(value: string) {
  return new Date(`${value.slice(0, 7)}-01T00:00:00.000Z`);
}

function buildMonthlyTrend(
  records: {
    date: Date;
    totalStudents: number | null;
    boysPresent: number;
    girlsPresent: number;
  }[],
  from: string,
  to: string,
) {
  const values = new Map<
    string,
    { present: number; absent: number; hasKnownTotal: boolean }
  >();

  for (const record of records) {
    const key = record.date.toISOString().slice(0, 7);
    const current =
      values.get(key) ?? { present: 0, absent: 0, hasKnownTotal: false };
    const present = record.boysPresent + record.girlsPresent;

    current.present += present;
    if (record.totalStudents !== null) {
      current.absent += Math.max(record.totalStudents - present, 0);
      current.hasKnownTotal = true;
    }
    values.set(key, current);
  }

  const months: { month: string; present: number; absent: number | null }[] = [];
  const cursor = monthStart(from);
  const finalMonth = monthStart(to);

  while (cursor <= finalMonth) {
    const key = cursor.toISOString().slice(0, 7);
    const counts =
      values.get(key) ?? { present: 0, absent: 0, hasKnownTotal: false };

    months.push({
      month: cursor.toLocaleDateString("es-CO", {
        month: "short",
        year: "2-digit",
        timeZone: "UTC",
      }),
      present: counts.present,
      absent: counts.hasKnownTotal ? counts.absent : null,
    });
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }

  return months;
}

export default async function AttendanceStatisticsPage({
  searchParams,
}: Props) {
  const user = verifySessionToken((await cookies()).get("session")?.value);
  if (!canViewAttendanceStatistics(user?.role)) redirect("/");

  const params = await searchParams;
  const today = new Date().toISOString().slice(0, 10);
  const activeYear = await prisma.academicYear.findFirst({
    where: { active: true },
    orderBy: { year: "desc" },
    select: { year: true },
  });
  const defaultFrom = `${activeYear?.year ?? new Date().getFullYear()}-01-01`;
  const requestedFrom = typeof params.from === "string" ? params.from : undefined;
  const requestedTo = typeof params.to === "string" ? params.to : undefined;
  const from = isDateValue(requestedFrom) ? requestedFrom : defaultFrom;
  const to = isDateValue(requestedTo) ? requestedTo : today;
  const [rangeFrom, rangeTo] = from <= to ? [from, to] : [to, from];

  const [groups, gradeLevels] = await Promise.all([
    prisma.group.findMany({
      select: {
        id: true,
        name: true,
        number: true,
        academicYear: { select: { year: true } },
        gradeLevel: { select: { id: true, name: true } },
      },
      orderBy: [
        { academicYear: { year: "desc" } },
        { gradeLevel: { name: "asc" } },
        { number: "asc" },
      ],
    }),
    prisma.gradeLevel.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const selectedGrade =
    typeof params.grade === "string" &&
      gradeLevels.some((grade) => grade.id === params.grade)
      ? params.grade
      : "";
  const selectedGroup =
    typeof params.group === "string" &&
      groups.some(
        (group) =>
          group.id === params.group &&
          (!selectedGrade || group.gradeLevel.id === selectedGrade),
      )
      ? params.group
      : "";

  const records = await prisma.attendance.findMany({
    where: {
      date: {
        gte: new Date(`${rangeFrom}T00:00:00.000Z`),
        lte: new Date(`${rangeTo}T00:00:00.000Z`),
      },
      group: {
        ...(selectedGrade ? { gradeLevelId: selectedGrade } : {}),
        ...(selectedGroup ? { id: selectedGroup } : {}),
      },
    },
    select: {
      id: true,
      date: true,
      totalStudents: true,
      boysPresent: true,
      girlsPresent: true,
      createdAt: true,
      group: {
        select: {
          name: true,
          number: true,
          academicYear: { select: { year: true } },
          gradeLevel: { select: { id: true, name: true } },
        },
      },
      registeredBy: { select: { fullName: true } },
    },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  });

  const totalStudents = records.reduce(
    (sum, record) => sum + (record.totalStudents ?? 0),
    0,
  );
  const totalPresent = records.reduce(
    (sum, record) => sum + record.boysPresent + record.girlsPresent,
    0,
  );
  const knownRecordsPresent = records.reduce(
    (sum, record) =>
      sum +
      (record.totalStudents === null
        ? 0
        : record.boysPresent + record.girlsPresent),
    0,
  );
  const totalAbsent = records.reduce(
    (sum, record) =>
      sum +
      Math.max(
        (record.totalStudents ?? 0) - record.boysPresent - record.girlsPresent,
        0,
      ),
    0,
  );
  const attendanceRate = totalStudents
    ? (knownRecordsPresent / totalStudents) * 100
    : 0;
  const gradeStats = new Map<
    string,
    { grade: string; total: number; present: number }
  >();

  for (const record of records) {
    if (record.totalStudents === null) continue;

    const current = gradeStats.get(record.group.gradeLevel.id) ?? {
      grade: record.group.gradeLevel.name,
      total: 0,
      present: 0,
    };

    current.total += record.totalStudents;
    current.present += record.boysPresent + record.girlsPresent;
    gradeStats.set(record.group.gradeLevel.id, current);
  }

  const gradeChartData = Array.from(gradeStats.values())
    .filter((item) => item.total > 0)
    .map((item) => ({
      grade: item.grade,
      attendanceRate: Number(((item.present / item.total) * 100).toFixed(1)),
    }))
    .sort((first, second) => first.grade.localeCompare(second.grade, "es"));

  return (
    <section className="size-full bg-slate-50 p-3 md:p-4 flex flex-col overflow-hidden">
      <section className="gap-4 flex flex-1 min-h-0 overflow-hidden lg:mb-0">
        <section className="w-full overflow-auto bg-white border border-border rounded-xl">
          <header className="-3 md:p-4 sticky top-0 z-20 flex justify-between w-full bg-white py-2">
            <div>
              <h1 className="text-2xl font-bold text-text-main sm:text-3xl">
                Estadísticas de asistencia
              </h1>
              <p className="mt-1 text-sm text-text-muted">
                Seguimiento de asistencia por período, grado y grupo.
              </p>
            </div>
          </header>

          <div className="p-3 md:p-4">
            <form
              action="/statistics"
              className="mb-6 rounded-xl border border-border bg-card-bg p-4 shadow-sm sm:p-5"
            >
              <div className="mb-4 flex items-center gap-2 text-sm font-bold text-text-main">
                <IconFilterAlt className="size-5 text-primary" />
                Filtros
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <label className="space-y-1 text-xs font-semibold text-text-muted">
                  Desde
                  <input
                    type="date"
                    name="from"
                    defaultValue={rangeFrom}
                    className="h-10 w-full rounded-lg border border-border bg-card-bg px-3 text-sm text-text-main outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </label>
                <label className="space-y-1 text-xs font-semibold text-text-muted">
                  Hasta
                  <input
                    type="date"
                    name="to"
                    defaultValue={rangeTo}
                    className="h-10 w-full rounded-lg border border-border bg-card-bg px-3 text-sm text-text-main outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </label>
                <label className="space-y-1 text-xs font-semibold text-text-muted">
                  Grado
                  <select
                    name="grade"
                    defaultValue={selectedGrade}
                    className="h-10 w-full rounded-lg border border-border bg-card-bg px-3 text-sm text-text-main outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  >
                    <option value="">Todos los grados</option>
                    {gradeLevels.map((grade) => (
                      <option key={grade.id} value={grade.id}>
                        {grade.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1 text-xs font-semibold text-text-muted">
                  Grupo
                  <select
                    name="group"
                    defaultValue={selectedGroup}
                    className="h-10 w-full rounded-lg border border-border bg-card-bg px-3 text-sm text-text-main outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  >
                    <option value="">Todos los grupos</option>
                    {groups
                      .filter(
                        (group) =>
                          !selectedGrade || group.gradeLevel.id === selectedGrade,
                      )
                      .map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.gradeLevel.name} · Grupo {group.number} · {group.academicYear.year}
                        </option>
                      ))}
                  </select>
                </label>
                <div className="flex items-end gap-2">
                  <button
                    type="submit"
                    className="h-10 flex-1 rounded-lg bg-primary px-4 text-sm font-bold text-white transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    Aplicar filtros
                  </button>
                  <a
                    href="/statistics"
                    aria-label="Limpiar filtros"
                    title="Limpiar filtros"
                    className="flex size-10 items-center justify-center rounded-lg border border-border text-primary transition hover:bg-background"
                  >
                    <IconRefresh className="size-5" />
                  </a>
                </div>
              </div>
            </form>

            <section
              aria-label="Resumen de asistencia"
              className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
            >
              <SummaryItem label="Registros" value={records.length} accent="primary" />
              <SummaryItem
                label="Cupos reportados"
                value={totalStudents}
                accent="secondary"
                description="Suma de matrícula por registro"
              />
              <SummaryItem label="Asistencias" value={totalPresent} accent="superior" />
              <SummaryItem label="Faltas estimadas" value={totalAbsent} accent="bajo" />
              <SummaryItem
                label="Tasa de asistencia"
                value={`${attendanceRate.toFixed(1)}%`}
                accent="basico"
              />
            </section>

            <section className="mb-6 grid gap-4 lg:grid-cols-2">
              <div className="min-w-0 rounded-xl border border-border bg-card-bg p-4 shadow-sm sm:p-5">
                <h2 className="mb-4 font-bold text-text-main">Tendencia mensual</h2>
                <AttendanceStatisticsCharts
                  monthlyData={buildMonthlyTrend(records, rangeFrom, rangeTo)}
                  gradeData={[]}
                  chart="monthly"
                />
              </div>
              <div className="min-w-0 rounded-xl border border-border bg-card-bg p-4 shadow-sm sm:p-5">
                <h2 className="mb-4 font-bold text-text-main">Asistencia por grado</h2>
                <AttendanceStatisticsCharts
                  monthlyData={[]}
                  gradeData={gradeChartData}
                  chart="grade"
                />
              </div>
            </section>

            <section className="overflow-hidden rounded-xl border border-border bg-card-bg shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-4 sm:px-5">
                <div>
                  <h2 className="font-bold text-text-main">Registros recientes</h2>
                  <p className="text-xs text-text-muted">
                    {records.length} registros en el período seleccionado
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-background text-xs uppercase text-text-muted">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Fecha asistencia</th>
                      <th className="px-4 py-3 font-semibold">Hora de registro</th>
                      <th className="px-4 py-3 font-semibold">Grado / grupo</th>
                      <th className="px-4 py-3 font-semibold">Responsable</th>
                      <th className="px-4 py-3 text-right font-semibold">Matrícula</th>
                      <th className="px-4 py-3 text-right font-semibold">Presentes</th>
                      <th className="px-4 py-3 text-right font-semibold">Faltantes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {records.slice(0, 15).map((record) => {
                      const present = record.boysPresent + record.girlsPresent;
                      const absent =
                        record.totalStudents === null
                          ? null
                          : Math.max(record.totalStudents - present, 0);

                      return (
                        <tr key={record.id} className="text-text-main">
                          <td className="whitespace-nowrap px-4 py-3">
                            {record.date.toLocaleDateString("es-CO", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              timeZone: "UTC",
                            })}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-text-muted">
                            {record.createdAt.toLocaleString("es-CO", {
                              dateStyle: "short",
                              timeStyle: "short",
                              timeZone: "America/Bogota",
                            })}
                          </td>
                          <td className="px-4 py-3">
                            {record.group.gradeLevel.name} · Grupo {record.group.number}
                            <span className="ml-2 text-xs text-text-muted">
                              {record.group.academicYear.year}
                            </span>
                          </td>
                          <td className="px-4 py-3">{record.registeredBy.fullName}</td>
                          <td className="px-4 py-3 text-right">
                            {record.totalStudents ?? "Sin dato"}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-primary">
                            {present}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-bajo">
                            {absent ?? "—"}
                          </td>
                        </tr>
                      );
                    })}
                    {records.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-12 text-center text-sm text-text-muted"
                        >
                          No hay registros de asistencia para los filtros seleccionados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>



        </section>
      </section>
    </section>

  );
}

function SummaryItem({
  label,
  value,
  accent,
  description,
}: {
  label: string;
  value: number | string;
  accent: "primary" | "secondary" | "superior" | "bajo" | "basico";
  description?: string;
}) {
  const accentClasses = {
    primary: "border-t-primary text-primary",
    secondary: "border-t-secondary text-secondary",
    superior: "border-t-superior text-superior",
    bajo: "border-t-bajo text-bajo",
    basico: "border-t-basico text-text-main",
  };

  return (
    <div className={`rounded-xl border border-border border-t-4 bg-card-bg p-4 shadow-sm ${accentClasses[accent]}`}>
      <p className="text-xs font-semibold text-text-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
      {description && (
        <p className="mt-1 text-[11px] font-medium text-text-muted">
          {description}
        </p>
      )}
    </div>
  );
}