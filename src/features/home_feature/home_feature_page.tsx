"use client";

import Image from "next/image";

import { useHomeController } from "./hooks/use_home_controller";

import { DashboardSidebar } from "./components/HomeDashboardSidebar";
import { DashboardKpis } from "./components/HomeDashboardKpis";
import { PerformancePie } from "./components/PerformancePie";
import { CriticalSubjects } from "./components/CriticalSubjects";
import { TopStudents } from "./components/TopStudents";
import { CriticalGrades } from "./components/CriticalGrades";
import { SubjectHealthGrid } from "./components/SubjectHealthGrid";

import { IconQuickReference } from "@/src/shared/icons";
import { GlobalLoader } from "@/src/shared/global_loader";

export function HomeFeaturePage() {
  const controller = useHomeController();

  const {
    isLoading,
    progress,
    activeSnapshot,

    snapshots,
    selectedPeriodId,
    selectedGrade,
    selectedGroup,

    handlePeriodChange,
    handleGradeChange,
    handleGroupChange,
    clearFilters,

    gradeOptions,
    groupOptions,
    filteredStudents,

    analytics,
    subjectHealthMetrics,
  } = controller;

  const performanceTitle =
    selectedGrade === "all"
      ? "Reporte general"
      : selectedGroup === "all"
        ? `Reporte: grado ${selectedGrade}°`
        : `Reporte: grado ${selectedGrade}-${selectedGroup}`;

  if (isLoading) {
    return <GlobalLoader progress={progress} />;
  }

  if (!activeSnapshot) {
    return (
      <div className="size-full flex items-center justify-center">
        <div className="text-center text-slate-400">
          <IconQuickReference className="size-14 mx-auto mb-3" />
          No hay datos cargados
        </div>
      </div>
    );
  }

  return (
    <section className="size-full bg-slate-50 p-3 md:p-4 flex flex-col overflow-hidden  ">
      <header className="mb-4 border-b border-border py-2 md:py-3 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Inicio
          </h1>

          <p className="text-xs md:text-base text-slate-500">
            Vista general del rendimiento académico
          </p>
        </div>

        <div className="w-24 h-12 relative">
          <Image
            src="/img/logo/logo_comfandi_blue.svg"
            alt="Comfandi"
            fill
            className="object-contain"
            priority
          />
        </div>
      </header>

      <section className="gap-4 flex flex-1 min-h-0 overflow-hidden md:mb-0">
        <section className="p-3 md:p-4 w-full overflow-auto bg-white border border-border rounded-xl">
          <h2 className="text-3xl mb-4 text-primary font-bold">
            {performanceTitle}
          </h2>

          <DashboardKpis
            totalStudents={analytics.kpis.totalStudents}
            studentsAtRisk={analytics.kpis.studentsAtRisk}
            topStudents={analytics.kpis.topStudents}
            criticalSubjects={analytics.kpis.criticalSubjects}
          />

          <div className="grid xl:grid-cols-2 gap-6 my-6">
            <PerformancePie data={analytics.pieData} title={performanceTitle} />
            <TopStudents data={analytics.topStudents} />
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
            <CriticalSubjects data={analytics.criticalSubjects} />
            <CriticalGrades data={analytics.criticalCourses} />
          </div>

          <SubjectHealthGrid
            data={subjectHealthMetrics}
            students={filteredStudents}
          />
        </section>

        <DashboardSidebar
          snapshots={snapshots}
          selectedId={selectedPeriodId}
          selectedGrade={selectedGrade}
          selectedGroup={selectedGroup}
          setSelectedId={handlePeriodChange}
          setSelectedGrade={handleGradeChange}
          setSelectedGroup={handleGroupChange}
          gradeOptions={gradeOptions}
          groupOptions={groupOptions}
          clearFilters={clearFilters}
        />
      </section>
    </section>
  );
}
