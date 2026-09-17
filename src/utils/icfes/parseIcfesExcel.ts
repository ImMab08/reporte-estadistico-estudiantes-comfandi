import * as XLSX from "xlsx";

export async function parseIcfesExcel(file: File): Promise<any[]> {
  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer, {
    type: "array",
  });

  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

  const data = XLSX.utils.sheet_to_json(firstSheet, {
    defval: "",
  });

  return data;
}
