"use client";

import { createPortal } from "react-dom";
import { ReactNode, useRef, useState } from "react";

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
          (() => {
            const PREVIEW_WIDTH = 320;
            const PREVIEW_HEIGHT = 240;
            const GAP = 12;
            const VIEWPORT_PADDING = 16;

            // Izquierda
            let left = rect.left - PREVIEW_WIDTH - GAP;

            // Alineado verticalmente con el estudiante
            let top = rect.top;

            // Solo ajustar si se sale abajo
            const maxTop =
              window.innerHeight -
              PREVIEW_HEIGHT -
              VIEWPORT_PADDING;

            if (top > maxTop) {
              top = maxTop;
            }

            // Si se sale arriba
            if (top < VIEWPORT_PADDING) {
              top = VIEWPORT_PADDING;
            }

            // Fallback si no cabe izquierda
            if (left < VIEWPORT_PADDING) {
              left = VIEWPORT_PADDING;
            }

            return (
              <div
                className="fixed z-100 overflow-hidden rounded-xl border border-border bg-white shadow-xl"
                style={{
                  top,
                  left,
                  width: PREVIEW_WIDTH,
                }}
              >
                <StudentQuickPreview student={student} />
              </div>
            );
          })(),
          document.body
        )}
    </div>
  );
}