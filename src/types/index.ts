export type GradeLevel = "Bajo" | "Básico" | "Alto" | "Superior";

export interface SubjectData {
  name: string;
  grade: GradeLevel;
  value: number; // 1, 3, 4, 5
}

export interface Student {
  codigo: string;
  nombre: string;
  periodo: number;
  grado: string;
  grupo: string;
  materias: SubjectData[];
  cantidad_perdidas: number;
  promedio: number;
  estado_academico: "Excelencia" | "Medio" | "Riesgo";
}

export interface FilterOptions {
  periodo?: number;
  grado?: string;
  grupo?: string;
  materia?: string;
  estado_academico?: string;
  searchQuery?: string;
}

export type Role = "Admin" | "Docente";
