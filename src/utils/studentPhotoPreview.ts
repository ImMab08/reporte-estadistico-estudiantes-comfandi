import type { StudentRecord } from "@/src/shared/types/academic.types";

export function normalizePhotoName(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function getStudentPhotoPath(student: StudentRecord) {
  const folder = `Yumbo ${student.grade}-${student.group}`;
  const fileName = `${normalizePhotoName(student.name)}.jpg`;

  return `/img/fotos_estudiantes_yumbo_2026/${folder}/${fileName}`;
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function isVisibleSubject(subject: string, value: unknown) {
  if (value === null || value === undefined) return false;

  const subjectName = String(subject).trim().toUpperCase();
  const text = String(value).trim().toUpperCase();

  const excludedFields = ["#", "PERDIDAS", "PÉRDIDAS"];

  if (excludedFields.includes(subjectName)) return false;

  if (!text) return false;
  if (["#", "-", "N/A", "NA", "NO APLICA"].includes(text)) return false;

  return true;
}

export function classifyStudent(student: StudentRecord) {
  const levels = {
    bajo: 0,
    basico: 0,
    alto: 0,
    superior: 0,
  };

  if (!student?.grades || typeof student.grades !== "object") {
    return levels;
  }

  Object.entries(student.grades).forEach(([subject, value]) => {
    if (!isVisibleSubject(subject, value)) return;

    const v = normalizeText(String(value));

    if (v.includes("bajo")) levels.bajo++;
    else if (v.includes("basico")) levels.basico++;
    else if (v.includes("alto")) levels.alto++;
    else if (v.includes("superior")) levels.superior++;
  });

  return levels;
}