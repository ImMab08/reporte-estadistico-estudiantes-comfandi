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
import { IconQuickReference } from "@/src/shared/icons";
import Image from "next/image";

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

  const performanceTitle =
    selectedGrade === "all"
      ? "Rendimiento general por periodo"
      : selectedGroup === "all"
        ? `Rendimiento general, grado: ${selectedGrade}°`
        : `Rendimiento general, grado: ${selectedGrade}°-${selectedGroup}`;

  if (!activeSnapshot) {
    return (
      <div className="size-full bg-slate-50 p-4 flex flex-col overflow-hidden">
        <header className="mb-4 border-b border-border py-3.25 shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary">Inicio</h1>
            <p className="text-slate-500 mt-1 mb-1">
              Reporte estadistico de estudiantes
            </p>
          </div>

          <div className="flex justify-center">
            <Image
              alt=""
              width={150}
              height={150}
              className="object-contain"
              src="/img/logo/logo_comfandi_blue.svg"
            />
          </div>
        </header>

        <div className="bg-white flex-1 overflow-auto rounded-xl border border-border p-4 text-center text-gray-400 flex flex-col items-center justify-center space-y-2">
          <IconQuickReference className="size-14" />
          <p className="text-lg">No hay datos cargados.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="size-full bg-slate-50 p-4 flex flex-col overflow-hidden">
      <header className="mb-4 border-b border-border py-3.25 shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary">Inicio</h1>
          <p className="text-slate-500 mt-1 mb-1">
            Vista general del rendimiento academico
          </p>
        </div>

        <div className="flex justify-center">
          <Image
            alt=""
            width={150}
            height={150}
            className="object-contain"
            src="/img/logo/logo_comfandi_blue.svg"
          />
        </div>
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
            <PerformancePie data={analytics.pieData} title={performanceTitle} />
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
