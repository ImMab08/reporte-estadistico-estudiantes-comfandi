import { StudentInteractiveCard } from "@/src/components/layout/student_interactive_card";
import type { useStudentsController } from "../hooks/use_students_controller";

import { IconChevronRight, IconRefresh, IconSearch } from "@/src/shared/icons";
import { displayStudentName } from "@/src/utils/displayStudentName";
import Image from "next/image";
import { getStudentPhotoPath } from "@/src/utils/studentPhotoPreview";
import { StudentAvatar } from "./student_avatar";

type StudentsController = ReturnType<typeof useStudentsController>;

type Props = {
  controller: StudentsController;
};

export function StudentsMobileView({ controller }: Props) {
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
    clearFilters,
  } = controller;

  return (
    <section className="space-y-2">
      <div className="max-w-100 w-145 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col space-y-2">
        <div className="flex space-x-2">
          <div className="flex items-center space-x-2 w-full rounded-xl border border-slate-200 px-4 py-2">
            <IconSearch className="text-slate-400" />
            <input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full border-0 outline-none focus:ring-0 appearance-none"
              placeholder="Buscar estudiante..."
            />
          </div>
          <button
            onClick={clearFilters}
            className="rounded-xl border border-slate-200 p-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            <IconRefresh className="text-primary" />
          </button>
        </div>

        <div className="w-full">
          <select
            value={selectedPeriodId}
            onChange={(e) => handlePeriodChange(e.target.value)}
            className="rounded-xl w-full border border-slate-200 p-2 cursor-pointer"
          >
            {snapshots.map((snapshot) => (
              <option key={snapshot.id} value={snapshot.id}>
                Periodo {snapshot.period} · {snapshot.year}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <select
            value={selectedGrade}
            onChange={(e) => handleGradeChange(e.target.value)}
            className="rounded-xl border border-slate-200 p-2 cursor-pointer"
          >
            <option value="all">Grados</option>

            {gradeOptions.map((grade: string) => (
              <option key={grade} value={grade}>
                {grade}°
              </option>
            ))}
          </select>

          <select
            value={selectedGroup}
            disabled={isGroupDisabled}
            onChange={(e) => handleGroupChange(e.target.value)}
            className="rounded-xl border border-slate-200 p-2 cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
          >
            <option value="all">Grupo</option>

            {groupOptions.map((group: string) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="realtive rounded-xloverflow-hidden max-h-175 overflow-y-auto space-y-2">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className={`relative w-full px-4 py-3 bg-white rounded-2xl border border-border cursor-pointer transition-all duration-300 ${
              selectedStudent?.id === student.id
                ? "bg-primary text-white"
                : "text-primary font-semibold hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex space-x-2">
                <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border border-slate-200">
                  <StudentAvatar
                    name={student.name}
                    photo={getStudentPhotoPath(student)}
                  />
                </div>

                <div>
                  <p className="font-bold">
                    {displayStudentName(student.name)}
                  </p>

                  <p
                    className={`text-sm ${
                      selectedStudent?.id === student.id
                        ? "text-slate-200"
                        : "text-slate-500"
                    }`}
                  >
                    Curso: {student.grade}-{student.group}
                  </p>
                </div>
              </div>

              <IconChevronRight />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
