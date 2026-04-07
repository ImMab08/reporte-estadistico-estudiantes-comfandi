import {
  AcademicPeriodSnapshot,
  StudentRecord,
} from "@/src/shared/types/academic.types";

type ProcessParams = {
  data: Record<string, any>[];
  fileName: string;
  year: number;
  period: number;
};

export function processAcademicPeriod({
  data,
  fileName,
  year,
  period,
}: ProcessParams): AcademicPeriodSnapshot {
  if (!data.length) {
    throw new Error("El archivo no contiene datos");
  }

  const columns = Object.keys(data[0]);

  const idColumn =
    columns.find((c) => c.toLowerCase().includes("codigo")) ?? "";

  const nameColumn =
    columns.find((c) => c.toLowerCase().includes("estudiante")) ?? "";

  const periodColumn =
    columns.find((c) => c.toLowerCase().includes("periodo")) ?? "";

  const gradeColumn =
    columns.find((c) => c.toLowerCase().includes("grado")) ?? "";

  const groupColumn =
    columns.find((c) => c.toLowerCase().includes("grupo")) ?? "";

  const structuralColumns = [
    idColumn,
    nameColumn,
    periodColumn,
    gradeColumn,
    groupColumn,
  ].filter(Boolean);

  // 📚 materias reales (excluye vacíos y columnas estructurales)
  const subjects = columns.filter(
    (col) =>
      !structuralColumns.includes(col) &&
      !col.startsWith("_EMPTY"),
  );

  const students: StudentRecord[] = data.map((row, index) => {
    const grades: Record<string, string | number> = {};

    subjects.forEach((subject) => {
      grades[subject] = row[subject] ?? "";
    });

    const studentId = String(row[idColumn] || "").trim();
    const name = String(row[nameColumn] || "").trim();
    const grade = String(row[gradeColumn] || "").trim();
    const group = String(row[groupColumn] || "").trim();

    return {
      id: studentId || `${grade}-${group}-${index}`,
      name: name || "Sin nombre",
      grade,
      group,
      grades,
    };
  });

  const indexes = {
    byGrade: {} as Record<string, number[]>,
    byGroup: {} as Record<string, number[]>,
  };

  students.forEach((student, index) => {
    if (student.grade) {
      if (!indexes.byGrade[student.grade]) {
        indexes.byGrade[student.grade] = [];
      }

      indexes.byGrade[student.grade].push(index);
    }

    if (student.group) {
      const key = `${student.grade}-${student.group}`;

      if (!indexes.byGroup[key]) {
        indexes.byGroup[key] = [];
      }

      indexes.byGroup[key].push(index);
    }
  });

  const snapshot: AcademicPeriodSnapshot = {
    id: `${year}-P${period}`,
    year,
    period,
    uploadedAt: new Date().toISOString(),
    sourceFileName: fileName,
    students,
    subjects,
    indexes,
    stats: {
      totalStudents: students.length,
      totalGrades: Object.keys(indexes.byGrade).length,
      totalGroups: Object.keys(indexes.byGroup).length,
    },
  };

  return snapshot;
}