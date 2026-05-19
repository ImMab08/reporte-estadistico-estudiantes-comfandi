export function displayStudentName(fullName: string): string {
  if (!fullName) return "";

  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 1) return parts[0];

  if (parts.length === 2) {
    return `${parts[1]} ${parts[0]}`;
  }

  if (parts.length === 3) {
    return `${parts[2]} ${parts[0]} ${parts[1]}`;
  }

  const surnames = parts.slice(0, 2);
  const names = parts.slice(2);

  return `${names.join(" ")} ${surnames.join(" ")}`;
}