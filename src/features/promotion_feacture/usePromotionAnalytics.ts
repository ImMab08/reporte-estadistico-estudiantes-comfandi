import { useMemo } from "react";
import { PromotionStudent } from "./promotion.types";

export function usePromotionAnalytics(
  students: PromotionStudent[],
) {
  return useMemo(() => {
    const totalStudents = students.length;

    const promotedStudents = students.filter(
      (student) => student.promoted,
    ).length;

    const notPromotedStudents =
      totalStudents - promotedStudents;

    const promotionRate =
      totalStudents === 0
        ? 0
        : Number(
            (
              (promotedStudents /
                totalStudents) *
              100
            ).toFixed(1),
          );

    return {
      totalStudents,
      promotedStudents,
      notPromotedStudents,
      promotionRate,
    };
  }, [students]);
}