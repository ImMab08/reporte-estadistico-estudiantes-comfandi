"use client";

import { StudentsSidebar } from "./components/students_sidebar";
import { StudentDetails } from "./components/student_details";
import { StudentsMobileView } from "./components/students_mobile_view";

import { useStudentsController } from "./hooks/use_students_controller";
import { IconQuickReference } from "@/src/shared/icons";
import Link from "next/link";

export function StudentsFeaturePage() {
  const controller = useStudentsController();

  const { snapshots} = controller;

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
    <section className="size-full bg-slate-50 p-4 flex flex-col overflow-hidden">
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
