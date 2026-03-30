const KEY = "grades_data";

export function saveGradeData(newGrade: any) {
  const existing = getGrades();

  const updated = [...existing, newGrade];

  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function getGrades() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

export function clearGrades() {
  localStorage.removeItem(KEY);
}
