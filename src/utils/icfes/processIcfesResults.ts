import {
  IcfesLevel,
  IcfesDataset,
  IcfesStudent,
  IcfesTopStudent,
  IcfesCompetencyKey,
  IcfesGroupAnalytics,
  IcfesComparisonItem,
  IcfesGlobalAnalytics,
  IcfesCompetencyResult,
  IcfesLevelDistribution,
  IcfesScoreDistribution,
  IcfesCompetencyAnalytics,
} from "@/src/shared/types/icfes.types";

// Types
type ExcelRow = Record<string, unknown>;

// Helpers
function normalizeText(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function normalizeNumber(value: unknown): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return 0;

  return parsed;
}

function detectLevel(score: number): IcfesLevel {
  if (score >= 400) return "Superior";
  if (score >= 300) return "Alto";
  if (score >= 200) return "Medio";

  return "Bajo";
}

function average(values: number[]): number {
  if (!values.length) return 0;

  return Math.round(
    values.reduce((acc, value) => acc + value, 0) / values.length,
  );
}

// Mapper
const COLUMN_KEYS = {
  id: ["codigo", "código", "cod", "Código"],
  name: ["nombres y apellidos", "nombre", "estudiante"],
  group: ["grupo", "curso"],
  grade: ["grado"],
  globalScore: ["puntaje global", "global", "puntaje_total"],
  percentile: ["percentil"],
  lecturaCritica: ["lectura critica", "lectura_crítica"],
  matematicas: ["matematicas", "matemáticas"],
  socialesCiudadanas: ["sociales ciudadanas", "sociales"],
  cienciasNaturales: ["ciencias naturales", "naturales"],
  ingles: ["ingles", "inglés"],
  lecturaCriticaPercentile: ["PERCENTIL LEC"],
  matematicasPercentile: ["PERCENTIL MAT"],
  socialesPercentile: ["PERCENTIL SOC"],
  naturalesPercentile: ["PERCENTIL NAT"],
  inglesPercentile: ["PERCENTIL ING"],
  lecturaCriticaNivelDesempeño: ["NIVEL DE DESEMPEÑO LEC"],
  matematicasNivelDesempeño: ["NIVEL DE DESEMPEÑO MAT"],
  socialesNivelDesempeño: ["NIVEL DE DESEMPEÑO SOC"],
  naturalesNivelDesempeño: ["NIVEL DE DESEMPEÑO NAT"],
  inglesNivelDesempeño: ["NIVEL DE DESEMPEÑO ING"],
};

function getColumnValue(row: ExcelRow, possibleKeys: string[]) {
  const entries = Object.entries(row);

  for (const [key, value] of entries) {
    const normalizedKey = normalizeText(key);

    const matched = possibleKeys.some((possibleKey) =>
      normalizedKey.includes(normalizeText(possibleKey)),
    );

    if (matched) {
      return value;
    }
  }

  return undefined;
}

// Crear competencias
function createCompetencies(row: ExcelRow): IcfesCompetencyResult[] {
  const competencies: IcfesCompetencyResult[] = [
    {
      key: "lecturaCritica",
      label: "Lectura crítica",
      shortLabel: "Lectura",
      score: normalizeNumber(getColumnValue(row, COLUMN_KEYS.lecturaCritica)),
      percentile: normalizeNumber(getColumnValue(row, COLUMN_KEYS.lecturaCriticaPercentile)),
      performanceLevel: String(getColumnValue(row, COLUMN_KEYS.lecturaCriticaNivelDesempeño) ?? "",),
      maxScore: 100,
      color: "#8B5CF6",
      icon: "book",
    },

    {
      key: "matematicas",
      label: "Matemáticas",
      shortLabel: "Mate",
      score: normalizeNumber(getColumnValue(row, COLUMN_KEYS.matematicas)),
      percentile: normalizeNumber(getColumnValue(row, COLUMN_KEYS.matematicasPercentile)),
      performanceLevel: String(getColumnValue(row, COLUMN_KEYS.matematicasNivelDesempeño) ?? "",),
      maxScore: 100,
      color: "#F59E0B",
      icon: "calculator",
    },

    {
      key: "socialesCiudadanas",
      label: "Sociales y ciudadanas",
      shortLabel: "Sociales",
      score: normalizeNumber(getColumnValue(row, COLUMN_KEYS.socialesCiudadanas)),
      percentile: normalizeNumber(getColumnValue(row, COLUMN_KEYS.socialesPercentile)),
      performanceLevel: String(getColumnValue(row, COLUMN_KEYS.socialesNivelDesempeño) ?? "",),      
      maxScore: 100,
      color: "#EC4899",
      icon: "globe",
    },

    {
      key: "cienciasNaturales",
      label: "Ciencias naturales",
      shortLabel: "Naturales",
      score: normalizeNumber(getColumnValue(row, COLUMN_KEYS.cienciasNaturales)),
      percentile: normalizeNumber(getColumnValue(row, COLUMN_KEYS.naturalesPercentile)),
      performanceLevel: String(getColumnValue(row, COLUMN_KEYS.naturalesNivelDesempeño) ?? "",),
      maxScore: 100,
      color: "#10B981",
      icon: "flask",
    },

    {
      key: "ingles",
      label: "Inglés",
      shortLabel: "English",
      score: normalizeNumber(getColumnValue(row, COLUMN_KEYS.ingles)),
      percentile: normalizeNumber(getColumnValue(row, COLUMN_KEYS.inglesPercentile)),
      performanceLevel: String(getColumnValue(row, COLUMN_KEYS.inglesNivelDesempeño) ?? "",),
      maxScore: 100,
      color: "#EAB308",
      icon: "languages",
    },
  ];

  return competencies.map((competency) => ({
    ...competency,
    level: detectLevel(competency.score * 5),
  }));
}

// Crear estudiantes
function createStudents(rows: ExcelRow[], year: number): IcfesStudent[] {
  return rows.map((row) => {
    const globalScore = normalizeNumber(
      getColumnValue(row, COLUMN_KEYS.globalScore),
    );

    const competencies = createCompetencies(row);
    console.log("RAW_NAME:", getColumnValue(row, COLUMN_KEYS.name));

    const rawId = getColumnValue(row, COLUMN_KEYS.id);
    console.log("RAW_ID:", rawId);

    return {
      id: String(rawId ?? crypto.randomUUID()),
      name: String(getColumnValue(row, COLUMN_KEYS.name) ?? "Sin nombre"),
      grade: String(getColumnValue(row, COLUMN_KEYS.grade) ?? "11"),
      group: String(getColumnValue(row, COLUMN_KEYS.group) ?? "1"),

      year,
      globalScore,
      maxGlobalScore: 500,
      percentile: normalizeNumber(getColumnValue(row, COLUMN_KEYS.percentile)),
      level: detectLevel(globalScore),

      rankings: {
        institution: 0,
        group: 0,
        grade: 0,
      },

      competencies,
    };
  });
}

// Rankings
function assignRankings(students: IcfesStudent[]): IcfesStudent[] {
  const sortedInstitution = [...students].sort(
    (a, b) => b.globalScore - a.globalScore,
  );

  sortedInstitution.forEach((student, index) => {
    student.rankings.institution = index + 1;
  });

  const groups = [...new Set(students.map((s) => s.group))];

  groups.forEach((group) => {
    const groupStudents = students
      .filter((student) => student.group === group)
      .sort((a, b) => b.globalScore - a.globalScore);

    groupStudents.forEach((student, index) => {
      student.rankings.group = index + 1;
    });
  });

  return students;
}

// Estadisticas globales
function createAnalytics(students: IcfesStudent[]): IcfesGlobalAnalytics {
  const scores = students.map((student) => student.globalScore);
  const percentiles = students.map((student) => student.percentile);

  const levelDistribution: IcfesLevelDistribution = {
    bajo: students.filter((student) => student.level === "Bajo").length,
    medio: students.filter((student) => student.level === "Medio").length,
    alto: students.filter((student) => student.level === "Alto").length,
    superior: students.filter((student) => student.level === "Superior").length,
  };

  const competencyKeys: IcfesCompetencyKey[] = [
    "lecturaCritica",
    "matematicas",
    "socialesCiudadanas",
    "cienciasNaturales",
    "ingles",
  ];

  const competencyAnalytics: IcfesCompetencyAnalytics[] = competencyKeys.map(
    (key) => {
      const competencyScores = students.map((student) => {
        return (
          student.competencies.find((competency) => competency.key === key)
            ?.score ?? 0
        );
      });

      return {
        competency: key,
        average: average(competencyScores),
        highest: Math.max(...competencyScores),
        lowest: Math.min(...competencyScores),
      };
    },
  );

  return {
    totalStudents: students.length,
    institutionAverage: average(scores),
    highestScore: Math.max(...scores),
    lowestScore: Math.min(...scores),
    averagePercentile: average(percentiles),
    levelDistribution,
    competencyAnalytics,
  };
}

// Estadisticas por grupo
function createGroupAnalytics(students: IcfesStudent[]): IcfesGroupAnalytics[] {
  const groups = [...new Set(students.map((s) => s.group))];

  return groups.map((group) => {
    const groupStudents = students.filter((student) => student.group === group);
    const scores = groupStudents.map((student) => student.globalScore);
    const percentiles = groupStudents.map((student) => student.percentile);

    return {
      group,
      totalStudents: groupStudents.length,
      averageScore: average(scores),
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      averagePercentile: average(percentiles),
    };
  });
}

// Top de estudiantes
function createTopStudents(students: IcfesStudent[]): IcfesTopStudent[] {
  return [...students]
    .sort((a, b) => b.globalScore - a.globalScore)
    .slice(0, 5)
    .map((student, index) => ({
      position: index + 1,
      studentId: student.id,
      name: student.name,
      group: student.group,
      score: student.globalScore,
      percentile: student.percentile,
      level: student.level,
    }));
}

// Comparativas
function createComparisons(students: IcfesStudent[]): IcfesComparisonItem[] {
  const competencyKeys: IcfesCompetencyKey[] = [
    "lecturaCritica",
    "matematicas",
    "socialesCiudadanas",
    "cienciasNaturales",
    "ingles",
  ];

  return competencyKeys.map((key) => {
    const group11_1 = students.filter((student) => student.group === "1");
    const group11_2 = students.filter((student) => student.group === "2");

    const getAverage = (
      list: IcfesStudent[],
      competencyKey: IcfesCompetencyKey,
    ) => {
      return average(
        list.map(
          (student) =>
            student.competencies.find(
              (competency) => competency.key === competencyKey,
            )?.score ?? 0,
        ),
      );
    };

    return {
      competency: key,
      group11_1: getAverage(group11_1, key),
      group11_2: getAverage(group11_2, key),
      institution: getAverage(students, key),
    };
  });
}

// Distribucción del escore
function createScoreDistribution(
  students: IcfesStudent[],
): IcfesScoreDistribution[] {
  const ranges = [
    { label: "0 - 199", min: 0, max: 199 },
    { label: "200 - 299", min: 200, max: 299 },
    { label: "300 - 399", min: 300, max: 399 },
    { label: "400 - 500", min: 400, max: 500 },
  ];

  return ranges.map((range) => {
    const total = students.filter(
      (student) =>
        student.globalScore >= range.min && student.globalScore <= range.max,
    ).length;

    return {
      range: range.label,
      total,
      percentage: Number(((total / students.length) * 100).toFixed(1)),
    };
  });
}

// Main
export function processIcfesResults(
  rows: ExcelRow[],
  year: number,
  sourceFileName?: string,
): IcfesDataset {
  const students = assignRankings(createStudents(rows, year));

  return {
    id: `icfes-${year}`,
    year,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sourceFileName,
    totalStudents: students.length,
    students,
    analytics: createAnalytics(students),
    groupsAnalytics: createGroupAnalytics(students),
    topStudents: createTopStudents(students),
    comparisons: createComparisons(students),
    scoreDistribution: createScoreDistribution(students),
  };
}
