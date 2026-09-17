"use client";

import { useHomeController } from "./hooks/use_home_controller";

import { DashboardSidebar } from "./components/HomeDashboardSidebar";
import { DashboardKpis } from "./components/HomeDashboardKpis";
import { PerformancePie } from "./components/PerformancePie";
import { CriticalSubjects } from "./components/CriticalSubjects";
import { TopStudents } from "./components/TopStudents";
import { CriticalGrades } from "./components/CriticalGrades";
import { SubjectHealthGrid } from "./components/SubjectHealthGrid";

import { IconFilterAlt, IconQuickReference } from "@/src/shared/icons";
import Link from "next/link";

export function HomeFeaturePage() {
  const controller = useHomeController();

  const {
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

    isMobileFilterOpen,
    openMobileFilter,
    closeMobileFilter,
  } = controller;

  const performanceTitle =
    selectedGrade === "all"
      ? "Reporte general"
      : selectedGroup === "all"
        ? `Reporte: grado ${selectedGrade}°`
        : `Reporte: grado ${selectedGrade}-${selectedGroup}`;

  if (snapshots.length === 0) {
    return (
      <div className="size-full h-screen flex flex-col space-y-10 items-center justify-center">
        <div className="text-center text-slate-400">
          <IconQuickReference className="size-14 mx-auto mb-3" />
          No hay datos cargados
        </div>
        <div className="">
          <Link
            href="/settings"
            className="bg-primary px-6 py-4 text-white rounded-2xl"
          >
            Ir a configuraciónes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="size-full bg-slate-50 p-3 md:p-4 flex flex-col overflow-hidden">
      <section className="gap-4 flex flex-1 min-h-0 overflow-hidden lg:mb-0">
        <section className="w-full overflow-auto bg-white border border-border rounded-xl">
          <div className="p-3 md:p-4 sticky top-0 z-20 flex justify-between w-full bg-white py-2">
            <h2 className="text-2xl md:text-3xl text-primary font-bold">
              {performanceTitle}
            </h2>

            <div
              onClick={openMobileFilter}
              className="p-2 border border-border rounded-lg bg-slate-10 block lg:hidden"
            >
              <IconFilterAlt className="text-primary" />
            </div>
          </div>

          <div className="p-3 md:p-4">
            <DashboardKpis
              totalStudents={analytics.kpis.totalStudents}
              studentsAtRisk={analytics.kpis.studentsAtRisk}
              topStudents={analytics.kpis.topStudents}
              criticalSubjects={analytics.kpis.criticalSubjects}
            />

            <div className="grid md:grid-cols-2 gap-6 my-6">
              <PerformancePie data={analytics.pieData} />
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
          </div>
        </section>

        <DashboardSidebar
          isMobile={true}
          isOpen={isMobileFilterOpen}
          onClose={closeMobileFilter}
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
