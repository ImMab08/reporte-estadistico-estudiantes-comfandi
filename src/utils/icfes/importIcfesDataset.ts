import { parseIcfesExcel } from "./parseIcfesExcel"; 
import { processIcfesResults } from "./processIcfesResults";
import { saveIcfesDataset } from "./icfesStorage";

export async function importIcfesDataset(file: File) {
  const rows = await parseIcfesExcel(file);
  const year = detectYearFromFileName(file.name);
  const dataset = processIcfesResults(rows, year, file.name);

  saveIcfesDataset(dataset);

  return dataset;
}

// Helper
function detectYearFromFileName(fileName: string): number {
  const matchedYear = fileName.match(/20\d{2}/);

  if (matchedYear) {
    return Number(matchedYear[0]);
  }

  return new Date().getFullYear();
}
