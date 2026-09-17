import { StudentInteractiveCard } from "@/src/components/layout/student_interactive_card";
import type { useStudentsController } from "../hooks/use_students_controller";

import {
  IconCalendarMonth,
  IconChevronRight,
  IconDeleteForever,
  IconFilterAlt,
  IconGroup,
  IconRefresh,
  IconSchool,
} from "@/src/shared/icons";
import { displayStudentName } from "@/src/utils/periodic/displayStudentName";
import { CustomSelect } from "@/src/components/ui/custom_select";
import { useState } from "react";

type StudentsController = ReturnType<typeof useStudentsController>;

type Props = {
  controller: StudentsController;
};

export function StudentsSidebar({ controller }: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const {
    localSearch,
    setLocalSearch,
    snapshots,
    selectedPeriodId,
    selectedGrade,
    selectedGroup,
    gradeOptions,
    groupOptions,
    filteredStudents,
    selectedStudent,
    isGroupDisabled,
    handlePeriodChange,
    handleGradeChange,
    handleGroupChange,
    handleStudentSelect,
    clearFilters,
  } = controller;

  return (
    <aside className="flex relative">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`
          absolute
          left-0
          top-16
          -translate-x-full
          cursor-pointer

          h-14
          w-7

          bg-white
          border
          border-slate-200
          border-r-0

          rounded-l-xl

          shadow-sm

          flex
          items-center
          justify-center

          hover:w-8
          transition-all
          duration-300`}
      >
        <IconChevronRight
          className={`size-8 text-primary ${
            isCollapsed ? "rotate-180" : ""
          } transition-transform duration-300`}
        />
      </button>

      <div
        className={`
          overflow-hidden
          transition-all
          duration-300
          ease-in-out

          ${isCollapsed ? "w-0 opacity-0" : "w-75 lg:w-100 opacity-100"}
        `}
      >
        <div className="relative hidden md:flex max-w-100 w-75 lg:w-100 h-full bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex-col space-y-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-primary justify-center space-x-2">
              <IconFilterAlt className="size-6.5" />
              <h1 className="text-2xl font-bold">Filtros</h1>
            </div>

            <button
              onClick={clearFilters}
              className="rounded-xl border border-slate-200 p-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              <IconRefresh className="text-primary" />
            </button>
          </div>

          <input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-2"
            placeholder="Buscar estudiante..."
          />

          <CustomSelect
            value={selectedPeriodId}
            onChange={handlePeriodChange}
            icon={<IconCalendarMonth className="text-primary size-5" />}
            options={snapshots.map((snapshot) => ({
              value: snapshot.id,
              label: `Periodo ${snapshot.period} · ${snapshot.year}`,
            }))}
          />

          <div className="grid grid-cols-2 gap-2">
            <CustomSelect
              value={selectedGrade}
              onChange={handleGradeChange}
              icon={<IconSchool className="text-primary size-5" />}
              options={[
                {
                  value: "all",
                  label: "Grados",
                },

                ...gradeOptions.map((grade: string) => ({
                  value: grade,
                  label: `${grade}°`,
                })),
              ]}
            />

            <CustomSelect
              value={selectedGroup}
              disabled={isGroupDisabled}
              onChange={handleGroupChange}
              icon={<IconGroup className="text-primary size-5" />}
              options={[
                {
                  value: "all",
                  label: "Grupo",
                },

                ...groupOptions.map((group: string) => ({
                  value: group,
                  label: group,
                })),
              ]}
            />
          </div>

          <div className="rounded-2xl border border-slate-200 overflow-hidden max-h-175 overflow-y-auto">
            {filteredStudents.map((student) => (
              <StudentInteractiveCard
                key={student.id}
                student={student}
                onClick={() => handleStudentSelect(student.id)}
              >
                <div
                  className={`w-full text-left px-4 py-3 border-t cursor-pointer border-slate-100 transition-all duration-300 ${
                    selectedStudent?.id === student.id
                      ? "bg-primary text-white"
                      : "text-slate-700 hover:bg-slate-200 hover:text-primary"
                  }`}
                >
                  <div>
                    <p
                      className={`text-sm ${
                        selectedStudent?.id === student.id
                          ? "text-slate-300"
                          : "text-slate-500"
                      }`}
                    >
                      Curso: {student.grade}-{student.group}
                    </p>

                    {displayStudentName(student.name)}
                  </div>
                </div>
              </StudentInteractiveCard>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
