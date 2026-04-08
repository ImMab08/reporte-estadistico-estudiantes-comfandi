"use client";

import { useEffect, useState } from "react";
import { getAcademicSnapshots } from "@/src/utils/academicStorage";
import type { AcademicPeriodSnapshot } from "@/src/shared/types/academic.types";

import { useDashboardFilters } from "./hooks/useDashboardFilters";
import { usePeriodAnalytics } from "./hooks/usePeriodAnalytics";

import { DashboardSidebar } from "./components/HomeDashboardSidebar";
import { DashboardKpis } from "./components/HomeDashboardKpis";
import { PerformancePie } from "./components/PerformancePie";
import { CriticalSubjects } from "./components/CriticalSubjects";
import { CriticalGrades } from "./components/CriticalGrades";
import { TopStudents } from "./components/TopStudents";
import { RiskStudents } from "./components/RiskStudents";

export function HomeFeaturePage() {
  const [snapshots, setSnapshots] = useState<AcademicPeriodSnapshot[]>([]);

  useEffect(() => {
    const data = Object.values(getAcademicSnapshots()).sort(
      (a, b) => b.period - a.period,
    );

    setSnapshots(data);
  }, []);

  const {
    selectedId,
    setSelectedId,
    selectedGrade,
    setSelectedGrade,
    selectedGroup,
    setSelectedGroup,
    activeSnapshot,
    gradeOptions,
    groupOptions,
    filteredStudents,
  } = useDashboardFilters(snapshots);

  useEffect(() => {
    if (!selectedId && snapshots.length > 0) {
      setSelectedId(snapshots[0].id);
    }
  }, [snapshots, selectedId, setSelectedId]);

  const analytics = usePeriodAnalytics(filteredStudents);

  if (!activeSnapshot) {
    return (
      <div className="p-10 text-slate-500">
        No hay datos cargados para mostrar el informe.
      </div>
    );
  }

  return (
    <section className="size-full bg-slate-50 p-4 flex flex-col overflow-hidden">
      <header className="mb-4 border-b border-border pb-4 shrink-0">
        <h1 className="text-4xl font-bold text-primary">Informe General</h1>
        <p className="text-slate-500 mt-1 mb-1">
          Vista general del rendimiento académico por periodo
        </p>
      </header>

      <section className="gap-4 flex flex-1 min-h-0 overflow-hidden rounded-xl">
        <section className="p-4 w-full min-h-0 overflow-auto bg-white border border-border rounded-xl flex flex-col">
          <DashboardKpis
            totalStudents={analytics.kpis.totalStudents}
            studentsAtRisk={analytics.kpis.studentsAtRisk}
            topStudents={analytics.kpis.topStudents}
            criticalSubjects={analytics.kpis.criticalSubjects}
          />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            <PerformancePie data={analytics.pieData} />
            <CriticalSubjects data={analytics.criticalSubjects} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            <CriticalGrades data={analytics.criticalCourses} />
            <TopStudents data={analytics.topStudents} />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <RiskStudents data={analytics.strugglingStudents} />
          </div>
        </section>

        <DashboardSidebar
          snapshots={snapshots}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          selectedGrade={selectedGrade}
          setSelectedGrade={setSelectedGrade}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          gradeOptions={gradeOptions}
          groupOptions={groupOptions}
        />
      </section>
    </section>
  );
}