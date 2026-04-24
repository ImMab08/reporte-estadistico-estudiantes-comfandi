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
            const PREVIEW_WIDTH = 324;
            const PREVIEW_HEIGHT = 240;
            const GAP = 8;
            const VIEWPORT_PADDING = 12;

            const isMobile = window.innerWidth < 768;

            let left = 0;
            let top = 0;

            if (isMobile) {
              /**
               * MOBILE:
               * centrado horizontalmente
               */
              left = (window.innerWidth - PREVIEW_WIDTH) / 2;

              // debajo inicialmente
              top = rect.bottom + GAP;

              // si no cabe abajo, subirlo pegado al item
              if (
                top + PREVIEW_HEIGHT >
                window.innerHeight - VIEWPORT_PADDING
              ) {
                top = rect.top - PREVIEW_HEIGHT;
              }

              // límites
              if (top < VIEWPORT_PADDING) {
                top = VIEWPORT_PADDING;
              }
            } else {
              /**
               * DESKTOP:
               * izquierda
               */
              left = rect.left - PREVIEW_WIDTH - GAP;
              top = rect.top;

              const maxTop =
                window.innerHeight -
                PREVIEW_HEIGHT -
                VIEWPORT_PADDING;

              if (top > maxTop) top = maxTop;
              if (top < VIEWPORT_PADDING) top = VIEWPORT_PADDING;

              if (left < VIEWPORT_PADDING) {
                left = VIEWPORT_PADDING;
              }
            }

            return (
              <div
                className="fixed z-100 overflow-hidden rounded-xl border border-border bg-white shadow-xl"
                style={{
                  top,
                  left,
                  width: PREVIEW_WIDTH,
                  maxWidth: "calc(100vw - 24px)",
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