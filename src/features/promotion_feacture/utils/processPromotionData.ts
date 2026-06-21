import { PromotionSnapshot, PromotionStudent } from "../promotion.types";

type Params = {
  data: Record<string, unknown>[];
  fileName: string;
};

export function processPromotionData({
  data,
  fileName,
}: Params): PromotionSnapshot {
  const students: PromotionStudent[] = data.map((row, index) => {
    const grade = String(row["GRADO"] ?? "");
    const group = String(row["GRUPO"] ?? "");

    const failedSubjects = Number(row["PERDIDAS"] ?? 0);

    const promoted = isPromoted(Number(grade), failedSubjects);

    const grades: Record<string, string> = {};

    const failedAreas: string[] = [];

    Object.entries(row).forEach(([key, value]) => {
      const stringValue = String(value);

      grades[key] = stringValue;

      const normalizedSubject = key.trim().toUpperCase();

      const blockedSubjects = [
        "#",
        "CODIGO",
        "ESTUDIANTE",
        "PERIODO",
        "GRADO",
        "GRUPO",
        "PERDIDAS",
        "__EMPTY",
      ];

      if (blockedSubjects.includes(normalizedSubject)) {
        return;
      }

      const normalizedValue = stringValue
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

      if (normalizedValue === "bajo") {
        failedAreas.push(key);
      }
    });

    return {
      id: String(row["CODIGO"]) || `student-${index}`,

      name: String(row["ESTUDIANTE"] ?? ""),

      grade,
      group,

      failedSubjects,

      failedAreas,

      promoted,

      grades,
    };
  });

  const promotedStudents = students.filter(
    (student) => student.promoted,
  ).length;

  const totalStudents = students.length;
  const gradeMetrics = buildGradeMetrics(students);
  const failedSubjectsMetrics = buildFailedSubjects(students);
  const lossDistribution = buildLossDistribution(students);

  const notPromotedStudentsList = students
    .filter((student) => !student.promoted)
    .sort((a, b) => b.failedSubjects - a.failedSubjects);

  const promotedWithLossList = students
    .filter((student) => student.promoted && student.failedSubjects > 0)
    .sort((a, b) => b.failedSubjects - a.failedSubjects);

  return {
    uploadedAt: new Date().toISOString(),
    sourceFileName: fileName,
    students,

    analytics: {
      totalStudents,
      promotedStudents,
      notPromotedStudents: totalStudents - promotedStudents,

      promotionRate:
        totalStudents === 0
          ? 0
          : Number(((promotedStudents / totalStudents) * 100).toFixed(1)),
      gradeMetrics,
      failedSubjects: failedSubjectsMetrics,
      lossDistribution,

      notPromotedStudentsList,
      promotedWithLossList,
    },
  };
}

function isPromoted(grade: number, failedSubjects: number) {
  const strictGrades = [3, 5, 7, 9, 10, 11];

  if (strictGrades.includes(grade)) {
    return failedSubjects === 0;
  }

  return failedSubjects <= 1;
}

function buildGradeMetrics(students: PromotionStudent[]) {
  const gradeMap: Record<
    string,
    {
      promoted: number;
      notPromoted: number;
    }
  > = {};

  students.forEach((student) => {
    if (!gradeMap[student.grade]) {
      gradeMap[student.grade] = {
        promoted: 0,
        notPromoted: 0,
      };
    }

    if (student.promoted) {
      gradeMap[student.grade].promoted++;
    } else {
      gradeMap[student.grade].notPromoted++;
    }
  });

  return Object.entries(gradeMap)
    .map(([grade, stats]) => {
      const total = stats.promoted + stats.notPromoted;

      return {
        grade,
        promoted: stats.promoted,
        notPromoted: stats.notPromoted,
        rate: total === 0 ? 0 : Math.round((stats.promoted / total) * 100),
      };
    })
    .sort((a, b) => Number(b.grade) - Number(a.grade));
}

function buildFailedSubjects(students: PromotionStudent[]) {
  const subjectMap: Record<string, number> = {};

  students.forEach((student) => {
    Object.entries(student.grades).forEach(([subject, value]) => {
      const normalizedSubject = subject.trim().toUpperCase();

      const blockedSubjects = [
        "#",
        "CODIGO",
        "ESTUDIANTE",
        "PERIODO",
        "GRADO",
        "GRUPO",
        "PERDIDAS",
        "__EMPTY",
      ];

      if (blockedSubjects.includes(normalizedSubject)) {
        return;
      }

      const normalizedValue = value
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

      if (normalizedValue !== "bajo") {
        return;
      }

      if (!subjectMap[subject]) {
        subjectMap[subject] = 0;
      }

      subjectMap[subject]++;
    });
  });

  const totalStudents = students.length;

  return Object.entries(subjectMap)
    .map(([subject, failedStudents]) => ({
      subject,

      failedStudents,

      percentage:
        totalStudents === 0
          ? 0
          : Number(((failedStudents / totalStudents) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.failedStudents - a.failedStudents);
}

function buildLossDistribution(students: PromotionStudent[]) {
  const distribution = {
    zero: 0,
    one: 0,
    two: 0,
    threePlus: 0,
  };

  students.forEach((student) => {
    const losses = student.failedSubjects;

    if (losses === 0) {
      distribution.zero++;
    } else if (losses === 1) {
      distribution.one++;
    } else if (losses === 2) {
      distribution.two++;
    } else {
      distribution.threePlus++;
    }
  });

  return [
    {
      label: "0 pérdidas",
      count: distribution.zero,
    },
    {
      label: "1 pérdida",
      count: distribution.one,
    },
    {
      label: "2 pérdidas",
      count: distribution.two,
    },
    {
      label: "3+ pérdidas",
      count: distribution.threePlus,
    },
  ];
}

export type { PromotionSnapshot };
