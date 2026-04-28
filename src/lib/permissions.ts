import { User } from "@/src/lib/user";

export function canAccessGrade(user: User | null, grado: number): boolean {
  if (!user) return false;

  // Acceso total por rol
  if (
    user.role === "coordinadora" ||
    user.role === "rector" ||
    user.role === "psicologa"
  ) {
    return true;
  }

  // Si tiene "todas"
  if (user.niveles.includes("todos")) {
    return true;
  }

  // Primaria
  if (user.niveles.includes("primaria") && grado >= 1 && grado <= 5) {
    return true;
  }

  // Secundaria
  if (user.niveles.includes("secundaria") && grado >= 6 && grado <= 11) {
    return true;
  }

  // Consejo
  if (user.niveles.includes("consejo")) {
    return true;
  }

  return false;
}