export type LevelKey =
  | "Superior"
  | "Alto"
  | "Básico"
  | "Bajo";

export type ComparisonChartItem = {
  level: LevelKey;
  [key: string]: string | number;
};