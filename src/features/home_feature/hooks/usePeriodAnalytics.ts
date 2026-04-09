import { useMemo } from "react";
import type { StudentRecord } from "@/src/shared/types/academic.types";

type RankedSubject = {
  subject: string;
  count: number;
};

type RankedCourse = {
  label: string;
  count: number;
};

type RankedStudent = {
  id: string;
  name: string;
  grade: string;
  group: string;
  lowCount: number;
  highCount: number;
};

function normalizeLevel(value: unknown) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function countStudentLevels(student: StudentRecord) {
  let low = 0;
  let high = 0;
  let superior = 0;
  let basic = 0;

  Object.values(student.grades).forEach((value) => {
    const v = normalizeLevel(value);

    if (v.includes("bajo")) low++;
    else if (v.includes("basico")) basic++;
    else if (v.includes("alto")) high++;
    else if (v.includes("superior")) superior++;
  });

  return {
    low,
    basic,
    high,
    superior,
  };
}

export function usePeriodAnalytics(students: StudentRecord[]) {
  const analytics = useMemo(() => {
    const levels = {
      Bajo: 0,
      Básico: 0,
      Alto: 0,
      Superior: 0,
    };

    const subjectRiskMap: Record<string, number> = {};
    const courseRiskMap: Record<string, number> = {};

    const topStudents: RankedStudent[] = [];
    const strugglingStudents: RankedStudent[] = [];

    students.forEach((student) => {
      const counts = countStudentLevels(student);

      levels.Bajo += counts.low;
      levels.Básico += counts.basic;
      levels.Alto += counts.high;
      levels.Superior += counts.superior;

      // ranking por materias con bajo
      Object.entries(student.grades).forEach(([subject, value]) => {
        const v = normalizeLevel(value);

        if (v.includes("bajo")) {
          subjectRiskMap[subject] = (subjectRiskMap[subject] || 0) + 1;
        }
      });

      // ranking por grado + curso
      if (counts.low > 0) {
        const label = `${student.grade}°-${student.group}`;
        courseRiskMap[label] = (courseRiskMap[label] || 0) + 1;
      }

      const studentData: RankedStudent = {
        id: student.id,
        name: student.name,
        grade: student.grade,
        group: student.group,
        lowCount: counts.low,
        highCount: counts.superior,
        // highCount: counts.superior + counts.high,
      };

      // destacados
      if (counts.low === 0 && counts.high + counts.superior >= 3) {
        topStudents.push(studentData);
      }

      // dificultades
      if (counts.low >= 2) {
        strugglingStudents.push(studentData);
      }
    });

    const pieData = Object.entries(levels).map(([name, value]) => ({
      name,
      value,
    }));

    const criticalSubjects: RankedSubject[] = Object.entries(subjectRiskMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([subject, count]) => ({
        subject,
        count,
      }));

    const criticalCourses: RankedCourse[] = Object.entries(courseRiskMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, count]) => ({
        label,
        count,
      }));

    const sortedTopStudents = topStudents
      .sort((a, b) => b.highCount - a.highCount)
      .slice(0, 5);

    const sortedStrugglingStudents = strugglingStudents
      .sort((a, b) => b.lowCount - a.lowCount)
      .slice(0, 5);

    return {
      kpis: {
        totalStudents: students.length,
        studentsAtRisk: strugglingStudents.length,
        topStudents: sortedTopStudents.length,
        criticalSubjects: criticalSubjects.length,
      },
      pieData,
      criticalSubjects,
      criticalCourses,
      topStudents: sortedTopStudents,
      strugglingStudents: sortedStrugglingStudents,
    };
  }, [students]);

  return analytics;
}