export function getStudentPhotoPath(
  grade: string,
  group: string,
  studentName: string,
) {
  const normalized = studentName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

  return `/students/${grade}-${group}/${normalized}.jpg`;
}