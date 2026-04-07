import * as xlsx from 'xlsx';
import { Student, GradeLevel, SubjectData } from '../types';

const GRADE_VALUES: Record<string, number> = {
  "Bajo": 1,
  "Básico": 3,
  "Alto": 4,
  "Superior": 5
};

const GRADE_LABELS: Record<number, GradeLevel> = {
  1: "Bajo",
  3: "Básico",
  4: "Alto",
  5: "Superior"
};

export const parseExcel = async (file: File): Promise<Student[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = xlsx.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Convert to array of arrays first to find the real header row
        const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
        
        // Find header row (the one containing "CODIGO" and "ESTUDIANTE")
        let headerRowIndex = -1;
        for(let i = 0; i < Math.min(rows.length, 10); i++) {
          const row = rows[i];
          const rowStr = row.join("|").toUpperCase();
          if(rowStr.includes("CODIGO") && rowStr.includes("ESTUDIANTE")) {
            headerRowIndex = i;
            break;
          }
        }

        if(headerRowIndex === -1) {
          throw new Error("No se encontró la fila de encabezados (buscando 'CODIGO' y 'ESTUDIANTE').");
        }

        const headers = rows[headerRowIndex].map(h => String(h || "").trim().toUpperCase());
        const dataRows = rows.slice(headerRowIndex + 1);

        const students = processRealData(headers, dataRows);
        resolve(students);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

const processRealData = (headers: string[], dataRows: any[][]): Student[] => {
  return dataRows.filter(row => row.length > 0 && row[headers.indexOf("ESTUDIANTE")]).map((row) => {
    const getVal = (key: string) => {
      const idx = headers.indexOf(key.toUpperCase());
      return idx !== -1 ? row[idx] : undefined;
    };

    const codigo = String(getVal("CODIGO") || "");
    const nombre = String(getVal("ESTUDIANTE") || "Desconocido");
    const periodo = parseInt(String(getVal("PERIODO") || 1), 10);
    const grado = String(getVal("GRADO") || "");
    const grupo = String(getVal("GRUPO") || "");
    const totalPerdidasExcel = parseInt(String(getVal("PERDIDAS") || 0), 10);

    // Subjects are between "GRUPO" and "PERDIDAS"
    const grupoIdx = headers.indexOf("GRUPO");
    const perdidasIdx = headers.indexOf("PERDIDAS");
    
    // Fallback if perdidas doesn't exist
    const endIdx = perdidasIdx !== -1 ? perdidasIdx : headers.length;
    
    const materias: SubjectData[] = [];
    let sum = 0;
    let perdidasCount = 0;

    for(let i = grupoIdx + 1; i < endIdx; i++) {
      const subjectName = headers[i];
      if(!subjectName || subjectName.startsWith("__EMPTY") || subjectName === "PERDIDAS") continue;

      const rawGrade = String(row[i] || "").trim();
      let grade: GradeLevel = "Básico";
      const normalizedGrade = rawGrade.toLowerCase();
      
      if (normalizedGrade.includes('bajo')) grade = "Bajo";
      else if (normalizedGrade.includes('sico')) grade = "Básico";
      else if (normalizedGrade.includes('alto')) grade = "Alto";
      else if (normalizedGrade.includes('superior')) grade = "Superior";
      else if (!rawGrade) continue; // Skip empty subjects

      const val = GRADE_VALUES[grade] || 3;
      if (grade === "Bajo") perdidasCount++;
      sum += val;

      materias.push({
        name: subjectName,
        grade,
        value: val
      });
    }

    const calculatedPerdidas = totalPerdidasExcel || perdidasCount;
    const promedioNumeric = materias.length > 0 ? (sum / materias.length) : 0;
    
    let estado: "Excelencia" | "Medio" | "Riesgo" = "Medio";
    if (calculatedPerdidas > 0) {
      estado = "Riesgo";
    } else {
      const isExcellence = materias.length > 0 && materias.every(m => m.grade === "Alto" || m.grade === "Superior");
      if (isExcellence) {
        estado = "Excelencia";
      }
    }

    return {
      codigo,
      nombre,
      periodo,
      grado,
      grupo,
      materias,
      cantidad_perdidas: calculatedPerdidas,
      promedio: Number(promedioNumeric.toFixed(2)),
      estado_academico: estado
    };
  });
};
