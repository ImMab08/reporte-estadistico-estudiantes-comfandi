"use client";

import { createPortal } from "react-dom";
import { ReactNode, useRef, useState } from "react";
import { usePathname } from "next/navigation";

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
  const [rect, setRect] = useState<DOMRect | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isStudents = pathname === "/students";

  const handleMouseEnter = () => {
    if (cardRef.current) {
      setRect(cardRef.current.getBoundingClientRect());
    }
    setShowPreview(true);
  };

  return (
    <div
      ref={cardRef}
      className="relative w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShowPreview(false)}
    >
      <div
        onClick={onClick}
        className="cursor-pointer transition-all duration-200 hover:scale-[1.01]"
      >
        {children}
      </div>

      {showPreview &&
        rect &&
        createPortal(
          <div
            className={`fixed z-10 overflow-hidden border border-border bg-white shadow-xl ${
              isStudents
                ? "rounded-xl rounded-tr-none"
                : "rounded-xl"
            }`}
            style={{
              top: isStudents ? rect.top : rect.bottom + 11,
              left: isStudents ? rect.left - 320 : rect.left,
            }}
          >
            <StudentQuickPreview student={student} />
          </div>,
          document.body
        )}
    </div>
  );
}