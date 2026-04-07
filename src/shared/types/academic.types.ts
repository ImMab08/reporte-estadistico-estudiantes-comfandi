export type StudentRecord = {
  id: string;
  name: string;
  grade: string;
  group: string;
  grades: Record<string, string | number>;
  observaciones?: string;
};

export type AcademicPeriodSnapshot = {
  id: string; // 2026-P2
  year: number;
  period: number;
  uploadedAt: string;
  sourceFileName: string;

  students: StudentRecord[];
  subjects: string[];

  indexes: {
    byGrade: Record<string, number[]>;
    byGroup: Record<string, number[]>;
  };

  stats: {
    totalStudents: number;
    totalGrades: number;
    totalGroups: number;
  };
};