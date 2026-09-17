"use client";

import { createPortal } from "react-dom";
import { ReactNode, useMemo, useRef, useState } from "react";

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

  /**
   * Solo dispositivos que soportan hover real
   * (mouse / trackpad)
   */
  const canHover = useMemo(() => {
    if (typeof window === "undefined") return false;

    return window.matchMedia("(hover: hover)").matches;
  }, []);

  const handleMouseEnter = () => {
    if (!canHover) return;

    if (cardRef.current) {
      setRect(cardRef.current.getBoundingClientRect());
    }

    setShowPreview(true);
  };

  const handleMouseLeave = () => {
    setShowPreview(false);
  };

  return (
    <div
      ref={cardRef}
      className="relative w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        onClick={onClick}
        className="cursor-pointer transition-all duration-200 hover:scale-[1.01]"
      >
        {children}
      </div>

      {canHover &&
        showPreview &&
        rect &&
        createPortal(
          (() => {
            const PREVIEW_WIDTH = 324;
            const PREVIEW_HEIGHT = 240;
            const GAP = 8;
            const VIEWPORT_PADDING = 12;

            let left = rect.left - PREVIEW_WIDTH - GAP;
            let top = rect.top;

            const maxTop =
              window.innerHeight -
              PREVIEW_HEIGHT -
              VIEWPORT_PADDING;

            if (top > maxTop) top = maxTop;
            if (top < VIEWPORT_PADDING) top = VIEWPORT_PADDING;

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