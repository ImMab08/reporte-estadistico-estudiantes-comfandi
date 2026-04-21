import { StudentInteractiveCard } from "@/src/components/layout/student_interactive_card";
import type { useStudentsController } from "../hooks/use_students_controller";

import { IconRefresh } from "@/src/shared/icons";

type StudentsController = ReturnType<
  typeof useStudentsController
>;

type Props = {
  controller: StudentsController;
};

export function StudentsSidebar({ controller }: Props) {
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
    <aside className="max-w-100 w-145 h-full bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-primary">
          Filtros
        </h1>

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

      <div className="w-full">
        <select
          value={selectedPeriodId}
          onChange={(e) =>
            handlePeriodChange(e.target.value)
          }
          className="rounded-xl w-full border border-slate-200 p-2 cursor-pointer"
        >
          {snapshots.map((snapshot) => (
            <option
              key={snapshot.id}
              value={snapshot.id}
            >
              Periodo {snapshot.period} ·{" "}
              {snapshot.year}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <select
          value={selectedGrade}
          onChange={(e) =>
            handleGradeChange(e.target.value)
          }
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
          onChange={(e) =>
            handleGroupChange(e.target.value)
          }
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

      <div className="rounded-2xl border border-slate-200 overflow-hidden max-h-175 overflow-y-auto">
        {filteredStudents.map((student) => (
          <StudentInteractiveCard
            key={student.id}
            student={student}
            onClick={() =>
              handleStudentSelect(student.id)
            }
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
                    selectedStudent?.id ===
                    student.id
                      ? "text-slate-300"
                      : "text-slate-500"
                  }`}
                >
                  Curso: {student.grade}-
                  {student.group}
                </p>

                {student.name}
              </div>
            </div>
          </StudentInteractiveCard>
        ))}
      </div>
    </aside>
  );
}