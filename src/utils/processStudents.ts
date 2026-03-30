export function processStudents(data: any[]) {
  const columns = Object.keys(data[0] || {});

  const subjects = columns.filter(
    (c) =>
      c !== "Estudiante" &&
      c !== "Causas" &&
      c !== "Recomendaciones" &&
      c !== "Perd.",
  );

  const students = data.map((row) => {
    const grades: Record<string, string> = {};

    subjects.forEach((sub) => {
      grades[sub] = (row[sub] || "").toString().trim();
    });

    return {
      name: row["Estudiante"] || "Sin nombre",
      grades,
      causas: row["Causas"] || "",
      recomendaciones: row["Recomendaciones"] || "",
    };
  });

  return {
    students,
    subjects,
  };
}
