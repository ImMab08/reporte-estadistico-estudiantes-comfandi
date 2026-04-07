"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { getAcademicSnapshots } from "@/src/utils/academicStorage";
import type {
  AcademicPeriodSnapshot,
  StudentRecord,
} from "@/src/shared/types/academic.types";

const COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"];

function countLevels(students: StudentRecord[]) {
  const stats = { Bajo: 0, Basico: 0, Alto: 0, Superior: 0 };

  students.forEach((student) => {
    Object.values(student.grades).forEach((value) => {
      const v = String(value).toLowerCase();

      if (v.includes("baj")) stats.Bajo++;
      else if (v.includes("bas")) stats.Basico++;
      else if (v.includes("alt")) stats.Alto++;
      else if (v.includes("sup")) stats.Superior++;
    });
  });

  return stats;
}

function riskCount(students: StudentRecord[]) {
  return students.filter((student) =>
    Object.values(student.grades).some((v) =>
      String(v).toLowerCase().includes("baj"),
    ),
  ).length;
}

function topCriticalSubjects(students: StudentRecord[]) {
  const map: Record<string, number> = {};

  students.forEach((student) => {
    Object.entries(student.grades).forEach(([subject, value]) => {
      if (String(value).toLowerCase().includes("baj")) {
        map[subject] = (map[subject] || 0) + 1;
      }
    });
  });

  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([subject, count]) => ({ subject, count }));
}

function topCriticalGrades(students: StudentRecord[]) {
  const map: Record<string, number> = {};

  students.forEach((student) => {
    const hasRisk = Object.values(student.grades).some((v) =>
      String(v).toLowerCase().includes("baj"),
    );

    if (hasRisk) {
      map[student.grade] = (map[student.grade] || 0) + 1;
    }
  });

  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([grade, count]) => ({ grade, count }));
}

export function HomeFeaturePage() {
  const [snapshots, setSnapshots] = useState<AcademicPeriodSnapshot[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [compareId, setCompareId] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedGroup, setSelectedGroup] = useState("all");

  useEffect(() => {
    const data = Object.values(getAcademicSnapshots()).sort(
      (a, b) => a.period - b.period,
    );

    setSnapshots(data);

    if (data.length) {
      const latest = data[data.length - 1];
      setSelectedId(latest.id);

      if (data.length > 1) {
        setCompareId(data[data.length - 2].id);
      }
    }
  }, []);

  const activeSnapshot = useMemo(
    () => snapshots.find((s) => s.id === selectedId) ?? null,
    [snapshots, selectedId],
  );

  const compareSnapshot = useMemo(
    () => snapshots.find((s) => s.id === compareId) ?? null,
    [snapshots, compareId],
  );

  const gradeOptions = useMemo(() => {
    if (!activeSnapshot) return [];

    return [...new Set(activeSnapshot.students.map((s) => s.grade))].sort(
      (a, b) => Number(a) - Number(b),
    );
  }, [activeSnapshot]);

  const groupOptions = useMemo(() => {
    if (!activeSnapshot) return [];

    const groups = activeSnapshot.students
      .filter((s) =>
        selectedGrade === "all" ? true : s.grade === selectedGrade,
      )
      .map((s) => s.group);

    return [...new Set(groups)].sort((a, b) => Number(a) - Number(b));
  }, [activeSnapshot, selectedGrade]);

  const filteredStudents = useMemo(() => {
    if (!activeSnapshot) return [];

    return activeSnapshot.students.filter((student) => {
      const gradeMatch =
        selectedGrade === "all" || student.grade === selectedGrade;

      const groupMatch =
        selectedGroup === "all" || student.group === selectedGroup;

      return gradeMatch && groupMatch;
    });
  }, [activeSnapshot, selectedGrade, selectedGroup]);

  const pieData = useMemo(() => {
    const levels = countLevels(filteredStudents);

    return Object.entries(levels).map(([name, value]) => ({
      name,
      value,
    }));
  }, [filteredStudents]);

  const comparison = useMemo(() => {
    if (!compareSnapshot) return null;

    const current = riskCount(filteredStudents);

    const previousStudents = compareSnapshot.students.filter((student) => {
      const gradeMatch =
        selectedGrade === "all" || student.grade === selectedGrade;

      const groupMatch =
        selectedGroup === "all" || student.group === selectedGroup;

      return gradeMatch && groupMatch;
    });

    const previous = riskCount(previousStudents);

    const delta =
      previous === 0 ? 0 : ((previous - current) / previous) * 100;

    return {
      current,
      improvement: delta.toFixed(1),
    };
  }, [
    filteredStudents,
    compareSnapshot,
    selectedGrade,
    selectedGroup,
  ]);

  const trendData = useMemo(() => {
    return snapshots.map((snapshot) => {
      const students = snapshot.students.filter((student) => {
        const gradeMatch =
          selectedGrade === "all" || student.grade === selectedGrade;

        const groupMatch =
          selectedGroup === "all" || student.group === selectedGroup;

        return gradeMatch && groupMatch;
      });

      return {
        period: `P${snapshot.period}`,
        riesgo: riskCount(students),
        promedio: students.length,
      };
    });
  }, [snapshots, selectedGrade, selectedGroup]);

  const criticalSubjects = useMemo(
    () => topCriticalSubjects(filteredStudents),
    [filteredStudents],
  );

  const criticalGrades = useMemo(
    () => topCriticalGrades(filteredStudents),
    [filteredStudents],
  );

  if (!activeSnapshot) {
    return <div className="p-10">No hay datos cargados.</div>;
  }

  return (
    <section className="p-6 bg-slate-50 min-h-screen">
      <header className="mb-6 border-b border-slate-200 pb-4">
        <h1 className="text-4xl font-bold text-primary">Informe General</h1>
        <p className="text-slate-500">
          Vista general del rendimiento académico
        </p>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 p-4 grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6 shadow-sm">
        <select
          className="rounded-2xl border p-4"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {snapshots.map((s) => (
            <option key={s.id} value={s.id}>
              Periodo {s.period} · Año {s.year}
            </option>
          ))}
        </select>

        <select
          className="rounded-2xl border p-4"
          value={compareId}
          onChange={(e) => setCompareId(e.target.value)}
        >
          <option value="">Sin comparación</option>
          {snapshots
            .filter((s) => s.id !== selectedId)
            .map((s) => (
              <option key={s.id} value={s.id}>
                Periodo {s.period}
              </option>
            ))}
        </select>

        <select
          className="rounded-2xl border p-4"
          value={selectedGrade}
          onChange={(e) => {
            setSelectedGrade(e.target.value);
            setSelectedGroup("all");
          }}
        >
          <option value="all">Todos los grados</option>
          {gradeOptions.map((grade) => (
            <option key={grade} value={grade}>
              {grade}°
            </option>
          ))}
        </select>

        <select
          className="rounded-2xl border p-4"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option value="all">Todos los grupos</option>
          {groupOptions.map((group) => (
            <option key={group} value={group}>
              Grupo {group}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Estudiantes" value={filteredStudents.length} />
        <KpiCard title="Materias" value={activeSnapshot.subjects.length} />
        <KpiCard title="Estudiantes en riesgo" value={comparison?.current ?? 0} />
        <KpiCard
          title="Índice de recuperación"
          value={`${comparison?.improvement ?? 0}%`}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <Panel title="Rendimiento General">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={70} outerRadius={120}>
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Comparativa entre Periodos">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="riesgo" stroke="#ef4444" strokeWidth={3} />
              <Line type="monotone" dataKey="promedio" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Panel title="Alertas Académicas">
          <div className="space-y-3">
            {filteredStudents.slice(0, 3).map((student) => (
              <div key={student.id} className="flex justify-between rounded-2xl border p-3 bg-slate-50">
                <span>{student.name}</span>
                <span className="text-red-500">Riesgo</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Materias más Críticas">
          <div className="space-y-3">
            {criticalSubjects.map((item, index) => (
              <div key={item.subject} className="flex justify-between rounded-2xl border p-3 bg-slate-50">
                <span>{index + 1}. {item.subject}</span>
                <span>{item.count}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Grados más Críticos">
          <div className="space-y-3">
            {criticalGrades.map((item, index) => (
              <div key={item.grade} className="flex justify-between rounded-2xl border p-3 bg-slate-50">
                <span>{index + 1}. {item.grade}°</span>
                <span>{item.count}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </section>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-2xl font-bold mb-4 text-slate-800">{title}</h3>
      {children}
    </div>
  );
}

function KpiCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm min-h-[120px] flex flex-col justify-center">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-4xl font-bold text-primary mt-2">{value}</p>
    </div>
  );
}