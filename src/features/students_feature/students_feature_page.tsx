"use client";

import { StudentsSidebar } from "./components/students_sidebar";
import { StudentDetails } from "./components/student_details";

import { useStudentsController } from "./hooks/use_students_controller";

export function StudentsFeaturePage() {
  const controller = useStudentsController();

  return (
    <section className="size-full bg-slate-50 p-4 flex flex-col overflow-hidden">

      <header className="mb-4 border-b border-border py-3 shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary">
            Estudiantes
          </h1>

          <p className="text-slate-500 mt-1 mb-1">
            Consulta individual del rendimiento académico
          </p>
        </div>
      </header>

      <section className="gap-4 flex flex-1 min-h-0 overflow-hidden rounded-xl">

        <StudentDetails controller={controller} />
        <StudentsSidebar controller={controller} />

      </section>

    </section>
  );
}