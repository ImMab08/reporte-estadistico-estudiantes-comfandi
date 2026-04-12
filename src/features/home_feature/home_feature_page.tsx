"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getAcademicSnapshots } from "@/src/utils/academicStorage";

import { useDashboardFilters } from "./hooks/useDashboardFilters";
import { usePeriodAnalytics } from "./hooks/usePeriodAnalytics";

import { TopStudents } from "./components/TopStudents";
import { RiskStudents } from "./components/RiskStudents";
import { CriticalGrades } from "./components/CriticalGrades";
import { PerformancePie } from "./components/PerformancePie";
import { DashboardKpis } from "./components/HomeDashboardKpis";
import { CriticalSubjects } from "./components/CriticalSubjects";
import { DashboardSidebar } from "./components/HomeDashboardSidebar";

import { IconQuickReference } from "@/src/shared/icons";
import { useFilterUrlState } from "@/src/shared/hooks/use_filter_url_state";
import type { AcademicPeriodSnapshot } from "@/src/shared/types/academic.types";
import { SubjectHealthGrid } from "./components/SubjectHealthGrid";

export function HomeFeaturePage() {
  const { state, updateState } = useFilterUrlState();
  const [snapshots, setSnapshots] = useState<AcademicPeriodSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = Object.values(getAcademicSnapshots()).sort(
      (a, b) => b.period - a.period,
    );

    setSnapshots(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!state.period && snapshots.length > 0) {
      const defaultPeriod = snapshots[0].id;

      updateState({
        period: defaultPeriod,
        grade: "all",
        group: "all",
        student: "",
      });
    }
  }, [snapshots, state.period, updateState]);

  const { activeSnapshot, gradeOptions, groupOptions, filteredStudents } =
    useDashboardFilters({
      snapshots,
      selectedPeriodId: state.period,
      selectedGrade: state.grade,
      selectedGroup: state.group,
      selectedStudentId: state.student,
    });

  const analytics = usePeriodAnalytics(filteredStudents);

  const performanceTitle =
    state.grade === "all"
      ? "Rendimiento general"
      : state.grade === "all"
        ? `Rendimiento general, grado: ${state.grade}°`
        : `Rendimiento general, grado: ${state.grade}°-${state.group}`;

  const clearFilters = () => {
    updateState({
      period: state.period,
      grade: "all",
      group: "all",
      student: "",
    });
  };

  const subjectHealthMetrics = useMemo(() => {
    const subjectMap: Record<
      string,
      {
        total: number;
        superior: number;
        alto: number;
        basico: number;
        bajo: number;
      }
    > = {};

    filteredStudents.forEach((student) => {
      Object.entries(student.grades).forEach(([subject, level]) => {
        const normalizedLevel = String(level)
          .trim()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();

        if (
          !normalizedLevel ||
          normalizedLevel === "n/a" ||
          normalizedLevel === "na"
        ) {
          return;
        }

        if (!subjectMap[subject]) {
          subjectMap[subject] = {
            total: 0,
            superior: 0,
            alto: 0,
            basico: 0,
            bajo: 0,
          };
        }

        subjectMap[subject].total++;

        if (normalizedLevel === "superior") subjectMap[subject].superior++;
        if (normalizedLevel === "alto") subjectMap[subject].alto++;
        if (normalizedLevel === "basico") subjectMap[subject].basico++;
        if (normalizedLevel === "bajo") subjectMap[subject].bajo++;
      });
    });

    return Object.entries(subjectMap)
      .map(([subject, stats]) => ({
        subject,
        superior: Math.round((stats.superior / stats.total) * 100),
        alto: Math.round((stats.alto / stats.total) * 100),
        basico: Math.round((stats.basico / stats.total) * 100),
        bajo: Math.round((stats.bajo / stats.total) * 100),
      }))
      .filter(
        (item) =>
          item.superior > 0 ||
          item.alto > 0 ||
          item.basico > 0 ||
          item.bajo > 0,
      );
  }, [filteredStudents]);

  if (isLoading) {
    return (
      <div className="size-full bg-slate-50 p-4 flex items-center justify-center">
        <p className="text-slate-400 text-lg">Cargando estudiantes...</p>
      </div>
    );
  }
  if (!activeSnapshot) {
    return (
      <div className="size-full bg-slate-50 p-4 flex flex-col overflow-hidden">
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
          <div className="text-3xl mb-4 text-primary font-bold">
            <p className="">{performanceTitle}</p>
          </div>
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
            <TopStudents data={analytics.topStudents} />
            <RiskStudents data={analytics.strugglingStudents} />
          </div>

          <div className=" mb-6">
            <CriticalGrades data={analytics.criticalCourses} />
          </div>

          <div>
            <SubjectHealthGrid
              data={subjectHealthMetrics}
              students={filteredStudents}
            />
          </div>
        </section>

        <DashboardSidebar
          snapshots={snapshots}
          selectedId={state.period}
          setSelectedId={(value) =>
            updateState({
              period: value,
              grade: "all",
              group: "all",
              student: "",
            })
          }
          selectedGrade={state.grade}
          setSelectedGrade={(value) =>
            updateState({
              grade: value,
              group: "all",
              student: "",
            })
          }
          selectedGroup={state.group}
          setSelectedGroup={(value) =>
            updateState({
              group: value,
              student: "",
            })
          }
          gradeOptions={gradeOptions}
          groupOptions={groupOptions}
          clearFilters={clearFilters}
        />
      </section>
    </section>
  );
}
