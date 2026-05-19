// type icfes
export type IcfesLevel = "Bajo" | "Medio" | "Alto" | "Superior";

// competencias
export type IcfesCompetencyKey =
  | "lecturaCritica"
  | "matematicas"
  | "socialesCiudadanas"
  | "cienciasNaturales"
  | "ingles"
  | "comunicacionEscrita"
  | "razonamientoCuantitativo"
  | "competenciasCiudadanas"
  | "gestionOrganizaciones"
  | "formulacionEvaluacionGestionProyectos"
  | "gestionFinanciera";

export type IcfesCompetencyResult = {
  key: IcfesCompetencyKey;
  label: string;
  shortLabel?: string;
  score: number;
  maxScore: number;
  percentile?: number;
  level?: IcfesLevel;
  performanceLevel?: string | number;
  color?: string;
  icon?: string;
};

// ranking
export type IcfesRanking = {
  institution: number;
  // grade: number;
  group: number;
};

// estudiante
export type IcfesStudent = {
  id: string;
  name: string;
  photo?: string;
  grade: string;
  group: string;
  year: number;
  institution?: string;
  globalScore: number;
  maxGlobalScore: number;
  averageScore?: number;
  percentile: number;
  level?: IcfesLevel;
  rankings: IcfesRanking;
  competencies: IcfesCompetencyResult[];
  observations?: string;
};

// Analiticas
export type IcfesLevelDistribution = {
  bajo: number;
  medio: number;
  alto: number;
  superior: number;
};

export type IcfesCompetencyAnalytics = {
  competency: string;
  average: number;
  highest: number;
  lowest: number;
  institutionalPercentile?: number;
};

export type IcfesGlobalAnalytics = {
  totalStudents: number;
  institutionAverage: number;
  highestScore: number;
  lowestScore: number;
  averagePercentile: number;
  levelDistribution: IcfesLevelDistribution;
  competencyAnalytics: IcfesCompetencyAnalytics[];
};

// Analisis estadistico por grupo
export type IcfesGroupAnalytics = {
  group: string;
  totalStudents: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  averagePercentile: number;
};

// Top estudiantes
export type IcfesTopStudent = {
  position: number;
  studentId: string;
  name: string;
  group: string;
  score: number;
  percentile: number;
  level?: IcfesLevel;
};

// Comparativos
export type IcfesComparisonItem = {
  competency: string;
  group11_1: number;
  group11_2: number;
  institution: number;
};

// Distribuccción de puntajes
export type IcfesScoreDistribution = {
  range: string;
  total: number;
  percentage: number;
};

// Dataset
export type IcfesDataset = {
  id: string;
  year: number;
  createdAt: string;
  updatedAt: string;
  sourceFileName?: string;
  totalStudents: number;
  students: IcfesStudent[];
  analytics: IcfesGlobalAnalytics;
  groupsAnalytics: IcfesGroupAnalytics[];
  topStudents: IcfesTopStudent[];
  comparisons: IcfesComparisonItem[];
  scoreDistribution: IcfesScoreDistribution[];
};
