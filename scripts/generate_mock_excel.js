const xlsx = require('xlsx');

const subjects = [
  "FILOSOFÌA", "ECONOMIA", "CS. NATURALES", "MATEMATICAS", "T. INFORMATICA", 
  "ESPECIALIDAD", "CS. SOCIALES", "CATEDRA", "ETICA", "EMPRENDIMIENTO", 
  "RELIGION", "MUSICA", "ARTES", "EDU. FISICA", "INGLÉS", "LENGUA CASTELLANA", 
  "FISICA", "QUIMICA"
];

const grades = ["Superior", "Alto", "Básico", "Bajo"];

const generateData = () => {
  const data = [];
  
  // Title row (Row 1)
  data.push(["REPORTE DE CALIFICACIONES ACUMULADAS", "", "", "", "", ""]);
  
  // Header row (Row 2)
  const headers = ["#", "CODIGO", "ESTUDIANTE", "PERIODO", "GRADO", "GRUPO", ...subjects, "PERDIDAS"];
  data.push(headers);
  
  // Student rows
  for (let i = 1; i <= 20; i++) {
    const studentGrades = subjects.map(() => grades[Math.floor(Math.random() * grades.length)]);
    const perdidas = studentGrades.filter(g => g === "Bajo").length;
    
    data.push([
      i,
      (1000 + i).toString(),
      `ESTUDIANTE EJEMPLO ${i}`,
      2,
      i < 10 ? "6°" : "7°",
      i % 2 === 0 ? "A" : "B",
      ...studentGrades,
      perdidas
    ]);
  }
  
  return data;
};

const ws = xlsx.utils.aoa_to_sheet(generateData());
const wb = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(wb, ws, "Hoja1");

xlsx.writeFile(wb, "mock_formato_real_comfandi.xlsx");
console.log("Archivo 'mock_formato_real_comfandi.xlsx' generado con éxito siguiendo el formato del colegio.");
