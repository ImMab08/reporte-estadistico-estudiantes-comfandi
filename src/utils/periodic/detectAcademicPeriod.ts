export function detectAcademicPeriod(fileName: string): number {
  const normalized = fileName.toUpperCase();

  if (normalized.includes("PRIMER")) return 1;
  if (normalized.includes("SEGUNDO")) return 2;
  if (normalized.includes("TERCER")) return 3;

  throw new Error(
    "No se pudo detectar el periodo académico desde el nombre del archivo",
  );
}