"use client";

import { ReactNode, useState } from "react";
import type { StudentRecord } from "@/src/shared/types/academic.types";
import { StudentQuickPreview } from "./student_quick_preview";

type Props = {
  student: StudentRecord;
  children: ReactNode;
  onClick?: () => void;
};

export function StudentInteractiveCard({
  student,
  children,
  onClick,
}: Props) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      <div
        onClick={onClick}
        className="cursor-pointer transition-all duration-200 hover:scale-[1.01]"
      >
        {children}
      </div>

      <div
        className={`absolute right-full top-0 z-100 mr-3 w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl transition-all duration-200 ease-out ${
          showPreview
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-95 opacity-0"
        }`}
      >
        <StudentQuickPreview student={student} />
      </div>
    </div>
  );
}