const attendanceStatisticsRoles = new Set([
  "admin",
  "administrador",
  "administradora",
  "administrativo",
  "administrativa",
  "rector",
  "coordinadora",
  "coordinador",
]);

export function canViewAttendanceStatistics(role: unknown): boolean {
  return (
    typeof role === "string" &&
    attendanceStatisticsRoles.has(role.trim().toLocaleLowerCase("es"))
  );
}