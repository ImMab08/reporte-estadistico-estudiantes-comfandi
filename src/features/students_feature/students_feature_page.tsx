"use client";

import { StudentsSidebar } from "./components/students_sidebar";
import { StudentDetails } from "./components/student_details";

import { useStudentsController } from "./hooks/use_students_controller";
import { GlobalLoader } from "@/src/shared/global_loader";
import Image from "next/image";
import { StudentsMobileView } from "./components/students_mobile_view";

export function StudentsFeaturePage() {
  const controller = useStudentsController();

  const { isLoading, progress } = controller;

  if (isLoading) {
    return <GlobalLoader progress={progress} />;
  }

  return (
    <section className="size-full bg-slate-50 p-4 flex flex-col overflow-hidden">
      <header className="mb-4 border-b border-border py-2 md:py-3 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Estudiantes
          </h1>

          <p className="text-xs md:text-base text-slate-500">
            Consulta individual del rendimiento académico
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

      <section className="gap-4 hidden md:flex flex-1 min-h-0 overflow-hidden rounded-xl">
        <StudentDetails controller={controller} />
        <StudentsSidebar controller={controller} />
      </section>

      <section className="gap-4 flex flex-1 md:hidden min-h-0 overflow-hidden rounded-xl">
        <StudentsMobileView controller={controller} />
      </section>
    </section>
  );
}
